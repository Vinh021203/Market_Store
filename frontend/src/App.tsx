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
import PageTransition from "@/components/PageTransition";
import GlobalLoading from "@/components/GlobalLoading";
import { isAdmin } from "@/lib/auth";

// ✅ Lazy Load Pages - Public
const Index = React.lazy(() => import("./pages/Index"));
const Templates = React.lazy(() => import("./pages/Templates"));
const Ebooks = React.lazy(() => import("./pages/Ebooks"));
const Blog = React.lazy(() => import("./pages/Blog"));
const BlogPost = React.lazy(() => import("./pages/BlogPost"));
const ProductDetail = React.lazy(() => import("./pages/ProductDetail"));
const Cart = React.lazy(() => import("./pages/Cart"));
const Checkout = React.lazy(() => import("./pages/Checkout"));
const About = React.lazy(() => import("./pages/About"));
const Contact = React.lazy(() => import("./pages/Contact"));
const Pricing = React.lazy(() => import("./pages/Pricing"));
const SearchResults = React.lazy(() => import("./pages/SearchResults"));
const Careers = React.lazy(() => import("./pages/Careers"));
const Wishlist = React.lazy(() => import("./pages/Wishlist"));

// ✅ User Pages - Protected
const Profile = React.lazy(() => import("./pages/Profile"));
const MyOrders = React.lazy(() => import("./pages/MyOrders"));
const Downloads = React.lazy(() => import("./pages/Downloads"));
const UserSettings = React.lazy(() => import("./pages/Settings")); // ✅ Rename để tránh conflict

// ✅ Auth pages
const Login = React.lazy(() => import("./pages/auth/Login"));
const Register = React.lazy(() => import("./pages/auth/Register"));
const EmailConfirmed = React.lazy(() => import("./pages/auth/EmailConfirmed"));

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
const AdminSettings = React.lazy(() => import("./pages/admin/Settings")); // ✅ Rename để tránh conflict
const NotFound = React.lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

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
    return <GlobalLoading />;
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
    return <GlobalLoading />;
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
  const excludedRoutes = ["/auth/login", "/auth/register"];
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
    return <GlobalLoading />;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={
          <ConditionalLayout>
            <Suspense fallback={<GlobalLoading />}>
              <PageTransition>
                <Index />
              </PageTransition>
            </Suspense>
          </ConditionalLayout>
        }
      />
      <Route
        path="/templates"
        element={
          <ConditionalLayout>
            <Suspense fallback={<GlobalLoading />}>
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
            <Suspense fallback={<GlobalLoading />}>
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
            <Suspense fallback={<GlobalLoading />}>
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
            <Suspense fallback={<GlobalLoading />}>
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
            <Suspense fallback={<GlobalLoading />}>
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
            <Suspense fallback={<GlobalLoading />}>
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
            <Suspense fallback={<GlobalLoading />}>
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
            <Suspense fallback={<GlobalLoading />}>
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
            <Suspense fallback={<GlobalLoading />}>
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
            <Suspense fallback={<GlobalLoading />}>
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
            <Suspense fallback={<GlobalLoading />}>
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
            <Suspense fallback={<GlobalLoading />}>
              <PageTransition>
                <SearchResults />
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
              <Suspense fallback={<GlobalLoading />}>
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
              <Suspense fallback={<GlobalLoading />}>
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
              <Suspense fallback={<GlobalLoading />}>
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
              <Suspense fallback={<GlobalLoading />}>
                <PageTransition>
                  <UserSettings /> {/* ✅ Sử dụng UserSettings */}
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
              <Suspense fallback={<GlobalLoading />}>
                <PageTransition>
                  <Checkout />
                </PageTransition>
              </Suspense>
            </ConditionalLayout>
          </ProtectedRoute>
        }
      />

      {/* ✅ Auth Routes */}
      <Route
        path="/auth/login"
        element={
          <PublicRoute>
            <ConditionalLayout>
              <Suspense fallback={<GlobalLoading />}>
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
              <Suspense fallback={<GlobalLoading />}>
                <PageTransition>
                  <Register />
                </PageTransition>
              </Suspense>
            </ConditionalLayout>
          </PublicRoute>
        }
      />
      <Route
        path="/auth/email-confirmed"
        element={
          <Suspense fallback={<GlobalLoading />}>
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
            <Suspense fallback={<GlobalLoading />}>
              <AdminLayout />
            </Suspense>
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={
            <Suspense fallback={<GlobalLoading />}>
              <PageTransition>
                <AdminDashboard />
              </PageTransition>
            </Suspense>
          }
        />
        <Route
          path="products"
          element={
            <Suspense fallback={<GlobalLoading />}>
              <PageTransition>
                <ProductManagement />
              </PageTransition>
            </Suspense>
          }
        />
        <Route
          path="products/create"
          element={
            <Suspense fallback={<GlobalLoading />}>
              <PageTransition>
                <ProductCreate />
              </PageTransition>
            </Suspense>
          }
        />
        <Route
          path="products/edit/:id"
          element={
            <Suspense fallback={<GlobalLoading />}>
              <PageTransition>
                <ProductCreate />
              </PageTransition>
            </Suspense>
          }
        />
        <Route
          path="orders"
          element={
            <Suspense fallback={<GlobalLoading />}>
              <PageTransition>
                <OrderManagement />
              </PageTransition>
            </Suspense>
          }
        />
        <Route
          path="blog"
          element={
            <Suspense fallback={<GlobalLoading />}>
              <PageTransition>
                <BlogManagement />
              </PageTransition>
            </Suspense>
          }
        />
        <Route
          path="blog/create"
          element={
            <Suspense fallback={<GlobalLoading />}>
              <PageTransition>
                <BlogCreate />
              </PageTransition>
            </Suspense>
          }
        />
        <Route
          path="blog/edit/:id"
          element={
            <Suspense fallback={<GlobalLoading />}>
              <PageTransition>
                <BlogCreate />
              </PageTransition>
            </Suspense>
          }
        />
        <Route
          path="blog/categories"
          element={
            <Suspense fallback={<GlobalLoading />}>
              <PageTransition>
                <BlogCategories />
              </PageTransition>
            </Suspense>
          }
        />
        <Route
          path="users"
          element={
            <Suspense fallback={<GlobalLoading />}>
              <PageTransition>
                <UserManagement />
              </PageTransition>
            </Suspense>
          }
        />
        <Route
          path="analytics"
          element={
            <Suspense fallback={<GlobalLoading />}>
              <PageTransition>
                <Analytics />
              </PageTransition>
            </Suspense>
          }
        />
        <Route
          path="reports"
          element={
            <Suspense fallback={<GlobalLoading />}>
              <PageTransition>
                <Reports />
              </PageTransition>
            </Suspense>
          }
        />
        <Route
          path="settings"
          element={
            <Suspense fallback={<GlobalLoading />}>
              <PageTransition>
                <AdminSettings /> {/* ✅ Sử dụng AdminSettings */}
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
            <Suspense fallback={<GlobalLoading />}>
              <PageTransition>
                <NotFound />
              </PageTransition>
            </Suspense>
          </ConditionalLayout>
        }
      />
    </Routes>
  );
};

// Main App Component
const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <TooltipProvider>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <LoadingProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <AppRoutes />
                </BrowserRouter>
              </LoadingProvider>
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
