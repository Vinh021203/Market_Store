import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async"; // ✅ THÊM NÀY
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Heart,
  Star,
  Crown,
  Gift,
  Sparkles,
  Award,
  Diamond,
  BookMarked,
  Users,
  Code,
  Palette,
  Shield,
  Target,
  TrendingUp,
  ArrowUp,
  Globe,
  Coffee,
  Lightbulb,
  Rocket,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Briefcase,
  GraduationCap,
  Camera,
  Video,
  Headphones,
  Gamepad2,
  Layers,
  Feather,
  Github,
  Twitter,
  Linkedin,
  Facebook,
  Instagram,
  Youtube,
  MessageCircle,
  Share2,
  Download,
  Eye,
  ThumbsUp,
  BookOpen,
  FileText,
  Database,
  Server,
  Smartphone,
  Monitor,
  Zap,
  Building,
  Handshake,
  Trophy,
  Medal,
  Flag,
  Compass,
  Mountain,
  Sunrise,
  Sunset,
  TreePine,
  Leaf,
  Flower,
  Rainbow,
  Cloud,
  Sun,
  Moon,
  Music,
  Mic,
  PlayCircle,
  PauseCircle,
  Settings,
  Cog,
  Wrench,
  Hammer,
  PaintBucket,
  Brush,
  Scissors,
  Ruler,
  Calculator,
  BarChart3,
  PieChart,
  Activity,
  TrendingDown,
  Plus,
  Minus,
  Edit,
  Delete,
  Save,
  Upload,
  Folder,
  File,
  Search,
  Filter,
  Home,
  Bell,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  HelpCircle,
  Lock,
  Unlock,
  Key,
  User,
  UserPlus,
  UserMinus,
  UserCheck,
  Group,
  Reply,
  Share,
  Send,
  Archive,
  Trash,
  Star as StarIcon,
  Package, // ✅ THÊM NÀY
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

// ✅ FLOATING ICONS CONFIG - MỚI THÊM
const floatingIconsConfig = [
  {
    icon: Package,
    color: "text-pink-400/30",
    x: "8%",
    y: "12%",
    size: "w-12 h-12",
    delay: 0,
  },
  {
    icon: Code,
    color: "text-blue-400/30",
    x: "88%",
    y: "18%",
    size: "w-10 h-10",
    delay: 0.5,
  },
  {
    icon: Sparkles,
    color: "text-yellow-400/30",
    x: "12%",
    y: "75%",
    size: "w-14 h-14",
    delay: 1,
  },
  {
    icon: Heart,
    color: "text-rose-400/30",
    x: "85%",
    y: "68%",
    size: "w-11 h-11",
    delay: 1.5,
  },
  {
    icon: Star,
    color: "text-orange-400/30",
    x: "50%",
    y: "8%",
    size: "w-9 h-9",
    delay: 2,
  },
  {
    icon: Zap,
    color: "text-purple-400/30",
    x: "18%",
    y: "42%",
    size: "w-10 h-10",
    delay: 2.5,
  },
  {
    icon: Gift,
    color: "text-green-400/30",
    x: "78%",
    y: "88%",
    size: "w-12 h-12",
    delay: 3,
  },
  {
    icon: Crown,
    color: "text-amber-400/30",
    x: "35%",
    y: "85%",
    size: "w-11 h-11",
    delay: 3.5,
  },
  {
    icon: Rocket,
    color: "text-cyan-400/30",
    x: "92%",
    y: "48%",
    size: "w-13 h-13",
    delay: 4,
  },
  {
    icon: Award,
    color: "text-indigo-400/30",
    x: "28%",
    y: "22%",
    size: "w-10 h-10",
    delay: 4.5,
  },
  {
    icon: Coffee,
    color: "text-orange-400/30",
    x: "65%",
    y: "35%",
    size: "w-9 h-9",
    delay: 5,
  },
  {
    icon: Palette,
    color: "text-pink-400/30",
    x: "42%",
    y: "60%",
    size: "w-11 h-11",
    delay: 5.5,
  },
];

