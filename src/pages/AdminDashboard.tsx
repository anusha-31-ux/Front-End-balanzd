import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import logo from "@/assets/logo_balanzed.png";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate("/login/admin-portal");
  };

  if (!isLoggedIn) {
    return null; // Redirect will happen
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950">
      {/* Header */}
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

      {/* Main Content */}
      <main className="p-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white">Welcome back!</h2>
            <p className="mt-2 text-slate-400">Manage your Balanzed platform from here.</p>
          </div>

          {/* Dashboard Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Total Users", value: "1,234", icon: "👥" },
              { title: "Active Programs", value: "12", icon: "📋" },
              { title: "Revenue", value: "$45,600", icon: "💰" },
              { title: "Feedback Score", value: "4.8/5", icon: "⭐" },
            ].map((card, index) => (
              <Card key={index} className="border-slate-200/10 bg-slate-800/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-white">{card.title}</CardTitle>
                    <span className="text-2xl">{card.icon}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-white">{card.value}</p>
                  <p className="mt-1 text-xs text-slate-400">+2.5% from last month</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <Card className="mt-8 border-slate-200/10 bg-slate-800/50">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
              <CardDescription>Manage your platform efficiently</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <Button variant="outline" className="h-12">
                  View Users
                </Button>
                <Button variant="outline" className="h-12">
                  Manage Programs
                </Button>
                <Button variant="outline" className="h-12">
                  View Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
