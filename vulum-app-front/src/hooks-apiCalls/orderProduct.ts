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
    // V2 returns { url, invoiceId } — redirect to Stripe Checkout
    const url = response.data.url;
    if (url) {
      window.location.href = url;
    }
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.error?.message || error.response?.data?.message || 'Order failed';
    toast.error(message);
  }
};
