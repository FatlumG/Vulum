import { FC, useEffect, useState } from "react";
import { ProductInterface } from "../interfaces/ProductInterface";
import { useDispatch } from "react-redux";
import {
  setFavorites,
  setFavoriteIds,
} from "../features/products/favoriteSlice";
import api from "../auth/api";

export const getMyFavorites = () => {
  const [products, setLocalProducts] = useState<ProductInterface[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await api.get("/favorites/get-my-favorites");
        // console.log(res.data.items, "res.data.items");
        setLocalProducts(res.data.items);
        dispatch(setFavorites(res.data.items));

        const favoriteIds = res.data.items.map((item: any) => item.id);
        dispatch(setFavoriteIds(favoriteIds));
        // console.log(favoriteIds, "favoriteIds");
      } catch (error: any) {
        console.error("error.response.data.errors", error.response.data.errors);
      }
    }
    fetchProducts();
  }, [dispatch]);

  return products;
};
