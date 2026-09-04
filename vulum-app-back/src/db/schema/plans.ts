import { pgTable, integer, varchar, text, decimal, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';
import { subscriptions } from './subscriptions';
import { billingCycleEnum } from './enums';

/**
 * Plans table — pricing tiers (was called "pricing" in V1).
 *
 * Key design decisions:
 * - Renamed from "pricing" to "plans" for clarity.
 * - price uses DECIMAL(12,2): plan price with proper precision.
 * - billingCycle is a PostgreSQL enum: restricts to valid values.
 * - Stripe IDs are nullable: plans may exist before Stripe sync.
 * - No soft delete: plans are versioned, not deleted.
 *   If a plan is removed, existing subscriptions continue on their current plan.
 */
export const plans = pgTable('plans', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  planName: varchar('plan_name', { length: 255 }).notNull(),
  planDescription: text('plan_description').notNull(),
  price: decimal('price', { precision: 12, scale: 2 }).notNull().default('0.00'),
  billingCycle: billingCycleEnum('billing_cycle').notNull().default('none'),
  stripePriceId: varchar('stripe_price_id', { length: 255 }),
  stripeProductId: varchar('stripe_product_id', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const plansRelations = relations(plans, ({ many }) => ({
  users: many(users),
  subscriptions: many(subscriptions),
}));
