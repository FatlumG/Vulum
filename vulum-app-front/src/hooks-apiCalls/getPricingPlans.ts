import { FC, useState, useEffect } from "react";
import api from "../auth/api";

export const getPricingPlans: FC = () => {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const getPlans = async () => {
      try {
        const res = await api.get("/pricing");
        setPlans(res.data.rows);
        console.log(res.data.rows, "res.data.rows");
        
      } catch (error: any) {
        console.error(error.message);
      }
    };

    getPlans();
  }, []);

  return plans;
};
