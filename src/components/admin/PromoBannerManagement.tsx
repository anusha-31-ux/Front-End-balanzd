/**
 * Admin Promo Banner Management Component
 * Allows administrators to:
 * - View current banner
 * - Edit banner message
 * - Toggle banner visibility
 */

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { bannerService, Banner } from "@/services/api";
import { Save, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export const PromoBannerManagement = () => {
  const [banner, setBanner] = useState<Banner | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    fetchBanner();
  }, []);

  const fetchBanner = async () => {
    try {
      const bannerData = await bannerService.get();
      setBanner(bannerData);
      if (bannerData) {
        setMessage(bannerData.message);
        setIsVisible(bannerData.isVisible);
      }
    } catch (error) {
      console.error("Failed to fetch banner:", error);
      toast.error("Failed to load banner data");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!message.trim()) {
      toast.error("Please enter a banner message");
      return;
    }

    setSaving(true);
    try {
      const updatedBanner = await bannerService.update({
        message: message.trim(),
        isVisible,
      });
      setBanner(updatedBanner);
      toast.success("Banner updated successfully");
    } catch (error) {
      console.error("Failed to update banner:", error);
      toast.error("Failed to update banner");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="fixed top-[90px] left-0 right-0 z-20 border-b border-slate-200/5 bg-slate-900/50 px-4 py-4 backdrop-blur md:top-[73px] md:left-64 md:px-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="mt-2 h-4 w-96" />
        </div>
        <div className="pt-[120px] md:pt-[100px]">
          <Card className="p-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-24 w-full mb-4" />
            <Skeleton className="h-6 w-24 mb-2" />
            <Skeleton className="h-10 w-32" />
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="fixed top-[90px] left-0 right-0 z-20 border-b border-slate-200/5 bg-slate-900/50 px-4 py-4 backdrop-blur md:top-[73px] md:left-64 md:px-6">
        <h2 className="text-3xl font-bold text-white">Promo Banner Management</h2>
        <p className="mt-2 text-slate-400">Manage the promotional banner displayed on the website.</p>
      </div>

      <div className="pt-[120px] md:pt-[100px]">
        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <Label htmlFor="message" className="text-sm font-medium text-slate-300">
                Banner Message
              </Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your promotional message..."
                className="mt-2 min-h-[100px] resize-none"
              />
              <p className="mt-1 text-xs text-slate-500">
                This message will be displayed in the banner at the top of the website.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isVisible"
                checked={isVisible}
                onCheckedChange={setIsVisible}
              />
              <Label htmlFor="isVisible" className="text-sm font-medium text-slate-300">
                Show Banner
              </Label>
              {isVisible ? (
                <Eye className="h-4 w-4 text-green-400" />
              ) : (
                <EyeOff className="h-4 w-4 text-slate-500" />
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-700">
              <div className="text-sm text-slate-400">
                {banner ? (
                  <span>Last updated: {new Date(banner.updatedAt || banner.createdAt || '').toLocaleString()}</span>
                ) : (
                  <span>No banner exists yet</span>
                )}
              </div>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </Card>

        {/* Preview */}
        {message && (
          <Card className="p-4 bg-slate-800/50">
            <h3 className="text-lg font-semibold text-white mb-3">Preview</h3>
            <div className="bg-gradient-to-r from-primary via-primary/90 to-primary py-3 px-4 rounded-lg">
              <div className="flex items-center justify-center gap-3 text-primary-foreground">
                <span className="text-lg">🎁</span>
                <p className="text-sm md:text-base font-semibold text-center">
                  {message}
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};