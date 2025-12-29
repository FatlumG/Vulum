import { features } from "./data";

const FeaturesSection = () => {
  return (
    <section
      id="features"
      className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-16">
          <span className="text-primaryBlue font-semibold text-xs sm:text-sm uppercase tracking-wider">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mt-3 sm:mt-4 mb-4 sm:mb-6">
            Everything you need to succeed
          </h2>
          <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto px-2">
            Powerful tools designed to help creators sell more, work less, and
            grow faster.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

// Feature Card Sub-component
interface FeatureCardProps {
  feature: {
    icon: React.ReactNode;
    title: string;
    description: string;
  };
}

const FeatureCard = ({ feature }: FeatureCardProps) => {
  return (
    <div className="group p-6 sm:p-8 rounded-xl sm:rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 border border-transparent hover:border-gray-100">
      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl bg-blue-100 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
        {feature.icon}
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
        {feature.title}
      </h3>
      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
        {feature.description}
      </p>
    </div>
  );
};

export default FeaturesSection;
