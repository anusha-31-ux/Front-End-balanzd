import { useState } from "react";
import { X, Gift } from "lucide-react";

/**
 * Promo Banner Component
 * Displays a promotional banner at the top of the page
 */
const PromoBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-primary via-primary/90 to-primary py-3 px-4 animate-fade-in">
      <div className="container-custom mx-auto flex items-center justify-center gap-3 text-primary-foreground">
        <Gift className="w-5 h-5 animate-bounce" />
        <p className="text-sm md:text-base font-semibold text-center">
          🎉 “Join our 6-Month Plan & Stand a Chance to Win ₹3,00,000 — Not for Transformation, but for Consistency”
        </p>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 p-1 hover:bg-primary-foreground/20 rounded-full transition-colors"
          aria-label="Close banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default PromoBanner;
