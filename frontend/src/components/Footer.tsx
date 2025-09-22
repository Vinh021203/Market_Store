import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  DollarSign,
  Target,
  Sparkles,
  Trophy,
  Package,
  Activity,
  Database,
  Cloud,
  Camera,
  Edit,
  Palette,
  ChevronRight,
  Plus,
  X,
  Check,
  AlertCircle,
  Lightbulb,
  Bell,
  Crown,
  Gem,
  BookOpen,
  Search,
  TrendingUp,
  Eye,
  ThumbsUp,
  Calendar,
  Tag,
  Bookmark,
  Share2,
  Filter,
  SortAsc,
  Grid,
  List,
  Settings,
  User,
  PlusCircle,
  MinusCircle,
  RefreshCw,
  MoreHorizontal,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Info,
  Trash2,
  Copy,
  Move,
  FolderPlus,
  Image as ImageIcon,
  Video,
  Music,
  File,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getFeaturedPosts, getAllCategories } from "@/lib/blog";
import type { BlogPost, BlogCategory } from "@/types/blog";

const Footer: React.FC = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [blogCategories, setBlogCategories] = useState<BlogCategory[]>([]);
  const [blogLoading, setBlogLoading] = useState(true);

  // Enhanced pastel color schemes - Pink/Rose Theme (inspired by image 2)
  const pastelsSchemes = {
    main: "from-pink-50 via-rose-50 to-red-50",
    secondary: "from-rose-50 via-pink-50 to-white",
    accent: "from-pink-50 via-white to-rose-50",
    warm: "from-pink-50 via-orange-50 to-red-100",
    cool: "from-rose-50 via-purple-50 to-white",

    // Button và element gradients
    button: "from-pink-500 via-rose-500 to-red-500",
    buttonHover: "from-pink-600 via-rose-600 to-red-600",
    card: "from-white/95 via-pink-50/90 to-rose-50/95",
    cardHover: "from-white via-pink-50 to-rose-50",

    // Icon backgrounds
    iconPink: "from-pink-100 to-rose-200",
    iconBlue: "from-purple-100 to-indigo-200",
    iconYellow: "from-orange-100 to-yellow-200",
    iconGreen: "from-red-100 to-pink-200",
    iconOrange: "from-orange-100 to-red-200",
    iconWhite: "from-white to-pink-50",

    // Text gradients
    textMain: "from-pink-600 via-rose-600 to-red-600",
    textAccent: "from-rose-500 via-pink-500 to-red-500",
    textSecondary: "from-red-600 via-rose-600 to-pink-600",

    // Borders
    border: "from-pink-200 via-rose-200 to-red-200",
    borderHover: "from-pink-300 via-rose-300 to-red-300",
  };

  const { scrollYProgress } = useScroll();

  // Scroll detection cho back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.pageYOffset > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch blog data từ Supabase
  useEffect(() => {
    const fetchBlogData = async () => {
      setBlogLoading(true);
      try {
        const posts = await getFeaturedPosts();
        setFeaturedPosts(posts.slice(0, 3));
        const categories = await getAllCategories();
        setBlogCategories(categories.slice(0, 6));
      } catch (error) {
        console.error("Error fetching blog data:", error);
        // Fallback data với màu pastel
        setFeaturedPosts([
          {
            id: "sample-1",
            title: "Top React Templates Pastel 2025",
            slug: "top-react-templates-pastel-2025",
            excerpt:
              "Khám phá những React templates với gam màu pastel nhẹ nhàng và hiện đại nhất 2025",
            content: "",
            featuredImage: "/blog/react-pastel-2025.jpg",
            publishedAt: "2025-01-15T09:00:00Z",
            updatedAt: "2025-01-15T09:00:00Z",
            isFeatured: true,
            isPublished: true,
            readTime: 6,
            views: 1350,
            likes: 95,
            tags: ["React", "Pastel", "Templates"],
            author: {
              id: "author-1",
              name: "Template Market Team",
              avatar: "/authors/template-team.jpg",
              bio: "Frontend Template Experts",
            },
            category: {
              id: "cat-1",
              name: "Design Templates",
              slug: "design-templates",
              description: "Thiết kế template",
              color: "pink",
              postCount: 28,
            },
            seo: {
              metaTitle: "Top React Templates Pastel 2025",
              metaDescription: "Templates React gam màu pastel",
              keywords: ["React", "Pastel"],
            },
          },
          {
            id: "sample-2",
            title: "UI/UX Design với Màu Pastel",
            slug: "ui-ux-design-mau-pastel",
            excerpt:
              "Hướng dẫn thiết kế giao diện với gam màu pastel tạo cảm giác nhẹ nhàng, thân thiện",
            content: "",
            featuredImage: "/blog/ui-ux-pastel.jpg",
            publishedAt: "2025-01-10T14:30:00Z",
            updatedAt: "2025-01-10T14:30:00Z",
            isFeatured: true,
            isPublished: true,
            readTime: 8,
            views: 980,
            likes: 72,
            tags: ["UI/UX", "Pastel", "Design"],
            author: {
              id: "author-2",
              name: "Design Expert",
              avatar: "/authors/design-expert.jpg",
              bio: "Pastel UI/UX Expert",
            },
            category: {
              id: "cat-2",
              name: "UI/UX",
              slug: "ui-ux",
              description: "Giao diện người dùng",
              color: "rose",
              postCount: 20,
            },
            seo: {
              metaTitle: "UI/UX Design với Màu Pastel",
              metaDescription: "Thiết kế UI với màu pastel",
              keywords: ["UI/UX", "Pastel"],
            },
          },
          {
            id: "sample-3",
            title: "Xu Hướng Template 2025",
            slug: "xu-huong-template-2025",
            excerpt:
              "Cập nhật xu hướng template mới nhất trong thiết kế web và ứng dụng di động",
            content: "",
            featuredImage: "/blog/template-trends-2025.jpg",
            publishedAt: "2025-01-05T11:15:00Z",
            updatedAt: "2025-01-05T11:15:00Z",
            isFeatured: true,
            isPublished: true,
            readTime: 10,
            views: 1680,
            likes: 148,
            tags: ["Templates", "Trends", "Design"],
            author: {
              id: "author-3",
              name: "Template Specialist",
              avatar: "/authors/template-specialist.jpg",
              bio: "Template Trends Expert",
            },
            category: {
              id: "cat-3",
              name: "Template Trends",
              slug: "template-trends",
              description: "Xu hướng template",
              color: "red",
              postCount: 35,
            },
            seo: {
              metaTitle: "Xu Hướng Template 2025",
              metaDescription: "Xu hướng template 2025",
              keywords: ["Templates", "Trends"],
            },
          },
        ]);

        setBlogCategories([
          {
            id: "cat-1",
            name: "Design Templates",
            slug: "design-templates",
            description: "Mẫu thiết kế",
            color: "pink",
            postCount: 28,
          },
          {
            id: "cat-2",
            name: "UI/UX",
            slug: "ui-ux",
            description: "Giao diện người dùng",
            color: "rose",
            postCount: 20,
          },
          {
            id: "cat-3",
            name: "Template Trends",
            slug: "template-trends",
            description: "Xu hướng template",
            color: "red",
            postCount: 35,
          },
          {
            id: "cat-4",
            name: "React Templates",
            slug: "react-templates",
            description: "Mẫu React",
            color: "pink",
            postCount: 42,
          },
          {
            id: "cat-5",
            name: "Vue Templates",
            slug: "vue-templates",
            description: "Mẫu Vue.js",
            color: "purple",
            postCount: 18,
          },
          {
            id: "cat-6",
            name: "HTML Templates",
            slug: "html-templates",
            description: "Mẫu HTML",
            color: "orange",
            postCount: 25,
          },
        ]);
      } finally {
        setBlogLoading(false);
      }
    };
    fetchBlogData();
  }, []);

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Company information - Updated to Template Market
  const companyInfo = {
    name: "Template Market",
    description:
      "Chào mừng trở lại sự sáng tạo! Tiếp tục hành trình sáng tạo với hàng nghìn template và e-book chất lượng cao.",
    address: "123 Template Street, Creative District, TP.HCM",
    phone: "+84 123 456 789",
    email: "hello@templatemarket.com",
  };

  // Navigation links
  const footerLinks = {
    products: [
      {
        label: "Templates",
        href: "/templates",
        icon: <LayoutTemplate className="w-4 h-4" />,
      },
      {
        label: "Components",
        href: "/components",
        icon: <Package className="w-4 h-4" />,
      },
      {
        label: "Icons",
        href: "/icons",
        icon: <Sparkles className="w-4 h-4" />,
      },
      {
        label: "Themes",
        href: "/themes",
        icon: <Palette className="w-4 h-4" />,
      },
      {
        label: "E-books",
        href: "/ebooks",
        icon: <BookOpen className="w-4 h-4" />,
      },
    ],
    resources: [
      { label: "Blog", href: "/blog", icon: <BookOpen className="w-4 h-4" /> },
      {
        label: "Documentation",
        href: "/docs",
        icon: <FileText className="w-4 h-4" />,
      },
      {
        label: "Help Center",
        href: "/help",
        icon: <HelpCircle className="w-4 h-4" />,
      },
      { label: "API", href: "/api", icon: <Code className="w-4 h-4" /> },
      {
        label: "Community",
        href: "/community",
        icon: <Users className="w-4 h-4" />,
      },
    ],
    company: [
      {
        label: "About Us",
        href: "/about",
        icon: <Users className="w-4 h-4" />,
      },
      {
        label: "Careers",
        href: "/careers",
        icon: <Briefcase className="w-4 h-4" />,
      },
      {
        label: "Contact",
        href: "/contact",
        icon: <MessageCircle className="w-4 h-4" />,
      },
      { label: "Press", href: "/press", icon: <Award className="w-4 h-4" /> },
      {
        label: "Partners",
        href: "/partners",
        icon: <Target className="w-4 h-4" />,
      },
    ],
    legal: [
      {
        label: "Privacy Policy",
        href: "/privacy",
        icon: <Shield className="w-4 h-4" />,
      },
      {
        label: "Terms of Service",
        href: "/terms",
        icon: <FileText className="w-4 h-4" />,
      },
      {
        label: "Cookie Policy",
        href: "/cookies",
        icon: <Lock className="w-4 h-4" />,
      },
      {
        label: "Refund Policy",
        href: "/refunds",
        icon: <CreditCard className="w-4 h-4" />,
      },
    ],
  };

  // Social media links
  const socialLinks = [
    {
      name: "Facebook",
      href: "#",
      icon: <Facebook className="w-5 h-5" />,
      color: "from-blue-500 to-indigo-500",
    },
    {
      name: "Twitter",
      href: "#",
      icon: <Twitter className="w-5 h-5" />,
      color: "from-sky-500 to-blue-500",
    },
    {
      name: "Instagram",
      href: "#",
      icon: <Instagram className="w-5 h-5" />,
      color: "from-pink-500 to-rose-500",
    },
    {
      name: "LinkedIn",
      href: "#",
      icon: <Linkedin className="w-5 h-5" />,
      color: "from-blue-600 to-blue-700",
    },
    {
      name: "Github",
      href: "#",
      icon: <Github className="w-5 h-5" />,
      color: "from-gray-700 to-gray-800",
    },
    {
      name: "YouTube",
      href: "#",
      icon: <Youtube className="w-5 h-5" />,
      color: "from-red-500 to-red-600",
    },
  ];

  // Company stats
  const stats = [
    {
      label: "Happy Clients",
      value: "50,000+",
      icon: <Heart className="w-5 h-5" />,
      color: pastelsSchemes.iconPink,
    },
    {
      label: "Templates",
      value: "8,500+",
      icon: <LayoutTemplate className="w-5 h-5" />,
      color: pastelsSchemes.iconBlue,
    },
    {
      label: "Years Experience",
      value: "7+",
      icon: <Clock className="w-5 h-5" />,
      color: pastelsSchemes.iconYellow,
    },
    {
      label: "Designers",
      value: "50,000+",
      icon: <Users className="w-5 h-5" />,
      color: pastelsSchemes.iconGreen,
    },
  ];

  // Featured services
  const featuredServices = [
    {
      title: "Premium Templates",
      desc: "Template cao cấp",
      icon: Crown,
      color: pastelsSchemes.iconPink,
    },
    {
      title: "Template Store",
      desc: "Kho template đa dạng",
      icon: Store,
      color: pastelsSchemes.iconBlue,
    },
    {
      title: "UI Components",
      desc: "Thành phần giao diện",
      icon: Package,
      color: pastelsSchemes.iconYellow,
    },
    {
      title: "E-book Library",
      desc: "Thư viện e-book",
      icon: BookOpen,
      color: pastelsSchemes.iconGreen,
    },
    {
      title: "Designer Support",
      desc: "Hỗ trợ designer",
      icon: Award,
      color: pastelsSchemes.iconOrange,
    },
  ];

  // Quick links
  const quickLinks = [
    { label: "Getting Started", href: "/getting-started" },
    { label: "Pricing", href: "/pricing" },
    { label: "Downloads", href: "/downloads" },
    { label: "Changelog", href: "/changelog" },
    { label: "Roadmap", href: "/roadmap" },
    { label: "Status", href: "/status" },
  ];

  return (
    <>
      <Helmet>
        <title>Footer - Template Market</title>
        <meta
          name="description"
          content="Liên hệ với Template Market - Chào mừng trở lại sự sáng tạo"
        />
      </Helmet>

      {/* Footer */}
      <footer
        className={`relative overflow-hidden bg-gradient-to-br ${pastelsSchemes.main} pastel-bg-pattern`}
        style={{
          backgroundImage: `radial-gradient(circle at 20% 80%, rgba(236, 72, 153, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 80% 20%, rgba(244, 63, 94, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 40% 40%, rgba(220, 38, 127, 0.05) 0%, transparent 50%)`,
        }}
      >
        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[
            {
              emoji: "🌸",
              position: "top-10 right-20",
              delay: 0,
              color: pastelsSchemes.iconPink,
            },
            {
              emoji: "✨",
              position: "top-32 right-10",
              delay: 1,
              color: pastelsSchemes.iconYellow,
            },
            {
              emoji: "💖",
              position: "bottom-20 left-10",
              delay: 2,
              color: pastelsSchemes.iconGreen,
            },
            {
              emoji: "🎨",
              position: "top-20 left-20",
              delay: 3,
              color: pastelsSchemes.iconBlue,
            },
            {
              emoji: "🌷",
              position: "bottom-32 right-32",
              delay: 4,
              color: pastelsSchemes.iconPink,
            },
            {
              emoji: "💫",
              position: "top-1/2 left-1/4",
              delay: 5,
              color: pastelsSchemes.iconOrange,
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              className={`absolute ${item.position} text-2xl lg:text-3xl 3xl:text-4xl opacity-20`}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 10, -10, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: item.delay,
              }}
            >
              <motion.div
                className={`p-2 lg:p-3 3xl:p-4 rounded-full bg-gradient-to-r ${item.color} backdrop-blur-sm shadow-lg animate-morph`}
                whileHover={{ scale: 1.3, rotate: 20 }}
              >
                <span className="animate-float">{item.emoji}</span>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 lg:pt-20">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-12 lg:mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className={`text-center p-4 sm:p-6 rounded-2xl 3xl:rounded-3xl bg-gradient-to-br ${pastelsSchemes.card} backdrop-blur-sm border border-white/50 shadow-lg`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  viewport={{ once: true }}
                >
                  <motion.div
                    className={`w-12 h-12 sm:w-14 sm:h-14 3xl:w-16 3xl:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-gradient-to-r ${stat.color} shadow-lg flex items-center justify-center`}
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {stat.icon}
                  </motion.div>
                  <h3 className="text-xl sm:text-2xl 3xl:text-3xl font-bold text-pink-700 mb-1 sm:mb-2">
                    {stat.value}
                  </h3>
                  <p className="text-xs sm:text-sm 3xl:text-base text-slate-600 font-medium">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 pb-8 lg:pb-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Company Info - Takes more space */}
              <motion.div
                className="lg:col-span-4"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div
                  className={`p-6 sm:p-8 rounded-2xl 3xl:rounded-3xl bg-gradient-to-br ${pastelsSchemes.card} backdrop-blur-sm border border-white/50 shadow-lg h-full`}
                >
                  {/* Logo */}
                  <Link to="/" className="inline-flex items-center group mb-6">
                    <motion.div
                      className={`w-10 h-10 sm:w-12 sm:h-12 3xl:w-14 3xl:h-14 rounded-full bg-gradient-to-r ${pastelsSchemes.button} shadow-xl flex items-center justify-center mr-3`}
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <LayoutTemplate className="w-5 h-5 sm:w-6 sm:h-6 3xl:w-7 3xl:h-7 text-white" />
                    </motion.div>
                    <span className="text-xl sm:text-2xl 3xl:text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                      {companyInfo.name}
                    </span>
                  </Link>

                  <p className="text-sm sm:text-base 3xl:text-lg text-slate-700 mb-6 leading-relaxed">
                    {companyInfo.description}
                  </p>

                  {/* Contact Info */}
                  <div className="space-y-3 sm:space-y-4 mb-6">
                    <motion.div
                      className="flex items-center group"
                      whileHover={{ x: 5 }}
                    >
                      <div
                        className={`w-8 h-8 sm:w-9 sm:h-9 3xl:w-10 3xl:h-10 rounded-full bg-gradient-to-r ${pastelsSchemes.iconBlue} flex items-center justify-center mr-3 group-hover:shadow-lg transition-all duration-300`}
                      >
                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 3xl:w-6 3xl:h-6 text-purple-600" />
                      </div>
                      <span className="text-sm sm:text-base 3xl:text-lg text-slate-700">
                        {companyInfo.address}
                      </span>
                    </motion.div>

                    <motion.div
                      className="flex items-center group"
                      whileHover={{ x: 5 }}
                    >
                      <div
                        className={`w-8 h-8 sm:w-9 sm:h-9 3xl:w-10 3xl:h-10 rounded-full bg-gradient-to-r ${pastelsSchemes.iconGreen} flex items-center justify-center mr-3 group-hover:shadow-lg transition-all duration-300`}
                      >
                        <Phone className="w-4 h-4 sm:w-5 sm:h-5 3xl:w-6 3xl:h-6 text-red-600" />
                      </div>
                      <span className="text-sm sm:text-base 3xl:text-lg text-slate-700">
                        {companyInfo.phone}
                      </span>
                    </motion.div>

                    <motion.div
                      className="flex items-center group"
                      whileHover={{ x: 5 }}
                    >
                      <div
                        className={`w-8 h-8 sm:w-9 sm:h-9 3xl:w-10 3xl:h-10 rounded-full bg-gradient-to-r ${pastelsSchemes.iconYellow} flex items-center justify-center mr-3 group-hover:shadow-lg transition-all duration-300`}
                      >
                        <Mail className="w-4 h-4 sm:w-5 sm:h-5 3xl:w-6 3xl:h-6 text-orange-600" />
                      </div>
                      <span className="text-sm sm:text-base 3xl:text-lg text-slate-700">
                        {companyInfo.email}
                      </span>
                    </motion.div>
                  </div>

                  {/* Social Links */}
                  <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
                    {socialLinks.map((social, index) => (
                      <motion.a
                        key={index}
                        href={social.href}
                        className={`w-10 h-10 sm:w-11 sm:h-11 3xl:w-12 3xl:h-12 rounded-full bg-gradient-to-r ${social.color} flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300`}
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {social.icon}
                      </motion.a>
                    ))}
                  </div>

                  {/* Featured Services */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <h4
                      className={`text-lg font-semibold mb-4 bg-gradient-to-r ${pastelsSchemes.textAccent} bg-clip-text text-transparent`}
                    >
                      ✨ Dịch Vụ Nổi Bật
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                      {featuredServices.map((service, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 + 0.4 }}
                          whileHover={{ scale: 1.02 }}
                          className={`p-3 bg-gradient-to-r ${pastelsSchemes.card} rounded-lg border border-gray-200/50 hover:shadow-md transition-all duration-300`}
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`p-2 rounded-lg bg-gradient-to-r ${service.color} shadow-sm`}
                            >
                              <service.icon className="w-4 h-4 text-gray-700" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm text-gray-800 dark:text-gray-200">
                                {service.title}
                              </div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">
                                {service.desc}
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-xs"
                            >
                              Tìm hiểu
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Links and Content Grid */}
              <div className="lg:col-span-8 space-y-8 lg:space-y-12">
                {/* Navigation Links */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 lg:gap-8">
                  {Object.entries(footerLinks).map(
                    ([category, links], categoryIndex) => (
                      <motion.div
                        key={category}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.5,
                          delay: categoryIndex * 0.1,
                        }}
                        viewport={{ once: true }}
                      >
                        <h3 className="text-lg sm:text-xl 3xl:text-2xl font-bold text-pink-700 mb-4 sm:mb-6 capitalize">
                          {category === "products"
                            ? "Sản phẩm"
                            : category === "resources"
                              ? "Tài nguyên"
                              : category === "company"
                                ? "Công ty"
                                : "Pháp lý"}
                        </h3>
                        <ul className="space-y-2 sm:space-y-3">
                          {links.map((link, linkIndex) => (
                            <motion.li
                              key={linkIndex}
                              whileHover={{ x: 5 }}
                              transition={{ type: "spring", stiffness: 300 }}
                            >
                              <Link
                                to={link.href}
                                className="flex items-center text-slate-600 hover:text-pink-600 transition-all duration-300 group text-sm sm:text-base 3xl:text-lg"
                              >
                                <span className="mr-2 sm:mr-3 opacity-60 group-hover:opacity-100 transition-opacity">
                                  {link.icon}
                                </span>
                                {link.label}
                                <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 ml-1 opacity-0 group-hover:opacity-60 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0" />
                              </Link>
                            </motion.li>
                          ))}
                        </ul>
                      </motion.div>
                    ),
                  )}
                </div>

                {/* Quick Links */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <h4
                    className={`text-lg font-semibold mb-4 bg-gradient-to-r ${pastelsSchemes.textMain} bg-clip-text text-transparent`}
                  >
                    🔗 Quick Links
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {quickLinks.map((link, idx) => (
                      <motion.div key={idx} whileHover={{ scale: 1.05 }}>
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className={`bg-gradient-to-r ${pastelsSchemes.card} border-pink-200 hover:border-pink-300 text-slate-700 hover:text-pink-700 transition-all duration-300 h-7 px-3 text-xs rounded-full`}
                        >
                          <Link to={link.href}>{link.label}</Link>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Latest Blog Posts */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <h3
                    className={`text-lg font-semibold mb-4 bg-gradient-to-r ${pastelsSchemes.textSecondary} bg-clip-text text-transparent`}
                  >
                    📚 Blog Template Mới Nhất
                  </h3>
                  <div className="space-y-3">
                    {blogLoading
                      ? Array.from({ length: 3 }).map((_, idx) => (
                          <div
                            key={idx}
                            className="animate-pulse p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg"
                          >
                            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                          </div>
                        ))
                      : featuredPosts.map((post, idx) => (
                          <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            className={`p-3 bg-gradient-to-r ${pastelsSchemes.card} rounded-lg border border-gray-200/50 hover:shadow-md transition-all duration-300 group cursor-pointer`}
                            onClick={() =>
                              (window.location.href = `/blog/${post.slug}`)
                            }
                          >
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0">
                                <div
                                  className={`w-12 h-12 rounded-lg bg-gradient-to-r ${post.category.color === "pink" ? pastelsSchemes.iconPink : post.category.color === "rose" ? pastelsSchemes.iconBlue : pastelsSchemes.iconYellow} flex items-center justify-center shadow-sm`}
                                >
                                  <BookOpen className="w-6 h-6 text-gray-700" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm text-gray-800 dark:text-gray-200 line-clamp-2 group-hover:text-pink-700 transition-colors">
                                  {post.title}
                                </h4>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                  {post.excerpt}
                                </p>
                                <div className="flex items-center justify-between mt-2">
                                  <div className="flex items-center space-x-3 text-xs text-gray-500">
                                    <span className="flex items-center">
                                      <Clock className="w-3 h-3 mr-1" />
                                      {post.readTime} phút đọc
                                    </span>
                                    <span className="flex items-center">
                                      <Eye className="w-3 h-3 mr-1" />
                                      {post.views}
                                    </span>
                                    <span className="flex items-center">
                                      <Heart className="w-3 h-3 mr-1" />
                                      {post.likes}
                                    </span>
                                  </div>
                                  <Badge
                                    variant="outline"
                                    className={`text-xs bg-gradient-to-r ${post.category.color === "pink" ? pastelsSchemes.iconPink : post.category.color === "rose" ? pastelsSchemes.iconBlue : pastelsSchemes.iconYellow} border-0`}
                                  >
                                    {post.category.name}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                  </div>
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className={`bg-gradient-to-r ${pastelsSchemes.card} border-pink-200 hover:border-pink-300 text-pink-700 hover:text-pink-800`}
                    >
                      <Link to="/blog">
                        Xem tất cả bài viết{" "}
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              </div>
            </div>

            <Separator className="my-12" />

            {/* Bottom Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    © 2025 {companyInfo.name}. All rights reserved.
                  </p>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <span>Made with</span>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <Heart className="w-4 h-4 text-pink-500" />
                    </motion.div>
                    <span>and</span>
                    <span className="text-pink-500">🎨</span>
                    <span>in Vietnam</span>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="flex space-x-4 text-sm">
                    {[
                      { to: "/privacy", label: "Privacy" },
                      { to: "/terms", label: "Terms" },
                      { to: "/cookies", label: "Cookies" },
                    ].map((link, idx) => (
                      <Link
                        key={idx}
                        to={link.to}
                        className="text-gray-600 dark:text-gray-400 hover:text-pink-600 hover:underline transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>

                  {/* Back to Top Button */}
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
                          className={`transition-all duration-300 group hover:scale-110 hover:shadow-lg bg-gradient-to-r ${pastelsSchemes.button} text-white border-0`}
                        >
                          <motion.div
                            animate={{ y: [0, -2, 0] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          >
                            <ArrowUp className="w-4 h-4" />
                          </motion.div>
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
