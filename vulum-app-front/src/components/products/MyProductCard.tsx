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

  const getStatusStyles = (s: string) => {
    switch (s) {
      case "available":
        return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400";
      case "unavailable":
        return "bg-red-500/10 text-red-700 dark:text-red-400";
      case "sold":
        return "bg-amber-500/10 text-amber-700 dark:text-amber-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-card-hover transition-all duration-300 group">
      {/* Image */}
      <Link
        to={
          page === "myProducts"
            ? `/products/${slug}`
            : `/products/view/${slug}`
        }
        className="block relative overflow-hidden aspect-[4/3]"
      >
        <img
          src={image}
          alt={alt}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </Link>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-foreground text-sm truncate">
            {title}
          </h3>
          {isFavorited ? (
            <MdOutlineFavorite
              className="text-lg shrink-0 cursor-pointer text-red-500 hover:scale-125 transition-transform"
              onClick={() => removeFavoriteProduct(id)}
            />
          ) : (
            <MdOutlineFavoriteBorder
              className="text-lg shrink-0 cursor-pointer text-muted-foreground hover:text-red-500 hover:scale-110 transition-all"
              onClick={() => addFavoriteProduct(id)}
            />
          )}
        </div>

        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-foreground">${price}</p>
          <p className="text-xs text-muted-foreground">{stock} left</p>
        </div>

        <div className="flex items-center justify-between gap-2">
          {page === "myProducts" ? (
            <Link
              to={`/products/${slug}`}
              className="text-xs px-3 py-1.5 bg-muted text-muted-foreground rounded-lg hover:bg-accent transition-colors"
            >
              Edit
            </Link>
          ) : page === "pendings" ? (
            <Button
              size="sm"
              className="text-xs h-7 bg-emerald-500 hover:bg-emerald-600 text-white"
              onClick={() => allowOnSale(id)}
            >
              Allow on Sale
            </Button>
          ) : (
            <Link
              to={`/products/view/${slug}`}
              className="text-xs px-3 py-1.5 bg-muted text-muted-foreground rounded-lg hover:bg-accent transition-colors"
            >
              View
            </Link>
          )}

          {page === "pendings" ? (
            <Button
              size="sm"
              variant="outline"
              className="text-xs h-7"
              onClick={() => disallowOnSale(id)}
            >
              Deny
            </Button>
          ) : (
            <span
              className={`text-xs px-2 py-1 rounded-md font-medium ${getStatusStyles(
                product?.status || status
              )}`}
            >
              {product?.status || status}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProductCard;
