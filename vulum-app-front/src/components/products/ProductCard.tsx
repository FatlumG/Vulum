import { FC, useEffect, useState } from "react";
import favourite from "../../assets/figures/favourite.svg";
import { Link } from "react-router-dom";
import api from "../../auth/api";

interface ProductCardProps {
  id: number;
  image: string;
  alt: string;
  title: string;
  price: number;
  status: string;
  stock: number;
}

const ProductCard: FC<ProductCardProps> = ({
  id,
  image,
  alt,
  title,
  price,
  status,
  stock,
}) => {
  const [favProduct, setFavProduct] = useState<number>();

  async function addFavourites(id: number) {
    try {
      setFavProduct(id);
      console.log(favProduct, "favProduct");
      await api.post("/favorites", { product_id: id });
    } catch (error: any) {
      console.error("error.response.data", error.response.data);
    }
  }

  const slug = `${title.toLowerCase().replace(/\s+/g, "-")}-${id}`;

  return (
    <div className="h-[400px] w-[300px] my-2 bg-white rounded-xl grid grid-rows-3 shadow-xl">
      <Link to={`/products/${slug}`} className="w-full h-full row-span-2">
        <img
          src={image}
          alt={alt}
          className="p-2 w-full h-full object-cover rounded-2xl hover:scale-105 hover:brightness-50 transition-all"
        />
      </Link>
      <div className="px-5 py-4 pt-1 row-span-1 flex flex-col justify-between items-start">
        <div className="flex items-center justify-between w-full">
          <h2>{title}</h2>
          <img
            src={favourite}
            alt="Favourite Icon"
            className="bg-slate-100 p-2 w-9 h-9 rounded-[50%] cursor-pointer"
            // onClick={() => addFavourites(id)}
          />
        </div>
        <div className="w-full flex justify-between items-center">
          <p className="text-sm">${price}</p>
          <p className="text-sm">{stock} left</p>
        </div>
        <div className="w-full flex justify-between items-center">
          <Link
            to={`/products/${slug}`}
            className="text-sm px-3 py-2 bg-slate-200 rounded-xl cursor-pointer"
          >
            Edit product
          </Link>
          <p
            className={`text-sm p-1 px-2 rounded-xl ${
              status === "available"
                ? "bg-green-200"
                : status === "unavailable"
                ? "bg-red-200"
                : status === "sold"
                ? "bg-orange-200"
                : "bg-yellow-200"
            }`}
          >
            {status}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
