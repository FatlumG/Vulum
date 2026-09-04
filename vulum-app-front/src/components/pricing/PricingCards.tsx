import React, { useState, useEffect } from "react";
import PricingCard from "./PricingCard";
import { getPricingPlans } from "../../hooks-apiCalls/getPricingPlans";
import { useSubscribePlan } from "../../hooks-apiCalls/subscribePlanHook";
import api from "../../auth/api";

const PricingCards: React.FC = () => {
  const [subscribedPlan, setSubscribedPlan] = useState<number>();

  useEffect(() => {
    const getSubscribedPlan = async () => {
      try {
        const res = await api.get("/user-subscription/my-subscription");
        setSubscribedPlan(res.data.plan_id);
        console.log(res.data.plan_id, "res.data.plan_id");
      } catch (error: any) {
        console.error(error.response.data);
      }
    };

    getSubscribedPlan();
  }, []);

  const plans = getPricingPlans();
  const { subscribePlan } = useSubscribePlan();

  if (!Array.isArray(plans)) return null;
  const pricingPlans = plans.slice(1);

  return (
    <div className="w-full">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Choose your plan
        </h1>
        <p className="text-muted-foreground mt-2">
          Select the plan that fits your business needs.
        </p>
      </div>
      <div className="flex flex-wrap justify-center items-start gap-6">
        {Array.isArray(plans) &&
          pricingPlans.map((plan: any) => (
            <PricingCard
              key={plan.id}
              plan_name={plan.plan_name}
              plan_description={plan.plan_description}
              billing_cycle={plan.billing_cycle}
              price={plan.price}
              isSubscribed={subscribedPlan === plan.id}
              link={() => subscribePlan(plan.id)}
            />
          ))}
      </div>
    </div>
  );
};

export default PricingCards;
