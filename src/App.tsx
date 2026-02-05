import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PageLoader from "./components/PageLoader";

// Lazy load policy pages
const RefundPolicy = lazy(() => import("./pages/RefundPolicy"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsConditions = lazy(() => import("./pages/TermsConditions"));
const PrizeChallengePolicy = lazy(() => import("./pages/PrizeChallengePolicy"));
const ProgramPolicy = lazy(() => import("./pages/ProgramPolicy"));

// Lazy load admin pages
const AdminPortal = lazy(() => import("./admin/AdminPortal"));
const AdminDashboard = lazy(() => import("./admin/pages/Dashboard"));
const AdminPricing = lazy(() => import("./admin/pages/Pricing"));
const AdminTestimonials = lazy(() => import("./admin/pages/Testimonials"));
const AdminRazorpay = lazy(() => import("./admin/pages/Razorpay"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-center"   // ✅ THIS FIXES POSITION
        richColors
        closeButton/>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login/admin-portal" element={<AdminPortal />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/pricing" element={<AdminPricing />} />
            <Route path="/admin/testimonials" element={<AdminTestimonials />} />
            <Route path="/admin/razorpay" element={<AdminRazorpay />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-conditions" element={<TermsConditions />} />
            <Route path="/prize-challenge-policy" element={<PrizeChallengePolicy />} />
            <Route path="/program-policy" element={<ProgramPolicy />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
