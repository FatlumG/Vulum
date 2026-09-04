/**
 * Stripe Connect Service
 *
 * Handles:
 * - Seller Stripe Connect onboarding
 * - Connect account status management
 * - Stripe Product + Price creation for products/plans
 * - Webhook event deduplication
 *
 * Uses Drizzle ORM + PostgreSQL.
 */

import stripe, { stripeConfig } from '../../config/stripe';
import { db } from '../../db/client';
import { stripeConnectAccounts, webhookEvents } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { NotFoundError, ValidationError, ConflictError, ExternalServiceError } from '../../shared/errors';
import type { ConnectOnboardingResponse, ConnectStatusResponse, StripeConfigResponse } from './stripe.types';

// ============================================================
// Connect Onboarding
// ============================================================

/**
 * Start Stripe Connect onboarding for a seller.
 *
 * Flow:
 * 1. Check if user already has a Connect account
 * 2. If not, create a new Stripe Connect Express account
 * 3. Create an Account Link for onboarding
 * 4. Return the onboarding URL
 *
 * @param userId - The seller's user ID
 * @returns Onboarding URL and account ID
 */
export async function startOnboarding(userId: number): Promise<ConnectOnboardingResponse> {
  // Check if user already has a Connect account
  const existing = await db
    .select()
    .from(stripeConnectAccounts)
    .where(eq(stripeConnectAccounts.userId, userId))
    .limit(1);

  let accountId: string;

  if (existing[0]) {
    // User already has an account — reuse it
    accountId = existing[0].stripeAccountId;

    // If account was previously disabled, we may need to create a new one
    // For now, we'll try to create an account link for the existing account
  } else {
    // Create new Stripe Connect Express account
    try {
      const account = await stripe.accounts.create({
        type: 'express',
        email: undefined, // Stripe will ask during onboarding
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        metadata: {
          userId: String(userId),
        },
      });

      accountId = account.id;

      // Store in database
      await db.insert(stripeConnectAccounts).values({
        userId,
        stripeAccountId: accountId,
        onboardingStatus: 'pending',
        chargesEnabled: false,
        payoutsEnabled: false,
        detailsSubmitted: false,
      });
    } catch (error: any) {
      throw new ExternalServiceError('Stripe', `Failed to create Connect account: ${error.message}`);
    }
  }

  // Create Account Link for onboarding
  try {
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: stripeConfig.connectOnboardingRefreshUrl,
      return_url: stripeConfig.connectOnboardingReturnUrl,
      type: 'account_onboarding',
    });

    return {
      url: accountLink.url,
      account_id: accountId,
    };
  } catch (error: any) {
    throw new ExternalServiceError('Stripe', `Failed to create onboarding link: ${error.message}`);
  }
}

/**
 * Get the Connect account status for a seller.
 *
 * @param userId - The seller's user ID
 * @returns Current Connect account status
 */
export async function getConnectStatus(userId: number): Promise<ConnectStatusResponse> {
  const result = await db
    .select()
    .from(stripeConnectAccounts)
    .where(eq(stripeConnectAccounts.userId, userId))
    .limit(1);

  if (!result[0]) {
    return {
      connected: false,
      account_id: null,
      onboarding_status: 'not_started',
      charges_enabled: false,
      payouts_enabled: false,
      details_submitted: false,
    };
  }

  const account = result[0];

  return {
    connected: account.chargesEnabled && account.payoutsEnabled,
    account_id: account.stripeAccountId,
    onboarding_status: account.onboardingStatus,
    charges_enabled: account.chargesEnabled,
    payouts_enabled: account.payoutsEnabled,
    details_submitted: account.detailsSubmitted,
  };
}

/**
 * Update Connect account status from Stripe webhook data.
 *
 * Called by the webhook handler when an 'account.updated' event is received.
 *
 * @param stripeAccountId - The Stripe account ID
 * @param updates - Fields to update
 */
export async function updateConnectAccount(
  stripeAccountId: string,
  updates: {
    charges_enabled?: boolean;
    payouts_enabled?: boolean;
    details_submitted?: boolean;
    onboarding_status?: string;
  }
): Promise<void> {
  const updateData: Record<string, unknown> = { updatedAt: new Date() };

  if (updates.charges_enabled !== undefined) updateData.chargesEnabled = updates.charges_enabled;
  if (updates.payouts_enabled !== undefined) updateData.payoutsEnabled = updates.payouts_enabled;
  if (updates.details_submitted !== undefined) updateData.detailsSubmitted = updates.details_submitted;
  if (updates.onboarding_status !== undefined) updateData.onboardingStatus = updates.onboarding_status;

  await db
    .update(stripeConnectAccounts)
    .set(updateData)
    .where(eq(stripeConnectAccounts.stripeAccountId, stripeAccountId));
}

// ============================================================
// Stripe Product + Price Creation
// ============================================================

/**
 * Create a Stripe Product and Price for a marketplace product.
 *
 * Called during product creation. The Stripe IDs are stored on the product record.
 *
 * @param productName - Product name
 * @param priceAmount - Price in decimal (e.g., 99.99)
 * @param currency - ISO 4217 currency code
 * @returns Stripe Product ID and Price ID
 */
