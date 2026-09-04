import { features } from "./data";

const FeaturesSection = () => {
  return (
    <section
      id="features"
      className="py-32 md:py-48 px-4 sm:px-6 lg:px-8 bg-background"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <h2
            className="font-extrabold text-foreground tracking-tight mb-4"
            style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
          >
            Built for creators who demand more
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto" style={{ fontSize: "clamp(1rem, 1.5vw, 1.125rem)" }}>
            Every tool you need to sell, manage, and scale your digital product business.
          </p>
        </div>

        {/* Bento Grid - grid-flow-dense ensures zero empty spaces */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 auto-rows-auto grid-flow-dense">
          {/* Large card - spans 2 cols */}
          <div className="sm:col-span-2 group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primaryBlue/5 to-indigo-500/5 border border-border p-8 sm:p-10 hover:shadow-card-hover transition-all duration-500">
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-primaryBlue/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                {features[0].icon}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3">
                {features[0].title}
              </h3>
              <p className="text-muted-foreground max-w-md leading-relaxed">
                {features[0].description}
              </p>
            </div>
            {/* Decorative gradient */}
            <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-primaryBlue/5 rounded-full blur-2xl group-hover:bg-primaryBlue/10 transition-colors duration-500" />
          </div>

          {/* Small card */}
          <div className="group relative overflow-hidden rounded-2xl bg-card border border-border p-8 hover:shadow-card-hover transition-all duration-500">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
              {features[1].icon}
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">
              {features[1].title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {features[1].description}
            </p>
          </div>

          {/* Small card */}
          <div className="group relative overflow-hidden rounded-2xl bg-card border border-border p-8 hover:shadow-card-hover transition-all duration-500">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
              {features[2].icon}
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">
              {features[2].title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {features[2].description}
            </p>
          </div>

          {/* Large card - spans 2 cols */}
          <div className="sm:col-span-2 group relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500/5 to-purple-500/5 border border-border p-8 sm:p-10 hover:shadow-card-hover transition-all duration-500">
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                {features[3].icon}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3">
                {features[3].title}
              </h3>
              <p className="text-muted-foreground max-w-md leading-relaxed">
                {features[3].description}
              </p>
            </div>
            <div className="absolute -top-20 -left-20 w-60 h-60 bg-violet-500/5 rounded-full blur-2xl group-hover:bg-violet-500/10 transition-colors duration-500" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
