import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Send,
  CheckCircle,
  Sparkles,
  Globe,
  Users,
  Zap,
  Heart,
  Star,
  ArrowRight,
  Building,
  Headphones,
  Shield,
  Award,
  MessageSquare,
  Calendar,
  ChevronDown,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Github,
  ArrowUp,
  Navigation,
  TrendingUp,
  Activity,
  ExternalLink,
  Copy,
  AlertCircle,
  Target,
  Rocket,
  Crown,
  Gift,
  Wifi,
  MonitorSmartphone,
  Code,
  Palette,
  Package,
  Settings,
} from "lucide-react";
import { createContact } from "@/lib/contacts";

const softPinkTheme = {
  // Background Gradients
  pageBackground: "from-pink-50/70 via-rose-50/60 to-red-50/50",
  sectionBackground: "from-white/95 via-pink-25/30 to-rose-25/20",

  // Card Backgrounds
  glassCard: "from-white/95 via-pink-25/20 to-rose-25/10 backdrop-blur-xl",
  neoCard: "bg-gradient-to-br from-white via-pink-25/30 to-rose-25/20",
  floatingCard: "from-white/90 via-pink-50/60 to-rose-50/40",

  // Gradient Colors
  primaryGradient: "from-pink-300 via-rose-300 to-red-300",
  secondaryGradient: "from-rose-300 via-red-300 to-pink-300",
  accentGradient: "from-red-300 via-pink-300 to-rose-300",
  successGradient: "from-pink-400 via-rose-300 to-pink-300",

  // Text Colors
  heroText: "from-pink-400 via-rose-400 to-red-400",
  primaryText: "from-slate-700 via-pink-700 to-rose-700",
  accentText: "from-rose-600 via-pink-600 to-red-600",

  // Effects
  glow: "shadow-pink-200/60 shadow-2xl",
  neonGlow: "shadow-rose-300/50 shadow-xl",
  softGlow: "shadow-pink-200/40 shadow-lg",

  // Icon Background - Giống Pricing
  iconBg: "from-pink-25 to-rose-50",
  iconText: "text-pink-400",
};

const decorativeIcons = [
  {
    Icon: MessageCircle,
    color: "from-pink-50 to-rose-100",
    position: "top-10 right-20",
    size: "text-6xl",
  },
  {
    Icon: Mail,
    color: "from-rose-50 to-red-100",
    position: "top-32 left-10",
    size: "text-5xl",
  },
  {
    Icon: Phone,
    color: "from-red-50 to-pink-100",
    position: "bottom-20 right-10",
    size: "text-7xl",
  },
  {
    Icon: Heart,
    color: "from-pink-100 to-rose-50",
    position: "bottom-32 left-20",
    size: "text-6xl",
  },
  {
    Icon: Star,
    color: "from-rose-100 to-pink-50",
    position: "top-1/2 right-1/4",
    size: "text-5xl",
  },
  {
    Icon: Globe,
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
    Icon: Zap,
    color: "from-rose-50 to-pink-100",
    position: "top-2/3 left-1/4",
    size: "text-6xl",
  },
  {
    Icon: Sparkles,
    color: "from-red-100 to-rose-50",
    position: "top-1/4 right-1/2",
    size: "text-4xl",
  },
  {
    Icon: Shield,
    color: "from-pink-100 to-red-50",
    position: "bottom-1/4 left-1/2",
    size: "text-5xl",
  },
  {
    Icon: Award,
    color: "from-rose-100 to-red-50",
    position: "top-3/4 right-20",
    size: "text-6xl",
  },
  {
    Icon: Target,
    color: "from-pink-50 to-rose-100",
    position: "bottom-40 left-10",
    size: "text-5xl",
  },
  {
    Icon: Rocket,
    color: "from-red-50 to-pink-50",
    position: "top-40 right-40",
    size: "text-6xl",
  },
  {
    Icon: Crown,
    color: "from-rose-50 to-red-50",
    position: "bottom-1/2 right-10",
    size: "text-5xl",
  },
  {
    Icon: Gift,
    color: "from-pink-100 to-rose-100",
    position: "top-1/2 left-10",
    size: "text-6xl",
  },
  {
    Icon: MonitorSmartphone,
    color: "from-red-100 to-pink-100",
    position: "bottom-1/4 right-1/4",
    size: "text-5xl",
  },
];

