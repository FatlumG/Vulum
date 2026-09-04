/**
 * Orders Service
 *
 * Handles order CRUD and checkout flow.
 * Uses Drizzle ORM + PostgreSQL.
 * Preserves V1 API response contract exactly.
 *
 * V1 Controller: src/api/controllers/Orders/OrderController.ts
 * V1 Service:    src/api/services/Orders/OrderService.ts
 *
 * V1 endpoints:
 *   GET    /orders          — paginated list
 *   GET    /orders/:id      — single order
 *   POST   /orders          — create checkout session (Stripe)
 *   PUT    /orders/:id      — update
 *   DELETE /orders/:id      — delete
 *
 * V1 create flow:
 *   1. Validate items array (non-empty, products exist, not buying own, sufficient stock)
 *   2. Create order record
 *   3. Create order items
 *   4. Create invoice record
 *   5. Create Stripe checkout session
 *   6. Return { url: session.url, invoiceId }
 *
 * V2 create flow (Stripe deferred):
 *   1. Validate items array
 *   2. Create order record
 *   3. Create order items
 *   4. Create invoice record
 *   5. Return { order, items, invoiceId }
 */

import { db } from '../../db/client';
import { orders, orderItems, products, invoices, users, stripeConnectAccounts } from '../../db/schema';
import { eq, count, desc, inArray } from 'drizzle-orm';
import { NotFoundError, ValidationError, ForbiddenError } from '../../shared/errors';
import stripe, { stripeConfig } from '../../config/stripe';
import { calculateCommission, toCents, centsToString } from '../stripe/stripe.commission';
import type Stripe from 'stripe';
import type {
  OrderResponse,
  CreateOrderInput,
  UpdateOrderInput,
  OrderListResponse,
} from './orders.types';
import type { OrderItemResponse } from './order-items.types';

// ============================================================
// Field Mapping: Drizzle camelCase → V1 snake_case
// ============================================================

function toOrderResponse(row: typeof orders.$inferSelect): OrderResponse {
  return {
    id: row.id,
    name: row.name,
    amount: String(row.amount),
    status: row.status,
    created_by: row.createdBy,
    created_at: row.createdAt,
    updated_at: row.updatedAt,
  };
}

// ============================================================
// getAll — Paginated list
// ============================================================

