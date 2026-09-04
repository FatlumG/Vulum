/**
 * Stripe Webhook Handler
 *
 * Processes incoming Stripe webhook events for the Vulum marketplace.
 * Handles:
 * - checkout.session.completed (order payments)
 * - payment_intent.succeeded / payment_intent.payment_failed
 * - charge.refunded
 * - customer.subscription.created/updated/deleted
 * - invoice.payment_succeeded / invoice.payment_failed
 * - account.updated (Connect account status)
 *
 * All processing is idempotent via webhook_events table.
 * Uses the existing V2 error classes and Drizzle ORM.
 */

import stripe from '../../config/stripe';
import { db } from '../../db/client';
import {
  orders,
  orderItems,
  products,
  invoices,
  sales,
  users,
  subscriptions,
  plans,
  stripeConnectAccounts,
} from '../../db/schema';
import { eq, and, inArray } from 'drizzle-orm';
import Stripe from 'stripe';
import { calculateCommission, toCents, centsToString } from './stripe.commission';
import {
  claimWebhookEvent,
  markEventProcessed,
  markEventFailed,
  markEventIgnored,
  updateConnectAccount,
} from './stripe.service';

/**
 * Allowed event types — only process events we care about.
 * Everything else is logged and ignored.
 */
const ALLOWED_EVENTS = new Set([
  // Order payments
  'checkout.session.completed',
  'payment_intent.succeeded',
  'payment_intent.payment_failed',

  // Refunds
  'charge.refunded',
  'charge.dispute.created',

  // Subscriptions
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',

  // Subscription invoices
  'invoice.payment_succeeded',
  'invoice.payment_failed',

  // Connect
  'account.updated',
]);

/**
 * Process a Stripe webhook event.
 *
 * This is the main entry point called by the webhook route handler.
 * It performs:
 * 1. Signature verification (done in route handler)
 * 2. Idempotency check (has this event been seen?)
 * 3. Record the event
 * 4. Process the event
 * 5. Mark as processed/failed
 *
 * @param event - Verified Stripe event object
 */
export async function handleWebhookEvent(event: Stripe.Event): Promise<void> {
  const stripeEventId = event.id;
  const eventType = event.type;

  // 1. Atomically claim the event — this is the SOLE idempotency gate.
  //    If another concurrent delivery already claimed it, we get false and skip.
  const claimed = await claimWebhookEvent(stripeEventId, eventType, event.data.object as unknown);
  if (!claimed) {
    console.log(`Webhook event ${stripeEventId} already claimed by another delivery, skipping`);
    return;
  }

  // 2. Check if it's an event we handle
  if (!ALLOWED_EVENTS.has(eventType)) {
    console.log(`Ignoring webhook event: ${eventType}`);
    await markEventIgnored(stripeEventId);
    return;
  }

  // 4. Process the event
  try {
    console.log(`Processing webhook event: ${eventType} (${stripeEventId})`);

    switch (eventType) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case 'charge.refunded':
        await handleChargeRefunded(event.data.object as Stripe.Charge);
        break;

      case 'charge.dispute.created':
        await handleChargeDispute(event.data.object as Stripe.Dispute);
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case 'account.updated':
        await handleAccountUpdated(event.data.object as Stripe.Account);
        break;

      default:
        console.log(`No handler for event type: ${eventType}`);
    }

    // 5. Mark as processed
    await markEventProcessed(stripeEventId);
    console.log(`Successfully processed webhook: ${eventType}`);
  } catch (error: any) {
    console.error(`Error processing webhook ${eventType}:`, error.message);
    await markEventFailed(stripeEventId, error.message);
    // Don't rethrow — we already sent 200 to Stripe
  }
}

// ============================================================
// Event Handlers
// ============================================================

