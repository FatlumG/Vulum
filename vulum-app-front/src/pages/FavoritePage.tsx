import React from "react";
import ProductCard from "../components/products/MyProductCard";
import { getMyFavorites } from "../hooks/getMyFavoritesHook";

const FavoritePage: React.FC = () => {
  const products = getMyFavorites();

  return (
    <div className="">
      <h1 className="text-2xl font-semibold">Favorites</h1>
      <div className="w-full mt-10 flex flex-wrap justify-between gap-5">
        {products?.map((prod) => (
          <ProductCard
            key={prod.id}
            id={prod.id}
            image={
              prod.product?.productImages?.[0]?.image_url ||
              "fallback-image-url.jpg"
            }
            alt={prod.product?.product_name}
            title={prod.product?.product_name}
            price={prod.product?.price}
            status={prod.product?.status}
            stock={prod.product?.stock}
          />
        ))}
      </div>
    </div>
  );
};

export default FavoritePage;
