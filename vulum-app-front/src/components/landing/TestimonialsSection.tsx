import { StarIcon } from "./icons";
import { testimonials } from "./data";

const TestimonialsSection = () => {
  return (
    <section
      id="testimonials"
      className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-16">
          <span className="text-primaryBlue font-semibold text-xs sm:text-sm uppercase tracking-wider">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mt-3 sm:mt-4 mb-4 sm:mb-6">
            Loved by creators worldwide
          </h2>
          <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto px-2">
            Join thousands of satisfied creators who trust Vulum for their
            digital product business.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

// Testimonial Card Sub-component
interface TestimonialCardProps {
  testimonial: {
    name: string;
    role: string;
    image: string;
    content: string;
    rating: number;
  };
}

const TestimonialCard = ({ testimonial }: TestimonialCardProps) => {
  return (
    <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-5 sm:p-8 hover:shadow-lg transition-shadow">
      {/* Star Rating */}
      <div className="flex gap-1 mb-3 sm:mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <StarIcon key={i} filled />
        ))}
      </div>

      {/* Testimonial Content */}
      <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6 leading-relaxed">
        "{testimonial.content}"
      </p>

      {/* Author Info */}
      <div className="flex items-center gap-3 sm:gap-4">
        <img
          src={testimonial.image}
          alt={testimonial.name}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold text-sm sm:text-base text-gray-900">
            {testimonial.name}
          </p>
          <p className="text-xs sm:text-sm text-gray-500">{testimonial.role}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;
