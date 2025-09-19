import { FC } from "react";
import { Link } from "react-router-dom";
import api from "../../auth/api";
import { MdOutlineFavorite, MdOutlineFavoriteBorder } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  addFavorite,
  removeFavorite,
} from "../../features/products/favoriteSlice";
import { updateProdStatus } from "../../features/products/productSlice";
import { Button } from "../ui/button";
import { notify } from "../../utils/notify";

interface ProductCardProps {
  id: number;
  image: string;
  alt: string;
  title: string;
  price: number;
  status: string;
  stock: number;
  page?: string;
}

const MyProductCard: FC<ProductCardProps> = ({
  id,
  image,
  alt,
  title,
  price,
  status,
  stock,
  page,
}) => {
  const dispatch = useDispatch();
  const slug = `${(title ?? "product")
    .toLowerCase()
    .replace(/\s+/g, "-")}-${id}`;
  const favoriteIds = useSelector((state: any) => state.favorites.favoriteIds);
  const isFavorited = favoriteIds.includes(id);
  const product = useSelector((state: any) =>
    state.products.find((p: any) => p.id === id)
  );

  async function addFavoriteProduct(id: number) {
    try {
      await api.post("/favorites", { product_id: id });
      dispatch(addFavorite(id));
      console.log("added favorite");
    } catch (error: any) {
      if (error.response?.data?.message === "This Product is already saved!") {
        removeFavoriteProduct(id);
      } else {
        console.error("error.response.data.errors", error.response.data.errors);
        console.error("Add favorite error:", error.response?.data);
      }
    }
  }
  async function removeFavoriteProduct(id: number) {
    try {
      await api.delete(`/favorites/${id}`);
      dispatch(removeFavorite(id));
      console.log("deleted favorite");
    } catch (error: any) {
      console.error("error.response.data.errors", error.response.data.errors);
    }
  }

  async function allowOnSale(id: number) {
    try {
      await api.patch(`/products/${id}`, { status: "available" });
      dispatch(updateProdStatus({ id, status: "available" }));
      window.location.reload();
      notify.success("Product allowed for sale!");
    } catch (error) {
      notify.error("Failed to allow product for sale!");
      console.error(error);
    }
  }

  async function disallowOnSale(id: number) {
    try {
      await api.patch(`/products/${id}`, { status: "unavailable" });
      dispatch(updateProdStatus({ id, status: "unavailable" }));
      window.location.reload();
      notify.success("Product disallowed from sale!");
    } catch (error) {
      notify.error("Failed to disallow product from sale!");
      console.error(error);
    }
  }

  return (
    <div className="h-[400px] w-[300px] my-2 bg-white rounded-xl grid grid-rows-3 shadow-xl">
      <Link
        to={`${
          page === "myProducts" ? `/products/${slug}` : `/products/view/${slug}`
        }`}
        className="w-full h-full row-span-2"
      >
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
              onClick={() => removeFavoriteProduct(id)}
            />
          ) : (
            <MdOutlineFavoriteBorder
              className="text-2xl cursor-pointer hover:scale-105 transition-all"
              onClick={() => addFavoriteProduct(id)}
            />
          )}
        </div>
        <div className="w-full flex justify-between items-center">
          <p className="text-sm">${price}</p>
          <p className="text-sm">{stock} left</p>
        </div>
        <div className="w-full flex justify-between items-center">
          {page === "myProducts" ? (
            <Link
              to={`/products/${slug}`}
              className="text-sm px-3 py-2 bg-slate-200 rounded-xl cursor-pointer"
            >
              Edit product
            </Link>
          ) : page === "pendings" ? (
            <Button
              className="text-sm px-3 py-2 bg-slate-500 rounded-xl text-white cursor-pointer hover:"
              onClick={() => allowOnSale(id)}
            >
              Allow on Sale
            </Button>
          ) : (
            <Link
              to={`/products/view/${slug}`}
              className="text-sm px-3 py-2 bg-slate-200 rounded-xl cursor-pointer"
            >
              View Product
            </Link>
          )}
          {page === "pendings" ? (
            <Button
              className="text-sm px-3 py-2 bg-slate-500 rounded-xl text-white cursor-pointer hover:"
              onClick={() => disallowOnSale(id)}
            >
              Don't Allow
            </Button>
          ) : (
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
              {product?.status || status}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProductCard;
