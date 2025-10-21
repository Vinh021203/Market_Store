import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  FileText,
  Scale,
  Shield,
  CreditCard,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  Mail,
  Phone,
  MapPin,
  Users,
  Globe,
  Lock,
  Zap,
  Ban,
  UserCheck,
  Award,
  BookOpen,
  Eye,
  Star,
  Heart,
  Building,
  Gavel,
  Briefcase,
  AlertCircle,
  Info,
  HelpCircle,
  MessageSquare,
  ExternalLink,
  Calendar,
  Target,
  Database,
  Code,
  Smartphone,
  Monitor,
  Headphones,
  ChevronRight,
  ChevronDown,
  Search,
  Filter,
  Menu,
  X,
  ArrowUp,
  Bookmark,
  Share2,
  FileDown,
  CheckSquare,
} from "lucide-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { toast } from "@/hooks/use-toast";

// ============================================
// SOFT PINK THEME - ĐỒNG BỘ VỚI PRIVACY
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

// Types
interface Section {
  id: string;
  icon: React.ElementType;
  title: string;
  subtitle: string;
  color: string;
  content: ContentItem[];
}

interface ContentItem {
  subtitle: string;
  details: string;
  icon: React.ElementType;
  examples?: string[];
  warning?: boolean;
}

const Terms: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["overview", "acceptance", "registration"]),
  );
  const [showFloatingNav, setShowFloatingNav] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const { scrollYProgress } = useScroll();
  const headerY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  const lastUpdated = "21 tháng 10, 2025";
  const version = "v2.5";

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

  const sections: Section[] = useMemo(
    () => [
      {
        id: "overview",
        icon: FileText,
        title: "Tổng quan điều khoản",
        subtitle: "Thông tin cơ bản về điều khoản sử dụng",
        color: "text-pink-600",
        content: [
          {
            subtitle: "Giới thiệu chung",
            details:
              "Điều khoản sử dụng này (Terms of Service) là thỏa thuận pháp lý có ràng buộc giữa bạn và Template Market Vietnam Co., Ltd. Tài liệu này quy định các quyền, nghĩa vụ và trách nhiệm của các bên khi sử dụng nền tảng của chúng tôi.",
            icon: Info,
          },
          {
            subtitle: "Tính pháp lý",
            details:
              "Bằng việc truy cập, đăng ký tài khoản hoặc sử dụng bất kỳ dịch vụ nào của chúng tôi, bạn đồng ý tuân thủ hoàn toàn các điều khoản này. Các điều khoản có hiệu lực ngay lập tức và áp dụng trong suốt quá trình sử dụng dịch vụ.",
            icon: Scale,
            warning: true,
          },
        ],
      },
      {
        id: "acceptance",
        icon: UserCheck,
        title: "Chấp nhận & Ràng buộc",
        subtitle: "Điều kiện để sử dụng dịch vụ",
        color: "text-rose-600",
        content: [
          {
            subtitle: "Đồng ý sử dụng",
            details:
              "Bằng cách tạo tài khoản, download app, sử dụng API, thực hiện thanh toán, hoặc tương tác với bất kỳ phần nào của dịch vụ, bạn tự động đồng ý và cam kết tuân thủ 100% các điều khoản này cùng với Privacy Policy và Cookie Policy.",
            icon: CheckCircle,
            warning: true,
          },
          {
            subtitle: "Độ tuổi và năng lực",
            details:
              "Người dùng phải đủ 16 tuổi trở lên hoặc có sự đồng ý bằng văn bản từ phụ huynh/người giám hộ hợp pháp. Đối với doanh nghiệp, người đại diện phải có đầy đủ thẩm quyền ký kết hợp đồng và thực hiện các nghĩa vụ tài chính.",
            icon: Calendar,
          },
        ],
      },
      {
        id: "registration",
        icon: Users,
        title: "Đăng ký tài khoản",
        subtitle: "Quy định về tạo và quản lý tài khoản",
        color: "text-red-600",
        content: [
          {
            subtitle: "Thông tin chính xác",
            details:
              "Cam kết cung cấp thông tin đăng ký hoàn toàn chính xác, đầy đủ và cập nhật. Bao gồm: họ tên thật, email hợp lệ, số điện thoại, địa chỉ, thông tin doanh nghiệp (nếu có). Việc cung cấp thông tin sai lệch có thể dẫn đến việc khóa tài khoản vĩnh viễn.",
            icon: FileText,
          },
          {
            subtitle: "Bảo mật tuyệt đối",
            details:
              "Hoàn toàn chịu trách nhiệm bảo vệ thông tin đăng nhập bao gồm username, password, 2FA codes, security questions. Sử dụng mật khẩu mạnh (tối thiểu 12 ký tự, bao gồm chữ hoa, thường, số, ký tự đặc biệt). Bắt buộc kích hoạt 2FA cho tài khoản Premium.",
            icon: Shield,
            warning: true,
          },
        ],
      },
      {
        id: "purchases",
        icon: CreditCard,
        title: "Mua hàng & Thanh toán",
        subtitle: "Quy trình và chính sách giao dịch",
        color: "text-pink-700",
        content: [
          {
            subtitle: "Giá cả & Tiền tệ",
            details:
              "Giá được hiển thị bằng VND, USD, EUR tùy vị trí địa lý. Giá đã bao gồm thuế VAT 10% (Việt Nam), GST, Sales Tax theo quy định từng quốc gia. Giá có thể thay đổi do biến động tỷ giá nhưng không ảnh hưởng đến đơn hàng đã thanh toán.",
            icon: Globe,
          },
          {
            subtitle: "Phương thức thanh toán",
            details:
              "Hỗ trợ đa dạng: Visa/Mastercard/JCB, Digital wallets (MoMo, ZaloPay, VNPay), Banking (50+ ngân hàng), International (PayPal, Stripe, Apple Pay, Google Pay), Cryptocurrency (BTC, ETH, USDT).",
            icon: CreditCard,
          },
        ],
      },
      {
        id: "licenses",
        icon: Scale,
        title: "Giấy phép sử dụng",
        subtitle: "Các loại license và quyền sử dụng",
        color: "text-rose-700",
        content: [
          {
            subtitle: "Standard License",
            details:
              "Sử dụng cho 1 dự án end-product (website, app) phục vụ unlimited users. Bao gồm: commercial websites, personal portfolios, client projects, SaaS applications (single tenant). Không được resell template dưới dạng gốc.",
            icon: Target,
          },
          {
            subtitle: "Extended License",
            details:
              "Multiple end-products, resale as part of larger work, SaaS multi-tenant, marketplace integration, white-label solutions. Bao gồm: priority support, customization services, source code access.",
            icon: Star,
          },
          {
            subtitle: "Hành vi cấm",
            details:
              "NGHIÊM CẤM: Redistribute source code, create direct competitors, resell as original templates, claim authorship, reverse engineer protected parts, remove copyright notices, use for illegal purposes.",
            icon: Ban,
            warning: true,
          },
        ],
      },
      {
        id: "refunds",
        icon: Download,
        title: "Chính sách hoàn tiền",
        subtitle: "Điều kiện và quy trình hoàn tiền",
        color: "text-red-700",
        content: [
          {
            subtitle: "Khung thời gian",
            details:
              "Chính sách hoàn tiền 30 ngày không điều kiện cho tất cả sản phẩm digital. Thời hạn tính từ ngày mua đầu tiên, không phụ thuộc thời điểm download. Áp dụng cho single purchases, subscription plans, enterprise contracts.",
            icon: Clock,
          },
          {
            subtitle: "Điều kiện chấp nhận",
            details:
              "Được hoàn tiền khi: sản phẩm không đúng mô tả, lỗi kỹ thuật nghiêm trọng không khắc phục được, không tương thích với platform cam kết, thiếu files quan trọng.",
            icon: CheckCircle,
          },
          {
            subtitle: "Từ chối hoàn tiền",
            details:
              "KHÔNG hoàn tiền khi: đã sử dụng trong production >7 ngày, thay đổi requirements sau mua, không thích design (subjective), vi phạm license terms, account suspended do misconduct.",
            icon: Ban,
            warning: true,
          },
        ],
      },
    ],
    [],
  );

  const stats = [
    {
      icon: Users,
      value: "2.5M+",
      label: "Khách hàng tin tưởng",
      color: "text-pink-600",
    },
    {
      icon: Scale,
      value: "99.9%",
      label: "Tuân thủ pháp lý",
      color: "text-rose-600",
    },
    {
      icon: Globe,
      value: "195+",
      label: "Quốc gia phục vụ",
      color: "text-red-600",
    },
    {
      icon: Award,
      value: "ISO 27001",
      label: "Chứng nhận",
      color: "text-pink-700",
    },
  ];

  const contactInfo = [
    {
      icon: Mail,
      label: "Legal Department",
      value: "legal@templatemarket.com",
      description: "Bộ phận pháp lý chuyên nghiệp",
    },
    {
      icon: Phone,
      label: "Legal Hotline",
      value: "+84 971 386 588",
      description: "Tư vấn pháp lý khẩn cấp",
    },
    {
      icon: MessageSquare,
      label: "Live Chat",
      value: "templatemarket.com/legal",
      description: "Chat với chuyên viên pháp lý",
    },
    {
      icon: MapPin,
      label: "Legal Address",
      value: "Hà Tu, Hạ Long, Quảng Ninh",
      description: "Địa chỉ đăng ký kinh doanh",
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

  return (
    <>
      <Helmet>
        <title>
          Điều khoản sử dụng {version} | Template Market - Ràng buộc pháp lý
        </title>
        <meta
          name="description"
          content="Điều khoản và điều kiện sử dụng đầy đủ của Template Market. Quy định pháp lý về quyền và nghĩa vụ của người dùng và nhà cung cấp dịch vụ."
        />
        <meta
          name="keywords"
          content="điều khoản sử dụng, terms of service, pháp lý, template market, quyền và nghĩa vụ"
        />
        <link rel="canonical" href="https://templatemarket.com/terms" />
        <meta
          property="og:title"
          content="Điều khoản sử dụng - Template Market"
        />
        <meta
          property="og:description"
          content="2.5M+ khách hàng tin tưởng - 99.9% tuân thủ pháp lý - ISO 27001"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://templatemarket.com/terms" />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Terms of Service",
            description:
              "Terms and conditions for using Template Market services",
            publisher: {
              "@type": "Organization",
              name: "Template Market",
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
        {/* STAR BACKGROUND */}
        <div className="fixed inset-0 z-0">
          <StarBackgroundPattern />
        </div>
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
                <Scale className="w-14 h-14 text-white" />
              </motion.div>

              <h1 className="mb-8 text-4xl lg:text-6xl font-bold leading-tight">
                <span
                  className={`text-transparent bg-gradient-to-r ${softPinkTheme.heroText} bg-clip-text`}
                >
                  Điều khoản sử dụng
                </span>
                <br />
                <span className="text-2xl lg:text-3xl font-medium text-gray-700">
                  Template Market Platform
                </span>
              </h1>

              <p className="mb-12 text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-4xl mx-auto">
                Tài liệu pháp lý
                <span
                  className={`font-bold text-transparent bg-gradient-to-r ${softPinkTheme.accentText} bg-clip-text`}
                >
                  {" "}
                  có tính ràng buộc pháp lý{" "}
                </span>
                quy định quyền và nghĩa vụ khi sử dụng dịch vụ
              </p>

              {/* GLASSMORPHISM BADGES */}
              <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-white/40 backdrop-blur-md rounded-full border border-white/60 shadow-lg"
                >
                  <FileText className="w-5 h-5 text-pink-600" />
                  <span className="text-base font-semibold text-gray-800">
                    Version {version}
                  </span>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-white/40 backdrop-blur-md rounded-full border border-white/60 shadow-lg"
                >
                  <Clock className="w-5 h-5 text-rose-600" />
                  <span className="text-base font-semibold text-gray-800">
                    Cập nhật: {lastUpdated}
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

              {/* STATS */}
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
              >
                <Card className="bg-white/60 backdrop-blur-xl border border-white/60 shadow-lg overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-pink-50 flex items-center justify-center">
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
                                <div className="w-10 h-10 rounded-lg bg-pink-50 flex items-center justify-center flex-shrink-0">
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
                                  {item.warning && (
                                    <Badge className="mt-2 bg-red-500 hover:bg-red-600 text-white border-0">
                                      Quan trọng
                                    </Badge>
                                  )}
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

          {/* CONTACT SECTION */}
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
                Liên hệ bộ phận pháp lý
              </h2>
              <p className="text-lg text-gray-600">
                Cần tư vấn pháp lý? Đội ngũ chuyên gia sẵn sàng hỗ trợ bạn
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
        </div>
      </div>
    </>
  );
};

export default Terms;
