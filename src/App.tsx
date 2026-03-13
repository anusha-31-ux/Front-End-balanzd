import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSSEUpdates } from "@/hooks/useSSEUpdates";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PageLoader from "./components/PageLoader";
import ProtectedRoute from "./components/ProtectedRoute";
import { UpdateNotification } from "./components/UpdateNotification";
import { NeedHelpWidget } from "./components/NeedHelpWidget";

// Lazy load policy pages
const RefundPolicy = lazy(() => import("./pages/RefundPolicy"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsConditions = lazy(() => import("./pages/TermsConditions"));
const PrizeChallengePolicy = lazy(() => import("./pages/PrizeChallengePolicy"));
const ProgramPolicy = lazy(() => import("./pages/ProgramPolicy"));

// Lazy load admin pages
const PricingManagement = lazy(() =>
  import("./components/admin/PricingManagement").then((mod) => ({
    default: mod.PricingManagement,
  }))
);

const TestimonialManagement = lazy(() =>
  import("./components/admin/TestimonialManagement").then((mod) => ({
    default: mod.TestimonialManagement,
  }))
);
const AdminPortal = lazy(() => import("./admin/AdminPortal"));
const AdminDashboard = lazy(() => import("./admin/pages/Dashboard"));
const AdminPricing = lazy(() => import("./admin/pages/Pricing"));
const AdminPersonalTraining = lazy(() => import("./admin/pages/PersonalTraining"));
const AdminTestimonials = lazy(() => import("./admin/pages/Testimonials"));
const AdminRazorpay = lazy(() => import("./admin/pages/transaction"));
const AdminPromoBanner = lazy(() => import("./admin/pages/PromoBanner"));

const queryClient = new QueryClient();

/** Opens the SSE connection for the lifetime of the app */
const SSEConnector = () => { useSSEUpdates(); return null; };

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-center"   // ✅ THIS FIXES POSITION
        richColors
        closeButton/>
      <BrowserRouter>
        <SSEConnector />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login/admin-portal" element={<AdminPortal />} />
            <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/pricing" element={<ProtectedRoute><AdminPricing /></ProtectedRoute>} />
            <Route path="/admin/personal-training" element={<ProtectedRoute><AdminPersonalTraining /></ProtectedRoute>} />
            <Route path="/admin/testimonials" element={<ProtectedRoute><AdminTestimonials /></ProtectedRoute>} />
            <Route path="/admin/razorpay" element={<ProtectedRoute><AdminRazorpay /></ProtectedRoute>} />
            <Route path="/admin/promo-banner" element={<ProtectedRoute><AdminPromoBanner /></ProtectedRoute>} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-conditions" element={<TermsConditions />} />
            <Route path="/prize-challenge-policy" element={<PrizeChallengePolicy />} />
            <Route path="/program-policy" element={<ProgramPolicy />} />
            
            {/* Admin Routes */}
            <Route path="/admin/pricing" element={<PricingManagement />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <NeedHelpWidget />
      </BrowserRouter>
      <UpdateNotification />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
