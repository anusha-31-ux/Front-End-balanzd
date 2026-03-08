import { useState, useEffect } from "react";
import { X, Gift } from "lucide-react";
import { bannerService, Banner } from "@/services/api";

/**
 * Promo Banner Component
 * Displays a promotional banner at the top of the page
 */
const PromoBanner = () => {
  const [banner, setBanner] = useState<Banner | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const bannerData = await bannerService.get();
        setBanner(bannerData);
        setIsVisible(bannerData?.isVisible ?? false);
      } catch (error) {
        console.error("Failed to fetch banner:", error);
        // Fallback to not showing banner if API fails
        setIsVisible(false);
      } finally {
        setLoading(false);
      }
    };

    fetchBanner();
  }, []);

  if (loading || !isVisible || !banner) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-primary via-primary/90 to-primary py-3 px-4 animate-fade-in">
      <div className="container-custom mx-auto flex items-center justify-center gap-3 text-primary-foreground">
        <Gift className="w-5 h-5 animate-bounce" />
        <p className="text-sm md:text-base font-semibold text-center">
          {banner.message}
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
