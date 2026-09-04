/**
 * Sales Service
 *
 * Handles sale CRUD.
 * Uses Drizzle ORM + PostgreSQL.
 * Preserves V1 API response contract exactly.
 *
 * V1 Controller: src/api/controllers/Sales/SaleController.ts
 * V1 Service:    src/api/services/Sales/SaleService.ts
 *
 * V1 endpoints:
 *   GET    /sales              — paginated list (all)
 *   GET    /sales/:id          — single sale
 *   POST   /sales              — create sale (returns 201)
 *   PUT    /sales/:id          — update sale
 *   DELETE /sales/:id          — delete sale (returns 204)
 *
 * V1 create behavior:
 *   - Accepts: { order_id, user_id, total_price }
 *   - Returns created sale
 *   - V1 also creates sales via Stripe webhook (order completion)
 *
 * V1 business rules:
 *   - Financial records are IMMUTABLE HISTORY — no soft delete
 *   - No role gates on any endpoint (class-level AuthCheck only)
 *   - No ownership checks (V1 had none)
 *   - order_id references orders (RESTRICT — cannot delete order with sale)
 *   - user_id references users (SET NULL — sale survives user deletion)
 */

import { db } from '../../db/client';
import { sales } from '../../db/schema';
import { eq, count, desc } from 'drizzle-orm';
import { NotFoundError, ValidationError } from '../../shared/errors';
import type {
  SaleResponse,
  CreateSaleInput,
  UpdateSaleInput,
  SaleListResponse,
} from './sales.types';

// ============================================================
// Field Mapping: Drizzle camelCase → V1 snake_case
// ============================================================

function toSaleResponse(row: typeof sales.$inferSelect): SaleResponse {
  return {
    id: row.id,
    order_id: row.orderId,
    user_id: row.userId,
    total_price: String(row.totalPrice),
    sold_at: row.soldAt,
    created_at: row.createdAt,
  };
}

// ============================================================
// getAll — Paginated list of all sales
// ============================================================

export async function getAll(page = 1, limit = 10): Promise<SaleListResponse> {
  const offset = (page - 1) * limit;

  const [items, totalResult] = await Promise.all([
    db
      .select()
      .from(sales)
      .orderBy(desc(sales.id))
      .limit(limit)
      .offset(offset),
    db.select({ count: count() }).from(sales),
  ]);

  const total = totalResult[0]?.count ?? 0;

  return {
    items: items.map(toSaleResponse),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

// ============================================================
// findOneById — Single sale
// ============================================================

export async function findOneById(id: number): Promise<SaleResponse> {
  const result = await db
    .select()
    .from(sales)
    .where(eq(sales.id, id))
    .limit(1);

  const row = result[0];
  if (!row) {
    throw new NotFoundError('Sale', id);
  }

  return toSaleResponse(row);
}

// ============================================================
// create — Create a sale
// V1: accepts { order_id, user_id, total_price }, returns 201
// ============================================================

export async function create(data: CreateSaleInput): Promise<SaleResponse> {
  // Validate required fields
  if (!data.order_id) {
    throw new ValidationError('order_id is required');
  }
  if (!data.user_id) {
    throw new ValidationError('user_id is required');
  }
  if (data.total_price === undefined || data.total_price === null) {
    throw new ValidationError('total_price is required');
  }

  let row;
  try {
    const result = await db
      .insert(sales)
      .values({
        orderId: data.order_id,
        userId: data.user_id,
        totalPrice: String(data.total_price),
      })
      .returning();
    row = result[0];
  } catch (error: any) {
    // Drizzle wraps PG errors in DrizzleQueryError; code is in error.cause
    const pgCode = error?.code || error?.cause?.code;
    // Catch FK violation — order or user does not exist
    if (pgCode === '23503') {
      throw new NotFoundError('Order or User', `${data.order_id}/${data.user_id}`);
    }
    throw error;
  }

  if (!row) {
    throw new Error('Failed to create sale');
  }

  return toSaleResponse(row);
}

// ============================================================
// updateOneById — Update a sale
// ============================================================

export async function updateOneById(
  id: number,
  data: UpdateSaleInput
): Promise<SaleResponse> {
  const existing = await db
    .select({ id: sales.id })
    .from(sales)
    .where(eq(sales.id, id))
    .limit(1);

  if (!existing[0]) {
    throw new NotFoundError('Sale', id);
  }

  const updateData: Record<string, unknown> = {};

  if (data.order_id !== undefined) updateData.orderId = data.order_id;
  if (data.user_id !== undefined) updateData.userId = data.user_id;
  if (data.total_price !== undefined) updateData.totalPrice = String(data.total_price);

  // Only update if there's something to update
  if (Object.keys(updateData).length === 0) {
    // Re-fetch and return current state
    const current = await db
      .select()
      .from(sales)
      .where(eq(sales.id, id))
      .limit(1);
    return toSaleResponse(current[0]);
  }

  const [row] = await db
    .update(sales)
    .set(updateData)
    .where(eq(sales.id, id))
    .returning();

  if (!row) {
    throw new Error('Failed to update sale');
  }

  return toSaleResponse(row);
}

// ============================================================
// deleteOneById — Delete a sale
// ============================================================

export async function deleteOneById(id: number): Promise<void> {
  const existing = await db
    .select({ id: sales.id })
    .from(sales)
    .where(eq(sales.id, id))
    .limit(1);

  if (!existing[0]) {
    throw new NotFoundError('Sale', id);
  }

  await db.delete(sales).where(eq(sales.id, id));
}