/**
 * Handle checkout.session.completed
 *
 * This is the PRIMARY payment handler. When a customer completes checkout:
 * 1. Find the order from metadata
 * 2. Mark order as 'paid'
 * 3. Update invoice with Stripe IDs
 * 4. Decrement product stock
 * 5. Create sale record with full financial breakdown
 * 6. Update order with financial details
 */
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session): Promise<void> {
  const metadata = session.metadata;
  if (!metadata) {
    console.warn('checkout.session.completed missing metadata:', session.id);
    return;
  }

  const orderId = metadata.orderId ? parseInt(metadata.orderId) : null;
  const userId = metadata.userId ? parseInt(metadata.userId) : null;

  if (!orderId) {
    console.warn('checkout.session.completed missing orderId:', metadata);
    return;
  }

  // Fetch the order
  const orderResult = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1);

  const order = orderResult[0];
  if (!order) {
    console.warn('Order not found for checkout session:', orderId);
    return;
  }

  // Don't process if already paid (idempotent)
  if (order.status === 'paid') {
    console.log('Order already paid:', orderId);
    return;
  }

  // Fetch order items to get product IDs
  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, orderId));

  const productIds = items.map((item) => item.productId);

  // Fetch products
  const foundProducts = await db
    .select()
    .from(products)
    .where(inArray(products.id, productIds));

  // Calculate total gross amount
  let totalGrossCents = 0;
  for (const item of items) {
    const product = foundProducts.find((p) => p.id === item.productId);
    if (product) {
      totalGrossCents += toCents(product.price) * item.quantity;
    }
  }

  // Determine the seller (from the first product's createdBy)
  const firstProduct = foundProducts[0];
  const sellerId = firstProduct?.createdBy || null;

  // Calculate commission
  let platformFeeCents = 0;
  let netAmountCents = totalGrossCents;
  let commissionRate = 0;

  if (sellerId) {
    const breakdown = await calculateCommission(totalGrossCents, sellerId);
    platformFeeCents = breakdown.platformFeeCents;
    netAmountCents = breakdown.netAmountCents;
    commissionRate = breakdown.commissionRate;
  }

  // Get actual Stripe fee from the charge (if available)
  let stripeFeeCents = 0;
  if (session.payment_intent) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent as string);
      if (paymentIntent.latest_charge) {
        const charge = await stripe.charges.retrieve(paymentIntent.latest_charge as string);
        if (charge.balance_transaction) {
          const balanceTx = await stripe.balanceTransactions.retrieve(charge.balance_transaction as string);
          stripeFeeCents = balanceTx.fee;
        }
      }
    } catch (e: any) {
      console.warn('Could not retrieve Stripe fee:', e.message);
    }
  }

  // Use transaction for atomic updates
  await db.transaction(async (tx) => {
    // 1. Update order status + financial details
    await tx
      .update(orders)
      .set({
        status: 'paid',
        sellerId,
        grossAmount: centsToString(totalGrossCents),
        platformFee: centsToString(platformFeeCents),
        stripeFee: centsToString(stripeFeeCents),
        netAmount: centsToString(netAmountCents),
        commissionRate: String(commissionRate),
        currency: 'eur',
        stripePaymentIntentId: session.payment_intent
          ? String(session.payment_intent)
          : null,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId));

    // 2. Update invoice with Stripe IDs and financial details
    const invoiceResult = await tx
      .select()
      .from(invoices)
      .where(eq(invoices.orderId, orderId))
      .limit(1);

    if (invoiceResult[0]) {
      await tx
        .update(invoices)
        .set({
          status: 'paid',
          stripeInvoiceId: session.payment_intent
            ? String(session.payment_intent)
            : session.id,
          stripeCustomerId: session.customer
            ? String(session.customer)
            : null,
          grossAmount: centsToString(totalGrossCents),
          platformFee: centsToString(platformFeeCents),
          stripeFee: centsToString(stripeFeeCents),
          netAmount: centsToString(netAmountCents),
          updatedAt: new Date(),
        })
        .where(eq(invoices.id, invoiceResult[0].id));
    }

    // 3. Decrement stock + create sale records
    for (const item of items) {
      const product = foundProducts.find((p) => p.id === item.productId);
      if (!product) continue;

      const newStock = Math.max(0, product.stock - item.quantity);
      const newStatus = newStock <= 0 ? 'sold' : product.status;

      await tx
        .update(products)
        .set({
          stock: newStock,
          status: newStatus as any,
          updatedAt: new Date(),
        })
        .where(eq(products.id, item.productId));

      // Create sale record per product
      const productGrossCents = toCents(product.price) * item.quantity;
      const productBreakdown = sellerId
        ? await calculateCommission(productGrossCents, sellerId)
        : null;

      await tx.insert(sales).values({
        orderId,
        userId: product.createdBy,
        totalPrice: centsToString(productGrossCents),
        grossAmount: centsToString(productGrossCents),
        platformFee: centsToString(productBreakdown?.platformFeeCents || 0),
        stripeFee: centsToString(stripeFeeCents),
        netAmount: centsToString(productBreakdown?.netAmountCents || productGrossCents),
        commissionRate: String(productBreakdown?.commissionRate || 0),
        currency: 'eur',
        stripePaymentIntentId: session.payment_intent
          ? String(session.payment_intent)
          : null,
      });
    }

    // 4. Increment user order count
    if (userId) {
      const userResult = await tx.select().from(users).where(eq(users.id, userId)).limit(1);
      if (userResult[0]) {
        // Just update timestamp — no counter columns in V2
        await tx.update(users).set({ updatedAt: new Date() }).where(eq(users.id, userId));
      }
    }
  });

  console.log(
    `Processed checkout.session.completed for order ${orderId}: ` +
    `gross=${centsToString(totalGrossCents)}, ` +
    `fee=${centsToString(platformFeeCents)}, ` +
    `net=${centsToString(netAmountCents)}, ` +
    `rate=${commissionRate}%`
  );
}

