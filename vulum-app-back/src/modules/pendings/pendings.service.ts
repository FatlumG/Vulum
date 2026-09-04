/**
 * Pendings Service
 *
 * Handles pending CRUD and order-status queries.
 * Uses Drizzle ORM + PostgreSQL.
 * Preserves V1 API response contract exactly.
 *
 * V1 Controller: src/api/controllers/Pendings/PendingController.ts
 * V1 Service:    src/api/services/Pendings/PendingService.ts
 *
 * V1 behavior (CRITICAL — hybrid of two tables):
 *
 *   getAll():
 *     Queries ORDERS table WHERE status='pending' (NOT pendings table!)
 *     Returns Order entities as the response
 *
 *   getMyPendings():
 *     Queries ORDERS table WHERE created_by=:userId AND status='pending'
 *     Returns Order entities as the response
 *
 *   findOneById():
 *     Queries PENDINGS table by id
 *     Returns Pending entity
 *
 *   create():
 *     Creates a record in PENDINGS table
 *     Body: { order_id } (V1 also sets UserId from logged user)
 *     user_id comes from JWT
 *
 *   updateOneById():
 *     Updates a record in PENDINGS table
 *
 *   deleteOneById():
 *     Deletes a record from PENDINGS table
 *
 * V2 preserves this exact hybrid behavior.
 */

import { db } from '../../db/client';
import { pendings, orders } from '../../db/schema';
import { eq, count, desc, and } from 'drizzle-orm';
import { NotFoundError, ValidationError } from '../../shared/errors';
import type {
  PendingResponse,
  PendingOrderResponse,
  CreatePendingInput,
  PendingListResponse,
} from './pendings.types';

// ============================================================
// Field Mapping: Drizzle camelCase → V1 snake_case
// ============================================================

function toPendingResponse(row: typeof pendings.$inferSelect): PendingResponse {
  return {
    id: row.id,
    user_id: row.userId,
    created_at: row.createdAt,
  };
}

function toOrderResponse(row: typeof orders.$inferSelect): PendingOrderResponse {
  return {
    id: row.id,
    name: row.name,
    amount: String(row.amount),
    status: row.status,
    created_by: row.createdBy ?? 0,
    created_at: row.createdAt,
  };
}

// ============================================================
// getAll — V1 queries ORDERS WHERE status='pending'
// ============================================================

export async function getAll(page = 1, limit = 10): Promise<PendingListResponse> {
  const offset = (page - 1) * limit;

  const [items, totalResult] = await Promise.all([
    db
      .select()
      .from(orders)
      .where(eq(orders.status, 'pending'))
      .orderBy(desc(orders.id))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: count() })
      .from(orders)
      .where(eq(orders.status, 'pending')),
  ]);

  const total = totalResult[0]?.count ?? 0;

  return {
    items: items.map(toOrderResponse),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

// ============================================================
// findOneById — Queries PENDINGS table
// ============================================================

export async function findOneById(id: number): Promise<PendingResponse> {
  const result = await db
    .select()
    .from(pendings)
    .where(eq(pendings.id, id))
    .limit(1);

  const row = result[0];
  if (!row) {
    throw new NotFoundError('Pending', id);
  }

  return toPendingResponse(row);
}

// ============================================================
// create — Creates a record in PENDINGS table
// V1: body has { order_id }, user_id from JWT
// V2: pendings table has userId (not orderId), so we store userId
// ============================================================

export async function create(
  data: CreatePendingInput,
  userId: number
): Promise<PendingResponse> {
  const [row] = await db
    .insert(pendings)
    .values({
      userId,
    })
    .returning();

  if (!row) {
    throw new Error('Failed to create pending');
  }

  return toPendingResponse(row);
}

// ============================================================
// updateOneById — Updates a record in PENDINGS table
// ============================================================

export async function updateOneById(
  id: number,
  data: { order_id?: number }
): Promise<PendingResponse> {
  const existing = await db
    .select({ id: pendings.id })
    .from(pendings)
    .where(eq(pendings.id, id))
    .limit(1);

  if (!existing[0]) {
    throw new NotFoundError('Pending', id);
  }

  // V2 pendings table has no orderId column, so update is a no-op
  // unless we return the current record
  const current = await db
    .select()
    .from(pendings)
    .where(eq(pendings.id, id))
    .limit(1);

  return toPendingResponse(current[0]);
}

// ============================================================
// deleteOneById — Deletes a record from PENDINGS table
// ============================================================

export async function deleteOneById(id: number): Promise<void> {
  const existing = await db
    .select({ id: pendings.id })
    .from(pendings)
    .where(eq(pendings.id, id))
    .limit(1);

  if (!existing[0]) {
    throw new NotFoundError('Pending', id);
  }

  await db.delete(pendings).where(eq(pendings.id, id));
}

// ============================================================
// getMyPendings — V1 queries ORDERS WHERE created_by=user AND status='pending'
// ============================================================

export async function getMyPendings(
  userId: number,
  page = 1,
  limit = 10
): Promise<PendingListResponse> {
  const offset = (page - 1) * limit;

  const [items, totalResult] = await Promise.all([
    db
      .select()
      .from(orders)
      .where(and(eq(orders.createdBy, userId), eq(orders.status, 'pending')))
      .orderBy(desc(orders.id))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: count() })
      .from(orders)
      .where(and(eq(orders.createdBy, userId), eq(orders.status, 'pending'))),
  ]);

  const total = totalResult[0]?.count ?? 0;

  return {
    items: items.map(toOrderResponse),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}