const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Tên phải có ít nhất 2 ký tự")
    .max(50, "Tên không được vượt quá 50 ký tự")
    .regex(/^[a-zA-ZÀ-ỹ\s]+$/, "Tên chỉ được chứa chữ cái và khoảng trắng"),
  email: z.string().email("Email không hợp lệ").toLowerCase(),
  phone: z
    .string()
    .regex(/^[\d\s\-\+\(\)]{10,15}$/, "Số điện thoại không hợp lệ")
    .optional()
    .or(z.literal("")),
  company: z
    .string()
    .max(100, "Tên công ty không được vượt quá 100 ký tự")
    .optional(),
  subject: z
    .string()
    .min(5, "Tiêu đề phải có ít nhất 5 ký tự")
    .max(100, "Tiêu đề không được vượt quá 100 ký tự"),
  category: z.enum([
    "support",
    "sales",
    "partnership",
    "feedback",
    "technical",
    "other",
  ]),
  message: z
    .string()
    .min(20, "Tin nhắn phải có ít nhất 20 ký tự")
    .max(2000, "Tin nhắn không được vượt quá 2000 ký tự"),
  newsletter: z.boolean().default(false),
  terms: z.boolean().refine((val) => val === true, {
    message: "Bạn phải đồng ý với điều khoản sử dụng",
  }),
});

type ContactData = z.infer<typeof contactSchema>;

const socialPlatforms = [
  {
    icon: Facebook,
    href: "https://facebook.com/templatemarket",
    label: "Facebook",
    gradient: "from-blue-500 to-blue-600",
  },
  {
    icon: Twitter,
    href: "https://twitter.com/templatemarket",
    label: "Twitter",
    gradient: "from-sky-500 to-sky-600",
  },
  {
    icon: Instagram,
    href: "https://instagram.com/templatemarket",
    label: "Instagram",
    gradient: softPinkTheme.primaryGradient,
  },
  {
    icon: Linkedin,
    href: "https://linkedin.com/company/templatemarket",
    label: "LinkedIn",
    gradient: "from-blue-600 to-blue-700",
  },
  {
    icon: Youtube,
    href: "https://youtube.com/@templatemarket",
    label: "YouTube",
    gradient: "from-red-500 to-red-600",
  },
  {
    icon: Github,
    href: "https://github.com/templatemarket",
    label: "GitHub",
    gradient: "from-gray-700 to-gray-900",
  },
];

const contactChannels = [
  {
    id: "office",
    icon: MapPin,
    title: "Địa chỉ văn phòng",
    content: "Hà Tu, Hạ Long, Quảng Ninh",
    subContent: "Việt Nam 70000",
    details: "Tầng 12, Tòa nhà Template Tower",
    hours: "8:00 - 18:00 (T2-T6)",
    color: softPinkTheme.primaryGradient,
    action: "Xem bản đồ",
    actionIcon: Navigation,
    onClick: () => {
      const url = `https://www.google.com/maps?q=20.9101,107.1839`;
      window.open(url, "_blank");
    },
  },
  {
    id: "phone",
    icon: Phone,
    title: "Hotline hỗ trợ",
    content: "+84 971 386 588",
    subContent: "24/7 Support Available",
    details: "Hỗ trợ bằng 5 ngôn ngữ",
    hours: "Luôn sẵn sàng",
    color: softPinkTheme.secondaryGradient,
    action: "Gọi ngay",
    actionIcon: Phone,
    onClick: () => window.open("tel:+84971386588", "_self"),
  },
  {
    id: "email",
    icon: Mail,
    title: "Email liên hệ",
    content: "support@templatemarket.com",
    subContent: "Response within 2 hours",
    details: "Phản hồi ưu tiên cho khách VIP",
    hours: "24/7 Monitoring",
    color: softPinkTheme.accentGradient,
    action: "Gửi email",
    actionIcon: Send,
    onClick: () => window.open("mailto:support@templatemarket.com"),
  },
  {
    id: "chat",
    icon: MessageCircle,
    title: "Live Chat",
    content: "Chat trực tuyến",
    subContent: "Average response: 30 seconds",
    details: "AI + Human support",
    hours: "24/7 Online",
    color: softPinkTheme.successGradient,
    action: "Bắt đầu chat",
    actionIcon: MessageSquare,
    onClick: () => {
      console.log("Opening chat widget...");
      alert("Chat widget đang được kích hoạt...");
    },
  },
];

