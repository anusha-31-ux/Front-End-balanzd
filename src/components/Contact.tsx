import { Phone, Mail, Clock } from "lucide-react";

/**
 * Contact Section Component
 * Contact information display
 */
const Contact = () => {

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      content: "+91 9019893582",
    },
    {
      icon: Mail,
      title: "Email",
      content: "support@balanzd.com",
    },
    {
      icon: Clock,
      title: "Hours",
      content: "10am to 10pm all days",
    },
  ];

  return (
    <section id="contact" className="section-padding bg-background">
      <div className="container-custom mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-primary uppercase tracking-widest text-sm font-medium">
            Get In Touch
          </span>
          <h2 className="font-display text-4xl md:text-6xl text-foreground mt-4">
            CONTACT <span className="text-primary">US</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mt-4">
            Ready to start your fitness journey? Reach out to us and let's discuss 
            how we can help you achieve your goals.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {contactInfo.map((info) => (
            <div
              key={info.title}
              className="flex items-start gap-4 p-6 bg-card rounded-lg border border-border transition-all duration-300 hover:border-primary/50"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <info.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">{info.title}</h4>
                <p className="text-muted-foreground">{info.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Contact;
