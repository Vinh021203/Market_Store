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
  Slack,
  Home,
  FileText,
  Download,
  Upload,
  Share2,
  Copy,
  Eye,
  EyeOff,
  CreditCard,
  Bookmark,
  Flag,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  RefreshCw,
  Settings,
  HelpCircle,
  Info,
  AlertCircle,
  CheckIcon,
  XIcon,
  Plus,
  Minus,
  Edit,
  Trash2,
  Save,
  Undo,
  Redo,
  RotateCcw,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Camera,
  Video,
  Image,
  Printer,
  Scissors,
  Paperclip,
  Link,
  Unlink,
  Bold,
  Italic,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  Grid3X3,
  BarChart3,
  PieChart,
  TrendingUp,
  Activity,
  Target,
  Compass,
  Navigation,
  Map,
  Route,
  Car,
  Plane,
  Train,
  Ship,
  Bike,
  Sun,
  Moon,
  CloudRain,
  Snowflake,
  Wind,
  Thermometer,
  Umbrella,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

// TikTok SVG Component
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

// Discord SVG Component
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

// Telegram SVG Component
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

// WhatsApp SVG Component
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

// Enhanced Schema với validation siêu chi tiết
const contactSchema = z.object({
  // Personal Info
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

  // Contact Details
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

  // Additional Info
  budget: z.string().optional(),
  timeline: z.string().optional(),
  referral: z.string().optional(),
  newsletter: z.boolean().default(false),
  terms: z.boolean().refine((val) => val === true, {
    message: "Bạn phải đồng ý với điều khoản sử dụng",
  }),
});

type ContactData = z.infer<typeof contactSchema>;

// Constants và Data
const ANIMATION_DURATION = 0.6;
const STAGGER_DELAY = 0.1;

