import { Button } from "@/components/ui/button";
import { Check, Trophy, Clock, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { useRazorpay, PaymentParams } from "@/hooks/useRazorpay";
import { toast } from "sonner";
import { pricingService } from "@/services/pricingService";
import { PricingPlan } from "@/types/pricing";

/**
 * Pricing Section Component
 * Displays membership plans dynamically from the pricing service
 * Admin can edit plans from the admin panel, changes reflect automatically here
 */
const Pricing = () => {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const { initiatePayment, isLoading: isPaymentLoading } = useRazorpay();

  // User input state
  const [showModal, setShowModal] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [instagramId, setInstagramId] = useState("");
  const [health, setHealth] = useState("");
  const [goal, setGoal] = useState("");

  // Load plans on component mount
  useEffect(() => {
    loadPlans();
  }, []);

  /**
   * Load pricing plans from the service
   */
  const loadPlans = async () => {
    try {
      setLoading(true);
      const data = await pricingService.getPlans();
      if (data.length > 0) {
        setPlans(data);
        // Set active tab to the most popular plan or first one
        const mostPopular =
          data.find((p) => p.badge?.includes("POPULAR")) || data[0];
        setActiveTabId(mostPopular.id);
      }
    } catch (error) {
      toast.error("Failed to load pricing plans");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const currentPlan = plans.find((p) => p.id === activeTabId);

  // Open modal to collect user info
  const handleJoinNow = () => setShowModal(true);

  // Confirm payment after collecting user info
  const handleConfirmPayment = () => {
    if (
      !customerName ||
      !customerEmail ||
      !customerPhone ||
      !instagramId ||
      !health ||
      !goal
    ) {
      toast.info("Please fill all fields before proceeding to payment");
      return;
    }

    if (!currentPlan) return;

    const paymentData: PaymentParams = {
      amount: currentPlan.offerPrice,
      planName: `${currentPlan.duration} LIVE FITNESS PROGRAM`,
      customerName,
      customerEmail,
      customerPhone,
      instagramId,
      health,
      goal,
    };

    initiatePayment(paymentData);
    // Reset form after modal
    setCustomerName("");
    setCustomerEmail("");
    setCustomerPhone("");
    setInstagramId("");
    setHealth("");
    setGoal("");
    setShowModal(false);
  };

  if (loading) {
    return (
      <section id="pricing" className="section-padding bg-secondary/30">
        <div className="container-custom mx-auto text-center">
          <p className="text-muted-foreground">Loading pricing plans...</p>
        </div>
      </section>
    );
  }

  if (!currentPlan || plans.length === 0) {
    return (
      <section id="pricing" className="section-padding bg-secondary/30">
        <div className="container-custom mx-auto text-center">
          <p className="text-muted-foreground">No pricing plans available</p>
        </div>
      </section>
    );
  }

  return (
    <section id="pricing" className="section-padding bg-secondary/30">
      <div className="container-custom mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-primary uppercase tracking-widest text-sm font-medium">
            Membership Plans
          </span>
          <h2 className="font-display text-4xl md:text-6xl text-foreground mt-4">
            CHOOSE YOUR <span className="text-primary">PLAN</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mt-4">
            Flexible membership options to fit your goals and budget.
          </p>
        </div>

        {/* Pricing Cards Grid - Select Plan */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-card border-2 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 cursor-pointer ${
                activeTabId === plan.id
                  ? "border-primary shadow-2xl scale-105"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => setActiveTabId(plan.id)}
            >
              <div className="p-6">
                {/* Plan Header */}
                <div className="text-center mb-4">
                  <h3 className="font-display text-xl sm:text-2xl text-foreground mb-2">
                    {plan.duration}
                  </h3>
                  {plan.badge && (
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        activeTabId === plan.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-primary/20 text-primary"
                      }`}
                    >
                      {plan.badge}
                    </span>
                  )}
                </div>

                {/* Prize Section */}
                {plan.showPrize && (
                  <div className="bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 rounded-lg p-3 mb-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Trophy className="w-4 h-4 text-primary" />
                      <span className="text-foreground font-bold text-sm">
                        {plan.prizeText}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-xs">{plan.prizeNote}</p>
                  </div>
                )}

                {/* Pricing */}
                <div className="text-center mb-4">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="text-muted-foreground line-through text-sm">
                      ₹{plan.actualPrice}
                    </span>
                    <span className="font-display text-3xl text-primary">
                      ₹{plan.offerPrice}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-1 text-primary text-xs mb-1">
                    <Sparkles className="w-3 h-3" />
                    <span className="font-semibold">{plan.offerText}</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 text-muted-foreground text-xs">
                    <Clock className="w-3 h-3" />
                    <span>⏳ {plan.offerValidity}</span>
                  </div>
                </div>

                {/* Select Button */}
                <Button
                  variant={activeTabId === plan.id ? "default" : "outline"}
                  size="sm"
                  className="w-full text-xs mb-4"
                >
                  {activeTabId === plan.id ? "Selected" : "Select Plan"}
                </Button>

                {/* Brief Features */}
                <div className="space-y-1">
                  {plan.features.slice(0, 3).map((feature, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Check className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground text-xs line-clamp-2">
                        {feature}
                      </span>
                    </div>
                  ))}
                  {plan.features.length > 3 && (
                    <div className="text-xs text-primary font-semibold">
                      +{plan.features.length - 3} more features
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Plan View */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl p-8">
            {/* Plan Title */}
            <div className="text-center mb-6">
              <h3 className="font-display text-3xl text-foreground mb-2">
                {currentPlan.duration} LIVE FITNESS PROGRAM
              </h3>
              {currentPlan.badge && (
                <span className="inline-block bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-semibold">
                  {currentPlan.badge}
                </span>
              )}
            </div>

            {/* Prize Section */}
            {currentPlan.showPrize && (
              <div className="bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 rounded-xl p-4 mb-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Trophy className="w-5 h-5 text-primary" />
                  <span className="text-foreground font-bold text-lg">
                    {currentPlan.prizeText}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm">{currentPlan.prizeNote}</p>
              </div>
            )}

            {/* Pricing */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="text-muted-foreground line-through text-xl">
                  ₹{currentPlan.actualPrice}
                </span>
                <span className="font-display text-5xl text-primary">
                  ₹{currentPlan.offerPrice}
                </span>
              </div>
              <div className="flex items-center justify-center gap-2 text-primary">
                <Sparkles className="w-4 h-4" />
                <span className="font-semibold">{currentPlan.offerText}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-muted-foreground mt-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm">⏳ {currentPlan.offerValidity}</span>
              </div>
            </div>

            {/* Features */}
            <div className="mb-6">
              <h4 className="text-foreground font-semibold mb-4">What you get:</h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentPlan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tagline */}
            <p className="text-center text-foreground font-medium mb-6 bg-secondary/50 rounded-lg py-3 px-4">
              👉 {currentPlan.tagline}
            </p>

            {/* CTA */}
            <Button
              variant="hero"
              size="lg"
              className="w-full text-lg py-6"
              onClick={handleJoinNow}
              disabled={isPaymentLoading}
            >
              {isPaymentLoading ? "Processing..." : "Join Now"}
            </Button>
          </div>
        </div>
      </div>

      {/* User Info Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-xl w-[90%] max-w-md">
            <h3 className="text-xl font-bold text-center mb-4">Enter Your Details</h3>
            <input
              className="w-full mb-3 p-2 border border-gray-300 rounded text-black"
              placeholder="Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
            <input
              type="tel"
              className="w-full mb-3 p-2 border border-gray-300 rounded text-black"
              placeholder="WhatsApp Number"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              maxLength={10}
              pattern="[0-9]{10}"
              title="Please enter a valid 10-digit mobile number"
            />
            <input
              className="w-full mb-3 p-2 border border-gray-300 rounded text-black"
              placeholder="Email Address"
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
            />
            <input
              type="text"
              placeholder="Instagram ID"
              value={instagramId}
              onChange={(e) => setInstagramId(e.target.value)}
              className="w-full mb-3 p-2 border border-gray-300 rounded text-black"
            />
            <input
              type="text"
              placeholder="Health Issues If Any"
              value={health}
              onChange={(e) => setHealth(e.target.value)}
              className="w-full mb-3 p-2 border border-gray-300 rounded text-black"
            />
            <input
              type="text"
              placeholder="Fitness Goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full mb-3 p-2 border border-gray-300 rounded text-black"
            />

            <div className="flex gap-3 mt-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
              <Button className="w-full" onClick={handleConfirmPayment}>
                Proceed to Pay
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Pricing;
