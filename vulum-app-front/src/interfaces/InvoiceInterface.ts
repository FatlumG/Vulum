export interface InvoiceInterface {
  id: number;
  stripe_invoice_id: string | null;
  stripe_customer_id: string | null;
  status: string;
  amount_due: number;
  currency: string;
  order: Order;
}

export interface Order {
  id: number;
  name: string;
  amount: string;
  status: string;
  orderItems: OrderItem[];
}

export interface OrderItem {
  id: number;
  quantity: number;
  totalAmount: string;
  productsList: Product;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  productImages: ProductImage[];
}

export interface ProductImage {
  id: number;
  image_url: string;
}
