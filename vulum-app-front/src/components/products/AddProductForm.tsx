import React from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { usePriceInput } from "../../hooks/price-handle";
import { cn } from "../../lib/utils";

const AddProductForm = () => {
  const { price, onChange, onBlur } = usePriceInput("");

  return (
    <form className="mt-5 grid grid-cols-5 grid-rows-3 gap-5">
      <div className="col-span-3 row-span-2 grid grid-rows-6 gap-5 bg-slate-300 p-7 rounded-xl">
        <span className="row-span-1 font-semibold text-lg">General Info</span>
        <div className="row-span-2">
          <Label htmlFor="pName">Product Name</Label>
          <Input type="text" id="pName" placeholder="Product Name" />
        </div>
        <div className="row-span-3">
          <Label htmlFor="pDesc">Product Description</Label>
          <textarea
            id="pDesc"
            placeholder="Product Description"
            className={cn(
              "flex h-24 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none"
            )}
          />
        </div>
      </div>
      <div className="col-span-2 row-span-2 grid grid-cols-2 grid-rows-3 gap-5 bg-slate-300 p-7 rounded-xl">
        <span className="row-span-1 font-semibold text-lg">Upload Images</span>
        <Label htmlFor="pImage">Product Images</Label>
        <Input type="file" id="pImage" placeholder="Product Images" />
      </div>
      <div className="col-span-3 row-span-2 grid grid-cols-2 grid-rows-3 gap-5 bg-slate-300 h-[180px] p-7 rounded-xl">
        <span className="row-span-1 col-span-2 font-semibold text-lg">
          Pricing and Stock
        </span>
        <div className="row-span-2 col-span-1">
          <Label htmlFor="pPrice">Product Price</Label>
          <Input
            type="number"
            id="pPrice"
            value={price}
            onChange={onChange}
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
          <Input type="text" id="pStock" placeholder="Product Stock" />
        </div>
      </div>
      <div className="col-span-2 row-span-2 grid grid-cols-2 grid-rows-3 gap-5 bg-slate-300 h-[180px] p-7 rounded-xl">
        <Label htmlFor="pCategory">Product Category</Label>
        <Input type="text" id="pCategory" placeholder="Product Category" />
      </div>
    </form>
  );
};

export default AddProductForm;
