import { useState, useEffect } from "react";
import { X, Gift } from "lucide-react";
import { bannerService, Banner } from "@/services/api";
import { DATA_UPDATE_EVENT } from "@/hooks/useSSEUpdates";

/**
 * Promo Banner Component
 * Displays a promotional banner at the top of the page
 */
const PromoBanner = () => {
  const [banner, setBanner] = useState<Banner | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState(true);

  const fetchBanner = async () => {
    try {
      const bannerData = await bannerService.get();
      setBanner(bannerData);
      setIsVisible(bannerData?.isVisible ?? false);
    } catch (error) {
      console.error("Failed to fetch banner:", error);
      setIsVisible(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanner();
  }, []);

  // Refetch when admin updates banner via SSE
  useEffect(() => {
    const handler = (e: Event) => {
      if ((e as CustomEvent).detail?.type === 'banner') fetchBanner();
    };
    window.addEventListener(DATA_UPDATE_EVENT, handler);
    return () => window.removeEventListener(DATA_UPDATE_EVENT, handler);
  }, []);

  if (loading || !isVisible || !banner) return null;

  return (
    <div className="relative bg-gradient-to-r from-primary via-primary/90 to-primary py-3 px-4 animate-fade-in">
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
