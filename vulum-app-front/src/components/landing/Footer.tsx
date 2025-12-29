import { Link } from "react-router-dom";
import { TwitterIcon, GithubIcon, LinkedinIcon } from "./icons";
import { footerSections } from "./data";
import vulumLogo from "../../assets/logos/vulumBlue.png";

const Footer = () => {
  return (
    <footer className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Footer Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 mb-8 sm:mb-12">
          {/* Brand Column */}
          <div className="col-span-2 sm:col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 sm:mb-6">
              {/* <img
                src={vulumLogo}
                alt="Vulum"
                className="h-7 sm:h-8 w-auto brightness-0 invert"
              /> */}
              <span className="font-bold text-lg sm:text-xl text-white">
                Vulum
              </span>
            </Link>
            <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
              The all-in-one platform for selling digital products. Built for
              creators, by creators.
            </p>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section) => (
            <FooterColumn key={section.title} section={section} />
          ))}
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-800 pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-xs sm:text-sm text-center sm:text-left">
            © {new Date().getFullYear()} Vulum. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4 sm:gap-6">
            <SocialLink href="#" icon={<TwitterIcon />} label="Twitter" />
            <SocialLink href="#" icon={<GithubIcon />} label="GitHub" />
            <SocialLink href="#" icon={<LinkedinIcon />} label="LinkedIn" />
          </div>
        </div>
      </div>
    </footer>
  );
};

// Footer Column Sub-component
interface FooterColumnProps {
  section: {
    title: string;
    links: Array<{
      label: string;
      href: string;
    }>;
  };
}

const FooterColumn = ({ section }: FooterColumnProps) => {
  return (
    <div>
      <h4 className="font-semibold text-white text-sm sm:text-base mb-3 sm:mb-4">
        {section.title}
      </h4>
      <ul className="space-y-2 sm:space-y-3">
        {section.links.map((link) => (
          <li key={link.label}>
            {link.href.startsWith("/") ? (
              <Link
                to={link.href}
                className="text-sm sm:text-base text-gray-400 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ) : (
              <a
                href={link.href}
                className="text-sm sm:text-base text-gray-400 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

// Social Link Sub-component
interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const SocialLink = ({ href, icon, label }: SocialLinkProps) => {
  return (
    <a
      href={href}
      className="text-gray-400 hover:text-white transition-colors"
      aria-label={label}
    >
      {icon}
    </a>
  );
};

export default Footer;
