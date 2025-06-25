import React, { Suspense } from "react"; // ✅ Import Suspense
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
import { LoadingProvider } from "@/contexts/LoadingContext";
import Layout from "@/components/Layout";
import AdminLayout from "@/components/admin/AdminLayout";
import PageTransition from "@/components/PageTransition";
import GlobalLoading from "@/components/GlobalLoading";
import { isAdmin } from "@/lib/auth";

// ✅ Lazy Load Pages
// Thay vì import trực tiếp, chúng ta dùng React.lazy
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
const Profile = React.lazy(() => import("./pages/Profile"));
const Pricing = React.lazy(() => import("./pages/Pricing"));
const SearchResults = React.lazy(() => import("./pages/SearchResults"));

// Auth pages
const Login = React.lazy(() => import("./pages/auth/Login"));
const Register = React.lazy(() => import("./pages/auth/Register"));

// Admin pages
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
const Settings = React.lazy(() => import("./pages/admin/Settings"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

// ✅ Protected Route Component (không đổi)
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

// ✅ Public Route Component (không đổi)
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

// ✅ Component để wrap routes với conditional layout (không đổi)
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

// ✅ App Routes Component (sử dụng Suspense cho từng Route element)
const AppRoutes = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <GlobalLoading />;
  }

  return (
    <Routes>
      {/* Public Routes with Conditional Layout */}
      <Route
        path="/"
        element={
          <ConditionalLayout>
            <Suspense fallback={<GlobalLoading />}>
              {" "}
              {/* ✅ Thêm Suspense */}
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

      {/* ✅ Protected Routes */}
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

      {/* ✅ Auth Routes - Chỉ hiển thị khi chưa đăng nhập */}
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
                <Settings />
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

// ✅ Main App Component (không đổi)
const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <TooltipProvider>
        <AuthProvider>
          <CartProvider>
            <LoadingProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
            </LoadingProvider>
          </CartProvider>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
