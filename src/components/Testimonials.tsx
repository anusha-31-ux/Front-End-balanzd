import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { testimonialService } from "@/services/testimonialService";
import { Testimonial } from "@/types/testimonial";
import { DATA_UPDATE_EVENT } from "@/hooks/useSSEUpdates";

// Format ISO date or "YYYY-MM" → "March 2025"
const formatMonthYear = (val: string) => {
  if (!val) return "";
  const short = val.slice(0, 7); // "YYYY-MM"
  const [year, month] = short.split("-");
  return new Date(Number(year), Number(month) - 1).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
};

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadTestimonials = () => {
    testimonialService
      .getAllPublic()
      .then((data) => setTestimonials(data))
      .catch((err) => console.error("Failed to load testimonials:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  // Refetch when admin updates testimonials via SSE
  useEffect(() => {
    const handler = (e: Event) => {
      if ((e as CustomEvent).detail?.type === 'testimonials') loadTestimonials();
    };
    window.addEventListener(DATA_UPDATE_EVENT, handler);
    return () => window.removeEventListener(DATA_UPDATE_EVENT, handler);
  }, []);

  const total = testimonials.length;

  useEffect(() => {
    if (total === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, 5000);
    return () => clearInterval(timer);
  }, [total]);

  const goToPrevious = () => setCurrentIndex((prev) => (prev - 1 + total) % total);
  const goToNext = () => setCurrentIndex((prev) => (prev + 1) % total);

  const current = testimonials[currentIndex];

  // Build period string e.g. "March 2025 – March 2026"
  const getPeriod = (t: Testimonial) => {
    if (!t.period_start && !t.period_end) return null;
    const start = t.period_start ? formatMonthYear(t.period_start) : "";
    const end = t.period_end ? formatMonthYear(t.period_end) : "";
    if (start && end) return `${start} – ${end}`;
    return start || end;
  };

  return (
    <section id="testimonials" className="section-padding bg-card">
      <div className="container-custom mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-primary uppercase tracking-widest text-sm font-medium">
            Real Results
          </span>
          <h2 className="font-display text-4xl md:text-6xl text-foreground mt-4">
            CLIENT <span className="text-primary">TESTIMONIALS</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mt-4">
            Real transformations from our amazing clients. Join them on their fitness journey!
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : total === 0 ? (
          <p className="text-center text-muted-foreground py-10">No testimonials available yet.</p>
        ) : (
          <div className="relative max-w-3xl mx-auto px-4 sm:px-8 md:px-16">
            {/* Main Slide */}
            <div className="relative overflow-hidden rounded-2xl">
              <div className="animate-fade-in">
                <div className="relative bg-background rounded-xl overflow-hidden border border-border shadow-lg">
                  <img
                    src={current.photoUrl}
                    alt={current.weight_change}
                    className="w-full max-h-[500px] sm:max-h-[600px] md:max-h-[700px] object-contain"
                  />

                  {/* Overlay badges */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 w-full px-4">
                    {/* Weight change — yellow/primary badge */}
                    <div className="bg-primary text-primary-foreground px-6 py-2 rounded-full font-bold text-base md:text-lg shadow-lg whitespace-nowrap">
                      {current.weight_change}
                    </div>

                    {/* Period range */}
                    {getPeriod(current) && (
                      <div className="bg-black/70 text-white px-4 py-1 rounded-full text-sm shadow whitespace-nowrap">
                        {getPeriod(current)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Description below image */}
            {current.description && (
              <p className="text-center text-muted-foreground mt-6 max-w-xl mx-auto text-sm">
                "{current.description}"
              </p>
            )}

            {/* Navigation */}
            <Button
              variant="outline"
              size="icon"
              onClick={goToPrevious}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-14 bg-background border-primary/30 hover:bg-primary hover:text-primary-foreground z-10"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={goToNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-14 bg-background border-primary/30 hover:bg-primary hover:text-primary-foreground z-10"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-primary w-8"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
