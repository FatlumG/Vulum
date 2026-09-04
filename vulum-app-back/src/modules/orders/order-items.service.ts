/**
 * Order Items Service
 *
 * Handles order item CRUD operations.
 * Uses Drizzle ORM + PostgreSQL.
 *
 * V1 Controller: src/api/controllers/OrderItems/OrderItemController.ts
 * V1 Service:    src/api/services/OrderItems/OrderItemService.ts
 *
 * V1 endpoints:
 *   GET    /orderitems          — paginated list
 *   GET    /orderitems/:id      — single order item
 *   POST   /orderitems          — create
 *   PUT    /orderitems/:id      — update
 *   DELETE /orderitems/:id      — delete
 */

import { db } from '../../db/client';
import { orderItems } from '../../db/schema';
import { eq, count, desc } from 'drizzle-orm';
import { NotFoundError } from '../../shared/errors';
import type {
  OrderItemResponse,
  CreateOrderItemInput,
  UpdateOrderItemInput,
  OrderItemListResponse,
} from './order-items.types';

// ============================================================
// Field Mapping: Drizzle camelCase → V1 snake_case
// ============================================================

function toOrderItemResponse(row: typeof orderItems.$inferSelect): OrderItemResponse {
  return {
    id: row.id,
    order_id: row.orderId,
    product_id: row.productId,
    quantity: row.quantity,
    total_amount: String(row.totalAmount),
    created_at: row.createdAt,
  };
}

// ============================================================
// getAll — Paginated list
// ============================================================

export async function getAll(page = 1, limit = 10): Promise<OrderItemListResponse> {
  const offset = (page - 1) * limit;

  const [items, totalResult] = await Promise.all([
    db
      .select()
      .from(orderItems)
      .orderBy(desc(orderItems.id))
      .limit(limit)
      .offset(offset),
    db.select({ count: count() }).from(orderItems),
  ]);

  const total = totalResult[0]?.count ?? 0;

  return {
    items: items.map(toOrderItemResponse),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

// ============================================================
// findOneById — Single order item
// ============================================================

export async function findOneById(id: number): Promise<OrderItemResponse> {
  const result = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.id, id))
    .limit(1);

  const row = result[0];
  if (!row) {
    throw new NotFoundError('OrderItem', id);
  }

  return toOrderItemResponse(row);
}

// ============================================================
// create — Create an order item
// ============================================================

export async function create(data: CreateOrderItemInput): Promise<OrderItemResponse> {
  const [row] = await db
    .insert(orderItems)
    .values({
      orderId: data.order_id,
      productId: data.product_id,
      quantity: data.quantity,
      totalAmount: String(data.total_amount),
    })
    .returning();

  if (!row) {
    throw new Error('Failed to create order item');
  }

  return toOrderItemResponse(row);
}

// ============================================================
// updateOneById — Update an order item
// ============================================================

export async function updateOneById(
  id: number,
  data: UpdateOrderItemInput
): Promise<OrderItemResponse> {
  const existing = await db
    .select({ id: orderItems.id })
    .from(orderItems)
    .where(eq(orderItems.id, id))
    .limit(1);

  if (!existing[0]) {
    throw new NotFoundError('OrderItem', id);
  }

  const updateData: Record<string, unknown> = {};
  if (data.order_id !== undefined) updateData.orderId = data.order_id;
  if (data.product_id !== undefined) updateData.productId = data.product_id;
  if (data.quantity !== undefined) updateData.quantity = data.quantity;
  if (data.total_amount !== undefined) updateData.totalAmount = String(data.total_amount);

  const [row] = await db
    .update(orderItems)
    .set(updateData)
    .where(eq(orderItems.id, id))
    .returning();

  if (!row) {
    throw new Error('Failed to update order item');
  }

  return toOrderItemResponse(row);
}

// ============================================================
// deleteOneById — Delete an order item
// ============================================================

export async function deleteOneById(id: number): Promise<void> {
  const existing = await db
    .select({ id: orderItems.id })
    .from(orderItems)
    .where(eq(orderItems.id, id))
    .limit(1);

  if (!existing[0]) {
    throw new NotFoundError('OrderItem', id);
  }

  await db.delete(orderItems).where(eq(orderItems.id, id));
}
