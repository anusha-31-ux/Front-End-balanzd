import { Button } from "@/components/ui/button";
import { Clock, Users, Calendar, Zap, Check } from "lucide-react";

/**
 * Live Program Section Component
 * Highlights the single live workout program
 */
const LiveProgram = () => {
  const programFeatures = [
    "Live sessions in Kannada",
    "Expert trainers guiding every move",
    "Strength Training: Mon, Wed, Fri",
    "Yoga: Tue & Thu",
    "Join any batch as per your schedule",
    "₹3,00,000 Cash Prize Challenge",
  ];

  return (
    <section id="programs" className="section-padding bg-gradient-to-b from-background to-muted/30">
      <div className="container-custom mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-primary uppercase tracking-widest text-sm font-medium">
            Our Flagship Program
          </span>
          <h2 className="font-display text-4xl md:text-6xl text-foreground mt-4">
            LIVE <span className="text-primary neon-glow">WORKOUT</span> PROGRAM
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mt-4 text-lg">
            Join Karnataka's most exciting fitness revolution — daily live sessions designed for beginners and fitness enthusiasts alike.
          </p>
        </div>

        {/* Main Program Card */}
        <div className="relative max-w-4xl mx-auto">
          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50 rounded-2xl blur-xl opacity-30 animate-pulse" />
          
          <div className="relative p-8 md:p-12 rounded-2xl border-2 border-primary/50 bg-gradient-to-br from-primary/10 via-background to-primary/5 overflow-hidden">
            {/* Badge */}
            <div className="absolute top-4 right-4 px-4 py-1 bg-primary text-primary-foreground text-sm font-bold rounded-full">
              🔴 LIVE
            </div>

            {/* Program Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center p-4 bg-background/50 rounded-lg border border-border">
                <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">10</p>
                <p className="text-sm text-muted-foreground">Daily Batches</p>
              </div>
              <div className="text-center p-4 bg-background/50 rounded-lg border border-border">
                <Calendar className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">Mon-Fri</p>
                <p className="text-sm text-muted-foreground">Weekly Sessions</p>
              </div>
              <div className="text-center p-4 bg-background/50 rounded-lg border border-border">
                <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">1000+</p>
                <p className="text-sm text-muted-foreground">Active Members</p>
              </div>
              <div className="text-center p-4 bg-background/50 rounded-lg border border-border">
                <Zap className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">6 AM</p>
                <p className="text-sm text-muted-foreground">to 8 PM</p>
              </div>
            </div>

            {/* Features List */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {programFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            {/* <div className="text-center">
              <Button variant="hero" size="xl" className="px-12">
               Programs
              </Button>
              <p className="text-muted-foreground text-sm mt-4">
                Limited spots available • Start your transformation today
              </p>
            </div> */}
            <div className="text-center">
  <Button asChild variant="hero" size="xl" className="px-12">
    <a href="#pricing">Programs</a>
  </Button>
  <p className="text-muted-foreground text-sm mt-4">
    Limited spots available • Start your transformation today
  </p>
</div>
            
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveProgram;
