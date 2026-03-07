import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
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
import { testimonialService } from "@/services/testimonialService";
import { Testimonial } from "@/types/testimonial";
import { Plus, Trash2, Edit2, Save, X, AlertTriangle, Upload, ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface FormData {
  weight_change: string;
  period_start: string;
  period_end: string;
  description: string;
  photo: File | null;
  photoPreview: string;
}

const emptyForm: FormData = {
  weight_change: "",
  period_start: "",
  period_end: "",
  description: "",
  photo: null,
  photoPreview: "",
};

// Format "2025-03" → "March 2025"
const formatMonthYear = (val: string) => {
  if (!val) return "";
  const [year, month] = val.split("-");
  return new Date(Number(year), Number(month) - 1).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
};

export const TestimonialManagement = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<FormData>(emptyForm);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [toDelete, setToDelete] = useState<{ id: string; weight_change: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      const data = await testimonialService.getAllAdmin();
      setTestimonials(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load testimonials");
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (t: Testimonial) => {
    setFormData({
      weight_change: t.weight_change,
      period_start: t.period_start ? t.period_start.slice(0, 7) : "",
      period_end: t.period_end ? t.period_end.slice(0, 7) : "",
      description: t.description || "",
      photo: null,
      photoPreview: t.photoUrl,
    });
    setEditingId(t._id);
    setShowForm(true);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFormData((prev) => ({
      ...prev,
      photo: file,
      photoPreview: URL.createObjectURL(file),
    }));
  };

  const isFormValid = () => {
    if (!formData.weight_change.trim()) return false;
    if (!editingId && !formData.photo) return false;
    return true;
  };

  const handleSave = async () => {
    if (!isFormValid()) {
      toast.error("Weight change is required" + (!editingId ? " and a photo must be uploaded" : ""));
      return;
    }
    try {
      setSaving(true);
      const payload = {
        weight_change: formData.weight_change,
        period_start: formData.period_start || undefined,
        period_end: formData.period_end || undefined,
        description: formData.description || undefined,
        ...(formData.photo && { photo: formData.photo }),
      };

      if (editingId) {
        await testimonialService.update(editingId, payload);
        toast.success("Testimonial updated successfully");
      } else {
        await testimonialService.create({ ...payload, photo: formData.photo! });
        toast.success("Testimonial created successfully");
      }
      setShowForm(false);
      loadTestimonials();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save testimonial");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await testimonialService.toggleVisibility(id);
      toast.success("Visibility updated");
      loadTestimonials();
    } catch {
      toast.error("Failed to update visibility");
    }
  };

  const handleDeleteClick = (t: Testimonial) => {
    setToDelete({ id: t._id, weight_change: t.weight_change });
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!toDelete) return;
    try {
      await testimonialService.delete(toDelete.id);
      toast.success("Testimonial deleted");
      loadTestimonials();
    } catch {
      toast.error("Failed to delete testimonial");
    } finally {
      setShowDeleteDialog(false);
      setToDelete(null);
    }
  };

  const SkeletonCard = () => (
    <Card className="border-slate-200/10 bg-slate-900/40 p-4 h-full flex flex-col">
      <Skeleton className="h-48 w-full rounded-lg bg-slate-800/60 mb-3" />
      <Skeleton className="h-5 w-32 bg-slate-800/60 mb-2" />
      <Skeleton className="h-4 w-24 bg-slate-800/60 mb-2" />
      <Skeleton className="h-4 w-full bg-slate-800/60 mb-1" />
      <Skeleton className="h-4 w-3/4 bg-slate-800/60 mb-3" />
      <div className="mt-auto border-t border-border pt-2.5 flex justify-between">
        <Skeleton className="h-4 w-20 bg-slate-800/60" />
        <Skeleton className="h-6 w-12 rounded-full bg-slate-800/60" />
      </div>
    </Card>
  );

  return (
    <div>
      {/* Fixed Header */}
      <div className="fixed top-[73px] left-0 right-0 z-20 flex flex-col items-start justify-between gap-4 border-b border-slate-200/5 bg-slate-900/50 px-4 py-4 backdrop-blur md:top-[73px] md:left-64 md:flex-row md:items-center md:px-6">
        <div>
          <h1 className="text-3xl font-bold">Testimonial Management</h1>
          <p className="text-muted-foreground mt-1">Manage client transformation testimonials.</p>
        </div>
        <Button onClick={handleAdd} disabled={loading} className="gap-2 w-full md:w-auto" size="lg">
          <Plus className="w-4 h-4" />
          Add New Testimonial
        </Button>
      </div>

      {/* Grid */}
      <div className="pt-[240px] pb-5 px-4 md:px-6 md:pt-[130px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : testimonials.length === 0
          ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-muted-foreground">
              <ImageIcon className="w-12 h-12 mb-4 opacity-30" />
              <p>No testimonials yet. Add your first one!</p>
            </div>
          )
          : testimonials.map((t) => (
            <Card
              key={t._id}
              className="border-slate-200/10 bg-slate-900/40 p-4 transition-shadow hover:shadow-lg h-full flex flex-col"
            >
              {/* Photo */}
              <div className="relative mb-3 rounded-lg overflow-hidden bg-slate-800">
                <img src={t.photoUrl} alt={t.weight_change} className="w-full h-48 object-cover" />
                {!t.isActive && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-xs font-semibold bg-destructive/80 text-white px-2 py-1 rounded">
                      HIDDEN
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <p className="text-base font-bold text-primary">{t.weight_change}</p>
                  {(t.period_start || t.period_end) && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {t.period_start ? formatMonthYear(t.period_start.slice(0, 7)) : ""}
                      {t.period_start && t.period_end ? " – " : ""}
                      {t.period_end ? formatMonthYear(t.period_end.slice(0, 7)) : ""}
                    </p>
                  )}
                </div>
                <div className="flex gap-1 ml-2 shrink-0">
                  <Button
                    variant="ghost" size="sm" onClick={() => handleEdit(t)}
                    className="text-primary hover:bg-primary/30 h-8 w-8 p-0"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost" size="sm" onClick={() => handleDeleteClick(t)}
                    className="text-destructive hover:bg-destructive/30 h-8 w-8 p-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {t.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 flex-1">{t.description}</p>
              )}

              {/* Toggle */}
              <div className="mt-3 border-t border-border pt-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Visible:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{t.isActive ? "Yes" : "No"}</span>
                    <Switch checked={t.isActive} onCheckedChange={() => handleToggle(t._id)} />
                  </div>
                </div>
              </div>
            </Card>
          ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {editingId ? "Edit Testimonial" : "Add New Testimonial"}
              </h2>
              <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-4">
              {/* Photo Upload */}
              <div>
                <Label className="text-sm font-semibold">
                  Photo {!editingId && <span className="text-destructive">*</span>}
                </Label>
                <div
                  className="mt-1 border-2 border-dashed border-border rounded-lg overflow-hidden cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {formData.photoPreview ? (
                    <img
                      src={formData.photoPreview}
                      alt="Preview"
                      className="w-full max-h-64 object-contain bg-slate-900"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                      <Upload className="w-8 h-8 mb-2 opacity-50" />
                      <p className="text-sm">Click to upload photo</p>
                      <p className="text-xs mt-1 opacity-60">JPG, PNG, WebP supported</p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
                {formData.photoPreview && (
                  <Button
                    variant="ghost" size="sm"
                    className="mt-1 text-xs text-muted-foreground"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Change photo
                  </Button>
                )}
              </div>

              {/* Weight Change */}
              <div>
                <Label htmlFor="weight_change" className="text-sm font-semibold">
                  Weight Change <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="weight_change"
                  value={formData.weight_change}
                  onChange={(e) => setFormData((p) => ({ ...p, weight_change: e.target.value }))}
                  placeholder="e.g. Lost 8kg, Gained 5kg"
                  className="mt-1"
                />
              </div>

              {/* Period Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="period_start" className="text-sm font-semibold">
                    From <span className="text-muted-foreground font-normal">(optional)</span>
                  </Label>
                  <Input
                    id="period_start"
                    type="month"
                    value={formData.period_start}
                    onChange={(e) => setFormData((p) => ({ ...p, period_start: e.target.value }))}
                    onClick={(e) => (e.currentTarget as HTMLInputElement).showPicker()}
                    className="mt-1 [color-scheme:dark] cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute"
                  />
                </div>
                <div>
                  <Label htmlFor="period_end" className="text-sm font-semibold">
                    To <span className="text-muted-foreground font-normal">(optional)</span>
                  </Label>
                  <Input
                    id="period_end"
                    type="month"
                    value={formData.period_end}
                    onChange={(e) => setFormData((p) => ({ ...p, period_end: e.target.value }))}
                    onClick={(e) => (e.currentTarget as HTMLInputElement).showPicker()}
                    className="mt-1 [color-scheme:dark] cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" className="text-sm font-semibold">
                  Description <span className="text-muted-foreground font-normal">(optional)</span>
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Share the client's transformation story..."
                  rows={3}
                  className="mt-1"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2 justify-end pt-2">
                <Button variant="outline" onClick={() => setShowForm(false)} disabled={saving}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={!isFormValid() || saving} className="gap-2">
                  <Save className="w-4 h-4" />
                  {saving ? "Saving..." : editingId ? "Update" : "Create"}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Delete Testimonial
            </AlertDialogTitle>
            <AlertDialogDescription className="text-left">
              Are you sure you want to permanently delete the{" "}
              <strong>"{toDelete?.weight_change}"</strong> testimonial? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setShowDeleteDialog(false); setToDelete(null); }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TestimonialManagement;