// ✅ SOFT PINK THEME - GIỐNG BẠN
const softPinkTheme = {
  pageBackground: "from-pink-50/70 via-rose-50/60 to-red-50/50",
  sectionBackground: "from-white/95 via-pink-25/30 to-rose-25/20",
  glassCard: "from-white/95 via-pink-25/20 to-rose-25/10 backdrop-blur-xl",
  neoCard: "bg-gradient-to-br from-white via-pink-25/30 to-rose-25/20",
  floatingCard: "from-white/90 via-pink-50/60 to-rose-50/40",
  primaryGradient: "from-pink-500 via-rose-500 to-red-500",
  secondaryGradient: "from-pink-400 via-rose-500 to-pink-600",
  accentGradient: "from-rose-400 via-pink-500 to-red-400",
  successGradient: "from-pink-300 via-rose-400 to-pink-500",
  heroText: "from-pink-700 via-rose-600 to-red-600",
  primaryText: "from-slate-700 via-pink-700 to-rose-700",
  accentText: "from-rose-600 via-pink-600 to-red-600",
  glow: "shadow-pink-200/60 shadow-2xl",
  neonGlow: "shadow-rose-300/50 shadow-xl",
  softGlow: "shadow-pink-200/40 shadow-lg",
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

// [TẤT CẢ INTERFACES VÀ DATA CỦA BẠN - GIỮ NGUYÊN]
interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  bio: string;
  expertise: string[];
  social: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  joinDate: string;
  achievements: number;
}

interface Milestone {
  year: string;
  title: string;
  description: string;
  icon: any;
  metrics?: { label: string; value: string }[];
}

interface Statistic {
  label: string;
  value: string;
  icon: any;
  description: string;
  trend: "up" | "down" | "stable";
  color: string;
}

interface Value {
  title: string;
  description: string;
  icon: any;
  color: string;
}

const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Nguyễn Minh Châu",
    role: "CEO & Founder",
    avatar:
      "https://ui-avatars.com/api/?name=Nguyen+Minh+Chau&background=ec4899&color=fff&size=200",
    bio: "Với 8+ năm kinh nghiệm trong lĩnh vực UI/UX Design và Frontend Development. Từng làm việc tại Google, Meta và các startup unicorn.",
    expertise: ["UI/UX Design", "React", "TypeScript", "Product Strategy"],
    social: {
      twitter: "https://twitter.com/minhchau",
      linkedin: "https://linkedin.com/in/minhchau",
      github: "https://github.com/minhchau",
      website: "https://minhchau.dev",
    },
    joinDate: "2019-01-15",
    achievements: 156,
  },
  {
    id: "2",
    name: "Trần Văn Khang",
    role: "CTO & Co-founder",
    avatar:
      "https://ui-avatars.com/api/?name=Tran+Van+Khang&background=f59e0b&color=fff&size=200",
    bio: "Full-stack Developer với chuyên môn sâu về system architecture và cloud infrastructure. Ex-Amazon, Ex-Shopify với 10+ năm kinh nghiệm.",
    expertise: ["System Architecture", "Cloud AWS", "Node.js", "DevOps"],
    social: {
      linkedin: "https://linkedin.com/in/vankhang",
      github: "https://github.com/vankhang",
    },
    joinDate: "2019-02-01",
    achievements: 203,
  },
  {
    id: "3",
    name: "Phạm Thu Hằng",
    role: "Head of Design",
    avatar:
      "https://ui-avatars.com/api/?name=Pham+Thu+Hang&background=8b5cf6&color=fff&size=200",
    bio: "Creative Director với passion về modern design trends. Chuyên gia về design systems và user experience optimization.",
    expertise: ["Design Systems", "Figma", "Brand Identity", "Animation"],
    social: {
      twitter: "https://twitter.com/thuhang_design",
      linkedin: "https://linkedin.com/in/thuhang",
    },
    joinDate: "2020-03-15",
    achievements: 127,
  },
  {
    id: "4",
    name: "Lê Hoàng Nam",
    role: "Senior Developer",
    avatar:
      "https://ui-avatars.com/api/?name=Le+Hoang+Nam&background=06b6d4&color=fff&size=200",
    bio: "Frontend specialist với đam mê về performance optimization và modern web technologies. Contributor cho nhiều open-source projects.",
    expertise: ["React", "Next.js", "Performance", "Open Source"],
    social: {
      github: "https://github.com/hoangnam",
      twitter: "https://twitter.com/hoangnam_dev",
    },
    joinDate: "2021-06-10",
    achievements: 89,
  },
];

