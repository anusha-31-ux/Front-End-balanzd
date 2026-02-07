import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InlineToast } from "@/components/ui/toast";
import logo from "@/assets/logo_balanzed.png";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const AdminPortal = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isError, setIsError] = useState(false);
  const [statusMessage, setStatusMessage] = useState<
    | {
        variant: "success" | "error";
        title: string;
        description: string;
      }
    | null
  >(null);

  useEffect(() => {
    if (!statusMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setStatusMessage(null);
    }, 5000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [statusMessage]);

  const allowedUsername = "balanzed";
  const allowedPassword = "Test@123";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setStatusMessage(null);

    try {
      if (username !== allowedUsername || password !== allowedPassword) {
        setPassword("");
        setIsError(true);
        setStatusMessage({
          variant: "error",
          title: "Login failed",
          description: "Invalid username or password.",
        });
        return;
      }

      console.log("Admin login success:", { username });
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setStatusMessage({
        variant: "error",
        title: "Login error",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-950">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900">
            <img src={logo} alt="Balanzed" className="h-10 w-10 object-contain" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              Balanzed
            </p>
            <CardTitle className="text-2xl">Admin Login</CardTitle>
          </div>
          <CardDescription>Sign in to access the admin dashboard</CardDescription>
          <div className="mt-3 min-h-10 text-left">
            {statusMessage && (
              <InlineToast
                variant={statusMessage.variant}
                className="h-10 items-center justify-start px-3 py-2 pr-3 text-left"
              >
                <div className="grid gap-0.5 text-left">
                  <p className="text-xs font-semibold">
                    {statusMessage.title}
                  </p>
                  <p className="text-xs opacity-90">
                    {statusMessage.description}
                  </p>
                </div>
              </InlineToast>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                Username
              </label>
              <Input
                id="username"
                type="text"
                placeholder="Enter Your Username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setIsError(false);
                }}
                className={isError ? "border-red-500" : ""}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setIsError(false);
                  }}
                  className={`pr-10 ${isError ? "border-red-500" : ""}`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPortal;
