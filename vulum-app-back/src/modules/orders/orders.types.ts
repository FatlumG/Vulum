/**
 * Orders Types
 *
 * V1 field mapping:
 *   createdBy → created_by
 *   createdAt → created_at
 *   updatedAt → updated_at
 *
 * V1 create accepts: { items: [{ product_id, quantity }] }
 * V1 create returns: { url: session.url, invoiceId: invoice.id }
 * V2 create returns: { order, items, invoiceId } (Stripe deferred)
 */

export interface OrderResponse {
  id: number;
  name: string;
  amount: string;
  status: string;
  created_by: number | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateOrderInput {
  items: { product_id: number; quantity: number }[];
}

export interface UpdateOrderInput {
  name?: string;
  amount?: number;
  status?: string;
  created_by?: number;
}

export interface OrderListResponse {
  items: OrderResponse[];
  total: number;
  page: number;
  totalPages: number;
}
