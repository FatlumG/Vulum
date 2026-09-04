/**
 * Categories Service
 *
 * Handles category CRUD operations.
 * Uses Drizzle ORM + PostgreSQL.
 * Preserves V1 API response contract exactly.
 *
 * V1 Controller: src/api/controllers/Categories/CategoryController.ts
 * V1 Service:    src/api/services/Categories/CategoryService.ts
 *
 * V1 endpoints:
 *   GET    /categories          — paginated list
 *   GET    /categories/:id      — single category
 *   POST   /categories          — create (admin/manager)
 *   PUT    /categories/:id      — update (admin/manager)
 *   DELETE /categories/:id      — delete (admin/manager)
 */

import { db } from '../../db/client';
import { categories } from '../../db/schema';
import { eq, count, asc, sql } from 'drizzle-orm';
import { NotFoundError } from '../../shared/errors';
import type { CreateCategoryInput, UpdateCategoryInput, CategoryResponse, CategoryListResponse } from './categories.types';

// ============================================================
// Field Mapping: Drizzle camelCase → V1 snake_case
// ============================================================

function toCategoryResponse(row: typeof categories.$inferSelect): CategoryResponse {
  return {
    id: row.id,
    category_name: row.categoryName,
    category_description: row.categoryDescription,
    created_at: row.createdAt,
    updated_at: row.updatedAt,
  };
}

// ============================================================
// getAll — Paginated list
//
// V1 returned: { items: [...], total, page, totalPages }
// via typeorm-simple-query-parser pagination
// ============================================================

export async function getAll(page = 1, limit = 10): Promise<CategoryListResponse> {
  const offset = (page - 1) * limit;

  const [items, totalResult] = await Promise.all([
    db
      .select()
      .from(categories)
      .orderBy(asc(categories.id))
      .limit(limit)
      .offset(offset),
    db.select({ count: count() }).from(categories),
  ]);

  const total = totalResult[0]?.count ?? 0;

  return {
    items: items.map(toCategoryResponse),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

// ============================================================
// findOneById — Single category by ID
//
// V1 threw CategoryNotFoundException if not found
// ============================================================

export async function findOneById(id: number): Promise<CategoryResponse> {
  const result = await db
    .select()
    .from(categories)
    .where(eq(categories.id, id))
    .limit(1);

  const row = result[0];

  if (!row) {
    throw new NotFoundError('Category', id);
  }

  return toCategoryResponse(row);
}

// ============================================================
// create — Create a new category
//
// V1 accepted: { category_name, category_description }
// Returns the created category
// ============================================================

export async function create(data: CreateCategoryInput): Promise<CategoryResponse> {
  const result = await db
    .insert(categories)
    .values({
      categoryName: data.category_name,
      categoryDescription: data.category_description,
    })
    .returning();

  const row = result[0];

  if (!row) {
    throw new Error('Failed to create category');
  }

  return toCategoryResponse(row);
}

// ============================================================
// updateOneById — Update an existing category
//
// V1 threw CategoryNotFoundException if not found
// Accepts partial update (both fields required by V1 contract)
// ============================================================

export async function updateOneById(id: number, data: UpdateCategoryInput): Promise<CategoryResponse> {
  // First verify the category exists
  const existing = await db
    .select({ id: categories.id })
    .from(categories)
    .where(eq(categories.id, id))
    .limit(1);

  if (!existing[0]) {
    throw new NotFoundError('Category', id);
  }

  // Update
  const result = await db
    .update(categories)
    .set({
      categoryName: data.category_name,
      categoryDescription: data.category_description,
      updatedAt: new Date(),
    })
    .where(eq(categories.id, id))
    .returning();

  const row = result[0];

  if (!row) {
    throw new Error('Failed to update category');
  }

  return toCategoryResponse(row);
}

// ============================================================
// deleteOneById — Delete a category
//
// V1 threw CategoryNotFoundException if not found
// Note: If category has products, PostgreSQL RESTRICT constraint
// will throw. The error handler will convert this to a 500.
// V1 had the same behavior (no explicit check before delete).
// ============================================================

export async function deleteOneById(id: number): Promise<void> {
  // First verify the category exists
  const existing = await db
    .select({ id: categories.id })
    .from(categories)
    .where(eq(categories.id, id))
    .limit(1);

  if (!existing[0]) {
    throw new NotFoundError('Category', id);
  }

  // Delete
  const result = await db
    .delete(categories)
    .where(eq(categories.id, id))
    .returning();

  if (!result[0]) {
    throw new Error('Failed to delete category');
  }
}
