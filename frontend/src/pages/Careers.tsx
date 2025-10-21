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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
  Code,
  Palette,
  GraduationCap,
  Heart,
  Star,
  Clock,
  MapPin,
  DollarSign,
  TrendingUp,
  Globe,
  Shield,
  Zap,
  Gift,
  Target,
  Rocket,
  Crown,
  Coffee,
  Headphones,
  Database,
  Settings,
  Mail,
  Phone,
  MessageSquare,
  FileText,
  Upload,
  ArrowUp,
  Search,
  Send,
  XCircle,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

// ============================================
// SOFT PINK THEME
// ============================================
const softPinkTheme = {
  pageBackground: "from-pink-50/70 via-rose-50/60 to-red-50/50",
  primaryGradient: "from-pink-500 via-rose-500 to-red-500",
  heroText: "from-pink-700 via-rose-600 to-red-600",
  accentText: "from-rose-600 via-pink-600 to-red-600",
  glow: "shadow-pink-200/60 shadow-2xl",
  softGlow: "shadow-pink-200/40 shadow-lg",
};

// ============================================
// STAR BACKGROUND PATTERN
// ============================================
const StarBackgroundPattern = () => (
  <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.08 }}>
    <defs>
      <pattern
        id="starPattern"
        x="0"
        y="0"
        width="200"
        height="200"
        patternUnits="userSpaceOnUse"
      >
        <g transform="translate(50, 50)">
          <path
            d="M 0,-30 L 7,-10 L 30,-10 L 12,5 L 19,25 L 0,12 L -19,25 L -12,5 L -30,-10 L -7,-10 Z"
            fill="url(#starGradient1)"
            opacity="0.6"
          />
        </g>
        <g transform="translate(150, 120)">
          <path
            d="M 0,-20 L 5,-7 L 20,-7 L 8,3 L 13,17 L 0,8 L -13,17 L -8,3 L -20,-7 L -5,-7 Z"
            fill="url(#starGradient2)"
            opacity="0.5"
          />
        </g>
        <g transform="translate(30, 150)">
          <path
            d="M 0,-12 L 3,-4 L 12,-4 L 5,2 L 8,10 L 0,5 L -8,10 L -5,2 L -12,-4 L -3,-4 Z"
            fill="url(#starGradient3)"
            opacity="0.4"
          />
        </g>
        <g transform="translate(100, 30)">
          <circle
            cx="0"
            cy="0"
            r="3"
            fill="url(#starGradient4)"
            opacity="0.6"
          />
          <path
            d="M 0,-8 L 1,-2 L 8,0 L 1,2 L 0,8 L -1,2 L -8,0 L -1,-2 Z"
            fill="url(#starGradient4)"
            opacity="0.3"
          />
        </g>
        <g transform="translate(170, 70)">
          <path
            d="M 0,-18 L 4,-6 L 18,-6 L 7,3 L 11,15 L 0,7 L -11,15 L -7,3 L -18,-6 L -4,-6 Z"
            fill="url(#starGradient1)"
            opacity="0.5"
          />
        </g>
      </pattern>

      <linearGradient id="starGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#FDE68A", stopOpacity: 1 }} />
        <stop offset="50%" style={{ stopColor: "#FCA5A5", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#FBCFE8", stopOpacity: 1 }} />
      </linearGradient>
      <linearGradient id="starGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#FBCFE8", stopOpacity: 1 }} />
        <stop offset="50%" style={{ stopColor: "#FCA5A5", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#FECACA", stopOpacity: 1 }} />
      </linearGradient>
      <linearGradient id="starGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#FEF3C7", stopOpacity: 1 }} />
        <stop offset="50%" style={{ stopColor: "#FBCFE8", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#FCA5A5", stopOpacity: 1 }} />
      </linearGradient>
      <linearGradient id="starGradient4" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#FDE68A", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#FBCFE8", stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#starPattern)" />
  </svg>
);

// ============================================
// FLOATING ICONS
// ============================================
const FloatingIcons = () => {
  const icons = [
    {
      Icon: Briefcase,
      color: "from-pink-50 to-rose-100",
      position: "top-10 right-20",
      size: "text-6xl",
    },
    {
      Icon: Users,
      color: "from-rose-50 to-red-100",
      position: "top-32 left-10",
      size: "text-5xl",
    },
    {
      Icon: Code,
      color: "from-red-50 to-pink-100",
      position: "bottom-20 right-10",
      size: "text-7xl",
    },
    {
      Icon: Award,
      color: "from-pink-100 to-rose-50",
      position: "bottom-32 left-20",
      size: "text-6xl",
    },
    {
      Icon: Laptop,
      color: "from-rose-100 to-pink-50",
      position: "top-1/2 right-1/4",
      size: "text-5xl",
    },
    {
      Icon: Lightbulb,
      color: "from-red-50 to-rose-100",
      position: "top-1/3 left-1/3",
      size: "text-6xl",
    },
    {
      Icon: Rocket,
      color: "from-pink-50 to-red-100",
      position: "bottom-1/3 right-1/3",
      size: "text-5xl",
    },
    {
      Icon: Heart,
      color: "from-rose-50 to-pink-100",
      position: "top-2/3 left-1/4",
      size: "text-6xl",
    },
    {
      Icon: Star,
      color: "from-red-100 to-rose-50",
      position: "top-1/4 right-1/2",
      size: "text-4xl",
    },
    {
      Icon: Gift,
      color: "from-pink-100 to-red-50",
      position: "bottom-1/4 left-1/2",
      size: "text-5xl",
    },
    {
      Icon: Sparkles,
      color: "from-rose-100 to-red-50",
      position: "top-3/4 right-20",
      size: "text-6xl",
    },
    {
      Icon: Crown,
      color: "from-pink-50 to-rose-100",
      position: "bottom-40 left-10",
      size: "text-5xl",
    },
    {
      Icon: Target,
      color: "from-red-50 to-pink-50",
      position: "top-40 right-40",
      size: "text-6xl",
    },
    {
      Icon: Zap,
      color: "from-rose-50 to-red-50",
      position: "bottom-1/2 right-10",
      size: "text-5xl",
    },
    {
      Icon: Globe,
      color: "from-pink-100 to-rose-100",
      position: "top-1/2 left-10",
      size: "text-6xl",
    },
    {
      Icon: Coffee,
      color: "from-red-100 to-pink-100",
      position: "bottom-1/4 right-1/4",
      size: "text-5xl",
    },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {icons.map((item, i) => (
        <motion.div
          key={i}
          className={`absolute ${item.position}`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 15, -15, 0],
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            delay: i * 0.8,
            ease: "easeInOut",
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
  );
};

// ============================================
// FORM VALIDATION SCHEMA
// ============================================
const applicationSchema = z.object({
  fullName: z.string().min(2, "Tên phải có ít nhất 2 ký tự").max(100),
  email: z.string().email("Email không hợp lệ"),
  phone: z
    .string()
    .regex(/^[\d\s\-\+\(\)]{10,15}$/, "Số điện thoại không hợp lệ"),
  position: z.string().min(1, "Vui lòng chọn vị trí"),
  experience: z.string().min(1, "Vui lòng chọn kinh nghiệm"),
  coverLetter: z
    .string()
    .min(100, "Thư xin việc phải có ít nhất 100 ký tự")
    .max(2000),
  portfolio: z.string().url("URL không hợp lệ").optional().or(z.literal("")),
  linkedin: z.string().url("URL không hợp lệ").optional().or(z.literal("")),
});

type ApplicationData = z.infer<typeof applicationSchema>;

// ============================================
// MAIN COMPONENT
// ============================================
const Careers: React.FC = () => {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");
  const [showFloatingNav, setShowFloatingNav] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const { scrollYProgress } = useScroll();
  const headerY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ApplicationData>({
    resolver: zodResolver(applicationSchema),
  });

  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingNav(window.scrollY > 500);
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(Math.min(progress, 100));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const stats = [
    { icon: Users, value: "250+", label: "Thành viên", color: "text-pink-600" },
    { icon: Globe, value: "45+", label: "Quốc gia", color: "text-rose-600" },
    {
      icon: Briefcase,
      value: "18",
      label: "Vị trí tuyển dụng",
      color: "text-red-600",
    },
    {
      icon: Award,
      value: "4.8/5",
      label: "Đánh giá nhân viên",
      color: "text-pink-700",
    },
  ];

  const benefits = [
    {
      icon: DollarSign,
      title: "Lương cạnh tranh",
      description:
        "Mức lương thuộc top 10% thị trường công nghệ, xét tăng lương 6 tháng/lần dựa trên hiệu suất làm việc",
      gradient: "from-pink-500 to-rose-500",
    },
    {
      icon: Heart,
      title: "Bảo hiểm sức khỏe",
      description:
        "Bảo hiểm cao cấp cho nhân viên và gia đình, chăm sóc răng miệng, khám sức khỏe định kỳ toàn diện",
      gradient: "from-rose-500 to-red-500",
    },
    {
      icon: Laptop,
      title: "Làm việc từ xa",
      description:
        "100% remote hoặc hybrid tùy chọn, giờ giấc linh hoạt, làm việc từ bất kỳ đâu trên thế giới",
      gradient: "from-red-500 to-pink-500",
    },
    {
      icon: GraduationCap,
      title: "Ngân sách học tập",
      description:
        "$2000/năm cho khóa học, hội nghị, sách vở, chứng chỉ. Truy cập không giới hạn Udemy Business",
      gradient: "from-pink-600 to-rose-600",
    },
    {
      icon: Coffee,
      title: "Cân bằng công việc",
      description:
        "20 ngày phép/năm + 10 ngày nghỉ ốm, nghỉ sức khỏe tinh thần, cà phê & đồ ăn nhẹ không giới hạn",
      gradient: "from-rose-600 to-red-600",
    },
    {
      icon: Rocket,
      title: "Phát triển sự nghiệp",
      description:
        "Lộ trình nghề nghiệp rõ ràng, chương trình mentorship, đào tạo lãnh đạo, cơ hội thăng tiến nội bộ",
      gradient: "from-red-600 to-pink-600",
    },
  ];

  const jobs = [
    {
      id: "fe-senior",
      title: "Frontend Developer (Senior)",
      department: "Kỹ thuật",
      location: "Remote / Hà Nội",
      type: "Toàn thời gian",
      salary: "$3000 - $5000",
      experience: "3+ năm",
      description:
        "Xây dựng và bảo trì các ứng dụng frontend với React, TypeScript, Next.js. Làm việc với đội thiết kế để triển khai giao diện hoàn hảo.",
      requirements: [
        "3+ năm kinh nghiệm với React và TypeScript",
        "Thành thạo CSS, Tailwind CSS, thiết kế responsive",
        "Kinh nghiệm với Next.js, các khái niệm SSR, SSG",
        "Hiểu sâu về tối ưu hóa hiệu suất",
        "Git workflow, CI/CD, testing (Jest, Cypress)",
      ],
      responsibilities: [
        "Phát triển tính năng mới cho người dùng",
        "Xây dựng components và thư viện tái sử dụng",
        "Tối ưu hóa ứng dụng cho tốc độ tối đa",
        "Hợp tác với đội backend",
        "Code review và hướng dẫn developers junior",
      ],
      skills: ["React", "TypeScript", "Next.js", "Tailwind", "GraphQL"],
    },
    {
      id: "be-senior",
      title: "Backend Engineer (Senior)",
      department: "Kỹ thuật",
      location: "Remote / TP.HCM",
      type: "Toàn thời gian",
      salary: "$3500 - $6000",
      experience: "4+ năm",
      description:
        "Thiết kế và triển khai các dịch vụ backend có khả năng mở rộng, APIs, cơ sở dữ liệu. Làm việc với kiến trúc microservices và hạ tầng đám mây.",
      requirements: [
        "4+ năm với Node.js hoặc Python/Go",
        "Kiến thức vững về database (PostgreSQL, MongoDB, Redis)",
        "Kinh nghiệm với microservices, Docker, Kubernetes",
        "Thiết kế RESTful APIs, GraphQL",
        "Dịch vụ đám mây AWS/GCP",
      ],
      responsibilities: [
        "Thiết kế kiến trúc backend có khả năng mở rộng",
        "Phát triển và bảo trì RESTful/GraphQL APIs",
        "Thiết kế schema database và tối ưu hóa",
        "Triển khai chiến lược caching",
        "Giám sát và cải thiện hiệu suất hệ thống",
      ],
      skills: ["Node.js", "PostgreSQL", "Docker", "AWS", "Redis"],
    },
    {
      id: "designer-ui",
      title: "UI/UX Designer",
      department: "Thiết kế",
      location: "Remote / Đà Nẵng",
      type: "Toàn thời gian",
      salary: "$2000 - $4000",
      experience: "2+ năm",
      description:
        "Tạo ra trải nghiệm người dùng đặc biệt cho web và mobile apps. Làm việc chặt chẽ với đội sản phẩm và kỹ thuật.",
      requirements: [
        "2+ năm kinh nghiệm trong thiết kế UI/UX",
        "Thành thạo Figma, Adobe Creative Suite",
        "Portfolio mạnh về thiết kế web/mobile",
        "Hiểu biết về design systems",
        "Kiến thức cơ bản HTML/CSS là lợi thế",
      ],
      responsibilities: [
        "Thiết kế giao diện người dùng cho web và mobile",
        "Tạo wireframes, prototypes, mockups",
        "Thực hiện nghiên cứu người dùng và kiểm tra usability",
        "Bảo trì design system và thư viện components",
        "Hợp tác với developers",
      ],
      skills: ["Figma", "Adobe XD", "Sketch", "Prototyping", "User Research"],
    },
    {
      id: "product-manager",
      title: "Product Manager",
      department: "Sản phẩm",
      location: "Remote / Hà Nội",
      type: "Toàn thời gian",
      salary: "$4000 - $7000",
      experience: "5+ năm",
      description:
        "Dẫn dắt chiến lược và lộ trình sản phẩm. Làm việc với các đội cross-functional để cung cấp các tính năng có tác động cao.",
      requirements: [
        "5+ năm trong quản lý sản phẩm",
        "Tư duy phân tích và chiến lược mạnh mẽ",
        "Kinh nghiệm với phương pháp Agile/Scrum",
        "Ra quyết định dựa trên dữ liệu",
        "Kỹ năng giao tiếp xuất sắc",
      ],
      responsibilities: [
        "Định nghĩa tầm nhìn và chiến lược sản phẩm",
        "Ưu tiên tính năng và quản lý roadmap",
        "Làm việc với stakeholders",
        "Phân tích metrics và phản hồi người dùng",
        "Dẫn dắt các đợt ra mắt sản phẩm",
      ],
      skills: ["Product Strategy", "Analytics", "Agile", "SQL", "A/B Testing"],
    },
    {
      id: "devops",
      title: "DevOps Engineer",
      department: "Kỹ thuật",
      location: "Remote",
      type: "Toàn thời gian",
      salary: "$3500 - $6000",
      experience: "3+ năm",
      description:
        "Xây dựng và bảo trì CI/CD pipelines, tự động hóa hạ tầng, hệ thống giám sát.",
      requirements: [
        "3+ năm kinh nghiệm DevOps",
        "Thành thạo Docker, Kubernetes",
        "Công cụ CI/CD (Jenkins, GitLab CI, GitHub Actions)",
        "Infrastructure as Code (Terraform, Ansible)",
        "Nền tảng đám mây AWS/GCP/Azure",
      ],
      responsibilities: [
        "Bảo trì CI/CD pipelines",
        "Tự động hóa hạ tầng",
        "Thiết lập giám sát và cảnh báo",
        "Bảo mật và tuân thủ",
        "Phản ứng sự cố",
      ],
      skills: ["Docker", "Kubernetes", "Terraform", "AWS", "Monitoring"],
    },
    {
      id: "marketing",
      title: "Quản lý Marketing Kỹ thuật số",
      department: "Marketing",
      location: "Remote / TP.HCM",
      type: "Toàn thời gian",
      salary: "$2500 - $4500",
      experience: "3+ năm",
      description:
        "Lập kế hoạch và thực hiện các chiến dịch marketing kỹ thuật số trên nhiều kênh để thúc đẩy tăng trưởng.",
      requirements: [
        "3+ năm kinh nghiệm marketing kỹ thuật số",
        "Thành thạo SEO, SEM, social media",
        "Chứng chỉ Google Analytics, Google Ads",
        "Kinh nghiệm content marketing",
        "Kỹ năng phân tích dữ liệu",
      ],
      responsibilities: [
        "Phát triển chiến lược marketing",
        "Quản lý chiến dịch SEO/SEM",
        "Quản lý social media",
        "Điều phối tạo nội dung",
        "Analytics và báo cáo",
      ],
      skills: [
        "SEO",
        "Google Ads",
        "Analytics",
        "Content Marketing",
        "Social Media",
      ],
    },
  ];

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment =
      filterDepartment === "all" || job.department === filterDepartment;
    const matchesLocation =
      filterLocation === "all" || job.location.includes(filterLocation);
    return matchesSearch && matchesDepartment && matchesLocation;
  });

  const departments = [
    "all",
    ...Array.from(new Set(jobs.map((j) => j.department))),
  ];
  const locations = ["all", "Remote", "Hà Nội", "TP.HCM", "Đà Nẵng"];

  const onSubmit = useCallback(
    async (data: ApplicationData) => {
      try {
        console.log("Đơn ứng tuyển đã gửi:", data);
        toast({
          title: "Đã gửi đơn ứng tuyển!",
          description:
            "Chúng tôi sẽ xem xét và liên hệ trong 3-5 ngày làm việc.",
        });
        reset();
      } catch (error) {
        toast({
          title: "Lỗi",
          description: "Có lỗi xảy ra. Vui lòng thử lại sau.",
          variant: "destructive",
        });
      }
    },
    [reset],
  );

  const ReadingProgress = () => (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
      <motion.div
        className={`h-full bg-gradient-to-r ${softPinkTheme.primaryGradient}`}
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );

  const FloatingNav = () => (
    <AnimatePresence>
      {showFloatingNav && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-8 right-8 z-40"
        >
          <Button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className={`bg-gradient-to-r ${softPinkTheme.primaryGradient} text-white w-12 h-12 rounded-full`}
          >
            <ArrowUp className="w-5 h-5" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <Helmet>
        <title>Tuyển dụng | Template Market - Tham gia đội ngũ tuyệt vời</title>
        <meta
          name="description"
          content="Tham gia đội ngũ Template Market. 18 vị trí đang tuyển. Lương cạnh tranh, làm việc remote, phúc lợi tốt. Ứng tuyển ngay!"
        />
        <link rel="canonical" href="https://templatemarket.com/careers" />
      </Helmet>

      <ReadingProgress />
      <FloatingNav />

      <div
        className={`min-h-screen bg-gradient-to-br ${softPinkTheme.pageBackground} overflow-hidden relative`}
      >
        <div className="fixed inset-0 z-0">
          <StarBackgroundPattern />
        </div>
        <FloatingIcons />

        {/* HERO */}
        <motion.section
          className="relative py-20 lg:py-32 overflow-hidden z-10"
          style={{ y: headerY, opacity: headerOpacity }}
        >
          <div className="container relative z-10 px-4 mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-5xl mx-auto"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className={`flex items-center justify-center w-28 h-28 mx-auto mb-8 bg-gradient-to-r ${softPinkTheme.primaryGradient} rounded-3xl ${softPinkTheme.glow}`}
              >
                <Briefcase className="w-14 h-14 text-white" />
              </motion.div>

              <h1 className="mb-8 text-5xl lg:text-7xl font-bold">
                <span
                  className={`text-transparent bg-gradient-to-r ${softPinkTheme.heroText} bg-clip-text`}
                >
                  Tham gia đội ngũ chúng tôi
                </span>
                <br />
                <span className="text-2xl lg:text-3xl font-medium text-gray-700">
                  Cùng xây dựng tương lai
                </span>
              </h1>

              <p className="mb-12 text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto">
                Chúng tôi đang tìm kiếm những cá nhân tài năng để cùng thực hiện
                sứ mệnh tạo ra những template tuyệt vời
              </p>

              {/* BADGES */}
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-white/40 backdrop-blur-md rounded-full border border-white/60 shadow-lg"
                >
                  <Briefcase className="w-5 h-5 text-pink-600" />
                  <span className="font-semibold text-gray-800">
                    18 vị trí đang tuyển
                  </span>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-white/40 backdrop-blur-md rounded-full border border-white/60 shadow-lg"
                >
                  <Globe className="w-5 h-5 text-rose-600" />
                  <span className="font-semibold text-gray-800">
                    Remote ưu tiên
                  </span>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center gap-3 px-6 py-3 bg-white/40 backdrop-blur-md rounded-full border border-white/60 shadow-lg"
                >
                  <Heart className="w-5 h-5 text-red-600" />
                  <span className="font-semibold text-gray-800">
                    Phúc lợi tuyệt vời
                  </span>
                </motion.div>
              </div>

              {/* STATS */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    whileHover={{ y: -10, scale: 1.05 }}
                    className="bg-white/60 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/60"
                  >
                    <stat.icon
                      className={`w-8 h-8 mx-auto mb-3 ${stat.color}`}
                    />
                    <div
                      className={`text-3xl font-bold mb-2 text-transparent bg-gradient-to-r ${softPinkTheme.heroText} bg-clip-text`}
                    >
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* BENEFITS */}
        <div className="container relative z-10 px-4 mx-auto max-w-7xl pb-20">
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-800">
                Phúc lợi tuyệt vời
              </h2>
              <p className="text-xl text-gray-600">
                Tại sao bạn sẽ yêu thích làm việc với chúng tôi
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.03 }}
                >
                  <Card className="h-full bg-white/60 backdrop-blur-xl border border-white/60 shadow-lg">
                    <CardContent className="p-6">
                      <div
                        className={`w-14 h-14 rounded-xl bg-gradient-to-r ${benefit.gradient} flex items-center justify-center mb-4`}
                      >
                        <benefit.icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-gray-800">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {benefit.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* JOB LISTINGS */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-800">
                Vị trí tuyển dụng
              </h2>
              <p className="text-xl text-gray-600">
                Tìm vị trí hoàn hảo của bạn
              </p>
            </div>

            {/* FILTERS */}
            <Card className="bg-white/60 backdrop-blur-xl border border-white/60 shadow-lg mb-8">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      placeholder="Tìm kiếm vị trí..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select
                    value={filterDepartment}
                    onValueChange={setFilterDepartment}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Phòng ban" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept === "all" ? "Tất cả phòng ban" : dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={filterLocation}
                    onValueChange={setFilterLocation}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Địa điểm" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((loc) => (
                        <SelectItem key={loc} value={loc}>
                          {loc === "all" ? "Tất cả địa điểm" : loc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* JOBS */}
            <div className="space-y-6">
              {filteredJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-white/60 backdrop-blur-xl border border-white/60 shadow-lg overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-800 mb-2">
                            {job.title}
                          </h3>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <Badge
                              variant="outline"
                              className="bg-pink-100 text-pink-700"
                            >
                              <Building className="w-3 h-3 mr-1" />
                              {job.department}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="bg-rose-100 text-rose-700"
                            >
                              <MapPin className="w-3 h-3 mr-1" />
                              {job.location}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="bg-red-100 text-red-700"
                            >
                              <Clock className="w-3 h-3 mr-1" />
                              {job.type}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="bg-green-100 text-green-700"
                            >
                              <DollarSign className="w-3 h-3 mr-1" />
                              {job.salary}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-4">
                            {job.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {job.skills.map((skill) => (
                              <Badge
                                key={skill}
                                variant="secondary"
                                className="text-xs"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button
                          onClick={() =>
                            setSelectedJob(
                              selectedJob === job.id ? null : job.id,
                            )
                          }
                          className={`ml-4 bg-gradient-to-r ${softPinkTheme.primaryGradient} text-white`}
                        >
                          {selectedJob === job.id ? "Đóng" : "Xem chi tiết"}
                        </Button>
                      </div>

                      <AnimatePresence>
                        {selectedJob === job.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-6 pt-6 border-t border-gray-200"
                          >
                            <Accordion type="single" collapsible>
                              <AccordionItem value="requirements">
                                <AccordionTrigger>Yêu cầu</AccordionTrigger>
                                <AccordionContent>
                                  <ul className="space-y-2">
                                    {job.requirements.map((req, idx) => (
                                      <li
                                        key={idx}
                                        className="flex items-start gap-2"
                                      >
                                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700">
                                          {req}
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                </AccordionContent>
                              </AccordionItem>
                              <AccordionItem value="responsibilities">
                                <AccordionTrigger>Trách nhiệm</AccordionTrigger>
                                <AccordionContent>
                                  <ul className="space-y-2">
                                    {job.responsibilities.map((resp, idx) => (
                                      <li
                                        key={idx}
                                        className="flex items-start gap-2"
                                      >
                                        <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                        <span className="text-gray-700">
                                          {resp}
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>

                            <div className="mt-6 flex gap-4">
                              <Button
                                onClick={() => {
                                  document
                                    .getElementById("application-form")
                                    ?.scrollIntoView({ behavior: "smooth" });
                                }}
                                className={`flex-1 bg-gradient-to-r ${softPinkTheme.primaryGradient} text-white`}
                              >
                                <FileText className="w-5 h-5 mr-2" />
                                Ứng tuyển ngay
                                <ArrowRight className="w-5 h-5 ml-2" />
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* APPLICATION FORM */}
          <motion.section
            id="application-form"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="bg-white/60 backdrop-blur-xl border border-white/60 shadow-lg">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                  <FileText className="w-8 h-8 text-pink-600" />
                  Ứng tuyển vào vị trí
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Điền thông tin dưới đây để gửi đơn ứng tuyển
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="fullName">Họ và tên *</Label>
                      <Input
                        id="fullName"
                        {...register("fullName")}
                        placeholder="Nguyễn Văn A"
                      />
                      {errors.fullName && (
                        <p className="text-sm text-red-500 mt-1">
                          {String(errors.fullName.message)}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register("email")}
                        placeholder="nguyenvana@example.com"
                      />
                      {errors.email && (
                        <p className="text-sm text-red-500 mt-1">
                          {String(errors.email.message)}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="phone">Số điện thoại *</Label>
                      <Input
                        id="phone"
                        {...register("phone")}
                        placeholder="+84 xxx xxx xxx"
                      />
                      {errors.phone && (
                        <p className="text-sm text-red-500 mt-1">
                          {String(errors.phone.message)}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="position">Vị trí *</Label>
                      <Select
                        onValueChange={(value) => setValue("position", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn vị trí" />
                        </SelectTrigger>
                        <SelectContent>
                          {jobs.map((job) => (
                            <SelectItem key={job.id} value={job.title}>
                              {job.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.position && (
                        <p className="text-sm text-red-500 mt-1">
                          {String(errors.position.message)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="experience">Số năm kinh nghiệm *</Label>
                    <Select
                      onValueChange={(value) => setValue("experience", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn kinh nghiệm" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-1">0-1 năm</SelectItem>
                        <SelectItem value="1-3">1-3 năm</SelectItem>
                        <SelectItem value="3-5">3-5 năm</SelectItem>
                        <SelectItem value="5+">5+ năm</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.experience && (
                      <p className="text-sm text-red-500 mt-1">
                        {String(errors.experience.message)}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="coverLetter">Thư xin việc *</Label>
                    <Textarea
                      id="coverLetter"
                      {...register("coverLetter")}
                      placeholder="Hãy cho chúng tôi biết tại sao bạn phù hợp với vị trí này..."
                      rows={6}
                    />
                    {errors.coverLetter && (
                      <p className="text-sm text-red-500 mt-1">
                        {String(errors.coverLetter.message)}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="portfolio">URL Portfolio</Label>
                      <Input
                        id="portfolio"
                        {...register("portfolio")}
                        placeholder="https://yourportfolio.com"
                      />
                      {errors.portfolio && (
                        <p className="text-sm text-red-500 mt-1">
                          {String(errors.portfolio.message)}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="linkedin">Trang LinkedIn</Label>
                      <Input
                        id="linkedin"
                        {...register("linkedin")}
                        placeholder="https://linkedin.com/in/..."
                      />
                      {errors.linkedin && (
                        <p className="text-sm text-red-500 mt-1">
                          {String(errors.linkedin.message)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="resume">CV/Hồ sơ *</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-pink-400 transition-colors cursor-pointer">
                      <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-600 mb-2">
                        Click để tải lên hoặc kéo thả file
                      </p>
                      <p className="text-sm text-gray-500">
                        PDF, DOC, DOCX (tối đa 5MB)
                      </p>
                      <Input
                        id="resume"
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className={`w-full bg-gradient-to-r ${softPinkTheme.primaryGradient} text-white text-lg py-6`}
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Gửi đơn ứng tuyển
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.section>
        </div>
      </div>
    </>
  );
};

export default Careers;
