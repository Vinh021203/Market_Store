import React, { useState, useEffect, useRef } from "react";
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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
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

// ✅ INTERFACES & DATA
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
  metrics?: {
    label: string;
    value: string;
  }[];
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

// ✅ MOCK DATA
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
      "Milestone đầu tiên với 10,000+ khách hàng tin tương và 500+ products được tạo ra.",
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

// ✅ COMPONENTS

// Hero Section with parallax effect
const HeroSection = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <motion.section
      style={{ y, opacity }}
      className="relative min-h-[80vh] flex items-center justify-center overflow-hidden"
    >
      {/* Animated background */}
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
          {/* Logo/Icon */}
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

              {/* Orbiting icons */}
              {[Heart, Star, Sparkles, Crown].map((Icon, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    top: "50%",
                    left: "50%",
                    transformOrigin: "0 0",
                  }}
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
              About TemplateVerse
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

      {/* Scroll indicator */}
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

// Statistics Section
const StatsSection = () => (
  <section className="py-20">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2
          className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${softPinkTheme.heroText} bg-clip-text text-transparent mb-4`}
        >
          Con số ấn tượng
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Những thành tựu mà chúng tôi tự hao về sau hành trình 6+ năm phát
          triển
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {statistics.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <Card
              className={`h-full bg-gradient-to-br ${softPinkTheme.neoCard} border-0 ${softPinkTheme.softGlow} backdrop-blur-xl relative overflow-hidden group`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <CardContent className="p-8 relative z-10">
                <div className="text-center space-y-6">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${softPinkTheme.primaryGradient} flex items-center justify-center ${softPinkTheme.softGlow} group-hover:${softPinkTheme.glow} transition-all duration-500`}
                  >
                    <stat.icon className="w-10 h-10 text-white" />
                  </motion.div>

                  <div>
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{
                        duration: 0.8,
                        type: "spring",
                        stiffness: 200,
                      }}
                      viewport={{ once: true }}
                      className={`text-4xl md:text-5xl font-bold ${stat.color} mb-2`}
                    >
                      {stat.value}
                    </motion.div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {stat.label}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {stat.description}
                    </p>
                  </div>

                  {/* Trend indicator */}
                  <div className="flex items-center justify-center gap-2">
                    {stat.trend === "up" && (
                      <>
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-green-600 font-medium">
                          Tăng trưởng
                        </span>
                      </>
                    )}
                    {stat.trend === "stable" && (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-blue-600 font-medium">
                          Ổn định
                        </span>
                      </>
                    )}
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

