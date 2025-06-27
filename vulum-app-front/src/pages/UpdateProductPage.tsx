import { forwardRef, FormEvent, useRef } from "react";
import UpdateProductForm from "../components/products/UpdateProductForm";
import { Button } from "../components/ui/button";
import api from "../auth/api";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

interface UpdateProductFormProps {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

type ImageType = File | { image_url: string };

const UpdateProductPage = forwardRef<HTMLFormElement, UpdateProductFormProps>(
  ({ onSubmit }, ref) => {
    const formRef = useRef<HTMLFormElement>(null);
    const navigate = useNavigate();
    const { slug } = useParams();
    const id = slug?.split("-").pop();

    const handleFormSubmit = () => {
      console.log("Received submit from child");
    };

    const handleAddClick = () => {
      formRef.current?.requestSubmit();
    };

    const deleteProduct = async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      try {
        console.log(id, "id");
        await api.delete(`/products/${id}`);
        console.log("Product deleted successfully!");
        navigate("/products");
      } catch (error: any) {
        console.error("Validation errors:", error.response.data.errors);
        console.error(error, "error");
        console.error(error.message, "error.message");
      }
    };

    return (
      <>
        <div className="w-full my-7 flex justify-between">
          <span className="text-2xl">Update Product</span>
          <div className="flex gap-3">
            <Button className="rounded-3xl bg-red-500" onClick={deleteProduct}>
              Delete Product
            </Button>
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

export default UpdateProductPage;
