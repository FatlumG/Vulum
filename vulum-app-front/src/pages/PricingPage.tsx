import React, { FC } from "react";
import PricingCards from "../components/pricing/PricingCards";

const PricingPage: FC = () => {
  return (
    <div className="w-full py-6 page-enter">
      <PricingCards />
    </div>
  );
};

export default PricingPage;
