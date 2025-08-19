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
} from "lucide-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { toast } from "@/hooks/use-toast";

const Privacy: React.FC = () => {
  const [activeSection, setActiveSection] = useState("collection");
  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showFloatingNav, setShowFloatingNav] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(),
  );
  const [readingSections, setReadingSections] = useState<Set<string>>(
    new Set(),
  );

  const { scrollYProgress } = useScroll();
  const headerY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  const lastUpdated = "19 tháng 8, 2025";
  const version = "v2.1";

  // ✅ Enhanced Color Schemes
  const colorSchemes = {
    primary: {
      gradient: "from-cyan-500 via-blue-500 to-indigo-500",
      bg: "from-cyan-50/80 to-blue-50/80",
      darkBg: "from-cyan-900/30 to-blue-900/30",
      accent: "text-cyan-600",
    },
    security: {
      gradient: "from-emerald-500 via-teal-500 to-cyan-500",
      bg: "from-emerald-50/80 to-cyan-50/80",
      darkBg: "from-emerald-900/30 to-cyan-900/30",
      accent: "text-emerald-600",
    },
    privacy: {
      gradient: "from-indigo-500 via-purple-500 to-pink-500",
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
    info: {
      gradient: "from-blue-500 via-indigo-500 to-purple-500",
      bg: "from-blue-50/80 to-indigo-50/80",
      darkBg: "from-blue-900/30 to-indigo-900/30",
      accent: "text-blue-600",
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

  // ✅ Utility Functions
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

  const markSectionAsRead = useCallback((sectionId: string) => {
    setReadingSections((prev) => new Set(prev).add(sectionId));
  }, []);

  const sections = [
    {
      id: "collection",
      icon: Database,
      title: "Thu thập thông tin",
      subtitle: "Dữ liệu chúng tôi thu thập từ bạn",
      color: colorSchemes.primary.gradient,
      bgColor: colorSchemes.primary.bg,
      darkBg: colorSchemes.primary.darkBg,
      priority: "high",
      content: [
        {
          subtitle: "🔹 Thông tin cá nhân",
          details:
            "Họ tên, địa chỉ email, số điện thoại, ngày sinh, giới tính, và ảnh đại diện khi bạn đăng ký tài khoản hoặc liên hệ với chúng tôi.",
          icon: UserCheck,
          examples: [
            "Full name",
            "Email address",
            "Phone number",
            "Profile photo",
            "Date of birth",
          ],
        },
        {
          subtitle: "🔹 Thông tin thanh toán & tài chính",
          details:
            "Thông tin thẻ tín dụng, tài khoản ngân hàng, lịch sử giao dịch, hóa đơn và các dữ liệu tài chính cần thiết để xử lý thanh toán.",
          icon: CreditCard,
          examples: [
            "Credit card details",
            "Bank account",
            "Transaction history",
            "Payment receipts",
            "Billing info",
          ],
        },
        {
          subtitle: "🔹 Dữ liệu hành vi sử dụng",
          details:
            "Thời gian truy cập, trang web đã xem, sản phẩm quan tâm, lịch sử tìm kiếm, tương tác với nội dung và patterns sử dụng dịch vụ.",
          icon: Search,
          examples: [
            "Page views",
            "Search queries",
            "Click patterns",
            "Session duration",
            "User preferences",
          ],
        },
        {
          subtitle: "🔹 Thông tin thiết bị & kỹ thuật",
          details:
            "Địa chỉ IP, loại trình duyệt, hệ điều hành, độ phân giải màn hình, thông tin thiết bị di động, cookies và local storage.",
          icon: Monitor,
          examples: [
            "IP address",
            "Browser type",
            "Operating system",
            "Screen resolution",
            "Device ID",
          ],
        },
        {
          subtitle: "🔹 Dữ liệu vị trí địa lý",
          details:
            "Vị trí chính xác hoặc gần đúng dựa trên GPS, WiFi, IP address để cung cấp dịch vụ được cá nhân hóa theo khu vực.",
          icon: MapPin,
          examples: [
            "GPS coordinates",
            "WiFi networks",
            "IP geolocation",
            "Time zone",
            "Language settings",
          ],
        },
      ],
    },
    {
      id: "usage",
      icon: Eye,
      title: "Sử dụng dữ liệu",
      subtitle: "Cách chúng tôi xử lý thông tin của bạn",
      color: colorSchemes.privacy.gradient,
      bgColor: colorSchemes.privacy.bg,
      darkBg: colorSchemes.privacy.darkBg,
      priority: "high",
      content: [
        {
          subtitle: "🎯 Cung cấp & cải thiện dịch vụ",
          details:
            "Vận hành website, xử lý đơn hàng, cung cấp hỗ trợ khách hàng, cá nhân hóa trải nghiệm người dùng và phát triển tính năng mới.",
          icon: Zap,
          examples: [
            "Order processing",
            "Customer support",
            "Personalization",
            "Feature development",
            "Bug fixes",
          ],
        },
        {
          subtitle: "📧 Liên lạc & thông báo",
          details:
            "Gửi email xác nhận, thông báo đơn hàng, cập nhật sản phẩm, newsletter, khuyến mãi đặc biệt và thông tin quan trọng khác.",
          icon: Bell,
          examples: [
            "Order confirmations",
            "Product updates",
            "Newsletters",
            "Promotional offers",
            "Security alerts",
          ],
        },
        {
          subtitle: "🛡️ Bảo mật & chống gian lận",
          details:
            "Xác thực danh tính, phát hiện hoạt động đáng ngờ, ngăn chặn spam, bảo vệ khỏi các cuộc tấn công mạng và đảm bảo an toàn giao dịch.",
          icon: Shield,
          examples: [
            "Identity verification",
            "Fraud detection",
            "Spam prevention",
            "Security monitoring",
            "Risk assessment",
          ],
        },
        {
          subtitle: "📊 Phân tích & báo cáo",
          details:
            "Phân tích xu hướng sử dụng, đo lường hiệu quả marketing, tối ưu hóa performance website và tạo insights kinh doanh.",
          icon: Filter,
          examples: [
            "Usage analytics",
            "Performance metrics",
            "A/B testing",
            "Business intelligence",
            "ROI measurement",
          ],
        },
      ],
    },
    {
      id: "sharing",
      icon: Users,
      title: "Chia sẻ dữ liệu",
      subtitle: "Khi nào và với ai chúng tôi chia sẻ",
      color: colorSchemes.security.gradient,
      bgColor: colorSchemes.security.bg,
      darkBg: colorSchemes.security.darkBg,
      priority: "medium",
      content: [
        {
          subtitle: "🤝 Đối tác kinh doanh",
          details:
            "Các nhà cung cấp dịch vụ thanh toán, shipping, cloud hosting, analytics, customer support và marketing automation được xác minh.",
          icon: Award,
          examples: [
            "Payment processors",
            "Shipping providers",
            "Cloud services",
            "Analytics tools",
            "Support platforms",
          ],
        },
        {
          subtitle: "⚖️ Yêu cầu pháp lý",
          details:
            "Cơ quan nhà nước có thẩm quyền, tòa án, cảnh sát, cơ quan thuế khi có lệnh hoặc yêu cầu chính thức theo quy định pháp luật.",
          icon: FileText,
          examples: [
            "Court orders",
            "Legal subpoenas",
            "Government requests",
            "Tax authorities",
            "Law enforcement",
          ],
        },
        {
          subtitle: "✅ Sự đồng ý của bạn",
          details:
            "Các trường hợp bạn cho phép rõ ràng, ví dụ khi kết nối social media, chia sẻ với bạn bè, hoặc tham gia chương trình affiliate.",
          icon: CheckCircle,
          examples: [
            "Social media integration",
            "Friend referrals",
            "Affiliate programs",
            "Third-party apps",
            "Data exports",
          ],
        },
      ],
    },
    {
      id: "security",
      icon: Shield,
      title: "Bảo mật dữ liệu",
      subtitle: "Các biện pháp bảo vệ thông tin",
      color: colorSchemes.security.gradient,
      bgColor: colorSchemes.security.bg,
      darkBg: colorSchemes.security.darkBg,
      priority: "high",
      content: [
        {
          subtitle: "🔐 Mã hóa dữ liệu",
          details:
            "SSL/TLS 256-bit cho truyền tải, AES-256 cho lưu trữ, end-to-end encryption cho tin nhắn nhạy cảm và quantum-safe cryptography.",
          icon: Key,
          examples: [
            "SSL/TLS encryption",
            "AES-256 storage",
            "End-to-end messaging",
            "Quantum-safe crypto",
            "Key rotation",
          ],
        },
        {
          subtitle: "🏰 Kiến trúc bảo mật",
          details:
            "Firewall đa lớp, intrusion detection system, DDoS protection, vulnerability scanning và penetration testing thường xuyên.",
          icon: Server,
          examples: [
            "Multi-layer firewall",
            "IDS/IPS systems",
            "DDoS protection",
            "Vulnerability scans",
            "Penetration testing",
          ],
        },
        {
          subtitle: "👥 Kiểm soát truy cập",
          details:
            "Multi-factor authentication, role-based access control, privilege management, audit logging và session management.",
          icon: UserCheck,
          examples: [
            "MFA authentication",
            "Role-based access",
            "Privilege management",
            "Audit logs",
            "Session controls",
          ],
        },
        {
          subtitle: "☁️ Hạ tầng an toàn",
          details:
            "Cloud infrastructure tier-1, data centers ISO 27001, backup tự động, disaster recovery plan và 99.9% uptime guarantee.",
          icon: Cloud,
          examples: [
            "Tier-1 cloud",
            "ISO 27001 centers",
            "Auto backups",
            "Disaster recovery",
            "High availability",
          ],
        },
      ],
    },
    {
      id: "rights",
      icon: Settings,
      title: "Quyền của bạn",
      subtitle: "Các quyền bảo vệ dữ liệu cá nhân",
      color: colorSchemes.info.gradient,
      bgColor: colorSchemes.info.bg,
      darkBg: colorSchemes.info.darkBg,
      priority: "medium",
      content: [
        {
          subtitle: "📖 Quyền được biết",
          details:
            "Yêu cầu thông tin chi tiết về dữ liệu được thu thập, mục đích sử dụng, thời gian lưu trữ và các bên thứ ba được chia sẻ.",
          icon: FileText,
          examples: [
            "Data inventory",
            "Usage purposes",
            "Storage duration",
            "Third-party sharing",
            "Processing activities",
          ],
        },
        {
          subtitle: "💾 Quyền truy cập dữ liệu",
          details:
            "Download một bản sao hoàn chỉnh dữ liệu cá nhân của bạn trong định dạng machine-readable như JSON, CSV hoặc XML.",
          icon: Download,
          examples: [
            "JSON export",
            "CSV format",
            "XML files",
            "API access",
            "Portable data",
          ],
        },
        {
          subtitle: "✏️ Quyền chỉnh sửa",
          details:
            "Cập nhật, sửa đổi hoặc hoàn thiện thông tin cá nhân không chính xác, lỗi thời hoặc không đầy đủ trong tài khoản của bạn.",
          icon: Edit3,
          examples: [
            "Profile updates",
            "Contact changes",
            "Preference settings",
            "Account modifications",
            "Data corrections",
          ],
        },
        {
          subtitle: "🗑️ Quyền xóa dữ liệu",
          details:
            "Yêu cầu xóa vĩnh viễn dữ liệu cá nhân (right to be forgotten) trừ khi có nghĩa vụ pháp lý yêu cầu giữ lại.",
          icon: Trash2,
          examples: [
            "Account deletion",
            "Data erasure",
            "Forgotten rights",
            "Permanent removal",
            "Legal exceptions",
          ],
        },
      ],
    },
    {
      id: "cookies",
      icon: Globe,
      title: "Cookies & Tracking",
      subtitle: "Công nghệ theo dõi và cá nhân hóa",
      color: colorSchemes.warning.gradient,
      bgColor: colorSchemes.warning.bg,
      darkBg: colorSchemes.warning.darkBg,
      priority: "medium",
      content: [
        {
          subtitle: "🍪 Essential Cookies",
          details:
            "Cookies cần thiết cho chức năng cơ bản: đăng nhập, giỏ hàng, bảo mật, load balancing, và các tính năng core của website.",
          icon: Globe,
          examples: [
            "Session cookies",
            "Authentication",
            "Shopping cart",
            "Security tokens",
            "Load balancing",
          ],
        },
        {
          subtitle: "📊 Analytics Cookies",
          details:
            "Google Analytics, heatmaps, user session recording, A/B testing, conversion tracking và performance monitoring để cải thiện UX.",
          icon: Filter,
          examples: [
            "Google Analytics",
            "Heatmaps",
            "Session recording",
            "A/B testing",
            "Conversion tracking",
          ],
        },
        {
          subtitle: "🎯 Advertising Cookies",
          details:
            "Facebook Pixel, Google Ads, retargeting campaigns, lookalike audiences, attribution modeling và cross-device tracking.",
          icon: Star,
          examples: [
            "Facebook Pixel",
            "Google Ads",
            "Retargeting",
            "Lookalike audiences",
            "Attribution models",
          ],
        },
        {
          subtitle: "⚙️ Functional Cookies",
          details:
            "Language preferences, theme settings, customization options, remember me functionality và personalized user experience.",
          icon: Settings,
          examples: [
            "Language settings",
            "Theme preferences",
            "Customization",
            "Remember me",
            "User preferences",
          ],
        },
      ],
    },
  ];

  const stats = [
    {
      icon: Users,
      value: "50M+",
      label: "Người dùng tin tưởng",
      color: "text-cyan-600",
    },
    {
      icon: Shield,
      value: "99.9%",
      label: "Uptime bảo mật",
      color: "text-emerald-600",
    },
    {
      icon: Globe,
      value: "180+",
      label: "Quốc gia phục vụ",
      color: "text-blue-600",
    },
    {
      icon: Award,
      value: "ISO 27001",
      label: "Chứng nhận bảo mật",
      color: "text-indigo-600",
    },
  ];

  const contactInfo = [
    {
      icon: Mail,
      label: "Data Protection Officer",
      value: "dpo@templatemarket.vn",
      description: "Liên hệ về bảo vệ dữ liệu",
      color: colorSchemes.primary.gradient,
      availability: "24/7 Email Response",
    },
    {
      icon: Phone,
      label: "Hotline bảo mật",
      value: "+84 971 386 588",
      description: "Hỗ trợ khẩn cấp 24/7",
      color: colorSchemes.security.gradient,
      availability: "Business Hours",
    },
    {
      icon: MessageSquare,
      label: "Live Chat",
      value: "templatemarket.vn/chat",
      description: "Chat trực tiếp với chuyên gia",
      color: colorSchemes.privacy.gradient,
      availability: "9:00 - 21:00 GMT+7",
    },
    {
      icon: MapPin,
      label: "Trụ sở chính",
      value: "Hà Tu, Hạ Long, Quảng Ninh",
      description: "Văn phòng chính thức",
      color: colorSchemes.warning.gradient,
      availability: "Địa chỉ chính thức",
    },
  ];

  const certifications = [
    {
      name: "GDPR",
      desc: "EU General Data Protection Regulation",
      icon: Shield,
    },
    { name: "ISO 27001", desc: "Information Security Management", icon: Award },
    { name: "SOC 2", desc: "Service Organization Control", icon: Server },
    { name: "CCPA", desc: "California Consumer Privacy Act", icon: FileText },
    { name: "PIPEDA", desc: "Personal Information Protection", icon: Lock },
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
      title: "🚀 Đang xử lý yêu cầu...",
      description: `Yêu cầu ${type} của bạn đang được xử lý. Chúng tôi sẽ liên hệ trong 24h.`,
    });
  };

  return (
    <>
      <Helmet>
        <title>
          🔒 Chính sách bảo mật {version} | Template Market - An toàn tuyệt đối
        </title>
        <meta
          name="description"
          content="Chính sách bảo mật chi tiết của Template Market. Cam kết bảo vệ dữ liệu cá nhân với công nghệ mã hóa tiên tiến, tuân thủ GDPR và các tiêu chuẩn quốc tế."
        />
        <meta
          name="keywords"
          content="chính sách bảo mật, privacy policy, GDPR, bảo vệ dữ liệu, template market"
        />
        <link rel="canonical" href="https://templatemarket.vn/privacy" />
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
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="flex items-center justify-center w-28 h-28 mx-auto mb-8 bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-500 rounded-3xl shadow-2xl"
              >
                <Lock className="w-14 h-14 text-white" />
              </motion.div>

              {/* Title */}
              <h1 className="mb-8 text-5xl lg:text-7xl font-bold leading-tight">
                <span className="text-transparent bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text">
                  Bảo mật tuyệt đối
                </span>
                <br />
                <span className="text-2xl lg:text-3xl font-medium text-gray-700 dark:text-gray-300">
                  Dữ liệu của bạn trong tay an toàn
                </span>
              </h1>

              {/* Subtitle */}
              <p className="mb-12 text-xl lg:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-4xl mx-auto">
                Chúng tôi cam kết bảo vệ quyền riêng tư và dữ liệu cá nhân của
                bạn với những
                <span className="text-transparent bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text font-semibold">
                  {" "}
                  tiêu chuẩn bảo mật hàng đầu thế giới{" "}
                </span>
              </p>

              {/* Features Badges */}
              <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
                <Badge className="px-6 py-3 text-base bg-white/90 backdrop-blur-sm shadow-lg border-0 text-gray-800">
                  <Clock className="w-5 h-5 mr-3 text-cyan-600" />
                  Cập nhật: {lastUpdated}
                </Badge>
                <Badge className="px-6 py-3 text-base bg-white/90 backdrop-blur-sm shadow-lg border-0 text-gray-800">
                  <Shield className="w-5 h-5 mr-3 text-emerald-600" />
                  GDPR Compliant
                </Badge>
                <Badge className="px-6 py-3 text-base bg-white/90 backdrop-blur-sm shadow-lg border-0 text-gray-800">
                  <Award className="w-5 h-5 mr-3 text-indigo-600" />
                  ISO 27001 Certified
                </Badge>
              </div>

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
          {/* ✅ Enhanced Overview */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <Card className="bg-gradient-to-br from-cyan-50/90 via-blue-50/90 to-indigo-50/90 dark:from-cyan-900/20 dark:via-blue-900/20 dark:to-indigo-900/20 border-0 shadow-2xl backdrop-blur-sm">
              <CardContent className="p-10">
                <div className="flex flex-col lg:flex-row items-start space-y-6 lg:space-y-0 lg:space-x-8">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="flex items-center justify-center w-20 h-20 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-2xl shadow-xl"
                  >
                    <CheckCircle className="w-10 h-10 text-white" />
                  </motion.div>
                  <div className="flex-1">
                    <h2 className="mb-6 text-4xl font-bold text-gray-800 dark:text-gray-100">
                      🛡️ Cam kết bảo mật của chúng tôi
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                      Tại{" "}
                      <span className="text-transparent bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text font-bold">
                        Template Market
                      </span>
                      , chúng tôi hiểu rằng quyền riêng tư của bạn là vô cùng
                      quan trọng. Chính sách này giải thích một cách chi tiết và
                      minh bạch về cách chúng tôi thu thập, sử dụng, và bảo vệ
                      thông tin cá nhân của bạn khi bạn sử dụng các dịch vụ và
                      sản phẩm của chúng tôi.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {[
                        {
                          icon: Shield,
                          label: "SSL 256-bit",
                          color: "text-emerald-500",
                        },
                        {
                          icon: Database,
                          label: "Encrypted Storage",
                          color: "text-cyan-500",
                        },
                        {
                          icon: Key,
                          label: "Zero-Knowledge",
                          color: "text-indigo-500",
                        },
                        {
                          icon: Award,
                          label: "Certified Secure",
                          color: "text-purple-500",
                        },
                      ].map((item, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ y: -5 }}
                          className="flex items-center space-x-3 p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl shadow-md"
                        >
                          <item.icon className={`w-6 h-6 ${item.color}`} />
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            {item.label}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* ✅ Enhanced Privacy Sections */}
          <section className="mb-20">
            <div className="space-y-12">
              {sections.map((section, sectionIndex) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: sectionIndex * 0.1, duration: 0.6 }}
                  onViewportEnter={() => markSectionAsRead(section.id)}
                >
                  <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg border-0 shadow-2xl overflow-hidden group hover:shadow-3xl transition-all duration-500">
                    {/* Priority Indicator */}
                    <div className={`h-2 bg-gradient-to-r ${section.color}`} />

                    {/* Header */}
                    <CardHeader className="pb-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                          <motion.div
                            whileHover={{ scale: 1.2, rotate: 10 }}
                            className={`flex items-center justify-center w-16 h-16 bg-gradient-to-r ${section.color} rounded-xl shadow-lg`}
                          >
                            <section.icon className="w-8 h-8 text-white" />
                          </motion.div>
                          <div>
                            <CardTitle className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">
                              {section.title}
                            </CardTitle>
                            <p className="text-gray-600 dark:text-gray-400">
                              {section.subtitle}
                            </p>
                            {section.priority && (
                              <Badge
                                className={`mt-2 ${
                                  section.priority === "high"
                                    ? "bg-red-500 hover:bg-red-600"
                                    : section.priority === "medium"
                                      ? "bg-amber-500 hover:bg-amber-600"
                                      : "bg-green-500 hover:bg-green-600"
                                } text-white border-0`}
                              >
                                {section.priority === "high"
                                  ? "🔴 Quan trọng"
                                  : section.priority === "medium"
                                    ? "🟡 Trung bình"
                                    : "🟢 Thấp"}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {readingSections.has(section.id) && (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleSection(section.id)}
                            className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                          >
                            {expandedSections.has(section.id) ? (
                              <ChevronDown className="w-5 h-5" />
                            ) : (
                              <ChevronRight className="w-5 h-5" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    {/* Content */}
                    <AnimatePresence>
                      {expandedSections.has(section.id) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <CardContent className="space-y-6">
                            {section.content.map((item, itemIndex) => (
                              <motion.div
                                key={itemIndex}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: itemIndex * 0.1 }}
                                className={`group/item bg-gradient-to-r ${section.bgColor} dark:bg-gradient-to-r ${section.darkBg} p-6 rounded-xl border-l-4 border-cyan-400 hover:shadow-lg transition-all duration-300`}
                              >
                                <div className="flex items-start space-x-4">
                                  <motion.div
                                    whileHover={{ scale: 1.15, rotate: 5 }}
                                    className={`flex items-center justify-center w-12 h-12 bg-gradient-to-r ${section.color} rounded-xl shadow-md`}
                                  >
                                    <item.icon className="w-6 h-6 text-white" />
                                  </motion.div>

                                  <div className="flex-1">
                                    <h4 className="font-bold text-lg mb-3 text-gray-800 dark:text-gray-200">
                                      {item.subtitle}
                                    </h4>
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                                      {item.details}
                                    </p>

                                    {item.examples && (
                                      <div className="space-y-2">
                                        <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                          Ví dụ:
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                          {item.examples.map(
                                            (example, exampleIndex) => (
                                              <Badge
                                                key={exampleIndex}
                                                variant="outline"
                                                className="text-xs bg-white/70 dark:bg-gray-700/70 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
                                              >
                                                {example}
                                              </Badge>
                                            ),
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </CardContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ✅ Certifications Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <Card className="bg-gradient-to-r from-emerald-50/90 to-teal-50/90 dark:from-emerald-900/20 dark:to-teal-900/20 border-0 shadow-2xl">
              <CardContent className="p-10">
                <div className="text-center mb-10">
                  <h3 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                    🏆 Chứng nhận & Tiêu chuẩn
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    Được chứng nhận bởi các tổ chức uy tín hàng đầu thế giới
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                  {certifications.map((cert, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ y: -10, scale: 1.05 }}
                      className="text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-xl shadow-lg"
                    >
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg">
                        <cert.icon className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="font-bold text-lg text-emerald-800 dark:text-emerald-200 mb-2">
                        {cert.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {cert.desc}
                      </p>
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
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl shadow-xl"
                  >
                    <AlertTriangle className="w-8 h-8 text-white" />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="mb-4 text-2xl font-bold text-amber-800 dark:text-amber-200">
                      🔔 Thông báo quan trọng về cập nhật
                    </h3>
                    <p className="text-amber-700 dark:text-amber-300 mb-6 text-lg leading-relaxed">
                      Chúng tôi có thể cập nhật chính sách bảo mật này theo thời
                      gian để phản ánh những thay đổi trong thực tiễn kinh
                      doanh, công nghệ mới, hoặc để tuân thủ pháp luật. Chúng
                      tôi sẽ thông báo cho bạn về bất kỳ thay đổi quan trọng nào
                      qua email, thông báo trên website, hoặc các phương tiện
                      liên lạc khác.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center space-x-2 text-sm text-amber-600 dark:text-amber-400 bg-white/60 dark:bg-gray-800/60 px-4 py-2 rounded-lg">
                        <FileText className="w-4 h-4" />
                        <span>
                          Phiên bản hiện tại: {version} - {lastUpdated}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-amber-600 dark:text-amber-400 bg-white/60 dark:bg-gray-800/60 px-4 py-2 rounded-lg">
                        <Bell className="w-4 h-4" />
                        <span>Thông báo qua email</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* ✅ Enhanced Contact Section */}
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
                  <Mail className="w-10 h-10 text-white" />
                </motion.div>
                <CardTitle className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                  💬 Liên hệ về chính sách bảo mật
                </CardTitle>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                  Nếu bạn có bất kỳ câu hỏi nào về chính sách bảo mật này, cách
                  chúng tôi xử lý dữ liệu của bạn, hoặc muốn thực hiện quyền bảo
                  vệ dữ liệu cá nhân, vui lòng liên hệ với chúng tôi qua các
                  kênh dưới đây.
                </p>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {contactInfo.map((contact, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -10, scale: 1.05 }}
                      className="text-center group cursor-pointer"
                    >
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        className={`flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${contact.color} rounded-2xl shadow-xl group-hover:shadow-2xl transition-all duration-300`}
                      >
                        <contact.icon className="w-8 h-8 text-white" />
                      </motion.div>
                      <h4 className="font-bold text-lg mb-2 group-hover:text-cyan-600 transition-colors text-gray-800 dark:text-gray-200">
                        {contact.label}
                      </h4>
                      <p className="text-cyan-600 dark:text-cyan-400 font-medium mb-2 text-base">
                        {contact.value}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {contact.description}
                      </p>
                      <Badge
                        variant="outline"
                        className="bg-gray-50 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-400"
                      >
                        {contact.availability}
                      </Badge>
                    </motion.div>
                  ))}
                </div>

                <Separator className="my-12" />

                {/* ✅ Quick Actions */}
                <div className="text-center space-y-6">
                  <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                    ⚡ Thao tác nhanh với dữ liệu của bạn
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                      {
                        icon: Download,
                        label: "📥 Tải xuống dữ liệu",
                        desc: "Export data của bạn",
                        action: "download",
                      },
                      {
                        icon: Edit3,
                        label: "✏️ Chỉnh sửa thông tin",
                        desc: "Cập nhật profile",
                        action: "edit",
                      },
                      {
                        icon: Trash2,
                        label: "🗑️ Xóa tài khoản",
                        desc: "Delete permanently",
                        action: "delete",
                      },
                      {
                        icon: Bell,
                        label: "🚫 Opt-out Marketing",
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
                        <Card className="bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-md hover:shadow-lg transition-all duration-300">
                          <CardContent className="p-6 text-center">
                            <action.icon className="w-8 h-8 mx-auto mb-3 text-cyan-600" />
                            <div className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
                              {action.label}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              {action.desc}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 p-6 rounded-xl border border-cyan-200 dark:border-cyan-800"
                  >
                    <h5 className="text-lg font-bold text-cyan-800 dark:text-cyan-200 mb-3">
                      🎯 Pro Tips for Data Protection
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-cyan-700 dark:text-cyan-300">
                      <div className="flex items-center gap-2">
                        <ThumbsUp className="w-4 h-4" />
                        <span>Enable 2FA for security</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        <span>Review privacy settings regularly</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        <span>Keep your data updated</span>
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

export default Privacy;
