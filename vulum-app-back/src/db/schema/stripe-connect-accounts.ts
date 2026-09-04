import { pgTable, integer, varchar, boolean, timestamp, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';

/**
 * Stripe Connect Accounts — tracks seller Stripe Connect onboarding.
 *
 * Key design decisions:
 * - stripeAccountId is UNIQUE: one Connect account per seller.
 * - userId is UNIQUE: one Connect account per user.
 * - chargesEnabled + payoutsEnabled: Stripe's own flags that indicate
 *   whether the seller can receive marketplace payments.
 * - onboardingStatus tracks the onboarding lifecycle:
 *   pending → onboarded → enabled | restricted | disabled
 * - Index on stripeAccountId: webhook lookups use this field.
 */
export const stripeConnectAccounts = pgTable('stripe_connect_accounts', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'set null' })
    .unique(),
  stripeAccountId: varchar('stripe_account_id', { length: 255 }).unique().notNull(),
  onboardingStatus: varchar('onboarding_status', { length: 50 }).notNull().default('pending'),
  chargesEnabled: boolean('charges_enabled').notNull().default(false),
  payoutsEnabled: boolean('payouts_enabled').notNull().default(false),
  detailsSubmitted: boolean('details_submitted').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (t) => ({
  stripeAccountIdIdx: index('idx_stripe_connect_stripe_account_id').on(t.stripeAccountId),
  userIdIdx: index('idx_stripe_connect_user_id').on(t.userId),
}));

export const stripeConnectAccountsRelations = relations(stripeConnectAccounts, ({ one }) => ({
  user: one(users, {
    fields: [stripeConnectAccounts.userId],
    references: [users.id],
  }),
}));
