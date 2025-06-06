import React, { FC, useState, useEffect } from "react";
import Header from "../components/Header";
import DashboardSidebar from "../components/DashboardSidebar";
import google from "../assets/icons/google.svg";
import ProductCard from "../components/ProductCard";
import api from "../auth/api";
import { ProductInterface } from "../interfaces/ProductInterface";

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<[ProductInterface]>([]);

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
    <div>
      <Header />
      <div className="grid grid-cols-12">
        <DashboardSidebar classes="col-span-2" />
        <div className="col-span-10 py-5 px-10 font-NunitoSans">
          <h1>This is products page</h1>
          <div className="flex flex-col gap-10 items-start h-80 w-full mt-5 ms-2 p-10 bg-blue-500 text-white rounded-md">
            <h1 className="text-2xl font-semibold">
              Enjoy your online bussines
            </h1>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
            <button className="bg-orangeBtn py-3 px-5 rounded-lg">
              Get Started
            </button>
          </div>
          <div className="m-5 grid grid-cols-3 gap-5">
            {products.map((prod, idx) => (
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
      </div>
    </div>
  );
};

export default ProductsPage;
