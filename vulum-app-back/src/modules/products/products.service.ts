/**
 * Products Service
 *
 * Handles product CRUD, query variants, soft delete, and product images.
 * Uses Drizzle ORM + PostgreSQL.
 * Preserves V1 API response contract exactly.
 *
 * V1 Controller: src/api/controllers/Products/ProductController.ts
 * V1 Service:    src/api/services/Products/ProductService.ts
 * V1 Images:     src/api/services/ProductImages/ProductImagesService.ts
 *
 * V1 endpoints:
 *   GET    /products                    — all products (admin/manager)
 *   GET    /products/available-products  — status=available
 *   GET    /products/pending-products    — status=pending
 *   GET    /products/unavailable-products — status=unavailable
 *   GET    /products/sold-products       — status=sold
 *   GET    /products/my-products         — created_by=current user
 *   GET    /products/:id                 — single product with images+category
 *   GET    /products/:productName        — search by name
 *   POST   /products                     — create with images
 *   PUT    /products/:id                 — update (admin/manager)
 *   PATCH  /products/:id                 — update status (admin/manager)
 *   DELETE /products/:id                 — soft delete (admin/manager)
 */

import { db } from '../../db/client';
import { products, productImages, categories } from '../../db/schema';
import { eq, count, sql, desc, asc, like, and, isNull, ilike } from 'drizzle-orm';
import { NotFoundError } from '../../shared/errors';
import { createProductPrice } from '../stripe/stripe.service';
import type {
  ProductResponse,
  ProductDetailResponse,
  ProductImageResponse,
  ProductListResponse,
  CreateProductInput,
  CreateProductWithImagesInput,
  UpdateProductInput,
} from './products.types';

// ============================================================
// Field Mapping: Drizzle camelCase → V1 snake_case
// ============================================================

function toProductResponse(row: typeof products.$inferSelect): ProductResponse {
  return {
    id: row.id,
    product_name: row.productName,
    product_description: row.productDescription,
    price: String(row.price),
    stock: row.stock,
    category_id: row.categoryId,
    created_by: row.createdBy,
    status: row.status,
    stripe_price_id: row.stripePriceId,
    stripe_product_id: row.stripeProductId,
    deleted_at: row.deletedAt,
    created_at: row.createdAt,
    updated_at: row.updatedAt,
  };
}

function toProductImageResponse(row: typeof productImages.$inferSelect): ProductImageResponse {
  return {
    id: row.id,
    image_url: row.imageUrl,
    product_id: row.productId,
    created_at: row.createdAt,
  };
}

// ============================================================
// Helper: Fetch images for a product
// ============================================================

async function getImagesForProduct(productId: number): Promise<ProductImageResponse[]> {
  const imgs = await db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, productId));
  return imgs.map(toProductImageResponse);
}

// ============================================================
// getAll — All products (admin/manager only)
// V1: findAndCount with productImages relation
// ============================================================

