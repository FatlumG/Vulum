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
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (t) => ({
  createdByIdx: index('idx_orders_created_by').on(t.createdBy),
  statusIdx: index('idx_orders_status').on(t.status),
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
