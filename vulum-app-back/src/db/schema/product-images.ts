import { pgTable, integer, text, timestamp, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { products } from './products';

/**
 * Product images table — images associated with products.
 *
 * Key design decisions:
 * - productId uses CASCADE: if a product is deleted, its images are deleted too.
 *   This is appropriate because images have no independent business value.
 * - imageUrl is text (not varchar) to support long Cloudinary/CDN URLs.
 * - No soft delete: images are tied to their product's lifecycle.
 *
 * Indexes:
 * - productIdIdx: "get images for a product" (WHERE product_id = ?)
 */
export const productImages = pgTable('product_images', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  imageUrl: text('image_url').notNull(),
  productId: integer('product_id')
    .references(() => products.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (t) => ({
  productIdIdx: index('idx_product_images_product_id').on(t.productId),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));
