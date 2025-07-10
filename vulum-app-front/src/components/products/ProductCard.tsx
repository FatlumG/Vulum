import { FC, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../auth/api";
import { MdOutlineFavorite, MdOutlineFavoriteBorder } from "react-icons/md";
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
  const dispatch = useDispatch();
  const slug = `${(title ?? "product")
    .toLowerCase()
    .replace(/\s+/g, "-")}-${id}`;

  // const favoriteItems = useSelector(
  //   (state: any) => state.favorites.favoriteItems
  // );
  const favoriteIds = useSelector((state: any) => state.favorites.favoriteIds);
  const isFavorited = favoriteIds.includes(id);

  // useEffect(() => {
  //   console.log(favoriteItems, "favoriteItems");
  //   console.log(favoriteIds, "favoriteIds");
  // }, [favoriteItems, favoriteIds]);

  async function addFavoriteProduct(id: number) {
    try {
      console.log(id, "id");
      await api.post("/favorites", { product_id: id });
      dispatch(addFavorite(id));
    } catch (error: any) {
      if (error.response?.data?.message === "This Product is already saved!") {
        // Product is already favorited, so remove it instead
        removeFavoriteProduct(id);
      } else {
        console.error("Add favorite error:", error.response?.data);
      }
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
  const toggleFavorite = () => {
    if (isFavorited) {
      // removeFavorite(id);
      removeFavoriteProduct(id); // your API call to delete
    } else {
      // addFavorite(id);
      addFavoriteProduct(id); // your API call to add
    }
  };

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
              onClick={toggleFavorite}
            />
          ) : (
            <MdOutlineFavoriteBorder
              className="text-2xl cursor-pointer hover:scale-105 transition-all"
              onClick={toggleFavorite}
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