const milestones: Milestone[] = [
  {
    year: "2019",
    title: "Thành lập công ty",
    description:
      "Khởi đầu với 2 founder và một tầm nhìn: democratize access to high-quality design templates.",
    icon: Rocket,
    metrics: [
      { label: "Nhân sự", value: "2" },
      { label: "Sản phẩm", value: "5" },
    ],
  },
  {
    year: "2020",
    title: "Mở rộng đội ngũ",
    description:
      "Tuyển dụng thêm 8 thành viên tài năng và ra mắt 50+ templates chất lượng cao.",
    icon: Users,
    metrics: [
      { label: "Nhân sự", value: "10" },
      { label: "Templates", value: "50+" },
      { label: "Khách hàng", value: "1,000+" },
    ],
  },
  {
    year: "2021",
    title: "Đạt 10K+ khách hàng",
    description:
      "Milestone đầu tiên với 10,000+ khách hàng tin tưởng và 500+ products được tạo ra.",
    icon: Trophy,
    metrics: [
      { label: "Khách hàng", value: "10,000+" },
      { label: "Sản phẩm", value: "500+" },
      { label: "Đánh giá 5⭐", value: "95%" },
    ],
  },
  {
    year: "2022",
    title: "Expansion quốc tế",
    description:
      "Mở rộng ra thị trường Đông Nam Á với office tại Singapore và Malaysia.",
    icon: Globe,
    metrics: [
      { label: "Quốc gia", value: "15" },
      { label: "Doanh thu", value: "$2M+" },
      { label: "Templates", value: "1,500+" },
    ],
  },
  {
    year: "2023",
    title: "AI Integration",
    description:
      "Ra mắt AI-powered design tools và smart template customization system.",
    icon: Sparkles,
    metrics: [
      { label: "AI Features", value: "25+" },
      { label: "Automation", value: "80%" },
      { label: "Time Saved", value: "75%" },
    ],
  },
  {
    year: "2024",
    title: "Series A Funding",
    description:
      "Gọi vốn thành công Series A $10M từ các quỹ đầu tư hàng đầu trong khu vực.",
    icon: TrendingUp,
    metrics: [
      { label: "Funding", value: "$10M" },
      { label: "Valuation", value: "$50M" },
      { label: "Customers", value: "100K+" },
    ],
  },
];

const statistics: Statistic[] = [
  {
    label: "Khách hàng hài lòng",
    value: "150,000+",
    icon: Users,
    description: "Khách hàng tin tưởng trên toàn thế giới",
    trend: "up",
    color: "text-blue-600",
  },
  {
    label: "Templates chất lượng cao",
    value: "2,500+",
    icon: Layers,
    description: "Templates được thiết kế chuyên nghiệp",
    trend: "up",
    color: "text-purple-600",
  },
  {
    label: "Countries served",
    value: "45+",
    icon: Globe,
    description: "Phục vụ khách hàng trên 6 châu lục",
    trend: "up",
    color: "text-green-600",
  },
  {
    label: "Đánh giá 5 sao",
    value: "98.5%",
    icon: Star,
    description: "Rating trung bình từ khách hàng",
    trend: "up",
    color: "text-yellow-600",
  },
  {
    label: "Code quality",
    value: "A+",
    icon: Code,
    description: "Chuẩn enterprise-grade code",
    trend: "stable",
    color: "text-indigo-600",
  },
  {
    label: "Support response",
    value: "< 2h",
    icon: MessageCircle,
    description: "Thời gian phản hồi trung bình",
    trend: "up",
    color: "text-pink-600",
  },
];

