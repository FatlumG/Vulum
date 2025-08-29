import api from "../auth/api";

export const useSubscribePlan = () => {
  const subscribePlan = async (plan_id: number) => {
    try {
      const response = await api.post("/pricing/checkout-session", {
        plan_id,
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
