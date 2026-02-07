import { useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, IndianRupee, MessageSquare, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
    { icon: IndianRupee, label: "Pricing", path: "/admin/pricing" },
    { icon: MessageSquare, label: "Testimonials", path: "/admin/testimonials" },
    { icon: CreditCard, label: "Razorpay", path: "/admin/razorpay" },
  ];

  return (
    <aside className="w-64 border-r border-slate-200/10 bg-slate-900/50">
      <nav className="space-y-2 p-4">
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
      </nav>
    </aside>
  );
};

export default AdminSidebar;
