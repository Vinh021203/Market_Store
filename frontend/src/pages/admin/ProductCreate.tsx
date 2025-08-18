import React, { useState, useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormattedDescription from "@/components/FormattedDescription";
import TinyMCEEditor from "@/components/TinyMCEEditor";
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
  Info,
  Zap,
  Target,
  Star,
  Clock,
  BookOpen,
  BarChart3,
  Heart,
  Gift,
  Layers,
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
    reset,
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

  useEffect(() => {
    if (isEdit && id) {
      const fetchProduct = async () => {
        const product = await getProductById(id);
        if (product) {
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
  }, [id, isEdit, reset]);

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
      color: "from-orange-500 to-amber-500",
    },
    {
      id: "media",
      label: "Hình ảnh",
      icon: Image,
      color: "from-pink-500 to-rose-500",
    },
    {
      id: "details",
      label: "Chi tiết",
      icon: Settings,
      color: "from-emerald-500 to-green-500",
    },
    {
      id: "seo",
      label: "SEO",
      icon: Globe,
      color: "from-amber-500 to-yellow-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-pink-50 dark:from-slate-900 dark:via-orange-900 dark:to-pink-900">
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

      <div className="container relative z-10 px-4 py-8 mx-auto">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8 p-6 bg-gradient-to-r from-white/90 via-orange-50/90 to-pink-50/90 backdrop-blur-xl border border-orange-200/50 rounded-3xl shadow-2xl"
          id="header"
          data-animate
        >
          <div className="flex items-center space-x-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/admin/products")}
                className="group bg-white/60 hover:bg-white/80 rounded-2xl shadow-md border border-orange-200/30"
              >
                <ArrowLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1 text-orange-600" />
                <span className="font-semibold text-orange-800">Quay lại</span>
              </Button>
            </motion.div>
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="flex items-center justify-center w-16 h-16 shadow-2xl rounded-3xl bg-gradient-to-r from-orange-500 via-amber-500 to-pink-600"
              >
                {isEdit ? (
                  <Settings className="w-8 h-8 text-white" />
                ) : (
                  <Plus className="w-8 h-8 text-white" />
                )}
              </motion.div>
              <div>
                <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-orange-600 via-amber-600 to-pink-600 bg-clip-text">
                  {isEdit ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
                </h1>
                <p className="text-orange-700/80 mt-1 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {isEdit
                      ? "Cập nhật thông tin sản phẩm hiện có"
                      : "Tạo sản phẩm mới cho cửa hàng của bạn"}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                className="group bg-white/80 hover:bg-white border-orange-200/50 hover:border-orange-300 rounded-2xl shadow-md"
              >
                <Eye className="w-4 h-4 mr-2 transition-transform group-hover:scale-110 text-orange-600" />
                <span className="text-orange-800 font-semibold">Xem trước</span>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleSubmit(onSubmit)}
                disabled={isSaving}
                className="transition-all duration-300 shadow-xl bg-gradient-to-r from-orange-500 via-amber-500 to-pink-600 hover:from-orange-600 hover:via-amber-600 hover:to-pink-700 hover:shadow-2xl rounded-2xl"
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
                    <span className="font-semibold">
                      {isEdit ? "Đang cập nhật..." : "Đang tạo..."}
                    </span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    <span className="font-semibold">
                      {isEdit ? "Cập nhật sản phẩm" : "Tạo sản phẩm"}
                    </span>
                    <Sparkles className="w-4 h-4 ml-1" />
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Enhanced Main Content */}
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
              <TabsList
                className="grid w-full grid-cols-4 mb-6 bg-white/60 rounded-xl shadow-sm p-1 border-0 gap-0"
                style={{
                  background:
                    "linear-gradient(90deg, #FFF8F3 0%, #FDF4FF 100%)",
                  boxShadow: "0 1px 8px 0 #FCA17D08",
                }}
              >
                {tabsConfig.map((tab, index) => (
                  <motion.div
                    key={`tab-config-${tab.id}-${index}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.06 }}
                    className="w-full"
                  >
                    <TabsTrigger
                      value={tab.id}
                      className={`
          group relative w-full flex items-center justify-center gap-1.5 rounded-lg py-2 px-2 text-sm font-medium
          border-0 outline-none transition-all duration-200
          focus-visible:ring-1 focus-visible:ring-orange-300/50
          data-[state=active]:bg-gradient-to-r
          data-[state=active]:from-[#FF6B35] data-[state=active]:to-[#E91E63]
          data-[state=active]:text-white data-[state=active]:font-semibold
          data-[state=active]:shadow-md data-[state=active]:scale-[1.02]
          data-[state=inactive]:bg-transparent data-[state=inactive]:text-[#D97706]
          hover:data-[state=inactive]:bg-orange-25
          hover:data-[state=inactive]:text-[#EA580C]
        `}
                    >
                      <tab.icon
                        className={`
            w-4 h-4
            transition-all duration-150
            group-data-[state=active]:text-white
            group-data-[state=inactive]:text-[#D97706]
          `}
                      />
                      <span className="font-medium text-xs sm:text-sm whitespace-nowrap">
                        {tab.label}
                      </span>
                    </TabsTrigger>
                  </motion.div>
                ))}
              </TabsList>

              <AnimatePresence>
                {/* Basic Info Tab */}
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
                    <Card className="border-0 shadow-xl bg-gradient-to-br from-white/95 via-orange-50/80 to-amber-50/80 backdrop-blur-xl rounded-3xl">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg">
                            <Package className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <span className="text-2xl text-transparent bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text font-bold">
                              Thông tin sản phẩm
                            </span>
                            <p className="mt-1 text-sm text-orange-700/80">
                              Nhập thông tin cơ bản về sản phẩm
                            </p>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Tiêu đề sản phẩm */}
                        <motion.div
                          className="space-y-2"
                          whileFocus={{ scale: 1.01 }}
                        >
                          <Label
                            htmlFor="title"
                            className="flex items-center space-x-2"
                          >
                            <FileText className="w-4 h-4 text-orange-600" />
                            <span className="font-semibold text-orange-800">
                              Tiêu đề sản phẩm *
                            </span>
                          </Label>
                          <Input
                            id="title"
                            placeholder="Nhập tiêu đề hấp dẫn cho sản phẩm..."
                            {...register("title")}
                            className={`h-12 transition-all duration-300 bg-white/80 border-orange-200/50 rounded-2xl ${
                              errors.title
                                ? "border-red-500 shake"
                                : "focus:ring-2 focus:ring-orange-500/20"
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
                          <div className="text-xs text-orange-600/70">
                            {watchedValues.title?.length || 0}/100 ký tự
                          </div>
                        </motion.div>

                        {/* ---- PHẦN NHẬP MÔ TẢ CHI TIẾT ĐÃ NÂNG CẤP TINYMCE ---- */}
                        <motion.div className="space-y-2 mb-4">
                          <Label
                            htmlFor="description"
                            className="flex items-center space-x-2 mb-1 font-semibold text-orange-800"
                          >
                            <FileText className="w-4 h-4 text-orange-600" />
                            <span>Mô tả chi tiết *</span>
                          </Label>
                          <div
                            className="overflow-y-auto rounded-xl shadow border border-orange-100 scroll-smooth scrollbar-thin scrollbar-thumb-orange-200 scrollbar-track-orange-50 bg-white/90"
                            style={{ maxHeight: 320, minHeight: 170 }}
                          >
                            <TinyMCEEditor
                              value={watchedValues.description}
                              onChange={(value) =>
                                setValue("description", value)
                              }
                              placeholder="Nhập mô tả chi tiết về sản phẩm..."
                              height={220}
                              theme="light"
                            />
                          </div>
                          {errors.description && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-center space-x-1 text-sm text-red-500 mt-2"
                            >
                              <AlertTriangle className="w-3 h-3" />
                              <span>{errors.description.message}</span>
                            </motion.p>
                          )}
                          {watchedValues.description && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-4 px-4 py-3 border border-orange-100 rounded-2xl bg-orange-50/80 overflow-auto prose max-w-none scrollbar-thin scrollbar-thumb-orange-200"
                              style={{ maxHeight: 200 }}
                            >
                              <Label className="flex items-center mb-2 space-x-2 font-medium text-orange-700">
                                <Eye className="w-4 h-4" />
                                <span>Xem trước mô tả</span>
                              </Label>
                              <div
                                className="text-[15px] leading-relaxed"
                                dangerouslySetInnerHTML={{
                                  __html: watchedValues.description,
                                }}
                              />
                            </motion.div>
                          )}
                        </motion.div>
                        {/* ---- END MÔ TẢ CHI TIẾT TINYMCE ---- */}

                        {/* Tác giả/Nhà phát triển */}
                        <motion.div
                          className="space-y-2"
                          whileFocus={{ scale: 1.01 }}
                        >
                          <Label
                            htmlFor="author"
                            className="flex items-center space-x-2"
                          >
                            <Star className="w-4 h-4 text-orange-600" />
                            <span className="font-semibold text-orange-800">
                              Tác giả/Nhà phát triển *
                            </span>
                          </Label>
                          <Input
                            id="author"
                            placeholder="Tên tác giả hoặc đội ngũ phát triển"
                            {...register("author")}
                            className={`h-12 transition-all duration-300 bg-white/80 border-orange-200/50 rounded-2xl ${
                              errors.author
                                ? "border-red-500 shake"
                                : "focus:ring-2 focus:ring-orange-500/20"
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

                {/* Media Tab */}
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
                    <Card className="border-0 shadow-xl bg-gradient-to-br from-white/95 via-pink-50/80 to-rose-50/80 backdrop-blur-xl rounded-3xl">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 shadow-lg">
                            <Image className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <span className="text-2xl text-transparent bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text font-bold">
                              Hình ảnh sản phẩm
                            </span>
                            <p className="mt-1 text-sm text-pink-700/80">
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
                            <Image className="w-4 h-4 text-pink-600" />
                            <span className="font-semibold text-pink-800">
                              Hình ảnh chính *
                            </span>
                          </Label>

                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <Input
                                id="image"
                                placeholder="https://example.com/image.jpg"
                                {...register("image")}
                                className={`transition-all duration-300 bg-white/80 border-pink-200/50 rounded-2xl ${
                                  errors.image
                                    ? "border-red-500"
                                    : "focus:ring-2 focus:ring-pink-500/20"
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
                                className="cursor-pointer bg-white/80 border-pink-200/50 rounded-2xl"
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
                                  className="object-cover w-full h-40 rounded-2xl shadow-md"
                                  onError={(e) => {
                                    e.currentTarget.src =
                                      "https://via.placeholder.com/400x300?text=Image+error";
                                  }}
                                />
                                <div className="absolute top-2 right-2">
                                  <Badge className="text-white bg-green-500 border-0 shadow-lg">
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
                            <Image className="w-4 h-4 text-pink-600" />
                            <span className="font-semibold text-pink-800">
                              Ảnh phụ (Gallery)
                            </span>
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
                              className="transition-all duration-300 bg-white/80 border-pink-200/50 rounded-2xl focus:ring-2 focus:ring-pink-500/20"
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
                              className="cursor-pointer bg-white/80 border-pink-200/50 rounded-2xl"
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
                                      className="object-cover w-full h-24 rounded-2xl shadow-md"
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
                                      className="absolute flex items-center justify-center w-6 h-6 text-white transition-opacity bg-red-500 rounded-full opacity-0 -top-2 -right-2 group-hover:opacity-100 shadow-lg"
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

                {/* Details Tab */}
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
                    <Card className="border-0 shadow-xl bg-gradient-to-br from-white/95 via-emerald-50/80 to-green-50/80 backdrop-blur-xl rounded-3xl">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 shadow-lg">
                            <Settings className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <span className="text-2xl text-transparent bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text font-bold">
                              Chi tiết kỹ thuật
                            </span>
                            <p className="mt-1 text-sm text-emerald-700/80">
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
                            <Label
                              htmlFor="fileSize"
                              className="font-semibold text-emerald-800"
                            >
                              Dung lượng file
                            </Label>
                            <Input
                              id="fileSize"
                              placeholder="VD: 15.2 MB"
                              {...register("fileSize")}
                              className="h-12 transition-all duration-300 bg-white/80 border-emerald-200/50 rounded-2xl focus:ring-2 focus:ring-emerald-500/20"
                            />
                          </motion.div>

                          <motion.div
                            className="space-y-2"
                            whileFocus={{ scale: 1.01 }}
                          >
                            <Label
                              htmlFor="format"
                              className="font-semibold text-emerald-800"
                            >
                              Định dạng file
                            </Label>
                            <Input
                              id="format"
                              placeholder="VD: ZIP, PDF, Figma"
                              {...register("format")}
                              className="h-12 transition-all duration-300 bg-white/80 border-emerald-200/50 rounded-2xl focus:ring-2 focus:ring-emerald-500/20"
                            />
                          </motion.div>
                        </div>

                        {watchedValues.category === "ebook" && (
                          <motion.div
                            className="space-y-2"
                            whileFocus={{ scale: 1.01 }}
                          >
                            <Label
                              htmlFor="pages"
                              className="font-semibold text-emerald-800"
                            >
                              Số trang
                            </Label>
                            <Input
                              id="pages"
                              type="number"
                              placeholder="VD: 245"
                              {...register("pages", { valueAsNumber: true })}
                              className="h-12 transition-all duration-300 bg-white/80 border-emerald-200/50 rounded-2xl focus:ring-2 focus:ring-emerald-500/20"
                            />
                          </motion.div>
                        )}

                        <motion.div
                          className="space-y-2"
                          whileFocus={{ scale: 1.01 }}
                        >
                          <Label
                            htmlFor="difficulty"
                            className="font-semibold text-emerald-800"
                          >
                            Độ khó
                          </Label>
                          <Select
                            value={watchedValues.difficulty}
                            onValueChange={(value: any) =>
                              setValue("difficulty", value)
                            }
                          >
                            <SelectTrigger className="h-12 bg-white/80 border-emerald-200/50 rounded-2xl">
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
                          <Label
                            htmlFor="technologies"
                            className="font-semibold text-emerald-800"
                          >
                            Công nghệ sử dụng
                          </Label>
                          <Input
                            id="technologies"
                            placeholder="React, TypeScript, TailwindCSS, Next.js"
                            {...register("technologies")}
                            className="h-12 transition-all duration-300 bg-white/80 border-emerald-200/50 rounded-2xl focus:ring-2 focus:ring-emerald-500/20"
                          />
                          <p className="text-xs text-emerald-600/70">
                            Các công nghệ cách nhau bằng dấu phẩy
                          </p>
                        </motion.div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                          <motion.div
                            className="space-y-2"
                            whileFocus={{ scale: 1.01 }}
                          >
                            <Label
                              htmlFor="downloadUrl"
                              className="font-semibold text-emerald-800"
                            >
                              Link download
                            </Label>
                            <Input
                              id="downloadUrl"
                              placeholder="https://example.com/download"
                              {...register("downloadUrl")}
                              className="h-12 transition-all duration-300 bg-white/80 border-emerald-200/50 rounded-2xl focus:ring-2 focus:ring-emerald-500/20"
                            />
                          </motion.div>

                          <motion.div
                            className="space-y-2"
                            whileFocus={{ scale: 1.01 }}
                          >
                            <Label
                              htmlFor="previewUrl"
                              className="font-semibold text-emerald-800"
                            >
                              Link preview/Demo
                            </Label>
                            <Input
                              id="previewUrl"
                              placeholder="https://preview.example.com"
                              {...register("previewUrl")}
                              className="h-12 transition-all duration-300 bg-white/80 border-emerald-200/50 rounded-2xl focus:ring-2 focus:ring-emerald-500/20"
                            />
                          </motion.div>
                        </div>

                        {/* Upload file ZIP/PDF */}
                        <div className="space-y-4">
                          <Label className="flex items-center space-x-2">
                            <Upload className="w-4 h-4 text-emerald-600" />
                            <span className="font-semibold text-emerald-800">
                              Tải file sản phẩm (ZIP/PDF) *
                            </span>
                          </Label>
                          <div className="p-6 text-center transition-colors border-2 border-dashed border-emerald-300/50 rounded-2xl hover:border-emerald-400/50 bg-emerald-50/30">
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
                            <div className="mt-2 text-sm text-emerald-600/70">
                              Kéo thả file hoặc click để chọn file (ZIP, PDF,
                              RAR, 7Z)
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>

                {/* SEO Tab */}
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
                    <Card className="border-0 shadow-xl bg-gradient-to-br from-white/95 via-amber-50/80 to-yellow-50/80 backdrop-blur-xl rounded-3xl">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 shadow-lg">
                            <Globe className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <span className="text-2xl text-transparent bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text font-bold">
                              Tối ưu SEO
                            </span>
                            <p className="mt-1 text-sm text-amber-700/80">
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
                            <Tag className="w-4 h-4 text-amber-600" />
                            <span className="font-semibold text-amber-800">
                              Tags SEO
                            </span>
                          </Label>
                          <Input
                            id="tags"
                            placeholder="react, template, ecommerce, modern, responsive"
                            {...register("tags")}
                            className="h-12 transition-all duration-300 bg-white/80 border-amber-200/50 rounded-2xl focus:ring-2 focus:ring-amber-500/20"
                          />
                          <p className="text-xs text-amber-600/70">
                            Các tag cách nhau bằng dấu phẩy (tối đa 10 tags)
                          </p>
                        </motion.div>

                        {/* SEO Preview */}
                        <div className="space-y-4">
                          <Label className="flex items-center space-x-2">
                            <Eye className="w-4 h-4 text-amber-600" />
                            <span className="font-semibold text-amber-800">
                              Xem trước kết quả tìm kiếm
                            </span>
                          </Label>
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-6 border border-amber-200/50 rounded-2xl bg-gradient-to-r from-blue-50/50 to-purple-50/50"
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
                                        className="text-xs border-amber-300 text-amber-700"
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

          {/* Enhanced Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6 sticky top-24"
            id="sidebar"
            data-animate
          >
            {/* Pricing */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white/95 via-green-50/80 to-emerald-50/80 backdrop-blur-xl rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="text-2xl text-transparent bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text font-bold">
                      Giá bán
                    </span>
                    <p className="mt-1 text-sm text-green-700/80">
                      Thiết lập giá cho sản phẩm
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <motion.div className="space-y-2" whileFocus={{ scale: 1.01 }}>
                  <Label
                    htmlFor="price"
                    className="font-semibold text-green-800"
                  >
                    Giá bán hiện tại *
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="299000"
                    {...register("price", { valueAsNumber: true })}
                    className={`h-12 transition-all duration-300 bg-white/80 border-green-200/50 rounded-2xl ${
                      errors.price
                        ? "border-red-500 shake"
                        : "focus:ring-2 focus:ring-green-500/20"
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
                  <Label
                    htmlFor="originalPrice"
                    className="font-semibold text-green-800"
                  >
                    Giá gốc (nếu có giảm giá)
                  </Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    placeholder="399000"
                    {...register("originalPrice", { valueAsNumber: true })}
                    className="h-12 transition-all duration-300 bg-white/80 border-green-200/50 rounded-2xl focus:ring-2 focus:ring-green-500/20"
                  />
                </motion.div>

                {discountPercentage > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 border border-green-200/50 rounded-2xl bg-gradient-to-r from-green-50/50 to-emerald-50/50"
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
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white/95 via-purple-50/80 to-pink-50/80 backdrop-blur-xl rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
                    <Tag className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="text-2xl text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text font-bold">
                      Phân loại
                    </span>
                    <p className="mt-1 text-sm text-purple-700/80">
                      Danh mục và trạng thái
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="category"
                    className="font-semibold text-purple-800"
                  >
                    Danh mục sản phẩm *
                  </Label>
                  <Select
                    value={watchedValues.category}
                    onValueChange={(value: any) => setValue("category", value)}
                  >
                    <SelectTrigger
                      className={`h-12 bg-white/80 border-purple-200/50 rounded-2xl ${errors.category ? "border-red-500" : ""}`}
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
                  className="flex items-center justify-between p-4 transition-all duration-300 border border-purple-200/50 rounded-2xl hover:bg-purple-50/30"
                >
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div>
                      <Label
                        htmlFor="isActive"
                        className="font-medium text-purple-800"
                      >
                        Kích hoạt sản phẩm
                      </Label>
                      <p className="text-xs text-purple-600/70">
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
                  className="flex items-center justify-between p-4 transition-all duration-300 border border-purple-200/50 rounded-2xl hover:bg-purple-50/30"
                >
                  <div className="flex items-center space-x-3">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <div>
                      <Label
                        htmlFor="isFeatured"
                        className="font-medium text-purple-800"
                      >
                        Sản phẩm nổi bật
                      </Label>
                      <p className="text-xs text-purple-600/70">
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
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white/95 via-blue-50/80 to-cyan-50/80 backdrop-blur-xl rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="text-2xl text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text font-bold">
                      Xem trước sản phẩm
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(selectedFileUrl || watchedValues.image) && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-4"
                  >
                    <div className="relative overflow-hidden rounded-2xl shadow-md">
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
                          className="border-0 shadow-sm"
                        >
                          {watchedValues.category === "template"
                            ? "Template"
                            : "E-book"}
                        </Badge>
                        {watchedValues.isFeatured && (
                          <Badge className="text-yellow-800 bg-yellow-100 border-0 shadow-sm">
                            <Star className="w-3 h-3 mr-1" />
                            Nổi bật
                          </Badge>
                        )}
                      </div>
                      <div className="text-lg font-bold text-blue-600">
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
