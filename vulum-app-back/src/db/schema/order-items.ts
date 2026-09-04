import { pgTable, integer, decimal, timestamp, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { orders } from './orders';
import { products } from './products';

/**
 * Order items table — line items within an order.
 *
 * Key design decisions:
 * - orderId uses CASCADE: if an order is deleted (which shouldn't happen for financial records),
 *   its line items are deleted too. This is the only CASCADE on orders.
 * - productId uses RESTRICT: cannot delete a product that has been ordered.
 *   This protects historical order data.
 * - totalAmount uses DECIMAL(12,2): line item total with proper precision.
 * - Financial records are IMMUTABLE HISTORY — no soft delete.
 *
 * Indexes:
 * - orderIdIdx: "get items for an order" (WHERE order_id = ?)
 * - productIdIdx: "check if product was ordered" (WHERE product_id = ?)
 */
export const orderItems = pgTable('order_items', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  orderId: integer('order_id')
    .references(() => orders.id, { onDelete: 'cascade' })
    .notNull(),
  productId: integer('product_id')
    .references(() => products.id, { onDelete: 'restrict' })
    .notNull(),
  quantity: integer('quantity').notNull().default(1),
  totalAmount: decimal('total_amount', { precision: 12, scale: 2 }).notNull().default('0.00'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (t) => ({
  orderIdIdx: index('idx_order_items_order_id').on(t.orderId),
  productIdIdx: index('idx_order_items_product_id').on(t.productId),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));
