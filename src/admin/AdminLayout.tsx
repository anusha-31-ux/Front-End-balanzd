import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo_balanzed.png";
import AdminSidebar from "./components/AdminSidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login/admin-portal");
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-slate-900 to-slate-950">
      {/* Header - Full Width */}
      <header className="border-b border-slate-200/10 bg-slate-900/50 backdrop-blur">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800">
              <img src={logo} alt="Balanzed" className="h-8 w-8 object-contain" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">Admin Dashboard</h1>
              <p className="text-xs text-slate-400">Balanzed Management</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Sidebar and Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col">
          {/* Main Content */}
          <main className="flex-1 overflow-auto p-6">
            <div className="mx-auto max-w-6xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
