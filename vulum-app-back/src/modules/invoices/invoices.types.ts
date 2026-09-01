/**
 * Invoices Types
 *
 * V1 field mapping:
 *   stripeInvoiceId → stripe_invoice_id
 *   stripeCustomerId → stripe_customer_id
 *   userId → user_id
 *   orderId → order_id
 *   hostedInvoiceUrl → hosted_invoice_url
 *   amountDue → amount_due
 *   createdAt → created_at
 *   updatedAt → updated_at
 *
 * V1 endpoints:
 *   GET    /invoices              — paginated list (all)
 *   GET    /invoices/:id          — single invoice
 *   POST   /invoices              — create invoice
 *   PUT    /invoices/:id          — update invoice
 *   DELETE /invoices/:id          — delete invoice
 *   GET    /invoices/get-my-invoices — current user's invoices (with order+items+product+images)
 */

/** Invoice as returned in API responses (V1 field names) */
export interface InvoiceResponse {
  id: number;
  stripe_invoice_id: string | null;
  stripe_customer_id: string | null;
  user_id: number | null;
  order_id: number | null;
  status: string;
  hosted_invoice_url: string | null;
  amount_due: string | null;
  currency: string;
  created_at: Date;
  updated_at: Date;
}

/** Order subset in my-invoices response */
export interface InvoiceOrderResponse {
  id: number;
  name: string;
  amount: string;
  status: string;
  created_by: number | null;
  created_at: Date;
  updated_at: Date;
  order_items?: InvoiceOrderItemResponse[];
}

/** Order item in my-invoices response */
export interface InvoiceOrderItemResponse {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  total_amount: string;
  created_at: Date;
  product?: InvoiceProductResponse;
}

/** Product subset in my-invoices response */
export interface InvoiceProductResponse {
  id: number;
  product_name: string;
  product_description: string;
  price: string;
  stock: number;
  status: string;
  product_images?: {
    id: number;
    image_url: string;
    product_id: number;
    created_at: Date;
  }[];
}

/** Invoice in my-invoices list (with order+items+product+images) */
export interface MyInvoiceItem {
  id: number;
  stripe_invoice_id: string | null;
  stripe_customer_id: string | null;
  user_id: number | null;
  order_id: number | null;
  status: string;
  hosted_invoice_url: string | null;
  amount_due: string | null;
  currency: string;
  created_at: Date;
  updated_at: Date;
  order?: InvoiceOrderResponse;
}

/** Request body for creating an invoice */
export interface CreateInvoiceInput {
  user_id?: number;
  order_id?: number;
  status?: string;
  hosted_invoice_url?: string;
  amount_due?: number;
  currency?: string;
  stripe_invoice_id?: string;
  stripe_customer_id?: string;
}

/** Request body for updating an invoice */
export interface UpdateInvoiceInput {
  status?: string;
  hosted_invoice_url?: string;
  amount_due?: number;
  currency?: string;
  stripe_invoice_id?: string;
  stripe_customer_id?: string;
}

/** Paginated list response */
export interface InvoiceListResponse {
  items: InvoiceResponse[];
  total: number;
  page: number;
  totalPages: number;
}

/** Paginated my-invoices response */
export interface MyInvoicesListResponse {
  items: MyInvoiceItem[];
  total: number;
  page: number;
  totalPages: number;
}
