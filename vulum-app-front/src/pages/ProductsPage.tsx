import React, { FC, useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import google from "../assets/icons/google.svg";
import ProductCard from "../components/ProductCard";
import api from "../auth/api";
import { productInterface } from "../interfaces/ProductInterface";
import { Link } from "react-router-dom";

const ProductsPage: FC = () => {
  const [products, setProducts] = useState<[productInterface]>();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await api.get("/products/my-products");
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }

    fetchProducts();
  }, []);

  return (
    <div className="col-span-10 py-5 px-10 font-NunitoSans">
      <div className="flex flex-col gap-10 items-start h-80 w-full mt-5 ms-2 p-10 bg-blue-500 text-white rounded-md">
        <h1 className="text-2xl font-semibold">Enjoy your online bussines!</h1>
        <p>Add your own products and start selling.</p>
        <Button
          // to="/products/add-product"
          className="bg-orangeBtn py-3 px-5 rounded-lg"
        >
          Get Started
        </Button>
      </div>
      <div className="m-5 mt-10 grid grid-cols-3 gap-5">
        {products?.map((prod, idx) => (
          <ProductCard
            key={idx}
            image={google}
            alt={prod.ProductName}
            title={prod.ProductName}
            price={prod.Price}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
