import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/lib/supabase";
import { getAllPublishedPosts, getAllCategories } from "@/lib/blog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Calendar,
  Clock,
  Eye,
  Heart,
  User,
  BookOpen,
  TrendingUp,
  Filter,
  Grid,
  List,
  ArrowRight,
  Sparkles,
  Star,
  MessageCircle,
  Share2,
  Bookmark,
  Tag,
  ChevronRight,
  Coffee,
  Code,
  Palette,
  Zap,
  Award,
  Globe,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  CalendarDays,
  Timer,
  Users,
  PenTool,
  FileText,
  Hash,
  Quote,
  Play,
  Headphones,
  Camera,
  Video,
  Mic,
  Image as ImageIcon,
  Navigation,
  ExternalLink,
  Rss,
  Download,
  Lightbulb,
  Target,
  Flame,
  Trophy,
  ThumbsUp,
  Compass,
  Settings,
  RefreshCw,
  Layers,
  Shield,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  MapPin,
  Printer,
  Mail,
  Phone,
  Copy,
  Edit,
  Trash2,
  Save,
  Plus,
  Minus,
  X,
  Check,
  AlertCircle,
  Info,
  HelpCircle,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Enhanced interfaces
interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  featuredImage: string;
  publishedAt: string;
  updatedAt?: string;
  readTime: number;
  views: number;
  likes: number;
  shares: number;
  comments: number;
  tags: string[];
  isFeatured: boolean;
  isSponsored?: boolean;
  difficultyLevel?: "beginner" | "intermediate" | "advanced";
  category: {
    id: string;
    name: string;
    color: string;
    slug: string;
    description?: string;
  };
  author: {
    id: string;
    name: string;
    avatar?: string;
    bio?: string;
    socialLinks?: {
      twitter?: string;
      linkedin?: string;
      github?: string;
    };
    verified?: boolean;
  };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    canonicalUrl?: string;
  };
}

interface Category {
  id: string;
  name: string;
  color: string;
  slug: string;
  count?: number;
  description?: string;
  icon?: string;
}

interface Author {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  postsCount?: number;
  verified?: boolean;
}

// ✅ EXACT HOME PAGE COLOR SCHEME - Đồng bộ hoàn toàn
const sectionBackgrounds = {
  // Hero Section - Trắng với chút pink nhạt
  hero: "from-white via-pink-25 to-rose-25",

  // Stats Section - Pink gradient nhẹ
  stats: "from-pink-25 via-rose-25 to-red-25",

  // Categories Section - Rose gradient nhẹ
  categories: "from-rose-25 via-pink-25 to-white",

  // Features Section - Gradient ngược
  features: "from-red-25 via-rose-25 to-pink-25",

  // Process Section - Pink nhạt hơn
  process: "from-pink-50 via-rose-50 to-red-50",

  // Products Section - Rose nhạt
  products: "from-rose-50 via-pink-50 to-white",

  // Testimonials Section - Red nhạt
  testimonials: "from-red-50 via-rose-50 to-pink-50",

  // Newsletter Section - Pink đậm nhất để nổi bật
  newsletter: "from-pink-75 via-rose-75 to-red-75",
};

// ✅ EXACT HOME PAGE UNIFIED COLOR SCHEME
const unifiedColorScheme = {
  // Buttons - Nhạt hơn header
  button: "from-pink-300 via-rose-300 to-red-300",
  buttonHover: "from-pink-400 via-rose-400 to-red-400",
  // Text gradients - Soft pink
  textMain: "from-pink-400 via-rose-400 to-red-400",
  textSecondary: "from-pink-500 via-rose-500 to-red-500",
  // Icons - Very light pink
  iconBg: "from-pink-25 to-rose-50",
  iconText: "text-pink-400",
  // Cards with subtle backgrounds
  cardBg: "from-white/95 via-pink-50/80 to-rose-50/85",
};

// Reading Progress Component
const ReadingProgress: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progressValue = Math.min((scrollTop / docHeight) * 100, 100);
      setProgress(progressValue);
    };

    window.addEventListener("scroll", updateProgress);
    updateProgress();
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <motion.div
      className={`fixed top-0 left-0 z-50 h-1 bg-gradient-to-r ${unifiedColorScheme.button} shadow-lg`}
      style={{ width: `${progress}%` }}
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{ duration: 0.1 }}
    />
  );
};

// Scroll to Top Component
const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className={`fixed z-50 p-3 text-white transition-all duration-300 rounded-full shadow-lg bottom-8 right-8 bg-gradient-to-r ${unifiedColorScheme.button} hover:${unifiedColorScheme.buttonHover} hover:shadow-xl`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowUp className="w-6 h-6" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

// LazyImage Component
const LazyImage: React.FC<{ src: string; alt: string; className?: string }> = ({
  src,
  alt,
  className,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className={`relative ${className || ""}`}>
      {isInView && (
        <>
          {!isLoaded && (
            <div
              className={`absolute inset-0 rounded bg-gradient-to-r ${unifiedColorScheme.iconBg} animate-pulse`}
            />
          )}
          <img
            src={src}
            alt={alt}
            onLoad={() => setIsLoaded(true)}
            className={`transition-opacity duration-500 ${
              isLoaded ? "opacity-100" : "opacity-0"
            } ${className || ""}`}
          />
        </>
      )}
    </div>
  );
};

// Newsletter Component
const NewsletterSubscribe: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSubscribed(true);
      setEmail("");
      toast({
        title: "🎉 Đăng ký thành công!",
        description: "Bạn sẽ nhận được email xác nhận trong giây lát.",
      });
    } catch (error) {
      toast({
        title: "❌ Lỗi đăng ký",
        description: "Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubscribed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-8"
      >
        <Check className="w-16 h-16 mx-auto mb-4 text-green-500" />
        <h3 className="text-xl font-bold mb-2">Cảm ơn bạn!</h3>
        <p className="text-white/80">
          Bạn đã đăng ký nhận newsletter thành công.
        </p>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
    >
      <Input
        type="email"
        placeholder="Email của bạn"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 bg-white/20 border-white/30 text-white placeholder:text-white/70 h-12"
        required
      />
      <Button
        type="submit"
        disabled={isSubmitting}
        size="lg"
        className={`bg-white text-pink-600 hover:bg-gray-100 px-8`}
      >
        {isSubmitting ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 mr-2 border-2 border-pink-600 border-t-transparent rounded-full"
            />
            Đang xử lý...
          </>
        ) : (
          <>
            <Mail className="w-4 h-4 mr-2" />
            Đăng ký ngay
          </>
        )}
      </Button>
    </form>
  );
};

