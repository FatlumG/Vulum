import React, { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { getProduct } from "../hooks/getProduct";
import { useParams } from "react-router-dom";
import { useOrderProduct } from "../hooks/orderProduct";
import { Link } from "react-router-dom";

const ViewProductPage: React.FC = () => {
  const { slug } = useParams();
  const id = slug?.split("-").pop();
  if (!id) return <p>Invalid product ID</p>;
  const product = getProduct(id);

  const [images, setImages] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (product) {
      setImages(product.productImages.map((image) => image.image_url));
    }
  }, [product]);

  return (
    <>
      <span className="text-2xl">View Product</span>
      <div className="mt-10 flex gap-10">
        <div className="h-[500px] w-[60%]">
          <img
            src={product?.productImages?.[selectedIndex]?.image_url || ""}
            alt={product?.ProductName}
            className="h-[80%] w-full object-cover rounded-md"
          />

          <div className="flex gap-2 mt-2 h-[20%] overflow-x-auto">
            {product?.productImages?.map((img, index) => (
              <img
                key={index}
                src={img.image_url}
                alt={`Thumbnail ${index + 1}`}
                className={`h-full w-auto object-cover cursor-pointer border rounded-md 
              ${
                selectedIndex === index ? "border-blue-500" : "border-gray-300"
              }`}
                onClick={() => setSelectedIndex(index)}
              />
            ))}
          </div>
        </div>
        <div className="w-[30%] flex flex-col gap-5">
          <h2 className="text-2xl font-semibold">{product?.ProductName}</h2>
          <p>
            <span className="font-semibold">Description:</span>{" "}
            {product?.ProductDescription}
          </p>
          <p>
            <span className="font-semibold">Price:</span> ${product?.Price}
          </p>
          <p>
            <span className="font-semibold">Stock:</span> {product?.Stock}
          </p>
          <p>
            <span className="font-semibold">Category:</span> {/* @ts-ignore */}
            {product?.category.CategoryName}
          </p>
          <Button
            className="rounded-3xl bg-primaryBlue"
            onClick={() => product?.id && useOrderProduct(Number(product.id))}
          >
            Send Order
          </Button>
        </div>
      </div>
    </>
  );
};

export default ViewProductPage;