export async function getAll(page = 1, limit = 10): Promise<OrderListResponse> {
  const offset = (page - 1) * limit;

  const [items, totalResult] = await Promise.all([
    db
      .select()
      .from(orders)
      .orderBy(desc(orders.id))
      .limit(limit)
      .offset(offset),
    db.select({ count: count() }).from(orders),
  ]);

  const total = totalResult[0]?.count ?? 0;

  return {
    items: items.map(toOrderResponse),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

// ============================================================
// findOneById — Single order
// ============================================================

export async function findOneById(id: number): Promise<OrderResponse> {
  const result = await db
    .select()
    .from(orders)
    .where(eq(orders.id, id))
    .limit(1);

  const row = result[0];
  if (!row) {
    throw new NotFoundError('Order', id);
  }

  return toOrderResponse(row);
}

// ============================================================
// createCheckoutSession — Create order + Stripe Connect checkout
//
// V1 validation rules:
//   - Items array non-empty
//   - All products exist
//   - User is not buying their own product
//   - Quantities > 0
//   - Sufficient stock
//   - Stripe price IDs exist (V1 checked this)
//
// V2 Stripe Connect flow:
//   1. Validate items
//   2. Find seller + their Connect account
//   3. Calculate commission based on seller's subscription
//   4. Create order + items + invoice in DB
//   5. Create Stripe Checkout Session with destination charge
//   6. Return { url, invoiceId } — customer redirects to Stripe
// ============================================================

export async function createCheckoutSession(
  data: CreateOrderInput,
  userId: number
): Promise<{
  url: string;
  invoiceId: number;
}> {
  const { items: requestData } = data;

  // 1. Validate items array
  if (!requestData || !Array.isArray(requestData) || requestData.length === 0) {
    throw new ValidationError('No items provided for the order.');
  }

  // 2. Fetch all products
  const productIds = requestData.map((item) => item.product_id);
  const foundProducts = await db
    .select()
    .from(products)
    .where(inArray(products.id, productIds));

  if (foundProducts.length !== productIds.length) {
    throw new ValidationError('One or more products not found.');
  }

  // 3. Validate each item and find seller
  let totalAmount = 0;
  let sellerId: number | null = null;
  const stripeLineItems: { price: string; quantity: number }[] = [];

  for (const item of requestData) {
    const product = foundProducts.find((p) => p.id === item.product_id);

    if (!product) {
      throw new ValidationError(`Product with id ${item.product_id} not found.`);
    }

    // Cannot buy own product
    if (product.createdBy === userId) {
      throw new ForbiddenError('You cannot buy your own product.');
    }

    // Quantity must be positive
    if (item.quantity <= 0) {
      throw new ValidationError(`Invalid quantity for ${product.productName}.`);
    }

    // Sufficient stock
    if (product.stock < item.quantity) {
      throw new ValidationError(`Not enough stock for ${product.productName}.`);
    }

    // Must have a Stripe Price ID for checkout
    if (!product.stripePriceId) {
      throw new ValidationError(`Product "${product.productName}" is not configured for payment.`);
    }

    // Accumulate total
    totalAmount += Number(product.price) * item.quantity;

    // Track seller (assume all products in one order are from same seller)
    if (!sellerId) {
      sellerId = product.createdBy;
    } else if (sellerId !== product.createdBy) {
      throw new ValidationError('All products in an order must be from the same seller.');
    }

    // Build Stripe line items
    stripeLineItems.push({
      price: product.stripePriceId,
      quantity: item.quantity,
    });
  }

  if (!sellerId) {
    throw new ValidationError('Could not determine seller for this order.');
  }

  // 4. Calculate commission
  const totalAmountCents = Math.round(totalAmount * 100);
  const commission = await calculateCommission(totalAmountCents, sellerId);

  // 5. Look up seller's Stripe Connect account
  const connectResult = await db
    .select()
    .from(stripeConnectAccounts)
    .where(eq(stripeConnectAccounts.userId, sellerId))
    .limit(1);

  const connectAccount = connectResult[0];

  if (!connectAccount || !connectAccount.chargesEnabled) {
    throw new ValidationError('Seller is not set up to receive payments. Please ask them to complete Stripe onboarding.');
  }

  // 6. Create order record in DB
  const [orderRow] = await db
    .insert(orders)
    .values({
      name: `Order-${Date.now()}`,
      amount: String(totalAmount),
      status: 'pending',
      createdBy: userId,
      sellerId,
      grossAmount: String(totalAmount),
      platformFee: centsToString(commission.platformFeeCents),
      netAmount: centsToString(commission.netAmountCents),
      commissionRate: String(commission.commissionRate),
      currency: 'eur',
    })
    .returning();

  if (!orderRow) {
    throw new Error('Failed to create order');
  }

  // 7. Create order items
  for (const item of requestData) {
    const product = foundProducts.find((p) => p.id === item.product_id)!;
    const lineTotal = Number(product.price) * item.quantity;

    await db
      .insert(orderItems)
      .values({
        orderId: orderRow.id,
        productId: item.product_id,
        quantity: item.quantity,
        totalAmount: String(lineTotal),
      });
  }

  // 8. Create invoice record
  const [invoiceRow] = await db
    .insert(invoices)
    .values({
      userId,
      orderId: orderRow.id,
      status: 'draft',
      amountDue: String(totalAmount),
      currency: 'eur',
      grossAmount: String(totalAmount),
      platformFee: centsToString(commission.platformFeeCents),
      netAmount: centsToString(commission.netAmountCents),
    })
    .returning();

  // 9. Create Stripe Checkout Session with Connect destination charge
  // Stripe will route payment: customer → Vulum platform → seller (minus platform fee)
  let session: Stripe.Checkout.Session;

  try {
    session = await stripe.checkout.sessions.create(
      {
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: stripeLineItems,
        success_url: stripeConfig.successUrl,
        cancel_url: stripeConfig.cancelUrl,
        metadata: {
          userId: String(userId),
          orderId: String(orderRow.id),
          sellerId: String(sellerId),
          invoiceId: String(invoiceRow?.id ?? 0),
          commissionRate: String(commission.commissionRate),
        },
        // Destination charge: payment goes to platform, then transferred to seller
        payment_intent_data: {
          application_fee_amount: commission.platformFeeCents,
          transfer_data: {
            destination: connectAccount.stripeAccountId,
          },
        },
      },
      {
        // Idempotency key to prevent duplicate sessions for same order
        idempotencyKey: `order-${orderRow.id}-${Date.now()}`,
      }
    );
  } catch (error: any) {
    // If Stripe session creation fails, we still have the order in DB
    // Return the order without a Stripe URL (order stays pending)
    console.error('Failed to create Stripe checkout session:', error.message);
    throw new ValidationError(`Payment processing failed: ${error.message}`);
  }

  // 10. Update order with Stripe payment intent ID
  if (session.payment_intent) {
    await db
      .update(orders)
      .set({
        stripePaymentIntentId: String(session.payment_intent),
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderRow.id));
  }

  if (!session.url) {
    throw new Error('Stripe checkout session created but no URL returned');
  }

  return {
    url: session.url,
    invoiceId: invoiceRow?.id ?? 0,
  };
}

// ============================================================
// updateOneById — Update an order
// ============================================================

export async function updateOneById(
  id: number,
  data: UpdateOrderInput
): Promise<OrderResponse> {
  const existing = await db
    .select({ id: orders.id })
    .from(orders)
    .where(eq(orders.id, id))
    .limit(1);

  if (!existing[0]) {
    throw new NotFoundError('Order', id);
  }

  const updateData: Record<string, unknown> = { updatedAt: new Date() };
  if (data.name !== undefined) updateData.name = data.name;
  if (data.amount !== undefined) updateData.amount = String(data.amount);
  if (data.status !== undefined) updateData.status = data.status;
  if (data.created_by !== undefined) updateData.createdBy = data.created_by;

  const [row] = await db
    .update(orders)
    .set(updateData)
    .where(eq(orders.id, id))
    .returning();

  if (!row) {
    throw new Error('Failed to update order');
  }

  return toOrderResponse(row);
}

// ============================================================
// deleteOneById — Delete an order
// ============================================================

export async function deleteOneById(id: number): Promise<void> {
  const existing = await db
    .select({ id: orders.id })
    .from(orders)
    .where(eq(orders.id, id))
    .limit(1);

  if (!existing[0]) {
    throw new NotFoundError('Order', id);
  }

  // CASCADE will delete order items
  await db.delete(orders).where(eq(orders.id, id));
}
