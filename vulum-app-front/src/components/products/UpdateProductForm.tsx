import React, { forwardRef, FormEvent, useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { usePriceInput } from "../../hooks-apiCalls/price-handle";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { FaPlusCircle } from "react-icons/fa";
import { IoTrashBin } from "react-icons/io5";
import PicUploads from "./PicUploads";
import api from "../../auth/api";
import Select from "../ui/select";
import { CategoryInterface } from "@/interfaces/CategoryInterface";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { notify } from "../../utils/notify";
import { startLoading, stopLoading } from "../../features/loading/loadingSlice";
import { useDispatch } from "react-redux";

interface UpdateProductFormProps {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

type ImageType = File | { image_url: string };

const UpdateProductForm = forwardRef<HTMLFormElement, UpdateProductFormProps>(
  ({ onSubmit }, ref) => {
    const { price, onChange, onBlur } = usePriceInput("");
    const [images, setImages] = useState<ImageType[]>([]);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
      0
    );
    const [categories, setCategories] = useState<CategoryInterface[]>();
    const [selectedCategory, setSelectedCategory] = useState<number>();
    const [product, setProduct] = useState({
      id: 0,
      ProductName: "",
      ProductDescription: "",
      Price: 0,
      Stock: 1,
      Category: selectedCategory as number,
    });

    const navigate = useNavigate();
    const { slug } = useParams();
    const id = slug?.split("-").pop();

    useEffect(() => {
      const getProduct = async () => {
        try {
          const res = await api.get(`/products/${id}`);
          setProduct(res.data);
          setImages(res.data.productImages);
        } catch (error: any) {
          notify.error(error.response.data.message);
          console.error(error.message, "error.message");
        }
      };
      getProduct();
    }, [id]);

    useEffect(() => {
      const fetchCategories = async () => {
        try {
          const res = await api.get("/categories");
          // console.log(res.data.rows, "res.data.rows");
          setCategories(res.data.rows);
        } catch (error) {
          notify.error("Failed to fetch categories");
          console.error("Error fetching categories:", error);
        }
      };
      fetchCategories();
    }, []);

    async function getUserIdFromToken(): Promise<number | null> {
      const token = localStorage.getItem("token");

      if (!token) return null;
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        // console.log(payload.userId ?? null, "payload.userId ?? null");
        return payload.userId ?? null;
      } catch (error) {
        console.error("Failed to decode token:", error);
        return null;
      }
    }
    // async function uploadToCloudinary(file: ImageType): Promise<void> {
    //   const formData = new FormData();
    //   if (file instanceof File) formData.append("file", file);
    //   formData.append("upload_preset", "vulum_upload_preset"); // replace this
    //   formData.append("folder", "products"); // to organize uploads
    //   try {
    //     const response = await axios.post(
    //       `https://api.cloudinary.com/v1_1/dawa2plry/image/upload`,
    //       formData,
    //       {
    //         headers: { "Content-Type": "multipart/form-data" },
    //       }
    //     );
    //     return response.data.secure_url;
    //   } catch (error: any) {
    //     throw new Error(
    //       error.response?.data?.error?.message || "Cloudinary upload failed"
    //     );
    //   }
    // }
    async function buildRequestBody() {
      console.log(product.Category, "product");

      return {
        ProductName: product.ProductName,
        ProductDescription: product.ProductDescription,
        Price: Number(product.Price),
        Stock: Number(product.Stock),
        // @ts-ignore
        Category: Number(product.category.id),
      };
    }

    const updateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      try {
        const requestBody = await buildRequestBody();
        await api.put(`/products/${product.id}`, requestBody);
        navigate("/my-products");
        notify.success("Product updated successfully!");
      } catch (error: any) {
        notify.error(error.response.data.message);
        console.error(error);
        console.error("Validation errors:", error.response.data);
      }
    };

    const selectedIndex = selectedImageIndex !== null ? selectedImageIndex : 0;
    const selectedImage = images[selectedIndex];

    return (
      <form
        className="mt-5 grid grid-cols-1 lg:grid-cols-5 grid-rows-auto lg:grid-rows-3 gap-5"
        onSubmit={updateProduct}
        ref={ref}
      >
        <div className="col-span-1 lg:col-span-3 row-span-2 grid grid-rows-6 gap-5 bg-card border border-border p-7 rounded-2xl">
          <span className="row-span-1 font-semibold text-lg">General Info</span>
          <div className="row-span-2">
            <Label htmlFor="pName">Product Name</Label>
            <Input
              type="text"
              id="pName"
              placeholder="Product Name"
              value={product.ProductName}
              onChange={(e) =>
                setProduct({ ...product, ProductName: e.target.value })
              }
            />
          </div>
          <div className="row-span-3">
            <Label htmlFor="pDesc">Product Description</Label>
            <textarea
              id="pDesc"
              placeholder="Product Description"
              className={cn(
                "flex h-24 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none"
              )}
              value={product.ProductDescription}
              onChange={(e) =>
                setProduct({ ...product, ProductDescription: e.target.value })
              }
            />
          </div>
        </div>
        <div className="col-span-1 lg:col-span-2 row-span-2 flex flex-col gap-5 bg-card border border-border p-7 rounded-2xl">
          <span className="row-span-1 font-semibold text-lg">
            Upload Images
          </span>
          <div className="flex gap-3 w-80">
            <div
              className={`flex flex-col gap-2 w-[110px] h-[250px] overflow-x-hidden ${
                images.length > 3 ? "overflow-y-scroll" : "overflow-y-hidden"
              } `}
            >
              {images.map((img, index) => {
                const src =
                  img instanceof File
                    ? URL.createObjectURL(img)
                    : img.image_url;
                return (
                  <PicUploads
                    key={index}
                    src={src}
                    onClick={() => setSelectedImageIndex(index)}
                  />
                );
              })}
            </div>
            <div className="w-60 h-64 relative group bg-card border border-border rounded-xl cursor-pointer hover:scale-[1.01] transition overflow-hidden">
              {images[selectedImageIndex || 0] && (
                <>
                  <img
                    src={
                      selectedImage instanceof File
                        ? URL.createObjectURL(selectedImage)
                        : selectedImage.image_url
                    }
                    alt="Image"
                    className="w-full h-full object-cover transition duration-200 group-hover:brightness-50"
                  />
                  <IoTrashBin
                    // onClick={() => handleRemoveImage(selectedImageIndex || 0)}
                    className="w-6 h-6 p-1 absolute bottom-2 right-2 text-red-500 bg-card rounded-lg cursor-pointer hover:transform hover:scale-110"
                  />
                </>
              )}
            </div>
          </div>
          <div className="relative w-full h-20 bg-card border border-border rounded-xl grid place-items-center cursor-pointer hover:scale-[1.03] transition">
            <Input
              // type="file"
              id="pImage"
              placeholder="Product Images"
              className="h-full absolute inset-0 opacity-0 cursor-not-allowed"
              title="This option is currently disabled."
              // onChange={handleAddImage}
            />
            <FaPlusCircle className="text-primaryBlue" />
          </div>
          <div>
            <Label htmlFor="pImage">Product Images</Label>
          </div>
        </div>
        <div className="col-span-1 lg:col-span-3 row-span-2 grid grid-cols-2 grid-rows-3 gap-5 bg-card border border-border p-7 rounded-2xl">
          <span className="row-span-1 col-span-2 font-semibold text-lg">
            Pricing and Stock
          </span>
          <div className="row-span-2 col-span-1">
            <Label htmlFor="pPrice">Product Price</Label>
            <Input
              type="number"
              id="pPrice"
              value={product.Price}
              onChange={(e) =>
                setProduct({ ...product, Price: parseFloat(e.target.value) })
              }
              onBlur={onBlur}
              step={0.01}
              min={0}
              max={999999.99}
              placeholder="Enter price"
              className="input-class"
            />
          </div>
          <div className="row-span-1 col-span-1">
            <Label htmlFor="pStock">Product Stock</Label>
            <Input
              type="text"
              id="pStock"
              placeholder="Product Stock"
              value={product.Stock}
              onChange={(e) =>
                setProduct({ ...product, Stock: Number(e.target.value) })
              }
            />
          </div>
        </div>
        <div className="col-span-1 lg:col-span-2 row-span-2 flex flex-col gap-5 bg-card border border-border p-7 rounded-2xl">
          <Select
            label="Product Category"
            options={categories ?? []}
            value={product.Category}
            onChange={(id) => {
              setSelectedCategory(id);
              setProduct((prev) => ({ ...prev, Category: id }));
            }}
          />
          <Button
            type="button"
            className="rounded-xl bg-primaryBlue hover:bg-darkBlue text-white"
            onClick={() => {}}
          >
            Add Category
          </Button>
        </div>
      </form>
    );
  }
);

export default UpdateProductForm;
