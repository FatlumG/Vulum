/**
 * Commission Calculation Service
 *
 * Centralized commission logic for the Vulum marketplace.
 * All calculations use INTEGER minor currency units (cents) to avoid
 * floating-point errors.
 *
 * Rules:
 * - Free-tier sellers: platformFee = grossAmount × COMMISSION_RATE%
 * - Paid-tier sellers (active subscription): platformFee = 0
 * - Commission rate is snapshot at time of sale
 * - Results are immutable: historical records don't change if rate changes
 */

import { stripeConfig } from '../../config/stripe';
import { db } from '../../db/client';
import { subscriptions } from '../../db/schema';
import { eq, and, or } from 'drizzle-orm';
import type { CommissionBreakdown } from './stripe.types';

/**
 * Convert a decimal amount string (e.g., "100.50") to integer cents.
 * Uses Math.round to avoid floating-point precision issues.
 * Returns 0 for null/undefined/invalid values.
 */
export function toCents(amount: string | number | null | undefined): number {
  if (amount === null || amount === undefined) return 0;
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num) || num < 0) return 0;
  return Math.round(num * 100);
}

/**
 * Convert integer cents back to a decimal string for storage.
 * E.g., 10050 → "100.50"
 */
export function centsToString(cents: number): string {
  return (cents / 100).toFixed(2);
}

/**
 * Check if a seller has an active paid subscription.
 *
 * A subscription is considered "active" if:
 * - status = 'active' OR status = 'trialing'
 * - current_period_end is in the future (still valid)
 *
 * This prevents expired/canceled subscriptions from qualifying for 0% commission.
 */
export async function hasActiveSubscription(userId: number): Promise<boolean> {
  const now = new Date();

  const result = await db
    .select({ id: subscriptions.id })
    .from(subscriptions)
    .where(
      and(
        eq(subscriptions.userId, userId),
        or(
          eq(subscriptions.status, 'active'),
          eq(subscriptions.status, 'trialing')
        )
      )
    )
    .limit(1);

  if (!result[0]) return false;

  // Additional check: is the subscription still within its current period?
  const subWithPeriod = await db
    .select({ currentPeriodEnd: subscriptions.currentPeriodEnd })
    .from(subscriptions)
    .where(eq(subscriptions.id, result[0].id))
    .limit(1);

  if (!subWithPeriod[0]) return false;

  return subWithPeriod[0].currentPeriodEnd >= now;
}

/**
 * Calculate commission breakdown for a sale.
 *
 * This is the SINGLE SOURCE OF TRUTH for all commission calculations.
 * It must be called server-side immediately before creating a Stripe payment.
 *
 * @param grossAmountCents - Total sale amount in EUR cents
 * @param sellerId - The seller's user ID
 * @returns CommissionBreakdown with all financial details
 */
export async function calculateCommission(
  grossAmountCents: number,
  sellerId: number
): Promise<CommissionBreakdown> {
  // Validate input
  if (grossAmountCents <= 0) {
    throw new Error('Gross amount must be positive');
  }

  const hasActive = await hasActiveSubscription(sellerId);

  // Commission rate: 0% if seller has active paid subscription, otherwise configured rate
  const commissionRatePercent = hasActive ? 0 : stripeConfig.commissionRate;

  // Calculate platform fee using integer arithmetic
  // Math.round avoids floating-point precision issues
  const platformFeeCents = Math.round((grossAmountCents * commissionRatePercent) / 100);

  // Stripe fee estimation (approximate: 1.5% + €0.25 for EUR cards)
  // Note: Actual Stripe fee comes from webhook charge data
  // This is used for display/estimation only
  const stripeFeeCents = Math.round(grossAmountCents * 0.015 + 25);

  // Seller net = gross - platform fee - Stripe fee
  // (Stripe fee is deducted by Stripe, not by us, but we show it for transparency)
  const netAmountCents = grossAmountCents - platformFeeCents;

  return {
    grossAmountCents,
    platformFeeCents,
    stripeFeeCents,
    netAmountCents,
    commissionRate: commissionRatePercent,
    currency: stripeConfig.currency,
    hasActiveSubscription: hasActive,
  };
}

/**
 * Calculate commission from a decimal string amount.
 * Convenience wrapper for services that store amounts as strings.
 *
 * @param grossAmount - Amount as string (e.g., "100.50")
 * @param sellerId - The seller's user ID
 * @returns CommissionBreakdown
 */
export async function calculateCommissionFromString(
  grossAmount: string,
  sellerId: number
): Promise<CommissionBreakdown> {
  const cents = toCents(grossAmount);
  return calculateCommission(cents, sellerId);
}
