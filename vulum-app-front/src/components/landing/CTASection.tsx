import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { ArrowRightIcon } from "./icons";

const CTASection = () => {
  return (
    <section className="py-32 md:py-48 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primaryBlue to-indigo-600" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTR2Mkg4VjI4aDI4ek0zNiAxOHYySDI0di0yaDEyek0xMiAzMHYySDZ2LTJoNnptMCA0djJINnYtMmg2em0yNC04djJINHktMmgzMnpNMzYgNnYySDI0VjZoMTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <h2
          className="font-extrabold text-white tracking-tight mb-5"
          style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
        >
          Ready to start selling?
        </h2>
        <p
          className="text-blue-100/80 mb-10 max-w-xl mx-auto leading-relaxed"
          style={{ fontSize: "clamp(1rem, 1.5vw, 1.125rem)" }}
        >
          Join thousands of creators already building their digital product
          business with Vulum. Start for free today.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/sign-up" className="w-full sm:w-auto">
            <Button
              size="xl"
              className="w-full sm:w-auto bg-white text-primaryBlue hover:bg-white/90 shadow-lg font-semibold"
            >
              Get Started Free
              <ArrowRightIcon className="w-5 h-5 ml-1" />
            </Button>
          </Link>
          <Link to="/pricing" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="xl"
              className="w-full sm:w-auto border-2 border-white/30 bg-transparent text-white font-semibold hover:bg-white/10 hover:border-white/50"
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
