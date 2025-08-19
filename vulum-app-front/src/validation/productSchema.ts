import { z } from "zod";

export const productSchema = z.object({
  ProductName: z.string().min(3, "Product Name must be at least 3 characters"),
  ProductDescription: z.string().min(10, "Description too short"),
  Price: z.number().positive("Price must be greater than 0"),
  Stock: z.number().int().min(1, "Stock must be at least 1"),
});

export type ProductForm = z.infer<typeof productSchema>;
