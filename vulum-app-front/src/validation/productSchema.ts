import { z } from "zod";

export const productSchema = z.object({
  product_name: z.string().min(3, "Product Name must be at least 3 characters"),
  product_description: z.string().min(10, "Description too short"),
  price: z.number().positive("Price must be greater than 0"),
  stock: z.number().int().min(1, "Stock must be at least 1"),
});

export type ProductForm = z.infer<typeof productSchema>;
