import { steps } from "./data";

const HowItWorksSection = () => {
  return (
    <section
      id="how-it-works"
      className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-16">
          <span className="text-primaryBlue font-semibold text-xs sm:text-sm uppercase tracking-wider">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mt-3 sm:mt-4 mb-4 sm:mb-6">
            Simple as 1, 2, 3
          </h2>
          <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto px-2">
            Get started in minutes and start selling your digital products
            today.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 relative">
          {/* Connection Line - only visible on md and up */}
          <div className="hidden md:block absolute top-24 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primaryBlue via-indigo-400 to-primaryBlue"></div>

          {steps.map((step, index) => (
            <StepCard key={index} step={step} />
          ))}
        </div>
      </div>
    </section>
  );
};

// Step Card Sub-component
interface StepCardProps {
  step: {
    icon: React.ReactNode;
    step: string;
    title: string;
    description: string;
  };
}

const StepCard = ({ step }: StepCardProps) => {
  return (
    <div className="relative">
      <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow text-center">
        {/* Step Number */}
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primaryBlue text-white flex items-center justify-center mx-auto mb-4 sm:mb-6 text-xl sm:text-2xl font-bold relative z-10">
          {step.step}
        </div>

        {/* Step Icon */}
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-4 sm:mb-6">
          {step.icon}
        </div>

        {/* Step Content */}
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
          {step.title}
        </h3>
        <p className="text-sm sm:text-base text-gray-600">{step.description}</p>
      </div>
    </div>
  );
};

export default HowItWorksSection;
