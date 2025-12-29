import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { MenuIcon, CloseIcon } from "./icons";
import { navLinks } from "./data";
import vulumLogo from "../../assets/logos/vulumBlue.png";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            {/* <img src={vulumLogo} alt="Vulum" className="h-8 w-auto" /> */}
            <span className="font-bold text-xl text-gray-900">Vulum</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) =>
              link.href.startsWith("/") ? (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-gray-600 hover:text-primaryBlue transition-colors"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-gray-600 hover:text-primaryBlue transition-colors"
                >
                  {link.label}
                </a>
              )
            )}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden sm:flex items-center gap-4">
            <Link to="/login">
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-primaryBlue"
              >
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-primaryBlue hover:bg-darkBlue text-white px-6">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-gray-600 hover:text-primaryBlue"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) =>
                link.href.startsWith("/") ? (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="text-gray-600 hover:text-primaryBlue transition-colors py-2"
                    onClick={closeMobileMenu}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-gray-600 hover:text-primaryBlue transition-colors py-2"
                    onClick={closeMobileMenu}
                  >
                    {link.label}
                  </a>
                )
              )}

              {/* Mobile Auth Buttons */}
              <div className="flex flex-col sm:hidden gap-3 pt-4 border-t border-gray-100">
                <Link to="/login" onClick={closeMobileMenu}>
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register" onClick={closeMobileMenu}>
                  <Button className="w-full bg-primaryBlue hover:bg-darkBlue text-white">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
