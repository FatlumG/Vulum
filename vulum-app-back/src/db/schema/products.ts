import { pgTable, integer, varchar, text, decimal, timestamp, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';
import { categories } from './categories';
import { orderItems } from './order-items';
import { favorites } from './favorites';
import { productImages } from './product-images';
import { productStatusEnum } from './enums';

/**
 * Products table.
 *
 * Key design decisions:
 * - createdBy uses SET NULL: if user is deleted, products survive (they may have been sold).
 * - categoryId uses RESTRICT: cannot delete a category that has products.
 * - status is a PostgreSQL enum (product_status): prevents invalid values.
 * - price uses DECIMAL(12,2): handles values up to 9,999,999,999.99.
 * - Soft delete via deletedAt: products can be "removed" without destroying data.
 * - Stripe IDs are nullable (not all products have Stripe sync).
 *
 * Indexes:
 * - createdByIdx: "my products" query (WHERE created_by = ?)
 * - categoryIdIdx: filter products by category (WHERE category_id = ?)
 * - statusIdx: filter by approval status (WHERE status = ?)
 */
export const products = pgTable('products', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  productName: varchar('product_name', { length: 255 }).notNull(),
  productDescription: text('product_description').notNull(),
  price: decimal('price', { precision: 12, scale: 2 }).notNull().default('0.00'),
  stock: integer('stock').notNull().default(1),
  categoryId: integer('category_id')
    .references(() => categories.id, { onDelete: 'restrict' })
    .notNull(),
  createdBy: integer('created_by')
    .references(() => users.id, { onDelete: 'set null' }),
  status: productStatusEnum('status').notNull().default('pending'),
  stripePriceId: varchar('stripe_price_id', { length: 255 }),
  stripeProductId: varchar('stripe_product_id', { length: 255 }),
  deletedAt: timestamp('deleted_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (t) => ({
  createdByIdx: index('idx_products_created_by').on(t.createdBy),
  categoryIdIdx: index('idx_products_category_id').on(t.categoryId),
  statusIdx: index('idx_products_status').on(t.status),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  createdByUser: one(users, {
    fields: [products.createdBy],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  orderItems: many(orderItems),
  favorites: many(favorites),
  productImages: many(productImages),
}));
