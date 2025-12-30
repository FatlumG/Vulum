import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { ArrowRightIcon } from "./icons";

const CTASection = () => {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primaryBlue to-indigo-600">
      <div className="max-w-4xl mx-auto text-center">
        {/* Headline */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
          Ready to start selling?
        </h2>

        {/* Subheadline */}
        <p className="text-base sm:text-xl text-blue-100 mb-8 sm:mb-10 max-w-2xl mx-auto px-2">
          Join thousands of creators who are already building their digital
          product business with Vulum. Start for free today.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Link to="/sign-up" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-white text-primaryBlue hover:bg-gray-100 px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg rounded-xl font-semibold shadow-lg">
              Get Started Free
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link to="/pricing" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full sm:w-auto border-2 border-white bg-transparent text-white font-semibold hover:bg-white hover:text-primaryBlue px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg rounded-xl"
            >
              View Pricing
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
