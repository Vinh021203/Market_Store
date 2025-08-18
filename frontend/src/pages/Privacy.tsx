import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Privacy: React.FC = () => {
  const [activeSection, setActiveSection] = useState("collection");
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const lastUpdated = "15 tháng 1, 2025";

  // ✅ Scroll Animation Effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const sections = [
    {
      id: "collection",
      icon: Database,
      title: "Thu thập thông tin",
      subtitle: "Dữ liệu chúng tôi thu thập từ bạn",
      color: "from-blue-500 to-cyan-400",
      content: [
        {
          subtitle: "🔹 Thông tin cá nhân",
          details:
            "Họ tên, địa chỉ email, số điện thoại, ngày sinh, giới tính, và ảnh đại diện khi bạn đăng ký tài khoản hoặc liên hệ với chúng tôi.",
          icon: UserCheck,
        },
        {
          subtitle: "🔹 Thông tin thanh toán & tài chính",
          details:
            "Thông tin thẻ tín dụng, tài khoản ngân hàng, lịch sử giao dịch, hóa đơn và các dữ liệu tài chính cần thiết để xử lý thanh toán.",
          icon: CreditCard,
        },
        {
          subtitle: "🔹 Dữ liệu hành vi sử dụng",
          details:
            "Thời gian truy cập, trang web đã xem, sản phẩm quan tâm, lịch sử tìm kiếm, tương tác với nội dung và patterns sử dụng dịch vụ.",
          icon: Search,
        },
        {
          subtitle: "🔹 Thông tin thiết bị & kỹ thuật",
          details:
            "Địa chỉ IP, loại trình duyệt, hệ điều hành, độ phân giải màn hình, thông tin thiết bị di động, cookies và local storage.",
          icon: Monitor,
        },
        {
          subtitle: "🔹 Dữ liệu vị trí địa lý",
          details:
            "Vị trí chính xác hoặc gần đúng dựa trên GPS, WiFi, IP address để cung cấp dịch vụ được cá nhân hóa theo khu vực.",
          icon: MapPin,
        },
        {
          subtitle: "🔹 Nội dung do người dùng tạo",
          details:
            "Bình luận, đánh giá, feedback, hình ảnh upload, tin nhắn, và mọi nội dung bạn chia sẻ trên nền tảng của chúng tôi.",
          icon: MessageSquare,
        },
      ],
    },
    {
      id: "usage",
      icon: Eye,
      title: "Sử dụng dữ liệu",
      subtitle: "Cách chúng tôi xử lý thông tin của bạn",
      color: "from-purple-500 to-pink-400",
      content: [
        {
          subtitle: "🎯 Cung cấp & cải thiện dịch vụ",
          details:
            "Vận hành website, xử lý đơn hàng, cung cấp hỗ trợ khách hàng, cá nhân hóa trải nghiệm người dùng và phát triển tính năng mới.",
          icon: Zap,
        },
        {
          subtitle: "📧 Liên lạc & thông báo",
          details:
            "Gửi email xác nhận, thông báo đơn hàng, cập nhật sản phẩm, newsletter, khuyến mãi đặc biệt và thông tin quan trọng khác.",
          icon: Bell,
        },
        {
          subtitle: "🛡️ Bảo mật & chống gian lận",
          details:
            "Xác thực danh tính, phát hiện hoạt động đáng ngờ, ngăn chặn spam, bảo vệ khỏi các cuộc tấn công mạng và đảm bảo an toàn giao dịch.",
          icon: Shield,
        },
        {
          subtitle: "📊 Phân tích & báo cáo",
          details:
            "Phân tích xu hướng sử dụng, đo lường hiệu quả marketing, tối ưu hóa performance website và tạo insights kinh doanh.",
          icon: Filter,
        },
        {
          subtitle: "⚖️ Tuân thủ pháp luật",
          details:
            "Đáp ứng các yêu cầu pháp lý, tuân thủ quy định thuế, xử lý tranh chấp và hợp tác với cơ quan chức năng khi cần thiết.",
          icon: FileText,
        },
        {
          subtitle: "🎪 Marketing & quảng cáo",
          details:
            "Hiển thị quảng cáo phù hợp, chạy chiến dịch marketing có mục tiêu, đo lường ROI và tối ưu hóa conversion rate.",
          icon: Star,
        },
      ],
    },
    {
      id: "sharing",
      icon: Users,
      title: "Chia sẻ dữ liệu",
      subtitle: "Khi nào và với ai chúng tôi chia sẻ",
      color: "from-emerald-500 to-teal-400",
      content: [
        {
          subtitle: "🤝 Đối tác kinh doanh",
          details:
            "Các nhà cung cấp dịch vụ thanh toán, shipping, cloud hosting, analytics, customer support và marketing automation được xác minh.",
          icon: Award,
        },
        {
          subtitle: "⚖️ Yêu cầu pháp lý",
          details:
            "Cơ quan nhà nước có thẩm quyền, tòa án, cảnh sát, cơ quan thuế khi có lệnh hoặc yêu cầu chính thức theo quy định pháp luật.",
          icon: FileText,
        },
        {
          subtitle: "🏢 Chuyển nhượng tài sản",
          details:
            "Trong trường hợp M&A, IPO, phá sản, hoặc tái cấu trúc doanh nghiệp, dữ liệu có thể được chuyển giao cho bên mua.",
          icon: RefreshCw,
        },
        {
          subtitle: "✅ Sự đồng ý của bạn",
          details:
            "Các trường hợp bạn cho phép rõ ràng, ví dụ khi kết nối social media, chia sẻ với bạn bè, hoặc tham gia chương trình affiliate.",
          icon: CheckCircle,
        },
        {
          subtitle: "🆘 Trường hợp khẩn cấp",
          details:
            "Bảo vệ sức khỏe, an toàn của người dùng hoặc cộng đồng, ngăn chặn tội phạm, khủng bố hoặc các mối đe dọa nghiêm trọng khác.",
          icon: AlertTriangle,
        },
      ],
    },
    {
      id: "security",
      icon: Shield,
      title: "Bảo mật dữ liệu",
      subtitle: "Các biện pháp bảo vệ thông tin",
      color: "from-red-500 to-orange-400",
      content: [
        {
          subtitle: "🔐 Mã hóa dữ liệu",
          details:
            "SSL/TLS 256-bit cho truyền tải, AES-256 cho lưu trữ, end-to-end encryption cho tin nhắn nhạy cảm và quantum-safe cryptography.",
          icon: Key,
        },
        {
          subtitle: "🏰 Kiến trúc bảo mật",
          details:
            "Firewall đa lớp, intrusion detection system, DDoS protection, vulnerability scanning và penetration testing thường xuyên.",
          icon: Server,
        },
        {
          subtitle: "👥 Kiểm soát truy cập",
          details:
            "Multi-factor authentication, role-based access control, privilege management, audit logging và session management.",
          icon: UserCheck,
        },
        {
          subtitle: "☁️ Hạ tầng an toàn",
          details:
            "Cloud infrastructure tier-1, data centers ISO 27001, backup tự động, disaster recovery plan và 99.9% uptime guarantee.",
          icon: Cloud,
        },
        {
          subtitle: "🔍 Giám sát liên tục",
          details:
            "24/7 security monitoring, threat intelligence, incident response team, forensic analysis và compliance auditing.",
          icon: Eye,
        },
        {
          subtitle: "📚 Đào tạo nhân viên",
          details:
            "Security awareness training, phishing simulation, access control policy, NDA ký kết và background check.",
          icon: Users,
        },
      ],
    },
    {
      id: "rights",
      icon: Settings,
      title: "Quyền của bạn",
      subtitle: "Các quyền bảo vệ dữ liệu cá nhân",
      color: "from-indigo-500 to-blue-400",
      content: [
        {
          subtitle: "📖 Quyền được biết",
          details:
            "Yêu cầu thông tin chi tiết về dữ liệu được thu thập, mục đích sử dụng, thời gian lưu trữ và các bên thứ ba được chia sẻ.",
          icon: FileText,
        },
        {
          subtitle: "💾 Quyền truy cập dữ liệu",
          details:
            "Download một bản sao hoàn chỉnh dữ liệu cá nhân của bạn trong định dạng machine-readable như JSON, CSV hoặc XML.",
          icon: Download,
        },
        {
          subtitle: "✏️ Quyền chỉnh sửa",
          details:
            "Cập nhật, sửa đổi hoặc hoàn thiện thông tin cá nhân không chính xác, lỗi thời hoặc không đầy đủ trong tài khoản của bạn.",
          icon: Edit3,
        },
        {
          subtitle: "🗑️ Quyền xóa dữ liệu",
          details:
            "Yêu cầu xóa vĩnh viễn dữ liệu cá nhân (right to be forgotten) trừ khi có nghĩa vụ pháp lý yêu cầu giữ lại.",
          icon: Trash2,
        },
        {
          subtitle: "⏸️ Quyền hạn chế xử lý",
          details:
            "Tạm dừng hoặc hạn chế việc xử lý dữ liệu trong một số trường hợp cụ thể như tranh chấp hoặc rút đồng ý.",
          icon: Settings,
        },
        {
          subtitle: "📤 Quyền chuyển dữ liệu",
          details:
            "Chuyển dữ liệu cá nhân từ hệ thống của chúng tôi sang nhà cung cấp dịch vụ khác một cách an toàn và thuận tiện.",
          icon: Upload,
        },
        {
          subtitle: "🚫 Quyền từ chối",
          details:
            "Opt-out khỏi marketing emails, targeted advertising, profiling tự động, analytics tracking và various data processing activities.",
          icon: AlertTriangle,
        },
      ],
    },
    {
      id: "cookies",
      icon: Globe,
      title: "Cookies & Tracking",
      subtitle: "Công nghệ theo dõi và cá nhân hóa",
      color: "from-pink-500 to-rose-400",
      content: [
        {
          subtitle: "🍪 Essential Cookies",
          details:
            "Cookies cần thiết cho chức năng cơ bản: đăng nhập, giỏ hàng, bảo mật, load balancing, và các tính năng core của website.",
          icon: Globe,
        },
        {
          subtitle: "📊 Analytics Cookies",
          details:
            "Google Analytics, heatmaps, user session recording, A/B testing, conversion tracking và performance monitoring để cải thiện UX.",
          icon: Filter,
        },
        {
          subtitle: "🎯 Advertising Cookies",
          details:
            "Facebook Pixel, Google Ads, retargeting campaigns, lookalike audiences, attribution modeling và cross-device tracking.",
          icon: Star,
        },
        {
          subtitle: "⚙️ Functional Cookies",
          details:
            "Language preferences, theme settings, customization options, remember me functionality và personalized user experience.",
          icon: Settings,
        },
        {
          subtitle: "📱 Mobile Tracking",
          details:
            "App analytics, push notification tokens, device fingerprinting, location services và in-app behavior tracking.",
          icon: Smartphone,
        },
        {
          subtitle: "🛠️ Cookie Management",
          details:
            "Cookie consent banner, granular controls, opt-out mechanisms, cookie policy updates và compliance with GDPR/CCPA regulations.",
          icon: Key,
        },
      ],
    },
    {
      id: "international",
      icon: Globe,
      title: "Chuyển giao quốc tế",
      subtitle: "Xử lý dữ liệu xuyên biên giới",
      color: "from-cyan-500 to-blue-400",
      content: [
        {
          subtitle: "🌏 Servers toàn cầu",
          details:
            "Dữ liệu có thể được lưu trữ và xử lý tại các data centers ở Singapore, Hong Kong, US, EU để tối ưu performance và độ tin cậy.",
          icon: Server,
        },
        {
          subtitle: "📋 Standard Contractual Clauses",
          details:
            "Sử dụng SCC được EU Commission phê duyệt, adequacy decisions, binding corporate rules để đảm bảo mức độ bảo vệ tương đương.",
          icon: FileText,
        },
        {
          subtitle: "🛡️ Privacy Shield & Frameworks",
          details:
            "Tuân thủ various privacy frameworks, certification programs, cross-border privacy rules và international data protection standards.",
          icon: Award,
        },
      ],
    },
    {
      id: "children",
      icon: Heart,
      title: "Bảo vệ trẻ em",
      subtitle: "Chính sách đặc biệt cho người dưới 16 tuổi",
      color: "from-pink-500 to-purple-400",
      content: [
        {
          subtitle: "👶 Age Verification",
          details:
            "Không cố ý thu thập dữ liệu từ trẻ em dưới 16 tuổi. Yêu cầu xác minh tuổi và sự đồng ý của phụ huynh khi cần thiết.",
          icon: UserCheck,
        },
        {
          subtitle: "👨‍👩‍👧‍👦 Parental Controls",
          details:
            "Phụ huynh có quyền xem, chỉnh sửa hoặc xóa dữ liệu của con mình, kiểm soát quyền riêng tư và giám sát hoạt động trực tuyến.",
          icon: Users,
        },
      ],
    },
  ];

  const stats = [
    { icon: Users, value: "50M+", label: "Người dùng tin tưởng" },
    { icon: Shield, value: "99.9%", label: "Uptime bảo mật" },
    { icon: Globe, value: "180+", label: "Quốc gia phục vụ" },
    { icon: Award, value: "ISO 27001", label: "Chứng nhận bảo mật" },
  ];

  const contactInfo = [
    {
      icon: Mail,
      label: "Data Protection Officer",
      value: "dpo@templatehub.com",
      description: "Liên hệ về bảo vệ dữ liệu",
      color: "from-blue-500 to-cyan-400",
    },
    {
      icon: Phone,
      label: "Hotline bảo mật",
      value: "+84 971 386 588",
      description: "Hỗ trợ khẩn cấp 24/7",
      color: "from-green-500 to-emerald-400",
    },
    {
      icon: MessageSquare,
      label: "Live Chat",
      value: "templatehub.com/chat",
      description: "Chat trực tiếp với chuyên gia",
      color: "from-purple-500 to-pink-400",
    },
    {
      icon: MapPin,
      label: "Trụ sở chính",
      value: "Hà Tu, Hạ Long, Quảng Ninh",
      description: "Văn phòng chính thức",
      color: "from-orange-500 to-red-400",
    },
  ];

  const certifications = [
    { name: "GDPR", desc: "EU General Data Protection Regulation" },
    { name: "ISO 27001", desc: "Information Security Management" },
    { name: "SOC 2", desc: "Service Organization Control" },
    { name: "CCPA", desc: "California Consumer Privacy Act" },
    { name: "PIPEDA", desc: "Personal Information Protection" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900">
      <Helmet>
        <title>🔒 Chính sách bảo mật | Template Hub - An toàn tuyệt đối</title>
        <meta
          name="description"
          content="Chính sách bảo mật chi tiết của Template Hub. Cam kết bảo vệ dữ liệu cá nhân với công nghệ mã hóa tiên tiến, tuân thủ GDPR và các tiêu chuẩn quốc tế."
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
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="flex items-center justify-center w-24 h-24 mx-auto mb-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-2xl"
            >
              <Lock className="w-12 h-12 text-white" />
            </motion.div>

            <h1 className="mb-8 text-5xl font-bold md:text-7xl leading-tight">
              <span className="text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text">
                Bảo mật tuyệt đối
              </span>
              <br />
              <span className="text-2xl md:text-3xl font-medium text-muted-foreground">
                Dữ liệu của bạn trong tay an toàn
              </span>
            </h1>

            <p className="mb-10 text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Chúng tôi cam kết bảo vệ quyền riêng tư và dữ liệu cá nhân của bạn
              với những
              <span className="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-semibold">
                {" "}
                tiêu chuẩn bảo mật hàng đầu thế giới
              </span>
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
              <Badge
                variant="secondary"
                className="px-6 py-3 text-base bg-white/80 backdrop-blur-sm shadow-lg"
              >
                <Clock className="w-5 h-5 mr-3 text-blue-600" />
                Cập nhật: {lastUpdated}
              </Badge>
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
                <Award className="w-5 h-5 mr-3 text-purple-600" />
                ISO 27001 Certified
              </Badge>
            </div>

            {/* ✅ Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 * index }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
                >
                  <stat.icon className="w-8 h-8 mx-auto mb-3 text-blue-600" />
                  <div className="text-3xl font-bold text-blue-600 mb-2">
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
          <div className="absolute -top-10 -right-10 w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-gradient-to-r from-pink-400 to-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000"></div>
        </div>
      </section>

      <div className="container px-4 pb-20 mx-auto">
        {/* ✅ Enhanced Overview */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <Card className="bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-0 shadow-2xl backdrop-blur-sm">
            <CardContent className="p-10">
              <div className="flex flex-col lg:flex-row items-start space-y-6 lg:space-y-0 lg:space-x-8">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-xl"
                >
                  <CheckCircle className="w-10 h-10 text-white" />
                </motion.div>
                <div className="flex-1">
                  <h2 className="mb-6 text-4xl font-bold">
                    🛡️ Cam kết bảo mật của chúng tôi
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                    Tại{" "}
                    <span className="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-bold">
                      Template Hub
                    </span>
                    , chúng tôi hiểu rằng quyền riêng tư của bạn là vô cùng quan
                    trọng. Chính sách này giải thích một cách chi tiết và minh
                    bạch về cách chúng tôi thu thập, sử dụng, và bảo vệ thông
                    tin cá nhân của bạn khi bạn sử dụng các dịch vụ và sản phẩm
                    của chúng tôi.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      {
                        icon: Shield,
                        label: "SSL 256-bit",
                        color: "text-green-500",
                      },
                      {
                        icon: Database,
                        label: "Encrypted Storage",
                        color: "text-blue-500",
                      },
                      {
                        icon: Key,
                        label: "Zero-Knowledge",
                        color: "text-purple-500",
                      },
                      {
                        icon: Award,
                        label: "Certified Secure",
                        color: "text-orange-500",
                      },
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ y: -5 }}
                        className="flex items-center space-x-3 p-4 bg-white/60 rounded-xl shadow-md"
                      >
                        <item.icon className={`w-6 h-6 ${item.color}`} />
                        <span className="text-sm font-semibold">
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
                viewport={{ once: true }}
                transition={{ delay: sectionIndex * 0.1 }}
              >
                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-2xl overflow-hidden group hover:shadow-3xl transition-all duration-500">
                  <CardHeader className="pb-8">
                    <CardTitle className="flex items-center space-x-4">
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        className={`flex items-center justify-center w-14 h-14 bg-gradient-to-r ${section.color} rounded-xl shadow-lg`}
                      >
                        <section.icon className="w-7 h-7 text-white" />
                      </motion.div>
                      <div>
                        <span className="text-2xl font-bold">
                          {section.title}
                        </span>
                        <p className="text-base text-muted-foreground mt-1">
                          {section.subtitle}
                        </p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="grid gap-6">
                      {section.content.map((item, itemIndex) => (
                        <motion.div
                          key={itemIndex}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: itemIndex * 0.1 }}
                          className="group/item bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 p-6 rounded-xl border-l-4 border-blue-400 hover:shadow-lg transition-all duration-300"
                        >
                          <div className="flex items-start space-x-4">
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              className={`flex items-center justify-center w-10 h-10 bg-gradient-to-r ${section.color} rounded-lg shadow-md`}
                            >
                              <item.icon className="w-5 h-5 text-white" />
                            </motion.div>
                            <div className="flex-1">
                              <h4 className="font-bold text-lg mb-3 text-blue-800 dark:text-blue-200 group-hover/item:text-blue-600 transition-colors">
                                {item.subtitle}
                              </h4>
                              <p className="text-muted-foreground leading-relaxed text-base">
                                {item.details}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
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
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-0 shadow-2xl">
            <CardContent className="p-10">
              <div className="text-center mb-10">
                <h3 className="text-3xl font-bold mb-4">
                  🏆 Chứng nhận & Tiêu chuẩn
                </h3>
                <p className="text-lg text-muted-foreground">
                  Được chứng nhận bởi các tổ chức uy tín hàng đầu thế giới
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {certifications.map((cert, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -10, scale: 1.05 }}
                    className="text-center bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                      <Award className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="font-bold text-lg text-green-800 mb-2">
                      {cert.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">{cert.desc}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* ✅ Enhanced Important Notice */}
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <Card className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-0 shadow-2xl">
            <CardContent className="p-10">
              <div className="flex items-start space-x-6">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-xl"
                >
                  <AlertTriangle className="w-8 h-8 text-white" />
                </motion.div>
                <div className="flex-1">
                  <h3 className="mb-4 text-2xl font-bold text-orange-800 dark:text-orange-200">
                    🔔 Thông báo quan trọng về cập nhật
                  </h3>
                  <p className="text-orange-700 dark:text-orange-300 mb-6 text-lg leading-relaxed">
                    Chúng tôi có thể cập nhật chính sách bảo mật này theo thời
                    gian để phản ánh những thay đổi trong thực tiễn kinh doanh,
                    công nghệ mới, hoặc để tuân thủ pháp luật. Chúng tôi sẽ
                    thông báo cho bạn về bất kỳ thay đổi quan trọng nào qua
                    email, thông báo trên website, hoặc các phương tiện liên lạc
                    khác.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center space-x-2 text-sm text-orange-600 dark:text-orange-400 bg-white/60 px-4 py-2 rounded-lg">
                      <FileText className="w-4 h-4" />
                      <span>Phiên bản hiện tại: v2.1 - {lastUpdated}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-orange-600 dark:text-orange-400 bg-white/60 px-4 py-2 rounded-lg">
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
          <Card className="bg-gradient-to-br from-white via-blue-50 to-purple-50 dark:from-slate-800 dark:via-slate-700 dark:to-purple-900/20 border-0 shadow-2xl">
            <CardHeader className="text-center pb-10">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-green-500 to-blue-600 rounded-full shadow-2xl"
              >
                <Mail className="w-10 h-10 text-white" />
              </motion.div>
              <CardTitle className="text-3xl font-bold mb-4">
                💬 Liên hệ về chính sách bảo mật
              </CardTitle>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Nếu bạn có bất kỳ câu hỏi nào về chính sách bảo mật này, cách
                chúng tôi xử lý dữ liệu của bạn, hoặc muốn thực hiện quyền bảo
                vệ dữ liệu cá nhân, vui lòng liên hệ với chúng tôi qua các kênh
                dưới đây.
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
                    <h4 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                      {contact.label}
                    </h4>
                    <p className="text-primary font-medium mb-2 text-lg">
                      {contact.value}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {contact.description}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* ✅ Quick Actions */}
              <Separator className="my-10" />
              <div className="text-center space-y-6">
                <h4 className="text-xl font-semibold">⚡ Thao tác nhanh</h4>
                <div className="flex flex-wrap justify-center gap-4">
                  {[
                    {
                      label: "📥 Tải xuống dữ liệu",
                      desc: "Export data của bạn",
                    },
                    {
                      label: "✏️ Chỉnh sửa thông tin",
                      desc: "Cập nhật profile",
                    },
                    { label: "🗑️ Xóa tài khoản", desc: "Delete permanently" },
                    {
                      label: "🚫 Opt-out Marketing",
                      desc: "Dừng email marketing",
                    },
                  ].map((action, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-white/80 hover:bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <div className="text-sm font-medium">{action.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {action.desc}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </div>
  );
};

export default Privacy;