// Timeline/Milestones Section
const TimelineSection = () => (
  <section className="py-20">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2
          className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${softPinkTheme.heroText} bg-clip-text text-transparent mb-4`}
        >
          Hành trình phát triển
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Từ startup nhỏ đến platform hàng đầu trong lĩnh vực templates & design
        </p>
      </motion.div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-pink-200 via-rose-300 to-red-200 transform -translate-x-1/2 hidden lg:block" />

        <div className="space-y-12">
          {milestones.map((milestone, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`flex items-center gap-8 ${
                index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              } flex-col lg:flex-row`}
            >
              {/* Content Card */}
              <div
                className={`w-full lg:w-5/12 ${index % 2 === 0 ? "" : "lg:text-right"}`}
              >
                <Card
                  className={`bg-gradient-to-br ${softPinkTheme.neoCard} border-0 ${softPinkTheme.softGlow} backdrop-blur-xl hover:${softPinkTheme.glow} transition-all duration-500 group`}
                >
                  <CardHeader className="pb-3">
                    <div
                      className={`flex items-center gap-4 ${index % 2 === 0 ? "" : "lg:flex-row-reverse lg:text-right"}`}
                    >
                      <Badge
                        className={`bg-gradient-to-r ${softPinkTheme.dynamicColors[index % softPinkTheme.dynamicColors.length].bg} ${softPinkTheme.dynamicColors[index % softPinkTheme.dynamicColors.length].text} text-lg font-bold px-4 py-2`}
                      >
                        {milestone.year}
                      </Badge>
                      <CardTitle className="text-2xl font-bold text-gray-800">
                        {milestone.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      {milestone.description}
                    </p>

                    {milestone.metrics && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {milestone.metrics.map((metric, idx) => (
                          <div
                            key={idx}
                            className="text-center p-3 bg-white/60 rounded-lg"
                          >
                            <div
                              className={`text-2xl font-bold bg-gradient-to-r ${softPinkTheme.primaryText} bg-clip-text text-transparent`}
                            >
                              {metric.value}
                            </div>
                            <div className="text-sm text-gray-600 font-medium">
                              {metric.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Timeline Node */}
              <div className="relative z-10 hidden lg:block">
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 180 }}
                  className={`w-20 h-20 rounded-full bg-gradient-to-br ${softPinkTheme.primaryGradient} ${softPinkTheme.glow} flex items-center justify-center shadow-2xl border-4 border-white`}
                >
                  <milestone.icon className="w-8 h-8 text-white" />
                </motion.div>
              </div>

              {/* Empty space for alignment */}
              <div className="w-full lg:w-5/12 hidden lg:block" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// Team Section
const TeamSection = () => (
  <section className="py-20">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2
          className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${softPinkTheme.heroText} bg-clip-text text-transparent mb-4`}
        >
          Đội ngũ tài năng
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Những con người passionate và tài năng đằng sau thành công của
          TemplateVerse
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {teamMembers.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 50, rotateY: -15 }}
            whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
            whileHover={{ y: -8, rotateY: 5 }}
            style={{ perspective: "1000px" }}
          >
            <Card
              className={`h-full bg-gradient-to-br ${softPinkTheme.neoCard} border-0 ${softPinkTheme.softGlow} backdrop-blur-xl hover:${softPinkTheme.glow} transition-all duration-500 group relative overflow-hidden`}
            >
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-200/20 to-transparent rounded-full -translate-y-16 translate-x-16" />

              <CardContent className="p-8 relative z-10">
                <div className="text-center space-y-6">
                  {/* Avatar */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="relative"
                  >
                    <Avatar className="w-32 h-32 mx-auto border-4 border-white shadow-2xl">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback
                        className={`text-2xl font-bold bg-gradient-to-br ${softPinkTheme.primaryGradient} text-white`}
                      >
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    {/* Achievement badge */}
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="absolute -top-2 -right-2"
                    >
                      <Badge
                        className={`bg-gradient-to-r ${softPinkTheme.accentGradient} text-white px-2 py-1 text-xs font-bold`}
                      >
                        <Trophy className="w-3 h-3 mr-1" />
                        {member.achievements}
                      </Badge>
                    </motion.div>
                  </motion.div>

                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {member.name}
                    </h3>
                    <Badge
                      className={`bg-gradient-to-r ${softPinkTheme.dynamicColors[index % softPinkTheme.dynamicColors.length].bg} ${softPinkTheme.dynamicColors[index % softPinkTheme.dynamicColors.length].text} text-sm font-semibold px-4 py-1 mb-4`}
                    >
                      {member.role}
                    </Badge>

                    <p className="text-gray-700 leading-relaxed text-sm mb-4">
                      {member.bio}
                    </p>

                    {/* Expertise tags */}
                    <div className="flex flex-wrap justify-center gap-2 mb-6">
                      {member.expertise.map((skill, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="text-xs border-pink-200 hover:bg-pink-50 transition-colors"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    {/* Social links */}
                    <div className="flex justify-center gap-3">
                      {member.social.github && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-10 h-10 p-0 rounded-full border-gray-300 hover:border-pink-400 hover:bg-pink-50 transition-all"
                                onClick={() =>
                                  window.open(member.social.github, "_blank")
                                }
                              >
                                <Github className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>GitHub</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}

                      {member.social.twitter && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-10 h-10 p-0 rounded-full border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all"
                                onClick={() =>
                                  window.open(member.social.twitter, "_blank")
                                }
                              >
                                <Twitter className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Twitter</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}

                      {member.social.linkedin && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-10 h-10 p-0 rounded-full border-gray-300 hover:border-blue-600 hover:bg-blue-50 transition-all"
                                onClick={() =>
                                  window.open(member.social.linkedin, "_blank")
                                }
                              >
                                <Linkedin className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>LinkedIn</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}

                      {member.social.website && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-10 h-10 p-0 rounded-full border-gray-300 hover:border-purple-400 hover:bg-purple-50 transition-all"
                                onClick={() =>
                                  window.open(member.social.website, "_blank")
                                }
                              >
                                <Globe className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Website</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>

                    {/* Join date */}
                    <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                      <span className="text-xs text-gray-500 flex items-center justify-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Gia nhập từ{" "}
                        {new Date(member.joinDate).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
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

// Core Values Section
const ValuesSection = () => (
  <section className="py-20">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2
          className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${softPinkTheme.heroText} bg-clip-text text-transparent mb-4`}
        >
          Giá trị cốt lõi
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Những nguyên tắc và giá trị định hướng mọi hoạt động của chúng tôi
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {coreValues.map((value, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50, rotateX: 45 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -10, rotateX: 5, scale: 1.02 }}
            style={{ perspective: "1000px" }}
          >
            <Card
              className={`h-full bg-gradient-to-br ${softPinkTheme.neoCard} border-0 ${softPinkTheme.softGlow} backdrop-blur-xl hover:${softPinkTheme.glow} transition-all duration-500 group relative overflow-hidden`}
            >
              {/* Animated background gradient */}
              <motion.div
                animate={{
                  background: [
                    "linear-gradient(45deg, transparent, transparent)",
                    `linear-gradient(45deg, ${value.color.replace("text-", "rgba(")}, 0.05), transparent)`,
                    "linear-gradient(45deg, transparent, transparent)",
                  ],
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute inset-0"
              />

              <CardContent className="p-8 relative z-10 text-center space-y-6">
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${softPinkTheme.primaryGradient} ${softPinkTheme.softGlow} flex items-center justify-center group-hover:${softPinkTheme.glow} transition-all duration-500`}
                >
                  <value.icon className={`w-8 h-8 text-white`} />
                </motion.div>

                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    {value.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    {value.description}
                  </p>
                </div>

                {/* Decorative elements */}
                <div className="flex justify-center space-x-2 opacity-40">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3,
                      }}
                      className={`w-2 h-2 rounded-full ${value.color.replace("text-", "bg-")}`}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// CTA Section
const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <Card
            className={`bg-gradient-to-br ${softPinkTheme.primaryGradient} border-0 ${softPinkTheme.glow} relative overflow-hidden`}
          >
            {/* Animated background patterns */}
            <div className="absolute inset-0">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.3, 0.1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 10 + i * 2,
                    repeat: Infinity,
                    delay: i * 1.5,
                  }}
                  className="absolute w-20 h-20 border-2 border-white/20 rounded-full"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                  }}
                />
              ))}
            </div>

            <CardContent className="p-12 text-center relative z-10">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Sẵn sàng bắt đầu?
                  </h2>
                  <p className="text-xl text-white/90 leading-relaxed max-w-3xl mx-auto">
                    Khám phá hàng nghìn templates chất lượng cao và bắt đầu dự
                    án tiếp theo của bạn ngay hôm nay. Đội ngũ của chúng tôi
                    luôn sẵn sàng hỗ trợ bạn!
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button
                    onClick={() => navigate("/templates")}
                    size="lg"
                    className="bg-white text-pink-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold transition-all hover:scale-105 shadow-xl"
                  >
                    <Rocket className="w-5 h-5 mr-2" />
                    Khám phá Templates
                  </Button>

                  <Button
                    onClick={() => navigate("/contact")}
                    variant="outline"
                    size="lg"
                    className="border-2 border-white text-white hover:bg-white hover:text-pink-600 px-8 py-3 text-lg font-semibold transition-all hover:scale-105"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Liên hệ chúng tôi
                  </Button>
                </div>

                {/* Trust indicators */}
                <div className="flex flex-wrap justify-center items-center gap-8 pt-8 border-t border-white/20">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">150K+</div>
                    <div className="text-white/80 text-sm">Khách hàng</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">2,500+</div>
                    <div className="text-white/80 text-sm">Templates</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">98.5%</div>
                    <div className="text-white/80 text-sm">Hài lòng</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">45+</div>
                    <div className="text-white/80 text-sm">Quốc gia</div>
                  </div>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

// Scroll to top button
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

// ✅ MAIN ABOUT COMPONENT
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`min-h-screen bg-gradient-to-br ${softPinkTheme.pageBackground} relative overflow-hidden`}
    >
      {/* Progress bar */}
      <motion.div
        className={`fixed top-0 left-0 right-0 z-50 h-1 bg-gradient-to-r ${softPinkTheme.primaryGradient} origin-left`}
        style={{ scaleX }}
      />

      {/* Hero Section */}
      <HeroSection />

      {/* Statistics Section */}
      <StatsSection />

      {/* Timeline Section */}
      <TimelineSection />

      {/* Team Section */}
      <TeamSection />

      {/* Values Section */}
      <ValuesSection />

      {/* CTA Section */}
      <CTASection />

      {/* Scroll to top button */}
      <ScrollToTopButton show={showScrollToTop} />
    </motion.div>
  );
};

export default About;
