/**
 * Sales Types
 *
 * V1 field mapping:
 *   orderId → order_id
 *   userId → user_id
 *   totalPrice → total_price
 *   soldAt → sold_at
 *   createdAt → created_at
 *
 * V1 endpoints:
 *   GET    /sales              — paginated list (all)
 *   GET    /sales/:id          — single sale
 *   POST   /sales              — create sale (returns 201)
 *   PUT    /sales/:id          — update sale
 *   DELETE /sales/:id          — delete sale (returns 204)
 *
 * V1 request body (create + update):
 *   { order_id, user_id, total_price }
 *
 * V1 also creates sales via Stripe webhook on order completion:
 *   { order_id, user_id, total_price } (user_id = product seller)
 */

/** Sale as returned in API responses (V1 field names) */
export interface SaleResponse {
  id: number;
  order_id: number;
  user_id: number | null;
  total_price: string;
  sold_at: Date;
  created_at: Date;
}

/** Request body for creating a sale */
export interface CreateSaleInput {
  order_id: number;
  user_id: number;
  total_price: number;
}

/** Request body for updating a sale */
export interface UpdateSaleInput {
  order_id?: number;
  user_id?: number;
  total_price?: number;
}

/** Paginated list response */
export interface SaleListResponse {
  items: SaleResponse[];
  total: number;
  page: number;
  totalPages: number;
}
