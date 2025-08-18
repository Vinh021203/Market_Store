import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CookiePolicy: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false,
    social: false,
  });
  const [showConsentBanner, setShowConsentBanner] = useState(true);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [feedbackForm, setFeedbackForm] = useState({ email: "", message: "" });
  const [showFeedbackSuccess, setShowFeedbackSuccess] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const lastUpdated = "18 tháng 8, 2025";
  const effectiveDate = "1 tháng 9, 2025";

  const cookieStats = [
    {
      icon: Cookie,
      value: "12",
      label: "Loại cookies",
      color: "text-orange-600",
    },
    {
      icon: Users,
      value: "2.5M+",
      label: "Người dùng",
      color: "text-blue-600",
    },
    {
      icon: Shield,
      value: "100%",
      label: "GDPR Compliant",
      color: "text-green-600",
    },
    { icon: Globe, value: "195+", label: "Quốc gia", color: "text-purple-600" },
  ];

  const cookieCategories = [
    {
      id: "necessary",
      name: "🔧 Cần thiết",
      description: "Cookies cần thiết cho hoạt động cơ bản của website",
      required: true,
      icon: Settings,
      color: "from-blue-500 to-cyan-400",
      count: 4,
      examples: ["Phiên đăng nhập", "Bảo mật", "Giỏ hàng", "Tùy chọn ngôn ngữ"],
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
      color: "from-emerald-500 to-green-400",
      count: 3,
      examples: [
        "Google Analytics",
        "Heatmaps",
        "A/B Testing",
        "Performance monitoring",
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
      color: "from-purple-500 to-pink-400",
      count: 5,
      examples: [
        "Facebook Pixel",
        "Google Ads",
        "Retargeting",
        "Conversion tracking",
      ],
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
      color: "from-orange-500 to-red-400",
      count: 2,
      examples: ["Chat support", "Video player", "Maps", "Social widgets"],
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
      color: "from-pink-500 to-rose-400",
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
  ];

  const legalBasis = [
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
  ];

  const faqs = [
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
      id: "cookie-types",
      question: "📋 Có những loại cookies nào?",
      answer:
        "Chúng tôi sử dụng 5 loại cookies chính: (1) Cookies cần thiết - không thể tắt, (2) Cookies phân tích - theo dõi sử dụng website, (3) Cookies marketing - hiển thị quảng cáo phù hợp, (4) Cookies tính năng - cải thiện trải nghiệm, (5) Cookies mạng xã hội - tích hợp social media.",
    },
    {
      id: "manage-cookies",
      question: "⚙️ Làm sao để quản lý cookies?",
      answer:
        "Bạn có thể quản lý cookies qua: (1) Cookie Settings trên website này, (2) Cài đặt trình duyệt của bạn, (3) Extensions chặn cookies, (4) Mode duyệt ẩn danh. Lưu ý rằng tắt cookies có thể ảnh hưởng đến một số tính năng của website.",
    },
    {
      id: "third-party-cookies",
      question: "🔗 Third-party cookies là gì?",
      answer:
        "Third-party cookies là cookies được đặt bởi các domain khác (không phải Template Market), như Google Analytics, Facebook Pixel, hoặc các dịch vụ quảng cáo. Chúng tôi chỉ sử dụng third-party cookies từ các nhà cung cấp đáng tin cậy và tuân thủ GDPR.",
    },
    {
      id: "data-retention",
      question: "📅 Cookies được lưu trữ bao lâu?",
      answer:
        "Thời gian lưu trữ tùy theo loại cookie: Session cookies (xóa khi đóng trình duyệt), Cookies ngắn hạn (vài giờ đến vài ngày), Cookies dài hạn (vài tháng đến 2 năm). Bạn có thể xem chi tiết thời gian cho từng cookie trong bảng cookies.",
    },
  ];

  const browserGuides = [
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
  ];

  const handlePreferenceChange = (category: string, enabled: boolean) => {
    setCookiePreferences((prev) => ({
      ...prev,
      [category]: enabled,
    }));
  };

  const handleSavePreferences = () => {
    localStorage.setItem(
      "cookiePreferences",
      JSON.stringify(cookiePreferences),
    );
    setShowConsentBanner(false);
    // Trigger analytics/marketing code based on preferences
    if (cookiePreferences.analytics) {
      // Enable analytics
      console.log("Analytics enabled");
    }
    if (cookiePreferences.marketing) {
      // Enable marketing
      console.log("Marketing enabled");
    }
  };

  const handleAcceptAll = () => {
    const allEnabled = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
      social: true,
    };
    setCookiePreferences(allEnabled);
    localStorage.setItem("cookiePreferences", JSON.stringify(allEnabled));
    setShowConsentBanner(false);
  };

  const handleRejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
      social: false,
    };
    setCookiePreferences(onlyNecessary);
    localStorage.setItem("cookiePreferences", JSON.stringify(onlyNecessary));
    setShowConsentBanner(false);
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowFeedbackSuccess(true);
    setFeedbackForm({ email: "", message: "" });
    setTimeout(() => setShowFeedbackSuccess(false), 3000);
  };

  const filteredCategories = cookieCategories
    .filter(
      (category) =>
        selectedCategory === "all" || category.id === selectedCategory,
    )
    .filter(
      (category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase()),
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50 dark:from-slate-900 dark:via-orange-900/20 dark:to-red-900/20">
      <Helmet>
        <title>
          🍪 Cookie Policy | Template Market - Chính sách Cookies GDPR
        </title>
        <meta
          name="description"
          content="Chính sách cookies chi tiết của Template Market. Tuân thủ GDPR/CCPA, quản lý preferences, bảo vệ privacy người dùng."
        />
      </Helmet>

      {/* Enhanced Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="container relative z-10 px-4 mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto"
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: 10 }}
              className="flex items-center justify-center w-28 h-28 mx-auto mb-8 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-full shadow-2xl"
            >
              <Cookie className="w-14 h-14 text-white" />
            </motion.div>

            <h1 className="mb-8 text-5xl font-bold md:text-7xl leading-tight">
              <span className="text-transparent bg-gradient-to-r from-orange-600 via-red-600 to-pink-500 bg-clip-text">
                Cookie Policy
              </span>
              <br />
              <span className="text-2xl md:text-3xl font-medium text-muted-foreground">
                Chính sách cookies và quyền riêng tư
              </span>
            </h1>

            <p className="mb-12 text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Hiểu rõ về cookies chúng tôi sử dụng,
              <span className="text-transparent bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text font-semibold">
                {" "}
                quản lý preferences
              </span>
              , và
              <span className="text-transparent bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text font-semibold">
                {" "}
                bảo vệ quyền riêng tư
              </span>
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
              <Badge
                variant="secondary"
                className="px-6 py-3 text-base bg-white/80 backdrop-blur-sm shadow-lg"
              >
                <Shield className="w-5 h-5 mr-3 text-green-600" />
                GDPR Compliant
              </Badge>
              <Badge
                variant="secondary"
                className="px-6 py-3 text-base bg-white/80 backdrop-blur-sm shadow-lg"
              >
                <Globe className="w-5 h-5 mr-3 text-blue-600" />
                International Standards
              </Badge>
              <Badge
                variant="secondary"
                className="px-6 py-3 text-base bg-white/80 backdrop-blur-sm shadow-lg"
              >
                <Calendar className="w-5 h-5 mr-3 text-purple-600" />
                Cập nhật: {lastUpdated}
              </Badge>
              <Badge
                variant="secondary"
                className="px-6 py-3 text-base bg-white/80 backdrop-blur-sm shadow-lg"
              >
                <Clock className="w-5 h-5 mr-3 text-orange-600" />
                Hiệu lực: {effectiveDate}
              </Badge>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {cookieStats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 * index }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
                >
                  <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                  <div className="text-3xl font-bold text-gray-800 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                x: [0, 60, 0],
                y: [0, -40, 0],
                opacity: [0.1, 0.3, 0.1],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 12 + i * 2,
                repeat: Infinity,
                delay: i * 2,
              }}
              className={`absolute w-24 h-24 rounded-full blur-xl mix-blend-multiply ${
                i % 3 === 0
                  ? "bg-orange-300"
                  : i % 3 === 1
                    ? "bg-red-300"
                    : "bg-pink-300"
              }`}
              style={{
                top: `${10 + i * 15}%`,
                left: `${8 + i * 12}%`,
              }}
            />
          ))}
        </div>
      </section>

      <div className="container px-4 pb-20 mx-auto">
        {/* Cookie Consent Banner */}
        <AnimatePresence>
          {showConsentBanner && (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="fixed bottom-0 left-0 right-0 z-50 p-4"
            >
              <Card className="bg-white/95 backdrop-blur-lg border-0 shadow-2xl">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                        <Cookie className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg mb-2">
                          🍪 Chúng tôi sử dụng cookies
                        </h4>
                        <p className="text-muted-foreground text-sm">
                          Để cải thiện trải nghiệm của bạn, chúng tôi sử dụng
                          cookies để phân tích, cá nhân hóa nội dung và quảng
                          cáo. Bạn có thể quản lý preferences bất cứ lúc nào.
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRejectAll}
                      >
                        Từ chối
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveTab("preferences")}
                      >
                        Cài đặt
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleAcceptAll}
                        className="bg-gradient-to-r from-orange-500 to-red-500"
                      >
                        Chấp nhận tất cả
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Tabs */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <Card className="bg-white/80 border-0 shadow-xl">
            <CardContent className="p-6">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-6">
                  <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                  <TabsTrigger value="categories">Loại cookies</TabsTrigger>
                  <TabsTrigger value="preferences">Cài đặt</TabsTrigger>
                  <TabsTrigger value="legal">Pháp lý</TabsTrigger>
                  <TabsTrigger value="guides">Hướng dẫn</TabsTrigger>
                  <TabsTrigger value="faq">FAQ</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="mt-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                  >
                    <div className="text-center">
                      <h2 className="text-3xl font-bold mb-4">
                        🍪 Tổng quan về Cookies
                      </h2>
                      <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        Template Market cam kết minh bạch trong việc sử dụng
                        cookies và bảo vệ quyền riêng tư của bạn
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-0 shadow-lg">
                        <CardContent className="p-8">
                          <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center">
                              <Info className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold">
                              Cookies là gì?
                            </h3>
                          </div>
                          <p className="text-muted-foreground leading-relaxed">
                            Cookies là những file văn bản nhỏ được lưu trữ trên
                            thiết bị của bạn khi truy cập website. Chúng giúp
                            website ghi nhớ thông tin về bạn để cải thiện trải
                            nghiệm sử dụng.
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border-0 shadow-lg">
                        <CardContent className="p-8">
                          <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-400 rounded-xl flex items-center justify-center">
                              <Shield className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold">
                              Bảo mật & Privacy
                            </h3>
                          </div>
                          <p className="text-muted-foreground leading-relaxed">
                            Chúng tôi tuân thủ nghiêm ngặt các quy định GDPR,
                            CCPA và các luật bảo vệ dữ liệu quốc tế. Bạn có toàn
                            quyền kiểm soát cookies trên thiết bị của mình.
                          </p>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-lg">
                        <CardContent className="p-8">
                          <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-400 rounded-xl flex items-center justify-center">
                              <Target className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold">
                              Mục đích sử dụng
                            </h3>
                          </div>
                          <div className="space-y-2 text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span>Duy trì phiên đăng nhập</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span>Ghi nhớ tùy chọn</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span>Phân tích sử dụng</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span>Cải thiện dịch vụ</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-0 shadow-lg">
                        <CardContent className="p-8">
                          <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-400 rounded-xl flex items-center justify-center">
                              <UserCheck className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold">Quyền của bạn</h3>
                          </div>
                          <div className="space-y-2 text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span>Chấp nhận hoặc từ chối</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span>Quản lý preferences</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span>Rút lại đồng ý</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span>Xóa dữ liệu</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </motion.div>
                </TabsContent>

                {/* Categories Tab */}
                <TabsContent value="categories" className="mt-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                  >
                    <div className="text-center">
                      <h2 className="text-3xl font-bold mb-4">
                        📊 Các loại Cookies
                      </h2>
                      <p className="text-xl text-muted-foreground">
                        Chi tiết về từng loại cookie chúng tôi sử dụng
                      </p>
                    </div>

                    {/* Search and Filter */}
                    <Card className="bg-white/60 border-0 shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              placeholder="Tìm kiếm loại cookies..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="pl-10"
                            />
                          </div>
                          <select
                            value={selectedCategory}
                            onChange={(e) =>
                              setSelectedCategory(e.target.value)
                            }
                            className="px-3 py-2 border border-gray-300 rounded-md bg-white"
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

                    {/* Cookie Categories */}
                    <div className="space-y-8">
                      {filteredCategories.map((category, index) => (
                        <motion.div
                          key={category.id}
                          initial={{ opacity: 0, x: -30 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="bg-white/80 border-0 shadow-xl overflow-hidden">
                            <div
                              className={`h-2 bg-gradient-to-r ${category.color}`}
                            />
                            <CardHeader>
                              <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div
                                    className={`p-3 bg-gradient-to-r ${category.color} rounded-xl`}
                                  >
                                    <category.icon className="w-6 h-6 text-white" />
                                  </div>
                                  <div>
                                    <div className="text-xl font-bold">
                                      {category.name}
                                    </div>
                                    <div className="text-sm text-muted-foreground font-normal">
                                      {category.description}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <Badge variant="outline">
                                    {category.count} cookies
                                  </Badge>
                                  {category.required ? (
                                    <Badge className="bg-blue-100 text-blue-800">
                                      Bắt buộc
                                    </Badge>
                                  ) : (
                                    <Badge variant="secondary">Tùy chọn</Badge>
                                  )}
                                </div>
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                              {/* Examples */}
                              <div>
                                <h4 className="font-semibold mb-3">
                                  Ví dụ sử dụng:
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {category.examples.map((example, idx) => (
                                    <Badge
                                      key={idx}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {example}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              {/* Cookie Details Table */}
                              <div>
                                <h4 className="font-semibold mb-3">
                                  Chi tiết cookies:
                                </h4>
                                <div className="overflow-x-auto">
                                  <table className="w-full border-collapse">
                                    <thead>
                                      <tr className="border-b">
                                        <th className="text-left p-3 font-semibold">
                                          Tên
                                        </th>
                                        <th className="text-left p-3 font-semibold">
                                          Mục đích
                                        </th>
                                        <th className="text-left p-3 font-semibold">
                                          Thời gian
                                        </th>
                                        <th className="text-left p-3 font-semibold">
                                          Loại
                                        </th>
                                        <th className="text-left p-3 font-semibold">
                                          Nhà cung cấp
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {category.cookies.map((cookie, idx) => (
                                        <tr
                                          key={idx}
                                          className="border-b hover:bg-gray-50"
                                        >
                                          <td className="p-3 font-mono text-sm">
                                            {cookie.name}
                                          </td>
                                          <td className="p-3 text-sm">
                                            {cookie.purpose}
                                          </td>
                                          <td className="p-3 text-sm">
                                            {cookie.duration}
                                          </td>
                                          <td className="p-3">
                                            <Badge
                                              variant={
                                                cookie.type === "First-party"
                                                  ? "default"
                                                  : "outline"
                                              }
                                              className="text-xs"
                                            >
                                              {cookie.type}
                                            </Badge>
                                          </td>
                                          <td className="p-3 text-sm">
                                            {cookie.provider}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </TabsContent>

                {/* Preferences Tab */}
                <TabsContent value="preferences" className="mt-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                  >
                    <div className="text-center">
                      <h2 className="text-3xl font-bold mb-4">
                        ⚙️ Quản lý Cookie Preferences
                      </h2>
                      <p className="text-xl text-muted-foreground">
                        Kiểm soát hoàn toàn cookies nào được phép trên thiết bị
                        của bạn
                      </p>
                    </div>

                    <Card className="bg-white/80 border-0 shadow-xl">
                      <CardContent className="p-8">
                        <div className="space-y-8">
                          {cookieCategories.map((category, index) => (
                            <motion.div
                              key={category.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border"
                            >
                              <div className="flex items-center gap-4">
                                <div
                                  className={`p-3 bg-gradient-to-r ${category.color} rounded-xl`}
                                >
                                  <category.icon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-lg font-bold">
                                      {category.name}
                                    </h3>
                                    {category.required && (
                                      <Badge className="bg-blue-100 text-blue-800 text-xs">
                                        Bắt buộc
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-muted-foreground text-sm">
                                    {category.description}
                                  </p>
                                  <div className="flex flex-wrap gap-1 mt-2">
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
                              <div className="flex items-center space-x-2">
                                <Switch
                                  checked={
                                    cookiePreferences[
                                      category.id as keyof typeof cookiePreferences
                                    ]
                                  }
                                  onCheckedChange={(checked) =>
                                    handlePreferenceChange(category.id, checked)
                                  }
                                  disabled={category.required}
                                />
                                <Label className="text-sm font-medium">
                                  {cookiePreferences[
                                    category.id as keyof typeof cookiePreferences
                                  ]
                                    ? "Bật"
                                    : "Tắt"}
                                </Label>
                              </div>
                            </motion.div>
                          ))}
                        </div>

                        <Separator className="my-8" />

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                          <Button
                            onClick={handleRejectAll}
                            variant="outline"
                            size="lg"
                          >
                            <XCircle className="w-5 h-5 mr-2" />
                            Từ chối tất cả
                          </Button>
                          <Button
                            onClick={handleSavePreferences}
                            size="lg"
                            className="bg-gradient-to-r from-blue-500 to-purple-600"
                          >
                            <Save className="w-5 h-5 mr-2" />
                            Lưu preferences
                          </Button>
                          <Button
                            onClick={handleAcceptAll}
                            size="lg"
                            className="bg-gradient-to-r from-orange-500 to-red-500"
                          >
                            <CheckCircle className="w-5 h-5 mr-2" />
                            Chấp nhận tất cả
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>

                {/* Legal Tab */}
                <TabsContent value="legal" className="mt-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                  >
                    <div className="text-center">
                      <h2 className="text-3xl font-bold mb-4">
                        ⚖️ Cơ sở pháp lý
                      </h2>
                      <p className="text-xl text-muted-foreground">
                        Template Market tuân thủ các quy định bảo vệ dữ liệu
                        quốc tế
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {legalBasis.map((legal, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ y: -5, scale: 1.02 }}
                        >
                          <Card className="h-full bg-white/80 border-0 shadow-xl">
                            <CardContent className="p-8">
                              <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold">
                                  {legal.title}
                                </h3>
                                <Badge className="bg-green-100 text-green-800">
                                  {legal.compliance} compliant
                                </Badge>
                              </div>
                              <p className="text-muted-foreground mb-6">
                                {legal.description}
                              </p>
                              <div className="space-y-3">
                                <h4 className="font-semibold">
                                  Yêu cầu chính:
                                </h4>
                                {legal.requirements.map((req, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-start gap-2"
                                  >
                                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm text-muted-foreground">
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
                    <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 border-0 shadow-xl">
                      <CardContent className="p-8">
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                          <Database className="w-8 h-8 text-indigo-600" />
                          Chính sách lưu trữ dữ liệu
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="text-center p-6 bg-white/60 rounded-xl">
                            <Clock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                            <h4 className="font-bold mb-2">Session Cookies</h4>
                            <p className="text-sm text-muted-foreground">
                              Tự động xóa khi đóng trình duyệt
                            </p>
                          </div>
                          <div className="text-center p-6 bg-white/60 rounded-xl">
                            <Calendar className="w-12 h-12 text-green-600 mx-auto mb-4" />
                            <h4 className="font-bold mb-2">
                              Persistent Cookies
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Lưu trữ từ 30 ngày đến 2 năm
                            </p>
                          </div>
                          <div className="text-center p-6 bg-white/60 rounded-xl">
                            <Trash2 className="w-12 h-12 text-red-600 mx-auto mb-4" />
                            <h4 className="font-bold mb-2">User Control</h4>
                            <p className="text-sm text-muted-foreground">
                              Bạn có thể xóa bất cứ lúc nào
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>

                {/* Guides Tab */}
                <TabsContent value="guides" className="mt-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                  >
                    <div className="text-center">
                      <h2 className="text-3xl font-bold mb-4">
                        📚 Hướng dẫn quản lý Cookies
                      </h2>
                      <p className="text-xl text-muted-foreground">
                        Cách quản lý cookies trên các trình duyệt phổ biến
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {browserGuides.map((guide, index) => (
                        <motion.div
                          key={guide.name}
                          initial={{
                            opacity: 0,
                            x: index % 2 === 0 ? -30 : 30,
                          }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="h-full bg-white/80 border-0 shadow-xl">
                            <CardHeader>
                              <CardTitle className="flex items-center gap-3">
                                <guide.icon className="w-8 h-8 text-blue-600" />
                                {guide.name}
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                {guide.steps.map((step, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-start gap-3"
                                  >
                                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-bold rounded-full flex items-center justify-center flex-shrink-0">
                                      {idx + 1}
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                      {step}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>

                    {/* Additional Tips */}
                    <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-0 shadow-xl">
                      <CardContent className="p-8">
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                          <Lightbulb className="w-8 h-8 text-green-600" />
                          Tips hữu ích
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <h4 className="font-bold">🔒 Bảo mật cookies:</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                              <li className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                Sử dụng HTTPS khi có thể
                              </li>
                              <li className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                Tránh wifi công cộng cho giao dịch
                              </li>
                              <li className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                Cập nhật trình duyệt thường xuyên
                              </li>
                            </ul>
                          </div>
                          <div className="space-y-4">
                            <h4 className="font-bold">🧹 Dọn dẹp cookies:</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                              <li className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                Xóa cookies định kỳ
                              </li>
                              <li className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                Sử dụng chế độ duyệt ẩn danh
                              </li>
                              <li className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                Kiểm tra permissions website
                              </li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>

                {/* FAQ Tab */}
                <TabsContent value="faq" className="mt-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                  >
                    <div className="text-center">
                      <h2 className="text-3xl font-bold mb-4">
                        ❓ Câu hỏi thường gặp
                      </h2>
                      <p className="text-xl text-muted-foreground">
                        Giải đáp những thắc mắc phổ biến về cookies
                      </p>
                    </div>

                    <Card className="bg-white/80 border-0 shadow-xl">
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
                              className="border border-gray-200 rounded-xl px-6 data-[state=open]:shadow-lg transition-all duration-300"
                            >
                              <AccordionTrigger className="text-left hover:no-underline py-6">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                    {index + 1}
                                  </div>
                                  <span className="text-lg font-semibold">
                                    {faq.question}
                                  </span>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="pb-6">
                                <div className="ml-11 text-muted-foreground leading-relaxed">
                                  {faq.answer}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </CardContent>
                    </Card>

                    {/* Feedback Form */}
                    <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-0 shadow-xl">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                          <MessageSquare className="w-8 h-8 text-purple-600" />
                          💬 Góp ý về Cookie Policy
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-6">
                          Có câu hỏi về cookies hoặc muốn góp ý cải thiện
                          policy? Hãy liên hệ với chúng tôi!
                        </p>
                        {showFeedbackSuccess ? (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-8"
                          >
                            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-green-800 mb-2">
                              Cảm ơn bạn!
                            </h3>
                            <p className="text-green-600">
                              Góp ý của bạn đã được gửi thành công.
                            </p>
                          </motion.div>
                        ) : (
                          <form
                            onSubmit={handleFeedbackSubmit}
                            className="space-y-6"
                          >
                            <div>
                              <Label htmlFor="feedback-email">Email</Label>
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
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="feedback-message">Tin nhắn</Label>
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
                                required
                              />
                            </div>
                            <Button
                              type="submit"
                              className="bg-gradient-to-r from-purple-500 to-pink-600"
                            >
                              <Mail className="w-4 h-4 mr-2" />
                              Gửi góp ý
                            </Button>
                          </form>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.section>

        {/* Contact Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="bg-gradient-to-r from-slate-50 to-orange-50 border-0 shadow-2xl">
            <CardContent className="p-10 text-center">
              <h2 className="text-4xl font-bold mb-4">
                🤝 Cần hỗ trợ về Cookies?
              </h2>
              <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
                Đội ngũ Data Protection Officer của chúng tôi sẵn sàng hỗ trợ
                bạn về mọi vấn đề liên quan đến cookies và quyền riêng tư.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    icon: Mail,
                    title: "📧 Email Privacy",
                    description: "privacy@templatemarket.com",
                    detail: "Hỗ trợ về cookies và privacy",
                    color: "from-blue-500 to-cyan-400",
                  },
                  {
                    icon: MessageSquare,
                    title: "💬 Live Chat",
                    description: "Chat trực tiếp với DPO",
                    detail: "Tư vấn real-time về GDPR",
                    color: "from-green-500 to-emerald-400",
                  },
                  {
                    icon: FileText,
                    title: "📚 Privacy Center",
                    description: "Trung tâm quyền riêng tư",
                    detail: "Tài liệu và tools quản lý data",
                    color: "from-purple-500 to-pink-400",
                  },
                ].map((contact, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -10, scale: 1.05 }}
                  >
                    <Card className="h-full bg-white/80 border-0 shadow-lg hover:shadow-2xl transition-all duration-300">
                      <CardContent className="p-8">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-r ${contact.color} rounded-2xl shadow-xl flex items-center justify-center`}
                        >
                          <contact.icon className="w-8 h-8 text-white" />
                        </motion.div>
                        <h4 className="text-xl font-bold mb-3">
                          {contact.title}
                        </h4>
                        <p className="text-orange-600 font-mono text-sm mb-3">
                          {contact.description}
                        </p>
                        <p className="text-muted-foreground text-sm mb-6">
                          {contact.detail}
                        </p>
                        <Button variant="outline" className="w-full">
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
  );
};

export default CookiePolicy;
