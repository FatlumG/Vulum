import React from "react";
import MyProductCard from "../components/products/MyProductCard";
import { Link } from "react-router-dom";
import { getMyProducts } from "../hooks-apiCalls/getMyProductsHook";
import { Button } from "../components/ui/button";

const MyProductsPage: React.FC = () => {
  const products = getMyProducts();

  return (
    <div className="page-enter">
      {/* Hero Banner */}
      <div className="flex flex-col gap-4 items-start w-full p-8 bg-gradient-to-r from-primaryBlue to-indigo-600 text-white rounded-2xl mb-8">
        <h1 className="text-2xl font-bold">
          Your product collection
        </h1>
        <p className="text-blue-100 text-sm">
          Manage your products and track their performance.
        </p>
        <Link to="/products/add-product">
          <Button className="bg-white text-primaryBlue hover:bg-white/90 shadow-sm mt-2">
            Add your product
          </Button>
        </Link>
      </div>

      {/* Products Grid */}
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
              page="myProducts"
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">No products yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Start by adding your first product.
          </p>
          <Link to="/products/add-product">
            <Button size="sm">Add Product</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyProductsPage;
