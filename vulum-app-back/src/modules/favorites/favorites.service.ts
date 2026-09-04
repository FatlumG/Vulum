/**
 * Favorites Service
 *
 * Handles favorite CRUD and user-scoped queries.
 * Uses Drizzle ORM + PostgreSQL.
 * Preserves V1 API response contract exactly.
 *
 * V1 Controller: src/api/controllers/Favorites/FavoriteController.ts
 * V1 Service:    src/api/services/Favorites/FavoriteService.ts
 *
 * V1 endpoints:
 *   GET    /favorites              — paginated list (all)
 *   GET    /favorites/:id          — single favorite
 *   POST   /favorites              — create (with user+product joins)
 *   PUT    /favorites/:id          — update
 *   DELETE /favorites/:id          — delete
 *   GET    /favorites/get-my-favorites — current user's favorites (paginated, with product+images)
 *
 * V1 create behavior:
 *   - Checks for existing favorite (user_id + product_id)
 *   - If duplicate → throws "This Product is already saved!"
 *   - Creates favorite with user_id from JWT
 *   - Returns favorite with user and product joins
 *   - Increments user's favorites counter (V2 computes via COUNT instead)
 *
 * V2 differences:
 *   - Duplicate prevention via DB unique constraint (race-condition safe)
 *   - User favorites counter computed via COUNT (not denormalized column)
 */

import { db } from '../../db/client';
import { favorites, users, products, productImages } from '../../db/schema';
import { eq, count, desc, and, inArray } from 'drizzle-orm';
import { NotFoundError, ConflictError } from '../../shared/errors';
import type {
  FavoriteResponse,
  FavoriteWithRelationsResponse,
  MyFavoritesListResponse,
  MyFavoriteItem,
  FavoriteListResponse,
} from './favorites.types';

// ============================================================
// Field Mapping: Drizzle camelCase → V1 snake_case
// ============================================================

function toFavoriteResponse(row: typeof favorites.$inferSelect): FavoriteResponse {
  return {
    id: row.id,
    user_id: row.userId,
    product_id: row.productId,
    created_at: row.createdAt,
  };
}

// ============================================================
// getAll — Paginated list of all favorites
// ============================================================

