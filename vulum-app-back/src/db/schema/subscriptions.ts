import { pgTable, integer, varchar, boolean, timestamp, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';
import { plans } from './plans';
import { subscriptionStatusEnum } from './enums';

/**
 * Subscriptions table — user subscription records.
 *
 * Key design decisions:
 * - userId uses SET NULL: if user is deleted, subscription history survives.
 * - planId uses RESTRICT: cannot delete a plan that has active subscriptions.
 * - stripeSubscriptionId is UNIQUE: prevents duplicate records from webhook retries.
 * - status is a PostgreSQL enum (subscription_status): mirrors Stripe states.
 * - Financial records are IMMUTABLE HISTORY — no soft delete.
 *
 * Indexes:
 * - userIdIdx: "my subscriptions" query (WHERE user_id = ?)
 * - stripeSubscriptionIdIdx: Stripe webhook lookups (WHERE stripe_subscription_id = ?)
 */
export const subscriptions = pgTable('subscriptions', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'set null' }),
  planId: integer('plan_id')
    .references(() => plans.id, { onDelete: 'restrict' })
    .notNull(),
  stripeSubscriptionId: varchar('stripe_subscription_id', { length: 255 }).unique().notNull(),
  status: subscriptionStatusEnum('status').notNull().default('trialing'),
  startDate: timestamp('start_date').notNull(),
  currentPeriodEnd: timestamp('current_period_end').notNull(),
  trialEndsAt: timestamp('trial_ends_at'),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (t) => ({
  userIdIdx: index('idx_subscriptions_user_id').on(t.userId),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
  plan: one(plans, {
    fields: [subscriptions.planId],
    references: [plans.id],
  }),
}));