/**
 * Handle payment_intent.succeeded
 *
 * Secondary confirmation that payment succeeded.
 * Updates order status if not already updated by checkout.session.completed.
 */
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent): Promise<void> {
  const metadata = paymentIntent.metadata;
  if (!metadata?.orderId) return;

  const orderId = parseInt(metadata.orderId);
  if (isNaN(orderId)) return;

  // Check if order is already paid
  const orderResult = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1);

  if (orderResult[0]?.status === 'paid') {
    // Order already fully processed by checkout.session.completed.
    // However, if the Stripe fee wasn't available yet, try to fill it now.
    const existingOrder = orderResult[0];
    if (existingOrder && existingOrder.stripeFee === '0.00' && paymentIntent.latest_charge) {
      try {
        const charge = await stripe.charges.retrieve(paymentIntent.latest_charge as string);
        if (charge.balance_transaction) {
          const balanceTx = await stripe.balanceTransactions.retrieve(charge.balance_transaction as string);
          const stripeFeeCents = balanceTx.fee;
          const netAmountCents = toCents(existingOrder.grossAmount) - toCents(existingOrder.platformFee);
          await db
            .update(orders)
            .set({
              stripeFee: centsToString(stripeFeeCents),
              netAmount: centsToString(netAmountCents),
              updatedAt: new Date(),
            })
            .where(eq(orders.id, orderId));
          console.log(`Retroactively updated Stripe fee for order ${orderId}: ${centsToString(stripeFeeCents)}`);
        }
      } catch (e: any) {
        console.warn(`Could not retrieve Stripe fee for order ${orderId}:`, e.message);
      }
    }
    return;
  }

  // Update order status (fallback — should normally be handled by checkout.session.completed)
  await db
    .update(orders)
    .set({
      status: 'paid',
      stripePaymentIntentId: paymentIntent.id,
      updatedAt: new Date(),
    })
    .where(eq(orders.id, orderId));

  console.log(`Processed payment_intent.succeeded for order ${orderId}`);
}