export async function createProductPrice(
  productName: string,
  priceAmount: number,
  currency: string = stripeConfig.currency
): Promise<{ stripeProductId: string; stripePriceId: string }> {
  try {
    const product = await stripe.products.create({
      name: productName,
    });

    const price = await stripe.prices.create({
      unit_amount: Math.round(priceAmount * 100), // Convert to cents
      currency,
      product: product.id,
    });

    return {
      stripeProductId: product.id,
      stripePriceId: price.id,
    };
  } catch (error: any) {
    throw new ExternalServiceError('Stripe', `Failed to create product/price: ${error.message}`);
  }
}

/**
 * Create a Stripe Product and Price for a subscription plan.
 *
 * Called during plan creation. The Stripe IDs are stored on the plan record.
 *
 * @param planName - Plan name
 * @param priceAmount - Monthly price in decimal
 * @param currency - ISO 4217 currency code
 * @param interval - Billing interval ('month' or 'year')
 * @returns Stripe Product ID and Price ID
 */
export async function createPlanPrice(
  planName: string,
  priceAmount: number,
  currency: string = stripeConfig.currency,
  interval: 'month' | 'year' = 'month'
): Promise<{ stripeProductId: string; stripePriceId: string }> {
  try {
    const product = await stripe.products.create({
      name: planName,
    });

    const price = await stripe.prices.create({
      unit_amount: Math.round(priceAmount * 100),
      currency,
      recurring: { interval },
      product: product.id,
    });

    return {
      stripeProductId: product.id,
      stripePriceId: price.id,
    };
  } catch (error: any) {
    throw new ExternalServiceError('Stripe', `Failed to create plan price: ${error.message}`);
  }
}

// ============================================================
// Webhook Event Deduplication
// ============================================================

/**
 * Attempt to claim a webhook event for processing.
 *
 * Uses a SINGLE DB INSERT with the UNIQUE constraint on stripe_event_id
 * as the sole idempotency gate. This eliminates the TOCTOU race condition
 * that existed between the old isEventProcessed() + recordWebhookEvent() pair.
 *
 * If the INSERT succeeds → this is a new event, caller should process it.
 * If the INSERT fails with 23505 (unique violation) → event was already
 * claimed by another concurrent delivery, caller should skip.
 *
 * @param stripeEventId - The Stripe event ID
 * @param eventType - The event type (e.g., 'checkout.session.completed')
 * @param payload - The full event payload
 * @returns true if the event was newly claimed, false if already existed
 */
export async function claimWebhookEvent(
  stripeEventId: string,
  eventType: string,
  payload: unknown
): Promise<boolean> {
  try {
    await db.insert(webhookEvents).values({
      stripeEventId,
      eventType,
      status: 'pending',
      payload,
    });
    return true; // New event — caller should process
  } catch (error: any) {
    if (error?.code === '23505' || error?.cause?.code === '23505') {
      return false; // Already recorded — duplicate delivery
    }
    throw error;
  }
}

/**
 * Mark a webhook event as processed.
 *
 * @param stripeEventId - The Stripe event ID
 */
export async function markEventProcessed(stripeEventId: string): Promise<void> {
  await db
    .update(webhookEvents)
    .set({ status: 'processed', processedAt: new Date() })
    .where(eq(webhookEvents.stripeEventId, stripeEventId));
}

/**
 * Mark a webhook event as failed.
 *
 * @param stripeEventId - The Stripe event ID
 * @param errorMessage - Error description
 */
export async function markEventFailed(stripeEventId: string, errorMessage: string): Promise<void> {
  // IMPORTANT: On failure, we DELETE the webhook_events record.
  // This allows Stripe to successfully retry the event on the next delivery.
  // If we left the record in 'failed' state, the UNIQUE constraint on
  // stripe_event_id would prevent re-claiming it, permanently blocking retries.
  //
  // Safety: All handlers are idempotent by design (e.g. checking order.status
  // before updating, using lastRefundStripeId to prevent double-counting).
  // A retried event will either succeed or fail again with the same outcome.
  await db
    .delete(webhookEvents)
    .where(eq(webhookEvents.stripeEventId, stripeEventId));
  console.warn(`Deleted webhook event ${stripeEventId} to allow retry (error: ${errorMessage})`);
}

/**
 * Mark a webhook event as ignored (not handled).
 *
 * @param stripeEventId - The Stripe event ID
 */
export async function markEventIgnored(stripeEventId: string): Promise<void> {
  await db
    .update(webhookEvents)
    .set({ status: 'ignored', processedAt: new Date() })
    .where(eq(webhookEvents.stripeEventId, stripeEventId));
}

// ============================================================
// Config
// ============================================================

/**
 * Get Stripe publishable key for frontend.
 */
export function getStripeConfig(): StripeConfigResponse {
  return {
    publishable_key: stripeConfig.publishableKey,
    currency: stripeConfig.currency,
    commission_rate: stripeConfig.commissionRate,
  };
}
