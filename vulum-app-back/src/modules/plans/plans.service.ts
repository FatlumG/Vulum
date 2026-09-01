/**
 * Plans Service
 *
 * Handles plan CRUD + user's plan lookup.
 * Uses Drizzle ORM + PostgreSQL.
 * Preserves V1 API response contract.
 *
 * V1 Controller: src/api/controllers/Plans/PlanController.ts
 * V1 Service:    src/api/services/Plans/PlanService.ts
 *
 * V1 endpoints (table: "pricing"):
 *   GET    /pricing              — paginated list (all plans)
 *   GET    /pricing/:id          — single plan
 *   POST   /pricing              — create plan (returns 201)
 *   POST   /pricing/checkout-session — Stripe checkout (DEFERRED)
 *   PUT    /pricing/:id          — update plan
 *   DELETE /pricing/:id          — delete plan (returns 204)
 *   GET    /pricing/myPlan       — get current user's plan
 *
 * V1 create behavior:
 *   - Accepts: { plan_name, plan_description, price, billing_cycle }
 *   - V1 also calls Stripe products + prices API
 *   - Stripe calls are DEFERRED to Phase 4
 *   - V2 create() only does the DB insert
 *
 * V1 business rules:
 *   - No role gates (class-level AuthCheck only)
 *   - No ownership checks (any authenticated user can CRUD any plan)
 *   - Hard delete (no soft delete)
 *   - getMyPlan() returns user.pricing_plan (the user's current plan)
 *   - Stripe IDs are nullable (plans may exist before Stripe sync)
 */

import { db } from '../../db/client';
import { plans, users } from '../../db/schema';
import { eq, count, desc } from 'drizzle-orm';
import { NotFoundError, ValidationError } from '../../shared/errors';
import type {
  PlanResponse,
  PlanListResponse,
  CreatePlanInput,
  UpdatePlanInput,
} from './plans.types';

// ============================================================
// Field Mapping: Drizzle camelCase → V1 snake_case
// ============================================================

function toPlanResponse(row: typeof plans.$inferSelect): PlanResponse {
  return {
    id: row.id,
    plan_name: row.planName,
    plan_description: row.planDescription,
    price: String(row.price),
    billing_cycle: row.billingCycle,
    created_at: row.createdAt,
    updated_at: row.updatedAt,
    stripe_price_id: row.stripePriceId,
    stripe_product_id: row.stripeProductId,
  };
}

// ============================================================
// getAll — Paginated list of all plans
// ============================================================

export async function getAll(page = 1, limit = 10): Promise<PlanListResponse> {
  const offset = (page - 1) * limit;

  const [items, totalResult] = await Promise.all([
    db
      .select()
      .from(plans)
      .orderBy(desc(plans.id))
      .limit(limit)
      .offset(offset),
    db.select({ count: count() }).from(plans),
  ]);

  const total = totalResult[0]?.count ?? 0;

  return {
    items: items.map(toPlanResponse),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

// ============================================================
// findOneById — Single plan
// ============================================================

export async function findOneById(id: number): Promise<PlanResponse> {
  const result = await db
    .select()
    .from(plans)
    .where(eq(plans.id, id))
    .limit(1);

  const row = result[0];
  if (!row) {
    throw new NotFoundError('Plan', id);
  }

  return toPlanResponse(row);
}

// ============================================================
// create — Create a plan
// V1: accepts { plan_name, plan_description, price, billing_cycle }, returns 201
// V1 also creates Stripe product + price — DEFERRED to Phase 4
// ============================================================

export async function create(data: CreatePlanInput): Promise<PlanResponse> {
  // Validate required fields
  if (!data.plan_name) {
    throw new ValidationError('plan_name is required');
  }
  if (!data.plan_description) {
    throw new ValidationError('plan_description is required');
  }
  if (data.price === undefined || data.price === null) {
    throw new ValidationError('price is required');
  }

  const [row] = await db
    .insert(plans)
    .values({
      planName: data.plan_name,
      planDescription: data.plan_description,
      price: String(data.price),
      billingCycle: (data.billing_cycle as 'monthly' | 'yearly' | 'none') || 'none',
      stripePriceId: data.stripe_price_id || null,
      stripeProductId: data.stripe_product_id || null,
    })
    .returning();

  if (!row) {
    throw new Error('Failed to create plan');
  }

  return toPlanResponse(row);
}

// ============================================================
// updateOneById — Update a plan
// ============================================================

export async function updateOneById(
  id: number,
  data: UpdatePlanInput
): Promise<PlanResponse> {
  const existing = await db
    .select({ id: plans.id })
    .from(plans)
    .where(eq(plans.id, id))
    .limit(1);

  if (!existing[0]) {
    throw new NotFoundError('Plan', id);
  }

  const updateData: Record<string, unknown> = {};

  if (data.plan_name !== undefined) updateData.planName = data.plan_name;
  if (data.plan_description !== undefined) updateData.planDescription = data.plan_description;
  if (data.price !== undefined) updateData.price = String(data.price);
  if (data.billing_cycle !== undefined) updateData.billingCycle = data.billing_cycle;
  if (data.stripe_price_id !== undefined) updateData.stripePriceId = data.stripe_price_id;
  if (data.stripe_product_id !== undefined) updateData.stripeProductId = data.stripe_product_id;

  // Only update if there's something to update
  if (Object.keys(updateData).length === 0) {
    const current = await db
      .select()
      .from(plans)
      .where(eq(plans.id, id))
      .limit(1);
    return toPlanResponse(current[0]);
  }

  updateData.updatedAt = new Date();

  const [row] = await db
    .update(plans)
    .set(updateData)
    .where(eq(plans.id, id))
    .returning();

  if (!row) {
    throw new Error('Failed to update plan');
  }

  return toPlanResponse(row);
}

// ============================================================
// deleteOneById — Delete a plan
// ============================================================

export async function deleteOneById(id: number): Promise<void> {
  const existing = await db
    .select({ id: plans.id })
    .from(plans)
    .where(eq(plans.id, id))
    .limit(1);

  if (!existing[0]) {
    throw new NotFoundError('Plan', id);
  }

  await db.delete(plans).where(eq(plans.id, id));
}

// ============================================================
// getMyPlan — Get the current user's plan
// V1: loads user with pricing_plan relation, returns pricing_plan or null
// V2: queries users.pricing_plan_id → plans
// ============================================================

export async function getMyPlan(userId: number): Promise<PlanResponse | null> {
  const result = await db
    .select({ plan: plans })
    .from(users)
    .innerJoin(plans, eq(users.pricingPlanId, plans.id))
    .where(eq(users.id, userId))
    .limit(1);

  if (!result[0]) {
    return null;
  }

  return toPlanResponse(result[0].plan);
}
