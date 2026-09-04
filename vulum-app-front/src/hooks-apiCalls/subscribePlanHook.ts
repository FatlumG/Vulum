import api from "../auth/api";
import { toast } from "sonner";

export const useSubscribePlan = () => {
  const subscribePlan = async (plan_id: number) => {
    try {
      const response = await api.post("/pricing/checkout-session", {
        plan_id,
      });
      // V2 returns { url } — redirect to Stripe Checkout
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Subscription failed';
      toast.error(message);
    }
  };

  return { subscribePlan };
};
