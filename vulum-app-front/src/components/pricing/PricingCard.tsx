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
    <div className="pricing-card relative p-6 h-auto min-h-[500px] w-full max-w-[320px] flex flex-col justify-between rounded-2xl bg-card border border-border hover:shadow-card-hover transition-all duration-300">
      <div className="py-5 flex flex-col items-center gap-2 text-center">
        <h2 className="font-semibold text-lg text-foreground">{plan_name}</h2>
        <h3 className="font-medium text-sm text-muted-foreground">
          {billing_cycle}
        </h3>
        <h1 className="font-bold text-4xl text-primaryBlue mt-1">${price}</h1>
      </div>

      <div className="h-px w-full bg-border my-2" />

      <div className="py-5 flex flex-col items-center text-center gap-2 flex-1">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {plan_description}
        </p>
      </div>

      <div className="h-px w-full bg-border my-2" />

      {isSubscribed ? (
        <div className="py-5">
          <Button
            className="w-full bg-primaryBlue text-white h-11 rounded-xl font-medium cursor-default"
            disabled
          >
            Subscribed
          </Button>
        </div>
      ) : (
        <div className="py-5 space-y-3">
          <Button
            onClick={link}
            variant="outline"
            className="w-full border-primaryBlue text-primaryBlue hover:bg-primaryBlue hover:text-white h-11 rounded-xl font-medium transition-all"
          >
            Get Started
          </Button>
          {plan_name === "Basic" && (
            <Link
              to="/"
              className="text-xs text-center block text-muted-foreground hover:text-foreground transition-colors"
            >
              Start your 14-day free trial
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default PricingCard;
