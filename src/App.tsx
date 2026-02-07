import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { USER_ROLES } from "@/lib/constants";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import HowItWorks from "./pages/HowItWorks";
import About from "./pages/About";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import VendorLogin from "./pages/auth/VendorLogin";
import VendorRegister from "./pages/auth/VendorRegister";
import AdminLogin from "./pages/auth/AdminLogin";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminVendors from "./pages/admin/AdminVendors";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminBookings from "./pages/admin/AdminBooking";
import AdminSettings from "./pages/admin/AdminSettings";

// Vendor Pages
import VendorDashboard from "./pages/vendor/VendorDashboard";
import VendorServices from "./pages/vendor/VendorServices";
import VendorAddService from "./pages/vendor/VendorAddService";
import VendorBookings from "./pages/vendor/VendorBookings";
import VendorSettings from "./pages/vendor/VendorSettings";

// Customer Pages
import CustomerBookings from "./pages/customer/CustomerBookings";

// 🔹 Shared components (Chat + Review routes optional usage)
import ChatBox from "@/components/chat/Chatbox";
import ReviewForm from "@/components/review/ReviewForm";

const queryClient = new QueryClient();

/* =========================
   Smooth scroll on route change
========================= */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return null;
};

/* =========================
   App Router
========================= */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />

          <Routes>
            {/* ---------------- PUBLIC ROUTES ---------------- */}
            <Route path="/" element={<Index />} />
            <Route path="/services/:categoryId?" element={<Services />} />
            <Route path="/service/:categoryId/:serviceId" element={<ServiceDetail />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/about" element={<About />} />

            {/* ---------------- AUTH ROUTES ---------------- */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/vendor/login" element={<VendorLogin />} />
            <Route path="/vendor/register" element={<VendorRegister />} />
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* ---------------- ADMIN ROUTES ---------------- */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]} redirectTo="/admin/login">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/categories"
              element={
                <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]} redirectTo="/admin/login">
                  <AdminCategories />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/vendors"
              element={
                <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]} redirectTo="/admin/login">
                  <AdminVendors />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]} redirectTo="/admin/login">
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/bookings"
              element={
                <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]} redirectTo="/admin/login">
                  <AdminBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]} redirectTo="/admin/login">
                  <AdminSettings />
                </ProtectedRoute>
              }
            />

            {/* ---------------- VENDOR ROUTES ---------------- */}
            <Route
              path="/vendor"
              element={
                <ProtectedRoute allowedRoles={[USER_ROLES.VENDOR]} redirectTo="/vendor/login">
                  <VendorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vendor/services"
              element={
                <ProtectedRoute allowedRoles={[USER_ROLES.VENDOR]} redirectTo="/vendor/login">
                  <VendorServices />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vendor/add-service"
              element={
                <ProtectedRoute allowedRoles={[USER_ROLES.VENDOR]} redirectTo="/vendor/login">
                  <VendorAddService />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vendor/bookings"
              element={
                <ProtectedRoute allowedRoles={[USER_ROLES.VENDOR]} redirectTo="/vendor/login">
                  <VendorBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vendor/settings"
              element={
                <ProtectedRoute allowedRoles={[USER_ROLES.VENDOR]} redirectTo="/vendor/login">
                  <VendorSettings />
                </ProtectedRoute>
              }
            />

            {/* ---------------- CUSTOMER ROUTES ---------------- */}
            <Route
              path="/customer/bookings"
              element={
                <ProtectedRoute allowedRoles={[USER_ROLES.CUSTOMER]} redirectTo="/login">
                  <CustomerBookings />
                </ProtectedRoute>
              }
            />

            {/* ---------------- OPTIONAL SHARED ROUTES ---------------- */}
            {/* These routes allow direct navigation if needed (testing chat/review standalone) */}

            <Route
              path="/chat/:bookingId"
              element={
                <ProtectedRoute
                  allowedRoles={[USER_ROLES.CUSTOMER, USER_ROLES.VENDOR]}
                  redirectTo="/login"
                >
                  <div className="container py-8">
                    <ChatBox bookingId={""} />
                  </div>
                </ProtectedRoute>
              }
            />

            <Route
              path="/review/:bookingId"
              element={
                <ProtectedRoute allowedRoles={[USER_ROLES.CUSTOMER]} redirectTo="/login">
                  <div className="container py-8">
                    <ReviewForm bookingId={""} />
                  </div>
                </ProtectedRoute>
              }
            />

            {/* ---------------- REDIRECTS ---------------- */}
            {/* prevent blank vendor/admin root routes */}
            <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
            <Route path="/vendor/*" element={<Navigate to="/vendor" replace />} />

            {/* ---------------- 404 ---------------- */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
