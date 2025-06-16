import React, { useState, useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { isAdmin } from "@/lib/auth";
import { BlogPost, BlogCategory } from "@/types/blog";
import { uploadFileToCloudinary } from "@/lib/uploadFileToCloudinary";
import {
  getAllCategories,
  getPostById,
  createBlogPost,
  updateBlogPost,
} from "@/lib/blog";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Save,
  Eye,
  Upload,
  X,
  Plus,
  Calendar,
  User,
  Hash,
  FileText,
  Image,
  Settings,
  Loader2,
  Coffee,
  Code,
  Palette,
  Sparkles,
  Globe,
  Target,
  Clock,
  BarChart3,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const blogPostSchema = z.object({
  title: z.string().min(5, "Tiêu đề phải có ít nhất 5 ký tự"),
  excerpt: z.string().min(20, "Tóm tắt phải có ít nhất 20 ký tự"),
  content: z.string().min(100, "Nội dung phải có ít nhất 100 ký tự"),
  categoryId: z.string().min(1, "Vui lòng chọn danh mục"),
  featuredImage: z.string().url("URL hình ảnh không hợp lệ"),
  tags: z.string().optional().default(""),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.string().optional(),
});

type BlogPostFormData = z.infer<typeof blogPostSchema>;

const BlogCreate: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileInfo, setUploadedFileInfo] = useState<{
    size: string;
    format: string;
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [existingPost, setExistingPost] = useState<BlogPost | null>(null);
  const [activeTab, setActiveTab] = useState("content");
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});

  if (!user || !isAdmin(user)) {
    return <Navigate to="/" replace />;
  }

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      isPublished: false,
      isFeatured: false,
      categoryId: "",
      featuredImage:
        "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop",
    },
  });

  const watchedValues = watch();

  // Fetch data từ Supabase
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch categories
        const categoriesData = await getAllCategories();
        setCategories(categoriesData);

        // Fetch existing post nếu đang edit
        if (isEdit && id) {
          const postData = await getPostById(id);
          if (postData) {
            setExistingPost(postData);
            // Reset form với dữ liệu từ database
            reset({
              title: postData.title,
              excerpt: postData.excerpt,
              content: postData.content,
              categoryId: postData.category.id,
              featuredImage: postData.featuredImage,
              tags: postData.tags.join(", "),
              isPublished: postData.isPublished,
              isFeatured: postData.isFeatured,
              metaTitle: postData.seo?.metaTitle || "",
              metaDescription: postData.seo?.metaDescription || "",
              keywords: postData.seo?.keywords?.join(", ") || "",
            });
          } else {
            toast({
              title: "❌ Lỗi",
              description: "Không tìm thấy bài viết",
              variant: "destructive",
            });
            navigate("/admin/blog");
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "❌ Lỗi tải dữ liệu",
          description: "Không thể tải dữ liệu. Vui lòng thử lại.",
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
  }, [isEdit, id, reset, navigate]);

  const onSubmit = async (data: BlogPostFormData, saveAsDraft = false) => {
    setIsSaving(true);
    setIsDraft(saveAsDraft);

    try {
      // Tìm category object
      const selectedCategory = categories.find(
        (cat) => cat.id === data.categoryId,
      );

      if (!selectedCategory) {
        throw new Error("Không tìm thấy danh mục được chọn");
      }

      const postData: Partial<BlogPost> = {
        title: data.title,
        slug: generateSlug(data.title),
        excerpt: data.excerpt,
        content: data.content,
        featuredImage: data.featuredImage,
        category: selectedCategory,
        tags: data.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        isPublished: saveAsDraft ? false : data.isPublished,
        isFeatured: data.isFeatured,
        readTime: Math.ceil(data.content.length / 1000),
        seo: {
          metaTitle: data.metaTitle || data.title,
          metaDescription: data.metaDescription || data.excerpt,
          keywords: data.keywords
            ? data.keywords
                .split(",")
                .map((k) => k.trim())
                .filter(Boolean)
            : [],
        },
      };

      let result;
      if (isEdit && id) {
        // Cập nhật bài viết
        result = await updateBlogPost(id, postData);
        if (!result) {
          throw new Error("Không thể cập nhật bài viết");
        }
      } else {
        // Tạo bài viết mới
        result = await createBlogPost(postData);
        if (!result) {
          throw new Error("Không thể tạo bài viết");
        }
      }

      toast({
        title: isEdit
          ? "✅ Bài viết đã được cập nhật"
          : "✅ Bài viết đã được tạo",
        description: saveAsDraft
          ? "Bài viết đã được lưu dưới dạng bản nháp"
          : data.isPublished
            ? "Bài viết đã được xuất bản thành công"
            : "Bài viết đã được lưu",
      });

      navigate("/admin/blog");
    } catch (error) {
      console.error("Error saving post:", error);
      toast({
        title: "❌ Lỗi",
        description:
          error instanceof Error
            ? error.message
            : "Có lỗi xảy ra khi lưu bài viết",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
      setIsDraft(false);
    }
  };

  const handleSaveAsDraft = () => {
    handleSubmit((data) => onSubmit(data, true))();
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove accents
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const tabsConfig = [
    {
      id: "content",
      label: "Nội dung",
      icon: FileText,
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "media",
      label: "Hình ảnh",
      icon: Image,
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "seo",
      label: "SEO",
      icon: Globe,
      color: "from-green-500 to-emerald-500",
    },
  ];

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
            <Image className="w-6 h-6 text-purple-500 opacity-20" />
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
                  Đang tải dữ liệu...
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
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/admin/blog")}
                className="group"
              >
                <ArrowLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
                Quay lại
              </Button>
            </motion.div>
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="flex items-center justify-center w-12 h-12 shadow-lg rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600"
              >
                {isEdit ? (
                  <Settings className="w-6 h-6 text-white" />
                ) : (
                  <Plus className="w-6 h-6 text-white" />
                )}
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text">
                  {isEdit ? "Chỉnh sửa bài viết" : "Viết bài mới"}
                </h1>
                <p className="text-muted-foreground">
                  {isEdit
                    ? "Cập nhật nội dung bài viết"
                    : "Tạo bài viết mới cho blog"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                onClick={handleSaveAsDraft}
                disabled={isSaving}
                className="group"
              >
                {isSaving && isDraft ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-4 h-4 mr-2 border-2 border-current rounded-full border-t-transparent"
                  />
                ) : (
                  <FileText className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
                )}
                Lưu nháp
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleSubmit((data) => onSubmit(data, false))}
                disabled={isSaving}
                className="transition-all duration-300 shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl"
              >
                {isSaving && !isDraft ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-4 h-4 mr-2 border-2 border-white rounded-full border-t-transparent"
                  />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {isEdit ? "Cập nhật" : "Xuất bản"}
              </Button>
            </motion.div>
          </div>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* ✅ Enhanced Main Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6 lg:col-span-2"
            id="main-content"
            data-animate
          >
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3 mb-8 bg-gradient-to-r from-white to-blue-50 dark:from-slate-800 dark:to-blue-900">
                {tabsConfig.map((tab, index) => (
                  <motion.div
                    key={tab.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <TabsTrigger
                      value={tab.id}
                      className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300"
                    >
                      <tab.icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </TabsTrigger>
                  </motion.div>
                ))}
              </TabsList>

              <AnimatePresence>
                {/* ✅ Content Tab */}
                <TabsContent value="content" className="space-y-6">
                  <motion.div
                    key="content-tab"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-blue-900">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500">
                            <FileText className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <span className="text-xl text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text">
                              Nội dung bài viết
                            </span>
                            <p className="mt-1 text-sm text-muted-foreground">
                              Nhập thông tin cơ bản về bài viết
                            </p>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <motion.div
                          className="space-y-2"
                          whileFocus={{ scale: 1.01 }}
                        >
                          <Label
                            htmlFor="title"
                            className="flex items-center space-x-2"
                          >
                            <FileText className="w-4 h-4" />
                            <span>Tiêu đề *</span>
                          </Label>
                          <Input
                            id="title"
                            placeholder="Nhập tiêu đề bài viết..."
                            {...register("title")}
                            className={`h-12 transition-all duration-300 ${
                              errors.title
                                ? "border-red-500 shake"
                                : "focus:ring-2 focus:ring-primary/20"
                            }`}
                          />
                          {errors.title && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-center space-x-1 text-sm text-red-500"
                            >
                              <AlertTriangle className="w-3 h-3" />
                              <span>{errors.title.message}</span>
                            </motion.p>
                          )}
                          {watchedValues.title && (
                            <motion.p
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="p-2 text-xs rounded text-muted-foreground bg-muted/50"
                            >
                              <strong>Slug:</strong>{" "}
                              {generateSlug(watchedValues.title)}
                            </motion.p>
                          )}
                          <div className="text-xs text-muted-foreground">
                            {watchedValues.title?.length || 0}/100 ký tự
                          </div>
                        </motion.div>

                        <motion.div
                          className="space-y-2"
                          whileFocus={{ scale: 1.01 }}
                        >
                          <Label
                            htmlFor="excerpt"
                            className="flex items-center space-x-2"
                          >
                            <BarChart3 className="w-4 h-4" />
                            <span>Tóm tắt *</span>
                          </Label>
                          <Textarea
                            id="excerpt"
                            placeholder="Viết tóm tắt ngắn gọn về bài viết..."
                            rows={3}
                            {...register("excerpt")}
                            className={`resize-none transition-all duration-300 ${
                              errors.excerpt
                                ? "border-red-500 shake"
                                : "focus:ring-2 focus:ring-primary/20"
                            }`}
                          />
                          {errors.excerpt && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-center space-x-1 text-sm text-red-500"
                            >
                              <AlertTriangle className="w-3 h-3" />
                              <span>{errors.excerpt.message}</span>
                            </motion.p>
                          )}
                          <div className="text-xs text-muted-foreground">
                            {watchedValues.excerpt?.length || 0}/300 ký tự
                          </div>
                        </motion.div>

                        <motion.div
                          className="space-y-2"
                          whileFocus={{ scale: 1.01 }}
                        >
                          <Label
                            htmlFor="content"
                            className="flex items-center space-x-2"
                          >
                            <FileText className="w-4 h-4" />
                            <span>Nội dung *</span>
                          </Label>
                          <Textarea
                            id="content"
                            placeholder="Viết nội dung bài viết ở đây... Hỗ trợ Markdown."
                            rows={15}
                            {...register("content")}
                            className={`resize-none transition-all duration-300 ${
                              errors.content
                                ? "border-red-500 shake"
                                : "focus:ring-2 focus:ring-primary/20"
                            }`}
                          />
                          {errors.content && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-center space-x-1 text-sm text-red-500"
                            >
                              <AlertTriangle className="w-3 h-3" />
                              <span>{errors.content.message}</span>
                            </motion.p>
                          )}
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>
                              {watchedValues.content?.length || 0} ký tự
                            </span>
                            <span>•</span>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>
                                Thời gian đọc: ~
                                {Math.ceil(
                                  (watchedValues.content?.length || 0) / 1000,
                                )}{" "}
                                phút
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>

                {/* ✅ Media Tab */}
                <TabsContent value="media" className="space-y-6">
                  <motion.div
                    key="media-tab"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50 dark:from-slate-800 dark:to-purple-900">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
                            <Image className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <span className="text-xl text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text">
                              Hình ảnh đại diện
                            </span>
                            <p className="mt-1 text-sm text-muted-foreground">
                              Tải lên hình ảnh cho bài viết
                            </p>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <motion.div
                          className="space-y-2"
                          whileFocus={{ scale: 1.01 }}
                        >
                          <Label
                            htmlFor="featuredImage"
                            className="flex items-center space-x-2"
                          >
                            <Image className="w-4 h-4" />
                            <span>URL hình ảnh *</span>
                          </Label>
                          <Input
                            id="featuredImage"
                            placeholder="https://example.com/image.jpg"
                            {...register("featuredImage")}
                            className={`transition-all duration-300 ${
                              errors.featuredImage
                                ? "border-red-500"
                                : "focus:ring-2 focus:ring-primary/20"
                            }`}
                          />
                          {errors.featuredImage && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-center space-x-1 text-sm text-red-500"
                            >
                              <AlertTriangle className="w-3 h-3" />
                              <span>{errors.featuredImage.message}</span>
                            </motion.p>
                          )}
                        </motion.div>

                        {/* ✅ Enhanced Drag & Drop Upload */}
                        <div className="space-y-4">
                          <Label>Hoặc tải ảnh lên</Label>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="p-8 text-center transition-all duration-300 border-2 border-dashed cursor-pointer rounded-xl border-muted hover:border-primary/50 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900"
                            onClick={() =>
                              document.getElementById("file-upload")?.click()
                            }
                            onDragOver={(e) => {
                              e.preventDefault();
                              e.currentTarget.classList.add(
                                "border-primary",
                                "bg-primary/5",
                              );
                            }}
                            onDragLeave={(e) => {
                              e.preventDefault();
                              e.currentTarget.classList.remove(
                                "border-primary",
                                "bg-primary/5",
                              );
                            }}
                            onDrop={async (e) => {
                              e.preventDefault();
                              e.currentTarget.classList.remove(
                                "border-primary",
                                "bg-primary/5",
                              );

                              const files = Array.from(e.dataTransfer.files);
                              const file = files[0];

                              if (!file || !file.type.startsWith("image/")) {
                                toast({
                                  title: "❌ Lỗi định dạng",
                                  description: "Vui lòng chọn file ảnh hợp lệ",
                                  variant: "destructive",
                                });
                                return;
                              }

                              if (file.size > 5 * 1024 * 1024) {
                                toast({
                                  title: "❌ Lỗi kích thước",
                                  description:
                                    "Kích thước ảnh phải nhỏ hơn 5MB",
                                  variant: "destructive",
                                });
                                return;
                              }

                              setIsUploading(true);
                              try {
                                const result =
                                  await uploadFileToCloudinary(file);
                                setSelectedFileUrl(result.url);
                                setUploadedFileInfo({
                                  size: result.size,
                                  format: result.format,
                                });
                                setValue("featuredImage", result.url);

                                toast({
                                  title: "✅ Upload thành công",
                                  description: `Ảnh đã được tải lên (${result.size}, ${result.format})`,
                                });
                              } catch (error) {
                                toast({
                                  title: "❌ Lỗi upload",
                                  description: "Có lỗi xảy ra khi tải ảnh",
                                  variant: "destructive",
                                });
                              } finally {
                                setIsUploading(false);
                              }
                            }}
                          >
                            <motion.div
                              animate={isUploading ? { rotate: 360 } : {}}
                              transition={{
                                duration: 1,
                                repeat: isUploading ? Infinity : 0,
                                ease: "linear",
                              }}
                            >
                              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                            </motion.div>
                            <p className="mb-2 text-lg font-medium">
                              {isUploading
                                ? "Đang tải lên..."
                                : "Kéo thả hoặc click để tải ảnh lên"}
                            </p>
                            <p className="mb-4 text-sm text-muted-foreground">
                              PNG, JPG, WEBP tối đa 5MB
                            </p>
                            <Button
                              variant="outline"
                              size="lg"
                              disabled={isUploading}
                              className="transition-all duration-300 bg-white/50 hover:bg-white/80"
                            >
                              {isUploading ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Đang tải...
                                </>
                              ) : (
                                <>
                                  <Upload className="w-4 h-4 mr-2" />
                                  Chọn file
                                </>
                              )}
                            </Button>

                            <input
                              id="file-upload"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;

                                const validTypes = [
                                  "image/jpeg",
                                  "image/png",
                                  "image/gif",
                                  "image/webp",
                                ];
                                if (!validTypes.includes(file.type)) {
                                  toast({
                                    title: "❌ Lỗi định dạng",
                                    description:
                                      "Vui lòng chọn file ảnh hợp lệ",
                                    variant: "destructive",
                                  });
                                  return;
                                }

                                if (file.size > 5 * 1024 * 1024) {
                                  toast({
                                    title: "❌ Lỗi kích thước",
                                    description:
                                      "Kích thước ảnh phải nhỏ hơn 5MB",
                                    variant: "destructive",
                                  });
                                  return;
                                }

                                setIsUploading(true);
                                try {
                                  const result =
                                    await uploadFileToCloudinary(file);
                                  setSelectedFileUrl(result.url);
                                  setUploadedFileInfo({
                                    size: result.size,
                                    format: result.format,
                                  });
                                  setValue("featuredImage", result.url);

                                  toast({
                                    title: "✅ Upload thành công",
                                    description: `Ảnh đã được tải lên (${result.size}, ${result.format})`,
                                  });
                                } catch (error) {
                                  toast({
                                    title: "❌ Lỗi upload",
                                    description: "Có lỗi xảy ra khi tải ảnh",
                                    variant: "destructive",
                                  });
                                } finally {
                                  setIsUploading(false);
                                }
                              }}
                            />
                          </motion.div>
                        </div>

                        {/* ✅ Enhanced Preview */}
                        {(selectedFileUrl || watchedValues.featuredImage) && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-4"
                          >
                            <Label className="flex items-center space-x-2">
                              <Eye className="w-4 h-4" />
                              <span>Xem trước</span>
                            </Label>
                            <div className="relative overflow-hidden shadow-lg rounded-xl group">
                              <img
                                src={
                                  selectedFileUrl || watchedValues.featuredImage
                                }
                                alt="Featured"
                                className="object-cover w-full h-64 transition-transform duration-500 group-hover:scale-105"
                                onError={(e) => {
                                  e.currentTarget.src =
                                    "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop";
                                }}
                              />
                              <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-black/50 to-transparent group-hover:opacity-100">
                                <div className="absolute text-white bottom-4 left-4">
                                  <div className="font-medium">
                                    {watchedValues.title || "Tiêu đề bài viết"}
                                  </div>
                                  <div className="text-sm opacity-90">
                                    {user.name}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {selectedFileUrl && uploadedFileInfo && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center justify-between p-4 border border-green-200 rounded-lg bg-green-50 dark:bg-green-900/20"
                              >
                                <div className="flex items-center space-x-2">
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                  <span className="text-sm text-green-800 dark:text-green-300">
                                    ✓ Upload thành công
                                  </span>
                                  <span className="text-xs text-green-600 dark:text-green-400">
                                    {uploadedFileInfo.size} •{" "}
                                    {uploadedFileInfo.format}
                                  </span>
                                </div>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => {
                                    setSelectedFileUrl(null);
                                    setUploadedFileInfo(null);
                                    setValue("featuredImage", "");
                                  }}
                                  className="text-green-600 transition-colors hover:text-green-800"
                                >
                                  <X className="w-4 h-4" />
                                </motion.button>
                              </motion.div>
                            )}
                          </motion.div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>

                {/* ✅ SEO Tab */}
                <TabsContent value="seo" className="space-y-6">
                  <motion.div
                    key="seo-tab"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-green-50 dark:from-slate-800 dark:to-green-900">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500">
                            <Globe className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <span className="text-xl text-transparent bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text">
                              Tối ưu SEO
                            </span>
                            <p className="mt-1 text-sm text-muted-foreground">
                              Tối ưu hóa cho công cụ tìm kiếm
                            </p>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <motion.div
                          className="space-y-2"
                          whileFocus={{ scale: 1.01 }}
                        >
                          <Label
                            htmlFor="metaTitle"
                            className="flex items-center space-x-2"
                          >
                            <Target className="w-4 h-4" />
                            <span>Meta Title</span>
                          </Label>
                          <Input
                            id="metaTitle"
                            placeholder="Tiêu đề SEO (để trống sẽ dùng tiêu đề bài viết)"
                            {...register("metaTitle")}
                            className="h-12 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                          />
                          <div className="text-xs text-muted-foreground">
                            {
                              (
                                watchedValues.metaTitle ||
                                watchedValues.title ||
                                ""
                              ).length
                            }
                            /60 ký tự
                          </div>
                        </motion.div>

                        <motion.div
                          className="space-y-2"
                          whileFocus={{ scale: 1.01 }}
                        >
                          <Label
                            htmlFor="metaDescription"
                            className="flex items-center space-x-2"
                          >
                            <FileText className="w-4 h-4" />
                            <span>Meta Description</span>
                          </Label>
                          <Textarea
                            id="metaDescription"
                            placeholder="Mô tả SEO (để trống sẽ dùng tóm tắt bài viết)"
                            rows={3}
                            {...register("metaDescription")}
                            className="transition-all duration-300 resize-none focus:ring-2 focus:ring-primary/20"
                          />
                          <div className="text-xs text-muted-foreground">
                            {
                              (
                                watchedValues.metaDescription ||
                                watchedValues.excerpt ||
                                ""
                              ).length
                            }
                            /160 ký tự
                          </div>
                        </motion.div>

                        <motion.div
                          className="space-y-2"
                          whileFocus={{ scale: 1.01 }}
                        >
                          <Label
                            htmlFor="keywords"
                            className="flex items-center space-x-2"
                          >
                            <Hash className="w-4 h-4" />
                            <span>Keywords</span>
                          </Label>
                          <Input
                            id="keywords"
                            placeholder="từ khóa 1, từ khóa 2, từ khóa 3"
                            {...register("keywords")}
                            className="h-12 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                          />
                          <p className="text-xs text-muted-foreground">
                            Các từ khóa cách nhau bằng dấu phẩy
                          </p>
                        </motion.div>

                        {/* ✅ Enhanced SEO Preview */}
                        <div className="space-y-4">
                          <Label className="flex items-center space-x-2">
                            <Eye className="w-4 h-4" />
                            <span>Xem trước kết quả tìm kiếm</span>
                          </Label>
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-6 border rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20"
                          >
                            <div className="space-y-2">
                              <div className="text-lg font-medium text-blue-600 cursor-pointer hover:underline">
                                {watchedValues.metaTitle ||
                                  watchedValues.title ||
                                  "Tiêu đề bài viết"}
                              </div>
                              <div className="flex items-center space-x-1 text-sm text-green-700">
                                <Globe className="w-3 h-3" />
                                <span>
                                  templatemarket.com/blog/
                                  {generateSlug(
                                    watchedValues.title || "bai-viet-moi",
                                  )}
                                </span>
                              </div>
                              <div className="text-sm leading-relaxed text-gray-600">
                                {watchedValues.metaDescription ||
                                  watchedValues.excerpt ||
                                  "Mô tả bài viết sẽ hiển thị ở đây..."}
                              </div>
                              {watchedValues.keywords && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {watchedValues.keywords
                                    .split(",")
                                    .slice(0, 5)
                                    .map((keyword, i) => (
                                      <Badge
                                        key={i}
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {keyword.trim()}
                                      </Badge>
                                    ))}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>
              </AnimatePresence>
            </Tabs>
          </motion.div>

          {/* ✅ Enhanced Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
            id="sidebar"
            data-animate
          >
            {/* ✅ Publish Settings */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-blue-900">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text">
                    Xuất bản
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center justify-between p-4 transition-all duration-300 border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div>
                      <Label htmlFor="isPublished" className="font-medium">
                        Xuất bản ngay
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Hiển thị công khai
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="isPublished"
                    checked={watchedValues.isPublished}
                    onCheckedChange={(checked) =>
                      setValue("isPublished", checked)
                    }
                  />
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center justify-between p-4 transition-all duration-300 border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex items-center space-x-3">
                    <Sparkles className="w-5 h-5 text-yellow-500" />
                    <div>
                      <Label htmlFor="isFeatured" className="font-medium">
                        Bài viết nổi bật
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Hiển thị ở trang chủ
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="isFeatured"
                    checked={watchedValues.isFeatured}
                    onCheckedChange={(checked) =>
                      setValue("isFeatured", checked)
                    }
                  />
                </motion.div>

                <motion.div className="space-y-2" whileFocus={{ scale: 1.01 }}>
                  <Label className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Ngày xuất bản</span>
                  </Label>
                  <Input
                    type="datetime-local"
                    defaultValue={new Date().toISOString().slice(0, 16)}
                    className="h-12 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                  />
                </motion.div>

                <div className="space-y-2">
                  <Label className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Tác giả</span>
                  </Label>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center p-3 space-x-3 transition-all duration-300 border rounded-lg bg-muted/50 hover:bg-muted"
                  >
                    <img
                      src={
                        user.avatar ||
                        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
                      }
                      alt={user.name}
                      className="object-cover w-8 h-8 rounded-full"
                    />
                    <div>
                      <div className="text-sm font-medium">{user.name}</div>
                      <div className="text-xs text-muted-foreground">Admin</div>
                    </div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>

            {/* ✅ Category & Tags */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50 dark:from-slate-800 dark:to-purple-900">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
                    <Hash className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text">
                    Phân loại
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="categoryId"
                    className="flex items-center space-x-2"
                  >
                    <Target className="w-4 h-4" />
                    <span>Danh mục *</span>
                  </Label>
                  <Select
                    value={watchedValues.categoryId || ""}
                    onValueChange={(value) => setValue("categoryId", value)}
                  >
                    <SelectTrigger
                      className={`h-12 ${errors.categoryId ? "border-red-500" : ""}`}
                    >
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center space-x-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: category.color }}
                            />
                            <span>{category.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.categoryId && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center space-x-1 text-sm text-red-500"
                    >
                      <AlertTriangle className="w-3 h-3" />
                      <span>{errors.categoryId.message}</span>
                    </motion.p>
                  )}
                </div>

                <motion.div className="space-y-2" whileFocus={{ scale: 1.01 }}>
                  <Label htmlFor="tags" className="flex items-center space-x-2">
                    <Hash className="w-4 h-4" />
                    <span>Tags</span>
                  </Label>
                  <Input
                    id="tags"
                    placeholder="react, javascript, tutorial"
                    {...register("tags")}
                    className="h-12 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                  />
                  <p className="text-xs text-muted-foreground">
                    Các tag cách nhau bằng dấu phẩy
                  </p>
                  {watchedValues.tags && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-wrap gap-1 mt-2"
                    >
                      {watchedValues.tags.split(",").map((tag, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {tag.trim()}
                        </Badge>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              </CardContent>
            </Card>

            {/* ✅ Preview */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-green-50 dark:from-slate-800 dark:to-green-900">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                  <span>Xem trước bài viết</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(selectedFileUrl || watchedValues.featuredImage) && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-4"
                  >
                    <div className="relative overflow-hidden rounded-lg shadow-md">
                      <img
                        src={selectedFileUrl || watchedValues.featuredImage}
                        alt="Preview"
                        className="object-cover w-full h-32 transition-transform duration-300 hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop";
                        }}
                      />
                      <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-black/50 to-transparent hover:opacity-100">
                        <div className="absolute text-white bottom-2 left-2">
                          <div className="text-sm font-medium">
                            {watchedValues.title || "Tiêu đề bài viết"}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge
                          variant={
                            watchedValues.isPublished ? "default" : "secondary"
                          }
                        >
                          {watchedValues.isPublished ? "Xuất bản" : "Bản nháp"}
                        </Badge>
                        {watchedValues.isFeatured && (
                          <Badge className="text-yellow-800 bg-yellow-100">
                            <Sparkles className="w-3 h-3 mr-1" />
                            Nổi bật
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {watchedValues.excerpt || "Tóm tắt bài viết..."}
                      </div>
                    </div>
                  </motion.div>
                )}

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button variant="outline" className="w-full mt-4 group">
                    <Eye className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
                    Xem trước đầy đủ
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BlogCreate;
