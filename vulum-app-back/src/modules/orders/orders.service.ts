/**
 * Orders Service
 *
 * Handles order CRUD and checkout flow.
 * Uses Drizzle ORM + PostgreSQL.
 * Preserves V1 API response contract exactly.
 *
 * V1 Controller: src/api/controllers/Orders/OrderController.ts
 * V1 Service:    src/api/services/Orders/OrderService.ts
 *
 * V1 endpoints:
 *   GET    /orders          — paginated list
 *   GET    /orders/:id      — single order
 *   POST   /orders          — create checkout session (Stripe)
 *   PUT    /orders/:id      — update
 *   DELETE /orders/:id      — delete
 *
 * V1 create flow:
 *   1. Validate items array (non-empty, products exist, not buying own, sufficient stock)
 *   2. Create order record
 *   3. Create order items
 *   4. Create invoice record
 *   5. Create Stripe checkout session
 *   6. Return { url: session.url, invoiceId }
 *
 * V2 create flow (Stripe deferred):
 *   1. Validate items array
 *   2. Create order record
 *   3. Create order items
 *   4. Create invoice record
 *   5. Return { order, items, invoiceId }
 */

import { db } from '../../db/client';
import { orders, orderItems, products, invoices, users } from '../../db/schema';
import { eq, count, desc, inArray } from 'drizzle-orm';
import { NotFoundError, ValidationError, ForbiddenError } from '../../shared/errors';
import type {
  OrderResponse,
  CreateOrderInput,
  UpdateOrderInput,
  OrderListResponse,
} from './orders.types';
import type { OrderItemResponse } from './order-items.types';

// ============================================================
// Field Mapping: Drizzle camelCase → V1 snake_case
// ============================================================

function toOrderResponse(row: typeof orders.$inferSelect): OrderResponse {
  return {
    id: row.id,
    name: row.name,
    amount: String(row.amount),
    status: row.status,
    created_by: row.createdBy,
    created_at: row.createdAt,
    updated_at: row.updatedAt,
  };
}

// ============================================================
// getAll — Paginated list
// ============================================================

export async function getAll(page = 1, limit = 10): Promise<OrderListResponse> {
  const offset = (page - 1) * limit;

  const [items, totalResult] = await Promise.all([
    db
      .select()
      .from(orders)
      .orderBy(desc(orders.id))
      .limit(limit)
      .offset(offset),
    db.select({ count: count() }).from(orders),
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
// findOneById — Single order
// ============================================================

export async function findOneById(id: number): Promise<OrderResponse> {
  const result = await db
    .select()
    .from(orders)
    .where(eq(orders.id, id))
    .limit(1);

  const row = result[0];
  if (!row) {
    throw new NotFoundError('Order', id);
  }

  return toOrderResponse(row);
}

// ============================================================
// createCheckoutSession — Create order with items + invoice
//
// V1 validation rules:
//   - Items array non-empty
//   - All products exist
//   - User is not buying their own product
//   - Quantities > 0
//   - Sufficient stock
//   - Stripe price IDs exist (V2 skips Stripe check)
//
// V2 additions:
//   - Creates invoice record (without Stripe IDs)
//   - Returns order + items + invoiceId (no Stripe session URL)
// ============================================================

export async function createCheckoutSession(
  data: CreateOrderInput,
  userId: number
): Promise<{
  order: OrderResponse;
  items: OrderItemResponse[];
  invoiceId: number;
}> {
  const { items: requestData } = data;

  // 1. Validate items array
  if (!requestData || !Array.isArray(requestData) || requestData.length === 0) {
    throw new ValidationError('No items provided for the order.');
  }

  // 2. Fetch all products
  const productIds = requestData.map((item) => item.product_id);
  const foundProducts = await db
    .select()
    .from(products)
    .where(inArray(products.id, productIds));

  if (foundProducts.length !== productIds.length) {
    throw new ValidationError('One or more products not found.');
  }

  // 3. Validate each item
  let totalAmount = 0;

  for (const item of requestData) {
    const product = foundProducts.find((p) => p.id === item.product_id);

    if (!product) {
      throw new ValidationError(`Product with id ${item.product_id} not found.`);
    }

    // Cannot buy own product
    if (product.createdBy === userId) {
      throw new ForbiddenError('You cannot buy your own product.');
    }

    // Quantity must be positive
    if (item.quantity <= 0) {
      throw new ValidationError(`Invalid quantity for ${product.productName}.`);
    }

    // Sufficient stock
    if (product.stock < item.quantity) {
      throw new ValidationError(`Not enough stock for ${product.productName}.`);
    }

    // Accumulate total
    totalAmount += Number(product.price) * item.quantity;
  }

  // 4. Create order record
  const [orderRow] = await db
    .insert(orders)
    .values({
      name: `Order-${Date.now()}`,
      amount: String(totalAmount),
      status: 'pending',
      createdBy: userId,
    })
    .returning();

  if (!orderRow) {
    throw new Error('Failed to create order');
  }

  // 5. Create order items
  const createdItems: OrderItemResponse[] = [];

  for (const item of requestData) {
    const product = foundProducts.find((p) => p.id === item.product_id)!;
    const lineTotal = Number(product.price) * item.quantity;

    const [itemRow] = await db
      .insert(orderItems)
      .values({
        orderId: orderRow.id,
        productId: item.product_id,
        quantity: item.quantity,
        totalAmount: String(lineTotal),
      })
      .returning();

    if (itemRow) {
      createdItems.push({
        id: itemRow.id,
        order_id: itemRow.orderId,
        product_id: itemRow.productId,
        quantity: itemRow.quantity,
        total_amount: String(itemRow.totalAmount),
        created_at: itemRow.createdAt,
      });
    }
  }

  // 6. Create invoice record (without Stripe — Phase 4)
  const [invoiceRow] = await db
    .insert(invoices)
    .values({
      userId,
      orderId: orderRow.id,
      status: 'draft',
      amountDue: String(totalAmount),
      currency: 'usd',
    })
    .returning();

  return {
    order: toOrderResponse(orderRow),
    items: createdItems,
    invoiceId: invoiceRow?.id ?? 0,
  };
}

// ============================================================
// updateOneById — Update an order
// ============================================================

export async function updateOneById(
  id: number,
  data: UpdateOrderInput
): Promise<OrderResponse> {
  const existing = await db
    .select({ id: orders.id })
    .from(orders)
    .where(eq(orders.id, id))
    .limit(1);

  if (!existing[0]) {
    throw new NotFoundError('Order', id);
  }

  const updateData: Record<string, unknown> = { updatedAt: new Date() };
  if (data.name !== undefined) updateData.name = data.name;
  if (data.amount !== undefined) updateData.amount = String(data.amount);
  if (data.status !== undefined) updateData.status = data.status;
  if (data.created_by !== undefined) updateData.createdBy = data.created_by;

  const [row] = await db
    .update(orders)
    .set(updateData)
    .where(eq(orders.id, id))
    .returning();

  if (!row) {
    throw new Error('Failed to update order');
  }

  return toOrderResponse(row);
}

// ============================================================
// deleteOneById — Delete an order
// ============================================================

export async function deleteOneById(id: number): Promise<void> {
  const existing = await db
    .select({ id: orders.id })
    .from(orders)
    .where(eq(orders.id, id))
    .limit(1);

  if (!existing[0]) {
    throw new NotFoundError('Order', id);
  }

  // CASCADE will delete order items
  await db.delete(orders).where(eq(orders.id, id));
}
