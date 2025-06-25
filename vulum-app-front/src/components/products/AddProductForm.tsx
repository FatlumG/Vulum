import React, { forwardRef, FormEvent, useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { usePriceInput } from "../../hooks/price-handle";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { FaPlusCircle } from "react-icons/fa";
import { IoTrashBin } from "react-icons/io5";
import PicUploads from "./PicUploads";
import api from "../../auth/api";
import axios from "axios";
import Select from "../ui/select";
import { CategoryInterface } from "@/interfaces/CategoryInterface";

interface AddProductFormProps {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const AddProductForm = forwardRef<HTMLFormElement, AddProductFormProps>(
  ({ onSubmit }, ref) => {
    const { price, onChange, onBlur } = usePriceInput("");
    const [images, setImages] = useState<File[]>([]);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
      0
    );
    const [categories, setCategories] = useState<CategoryInterface[]>();
    const [selectedCategory, setSelectedCategory] = useState<number>();

    const [product, setProduct] = useState(() => ({
      ProductName: "",
      ProductDescription: "",
      Price: 0,
      Stock: 1,
      Category: categories?.length ? categories[0].id : null,
      CreatedBy: getUserIdFromToken(),
    }));

    useEffect(() => {
      const fetchCategories = async () => {
        try {
          const res = await api.get("/categories");
          console.log(res.data.rows, "res.data.rows");
          setCategories(res.data.rows);
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      };
      fetchCategories();
    }, []);

    // useEffect(() => {
    //   if (categories?.length && !selectedCategory) {
    //     setSelectedCategory(categories[0].id);
    //   }
    // }, []);

    async function getUserIdFromToken(): Promise<number | null> {
      const token = localStorage.getItem("token");

      if (!token) return null;
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        console.log(payload.userId ?? null, "payload.userId ?? null");
        return payload.userId ?? null;
      } catch (error) {
        console.error("Failed to decode token:", error);
        return null;
      }
    }

    async function uploadToCloudinary(file: File): Promise<void> {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "vulum_upload_preset"); // replace this
      formData.append("folder", "products"); // to organize uploads
      try {
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/dawa2plry/image/upload`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        return response.data.secure_url;
      } catch (error: any) {
        throw new Error(
          error.response?.data?.error?.message || "Cloudinary upload failed"
        );
      }
    }

    async function buildRequestBody() {
      const uploadedImageUrls = await Promise.all(
        images.map((file) => uploadToCloudinary(file))
      );

      const imagesForRequest = uploadedImageUrls.map((url) => ({
        image_url: url,
      }));

      const requestBody = {
        product: {
          ProductName: product.ProductName,
          ProductDescription: product.ProductDescription,
          Price: Number(product.Price),
          Stock: Number(product.Stock),
          Category: Number(product.Category),
        },
        images: imagesForRequest,
      };

      return requestBody;
    }
    const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];

        // Check for duplicates based on name, size, and lastModified
        const isDuplicate = images.some(
          (img) =>
            img.name === file.name &&
            img.size === file.size &&
            img.lastModified === file.lastModified
        );

        if (isDuplicate) {
          alert("This image has already been added.");
          return;
        }

        const newImages = [...images, file];
        setImages(newImages);

        if (selectedImageIndex === null) {
          setSelectedImageIndex(0);
        }
      }
    };

    const handleRemoveImage = (indexToRemove: number) => {
      const updatedImages = images.filter(
        (_, index) => index !== indexToRemove
      );
      setImages(updatedImages);

      // Adjust selected index if needed
      if (selectedImageIndex === indexToRemove) {
        setSelectedImageIndex(null);
      } else if (
        selectedImageIndex !== null &&
        selectedImageIndex > indexToRemove
      ) {
        setSelectedImageIndex(selectedImageIndex - 1);
      }
    };

    const addProduct = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      try {
        const requestBody = await buildRequestBody();
        console.log(requestBody, "requestBody");
        console.log(product.Category, "product.Category");

        await api.post("/products", requestBody);
        // console.log(res.data, "res.data");
        // console.log(res.data, "res.data");
        // console.log(product.Price, "product.Price");
      } catch (err: any) {
        if (err.response) {
          console.error("Error data:", err.response.data); // Server responded with a status other than 2xx
          console.error("Validation errors:", err.response.data.errors);
          // console.error("Error status:", err.response.status);
          // console.error("Error headers:", err.response.headers);
        } else if (err.request) {
          // Request was made but no response received
          console.error("No response received:", err.request);
        } else {
          // Something else happened
          console.error("Error message:", err.message);
        }
      }
    };

    return (
      <form
        className="mt-5 grid grid-cols-5 grid-rows-3 gap-5"
        onSubmit={addProduct}
        ref={ref}
      >
        <div className="col-span-3 row-span-2 grid grid-rows-6 gap-5 bg-gray-200 p-7 rounded-xl shadow-lg">
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
        <div className="col-span-2 row-span-2 flex flex-col gap-5 bg-gray-200 p-7 rounded-xl shadow-lg">
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
                if (!(img instanceof File)) return null;

                return (
                  <PicUploads
                    key={index}
                    src={URL.createObjectURL(img)}
                    onClick={() => setSelectedImageIndex(index)}
                  />
                );
              })}
            </div>
            <div className="w-60 h-64 relative group bg-white rounded-md cursor-pointer hover:scale-[1.01] transition overflow-hidden">
              {images[selectedImageIndex || 0] instanceof File && (
                <>
                  <img
                    src={URL.createObjectURL(images[selectedImageIndex || 0])}
                    alt="Image"
                    className="w-full h-full object-cover transition duration-200 group-hover:brightness-50"
                  />
                  <IoTrashBin
                    onClick={() => handleRemoveImage(selectedImageIndex || 0)}
                    className="w-6 h-6 p-1 absolute bottom-2 right-2 text-red-500 bg-white rounded-md cursor-pointer hover:transform hover:scale-110"
                  />
                </>
              )}
            </div>
          </div>
          <div className="relative w-full h-20 bg-white rounded-md grid place-items-center cursor-pointer hover:scale-[1.03] transition">
            <Input
              type="file"
              id="pImage"
              placeholder="Product Images"
              className="h-full absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleAddImage}
            />
            <FaPlusCircle className="text-primaryBlue" />
          </div>
          {/* <div> */}
          {/* <Label htmlFor="pImage">Product Images</Label> */}
          {/* </div> */}
        </div>
        <div className="col-span-3 row-span-2 grid grid-cols-2 grid-rows-3 gap-5 bg-gray-200 h-[180px] p-7 rounded-xl shadow-lg">
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
        <div className="col-span-2 row-span-2 flex flex-col gap-5 bg-gray-200 h-[180px] p-7 rounded-xl shadow-lg">
          {/* <Label htmlFor="pCategory">Product Category</Label>
          <Input
            type="number"
            id="pCategory"
            placeholder="Product Category"
            value={product.Category}
            onChange={(e) =>
              setProduct({ ...product, Category: Number(e.target.value) })
            }
          /> */}
          <Select
            label="Product Category"
            options={categories ?? []}
            value={selectedCategory}
            onChange={(id) => {
              setSelectedCategory(id);
              setProduct((prev) => ({ ...prev, Category: id }));
            }}
          />
          <Button
            type="button"
            className="rounded-3xl bg-primaryBlue"
            onClick={() => {}}
          >
            Add Category
          </Button>
        </div>
      </form>
    );
  }
);

export default AddProductForm;
