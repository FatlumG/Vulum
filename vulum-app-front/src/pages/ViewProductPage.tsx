import React, { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { getProduct } from "../hooks-apiCalls/getProduct";
import { useParams } from "react-router-dom";
import { useOrderProduct } from "../hooks-apiCalls/orderProduct";

const ViewProductPage: React.FC = () => {
  const { slug } = useParams();
  const id = slug?.split("-").pop();
  if (!id) return <p className="text-muted-foreground">Invalid product ID</p>;
  const product = getProduct(id);

  const [images, setImages] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (product) {
      setImages(product.productImages.map((image: any) => image.image_url));
    }
  }, [product]);

  return (
    <div className="page-enter">
      <h1 className="text-2xl font-bold text-foreground tracking-tight mb-6">
        View Product
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Image Gallery - 3 cols */}
        <div className="lg:col-span-3">
          <div className="aspect-[4/3] w-full rounded-xl overflow-hidden bg-muted border border-border mb-3">
            <img
              src={product?.productImages?.[selectedIndex]?.image_url || ""}
              alt={product?.product_name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {product?.productImages?.map((img: any, index: number) => (
              <img
                key={index}
                src={img.image_url}
                alt={`Thumbnail ${index + 1}`}
                className={`h-16 w-16 sm:h-20 sm:w-20 object-cover rounded-lg cursor-pointer border-2 transition-all shrink-0 ${
                  selectedIndex === index
                    ? "border-primaryBlue"
                    : "border-transparent hover:border-border"
                }`}
                onClick={() => setSelectedIndex(index)}
              />
            ))}
          </div>
        </div>

        {/* Product Details - 2 cols */}
        <div className="lg:col-span-2 space-y-5">
          <h2 className="text-2xl font-bold text-foreground">
            {product?.product_name}
          </h2>

          <div className="space-y-3">
            <div className="bg-card border border-border rounded-xl p-4">
              <p className="text-xs font-medium text-muted-foreground mb-1">
                Description
              </p>
              <p className="text-sm text-foreground">
                {product?.product_description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-card border border-border rounded-xl p-4">
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Price
                </p>
                <p className="text-lg font-bold text-foreground">
                  ${product?.price}
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-4">
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Stock
                </p>
                <p className="text-lg font-bold text-foreground">
                  {product?.stock}
                </p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-4">
              <p className="text-xs font-medium text-muted-foreground mb-1">
                Category
              </p>
              <p className="text-sm text-foreground">
                {/* @ts-ignore */}
                {product?.category?.category_name}
              </p>
            </div>
          </div>

          <Button
            className="w-full bg-primaryBlue hover:bg-darkBlue text-white h-12 rounded-xl font-medium"
            onClick={() =>
              product?.id && useOrderProduct(Number(product.id))
            }
          >
            Send Order
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ViewProductPage;