/**
 * Handle payment_intent.payment_failed
 *
 * Marks the order as failed.
 */
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent): Promise<void> {
  const metadata = paymentIntent.metadata;
  if (!metadata?.orderId) return;

  const orderId = parseInt(metadata.orderId);
  if (isNaN(orderId)) return;

  await db
    .update(orders)
    .set({
      status: 'cancelled',
      updatedAt: new Date(),
    })
    .where(eq(orders.id, orderId));

  console.log(`Processed payment_intent.payment_failed for order ${orderId}`);
}

/**
 * Handle charge.refunded
 *
 * Processes refunds:
 * 1. Find order by payment intent ID
 * 2. Mark order as 'refunded'
 * 3. Update invoice status
 * 4. Update sale records
 */
async function handleChargeRefunded(charge: Stripe.Charge): Promise<void> {
  const paymentIntentId = charge.payment_intent as string;
  if (!paymentIntentId) return;

  // ──────────────────────────────────────────────────────────────
  // STRIPE CONNECT REFUND BEHAVIOR (destination charges):
  //
  // By default on destination charges:
  //   - The connected account (seller) KEEPS the transferred funds.
  //   - The platform absorbs the refund.
  //   - The application fee is NOT returned to the seller.
  //
  // To pull funds back from the seller, the platform must explicitly
  // create the refund with: reverse_transfer=true, refund_application_fee=true
  //
  // Our business policy: full refunds reverse everything (seller gets
  // nothing). Partial refunds reverse proportionally.
  //
  // We do NOT create refunds via the Stripe API from this webhook handler.
  // Refunds are initiated by admin action or customer request through a
  // separate API endpoint. This handler only RECORDS the result.
  // ──────────────────────────────────────────────────────────────

  // Find order by payment intent
  const orderResult = await db
    .select()
    .from(orders)
    .where(eq(orders.stripePaymentIntentId, paymentIntentId))
    .limit(1);

  if (!orderResult[0]) {
    console.warn('Order not found for refund:', paymentIntentId);
    return;
  }

  const order = orderResult[0];

  // Use Stripe's amount_refunded as the CUMULATIVE source of truth.
  // This handles both single and multiple partial refunds correctly.
  // Stripe sends this event on EVERY refund, with amount_refunded being
  // the running total of all refunds against this charge.
  const cumulativeRefundCents = charge.amount_refunded;
  const grossCents = toCents(order.grossAmount);

  // Prevent processing the same Stripe refund object twice.
  // Stripe may deliver the same charge.refunded event multiple times.
  const latestRefundId = charge.refunds?.data?.[0]?.id || null;
  if (latestRefundId && order.lastRefundStripeId === latestRefundId && order.refundStatus === 'full') {
    console.log(`Refund ${latestRefundId} already processed for order ${order.id}, skipping`);
    return;
  }

  // Validate: cumulative refund cannot exceed gross amount
  if (cumulativeRefundCents > grossCents) {
    console.warn(
      `Stripe cumulative refund (${centsToString(cumulativeRefundCents)}) ` +
      `exceeds gross amount (${centsToString(grossCents)}) for order ${order.id}. ` +
      `Capping at gross amount.`
    );
  }
  const safeRefundCents = Math.min(cumulativeRefundCents, grossCents);

  // Determine refund status
  const isFullRefund = safeRefundCents >= grossCents;
  const refundStatus = isFullRefund ? 'full' : 'partial';

  // Calculate proportional platform fee refund.
  // If original commission was 5% and 30% of the order is refunded,
  // then 30% of the platform fee is refunded.
  const platformFeeCents = toCents(order.platformFee);
  const refundedPlatformFeeCents = grossCents > 0
    ? Math.round((safeRefundCents * platformFeeCents) / grossCents)
    : 0;

  // Stock restoration: only if ALL items are fully refunded.
  // For partial refunds, we don't restore stock because the customer
  // still has the product for the non-refunded portion.
  const shouldRestoreStock = isFullRefund;

  await db.transaction(async (tx) => {
    // 1. Update order refund tracking (original financial fields preserved)
    await tx
      .update(orders)
      .set({
        status: isFullRefund ? 'refunded' : order.status, // Only mark 'refunded' on full refund
        refundedAmount: centsToString(safeRefundCents),
        refundedPlatformFee: centsToString(refundedPlatformFeeCents),
        refundStatus,
        lastRefundStripeId: latestRefundId,
        refundedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(orders.id, order.id));

    // 2. Update invoice refund tracking
    const invoiceResult = await tx
      .select()
      .from(invoices)
      .where(eq(invoices.orderId, order.id))
      .limit(1);

    if (invoiceResult[0]) {
      await tx
        .update(invoices)
        .set({
          status: isFullRefund ? 'void' : invoiceResult[0].status,
          refundedAmount: centsToString(safeRefundCents),
          refundStatus,
          updatedAt: new Date(),
        })
        .where(eq(invoices.id, invoiceResult[0].id));
    }

    // 3. Update sale records — proportional refund per sale item
    // Each sale record represents one product in the order.
    // We distribute the refund proportionally across sale items.
    const saleResults = await tx
      .select()
      .from(sales)
      .where(eq(sales.orderId, order.id));

    for (const sale of saleResults) {
      const saleGrossCents = toCents(sale.totalPrice);
      // Proportional refund for this sale item
      const saleRefundCents = grossCents > 0
        ? Math.round((safeRefundCents * saleGrossCents) / grossCents)
        : 0;
      const saleIsFullRefund = saleRefundCents >= saleGrossCents && saleGrossCents > 0;

      await tx
        .update(sales)
        .set({
          refundedAmount: centsToString(saleRefundCents),
          refundStatus: saleIsFullRefund ? 'full' : saleRefundCents > 0 ? 'partial' : 'none',
          refundedAt: saleRefundCents > 0 ? new Date() : sale.refundedAt,
        })
        .where(eq(sales.id, sale.id));
    }

    // 4. Restore stock only on full refund
    if (shouldRestoreStock) {
      const items = await tx
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, order.id));

      for (const item of items) {
        const productResult = await tx
          .select()
          .from(products)
          .where(eq(products.id, item.productId))
          .limit(1);

        if (productResult[0]) {
          const newStock = productResult[0].stock + item.quantity;
          await tx
            .update(products)
            .set({
              stock: newStock,
              status: newStock > 0 ? 'available' : productResult[0].status,
              updatedAt: new Date(),
            })
            .where(eq(products.id, item.productId));
        }
      }
    }
  });

  console.log(
    `Processed charge.refunded for order ${order.id}: ` +
    `refund=${centsToString(safeRefundCents)}/${centsToString(grossCents)} ` +
    `(${refundStatus}), platformFeeRefunded=${centsToString(refundedPlatformFeeCents)}, ` +
    `stockRestored=${shouldRestoreStock}`
  );
}

