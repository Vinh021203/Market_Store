import React, { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { isAdmin } from "@/lib/auth";
import { formatPrice } from "@/lib/products";
import {
  getAnalyticsData,
  exportAnalyticsReport,
  AnalyticsData,
} from "@/lib/analytics";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Download,
  Eye,
  Calendar,
  Loader2,
  RefreshCw,
  ArrowLeft,
  BarChart3,
  Coffee,
  Code,
  Palette,
  Sparkles,
  Target,
  XCircle,
  Info,
  CheckCircle,
  Heart,
  ChevronLeft,
  ChevronRight,
  Search,
  ListIcon,
  Star,
  Gift,
} from "lucide-react";

// Enhanced Toast Component
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

const Analytics: React.FC = () => {
  // ✅ ALL HOOKS AT TOP LEVEL - NEVER MOVE THESE
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState("30d");
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
  const [toasts, setToasts] = useState<
    Array<{
      id: string;
      type: "success" | "error" | "info";
      title: string;
      description?: string;
    }>
  >([]);
  const [viewMode, setViewMode] = useState<"chart" | "table">("chart");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "value" | "name">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  // ✅ TOAST FUNCTIONS
  const showToast = (
    type: "success" | "error" | "info",
    title: string,
    description?: string,
  ) => {
    const id = Date.now().toString();
    const newToast = { id, type, title, description };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // ✅ EFFECTS AT TOP LEVEL
  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const data = await getAnalyticsData(timeRange);
        setAnalyticsData(data);
        showToast(
          "success",
          "✅ Đã tải thống kê",
          `Dữ liệu thống kê ${timeRange} đã được cập nhật.`,
        );
      } catch (error) {
        console.error("Error fetching analytics:", error);
        showToast(
          "error",
          "❌ Lỗi tải dữ liệu",
          "Không thể tải dữ liệu thống kê",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();

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
  }, [timeRange]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  // ✅ EVENT HANDLERS
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await getAnalyticsData(timeRange);
      setAnalyticsData(data);
      showToast(
        "success",
        "🔄 Đã cập nhật",
        "Dữ liệu thống kê đã được cập nhật",
      );
    } catch (error) {
      showToast("error", "❌ Lỗi cập nhật", "Không thể cập nhật dữ liệu");
    } finally {
      setRefreshing(false);
    }
  };

  const handleExportReport = async () => {
    setExporting(true);
    try {
      const success = await exportAnalyticsReport(timeRange);
      if (success) {
        showToast(
          "success",
          "✅ Xuất Excel thành công",
          "File báo cáo Excel đã được tải xuống",
        );
      } else {
        throw new Error("Export failed");
      }
    } catch (error) {
      showToast("error", "❌ Lỗi xuất báo cáo", "Không thể xuất báo cáo Excel");
    } finally {
      setExporting(false);
    }
  };

  // ✅ GUARD CLAUSES - NO HOOKS AFTER THIS POINT
  if (!user || !isAdmin(user)) {
    return <Navigate to="/" replace />;
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-pink-50">
        {/* Floating Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-1/4"
            animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <BarChart3 className="w-8 h-8 text-orange-400 opacity-20" />
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
            <TrendingUp className="w-6 h-6 text-pink-400 opacity-20" />
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
        </div>

        <div className="container relative z-10 px-4 py-8 mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center min-h-screen"
          >
            <Card className="py-12 text-center border-0 shadow-2xl bg-gradient-to-br from-white/95 to-orange-50/80 backdrop-blur-xl rounded-3xl">
              <CardContent>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 mx-auto mb-4 border-4 rounded-full border-orange-500 border-t-transparent"
                />
                <h2 className="mb-2 text-xl font-semibold text-orange-800">
                  Đang tải thống kê...
                </h2>
                <p className="text-orange-600/80">
                  Vui lòng đợi trong giây lát
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-pink-50">
        <div className="container relative z-10 px-4 py-8 mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center min-h-screen"
          >
            <Card className="py-12 text-center border-0 shadow-2xl bg-gradient-to-br from-white/95 to-red-50/80 backdrop-blur-xl rounded-3xl">
              <CardContent>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <BarChart3 className="w-16 h-16 mx-auto mb-4 text-red-500" />
                </motion.div>
                <h2 className="mb-4 text-2xl font-bold text-red-800">
                  Không thể tải dữ liệu
                </h2>
                <p className="mb-6 text-red-600/80">
                  Có lỗi xảy ra khi tải dữ liệu thống kê
                </p>
                <Button
                  onClick={handleRefresh}
                  className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 rounded-2xl shadow-lg"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  <span className="font-semibold">Thử lại</span>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  // ✅ DATA CALCULATIONS (after guard clauses)
  const viewsCount = analyticsData.dailyVisitors
    ? analyticsData.dailyVisitors.reduce((t, d) => t + (d.pageViews || 0), 0)
    : 125430;

  // Enhanced KPI cards based on analytics data
  const kpiCards = [
    {
      title: "Tổng doanh thu",
      value: formatPrice(analyticsData.kpiData.totalRevenue),
      change: `${analyticsData.kpiData.revenueGrowth > 0 ? "+" : ""}${analyticsData.kpiData.revenueGrowth.toFixed(1)}%`,
      trend: analyticsData.kpiData.revenueGrowth >= 0 ? "up" : "down",
      icon: DollarSign,
      gradient: "from-green-400 via-emerald-500 to-teal-600",
      bgGradient: "from-green-50/80 via-emerald-50/80 to-teal-50/80",
      description: "Tổng thu nhập",
    },
    {
      title: "Đơn hàng",
      value: analyticsData.kpiData.totalOrders.toString(),
      change: `${analyticsData.kpiData.ordersGrowth > 0 ? "+" : ""}${analyticsData.kpiData.ordersGrowth.toFixed(1)}%`,
      trend: analyticsData.kpiData.ordersGrowth >= 0 ? "up" : "down",
      icon: ShoppingCart,
      gradient: "from-orange-400 via-amber-500 to-yellow-600",
      bgGradient: "from-orange-50/80 via-amber-50/80 to-yellow-50/80",
      description: "Đặt hàng thành công",
    },
    {
      title: "Khách hàng mới",
      value: analyticsData.kpiData.newCustomers.toString(),
      change: `${analyticsData.kpiData.customersGrowth > 0 ? "+" : ""}${analyticsData.kpiData.customersGrowth.toFixed(1)}%`,
      trend: analyticsData.kpiData.customersGrowth >= 0 ? "up" : "down",
      icon: Users,
      gradient: "from-purple-400 via-violet-500 to-indigo-600",
      bgGradient: "from-purple-50/80 via-violet-50/80 to-indigo-50/80",
      description: "Đăng ký mới",
    },
    {
      title: "Lượt tải",
      value: analyticsData.kpiData.totalDownloads.toLocaleString(),
      change: `${analyticsData.kpiData.downloadsGrowth > 0 ? "+" : ""}${analyticsData.kpiData.downloadsGrowth.toFixed(1)}%`,
      trend: analyticsData.kpiData.downloadsGrowth >= 0 ? "up" : "down",
      icon: Download,
      gradient: "from-pink-400 via-rose-500 to-red-600",
      bgGradient: "from-pink-50/80 via-rose-50/80 to-red-50/80",
      description: "Download thành công",
    },
    {
      title: "Lượt xem",
      value: viewsCount.toLocaleString(),
      change: "+18%",
      trend: "up" as const,
      icon: Eye,
      gradient: "from-blue-400 via-sky-500 to-cyan-600",
      bgGradient: "from-blue-50/80 via-sky-50/80 to-cyan-50/80",
      description: "Page views",
    },
    {
      title: "Đánh giá TB",
      value: "4.8",
      change: "+0.3",
      trend: "up" as const,
      icon: Star,
      gradient: "from-amber-400 via-orange-500 to-red-600",
      bgGradient: "from-amber-50/80 via-orange-50/80 to-red-50/80",
      description: "Rating trung bình",
    },
  ];

  // Chia stats cards thành 2 hàng
  const firstRow = kpiCards.slice(0, 4);
  const secondRow = kpiCards.slice(4);

  const tabsConfig = [
    {
      id: "overview",
      label: "Tổng quan",
      icon: BarChart3,
      color: "from-orange-500 to-amber-500",
    },
    {
      id: "revenue",
      label: "Doanh thu",
      icon: DollarSign,
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "users",
      label: "Người dùng",
      icon: Users,
      color: "from-purple-500 to-violet-500",
    },
    {
      id: "products",
      label: "Sản phẩm",
      icon: Package,
      color: "from-pink-500 to-red-500",
    },
  ];

  // Filtered data for pagination
  const filteredData = analyticsData.topProducts.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredData.length / PER_PAGE));
  const pagedData = filteredData.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-pink-50">
      {/* Enhanced Floating Elements */}
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
        <motion.div
          className="absolute bottom-1/6 right-1/5"
          animate={{ y: [0, -16, 0], scale: [1, 1.2, 1] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2.5,
          }}
        >
          <Gift className="w-6 h-6 text-purple-300 opacity-20" />
        </motion.div>
      </div>

      {/* Toast Container */}
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
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8 p-6 bg-gradient-to-r from-white/90 via-orange-50/90 to-pink-50/90 backdrop-blur-xl border border-orange-200/50 rounded-3xl shadow-lg"
          id="header"
          data-animate
        >
          <div className="flex items-center space-x-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="group bg-white/60 hover:bg-white/80 rounded-2xl shadow-md"
              >
                <Link to="/admin">
                  <ArrowLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1 text-orange-600" />
                  <span className="font-semibold text-orange-800">
                    Về Dashboard
                  </span>
                </Link>
              </Button>
            </motion.div>
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="flex items-center justify-center w-16 h-16 shadow-xl rounded-3xl bg-gradient-to-r from-orange-500 via-amber-500 to-pink-600"
              >
                <BarChart3 className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-orange-600 via-amber-600 to-pink-600 bg-clip-text">
                  Thống kê & Phân tích
                </h1>
                <p className="text-orange-700/80 mt-1 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <span>
                    Theo dõi hiệu suất kinh doanh và xu hướng người dùng
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            {/* Enhanced View Toggle */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex bg-white/60 rounded-2xl p-1 shadow-md"
            >
              <Button
                variant={viewMode === "chart" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("chart")}
                className={`rounded-xl transition-all ${
                  viewMode === "chart"
                    ? "bg-gradient-to-r from-orange-500 to-pink-600 text-white"
                    : "text-orange-700 hover:text-orange-900"
                }`}
              >
                <BarChart3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className={`rounded-xl transition-all ${
                  viewMode === "table"
                    ? "bg-gradient-to-r from-orange-500 to-pink-600 text-white"
                    : "text-orange-700 hover:text-orange-900"
                }`}
              >
                <ListIcon className="w-4 h-4" />
              </Button>
            </motion.div>

            <motion.div whileFocus={{ scale: 1.01 }}>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-40 h-12 bg-white/80 border-orange-200/50 rounded-2xl shadow-md">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>7 ngày qua</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="30d">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>30 ngày qua</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="90d">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>3 tháng qua</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="1y">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>1 năm qua</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </motion.div>

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
                variant="outline"
                onClick={handleExportReport}
                disabled={exporting}
                className="group bg-white/80 hover:bg-white border-orange-200/50 hover:border-orange-300 rounded-2xl shadow-md hover:shadow-lg"
              >
                {exporting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2 transition-transform group-hover:scale-110 text-orange-600" />
                )}
                <span className="text-orange-800 font-semibold">
                  Xuất Excel
                </span>
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Enhanced Stats Cards Grid - ROW 1 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-4 mb-4 md:grid-cols-4"
          id="stats1"
          data-animate
        >
          {firstRow.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -8, scale: 1.03 }}
              className="transition-all duration-500"
            >
              <Card
                className={`relative overflow-hidden border-0 bg-gradient-to-br ${stat.bgGradient} backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 group rounded-3xl`}
                style={{ minHeight: 140 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50" />
                <CardContent className="relative pt-4 pb-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="text-2xl font-bold text-orange-900 mb-1"
                      >
                        {stat.value}
                      </motion.div>
                      <div className="text-xs font-semibold text-orange-800/90 mb-1">
                        {stat.title}
                      </div>
                      <div className="text-xs text-orange-700/70">
                        {stat.description}
                      </div>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.15, rotate: 10 }}
                      className={`w-10 h-10 rounded-2xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 flex-shrink-0`}
                    >
                      <stat.icon className="w-5 h-5 text-white" />
                    </motion.div>
                  </div>
                  <div
                    className={`flex items-center text-xs ${
                      stat.trend === "up" ? "text-emerald-600" : "text-red-600"
                    }`}
                  >
                    <div
                      className={`p-1 rounded-full mr-1 ${
                        stat.trend === "up" ? "bg-emerald-100" : "bg-red-100"
                      }`}
                    >
                      {stat.trend === "up" ? (
                        <TrendingUp className="w-2 h-2" />
                      ) : (
                        <TrendingUp className="w-2 h-2 rotate-180" />
                      )}
                    </div>
                    <span className="font-semibold">{stat.change}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Stats Cards Grid - ROW 2 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className="grid grid-cols-2 gap-4 mb-8 md:grid-cols-2"
          id="stats2"
          data-animate
        >
          {secondRow.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + index * 0.1 }}
              whileHover={{ y: -8, scale: 1.03 }}
              className="transition-all duration-500"
            >
              <Card
                className={`relative overflow-hidden border-0 bg-gradient-to-br ${stat.bgGradient} backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 group rounded-3xl`}
                style={{ minHeight: 140 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50" />
                <CardContent className="relative pt-4 pb-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.45 + index * 0.1 }}
                        className="text-2xl font-bold text-orange-900 mb-1"
                      >
                        {stat.value}
                      </motion.div>
                      <div className="text-xs font-semibold text-orange-800/90 mb-1">
                        {stat.title}
                      </div>
                      <div className="text-xs text-orange-700/70">
                        {stat.description}
                      </div>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.15, rotate: 10 }}
                      className={`w-10 h-10 rounded-2xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 flex-shrink-0`}
                    >
                      <stat.icon className="w-5 h-5 text-white" />
                    </motion.div>
                  </div>
                  <div
                    className={`flex items-center text-xs ${
                      stat.trend === "up" ? "text-emerald-600" : "text-red-600"
                    }`}
                  >
                    <div
                      className={`p-1 rounded-full mr-1 ${
                        stat.trend === "up" ? "bg-emerald-100" : "bg-red-100"
                      }`}
                    >
                      {stat.trend === "up" ? (
                        <TrendingUp className="w-2 h-2" />
                      ) : (
                        <TrendingUp className="w-2 h-2 rotate-180" />
                      )}
                    </div>
                    <span className="font-semibold">{stat.change}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          id="tabs"
          data-animate
        >
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full h-[12vh] grid-cols-4 mb-8 p-2 bg-gradient-to-r from-white/80 via-orange-50/80 to-pink-50/80 backdrop-blur-xl border border-orange-200/50 rounded-3xl shadow-xl space-x-0">
              {tabsConfig.map((tab, index) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className={`
                    group
                    relative flex flex-col items-center justify-center
                    w-full h-full
                    py-4 px-0
                    font-semibold text-sm
                    bg-transparent rounded-2xl
                    transition-all duration-300
                    text-orange-700
                    hover:bg-white/60 hover:text-orange-900 hover:shadow-md
                    data-[state=active]:text-white
                    data-[state=active]:shadow-xl
                    outline-none
                  `}
                  style={{ minWidth: 0 }}
                >
                  <span className="flex items-center gap-2 z-10">
                    <tab.icon className="w-5 h-5 flex-shrink-0" />
                    <span className="hidden sm:inline font-bold tracking-wide">
                      {tab.label}
                    </span>
                  </span>
                  {/* Active indicator với z-index thấp nhất */}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="tab-active-bg"
                      className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-pink-600"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 35,
                      }}
                      style={{ zIndex: 1 }}
                    />
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            <AnimatePresence mode="wait">
              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <motion.div
                  key="overview-tab"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid gap-6 lg:grid-cols-2"
                >
                  {/* Revenue Chart */}
                  <Card className="border-0 shadow-xl bg-gradient-to-br from-white/95 via-orange-50/80 to-pink-50/80 backdrop-blur-xl rounded-3xl">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg">
                          <DollarSign className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <span className="text-2xl text-transparent bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text font-bold">
                            Doanh thu theo tháng
                          </span>
                          <p className="text-sm text-orange-700/80 mt-1">
                            Xu hướng doanh thu trong {timeRange}
                          </p>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={analyticsData.revenueData}>
                          <defs>
                            <linearGradient
                              id="revenueGradient"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#f97316"
                                stopOpacity={0.3}
                              />
                              <stop
                                offset="95%"
                                stopColor="#f97316"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            className="opacity-30"
                          />
                          <XAxis dataKey="month" />
                          <YAxis
                            tickFormatter={(value) => formatPrice(value)}
                          />
                          <Tooltip
                            formatter={(value) => [
                              formatPrice(Number(value)),
                              "Doanh thu",
                            ]}
                            labelStyle={{ color: "#000" }}
                          />
                          <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#f97316"
                            fillOpacity={1}
                            fill="url(#revenueGradient)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Orders vs Users Chart */}
                  <Card className="border-0 shadow-xl bg-gradient-to-br from-white/95 via-purple-50/80 to-pink-50/80 backdrop-blur-xl rounded-3xl">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <span className="text-2xl text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text font-bold">
                            Đơn hàng & Khách hàng mới
                          </span>
                          <p className="text-sm text-purple-700/80 mt-1">
                            So sánh xu hướng tăng trưởng
                          </p>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={analyticsData.revenueData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            className="opacity-30"
                          />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip labelStyle={{ color: "#000" }} />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="orders"
                            stroke="#8b5cf6"
                            strokeWidth={3}
                            name="Đơn hàng"
                          />
                          <Line
                            type="monotone"
                            dataKey="users"
                            stroke="#10b981"
                            strokeWidth={3}
                            name="Khách hàng mới"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Revenue Tab */}
              <TabsContent value="revenue" className="space-y-6">
                <motion.div
                  key="revenue-tab"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid gap-6 lg:grid-cols-3"
                >
                  {/* Category Distribution */}
                  <Card className="border-0 shadow-xl bg-gradient-to-br from-white/95 via-green-50/80 to-emerald-50/80 backdrop-blur-xl rounded-3xl">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg">
                          <Target className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <span className="text-2xl text-transparent bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text font-bold">
                            Phân bố danh mục
                          </span>
                          <p className="text-sm text-green-700/80 mt-1">
                            Tỷ lệ doanh thu theo danh mục
                          </p>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={analyticsData.categoryData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {analyticsData.categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value) => [`${value}%`, "Tỷ lệ"]}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Top Products */}
                  <Card className="border-0 shadow-xl lg:col-span-2 bg-gradient-to-br from-white/95 via-orange-50/80 to-pink-50/80 backdrop-blur-xl rounded-3xl">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 shadow-lg">
                            <Package className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <span className="text-2xl text-transparent bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text font-bold">
                              Sản phẩm bán chạy
                            </span>
                            <p className="text-sm text-orange-700/80 mt-1">
                              Top sản phẩm theo doanh thu
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-gradient-to-r from-orange-200 to-pink-200 text-orange-800 border-0 shadow-sm">
                          <Target className="w-3 h-3 mr-1" />
                          {pagedData.length} sản phẩm
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* Search Bar */}
                      <motion.div
                        className="relative mb-4"
                        whileFocus={{ scale: 1.01 }}
                      >
                        <div className="relative flex items-center space-x-3 p-3 bg-gradient-to-r from-white/90 to-orange-50/90 backdrop-blur-xl border border-orange-200/50 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 group">
                          <Search className="flex-shrink-0 w-4 h-4 text-orange-600 group-hover:text-orange-800 transition-colors" />
                          <Input
                            placeholder="Tìm kiếm sản phẩm..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 text-sm bg-transparent border-none outline-none placeholder:text-orange-500/60 text-orange-800 font-medium"
                          />
                        </div>
                      </motion.div>

                      <div className="space-y-4">
                        {pagedData.length > 0 ? (
                          pagedData.map((product, index) => (
                            <motion.div
                              key={product.name}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              whileHover={{ scale: 1.02, x: 4 }}
                              className="flex items-center justify-between p-4 transition-all duration-300 rounded-2xl bg-gradient-to-r from-white/80 to-orange-50/80 hover:shadow-md group border border-orange-200/30"
                            >
                              <div className="flex items-center space-x-3">
                                <motion.div
                                  whileHover={{ scale: 1.1 }}
                                  className={`flex items-center justify-center w-10 h-10 rounded-xl shadow-lg ${
                                    index === 0
                                      ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                                      : index === 1
                                        ? "bg-gradient-to-r from-gray-400 to-gray-500"
                                        : index === 2
                                          ? "bg-gradient-to-r from-orange-500 to-red-500"
                                          : "bg-gradient-to-r from-blue-500 to-purple-600"
                                  }`}
                                >
                                  <span className="text-sm font-bold text-white">
                                    #{(page - 1) * PER_PAGE + index + 1}
                                  </span>
                                </motion.div>
                                <div>
                                  <h4 className="font-semibold transition-colors group-hover:text-orange-700 text-orange-900">
                                    {product.name}
                                  </h4>
                                  <p className="text-sm text-orange-600/80">
                                    {product.sales} lượt bán
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-orange-800">
                                  {formatPrice(product.revenue)}
                                </div>
                                <div className="text-sm text-orange-600/80">
                                  Doanh thu
                                </div>
                              </div>
                            </motion.div>
                          ))
                        ) : (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="py-8 text-center text-orange-600/80"
                          >
                            <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>Không tìm thấy sản phẩm</p>
                          </motion.div>
                        )}
                      </div>

                      {/* Pagination for Products */}
                      {totalPages > 1 && (
                        <div className="flex justify-center items-center mt-6 gap-2">
                          <Button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            variant="outline"
                            className="bg-white/80 hover:bg-white border-orange-200/50 hover:border-orange-300 rounded-2xl shadow-md"
                          >
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            <span className="text-orange-800 font-semibold">
                              Trước
                            </span>
                          </Button>

                          {Array.from(
                            { length: Math.min(3, totalPages) },
                            (_, i) => {
                              let pageNum;
                              if (totalPages <= 3) {
                                pageNum = i + 1;
                              } else if (page <= 2) {
                                pageNum = i + 1;
                              } else if (page >= totalPages - 1) {
                                pageNum = totalPages - 2 + i;
                              } else {
                                pageNum = page - 1 + i;
                              }

                              return (
                                <Button
                                  key={pageNum}
                                  onClick={() => setPage(pageNum)}
                                  variant={
                                    page === pageNum ? "default" : "outline"
                                  }
                                  className={`w-10 h-10 rounded-2xl transition-all ${
                                    page === pageNum
                                      ? "bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-lg"
                                      : "bg-white/80 hover:bg-white border-orange-200/50 hover:border-orange-300 text-orange-700 hover:text-orange-900"
                                  }`}
                                >
                                  {pageNum}
                                </Button>
                              );
                            },
                          )}

                          <Button
                            onClick={() =>
                              setPage((p) => Math.min(totalPages, p + 1))
                            }
                            disabled={page === totalPages}
                            variant="outline"
                            className="bg-white/80 hover:bg-white border-orange-200/50 hover:border-orange-300 rounded-2xl shadow-md"
                          >
                            <span className="text-orange-800 font-semibold">
                              Sau
                            </span>
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Users Tab */}
              <TabsContent value="users" className="space-y-6">
                <motion.div
                  key="users-tab"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Visitors Chart */}
                  <Card className="border-0 shadow-xl bg-gradient-to-br from-white/95 via-purple-50/80 to-pink-50/80 backdrop-blur-xl rounded-3xl">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-500 to-violet-500 shadow-lg">
                          <Eye className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <span className="text-2xl text-transparent bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text font-bold">
                            Lượt truy cập hàng ngày
                          </span>
                          <p className="text-sm text-purple-700/80 mt-1">
                            Khách truy cập và lượt xem trang
                          </p>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={analyticsData.dailyVisitors}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            className="opacity-30"
                          />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip labelStyle={{ color: "#000" }} />
                          <Legend />
                          <Bar
                            dataKey="visitors"
                            fill="#8b5cf6"
                            name="Khách truy cập"
                            radius={[4, 4, 0, 0]}
                          />
                          <Bar
                            dataKey="pageViews"
                            fill="#ec4899"
                            name="Lượt xem trang"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Products Tab */}
              <TabsContent value="products" className="space-y-6">
                <motion.div
                  key="products-tab"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-0 shadow-xl bg-gradient-to-br from-white/95 via-orange-50/80 to-pink-50/80 backdrop-blur-xl rounded-3xl">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 shadow-lg">
                          <Package className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <span className="text-2xl text-transparent bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text font-bold">
                            Hiệu suất sản phẩm chi tiết
                          </span>
                          <p className="text-sm text-orange-700/80 mt-1">
                            Phân tích chi tiết từng sản phẩm
                          </p>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold text-orange-800">
                            Top Templates
                          </h4>
                          <div className="space-y-3">
                            {analyticsData.topProducts
                              .slice(
                                0,
                                Math.ceil(analyticsData.topProducts.length / 2),
                              )
                              .map((product, index) => (
                                <motion.div
                                  key={product.name}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="flex items-center justify-between p-3 rounded-2xl bg-blue-50/80 border border-blue-200/50"
                                >
                                  <div>
                                    <div className="font-semibold text-blue-900">
                                      {product.name}
                                    </div>
                                    <div className="text-sm text-blue-600/80">
                                      {product.sales} lượt bán
                                    </div>
                                  </div>
                                  <Badge className="text-blue-800 bg-blue-100 border-blue-300">
                                    {formatPrice(product.revenue)}
                                  </Badge>
                                </motion.div>
                              ))}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold text-orange-800">
                            Top E-books
                          </h4>
                          <div className="space-y-3">
                            {analyticsData.topProducts
                              .slice(
                                Math.ceil(analyticsData.topProducts.length / 2),
                              )
                              .map((product, index) => (
                                <motion.div
                                  key={product.name}
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="flex items-center justify-between p-3 rounded-2xl bg-green-50/80 border border-green-200/50"
                                >
                                  <div>
                                    <div className="font-semibold text-green-900">
                                      {product.name}
                                    </div>
                                    <div className="text-sm text-green-600/80">
                                      {product.sales} lượt bán
                                    </div>
                                  </div>
                                  <Badge className="text-green-800 bg-green-100 border-green-300">
                                    {formatPrice(product.revenue)}
                                  </Badge>
                                </motion.div>
                              ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;
