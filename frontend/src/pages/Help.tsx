import React, { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  HelpCircle,
  Search,
  MessageSquare,
  FileText,
  CreditCard,
  Download,
  Settings,
  User,
  ShoppingCart,
  Lock,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  ExternalLink,
  BookOpen,
  Video,
  MessageCircle,
  ChevronRight,
  Star,
  ThumbsUp,
  Users,
  Zap,
  Award,
  HeartHandshake,
  Shield,
  Globe,
  Smartphone,
  Monitor,
  Headphones,
  LifeBuoy,
  TrendingUp,
  Calendar,
  Gift,
  Lightbulb,
  Rocket,
  Target,
  Coffee,
  Cpu,
  Database,
  Code,
  Palette,
  Layers,
  Eye,
  MousePointer,
  ArrowUp,
  ChevronDown,
  Filter,
  Bookmark,
  Share2,
  Copy,
  Heart,
  PlayCircle,
  ArrowRight,
} from "lucide-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { toast } from "@/hooks/use-toast";

const Help: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showFloatingNav, setShowFloatingNav] = useState(false);
  const [activeTab, setActiveTab] = useState("popular");

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
    info: {
      gradient: "from-indigo-500 via-purple-500 to-blue-500",
      bg: "from-indigo-50/80 to-purple-50/80",
      darkBg: "from-indigo-900/30 to-purple-900/30",
      accent: "text-indigo-600",
    },
    warning: {
      gradient: "from-amber-500 via-orange-500 to-red-500",
      bg: "from-amber-50/80 to-orange-50/80",
      darkBg: "from-amber-900/30 to-orange-900/30",
      accent: "text-amber-600",
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

  const categories = [
    {
      id: "account",
      icon: User,
      title: "Tài khoản & Hồ sơ",
      description: "Đăng ký, đăng nhập, quản lý profile",
      count: 18,
      color: colorSchemes.primary.gradient,
      bgColor: colorSchemes.primary.bg,
      darkBg: colorSchemes.primary.darkBg,
      topics: [
        "Tạo tài khoản",
        "Đăng nhập",
        "Quên mật khẩu",
        "Cập nhật thông tin",
        "Xóa tài khoản",
      ],
    },
    {
      id: "purchase",
      icon: ShoppingCart,
      title: "Mua hàng & Thanh toán",
      description: "Đặt hàng, thanh toán, hóa đơn, ưu đãi",
      count: 25,
      color: colorSchemes.success.gradient,
      bgColor: colorSchemes.success.bg,
      darkBg: colorSchemes.success.darkBg,
      topics: [
        "Phương thức thanh toán",
        "Mã giảm giá",
        "Hóa đơn",
        "Lỗi thanh toán",
        "Combo deals",
      ],
    },
    {
      id: "download",
      icon: Download,
      title: "Tải xuống & Cài đặt",
      description: "Download, setup, hướng dẫn sử dụng",
      count: 32,
      color: colorSchemes.info.gradient,
      bgColor: colorSchemes.info.bg,
      darkBg: colorSchemes.info.darkBg,
      topics: [
        "Cách download",
        "Giải nén file",
        "Cài đặt",
        "Cấu hình",
        "Troubleshooting",
      ],
    },
    {
      id: "refund",
      icon: CreditCard,
      title: "Hoàn tiền & Bảo hành",
      description: "Chính sách hoàn tiền, đổi trả, bảo hành",
      count: 12,
      color: colorSchemes.warning.gradient,
      bgColor: colorSchemes.warning.bg,
      darkBg: colorSchemes.warning.darkBg,
      topics: [
        "Điều kiện hoàn tiền",
        "Quy trình đổi trả",
        "Thời gian xử lý",
        "Bảo hành",
        "Khiếu nại",
      ],
    },
    {
      id: "customization",
      icon: Settings,
      title: "Tùy chỉnh & Phát triển",
      description: "Custom code, modification, advanced",
      count: 28,
      color: colorSchemes.primary.gradient,
      bgColor: colorSchemes.primary.bg,
      darkBg: colorSchemes.primary.darkBg,
      topics: [
        "Edit HTML/CSS",
        "JavaScript custom",
        "PHP modification",
        "Database setup",
        "API integration",
      ],
    },
    {
      id: "security",
      icon: Lock,
      title: "Bảo mật & Quyền riêng tư",
      description: "SSL, bảo mật, privacy, GDPR",
      count: 15,
      color: colorSchemes.info.gradient,
      bgColor: colorSchemes.info.bg,
      darkBg: colorSchemes.info.darkBg,
      topics: [
        "Bảo mật website",
        "SSL certificate",
        "Privacy policy",
        "GDPR compliance",
        "Data protection",
      ],
    },
  ];

  const popularArticles = [
    {
      title: "🚀 Hướng dẫn tải xuống và cài đặt template hoàn chỉnh",
      views: "45.2K",
      rating: 4.9,
      category: "Tải xuống",
      readTime: "8 phút",
      lastUpdated: "2 ngày trước",
      difficulty: "Dễ",
      tags: ["Setup", "Installation", "Beginner"],
      thumbnail: "🎨",
    },
    {
      title: "💳 Tất cả về thanh toán: VNPay, MoMo, Banking và thẻ quốc tế",
      views: "32.8K",
      rating: 4.8,
      category: "Thanh toán",
      readTime: "12 phút",
      lastUpdated: "1 tuần trước",
      difficulty: "Dễ",
      tags: ["Payment", "VNPay", "MoMo", "Banking"],
      thumbnail: "💰",
    },
    {
      title: "🔄 Chính sách hoàn tiền chi tiết và quy trình xử lý",
      views: "28.7K",
      rating: 4.7,
      category: "Hoàn tiền",
      readTime: "6 phút",
      lastUpdated: "3 ngày trước",
      difficulty: "Dễ",
      tags: ["Refund", "Policy", "Process"],
      thumbnail: "🔄",
    },
    {
      title: "🎨 Tùy chỉnh template: HTML, CSS, JavaScript advanced",
      views: "24.9K",
      rating: 4.8,
      category: "Tùy chỉnh",
      readTime: "25 phút",
      lastUpdated: "1 ngày trước",
      difficulty: "Khó",
      tags: ["HTML", "CSS", "JavaScript", "Advanced"],
      thumbnail: "⚙️",
    },
    {
      title: "🔧 Khắc phục 20+ lỗi thường gặp khi sử dụng templates",
      views: "19.3K",
      rating: 4.6,
      category: "Khắc phục",
      readTime: "15 phút",
      lastUpdated: "4 ngày trước",
      difficulty: "Trung bình",
      tags: ["Troubleshooting", "Bugs", "Fixes"],
      thumbnail: "🔧",
    },
    {
      title: "📱 Responsive design: Tối ưu template cho mobile",
      views: "16.8K",
      rating: 4.9,
      category: "Mobile",
      readTime: "18 phút",
      lastUpdated: "5 ngày trước",
      difficulty: "Trung bình",
      tags: ["Responsive", "Mobile", "Optimization"],
      thumbnail: "📱",
    },
  ];

  const quickGuides = [
    {
      icon: BookOpen,
      title: "📚 Quick Start Guide",
      description: "Bắt đầu từ zero đến hero trong 10 phút",
      link: "/quick-start",
      color: colorSchemes.primary.gradient,
      time: "10 phút",
      level: "Beginner",
    },
    {
      icon: Video,
      title: "🎥 Video Tutorials",
      description: "50+ video hướng dẫn chi tiết từng bước",
      link: "/video-tutorials",
      color: colorSchemes.info.gradient,
      time: "2-15 phút",
      level: "All levels",
    },
    {
      icon: MessageCircle,
      title: "💬 Live Chat 24/7",
      description: "Chat trực tiếp với expert, giải đáp tức thì",
      link: "/live-chat",
      color: colorSchemes.success.gradient,
      time: "< 30 giây",
      level: "Instant help",
    },
    {
      icon: Code,
      title: "💻 Code Examples",
      description: "Library 500+ code snippets và examples",
      link: "/code-examples",
      color: colorSchemes.warning.gradient,
      time: "1-5 phút",
      level: "Developer",
    },
  ];

  const contactOptions = [
    {
      icon: MessageSquare,
      title: "💬 Live Chat",
      description: "Chat với AI Bot & Human Expert",
      time: "< 30 giây",
      action: "Bắt đầu chat",
      color: colorSchemes.success.gradient,
      availability: "24/7",
      satisfaction: "98.5%",
    },
    {
      icon: Mail,
      title: "📧 Email Premium",
      description: "support@templatemarket.vn",
      time: "< 1 giờ",
      action: "Gửi email",
      color: colorSchemes.primary.gradient,
      availability: "24/7",
      satisfaction: "96.8%",
    },
    {
      icon: Phone,
      title: "📞 Hotline VIP",
      description: "+84 971 386 588",
      time: "Ngay lập tức",
      action: "Gọi ngay",
      color: colorSchemes.info.gradient,
      availability: "6AM - 12PM",
      satisfaction: "99.2%",
    },
    {
      icon: Headphones,
      title: "🎧 Video Call",
      description: "Screen sharing & voice support",
      time: "Book slot",
      action: "Đặt lịch",
      color: colorSchemes.warning.gradient,
      availability: "9AM - 9PM",
      satisfaction: "99.8%",
    },
  ];

  const stats = [
    {
      icon: Users,
      value: "50K+",
      label: "Khách hàng hài lòng",
      color: "text-cyan-600",
    },
    {
      icon: Clock,
      value: "< 5 min",
      label: "Thời gian phản hồi",
      color: "text-emerald-600",
    },
    {
      icon: Star,
      value: "4.9/5",
      label: "Đánh giá dịch vụ",
      color: "text-amber-600",
    },
    {
      icon: Award,
      value: "99.8%",
      label: "Tỷ lệ giải quyết",
      color: "text-indigo-600",
    },
  ];

  const systemStatus = [
    { name: "🌐 Website", status: "online", uptime: "99.9%" },
    { name: "🔌 API Services", status: "online", uptime: "99.8%" },
    { name: "💾 Download System", status: "online", uptime: "99.9%" },
    { name: "💳 Payment Gateway", status: "online", uptime: "99.7%" },
    { name: "☁️ CDN Network", status: "online", uptime: "99.9%" },
    { name: "📧 Email System", status: "online", uptime: "99.8%" },
  ];

  const faqData = [
    {
      id: "faq1",
      question: "🚀 Làm thế nào để download template sau khi mua?",
      answer: `Sau khi thanh toán thành công, bạn có thể download template theo các bước sau:

**Cách 1: Qua Email**
1. Check email xác nhận đặt hàng
2. Click vào link download trong email
3. File sẽ được tải xuống tự động

**Cách 2: Qua tài khoản**
1. Đăng nhập vào tài khoản
2. Vào mục "My Downloads" 
3. Click "Download Now" bên cạnh sản phẩm

**Cách 3: Qua Dashboard**
1. Truy cập dashboard.templatemarket.vn
2. Xem lịch sử mua hàng
3. Download unlimited lần trong 12 tháng

💡 **Tips**: File download có thể lên đến 100MB, đảm bảo kết nối internet ổn định.`,
      category: "download",
    },
    {
      id: "faq2",
      question: "💳 Tôi có thể thanh toán bằng những phương thức nào?",
      answer: `Template Market hỗ trợ đa dạng phương thức thanh toán tiện lợi:

**💎 Ví điện tử**
• MoMo (Ưu đãi -5%)
• ZaloPay 
• ShopeePay
• VNPay QR

**🏦 Ngân hàng**
• Internet Banking (38+ ngân hàng)
• ATM Card (Visa, Master, JCB)
• Chuyển khoản trực tiếp

**🌍 Quốc tế**
• Visa/Mastercard
• PayPal (Coming soon)
• Stripe

**🎁 Khuyến mãi đặc biệt**
• Giảm 10% khi thanh toán qua MoMo
• Cashback 2% cho thành viên VIP
• Miễn phí ship với đơn > 500K`,
      category: "payment",
    },
    {
      id: "faq3",
      question: "🔄 Chính sách hoàn tiền như thế nào?",
      answer: `Chúng tôi cam kết chính sách hoàn tiền rõ ràng và công bằng:

**✅ Điều kiện hoàn tiền**
• Sản phẩm không như mô tả
• Lỗi kỹ thuật không thể khắc phục
• Trùng lặp đơn hàng do lỗi hệ thống

**⏰ Thời gian**
• Yêu cầu hoàn tiền: Trong 7 ngày
• Xử lý: 2-3 ngày làm việc
• Nhận tiền: 3-7 ngày tùy ngân hàng

**📝 Quy trình**
1. Gửi yêu cầu qua email/chat
2. Cung cấp mã đơn hàng
3. Team review trong 24h
4. Xác nhận và tiến hành hoàn tiền

**💡 Lưu ý**: Không hoàn tiền với digital products đã download thành công trừ lỗi kỹ thuật.`,
      category: "refund",
    },
  ];

  const filteredCategories = categories.filter(
    (category) =>
      category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Dễ":
        return "text-green-600 bg-green-100";
      case "Trung bình":
        return "text-amber-600 bg-amber-100";
      case "Khó":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

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

  const handleSupportAction = (action: string) => {
    toast({
      title: "🚀 Đang kết nối...",
      description: `Bạn sẽ được chuyển đến ${action} trong giây lát.`,
    });
  };

  return (
    <>
      <Helmet>
        <title>🆘 Trung tâm trợ giúp | Template Market - Hỗ trợ 24/7</title>
        <meta
          name="description"
          content="Trung tâm trợ giúp toàn diện của Template Market. Tìm câu trả lời tức thì, hướng dẫn chi tiết, video tutorials và hỗ trợ live chat 24/7."
        />
        <meta
          name="keywords"
          content="trung tâm trợ giúp, help center, hỗ trợ, FAQ, hướng dẫn, template market"
        />
        <link rel="canonical" href="https://templatemarket.vn/help" />
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
                <HelpCircle className="w-14 h-14 text-white" />
              </motion.div>

              {/* Title */}
              <h1 className="mb-8 text-5xl lg:text-7xl font-bold leading-tight">
                <span className="text-transparent bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text">
                  Trung tâm trợ giúp
                </span>
                <br />
                <span className="text-2xl lg:text-3xl font-medium text-gray-700 dark:text-gray-300">
                  Giải đáp mọi thắc mắc của bạn
                </span>
              </h1>

              {/* Subtitle */}
              <p className="mb-12 text-xl lg:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-4xl mx-auto">
                Tìm câu trả lời nhanh chóng với
                <span className="text-transparent bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text font-semibold">
                  {" "}
                  hệ thống hỗ trợ thông minh{" "}
                </span>
                và
                <span className="text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text font-semibold">
                  {" "}
                  đội ngũ expert 24/7{" "}
                </span>
              </p>

              {/* ✅ Enhanced Search Bar */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="relative max-w-3xl mx-auto mb-12"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-2xl blur-lg opacity-20 animate-pulse"></div>
                <div className="relative">
                  <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-500 z-10" />
                  <Input
                    placeholder="🔍 Tìm kiếm câu hỏi, hướng dẫn, video tutorials..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-16 pr-6 py-6 text-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-0 shadow-xl rounded-2xl focus:ring-4 focus:ring-cyan-200 dark:focus:ring-cyan-800 transition-all duration-300 text-gray-800 dark:text-gray-200"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 shadow-lg text-white border-0"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      AI Search
                    </Button>
                  </div>
                </div>
              </motion.div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
                    whileHover={{ y: -10, scale: 1.05 }}
                    className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/40 hover:shadow-2xl transition-all duration-300"
                  >
                    <stat.icon
                      className={`w-8 h-8 mx-auto mb-3 ${stat.color}`}
                    />
                    <div className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
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
          {/* ✅ Enhanced Quick Access Guides */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                🚀 Bắt đầu ngay
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Các hướng dẫn nhanh để bạn có thể sử dụng ngay lập tức
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {quickGuides.map((guide, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                >
                  <Card className="group h-full transition-all duration-500 hover:shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 overflow-hidden">
                    <div className={`h-2 bg-gradient-to-r ${guide.color}`} />
                    <CardContent className="p-8 text-center">
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 5 }}
                        className={`flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-gradient-to-r ${guide.color} rounded-2xl shadow-xl`}
                      >
                        <guide.icon className="w-10 h-10 text-white" />
                      </motion.div>
                      <h3 className="mb-4 text-xl font-bold text-gray-800 dark:text-gray-100">
                        {guide.title}
                      </h3>
                      <p className="mb-6 text-gray-600 dark:text-gray-400 leading-relaxed">
                        {guide.description}
                      </p>
                      <div className="flex justify-between items-center mb-6 text-sm">
                        <Badge
                          variant="outline"
                          className="bg-cyan-50 text-cyan-700 border-cyan-200"
                        >
                          ⏱️ {guide.time}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="bg-emerald-50 text-emerald-700 border-emerald-200"
                        >
                          📊 {guide.level}
                        </Badge>
                      </div>
                      <Button
                        className={`w-full bg-gradient-to-r ${guide.color} hover:shadow-lg transition-all duration-300 text-white border-0`}
                        onClick={() => handleSupportAction(guide.title)}
                      >
                        Bắt đầu ngay
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* ✅ Enhanced Categories */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                📚 Danh mục hỗ trợ
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Tìm câu trả lời theo từng chủ đề cụ thể
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCategories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  onClick={() => setSelectedCategory(category.id)}
                  className="cursor-pointer"
                >
                  <Card
                    className={`group h-full transition-all duration-500 hover:shadow-2xl bg-gradient-to-br ${category.bgColor} dark:bg-gradient-to-br ${category.darkBg} backdrop-blur-sm border-0 overflow-hidden`}
                  >
                    <CardContent className="p-8">
                      <div className="flex items-start justify-between mb-6">
                        <motion.div
                          whileHover={{ scale: 1.2, rotate: 10 }}
                          className={`flex items-center justify-center w-16 h-16 bg-gradient-to-r ${category.color} rounded-2xl shadow-lg`}
                        >
                          <category.icon className="w-8 h-8 text-white" />
                        </motion.div>
                        <Badge
                          variant="secondary"
                          className="bg-white/90 text-gray-700 text-lg px-3 py-1"
                        >
                          {category.count}
                        </Badge>
                      </div>

                      <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-100">
                        {category.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                        {category.description}
                      </p>

                      <div className="space-y-2 mb-6">
                        {category.topics
                          .slice(0, 3)
                          .map((topic, topicIndex) => (
                            <div
                              key={topicIndex}
                              className="flex items-center text-sm text-gray-600 dark:text-gray-400"
                            >
                              <CheckCircle className="w-3 h-3 mr-2 text-emerald-500" />
                              {topic}
                            </div>
                          ))}
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 text-cyan-600 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-300 font-semibold group-hover:translate-x-1 transition-all duration-300"
                      >
                        Xem tất cả
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* ✅ Enhanced Popular Articles */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                🔥 Bài viết phổ biến
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Những hướng dẫn được đọc nhiều nhất và đánh giá cao
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {popularArticles.map((article, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                >
                  <Card className="group h-full transition-all duration-500 hover:shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="text-3xl">{article.thumbnail}</div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold mb-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors leading-tight text-gray-800 dark:text-gray-100">
                            {article.title}
                          </h3>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mb-4">
                        <Badge
                          variant="outline"
                          className="bg-cyan-50 text-cyan-700 border-cyan-200"
                        >
                          {article.category}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {article.readTime}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {article.lastUpdated}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {article.tags.slice(0, 3).map((tag, tagIndex) => (
                          <Badge
                            key={tagIndex}
                            variant="secondary"
                            className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1 text-emerald-600">
                            <Users className="w-4 h-4" />
                            <span className="font-semibold">
                              {article.views}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-amber-600">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="font-semibold">
                              {article.rating}
                            </span>
                          </div>
                        </div>

                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-0 hover:shadow-lg"
                        >
                          <PlayCircle className="w-4 h-4 mr-2" />
                          Đọc ngay
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* ✅ FAQ Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                ❓ Câu hỏi thường gặp
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Những câu hỏi được hỏi nhiều nhất và câu trả lời chi tiết
              </p>
            </div>
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-8">
                <Accordion type="single" collapsible className="space-y-4">
                  {faqData.map((faq, index) => (
                    <AccordionItem
                      key={faq.id}
                      value={faq.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-xl px-6 data-[state=open]:shadow-lg transition-all duration-300 bg-white/60 dark:bg-slate-700/60"
                    >
                      <AccordionTrigger className="text-left hover:no-underline py-6">
                        <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                          {faq.question}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="pb-6">
                        <div className="prose prose-cyan max-w-none">
                          <div className="whitespace-pre-line text-gray-600 dark:text-gray-400 leading-relaxed">
                            {faq.answer}
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </motion.section>

          {/* ✅ Enhanced Contact Support */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                🤝 Liên hệ hỗ trợ
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Không tìm thấy câu trả lời? Đội ngũ chuyên gia của chúng tôi
                luôn sẵn sàng hỗ trợ bạn với nhiều kênh liên lạc tiện lợi.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {contactOptions.map((option, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.05 }}
                >
                  <Card className="group h-full transition-all duration-500 hover:shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0">
                    <CardContent className="p-8 text-center">
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        className={`flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-gradient-to-r ${option.color} rounded-2xl shadow-xl`}
                      >
                        <option.icon className="w-10 h-10 text-white" />
                      </motion.div>
                      <h3 className="mb-3 text-xl font-bold text-gray-800 dark:text-gray-100">
                        {option.title}
                      </h3>
                      <p className="mb-4 text-gray-600 dark:text-gray-400">
                        {option.description}
                      </p>

                      <div className="space-y-2 mb-6 text-sm">
                        <div className="flex items-center justify-center gap-2">
                          <Clock className="w-4 h-4 text-cyan-500" />
                          <span className="text-gray-600 dark:text-gray-400">
                            Phản hồi {option.time}
                          </span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <Users className="w-4 h-4 text-emerald-500" />
                          <span className="text-gray-600 dark:text-gray-400">
                            {option.availability}
                          </span>
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <Star className="w-4 h-4 text-amber-500" />
                          <span className="text-gray-600 dark:text-gray-400">
                            {option.satisfaction} hài lòng
                          </span>
                        </div>
                      </div>

                      <Button
                        className={`w-full bg-gradient-to-r ${option.color} hover:shadow-lg transition-all duration-300 text-white border-0`}
                        onClick={() => handleSupportAction(option.action)}
                      >
                        {option.action}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* ✅ Enhanced System Status */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="bg-gradient-to-br from-emerald-50/90 via-teal-50/90 to-cyan-50/90 dark:from-emerald-900/20 dark:via-teal-900/20 dark:to-cyan-900/20 border-0 shadow-2xl">
              <CardContent className="p-10">
                <div className="text-center mb-10">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full shadow-2xl"
                  >
                    <CheckCircle className="w-10 h-10 text-white" />
                  </motion.div>
                  <h3 className="mb-4 text-3xl font-bold text-emerald-800 dark:text-emerald-200">
                    🟢 Tất cả hệ thống hoạt động bình thường
                  </h3>
                  <p className="text-emerald-700 dark:text-emerald-300 text-lg mb-6">
                    Mọi dịch vụ đang vận hành ổn định với hiệu suất cao. Thời
                    gian phản hồi trung bình:
                    <span className="font-bold"> 50ms</span>
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {systemStatus.map((system, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="text-center bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-4 shadow-md"
                    >
                      <div className="flex items-center justify-center mb-3">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-md"></div>
                      </div>
                      <div className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">
                        {system.name}
                      </div>
                      <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                        {system.uptime} uptime
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 text-center">
                  <Button
                    variant="outline"
                    className="bg-white/70 hover:bg-white/90 border-emerald-300 text-emerald-700 hover:text-emerald-800"
                    onClick={() => handleSupportAction("Trạng thái hệ thống")}
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    Xem trạng thái chi tiết
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.section>
        </div>
      </div>
    </>
  );
};

export default Help;
