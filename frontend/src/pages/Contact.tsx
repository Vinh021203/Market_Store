import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import { createContact } from "@/lib/contacts";
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
  Coffee,
  Code,
  Palette,
  MessageSquare,
  Calendar,
  ChevronDown,
  ExternalLink,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Github,
  HelpCircle,
  AlertCircle,
  CheckIcon,
  Plus,
  Minus,
  Edit,
  Trash2,
  Save,
  Copy,
  Eye,
  Target,
  Navigation,
  TrendingUp,
  Activity,
  Rocket,
  Crown,
  Diamond,
  BookMarked,
  Library,
  Feather,
  Layers,
  ArrowUp,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

// ✅ SOFT PINK THEME - SAME AS OTHER PAGES
const softPinkTheme = {
  // 🌸 PINK BACKGROUND TONES
  pageBackground: "from-pink-50/70 via-rose-50/60 to-red-50/50",
  sectionBackground: "from-white/95 via-pink-25/30 to-rose-25/20",

  // 💗 GLASS & CARDS
  glassCard: "from-white/95 via-pink-25/20 to-rose-25/10 backdrop-blur-xl",
  neoCard: "bg-gradient-to-br from-white via-pink-25/30 to-rose-25/20",
  floatingCard: "from-white/90 via-pink-50/60 to-rose-50/40",

  // 🌹 GRADIENT COLORS - PINK THEME
  primaryGradient: "from-pink-500 via-rose-500 to-red-500",
  secondaryGradient: "from-pink-400 via-rose-500 to-pink-600",
  accentGradient: "from-rose-400 via-pink-500 to-red-400",
  successGradient: "from-pink-300 via-rose-400 to-pink-500",

  // 💕 TEXT COLORS
  heroText: "from-pink-700 via-rose-600 to-red-600",
  primaryText: "from-slate-700 via-pink-700 to-rose-700",
  accentText: "from-rose-600 via-pink-600 to-red-600",

  // ✨ EFFECTS
  glow: "shadow-pink-200/60 shadow-2xl",
  neonGlow: "shadow-rose-300/50 shadow-xl",
  softGlow: "shadow-pink-200/40 shadow-lg",

  // 🎨 DYNAMIC COLORS - PINK VARIATIONS
  dynamicColors: [
    {
      bg: "from-pink-400 to-rose-500",
      text: "text-pink-50",
      glow: "shadow-pink-400/30",
    },
    {
      bg: "from-rose-400 to-red-500",
      text: "text-rose-50",
      glow: "shadow-rose-400/30",
    },
    {
      bg: "from-pink-500 to-rose-600",
      text: "text-pink-50",
      glow: "shadow-pink-500/30",
    },
    {
      bg: "from-red-400 to-pink-500",
      text: "text-red-50",
      glow: "shadow-red-400/30",
    },
    {
      bg: "from-rose-500 to-pink-600",
      text: "text-rose-50",
      glow: "shadow-rose-500/30",
    },
    {
      bg: "from-pink-600 to-red-500",
      text: "text-pink-50",
      glow: "shadow-pink-600/30",
    },
  ],
};

// Custom SVG Components for Social Media
const TikTok = (props) => (
  <svg
    viewBox="0 0 16 16"
    fill="currentColor"
    width={24}
    height={24}
    {...props}
  >
    <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z" />
  </svg>
);

const Discord = (props) => (
  <svg
    viewBox="0 0 16 16"
    fill="currentColor"
    width={24}
    height={24}
    {...props}
  >
    <path d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612" />
  </svg>
);

const Telegram = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    width={24}
    height={24}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 10l-4 4l6 6l4 -16l-18 7l4 2l2 6l3 -4" />
  </svg>
);

const WhatsApp = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    width={24}
    height={24}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9" />
    <path d="M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1" />
  </svg>
);

// ✅ ENHANCED SCHEMA - PINK THEME
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
  position: z
    .string()
    .max(50, "Chức vụ không được vượt quá 50 ký tự")
    .optional(),
  website: z.string().url("Website không hợp lệ").optional().or(z.literal("")),
  subject: z
    .string()
    .min(5, "Tiêu đề phải có ít nhất 5 ký tự")
    .max(100, "Tiêu đề không được vượt quá 100 ký tự"),
  category: z.enum([
    "support",
    "sales",
    "partnership",
    "feedback",
    "media",
    "technical",
    "billing",
    "feature",
    "bug",
    "security",
    "compliance",
    "other",
  ]),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  message: z
    .string()
    .min(20, "Tin nhắn phải có ít nhất 20 ký tự")
    .max(2000, "Tin nhắn không được vượt quá 2000 ký tự"),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  referral: z.string().optional(),
  newsletter: z.boolean().default(false),
  terms: z.boolean().refine((val) => val === true, {
    message: "Bạn phải đồng ý với điều khoản sử dụng",
  }),
});

type ContactData = z.infer<typeof contactSchema>;

