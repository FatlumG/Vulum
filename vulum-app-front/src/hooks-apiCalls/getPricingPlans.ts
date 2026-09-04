import { useState, useEffect } from "react";
import api from "../auth/api";

export const getPricingPlans = () => {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const getPlans = async () => {
      try {
        const res = await api.get("/pricing");
        setPlans(res.data.items || res.data);
        console.log(res.data.items || res.data, "res.data.items");
        
      } catch (error: any) {
        console.error(error.message);
      }
    };

    getPlans();
  }, []);

  return plans;
};
