import { useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, IndianRupee, MessageSquare, CreditCard, ChevronDown, ChevronRight, Megaphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [pricingExpanded, setPricingExpanded] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
    { icon: MessageSquare, label: "Testimonials", path: "/admin/testimonials" },
    { icon: CreditCard, label: "Transactions", path: "/admin/razorpay" },
    { icon: Megaphone, label: "Promo Banner", path: "/admin/promo-banner" },
  ];

  const pricingSubItems = [
    { label: "Live Session", path: "/admin/pricing" },
    { label: "Personal Training", path: "/admin/personal-training" },
  ];

  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-200/10 bg-slate-900/50">
      <nav className="flex-1 space-y-2 overflow-auto p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Button
              key={item.path}
              variant={isActive ? "default" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 rounded-lg",
                isActive
                  ? "bg-slate-700 text-white hover:bg-slate-600"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              )}
              onClick={() => navigate(item.path)}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Button>
          );
        })}

        {/* Pricing Section with Sub-items */}
        <div className="space-y-1">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white",
              pricingExpanded && "bg-slate-800/50"
            )}
            onClick={() => setPricingExpanded(!pricingExpanded)}
          >
            <IndianRupee className="h-5 w-5" />
            <span>Pricing</span>
            {pricingExpanded ? (
              <ChevronDown className="h-4 w-4 ml-auto" />
            ) : (
              <ChevronRight className="h-4 w-4 ml-auto" />
            )}
          </Button>

          {pricingExpanded && (
            <div className="ml-8 space-y-1">
              {pricingSubItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.path}
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3 rounded-lg text-sm",
                      isActive
                        ? "bg-slate-700 text-white hover:bg-slate-600"
                        : "text-slate-400 hover:bg-slate-700 hover:text-white"
                    )}
                    onClick={() => navigate(item.path)}
                  >
                    <span>{item.label}</span>
                  </Button>
                );
              })}
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
