import { pgTable, integer, decimal, timestamp, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';
import { orders } from './orders';

/**
 * Sales table — records of completed sales.
 *
 * Key design decisions:
 * - orderId uses RESTRICT: cannot delete an order that has a sale record.
 *   This is the STRONGEST protection for financial history.
 * - userId uses SET NULL: if user is deleted, sale records survive.
 * - totalPrice uses DECIMAL(12,2): sale total with proper precision.
 * - soldAt is separate from createdAt: captures when the sale actually occurred,
 *   which may differ from when the record was created.
 * - Financial records are IMMUTABLE HISTORY — no soft delete.
 *
 * Indexes:
 * - userIdIdx: "my sales" query (WHERE user_id = ?)
 * - orderIdIdx: "sale for an order" (WHERE order_id = ?)
 */
export const sales = pgTable('sales', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  orderId: integer('order_id')
    .references(() => orders.id, { onDelete: 'restrict' })
    .notNull(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'set null' }),
  totalPrice: decimal('total_price', { precision: 12, scale: 2 }).notNull().default('0.00'),
  soldAt: timestamp('sold_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (t) => ({
  userIdIdx: index('idx_sales_user_id').on(t.userId),
  orderIdIdx: index('idx_sales_order_id').on(t.orderId),
}));

export const salesRelations = relations(sales, ({ one }) => ({
  user: one(users, {
    fields: [sales.userId],
    references: [users.id],
  }),
  order: one(orders, {
    fields: [sales.orderId],
    references: [orders.id],
  }),
}));
