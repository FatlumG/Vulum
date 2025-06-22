import React, { useState, useEffect } from "react";
// import { Button } from "../components/ui/button";
import google from "../assets/icons/google.svg";
import ProductCard from "../components/products/ProductCard";
import api from "../auth/api";
import { ProductInterface } from "../interfaces/ProductInterface";
import { Link } from "react-router-dom";

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<[ProductInterface]>();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await api.get("/products/my-products");
        // console.log(res.data, "res.data");
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }

    fetchProducts();
  }, []);

  products?.map((prod) => {
    if (prod.productImages.length > 0) {
      console.log(prod.productImages[0].image_url);
    }
    else {
      console.log("no imamges found!!");
    }
  });

  return (
    <div className="col-span-10 py-5 font-NunitoSans">
      <div className="flex flex-col gap-10 items-start h-80 w-full mt-5 ms-2 p-10 bg-blue-500 text-white rounded-md">
        <h1 className="text-2xl font-semibold">Enjoy your online bussines!</h1>
        <p>Add your own products and start selling.</p>
        <Link
          to="/products/add-product"
          className="bg-orangeBtn py-2 px-4 rounded-lg text-sm hover:bg-primary/90 transition duration-300"
        >
          Add your product
        </Link>
      </div>
      <div className="m-5 mt-10 grid grid-cols-3 gap-5">
        {products?.map((prod, idx) => (
          <ProductCard
            key={idx}
            image={prod.productImages[0]?.image_url || 'fallback-image-url.jpg'}
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
