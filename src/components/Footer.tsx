import { useState } from "react";
import { Instagram, Facebook, Twitter, Youtube } from "lucide-react";
import logo from "@/assets/logo_balanzed.png";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/**
 * Footer Component
 * Site footer with links and social media
 */
const Footer = () => {
  const [selectedPolicy, setSelectedPolicy] = useState<string | null>(null);

  const quickLinks = [
    { label: "About Us", href: "#about" },
    // { label: "Services", href: "#services" },
    { label: "Programs", href: "#programs" },
    { label: "Trainers", href: "#trainers" },
    { label: "Pricing", href: "#pricing" },
    { label: "Contact", href: "#contact" },
  ];

  const programs = [
    { label: "Strength Training", href: "#programs" },
    { label: "Yoga Sessions", href: "#programs" },
    { label: "Live Workouts", href: "#programs" },
  ];

  const policies = [
    {
      id: "refund",
      label: "Refund Policy",
      title: "Refund Policy",
      content: (
        <div className="space-y-4">
          <p className="text-lg font-semibold text-foreground">
            All purchases made on BALANZED are non-refundable.
          </p>
          <p className="text-muted-foreground">
            Once a program is activated, refunds will not be provided under any circumstances, including:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Change of mind</li>
            <li>Schedule issues</li>
            <li>Non-attendance of sessions</li>
          </ul>
          <p className="text-muted-foreground">
            In case of genuine technical issues from our side that prevent access to sessions, users may contact our support team for resolution.
          </p>
        </div>
      ),
    },
    {
      id: "privacy",
      label: "Privacy Policy",
      title: "Privacy Policy",
      content: (
        <ul className="list-disc pl-6 space-y-4 text-muted-foreground">
          <li>
            User data such as name, phone number, and email will be used only for communication and program purposes.
          </li>
          <li>
            BALANZED does not sell or share personal data with third parties.
          </li>
          <li>
            Payment details are processed securely through third-party payment gateways.
          </li>
        </ul>
      ),
    },
    {
      id: "terms",
      label: "Terms & Conditions",
      title: "Terms & Conditions",
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">By enrolling in any BALANZED program:</p>
          <ul className="list-disc pl-6 space-y-4 text-muted-foreground">
            <li>You agree to follow trainer instructions.</li>
            <li>You understand results vary from person to person.</li>
            <li>You agree not to misuse content or session access links.</li>
            <li>Sharing live session links with others is strictly prohibited.</li>
          </ul>
        </div>
      ),
    },
    {
      id: "prize",
      label: "Prize Challenge Policy",
      title: "Prize Challenge Policy",
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-display text-foreground">Consistency Challenge Policy</h3>
          <ul className="list-disc pl-6 space-y-4 text-muted-foreground">
            <li>Cash prizes are applicable only for 6-month plan participants.</li>
            <li>Winners are selected based on consistency, participation, discipline, lab report and overall engagement.</li>
            <li>Decisions taken by BALANZED team regarding challenge results are final.</li>
            <li>This challenge is meant to motivate healthy habits, not extreme physical transformation.</li>
          </ul>
        </div>
      ),
    },
    {
      id: "program",
      label: "Program Policy",
      title: "Program Policy",
      content: (
        <ul className="list-disc pl-6 space-y-4 text-muted-foreground">
          <li>This is a live group workout program conducted online.</li>
          <li>Participants must consult a doctor before joining if they have any medical condition.</li>
          <li>BALANZED is not responsible for injuries caused due to improper form or non-adherence to guidance.</li>
          <li>Participants must inform trainers about existing health issues before starting.</li>
        </ul>
      ),
    },
  ];

  const socialLinks = [
    { icon: Instagram, href: "https://www.instagram.com/balanzed.official/?igsh=b2xzMWo5amdwc3cz",  label: "Instagram" },
    { icon: Facebook, href: "https://www.facebook.com/share/1Q2579jZdT/?mibextid=wwXIfr", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  const currentPolicy = policies.find((p) => p.id === selectedPolicy);

  return (
    <footer className="bg-card border-t border-border">
      <div className="container-custom mx-auto px-4 md:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <a href="#home" className="inline-block mb-6">
              <img 
                src={logo} 
                alt="BALANZED" 
                className="h-14 w-auto object-contain"
              />
            </a>
            <p className="text-muted-foreground mb-6">
              Transform your body, transform your life. Join the BALANZED community 
              and unlock your full potential.
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-xl text-foreground mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="font-display text-xl text-foreground mb-6">Programs</h4>
            <ul className="space-y-3">
              {programs.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Policy */}
          <div>
            <h4 className="font-display text-xl text-foreground mb-6">Policy</h4>
            <ul className="space-y-3">
              {policies.map((policy) => (
                <li key={policy.id}>
                  <button
                    onClick={() => setSelectedPolicy(policy.id)}
                    className="text-muted-foreground hover:text-primary transition-colors text-left"
                  >
                    {policy.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © 2024 BALANZED. All rights reserved.
          </p>
        </div>
      </div>

      {/* Policy Modal */}
      <Dialog open={!!selectedPolicy} onOpenChange={(open) => !open && setSelectedPolicy(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">{currentPolicy?.title}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">{currentPolicy?.content}</div>
        </DialogContent>
      </Dialog>
    </footer>
  );
};

export default Footer;
