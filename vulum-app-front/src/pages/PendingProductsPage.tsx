import React from "react";
import MyProductCard from "../components/products/MyProductCard";
import { usePendingProducts } from "../hooks-apiCalls/getAllPendingProducts";

const PendingProductsPage: React.FC = () => {
  const products = usePendingProducts();

  return (
    <div className="page-enter">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Pending Products
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review and approve products awaiting moderation.
        </p>
      </div>

      {products && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((prod, idx) => (
            <MyProductCard
              key={idx}
              id={prod.id}
              image={
                prod.productImages?.[0]?.image_url || "fallback-image-url.jpg"
              }
              alt={prod.product_name}
              title={prod.product_name}
              price={prod.price}
              status={prod.status}
              stock={prod.stock}
              page="pendings"
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">All caught up</h3>
          <p className="text-sm text-muted-foreground">
            No pending products to review.
          </p>
        </div>
      )}
    </div>
  );
};

export default PendingProductsPage;
