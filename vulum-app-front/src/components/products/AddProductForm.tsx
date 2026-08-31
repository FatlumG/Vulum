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
import axios from "axios";
import Select from "../ui/select";
import { CategoryInterface } from "../../interfaces/CategoryInterface";
import { useNavigate } from "react-router-dom";
import { startLoading, stopLoading } from "../../features/loading/loadingSlice";
import { useDispatch, useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, ProductForm } from "../../validation/productSchema";
import { notify } from "../../utils/notify";

interface AddProductFormProps {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

interface AddProductInterface {
  product_name: string;
  product_description: string;
  price: number;
  stock: number;
  category: number | null;
  created_by: number | null;
}

const AddProductForm = forwardRef<HTMLFormElement, AddProductFormProps>(
  ({ onSubmit }, ref) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { price, onChange, onBlur } = usePriceInput("");
    const [images, setImages] = useState<File[]>([]);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
      0
    );
    const [categories, setCategories] = useState<CategoryInterface[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<number>();
    const [product, setProduct] = useState<AddProductInterface>(() => ({
      product_name: "",
      product_description: "",
      price: 0,
      stock: 1,
      category: null,
      created_by: null,
    }));

    const {
      register,
      handleSubmit,
      control,
      reset,
      formState: { errors },
    } = useForm<ProductForm>({
      resolver: zodResolver(productSchema),
      defaultValues: {
        product_name: "",
        product_description: "",
        price: 0,
        stock: 1,
      },
    });

    useEffect(() => {
      const fetchCategories = async () => {
        try {
          // dispatch(startLoading());
          // console.log("Fetching categories");
          const res = await api.get("/categories");
          setCategories(res.data.rows);
          console.log(res.data.rows, "res.data.rows");
          // dispatch(stopLoading());
        } catch (error) {
          console.error("Error fetching categories:", error);
        } finally {
          // dispatch(stopLoading());
        }
      };

      const initialize = async () => {
        const id = await getUserIdFromToken();
        setProduct((prev) => ({
          ...prev,
          created_by: id,
        }));
      };

      initialize();
      fetchCategories();
    }, []);

    useEffect(() => {
      if (categories.length > 0 && product.category === null) {
        setProduct((prev) => ({
          ...prev,
          category: categories[0].id,
        }));
        setSelectedCategory(categories[0].id);
      }
    }, [categories]);

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
    async function buildRequestBody(data: ProductForm) {
      const userId = await getUserIdFromToken();

      const uploadedImageUrls = await Promise.all(
        images.map((file) => uploadToCloudinary(file))
      );

      const imagesForRequest = uploadedImageUrls.map((url) => ({
        image_url: url,
      }));

      const requestBody = {
        product: {
          product_name: data.product_name,
          product_description: data.product_description,
          price: Number(data.price),
          stock: Number(data.stock),
          category_id: Number(selectedCategory),
          created_by: userId,
        },
        images: imagesForRequest,
      };
      console.log(requestBody, "requestBody");

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

    // const addProduct = async (data: ProductForm) => {
    //   dispatch(startLoading());

    //   try {
    //     const requestBody = await buildRequestBody(data);
    //     await api.post("/products", requestBody);

    //     dispatch(stopLoading());
    //     setProduct({
    //       ProductName: "",
    //       ProductDescription: "",
    //       Price: 0,
    //       Stock: 1,
    //       Category: categories?.length ? categories[0].id : null,
    //       CreatedBy: null,
    //     });

    //     setImages([]);
    //     setSelectedImageIndex(null);

    //     navigate("/products");
    //   } catch (err: any) {
    //     dispatch(stopLoading());
    //     console.error(err.response.data, "err.response.data.message");
    //   } finally {
    //     dispatch(stopLoading());
    //   }
    // };

    const addProduct = async (data: ProductForm) => {
      dispatch(startLoading());

      try {
        const requestBody = await buildRequestBody(data);
        await api.post("/products", requestBody);

        dispatch(stopLoading());

        // Show success toast BEFORE navigating
        notify.success("Product added successfully!");

        reset();
        setImages([]);
        setSelectedImageIndex(null);

        // Small delay so toast is visible (optional)
        setTimeout(() => {
          navigate("/products");
        }, 500);
      } catch (err: any) {
        dispatch(stopLoading());

        const message =
          err.response?.data?.message || "❌ Failed to add product";
        notify.error(message);

        console.error(err.response, "err.response");
      }
    };

    const onError = (errors: any) => {
      const firstError = Object.values(errors)[0] as any;
      if (firstError?.message) {
        notify.error(firstError.message);
      }
    };

    return (
      <form
        className="mt-5 grid grid-cols-1 lg:grid-cols-5 grid-rows-auto lg:grid-rows-3 gap-5"
        onSubmit={handleSubmit(addProduct, onError)}
        ref={ref}
      >
        <div className="col-span-1 lg:col-span-3 row-span-2 grid grid-rows-6 gap-5 bg-card border border-border p-7 rounded-2xl">
          <span className="row-span-1 font-semibold text-lg">General Info</span>
          <div className="row-span-2">
            <Label htmlFor="pName">Product Name</Label>
            <Controller
              name="product_name"
              control={control}
              defaultValue="" // let RHF handle initial value
              render={({ field }) => (
                <Input
                  type="text"
                  id="pName"
                  placeholder="Product Name"
                  {...field} // RHF manages value & onChange
                />
              )}
            />
          </div>
          <div className="row-span-3">
            <Label htmlFor="pDesc">Product Description</Label>
            <Controller
              name="product_description"
              control={control} // make sure you extract `control` from useForm
              defaultValue={product.product_description} // optional: initial state
              render={({ field }) => (
                <textarea
                  id="pDesc"
                  placeholder="Product Description"
                  className={cn(
                    "flex h-24 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none"
                  )}
                  {...field} // RHF now controls value & onChange
                />
              )}
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
            <div className="w-60 h-64 relative group bg-card border border-border rounded-xl cursor-pointer hover:scale-[1.01] transition overflow-hidden">
              {images[selectedImageIndex || 0] instanceof File && (
                <>
                  <img
                    src={URL.createObjectURL(images[selectedImageIndex || 0])}
                    alt="Image"
                    className="w-full h-full object-cover transition duration-200 group-hover:brightness-50"
                  />
                  <IoTrashBin
                    onClick={() => handleRemoveImage(selectedImageIndex || 0)}
                    className="w-6 h-6 p-1 absolute bottom-2 right-2 text-red-500 bg-card rounded-lg cursor-pointer hover:transform hover:scale-110"
                  />
                </>
              )}
            </div>
          </div>
          <div className="relative w-full h-20 bg-card border border-border rounded-xl grid place-items-center cursor-pointer hover:scale-[1.03] transition">
            <Input
              type="file"
              id="pImage"
              placeholder="Product Images"
              className="h-full absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleAddImage}
            />
            <FaPlusCircle className="text-primaryBlue" />
          </div>
        </div>
        <div className="col-span-1 lg:col-span-3 row-span-2 grid grid-cols-2 grid-rows-3 gap-5 bg-card border border-border p-7 rounded-2xl">
          <span className="row-span-1 col-span-2 font-semibold text-lg">
            Pricing and Stock
          </span>

          <div className="row-span-2 col-span-1">
            <Label htmlFor="pPrice">Product Price</Label>
            <Controller
              name="price"
              control={control}
              defaultValue={0} // start as number
              render={({ field }) => (
                <Input
                  type="number"
                  id="pPrice"
                  {...field}
                  value={field.value ?? 0} // ensure number, not string
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value === "" ? 0 : Number(value)); // always a number
                  }}
                  step={0.01}
                  min={0}
                  max={999999.99}
                  placeholder="Enter price"
                  className="input-class"
                />
              )}
            />
          </div>
          <div className="row-span-1 col-span-1">
            <Label htmlFor="pStock">Product Stock</Label>
            <Input
              type="text"
              id="pStock"
              {...register("stock", { valueAsNumber: true })}
              placeholder="Product Stock"
              value={product.stock}
              onChange={(e) =>
                setProduct({ ...product, stock: Number(e.target.value) })
              }
            />
          </div>
        </div>
        <div className="col-span-1 lg:col-span-2 row-span-2 flex flex-col gap-5 bg-card border border-border p-7 rounded-2xl">
          <Select
            label="Product Category"
            options={categories ?? []}
            value={selectedCategory}
            onChange={(id) => {
              setSelectedCategory(id);
              setProduct((prev) => ({ ...prev, category: id }));
            }}
          />
          <Button
            type="button"
            className="rounded-xl bg-primaryBlue hover:bg-darkBlue text-white relative transition-all duration-300 active:-translate-y-[2px]"
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
