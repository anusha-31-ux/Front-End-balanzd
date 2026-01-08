import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo_balanzed.png";

/**
 * Navbar Component
 * Sticky navigation bar with smooth scroll and mobile menu
 */
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect for sticky navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About" },
    // { href: "#services", label: "Services" },
    { href: "#programs", label: "Programs" },
    { href: "#trainers", label: "Trainers" },
    { href: "#pricing", label: "Pricing" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <nav
      className={`fixed left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "top-0 bg-background/95 backdrop-blur-md shadow-lg shadow-primary/5"
          : "top-12 bg-transparent"
      }`}
    >
      <div className="container-custom mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#home" className="flex items-center">
            <img 
              src={logo} 
              alt="BALANZED" 
              className="h-16 md:h-20 w-auto object-contain brightness-110 contrast-105"
            />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-300 uppercase tracking-wider"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Button variant="hero" size="lg">
              <a href="#pricing">Join Now</a>
            </Button>
          </div>
                 {/* <div className="px-4 pt-4">
  <a
    href="https://docs.google.com/forms/d/e/1FAIpQLSfk_4PVenRF2viDe7Bm0ZHF8GkBrcERLV-K-zl0cZ37SfLIjQ/viewform"
    target="_blank"
    rel="noopener noreferrer"
    className="w-full block"
  >
    <Button variant="hero" size="lg" className="w-full">
      Join Now
    </Button>
  </a>
</div> */}

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-foreground p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-background/95 backdrop-blur-md border-t border-border animate-fade-in">
            <div className="flex flex-col py-6 gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              {/* <div className="px-4 pt-4">
                <Button variant="hero" size="lg" className="w-full">
                  Join Now
                </Button>
              </div> */}
              {/* <div className="px-4 pt-4">
  
    <Button variant="hero" size="lg" className="w-full">
      <a href="#pricing">Join Now</a>
    </Button>
  
</div> */}

 {/* Mobile CTA Button */}
              <div className="px-4 pt-4">
                <Button
                  variant="hero"
                  size="lg"
                  className="w-full"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <a href="#pricing">Join Now</a>
                </Button>
              </div>

            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;