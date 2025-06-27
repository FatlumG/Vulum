import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addProduct } from "../features/products/productSlice";
import { setProducts } from "../features/products/productSlice";
import ProductCard from "../components/products/ProductCard";
import { ProductInterface } from "../interfaces/ProductInterface";
import { Link } from "react-router-dom";
import api from "../auth/api";

const ProductsPage: React.FC = () => {
  const [products, setLocalProducts] = useState<ProductInterface[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await api.get("/products/my-products");
        // console.log(res.data, "res.data");
        setLocalProducts(res.data);
        dispatch(setProducts(res.data));
      } catch (error) {
        console.error(error);
      }
    }
    fetchProducts();
  }, [dispatch]);

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
          <ProductCard
            key={idx}
            id={prod.id}
            image={prod.productImages[0]?.image_url || "fallback-image-url.jpg"}
            alt={prod.ProductName}
            title={prod.ProductName}
            price={prod.Price}
            status={prod.Status}
            stock={prod.Stock}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
