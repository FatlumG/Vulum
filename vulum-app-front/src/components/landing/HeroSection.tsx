import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { CheckIcon, ArrowRightIcon, PlayIcon } from "./icons";
import { dashboardStats, trustBadges } from "./data";

const HeroSection = () => {
  return (
    <section className="pt-28 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-100 text-primaryBlue px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primaryBlue opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primaryBlue"></span>
            </span>
            Trusted by 10,000+ creators worldwide
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold text-gray-900 leading-tight mb-4 sm:mb-6">
            Sell Your Digital
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primaryBlue to-indigo-600">
              {" "}
              Products{" "}
            </span>
            Effortlessly
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-xl text-gray-600 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-2">
            The all-in-one platform for creators to sell digital products,
            manage customers, and grow their business. No technical skills
            required.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-12">
            <Link to="/register" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-primaryBlue hover:bg-darkBlue text-white px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all">
                Start Selling Free
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button
              variant="outline"
              className="w-full sm:w-auto px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg rounded-xl border-2"
            >
              <PlayIcon className="w-5 h-5 mr-2 text-primaryBlue" />
              Watch Demo
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8 text-xs sm:text-sm text-gray-500">
            {trustBadges.map((badge) => (
              <div key={badge} className="flex items-center gap-2">
                <CheckIcon />
                <span>{badge}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dashboard Preview */}
        <DashboardPreview />
      </div>
    </section>
  );
};

// Dashboard Preview Sub-component
const DashboardPreview = () => {
  return (
    <div className="mt-10 sm:mt-16 relative">
      <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 pointer-events-none"></div>
      <div className="bg-gray-900 rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden border border-gray-800">
        {/* Window Controls */}
        <div className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-gray-800 border-b border-gray-700">
          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500"></div>
          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500"></div>
          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
        </div>

        {/* Stats Grid */}
        <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-900 to-gray-800">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {dashboardStats.map((stat) => (
              <div
                key={stat.label}
                className="bg-gray-800/50 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 border border-gray-700"
              >
                <p className="text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2">
                  {stat.label}
                </p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                  {stat.value}
                </p>
                <p className="text-green-400 text-xs sm:text-sm mt-1 sm:mt-2">
                  {stat.change}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
