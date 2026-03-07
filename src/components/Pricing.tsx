import { Button } from "@/components/ui/button";
import { Check, Trophy, Clock, Sparkles, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useRazorpay, PaymentParams } from "@/hooks/useRazorpay";
import { toast } from "sonner";
import { pricingService } from "@/services/pricingService";
import { PricingPlan } from "@/types/pricing";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * Pricing Section Component
 * Displays membership plans dynamically from the pricing service
 * Admin can edit plans from the admin panel, changes reflect automatically here
 */
const Pricing = () => {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [detailsPlan, setDetailsPlan] = useState<PricingPlan | null>(null);
  const { initiatePayment, isLoading: isPaymentLoading } = useRazorpay();

  // User input state
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [instagramId, setInstagramId] = useState("");
  const [health, setHealth] = useState("");
  const [goal, setGoal] = useState<string[]>([]);

  // Refund policy dialog state
  const [showRefundPolicy, setShowRefundPolicy] = useState(false);
  const [refundPolicyAcknowledged, setRefundPolicyAcknowledged] = useState(false);
  
  // Track touched fields for validation display
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  
  const goalOptions = [
    "Weight Loss",
    "Fat Loss",
    "Muscle Gain",
    "Strength",
    "Endurance",
    "Flexibility",
    "Mobility",
    "General Fitness",
    "Body Recomposition",
  ];

  // Load plans on component mount
  useEffect(() => {
    loadPlans();
  }, []);

  // Reset form when modal closes
  useEffect(() => {
    if (!showModal) {
      setCustomerName("");
      setCustomerEmail("");
      setCustomerPhone("");
      setInstagramId("");
      setHealth("");
      setGoal([]);
      setRefundPolicyAcknowledged(false);
      setTouchedFields({});
    }
  }, [showModal]);

  // Validation helper
  const isFormValid = (): boolean => {
    return (
      customerName.trim() !== "" &&
      customerEmail.trim() !== "" &&
      customerPhone.trim().length === 10 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail) &&
      instagramId.trim() !== "" &&
      health.trim() !== "" &&
      goal.length > 0 &&
      refundPolicyAcknowledged
    );
  };

  const isFieldEmpty = (value: string): boolean => value.trim() === "";
  const isFieldTouched = (field: string): boolean => touchedFields[field] ?? false;
  const getFieldBorderClass = (field: string, value: string): string => {
    if (!isFieldTouched(field)) return "";
    return isFieldEmpty(value) ? "border-red-500" : "";
  };

  const handleFieldBlur = (field: string) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }));
  };

  /**
   * Load pricing plans from the service
   */
  const loadPlans = async () => {
    try {
      setLoading(true);
      const data = await pricingService.getPlans();
      if (data.length > 0) {
        setPlans(data);
      } else {
        toast.info("No pricing plans available at the moment");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load pricing plans";
      toast.error(errorMessage);
      console.error("Error loading pricing plans:", error);
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle plan selection - open modal with selected plan
  const handleSelectPlan = (plan: PricingPlan) => {
    setSelectedPlan(plan);
    setShowModal(true);
  };

  // Confirm payment after collecting user info
  const handleConfirmPayment = () => {
    if (
      !customerName ||
      !customerEmail ||
      !customerPhone ||
      !instagramId ||
      !health ||
      !goal.length
    ) {
      toast.info("Please fill all fields before proceeding to payment");
      return;
    }

    if (!refundPolicyAcknowledged) {
      toast.info("Please acknowledge the refund policy before proceeding");
      return;
    }

    if (!selectedPlan) return;

    const paymentData: PaymentParams = {
      amount: selectedPlan.offerPrice,
      planName: `${selectedPlan.duration} LIVE FITNESS PROGRAM`,
      customerName,
      customerEmail,
      customerPhone,
      instagramId,
      health,
      goal: goal.join(", "),
    };

    initiatePayment(paymentData);
    // Reset form after modal
    setCustomerName("");
    setCustomerEmail("");
    setCustomerPhone("");
    setInstagramId("");
    setHealth("");
    setGoal([]);
    setRefundPolicyAcknowledged(false);
    setShowModal(false);
    setSelectedPlan(null);
  };

  const isFormReady = isFormValid();
  const isSubmitDisabled = isPaymentLoading || !isFormReady;

  if (loading) {
    return (
      <section id="pricing" className="section-padding bg-secondary/30">
        <div className="container-custom mx-auto text-center">
          <p className="text-muted-foreground">Loading pricing plans...</p>
        </div>
      </section>
    );
  }

  if (plans.length === 0) {
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
        <div className="flex flex-wrap justify-center gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-card border-2 rounded-2xl overflow-visible shadow-lg transition-all duration-300 hover:border-primary/70 hover:shadow-2xl hover:scale-105 flex flex-col relative w-full md:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] max-w-[300px]"
            >
              {/* Badge at Top - Outside the Card */}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <div className="bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider py-1.5 px-4 rounded-full whitespace-nowrap shadow-md">
                    {plan.badge}
                  </div>
                </div>
              )}
              
              <div className="p-5 flex flex-col flex-1">
                {/* Plan Header */}
                <div className="text-center font-bold">
                  <h3 className="font-display text-xl sm:text-2xl text-foreground mb-2">
                    {plan.duration}
                  </h3>
                </div>

                {/* Pricing */}
                <div className="text-center mb-4">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="text-muted-foreground line-through text-sm">
                      ₹{plan.actualPrice}
                    </span>
                    <span className="font-display text-3xl text-primary font-semibold">
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
                  variant="default"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => handleSelectPlan(plan)}
                >
                  Choose Plan
                </Button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDetailsPlan(plan);
                    setShowDetailsModal(true);
                  }}
                  className="text-xs text-primary font-semibold mt-3 mx-auto flex items-center gap-1 hover:underline transition-all"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>View Plan Details</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Plan Details Modal */}
      {showDetailsModal && detailsPlan && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-black border p-6 rounded-xl w-[90%] max-w-2xl max-h-[80vh] overflow-y-auto">
            {/* Plan Header - Compact */}
            <div className="text-center mb-4 pb-3 border-b border-yellow-600">
              <h3 className="text-3xl font-bold text-white">{detailsPlan.duration} Plan</h3>
              <div className="flex items-center justify-center gap-2 mt-2">
                <p className="text-gray-400 text-sm line-through">
                  ₹{detailsPlan.actualPrice}
                </p>
                <p className="text-yellow-400 font-semibold text-3xl">
                  ₹{detailsPlan.offerPrice}
                </p>
              </div>
              <p className="text-yellow-400 text-xs mt-1">{detailsPlan.offerText}</p>
              <p className="text-gray-400 text-xs mt-0.5">
                <Clock className="w-3 h-3 inline mr-1" />
                {detailsPlan.offerValidity}
              </p>
            </div>

            {/* Prize Section */}
            {detailsPlan.showPrize && (
              <div className="bg-yellow-500/10 border border-yellow-600/40 rounded-lg p-3 mb-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <span className="text-white font-bold text-sm">
                    {detailsPlan.prizeText}
                  </span>
                </div>
                <p className="text-gray-300 text-xs">{detailsPlan.prizeNote}</p>
              </div>
            )}

            {/* Tagline */}
            <p className="text-center text-white text-sm font-medium mb-4 bg-yellow-500/10 rounded-lg py-2 px-3 border border-yellow-600/30">
              👉 {detailsPlan.tagline}
            </p>

            {/* All Features */}
            <div className="mb-4">
              <h4 className="text-base font-semibold mb-3 flex items-center gap-2 text-white">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                Complete Features List:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {detailsPlan.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm leading-snug">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 mt-4 sm:flex-row">
              <Button
                variant="outline"
                className="w-full border-yellow-600 text-yellow-400 hover:bg-yellow-500/10 hover:text-yellow-300"
                onClick={() => {
                  setShowDetailsModal(false);
                  setDetailsPlan(null);
                }}
              >
                Close
              </Button>
              <Button
                variant="default"
                className="w-full bg-yellow-500 text-black hover:bg-yellow-400"
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedPlan(detailsPlan);
                  setDetailsPlan(null);
                  setShowModal(true);
                }}
              >
                Select This Plan
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* User Info Modal */}
      {showModal && selectedPlan && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-black border p-6 rounded-xl w-[95%] max-w-2xl h-fit max-h-[calc(100vh-2rem)] overflow-y-auto">
            {/* Selected Plan Header */}
            <div className="text-center mb-4 pb-4 border-b border-yellow-600">
              <h3 className="text-2xl font-bold text-white">{selectedPlan.duration} Plan</h3>
              {selectedPlan.badge && (
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-yellow-600 text-black mt-2">
                  {selectedPlan.badge}
                </span>
              )}
              <div className="flex items-center justify-center gap-3 mt-3">
                <p className="text-gray-400 text-sm line-through">
                  ₹{selectedPlan.actualPrice}
                </p>
                <p className="text-yellow-400 font-semibold text-2xl">
                  ₹{selectedPlan.offerPrice}
                </p>
              </div>
              <div className="flex items-center justify-center gap-1 text-yellow-400 text-xs mb-1">
                    <Sparkles className="w-3 h-3" />
                    <span className="font-semibold">{selectedPlan.offerText}</span>
                  </div>
            </div>

            <h4 className="text-lg font-semibold text-center mb-4 text-white">Enter Your Details</h4>
            <input
              className={`w-full mb-3 px-3 py-2 bg-black border-2 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500/50 ${ getFieldBorderClass("name", customerName)}`}
              placeholder="Name *"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              onBlur={() => handleFieldBlur("name")}
              required
            />
            <input
              type="tel"
              className={`w-full mb-3 px-3 py-2 bg-black border-2 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500/50 ${getFieldBorderClass("phone", customerPhone)}`}
              placeholder="WhatsApp Number (10 digits) *"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value.slice(0, 10).replace(/\D/g, ""))}
              onBlur={() => handleFieldBlur("phone")}
              maxLength={10}
              pattern="[0-9]{10}"
              title="Please enter a valid 10-digit mobile number"
              required
            />
            <input
              className={`w-full mb-3 px-3 py-2 bg-black border-2 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500/50 ${getFieldBorderClass("email", customerEmail)}`}
              placeholder="Email Address *"
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              onBlur={() => handleFieldBlur("email")}
              required
            />
            <input
              type="text"
              placeholder="Instagram ID *"
              value={instagramId}
              onChange={(e) => setInstagramId(e.target.value)}
              onBlur={() => handleFieldBlur("instagram")}
              className={`w-full mb-3 px-3 py-2 bg-black border-2 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500/50 ${getFieldBorderClass("instagram", instagramId)}`}
              required
            />
            <input
              type="text"
              placeholder="Health Issues If Any *"
              value={health}
              onChange={(e) => setHealth(e.target.value)}
              onBlur={() => handleFieldBlur("health")}
              className={`w-full mb-3 px-3 py-2 bg-black border-2 rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500/50 ${getFieldBorderClass("health", health)}`}
              required
            />
            <div className={`mb-3 p-3 bg-black border-2 rounded ${getFieldBorderClass("goal", goal.length > 0 ? "selected" : "")}`}>
              <label className="block text-white mb-2">Fitness Goal * (Select multiple)</label>
              <div className="grid grid-cols-3 gap-2">
                {goalOptions.map((option) => (
                  <label key={option} className="flex items-center gap-2 text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={goal.includes(option)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setGoal([...goal, option]);
                        } else {
                          setGoal(goal.filter(g => g !== option));
                        }
                      }}
                      onBlur={() => handleFieldBlur("goal")}
                      className="bg-black border rounded accent-yellow-500 cursor-pointer"
                    />
                    <span className="text-sm">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Refund Policy Acknowledgment */}
            <div className="mb-4">
              <label className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={refundPolicyAcknowledged}
                  onChange={(e) => setRefundPolicyAcknowledged(e.target.checked)}
                  className="mt-1 bg-black border rounded accent-yellow-500 cursor-pointer"
                />
                <span className="text-gray-300">
                  I acknowledge that all purchases are{" "}
                  <button
                    type="button"
                    onClick={() => setShowRefundPolicy(true)}
                    className="text-yellow-400 hover:underline font-medium"
                  >
                    non-refundable
                  </button>{" "}
                  as per the refund policy.
                </span>
              </label>
            </div>

            <div className="flex flex-col gap-3 mt-4 sm:flex-row">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowModal(false)}
                disabled={isPaymentLoading}
              >
                Cancel
              </Button>
              {!isFormReady ? (
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="w-full">
                        <Button
                          className="w-full"
                          onClick={handleConfirmPayment}
                          disabled={isSubmitDisabled}
                        >
                          {isPaymentLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            "Proceed to Pay"
                          )}
                        </Button>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="bg-black text-white">
                      <p>Fill all required fields and accept the refund policy.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <Button
                  className="w-full"
                  onClick={handleConfirmPayment}
                  disabled={isPaymentLoading}
                >
                  {isPaymentLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Proceed to Pay"
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Payment Processing Overlay */}
      {isPaymentLoading && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60]">
          <div className="bg-background p-8 rounded-xl text-center shadow-2xl">
            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Processing Payment</h3>
            <p className="text-muted-foreground text-sm">
              Please wait while we prepare your payment...
            </p>
            <p className="text-muted-foreground text-xs mt-2">
              Do not close this window
            </p>
          </div>
        </div>
      )}

      {/* Refund Policy Dialog */}
      <Dialog open={showRefundPolicy} onOpenChange={setShowRefundPolicy}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Refund Policy</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
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
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Pricing;
