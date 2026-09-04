import { pgTable, integer, varchar, decimal, timestamp, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';
import { orderItems } from './order-items';
import { invoices } from './invoices';
import { sales } from './sales';
import { orderStatusEnum } from './enums';

/**
 * Orders table.
 *
 * Key design decisions:
 * - createdBy uses SET NULL: if user is deleted, order history survives.
 * - status is a PostgreSQL enum (order_status): prevents invalid values.
 * - amount uses DECIMAL(12,2): order total with proper precision.
 * - Financial records are IMMUTABLE HISTORY — no soft delete here.
 *   Orders are never deleted; status changes to 'cancelled' or 'refunded'.
 *
 * Indexes:
 * - createdByIdx: "my orders" query (WHERE created_by = ?)
 * - statusIdx: filter by order status (WHERE status = ?)
 */
export const orders = pgTable('orders', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('name', { length: 255 }).notNull(),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull().default('0.00'),
  status: orderStatusEnum('status').notNull().default('pending'),
  createdBy: integer('created_by')
    .references(() => users.id, { onDelete: 'set null' }),
  sellerId: integer('seller_id')
    .references(() => users.id, { onDelete: 'set null' }),
  grossAmount: decimal('gross_amount', { precision: 12, scale: 2 }),
  platformFee: decimal('platform_fee', { precision: 12, scale: 2 }),
  stripeFee: decimal('stripe_fee', { precision: 12, scale: 2 }),
  netAmount: decimal('net_amount', { precision: 12, scale: 2 }),
  commissionRate: decimal('commission_rate', { precision: 5, scale: 2 }),
  currency: varchar('currency', { length: 10 }).default('eur'),
  stripePaymentIntentId: varchar('stripe_payment_intent_id', { length: 255 }),
  // Refund tracking — original values are preserved above for audit trail.
  // refundedAmount tracks cumulative customer refund in EUR.
  // refundedPlatformFee tracks the proportional platform fee returned.
  // lastRefundStripeId prevents double-counting the same Stripe refund.
  refundedAmount: decimal('refunded_amount', { precision: 12, scale: 2 }).default('0.00').notNull(),
  refundedPlatformFee: decimal('refunded_platform_fee', { precision: 12, scale: 2 }).default('0.00').notNull(),
  refundStatus: varchar('refund_status', { length: 20 }).default('none').notNull(), // none | partial | full
  lastRefundStripeId: varchar('last_refund_stripe_id', { length: 255 }),
  refundedAt: timestamp('refunded_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (t) => ({
  createdByIdx: index('idx_orders_created_by').on(t.createdBy),
  sellerIdx: index('idx_orders_seller_id').on(t.sellerId),
  statusIdx: index('idx_orders_status').on(t.status),
  stripePaymentIntentIdx: index('idx_orders_stripe_payment_intent_id').on(t.stripePaymentIntentId),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  createdByUser: one(users, {
    fields: [orders.createdBy],
    references: [users.id],
  }),
  orderItems: many(orderItems),
  invoices: many(invoices),
  sales: many(sales),
}));
