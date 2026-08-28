import { pgTable, integer, varchar, text, decimal, timestamp, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';
import { orders } from './orders';
import { invoiceStatusEnum } from './enums';

/**
 * Invoices table — Stripe invoice records.
 *
 * Key design decisions:
 * - userId uses SET NULL: if user is deleted, invoice history survives.
 * - orderId uses SET NULL: invoice may exist without an order (e.g., subscription invoices).
 * - stripeInvoiceId is UNIQUE: prevents duplicate invoice records from webhook retries.
 * - stripeCustomerId is indexed: Stripe webhook lookups use this field.
 * - amountDue uses DECIMAL(12,2): was BIGINT in V1 — this is a critical type fix.
 * - status is a PostgreSQL enum (invoice_status): mirrors Stripe invoice states.
 * - Financial records are IMMUTABLE HISTORY — no soft delete.
 *
 * Indexes:
 * - userIdIdx: "my invoices" query (WHERE user_id = ?)
 * - orderIdIdx: "invoice for an order" (WHERE order_id = ?)
 * - stripeCustomerIdIdx: Stripe webhook lookups (WHERE stripe_customer_id = ?)
 */
export const invoices = pgTable('invoices', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  stripeInvoiceId: varchar('stripe_invoice_id', { length: 255 }).unique(),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'set null' }),
  orderId: integer('order_id')
    .references(() => orders.id, { onDelete: 'set null' }),
  status: invoiceStatusEnum('status').notNull().default('draft'),
  hostedInvoiceUrl: text('hosted_invoice_url'),
  amountDue: decimal('amount_due', { precision: 12, scale: 2 }),
  currency: varchar('currency', { length: 10 }).notNull().default('usd'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (t) => ({
  userIdIdx: index('idx_invoices_user_id').on(t.userId),
  orderIdIdx: index('idx_invoices_order_id').on(t.orderId),
  stripeCustomerIdIdx: index('idx_invoices_stripe_customer_id').on(t.stripeCustomerId),
}));

export const invoicesRelations = relations(invoices, ({ one }) => ({
  user: one(users, {
    fields: [invoices.userId],
    references: [users.id],
  }),
  order: one(orders, {
    fields: [invoices.orderId],
    references: [orders.id],
  }),
}));
