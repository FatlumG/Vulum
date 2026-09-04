import { steps } from "./data";

const HowItWorksSection = () => {
  return (
    <section
      id="how-it-works"
      className="py-32 md:py-48 px-4 sm:px-6 lg:px-8 bg-muted/30"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <h2
            className="font-extrabold text-foreground tracking-tight mb-4"
            style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
          >
            Three steps to start selling
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto" style={{ fontSize: "clamp(1rem, 1.5vw, 1.125rem)" }}>
            Get started in minutes. No technical skills required.
          </p>
        </div>

        {/* Horizontal Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl bg-card border border-border p-8 hover:shadow-card-hover transition-all duration-500 cursor-default"
            >
              {/* Step number */}
              <div className="text-7xl sm:text-8xl font-extrabold text-primaryBlue/5 absolute -top-2 -right-1 select-none group-hover:text-primaryBlue/10 transition-colors duration-500">
                {step.step}
              </div>

              <div className="relative z-10">
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-primaryBlue/10 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-primaryBlue/15 transition-all duration-300">
                  {step.icon}
                </div>

                {/* Content */}
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primaryBlue to-indigo-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
