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
import { uploadFileToCloudinary } from "@/lib/uploadFileToCloudinary";
import { Product } from "@/types";
import { createProduct, updateProduct, getProductById } from "@/lib/products";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Save,
  Eye,
  Upload,
  X,
  Plus,
  Package,
  DollarSign,
  Image,
  Settings,
  Tag,
  Coffee,
  Code,
  Palette,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  FileText,
  Globe,
  Zap,
  Target,
  Star,
  Clock,
  BookOpen,
  BarChart3,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const productSchema = z.object({
  title: z.string().min(5, "Tiêu đề phải có ít nhất 5 ký tự"),
  description: z.string().min(20, "Mô tả phải có ít nhất 20 ký tự"),
  price: z.number().min(0, "Giá phải lớn hơn 0"),
  originalPrice: z.number().optional(),
  category: z.enum(["template", "ebook"], {
    required_error: "Vui lòng chọn danh mục",
  }),
  tags: z.string(),
  image: z.string().url("URL hình ảnh không hợp lệ"),
  images: z.array(z.string()).min(1, "Phải có ít nhất 1 ảnh phụ"),
  downloadUrl: z.string().optional(),
  previewUrl: z.string().optional(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  author: z.string().min(2, "Tên tác giả phải có ít nhất 2 ký tự"),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]).optional(),
  technologies: z.string().optional(),
  fileSize: z.string().optional(),
  format: z.string().optional(),
  pages: z.number().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

const ProductCreate: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("basic");
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});

  if (!user || !isAdmin(user)) {
    return <Navigate to="/" replace />;
  }

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset, // ✅ Thêm reset method
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      originalPrice: 0,
      category: "template",
      tags: "",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
      images: [],
      downloadUrl: "",
      previewUrl: "",
      isActive: true,
      isFeatured: false,
      author: "",
      difficulty: "Beginner",
      technologies: "",
      fileSize: "",
      format: "",
      pages: 0,
    },
  });

  const watchedValues = watch();

  // ✅ Enhanced useEffect với reset method
  useEffect(() => {
    if (isEdit && id) {
      const fetchProduct = async () => {
        const product = await getProductById(id);
        if (product) {
          // ✅ Sử dụng reset để set tất cả values cùng lúc
          reset({
            title: product.title,
            description: product.description,
            price: product.price,
            originalPrice: product.originalPrice,
            category: product.category,
            tags: product.tags.join(", "),
            image: product.image,
            images: product.images || [],
            downloadUrl: product.downloadUrl || "",
            previewUrl: product.previewUrl || "",
            isActive: product.isActive,
            isFeatured: product.isFeatured,
            author: product.author,
            difficulty: product.difficulty || "Beginner",
            technologies: product.technologies?.join(", ") || "",
            fileSize: product.fileSize || "",
            format: product.format || "",
            pages: product.pages || 0,
          });
        }
      };
      fetchProduct();
    }

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
  }, [id, isEdit, reset]); // ✅ Thêm reset vào dependency array

  const onSubmit = async (data: ProductFormData) => {
    setIsSaving(true);
    const transformed = {
      ...data,
      tags: data.tags.split(",").map((t) => t.trim()),
      images: data.images,
      technologies: data.technologies
        ? data.technologies.split(",").map((t) => t.trim())
        : [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      if (isEdit && id) {
        await updateProduct(id, transformed);
      } else {
        await createProduct(transformed);
      }

      toast({
        title: isEdit ? "✅ Cập nhật thành công" : "✅ Tạo sản phẩm thành công",
        description: isEdit
          ? "Sản phẩm đã được cập nhật thành công"
          : "Sản phẩm mới đã được tạo và thêm vào cửa hàng",
      });

      navigate("/admin/products");
    } catch (err) {
      toast({
        title: "❌ Lỗi",
        description: (err as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const discountPercentage =
    watchedValues.originalPrice && watchedValues.price
      ? Math.round(
          ((watchedValues.originalPrice - watchedValues.price) /
            watchedValues.originalPrice) *
            100,
        )
      : 0;

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/upload`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Tải ảnh thất bại");
    const data = await res.json();
    return data.url;
  };

  const tabsConfig = [
    {
      id: "basic",
      label: "Thông tin cơ bản",
      icon: Package,
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "media",
      label: "Hình ảnh",
      icon: Image,
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "details",
      label: "Chi tiết",
      icon: Settings,
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "seo",
      label: "SEO",
      icon: Globe,
      color: "from-orange-500 to-red-500",
    },
  ];

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

      <div className="container relative z-10 px-4 py-8 mx-auto">
        {/* ✅ Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
          id="header"
          data-animate
        >
          <div className="flex items-center space-x-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/admin/products")}
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
                  {isEdit ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
                </h1>
                <p className="text-muted-foreground">
                  {isEdit
                    ? "Cập nhật thông tin sản phẩm hiện có"
                    : "Tạo sản phẩm mới cho cửa hàng của bạn"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" className="group">
                <Eye className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
                Xem trước
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleSubmit(onSubmit)}
                disabled={isSaving}
                className="transition-all duration-300 shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl"
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
                    {isEdit ? "Đang cập nhật..." : "Đang tạo..."}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {isEdit ? "Cập nhật sản phẩm" : "Tạo sản phẩm"}
                  </>
                )}
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
              <TabsList className="grid w-full grid-cols-4 mb-8 bg-gradient-to-r from-white to-blue-50 dark:from-slate-800 dark:to-blue-900">
                {tabsConfig.map((tab, index) => (
                  <motion.div
                    key={`tab-config-${tab.id}-${index}`}
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
                {/* ✅ Basic Info Tab */}
                <TabsContent
                  key="basic-tab-content"
                  value="basic"
                  className="space-y-6"
                >
                  <motion.div
                    key="basic-motion-div"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-blue-900">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500">
                            <Package className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <span className="text-xl text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text">
                              Thông tin sản phẩm
                            </span>
                            <p className="mt-1 text-sm text-muted-foreground">
                              Nhập thông tin cơ bản về sản phẩm
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
                            <span>Tiêu đề sản phẩm *</span>
                          </Label>
                          <Input
                            id="title"
                            placeholder="Nhập tiêu đề hấp dẫn cho sản phẩm..."
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
                          <div className="text-xs text-muted-foreground">
                            {watchedValues.title?.length || 0}/100 ký tự
                          </div>
                        </motion.div>

                        <motion.div
                          className="space-y-2"
                          whileFocus={{ scale: 1.01 }}
                        >
                          <Label
                            htmlFor="description"
                            className="flex items-center space-x-2"
                          >
                            <FileText className="w-4 h-4" />
                            <span>Mô tả chi tiết *</span>
                          </Label>
                          <Textarea
                            id="description"
                            placeholder="Mô tả chi tiết về tính năng, lợi ích và giá trị của sản phẩm..."
                            rows={6}
                            {...register("description")}
                            className={`resize-none transition-all duration-300 ${
                              errors.description
                                ? "border-red-500 shake"
                                : "focus:ring-2 focus:ring-primary/20"
                            }`}
                          />
                          {errors.description && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-center space-x-1 text-sm text-red-500"
                            >
                              <AlertTriangle className="w-3 h-3" />
                              <span>{errors.description.message}</span>
                            </motion.p>
                          )}
                          <div className="text-xs text-muted-foreground">
                            {watchedValues.description?.length || 0}/500 ký tự
                          </div>
                        </motion.div>

                        <motion.div
                          className="space-y-2"
                          whileFocus={{ scale: 1.01 }}
                        >
                          <Label
                            htmlFor="author"
                            className="flex items-center space-x-2"
                          >
                            <Star className="w-4 h-4" />
                            <span>Tác giả/Nhà phát triển *</span>
                          </Label>
                          <Input
                            id="author"
                            placeholder="Tên tác giả hoặc đội ngũ phát triển"
                            {...register("author")}
                            className={`h-12 transition-all duration-300 ${
                              errors.author
                                ? "border-red-500 shake"
                                : "focus:ring-2 focus:ring-primary/20"
                            }`}
                          />
                          {errors.author && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-center space-x-1 text-sm text-red-500"
                            >
                              <AlertTriangle className="w-3 h-3" />
                              <span>{errors.author.message}</span>
                            </motion.p>
                          )}
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>

                {/* ✅ Media Tab */}
                <TabsContent
                  key="media-tab-content"
                  value="media"
                  className="space-y-6"
                >
                  <motion.div
                    key="media-motion-div"
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
                              Hình ảnh sản phẩm
                            </span>
                            <p className="mt-1 text-sm text-muted-foreground">
                              Tải lên hình ảnh chính và ảnh phụ
                            </p>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Ảnh chính */}
                        <div className="space-y-4">
                          <Label
                            htmlFor="image"
                            className="flex items-center space-x-2"
                          >
                            <Image className="w-4 h-4" />
                            <span>Hình ảnh chính *</span>
                          </Label>

                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <Input
                                id="image"
                                placeholder="https://example.com/image.jpg"
                                {...register("image")}
                                className={`transition-all duration-300 ${
                                  errors.image
                                    ? "border-red-500"
                                    : "focus:ring-2 focus:ring-primary/20"
                                }`}
                              />
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;

                                  try {
                                    setUploadProgress(0);
                                    const url = await uploadImage(file);
                                    setSelectedFileUrl(url);
                                    setValue("image", url);
                                    setUploadProgress(100);
                                    toast({
                                      title: "✅ Upload thành công",
                                      description: "Hình ảnh đã được tải lên",
                                    });
                                  } catch (err) {
                                    toast({
                                      title: "❌ Lỗi tải ảnh",
                                      description: (err as Error).message,
                                      variant: "destructive",
                                    });
                                  }
                                }}
                                className="cursor-pointer"
                              />
                            </div>

                            {(selectedFileUrl || watchedValues.image) && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative"
                              >
                                <img
                                  src={selectedFileUrl || watchedValues.image}
                                  className="object-cover w-full h-40 rounded-lg shadow-md"
                                  onError={(e) => {
                                    e.currentTarget.src =
                                      "https://via.placeholder.com/400x300?text=Image+error";
                                  }}
                                />
                                <div className="absolute top-2 right-2">
                                  <Badge className="text-white bg-green-500">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Đã tải
                                  </Badge>
                                </div>
                              </motion.div>
                            )}
                          </div>
                        </div>

                        {/* Ảnh phụ */}
                        <div className="space-y-4">
                          <Label
                            htmlFor="images"
                            className="flex items-center space-x-2"
                          >
                            <Image className="w-4 h-4" />
                            <span>Ảnh phụ (Gallery)</span>
                          </Label>

                          <div className="space-y-2">
                            <Input
                              id="images"
                              placeholder="https://example.com/1.jpg, https://example.com/2.jpg"
                              value={watchedValues.images?.join(", ") || ""}
                              onChange={(e) =>
                                setValue(
                                  "images",
                                  e.target.value
                                    .split(",")
                                    .map((t) => t.trim())
                                    .filter(Boolean),
                                )
                              }
                              className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                            />
                            <Input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={async (e) => {
                                const files = Array.from(e.target.files || []);
                                if (!files.length) return;

                                try {
                                  const uploadPromises = files.map(uploadImage);
                                  const urls =
                                    await Promise.all(uploadPromises);
                                  setValue("images", [
                                    ...(watchedValues.images || []),
                                    ...urls,
                                  ]);
                                  toast({
                                    title: "✅ Upload thành công",
                                    description: `${files.length} ảnh đã được tải lên`,
                                  });
                                } catch (err) {
                                  toast({
                                    title: "❌ Lỗi tải ảnh",
                                    description: (err as Error).message,
                                    variant: "destructive",
                                  });
                                }
                              }}
                              className="cursor-pointer"
                            />
                          </div>

                          {watchedValues.images &&
                            watchedValues.images.length > 0 && (
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="grid grid-cols-2 gap-3 mt-4 md:grid-cols-3"
                              >
                                {watchedValues.images.map((img, i) => (
                                  <motion.div
                                    key={`image-gallery-${i}-${img.slice(-10)}`}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    whileHover={{ scale: 1.05 }}
                                    className="relative group"
                                  >
                                    <img
                                      src={img.trim()}
                                      className="object-cover w-full h-24 rounded-lg shadow-md"
                                    />
                                    <motion.button
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                      onClick={() => {
                                        const newImages =
                                          watchedValues.images?.filter(
                                            (_, index) => index !== i,
                                          );
                                        setValue("images", newImages || []);
                                      }}
                                      className="absolute flex items-center justify-center w-6 h-6 text-white transition-opacity bg-red-500 rounded-full opacity-0 -top-2 -right-2 group-hover:opacity-100"
                                    >
                                      <X className="w-3 h-3" />
                                    </motion.button>
                                  </motion.div>
                                ))}
                              </motion.div>
                            )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>

                {/* ✅ Details Tab */}
                <TabsContent
                  key="details-tab-content"
                  value="details"
                  className="space-y-6"
                >
                  <motion.div
                    key="details-motion-div"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-green-50 dark:from-slate-800 dark:to-green-900">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500">
                            <Settings className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <span className="text-xl text-transparent bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text">
                              Chi tiết kỹ thuật
                            </span>
                            <p className="mt-1 text-sm text-muted-foreground">
                              Thông tin chi tiết về sản phẩm
                            </p>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                          <motion.div
                            className="space-y-2"
                            whileFocus={{ scale: 1.01 }}
                          >
                            <Label htmlFor="fileSize">Dung lượng file</Label>
                            <Input
                              id="fileSize"
                              placeholder="VD: 15.2 MB"
                              {...register("fileSize")}
                              className="h-12 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                            />
                          </motion.div>

                          <motion.div
                            className="space-y-2"
                            whileFocus={{ scale: 1.01 }}
                          >
                            <Label htmlFor="format">Định dạng file</Label>
                            <Input
                              id="format"
                              placeholder="VD: ZIP, PDF, Figma"
                              {...register("format")}
                              className="h-12 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                            />
                          </motion.div>
                        </div>

                        {watchedValues.category === "ebook" && (
                          <motion.div
                            className="space-y-2"
                            whileFocus={{ scale: 1.01 }}
                          >
                            <Label htmlFor="pages">Số trang</Label>
                            <Input
                              id="pages"
                              type="number"
                              placeholder="VD: 245"
                              {...register("pages", { valueAsNumber: true })}
                              className="h-12 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                            />
                          </motion.div>
                        )}

                        <motion.div
                          className="space-y-2"
                          whileFocus={{ scale: 1.01 }}
                        >
                          <Label htmlFor="difficulty">Độ khó</Label>
                          <Select
                            value={watchedValues.difficulty}
                            onValueChange={(value: any) =>
                              setValue("difficulty", value)
                            }
                          >
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Chọn độ khó" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Beginner">
                                <div className="flex items-center space-x-2">
                                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                  <span>Beginner</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="Intermediate">
                                <div className="flex items-center space-x-2">
                                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                  <span>Intermediate</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="Advanced">
                                <div className="flex items-center space-x-2">
                                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                  <span>Advanced</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </motion.div>

                        <motion.div
                          className="space-y-2"
                          whileFocus={{ scale: 1.01 }}
                        >
                          <Label htmlFor="technologies">
                            Công nghệ sử dụng
                          </Label>
                          <Input
                            id="technologies"
                            placeholder="React, TypeScript, TailwindCSS, Next.js"
                            {...register("technologies")}
                            className="h-12 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                          />
                          <p className="text-xs text-muted-foreground">
                            Các công nghệ cách nhau bằng dấu phẩy
                          </p>
                        </motion.div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                          <motion.div
                            className="space-y-2"
                            whileFocus={{ scale: 1.01 }}
                          >
                            <Label htmlFor="downloadUrl">Link download</Label>
                            <Input
                              id="downloadUrl"
                              placeholder="https://example.com/download"
                              {...register("downloadUrl")}
                              className="h-12 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                            />
                          </motion.div>

                          <motion.div
                            className="space-y-2"
                            whileFocus={{ scale: 1.01 }}
                          >
                            <Label htmlFor="previewUrl">
                              Link preview/Demo
                            </Label>
                            <Input
                              id="previewUrl"
                              placeholder="https://preview.example.com"
                              {...register("previewUrl")}
                              className="h-12 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                            />
                          </motion.div>
                        </div>

                        {/* Upload file ZIP/PDF */}
                        <div className="space-y-4">
                          <Label className="flex items-center space-x-2">
                            <Upload className="w-4 h-4" />
                            <span>Tải file sản phẩm (ZIP/PDF) *</span>
                          </Label>
                          <div className="p-6 text-center transition-colors border-2 border-dashed rounded-lg border-muted-foreground/25 hover:border-primary/50">
                            <Input
                              type="file"
                              accept=".zip,.pdf,.rar,.7z"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;

                                try {
                                  setUploadProgress(0);
                                  const { url, size, format } =
                                    await uploadFileToCloudinary(file);
                                  setValue("downloadUrl", url);
                                  setValue("fileSize", size);
                                  setValue("format", format);
                                  setUploadProgress(100);

                                  toast({
                                    title: "✅ Upload thành công",
                                    description: `File ${file.name} đã được tải lên`,
                                  });
                                } catch (err) {
                                  toast({
                                    title: "❌ Lỗi khi tải file",
                                    description: (err as Error).message,
                                    variant: "destructive",
                                  });
                                }
                              }}
                              className="cursor-pointer"
                            />
                            <div className="mt-2 text-sm text-muted-foreground">
                              Kéo thả file hoặc click để chọn file (ZIP, PDF,
                              RAR, 7Z)
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>

                {/* ✅ SEO Tab */}
                <TabsContent
                  key="seo-tab-content"
                  value="seo"
                  className="space-y-6"
                >
                  <motion.div
                    key="seo-motion-div"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-orange-50 dark:from-slate-800 dark:to-orange-900">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-orange-500 to-red-500">
                            <Globe className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <span className="text-xl text-transparent bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text">
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
                            htmlFor="tags"
                            className="flex items-center space-x-2"
                          >
                            <Tag className="w-4 h-4" />
                            <span>Tags SEO</span>
                          </Label>
                          <Input
                            id="tags"
                            placeholder="react, template, ecommerce, modern, responsive"
                            {...register("tags")}
                            className="h-12 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                          />
                          <p className="text-xs text-muted-foreground">
                            Các tag cách nhau bằng dấu phẩy (tối đa 10 tags)
                          </p>
                        </motion.div>

                        {/* SEO Preview */}
                        <div className="space-y-4">
                          <Label className="flex items-center space-x-2">
                            <Eye className="w-4 h-4" />
                            <span>Xem trước kết quả tìm kiếm</span>
                          </Label>
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-6 border rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20"
                          >
                            <div className="space-y-2">
                              <div className="text-lg font-medium text-blue-600 cursor-pointer hover:underline">
                                {watchedValues.title ||
                                  "Tiêu đề sản phẩm sẽ hiển thị ở đây"}
                              </div>
                              <div className="flex items-center space-x-1 text-sm text-green-700">
                                <Globe className="w-3 h-3" />
                                <span>
                                  templatemarket.com/product/
                                  {watchedValues.title
                                    ?.toLowerCase()
                                    .replace(/\s+/g, "-")
                                    .replace(/[^a-z0-9-]/g, "") ||
                                    "product-slug"}
                                </span>
                              </div>
                              <div className="text-sm leading-relaxed text-gray-600">
                                {watchedValues.description?.slice(0, 160) ||
                                  "Mô tả sản phẩm sẽ hiển thị ở đây..."}
                                {watchedValues.description &&
                                  watchedValues.description.length > 160 &&
                                  "..."}
                              </div>
                              {watchedValues.tags && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {watchedValues.tags
                                    .split(",")
                                    .slice(0, 5)
                                    .map((tag, i) => (
                                      <Badge
                                        key={i}
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {tag.trim()}
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
            {/* Pricing */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-green-50 dark:from-slate-800 dark:to-green-900">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-xl text-transparent bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text">
                      Giá bán
                    </span>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Thiết lập giá cho sản phẩm
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <motion.div className="space-y-2" whileFocus={{ scale: 1.01 }}>
                  <Label htmlFor="price">Giá bán hiện tại *</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="299000"
                    {...register("price", { valueAsNumber: true })}
                    className={`h-12 transition-all duration-300 ${
                      errors.price
                        ? "border-red-500 shake"
                        : "focus:ring-2 focus:ring-primary/20"
                    }`}
                  />
                  {errors.price && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center space-x-1 text-sm text-red-500"
                    >
                      <AlertTriangle className="w-3 h-3" />
                      <span>{errors.price.message}</span>
                    </motion.p>
                  )}
                </motion.div>

                <motion.div className="space-y-2" whileFocus={{ scale: 1.01 }}>
                  <Label htmlFor="originalPrice">
                    Giá gốc (nếu có giảm giá)
                  </Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    placeholder="399000"
                    {...register("originalPrice", { valueAsNumber: true })}
                    className="h-12 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                  />
                </motion.div>

                {discountPercentage > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 border border-green-200 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20"
                  >
                    <div className="flex items-center mb-2 space-x-2">
                      <Zap className="w-4 h-4 text-green-600" />
                      <div className="text-sm font-medium text-green-800">
                        Giảm giá {discountPercentage}%
                      </div>
                    </div>
                    <div className="text-xs text-green-600">
                      Tiết kiệm{" "}
                      {(
                        (watchedValues.originalPrice || 0) - watchedValues.price
                      ).toLocaleString()}{" "}
                      VND
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>

            {/* Category & Status */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50 dark:from-slate-800 dark:to-purple-900">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
                    <Tag className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-xl text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text">
                      Phân loại
                    </span>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Danh mục và trạng thái
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Danh mục sản phẩm *</Label>
                  <Select
                    value={watchedValues.category}
                    onValueChange={(value: any) => setValue("category", value)}
                  >
                    <SelectTrigger
                      className={`h-12 ${errors.category ? "border-red-500" : ""}`}
                    >
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="template">
                        <div className="flex items-center space-x-2">
                          <Package className="w-4 h-4 text-blue-500" />
                          <span>Template</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="ebook">
                        <div className="flex items-center space-x-2">
                          <BookOpen className="w-4 h-4 text-green-500" />
                          <span>E-book</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center space-x-1 text-sm text-red-500"
                    >
                      <AlertTriangle className="w-3 h-3" />
                      <span>{errors.category.message}</span>
                    </motion.p>
                  )}
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center justify-between p-4 transition-all duration-300 border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div>
                      <Label htmlFor="isActive" className="font-medium">
                        Kích hoạt sản phẩm
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Hiển thị trên cửa hàng
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="isActive"
                    {...register("isActive")}
                    checked={watchedValues.isActive}
                    onCheckedChange={(checked) => setValue("isActive", checked)}
                  />
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center justify-between p-4 transition-all duration-300 border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex items-center space-x-3">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <div>
                      <Label htmlFor="isFeatured" className="font-medium">
                        Sản phẩm nổi bật
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Hiển thị ở trang chủ
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="isFeatured"
                    {...register("isFeatured")}
                    checked={watchedValues.isFeatured}
                    onCheckedChange={(checked) =>
                      setValue("isFeatured", checked)
                    }
                  />
                </motion.div>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-blue-900">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                  <span>Xem trước sản phẩm</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(selectedFileUrl || watchedValues.image) && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-4"
                  >
                    <div className="relative overflow-hidden rounded-lg shadow-md">
                      <img
                        src={selectedFileUrl || watchedValues.image}
                        alt="Preview"
                        className="object-cover w-full h-48 transition-transform duration-300 hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://via.placeholder.com/400x300?text=Image+error";
                        }}
                      />
                      <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-black/50 to-transparent hover:opacity-100">
                        <div className="absolute text-white bottom-4 left-4">
                          <div className="font-medium">
                            {watchedValues.title || "Tiêu đề sản phẩm"}
                          </div>
                          <div className="text-sm opacity-90">
                            {watchedValues.author || "Tác giả"}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge
                          variant={
                            watchedValues.category === "template"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {watchedValues.category === "template"
                            ? "Template"
                            : "E-book"}
                        </Badge>
                        {watchedValues.isFeatured && (
                          <Badge className="text-yellow-800 bg-yellow-100">
                            <Star className="w-3 h-3 mr-1" />
                            Nổi bật
                          </Badge>
                        )}
                      </div>
                      <div className="text-lg font-bold text-primary">
                        {watchedValues.price
                          ? `${watchedValues.price.toLocaleString()} VND`
                          : "Chưa có giá"}
                      </div>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductCreate;
