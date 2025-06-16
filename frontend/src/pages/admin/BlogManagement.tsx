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
  User,
  TrendingUp,
  RefreshCw,
  Coffee,
  Code,
  Palette,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Activity,
  FileText,
  Users,
  Heart,
  MessageCircle,
  Share2,
  Sparkles,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const BlogManagement: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "published" | "draft"
  >("all");
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});

  // ✅ Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(8);

  if (!user || !isAdmin(user)) {
    return <Navigate to="/" replace />;
  }

  // Fetch data từ Supabase
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
        toast({
          title: "✅ Đã tải blog",
          description: `Tải thành công ${postsData.length} bài viết.`,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "❌ Lỗi tải dữ liệu",
          description: "Không thể tải dữ liệu blog. Vui lòng thử lại.",
          variant: "destructive",
        });
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

  // ✅ Filter posts
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || post.category.id === categoryFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "published" && post.isPublished) ||
      (statusFilter === "draft" && !post.isPublished);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // ✅ Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  // ✅ Pagination handlers
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, statusFilter]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const [postsData, categoriesData] = await Promise.all([
        getAllBlogPosts(),
        getAllCategories(),
      ]);
      setPosts(postsData);
      setCategories(categoriesData);
      toast({
        title: "🔄 Đã cập nhật",
        description: "Dữ liệu blog đã được làm mới.",
      });
    } catch (error) {
      toast({
        title: "❌ Lỗi cập nhật",
        description: "Không thể cập nhật dữ liệu blog.",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };

  const handleToggleStatus = async (postId: string) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    const success = await updatePostStatus(postId, !post.isPublished);

    if (success) {
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? { ...post, isPublished: !post.isPublished }
            : post,
        ),
      );

      toast({
        title: "✅ Cập nhật thành công",
        description: "Trạng thái bài viết đã được cập nhật.",
      });
    } else {
      toast({
        title: "❌ Cập nhật thất bại",
        description: "Có lỗi xảy ra khi cập nhật trạng thái bài viết.",
        variant: "destructive",
      });
    }
  };

  const handleDeletePost = async (postId: string) => {
    const success = await deleteBlogPost(postId);

    if (success) {
      setPosts((prev) => prev.filter((post) => post.id !== postId));

      toast({
        title: "🗑️ Đã xóa bài viết",
        description: "Bài viết đã được xóa khỏi hệ thống.",
      });
    } else {
      toast({
        title: "❌ Xóa thất bại",
        description: "Có lỗi xảy ra khi xóa bài viết.",
        variant: "destructive",
      });
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
      icon: FileText,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient:
        "from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20",
      description: "Tất cả bài viết",
    },
    {
      title: "Đã xuất bản",
      value: stats.published,
      icon: BookOpen,
      gradient: "from-green-500 to-emerald-500",
      bgGradient:
        "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
      description: "Công khai",
    },
    {
      title: "Bản nháp",
      value: stats.draft,
      icon: Edit,
      gradient: "from-orange-500 to-amber-500",
      bgGradient:
        "from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20",
      description: "Chưa xuất bản",
    },
    {
      title: "Nổi bật",
      value: stats.featured,
      icon: TrendingUp,
      gradient: "from-purple-500 to-violet-500",
      bgGradient:
        "from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20",
      description: "Bài hot",
    },
    {
      title: "Lượt xem",
      value: stats.totalViews.toLocaleString(),
      icon: Eye,
      gradient: "from-indigo-500 to-blue-500",
      bgGradient:
        "from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20",
      description: "Tổng views",
    },
    {
      title: "Lượt thích",
      value: stats.totalLikes,
      icon: Heart,
      gradient: "from-red-500 to-pink-500",
      bgGradient:
        "from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20",
      description: "Tổng likes",
    },
  ];

  const getCategoryColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: "#3b82f6",
      purple: "#8b5cf6",
      green: "#10b981",
      orange: "#f59e0b",
      red: "#ef4444",
      pink: "#ec4899",
    };
    return colors[color] || colors.blue;
  };

  // ✅ Pagination component
  const PaginationComponent = () => {
    if (totalPages <= 1) return null;

    const getVisiblePages = () => {
      const delta = 2;
      const range = [];
      const rangeWithDots = [];

      for (
        let i = Math.max(2, currentPage - delta);
        i <= Math.min(totalPages - 1, currentPage + delta);
        i++
      ) {
        range.push(i);
      }

      if (currentPage - delta > 2) {
        rangeWithDots.push(1, "...");
      } else {
        rangeWithDots.push(1);
      }

      rangeWithDots.push(...range);

      if (currentPage + delta < totalPages - 1) {
        rangeWithDots.push("...", totalPages);
      } else {
        rangeWithDots.push(totalPages);
      }

      return rangeWithDots;
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mt-6"
      >
        <div className="text-sm text-muted-foreground">
          Hiển thị {indexOfFirstPost + 1} đến{" "}
          {Math.min(indexOfLastPost, filteredPosts.length)} của{" "}
          {filteredPosts.length} bài viết
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="group"
          >
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Trước
          </Button>

          <div className="flex items-center space-x-1">
            {getVisiblePages().map((page, index) => (
              <React.Fragment key={index}>
                {page === "..." ? (
                  <span className="px-3 py-2 text-muted-foreground">...</span>
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page as number)}
                      className={`min-w-[40px] ${
                        currentPage === page
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                          : ""
                      }`}
                    >
                      {page}
                    </Button>
                  </motion.div>
                )}
              </React.Fragment>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="group"
          >
            Sau
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </motion.div>
    );
  };

  // ✅ Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
        {/* Floating Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 animate-float">
            <FileText className="w-8 h-8 text-blue-500 opacity-20" />
          </div>
          <div className="absolute top-1/3 right-1/4 animate-float-delay-1">
            <BookOpen className="w-6 h-6 text-purple-500 opacity-20" />
          </div>
          <div className="absolute bottom-1/4 left-1/3 animate-float-delay-2">
            <Coffee className="text-orange-500 w-7 h-7 opacity-20" />
          </div>
        </div>

        <div className="container relative z-10 px-4 py-8 mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center min-h-screen"
          >
            <Card className="py-12 text-center border-0 shadow-2xl bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900">
              <CardContent>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 mx-auto mb-4 border-4 rounded-full border-primary border-t-transparent"
                />
                <h2 className="mb-2 text-xl font-semibold">Đang tải blog...</h2>
                <p className="text-muted-foreground">
                  Vui lòng đợi trong giây lát
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
      {/* Floating Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 animate-float">
          <Code className="w-8 h-8 text-blue-500 opacity-20" />
        </div>
        <div className="absolute top-1/3 right-1/4 animate-float-delay-1">
          <Palette className="w-6 h-6 text-purple-500 opacity-20" />
        </div>
        <div className="absolute bottom-1/4 left-1/3 animate-float-delay-2">
          <Coffee className="text-orange-500 w-7 h-7 opacity-20" />
        </div>
      </div>

      <div className="container relative z-10 px-4 py-8 mx-auto space-y-8">
        {/* ✅ Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
          id="header"
          data-animate
        >
          <div className="flex items-center space-x-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" size="sm" asChild className="group">
                <Link to="/admin">
                  <ArrowLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
                  Về Dashboard
                </Link>
              </Button>
            </motion.div>
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="flex items-center justify-center w-12 h-12 shadow-lg rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600"
              >
                <BookOpen className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text">
                  Quản lý Blog
                </h1>
                <p className="text-muted-foreground">
                  Quản lý bài viết, danh mục và nội dung blog
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={refreshing}
                className="transition-all duration-300 group hover:bg-primary/10"
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
                  <RefreshCw className="w-4 h-4 mr-2 group-hover:animate-spin" />
                )}
                Làm mới
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" asChild>
                <Link to="/admin/blog/categories">
                  <Filter className="w-4 h-4 mr-2" />
                  Quản lý danh mục
                </Link>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                asChild
                className="transition-all duration-300 shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl"
              >
                <Link to="/admin/blog/create">
                  <Plus className="w-4 h-4 mr-2" />
                  Viết bài mới
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* ✅ Enhanced Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6"
          id="stats"
          data-animate
        >
          {statsCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`transition-all duration-500 ${
                isVisible.stats
                  ? "animate-in slide-in-from-bottom"
                  : "opacity-0"
              }`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <Card
                className={`transition-all duration-300 hover:shadow-xl border-0 bg-gradient-to-br ${stat.bgGradient} group`}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="mb-1 text-2xl font-bold text-foreground"
                      >
                        {stat.value}
                      </motion.div>
                      <div className="mb-1 text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {stat.description}
                      </div>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}
                    >
                      <stat.icon className="w-6 h-6 text-white" />
                    </motion.div>
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
          id="filters"
          data-animate
        >
          <Card className="border-0 shadow-lg bg-gradient-to-r from-white to-blue-50 dark:from-slate-800 dark:to-blue-900">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500">
                  <Filter className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text">
                    Bộ lọc và tìm kiếm
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Tìm kiếm và lọc bài viết theo tiêu chí
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 md:flex-row">
                <motion.div
                  className="relative flex-1"
                  whileFocus={{ scale: 1.01 }}
                >
                  <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm bài viết theo tiêu đề, nội dung, tác giả..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-12 pl-10 transition-all duration-300 border-0 bg-background/50 focus:ring-2 focus:ring-primary/20"
                  />
                </motion.div>

                <motion.div whileFocus={{ scale: 1.01 }}>
                  <Select
                    value={categoryFilter}
                    onValueChange={setCategoryFilter}
                  >
                    <SelectTrigger className="w-full md:w-[180px] h-12">
                      <SelectValue placeholder="Danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả danh mục</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>

                <motion.div whileFocus={{ scale: 1.01 }}>
                  <Select
                    value={statusFilter}
                    onValueChange={(value: any) => setStatusFilter(value)}
                  >
                    <SelectTrigger className="w-full md:w-[180px] h-12">
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
            </CardContent>
          </Card>
        </motion.div>

        {/* ✅ Enhanced Posts Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          id="posts"
          data-animate
        >
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-transparent bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text">
                      Danh sách bài viết
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Trang {currentPage} / {totalPages} -{" "}
                      {filteredPosts.length} bài viết được tìm thấy
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-blue-800 bg-blue-100">
                  <Activity className="w-3 h-3 mr-1" />
                  {currentPosts.length} kết quả
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-muted/50">
                      <TableHead className="font-semibold">Bài viết</TableHead>
                      <TableHead className="font-semibold">Danh mục</TableHead>
                      <TableHead className="font-semibold">Tác giả</TableHead>
                      <TableHead className="font-semibold">
                        Trạng thái
                      </TableHead>
                      <TableHead className="font-semibold">Thống kê</TableHead>
                      <TableHead className="font-semibold">Ngày tạo</TableHead>
                      <TableHead className="font-semibold text-right">
                        Thao tác
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {currentPosts.map((post, index) => (
                        <motion.tr
                          key={post.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                          className="transition-all duration-300 group hover:shadow-md"
                        >
                          <TableCell>
                            <div className="flex items-start space-x-3">
                              <motion.img
                                whileHover={{ scale: 1.1 }}
                                src={post.featuredImage}
                                alt={post.title}
                                className="object-cover w-16 h-12 transition-transform duration-300 rounded shadow-md"
                              />
                              <div className="space-y-1">
                                <div className="font-medium transition-colors line-clamp-2 group-hover:text-primary">
                                  {post.title}
                                </div>
                                <div className="text-sm text-muted-foreground line-clamp-1">
                                  {post.excerpt}
                                </div>
                                {post.isFeatured && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs text-yellow-800 bg-yellow-100"
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
                              style={{
                                borderColor: getCategoryColor(
                                  post.category.color,
                                ),
                                color: getCategoryColor(post.category.color),
                              }}
                              className="transition-all duration-300 group-hover:scale-105"
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
                                className="object-cover w-6 h-6 transition-transform duration-300 rounded-full"
                              />
                              <span className="text-sm font-medium">
                                {post.author.name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                post.isPublished ? "default" : "secondary"
                              }
                              className="transition-all duration-300 group-hover:scale-105"
                            >
                              {post.isPublished ? "Đã xuất bản" : "Bản nháp"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center space-x-1">
                                <Eye className="w-3 h-3 text-blue-500" />
                                <span className="font-medium">
                                  {post.views}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Heart className="w-3 h-3 text-red-500" />
                                <span className="font-medium">
                                  {post.likes}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1 text-sm">
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-3 h-3" />
                                <span>
                                  {new Date(
                                    post.publishedAt,
                                  ).toLocaleDateString("vi-VN")}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                <span>{post.readTime} phút đọc</span>
                              </div>
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
                                    className="group/btn"
                                  >
                                    <MoreHorizontal className="w-4 h-4 transition-colors group-hover/btn:text-primary" />
                                  </Button>
                                </motion.div>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
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
                                  <BookOpen className="w-4 h-4 mr-2" />
                                  {post.isPublished
                                    ? "Chuyển về nháp"
                                    : "Xuất bản"}
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

              {/* ✅ Enhanced Empty State */}
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
                  >
                    <BookOpen className="w-20 h-20 mx-auto mb-6 text-muted-foreground" />
                  </motion.div>
                  <h3 className="mb-4 text-2xl font-semibold">
                    Không tìm thấy bài viết
                  </h3>
                  <p className="max-w-md mx-auto mb-6 text-muted-foreground">
                    Thử thay đổi bộ lọc hoặc tạo bài viết mới để bắt đầu chia sẻ
                    nội dung.
                  </p>
                  <div className="space-y-3">
                    <Button
                      onClick={() => {
                        setSearchQuery("");
                        setCategoryFilter("all");
                        setStatusFilter("all");
                      }}
                      variant="outline"
                      className="mr-3"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Xóa bộ lọc
                    </Button>
                    <Button
                      asChild
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    >
                      <Link to="/admin/blog/create">
                        <Plus className="w-4 h-4 mr-2" />
                        Viết bài mới
                      </Link>
                    </Button>
                  </div>
                  <div className="flex justify-center mt-4 space-x-2">
                    <Badge variant="outline">💡 Gợi ý: Thử tìm "React"</Badge>
                    <Badge variant="outline">🔥 Hoặc "Tutorial"</Badge>
                    <Badge variant="outline">⚡ Hoặc "JavaScript"</Badge>
                  </div>
                </motion.div>
              )}

              {/* ✅ Pagination Component */}
              <PaginationComponent />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default BlogManagement;
