import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  MapPin,
  Phone,
  Send,
  ArrowUp,
  Heart,
  Star,
  Users,
  Download,
  Shield,
  Award,
  Clock,
  Globe,
  Zap,
  CheckCircle,
  GraduationCap,
  ExternalLink,
  Github,
  Linkedin,
  MessageCircle,
  LayoutTemplate,
  Notebook,
  Contact,
  Store,
  BookLock,
  HelpCircle,
  MessageSquare,
  Lock,
  FileText,
  CreditCard,
  Code,
  Briefcase,
  Calendar,
  DollarSign,
  TrendingUp,
  Target,
  Sparkles,
  Rocket,
  Trophy,
  Building,
  PieChart,
  BarChart3,
  Activity,
  Layers,
  Package,
  Settings,
  Database,
  Cloud,
  Smartphone,
  Monitor,
  Camera,
  Headphones,
  Music,
  Video,
  Image,
  Edit,
  Palette,
  Brush,
  PenTool,
  Type,
  Crop,
  Filter,
  Archive,
  Bookmark,
  Flag,
  Tag,
  Search,
  Menu,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  X,
  Check,
  AlertCircle,
  Info,
  Lightbulb,
  Bell,
  Volume2,
  Wifi,
  Battery,
  Signal,
  Bluetooth,
  Printer,
  Mouse,
  Keyboard,
  Gamepad2,
  Joystick,
  Cpu,
  HardDrive,
  Power,
  Plug,
  Truck,
  Car,
  Plane,
  Ship,
  Train,
  Bus,
  Bike,
  MapPin as LocationIcon,
  Navigation,
  Compass,
  Route,
  Map,
  Home,
  Building2,
  Factory,
  School,
  Hospital,
  ShoppingBag,
  Utensils,
  Coffee,
  Pizza,
  IceCream,
  Wine,
  Beer,
  Cake,
  Apple,
  Banana,
  Cherry,
  Grape,
  Sun,
  Moon,
  Cloud as CloudIcon,
  CloudRain,
  CloudSnow,
  Snowflake,
  Wind,
  Thermometer,
  Umbrella,
  Rainbow,
  Sunrise,
  Sunset,
  Eye,
  EyeOff,
  Smile,
  Frown,
  Laugh,
  Angry,
  Save,
  Crown,
  Gem,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getFeaturedPosts, getAllCategories } from "@/lib/blog";
import type { BlogPost, BlogCategory } from "@/types/blog";