const coreValues: Value[] = [
  {
    title: "Innovation First",
    description:
      "Chúng tôi luôn đi đầu trong việc áp dụng công nghệ mới nhất và xu hướng thiết kế hiện đại để tạo ra những sản phẩm breakthrough.",
    icon: Lightbulb,
    color: "text-yellow-500",
  },
  {
    title: "Quality Excellence",
    description:
      "Mỗi template được review kỹ lưỡng qua 15+ checkpoints chất lượng trước khi đến tay khách hàng.",
    icon: Award,
    color: "text-purple-500",
  },
  {
    title: "Customer Obsessed",
    description:
      "Khách hàng là trung tâm của mọi quyết định. Chúng tôi lắng nghe, hiểu và deliver giá trị vượt mong đợi.",
    icon: Heart,
    color: "text-red-500",
  },
  {
    title: "Collaboration",
    description:
      "Tin tưởng vào sức mạnh của teamwork và open collaboration để tạo ra những breakthrough innovations.",
    icon: Users,
    color: "text-blue-500",
  },
  {
    title: "Continuous Learning",
    description:
      "Không ngừng học hỏi, cải tiến và adapting với landscape công nghệ và design trends thay đổi nhanh chóng.",
    icon: GraduationCap,
    color: "text-green-500",
  },
  {
    title: "Transparency",
    description:
      "Minh bạch trong communication, pricing và business practices để xây dựng lòng tin lâu dài với khách hàng.",
    icon: Eye,
    color: "text-cyan-500",
  },
];