/**
 * Handle charge.dispute.created
 *
 * Logs disputes for admin attention.
 */
async function handleChargeDispute(dispute: Stripe.Dispute): Promise<void> {
  console.warn(`DISPUTE CREATED: ${dispute.id} for charge ${dispute.charge}, reason: ${dispute.reason}`);
  // In production: send alert to admin, update order status, etc.
}

/**
 * Handle customer.subscription.created / updated
 *
 * Creates or updates subscription records.
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<void> {
  const metadata = subscription.metadata;
  const userId = metadata?.userId ? parseInt(metadata.userId) : null;
  const planId = metadata?.planId ? parseInt(metadata.planId) : null;

  if (!userId || !planId) {
    console.warn('Subscription event missing userId/planId:', subscription.id);
    return;
  }

  const subscriptionItem = subscription.items.data[0];
  const currentPeriodEnd = subscriptionItem?.current_period_end
    ? new Date(subscriptionItem.current_period_end * 1000)
    : new Date();
  const startDate = subscription.start_date
    ? new Date(subscription.start_date * 1000)
    : new Date();
  const trialEndsAt = subscription.trial_end
    ? new Date(subscription.trial_end * 1000)
    : null;

  // Check if subscription record already exists
  const existing = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.stripeSubscriptionId, subscription.id))
    .limit(1);

  if (existing[0]) {
    // Update existing
    await db
      .update(subscriptions)
      .set({
        status: subscription.status as any,
        currentPeriodEnd,
        cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.id, existing[0].id));
  } else {
    // Create new
    await db.insert(subscriptions).values({
      userId,
      planId,
      stripeSubscriptionId: subscription.id,
      status: subscription.status as any,
      startDate,
      currentPeriodEnd,
      trialEndsAt,
      cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
    });
  }

  // Update user's pricing_plan_id if subscription is active
  if (subscription.status === 'active' || subscription.status === 'trialing') {
    await db
      .update(users)
      .set({ pricingPlanId: planId, updatedAt: new Date() })
      .where(eq(users.id, userId));
  }

  console.log(`Processed subscription ${subscription.status}: ${subscription.id} for user ${userId}`);
}

/**
 * Handle customer.subscription.deleted
 *
 * Marks subscription as canceled.
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
  const existing = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.stripeSubscriptionId, subscription.id))
    .limit(1);

  if (existing[0]) {
    await db
      .update(subscriptions)
      .set({
        status: 'canceled',
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.id, existing[0].id));

    // Remove user's plan association
    await db
      .update(users)
      .set({ pricingPlanId: null, updatedAt: new Date() })
      .where(eq(users.id, existing[0].userId!));
  }

  console.log(`Processed subscription.deleted: ${subscription.id}`);
}

/**
 * Handle invoice.payment_succeeded (for subscriptions)
 *
 * Updates invoice status for subscription-related invoices.
 */
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
  // Only handle subscription invoices (not one-time checkout invoices)
  // In Stripe v18, subscription is at parent.subscription_details.subscription
  const subscriptionId = invoice.parent?.subscription_details?.subscription;
  if (subscriptionId && typeof subscriptionId === 'string') {
    console.log(`Subscription invoice paid: ${invoice.id}`);
    // The subscription handler above takes care of the subscription status
  }
}

