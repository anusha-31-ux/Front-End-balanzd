/**
 * About Section Component
 * Why BALANZED exists
 */
const About = () => {
  return (
    <section id="about" className="section-padding bg-background">
      <div className="container-custom mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-primary uppercase tracking-widest text-sm font-medium">
            About Us
          </span>
          <h2 className="font-display text-4xl md:text-6xl text-foreground mt-4">
            WHY <span className="text-primary">BALANZED</span> EXISTS?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mt-4">
            Because health is more than just looking fit — it's about how you live every day.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-6 text-muted-foreground text-lg leading-relaxed">
          <p>
            Over the years, one thing became very clear to us.<br />
            <span className="text-foreground font-medium">When fitness is taught the right way, people genuinely transform.</span>
          </p>

          <p>
            In our previous budget-friendly programs, people didn't just lose weight —
            they built consistency, improved their energy levels, reduced health issues, and finally understood why they were doing what they were doing.
          </p>

          <p>
            With clear guidance and simple routines, fitness stopped feeling confusing or intimidating.
          </p>

          <p>
            But we also realised something important.<br />
            For most people, fitness is seen as only about looking good.
          </p>

          <p className="text-foreground font-medium">
            The truth is different.
          </p>

          <p>
            Real health starts from within — digestion, hormonal balance, energy levels, sleep quality, and mental well-being.
            When these are taken care of, physical changes happen naturally.
          </p>

          <p>
            That's when <span className="text-primary font-semibold">BALANZED</span> was created.
          </p>

          <p>
            To take everything we learned from real people, real struggles, and real results —
            and make it accessible to more people in a simple, honest, and sustainable way.
          </p>

          {/* Highlighted List */}
          <div className="py-6 space-y-2">
            <p className="text-foreground">No extreme diets.</p>
            <p className="text-foreground">No unrealistic promises.</p>
            <p className="text-foreground">No shortcuts.</p>
          </div>

          <p className="text-foreground font-medium">
            Just fitness taught the right way, designed for real life.
          </p>

          {/* Closing Line - Bold/Strong */}
          <div className="mt-12 p-8 bg-card rounded-lg border border-primary/30 text-center">
            <p className="text-2xl md:text-3xl font-display text-foreground leading-relaxed">
              Fitness doesn't start with the body.<br />
              <span className="text-primary">It starts with lifestyle.</span>
            </p>
            <p className="text-xl text-foreground font-semibold mt-4">
              That is what BALANZED stands for.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
