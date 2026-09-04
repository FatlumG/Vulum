/**
 * Subscriptions Service
 *
 * Handles subscription CRUD + user's subscription lookup.
 * Uses Drizzle ORM + PostgreSQL.
 * Preserves V1 API response contract exactly.
 *
 * V1 Controller: src/api/controllers/Subscriptions/UserSubscriptionController.ts
 * V1 Service:    src/api/services/Subscription/UserSubscriptionService.ts
 *
 * V1 endpoints:
 *   GET    /user-subscription              — paginated list (all)
 *   GET    /user-subscription/my-subscription — user's subscription
 *   GET    /user-subscription/:id          — single subscription
 *   POST   /user-subscription              — create (returns 201)
 *   DELETE /user-subscription/:id          — delete (returns 204)
 *   PUT    is COMMENTED OUT in V1 — no update endpoint
 *
 * V1 create behavior:
 *   - Accepts: { user_id, plan_id, stripe_subscription_id, status, start_date, current_period_end, ... }
 *   - Returns created subscription
 *   - stripe_subscription_id is UNIQUE
 *
 * V1 getMySubscription behavior:
 *   - Returns only { plan_id } — the user's most recent subscription's plan
 *   - Uses LEFT JOIN on plan and user
 *   - Orders by subscription.id DESC (most recent first)
 *
 * V1 business rules:
 *   - No role gates (class-level AuthCheck only)
 *   - No ownership checks (any authenticated user can CRUD)
 *   - Hard delete (no soft delete)
 *   - Financial records are IMMUTABLE HISTORY
 */

import { db } from '../../db/client';
import { subscriptions, users, plans } from '../../db/schema';
import { eq, count, desc, and } from 'drizzle-orm';
import { NotFoundError, ValidationError, ConflictError } from '../../shared/errors';
import type {
  SubscriptionResponse,
  SubscriptionListResponse,
  CreateSubscriptionInput,
  MySubscriptionResponse,
} from './subscriptions.types';

// ============================================================
// Field Mapping: Drizzle camelCase → V1 snake_case
// ============================================================

function toSubscriptionResponse(row: typeof subscriptions.$inferSelect): SubscriptionResponse {
  return {
    id: row.id,
    user_id: row.userId,
    plan_id: row.planId,
    stripe_subscription_id: row.stripeSubscriptionId,
    status: row.status,
    start_date: row.startDate,
    current_period_end: row.currentPeriodEnd,
    trial_ends_at: row.trialEndsAt,
    cancel_at_period_end: row.cancelAtPeriodEnd,
    created_at: row.createdAt,
    updated_at: row.updatedAt,
  };
}

// ============================================================
// getAll — Paginated list of all subscriptions
// ============================================================

export async function getAll(page = 1, limit = 10): Promise<SubscriptionListResponse> {
  const offset = (page - 1) * limit;

  const [items, totalResult] = await Promise.all([
    db
      .select()
      .from(subscriptions)
      .orderBy(desc(subscriptions.id))
      .limit(limit)
      .offset(offset),
    db.select({ count: count() }).from(subscriptions),
  ]);

  const total = totalResult[0]?.count ?? 0;

  return {
    items: items.map(toSubscriptionResponse),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

// ============================================================
// findOneById — Single subscription
// ============================================================

export async function findOneById(id: number): Promise<SubscriptionResponse> {
  const result = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.id, id))
    .limit(1);

  const row = result[0];
  if (!row) {
    throw new NotFoundError('Subscription', id);
  }

  return toSubscriptionResponse(row);
}

// ============================================================
// getMySubscription — User's most recent subscription
// V1 returns only { plan_id }
// ============================================================

export async function getMySubscription(userId: number): Promise<MySubscriptionResponse> {
  const result = await db
    .select({ planId: subscriptions.planId })
    .from(subscriptions)
    .innerJoin(users, eq(subscriptions.userId, users.id))
    .where(eq(users.id, userId))
    .orderBy(desc(subscriptions.id))
    .limit(1);

  return {
    plan_id: result[0]?.planId ?? null,
  };
}

// ============================================================
// create — Create a subscription
// V1: accepts full subscription data, returns 201
// ============================================================

export async function create(data: CreateSubscriptionInput): Promise<SubscriptionResponse> {
  // Validate required fields
  if (!data.user_id) {
    throw new ValidationError('user_id is required');
  }
  if (!data.plan_id) {
    throw new ValidationError('plan_id is required');
  }
  if (!data.stripe_subscription_id) {
    throw new ValidationError('stripe_subscription_id is required');
  }

  // Set defaults matching V1
  const now = new Date();
  const oneMonthLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  let row;
  try {
    const result = await db
      .insert(subscriptions)
      .values({
        userId: data.user_id,
        planId: data.plan_id,
        stripeSubscriptionId: data.stripe_subscription_id,
        status: (data.status as any) || 'trialing',
        startDate: data.start_date ? new Date(data.start_date) : now,
        currentPeriodEnd: data.current_period_end ? new Date(data.current_period_end) : oneMonthLater,
        trialEndsAt: data.trial_ends_at ? new Date(data.trial_ends_at) : null,
        cancelAtPeriodEnd: data.cancel_at_period_end ?? false,
      })
      .returning();
    row = result[0];
  } catch (error: any) {
    const pgCode = error?.code || error?.cause?.code;
    // Catch unique violation — duplicate stripe_subscription_id
    if (pgCode === '23505') {
      throw new ConflictError('A subscription with this Stripe ID already exists');
    }
    // Catch FK violation — user or plan does not exist
    if (pgCode === '23503') {
      throw new NotFoundError('User or Plan', `${data.user_id}/${data.plan_id}`);
    }
    throw error;
  }

  if (!row) {
    throw new Error('Failed to create subscription');
  }

  return toSubscriptionResponse(row);
}

// ============================================================
// deleteOneById — Delete a subscription
// ============================================================

export async function deleteOneById(id: number): Promise<void> {
  const existing = await db
    .select({ id: subscriptions.id })
    .from(subscriptions)
    .where(eq(subscriptions.id, id))
    .limit(1);

  if (!existing[0]) {
    throw new NotFoundError('Subscription', id);
  }

  await db.delete(subscriptions).where(eq(subscriptions.id, id));
}
