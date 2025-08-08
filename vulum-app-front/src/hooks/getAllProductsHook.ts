import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ProductInterface } from "../interfaces/ProductInterface";
import api from "../auth/api";
import { setProducts } from "../features/products/productSlice";

export const useAllProducts = () => {
  const [products, setLocalProducts] = useState<ProductInterface[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await api.get("/products");
        console.log(res.data[0], "res.data[0]");
        setLocalProducts(res.data[0]);
        dispatch(setProducts(res.data[0]));
      } catch (error) {
        console.error(error);
      }
    }
    fetchProducts();
  }, [dispatch]);

  return products;
};