/**
 * Handle invoice.payment_failed (for subscriptions)
 *
 * Marks subscription as past_due.
 */
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
  // In Stripe v18, subscription is at parent.subscription_details.subscription
  const subscriptionId = invoice.parent?.subscription_details?.subscription;
  if (subscriptionId && typeof subscriptionId === 'string') {
    const subResult = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.stripeSubscriptionId, subscriptionId))
      .limit(1);

    if (subResult[0]) {
      await db
        .update(subscriptions)
        .set({ status: 'past_due', updatedAt: new Date() })
        .where(eq(subscriptions.id, subResult[0].id));
    }

    console.log(`Subscription invoice failed: ${invoice.id}, subscription marked as past_due`);
  }
}

/**
 * Handle account.updated (Stripe Connect)
 *
 * Updates the seller's Connect account status when Stripe sends updates.
 */
async function handleAccountUpdated(account: Stripe.Account): Promise<void> {
  const accountId = account.id;

  // Determine onboarding status
  let onboardingStatus = 'pending';
  if (account.charges_enabled && account.payouts_enabled) {
    onboardingStatus = 'enabled';
  } else if (account.details_submitted) {
    onboardingStatus = 'onboarded';
  } else if (account.requirements?.disabled_reason) {
    onboardingStatus = 'restricted';
  }

  await updateConnectAccount(accountId, {
    charges_enabled: account.charges_enabled || false,
    payouts_enabled: account.payouts_enabled || false,
    details_submitted: account.details_submitted || false,
    onboarding_status: onboardingStatus,
  });

  console.log(`Updated Connect account ${accountId}: status=${onboardingStatus}`);
}
