import React, { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  Briefcase,
  Users,
  Award,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Building,
  Lightbulb,
  Laptop,
  Handshake,
  Code,
  Palette,
  Megaphone,
  GraduationCap,
  Hourglass,
  Smile,
  BarChart,
  Gift,
  Send,
  MapPin,
  Mail,
  Phone,
  MessageSquare,
  Clock,
  Star,
  Heart,
  Zap,
  Globe,
  Rocket,
  Target,
  TrendingUp,
  Shield,
  Coffee,
  Wifi,
  Car,
  Plane,
  DollarSign,
  Calendar,
  FileText,
  Upload,
  Download,
  Eye,
  ThumbsUp,
  Share2,
  Camera,
  Video,
  HeartHandshake,
  ArrowUp,
  ChevronDown,
  ChevronUp,
  Crown,
  Diamond,
  BookMarked,
  Library,
  Feather,
  Layers,
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

// Enhanced Schema with advanced validation
const applicationSchema = z.object({
  name: z
    .string()
    .min(2, "Tên phải có ít nhất 2 ký tự")
    .max(50, "Tên không được quá 50 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  phone: z
    .string()
    .regex(/^[+]?[\d\s\-()]{10,15}$/, "Số điện thoại không hợp lệ")
    .optional()
    .or(z.literal("")),
  position: z.string().min(1, "Vui lòng chọn vị trí ứng tuyển"),
  experience: z.string().min(1, "Vui lòng chọn mức kinh nghiệm"),
  salary: z.string().optional(),
  portfolio: z
    .string()
    .url("URL portfolio không hợp lệ")
    .optional()
    .or(z.literal("")),
  linkedin: z
    .string()
    .url("URL LinkedIn không hợp lệ")
    .optional()
    .or(z.literal("")),
  coverLetter: z
    .string()
    .min(50, "Thư xin việc phải có ít nhất 50 ký tự")
    .max(1000, "Thư xin việc không được quá 1000 ký tự"),
  skills: z.array(z.string()).min(1, "Vui lòng chọn ít nhất 1 kỹ năng"),
  startDate: z.string().min(1, "Vui lòng chọn ngày có thể bắt đầu"),
  workType: z.string().min(1, "Vui lòng chọn hình thức làm việc"),
});

type ApplicationData = z.infer<typeof applicationSchema>;

const Careers: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [expandedJob, setExpandedJob] = useState<number | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showFloatingNav, setShowFloatingNav] = useState(false);

  const { scrollYProgress } = useScroll();
  const headerY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ApplicationData>({
    resolver: zodResolver(applicationSchema),
  });

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

  // Enhanced job openings data with PINK THEME
  const jobOpenings = [
    {
      id: 1,
      title: "Senior Frontend Developer (React/Next.js)",
      location: "Remote / Hạ Long, Quảng Ninh",
      type: "Full-time",
      experience: "5+ years",
      salary: "$2,000 - $3,500/month",
      urgent: true,
      featured: true,
      description:
        "Chúng tôi đang tìm kiếm một Senior Frontend Developer tài năng để dẫn dắt việc phát triển các giao diện người dùng phức tạp và hiệu suất cao cho hàng triệu người dùng.",
      responsibilities: [
        "Phát triển và duy trì các tính năng frontend mới với React/Next.js",
        "Tối ưu hóa hiệu suất và trải nghiệm người dùng trên mọi thiết bị",
        "Xây dựng component library và design system",
        "Code review và mentor junior developers",
        "Làm việc chặt chẽ với team UI/UX và Backend",
      ],
      requirements: [
        "5+ năm kinh nghiệm với React, Next.js, TypeScript",
        "Thành thạo TailwindCSS, Framer Motion, GSAP",
        "Hiểu biết sâu về Web Performance, SEO, Accessibility",
        "Kinh nghiệm với testing (Jest, Cypress)",
        "Kỹ năng giao tiếp tốt và làm việc nhóm",
      ],
      benefits: [
        "Lương cạnh tranh",
        "Remote flexible",
        "Bảo hiểm 100%",
        "Bonus theo KPI",
      ],
      tags: ["React", "Next.js", "TypeScript", "Remote"],
      color: softPinkTheme.primaryGradient,
      icon: Code,
    },
    {
      id: 2,
      title: "Backend Developer (Node.js/Supabase)",
      location: "Hạ Long / Remote",
      type: "Full-time",
      experience: "3+ years",
      salary: "$1,500 - $2,800/month",
      urgent: false,
      featured: true,
      description:
        "Gia nhập đội ngũ backend để xây dựng và duy trì các API mạnh mẽ, có khả năng mở rộng phục vụ hàng triệu request mỗi ngày.",
      responsibilities: [
        "Thiết kế và triển khai RESTful APIs và GraphQL",
        "Quản lý database (Supabase, PostgreSQL) với hiệu suất cao",
        "Xây dựng Edge Functions và microservices architecture",
        "Implement real-time features với WebSocket",
        "Đảm bảo security, monitoring và scalability",
      ],
      requirements: [
        "3+ năm kinh nghiệm Node.js, Express.js",
        "Thành thạo Supabase, PostgreSQL, Redis",
        "Hiểu biết về Docker, AWS/GCP",
        "Kinh nghiệm với webhook, payment integration",
        "Kỹ năng debug và optimization",
      ],
      benefits: [
        "Cơ hội thăng tiến",
        "Tech budget 500$/năm",
        "Flexible working",
      ],
      tags: ["Node.js", "Supabase", "PostgreSQL", "AWS"],
      color: softPinkTheme.secondaryGradient,
      icon: Zap,
    },
    {
      id: 3,
      title: "Senior UI/UX Designer",
      location: "Hạ Long",
      type: "Full-time",
      experience: "4+ years",
      salary: "$1,200 - $2,200/month",
      urgent: true,
      featured: false,
      description:
        "Tìm kiếm UI/UX Designer sáng tạo để thiết kế trải nghiệm người dùng tuyệt vời cho các sản phẩm digital hàng đầu.",
      responsibilities: [
        "Research user behavior và market trends",
        "Thiết kế wireframes, prototypes và user flows",
        "Tạo design system và component library",
        "A/B testing và optimization based on data",
        "Collaborate với developers để implement design",
      ],
      requirements: [
        "4+ năm kinh nghiệm UI/UX design",
        "Expert Figma, Adobe Creative Suite",
        "Portfolio impressive với case studies",
        "Hiểu biết về responsive design và accessibility",
        "Kỹ năng presentation và storytelling",
      ],
      benefits: [
        "Creative freedom",
        "Design conference budget",
        "Flexible hours",
      ],
      tags: ["Figma", "UI/UX", "Design System", "Research"],
      color: softPinkTheme.accentGradient,
      icon: Palette,
    },
    {
      id: 4,
      title: "Product Marketing Manager",
      location: "Remote / Hạ Long",
      type: "Full-time",
      experience: "3+ years",
      salary: "$1,000 - $2,000/month",
      urgent: false,
      featured: false,
      description:
        "Dẫn dắt strategy marketing cho các sản phẩm template, từ launch đến growth và retention.",
      responsibilities: [
        "Phát triển go-to-market strategy cho sản phẩm mới",
        "Content marketing và SEO optimization",
        "Social media marketing và community building",
        "Analytics và reporting performance metrics",
        "Partnership và influencer collaboration",
      ],
      requirements: [
        "3+ năm kinh nghiệm product marketing",
        "Thành thạo Google Analytics, SEO tools",
        "Kinh nghiệm với social media marketing",
        "Kỹ năng viết content và storytelling",
        "Data-driven mindset",
      ],
      benefits: [
        "Marketing budget",
        "Conference attendance",
        "Performance bonus",
      ],
      tags: ["Marketing", "SEO", "Analytics", "Content"],
      color: softPinkTheme.successGradient,
      icon: Megaphone,
    },
  ];

  const skillsList = [
    "React",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "Node.js",
    "Python",
    "Figma",
    "Adobe XD",
    "Photoshop",
    "UI/UX Design",
    "HTML/CSS",
    "TailwindCSS",
    "PostgreSQL",
    "MongoDB",
    "Supabase",
    "AWS",
    "Docker",
    "Git",
    "SEO",
    "Google Analytics",
    "Content Writing",
    "Social Media",
    "Marketing",
  ];

  const benefits = [
    {
      icon: DollarSign,
      title: "Lương thưởng cạnh tranh",
      description: "Mức lương hấp dẫn + bonus performance + raise hàng năm",
      color: softPinkTheme.primaryGradient,
    },
    {
      icon: Laptop,
      title: "Remote-first culture",
      description: "Làm việc từ xa linh hoạt + flexible working hours",
      color: softPinkTheme.secondaryGradient,
    },
    {
      icon: GraduationCap,
      title: "Learning & Development",
      description: "Budget $500/năm cho khóa học + conference tickets",
      color: softPinkTheme.accentGradient,
    },
    {
      icon: Shield,
      title: "Bảo hiểm toàn diện",
      description: "Bảo hiểm sức khỏe 100% + bảo hiểm tai nạn",
      color: softPinkTheme.successGradient,
    },
    {
      icon: Coffee,
      title: "Free coffee & snacks",
      description: "Đồ uống và snacks miễn phí tại office",
      color: softPinkTheme.primaryGradient,
    },
    {
      icon: Plane,
      title: "Company trips",
      description: "Du lịch công ty hàng năm + team building",
      color: softPinkTheme.secondaryGradient,
    },
    {
      icon: Car,
      title: "Parking miễn phí",
      description: "Chỗ đậu xe miễn phí tại office",
      color: softPinkTheme.accentGradient,
    },
    {
      icon: Heart,
      title: "Work-life balance",
      description: "Chính sách nghỉ phép linh hoạt + mental health support",
      color: softPinkTheme.successGradient,
    },
  ];

  const companyStats = [
    { label: "Nhân viên", value: "50+", icon: Users, color: "text-pink-600" },
    {
      label: "Khách hàng",
      value: "10K+",
      icon: Heart,
      color: "text-rose-600",
    },
    { label: "Dự án", value: "200+", icon: Rocket, color: "text-red-600" },
    { label: "Quốc gia", value: "25+", icon: Globe, color: "text-pink-700" },
  ];

  // Event handlers
  const onSubmit = useCallback(
    async (data: ApplicationData) => {
      setIsSubmitting(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setIsSubmitting(false);
      setIsSubmitted(true);
      reset();
      setSelectedSkills([]);
      setCurrentStep(1);

      toast({
        title: "🎉 Ứng tuyển thành công!",
        description:
          "Hồ sơ của bạn đã được gửi. Chúng tôi sẽ liên hệ trong 3-5 ngày làm việc.",
      });

      setTimeout(() => setIsSubmitted(false), 5000);
    },
    [reset],
  );

  const handleSkillToggle = useCallback(
    (skill: string) => {
      const newSkills = selectedSkills.includes(skill)
        ? selectedSkills.filter((s) => s !== skill)
        : [...selectedSkills, skill];

      setSelectedSkills(newSkills);
      setValue("skills", newSkills);
    },
    [selectedSkills, setValue],
  );

  const nextStep = useCallback(() => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  }, [currentStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  }, [currentStep]);

  // ✅ Reading Progress Component
  const ReadingProgress: React.FC = () => (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 z-50">
      <motion.div
        className={`h-full bg-gradient-to-r ${softPinkTheme.primaryGradient}`}
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
          <Card
            className={`bg-gradient-to-r ${softPinkTheme.glassCard} backdrop-blur-lg border-0 ${softPinkTheme.softGlow}`}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                  className={`bg-gradient-to-r ${softPinkTheme.primaryGradient} text-white border-0 hover:scale-105 transition-all`}
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
        <title>🚀 Careers - Tuyển dụng | Template Market - Join Our Team</title>
        <meta
          name="description"
          content="Tham gia đội ngũ Template Market! Tuyển dụng Frontend Developer, Backend Developer, UI/UX Designer, Marketing Manager. Remote-first culture, lương thưởng cạnh tranh."
        />
        <meta
          name="keywords"
          content="careers, tuyển dụng, jobs, developer, designer, marketing, remote work"
        />
        <link rel="canonical" href="https://templatemarket.vn/careers" />
      </Helmet>

      <ReadingProgress />
      <FloatingNav />

      <div
        className={`min-h-screen bg-gradient-to-br ${softPinkTheme.pageBackground}`}
      >
        {/* ✅ Enhanced Hero Section - PINK THEME */}
        <motion.section
          className="relative px-4 py-20 lg:py-32 overflow-hidden"
          style={{ y: headerY, opacity: headerOpacity }}
        >
          {/* Floating background icons */}
          <div className="absolute inset-0 pointer-events-none">
            {[
              Code,
              Users,
              Palette,
              Rocket,
              Heart,
              Star,
              Globe,
              Zap,
              Target,
              Crown,
              Briefcase,
              Award,
              Sparkles,
              Building,
              Lightbulb,
              Coffee,
              Diamond,
              BookMarked,
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

          <div className="container relative z-10 mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-6xl mx-auto space-y-8"
            >
              {/* Animated Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
              >
                <Badge
                  className={`px-6 py-3 text-lg bg-gradient-to-r ${softPinkTheme.primaryGradient} text-white border-0 ${softPinkTheme.glow}`}
                >
                  <Briefcase className="w-5 h-5 mr-2" />
                  We're Hiring! Join Our Team
                  <Sparkles className="w-5 h-5 ml-2 animate-pulse" />
                </Badge>
              </motion.div>

              {/* Title */}
              <h1 className="text-5xl font-bold leading-tight lg:text-7xl">
                <span
                  className={`text-transparent bg-gradient-to-r ${softPinkTheme.heroText} bg-clip-text`}
                >
                  Build the Future
                </span>
                <br />
                <span className="text-3xl lg:text-5xl text-gray-700 dark:text-gray-300">
                  with Template Market
                </span>
              </h1>

              {/* Subtitle */}
              <p className="max-w-4xl mx-auto text-xl lg:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed">
                Tham gia đội ngũ
                <span className="font-bold text-pink-600">
                  {" "}
                  50+ developers, designers & marketers{" "}
                </span>
                đầy tài năng để
                <span className="font-bold text-rose-600">
                  {" "}
                  tạo ra các sản phẩm công nghệ{" "}
                </span>
                phục vụ hàng triệu người dùng trên toàn thế giới.
              </p>

              {/* Company Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-8">
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
                      className={`flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${softPinkTheme.primaryGradient} rounded-2xl ${softPinkTheme.glow}`}
                    >
                      <stat.icon className="w-8 h-8 text-white" />
                    </div>
                    <div
                      className={`text-3xl font-bold ${stat.color} dark:text-white mb-2`}
                    >
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                <Button
                  size="lg"
                  className={`bg-gradient-to-r ${softPinkTheme.primaryGradient} hover:scale-105 ${softPinkTheme.glow} text-white border-0 transition-all duration-300`}
                  onClick={() =>
                    document
                      .getElementById("open-positions")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  <Rocket className="w-5 h-5 mr-2" />
                  Xem vị trí tuyển dụng
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-pink-300 hover:bg-pink-50 dark:hover:bg-pink-900/20"
                  onClick={() =>
                    document
                      .getElementById("why-join-us")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Tại sao chọn chúng tôi?
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* ✅ Enhanced Benefits Section - CREATIVE LAYOUT */}
        <section
          className={`px-4 py-20 bg-gradient-to-r ${softPinkTheme.sectionBackground} backdrop-blur-sm`}
          id="why-join-us"
        >
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2
                className={`text-4xl font-bold mb-6 text-transparent bg-gradient-to-r ${softPinkTheme.heroText} bg-clip-text`}
              >
                Tại sao nên tham gia Template Market?
              </h2>
              <p className="max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-400">
                Chúng tôi không chỉ cung cấp một công việc, mà là một hành trình
                phát triển sự nghiệp đầy thú vị
              </p>
            </motion.div>

            {/* ✅ CREATIVE ZIGZAG LAYOUT */}
            <div className="space-y-16">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-12 ${
                    index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                  } flex-col lg:flex-row`}
                >
                  {/* Icon side */}
                  <div className="flex-shrink-0">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      className={`w-32 h-32 rounded-full bg-gradient-to-r ${benefit.color} flex items-center justify-center ${softPinkTheme.glow} relative overflow-hidden`}
                    >
                      <benefit.icon className="w-16 h-16 text-white relative z-10" />

                      {/* Orbiting particles */}
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 8 + i * 2,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="absolute"
                          style={{
                            top: "50%",
                            left: "50%",
                            transformOrigin: "0 0",
                          }}
                        >
                          <div
                            className={`w-2 h-2 bg-white/30 rounded-full -translate-x-16 -translate-y-1`}
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>

                  {/* Content side */}
                  <div className="flex-1 text-center lg:text-left">
                    <Card
                      className={`bg-gradient-to-br ${softPinkTheme.neoCard} border-0 ${softPinkTheme.softGlow} backdrop-blur-xl hover:${softPinkTheme.glow} transition-all duration-500`}
                    >
                      <CardContent className="p-8">
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                          {benefit.title}
                        </h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                          {benefit.description}
                        </p>

                        {/* Decorative elements */}
                        <div className="flex items-center justify-center lg:justify-start mt-6 gap-2">
                          {[...Array(5)].map((_, i) => (
                            <motion.div
                              key={i}
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: i * 0.2,
                              }}
                              className="w-2 h-2 bg-pink-400 rounded-full"
                            />
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ✅ Enhanced Job Listings - MASONRY LAYOUT */}
        <section className="px-4 py-20" id="open-positions">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2
                className={`text-4xl font-bold mb-6 text-transparent bg-gradient-to-r ${softPinkTheme.heroText} bg-clip-text`}
              >
                Các vị trí đang tuyển dụng
              </h2>
              <p className="max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-400">
                Tìm kiếm cơ hội phù hợp với passion và skills của bạn
              </p>
            </motion.div>

            {/* ✅ CREATIVE GRID LAYOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
              {jobOpenings.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 50, rotateY: -15 }}
                  whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, rotateY: 5, scale: 1.02 }}
                  style={{ perspective: "1000px" }}
                  className={index === 0 ? "lg:col-span-2" : ""}
                >
                  <Card
                    className={`overflow-hidden border-0 ${softPinkTheme.softGlow} bg-gradient-to-br ${softPinkTheme.neoCard} backdrop-blur-sm hover:${softPinkTheme.glow} transition-all duration-500 group relative ${
                      job.featured ? `ring-2 ring-pink-400` : ""
                    }`}
                  >
                    {/* Gradient top bar */}
                    <div className={`h-2 bg-gradient-to-r ${job.color}`} />

                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-200/20 to-transparent rounded-full -translate-y-16 translate-x-16" />

                    <CardContent className="p-8 relative z-10">
                      <div className="flex flex-col lg:flex-row items-start justify-between mb-6 gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-4">
                            {job.urgent && (
                              <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 animate-pulse">
                                🔥 URGENT
                              </Badge>
                            )}
                            {job.featured && (
                              <Badge className="bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300">
                                ⭐ FEATURED
                              </Badge>
                            )}
                            <Badge variant="outline">{job.type}</Badge>
                          </div>

                          <h3 className="text-2xl font-bold mb-3 hover:text-pink-600 dark:hover:text-pink-400 transition-colors text-gray-800 dark:text-gray-100">
                            {job.title}
                          </h3>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {job.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {job.experience}
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              {job.salary}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-4">
                            {job.tags.map((tag, idx) => (
                              <Badge
                                key={idx}
                                variant="secondary"
                                className="text-xs border-pink-200 hover:bg-pink-50"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${job.color} flex items-center justify-center ${softPinkTheme.softGlow} flex-shrink-0`}
                        >
                          <job.icon className="w-8 h-8 text-white" />
                        </motion.div>
                      </div>

                      <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                        {job.description}
                      </p>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <Button
                          variant="outline"
                          onClick={() =>
                            setExpandedJob(
                              expandedJob === job.id ? null : job.id,
                            )
                          }
                          className="flex items-center gap-2 border-pink-200 hover:bg-pink-50"
                        >
                          <Eye className="w-4 h-4" />
                          {expandedJob === job.id
                            ? "Ẩn chi tiết"
                            : "Xem chi tiết"}
                          <motion.div
                            animate={{
                              rotate: expandedJob === job.id ? 180 : 0,
                            }}
                            transition={{ duration: 0.3 }}
                          >
                            <ChevronDown className="w-4 h-4" />
                          </motion.div>
                        </Button>

                        <Button
                          className={`bg-gradient-to-r ${job.color} hover:scale-105 ${softPinkTheme.softGlow} transition-all duration-300 text-white border-0`}
                          onClick={() =>
                            document
                              .getElementById("application-form")
                              ?.scrollIntoView({ behavior: "smooth" })
                          }
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Ứng tuyển ngay
                        </Button>
                      </div>

                      {/* Expanded Content */}
                      <AnimatePresence>
                        {expandedJob === job.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden mt-8 pt-8 border-t border-pink-200 dark:border-pink-700"
                          >
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                              <div>
                                <h4 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-200">
                                  <Target className="w-5 h-5 text-pink-500" />
                                  Trách nhiệm công việc
                                </h4>
                                <ul className="space-y-2">
                                  {job.responsibilities.map((item, idx) => (
                                    <li
                                      key={idx}
                                      className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                                    >
                                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div>
                                <h4 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-800 dark:text-gray-200">
                                  <Shield className="w-5 h-5 text-pink-500" />
                                  Yêu cầu ứng viên
                                </h4>
                                <ul className="space-y-2">
                                  {job.requirements.map((item, idx) => (
                                    <li
                                      key={idx}
                                      className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                                    >
                                      <Star className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            <div className="mt-6 p-4 bg-gradient-to-r from-pink-50/50 to-rose-50/50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-xl">
                              <h4 className="font-bold mb-2 flex items-center gap-2 text-gray-800 dark:text-gray-200">
                                <Gift className="w-5 h-5 text-pink-500" />
                                Quyền lợi đặc biệt
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {job.benefits.map((benefit, idx) => (
                                  <Badge
                                    key={idx}
                                    className="bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300"
                                  >
                                    {benefit}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ✅ Enhanced Application Form - STEP BY STEP */}
        <section
          className={`px-4 py-20 bg-gradient-to-br ${softPinkTheme.sectionBackground}`}
          id="application-form"
        >
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2
                className={`text-4xl font-bold mb-6 text-transparent bg-gradient-to-r ${softPinkTheme.heroText} bg-clip-text`}
              >
                Ứng tuyển ngay hôm nay
              </h2>
              <p className="max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-400">
                Không tìm thấy vị trí phù hợp? Gửi CV và chúng tôi sẽ liên hệ
                khi có opportunity phù hợp
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              <Card
                className={`border-0 ${softPinkTheme.softGlow} bg-gradient-to-br ${softPinkTheme.neoCard} backdrop-blur-sm overflow-hidden`}
              >
                {/* Progress Bar */}
                <div className="h-2 bg-gray-100 dark:bg-gray-700">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${softPinkTheme.primaryGradient}`}
                    initial={{ width: "33%" }}
                    animate={{ width: `${(currentStep / 3) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>

                <CardHeader className="text-center pb-8">
                  <CardTitle className="flex flex-col sm:flex-row items-center justify-center gap-3 text-2xl">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`w-12 h-12 bg-gradient-to-r ${softPinkTheme.primaryGradient} rounded-2xl flex items-center justify-center ${softPinkTheme.softGlow}`}
                    >
                      <Send className="w-6 h-6 text-white" />
                    </motion.div>
                    <div className="text-center sm:text-left">
                      <div className="text-gray-800 dark:text-gray-100">
                        Gửi hồ sơ ứng tuyển
                      </div>
                      <div className="text-base text-gray-600 dark:text-gray-400 font-normal mt-1">
                        Bước {currentStep} / 3 -{" "}
                        {currentStep === 1
                          ? "Thông tin cơ bản"
                          : currentStep === 2
                            ? "Chi tiết chuyên môn"
                            : "Hoàn tất hồ sơ"}
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>

                <CardContent className="px-6 lg:px-8 pb-8">
                  <AnimatePresence mode="wait">
                    {isSubmitted ? (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
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
                          <CheckCircle className="w-24 h-24 mx-auto mb-6 text-emerald-500" />
                        </motion.div>
                        <h3 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                          🎉 Chúc mừng!
                        </h3>
                        <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
                          Hồ sơ của bạn đã được gửi thành công
                        </p>
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-6 max-w-md mx-auto">
                          <p className="text-emerald-800 dark:text-emerald-300">
                            ✅ Chúng tôi sẽ review hồ sơ trong 3-5 ngày làm việc
                            <br />
                            📧 Email xác nhận đã được gửi
                            <br />
                            📞 HR sẽ liên hệ nếu phù hợp
                          </p>
                        </div>
                      </motion.div>
                    ) : (
                      <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-8"
                      >
                        {/* Step 1: Basic Info */}
                        {currentStep === 1 && (
                          <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            className="space-y-6"
                          >
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-base font-semibold text-gray-700 dark:text-gray-300">
                                  <Users className="w-5 h-5 text-pink-500" />
                                  Họ và tên *
                                </Label>
                                <Input
                                  {...register("name")}
                                  placeholder="Nguyễn Văn A"
                                  className={`h-12 ${errors.name ? "border-red-500" : "border-pink-200"} text-gray-800 dark:text-gray-200 focus:ring-pink-300`}
                                />
                                {errors.name && (
                                  <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-red-500 text-sm flex items-center gap-1"
                                  >
                                    ⚠️ {errors.name.message}
                                  </motion.p>
                                )}
                              </div>

                              <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-base font-semibold text-gray-700 dark:text-gray-300">
                                  <Mail className="w-5 h-5 text-pink-500" />
                                  Email *
                                </Label>
                                <Input
                                  {...register("email")}
                                  type="email"
                                  placeholder="example@email.com"
                                  className={`h-12 ${errors.email ? "border-red-500" : "border-pink-200"} text-gray-800 dark:text-gray-200 focus:ring-pink-300`}
                                />
                                {errors.email && (
                                  <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-red-500 text-sm flex items-center gap-1"
                                  >
                                    ⚠️ {errors.email.message}
                                  </motion.p>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-base font-semibold text-gray-700 dark:text-gray-300">
                                  <Phone className="w-5 h-5 text-pink-500" />
                                  Số điện thoại
                                </Label>
                                <Input
                                  {...register("phone")}
                                  placeholder="+84 123 456 789"
                                  className="h-12 border-pink-200 text-gray-800 dark:text-gray-200 focus:ring-pink-300"
                                />
                                {errors.phone && (
                                  <p className="text-red-500 text-sm">
                                    ⚠️ {errors.phone.message}
                                  </p>
                                )}
                              </div>

                              <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-base font-semibold text-gray-700 dark:text-gray-300">
                                  <Briefcase className="w-5 h-5 text-pink-500" />
                                  Vị trí ứng tuyển *
                                </Label>
                                <select
                                  {...register("position")}
                                  className={`w-full h-12 px-3 border rounded-md bg-background border-pink-200 text-gray-800 dark:text-gray-200 focus:ring-pink-300 ${errors.position ? "border-red-500" : ""}`}
                                >
                                  <option value="">Chọn vị trí...</option>
                                  {jobOpenings.map((job) => (
                                    <option key={job.id} value={job.title}>
                                      {job.title}
                                    </option>
                                  ))}
                                  <option value="other">Vị trí khác</option>
                                </select>
                                {errors.position && (
                                  <p className="text-red-500 text-sm">
                                    ⚠️ {errors.position.message}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-base font-semibold text-gray-700 dark:text-gray-300">
                                  <BarChart className="w-5 h-5 text-pink-500" />
                                  Kinh nghiệm *
                                </Label>
                                <select
                                  {...register("experience")}
                                  className={`w-full h-12 px-3 border rounded-md bg-background border-pink-200 text-gray-800 dark:text-gray-200 focus:ring-pink-300 ${errors.experience ? "border-red-500" : ""}`}
                                >
                                  <option value="">
                                    Chọn mức kinh nghiệm...
                                  </option>
                                  <option value="0-1">Fresher (0-1 năm)</option>
                                  <option value="1-3">Junior (1-3 năm)</option>
                                  <option value="3-5">Middle (3-5 năm)</option>
                                  <option value="5+">Senior (5+ năm)</option>
                                </select>
                                {errors.experience && (
                                  <p className="text-red-500 text-sm">
                                    ⚠️ {errors.experience.message}
                                  </p>
                                )}
                              </div>

                              <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-base font-semibold text-gray-700 dark:text-gray-300">
                                  <Calendar className="w-5 h-5 text-pink-500" />
                                  Ngày có thể bắt đầu *
                                </Label>
                                <select
                                  {...register("startDate")}
                                  className={`w-full h-12 px-3 border rounded-md bg-background border-pink-200 text-gray-800 dark:text-gray-200 focus:ring-pink-300 ${errors.startDate ? "border-red-500" : ""}`}
                                >
                                  <option value="">Chọn thời gian...</option>
                                  <option value="immediate">
                                    Ngay lập tức
                                  </option>
                                  <option value="1-week">Trong 1 tuần</option>
                                  <option value="2-weeks">Trong 2 tuần</option>
                                  <option value="1-month">Trong 1 tháng</option>
                                  <option value="negotiable">
                                    Có thể thương lượng
                                  </option>
                                </select>
                                {errors.startDate && (
                                  <p className="text-red-500 text-sm">
                                    ⚠️ {errors.startDate.message}
                                  </p>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* Step 2: Professional Details */}
                        {currentStep === 2 && (
                          <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            className="space-y-6"
                          >
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-base font-semibold text-gray-700 dark:text-gray-300">
                                  <DollarSign className="w-5 h-5 text-pink-500" />
                                  Mức lương mong muốn
                                </Label>
                                <select
                                  {...register("salary")}
                                  className="w-full h-12 px-3 border rounded-md bg-background border-pink-200 text-gray-800 dark:text-gray-200 focus:ring-pink-300"
                                >
                                  <option value="">Chọn mức lương...</option>
                                  <option value="500-1000">
                                    $500 - $1,000
                                  </option>
                                  <option value="1000-1500">
                                    $1,000 - $1,500
                                  </option>
                                  <option value="1500-2000">
                                    $1,500 - $2,000
                                  </option>
                                  <option value="2000-3000">
                                    $2,000 - $3,000
                                  </option>
                                  <option value="3000+">$3,000+</option>
                                  <option value="negotiable">
                                    Thương lượng
                                  </option>
                                </select>
                              </div>

                              <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-base font-semibold text-gray-700 dark:text-gray-300">
                                  <Clock className="w-5 h-5 text-pink-500" />
                                  Hình thức làm việc *
                                </Label>
                                <select
                                  {...register("workType")}
                                  className={`w-full h-12 px-3 border rounded-md bg-background border-pink-200 text-gray-800 dark:text-gray-200 focus:ring-pink-300 ${errors.workType ? "border-red-500" : ""}`}
                                >
                                  <option value="">Chọn hình thức...</option>
                                  <option value="onsite">
                                    Onsite (tại văn phòng)
                                  </option>
                                  <option value="remote">
                                    Remote (làm từ xa)
                                  </option>
                                  <option value="hybrid">
                                    Hybrid (kết hợp)
                                  </option>
                                </select>
                                {errors.workType && (
                                  <p className="text-red-500 text-sm">
                                    ⚠️ {errors.workType.message}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-base font-semibold text-gray-700 dark:text-gray-300">
                                  <Globe className="w-5 h-5 text-pink-500" />
                                  Portfolio / Website
                                </Label>
                                <Input
                                  {...register("portfolio")}
                                  placeholder="https://yourportfolio.com"
                                  className="h-12 border-pink-200 text-gray-800 dark:text-gray-200 focus:ring-pink-300"
                                />
                                {errors.portfolio && (
                                  <p className="text-red-500 text-sm">
                                    ⚠️ {errors.portfolio.message}
                                  </p>
                                )}
                              </div>

                              <div className="space-y-2">
                                <Label className="flex items-center gap-2 text-base font-semibold text-gray-700 dark:text-gray-300">
                                  <Users className="w-5 h-5 text-pink-500" />
                                  LinkedIn Profile
                                </Label>
                                <Input
                                  {...register("linkedin")}
                                  placeholder="https://linkedin.com/in/yourprofile"
                                  className="h-12 border-pink-200 text-gray-800 dark:text-gray-200 focus:ring-pink-300"
                                />
                                {errors.linkedin && (
                                  <p className="text-red-500 text-sm">
                                    ⚠️ {errors.linkedin.message}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="space-y-4">
                              <Label className="flex items-center gap-2 text-base font-semibold text-gray-700 dark:text-gray-300">
                                <Code className="w-5 h-5 text-pink-500" />
                                Kỹ năng chuyên môn * (chọn ít nhất 1)
                              </Label>
                              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {skillsList.map((skill) => (
                                  <motion.button
                                    key={skill}
                                    type="button"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleSkillToggle(skill)}
                                    className={`p-3 rounded-lg border-2 transition-all text-sm font-medium ${
                                      selectedSkills.includes(skill)
                                        ? "border-pink-500 bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300"
                                        : "border-pink-200 dark:border-pink-700 hover:border-pink-300 hover:bg-pink-50 dark:hover:bg-pink-900/10 text-gray-700 dark:text-gray-300"
                                    }`}
                                  >
                                    {skill}
                                  </motion.button>
                                ))}
                              </div>
                              {errors.skills && (
                                <p className="text-red-500 text-sm">
                                  ⚠️ {errors.skills.message}
                                </p>
                              )}
                            </div>
                          </motion.div>
                        )}

                        {/* Step 3: Cover Letter */}
                        {currentStep === 3 && (
                          <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            className="space-y-6"
                          >
                            <div className="space-y-2">
                              <Label className="flex items-center gap-2 text-base font-semibold text-gray-700 dark:text-gray-300">
                                <MessageSquare className="w-5 h-5 text-pink-500" />
                                Thư xin việc (Cover Letter) *
                              </Label>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Hãy chia sẻ về bản thân, kinh nghiệm và lý do
                                bạn muốn gia nhập đội ngũ của chúng tôi
                              </p>
                              <Textarea
                                {...register("coverLetter")}
                                placeholder="Tôi là một developer đam mê với 3 năm kinh nghiệm trong React/Node.js. Tôi muốn gia nhập Template Market vì..."
                                rows={8}
                                className={`resize-none border-pink-200 text-gray-800 dark:text-gray-200 focus:ring-pink-300 ${errors.coverLetter ? "border-red-500" : ""}`}
                              />
                              {errors.coverLetter && (
                                <p className="text-red-500 text-sm">
                                  ⚠️ {errors.coverLetter.message}
                                </p>
                              )}
                            </div>

                            <div className="bg-gradient-to-r from-pink-50/50 to-rose-50/50 dark:from-pink-900/20 dark:to-rose-900/20 p-6 rounded-xl border border-pink-200 dark:border-pink-700">
                              <h4 className="font-bold mb-3 flex items-center gap-2 text-gray-800 dark:text-gray-200">
                                <Lightbulb className="w-5 h-5 text-pink-500" />
                                Tips để viết cover letter tốt:
                              </h4>
                              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                {[
                                  "Giới thiệu ngắn gọn về bản thân và background",
                                  "Nêu rõ kinh nghiệm và skills phù hợp với vị trí",
                                  "Chia sẻ lý do muốn làm việc tại Template Market",
                                  "Đề cập đến những thành tích nổi bật (nếu có)",
                                ].map((tip, idx) => (
                                  <li
                                    key={idx}
                                    className="flex items-start gap-2"
                                  >
                                    <CheckCircle className="w-4 h-4 text-pink-500 mt-0.5 flex-shrink-0" />
                                    {tip}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="text-center p-4 bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800 rounded-xl">
                              <p className="text-sm text-pink-800 dark:text-pink-300">
                                📄 <strong>Lưu ý:</strong> Bạn có thể gửi CV qua
                                email{" "}
                                <a
                                  href="mailto:careers@templatemarket.vn"
                                  className="underline font-semibold hover:text-pink-900 dark:hover:text-pink-200"
                                >
                                  careers@templatemarket.vn
                                </a>{" "}
                                sau khi submit form này
                              </p>
                            </div>
                          </motion.div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex items-center justify-between pt-8 border-t border-pink-200 dark:border-pink-700">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={prevStep}
                            disabled={currentStep === 1}
                            className="flex items-center gap-2 border-pink-200 hover:bg-pink-50"
                          >
                            <ArrowRight className="w-4 h-4 rotate-180" />
                            Quay lại
                          </Button>

                          <div className="flex items-center gap-2">
                            {[1, 2, 3].map((step) => (
                              <div
                                key={step}
                                className={`w-3 h-3 rounded-full transition-all ${
                                  step === currentStep
                                    ? "bg-pink-500 scale-125"
                                    : step < currentStep
                                      ? "bg-emerald-500"
                                      : "bg-gray-300 dark:bg-gray-600"
                                }`}
                              />
                            ))}
                          </div>

                          {currentStep < 3 ? (
                            <Button
                              type="button"
                              onClick={nextStep}
                              className={`bg-gradient-to-r ${softPinkTheme.primaryGradient} hover:scale-105 text-white border-0 transition-all`}
                            >
                              Tiếp theo
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                          ) : (
                            <Button
                              type="submit"
                              disabled={isSubmitting}
                              className={`bg-gradient-to-r ${softPinkTheme.secondaryGradient} hover:scale-105 px-8 text-white border-0 transition-all`}
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
                                    className="w-5 h-5 mr-2 border-2 border-white rounded-full border-t-transparent"
                                  />
                                  Đang gửi...
                                </>
                              ) : (
                                <>
                                  <Send className="w-5 h-5 mr-2" />
                                  Gửi hồ sơ
                                  <Rocket className="w-5 h-5 ml-2" />
                                </>
                              )}
                            </Button>
                          )}
                        </div>

                        <div className="text-center text-sm text-gray-600 dark:text-gray-400 pt-4">
                          <p>
                            Bằng cách gửi form này, bạn đồng ý với{" "}
                            <a
                              href="/privacy"
                              className="text-pink-600 dark:text-pink-400 hover:underline"
                            >
                              chính sách bảo mật
                            </a>{" "}
                            của chúng tôi
                          </p>
                        </div>
                      </form>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* ✅ Enhanced CTA Section - PINK THEME */}
        <section
          className={`relative px-4 py-20 overflow-hidden bg-gradient-to-r ${softPinkTheme.primaryGradient}`}
        >
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-black/10"></div>
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-24 h-24 bg-white/10 rounded-full blur-xl"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.2, 0.8, 0.2],
                }}
                transition={{
                  duration: 8 + i * 2,
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
              className="max-w-4xl mx-auto space-y-8 text-white"
            >
              <h2 className="text-4xl font-bold lg:text-5xl">
                Ready to build the future together?
              </h2>
              <p className="text-xl opacity-90 leading-relaxed">
                Chúng tôi luôn tìm kiếm những tài năng xuất sắc để cùng tạo ra
                những sản phẩm công nghệ tác động tích cực đến hàng triệu người
                dùng trên toàn thế giới.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-pink-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 px-8 py-4"
                  asChild
                >
                  <a href="/contact">
                    <MessageSquare className="w-6 h-6 mr-3" />
                    Liên hệ HR Team
                    <ArrowRight className="w-6 h-6 ml-3" />
                  </a>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="text-white border-white hover:bg-white hover:text-pink-600 shadow-xl hover:shadow-2xl transition-all duration-300 px-8 py-4"
                  asChild
                >
                  <a href="mailto:careers@templatemarket.vn">
                    <Mail className="w-6 h-6 mr-3" />
                    careers@templatemarket.vn
                  </a>
                </Button>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-8 pt-8 opacity-80">
                <div className="text-center">
                  <div className="text-2xl font-bold">48h</div>
                  <div className="text-sm">Response time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">95%</div>
                  <div className="text-sm">Interview rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">4.9⭐</div>
                  <div className="text-sm">Employee rating</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Careers;
