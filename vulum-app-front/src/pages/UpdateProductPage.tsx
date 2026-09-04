import { forwardRef, FormEvent, useRef } from "react";
import UpdateProductForm from "../components/products/UpdateProductForm";
import { Button } from "../components/ui/button";
import api from "../auth/api";
import { useParams, useNavigate } from "react-router-dom";

interface UpdateProductFormProps {
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
}

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
      <div className="page-enter">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              Update Product
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Edit your product details.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={deleteProduct}
            >
              Delete
            </Button>
            <Button
              size="sm"
              className="bg-primaryBlue hover:bg-darkBlue text-white"
              onClick={handleAddClick}
            >
              Update Product
            </Button>
          </div>
        </div>
        <UpdateProductForm onSubmit={handleFormSubmit} ref={formRef} />
      </div>
    );
  }
);

export default UpdateProductPage;
