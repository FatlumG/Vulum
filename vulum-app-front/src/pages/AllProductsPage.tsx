import React from "react";
import MyProductCard from "../components/products/MyProductCard";
import { Link } from "react-router-dom";
import { useAllProducts } from "../hooks/getAllProductsHook";

const AllProductsPage: React.FC = () => {
  const products = useAllProducts();

  return (
    <div className="col-span-10 py-5 font-NunitoSans">
      <div className="flex flex-col gap-10 items-start h-80 w-full mt-5 p-10 bg-blue-500 text-white rounded-md">
        <h1 className="text-2xl font-semibold">Enjoy your online bussines!</h1>
        <p>Add your own products and start selling.</p>
        <Link
          to="/products/add-product"
          className="bg-orangeBtn py-2 px-4 rounded-lg text-sm hover:bg-primary/90 transition duration-300"
        >
          Add your product
        </Link>
      </div>
      <div className="w-full mt-10 flex flex-wrap justify-between gap-5">
        {products?.map((prod, idx) => (
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
          />
        ))}
      </div>
    </div>
  );
};

export default AllProductsPage;
