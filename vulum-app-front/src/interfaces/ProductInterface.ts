export interface ProductImage {
  id: number;
  image_url: string;
}

export interface ProductInterface {
  id: number;
  category: number;
  created_at: string;
  created_by: number;
  price: number;
  product_description: string;
  product_name: string;
  status: string;
  stock: number;
  stripe_price_id: string;
  stripe_product_id: string;
  productImages: ProductImage[];
}
