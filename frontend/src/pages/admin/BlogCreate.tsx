import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import TinyMCEEditor from "@/components/TinyMCEEditor";
import { Button } from "@/components/ui/button";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Save,
  Eye,
  FileText,
  Image,
  Globe,
  Calendar,
  User,
  Tag,
  Loader2,
  Upload,
  X,
  Plus,
  CheckCircle,
  Clock,
  Wand2,
  Brain,
  Target,
  TrendingUp,
  Search,
  Lightbulb,
  BarChart,
  BookOpen,
  PenTool,
  Cpu,
  Sparkles,
  Zap,
  XCircle,
  Info,
  Coffee,
  Palette,
  Heart,
} from "lucide-react";

// Enhanced Toast Component (tương tự Product/Order)
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

// Blog schema
const blogSchema = z.object({
  title: z.string().min(1, "Tiêu đề là bắt buộc"),
  slug: z.string().min(1, "Slug là bắt buộc"),
  excerpt: z.string().min(1, "Tóm tắt là bắt buộc"),
  content: z.string().min(1, "Nội dung là bắt buộc"),
  category: z.string().min(1, "Danh mục là bắt buộc"),
  tags: z.array(z.string()).optional(),
  featuredImage: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
  status: z.enum(["draft", "published"]),
  publishedAt: z.string().optional(),
});

type BlogFormData = z.infer<typeof blogSchema>;

