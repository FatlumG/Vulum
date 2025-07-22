import React, { FC } from "react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

const PricingCard: FC = () => {
  return (
    <div className="pricing-card p-6 h-[82vh] w-[300px] flex flex-col justify-evenly rounded-[15px] bg-white">
      <div className="py-5 flex flex-col items-center gap-2">
        <h2 className="font-semibold text-lg">Plan Name</h2>
        <h3 className="font-semibold text-[14px] text-gray-500">
          Billing Cycle
        </h3>
        <h1 className="font-semibold text-3xl text-blue-500">Price $$$</h1>
      </div>
      <div className="!h-[1px] w-full bg-gray-200"></div>
      <div className="py-5 flex flex-col items-center gap-2">
        <p>Lorem, ipsum dolor.</p>
        <p>Lorem, ipsum dolor.</p>
        <p>Lorem, ipsum dolor.</p>
        <p>Lorem, ipsum dolor.</p>
        <p>Lorem, ipsum dolor.</p>
      </div>
      <div className="!h-[1px] w-full bg-gray-200"></div>
      <div className="py-5 flex flex-col gap-3">
        <Button className="border border-blue-500 bg-transparent h-12 rounded-full text-blue-500 hover:bg-blue-500 hover:text-white">Get Started</Button>
        <Link to="/" className="text-sm text-center">
          Start your 14-day free trial
        </Link>
      </div>
    </div>
  );
};

export default PricingCard;