// ✅ ENHANCED DATA WITH PINK THEME
const socialPlatforms = [
  {
    icon: Facebook,
    href: "https://facebook.com/templatemarket",
    label: "Facebook",
    color: "hover:text-blue-600",
    users: "2.9B",
    gradient: "from-blue-500 to-blue-600",
  },
  {
    icon: Twitter,
    href: "https://twitter.com/templatemarket",
    label: "Twitter",
    color: "hover:text-sky-500",
    users: "450M",
    gradient: "from-sky-500 to-sky-600",
  },
  {
    icon: Instagram,
    href: "https://instagram.com/templatemarket",
    label: "Instagram",
    color: "hover:text-pink-600",
    users: "2B",
    gradient: softPinkTheme.primaryGradient,
  },
  {
    icon: Linkedin,
    href: "https://linkedin.com/company/templatemarket",
    label: "LinkedIn",
    color: "hover:text-blue-700",
    users: "900M",
    gradient: "from-blue-600 to-blue-700",
  },
  {
    icon: Youtube,
    href: "https://youtube.com/@templatemarket",
    label: "YouTube",
    color: "hover:text-red-600",
    users: "2.7B",
    gradient: "from-red-500 to-red-600",
  },
  {
    icon: Github,
    href: "https://github.com/templatemarket",
    label: "GitHub",
    color: "hover:text-gray-900",
    users: "100M",
    gradient: "from-gray-700 to-gray-900",
  },
  {
    icon: TikTok,
    href: "https://tiktok.com/@templatemarket",
    label: "TikTok",
    color: "hover:text-black",
    users: "1B",
    gradient: "from-black to-gray-800",
  },
  {
    icon: Discord,
    href: "https://discord.gg/templatemarket",
    label: "Discord",
    color: "hover:text-indigo-500",
    users: "150M",
    gradient: "from-indigo-500 to-indigo-600",
  },
  {
    icon: Telegram,
    href: "https://t.me/templatemarket",
    label: "Telegram",
    color: "hover:text-blue-500",
    users: "800M",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: WhatsApp,
    href: "https://wa.me/84971386588",
    label: "WhatsApp",
    color: "hover:text-green-500",
    users: "2B",
    gradient: "from-green-500 to-green-600",
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
    stats: { visitors: "2K+/tháng", rating: "4.9/5" },
    features: ["Parking miễn phí", "WiFi tốc độ cao", "Meeting rooms", "Café"],
    onClick: () => {
      const coords = { lat: 20.9101, lng: 107.1839 };
      const url = `https://www.google.com/maps?q=${coords.lat},${coords.lng}`;
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
    stats: { calls: "10K+/tháng", satisfaction: "99.2%" },
    features: [
      "Không chờ đợi",
      "Chuyên gia 24/7",
      "Multi-language",
      "Callback service",
    ],
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
    stats: { emails: "50K+/tháng", response: "< 2h" },
    features: [
      "Auto-reply",
      "Priority queue",
      "Attachment support",
      "Email tracking",
    ],
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
    stats: { chats: "100K+/tháng", rating: "4.8/5" },
    features: [
      "Instant response",
      "File sharing",
      "Screen sharing",
      "Voice/Video call",
    ],
    onClick: () => {
      console.log("Opening chat widget...");
      toast({
        title: "💬 Chat đang được kích hoạt",
        description: "Widget chat sẽ xuất hiện trong giây lát...",
      });
    },
  },
];

const supportCategories = [
  {
    value: "support",
    label: "🛠️ Hỗ trợ kỹ thuật",
    icon: Headphones,
    description: "Giải quyết vấn đề kỹ thuật, bug, lỗi hệ thống",
    response: "< 1h",
    team: "Tech Support",
    gradient: softPinkTheme.primaryGradient,
  },
  {
    value: "sales",
    label: "💼 Tư vấn bán hàng",
    icon: Users,
    description: "Tư vấn sản phẩm, báo giá, demo",
    response: "< 30m",
    team: "Sales Team",
    gradient: softPinkTheme.secondaryGradient,
  },
  {
    value: "partnership",
    label: "🤝 Hợp tác kinh doanh",
    icon: Building,
    description: "Đối tác, affiliate, reseller",
    response: "< 2h",
    team: "Business Dev",
    gradient: softPinkTheme.accentGradient,
  },
  {
    value: "feedback",
    label: "💭 Góp ý & Phản hồi",
    icon: MessageSquare,
    description: "Ý kiến cải thiện, khiếu nại, compliment",
    response: "< 4h",
    team: "Customer Success",
    gradient: softPinkTheme.successGradient,
  },
  {
    value: "media",
    label: "📺 Truyền thông",
    icon: Globe,
    description: "Báo chí, PR, marketing content",
    response: "< 24h",
    team: "PR Team",
    gradient: "from-purple-500 to-purple-600",
  },
  {
    value: "other",
    label: "📋 Khác",
    icon: HelpCircle,
    description: "Các vấn đề khác chưa được phân loại",
    response: "< 2h",
    team: "General Support",
    gradient: "from-gray-500 to-gray-600",
  },
];

const priorityLevels = [
  {
    value: "low",
    label: "🟢 Thấp",
    color: "text-green-600 bg-green-50",
    description: "Không gấp, có thể chờ 1-2 ngày",
  },
  {
    value: "medium",
    label: "🟡 Trung bình",
    color: "text-yellow-600 bg-yellow-50",
    description: "Mức độ bình thường, xử lý trong ngày",
  },
  {
    value: "high",
    label: "🟠 Cao",
    color: "text-orange-600 bg-orange-50",
    description: "Cần xử lý ưu tiên trong vài giờ",
  },
  {
    value: "urgent",
    label: "🔴 Khẩn cấp",
    color: "text-red-600 bg-red-50",
    description: "Cần xử lý ngay lập tức",
  },
];

const companyStats = [
  {
    icon: Users,
    value: "50K+",
    label: "Happy Customers",
    trend: "+15%",
    description: "Khách hàng hài lòng trên toàn thế giới",
    color: "text-pink-600",
  },
  {
    icon: Globe,
    value: "120+",
    label: "Countries",
    trend: "+8%",
    description: "Quốc gia và vùng lãnh thổ",
    color: "text-rose-600",
  },
  {
    icon: Star,
    value: "4.9/5",
    label: "Rating",
    trend: "+0.2",
    description: "Đánh giá trung bình từ người dùng",
    color: "text-red-600",
  },
  {
    icon: Zap,
    value: "< 30s",
    label: "Response",
    trend: "-5s",
    description: "Thời gian phản hồi trung bình",
    color: "text-pink-700",
  },
  {
    icon: Shield,
    value: "99.9%",
    label: "Uptime",
    trend: "+0.1%",
    description: "Thời gian hoạt động hệ thống",
    color: "text-rose-700",
  },
  {
    icon: Heart,
    value: "98%",
    label: "Satisfaction",
    trend: "+2%",
    description: "Tỷ lệ hài lòng khách hàng",
    color: "text-red-700",
  },
];

const officeSchedule = [
  {
    day: "Thứ Hai",
    hours: "8:00 AM - 6:00 PM",
    available: true,
    team: "Full Team",
    workload: "High",
  },
  {
    day: "Thứ Ba",
    hours: "8:00 AM - 6:00 PM",
    available: true,
    team: "Full Team",
    workload: "High",
  },
  {
    day: "Thứ Tư",
    hours: "8:00 AM - 6:00 PM",
    available: true,
    team: "Full Team",
    workload: "Medium",
  },
  {
    day: "Thứ Năm",
    hours: "8:00 AM - 6:00 PM",
    available: true,
    team: "Full Team",
    workload: "High",
  },
  {
    day: "Thứ Sáu",
    hours: "8:00 AM - 6:00 PM",
    available: true,
    team: "Full Team",
    workload: "Medium",
  },
  {
    day: "Thứ Bảy",
    hours: "9:00 AM - 5:00 PM",
    available: true,
    team: "Support Only",
    workload: "Low",
  },
  {
    day: "Chủ Nhật",
    hours: "Nghỉ",
    available: false,
    team: "Emergency Only",
    workload: "None",
  },
];

const faqCategories = [
  {
    title: "💳 Thanh toán & Pricing",
    questions: [
      {
        q: "Các phương thức thanh toán nào được hỗ trợ?",
        a: "Chúng tôi hỗ trợ thẻ tín dụng (Visa/Mastercard), PayPal, chuyển khoản ngân hàng, và ví điện tử như MoMo, ZaloPay. Tất cả giao dịch đều được mã hóa SSL 256-bit.",
      },
      {
        q: "Có chính sách hoàn tiền không?",
        a: "Có, chúng tôi có chính sách hoàn tiền 100% trong vòng 30 ngày nếu sản phẩm không như mô tả hoặc có lỗi kỹ thuật. Quy trình hoàn tiền mất 3-5 ngày làm việc.",
      },
      {
        q: "Giá có bao gồm VAT không?",
        a: "Giá hiển thị chưa bao gồm VAT. VAT sẽ được tính thêm theo quy định của từng quốc gia (10% tại Việt Nam).",
      },
    ],
  },
  {
    title: "📥 Download & Sử dụng",
    questions: [
      {
        q: "Làm sao tải xuống sau khi mua?",
        a: "Sau khi thanh toán thành công, bạn sẽ nhận email chứa link download. Bạn cũng có thể login vào account để tải lại unlimited.",
      },
      {
        q: "File download có hết hạn không?",
        a: "Không, link download của bạn không bao giờ hết hạn. Bạn có thể tải lại bất cứ lúc nào từ account.",
      },
      {
        q: "Có thể sử dụng cho dự án thương mại không?",
        a: "Có, tất cả templates đều đi kèm Commercial License, cho phép sử dụng unlimited cho dự án cá nhân và thương mại.",
      },
    ],
  },
  {
    title: "🛠️ Hỗ trợ kỹ thuật",
    questions: [
      {
        q: "Có hỗ trợ customization không?",
        a: "Có, chúng tôi cung cấp dịch vụ customization với chi phí từ $50-500 tùy độ phức tạp. Timeline từ 1-5 ngày.",
      },
      {
        q: "Templates có responsive không?",
        a: "100% templates của chúng tôi đều responsive, tối ưu cho mobile, tablet và desktop. Tested trên tất cả browsers phổ biến.",
      },
      {
        q: "Có documentation không?",
        a: "Mỗi template đều có documentation chi tiết, video hướng dẫn, và code comments để bạn dễ dàng customize.",
      },
    ],
  },
];

const testimonials = [
  {
    name: "Nguyễn Văn A",
    position: "CEO, TechStart Vietnam",
    avatar: "👨‍💼",
    rating: 5,
    content:
      "Templates chất lượng cao, support team rất nhiệt tình. Đã mua 15+ templates và đều hài lòng!",
    project: "E-commerce Platform",
    date: "2024-01-15",
  },
  {
    name: "Sarah Johnson",
    position: "Lead Designer, Creative Agency",
    avatar: "👩‍🎨",
    rating: 5,
    content:
      "Best templates marketplace I've ever used. Clean code, modern design, excellent documentation.",
    project: "Agency Website",
    date: "2024-01-10",
  },
  {
    name: "Trần Thị B",
    position: "Freelance Developer",
    avatar: "👩‍💻",
    rating: 5,
    content:
      "Tiết kiệm được rất nhiều thời gian development. Customer support respond cực nhanh, 24/7 luôn!",
    project: "SaaS Dashboard",
    date: "2024-01-08",
  },
];

// ✅ SCROLL TO TOP COMPONENT
const ScrollToTopButton = ({ show }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 0, scale: 0, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0, y: 20 }}
        className="fixed bottom-8 right-8 z-50"
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className={`w-14 h-14 rounded-full shadow-lg bg-gradient-to-r ${softPinkTheme.primaryGradient} hover:scale-110 text-white border-0 transition-all relative overflow-hidden group`}
                size="sm"
              >
                <ArrowUp className="w-6 h-6 relative z-10 group-hover:scale-125 transition-transform" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-2 border-white/30 rounded-full"
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Về đầu trang</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </motion.div>
    )}
  </AnimatePresence>
);

