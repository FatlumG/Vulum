import api from "../auth/api";

export const useSubscribePlan = () => {
  const subscribePlan = async (planId: number) => {
    try {
      const response = await api.post("/pricing/checkout-session", {
        planId,
      });
      const url = response.data.url;
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Error subscribing to plan:", error);
    }
  };

  return { subscribePlan };
};
