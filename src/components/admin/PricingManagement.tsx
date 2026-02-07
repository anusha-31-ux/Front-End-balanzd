/**
 * Admin Pricing Management Component
 * Allows administrators to:
 * - View all pricing plans
 * - Create new plans
 * - Edit existing plans
 * - Delete plans
 * - Manage features for each plan
 */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { pricingService } from "@/services/pricingService";
import { PricingPlan, CreatePricingPlanInput } from "@/types/pricing";
import { Plus, Trash2, Edit2, Save, X, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export const PricingManagement = () => {
  // State for plans
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);

  // State for form
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [featureInput, setFeatureInput] = useState("");

  // State for delete confirmation dialog
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<{ id: string; name: string } | null>(null);

  // Form data state
  const [formData, setFormData] = useState<Partial<CreatePricingPlanInput>>({
    duration: "",
    durationMonths: 1,
    badge: "",
    showPrize: false,
    prizeText: "",
    prizeNote: "",
    actualPrice: 0,
    offerPrice: 0,
    offerText: "",
    offerValidity: "",
    features: [],
    tagline: "",
    displayOrder: 0,
    isActive: true,
  });

  // Load plans when component mounts
  useEffect(() => {
    loadPlans();
  }, []);

  /**
   * Load all plans from the service
   */
  const loadPlans = async () => {
    try {
      setLoading(true);
      const data = await pricingService.getAllPlans();
      setPlans(data);
    } catch (error) {
      toast.error("Failed to load plans");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Open form to create a new plan
   */
  const handleAddPlan = () => {
    setFormData({
      duration: "",
      durationMonths: 1,
      badge: "",
      showPrize: false,
      prizeText: "",
      prizeNote: "",
      actualPrice: 0,
      offerPrice: 0,
      offerText: "",
      offerValidity: "",
      features: [],
      tagline: "",
      displayOrder: plans.length + 1,
      isActive: true,
    });
    setEditingId(null);
    setShowForm(true);
  };

  /**
   * Open form to edit an existing plan
   */
  const handleEditPlan = (plan: PricingPlan) => {
    setFormData(plan);
    setEditingId(plan.id);
    setShowForm(true);
  };

  /**
   * Add a feature to the current plan being edited
   */
  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFormData({
        ...formData,
        features: [...(formData.features || []), featureInput],
      });
      setFeatureInput("");
    }
  };

  /**
   * Remove a feature from the plan
   */
  const handleRemoveFeature = (index: number) => {
    const newFeatures = (formData.features || []).filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  /**
   * Save the plan (create or update)
   */
  const handleSavePlan = async () => {
    try {
      // Validate required fields
      if (!formData.duration || !formData.tagline) {
        toast.error("Please fill all required fields");
        return;
      }

      const submitData = {
        duration: formData.duration,
        durationMonths: formData.durationMonths || 1,
        badge: formData.badge || null,
        showPrize: formData.showPrize || false,
        prizeText: formData.prizeText || "",
        prizeNote: formData.prizeNote || "",
        actualPrice: formData.actualPrice || 0,
        offerPrice: formData.offerPrice || 0,
        offerText: formData.offerText || "",
        offerValidity: formData.offerValidity || "",
        features: formData.features || [],
        tagline: formData.tagline,
        displayOrder: formData.displayOrder || plans.length + 1,
        isActive: formData.isActive !== false,
      };

      if (editingId) {
        // Update existing plan
        await pricingService.updatePlan({ id: editingId, ...submitData });
        toast.success("Plan updated successfully");
      } else {
        // Create new plan
        await pricingService.createPlan(submitData);
        toast.success("Plan created successfully");
      }

      setShowForm(false);
      loadPlans();
    } catch (error) {
      toast.error("Failed to save plan");
      console.error(error);
    }
  };

  /**
   * Open delete confirmation dialog
   */
  const handleDeletePlanClick = (id: string, duration: string) => {
    setPlanToDelete({ id, name: duration });
    setShowDeleteDialog(true);
  };

  /**
   * Delete a plan after confirmation
   */
  const handleDeletePlan = async () => {
    if (!planToDelete) return;
    
    try {
      await pricingService.deletePlan(planToDelete.id);
      toast.success("Plan deleted successfully");
      loadPlans();
      setShowDeleteDialog(false);
      setPlanToDelete(null);
    } catch (error) {
      toast.error("Failed to delete plan");
      console.error(error);
    }
  };

  /**
   * Cancel delete operation
   */
  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
    setPlanToDelete(null);
  };

  if (loading) {
    return <div className="text-center">Loading plans...</div>;
  }

  return (
    <div className="space-y-6 bg-background min-h-screen">
      {/* Header with Add Plan Button */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Pricing Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage and update pricing plans for your programs.
          </p>
        </div>
        <Button onClick={handleAddPlan} className="gap-2" size="lg">
          <Plus className="w-4 h-4" />
          Add New Plan
        </Button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className="p-4 hover:shadow-lg transition-shadow">
            <div className="space-y-3">
              {/* Plan Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground">
                    {plan.duration}
                  </h3>
                  {plan.badge && (
                    <span className="inline-block bg-primary/20 text-primary px-2 py-1 rounded text-xs font-semibold mt-1">
                      {plan.badge}
                    </span>
                  )}
                  {!plan.isActive && (
                    <span className="inline-block bg-destructive/20 text-destructive px-2 py-1 rounded text-xs font-semibold mt-1 ml-2">
                      INACTIVE
                    </span>
                  )}
                </div>
                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditPlan(plan)}
                    className="text-primary hover:bg-primary/30"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeletePlanClick(plan.id, plan.duration)}
                    className="text-destructive hover:bg-destructive/30"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Plan Details */}
              <div className="space-y-1 text-sm border-t border-border pt-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price:</span>
                  <span className="font-semibold">₹{plan.offerPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Original:</span>
                  <span className="text-muted-foreground line-through">
                    ₹{plan.actualPrice}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-semibold">{plan.durationMonths}mo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Features:</span>
                  <span className="font-semibold">{plan.features.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Display Order:</span>
                  <span className="font-semibold">{plan.displayOrder}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {editingId ? "Edit Pricing Plan" : "Create New Pricing Plan"}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowForm(false)}
                className="text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-4">
              {/* ===== BASIC INFO SECTION ===== */}
              <div className="space-y-3 border-b border-border pb-4">
                <h3 className="font-semibold text-foreground">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Duration Name */}
                  <div>
                    <Label htmlFor="duration" className="text-sm">
                      Duration Name *
                    </Label>
                    <Input
                      id="duration"
                      value={formData.duration || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, duration: e.target.value })
                      }
                      placeholder="e.g., 1 Month, 6 Months"
                      className="mt-1"
                    />
                  </div>

                  {/* Duration in Months */}
                  <div>
                    <Label htmlFor="durationMonths" className="text-sm">
                      Duration (Months) *
                    </Label>
                    <Input
                      id="durationMonths"
                      type="number"
                      value={formData.durationMonths || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          durationMonths: parseInt(e.target.value),
                        })
                      }
                      placeholder="1"
                      className="mt-1"
                    />
                  </div>

                  {/* Badge */}
                  <div>
                    <Label htmlFor="badge" className="text-sm">
                      Badge (Optional)
                    </Label>
                    <Input
                      id="badge"
                      value={formData.badge || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, badge: e.target.value })
                      }
                      placeholder="e.g., MOST POPULAR, BEST VALUE"
                      className="mt-1"
                    />
                  </div>

                  {/* Active Status */}
                  <div className="flex items-end gap-3">
                    <div className="flex-1">
                      <Label className="text-sm">Active Status</Label>
                      <div className="flex items-center gap-2 mt-2 p-2 border border-border rounded">
                        <Switch
                          checked={formData.isActive !== false}
                          onCheckedChange={(checked) =>
                            setFormData({ ...formData, isActive: checked })
                          }
                        />
                        <span className="text-sm text-muted-foreground">
                          {formData.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ===== PRIZE SECTION ===== */}
              <div className="space-y-3 border-b border-border pb-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">Prize Information</h3>
                  <Switch
                    checked={formData.showPrize || false}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, showPrize: checked })
                    }
                  />
                </div>

                {formData.showPrize && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-secondary/20 p-4 rounded">
                    <div>
                      <Label htmlFor="prizeText" className="text-sm">
                        Prize Text
                      </Label>
                      <Input
                        id="prizeText"
                        value={formData.prizeText || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, prizeText: e.target.value })
                        }
                        placeholder="e.g., Eligible for ₹3,00,000 Cash Prize"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="prizeNote" className="text-sm">
                        Prize Note
                      </Label>
                      <Input
                        id="prizeNote"
                        value={formData.prizeNote || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, prizeNote: e.target.value })
                        }
                        placeholder="e.g., (*Details in Challenge Policy)"
                        className="mt-1"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* ===== PRICING SECTION ===== */}
              <div className="space-y-3 border-b border-border pb-4">
                <h3 className="font-semibold text-foreground">Pricing</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="actualPrice" className="text-sm">
                      Original Price (₹) *
                    </Label>
                    <Input
                      id="actualPrice"
                      type="number"
                      value={formData.actualPrice || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          actualPrice: parseInt(e.target.value),
                        })
                      }
                      placeholder="699"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="offerPrice" className="text-sm">
                      Offer Price (₹) *
                    </Label>
                    <Input
                      id="offerPrice"
                      type="number"
                      value={formData.offerPrice || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          offerPrice: parseInt(e.target.value),
                        })
                      }
                      placeholder="589"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* ===== OFFER DETAILS SECTION ===== */}
              <div className="space-y-3 border-b border-border pb-4">
                <h3 className="font-semibold text-foreground">Offer Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="offerText" className="text-sm">
                      Offer Text
                    </Label>
                    <Input
                      id="offerText"
                      value={formData.offerText || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, offerText: e.target.value })
                      }
                      placeholder="e.g., January Launch Offer"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="offerValidity" className="text-sm">
                      Offer Validity
                    </Label>
                    <Input
                      id="offerValidity"
                      value={formData.offerValidity || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          offerValidity: e.target.value,
                        })
                      }
                      placeholder="e.g., Valid till 31st January"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* ===== TAGLINE SECTION ===== */}
              <div className="space-y-3 border-b border-border pb-4">
                <Label htmlFor="tagline" className="text-sm font-semibold">
                  Tagline *
                </Label>
                <Textarea
                  id="tagline"
                  value={formData.tagline || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, tagline: e.target.value })
                  }
                  placeholder="e.g., Best plan for long-term lifestyle change and consistency"
                  rows={2}
                />
              </div>

              {/* ===== FEATURES SECTION ===== */}
              <div className="space-y-3 border-b border-border pb-4">
                <h3 className="font-semibold text-foreground">Features</h3>
                <div className="flex gap-2 mb-3">
                  <Input
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    placeholder="Enter a feature (e.g., Daily LIVE Workout Sessions)"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                  />
                  <Button onClick={handleAddFeature} size="sm">
                    Add Feature
                  </Button>
                </div>

                {/* Features List */}
                <div className="space-y-2">
                  {(formData.features || []).length > 0 ? (
                    (formData.features || []).map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-secondary/30 p-3 rounded border border-border"
                      >
                        <span className="text-sm">{feature}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFeature(index)}
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No features added yet. Add some features to get started.
                    </p>
                  )}
                </div>
              </div>

              {/* ===== DISPLAY ORDER SECTION ===== */}
              <div className="space-y-3 border-b border-border pb-4">
                <Label htmlFor="displayOrder" className="text-sm font-semibold">
                  Display Order (1 = First, 2 = Second, etc.)
                </Label>
                <Input
                  id="displayOrder"
                  type="number"
                  value={formData.displayOrder || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      displayOrder: parseInt(e.target.value),
                    })
                  }
                  placeholder="1"
                  className="mt-1"
                />
              </div>

              {/* ===== FORM ACTIONS ===== */}
              <div className="flex gap-2 justify-end pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSavePlan} className="gap-2">
                  <Save className="w-4 h-4" />
                  {editingId ? "Update Plan" : "Create Plan"}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Custom Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Delete Pricing Plan
            </AlertDialogTitle>
            <AlertDialogDescription className="text-left">
              Are you sure you want to delete the <strong>"{planToDelete?.name}"</strong> pricing plan? 
              <br />
              <br />
              This action cannot be undone and will permanently remove all data associated with this plan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2 sm:gap-2">
            <AlertDialogCancel onClick={handleCancelDelete}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePlan}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Plan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PricingManagement;
