import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Help: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [scrollY, setScrollY] = useState(0);

  // ✅ Scroll Animation Effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
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
      color: "from-blue-500 to-cyan-400",
      bgColor: "from-blue-50 to-cyan-50",
      darkBg: "from-blue-900/20 to-cyan-900/20",
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
      color: "from-emerald-500 to-green-400",
      bgColor: "from-emerald-50 to-green-50",
      darkBg: "from-emerald-900/20 to-green-900/20",
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
      color: "from-purple-500 to-pink-400",
      bgColor: "from-purple-50 to-pink-50",
      darkBg: "from-purple-900/20 to-pink-900/20",
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
      color: "from-orange-500 to-red-400",
      bgColor: "from-orange-50 to-red-50",
      darkBg: "from-orange-900/20 to-red-900/20",
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
      color: "from-indigo-500 to-blue-400",
      bgColor: "from-indigo-50 to-blue-50",
      darkBg: "from-indigo-900/20 to-blue-900/20",
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
      color: "from-pink-500 to-purple-400",
      bgColor: "from-pink-50 to-purple-50",
      darkBg: "from-pink-900/20 to-purple-900/20",
      topics: [
        "Bảo mật website",
        "SSL certificate",
        "Privacy policy",
        "GDPR compliance",
        "Data protection",
      ],
    },
    {
      id: "technical",
      icon: Code,
      title: "Hỗ trợ kỹ thuật",
      description: "Bugs, performance, compatibility",
      count: 22,
      color: "from-teal-500 to-cyan-400",
      bgColor: "from-teal-50 to-cyan-50",
      darkBg: "from-teal-900/20 to-cyan-900/20",
      topics: [
        "Bug reports",
        "Performance optimization",
        "Browser compatibility",
        "Mobile responsive",
        "Speed optimization",
      ],
    },
    {
      id: "business",
      icon: Target,
      title: "Giải pháp doanh nghiệp",
      description: "Enterprise, license, bulk purchase",
      count: 10,
      color: "from-amber-500 to-orange-400",
      bgColor: "from-amber-50 to-orange-50",
      darkBg: "from-amber-900/20 to-orange-900/20",
      topics: [
        "Enterprise license",
        "Bulk pricing",
        "White label",
        "Custom development",
        "Priority support",
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
    },
    {
      title: "⚡ Tăng tốc website: Performance optimization guide",
      views: "14.5K",
      rating: 4.7,
      category: "Performance",
      readTime: "20 phút",
      lastUpdated: "1 tuần trước",
      difficulty: "Khó",
      tags: ["Performance", "Speed", "Optimization"],
    },
    {
      title: "🔒 Bảo mật website: SSL, Security headers, Best practices",
      views: "12.1K",
      rating: 4.8,
      category: "Bảo mật",
      readTime: "22 phút",
      lastUpdated: "3 ngày trước",
      difficulty: "Khó",
      tags: ["Security", "SSL", "Protection"],
    },
  ];

  const quickGuides = [
    {
      icon: BookOpen,
      title: "📚 Quick Start Guide",
      description: "Bắt đầu từ zero đến hero trong 10 phút",
      link: "/quick-start",
      color: "from-blue-500 to-cyan-400",
      time: "10 phút",
      level: "Beginner",
    },
    {
      icon: Video,
      title: "🎥 Video Tutorials",
      description: "50+ video hướng dẫn chi tiết từng bước",
      link: "/video-tutorials",
      color: "from-purple-500 to-pink-400",
      time: "2-15 phút",
      level: "All levels",
    },
    {
      icon: MessageCircle,
      title: "💬 Live Chat 24/7",
      description: "Chat trực tiếp với expert, giải đáp tức thì",
      link: "/live-chat",
      color: "from-emerald-500 to-green-400",
      time: "< 30 giây",
      level: "Instant help",
    },
    {
      icon: Code,
      title: "💻 Code Examples",
      description: "Library 500+ code snippets và examples",
      link: "/code-examples",
      color: "from-orange-500 to-red-400",
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
      color: "from-emerald-500 to-green-400",
      availability: "24/7",
      satisfaction: "98.5%",
    },
    {
      icon: Mail,
      title: "📧 Email Premium",
      description: "support@templatehub.vn",
      time: "< 1 giờ",
      action: "Gửi email",
      color: "from-blue-500 to-cyan-400",
      availability: "24/7",
      satisfaction: "96.8%",
    },
    {
      icon: Phone,
      title: "📞 Hotline VIP",
      description: "+84 971 386 588",
      time: "Ngay lập tức",
      action: "Gọi ngay",
      color: "from-purple-500 to-pink-400",
      availability: "6AM - 12PM",
      satisfaction: "99.2%",
    },
    {
      icon: Headphones,
      title: "🎧 Video Call",
      description: "Screen sharing & voice support",
      time: "Book slot",
      action: "Đặt lịch",
      color: "from-orange-500 to-red-400",
      availability: "9AM - 9PM",
      satisfaction: "99.8%",
    },
  ];

  const stats = [
    {
      icon: Users,
      value: "50K+",
      label: "Khách hàng hài lòng",
      color: "text-blue-600",
    },
    {
      icon: Clock,
      value: "< 5 min",
      label: "Thời gian phản hồi",
      color: "text-green-600",
    },
    {
      icon: Star,
      value: "4.9/5",
      label: "Đánh giá dịch vụ",
      color: "text-yellow-600",
    },
    {
      icon: Award,
      value: "99.8%",
      label: "Tỷ lệ giải quyết",
      color: "text-purple-600",
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
1. Truy cập dashboard.templatehub.vn
2. Xem lịch sử mua hàng
3. Download unlimited lần trong 12 tháng

💡 **Tips**: File download có thể lên đến 100MB, đảm bảo kết nối internet ổn định.`,
      category: "download",
    },
    {
      id: "faq2",
      question: "💳 Tôi có thể thanh toán bằng những phương thức nào?",
      answer: `Template Hub hỗ trợ đa dạng phương thức thanh toán tiện lợi:

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
        return "text-yellow-600 bg-yellow-100";
      case "Khó":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900">
      <Helmet>
        <title>🆘 Trung tâm trợ giúp | Template Hub - Hỗ trợ 24/7</title>
        <meta
          name="description"
          content="Trung tâm trợ giúp toàn diện của Template Hub. Tìm câu trả lời tức thì, hướng dẫn chi tiết, video tutorials và hỗ trợ live chat 24/7."
        />
      </Helmet>

      {/* ✅ Enhanced Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="container relative z-10 px-4 mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto"
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 10 }}
              className="flex items-center justify-center w-24 h-24 mx-auto mb-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-2xl"
            >
              <HelpCircle className="w-12 h-12 text-white" />
            </motion.div>

            <h1 className="mb-8 text-5xl font-bold md:text-7xl leading-tight">
              <span className="text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text">
                Trung tâm trợ giúp
              </span>
              <br />
              <span className="text-2xl md:text-3xl font-medium text-muted-foreground">
                Giải đáp mọi thắc mắc của bạn
              </span>
            </h1>

            <p className="mb-12 text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Tìm câu trả lời nhanh chóng với
              <span className="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-semibold">
                {" "}
                hệ thống hỗ trợ thông minh
              </span>{" "}
              và
              <span className="text-transparent bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text font-semibold">
                {" "}
                đội ngũ expert 24/7
              </span>
            </p>

            {/* ✅ Enhanced Search Bar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="relative max-w-3xl mx-auto mb-12"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur-lg opacity-20 animate-pulse"></div>
              <div className="relative">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-muted-foreground z-10" />
                <Input
                  placeholder="🔍 Tìm kiếm câu hỏi, hướng dẫn, video tutorials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-16 pr-6 py-6 text-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-0 shadow-xl rounded-2xl focus:ring-4 focus:ring-blue-200 transition-all duration-300"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    AI Search
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* ✅ Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 * index }}
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

        {/* ✅ Enhanced Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                x: [0, 30, 0],
                y: [0, -30, 0],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                delay: i * 2,
              }}
              className={`absolute w-32 h-32 rounded-full blur-xl mix-blend-multiply ${
                i % 3 === 0
                  ? "bg-blue-300"
                  : i % 3 === 1
                    ? "bg-purple-300"
                    : "bg-pink-300"
              }`}
              style={{
                top: `${10 + i * 15}%`,
                left: `${5 + i * 15}%`,
              }}
            />
          ))}
        </div>
      </section>

      <div className="container px-4 pb-20 mx-auto">
        {/* ✅ Enhanced Quick Access Guides */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">🚀 Bắt đầu ngay</h2>
            <p className="text-xl text-muted-foreground">
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
                    <h3 className="mb-4 text-xl font-bold">{guide.title}</h3>
                    <p className="mb-6 text-muted-foreground leading-relaxed">
                      {guide.description}
                    </p>
                    <div className="flex justify-between items-center mb-6 text-sm">
                      <Badge variant="outline" className="bg-blue-50">
                        ⏱️ {guide.time}
                      </Badge>
                      <Badge variant="outline" className="bg-green-50">
                        📊 {guide.level}
                      </Badge>
                    </div>
                    <Button
                      className={`w-full bg-gradient-to-r ${guide.color} hover:shadow-lg transition-all duration-300`}
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
            <h2 className="text-4xl font-bold mb-4">📚 Danh mục hỗ trợ</h2>
            <p className="text-xl text-muted-foreground">
              Tìm câu trả lời theo từng chủ đề cụ thể
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                        className="bg-white/80 text-gray-700 text-lg px-3 py-1"
                      >
                        {category.count}
                      </Badge>
                    </div>

                    <h3 className="text-xl font-bold mb-3">{category.title}</h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {category.description}
                    </p>

                    <div className="space-y-2 mb-6">
                      {category.topics.slice(0, 3).map((topic, topicIndex) => (
                        <div
                          key={topicIndex}
                          className="flex items-center text-sm text-gray-600"
                        >
                          <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                          {topic}
                        </div>
                      ))}
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-0 text-blue-600 hover:text-blue-800 font-semibold group-hover:translate-x-1 transition-all duration-300"
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
            <h2 className="text-4xl font-bold mb-4">🔥 Bài viết phổ biến</h2>
            <p className="text-xl text-muted-foreground">
              Những hướng dẫn được đọc nhiều nhất và đánh giá cao
            </p>
          </div>
          <div className="space-y-6">
            {popularArticles.map((article, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 10 }}
              >
                <Card className="group transition-all duration-500 hover:shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 hover:border-blue-200">
                  <CardContent className="p-8">
                    <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                            <FileText className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors leading-tight">
                              {article.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                              <Badge variant="outline" className="bg-blue-50">
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
                              <Badge
                                variant="outline"
                                className={`${getDifficultyColor(article.difficulty)} border-0`}
                              >
                                {article.difficulty}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {article.tags.map((tag, tagIndex) => (
                            <Badge
                              key={tagIndex}
                              variant="secondary"
                              className="text-xs bg-gray-100"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col lg:flex-row items-center gap-6">
                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center gap-2 text-green-600">
                            <Users className="w-4 h-4" />
                            <span className="font-semibold">
                              {article.views}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-yellow-600">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="font-semibold">
                              {article.rating}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-blue-600">
                            <ThumbsUp className="w-4 h-4" />
                            <span className="font-semibold">Hữu ích</span>
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 hover:shadow-lg"
                        >
                          Đọc ngay
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
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
            <h2 className="text-4xl font-bold mb-4">❓ Câu hỏi thường gặp</h2>
            <p className="text-xl text-muted-foreground">
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
                    className="border border-gray-200 rounded-xl px-6 data-[state=open]:shadow-lg transition-all duration-300"
                  >
                    <AccordionTrigger className="text-left hover:no-underline py-6">
                      <span className="text-lg font-semibold">
                        {faq.question}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6">
                      <div className="prose prose-blue max-w-none">
                        <div className="whitespace-pre-line text-muted-foreground leading-relaxed">
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
            <h2 className="text-4xl font-bold mb-4">🤝 Liên hệ hỗ trợ</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Không tìm thấy câu trả lời? Đội ngũ chuyên gia của chúng tôi luôn
              sẵn sàng hỗ trợ bạn với nhiều kênh liên lạc tiện lợi.
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
                    <h3 className="mb-3 text-xl font-bold">{option.title}</h3>
                    <p className="mb-4 text-muted-foreground">
                      {option.description}
                    </p>

                    <div className="space-y-2 mb-6 text-sm">
                      <div className="flex items-center justify-center gap-2">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span>Phản hồi {option.time}</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <Users className="w-4 h-4 text-green-500" />
                        <span>{option.availability}</span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>{option.satisfaction} hài lòng</span>
                      </div>
                    </div>

                    <Button
                      className={`w-full bg-gradient-to-r ${option.color} hover:shadow-lg transition-all duration-300`}
                    >
                      {option.action}
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
          <Card className="bg-gradient-to-br from-emerald-50 via-green-50 to-blue-50 dark:from-emerald-900/20 dark:via-green-900/20 dark:to-blue-900/20 border-0 shadow-2xl">
            <CardContent className="p-10">
              <div className="text-center mb-10">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full shadow-2xl"
                >
                  <CheckCircle className="w-10 h-10 text-white" />
                </motion.div>
                <h3 className="mb-4 text-3xl font-bold text-emerald-800 dark:text-emerald-200">
                  🟢 Tất cả hệ thống hoạt động bình thường
                </h3>
                <p className="text-emerald-700 dark:text-emerald-300 text-lg mb-6">
                  Mọi dịch vụ đang vận hành ổn định với hiệu suất cao. Thời gian
                  phản hồi trung bình: <span className="font-bold"> 50ms</span>
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
                    className="text-center bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-md"
                  >
                    <div className="flex items-center justify-center mb-3">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-md"></div>
                    </div>
                    <div className="text-sm font-semibold text-gray-800 mb-1">
                      {system.name}
                    </div>
                    <div className="text-xs text-emerald-600 font-medium">
                      {system.uptime} uptime
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <Button
                  variant="outline"
                  className="bg-white/60 hover:bg-white/80 border-emerald-300 text-emerald-700 hover:text-emerald-800"
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
  );
};

export default Help;