// [TẤT CẢ COMPONENTS CỦA BẠN - GIỐNG Y HỆT]
const HeroSection = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <motion.section
      style={{ y, opacity }}
      className="relative min-h-[80vh] flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        {[
          Heart,
          Star,
          Crown,
          Sparkles,
          Award,
          Diamond,
          Rocket,
          Lightbulb,
          Users,
          Code,
          Palette,
          Globe,
          Trophy,
          Building,
          Coffee,
          Camera,
        ].map((Icon, idx) => (
          <motion.div
            key={idx}
            className="absolute"
            style={{
              top: `${10 + Math.sin(idx) * 30}%`,
              left: `${8 + Math.cos(idx) * 35}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 15 + idx * 2,
              repeat: Infinity,
              delay: idx * 0.5,
              ease: "easeInOut",
            }}
          >
            <Icon className="w-8 h-8 text-pink-300/20" />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 text-center max-w-5xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="space-y-8"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              delay: 0.2,
              type: "spring",
              stiffness: 200,
              damping: 15,
            }}
            className="flex justify-center"
          >
            <div
              className={`relative p-8 rounded-3xl bg-gradient-to-br ${softPinkTheme.primaryGradient} ${softPinkTheme.glow}`}
            >
              <Rocket className="w-16 h-16 text-white" />
              {[Heart, Star, Sparkles, Crown].map((Icon, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{ top: "50%", left: "50%", transformOrigin: "0 0" }}
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 10 + i * 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <div className="w-8 h-8 -translate-x-20 -translate-y-4">
                    <Icon className="w-full h-full text-pink-300/60" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className={`text-5xl md:text-7xl font-bold bg-gradient-to-r ${softPinkTheme.heroText} bg-clip-text text-transparent leading-tight`}
            >
              VỀ CHÚNG TÔI
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-xl md:text-2xl text-gray-700 leading-relaxed max-w-4xl mx-auto"
            >
              Chúng tôi là đội ngũ passionate về việc tạo ra những{" "}
              <span className="font-bold text-pink-600">
                templates chất lượng cao
              </span>
              , giúp developers và designers{" "}
              <span className="font-bold text-rose-600">
                tiết kiệm thời gian
              </span>{" "}
              và tập trung vào những gì quan trọng nhất.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <Badge
                className={`px-6 py-2 bg-gradient-to-r ${softPinkTheme.primaryGradient} text-white text-lg font-semibold ${softPinkTheme.glow}`}
              >
                <Calendar className="w-5 h-5 mr-2" />
                Thành lập 2019
              </Badge>
              <Badge
                className={`px-6 py-2 bg-gradient-to-r ${softPinkTheme.secondaryGradient} text-white text-lg font-semibold`}
              >
                <Users className="w-5 h-5 mr-2" />
                25+ Thành viên
              </Badge>
              <Badge
                className={`px-6 py-2 bg-gradient-to-r ${softPinkTheme.accentGradient} text-white text-lg font-semibold`}
              >
                <Globe className="w-5 h-5 mr-2" />
                45+ Quốc gia
              </Badge>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-pink-300 rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-pink-400 rounded-full mt-2"
          />
        </div>
      </motion.div>
    </motion.section>
  );
};

// ✅ STATS SECTION
const StatsSection = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2
            className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${softPinkTheme.heroText} bg-clip-text text-transparent mb-4`}
          >
            Con số ấn tượng
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Thành tựu sau 6+ năm phát triển
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {statistics.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <Card
                className={`h-full bg-gradient-to-br ${softPinkTheme.floatingCard} border-0 ${softPinkTheme.softGlow} backdrop-blur-sm`}
              >
                <CardContent className="p-8 text-center space-y-4">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.6 }}
                    className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${softPinkTheme.primaryGradient}`}
                  >
                    <stat.icon className="w-8 h-8 text-white" />
                  </motion.div>

                  <div>
                    <div
                      className={`text-4xl font-bold bg-gradient-to-r ${softPinkTheme.heroText} bg-clip-text text-transparent mb-2`}
                    >
                      {stat.value}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">
                      {stat.label}
                    </h3>
                    <p className="text-gray-600 text-sm">{stat.description}</p>
                  </div>

                  {stat.trend === "up" && (
                    <Badge
                      className={`bg-gradient-to-r from-green-400 to-emerald-500 text-white`}
                    >
                      <TrendingUp className="w-4 h-4 mr-1" />
                      Growing
                    </Badge>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ✅ TIMELINE SECTION
const TimelineSection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-50/30 to-transparent" />

      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2
            className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${softPinkTheme.heroText} bg-clip-text text-transparent mb-4`}
          >
            Hành trình phát triển
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            6+ năm không ngừng innovation và growth
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-pink-300 via-rose-300 to-red-300" />

          <div className="space-y-12">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className={`relative flex items-center ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
              >
                <div
                  className={`w-1/2 ${index % 2 === 0 ? "pr-12 text-right" : "pl-12 text-left"}`}
                >
                  <Card
                    className={`bg-gradient-to-br ${softPinkTheme.floatingCard} border-0 ${softPinkTheme.softGlow} backdrop-blur-sm overflow-hidden group hover:scale-105 transition-transform duration-300`}
                  >
                    <CardContent className="p-6">
                      <Badge
                        className={`mb-3 bg-gradient-to-r ${softPinkTheme.primaryGradient} text-white`}
                      >
                        {milestone.year}
                      </Badge>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {milestone.description}
                      </p>
                      {milestone.metrics && (
                        <div className="flex flex-wrap gap-2 justify-end">
                          {milestone.metrics.map((metric, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="text-sm"
                            >
                              {metric.label}:{" "}
                              <span className="font-bold ml-1">
                                {metric.value}
                              </span>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <motion.div
                  whileHover={{ scale: 1.3, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`absolute left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-gradient-to-br ${softPinkTheme.primaryGradient} ${softPinkTheme.glow} flex items-center justify-center z-10`}
                >
                  <milestone.icon className="w-8 h-8 text-white" />
                </motion.div>

                <div className="w-1/2" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ✅ TEAM SECTION
const TeamSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2
            className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${softPinkTheme.heroText} bg-clip-text text-transparent mb-4`}
          >
            Đội ngũ tài năng
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Những con người passionate đằng sau thành công
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <Card
                className={`h-full bg-gradient-to-br ${softPinkTheme.floatingCard} border-0 ${softPinkTheme.softGlow} backdrop-blur-sm overflow-hidden group`}
              >
                <CardContent className="p-6 text-center space-y-4">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Avatar className="w-24 h-24 mx-auto border-4 border-white shadow-lg">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback
                        className={`bg-gradient-to-br ${softPinkTheme.primaryGradient} text-white text-xl font-bold`}
                      >
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                      {member.name}
                    </h3>
                    <Badge
                      className={`mb-3 bg-gradient-to-r ${softPinkTheme.primaryGradient} text-white`}
                    >
                      {member.role}
                    </Badge>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                      {member.bio}
                    </p>

                    <div className="flex flex-wrap gap-2 justify-center mb-4">
                      {member.expertise.map((skill, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex justify-center gap-2">
                      {member.social.twitter && (
                        <Button size="sm" variant="ghost" className="p-2">
                          <Twitter className="w-4 h-4" />
                        </Button>
                      )}
                      {member.social.linkedin && (
                        <Button size="sm" variant="ghost" className="p-2">
                          <Linkedin className="w-4 h-4" />
                        </Button>
                      )}
                      {member.social.github && (
                        <Button size="sm" variant="ghost" className="p-2">
                          <Github className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <Separator className="my-4" />

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Joined {new Date(member.joinDate).getFullYear()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Trophy className="w-3 h-3" />
                        {member.achievements} achievements
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ✅ VALUES SECTION
const ValuesSection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-rose-50/30 to-transparent" />

      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2
            className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${softPinkTheme.heroText} bg-clip-text text-transparent mb-4`}
          >
            Giá trị cốt lõi
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Nguyên tắc định hướng mọi hoạt động của chúng tôi
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coreValues.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.05 }}
            >
              <Card
                className={`h-full bg-gradient-to-br ${softPinkTheme.floatingCard} border-0 ${softPinkTheme.softGlow} backdrop-blur-sm overflow-hidden group`}
              >
                <CardContent className="p-8 text-center space-y-4">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-white to-pink-50 shadow-lg"
                  >
                    <value.icon className={`w-8 h-8 ${value.color}`} />
                  </motion.div>

                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ✅ SCROLL TO TOP BUTTON
const ScrollToTopButton: React.FC<{ show: boolean }> = ({ show }) => {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleScrollToTop}
          className={`fixed bottom-8 right-8 z-50 p-4 rounded-full bg-gradient-to-br ${softPinkTheme.primaryGradient} ${softPinkTheme.glow} text-white`}
        >
          <ArrowUp className="w-6 h-6" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

const About: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const [showScrollToTop, setShowScrollToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.pageYOffset > 500);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* ✅ SEO OPTIMIZATION */}
      <Helmet>
        <title>
          Về Chúng Tôi - Template Market | 2,500+ Templates Chất Lượng Cao
        </title>
        <meta
          name="description"
          content="Tìm hiểu về Template Market - nền tảng cung cấp 2,500+ templates website chất lượng cao. Đội ngũ 25+ chuyên gia, phục vụ 150,000+ khách hàng tại 45+ quốc gia. ✓ 98.5% hài lòng ✓ Hỗ trợ 24/7"
        />
        <meta
          name="keywords"
          content="about template market, về chúng tôi, đội ngũ thiết kế, templates chất lượng cao, website templates vietnam"
        />
        <link rel="canonical" href="https://templatemarket.com/about" />
        <meta property="og:title" content="Về Chúng Tôi - Template Market" />
        <meta property="og:type" content="website" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`min-h-screen bg-gradient-to-br ${softPinkTheme.pageBackground} relative overflow-hidden`}
      >
        {/* ✅ PROGRESS BAR */}
        <motion.div
          className={`fixed top-0 left-0 right-0 z-50 h-1 bg-gradient-to-r ${softPinkTheme.primaryGradient} origin-left`}
          style={{ scaleX }}
        />

        {/* ✅ FLOATING ICONS - MỚI THÊM */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          {floatingIconsConfig.map((item, index) => (
            <motion.div
              key={index}
              className="absolute"
              style={{ left: item.x, top: item.y }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0.4, 0.7, 0.4],
                scale: [1, 1.15, 1],
                y: [0, -25, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 5 + index * 0.3,
                repeat: Infinity,
                delay: item.delay,
                ease: "easeInOut",
              }}
            >
              <item.icon
                className={`${item.size} ${item.color} drop-shadow-sm`}
              />
            </motion.div>
          ))}
        </div>

        {/* ✅ BACKGROUND PATTERNS - MỚI THÊM */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,207,232,0.3),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(254,202,202,0.3),transparent_50%)]" />
        </div>

        {/* ✅ GIỮ NGUYÊN TẤT CẢ SECTIONS CỦA BẠN */}
        <HeroSection />
        <StatsSection />
        <TimelineSection />
        <TeamSection />
        <ValuesSection />
        <ScrollToTopButton show={showScrollToTop} />
      </motion.div>
    </>
  );
};

export default About;