const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("company");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [newsletterStep, setNewsletterStep] = useState(1);
  const [preferences, setPreferences] = useState({
    updates: false,
    offers: false,
    newsletter: false,
  });
  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // ✅ Blog Posts State - Real-time from Supabase
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [blogCategories, setBlogCategories] = useState<BlogCategory[]>([]);
  const [blogLoading, setBlogLoading] = useState(true);

  const { scrollYProgress } = useScroll();
  const headerY = useTransform(scrollYProgress, [0, 0.2], [0, -30]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);

  // ✅ Enhanced Purple-Magenta-Rose Color Schemes
  const colorSchemes = {
    primary: {
      gradient: "from-purple-500 via-violet-500 to-indigo-500",
      bg: "from-purple-50/80 to-violet-50/80",
      darkBg: "from-purple-900/30 to-violet-900/30",
    },
    secondary: {
      gradient: "from-magenta-500 via-pink-500 to-rose-500",
      bg: "from-magenta-50/80 to-pink-50/80",
      darkBg: "from-magenta-900/30 to-pink-900/30",
    },
    accent: {
      gradient: "from-rose-500 via-pink-500 to-fuchsia-500",
      bg: "from-rose-50/80 to-pink-50/80",
      darkBg: "from-rose-900/30 to-pink-900/30",
    },
    success: {
      gradient: "from-emerald-500 via-teal-500 to-cyan-500",
      bg: "from-emerald-50/80 to-teal-50/80",
      darkBg: "from-emerald-900/30 to-teal-900/30",
    },
    footer: {
      // ✅ Vibrant Purple-Magenta-Rose Footer Gradient
      gradient: "from-purple-500 via-fuchsia-500 via-pink-500 to-rose-500",
      darkGradient: "from-purple-900 via-fuchsia-900 via-pink-900 to-rose-900",
      bg: "from-purple-50 via-magenta-50 to-rose-50",
      darkBg: "from-purple-950 via-magenta-950 to-rose-950",
    },
  };

  // Scroll detection for back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.pageYOffset > 300);
      setScrollY(window.pageYOffset);

      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.pageYOffset / totalHeight) * 100;
      setScrollProgress(Math.min(progress, 100));
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Fetch Blog Data from Supabase
  useEffect(() => {
    const fetchBlogData = async () => {
      setBlogLoading(true);
      try {
        // Fetch featured posts using the provided blog lib
        const posts = await getFeaturedPosts();
        setFeaturedPosts(posts.slice(0, 3)); // Only show top 3

        // Fetch categories
        const categories = await getAllCategories();
        setBlogCategories(categories.slice(0, 6)); // Only show top 6
      } catch (error) {
        console.error("Error fetching blog data:", error);
        // Fallback to sample data if real data fails
        setFeaturedPosts([
          {
            id: "sample-1",
            title: "Top 10 React Templates cho 2025",
            slug: "top-10-react-templates-2025",
            excerpt:
              "Khám phá những React templates mới nhất và hot nhất năm 2025 với thiết kế hiện đại.",
            content: "",
            featuredImage: "/blog/react-templates-2025.jpg",
            publishedAt: "2025-01-15T09:00:00Z",
            updatedAt: "2025-01-15T09:00:00Z",
            isFeatured: true,
            isPublished: true,
            readTime: 7,
            views: 1250,
            likes: 89,
            tags: ["React", "Templates", "Frontend"],
            author: {
              id: "author-1",
              name: "Nguyễn Văn Dev",
              avatar: "/authors/dev.jpg",
              bio: "Frontend Developer",
            },
            category: {
              id: "cat-1",
              name: "Development",
              slug: "development",
              description: "Lập trình và phát triển",
              color: "purple",
              postCount: 25,
            },
            seo: {
              metaTitle: "Top 10 React Templates cho 2025",
              metaDescription: "Khám phá những React templates mới nhất",
              keywords: ["React", "Templates"],
            },
          },
          {
            id: "sample-2",
            title: "Best Practices cho E-commerce Design",
            slug: "best-practices-ecommerce-design",
            excerpt:
              "Hướng dẫn chi tiết về thiết kế website thương mại điện tử hiệu quả và chuyển đổi cao.",
            content: "",
            featuredImage: "/blog/ecommerce-design.jpg",
            publishedAt: "2025-01-10T14:30:00Z",
            updatedAt: "2025-01-10T14:30:00Z",
            isFeatured: true,
            isPublished: true,
            readTime: 12,
            views: 890,
            likes: 67,
            tags: ["Design", "E-commerce", "UX"],
            author: {
              id: "author-2",
              name: "Trần Thị Designer",
              avatar: "/authors/designer.jpg",
              bio: "UI/UX Designer",
            },
            category: {
              id: "cat-2",
              name: "Design",
              slug: "design",
              description: "Thiết kế giao diện",
              color: "pink",
              postCount: 18,
            },
            seo: {
              metaTitle: "Best Practices cho E-commerce Design",
              metaDescription: "Hướng dẫn thiết kế e-commerce",
              keywords: ["Design", "E-commerce"],
            },
          },
          {
            id: "sample-3",
            title: "JavaScript Trends cần theo dõi 2025",
            slug: "javascript-trends-2025",
            excerpt:
              "Cập nhật những xu hướng JavaScript mới nhất, từ framework đến tool phát triển.",
            content: "",
            featuredImage: "/blog/js-trends-2025.jpg",
            publishedAt: "2025-01-05T11:15:00Z",
            updatedAt: "2025-01-05T11:15:00Z",
            isFeatured: true,
            isPublished: true,
            readTime: 9,
            views: 1567,
            likes: 134,
            tags: ["JavaScript", "Trends", "Web Development"],
            author: {
              id: "author-3",
              name: "Phạm Văn JS",
              avatar: "/authors/js-dev.jpg",
              bio: "JavaScript Expert",
            },
            category: {
              id: "cat-3",
              name: "JavaScript",
              slug: "javascript",
              description: "Lập trình JavaScript",
              color: "yellow",
              postCount: 32,
            },
            seo: {
              metaTitle: "JavaScript Trends cần theo dõi 2025",
              metaDescription: "Xu hướng JavaScript 2025",
              keywords: ["JavaScript", "Trends"],
            },
          },
        ]);
      } finally {
        setBlogLoading(false);
      }
    };

    fetchBlogData();
  }, []);

  // Newsletter subscription handler
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      if (newsletterStep === 1) {
        setNewsletterStep(2);
      } else {
        setIsSubscribed(true);
        setNewsletterStep(1);
      }
      setIsLoading(false);
      if (newsletterStep === 2) {
        setEmail("");
      }
    }, 1500);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Enhanced stats with Purple-Magenta-Rose theme
  const stats = [
    {
      label: "Khách hàng hài lòng",
      value: "50K+",
      icon: Users,
      color: colorSchemes.primary.gradient,
      description: "Khách hàng tin tưởng",
    },
    {
      label: "Sản phẩm chất lượng",
      value: "1500+",
      icon: Award,
      color: colorSchemes.secondary.gradient,
      description: "Templates & E-books",
    },
    {
      label: "Downloads",
      value: "1M+",
      icon: Download,
      color: colorSchemes.accent.gradient,
      description: "Lượt tải xuống",
    },
    {
      label: "Đánh giá 5 sao",
      value: "98%",
      icon: Star,
      color: colorSchemes.success.gradient,
      description: "Tỷ lệ hài lòng",
    },
    {
      label: "Quốc gia phục vụ",
      value: "50+",
      icon: Globe,
      color: colorSchemes.primary.gradient,
      description: "Phạm vi toàn cầu",
    },
    {
      label: "Đối tác",
      value: "200+",
      icon: Briefcase,
      color: colorSchemes.footer.gradient,
      description: "Đối tác chiến lược",
    },
  ];

  // Enhanced social links
  const socialLinks = [
    {
      icon: Facebook,
      href: "https://facebook.com/templatemarket",
      label: "Facebook",
      color: "hover:text-blue-600",
      followers: "25K",
      description: "Theo dõi tin tức mới nhất",
    },
    {
      icon: Twitter,
      href: "https://twitter.com/templatemarket",
      label: "Twitter",
      color: "hover:text-sky-500",
      followers: "18K",
      description: "Cập nhật real-time",
    },
    {
      icon: Instagram,
      href: "https://instagram.com/templatemarket",
      label: "Instagram",
      color: "hover:text-pink-600",
      followers: "32K",
      description: "Design inspiration",
    },
    {
      icon: Youtube,
      href: "https://youtube.com/templatemarket",
      label: "YouTube",
      color: "hover:text-red-600",
      followers: "15K",
      description: "Video tutorials",
    },
    {
      icon: Github,
      href: "https://github.com/templatemarket",
      label: "GitHub",
      color: "hover:text-gray-900",
      followers: "8K",
      description: "Open source projects",
    },
    {
      icon: Linkedin,
      href: "https://linkedin.com/company/templatemarket",
      label: "LinkedIn",
      color: "hover:text-blue-700",
      followers: "12K",
      description: "Professional network",
    },
  ];

  // Comprehensive navigation links
  const quickLinks = [
    {
      to: "/templates",
      label: "Templates",
      icon: LayoutTemplate,
      count: "500+",
      hot: true,
    },
    {
      to: "/ebooks",
      label: "E-books",
      icon: Notebook,
      count: "200+",
      new: true,
    },
    { to: "/about", label: "Giới thiệu", icon: Store, count: null },
    { to: "/contact", label: "Liên hệ", icon: Contact, count: null },
    {
      to: "/blog",
      label: "Blog",
      icon: BookLock,
      count: "100+",
      updated: true,
    },
    {
      to: "/careers",
      label: "Tuyển dụng",
      icon: Users,
      count: "5+",
      hot: true,
    },
    { to: "/pricing", label: "Bảng giá", icon: DollarSign, count: null },
    {
      to: "/testimonials",
      label: "Đánh giá",
      icon: MessageSquare,
      count: "1000+",
    },
  ];

  const supportLinks = [
    {
      to: "/help",
      label: "Trung tâm trợ giúp",
      icon: HelpCircle,
      description: "Hướng dẫn chi tiết",
    },
    {
      to: "/faq",
      label: "Câu hỏi thường gặp",
      icon: MessageSquare,
      description: "Giải đáp nhanh",
    },
    {
      to: "/privacy",
      label: "Chính sách bảo mật",
      icon: Lock,
      description: "Bảo vệ dữ liệu",
    },
    {
      to: "/terms",
      label: "Điều khoản sử dụng",
      icon: FileText,
      description: "Quy định sử dụng",
    },
    {
      to: "/refund",
      label: "Chính sách hoàn tiền",
      icon: CreditCard,
      description: "Đảm bảo quyền lợi",
    },
    {
      to: "/api",
      label: "API Documentation",
      icon: Code,
      description: "Tài liệu developer",
    },
    {
      to: "/status",
      label: "Trạng thái hệ thống",
      icon: Activity,
      description: "Monitoring real-time",
    },
    {
      to: "/security",
      label: "Bảo mật",
      icon: Shield,
      description: "Chứng chỉ an toàn",
    },
  ];

  // Blog categories with color coding
  const getBlogCategoryColor = (color: string) => {
    const colorMap = {
      purple: "from-purple-500 to-violet-500",
      pink: "from-pink-500 to-rose-500",
      magenta: "from-magenta-500 to-fuchsia-500",
      blue: "from-blue-500 to-cyan-500",
      green: "from-green-500 to-emerald-500",
      yellow: "from-yellow-500 to-orange-500",
      red: "from-red-500 to-rose-500",
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.purple;
  };

  // Team members
  const teamMembers = [
    {
      name: "Nguyễn Văn A",
      role: "CEO & Founder",
      avatar: "/avatars/ceo.jpg",
      social: { twitter: "#", linkedin: "#" },
    },
    {
      name: "Trần Thị B",
      role: "CTO",
      avatar: "/avatars/cto.jpg",
      social: { github: "#", linkedin: "#" },
    },
    {
      name: "Lê Văn C",
      role: "Lead Designer",
      avatar: "/avatars/designer.jpg",
      social: { dribbble: "#", behance: "#" },
    },
    {
      name: "Phạm Thị D",
      role: "Marketing Manager",
      avatar: "/avatars/marketing.jpg",
      social: { twitter: "#", instagram: "#" },
    },
  ];

  return (
    <>
      <Helmet>
        <title>Template Market - Footer</title>
        <meta
          name="description"
          content="Template Market footer với thông tin liên hệ, blog mới nhất và các liên kết hữu ích."
        />
      </Helmet>

      <footer
        className="relative mt-auto overflow-hidden border-t bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100
dark:from-amber-950 dark:via-orange-950 dark:to-yellow-950
"
      >
        {/* ✅ Enhanced Purple-Magenta-Rose Background Pattern */}
        <div className="absolute inset-0 opacity-40">
          <div
            className={`absolute top-0 left-0 w-full h-full bg-gradient-to-r ${colorSchemes.footer.gradient} opacity-10`}
          ></div>
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.6, 0.2],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute w-96 h-96 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full top-20 right-20 mix-blend-multiply filter blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.3, 1, 1.3],
              opacity: [0.6, 0.2, 0.6],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 5,
            }}
            className="absolute w-80 h-80 bg-gradient-to-br from-magenta-400 to-rose-400 rounded-full bottom-20 left-20 mix-blend-multiply filter blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.7, 0.3],
              rotate: [0, -180, -360],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 10,
            }}
            className="absolute w-72 h-72 bg-gradient-to-br from-fuchsia-400 to-violet-400 rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mix-blend-multiply filter blur-3xl"
          />
        </div>

        <div className="container relative z-10 px-4 py-16 mx-auto">
          {/* Enhanced Stats Section with Purple-Magenta-Rose Theme */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="group"
                >
                  <Card className="text-center transition-all duration-300 border-0 group bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg hover:shadow-2xl hover:bg-white/95 dark:hover:bg-slate-800/95 rounded-2xl">
                    <CardContent className="p-6">
                      <div
                        className={`flex items-center justify-center w-14 h-14 mx-auto mb-4 transition-all duration-300 rounded-xl bg-gradient-to-r ${stat.color} group-hover:scale-110 shadow-lg`}
                      >
                        <stat.icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="text-3xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-magenta-600 bg-clip-text mb-1">
                        {stat.value}
                      </div>
                      <div className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-2">
                        {stat.label}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {stat.description}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
            {/* Company Info Section - Enhanced with Purple-Magenta-Rose */}
            <div className="lg:col-span-4 space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <div className="flex items-center space-x-4">
                  <motion.div
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    className={`flex items-center justify-center w-16 h-16 shadow-xl rounded-2xl bg-gradient-to-br ${colorSchemes.footer.gradient}`}
                  >
                    <span className="text-2xl font-bold text-white">TM</span>
                  </motion.div>
                  <div>
                    <span
                      className={`text-3xl font-bold text-transparent bg-gradient-to-r ${colorSchemes.footer.gradient} bg-clip-text`}
                    >
                      Template Market
                    </span>
                    <div className="flex items-center mt-2 space-x-2">
                      <Badge className="text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                        <Shield className="w-3 h-3 mr-1" />
                        Trusted Platform
                      </Badge>
                      <Badge className="text-xs bg-magenta-100 text-magenta-800 dark:bg-magenta-900 dark:text-magenta-200">
                        <Crown className="w-3 h-3 mr-1" />
                        Premium Quality
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    Nền tảng hàng đầu cung cấp{" "}
                    <span className="font-semibold text-purple-600">
                      templates
                    </span>{" "}
                    và{" "}
                    <span className="font-semibold text-magenta-600">
                      e-books
                    </span>{" "}
                    chất lượng cao cho{" "}
                    <span className="font-semibold text-rose-600">
                      developers
                    </span>{" "}
                    và{" "}
                    <span className="font-semibold text-fuchsia-600">
                      designers
                    </span>
                    . Được tin tưởng bởi hơn{" "}
                    <span className="font-bold text-pink-600">
                      50,000 khách hàng
                    </span>{" "}
                    trên toàn thế giới.
                  </p>

                  <div className="space-y-3">
                    {[
                      {
                        icon: CheckCircle,
                        text: "Hỗ trợ 24/7 chuyên nghiệp",
                        color: "text-emerald-600",
                        bg: "bg-emerald-100 dark:bg-emerald-900",
                      },
                      {
                        icon: Zap,
                        text: "Cập nhật sản phẩm thường xuyên",
                        color: "text-purple-600",
                        bg: "bg-purple-100 dark:bg-purple-900",
                      },
                      {
                        icon: Globe,
                        text: "Phục vụ toàn cầu",
                        color: "text-magenta-600",
                        bg: "bg-magenta-100 dark:bg-magenta-900",
                      },
                      {
                        icon: Shield,
                        text: "Bảo mật cao cấp",
                        color: "text-rose-600",
                        bg: "bg-rose-100 dark:bg-rose-900",
                      },
                      {
                        icon: Target,
                        text: "Chất lượng đảm bảo",
                        color: "text-pink-600",
                        bg: "bg-pink-100 dark:bg-pink-900",
                      },
                    ].map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1, duration: 0.4 }}
                        className="flex items-center space-x-3 text-sm"
                      >
                        <div
                          className={`flex items-center justify-center w-8 h-8 ${item.bg} rounded-lg`}
                        >
                          <item.icon className={`w-4 h-4 ${item.color}`} />
                        </div>
                        <span className="text-muted-foreground">
                          {item.text}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Enhanced Social Links with Purple-Magenta-Rose theme */}
                <div className="space-y-4">
                  <h4
                    className={`text-lg font-semibold bg-gradient-to-r ${colorSchemes.footer.gradient} bg-clip-text text-transparent`}
                  >
                    Kết nối với chúng tôi
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {socialLinks.map((social, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant="outline"
                          className={`w-full justify-start text-left h-auto p-4 transition-all duration-300 hover:shadow-lg ${social.color} border-purple-200 dark:border-purple-700 hover:border-purple-300 dark:hover:border-purple-600 bg-white/50 dark:bg-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-800/80`}
                          asChild
                        >
                          <a
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                          >
                            <div className="flex items-center space-x-3">
                              <social.icon className="w-5 h-5" />
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm">
                                  {social.label}
                                </div>
                                <div className="text-xs text-muted-foreground truncate">
                                  {social.description}
                                </div>
                                <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                  {social.followers} followers
                                </div>
                              </div>
                            </div>
                          </a>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Navigation Links Section */}
            <div className="lg:col-span-4 space-y-8">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-4 mb-6 bg-white/50 dark:bg-slate-800/50">
                  <TabsTrigger value="company" className="text-xs">
                    Company
                  </TabsTrigger>
                  <TabsTrigger value="products" className="text-xs">
                    Products
                  </TabsTrigger>
                  <TabsTrigger value="support" className="text-xs">
                    Support
                  </TabsTrigger>
                  <TabsTrigger value="blog" className="text-xs">
                    Blog
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="company" className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <h3
                      className={`text-xl font-semibold text-transparent bg-gradient-to-r ${colorSchemes.primary.gradient} bg-clip-text mb-4`}
                    >
                      Về chúng tôi
                    </h3>
                    <ul className="space-y-3">
                      {quickLinks.map((link, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Link
                            to={link.to}
                            className="flex items-center justify-between text-sm transition-all duration-300 text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 hover:translate-x-2 group py-2"
                          >
                            <div className="flex items-center space-x-3">
                              <div
                                className={`p-1.5 rounded-lg bg-gradient-to-r ${colorSchemes.primary.bg} dark:${colorSchemes.primary.darkBg} group-hover:from-purple-200 group-hover:to-magenta-200 dark:group-hover:from-purple-800 dark:group-hover:to-magenta-800 transition-all duration-300`}
                              >
                                <link.icon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                              </div>
                              <span className="font-medium">{link.label}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {link.count && (
                                <Badge variant="outline" className="text-xs">
                                  {link.count}
                                </Badge>
                              )}
                              {link.hot && (
                                <Badge className="text-xs bg-red-500 text-white">
                                  Hot
                                </Badge>
                              )}
                              {link.new && (
                                <Badge className="text-xs bg-emerald-500 text-white">
                                  New
                                </Badge>
                              )}
                              {link.updated && (
                                <Badge className="text-xs bg-blue-500 text-white">
                                  Updated
                                </Badge>
                              )}
                              <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </Link>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>

                  {/* Team Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="pt-6 border-t border-purple-200 dark:border-purple-700"
                  >
                    <h4 className="text-lg font-semibold mb-4">
                      Đội ngũ của chúng tôi
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      {teamMembers.map((member, idx) => (
                        <motion.div
                          key={idx}
                          whileHover={{ scale: 1.05 }}
                          className="text-center p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg border border-purple-200 dark:border-purple-700"
                        >
                          <Avatar className="w-12 h-12 mx-auto mb-2">
                            <AvatarImage
                              src={member.avatar}
                              alt={member.name}
                            />
                            <AvatarFallback
                              className={`bg-gradient-to-r ${colorSchemes.footer.gradient} text-white`}
                            >
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="text-sm font-medium dark:text-gray-200">
                            {member.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {member.role}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </TabsContent>

                <TabsContent value="products" className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <h3
                      className={`text-xl font-semibold text-transparent bg-gradient-to-r ${colorSchemes.secondary.gradient} bg-clip-text mb-4`}
                    >
                      Sản phẩm của chúng tôi
                    </h3>
                    <div className="space-y-4">
                      {[
                        {
                          name: "React Templates",
                          to: "/templates/react",
                          count: "200+",
                          icon: Code,
                          subcategories: [
                            "Dashboard",
                            "E-commerce",
                            "Landing Page",
                            "Admin Panel",
                          ],
                        },
                        {
                          name: "Vue Templates",
                          to: "/templates/vue",
                          count: "150+",
                          icon: Code,
                          subcategories: [
                            "SPA",
                            "PWA",
                            "Mobile App",
                            "Desktop App",
                          ],
                        },
                        {
                          name: "JavaScript E-books",
                          to: "/ebooks/javascript",
                          count: "80+",
                          icon: Notebook,
                          subcategories: ["ES6+", "Node.js", "React", "Vue"],
                        },
                        {
                          name: "Design E-books",
                          to: "/ebooks/design",
                          count: "40+",
                          icon: Palette,
                          subcategories: [
                            "UI/UX",
                            "Graphic Design",
                            "Web Design",
                            "Mobile Design",
                          ],
                        },
                      ].map((category, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border border-purple-200 dark:border-purple-700 rounded-lg p-4 hover:shadow-md transition-all duration-300 bg-white/50 dark:bg-slate-800/50"
                        >
                          <Link to={category.to} className="block group">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <div
                                  className={`p-2 rounded-lg bg-gradient-to-r ${colorSchemes.secondary.bg} dark:${colorSchemes.secondary.darkBg}`}
                                >
                                  <category.icon className="w-5 h-5 text-magenta-600 dark:text-magenta-400" />
                                </div>
                                <div>
                                  <span className="font-medium text-sm group-hover:text-magenta-600 dark:group-hover:text-magenta-400 transition-colors">
                                    {category.name}
                                  </span>
                                  <Badge
                                    variant="outline"
                                    className="ml-2 text-xs"
                                  >
                                    {category.count}
                                  </Badge>
                                </div>
                              </div>
                              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {category.subcategories.map((sub, idx) => (
                                <Badge
                                  key={idx}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {sub}
                                </Badge>
                              ))}
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </TabsContent>

                <TabsContent value="support" className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <h3
                      className={`text-xl font-semibold text-transparent bg-gradient-to-r ${colorSchemes.success.gradient} bg-clip-text mb-4`}
                    >
                      Hỗ trợ khách hàng
                    </h3>
                    <ul className="space-y-3">
                      {supportLinks.map((link, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Link
                            to={link.to}
                            className="flex items-center space-x-3 text-sm transition-all duration-300 text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 hover:translate-x-2 group py-2"
                          >
                            <div
                              className={`p-1.5 rounded-lg bg-gradient-to-r ${colorSchemes.success.bg} dark:${colorSchemes.success.darkBg} group-hover:from-emerald-200 group-hover:to-teal-200 dark:group-hover:from-emerald-800 dark:group-hover:to-teal-800 transition-all duration-300`}
                            >
                              <link.icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div className="flex-1">
                              <span className="font-medium block">
                                {link.label}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {link.description}
                              </span>
                            </div>
                            <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>

                  {/* Live Chat Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="pt-6 border-t border-emerald-200 dark:border-emerald-700"
                  >
                    <Card className="border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                          <span className="font-medium text-emerald-800 dark:text-emerald-200">
                            Live Chat Available
                          </span>
                        </div>
                        <p className="text-sm text-emerald-700 dark:text-emerald-300 mb-3">
                          Đội ngũ hỗ trợ của chúng tôi đang trực tuyến và sẵn
                          sàng giúp bạn.
                        </p>
                        <Button
                          size="sm"
                          className="w-full bg-emerald-600 hover:bg-emerald-700"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Bắt đầu chat
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>

                {/* ✅ NEW BLOG TAB - Real-time from Supabase */}
                <TabsContent value="blog" className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <h3
                      className={`text-xl font-semibold text-transparent bg-gradient-to-r ${colorSchemes.accent.gradient} bg-clip-text mb-4`}
                    >
                      Blog mới nhất
                    </h3>

                    {/* Featured Blog Posts */}
                    <div className="space-y-4">
                      {blogLoading
                        ? // Loading skeleton
                          Array.from({ length: 3 }).map((_, idx) => (
                            <div key={idx} className="animate-pulse">
                              <div className="p-4 bg-white/50 dark:bg-slate-800/50 rounded-lg border border-rose-200 dark:border-rose-700">
                                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-gray-300 rounded w-1/2 mb-2"></div>
                                <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                              </div>
                            </div>
                          ))
                        : featuredPosts.map((post, idx) => (
                            <motion.div
                              key={post.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="p-4 bg-white/50 dark:bg-slate-800/50 rounded-lg border border-rose-200 dark:border-rose-700 hover:shadow-md transition-all duration-300 hover:border-rose-300 dark:hover:border-rose-600"
                            >
                              <Link
                                to={`/blog/${post.slug}`}
                                className="block group"
                              >
                                <div className="flex items-start space-x-3">
                                  {post.featuredImage && (
                                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900 dark:to-pink-900 rounded-lg overflow-hidden">
                                      <img
                                        src={post.featuredImage}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        onError={(e) => {
                                          e.currentTarget.style.display =
                                            "none";
                                        }}
                                      />
                                      <div className="w-full h-full flex items-center justify-center">
                                        <Notebook className="w-6 h-6 text-rose-400" />
                                      </div>
                                    </div>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <h5 className="font-medium text-sm group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors mb-1 line-clamp-2">
                                      {post.title}
                                    </h5>
                                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                                      {post.excerpt}
                                    </p>
                                    <div className="flex items-center justify-between text-xs">
                                      <div className="flex items-center space-x-2">
                                        <Badge
                                          variant="outline"
                                          className={`text-xs border-${post.category.color}-300`}
                                          style={{
                                            background: `linear-gradient(to right, ${getBlogCategoryColor(post.category.color)})`,
                                            color: "white",
                                            border: "none",
                                          }}
                                        >
                                          {post.category.name}
                                        </Badge>
                                        <span className="text-muted-foreground">
                                          {post.readTime} phút đọc
                                        </span>
                                      </div>
                                      <span className="text-muted-foreground">
                                        {new Date(
                                          post.publishedAt,
                                        ).toLocaleDateString("vi-VN")}
                                      </span>
                                    </div>
                                    <div className="flex items-center space-x-3 mt-2 text-xs text-muted-foreground">
                                      <div className="flex items-center space-x-1">
                                        <Eye className="w-3 h-3" />
                                        <span>{post.views}</span>
                                      </div>
                                      <div className="flex items-center space-x-1">
                                        <Heart className="w-3 h-3" />
                                        <span>{post.likes}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            </motion.div>
                          ))}
                    </div>

                    {/* Blog Categories */}
                    {blogCategories.length > 0 && (
                      <div className="pt-4 border-t border-rose-200 dark:border-rose-700">
                        <h4 className="font-medium mb-3">Danh mục Blog</h4>
                        <div className="flex flex-wrap gap-2">
                          {blogCategories.map((category, idx) => (
                            <motion.div
                              key={category.id}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: idx * 0.05 }}
                            >
                              <Link to={`/blog/category/${category.slug}`}>
                                <Badge
                                  className="cursor-pointer transition-transform hover:scale-105"
                                  style={{
                                    background: `linear-gradient(to right, ${getBlogCategoryColor(category.color)})`,
                                    color: "white",
                                    border: "none",
                                  }}
                                >
                                  {category.name} ({category.postCount})
                                </Badge>
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-4">
                      <Button
                        asChild
                        variant="outline"
                        className="w-full border-rose-200 hover:border-rose-300 hover:bg-rose-50 dark:border-rose-700 dark:hover:border-rose-600 dark:hover:bg-rose-900/20"
                      >
                        <Link to="/blog">
                          <BookLock className="w-4 h-4 mr-2" />
                          Xem tất cả bài viết
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </motion.div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Contact & Newsletter Section */}
            <div className="lg:col-span-4 space-y-8">
              {/* Enhanced Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <h3
                  className={`text-xl font-semibold text-transparent bg-gradient-to-r ${colorSchemes.accent.gradient} bg-clip-text`}
                >
                  Liên hệ với chúng tôi
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      icon: MapPin,
                      text: "Hà Tu, Hạ Long, Quảng Ninh, Vietnam",
                      color: "text-purple-600",
                      bg: "bg-purple-100 dark:bg-purple-900",
                      href: "https://maps.google.com",
                    },
                    {
                      icon: Phone,
                      text: "+84 971 386 588",
                      color: "text-magenta-600",
                      bg: "bg-magenta-100 dark:bg-magenta-900",
                      href: "tel:+84971386588",
                    },
                    {
                      icon: Mail,
                      text: "veutong961@gmail.com",
                      color: "text-rose-600",
                      bg: "bg-rose-100 dark:bg-rose-900",
                      href: "mailto:veutong961@gmail.com",
                    },
                    {
                      icon: Clock,
                      text: "24/7 Support Available",
                      color: "text-pink-600",
                      bg: "bg-pink-100 dark:bg-pink-900",
                      href: null,
                    },
                    {
                      icon: Globe,
                      text: "www.templatemarket.com",
                      color: "text-fuchsia-600",
                      bg: "bg-fuchsia-100 dark:bg-fuchsia-900",
                      href: "https://templatemarket.com",
                    },
                  ].map((contact, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="group"
                    >
                      {contact.href ? (
                        <a
                          href={contact.href}
                          target={
                            contact.href.startsWith("http")
                              ? "_blank"
                              : undefined
                          }
                          rel={
                            contact.href.startsWith("http")
                              ? "noopener noreferrer"
                              : undefined
                          }
                          className="flex items-center space-x-4 p-3 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-purple-200 dark:border-purple-700 hover:shadow-md transition-all duration-300 hover:bg-white/80 dark:hover:bg-slate-800/80 hover:border-purple-300 dark:hover:border-purple-600"
                        >
                          <div
                            className={`flex items-center justify-center w-10 h-10 ${contact.bg} rounded-lg group-hover:scale-110 transition-transform duration-300`}
                          >
                            <contact.icon
                              className={`w-5 h-5 ${contact.color}`}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {contact.text}
                            </span>
                          </div>
                          <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      ) : (
                        <div className="flex items-center space-x-4 p-3 rounded-lg bg-white/50 dark:bg-slate-800/50 border border-purple-200 dark:border-purple-700">
                          <div
                            className={`flex items-center justify-center w-10 h-10 ${contact.bg} rounded-lg`}
                          >
                            <contact.icon
                              className={`w-5 h-5 ${contact.color}`}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {contact.text}
                            </span>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Enhanced Newsletter with Purple-Magenta-Rose theme */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-6"
              >
                <Card
                  className={`border-0 shadow-lg bg-gradient-to-br ${colorSchemes.footer.bg} dark:${colorSchemes.footer.darkBg}`}
                >
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center space-x-2">
                      <div
                        className={`p-2 rounded-lg bg-gradient-to-r ${colorSchemes.footer.gradient}`}
                      >
                        <Mail className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-lg">📧 Newsletter</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Đăng ký để nhận thông tin mới nhất về sản phẩm, ưu đãi đặc
                      biệt và các mẹo thiết kế hữu ích.
                    </p>

                    {!isSubscribed ? (
                      <AnimatePresence mode="wait">
                        {newsletterStep === 1 ? (
                          <motion.form
                            key="step1"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            onSubmit={handleSubscribe}
                            className="space-y-3"
                          >
                            <div className="flex space-x-2">
                              <Input
                                type="email"
                                placeholder="Nhập email của bạn"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="flex-1 bg-white dark:bg-slate-800"
                                required
                              />
                              <Button
                                type="submit"
                                disabled={isLoading}
                                className={`bg-gradient-to-r ${colorSchemes.footer.gradient} hover:opacity-90`}
                              >
                                {isLoading ? (
                                  <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{
                                      duration: 1,
                                      repeat: Infinity,
                                      ease: "linear",
                                    }}
                                    className="w-4 h-4 border-2 border-white rounded-full border-t-transparent"
                                  />
                                ) : (
                                  <Send className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </motion.form>
                        ) : (
                          <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="space-y-4"
                          >
                            <h4 className="font-medium">
                              Chọn nội dung bạn quan tâm:
                            </h4>
                            <div className="space-y-2">
                              {Object.entries(preferences).map(
                                ([key, value]) => (
                                  <label
                                    key={key}
                                    className="flex items-center space-x-2 cursor-pointer"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={value}
                                      onChange={(e) =>
                                        setPreferences((prev) => ({
                                          ...prev,
                                          [key]: e.target.checked,
                                        }))
                                      }
                                      className="rounded border-gray-300"
                                    />
                                    <span className="text-sm">
                                      {key === "updates" &&
                                        "Cập nhật sản phẩm mới"}
                                      {key === "offers" && "Ưu đãi đặc biệt"}
                                      {key === "newsletter" &&
                                        "Bản tin hàng tuần"}
                                    </span>
                                  </label>
                                ),
                              )}
                            </div>
                            <Button
                              onClick={handleSubscribe}
                              disabled={isLoading}
                              className={`w-full bg-gradient-to-r ${colorSchemes.footer.gradient} hover:opacity-90`}
                            >
                              {isLoading ? (
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    ease: "linear",
                                  }}
                                  className="w-4 h-4 border-2 border-white rounded-full border-t-transparent"
                                />
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Hoàn tất đăng ký
                                </>
                              )}
                            </Button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center p-4 space-x-3 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg border border-emerald-200 dark:border-emerald-800"
                      >
                        <CheckCircle className="w-6 h-6 text-emerald-600" />
                        <div className="flex-1">
                          <span className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                            Cảm ơn bạn đã đăng ký!
                          </span>
                          <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
                            Chúng tôi đã gửi email xác nhận đến hộp thư của bạn.
                          </p>
                        </div>
                      </motion.div>
                    )}

                    <p className="text-xs text-muted-foreground">
                      Bằng cách đăng ký, bạn đồng ý với{" "}
                      <Link
                        to="/privacy"
                        className="text-purple-600 hover:text-purple-700 hover:underline font-medium"
                      >
                        chính sách bảo mật
                      </Link>{" "}
                      và{" "}
                      <Link
                        to="/terms"
                        className="text-purple-600 hover:text-purple-700 hover:underline font-medium"
                      >
                        điều khoản sử dụng
                      </Link>{" "}
                      của chúng tôi.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Additional Services with Purple-Magenta-Rose theme */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="space-y-4"
              >
                <h4
                  className={`text-lg font-semibold bg-gradient-to-r ${colorSchemes.accent.gradient} bg-clip-text text-transparent`}
                >
                  Dịch vụ bổ sung
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    {
                      title: "Custom Development",
                      desc: "Phát triển theo yêu cầu",
                      icon: Code,
                      color: colorSchemes.primary.gradient,
                    },
                    {
                      title: "Design Consultation",
                      desc: "Tư vấn thiết kế",
                      icon: Palette,
                      color: colorSchemes.secondary.gradient,
                    },
                    {
                      title: "Priority Support",
                      desc: "Hỗ trợ ưu tiên",
                      icon: Zap,
                      color: colorSchemes.accent.gradient,
                    },
                    {
                      title: "Training & Workshops",
                      desc: "Đào tạo và workshop",
                      icon: GraduationCap,
                      color: colorSchemes.footer.gradient,
                    },
                  ].map((service, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg border border-purple-200 dark:border-purple-700 hover:shadow-md transition-all duration-300 hover:border-purple-300 dark:hover:border-purple-600"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-2 rounded-lg bg-gradient-to-r ${service.color}`}
                        >
                          <service.icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">
                            {service.title}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {service.desc}
                          </div>
                        </div>
                        <Button size="sm" variant="ghost" className="text-xs">
                          Learn More
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          <Separator className="my-16" />

          {/* Enhanced Bottom Section with Purple-Magenta-Rose theme */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="space-y-8"
          >
            {/* Trust Badges & Certifications */}
            <div className="text-center space-y-6">
              <h3
                className={`text-2xl font-bold bg-gradient-to-r ${colorSchemes.footer.gradient} bg-clip-text text-transparent`}
              >
                Trusted & Certified
              </h3>
              <div className="flex flex-wrap items-center justify-center gap-6">
                {[
                  {
                    icon: Shield,
                    text: "SSL Secured",
                    color: "text-emerald-500",
                    bg: "bg-emerald-100 dark:bg-emerald-900",
                  },
                  {
                    icon: Award,
                    text: "Premium Quality",
                    color: "text-purple-500",
                    bg: "bg-purple-100 dark:bg-purple-900",
                  },
                  {
                    icon: Users,
                    text: "50K+ Happy Customers",
                    color: "text-magenta-500",
                    bg: "bg-magenta-100 dark:bg-magenta-900",
                  },
                  {
                    icon: Clock,
                    text: "24/7 Support",
                    color: "text-rose-500",
                    bg: "bg-rose-100 dark:bg-rose-900",
                  },
                  {
                    icon: Globe,
                    text: "Global Service",
                    color: "text-pink-500",
                    bg: "bg-pink-100 dark:bg-pink-900",
                  },
                  {
                    icon: Zap,
                    text: "Fast Delivery",
                    color: "text-fuchsia-500",
                    bg: "bg-fuchsia-100 dark:bg-fuchsia-900",
                  },
                ].map((badge, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className={`flex items-center space-x-2 px-4 py-2 ${badge.bg} rounded-full border border-gray-200 dark:border-gray-700`}
                  >
                    <badge.icon className={`w-4 h-4 ${badge.color}`} />
                    <span className="text-sm font-medium">{badge.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Final Bottom Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
                <p className="text-sm text-muted-foreground">
                  &copy; 2024 Template Market. All rights reserved.
                </p>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>Made with</span>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Heart className="w-4 h-4 text-red-500" />
                  </motion.div>
                  <span>in Vietnam</span>
                </div>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <Zap className="w-3 h-3" />
                  <span>Powered by React & TypeScript</span>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex space-x-4 text-sm">
                  {[
                    { to: "/privacy", label: "Privacy" },
                    { to: "/terms", label: "Terms" },
                    { to: "/cookies", label: "Cookies" },
                    { to: "/sitemap", label: "Sitemap" },
                  ].map((link, idx) => (
                    <Link
                      key={idx}
                      to={link.to}
                      className="transition-colors text-muted-foreground hover:text-purple-700 hover:underline"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                {/* Enhanced Back to Top Button */}
                <AnimatePresence>
                  {showBackToTop && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 20,
                      }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={scrollToTop}
                        className="transition-all duration-300 group hover:scale-110 hover:shadow-lg bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 text-white border-0"
                      >
                        <motion.div
                          animate={{ y: [0, -2, 0] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          <ArrowUp className="w-4 h-4" />
                        </motion.div>
                        <span className="sr-only">Back to top</span>
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="text-center py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Activity className="w-3 h-3 text-emerald-500" />
                  <span>Uptime: 99.9%</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Zap className="w-3 h-3 text-pink-500" />
                  <span>Response Time: &lt;200ms</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Shield className="w-3 h-3 text-fuchsia-500" />
                  <span>Security Score: A+</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-3 h-3 text-purple-500" />
                  <span>Active Users: 50K+</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
