/**
 * Pendings Types
 *
 * V1 behavior (from PendingController + PendingService):
 *
 *   GET    /pendings              — returns orders WHERE status='pending' (NOT pendings table!)
 *   GET    /pendings/:id          — returns a single pending record from pendings table
 *   POST   /pendings              — creates a pending record (body: { order_id }, user_id from JWT)
 *   PUT    /pendings/:id          — updates a pending record
 *   DELETE /pendings/:id          — deletes a pending record
 *   GET    /pendings/getMyPendings — returns orders WHERE status='pending' AND created_by=user
 *
 * V1 field mapping:
 *   orderId → order_id
 *   userId → user_id
 *   createdAt → created_at
 *
 * V2 schema: pendings table has id, userId, createdAt (no orderId column)
 * V2 getAll/getMyPendings query the orders table (preserving V1 behavior)
 */

/** Pending record as stored in the pendings table (V1 field names) */
export interface PendingResponse {
  id: number;
  user_id: number;
  created_at: Date;
}

/** Order returned by getAll/getMyPendings (V1 field names) */
export interface PendingOrderResponse {
  id: number;
  name: string;
  amount: string;
  status: string;
  created_by: number;
  created_at: Date;
}

/** Request body for creating a pending */
export interface CreatePendingInput {
  order_id: number;
}

/** Request body for updating a pending */
export interface UpdatePendingInput {
  order_id?: number;
}

/** Paginated list response (used by getAll, getMyPendings) */
export interface PendingListResponse {
  items: PendingOrderResponse[];
  total: number;
  page: number;
  totalPages: number;
}
