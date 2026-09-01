/**
 * Plans Types
 *
 * TypeScript interfaces for Plans request/response shapes.
 * V1 entity: src/api/models/Plans/Plan.ts (table: "pricing")
 * V2 schema: src/db/schema/plans.ts (table: "plans")
 *
 * V1 Plan fields:
 *   id, plan_name, plan_description, price, billing_cycle,
 *   created_at, stripe_price_id, stripe_product_id
 *
 * V2 Plan fields:
 *   id, planName, planDescription, price, billingCycle,
 *   stripePriceId, stripeProductId, createdAt, updatedAt
 *
 * BillingCycle enum: 'monthly' | 'yearly' | 'none'
 */

// ============================================================
// Request Types
// ============================================================

export interface CreatePlanInput {
  plan_name: string;
  plan_description: string;
  price: number;
  billing_cycle?: 'monthly' | 'yearly' | 'none';
  stripe_price_id?: string;
  stripe_product_id?: string;
}

export interface UpdatePlanInput {
  plan_name?: string;
  plan_description?: string;
  price?: number;
  billing_cycle?: 'monthly' | 'yearly' | 'none';
  stripe_price_id?: string;
  stripe_product_id?: string;
}

// ============================================================
// Response Types
// ============================================================

export interface PlanResponse {
  id: number;
  plan_name: string;
  plan_description: string;
  price: string;
  billing_cycle: string;
  created_at: Date;
  updated_at: Date;
  stripe_price_id: string | null;
  stripe_product_id: string | null;
}

export interface PlanListResponse {
  items: PlanResponse[];
  total: number;
  page: number;
  totalPages: number;
}
