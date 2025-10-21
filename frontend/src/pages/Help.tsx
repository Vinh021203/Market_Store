import React, { useState, useCallback, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Search,
  BookOpen,
  Video,
  FileText,
  MessageSquare,
  HelpCircle,
  Lightbulb,
  Wrench,
  Download,
  Code,
  Palette,
  Settings,
  Zap,
  Shield,
  Globe,
  Users,
  Star,
  Heart,
  Sparkles,
  Crown,
  Gift,
  Rocket,
  Eye,
  Target,
  ArrowRight,
  ArrowUp,
  Award,
  CheckCircle,
  AlertCircle,
  Info,
  ExternalLink,
  Play,
  Clock,
  TrendingUp,
  Package,
  Database,
  Terminal,
  Layers,
  Box,
  GitBranch,
  Book,
  GraduationCap,
  Headphones,
  Mail,
  Phone,
  MessageCircle,
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
  secondaryGradient: "from-rose-400 via-pink-500 to-red-400",
  heroText: "from-pink-700 via-rose-600 to-red-600",
  accentText: "from-rose-600 via-pink-600 to-red-600",
  glow: "shadow-pink-200/60 shadow-2xl",
  softGlow: "shadow-pink-200/40 shadow-lg",
};

// ============================================
// STAR BACKGROUND PATTERN
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
// FLOATING ICONS
// ============================================
const FloatingIcons = () => {
  const icons = [
    {
      Icon: BookOpen,
      color: "from-pink-50 to-rose-100",
      position: "top-10 right-20",
    },
    {
      Icon: HelpCircle,
      color: "from-rose-50 to-red-100",
      position: "top-32 left-10",
    },
    {
      Icon: Video,
      color: "from-red-50 to-pink-100",
      position: "bottom-20 right-10",
    },
    {
      Icon: Lightbulb,
      color: "from-pink-100 to-rose-50",
      position: "bottom-32 left-20",
    },
    {
      Icon: Code,
      color: "from-rose-100 to-pink-50",
      position: "top-1/2 right-1/4",
    },
    {
      Icon: Wrench,
      color: "from-red-50 to-rose-100",
      position: "top-1/3 left-1/3",
    },
    {
      Icon: Rocket,
      color: "from-pink-50 to-red-100",
      position: "bottom-1/3 right-1/3",
    },
    {
      Icon: Star,
      color: "from-rose-50 to-pink-100",
      position: "top-2/3 left-1/4",
    },
    {
      Icon: Heart,
      color: "from-red-100 to-rose-50",
      position: "top-1/4 right-1/2",
    },
    {
      Icon: Sparkles,
      color: "from-pink-100 to-red-50",
      position: "bottom-1/4 left-1/2",
    },
    {
      Icon: Crown,
      color: "from-rose-100 to-red-50",
      position: "top-3/4 right-20",
    },
    {
      Icon: Gift,
      color: "from-pink-50 to-rose-100",
      position: "bottom-40 left-10",
    },
    {
      Icon: Target,
      color: "from-red-50 to-pink-50",
      position: "top-40 right-40",
    },
    {
      Icon: Zap,
      color: "from-rose-50 to-red-50",
      position: "bottom-1/2 right-10",
    },
    {
      Icon: Award,
      color: "from-pink-100 to-rose-100",
      position: "top-1/2 left-10",
    },
    {
      Icon: Globe,
      color: "from-red-100 to-pink-100",
      position: "bottom-1/4 right-1/4",
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
            <item.Icon className="w-8 h-8 text-pink-300/50" />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
const Help: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFloatingNav, setShowFloatingNav] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const { scrollYProgress } = useScroll();
  const headerY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  React.useEffect(() => {
    const handleScroll = () => {
      setShowFloatingNav(window.scrollY > 500);
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(Math.min(progress, 100));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const stats = [
    {
      icon: FileText,
      value: "500+",
      label: "Bài viết",
      color: "text-pink-600",
    },
    {
      icon: Video,
      value: "150+",
      label: "Video tutorials",
      color: "text-rose-600",
    },
    { icon: Users, value: "50K+", label: "Thành viên", color: "text-red-600" },
    {
      icon: MessageSquare,
      value: "24/7",
      label: "Hỗ trợ",
      color: "text-pink-700",
    },
  ];

  const popularTopics = [
    {
      icon: Rocket,
      title: "Bắt đầu nhanh",
      description: "Hướng dẫn cài đặt và setup ban đầu",
      articles: 25,
      color: "from-pink-500 to-rose-500",
      link: "#getting-started",
    },
    {
      icon: Download,
      title: "Tải xuống & Cài đặt",
      description: "Download templates và cài đặt local",
      articles: 18,
      color: "from-rose-500 to-red-500",
      link: "#installation",
    },
    {
      icon: Palette,
      title: "Tùy chỉnh & Styling",
      description: "Customize colors, fonts, layouts",
      articles: 32,
      color: "from-red-500 to-pink-500",
      link: "#customization",
    },
    {
      icon: Code,
      title: "Lập trình",
      description: "Code examples, APIs, integration",
      articles: 45,
      color: "from-pink-600 to-rose-600",
      link: "#development",
    },
    {
      icon: Wrench,
      title: "Troubleshooting",
      description: "Giải quyết các vấn đề thường gặp",
      articles: 28,
      color: "from-rose-600 to-red-600",
      link: "#troubleshooting",
    },
    {
      icon: Shield,
      title: "Bảo mật",
      description: "Security best practices & guidelines",
      articles: 15,
      color: "from-red-600 to-pink-600",
      link: "#security",
    },
  ];

  const videoTutorials = [
    {
      id: 1,
      title: "Getting Started với Template Market",
      description:
        "Video giới thiệu toàn diện về platform và các tính năng chính",
      duration: "15:30",
      views: "25K",
      thumbnail:
        "https://via.placeholder.com/400x225/ec4899/ffffff?text=Getting+Started",
      level: "Beginner",
    },
    {
      id: 2,
      title: "Cài đặt Template trong 10 phút",
      description: "Hướng dẫn chi tiết từng bước cài đặt template từ đầu",
      duration: "10:45",
      views: "18K",
      thumbnail:
        "https://via.placeholder.com/400x225/f43f5e/ffffff?text=Installation",
      level: "Beginner",
    },
    {
      id: 3,
      title: "Customize Colors & Themes",
      description: "Học cách thay đổi màu sắc, font chữ và theme",
      duration: "20:15",
      views: "32K",
      thumbnail:
        "https://via.placeholder.com/400x225/fb7185/ffffff?text=Customization",
      level: "Intermediate",
    },
    {
      id: 4,
      title: "Advanced Component Development",
      description: "Xây dựng components phức tạp và tái sử dụng",
      duration: "35:20",
      views: "15K",
      thumbnail:
        "https://via.placeholder.com/400x225/f472b6/ffffff?text=Advanced",
      level: "Advanced",
    },
  ];

  const gettingStartedGuides = [
    {
      icon: Download,
      title: "Tải xuống template",
      description: "Hướng dẫn tải và extract template files",
      time: "5 phút",
      difficulty: "Dễ",
    },
    {
      icon: Terminal,
      title: "Cài đặt dependencies",
      description: "Install Node.js, npm packages và setup môi trường",
      time: "10 phút",
      difficulty: "Dễ",
    },
    {
      icon: Settings,
      title: "Cấu hình project",
      description: "Config environment variables và settings",
      time: "8 phút",
      difficulty: "Trung bình",
    },
    {
      icon: Rocket,
      title: "Chạy development server",
      description: "Start local dev server và xem live preview",
      time: "3 phút",
      difficulty: "Dễ",
    },
    {
      icon: Palette,
      title: "Customize giao diện",
      description: "Thay đổi colors, fonts, logos theo brand",
      time: "15 phút",
      difficulty: "Trung bình",
    },
    {
      icon: Package,
      title: "Build & Deploy",
      description: "Production build và deploy lên hosting",
      time: "12 phút",
      difficulty: "Trung bình",
    },
  ];

  const faqs = [
    {
      category: "Chung",
      questions: [
        {
          q: "Template Market là gì?",
          a: "Template Market là marketplace lớn nhất Việt Nam cung cấp các template website, UI kits, themes chất lượng cao cho developers và designers. Chúng tôi có hơn 5000+ templates cho mọi nhu cầu từ landing pages, admin dashboards, e-commerce đến mobile apps.",
        },
        {
          q: "Tôi cần kiến thức gì để sử dụng templates?",
          a: "Tùy vào template, bạn có thể cần: HTML/CSS cơ bản cho static templates, JavaScript/React/Vue cho modern frameworks, hoặc WordPress/PHP cho CMS themes. Mỗi template có requirements chi tiết trong documentation.",
        },
        {
          q: "Có hỗ trợ bản quyền commercial không?",
          a: "Có! Tất cả templates đều có commercial license. Bạn có thể sử dụng cho unlimited projects, client work, SaaS products. License đi kèm với mỗi purchase và không có phí thêm.",
        },
      ],
    },
    {
      category: "Tải xuống & Cài đặt",
      questions: [
        {
          q: "Làm sao để tải template sau khi mua?",
          a: "Sau khi thanh toán thành công, vào Dashboard > My Purchases, click Download button bên cạnh template. File zip sẽ được tải về máy. Link download có hiệu lực 30 ngày và unlimited downloads.",
        },
        {
          q: "Template bao gồm những file gì?",
          a: "Mỗi template bao gồm: Source code đầy đủ, Assets (images, icons, fonts), Documentation PDF/HTML, License file. Một số templates premium còn có PSD/Figma design files và video tutorials.",
        },
        {
          q: "Cần tools gì để chạy template?",
          a: "Thông thường cần: Text editor (VS Code, Sublime), Node.js & npm (cho React/Vue templates), Git (optional), Browser hiện đại. Specific requirements được list trong readme file.",
        },
      ],
    },
    {
      category: "Customization",
      questions: [
        {
          q: "Làm sao để thay đổi màu sắc?",
          a: "Hầu hết templates sử dụng CSS variables hoặc SASS variables. Tìm file colors.css hoặc _variables.scss, thay đổi color values theo brand của bạn. Một số templates có built-in theme customizer trong admin panel.",
        },
        {
          q: "Có thể thêm trang mới không?",
          a: "Có! Clone existing page file, rename, modify content. Nhớ update routing (React Router, Vue Router) và navigation menu. Documentation có hướng dẫn chi tiết về folder structure và naming conventions.",
        },
        {
          q: "Làm sao để thay logo và favicon?",
          a: "Logo thường ở /public/images/logo.png hoặc /assets/images/. Thay file giữ nguyên tên hoặc update path trong header component. Favicon ở /public/favicon.ico, replace với icon 16x16 hoặc 32x32 pixels.",
        },
      ],
    },
    {
      category: "Troubleshooting",
      questions: [
        {
          q: "Template không chạy sau khi cài đặt?",
          a: "Thử: (1) Kiểm tra Node version (cần >= 14), (2) Xóa node_modules và package-lock.json, chạy npm install lại, (3) Check console logs cho errors, (4) Verify port 3000 không bị conflict. Nếu vẫn lỗi, contact support với error logs.",
        },
        {
          q: "Build production bị lỗi?",
          a: "Common issues: (1) Environment variables chưa set, (2) Image paths không đúng, (3) Dependencies version conflicts. Run npm run build --verbose để see detailed errors. Check build logs và fix theo error messages.",
        },
        {
          q: "Responsive layout bị lỗi trên mobile?",
          a: "Kiểm tra: (1) Viewport meta tag trong HTML, (2) CSS media queries, (3) Flex/Grid layouts, (4) Image max-width settings. Test với browser DevTools responsive mode. Một số components cần thêm mobile-specific styles.",
        },
      ],
    },
  ];

  const docsCategories = [
    {
      icon: Rocket,
      title: "Getting Started",
      description: "Quick start guides và tutorials",
      articles: [
        "Giới thiệu Template Market",
        "Cài đặt môi trường dev",
        "First project setup",
        "Understanding folder structure",
        "Configuration files explained",
      ],
    },
    {
      icon: Palette,
      title: "Customization",
      description: "Tùy chỉnh theme và components",
      articles: [
        "Thay đổi colors và typography",
        "Custom logo và branding",
        "Layout modifications",
        "Component styling guide",
        "Theme variants setup",
      ],
    },
    {
      icon: Code,
      title: "Development",
      description: "Coding guidelines và best practices",
      articles: [
        "Component architecture",
        "State management patterns",
        "API integration guide",
        "Form handling & validation",
        "Routing & navigation",
      ],
    },
    {
      icon: Package,
      title: "Deployment",
      description: "Build và deploy production",
      articles: [
        "Production build process",
        "Environment variables setup",
        "Deploy to Vercel/Netlify",
        "CDN configuration",
        "Performance optimization",
      ],
    },
  ];

  const communityResources = [
    {
      icon: MessageCircle,
      title: "Community Forum",
      description: "Thảo luận với 50K+ developers",
      members: "50,234",
      posts: "125K+",
      color: "from-pink-500 to-rose-500",
    },
    {
      icon: Users,
      title: "Discord Server",
      description: "Real-time chat và support",
      members: "25,891",
      posts: "Active 24/7",
      color: "from-rose-500 to-red-500",
    },
    {
      icon: Video,
      title: "YouTube Channel",
      description: "Video tutorials và walkthroughs",
      members: "234K",
      posts: "500+ videos",
      color: "from-red-500 to-pink-500",
    },
    {
      icon: BookOpen,
      title: "Blog",
      description: "Tips, tricks và best practices",
      members: "Weekly",
      posts: "250+ articles",
      color: "from-pink-600 to-rose-600",
    },
  ];

  const handleSearch = useCallback(() => {
    if (searchTerm.trim()) {
      toast({
        title: "Đang tìm kiếm...",
        description: `Tìm kiếm cho: "${searchTerm}"`,
      });
    }
  }, [searchTerm]);

  const ReadingProgress = () => (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
      <motion.div
        className={`h-full bg-gradient-to-r ${softPinkTheme.primaryGradient}`}
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );

  const FloatingNav = () => (
    <AnimatePresence>
      {showFloatingNav && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-8 right-8 z-40"
        >
          <Button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className={`bg-gradient-to-r ${softPinkTheme.primaryGradient} text-white w-12 h-12 rounded-full`}
          >
            <ArrowUp className="w-5 h-5" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <Helmet>
        <title>Trung tâm trợ giúp | Template Market - Tài liệu & Hỗ trợ</title>
        <meta
          name="description"
          content="Trung tâm trợ giúp Template Market. 500+ bài viết, 150+ video tutorials, FAQs, troubleshooting guides. Hỗ trợ 24/7."
        />
        <meta
          name="keywords"
          content="help center, support, documentation, tutorials, faq, template market, guides"
        />
        <link rel="canonical" href="https://templatemarket.com/help" />
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

        {/* HERO */}
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
                <HelpCircle className="w-14 h-14 text-white" />
              </motion.div>

              <h1 className="mb-8 text-5xl lg:text-7xl font-bold">
                <span
                  className={`text-transparent bg-gradient-to-r ${softPinkTheme.heroText} bg-clip-text`}
                >
                  Trung tâm trợ giúp
                </span>
                <br />
                <span className="text-2xl lg:text-3xl font-medium text-gray-700">
                  Chúng tôi ở đây để giúp bạn
                </span>
              </h1>

              <p className="mb-12 text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto">
                Tìm câu trả lời, tutorials, guides và mọi thứ bạn cần để thành
                công
              </p>

              {/* SEARCH */}
              <div className="max-w-3xl mx-auto mb-12">
                <div className="relative">
                  <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Tìm kiếm bài viết, tutorials, FAQs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    className="pl-16 pr-32 py-6 text-lg rounded-2xl border-2 border-gray-200 focus:border-pink-500"
                  />
                  <Button
                    onClick={handleSearch}
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r ${softPinkTheme.primaryGradient} text-white px-6`}
                  >
                    Tìm kiếm
                  </Button>
                </div>
              </div>

              {/* STATS */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
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
        <div className="container relative z-10 px-4 mx-auto max-w-7xl pb-20">
          {/* POPULAR TOPICS */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-800">
                Chủ đề phổ biến
              </h2>
              <p className="text-xl text-gray-600">
                Các tài liệu được tìm kiếm nhiều nhất
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {popularTopics.map((topic, index) => (
                <motion.a
                  key={index}
                  href={topic.link}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.03 }}
                  className="block"
                >
                  <Card className="h-full bg-white/60 backdrop-blur-xl border border-white/60 shadow-lg hover:shadow-xl transition-all">
                    <CardContent className="p-6">
                      <div
                        className={`w-14 h-14 rounded-xl bg-gradient-to-r ${topic.color} flex items-center justify-center mb-4`}
                      >
                        <topic.icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-gray-800">
                        {topic.title}
                      </h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {topic.description}
                      </p>
                      <Badge
                        variant="outline"
                        className="bg-pink-100 text-pink-700"
                      >
                        {topic.articles} bài viết
                      </Badge>
                    </CardContent>
                  </Card>
                </motion.a>
              ))}
            </div>
          </motion.section>

          {/* VIDEO TUTORIALS */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-800">
                Video Tutorials
              </h2>
              <p className="text-xl text-gray-600">
                Học qua video hướng dẫn chi tiết
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {videoTutorials.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <Card className="bg-white/60 backdrop-blur-xl border border-white/60 shadow-lg overflow-hidden group">
                    <div className="relative">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-56 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Play className="w-8 h-8 text-pink-600 ml-1" />
                        </div>
                      </div>
                      <Badge className="absolute top-4 right-4 bg-black/70 text-white">
                        {video.duration}
                      </Badge>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            video.level === "Beginner"
                              ? "bg-green-100 text-green-700"
                              : video.level === "Intermediate"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {video.level}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="text-xs bg-gray-100 text-gray-700"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          {video.views} views
                        </Badge>
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-gray-800">
                        {video.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {video.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* GETTING STARTED */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <Card className="bg-white/60 backdrop-blur-xl border border-white/60 shadow-lg">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                  <Rocket className="w-8 h-8 text-pink-600" />
                  Getting Started Guide
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  6 bước để bắt đầu với template của bạn
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {gettingStartedGuides.map((guide, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                      className="p-6 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl border border-pink-200 cursor-pointer"
                    >
                      <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4">
                        <guide.icon className="w-6 h-6 text-pink-600" />
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="text-xs bg-pink-600 text-white">
                          Bước {index + 1}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {guide.time}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            guide.difficulty === "Dễ"
                              ? "bg-green-100 text-green-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {guide.difficulty}
                        </Badge>
                      </div>
                      <h3 className="font-bold text-gray-800 mb-2">
                        {guide.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {guide.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* DOCUMENTATION */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-800">
                Documentation
              </h2>
              <p className="text-xl text-gray-600">
                Tài liệu kỹ thuật chi tiết
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {docsCategories.map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <Card className="h-full bg-white/60 backdrop-blur-xl border border-white/60 shadow-lg hover:shadow-xl transition-all">
                    <CardContent className="p-6">
                      <category.icon className="w-10 h-10 text-pink-600 mb-4" />
                      <h3 className="text-xl font-bold mb-2 text-gray-800">
                        {category.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        {category.description}
                      </p>
                      <Separator className="my-4" />
                      <div className="space-y-2">
                        {category.articles.map((article, idx) => (
                          <a
                            key={idx}
                            href="#"
                            className="flex items-center gap-2 text-sm text-gray-700 hover:text-pink-600 transition-colors"
                          >
                            <ArrowRight className="w-4 h-4 flex-shrink-0" />
                            <span>{article}</span>
                          </a>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* FAQ */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <Card className="bg-white/60 backdrop-blur-xl border border-white/60 shadow-lg">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                  <HelpCircle className="w-8 h-8 text-pink-600" />
                  Câu hỏi thường gặp
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Câu trả lời cho những câu hỏi phổ biến nhất
                </p>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="Chung" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 bg-pink-100/50 mb-8">
                    {faqs.map((category) => (
                      <TabsTrigger
                        key={category.category}
                        value={category.category}
                      >
                        {category.category}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {faqs.map((category) => (
                    <TabsContent
                      key={category.category}
                      value={category.category}
                    >
                      <Accordion
                        type="single"
                        collapsible
                        className="space-y-4"
                      >
                        {category.questions.map((faq, index) => (
                          <AccordionItem
                            key={index}
                            value={`faq-${index}`}
                            className="border border-pink-200 rounded-xl px-6"
                          >
                            <AccordionTrigger className="text-left hover:no-underline py-6">
                              <span className="text-lg font-semibold text-gray-800">
                                {faq.q}
                              </span>
                            </AccordionTrigger>
                            <AccordionContent className="pb-6">
                              <p className="text-gray-600 leading-relaxed">
                                {faq.a}
                              </p>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </motion.section>

          {/* COMMUNITY */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-800">
                Community Resources
              </h2>
              <p className="text-xl text-gray-600">
                Kết nối với cộng đồng developers
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {communityResources.map((resource, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.05 }}
                >
                  <Card className="h-full bg-white/60 backdrop-blur-xl border border-white/60 shadow-lg text-center">
                    <CardContent className="p-6">
                      <div
                        className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r ${resource.color} flex items-center justify-center`}
                      >
                        <resource.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-gray-800">
                        {resource.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        {resource.description}
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-center gap-2 text-sm">
                          <Users className="w-4 h-4 text-pink-600" />
                          <span className="font-semibold">
                            {resource.members}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          {resource.posts}
                        </div>
                      </div>
                      <Button
                        className={`w-full mt-4 bg-gradient-to-r ${softPinkTheme.primaryGradient} text-white`}
                      >
                        Tham gia ngay
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>
      </div>
    </>
  );
};

export default Help;
