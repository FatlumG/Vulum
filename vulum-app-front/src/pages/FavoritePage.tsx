import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setFavorites } from "../features/products/favoriteSlice";
import ProductCard from "../components/products/ProductCard";
import { ProductInterface } from "../interfaces/ProductInterface";
import { Link } from "react-router-dom";
import api from "../auth/api";
const FavoritePage: React.FC = () => {
  const [products, setLocalProducts] = useState<ProductInterface[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await api.get("/favorites/get-my-favorites");
        console.log(res.data, "res.data");
        setLocalProducts(res.data);
        dispatch(setFavorites(res.data));
      } catch (error: any) {
        console.error("error.response.data.errors",error.response.data.errors);
      }
    }
    fetchProducts();
  }, [dispatch]);

  return (
    <div className="">
      <h1 className="text-2xl font-semibold">Favorites</h1>
      <div className="w-full mt-10 flex flex-wrap justify-between gap-5">
        {products?.map((prod, idx) => (
          <ProductCard
            key={idx}
            id={prod.id}
            image={prod.product?.productImages?.[0]?.image_url || "fallback-image-url.jpg"}
            alt={prod.product?.ProductName}
            title={prod.product?.ProductName}
            price={prod.product?.Price}
            status={prod.product?.Status}
            stock={prod.product?.Stock}
          />
        ))}
      </div>
    </div>
  );
};

export default FavoritePage;
