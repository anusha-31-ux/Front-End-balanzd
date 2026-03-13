import { Button } from "@/components/ui/button";
import { Check, Loader2, Star, Clock, Users, X } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { personalTrainingService } from "@/services/personalTrainingService";
import type { PersonalTraining } from "@/types/personalTraining";
import { useRazorpay } from "@/hooks/useRazorpay";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

/**
 * Personal Training Section Component
 * Displays personal training services dynamically from the personal training service
 * Admin can edit services from the admin panel, changes reflect automatically here
 */
const PersonalTraining = () => {
  const [services, setServices] = useState<PersonalTraining[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<PersonalTraining | null>(null);
  const [detailsService, setDetailsService] = useState<PersonalTraining | null>(null);

  // User input state for consultation
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [instagramId, setInstagramId] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [healthConcerns, setHealthConcerns] = useState("");
  const [injuries, setInjuries] = useState("");
  const [foodAllergies, setFoodAllergies] = useState("");
  const [dietExperience, setDietExperience] = useState("");
  const [fitnessGoals, setFitnessGoals] = useState("");
  const [selectedTrainer, setSelectedTrainer] = useState("");
  const [health, setHealth] = useState("");
  const [goal, setGoal] = useState("");
  const [message, setMessage] = useState("");

  // Track touched fields for validation display
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  // Razorpay hook
  const { initiatePayment, isLoading: paymentLoading } = useRazorpay();

  // Load services on component mount
  useEffect(() => {
    loadServices();
  }, []);

  // Reset form when modal closes
  useEffect(() => {
    if (!showModal) {
      setCustomerName("");
      setCustomerEmail("");
      setCustomerPhone("");
      setInstagramId("");
      setAge("");
      setGender("");
      setWeight("");
      setHeight("");
      setHealthConcerns("");
      setInjuries("");
      setFoodAllergies("");
      setDietExperience("");
      setFitnessGoals("");
      setSelectedTrainer("");
      setHealth("");
      setGoal("");
      setMessage("");
      setTouchedFields({});
    }
  }, [showModal]);

  // Validation helper
  const isFormValid = (): boolean => {
    return (
      customerName.trim() !== "" &&
      customerEmail.trim() !== "" &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail) &&
      customerPhone.trim().length === 10 &&
      selectedTrainer.trim() !== ""
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

  const handleTrainerChange = (trainer: string) => {
    setSelectedTrainer(trainer);
    setTouchedFields(prev => ({ ...prev, trainer: true }));
  };

  /**
   * Load personal training services from the service
   */
  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await personalTrainingService.getServices();
      if (data.length > 0) {
        setServices(data);
      } else {
        toast.info("No personal training services available at the moment");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load personal training services";
      toast.error(errorMessage);
      console.error("Error loading personal training services:", error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle service selection - open modal with selected service
  const handleSelectService = (service: PersonalTraining) => {
    setSelectedService(service);
    setShowModal(true);
  };

  // Handle consultation booking with Razorpay
  const handleBookConsultation = async () => {
    if (!isFormValid()) {
      toast.info("Please fill all required fields before booking consultation");
      return;
    }

    try {
      // Initiate Razorpay payment for ₹500 consultation
      await initiatePayment({
        amount: 500, // ₹500 for consultation
        planName: selectedService ? `Consultation - ${selectedService.name}` : "Personal Training Consultation",
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        instagramId: instagramId.trim(),
        age: age.trim(),
        gender: gender.trim(),
        weight: weight.trim(),
        height: height.trim(),
        healthConcerns: healthConcerns.trim(),
        injuries: injuries.trim(),
        foodAllergies: foodAllergies.trim(),
        dietExperience: dietExperience.trim(),
        fitnessGoals: fitnessGoals.trim(),
        selectedTrainer: selectedTrainer.trim(),
        health: health.trim(),
        goal: goal.trim(),
      });

      // Reset form after successful payment initiation
      setCustomerName("");
      setCustomerEmail("");
      setCustomerPhone("");
      setInstagramId("");
      setAge("");
      setGender("");
      setWeight("");
      setHeight("");
      setHealthConcerns("");
      setInjuries("");
      setFoodAllergies("");
      setDietExperience("");
      setFitnessGoals("");
      setSelectedTrainer("");
      setHealth("");
      setGoal("");
      setMessage("");
      setShowModal(false);
      setSelectedService(null);
    } catch (error) {
      console.error("Consultation booking error:", error);
      toast.error("Failed to initiate payment. Please try again.");
    }
  };

  if (loading) {
    return (
      <section id="personal-training" className="section-padding bg-secondary/30">
        <div className="container-custom mx-auto text-center">
          <p className="text-muted-foreground">Loading personal training services...</p>
        </div>
      </section>
    );
  }

  if (services.length === 0) {
    return (
      <section id="personal-training" className="section-padding bg-secondary/30">
        <div className="container-custom mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <span className="text-primary uppercase tracking-widest text-sm font-medium">
              Personal Training
            </span>
            <h2 className="font-display text-4xl md:text-6xl text-foreground mt-4">
              ACHIEVE YOUR <span className="text-primary">GOALS</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mt-4">
              Personalized training programs designed to help you reach your fitness objectives.
            </p>
          </div>

          {/* Consultation Info and Message */}
          <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {/* Why Book Consultation Section */}
            <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-lg">
              <div className="text-center mb-6">
                <h3 className="font-display text-2xl md:text-3xl text-foreground mb-2">
                  Why Book a <span className="text-primary">Consultation</span> First
                </h3>
                <p className="text-muted-foreground">
                  Start your fitness journey with a personalized assessment
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="font-semibold text-foreground flex items-center gap-2 mb-3">
                    <Check className="w-5 h-5 text-primary" />
                    What We Assess:
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      Helps us understand your goals, lifestyle and health history
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      Identify conditions like PCOD, thyroid, hormonal issues
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      Recommend the right program for your body and goals
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      Ensure you start with a clear, personalised plan
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground flex items-center gap-2 mb-3">
                    <Star className="w-5 h-5 text-primary" />
                    What You Get:
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      Customised workout plan based on your body, goals and lifestyle
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      Personalised nutrition plan designed for sustainable fat loss/Weight Gain
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      Daily check-ins and accountability from us
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      Regular progress reviews to track and improve results
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      Guidance on real-life situations like eating out, travel, busy schedules
                    </li>
                  </ul>
                </div>
              </div>

              <div className="text-center">
                <p className="text-primary font-semibold text-lg mb-4">
                  Book your consultation to begin your BALANZED transformation.
                </p>
                <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>₹500 one-time consultation fee</span>
                </div>
              </div>
            </div>

            {/* No Services Message */}
            <div className="flex justify-center">
              <div className="bg-card border-2 rounded-2xl overflow-visible shadow-lg flex flex-col relative w-full max-w-[420px] group p-8 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-muted rounded-full mb-4 mx-auto">
                  <Users className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="font-display text-xl text-foreground mb-2">Services Coming Soon</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Personal training services are currently being configured. Book a consultation to get early access and be the first to know when services become available.
                </p>
                <Button
                  variant="default"
                  size="lg"
                  className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => setShowModal(true)}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Book Consultation
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="personal-training" className="section-padding bg-secondary/30">
      <div className="container-custom mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-primary uppercase tracking-widest text-sm font-medium">
            Personal Training
          </span>
          <h2 className="font-display text-4xl md:text-6xl text-foreground mt-4">
            ACHIEVE YOUR <span className="text-primary">GOALS</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mt-4">
            Personalized training programs designed to help you reach your fitness objectives.
          </p>
        </div>

        {/* Consultation Info and Card Side by Side */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Why Book Consultation Section */}
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-lg">
            <div className="text-center mb-6">
              <h3 className="font-display text-2xl md:text-3xl text-foreground mb-2">
                Why Book a <span className="text-primary">Consultation</span> First
              </h3>
              <p className="text-muted-foreground">
                Start your fitness journey with a personalized assessment
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <h4 className="font-semibold text-foreground flex items-center gap-2 mb-3">
                  <Check className="w-5 h-5 text-primary" />
                  What We Assess:
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    Helps us understand your goals, lifestyle and health history
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    Identify conditions like PCOD, thyroid, hormonal issues
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    Recommend the right program for your body and goals
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    Ensure you start with a clear, personalised plan
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-foreground flex items-center gap-2 mb-3">
                  <Star className="w-5 h-5 text-primary" />
                  What You Get:
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    Customised workout plan based on your body, goals and lifestyle
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    Personalised nutrition plan designed for sustainable fat loss/Weight Gain
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    Daily check-ins and accountability from us
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    Regular progress reviews to track and improve results
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    Guidance on real-life situations like eating out, travel, busy schedules
                  </li>
                </ul>
              </div>
            </div>

            <div className="text-center">
              <p className="text-primary font-semibold text-lg mb-4">
                Book your consultation to begin your BALANZED transformation.
              </p>
              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>₹500 one-time consultation fee</span>
              </div>
            </div>
          </div>

          {/* Personal Training Card */}
          <div className="flex justify-center">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-card border-2 rounded-2xl overflow-visible shadow-lg transition-all duration-300 hover:border-primary/70 hover:shadow-2xl hover:scale-105 flex flex-col relative w-full max-w-[420px] group"
              >
                {/* Decorative gradient border */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                <div className="p-6 flex flex-col flex-1 relative">
                  {/* Service Header with Icon */}
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-3">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-display text-xl sm:text-2xl text-foreground mb-2">
                      {service.name || "Personal Training Service"}
                    </h3>
                    <div className="flex items-center justify-center gap-1 text-sm text-primary font-medium">
                      <Star className="w-4 h-4 fill-current" />
                      <span>Personal Training</span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="text-center mb-6">
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {/* Program Price (Informational) */}
                  <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-4 mb-4 text-center">
                    <div className="text-sm text-muted-foreground mb-1">Program Fee</div>
                    <div className="flex items-center justify-center gap-2 mb-1">
                      {(service.originalPrice || 0) > (service.offerPrice || 10000) && (
                        <div className="text-xl text-muted-foreground line-through">
                          ₹{(service.originalPrice || 12000).toLocaleString()}
                        </div>
                      )}
                      <div className="text-2xl font-bold text-primary">
                        ₹{(service.offerPrice || 10000).toLocaleString()}
                      </div>
                    </div>
                    {(service.originalPrice || 0) > (service.offerPrice || 10000) && (
                      <div className="text-sm font-semibold text-green-600 mb-1">
                        Save {Math.round(((service.originalPrice - service.offerPrice) / service.originalPrice) * 100)}%
                      </div>
                    )}
                    <div className="text-sm text-muted-foreground">
                      for {service.duration || "3 Months"}
                    </div>
                  </div>

                  {/* Additional Price Option */}
                  <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-4 mb-4 text-center">
                    <div className="text-sm text-muted-foreground mb-1">
                      {service.secondaryName || "Premium Package"}
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-1">
                      {(service.secondaryOriginalPrice || service.originalPrice || 0) > (service.secondaryOfferPrice || service.offerPrice || 0) && (
                        <div className="text-xl text-muted-foreground line-through">
                          ₹{(service.secondaryOriginalPrice || service.originalPrice || 0).toLocaleString()}
                        </div>
                      )}
                      <div className="text-2xl font-bold text-primary">
                        ₹{(service.secondaryOfferPrice || service.offerPrice || 0).toLocaleString()}
                      </div>
                    </div>
                    {(service.secondaryOriginalPrice || service.originalPrice || 0) > (service.secondaryOfferPrice || service.offerPrice || 0) && (
                      <div className="text-sm font-semibold text-green-600 mb-1">
                        Save {Math.round((((service.secondaryOriginalPrice || service.originalPrice || 0) - (service.secondaryOfferPrice || service.offerPrice || 0)) / (service.secondaryOriginalPrice || service.originalPrice || 1)) * 100)}%
                      </div>
                    )}
                    <div className="text-sm text-muted-foreground">
                      for {service.secondaryDuration || service.duration || "-"}
                    </div>
                  </div>

                  {/* Book Consultation Button */}
                  <Button
                    variant="default"
                    size="lg"
                    className="w-full mb-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => handleSelectService(service)}
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Book Consultation
                  </Button>

                  {/* Special Offer */}
                  {service.hasOffer && (
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-3 mb-4 text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Star className="w-4 h-4 text-amber-600 fill-current" />
                        <span className="text-sm font-semibold text-amber-800">
                          {service.offerHeading || "Special Offer Available"}
                        </span>
                      </div>
                      <p className="text-xs text-amber-700 leading-relaxed">
                        {service.offerDetails || "Limited time offers and custom packages available. Book a consultation to learn about exclusive deals tailored to your needs."}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Service Details Modal */}
      {showDetailsModal && detailsService && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-background p-6 rounded-xl w-[90%] max-w-2xl max-h-[80vh] overflow-y-auto">
            {/* Service Header - Compact */}
            <div className="text-center mb-4 pb-3 border-b border-border">
              <h3 className="text-3xl font-bold">{detailsService.name || "Personal Training Service"}</h3>
            </div>

            {/* Description */}
            <p className="text-center text-foreground text-sm font-medium mb-4 bg-secondary/50 rounded-lg py-2 px-3">
              {detailsService.description}
            </p>

            {/* Service Details */}
            <div className="mb-4 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Duration</div>
                  <div className="font-semibold text-foreground">{detailsService.duration || "3 Months"}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Price</div>
                  <div className="font-semibold text-primary">
                    {(detailsService.originalPrice || 0) > (detailsService.offerPrice || 10000) && (
                      <span className="text-muted-foreground line-through mr-2 text-sm">
                        ₹{(detailsService.originalPrice || 12000).toLocaleString()}
                      </span>
                    )}
                    ₹{(detailsService.offerPrice || 10000).toLocaleString()}
                    {(detailsService.originalPrice || 0) > (detailsService.offerPrice || 10000) && (
                      <div className="text-xs font-semibold text-green-600 mt-1">
                        Save {Math.round(((detailsService.originalPrice - detailsService.offerPrice) / detailsService.originalPrice) * 100)}%
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {detailsService.hasOffer && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <h4 className="font-semibold text-amber-800 mb-2">{detailsService.offerHeading || "Special Offer"}</h4>
                  <p className="text-sm text-amber-700">{detailsService.offerDetails || "Limited time offer available. Contact us for details."}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 mt-4 sm:flex-row">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setShowDetailsModal(false);
                  setDetailsService(null);
                }}
              >
                Close
              </Button>
              <Button
                variant="default"
                className="w-full"
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedService(detailsService);
                  setDetailsService(null);
                  setShowModal(true);
                }}
              >
                Book Consultation
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Consultation Booking Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border p-6 rounded-xl w-[95%] max-w-4xl max-h-[90vh] overflow-y-auto relative">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary/50 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>

            {/* Selected Service Header */}
            <div className="text-center mb-6 pb-4 border-b border-border">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-3">
                <Star className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                {selectedService ? selectedService.name : "Personal Training Consultation"}
              </h3>
              <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
                {selectedService 
                  ? selectedService.description 
                  : "Book a consultation to discuss your fitness goals and get personalized training recommendations"
                }
              </p>

              {/* Consultation Fee */}
              <div className="mt-6 max-w-xs mx-auto">
                <div className="p-4 bg-secondary/50 border border-border rounded-lg text-center">
                  <div className="text-sm text-muted-foreground mb-2">Consultation Fee</div>
                  <div className="text-2xl font-bold text-foreground">₹500</div>
                  <div className="text-xs text-muted-foreground">One-time payment to book consultation</div>
                </div>
              </div>
            </div>

            <h4 className="text-xl font-semibold text-center mb-6 text-foreground">Book Your Consultation</h4>

            {/* Form Fields */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Basic Information */}
              <div className="space-y-4">
                <h5 className="font-medium text-foreground border-b pb-2">Basic Information</h5>
                
                <div>
                  <Label htmlFor="fullName" className="text-sm font-medium text-foreground">Full Name *</Label>
                  <input
                    id="fullName"
                    className={`w-full px-3 py-2 bg-background border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 mt-1 ${getFieldBorderClass("name", customerName)}`}
                    placeholder="Enter your full name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    onBlur={() => handleFieldBlur("name")}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">Email Address *</Label>
                  <input
                    id="email"
                    type="email"
                    className={`w-full px-3 py-2 bg-background border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 mt-1 ${getFieldBorderClass("email", customerEmail)}`}
                    placeholder="Enter your email address"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    onBlur={() => handleFieldBlur("email")}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-foreground">WhatsApp Number *</Label>
                  <input
                    id="phone"
                    type="tel"
                    className={`w-full px-3 py-2 bg-background border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 mt-1 ${getFieldBorderClass("phone", customerPhone)}`}
                    placeholder="Enter 10-digit mobile number"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value.slice(0, 10).replace(/\D/g, ""))}
                    onBlur={() => handleFieldBlur("phone")}
                    maxLength={10}
                    pattern="[0-9]{10}"
                    title="Please enter a valid 10-digit mobile number"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="age" className="text-sm font-medium text-foreground">Age *</Label>
                  <input
                    id="age"
                    type="number"
                    className={`w-full px-3 py-2 bg-background border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 mt-1 ${getFieldBorderClass("age", age)}`}
                    placeholder="Enter your age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    onBlur={() => handleFieldBlur("age")}
                    min="1"
                    max="120"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="gender" className="text-sm font-medium text-foreground">Gender *</Label>
                  <select
                    id="gender"
                    className={`w-full px-3 py-2 bg-background border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 mt-1 ${getFieldBorderClass("gender", gender)}`}
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    onBlur={() => handleFieldBlur("gender")}
                    required
                  >
                    <option value="">Select your gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Physical Information */}
              <div className="space-y-4">
                <h5 className="font-medium text-foreground border-b pb-2">Physical Information</h5>

                <div>
                  <Label htmlFor="weight" className="text-sm font-medium text-foreground">Current Weight (kg) *</Label>
                  <input
                    id="weight"
                    type="number"
                    className={`w-full px-3 py-2 bg-background border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 mt-1 ${getFieldBorderClass("weight", weight)}`}
                    placeholder="Enter your current weight"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    onBlur={() => handleFieldBlur("weight")}
                    min="1"
                    max="300"
                    step="0.1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="height" className="text-sm font-medium text-foreground">Height *</Label>
                  <input
                    id="height"
                    className={`w-full px-3 py-2 bg-background border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 mt-1 ${getFieldBorderClass("height", height)}`}
                    placeholder="e.g., 5'8 or 172cm"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    onBlur={() => handleFieldBlur("height")}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="instagram" className="text-sm font-medium text-foreground">Instagram ID</Label>
                  <input
                    id="instagram"
                    className="w-full px-3 py-2 bg-background border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 mt-1"
                    placeholder="Enter your Instagram ID (optional)"
                    value={instagramId}
                    onChange={(e) => setInstagramId(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Health & Fitness Information */}
            <div className="mt-6 space-y-4">
              <h5 className="font-medium text-foreground border-b pb-2">Health & Fitness Information</h5>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="healthConcerns" className="text-sm font-medium text-foreground">Health Concerns *</Label>
                  <textarea
                    id="healthConcerns"
                    className={`w-full px-3 py-2 bg-background border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none mt-1 ${getFieldBorderClass("healthConcerns", healthConcerns)}`}
                    placeholder="e.g., diabetes, hypertension, thyroid issues"
                    value={healthConcerns}
                    onChange={(e) => setHealthConcerns(e.target.value)}
                    onBlur={() => handleFieldBlur("healthConcerns")}
                    rows={2}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="injuries" className="text-sm font-medium text-foreground">Current Injuries or Pain Areas *</Label>
                  <textarea
                    id="injuries"
                    className={`w-full px-3 py-2 bg-background border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none mt-1 ${getFieldBorderClass("injuries", injuries)}`}
                    placeholder="e.g., knee pain, back issues"
                    value={injuries}
                    onChange={(e) => setInjuries(e.target.value)}
                    onBlur={() => handleFieldBlur("injuries")}
                    rows={2}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="foodAllergies" className="text-sm font-medium text-foreground">Food Allergies or Restrictions *</Label>
                  <textarea
                    id="foodAllergies"
                    className={`w-full px-3 py-2 bg-background border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none mt-1 ${getFieldBorderClass("foodAllergies", foodAllergies)}`}
                    placeholder="e.g., nuts, dairy, gluten"
                    value={foodAllergies}
                    onChange={(e) => setFoodAllergies(e.target.value)}
                    onBlur={() => handleFieldBlur("foodAllergies")}
                    rows={2}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="dietExperience" className="text-sm font-medium text-foreground">Diet Experience *</Label>
                  <textarea
                    id="dietExperience"
                    className={`w-full px-3 py-2 bg-background border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none mt-1 ${getFieldBorderClass("dietExperience", dietExperience)}`}
                    placeholder="e.g., vegetarian, keto, intermittent fasting"
                    value={dietExperience}
                    onChange={(e) => setDietExperience(e.target.value)}
                    onBlur={() => handleFieldBlur("dietExperience")}
                    rows={2}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="fitnessGoals" className="text-sm font-medium text-foreground">Fitness Goals *</Label>
                <textarea
                  id="fitnessGoals"
                  className={`w-full px-3 py-2 bg-background border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none mt-1 ${getFieldBorderClass("fitnessGoals", fitnessGoals)}`}
                  placeholder="e.g., weight loss, muscle gain, improve endurance, sports performance"
                  value={fitnessGoals}
                  onChange={(e) => setFitnessGoals(e.target.value)}
                  onBlur={() => handleFieldBlur("fitnessGoals")}
                  rows={2}
                  required
                />
              </div>
            </div>

            {/* Trainer Selection */}
            <div className="mt-6">
              <h5 className="font-medium text-foreground border-b pb-2 mb-4">Book consultation with</h5>
              <div className="grid md:grid-cols-2 gap-4">
                <label className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedTrainer === "anusha" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
                  <input
                    type="radio"
                    name="trainer"
                    value="anusha"
                    checked={selectedTrainer === "anusha"}
                    onChange={(e) => handleTrainerChange(e.target.value)}
                    className="sr-only"
                    required
                  />
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <h6 className="font-semibold text-foreground">Anusha V</h6>
                    <p className="text-sm text-muted-foreground">Certified Personal Trainer</p>
                    <p className="text-xs text-muted-foreground mt-1">Specializes in weight loss & strength training</p>
                  </div>
                </label>

                <label className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedTrainer === "hithesh" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
                  <input
                    type="radio"
                    name="trainer"
                    value="hithesh"
                    checked={selectedTrainer === "hithesh"}
                    onChange={(e) => handleTrainerChange(e.target.value)}
                    className="sr-only"
                    required
                  />
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <h6 className="font-semibold text-foreground">Hithesh</h6>
                    <p className="text-sm text-muted-foreground">Certified Personal Trainer</p>
                    <p className="text-xs text-muted-foreground mt-1">Specializes in muscle building & sports performance</p>
                  </div>
                </label>
              </div>
              {isFieldTouched("trainer") && !selectedTrainer && (
                <p className="text-red-500 text-sm mt-2">Please select a trainer</p>
              )}
            </div>

            {/* Additional Message */}
            <div className="mt-6">
              <Label htmlFor="additionalMessage" className="text-sm font-medium text-foreground">Additional Message</Label>
              <textarea
                id="additionalMessage"
                className="w-full px-3 py-2 bg-background border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none mt-1"
                placeholder="Any additional information or questions (optional)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={2}
              />
            </div>

            <div className="flex flex-col gap-3 mt-6 sm:flex-row">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowModal(false)}
                disabled={paymentLoading}
              >
                Cancel
              </Button>
              <Button
                className="w-full bg-primary hover:bg-primary/90"
                onClick={handleBookConsultation}
                disabled={!isFormValid() || paymentLoading}
              >
                {paymentLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Pay ₹500 & Book Consultation
                  </>
                )}
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-3">
              Payment is required to confirm your consultation slot
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default PersonalTraining;