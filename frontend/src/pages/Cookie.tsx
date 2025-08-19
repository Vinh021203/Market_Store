import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Cookie,
  Shield,
  Settings,
  Eye,
  Database,
  Target,
  BarChart3,
  Users,
  Globe,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  HelpCircle,
  ExternalLink,
  Calendar,
  Clock,
  Trash2,
  Download,
  Upload,
  Smartphone,
  Monitor,
  Lock,
  Key,
  Server,
  Cloud,
  Wifi,
  Search,
  Filter,
  Copy,
  Share2,
  Mail,
  Phone,
  MessageSquare,
  FileText,
  BookOpen,
  Lightbulb,
  Star,
  Heart,
  ThumbsUp,
  Zap,
  Rocket,
  Award,
  Fingerprint,
  CreditCard,
  ShoppingCart,
  UserCheck,
  Activity,
  TrendingUp,
  PieChart,
  Layers,
  Package,
  Webhook,
  Bug,
  Code,
  Terminal,
  Github,
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  RefreshCw,
  Edit,
  Save,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Home,
  Archive,
  Folder,
  File,
  Image,
  Video,
  Music,
  Headphones,
  Sparkles,
  Crown,
  ArrowUp,
} from "lucide-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useInView,
} from "framer-motion";
import { toast } from "@/hooks/use-toast";

// Types
interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
  social: boolean;
}

interface CookieDetail {
  name: string;
  purpose: string;
  duration: string;
  type: "First-party" | "Third-party";
  provider: string;
}

// ✅ Fixed interface with bgColor and darkBg properties
interface CookieCategory {
  id: keyof CookiePreferences;
  name: string;
  description: string;
  required: boolean;
  icon: React.ElementType;
  color: string;
  bgColor: string; // ✅ Added bgColor property
  darkBg: string; // ✅ Added darkBg property
  count: number;
  examples: string[];
  cookies: CookieDetail[];
}

// Enhanced Color Schemes
const colorSchemes = {
  primary: {
    gradient: "from-cyan-500 via-blue-500 to-indigo-500",
    bg: "from-cyan-50/80 to-blue-50/80",
    darkBg: "from-cyan-900/30 to-blue-900/30",
  },
  success: {
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    bg: "from-emerald-50/80 to-cyan-50/80",
    darkBg: "from-emerald-900/30 to-cyan-900/30",
  },
  info: {
    gradient: "from-indigo-500 via-purple-500 to-blue-500",
    bg: "from-indigo-50/80 to-purple-50/80",
    darkBg: "from-indigo-900/30 to-purple-900/30",
  },
  warning: {
    gradient: "from-amber-500 via-orange-500 to-red-500",
    bg: "from-amber-50/80 to-orange-50/80",
    darkBg: "from-amber-900/30 to-orange-900/30",
  },
};

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -60 },
};

const fadeInLeft = {
  initial: { opacity: 0, x: -60 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 60 },
};

