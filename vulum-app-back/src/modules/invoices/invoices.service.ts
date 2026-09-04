/**
 * Invoices Service
 *
 * Handles invoice CRUD and user-scoped queries.
 * Uses Drizzle ORM + PostgreSQL.
 * Preserves V1 API response contract exactly.
 *
 * V1 Controller: src/api/controllers/Invoices/InvoiceController.ts
 * V1 Service:    src/api/services/Invoices/InvoiceService.ts
 *
 * V1 endpoints:
 *   GET    /invoices              — paginated list (all)
 *   GET    /invoices/:id          — single invoice
 *   POST   /invoices              — create invoice (returns 201)
 *   PUT    /invoices/:id          — update invoice
 *   DELETE /invoices/:id          — delete invoice (returns 204)
 *   GET    /invoices/get-my-invoices — current user's invoices
 *                                        (with order → orderItems → product → productImages joins)
 *
 * V1 getMyInvoices behavior:
 *   - Joins: invoice → order → orderItems → productsList → productImages
 *   - WHERE: order.created_by = current user
 *   - Paginated, ordered by invoice.created_at DESC
 *   - Returns { items, total, page, totalPages }
 *
 * V2 differences:
 *   - None — V2 preserves V1 behavior exactly
 *   - Financial records are IMMUTABLE HISTORY — no soft delete
 */

import { db } from '../../db/client';
import { invoices, orders, orderItems, products, productImages } from '../../db/schema';
import { eq, count, desc, and, inArray } from 'drizzle-orm';
import { NotFoundError } from '../../shared/errors';
import type {
  InvoiceResponse,
  CreateInvoiceInput,
  UpdateInvoiceInput,
  InvoiceListResponse,
  MyInvoicesListResponse,
  MyInvoiceItem,
} from './invoices.types';

// ============================================================
// Field Mapping: Drizzle camelCase → V1 snake_case
// ============================================================

function toInvoiceResponse(row: typeof invoices.$inferSelect): InvoiceResponse {
  return {
    id: row.id,
    stripe_invoice_id: row.stripeInvoiceId,
    stripe_customer_id: row.stripeCustomerId,
    user_id: row.userId,
    order_id: row.orderId,
    status: row.status,
    hosted_invoice_url: row.hostedInvoiceUrl,
    amount_due: row.amountDue ? String(row.amountDue) : null,
    currency: row.currency,
    created_at: row.createdAt,
    updated_at: row.updatedAt,
  };
}

// ============================================================
// getAll — Paginated list of all invoices
// ============================================================

