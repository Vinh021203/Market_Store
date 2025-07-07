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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
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
  AlertCircle,
  CheckCircle,
  Clock,
  // ✅ SEO Tools Icons
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
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

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

  // Form state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("content");
  const [tagInput, setTagInput] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // ✅ SEO Tools State
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

  // ✅ SEO Helper Functions
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

    // Loại bỏ stop words tiếng Việt
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
      "hoặc",
      "nhưng",
      "nếu",
      "thì",
      "bởi",
      "vì",
      "do",
      "theo",
      "trên",
      "dưới",
      "giữa",
      "sau",
      "trước",
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

    // Simple readability score (0-100)
    let score = 100;
    if (avgWordsPerSentence > 25) score -= 30;
    else if (avgWordsPerSentence > 20) score -= 20;
    else if (avgWordsPerSentence > 15) score -= 10;

    // Bonus for good structure
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
    const readingTime = Math.ceil(words / 200); // 200 words per minute

    return { words, sentences, paragraphs, headings, readingTime };
  };

  // ✅ AI Content Generation
  const generateContentWithAI = async (
    prompt: string,
    type: "title" | "content" | "excerpt" | "meta",
  ) => {
    setIsGeneratingContent(true);
    try {
      // Simulate AI API call
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
          "## Giới thiệu\n\nTrong thời đại số hóa hiện nay, việc tối ưu SEO đã trở thành yếu tố then chốt quyết định sự thành công của bất kỳ website nào. Với hàng triệu trang web cạnh tranh để xuất hiện trên trang đầu Google, việc hiểu và áp dụng đúng các kỹ thuật SEO không chỉ là lựa chọn mà đã trở thành điều bắt buộc.\n\n## Tại sao SEO quan trọng?\n\nSEO (Search Engine Optimization) không chỉ giúp website của bạn xuất hiện cao hơn trong kết quả tìm kiếm, mà còn:\n\n- Tăng lưu lượng truy cập tự nhiên\n- Cải thiện trải nghiệm người dùng\n- Xây dựng uy tín thương hiệu\n- Tăng tỷ lệ chuyển đổi\n\n## Các bước thực hiện\n\n### 1. Nghiên cứu từ khóa\nViệc nghiên cứu từ khóa là bước đầu tiên và quan trọng nhất...",
          "## Xu hướng công nghệ 2025\n\nNăm 2025 đánh dấu một bước ngoặt quan trọng trong ngành công nghệ với sự bùng nổ của AI và Machine Learning. Các xu hướng chính bao gồm:\n\n### Artificial Intelligence (AI)\nAI không còn là khái niệm xa vời mà đã trở thành công cụ thiết yếu trong mọi lĩnh vực...\n\n### Web3 và Blockchain\nCông nghệ blockchain tiếp tục phát triển mạnh mẽ...",
          "## Hướng dẫn sử dụng React Hooks\n\nReact Hooks đã thay đổi hoàn toàn cách chúng ta viết components trong React. Từ khi ra mắt, Hooks đã trở thành standard cho việc quản lý state và side effects.\n\n### useState Hook\n``````\n\n### useEffect Hook\nQuản lý side effects một cách hiệu quả...",
        ],
        excerpt: [
          "Khám phá những bí quyết viết content chuẩn SEO giúp website của bạn đạt top Google một cách hiệu quả và bền vững trong năm 2025.",
          "Hướng dẫn từng bước để tối ưu hóa nội dung blog, tăng traffic tự nhiên và cải thiện thứ hạng tìm kiếm với các kỹ thuật SEO mới nhất.",
          "Bộ sưu tập templates React chuyên nghiệp, giúp developers tiết kiệm thời gian và tạo ra sản phẩm chất lượng cao với performance tối ưu.",
          "Tìm hiểu các xu hướng công nghệ hot nhất 2025 và cách áp dụng chúng vào dự án thực tế để tạo ra sản phẩm đột phá.",
          "Hướng dẫn chi tiết cách sử dụng React Hooks hiệu quả, từ cơ bản đến nâng cao với nhiều ví dụ thực tế.",
        ],
        meta: [
          "SEO 2025, viết content chuẩn SEO, tối ưu Google, bí quyết SEO, hướng dẫn SEO",
          "React templates, templates chuyên nghiệp, UI components, React TypeScript, frontend development",
          "xu hướng công nghệ 2025, AI machine learning, web3 blockchain, công nghệ mới",
          "React Hooks, useState, useEffect, React development, JavaScript ES6",
        ],
      };

      return suggestions[type];
    } catch (error) {
      toast({
        title: "❌ Lỗi AI",
        description: "Không thể tạo nội dung. Vui lòng thử lại.",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsGeneratingContent(false);
    }
  };

  // ✅ Watch content changes for SEO analysis
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
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "seo-tools", // ✅ New SEO Tools tab
      label: "SEO Tools",
      icon: Wand2,
      color: "from-orange-500 to-red-500",
    },
    {
      id: "media",
      label: "Hình ảnh",
      icon: Image,
      color: "from-purple-500 to-pink-500",
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
      // Simulate upload
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const newImages = Array.from(files).map(
        (file, index) =>
          `https://via.placeholder.com/800x400?text=Uploaded+Image+${uploadedImages.length + index + 1}`,
      );

      setUploadedImages((prev) => [...prev, ...newImages]);

      toast({
        title: "✅ Upload thành công",
        description: `Đã upload ${files.length} hình ảnh.`,
      });
    } catch (error) {
      toast({
        title: "❌ Upload thất bại",
        description: "Có lỗi xảy ra khi upload hình ảnh.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Form submission
  const onSubmit = async (data: BlogFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Blog data:", data);

      toast({
        title: isEditing
          ? "✅ Cập nhật thành công"
          : "✅ Tạo bài viết thành công",
        description: isEditing
          ? "Bài viết đã được cập nhật."
          : "Bài viết mới đã được tạo.",
      });

      navigate("/admin/blog");
    } catch (error) {
      toast({
        title: "❌ Có lỗi xảy ra",
        description: "Không thể lưu bài viết. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-900 dark:to-purple-900">
      <div className="container px-4 py-8 mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/admin/blog")}
                className="group"
              >
                <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                Quay lại
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text">
                  {isEditing ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
                </h1>
                <p className="text-muted-foreground">
                  {isEditing
                    ? "Cập nhật nội dung bài viết"
                    : "Viết và xuất bản bài viết mới"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Xem trước
              </Button>
              <Button
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {isEditing ? "Cập nhật" : "Xuất bản"}
              </Button>
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
              <TabsList className="grid w-full h-auto grid-cols-4 p-1 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                {tabsConfig.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="flex items-center space-x-2 py-3 px-4 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700"
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
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
                            Viết nội dung chính của bài viết
                          </p>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Title */}
                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm font-medium">
                          Tiêu đề bài viết
                        </Label>
                        <Input
                          id="title"
                          placeholder="Nhập tiêu đề hấp dẫn..."
                          {...register("title")}
                          className={`h-12 text-lg ${errors.title ? "border-red-500" : ""}`}
                        />
                        {errors.title && (
                          <p className="text-sm text-red-500">
                            {errors.title.message}
                          </p>
                        )}
                        {watchedValues.title && (
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
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
                        <Label htmlFor="slug" className="text-sm font-medium">
                          URL Slug
                        </Label>
                        <Input
                          id="slug"
                          placeholder="url-slug-bai-viet"
                          {...register("slug")}
                          className={errors.slug ? "border-red-500" : ""}
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
                          className="text-sm font-medium"
                        >
                          Tóm tắt bài viết
                        </Label>
                        <Textarea
                          id="excerpt"
                          placeholder="Viết tóm tắt ngắn gọn về bài viết..."
                          {...register("excerpt")}
                          className={`min-h-[100px] ${errors.excerpt ? "border-red-500" : ""}`}
                        />
                        {errors.excerpt && (
                          <p className="text-sm text-red-500">
                            {errors.excerpt.message}
                          </p>
                        )}
                      </div>

                      {/* Content */}
                      {/* Content - SỬ DỤNG TinyMCEEditor */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="content"
                          className="text-sm font-medium"
                        >
                          Nội dung chi tiết
                        </Label>

                        <TinyMCEEditor
                          value={watchedValues.content || ""}
                          onChange={(content) => setValue("content", content)}
                          placeholder="Viết nội dung chi tiết của bài viết với rich text editor..."
                          height={500}
                        />

                        {errors.content && (
                          <p className="text-sm text-red-500">
                            {errors.content.message}
                          </p>
                        )}

                        {/* Content Stats */}
                        {watchedValues.content && (
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>{contentStats.words} từ</span>
                            <span>{contentStats.sentences} câu</span>
                            <span>{contentStats.paragraphs} đoạn</span>
                            <span>{contentStats.readingTime} phút đọc</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* ✅ SEO Tools Tab */}
              <TabsContent value="seo-tools" className="space-y-6">
                <motion.div
                  key="seo-tools-tab"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-orange-50 dark:from-slate-800 dark:to-orange-900">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-orange-500 to-red-500">
                          <Wand2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <span className="text-xl text-transparent bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text">
                            Công cụ SEO thông minh
                          </span>
                          <p className="mt-1 text-sm text-muted-foreground">
                            AI hỗ trợ viết content chuẩn SEO
                          </p>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* ✅ AI Content Generator */}
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                        <motion.div whileHover={{ scale: 1.02 }}>
                          <Button
                            variant="outline"
                            className="flex-col w-full h-20 space-y-2 group"
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
                                toast({
                                  title: "✨ AI đã tạo tiêu đề",
                                  description: "Tiêu đề mới đã được áp dụng!",
                                });
                              }
                            }}
                            disabled={isGeneratingContent}
                          >
                            {isGeneratingContent ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <Brain className="w-5 h-5 group-hover:text-blue-500" />
                            )}
                            <span className="text-sm">Tạo tiêu đề AI</span>
                          </Button>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.02 }}>
                          <Button
                            variant="outline"
                            className="flex-col w-full h-20 space-y-2 group"
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
                                toast({
                                  title: "✨ AI đã tạo tóm tắt",
                                  description: "Tóm tắt mới đã được áp dụng!",
                                });
                              }
                            }}
                            disabled={isGeneratingContent}
                          >
                            {isGeneratingContent ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <PenTool className="w-5 h-5 group-hover:text-green-500" />
                            )}
                            <span className="text-sm">Tạo tóm tắt AI</span>
                          </Button>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.02 }}>
                          <Button
                            variant="outline"
                            className="flex-col w-full h-20 space-y-2 group"
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
                                toast({
                                  title: "✨ AI đã thêm nội dung",
                                  description:
                                    "Nội dung mới đã được thêm vào bài viết!",
                                });
                              }
                            }}
                            disabled={isGeneratingContent}
                          >
                            {isGeneratingContent ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <Sparkles className="w-5 h-5 group-hover:text-purple-500" />
                            )}
                            <span className="text-sm">Mở rộng nội dung</span>
                          </Button>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.02 }}>
                          <Button
                            variant="outline"
                            className="flex-col w-full h-20 space-y-2 group"
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
                                toast({
                                  title: "✨ AI đã tạo meta keywords",
                                  description:
                                    "Meta keywords mới đã được áp dụng!",
                                });
                              }
                            }}
                            disabled={isGeneratingContent}
                          >
                            {isGeneratingContent ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <Target className="w-5 h-5 group-hover:text-orange-500" />
                            )}
                            <span className="text-sm">Tạo keywords</span>
                          </Button>
                        </motion.div>
                      </div>

                      {/* ✅ SEO Analysis Dashboard */}
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Readability Score */}
                        <Card className="p-4 border-0 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <BookOpen className="w-4 h-4 text-blue-600" />
                              <span className="font-medium">Độ dễ đọc</span>
                            </div>
                            <Badge
                              className={`${
                                readabilityScore >= 80
                                  ? "bg-green-100 text-green-800"
                                  : readabilityScore >= 60
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }`}
                            >
                              {readabilityScore}/100
                            </Badge>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full">
                            <motion.div
                              className={`h-2 rounded-full ${
                                readabilityScore >= 80
                                  ? "bg-green-500"
                                  : readabilityScore >= 60
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                              }`}
                              initial={{ width: 0 }}
                              animate={{ width: `${readabilityScore}%` }}
                              transition={{ duration: 1 }}
                            />
                          </div>
                          <p className="mt-2 text-xs text-muted-foreground">
                            {readabilityScore >= 80
                              ? "Rất dễ đọc"
                              : readabilityScore >= 60
                                ? "Khá dễ đọc"
                                : "Khó đọc, nên cải thiện"}
                          </p>
                        </Card>

                        {/* Content Stats */}
                        <Card className="p-4 border-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                          <div className="flex items-center mb-3 space-x-2">
                            <BarChart className="w-4 h-4 text-purple-600" />
                            <span className="font-medium">
                              Thống kê nội dung
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Từ:</span>
                              <span className="font-medium">
                                {contentStats.words}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Câu:
                              </span>
                              <span className="font-medium">
                                {contentStats.sentences}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Đoạn:
                              </span>
                              <span className="font-medium">
                                {contentStats.paragraphs}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Heading:
                              </span>
                              <span className="font-medium">
                                {contentStats.headings}
                              </span>
                            </div>
                          </div>
                          <div className="pt-2 mt-2 border-t">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                Thời gian đọc:
                              </span>
                              <span className="font-medium">
                                {contentStats.readingTime} phút
                              </span>
                            </div>
                          </div>
                        </Card>
                      </div>

                      {/* ✅ SEO Suggestions */}
                      {seoSuggestions.length > 0 && (
                        <Card className="p-4 border-0 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
                          <div className="flex items-center mb-3 space-x-2">
                            <Lightbulb className="w-4 h-4 text-yellow-600" />
                            <span className="font-medium">
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
                                className="flex items-start p-3 space-x-2 transition-colors rounded-lg bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800"
                              >
                                <Target className="w-3 h-3 text-yellow-600 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{suggestion}</span>
                              </motion.div>
                            ))}
                          </div>
                        </Card>
                      )}

                      {/* ✅ Keyword Density */}
                      {Object.keys(keywordDensity).length > 0 && (
                        <Card className="p-4 border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                          <div className="flex items-center mb-3 space-x-2">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                            <span className="font-medium">Mật độ từ khóa</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {Object.entries(keywordDensity).map(
                              ([word, density]) => (
                                <div
                                  key={word}
                                  className="flex items-center justify-between p-2 rounded bg-white/50 dark:bg-slate-800/50"
                                >
                                  <span className="text-sm font-medium">
                                    {word}
                                  </span>
                                  <Badge
                                    variant="outline"
                                    className={`text-xs ${
                                      density > 3
                                        ? "border-red-500 text-red-600"
                                        : density > 1
                                          ? "border-green-500 text-green-600"
                                          : "border-gray-500 text-gray-600"
                                    }`}
                                  >
                                    {density}%
                                  </Badge>
                                </div>
                              ),
                            )}
                          </div>
                          <p className="mt-2 text-xs text-muted-foreground">
                            💡 Mật độ từ khóa lý tưởng: 1-3%. Tránh spam từ
                            khóa.
                          </p>
                        </Card>
                      )}

                      {/* ✅ SEO Tools Links */}
                      <Card className="p-4 border-0 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20">
                        <div className="flex items-center mb-3 space-x-2">
                          <Cpu className="w-4 h-4 text-indigo-600" />
                          <span className="font-medium">
                            Công cụ SEO khuyên dùng
                          </span>
                        </div>
                        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                          <a
                            href="https://aiktp.com/vi"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-3 space-x-2 transition-colors rounded-lg bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 group"
                          >
                            <Zap className="w-4 h-4 text-blue-600 transition-transform group-hover:scale-110" />
                            <span className="text-sm">
                              AIKTP - AI viết content
                            </span>
                          </a>
                          <a
                            href="https://laho.vn"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-3 space-x-2 transition-colors rounded-lg bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 group"
                          >
                            <Brain className="w-4 h-4 text-green-600 transition-transform group-hover:scale-110" />
                            <span className="text-sm">
                              Laho.vn - SEO Việt Nam
                            </span>
                          </a>
                          <a
                            href="https://grammarly.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-3 space-x-2 transition-colors rounded-lg bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 group"
                          >
                            <PenTool className="w-4 h-4 text-purple-600 transition-transform group-hover:scale-110" />
                            <span className="text-sm">
                              Grammarly - Kiểm tra ngữ pháp
                            </span>
                          </a>
                          <a
                            href="https://smallseotools.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-3 space-x-2 transition-colors rounded-lg bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 group"
                          >
                            <Search className="w-4 h-4 text-orange-600 transition-transform group-hover:scale-110" />
                            <span className="text-sm">Small SEO Tools</span>
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
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50 dark:from-slate-800 dark:to-purple-900">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
                          <Image className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <span className="text-xl text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text">
                            Quản lý hình ảnh
                          </span>
                          <p className="mt-1 text-sm text-muted-foreground">
                            Upload và quản lý hình ảnh cho bài viết
                          </p>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Featured Image */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Hình ảnh đại diện
                        </Label>
                        <Input
                          placeholder="URL hình ảnh đại diện"
                          {...register("featuredImage")}
                        />
                      </div>

                      {/* Image Upload */}
                      <div className="space-y-4">
                        <Label className="text-sm font-medium">
                          Upload hình ảnh
                        </Label>
                        <div className="p-8 text-center border-2 border-gray-300 border-dashed rounded-lg dark:border-gray-600">
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
                              <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                            ) : (
                              <Upload className="w-8 h-8 text-purple-500" />
                            )}
                            <span className="text-sm font-medium">
                              {isUploading
                                ? "Đang upload..."
                                : "Click để upload hình ảnh"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              PNG, JPG, GIF up to 10MB
                            </span>
                          </label>
                        </div>
                      </div>

                      {/* Uploaded Images */}
                      {uploadedImages.length > 0 && (
                        <div className="space-y-4">
                          <Label className="text-sm font-medium">
                            Hình ảnh đã upload ({uploadedImages.length})
                          </Label>
                          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                            {uploadedImages.map((image, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={image}
                                  alt={`Upload ${index + 1}`}
                                  className="object-cover w-full h-24 rounded-lg"
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
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-green-50 dark:from-slate-800 dark:to-green-900">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500">
                          <Globe className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <span className="text-xl text-transparent bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text">
                            SEO Meta Tags
                          </span>
                          <p className="mt-1 text-sm text-muted-foreground">
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
                          className="text-sm font-medium"
                        >
                          Meta Title
                        </Label>
                        <Input
                          id="metaTitle"
                          placeholder="Tiêu đề SEO (khuyến nghị 50-60 ký tự)"
                          {...register("metaTitle")}
                        />
                        {watchedValues.metaTitle && (
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
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
                          className="text-sm font-medium"
                        >
                          Meta Description
                        </Label>
                        <Textarea
                          id="metaDescription"
                          placeholder="Mô tả SEO (khuyến nghị 120-160 ký tự)"
                          {...register("metaDescription")}
                          className="min-h-[80px]"
                        />
                        {watchedValues.metaDescription && (
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
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
                          className="text-sm font-medium"
                        >
                          Meta Keywords
                        </Label>
                        <Input
                          id="metaKeywords"
                          placeholder="từ khóa 1, từ khóa 2, từ khóa 3"
                          {...register("metaKeywords")}
                        />
                        <p className="text-xs text-muted-foreground">
                          Phân cách bằng dấu phẩy. Khuyến nghị 3-5 từ khóa
                          chính.
                        </p>
                      </div>

                      {/* SEO Preview */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Preview Google Search
                        </Label>
                        <div className="p-4 bg-white border rounded-lg dark:bg-slate-800">
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
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Xuất bản</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Status */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Trạng thái</Label>
                  <Select
                    value={watchedValues.status}
                    onValueChange={(value) =>
                      setValue("status", value as "draft" | "published")
                    }
                  >
                    <SelectTrigger>
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
                  <Label className="text-sm font-medium">Danh mục</Label>
                  <Select
                    value={watchedValues.category}
                    onValueChange={(value) => setValue("category", value)}
                  >
                    <SelectTrigger>
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
                  <Label className="text-sm font-medium">Tags</Label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Nhập tag"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addTag())
                      }
                    />
                    <Button type="button" size="sm" onClick={addTag}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {selectedTags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedTags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="group">
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
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart className="w-5 h-5" />
                  <span>Thống kê nhanh</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 text-center rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <div className="text-2xl font-bold text-blue-600">
                      {contentStats.words}
                    </div>
                    <div className="text-xs text-muted-foreground">Từ</div>
                  </div>
                  <div className="p-3 text-center rounded-lg bg-green-50 dark:bg-green-900/20">
                    <div className="text-2xl font-bold text-green-600">
                      {contentStats.readingTime}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Phút đọc
                    </div>
                  </div>
                  <div className="p-3 text-center rounded-lg bg-purple-50 dark:bg-purple-900/20">
                    <div className="text-2xl font-bold text-purple-600">
                      {readabilityScore}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Điểm SEO
                    </div>
                  </div>
                  <div className="p-3 text-center rounded-lg bg-orange-50 dark:bg-orange-900/20">
                    <div className="text-2xl font-bold text-orange-600">
                      {seoSuggestions.length}
                    </div>
                    <div className="text-xs text-muted-foreground">Gợi ý</div>
                  </div>
                </div>

                {/* SEO Score */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">SEO Score</span>
                    <Badge
                      className={`${
                        readabilityScore >= 80
                          ? "bg-green-100 text-green-800"
                          : readabilityScore >= 60
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {readabilityScore >= 80
                        ? "Tuyệt vời"
                        : readabilityScore >= 60
                          ? "Tốt"
                          : "Cần cải thiện"}
                    </Badge>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        readabilityScore >= 80
                          ? "bg-green-500"
                          : readabilityScore >= 60
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                      style={{ width: `${readabilityScore}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Author Info */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Tác giả</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">Admin User</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date().toLocaleDateString("vi-VN")}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Thao tác nhanh
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start w-full"
                  onClick={() => {
                    const content = watchedValues.content || "";
                    navigator.clipboard.writeText(content);
                    toast({
                      title: "📋 Đã copy",
                      description: "Nội dung đã được copy vào clipboard.",
                    });
                  }}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Copy nội dung
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start w-full"
                  onClick={() => {
                    const wordCount = (
                      watchedValues.content?.match(/\b\w+\b/g) || []
                    ).length;
                    toast({
                      title: "📊 Thống kê",
                      description: `Bài viết có ${wordCount} từ, ${contentStats.readingTime} phút đọc.`,
                    });
                  }}
                >
                  <BarChart className="w-4 h-4 mr-2" />
                  Xem thống kê
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start w-full"
                  onClick={() => setActiveTab("seo-tools")}
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  Mở SEO Tools
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
              className="rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
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
              className="rounded-full shadow-lg"
              onClick={() => {
                // Preview functionality
                toast({
                  title: "👁️ Xem trước",
                  description: "Tính năng xem trước đang được phát triển.",
                });
              }}
            >
              <Eye className="w-5 h-5" />
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
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            >
              <Card className="p-6">
                <CardContent className="flex items-center space-x-4">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <div>
                    <div className="font-medium">
                      {isEditing
                        ? "Đang cập nhật bài viết..."
                        : "Đang tạo bài viết..."}
                    </div>
                    <div className="text-sm text-muted-foreground">
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