const companyStats = [
  {
    icon: Users,
    value: "50K+",
    label: "Happy Customers",
    trend: "+15%",
    color: "text-pink-600",
  },
  {
    icon: Globe,
    value: "120+",
    label: "Countries",
    trend: "+8%",
    color: "text-rose-600",
  },
  {
    icon: Star,
    value: "4.9/5",
    label: "Rating",
    trend: "+0.2",
    color: "text-red-600",
  },
  {
    icon: Zap,
    value: "< 30s",
    label: "Response",
    trend: "-5s",
    color: "text-pink-700",
  },
  {
    icon: Shield,
    value: "99.9%",
    label: "Uptime",
    trend: "+0.1%",
    color: "text-rose-700",
  },
  {
    icon: Heart,
    value: "98%",
    label: "Satisfaction",
    trend: "+2%",
    color: "text-red-700",
  },
];

const supportCategories = [
  {
    value: "support",
    label: "Hỗ trợ kỹ thuật",
    icon: Headphones,
    description: "Giải quyết vấn đề kỹ thuật, bug, lỗi hệ thống",
    response: "< 1h",
  },
  {
    value: "sales",
    label: "Tư vấn bán hàng",
    icon: Users,
    description: "Tư vấn sản phẩm, báo giá, demo",
    response: "< 30m",
  },
  {
    value: "partnership",
    label: "Hợp tác kinh doanh",
    icon: Building,
    description: "Đối tác, affiliate, reseller",
    response: "< 2h",
  },
  {
    value: "feedback",
    label: "Góp ý & Phản hồi",
    icon: MessageSquare,
    description: "Ý kiến cải thiện, khiếu nại",
    response: "< 4h",
  },
  {
    value: "technical",
    label: "Kỹ thuật nâng cao",
    icon: Activity,
    description: "Hỗ trợ tích hợp, API, custom",
    response: "< 2h",
  },
  {
    value: "other",
    label: "Khác",
    icon: AlertCircle,
    description: "Các vấn đề khác chưa được phân loại",
    response: "< 2h",
  },
];

const faqCategories = [
  {
    title: "Thanh toán & Pricing",
    icon: Gift,
    questions: [
      {
        q: "Các phương thức thanh toán nào được hỗ trợ?",
        a: "Chúng tôi hỗ trợ thẻ tín dụng (Visa/Mastercard), PayPal, chuyển khoản ngân hàng, và ví điện tử như MoMo, ZaloPay. Tất cả giao dịch đều được mã hóa SSL 256-bit.",
      },
      {
        q: "Có chính sách hoàn tiền không?",
        a: "Có, chúng tôi có chính sách hoàn tiền 100% trong vòng 30 ngày nếu sản phẩm không như mô tả hoặc có lỗi kỹ thuật.",
      },
    ],
  },
  {
    title: "Hỗ trợ kỹ thuật",
    icon: Settings,
    questions: [
      {
        q: "Có hỗ trợ customization không?",
        a: "Có, chúng tôi cung cấp dịch vụ customization với chi phí từ $50-500 tùy độ phức tạp. Timeline từ 1-5 ngày.",
      },
      {
        q: "Templates có responsive không?",
        a: "100% templates của chúng tôi đều responsive, tối ưu cho mobile, tablet và desktop. Tested trên tất cả browsers phổ biến.",
      },
    ],
  },
];