const BlogCreate: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  // States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("content");
  const [tagInput, setTagInput] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [toasts, setToasts] = useState<
    Array<{
      id: string;
      type: "success" | "error" | "info";
      title: string;
      description?: string;
    }>
  >([]);

  // SEO Tools State
  const [seoSuggestions, setSeoSuggestions] = useState<string[]>([]);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [keywordDensity, setKeywordDensity] = useState<Record<string, number>>(
    {},
  );
  const [readabilityScore, setReadabilityScore] = useState(0);
  const [contentStats, setContentStats] = useState({
    words: 0,
    sentences: 0,
    paragraphs: 0,
    headings: 0,
    readingTime: 0,
  });

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
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      status: "draft",
      tags: [],
    },
  });

  const watchedValues = watch();

  // SEO Helper Functions
  const generateSEOSuggestions = (content: string, title: string) => {
    const suggestions = [];

    if (title.length < 30) {
      suggestions.push("💡 Tiêu đề nên dài 30-60 ký tự để tối ưu SEO");
    }
    if (title.length > 60) {
      suggestions.push("⚠️ Tiêu đề quá dài, nên rút gọn xuống dưới 60 ký tự");
    }
    if (content.length < 300) {
      suggestions.push(
        "📝 Nội dung nên có ít nhất 300 từ để Google đánh giá cao",
      );
    }
    if (!content.toLowerCase().includes(title.toLowerCase().split(" ")[0])) {
      suggestions.push("🎯 Nên sử dụng từ khóa chính trong nội dung");
    }

    const headingCount = (content.match(/#{1,6}\s/g) || []).length;
    if (headingCount < 2) {
      suggestions.push(
        "📋 Nên sử dụng ít nhất 2-3 heading (H2, H3) để cấu trúc bài viết",
      );
    }

    if (!content.includes("![") && !content.includes("<img")) {
      suggestions.push("🖼️ Nên thêm ít nhất 1-2 hình ảnh để tăng engagement");
    }

    const metaDesc = watchedValues.metaDescription || "";
    if (metaDesc.length < 120) {
      suggestions.push("📄 Meta description nên dài 120-160 ký tự");
    }
    if (metaDesc.length > 160) {
      suggestions.push(
        "📄 Meta description quá dài, nên rút gọn xuống dưới 160 ký tự",
      );
    }

    return suggestions;
  };

  const calculateKeywordDensity = (content: string) => {
    const words = content.toLowerCase().match(/\b\w+\b/g) || [];
    const wordCount = words.length;
    const frequency: Record<string, number> = {};

    const stopWords = [
      "và",
      "của",
      "có",
      "là",
      "trong",
      "với",
      "để",
      "được",
      "một",
      "các",
      "này",
      "đó",
      "cho",
      "từ",
      "về",
      "như",
      "khi",
      "sẽ",
      "đã",
      "hay",
    ];

    words.forEach((word) => {
      if (word.length > 3 && !stopWords.includes(word)) {
        frequency[word] = (frequency[word] || 0) + 1;
      }
    });

    const density: Record<string, number> = {};
    Object.entries(frequency).forEach(([word, count]) => {
      density[word] = Math.round((count / wordCount) * 100 * 100) / 100;
    });

    return Object.fromEntries(
      Object.entries(density)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10),
    );
  };

  const calculateReadabilityScore = (content: string) => {
    const sentences = content
      .split(/[.!?]+/)
      .filter((s) => s.trim().length > 0).length;
    const words = (content.match(/\b\w+\b/g) || []).length;
    const avgWordsPerSentence = words / sentences;

    let score = 100;
    if (avgWordsPerSentence > 25) score -= 30;
    else if (avgWordsPerSentence > 20) score -= 20;
    else if (avgWordsPerSentence > 15) score -= 10;

    const headings = (content.match(/#{1,6}\s/g) || []).length;
    if (headings >= 3) score += 5;

    return Math.max(0, Math.min(100, Math.round(score)));
  };

  const calculateContentStats = (content: string) => {
    const words = (content.match(/\b\w+\b/g) || []).length;
    const sentences = content
      .split(/[.!?]+/)
      .filter((s) => s.trim().length > 0).length;
    const paragraphs = content
      .split(/\n\s*\n/)
      .filter((p) => p.trim().length > 0).length;
    const headings = (content.match(/#{1,6}\s/g) || []).length;
    const readingTime = Math.ceil(words / 200);

    return { words, sentences, paragraphs, headings, readingTime };
  };

  // AI Content Generation
  const generateContentWithAI = async (
    prompt: string,
    type: "title" | "content" | "excerpt" | "meta",
  ) => {
    setIsGeneratingContent(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const suggestions = {
        title: [
          "10 Bí Quyết Viết Content Chuẩn SEO Năm 2025",
          "Hướng Dẫn Chi Tiết: Tối Ưu SEO Cho Blog Cá Nhân",
          "Template Market: Bộ Sưu Tập Templates React Chất Lượng Cao",
          "Cách Xây Dựng Website Hiệu Quả Với React và TypeScript",
          "Top 15 Tools SEO Miễn Phí Tốt Nhất Cho Blogger Việt Nam",
        ],
        content: [
          "## Giới thiệu\n\nTrong thời đại số hóa hiện nay, việc tối ưu SEO đã trở thành yếu tố then chốt quyết định sự thành công của bất kỳ website nào...",
          "## Xu hướng công nghệ 2025\n\nNăm 2025 đánh dấu một bước ngoặt quan trọng trong ngành công nghệ với sự bùng nổ của AI và Machine Learning...",
          "## Hướng dẫn sử dụng React Hooks\n\nReact Hooks đã thay đổi hoàn toàn cách chúng ta viết components trong React...",
        ],
        excerpt: [
          "Khám phá những bí quyết viết content chuẩn SEO giúp website của bạn đạt top Google một cách hiệu quả và bền vững trong năm 2025.",
          "Hướng dẫn từng bước để tối ưu hóa nội dung blog, tăng traffic tự nhiên và cải thiện thứ hạng tìm kiếm với các kỹ thuật SEO mới nhất.",
          "Bộ sưu tập templates React chuyên nghiệp, giúp developers tiết kiệm thời gian và tạo ra sản phẩm chất lượng cao với performance tối ưu.",
        ],
        meta: [
          "SEO 2025, viết content chuẩn SEO, tối ưu Google, bí quyết SEO, hướng dẫn SEO",
          "React templates, templates chuyên nghiệp, UI components, React TypeScript, frontend development",
          "xu hướng công nghệ 2025, AI machine learning, web3 blockchain, công nghệ mới",
        ],
      };

      return suggestions[type];
    } catch (error) {
      showToast(
        "error",
        "❌ Lỗi AI",
        "Không thể tạo nội dung. Vui lòng thử lại.",
      );
      return [];
    } finally {
      setIsGeneratingContent(false);
    }
  };

  // Watch content changes for SEO analysis
  useEffect(() => {
    if (watchedValues.content) {
      const suggestions = generateSEOSuggestions(
        watchedValues.content,
        watchedValues.title || "",
      );
      setSeoSuggestions(suggestions);

      const density = calculateKeywordDensity(watchedValues.content);
      setKeywordDensity(density);

      const readability = calculateReadabilityScore(watchedValues.content);
      setReadabilityScore(readability);

      const stats = calculateContentStats(watchedValues.content);
      setContentStats(stats);
    }
  }, [
    watchedValues.content,
    watchedValues.title,
    watchedValues.metaDescription,
  ]);

  // Auto-generate slug from title
  useEffect(() => {
    if (watchedValues.title && !isEditing) {
      const slug = watchedValues.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      setValue("slug", slug);
    }
  }, [watchedValues.title, setValue, isEditing]);

  // Categories data
  const categories = [
    { value: "technology", label: "Công nghệ" },
    { value: "design", label: "Thiết kế" },
    { value: "development", label: "Lập trình" },
    { value: "business", label: "Kinh doanh" },
    { value: "marketing", label: "Marketing" },
    { value: "tutorial", label: "Hướng dẫn" },
  ];

  // Tab configuration
  const tabsConfig = [
    {
      id: "content",
      label: "Nội dung",
      icon: FileText,
      color: "from-orange-500 to-amber-500",
    },
    {
      id: "seo-tools",
      label: "SEO Tools",
      icon: Wand2,
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "media",
      label: "Hình ảnh",
      icon: Image,
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "seo",
      label: "SEO Meta",
      icon: Globe,
      color: "from-green-500 to-emerald-500",
    },
  ];

  // Handle tag operations
  const addTag = () => {
    if (tagInput.trim() && !selectedTags.includes(tagInput.trim())) {
      const newTags = [...selectedTags, tagInput.trim()];
      setSelectedTags(newTags);
      setValue("tags", newTags);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = selectedTags.filter((tag) => tag !== tagToRemove);
    setSelectedTags(newTags);
    setValue("tags", newTags);
  };

  // Handle image upload
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files) return;

    setIsUploading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const newImages = Array.from(files).map(
        (file, index) =>
          `https://via.placeholder.com/800x400?text=Uploaded+Image+${uploadedImages.length + index + 1}`,
      );

      setUploadedImages((prev) => [...prev, ...newImages]);
      showToast(
        "success",
        "✅ Upload thành công",
        `Đã upload ${files.length} hình ảnh.`,
      );
    } catch (error) {
      showToast(
        "error",
        "❌ Upload thất bại",
        "Có lỗi xảy ra khi upload hình ảnh.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  // Form submission
  const onSubmit = async (data: BlogFormData) => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Blog data:", data);

      showToast(
        "success",
        isEditing ? "✅ Cập nhật thành công" : "✅ Tạo bài viết thành công",
        isEditing ? "Bài viết đã được cập nhật." : "Bài viết mới đã được tạo.",
      );

      navigate("/admin/blog");
    } catch (error) {
      showToast(
        "error",
        "❌ Có lỗi xảy ra",
        "Không thể lưu bài viết. Vui lòng thử lại.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-pink-50">
      {/* Floating Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4"
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <FileText className="w-8 h-8 text-orange-400 opacity-20" />
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

      <div className="container px-4 py-8 mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between p-6 bg-gradient-to-r from-white/90 via-orange-50/90 to-pink-50/90 backdrop-blur-xl border border-orange-200/50 rounded-3xl shadow-lg">
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/admin/blog")}
                  className="group bg-white/60 hover:bg-white/80 rounded-2xl shadow-md"
                >
                  <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1 text-orange-600" />
                  <span className="font-semibold text-orange-800">
                    Quay lại
                  </span>
                </Button>
              </motion.div>
              <div className="flex items-center space-x-4">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="flex items-center justify-center w-16 h-16 shadow-xl rounded-3xl bg-gradient-to-r from-orange-500 via-amber-500 to-pink-600"
                >
                  <FileText className="w-8 h-8 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-orange-600 via-amber-600 to-pink-600 bg-clip-text">
                    {isEditing ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
                  </h1>
                  <p className="text-orange-700/80 mt-1 flex items-center space-x-2">
                    <Sparkles className="w-4 h-4" />
                    <span>
                      {isEditing
                        ? "Cập nhật nội dung bài viết"
                        : "Viết và xuất bản bài viết mới"}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/80 hover:bg-white border-orange-200/50 hover:border-orange-300 rounded-2xl shadow-md"
                >
                  <Eye className="w-4 h-4 mr-2 text-orange-600" />
                  <span className="font-semibold text-orange-800">
                    Xem trước
                  </span>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                  className="transition-all duration-300 shadow-lg bg-gradient-to-r from-orange-500 via-amber-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 rounded-2xl"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  <span className="font-semibold">
                    {isEditing ? "Cập nhật" : "Xuất bản"}
                  </span>
                  <Sparkles className="w-4 h-4 ml-1" />
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Main Form */}
          <div className="lg:col-span-3">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-6"
            >
              {/* Tab Navigation */}
              <TabsList className="grid w-full h-auto grid-cols-4 p-1 bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-200/30">
                {tabsConfig.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="flex items-center space-x-2 py-3 px-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="hidden sm:inline font-medium">
                      {tab.label}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Content Tab */}
              <TabsContent value="content" className="space-y-6">
                <motion.div
                  key="content-tab"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-0 shadow-xl bg-gradient-to-br from-white/95 via-orange-50/80 to-pink-50/80 backdrop-blur-xl rounded-3xl">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <span className="text-2xl text-transparent bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text font-bold">
                            Nội dung bài viết
                          </span>
                          <p className="text-sm text-orange-700/80 mt-1">
                            Viết nội dung chính của bài viết
                          </p>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Title */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="title"
                          className="text-sm font-semibold text-orange-800"
                        >
                          Tiêu đề bài viết
                        </Label>
                        <Input
                          id="title"
                          placeholder="Nhập tiêu đề hấp dẫn..."
                          {...register("title")}
                          className={`h-12 text-lg bg-white/80 border-orange-200/50 rounded-2xl shadow-md focus:ring-2 focus:ring-orange-400/20 ${errors.title ? "border-red-500" : ""}`}
                        />
                        {errors.title && (
                          <p className="text-sm text-red-500">
                            {errors.title.message}
                          </p>
                        )}
                        {watchedValues.title && (
                          <div className="flex items-center space-x-2 text-xs text-orange-600/80">
                            <span>
                              Độ dài: {watchedValues.title.length} ký tự
                            </span>
                            <Badge
                              variant={
                                watchedValues.title.length >= 30 &&
                                watchedValues.title.length <= 60
                                  ? "default"
                                  : "secondary"
                              }
                              className={
                                watchedValues.title.length >= 30 &&
                                watchedValues.title.length <= 60
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }
                            >
                              {watchedValues.title.length >= 30 &&
                              watchedValues.title.length <= 60
                                ? "Tốt"
                                : "Cần cải thiện"}
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* Slug */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="slug"
                          className="text-sm font-semibold text-orange-800"
                        >
                          URL Slug
                        </Label>
                        <Input
                          id="slug"
                          placeholder="url-slug-bai-viet"
                          {...register("slug")}
                          className={`bg-white/80 border-orange-200/50 rounded-2xl shadow-md ${errors.slug ? "border-red-500" : ""}`}
                        />
                        {errors.slug && (
                          <p className="text-sm text-red-500">
                            {errors.slug.message}
                          </p>
                        )}
                      </div>

                      {/* Excerpt */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="excerpt"
                          className="text-sm font-semibold text-orange-800"
                        >
                          Tóm tắt bài viết
                        </Label>
                        <Textarea
                          id="excerpt"
                          placeholder="Viết tóm tắt ngắn gọn về bài viết..."
                          {...register("excerpt")}
                          className={`min-h-[100px] bg-white/80 border-orange-200/50 rounded-2xl shadow-md ${errors.excerpt ? "border-red-500" : ""}`}
                        />
                        {errors.excerpt && (
                          <p className="text-sm text-red-500">
                            {errors.excerpt.message}
                          </p>
                        )}
                      </div>

                      {/* Content Editor */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="content"
                          className="text-sm font-semibold text-orange-800"
                        >
                          Nội dung chi tiết
                        </Label>
                        <div className="rounded-2xl overflow-hidden shadow-lg">
                          <TinyMCEEditor
                            value={watchedValues.content || ""}
                            onChange={(content) => setValue("content", content)}
                            placeholder="Viết nội dung chi tiết của bài viết với rich text editor..."
                            height={500}
                          />
                        </div>
                        {errors.content && (
                          <p className="text-sm text-red-500">
                            {errors.content.message}
                          </p>
                        )}

                        {/* Content Stats */}
                        {watchedValues.content && (
                          <div className="flex items-center space-x-4 text-xs text-orange-600/80 bg-orange-50/50 p-3 rounded-xl">
                            <span className="font-medium">
                              {contentStats.words} từ
                            </span>
                            <span className="font-medium">
                              {contentStats.sentences} câu
                            </span>
                            <span className="font-medium">
                              {contentStats.paragraphs} đoạn
                            </span>
                            <span className="font-medium">
                              {contentStats.readingTime} phút đọc
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* SEO Tools Tab */}
              <TabsContent value="seo-tools" className="space-y-6">
                <motion.div
                  key="seo-tools-tab"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-0 shadow-xl bg-gradient-to-br from-white/95 via-purple-50/80 to-pink-50/80 backdrop-blur-xl rounded-3xl">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
                          <Wand2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <span className="text-2xl text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text font-bold">
                            Công cụ SEO thông minh
                          </span>
                          <p className="text-sm text-purple-700/80 mt-1">
                            AI hỗ trợ viết content chuẩn SEO
                          </p>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* AI Content Generator */}
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                        <motion.div whileHover={{ scale: 1.02 }}>
                          <Button
                            variant="outline"
                            className="flex-col w-full h-20 space-y-2 group bg-white/80 border-purple-200/50 hover:border-purple-300 rounded-2xl shadow-md hover:shadow-lg"
                            onClick={async () => {
                              const suggestions = await generateContentWithAI(
                                "",
                                "title",
                              );
                              if (suggestions.length > 0) {
                                setValue(
                                  "title",
                                  suggestions[
                                    Math.floor(
                                      Math.random() * suggestions.length,
                                    )
                                  ],
                                );
                                showToast(
                                  "success",
                                  "✨ AI đã tạo tiêu đề",
                                  "Tiêu đề mới đã được áp dụng!",
                                );
                              }
                            }}
                            disabled={isGeneratingContent}
                          >
                            {isGeneratingContent ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <Brain className="w-5 h-5 group-hover:text-purple-500" />
                            )}
                            <span className="text-sm font-medium">
                              Tạo tiêu đề AI
                            </span>
                          </Button>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.02 }}>
                          <Button
                            variant="outline"
                            className="flex-col w-full h-20 space-y-2 group bg-white/80 border-purple-200/50 hover:border-purple-300 rounded-2xl shadow-md hover:shadow-lg"
                            onClick={async () => {
                              const suggestions = await generateContentWithAI(
                                "",
                                "excerpt",
                              );
                              if (suggestions.length > 0) {
                                setValue(
                                  "excerpt",
                                  suggestions[
                                    Math.floor(
                                      Math.random() * suggestions.length,
                                    )
                                  ],
                                );
                                showToast(
                                  "success",
                                  "✨ AI đã tạo tóm tắt",
                                  "Tóm tắt mới đã được áp dụng!",
                                );
                              }
                            }}
                            disabled={isGeneratingContent}
                          >
                            {isGeneratingContent ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <PenTool className="w-5 h-5 group-hover:text-green-500" />
                            )}
                            <span className="text-sm font-medium">
                              Tạo tóm tắt AI
                            </span>
                          </Button>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.02 }}>
                          <Button
                            variant="outline"
                            className="flex-col w-full h-20 space-y-2 group bg-white/80 border-purple-200/50 hover:border-purple-300 rounded-2xl shadow-md hover:shadow-lg"
                            onClick={async () => {
                              const suggestions = await generateContentWithAI(
                                "",
                                "content",
                              );
                              if (suggestions.length > 0) {
                                const currentContent =
                                  watchedValues.content || "";
                                setValue(
                                  "content",
                                  currentContent +
                                    "\n\n" +
                                    suggestions[
                                      Math.floor(
                                        Math.random() * suggestions.length,
                                      )
                                    ],
                                );
                                showToast(
                                  "success",
                                  "✨ AI đã thêm nội dung",
                                  "Nội dung mới đã được thêm vào bài viết!",
                                );
                              }
                            }}
                            disabled={isGeneratingContent}
                          >
                            {isGeneratingContent ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <Sparkles className="w-5 h-5 group-hover:text-purple-500" />
                            )}
                            <span className="text-sm font-medium">
                              Mở rộng nội dung
                            </span>
                          </Button>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.02 }}>
                          <Button
                            variant="outline"
                            className="flex-col w-full h-20 space-y-2 group bg-white/80 border-purple-200/50 hover:border-purple-300 rounded-2xl shadow-md hover:shadow-lg"
                            onClick={async () => {
                              const suggestions = await generateContentWithAI(
                                "",
                                "meta",
                              );
                              if (suggestions.length > 0) {
                                setValue(
                                  "metaKeywords",
                                  suggestions[
                                    Math.floor(
                                      Math.random() * suggestions.length,
                                    )
                                  ],
                                );
                                showToast(
                                  "success",
                                  "✨ AI đã tạo meta keywords",
                                  "Meta keywords mới đã được áp dụng!",
                                );
                              }
                            }}
                            disabled={isGeneratingContent}
                          >
                            {isGeneratingContent ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <Target className="w-5 h-5 group-hover:text-orange-500" />
                            )}
                            <span className="text-sm font-medium">
                              Tạo keywords
                            </span>
                          </Button>
                        </motion.div>
                      </div>

                      {/* SEO Analysis Dashboard */}
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Readability Score */}
                        <Card className="p-4 border-0 bg-gradient-to-br from-blue-50/80 to-cyan-50/80 backdrop-blur-sm rounded-2xl shadow-md">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <BookOpen className="w-4 h-4 text-blue-600" />
                              <span className="font-semibold text-blue-800">
                                Độ dễ đọc
                              </span>
                            </div>
                            <Badge
                              className={`${
                                readabilityScore >= 80
                                  ? "bg-green-100 text-green-800"
                                  : readabilityScore >= 60
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              } font-semibold`}
                            >
                              {readabilityScore}/100
                            </Badge>
                          </div>
                          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              className={`h-3 rounded-full ${
                                readabilityScore >= 80
                                  ? "bg-gradient-to-r from-green-400 to-green-600"
                                  : readabilityScore >= 60
                                    ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
                                    : "bg-gradient-to-r from-red-400 to-red-600"
                              }`}
                              initial={{ width: 0 }}
                              animate={{ width: `${readabilityScore}%` }}
                              transition={{ duration: 1 }}
                            />
                          </div>
                          <p className="mt-2 text-xs text-blue-700/80 font-medium">
                            {readabilityScore >= 80
                              ? "Rất dễ đọc và hiểu"
                              : readabilityScore >= 60
                                ? "Khá dễ đọc"
                                : "Khó đọc, nên cải thiện"}
                          </p>
                        </Card>

                        {/* Content Stats */}
                        <Card className="p-4 border-0 bg-gradient-to-br from-purple-50/80 to-pink-50/80 backdrop-blur-sm rounded-2xl shadow-md">
                          <div className="flex items-center mb-3 space-x-2">
                            <BarChart className="w-4 h-4 text-purple-600" />
                            <span className="font-semibold text-purple-800">
                              Thống kê nội dung
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex justify-between p-2 bg-white/50 rounded-lg">
                              <span className="text-purple-700/80">Từ:</span>
                              <span className="font-semibold text-purple-800">
                                {contentStats.words}
                              </span>
                            </div>
                            <div className="flex justify-between p-2 bg-white/50 rounded-lg">
                              <span className="text-purple-700/80">Câu:</span>
                              <span className="font-semibold text-purple-800">
                                {contentStats.sentences}
                              </span>
                            </div>
                            <div className="flex justify-between p-2 bg-white/50 rounded-lg">
                              <span className="text-purple-700/80">Đoạn:</span>
                              <span className="font-semibold text-purple-800">
                                {contentStats.paragraphs}
                              </span>
                            </div>
                            <div className="flex justify-between p-2 bg-white/50 rounded-lg">
                              <span className="text-purple-700/80">
                                Heading:
                              </span>
                              <span className="font-semibold text-purple-800">
                                {contentStats.headings}
                              </span>
                            </div>
                          </div>
                          <div className="pt-2 mt-2 border-t border-purple-200/50">
                            <div className="flex justify-between text-sm p-2 bg-white/50 rounded-lg">
                              <span className="text-purple-700/80">
                                Thời gian đọc:
                              </span>
                              <span className="font-semibold text-purple-800">
                                {contentStats.readingTime} phút
                              </span>
                            </div>
                          </div>
                        </Card>
                      </div>

                      {/* SEO Suggestions */}
                      {seoSuggestions.length > 0 && (
                        <Card className="p-4 border-0 bg-gradient-to-br from-yellow-50/80 to-orange-50/80 backdrop-blur-sm rounded-2xl shadow-md">
                          <div className="flex items-center mb-3 space-x-2">
                            <Lightbulb className="w-4 h-4 text-yellow-600" />
                            <span className="font-semibold text-yellow-800">
                              Gợi ý SEO ({seoSuggestions.length})
                            </span>
                          </div>
                          <div className="space-y-2">
                            {seoSuggestions.map((suggestion, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-start p-3 space-x-2 transition-colors rounded-xl bg-white/60 hover:bg-white/80"
                              >
                                <Target className="w-3 h-3 text-yellow-600 mt-0.5 flex-shrink-0" />
                                <span className="text-sm font-medium text-yellow-800">
                                  {suggestion}
                                </span>
                              </motion.div>
                            ))}
                          </div>
                        </Card>
                      )}

                      {/* Keyword Density */}
                      {Object.keys(keywordDensity).length > 0 && (
                        <Card className="p-4 border-0 bg-gradient-to-br from-green-50/80 to-emerald-50/80 backdrop-blur-sm rounded-2xl shadow-md">
                          <div className="flex items-center mb-3 space-x-2">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                            <span className="font-semibold text-green-800">
                              Mật độ từ khóa
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {Object.entries(keywordDensity).map(
                              ([word, density]) => (
                                <div
                                  key={word}
                                  className="flex items-center justify-between p-3 rounded-xl bg-white/60"
                                >
                                  <span className="text-sm font-semibold text-green-800">
                                    {word}
                                  </span>
                                  <Badge
                                    variant="outline"
                                    className={`text-xs font-semibold ${
                                      density > 3
                                        ? "border-red-500 text-red-600 bg-red-50"
                                        : density > 1
                                          ? "border-green-500 text-green-600 bg-green-50"
                                          : "border-gray-500 text-gray-600 bg-gray-50"
                                    }`}
                                  >
                                    {density}%
                                  </Badge>
                                </div>
                              ),
                            )}
                          </div>
                          <p className="mt-2 text-xs text-green-700/80 font-medium">
                            💡 Mật độ từ khóa lý tưởng: 1-3%. Tránh spam từ
                            khóa.
                          </p>
                        </Card>
                      )}

                      {/* SEO Tools Links */}
                      <Card className="p-4 border-0 bg-gradient-to-br from-indigo-50/80 to-blue-50/80 backdrop-blur-sm rounded-2xl shadow-md">
                        <div className="flex items-center mb-3 space-x-2">
                          <Cpu className="w-4 h-4 text-indigo-600" />
                          <span className="font-semibold text-indigo-800">
                            Công cụ SEO khuyên dùng
                          </span>
                        </div>
                        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                          <a
                            href="https://aiktp.com/vi"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-3 space-x-2 transition-colors rounded-xl bg-white/60 hover:bg-white/80 group"
                          >
                            <Zap className="w-4 h-4 text-blue-600 transition-transform group-hover:scale-110" />
                            <span className="text-sm font-medium">
                              AIKTP - AI viết content
                            </span>
                          </a>
                          <a
                            href="https://laho.vn"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-3 space-x-2 transition-colors rounded-xl bg-white/60 hover:bg-white/80 group"
                          >
                            <Brain className="w-4 h-4 text-green-600 transition-transform group-hover:scale-110" />
                            <span className="text-sm font-medium">
                              Laho.vn - SEO Việt Nam
                            </span>
                          </a>
                          <a
                            href="https://grammarly.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-3 space-x-2 transition-colors rounded-xl bg-white/60 hover:bg-white/80 group"
                          >
                            <PenTool className="w-4 h-4 text-purple-600 transition-transform group-hover:scale-110" />
                            <span className="text-sm font-medium">
                              Grammarly - Kiểm tra ngữ pháp
                            </span>
                          </a>
                          <a
                            href="https://smallseotools.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-3 space-x-2 transition-colors rounded-xl bg-white/60 hover:bg-white/80 group"
                          >
                            <Search className="w-4 h-4 text-orange-600 transition-transform group-hover:scale-110" />
                            <span className="text-sm font-medium">
                              Small SEO Tools
                            </span>
                          </a>
                        </div>
                      </Card>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Media Tab */}
              <TabsContent value="media" className="space-y-6">
                <motion.div
                  key="media-tab"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-0 shadow-xl bg-gradient-to-br from-white/95 via-blue-50/80 to-cyan-50/80 backdrop-blur-xl rounded-3xl">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg">
                          <Image className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <span className="text-2xl text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text font-bold">
                            Quản lý hình ảnh
                          </span>
                          <p className="text-sm text-blue-700/80 mt-1">
                            Upload và quản lý hình ảnh cho bài viết
                          </p>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Featured Image */}
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-blue-800">
                          Hình ảnh đại diện
                        </Label>
                        <Input
                          placeholder="URL hình ảnh đại diện"
                          {...register("featuredImage")}
                          className="bg-white/80 border-blue-200/50 rounded-2xl shadow-md"
                        />
                      </div>

                      {/* Image Upload */}
                      <div className="space-y-4">
                        <Label className="text-sm font-semibold text-blue-800">
                          Upload hình ảnh
                        </Label>
                        <div className="p-8 text-center border-2 border-blue-300/50 border-dashed rounded-2xl bg-blue-50/30">
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="image-upload"
                          />
                          <label
                            htmlFor="image-upload"
                            className="flex flex-col items-center space-y-2 cursor-pointer"
                          >
                            {isUploading ? (
                              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                            ) : (
                              <Upload className="w-8 h-8 text-blue-500" />
                            )}
                            <span className="text-sm font-semibold text-blue-800">
                              {isUploading
                                ? "Đang upload..."
                                : "Click để upload hình ảnh"}
                            </span>
                            <span className="text-xs text-blue-600/80">
                              PNG, JPG, GIF up to 10MB
                            </span>
                          </label>
                        </div>
                      </div>

                      {/* Uploaded Images */}
                      {uploadedImages.length > 0 && (
                        <div className="space-y-4">
                          <Label className="text-sm font-semibold text-blue-800">
                            Hình ảnh đã upload ({uploadedImages.length})
                          </Label>
                          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                            {uploadedImages.map((image, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={image}
                                  alt={`Upload ${index + 1}`}
                                  className="object-cover w-full h-24 rounded-xl shadow-md"
                                />
                                <button
                                  onClick={() =>
                                    setUploadedImages((prev) =>
                                      prev.filter((_, i) => i !== index),
                                    )
                                  }
                                  className="absolute p-1 text-white transition-opacity bg-red-500 rounded-full opacity-0 top-1 right-1 group-hover:opacity-100"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* SEO Meta Tab */}
              <TabsContent value="seo" className="space-y-6">
                <motion.div
                  key="seo-tab"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-0 shadow-xl bg-gradient-to-br from-white/95 via-green-50/80 to-emerald-50/80 backdrop-blur-xl rounded-3xl">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg">
                          <Globe className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <span className="text-2xl text-transparent bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text font-bold">
                            SEO Meta Tags
                          </span>
                          <p className="text-sm text-green-700/80 mt-1">
                            Tối ưu hóa cho công cụ tìm kiếm
                          </p>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Meta Title */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="metaTitle"
                          className="text-sm font-semibold text-green-800"
                        >
                          Meta Title
                        </Label>
                        <Input
                          id="metaTitle"
                          placeholder="Tiêu đề SEO (khuyến nghị 50-60 ký tự)"
                          {...register("metaTitle")}
                          className="bg-white/80 border-green-200/50 rounded-2xl shadow-md"
                        />
                        {watchedValues.metaTitle && (
                          <div className="flex items-center space-x-2 text-xs text-green-600/80">
                            <span>
                              Độ dài: {watchedValues.metaTitle.length} ký tự
                            </span>
                            <Badge
                              variant={
                                watchedValues.metaTitle.length >= 50 &&
                                watchedValues.metaTitle.length <= 60
                                  ? "default"
                                  : "secondary"
                              }
                              className={
                                watchedValues.metaTitle.length >= 50 &&
                                watchedValues.metaTitle.length <= 60
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }
                            >
                              {watchedValues.metaTitle.length >= 50 &&
                              watchedValues.metaTitle.length <= 60
                                ? "Tốt"
                                : "Cần cải thiện"}
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* Meta Description */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="metaDescription"
                          className="text-sm font-semibold text-green-800"
                        >
                          Meta Description
                        </Label>
                        <Textarea
                          id="metaDescription"
                          placeholder="Mô tả SEO (khuyến nghị 120-160 ký tự)"
                          {...register("metaDescription")}
                          className="min-h-[80px] bg-white/80 border-green-200/50 rounded-2xl shadow-md"
                        />
                        {watchedValues.metaDescription && (
                          <div className="flex items-center space-x-2 text-xs text-green-600/80">
                            <span>
                              Độ dài: {watchedValues.metaDescription.length} ký
                              tự
                            </span>
                            <Badge
                              variant={
                                watchedValues.metaDescription.length >= 120 &&
                                watchedValues.metaDescription.length <= 160
                                  ? "default"
                                  : "secondary"
                              }
                              className={
                                watchedValues.metaDescription.length >= 120 &&
                                watchedValues.metaDescription.length <= 160
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }
                            >
                              {watchedValues.metaDescription.length >= 120 &&
                              watchedValues.metaDescription.length <= 160
                                ? "Tốt"
                                : "Cần cải thiện"}
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* Meta Keywords */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="metaKeywords"
                          className="text-sm font-semibold text-green-800"
                        >
                          Meta Keywords
                        </Label>
                        <Input
                          id="metaKeywords"
                          placeholder="từ khóa 1, từ khóa 2, từ khóa 3"
                          {...register("metaKeywords")}
                          className="bg-white/80 border-green-200/50 rounded-2xl shadow-md"
                        />
                        <p className="text-xs text-green-600/80 font-medium">
                          Phân cách bằng dấu phẩy. Khuyến nghị 3-5 từ khóa
                          chính.
                        </p>
                      </div>

                      {/* SEO Preview */}
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-green-800">
                          Preview Google Search
                        </Label>
                        <div className="p-4 bg-white border border-green-200/50 rounded-2xl shadow-md">
                          <div className="space-y-1">
                            <div className="text-lg font-medium text-blue-600 cursor-pointer hover:underline">
                              {watchedValues.metaTitle ||
                                watchedValues.title ||
                                "Tiêu đề bài viết"}
                            </div>
                            <div className="text-sm text-green-600">
                              https://templatemarket.vn/blog/
                              {watchedValues.slug || "url-slug"}
                            </div>
                            <div className="text-sm text-gray-600">
                              {watchedValues.metaDescription ||
                                watchedValues.excerpt ||
                                "Mô tả bài viết sẽ hiển thị ở đây..."}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white/95 to-orange-50/80 backdrop-blur-sm rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-orange-600" />
                  <span className="text-orange-800">Xuất bản</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Status */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-orange-800">
                    Trạng thái
                  </Label>
                  <Select
                    value={watchedValues.status}
                    onValueChange={(value) =>
                      setValue("status", value as "draft" | "published")
                    }
                  >
                    <SelectTrigger className="bg-white/80 border-orange-200/50 rounded-xl shadow-md">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-yellow-500" />
                          <span>Bản nháp</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="published">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Đã xuất bản</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-orange-800">
                    Danh mục
                  </Label>
                  <Select
                    value={watchedValues.category}
                    onValueChange={(value) => setValue("category", value)}
                  >
                    <SelectTrigger className="bg-white/80 border-orange-200/50 rounded-xl shadow-md">
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-red-500">
                      {errors.category.message}
                    </p>
                  )}
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-orange-800">
                    Tags
                  </Label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Nhập tag"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addTag())
                      }
                      className="bg-white/80 border-orange-200/50 rounded-xl shadow-md"
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={addTag}
                      className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl shadow-md"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {selectedTags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedTags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="group bg-orange-100 text-orange-800 rounded-xl"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 transition-opacity opacity-0 group-hover:opacity-100"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white/95 to-purple-50/80 backdrop-blur-sm rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart className="w-5 h-5 text-purple-600" />
                  <span className="text-purple-800">Thống kê nhanh</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 text-center rounded-xl bg-gradient-to-br from-blue-50 to-blue-100">
                    <div className="text-2xl font-bold text-blue-600">
                      {contentStats.words}
                    </div>
                    <div className="text-xs font-medium text-blue-700">Từ</div>
                  </div>
                  <div className="p-3 text-center rounded-xl bg-gradient-to-br from-green-50 to-green-100">
                    <div className="text-2xl font-bold text-green-600">
                      {contentStats.readingTime}
                    </div>
                    <div className="text-xs font-medium text-green-700">
                      Phút đọc
                    </div>
                  </div>
                  <div className="p-3 text-center rounded-xl bg-gradient-to-br from-purple-50 to-purple-100">
                    <div className="text-2xl font-bold text-purple-600">
                      {readabilityScore}
                    </div>
                    <div className="text-xs font-medium text-purple-700">
                      Điểm SEO
                    </div>
                  </div>
                  <div className="p-3 text-center rounded-xl bg-gradient-to-br from-orange-50 to-orange-100">
                    <div className="text-2xl font-bold text-orange-600">
                      {seoSuggestions.length}
                    </div>
                    <div className="text-xs font-medium text-orange-700">
                      Gợi ý
                    </div>
                  </div>
                </div>

                {/* SEO Score */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-purple-800">
                      SEO Score
                    </span>
                    <Badge
                      className={`${
                        readabilityScore >= 80
                          ? "bg-green-100 text-green-800"
                          : readabilityScore >= 60
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      } font-semibold`}
                    >
                      {readabilityScore >= 80
                        ? "Tuyệt vời"
                        : readabilityScore >= 60
                          ? "Tốt"
                          : "Cần cải thiện"}
                    </Badge>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-3 rounded-full transition-all duration-500 ${
                        readabilityScore >= 80
                          ? "bg-gradient-to-r from-green-400 to-green-600"
                          : readabilityScore >= 60
                            ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
                            : "bg-gradient-to-r from-red-400 to-red-600"
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${readabilityScore}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Author Info */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white/95 to-blue-50/80 backdrop-blur-sm rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-800">Tác giả</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-pink-600 shadow-lg">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-orange-800">
                      Admin User
                    </div>
                    <div className="text-sm text-orange-600/80">
                      {new Date().toLocaleDateString("vi-VN")}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white/95 to-amber-50/80 backdrop-blur-sm rounded-2xl">
              <CardHeader>
                <CardTitle className="text-sm font-semibold text-amber-800">
                  Thao tác nhanh
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start w-full bg-white/80 border-amber-200/50 hover:border-amber-300 rounded-xl shadow-md"
                  onClick={() => {
                    const content = watchedValues.content || "";
                    navigator.clipboard.writeText(content);
                    showToast(
                      "success",
                      "📋 Đã copy",
                      "Nội dung đã được copy vào clipboard.",
                    );
                  }}
                >
                  <FileText className="w-4 h-4 mr-2 text-amber-600" />
                  <span className="font-medium text-amber-800">
                    Copy nội dung
                  </span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start w-full bg-white/80 border-amber-200/50 hover:border-amber-300 rounded-xl shadow-md"
                  onClick={() => {
                    const wordCount = (
                      watchedValues.content?.match(/\b\w+\b/g) || []
                    ).length;
                    showToast(
                      "info",
                      "📊 Thống kê",
                      `Bài viết có ${wordCount} từ, ${contentStats.readingTime} phút đọc.`,
                    );
                  }}
                >
                  <BarChart className="w-4 h-4 mr-2 text-amber-600" />
                  <span className="font-medium text-amber-800">
                    Xem thống kê
                  </span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start w-full bg-white/80 border-amber-200/50 hover:border-amber-300 rounded-xl shadow-md"
                  onClick={() => setActiveTab("seo-tools")}
                >
                  <Wand2 className="w-4 h-4 mr-2 text-amber-600" />
                  <span className="font-medium text-amber-800">
                    Mở SEO Tools
                  </span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Floating Action Buttons */}
        <div className="fixed flex flex-col space-y-3 bottom-6 right-6">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              size="lg"
              className="rounded-full shadow-xl bg-gradient-to-r from-orange-500 via-amber-500 to-pink-600 hover:from-orange-600 hover:to-pink-700"
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full shadow-xl bg-white/80 hover:bg-white border-orange-200/50 hover:border-orange-300"
              onClick={() => {
                showToast(
                  "info",
                  "👁️ Xem trước",
                  "Tính năng xem trước đang được phát triển.",
                );
              }}
            >
              <Eye className="w-5 h-5 text-orange-600" />
            </Button>
          </motion.div>
        </div>

        {/* Loading Overlay */}
        <AnimatePresence>
          {isSubmitting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            >
              <Card className="p-6 border-0 shadow-2xl bg-gradient-to-br from-white to-orange-50 rounded-3xl">
                <CardContent className="flex items-center space-x-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Loader2 className="w-8 h-8 text-orange-600" />
                  </motion.div>
                  <div>
                    <div className="font-semibold text-orange-800">
                      {isEditing
                        ? "Đang cập nhật bài viết..."
                        : "Đang tạo bài viết..."}
                    </div>
                    <div className="text-sm text-orange-600/80">
                      Vui lòng đợi trong giây lát
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BlogCreate;
