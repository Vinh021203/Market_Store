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
  MessageCircle,
  Calendar,
  Shield,
  RefreshCw,
  Download,
  Ban,
  User,
  Settings,
  Zap,
  MapPin,
  Star,
  Heart,
  Award,
  Target,
  TrendingUp,
  Users,
  Globe,
  Database,
  Code,
  Smartphone,
  Monitor,
  Headphones,
  Gift,
  Calculator,
  PieChart,
  BarChart3,
  ArrowRight,
  ThumbsUp,
  Eye,
  Copy,
  ArrowUp,
  Info,
} from "lucide-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { toast } from "@/hooks/use-toast";

const Refund: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [showFloatingNav, setShowFloatingNav] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const { scrollYProgress } = useScroll();
  const headerY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  // ✅ Enhanced Color Schemes
  const colorSchemes = {
    primary: {
      gradient: "from-cyan-500 via-blue-500 to-indigo-500",
      bg: "from-cyan-50/80 to-blue-50/80",
      darkBg: "from-cyan-900/30 to-blue-900/30",
      accent: "text-cyan-600",
    },
    success: {
      gradient: "from-emerald-500 via-teal-500 to-cyan-500",
      bg: "from-emerald-50/80 to-cyan-50/80",
      darkBg: "from-emerald-900/30 to-cyan-900/30",
      accent: "text-emerald-600",
    },
    warning: {
      gradient: "from-amber-500 via-orange-500 to-red-500",
      bg: "from-amber-50/80 to-orange-50/80",
      darkBg: "from-amber-900/30 to-orange-900/30",
      accent: "text-amber-600",
    },
    danger: {
      gradient: "from-red-500 via-pink-500 to-rose-500",
      bg: "from-red-50/80 to-pink-50/80",
      darkBg: "from-red-900/30 to-pink-900/30",
      accent: "text-red-600",
    },
    info: {
      gradient: "from-indigo-500 via-purple-500 to-blue-500",
      bg: "from-indigo-50/80 to-purple-50/80",
      darkBg: "from-indigo-900/30 to-purple-900/30",
      accent: "text-indigo-600",
    },
  };

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

  // ✅ Auto-step animation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const refundTimeline = [
    {
      step: 1,
      title: "📧 Yêu cầu hoàn tiền",
      description: "Gửi request qua email, live chat hoặc form online",
      timeframe: "Trong vòng 30 ngày",
      icon: Mail,
      color: colorSchemes.primary.gradient,
      details: "Cung cấp order ID, lý do chi tiết và evidence (nếu có)",
    },
    {
      step: 2,
      title: "🔍 Review & Xác minh",
      description: "Team chuyên gia đánh giá và xác minh yêu cầu",
      timeframe: "1-2 ngày làm việc",
      icon: FileText,
      color: colorSchemes.info.gradient,
      details: "Kiểm tra điều kiện, lịch sử account và tính hợp lệ",
    },
    {
      step: 3,
      title: "✅ Phê duyệt quyết định",
      description: "Thông báo kết quả và confirm refund amount",
      timeframe: "2-3 ngày làm việc",
      icon: CheckCircle,
      color: colorSchemes.success.gradient,
      details: "Email xác nhận với breakdown chi tiết số tiền hoàn",
    },
    {
      step: 4,
      title: "💰 Xử lý hoàn tiền",
      description: "Transfer tiền về payment method gốc",
      timeframe: "3-10 ngày làm việc",
      icon: CreditCard,
      color: colorSchemes.warning.gradient,
      details: "Thời gian tùy thuộc vào bank/payment gateway",
    },
  ];

  const refundEligible = [
    {
      icon: CheckCircle,
      title: "🔧 Lỗi kỹ thuật nghiêm trọng",
      description:
        "Template không hoạt động, file corrupted, thiếu components quan trọng hoặc code errors không thể fix",
      color: "text-emerald-600",
      percentage: "95%",
      avgTime: "2-3 ngày",
    },
    {
      icon: CheckCircle,
      title: "📝 Không đúng mô tả",
      description:
        "Sản phẩm khác biệt hoàn toàn so với demo, thiếu features được cam kết hoặc design không match",
      color: "text-emerald-600",
      percentage: "92%",
      avgTime: "3-4 ngày",
    },
    {
      icon: CheckCircle,
      title: "💔 Không tương thích",
      description:
        "Template không work với framework version được advertised, browser compatibility issues",
      color: "text-emerald-600",
      percentage: "88%",
      avgTime: "2-3 ngày",
    },
    {
      icon: CheckCircle,
      title: "💳 Lỗi thanh toán double charge",
      description:
        "Bị charge nhiều lần cho cùng order, payment gateway errors, unauthorized charges",
      color: "text-emerald-600",
      percentage: "100%",
      avgTime: "1-2 ngày",
    },
    {
      icon: CheckCircle,
      title: "🔄 Mua nhầm sản phẩm",
      description:
        "Order sai template, wrong package, accidental purchase trong 24h và chưa download",
      color: "text-emerald-600",
      percentage: "98%",
      avgTime: "1 ngày",
    },
  ];

  const refundNotEligible = [
    {
      icon: XCircle,
      title: "💭 Thay đổi ý kiến cá nhân",
      description:
        "Không thích design, color scheme, style sau khi đã download và review kỹ",
      color: "text-red-600",
      percentage: "2%",
      alternative: "Có thể đổi sang product khác cùng giá trị",
    },
    {
      icon: XCircle,
      title: "🎓 Thiếu technical skills",
      description:
        "Không biết code, không hiểu cách customize, setup hoặc deploy template",
      color: "text-red-600",
      percentage: "5%",
      alternative: "Free support & tutorial videos available",
    },
    {
      icon: XCircle,
      title: "🚀 Đã sử dụng thương mại",
      description:
        "Template đã được deploy live, sử dụng cho client projects, commercial purposes",
      color: "text-red-600",
      percentage: "1%",
      alternative: "Có thể upgrade license nếu cần",
    },
    {
      icon: XCircle,
      title: "⏰ Quá thời hạn 30 ngày",
      description:
        "Request refund sau 30 ngày từ purchase date, late claims không valid",
      color: "text-red-600",
      percentage: "8%",
      alternative: "Có thể consider store credit trong special cases",
    },
  ];

  const refundScenarios = [
    {
      id: "technical-issue",
      title: "🛠️ Lỗi kỹ thuật",
      description: "Template có bugs, errors hoặc không hoạt động",
      icon: Settings,
      color: colorSchemes.primary.gradient,
      successRate: "95%",
      avgTime: "2-3 ngày",
      process: [
        "Liên hệ support với detailed error description",
        "Provide screenshots, console logs, error messages",
        "Technical team sẽ reproduce issue & verify",
        "Nếu confirmed bug, instant refund approval",
      ],
      tips: [
        "Include browser version & OS info",
        "Clear cache & try different browsers first",
        "Check if issue exists in original demo",
        "Document steps to reproduce error",
      ],
    },
    {
      id: "wrong-purchase",
      title: "🔄 Mua nhầm sản phẩm",
      description: "Order sai template hoặc package không phù hợp",
      icon: User,
      color: colorSchemes.success.gradient,
      successRate: "98%",
      avgTime: "1 ngày",
      process: [
        "Request trong vòng 24h từ lúc purchase",
        "Confirm chưa download product files",
        "Cung cấp order details & correct product needed",
        "Automatic refund hoặc product swap",
      ],
      tips: [
        "Act quickly - 24h window only",
        "Don't download files if want refund",
        "Consider product exchange option",
        "Double-check requirements next time",
      ],
    },
    {
      id: "quality-issue",
      title: "⭐ Chất lượng không đạt",
      description: "Product không match mô tả hoặc demo",
      icon: Shield,
      color: colorSchemes.info.gradient,
      successRate: "85%",
      avgTime: "3-5 ngày",
      process: [
        "Submit detailed comparison với demo",
        "Highlight specific discrepancies found",
        "Quality team sẽ review evidence thoroughly",
        "Decision based on objective assessment",
      ],
      tips: [
        "Use side-by-side comparisons",
        "Focus on functional differences",
        "Provide constructive feedback",
        "Be specific about expectations",
      ],
    },
    {
      id: "compatibility-issue",
      title: "🔧 Tương thích",
      description: "Không hoạt động với framework/platform được cam kết",
      icon: Code,
      color: colorSchemes.warning.gradient,
      successRate: "90%",
      avgTime: "3-4 ngày",
      process: [
        "Specify exact framework version used",
        "Provide environment setup details",
        "Include installation/setup errors encountered",
        "Technical verification by dev team",
      ],
      tips: [
        "Check system requirements first",
        "Try clean installation process",
        "Update dependencies to latest versions",
        "Test in minimal environment",
      ],
    },
  ];

  const stats = [
    {
      icon: Users,
      value: "99.2%",
      label: "Khách hàng hài lòng",
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      icon: Clock,
      value: "2.5 ngày",
      label: "Thời gian xử lý TB",
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    {
      icon: DollarSign,
      value: "$2.8M",
      label: "Đã hoàn tiền",
      color: "text-indigo-600",
      bg: "bg-indigo-100",
    },
    {
      icon: Shield,
      value: "0% Fraud",
      label: "Tỷ lệ gian lận",
      color: "text-cyan-600",
      bg: "bg-cyan-100",
    },
    {
      icon: TrendingUp,
      value: "8.5%",
      label: "Tỷ lệ refund",
      color: "text-teal-600",
      bg: "bg-teal-100",
    },
    {
      icon: Award,
      value: "4.9⭐",
      label: "Satisfaction rating",
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
  ];

  const contactOptions = [
    {
      icon: MessageCircle,
      title: "💬 Live Chat Priority",
      description: "Chat trực tiếp với refund specialist",
      action: "Bắt đầu chat ngay",
      color: colorSchemes.success.gradient,
      availability: "24/7",
      responseTime: "< 30 giây",
      satisfaction: "98.5%",
    },
    {
      icon: Mail,
      title: "📧 Email Refund Team",
      description: "refunds@templatemarket.vn",
      action: "Compose email",
      color: colorSchemes.primary.gradient,
      availability: "24/7",
      responseTime: "< 2 giờ",
      satisfaction: "97.8%",
    },
    {
      icon: Phone,
      title: "📞 Hotline Refunds",
      description: "+84 971 386 588 (ext. 3)",
      action: "Gọi ngay",
      color: colorSchemes.info.gradient,
      availability: "8AM-10PM",
      responseTime: "Ngay lập tức",
      satisfaction: "99.1%",
    },
    {
      icon: FileText,
      title: "📝 Online Refund Form",
      description: "Structured refund request form",
      action: "Điền form",
      color: colorSchemes.warning.gradient,
      availability: "24/7",
      responseTime: "< 4 giờ",
      satisfaction: "96.2%",
    },
  ];

  const paymentMethods = [
    { name: "💳 Visa/Mastercard", time: "3-5 ngày", fee: "Free" },
    { name: "🏦 Banking Transfer", time: "1-3 ngày", fee: "Free" },
    { name: "📱 MoMo Wallet", time: "Tức thì", fee: "Free" },
    { name: "💰 ZaloPay", time: "Tức thì", fee: "Free" },
    { name: "🌍 PayPal", time: "2-4 ngày", fee: "Free" },
    { name: "₿ Cryptocurrency", time: "1-2 giờ", fee: "Network fee" },
  ];

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
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const handleQuickRefund = () => {
    toast({
      title: "🚀 Đang chuyển hướng...",
      description: "Bạn sẽ được chuyển đến form yêu cầu hoàn tiền trong 3 giây",
    });
    setTimeout(() => {
      // Redirect to refund form
      window.location.href = "/refund-form";
    }, 3000);
  };

  return (
    <>
      <Helmet>
        <title>
          💰 Chính sách hoàn tiền | Template Market - 30 ngày không điều kiện
        </title>
        <meta
          name="description"
          content="Chính sách hoàn tiền 30 ngày không điều kiện của Template Market. Quy trình nhanh chóng, minh bạch với tỷ lệ approval 99.2%."
        />
        <meta
          name="keywords"
          content="hoàn tiền, refund policy, 30 ngày, template market, chính sách"
        />
        <link rel="canonical" href="https://templatemarket.vn/refund" />
      </Helmet>

      <ReadingProgress />
      <FloatingNav />

      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-cyan-900/20 dark:to-indigo-900/30">
        {/* ✅ Enhanced Hero Section */}
        <motion.section
          className="relative py-20 lg:py-32 overflow-hidden"
          style={{ y: headerY, opacity: headerOpacity }}
        >
          <div className="container relative z-10 px-4 mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-5xl mx-auto"
            >
              {/* Logo & Icon */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 10 }}
                className="flex items-center justify-center w-28 h-28 mx-auto mb-8 bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-500 rounded-3xl shadow-2xl"
              >
                <CreditCard className="w-14 h-14 text-white" />
              </motion.div>

              {/* Title */}
              <h1 className="mb-8 text-5xl lg:text-7xl font-bold leading-tight">
                <span className="text-transparent bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text">
                  Chính sách hoàn tiền
                </span>
                <br />
                <span className="text-2xl lg:text-3xl font-medium text-gray-700 dark:text-gray-300">
                  30 ngày không điều kiện
                </span>
              </h1>

              {/* Subtitle */}
              <p className="mb-12 text-xl lg:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-4xl mx-auto">
                Hoàn tiền
                <span className="text-transparent bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text font-semibold">
                  {" "}
                  100% trong 30 ngày{" "}
                </span>
                với
                <span className="text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text font-semibold">
                  {" "}
                  quy trình siêu nhanh{" "}
                </span>
                và minh bạch
              </p>

              {/* Features Badges */}
              <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
                <Badge className="px-6 py-3 text-base bg-white/90 backdrop-blur-sm shadow-lg border-0 text-gray-800">
                  <Clock className="w-5 h-5 mr-3 text-cyan-600" />
                  30 ngày guarantee
                </Badge>
                <Badge className="px-6 py-3 text-base bg-white/90 backdrop-blur-sm shadow-lg border-0 text-gray-800">
                  <DollarSign className="w-5 h-5 mr-3 text-emerald-600" />
                  100% money back
                </Badge>
                <Badge className="px-6 py-3 text-base bg-white/90 backdrop-blur-sm shadow-lg border-0 text-gray-800">
                  <Zap className="w-5 h-5 mr-3 text-blue-600" />
                  Lightning fast process
                </Badge>
                <Badge className="px-6 py-3 text-base bg-white/90 backdrop-blur-sm shadow-lg border-0 text-gray-800">
                  <Shield className="w-5 h-5 mr-3 text-indigo-600" />
                  Zero questions asked
                </Badge>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
                    whileHover={{ y: -10, scale: 1.05 }}
                    className="bg-white/90 backdrop-blur-lg rounded-2xl p-4 shadow-xl border border-white/40 hover:shadow-2xl transition-all duration-300"
                  >
                    <div
                      className={`w-10 h-10 mx-auto mb-2 rounded-xl ${stat.bg} flex items-center justify-center`}
                    >
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <div className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Quick Action Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="mt-12"
              >
                <Button
                  onClick={handleQuickRefund}
                  size="lg"
                  className="bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-600 hover:to-indigo-600 text-white px-12 py-4 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <CreditCard className="w-6 h-6 mr-3" />
                  Yêu cầu hoàn tiền ngay
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
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
          {/* ✅ Key Benefits */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <Card className="bg-gradient-to-br from-cyan-50/90 via-blue-50/90 to-indigo-50/90 dark:from-cyan-900/20 dark:via-blue-900/20 dark:to-indigo-900/20 border-0 shadow-2xl backdrop-blur-sm">
              <CardContent className="p-10">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                    🛡️ Cam kết hoàn tiền vượt trội
                  </h2>
                  <p className="text-xl text-gray-600 dark:text-gray-400">
                    Template Market tự hào với chính sách hoàn tiền hàng đầu thị
                    trường
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    {
                      icon: Calendar,
                      title: "30 ngày đầy đủ",
                      desc: "Thời gian dài nhất trong ngành",
                      detail: "Từ ngày purchase, không tính ngày download",
                      color: colorSchemes.success.gradient,
                    },
                    {
                      icon: RefreshCw,
                      title: "Quy trình tự động",
                      desc: "AI-powered refund processing",
                      detail: "Smart approval system cho 90% cases",
                      color: colorSchemes.primary.gradient,
                    },
                    {
                      icon: Zap,
                      title: "Siêu nhanh chóng",
                      desc: "Average 2.5 ngày completion",
                      detail: "Fastest refund time in industry",
                      color: colorSchemes.info.gradient,
                    },
                  ].map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.2 }}
                      whileHover={{ y: -10, scale: 1.02 }}
                      className="group text-center"
                    >
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        className={`flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-gradient-to-r ${benefit.color} rounded-2xl shadow-xl group-hover:shadow-2xl transition-all duration-300`}
                      >
                        <benefit.icon className="w-10 h-10 text-white" />
                      </motion.div>
                      <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-100">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 font-medium mb-2">
                        {benefit.desc}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        {benefit.detail}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* ✅ Enhanced Refund Timeline */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                ⏱️ Quy trình hoàn tiền chi tiết
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
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
                        ? "bg-gradient-to-br from-white to-cyan-50 shadow-2xl scale-105 border-cyan-200"
                        : "bg-white/80 hover:shadow-xl"
                    } backdrop-blur-sm border-0`}
                  >
                    <div className={`h-2 bg-gradient-to-r ${step.color}`} />
                    <CardContent className="p-8">
                      <motion.div
                        animate={
                          activeStep === index ? { scale: [1, 1.1, 1] } : {}
                        }
                        transition={{ duration: 0.6 }}
                        className={`flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-gradient-to-r ${step.color} rounded-2xl shadow-xl`}
                      >
                        <step.icon className="w-10 h-10 text-white" />
                      </motion.div>

                      <Badge
                        variant="outline"
                        className="mb-4 bg-cyan-100 text-cyan-700 border-cyan-200"
                      >
                        Bước {step.step}
                      </Badge>

                      <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-100">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        {step.description}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                        {step.details}
                      </p>

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

          {/* ✅ Enhanced Eligible vs Not Eligible */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                📋 Điều kiện hoàn tiền chi tiết
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Hiểu rõ những trường hợp được và không được hoàn tiền
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* ✅ Eligible Enhanced */}
              <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-2xl overflow-hidden">
                <div
                  className={`h-2 bg-gradient-to-r ${colorSchemes.success.gradient}`}
                />
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3 text-emerald-700 dark:text-emerald-300">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                      <CheckCircle className="w-8 h-8 text-emerald-600" />
                    </div>
                    <div>
                      <span className="text-2xl">✅ Được hoàn tiền</span>
                      <p className="text-sm font-normal text-gray-500 dark:text-gray-400 mt-1">
                        99.2% approval rate cho các trường hợp này
                      </p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {refundEligible.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ x: 5 }}
                      className={`group bg-gradient-to-r ${colorSchemes.success.bg} dark:bg-gradient-to-r ${colorSchemes.success.darkBg} p-6 rounded-xl border border-emerald-100 dark:border-emerald-800 hover:shadow-md transition-all duration-300`}
                    >
                      <div className="flex items-start space-x-4">
                        <item.icon
                          className={`w-6 h-6 mt-1 ${item.color} group-hover:scale-110 transition-transform duration-300`}
                        />
                        <div className="flex-1">
                          <h4 className="font-bold text-lg mb-2 text-emerald-800 dark:text-emerald-200">
                            {item.title}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                            {item.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm">
                            <Badge
                              variant="outline"
                              className="bg-emerald-100 text-emerald-700 border-emerald-200"
                            >
                              📊 {item.percentage} approval
                            </Badge>
                            <Badge
                              variant="outline"
                              className="bg-blue-100 text-blue-700 border-blue-200"
                            >
                              ⏱️ {item.avgTime}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>

              {/* ✅ Not Eligible Enhanced */}
              <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-2xl overflow-hidden">
                <div
                  className={`h-2 bg-gradient-to-r ${colorSchemes.danger.gradient}`}
                />
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3 text-red-700 dark:text-red-300">
                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl">
                      <XCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <div>
                      <span className="text-2xl">❌ Không được hoàn tiền</span>
                      <p className="text-sm font-normal text-gray-500 dark:text-gray-400 mt-1">
                        Nhưng chúng tôi vẫn có alternatives
                      </p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {refundNotEligible.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ x: -5 }}
                      className={`group bg-gradient-to-r ${colorSchemes.danger.bg} dark:bg-gradient-to-r ${colorSchemes.danger.darkBg} p-6 rounded-xl border border-red-100 dark:border-red-800 hover:shadow-md transition-all duration-300`}
                    >
                      <div className="flex items-start space-x-4">
                        <item.icon
                          className={`w-6 h-6 mt-1 ${item.color} group-hover:scale-110 transition-transform duration-300`}
                        />
                        <div className="flex-1">
                          <h4 className="font-bold text-lg mb-2 text-red-800 dark:text-red-200">
                            {item.title}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                            {item.description}
                          </p>
                          <div className="space-y-2">
                            <div className="flex items-center gap-4 text-sm">
                              <Badge
                                variant="outline"
                                className="bg-red-100 text-red-700 border-red-200"
                              >
                                📊 {item.percentage} success
                              </Badge>
                            </div>
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                              <p className="text-sm text-blue-700 dark:text-blue-300">
                                <strong>💡 Alternative:</strong>{" "}
                                {item.alternative}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </motion.section>

          {/* ✅ Enhanced Refund Scenarios */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                🎯 Các tình huống thường gặp
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Click vào từng scenario để xem quy trình chi tiết
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {refundScenarios.map((scenario) => (
                <motion.div
                  key={scenario.id}
                  whileHover={{ y: -10, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className={`cursor-pointer transition-all duration-500 border-2 h-full ${
                      selectedScenario === scenario.id
                        ? "border-cyan-400 shadow-2xl bg-gradient-to-br from-white to-cyan-50"
                        : "border-transparent hover:border-cyan-300 hover:shadow-xl"
                    } bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm overflow-hidden`}
                    onClick={() =>
                      setSelectedScenario(
                        selectedScenario === scenario.id ? null : scenario.id,
                      )
                    }
                  >
                    <div className={`h-2 bg-gradient-to-r ${scenario.color}`} />
                    <CardContent className="p-8 text-center">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className={`flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-gradient-to-r ${scenario.color} rounded-2xl shadow-lg`}
                      >
                        <scenario.icon className="w-8 h-8 text-white" />
                      </motion.div>

                      <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-100">
                        {scenario.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                        {scenario.description}
                      </p>

                      <div className="space-y-2 mb-6">
                        <Badge
                          variant="outline"
                          className="bg-emerald-100 text-emerald-700"
                        >
                          ✅ {scenario.successRate} success
                        </Badge>
                        <Badge
                          variant="outline"
                          className="bg-blue-100 text-blue-700"
                        >
                          ⏱️ {scenario.avgTime}
                        </Badge>
                      </div>

                      <Button
                        variant={
                          selectedScenario === scenario.id
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        className={
                          selectedScenario === scenario.id
                            ? `bg-gradient-to-r ${scenario.color} text-white border-0`
                            : ""
                        }
                      >
                        {selectedScenario === scenario.id
                          ? "👀 Đang xem"
                          : "👁️ Xem chi tiết"}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* ✅ Enhanced Selected Scenario Details */}
            <AnimatePresence>
              {selectedScenario && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="bg-gradient-to-br from-cyan-50/90 via-white to-indigo-50/90 dark:from-cyan-900/20 dark:via-slate-800 dark:to-indigo-900/20 border-0 shadow-2xl">
                    <CardContent className="p-10">
                      {refundScenarios.find((s) => s.id === selectedScenario) &&
                        (() => {
                          const scenario = refundScenarios.find(
                            (s) => s.id === selectedScenario,
                          )!;
                          return (
                            <div>
                              <div className="flex items-center gap-4 mb-8">
                                <div
                                  className={`p-4 bg-gradient-to-r ${scenario.color} rounded-2xl`}
                                >
                                  <scenario.icon className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                  <h3 className="text-3xl font-bold text-cyan-800 dark:text-cyan-200">
                                    {scenario.title}
                                  </h3>
                                  <p className="text-lg text-gray-600 dark:text-gray-400">
                                    {scenario.description}
                                  </p>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Process Steps */}
                                <div>
                                  <h4 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800 dark:text-gray-100">
                                    🔄 Quy trình xử lý
                                  </h4>
                                  <div className="space-y-4">
                                    {scenario.process.map((step, index) => (
                                      <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-start space-x-4 p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl shadow-md"
                                      >
                                        <div className="flex items-center justify-center w-8 h-8 bg-cyan-500 text-white text-sm font-bold rounded-full flex-shrink-0">
                                          {index + 1}
                                        </div>
                                        <p className="text-cyan-700 dark:text-cyan-300 leading-relaxed">
                                          {step}
                                        </p>
                                      </motion.div>
                                    ))}
                                  </div>
                                </div>

                                {/* Tips & Best Practices */}
                                <div>
                                  <h4 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800 dark:text-gray-100">
                                    💡 Tips & Best Practices
                                  </h4>
                                  <div className="space-y-4">
                                    {scenario.tips.map((tip, index) => (
                                      <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800"
                                      >
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                        <p className="text-blue-700 dark:text-blue-300 text-sm leading-relaxed">
                                          {tip}
                                        </p>
                                      </motion.div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>

          {/* ✅ Payment Methods Refund Time */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                💳 Thời gian hoàn tiền theo phương thức
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Tùy thuộc vào cách bạn thanh toán, thời gian nhận lại tiền sẽ
                khác nhau
              </p>
            </div>

            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-2xl">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paymentMethods.map((method, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -5, scale: 1.02 }}
                      className="bg-gradient-to-r from-gray-50 to-cyan-50 dark:from-gray-800 dark:to-cyan-900/20 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300"
                    >
                      <h4 className="text-lg font-bold mb-3 text-gray-800 dark:text-gray-200">
                        {method.name}
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Thời gian:
                          </span>
                          <Badge
                            variant="outline"
                            className="bg-blue-100 text-blue-700"
                          >
                            {method.time}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Phí:
                          </span>
                          <Badge
                            variant="outline"
                            className={
                              method.fee === "Free"
                                ? "bg-green-100 text-green-700"
                                : "bg-orange-100 text-orange-700"
                            }
                          >
                            {method.fee}
                          </Badge>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* ✅ Important Notice Enhanced */}
          <motion.section
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <Card className="bg-gradient-to-r from-amber-50/90 via-orange-50/90 to-red-50/90 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-red-900/20 border-0 shadow-2xl">
              <CardContent className="p-10">
                <div className="flex items-start space-x-6">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                    className="flex items-center justify-center w-20 h-20 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl shadow-xl"
                  >
                    <AlertTriangle className="w-10 h-10 text-white" />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="mb-6 text-3xl font-bold text-amber-800 dark:text-amber-200">
                      ⚡ Lưu ý quan trọng về chính sách
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        {
                          icon: Clock,
                          title: "30 ngày tính từ purchase",
                          desc: "Không phải từ lúc download hay sử dụng",
                        },
                        {
                          icon: CreditCard,
                          title: "Hoàn về phương thức gốc",
                          desc: "Same payment method được sử dụng lúc mua",
                        },
                        {
                          icon: Shield,
                          title: "Anti-fraud protection",
                          desc: "Chúng tôi có quyền từ chối nếu phát hiện abuse",
                        },
                        {
                          icon: Database,
                          title: "Transaction records",
                          desc: "Lưu trữ đầy đủ cho audit và compliance",
                        },
                      ].map((notice, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start space-x-3 bg-white/60 dark:bg-gray-800/60 p-4 rounded-lg border border-amber-200 dark:border-amber-800"
                        >
                          <notice.icon className="w-5 h-5 text-amber-600 mt-1" />
                          <div>
                            <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-1">
                              {notice.title}
                            </h4>
                            <p className="text-sm text-amber-700 dark:text-amber-300">
                              {notice.desc}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* ✅ Enhanced Contact for Refund */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="bg-gradient-to-br from-white via-cyan-50/50 to-indigo-50/50 dark:from-slate-800 dark:via-cyan-900/10 dark:to-indigo-900/10 border-0 shadow-2xl">
              <CardHeader className="text-center pb-10">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full shadow-2xl"
                >
                  <CreditCard className="w-10 h-10 text-white" />
                </motion.div>
                <CardTitle className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                  💰 Yêu cầu hoàn tiền ngay
                </CardTitle>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                  Không hài lòng với sản phẩm? Đừng lo lắng! Chúng tôi có 4 kênh
                  hỗ trợ hoàn tiền chuyên nghiệp với tỷ lệ thành công 99.2% và
                  thời gian xử lý siêu nhanh.
                </p>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {contactOptions.map((option, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -10, scale: 1.05 }}
                      className="text-center group cursor-pointer"
                    >
                      <Card className="h-full transition-all duration-500 hover:shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 overflow-hidden">
                        <div
                          className={`h-2 bg-gradient-to-r ${option.color}`}
                        />
                        <CardContent className="p-8">
                          <motion.div
                            whileHover={{ scale: 1.2, rotate: 10 }}
                            className={`flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-gradient-to-r ${option.color} rounded-2xl shadow-xl group-hover:shadow-2xl transition-all duration-300`}
                          >
                            <option.icon className="w-8 h-8 text-white" />
                          </motion.div>

                          <h4 className="font-bold text-lg mb-2 group-hover:text-cyan-600 transition-colors text-gray-800 dark:text-gray-200">
                            {option.title}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400 font-medium mb-4">
                            {option.description}
                          </p>

                          <div className="space-y-2 mb-6 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">
                                Availability:
                              </span>
                              <Badge
                                variant="outline"
                                className="bg-blue-100 text-blue-700"
                              >
                                {option.availability}
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">
                                Response:
                              </span>
                              <Badge
                                variant="outline"
                                className="bg-green-100 text-green-700"
                              >
                                {option.responseTime}
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">
                                Satisfaction:
                              </span>
                              <Badge
                                variant="outline"
                                className="bg-yellow-100 text-yellow-700"
                              >
                                ⭐ {option.satisfaction}
                              </Badge>
                            </div>
                          </div>

                          <Button
                            className={`w-full bg-gradient-to-r ${option.color} hover:shadow-lg transition-all duration-300 text-white border-0`}
                          >
                            {option.action}
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                <Separator className="my-12" />

                <div className="text-center space-y-8">
                  <h4 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                    📋 Thông tin cần chuẩn bị khi yêu cầu hoàn tiền
                  </h4>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                      {
                        icon: Mail,
                        label: "Email tài khoản",
                        desc: "Registered email address",
                      },
                      {
                        icon: FileText,
                        label: "Order ID",
                        desc: "Transaction reference number",
                      },
                      {
                        icon: Calendar,
                        label: "Purchase date",
                        desc: "Ngày mua sản phẩm",
                      },
                      {
                        icon: MessageCircle,
                        label: "Lý do chi tiết",
                        desc: "Specific reason for refund",
                      },
                    ].map((info, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 shadow-md border border-gray-200 dark:border-gray-700"
                      >
                        <info.icon className="w-8 h-8 mx-auto mb-3 text-cyan-600" />
                        <h5 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                          {info.label}
                        </h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {info.desc}
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-r from-cyan-50 to-indigo-50 dark:from-cyan-900/20 dark:to-indigo-900/20 p-6 rounded-xl border border-cyan-200 dark:border-cyan-800"
                  >
                    <h5 className="text-lg font-bold text-cyan-800 dark:text-cyan-200 mb-3">
                      🎯 Pro Tips for Faster Processing
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-cyan-700 dark:text-cyan-300">
                      <div className="flex items-center gap-2">
                        <ThumbsUp className="w-4 h-4" />
                        <span>Be specific about issues</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Copy className="w-4 h-4" />
                        <span>Include screenshots/evidence</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        <span>Reference original product listing</span>
                      </div>
                    </div>
                  </motion.div>
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