const ScrollToTopButton: React.FC<{ show: boolean }> = ({ show }) => (
  <AnimatePresence>
    {show && (
      <motion.button
        initial={{ opacity: 0, scale: 0, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0, y: 20 }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full shadow-lg bg-gradient-to-r ${softPinkTheme.primaryGradient} hover:scale-110 text-white transition-all flex items-center justify-center`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowUp className="w-6 h-6" />
      </motion.button>
    )}
  </AnimatePresence>
);

const Contact: React.FC = () => {
  // States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [messageLength, setMessageLength] = useState(0);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  // Scroll animations
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.8]);

  // Form handling
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ContactData>({
    resolver: zodResolver(contactSchema),
    mode: "onChange",
    defaultValues: {
      newsletter: false,
      terms: false,
    },
  });

  const watchedMessage = watch("message", "");

  // Effects
  useEffect(() => {
    setMessageLength(watchedMessage?.length || 0);
  }, [watchedMessage]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.pageYOffset > 500);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const onSubmit = useCallback(
    async (data: ContactData) => {
      setIsSubmitting(true);

      try {
        // ✅ GỌI API THẬT
        await createContact({
          name: data.name,
          email: data.email,
          phone: data.phone || undefined,
          company: data.company || undefined,
          subject: data.subject,
          category: data.category,
          message: data.message,
        });

        console.log("✅ Contact submitted successfully!");

        setIsSubmitted(true);
        reset();

        setTimeout(() => setIsSubmitted(false), 8000);
      } catch (error) {
        console.error("❌ Error submitting contact:", error);
        alert("Lỗi gửi tin nhắn. Vui lòng thử lại sau!");
      } finally {
        setIsSubmitting(false);
      }
    },
    [reset],
  );

  // Copy to clipboard
  const copyToClipboard = useCallback(async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert(`Đã sao chép ${label}!`);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  }, []);

  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>
          Liên Hệ - Template Market | Hỗ Trợ 24/7 | 50K+ Khách Hàng Tin Tưởng
        </title>
        <meta
          name="description"
          content="Liên hệ Template Market: Hỗ trợ 24/7, Hotline: +84 971 386 588, Email: support@templatemarket.com, 50K+ khách hàng, Phản hồi trong 30 giây, 120+ quốc gia"
        />
        <meta
          name="keywords"
          content="liên hệ template market, contact support vietnam, hỗ trợ 24/7, customer service vietnam, template support, react template help"
        />
        <link rel="canonical" href="https://templatemarket.com/contact" />

        {/* Open Graph */}
        <meta
          property="og:title"
          content="Liên Hệ Template Market | Hỗ Trợ 24/7"
        />
        <meta
          property="og:description"
          content="50K+ khách hàng, Hỗ trợ 24/7, Phản hồi < 30 giây, 120+ quốc gia"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://templatemarket.com/contact" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: "Template Market Contact",
            description:
              "Contact Template Market for support, sales, and partnerships",
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "+84-971-386-588",
              contactType: "Customer Support",
              email: "support@templatemarket.com",
              availableLanguage: ["Vietnamese", "English"],
              areaServed: "VN",
            },
            address: {
              "@type": "PostalAddress",
              streetAddress: "Hà Tu",
              addressLocality: "Hạ Long",
              addressRegion: "Quảng Ninh",
              postalCode: "70000",
              addressCountry: "VN",
            },
          })}
        </script>
      </Helmet>

      <div
        className={`min-h-screen bg-gradient-to-br ${softPinkTheme.pageBackground} overflow-hidden relative`}
      >
        <ScrollToTopButton show={showScrollToTop} />

        {/* ============================================ */}
        {/* FLOATING BACKGROUND ICONS - GIỐNG PRICING */}
        {/* ============================================ */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          {decorativeIcons.map((item, i) => (
            <motion.div
              key={i}
              className={`absolute ${item.position} ${item.size} opacity-5`}
              animate={{
                y: [0, -30, 0],
                rotate: [0, 15, -15, 0],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 10 + i * 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5,
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

        {/* ============================================ */}
        {/* HERO SECTION */}
        {/* ============================================ */}
        <motion.section
          className="relative px-4 py-20 lg:py-24 overflow-hidden z-10"
          style={{
            y: y1,
            opacity,
            backgroundImage: `radial-gradient(circle at 20% 80%, rgba(244, 63, 94, 0.05) 0%, transparent 50%),
                             radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.05) 0%, transparent 50%),
                             radial-gradient(circle at 40% 40%, rgba(220, 38, 127, 0.03) 0%, transparent 50%)`,
          }}
        >
          <div className="container relative z-10 mx-auto text-center max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6 lg:space-y-8"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
                className="inline-block"
              >
                <span
                  className={`inline-flex items-center px-4 lg:px-8 py-3 lg:py-4 text-base lg:text-lg font-semibold border-0 ${softPinkTheme.glow} bg-gradient-to-r ${softPinkTheme.primaryGradient} text-white rounded-full`}
                >
                  <MessageCircle className="w-4 lg:w-5 h-4 lg:h-5 mr-2 lg:mr-3" />
                  <span className="hidden sm:inline">
                    Liên hệ & Hỗ trợ 24/7
                  </span>
                  <span className="sm:hidden">Hỗ trợ 24/7</span>
                  <Sparkles className="w-4 lg:w-5 h-4 lg:h-5 ml-2 lg:ml-3 animate-pulse" />
                </span>
              </motion.div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                <span
                  className={`text-transparent bg-gradient-to-r ${softPinkTheme.heroText} bg-clip-text`}
                >
                  Chúng tôi luôn
                </span>
                <br />
                <span className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-gray-700">
                  sẵn sàng hỗ trợ
                </span>
              </h1>

              {/* Subtitle */}
              <p className="max-w-4xl mx-auto text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-600 leading-relaxed px-4">
                Đội ngũ chuyên gia
                <span className="font-bold text-pink-600">
                  {" "}
                  Template Market{" "}
                </span>
                sẵn sàng
                <span className="font-bold text-rose-600"> 24/7 </span>
                để đồng hành cùng bạn trên mọi hành trình.
                <br className="hidden sm:block" />
                <span className="text-sm sm:text-base lg:text-lg text-gray-500 block sm:inline mt-2 sm:mt-0">
                  Hơn 50.000 khách hàng tin tưởng • Phản hồi trong 30 giây • Hỗ
                  trợ 120+ quốc gia
                </span>
              </p>

              {/* Company Stats */}
              <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-6 pt-6 lg:pt-8">
                {companyStats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                    whileHover={{ y: -10, scale: 1.05 }}
                    className="text-center"
                  >
                    <div
                      className={`flex items-center justify-center w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-2 lg:mb-4 bg-gradient-to-r ${softPinkTheme.primaryGradient} rounded-xl lg:rounded-2xl ${softPinkTheme.glow}`}
                    >
                      <stat.icon className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                    </div>
                    <div
                      className={`text-xl sm:text-2xl lg:text-3xl font-bold ${stat.color} mb-1 lg:mb-2`}
                    >
                      {stat.value}
                    </div>
                    <div className="text-xs lg:text-sm text-gray-600 font-medium">
                      {stat.label}
                    </div>
                    <div className="flex items-center justify-center gap-1 text-xs mt-1">
                      <TrendingUp className="w-3 h-3 text-green-500" />
                      <span className="text-green-600 font-medium">
                        {stat.trend}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 lg:gap-4 pt-6 lg:pt-8 px-4">
                <button
                  className={`w-full sm:w-auto px-6 py-3 bg-gradient-to-r ${softPinkTheme.primaryGradient} hover:scale-105 ${softPinkTheme.glow} text-white border-0 transition-all duration-300 rounded-lg font-semibold flex items-center justify-center`}
                  onClick={() =>
                    document
                      .getElementById("contact-form")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  <Send className="w-4 lg:w-5 h-4 lg:h-5 mr-2" />
                  <span className="text-sm lg:text-base">
                    Gửi tin nhắn ngay
                  </span>
                  <ArrowRight className="w-4 lg:w-5 h-4 lg:h-5 ml-2" />
                </button>
                <button
                  className="w-full sm:w-auto px-6 py-3 border-2 border-pink-300 hover:bg-pink-50 text-sm lg:text-base rounded-lg font-semibold flex items-center justify-center"
                  onClick={() =>
                    document
                      .getElementById("contact-channels")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  <Phone className="w-4 lg:w-5 h-4 lg:h-5 mr-2" />
                  <span className="hidden sm:inline">
                    Xem thông tin liên hệ
                  </span>
                  <span className="sm:hidden">Thông tin liên hệ</span>
                </button>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* ============================================ */}
        {/* CONTACT CHANNELS SECTION */}
        {/* ============================================ */}
        <section
          id="contact-channels"
          className="relative px-4 py-16 lg:py-20 z-10"
          style={{
            backgroundImage: `radial-gradient(circle at 30% 50%, rgba(244, 63, 94, 0.03) 0%, transparent 50%),
                             radial-gradient(circle at 70% 50%, rgba(236, 72, 153, 0.03) 0%, transparent 50%)`,
          }}
        >
          <div className="container mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 bg-gradient-to-r from-pink-100 to-rose-100 rounded-full">
                <Phone className="w-5 h-5 text-pink-600" />
                <span className="text-sm font-semibold text-pink-700">
                  Kênh liên hệ
                </span>
              </div>
              <h2
                className={`text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r ${softPinkTheme.heroText} bg-clip-text text-transparent`}
              >
                Kênh liên hệ
              </h2>
              <p className="text-lg lg:text-xl text-gray-600">
                Chọn cách thức liên hệ phù hợp với bạn
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactChannels.map((channel, index) => (
                <motion.div
                  key={channel.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className={`relative p-6 rounded-2xl bg-gradient-to-br ${softPinkTheme.floatingCard} ${softPinkTheme.softGlow} backdrop-blur-xl`}
                >
                  <div
                    className={`w-16 h-16 rounded-xl bg-gradient-to-r ${channel.color} flex items-center justify-center mb-4 ${softPinkTheme.neonGlow}`}
                  >
                    <channel.icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-xl font-bold mb-2 text-gray-800">
                    {channel.title}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <p className="text-lg font-semibold text-pink-600 flex items-center gap-2">
                      {channel.content}
                      <button
                        onClick={() =>
                          copyToClipboard(channel.content, channel.title)
                        }
                        className="p-1 hover:bg-pink-100 rounded transition-colors"
                        aria-label="Copy to clipboard"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </p>
                    <p className="text-sm text-gray-600">
                      {channel.subContent}
                    </p>
                    <p className="text-sm text-gray-500">{channel.details}</p>
                  </div>

                  <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{channel.hours}</span>
                  </div>

                  <button
                    onClick={channel.onClick}
                    className={`w-full px-4 py-2 bg-gradient-to-r ${channel.color} text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:scale-105 transition-all`}
                  >
                    <channel.actionIcon className="w-4 h-4" />
                    {channel.action}
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* CONTACT FORM SECTION */}
        {/* ============================================ */}
        <section
          id="contact-form"
          className="relative px-4 py-16 lg:py-20 z-10"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(244, 63, 94, 0.04) 0%, transparent 60%)`,
          }}
        >
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 bg-gradient-to-r from-pink-100 to-rose-100 rounded-full">
                <Mail className="w-5 h-5 text-pink-600" />
                <span className="text-sm font-semibold text-pink-700">
                  Gửi tin nhắn
                </span>
              </div>
              <h2
                className={`text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r ${softPinkTheme.heroText} bg-clip-text text-transparent`}
              >
                Gửi tin nhắn
              </h2>
              <p className="text-lg lg:text-xl text-gray-600">
                Điền thông tin bên dưới, chúng tôi sẽ phản hồi trong vòng 2 giờ
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`p-8 rounded-2xl bg-gradient-to-br ${softPinkTheme.floatingCard} ${softPinkTheme.softGlow} backdrop-blur-xl`}
            >
              {!isSubmitted ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="text-sm font-semibold mb-2 text-gray-700 flex items-center gap-2">
                      <Users className="w-4 h-4 text-pink-600" />
                      Họ tên
                    </label>
                    <input
                      {...register("name")}
                      type="text"
                      placeholder="Nhập họ tên của bạn"
                      className="w-full px-4 py-3 rounded-lg border-2 border-pink-200 focus:border-pink-400 focus:outline-none transition-colors"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold mb-2 text-gray-700 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-pink-600" />
                        Email
                      </label>
                      <input
                        {...register("email")}
                        type="email"
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 rounded-lg border-2 border-pink-200 focus:border-pink-400 focus:outline-none transition-colors"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-semibold mb-2 text-gray-700 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-pink-600" />
                        Số điện thoại
                      </label>
                      <input
                        {...register("phone")}
                        type="tel"
                        placeholder="+84 xxx xxx xxx"
                        className="w-full px-4 py-3 rounded-lg border-2 border-pink-200 focus:border-pink-400 focus:outline-none transition-colors"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Company */}
                  <div>
                    <label className=" text-sm font-semibold mb-2 text-gray-700 flex items-center gap-2">
                      <Building className="w-4 h-4 text-pink-600" />
                      Công ty (tùy chọn)
                    </label>
                    <input
                      {...register("company")}
                      type="text"
                      placeholder="Tên công ty của bạn"
                      className="w-full px-4 py-3 rounded-lg border-2 border-pink-200 focus:border-pink-400 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className=" text-sm font-semibold mb-2 text-gray-700 flex items-center gap-2">
                      <Package className="w-4 h-4 text-pink-600" />
                      Danh mục
                    </label>
                    <select
                      {...register("category")}
                      className="w-full px-4 py-3 rounded-lg border-2 border-pink-200 focus:border-pink-400 focus:outline-none transition-colors bg-white"
                    >
                      {supportCategories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className=" text-sm font-semibold mb-2 text-gray-700 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-pink-600" />
                      Tiêu đề
                    </label>
                    <input
                      {...register("subject")}
                      type="text"
                      placeholder="Tiêu đề tin nhắn"
                      className="w-full px-4 py-3 rounded-lg border-2 border-pink-200 focus:border-pink-400 focus:outline-none transition-colors"
                    />
                    {errors.subject && (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.subject.message}
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label className=" text-sm font-semibold mb-2 text-gray-700 flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-pink-600" />
                      Tin nhắn ({messageLength}/2000)
                    </label>
                    <textarea
                      {...register("message")}
                      rows={6}
                      placeholder="Mô tả chi tiết vấn đề của bạn..."
                      className="w-full px-4 py-3 rounded-lg border-2 border-pink-200 focus:border-pink-400 focus:outline-none transition-colors resize-none"
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  {/* Checkboxes */}
                  <div className="space-y-3">
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        {...register("newsletter")}
                        type="checkbox"
                        className="mt-1 w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
                      />
                      <span className="text-sm text-gray-600">
                        Đăng ký nhận newsletter và ưu đãi đặc biệt
                      </span>
                    </label>

                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        {...register("terms")}
                        type="checkbox"
                        className="mt-1 w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
                      />
                      <span className="text-sm text-gray-600">
                        Tôi đồng ý với điều khoản sử dụng và chính sách bảo mật
                      </span>
                    </label>
                    {errors.terms && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.terms.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full px-6 py-4 bg-gradient-to-r ${softPinkTheme.primaryGradient} text-white rounded-lg font-bold text-lg flex items-center justify-center gap-2 hover:scale-105 ${softPinkTheme.glow} transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        >
                          <Settings className="w-5 h-5" />
                        </motion.div>
                        Đang gửi...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Gửi tin nhắn
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <CheckCircle className="w-20 h-20 mx-auto mb-6 text-green-500" />
                  <h3 className="text-2xl font-bold mb-4 text-gray-800 flex items-center justify-center gap-2">
                    <Award className="w-6 h-6 text-pink-600" />
                    Gửi thành công!
                  </h3>
                  <p className="text-lg text-gray-600 mb-6">
                    Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi trong vòng 2
                    giờ.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      reset();
                    }}
                    className={`px-6 py-3 bg-gradient-to-r ${softPinkTheme.primaryGradient} text-white rounded-lg font-semibold hover:scale-105 transition-all inline-flex items-center gap-2`}
                  >
                    <Mail className="w-4 h-4" />
                    Gửi tin nhắn khác
                  </button>
                </motion.div>
              )}
            </motion.div>
          </div>
        </section>

        {/* ============================================ */}
        {/* SOCIAL MEDIA SECTION */}
        {/* ============================================ */}
        <section
          className="relative px-4 py-16 lg:py-20 z-10"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 50%, rgba(236, 72, 153, 0.04) 0%, transparent 50%),
                             radial-gradient(circle at 75% 50%, rgba(244, 63, 94, 0.04) 0%, transparent 50%)`,
          }}
        >
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 bg-gradient-to-r from-pink-100 to-rose-100 rounded-full">
                <Globe className="w-5 h-5 text-pink-600" />
                <span className="text-sm font-semibold text-pink-700">
                  Mạng xã hội
                </span>
              </div>
              <h2
                className={`text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r ${softPinkTheme.heroText} bg-clip-text text-transparent`}
              >
                Kết nối với chúng tôi
              </h2>
              <p className="text-lg lg:text-xl text-gray-600">
                Theo dõi Template Market trên các nền tảng xã hội
              </p>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
              {socialPlatforms.map((platform, index) => (
                <motion.a
                  key={index}
                  href={platform.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className={`p-6 rounded-2xl bg-gradient-to-br ${softPinkTheme.neoCard} ${softPinkTheme.softGlow} backdrop-blur-xl hover:${softPinkTheme.glow} transition-all text-center group`}
                >
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r ${platform.gradient} flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <platform.icon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-bold text-lg mb-2 text-gray-800">
                    {platform.label}
                  </h4>
                  <span className="inline-flex items-center text-sm text-gray-600">
                    Theo dõi
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </span>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* FAQ SECTION */}
        {/* ============================================ */}
        <section
          className="relative px-4 py-16 lg:py-20 z-10"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 30%, rgba(244, 63, 94, 0.03) 0%, transparent 60%)`,
          }}
        >
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 bg-gradient-to-r from-pink-100 to-rose-100 rounded-full">
                <MessageSquare className="w-5 h-5 text-pink-600" />
                <span className="text-sm font-semibold text-pink-700">FAQ</span>
              </div>
              <h2
                className={`text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r ${softPinkTheme.heroText} bg-clip-text text-transparent`}
              >
                Câu hỏi thường gặp
              </h2>
              <p className="text-lg lg:text-xl text-gray-600">
                Những câu hỏi phổ biến về dịch vụ của chúng tôi
              </p>
            </motion.div>

            <div className="space-y-4">
              {faqCategories.map((category, catIndex) => (
                <div key={catIndex} className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <category.icon className="w-6 h-6 text-pink-600" />
                    {category.title}
                  </h3>
                  {category.questions.map((faq, faqIndex) => {
                    const globalIndex = catIndex * 10 + faqIndex;
                    return (
                      <motion.div
                        key={globalIndex}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: faqIndex * 0.1 }}
                        className={`rounded-2xl bg-gradient-to-br ${softPinkTheme.neoCard} ${softPinkTheme.softGlow} overflow-hidden`}
                      >
                        <button
                          onClick={() =>
                            setExpandedFaq(
                              expandedFaq === globalIndex ? null : globalIndex,
                            )
                          }
                          className="w-full p-6 text-left flex items-center justify-between hover:bg-pink-50/30 transition-colors"
                        >
                          <h4 className="text-lg font-semibold text-gray-800 pr-4">
                            {faq.q}
                          </h4>
                          <motion.div
                            animate={{
                              rotate: expandedFaq === globalIndex ? 180 : 0,
                            }}
                            transition={{ duration: 0.2 }}
                            className="flex-shrink-0"
                          >
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          </motion.div>
                        </button>
                        <AnimatePresence>
                          {expandedFaq === globalIndex && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <div className="px-6 pb-6">
                                <p className="text-gray-600 leading-relaxed">
                                  {faq.a}
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* CTA SECTION */}
        {/* ============================================ */}
        <section
          className={`relative px-4 py-16 lg:py-20 overflow-hidden bg-gradient-to-r ${softPinkTheme.primaryGradient} z-10`}
        >
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-black/10"></div>
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-16 h-16 lg:w-24 lg:h-24 bg-white/10 rounded-full blur-xl"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.2, 0.8, 0.2],
                }}
                transition={{
                  duration: 6 + i * 2,
                  repeat: Infinity,
                  delay: i * 1,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          <div className="container relative z-10 mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto space-y-6 lg:space-y-8 text-white"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 bg-white/20 backdrop-blur-sm rounded-full">
                <Rocket className="w-5 h-5" />
                <span className="text-sm font-semibold">Sẵn sàng bắt đầu</span>
              </div>

              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold">
                Sẵn sàng kết nối?
              </h2>
              <p className="text-lg lg:text-xl opacity-90 leading-relaxed px-4">
                Đội ngũ Template Market luôn sẵn sàng hỗ trợ bạn{" "}
                <span className="font-bold">24/7</span> với tất cả các câu hỏi,
                yêu cầu kỹ thuật,
                <br className="hidden sm:block" />
                tư vấn sản phẩm và hợp tác kinh doanh.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 lg:gap-6">
                <button
                  onClick={() =>
                    document
                      .getElementById("contact-form")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="w-full sm:w-auto bg-white text-pink-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 px-6 lg:px-8 py-3 lg:py-4 text-sm lg:text-base rounded-lg font-bold flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-5 h-5 lg:w-6 lg:h-6" />
                  <span className="hidden sm:inline">Gửi tin nhắn ngay</span>
                  <span className="sm:hidden">Gửi tin nhắn</span>
                  <ArrowRight className="w-5 h-5 lg:w-6 lg:h-6" />
                </button>

                <button
                  onClick={() => window.open("tel:+84971386588", "_self")}
                  className="w-full sm:w-auto bg-white/10 hover:bg-white/20 backdrop-blur-lg border-2 border-white/30 text-white transition-all duration-300 px-6 lg:px-8 py-3 lg:py-4 text-sm lg:text-base rounded-lg font-bold flex items-center justify-center gap-2"
                >
                  <Phone className="w-5 h-5 lg:w-6 lg:h-6" />
                  <span className="hidden sm:inline">Gọi hotline</span>
                  <span className="sm:hidden">Gọi ngay</span>
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Contact;
