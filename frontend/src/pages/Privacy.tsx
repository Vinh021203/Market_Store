import React, { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Lock,
  Shield,
  Eye,
  Database,
  Settings,
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  Users,
  Globe,
  Zap,
  Star,
  Award,
  Heart,
  Download,
  Upload,
  Search,
  Filter,
  UserCheck,
  Key,
  Server,
  Cloud,
  Smartphone,
  Monitor,
  CreditCard,
  ShoppingCart,
  MessageSquare,
  Bell,
  Trash2,
  Edit3,
  Copy,
  RefreshCw,
  ArrowUp,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  Info,
  ExternalLink,
  Bookmark,
  Share2,
  ThumbsUp,
  Package,
  Code,
  Palette,
  Sparkles,
  Crown,
  Gift,
  Rocket,
  Target,
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
  sectionBackground: "from-white/95 via-pink-25/30 to-rose-25/20",
  glassCard: "from-white/95 via-pink-25/20 to-rose-25/10 backdrop-blur-xl",
  neoCard: "bg-gradient-to-br from-white via-pink-25/30 to-rose-25/20",
  floatingCard: "from-white/90 via-pink-50/60 to-rose-50/40",
  primaryGradient: "from-pink-500 via-rose-500 to-red-500",
  secondaryGradient: "from-pink-400 via-rose-500 to-pink-600",
  accentGradient: "from-rose-400 via-pink-500 to-red-400",
  successGradient: "from-pink-300 via-rose-400 to-pink-500",
  heroText: "from-pink-700 via-rose-600 to-red-600",
  primaryText: "from-slate-700 via-pink-700 to-rose-700",
  accentText: "from-rose-600 via-pink-600 to-red-600",
  glow: "shadow-pink-200/60 shadow-2xl",
  neonGlow: "shadow-rose-300/50 shadow-xl",
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
// ANIMATED FLOATING STARS
// ============================================
const FloatingStars = () => {
  const stars = [
    { size: 60, top: "10%", left: "15%", delay: 0, duration: 8 },
    { size: 80, top: "25%", right: "10%", delay: 1, duration: 10 },
    { size: 50, bottom: "20%", left: "20%", delay: 2, duration: 12 },
    { size: 70, bottom: "30%", right: "25%", delay: 0.5, duration: 9 },
    { size: 45, top: "45%", left: "8%", delay: 1.5, duration: 11 },
    { size: 55, top: "60%", right: "15%", delay: 2.5, duration: 10 },
    { size: 65, bottom: "15%", left: "45%", delay: 1, duration: 13 },
    { size: 40, top: "35%", right: "40%", delay: 3, duration: 9 },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {stars.map((star, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            top: star.top,
            bottom: star.bottom,
            left: star.left,
            right: star.right,
            width: star.size,
            height: star.size,
          }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.2, 1],
            opacity: [0.03, 0.08, 0.03],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: star.delay,
          }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <linearGradient
                id={`starGrad${i}`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#FEF3C7" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#FBCFE8" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#FCA5A5" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            <path
              d="M 50,10 L 58,40 L 90,40 L 65,58 L 73,90 L 50,70 L 27,90 L 35,58 L 10,40 L 42,40 Z"
              fill={`url(#starGrad${i})`}
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

// ============================================
// MAIN PRIVACY COMPONENT
// ============================================
const Privacy: React.FC = () => {
  const [activeSection, setActiveSection] = useState("collection");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showFloatingNav, setShowFloatingNav] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set([
      "collection",
      "usage",
      "sharing",
      "security",
      "rights",
      "cookies",
    ]),
  );

  const { scrollYProgress } = useScroll();
  const headerY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  const lastUpdated = "21 tháng 10, 2025";
  const version = "v2.5";

  useEffect(() => {
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

  const toggleSection = useCallback((sectionId: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  }, []);

  const sections = [
    {
      id: "collection",
      icon: Database,
      title: "Thu thập thông tin",
      subtitle: "Dữ liệu chúng tôi thu thập từ bạn",
      color: "text-pink-600",
      bgColor: "bg-pink-50/50",
      content: [
        {
          subtitle: "Thông tin cá nhân",
          details:
            "Họ tên, địa chỉ email, số điện thoại, ngày sinh, giới tính, và ảnh đại diện khi bạn đăng ký tài khoản hoặc liên hệ với chúng tôi.",
          icon: UserCheck,
        },
        {
          subtitle: "Thông tin thanh toán & tài chính",
          details:
            "Thông tin thẻ tín dụng, tài khoản ngân hàng, lịch sử giao dịch, hóa đơn và các dữ liệu tài chính cần thiết để xử lý thanh toán.",
          icon: CreditCard,
        },
        {
          subtitle: "Dữ liệu hành vi sử dụng",
          details:
            "Thời gian truy cập, trang web đã xem, sản phẩm quan tâm, lịch sử tìm kiếm, tương tác với nội dung và patterns sử dụng dịch vụ.",
          icon: Search,
        },
        {
          subtitle: "Thông tin thiết bị & kỹ thuật",
          details:
            "Địa chỉ IP, loại trình duyệt, hệ điều hành, độ phân giải màn hình, thông tin thiết bị di động, cookies và local storage.",
          icon: Monitor,
        },
      ],
    },
    {
      id: "usage",
      icon: Eye,
      title: "Sử dụng dữ liệu",
      subtitle: "Cách chúng tôi xử lý thông tin của bạn",
      color: "text-rose-600",
      bgColor: "bg-rose-50/50",
      content: [
        {
          subtitle: "Cung cấp & cải thiện dịch vụ",
          details:
            "Vận hành website, xử lý đơn hàng, cung cấp hỗ trợ khách hàng, cá nhân hóa trải nghiệm người dùng và phát triển tính năng mới.",
          icon: Zap,
        },
        {
          subtitle: "Liên lạc & thông báo",
          details:
            "Gửi email xác nhận, thông báo đơn hàng, cập nhật sản phẩm, newsletter, khuyến mãi đặc biệt và thông tin quan trọng khác.",
          icon: Bell,
        },
        {
          subtitle: "Bảo mật & chống gian lận",
          details:
            "Xác thực danh tính, phát hiện hoạt động đáng ngờ, ngăn chặn spam, bảo vệ khỏi các cuộc tấn công mạng và đảm bảo an toàn giao dịch.",
          icon: Shield,
        },
        {
          subtitle: "Phân tích & báo cáo",
          details:
            "Phân tích xu hướng sử dụng, đo lường hiệu quả marketing, tối ưu hóa performance website và tạo insights kinh doanh.",
          icon: Filter,
        },
      ],
    },
    {
      id: "sharing",
      icon: Users,
      title: "Chia sẻ dữ liệu",
      subtitle: "Khi nào và với ai chúng tôi chia sẻ",
      color: "text-red-600",
      bgColor: "bg-red-50/50",
      content: [
        {
          subtitle: "Đối tác kinh doanh",
          details:
            "Các nhà cung cấp dịch vụ thanh toán, shipping, cloud hosting, analytics, customer support và marketing automation được xác minh.",
          icon: Award,
        },
        {
          subtitle: "Yêu cầu pháp lý",
          details:
            "Cơ quan nhà nước có thẩm quyền, tòa án, cảnh sát, cơ quan thuế khi có lệnh hoặc yêu cầu chính thức theo quy định pháp luật.",
          icon: FileText,
        },
        {
          subtitle: "Sự đồng ý của bạn",
          details:
            "Các trường hợp bạn cho phép rõ ràng, ví dụ khi kết nối social media, chia sẻ với bạn bè, hoặc tham gia chương trình affiliate.",
          icon: CheckCircle,
        },
      ],
    },
    {
      id: "security",
      icon: Shield,
      title: "Bảo mật dữ liệu",
      subtitle: "Các biện pháp bảo vệ thông tin",
      color: "text-pink-700",
      bgColor: "bg-pink-50/50",
      content: [
        {
          subtitle: "Mã hóa dữ liệu",
          details:
            "SSL/TLS 256-bit cho truyền tải, AES-256 cho lưu trữ, end-to-end encryption cho tin nhắn nhạy cảm và quantum-safe cryptography.",
          icon: Key,
        },
        {
          subtitle: "Kiến trúc bảo mật",
          details:
            "Firewall đa lớp, intrusion detection system, DDoS protection, vulnerability scanning và penetration testing thường xuyên.",
          icon: Server,
        },
        {
          subtitle: "Kiểm soát truy cập",
          details:
            "Multi-factor authentication, role-based access control, privilege management, audit logging và session management.",
          icon: UserCheck,
        },
        {
          subtitle: "Hạ tầng an toàn",
          details:
            "Cloud infrastructure tier-1, data centers ISO 27001, backup tự động, disaster recovery plan và 99.9% uptime guarantee.",
          icon: Cloud,
        },
      ],
    },
    {
      id: "rights",
      icon: Settings,
      title: "Quyền của bạn",
      subtitle: "Các quyền bảo vệ dữ liệu cá nhân",
      color: "text-rose-700",
      bgColor: "bg-rose-50/50",
      content: [
        {
          subtitle: "Quyền được biết",
          details:
            "Yêu cầu thông tin chi tiết về dữ liệu được thu thập, mục đích sử dụng, thời gian lưu trữ và các bên thứ ba được chia sẻ.",
          icon: FileText,
        },
        {
          subtitle: "Quyền truy cập dữ liệu",
          details:
            "Download một bản sao hoàn chỉnh dữ liệu cá nhân của bạn trong định dạng machine-readable như JSON, CSV hoặc XML.",
          icon: Download,
        },
        {
          subtitle: "Quyền chỉnh sửa",
          details:
            "Cập nhật, sửa đổi hoặc hoàn thiện thông tin cá nhân không chính xác, lỗi thời hoặc không đầy đủ trong tài khoản của bạn.",
          icon: Edit3,
        },
        {
          subtitle: "Quyền xóa dữ liệu",
          details:
            "Yêu cầu xóa vĩnh viễn dữ liệu cá nhân (right to be forgotten) trừ khi có nghĩa vụ pháp lý yêu cầu giữ lại.",
          icon: Trash2,
        },
      ],
    },
    {
      id: "cookies",
      icon: Globe,
      title: "Cookies & Tracking",
      subtitle: "Công nghệ theo dõi và cá nhân hóa",
      color: "text-red-700",
      bgColor: "bg-red-50/50",
      content: [
        {
          subtitle: "Essential Cookies",
          details:
            "Cookies cần thiết cho chức năng cơ bản: đăng nhập, giỏ hàng, bảo mật, load balancing, và các tính năng core của website.",
          icon: Globe,
        },
        {
          subtitle: "Analytics Cookies",
          details:
            "Google Analytics, heatmaps, user session recording, A/B testing, conversion tracking và performance monitoring để cải thiện UX.",
          icon: Filter,
        },
        {
          subtitle: "Advertising Cookies",
          details:
            "Facebook Pixel, Google Ads, retargeting campaigns, lookalike audiences, attribution modeling và cross-device tracking.",
          icon: Star,
        },
        {
          subtitle: "Functional Cookies",
          details:
            "Language preferences, theme settings, customization options, remember me functionality và personalized user experience.",
          icon: Settings,
        },
      ],
    },
  ];

  const stats = [
    {
      icon: Users,
      value: "50K+",
      label: "Người dùng tin tưởng",
      color: "text-pink-600",
    },
    {
      icon: Shield,
      value: "99.9%",
      label: "Uptime bảo mật",
      color: "text-rose-600",
    },
    {
      icon: Globe,
      value: "120+",
      label: "Quốc gia phục vụ",
      color: "text-red-600",
    },
    {
      icon: Award,
      value: "ISO 27001",
      label: "Chứng nhận bảo mật",
      color: "text-pink-700",
    },
  ];

  const contactInfo = [
    {
      icon: Mail,
      label: "Data Protection Officer",
      value: "dpo@templatemarket.com",
      description: "Liên hệ về bảo vệ dữ liệu",
    },
    {
      icon: Phone,
      label: "Hotline bảo mật",
      value: "+84 971 386 588",
      description: "Hỗ trợ khẩn cấp 24/7",
    },
    {
      icon: MessageSquare,
      label: "Live Chat",
      value: "templatemarket.com/chat",
      description: "Chat trực tiếp với chuyên gia",
    },
    {
      icon: MapPin,
      label: "Trụ sở chính",
      value: "Hà Tu, Hạ Long, Quảng Ninh",
      description: "Văn phòng chính thức",
    },
  ];

  const ReadingProgress: React.FC = () => (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
      <motion.div
        className={`h-full bg-gradient-to-r ${softPinkTheme.primaryGradient}`}
        style={{ width: `${scrollProgress}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${scrollProgress}%` }}
        transition={{ duration: 0.1 }}
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
                  className={`bg-gradient-to-r ${softPinkTheme.primaryGradient} text-white border-0 hover:scale-110`}
                >
                  <ArrowUp className="w-4 h-4" />
                </Button>
                <div className="text-sm text-gray-700 font-medium">
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

  const handleDataRequest = (type: string) => {
    toast({
      title: "Đang xử lý yêu cầu...",
      description: `Yêu cầu ${type} của bạn đang được xử lý. Chúng tôi sẽ liên hệ trong 24h.`,
    });
  };

  return (
    <>
      <Helmet>
        <title>
          Chính sách bảo mật {version} | Template Market - Bảo vệ dữ liệu tuyệt
          đối
        </title>
        <meta
          name="description"
          content="Chính sách bảo mật chi tiết của Template Market. Cam kết bảo vệ dữ liệu cá nhân với công nghệ mã hóa tiên tiến, tuân thủ GDPR và các tiêu chuẩn quốc tế ISO 27001."
        />
        <meta
          name="keywords"
          content="chính sách bảo mật, privacy policy, GDPR, bảo vệ dữ liệu, ISO 27001, template market, data protection, security"
        />
        <link rel="canonical" href="https://templatemarket.com/privacy" />

        <meta
          property="og:title"
          content="Chính sách bảo mật Template Market"
        />
        <meta
          property="og:description"
          content="50K+ người dùng tin tưởng - Bảo mật 99.9% uptime - ISO 27001 certified"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://templatemarket.com/privacy" />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Privacy Policy",
            description:
              "Privacy policy and data protection information for Template Market",
            publisher: {
              "@type": "Organization",
              name: "Template Market",
              logo: {
                "@type": "ImageObject",
                url: "https://templatemarket.com/logo.png",
              },
            },
            datePublished: "2025-10-21",
            dateModified: "2025-10-21",
          })}
        </script>
      </Helmet>

      <ReadingProgress />
      <FloatingNav />

      <div
        className={`min-h-screen bg-gradient-to-br ${softPinkTheme.pageBackground} overflow-hidden relative`}
      >
        {/* STAR BACKGROUND PATTERN */}
        <div className="fixed inset-0 z-0">
          <StarBackgroundPattern />
        </div>

        {/* ANIMATED FLOATING STARS */}
        <FloatingStars />

        {/* HERO SECTION */}
        <motion.section
          className="relative py-20 lg:py-32 overflow-hidden z-10"
          style={{ y: headerY, opacity: headerOpacity }}
        >
          <div className="container relative z-10 px-4 mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-5xl mx-auto"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className={`flex items-center justify-center w-28 h-28 mx-auto mb-8 bg-gradient-to-r ${softPinkTheme.primaryGradient} rounded-3xl ${softPinkTheme.glow}`}
              >
                <Lock className="w-14 h-14 text-white" />
              </motion.div>

              <h1 className="mb-8 text-4xl lg:text-6xl font-bold leading-tight">
                <span
                  className={`text-transparent bg-gradient-to-r ${softPinkTheme.heroText} bg-clip-text`}
                >
                  Bảo mật tuyệt đối
                </span>
                <br />
                <span className="text-2xl lg:text-3xl font-medium text-gray-700">
                  Dữ liệu của bạn trong tay an toàn
                </span>
              </h1>

              <p className="mb-12 text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-4xl mx-auto">
                Chúng tôi cam kết bảo vệ quyền riêng tư và dữ liệu cá nhân của
                bạn với những
                <span
                  className={`font-bold text-transparent bg-gradient-to-r ${softPinkTheme.accentText} bg-clip-text`}
                >
                  {" "}
                  tiêu chuẩn bảo mật hàng đầu thế giới{" "}
                </span>
              </p>

              {/* GLASSMORPHISM BADGES - GIỐNG ẢNH */}
              <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-white/40 backdrop-blur-md rounded-full border border-white/60 shadow-lg"
                >
                  <Clock className="w-5 h-5 text-pink-600" />
                  <span className="text-base font-semibold text-gray-800">
                    Cập nhật: {lastUpdated}
                  </span>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-white/40 backdrop-blur-md rounded-full border border-white/60 shadow-lg"
                >
                  <Shield className="w-5 h-5 text-rose-600" />
                  <span className="text-base font-semibold text-gray-800">
                    GDPR Compliant
                  </span>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-white/40 backdrop-blur-md rounded-full border border-white/60 shadow-lg"
                >
                  <Award className="w-5 h-5 text-red-600" />
                  <span className="text-base font-semibold text-gray-800">
                    ISO 27001 Certified
                  </span>
                </motion.div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
                    whileHover={{ y: -10, scale: 1.05 }}
                    className="bg-white/60 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/60"
                  >
                    <stat.icon
                      className={`w-8 h-8 mx-auto mb-3 ${stat.color}`}
                    />
                    <div
                      className={`text-2xl lg:text-3xl font-bold mb-2 text-transparent bg-gradient-to-r ${softPinkTheme.heroText} bg-clip-text`}
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

        {/* CONTENT SECTIONS */}
        <div className="container relative z-10 px-4 mx-auto max-w-7xl pb-20">
          <div className="space-y-12">
            {sections.map((section, sectionIndex) => (
              <motion.section
                key={section.id}
                id={section.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: sectionIndex * 0.1, duration: 0.6 }}
                className="space-y-6"
              >
                <Card className="bg-white/60 backdrop-blur-xl border border-white/60 shadow-lg overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-14 h-14 rounded-xl ${section.bgColor} flex items-center justify-center`}
                      >
                        <section.icon className={`w-7 h-7 ${section.color}`} />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-2xl lg:text-3xl font-bold text-gray-800">
                          {section.title}
                        </CardTitle>
                        <p className="text-gray-600 mt-1">{section.subtitle}</p>
                      </div>
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <ChevronDown
                          className={`w-6 h-6 text-gray-600 transition-transform ${
                            expandedSections.has(section.id) ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </div>
                  </CardHeader>

                  <AnimatePresence>
                    {expandedSections.has(section.id) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CardContent className="pt-0 space-y-6">
                          {section.content.map((item, itemIndex) => (
                            <div key={itemIndex} className="space-y-3">
                              <div className="flex items-start gap-3">
                                <div
                                  className={`w-10 h-10 rounded-lg ${section.bgColor} flex items-center justify-center flex-shrink-0`}
                                >
                                  <item.icon
                                    className={`w-5 h-5 ${section.color}`}
                                  />
                                </div>
                                <div className="flex-1">
                                  <h4 className="text-lg font-semibold text-gray-800 mb-2">
                                    {item.subtitle}
                                  </h4>
                                  <p className="text-gray-600 leading-relaxed">
                                    {item.details}
                                  </p>
                                </div>
                              </div>
                              {itemIndex < section.content.length - 1 && (
                                <Separator className="my-4" />
                              )}
                            </div>
                          ))}
                        </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.section>
            ))}
          </div>

          {/* CONTACT INFO SECTION */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20"
          >
            <div className="text-center mb-12">
              <h2
                className={`text-3xl lg:text-4xl font-bold mb-4 text-transparent bg-gradient-to-r ${softPinkTheme.heroText} bg-clip-text`}
              >
                Liên hệ với chúng tôi
              </h2>
              <p className="text-lg text-gray-600">
                Có câu hỏi về chính sách bảo mật? Đội ngũ của chúng tôi sẵn sàng
                hỗ trợ bạn
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactInfo.map((contact, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <Card className="h-full bg-white/60 backdrop-blur-xl border border-white/60 shadow-lg">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-pink-50 flex items-center justify-center">
                        <contact.icon className="w-8 h-8 text-pink-600" />
                      </div>
                      <h3 className="text-lg font-bold mb-2 text-gray-800">
                        {contact.label}
                      </h3>
                      <p className="text-pink-600 font-semibold mb-1">
                        {contact.value}
                      </p>
                      <p className="text-sm text-gray-600">
                        {contact.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* QUICK ACTIONS */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <Card className="bg-white/60 backdrop-blur-xl border border-white/60 shadow-lg">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <h4 className="text-xl font-semibold text-gray-800">
                    Thao tác nhanh với dữ liệu của bạn
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                      {
                        icon: Download,
                        label: "Tải xuống dữ liệu",
                        desc: "Export data của bạn",
                        action: "download",
                      },
                      {
                        icon: Edit3,
                        label: "Chỉnh sửa thông tin",
                        desc: "Cập nhật profile",
                        action: "edit",
                      },
                      {
                        icon: Trash2,
                        label: "Xóa tài khoản",
                        desc: "Delete permanently",
                        action: "delete",
                      },
                      {
                        icon: Bell,
                        label: "Opt-out Marketing",
                        desc: "Dừng email marketing",
                        action: "optout",
                      },
                    ].map((action, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="cursor-pointer"
                        onClick={() => handleDataRequest(action.label)}
                      >
                        <Card className="bg-white/80 hover:bg-white border border-pink-200 shadow-md hover:shadow-lg transition-all duration-300">
                          <CardContent className="p-6 text-center">
                            <action.icon className="w-8 h-8 mx-auto mb-3 text-pink-600" />
                            <div className="text-sm font-medium text-gray-800 mb-1">
                              {action.label}
                            </div>
                            <div className="text-xs text-gray-600">
                              {action.desc}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.section>
        </div>
      </div>
    </>
  );
};

export default Privacy;
