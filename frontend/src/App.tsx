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

// Pages
import Index from "./pages/Index";
import Templates from "./pages/Templates";
import Ebooks from "./pages/Ebooks";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import Pricing from "./pages/Pricing";
import SearchResults from "./pages/SearchResults";

// Auth pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import ProductManagement from "./pages/admin/ProductManagement";
import ProductCreate from "./pages/admin/ProductCreate";
import OrderManagement from "./pages/admin/OrderManagement";
import UserManagement from "./pages/admin/UserManagement";
import BlogManagement from "./pages/admin/BlogManagement";
import BlogCreate from "./pages/admin/BlogCreate";
import BlogCategories from "./pages/admin/BlogCategories";
import Analytics from "./pages/admin/Analytics";
import Reports from "./pages/admin/Reports";
import Settings from "./pages/admin/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// ✅ Protected Route Component
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

  // ✅ Hiển thị loading khi đang check auth
  if (isLoading) {
    return <GlobalLoading />;
  }

  // ✅ Redirect về login nếu chưa đăng nhập
  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // ✅ Check admin permission nếu cần
  if (requireAdmin && !isAdmin(user)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// ✅ Public Route Component (cho auth pages)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  // ✅ Hiển thị loading khi đang check auth
  if (isLoading) {
    return <GlobalLoading />;
  }

  // ✅ Redirect về home nếu đã đăng nhập
  if (user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// ✅ Component để wrap routes với conditional layout
const ConditionalLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const location = useLocation();

  // Danh sách routes không cần header/footer
  const excludedRoutes = ["/auth/login", "/auth/register"];

  // Kiểm tra xem có phải route bị loại trừ không
  const shouldHideLayout = excludedRoutes.includes(location.pathname);

  if (shouldHideLayout) {
    // Render trực tiếp children mà không có Layout
    return <>{children}</>;
  }

  // Render với Layout bình thường
  return <Layout>{children}</Layout>;
};

// ✅ App Routes Component (để sử dụng useAuth hook)
const AppRoutes = () => {
  const { isLoading } = useAuth();

  // ✅ Hiển thị loading toàn app khi đang check auth lần đầu
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
            <PageTransition>
              <Index />
            </PageTransition>
          </ConditionalLayout>
        }
      />
      <Route
        path="/templates"
        element={
          <ConditionalLayout>
            <PageTransition>
              <Templates />
            </PageTransition>
          </ConditionalLayout>
        }
      />
      <Route
        path="/ebooks"
        element={
          <ConditionalLayout>
            <PageTransition>
              <Ebooks />
            </PageTransition>
          </ConditionalLayout>
        }
      />
      <Route
        path="/blog"
        element={
          <ConditionalLayout>
            <PageTransition>
              <Blog />
            </PageTransition>
          </ConditionalLayout>
        }
      />
      <Route
        path="/blog/:slug"
        element={
          <ConditionalLayout>
            <PageTransition>
              <BlogPost />
            </PageTransition>
          </ConditionalLayout>
        }
      />
      <Route
        path="/product/:id"
        element={
          <ConditionalLayout>
            <PageTransition>
              <ProductDetail />
            </PageTransition>
          </ConditionalLayout>
        }
      />
      <Route
        path="/cart"
        element={
          <ConditionalLayout>
            <PageTransition>
              <Cart />
            </PageTransition>
          </ConditionalLayout>
        }
      />
      <Route
        path="/about"
        element={
          <ConditionalLayout>
            <PageTransition>
              <About />
            </PageTransition>
          </ConditionalLayout>
        }
      />
      <Route
        path="/contact"
        element={
          <ConditionalLayout>
            <PageTransition>
              <Contact />
            </PageTransition>
          </ConditionalLayout>
        }
      />
      <Route
        path="/pricing"
        element={
          <ConditionalLayout>
            <PageTransition>
              <Pricing />
            </PageTransition>
          </ConditionalLayout>
        }
      />
      <Route
        path="/search"
        element={
          <ConditionalLayout>
            <PageTransition>
              <SearchResults />
            </PageTransition>
          </ConditionalLayout>
        }
      />

      {/* ✅ Protected Routes */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ConditionalLayout>
              <PageTransition>
                <Profile />
              </PageTransition>
            </ConditionalLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <ConditionalLayout>
              <PageTransition>
                <Checkout />
              </PageTransition>
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
              <PageTransition>
                <Login />
              </PageTransition>
            </ConditionalLayout>
          </PublicRoute>
        }
      />
      <Route
        path="/auth/register"
        element={
          <PublicRoute>
            <ConditionalLayout>
              <PageTransition>
                <Register />
              </PageTransition>
            </ConditionalLayout>
          </PublicRoute>
        }
      />

      {/* ✅ Admin Routes with Protection */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route
          index
          element={
            <PageTransition>
              <AdminDashboard />
            </PageTransition>
          }
        />
        <Route
          path="products"
          element={
            <PageTransition>
              <ProductManagement />
            </PageTransition>
          }
        />
        <Route
          path="products/create"
          element={
            <PageTransition>
              <ProductCreate />
            </PageTransition>
          }
        />
        <Route
          path="products/edit/:id"
          element={
            <PageTransition>
              <ProductCreate />
            </PageTransition>
          }
        />
        <Route
          path="orders"
          element={
            <PageTransition>
              <OrderManagement />
            </PageTransition>
          }
        />
        <Route
          path="blog"
          element={
            <PageTransition>
              <BlogManagement />
            </PageTransition>
          }
        />
        <Route
          path="blog/create"
          element={
            <PageTransition>
              <BlogCreate />
            </PageTransition>
          }
        />
        <Route
          path="blog/edit/:id"
          element={
            <PageTransition>
              <BlogCreate />
            </PageTransition>
          }
        />
        <Route
          path="blog/categories"
          element={
            <PageTransition>
              <BlogCategories />
            </PageTransition>
          }
        />
        <Route
          path="users"
          element={
            <PageTransition>
              <UserManagement />
            </PageTransition>
          }
        />
        <Route
          path="analytics"
          element={
            <PageTransition>
              <Analytics />
            </PageTransition>
          }
        />
        <Route
          path="reports"
          element={
            <PageTransition>
              <Reports />
            </PageTransition>
          }
        />
        <Route
          path="settings"
          element={
            <PageTransition>
              <Settings />
            </PageTransition>
          }
        />
      </Route>

      {/* 404 Route */}
      <Route
        path="*"
        element={
          <ConditionalLayout>
            <PageTransition>
              <NotFound />
            </PageTransition>
          </ConditionalLayout>
        }
      />
    </Routes>
  );
};

// ✅ Main App Component
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
