import { Link } from "react-router-dom";
import { TwitterIcon, GithubIcon, LinkedinIcon } from "./icons";
import { footerSections } from "./data";

const Footer = () => {
  return (
    <footer className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-foreground text-background">
      <div className="max-w-7xl mx-auto">
        {/* Footer Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 mb-12 sm:mb-16">
          {/* Brand Column */}
          <div className="col-span-2 sm:col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-lg bg-primaryBlue flex items-center justify-center">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <span className="font-bold text-lg text-white tracking-tight">
                Vulum
              </span>
            </Link>
            <p className="text-sm text-background/50 leading-relaxed max-w-xs">
              The all-in-one platform for selling digital products. Built for
              creators, by creators.
            </p>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section) => (
            <FooterColumn key={section.title} section={section} />
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-background/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-background/40 text-xs sm:text-sm text-center sm:text-left">
            &copy; {new Date().getFullYear()} Vulum. All rights reserved.
          </p>

          <div className="flex items-center gap-4 sm:gap-5">
            <SocialLink href="#" icon={<TwitterIcon />} label="Twitter" />
            <SocialLink href="#" icon={<GithubIcon />} label="GitHub" />
            <SocialLink href="#" icon={<LinkedinIcon />} label="LinkedIn" />
          </div>
        </div>
      </div>
    </footer>
  );
};

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
      <h4 className="font-semibold text-white text-sm mb-4">{section.title}</h4>
      <ul className="space-y-2.5">
        {section.links.map((link) => (
          <li key={link.label}>
            {link.href.startsWith("/") ? (
              <Link
                to={link.href}
                className="text-sm text-background/50 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ) : (
              <a
                href={link.href}
                className="text-sm text-background/50 hover:text-white transition-colors"
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

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const SocialLink = ({ href, icon, label }: SocialLinkProps) => {
  return (
    <a
      href={href}
      className="text-background/40 hover:text-white transition-colors"
      aria-label={label}
    >
      {icon}
    </a>
  );
};

export default Footer;
