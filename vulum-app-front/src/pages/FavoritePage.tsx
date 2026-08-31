import React from "react";
import ProductCard from "../components/products/MyProductCard";
import { getMyFavorites } from "../hooks-apiCalls/getMyFavoritesHook";

const FavoritePage: React.FC = () => {
  const products = getMyFavorites();

  return (
    <div className="page-enter">
      <h1 className="text-2xl font-bold text-foreground tracking-tight mb-6">
        Favorites
      </h1>
      {products && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((prod) => (
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
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">No favorites yet</h3>
          <p className="text-sm text-muted-foreground">
            Products you favorite will appear here.
          </p>
        </div>
      )}
    </div>
  );
};

export default FavoritePage;
