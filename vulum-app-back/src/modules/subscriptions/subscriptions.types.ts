/**
 * Subscriptions Types
 *
 * TypeScript interfaces for Subscriptions request/response shapes.
 * V1 entity: src/api/models/Subscriptions/UserSubscription.ts (table: "subscriptions")
 * V2 schema: src/db/schema/subscriptions.ts (table: "subscriptions")
 *
 * V1 Subscription fields:
 *   id, user_id, plan_id, stripe_subscription_id, status,
 *   start_date, current_period_end, trial_ends_at,
 *   cancel_at_period_end, created_at, updated_at
 *
 * V2 Subscription fields:
 *   id, userId, planId, stripeSubscriptionId, status,
 *   startDate, currentPeriodEnd, trialEndsAt,
 *   cancelAtPeriodEnd, createdAt, updatedAt
 *
 * V1 status enum: incomplete, incomplete_expired, trialing, active,
 *                 past_due, canceled, unpaid, paused
 * V2 status enum: trialing, active, past_due, canceled, unpaid
 *
 * V1 endpoints:
 *   GET    /user-subscription              — paginated list (all)
 *   GET    /user-subscription/my-subscription — user's subscription (returns {plan_id})
 *   GET    /user-subscription/:id          — single subscription
 *   POST   /user-subscription              — create (returns 201)
 *   DELETE /user-subscription/:id          — delete (returns 204)
 *
 * Note: V1 has PUT commented out — no update endpoint exposed.
 */

// ============================================================
// Request Types
// ============================================================

export interface CreateSubscriptionInput {
  user_id: number;
  plan_id: number;
  stripe_subscription_id: string;
  status?: string;
  start_date?: string;
  current_period_end?: string;
  trial_ends_at?: string | null;
  cancel_at_period_end?: boolean;
}

// ============================================================
// Response Types
// ============================================================

export interface SubscriptionResponse {
  id: number;
  user_id: number | null;
  plan_id: number;
  stripe_subscription_id: string;
  status: string;
  start_date: Date;
  current_period_end: Date;
  trial_ends_at: Date | null;
  cancel_at_period_end: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface SubscriptionListResponse {
  items: SubscriptionResponse[];
  total: number;
  page: number;
  totalPages: number;
}

/**
 * V1 getMySubscription returns only { plan_id }
 * Preserving this exact shape for frontend compatibility.
 */
export interface MySubscriptionResponse {
  plan_id: number | null;
}
