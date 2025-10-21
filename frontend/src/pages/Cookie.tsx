import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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
  Clock,
  Trash2,
  Download,
  Mail,
  MessageSquare,
  FileText,
  Lightbulb,
  Zap,
  Award,
  Calendar,
  ChevronDown,
  ArrowUp,
  Save,
  ExternalLink,
  UserCheck,
  Search,
  Heart,
  Star,
  Sparkles,
  Crown,
  Gift,
  Rocket,
  Code,
  Palette,
  Package,
  BookOpen,
  TrendingUp,
  Lock,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { toast } from "@/hooks/use-toast";

// ============================================
// SOFT PINK THEME
// ============================================
const softPinkTheme = {
  pageBackground: "from-pink-50/70 via-rose-50/60 to-red-50/50",
  primaryGradient: "from-pink-500 via-rose-500 to-red-500",
  heroText: "from-pink-700 via-rose-600 to-red-600",
  accentText: "from-rose-600 via-pink-600 to-red-600",
  glow: "shadow-pink-200/60 shadow-2xl",
  softGlow: "shadow-pink-200/40 shadow-lg",
};

// ============================================
// STAR BACKGROUND SVG PATTERN
// ============================================
const StarBackgroundPattern = () => (
  <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.08 }}>
    <defs>
      <pattern
        id="starPattern"
        x="0"
        y="0"
        width="200"
        height="200"
        patternUnits="userSpaceOnUse"
      >
        <g transform="translate(50, 50)">
          <path
            d="M 0,-30 L 7,-10 L 30,-10 L 12,5 L 19,25 L 0,12 L -19,25 L -12,5 L -30,-10 L -7,-10 Z"
            fill="url(#starGradient1)"
            opacity="0.6"
          />
        </g>

        <g transform="translate(150, 120)">
          <path
            d="M 0,-20 L 5,-7 L 20,-7 L 8,3 L 13,17 L 0,8 L -13,17 L -8,3 L -20,-7 L -5,-7 Z"
            fill="url(#starGradient2)"
            opacity="0.5"
          />
        </g>

        <g transform="translate(30, 150)">
          <path
            d="M 0,-12 L 3,-4 L 12,-4 L 5,2 L 8,10 L 0,5 L -8,10 L -5,2 L -12,-4 L -3,-4 Z"
            fill="url(#starGradient3)"
            opacity="0.4"
          />
        </g>

        <g transform="translate(100, 30)">
          <circle
            cx="0"
            cy="0"
            r="3"
            fill="url(#starGradient4)"
            opacity="0.6"
          />
          <path
            d="M 0,-8 L 1,-2 L 8,0 L 1,2 L 0,8 L -1,2 L -8,0 L -1,-2 Z"
            fill="url(#starGradient4)"
            opacity="0.3"
          />
        </g>

        <g transform="translate(170, 70)">
          <path
            d="M 0,-18 L 4,-6 L 18,-6 L 7,3 L 11,15 L 0,7 L -11,15 L -7,3 L -18,-6 L -4,-6 Z"
            fill="url(#starGradient1)"
            opacity="0.5"
          />
        </g>
      </pattern>

      <linearGradient id="starGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#FDE68A", stopOpacity: 1 }} />
        <stop offset="50%" style={{ stopColor: "#FCA5A5", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#FBCFE8", stopOpacity: 1 }} />
      </linearGradient>

      <linearGradient id="starGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#FBCFE8", stopOpacity: 1 }} />
        <stop offset="50%" style={{ stopColor: "#FCA5A5", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#FECACA", stopOpacity: 1 }} />
      </linearGradient>

      <linearGradient id="starGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#FEF3C7", stopOpacity: 1 }} />
        <stop offset="50%" style={{ stopColor: "#FBCFE8", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#FCA5A5", stopOpacity: 1 }} />
      </linearGradient>

      <linearGradient id="starGradient4" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#FDE68A", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#FBCFE8", stopOpacity: 1 }} />
      </linearGradient>
    </defs>

    <rect width="100%" height="100%" fill="url(#starPattern)" />
  </svg>
);

// ============================================
// ANIMATED FLOATING ICONS
// ============================================
const FloatingIcons = () => {
  const icons = [
    {
      Icon: Cookie,
      color: "from-pink-50 to-rose-100",
      position: "top-10 right-20",
      size: "text-6xl",
    },
    {
      Icon: Shield,
      color: "from-rose-50 to-red-100",
      position: "top-32 left-10",
      size: "text-5xl",
    },
    {
      Icon: Settings,
      color: "from-red-50 to-pink-100",
      position: "bottom-20 right-10",
      size: "text-7xl",
    },
    {
      Icon: Eye,
      color: "from-pink-100 to-rose-50",
      position: "bottom-32 left-20",
      size: "text-6xl",
    },
    {
      Icon: Database,
      color: "from-rose-100 to-pink-50",
      position: "top-1/2 right-1/4",
      size: "text-5xl",
    },
    {
      Icon: Target,
      color: "from-red-50 to-rose-100",
      position: "top-1/3 left-1/3",
      size: "text-6xl",
    },
    {
      Icon: BarChart3,
      color: "from-pink-50 to-red-100",
      position: "bottom-1/3 right-1/3",
      size: "text-5xl",
    },
    {
      Icon: Users,
      color: "from-rose-50 to-pink-100",
      position: "top-2/3 left-1/4",
      size: "text-6xl",
    },
    {
      Icon: Globe,
      color: "from-red-100 to-rose-50",
      position: "top-1/4 right-1/2",
      size: "text-4xl",
    },
    {
      Icon: Heart,
      color: "from-pink-100 to-red-50",
      position: "bottom-1/4 left-1/2",
      size: "text-5xl",
    },
    {
      Icon: Star,
      color: "from-rose-100 to-red-50",
      position: "top-3/4 right-20",
      size: "text-6xl",
    },
    {
      Icon: Sparkles,
      color: "from-pink-50 to-rose-100",
      position: "bottom-40 left-10",
      size: "text-5xl",
    },
    {
      Icon: Crown,
      color: "from-red-50 to-pink-50",
      position: "top-40 right-40",
      size: "text-6xl",
    },
    {
      Icon: Gift,
      color: "from-rose-50 to-red-50",
      position: "bottom-1/2 right-10",
      size: "text-5xl",
    },
    {
      Icon: Rocket,
      color: "from-pink-100 to-rose-100",
      position: "top-1/2 left-10",
      size: "text-6xl",
    },
    {
      Icon: Code,
      color: "from-red-100 to-pink-100",
      position: "bottom-1/4 right-1/4",
      size: "text-5xl",
    },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {icons.map((item, i) => (
        <motion.div
          key={i}
          className={`absolute ${item.position}`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 15, -15, 0],
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            delay: i * 0.8,
            ease: "easeInOut",
          }}
        >
          <motion.div
            className={`p-4 rounded-full bg-gradient-to-r ${item.color} backdrop-blur-sm shadow-lg`}
            whileHover={{ scale: 1.5, rotate: 30 }}
          >
            <item.Icon className="w-full h-full text-pink-300/50" />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};

// Types
interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

interface CookieDetail {
  name: string;
  purpose: string;
  duration: string;
  type: "First-party" | "Third-party";
  provider: string;
}

const CookiePolicy: React.FC = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [cookiePreferences, setCookiePreferences] = useState<CookiePreferences>(
    {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
    },
  );
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showFloatingNav, setShowFloatingNav] = useState(false);

  const { scrollYProgress } = useScroll();
  const headerY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  const lastUpdated = "21 tháng 10, 2025";

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(Math.min(progress, 100));
      setShowFloatingNav(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cookieStats = useMemo(
    () => [
      {
        icon: Cookie,
        value: "12",
        label: "Loại cookies",
        color: "text-pink-600",
      },
      {
        icon: Users,
        value: "2.5M+",
        label: "Người dùng",
        color: "text-rose-600",
      },
      {
        icon: Shield,
        value: "100%",
        label: "GDPR Compliant",
        color: "text-red-600",
      },
      { icon: Globe, value: "195+", label: "Quốc gia", color: "text-pink-700" },
    ],
    [],
  );

  const cookieCategories = useMemo(
    () => [
      {
        id: "necessary" as keyof CookiePreferences,
        name: "Cookies cần thiết",
        description: "Essential cookies cho hoạt động cơ bản của website",
        required: true,
        icon: Settings,
        color: "text-pink-600",
        bgColor: "bg-pink-50",
        count: 4,
        examples: ["Phiên đăng nhập", "Giỏ hàng", "Bảo mật", "Load balancing"],
        cookies: [
          {
            name: "session_id",
            purpose: "Duy trì phiên đăng nhập người dùng",
            duration: "Session",
            type: "First-party" as const,
            provider: "Template Market",
          },
          {
            name: "csrf_token",
            purpose: "Bảo vệ chống CSRF attacks",
            duration: "Session",
            type: "First-party" as const,
            provider: "Template Market",
          },
          {
            name: "cart_items",
            purpose: "Lưu trữ sản phẩm trong giỏ hàng",
            duration: "7 days",
            type: "First-party" as const,
            provider: "Template Market",
          },
          {
            name: "language_pref",
            purpose: "Ghi nhớ ngôn ngữ ưa thích",
            duration: "1 year",
            type: "First-party" as const,
            provider: "Template Market",
          },
        ],
      },
      {
        id: "analytics" as keyof CookiePreferences,
        name: "Cookies phân tích",
        description:
          "Giúp chúng tôi hiểu cách bạn sử dụng website để cải thiện",
        required: false,
        icon: BarChart3,
        color: "text-rose-600",
        bgColor: "bg-rose-50",
        count: 3,
        examples: [
          "Google Analytics",
          "Heatmaps",
          "User recordings",
          "A/B testing",
        ],
        cookies: [
          {
            name: "_ga",
            purpose: "Phân biệt người dùng duy nhất",
            duration: "2 years",
            type: "Third-party" as const,
            provider: "Google Analytics",
          },
          {
            name: "_gid",
            purpose: "Phân biệt người dùng trong 24h",
            duration: "24 hours",
            type: "Third-party" as const,
            provider: "Google Analytics",
          },
          {
            name: "_gat",
            purpose: "Throttle request rate",
            duration: "1 minute",
            type: "Third-party" as const,
            provider: "Google Analytics",
          },
        ],
      },
      {
        id: "marketing" as keyof CookiePreferences,
        name: "Cookies marketing",
        description: "Để hiển thị quảng cáo phù hợp với sở thích của bạn",
        required: false,
        icon: Target,
        color: "text-red-600",
        bgColor: "bg-red-50",
        count: 5,
        examples: [
          "Facebook Pixel",
          "Google Ads",
          "Retargeting",
          "Attribution",
        ],
        cookies: [
          {
            name: "_fbp",
            purpose: "Facebook Pixel tracking",
            duration: "3 months",
            type: "Third-party" as const,
            provider: "Facebook",
          },
          {
            name: "IDE",
            purpose: "Google DoubleClick advertising",
            duration: "1 year",
            type: "Third-party" as const,
            provider: "Google",
          },
          {
            name: "test_cookie",
            purpose: "Check if browser supports cookies",
            duration: "15 minutes",
            type: "Third-party" as const,
            provider: "Google",
          },
        ],
      },
      {
        id: "functional" as keyof CookiePreferences,
        name: "Cookies tính năng",
        description: "Cải thiện trải nghiệm với các tính năng nâng cao",
        required: false,
        icon: Zap,
        color: "text-pink-700",
        bgColor: "bg-pink-50",
        count: 2,
        examples: [
          "Chat widget",
          "Video player",
          "Interactive maps",
          "Social sharing",
        ],
        cookies: [
          {
            name: "chat_widget",
            purpose: "Lưu trữ cài đặt chat support",
            duration: "6 months",
            type: "Third-party" as const,
            provider: "LiveChat",
          },
          {
            name: "video_quality",
            purpose: "Ghi nhớ chất lượng video ưa thích",
            duration: "1 year",
            type: "First-party" as const,
            provider: "Template Market",
          },
        ],
      },
    ],
    [],
  );

  const faqs = useMemo(
    () => [
      {
        id: "what",
        question: "Cookies là gì?",
        answer:
          "Cookies là những file văn bản nhỏ được lưu trữ trên thiết bị của bạn (máy tính, điện thoại, tablet) khi bạn truy cập website. Chúng giúp website ghi nhớ thông tin về chuyến thăm của bạn, như tùy chọn ngôn ngữ, đăng nhập, giỏ hàng và các preferences khác.",
        icon: HelpCircle,
      },
      {
        id: "why",
        question: "Tại sao sử dụng cookies?",
        answer:
          "Chúng tôi sử dụng cookies để: (1) Duy trì phiên đăng nhập an toàn, (2) Ghi nhớ tùy chọn và preferences của bạn, (3) Phân tích cách bạn sử dụng website để cải thiện, (4) Cung cấp nội dung và quảng cáo phù hợp, (5) Đảm bảo website hoạt động hiệu quả.",
        icon: Lightbulb,
      },
      {
        id: "types",
        question: "Có những loại cookies nào?",
        answer:
          "Có 4 loại chính: (1) Necessary cookies - cần thiết cho website hoạt động, (2) Analytics cookies - phân tích hành vi người dùng, (3) Marketing cookies - hiển thị quảng cáo phù hợp, (4) Functional cookies - cải thiện trải nghiệm với các tính năng nâng cao.",
        icon: Package,
      },
      {
        id: "manage",
        question: "Làm sao quản lý cookies?",
        answer:
          "Bạn có thể quản lý cookies qua: (1) Cookie Settings trên website này, (2) Cài đặt trình duyệt (Chrome, Firefox, Safari, Edge), (3) Browser extensions như Privacy Badger, (4) Xóa cookies trong browser history. Lưu ý: Tắt cookies có thể ảnh hưởng một số tính năng.",
        icon: Settings,
      },
      {
        id: "thirdparty",
        question: "Third-party cookies là gì?",
        answer:
          "Third-party cookies được đặt bởi domains khác với website bạn đang truy cập (ví dụ: Google Analytics, Facebook Pixel). Chúng thường dùng cho quảng cáo và tracking xuyên websites. First-party cookies chỉ từ domain bạn đang truy cập.",
        icon: ExternalLink,
      },
      {
        id: "security",
        question: "Cookies có an toàn không?",
        answer:
          "Cookies tự chúng không phải là virus hoặc malware. Chúng chỉ lưu trữ text data. Tuy nhiên, chúng có thể theo dõi hoạt động browsing. Chúng tôi chỉ sử dụng cookies từ providers uy tín và tuân thủ GDPR/CCPA để bảo vệ privacy của bạn.",
        icon: Lock,
      },
      {
        id: "delete",
        question: "Xóa cookies như thế nào?",
        answer:
          "Trong browser: (1) Chrome: Settings > Privacy > Clear browsing data, (2) Firefox: Options > Privacy > Clear Data, (3) Safari: Preferences > Privacy > Manage Website Data, (4) Edge: Settings > Privacy > Choose what to clear. Hoặc dùng Ctrl+Shift+Del shortcut.",
        icon: Trash2,
      },
      {
        id: "gdpr",
        question: "Cookies và GDPR?",
        answer:
          "Theo GDPR, websites phải: (1) Xin phép trước khi đặt non-essential cookies, (2) Giải thích rõ mục đích sử dụng, (3) Cho phép người dùng từ chối, (4) Cho phép rút lại consent bất cứ lúc nào. Chúng tôi tuân thủ 100% quy định này.",
        icon: Shield,
      },
    ],
    [],
  );

  const handlePreferenceChange = useCallback(
    (category: keyof CookiePreferences, enabled: boolean) => {
      setCookiePreferences((prev) => ({ ...prev, [category]: enabled }));
    },
    [],
  );

  const handleSavePreferences = useCallback(() => {
    localStorage.setItem(
      "cookiePreferences",
      JSON.stringify(cookiePreferences),
    );
    toast({
      title: "Đã lưu preferences!",
      description: "Cài đặt cookie đã được cập nhật thành công.",
    });
  }, [cookiePreferences]);

  const handleAcceptAll = useCallback(() => {
    const allEnabled: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
    };
    setCookiePreferences(allEnabled);
    localStorage.setItem("cookiePreferences", JSON.stringify(allEnabled));
    toast({ title: "Đã chấp nhận tất cả cookies!" });
  }, []);

  const handleRejectAll = useCallback(() => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
    };
    setCookiePreferences(onlyNecessary);
    localStorage.setItem("cookiePreferences", JSON.stringify(onlyNecessary));
    toast({ title: "Chỉ giữ cookies cần thiết!" });
  }, []);

  const ReadingProgress: React.FC = () => (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
      <motion.div
        className={`h-full bg-gradient-to-r ${softPinkTheme.primaryGradient}`}
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );

  const FloatingNav: React.FC = () => (
    <AnimatePresence>
      {showFloatingNav && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-8 right-8 z-40"
        >
          <Card className="bg-white/80 backdrop-blur-lg border border-gray-200/50 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Button
                  size="sm"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                  className={`bg-gradient-to-r ${softPinkTheme.primaryGradient} text-white`}
                >
                  <ArrowUp className="w-4 h-4" />
                </Button>
                <Progress value={scrollProgress} className="w-20" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );

  useEffect(() => {
    const saved = localStorage.getItem("cookiePreferences");
    if (saved) {
      setCookiePreferences(JSON.parse(saved));
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Cookie Policy | Template Market - GDPR Compliant</title>
        <meta
          name="description"
          content="Chính sách cookies chi tiết của Template Market. Tuân thủ GDPR/CCPA, quản lý preferences, bảo vệ privacy người dùng."
        />
        <meta
          name="keywords"
          content="cookie policy, GDPR, privacy, cookies, template market"
        />
        <link rel="canonical" href="https://templatemarket.com/cookie-policy" />
      </Helmet>

      <ReadingProgress />
      <FloatingNav />

      <div
        className={`min-h-screen bg-gradient-to-br ${softPinkTheme.pageBackground} overflow-hidden relative`}
      >
        <div className="fixed inset-0 z-0">
          <StarBackgroundPattern />
        </div>
        <FloatingIcons />

        {/* HERO SECTION */}
        <motion.section
          className="relative py-20 lg:py-32 overflow-hidden z-10"
          style={{ y: headerY, opacity: headerOpacity }}
        >
          <div className="container relative z-10 px-4 mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-5xl mx-auto"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className={`flex items-center justify-center w-28 h-28 mx-auto mb-8 bg-gradient-to-r ${softPinkTheme.primaryGradient} rounded-3xl ${softPinkTheme.glow}`}
              >
                <Cookie className="w-14 h-14 text-white" />
              </motion.div>

              <h1 className="mb-8 text-4xl lg:text-6xl font-bold">
                <span
                  className={`text-transparent bg-gradient-to-r ${softPinkTheme.heroText} bg-clip-text`}
                >
                  Cookie Policy
                </span>
                <br />
                <span className="text-2xl lg:text-3xl font-medium text-gray-700">
                  Quản lý cookies và quyền riêng tư
                </span>
              </h1>

              <p className="mb-12 text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto">
                Hiểu rõ về cookies, quản lý preferences và bảo vệ quyền riêng tư
                của bạn
              </p>

              {/* BADGES */}
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-white/40 backdrop-blur-md rounded-full border border-white/60 shadow-lg"
                >
                  <Clock className="w-5 h-5 text-pink-600" />
                  <span className="font-semibold text-gray-800">
                    {lastUpdated}
                  </span>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-white/40 backdrop-blur-md rounded-full border border-white/60 shadow-lg"
                >
                  <Shield className="w-5 h-5 text-rose-600" />
                  <span className="font-semibold text-gray-800">
                    GDPR Compliant
                  </span>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-white/40 backdrop-blur-md rounded-full border border-white/60 shadow-lg"
                >
                  <Award className="w-5 h-5 text-red-600" />
                  <span className="font-semibold text-gray-800">
                    ISO Certified
                  </span>
                </motion.div>
              </div>

              {/* STATS */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {cookieStats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    whileHover={{ y: -10, scale: 1.05 }}
                    className="bg-white/60 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/60"
                  >
                    <stat.icon
                      className={`w-8 h-8 mx-auto mb-3 ${stat.color}`}
                    />
                    <div
                      className={`text-3xl font-bold mb-2 text-transparent bg-gradient-to-r ${softPinkTheme.heroText} bg-clip-text`}
                    >
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* MAIN CONTENT */}
        <div className="container relative z-10 px-4 mx-auto max-w-6xl pb-20">
          {/* COOKIE PREFERENCES */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <Card className="bg-white/60 backdrop-blur-xl border border-white/60 shadow-lg">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                  <Cookie className="w-8 h-8 text-pink-600" />
                  Quản lý Cookie Preferences
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Kiểm soát cookies nào được phép trên thiết bị của bạn
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {cookieCategories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-6 ${category.bgColor} rounded-xl`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div
                          className={`w-12 h-12 ${category.bgColor} rounded-xl flex items-center justify-center`}
                        >
                          <category.icon
                            className={`w-6 h-6 ${category.color}`}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold text-gray-800">
                              {category.name}
                            </h3>
                            {category.required && (
                              <Badge className="bg-pink-100 text-pink-800 text-xs">
                                Bắt buộc
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {category.count} cookies
                            </Badge>
                          </div>
                          <p className="text-gray-600 text-sm">
                            {category.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={cookiePreferences[category.id]}
                          onCheckedChange={(checked) =>
                            handlePreferenceChange(category.id, checked)
                          }
                          disabled={category.required}
                        />
                        <Label className="text-sm font-medium">
                          {cookiePreferences[category.id] ? "Bật" : "Tắt"}
                        </Label>
                      </div>
                    </div>

                    {/* Examples */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">
                        Ví dụ:
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
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-white/50">
                          <tr>
                            <th className="text-left p-2 font-semibold">
                              Cookie Name
                            </th>
                            <th className="text-left p-2 font-semibold">
                              Purpose
                            </th>
                            <th className="text-left p-2 font-semibold">
                              Duration
                            </th>
                            <th className="text-left p-2 font-semibold">
                              Type
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {category.cookies.map((cookie, idx) => (
                            <tr key={idx} className="border-t border-white/50">
                              <td className="p-2 font-mono text-xs">
                                {cookie.name}
                              </td>
                              <td className="p-2 text-xs">{cookie.purpose}</td>
                              <td className="p-2 text-xs">{cookie.duration}</td>
                              <td className="p-2">
                                <Badge variant="outline" className="text-xs">
                                  {cookie.type}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                ))}

                <Separator className="my-8" />

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={handleRejectAll}
                    variant="outline"
                    size="lg"
                    className="hover:bg-rose-50"
                  >
                    <XCircle className="w-5 h-5 mr-2" />
                    Từ chối tất cả
                  </Button>
                  <Button
                    onClick={handleSavePreferences}
                    size="lg"
                    className={`bg-gradient-to-r ${softPinkTheme.primaryGradient} text-white`}
                  >
                    <Save className="w-5 h-5 mr-2" />
                    Lưu preferences
                  </Button>
                  <Button
                    onClick={handleAcceptAll}
                    size="lg"
                    className="bg-gradient-to-r from-pink-300 via-rose-400 to-pink-500 text-white"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Chấp nhận tất cả
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* FAQ SECTION */}
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <Card className="bg-white/60 backdrop-blur-xl border border-white/60 shadow-lg">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                  <HelpCircle className="w-8 h-8 text-pink-600" />
                  Câu hỏi thường gặp
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Giải đáp các thắc mắc phổ biến về cookies
                </p>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="space-y-4">
                  {faqs.map((faq, index) => (
                    <AccordionItem
                      key={faq.id}
                      value={faq.id}
                      className="border border-pink-200 rounded-xl px-6"
                    >
                      <AccordionTrigger className="hover:no-underline py-6">
                        <div className="flex items-center gap-3 text-left">
                          <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <faq.icon className="w-5 h-5 text-pink-600" />
                          </div>
                          <span className="text-lg font-semibold text-gray-800">
                            {faq.question}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-6">
                        <div className="ml-13 text-gray-600 leading-relaxed">
                          {faq.answer}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </motion.section>

          {/* CONTACT */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="bg-white/60 backdrop-blur-xl border border-white/60 shadow-lg">
              <CardContent className="p-10 text-center">
                <h2 className="text-4xl font-bold mb-4 text-gray-800">
                  Cần hỗ trợ về Cookies?
                </h2>
                <p className="text-xl text-gray-600 mb-12">
                  Liên hệ với đội ngũ Privacy & Data Protection
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      icon: Mail,
                      title: "Email Privacy",
                      value: "privacy@templatemarket.com",
                    },
                    {
                      icon: MessageSquare,
                      title: "Live Chat",
                      value: "Chat với DPO",
                    },
                    {
                      icon: FileText,
                      title: "Privacy Center",
                      value: "Trung tâm quyền riêng tư",
                    },
                  ].map((contact, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ y: -8 }}
                      className="p-6 bg-white/80 rounded-xl border border-pink-200 shadow-md"
                    >
                      <div className="w-16 h-16 mx-auto mb-4 bg-pink-100 rounded-xl flex items-center justify-center">
                        <contact.icon className="w-8 h-8 text-pink-600" />
                      </div>
                      <h4 className="text-lg font-bold mb-2 text-gray-800">
                        {contact.title}
                      </h4>
                      <p className="text-pink-600 text-sm">{contact.value}</p>
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
