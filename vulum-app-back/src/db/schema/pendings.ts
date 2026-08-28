import { pgTable, integer, timestamp, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';
import { orders } from './orders';

/**
 * Pendings table — pending product/order requests.
 *
 * Key design decisions:
 * - userId uses SET NULL: if user is deleted, pending records survive.
 * - orderId uses SET NULL: pending may exist without a confirmed order.
 * - No soft delete: pending records are transient by nature.
 *
 * Indexes:
 * - userIdIdx: "my pending items" query (WHERE user_id = ?)
 */
export const pendings = pgTable('pendings', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  orderId: integer('order_id')
    .references(() => orders.id, { onDelete: 'set null' }),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'set null' })
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (t) => ({
  userIdIdx: index('idx_pendings_user_id').on(t.userId),
}));

export const pendingsRelations = relations(pendings, ({ one }) => ({
  user: one(users, {
    fields: [pendings.userId],
    references: [users.id],
  }),
  order: one(orders, {
    fields: [pendings.orderId],
    references: [orders.id],
  }),
}));
