import React, {
  forwardRef,
  FormEvent,
  useState,
  useRef,
  useEffect,
} from "react";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { usePriceInput } from "../hooks/price-handle";
import { cn } from "../lib/utils";
import { Button } from "../components/ui/button";
import { FaPlusCircle } from "react-icons/fa";
import { IoTrashBin } from "react-icons/io5";
import PicUploads from "../components/products/PicUploads";
import api from "../auth/api";
import axios from "axios";
import Select from "../components/ui/select";
import { CategoryInterface } from "@/interfaces/CategoryInterface";
import { useParams } from "react-router-dom";
import { ProductInterface } from "@/interfaces/ProductInterface";
import UpdateProductForm from "../components/products/UpdateProductForm";

interface AddProductFormProps {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

type ImageType = File | { image_url: string };

const AddProductForm = forwardRef<HTMLFormElement, AddProductFormProps>(
  ({ onSubmit }, ref) => {
    const formRef = useRef<HTMLFormElement>(null);

    const handleFormSubmit = () => {
      console.log("Received submit from child");
    };

    const handleAddClick = () => {
      formRef.current?.requestSubmit();
    };
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
              Update Product
            </Button>
          </div>
        </div>
        <UpdateProductForm onSubmit={handleFormSubmit} ref={formRef} />
      </>
    );
  }
);

export default AddProductForm;
