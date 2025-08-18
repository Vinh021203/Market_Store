import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { WishlistProvider } from "@/hooks/useWishlist";
import { LoadingProvider } from "@/contexts/LoadingContext";
import Layout from "@/components/Layout";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminChatPanel from "@/pages/admin/AdminChatPanel";
import PageTransition from "@/components/PageTransition";
import GlobalLoading from "@/components/GlobalLoading";
import LoadingSpinner from "@/components/LoadingSpinner";
import { isAdmin } from "@/lib/auth";

// ✅ Lazy Load Pages - Public
const Home = React.lazy(() => import("./pages/Home"));
const Templates = React.lazy(() => import("./pages/Templates"));
const Ebooks = React.lazy(() => import("./pages/Ebooks"));
const Blog = React.lazy(() => import("./pages/Blog"));
const BlogPost = React.lazy(() => import("./pages/BlogPost"));
const ProductDetail = React.lazy(() => import("./pages/ProductDetail"));
const Cart = React.lazy(() => import("./pages/Cart"));
const Checkout = React.lazy(() => import("./pages/Checkout"));
const PaymentPage = React.lazy(() => import("./pages/PaymentPage"));
const About = React.lazy(() => import("./pages/About"));
const Contact = React.lazy(() => import("./pages/Contact"));
const Pricing = React.lazy(() => import("./pages/Pricing"));
const SearchResults = React.lazy(() => import("./pages/SearchResults"));
const Careers = React.lazy(() => import("./pages/Careers"));
const Wishlist = React.lazy(() => import("./pages/Wishlist"));

// ✅ Support Pages
const Help = React.lazy(() => import("./pages/Help"));
const FAQ = React.lazy(() => import("./pages/FAQ"));
const Privacy = React.lazy(() => import("./pages/Privacy"));
const Terms = React.lazy(() => import("./pages/Terms"));
const Refund = React.lazy(() => import("./pages/Refund"));
const APIDocumentation = React.lazy(() => import("./pages/APIDocumentation"));
const Cookie = React.lazy(() => import("./pages/Cookie"));

// ✅ User Pages - Protected
const Profile = React.lazy(() => import("./pages/Profile"));
const MyOrders = React.lazy(() => import("./pages/MyOrders"));
const Downloads = React.lazy(() => import("./pages/Downloads"));
const UserSettings = React.lazy(() => import("./pages/Settings"));

// ✅ Enhanced Auth pages
const Login = React.lazy(() => import("./pages/auth/Login"));
const Register = React.lazy(() => import("./pages/auth/Register"));
const EmailConfirmed = React.lazy(() => import("./pages/auth/EmailConfirmed"));
const EmailVerification = React.lazy(
  () => import("./pages/auth/EmailVerification"),
);
const ForgotPassword = React.lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = React.lazy(() => import("./pages/auth/ResetPassword"));

// ✅ Admin pages
const AdminDashboard = React.lazy(() => import("./pages/admin/Dashboard"));
const ProductManagement = React.lazy(
  () => import("./pages/admin/ProductManagement"),
);
const ProductCreate = React.lazy(() => import("./pages/admin/ProductCreate"));
const OrderManagement = React.lazy(
  () => import("./pages/admin/OrderManagement"),
);
const UserManagement = React.lazy(() => import("./pages/admin/UserManagement"));
const BlogManagement = React.lazy(() => import("./pages/admin/BlogManagement"));
const BlogCreate = React.lazy(() => import("./pages/admin/BlogCreate"));
const BlogCategories = React.lazy(() => import("./pages/admin/BlogCategories"));
const Analytics = React.lazy(() => import("./pages/admin/Analytics"));
const Reports = React.lazy(() => import("./pages/admin/Reports"));
const NotificationsManagement = React.lazy(
  () => import("./pages/admin/NotificationsManagement"),
);
const EmailMarketing = React.lazy(() => import("./pages/admin/EmailMarketing"));
const AdminSettings = React.lazy(() => import("./pages/admin/Settings"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

// ✅ Enhanced Suspense Fallback
const SuspenseFallback: React.FC = () => <LoadingSpinner fullscreen />;

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false,
}) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner fullscreen />;
  }

  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin(user)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Public Route Component
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner fullscreen />;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Component để wrap routes với conditional layout
const ConditionalLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const location = useLocation();
  const excludedRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/email-verification",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/auth/email-confirmed",
  ];
  const shouldHideLayout = excludedRoutes.includes(location.pathname);

  if (shouldHideLayout) {
    return <>{children}</>;
  }

  return <Layout>{children}</Layout>;
};

