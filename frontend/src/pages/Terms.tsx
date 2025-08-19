import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

// ✅ Types and Interfaces
interface Section {
  id: string;
  icon: React.ElementType;
  title: string;
  subtitle: string;
  color: string;
  bgColor: string;
  darkBg: string;
  content: ContentItem[];
  priority?: "high" | "medium" | "low";
}

interface ContentItem {
  subtitle: string;
  details: string;
  icon: React.ElementType;
  examples?: string[];
  warning?: boolean;
}

interface ContactInfo {
  icon: React.ElementType;
  label: string;
  value: string;
  description: string;
  color: string;
  availability: string;
  href?: string;
}

const Terms: React.FC = () => {
  // ✅ State Management
  const [activeSection, setActiveSection] = useState("overview");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(),
  );
  const [showFloatingNav, setShowFloatingNav] = useState(false);
  const [readingSections, setReadingSections] = useState<Set<string>>(
    new Set(),
  );

  const { scrollYProgress } = useScroll();
  const headerY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  // ✅ Constants
  const lastUpdated = "19 tháng 8, 2025";
  const effectiveDate = "1 tháng 9, 2025";
  const version = "v2.1";

  // ✅ Enhanced Color Palette - Phối màu mới đẹp hơn
  const colorSchemes = {
    primary: {
      gradient: "from-emerald-500 via-teal-500 to-cyan-500",
      bg: "from-emerald-50/80 to-teal-50/80",
      darkBg: "from-emerald-900/30 to-teal-900/30",
      accent: "text-emerald-600",
      textDark: "text-emerald-800",
      textLight: "text-emerald-200",
    },
    success: {
      gradient: "from-green-500 via-emerald-500 to-lime-500",
      bg: "from-green-50/80 to-lime-50/80",
      darkBg: "from-green-900/30 to-lime-900/30",
      accent: "text-green-600",
      textDark: "text-green-800",
      textLight: "text-green-200",
    },
    warning: {
      gradient: "from-amber-500 via-orange-500 to-yellow-500",
      bg: "from-amber-50/80 to-yellow-50/80",
      darkBg: "from-amber-900/30 to-yellow-900/30",
      accent: "text-amber-600",
      textDark: "text-amber-800",
      textLight: "text-amber-200",
    },
    danger: {
      gradient: "from-rose-500 via-pink-500 to-red-500",
      bg: "from-rose-50/80 to-pink-50/80",
      darkBg: "from-rose-900/30 to-pink-900/30",
      accent: "text-rose-600",
      textDark: "text-rose-800",
      textLight: "text-rose-200",
    },
    info: {
      gradient: "from-violet-500 via-purple-500 to-indigo-500",
      bg: "from-violet-50/80 to-indigo-50/80",
      darkBg: "from-violet-900/30 to-indigo-900/30",
      accent: "text-violet-600",
      textDark: "text-violet-800",
      textLight: "text-violet-200",
    },
    special: {
      gradient: "from-blue-500 via-cyan-500 to-teal-500",
      bg: "from-blue-50/80 to-cyan-50/80",
      darkBg: "from-blue-900/30 to-cyan-900/30",
      accent: "text-blue-600",
      textDark: "text-blue-800",
      textLight: "text-blue-200",
    },
  };

  // ✅ Enhanced Sections Data với màu sắc mới
  const sections: Section[] = useMemo(
    () => [
      {
        id: "overview",
        icon: FileText,
        title: "Tổng quan điều khoản",
        subtitle: "Thông tin cơ bản về điều khoản sử dụng",
        color: colorSchemes.special.gradient,
        bgColor: colorSchemes.special.bg,
        darkBg: colorSchemes.special.darkBg,
        priority: "high",
        content: [
          {
            subtitle: "📋 Giới thiệu chung",
            details:
              "Điều khoản sử dụng này (Terms of Service) là thỏa thuận pháp lý có ràng buộc giữa bạn và Template Market Vietnam Co., Ltd. Tài liệu này quy định các quyền, nghĩa vụ và trách nhiệm của các bên khi sử dụng nền tảng của chúng tôi.",
            icon: Info,
            examples: [
              "Website templatemarket.vn",
              "Mobile applications",
              "API services",
              "Cloud storage",
            ],
          },
          {
            subtitle: "⚖️ Tính pháp lý",
            details:
              "Bằng việc truy cập, đăng ký tài khoản hoặc sử dụng bất kỳ dịch vụ nào của chúng tôi, bạn đồng ý tuân thủ hoàn toàn các điều khoản này. Các điều khoản có hiệu lực ngay lập tức và áp dụng trong suốt quá trình sử dụng dịch vụ.",
            icon: Scale,
            warning: true,
          },
          {
            subtitle: "🔄 Cập nhật và thông báo",
            details:
              "Template Market có quyền thay đổi, sửa đổi các điều khoản này bất cứ lúc nào. Những thay đổi quan trọng sẽ được thông báo trước 30 ngày qua email và website. Việc tiếp tục sử dụng dịch vụ sau khi có thay đổi được coi là chấp nhận điều khoản mới.",
            icon: Clock,
            examples: [
              "Email notification",
              "Website banner",
              "In-app notification",
              "SMS alert",
            ],
          },
        ],
      },
      {
        id: "definitions",
        icon: BookOpen,
        title: "Định nghĩa thuật ngữ",
        subtitle: "Giải thích các khái niệm quan trọng",
        color: colorSchemes.info.gradient,
        bgColor: colorSchemes.info.bg,
        darkBg: colorSchemes.info.darkBg,
        priority: "high",
        content: [
          {
            subtitle: "🏢 Template Market Platform",
            details:
              "Toàn bộ hệ sinh thái bao gồm website chính, mobile apps, API services, CDN network, cloud storage, payment gateway và tất cả các dịch vụ liên quan được vận hành bởi Template Market Vietnam Co., Ltd và các đối tác được ủy quyền.",
            icon: Building,
            examples: [
              "Main website",
              "iOS/Android apps",
              "REST APIs",
              "GraphQL endpoints",
              "CDN services",
            ],
          },
          {
            subtitle: "👤 Người dùng/Khách hàng",
            details:
              "Bao gồm mọi cá nhân, doanh nghiệp, tổ chức, agency, freelancer hoặc thực thể pháp lý đăng ký, truy cập và sử dụng nền tảng. Phân loại thành: Free users, Premium subscribers, Enterprise customers, Partners và Resellers.",
            icon: Users,
            examples: [
              "Individual users",
              "Small businesses",
              "Enterprise clients",
              "Educational institutions",
              "Government agencies",
            ],
          },
          {
            subtitle: "🎨 Sản phẩm số",
            details:
              "Toàn bộ tài sản trí tuệ số bao gồm: Website templates, UI kits, dashboard themes, mobile app designs, email templates, presentations, graphics, icons, fonts, source code, documentation và các digital assets khác được phân phối qua nền tảng.",
            icon: Award,
            examples: [
              "React templates",
              "Vue.js themes",
              "Angular dashboards",
              "WordPress themes",
              "Shopify templates",
            ],
          },
          {
            subtitle: "📜 Giấy phép sử dụng",
            details:
              "Quyền sử dụng hợp pháp được cấp khi mua sản phẩm, bao gồm Standard License (1 dự án), Extended License (multiple projects), Enterprise License (unlimited usage) với các điều khoản, giới hạn và quyền lợi cụ thể được quy định rõ ràng.",
            icon: Scale,
            examples: [
              "Standard: Single project",
              "Extended: Multiple projects",
              "Enterprise: Unlimited use",
              "White-label rights",
            ],
          },
        ],
      },
      {
        id: "acceptance",
        icon: UserCheck,
        title: "Chấp nhận & Ràng buộc",
        subtitle: "Điều kiện để sử dụng dịch vụ",
        color: colorSchemes.success.gradient,
        bgColor: colorSchemes.success.bg,
        darkBg: colorSchemes.success.darkBg,
        priority: "high",
        content: [
          {
            subtitle: "✅ Đồng ý sử dụng",
            details:
              "Bằng cách tạo tài khoản, download app, sử dụng API, thực hiện thanh toán, hoặc tương tác với bất kỳ phần nào của dịch vụ, bạn tự động đồng ý và cam kết tuân thủ 100% các điều khoản này cùng với Privacy Policy và Cookie Policy.",
            icon: CheckCircle,
            warning: true,
          },
          {
            subtitle: "🎂 Độ tuổi và năng lực",
            details:
              "Người dùng phải đủ 16 tuổi trở lên hoặc có sự đồng ý bằng văn bản từ phụ huynh/người giám hộ hợp pháp. Đối với doanh nghiệp, người đại diện phải có đầy đủ thẩm quyền ký kết hợp đồng và thực hiện các nghĩa vụ tài chính.",
            icon: Calendar,
            examples: [
              "Personal ID verification",
              "Business registration",
              "Legal representative authorization",
              "Parental consent form",
            ],
          },
          {
            subtitle: "🏛️ Năng lực pháp lý",
            details:
              "Bạn xác nhận có đầy đủ năng lực hành vi dân sự theo pháp luật, không bị hạn chế quyền năng bởi tòa án, có khả năng thực hiện nghĩa vụ tài chính và chịu trách nhiệm pháp lý đầy đủ cho các hành vi của mình trên nền tảng.",
            icon: Gavel,
            warning: true,
          },
        ],
      },
      {
        id: "registration",
        icon: Users,
        title: "Đăng ký tài khoản",
        subtitle: "Quy định về tạo và quản lý tài khoản",
        color: colorSchemes.primary.gradient,
        bgColor: colorSchemes.primary.bg,
        darkBg: colorSchemes.primary.darkBg,
        priority: "high",
        content: [
          {
            subtitle: "📋 Thông tin chính xác",
            details:
              "Cam kết cung cấp thông tin đăng ký hoàn toàn chính xác, đầy đủ và cập nhật. Bao gồm: họ tên thật, email hợp lệ, số điện thoại, địa chỉ, thông tin doanh nghiệp (nếu có). Việc cung cấp thông tin sai lệch có thể dẫn đến việc khóa tài khoản vĩnh viễn.",
            icon: FileText,
            examples: [
              "Full legal name",
              "Valid email address",
              "Phone verification",
              "Address confirmation",
              "Business license",
            ],
          },
          {
            subtitle: "🔐 Bảo mật tuyệt đối",
            details:
              "Hoàn toàn chịu trách nhiệm bảo vệ thông tin đăng nhập bao gồm username, password, 2FA codes, security questions. Sử dụng mật khẩu mạnh (tối thiểu 12 ký tự, bao gồm chữ hoa, thường, số, ký tự đặc biệt). Bắt buộc kích hoạt 2FA cho tài khoản Premium.",
            icon: Shield,
            warning: true,
            examples: [
              "Strong password policy",
              "Two-factor authentication",
              "Security questions",
              "Login notifications",
              "Session management",
            ],
          },
          {
            subtitle: "👤 Sử dụng cá nhân",
            details:
              "Tài khoản chỉ dành riêng cho chủ sở hữu, nghiêm cấm chia sẻ, cho mượn, bán hoặc chuyển nhượng. Mỗi cá nhân/tổ chức chỉ được tạo MỘT tài khoản duy nhất. Vi phạm quy định này sẽ bị khóa tất cả tài khoản liên quan và mất toàn bộ quyền lợi.",
            icon: UserCheck,
            warning: true,
          },
          {
            subtitle: "🚨 Báo cáo vi phạm",
            details:
              "Nghĩa vụ thông báo ngay lập tức (trong vòng 24 giờ) cho team support qua hotline 24/7, live chat hoặc email security@templatemarket.vn nếu phát hiện tài khoản bị hack, sử dụng trái phép, hoạt động đáng ngờ hoặc vi phạm bảo mật.",
            icon: AlertCircle,
            examples: [
              "Suspicious login attempts",
              "Unauthorized access",
              "Password compromise",
              "Identity theft",
              "Account takeover",
            ],
          },
        ],
      },
      {
        id: "purchases",
        icon: CreditCard,
        title: "Mua hàng & Thanh toán",
        subtitle: "Quy trình và chính sách giao dịch",
        color: colorSchemes.warning.gradient,
        bgColor: colorSchemes.warning.bg,
        darkBg: colorSchemes.warning.darkBg,
        priority: "high",
        content: [
          {
            subtitle: "💰 Giá cả & Tiền tệ",
            details:
              "Giá được hiển thị bằng VND, USD, EUR tùy vị trí địa lý. Giá đã bao gồm thuế VAT 10% (Việt Nam), GST, Sales Tax theo quy định từng quốc gia. Giá có thể thay đổi do biến động tỷ giá, inflation, chi phí vận hành nhưng không ảnh hưởng đến đơn hàng đã thanh toán.",
            icon: Globe,
            examples: [
              "VND for Vietnam",
              "USD for international",
              "EUR for Europe",
              "Local tax rates",
              "Currency conversion",
            ],
          },
          {
            subtitle: "💳 Phương thức thanh toán",
            details:
              "Hỗ trợ đa dạng: Visa/Mastercard/JCB/UnionPay, Digital wallets (MoMo, ZaloPay, VNPay, ShopeePay), Banking (50+ ngân hàng), International (PayPal, Stripe, Apple Pay, Google Pay), Cryptocurrency (BTC, ETH, USDT), Buy Now Pay Later (Atome, Fundiin), Corporate accounts.",
            icon: CreditCard,
            examples: [
              "Credit/Debit cards",
              "Digital wallets",
              "Bank transfers",
              "Crypto payments",
              "Corporate billing",
            ],
          },
          {
            subtitle: "✅ Xác nhận đơn hàng",
            details:
              "Đơn hàng được xử lý tự động sau khi thanh toán thành công. Email confirmation + invoice gửi trong 60 giây. Download links và license keys có sẵn ngay lập tức trong dashboard. Order tracking realtime, support chat integration, automatic receipt generation.",
            icon: CheckCircle,
            examples: [
              "Instant confirmation",
              "Email receipts",
              "Download links",
              "License activation",
              "Order tracking",
            ],
          },
          {
            subtitle: "📊 Thuế & Compliance",
            details:
              "Khách hàng chịu trách nhiệm khai báo thuế thu nhập cá nhân, thuế doanh nghiệp, VAT/GST theo quy định pháp luật tại quốc gia mình. Chúng tôi cung cấp đầy đủ hóa đơn VAT (Việt Nam), Tax Invoice (quốc tế), W-9 forms (US), compliance documents theo yêu cầu.",
            icon: FileText,
            warning: true,
          },
        ],
      },
      {
        id: "licenses",
        icon: Scale,
        title: "Giấy phép chi tiết",
        subtitle: "Các loại license và quyền sử dụng",
        color: colorSchemes.info.gradient,
        bgColor: colorSchemes.info.bg,
        darkBg: colorSchemes.info.darkBg,
        priority: "medium",
        content: [
          {
            subtitle: "🎯 Standard License",
            details:
              "Sử dụng cho 1 dự án end-product (website, app) phục vụ unlimited users. Bao gồm: commercial websites, personal portfolios, client projects, SaaS applications (single tenant). Không được resell template dưới dạng gốc. Có thể customize unlimited, remove branding trong production.",
            icon: Target,
            examples: [
              "Business website",
              "Portfolio site",
              "Client project",
              "Single SaaS app",
              "E-commerce store",
            ],
          },
          {
            subtitle: "⭐ Extended License",
            details:
              "Multiple end-products, resale as part of larger work, SaaS multi-tenant, marketplace integration, white-label solutions. Bao gồm: priority support, customization services, source code access, API integration support, developer documentation, update notifications, beta access.",
            icon: Star,
            examples: [
              "Multiple websites",
              "SaaS platform",
              "Reseller products",
              "White-label solutions",
              "Marketplace themes",
            ],
          },
          {
            subtitle: "🏢 Enterprise License",
            details:
              "Unlimited usage cho toàn tổ chức + subsidiaries + unlimited client projects. Custom development, dedicated support team, SLA guarantee, priority feature requests, training sessions, code review, security audit, compliance documentation, legal indemnification.",
            icon: Building,
            examples: [
              "Corporation use",
              "Unlimited projects",
              "Team collaboration",
              "Custom development",
              "Legal protection",
            ],
          },
          {
            subtitle: "🚫 Hành vi cấm",
            details:
              "NGHIÊM CẤM: Redistribute source code, create direct competitors, resell as original templates, claim authorship, reverse engineer protected parts, remove copyright notices, use for illegal purposes, violate IP rights, mass download, automated scraping.",
            icon: Ban,
            warning: true,
            examples: [
              "Code redistribution",
              "Template resale",
              "Copyright removal",
              "Illegal usage",
              "Mass downloading",
            ],
          },
        ],
      },
      {
        id: "prohibited",
        icon: Ban,
        title: "Hành vi nghiêm cấm",
        subtitle: "Những gì tuyệt đối không được phép",
        color: colorSchemes.danger.gradient,
        bgColor: colorSchemes.danger.bg,
        darkBg: colorSchemes.danger.darkBg,
        priority: "high",
        content: [
          {
            subtitle: "⚖️ Nội dung bất hợp pháp",
            details:
              "NGHIÊM CẤM sử dụng cho: adult/pornographic content, online gambling, drug trafficking, weapons sales, hate speech, terrorism promotion, money laundering, pyramid schemes, fake news distribution, phishing sites, malware hosting, spam networks, copyright infringement.",
            icon: Gavel,
            warning: true,
            examples: [
              "Adult content",
              "Gambling sites",
              "Drug trafficking",
              "Weapon sales",
              "Hate speech",
            ],
          },
          {
            subtitle: "📋 Vi phạm bản quyền",
            details:
              "Không được: copy/redistribute source code, remove author attribution, reverse engineer protected components, decompile minified code, extract assets for separate use, create derivative works for resale, share license keys, upload to torrent/piracy sites, claim original authorship.",
            icon: Shield,
            warning: true,
            examples: [
              "Code redistribution",
              "Attribution removal",
              "Reverse engineering",
              "Piracy distribution",
              "False claims",
            ],
          },
          {
            subtitle: "🔧 Hành vi kỹ thuật",
            details:
              "Cấm: automated scraping/crawling, API abuse, server overloading, DDoS attacks, penetration testing không được phép, exploit vulnerabilities, bypass security measures, crack licensing systems, use bots/scripts, create fake accounts, manipulate metrics.",
            icon: Code,
            warning: true,
            examples: [
              "Web scraping",
              "API abuse",
              "DDoS attacks",
              "Security exploits",
              "Bot usage",
            ],
          },
          {
            subtitle: "📧 Spam & Abuse",
            details:
              "Nghiêm cấm: bulk email marketing, comment spam, review manipulation, rating fraud, social media spam, referral abuse, coupon fraud, chargeback fraud, identity theft, social engineering attacks, harassment, cyberbullying, stalking.",
            icon: AlertTriangle,
            warning: true,
            examples: [
              "Email spam",
              "Review manipulation",
              "Fraud attempts",
              "Identity theft",
              "Harassment",
            ],
          },
        ],
      },
      {
        id: "refunds",
        icon: Download,
        title: "Chính sách hoàn tiền",
        subtitle: "Điều kiện và quy trình hoàn tiền",
        color: colorSchemes.success.gradient,
        bgColor: colorSchemes.success.bg,
        darkBg: colorSchemes.success.darkBg,
        priority: "medium",
        content: [
          {
            subtitle: "⏰ Khung thời gian",
            details:
              "Chính sách hoàn tiền 30 ngày không điều kiện cho tất cả sản phẩm digital. Thời hạn tính từ ngày mua đầu tiên, không phụ thuộc thời điểm download. Áp dụng cho single purchases, subscription plans, enterprise contracts. No questions asked policy với automated refund system.",
            icon: Clock,
            examples: [
              "30-day window",
              "Single purchases",
              "Subscriptions",
              "Enterprise plans",
              "Automated process",
            ],
          },
          {
            subtitle: "✅ Điều kiện chấp nhận",
            details:
              "Được hoàn tiền khi: sản phẩm không đúng mô tả, lỗi kỹ thuật nghiêm trọng không khắc phục được, không tương thích với platform cam kết, thiếu files quan trọng, không match với preview/demo, technical requirements sai lệch, performance issues critical.",
            icon: CheckCircle,
            examples: [
              "Product mismatch",
              "Technical errors",
              "Missing files",
              "Compatibility issues",
              "Performance problems",
            ],
          },
          {
            subtitle: "🚀 Quy trình nhanh",
            details:
              "Bước 1: Submit refund request với Order ID. Bước 2: Provide detailed reason + evidence. Bước 3: Auto-review trong 24h (working days). Bước 4: Approval notification + processing. Bước 5: Tiền về account trong 3-7 ngày tùy payment method. Real-time tracking available.",
            icon: Zap,
            examples: [
              "Online form",
              "24h review",
              "Auto-approval",
              "Multiple payment methods",
              "Real-time tracking",
            ],
          },
          {
            subtitle: "❌ Từ chối hoàn tiền",
            details:
              "KHÔNG hoàn tiền khi: đã sử dụng trong production >7 ngày, thay đổi requirements sau mua, không thích design (subjective), vi phạm license terms, account suspended do misconduct, force majeure events, change of mind sau 30 ngày.",
            icon: Ban,
            warning: true,
            examples: [
              "Production usage >7 days",
              "Requirement changes",
              "Subjective preferences",
              "License violations",
              "Policy violations",
            ],
          },
        ],
      },
      {
        id: "limitation",
        icon: Shield,
        title: "Giới hạn trách nhiệm",
        subtitle: "Phạm vi trách nhiệm Template Market",
        color: colorSchemes.warning.gradient,
        bgColor: colorSchemes.warning.bg,
        darkBg: colorSchemes.warning.darkBg,
        priority: "medium",
        content: [
          {
            subtitle: "⚠️ Disclaimer tổng quát",
            details:
              "Sản phẩm được cung cấp 'AS-IS' basis không có bảo hành express/implied về: merchantability, fitness for particular purpose, non-infringement, compatibility với future versions, performance benchmarks, security vulnerabilities, third-party integrations.",
            icon: AlertTriangle,
            warning: true,
          },
          {
            subtitle: "💸 Giới hạn thiệt hại",
            details:
              "Tổng trách nhiệm pháp lý không vượt quá 100% tổng số tiền đã thanh toán trong 12 tháng gần nhất cho sản phẩm/service cụ thể. Không chịu trách nhiệm cho: lost profits, business interruption, data loss, indirect damages, consequential losses.",
            icon: CreditCard,
            warning: true,
          },
          {
            subtitle: "🚫 Loại trừ trách nhiệm",
            details:
              "Không chịu trách nhiệm: indirect/incidental/special/consequential/punitive damages, third-party claims, force majeure events, user modification errors, compatibility issues với custom environments, security breaches do user negligence, data breaches từ user systems.",
            icon: Ban,
            warning: true,
          },
          {
            subtitle: "⚖️ Rủi ro cá nhân",
            details:
              "User acknowledgement: sử dụng products/services hoàn toàn có rủi ro và trách nhiệm cá nhân. Strongly recommend: backup data regularly, test thoroughly trước production, follow security best practices, keep systems updated, maintain proper licenses, implement monitoring.",
            icon: HelpCircle,
            examples: [
              "Regular backups",
              "Thorough testing",
              "Security practices",
              "System updates",
              "License compliance",
            ],
          },
        ],
      },
      {
        id: "termination",
        icon: AlertTriangle,
        title: "Chấm dứt dịch vụ",
        subtitle: "Điều kiện kết thúc và hậu quả",
        color: colorSchemes.danger.gradient,
        bgColor: colorSchemes.danger.bg,
        darkBg: colorSchemes.danger.darkBg,
        priority: "medium",
        content: [
          {
            subtitle: "👋 Người dùng chấm dứt",
            details:
              "Có thể terminate account bất cứ lúc nào: contact support team, account settings, email request đến terminate@templatemarket.vn. Không phí termination. Data retention theo GDPR compliance 30 ngày, sau đó permanently deleted. Export data available before termination.",
            icon: Users,
            examples: [
              "Self-service termination",
              "Email request",
              "Data export",
              "GDPR compliance",
              "No termination fees",
            ],
          },
          {
            subtitle: "🚨 Platform chấm dứt",
            details:
              "Quyền suspend/terminate account immediately nếu: ToS violations, payment fraud, copyright infringement, security threats, abuse system resources, spam activities, illegal content, harassment users, multiple warnings ignored, court orders.",
            icon: Ban,
            warning: true,
            examples: [
              "Policy violations",
              "Payment fraud",
              "Security threats",
              "Spam activities",
              "Legal orders",
            ],
          },
          {
            subtitle: "📉 Hậu quả ngay lập tức",
            details:
              "Khi terminated: lose access dashboard, cannot download new products, support requests declined, API keys revoked immediately, cloud storage cleared, subscription benefits stopped, community access removed, affiliate commissions frozen, pending payouts cancelled.",
            icon: AlertCircle,
            warning: true,
          },
          {
            subtitle: "💾 Sản phẩm được bảo vệ",
            details:
              "Products đã mua trước termination vẫn sử dụng theo original license terms. Không affect websites/apps deployed. CHỈ mất: download privileges, future updates, ongoing support, cloud services, community access, affiliate program, new purchases.",
            icon: Shield,
            examples: [
              "Existing licenses valid",
              "Deployed sites unaffected",
              "No future downloads",
              "No updates",
              "No support",
            ],
          },
        ],
      },
    ],
    [],
  );

  // ✅ Enhanced Stats với màu mới
  const stats = [
    {
      icon: Users,
      value: "2.5M+",
      label: "Khách hàng tin tưởng",
      color: "text-emerald-600",
    },
    {
      icon: Scale,
      value: "99.9%",
      label: "Tuân thủ pháp lý",
      color: "text-green-600",
    },
    {
      icon: Globe,
      value: "195+",
      label: "Quốc gia phục vụ",
      color: "text-teal-600",
    },
    {
      icon: Award,
      value: "ISO 27001",
      label: "Chứng nhận bảo mật",
      color: "text-cyan-600",
    },
  ];

  // ✅ Contact Information với màu mới
  const contactInfo: ContactInfo[] = [
    {
      icon: Mail,
      label: "Legal Department",
      value: "legal@templatemarket.vn",
      description: "Bộ phận pháp lý chuyên nghiệp",
      color: colorSchemes.special.gradient,
      availability: "24/7 Email Response",
      href: "mailto:legal@templatemarket.vn",
    },
    {
      icon: Phone,
      label: "Legal Hotline",
      value: "+84 971 386 588",
      description: "Tư vấn pháp lý khẩn cấp",
      color: colorSchemes.success.gradient,
      availability: "Business Hours",
      href: "tel:+84971386588",
    },
    {
      icon: MessageSquare,
      label: "Live Chat Legal",
      value: "templatemarket.vn/legal-chat",
      description: "Chat với chuyên viên pháp lý",
      color: colorSchemes.info.gradient,
      availability: "9:00 - 21:00 GMT+7",
      href: "https://templatemarket.vn/legal-chat",
    },
    {
      icon: MapPin,
      label: "Legal Address",
      value: "Hạ Long, Quảng Ninh, Vietnam",
      description: "Địa chỉ đăng ký kinh doanh",
      color: colorSchemes.warning.gradient,
      availability: "Địa chỉ chính thức",
    },
  ];

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

  const handleAcceptTerms = useCallback(() => {
    setAcceptedTerms(true);
    toast({
      title: "✅ Đã chấp nhận điều khoản",
      description: "Cảm ơn bạn đã đọc và đồng ý với điều khoản sử dụng.",
    });
  }, []);

  // ✅ Effects
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(Math.min(progress, 100));
      setShowFloatingNav(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Filter sections based on search
  const filteredSections = useMemo(() => {
    if (!searchQuery) return sections;
    return sections.filter(
      (section) =>
        section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        section.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        section.content.some(
          (item) =>
            item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.details.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
    );
  }, [sections, searchQuery]);

  // ✅ Reading Progress Component
  const ReadingProgress: React.FC = () => (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 z-50">
      <motion.div
        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
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
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 hover:from-emerald-600 hover:to-teal-600"
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

  return (
    <>
      <Helmet>
        <title>
          ⚖️ Điều khoản sử dụng {version} | Template Market - Ràng buộc pháp lý
        </title>
        <meta
          name="description"
          content="Điều khoản và điều kiện sử dụng đầy đủ của Template Market. Quy định pháp lý về quyền và nghĩa vụ của người dùng và nhà cung cấp dịch vụ."
        />
        <meta
          name="keywords"
          content="điều khoản sử dụng, terms of service, pháp lý, template market, quyền và nghĩa vụ"
        />
        <meta
          property="og:title"
          content="Điều khoản sử dụng - Template Market"
        />
        <meta
          property="og:description"
          content="Tài liệu pháp lý quy định quyền và nghĩa vụ khi sử dụng dịch vụ Template Market"
        />
        <link rel="canonical" href="https://templatemarket.vn/terms" />
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
                className="flex items-center justify-center w-28 h-28 mx-auto mb-8 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl shadow-2xl"
              >
                <Scale className="w-14 h-14 text-white" />
              </motion.div>

              {/* Title */}
              <h1 className="mb-8 text-5xl lg:text-7xl font-bold leading-tight">
                <span className="text-transparent bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-500 bg-clip-text">
                  Điều khoản sử dụng
                </span>
                <br />
                <span className="text-2xl lg:text-3xl font-medium text-gray-700 dark:text-gray-300">
                  Template Market Platform
                </span>
              </h1>

              {/* Subtitle */}
              <p className="mb-12 text-xl lg:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-4xl mx-auto">
                Tài liệu pháp lý
                <span className="text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text font-semibold">
                  {" "}
                  có tính ràng buộc pháp lý{" "}
                </span>
                quy định quyền và nghĩa vụ khi sử dụng dịch vụ của chúng tôi
              </p>

              {/* Version & Date Info */}
              <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
                <Badge className="px-6 py-3 text-base bg-white/90 backdrop-blur-sm shadow-lg border-0 text-gray-800">
                  <FileText className="w-5 h-5 mr-3 text-emerald-600" />
                  Version {version}
                </Badge>
                <Badge className="px-6 py-3 text-base bg-white/90 backdrop-blur-sm shadow-lg border-0 text-gray-800">
                  <Calendar className="w-5 h-5 mr-3 text-green-600" />
                  Hiệu lực: {effectiveDate}
                </Badge>
                <Badge className="px-6 py-3 text-base bg-white/90 backdrop-blur-sm shadow-lg border-0 text-gray-800">
                  <Clock className="w-5 h-5 mr-3 text-amber-600" />
                  Cập nhật: {lastUpdated}
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
                    ? "bg-emerald-300/40"
                    : i % 4 === 1
                      ? "bg-teal-300/40"
                      : i % 4 === 2
                        ? "bg-cyan-300/40"
                        : "bg-yellow-300/40"
                }`}
                style={{
                  top: `${5 + (i % 4) * 25}%`,
                  left: `${3 + (i % 3) * 35}%`,
                }}
              />
            ))}
          </div>
        </motion.section>

        {/* ✅ Main Content */}
        <div className="container px-4 pb-20 mx-auto">
          {/* Search & Filter Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm trong điều khoản..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-800 transition-all duration-200 text-gray-800 dark:text-gray-200"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge
                      variant="outline"
                      className="px-3 py-1 text-gray-700 dark:text-gray-300"
                    >
                      {filteredSections.length} / {sections.length} mục
                    </Badge>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <BookOpen className="w-4 h-4" />
                      <span>{readingSections.size} đã đọc</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Terms Sections */}
          <div className="space-y-8">
            {filteredSections.map((section, sectionIndex) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: sectionIndex * 0.1, duration: 0.6 }}
                onViewportEnter={() => markSectionAsRead(section.id)}
              >
                <Card className="group bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg border-0 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
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
                    {(expandedSections.has(section.id) || searchQuery) && (
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
                              className={`group/item bg-gradient-to-r ${section.bgColor} dark:bg-gradient-to-r ${section.darkBg} p-6 rounded-xl border-l-4 ${
                                item.warning
                                  ? "border-red-500"
                                  : "border-emerald-400"
                              } hover:shadow-lg transition-all duration-300`}
                            >
                              <div className="flex items-start space-x-4">
                                <motion.div
                                  whileHover={{ scale: 1.15, rotate: 5 }}
                                  className={`flex items-center justify-center w-12 h-12 bg-gradient-to-r ${
                                    item.warning
                                      ? colorSchemes.danger.gradient
                                      : section.color
                                  } rounded-xl shadow-md`}
                                >
                                  <item.icon className="w-6 h-6 text-white" />
                                </motion.div>

                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-3">
                                    <h4
                                      className={`font-bold text-lg ${
                                        item.warning
                                          ? "text-red-700 dark:text-red-300"
                                          : "text-gray-800 dark:text-gray-200"
                                      }`}
                                    >
                                      {item.subtitle}
                                    </h4>
                                    {item.warning && (
                                      <Badge className="bg-red-500 hover:bg-red-600 text-white text-xs border-0">
                                        ⚠️ Quan trọng
                                      </Badge>
                                    )}
                                  </div>

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

          {/* Acceptance Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20"
          >
            <Card className="bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/90 dark:from-emerald-900/20 dark:to-teal-900/20 border-0 shadow-2xl">
              <CardContent className="p-10 text-center">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-2xl"
                >
                  <CheckSquare className="w-10 h-10 text-white" />
                </motion.div>

                <h3 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
                  ✅ Xác nhận đã đọc và hiểu điều khoản
                </h3>

                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                  Bằng cách nhấn nút bên dưới, bạn xác nhận đã đọc, hiểu và đồng
                  ý tuân thủ tất cả các điều khoản và điều kiện được nêu trong
                  tài liệu này.
                </p>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    onClick={handleAcceptTerms}
                    disabled={acceptedTerms}
                    className={`px-12 py-4 text-lg font-semibold rounded-xl shadow-lg transition-all duration-300 border-0 ${
                      acceptedTerms
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                    }`}
                  >
                    {acceptedTerms ? (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Đã chấp nhận điều khoản
                      </>
                    ) : (
                      <>
                        <CheckSquare className="w-5 h-5 mr-2" />
                        Tôi đồng ý với điều khoản
                      </>
                    )}
                  </Button>
                </motion.div>

                <div className="mt-8 text-sm text-gray-500 dark:text-gray-500">
                  <p>
                    Bằng việc sử dụng dịch vụ, bạn đã tự động đồng ý với điều
                    khoản này
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* Contact Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20"
          >
            <Card className="bg-gradient-to-br from-white via-orange-50/30 to-pink-50/30 dark:from-gray-800 dark:via-orange-900/10 dark:to-pink-900/10 border-0 shadow-2xl">
              <CardHeader className="text-center pb-8">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-2xl"
                >
                  <Briefcase className="w-10 h-10 text-white" />
                </motion.div>
                <CardTitle className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                  📞 Liên hệ bộ phận pháp lý
                </CardTitle>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                  Nếu bạn có câu hỏi về điều khoản này, cần tư vấn pháp lý hoặc
                  muốn báo cáo vi phạm, vui lòng liên hệ với đội ngũ pháp lý
                  chuyên nghiệp của chúng tôi.
                </p>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {contactInfo.map((contact, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
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

                      <h4 className="font-bold text-lg mb-2 group-hover:text-emerald-600 transition-colors text-gray-800 dark:text-gray-200">
                        {contact.label}
                      </h4>

                      {contact.href ? (
                        <a
                          href={contact.href}
                          className="text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium mb-2 block transition-colors"
                        >
                          {contact.value}
                        </a>
                      ) : (
                        <p className="text-emerald-600 dark:text-emerald-400 font-medium mb-2">
                          {contact.value}
                        </p>
                      )}

                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {contact.description}
                      </p>

                      <Badge
                        variant="outline"
                        className="bg-gray-50 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600"
                      >
                        {contact.availability}
                      </Badge>
                    </motion.div>
                  ))}
                </div>

                <Separator className="my-8" />

                {/* Additional Legal Information */}
                <div className="text-center space-y-6">
                  <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                    📋 Thông tin pháp lý bổ sung
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      {
                        title: "🏢 Đăng ký kinh doanh",
                        desc: "MST: 0123456789-001",
                        detail: "Sở KH&ĐT Quảng Ninh",
                      },
                      {
                        title: "⚖️ Luật sư đại diện",
                        desc: "Công ty Luật ABC & Partners",
                        detail: "Giấy phép số 123/2024/GP-BTP",
                      },
                      {
                        title: "🏛️ Cơ quan quản lý",
                        desc: "Bộ TT&TT Việt Nam",
                        detail: "Giấy phép MXH số 456/2024",
                      },
                    ].map((info, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        className="bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm rounded-xl p-4 shadow-md border border-gray-200/60 dark:border-gray-600/60"
                      >
                        <div className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                          {info.title}
                        </div>
                        <div className="text-emerald-600 dark:text-emerald-400 font-medium mb-1">
                          {info.desc}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
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
    </>
  );
};

export default Terms;
