import { Dumbbell, Heart, Timer, Utensils, Zap, Brain } from "lucide-react";

/**
 * Services Section Component
 * Showcases gym services and features
 */
const Services = () => {
  const services = [
    {
      icon: Dumbbell,
      title: "Strength Training",
      description: "Build muscle and increase strength with our comprehensive weight training programs and expert guidance.",
    },
    {
      icon: Heart,
      title: "Cardio Fitness",
      description: "Improve heart health and endurance with our variety of cardio equipment and high-energy classes.",
    },
    {
      icon: Timer,
      title: "HIIT Workouts",
      description: "Maximize calorie burn with high-intensity interval training sessions led by certified instructors.",
    },
    {
      icon: Utensils,
      title: "Nutrition Planning",
      description: "Get personalized meal plans and nutrition advice from our certified dietitians and nutritionists.",
    },
    {
      icon: Zap,
      title: "CrossFit Training",
      description: "Challenge yourself with functional movements and constantly varied workouts in our CrossFit zone.",
    },
    {
      icon: Brain,
      title: "Mindfulness & Yoga",
      description: "Balance your fitness routine with meditation, yoga, and recovery sessions for mental wellness.",
    },
  ];

  return (
    <section id="services" className="section-padding bg-secondary/30">
      <div className="container-custom mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-primary uppercase tracking-widest text-sm font-medium">
            What We Offer
          </span>
          <h2 className="font-display text-4xl md:text-6xl text-foreground mt-4">
            OUR <span className="text-primary">SERVICES</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mt-4">
            From strength training to mindfulness, we offer everything you need 
            to achieve your complete fitness transformation.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="group relative p-8 bg-card rounded-lg border border-border overflow-hidden transition-all duration-500 hover:border-primary/50"
            >
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Icon */}
              <div className="relative w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <service.icon className="w-7 h-7 text-primary" />
              </div>
              
              {/* Content */}
              <h3 className="relative font-display text-2xl text-foreground mb-3 group-hover:text-primary transition-colors">
                {service.title}
              </h3>
              <p className="relative text-muted-foreground">
                {service.description}
              </p>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
