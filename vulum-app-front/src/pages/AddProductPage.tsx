import React from "react";
import AddProductForm from "../components/products/AddProductForm";

const AddProductPage = () => {
  return (
    <div className="w-[95%]">
      <div className="text-2xl">Create New Product</div>
      <AddProductForm />
    </div>
  );
};

export default AddProductPage;
