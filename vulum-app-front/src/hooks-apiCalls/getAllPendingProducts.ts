import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ProductInterface } from "../interfaces/ProductInterface";
import api from "../auth/api";
import { setProducts } from "../features/products/productSlice";

export const usePendingProducts = () => {
  const [products, setLocalProducts] = useState<ProductInterface[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await api.get("/products/pending-products");
        const items = res.data.items || res.data;
        setLocalProducts(items);
        dispatch(setProducts(items));
      } catch (error) {
        console.error(error);
      }
    }
    fetchProducts();
  }, [dispatch]);

  return products;
};
