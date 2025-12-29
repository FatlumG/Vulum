import { FC, useEffect, useState } from "react";
import { ProductInterface } from "../interfaces/ProductInterface";
import { useDispatch } from "react-redux";
import { setProducts } from "../features/products/productSlice";
import api from "../auth/api";

export const getMyProducts = () => {
  const [products, setLocalProducts] = useState<ProductInterface[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await api.get("/products/my-products");
        // console.log(res.data, "res.data");
        setLocalProducts(res.data);
        dispatch(setProducts(res.data));
      } catch (error) {
        console.error(error);
      }
    }
    fetchProducts();
  }, [dispatch]);

  return products;
};
