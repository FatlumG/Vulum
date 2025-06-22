import { FC } from "react";
import favourite from "../../assets/figures/favourite.svg";

interface ProductCardProps {
  image: string;
  alt: string;
  title: string;
  price: number;
}

const ProductCard: FC<ProductCardProps> = ({ image, alt, title, price }) => {
  return (
    <div className="h-[400px] w-[300px] bg-white rounded-xl grid grid-rows-3 shadow-xl">
      <div className="w-full h-full row-span-2">
        <img
          src={image}
          alt={alt}
          className="p-2 w-full h-full object-cover rounded-2xl"
        />
      </div>
      <div className="px-5 py-4 row-span-1 flex flex-col justify-between items-start">
        <div className="flex items-center justify-between w-full">
          <h2>{title}</h2>
          <img
            src={favourite}
            alt="Favourite Icon"
            className="bg-slate-100 p-2 w-9 h-9 rounded-[50%] cursor-pointer"
          />
        </div>
        <p className="text-sm">${price}</p>
        <button className="text-sm mt-2 px-3 py-2 bg-slate-200 rounded-xl cursor-pointer">
          Edit product
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
