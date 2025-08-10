import { useEffect, useState } from "react";
import { ProductInterface } from "../interfaces/ProductInterface";
import api from "../auth/api";

export const getProduct = (id: string | number) => {
  const [product, setProduct] = useState<ProductInterface | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await api.get(`/products/${id}`);
        console.log(res.data, "res.data");
        setProduct(res.data);
      } catch (error) {
        console.error(error);
      }
    }

    if (id) fetchProduct();
  }, [id]);

  return product;
};