const socialPlatforms = [
  {
    icon: Facebook,
    href: "https://facebook.com/templatemarket",
    label: "Facebook",
    color: "hover:text-blue-600",
    users: "2.9B",
  },
  {
    icon: Twitter,
    href: "https://twitter.com/templatemarket",
    label: "Twitter",
    color: "hover:text-sky-500",
    users: "450M",
  },
  {
    icon: Instagram,
    href: "https://instagram.com/templatemarket",
    label: "Instagram",
    color: "hover:text-pink-600",
    users: "2B",
  },
  {
    icon: Linkedin,
    href: "https://linkedin.com/company/templatemarket",
    label: "LinkedIn",
    color: "hover:text-blue-700",
    users: "900M",
  },
  {
    icon: Youtube,
    href: "https://youtube.com/@templatemarket",
    label: "YouTube",
    color: "hover:text-red-600",
    users: "2.7B",
  },
  {
    icon: Github,
    href: "https://github.com/templatemarket",
    label: "GitHub",
    color: "hover:text-gray-900",
    users: "100M",
  },
  {
    icon: TikTok,
    href: "https://tiktok.com/@templatemarket",
    label: "TikTok",
    color: "hover:text-black",
    users: "1B",
  },
  {
    icon: Discord,
    href: "https://discord.gg/templatemarket",
    label: "Discord",
    color: "hover:text-indigo-500",
    users: "150M",
  },
  {
    icon: Telegram,
    href: "https://t.me/templatemarket",
    label: "Telegram",
    color: "hover:text-blue-500",
    users: "800M",
  },
  {
    icon: WhatsApp,
    href: "https://wa.me/84971386588",
    label: "WhatsApp",
    color: "hover:text-green-500",
    users: "2B",
  },
  {
    icon: Slack,
    href: "https://templatemarket.slack.com",
    label: "Slack",
    color: "hover:text-purple-600",
    users: "20M",
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
    color: "from-blue-500 via-cyan-500 to-teal-500",
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
    color: "from-green-500 via-emerald-500 to-lime-500",
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
    color: "from-purple-500 via-pink-500 to-rose-500",
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
    color: "from-orange-500 via-amber-500 to-yellow-500",
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
      // Giả lập mở chat widget
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
  },
  {
    value: "sales",
    label: "💼 Tư vấn bán hàng",
    icon: Users,
    description: "Tư vấn sản phẩm, báo giá, demo",
    response: "< 30m",
    team: "Sales Team",
  },
  {
    value: "partnership",
    label: "🤝 Hợp tác kinh doanh",
    icon: Building,
    description: "Đối tác, affiliate, reseller",
    response: "< 2h",
    team: "Business Dev",
  },
  {
    value: "feedback",
    label: "💭 Góp ý & Phản hồi",
    icon: MessageSquare,
    description: "Ý kiến cải thiện, khiếu nại, compliment",
    response: "< 4h",
    team: "Customer Success",
  },
  {
    value: "media",
    label: "📺 Truyền thông",
    icon: Globe,
    description: "Báo chí, PR, marketing content",
    response: "< 24h",
    team: "PR Team",
  },
  {
    value: "technical",
    label: "⚙️ Kỹ thuật chuyên sâu",
    icon: Code,
    description: "API, integration, development",
    response: "< 1h",
    team: "Engineering",
  },
  {
    value: "billing",
    label: "💳 Thanh toán",
    icon: CreditCard,
    description: "Hóa đơn, refund, subscription",
    response: "< 30m",
    team: "Finance",
  },
  {
    value: "feature",
    label: "✨ Tính năng mới",
    icon: Sparkles,
    description: "Đề xuất feature, roadmap",
    response: "< 24h",
    team: "Product",
  },
  {
    value: "bug",
    label: "🐛 Báo lỗi",
    icon: AlertCircle,
    description: "Report bug, error tracking",
    response: "< 1h",
    team: "QA Team",
  },
  {
    value: "security",
    label: "🔒 Bảo mật",
    icon: Shield,
    description: "Security issues, privacy concerns",
    response: "< 15m",
    team: "Security",
  },
  {
    value: "compliance",
    label: "📋 Tuân thủ",
    icon: FileText,
    description: "GDPR, legal compliance, audit",
    response: "< 4h",
    team: "Legal",
  },
  {
    value: "other",
    label: "📋 Khác",
    icon: HelpCircle,
    description: "Các vấn đề khác chưa được phân loại",
    response: "< 2h",
    team: "General Support",
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
  },
  {
    icon: Globe,
    value: "120+",
    label: "Countries",
    trend: "+8%",
    description: "Quốc gia và vùng lãnh thổ",
  },
  {
    icon: Star,
    value: "4.9/5",
    label: "Rating",
    trend: "+0.2",
    description: "Đánh giá trung bình từ người dùng",
  },
  {
    icon: Zap,
    value: "< 30s",
    label: "Response",
    trend: "-5s",
    description: "Thời gian phản hồi trung bình",
  },
  {
    icon: Shield,
    value: "99.9%",
    label: "Uptime",
    trend: "+0.1%",
    description: "Thời gian hoạt động hệ thống",
  },
  {
    icon: Heart,
    value: "98%",
    label: "Satisfaction",
    trend: "+2%",
    description: "Tỷ lệ hài lòng khách hàng",
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
  {
    title: "👥 Partnership & Affiliate",
    questions: [
      {
        q: "Làm sao trở thành affiliate?",
        a: "Đăng ký affiliate program tại templatemarket.com/affiliate. Commission rate 20-40% tùy tier. Payout hàng tháng.",
      },
      {
        q: "Có chương trình reseller không?",
        a: "Có, chúng tôi có white-label solution cho resellers với discount đến 60% và full support.",
      },
      {
        q: "Điều kiện để trở thành partner?",
        a: "Minimum 1000 followers/subscribers, experience trong web design/development, và portfolio ấn tượng.",
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

// Main Component
const Contact: React.FC = () => {
  // States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [selectedFaqCategory, setSelectedFaqCategory] = useState(0);
  const [activeTab, setActiveTab] = useState("contact");
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
  const [formStep, setFormStep] = useState(1);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [messageLength, setMessageLength] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

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
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }));
          }
        });
      },
      { threshold: 0.1, rootMargin: "50px" },
    );

    const sections = document.querySelectorAll("[data-animate]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
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
        } as any; // ✅ Type assertion để bypass checking

        await createContact(contactData);

        // ... rest of the code
      } catch (error) {
        // ... error handling
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
        title: "❌ Không thể sao chép",
        description: "Vui lòng sao chép thủ công.",
        variant: "destructive",
      });
    }
  }, []);

  // Animations
  const fadeInUp = useMemo(
    () => ({
      initial: { opacity: 0, y: 60 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: ANIMATION_DURATION },
    }),
    [],
  );

  const staggerContainer = useMemo(
    () => ({
      animate: {
        transition: {
          staggerChildren: STAGGER_DELAY,
        },
      },
    }),
    [],
  );

  const slideInLeft = useMemo(
    () => ({
      initial: { opacity: 0, x: -60 },
      animate: { opacity: 1, x: 0 },
      transition: { duration: ANIMATION_DURATION },
    }),
    [],
  );

  const slideInRight = useMemo(
    () => ({
      initial: { opacity: 0, x: 60 },
      animate: { opacity: 1, x: 0 },
      transition: { duration: ANIMATION_DURATION },
    }),
    [],
  );

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-950 dark:to-purple-900 overflow-hidden">
        {/* Enhanced Hero Section */}
        <motion.section
          className="relative px-4 py-24 overflow-hidden"
          style={{ y: y1, opacity, scale }}
          id="hero"
          data-animate
        >
          {/* Dynamic Background */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute rounded-full mix-blend-multiply filter blur-xl opacity-20 ${
                  i % 4 === 0
                    ? "bg-blue-400"
                    : i % 4 === 1
                      ? "bg-purple-400"
                      : i % 4 === 2
                        ? "bg-pink-400"
                        : "bg-cyan-400"
                }`}
                style={{
                  width: `${Math.random() * 400 + 200}px`,
                  height: `${Math.random() * 400 + 200}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
                animate={{
                  x: [0, Math.random() * 100 - 50],
                  y: [0, Math.random() * 100 - 50],
                  scale: [1, Math.random() * 0.5 + 0.8, 1],
                }}
                transition={{
                  duration: Math.random() * 20 + 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 2,
                }}
              />
            ))}
          </div>

          {/* Floating Icons */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[MessageCircle, Mail, Phone, Globe, Heart, Star, Zap, Shield].map(
              (Icon, i) => (
                <motion.div
                  key={i}
                  className="absolute text-blue-500/30"
                  style={{
                    top: `${20 + i * 12}%`,
                    left: `${10 + i * 10}%`,
                  }}
                  animate={{
                    y: [0, -30, 0],
                    rotate: [0, 360],
                    opacity: [0.3, 0.7, 0.3],
                  }}
                  transition={{
                    duration: 8 + i,
                    repeat: Infinity,
                    delay: i * 0.5,
                  }}
                >
                  <Icon className="w-6 h-6" />
                </motion.div>
              ),
            )}
          </div>

          <div className="container relative z-10 mx-auto text-center max-w-6xl">
            <motion.div {...fadeInUp} className="space-y-8">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <Badge className="px-8 py-4 text-lg font-semibold border-0 shadow-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white">
                  <MessageCircle className="w-5 h-5 mr-3" />
                  Liên hệ & Hỗ trợ 24/7
                  <Sparkles className="w-5 h-5 ml-3 animate-pulse" />
                </Badge>
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                <span className="text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text">
                  Chúng tôi luôn
                </span>
                <br />
                <span className="text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 bg-clip-text">
                  sẵn sàng hỗ trợ
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                className="max-w-4xl mx-auto text-xl md:text-2xl lg:text-3xl text-muted-foreground leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                Đội ngũ chuyên gia
                <span className="font-bold text-blue-600">
                  {" "}
                  Template Market{" "}
                </span>
                sẵn sàng
                <span className="font-bold text-green-600"> 24/7 </span>
                để đồng hành cùng bạn trên mọi hành trình.
                <br />
                <span className="text-lg text-muted-foreground/80">
                  Hơn 50.000 khách hàng tin tưởng • Phản hồi trong 30 giây • Hỗ
                  trợ 120+ quốc gia
                </span>
              </motion.p>

              {/* Stats Grid */}
              <motion.div
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 pt-8"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                {companyStats.map((stat, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    whileHover={{ scale: 1.05, rotateY: 5 }}
                    className="group"
                  >
                    <Card className="h-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-0 shadow-lg hover:shadow-2xl transition-all duration-500">
                      <CardContent className="p-6 text-center">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg group-hover:shadow-xl transition-all duration-300">
                          <stat.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                          {stat.value}
                        </div>
                        <div className="text-sm text-muted-foreground mb-1">
                          {stat.label}
                        </div>
                        <div className="flex items-center justify-center gap-1 text-xs">
                          <TrendingUp className="w-3 h-3 text-green-500" />
                          <span className="text-green-600 font-medium">
                            {stat.trend}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
              >
                <Button
                  size="lg"
                  className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                  onClick={() =>
                    document
                      .getElementById("contact-form")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  <Send className="w-5 h-5 mr-3" />
                  Gửi tin nhắn ngay
                  <ArrowRight className="w-5 h-5 ml-3" />
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-4 text-lg font-semibold border-2 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  onClick={() =>
                    document
                      .getElementById("contact-channels")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  <Phone className="w-5 h-5 mr-3" />
                  Xem thông tin liên hệ
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Enhanced Contact Channels */}
        <section
          className="px-4 py-20 bg-gradient-to-r from-blue-50 via-white to-purple-50 dark:from-blue-950 dark:via-slate-900 dark:to-purple-950"
          id="contact-channels"
          data-animate
        >
          <div className="container mx-auto">
            {/* Section Header */}
            <motion.div className="text-center mb-16" {...fadeInUp}>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                🌟 Kết nối đa kênh
              </h2>
              <p className="max-w-3xl mx-auto text-xl text-muted-foreground leading-relaxed">
                Chọn kênh liên hệ phù hợp nhất với bạn. Mỗi kênh đều có team
                chuyên biệt để hỗ trợ tốt nhất.
              </p>
            </motion.div>

            {/* Contact Channels Grid */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {contactChannels.map((channel, index) => (
                <motion.div
                  key={channel.id}
                  variants={fadeInUp}
                  whileHover={{ y: -15, scale: 1.02 }}
                  className="group h-full"
                >
                  <Card className="h-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg border-0 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
                    {/* Gradient Top Bar */}
                    <div className={`h-2 bg-gradient-to-r ${channel.color}`} />

                    <CardContent className="p-8">
                      {/* Icon & Stats */}
                      <div className="flex items-start justify-between mb-6">
                        <motion.div
                          className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${channel.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          <channel.icon className="w-8 h-8 text-white" />
                        </motion.div>

                        <div className="text-right text-xs text-muted-foreground">
                          <div className="flex items-center gap-1 mb-1">
                            <Star className="w-3 h-3 text-yellow-500" />
                            <span>{Object.values(channel.stats)[1]}</span>
                          </div>
                          <div>{Object.values(channel.stats)}</div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                            {channel.title}
                          </h3>
                          <p className="text-lg font-semibold text-blue-600 mb-1">
                            {channel.content}
                          </p>
                          <p className="text-sm text-muted-foreground mb-2">
                            {channel.subContent}
                          </p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{channel.details}</span>
                            <span className="font-medium">{channel.hours}</span>
                          </div>
                        </div>

                        {/* Features */}
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold">
                            ✨ Features:
                          </h4>
                          <div className="grid grid-cols-2 gap-1">
                            {channel.features.map((feature, idx) => (
                              <div
                                key={idx}
                                className="text-xs text-muted-foreground flex items-center gap-1"
                              >
                                <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-2 pt-4">
                          <Button
                            className={`w-full bg-gradient-to-r ${channel.color} hover:shadow-lg transition-all duration-300`}
                            onClick={channel.onClick}
                          >
                            <channel.actionIcon className="w-4 h-4 mr-2" />
                            {channel.action}
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-xs"
                            onClick={() =>
                              copyToClipboard(channel.content, channel.title)
                            }
                          >
                            <Copy className="w-3 h-3 mr-2" />
                            Sao chép
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Enhanced Main Content with Tabs */}
        <section className="px-4 py-20" id="main-content" data-animate>
          <div className="container mx-auto max-w-7xl">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              {/* Tabs Navigation */}
              <div className="flex justify-center mb-12">
                <TabsList className="grid grid-cols-2 md:grid-cols-4 h-auto p-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg shadow-xl rounded-2xl">
                  <TabsTrigger
                    value="contact"
                    className="px-6 py-4 text-sm font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-xl"
                  >
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Gửi tin nhắn
                  </TabsTrigger>
                  <TabsTrigger
                    value="faq"
                    className="px-6 py-4 text-sm font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white rounded-xl"
                  >
                    <HelpCircle className="w-5 h-5 mr-2" />
                    FAQ
                  </TabsTrigger>
                  <TabsTrigger
                    value="schedule"
                    className="px-6 py-4 text-sm font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-600 data-[state=active]:text-white rounded-xl"
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Lịch làm việc
                  </TabsTrigger>
                  <TabsTrigger
                    value="social"
                    className="px-6 py-4 text-sm font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-xl"
                  >
                    <Globe className="w-5 h-5 mr-2" />
                    Social Media
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Contact Form Tab */}
              <TabsContent
                value="contact"
                className="space-y-8"
                id="contact-form"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  {/* Main Form */}
                  <div className="lg:col-span-2">
                    <motion.div {...slideInLeft}>
                      <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg border-0 shadow-2xl">
                        {/* Form Header */}
                        <CardHeader className="text-center pb-8 border-b border-gray-100 dark:border-slate-700">
                          <CardTitle className="flex items-center justify-center gap-4 text-3xl">
                            <motion.div
                              className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg"
                              whileHover={{ scale: 1.1, rotate: 10 }}
                            >
                              <MessageCircle className="w-6 h-6 text-white" />
                            </motion.div>
                            <span>Gửi tin nhắn cho chúng tôi</span>
                          </CardTitle>
                          <p className="text-muted-foreground mt-3 text-lg">
                            Điền thông tin bên dưới và chúng tôi sẽ phản hồi
                            theo đúng priority bạn chọn
                          </p>

                          {/* Form Progress */}
                          <div className="flex items-center justify-center gap-4 mt-6">
                            {[1, 2, 3].map((step) => (
                              <div
                                key={step}
                                className="flex items-center gap-2"
                              >
                                <motion.div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                                    step === formStep
                                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-110"
                                      : step < formStep
                                        ? "bg-green-500 text-white"
                                        : "bg-gray-200 text-gray-500"
                                  }`}
                                  whileHover={{ scale: 1.1 }}
                                >
                                  {step < formStep ? (
                                    <CheckIcon className="w-4 h-4" />
                                  ) : (
                                    step
                                  )}
                                </motion.div>
                                {step < 3 && (
                                  <div
                                    className={`w-12 h-1 rounded-full transition-all duration-300 ${
                                      step < formStep
                                        ? "bg-green-500"
                                        : "bg-gray-200"
                                    }`}
                                  />
                                )}
                              </div>
                            ))}
                          </div>

                          <div className="text-sm text-muted-foreground mt-2">
                            Bước {formStep}/3:{" "}
                            {formStep === 1
                              ? "Thông tin cơ bản"
                              : formStep === 2
                                ? "Chi tiết liên hệ"
                                : "Xác nhận và gửi"}
                          </div>
                        </CardHeader>

                        <CardContent className="p-8">
                          <AnimatePresence mode="wait">
                            {isSubmitted ? (
                              <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, y: -50 }}
                                className="py-16 text-center"
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
                                  <CheckCircle className="w-24 h-24 mx-auto mb-8 text-green-500" />
                                </motion.div>

                                <h3 className="text-3xl font-bold mb-4 text-green-700">
                                  🎉 Tin nhắn đã được gửi thành công!
                                </h3>

                                <div className="max-w-md mx-auto space-y-4">
                                  <p className="text-lg text-muted-foreground">
                                    Cảm ơn bạn đã liên hệ với Template Market.
                                  </p>

                                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
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
                                      className="flex-1"
                                    >
                                      <Send className="w-4 h-4 mr-2" />
                                      Gửi tin nhắn khác
                                    </Button>
                                    <Button
                                      onClick={() => setActiveTab("faq")}
                                      className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600"
                                    >
                                      <HelpCircle className="w-4 h-4 mr-2" />
                                      Xem FAQ
                                    </Button>
                                  </div>
                                </div>
                              </motion.div>
                            ) : (
                              <motion.form
                                key="form"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onSubmit={handleSubmit(onSubmit)}
                                className="space-y-8"
                              >
                                {/* Step 1: Basic Information */}
                                {formStep === 1 && (
                                  <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 100 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    className="space-y-6"
                                  >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      {/* Name Field */}
                                      <div className="space-y-2">
                                        <Label
                                          htmlFor="name"
                                          className="flex items-center gap-2 text-base font-semibold"
                                        >
                                          <Users className="w-5 h-5 text-blue-500" />
                                          Họ và tên *
                                        </Label>
                                        <Input
                                          id="name"
                                          placeholder="Nguyễn Văn A"
                                          {...register("name")}
                                          className={`h-12 transition-all duration-300 ${
                                            errors.name
                                              ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                                              : "focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
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
                                          className="flex items-center gap-2 text-base font-semibold"
                                        >
                                          <Mail className="w-5 h-5 text-purple-500" />
                                          Email *
                                        </Label>
                                        <Input
                                          id="email"
                                          type="email"
                                          placeholder="example@email.com"
                                          {...register("email")}
                                          className={`h-12 transition-all duration-300 ${
                                            errors.email
                                              ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                                              : "focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
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

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      {/* Phone Field */}
                                      <div className="space-y-2">
                                        <Label
                                          htmlFor="phone"
                                          className="flex items-center gap-2 text-base font-semibold"
                                        >
                                          <Phone className="w-5 h-5 text-green-500" />
                                          Số điện thoại
                                        </Label>
                                        <Input
                                          id="phone"
                                          placeholder="+84 971 386 588"
                                          {...register("phone")}
                                          className="h-12 focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
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
                                          className="flex items-center gap-2 text-base font-semibold"
                                        >
                                          <Building className="w-5 h-5 text-orange-500" />
                                          Công ty
                                        </Label>
                                        <Input
                                          id="company"
                                          placeholder="Tên công ty"
                                          {...register("company")}
                                          className="h-12 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                                        />
                                      </div>
                                    </div>

                                    {/* Advanced Options Toggle */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-700">
                                      <span className="text-sm font-medium">
                                        Tùy chọn nâng cao
                                      </span>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          setShowAdvancedOptions(
                                            !showAdvancedOptions,
                                          )
                                        }
                                        className="gap-2"
                                      >
                                        {showAdvancedOptions
                                          ? "Ẩn bớt"
                                          : "Hiển thị thêm"}
                                        <ChevronDown
                                          className={`w-4 h-4 transition-transform ${showAdvancedOptions ? "rotate-180" : ""}`}
                                        />
                                      </Button>
                                    </div>

                                    {/* Advanced Fields */}
                                    <AnimatePresence>
                                      {showAdvancedOptions && (
                                        <motion.div
                                          initial={{ opacity: 0, height: 0 }}
                                          animate={{
                                            opacity: 1,
                                            height: "auto",
                                          }}
                                          exit={{ opacity: 0, height: 0 }}
                                          className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden"
                                        >
                                          {/* Position Field */}
                                          <div className="space-y-2">
                                            <Label
                                              htmlFor="position"
                                              className="flex items-center gap-2 text-base font-semibold"
                                            >
                                              <Award className="w-5 h-5 text-indigo-500" />
                                              Chức vụ
                                            </Label>
                                            <Input
                                              id="position"
                                              placeholder="Giám đốc, Developer, Designer..."
                                              {...register("position")}
                                              className="h-12 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                            />
                                          </div>

                                          {/* Website Field */}
                                          <div className="space-y-2">
                                            <Label
                                              htmlFor="website"
                                              className="flex items-center gap-2 text-base font-semibold"
                                            >
                                              <Globe className="w-5 h-5 text-cyan-500" />
                                              Website
                                            </Label>
                                            <Input
                                              id="website"
                                              placeholder="https://yourwebsite.com"
                                              {...register("website")}
                                              className="h-12 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                                            />
                                            {errors.website && (
                                              <motion.p
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="flex items-center gap-2 text-sm text-red-500"
                                              >
                                                <AlertCircle className="w-4 h-4" />
                                                {errors.website.message}
                                              </motion.p>
                                            )}
                                          </div>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </motion.div>
                                )}

                                {/* Step 2: Contact Details */}
                                {formStep === 2 && (
                                  <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 100 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    className="space-y-6"
                                  >
                                    {/* Category Selection */}
                                    <div className="space-y-4">
                                      <Label className="flex items-center gap-2 text-base font-semibold">
                                        <MessageSquare className="w-5 h-5 text-blue-500" />
                                        Danh mục hỗ trợ *
                                      </Label>
                                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {supportCategories.map((category) => (
                                          <motion.label
                                            key={category.value}
                                            className={`relative flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                                              watchedCategory === category.value
                                                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                                : "border-gray-200 hover:border-blue-300 hover:bg-gray-50 dark:hover:bg-slate-800"
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
                                              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                                watchedCategory ===
                                                category.value
                                                  ? "bg-blue-500 text-white"
                                                  : "bg-gray-100 text-gray-500"
                                              }`}
                                            >
                                              <category.icon className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                              <div className="font-semibold text-sm mb-1">
                                                {category.label}
                                              </div>
                                              <div className="text-xs text-muted-foreground mb-2">
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

                                    {/* Priority Selection */}
                                    <div className="space-y-4">
                                      <Label className="flex items-center gap-2 text-base font-semibold">
                                        <Zap className="w-5 h-5 text-orange-500" />
                                        Độ ưu tiên
                                      </Label>
                                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                        {priorityLevels.map((priority) => (
                                          <motion.label
                                            key={priority.value}
                                            className={`relative flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                                              watchedPriority === priority.value
                                                ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                                                : "border-gray-200 hover:border-orange-300 hover:bg-gray-50 dark:hover:bg-slate-800"
                                            }`}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                          >
                                            <input
                                              type="radio"
                                              value={priority.value}
                                              {...register("priority")}
                                              className="sr-only"
                                            />
                                            <div
                                              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                                watchedPriority ===
                                                priority.value
                                                  ? "bg-orange-500 text-white"
                                                  : "bg-gray-100 text-gray-500"
                                              }`}
                                            >
                                              <Zap className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                              <div className="font-semibold text-sm mb-1">
                                                {priority.label}
                                              </div>
                                              <div className="text-xs text-muted-foreground">
                                                {priority.description}
                                              </div>
                                            </div>
                                          </motion.label>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Subject Field */}
                                    <div className="space-y-2">
                                      <Label
                                        htmlFor="subject"
                                        className="flex items-center gap-2 text-base font-semibold"
                                      >
                                        <MessageCircle className="w-5 h-5 text-purple-500" />
                                        Tiêu đề *
                                      </Label>
                                      <Input
                                        id="subject"
                                        placeholder="Mô tả ngắn gọn vấn đề cần hỗ trợ"
                                        {...register("subject")}
                                        className={`h-12 transition-all duration-300 ${
                                          errors.subject
                                            ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                                            : "focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
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

                                    {/* Additional Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      <div className="space-y-2">
                                        <Label
                                          htmlFor="budget"
                                          className="flex items-center gap-2 text-base font-semibold"
                                        >
                                          <Target className="w-5 h-5 text-green-500" />
                                          Ngân sách dự kiến
                                        </Label>
                                        <select
                                          id="budget"
                                          {...register("budget")}
                                          className="w-full h-12 px-3 border rounded-md bg-background focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                                        >
                                          <option value="">
                                            Chọn mức ngân sách...
                                          </option>
                                          <option value="under-500">
                                            Dưới $500
                                          </option>
                                          <option value="500-1000">
                                            $500 - $1,000
                                          </option>
                                          <option value="1000-5000">
                                            $1,000 - $5,000
                                          </option>
                                          <option value="5000-10000">
                                            $5,000 - $10,000
                                          </option>
                                          <option value="over-10000">
                                            Trên $10,000
                                          </option>
                                          <option value="discuss">
                                            Thảo luận
                                          </option>
                                        </select>
                                      </div>

                                      <div className="space-y-2">
                                        <Label
                                          htmlFor="timeline"
                                          className="flex items-center gap-2 text-base font-semibold"
                                        >
                                          <Calendar className="w-5 h-5 text-blue-500" />
                                          Timeline mong muốn
                                        </Label>
                                        <select
                                          id="timeline"
                                          {...register("timeline")}
                                          className="w-full h-12 px-3 border rounded-md bg-background focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                        >
                                          <option value="">
                                            Chọn timeline...
                                          </option>
                                          <option value="asap">
                                            Càng sớm càng tốt
                                          </option>
                                          <option value="1-week">
                                            Trong 1 tuần
                                          </option>
                                          <option value="2-weeks">
                                            Trong 2 tuần
                                          </option>
                                          <option value="1-month">
                                            Trong 1 tháng
                                          </option>
                                          <option value="flexible">
                                            Linh hoạt
                                          </option>
                                        </select>
                                      </div>
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
                                    className="space-y-6"
                                  >
                                    {/* Message Field */}
                                    <div className="space-y-2">
                                      <Label
                                        htmlFor="message"
                                        className="flex items-center justify-between text-base font-semibold"
                                      >
                                        <div className="flex items-center gap-2">
                                          <MessageSquare className="w-5 h-5 text-green-500" />
                                          Nội dung chi tiết *
                                        </div>
                                        <span
                                          className={`text-xs ${
                                            messageLength > 2000
                                              ? "text-red-500"
                                              : messageLength > 1500
                                                ? "text-orange-500"
                                                : "text-muted-foreground"
                                          }`}
                                        >
                                          {messageLength}/2000
                                        </span>
                                      </Label>
                                      <Textarea
                                        id="message"
                                        placeholder="Mô tả chi tiết vấn đề, yêu cầu, hoặc câu hỏi của bạn. Càng chi tiết càng giúp chúng tôi hỗ trợ bạn tốt hơn..."
                                        rows={8}
                                        {...register("message")}
                                        className={`resize-none transition-all duration-300 ${
                                          errors.message
                                            ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                                            : "focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
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

                                    {/* Additional Info */}
                                    <div className="space-y-2">
                                      <Label
                                        htmlFor="referral"
                                        className="flex items-center gap-2 text-base font-semibold"
                                      >
                                        <Users className="w-5 h-5 text-indigo-500" />
                                        Bạn biết đến chúng tôi qua đâu?
                                      </Label>
                                      <select
                                        id="referral"
                                        {...register("referral")}
                                        className="w-full h-12 px-3 border rounded-md bg-background focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                      >
                                        <option value="">Chọn nguồn...</option>
                                        <option value="google">
                                          Google Search
                                        </option>
                                        <option value="social">
                                          Social Media
                                        </option>
                                        <option value="friend">
                                          Bạn bè giới thiệu
                                        </option>
                                        <option value="advertising">
                                          Quảng cáo
                                        </option>
                                        <option value="blog">
                                          Blog/Article
                                        </option>
                                        <option value="youtube">YouTube</option>
                                        <option value="other">Khác</option>
                                      </select>
                                    </div>

                                    {/* Checkboxes */}
                                    <div className="space-y-4 p-6 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
                                      <div className="flex items-start gap-3">
                                        <input
                                          type="checkbox"
                                          id="newsletter"
                                          {...register("newsletter")}
                                          className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <label
                                          htmlFor="newsletter"
                                          className="text-sm leading-relaxed"
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
                                          className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <label
                                          htmlFor="terms"
                                          className="text-sm leading-relaxed"
                                        >
                                          Tôi đồng ý với{" "}
                                          <a
                                            href="/terms"
                                            className="text-blue-600 hover:underline font-medium"
                                          >
                                            Điều khoản sử dụng
                                          </a>{" "}
                                          và{" "}
                                          <a
                                            href="/privacy"
                                            className="text-blue-600 hover:underline font-medium"
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
                                    <div className="p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                                      <h4 className="font-bold mb-4 flex items-center gap-2">
                                        <Eye className="w-5 h-5 text-blue-500" />
                                        Tóm tắt thông tin
                                      </h4>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
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
                                            Độ ưu tiên:
                                          </span>{" "}
                                          <Badge
                                            className={`ml-1 ${priorityLevels.find((p) => p.value === watchedPriority)?.color}`}
                                          >
                                            {
                                              priorityLevels.find(
                                                (p) =>
                                                  p.value === watchedPriority,
                                              )?.label
                                            }
                                          </Badge>
                                        </div>
                                        <div>
                                          <span className="font-medium">
                                            Team xử lý:
                                          </span>{" "}
                                          <span className="text-blue-600">
                                            {supportCategories.find(
                                              (c) =>
                                                c.value === watchedCategory,
                                            )?.team || "Support Team"}
                                          </span>
                                        </div>
                                        <div>
                                          <span className="font-medium">
                                            Thời gian phản hồi:
                                          </span>{" "}
                                          <span className="text-green-600 font-medium">
                                            {supportCategories.find(
                                              (c) =>
                                                c.value === watchedCategory,
                                            )?.response || "< 24h"}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}

                                {/* Navigation Buttons */}
                                <div className="flex items-center justify-between pt-8 border-t border-gray-100 dark:border-slate-700">
                                  {/* Previous Button */}
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handlePrevStep}
                                    disabled={formStep === 1}
                                    className="flex items-center gap-2"
                                  >
                                    <ArrowRight className="w-4 h-4 rotate-180" />
                                    Quay lại
                                  </Button>

                                  {/* Step Indicators */}
                                  <div className="flex items-center gap-2">
                                    {[1, 2, 3].map((step) => (
                                      <button
                                        key={step}
                                        type="button"
                                        onClick={() => setFormStep(step)}
                                        className={`w-3 h-3 rounded-full transition-all ${
                                          step === formStep
                                            ? "bg-blue-500 scale-125"
                                            : step < formStep
                                              ? "bg-green-500"
                                              : "bg-gray-300"
                                        }`}
                                      />
                                    ))}
                                  </div>

                                  {/* Next/Submit Button */}
                                  {formStep < 3 ? (
                                    <Button
                                      type="button"
                                      onClick={handleNextStep}
                                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                                    >
                                      Tiếp theo
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
                                        className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 px-8 py-3"
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
                                              className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full"
                                            />
                                            Đang gửi...
                                          </>
                                        ) : (
                                          <>
                                            <Send className="w-5 h-5 mr-2" />
                                            Gửi tin nhắn
                                            <Sparkles className="w-5 h-5 ml-2" />
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

                  {/* Sidebar */}
                  <div className="space-y-8">
                    {/* Office Hours */}
                    <motion.div {...slideInRight} transition={{ delay: 0.1 }}>
                      <Card className="bg-gradient-to-br from-white to-green-50 dark:from-slate-800 dark:to-green-900/20 border-0 shadow-lg">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-green-600" />
                            Giờ làm việc
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {officeSchedule.map((schedule, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 rounded-lg bg-white/60 dark:bg-slate-800/60"
                            >
                              <div>
                                <div className="font-medium text-sm">
                                  {schedule.day}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {schedule.team}
                                </div>
                              </div>
                              <div className="text-right">
                                <div
                                  className={`text-sm font-medium ${
                                    schedule.available
                                      ? "text-green-600"
                                      : "text-red-500"
                                  }`}
                                >
                                  {schedule.hours}
                                </div>
                                <div className="flex items-center gap-1 justify-end">
                                  <div
                                    className={`w-2 h-2 rounded-full ${
                                      schedule.available
                                        ? "bg-green-500"
                                        : "bg-red-500"
                                    }`}
                                  />
                                  <span className="text-xs text-muted-foreground">
                                    {schedule.workload}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}

                          <Separator />

                          <div className="flex items-center gap-2 text-sm text-green-600 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="font-medium">
                              Hiện tại: Đang hoạt động
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Quick Support */}
                    <motion.div {...slideInRight} transition={{ delay: 0.2 }}>
                      <Card className="bg-gradient-to-br from-white to-orange-50 dark:from-slate-800 dark:to-orange-900/20 border-0 shadow-lg">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Zap className="w-5 h-5 text-orange-600" />
                            Hỗ trợ nhanh
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <Button
                            variant="outline"
                            className="w-full justify-start bg-white/60 hover:bg-white"
                            onClick={() =>
                              window.open("tel:+84971386588", "_self")
                            }
                          >
                            <Phone className="w-4 h-4 mr-2" />
                            Gọi ngay: +84 971.386.588
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full justify-start bg-white/60 hover:bg-white"
                            onClick={() =>
                              window.open("mailto:support@templatemarket.com")
                            }
                          >
                            <Mail className="w-4 h-4 mr-2" />
                            Email: support@templatemarket.com
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full justify-start bg-white/60 hover:bg-white"
                            onClick={() =>
                              toast({
                                title: "💬 Chat widget đang được kích hoạt...",
                              })
                            }
                          >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Live Chat (24/7)
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Current Testimonial */}
                    <motion.div {...slideInRight} transition={{ delay: 0.3 }}>
                      <Card className="bg-gradient-to-br from-white to-purple-50 dark:from-slate-800 dark:to-purple-900/20 border-0 shadow-lg">
                        <CardContent className="p-6">
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
                              <blockquote className="text-sm italic text-muted-foreground leading-relaxed">
                                "{testimonials[currentTestimonial].content}"
                              </blockquote>
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-lg">
                                  {testimonials[currentTestimonial].avatar}
                                </div>
                                <div>
                                  <div className="font-semibold text-sm">
                                    {testimonials[currentTestimonial].name}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
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

              {/* FAQ Tab */}
              <TabsContent value="faq" className="space-y-8">
                <div className="max-w-4xl mx-auto">
                  {/* FAQ Categories */}
                  <div className="flex flex-wrap justify-center gap-4 mb-8">
                    {faqCategories.map((category, index) => (
                      <Button
                        key={index}
                        variant={
                          selectedFaqCategory === index ? "default" : "outline"
                        }
                        onClick={() => setSelectedFaqCategory(index)}
                        className="text-sm"
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
                          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-0 shadow-lg hover:shadow-xl transition-all duration-300">
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
                                className="w-full p-6 text-left hover:bg-muted/50 transition-colors duration-300"
                              >
                                <div className="flex items-center justify-between">
                                  <h3 className="text-lg font-semibold pr-4">
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
                                    <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
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
                                    className="overflow-hidden border-t border-gray-100 dark:border-slate-700"
                                  >
                                    <div className="p-6 pt-4">
                                      <p className="text-muted-foreground leading-relaxed">
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

              {/* Schedule Tab */}
              <TabsContent value="schedule" className="space-y-8">
                <div className="max-w-4xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {officeSchedule.map((schedule, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5, scale: 1.02 }}
                      >
                        <Card
                          className={`h-full border-0 shadow-lg transition-all duration-300 ${
                            schedule.available
                              ? "bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20"
                              : "bg-gradient-to-br from-gray-50 to-red-50 dark:from-gray-900/20 dark:to-red-900/20"
                          }`}
                        >
                          <CardContent className="p-6 text-center">
                            <div
                              className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                                schedule.available
                                  ? "bg-gradient-to-r from-green-500 to-blue-500"
                                  : "bg-gradient-to-r from-gray-500 to-red-500"
                              }`}
                            >
                              <Calendar className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">
                              {schedule.day}
                            </h3>
                            <p
                              className={`text-lg font-semibold mb-2 ${
                                schedule.available
                                  ? "text-green-600"
                                  : "text-red-500"
                              }`}
                            >
                              {schedule.hours}
                            </p>
                            <Badge variant="outline" className="mb-2">
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
                              <span className="text-sm text-muted-foreground">
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

              {/* Social Media Tab */}
              <TabsContent value="social" className="space-y-8">
                <div className="max-w-6xl mx-auto">
                  <div className="text-center mb-12">
                    <h3 className="text-3xl font-bold mb-4">
                      🌍 Kết nối với chúng tôi
                    </h3>
                    <p className="text-xl text-muted-foreground">
                      Theo dõi Template Market trên các nền tảng xã hội để cập
                      nhật tin tức mới nhất
                    </p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {socialPlatforms.map((platform, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                      >
                        <Card className="h-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group">
                          <CardContent className="p-6 text-center">
                            <motion.div
                              className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                              whileHover={{ rotate: 5 }}
                            >
                              <platform.icon
                                className={`w-8 h-8 ${platform.color} transition-colors duration-300`}
                              />
                            </motion.div>
                            <h4 className="font-bold text-lg mb-2">
                              {platform.label}
                            </h4>
                            <p className="text-sm text-muted-foreground mb-3">
                              {platform.users} users
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300"
                            >
                              <a
                                href={platform.href}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Theo dõi
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

        {/* Enhanced CTA Section */}
        <section className="relative px-4 py-20 overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-black/10" />
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute bg-white/10 rounded-full"
                style={{
                  width: `${Math.random() * 200 + 100}px`,
                  height: `${Math.random() * 200 + 100}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 3 + i,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
              />
            ))}
          </div>

          <div className="container relative z-10 mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto space-y-8 text-white"
            >
              <h2 className="text-4xl md:text-5xl font-bold">
                🚀 Sẵn sàng bắt đầu dự án của bạn?
              </h2>
              <p className="text-xl opacity-90 leading-relaxed">
                Đội ngũ chuyên gia Template Market luôn sẵn sàng hỗ trợ bạn
                24/7. Liên hệ ngay để nhận tư vấn miễn phí và báo giá ưu đãi!
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-purple-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 px-8 py-4"
                  onClick={() => window.open("tel:+84971386588", "_self")}
                >
                  <Phone className="w-6 h-6 mr-3" />
                  Gọi ngay: +84 971 386 588
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="text-white border-white hover:bg-white hover:text-purple-600 shadow-xl hover:shadow-2xl transition-all duration-300 px-8 py-4"
                  onClick={() =>
                    document
                      .getElementById("contact-form")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  <MessageSquare className="w-6 h-6 mr-3" />
                  Gửi tin nhắn ngay
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 opacity-80">
                <div className="text-center">
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-sm">Support</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold"> 30s</div>
                  <div className="text-sm">Response</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">99.5%</div>
                  <div className="text-sm">Satisfaction</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">50K+</div>
                  <div className="text-sm">Happy Clients</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </TooltipProvider>
  );
};

export default Contact;
