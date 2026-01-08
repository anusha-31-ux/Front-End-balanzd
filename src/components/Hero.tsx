import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { useState, useEffect } from "react";

// const slides = [
//   {
//     image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1920&q=80",
//   },
//   {
//     image: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=1920&q=80",
//   },
//   {
//     image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1920&q=80",
//   }
// ];
const slides = [
  {
    image: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=1920&q=90&auto=format&fit=crop", // Bright yoga on white/light background
  },
  {
    image: "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=1920&q=90&auto=format&fit=crop", // Light meditation peaceful
  },
  {
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1920&q=90&auto=format&fit=crop", // Bright home workout stretching
  }
];
const bulletPoints = [
  "Live workout sessions — Monday to Friday",
  "10 daily batches | 6 AM – 12 PM & 4 PM – 8 PM",
  "Strength Training: Mon, Wed, Fri",
  "Yoga: Tue & Thu",
  "Join any batch as per your schedule"
];

/**
 * Hero Section Component
 * Full-screen hero with banner slider for BALANZED
 */
const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => setCurrentSlide(index);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Slider Background */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          {/* Overlay gradient */}
          {/* <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" /> */}
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 container-custom mx-auto px-4 md:px-8 pt-20">
        <div className="max-w-4xl">
          {/* Badge */}

          {/* Main Headline in Kannada */}
          <h1 className="font-display text-3xl md:text-5xl lg:text-6xl text-foreground leading-tight mb-4 animate-fade-up stagger-1">
            ನಮ್ಮ ಗುರಿ — ಕರ್ನಾಟಕದ ಪ್ರತಿಯೊಬ್ಬರೂ{" "}
            <span className="text-primary neon-glow">ಆರೋಗ್ಯವಾಗಿರುವುದು</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8 animate-fade-up stagger-2">
            Daily LIVE workout sessions in Kannada — simple, safe and beginner-friendly.
          </p>

          {/* Bullet Points */}
          <ul className="space-y-3 mb-8 animate-fade-up stagger-3">
            {bulletPoints.map((point, index) => (
              <li key={index} className="flex items-center gap-3 text-foreground">
                <Check className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-base md:text-lg">{point}</span>
              </li>
            ))}
          </ul>

          {/* CTA Button */}
          {/* <div className="animate-fade-up stagger-4">
            <Button variant="hero" size="xl">
              Join Now!
            </Button>
          </div> */}
        </div>
      </div>

      {/* Slider Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-background/30 hover:bg-primary/20 border border-primary/30 rounded-full text-primary transition-all duration-300"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-background/30 hover:bg-primary/20 border border-primary/30 rounded-full text-primary transition-all duration-300"
      >
        <ChevronRight size={24} />
      </button>

      {/* Slider Dots */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-primary w-8"
                : "bg-muted-foreground/50 hover:bg-primary/50"
            }`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-primary animate-bounce"
      >
        <ChevronDown size={32} />
      </a>
    </section>
  );
};

export default Hero;
