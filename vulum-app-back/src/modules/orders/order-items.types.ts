/**
 * Order Items Types
 *
 * V1 field mapping:
 *   orderId → order_id
 *   productId → product_id
 *   totalAmount → total_amount
 *   createdAt → created_at
 *
 * V1 request used `price` but V2 schema uses `total_amount`.
 */

export interface OrderItemResponse {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  total_amount: string;
  created_at: Date;
}

export interface CreateOrderItemInput {
  order_id: number;
  product_id: number;
  quantity: number;
  total_amount: number;
}

export interface UpdateOrderItemInput {
  order_id?: number;
  product_id?: number;
  quantity?: number;
  total_amount?: number;
}

export interface OrderItemListResponse {
  items: OrderItemResponse[];
  total: number;
  page: number;
  totalPages: number;
}