// ✅ App Routes Component
const AppRoutes = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner fullscreen />;
  }

  return (
    <>
      <GlobalLoading />
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <ConditionalLayout>
              <Suspense fallback={<SuspenseFallback />}>
                <PageTransition>
                  <Home />
                </PageTransition>
              </Suspense>
            </ConditionalLayout>
          }
        />
        <Route
          path="/templates"
          element={
            <ConditionalLayout>
              <Suspense fallback={<SuspenseFallback />}>
                <PageTransition>
                  <Templates />
                </PageTransition>
              </Suspense>
            </ConditionalLayout>
          }
        />
        <Route
          path="/ebooks"
          element={
            <ConditionalLayout>
              <Suspense fallback={<SuspenseFallback />}>
                <PageTransition>
                  <Ebooks />
                </PageTransition>
              </Suspense>
            </ConditionalLayout>
          }
        />
        <Route
          path="/blog"
          element={
            <ConditionalLayout>
              <Suspense fallback={<SuspenseFallback />}>
                <PageTransition>
                  <Blog />
                </PageTransition>
              </Suspense>
            </ConditionalLayout>
          }
        />
        <Route
          path="/blog/:slug"
          element={
            <ConditionalLayout>
              <Suspense fallback={<SuspenseFallback />}>
                <PageTransition>
                  <BlogPost />
                </PageTransition>
              </Suspense>
            </ConditionalLayout>
          }
        />
        <Route
          path="/product/:id"
          element={
            <ConditionalLayout>
              <Suspense fallback={<SuspenseFallback />}>
                <PageTransition>
                  <ProductDetail />
                </PageTransition>
              </Suspense>
            </ConditionalLayout>
          }
        />
        <Route
          path="/cart"
          element={
            <ConditionalLayout>
              <Suspense fallback={<SuspenseFallback />}>
                <PageTransition>
                  <Cart />
                </PageTransition>
              </Suspense>
            </ConditionalLayout>
          }
        />
        <Route
          path="/about"
          element={
            <ConditionalLayout>
              <Suspense fallback={<SuspenseFallback />}>
                <PageTransition>
                  <About />
                </PageTransition>
              </Suspense>
            </ConditionalLayout>
          }
        />
        <Route
          path="/contact"
          element={
            <ConditionalLayout>
              <Suspense fallback={<SuspenseFallback />}>
                <PageTransition>
                  <Contact />
                </PageTransition>
              </Suspense>
            </ConditionalLayout>
          }
        />
        <Route
          path="/careers"
          element={
            <ConditionalLayout>
              <Suspense fallback={<SuspenseFallback />}>
                <PageTransition>
                  <Careers />
                </PageTransition>
              </Suspense>
            </ConditionalLayout>
          }
        />
        <Route
          path="/wishlist"
          element={
            <ConditionalLayout>
              <Suspense fallback={<SuspenseFallback />}>
                <PageTransition>
                  <Wishlist />
                </PageTransition>
              </Suspense>
            </ConditionalLayout>
          }
        />
        <Route
          path="/pricing"
          element={
            <ConditionalLayout>
              <Suspense fallback={<SuspenseFallback />}>
                <PageTransition>
                  <Pricing />
                </PageTransition>
              </Suspense>
            </ConditionalLayout>
          }
        />
        <Route
          path="/search"
          element={
            <ConditionalLayout>
              <Suspense fallback={<SuspenseFallback />}>
                <PageTransition>
                  <SearchResults />
                </PageTransition>
              </Suspense>
            </ConditionalLayout>
          }
        />
        <Route
          path="/help"
          element={
            <ConditionalLayout>
              <Suspense fallback={<SuspenseFallback />}>
                <PageTransition>
                  <Help />
                </PageTransition>
              </Suspense>
            </ConditionalLayout>
          }
        />
        <Route
          path="/faq"
          element={
            <ConditionalLayout>
              <Suspense fallback={<SuspenseFallback />}>
                <PageTransition>
                  <FAQ />
                </PageTransition>
              </Suspense>
            </ConditionalLayout>
          }
        />
        <Route
          path="/privacy"
          element={
            <ConditionalLayout>
              <Suspense fallback={<SuspenseFallback />}>
                <PageTransition>
                  <Privacy />
                </PageTransition>
              </Suspense>
            </ConditionalLayout>
          }
        />
        <Route
          path="/terms"
          element={
            <ConditionalLayout>
              <Suspense fallback={<SuspenseFallback />}>
                <PageTransition>
                  <Terms />
                </PageTransition>
              </Suspense>
            </ConditionalLayout>
          }
        />
        <Route
          path="/refund"
          element={
            <ConditionalLayout>
              <Suspense fallback={<SuspenseFallback />}>
                <PageTransition>
                  <Refund />
                </PageTransition>
              </Suspense>
            </ConditionalLayout>
          }
        />
        <Route
          path="/api"
          element={
            <ConditionalLayout>
              <Suspense fallback={<SuspenseFallback />}>
                <PageTransition>
                  <APIDocumentation />
                </PageTransition>
              </Suspense>
            </ConditionalLayout>
          }
        />
        <Route
          path="/cookies"
          element={
            <ConditionalLayout>
              <Suspense fallback={<SuspenseFallback />}>
                <PageTransition>
                  <Cookie />
                </PageTransition>
              </Suspense>
            </ConditionalLayout>
          }
        />

        {/* ✅ Protected User Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ConditionalLayout>
                <Suspense fallback={<SuspenseFallback />}>
                  <PageTransition>
                    <Profile />
                  </PageTransition>
                </Suspense>
              </ConditionalLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-orders"
          element={
            <ProtectedRoute>
              <ConditionalLayout>
                <Suspense fallback={<SuspenseFallback />}>
                  <PageTransition>
                    <MyOrders />
                  </PageTransition>
                </Suspense>
              </ConditionalLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/downloads"
          element={
            <ProtectedRoute>
              <ConditionalLayout>
                <Suspense fallback={<SuspenseFallback />}>
                  <PageTransition>
                    <Downloads />
                  </PageTransition>
                </Suspense>
              </ConditionalLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <ConditionalLayout>
                <Suspense fallback={<SuspenseFallback />}>
                  <PageTransition>
                    <UserSettings />
                  </PageTransition>
                </Suspense>
              </ConditionalLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <ConditionalLayout>
                <Suspense fallback={<SuspenseFallback />}>
                  <PageTransition>
                    <Checkout />
                  </PageTransition>
                </Suspense>
              </ConditionalLayout>
            </ProtectedRoute>
          }
        />
        {/* ✅ Payment Page Route - Public */}
        <Route
          path="/pay/:orderId"
          element={
            <ConditionalLayout>
              <Suspense fallback={<SuspenseFallback />}>
                <PageTransition>
                  <PaymentPage />
                </PageTransition>
              </Suspense>
            </ConditionalLayout>
          }
        />

        {/* ✅ Enhanced Auth Routes */}
        <Route
          path="/auth/login"
          element={
            <PublicRoute>
              <ConditionalLayout>
                <Suspense fallback={<SuspenseFallback />}>
                  <PageTransition>
                    <Login />
                  </PageTransition>
                </Suspense>
              </ConditionalLayout>
            </PublicRoute>
          }
        />
        <Route
          path="/auth/register"
          element={
            <PublicRoute>
              <ConditionalLayout>
                <Suspense fallback={<SuspenseFallback />}>
                  <PageTransition>
                    <Register />
                  </PageTransition>
                </Suspense>
              </ConditionalLayout>
            </PublicRoute>
          }
        />

        {/* ✅ New Auth Routes */}
        <Route
          path="/auth/email-verification"
          element={
            <ConditionalLayout>
              <Suspense fallback={<SuspenseFallback />}>
                <PageTransition>
                  <EmailVerification />
                </PageTransition>
              </Suspense>
            </ConditionalLayout>
          }
        />
        <Route
          path="/auth/forgot-password"
          element={
            <PublicRoute>
              <ConditionalLayout>
                <Suspense fallback={<SuspenseFallback />}>
                  <PageTransition>
                    <ForgotPassword />
                  </PageTransition>
                </Suspense>
              </ConditionalLayout>
            </PublicRoute>
          }
        />
        <Route
          path="/auth/reset-password"
          element={
            <ConditionalLayout>
              <Suspense fallback={<SuspenseFallback />}>
                <PageTransition>
                  <ResetPassword />
                </PageTransition>
              </Suspense>
            </ConditionalLayout>
          }
        />
        <Route
          path="/auth/email-confirmed"
          element={
            <Suspense fallback={<SuspenseFallback />}>
              <PageTransition>
                <EmailConfirmed />
              </PageTransition>
            </Suspense>
          }
        />

        {/* ✅ Admin Routes with Protection */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <Suspense fallback={<SuspenseFallback />}>
                <AdminLayout />
              </Suspense>
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <Suspense fallback={<SuspenseFallback />}>
                <PageTransition>
                  <AdminDashboard />
                </PageTransition>
              </Suspense>
            }
          />
          <Route
            path="products"
            element={
              <Suspense fallback={<SuspenseFallback />}>
                <PageTransition>
                  <ProductManagement />
                </PageTransition>
              </Suspense>
            }
          />
          <Route
            path="products/create"
            element={
              <Suspense fallback={<SuspenseFallback />}>
                <PageTransition>
                  <ProductCreate />
                </PageTransition>
              </Suspense>
            }
          />
          <Route
            path="products/edit/:id"
            element={
              <Suspense fallback={<SuspenseFallback />}>
                <PageTransition>
                  <ProductCreate />
                </PageTransition>
              </Suspense>
            }
          />
          <Route
            path="orders"
            element={
              <Suspense fallback={<SuspenseFallback />}>
                <PageTransition>
                  <OrderManagement />
                </PageTransition>
              </Suspense>
            }
          />
          <Route
            path="chat"
            element={
              <Suspense fallback={<SuspenseFallback />}>
                <PageTransition>
                  <AdminChatPanel />
                </PageTransition>
              </Suspense>
            }
          />
          <Route
            path="blog"
            element={
              <Suspense fallback={<SuspenseFallback />}>
                <PageTransition>
                  <BlogManagement />
                </PageTransition>
              </Suspense>
            }
          />
          <Route
            path="blog/create"
            element={
              <Suspense fallback={<SuspenseFallback />}>
                <PageTransition>
                  <BlogCreate />
                </PageTransition>
              </Suspense>
            }
          />
          <Route
            path="blog/edit/:id"
            element={
              <Suspense fallback={<SuspenseFallback />}>
                <PageTransition>
                  <BlogCreate />
                </PageTransition>
              </Suspense>
            }
          />
          <Route
            path="blog/categories"
            element={
              <Suspense fallback={<SuspenseFallback />}>
                <PageTransition>
                  <BlogCategories />
                </PageTransition>
              </Suspense>
            }
          />
          <Route
            path="users"
            element={
              <Suspense fallback={<SuspenseFallback />}>
                <PageTransition>
                  <UserManagement />
                </PageTransition>
              </Suspense>
            }
          />
          <Route
            path="analytics"
            element={
              <Suspense fallback={<SuspenseFallback />}>
                <PageTransition>
                  <Analytics />
                </PageTransition>
              </Suspense>
            }
          />
          <Route
            path="reports"
            element={
              <Suspense fallback={<SuspenseFallback />}>
                <PageTransition>
                  <Reports />
                </PageTransition>
              </Suspense>
            }
          />
          <Route
            path="email-marketing"
            element={
              <Suspense fallback={<SuspenseFallback />}>
                <PageTransition>
                  <EmailMarketing />
                </PageTransition>
              </Suspense>
            }
          />
          <Route
            path="notifications"
            element={
              <Suspense fallback={<SuspenseFallback />}>
                <PageTransition>
                  <NotificationsManagement />
                </PageTransition>
              </Suspense>
            }
          />
          <Route
            path="settings"
            element={
              <Suspense fallback={<SuspenseFallback />}>
                <PageTransition>
                  <AdminSettings />
                </PageTransition>
              </Suspense>
            }
          />
        </Route>

        {/* 404 Route */}
        <Route
          path="*"
          element={
            <ConditionalLayout>
              <Suspense fallback={<SuspenseFallback />}>
                <PageTransition>
                  <NotFound />
                </PageTransition>
              </Suspense>
            </ConditionalLayout>
          }
        />
      </Routes>
    </>
  );
};

// ✅ Main App Component
const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <TooltipProvider>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter
                future={{
                  v7_startTransition: true,
                  v7_relativeSplatPath: true,
                }}
              >
                <LoadingProvider>
                  <AppRoutes />
                </LoadingProvider>
              </BrowserRouter>
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
