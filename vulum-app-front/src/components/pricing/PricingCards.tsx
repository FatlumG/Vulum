import React from "react";
import PricingCard from "./PricingCard";
import { getPricingPlans } from "../../hooks/getPricingPlans";

const PricingCards: React.FC = () => {
  const plans = getPricingPlans({});

  if (!Array.isArray(plans)) return null;
  const pricingPlans = plans.slice(1);

  return (
    <div className="w-full h-full flex justify-center items-center gap-10">
      {Array.isArray(plans) &&
        pricingPlans.map((plan: any) => (
          <PricingCard
            key={plan.id}
            PlanName={plan.PlanName}
            PlanDescription={plan.PlanDescription}
            BillingCycle={plan.BillingCycle}
            Price={plan.Price}
          />
        ))}
    </div>
  );
};

export default PricingCards;
