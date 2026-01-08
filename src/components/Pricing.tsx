import { Button } from "@/components/ui/button";
import { Check, Trophy, Clock, Sparkles } from "lucide-react";
import { useState } from "react";
import { useRazorpay, PaymentParams } from "@/hooks/useRazorpay";
import { toast } from "sonner";


/**
 * Pricing Section Component
 * Displays membership plans with tab navigation and collects user info for Razorpay
 */
const Pricing = () => {
  const [activeTab, setActiveTab] = useState<"1month" | "3months" | "6months">("6months");
  const { initiatePayment, isLoading } = useRazorpay();

  // User input state
  const [showModal, setShowModal] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [instagramId, setInstagramId] = useState("");
  const [health , setHealth ] = useState("");
  const [goal , setGoal ] = useState("");
   


  const plans = {
    "6months": {
      duration: "6 Months",
      badge: "BEST VALUE",
      showPrize: true,
      prizeText: "Eligible for ₹3,00,000 Cash Prize*",
      prizeNote: "(*Details mentioned in Challenge Policy)",
      actualPrice: "₹4,194",
      offerPrice: "₹2,949",
      amount: 2949,
      offerText: "January Launch Offer",
      offerValidity: "Offer valid till 31st January",
      features: [
        "Daily LIVE Workout Sessions",
        "10 Flexible Batches Daily (Morning & Evening)",
        "Strength Training (Mon, Wed, Fri)",
        "Yoga Sessions (Tue, Thu)",
        "Completely Home-Based Workouts",
        "Beginner Friendly – All Levels Welcome",
        "Balanced Nutrition Guidance",
        "Easy Cooking & Recipe Videos",
        "Educational Health Talks & Workshops",
        "Community Support & Accountability",
        "Access to Private Balanzed Community Page",
        "Habit-Building Focus (not just weight loss)",
      ],
      tagline: "Best plan for long-term lifestyle change & consistency.",
    },
    "3months": {
      duration: "3 Months",
      badge: null,
      showPrize: false,
      prizeText: "",
      prizeNote: "",
      actualPrice: "₹2,097",
      offerPrice: "₹1,533",
      amount: 1533,
      offerText: "January Launch Offer",
      offerValidity: "Offer valid till 31st January",
      features: [
        "Daily LIVE Workout Sessions",
        "10 Flexible Batches Daily",
        "Strength Training & Yoga Sessions",
        "Home-Based, Beginner Friendly Workouts",
        "Balanced Nutrition Guidance",
        "Easy Cooking & Recipe Videos",
        "Educational Health Talks",
        "Community Support",
        "Access to Private Community Page",
      ],
      tagline: "Ideal for building consistency & seeing visible lifestyle improvement.",
    },
    "1month": {
      duration: "1 Month",
      badge: null,
      showPrize: false,
      prizeText: "",
      prizeNote: "",
      actualPrice: "₹699",
      offerPrice: "₹589",
      amount: 589,
      offerText: "January Launch Offer",
      offerValidity: "Offer valid till 31st January",
      features: [
        "Daily LIVE Workout Sessions",
        "10 Flexible Batches Daily",
        "Strength Training & Yoga Sessions",
        "Home-Based Beginner Friendly Workouts",
        "Basic Nutrition Guidance",
        "Community Support",
        "Access to Private Community Page",
      ],
      tagline: "Perfect for beginners to start their fitness journey.",
    },
  };

  const currentPlan = plans[activeTab];

  // Open modal to collect user info
  const handleJoinNow = () => setShowModal(true);

  // Confirm payment after collecting user info
  const handleConfirmPayment = () => {
    if (!customerName || !customerEmail || !customerPhone || !instagramId || !health || !goal) {
      toast.info("Please fill all fields before proceeding to payment");
      return;
    }

    const paymentData: PaymentParams = {
      amount: currentPlan.amount,
      planName: `${currentPlan.duration} LIVE FITNESS PROGRAM`,
      customerName,
      customerEmail,
      customerPhone,
      instagramId,
      health,
      goal,
    };

    initiatePayment(paymentData);
    // ✅ Reset form after modal
    setCustomerName("");
    setCustomerEmail("");
    setCustomerPhone("");
    setInstagramId("");
    setHealth("");
    setGoal("");
    setShowModal(false);
  };

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

        {/* Pricing Card */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl">
            {/* Tab Navigation */}
            {/* <div className="flex justify-center gap-2 p-4 bg-secondary/50 border-b border-border">
              {["1month", "3months", "6months"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as "1month" | "3months" | "6months")}
                  className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 ${
                    activeTab === tab
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "bg-background text-foreground border border-border hover:border-primary"
                  }`}
                >
                  {plans[tab as "1month" | "3months" | "6months"].duration}
                  {currentPlan.badge && tab === "6months" && (
                    <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                      BEST
                    </span>
                  )}
                </button>
              ))}
            </div> */}
            <div className="flex justify-center gap-2 p-4 bg-secondary/50 border-b border-border">
  {(["1month", "3months", "6months"] as const).map((tab) => {
    const plan = plans[tab];

    return (
      <button
        key={tab}
        onClick={() => setActiveTab(tab)}
        className={`relative px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 ${
          activeTab === tab
            ? "bg-primary text-primary-foreground shadow-lg"
            : "bg-background text-foreground border border-border hover:border-primary"
        }`}
      >
        {plan.duration}

        {/* ✅ BEST badge */}
        {plan.badge && tab === "6months" && (
          <span className="absolute -top-2 -right-2 animate-bounce bg-destructive text-destructive-foreground text-[10px] px-1.5 py-0.5 rounded-full font-bold">
  BEST
</span>

        )}
      </button>
    );
  })}
</div>

            {/* Plan Content */}
            <div className="p-6 sm:p-8">
              {/* Plan Title */}
              <div className="text-center mb-6">
                <h3 className="font-display text-2xl sm:text-3xl text-foreground mb-2">
                  {currentPlan.duration} LIVE FITNESS PROGRAM
                </h3>
                {currentPlan.badge && (
                  <span className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                    {currentPlan.badge}
                  </span>
                )}
              </div>

              {/* Prize Section */}
              {currentPlan.showPrize && (
                <div className="bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 rounded-xl p-4 mb-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Trophy className="w-5 h-5 text-primary" />
                    <span className="text-foreground font-bold text-lg">{currentPlan.prizeText}</span>
                  </div>
                  <p className="text-muted-foreground text-sm">{currentPlan.prizeNote}</p>
                </div>
              )}

              {/* Pricing */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <span className="text-muted-foreground line-through text-xl">
                    {currentPlan.actualPrice}
                  </span>
                  <span className="font-display text-4xl sm:text-5xl text-primary">
                    {currentPlan.offerPrice}
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
                <ul className="space-y-3">
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
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Join Now"}
              </Button>
            </div>
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
              <Button variant="outline" className="w-full" onClick={() => setShowModal(false)}>
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
