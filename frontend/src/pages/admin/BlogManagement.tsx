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
import { BlogPost, BlogCategory } from "@/types/blog";
import {
  getAllBlogPosts,
  getAllCategories,
  updatePostStatus,
  deleteBlogPost,
} from "@/lib/blog";
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
  BookOpen,
  Calendar,
  Clock,
  TrendingUp,
  RefreshCw,
  Heart,
  Sparkles,
  BarChart3,
  CheckCircle,
  XCircle,
  Info,
} from "lucide-react";

// Toast giống Product/Order
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

const BlogManagement: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "published" | "draft"
  >("all");
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
  const [toasts, setToasts] = useState<
    Array<{
      id: string;
      type: "success" | "error" | "info";
      title: string;
      description?: string;
    }>
  >([]);
  const [page, setPage] = useState(1);
  const PER_PAGE = 8;

  if (!user || !isAdmin(user)) return <Navigate to="/" replace />;

  // Toast hệ thống tự động
  const showToast = (
    type: "success" | "error" | "info",
    title: string,
    description?: string,
  ) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, description }]);
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
        const [postsData, categoriesData] = await Promise.all([
          getAllBlogPosts(),
          getAllCategories(),
        ]);
        setPosts(postsData);
        setCategories(categoriesData);
        showToast(
          "success",
          "✅ Đã tải blog",
          `Tải thành công ${postsData.length} bài viết.`,
        );
      } catch {
        showToast("error", "❌ Lỗi tải blog", "Không thể tải dữ liệu blog.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 },
    );
    const sections = document.querySelectorAll("[data-animate]");
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // Lọc bài viết
  const filteredPosts = posts.filter((post) => {
    const matchSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory =
      categoryFilter === "all" || post.category.id === categoryFilter;
    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "published" && post.isPublished) ||
      (statusFilter === "draft" && !post.isPublished);
    return matchSearch && matchCategory && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / PER_PAGE));
  const pagedPosts = filteredPosts.slice(
    (page - 1) * PER_PAGE,
    page * PER_PAGE,
  );

  useEffect(() => {
    setPage(1);
  }, [searchQuery, categoryFilter, statusFilter]);
  useEffect(() => {
    const tableSection = document.getElementById("posts");
    tableSection?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [page]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const [postsData, categoriesData] = await Promise.all([
        getAllBlogPosts(),
        getAllCategories(),
      ]);
      setPosts(postsData);
      setCategories(categoriesData);
      showToast(
        "success",
        "🔄 Đã cập nhật",
        "Danh sách bài viết đã được làm mới.",
      );
    } catch {
      showToast("error", "❌ Lỗi cập nhật", "Không thể cập nhật dữ liệu blog.");
    }
    setRefreshing(false);
  };

  const handleToggleStatus = async (postId: string) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;
    const success = await updatePostStatus(postId, !post.isPublished);
    if (success) {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, isPublished: !p.isPublished } : p,
        ),
      );
      showToast(
        "success",
        "✅ Đã cập nhật",
        "Trạng thái bài viết đã được cập nhật.",
      );
    } else {
      showToast(
        "error",
        "❌ Cập nhật thất bại",
        "Có lỗi xảy ra khi cập nhật trạng thái bài viết.",
      );
    }
  };

  const handleDeletePost = async (postId: string) => {
    const success = await deleteBlogPost(postId);
    if (success) {
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      showToast(
        "success",
        "🗑️ Đã xóa bài viết",
        "Bài viết đã được xóa khỏi hệ thống.",
      );
    } else {
      showToast("error", "❌ Xóa thất bại", "Có lỗi xảy ra khi xóa bài viết.");
    }
  };

  const stats = {
    total: posts.length,
    published: posts.filter((p) => p.isPublished).length,
    draft: posts.filter((p) => !p.isPublished).length,
    featured: posts.filter((p) => p.isFeatured).length,
    totalViews: posts.reduce((sum, p) => sum + p.views, 0),
    totalLikes: posts.reduce((sum, p) => sum + p.likes, 0),
  };

  const statsCards = [
    {
      title: "Tổng bài viết",
      value: stats.total,
      icon: BookOpen,
      gradient: "from-orange-400 via-amber-500 to-pink-600",
      bgGradient: "from-orange-50/80 via-amber-50/80 to-pink-50/80",
      description: "Tất cả bài viết",
      trend: "+5%",
    },
    {
      title: "Đã xuất bản",
      value: stats.published,
      icon: Sparkles,
      gradient: "from-green-400 via-emerald-500 to-teal-600",
      bgGradient: "from-green-50/80 via-emerald-50/80 to-teal-50/80",
      description: "Công khai",
      trend: "+3%",
    },
    {
      title: "Bản nháp",
      value: stats.draft,
      icon: Edit,
      gradient: "from-yellow-400 via-orange-400 to-pink-400",
      bgGradient: "from-yellow-50/80 via-orange-50/80 to-pink-50/80",
      description: "Chưa xuất bản",
      trend: "-2%",
    },
    {
      title: "Nổi bật",
      value: stats.featured,
      icon: TrendingUp,
      gradient: "from-purple-400 via-violet-500 to-indigo-600",
      bgGradient: "from-purple-50/80 via-violet-50/80 to-indigo-50/80",
      description: "Bài hot",
      trend: "+1%",
    },
    {
      title: "Lượt xem",
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      gradient: "from-indigo-500 via-blue-500 to-cyan-500",
      bgGradient: "from-indigo-50/80 via-blue-50/80 to-cyan-50/80",
      description: "Tổng views",
      trend: "+7%",
    },
    {
      title: "Lượt thích",
      value: stats.totalLikes,
      icon: Heart,
      gradient: "from-pink-500 via-red-500 to-rose-500",
      bgGradient: "from-pink-50/80 via-red-50/80 to-rose-50/80",
      description: "Tổng likes",
      trend: "+4%",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-pink-50">
      {/* 🌟 Floating Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4"
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <BookOpen className="w-8 h-8 text-orange-400 opacity-20" />
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
          <Sparkles className="w-6 h-6 text-pink-400 opacity-20" />
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
          <Heart className="text-amber-400 w-7 h-7 opacity-20" />
        </motion.div>
      </div>

      {/* Toast notification */}
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
        {/* Header */}
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
                <BookOpen className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-orange-600 via-amber-600 to-pink-600 bg-clip-text">
                  Quản lý Blog
                </h1>
                <p className="text-orange-700/80 mt-1 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Quản lý, xuất bản và theo dõi bài viết blog</span>
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
                variant="outline"
                asChild
                className="bg-white/80 border-orange-200/50 hover:border-orange-300 rounded-2xl shadow-md"
              >
                <Link to="/admin/blog/categories">
                  <Filter className="w-4 h-4 mr-2 text-orange-600" />
                  <span className="font-semibold">Danh mục</span>
                </Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                asChild
                className="transition-all duration-300 shadow-lg bg-gradient-to-r from-orange-500 via-amber-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 rounded-2xl"
              >
                <Link to="/admin/blog/create">
                  <Plus className="w-4 h-4 mr-2" />
                  <span className="font-semibold">Viết bài mới</span>
                  <Sparkles className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-4 mb-4 md:grid-cols-4"
          id="stats1"
          data-animate
        >
          {statsCards.slice(0, 4).map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -8, scale: 1.03 }}
              className="transition-all duration-500"
            >
              <Card
                className={`relative overflow-hidden border-0 bg-gradient-to-br ${stat.bgGradient} backdrop-blur-sm shadow-lg hover:shadow-2xl group rounded-3xl`}
                style={{ minHeight: 140 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50" />
                <CardContent className="pt-4 pb-4">
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
                      className={`w-10 h-10 rounded-2xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl flex-shrink-0`}
                    >
                      <stat.icon className="w-5 h-5 text-white" />
                    </motion.div>
                  </div>
                  <div
                    className={`flex items-center text-xs ${stat.trend.startsWith("+") ? "text-emerald-600" : "text-red-600"}`}
                  >
                    <div
                      className={`p-1 rounded-full mr-1 ${stat.trend.startsWith("+") ? "bg-emerald-100" : "bg-red-100"}`}
                    >
                      <TrendingUp
                        className={`w-2 h-2 ${!stat.trend.startsWith("+") ? "rotate-180" : ""}`}
                      />
                    </div>
                    <span className="font-semibold">{stat.trend}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className="grid grid-cols-2 gap-4 mb-8 md:grid-cols-2"
          id="stats2"
          data-animate
        >
          {statsCards.slice(4).map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + index * 0.1 }}
              whileHover={{ y: -8, scale: 1.03 }}
              className="transition-all duration-500"
            >
              <Card
                className={`relative overflow-hidden border-0 bg-gradient-to-br ${stat.bgGradient} backdrop-blur-sm shadow-lg hover:shadow-2xl group rounded-3xl`}
                style={{ minHeight: 140 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50" />
                <CardContent className="pt-4 pb-4">
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
                      className={`w-10 h-10 rounded-2xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl flex-shrink-0`}
                    >
                      <stat.icon className="w-5 h-5 text-white" />
                    </motion.div>
                  </div>
                  <div
                    className={`flex items-center text-xs ${stat.trend.startsWith("+") ? "text-emerald-600" : "text-red-600"}`}
                  >
                    <div
                      className={`p-1 rounded-full mr-1 ${stat.trend.startsWith("+") ? "bg-emerald-100" : "bg-red-100"}`}
                    >
                      <TrendingUp
                        className={`w-2 h-2 ${!stat.trend.startsWith("+") ? "rotate-180" : ""}`}
                      />
                    </div>
                    <span className="font-semibold">{stat.trend}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Filters */}
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
                      Tìm kiếm & lọc bài viết theo nhiều tiêu chí
                    </p>
                  </div>
                </div>
                <Badge className="bg-gradient-to-r from-orange-200 to-pink-200 text-orange-800 border-0 shadow-sm">
                  {filteredPosts.length} kết quả
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Search Bar */}
                <motion.div className="relative" whileFocus={{ scale: 1.01 }}>
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-pink-400/20 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  <div className="relative flex items-center space-x-3 p-4 bg-gradient-to-r from-white/90 to-orange-50/90 backdrop-blur-xl border border-orange-200/50 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <Search className="flex-shrink-0 w-5 h-5 text-orange-600 group-hover:text-orange-800 transition-colors" />
                    <Input
                      placeholder="Tìm kiếm bài viết..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 text-sm bg-transparent border-none outline-none placeholder:text-orange-500/60 text-orange-800 font-medium"
                    />
                  </div>
                </motion.div>
                {/* Filter Controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <motion.div whileFocus={{ scale: 1.01 }}>
                    <label className="text-sm font-semibold text-orange-800 mb-2 block">
                      Danh mục
                    </label>
                    <Select
                      value={categoryFilter}
                      onValueChange={setCategoryFilter}
                    >
                      <SelectTrigger className="h-12 bg-white/80 border-orange-200/50 rounded-2xl shadow-md">
                        <SelectValue placeholder="Chọn danh mục" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả danh mục</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
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
                        <SelectValue placeholder="Trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả trạng thái</SelectItem>
                        <SelectItem value="published">Đã xuất bản</SelectItem>
                        <SelectItem value="draft">Bản nháp</SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>
                </div>
                {/* Quick Filter Badges */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-orange-100 transition-colors"
                    onClick={() => setStatusFilter("published")}
                  >
                    ✅ Đã xuất bản
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-orange-100 transition-colors"
                    onClick={() => setStatusFilter("draft")}
                  >
                    📝 Bản nháp
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-orange-100 transition-colors"
                    onClick={() => setCategoryFilter("all")}
                  >
                    🏷️ Tất cả danh mục
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-orange-100 transition-colors"
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("all");
                      setCategoryFilter("all");
                    }}
                  >
                    🔄 Reset tất cả
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Posts Table with pagination */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          id="posts"
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
                      Danh sách bài viết
                    </CardTitle>
                    <p className="text-sm text-green-700/80 mt-1 flex items-center space-x-2">
                      {filteredPosts.length} bài viết được tìm thấy (Trang{" "}
                      {page}/{totalPages})
                    </p>
                  </div>
                </div>
                <Badge className="bg-gradient-to-r from-green-200 to-emerald-200 text-green-800 border-0 shadow-sm">
                  {pagedPosts.length} hiển thị
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-muted/50 border-orange-200/30">
                      <TableHead className="font-semibold text-orange-800">
                        Bài viết
                      </TableHead>
                      <TableHead className="font-semibold text-orange-800">
                        Danh mục
                      </TableHead>
                      <TableHead className="font-semibold text-orange-800">
                        Tác giả
                      </TableHead>
                      <TableHead className="font-semibold text-orange-800">
                        Trạng thái
                      </TableHead>
                      <TableHead className="font-semibold text-orange-800">
                        Lượt xem
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
                      {pagedPosts.map((post, index) => (
                        <motion.tr
                          key={post.id}
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
                              <motion.img
                                whileHover={{ scale: 1.1 }}
                                src={post.featuredImage}
                                alt={post.title}
                                className="object-cover w-14 h-12 rounded-lg shadow"
                              />
                              <div>
                                <div className="font-semibold transition-colors group-hover:text-orange-700 text-orange-900">
                                  {post.title}
                                </div>
                                <div className="text-xs text-orange-600/80">
                                  {post.excerpt}
                                </div>
                                {post.isFeatured && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs text-amber-800 bg-amber-100 ml-1"
                                  >
                                    <TrendingUp className="w-3 h-3 mr-1" />
                                    Nổi bật
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="transition-all duration-300 group-hover:scale-105 bg-purple-100 text-purple-800 border-purple-300"
                            >
                              {post.category.name}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <motion.img
                                whileHover={{ scale: 1.1 }}
                                src={post.author.avatar}
                                alt={post.author.name}
                                className="object-cover w-6 h-6 rounded-full"
                              />
                              <span className="text-sm font-medium">
                                {post.author.name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`transition-all duration-300 group-hover:scale-105 border-0 shadow-sm ${
                                post.isPublished
                                  ? "bg-gradient-to-r from-green-200 to-emerald-200 text-green-800"
                                  : "bg-gradient-to-r from-red-200 to-pink-200 text-red-800"
                              }`}
                            >
                              {post.isPublished ? (
                                <>
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Đã xuất bản
                                </>
                              ) : (
                                <>
                                  <Edit className="w-3 h-3 mr-1" />
                                  Bản nháp
                                </>
                              )}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1 text-sm font-bold text-emerald-600">
                              <Eye className="w-3 h-3" />
                              {post.views}
                              <Heart className="w-3 h-3 text-pink-400 ml-1" />
                              {post.likes}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1 text-sm text-orange-700/80">
                              <Calendar className="w-3 h-3" />
                              <span>
                                {post.publishedAt
                                  ? new Date(
                                      post.publishedAt,
                                    ).toLocaleDateString("vi-VN")
                                  : "--"}
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
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem asChild>
                                  <Link to={`/blog/${post.slug}`}>
                                    <Eye className="w-4 h-4 mr-2" />
                                    Xem bài viết
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link to={`/admin/blog/edit/${post.id}`}>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Chỉnh sửa
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleToggleStatus(post.id)}
                                >
                                  {post.isPublished ? (
                                    <>
                                      <Edit className="w-4 h-4 mr-2" />
                                      Chuyển về nháp
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle className="w-4 h-4 mr-2" />
                                      Xuất bản
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeletePost(post.id)}
                                  className="text-red-600"
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
              {/* Empty State */}
              {filteredPosts.length === 0 && (
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
                      <BookOpen className="w-20 h-20 mx-auto text-orange-400/50" />
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "reverse",
                        }}
                        className="absolute -top-2 -right-2"
                      >
                        <Sparkles className="w-8 h-8 text-amber-500" />
                      </motion.div>
                    </div>
                  </motion.div>
                  <h3 className="mb-4 text-2xl font-bold text-transparent bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text">
                    Không tìm thấy bài viết
                  </h3>
                  <p className="max-w-md mx-auto mb-6 text-orange-700/80 leading-relaxed">
                    Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm để tìm thấy bài
                    viết phù hợp.
                  </p>
                  <div className="space-y-4">
                    <div className="flex justify-center space-x-3">
                      <Button
                        onClick={() => {
                          setSearchQuery("");
                          setCategoryFilter("all");
                          setStatusFilter("all");
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
                        className="bg-gradient-to-r from-orange-500 via-amber-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 rounded-2xl shadow-lg"
                      >
                        <Link to="/admin/blog/create">
                          <Plus className="w-4 h-4 mr-2" />
                          <span className="font-semibold">Viết bài mới</span>
                          <Sparkles className="w-4 h-4 ml-1" />
                        </Link>
                      </Button>
                    </div>
                    <div className="flex justify-center flex-wrap gap-2">
                      <Badge
                        variant="outline"
                        className="cursor-pointer hover:bg-orange-100 transition-colors"
                        onClick={() => setStatusFilter("published")}
                      >
                        💡 Thử lọc "Đã xuất bản"
                      </Badge>
                      <Badge
                        variant="outline"
                        className="cursor-pointer hover:bg-orange-100 transition-colors"
                        onClick={() => setStatusFilter("draft")}
                      >
                        📝 Thử lọc "Bản nháp"
                      </Badge>
                      <Badge
                        variant="outline"
                        className="cursor-pointer hover:bg-orange-100 transition-colors"
                        onClick={() => setSearchQuery("React")}
                      >
                        ⚡ Thử tìm "React"
                      </Badge>
                      <Badge
                        variant="outline"
                        className="cursor-pointer hover:bg-orange-100 transition-colors"
                        onClick={() => setSearchQuery("Tutorial")}
                      >
                        🔥 Thử tìm "Tutorial"
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              )}
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-8 gap-2">
                  <Button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    variant="outline"
                    className="bg-white/80 hover:bg-white border-orange-200/50 hover:border-orange-300 rounded-2xl shadow-md"
                  >
                    <span className="text-orange-800 font-semibold">Trước</span>
                  </Button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) pageNum = i + 1;
                    else if (page <= 3) pageNum = i + 1;
                    else if (page >= totalPages - 2)
                      pageNum = totalPages - 4 + i;
                    else pageNum = page - 2 + i;
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
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default BlogManagement;
