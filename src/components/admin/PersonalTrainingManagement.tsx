/**
 * Admin Personal Training Management Component
 * Allows administrators to:
 * - View all personal training services
 * - Create new services
 * - Edit existing services
 * - Delete services
 * - Manage features for each service
 */

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import { personalTrainingService } from "@/services/personalTrainingService";
import { PersonalTraining, CreatePersonalTrainingInput } from "@/types/personalTraining";
import { Plus, Trash2, Edit2, Save, X, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export const PersonalTrainingManagement = () => {
  // State for services
  const [services, setServices] = useState<PersonalTraining[]>([]);
  const [loading, setLoading] = useState(true);

  // State for form
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // State for tracking touched fields
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // State for delete confirmation dialog
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<{ id: string; name: string } | null>(null);

  // Form data state
  const [formData, setFormData] = useState<Partial<CreatePersonalTrainingInput>>({
    name: "",
    duration: "",
    originalPrice: 0,
    offerPrice: 0,
    secondaryName: "Premium Package",
    secondaryDuration: "",
    secondaryOriginalPrice: 0,
    secondaryOfferPrice: 0,
    displayOrder: 0,
    description: "",
    hasOffer: false,
    offerHeading: "",
    offerDetails: "",
    isActive: true,
  });

  // Load services when component mounts
  useEffect(() => {
    loadServices();
  }, []);

  // Validate required fields
  const isFormValid = useMemo(() => {
    return !!
      formData.name &&
      formData.duration &&
      formData.originalPrice &&
      formData.originalPrice > 0 &&
      formData.offerPrice &&
      formData.offerPrice > 0 &&
      formData.secondaryDuration &&
      formData.secondaryOriginalPrice &&
      formData.secondaryOriginalPrice > 0 &&
      formData.secondaryOfferPrice &&
      formData.secondaryOfferPrice > 0 &&
      formData.description &&
      formData.displayOrder !== undefined &&
      formData.displayOrder >= 0;
  }, [formData]);

  /**
   * Load all services from the service
   */
  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await personalTrainingService.getAllServices();
      setServices(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load services";
      toast.error(errorMessage);
      console.error("Error loading services:", error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reset form to initial state
   */
  const resetForm = () => {
    setFormData({
      name: "",
      duration: "",
      originalPrice: 0,
      offerPrice: 0,
      secondaryName: "Premium Package",
      secondaryDuration: "",
      secondaryOriginalPrice: 0,
      secondaryOfferPrice: 0,
      displayOrder: services.length + 1,
      description: "",
      hasOffer: false,
      offerHeading: "",
      offerDetails: "",
      isActive: true,
    });

    setTouched({});
    setEditingId(null);
    setShowForm(false);
  };

  /**
   * Handle edit button click
   */
  const handleEdit = (service: PersonalTraining) => {
    setFormData({
      name: service.name,
      duration: service.duration,
      originalPrice: service.originalPrice,
      offerPrice: service.offerPrice,
      secondaryName: service.secondaryName || "Premium Package",
      secondaryDuration: service.secondaryDuration || "",
      secondaryOriginalPrice: service.secondaryOriginalPrice || 0,
      secondaryOfferPrice: service.secondaryOfferPrice || 0,
      displayOrder: service.displayOrder,
      description: service.description,
      hasOffer: service.hasOffer,
      offerHeading: service.offerHeading || "",
      offerDetails: service.offerDetails || "",
      isActive: service.isActive,
    });
    setEditingId(service.id);
    setShowForm(true);
  };

  /**
   * Handle delete button click
   */
  const handleDelete = (service: PersonalTraining) => {
    setServiceToDelete({ id: service.id, name: service.name });
    setShowDeleteDialog(true);
  };

  /**
   * Confirm delete action
   */
  const confirmDelete = async () => {
    if (!serviceToDelete) return;

    try {
      await personalTrainingService.deleteService(serviceToDelete.id);
      toast.success("Personal training service deleted successfully");
      loadServices();
    } catch (error) {
      toast.error("Failed to delete service");
      console.error("Error deleting service:", error);
    } finally {
      setShowDeleteDialog(false);
      setServiceToDelete(null);
    }
  };

  /**
   * Toggle service active status
   */
  const toggleStatus = async (service: PersonalTraining) => {
    try {
      await personalTrainingService.toggleServiceStatus(service.id);
      toast.success(`Service ${service.isActive ? 'deactivated' : 'activated'} successfully`);
      loadServices();
    } catch (error) {
      toast.error("Failed to toggle service status");
      console.error("Error toggling status:", error);
    }
  };

  /**
   * Save the service (create or update)
   */
  const handleSubmit = async () => {
    try {
      if (editingId) {
        // Update existing service
        await personalTrainingService.updateService(editingId, formData);
        toast.success("Personal training service updated successfully");
      } else {
        // Create new service
        await personalTrainingService.createService(formData as CreatePersonalTrainingInput);
        toast.success("Personal training service created successfully");
      }

      resetForm();
      loadServices();
    } catch (error) {
      const message = editingId ? "Failed to update service" : "Failed to create service";
      toast.error(message);
      console.error("Error saving service:", error);
    }
  };

  if (loading) {
    return (
      <div>
        {/* Fixed Header */}
        <div className="fixed top-[73px] left-0 right-0 z-20 flex flex-col items-start justify-between gap-4 border-b border-slate-200/5 bg-slate-900/50 px-4 py-4 backdrop-blur md:top-[73px] md:left-64 md:flex-row md:items-center md:px-6">
          <div>
            <h1 className="text-3xl font-bold">Personal Training Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage personal training services and their features.
            </p>
          </div>
          <Button disabled className="gap-2 w-full md:w-auto" size="lg">
            <Plus className="w-4 h-4" />
            Add New Service
          </Button>
        </div>

        {/* Skeleton Loaders */}
        <div className="pt-[240px] pb-5 px-4 md:px-6 md:pt-[130px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card
              key={index}
              className="border-slate-200/10 bg-slate-900/40 p-4 h-full flex flex-col"
            >
              <div className="space-y-2.5 flex-1">
                {/* Header Skeleton */}
                <div className="flex items-start justify-between">
                  <div className="flex-1 flex items-center gap-2 flex-wrap">
                    <Skeleton className="h-7 w-24 bg-slate-800/60" />
                    <Skeleton className="h-5 w-20 bg-slate-800/60" />
                  </div>
                  <div className="flex gap-1 ml-2">
                    <Skeleton className="h-8 w-8 rounded bg-slate-800/60" />
                    <Skeleton className="h-8 w-8 rounded bg-slate-800/60" />
                  </div>
                </div>

                {/* Details Skeleton */}
                <div className="space-y-1 text-sm border-t border-border pt-2.5">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-16 bg-slate-800/60" />
                    <Skeleton className="h-4 w-12 bg-slate-800/60" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20 bg-slate-800/60" />
                    <Skeleton className="h-4 w-12 bg-slate-800/60" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-16 bg-slate-800/60" />
                    <Skeleton className="h-4 w-12 bg-slate-800/60" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24 bg-slate-800/60" />
                    <Skeleton className="h-4 w-6 bg-slate-800/60" />
                  </div>
                </div>

                {/* Toggle Skeleton */}
                <div className="border-t border-border pt-2.5">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-20 bg-slate-800/60" />
                    <Skeleton className="h-6 w-12 rounded-full bg-slate-800/60" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Fixed Header */}
      <div className="fixed top-[73px] left-0 right-0 z-20 flex flex-col items-start justify-between gap-4 border-b border-slate-200/5 bg-slate-900/50 px-4 py-4 backdrop-blur md:top-[73px] md:left-64 md:flex-row md:items-center md:px-6">
        <div>
          <h1 className="text-3xl font-bold">Personal Training Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage personal training services and their features.
          </p>
        </div>
        <Button onClick={() => {
          resetForm();
          setFormData(prev => ({ ...prev, displayOrder: services.length + 1 }));
          setShowForm(true);
        }} className="gap-2 w-full md:w-auto" size="lg">
          <Plus className="w-4 h-4" />
          Add New Service
        </Button>
      </div>

      {/* Content with padding to account for fixed header */}
      <div className="pt-[240px] pb-5 px-4 md:px-6 md:pt-[130px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
        {services.map((service) => (
          <Card
            key={service.id}
            className="border-slate-200/10 bg-slate-900/40 p-4 transition-shadow hover:shadow-lg h-full flex flex-col"
          >
            <div className="space-y-2.5 flex-1">
              {/* Service Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1 flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg font-bold text-foreground">
                    {service.name}
                  </h3>
                  {!service.isActive && (
                    <span className="inline-block bg-destructive/20 text-destructive px-2 py-0.5 rounded text-xs font-semibold">
                      INACTIVE
                    </span>
                  )}
                </div>
                {/* Action Buttons */}
                <div className="flex gap-1 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(service)}
                    className="text-primary hover:bg-primary/30 h-8 w-8 p-0"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(service)}
                    className="text-destructive hover:bg-destructive/30 h-8 w-8 p-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Service Details */}
              <div className="space-y-1 text-sm border-t border-border pt-2.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-semibold">{service.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Original Price:</span>
                  <span className="font-semibold">₹{service.originalPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Offer Price:</span>
                  <span className="font-semibold">₹{service.offerPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">2nd Card Offer:</span>
                  <span className="font-semibold">₹{service.secondaryOfferPrice || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Display Order:</span>
                  <span className="font-semibold">{service.displayOrder}</span>
                </div>
                {service.hasOffer && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Offer:</span>
                    <span className="font-semibold text-primary">Active</span>
                  </div>
                )}
              </div>

              {/* Toggle Active Status */}
              <div className="border-t border-border pt-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Active Status:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {service.isActive ? "Active" : "Inactive"}
                    </span>
                    <Switch
                      checked={service.isActive}
                      onCheckedChange={() => toggleStatus(service)}
                    />
                  </div>
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
                {editingId ? "Edit Personal Training Service" : "Create New Personal Training Service"}
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
                  {/* Name */}
                  <div>
                    <Label htmlFor="name" className="text-sm">
                      Name *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      onBlur={() => setTouched({ ...touched, name: true })}
                      placeholder="e.g., 1-on-1 Personal Training"
                      className={`mt-1 ${touched.name && !formData.name ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                    />
                  </div>

                  {/* Duration */}
                  <div>
                    <Label htmlFor="duration" className="text-sm">
                      Duration *
                    </Label>
                    <Input
                      id="duration"
                      value={formData.duration || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, duration: e.target.value })
                      }
                      onBlur={() => setTouched({ ...touched, duration: true })}
                      placeholder="e.g., 1 Month, 3 Months"
                      className={`mt-1 ${touched.duration && !formData.duration ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                    />
                  </div>

                  {/* Original Price */}
                  <div>
                    <Label htmlFor="originalPrice" className="text-sm">
                      Original Price (₹) *
                    </Label>
                    <Input
                      id="originalPrice"
                      type="number"
                      value={formData.originalPrice || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, originalPrice: parseFloat(e.target.value) || 0 })
                      }
                      onBlur={() => setTouched({ ...touched, originalPrice: true })}
                      placeholder="e.g., 5000"
                      className={`mt-1 ${touched.originalPrice && (!formData.originalPrice || formData.originalPrice <= 0) ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                    />
                  </div>

                  {/* Offer Price */}
                  <div>
                    <Label htmlFor="offerPrice" className="text-sm">
                      Offer Price (₹) *
                    </Label>
                    <Input
                      id="offerPrice"
                      type="number"
                      value={formData.offerPrice || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, offerPrice: parseFloat(e.target.value) || 0 })
                      }
                      onBlur={() => setTouched({ ...touched, offerPrice: true })}
                      placeholder="e.g., 4000"
                      className={`mt-1 ${touched.offerPrice && (!formData.offerPrice || formData.offerPrice <= 0) ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                    />
                  </div>

                  {/* Secondary Package Name */}
                  <div>
                    <Label htmlFor="secondaryName" className="text-sm">
                      Secondary Package Name
                    </Label>
                    <Input
                      id="secondaryName"
                      value={formData.secondaryName || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, secondaryName: e.target.value })
                      }
                      placeholder="e.g., Premium Package"
                      className="mt-1"
                    />
                  </div>

                  {/* Secondary Duration */}
                  <div>
                    <Label htmlFor="secondaryDuration" className="text-sm">
                      Secondary Package Duration *
                    </Label>
                    <Input
                      id="secondaryDuration"
                      value={formData.secondaryDuration || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, secondaryDuration: e.target.value })
                      }
                      onBlur={() => setTouched({ ...touched, secondaryDuration: true })}
                      placeholder="e.g., 6 Months"
                      className={`mt-1 ${touched.secondaryDuration && !formData.secondaryDuration ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                    />
                  </div>

                  {/* Secondary Original Price */}
                  <div>
                    <Label htmlFor="secondaryOriginalPrice" className="text-sm">
                      Secondary Package Original Price (₹) *
                    </Label>
                    <Input
                      id="secondaryOriginalPrice"
                      type="number"
                      value={formData.secondaryOriginalPrice || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, secondaryOriginalPrice: parseFloat(e.target.value) || 0 })
                      }
                      onBlur={() => setTouched({ ...touched, secondaryOriginalPrice: true })}
                      placeholder="e.g., 19000"
                      className={`mt-1 ${touched.secondaryOriginalPrice && (!formData.secondaryOriginalPrice || formData.secondaryOriginalPrice <= 0) ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                    />
                  </div>

                  {/* Secondary Offer Price */}
                  <div>
                    <Label htmlFor="secondaryOfferPrice" className="text-sm">
                      Secondary Package Offer Price (₹) *
                    </Label>
                    <Input
                      id="secondaryOfferPrice"
                      type="number"
                      value={formData.secondaryOfferPrice || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, secondaryOfferPrice: parseFloat(e.target.value) || 0 })
                      }
                      onBlur={() => setTouched({ ...touched, secondaryOfferPrice: true })}
                      placeholder="e.g., 15000"
                      className={`mt-1 ${touched.secondaryOfferPrice && (!formData.secondaryOfferPrice || formData.secondaryOfferPrice <= 0) ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                    />
                  </div>

                  {/* Display Order */}
                  <div>
                    <Label htmlFor="displayOrder" className="text-sm">
                      Display Order *
                    </Label>
                    <Input
                      id="displayOrder"
                      type="number"
                      value={formData.displayOrder || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          displayOrder: parseInt(e.target.value) || 1,
                        })
                      }
                      onBlur={() => setTouched({ ...touched, displayOrder: true })}
                      placeholder="1"
                      className={`mt-1 ${touched.displayOrder && (formData.displayOrder === undefined || formData.displayOrder < 0) ? 'border-destructive focus-visible:ring-destructive' : ''}`}
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

              {/* ===== DESCRIPTION SECTION ===== */}
              <div className={`space-y-3 border-b pb-4 ${touched.description && !formData.description ? 'border-destructive' : 'border-border'}`}>
                <Label htmlFor="description" className="text-sm font-semibold">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  onBlur={() => setTouched({ ...touched, description: true })}
                  placeholder="Enter service description..."
                  className={`${touched.description && !formData.description ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                  rows={3}
                />
              </div>

              {/* ===== OFFER SECTION ===== */}
              <div className="space-y-3 border-b border-border pb-4">
                <h3 className="font-semibold text-foreground">Offer Settings</h3>
                <div className="space-y-4">
                  {/* Has Offer Toggle */}
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={formData.hasOffer || false}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, hasOffer: checked })
                      }
                    />
                    <Label className="text-sm">Enable Offer</Label>
                  </div>

                  {/* Offer Details (shown only when hasOffer is true) */}
                  {formData.hasOffer && (
                    <div className="grid grid-cols-1 gap-4 pl-6 border-l-2 border-primary/20">
                      <div>
                        <Label htmlFor="offerHeading" className="text-sm">
                          Offer Heading
                        </Label>
                        <Input
                          id="offerHeading"
                          value={formData.offerHeading || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, offerHeading: e.target.value })
                          }
                          placeholder="e.g., Limited Time Offer"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="offerDetails" className="text-sm">
                          Offer Details
                        </Label>
                        <Textarea
                          id="offerDetails"
                          value={formData.offerDetails || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, offerDetails: e.target.value })
                          }
                          placeholder="e.g., Get 20% off on first month"
                          className="mt-1"
                          rows={2}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ===== FORM ACTIONS ===== */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <Button
                          onClick={handleSubmit}
                          disabled={!isFormValid}
                        >
                          <Save className="w-4 h-4 mr-2" />
                          {editingId ? "Update" : "Create"} Service
                        </Button>
                      </span>
                    </TooltipTrigger>
                    {!isFormValid && (
                      <TooltipContent className="bg-black text-white">
                        <p>Please fill all required fields: Name, Duration, Original Price, Offer Price, Secondary Package Duration, Secondary Package Original Price, Secondary Package Offer Price, Description, and Display Order</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-slate-800 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Delete Service
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Are you sure you want to delete "{serviceToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};