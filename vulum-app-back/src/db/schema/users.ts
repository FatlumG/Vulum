import { pgTable, integer, varchar, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { roles } from './roles';
import { plans } from './plans';
import { products } from './products';
import { orders } from './orders';
import { favorites } from './favorites';
import { invoices } from './invoices';
import { sales } from './sales';
import { subscriptions } from './subscriptions';
import { pendings } from './pendings';

/**
 * Users table — core entity.
 *
 * Key design decisions:
 * - No hardcoded roleId default. Roles are assigned during registration via seed data.
 * - All FKs use SET NULL on delete: deleting a user orphans child records
 *   rather than cascading deletes into financial data.
 * - Soft delete via deletedAt: user data is preserved for historical/business records.
 * - Stripe customer ID is nullable (not all users have Stripe accounts).
 * - Counter columns (products, orders, sales, etc.) REMOVED — computed via COUNT() queries.
 */
export const users = pgTable('users', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  username: varchar('username', { length: 191 }).unique().notNull(),
  email: varchar('email', { length: 191 }).unique().notNull(),
  password: varchar('password', { length: 191 }).notNull(),
  firstName: varchar('first_name', { length: 191 }).notNull(),
  lastName: varchar('last_name', { length: 191 }).notNull(),
  bio: text('bio'),
  phone: varchar('phone', { length: 20 }),
  address: text('address'),
  profilePhotoUrl: text('profile_photo_url'),
  roleId: integer('role_id')
    .references(() => roles.id, { onDelete: 'set null' }),
  pricingPlanId: integer('pricing_plan_id')
    .references(() => plans.id, { onDelete: 'set null' }),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
  stripeConnectAccountId: varchar('stripe_connect_account_id', { length: 255 }),
  deletedAt: timestamp('deleted_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  role: one(roles, {
    fields: [users.roleId],
    references: [roles.id],
  }),
  pricingPlan: one(plans, {
    fields: [users.pricingPlanId],
    references: [plans.id],
  }),
  products: many(products),
  orders: many(orders),
  favorites: many(favorites),
  invoices: many(invoices),
  sales: many(sales),
  subscriptions: many(subscriptions),
  pendings: many(pendings),
}));
