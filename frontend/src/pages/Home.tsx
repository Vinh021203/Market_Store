import { useState, useEffect } from "react";
import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getFeaturedProducts } from "@/lib/products";
import { Product } from "@/types";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ArrowRight,
  Star,
  TrendingUp,
  Package,
  BookOpen,
  Shield,
  Award,
  Users,
  Download,
  Code,
  Sparkles,
  Heart,
  Rocket,
  Quote,
  CheckCircle,
  Gift,
  Mail,
  Search,
  Database,
  Target,
  User,
  Lightbulb,
  Crown,
  ShoppingCart,
  Smartphone,
  Globe,
  Headphones,
  BarChart3,
  Briefcase,
  Send,
  ChevronRight,
  ChevronLeft,
  Compass,
  Percent,
  Palette,
  Clock,
  Zap,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Home: React.FC = () => {
  // ✨ Section Background Colors - Tương tự footer nhưng nhạt hơn
  // ✅ GIỮ NGUYÊN TÊN - CHỈ ĐỔI MÀU
  const sectionBackgrounds = {
    hero: "from-pink-50 via-blue-50 to-yellow-50", // ✅ Pastel từ Login
    stats: "from-pink-50/80 via-blue-50/60 to-yellow-50/80", // ✅ Pastel từ Login
    categories: "from-pink-50 via-blue-50 to-yellow-50", // ✅ Pastel từ Login
    features: "from-pink-50/80 via-blue-50/60 to-yellow-50/80",
    process: "from-pink-50 via-blue-50 to-yellow-50",
    products: "from-pink-50/80 via-blue-50/60 to-yellow-50/80",
    testimonials: "from-pink-50 via-blue-50 to-yellow-50",
    newsletter: "from-pink-50/80 via-blue-50/60 to-yellow-50/80",
  };

  // ✨ UNIFIED Color Scheme - Cùng màu với Header nhưng nhạt hơn
  // ✅ GIỮ NGUYÊN TÊN - CHỈ ĐỔI MÀU
  const unifiedColorScheme = {
    // Buttons - Pastel từ Login
    button: "from-pink-400 via-orange-400 to-yellow-400", // ✅ Từ Login
    buttonHover: "from-pink-500 via-orange-500 to-yellow-500", // ✅ Từ Login

    // Text gradients - Pastel từ Login
    textMain: "from-pink-600 via-blue-600 to-orange-600", // ✅ Từ Login
    textSecondary: "from-orange-500 via-pink-500 to-yellow-500", // ✅ Từ Login

    // Icons - Pastel từ Login
    iconBg: "from-pink-100 to-pink-200", // ✅ Từ Login
    iconText: "text-pink-500", // ✅ Giữ nguyên

    // Cards - Pastel từ Login
    cardBg: "from-white/95 via-pink-50/60 to-blue-50/40", // ✅ Từ Login
  };

  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const { scrollY } = useScroll();

  // Parallax effects
  const parallaxY = useTransform(scrollY, [0, 1000], [0, -100]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const products = await getFeaturedProducts(6);
        setFeaturedProducts(products);
      } catch (error) {
        console.error("Error fetching featured products:", error);
        // ✅ FIXED Fallback data - Match exact Product interface
        setFeaturedProducts([
          {
            id: "1",
            title: "Pastel Dashboard Pro", // ✅ CHANGED: name → title
            description: "Modern admin dashboard với pastel design system",
            price: 49,
            originalPrice: 79,
            category: "template", // ✅ FIXED: Use valid category
            tags: ["React", "Dashboard", "Pastel", "TypeScript"],
            image: "/templates/dashboard-1.jpg", // ✅ ADDED: Required single image
            images: [
              "/templates/dashboard-1.jpg",
              "/templates/dashboard-2.jpg",
            ], // ✅ Keep images array
            downloadUrl: "/download/dashboard-pro", // ✅ ADDED: Optional field
            previewUrl: "/preview/dashboard-pro", // ✅ ADDED: Optional field
            rating: 4.9,
            reviewCount: 156,
            isFeatured: true, // ✅ CHANGED: featured → isFeatured
            isActive: true, // ✅ ADDED: Required field
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            author: "Template Market Team", // ✅ ADDED: Required field
            difficulty: "Intermediate", // ✅ ADDED: Optional field
            technologies: ["React", "TypeScript", "Tailwind CSS", "Next.js"], // ✅ ADDED: Optional field
            fileSize: "2.5 MB", // ✅ ADDED: Optional field
            format: "ZIP", // ✅ ADDED: Optional field
          },
          {
            id: "2",
            title: "E-commerce Pastel Store", // ✅ CHANGED: name → title
            description: "Complete e-commerce solution với beautiful UI",
            price: 69,
            originalPrice: 99,
            category: "template", // ✅ FIXED: Use valid category
            tags: ["Vue", "E-commerce", "Stripe", "Responsive"],
            image: "/templates/ecommerce-1.jpg", // ✅ ADDED: Required single image
            images: [
              "/templates/ecommerce-1.jpg",
              "/templates/ecommerce-2.jpg",
            ],
            downloadUrl: "/download/ecommerce-store",
            previewUrl: "/preview/ecommerce-store",
            rating: 4.8,
            reviewCount: 89,
            isFeatured: true, // ✅ CHANGED: featured → isFeatured
            isActive: true, // ✅ ADDED: Required field
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            author: "Vue Commerce Team", // ✅ ADDED: Required field
            difficulty: "Advanced", // ✅ ADDED: Optional field
            technologies: ["Vue.js", "Nuxt.js", "Stripe", "Pinia"],
            fileSize: "3.2 MB",
            format: "ZIP",
          },
          {
            id: "3",
            title: "SaaS Landing Page Kit", // ✅ CHANGED: name → title
            description: "Professional landing pages for SaaS products",
            price: 39,
            originalPrice: 59,
            category: "template", // ✅ FIXED: Use valid category
            tags: ["Next.js", "SaaS", "Conversion", "SEO"],
            image: "/templates/saas-1.jpg", // ✅ ADDED: Required single image
            images: ["/templates/saas-1.jpg", "/templates/saas-2.jpg"],
            downloadUrl: "/download/saas-kit",
            previewUrl: "/preview/saas-kit",
            rating: 4.9,
            reviewCount: 234,
            isFeatured: true, // ✅ CHANGED: featured → isFeatured
            isActive: true, // ✅ ADDED: Required field
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            author: "SaaS Design Studio", // ✅ ADDED: Required field
            difficulty: "Beginner", // ✅ ADDED: Optional field
            technologies: ["Next.js", "React", "Tailwind CSS", "Framer Motion"],
            fileSize: "1.8 MB",
            format: "ZIP",
          },
        ]);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchFeaturedProducts();

    // Intersection Observer
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
      { threshold: 0.1, rootMargin: "-10% 0px -10% 0px" },
    );

    const sections = document.querySelectorAll("[data-animate]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Data Arrays (keeping same as before)
  const testimonials = [
    {
      name: "Nguyễn Quang Anh",
      role: "Senior Frontend Developer",
      company: "FPT Software",
      location: "Hồ Chí Minh, Việt Nam",
      content:
        "Template Market đã thay đổi hoàn toàn workflow của team mình. Code quality tuyệt vời, documentation chi tiết, và support team luôn responsive. Đặc biệt impressed với pastel design system - rất hiện đại và professional!",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      date: "2 tuần trước",
      verified: true,
      projectType: "Enterprise E-commerce Platform",
      flag: "🇻🇳",
      revenue: "+300% conversion rate",
      timeFrame: "Trong 3 tháng",
    },
    {
      name: "Nguyễn Thị Hoài Ngọc",
      role: "UI/UX Design Lead",
      company: "Vingroup Technology",
      location: "Hà Nội, Việt Nam",
      content:
        "Là một designer, tôi rất khó tính về aesthetics và user experience. Nhưng templates từ Template Market truly exceed my expectations. Color theory được apply một cách tinh tế, typography hoàn hảo, và micro-interactions rất smooth.",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b95eeb3e?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      date: "1 tuần trước",
      verified: true,
      projectType: "Design System & Component Library",
      flag: "🇻🇳",
      revenue: "+150% design efficiency",
      timeFrame: "Ngay lập tức",
    },
    {
      name: "Bùi Huy Đức",
      role: "Tech Lead & Full Stack Developer",
      company: "Tiki Corporation",
      location: "Hồ Chí Minh, Việt Nam",
      content:
        "Sau 8 năm experience trong industry, tôi có thể confirm rằng Template Market provides the best templates trong market. Architecture solid, performance optimized, security best practices được implement correctly. Highly recommend!",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      date: "3 ngày trước",
      verified: true,
      projectType: "Microservices Dashboard Platform",
      flag: "🇻🇳",
      revenue: "-60% development time",
      timeFrame: "So với tự build from scratch",
    },
  ];

  const stats = [
    {
      number: "50K+",
      label: "Khách hàng hài lòng",
      icon: Users,
      color: unifiedColorScheme.iconBg,
      textColor: "text-pink-500",
      description: "Trên 120 quốc gia",
      growth: "+23% tháng này",
    },
    {
      number: "2.5K+",
      label: "Templates premium",
      icon: Package,
      color: unifiedColorScheme.iconBg,
      textColor: "text-rose-500",
      description: "Cập nhật hàng tuần",
      growth: "+156 templates mới",
    },
    {
      number: "1.2K+",
      label: "E-books chuyên sâu",
      icon: BookOpen,
      color: unifiedColorScheme.iconBg,
      textColor: "text-red-500",
      description: "Từ industry experts",
      growth: "+45 e-books tháng này",
    },
    {
      number: "4.9/5",
      label: "Đánh giá trung bình",
      icon: Star,
      color: unifiedColorScheme.iconBg,
      textColor: "text-pink-500",
      description: "Từ 50K+ reviews",
      growth: "99.2% satisfaction",
    },
  ];

  const categories = [
    {
      title: "React & Next.js",
      description:
        "Modern React templates với Next.js, TypeScript, Tailwind CSS và latest best practices. Server components, app router, optimized performance.",
      icon: Code,
      count: "450+",
      gradient: "from-pink-400 to-rose-500",
      bgGradient: unifiedColorScheme.cardBg,
      route: "/templates?category=react",
      tags: ["TypeScript", "Next.js 14", "App Router", "Server Components"],
      popular: true,
      trend: "+12% this month",
    },
    {
      title: "Vue.js & Nuxt",
      description:
        "Vue.js 3 templates với Composition API, Nuxt 3, Pinia state management, Vite build tool. Performance-first approach.",
      icon: Zap,
      count: "280+",
      gradient: "from-rose-400 to-red-500",
      bgGradient: unifiedColorScheme.cardBg,
      route: "/templates?category=vue",
      tags: ["Vue 3", "Nuxt 3", "Pinia", "Vite"],
      popular: false,
      trend: "+8% this month",
    },
    {
      title: "Mobile & PWA",
      description:
        "React Native, Flutter, và Progressive Web Apps với offline support, push notifications, native performance.",
      icon: Smartphone,
      count: "180+",
      gradient: "from-red-400 to-pink-500",
      bgGradient: unifiedColorScheme.cardBg,
      route: "/templates?category=mobile",
      tags: ["React Native", "Flutter", "PWA", "Offline-first"],
      popular: true,
      trend: "+25% this month",
    },
    {
      title: "Admin & Dashboards",
      description:
        "Professional admin panels với advanced charts, tables, authentication, role management, real-time data visualization.",
      icon: BarChart3,
      count: "320+",
      gradient: "from-pink-500 to-rose-400",
      bgGradient: unifiedColorScheme.cardBg,
      route: "/templates?category=admin",
      tags: ["Charts", "Tables", "Auth", "Real-time", "RBAC"],
      popular: true,
      trend: "+15% this month",
    },
    {
      title: "E-commerce & Retail",
      description:
        "Complete e-commerce solutions với cart, checkout, payment integration, inventory management, multi-vendor support.",
      icon: Database,
      count: "220+",
      gradient: "from-rose-500 to-pink-500",
      bgGradient: unifiedColorScheme.cardBg,
      route: "/templates?category=ecommerce",
      tags: ["Stripe", "PayPal", "Multi-vendor", "Inventory", "SEO"],
      popular: false,
      trend: "+18% this month",
    },
    {
      title: "SaaS & Startups",
      description:
        "SaaS landing pages, pricing pages, authentication flows, subscription management, customer dashboards.",
      icon: Rocket,
      count: "190+",
      gradient: "from-red-500 to-pink-400",
      bgGradient: unifiedColorScheme.cardBg,
      route: "/templates?category=saas",
      tags: ["Landing Pages", "Pricing", "Subscriptions", "Onboarding"],
      popular: true,
      trend: "+22% this month",
    },
  ];

  const features = [
    {
      icon: Shield,
      title: "Enterprise-Grade Security",
      description:
        "Security best practices, OWASP compliance, vulnerability scanning",
      color: "from-pink-300 to-rose-400",
      bgColor: "from-pink-25 to-rose-25",
      details: [
        "OWASP Top 10 Protected",
        "Automated Security Scans",
        "SSL/TLS Encryption",
        "GDPR Compliant",
      ],
    },
    {
      icon: Smartphone,
      title: "Mobile-First Responsive",
      description: "Perfect on all devices, progressive enhancement approach",
      color: "from-rose-300 to-red-400",
      bgColor: "from-rose-25 to-red-25",
      details: [
        "iOS & Android Optimized",
        "Touch-friendly Interfaces",
        "Offline Support",
        "App-like Experience",
      ],
    },
    {
      icon: TrendingUp,
      title: "Performance Optimized",
      description: "99+ PageSpeed scores, lazy loading, code splitting, CDN",
      color: "from-red-300 to-pink-400",
      bgColor: "from-red-25 to-pink-25",
      details: [
        "Core Web Vitals Optimized",
        "Image Optimization",
        "Code Splitting",
        "CDN Integration",
      ],
    },
    {
      icon: Award,
      title: "24/7 Premium Support",
      description:
        "Dedicated support team, live chat, video calls, priority queue",
      color: "from-pink-400 to-rose-300",
      bgColor: "from-pink-25 to-rose-25",
      details: [
        "Live Chat Support",
        "Video Call Assistance",
        "Priority Queue",
        "Custom Development",
      ],
    },
  ];

  const processSteps = [
    {
      step: "01",
      title: "Browse & Discover",
      description:
        "Explore our curated collection of 2500+ premium templates and 1200+ professional e-books",
      icon: Search,
      color: "from-pink-300 to-rose-400",
    },
    {
      step: "02",
      title: "Preview & Customize",
      description:
        "Live preview, inspect code, customize colors, fonts, and layouts to match your brand",
      icon: Target,
      color: "from-rose-300 to-red-400",
    },
    {
      step: "03",
      title: "Download & Deploy",
      description:
        "Instant download, complete documentation, deploy to Vercel/Netlify with one click",
      icon: Download,
      color: "from-red-300 to-pink-400",
    },
    {
      step: "04",
      title: "Launch & Scale",
      description:
        "Go live with confidence, ongoing updates, performance monitoring, and growth support",
      icon: Rocket,
      color: "from-pink-400 to-rose-300",
    },
  ];

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "🎉 Welcome to Template Market!",
        description:
          "Check your email for exclusive templates và development tips!",
      });
      setNewsletterEmail("");
    } catch (error) {
      toast({
        title: "Oops! Something went wrong",
        description:
          "Please try again or contact support if the issue persists.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>
          Template Market - Premium Templates & E-books for Modern Developers
        </title>
        <meta
          name="description"
          content="Discover 2500+ premium templates and 1200+ professional e-books. Trusted by 50K+ developers worldwide. Modern, responsive, and production-ready solutions."
        />
        <meta
          name="keywords"
          content="premium templates, react templates, vue templates, nextjs, e-books, ui components, dashboard templates, saas templates"
        />
        <link rel="canonical" href="https://templatemarket.com" />
      </Helmet>
      {/* Ultra Light Pink Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {[
          {
            emoji: "🍪",
            color: "from-orange-100 to-yellow-200",
            position: "top-10 right-20",
          },
          {
            emoji: "💖",
            color: "from-pink-100 to-pink-200",
            position: "top-32 left-10",
          },
          {
            emoji: "🚀",
            color: "from-blue-100 to-cyan-200",
            position: "bottom-20 right-10",
          },
          {
            emoji: "✨",
            color: "from-yellow-100 to-orange-200",
            position: "bottom-32 left-20",
          },
          {
            emoji: "🎨",
            color: "from-green-100 to-emerald-200",
            position: "top-1/2 right-1/4",
          },
          {
            emoji: "🌟",
            color: "from-pink-100 to-pink-200",
            position: "top-1/3 left-1/3",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            className={`absolute ${item.position} text-4xl opacity-30`}
            animate={{
              y: [0, -15, 0],
              rotate: [0, 8, -8, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 6 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          >
            <motion.div
              className={`p-2 lg:p-3 rounded-full bg-gradient-to-r ${item.color} backdrop-blur-sm shadow-lg`}
              whileHover={{ scale: 1.2, rotate: 15 }}
            >
              <span>{item.emoji}</span>
            </motion.div>
          </motion.div>
        ))}
      </div>
      <main className="relative z-10">
        {/* ===== HERO SECTION CHUYÊN NGHIỆP ===== */}
        <section
          className={`relative px-4 py-12 sm:py-20 lg:py-24 bg-gradient-to-br ${sectionBackgrounds.hero} overflow-hidden min-h-screen 2xl:min-h-0 flex items-center`}
          id="hero"
          data-animate
          style={{
            backgroundImage: `radial-gradient(circle at 20% 80%, rgba(236, 72, 153, 0.03) 0%, transparent 50%),
                     radial-gradient(circle at 80% 20%, rgba(244, 63, 94, 0.03) 0%, transparent 50%),
                     radial-gradient(circle at 40% 40%, rgba(220, 38, 127, 0.02) 0%, transparent 50%)`,
          }}
        >
          <div className="container relative z-10 mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* ✅ Left Column - Nội dung chuyên nghiệp */}
              <motion.div
                initial={{ opacity: 0, x: -60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
                className="space-y-8"
              >
                {/* ✅ Badge chuyên nghiệp */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <Badge
                    className={`bg-gradient-to-r ${unifiedColorScheme.button} text-white px-6 py-2.5 text-sm font-semibold shadow-xl inline-flex items-center gap-3 rounded-full`}
                  >
                    <Award className="w-4 h-4" />
                    Nền tảng Template & E-book hàng đầu Việt Nam 🇻🇳
                    <div className="w-2 h-2 bg-white/80 rounded-full animate-pulse" />
                  </Badge>
                </motion.div>

                {/* ✅ Tiêu đề chuyên nghiệp */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.4 }}
                  className="space-y-6"
                >
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1]">
                    <span className="relative bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 bg-clip-text text-transparent">
                      SOCIAL MARKET
                      <motion.div
                        className="absolute -inset-2 bg-gradient-to-r from-pink-50/20 to-rose-50/20 rounded-xl -z-10"
                        animate={{
                          scale: [1, 1.02, 1],
                          rotate: [0, 0.5, 0],
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                      />
                    </span>
                  </h1>

                  {/* ✅ Mô tả chuyên nghiệp */}
                  <div className="space-y-5">
                    <p className="text-lg sm:text-xl lg:text-2xl text-slate-700 font-medium leading-relaxed">
                      Tăng tốc dự án của bạn với{" "}
                      <span
                        className={`font-bold bg-gradient-to-r ${unifiedColorScheme.textSecondary} bg-clip-text text-transparent relative`}
                      >
                        2,500+ templates React/Vue/Next.js
                        <motion.div
                          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-300 to-rose-300 rounded-full"
                          animate={{ scaleX: [0, 1] }}
                          transition={{ duration: 2, delay: 1 }}
                        />
                      </span>{" "}
                      và{" "}
                      <span
                        className={`font-bold bg-gradient-to-r ${unifiedColorScheme.textSecondary} bg-clip-text text-transparent relative`}
                      >
                        1,200+ e-books kỹ thuật
                        <motion.div
                          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-rose-300 to-red-300 rounded-full"
                          animate={{ scaleX: [0, 1] }}
                          transition={{ duration: 2, delay: 1.5 }}
                        />
                      </span>
                    </p>

                    {/* ✅ Chỉ số tin cậy chuyên nghiệp */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 py-3 rounded-xl shadow-sm">
                        <Users className="w-4 h-4 text-pink-500" />
                        <span>
                          <strong>50,000+</strong> developers tin tưởng
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 py-3 rounded-xl shadow-sm">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>
                          <strong>4.9/5</strong> đánh giá (25K+ reviews)
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 py-3 rounded-xl shadow-sm">
                        <Shield className="w-4 h-4 text-pink-500" />
                        <span>
                          <strong>Enterprise</strong> security
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* ✅ CTA Buttons chuyên nghiệp */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      size="lg"
                      className={`bg-gradient-to-r ${unifiedColorScheme.button} hover:${unifiedColorScheme.buttonHover} text-white font-bold px-8 py-4 text-base shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-xl group`}
                      asChild
                    >
                      <Link to="/templates">
                        <Package className="w-5 h-5 mr-2" />
                        Khám phá Templates
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-2 border-pink-200 text-pink-700 hover:bg-pink-50 font-bold px-8 py-4 text-base rounded-xl backdrop-blur-sm shadow-sm hover:shadow-lg transition-all"
                      asChild
                    >
                      <Link to="/ebooks">
                        <BookOpen className="w-5 h-5 mr-2" />
                        Thư viện E-books
                      </Link>
                    </Button>
                  </motion.div>
                </motion.div>

                {/* ✅ Tính năng nổi bật chuyên nghiệp */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1 }}
                  className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-8 border-t border-pink-100"
                >
                  {[
                    {
                      icon: Code,
                      title: "Code Chất Lượng",
                      description: "React 18, TypeScript, Clean Architecture",
                      color: "from-blue-400 to-cyan-500",
                    },
                    {
                      icon: Palette,
                      title: "Design Hiện Đại",
                      description: "UI/UX 2025, Mobile-first, Accessible",
                      color: "from-pink-400 to-rose-500",
                    },
                    {
                      icon: Zap,
                      title: "Performance Cao",
                      description: "Lighthouse 95+, Core Web Vitals",
                      color: "from-yellow-400 to-orange-500",
                    },
                    {
                      icon: Shield,
                      title: "Hỗ Trợ 24/7",
                      description: "Support chuyên nghiệp, cập nhật liên tục",
                      color: "from-green-400 to-emerald-500",
                    },
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="text-center group cursor-pointer"
                    >
                      <div
                        className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}
                      >
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-slate-800">
                          {feature.title}
                        </div>
                        <div className="text-xs text-slate-600 leading-tight">
                          {feature.description}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              {/* ✅ Right Column - Product showcase chuyên nghiệp */}
              <motion.div
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="relative lg:justify-self-end"
              >
                <div className="relative max-w-md">
                  {/* ✅ Template Card chuyên nghiệp */}
                  <motion.div
                    whileHover={{ scale: 1.02, rotate: 1 }}
                    className="relative"
                  >
                    <Card
                      className={`relative overflow-hidden border-0 shadow-3xl bg-gradient-to-br ${unifiedColorScheme.cardBg} backdrop-blur-lg rounded-3xl`}
                    >
                      <CardContent className="p-6">
                        {/* ✅ Header chuyên nghiệp */}
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${unifiedColorScheme.button} flex items-center justify-center shadow-xl`}
                            >
                              <Crown className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-slate-800">
                                SaaS Dashboard Pro
                              </h3>
                              <p className="text-sm text-slate-600">
                                Template Enterprise
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5">
                                  React 18
                                </Badge>
                                <Badge className="bg-green-50 text-green-600 text-xs px-2 py-0.5">
                                  TypeScript
                                </Badge>
                                <Badge className="bg-purple-50 text-purple-600 text-xs px-2 py-0.5">
                                  Next.js 14
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <Badge className="bg-gradient-to-r from-red-400 to-pink-500 text-white px-3 py-1 text-xs font-bold shadow-lg">
                            Bestseller 🔥
                          </Badge>
                        </div>

                        {/* ✅ Metrics chuyên nghiệp */}
                        <div className="space-y-3 mb-6">
                          <div className="flex justify-between text-sm text-slate-700 mb-2">
                            <span className="font-medium">
                              Tính năng hoàn thiện
                            </span>
                            <span className="font-bold">95% Complete</span>
                          </div>
                          {[
                            {
                              label: "Components",
                              progress: 95,
                              color: "from-blue-400 to-blue-600",
                            },
                            {
                              label: "Pages",
                              progress: 88,
                              color: "from-green-400 to-green-600",
                            },
                            {
                              label: "Documentation",
                              progress: 92,
                              color: "from-purple-400 to-purple-600",
                            },
                            {
                              label: "Testing",
                              progress: 90,
                              color: "from-pink-400 to-pink-600",
                            },
                          ].map((item, index) => (
                            <div key={index} className="relative">
                              <div className="flex justify-between text-xs text-slate-600 mb-1">
                                <span>{item.label}</span>
                                <span className="font-medium">
                                  {item.progress}%
                                </span>
                              </div>
                              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div
                                  className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${item.progress}%` }}
                                  transition={{
                                    duration: 2,
                                    delay: 1.2 + index * 0.2,
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* ✅ Footer chuyên nghiệp */}
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className="w-4 h-4 fill-yellow-400 text-yellow-400"
                                />
                              ))}
                              <span className="text-sm text-slate-600 ml-2 font-medium">
                                4.9 (2,156 đánh giá)
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-slate-500">
                              <span className="flex items-center gap-1">
                                <Download className="w-3 h-3" />
                                15.2K+ downloads
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Cập nhật hôm qua
                              </span>
                            </div>
                          </div>
                          <div className="text-right space-y-1">
                            <div
                              className={`text-2xl font-bold bg-gradient-to-r ${unifiedColorScheme.textSecondary} bg-clip-text text-transparent`}
                            >
                              1,290,000₫
                            </div>
                            <div className="text-sm text-slate-500 line-through">
                              1,990,000₫
                            </div>
                            <div className="text-xs text-green-600 font-semibold">
                              Tiết kiệm 35%
                            </div>
                          </div>
                        </div>
                      </CardContent>

                      {/* ✅ Floating actions chuyên nghiệp */}
                      <motion.div
                        className="absolute bottom-4 left-4 w-12 h-12 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full flex items-center justify-center shadow-2xl cursor-pointer"
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Heart className="w-6 h-6 text-white" />
                      </motion.div>
                    </Card>
                  </motion.div>

                  {/* ✅ Floating decorations chuyên nghiệp */}
                  <motion.div
                    className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center shadow-2xl"
                    animate={{
                      rotate: 360,
                      scale: [1, 1.2, 1],
                      y: [0, -10, 0],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Sparkles className="w-6 h-6 text-white" />
                  </motion.div>

                  <motion.div
                    className="absolute -bottom-6 -left-6 w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl"
                    animate={{
                      y: [0, -20, 0],
                      rotate: [0, 180, 360],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 6, repeat: Infinity }}
                  >
                    <TrendingUp className="w-5 h-5 text-white" />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ===== PHẦN THỐNG KÊ CHUYÊN NGHIỆP ===== */}
        <section
          className={`relative px-4 py-16 sm:py-20 lg:py-24 bg-gradient-to-br ${sectionBackgrounds.stats}`}
          id="stats"
          data-animate
          style={{
            backgroundImage: `radial-gradient(circle at 20% 80%, rgba(236, 72, 153, 0.04) 0%, transparent 50%),
                     radial-gradient(circle at 80% 20%, rgba(244, 63, 94, 0.04) 0%, transparent 50%),
                     radial-gradient(circle at 40% 40%, rgba(220, 38, 127, 0.03) 0%, transparent 50%)`,
          }}
        >
          <div className="container relative z-10 mx-auto">
            {/* ✅ Header chuyên nghiệp */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible.stats ? { opacity: 1, y: 0 } : {}}
              className="text-center mb-16"
            >
              <Badge
                className={`mb-6 bg-gradient-to-r ${unifiedColorScheme.button} text-white px-6 py-2.5 text-sm font-semibold shadow-xl inline-flex items-center gap-2`}
              >
                <TrendingUp className="w-4 h-4" />
                Được tin tưởng bởi hàng nghìn doanh nghiệp
                <div className="w-2 h-2 bg-white/80 rounded-full animate-pulse" />
              </Badge>

              <h2
                className={`text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r ${unifiedColorScheme.textMain} bg-clip-text text-transparent mb-6`}
              >
                Thúc đẩy chuyển đổi số Việt Nam
              </h2>

              <p className="text-lg sm:text-xl text-slate-700 max-w-4xl mx-auto leading-relaxed font-medium">
                Tham gia cùng hàng nghìn nhà phát triển, thiết kế và doanh
                nghiệp thành công đã{" "}
                <span className="font-bold text-pink-600">tăng tốc dự án</span>{" "}
                và{" "}
                <span className="font-bold text-blue-600">
                  tiết kiệm đến 70% thời gian phát triển
                </span>
              </p>

              {/* ✅ Trust indicators chuyên nghiệp */}
              <div className="flex flex-wrap justify-center items-center gap-8 mt-8 text-sm text-slate-600">
                <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm">
                  <Award className="w-4 h-4 text-yellow-500" />
                  <span>Top 3 Marketplace Việt Nam</span>
                </div>
                <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>ISO 27001 Certified</span>
                </div>
                <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm">
                  <Globe className="w-4 h-4 text-blue-500" />
                  <span>Phục vụ 45+ quốc gia</span>
                </div>
              </div>
            </motion.div>

            {/* ✅ Stats grid chuyên nghiệp */}
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  number: "50,000+",
                  label: "Developers tin tưởng",
                  description: "Từ startup đến tập đoàn lớn",
                  icon: Users,
                  color: "from-blue-400 to-cyan-500",
                  textColor: "text-blue-600",
                  growth: "+127% năm 2024",
                  bgColor: "from-blue-50/90 via-cyan-50/70 to-blue-100/80",
                },
                {
                  number: "2,500+",
                  label: "Templates chất lượng",
                  description: "React, Vue, Next.js, Angular",
                  icon: Package,
                  color: "from-pink-400 to-rose-500",
                  textColor: "text-pink-600",
                  growth: "+45% mỗi tháng",
                  bgColor: "from-pink-50/90 via-rose-50/70 to-pink-100/80",
                },
                {
                  number: "1,200+",
                  label: "E-books kỹ thuật",
                  description: "Kiến thức từ chuyên gia hàng đầu",
                  icon: BookOpen,
                  color: "from-orange-400 to-yellow-500",
                  textColor: "text-orange-600",
                  growth: "+38% từ tháng trước",
                  bgColor:
                    "from-orange-50/90 via-yellow-50/70 to-orange-100/80",
                },
                {
                  number: "99.9%",
                  label: "Uptime đảm bảo",
                  description: "Infrastructure enterprise-grade",
                  icon: Shield,
                  color: "from-green-400 to-emerald-500",
                  textColor: "text-green-600",
                  growth: "SLA cam kết",
                  bgColor: "from-green-50/90 via-emerald-50/70 to-green-100/80",
                },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 60 }}
                  animate={isVisible.stats ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.15 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="group"
                >
                  <Card
                    className={`border-0 shadow-xl hover:shadow-3xl bg-gradient-to-br ${stat.bgColor} backdrop-blur-lg rounded-3xl transition-all duration-500 overflow-hidden relative`}
                  >
                    {/* ✅ Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <CardContent className="p-6 text-center relative z-10">
                      {/* ✅ Icon chuyên nghiệp */}
                      <motion.div
                        className={`w-16 h-16 mx-auto mb-4 rounded-3xl bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-300 relative overflow-hidden`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 1 }}
                      >
                        <stat.icon className="w-8 h-8 text-white drop-shadow-md" />

                        {/* ✅ Pulsing ring */}
                        <motion.div
                          className="absolute inset-2 bg-white/20 rounded-2xl"
                          animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.3, 0.6, 0.3],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: index * 0.3,
                          }}
                        />
                      </motion.div>

                      {/* ✅ Số liệu chuyên nghiệp */}
                      <motion.div
                        className={`text-3xl lg:text-4xl font-bold ${stat.textColor} mb-2`}
                        animate={{
                          scale: [1, 1.05, 1],
                          color: [
                            "rgb(31 41 55)",
                            "rgb(219 39 119)",
                            "rgb(31 41 55)",
                          ],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          delay: index * 0.8,
                        }}
                      >
                        {stat.number}
                      </motion.div>

                      <div className="text-lg font-bold text-slate-800 mb-2">
                        {stat.label}
                      </div>

                      <div className="text-sm text-slate-600 mb-4 leading-tight">
                        {stat.description}
                      </div>

                      {/* ✅ Growth indicator chuyên nghiệp */}
                      <Badge
                        variant="outline"
                        className={`border-${stat.textColor.split("-")[1]}-200 ${stat.textColor} bg-${stat.textColor.split("-")[1]}-50 text-xs font-medium px-3 py-1`}
                      >
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {stat.growth}
                      </Badge>

                      {/* ✅ Sparkle effect khi hover */}
                      <motion.div
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
                        animate={{
                          rotate: [0, 360],
                          scale: [0.8, 1.2, 0.8],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Sparkles className="w-4 h-4 text-pink-400" />
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* ✅ Additional metrics chuyên nghiệp */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible.stats ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-16 text-center"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                {[
                  {
                    metric: "15.2K+",
                    label: "Downloads hàng tháng",
                    icon: Download,
                  },
                  { metric: "4.9★", label: "Đánh giá trung bình", icon: Star },
                  { metric: "45+", label: "Quốc gia sử dụng", icon: Globe },
                  {
                    metric: "24/7",
                    label: "Hỗ trợ khách hàng",
                    icon: Headphones,
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    className="flex flex-col items-center gap-2 bg-white/40 backdrop-blur-sm rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
                  >
                    <item.icon className="w-5 h-5 text-pink-500 mb-1" />
                    <div className="text-2xl font-bold text-slate-800">
                      {item.metric}
                    </div>
                    <div className="text-sm text-slate-600 text-center leading-tight">
                      {item.label}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* ✅ Call-to-action chuyên nghiệp */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isVisible.stats ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="mt-12"
              >
                <p className="text-slate-600 mb-6 text-lg">
                  Sẵn sàng tham gia cộng đồng hàng nghìn developers Việt Nam?
                </p>
                <Button
                  size="lg"
                  className={`bg-gradient-to-r ${unifiedColorScheme.button} hover:${unifiedColorScheme.buttonHover} text-white font-bold px-8 py-3 rounded-xl shadow-xl hover:shadow-2xl transition-all group`}
                >
                  <Rocket className="w-5 h-5 mr-2" />
                  Bắt đầu ngay hôm nay
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ===== PHẦN DANH MỤC TEMPLATES ===== */}
        <section
          className={`relative px-4 py-16 sm:py-20 lg:py-24 bg-gradient-to-br ${sectionBackgrounds.categories}`}
          id="categories"
          data-animate
          style={{
            backgroundImage: `radial-gradient(circle at 20% 80%, rgba(244, 63, 94, 0.04) 0%, transparent 50%),
                     radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.04) 0%, transparent 50%),
                     radial-gradient(circle at 40% 40%, rgba(220, 38, 127, 0.03) 0%, transparent 50%)`,
          }}
        >
          <div className="container relative z-10 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible.categories ? { opacity: 1, y: 0 } : {}}
              className="text-center mb-16"
            >
              <Badge
                className={`mb-6 bg-gradient-to-r ${unifiedColorScheme.button} text-white px-6 py-2.5 text-sm font-semibold shadow-xl inline-flex items-center gap-2`}
              >
                <Package className="w-4 h-4" />
                2,500+ Templates cao cấp
                <div className="w-2 h-2 bg-white/80 rounded-full animate-pulse" />
              </Badge>
              <h2
                className={`text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r ${unifiedColorScheme.textMain} bg-clip-text text-transparent mb-6`}
              >
                Chọn công nghệ phù hợp với dự án
              </h2>
              <p className="text-lg sm:text-xl text-slate-700 max-w-4xl mx-auto leading-relaxed font-medium">
                Từ React và Vue.js hiện đại đến ứng dụng mobile và dashboard
                doanh nghiệp,{" "}
                <span className="font-bold text-pink-600">
                  chúng tôi có mọi thứ bạn cần
                </span>
              </p>
            </motion.div>

            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {[
                {
                  title: "React Templates",
                  description:
                    "Components hiện đại với React 18, hooks và TypeScript. Tối ưu performance và SEO.",
                  icon: Code,
                  count: "850+",
                  trend: "+15% tháng này",
                  gradient: "from-blue-400 to-cyan-500",
                  bgGradient: "from-blue-50/90 via-cyan-50/70 to-blue-100/80",
                  tags: ["React 18", "TypeScript", "Next.js 14"],
                  route: "/templates?tech=react",
                  popular: true,
                },
                {
                  title: "Vue.js Templates",
                  description:
                    "Vue 3 Composition API với Pinia state management. Developer experience tuyệt vời.",
                  icon: Palette,
                  count: "620+",
                  trend: "+22% tháng này",
                  gradient: "from-green-400 to-emerald-500",
                  bgGradient:
                    "from-green-50/90 via-emerald-50/70 to-green-100/80",
                  tags: ["Vue 3", "Pinia", "Vite"],
                  route: "/templates?tech=vue",
                },
                {
                  title: "Dashboard Admin",
                  description:
                    "Quản lý doanh nghiệp với charts, analytics và user management đầy đủ.",
                  icon: BarChart3,
                  count: "340+",
                  trend: "+18% tháng này",
                  gradient: "from-purple-400 to-pink-500",
                  bgGradient:
                    "from-purple-50/90 via-pink-50/70 to-purple-100/80",
                  tags: ["Charts", "Analytics", "CRM"],
                  route: "/templates?category=dashboard",
                },
                {
                  title: "E-commerce",
                  description:
                    "Online stores với payment gateway, inventory và order management hoàn chỉnh.",
                  icon: ShoppingCart,
                  count: "280+",
                  trend: "+31% tháng này",
                  gradient: "from-orange-400 to-red-500",
                  bgGradient:
                    "from-orange-50/90 via-red-50/70 to-orange-100/80",
                  tags: ["Stripe", "PayPal", "Inventory"],
                  route: "/templates?category=ecommerce",
                },
                {
                  title: "Landing Pages",
                  description:
                    "Marketing pages với conversion optimization và A/B testing tích hợp.",
                  icon: Rocket,
                  count: "490+",
                  trend: "+12% tháng này",
                  gradient: "from-yellow-400 to-orange-500",
                  bgGradient:
                    "from-yellow-50/90 via-orange-50/70 to-yellow-100/80",
                  tags: ["SEO Ready", "A/B Test", "Analytics"],
                  route: "/templates?category=landing",
                },
                {
                  title: "Mobile Apps",
                  description:
                    "React Native và Flutter apps với native performance và UI components.",
                  icon: Smartphone,
                  count: "190+",
                  trend: "+28% tháng này",
                  gradient: "from-pink-400 to-rose-500",
                  bgGradient: "from-pink-50/90 via-rose-50/70 to-pink-100/80",
                  tags: ["React Native", "Flutter", "Expo"],
                  route: "/templates?category=mobile",
                },
              ].map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 60 }}
                  animate={isVisible.categories ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  whileHover={{ scale: 1.03, y: -8 }}
                  className="group h-full"
                >
                  <Card
                    className={`relative overflow-hidden border-0 shadow-xl hover:shadow-3xl bg-gradient-to-br ${category.bgGradient} backdrop-blur-lg rounded-3xl transition-all duration-500 h-full flex flex-col`}
                  >
                    {category.popular && (
                      <div className="absolute top-4 right-4 z-10">
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold shadow-xl text-xs">
                          <Crown className="w-3 h-3 mr-1" />
                          Phổ biến nhất
                        </Badge>
                      </div>
                    )}

                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <CardContent className="p-6 lg:p-8 flex flex-col h-full relative z-10">
                      <div className="flex items-start justify-between mb-6">
                        <motion.div
                          className={`w-14 h-14 rounded-3xl bg-gradient-to-br ${category.gradient} flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-300 relative overflow-hidden`}
                          whileHover={{ rotate: 12 }}
                        >
                          <category.icon className="w-7 h-7 text-white drop-shadow-md" />
                          <motion.div
                            className="absolute inset-2 bg-white/20 rounded-2xl"
                            animate={{
                              scale: [1, 1.1, 1],
                              opacity: [0.3, 0.6, 0.3],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: index * 0.3,
                            }}
                          />
                        </motion.div>

                        <div className="text-right">
                          <Badge
                            className={`bg-gradient-to-r ${unifiedColorScheme.button} text-white font-bold px-3 py-1 rounded-full shadow-lg text-sm`}
                          >
                            {category.count}
                          </Badge>
                          <div className="text-sm text-pink-600 font-semibold mt-1 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            {category.trend}
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 flex flex-col">
                        <h3 className="text-xl lg:text-2xl font-bold text-slate-900 mb-3 group-hover:text-pink-700 transition-colors">
                          {category.title}
                        </h3>

                        <p className="text-slate-700 mb-4 flex-1 leading-relaxed">
                          {category.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-6">
                          {category.tags.map((tag, tagIndex) => (
                            <Badge
                              key={tagIndex}
                              variant="outline"
                              className="border-pink-200 text-pink-700 bg-pink-50/80 text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <Button
                          className={`bg-gradient-to-r ${unifiedColorScheme.button} hover:${unifiedColorScheme.buttonHover} text-white font-bold py-3 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl group/button`}
                          asChild
                        >
                          <Link to={category.route}>
                            Khám phá {category.title.split(" ")[0]}
                            <ArrowRight className="w-4 h-4 ml-2 group-hover/button:translate-x-1 transition-transform" />
                          </Link>
                        </Button>
                      </div>

                      {/* Sparkle effect */}
                      <motion.div
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
                        animate={{
                          rotate: [0, 360],
                          scale: [0.8, 1.2, 0.8],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Sparkles className="w-4 h-4 text-pink-400" />
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== TÍNH NĂNG NỔI BẬT ===== */}
        <section
          className={`relative px-4 py-16 sm:py-20 lg:py-24 bg-gradient-to-br ${sectionBackgrounds.features}`}
          id="features"
          data-animate
          style={{
            backgroundImage: `radial-gradient(circle at 20% 80%, rgba(220, 38, 127, 0.04) 0%, transparent 50%),
                     radial-gradient(circle at 80% 20%, rgba(244, 63, 94, 0.04) 0%, transparent 50%),
                     radial-gradient(circle at 40% 40%, rgba(236, 72, 153, 0.03) 0%, transparent 50%)`,
          }}
        >
          <div className="container relative z-10 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible.features ? { opacity: 1, y: 0 } : {}}
              className="text-center mb-16"
            >
              <Badge
                className={`mb-6 bg-gradient-to-r ${unifiedColorScheme.button} text-white px-6 py-2.5 text-sm font-semibold shadow-xl inline-flex items-center gap-2`}
              >
                <Award className="w-4 h-4" />
                Tại sao chọn Template Market?
                <div className="w-2 h-2 bg-white/80 rounded-full animate-pulse" />
              </Badge>
              <h2
                className={`text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r ${unifiedColorScheme.textMain} bg-clip-text text-transparent mb-6`}
              >
                Chất lượng cấp doanh nghiệp
              </h2>
              <p className="text-lg sm:text-xl text-slate-700 max-w-4xl mx-auto leading-relaxed font-medium">
                Mọi template đều được xây dựng với{" "}
                <span className="font-bold text-pink-600">
                  code production-ready
                </span>{" "}
                và{" "}
                <span className="font-bold text-blue-600">
                  bảo mật chuẩn enterprise
                </span>
              </p>
            </motion.div>

            <div className="grid gap-10 lg:grid-cols-2 items-center">
              {/* Features Slider */}
              <div className="relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.8 }}
                  >
                    <Card
                      className={`border-0 shadow-2xl bg-gradient-to-br ${
                        [
                          "from-blue-50/90 via-cyan-50/70 to-blue-100/80",
                          "from-pink-50/90 via-rose-50/70 to-pink-100/80",
                          "from-green-50/90 via-emerald-50/70 to-green-100/80",
                          "from-yellow-50/90 via-orange-50/70 to-yellow-100/80",
                        ][currentSlide]
                      } backdrop-blur-lg rounded-3xl overflow-hidden`}
                    >
                      <CardContent className="p-8">
                        <div className="flex items-start space-x-4 mb-6">
                          <div
                            className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${
                              [
                                "from-blue-400 to-cyan-500",
                                "from-pink-400 to-rose-500",
                                "from-green-400 to-emerald-500",
                                "from-yellow-400 to-orange-500",
                              ][currentSlide]
                            } flex items-center justify-center shadow-xl flex-shrink-0 relative overflow-hidden`}
                          >
                            {React.createElement(
                              [Code, Shield, Zap, Users][currentSlide],
                              {
                                className: "w-7 h-7 text-white drop-shadow-md",
                              },
                            )}
                            <motion.div
                              className="absolute inset-2 bg-white/20 rounded-lg"
                              animate={{
                                scale: [1, 1.1, 1],
                                opacity: [0.3, 0.6, 0.3],
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">
                              {
                                [
                                  "Code Chất Lượng Cao",
                                  "Bảo Mật Enterprise",
                                  "Performance Tối Ưu",
                                  "Hỗ Trợ 24/7",
                                ][currentSlide]
                              }
                            </h3>
                            <p className="text-slate-700 leading-relaxed">
                              {
                                [
                                  "Clean code với TypeScript, testing coverage 95%+, và documentation chi tiết cho mọi component.",
                                  "Tuân thủ OWASP, mã hóa end-to-end, và được audit bởi các chuyên gia bảo mật hàng đầu.",
                                  "Lighthouse score 95+, lazy loading, code splitting và CDN optimization tích hợp sẵn.",
                                  "Team support 24/7 với developers chuyên nghiệp, response time trung bình 2 giờ.",
                                ][currentSlide]
                              }
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          {[
                            [
                              "TypeScript support đầy đủ với strict mode",
                              "Jest + Testing Library coverage 95%+",
                              "ESLint + Prettier configuration chuẩn",
                              "Storybook documentation cho components",
                              "Automated CI/CD pipeline với GitHub Actions",
                            ],
                            [
                              "OWASP Top 10 compliance đầy đủ",
                              "Content Security Policy (CSP) headers",
                              "SQL injection và XSS protection",
                              "Authentication với JWT và refresh tokens",
                              "Regular security audits và penetration testing",
                            ],
                            [
                              "Lighthouse Performance score 95+",
                              "Core Web Vitals optimization",
                              "Automatic image optimization và lazy loading",
                              "Code splitting và tree shaking",
                              "CDN integration với edge caching",
                            ],
                            [
                              "24/7 technical support qua Slack/Discord",
                              "Video call support cho critical issues",
                              "Regular updates và security patches",
                              "Community access với 50K+ developers",
                              "Priority queue cho Enterprise customers",
                            ],
                          ][currentSlide].map((detail, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.2 + index * 0.1 }}
                              className="flex items-center space-x-3"
                            >
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                              <span className="text-slate-700 font-medium text-sm">
                                {detail}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </AnimatePresence>

                <div className="flex justify-center space-x-2 mt-6">
                  {[...Array(4)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentSlide
                          ? `bg-gradient-to-r ${unifiedColorScheme.button} scale-125`
                          : "bg-pink-200 hover:bg-pink-300"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Features Visual */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={isVisible.features ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 1 }}
                className="relative"
              >
                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      icon: Code,
                      title: "Code Chất Lượng",
                      color: "from-blue-400 to-cyan-500",
                      bgColor: "from-blue-50/80 to-cyan-50/80",
                    },
                    {
                      icon: Shield,
                      title: "Bảo Mật Enterprise",
                      color: "from-pink-400 to-rose-500",
                      bgColor: "from-pink-50/80 to-rose-50/80",
                    },
                    {
                      icon: Zap,
                      title: "Performance Tối Ưu",
                      color: "from-green-400 to-emerald-500",
                      bgColor: "from-green-50/80 to-emerald-50/80",
                    },
                    {
                      icon: Users,
                      title: "Hỗ Trợ 24/7",
                      color: "from-yellow-400 to-orange-500",
                      bgColor: "from-yellow-50/80 to-orange-50/80",
                    },
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="group cursor-pointer"
                      onClick={() => setCurrentSlide(index)}
                    >
                      <Card
                        className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden bg-gradient-to-br ${feature.bgColor} ${
                          index === currentSlide
                            ? "ring-2 ring-pink-400 scale-105"
                            : ""
                        }`}
                      >
                        <CardContent className="p-4 text-center">
                          <div
                            className={`w-10 h-10 mx-auto mb-3 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center shadow-lg relative overflow-hidden`}
                          >
                            <feature.icon className="w-5 h-5 text-white drop-shadow-md" />
                            <motion.div
                              className="absolute inset-2 bg-white/20 rounded-lg"
                              animate={{
                                scale: [1, 1.1, 1],
                                opacity: [0.3, 0.6, 0.3],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: index * 0.3,
                              }}
                            />
                          </div>
                          <h4 className="font-bold text-slate-800 text-sm mb-1">
                            {feature.title}
                          </h4>
                          <p className="text-xs text-slate-600 leading-tight">
                            {
                              [
                                "Clean, maintainable",
                                "Security-first",
                                "Lightning fast",
                                "Always available",
                              ][index]
                            }
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ===== QUY TRÌNH TRIỂN KHAI ===== */}
        <section
          className={`relative px-4 py-16 sm:py-20 lg:py-24 bg-gradient-to-br ${sectionBackgrounds.process}`}
          id="process"
          data-animate
          style={{
            backgroundImage: `radial-gradient(circle at 20% 80%, rgba(236, 72, 153, 0.06) 0%, transparent 50%),
                     radial-gradient(circle at 80% 20%, rgba(244, 63, 94, 0.06) 0%, transparent 50%),
                     radial-gradient(circle at 40% 40%, rgba(220, 38, 127, 0.04) 0%, transparent 50%)`,
          }}
        >
          <div className="container relative z-10 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible.process ? { opacity: 1, y: 0 } : {}}
              className="text-center mb-16"
            >
              <Badge
                className={`mb-6 bg-gradient-to-r ${unifiedColorScheme.button} text-white px-6 py-2.5 text-sm font-semibold shadow-xl inline-flex items-center gap-2`}
              >
                <Compass className="w-4 h-4" />
                Quy trình đơn giản 4 bước
                <div className="w-2 h-2 bg-white/80 rounded-full animate-pulse" />
              </Badge>
              <h2
                className={`text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r ${unifiedColorScheme.textMain} bg-clip-text text-transparent mb-6`}
              >
                Từ ý tưởng đến ra mắt chỉ trong vài phút
              </h2>
              <p className="text-lg sm:text-xl text-slate-700 max-w-4xl mx-auto leading-relaxed font-medium">
                Quy trình tối ưu hóa giúp bạn{" "}
                <span className="font-bold text-pink-600">
                  từ concept đến production-ready app
                </span>{" "}
                một cách nhanh chóng và hiệu quả
              </p>
            </motion.div>

            <div className="grid gap-8 lg:gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  step: "01",
                  title: "Chọn Template",
                  description:
                    "Duyệt qua 2,500+ templates với bộ lọc thông minh. Preview trực tiếp và so sánh tính năng.",
                  icon: Search,
                  color: "from-blue-400 to-cyan-500",
                  bgColor: "from-blue-50/90 via-cyan-50/70 to-blue-100/80",
                  details: [
                    "Live preview",
                    "Feature comparison",
                    "Tech stack info",
                    "Responsive design",
                  ],
                },
                {
                  step: "02",
                  title: "Tùy Chỉnh & Tải Xuống",
                  description:
                    "Personalize colors, fonts, content. Download full source code với documentation chi tiết.",
                  icon: Download,
                  color: "from-pink-400 to-rose-500",
                  bgColor: "from-pink-50/90 via-rose-50/70 to-pink-100/80",
                  details: [
                    "Color customization",
                    "Font selection",
                    "Content editing",
                    "Source code + docs",
                  ],
                },
                {
                  step: "03",
                  title: "Deploy & Launch",
                  description:
                    "One-click deploy lên Vercel, Netlify, hay AWS. Automatic CI/CD setup và domain configuration.",
                  icon: Rocket,
                  color: "from-green-400 to-emerald-500",
                  bgColor: "from-green-50/90 via-emerald-50/70 to-green-100/80",
                  details: [
                    "One-click deploy",
                    "CI/CD setup",
                    "Custom domain",
                    "SSL certificate",
                  ],
                },
                {
                  step: "04",
                  title: "Hỗ Trợ & Cập Nhật",
                  description:
                    "24/7 technical support, regular updates, và access vào community với 50K+ developers.",
                  icon: Users,
                  color: "from-yellow-400 to-orange-500",
                  bgColor:
                    "from-yellow-50/90 via-orange-50/70 to-yellow-100/80",
                  details: [
                    "24/7 support",
                    "Regular updates",
                    "Community access",
                    "Priority fixes",
                  ],
                },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 60 }}
                  animate={isVisible.process ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="relative group"
                >
                  <Card
                    className={`border-0 shadow-xl hover:shadow-2xl bg-gradient-to-br ${step.bgColor} backdrop-blur-lg rounded-3xl transition-all duration-500 overflow-hidden relative`}
                  >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <CardContent className="p-6 text-center relative z-10">
                      <div
                        className={`absolute -top-4 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center shadow-2xl z-10`}
                      >
                        <span className="text-white font-bold text-sm">
                          {step.step}
                        </span>
                      </div>

                      <motion.div
                        className={`w-14 h-14 mx-auto mt-8 mb-4 rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300 relative overflow-hidden`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 1 }}
                      >
                        <step.icon className="w-7 h-7 text-white drop-shadow-md" />
                        <motion.div
                          className="absolute inset-2 bg-white/20 rounded-lg"
                          animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.3, 0.6, 0.3],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: index * 0.3,
                          }}
                        />
                      </motion.div>

                      <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-pink-700 transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-slate-700 leading-relaxed text-sm mb-4">
                        {step.description}
                      </p>

                      {/* Details list */}
                      <div className="space-y-2">
                        {step.details.map((detail, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-center gap-2 text-xs text-slate-600"
                          >
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            <span>{detail}</span>
                          </div>
                        ))}
                      </div>

                      {/* Sparkle effect */}
                      <motion.div
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
                        animate={{
                          rotate: [0, 360],
                          scale: [0.8, 1.2, 0.8],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Sparkles className="w-4 h-4 text-pink-400" />
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible.process ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.5 }}
              className="text-center mt-16"
            >
              <p className="text-slate-600 mb-6 text-lg">
                Sẵn sàng bắt đầu dự án tiếp theo?
              </p>
              <Button
                size="lg"
                className={`bg-gradient-to-r ${unifiedColorScheme.button} hover:${unifiedColorScheme.buttonHover} text-white font-bold px-10 py-4 text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-xl group`}
                asChild
              >
                <Link to="/templates">
                  Bắt đầu xây dựng ngay
                  <Rocket className="w-5 h-5 ml-2 group-hover:translate-y-[-2px] transition-transform" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* ===== TESTIMONIALS - KHÁCH HÀNG YÊU THÍCH ===== */}
        <section
          className={`relative px-4 py-16 sm:py-20 lg:py-24 bg-gradient-to-br ${sectionBackgrounds.testimonials}`}
          id="testimonials"
          data-animate
          style={{
            backgroundImage: `radial-gradient(circle at 20% 80%, rgba(220, 38, 127, 0.06) 0%, transparent 50%),
                     radial-gradient(circle at 80% 20%, rgba(244, 63, 94, 0.06) 0%, transparent 50%),
                     radial-gradient(circle at 40% 40%, rgba(236, 72, 153, 0.04) 0%, transparent 50%)`,
          }}
        >
          <div className="container relative z-10 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible.testimonials ? { opacity: 1, y: 0 } : {}}
              className="text-center mb-16"
            >
              <Badge
                className={`mb-6 bg-gradient-to-r ${unifiedColorScheme.button} text-white px-6 py-2.5 text-sm font-semibold shadow-xl inline-flex items-center gap-2`}
              >
                <Quote className="w-4 h-4" />
                Câu chuyện thành công của khách hàng
                <div className="w-2 h-2 bg-white/80 rounded-full animate-pulse" />
              </Badge>
              <h2
                className={`text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r ${unifiedColorScheme.textMain} bg-clip-text text-transparent mb-6`}
              >
                Được yêu thích bởi developers toàn cầu
              </h2>
              <p className="text-lg sm:text-xl text-slate-700 max-w-4xl mx-auto leading-relaxed font-medium">
                Câu chuyện thực từ những developers thực sự đã{" "}
                <span className="font-bold text-pink-600">
                  tăng tốc sự nghiệp
                </span>{" "}
                và{" "}
                <span className="font-bold text-blue-600">
                  xây dựng startup thành công
                </span>{" "}
                với templates của chúng tôi
              </p>
            </motion.div>

            <div className="max-w-6xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.8 }}
                >
                  <Card
                    className={`border-0 shadow-3xl bg-gradient-to-br ${unifiedColorScheme.cardBg} backdrop-blur-lg rounded-3xl overflow-hidden`}
                  >
                    <CardContent className="p-8 lg:p-12">
                      <div className="grid lg:grid-cols-3 gap-8 items-center">
                        <div className="text-center lg:text-left space-y-4">
                          <div className="relative mx-auto lg:mx-0 w-fit">
                            <div className="w-24 h-24 bg-gradient-to-br from-pink-200 to-rose-300 rounded-full flex items-center justify-center shadow-2xl">
                              <User className="w-12 h-12 text-pink-600" />
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-xl">
                              <CheckCircle className="w-5 h-5 text-white" />
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                              <h3 className="text-lg font-bold text-slate-900">
                                {
                                  [
                                    "Nguyễn Minh Tuấn",
                                    "Trần Thị Hương",
                                    "Lê Văn Đức",
                                    "Phạm Ngọc Mai",
                                  ][currentTestimonial]
                                }
                              </h3>
                              <span className="text-xl">🇻🇳</span>
                            </div>
                            <p className="text-pink-600 font-semibold">
                              {
                                [
                                  "Fullstack Developer",
                                  "Tech Lead",
                                  "Startup Founder",
                                  "UI/UX Designer",
                                ][currentTestimonial]
                              }
                            </p>
                            <p className="text-slate-600 text-sm">
                              {
                                [
                                  "Vietcombank Technology",
                                  "FPT Software",
                                  "TechStars Vietnam",
                                  "Tiki Corporation",
                                ][currentTestimonial]
                              }
                            </p>
                          </div>
                        </div>

                        <div className="lg:col-span-2 space-y-6">
                          <div className="flex items-center justify-center lg:justify-start gap-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className="w-5 h-5 fill-yellow-400 text-yellow-400"
                              />
                            ))}
                            <span className="text-slate-600 ml-2 font-medium text-sm">
                              {
                                [
                                  "3 tuần trước",
                                  "1 tháng trước",
                                  "2 tuần trước",
                                  "5 ngày trước",
                                ][currentTestimonial]
                              }
                            </span>
                          </div>

                          <blockquote className="text-lg lg:text-xl text-slate-800 leading-relaxed font-medium italic text-center lg:text-left">
                            "
                            {
                              [
                                "Template Market đã giúp tôi tiết kiệm 3 tháng development time. Dashboard template rất chuyên nghiệp, code clean và documentation chi tiết. Dự án banking của chúng tôi launch đúng deadline nhờ có template này.",
                                "Là Tech Lead với 8 năm kinh nghiệm, tôi rất khó tính về code quality. Nhưng templates ở đây thực sự impressive - TypeScript coverage 100%, testing đầy đủ, và performance optimization tuyệt vời.",
                                "Startup của tôi từ 0 đến 50K users trong 6 tháng nhờ e-commerce template. ROI tăng 400% so với việc thuê team outsource. Template Market là game changer cho startup Việt Nam.",
                                "UI/UX ở Template Market luôn trendy và user-friendly. Components được design chuẩn principles, responsive hoàn hảo. Team design của chúng tôi save được 70% thời gian mockup.",
                              ][currentTestimonial]
                            }
                            "
                          </blockquote>

                          <div className="grid sm:grid-cols-2 gap-4">
                            <div
                              className={`p-4 rounded-2xl bg-gradient-to-r ${unifiedColorScheme.iconBg} border border-pink-200/50`}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <Briefcase className="w-4 h-4 text-pink-600" />
                                <span className="text-sm font-semibold text-pink-700">
                                  Dự án
                                </span>
                              </div>
                              <p className="text-slate-700 font-medium text-sm">
                                {
                                  [
                                    "Banking Dashboard",
                                    "Enterprise CRM",
                                    "E-commerce Platform",
                                    "SaaS Marketing Site",
                                  ][currentTestimonial]
                                }
                              </p>
                            </div>

                            <div
                              className={`p-4 rounded-2xl bg-gradient-to-r ${unifiedColorScheme.iconBg} border border-pink-200/50`}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="w-4 h-4 text-pink-600" />
                                <span className="text-sm font-semibold text-pink-700">
                                  Kết quả
                                </span>
                              </div>
                              <p className="text-slate-700 font-bold">
                                {
                                  [
                                    "Tiết kiệm 3 tháng dev time",
                                    "+200% performance boost",
                                    "50K users trong 6 tháng",
                                    "70% faster design process",
                                  ][currentTestimonial]
                                }
                              </p>
                              <p className="text-slate-500 text-sm">
                                {
                                  [
                                    "Launch đúng deadline",
                                    "Zero performance issues",
                                    "400% ROI increase",
                                    "Client satisfaction 98%",
                                  ][currentTestimonial]
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-center items-center mt-8 gap-6">
                <button
                  onClick={() =>
                    setCurrentTestimonial(Math.max(0, currentTestimonial - 1))
                  }
                  className={`w-12 h-12 rounded-full bg-gradient-to-r ${unifiedColorScheme.button} text-white shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed`}
                  disabled={currentTestimonial === 0}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex gap-2">
                  {[...Array(4)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentTestimonial
                          ? `bg-gradient-to-r ${unifiedColorScheme.button} scale-125`
                          : "bg-pink-200 hover:bg-pink-300"
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={() =>
                    setCurrentTestimonial(Math.min(3, currentTestimonial + 1))
                  }
                  className={`w-12 h-12 rounded-full bg-gradient-to-r ${unifiedColorScheme.button} text-white shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed`}
                  disabled={currentTestimonial === 3}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Trust indicators */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible.testimonials ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1 }}
                className="text-center mt-12"
              >
                <p className="text-slate-600 mb-4 text-lg">
                  Tham gia cộng đồng 50,000+ developers Việt Nam tin tưởng
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-yellow-500" />
                    <span>4.9★ từ 25,000+ reviews</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span>50K+ active developers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span>98% customer satisfaction</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
