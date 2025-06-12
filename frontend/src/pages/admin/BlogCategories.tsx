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
import { useAuth } from "@/contexts/AuthContext";
import { isAdmin } from "@/lib/auth";
import { BlogCategory } from "@/types/blog";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/blog";
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
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast({
          title: "Lỗi tải dữ liệu",
          description: "Không thể tải danh sách danh mục",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
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
            title: "Cập nhật thành công",
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
            title: "Tạo thành công",
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
        title: "Lỗi",
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
          title: "Đã xóa danh mục",
          description: "Danh mục đã được xóa khỏi hệ thống.",
        });
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        title: "Lỗi xóa danh mục",
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Đang tải dữ liệu...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/admin/blog">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Quay lại Blog
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
              Quản lý danh mục
            </h1>
            <p className="text-muted-foreground">
              Tạo và quản lý danh mục cho bài viết blog
            </p>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Thêm danh mục
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Chỉnh sửa danh mục" : "Tạo danh mục mới"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tên danh mục *</Label>
                <Input
                  id="name"
                  placeholder="VD: Web Development"
                  {...register("name")}
                  className={errors.name ? "border-red-500" : ""}
                  disabled={isSaving}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
                {watch("name") && (
                  <p className="text-xs text-muted-foreground">
                    Slug: {generateSlug(watch("name"))}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  placeholder="Mô tả ngắn về danh mục này..."
                  rows={3}
                  {...register("description")}
                  disabled={isSaving}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">Màu sắc *</Label>
                <Select
                  value={watchedColor || "blue"}
                  onValueChange={(value) => setValue("color", value)}
                  disabled={isSaving}
                >
                  <SelectTrigger
                    className={errors.color ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Chọn màu" />
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: option.color }}
                          />
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.color && (
                  <p className="text-sm text-red-500">{errors.color.message}</p>
                )}
              </div>

              {/* Preview */}
              {watch("name") && (
                <div className="space-y-2">
                  <Label>Xem trước</Label>
                  <div className="p-3 border rounded-lg">
                    <div
                      className="inline-flex items-center px-3 py-1 text-sm font-medium text-white rounded-full"
                      style={{
                        backgroundColor: getCategoryColor(
                          watchedColor || "blue",
                        ),
                      }}
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {watch("name")}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-4 space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseDialog}
                  disabled={isSaving}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {editingCategory ? "Cập nhật" : "Tạo mới"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Palette className="w-5 h-5" />
            <span>Danh sách danh mục ({categories.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Danh mục</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Số bài viết</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{
                            backgroundColor: getCategoryColor(category.color),
                          }}
                        />
                        <span className="font-medium">{category.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-muted-foreground">
                        {category.description || "Chưa có mô tả"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <code className="px-2 py-1 text-xs rounded bg-muted">
                        {category.slug}
                      </code>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{category.postCount}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
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
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {categories.length === 0 && (
            <div className="py-8 text-center">
              <Tag className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">
                Chưa có danh mục nào
              </h3>
              <p className="mb-4 text-muted-foreground">
                Tạo danh mục đầu tiên để phân loại bài viết
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Tạo danh mục đầu tiên
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Color Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Bảng màu tham khảo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {colorOptions.map((option) => (
              <div
                key={option.value}
                className="flex items-center p-2 space-x-2 border rounded"
              >
                <div
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: option.color }}
                />
                <div>
                  <div className="text-sm font-medium">{option.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {option.color}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogCategories;