export async function getAll(page = 1, limit = 10): Promise<ProductListResponse> {
  const offset = (page - 1) * limit;

  const [items, totalResult] = await Promise.all([
    db
      .select()
      .from(products)
      .where(isNull(products.deletedAt))
      .orderBy(desc(products.id))
      .limit(limit)
      .offset(offset),
    db.select({ count: count() }).from(products).where(isNull(products.deletedAt)),
  ]);

  const total = totalResult[0]?.count ?? 0;

  // Attach images to each product
  const itemsWithImages = await Promise.all(
    items.map(async (item) => ({
      ...toProductResponse(item),
      product_images: await getImagesForProduct(item.id),
    }))
  );

  return {
    items: itemsWithImages,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

// ============================================================
// findByStatus — Filter products by status (used by multiple endpoints)
// ============================================================

async function findByStatus(
  status: 'pending' | 'approved' | 'rejected' | 'available' | 'unavailable' | 'sold',
  page = 1,
  limit = 10
): Promise<ProductListResponse> {
  const offset = (page - 1) * limit;

  const [items, totalResult] = await Promise.all([
    db
      .select()
      .from(products)
      .where(and(eq(products.status, status), isNull(products.deletedAt)))
      .orderBy(desc(products.id))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: count() })
      .from(products)
      .where(and(eq(products.status, status), isNull(products.deletedAt))),
  ]);

  const total = totalResult[0]?.count ?? 0;

  const itemsWithImages = await Promise.all(
    items.map(async (item) => ({
      ...toProductResponse(item),
      product_images: await getImagesForProduct(item.id),
    }))
  );

  return {
    items: itemsWithImages,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getAvailableProducts(page = 1, limit = 10) {
  return findByStatus('available', page, limit);
}

export async function getPendingProducts(page = 1, limit = 10) {
  return findByStatus('pending', page, limit);
}

export async function getUnavailableProducts(page = 1, limit = 10) {
  return findByStatus('unavailable', page, limit);
}

export async function getSoldProducts(page = 1, limit = 10) {
  return findByStatus('sold', page, limit);
}

// ============================================================
// getMyProducts — Products created by current user
// V1: find where created_by = user.userId, order by created_at DESC
// ============================================================

export async function getMyProducts(userId: number): Promise<ProductResponse[]> {
  const items = await db
    .select()
    .from(products)
    .where(and(eq(products.createdBy, userId), isNull(products.deletedAt)))
    .orderBy(desc(products.createdAt));

  return items.map(toProductResponse);
}

// ============================================================
// findOneById — Single product with images and category
// V1: leftJoinAndSelect for productImages and category
// ============================================================

export async function findOneById(id: number): Promise<ProductDetailResponse | null> {
  const result = await db
    .select({
      product: products,
      categoryName: categories.categoryName,
      categoryDescription: categories.categoryDescription,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.id, id))
    .limit(1);

  const row = result[0];

  if (!row) {
    return null;
  }

  const product = toProductResponse(row.product);
  const images = await getImagesForProduct(row.product.id);

  return {
    ...product,
    product_images: images,
    category: row.categoryName
      ? {
          id: row.product.categoryId,
          category_name: row.categoryName,
          category_description: row.categoryDescription!,
        }
      : undefined,
  };
}

// ============================================================
// getProductsBySearch — LIKE search on product_name and product_description
// V1: queryBuilder with LIKE on product_name, product_description
// ============================================================

export async function getProductsBySearch(search: string): Promise<ProductResponse[]> {
  const isSearchEmpty = !search || search.trim() === '';

  let items;

  if (isSearchEmpty) {
    items = await db
      .select({
        id: products.id,
        productName: products.productName,
        productDescription: products.productDescription,
        price: products.price,
        stock: products.stock,
        categoryId: products.categoryId,
        createdBy: products.createdBy,
        status: products.status,
        stripePriceId: products.stripePriceId,
        stripeProductId: products.stripeProductId,
        deletedAt: products.deletedAt,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
      })
      .from(products)
      .where(isNull(products.deletedAt));
  } else {
    const searchTerm = `%${search}%`;
    items = await db
      .select({
        id: products.id,
        productName: products.productName,
        productDescription: products.productDescription,
        price: products.price,
        stock: products.stock,
        categoryId: products.categoryId,
        createdBy: products.createdBy,
        status: products.status,
        stripePriceId: products.stripePriceId,
        stripeProductId: products.stripeProductId,
        deletedAt: products.deletedAt,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
      })
      .from(products)
      .where(
        and(
          isNull(products.deletedAt),
          sql`(${products.productName} ILIKE ${searchTerm} OR ${products.productDescription} ILIKE ${searchTerm})`
        )
      );
  }

  // V1 returned a subset of fields for search results
  return items.map((item) => ({
    id: item.id,
    product_name: item.productName,
    product_description: item.productDescription,
    price: String(item.price),
    stock: item.stock,
    category_id: item.categoryId,
    created_by: item.createdBy,
    status: item.status,
    stripe_price_id: item.stripePriceId,
    stripe_product_id: item.stripeProductId,
    deleted_at: item.deletedAt,
    created_at: item.createdAt,
    updated_at: item.updatedAt,
  }));
}

// ============================================================
// create — Create product with images + Stripe Product/Price
// V1: creates Stripe product+price, then saves to DB
// V2: creates Stripe Product+Price, then saves to DB with Stripe IDs
// ============================================================

export async function create(
  data: CreateProductWithImagesInput,
  userId: number
): Promise<{ product: ProductResponse; images: ProductImageResponse[] }> {
  const { product: productData, images: imageData } = data;

  // Create Stripe Product + Price
  let stripeProductId: string | null = null;
  let stripePriceId: string | null = null;
  try {
    const stripeResult = await createProductPrice(
      productData.product_name,
      productData.price
    );
    stripeProductId = stripeResult.stripeProductId;
    stripePriceId = stripeResult.stripePriceId;
  } catch (err: any) {
    // Stripe creation failed — log but don't block product creation
    console.warn('Failed to create Stripe Product/Price:', err.message);
  }

  // Insert product
  const [productRow] = await db
    .insert(products)
    .values({
      productName: productData.product_name,
      productDescription: productData.product_description,
      price: String(productData.price),
      stock: productData.stock,
      categoryId: productData.category_id,
      createdBy: userId,
      status: 'pending',
      stripeProductId,
      stripePriceId,
    })
    .returning();

  if (!productRow) {
    throw new Error('Failed to create product');
  }

  // Insert images
  let images: ProductImageResponse[] = [];
  if (imageData && imageData.length > 0) {
    const imageRows = await db
      .insert(productImages)
      .values(
        imageData.map((img) => ({
          imageUrl: img.image_url,
          productId: productRow.id,
        }))
      )
      .returning();

    images = imageRows.map(toProductImageResponse);
  }

  return {
    product: toProductResponse(productRow),
    images,
  };
}

// ============================================================
// updateOneById — Update product fields
// V1: find-or-throw, then update
// ============================================================

export async function updateOneById(
  id: number,
  data: UpdateProductInput
): Promise<ProductResponse> {
  const existing = await db
    .select({ id: products.id })
    .from(products)
    .where(eq(products.id, id))
    .limit(1);

  if (!existing[0]) {
    throw new NotFoundError('Product', id);
  }

  const updateData: Record<string, unknown> = { updatedAt: new Date() };
  if (data.product_name !== undefined) updateData.productName = data.product_name;
  if (data.product_description !== undefined) updateData.productDescription = data.product_description;
  if (data.price !== undefined) updateData.price = String(data.price);
  if (data.stock !== undefined) updateData.stock = data.stock;
  if (data.category_id !== undefined) updateData.categoryId = data.category_id;
  if (data.status !== undefined) updateData.status = data.status;

  const [row] = await db
    .update(products)
    .set(updateData)
    .where(eq(products.id, id))
    .returning();

  if (!row) {
    throw new Error('Failed to update product');
  }

  return toProductResponse(row);
}

// ============================================================
// updateStatusById — Update product status only
// V1: returns { message: `Status updated to ${status}` }
// ============================================================

export async function updateStatusById(
  id: number,
  status: string
): Promise<{ message: string }> {
  const existing = await db
    .select({ id: products.id })
    .from(products)
    .where(eq(products.id, id))
    .limit(1);

  if (!existing[0]) {
    throw new NotFoundError('Product', id);
  }

  await db
    .update(products)
    .set({ status: status as 'pending' | 'approved' | 'rejected' | 'available' | 'unavailable' | 'sold', updatedAt: new Date() })
    .where(eq(products.id, id));

  return { message: `Status updated to ${status}` };
}

// ============================================================
// deleteOneById — Soft delete (set deletedAt)
// V1 used hard delete; V2 uses soft delete per schema design
// ============================================================

export async function deleteOneById(id: number): Promise<void> {
  const existing = await db
    .select({ id: products.id })
    .from(products)
    .where(eq(products.id, id))
    .limit(1);

  if (!existing[0]) {
    throw new NotFoundError('Product', id);
  }

  await db
    .update(products)
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(eq(products.id, id));
}

// ============================================================
// getImages — All product images (admin)
// ============================================================

export async function getAllImages(): Promise<ProductImageResponse[]> {
  const imgs = await db.select().from(productImages);
  return imgs.map(toProductImageResponse);
}

// ============================================================
// getImagesByProductId — Images for a specific product
// ============================================================

export async function getImagesByProductId(productId: number): Promise<ProductImageResponse[]> {
  const imgs = await db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, productId));
  return imgs.map(toProductImageResponse);
}
