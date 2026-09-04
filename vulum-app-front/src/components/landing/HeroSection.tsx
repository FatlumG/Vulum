import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { ArrowRightIcon, PlayIcon } from "./icons";
import { dashboardStats, trustBadges } from "./data";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with radial gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-background to-indigo-50/60" />
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primaryBlue/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        <div className="text-center">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 bg-primaryBlue/5 border border-primaryBlue/10 text-primaryBlue px-4 py-1.5 rounded-full text-xs font-medium mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primaryBlue opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primaryBlue"></span>
            </span>
            Trusted by 10,000+ creators worldwide
          </div>

          {/* Headline - max-w-5xl guarantees 2-3 lines */}
          <h1
            className="font-extrabold text-foreground leading-[1.05] tracking-tight mb-6 animate-fade-in"
            style={{ fontSize: "clamp(2.5rem, 5vw, 5rem)" }}
          >
            <span className="max-w-5xl mx-auto block">
              We shape digital products
            </span>
          </h1>

          {/* Subheadline */}
          <p
            className="text-muted-foreground mx-auto leading-relaxed mb-10 max-w-2xl animate-fade-in"
            style={{ fontSize: "clamp(1rem, 1.8vw, 1.25rem)" }}
          >
            The all-in-one platform for creators to sell digital products,
            manage customers, and grow their business. No technical skills
            required.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-in">
            <Link to="/sign-up" className="w-full sm:w-auto">
              <Button
                size="xl"
                className="w-full sm:w-auto bg-primaryBlue hover:bg-darkBlue text-white shadow-lg shadow-primaryBlue/25 hover:shadow-primaryBlue/40 transition-all"
              >
                Start Selling Free
                <ArrowRightIcon className="w-5 h-5 ml-1" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="xl"
              className="w-full sm:w-auto"
            >
              <PlayIcon className="w-5 h-5 mr-1 text-primaryBlue" />
              Watch Demo
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground animate-fade-in">
            {trustBadges.map((badge) => (
              <div key={badge} className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-primaryBlue"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
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

const DashboardPreview = () => {
  return (
    <div className="mt-16 sm:mt-20 relative animate-slide-up">
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
      <div className="bg-card rounded-2xl shadow-elevated-lg overflow-hidden border border-border">
        {/* Window Controls */}
        <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-amber-400" />
          <div className="w-3 h-3 rounded-full bg-emerald-400" />
          <span className="text-xs text-muted-foreground ml-2">Dashboard</span>
        </div>

        {/* Stats Grid */}
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {dashboardStats.map((stat) => (
              <div
                key={stat.label}
                className="bg-muted/50 rounded-xl p-4 sm:p-5 border border-border/50 hover:border-border transition-colors"
              >
                <p className="text-muted-foreground text-xs sm:text-sm mb-1">
                  {stat.label}
                </p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-emerald-500 text-xs sm:text-sm mt-1">
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