// Main Blog Component
const Blog: React.FC = () => {
  // States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(12);
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<string>>(
    new Set(),
  );
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState("all");

  // Load data
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [postsData, categoriesData] = await Promise.all([
          getAllPublishedPosts(),
          getAllCategories(),
        ]);

        // Transform data to ensure all required properties exist
        const transformedPosts: BlogPost[] = (postsData || []).map(
          (post: any) => ({
            id: post.id || Math.random().toString(),
            title: post.title || "Untitled",
            excerpt: post.excerpt || "",
            content: post.content || "",
            slug: post.slug || "untitled",
            featuredImage: post.featuredImage || "/images/default-post.jpg",
            publishedAt: post.publishedAt || new Date().toISOString(),
            updatedAt:
              post.updatedAt || post.publishedAt || new Date().toISOString(),
            readTime: typeof post.readTime === "number" ? post.readTime : 5,
            views: typeof post.views === "number" ? post.views : 0,
            likes: typeof post.likes === "number" ? post.likes : 0,
            shares: typeof post.shares === "number" ? post.shares : 0,
            comments: typeof post.comments === "number" ? post.comments : 0,
            tags: Array.isArray(post.tags) ? post.tags : [],
            isFeatured: Boolean(post.isFeatured),
            isSponsored: Boolean(post.isSponsored),
            difficultyLevel: ["beginner", "intermediate", "advanced"].includes(
              post.difficultyLevel,
            )
              ? post.difficultyLevel
              : undefined,
            category: {
              id: post.category?.id || "default",
              name: post.category?.name || "Uncategorized",
              color: post.category?.color || "blue",
              slug: post.category?.slug || "uncategorized",
              description: post.category?.description || "",
            },
            author: {
              id: post.author?.id || "anonymous",
              name: post.author?.name || "Anonymous",
              avatar: post.author?.avatar || "/images/default-avatar.png",
              bio: post.author?.bio || "",
              verified: Boolean(post.author?.verified),
            },
          }),
        );

        setPosts(transformedPosts);
        setCategories(categoriesData || []);
      } catch (error) {
        console.error("Error loading blog data:", error);
        toast({
          title: "❌ Lỗi tải dữ liệu",
          description: "Không thể tải bài viết. Vui lòng thử lại.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    load();

    // Intersection Observer for animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.id) {
            setIsVisible((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }));
          }
        });
      },
      { threshold: 0.1 },
    );

    const timeout = setTimeout(() => {
      const sections = document.querySelectorAll("[data-animate]");
      sections.forEach((section) => observer.observe(section));
    }, 100);

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, []);

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    let filtered = [...posts];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.tags.some((tag: string) => tag.toLowerCase().includes(query)) ||
          post.author.name.toLowerCase().includes(query),
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (post) => post.category?.id === selectedCategory,
      );
    }

    // Apply tab filter
    if (activeTab === "featured") {
      filtered = filtered.filter((post) => post.isFeatured);
    } else if (activeTab === "trending") {
      filtered = filtered
        .sort(
          (a, b) =>
            b.views + b.likes + b.shares - (a.views + a.likes + a.shares),
        )
        .slice(0, 10);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.publishedAt).getTime() -
            new Date(b.publishedAt).getTime()
          );
        case "popular":
          return b.views - a.views;
        case "liked":
          return b.likes - a.likes;
        case "trending":
          return b.views + b.likes + b.shares - (a.views + a.likes + a.shares);
        default:
          return 0;
      }
    });

    return filtered;
  }, [posts, searchQuery, selectedCategory, sortBy, activeTab]);

  // Pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  // Derived data
  const featuredPosts = posts.filter((post) => post.isFeatured);
  const trendingPosts = posts
    .sort(
      (a, b) => b.views + b.likes + b.shares - (a.views + a.likes + a.shares),
    )
    .slice(0, 6);

  // Enhanced stats with better design
  const stats = useMemo(
    () => [
      {
        label: "Tổng bài viết",
        value: posts.length,
        icon: BookOpen,
        color: unifiedColorScheme.iconBg,
        change: "+12%",
      },
      {
        label: "Lượt xem tháng này",
        value: posts.reduce((sum, post) => sum + (post.views || 0), 0),
        icon: Eye,
        color: unifiedColorScheme.iconBg,
        change: "+25%",
      },
      {
        label: "Lượt thích",
        value: posts.reduce((sum, post) => sum + (post.likes || 0), 0),
        icon: Heart,
        color: unifiedColorScheme.iconBg,
        change: "+18%",
      },
      {
        label: "Danh mục",
        value: categories.length,
        icon: Tag,
        color: unifiedColorScheme.iconBg,
        change: "+3",
      },
    ],
    [posts, categories],
  );

  // Helper functions
  const getCategoryColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: "#3b82f6",
      purple: "#8b5cf6",
      green: "#10b981",
      orange: "#f59e0b",
      red: "#ef4444",
      pink: "#ec4899",
      cyan: "#06b6d4",
      yellow: "#eab308",
      indigo: "#6366f1",
      teal: "#14b8a6",
    };
    return colors[color] || colors.pink; // Default to pink
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const getDifficultyBadge = (level?: string) => {
    switch (level) {
      case "beginner":
        return { label: "Cơ bản", color: "bg-green-100 text-green-800" };
      case "intermediate":
        return { label: "Trung cấp", color: "bg-yellow-100 text-yellow-800" };
      case "advanced":
        return { label: "Nâng cao", color: "bg-red-100 text-red-800" };
      default:
        return null;
    }
  };

  // Event handlers
  const handleBookmark = (postId: string) => {
    setBookmarkedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
        toast({ title: "🔖 Đã bỏ lưu bài viết" });
      } else {
        newSet.add(postId);
        toast({ title: "📌 Đã lưu bài viết" });
      }
      return newSet;
    });
  };

  const handleLike = (postId: string) => {
    setLikedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
        toast({ title: "💔 Đã bỏ thích" });
      } else {
        newSet.add(postId);
        toast({ title: "❤️ Đã thích bài viết" });
      }
      return newSet;
    });
  };

  const handleShare = async (post: BlogPost) => {
    const url = `${window.location.origin}/blog/${post.slug}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: url,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        toast({
          title: "📋 Đã sao chép link",
          description: "Link bài viết đã được sao chép vào clipboard.",
        });
      } catch (error) {
        console.log("Copy to clipboard failed:", error);
      }
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSortBy("newest");
    setActiveTab("all");
    setCurrentPage(1);
  };

  // Loading state
  if (loading) {
    return (
      <>
        <Helmet>
          <title>Đang tải... | Template Market Blog</title>
        </Helmet>
        <div
          className={`min-h-screen bg-gradient-to-br ${sectionBackgrounds.hero}`}
        >
          <div className="container px-4 py-20 mx-auto">
            <div className="space-y-4 text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className={`w-12 h-12 mx-auto border-4 rounded-full border-pink-400 border-t-transparent`}
              />
              <p className="text-slate-600">Đang tải nội dung blog...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* ✅ EXACT HOME PAGE FLOATING BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {[
          {
            emoji: "📝",
            color: "from-pink-50 to-rose-100",
            position: "top-10 right-20",
          },
          {
            emoji: "📚",
            color: "from-rose-50 to-red-100",
            position: "top-32 left-10",
          },
          {
            emoji: "✍️",
            color: "from-red-50 to-pink-100",
            position: "bottom-20 right-10",
          },
          {
            emoji: "💡",
            color: "from-pink-100 to-rose-50",
            position: "bottom-32 left-20",
          },
          {
            emoji: "🔥",
            color: "from-rose-100 to-pink-50",
            position: "top-1/2 right-1/4",
          },
          {
            emoji: "⭐",
            color: "from-red-50 to-rose-100",
            position: "top-1/3 left-1/3",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            className={`absolute ${item.position} text-4xl opacity-5`}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 15, -15, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 10 + i * 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          >
            <motion.div
              className={`p-4 rounded-full bg-gradient-to-r ${item.color} backdrop-blur-sm shadow-lg`}
              whileHover={{ scale: 1.5, rotate: 30 }}
            >
              <span>{item.emoji}</span>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* SEO Meta Tags */}
      <Helmet>
        <title>
          Blog & Tutorials | Template Market - Kiến thức công nghệ hàng đầu
        </title>
        <meta
          name="description"
          content="Khám phá những bài viết chất lượng về công nghệ, thiết kế và phát triển web. Hơn 500+ tutorial miễn phí từ các chuyên gia hàng đầu."
        />
        <meta
          name="keywords"
          content="blog công nghệ, tutorial web development, thiết kế UI/UX, React tutorials, Next.js, JavaScript"
        />
        <meta
          property="og:title"
          content="Blog Template Market - Kiến thức công nghệ hàng đầu"
        />
        <meta
          property="og:description"
          content="Khám phá những bài viết chất lượng về công nghệ, thiết kế và phát triển web từ Template Market"
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/images/blog-og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://templatemarket.com/blog" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Template Market Blog RSS"
          href="/blog/rss.xml"
        />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "Template Market Blog",
            description: "Blog về công nghệ, thiết kế và phát triển web",
            url: "https://templatemarket.com/blog",
            publisher: {
              "@type": "Organization",
              name: "Template Market",
              logo: {
                "@type": "ImageObject",
                url: "https://templatemarket.com/logo.png",
              },
            },
          })}
        </script>
      </Helmet>

      <main className="relative z-10">
        <ReadingProgress />
        <ScrollToTop />

        {/* ✅ HERO SECTION - EXACT HOME PAGE STYLE */}
        <section
          className={`relative px-4 py-8 sm:py-16 lg:py-16 bg-gradient-to-br ${sectionBackgrounds.hero} overflow-hidden min-h-screen flex items-center`}
          id="hero"
          data-animate
          style={{
            backgroundImage: `radial-gradient(circle at 20% 80%, rgba(236, 72, 153, 0.03) 0%, transparent 50%),
                             radial-gradient(circle at 80% 20%, rgba(244, 63, 94, 0.03) 0%, transparent 50%),
                             radial-gradient(circle at 40% 40%, rgba(220, 38, 127, 0.02) 0%, transparent 50%)`,
          }}
          itemScope
          itemType="https://schema.org/WebPageElement"
        >
          {/* Dynamic Background */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute rounded-full mix-blend-multiply filter blur-xl opacity-20 ${
                  i % 4 === 0
                    ? "bg-pink-400"
                    : i % 4 === 1
                      ? "bg-rose-400"
                      : i % 4 === 2
                        ? "bg-red-400"
                        : "bg-pink-300"
                }`}
                style={{
                  width: `${Math.random() * 300 + 200}px`,
                  height: `${Math.random() * 300 + 200}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
                animate={{
                  x: [0, Math.random() * 100 - 50],
                  y: [0, Math.random() * 100 - 50],
                  scale: [1, Math.random() * 0.5 + 0.8, 1],
                }}
                transition={{
                  duration: Math.random() * 20 + 15,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 2,
                }}
              />
            ))}
          </div>

          {/* Floating Tech Icons */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[BookOpen, Code, Coffee, Lightbulb, Target, Zap, Award, Globe].map(
              (Icon, i) => (
                <motion.div
                  key={i}
                  className="absolute text-pink-500/30"
                  style={{
                    top: `${15 + i * 10}%`,
                    left: `${10 + i * 11}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    rotate: [0, 180, 360],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 6 + i,
                    repeat: Infinity,
                    delay: i * 0.8,
                  }}
                >
                  <Icon className="w-6 h-6" />
                </motion.div>
              ),
            )}
          </div>

          <div className="container relative z-10 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-5xl mx-auto space-y-8 text-center"
            >
              {/* Hero Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <Badge
                  className={`px-6 py-3 text-lg font-semibold border-0 shadow-xl bg-gradient-to-r ${unifiedColorScheme.button} text-white`}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Blog & Knowledge Hub
                  <Sparkles className="w-4 h-4 ml-2 animate-pulse" />
                </Badge>
              </motion.div>

              {/* Main Title */}
              <motion.h1
                className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                itemProp="headline"
              >
                <span
                  className={`text-transparent bg-gradient-to-r ${unifiedColorScheme.textMain} bg-clip-text`}
                >
                  Kiến thức & Cảm hứng
                </span>
                <br />
                <span
                  className={`text-transparent bg-gradient-to-r ${unifiedColorScheme.textSecondary} bg-clip-text`}
                >
                  cho Developers
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                className="max-w-4xl mx-auto text-xl md:text-2xl lg:text-3xl text-slate-600 leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                itemProp="description"
              >
                Khám phá những bài viết chất lượng về{" "}
                <span className="font-bold text-pink-600">công nghệ</span>,{" "}
                <span className="font-bold text-rose-600">thiết kế</span> và xu
                hướng mới nhất trong ngành
                <br />
                <span className="text-lg text-slate-500">
                  Được tin tưởng bởi 50K+ developers • Cập nhật hàng tuần • Hoàn
                  toàn miễn phí
                </span>
              </motion.p>

              {/* Enhanced Stats Grid */}
              <motion.div
                className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                {stats.map(
                  ({ icon: StatIcon, color, value, label, change }, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.08, y: -6 }}
                      className="group cursor-pointer"
                    >
                      <div
                        className={`relative flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-tr ${unifiedColorScheme.cardBg} backdrop-blur-lg rounded-3xl transition-all duration-500 overflow-hidden relative shadow-xl group-hover:shadow-2xl border border-white/20`}
                      >
                        <div
                          className={`mb-4 w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br ${color} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                        >
                          <StatIcon className="w-8 h-8 text-pink-500" />
                        </div>

                        <div
                          className={`text-3xl lg:text-4xl font-extrabold tracking-tight text-transparent bg-gradient-to-r ${unifiedColorScheme.textSecondary} bg-clip-text select-none mb-2`}
                        >
                          {formatNumber(value)}
                        </div>
                        <div className="text-lg font-bold text-slate-800 mb-1">
                          {label}
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          <TrendingUp className="w-3 h-3 text-green-500" />
                          <span className="text-green-600 font-medium">
                            {change}
                          </span>
                        </div>
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-gradient-to-tr from-pink-400/10 via-rose-300/10 to-red-500/10 blur-xl rounded-full opacity-60"></div>
                      </div>
                    </motion.div>
                  ),
                )}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
              >
                <Button
                  size="lg"
                  className={`px-8 py-4 text-lg font-semibold bg-gradient-to-r ${unifiedColorScheme.button} hover:${unifiedColorScheme.buttonHover} shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-white`}
                  onClick={() =>
                    document
                      .getElementById("featured")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  <Star className="w-5 h-5 mr-3" />
                  Xem bài viết nổi bật
                  <ArrowRight className="w-5 h-5 ml-3" />
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-4 text-lg font-semibold border-2 border-pink-200 text-pink-700 hover:bg-pink-50"
                  onClick={() =>
                    document
                      .getElementById("trending")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  <Flame className="w-5 h-5 mr-3" />
                  Bài viết trending
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <div className="container px-4 pb-16 mx-auto">
          {/* Enhanced Featured Posts */}
          {featuredPosts.length > 0 && (
            <section
              className={`mb-20 relative py-14 sm:py-16 lg:py-20 bg-gradient-to-br ${sectionBackgrounds.stats} -mx-4`}
              id="featured"
              data-animate
              style={{
                backgroundImage: `radial-gradient(circle at 20% 80%, rgba(244, 63, 94, 0.05) 0%, transparent 50%),
                               radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.05) 0%, transparent 50%),
                               radial-gradient(circle at 40% 40%, rgba(220, 38, 127, 0.03) 0%, transparent 50%)`,
              }}
            >
              <div className="container mx-auto px-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-center justify-between mb-12 transition-all duration-800 ${
                    isVisible.featured
                      ? "animate-in slide-in-from-bottom"
                      : "opacity-0"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r ${unifiedColorScheme.button} shadow-lg`}
                    >
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2
                        className={`text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r ${unifiedColorScheme.textSecondary} bg-clip-text`}
                      >
                        ⭐ Bài viết nổi bật
                      </h2>
                      <p className="text-slate-600 mt-1">
                        Những bài viết được yêu thích và đọc nhiều nhất
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-pink-100 text-pink-800 px-4 py-2">
                    <Trophy className="w-4 h-4 mr-2" />
                    {featuredPosts.length} bài viết
                  </Badge>
                </motion.div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {featuredPosts.map((post, index) => (
                    <motion.article
                      key={post.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -10, scale: 1.02 }}
                      className="group"
                      itemScope
                      itemType="https://schema.org/BlogPosting"
                    >
                      <Card
                        className={`h-full overflow-hidden transition-all duration-500 border-0 hover:shadow-2xl bg-gradient-to-br ${unifiedColorScheme.cardBg} backdrop-blur-lg rounded-3xl`}
                      >
                        <div className="relative overflow-hidden">
                          <LazyImage
                            src={post.featuredImage}
                            alt={post.title}
                            className="object-cover w-full h-56 transition-transform duration-500 group-hover:scale-110"
                          />

                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                          {/* Top badges */}
                          <div className="absolute top-4 left-4 flex gap-2">
                            <Badge
                              style={{
                                backgroundColor: getCategoryColor(
                                  post.category.color,
                                ),
                                color: "white",
                              }}
                              className="shadow-lg"
                            >
                              {post.category.name}
                            </Badge>
                            {post.isSponsored && (
                              <Badge className="bg-yellow-500 text-white shadow-lg">
                                <Star className="w-3 h-3 mr-1" />
                                Sponsor
                              </Badge>
                            )}
                          </div>

                          <div className="absolute top-4 right-4">
                            <Badge
                              className={`text-white shadow-lg bg-gradient-to-r ${unifiedColorScheme.button}`}
                            >
                              <Star className="w-3 h-3 mr-1" />
                              Nổi bật
                            </Badge>
                          </div>

                          {/* Hover Action Buttons */}
                          <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                            <div className="flex space-x-3">
                              <Button
                                size="sm"
                                className="bg-white/90 text-gray-900 hover:bg-white backdrop-blur-sm"
                                asChild
                              >
                                <Link to={`/blog/${post.slug}`}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  Đọc bài
                                </Link>
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                className="bg-white/90 backdrop-blur-sm"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleBookmark(post.id);
                                }}
                              >
                                <Bookmark
                                  className={`w-4 h-4 ${bookmarkedPosts.has(post.id) ? "fill-current" : ""}`}
                                />
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                className="bg-white/90 backdrop-blur-sm"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleShare(post);
                                }}
                              >
                                <Share2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        <CardContent className="p-6 space-y-4">
                          <div className="space-y-3">
                            <h3
                              className="text-xl font-bold transition-colors line-clamp-2 group-hover:text-pink-600"
                              itemProp="headline"
                            >
                              <Link
                                to={`/blog/${post.slug}`}
                                className="hover:underline"
                              >
                                {post.title}
                              </Link>
                            </h3>

                            <p
                              className="leading-relaxed text-slate-700 line-clamp-3"
                              itemProp="description"
                            >
                              {post.excerpt}
                            </p>
                          </div>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-2">
                            {post.tags.slice(0, 3).map((tag, tagIndex) => (
                              <Badge
                                key={tagIndex}
                                variant="outline"
                                className="text-xs hover:bg-pink-50 cursor-pointer border-pink-200"
                              >
                                <Hash className="w-3 h-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                            {post.tags.length > 3 && (
                              <Badge
                                variant="outline"
                                className="text-xs border-pink-200"
                              >
                                +{post.tags.length - 3} more
                              </Badge>
                            )}
                          </div>

                          {/* Difficulty Level */}
                          {post.difficultyLevel && (
                            <div className="flex items-center gap-2">
                              <Target className="w-4 h-4 text-slate-500" />
                              <Badge
                                className={
                                  getDifficultyBadge(post.difficultyLevel)
                                    ?.color
                                }
                              >
                                {
                                  getDifficultyBadge(post.difficultyLevel)
                                    ?.label
                                }
                              </Badge>
                            </div>
                          )}

                          {/* Meta Information */}
                          <div className="flex items-center justify-between text-sm text-slate-600 pt-4 border-t border-pink-100">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <time
                                  dateTime={post.publishedAt}
                                  itemProp="datePublished"
                                >
                                  {new Date(
                                    post.publishedAt,
                                  ).toLocaleDateString("vi-VN")}
                                </time>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span>{post.readTime} phút đọc</span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-3">
                              <div className="flex items-center space-x-1">
                                <Eye className="w-4 h-4" />
                                <span>{formatNumber(post.views)}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Heart className="w-4 h-4" />
                                <span>{formatNumber(post.likes)}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MessageCircle className="w-4 h-4" />
                                <span>{formatNumber(post.comments)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Author */}
                          <div
                            className="flex items-center pt-4 space-x-3"
                            itemProp="author"
                            itemScope
                            itemType="https://schema.org/Person"
                          >
                            <img
                              src={
                                post.author.avatar ||
                                "/images/default-avatar.png"
                              }
                              alt={post.author.name}
                              className="object-cover w-10 h-10 rounded-full ring-2 ring-pink-200"
                              itemProp="image"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium" itemProp="name">
                                  {post.author.name}
                                </span>
                                {post.author.verified && (
                                  <Badge className="px-2 py-0.5 text-xs bg-pink-100 text-pink-800">
                                    <Award className="w-3 h-3 mr-1" />
                                    Verified
                                  </Badge>
                                )}
                              </div>
                              <p
                                className="text-xs text-slate-500 line-clamp-1"
                                itemProp="description"
                              >
                                {post.author.bio}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.article>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Enhanced Filters Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-12 relative py-14 sm:py-16 lg:py-20 bg-gradient-to-br ${sectionBackgrounds.categories} -mx-4`}
            id="filters"
            data-animate
            style={{
              backgroundImage: `radial-gradient(circle at 20% 80%, rgba(220, 38, 127, 0.05) 0%, transparent 50%),
                               radial-gradient(circle at 80% 20%, rgba(244, 63, 94, 0.05) 0%, transparent 50%),
                               radial-gradient(circle at 40% 40%, rgba(236, 72, 153, 0.03) 0%, transparent 50%)`,
            }}
          >
            <div className="container mx-auto px-4">
              <Card
                className={`border-0 shadow-xl bg-gradient-to-br ${unifiedColorScheme.cardBg} backdrop-blur-lg rounded-3xl`}
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Filter className="w-6 h-6 text-pink-500" />
                      <span className="text-xl text-slate-800">
                        Tìm kiếm & Lọc nội dung
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-pink-50 text-pink-700 border-pink-200"
                    >
                      {filteredPosts.length} kết quả
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute w-5 h-5 transform -translate-y-1/2 left-4 top-1/2 text-slate-500" />
                    <Input
                      placeholder="Tìm kiếm bài viết, tác giả, tags, nội dung..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 h-12 transition-all duration-300 border-2 border-pink-100 bg-white/50 focus:ring-2 focus:ring-pink-200 text-base focus:border-pink-300"
                    />
                    {searchQuery && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute w-8 h-8 p-0 transform -translate-y-1/2 right-2 top-1/2"
                        onClick={() => setSearchQuery("")}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  {/* Tabs */}
                  <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-3 bg-pink-50">
                      <TabsTrigger
                        value="all"
                        className="data-[state=active]:bg-white data-[state=active]:text-pink-700"
                      >
                        Tất cả
                      </TabsTrigger>
                      <TabsTrigger
                        value="featured"
                        className="data-[state=active]:bg-white data-[state=active]:text-pink-700"
                      >
                        Nổi bật
                      </TabsTrigger>
                      <TabsTrigger
                        value="trending"
                        className="data-[state=active]:bg-white data-[state=active]:text-pink-700"
                      >
                        Trending
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>

                  {/* Filters Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Category Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">
                        Danh mục
                      </label>
                      <Select
                        value={selectedCategory}
                        onValueChange={setSelectedCategory}
                      >
                        <SelectTrigger className="h-11 border-pink-200 bg-white/50">
                          <SelectValue placeholder="Chọn danh mục" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">
                            <div className="flex items-center space-x-2">
                              <Globe className="w-4 h-4" />
                              <span>Tất cả danh mục</span>
                            </div>
                          </SelectItem>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              <div className="flex items-center space-x-2">
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{
                                    backgroundColor: getCategoryColor(
                                      category.color,
                                    ),
                                  }}
                                />
                                <span>{category.name}</span>
                                {category.count && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs ml-auto"
                                  >
                                    {category.count}
                                  </Badge>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Sort Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">
                        Sắp xếp theo
                      </label>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="h-11 border-pink-200 bg-white/50">
                          <SelectValue placeholder="Sắp xếp" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="newest">
                            <div className="flex items-center space-x-2">
                              <CalendarDays className="w-4 h-4" />
                              <span>Mới nhất</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="oldest">
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4" />
                              <span>Cũ nhất</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="popular">
                            <div className="flex items-center space-x-2">
                              <Eye className="w-4 h-4" />
                              <span>Phổ biến nhất</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="liked">
                            <div className="flex items-center space-x-2">
                              <Heart className="w-4 h-4" />
                              <span>Yêu thích nhất</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="trending">
                            <div className="flex items-center space-x-2">
                              <Flame className="w-4 h-4" />
                              <span>Trending</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* View Mode */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">
                        Hiển thị
                      </label>
                      <div className="flex h-11 border border-pink-200 rounded-lg overflow-hidden bg-white/50">
                        <Button
                          variant={viewMode === "grid" ? "default" : "ghost"}
                          className={`flex-1 rounded-none h-full ${
                            viewMode === "grid"
                              ? `bg-gradient-to-r ${unifiedColorScheme.button} text-white`
                              : "text-slate-600 hover:bg-pink-50"
                          }`}
                          onClick={() => setViewMode("grid")}
                        >
                          <Grid className="w-4 h-4 mr-2" />
                          Lưới
                        </Button>
                        <Button
                          variant={viewMode === "list" ? "default" : "ghost"}
                          className={`flex-1 rounded-none h-full ${
                            viewMode === "list"
                              ? `bg-gradient-to-r ${unifiedColorScheme.button} text-white`
                              : "text-slate-600 hover:bg-pink-50"
                          }`}
                          onClick={() => setViewMode("list")}
                        >
                          <List className="w-4 h-4 mr-2" />
                          Danh sách
                        </Button>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">
                        Thao tác nhanh
                      </label>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 h-11 border-pink-200 text-slate-600 hover:bg-pink-50"
                          onClick={resetFilters}
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Reset
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="px-3 h-11 border-pink-200 text-slate-600 hover:bg-pink-50"
                          onClick={() => window.open("/blog/rss.xml", "_blank")}
                        >
                          <Rss className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Active Filters */}
                  {(searchQuery ||
                    selectedCategory !== "all" ||
                    activeTab !== "all") && (
                    <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-pink-100">
                      <span className="text-sm text-slate-600">Đang lọc:</span>
                      {searchQuery && (
                        <Badge
                          variant="secondary"
                          className="text-pink-800 bg-pink-100"
                        >
                          <Search className="w-3 h-3 mr-1" />"{searchQuery}"
                          <button
                            onClick={() => setSearchQuery("")}
                            className="ml-2 hover:text-pink-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      )}
                      {selectedCategory !== "all" && (
                        <Badge
                          variant="secondary"
                          className="text-rose-800 bg-rose-100"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {
                            categories.find((c) => c.id === selectedCategory)
                              ?.name
                          }
                          <button
                            onClick={() => setSelectedCategory("all")}
                            className="ml-2 hover:text-rose-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      )}
                      {activeTab !== "all" && (
                        <Badge
                          variant="secondary"
                          className="text-red-800 bg-red-100"
                        >
                          <Filter className="w-3 h-3 mr-1" />
                          {activeTab === "featured" ? "Nổi bật" : "Trending"}
                          <button
                            onClick={() => setActiveTab("all")}
                            className="ml-2 hover:text-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </motion.section>

          {/* All Posts Section with Pagination */}
          <section
            id="all-posts"
            data-animate
            className={`relative py-14 sm:py-16 lg:py-20 bg-gradient-to-br ${sectionBackgrounds.features} -mx-4`}
            style={{
              backgroundImage: `radial-gradient(circle at 20% 80%, rgba(220, 38, 127, 0.05) 0%, transparent 50%),
                               radial-gradient(circle at 80% 20%, rgba(244, 63, 94, 0.05) 0%, transparent 50%),
                               radial-gradient(circle at 40% 40%, rgba(236, 72, 153, 0.03) 0%, transparent 50%)`,
            }}
          >
            <div className="container mx-auto px-4">
              <div
                className={`flex items-center justify-between mb-8 transition-all duration-800 ${
                  isVisible["all-posts"]
                    ? "animate-in slide-in-from-bottom"
                    : "opacity-0"
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r ${unifiedColorScheme.button} shadow-lg`}
                  >
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2
                      className={`text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r ${unifiedColorScheme.textSecondary} bg-clip-text`}
                    >
                      📚{" "}
                      {activeTab === "all"
                        ? "Tất cả bài viết"
                        : activeTab === "featured"
                          ? "Bài viết nổi bật"
                          : "Bài viết trending"}
                    </h2>
                    <p className="text-slate-600 mt-1">
                      {filteredPosts.length} bài viết được tìm thấy
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="bg-pink-50 text-pink-700 border-pink-200 px-3 py-1"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Trang {currentPage}/{totalPages}
                  </Badge>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {currentPosts.length > 0 ? (
                  <motion.div
                    key="posts-grid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={
                      viewMode === "grid"
                        ? "grid gap-8 md:grid-cols-2 lg:grid-cols-3"
                        : "space-y-6"
                    }
                  >
                    {currentPosts.map((post, index) => (
                      <motion.article
                        key={post.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ y: -5, scale: 1.01 }}
                        className="group"
                        itemScope
                        itemType="https://schema.org/BlogPosting"
                      >
                        {viewMode === "grid" ? (
                          // Grid View
                          <Card
                            className={`h-full overflow-hidden transition-all duration-300 border-0 hover:shadow-xl bg-gradient-to-br ${unifiedColorScheme.cardBg} backdrop-blur-lg rounded-2xl`}
                          >
                            <div className="relative overflow-hidden">
                              <LazyImage
                                src={post.featuredImage}
                                alt={post.title}
                                className="object-cover w-full h-48 transition-transform duration-300 group-hover:scale-105"
                              />
                              <div className="absolute top-4 left-4">
                                <Badge
                                  style={{
                                    backgroundColor: getCategoryColor(
                                      post.category.color,
                                    ),
                                    color: "white",
                                  }}
                                  className="shadow-md"
                                >
                                  {post.category.name}
                                </Badge>
                              </div>
                              {post.difficultyLevel && (
                                <div className="absolute top-4 right-4">
                                  <Badge
                                    className={
                                      getDifficultyBadge(post.difficultyLevel)
                                        ?.color
                                    }
                                  >
                                    {
                                      getDifficultyBadge(post.difficultyLevel)
                                        ?.label
                                    }
                                  </Badge>
                                </div>
                              )}
                            </div>

                            <CardContent className="p-6 space-y-4">
                              <h3
                                className="text-lg font-bold transition-colors line-clamp-2 group-hover:text-pink-600"
                                itemProp="headline"
                              >
                                <Link
                                  to={`/blog/${post.slug}`}
                                  className="hover:underline"
                                >
                                  {post.title}
                                </Link>
                              </h3>

                              <p
                                className="text-sm text-slate-600 line-clamp-3"
                                itemProp="description"
                              >
                                {post.excerpt}
                              </p>

                              <div className="flex flex-wrap gap-2">
                                {post.tags.slice(0, 3).map((tag, tagIndex) => (
                                  <Badge
                                    key={tagIndex}
                                    variant="outline"
                                    className="text-xs hover:bg-pink-50 cursor-pointer border-pink-200"
                                  >
                                    <Hash className="w-3 h-3 mr-1" />
                                    {tag}
                                  </Badge>
                                ))}
                                {post.tags.length > 3 && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs border-pink-200"
                                  >
                                    +{post.tags.length - 3}
                                  </Badge>
                                )}
                              </div>

                              <div className="flex items-center justify-between text-sm text-slate-600 pt-3 border-t border-pink-100">
                                <div className="flex items-center space-x-2">
                                  <img
                                    src={
                                      post.author.avatar ||
                                      "/images/default-avatar.png"
                                    }
                                    alt={post.author.name}
                                    className="object-cover w-6 h-6 rounded-full"
                                  />
                                  <span>{post.author.name}</span>
                                </div>

                                <div className="flex items-center space-x-3">
                                  <div className="flex items-center space-x-1">
                                    <Eye className="w-3 h-3" />
                                    <span>{formatNumber(post.views)}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Heart className="w-3 h-3" />
                                    <span>{formatNumber(post.likes)}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="text-xs text-slate-500">
                                <time
                                  dateTime={post.publishedAt}
                                  itemProp="datePublished"
                                >
                                  {new Date(
                                    post.publishedAt,
                                  ).toLocaleDateString("vi-VN")}{" "}
                                  • {post.readTime} phút đọc
                                </time>
                              </div>
                            </CardContent>
                          </Card>
                        ) : (
                          // List View
                          <Card
                            className={`transition-all duration-300 border-0 hover:shadow-lg bg-gradient-to-r ${unifiedColorScheme.cardBg} backdrop-blur-lg rounded-2xl`}
                          >
                            <CardContent className="p-6">
                              <div className="flex gap-6">
                                <div className="relative flex-shrink-0 w-48 h-32 overflow-hidden rounded-lg">
                                  <LazyImage
                                    src={post.featuredImage}
                                    alt={post.title}
                                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                  />
                                </div>

                                <div className="flex-1 space-y-3">
                                  <div className="flex items-start justify-between">
                                    <div className="space-y-2 flex-1">
                                      <div className="flex items-center gap-2">
                                        <Badge
                                          style={{
                                            backgroundColor: getCategoryColor(
                                              post.category.color,
                                            ),
                                            color: "white",
                                          }}
                                          className="text-xs"
                                        >
                                          {post.category.name}
                                        </Badge>
                                        {post.difficultyLevel && (
                                          <Badge
                                            className={
                                              getDifficultyBadge(
                                                post.difficultyLevel,
                                              )?.color
                                            }
                                          >
                                            {
                                              getDifficultyBadge(
                                                post.difficultyLevel,
                                              )?.label
                                            }
                                          </Badge>
                                        )}
                                      </div>
                                      <h3
                                        className="text-xl font-bold transition-colors line-clamp-2 group-hover:text-pink-600"
                                        itemProp="headline"
                                      >
                                        <Link
                                          to={`/blog/${post.slug}`}
                                          className="hover:underline"
                                        >
                                          {post.title}
                                        </Link>
                                      </h3>
                                    </div>
                                  </div>

                                  <p
                                    className="text-slate-600 line-clamp-2"
                                    itemProp="description"
                                  >
                                    {post.excerpt}
                                  </p>

                                  <div className="flex flex-wrap gap-2">
                                    {post.tags
                                      .slice(0, 4)
                                      .map((tag, tagIndex) => (
                                        <Badge
                                          key={tagIndex}
                                          variant="outline"
                                          className="text-xs hover:bg-pink-50 cursor-pointer border-pink-200"
                                        >
                                          <Hash className="w-3 h-3 mr-1" />
                                          {tag}
                                        </Badge>
                                      ))}
                                    {post.tags.length > 4 && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs border-pink-200"
                                      >
                                        +{post.tags.length - 4} more
                                      </Badge>
                                    )}
                                  </div>

                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4 text-sm text-slate-600">
                                      <div className="flex items-center space-x-1">
                                        <User className="w-4 h-4" />
                                        <span>{post.author.name}</span>
                                      </div>
                                      <div className="flex items-center space-x-1">
                                        <Calendar className="w-4 h-4" />
                                        <time
                                          dateTime={post.publishedAt}
                                          itemProp="datePublished"
                                        >
                                          {new Date(
                                            post.publishedAt,
                                          ).toLocaleDateString("vi-VN")}
                                        </time>
                                      </div>
                                      <div className="flex items-center space-x-1">
                                        <Timer className="w-4 h-4" />
                                        <span>{post.readTime} phút</span>
                                      </div>
                                    </div>

                                    <div className="flex items-center space-x-4 text-sm text-slate-600">
                                      <div className="flex items-center space-x-1">
                                        <Eye className="w-4 h-4" />
                                        <span>{formatNumber(post.views)}</span>
                                      </div>
                                      <div className="flex items-center space-x-1">
                                        <Heart className="w-4 h-4" />
                                        <span>{formatNumber(post.likes)}</span>
                                      </div>
                                      <div className="flex items-center space-x-1">
                                        <MessageCircle className="w-4 h-4" />
                                        <span>
                                          {formatNumber(post.comments)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </motion.article>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="no-posts"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Card
                      className={`py-16 text-center border-0 bg-gradient-to-br ${unifiedColorScheme.cardBg} backdrop-blur-lg rounded-3xl`}
                    >
                      <CardContent>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            delay: 0.2,
                            type: "spring",
                            stiffness: 200,
                          }}
                        >
                          <Search className="w-20 h-20 mx-auto mb-6 text-slate-400" />
                        </motion.div>
                        <h3 className="mb-4 text-2xl font-bold text-slate-800">
                          Không tìm thấy bài viết nào
                        </h3>
                        <p className="mb-6 text-slate-600 max-w-md mx-auto">
                          Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc để tìm thấy
                          nội dung phù hợp với bạn
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                          <Button
                            variant="outline"
                            onClick={resetFilters}
                            className="border-pink-200 text-pink-700 hover:bg-pink-50"
                          >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Xóa tất cả bộ lọc
                          </Button>
                          <Button
                            className={`bg-gradient-to-r ${unifiedColorScheme.button} text-white`}
                            onClick={() =>
                              document
                                .getElementById("featured")
                                ?.scrollIntoView({ behavior: "smooth" })
                            }
                          >
                            <Star className="w-4 h-4 mr-2" />
                            Xem bài viết nổi bật
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div
                  className="mt-12 flex justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                      className="border-pink-200 text-slate-600 hover:bg-pink-50"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Trang trước
                    </Button>

                    {[...Array(totalPages)].map((_, index) => (
                      <Button
                        key={index}
                        variant={
                          currentPage === index + 1 ? "default" : "outline"
                        }
                        onClick={() => setCurrentPage(index + 1)}
                        className={`w-10 h-10 p-0 ${
                          currentPage === index + 1
                            ? `bg-gradient-to-r ${unifiedColorScheme.button} text-white`
                            : "border-pink-200 text-slate-600 hover:bg-pink-50"
                        }`}
                      >
                        {index + 1}
                      </Button>
                    ))}

                    <Button
                      variant="outline"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                      className="border-pink-200 text-slate-600 hover:bg-pink-50"
                    >
                      Trang sau
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </section>

          {/* Trending Posts Section */}
          <section
            className={`relative py-14 sm:py-16 lg:py-8 bg-gradient-to-br ${sectionBackgrounds.testimonials} -mx-4`}
            id="trending"
            data-animate
            style={{
              backgroundImage: `radial-gradient(circle at 20% 80%, rgba(220, 38, 127, 0.07) 0%, transparent 50%),
                               radial-gradient(circle at 80% 20%, rgba(244, 63, 94, 0.07) 0%, transparent 50%),
                               radial-gradient(circle at 40% 40%, rgba(236, 72, 153, 0.04) 0%, transparent 50%)`,
            }}
          >
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-center justify-between mb-12 transition-all duration-800 ${
                  isVisible.trending
                    ? "animate-in slide-in-from-bottom"
                    : "opacity-0"
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r ${unifiedColorScheme.buttonHover} shadow-lg`}
                  >
                    <Flame className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2
                      className={`text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r ${unifiedColorScheme.textSecondary} bg-clip-text`}
                    >
                      🔥 Trending
                    </h2>
                    <p className="text-slate-600 mt-1">
                      Bài viết hot nhất tuần này
                    </p>
                  </div>
                </div>
              </motion.div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {trendingPosts.slice(0, 6).map((post, index) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="group"
                  >
                    <Card
                      className={`h-full transition-all duration-300 border-0 hover:shadow-lg bg-gradient-to-br ${unifiedColorScheme.cardBg} backdrop-blur-lg rounded-2xl`}
                    >
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          <div className="flex-shrink-0">
                            <div
                              className={`flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r ${unifiedColorScheme.buttonHover} text-white font-bold text-sm`}
                            >
                              {index + 1}
                            </div>
                          </div>

                          <div className="flex-1 space-y-2">
                            <Badge
                              style={{
                                backgroundColor: getCategoryColor(
                                  post.category.color,
                                ),
                                color: "white",
                              }}
                              className="text-xs"
                            >
                              {post.category.name}
                            </Badge>

                            <h3 className="font-bold line-clamp-2 group-hover:text-pink-600 transition-colors">
                              <Link
                                to={`/blog/${post.slug}`}
                                className="hover:underline"
                              >
                                {post.title}
                              </Link>
                            </h3>

                            <div className="flex items-center justify-between text-xs text-slate-600">
                              <div className="flex items-center gap-2">
                                <img
                                  src={
                                    post.author.avatar ||
                                    "/images/default-avatar.png"
                                  }
                                  alt={post.author.name}
                                  className="w-5 h-5 rounded-full"
                                />
                                <span>{post.author.name}</span>
                              </div>

                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1">
                                  <Flame className="w-3 h-3" />
                                  <span>
                                    {formatNumber(
                                      post.views + post.likes + post.shares,
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.article>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default Blog;