const fadeInRight = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -60 },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
};

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const CookiePolicy: React.FC = () => {
  // States
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [cookiePreferences, setCookiePreferences] = useState<CookiePreferences>(
    {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
      social: false,
    },
  );
  const [feedbackForm, setFeedbackForm] = useState({ email: "", message: "" });
  const [showFeedbackSuccess, setShowFeedbackSuccess] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showFloatingNav, setShowFloatingNav] = useState(false);

  // Scroll progress
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const headerY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  // Constants
  const lastUpdated = "19 tháng 8, 2025";
  const effectiveDate = "1 tháng 9, 2025";

  // ✅ Scroll Effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setShowFloatingNav(window.scrollY > 500);

      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(Math.min(progress, 100));
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Memoized data
  const cookieStats = useMemo(
    () => [
      {
        icon: Cookie,
        value: "12",
        label: "Loại cookies",
        color: "text-cyan-600",
        gradient: colorSchemes.primary.gradient,
      },
      {
        icon: Users,
        value: "2.5M+",
        label: "Người dùng",
        color: "text-emerald-600",
        gradient: colorSchemes.success.gradient,
      },
      {
        icon: Shield,
        value: "100%",
        label: "GDPR Compliant",
        color: "text-indigo-600",
        gradient: colorSchemes.info.gradient,
      },
      {
        icon: Globe,
        value: "195+",
        label: "Quốc gia",
        color: "text-blue-600",
        gradient: colorSchemes.primary.gradient,
      },
    ],
    [],
  );

  // ✅ Fixed cookieCategories with bgColor and darkBg properties
  const cookieCategories = useMemo<CookieCategory[]>(
    () => [
      {
        id: "necessary",
        name: "🔧 Cần thiết",
        description: "Cookies cần thiết cho hoạt động cơ bản của website",
        required: true,
        icon: Settings,
        color: colorSchemes.primary.gradient,
        bgColor: colorSchemes.primary.bg, // ✅ Added bgColor
        darkBg: colorSchemes.primary.darkBg, // ✅ Added darkBg
        count: 4,
        examples: ["Phiên đăng nhập", "Bảo mật", "Giỏ hàng", "Ngôn ngữ"],
        cookies: [
          {
            name: "session_id",
            purpose: "Duy trì phiên đăng nhập của người dùng",
            duration: "Session",
            type: "First-party",
            provider: "Template Market",
          },
          {
            name: "csrf_token",
            purpose: "Bảo vệ chống tấn công CSRF",
            duration: "Session",
            type: "First-party",
            provider: "Template Market",
          },
          {
            name: "cart_items",
            purpose: "Lưu trữ sản phẩm trong giỏ hàng",
            duration: "7 days",
            type: "First-party",
            provider: "Template Market",
          },
          {
            name: "language_pref",
            purpose: "Ghi nhớ ngôn ngữ được chọn",
            duration: "1 year",
            type: "First-party",
            provider: "Template Market",
          },
        ],
      },
      {
        id: "analytics",
        name: "📊 Phân tích",
        description: "Cookies giúp chúng tôi hiểu cách bạn sử dụng website",
        required: false,
        icon: BarChart3,
        color: colorSchemes.success.gradient,
        bgColor: colorSchemes.success.bg, // ✅ Added bgColor
        darkBg: colorSchemes.success.darkBg, // ✅ Added darkBg
        count: 3,
        examples: [
          "Google Analytics",
          "Heatmaps",
          "A/B Testing",
          "Performance",
        ],
        cookies: [
          {
            name: "_ga",
            purpose: "Phân biệt người dùng",
            duration: "2 years",
            type: "Third-party",
            provider: "Google Analytics",
          },
          {
            name: "_ga_*",
            purpose: "Lưu trữ session state",
            duration: "2 years",
            type: "Third-party",
            provider: "Google Analytics",
          },
          {
            name: "hotjar_session",
            purpose: "Theo dõi hành vi người dùng",
            duration: "30 minutes",
            type: "Third-party",
            provider: "Hotjar",
          },
        ],
      },
      {
        id: "marketing",
        name: "🎯 Marketing",
        description: "Cookies để hiển thị quảng cáo phù hợp với bạn",
        required: false,
        icon: Target,
        color: colorSchemes.warning.gradient,
        bgColor: colorSchemes.warning.bg, // ✅ Added bgColor
        darkBg: colorSchemes.warning.darkBg, // ✅ Added darkBg
        count: 5,
        examples: ["Facebook Pixel", "Google Ads", "Retargeting", "Conversion"],
        cookies: [
          {
            name: "_fbp",
            purpose: "Facebook Pixel tracking",
            duration: "3 months",
            type: "Third-party",
            provider: "Facebook",
          },
          {
            name: "google_ads_id",
            purpose: "Google Ads conversion tracking",
            duration: "90 days",
            type: "Third-party",
            provider: "Google Ads",
          },
          {
            name: "retargeting_id",
            purpose: "Hiển thị quảng cáo được cá nhân hóa",
            duration: "30 days",
            type: "Third-party",
            provider: "Various",
          },
        ],
      },
      {
        id: "functional",
        name: "⚡ Tính năng",
        description: "Cookies cải thiện trải nghiệm và tính năng website",
        required: false,
        icon: Zap,
        color: colorSchemes.info.gradient,
        bgColor: colorSchemes.info.bg, // ✅ Added bgColor
        darkBg: colorSchemes.info.darkBg, // ✅ Added darkBg
        count: 2,
        examples: ["Chat support", "Video player", "Maps", "Widgets"],
        cookies: [
          {
            name: "chat_widget_settings",
            purpose: "Lưu trữ cài đặt chat",
            duration: "6 months",
            type: "Third-party",
            provider: "LiveChat",
          },
          {
            name: "video_player_prefs",
            purpose: "Ghi nhớ cài đặt video",
            duration: "1 year",
            type: "First-party",
            provider: "Template Market",
          },
        ],
      },
      {
        id: "social",
        name: "👥 Mạng xã hội",
        description: "Cookies từ các nền tảng mạng xã hội",
        required: false,
        icon: Users,
        color: colorSchemes.primary.gradient,
        bgColor: colorSchemes.primary.bg, // ✅ Added bgColor
        darkBg: colorSchemes.primary.darkBg, // ✅ Added darkBg
        count: 3,
        examples: ["Facebook Like", "Twitter Share", "LinkedIn", "Instagram"],
        cookies: [
          {
            name: "facebook_widget",
            purpose: "Tích hợp Facebook social plugins",
            duration: "Session",
            type: "Third-party",
            provider: "Facebook",
          },
          {
            name: "twitter_widget",
            purpose: "Hiển thị nút Twitter share",
            duration: "Session",
            type: "Third-party",
            provider: "Twitter",
          },
        ],
      },
    ],
    [],
  );

  const faqs = useMemo(
    () => [
      {
        id: "what-are-cookies",
        question: "🍪 Cookies là gì?",
        answer:
          "Cookies là những file văn bản nhỏ được lưu trữ trên thiết bị của bạn khi truy cập website. Chúng giúp website ghi nhớ thông tin về chuyến thăm của bạn, như ngôn ngữ ưa thích, thông tin đăng nhập, và các tùy chọn khác để cải thiện trải nghiệm sử dụng.",
      },
      {
        id: "why-use-cookies",
        question: "🤔 Tại sao Template Market sử dụng cookies?",
        answer:
          "Chúng tôi sử dụng cookies để: (1) Duy trì phiên đăng nhập của bạn, (2) Ghi nhớ các tùy chọn và sở thích, (3) Phân tích cách sử dụng website để cải thiện dịch vụ, (4) Cung cấp nội dung và quảng cáo phù hợp, (5) Đảm bảo bảo mật và chống gian lận.",
      },
      {
        id: "manage-cookies",
        question: "⚙️ Làm sao để quản lý cookies?",
        answer:
          "Bạn có thể quản lý cookies qua: (1) Cookie Settings trên website này, (2) Cài đặt trình duyệt của bạn, (3) Extensions chặn cookies, (4) Mode duyệt ẩn danh. Lưu ý rằng tắt cookies có thể ảnh hưởng đến một số tính năng của website.",
      },
      {
        id: "data-retention",
        question: "📅 Cookies được lưu trữ bao lâu?",
        answer:
          "Thời gian lưu trữ tùy theo loại cookie: Session cookies (xóa khi đóng trình duyệt), Cookies ngắn hạn (vài giờ đến vài ngày), Cookies dài hạn (vài tháng đến 2 năm). Bạn có thể xem chi tiết thời gian cho từng cookie trong bảng cookies.",
      },
    ],
    [],
  );

  // Event handlers
  const handlePreferenceChange = useCallback(
    (category: keyof CookiePreferences, enabled: boolean) => {
      setCookiePreferences((prev) => ({
        ...prev,
        [category]: enabled,
      }));
    },
    [],
  );

  const handleSavePreferences = useCallback(() => {
    localStorage.setItem(
      "cookiePreferences",
      JSON.stringify(cookiePreferences),
    );
    toast({
      title: "🍪 Preferences đã được lưu!",
      description: "Cài đặt cookie của bạn đã được cập nhật thành công.",
    });
  }, [cookiePreferences]);

  const handleAcceptAll = useCallback(() => {
    const allEnabled: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
      social: true,
    };
    setCookiePreferences(allEnabled);
    localStorage.setItem("cookiePreferences", JSON.stringify(allEnabled));
    toast({
      title: "✅ Chấp nhận tất cả cookies!",
      description:
        "Tất cả cookies đã được kích hoạt để cải thiện trải nghiệm của bạn.",
    });
  }, []);

  const handleRejectAll = useCallback(() => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
      social: false,
    };
    setCookiePreferences(onlyNecessary);
    localStorage.setItem("cookiePreferences", JSON.stringify(onlyNecessary));
    toast({
      title: "🚫 Chỉ giữ cookies cần thiết!",
      description:
        "Đã tắt tất cả cookies tùy chọn, chỉ giữ lại cookies cần thiết.",
    });
  }, []);

  const handleFeedbackSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setShowFeedbackSuccess(true);
    setFeedbackForm({ email: "", message: "" });
    setTimeout(() => setShowFeedbackSuccess(false), 3000);
  }, []);

  // Filtered categories
  const filteredCategories = useMemo(
    () =>
      cookieCategories
        .filter(
          (category) =>
            selectedCategory === "all" || category.id === selectedCategory,
        )
        .filter(
          (category) =>
            category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            category.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase()),
        ),
    [cookieCategories, selectedCategory, searchTerm],
  );

  // ✅ Reading Progress Component
  const ReadingProgress: React.FC = () => (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 z-50">
      <motion.div
        className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500"
        style={{ width: `${scrollProgress}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${scrollProgress}%` }}
        transition={{ duration: 0.1 }}
      />
    </div>
  );

  // ✅ Floating Navigation
  const FloatingNav: React.FC = () => (
    <AnimatePresence>
      {showFloatingNav && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 right-6 z-40"
        >
          <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg border-0 shadow-2xl">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0 hover:from-cyan-600 hover:to-blue-600"
                >
                  <ArrowUp className="w-4 h-4" />
                </Button>
                <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                  {Math.round(scrollProgress)}% đã đọc
                </div>
                <Progress value={scrollProgress} className="w-20" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Load preferences from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("cookiePreferences");
    if (saved) {
      setCookiePreferences(JSON.parse(saved));
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>
          🍪 Cookie Policy | Template Market - Chính sách Cookies GDPR
        </title>
        <meta
          name="description"
          content="Chính sách cookies chi tiết của Template Market. Tuân thủ GDPR/CCPA, quản lý preferences, bảo vệ privacy người dùng."
        />
        <meta
          name="keywords"
          content="cookie policy, GDPR, privacy, cookies, template market, chính sách"
        />
        <link rel="canonical" href="https://templatemarket.vn/cookie-policy" />
      </Helmet>

      <ReadingProgress />
      <FloatingNav />

      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-cyan-900/20 dark:to-indigo-900/30">
        {/* ✅ Enhanced Hero Section */}
        <motion.section
          className="relative py-20 lg:py-32 overflow-hidden"
          style={{ y: headerY, opacity: headerOpacity }}
        >
          <div className="container relative z-10 px-4 mx-auto">
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerContainer}
              className="max-w-6xl mx-auto text-center"
            >
              {/* Animated Cookie Icon */}
              <motion.div
                variants={scaleIn}
                whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.6 }}
                className="flex items-center justify-center w-28 h-28 mx-auto mb-8 bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-500 rounded-3xl shadow-2xl"
              >
                <Cookie className="w-14 h-14 text-white" />
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="mb-8 text-5xl lg:text-7xl font-bold leading-tight"
              >
                <span className="text-transparent bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text">
                  Cookie Policy
                </span>
                <br />
                <span className="text-2xl lg:text-3xl font-medium text-gray-700 dark:text-gray-300">
                  Chính sách cookies và quyền riêng tư
                </span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="mb-12 text-xl lg:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-4xl mx-auto"
              >
                Hiểu rõ về cookies chúng tôi sử dụng,{" "}
                <span className="text-transparent bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text font-semibold">
                  quản lý preferences
                </span>
                , và{" "}
                <span className="text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text font-semibold">
                  bảo vệ quyền riêng tư
                </span>
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap items-center justify-center gap-4 mb-12"
              >
                {[
                  {
                    icon: Shield,
                    text: "GDPR Compliant",
                    color: "text-emerald-600",
                  },
                  {
                    icon: Globe,
                    text: "International Standards",
                    color: "text-cyan-600",
                  },
                  {
                    icon: Calendar,
                    text: `Cập nhật: ${lastUpdated}`,
                    color: "text-indigo-600",
                  },
                  {
                    icon: Clock,
                    text: `Hiệu lực: ${effectiveDate}`,
                    color: "text-blue-600",
                  },
                ].map((badge, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Badge className="px-6 py-3 text-base bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all border-0 text-gray-800">
                      <badge.icon className={`w-5 h-5 mr-3 ${badge.color}`} />
                      {badge.text}
                    </Badge>
                  </motion.div>
                ))}
              </motion.div>

              {/* Enhanced Stats Grid */}
              <motion.div
                variants={staggerContainer}
                className="grid grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {cookieStats.map((stat, index) => (
                  <motion.div
                    key={index}
                    variants={scaleIn}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-2xl transition-all duration-300"
                  >
                    <div
                      className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center shadow-lg`}
                    >
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* Enhanced Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  x: [0, 100, 0],
                  y: [0, -60, 0],
                  opacity: [0.1, 0.4, 0.1],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 15 + i * 2,
                  repeat: Infinity,
                  delay: i * 1.5,
                  ease: "easeInOut",
                }}
                className={`absolute w-32 h-32 rounded-full blur-2xl mix-blend-multiply ${
                  i % 4 === 0
                    ? "bg-cyan-300/40"
                    : i % 4 === 1
                      ? "bg-blue-300/40"
                      : i % 4 === 2
                        ? "bg-indigo-300/40"
                        : "bg-purple-300/40"
                }`}
                style={{
                  top: `${5 + (i % 4) * 25}%`,
                  left: `${3 + (i % 3) * 35}%`,
                }}
              />
            ))}
          </div>
        </motion.section>

        <div className="container px-4 pb-20 mx-auto">
          {/* Enhanced Navigation Tabs */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <Card className="bg-white/80 dark:bg-slate-900/80 border-0 shadow-xl backdrop-blur-sm">
              <CardContent className="p-6">
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 gap-1">
                    <TabsTrigger
                      value="overview"
                      className="text-xs md:text-sm"
                    >
                      Tổng quan
                    </TabsTrigger>
                    <TabsTrigger
                      value="categories"
                      className="text-xs md:text-sm"
                    >
                      Loại cookies
                    </TabsTrigger>
                    <TabsTrigger
                      value="preferences"
                      className="text-xs md:text-sm"
                    >
                      Cài đặt
                    </TabsTrigger>
                    <TabsTrigger value="legal" className="text-xs md:text-sm">
                      Pháp lý
                    </TabsTrigger>
                    <TabsTrigger value="guides" className="text-xs md:text-sm">
                      Hướng dẫn
                    </TabsTrigger>
                    <TabsTrigger value="faq" className="text-xs md:text-sm">
                      FAQ
                    </TabsTrigger>
                  </TabsList>

                  {/* Overview Tab */}
                  <TabsContent value="overview" className="mt-8">
                    <motion.div
                      key="overview"
                      initial="initial"
                      animate="animate"
                      variants={staggerContainer}
                      className="space-y-8"
                    >
                      <motion.div variants={fadeInUp} className="text-center">
                        <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                          🍪 Tổng quan về Cookies
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto">
                          Template Market cam kết minh bạch trong việc sử dụng
                          cookies và bảo vệ quyền riêng tư của bạn
                        </p>
                      </motion.div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                          {
                            title: "Cookies là gì?",
                            content:
                              "Cookies là những file văn bản nhỏ được lưu trữ trên thiết bị của bạn khi truy cập website. Chúng giúp website ghi nhớ thông tin về bạn để cải thiện trải nghiệm sử dụng.",
                            icon: Info,
                            gradient: colorSchemes.primary.gradient,
                            bgGradient: colorSchemes.primary.bg,
                          },
                          {
                            title: "Bảo mật & Privacy",
                            content:
                              "Chúng tôi tuân thủ nghiêm ngặt các quy định GDPR, CCPA và các luật bảo vệ dữ liệu quốc tế. Bạn có toàn quyền kiểm soát cookies trên thiết bị của mình.",
                            icon: Shield,
                            gradient: colorSchemes.success.gradient,
                            bgGradient: colorSchemes.success.bg,
                          },
                          {
                            title: "Mục đích sử dụng",
                            content:
                              "Duy trì phiên đăng nhập, ghi nhớ tùy chọn, phân tích sử dụng, cải thiện dịch vụ",
                            icon: Target,
                            gradient: colorSchemes.info.gradient,
                            bgGradient: colorSchemes.info.bg,
                          },
                          {
                            title: "Quyền của bạn",
                            content:
                              "Chấp nhận hoặc từ chối, quản lý preferences, rút lại đồng ý, xóa dữ liệu",
                            icon: UserCheck,
                            gradient: colorSchemes.warning.gradient,
                            bgGradient: colorSchemes.warning.bg,
                          },
                        ].map((item, index) => (
                          <motion.div
                            key={index}
                            variants={fadeInUp}
                            whileHover={{ y: -5, scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Card
                              className={`bg-gradient-to-br ${item.bgGradient} dark:bg-gradient-to-br ${item.bgGradient.replace("50", "900/20")} border-0 shadow-lg hover:shadow-2xl transition-all duration-300 h-full`}
                            >
                              <CardContent className="p-8">
                                <div className="flex items-center gap-4 mb-6">
                                  <motion.div
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    className={`w-12 h-12 bg-gradient-to-r ${item.gradient} rounded-xl flex items-center justify-center shadow-lg`}
                                  >
                                    <item.icon className="w-6 h-6 text-white" />
                                  </motion.div>
                                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                                    {item.title}
                                  </h3>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                  {item.content}
                                </p>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </TabsContent>

                  {/* Categories Tab */}
                  <TabsContent value="categories" className="mt-8">
                    <motion.div
                      key="categories"
                      initial="initial"
                      animate="animate"
                      variants={staggerContainer}
                      className="space-y-8"
                    >
                      <motion.div variants={fadeInUp} className="text-center">
                        <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                          📊 Các loại Cookies
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400">
                          Chi tiết về từng loại cookie chúng tôi sử dụng
                        </p>
                      </motion.div>

                      {/* Enhanced Search and Filter */}
                      <motion.div variants={fadeInUp}>
                        <Card className="bg-white/60 dark:bg-slate-800/60 border-0 shadow-lg backdrop-blur-sm">
                          <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row gap-4">
                              <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                                <Input
                                  placeholder="Tìm kiếm loại cookies..."
                                  value={searchTerm}
                                  onChange={(e) =>
                                    setSearchTerm(e.target.value)
                                  }
                                  className="pl-10 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm text-gray-800 dark:text-gray-200"
                                />
                              </div>
                              <select
                                value={selectedCategory}
                                onChange={(e) =>
                                  setSelectedCategory(e.target.value)
                                }
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm min-w-[140px] text-gray-800 dark:text-gray-200"
                              >
                                <option value="all">Tất cả loại</option>
                                {cookieCategories.map((category) => (
                                  <option key={category.id} value={category.id}>
                                    {category.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>

                      {/* Enhanced Cookie Categories */}
                      <div className="space-y-8">
                        <AnimatePresence mode="wait">
                          {filteredCategories.map((category, index) => (
                            <motion.div
                              key={category.id}
                              variants={fadeInLeft}
                              initial="initial"
                              animate="animate"
                              exit="exit"
                              transition={{ delay: index * 0.1 }}
                              whileHover={{ scale: 1.01 }}
                            >
                              <Card className="bg-white/90 dark:bg-slate-800/90 border-0 shadow-xl overflow-hidden backdrop-blur-sm">
                                <motion.div
                                  className={`h-2 bg-gradient-to-r ${category.color}`}
                                  layoutId={`category-line-${category.id}`}
                                />
                                <CardHeader className="pb-4">
                                  <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                      <motion.div
                                        whileHover={{ scale: 1.1, rotate: 10 }}
                                        className={`p-3 bg-gradient-to-r ${category.color} rounded-xl shadow-lg`}
                                      >
                                        <category.icon className="w-6 h-6 text-white" />
                                      </motion.div>
                                      <div>
                                        <div className="text-xl font-bold text-gray-800 dark:text-gray-100">
                                          {category.name}
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400 font-normal">
                                          {category.description}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-3 flex-wrap">
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {category.count} cookies
                                      </Badge>
                                      {category.required ? (
                                        <Badge className="bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200 text-xs">
                                          Bắt buộc
                                        </Badge>
                                      ) : (
                                        <Badge
                                          variant="secondary"
                                          className="text-xs"
                                        >
                                          Tùy chọn
                                        </Badge>
                                      )}
                                    </div>
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                  {/* Examples */}
                                  <div>
                                    <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">
                                      Ví dụ sử dụng:
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                      {category.examples.map((example, idx) => (
                                        <motion.div
                                          key={idx}
                                          whileHover={{ scale: 1.05 }}
                                          whileTap={{ scale: 0.95 }}
                                        >
                                          <Badge
                                            variant="outline"
                                            className="text-xs hover:bg-primary/10 transition-colors"
                                          >
                                            {example}
                                          </Badge>
                                        </motion.div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Cookie Details Table */}
                                  <div>
                                    <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">
                                      Chi tiết cookies:
                                    </h4>
                                    <div className="overflow-x-auto rounded-lg border">
                                      <table className="w-full border-collapse bg-white/50 dark:bg-slate-800/50">
                                        <thead>
                                          <tr className="border-b bg-gray-50/50 dark:bg-slate-700/50">
                                            <th className="text-left p-3 font-semibold text-sm text-gray-800 dark:text-gray-200">
                                              Tên
                                            </th>
                                            <th className="text-left p-3 font-semibold text-sm text-gray-800 dark:text-gray-200">
                                              Mục đích
                                            </th>
                                            <th className="text-left p-3 font-semibold text-sm text-gray-800 dark:text-gray-200">
                                              Thời gian
                                            </th>
                                            <th className="text-left p-3 font-semibold text-sm text-gray-800 dark:text-gray-200">
                                              Loại
                                            </th>
                                            <th className="text-left p-3 font-semibold text-sm text-gray-800 dark:text-gray-200">
                                              Nhà cung cấp
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {category.cookies.map(
                                            (cookie, idx) => (
                                              <motion.tr
                                                key={idx}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{
                                                  delay: idx * 0.1,
                                                }}
                                                className="border-b hover:bg-gray-50/50 dark:hover:bg-slate-700/50 transition-colors"
                                              >
                                                <td className="p-3 font-mono text-sm font-medium text-gray-800 dark:text-gray-200">
                                                  {cookie.name}
                                                </td>
                                                <td className="p-3 text-sm text-gray-700 dark:text-gray-300">
                                                  {cookie.purpose}
                                                </td>
                                                <td className="p-3 text-sm text-gray-700 dark:text-gray-300">
                                                  {cookie.duration}
                                                </td>
                                                <td className="p-3">
                                                  <Badge
                                                    variant={
                                                      cookie.type ===
                                                      "First-party"
                                                        ? "default"
                                                        : "outline"
                                                    }
                                                    className="text-xs"
                                                  >
                                                    {cookie.type}
                                                  </Badge>
                                                </td>
                                                <td className="p-3 text-sm text-gray-700 dark:text-gray-300">
                                                  {cookie.provider}
                                                </td>
                                              </motion.tr>
                                            ),
                                          )}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  </TabsContent>

                  {/* Preferences Tab */}
                  <TabsContent value="preferences" className="mt-8">
                    <motion.div
                      key="preferences"
                      initial="initial"
                      animate="animate"
                      variants={staggerContainer}
                      className="space-y-8"
                    >
                      <motion.div variants={fadeInUp} className="text-center">
                        <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                          ⚙️ Quản lý Cookie Preferences
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400">
                          Kiểm soát hoàn toàn cookies nào được phép trên thiết
                          bị của bạn
                        </p>
                      </motion.div>

                      <motion.div variants={fadeInUp}>
                        <Card className="bg-white/90 dark:bg-slate-800/90 border-0 shadow-xl backdrop-blur-sm">
                          <CardContent className="p-8">
                            <div className="space-y-8">
                              {cookieCategories.map((category, index) => (
                                <motion.div
                                  key={category.id}
                                  variants={fadeInRight}
                                  transition={{ delay: index * 0.1 }}
                                  whileHover={{ scale: 1.01 }}
                                  className={`flex flex-col md:flex-row items-start md:items-center justify-between p-6 bg-gradient-to-r ${category.bgColor} dark:bg-gradient-to-r ${category.darkBg} rounded-xl border backdrop-blur-sm gap-4`}
                                >
                                  <div className="flex items-center gap-4 flex-1">
                                    <motion.div
                                      whileHover={{ scale: 1.1, rotate: 10 }}
                                      className={`p-3 bg-gradient-to-r ${category.color} rounded-xl shadow-lg flex-shrink-0`}
                                    >
                                      <category.icon className="w-6 h-6 text-white" />
                                    </motion.div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                                        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                                          {category.name}
                                        </h3>
                                        {category.required && (
                                          <Badge className="bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200 text-xs">
                                            Bắt buộc
                                          </Badge>
                                        )}
                                      </div>
                                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                                        {category.description}
                                      </p>
                                      <div className="flex flex-wrap gap-1">
                                        {category.examples
                                          .slice(0, 3)
                                          .map((example, idx) => (
                                            <Badge
                                              key={idx}
                                              variant="outline"
                                              className="text-xs"
                                            >
                                              {example}
                                            </Badge>
                                          ))}
                                        {category.examples.length > 3 && (
                                          <Badge
                                            variant="outline"
                                            className="text-xs"
                                          >
                                            +{category.examples.length - 3} more
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-3 flex-shrink-0">
                                    <Switch
                                      checked={cookiePreferences[category.id]}
                                      onCheckedChange={(checked) =>
                                        handlePreferenceChange(
                                          category.id,
                                          checked,
                                        )
                                      }
                                      disabled={category.required}
                                    />
                                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                      {cookiePreferences[category.id]
                                        ? "Bật"
                                        : "Tắt"}
                                    </Label>
                                  </div>
                                </motion.div>
                              ))}
                            </div>

                            <Separator className="my-8" />

                            <motion.div
                              variants={fadeInUp}
                              className="flex flex-col sm:flex-row gap-4 justify-center"
                            >
                              <Button
                                onClick={handleRejectAll}
                                variant="outline"
                                size="lg"
                                className="hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors"
                              >
                                <XCircle className="w-5 h-5 mr-2" />
                                Từ chối tất cả
                              </Button>
                              <Button
                                onClick={handleSavePreferences}
                                size="lg"
                                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0"
                              >
                                <Save className="w-5 h-5 mr-2" />
                                Lưu preferences
                              </Button>
                              <Button
                                onClick={handleAcceptAll}
                                size="lg"
                                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0"
                              >
                                <CheckCircle className="w-5 h-5 mr-2" />
                                Chấp nhận tất cả
                              </Button>
                            </motion.div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </motion.div>
                  </TabsContent>

                  {/* Legal Tab */}
                  <TabsContent value="legal" className="mt-8">
                    <motion.div
                      key="legal"
                      initial="initial"
                      animate="animate"
                      variants={staggerContainer}
                      className="space-y-8"
                    >
                      <motion.div variants={fadeInUp} className="text-center">
                        <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                          ⚖️ Cơ sở pháp lý
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400">
                          Template Market tuân thủ các quy định bảo vệ dữ liệu
                          quốc tế
                        </p>
                      </motion.div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                          {
                            title: "🇪🇺 GDPR (EU)",
                            description: "General Data Protection Regulation",
                            requirements: [
                              "Consent phải rõ ràng và cụ thể",
                              "Có thể rút lại consent bất cứ lúc nào",
                              "Thông tin về mục đích sử dụng",
                              "Quyền truy cập và xóa dữ liệu",
                            ],
                            compliance: "100%",
                          },
                          {
                            title: "🇺🇸 CCPA (California)",
                            description: "California Consumer Privacy Act",
                            requirements: [
                              "Thông báo về việc thu thập dữ liệu",
                              "Quyền opt-out khỏi việc bán dữ liệu",
                              "Quyền xóa thông tin cá nhân",
                              "Không discrimination khi opt-out",
                            ],
                            compliance: "100%",
                          },
                          {
                            title: "🇨🇦 PIPEDA (Canada)",
                            description: "Personal Information Protection Act",
                            requirements: [
                              "Consent có ý nghĩa",
                              "Mục đích thu thập rõ ràng",
                              "Bảo mật thông tin",
                              "Quyền truy cập thông tin",
                            ],
                            compliance: "100%",
                          },
                          {
                            title: "🇦🇺 Privacy Act (Australia)",
                            description: "Australian Privacy Principles",
                            requirements: [
                              "Thông báo việc thu thập",
                              "Sử dụng đúng mục đích",
                              "Bảo mật dữ liệu",
                              "Quyền truy cập và sửa đổi",
                            ],
                            compliance: "100%",
                          },
                        ].map((legal, index) => (
                          <motion.div
                            key={index}
                            variants={scaleIn}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                          >
                            <Card className="h-full bg-white/90 dark:bg-slate-800/90 border-0 shadow-xl backdrop-blur-sm">
                              <CardContent className="p-8">
                                <div className="flex items-center justify-between mb-6">
                                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                                    {legal.title}
                                  </h3>
                                  <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    {legal.compliance} compliant
                                  </Badge>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 mb-6">
                                  {legal.description}
                                </p>
                                <div className="space-y-3">
                                  <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                                    Yêu cầu chính:
                                  </h4>
                                  {legal.requirements.map((req, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-start gap-3"
                                    >
                                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                      <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {req}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>

                      {/* Data Retention Policy */}
                      <motion.div variants={fadeInUp}>
                        <Card className="bg-gradient-to-r from-cyan-50/90 to-blue-50/90 dark:from-cyan-900/20 dark:to-blue-900/20 border-0 shadow-xl">
                          <CardContent className="p-8">
                            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-800 dark:text-gray-100">
                              <Database className="w-8 h-8 text-cyan-600" />
                              Chính sách lưu trữ dữ liệu
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {[
                                {
                                  icon: Clock,
                                  title: "Session Cookies",
                                  description:
                                    "Tự động xóa khi đóng trình duyệt",
                                  color: "text-cyan-600",
                                },
                                {
                                  icon: Calendar,
                                  title: "Persistent Cookies",
                                  description: "Lưu trữ từ 30 ngày đến 2 năm",
                                  color: "text-emerald-600",
                                },
                                {
                                  icon: Trash2,
                                  title: "User Control",
                                  description: "Bạn có thể xóa bất cứ lúc nào",
                                  color: "text-blue-600",
                                },
                              ].map((item, index) => (
                                <motion.div
                                  key={index}
                                  whileHover={{ scale: 1.05, y: -2 }}
                                  className="text-center p-6 bg-white/70 dark:bg-slate-800/70 rounded-xl backdrop-blur-sm"
                                >
                                  <item.icon
                                    className={`w-12 h-12 ${item.color} mx-auto mb-4`}
                                  />
                                  <h4 className="font-bold mb-2 text-gray-800 dark:text-gray-200">
                                    {item.title}
                                  </h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {item.description}
                                  </p>
                                </motion.div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </motion.div>
                  </TabsContent>

                  {/* Guides Tab */}
                  <TabsContent value="guides" className="mt-8">
                    <motion.div
                      key="guides"
                      initial="initial"
                      animate="animate"
                      variants={staggerContainer}
                      className="space-y-8"
                    >
                      <motion.div variants={fadeInUp} className="text-center">
                        <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                          📚 Hướng dẫn quản lý Cookies
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400">
                          Cách quản lý cookies trên các trình duyệt phổ biến
                        </p>
                      </motion.div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                          {
                            name: "Google Chrome",
                            icon: Globe,
                            steps: [
                              "Mở Chrome và click vào 3 chấm ở góc phải",
                              "Chọn 'Settings' > 'Privacy and security'",
                              "Click 'Cookies and other site data'",
                              "Chọn tùy chọn phù hợp với nhu cầu của bạn",
                            ],
                          },
                          {
                            name: "Mozilla Firefox",
                            icon: Shield,
                            steps: [
                              "Mở Firefox và click menu (3 đường kẻ)",
                              "Chọn 'Settings' > 'Privacy & Security'",
                              "Tìm phần 'Cookies and Site Data'",
                              "Click 'Manage Data' để xem và xóa cookies",
                            ],
                          },
                          {
                            name: "Safari",
                            icon: Eye,
                            steps: [
                              "Mở Safari và click 'Safari' trong menu",
                              "Chọn 'Preferences' > 'Privacy'",
                              "Chọn mức độ chặn cookies",
                              "Click 'Manage Website Data' để xem chi tiết",
                            ],
                          },
                          {
                            name: "Microsoft Edge",
                            icon: Settings,
                            steps: [
                              "Mở Edge và click 3 chấm ở góc phải",
                              "Chọn 'Settings' > 'Cookies and site permissions'",
                              "Click 'Cookies and site data'",
                              "Điều chỉnh cài đặt theo ý muốn",
                            ],
                          },
                        ].map((guide, index) => (
                          <motion.div
                            key={guide.name}
                            variants={fadeInUp}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                          >
                            <Card className="h-full bg-white/90 dark:bg-slate-800/90 border-0 shadow-xl backdrop-blur-sm">
                              <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-gray-800 dark:text-gray-100">
                                  <guide.icon className="w-8 h-8 text-cyan-600" />
                                  {guide.name}
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-4">
                                  {guide.steps.map((step, idx) => (
                                    <motion.div
                                      key={idx}
                                      initial={{ opacity: 0, x: -20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: idx * 0.1 }}
                                      className="flex items-start gap-3"
                                    >
                                      <div className="w-6 h-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold rounded-full flex items-center justify-center flex-shrink-0">
                                        {idx + 1}
                                      </div>
                                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                        {step}
                                      </p>
                                    </motion.div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>

                      {/* Additional Tips */}
                      <motion.div variants={fadeInUp}>
                        <Card className="bg-gradient-to-r from-emerald-50/90 to-teal-50/90 dark:from-emerald-900/20 dark:to-teal-900/20 border-0 shadow-xl">
                          <CardContent className="p-8">
                            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-800 dark:text-gray-100">
                              <Lightbulb className="w-8 h-8 text-emerald-600" />
                              Tips hữu ích
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <h4 className="font-bold text-gray-800 dark:text-gray-200">
                                  🔒 Bảo mật cookies:
                                </h4>
                                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                  {[
                                    "Sử dụng HTTPS khi có thể",
                                    "Tránh wifi công cộng cho giao dịch",
                                    "Cập nhật trình duyệt thường xuyên",
                                  ].map((tip, idx) => (
                                    <li
                                      key={idx}
                                      className="flex items-center gap-2"
                                    >
                                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                                      {tip}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div className="space-y-4">
                                <h4 className="font-bold text-gray-800 dark:text-gray-200">
                                  🧹 Dọn dẹp cookies:
                                </h4>
                                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                  {[
                                    "Xóa cookies định kỳ",
                                    "Sử dụng chế độ duyệt ẩn danh",
                                    "Kiểm tra permissions website",
                                  ].map((tip, idx) => (
                                    <li
                                      key={idx}
                                      className="flex items-center gap-2"
                                    >
                                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                                      {tip}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </motion.div>
                  </TabsContent>

                  {/* FAQ Tab */}
                  <TabsContent value="faq" className="mt-8">
                    <motion.div
                      key="faq"
                      initial="initial"
                      animate="animate"
                      variants={staggerContainer}
                      className="space-y-8"
                    >
                      <motion.div variants={fadeInUp} className="text-center">
                        <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                          ❓ Câu hỏi thường gặp
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-400">
                          Giải đáp những thắc mắc phổ biến về cookies
                        </p>
                      </motion.div>

                      <motion.div variants={fadeInUp}>
                        <Card className="bg-white/90 dark:bg-slate-800/90 border-0 shadow-xl backdrop-blur-sm">
                          <CardContent className="p-8">
                            <Accordion
                              type="single"
                              collapsible
                              className="w-full space-y-4"
                            >
                              {faqs.map((faq, index) => (
                                <AccordionItem
                                  key={faq.id}
                                  value={faq.id}
                                  className="border border-gray-200 dark:border-gray-700 rounded-xl px-6 data-[state=open]:shadow-lg transition-all duration-300"
                                >
                                  <AccordionTrigger className="text-left hover:no-underline py-6">
                                    <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                        {index + 1}
                                      </div>
                                      <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                        {faq.question}
                                      </span>
                                    </div>
                                  </AccordionTrigger>
                                  <AccordionContent className="pb-6">
                                    <div className="ml-11 text-gray-600 dark:text-gray-400 leading-relaxed">
                                      {faq.answer}
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              ))}
                            </Accordion>
                          </CardContent>
                        </Card>
                      </motion.div>

                      {/* Enhanced Feedback Form */}
                      <motion.div variants={fadeInUp}>
                        <Card className="bg-gradient-to-r from-indigo-50/90 to-purple-50/90 dark:from-indigo-900/20 dark:to-purple-900/20 border-0 shadow-xl">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-gray-800 dark:text-gray-100">
                              <MessageSquare className="w-8 h-8 text-indigo-600" />
                              💬 Góp ý về Cookie Policy
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                              Có câu hỏi về cookies hoặc muốn góp ý cải thiện
                              policy? Hãy liên hệ với chúng tôi!
                            </p>
                            <AnimatePresence mode="wait">
                              {showFeedbackSuccess ? (
                                <motion.div
                                  key="success"
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.9 }}
                                  className="text-center py-8"
                                >
                                  <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                                  <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-200 mb-2">
                                    Cảm ơn bạn!
                                  </h3>
                                  <p className="text-emerald-600 dark:text-emerald-400">
                                    Góp ý của bạn đã được gửi thành công.
                                  </p>
                                </motion.div>
                              ) : (
                                <motion.form
                                  key="form"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  onSubmit={handleFeedbackSubmit}
                                  className="space-y-6"
                                >
                                  <div>
                                    <Label
                                      htmlFor="feedback-email"
                                      className="text-gray-700 dark:text-gray-300"
                                    >
                                      Email
                                    </Label>
                                    <Input
                                      id="feedback-email"
                                      type="email"
                                      value={feedbackForm.email}
                                      onChange={(e) =>
                                        setFeedbackForm({
                                          ...feedbackForm,
                                          email: e.target.value,
                                        })
                                      }
                                      className="bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm text-gray-800 dark:text-gray-200"
                                      required
                                    />
                                  </div>
                                  <div>
                                    <Label
                                      htmlFor="feedback-message"
                                      className="text-gray-700 dark:text-gray-300"
                                    >
                                      Tin nhắn
                                    </Label>
                                    <Textarea
                                      id="feedback-message"
                                      rows={4}
                                      placeholder="Chia sẻ câu hỏi hoặc góp ý của bạn về cookie policy..."
                                      value={feedbackForm.message}
                                      onChange={(e) =>
                                        setFeedbackForm({
                                          ...feedbackForm,
                                          message: e.target.value,
                                        })
                                      }
                                      className="bg-white/70 dark:bg-slate-700/70 backdrop-blur-sm resize-none text-gray-800 dark:text-gray-200"
                                      required
                                    />
                                  </div>
                                  <Button
                                    type="submit"
                                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0"
                                  >
                                    <Mail className="w-4 h-4 mr-2" />
                                    Gửi góp ý
                                  </Button>
                                </motion.form>
                              )}
                            </AnimatePresence>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </motion.div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.section>

          {/* Enhanced Contact Section */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-gradient-to-r from-cyan-50/90 to-indigo-50/90 dark:from-cyan-900/20 dark:to-indigo-900/20 border-0 shadow-2xl">
              <CardContent className="p-10 text-center">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-4xl font-bold mb-4 text-gray-800 dark:text-gray-100"
                >
                  🤝 Cần hỗ trợ về Cookies?
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto"
                >
                  Đội ngũ Data Protection Officer của chúng tôi sẵn sàng hỗ trợ
                  bạn về mọi vấn đề liên quan đến cookies và quyền riêng tư.
                </motion.p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    {
                      icon: Mail,
                      title: "📧 Email Privacy",
                      description: "privacy@templatemarket.vn",
                      detail: "Hỗ trợ về cookies và privacy",
                      color: colorSchemes.primary.gradient,
                    },
                    {
                      icon: MessageSquare,
                      title: "💬 Live Chat",
                      description: "Chat trực tiếp với DPO",
                      detail: "Tư vấn real-time về GDPR",
                      color: colorSchemes.success.gradient,
                    },
                    {
                      icon: FileText,
                      title: "📚 Privacy Center",
                      description: "Trung tâm quyền riêng tư",
                      detail: "Tài liệu và tools quản lý data",
                      color: colorSchemes.info.gradient,
                    },
                  ].map((contact, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -10, scale: 1.03 }}
                    >
                      <Card className="h-full bg-white/90 dark:bg-slate-800/90 border-0 shadow-lg hover:shadow-2xl transition-all duration-300 backdrop-blur-sm">
                        <CardContent className="p-8">
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-r ${contact.color} rounded-2xl shadow-xl flex items-center justify-center`}
                          >
                            <contact.icon className="w-8 h-8 text-white" />
                          </motion.div>
                          <h4 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-100">
                            {contact.title}
                          </h4>
                          <p className="text-cyan-600 dark:text-cyan-400 font-mono text-sm mb-3">
                            {contact.description}
                          </p>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                            {contact.detail}
                          </p>
                          <Button
                            variant="outline"
                            className="w-full hover:bg-primary/10"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Liên hệ
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.section>
        </div>
      </div>
    </>
  );
};

export default CookiePolicy;
