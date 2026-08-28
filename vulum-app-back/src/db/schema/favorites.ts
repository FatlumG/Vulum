import { pgTable, integer, timestamp, unique, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';
import { products } from './products';

/**
 * Favorites table — user/product favorites.
 *
 * Key design decisions:
 * - Both userId and productId use CASCADE: favorites are user-scoped.
 *   Deleting a user removes their favorites (no orphan favorites).
 *   Deleting a product removes it from all favorites lists.
 * - Composite UNIQUE on (userId, productId): prevents duplicate favorites
 *   at the database level. The V1 application had a race condition here —
 *   two simultaneous requests could both pass the application-level check.
 * - No soft delete: favorites are ephemeral user preferences.
 *
 * Indexes:
 * - userIdIdx: "my favorites" query (WHERE user_id = ?)
 * - productIdIdx: "who favorited this product" (WHERE product_id = ?)
 * - composite unique also serves as an index for (user_id, product_id) lookups
 */
export const favorites = pgTable('favorites', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  productId: integer('product_id')
    .references(() => products.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (t) => ({
  userProductUnique: unique('uk_favorites_user_product').on(t.userId, t.productId),
  userIdIdx: index('idx_favorites_user_id').on(t.userId),
  productIdIdx: index('idx_favorites_product_id').on(t.productId),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [favorites.productId],
    references: [products.id],
  }),
}));
