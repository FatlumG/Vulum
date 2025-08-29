import { FC } from "react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

interface PricingPlanProps {
  billing_cycle: string;
  plan_description: string;
  plan_name: string;
  price: string;
  isSubscribed: boolean;
  link: () => void;
}

const PricingCard: FC<PricingPlanProps> = ({
  billing_cycle,
  plan_description,
  plan_name,
  price,
  isSubscribed,
  link,
}) => {
  return (
    <div className="pricing-card relative p-6 h-[82vh] w-[300px] flex flex-col justify-evenly rounded-[15px] bg-white">
      <div className="py-5 flex flex-col items-center gap-2">
        <h2 className="font-semibold text-lg">{plan_name}</h2>
        <h3 className="font-semibold text-[14px] text-gray-500">
          {billing_cycle}
        </h3>
        <h1 className="font-semibold text-3xl text-blue-500">${price}</h1>
      </div>
      <div className="!h-[1px] w-full bg-gray-200"></div>
      <div className="py-5 flex flex-col items-center text-center gap-2">
        {plan_description}
      </div>
      <div className="!h-[1px] w-full bg-gray-200"></div>
      {isSubscribed ? (
        <div className="py-5 flex flex-col gap-3">
          <Button className="border grid place-items-center bg-blue-500 h-12 rounded-full text-[15px] font-semibold text-white hover:bg-blue-500 hover:text-white transition">
            Subscribed
          </Button>
        </div>
      ) : (
        <>
          <div className="py-5 flex flex-col gap-3">
            <Button
              onClick={link}
              className="border grid place-items-center border-blue-500 bg-transparent h-12 rounded-full text-[15px] font-semibold text-blue-500 hover:bg-blue-500 hover:text-white transition"
            >
              Get Started
            </Button>
          </div>
          {plan_name === "Basic" && (
            <Link
              to="/"
              className="text-sm text-center absolute bottom-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap hover:underline"
            >
              Start your 14-day free trial
            </Link>
          )}
        </>
      )}
    </div>
  );
};

export default PricingCard;
