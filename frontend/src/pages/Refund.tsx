import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  DollarSign,
  FileText,
  Mail,
  Phone,
  MessageSquare,
  Calendar,
  Shield,
  RefreshCw,
  Download,
  Settings,
  Zap,
  Star,
  Heart,
  Award,
  Target,
  TrendingUp,
  Users,
  Globe,
  Database,
  Code,
  Gift,
  ArrowRight,
  ThumbsUp,
  Eye,
  Copy,
  ArrowUp,
  Info,
  Sparkles,
  Crown,
  Rocket,
  Package,
  BookOpen,
  Palette,
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
      Icon: CreditCard,
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
      Icon: DollarSign,
      color: "from-red-50 to-pink-100",
      position: "bottom-20 right-10",
      size: "text-7xl",
    },
    {
      Icon: Clock,
      color: "from-pink-100 to-rose-50",
      position: "bottom-32 left-20",
      size: "text-6xl",
    },
    {
      Icon: CheckCircle,
      color: "from-rose-100 to-pink-50",
      position: "top-1/2 right-1/4",
      size: "text-5xl",
    },
    {
      Icon: FileText,
      color: "from-red-50 to-rose-100",
      position: "top-1/3 left-1/3",
      size: "text-6xl",
    },
    {
      Icon: Users,
      color: "from-pink-50 to-red-100",
      position: "bottom-1/3 right-1/3",
      size: "text-5xl",
    },
    {
      Icon: Award,
      color: "from-rose-50 to-pink-100",
      position: "top-2/3 left-1/4",
      size: "text-6xl",
    },
    {
      Icon: Heart,
      color: "from-red-100 to-rose-50",
      position: "top-1/4 right-1/2",
      size: "text-4xl",
    },
    {
      Icon: Star,
      color: "from-pink-100 to-red-50",
      position: "bottom-1/4 left-1/2",
      size: "text-5xl",
    },
    {
      Icon: Sparkles,
      color: "from-rose-100 to-red-50",
      position: "top-3/4 right-20",
      size: "text-6xl",
    },
    {
      Icon: Crown,
      color: "from-pink-50 to-rose-100",
      position: "bottom-40 left-10",
      size: "text-5xl",
    },
    {
      Icon: Gift,
      color: "from-red-50 to-pink-50",
      position: "top-40 right-40",
      size: "text-6xl",
    },
    {
      Icon: Rocket,
      color: "from-rose-50 to-red-50",
      position: "bottom-1/2 right-10",
      size: "text-5xl",
    },
    {
      Icon: Target,
      color: "from-pink-100 to-rose-100",
      position: "top-1/2 left-10",
      size: "text-6xl",
    },
    {
      Icon: TrendingUp,
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

const Refund: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [showFloatingNav, setShowFloatingNav] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const { scrollYProgress } = useScroll();
  const headerY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

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

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      icon: Users,
      value: "99.2%",
      label: "Khách hàng hài lòng",
      color: "text-pink-600",
    },
    {
      icon: Clock,
      value: "2.5 ngày",
      label: "Thời gian xử lý TB",
      color: "text-rose-600",
    },
    {
      icon: DollarSign,
      value: "$2.8M",
      label: "Đã hoàn tiền",
      color: "text-red-600",
    },
    {
      icon: Shield,
      value: "0% Fraud",
      label: "Tỷ lệ gian lận",
      color: "text-pink-700",
    },
  ];

  const refundTimeline = [
    {
      step: 1,
      title: "Yêu cầu hoàn tiền",
      description: "Gửi request qua email, live chat hoặc form online",
      timeframe: "Trong vòng 30 ngày",
      icon: Mail,
      color: "text-pink-600",
    },
    {
      step: 2,
      title: "Review & Xác minh",
      description: "Team chuyên gia đánh giá và xác minh yêu cầu",
      timeframe: "1-2 ngày làm việc",
      icon: FileText,
      color: "text-rose-600",
    },
    {
      step: 3,
      title: "Phê duyệt quyết định",
      description: "Thông báo kết quả và confirm refund amount",
      timeframe: "2-3 ngày làm việc",
      icon: CheckCircle,
      color: "text-red-600",
    },
    {
      step: 4,
      title: "Xử lý hoàn tiền",
      description: "Transfer tiền về payment method gốc",
      timeframe: "3-10 ngày làm việc",
      icon: CreditCard,
      color: "text-pink-700",
    },
  ];

  const refundEligible = [
    {
      icon: CheckCircle,
      title: "Lỗi kỹ thuật nghiêm trọng",
      description:
        "Template không hoạt động, file corrupted, thiếu components quan trọng",
      percentage: "95%",
      avgTime: "2-3 ngày",
    },
    {
      icon: CheckCircle,
      title: "Không đúng mô tả",
      description:
        "Sản phẩm khác biệt hoàn toàn so với demo, thiếu features được cam kết",
      percentage: "92%",
      avgTime: "3-4 ngày",
    },
    {
      icon: CheckCircle,
      title: "Không tương thích",
      description: "Template không work với framework version được advertised",
      percentage: "88%",
      avgTime: "2-3 ngày",
    },
    {
      icon: CheckCircle,
      title: "Lỗi thanh toán double charge",
      description: "Bị charge nhiều lần cho cùng order, payment gateway errors",
      percentage: "100%",
      avgTime: "1-2 ngày",
    },
  ];

  const refundNotEligible = [
    {
      icon: XCircle,
      title: "Thay đổi ý kiến cá nhân",
      description:
        "Không thích design, color scheme, style sau khi đã download và review kỹ",
      alternative: "Có thể đổi sang product khác cùng giá trị",
    },
    {
      icon: XCircle,
      title: "Thiếu technical skills",
      description:
        "Không biết code, không hiểu cách customize, setup hoặc deploy template",
      alternative: "Free support & tutorial videos available",
    },
    {
      icon: XCircle,
      title: "Đã sử dụng thương mại",
      description: "Template đã được deploy live, sử dụng cho client projects",
      alternative: "Có thể upgrade license nếu cần",
    },
  ];

  const contactOptions = [
    {
      icon: MessageSquare,
      title: "Live Chat Priority",
      description: "Chat trực tiếp với refund specialist",
      action: "Bắt đầu chat ngay",
      availability: "24/7",
      responseTime: "< 30 giây",
    },
    {
      icon: Mail,
      title: "Email Refund Team",
      description: "refunds@templatemarket.com",
      action: "Compose email",
      availability: "24/7",
      responseTime: "< 2 giờ",
    },
    {
      icon: Phone,
      title: "Hotline Refunds",
      description: "+84 971 386 588 (ext. 3)",
      action: "Gọi ngay",
      availability: "8AM-10PM",
      responseTime: "Ngay lập tức",
    },
  ];

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
          <Card className="bg-white/80 backdrop-blur-lg border border-gray-200/50 shadow-lg">
            <CardContent className="p-4">
              <Button
                size="sm"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className={`bg-gradient-to-r ${softPinkTheme.primaryGradient} text-white`}
              >
                <ArrowUp className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const handleQuickRefund = () => {
    toast({
      title: "Đang chuyển hướng...",
      description: "Bạn sẽ được chuyển đến form yêu cầu hoàn tiền trong 3 giây",
    });
  };

  return (
    <>
      <Helmet>
        <title>
          Chính sách hoàn tiền | Template Market - 30 ngày không điều kiện
        </title>
        <meta
          name="description"
          content="Chính sách hoàn tiền 30 ngày không điều kiện của Template Market. Quy trình nhanh chóng, minh bạch với tỷ lệ approval 99.2%."
        />
        <link rel="canonical" href="https://templatemarket.com/refund" />
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
                <CreditCard className="w-14 h-14 text-white" />
              </motion.div>

              <h1 className="mb-8 text-5xl lg:text-7xl font-bold">
                <span
                  className={`text-transparent bg-gradient-to-r ${softPinkTheme.heroText} bg-clip-text`}
                >
                  Chính sách hoàn tiền
                </span>
                <br />
                <span className="text-2xl lg:text-3xl font-medium text-gray-700">
                  30 ngày không điều kiện
                </span>
              </h1>

              <p className="mb-12 text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto">
                Hoàn tiền 100% trong 30 ngày với quy trình siêu nhanh và minh
                bạch
              </p>

              {/* BADGES */}
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-white/40 backdrop-blur-md rounded-full border border-white/60 shadow-lg"
                >
                  <Clock className="w-5 h-5 text-pink-600" />
                  <span className="font-semibold text-gray-800">
                    30 ngày guarantee
                  </span>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-white/40 backdrop-blur-md rounded-full border border-white/60 shadow-lg"
                >
                  <DollarSign className="w-5 h-5 text-rose-600" />
                  <span className="font-semibold text-gray-800">
                    100% money back
                  </span>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-white/40 backdrop-blur-md rounded-full border border-white/60 shadow-lg"
                >
                  <Shield className="w-5 h-5 text-red-600" />
                  <span className="font-semibold text-gray-800">
                    Zero questions asked
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

              {/* CTA BUTTON */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="mt-12"
              >
                <Button
                  onClick={handleQuickRefund}
                  size="lg"
                  className={`bg-gradient-to-r ${softPinkTheme.primaryGradient} text-white px-12 py-4 text-lg font-semibold rounded-2xl shadow-xl`}
                >
                  <CreditCard className="w-6 h-6 mr-3" />
                  Yêu cầu hoàn tiền ngay
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* MAIN CONTENT */}
        <div className="container relative z-10 px-4 mx-auto max-w-7xl pb-20">
          {/* TIMELINE */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-800">
                Quy trình hoàn tiền chi tiết
              </h2>
              <p className="text-xl text-gray-600">
                4 bước đơn giản để nhận lại 100% số tiền
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {refundTimeline.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ y: -10, scale: 1.05 }}
                >
                  <Card
                    className={`text-center h-full transition-all duration-500 ${
                      activeStep === index
                        ? "bg-white shadow-2xl scale-105 border-pink-200"
                        : "bg-white/80 hover:shadow-xl"
                    } backdrop-blur-sm border-0`}
                  >
                    <CardContent className="p-8">
                      <motion.div
                        animate={
                          activeStep === index ? { scale: [1, 1.1, 1] } : {}
                        }
                        transition={{ duration: 0.6 }}
                        className={`flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-pink-100 rounded-2xl`}
                      >
                        <step.icon className={`w-10 h-10 ${step.color}`} />
                      </motion.div>

                      <Badge
                        variant="outline"
                        className="mb-4 bg-pink-100 text-pink-700"
                      >
                        Bước {step.step}
                      </Badge>

                      <h3 className="text-xl font-bold mb-3 text-gray-800">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 mb-4">{step.description}</p>

                      <Badge
                        variant="secondary"
                        className="bg-gray-100 text-gray-700"
                      >
                        ⏱️ {step.timeframe}
                      </Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* ELIGIBLE VS NOT ELIGIBLE */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-800">
                Điều kiện hoàn tiền chi tiết
              </h2>
              <p className="text-xl text-gray-600">
                Hiểu rõ những trường hợp được và không được hoàn tiền
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* ELIGIBLE */}
              <Card className="bg-white/60 backdrop-blur-xl border border-white/60 shadow-lg overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-500" />
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-emerald-700">
                    <CheckCircle className="w-8 h-8" />
                    <span className="text-2xl">Được hoàn tiền</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {refundEligible.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-emerald-50 p-4 rounded-xl border border-emerald-100"
                    >
                      <div className="flex items-start gap-3">
                        <item.icon className="w-5 h-5 text-emerald-600 mt-1" />
                        <div className="flex-1">
                          <h4 className="font-bold text-lg mb-2 text-emerald-800">
                            {item.title}
                          </h4>
                          <p className="text-gray-600 text-sm mb-3">
                            {item.description}
                          </p>
                          <div className="flex gap-2">
                            <Badge
                              variant="outline"
                              className="bg-emerald-100 text-emerald-700 text-xs"
                            >
                              {item.percentage} approval
                            </Badge>
                            <Badge
                              variant="outline"
                              className="bg-blue-100 text-blue-700 text-xs"
                            >
                              {item.avgTime}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>

              {/* NOT ELIGIBLE */}
              <Card className="bg-white/60 backdrop-blur-xl border border-white/60 shadow-lg overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-red-500 to-pink-500" />
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-red-700">
                    <XCircle className="w-8 h-8" />
                    <span className="text-2xl">Không được hoàn tiền</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {refundNotEligible.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-red-50 p-4 rounded-xl border border-red-100"
                    >
                      <div className="flex items-start gap-3">
                        <item.icon className="w-5 h-5 text-red-600 mt-1" />
                        <div className="flex-1">
                          <h4 className="font-bold text-lg mb-2 text-red-800">
                            {item.title}
                          </h4>
                          <p className="text-gray-600 text-sm mb-3">
                            {item.description}
                          </p>
                          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                            <p className="text-sm text-blue-700">
                              <strong>💡 Alternative:</strong>{" "}
                              {item.alternative}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </motion.section>

          {/* CONTACT */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="bg-white/60 backdrop-blur-xl border border-white/60 shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold text-gray-800">
                  Yêu cầu hoàn tiền ngay
                </CardTitle>
                <p className="text-lg text-gray-600 mt-2">
                  Chúng tôi có 3 kênh hỗ trợ hoàn tiền chuyên nghiệp
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {contactOptions.map((option, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -10, scale: 1.05 }}
                      className="text-center"
                    >
                      <div className="w-16 h-16 mx-auto mb-4 bg-pink-100 rounded-xl flex items-center justify-center">
                        <option.icon className="w-8 h-8 text-pink-600" />
                      </div>
                      <h4 className="font-bold text-lg mb-2 text-gray-800">
                        {option.title}
                      </h4>
                      <p className="text-gray-600 mb-4">{option.description}</p>
                      <div className="space-y-2 mb-4 text-sm">
                        <Badge
                          variant="outline"
                          className="bg-blue-100 text-blue-700"
                        >
                          {option.availability}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-700"
                        >
                          {option.responseTime}
                        </Badge>
                      </div>
                      <Button
                        className={`w-full bg-gradient-to-r ${softPinkTheme.primaryGradient} text-white`}
                      >
                        {option.action}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
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

export default Refund;
