import React, { useRef } from "react";
import AddProductForm from "../components/products/AddProductForm";
import { Button } from "../components/ui/button";
import { useSelector } from "react-redux";
import { HashLoader } from "react-spinners";
import { RootState } from "../app/store";

const AddProductPage: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);

  const isLoading = useSelector((state: RootState) => state.loading.isLoading);

  const handleFormSubmit = () => {
    console.log("Received submit from child");
  };

  const handleAddClick = () => {
    formRef.current?.requestSubmit();
  };

  if (isLoading)
    return (
      <div>
        <HashLoader color="#000" size={50} />
      </div>
    );
  return (
    <>
      <div className="w-full my-7 flex justify-between">
        <span className="text-2xl">Create New Product</span>
        <div className="flex gap-3">
          <Button className="rounded-3xl bg-primaryBlue">Save Draft</Button>
          <Button
            className="rounded-3xl bg-primaryBlue"
            onClick={handleAddClick}
          >
            Add Product
          </Button>
        </div>
      </div>
      <AddProductForm onSubmit={handleFormSubmit} ref={formRef} />
    </>
  );
};

export default AddProductPage;
