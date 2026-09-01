import { toast } from "sonner";
import api from "../auth/api";

export const useOrderProduct = async (id: number) => {
  try {
    const response = await api.post("/orders", {
      items: [
        {
          product_id: id,
          quantity: 1,
        },
      ],
    });
    // V2: Stripe checkout URL deferred — show success message
    // V1: const url = response.data.url; if (url) window.location.href = url;
    return response.data;
  } catch (error: any) {
    toast.error(error.response.data.message);
    // console.error(error.response.data, "error.response.data");
  }
};
