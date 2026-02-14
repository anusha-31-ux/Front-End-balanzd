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
    <div className="h-screen overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950">
      {/* Header - Fixed */}
      <header className="fixed top-0 left-0 right-0 z-40 border-b border-slate-200/10 bg-slate-900/50 backdrop-blur">
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
      <div className="flex h-[calc(100vh-73px)] mt-[73px]">
        {/* Sidebar - Fixed */}
        <div className="fixed top-[73px] left-0 w-64 h-[calc(100vh-73px)] z-30">
          <AdminSidebar />
        </div>

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col ml-64 h-full overflow-hidden">
          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
