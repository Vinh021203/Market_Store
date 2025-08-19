import React, { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  MessageSquare,
  Search,
  ThumbsUp,
  ThumbsDown,
  HelpCircle,
  Star,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  Mail,
  Phone,
  MessageCircle,
  Tag,
  Filter,
  BookOpen,
  CreditCard,
  Download,
  Settings,
  Shield,
  User,
  ShoppingCart,
  Zap,
  Award,
  TrendingUp,
  Eye,
  Heart,
  Share2,
  Bookmark,
  Copy,
  ExternalLink,
  Lightbulb,
  Rocket,
  Target,
  Globe,
  Database,
  Code,
  Palette,
  Smartphone,
  Monitor,
  Headphones,
  Coffee,
  Gift,
  ArrowUp,
  ChevronRight,
  ArrowRight,
  PlayCircle,
  FileText,
  Info,
  Bell,
  Calendar,
} from "lucide-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { toast } from "@/hooks/use-toast";

const FAQ: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [helpfulAnswers, setHelpfulAnswers] = useState<Set<string>>(new Set());
  const [bookmarkedFAQs, setBookmarkedFAQs] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState("popularity");
  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showFloatingNav, setShowFloatingNav] = useState(false);

  const { scrollYProgress } = useScroll();
  const headerY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  // ✅ Enhanced Color Schemes
  const colorSchemes = {
    primary: {
      gradient: "from-cyan-500 via-blue-500 to-indigo-500",
      bg: "from-cyan-50/80 to-blue-50/80",
      darkBg: "from-cyan-900/30 to-blue-900/30",
    },
    success: {
      gradient: "from-emerald-500 via-teal-500 to-cyan-500",
      bg: "from-emerald-50/80 to-cyan-50/80",
      darkBg: "from-emerald-900/30 to-cyan-900/30",
    },
    info: {
      gradient: "from-indigo-500 via-purple-500 to-blue-500",
      bg: "from-indigo-50/80 to-purple-50/80",
      darkBg: "from-indigo-900/30 to-purple-900/30",
    },
    warning: {
      gradient: "from-amber-500 via-orange-500 to-red-500",
      bg: "from-amber-50/80 to-orange-50/80",
      darkBg: "from-amber-900/30 to-orange-900/30",
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
      id: "all",
      label: "🎯 Tất cả",
      icon: BookOpen,
      count: 78,
      color: colorSchemes.primary.gradient,
      bgColor: colorSchemes.primary.bg,
      darkBg: colorSchemes.primary.darkBg,
    },
    {
      id: "account",
      label: "👤 Tài khoản",
      icon: User,
      count: 18,
      color: colorSchemes.info.gradient,
      bgColor: colorSchemes.info.bg,
      darkBg: colorSchemes.info.darkBg,
    },
    {
      id: "payment",
      label: "💳 Thanh toán",
      icon: CreditCard,
      count: 15,
      color: colorSchemes.success.gradient,
      bgColor: colorSchemes.success.bg,
      darkBg: colorSchemes.success.darkBg,
    },
    {
      id: "download",
      label: "📥 Tải xuống",
      icon: Download,
      count: 22,
      color: colorSchemes.warning.gradient,
      bgColor: colorSchemes.warning.bg,
      darkBg: colorSchemes.warning.darkBg,
    },
    {
      id: "technical",
      label: "⚙️ Kỹ thuật",
      icon: Settings,
      count: 12,
      color: colorSchemes.primary.gradient,
      bgColor: colorSchemes.primary.bg,
      darkBg: colorSchemes.primary.darkBg,
    },
    {
      id: "security",
      label: "🔒 Bảo mật",
      icon: Shield,
      count: 8,
      color: colorSchemes.info.gradient,
      bgColor: colorSchemes.info.bg,
      darkBg: colorSchemes.info.darkBg,
    },
  ];

  const faqs = [
    {
      id: "1",
      category: "account",
      question: "🚀 Làm thế nào để tạo tài khoản trên Template Market?",
      answer: `Để tạo tài khoản trên Template Market rất đơn giản và nhanh chóng:

**📝 Quy trình đăng ký:**
1. Click nút "Đăng ký" ở góc phải trang chủ
2. Nhập email và mật khẩu (tối thiểu 8 ký tự)
3. Xác nhận email qua link được gửi
4. Hoàn thiện profile với thông tin cá nhân

**🎁 Lợi ích khi đăng ký:**
• Miễn phí 100% và không giới hạn thời gian
• Truy cập 50+ templates miễn phí
• Theo dõi lịch sử mua hàng
• Nhận thông báo về sản phẩm mới
• Tích lũy điểm thưởng cho mỗi lần mua

**💡 Tips:** Sử dụng email thường xuyên check để không bỏ lỡ ưu đãi độc quyền!`,
      helpful: 456,
      views: 2380,
      tags: ["đăng ký", "tài khoản", "email", "miễn phí", "profile"],
      lastUpdated: "3 ngày trước",
      difficulty: "Dễ",
      readTime: "2 phút",
      category_label: "Tài khoản",
    },
    {
      id: "2",
      category: "payment",
      question: "💳 Template Market hỗ trợ những phương thức thanh toán nào?",
      answer: `Template Market hỗ trợ đa dạng phương thức thanh toán tiện lợi và an toàn:

**🏦 Ví điện tử (Khuyên dùng - Giảm 5%)**
• MoMo - Quét QR hoặc liên kết tài khoản
• ZaloPay - Thanh toán tức thì
• ShopeePay - Tích điểm kèm ưu đãi
• VNPay - Kết nối 40+ ngân hàng

**💎 Thẻ tín dụng/ghi nợ**
• Visa, Mastercard, JCB
• American Express
• Thẻ ATM nội địa (Napas)

**🌍 Thanh toán quốc tế**
• PayPal (sắp ra mắt)
• Stripe - Hỗ trợ 135+ loại tiền tệ
• Cryptocurrency (Bitcoin, Ethereum)

**🔐 Bảo mật tuyệt đối**
• Mã hóa SSL 256-bit
• Tuân thủ chuẩn PCI DSS Level 1
• Không lưu trữ thông tin thẻ
• Xác thực 2 lớp (2FA)`,
      helpful: 523,
      views: 3240,
      tags: [
        "thanh toán",
        "MoMo",
        "ZaloPay",
        "thẻ tín dụng",
        "bảo mật",
        "quốc tế",
      ],
      lastUpdated: "1 ngày trước",
      difficulty: "Dễ",
      readTime: "4 phút",
      category_label: "Thanh toán",
    },
    {
      id: "3",
      category: "download",
      question: "📥 Sau khi mua, tôi có thể tải sản phẩm bao nhiều lần?",
      answer: `Bạn có quyền tải xuống KHÔNG GIỚI HẠN số lần sau khi mua sản phẩm:

**♾️ Quyền lợi tải xuống:**
• Tải xuống không giới hạn suốt đời
• Truy cập từ bất kỳ thiết bị nào
• Lưu trữ cloud backup tự động
• Re-download khi cần thiết

**📦 File bạn sẽ nhận được:**
• Source code hoàn chỉnh (HTML, CSS, JS)
• Assets đầy đủ (hình ảnh, fonts, icons)
• Documentation chi tiết
• Video hướng dẫn setup (nếu có)
• PSD/Figma design files (premium)

**🔄 Cập nhật miễn phí:**
• Nhận updates tự động qua email
• Tương thích với phiên bản mới
• Bug fixes và improvements
• Thời hạn: 24 tháng kể từ ngày mua

**💾 Lưu ý quan trọng:**
• Backup file ngay sau khi tải
• Kiểm tra email spam folder
• Link download có hiệu lực 72h`,
      helpful: 687,
      views: 4120,
      tags: [
        "tải xuống",
        "không giới hạn",
        "cập nhật",
        "source code",
        "backup",
      ],
      lastUpdated: "2 ngày trước",
      difficulty: "Dễ",
      readTime: "3 phút",
      category_label: "Tải xuống",
    },
    {
      id: "4",
      category: "technical",
      question: "⚙️ Template có tương thích với framework mới nhất không?",
      answer: `Template Market cam kết tương thích 100% với các framework hiện đại:

**🚀 Framework được hỗ trợ:**
• React 18+ (với Hooks, Context API)
• Vue.js 3+ (Composition API)
• Angular 15+ (Standalone Components)
• Next.js 13+ (App Router)
• Svelte/SvelteKit
• Nuxt.js 3+

**📱 Responsive Framework:**
• Bootstrap 5.3+
• Tailwind CSS 3.3+
• Material UI v5
• Ant Design 5+
• Chakra UI
• Custom CSS Grid/Flexbox

**🛠️ Build Tools:**
• Vite (Lightning fast)
• Webpack 5
• Parcel 2
• Rollup
• ESBuild

**🔄 Chính sách cập nhật:**
• Update framework mới trong 30 ngày
• Backward compatibility 2 phiên bản
• Migration guides chi tiết
• Free updates trong 2 năm
• Priority support cho enterprise

**💡 Performance tối ưu:**
• Code splitting tự động
• Lazy loading components
• Tree shaking để giảm bundle size
• PWA ready với offline support`,
      helpful: 423,
      views: 2890,
      tags: ["framework", "React", "Vue", "Angular", "tương thích", "cập nhật"],
      lastUpdated: "5 ngày trước",
      difficulty: "Trung bình",
      readTime: "6 phút",
      category_label: "Kỹ thuật",
    },
    {
      id: "5",
      category: "security",
      question: "🔐 Thông tin cá nhân của tôi có được bảo mật tuyệt đối không?",
      answer: `Template Market cam kết bảo vệ thông tin cá nhân với các tiêu chuẩn bảo mật hàng đầu thế giới:

**🛡️ Công nghệ mã hóa:**
• SSL/TLS 1.3 - Mã hóa 256-bit
• End-to-end encryption cho dữ liệu nhạy cảm
• AES-256 cho database encryption
• RSA-4096 cho key exchange

**🏆 Chứng nhận bảo mật:**
• ISO 27001:2013 Information Security
• SOC 2 Type II Compliance
• PCI DSS Level 1 (cao nhất)
• GDPR & CCPA Compliant

**👥 Kiểm soát truy cập:**
• Multi-factor authentication (MFA)
• Role-based access control
• Zero-trust architecture
• Regular security auditing

**🌐 Cơ sở hạ tầng:**
• AWS/Google Cloud với 99.9% uptime
• Data centers tier-3 certified
• DDoS protection & WAF
• Real-time monitoring 24/7

**📋 Chính sách bảo mật:**
• Không bao giờ bán dữ liệu cho bên thứ 3
• Right to be forgotten (GDPR)
• Data portability & transparency
• Annual security reports công khai

**🚨 Incident response:**
• Phát hiện tấn công trong < 15 phút
• Thông báo vi phạm trong 72h
• Cyber insurance $10M coverage`,
      helpful: 356,
      views: 1920,
      tags: ["bảo mật", "SSL", "encryption", "GDPR", "privacy", "ISO"],
      lastUpdated: "1 tuần trước",
      difficulty: "Trung bình",
      readTime: "5 phút",
      category_label: "Bảo mật",
    },
    {
      id: "6",
      category: "account",
      question: "🔑 Quên mật khẩu thì phải làm sao để lấy lại?",
      answer: `Đừng lo lắng! Quá trình lấy lại mật khẩu rất đơn giản và an toàn:

**🔄 Các bước reset mật khẩu:**
1. Truy cập trang đăng nhập
2. Click "Quên mật khẩu?"
3. Nhập email đã đăng ký
4. Check email reset (có thể trong spam)
5. Click link reset trong vòng 15 phút
6. Tạo mật khẩu mới (8+ ký tự)
7. Đăng nhập với mật khẩu mới

**📧 Nếu không nhận được email:**
• Kiểm tra thư mục spam/junk
• Đảm bảo email đúng định dạng
• Thử lại sau 5 phút
• Liên hệ support qua chat

**🔐 Mật khẩu mạnh nên có:**
• Ít nhất 8 ký tự
• Chữ hoa, chữ thường
• Số và ký tự đặc biệt
• Không trùng với mật khẩu cũ
• Không chứa thông tin cá nhân

**⚡ Tính năng nâng cao:**
• 2FA với Google Authenticator
• Biometric login (Touch ID, Face ID)
• Social login (Google, Facebook)
• Password manager integration`,
      helpful: 289,
      views: 1560,
      tags: ["quên mật khẩu", "reset", "email", "bảo mật", "2FA"],
      lastUpdated: "4 ngày trước",
      difficulty: "Dễ",
      readTime: "3 phút",
      category_label: "Tài khoản",
    },
    {
      id: "7",
      category: "payment",
      question: "🔄 Chính sách hoàn tiền có thực sự 'không điều kiện' không?",
      answer: `Template Market có chính sách hoàn tiền minh bạch và công bằng nhất thị trường:

**✅ Hoàn tiền 100% trong 30 ngày nếu:**
• Sản phẩm không hoạt động như mô tả
• Có lỗi kỹ thuật không thể khắc phục
• Không tương thích với hệ thống của bạn
• Chất lượng không như kỳ vọng

**🚫 Không hoàn tiền khi:**
• Đã sử dụng trong dự án thương mại
• Tải xuống đầy đủ file > 7 ngày
• Thay đổi yêu cầu sau khi mua
• Vi phạm điều khoản sử dụng

**⏰ Quy trình hoàn tiền:**
1. Gửi yêu cầu qua email/chat (24/7)
2. Cung cấp mã đơn hàng & lý do
3. Team review trong 12-24h
4. Phê duyệt và xử lý hoàn tiền
5. Nhận tiền: 3-7 ngày (tùy phương thức)

**💰 Các trường hợp đặc biệt:**
• Hoàn tiền một phần nếu chỉ một số file lỗi
• Đổi sản phẩm khác cùng giá trị
• Credit store để mua sản phẩm khác
• Extend support cho khách VIP

**📊 Thống kê minh bạch:**
• Tỷ lệ hoàn tiền: < 2%
• Thời gian xử lý trung bình: 1.5 ngày
• 98.5% khách hàng hài lòng với quy trình`,
      helpful: 634,
      views: 3850,
      tags: ["hoàn tiền", "30 ngày", "chính sách", "quy trình", "điều kiện"],
      lastUpdated: "6 ngày trước",
      difficulty: "Dễ",
      readTime: "4 phút",
      category_label: "Thanh toán",
    },
    {
      id: "8",
      category: "download",
      question:
        "📁 File download có chứa mã nguồn hoàn chỉnh không bị che giấu?",
      answer: `Tất cả sản phẩm của Template Market đều cung cấp mã nguồn HOÀN TOÀN MINH BẠCH:

**💯 Những gì bạn nhận được:**
• Source code đầy đủ, không minify
• Comment chi tiết cho từng function
• Clean code theo best practices
• Cấu trúc thư mục rõ ràng
• Variables và classes có tên có nghĩa

**📦 Cấu trúc package hoàn chỉnh:**
\`\`\`
📁 template-name/
├── 📁 src/
│   ├── 📁 components/
│   ├── 📁 pages/
│   ├── 📁 assets/
│   └── 📁 utils/
├── 📁 public/
├── 📄 README.md
├── 📄 CHANGELOG.md
├── 📄 package.json
└── 📄 LICENSE
\`\`\`

**📚 Documentation đi kèm:**
• Setup guide từng bước
• API documentation
• Component usage examples  
• Customization tutorials
• Deployment instructions

**🛠️ Developer-friendly features:**
• ESLint/Prettier configs
• TypeScript definitions
• Unit test examples
• Storybook components (premium)
• VSCode extensions list

**🔍 Code quality assurance:**
• Linter qua SonarQube
• Security vulnerability scan
• Performance optimization
• Cross-browser testing
• Mobile responsive validation

**💡 Bonus materials:**
• PSD/Figma design files
• Icon sets & illustrations
• Font licenses included
• Color palette & style guide`,
      helpful: 512,
      views: 2740,
      tags: [
        "mã nguồn",
        "source code",
        "documentation",
        "clean code",
        "typescript",
      ],
      lastUpdated: "1 ngày trước",
      difficulty: "Trung bình",
      readTime: "5 phút",
      category_label: "Tải xuống",
    },
  ];

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    const matchesCategory =
      selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // ✅ Sort FAQs
  const sortedFAQs = [...filteredFAQs].sort((a, b) => {
    switch (sortBy) {
      case "popularity":
        return b.helpful - a.helpful;
      case "views":
        return b.views - a.views;
      case "recent":
        return (
          new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
        );
      default:
        return 0;
    }
  });

  const handleHelpful = useCallback((faqId: string) => {
    setHelpfulAnswers((prev) => new Set([...prev, faqId]));
    toast({
      title: "🙏 Cảm ơn phản hồi của bạn!",
      description:
        "Chúng tôi sẽ tiếp tục cải thiện nội dung để phục vụ bạn tốt hơn.",
    });
  }, []);

  const handleBookmark = useCallback((faqId: string) => {
    setBookmarkedFAQs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(faqId)) {
        newSet.delete(faqId);
        toast({
          title: "📖 Đã bỏ lưu FAQ",
          description: "FAQ này đã được xóa khỏi danh sách lưu của bạn.",
        });
      } else {
        newSet.add(faqId);
        toast({
          title: "⭐ Đã lưu FAQ thành công!",
          description: "Bạn có thể xem lại FAQ này trong phần đã lưu.",
        });
      }
      return newSet;
    });
  }, []);

  const contactOptions = [
    {
      icon: MessageCircle,
      title: "💬 Live Chat AI",
      description: "Chat với AI Bot & Human Expert",
      detail: "Phản hồi < 30 giây • 24/7 • 98.5% satisfaction",
      action: "Bắt đầu chat",
      color: colorSchemes.success.gradient,
      stats: "15K+ chats/tháng",
    },
    {
      icon: Mail,
      title: "📧 Email Premium",
      description: "support@templatemarket.vn",
      detail: "Phản hồi < 1 giờ • Attachment 50MB • Priority",
      action: "Gửi email",
      color: colorSchemes.primary.gradient,
      stats: "99.2% resolve rate",
    },
    {
      icon: Phone,
      title: "📞 Hotline VIP",
      description: "+84 971 386 588",
      detail: "Tư vấn trực tiếp • 6AM-11PM • Vietnamese/English",
      action: "Gọi ngay",
      color: colorSchemes.info.gradient,
      stats: "4.9⭐ rating",
    },
    {
      icon: Headphones,
      title: "🎧 Video Call",
      description: "Screen sharing & live support",
      detail: "Đặt lịch hẹn • 30 phút/session • Premium only",
      action: "Đặt lịch",
      color: colorSchemes.warning.gradient,
      stats: "100% resolution",
    },
  ];

  const quickStats = [
    {
      icon: HelpCircle,
      value: "78+",
      label: "Câu hỏi",
      color: "text-cyan-600",
      bg: "bg-cyan-100",
    },
    {
      icon: Users,
      value: "45K+",
      label: "Lượt xem",
      color: "text-emerald-600",
      bg: "bg-emerald-100",
    },
    {
      icon: ThumbsUp,
      value: "98.5%",
      label: "Hữu ích",
      color: "text-indigo-600",
      bg: "bg-indigo-100",
    },
    {
      icon: Clock,
      value: "< 24h",
      label: "Cập nhật",
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      icon: Award,
      value: "5.0⭐",
      label: "Đánh giá",
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      icon: Target,
      value: "99.2%",
      label: "Giải quyết",
      color: "text-teal-600",
      bg: "bg-teal-100",
    },
  ];

  const trendingTopics = [
    "🚀 Setup & Installation",
    "💳 Payment Issues",
    "🔄 Refund Policy",
    "📱 Mobile Responsive",
    "⚡ Performance",
    "🔐 Security",
  ];

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

  const handleContactAction = (action: string) => {
    toast({
      title: "🚀 Đang kết nối...",
      description: `Bạn sẽ được chuyển đến ${action} trong giây lát.`,
    });
  };

  return (
    <>
      <Helmet>
        <title>❓ FAQ - Câu hỏi thường gặp | Template Market</title>
        <meta
          name="description"
          content="Tổng hợp 78+ câu hỏi thường gặp về Template Market. Tìm hiểu về tài khoản, thanh toán, tải xuống, kỹ thuật và bảo mật với câu trả lời chi tiết."
        />
        <meta
          name="keywords"
          content="FAQ, câu hỏi thường gặp, hỗ trợ, template market, hướng dẫn"
        />
        <link rel="canonical" href="https://templatemarket.vn/faq" />
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
                <MessageSquare className="w-14 h-14 text-white" />
              </motion.div>

              {/* Title */}
              <h1 className="mb-8 text-5xl lg:text-7xl font-bold leading-tight">
                <span className="text-transparent bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text">
                  Câu hỏi thường gặp
                </span>
                <br />
                <span className="text-2xl lg:text-3xl font-medium text-gray-700 dark:text-gray-300">
                  Tìm câu trả lời tức thì
                </span>
              </h1>

              {/* Subtitle */}
              <p className="mb-12 text-xl lg:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-4xl mx-auto">
                Khám phá
                <span className="text-transparent bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text font-semibold">
                  {" "}
                  78+ câu hỏi được hỏi nhiều nhất{" "}
                </span>
                với
                <span className="text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text font-semibold">
                  {" "}
                  câu trả lời chi tiết và cập nhật{" "}
                </span>
              </p>

              {/* ✅ Enhanced Search & Filter */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="max-w-4xl mx-auto space-y-6 mb-12"
              >
                {/* Search Bar */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-2xl blur-lg opacity-20 animate-pulse"></div>
                  <div className="relative">
                    <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-500 z-10" />
                    <Input
                      placeholder="🔍 Tìm kiếm câu hỏi, từ khóa, chủ đề..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-16 pr-20 py-6 text-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-0 shadow-xl rounded-2xl focus:ring-4 focus:ring-cyan-200 dark:focus:ring-cyan-800 transition-all duration-300 text-gray-800 dark:text-gray-200"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-white/70 dark:bg-gray-700/70"
                      >
                        <Filter className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-cyan-500 to-indigo-600 text-white border-0"
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        AI
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-3 justify-center">
                  {categories.map((category) => (
                    <motion.div
                      key={category.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant={
                          selectedCategory === category.id
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => setSelectedCategory(category.id)}
                        className={`transition-all duration-300 ${
                          selectedCategory === category.id
                            ? `bg-gradient-to-r ${category.color} text-white shadow-lg border-0`
                            : "bg-white/70 dark:bg-gray-800/70 hover:bg-white/90 dark:hover:bg-gray-700/90"
                        }`}
                      >
                        <category.icon className="w-4 h-4 mr-2" />
                        {category.label}
                        <Badge
                          variant="secondary"
                          className="ml-2 bg-white/30 dark:bg-gray-600/30 text-xs"
                        >
                          {category.count}
                        </Badge>
                      </Button>
                    </motion.div>
                  ))}
                </div>

                {/* Sort Options */}
                <div className="flex justify-center gap-2">
                  {[
                    {
                      id: "popularity",
                      label: "🔥 Phổ biến",
                      icon: TrendingUp,
                    },
                    { id: "views", label: "👀 Lượt xem", icon: Eye },
                    { id: "recent", label: "⏰ Mới nhất", icon: Clock },
                  ].map((sort) => (
                    <Button
                      key={sort.id}
                      variant={sortBy === sort.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSortBy(sort.id)}
                      className={
                        sortBy === sort.id
                          ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white border-0"
                          : "bg-white/70 dark:bg-gray-800/70"
                      }
                    >
                      <sort.icon className="w-3 h-3 mr-1" />
                      {sort.label}
                    </Button>
                  ))}
                </div>
              </motion.div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
                {quickStats.map((stat, index) => (
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
          {/* ✅ Trending Topics */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                🔥 Chủ đề HOT
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Những câu hỏi được tìm kiếm nhiều nhất tuần này
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {trendingTopics.map((topic, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Badge
                    variant="outline"
                    className="px-4 py-2 text-sm bg-white/70 dark:bg-gray-800/70 hover:bg-white/90 dark:hover:bg-gray-700/90 cursor-pointer border-cyan-200 dark:border-cyan-800 text-gray-700 dark:text-gray-300"
                  >
                    {topic}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* ✅ Enhanced FAQ Content */}
          <section className="mb-20">
            <div className="max-w-5xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                  📚 {filteredFAQs.length} câu trả lời cho bạn
                </h2>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Cập nhật liên tục • Độ chính xác 99.8%
                </div>
              </div>

              {filteredFAQs.length > 0 ? (
                <Accordion type="single" collapsible className="space-y-6">
                  {sortedFAQs.map((faq, index) => (
                    <motion.div
                      key={faq.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <AccordionItem value={faq.id} className="border-0">
                        <Card className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
                          <AccordionTrigger className="px-8 py-6 hover:no-underline">
                            <div className="flex items-start text-left w-full gap-6">
                              <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl shadow-lg flex items-center justify-center"
                              >
                                <HelpCircle className="w-6 h-6 text-white" />
                              </motion.div>
                              <div className="flex-1">
                                <h3 className="text-xl font-bold mb-3 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors leading-tight text-gray-800 dark:text-gray-100">
                                  {faq.question}
                                </h3>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                  <Badge
                                    variant="outline"
                                    className="bg-cyan-50 dark:bg-cyan-900/20 border-cyan-200 dark:border-cyan-800 text-cyan-700 dark:text-cyan-300"
                                  >
                                    📂 {faq.category_label}
                                  </Badge>
                                  <Badge
                                    variant="outline"
                                    className={`${getDifficultyColor(faq.difficulty)} border-0`}
                                  >
                                    📊 {faq.difficulty}
                                  </Badge>
                                  <div className="flex items-center gap-1">
                                    <Users className="w-3 h-3" />
                                    <span className="font-medium">
                                      {faq.views.toLocaleString()}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <ThumbsUp className="w-3 h-3 text-emerald-500" />
                                    <span className="font-medium">
                                      {faq.helpful}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>⏱️ {faq.readTime}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Eye className="w-3 h-3" />
                                    <span>{faq.lastUpdated}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-8 pb-8">
                            <div className="space-y-6">
                              {/* Content */}
                              <div className="prose prose-lg max-w-none">
                                <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                                  {faq.answer}
                                </div>
                              </div>

                              {/* Tags */}
                              <div className="flex flex-wrap gap-2">
                                {faq.tags.map((tag, tagIndex) => (
                                  <Badge
                                    key={tagIndex}
                                    variant="secondary"
                                    className="text-xs bg-gradient-to-r from-gray-100 to-cyan-50 dark:from-gray-700 dark:to-cyan-900/20 hover:from-cyan-100 hover:to-blue-50 dark:hover:from-cyan-900/30 dark:hover:to-blue-900/30 cursor-pointer text-gray-700 dark:text-gray-300"
                                  >
                                    <Tag className="w-3 h-3 mr-1" />
                                    {tag}
                                  </Badge>
                                ))}
                              </div>

                              {/* Actions */}
                              <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  💡 Câu trả lời này có hữu ích không?
                                </div>
                                <div className="flex items-center gap-3">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleHelpful(faq.id)}
                                    disabled={helpfulAnswers.has(faq.id)}
                                    className={`transition-all duration-300 ${
                                      helpfulAnswers.has(faq.id)
                                        ? "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800"
                                        : "hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                                    }`}
                                  >
                                    <ThumbsUp className="w-4 h-4 mr-1" />
                                    {helpfulAnswers.has(faq.id)
                                      ? "✅ Hữu ích"
                                      : "👍 Hữu ích"}
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="hover:bg-red-50 dark:hover:bg-red-900/20"
                                  >
                                    <ThumbsDown className="w-4 h-4 mr-1" />
                                    Không hữu ích
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleBookmark(faq.id)}
                                    className={`${
                                      bookmarkedFAQs.has(faq.id)
                                        ? "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800"
                                        : "hover:bg-amber-50 dark:hover:bg-amber-900/20"
                                    }`}
                                  >
                                    <Bookmark
                                      className={`w-4 h-4 mr-1 ${bookmarkedFAQs.has(faq.id) ? "fill-current" : ""}`}
                                    />
                                    {bookmarkedFAQs.has(faq.id)
                                      ? "Đã lưu"
                                      : "Lưu"}
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                  >
                                    <Share2 className="w-4 h-4 mr-1" />
                                    Chia sẻ
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </AccordionContent>
                        </Card>
                      </AccordionItem>
                    </motion.div>
                  ))}
                </Accordion>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16"
                >
                  <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full">
                    <AlertCircle className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                    🔍 Không tìm thấy kết quả phù hợp
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
                    Thử điều chỉnh từ khóa tìm kiếm hoặc chọn danh mục khác
                  </p>
                  <div className="space-y-4">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedCategory("all");
                      }}
                      className="mr-4"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Xem tất cả câu hỏi
                    </Button>
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-0"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Đặt câu hỏi mới
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </section>

          {/* ✅ Enhanced Contact Support */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                🤝 Vẫn cần hỗ trợ thêm?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Không tìm thấy câu trả lời? Đội ngũ chuyên gia của chúng tôi
                luôn sẵn sàng hỗ trợ với nhiều kênh liên lạc tiện lợi.
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
                  whileHover={{ y: -10, scale: 1.02 }}
                >
                  <Card className="group h-full transition-all duration-500 hover:shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 overflow-hidden">
                    <div className={`h-2 bg-gradient-to-r ${option.color}`} />
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
                      <p className="mb-4 text-gray-600 dark:text-gray-400 font-medium">
                        {option.description}
                      </p>
                      <p className="mb-6 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {option.detail}
                      </p>

                      <Badge
                        variant="secondary"
                        className="mb-6 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      >
                        📊 {option.stats}
                      </Badge>

                      <Button
                        className={`w-full bg-gradient-to-r ${option.color} hover:shadow-lg transition-all duration-300 text-white border-0`}
                        onClick={() => handleContactAction(option.action)}
                      >
                        {option.action}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* ✅ Additional Support Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16"
            >
              <Card className="bg-gradient-to-br from-cyan-50/90 via-blue-50/90 to-indigo-50/90 dark:from-cyan-900/20 dark:via-blue-900/20 dark:to-indigo-900/20 border-0 shadow-xl">
                <CardContent className="p-10 text-center">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full shadow-xl">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="mb-4 text-2xl font-bold text-gray-800 dark:text-gray-100">
                    ✨ Cam kết chất lượng hỗ trợ
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
                    Template Market tự hào với dịch vụ hỗ trợ khách hàng hàng
                    đầu với các chỉ số ấn tượng
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                      {
                        label: "Thời gian phản hồi",
                        value: "< 30 phút",
                        icon: Clock,
                      },
                      {
                        label: "Tỷ lệ giải quyết",
                        value: "99.2%",
                        icon: CheckCircle,
                      },
                      { label: "Độ hài lòng", value: "4.9/5 ⭐", icon: Heart },
                      { label: "Hỗ trợ 24/7", value: "365 ngày", icon: Globe },
                    ].map((metric, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-4 shadow-md"
                      >
                        <metric.icon className="w-8 h-8 mx-auto mb-2 text-cyan-600" />
                        <div className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-1">
                          {metric.value}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {metric.label}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.section>
        </div>
      </div>
    </>
  );
};

export default FAQ;