export async function getAll(page = 1, limit = 10): Promise<InvoiceListResponse> {
  const offset = (page - 1) * limit;

  const [items, totalResult] = await Promise.all([
    db
      .select()
      .from(invoices)
      .orderBy(desc(invoices.id))
      .limit(limit)
      .offset(offset),
    db.select({ count: count() }).from(invoices),
  ]);

  const total = totalResult[0]?.count ?? 0;

  return {
    items: items.map(toInvoiceResponse),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

// ============================================================
// findOneById — Single invoice
// ============================================================

export async function findOneById(id: number): Promise<InvoiceResponse> {
  const result = await db
    .select()
    .from(invoices)
    .where(eq(invoices.id, id))
    .limit(1);

  const row = result[0];
  if (!row) {
    throw new NotFoundError('Invoice', id);
  }

  return toInvoiceResponse(row);
}

// ============================================================
// create — Create an invoice
// V1: accepts arbitrary data, returns 201
// ============================================================

export async function create(data: CreateInvoiceInput): Promise<InvoiceResponse> {
  const insertData: Record<string, unknown> = {
    status: data.status ?? 'draft',
    currency: data.currency ?? 'usd',
  };

  if (data.user_id !== undefined) insertData.userId = data.user_id;
  if (data.order_id !== undefined) insertData.orderId = data.order_id;
  if (data.hosted_invoice_url !== undefined) insertData.hostedInvoiceUrl = data.hosted_invoice_url;
  if (data.amount_due !== undefined) insertData.amountDue = String(data.amount_due);
  if (data.stripe_invoice_id !== undefined) insertData.stripeInvoiceId = data.stripe_invoice_id;
  if (data.stripe_customer_id !== undefined) insertData.stripeCustomerId = data.stripe_customer_id;

  const [row] = await db
    .insert(invoices)
    .values(insertData as any)
    .returning();

  if (!row) {
    throw new Error('Failed to create invoice');
  }

  return toInvoiceResponse(row);
}

// ============================================================
// updateOneById — Update an invoice
// ============================================================

export async function updateOneById(
  id: number,
  data: UpdateInvoiceInput
): Promise<InvoiceResponse> {
  const existing = await db
    .select({ id: invoices.id })
    .from(invoices)
    .where(eq(invoices.id, id))
    .limit(1);

  if (!existing[0]) {
    throw new NotFoundError('Invoice', id);
  }

  const updateData: Record<string, unknown> = { updatedAt: new Date() };

  if (data.status !== undefined) updateData.status = data.status;
  if (data.hosted_invoice_url !== undefined) updateData.hostedInvoiceUrl = data.hosted_invoice_url;
  if (data.amount_due !== undefined) updateData.amountDue = String(data.amount_due);
  if (data.currency !== undefined) updateData.currency = data.currency;
  if (data.stripe_invoice_id !== undefined) updateData.stripeInvoiceId = data.stripe_invoice_id;
  if (data.stripe_customer_id !== undefined) updateData.stripeCustomerId = data.stripe_customer_id;

  const [row] = await db
    .update(invoices)
    .set(updateData)
    .where(eq(invoices.id, id))
    .returning();

  if (!row) {
    throw new Error('Failed to update invoice');
  }

  return toInvoiceResponse(row);
}

// ============================================================
// deleteOneById — Delete an invoice
// ============================================================

export async function deleteOneById(id: number): Promise<void> {
  const existing = await db
    .select({ id: invoices.id })
    .from(invoices)
    .where(eq(invoices.id, id))
    .limit(1);

  if (!existing[0]) {
    throw new NotFoundError('Invoice', id);
  }

  await db.delete(invoices).where(eq(invoices.id, id));
}

// ============================================================
// getMyInvoices — Current user's invoices
//
// V1 behavior:
//   - Joins: invoice → order → orderItems → productsList → productImages
//   - WHERE: order.created_by = current user
//   - Paginated, ordered by invoice.created_at DESC
//   - Returns { items, total, page, totalPages }
//
// V2 implementation:
//   - Step 1: Find invoices whose linked order was created by the user
//   - Step 2: For each invoice, fetch order + orderItems + products + images
//   - This avoids complex multi-level joins that Drizzle handles poorly
// ============================================================

export async function getMyInvoices(
  userId: number,
  page = 1,
  limit = 10
): Promise<MyInvoicesListResponse> {
  const offset = (page - 1) * limit;

  // Step 1: Find orders created by this user
  const userOrderIds = await db
    .select({ id: orders.id })
    .from(orders)
    .where(eq(orders.createdBy, userId));

  const orderIds = userOrderIds.map((o) => o.id);

  // Step 2: Find invoices linked to those orders
  let invoiceItems: typeof invoices.$inferSelect[] = [];
  let total = 0;

  if (orderIds.length > 0) {
    const [items, totalResult] = await Promise.all([
      db
        .select()
        .from(invoices)
        .where(inArray(invoices.orderId, orderIds))
        .orderBy(desc(invoices.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: count() })
        .from(invoices)
        .where(inArray(invoices.orderId, orderIds)),
    ]);

    invoiceItems = items;
    total = totalResult[0]?.count ?? 0;
  }

  // Step 3: Fetch order details for each invoice
  const invoiceOrderIds = invoiceItems
    .map((inv) => inv.orderId)
    .filter((id): id is number => id !== null);

  let ordersMap: Record<number, typeof orders.$inferSelect> = {};
  if (invoiceOrderIds.length > 0) {
    const orderRows = await db
      .select()
      .from(orders)
      .where(inArray(orders.id, invoiceOrderIds));

    for (const o of orderRows) {
      ordersMap[o.id] = o;
    }
  }

  // Step 4: Fetch order items for those orders
  let orderItemsMap: Record<number, typeof orderItems.$inferSelect[]> = {};
  if (invoiceOrderIds.length > 0) {
    const items = await db
      .select()
      .from(orderItems)
      .where(inArray(orderItems.orderId, invoiceOrderIds));

    for (const item of items) {
      if (!orderItemsMap[item.orderId]) {
        orderItemsMap[item.orderId] = [];
      }
      orderItemsMap[item.orderId].push(item);
    }
  }

  // Step 5: Fetch products for those order items
  const allProductIds: number[] = [];
  for (const items of Object.values(orderItemsMap)) {
    for (const item of items) {
      if (item.productId != null) {
        allProductIds.push(item.productId);
      }
    }
  }

  let productsMap: Record<number, typeof products.$inferSelect> = {};
  if (allProductIds.length > 0) {
    const uniqueProductIds = Array.from(new Set(allProductIds));
    const productRows = await db
      .select()
      .from(products)
      .where(inArray(products.id, uniqueProductIds as number[]));

    for (const p of productRows) {
      productsMap[p.id] = p;
    }
  }

  // Step 6: Fetch product images for those products
  let imagesMap: Record<number, typeof productImages.$inferSelect[]> = {};
  if (allProductIds.length > 0) {
    const uniqueProductIds = Array.from(new Set(allProductIds));
    const images = await db
      .select()
      .from(productImages)
      .where(inArray(productImages.productId, uniqueProductIds as number[]));

    for (const img of images) {
      if (!imagesMap[img.productId]) {
        imagesMap[img.productId] = [];
      }
      imagesMap[img.productId].push(img);
    }
  }

  // Step 7: Build the response
  const resultItems: MyInvoiceItem[] = invoiceItems.map((inv) => {
    const order = inv.orderId ? ordersMap[inv.orderId] : undefined;
    const items = inv.orderId ? orderItemsMap[inv.orderId] || [] : [];

    const orderItemsWithProduct = items.map((item) => {
      const product = item.productId ? productsMap[item.productId] : undefined;
      const images = item.productId ? imagesMap[item.productId] || [] : [];

      return {
        id: item.id,
        order_id: item.orderId,
        product_id: item.productId,
        quantity: item.quantity,
        total_amount: String(item.totalAmount),
        created_at: item.createdAt,
        product: product
          ? {
              id: product.id,
              product_name: product.productName,
              product_description: product.productDescription,
              price: String(product.price),
              stock: product.stock,
              status: product.status,
              product_images: images.map((img) => ({
                id: img.id,
                image_url: img.imageUrl,
                product_id: img.productId,
                created_at: img.createdAt,
              })),
            }
          : undefined,
      };
    });

    return {
      id: inv.id,
      stripe_invoice_id: inv.stripeInvoiceId,
      stripe_customer_id: inv.stripeCustomerId,
      user_id: inv.userId,
      order_id: inv.orderId,
      status: inv.status,
      hosted_invoice_url: inv.hostedInvoiceUrl,
      amount_due: inv.amountDue ? String(inv.amountDue) : null,
      currency: inv.currency,
      created_at: inv.createdAt,
      updated_at: inv.updatedAt,
      order: order
        ? {
            id: order.id,
            name: order.name,
            amount: String(order.amount),
            status: order.status,
            created_by: order.createdBy,
            created_at: order.createdAt,
            updated_at: order.updatedAt,
            order_items: orderItemsWithProduct,
          }
        : undefined,
    };
  });

  return {
    items: resultItems,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}
