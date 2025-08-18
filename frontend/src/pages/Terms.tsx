import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Terms: React.FC = () => {
  const [activeSection, setActiveSection] = useState("definitions");
  const [scrollY, setScrollY] = useState(0);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const lastUpdated = "18 tháng 8, 2025";
  const effectiveDate = "1 tháng 9, 2025";

  // ✅ Scroll Animation Effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const sections = [
    {
      id: "definitions",
      icon: FileText,
      title: "Định nghĩa và giải thích thuật ngữ",
      subtitle: "Các khái niệm quan trọng trong điều khoản",
      color: "from-blue-500 to-cyan-400",
      bgColor: "from-blue-50 to-cyan-50",
      darkBg: "from-blue-900/20 to-cyan-900/20",
      content: [
        {
          subtitle: "🏢 Template Hub Platform",
          details:
            "Đề cập đến toàn bộ hệ sinh thái bao gồm website templatehub.vn, mobile app, API services, CDN network và tất cả các dịch vụ liên quan được vận hành bởi Template Hub Vietnam Co., Ltd.",
          icon: Building,
        },
        {
          subtitle: "👤 Người dùng/Khách hàng",
          details:
            "Bao gồm cá nhân, doanh nghiệp, tổ chức, agency, freelancer hoặc bất kỳ thực thể pháp lý nào đăng ký, sử dụng và tương tác với nền tảng của chúng tôi thông qua các hình thức khác nhau.",
          icon: Users,
        },
        {
          subtitle: "🎨 Sản phẩm số & Tài sản trí tuệ",
          details:
            "Toàn bộ nội dung số bao gồm: Website templates, mobile app UI kits, dashboard themes, landing pages, WordPress themes, Shopify themes, email templates, presentations, graphics, icons, fonts và các digital assets khác.",
          icon: Award,
        },
        {
          subtitle: "📜 Giấy phép sử dụng (License)",
          details:
            "Quyền sử dụng hợp pháp được cấp cho khách hàng khi mua sản phẩm, bao gồm các loại: Standard License, Extended License, Enterprise License với các điều khoản, giới hạn và quyền lợi cụ thể đi kèm.",
          icon: Scale,
        },
        {
          subtitle: "🛡️ Tài khoản & Dữ liệu",
          details:
            "Bao gồm thông tin cá nhân, dữ liệu thanh toán, lịch sử giao dịch, preferences, wishlist, reviews, và mọi dữ liệu được tạo ra hoặc lưu trữ trong quá trình sử dụng dịch vụ của chúng tôi.",
          icon: Database,
        },
      ],
    },
    {
      id: "acceptance",
      icon: UserCheck,
      title: "Chấp nhận & Ràng buộc pháp lý",
      subtitle: "Điều kiện để sử dụng dịch vụ",
      color: "from-emerald-500 to-green-400",
      bgColor: "from-emerald-50 to-green-50",
      darkBg: "from-emerald-900/20 to-green-900/20",
      content: [
        {
          subtitle: "✅ Đồng ý sử dụng dịch vụ",
          details:
            "Bằng cách tạo tài khoản, truy cập website, download app, sử dụng API, hoặc tương tác với bất kỳ dịch vụ nào của chúng tôi, bạn tự động đồng ý tuân thủ 100% các điều khoản và điều kiện được quy định.",
          icon: CheckCircle,
        },
        {
          subtitle: "🎂 Độ tuổi & Năng lực pháp lý",
          details:
            "Người dùng phải đủ 16 tuổi trở lên hoặc có sự đồng ý bằng văn bản từ phụ huynh/người giám hộ hợp pháp. Đối với doanh nghiệp, người đại diện phải có đầy đủ thẩm quyền ký kết hợp đồng.",
          icon: Calendar,
        },
        {
          subtitle: "🏛️ Khả năng pháp lý & Ràng buộc",
          details:
            "Bạn xác nhận có đầy đủ năng lực hành vi dân sự, không bị hạn chế quyền năng, có khả năng thực hiện các nghĩa vụ tài chính và pháp lý phát sinh từ việc sử dụng dịch vụ của chúng tôi.",
          icon: Gavel,
        },
        {
          subtitle: "🔄 Cập nhật & Hiệu lực điều khoản",
          details:
            "Điều khoản có thể được cập nhật định kỳ. Việc tiếp tục sử dụng dịch vụ sau khi có thông báo thay đổi được coi là chấp nhận điều khoản mới. Email thông báo sẽ được gửi trước 30 ngày.",
          icon: AlertTriangle,
        },
      ],
    },
    {
      id: "registration",
      icon: Users,
      title: "Đăng ký & Quản lý tài khoản",
      subtitle: "Quy định về tài khoản người dùng",
      color: "from-purple-500 to-pink-400",
      bgColor: "from-purple-50 to-pink-50",
      darkBg: "from-purple-900/20 to-pink-900/20",
      content: [
        {
          subtitle: "📋 Thông tin chính xác & Đầy đủ",
          details:
            "Cam kết cung cấp thông tin đăng ký hoàn toàn chính xác, đầy đủ, cập nhật và không gây nhầm lẫn. Bao gồm: họ tên, email, số điện thoại, địa chỉ, thông tin doanh nghiệp (nếu có), và các thông tin bắt buộc khác.",
          icon: FileText,
        },
        {
          subtitle: "🔐 Bảo mật tài khoản tuyệt đối",
          details:
            "Hoàn toàn chịu trách nhiệm bảo vệ username, password, 2FA codes, security questions và mọi thông tin đăng nhập. Sử dụng mật khẩu mạnh (8+ ký tự, bao gồm chữ hoa, thường, số, ký tự đặc biệt).",
          icon: Shield,
        },
        {
          subtitle: "👤 Sử dụng cá nhân & Không chia sẻ",
          details:
            "Tài khoản chỉ dành riêng cho chủ sở hữu, không được chia sẻ, cho mượn, bán hoặc chuyển nhượng dưới bất kỳ hình thức nào. Mỗi cá nhân/tổ chức chỉ được tạo một tài khoản duy nhất.",
          icon: UserCheck,
        },
        {
          subtitle: "🚨 Báo cáo vi phạm & Bảo mật",
          details:
            "Nghĩa vụ thông báo ngay lập tức (trong vòng 24h) cho chúng tôi qua hotline 24/7 hoặc email support nếu phát hiện tài khoản bị hack, sử dụng trái phép hoặc có hoạt động đáng ngờ.",
          icon: AlertCircle,
        },
      ],
    },
    {
      id: "purchases",
      icon: CreditCard,
      title: "Mua hàng & Thanh toán",
      subtitle: "Quy trình và chính sách thanh toán",
      color: "from-orange-500 to-red-400",
      bgColor: "from-orange-50 to-red-50",
      darkBg: "from-orange-900/20 to-red-900/20",
      content: [
        {
          subtitle: "💰 Giá cả & Tiền tệ",
          details:
            "Tất cả giá được hiển thị bằng VND (Đồng Việt Nam), USD (Đô la Mỹ) và EUR (Euro) tùy khu vực. Giá đã bao gồm thuế VAT 10% theo quy định pháp luật Việt Nam. Giá có thể thay đổi mà không cần báo trước.",
          icon: Globe,
        },
        {
          subtitle: "💳 Phương thức thanh toán đa dạng",
          details:
            "Hỗ trợ: Visa/Mastercard/JCB, MoMo, ZaloPay, VNPay, ShopeePay, Banking online (30+ ngân hàng), PayPal, Stripe, Apple Pay, Google Pay, Samsung Pay, cryptocurrency (Bitcoin, Ethereum) và trả góp qua các đối tác.",
          icon: CreditCard,
        },
        {
          subtitle: "✅ Xác nhận đơn hàng tự động",
          details:
            "Đơn hàng được xác nhận tự động sau khi thanh toán thành công. Email xác nhận và invoice sẽ được gửi trong vòng 2 phút. Link download và license key sẽ có sẵn ngay lập tức trong tài khoản.",
          icon: CheckCircle,
        },
        {
          subtitle: "📊 Thuế & Phí theo quy định",
          details:
            "Khách hàng chịu trách nhiệm thanh toán thuế thu nhập, thuế GTGT và các loại phí theo quy định pháp luật tại quốc gia/khu vực của mình. Chúng tôi cung cấp đầy đủ hóa đơn VAT theo yêu cầu.",
          icon: FileText,
        },
      ],
    },
    {
      id: "licenses",
      icon: Scale,
      title: "Giấy phép sử dụng chi tiết",
      subtitle: "Các loại license và quyền sử dụng",
      color: "from-indigo-500 to-blue-400",
      bgColor: "from-indigo-50 to-blue-50",
      darkBg: "from-indigo-900/20 to-blue-900/20",
      content: [
        {
          subtitle: "🎯 Standard License (Chuẩn)",
          details:
            "Cho phép sử dụng cho 1 dự án thương mại hoặc cá nhân, không giới hạn traffic/users. Bao gồm: website business, portfolio cá nhân, blog, landing page. Không được bán lại template dưới dạng gốc. Có thể modify unlimitedly.",
          icon: Target,
        },
        {
          subtitle: "⭐ Extended License (Mở rộng)",
          details:
            "Sử dụng cho multiple projects, SaaS platforms, marketplaces, themes for resale (sau khi customize). Cho phép integrate vào products bán cho end-users. Bao gồm priority support, customization request, white-label rights.",
          icon: Star,
        },
        {
          subtitle: "🏢 Enterprise License (Doanh nghiệp)",
          details:
            "Unlimited usage cho toàn bộ tổ chức, subsidiaries, clients. Custom development services, dedicated support team, SLA guarantee, source code access, API integration support, training sessions cho dev team.",
          icon: Building,
        },
        {
          subtitle: "🚫 Các hành vi không được phép",
          details:
            "Không được: redistribute source code, create competitors, resell as original templates, claim ownership, reverse engineer protected code, remove credits/watermarks, use for illegal purposes, violate intellectual property rights.",
          icon: Ban,
        },
        {
          subtitle: "📋 Bản quyền & Attribution",
          details:
            "Bản quyền (copyright) vẫn thuộc về tác giả/Template Hub. Khách hàng chỉ nhận license to use. Bắt buộc giữ nguyên credits trong source code (có thể remove trong production). Font, images có license riêng biệt.",
          icon: Award,
        },
      ],
    },
    {
      id: "prohibited",
      icon: Ban,
      title: "Hành vi bị nghiêm cấm",
      subtitle: "Những gì không được phép làm",
      color: "from-red-500 to-pink-400",
      bgColor: "from-red-50 to-pink-50",
      darkBg: "from-red-900/20 to-pink-900/20",
      content: [
        {
          subtitle: "⚖️ Sử dụng bất hợp pháp & Vi phạm",
          details:
            "Nghiêm cấm sử dụng sản phẩm cho: adult content, gambling, drugs, weapons, hate speech, terrorism, money laundering, pyramid schemes, fake news, spam networks, phishing sites, malware distribution hoặc bất kỳ hoạt động vi phạm pháp luật nào.",
          icon: Gavel,
        },
        {
          subtitle: "📋 Vi phạm bản quyền & IP",
          details:
            "Không được: sao chép/redistribute source code, claim ownership, remove author credits, reverse engineer, decompile protected files, create derivative templates for resale, share license keys, upload to torrent/warez sites.",
          icon: Shield,
        },
        {
          subtitle: "🔧 Reverse Engineering & Hacking",
          details:
            "Nghiêm cấm: decompile/disassemble protected code, bypass license verification, crack premium features, extract assets for separate use, attempt to access server infrastructure, exploit vulnerabilities, automated scraping/crawling.",
          icon: Code,
        },
        {
          subtitle: "📧 Spam, Abuse & Harmful Activities",
          details:
            "Không được: gửi spam emails, tạo fake accounts, abuse support system, DDoS attacks, distribute malware/viruses, phishing attempts, social engineering, harassment other users, manipulate reviews/ratings.",
          icon: AlertTriangle,
        },
      ],
    },
    {
      id: "refunds",
      icon: Download,
      title: "Chính sách hoàn tiền chi tiết",
      subtitle: "Điều kiện và quy trình hoàn tiền",
      color: "from-teal-500 to-cyan-400",
      bgColor: "from-teal-50 to-cyan-50",
      darkBg: "from-teal-900/20 to-cyan-900/20",
      content: [
        {
          subtitle: "⏰ Thời hạn hoàn tiền 30 ngày",
          details:
            "Chính sách hoàn tiền 30 ngày không điều kiện cho tất cả sản phẩm digital. Tính từ ngày mua đầu tiên, không phụ thuộc vào thời điểm download. Áp dụng cho cả single purchase và subscription plans.",
          icon: Clock,
        },
        {
          subtitle: "✅ Điều kiện được chấp nhận hoàn tiền",
          details:
            "Sản phẩm không đúng mô tả trong listing, có lỗi kỹ thuật nghiêm trọng không thể khắc phục, không tương thích với platform như cam kết, thiếu files quan trọng, không match với preview/demo được hiển thị.",
          icon: CheckCircle,
        },
        {
          subtitle: "🚀 Quy trình hoàn tiền nhanh chóng",
          details:
            "Bước 1: Liên hệ support qua live chat/email với order ID. Bước 2: Cung cấp lý do cụ thể + evidence. Bước 3: Review trong 24h. Bước 4: Approve và process refund. Bước 5: Nhận tiền trong 3-7 ngày làm việc.",
          icon: Zap,
        },
        {
          subtitle: "❌ Trường hợp KHÔNG hoàn tiền",
          details:
            "Đã sử dụng trong production/commercial project, download quá 7 ngày, thay đổi requirements sau khi mua, không thích design (chủ quan), vi phạm license terms, account bị suspend do vi phạm, force majeure events.",
          icon: Ban,
        },
      ],
    },
    {
      id: "limitation",
      icon: Shield,
      title: "Giới hạn trách nhiệm",
      subtitle: "Phạm vi trách nhiệm của Template Hub",
      color: "from-amber-500 to-orange-400",
      bgColor: "from-amber-50 to-orange-50",
      darkBg: "from-amber-900/20 to-orange-900/20",
      content: [
        {
          subtitle: "⚠️ Không bảo hành tuyệt đối",
          details:
            "Sản phẩm được cung cấp 'AS-IS' basis mà không có bảo hành express hoặc implied về: merchant-ability, fitness for particular purpose, non-infringement, compatibility với future versions, performance benchmarks.",
          icon: AlertTriangle,
        },
        {
          subtitle: "💸 Giới hạn thiệt hại tối đa",
          details:
            "Tổng trách nhiệm pháp lý của Template Hub không vượt quá tổng số tiền bạn đã thanh toán cho sản phẩm/service cụ thể trong 12 tháng gần nhất. Không chịu trách nhiệm cho lost profits, business interruption, data loss.",
          icon: CreditCard,
        },
        {
          subtitle: "🚫 Loại trừ trách nhiệm",
          details:
            "Không chịu trách nhiệm cho: indirect, incidental, special, consequential, punitive damages; third-party claims; force majeure events; user's modification errors; compatibility issues với custom environments; security breaches do user negligence.",
          icon: Ban,
        },
        {
          subtitle: "⚖️ Sử dụng có rủi ro cá nhân",
          details:
            "User acknowledgement: sử dụng products/services hoàn toàn có rủi ro và trách nhiệm cá nhân. Khuyến khích backup data, test thoroughly, follow best practices, keep licenses updated, maintain security measures.",
          icon: HelpCircle,
        },
      ],
    },
    {
      id: "termination",
      icon: AlertTriangle,
      title: "Chấm dứt dịch vụ",
      subtitle: "Điều kiện và hậu quả khi kết thúc",
      color: "from-pink-500 to-rose-400",
      bgColor: "from-pink-50 to-rose-50",
      darkBg: "from-pink-900/20 to-rose-900/20",
      content: [
        {
          subtitle: "👋 Chấm dứt bởi người dùng",
          details:
            "Bạn có thể terminate account bất cứ lúc nào bằng cách: liên hệ support team, sử dụng account settings, hoặc gửi email yêu cầu. Không mất phí terminate. Data sẽ được retained theo GDPR compliance trong 30 ngày.",
          icon: Users,
        },
        {
          subtitle: "🚨 Chấm dứt bởi Template Hub",
          details:
            "Chúng tôi có quyền suspend/terminate account immediately nếu: vi phạm terms of service, abuse system resources, fraudulent activities, payment disputes, copyright infringement, spam/harmful behavior, security violations.",
          icon: Ban,
        },
        {
          subtitle: "📉 Hậu quả khi chấm dứt",
          details:
            "Khi account bị terminated: mất access vào dashboard, không thể download products mới, support requests bị declined, API keys revoked, cloud storage cleared, subscription benefits stopped, community access removed.",
          icon: AlertCircle,
        },
        {
          subtitle: "💾 Sản phẩm đã mua được bảo vệ",
          details:
            "Products đã purchase trước khi terminate vẫn được sử dụng theo original license terms. Không affect đến website/apps đã deploy. Chỉ mất quyền download lại, updates mới, và ongoing support services.",
          icon: Shield,
        },
      ],
    },
  ];

  const stats = [
    {
      icon: Users,
      value: "2M+",
      label: "Khách hàng tin tưởng",
      color: "text-blue-600",
    },
    {
      icon: Scale,
      value: "99.8%",
      label: "Tuân thủ pháp lý",
      color: "text-green-600",
    },
    {
      icon: Globe,
      value: "195+",
      label: "Quốc gia phục vụ",
      color: "text-purple-600",
    },
    {
      icon: Award,
      value: "ISO 27001",
      label: "Chứng nhận quốc tế",
      color: "text-orange-600",
    },
  ];

  const contactInfo = [
    {
      icon: Mail,
      label: "📧 Legal Department",
      value: "legal@templatehub.vn",
      description: "Bộ phận pháp lý chuyên nghiệp",
      color: "from-blue-500 to-cyan-400",
      availability: "Business hours",
    },
    {
      icon: Phone,
      label: "📞 Hotline pháp lý",
      value: "+84 971 386 588",
      description: "Tư vấn pháp lý khẩn cấp",
      color: "from-emerald-500 to-green-400",
      availability: "24/7",
    },
    {
      icon: MessageSquare,
      label: "💬 Live Chat Legal",
      value: "templatehub.vn/legal-chat",
      description: "Chat với chuyên viên pháp lý",
      color: "from-purple-500 to-pink-400",
      availability: "9AM - 9PM",
    },
    {
      icon: MapPin,
      label: "🏢 Trụ sở pháp lý",
      value: "Hà Tu, Hạ Long, Quảng Ninh",
      description: "Địa chỉ đăng ký kinh doanh",
      color: "from-orange-500 to-red-400",
      availability: "Địa chỉ chính thức",
    },
  ];

  const quickLinks = [
    { label: "📋 Privacy Policy", url: "/privacy" },
    { label: "🛡️ Data Protection", url: "/data-protection" },
    { label: "🍪 Cookie Policy", url: "/cookies" },
    { label: "⚖️ Dispute Resolution", url: "/disputes" },
    { label: "📜 License Guide", url: "/license-guide" },
    { label: "🔒 Security Policy", url: "/security" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900">
      <Helmet>
        <title>⚖️ Điều khoản sử dụng | Template Hub - Ràng buộc pháp lý</title>
        <meta
          name="description"
          content="Điều khoản và điều kiện sử dụng đầy đủ của Template Hub. Quy định pháp lý về quyền và nghĩa vụ của người dùng và nhà cung cấp dịch vụ."
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
              className="flex items-center justify-center w-24 h-24 mx-auto mb-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full shadow-2xl"
            >
              <Scale className="w-12 h-12 text-white" />
            </motion.div>

            <h1 className="mb-8 text-5xl font-bold md:text-7xl leading-tight">
              <span className="text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 bg-clip-text">
                Điều khoản sử dụng
              </span>
              <br />
              <span className="text-2xl md:text-3xl font-medium text-muted-foreground">
                Ràng buộc pháp lý và quy định
              </span>
            </h1>

            <p className="mb-12 text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Điều khoản và điều kiện sử dụng
              <span className="text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text font-semibold">
                {" "}
                có tính ràng buộc pháp lý
              </span>{" "}
              khi bạn sử dụng
              <span className="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-semibold">
                {" "}
                Template Hub Platform
              </span>
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
              <Badge
                variant="secondary"
                className="px-6 py-3 text-base bg-white/80 backdrop-blur-sm shadow-lg"
              >
                <Calendar className="w-5 h-5 mr-3 text-purple-600" />
                Hiệu lực: {effectiveDate}
              </Badge>
              <Badge
                variant="secondary"
                className="px-6 py-3 text-base bg-white/80 backdrop-blur-sm shadow-lg"
              >
                <Clock className="w-5 h-5 mr-3 text-green-600" />
                Cập nhật: {lastUpdated}
              </Badge>
              <Badge
                variant="secondary"
                className="px-6 py-3 text-base bg-white/80 backdrop-blur-sm shadow-lg"
              >
                <Globe className="w-5 h-5 mr-3 text-blue-600" />
                Toàn cầu
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
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                x: [0, 60, 0],
                y: [0, -40, 0],
                opacity: [0.1, 0.3, 0.1],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 12 + i * 2,
                repeat: Infinity,
                delay: i * 2,
              }}
              className={`absolute w-24 h-24 rounded-full blur-xl mix-blend-multiply ${
                i % 4 === 0
                  ? "bg-purple-300"
                  : i % 4 === 1
                    ? "bg-pink-300"
                    : i % 4 === 2
                      ? "bg-blue-300"
                      : "bg-red-300"
              }`}
              style={{
                top: `${5 + i * 12}%`,
                left: `${8 + i * 11}%`,
              }}
            />
          ))}
        </div>
      </section>

      <div className="container px-4 pb-20 mx-auto">
        {/* ✅ Overview */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <Card className="bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-0 shadow-2xl backdrop-blur-sm">
            <CardContent className="p-10">
              <div className="flex flex-col lg:flex-row items-start space-y-6 lg:space-y-0 lg:space-x-8">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl shadow-xl"
                >
                  <Gavel className="w-10 h-10 text-white" />
                </motion.div>
                <div className="flex-1">
                  <h2 className="mb-6 text-4xl font-bold">
                    ⚖️ Thỏa thuận pháp lý có ràng buộc
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                    Các điều khoản sử dụng này ("Terms of Service") tạo thành
                    một
                    <span className="text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text font-bold">
                      {" "}
                      thỏa thuận pháp lý có ràng buộc
                    </span>
                    giữa bạn (cá nhân hoặc tổ chức) và
                    <span className="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-bold">
                      {" "}
                      Template Hub Vietnam Co., Ltd
                    </span>
                    liên quan đến việc truy cập và sử dụng toàn bộ hệ sinh thái
                    dịch vụ của chúng tôi.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      {
                        icon: Scale,
                        label: "Tính pháp lý",
                        desc: "Ràng buộc theo luật VN",
                        color: "text-purple-600",
                      },
                      {
                        icon: Globe,
                        label: "Phạm vi áp dụng",
                        desc: "Toàn cầu 195+ quốc gia",
                        color: "text-blue-600",
                      },
                      {
                        icon: Shield,
                        label: "Bảo vệ quyền lợi",
                        desc: "User & Provider",
                        color: "text-green-600",
                      },
                      {
                        icon: Clock,
                        label: "Hiệu lực",
                        desc: "Ngay khi sử dụng",
                        color: "text-orange-600",
                      },
                      {
                        icon: FileText,
                        label: "Cập nhật",
                        desc: "Thông báo trước 30 ngày",
                        color: "text-pink-600",
                      },
                      {
                        icon: Award,
                        label: "Tuân thủ",
                        desc: "GDPR, CCPA, PDPA",
                        color: "text-indigo-600",
                      },
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ y: -5, scale: 1.02 }}
                        className="flex items-center space-x-3 p-4 bg-white/60 rounded-xl shadow-md border border-white/20"
                      >
                        <item.icon className={`w-6 h-6 ${item.color}`} />
                        <div>
                          <div className="text-sm font-semibold">
                            {item.label}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {item.desc}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* ✅ Enhanced Terms Sections */}
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
                <Card className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500">
                  <div className={`h-2 bg-gradient-to-r ${section.color}`} />
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
                    <div className="grid gap-8">
                      {section.content.map((item, itemIndex) => (
                        <motion.div
                          key={itemIndex}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: itemIndex * 0.1 }}
                          className={`group/item bg-gradient-to-r ${section.bgColor} dark:bg-gradient-to-r ${section.darkBg} p-8 rounded-xl border-l-4 border-purple-400 hover:shadow-xl transition-all duration-300`}
                        >
                          <div className="flex items-start space-x-6">
                            <motion.div
                              whileHover={{ scale: 1.15, rotate: 5 }}
                              className={`flex items-center justify-center w-12 h-12 bg-gradient-to-r ${section.color} rounded-xl shadow-md`}
                            >
                              <item.icon className="w-6 h-6 text-white" />
                            </motion.div>
                            <div className="flex-1">
                              <h4 className="font-bold text-xl mb-4 text-purple-800 dark:text-purple-200 group-hover/item:text-purple-600 transition-colors">
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

        {/* ✅ Important Legal Notice */}
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <Card className="bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-red-900/20 border-0 shadow-2xl">
            <CardContent className="p-10">
              <div className="flex items-start space-x-6">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 4 }}
                  className="flex items-center justify-center w-20 h-20 bg-gradient-to-r from-amber-500 to-red-500 rounded-2xl shadow-xl"
                >
                  <Zap className="w-10 h-10 text-white" />
                </motion.div>
                <div className="flex-1">
                  <h3 className="mb-6 text-3xl font-bold text-amber-800 dark:text-amber-200">
                    ⚡ Thông báo quan trọng về thay đổi điều khoản
                  </h3>
                  <p className="text-amber-700 dark:text-amber-300 mb-8 text-lg leading-relaxed">
                    Template Hub có quyền thay đổi, sửa đổi hoặc cập nhật các
                    điều khoản này bất cứ lúc nào để phản ánh những thay đổi
                    trong business model, legal requirements, hoặc để cải thiện
                    user experience. Tất cả các thay đổi quan trọng sẽ được
                    thông báo trước <span className="font-bold">30 ngày</span>{" "}
                    qua email và website notice.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start space-x-3 text-amber-600 dark:text-amber-400 bg-white/60 p-4 rounded-lg">
                      <AlertTriangle className="w-5 h-5 mt-1" />
                      <div>
                        <div className="font-semibold mb-1">
                          Thông báo trước
                        </div>
                        <div className="text-sm">30 ngày cho major changes</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 text-amber-600 dark:text-amber-400 bg-white/60 p-4 rounded-lg">
                      <Mail className="w-5 h-5 mt-1" />
                      <div>
                        <div className="font-semibold mb-1">Kênh thông báo</div>
                        <div className="text-sm">Email + Website + In-app</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 text-amber-600 dark:text-amber-400 bg-white/60 p-4 rounded-lg">
                      <CheckCircle className="w-5 h-5 mt-1" />
                      <div>
                        <div className="font-semibold mb-1">
                          Chấp nhận tự động
                        </div>
                        <div className="text-sm">Tiếp tục sử dụng = đồng ý</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 text-amber-600 dark:text-amber-400 bg-white/60 p-4 rounded-lg">
                      <Scale className="w-5 h-5 mt-1" />
                      <div>
                        <div className="font-semibold mb-1">Quyền từ chối</div>
                        <div className="text-sm">
                          Terminate account nếu không đồng ý
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* ✅ Governing Law */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <Card className="bg-gradient-to-r from-indigo-50 via-blue-50 to-purple-50 dark:from-indigo-900/20 dark:via-blue-900/20 dark:to-purple-900/20 border-0 shadow-2xl">
            <CardContent className="p-10">
              <div className="flex items-start space-x-6">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  className="flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-xl"
                >
                  <Scale className="w-10 h-10 text-white" />
                </motion.div>
                <div className="flex-1">
                  <h3 className="mb-6 text-3xl font-bold text-indigo-800 dark:text-indigo-200">
                    ⚖️ Luật áp dụng & Giải quyết tranh chấp
                  </h3>
                  <p className="text-indigo-700 dark:text-indigo-300 mb-8 text-lg leading-relaxed">
                    Các điều khoản này được điều chỉnh và diễn giải theo
                    <span className="font-bold">
                      {" "}
                      pháp luật Cộng hòa xã hội chủ nghĩa Việt Nam
                    </span>
                    . Mọi tranh chấp phát sinh sẽ được ưu tiên giải quyết thông
                    qua thương lượng, hòa giải trước khi đưa ra Tòa án nhân dân
                    có thẩm quyền tại Việt Nam.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      {
                        icon: Globe,
                        title: "Luật áp dụng",
                        desc: "Pháp luật Việt Nam",
                        detail: "Civil Code, Commercial Law, IP Law",
                      },
                      {
                        icon: Headphones,
                        title: "Giải quyết ưu tiên",
                        desc: "Thương lượng & Hòa giải",
                        detail: "ADR methods trước litigation",
                      },
                      {
                        icon: Building,
                        title: "Thẩm quyền",
                        desc: "Tòa án Việt Nam",
                        detail: "Jurisdiction tại nơi đăng ký DN",
                      },
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ y: -5, scale: 1.02 }}
                        className="text-center bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-md border border-white/20"
                      >
                        <item.icon className="w-12 h-12 mx-auto mb-4 text-indigo-600" />
                        <h4 className="font-bold text-indigo-800 mb-2">
                          {item.title}
                        </h4>
                        <p className="text-indigo-600 font-medium mb-2">
                          {item.desc}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.detail}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* ✅ Quick Links */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              📋 Tài liệu pháp lý liên quan
            </h2>
            <p className="text-lg text-muted-foreground">
              Các chính sách và hướng dẫn bổ sung để hiểu rõ quyền và nghĩa vụ
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickLinks.map((link, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.05 }}
              >
                <Button
                  variant="outline"
                  className="w-full h-auto p-4 bg-white/60 hover:bg-white/80 border-gray-200 hover:border-purple-300 transition-all duration-300"
                >
                  <div className="text-center">
                    <div className="text-lg mb-2">{link.label}</div>
                    <ExternalLink className="w-4 h-4 mx-auto" />
                  </div>
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ✅ Enhanced Contact Information */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="bg-gradient-to-br from-white via-purple-50 to-pink-50 dark:from-slate-800 dark:via-purple-900/20 dark:to-pink-900/20 border-0 shadow-2xl">
            <CardHeader className="text-center pb-10">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full shadow-2xl"
              >
                <Briefcase className="w-10 h-10 text-white" />
              </motion.div>
              <CardTitle className="text-3xl font-bold mb-4">
                ⚖️ Liên hệ bộ phận pháp lý
              </CardTitle>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Nếu bạn có bất kỳ câu hỏi nào về các điều khoản sử dụng này, cần
                tư vấn pháp lý hoặc muốn báo cáo vi phạm, vui lòng liên hệ với
                đội ngũ pháp lý chuyên nghiệp của chúng tôi.
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
                    <h4 className="font-bold text-lg mb-2 group-hover:text-purple-600 transition-colors">
                      {contact.label}
                    </h4>
                    <p className="text-primary font-medium mb-2 text-base">
                      {contact.value}
                    </p>
                    <p className="text-sm text-muted-foreground mb-2">
                      {contact.description}
                    </p>
                    <Badge variant="outline" className="bg-gray-100 text-xs">
                      {contact.availability}
                    </Badge>
                  </motion.div>
                ))}
              </div>

              {/* ✅ Additional Legal Info */}
              <Separator className="my-10" />
              <div className="text-center space-y-6">
                <h4 className="text-xl font-semibold">
                  📋 Thông tin pháp lý bổ sung
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      title: "🏢 Đăng ký kinh doanh",
                      desc: "MST: 0123456789",
                      detail: "Sở KH&ĐT Quảng Ninh",
                    },
                    {
                      title: "⚖️ Luật sư đại diện",
                      desc: "Công ty Luật ABC",
                      detail: "Giấy phép số 123/GP-BTP",
                    },
                    {
                      title: "🏛️ Cơ quan quản lý",
                      desc: "Bộ Thông tin & Truyền thông",
                      detail: "Giấy phép ICP số 456",
                    },
                  ].map((info, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-md border border-white/20"
                    >
                      <div className="font-semibold text-gray-800 mb-1">
                        {info.title}
                      </div>
                      <div className="text-purple-600 font-medium mb-1">
                        {info.desc}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {info.detail}
                      </div>
                    </motion.div>
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

export default Terms;
