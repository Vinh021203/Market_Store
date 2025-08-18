import React, { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { isAdmin } from "@/lib/auth";
import { BlogCategory } from "@/types/blog";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/blog";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  ArrowLeft,
  Edit,
  Trash2,
  MoreHorizontal,
  Save,
  X,
  Tag,
  Palette,
  Loader2,
  Coffee,
  Code,
  Sparkles,
  RefreshCw,
  BarChart3,
  Activity,
  Eye,
  Search,
  Filter,
  XCircle,
  Info,
  CheckCircle,
  Heart,
  Target,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

// Enhanced Toast Component (giống các trang khác)
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

const categorySchema = z.object({
  name: z.string().min(2, "Tên danh mục phải có ít nhất 2 ký tự"),
  description: z.string().optional(),
  color: z.string().min(1, "Vui lòng chọn màu"),
});

type CategoryFormData = z.infer<typeof categorySchema>;

const BlogCategories: React.FC = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(
    null,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
  const [toasts, setToasts] = useState<
    Array<{
      id: string;
      type: "success" | "error" | "info";
      title: string;
      description?: string;
    }>
  >([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [categoriesPerPage] = useState(8);

  if (!user || !isAdmin(user)) {
    return <Navigate to="/" replace />;
  }

  // Toast system
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

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      color: "orange",
    },
  });

  const watchedColor = watch("color");

  // Fetch categories từ Supabase
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const data = await getAllCategories();
        setCategories(data);
        showToast(
          "success",
          "✅ Đã tải danh mục",
          `Tải thành công ${data.length} danh mục.`,
        );
      } catch (error) {
        console.error("Error fetching categories:", error);
        showToast(
          "error",
          "❌ Lỗi tải dữ liệu",
          "Không thể tải danh sách danh mục",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();

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

  const colorOptions = [
    { value: "orange", label: "Cam", color: "#f97316" },
    { value: "amber", label: "Hổ phách", color: "#f59e0b" },
    { value: "pink", label: "Hồng", color: "#ec4899" },
    { value: "rose", label: "Hồng đậm", color: "#f43f5e" },
    { value: "purple", label: "Tím", color: "#a855f7" },
    { value: "blue", label: "Xanh dương", color: "#3b82f6" },
    { value: "green", label: "Xanh lá", color: "#10b981" },
    { value: "red", label: "Đỏ", color: "#ef4444" },
  ];

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove accents
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  // Filter categories
  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Pagination logic
  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = filteredCategories.slice(
    indexOfFirstCategory,
    indexOfLastCategory,
  );
  const totalPages = Math.ceil(filteredCategories.length / categoriesPerPage);

  // Pagination handlers
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
  }, [searchQuery]);

  const onSubmit = async (data: CategoryFormData) => {
    setIsSaving(true);

    try {
      const slug = generateSlug(data.name);

      if (editingCategory) {
        // Update existing category
        const success = await updateCategory(editingCategory.id, {
          ...data,
          slug,
        });

        if (success) {
          setCategories((prev) =>
            prev.map((cat) =>
              cat.id === editingCategory.id ? { ...cat, ...data, slug } : cat,
            ),
          );

          showToast(
            "success",
            "✅ Cập nhật thành công",
            "Danh mục đã được cập nhật.",
          );
        } else {
          throw new Error("Không thể cập nhật danh mục");
        }
      } else {
        // Create new category
        const newCategory = await createCategory({
          ...data,
          slug,
        });

        if (newCategory) {
          setCategories((prev) => [...prev, newCategory]);
          showToast(
            "success",
            "✅ Tạo thành công",
            "Danh mục mới đã được tạo.",
          );
        } else {
          throw new Error("Không thể tạo danh mục");
        }
      }

      setIsDialogOpen(false);
      setEditingCategory(null);
      reset();
    } catch (error) {
      console.error("Error saving category:", error);
      showToast(
        "error",
        "❌ Lỗi",
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi lưu danh mục",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (category: BlogCategory) => {
    setEditingCategory(category);
    setValue("name", category.name);
    setValue("description", category.description || "");
    setValue("color", category.color);
    setIsDialogOpen(true);
  };

  const handleDelete = async (categoryId: string) => {
    try {
      const success = await deleteCategory(categoryId);

      if (success) {
        setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
        showToast(
          "success",
          "🗑️ Đã xóa danh mục",
          "Danh mục đã được xóa khỏi hệ thống.",
        );
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      showToast(
        "error",
        "❌ Lỗi xóa danh mục",
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi xóa danh mục",
      );
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingCategory(null);
    reset();
  };

  const getCategoryColor = (color: string) => {
    const colorOption = colorOptions.find((opt) => opt.value === color);
    return colorOption?.color || "#f97316";
  };

  const stats = {
    total: categories.length,
    withPosts: categories.filter((c) => c.postCount > 0).length,
    empty: categories.filter((c) => c.postCount === 0).length,
    totalPosts: categories.reduce((sum, c) => sum + c.postCount, 0),
  };

  const statsCards = [
    {
      title: "Tổng danh mục",
      value: stats.total,
      icon: Tag,
      gradient: "from-orange-400 via-amber-500 to-yellow-600",
      bgGradient: "from-orange-50/80 via-amber-50/80 to-yellow-50/80",
      description: "Tất cả danh mục",
      trend: "+12%",
    },
    {
      title: "Có bài viết",
      value: stats.withPosts,
      icon: BarChart3,
      gradient: "from-green-400 via-emerald-500 to-teal-600",
      bgGradient: "from-green-50/80 via-emerald-50/80 to-teal-50/80",
      description: "Đã có nội dung",
      trend: "+8%",
    },
    {
      title: "Chưa có bài",
      value: stats.empty,
      icon: Activity,
      gradient: "from-purple-400 via-violet-500 to-indigo-600",
      bgGradient: "from-purple-50/80 via-violet-50/80 to-indigo-50/80",
      description: "Chờ nội dung",
      trend: "-3%",
    },
    {
      title: "Tổng bài viết",
      value: stats.totalPosts,
      icon: Eye,
      gradient: "from-pink-400 via-rose-500 to-red-600",
      bgGradient: "from-pink-50/80 via-rose-50/80 to-red-50/80",
      description: "Trong danh mục",
      trend: "+25%",
    },
  ];

  // Pagination component
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
        <div className="text-sm text-orange-700/80">
          Hiển thị {indexOfFirstCategory + 1} đến{" "}
          {Math.min(indexOfLastCategory, filteredCategories.length)} của{" "}
          {filteredCategories.length} danh mục
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="group bg-white/80 hover:bg-white border-orange-200/50 hover:border-orange-300 rounded-2xl shadow-md"
          >
            <ChevronLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
            <span className="text-orange-800 font-semibold">Trước</span>
          </Button>

          <div className="flex items-center space-x-1">
            {getVisiblePages().map((page, index) => (
              <React.Fragment key={index}>
                {page === "..." ? (
                  <span className="px-3 py-2 text-orange-600/80">...</span>
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page as number)}
                      className={`min-w-[40px] transition-all rounded-2xl ${
                        currentPage === page
                          ? "bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-lg"
                          : "bg-white/80 hover:bg-white border-orange-200/50 hover:border-orange-300 text-orange-700 hover:text-orange-900"
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
            className="group bg-white/80 hover:bg-white border-orange-200/50 hover:border-orange-300 rounded-2xl shadow-md"
          >
            <span className="text-orange-800 font-semibold">Sau</span>
            <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </motion.div>
    );
  };

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
            <Tag className="w-8 h-8 text-orange-400 opacity-20" />
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
                  Đang tải danh mục...
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-pink-50">
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

      <div className="container relative z-10 px-4 py-8 mx-auto space-y-8">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-6 bg-gradient-to-r from-white/90 via-orange-50/90 to-pink-50/90 backdrop-blur-xl border border-orange-200/50 rounded-3xl shadow-lg"
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
                <Link to="/admin/blog">
                  <ArrowLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1 text-orange-600" />
                  <span className="font-semibold text-orange-800">
                    Quay lại Blog
                  </span>
                </Link>
              </Button>
            </motion.div>
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="flex items-center justify-center w-16 h-16 shadow-xl rounded-3xl bg-gradient-to-r from-orange-500 via-amber-500 to-pink-600"
              >
                <Tag className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-orange-600 via-amber-600 to-pink-600 bg-clip-text">
                  Quản lý danh mục
                </h1>
                <p className="text-orange-700/80 mt-1 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Tạo và quản lý danh mục cho bài viết blog</span>
                </p>
              </div>
            </div>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="transition-all duration-300 shadow-lg bg-gradient-to-r from-orange-500 via-amber-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 hover:shadow-xl rounded-2xl">
                  <Plus className="w-4 h-4 mr-2" />
                  <span className="font-semibold">Thêm danh mục</span>
                  <Sparkles className="w-4 h-4 ml-1" />
                </Button>
              </motion.div>
            </DialogTrigger>
            <DialogContent className="max-w-md bg-gradient-to-br from-white to-orange-50/80 border-0 shadow-2xl rounded-3xl">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-600 shadow-lg">
                    <Tag className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl text-transparent bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text font-bold">
                    {editingCategory
                      ? "Chỉnh sửa danh mục"
                      : "Tạo danh mục mới"}
                  </span>
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <motion.div className="space-y-2" whileFocus={{ scale: 1.01 }}>
                  <Label
                    htmlFor="name"
                    className="flex items-center space-x-2 text-sm font-semibold text-orange-800"
                  >
                    <Tag className="w-4 h-4" />
                    <span>Tên danh mục *</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="VD: Web Development"
                    {...register("name")}
                    className={`h-12 transition-all duration-300 bg-white/80 border-orange-200/50 rounded-2xl shadow-md focus:ring-2 focus:ring-orange-400/20 ${
                      errors.name ? "border-red-500 shake" : ""
                    }`}
                    disabled={isSaving}
                  />
                  {errors.name && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center space-x-1 text-sm text-red-500"
                    >
                      <X className="w-3 h-3" />
                      <span>{errors.name.message}</span>
                    </motion.p>
                  )}
                  {watch("name") && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-2 text-xs rounded text-orange-700/80 bg-orange-50/50"
                    >
                      <strong>Slug:</strong> {generateSlug(watch("name"))}
                    </motion.p>
                  )}
                </motion.div>

                <motion.div className="space-y-2" whileFocus={{ scale: 1.01 }}>
                  <Label
                    htmlFor="description"
                    className="flex items-center space-x-2 text-sm font-semibold text-orange-800"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Mô tả</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Mô tả ngắn về danh mục này..."
                    rows={3}
                    {...register("description")}
                    disabled={isSaving}
                    className="transition-all duration-300 resize-none bg-white/80 border-orange-200/50 rounded-2xl shadow-md focus:ring-2 focus:ring-orange-400/20"
                  />
                </motion.div>

                <motion.div className="space-y-2" whileFocus={{ scale: 1.01 }}>
                  <Label
                    htmlFor="color"
                    className="flex items-center space-x-2 text-sm font-semibold text-orange-800"
                  >
                    <Palette className="w-4 h-4" />
                    <span>Màu sắc *</span>
                  </Label>
                  <Select
                    value={watchedColor || "orange"}
                    onValueChange={(value) => setValue("color", value)}
                    disabled={isSaving}
                  >
                    <SelectTrigger
                      className={`h-12 bg-white/80 border-orange-200/50 rounded-2xl shadow-md ${errors.color ? "border-red-500" : ""}`}
                    >
                      <SelectValue placeholder="Chọn màu" />
                    </SelectTrigger>
                    <SelectContent>
                      {colorOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center space-x-2">
                            <motion.div
                              whileHover={{ scale: 1.2 }}
                              className="w-4 h-4 rounded-full shadow-md"
                              style={{ backgroundColor: option.color }}
                            />
                            <span>{option.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.color && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center space-x-1 text-sm text-red-500"
                    >
                      <X className="w-3 h-3" />
                      <span>{errors.color.message}</span>
                    </motion.p>
                  )}
                </motion.div>

                {/* Enhanced Preview */}
                {watch("name") && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-3"
                  >
                    <Label className="flex items-center space-x-2 text-sm font-semibold text-orange-800">
                      <Eye className="w-4 h-4" />
                      <span>Xem trước</span>
                    </Label>
                    <div className="p-4 border border-orange-200/50 rounded-2xl bg-gradient-to-r from-orange-50/50 to-pink-50/50">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white rounded-full shadow-lg"
                        style={{
                          backgroundColor: getCategoryColor(
                            watchedColor || "orange",
                          ),
                        }}
                      >
                        <Tag className="w-3 h-3 mr-2" />
                        {watch("name")}
                      </motion.div>
                    </div>
                  </motion.div>
                )}

                <div className="flex justify-end pt-4 space-x-3 border-t border-orange-200/50">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCloseDialog}
                      disabled={isSaving}
                      className="bg-white/80 border-orange-200/50 hover:border-orange-300 rounded-2xl shadow-md"
                    >
                      <X className="w-4 h-4 mr-2" />
                      <span className="text-orange-800 font-semibold">Hủy</span>
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      type="submit"
                      disabled={isSaving}
                      className="bg-gradient-to-r from-orange-500 via-amber-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 rounded-2xl shadow-lg"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          <span className="font-semibold">
                            {editingCategory
                              ? "Đang cập nhật..."
                              : "Đang tạo..."}
                          </span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          <span className="font-semibold">
                            {editingCategory ? "Cập nhật" : "Tạo mới"}
                          </span>
                        </>
                      )}
                    </Button>
                  </motion.div>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Enhanced Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-4 md:grid-cols-4"
          id="stats"
          data-animate
        >
          {statsCards.map((stat, index) => (
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
                      <TrendingUp
                        className={`w-2 h-2 ${
                          !stat.trend.startsWith("+") ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                    <span className="font-semibold">{stat.trend}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          id="search"
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
                      Tìm kiếm danh mục
                    </CardTitle>
                    <p className="text-sm text-orange-700/80 mt-1">
                      Tìm kiếm theo tên hoặc mô tả
                    </p>
                  </div>
                </div>
                <Badge className="bg-gradient-to-r from-orange-200 to-pink-200 text-orange-800 border-0 shadow-sm">
                  <Target className="w-3 h-3 mr-1" />
                  {filteredCategories.length} kết quả
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <motion.div className="relative" whileFocus={{ scale: 1.01 }}>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-pink-400/20 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />
                <div className="relative flex items-center space-x-3 p-4 bg-gradient-to-r from-white/90 to-orange-50/90 backdrop-blur-xl border border-orange-200/50 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <Search className="flex-shrink-0 w-5 h-5 text-orange-600 group-hover:text-orange-800 transition-colors" />
                  <Input
                    placeholder="Tìm kiếm danh mục theo tên hoặc mô tả..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 text-sm bg-transparent border-none outline-none placeholder:text-orange-500/60 text-orange-800 font-medium"
                  />
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Enhanced Categories List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          id="categories"
          data-animate
        >
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white/95 via-orange-50/80 to-pink-50/80 backdrop-blur-xl rounded-3xl overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg">
                    <Palette className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-transparent bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text font-bold">
                      Danh sách danh mục
                    </CardTitle>
                    <p className="text-sm text-green-700/80 mt-1">
                      Trang {currentPage} / {totalPages} -{" "}
                      {filteredCategories.length} danh mục được tìm thấy
                    </p>
                  </div>
                </div>
                <Badge className="bg-gradient-to-r from-green-200 to-emerald-200 text-green-800 border-0 shadow-sm">
                  <Activity className="w-3 h-3 mr-1" />
                  {currentCategories.length} hiển thị
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-muted/50 border-orange-200/30">
                      <TableHead className="font-semibold text-orange-800">
                        Danh mục
                      </TableHead>
                      <TableHead className="font-semibold text-orange-800">
                        Mô tả
                      </TableHead>
                      <TableHead className="font-semibold text-orange-800">
                        Slug
                      </TableHead>
                      <TableHead className="font-semibold text-orange-800">
                        Số bài viết
                      </TableHead>
                      <TableHead className="font-semibold text-orange-800 text-right">
                        Thao tác
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {currentCategories.map((category, index) => (
                        <motion.tr
                          key={category.id}
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
                                whileHover={{ scale: 1.2 }}
                                className="w-4 h-4 rounded-full shadow-md"
                                style={{
                                  backgroundColor: getCategoryColor(
                                    category.color,
                                  ),
                                }}
                              />
                              <span className="font-semibold transition-colors group-hover:text-orange-700 text-orange-900">
                                {category.name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-orange-700/80">
                              {category.description || "Chưa có mô tả"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <code className="px-2 py-1 font-mono text-xs rounded bg-orange-100 text-orange-800">
                              {category.slug}
                            </code>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold text-orange-800">
                                {category.postCount}
                              </span>
                              {category.postCount > 0 && (
                                <Badge
                                  variant="outline"
                                  className="text-xs text-green-800 bg-green-100 border-green-300"
                                >
                                  Có nội dung
                                </Badge>
                              )}
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
                                <DropdownMenuItem
                                  onClick={() => handleEdit(category)}
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Chỉnh sửa
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDelete(category.id)}
                                  className="text-red-600 focus:text-red-600"
                                  disabled={category.postCount > 0}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Xóa
                                  {category.postCount > 0 && (
                                    <span className="ml-1 text-xs">
                                      (Có bài viết)
                                    </span>
                                  )}
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

              {/* Enhanced Empty State */}
              {filteredCategories.length === 0 && (
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
                      <Tag className="w-20 h-20 mx-auto text-orange-400/50" />
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
                    {searchQuery
                      ? "Không tìm thấy danh mục"
                      : "Chưa có danh mục nào"}
                  </h3>
                  <p className="max-w-md mx-auto mb-6 text-orange-700/80 leading-relaxed">
                    {searchQuery
                      ? "Thử thay đổi từ khóa tìm kiếm hoặc tạo danh mục mới."
                      : "Tạo danh mục đầu tiên để phân loại bài viết blog của bạn."}
                  </p>
                  <div className="space-y-4">
                    <div className="flex justify-center space-x-3">
                      {searchQuery && (
                        <Button
                          onClick={() => setSearchQuery("")}
                          variant="outline"
                          className="bg-white/80 hover:bg-white border-orange-200/50 hover:border-orange-300 rounded-2xl shadow-md"
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          <span className="text-orange-800 font-semibold">
                            Xóa tìm kiếm
                          </span>
                        </Button>
                      )}
                      <Button
                        onClick={() => setIsDialogOpen(true)}
                        className="bg-gradient-to-r from-orange-500 via-amber-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 rounded-2xl shadow-lg"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        <span className="font-semibold">
                          {searchQuery
                            ? "Tạo danh mục mới"
                            : "Tạo danh mục đầu tiên"}
                        </span>
                        <Sparkles className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Pagination Component */}
              <PaginationComponent />
            </CardContent>
          </Card>
        </motion.div>

        {/* Enhanced Color Reference */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          id="colors"
          data-animate
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white/95 via-purple-50/80 to-pink-50/80 backdrop-blur-xl rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text font-bold">
                  Bảng màu tham khảo
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {colorOptions.map((option, index) => (
                  <motion.div
                    key={option.value}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="flex items-center p-4 space-x-3 transition-all duration-300 bg-white/80 border border-orange-200/50 rounded-2xl hover:shadow-md group hover:border-orange-300/50"
                  >
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.3 }}
                      className="w-8 h-8 rounded-full shadow-lg"
                      style={{ backgroundColor: option.color }}
                    />
                    <div>
                      <div className="text-sm font-semibold transition-colors group-hover:text-orange-700 text-orange-900">
                        {option.label}
                      </div>
                      <div className="font-mono text-xs text-orange-600/80">
                        {option.color}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default BlogCategories;
