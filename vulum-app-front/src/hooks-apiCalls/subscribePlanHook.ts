import api from "../auth/api";

export const useSubscribePlan = () => {
  const subscribePlan = async (plan_id: number) => {
    try {
      const response = await api.post("/pricing/checkout-session", {
        plan_id,
      });
      // V2: Stripe checkout deferred — V2 returns 501
      // V1: const url = response.data.url; if (url) window.location.href = url;
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error("Error subscribing to plan:", error);
    }
  };

  return { subscribePlan };
};
