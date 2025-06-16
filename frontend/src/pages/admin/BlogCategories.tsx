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
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

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

  if (!user || !isAdmin(user)) {
    return <Navigate to="/" replace />;
  }

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
      color: "blue",
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
        toast({
          title: "✅ Đã tải danh mục",
          description: `Tải thành công ${data.length} danh mục.`,
        });
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast({
          title: "❌ Lỗi tải dữ liệu",
          description: "Không thể tải danh sách danh mục",
          variant: "destructive",
        });
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
    { value: "blue", label: "Xanh dương", color: "#3b82f6" },
    { value: "purple", label: "Tím", color: "#8b5cf6" },
    { value: "green", label: "Xanh lá", color: "#10b981" },
    { value: "orange", label: "Cam", color: "#f59e0b" },
    { value: "red", label: "Đỏ", color: "#ef4444" },
    { value: "pink", label: "Hồng", color: "#ec4899" },
    { value: "indigo", label: "Chàm", color: "#6366f1" },
    { value: "teal", label: "Xanh ngọc", color: "#14b8a6" },
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

  // ✅ Filter categories
  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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

          toast({
            title: "✅ Cập nhật thành công",
            description: "Danh mục đã được cập nhật.",
          });
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

          toast({
            title: "✅ Tạo thành công",
            description: "Danh mục mới đã được tạo.",
          });
        } else {
          throw new Error("Không thể tạo danh mục");
        }
      }

      setIsDialogOpen(false);
      setEditingCategory(null);
      reset();
    } catch (error) {
      console.error("Error saving category:", error);
      toast({
        title: "❌ Lỗi",
        description:
          error instanceof Error
            ? error.message
            : "Có lỗi xảy ra khi lưu danh mục",
        variant: "destructive",
      });
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

        toast({
          title: "🗑️ Đã xóa danh mục",
          description: "Danh mục đã được xóa khỏi hệ thống.",
        });
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        title: "❌ Lỗi xóa danh mục",
        description:
          error instanceof Error
            ? error.message
            : "Có lỗi xảy ra khi xóa danh mục",
        variant: "destructive",
      });
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingCategory(null);
    reset();
  };

  const getCategoryColor = (color: string) => {
    const colorOption = colorOptions.find((opt) => opt.value === color);
    return colorOption?.color || "#3b82f6";
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
      gradient: "from-blue-500 to-cyan-500",
      bgGradient:
        "from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20",
      description: "Tất cả danh mục",
    },
    {
      title: "Có bài viết",
      value: stats.withPosts,
      icon: BarChart3,
      gradient: "from-green-500 to-emerald-500",
      bgGradient:
        "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
      description: "Đã có nội dung",
    },
    {
      title: "Chưa có bài",
      value: stats.empty,
      icon: Activity,
      gradient: "from-orange-500 to-amber-500",
      bgGradient:
        "from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20",
      description: "Chờ nội dung",
    },
    {
      title: "Tổng bài viết",
      value: stats.totalPosts,
      icon: Eye,
      gradient: "from-purple-500 to-violet-500",
      bgGradient:
        "from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20",
      description: "Trong danh mục",
    },
  ];

  // ✅ Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
        {/* Floating Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 animate-float">
            <Tag className="w-8 h-8 text-blue-500 opacity-20" />
          </div>
          <div className="absolute top-1/3 right-1/4 animate-float-delay-1">
            <Palette className="w-6 h-6 text-purple-500 opacity-20" />
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
                <h2 className="mb-2 text-xl font-semibold">
                  Đang tải danh mục...
                </h2>
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
                <Link to="/admin/blog">
                  <ArrowLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
                  Quay lại Blog
                </Link>
              </Button>
            </motion.div>
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="flex items-center justify-center w-12 h-12 shadow-lg rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600"
              >
                <Tag className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text">
                  Quản lý danh mục
                </h1>
                <p className="text-muted-foreground">
                  Tạo và quản lý danh mục cho bài viết blog
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
                <Button className="transition-all duration-300 shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl">
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm danh mục
                </Button>
              </motion.div>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                    <Tag className="w-4 h-4 text-white" />
                  </div>
                  <span>
                    {editingCategory
                      ? "Chỉnh sửa danh mục"
                      : "Tạo danh mục mới"}
                  </span>
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <motion.div className="space-y-2" whileFocus={{ scale: 1.01 }}>
                  <Label htmlFor="name" className="flex items-center space-x-2">
                    <Tag className="w-4 h-4" />
                    <span>Tên danh mục *</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="VD: Web Development"
                    {...register("name")}
                    className={`h-12 transition-all duration-300 ${
                      errors.name
                        ? "border-red-500 shake"
                        : "focus:ring-2 focus:ring-primary/20"
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
                      className="p-2 text-xs rounded text-muted-foreground bg-muted/50"
                    >
                      <strong>Slug:</strong> {generateSlug(watch("name"))}
                    </motion.p>
                  )}
                </motion.div>

                <motion.div className="space-y-2" whileFocus={{ scale: 1.01 }}>
                  <Label
                    htmlFor="description"
                    className="flex items-center space-x-2"
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
                    className="transition-all duration-300 resize-none focus:ring-2 focus:ring-primary/20"
                  />
                </motion.div>

                <motion.div className="space-y-2" whileFocus={{ scale: 1.01 }}>
                  <Label
                    htmlFor="color"
                    className="flex items-center space-x-2"
                  >
                    <Palette className="w-4 h-4" />
                    <span>Màu sắc *</span>
                  </Label>
                  <Select
                    value={watchedColor || "blue"}
                    onValueChange={(value) => setValue("color", value)}
                    disabled={isSaving}
                  >
                    <SelectTrigger
                      className={`h-12 ${errors.color ? "border-red-500" : ""}`}
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

                {/* ✅ Enhanced Preview */}
                {watch("name") && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-3"
                  >
                    <Label className="flex items-center space-x-2">
                      <Eye className="w-4 h-4" />
                      <span>Xem trước</span>
                    </Label>
                    <div className="p-4 border rounded-xl bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white rounded-full shadow-lg"
                        style={{
                          backgroundColor: getCategoryColor(
                            watchedColor || "blue",
                          ),
                        }}
                      >
                        <Tag className="w-3 h-3 mr-2" />
                        {watch("name")}
                      </motion.div>
                    </div>
                  </motion.div>
                )}

                <div className="flex justify-end pt-4 space-x-3 border-t">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCloseDialog}
                      disabled={isSaving}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Hủy
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      type="submit"
                      disabled={isSaving}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    >
                      {isSaving ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="w-4 h-4 mr-2 border-2 border-white rounded-full border-t-transparent"
                          />
                          {editingCategory ? "Đang cập nhật..." : "Đang tạo..."}
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          {editingCategory ? "Cập nhật" : "Tạo mới"}
                        </>
                      )}
                    </Button>
                  </motion.div>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* ✅ Enhanced Stats Cards */}
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

        {/* ✅ Enhanced Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          id="search"
          data-animate
        >
          <Card className="border-0 shadow-lg bg-gradient-to-r from-white to-blue-50 dark:from-slate-800 dark:to-blue-900">
            <CardContent className="pt-6">
              <motion.div className="relative" whileFocus={{ scale: 1.01 }}>
                <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm danh mục theo tên hoặc mô tả..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 pl-10 transition-all duration-300 border-0 bg-background/50 focus:ring-2 focus:ring-primary/20"
                />
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ✅ Enhanced Categories List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          id="categories"
          data-animate
        >
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500">
                    <Palette className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-transparent bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text">
                      Danh sách danh mục
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {filteredCategories.length} danh mục được tìm thấy
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-blue-800 bg-blue-100">
                  <Activity className="w-3 h-3 mr-1" />
                  {filteredCategories.length} kết quả
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-muted/50">
                      <TableHead className="font-semibold">Danh mục</TableHead>
                      <TableHead className="font-semibold">Mô tả</TableHead>
                      <TableHead className="font-semibold">Slug</TableHead>
                      <TableHead className="font-semibold">
                        Số bài viết
                      </TableHead>
                      <TableHead className="font-semibold text-right">
                        Thao tác
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {filteredCategories.map((category, index) => (
                        <motion.tr
                          key={category.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                          className="transition-all duration-300 group hover:shadow-md"
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
                              <span className="font-medium transition-colors group-hover:text-primary">
                                {category.name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-muted-foreground">
                              {category.description || "Chưa có mô tả"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <code className="px-2 py-1 font-mono text-xs rounded bg-muted">
                              {category.slug}
                            </code>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">
                                {category.postCount}
                              </span>
                              {category.postCount > 0 && (
                                <Badge
                                  variant="outline"
                                  className="text-xs text-green-800 bg-green-100"
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
                                    className="group/btn"
                                  >
                                    <MoreHorizontal className="w-4 h-4 transition-colors group-hover/btn:text-primary" />
                                  </Button>
                                </motion.div>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleEdit(category)}
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Chỉnh sửa
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDelete(category.id)}
                                  className="text-red-600"
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

              {/* ✅ Enhanced Empty State */}
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
                  >
                    <Tag className="w-20 h-20 mx-auto mb-6 text-muted-foreground" />
                  </motion.div>
                  <h3 className="mb-4 text-2xl font-semibold">
                    {searchQuery
                      ? "Không tìm thấy danh mục"
                      : "Chưa có danh mục nào"}
                  </h3>
                  <p className="max-w-md mx-auto mb-6 text-muted-foreground">
                    {searchQuery
                      ? "Thử thay đổi từ khóa tìm kiếm hoặc tạo danh mục mới."
                      : "Tạo danh mục đầu tiên để phân loại bài viết blog của bạn."}
                  </p>
                  <div className="space-y-3">
                    {searchQuery && (
                      <Button
                        onClick={() => setSearchQuery("")}
                        variant="outline"
                        className="mr-3"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Xóa tìm kiếm
                      </Button>
                    )}
                    <Button
                      onClick={() => setIsDialogOpen(true)}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {searchQuery
                        ? "Tạo danh mục mới"
                        : "Tạo danh mục đầu tiên"}
                    </Button>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* ✅ Enhanced Color Reference */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          id="colors"
          data-animate
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50 dark:from-slate-800 dark:to-purple-900">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text">
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
                    className="flex items-center p-4 space-x-3 transition-all duration-300 bg-white border rounded-xl hover:shadow-md group dark:bg-slate-800"
                  >
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.3 }}
                      className="w-8 h-8 rounded-full shadow-lg"
                      style={{ backgroundColor: option.color }}
                    />
                    <div>
                      <div className="text-sm font-medium transition-colors group-hover:text-primary">
                        {option.label}
                      </div>
                      <div className="font-mono text-xs text-muted-foreground">
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
