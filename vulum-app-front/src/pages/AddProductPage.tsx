import React, { useRef } from "react";
import AddProductForm from "../components/products/AddProductForm";
import { Button } from "../components/ui/button";

const AddProductPage: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);

  const handleFormSubmit = () => {
    console.log("Received submit from child");
  };

  const handleAddClick = () => {
    formRef.current?.requestSubmit();
  };

  return (
    <div className="page-enter">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Create New Product
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Fill in the details to list a new product.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Save Draft
          </Button>
          <Button
            size="sm"
            className="bg-primaryBlue hover:bg-darkBlue text-white"
            onClick={handleAddClick}
          >
            Add Product
          </Button>
        </div>
      </div>
      <AddProductForm onSubmit={handleFormSubmit} ref={formRef} />
    </div>
  );
};

export default AddProductPage;
