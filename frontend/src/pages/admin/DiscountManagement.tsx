import React, { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { isAdmin } from "@/lib/auth";
import {
  getAllDiscounts,
  toggleDiscountStatus,
  deleteDiscount,
  getDiscountStats,
  formatPrice,
  formatDiscountValue,
} from "@/lib/discounts";
import { Discount } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  ArrowLeft,
  RefreshCw,
  TrendingUp,
  DollarSign,
  BarChart3,
  CheckCircle,
  Clock,
  AlertTriangle,
  Sparkles,
  Target,
  Zap,
  Gift,
  Percent,
  Calendar,
  Users,
  Activity,
  XCircle,
  Info,
  ChevronLeft,
  ChevronRight,
  Settings,
  Download,
  Share2,
  Copy,
  Tag,
  CreditCard,
} from "lucide-react";

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

const DiscountManagement: React.FC = () => {
  const { user } = useAuth();
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "percent" | "fixed">(
    "all",
  );
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "expired" | "inactive"
  >("all");
  const [sortBy, setSortBy] = useState<
    "name" | "code" | "value" | "usage" | "date"
  >("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    expired: 0,
    totalUsage: 0,
    totalSavings: 0,
    avgDiscountValue: 0,
  });
  const [toasts, setToasts] = useState<
    Array<{
      id: string;
      type: "success" | "error" | "info";
      title: string;
      description?: string;
    }>
  >([]);

  // **📄 Pagination State**
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  if (!user || !isAdmin(user)) {
    return <Navigate to="/" replace />;
  }

  // **🎯 Toast System**
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [discountsData, statsData] = await Promise.all([
          getAllDiscounts(),
          getDiscountStats(),
        ]);
        setDiscounts(discountsData);
        setStats(statsData);
        showToast(
          "success",
          "✅ Đã tải mã giảm giá",
          `Tải thành công ${discountsData.length} mã giảm giá.`,
        );
      } catch (error) {
        showToast(
          "error",
          "❌ Lỗi tải dữ liệu",
          "Không thể tải danh sách mã giảm giá.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // **🔍 Filtered Discounts**
  const filteredDiscounts = discounts
    .filter((discount) => {
      const matchesSearch =
        discount.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        discount.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        discount.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = typeFilter === "all" || discount.type === typeFilter;

      const now = new Date();
      const startDate = new Date(discount.start_date);
      const endDate = new Date(discount.end_date);

      const matchesStatus = (() => {
        if (statusFilter === "all") return true;
        if (statusFilter === "active")
          return discount.is_active && startDate <= now && endDate >= now;
        if (statusFilter === "expired") return endDate < now;
        if (statusFilter === "inactive") return !discount.is_active;
        return true;
      })();

      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "code":
          comparison = a.code.localeCompare(b.code);
          break;
        case "value":
          comparison = a.value - b.value;
          break;
        case "usage":
          comparison = a.used_count - b.used_count;
          break;
        case "date":
          comparison =
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

  // **📄 Pagination Logic**
  const totalPages = Math.max(
    1,
    Math.ceil(filteredDiscounts.length / PER_PAGE),
  );
  const pagedDiscounts = filteredDiscounts.slice(
    (page - 1) * PER_PAGE,
    page * PER_PAGE,
  );

  // **🔄 Reset page when filters change**
  useEffect(() => {
    setPage(1);
  }, [searchQuery, typeFilter, statusFilter, sortBy, sortOrder]);

  const handleToggleStatus = async (
    discountId: string,
    currentStatus: boolean,
  ) => {
    const success = await toggleDiscountStatus(discountId, !currentStatus);

    if (success) {
      setDiscounts((prev) =>
        prev.map((discount) =>
          discount.id === discountId
            ? { ...discount, is_active: !discount.is_active }
            : discount,
        ),
      );

      showToast(
        "success",
        "✅ Cập nhật thành công",
        `Mã giảm giá đã được ${!currentStatus ? "kích hoạt" : "vô hiệu hóa"}.`,
      );
    } else {
      showToast(
        "error",
        "❌ Cập nhật thất bại",
        "Có lỗi xảy ra khi cập nhật trạng thái mã giảm giá.",
      );
    }
  };

  const handleDeleteDiscount = async (discountId: string) => {
    const success = await deleteDiscount(discountId);
    if (success) {
      setDiscounts((prev) =>
        prev.filter((discount) => discount.id !== discountId),
      );
      showToast(
        "success",
        "🗑️ Đã xóa mã giảm giá",
        "Mã giảm giá đã được xóa khỏi hệ thống.",
      );
    } else {
      showToast(
        "error",
        "❌ Xóa thất bại",
        "Có lỗi xảy ra khi xóa mã giảm giá.",
      );
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const [discountsData, statsData] = await Promise.all([
        getAllDiscounts(),
        getDiscountStats(),
      ]);
      setDiscounts(discountsData);
      setStats(statsData);
      showToast(
        "success",
        "🔄 Đã cập nhật",
        "Danh sách mã giảm giá đã được làm mới.",
      );
    } catch (error) {
      showToast(
        "error",
        "❌ Lỗi cập nhật",
        "Không thể cập nhật danh sách mã giảm giá.",
      );
    } finally {
      setRefreshing(false);
    }
  };

  // **📊 Enhanced Stats Cards**
  const statsCards = [
    {
      title: "Tổng mã giảm giá",
      value: stats.total,
      icon: Gift,
      gradient: "from-orange-400 via-amber-500 to-yellow-600",
      bgGradient: "from-orange-50/80 via-amber-50/80 to-yellow-50/80",
      description: "Tất cả mã",
      trend: "+12%",
    },
    {
      title: "Đang hoạt động",
      value: stats.active,
      icon: CheckCircle,
      gradient: "from-emerald-400 via-green-500 to-teal-600",
      bgGradient: "from-emerald-50/80 via-green-50/80 to-teal-50/80",
      description: "Còn hiệu lực",
      trend: "+8%",
    },
    {
      title: "Đã hết hạn",
      value: stats.expired,
      icon: Clock,
      gradient: "from-pink-400 via-rose-500 to-red-600",
      bgGradient: "from-pink-50/80 via-rose-50/80 to-red-50/80",
      description: "Hết hạn",
      trend: "+5%",
    },
    {
      title: "Lượt sử dụng",
      value: stats.totalUsage,
      icon: Activity,
      gradient: "from-purple-400 via-violet-500 to-indigo-600",
      bgGradient: "from-purple-50/80 via-violet-50/80 to-indigo-50/80",
      description: "Tổng sử dụng",
      trend: "+25%",
    },
    {
      title: "Tổng tiết kiệm",
      value: formatPrice(stats.totalSavings),
      icon: DollarSign,
      gradient: "from-emerald-400 via-green-500 to-teal-600",
      bgGradient: "from-emerald-50/80 via-green-50/80 to-teal-50/80",
      description: "Khách tiết kiệm",
      trend: "+18%",
    },
    {
      title: "Giảm TB/mã",
      value: formatPrice(stats.avgDiscountValue),
      icon: Percent,
      gradient: "from-blue-400 via-sky-500 to-cyan-600",
      bgGradient: "from-blue-50/80 via-sky-50/80 to-cyan-50/80",
      description: "Giá trị TB",
      trend: "+3%",
    },
  ];

  const firstRow = statsCards.slice(0, 3);
  const secondRow = statsCards.slice(3);

  // Helper function to get discount status
  const getDiscountStatus = (discount: Discount) => {
    const now = new Date();
    const startDate = new Date(discount.start_date);
    const endDate = new Date(discount.end_date);

    if (!discount.is_active)
      return { text: "Vô hiệu hóa", color: "red", icon: XCircle };
    if (now < startDate)
      return { text: "Chờ kích hoạt", color: "yellow", icon: Clock };
    if (now > endDate)
      return { text: "Hết hạn", color: "red", icon: AlertTriangle };
    if (discount.max_uses && discount.used_count >= discount.max_uses)
      return { text: "Hết lượt", color: "red", icon: AlertTriangle };

    return { text: "Đang hoạt động", color: "green", icon: CheckCircle };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-pink-50">
      {/* **🌟 Enhanced Floating Elements** */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4"
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Gift className="w-8 h-8 text-orange-400 opacity-20" />
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
          <Percent className="w-6 h-6 text-pink-400 opacity-20" />
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
          <Tag className="text-amber-400 w-7 h-7 opacity-20" />
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
          <CreditCard className="w-5 h-5 text-pink-300 opacity-20" />
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
                <Gift className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-orange-600 via-amber-600 to-pink-600 bg-clip-text">
                  Quản lý mã giảm giá
                </h1>
                <p className="text-orange-700/80 mt-1 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Tạo và quản lý các chiến dịch khuyến mại</span>
                </p>
              </div>
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
                <Link to="/admin/discounts/create">
                  <Plus className="w-4 h-4 mr-2" />
                  <span className="font-semibold">Tạo mã giảm giá</span>
                  <Sparkles className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* ✅ Enhanced Stats Cards Grid - ROW 1 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-3"
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
                        {typeof stat.value === "string"
                          ? stat.value
                          : stat.value.toLocaleString()}
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
                  <div className="flex items-center text-xs text-emerald-600">
                    <div className="p-1 rounded-full mr-1 bg-emerald-100">
                      <TrendingUp className="w-2 h-2" />
                    </div>
                    <span className="font-semibold">{stat.trend}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* ✅ Enhanced Stats Cards Grid - ROW 2 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-3"
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
                        {typeof stat.value === "string"
                          ? stat.value
                          : stat.value.toLocaleString()}
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
                  <div className="flex items-center text-xs text-emerald-600">
                    <div className="p-1 rounded-full mr-1 bg-emerald-100">
                      <TrendingUp className="w-2 h-2" />
                    </div>
                    <span className="font-semibold">{stat.trend}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* ✅ Enhanced Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <Card className="border-0 shadow-xl bg-gradient-to-r from-white/95 via-orange-50/80 to-pink-50/80 backdrop-blur-xl rounded-3xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-600 shadow-lg">
                    <Filter className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-transparent bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text font-bold">
                      Bộ lọc và tìm kiếm
                    </CardTitle>
                    <p className="text-sm text-orange-700/80 mt-1">
                      Tìm kiếm và lọc mã giảm giá theo nhiều tiêu chí
                    </p>
                  </div>
                </div>
                <Badge className="bg-gradient-to-r from-orange-200 to-pink-200 text-orange-800 border-0 shadow-sm">
                  <Target className="w-3 h-3 mr-1" />
                  {filteredDiscounts.length} kết quả
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* **🔍 Enhanced Search Bar** */}
                <motion.div className="relative" whileFocus={{ scale: 1.01 }}>
                  <div className="relative flex items-center space-x-3 p-4 bg-gradient-to-r from-white/90 to-orange-50/90 backdrop-blur-xl border border-orange-200/50 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <Search className="flex-shrink-0 w-5 h-5 text-orange-600 group-hover:text-orange-800 transition-colors" />
                    <Input
                      placeholder="Tìm kiếm mã giảm giá theo tên, mã code, mô tả..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 text-sm bg-transparent border-none outline-none placeholder:text-orange-500/60 text-orange-800 font-medium"
                    />
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="p-2 rounded-full bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-md"
                    >
                      <Zap className="w-4 h-4" />
                    </motion.div>
                  </div>
                </motion.div>

                {/* **🎛️ Enhanced Filter Controls** */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <motion.div whileFocus={{ scale: 1.01 }}>
                    <label className="text-sm font-semibold text-orange-800 mb-2 block">
                      Loại giảm giá
                    </label>
                    <Select
                      value={typeFilter}
                      onValueChange={(value: any) => setTypeFilter(value)}
                    >
                      <SelectTrigger className="h-12 bg-white/80 border-orange-200/50 rounded-2xl shadow-md">
                        <SelectValue placeholder="Chọn loại" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          <div className="flex items-center">
                            <Gift className="w-4 h-4 mr-2" />
                            Tất cả loại
                          </div>
                        </SelectItem>
                        <SelectItem value="percent">
                          <div className="flex items-center">
                            <Percent className="w-4 h-4 mr-2" />
                            Giảm theo %
                          </div>
                        </SelectItem>
                        <SelectItem value="fixed">
                          <div className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-2" />
                            Giảm cố định
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>

                  <motion.div whileFocus={{ scale: 1.01 }}>
                    <label className="text-sm font-semibold text-orange-800 mb-2 block">
                      Trạng thái
                    </label>
                    <Select
                      value={statusFilter}
                      onValueChange={(value: any) => setStatusFilter(value)}
                    >
                      <SelectTrigger className="h-12 bg-white/80 border-orange-200/50 rounded-2xl shadow-md">
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          <div className="flex items-center">
                            <Activity className="w-4 h-4 mr-2" />
                            Tất cả trạng thái
                          </div>
                        </SelectItem>
                        <SelectItem value="active">
                          <div className="flex items-center">
                            <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                            Đang hoạt động
                          </div>
                        </SelectItem>
                        <SelectItem value="expired">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2 text-red-600" />
                            Đã hết hạn
                          </div>
                        </SelectItem>
                        <SelectItem value="inactive">
                          <div className="flex items-center">
                            <XCircle className="w-4 h-4 mr-2 text-red-600" />
                            Vô hiệu hóa
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>

                  <motion.div whileFocus={{ scale: 1.01 }}>
                    <label className="text-sm font-semibold text-orange-800 mb-2 block">
                      Sắp xếp theo
                    </label>
                    <Select
                      value={sortBy}
                      onValueChange={(value: any) => setSortBy(value)}
                    >
                      <SelectTrigger className="h-12 bg-white/80 border-orange-200/50 rounded-2xl shadow-md">
                        <SelectValue placeholder="Sắp xếp" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="date">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            Ngày tạo
                          </div>
                        </SelectItem>
                        <SelectItem value="name">
                          <div className="flex items-center">
                            <Tag className="w-4 h-4 mr-2" />
                            Tên mã
                          </div>
                        </SelectItem>
                        <SelectItem value="code">
                          <div className="flex items-center">
                            <Gift className="w-4 h-4 mr-2" />
                            Mã code
                          </div>
                        </SelectItem>
                        <SelectItem value="value">
                          <div className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-2" />
                            Giá trị giảm
                          </div>
                        </SelectItem>
                        <SelectItem value="usage">
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-2" />
                            Lượt sử dụng
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>

                  <motion.div whileFocus={{ scale: 1.01 }}>
                    <label className="text-sm font-semibold text-orange-800 mb-2 block">
                      Thứ tự
                    </label>
                    <div className="flex bg-white/80 rounded-2xl p-1 shadow-md h-12">
                      <Button
                        variant={sortOrder === "desc" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setSortOrder("desc")}
                        className={`flex-1 rounded-xl transition-all ${
                          sortOrder === "desc"
                            ? "bg-gradient-to-r from-orange-500 to-pink-600 text-white"
                            : "text-orange-700 hover:text-orange-900"
                        }`}
                      >
                        <TrendingUp className="w-4 h-4 mr-1 rotate-180" />
                        Giảm dần
                      </Button>
                      <Button
                        variant={sortOrder === "asc" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setSortOrder("asc")}
                        className={`flex-1 rounded-xl transition-all ${
                          sortOrder === "asc"
                            ? "bg-gradient-to-r from-orange-500 to-pink-600 text-white"
                            : "text-orange-700 hover:text-orange-900"
                        }`}
                      >
                        <TrendingUp className="w-4 h-4 mr-1" />
                        Tăng dần
                      </Button>
                    </div>
                  </motion.div>
                </div>

                {/* **🎯 Quick Filter Badges** */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-orange-100 transition-colors"
                    onClick={() => {
                      setTypeFilter("percent");
                      setStatusFilter("active");
                    }}
                  >
                    📊 Mã % đang hoạt động
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-orange-100 transition-colors"
                    onClick={() => {
                      setTypeFilter("fixed");
                      setStatusFilter("active");
                    }}
                  >
                    💰 Mã giảm cố định
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-orange-100 transition-colors"
                    onClick={() => {
                      setStatusFilter("expired");
                      setSortBy("date");
                    }}
                  >
                    ⏰ Mã hết hạn
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-orange-100 transition-colors"
                    onClick={() => {
                      setSortBy("usage");
                      setSortOrder("desc");
                    }}
                  >
                    🔥 Nhiều lượt dùng
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-orange-100 transition-colors"
                    onClick={() => {
                      setSearchQuery("");
                      setTypeFilter("all");
                      setStatusFilter("all");
                      setSortBy("date");
                      setSortOrder("desc");
                    }}
                  >
                    🔄 Reset tất cả
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ✅ Enhanced Discounts Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white/95 via-orange-50/80 to-pink-50/80 backdrop-blur-xl rounded-3xl overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-transparent bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text font-bold">
                      Danh sách mã giảm giá
                    </CardTitle>
                    <p className="text-sm text-green-700/80 mt-1 flex items-center space-x-2">
                      <Gift className="w-4 h-4" />
                      <span>
                        {filteredDiscounts.length} mã giảm giá được tìm thấy
                        (Trang {page}/{totalPages})
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className="bg-gradient-to-r from-green-200 to-emerald-200 text-green-800 border-0 shadow-sm">
                    <Activity className="w-3 h-3 mr-1" />
                    {pagedDiscounts.length} hiển thị
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-white/80 hover:bg-white border-green-200/50 rounded-2xl shadow-md"
                      >
                        <Settings className="w-4 h-4 mr-1" />
                        Tùy chọn
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Download className="w-4 h-4 mr-2" />
                        Xuất Excel
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share2 className="w-4 h-4 mr-2" />
                        Chia sẻ
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="w-4 h-4 mr-2" />
                        Sao chép link
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                  <span className="ml-2 text-orange-700">Đang tải...</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-muted/50 border-orange-200/30">
                        <TableHead className="font-semibold text-orange-800">
                          Mã giảm giá
                        </TableHead>
                        <TableHead className="font-semibold text-orange-800">
                          Loại & Giá trị
                        </TableHead>
                        <TableHead className="font-semibold text-orange-800">
                          Điều kiện
                        </TableHead>
                        <TableHead className="font-semibold text-orange-800">
                          Sử dụng
                        </TableHead>
                        <TableHead className="font-semibold text-orange-800">
                          Thời hạn
                        </TableHead>
                        <TableHead className="font-semibold text-orange-800">
                          Trạng thái
                        </TableHead>
                        <TableHead className="font-semibold text-orange-800 text-right">
                          Thao tác
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <AnimatePresence>
                        {pagedDiscounts.map((discount, index) => {
                          const status = getDiscountStatus(discount);
                          return (
                            <motion.tr
                              key={discount.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              transition={{ delay: index * 0.05 }}
                              whileHover={{
                                backgroundColor: "rgba(255,245,235,0.5)",
                              }}
                              className="transition-all duration-300 group hover:shadow-md border-orange-200/20"
                            >
                              <TableCell>
                                <div className="space-y-1">
                                  <div className="font-semibold transition-colors group-hover:text-orange-700 text-orange-900 flex items-center space-x-2">
                                    <Tag className="w-4 h-4" />
                                    <span>{discount.name}</span>
                                  </div>
                                  <div className="text-sm text-orange-600/80">
                                    <span className="font-mono bg-orange-100 px-2 py-1 rounded-lg">
                                      {discount.code}
                                    </span>
                                  </div>
                                  {discount.description && (
                                    <div className="text-xs text-orange-600/70">
                                      {discount.description}
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <Badge
                                    variant="outline"
                                    className={`transition-all duration-300 group-hover:scale-105 ${
                                      discount.type === "percent"
                                        ? "bg-blue-100 text-blue-800 border-blue-300"
                                        : "bg-purple-100 text-purple-800 border-purple-300"
                                    }`}
                                  >
                                    {discount.type === "percent" ? (
                                      <>
                                        <Percent className="w-3 h-3 mr-1" />
                                        {discount.value}%
                                      </>
                                    ) : (
                                      <>
                                        <DollarSign className="w-3 h-3 mr-1" />
                                        {formatPrice(discount.value)}
                                      </>
                                    )}
                                  </Badge>
                                  {discount.max_discount_amount &&
                                    discount.type === "percent" && (
                                      <div className="text-xs text-orange-600/70">
                                        Tối đa:{" "}
                                        {formatPrice(
                                          discount.max_discount_amount,
                                        )}
                                      </div>
                                    )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm text-orange-700">
                                  {discount.min_order_amount > 0 && (
                                    <div>
                                      Tối thiểu:{" "}
                                      {formatPrice(discount.min_order_amount)}
                                    </div>
                                  )}
                                  {discount.applicable_to !== "all" && (
                                    <div className="text-xs text-orange-600/70 capitalize">
                                      Áp dụng: {discount.applicable_to}
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <div className="font-semibold text-orange-800">
                                    {discount.used_count}/
                                    {discount.max_uses || "∞"}
                                  </div>
                                  <div className="text-xs text-orange-600/70">
                                    {discount.max_uses_per_user} lần/user
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <div className="text-sm text-orange-700">
                                    {new Date(
                                      discount.start_date,
                                    ).toLocaleDateString("vi-VN")}
                                  </div>
                                  <div className="text-sm text-orange-700">
                                    →{" "}
                                    {new Date(
                                      discount.end_date,
                                    ).toLocaleDateString("vi-VN")}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={`transition-all duration-300 group-hover:scale-105 border-0 shadow-sm ${
                                    status.color === "green"
                                      ? "bg-gradient-to-r from-green-200 to-emerald-200 text-green-800"
                                      : status.color === "yellow"
                                        ? "bg-gradient-to-r from-yellow-200 to-amber-200 text-yellow-800"
                                        : "bg-gradient-to-r from-red-200 to-pink-200 text-red-800"
                                  }`}
                                >
                                  <status.icon className="w-3 h-3 mr-1" />
                                  {status.text}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <motion.div
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                    >
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="group/btn bg-white/60 hover:bg-white/80 rounded-2xl shadow-md"
                                      >
                                        <MoreHorizontal className="w-4 h-4 transition-colors group-hover/btn:text-orange-600" />
                                      </Button>
                                    </motion.div>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent
                                    align="end"
                                    className="w-48"
                                  >
                                    <DropdownMenuItem asChild>
                                      <Link
                                        to={`/admin/discounts/${discount.id}`}
                                        className="cursor-pointer"
                                      >
                                        <Eye className="w-4 h-4 mr-2" />
                                        Xem chi tiết
                                      </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                      <Link
                                        to={`/admin/discounts/edit/${discount.id}`}
                                        className="cursor-pointer"
                                      >
                                        <Edit className="w-4 h-4 mr-2" />
                                        Chỉnh sửa
                                      </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleToggleStatus(
                                          discount.id,
                                          discount.is_active,
                                        )
                                      }
                                      className="cursor-pointer"
                                    >
                                      {discount.is_active ? (
                                        <>
                                          <XCircle className="w-4 h-4 mr-2" />
                                          Vô hiệu hóa
                                        </>
                                      ) : (
                                        <>
                                          <CheckCircle className="w-4 h-4 mr-2" />
                                          Kích hoạt
                                        </>
                                      )}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleDeleteDiscount(discount.id)
                                      }
                                      className="text-red-600 cursor-pointer focus:text-red-600"
                                    >
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Xóa
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </motion.tr>
                          );
                        })}
                      </AnimatePresence>
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* **📄 Enhanced Pagination** */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-8 gap-2">
                  <Button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    variant="outline"
                    className="bg-white/80 hover:bg-white border-orange-200/50 hover:border-orange-300 rounded-2xl shadow-md"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    <span className="text-orange-800 font-semibold">Trước</span>
                  </Button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        variant={page === pageNum ? "default" : "outline"}
                        className={`w-10 h-10 rounded-2xl transition-all ${
                          page === pageNum
                            ? "bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-lg"
                            : "bg-white/80 hover:bg-white border-orange-200/50 hover:border-orange-300 text-orange-700 hover:text-orange-900"
                        }`}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}

                  <Button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    variant="outline"
                    className="bg-white/80 hover:bg-white border-orange-200/50 hover:border-orange-300 rounded-2xl shadow-md"
                  >
                    <span className="text-orange-800 font-semibold">Tiếp</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )}

              {/* ✅ Enhanced Empty State */}
              {filteredDiscounts.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-16 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="mb-6"
                  >
                    <div className="relative">
                      <Gift className="w-20 h-20 mx-auto text-orange-400/50" />
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "reverse",
                        }}
                        className="absolute -top-2 -right-2"
                      >
                        <Percent className="w-8 h-8 text-amber-500" />
                      </motion.div>
                    </div>
                  </motion.div>
                  <h3 className="mb-4 text-2xl font-bold text-transparent bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text">
                    Không tìm thấy mã giảm giá
                  </h3>
                  <p className="max-w-md mx-auto mb-6 text-orange-700/80 leading-relaxed">
                    Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm để tìm thấy mã
                    giảm giá phù hợp.
                  </p>
                  <div className="space-y-4">
                    <div className="flex justify-center space-x-3">
                      <Button
                        onClick={() => {
                          setSearchQuery("");
                          setTypeFilter("all");
                          setStatusFilter("all");
                          setSortBy("date");
                          setSortOrder("desc");
                        }}
                        variant="outline"
                        className="bg-white/80 hover:bg-white border-orange-200/50 hover:border-orange-300 rounded-2xl shadow-md"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        <span className="text-orange-800 font-semibold">
                          Xóa bộ lọc
                        </span>
                      </Button>
                      <Button
                        asChild
                        className="bg-gradient-to-r from-orange-500 via-amber-500 to-pink-600 hover:from-orange-600 hover:via-amber-600 hover:to-pink-700 rounded-2xl shadow-lg"
                      >
                        <Link to="/admin/discounts/create">
                          <Plus className="w-4 h-4 mr-2" />
                          <span className="font-semibold">
                            Tạo mã giảm giá mới
                          </span>
                          <Sparkles className="w-4 h-4 ml-1" />
                        </Link>
                      </Button>
                    </div>
                    <div className="flex justify-center flex-wrap gap-2">
                      <Badge
                        variant="outline"
                        className="cursor-pointer hover:bg-orange-100 transition-colors"
                        onClick={() => setSearchQuery("SALE")}
                      >
                        💡 Thử tìm "SALE"
                      </Badge>
                      <Badge
                        variant="outline"
                        className="cursor-pointer hover:bg-orange-100 transition-colors"
                        onClick={() => setSearchQuery("WELCOME")}
                      >
                        🔥 Hoặc "WELCOME"
                      </Badge>
                      <Badge
                        variant="outline"
                        className="cursor-pointer hover:bg-orange-100 transition-colors"
                        onClick={() => setSearchQuery("VIP")}
                      >
                        ⚡ Hoặc "VIP"
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default DiscountManagement;
