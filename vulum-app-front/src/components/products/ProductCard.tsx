import { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../auth/api";
import { MdOutlineFavoriteBorder } from "react-icons/md";
import { MdOutlineFavorite } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  addFavorite,
  removeFavorite,
} from "../../features/products/favoriteSlice";

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
  // const [favProduct, setFavProduct] = useState<number>();

  const dispatch = useDispatch();

  async function addFavoriteProduct(id: number) {
    try {
      dispatch(addFavorite(id));
      console.log(id, "id");
      await api.post("/favorites", { product_id: id });
    } catch (error: any) {
      console.error("error.response.data", error.response.data);
    }
  }

  async function removeFavoriteProduct(id: number) {
    try {
      await api.delete(`/favorites/${id}`);
      dispatch(removeFavorite(id));
      console.log("Product deleted successfully!", id);
    } catch (error: any) {
      console.error("error.response.data.errors", error.response.data.errors);
    }
  }

  const favorites = useSelector((state: any) => state.favorites || []);
  const isFavorited = favorites.some((fav: any) => fav.id === id);
  const slug = `${(title ?? "product")
    .toLowerCase()
    .replace(/\s+/g, "-")}-${id}`;

  function toggleFavoriteProduct(id: number) {
    if (isFavorited) {
      removeFavoriteProduct(id);
    } else {
      addFavoriteProduct(id);
    }
  }

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
          {isFavorited ? (
            <MdOutlineFavorite
              className="text-2xl cursor-pointer text-red-500 hover:scale-150 transition-all"
              onClick={() => toggleFavoriteProduct(id)}
            />
          ) : (
            <MdOutlineFavoriteBorder
              className="text-2xl cursor-pointer hover:scale-105 transition-all"
              onClick={() => toggleFavoriteProduct(id)}
            />
          )}
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
