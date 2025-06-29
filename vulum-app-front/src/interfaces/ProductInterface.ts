export interface ProductImage {
  id: number;
  image_url: string;
}

export interface ProductInterface {
  id: number;
  Category: number;
  CreatedAt: string;
  CreatedBy: number;
  Price: number;
  ProductDescription: string;
  ProductName: string;
  Status: string;
  Stock: number;
  StripePriceId: string;
  StripeProductId: string;
  productImages: ProductImage[];
}
