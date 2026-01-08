import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Import testimonial images
import testimonial1 from "@/assets/testimonial-1.jpg";
import testimonial2 from "@/assets/testimonial-2.jpg";
import testimonial3 from "@/assets/testimonial-3.jpg";
import testimonial4 from "@/assets/testimonial-4.png";
import testimonial5 from "@/assets/testimonial-5.jpg";
import testimonial6 from "@/assets/testimonial-6.jpg";
import testimonial7 from "@/assets/testimonial-7.jpg";
import testimonial8 from "@/assets/testimonial-8.jpg";
import testimonial9 from "@/assets/testimonial-9.jpg";
import testimonial10 from "@/assets/testimonial-10.jpg";

/**
 * Testimonials Section Component
 * Displays client transformation photos with slider
 */
const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const transformations = [
    { image: testimonial1, before: "92kg", after: "77kg", loss: "15kg" },
    { image: testimonial2, before: "60kg", after: "52kg", loss: "8kg" },
    { image: testimonial3, before: "71kg", after: "64kg", loss: "7kg" },
    { image: testimonial4, before: "75kg", after: "65kg", loss: "10kg" },
    { image: testimonial5, before: "70kg", after: "59kg", loss: "11kg" },
    { image: testimonial6, before: "61kg", after: "55kg", loss: "6kg" },
    { image: testimonial7, before: "95kg", after: "88kg", loss: "7kg" },
    { image: testimonial8, before: "73kg", after: "59kg", loss: "14kg" },
    { image: testimonial9, before: "53kg", after: "49kg", loss: "4kg" },
    { image: testimonial10, before: "74kg", after: "70kg", loss: "4kg" },
  ];

  const totalSlides = transformations.length;

  // Auto-slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(timer);
  }, [totalSlides]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
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

        {/* Transformations Slider */}
        <div className="relative max-w-3xl mx-auto px-4 sm:px-8 md:px-16">
          {/* Main Slider */}
          <div className="relative overflow-hidden rounded-2xl">
            <div className="transition-opacity duration-500">
              <div className="animate-fade-in">
                <div className="relative bg-background rounded-xl overflow-hidden border border-border shadow-lg">
                  <img
                    src={transformations[currentIndex].image}
                    alt={`Transformation: ${transformations[currentIndex].before} to ${transformations[currentIndex].after}`}
                   className="w-full max-h-[500px] sm:max-h-[600px] md:max-h-[700px] object-contain"
                  />
                  {/* Weight Loss Badge */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-6 py-2 rounded-full font-bold text-base md:text-lg shadow-lg">
                    Lost {transformations[currentIndex].loss}!
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
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

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalSlides }).map((_, index) => (
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
      </div>
    </section>
  );
};

export default Testimonials;
