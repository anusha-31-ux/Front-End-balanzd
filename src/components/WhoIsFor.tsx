import { Check, X } from "lucide-react";

/**
 * Who is BALANZED for? Section Component
 */
const WhoIsFor = () => {
  const forYouIf = [
    "You are starting fitness again or beginning for the first time",
    "You want to stay healthy while managing work, family, and daily responsibilities",
    "You prefer a completely home-workout program",
    "You want simple guidance, not gym pressure or complicated routines",
    "You are comfortable learning in Kannada",
    "You are looking for sustainable health, not extreme approaches",
    "You value live guidance, routine, and consistency",
    "You appreciate practical food guidance, simple recipes, and learning how to build balanced meals at home",
    "You want fitness that fits naturally into your daily lifestyle"
  ];

  const reassurance = [
    "You don't need gym access.",
    "You don't need fancy equipment.",
    "You don't need prior experience."
  ];

  return (
    <section className="section-padding bg-card">
      <div className="container-custom mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-primary uppercase tracking-widest text-sm font-medium">
            Is This For You?
          </span>
          <h2 className="font-display text-4xl md:text-6xl text-foreground mt-4">
            Who is <span className="text-primary">BALANZED</span> for?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mt-4">
            BALANZED is built to make health a part of everyday life.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* For You If Section */}
          <div className="mb-12">
            <h3 className="font-display text-2xl text-foreground mb-6 text-center">
              BALANZED is for you if:
            </h3>
            <div className="grid gap-4">
              {forYouIf.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 bg-background rounded-lg border border-border hover:border-primary/50 transition-colors"
                >
                  <Check className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-foreground text-lg">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Reassurance */}
          <div className="p-8 bg-primary/10 rounded-lg border border-primary/30 mb-12">
            <h3 className="font-display text-2xl text-foreground mb-6 text-center">
              A quick reassurance
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {reassurance.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 justify-center"
                >
                  <X className="w-5 h-5 text-primary" />
                  <p className="text-foreground font-medium">{item}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-muted-foreground mt-6 text-lg">
              All you need is the intent to start — we'll guide you step by step.
            </p>
          </div>

          {/* Closing Line */}
          <div className="text-center">
            <p className="text-2xl md:text-3xl font-display text-foreground">
              If you've been waiting for the right time to begin,{" "}
              <span className="text-primary">this is it.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoIsFor;
