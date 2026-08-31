import { StarIcon } from "./icons";
import { testimonials } from "./data";

const TestimonialsSection = () => {
  return (
    <section
      id="testimonials"
      className="py-32 md:py-48 px-4 sm:px-6 lg:px-8 bg-background"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <h2
            className="font-extrabold text-foreground tracking-tight mb-4"
            style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
          >
            Loved by creators worldwide
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto" style={{ fontSize: "clamp(1rem, 1.5vw, 1.125rem)" }}>
            Join thousands of satisfied creators who trust Vulum.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl bg-card border border-border p-6 sm:p-8 hover:shadow-card-hover transition-all duration-500"
            >
              {/* Star Rating */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <StarIcon key={i} filled />
                ))}
              </div>

              {/* Quote */}
              <p className="text-foreground/80 mb-6 leading-relaxed text-sm sm:text-base">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-background"
                  />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
