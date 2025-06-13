import React, { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { usePriceInput } from "../../hooks/price-handle";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { FaPlusCircle } from "react-icons/fa";
import PicUploads from "./PicUploads";
import api from "../../auth/api";

const AddProductForm = () => {
  const { price, onChange, onBlur } = usePriceInput("");
  const [product, setProduct] = useState({
    ProductName: "",
    ProductDescription: "",
    Price: 0,
    Stock: 1,
    Category: 1,
    CreatedBy: 46,
  });

  const addProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(product, "product");
    // const newProduct = {
    //   ...product,
    //   Price: Number(price),
    // };
    try {
      const res = await api.post("/products", product);
      console.log(res.data, "res.data");
      console.log(product.Price, "product.Price");
    } catch (err: any) {
      if (err.response) {
        // Server responded with a status other than 2xx
        // console.error("Validation errors:", err.response.data.errors);
        console.error("Error data:", err.response.data);
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
        <span className="row-span-1 font-semibold text-lg">Upload Images</span>
        <div className="flex gap-2">
          <div className="flex flex-col gap-2">
            <PicUploads />
            <PicUploads />
            <PicUploads />
          </div>
          <div className="w-60 h-64 bg-white rounded-md cursor-pointer hover:scale-[1.03] transition"></div>
        </div>
        <div className="relative w-full h-20 bg-white rounded-md grid place-items-center cursor-pointer hover:scale-[1.03] transition">
          <Input
            type="file"
            id="pImage"
            placeholder="Product Images"
            className="h-full absolute inset-0 opacity-0 cursor-pointer"
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
        <Label htmlFor="pCategory">Product Category</Label>
        <Input
          type="number"
          id="pCategory"
          placeholder="Product Category"
          value={product.Category}
          onChange={(e) =>
            setProduct({ ...product, Category: Number(e.target.value) })
          }
        />
        <Button className="rounded-3xl bg-primaryBlue">Add Category</Button>
      </div>
    </form>
  );
};

export default AddProductForm;
