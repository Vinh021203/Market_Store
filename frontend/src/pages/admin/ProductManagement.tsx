import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
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
  formatPrice,
  getAllProducts,
  updateProductStatus,
} from "@/lib/products";
import { Product } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Download,
  BookOpen,
  Package,
  ArrowLeft,
  RefreshCw,
  Star,
  TrendingUp,
  Users,
  DollarSign,
  BarChart3,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Coffee,
  Code,
  Palette,
  Sparkles,
  Target,
  Zap,
  Heart,
  Gift,
  Flame,
  Award,
  Crown,
  ChevronRight,
  GridIcon,
  ListIcon,
  SortAsc,
  SortDesc,
  Share2,
  Copy,
  Settings,
  Maximize2,
  XCircle,
  Info,
  ChevronLeft,
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

const ProductManagement: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<
    "all" | "template" | "ebook"
  >("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [sortBy, setSortBy] = useState<"name" | "price" | "rating" | "date">(
    "date",
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
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

  // **🎯 Enhanced Toast System**
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
        const data = await getAllProducts();
        setProducts(data);
        showToast(
          "success",
          "✅ Đã tải sản phẩm",
          `Tải thành công ${data.length} sản phẩm.`,
        );
      } catch (error) {
        showToast(
          "error",
          "❌ Lỗi tải dữ liệu",
          "Không thể tải danh sách sản phẩm.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();

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

  // **🔍 Filtered Products**
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase()),
        );

      const matchesCategory =
        categoryFilter === "all" || product.category === categoryFilter;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && product.isActive) ||
        (statusFilter === "inactive" && !product.isActive);

      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case "name":
          comparison = a.title.localeCompare(b.title);
          break;
        case "price":
          comparison = a.price - b.price;
          break;
        case "rating":
          comparison = a.rating - b.rating;
          break;
        case "date":
          comparison =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

  // **📄 Pagination Logic**
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PER_PAGE));
  const pagedProducts = filteredProducts.slice(
    (page - 1) * PER_PAGE,
    page * PER_PAGE,
  );

  // **🔄 Auto scroll to products section when page changes**
  useEffect(() => {
    if (typeof window !== "undefined") {
      const tableSection = document.getElementById("products");
      tableSection?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [page]);

  // **🔄 Reset page when filters change**
  useEffect(() => {
    setPage(1);
  }, [searchQuery, categoryFilter, statusFilter, sortBy, sortOrder]);

  const handleToggleStatus = async (
    productId: string,
    currentStatus: boolean,
  ) => {
    const success = await updateProductStatus(productId, !currentStatus);

    if (success) {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === productId
            ? { ...product, isActive: !product.isActive }
            : product,
        ),
      );

      showToast(
        "success",
        "✅ Cập nhật thành công",
        `Sản phẩm đã được ${!currentStatus ? "kích hoạt" : "vô hiệu hóa"}.`,
      );
    } else {
      showToast(
        "error",
        "❌ Cập nhật thất bại",
        "Có lỗi xảy ra khi cập nhật trạng thái sản phẩm.",
      );
    }
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== productId));
    showToast(
      "success",
      "🗑️ Đã xóa sản phẩm",
      "Sản phẩm đã được xóa khỏi hệ thống.",
    );
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await getAllProducts();
      setProducts(data);
      showToast(
        "success",
        "🔄 Đã cập nhật",
        "Danh sách sản phẩm đã được làm mới.",
      );
    } catch (error) {
      showToast(
        "error",
        "❌ Lỗi cập nhật",
        "Không thể cập nhật danh sách sản phẩm.",
      );
    } finally {
      setRefreshing(false);
    }
  };

  const stats = {
    total: products.length,
    active: products.filter((p) => p.isActive).length,
    inactive: products.filter((p) => !p.isActive).length,
    templates: products.filter((p) => p.category === "template").length,
    ebooks: products.filter((p) => p.category === "ebook").length,
    totalRevenue: products.reduce((sum, p) => sum + p.price, 0),
    avgRating:
      products.reduce((sum, p) => sum + p.rating, 0) / products.length || 0,
  };

  // **🎨 Enhanced Stats Cards với gradient mới**
  const statsCards = [
    {
      title: "Tổng sản phẩm",
      value: stats.total,
      icon: Package,
      gradient: "from-orange-400 via-amber-500 to-yellow-600",
      bgGradient: "from-orange-50/80 via-amber-50/80 to-yellow-50/80",
      description: "Tất cả sản phẩm",
      trend: "+12%",
      color: "orange",
    },
    {
      title: "Hoạt động",
      value: stats.active,
      icon: CheckCircle,
      gradient: "from-emerald-400 via-green-500 to-teal-600",
      bgGradient: "from-emerald-50/80 via-green-50/80 to-teal-50/80",
      description: "Đang bán",
      trend: "+8%",
      color: "green",
    },
    {
      title: "Ngừng hoạt động",
      value: stats.inactive,
      icon: AlertTriangle,
      gradient: "from-pink-400 via-rose-500 to-red-600",
      bgGradient: "from-pink-50/80 via-rose-50/80 to-red-50/80",
      description: "Tạm ngừng",
      trend: "-2%",
      color: "red",
    },
    {
      title: "Templates",
      value: stats.templates,
      icon: Code,
      gradient: "from-purple-400 via-violet-500 to-indigo-600",
      bgGradient: "from-purple-50/80 via-violet-50/80 to-indigo-50/80",
      description: "Mẫu thiết kế",
      trend: "+15%",
      color: "purple",
    },
    {
      title: "E-books",
      value: stats.ebooks,
      icon: BookOpen,
      gradient: "from-blue-400 via-sky-500 to-cyan-600",
      bgGradient: "from-blue-50/80 via-sky-50/80 to-cyan-50/80",
      description: "Sách điện tử",
      trend: "+5%",
      color: "blue",
    },
    {
      title: "Doanh thu",
      value: formatPrice(stats.totalRevenue),
      icon: DollarSign,
      gradient: "from-emerald-400 via-green-500 to-teal-600",
      bgGradient: "from-emerald-50/80 via-green-50/80 to-teal-50/80",
      description: "Tổng giá trị",
      trend: "+23%",
      color: "emerald",
    },
    {
      title: "Đánh giá TB",
      value: stats.avgRating.toFixed(1),
      icon: Star,
      gradient: "from-amber-400 via-orange-500 to-red-600",
      bgGradient: "from-amber-50/80 via-orange-50/80 to-red-50/80",
      description: "Rating trung bình",
      trend: "+0.2",
      color: "amber",
    },
  ];

  // **📊 Chia stats cards thành 2 hàng**
  const firstRow = statsCards.slice(0, 4);
  const secondRow = statsCards.slice(4);

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
        {/* ✅ Enhanced Header với gradient cam hồng */}
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
                <Package className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-orange-600 via-amber-600 to-pink-600 bg-clip-text">
                  Quản lý sản phẩm
                </h1>
                <p className="text-orange-700/80 mt-1 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Quản lý templates và e-books của bạn</span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            {/* **🎯 Enhanced View Toggle** */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex bg-white/60 rounded-2xl p-1 shadow-md"
            >
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={`rounded-xl transition-all ${
                  viewMode === "list"
                    ? "bg-gradient-to-r from-orange-500 to-pink-600 text-white"
                    : "text-orange-700 hover:text-orange-900"
                }`}
              >
                <ListIcon className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={`rounded-xl transition-all ${
                  viewMode === "grid"
                    ? "bg-gradient-to-r from-orange-500 to-pink-600 text-white"
                    : "text-orange-700 hover:text-orange-900"
                }`}
              >
                <GridIcon className="w-4 h-4" />
              </Button>
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
                asChild
                className="transition-all duration-300 shadow-lg bg-gradient-to-r from-orange-500 via-amber-500 to-pink-600 hover:from-orange-600 hover:via-amber-600 hover:to-pink-700 hover:shadow-xl rounded-2xl"
              >
                <Link to="/admin/products/create">
                  <Plus className="w-4 h-4 mr-2" />
                  <span className="font-semibold">Thêm sản phẩm</span>
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
                      stat.trend.startsWith("+")
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    <div
                      className={`p-1 rounded-full mr-1 ${
                        stat.trend.startsWith("+")
                          ? "bg-emerald-100"
                          : "bg-red-100"
                      }`}
                    >
                      {stat.trend.startsWith("+") ? (
                        <TrendingUp className="w-2 h-2" />
                      ) : (
                        <TrendingUp className="w-2 h-2 rotate-180" />
                      )}
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
          className="grid grid-cols-2 gap-4 mb-8 md:grid-cols-3"
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
                      stat.trend.startsWith("+")
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    <div
                      className={`p-1 rounded-full mr-1 ${
                        stat.trend.startsWith("+")
                          ? "bg-emerald-100"
                          : "bg-red-100"
                      }`}
                    >
                      {stat.trend.startsWith("+") ? (
                        <TrendingUp className="w-2 h-2" />
                      ) : (
                        <TrendingUp className="w-2 h-2 rotate-180" />
                      )}
                    </div>
                    <span className="font-semibold">{stat.trend}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* ✅ Enhanced Filters với nhiều tùy chọn mới */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
          id="filters"
          data-animate
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
                      Tìm kiếm và lọc sản phẩm theo nhiều tiêu chí
                    </p>
                  </div>
                </div>
                <Badge className="bg-gradient-to-r from-orange-200 to-pink-200 text-orange-800 border-0 shadow-sm">
                  <Target className="w-3 h-3 mr-1" />
                  {filteredProducts.length} kết quả
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* **🔍 Enhanced Search Bar** */}
                <motion.div className="relative" whileFocus={{ scale: 1.01 }}>
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-pink-400/20 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  <div className="relative flex items-center space-x-3 p-4 bg-gradient-to-r from-white/90 to-orange-50/90 backdrop-blur-xl border border-orange-200/50 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <Search className="flex-shrink-0 w-5 h-5 text-orange-600 group-hover:text-orange-800 transition-colors" />
                    <Input
                      placeholder="Tìm kiếm sản phẩm theo tên, mô tả, tags..."
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
                      Danh mục
                    </label>
                    <Select
                      value={categoryFilter}
                      onValueChange={(value: any) => setCategoryFilter(value)}
                    >
                      <SelectTrigger className="h-12 bg-white/80 border-orange-200/50 rounded-2xl shadow-md">
                        <SelectValue placeholder="Chọn danh mục" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          <div className="flex items-center">
                            <Package className="w-4 h-4 mr-2" />
                            Tất cả danh mục
                          </div>
                        </SelectItem>
                        <SelectItem value="template">
                          <div className="flex items-center">
                            <Code className="w-4 h-4 mr-2" />
                            Templates
                          </div>
                        </SelectItem>
                        <SelectItem value="ebook">
                          <div className="flex items-center">
                            <BookOpen className="w-4 h-4 mr-2" />
                            E-books
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
                            Hoạt động
                          </div>
                        </SelectItem>
                        <SelectItem value="inactive">
                          <div className="flex items-center">
                            <AlertTriangle className="w-4 h-4 mr-2 text-red-600" />
                            Ngừng hoạt động
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
                            <Clock className="w-4 h-4 mr-2" />
                            Ngày tạo
                          </div>
                        </SelectItem>
                        <SelectItem value="name">
                          <div className="flex items-center">
                            <Package className="w-4 h-4 mr-2" />
                            Tên sản phẩm
                          </div>
                        </SelectItem>
                        <SelectItem value="price">
                          <div className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-2" />
                            Giá bán
                          </div>
                        </SelectItem>
                        <SelectItem value="rating">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 mr-2" />
                            Đánh giá
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
                        <SortDesc className="w-4 h-4 mr-1" />
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
                        <SortAsc className="w-4 h-4 mr-1" />
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
                      setSearchQuery("React");
                      setCategoryFilter("template");
                    }}
                  >
                    🚀 React Templates
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-orange-100 transition-colors"
                    onClick={() => {
                      setSearchQuery("Dashboard");
                      setCategoryFilter("template");
                    }}
                  >
                    📊 Dashboard
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-orange-100 transition-colors"
                    onClick={() => {
                      setCategoryFilter("ebook");
                      setStatusFilter("active");
                    }}
                  >
                    📚 E-books mới
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-orange-100 transition-colors"
                    onClick={() => {
                      setSortBy("rating");
                      setSortOrder("desc");
                    }}
                  >
                    ⭐ Đánh giá cao
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-orange-100 transition-colors"
                    onClick={() => {
                      setSearchQuery("");
                      setCategoryFilter("all");
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

        {/* ✅ Enhanced Products Table/Grid với phân trang */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          id="products"
          data-animate
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
                      Danh sách sản phẩm
                    </CardTitle>
                    <p className="text-sm text-green-700/80 mt-1 flex items-center space-x-2">
                      <Flame className="w-4 h-4" />
                      <span>
                        {filteredProducts.length} sản phẩm được tìm thấy (Trang{" "}
                        {page}/{totalPages})
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className="bg-gradient-to-r from-green-200 to-emerald-200 text-green-800 border-0 shadow-sm">
                    <Activity className="w-3 h-3 mr-1" />
                    {pagedProducts.length} hiển thị
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
              {viewMode === "list" ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-muted/50 border-orange-200/30">
                        <TableHead className="font-semibold text-orange-800">
                          Sản phẩm
                        </TableHead>
                        <TableHead className="font-semibold text-orange-800">
                          Danh mục
                        </TableHead>
                        <TableHead className="font-semibold text-orange-800">
                          Giá
                        </TableHead>
                        <TableHead className="font-semibold text-orange-800">
                          Đánh giá
                        </TableHead>
                        <TableHead className="font-semibold text-orange-800">
                          Trạng thái
                        </TableHead>
                        <TableHead className="font-semibold text-orange-800">
                          Ngày tạo
                        </TableHead>
                        <TableHead className="font-semibold text-orange-800 text-right">
                          Thao tác
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <AnimatePresence>
                        {pagedProducts.map((product, index) => (
                          <motion.tr
                            key={product.id}
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
                              <div className="flex items-center space-x-3">
                                <motion.div
                                  whileHover={{ scale: 1.1 }}
                                  className="relative"
                                >
                                  <img
                                    src={product.image}
                                    alt={product.title}
                                    className="object-cover w-12 h-12 transition-transform duration-300 rounded-2xl shadow-md"
                                  />
                                  {product.isActive && (
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                                      <CheckCircle className="w-2 h-2 text-white" />
                                    </div>
                                  )}
                                </motion.div>
                                <div>
                                  <div className="font-semibold transition-colors group-hover:text-orange-700 text-orange-900">
                                    {product.title}
                                  </div>
                                  <div className="text-sm text-orange-600/80 flex items-center space-x-1">
                                    <Users className="w-3 h-3" />
                                    <span>{product.author}</span>
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={`transition-all duration-300 group-hover:scale-105 ${
                                  product.category === "template"
                                    ? "bg-blue-100 text-blue-800 border-blue-300"
                                    : "bg-purple-100 text-purple-800 border-purple-300"
                                }`}
                              >
                                {product.category === "template" ? (
                                  <>
                                    <Code className="w-3 h-3 mr-1" />
                                    Template
                                  </>
                                ) : (
                                  <>
                                    <BookOpen className="w-3 h-3 mr-1" />
                                    E-book
                                  </>
                                )}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-semibold text-orange-800">
                                  {formatPrice(product.price)}
                                </div>
                                {product.originalPrice && (
                                  <div className="text-sm line-through text-orange-600/60">
                                    {formatPrice(product.originalPrice)}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                <span className="font-semibold text-orange-800">
                                  {product.rating}
                                </span>
                                <span className="text-orange-600/70 text-sm">
                                  ({product.reviewCount})
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={`transition-all duration-300 group-hover:scale-105 border-0 shadow-sm ${
                                  product.isActive
                                    ? "bg-gradient-to-r from-green-200 to-emerald-200 text-green-800"
                                    : "bg-gradient-to-r from-red-200 to-pink-200 text-red-800"
                                }`}
                              >
                                {product.isActive ? (
                                  <>
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Hoạt động
                                  </>
                                ) : (
                                  <>
                                    <AlertTriangle className="w-3 h-3 mr-1" />
                                    Ngừng
                                  </>
                                )}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-1 text-sm text-orange-700/80">
                                <Clock className="w-3 h-3" />
                                <span>
                                  {new Date(
                                    product.createdAt,
                                  ).toLocaleDateString("vi-VN")}
                                </span>
                              </div>
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
                                      to={`/product/${product.id}`}
                                      className="cursor-pointer"
                                    >
                                      <Eye className="w-4 h-4 mr-2" />
                                      Xem chi tiết
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem asChild>
                                    <Link
                                      to={`/admin/products/edit/${product.id}`}
                                      className="cursor-pointer"
                                    >
                                      <Edit className="w-4 h-4 mr-2" />
                                      Chỉnh sửa
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleToggleStatus(
                                        product.id,
                                        product.isActive,
                                      )
                                    }
                                    className="cursor-pointer"
                                  >
                                    <Download className="w-4 h-4 mr-2" />
                                    {product.isActive
                                      ? "Vô hiệu hóa"
                                      : "Kích hoạt"}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleDeleteProduct(product.id)
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
                        ))}
                      </AnimatePresence>
                    </TableBody>
                  </Table>
                </div>
              ) : (
                // **🎨 Enhanced Grid View**
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  <AnimatePresence>
                    {pagedProducts.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ y: -8, scale: 1.02 }}
                        className="group"
                      >
                        <Card className="border-0 shadow-lg bg-gradient-to-br from-white/95 to-orange-50/80 hover:shadow-2xl transition-all duration-300 rounded-3xl overflow-hidden">
                          <div className="relative">
                            <img
                              src={product.image}
                              alt={product.title}
                              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute top-3 left-3">
                              <Badge
                                className={`${
                                  product.category === "template"
                                    ? "bg-blue-500 text-white"
                                    : "bg-purple-500 text-white"
                                } border-0 shadow-lg`}
                              >
                                {product.category === "template" ? (
                                  <>
                                    <Code className="w-3 h-3 mr-1" />
                                    Template
                                  </>
                                ) : (
                                  <>
                                    <BookOpen className="w-3 h-3 mr-1" />
                                    E-book
                                  </>
                                )}
                              </Badge>
                            </div>
                            <div className="absolute top-3 right-3">
                              <Badge
                                className={`${
                                  product.isActive
                                    ? "bg-green-500 text-white"
                                    : "bg-red-500 text-white"
                                } border-0 shadow-lg`}
                              >
                                {product.isActive ? (
                                  <CheckCircle className="w-3 h-3" />
                                ) : (
                                  <AlertTriangle className="w-3 h-3" />
                                )}
                              </Badge>
                            </div>
                            <div className="absolute bottom-3 right-3">
                              <div className="flex items-center space-x-1 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1">
                                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                <span className="text-white text-xs font-semibold">
                                  {product.rating}
                                </span>
                              </div>
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <div>
                                <h3 className="font-semibold text-orange-900 truncate group-hover:text-orange-700 transition-colors">
                                  {product.title}
                                </h3>
                                <p className="text-sm text-orange-600/80">
                                  {product.author}
                                </p>
                              </div>
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-bold text-orange-800">
                                    {formatPrice(product.price)}
                                  </div>
                                  {product.originalPrice && (
                                    <div className="text-xs line-through text-orange-600/60">
                                      {formatPrice(product.originalPrice)}
                                    </div>
                                  )}
                                </div>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="bg-white/60 hover:bg-white/80 rounded-2xl shadow-md"
                                    >
                                      <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                      <Link to={`/product/${product.id}`}>
                                        <Eye className="w-4 h-4 mr-2" />
                                        Xem chi tiết
                                      </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                      <Link
                                        to={`/admin/products/edit/${product.id}`}
                                      >
                                        <Edit className="w-4 h-4 mr-2" />
                                        Chỉnh sửa
                                      </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleToggleStatus(
                                          product.id,
                                          product.isActive,
                                        )
                                      }
                                    >
                                      <Download className="w-4 h-4 mr-2" />
                                      {product.isActive
                                        ? "Vô hiệu hóa"
                                        : "Kích hoạt"}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleDeleteProduct(product.id)
                                      }
                                      className="text-red-600"
                                    >
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Xóa
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
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

                  {/* Page numbers */}
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
              {filteredProducts.length === 0 && (
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
                      <Package className="w-20 h-20 mx-auto text-orange-400/50" />
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "reverse",
                        }}
                        className="absolute -top-2 -right-2"
                      >
                        <AlertTriangle className="w-8 h-8 text-amber-500" />
                      </motion.div>
                    </div>
                  </motion.div>
                  <h3 className="mb-4 text-2xl font-bold text-transparent bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text">
                    Không tìm thấy sản phẩm
                  </h3>
                  <p className="max-w-md mx-auto mb-6 text-orange-700/80 leading-relaxed">
                    Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm để tìm thấy sản
                    phẩm phù hợp.
                  </p>
                  <div className="space-y-4">
                    <div className="flex justify-center space-x-3">
                      <Button
                        onClick={() => {
                          setSearchQuery("");
                          setCategoryFilter("all");
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
                        <Link to="/admin/products/create">
                          <Plus className="w-4 h-4 mr-2" />
                          <span className="font-semibold">
                            Thêm sản phẩm mới
                          </span>
                          <Sparkles className="w-4 h-4 ml-1" />
                        </Link>
                      </Button>
                    </div>
                    <div className="flex justify-center flex-wrap gap-2">
                      <Badge
                        variant="outline"
                        className="cursor-pointer hover:bg-orange-100 transition-colors"
                        onClick={() => setSearchQuery("React")}
                      >
                        💡 Thử tìm "React"
                      </Badge>
                      <Badge
                        variant="outline"
                        className="cursor-pointer hover:bg-orange-100 transition-colors"
                        onClick={() => setSearchQuery("Dashboard")}
                      >
                        🔥 Hoặc "Dashboard"
                      </Badge>
                      <Badge
                        variant="outline"
                        className="cursor-pointer hover:bg-orange-100 transition-colors"
                        onClick={() => setSearchQuery("E-commerce")}
                      >
                        ⚡ Hoặc "E-commerce"
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

export default ProductManagement;
