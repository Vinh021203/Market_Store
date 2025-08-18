import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { isAdmin } from "@/lib/auth";
import { formatPrice } from "@/lib/products";
import {
  getDashboardStats,
  getChartData,
  DashboardStats,
} from "@/lib/dashboard";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  BookOpen,
  Users,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  Download,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Calendar,
  Clock,
  Award,
  Zap,
  Target,
  BarChart3,
  Activity,
  Coffee,
  Code,
  Palette,
  AlertTriangle,
  Sparkles,
  Crown,
  Heart,
  Gift,
  CheckCircle,
  XCircle,
  Info,
} from "lucide-react";
import { Link } from "react-router-dom";

// **🎨 Enhanced Toast Component**
const FloatingToast = ({
  type = "success",
  title,
  description,
  visible = true,
  onClose,
}: {
  type?: "success" | "error" | "info";
  title: string;
  description?: string;
  visible?: boolean;
  onClose?: () => void;
}) => {
  const iconProps = "w-5 h-5 flex-shrink-0";
  let icon, colorScheme, bgGradient;

  switch (type) {
    case "error":
      icon = <XCircle className={`${iconProps} text-pink-600`} />;
      colorScheme = "text-pink-800";
      bgGradient = "from-pink-50/95 via-orange-50/95 to-white/95";
      break;
    case "info":
      icon = <Info className={`${iconProps} text-sky-600`} />;
      colorScheme = "text-sky-800";
      bgGradient = "from-sky-50/95 via-blue-50/95 to-white/95";
      break;
    default:
      icon = <CheckCircle className={`${iconProps} text-emerald-600`} />;
      colorScheme = "text-emerald-800";
      bgGradient = "from-emerald-50/95 via-green-50/95 to-white/95";
  }

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, x: 100 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.8, x: 100 }}
      className={`fixed top-6 right-6 z-50 max-w-sm min-w-[300px] p-4 rounded-3xl shadow-2xl backdrop-blur-xl border border-white/30 bg-gradient-to-r ${bgGradient}`}
    >
      <div className="flex items-start gap-3">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
          className="flex-shrink-0 p-2 rounded-2xl bg-white/60"
        >
          {icon}
        </motion.div>
        <div className="flex-1 min-w-0">
          <div className={`font-semibold text-sm ${colorScheme}`}>{title}</div>
          {description && (
            <div className="text-xs mt-1 text-orange-700/70 leading-relaxed">
              {description}
            </div>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 rounded-full hover:bg-white/60 transition-colors"
          >
            <XCircle className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

// **🎨 Enhanced Overview Card Component**
const OverviewCard = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  bgGradient,
  iconBg,
  index,
}: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.1 }}
      whileHover={{ y: -8, scale: 1.03 }}
      className="transition-all duration-500"
    >
      <Card
        className={`relative overflow-hidden border-0 bg-gradient-to-br ${bgGradient} backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 group`}
        style={{ minHeight: 160 }}
      >
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50" />

        <CardHeader className="relative flex flex-row items-start justify-between pb-2 space-y-0">
          <div className="flex-1">
            <CardTitle className="text-sm font-semibold text-orange-900/90 mb-3">
              {title}
            </CardTitle>
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="text-3xl font-bold text-orange-900 mb-2"
            >
              {value}
            </motion.div>
          </div>
          <motion.div
            whileHover={{ scale: 1.15, rotate: 10 }}
            className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${iconBg} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 flex-shrink-0`}
          >
            <Icon className="w-6 h-6 text-white" />
          </motion.div>
        </CardHeader>

        <CardContent className="relative pt-0">
          <div className="flex items-center text-xs text-orange-700/80">
            {trend === "up" ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center"
              >
                <div className="p-1 rounded-full bg-emerald-100 mr-2">
                  <ArrowUpRight className="w-3 h-3 text-emerald-600" />
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center"
              >
                <div className="p-1 rounded-full bg-red-100 mr-2">
                  <ArrowDownRight className="w-3 h-3 text-red-600" />
                </div>
              </motion.div>
            )}
            <span className="leading-relaxed">{description}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
  const [toasts, setToasts] = useState<
    Array<{
      id: string;
      type: "success" | "error" | "info";
      title: string;
      description?: string;
    }>
  >([]);

  if (!user || !isAdmin(user)) {
    return <Navigate to="/" replace />;
  }

  // **🎯 Enhanced Toast System**
  const showToast = (
    type: "success" | "error" | "info",
    title: string,
    description?: string,
  ) => {
    const id = Date.now().toString();
    const newToast = { id, type, title, description };
    setToasts((prev) => [...prev, newToast]);

    // Auto remove after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // ✅ Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const dashboardData = await getDashboardStats();
        setStats(dashboardData);
        showToast(
          "success",
          "✅ Đã tải dashboard",
          "Dữ liệu dashboard đã được cập nhật thành công.",
        );
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        showToast(
          "error",
          "❌ Lỗi tải dữ liệu",
          "Không thể tải dữ liệu dashboard",
        );
      }
    };

    fetchDashboardData();

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }));
          }
        });
      },
      { threshold: 0.1 },
    );

    const sections = document.querySelectorAll("[data-animate]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const dashboardData = await getDashboardStats();
      setStats(dashboardData);
      showToast(
        "success",
        "🔄 Đã cập nhật",
        "Dữ liệu dashboard đã được cập nhật",
      );
    } catch (error) {
      showToast("error", "❌ Lỗi cập nhật", "Không thể cập nhật dữ liệu");
    } finally {
      setRefreshing(false);
    }
  };

  // ✅ Error state
  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50  to-pink-50">
        {/* Floating Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-1/4"
            animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <Code className="w-8 h-8 text-orange-400 opacity-20" />
          </motion.div>
          <motion.div
            className="absolute top-1/3 right-1/4"
            animate={{ y: [0, -15, 0], rotate: [0, -10, 0] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          >
            <Palette className="w-6 h-6 text-pink-400 opacity-20" />
          </motion.div>
          <motion.div
            className="absolute bottom-1/4 left-1/3"
            animate={{ y: [0, -25, 0], rotate: [0, 15, 0] }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          >
            <Coffee className="text-amber-400 w-7 h-7 opacity-20" />
          </motion.div>
          <motion.div
            className="absolute top-2/3 right-1/3"
            animate={{ y: [0, -18, 0], scale: [1, 1.1, 1] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3,
            }}
          >
            <Heart className="w-5 h-5 text-pink-300 opacity-20" />
          </motion.div>
        </div>

        <div className="container relative z-10 px-4 py-8 mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center min-h-screen"
          >
            <Card className="py-12 text-center border-0 shadow-2xl bg-gradient-to-br from-white/95 via-orange-50/95 to-pink-50/95 backdrop-blur-xl rounded-3xl">
              <CardContent>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-orange-500" />
                </motion.div>
                <h2 className="mb-4 text-2xl font-bold text-transparent bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text">
                  Không thể tải dữ liệu
                </h2>
                <p className="mb-6 text-orange-700/80">
                  Có lỗi xảy ra khi tải dữ liệu dashboard
                </p>
                <Button
                  onClick={handleRefresh}
                  className="bg-gradient-to-r from-orange-500 via-amber-500 to-pink-600 hover:from-orange-600 hover:via-amber-600 hover:to-pink-700 shadow-lg hover:shadow-xl rounded-2xl"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Thử lại
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  // ✅ Enhanced overview cards
  const overviewCards = [
    {
      title: "Tổng doanh thu",
      value: formatPrice(stats.totalRevenue),
      description: `${stats.monthlyGrowth.revenue > 0 ? "+" : ""}${stats.monthlyGrowth.revenue.toFixed(1)}% so với tháng trước`,
      icon: DollarSign,
      trend: stats.monthlyGrowth.revenue >= 0 ? "up" : "down",
      bgGradient: "from-emerald-50/80 via-green-50/80 to-teal-50/80",
      iconBg: "from-emerald-500 to-teal-600",
    },
    {
      title: "Tổng đơn hàng",
      value: stats.totalOrders.toString(),
      description: `${stats.monthlyGrowth.orders > 0 ? "+" : ""}${stats.monthlyGrowth.orders.toFixed(1)}% so với tháng trước`,
      icon: ShoppingCart,
      trend: stats.monthlyGrowth.orders >= 0 ? "up" : "down",
      bgGradient: "from-blue-50/80 via-sky-50/80 to-cyan-50/80",
      iconBg: "from-blue-500 to-cyan-600",
    },
    {
      title: "Người dùng",
      value: stats.totalUsers.toString(),
      description: `${stats.monthlyGrowth.users > 0 ? "+" : ""}${stats.monthlyGrowth.users.toFixed(1)}% người dùng mới`,
      icon: Users,
      trend: stats.monthlyGrowth.users >= 0 ? "up" : "down",
      bgGradient: "from-purple-50/80 via-violet-50/80 to-indigo-50/80",
      iconBg: "from-purple-500 to-indigo-600",
    },
    {
      title: "Tổng sản phẩm",
      value: stats.totalProducts.toString(),
      description: `${stats.templates} templates, ${stats.ebooks} e-books`,
      icon: Package,
      trend: "up",
      bgGradient: "from-orange-50/80 via-amber-50/80 to-yellow-50/80",
      iconBg: "from-orange-500 to-yellow-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-pink-50">
      {/* **🌟 Enhanced Floating Elements** */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4"
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Code className="w-8 h-8 text-orange-400 opacity-20" />
        </motion.div>
        <motion.div
          className="absolute top-1/3 right-1/4"
          animate={{ y: [0, -15, 0], rotate: [0, -10, 0] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          <Palette className="w-6 h-6 text-pink-400 opacity-20" />
        </motion.div>
        <motion.div
          className="absolute bottom-1/4 left-1/3"
          animate={{ y: [0, -25, 0], rotate: [0, 15, 0] }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        >
          <Coffee className="text-amber-400 w-7 h-7 opacity-20" />
        </motion.div>
        <motion.div
          className="absolute top-2/3 right-1/3"
          animate={{ y: [0, -18, 0], scale: [1, 1.1, 1] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
        >
          <Heart className="w-5 h-5 text-pink-300 opacity-20" />
        </motion.div>
        <motion.div
          className="absolute top-1/6 right-1/6"
          animate={{ y: [0, -12, 0], rotate: [0, -5, 0] }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
        >
          <Sparkles className="w-4 h-4 text-yellow-400 opacity-20" />
        </motion.div>
      </div>

      {/* **🎨 Toast Container** */}
      <div className="fixed top-0 right-0 z-50 p-4 space-y-3">
        <AnimatePresence>
          {toasts.map((toast) => (
            <FloatingToast
              key={toast.id}
              type={toast.type}
              title={toast.title}
              description={toast.description}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      <div className="container relative z-10 px-4 py-8 mx-auto">
        {/* ✅ Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8 p-6 bg-gradient-to-r from-white/90 via-orange-50/90 to-pink-50/90 backdrop-blur-xl border border-orange-200/50 rounded-3xl shadow-lg"
          id="header"
          data-animate
        >
          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="flex items-center justify-center w-16 h-16 shadow-xl rounded-3xl bg-gradient-to-r from-orange-500 via-amber-500 to-pink-600"
            >
              <BarChart3 className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-orange-600 via-amber-600 to-pink-600 bg-clip-text">
                Dashboard Quản trị
              </h1>
              <p className="flex items-center space-x-2 text-orange-700/80 mt-2">
                <span>
                  Chào mừng trở lại,{" "}
                  <span className="font-semibold">{user.name}</span>
                </span>
                <motion.span
                  animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                  transition={{
                    duration: 1,
                    delay: 0.5,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                  className="inline-block ml-1"
                >
                  👋
                </motion.span>
                <Badge className="text-orange-800 bg-gradient-to-r from-yellow-200 to-amber-300 border-0 shadow-sm">
                  <Crown className="w-3 h-3 mr-1" />
                  Admin
                </Badge>
              </p>
            </div>
          </div>

          <div className="flex space-x-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={refreshing}
                className="transition-all duration-300 group bg-white/80 hover:bg-white border-orange-200/50 hover:border-orange-300 rounded-2xl shadow-md hover:shadow-lg"
              >
                {refreshing ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                  </motion.div>
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2 group-hover:animate-spin text-orange-600" />
                )}
                <span className="text-orange-800 font-semibold">Làm mới</span>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                asChild
                className="transition-all duration-300 shadow-lg bg-gradient-to-r from-orange-500 via-amber-500 to-pink-600 hover:from-orange-600 hover:via-amber-600 hover:to-pink-700 hover:shadow-xl rounded-2xl"
              >
                <Link to="/admin/products">
                  <Package className="w-4 h-4 mr-2" />
                  <span className="font-semibold">Quản lý sản phẩm</span>
                  <Sparkles className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* ✅ Enhanced Overview Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4"
          id="overview"
          data-animate
        >
          {overviewCards.map((card, index) => (
            <OverviewCard key={index} {...card} index={index} />
          ))}
        </motion.div>

        {/* Rest of the components remain the same but with enhanced styling */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* ✅ Enhanced Recent Orders */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
            id="orders"
            data-animate
          >
            <Card className="transition-all duration-300 border-0 shadow-xl bg-gradient-to-br from-white/95 via-blue-50/80 to-cyan-50/80 hover:shadow-2xl backdrop-blur-sm rounded-3xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-600 shadow-lg">
                    <ShoppingCart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text font-bold">
                      Đơn hàng gần đây
                    </CardTitle>
                    <p className="text-sm text-blue-700/80 mt-1">
                      {stats.recentOrders.length} đơn hàng mới nhất
                    </p>
                  </div>
                </div>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="group bg-white/80 hover:bg-white border-blue-200/50 hover:border-blue-300 rounded-2xl shadow-md"
                  >
                    <Link to="/admin/orders">
                      <span className="text-blue-800 font-semibold">
                        Xem tất cả
                      </span>
                      <ArrowUpRight className="w-3 h-3 ml-1 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 text-blue-600" />
                    </Link>
                  </Button>
                </motion.div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <AnimatePresence>
                    {stats.recentOrders.length > 0 ? (
                      stats.recentOrders.map((order, index) => (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                          whileHover={{ scale: 1.01, x: 4 }}
                          className="flex items-center justify-between p-4 transition-all duration-300 border border-blue-200/50 rounded-2xl hover:bg-blue-50/50 hover:shadow-md group bg-white/50 backdrop-blur-sm"
                        >
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2 font-semibold text-blue-900">
                              <span>#{order.id.slice(0, 8)}</span>
                              <Badge
                                variant="outline"
                                className="text-xs bg-green-100 text-green-800 border-green-300"
                              >
                                <Clock className="w-3 h-3 mr-1" />
                                Mới
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-blue-700/80">
                              <Calendar className="w-3 h-3" />
                              <span>
                                {new Date(order.created_at).toLocaleDateString(
                                  "vi-VN",
                                )}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-blue-800">
                              <Package className="w-3 h-3 text-blue-600" />
                              <span>
                                {order.order_items?.length || 0} sản phẩm
                              </span>
                            </div>
                          </div>
                          <div className="space-y-2 text-right">
                            <div className="text-xl font-bold text-blue-900">
                              {formatPrice(order.total_price || 0)}
                            </div>
                            <Badge
                              variant={
                                order.status === "completed"
                                  ? "default"
                                  : order.status === "processing"
                                    ? "secondary"
                                    : order.status === "pending"
                                      ? "outline"
                                      : "destructive"
                              }
                              className="transition-all duration-300 group-hover:scale-105"
                            >
                              {order.status === "completed"
                                ? "Hoàn thành"
                                : order.status === "processing"
                                  ? "Đang xử lý"
                                  : order.status === "pending"
                                    ? "Chờ xử lý"
                                    : "Đã hủy"}
                            </Badge>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="py-8 text-center text-blue-700/70"
                      >
                        <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Chưa có đơn hàng nào</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* ✅ Enhanced Quick Stats & Top Products */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-6"
            id="stats"
            data-animate
          >
            {/* Quick Stats */}
            <Card className="transition-all duration-300 border-0 shadow-xl bg-gradient-to-br from-white/95 via-emerald-50/80 to-green-50/80 hover:shadow-2xl backdrop-blur-sm rounded-3xl">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 shadow-lg">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-transparent bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text font-bold">
                      Thống kê nhanh
                    </CardTitle>
                    <p className="text-sm text-emerald-700/80 mt-1">
                      Dữ liệu tổng quan
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    icon: Download,
                    label: "Tổng downloads",
                    value: stats.totalDownloads.toLocaleString(),
                    color: "text-blue-600",
                    bg: "bg-blue-100",
                  },
                  {
                    icon: Star,
                    label: "Đánh giá trung bình",
                    value: `${stats.avgRating}/5`,
                    color: "text-amber-600",
                    bg: "bg-amber-100",
                  },
                  {
                    icon: Package,
                    label: "Templates",
                    value: stats.templates.toString(),
                    color: "text-purple-600",
                    bg: "bg-purple-100",
                  },
                  {
                    icon: BookOpen,
                    label: "E-books",
                    value: stats.ebooks.toString(),
                    color: "text-emerald-600",
                    bg: "bg-emerald-100",
                  },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 4 }}
                    className="flex items-center justify-between p-4 transition-all duration-300 rounded-2xl hover:bg-emerald-50/50 group bg-white/50 backdrop-blur-sm border border-emerald-200/30"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}
                      >
                        <stat.icon
                          className={`w-5 h-5 ${stat.color} group-hover:scale-110 transition-transform duration-300`}
                        />
                      </div>
                      <span className="text-sm font-semibold text-emerald-900">
                        {stat.label}
                      </span>
                    </div>
                    <span className="font-bold text-emerald-800 text-lg">
                      {stat.value}
                    </span>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Top Products */}
            <Card className="transition-all duration-300 border-0 shadow-xl bg-gradient-to-br from-white/95 via-purple-50/80 to-pink-50/80 hover:shadow-2xl backdrop-blur-sm rounded-3xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600 shadow-lg">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text font-bold">
                      Sản phẩm hàng đầu
                    </CardTitle>
                    <p className="text-sm text-purple-700/80 mt-1">
                      Top {stats.topProducts.length} sản phẩm
                    </p>
                  </div>
                </div>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="group bg-white/80 hover:bg-white border-purple-200/50 hover:border-purple-300 rounded-2xl shadow-md"
                  >
                    <Link to="/admin/products">
                      <span className="text-purple-800 font-semibold">
                        Quản lý
                      </span>
                      <ArrowUpRight className="w-3 h-3 ml-1 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 text-purple-600" />
                    </Link>
                  </Button>
                </motion.div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <AnimatePresence>
                    {stats.topProducts.length > 0 ? (
                      stats.topProducts.map((product, index) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 + index * 0.1 }}
                          whileHover={{ scale: 1.02, x: 4 }}
                          className="flex items-center p-4 space-x-3 transition-all duration-300 rounded-2xl hover:bg-purple-50/50 group bg-white/50 backdrop-blur-sm border border-purple-200/30"
                        >
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className={`flex items-center justify-center w-10 h-10 text-sm font-bold rounded-2xl shadow-md ${
                              index === 0
                                ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-white"
                                : index === 1
                                  ? "bg-gradient-to-r from-gray-400 to-slate-500 text-white"
                                  : index === 2
                                    ? "bg-gradient-to-r from-orange-400 to-red-500 text-white"
                                    : "bg-gradient-to-r from-purple-400 to-pink-500 text-white"
                            }`}
                          >
                            {index + 1}
                          </motion.div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold truncate transition-colors group-hover:text-purple-800 text-purple-900">
                              {product.title}
                            </div>
                            <div className="flex items-center space-x-2 text-xs text-purple-700/80">
                              <Star className="w-3 h-3 text-amber-500" />
                              <span>{product.review_count || 0} đánh giá</span>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className={`text-xs transition-all duration-300 group-hover:scale-105 ${
                              product.category === "template"
                                ? "bg-blue-100 text-blue-800 border-blue-300"
                                : "bg-emerald-100 text-emerald-800 border-emerald-300"
                            }`}
                          >
                            {product.category === "template"
                              ? "Template"
                              : "E-book"}
                          </Badge>
                        </motion.div>
                      ))
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="py-4 text-sm text-center text-purple-700/70"
                      >
                        <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>Chưa có sản phẩm nào</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* ✅ Enhanced Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
          id="actions"
          data-animate
        >
          <div className="flex items-center mb-6 space-x-4 p-6 bg-gradient-to-r from-white/90 via-orange-50/90 to-pink-50/90 backdrop-blur-xl border border-orange-200/50 rounded-3xl shadow-lg">
            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-600 shadow-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-transparent bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text">
                Thao tác nhanh
              </h2>
              <p className="text-sm text-orange-700/80 mt-1">
                Các tác vụ quản trị thường dùng
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Quản lý sản phẩm",
                description: "Thêm, sửa, xóa sản phẩm",
                icon: Package,
                href: "/admin/products",
                gradient: "from-blue-500 to-cyan-600",
                bgGradient: "from-blue-50/80 to-cyan-50/80",
              },
              {
                title: "Quản lý đơn hàng",
                description: "Xem và xử lý đơn hàng",
                icon: ShoppingCart,
                href: "/admin/orders",
                gradient: "from-emerald-500 to-green-600",
                bgGradient: "from-emerald-50/80 to-green-50/80",
              },
              {
                title: "Quản lý người dùng",
                description: "Xem danh sách người dùng",
                icon: Users,
                href: "/admin/users",
                gradient: "from-purple-500 to-pink-600",
                bgGradient: "from-purple-50/80 to-pink-50/80",
              },
              {
                title: "Quản lý Blog",
                description: "Viết và quản lý bài viết",
                icon: BookOpen,
                href: "/admin/blog",
                gradient: "from-orange-500 to-amber-600",
                bgGradient: "from-orange-50/80 to-amber-50/80",
              },
            ].map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`transition-all duration-500 ${
                  isVisible.actions
                    ? "animate-in slide-in-from-bottom"
                    : "opacity-0"
                }`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <Card
                  className={`transition-all duration-300 hover:shadow-2xl cursor-pointer group border-0 bg-gradient-to-br ${action.bgGradient} backdrop-blur-sm shadow-lg rounded-3xl overflow-hidden`}
                >
                  <Link to={action.href}>
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-4">
                        <motion.div
                          whileHover={{ scale: 1.15, rotate: 10 }}
                          className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${action.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}
                        >
                          <action.icon className="w-7 h-7 text-white" />
                        </motion.div>
                        <div className="flex-1">
                          <h3 className="mb-2 text-lg font-bold transition-colors group-hover:text-orange-800 text-orange-900">
                            {action.title}
                          </h3>
                          <p className="text-sm text-orange-700/80">
                            {action.description}
                          </p>
                        </div>
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          whileHover={{ opacity: 1, x: 0 }}
                          className="transition-all duration-300 opacity-0 group-hover:opacity-100"
                        >
                          <ArrowUpRight className="w-6 h-6 text-orange-600" />
                        </motion.div>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