export async function getAll(page = 1, limit = 10): Promise<FavoriteListResponse> {
  const offset = (page - 1) * limit;

  const [items, totalResult] = await Promise.all([
    db
      .select()
      .from(favorites)
      .orderBy(desc(favorites.id))
      .limit(limit)
      .offset(offset),
    db.select({ count: count() }).from(favorites),
  ]);

  const total = totalResult[0]?.count ?? 0;

  return {
    items: items.map(toFavoriteResponse),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

// ============================================================
// findOneById — Single favorite
// ============================================================

export async function findOneById(id: number): Promise<FavoriteResponse> {
  const result = await db
    .select()
    .from(favorites)
    .where(eq(favorites.id, id))
    .limit(1);

  const row = result[0];
  if (!row) {
    throw new NotFoundError('Favorite', id);
  }

  return toFavoriteResponse(row);
}

// ============================================================
// create — Create a favorite
//
// V1 behavior:
//   1. Check for existing favorite (user_id + product_id)
//   2. If duplicate → throw "This Product is already saved!"
//   3. Create favorite
//   4. Fetch user and product details
//   5. Return { ...favorite, user, product }
//
// V2: Uses DB unique constraint for race-condition-safe duplicate detection.
//     Catches the unique violation and returns a friendly error.
// ============================================================

export async function create(
  productId: number,
  userId: number
): Promise<FavoriteWithRelationsResponse> {
  // Check for existing favorite (application-level, for friendly error)
  const existing = await db
    .select({ id: favorites.id })
    .from(favorites)
    .where(and(eq(favorites.userId, userId), eq(favorites.productId, productId)))
    .limit(1);

  if (existing[0]) {
    throw new ConflictError('This Product is already saved!');
  }

  // Insert favorite
  let favoriteRow;
  try {
    const result = await db
      .insert(favorites)
      .values({ userId, productId })
      .returning();
    favoriteRow = result[0];
  } catch (error: any) {
    // Drizzle wraps PG errors in DrizzleQueryError; code is in error.cause
    const pgCode = error?.code || error?.cause?.code;
    // Catch DB unique constraint violation (race condition)
    if (pgCode === '23505') {
      throw new ConflictError('This Product is already saved!');
    }
    // Catch FK violation — product does not exist
    if (pgCode === '23503') {
      throw new NotFoundError('Product', productId);
    }
    throw error;
  }

  if (!favoriteRow) {
    throw new Error('Failed to create favorite');
  }

  // Fetch user details (V1 returned specific fields)
  const userResult = await db
    .select({
      username: users.username,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
      phone: users.phone,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  const userRow = userResult[0];

  // Count user's favorites (V2 computed, not denormalized)
  const [favCount] = await db
    .select({ count: count() })
    .from(favorites)
    .where(eq(favorites.userId, userId));

  // Fetch product details (V1 returned specific fields)
  const productResult = await db
    .select({
      productName: products.productName,
      productDescription: products.productDescription,
      price: products.price,
    })
    .from(products)
    .where(eq(products.id, productId))
    .limit(1);

  const productRow = productResult[0];

  return {
    ...toFavoriteResponse(favoriteRow),
    user: {
      username: userRow?.username ?? '',
      first_name: userRow?.firstName ?? '',
      last_name: userRow?.lastName ?? '',
      email: userRow?.email ?? '',
      phone: userRow?.phone ?? null,
      favorites: favCount?.count ?? 0,
    },
    product: {
      product_name: productRow?.productName ?? '',
      product_description: productRow?.productDescription ?? '',
      price: String(productRow?.price ?? '0'),
    },
  };
}

// ============================================================
// updateOneById — Update a favorite
// V1: find-or-throw, then update
// ============================================================

export async function updateOneById(
  id: number,
  data: { user_id: number; product_id: number }
): Promise<FavoriteResponse> {
  const existing = await db
    .select({ id: favorites.id })
    .from(favorites)
    .where(eq(favorites.id, id))
    .limit(1);

  if (!existing[0]) {
    throw new NotFoundError('Favorite', id);
  }

  // Update user_id and/or product_id
  try {
    await db
      .update(favorites)
      .set({ userId: data.user_id, productId: data.product_id })
      .where(eq(favorites.id, id));
  } catch (error: any) {
    // Drizzle wraps PG errors in DrizzleQueryError; code is in error.cause
    const pgCode = error?.code || error?.cause?.code;
    // Catch unique constraint violation (user already favorited this product)
    if (pgCode === '23505') {
      throw new ConflictError('This Product is already saved!');
    }
    // Catch FK violation — user or product does not exist
    if (pgCode === '23503') {
      throw new NotFoundError('User or Product', `${data.user_id}/${data.product_id}`);
    }
    throw error;
  }

  // Re-fetch the updated record
  const updated = await db
    .select()
    .from(favorites)
    .where(eq(favorites.id, id))
    .limit(1);

  const row = updated[0];
  if (!row) {
    throw new Error('Failed to update favorite');
  }

  return toFavoriteResponse(row);
}

// ============================================================
// deleteOneById — Delete a favorite
// ============================================================

export async function deleteOneById(id: number): Promise<void> {
  const existing = await db
    .select({ id: favorites.id })
    .from(favorites)
    .where(eq(favorites.id, id))
    .limit(1);

  if (!existing[0]) {
    throw new NotFoundError('Favorite', id);
  }

  await db.delete(favorites).where(eq(favorites.id, id));
}

// ============================================================
// getMyFavorites — Current user's favorites
// V1: paginated query WHERE user_id = current user
//     joins product → productImages
//     returns { items, total, page, totalPages }
// ============================================================

export async function getMyFavorites(
  userId: number,
  page = 1,
  limit = 10
): Promise<MyFavoritesListResponse> {
  const offset = (page - 1) * limit;

  // Fetch favorites with product join
  const [items, totalResult] = await Promise.all([
    db
      .select({
        id: favorites.id,
        userId: favorites.userId,
        productId: favorites.productId,
        createdAt: favorites.createdAt,
        // Product fields
        productName: products.productName,
        productDescription: products.productDescription,
        price: products.price,
        stock: products.stock,
        categoryId: products.categoryId,
        createdBy: products.createdBy,
        status: products.status,
      })
      .from(favorites)
      .leftJoin(products, eq(favorites.productId, products.id))
      .where(eq(favorites.userId, userId))
      .orderBy(desc(favorites.id))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: count() })
      .from(favorites)
      .where(eq(favorites.userId, userId)),
  ]);

  const total = totalResult[0]?.count ?? 0;

  // Fetch product images for all products in the result
  const productIds = items.map((item) => item.productId).filter(Boolean);

  let imagesMap: Record<number, { id: number; imageUrl: string; productId: number; createdAt: Date }[]> = {};

  if (productIds.length > 0) {
    const images = await db
      .select()
      .from(productImages)
      .where(inArray(productImages.productId, productIds));

    // Group images by product ID
    for (const img of images) {
      if (!imagesMap[img.productId]) {
        imagesMap[img.productId] = [];
      }
      imagesMap[img.productId].push(img);
    }
  }

  // Build response matching V1 shape
  const resultItems: MyFavoriteItem[] = items.map((item) => ({
    id: item.id,
    user_id: item.userId,
    product_id: item.productId,
    created_at: item.createdAt,
    product: {
      id: item.productId,
      product_name: item.productName,
      product_description: item.productDescription,
      price: String(item.price),
      stock: item.stock,
      category_id: item.categoryId,
      created_by: item.createdBy,
      status: item.status,
      product_images: (imagesMap[item.productId] || []).map((img) => ({
        id: img.id,
        image_url: img.imageUrl,
        product_id: img.productId,
        created_at: img.createdAt,
      })),
    },
  }));

  return {
    items: resultItems,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}