// ✅ MAIN CONTACT COMPONENT
const Contact: React.FC = () => {
  // States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [selectedFaqCategory, setSelectedFaqCategory] = useState(0);
  const [activeTab, setActiveTab] = useState("contact");
  const [formStep, setFormStep] = useState(1);
  const [messageLength, setMessageLength] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  // Hooks
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.8]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.95]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors, isValid, isDirty },
  } = useForm<ContactData>({
    resolver: zodResolver(contactSchema),
    mode: "onChange",
    defaultValues: {
      priority: "medium",
      newsletter: false,
      terms: false,
    },
  });

  const watchedMessage = watch("message", "");
  const watchedCategory = watch("category");
  const watchedPriority = watch("priority");

  // Effects
  useEffect(() => {
    setMessageLength(watchedMessage?.length || 0);
  }, [watchedMessage]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.pageYOffset > 500);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handlers
  const onSubmit = useCallback(
    async (data: ContactData) => {
      setIsSubmitting(true);

      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const contactData = {
          ...data,
          timestamp: new Date().toISOString(),
          source: "contact-form",
          ip: "127.0.0.1",
          userAgent: navigator.userAgent,
          referrer: document.referrer || "direct",
        } as any;

        await createContact(contactData);

        setIsSubmitted(true);
        reset();
        setFormStep(1);

        toast({
          title: "🎉 Tin nhắn đã được gửi thành công!",
          description:
            "Chúng tôi sẽ phản hồi trong thời gian sớm nhất. Cảm ơn bạn!",
        });

        setTimeout(() => setIsSubmitted(false), 8000);
      } catch (error) {
        toast({
          title: "❌ Lỗi gửi tin nhắn",
          description:
            "Vui lòng thử lại hoặc liên hệ qua hotline: +84 971 386 588",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [reset],
  );

  const handleNextStep = useCallback(() => {
    if (formStep < 3) setFormStep(formStep + 1);
  }, [formStep]);

  const handlePrevStep = useCallback(() => {
    if (formStep > 1) setFormStep(formStep - 1);
  }, [formStep]);

  const copyToClipboard = useCallback(async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "📋 Đã sao chép!",
        description: `${label} đã được sao chép vào clipboard.`,
      });
    } catch (error) {
      toast({
        title: "📋 Đã sao chép!",
        description: `${label} đã được sao chép.`,
      });
    }
  }, []);

  return (
    <TooltipProvider>
      <div
        className={`min-h-screen bg-gradient-to-br ${softPinkTheme.pageBackground} overflow-hidden`}
      >
        <ScrollToTopButton show={showScrollToTop} />

        {/* ✅ ENHANCED HERO SECTION - CREATIVE LAYOUT */}
        <motion.section
          className="relative px-4 py-20 lg:py-24 overflow-hidden"
          style={{ y: y1, opacity, scale }}
          id="hero"
        >
          {/* Floating background icons */}
          <div className="absolute inset-0 pointer-events-none">
            {[
              MessageCircle,
              Mail,
              Phone,
              Heart,
              Star,
              Crown,
              Diamond,
              BookMarked,
              Rocket,
              Target,
              Globe,
              Users,
              Zap,
              Shield,
              Award,
              Coffee,
            ].map((Icon, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  top: `${10 + (i % 3) * 30}%`,
                  left: `${5 + (i % 4) * 25}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  rotate: [0, 15, -15, 0],
                  opacity: [0.1, 0.3, 0.1],
                }}
                transition={{
                  duration: 8 + i * 2,
                  repeat: Infinity,
                  delay: i * 0.8,
                  ease: "easeInOut",
                }}
              >
                <Icon className="w-8 h-8 text-pink-300/20" />
              </motion.div>
            ))}
          </div>

          <div className="container relative z-10 mx-auto text-center max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6 lg:space-y-8"
            >
              {/* Animated Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
              >
                <Badge
                  className={`px-4 lg:px-8 py-3 lg:py-4 text-base lg:text-lg font-semibold border-0 ${softPinkTheme.glow} bg-gradient-to-r ${softPinkTheme.primaryGradient} text-white`}
                >
                  <MessageCircle className="w-4 lg:w-5 h-4 lg:h-5 mr-2 lg:mr-3" />
                  <span className="hidden sm:inline">
                    Liên hệ & Hỗ trợ 24/7
                  </span>
                  <span className="sm:hidden">Hỗ trợ 24/7</span>
                  <Sparkles className="w-4 lg:w-5 h-4 lg:h-5 ml-2 lg:ml-3 animate-pulse" />
                </Badge>
              </motion.div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                <span
                  className={`text-transparent bg-gradient-to-r ${softPinkTheme.heroText} bg-clip-text`}
                >
                  Chúng tôi luôn
                </span>
                <br />
                <span className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-gray-700 dark:text-gray-300">
                  sẵn sàng hỗ trợ
                </span>
              </h1>

              {/* Subtitle */}
              <p className="max-w-4xl mx-auto text-base sm:text-lg lg:text-xl xl:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed px-4">
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
                      className={`text-xl sm:text-2xl lg:text-3xl font-bold ${stat.color} dark:text-white mb-1 lg:mb-2`}
                    >
                      {stat.value}
                    </div>
                    <div className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 font-medium">
                      {stat.label}
                    </div>
                    <div className="flex items-center justify-center gap-1 text-xs mt-1 lg:block xl:flex">
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
                <Button
                  size="lg"
                  className={`w-full sm:w-auto bg-gradient-to-r ${softPinkTheme.primaryGradient} hover:scale-105 ${softPinkTheme.glow} text-white border-0 transition-all duration-300`}
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
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-2 border-pink-300 hover:bg-pink-50 dark:hover:bg-pink-900/20 text-sm lg:text-base"
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
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* ✅ CREATIVE CONTACT CHANNELS - RESPONSIVE BENTO BOX LAYOUT */}
        <section
          className={`px-4 py-16 lg:py-20 bg-gradient-to-r ${softPinkTheme.sectionBackground} backdrop-blur-sm`}
          id="contact-channels"
        >
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12 lg:mb-16"
            >
              <h2
                className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 lg:mb-6 text-transparent bg-gradient-to-r ${softPinkTheme.heroText} bg-clip-text`}
              >
                🌟 Kết nối đa kênh
              </h2>
              <p className="max-w-3xl mx-auto text-lg lg:text-xl text-gray-600 dark:text-gray-400 px-4">
                Chọn kênh liên hệ phù hợp nhất với bạn. Mỗi kênh đều có team
                chuyên biệt để hỗ trợ tốt nhất.
              </p>
            </motion.div>

            {/* ✅ RESPONSIVE BENTO BOX GRID - FIXED FOR MOBILE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 max-w-7xl mx-auto">
              {contactChannels.map((channel, index) => (
                <motion.div
                  key={channel.id}
                  initial={{ opacity: 0, y: 50, rotateY: -15 }}
                  whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, rotateY: 5, scale: 1.02 }}
                  style={{ perspective: "1000px" }}
                  className={`group h-full ${index === 0 ? "sm:col-span-2 lg:col-span-2 lg:row-span-2" : ""}`}
                >
                  <Card
                    className={`h-full bg-gradient-to-br ${softPinkTheme.neoCard} border-0 ${softPinkTheme.softGlow} backdrop-blur-xl hover:${softPinkTheme.glow} transition-all duration-500 overflow-hidden relative`}
                  >
                    {/* Gradient top bar */}
                    <div className={`h-2 bg-gradient-to-r ${channel.color}`} />

                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-200/20 to-transparent rounded-full -translate-y-16 translate-x-16" />

                    <CardContent className="p-4 sm:p-6 lg:p-8 relative z-10">
                      {/* Icon & Stats */}
                      <div className="flex items-start justify-between mb-4 lg:mb-6">
                        <motion.div
                          className={`w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-xl lg:rounded-2xl bg-gradient-to-r ${channel.color} flex items-center justify-center ${softPinkTheme.softGlow} group-hover:${softPinkTheme.glow} transition-all duration-300`}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          <channel.icon className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
                        </motion.div>

                        <div className="text-right text-xs text-gray-500 hidden sm:block">
                          <div className="flex items-center gap-1 mb-1">
                            <Star className="w-3 h-3 text-yellow-500" />
                            <span>{Object.values(channel.stats)[1]}</span>
                          </div>
                          <div>{Object.values(channel.stats)[0]}</div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="space-y-3 lg:space-y-4">
                        <div>
                          <h3
                            className={`text-lg sm:text-xl lg:text-2xl font-bold mb-2 group-hover:text-pink-600 transition-colors ${index === 0 ? "sm:text-2xl lg:text-3xl" : ""}`}
                          >
                            {channel.title}
                          </h3>
                          <p
                            className={`font-semibold text-pink-600 mb-1 text-sm sm:text-base ${index === 0 ? "sm:text-lg lg:text-xl" : ""}`}
                          >
                            {/* ✅ FIXED RESPONSIVE TEXT - NO OVERFLOW */}
                            <span className="block truncate pr-2">
                              {channel.content}
                            </span>
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600 mb-2">
                            {channel.subContent}
                          </p>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-gray-500 gap-1 sm:gap-0">
                            <span className="truncate pr-2">
                              {channel.details}
                            </span>
                            <span className="font-medium whitespace-nowrap">
                              {channel.hours}
                            </span>
                          </div>
                        </div>

                        {/* Features */}
                        <div className="space-y-2">
                          <h4 className="text-xs sm:text-sm font-semibold">
                            ✨ Features:
                          </h4>
                          <div
                            className={`grid ${index === 0 ? "sm:grid-cols-1 lg:grid-cols-2" : "grid-cols-1"} gap-1`}
                          >
                            {channel.features.map((feature, idx) => (
                              <div
                                key={idx}
                                className="text-xs text-gray-600 flex items-center gap-1"
                              >
                                <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                                <span className="truncate">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Action Buttons - FIXED RESPONSIVE */}
                        <div
                          className={`flex flex-col gap-2 pt-3 lg:pt-4 ${index === 0 ? "sm:flex-col lg:flex-row" : ""}`}
                        >
                          <Button
                            size="sm"
                            className={`flex-1 bg-gradient-to-r ${channel.color} hover:${softPinkTheme.glow} transition-all duration-300 text-xs sm:text-sm`}
                            onClick={channel.onClick}
                          >
                            <channel.actionIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                            <span className="truncate">{channel.action}</span>
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            className={`${index === 0 ? "flex-1" : "w-full"} text-xs border-pink-200`}
                            onClick={() =>
                              copyToClipboard(channel.content, channel.title)
                            }
                          >
                            <Copy className="w-3 h-3 mr-1 sm:mr-2" />
                            Copy
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ✅ MAIN CONTENT WITH ENHANCED TABS - RESPONSIVE */}
        <section className="px-4 py-16 lg:py-20" id="main-content">
          <div className="container mx-auto max-w-7xl">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              {/* ✅ RESPONSIVE TAB NAVIGATION */}
              <div className="flex justify-center mb-8 lg:mb-12">
                <TabsList
                  className={`grid grid-cols-2 sm:grid-cols-4 h-auto p-2 bg-gradient-to-r ${softPinkTheme.glassCard} backdrop-blur-lg ${softPinkTheme.softGlow} rounded-xl lg:rounded-2xl w-full max-w-2xl lg:max-w-4xl`}
                >
                  <TabsTrigger
                    value="contact"
                    className={`px-2 sm:px-4 lg:px-6 py-3 lg:py-4 text-xs sm:text-sm font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:${softPinkTheme.primaryGradient} data-[state=active]:text-white rounded-lg lg:rounded-xl transition-all`}
                  >
                    <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mr-1 sm:mr-2" />
                    <span className="hidden xs:inline">Gửi tin nhắn</span>
                    <span className="xs:hidden">Gửi</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="faq"
                    className={`px-2 sm:px-4 lg:px-6 py-3 lg:py-4 text-xs sm:text-sm font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:${softPinkTheme.secondaryGradient} data-[state=active]:text-white rounded-lg lg:rounded-xl transition-all`}
                  >
                    <HelpCircle className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mr-1 sm:mr-2" />
                    FAQ
                  </TabsTrigger>
                  <TabsTrigger
                    value="schedule"
                    className={`px-2 sm:px-4 lg:px-6 py-3 lg:py-4 text-xs sm:text-sm font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:${softPinkTheme.accentGradient} data-[state=active]:text-white rounded-lg lg:rounded-xl transition-all`}
                  >
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Lịch làm việc</span>
                    <span className="sm:hidden">Lịch</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="social"
                    className={`px-2 sm:px-4 lg:px-6 py-3 lg:py-4 text-xs sm:text-sm font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:${softPinkTheme.successGradient} data-[state=active]:text-white rounded-lg lg:rounded-xl transition-all`}
                  >
                    <Globe className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mr-1 sm:mr-2" />
                    Social
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* ✅ ENHANCED CONTACT FORM TAB - RESPONSIVE */}
              <TabsContent
                value="contact"
                className="space-y-6 lg:space-y-8"
                id="contact-form"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                  {/* Main Form */}
                  <div className="lg:col-span-2">
                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Card
                        className={`bg-gradient-to-br ${softPinkTheme.neoCard} border-0 ${softPinkTheme.glow} backdrop-blur-xl`}
                      >
                        {/* Form Header */}
                        <CardHeader className="text-center pb-6 lg:pb-8 border-b border-pink-100 px-4 lg:px-6">
                          <CardTitle className="flex flex-col sm:flex-row items-center justify-center gap-3 lg:gap-4 text-xl sm:text-2xl lg:text-3xl">
                            <motion.div
                              className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-gradient-to-r ${softPinkTheme.primaryGradient} flex items-center justify-center ${softPinkTheme.softGlow}`}
                              whileHover={{ scale: 1.1, rotate: 10 }}
                            >
                              <MessageCircle className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                            </motion.div>
                            <span
                              className={`bg-gradient-to-r ${softPinkTheme.heroText} bg-clip-text text-transparent text-center sm:text-left`}
                            >
                              Gửi tin nhắn cho chúng tôi
                            </span>
                          </CardTitle>
                          <p className="text-gray-600 mt-2 lg:mt-3 text-sm sm:text-base lg:text-lg px-2">
                            Điền thông tin bên dưới và chúng tôi sẽ phản hồi
                            theo đúng priority bạn chọn
                          </p>

                          {/* Form Progress */}
                          <div className="flex items-center justify-center gap-2 lg:gap-4 mt-4 lg:mt-6">
                            {[1, 2, 3].map((step) => (
                              <div
                                key={step}
                                className="flex items-center gap-1 lg:gap-2"
                              >
                                <motion.div
                                  className={`w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center text-xs lg:text-sm font-bold transition-all duration-300 ${
                                    step === formStep
                                      ? `bg-gradient-to-r ${softPinkTheme.primaryGradient} text-white ${softPinkTheme.softGlow} scale-110`
                                      : step < formStep
                                        ? "bg-green-500 text-white"
                                        : "bg-gray-200 text-gray-500"
                                  }`}
                                  whileHover={{ scale: 1.1 }}
                                >
                                  {step < formStep ? (
                                    <CheckIcon className="w-3 h-3 lg:w-4 lg:h-4" />
                                  ) : (
                                    step
                                  )}
                                </motion.div>
                                {step < 3 && (
                                  <div
                                    className={`w-8 lg:w-12 h-1 rounded-full transition-all duration-300 ${
                                      step < formStep
                                        ? "bg-green-500"
                                        : "bg-gray-200"
                                    }`}
                                  />
                                )}
                              </div>
                            ))}
                          </div>

                          <div className="text-xs sm:text-sm text-gray-600 mt-2">
                            Bước {formStep}/3:{" "}
                            {formStep === 1
                              ? "Thông tin cơ bản"
                              : formStep === 2
                                ? "Chi tiết liên hệ"
                                : "Xác nhận và gửi"}
                          </div>
                        </CardHeader>

                        <CardContent className="p-4 lg:p-8">
                          <AnimatePresence mode="wait">
                            {isSubmitted ? (
                              /* ✅ SUCCESS STATE */
                              <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, y: -50 }}
                                className="py-12 lg:py-16 text-center"
                              >
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{
                                    delay: 0.2,
                                    type: "spring",
                                    stiffness: 200,
                                  }}
                                >
                                  <CheckCircle className="w-16 h-16 lg:w-24 lg:h-24 mx-auto mb-6 lg:mb-8 text-green-500" />
                                </motion.div>

                                <h3 className="text-2xl lg:text-3xl font-bold mb-4 text-green-700">
                                  🎉 Tin nhắn đã được gửi thành công!
                                </h3>

                                <div className="max-w-md mx-auto space-y-4">
                                  <p className="text-base lg:text-lg text-gray-600">
                                    Cảm ơn bạn đã liên hệ với Template Market.
                                  </p>

                                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 lg:p-6">
                                    <div className="space-y-3 text-sm">
                                      <div className="flex items-center justify-between">
                                        <span>📧 Email xác nhận:</span>
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <span>⏱️ Thời gian phản hồi:</span>
                                        <span className="font-semibold text-green-600">
                                          {supportCategories.find(
                                            (c) => c.value === watchedCategory,
                                          )?.response || "< 24h"}
                                        </span>
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <span>👥 Team phụ trách:</span>
                                        <span className="font-semibold">
                                          {supportCategories.find(
                                            (c) => c.value === watchedCategory,
                                          )?.team || "Support Team"}
                                        </span>
                                      </div>
                                      <div className="flex items-center justify-between">
                                        <span>🎯 Độ ưu tiên:</span>
                                        <Badge
                                          className={
                                            priorityLevels.find(
                                              (p) =>
                                                p.value === watchedPriority,
                                            )?.color
                                          }
                                        >
                                          {
                                            priorityLevels.find(
                                              (p) =>
                                                p.value === watchedPriority,
                                            )?.label
                                          }
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                    <Button
                                      variant="outline"
                                      onClick={() => setIsSubmitted(false)}
                                      className="flex-1 text-sm"
                                    >
                                      <Send className="w-4 h-4 mr-2" />
                                      Gửi tin nhắn khác
                                    </Button>
                                    <Button
                                      onClick={() => setActiveTab("faq")}
                                      className={`flex-1 bg-gradient-to-r ${softPinkTheme.primaryGradient} text-sm`}
                                    >
                                      <HelpCircle className="w-4 h-4 mr-2" />
                                      Xem FAQ
                                    </Button>
                                  </div>
                                </div>
                              </motion.div>
                            ) : (
                              /* ✅ ENHANCED FORM STEPS - RESPONSIVE */
                              <motion.form
                                key="form"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onSubmit={handleSubmit(onSubmit)}
                                className="space-y-6 lg:space-y-8"
                              >
                                {/* Step 1: Basic Information */}
                                {formStep === 1 && (
                                  <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 100 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    className="space-y-4 lg:space-y-6"
                                  >
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                                      {/* Name Field */}
                                      <div className="space-y-2">
                                        <Label
                                          htmlFor="name"
                                          className="flex items-center gap-2 text-sm lg:text-base font-semibold text-gray-700"
                                        >
                                          <Users className="w-4 h-4 lg:w-5 lg:h-5 text-pink-500" />
                                          Họ và tên *
                                        </Label>
                                        <Input
                                          id="name"
                                          placeholder="Nguyễn Văn A"
                                          {...register("name")}
                                          className={`h-10 lg:h-12 transition-all duration-300 ${
                                            errors.name
                                              ? "border-red-500 bg-red-50"
                                              : "focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                                          }`}
                                        />
                                        {errors.name && (
                                          <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex items-center gap-2 text-sm text-red-500"
                                          >
                                            <AlertCircle className="w-4 h-4" />
                                            {errors.name.message}
                                          </motion.p>
                                        )}
                                      </div>

                                      {/* Email Field */}
                                      <div className="space-y-2">
                                        <Label
                                          htmlFor="email"
                                          className="flex items-center gap-2 text-sm lg:text-base font-semibold text-gray-700"
                                        >
                                          <Mail className="w-4 h-4 lg:w-5 lg:h-5 text-rose-500" />
                                          Email *
                                        </Label>
                                        <Input
                                          id="email"
                                          type="email"
                                          placeholder="example@email.com"
                                          {...register("email")}
                                          className={`h-10 lg:h-12 transition-all duration-300 ${
                                            errors.email
                                              ? "border-red-500 bg-red-50"
                                              : "focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                                          }`}
                                        />
                                        {errors.email && (
                                          <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex items-center gap-2 text-sm text-red-500"
                                          >
                                            <AlertCircle className="w-4 h-4" />
                                            {errors.email.message}
                                          </motion.p>
                                        )}
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                                      {/* Phone Field */}
                                      <div className="space-y-2">
                                        <Label
                                          htmlFor="phone"
                                          className="flex items-center gap-2 text-sm lg:text-base font-semibold text-gray-700"
                                        >
                                          <Phone className="w-4 h-4 lg:w-5 lg:h-5 text-red-500" />
                                          Số điện thoại
                                        </Label>
                                        <Input
                                          id="phone"
                                          placeholder="+84 971 386 588"
                                          {...register("phone")}
                                          className="h-10 lg:h-12 focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                                        />
                                        {errors.phone && (
                                          <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="flex items-center gap-2 text-sm text-red-500"
                                          >
                                            <AlertCircle className="w-4 h-4" />
                                            {errors.phone.message}
                                          </motion.p>
                                        )}
                                      </div>

                                      {/* Company Field */}
                                      <div className="space-y-2">
                                        <Label
                                          htmlFor="company"
                                          className="flex items-center gap-2 text-sm lg:text-base font-semibold text-gray-700"
                                        >
                                          <Building className="w-4 h-4 lg:w-5 lg:h-5 text-pink-600" />
                                          Công ty
                                        </Label>
                                        <Input
                                          id="company"
                                          placeholder="Tên công ty"
                                          {...register("company")}
                                          className="h-10 lg:h-12 focus:ring-2 focus:ring-pink-600/20 focus:border-pink-600"
                                        />
                                      </div>
                                    </div>
                                  </motion.div>
                                )}

                                {/* Step 2: Contact Details */}
                                {formStep === 2 && (
                                  <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 100 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    className="space-y-4 lg:space-y-6"
                                  >
                                    {/* Category Selection */}
                                    <div className="space-y-4">
                                      <Label className="flex items-center gap-2 text-sm lg:text-base font-semibold text-gray-700">
                                        <MessageSquare className="w-4 h-4 lg:w-5 lg:h-5 text-pink-500" />
                                        Danh mục hỗ trợ *
                                      </Label>
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {supportCategories.map((category) => (
                                          <motion.label
                                            key={category.value}
                                            className={`relative flex items-start gap-2 lg:gap-3 p-3 lg:p-4 border-2 rounded-lg lg:rounded-xl cursor-pointer transition-all duration-300 ${
                                              watchedCategory === category.value
                                                ? "border-pink-500 bg-pink-50"
                                                : "border-gray-200 hover:border-pink-300 hover:bg-gray-50"
                                            }`}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                          >
                                            <input
                                              type="radio"
                                              value={category.value}
                                              {...register("category")}
                                              className="sr-only"
                                            />
                                            <div
                                              className={`w-6 h-6 lg:w-8 lg:h-8 rounded-md lg:rounded-lg flex items-center justify-center ${
                                                watchedCategory ===
                                                category.value
                                                  ? "bg-pink-500 text-white"
                                                  : "bg-gray-100 text-gray-500"
                                              }`}
                                            >
                                              <category.icon className="w-3 h-3 lg:w-4 lg:h-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                              <div className="font-semibold text-sm mb-1">
                                                {category.label}
                                              </div>
                                              <div className="text-xs text-gray-600 mb-2 line-clamp-2">
                                                {category.description}
                                              </div>
                                              <div className="flex items-center justify-between">
                                                <Badge
                                                  variant="outline"
                                                  className="text-xs"
                                                >
                                                  {category.team}
                                                </Badge>
                                                <span className="text-xs font-medium text-green-600">
                                                  {category.response}
                                                </span>
                                              </div>
                                            </div>
                                          </motion.label>
                                        ))}
                                      </div>
                                      {errors.category && (
                                        <motion.p
                                          initial={{ opacity: 0, y: -10 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          className="flex items-center gap-2 text-sm text-red-500"
                                        >
                                          <AlertCircle className="w-4 h-4" />
                                          {errors.category.message}
                                        </motion.p>
                                      )}
                                    </div>

                                    {/* Subject Field */}
                                    <div className="space-y-2">
                                      <Label
                                        htmlFor="subject"
                                        className="flex items-center gap-2 text-sm lg:text-base font-semibold text-gray-700"
                                      >
                                        <MessageCircle className="w-4 h-4 lg:w-5 lg:h-5 text-rose-500" />
                                        Tiêu đề *
                                      </Label>
                                      <Input
                                        id="subject"
                                        placeholder="Mô tả ngắn gọn vấn đề cần hỗ trợ"
                                        {...register("subject")}
                                        className={`h-10 lg:h-12 transition-all duration-300 ${
                                          errors.subject
                                            ? "border-red-500 bg-red-50"
                                            : "focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                                        }`}
                                      />
                                      {errors.subject && (
                                        <motion.p
                                          initial={{ opacity: 0, y: -10 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          className="flex items-center gap-2 text-sm text-red-500"
                                        >
                                          <AlertCircle className="w-4 h-4" />
                                          {errors.subject.message}
                                        </motion.p>
                                      )}
                                    </div>
                                  </motion.div>
                                )}

                                {/* Step 3: Message & Confirmation */}
                                {formStep === 3 && (
                                  <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 100 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    className="space-y-4 lg:space-y-6"
                                  >
                                    {/* Message Field */}
                                    <div className="space-y-2">
                                      <Label
                                        htmlFor="message"
                                        className="flex items-center justify-between text-sm lg:text-base font-semibold text-gray-700"
                                      >
                                        <div className="flex items-center gap-2">
                                          <MessageSquare className="w-4 h-4 lg:w-5 lg:h-5 text-pink-500" />
                                          Nội dung chi tiết *
                                        </div>
                                        <span
                                          className={`text-xs ${
                                            messageLength > 2000
                                              ? "text-red-500"
                                              : messageLength > 1500
                                                ? "text-orange-500"
                                                : "text-gray-600"
                                          }`}
                                        >
                                          {messageLength}/2000
                                        </span>
                                      </Label>
                                      <Textarea
                                        id="message"
                                        placeholder="Mô tả chi tiết vấn đề, yêu cầu, hoặc câu hỏi của bạn. Càng chi tiết càng giúp chúng tôi hỗ trợ bạn tốt hơn..."
                                        rows={6}
                                        {...register("message")}
                                        className={`resize-none transition-all duration-300 ${
                                          errors.message
                                            ? "border-red-500 bg-red-50"
                                            : "focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                                        }`}
                                      />
                                      {errors.message && (
                                        <motion.p
                                          initial={{ opacity: 0, y: -10 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          className="flex items-center gap-2 text-sm text-red-500"
                                        >
                                          <AlertCircle className="w-4 h-4" />
                                          {errors.message.message}
                                        </motion.p>
                                      )}
                                    </div>

                                    {/* Checkboxes */}
                                    <div className="space-y-4 p-4 lg:p-6 bg-pink-50 rounded-lg lg:rounded-xl">
                                      <div className="flex items-start gap-3">
                                        <input
                                          type="checkbox"
                                          id="newsletter"
                                          {...register("newsletter")}
                                          className="mt-1 w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500"
                                        />
                                        <label
                                          htmlFor="newsletter"
                                          className="text-sm leading-relaxed text-gray-700"
                                        >
                                          Tôi muốn nhận newsletter và cập nhật
                                          về sản phẩm mới từ Template Market
                                        </label>
                                      </div>

                                      <div className="flex items-start gap-3">
                                        <input
                                          type="checkbox"
                                          id="terms"
                                          {...register("terms")}
                                          className="mt-1 w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500"
                                        />
                                        <label
                                          htmlFor="terms"
                                          className="text-sm leading-relaxed text-gray-700"
                                        >
                                          Tôi đồng ý với{" "}
                                          <a
                                            href="/terms"
                                            className="text-pink-600 hover:underline font-medium"
                                          >
                                            Điều khoản sử dụng
                                          </a>{" "}
                                          và{" "}
                                          <a
                                            href="/privacy"
                                            className="text-pink-600 hover:underline font-medium"
                                          >
                                            Chính sách bảo mật
                                          </a>{" "}
                                          của Template Market *
                                        </label>
                                      </div>
                                      {errors.terms && (
                                        <motion.p
                                          initial={{ opacity: 0, y: -10 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          className="flex items-center gap-2 text-sm text-red-500"
                                        >
                                          <AlertCircle className="w-4 h-4" />
                                          {errors.terms.message}
                                        </motion.p>
                                      )}
                                    </div>

                                    {/* Preview Summary */}
                                    <div className="p-4 lg:p-6 bg-pink-50 border border-pink-200 rounded-lg lg:rounded-xl">
                                      <h4 className="font-bold mb-4 flex items-center gap-2">
                                        <Eye className="w-4 h-4 lg:w-5 lg:h-5 text-pink-500" />
                                        Tóm tắt thông tin
                                      </h4>
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                        <div>
                                          <span className="font-medium">
                                            Danh mục:
                                          </span>{" "}
                                          <Badge
                                            variant="outline"
                                            className="ml-1"
                                          >
                                            {supportCategories.find(
                                              (c) =>
                                                c.value === watchedCategory,
                                            )?.label || "Chưa chọn"}
                                          </Badge>
                                        </div>
                                        <div>
                                          <span className="font-medium">
                                            Team xử lý:
                                          </span>{" "}
                                          <span className="text-pink-600">
                                            {supportCategories.find(
                                              (c) =>
                                                c.value === watchedCategory,
                                            )?.team || "Support Team"}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}

                                {/* Navigation Buttons */}
                                <div className="flex items-center justify-between pt-6 lg:pt-8 border-t border-pink-100">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handlePrevStep}
                                    disabled={formStep === 1}
                                    className="flex items-center gap-2 border-pink-200 text-sm lg:text-base"
                                  >
                                    <ArrowRight className="w-4 h-4 rotate-180" />
                                    <span className="hidden sm:inline">
                                      Quay lại
                                    </span>
                                    <span className="sm:hidden">Back</span>
                                  </Button>

                                  <div className="flex items-center gap-2">
                                    {[1, 2, 3].map((step) => (
                                      <button
                                        key={step}
                                        type="button"
                                        onClick={() => setFormStep(step)}
                                        className={`w-3 h-3 rounded-full transition-all ${
                                          step === formStep
                                            ? "bg-pink-500 scale-125"
                                            : step < formStep
                                              ? "bg-green-500"
                                              : "bg-gray-300"
                                        }`}
                                      />
                                    ))}
                                  </div>

                                  {formStep < 3 ? (
                                    <Button
                                      type="button"
                                      onClick={handleNextStep}
                                      className={`bg-gradient-to-r ${softPinkTheme.primaryGradient} hover:scale-105 transition-all text-sm lg:text-base`}
                                    >
                                      <span className="hidden sm:inline">
                                        Tiếp theo
                                      </span>
                                      <span className="sm:hidden">Next</span>
                                      <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                  ) : (
                                    <motion.div
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      <Button
                                        type="submit"
                                        disabled={isSubmitting || !isValid}
                                        className={`bg-gradient-to-r ${softPinkTheme.successGradient} px-6 lg:px-8 py-2 lg:py-3 text-sm lg:text-base`}
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
                                              className="w-4 h-4 lg:w-5 lg:h-5 mr-2 border-2 border-white border-t-transparent rounded-full"
                                            />
                                            <span className="hidden sm:inline">
                                              Đang gửi...
                                            </span>
                                            <span className="sm:hidden">
                                              Sending...
                                            </span>
                                          </>
                                        ) : (
                                          <>
                                            <Send className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                                            <span className="hidden sm:inline">
                                              Gửi tin nhắn
                                            </span>
                                            <span className="sm:hidden">
                                              Send
                                            </span>
                                            <Sparkles className="w-4 h-4 lg:w-5 lg:h-5 ml-2" />
                                          </>
                                        )}
                                      </Button>
                                    </motion.div>
                                  )}
                                </div>
                              </motion.form>
                            )}
                          </AnimatePresence>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>

                  {/* Sidebar - RESPONSIVE */}
                  <div className="space-y-6 lg:space-y-8">
                    {/* Office Hours */}
                    <motion.div
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Card
                        className={`bg-gradient-to-br ${softPinkTheme.floatingCard} border-0 ${softPinkTheme.softGlow} backdrop-blur-xl`}
                      >
                        <CardHeader className="pb-4">
                          <CardTitle className="flex items-center gap-2 text-gray-800 text-lg lg:text-xl">
                            <Clock className="w-4 h-4 lg:w-5 lg:h-5 text-pink-600" />
                            Giờ làm việc
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 lg:space-y-4">
                          {officeSchedule.slice(0, 4).map((schedule, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 rounded-lg bg-white/60"
                            >
                              <div>
                                <div className="font-medium text-sm">
                                  {schedule.day}
                                </div>
                                <div className="text-xs text-gray-600">
                                  {schedule.team}
                                </div>
                              </div>
                              <div className="text-right">
                                <div
                                  className={`text-sm font-medium ${schedule.available ? "text-green-600" : "text-red-500"}`}
                                >
                                  {schedule.hours}
                                </div>
                                <div className="flex items-center gap-1 justify-end">
                                  <div
                                    className={`w-2 h-2 rounded-full ${schedule.available ? "bg-green-500" : "bg-red-500"}`}
                                  />
                                  <span className="text-xs text-gray-600">
                                    {schedule.workload}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}

                          <Separator />

                          <div className="flex items-center gap-2 text-sm text-green-600 p-3 bg-green-50 rounded-lg">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="font-medium">
                              Hiện tại: Đang hoạt động
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Quick Support - RESPONSIVE BUTTONS */}
                    <motion.div
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Card
                        className={`bg-gradient-to-br ${softPinkTheme.floatingCard} border-0 ${softPinkTheme.softGlow} backdrop-blur-xl`}
                      >
                        <CardHeader className="pb-4">
                          <CardTitle className="flex items-center gap-2 text-gray-800 text-lg lg:text-xl">
                            <Zap className="w-4 h-4 lg:w-5 lg:h-5 text-rose-600" />
                            Hỗ trợ nhanh
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 lg:space-y-4">
                          {/* FIXED RESPONSIVE QUICK SUPPORT BUTTONS */}
                          <Button
                            variant="outline"
                            className="w-full justify-start bg-white/60 hover:bg-white border-pink-200 text-sm lg:text-base px-3 lg:px-4 py-2 h-auto min-h-[2.5rem]"
                            onClick={() =>
                              window.open("tel:+84971386588", "_self")
                            }
                          >
                            <Phone className="w-4 h-4 mr-2 lg:mr-3 text-pink-500 flex-shrink-0" />
                            <div className="text-left">
                              <div className="font-medium">Gọi ngay</div>
                              <div className="text-xs text-gray-500 truncate">
                                +84 971 386 588
                              </div>
                            </div>
                          </Button>

                          <Button
                            variant="outline"
                            className="w-full justify-start bg-white/60 hover:bg-white border-pink-200 text-sm lg:text-base px-3 lg:px-4 py-2 h-auto min-h-[2.5rem]"
                            onClick={() =>
                              window.open("mailto:support@templatemarket.com")
                            }
                          >
                            <Mail className="w-4 h-4 mr-2 lg:mr-3 text-rose-500 flex-shrink-0" />
                            <div className="text-left">
                              <div className="font-medium">Email</div>
                              <div className="text-xs text-gray-500 truncate">
                                support@templatemarket.com
                              </div>
                            </div>
                          </Button>

                          <Button
                            variant="outline"
                            className="w-full justify-start bg-white/60 hover:bg-white border-pink-200 text-sm lg:text-base px-3 lg:px-4 py-2 h-auto min-h-[2.5rem]"
                            onClick={() =>
                              toast({
                                title: "💬 Chat widget đang được kích hoạt...",
                              })
                            }
                          >
                            <MessageCircle className="w-4 h-4 mr-2 lg:mr-3 text-red-500 flex-shrink-0" />
                            <div className="text-left">
                              <div className="font-medium">Live Chat</div>
                              <div className="text-xs text-gray-500">
                                24/7 Online
                              </div>
                            </div>
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Current Testimonial */}
                    <motion.div
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Card
                        className={`bg-gradient-to-br ${softPinkTheme.floatingCard} border-0 ${softPinkTheme.softGlow} backdrop-blur-xl`}
                      >
                        <CardContent className="p-4 lg:p-6">
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={currentTestimonial}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              className="space-y-4"
                            >
                              <div className="flex items-center gap-1">
                                {[
                                  ...Array(
                                    testimonials[currentTestimonial].rating,
                                  ),
                                ].map((_, i) => (
                                  <Star
                                    key={i}
                                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                                  />
                                ))}
                              </div>
                              <blockquote className="text-sm italic text-gray-700 leading-relaxed">
                                "{testimonials[currentTestimonial].content}"
                              </blockquote>
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-10 h-10 bg-gradient-to-r ${softPinkTheme.primaryGradient} rounded-full flex items-center justify-center text-white text-lg`}
                                >
                                  {testimonials[currentTestimonial].avatar}
                                </div>
                                <div>
                                  <div className="font-semibold text-sm text-gray-800">
                                    {testimonials[currentTestimonial].name}
                                  </div>
                                  <div className="text-xs text-gray-600">
                                    {testimonials[currentTestimonial].position}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          </AnimatePresence>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>
                </div>
              </TabsContent>

              {/* ✅ ENHANCED FAQ TAB - RESPONSIVE */}
              <TabsContent value="faq" className="space-y-6 lg:space-y-8">
                <div className="max-w-4xl mx-auto">
                  {/* FAQ Categories */}
                  <div className="flex flex-wrap justify-center gap-2 lg:gap-4 mb-6 lg:mb-8">
                    {faqCategories.map((category, index) => (
                      <Button
                        key={index}
                        variant={
                          selectedFaqCategory === index ? "default" : "outline"
                        }
                        onClick={() => setSelectedFaqCategory(index)}
                        className={`text-xs lg:text-sm px-3 lg:px-4 py-2 lg:py-3 ${
                          selectedFaqCategory === index
                            ? `bg-gradient-to-r ${softPinkTheme.primaryGradient} text-white`
                            : "border-pink-200 hover:bg-pink-50"
                        }`}
                      >
                        {category.title}
                      </Button>
                    ))}
                  </div>

                  {/* FAQ Items */}
                  <div className="space-y-4">
                    {faqCategories[selectedFaqCategory].questions.map(
                      (faq, index) => (
                        <motion.div
                          key={`${selectedFaqCategory}-${index}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card
                            className={`bg-gradient-to-br ${softPinkTheme.neoCard} border-0 ${softPinkTheme.softGlow} backdrop-blur-xl hover:${softPinkTheme.glow} transition-all duration-300`}
                          >
                            <CardContent className="p-0">
                              <button
                                onClick={() =>
                                  setExpandedFaq(
                                    expandedFaq ===
                                      `${selectedFaqCategory}-${index}`
                                      ? null
                                      : `${selectedFaqCategory}-${index}`,
                                  )
                                }
                                className="w-full p-4 lg:p-6 text-left hover:bg-pink-50/50 transition-colors duration-300"
                              >
                                <div className="flex items-center justify-between">
                                  <h3 className="text-base lg:text-lg font-semibold pr-4 text-gray-800">
                                    {faq.q}
                                  </h3>
                                  <motion.div
                                    animate={{
                                      rotate:
                                        expandedFaq ===
                                        `${selectedFaqCategory}-${index}`
                                          ? 180
                                          : 0,
                                    }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    <ChevronDown className="w-5 h-5 text-gray-600 flex-shrink-0" />
                                  </motion.div>
                                </div>
                              </button>
                              <AnimatePresence>
                                {expandedFaq ===
                                  `${selectedFaqCategory}-${index}` && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden border-t border-pink-100"
                                  >
                                    <div className="p-4 lg:p-6 pt-4">
                                      <p className="text-sm lg:text-base text-gray-700 leading-relaxed">
                                        {faq.a}
                                      </p>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ),
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* ✅ ENHANCED SCHEDULE TAB - RESPONSIVE */}
              <TabsContent value="schedule" className="space-y-6 lg:space-y-8">
                <div className="max-w-6xl mx-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                    {officeSchedule.map((schedule, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5, scale: 1.02 }}
                      >
                        <Card
                          className={`h-full border-0 ${softPinkTheme.softGlow} transition-all duration-300 ${
                            schedule.available
                              ? `bg-gradient-to-br ${softPinkTheme.floatingCard}`
                              : "bg-gradient-to-br from-gray-50 to-red-50"
                          }`}
                        >
                          <CardContent className="p-4 lg:p-6 text-center">
                            <div
                              className={`w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-3 lg:mb-4 rounded-xl lg:rounded-2xl flex items-center justify-center ${
                                schedule.available
                                  ? `bg-gradient-to-r ${softPinkTheme.primaryGradient}`
                                  : "bg-gradient-to-r from-gray-500 to-red-500"
                              }`}
                            >
                              <Calendar className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                            </div>
                            <h3 className="text-lg lg:text-xl font-bold mb-2 text-gray-800">
                              {schedule.day}
                            </h3>
                            <p
                              className={`text-base lg:text-lg font-semibold mb-2 ${
                                schedule.available
                                  ? "text-pink-600"
                                  : "text-red-500"
                              }`}
                            >
                              {schedule.hours}
                            </p>
                            <Badge
                              variant="outline"
                              className="mb-2 border-pink-200 text-xs"
                            >
                              {schedule.team}
                            </Badge>
                            <div className="flex items-center justify-center gap-2 mt-3">
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  schedule.available
                                    ? "bg-green-500"
                                    : "bg-red-500"
                                } ${schedule.available ? "animate-pulse" : ""}`}
                              />
                              <span className="text-xs lg:text-sm text-gray-600">
                                Workload: {schedule.workload}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* ✅ ENHANCED SOCIAL MEDIA TAB - RESPONSIVE */}
              <TabsContent value="social" className="space-y-6 lg:space-y-8">
                <div className="max-w-6xl mx-auto">
                  <div className="text-center mb-8 lg:mb-12">
                    <h3
                      className={`text-2xl lg:text-3xl font-bold mb-4 bg-gradient-to-r ${softPinkTheme.heroText} bg-clip-text text-transparent`}
                    >
                      🌍 Kết nối với chúng tôi
                    </h3>
                    <p className="text-lg lg:text-xl text-gray-600">
                      Theo dõi Template Market trên các nền tảng xã hội để cập
                      nhật tin tức mới nhất
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
                    {socialPlatforms.map((platform, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                      >
                        <Card
                          className={`h-full bg-gradient-to-br ${softPinkTheme.neoCard} border-0 ${softPinkTheme.softGlow} backdrop-blur-xl hover:${softPinkTheme.glow} transition-all duration-300 group`}
                        >
                          <CardContent className="p-4 lg:p-6 text-center">
                            <motion.div
                              className={`w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-3 lg:mb-4 rounded-xl lg:rounded-2xl bg-gradient-to-r ${platform.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                              whileHover={{ rotate: 5 }}
                            >
                              <platform.icon className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                            </motion.div>
                            <h4 className="font-bold text-base lg:text-lg mb-2 text-gray-800">
                              {platform.label}
                            </h4>
                            <p className="text-xs lg:text-sm text-gray-600 mb-3">
                              {platform.users} users
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              className="w-full group-hover:bg-pink-500 group-hover:text-white group-hover:border-pink-500 transition-colors duration-300 border-pink-200 text-xs lg:text-sm"
                            >
                              <a
                                href={platform.href}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="w-3 h-3 lg:w-4 lg:h-4 mr-2" />
                                <span className="hidden sm:inline">
                                  Theo dõi
                                </span>
                                <span className="sm:hidden">Follow</span>
                              </a>
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* ✅ ENHANCED CTA SECTION - RESPONSIVE PINK THEME */}
        <section
          className={`relative px-4 py-16 lg:py-20 overflow-hidden bg-gradient-to-r ${softPinkTheme.primaryGradient}`}
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
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold">
                💬 Sẵn sàng kết nối?
              </h2>
              <p className="text-lg lg:text-xl opacity-90 leading-relaxed px-4">
                Đội ngũ Template Market luôn sẵn sàng hỗ trợ bạn{" "}
                <span className="font-bold">24/7</span> với tất cả các câu hỏi,
                yêu cầu kỹ thuật,
                <br className="hidden sm:block" />
                tư vấn sản phẩm và hợp tác kinh doanh.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 lg:gap-6">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto bg-white text-pink-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 px-6 lg:px-8 py-3 lg:py-4 text-sm lg:text-base"
                  onClick={() =>
                    document
                      .getElementById("contact-form")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  <MessageSquare className="w-5 h-5 lg:w-6 lg:h-6 mr-2 lg:mr-3" />
                  <span className="hidden sm:inline">Gửi tin nhắn ngay</span>
                  <span className="sm:hidden">Gửi tin nhắn</span>
                  <ArrowRight className="w-5 h-5 lg:w-6 lg:h-6 ml-2 lg:ml-3" />
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto text-white border-white hover:bg-white hover:text-pink-600 shadow-xl hover:shadow-2xl transition-all duration-300 px-6 lg:px-8 py-3 lg:py-4 text-sm lg:text-base"
                  onClick={() => window.open("tel:+84971386588", "_self")}
                >
                  <Phone className="w-5 h-5 lg:w-6 lg:h-6 mr-2 lg:mr-3" />
                  <span className="hidden sm:inline">
                    Hotline: +84 971 386 588
                  </span>
                  <span className="sm:hidden">+84 971 386 588</span>
                </Button>
              </div>

              {/* Contact Stats - RESPONSIVE */}
              <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-8 pt-6 lg:pt-8 opacity-80">
                <div className="text-center">
                  <div className="text-xl lg:text-2xl font-bold"> 30s</div>
                  <div className="text-xs lg:text-sm">Thời gian phản hồi</div>
                </div>
                <div className="text-center">
                  <div className="text-xl lg:text-2xl font-bold">24/7</div>
                  <div className="text-xs lg:text-sm">Hỗ trợ liên tục</div>
                </div>
                <div className="text-center">
                  <div className="text-xl lg:text-2xl font-bold">99.2%</div>
                  <div className="text-xs lg:text-sm">Khách hàng hài lòng</div>
                </div>
                <div className="text-center">
                  <div className="text-xl lg:text-2xl font-bold">
                    5 ngôn ngữ
                  </div>
                  <div className="text-xs lg:text-sm">Hỗ trợ đa ngôn ngữ</div>
                </div>
              </div>

              {/* Additional Contact Methods - RESPONSIVE */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4 pt-6 lg:pt-8">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex flex-col items-center gap-2 p-3 lg:p-4 rounded-lg lg:rounded-xl bg-white/10 backdrop-blur-sm"
                >
                  <Mail className="w-6 h-6 lg:w-8 lg:h-8" />
                  <span className="text-xs lg:text-sm font-medium">
                    Email Support
                  </span>
                  <span className="text-xs opacity-75 text-center">
                    support@templatemarket.com
                  </span>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex flex-col items-center gap-2 p-3 lg:p-4 rounded-lg lg:rounded-xl bg-white/10 backdrop-blur-sm"
                >
                  <MessageCircle className="w-6 h-6 lg:w-8 lg:h-8" />
                  <span className="text-xs lg:text-sm font-medium">
                    Live Chat
                  </span>
                  <span className="text-xs opacity-75">
                    Instantly available
                  </span>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex flex-col items-center gap-2 p-3 lg:p-4 rounded-lg lg:rounded-xl bg-white/10 backdrop-blur-sm"
                >
                  <MapPin className="w-6 h-6 lg:w-8 lg:h-8" />
                  <span className="text-xs lg:text-sm font-medium">Office</span>
                  <span className="text-xs opacity-75 text-center">
                    Hạ Long, Việt Nam
                  </span>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex flex-col items-center gap-2 p-3 lg:p-4 rounded-lg lg:rounded-xl bg-white/10 backdrop-blur-sm"
                >
                  <Globe className="w-6 h-6 lg:w-8 lg:h-8" />
                  <span className="text-xs lg:text-sm font-medium">
                    Social Media
                  </span>
                  <span className="text-xs opacity-75">Follow us</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </TooltipProvider>
  );
};

export default Contact;
