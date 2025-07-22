import React, { FC } from "react";
import PricingCards from "../components/pricing/PricingCards";
const PricingPage: FC = () => {
  return (
    <div className="w-full h-full col-span-10 p-12 font-NunitoSans">
      <PricingCards />
    </div>
  );
};

export default PricingPage;
