import { useState, useEffect } from "react";
import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import ProductCard from "@/components/ProductCard";
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
  Lightbulb,
  Crown,
  Smartphone,
  BarChart3,
  Briefcase,
  Send,
  ChevronRight,
  ChevronLeft,
  Compass,
  Percent,
  Zap,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Home: React.FC = () => {
  // ✨ Section Background Colors - Tương tự footer nhưng nhạt hơn
  const sectionBackgrounds = {
    // Hero Section - Trắng với chút pink nhạt
    hero: "from-white via-pink-25 to-rose-25",

    // Stats Section - Pink gradient nhẹ
    stats: "from-pink-25 via-rose-25 to-red-25",

    // Categories Section - Rose gradient nhẹ
    categories: "from-rose-25 via-pink-25 to-white",

    // Features Section - Gradient ngược
    features: "from-red-25 via-rose-25 to-pink-25",

    // Process Section - Pink nhạt hơn
    process: "from-pink-50 via-rose-50 to-red-50",

    // Products Section - Rose nhạt
    products: "from-rose-50 via-pink-50 to-white",

    // Testimonials Section - Red nhạt
    testimonials: "from-red-50 via-rose-50 to-pink-50",

    // Newsletter Section - Pink đậm nhất để nổi bật
    newsletter: "from-pink-75 via-rose-75 to-red-75",
  };

  // ✨ UNIFIED Color Scheme - Cùng màu với Header nhưng nhạt hơn
  const unifiedColorScheme = {
    // Buttons - Nhạt hơn header
    button: "from-pink-300 via-rose-300 to-red-300",
    buttonHover: "from-pink-400 via-rose-400 to-red-400",
    // Text gradients - Soft pink
    textMain: "from-pink-400 via-rose-400 to-red-400",
    textSecondary: "from-pink-500 via-rose-500 to-red-500",
    // Icons - Very light pink
    iconBg: "from-pink-25 to-rose-50",
    iconText: "text-pink-400",
    // Cards with subtle backgrounds
    cardBg: "from-white/95 via-pink-50/80 to-rose-50/85",
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
            emoji: "🌸",
            color: "from-pink-50 to-rose-100",
            position: "top-10 right-20",
          },
          {
            emoji: "💖",
            color: "from-rose-50 to-red-100",
            position: "top-32 left-10",
          },
          {
            emoji: "✨",
            color: "from-red-50 to-pink-100",
            position: "bottom-20 right-10",
          },
          {
            emoji: "🎀",
            color: "from-pink-100 to-rose-50",
            position: "bottom-32 left-20",
          },
          {
            emoji: "💝",
            color: "from-rose-100 to-pink-50",
            position: "top-1/2 right-1/4",
          },
          {
            emoji: "🌺",
            color: "from-red-50 to-rose-100",
            position: "top-1/3 left-1/3",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            className={`absolute ${item.position} text-4xl opacity-5`}
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
              <span>{item.emoji}</span>
            </motion.div>
          </motion.div>
        ))}
      </div>

      <main className="relative z-10">
        {/* ===== HERO SECTION ===== */}
        <section
          className={`relative px-4 py-8 sm:py-16 lg:py-16 bg-gradient-to-br ${sectionBackgrounds.hero} overflow-hidden min-h-screen flex items-center`}
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
              {/* Left Column - Enhanced Text Content */}
              <motion.div
                initial={{ opacity: 0, x: -60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
                className="space-y-8"
              >
                {/* Enhanced Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <Badge
                    className={`bg-gradient-to-r ${unifiedColorScheme.button} text-white px-5 py-2 text-sm font-semibold shadow-xl inline-flex items-center gap-2 rounded-full`}
                  >
                    <Sparkles className="w-4 h-4" />
                    Chào mừng trở lại sự sáng tạo! 🎨
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  </Badge>
                </motion.div>

                {/* Enhanced Main Title */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.4 }}
                  className="space-y-6"
                >
                  <h1
                    className={`text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r ${unifiedColorScheme.textMain} bg-clip-text text-transparent leading-[1.1]`}
                  >
                    Template
                    <br />
                    <span className="relative">
                      Market
                      <motion.div
                        className="absolute -inset-2 bg-gradient-to-r from-pink-100/10 to-rose-100/10 rounded-lg -z-10"
                        animate={{ scale: [1, 1.05, 1], rotate: [0, 1, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                      />
                    </span>
                  </h1>

                  {/* Enhanced subtitle with stats */}
                  <div className="space-y-4">
                    <p className="text-lg sm:text-xl lg:text-2xl text-slate-600 font-medium leading-relaxed">
                      Tiếp tục hành trình sáng tạo với{" "}
                      <span
                        className={`font-bold bg-gradient-to-r ${unifiedColorScheme.textSecondary} bg-clip-text text-transparent relative`}
                      >
                        2,500+ templates
                        <motion.div
                          className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-pink-200 to-rose-200 rounded-full"
                          animate={{ scaleX: [0, 1] }}
                          transition={{ duration: 2, delay: 1 }}
                        />
                      </span>{" "}
                      và{" "}
                      <span
                        className={`font-bold bg-gradient-to-r ${unifiedColorScheme.textSecondary} bg-clip-text text-transparent relative`}
                      >
                        1,200+ e-books
                        <motion.div
                          className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-rose-200 to-red-200 rounded-full"
                          animate={{ scaleX: [0, 1] }}
                          transition={{ duration: 2, delay: 1.5 }}
                        />
                      </span>
                    </p>

                    {/* Trust indicators */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-pink-400" />
                        <span>50K+ developers trust us</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>4.9/5 rating (25K+ reviews)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-pink-400" />
                        <span>Enterprise security</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Enhanced CTA Buttons */}
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
                      className={`bg-gradient-to-r ${unifiedColorScheme.button} hover:${unifiedColorScheme.buttonHover} text-white font-bold px-8 py-4 text-base shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-2xl`}
                      asChild
                    >
                      <Link to="/templates">
                        <Package className="w-5 h-5 mr-2" />
                        Khám phá Templates
                        <ArrowRight className="w-5 h-5 ml-2" />
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
                      className="border-2 border-pink-200 text-pink-600 hover:bg-pink-25 font-bold px-8 py-4 text-base rounded-2xl backdrop-blur-sm"
                      asChild
                    >
                      <Link to="/ebooks">
                        <BookOpen className="w-5 h-5 mr-2" />
                        Đọc E-books
                      </Link>
                    </Button>
                  </motion.div>
                </motion.div>

                {/* Enhanced Features Preview */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1 }}
                  className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6"
                >
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="text-center group cursor-pointer"
                    >
                      <div
                        className={`w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300`}
                      >
                        <feature.icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="space-y-1">
                        <div
                          className={`text-xs font-bold bg-gradient-to-r ${unifiedColorScheme.textSecondary} bg-clip-text text-transparent`}
                        >
                          {feature.title}
                        </div>
                        <div className="text-xs text-slate-500 leading-tight">
                          {feature.description.split(",")[0]}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Right Column - Enhanced Template Preview */}
              <motion.div
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="relative lg:justify-self-end"
              >
                <div className="relative max-w-md">
                  {/* Main Enhanced Template Card */}
                  <motion.div
                    whileHover={{ scale: 1.02, rotate: 1 }}
                    className="relative"
                  >
                    <Card
                      className={`relative overflow-hidden border-0 shadow-3xl bg-gradient-to-br ${unifiedColorScheme.cardBg} backdrop-blur-lg rounded-3xl`}
                    >
                      <CardContent className="p-6">
                        {/* Enhanced Header */}
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${unifiedColorScheme.iconBg} flex items-center justify-center shadow-xl`}
                            >
                              <Crown className="w-6 h-6 text-pink-500" />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-slate-800">
                                Pastel Dashboard Pro
                              </h3>
                              <p className="text-sm text-slate-600">
                                Premium Template
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className="bg-pink-50 text-pink-600 text-xs px-2 py-0.5">
                                  React 19
                                </Badge>
                                <Badge className="bg-rose-50 text-rose-600 text-xs px-2 py-0.5">
                                  TypeScript
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <Badge className="bg-gradient-to-r from-rose-300 to-pink-400 text-white px-3 py-1 text-xs font-bold shadow-lg">
                            Hot 🔥
                          </Badge>
                        </div>

                        {/* Enhanced Progress Visualization */}
                        <div className="space-y-3 mb-6">
                          <div className="flex justify-between text-sm text-slate-600 mb-2">
                            <span>Development Progress</span>
                            <span>85% Complete</span>
                          </div>
                          {[85, 65, 90, 78].map((progress, index) => (
                            <div key={index} className="relative">
                              <div className="h-2 bg-gradient-to-r from-pink-50 to-rose-50 rounded-full overflow-hidden">
                                <motion.div
                                  className={`h-full bg-gradient-to-r ${
                                    index % 2 === 0
                                      ? "from-pink-300 to-rose-300"
                                      : "from-rose-300 to-red-300"
                                  } rounded-full`}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${progress}%` }}
                                  transition={{
                                    duration: 2,
                                    delay: 1 + index * 0.2,
                                  }}
                                />
                              </div>
                              {index === 0 && (
                                <div className="absolute -top-5 right-0 text-xs text-slate-500">
                                  Components: {progress}%
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Enhanced Footer */}
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className="w-4 h-4 fill-yellow-400 text-yellow-400"
                                />
                              ))}
                              <span className="text-sm text-slate-600 ml-2">
                                4.9 (156)
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-slate-500">
                              <span>📁 1.2K downloads</span>
                              <span>⚡ Updated 2 days ago</span>
                            </div>
                          </div>
                          <div className="text-right space-y-1">
                            <div
                              className={`text-2xl font-bold bg-gradient-to-r ${unifiedColorScheme.textSecondary} bg-clip-text text-transparent`}
                            >
                              $49
                            </div>
                            <div className="text-sm text-slate-500 line-through">
                              $79
                            </div>
                            <div className="text-xs text-green-600 font-semibold">
                              38% OFF
                            </div>
                          </div>
                        </div>
                      </CardContent>

                      {/* Enhanced Floating Action */}
                      <motion.div
                        className="absolute bottom-4 left-4 w-12 h-12 bg-gradient-to-r from-rose-300 to-pink-400 rounded-full flex items-center justify-center shadow-2xl cursor-pointer"
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Heart className="w-6 h-6 text-white" />
                      </motion.div>
                    </Card>
                  </motion.div>

                  {/* Enhanced Floating Decorations */}
                  <motion.div
                    className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-r from-pink-300 to-rose-400 rounded-full flex items-center justify-center shadow-2xl"
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
                    className="absolute -bottom-6 -left-6 w-10 h-10 bg-gradient-to-r from-red-300 to-pink-400 rounded-full flex items-center justify-center shadow-2xl"
                    animate={{
                      y: [0, -20, 0],
                      rotate: [0, 180, 360],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 6, repeat: Infinity }}
                  >
                    <Rocket className="w-5 h-5 text-white" />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ===== STATS SECTION ===== */}
        <section
          className={`relative px-4 py-14 sm:py-16 lg:py-20 bg-gradient-to-br ${sectionBackgrounds.stats}`}
          id="stats"
          data-animate
          style={{
            backgroundImage: `radial-gradient(circle at 20% 80%, rgba(236, 72, 153, 0.05) 0%, transparent 50%),
                             radial-gradient(circle at 80% 20%, rgba(244, 63, 94, 0.05) 0%, transparent 50%),
                             radial-gradient(circle at 40% 40%, rgba(220, 38, 127, 0.03) 0%, transparent 50%)`,
          }}
        >
          <div className="container relative z-10 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible.stats ? { opacity: 1, y: 0 } : {}}
              className="text-center mb-12"
            >
              <Badge
                className={`mb-4 bg-gradient-to-r ${unifiedColorScheme.button} text-white px-5 py-2 text-sm font-semibold shadow-xl`}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Trusted by Industry Leaders
              </Badge>
              <h2
                className={`text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r ${unifiedColorScheme.textMain} bg-clip-text text-transparent mb-4`}
              >
                Powering Innovation Worldwide
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Join thousands of successful developers, designers, and
                companies who've accelerated their projects
              </p>
            </motion.div>

            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 60 }}
                  animate={isVisible.stats ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="group"
                >
                  <Card
                    className={`border-0 shadow-xl hover:shadow-3xl bg-gradient-to-br ${unifiedColorScheme.cardBg} backdrop-blur-lg rounded-3xl transition-all duration-500 overflow-hidden relative`}
                  >
                    <CardContent className="p-6 text-center relative z-10">
                      <motion.div
                        className={`w-16 h-16 mx-auto mb-4 rounded-3xl bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-300`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 1 }}
                      >
                        <stat.icon className={`w-8 h-8 ${stat.textColor}`} />
                      </motion.div>

                      <div
                        className={`text-3xl lg:text-4xl font-bold ${stat.textColor} mb-2`}
                      >
                        {stat.number}
                      </div>
                      <div className="text-lg font-bold text-slate-800 mb-1">
                        {stat.label}
                      </div>
                      <div className="text-sm text-slate-600 mb-3">
                        {stat.description}
                      </div>
                      <Badge
                        variant="outline"
                        className="border-pink-200 text-pink-700 bg-pink-50 text-xs"
                      >
                        {stat.growth}
                      </Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CATEGORIES SECTION ===== */}
        <section
          className={`relative px-4 py-14 sm:py-16 lg:py-20 bg-gradient-to-br ${sectionBackgrounds.categories}`}
          id="categories"
          data-animate
          style={{
            backgroundImage: `radial-gradient(circle at 20% 80%, rgba(244, 63, 94, 0.05) 0%, transparent 50%),
                             radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.05) 0%, transparent 50%),
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
                className={`mb-4 bg-gradient-to-r ${unifiedColorScheme.button} text-white px-5 py-2 text-sm font-semibold shadow-xl`}
              >
                <Package className="w-4 h-4 mr-2" />
                2500+ Premium Templates
              </Badge>
              <h2
                className={`text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r ${unifiedColorScheme.textMain} bg-clip-text text-transparent mb-4`}
              >
                Choose Your Technology Stack
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                From cutting-edge React and Vue.js to mobile apps and enterprise
                dashboards
              </p>
            </motion.div>

            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {categories.map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 60 }}
                  animate={isVisible.categories ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.15 }}
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
                          Popular
                        </Badge>
                      </div>
                    )}

                    <CardContent className="p-6 lg:p-8 flex flex-col h-full relative z-10">
                      <div className="flex items-start justify-between mb-6">
                        <motion.div
                          className={`w-14 h-14 rounded-3xl bg-gradient-to-br ${category.gradient} flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-300`}
                          whileHover={{ rotate: 12 }}
                        >
                          <category.icon className="w-7 h-7 text-white" />
                        </motion.div>

                        <div className="text-right">
                          <Badge
                            className={`bg-gradient-to-r ${unifiedColorScheme.button} text-white font-bold px-3 py-1 rounded-full shadow-lg text-sm`}
                          >
                            {category.count}
                          </Badge>
                          <div className="text-sm text-pink-600 font-semibold mt-1">
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

                        <div className="flex flex-wrap gap-2 mb-4">
                          {category.tags.slice(0, 3).map((tag, tagIndex) => (
                            <Badge
                              key={tagIndex}
                              variant="outline"
                              className="border-pink-200 text-pink-700 bg-pink-50 text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <Button
                          className={`bg-gradient-to-r ${unifiedColorScheme.button} hover:${unifiedColorScheme.buttonHover} text-white font-bold py-3 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl`}
                          asChild
                        >
                          <Link to={category.route}>
                            Explore {category.title.split(" ")[0]}
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FEATURES SHOWCASE ===== */}
        <section
          className={`relative px-4 py-14 sm:py-16 lg:py-20 bg-gradient-to-br ${sectionBackgrounds.features}`}
          id="features"
          data-animate
          style={{
            backgroundImage: `radial-gradient(circle at 20% 80%, rgba(220, 38, 127, 0.05) 0%, transparent 50%),
                             radial-gradient(circle at 80% 20%, rgba(244, 63, 94, 0.05) 0%, transparent 50%),
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
                className={`mb-4 bg-gradient-to-r ${unifiedColorScheme.button} text-white px-5 py-2 text-sm font-semibold shadow-xl`}
              >
                <Award className="w-4 h-4 mr-2" />
                Why Choose Template Market
              </Badge>
              <h2
                className={`text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r ${unifiedColorScheme.textMain} bg-clip-text text-transparent mb-4`}
              >
                Enterprise-Grade Quality
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Every template is crafted with production-ready code and
                security best practices
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
                      className={`border-0 shadow-2xl bg-gradient-to-br ${features[currentSlide].bgColor} backdrop-blur-lg rounded-3xl overflow-hidden`}
                    >
                      <CardContent className="p-8">
                        <div className="flex items-start space-x-4 mb-6">
                          <div
                            className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${features[currentSlide].color} flex items-center justify-center shadow-xl flex-shrink-0`}
                          >
                            {React.createElement(features[currentSlide].icon, {
                              className: "w-7 h-7 text-white",
                            })}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">
                              {features[currentSlide].title}
                            </h3>
                            <p className="text-slate-700 leading-relaxed">
                              {features[currentSlide].description}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          {features[currentSlide].details.map(
                            (detail, index) => (
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
                            ),
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </AnimatePresence>

                <div className="flex justify-center space-x-2 mt-6">
                  {features.map((_, index) => (
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
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="group cursor-pointer"
                      onClick={() => setCurrentSlide(index)}
                    >
                      <Card
                        className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden ${
                          index === currentSlide ? "ring-2 ring-pink-300" : ""
                        }`}
                      >
                        <CardContent className="p-4 text-center">
                          <div
                            className={`w-10 h-10 mx-auto mb-3 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center shadow-lg`}
                          >
                            <feature.icon className="w-5 h-5 text-white" />
                          </div>
                          <h4 className="font-bold text-slate-800 text-sm mb-1">
                            {feature.title}
                          </h4>
                          <p className="text-xs text-slate-600">
                            {feature.description.split(",")[0]}
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

        {/* ===== HOW IT WORKS ===== */}
        <section
          className={`relative px-4 py-14 sm:py-16 lg:py-20 bg-gradient-to-br ${sectionBackgrounds.process}`}
          id="process"
          data-animate
          style={{
            backgroundImage: `radial-gradient(circle at 20% 80%, rgba(236, 72, 153, 0.07) 0%, transparent 50%),
                             radial-gradient(circle at 80% 20%, rgba(244, 63, 94, 0.07) 0%, transparent 50%),
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
                className={`mb-4 bg-gradient-to-r ${unifiedColorScheme.button} text-white px-5 py-2 text-sm font-semibold shadow-xl`}
              >
                <Compass className="w-4 h-4 mr-2" />
                Simple 4-Step Process
              </Badge>
              <h2
                className={`text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r ${unifiedColorScheme.textMain} bg-clip-text text-transparent mb-4`}
              >
                From Idea to Launch in Minutes
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Our streamlined process gets you from concept to
                production-ready application
              </p>
            </motion.div>

            <div className="grid gap-6 lg:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              {processSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 60 }}
                  animate={isVisible.process ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.3 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="relative group"
                >
                  <Card
                    className={`border-0 shadow-xl hover:shadow-2xl bg-gradient-to-br ${unifiedColorScheme.cardBg} backdrop-blur-lg rounded-3xl transition-all duration-500 overflow-hidden`}
                  >
                    <CardContent className="p-6 text-center relative">
                      <div
                        className={`absolute -top-3 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center shadow-xl z-10`}
                      >
                        <span className="text-white font-bold text-sm">
                          {step.step}
                        </span>
                      </div>

                      <motion.div
                        className={`w-12 h-12 mx-auto mt-6 mb-4 rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 1 }}
                      >
                        <step.icon className="w-6 h-6 text-white" />
                      </motion.div>

                      <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-pink-700 transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-slate-700 leading-relaxed text-sm">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible.process ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.5 }}
              className="text-center mt-12"
            >
              <Button
                size="lg"
                className={`bg-gradient-to-r ${unifiedColorScheme.button} hover:${unifiedColorScheme.buttonHover} text-white font-bold px-10 py-4 text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-2xl`}
                asChild
              >
                <Link to="/templates">
                  Start Building Now
                  <Rocket className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* ===== PRODUCTS SHOWCASE ===== */}
        <section
          className={`relative px-4 py-14 sm:py-16 lg:py-20 bg-gradient-to-br ${sectionBackgrounds.products}`}
          id="products"
          data-animate
          style={{
            backgroundImage: `radial-gradient(circle at 20% 80%, rgba(244, 63, 94, 0.07) 0%, transparent 50%),
                             radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.07) 0%, transparent 50%),
                             radial-gradient(circle at 40% 40%, rgba(220, 38, 127, 0.04) 0%, transparent 50%)`,
          }}
        >
          <div className="container relative z-10 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible.products ? { opacity: 1, y: 0 } : {}}
              className="text-center mb-16"
            >
              <Badge
                className={`mb-4 bg-gradient-to-r ${unifiedColorScheme.button} text-white px-5 py-2 text-sm font-semibold shadow-xl`}
              >
                <Crown className="w-4 h-4 mr-2" />
                Featured Templates
              </Badge>
              <h2
                className={`text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r ${unifiedColorScheme.textMain} bg-clip-text text-transparent mb-4`}
              >
                Best-Selling Templates
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Handpicked templates that have helped thousands of developers
                launch successful projects
              </p>
            </motion.div>

            {isLoadingProducts ? (
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, index) => (
                  <Card
                    key={index}
                    className={`overflow-hidden border-0 shadow-xl bg-gradient-to-br ${unifiedColorScheme.cardBg} backdrop-blur-lg rounded-3xl`}
                  >
                    <CardContent className="p-6">
                      <div className="animate-pulse space-y-4">
                        <div className="h-40 bg-slate-200 rounded-2xl" />
                        <div className="space-y-2">
                          <div className="h-4 bg-slate-200 rounded w-3/4" />
                          <div className="h-3 bg-slate-200 rounded w-1/2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {featuredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 60 }}
                    animate={isVisible.products ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                    whileHover={{ scale: 1.03, y: -5 }}
                    className="group"
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible.products ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.2 }}
              className="text-center mt-12"
            >
              <Button
                size="lg"
                className={`bg-gradient-to-r ${unifiedColorScheme.button} hover:${unifiedColorScheme.buttonHover} text-white font-bold px-10 py-4 text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-2xl`}
                asChild
              >
                <Link to="/templates">
                  View All Templates
                  <Package className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* ===== TESTIMONIALS ===== */}
        <section
          className={`relative px-4 py-14 sm:py-16 lg:py-20 bg-gradient-to-br ${sectionBackgrounds.testimonials}`}
          id="testimonials"
          data-animate
          style={{
            backgroundImage: `radial-gradient(circle at 20% 80%, rgba(220, 38, 127, 0.07) 0%, transparent 50%),
                             radial-gradient(circle at 80% 20%, rgba(244, 63, 94, 0.07) 0%, transparent 50%),
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
                className={`mb-4 bg-gradient-to-r ${unifiedColorScheme.button} text-white px-5 py-2 text-sm font-semibold shadow-xl`}
              >
                <Quote className="w-4 h-4 mr-2" />
                Customer Success Stories
              </Badge>
              <h2
                className={`text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r ${unifiedColorScheme.textMain} bg-clip-text text-transparent mb-4`}
              >
                Loved by Developers Worldwide
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Real stories from real developers who've accelerated their
                careers with our templates
              </p>
            </motion.div>

            <div className="max-w-5xl mx-auto">
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
                            <img
                              src={testimonials[currentTestimonial].avatar}
                              alt={testimonials[currentTestimonial].name}
                              className="w-20 h-20 rounded-full shadow-2xl"
                            />
                            {testimonials[currentTestimonial].verified && (
                              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-xl">
                                <CheckCircle className="w-5 h-5 text-white" />
                              </div>
                            )}
                          </div>

                          <div>
                            <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
                              <h3 className="text-lg font-bold text-slate-900">
                                {testimonials[currentTestimonial].name}
                              </h3>
                              <span className="text-xl">
                                {testimonials[currentTestimonial].flag}
                              </span>
                            </div>
                            <p className="text-pink-600 font-semibold">
                              {testimonials[currentTestimonial].role}
                            </p>
                            <p className="text-slate-600 text-sm">
                              {testimonials[currentTestimonial].company}
                            </p>
                          </div>
                        </div>

                        <div className="lg:col-span-2 space-y-6">
                          <div className="flex items-center justify-center lg:justify-start gap-2">
                            {[
                              ...Array(testimonials[currentTestimonial].rating),
                            ].map((_, i) => (
                              <Star
                                key={i}
                                className="w-5 h-5 fill-yellow-400 text-yellow-400"
                              />
                            ))}
                            <span className="text-slate-600 ml-2 font-medium text-sm">
                              {testimonials[currentTestimonial].date}
                            </span>
                          </div>

                          <blockquote className="text-lg lg:text-xl text-slate-800 leading-relaxed font-medium italic text-center lg:text-left">
                            "{testimonials[currentTestimonial].content}"
                          </blockquote>

                          <div className="grid sm:grid-cols-2 gap-4">
                            <div
                              className={`p-4 rounded-2xl bg-gradient-to-r ${unifiedColorScheme.iconBg} border border-pink-200/50`}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <Briefcase className="w-4 h-4 text-pink-600" />
                                <span className="text-sm font-semibold text-pink-700">
                                  Project
                                </span>
                              </div>
                              <p className="text-slate-700 font-medium text-sm">
                                {testimonials[currentTestimonial].projectType}
                              </p>
                            </div>

                            <div
                              className={`p-4 rounded-2xl bg-gradient-to-r ${unifiedColorScheme.iconBg} border border-pink-200/50`}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="w-4 h-4 text-pink-600" />
                                <span className="text-sm font-semibold text-pink-700">
                                  Impact
                                </span>
                              </div>
                              <p className="text-slate-700 font-bold">
                                {testimonials[currentTestimonial].revenue}
                              </p>
                              <p className="text-slate-500 text-sm">
                                {testimonials[currentTestimonial].timeFrame}
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
                  className={`w-10 h-10 rounded-full bg-gradient-to-r ${unifiedColorScheme.button} text-white shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center disabled:opacity-50`}
                  disabled={currentTestimonial === 0}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex gap-2">
                  {testimonials.map((_, index) => (
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
                    setCurrentTestimonial(
                      Math.min(testimonials.length - 1, currentTestimonial + 1),
                    )
                  }
                  className={`w-10 h-10 rounded-full bg-gradient-to-r ${unifiedColorScheme.button} text-white shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center disabled:opacity-50`}
                  disabled={currentTestimonial === testimonials.length - 1}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ===== NEWSLETTER SECTION ===== */}
        <section
          className={`relative px-4 py-16 sm:py-20 lg:py-24 bg-gradient-to-br ${sectionBackgrounds.newsletter} overflow-hidden`}
          id="newsletter"
          data-animate
          style={{
            backgroundImage: `radial-gradient(circle at 20% 80%, rgba(236, 72, 153, 0.1) 0%, transparent 50%),
                             radial-gradient(circle at 80% 20%, rgba(244, 63, 94, 0.1) 0%, transparent 50%),
                             radial-gradient(circle at 40% 40%, rgba(220, 38, 127, 0.05) 0%, transparent 50%)`,
          }}
        >
          <div className="container relative z-10 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={isVisible.newsletter ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1 }}
              className="text-center mb-12"
            >
              <Badge
                className={`mb-6 bg-gradient-to-r ${unifiedColorScheme.button} text-white px-6 py-3 text-base font-bold shadow-2xl`}
              >
                <Rocket className="w-5 h-5 mr-2" />
                Join 50,000+ Developers Today! 🚀
              </Badge>

              <h2
                className={`text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r ${unifiedColorScheme.textMain} bg-clip-text text-transparent mb-6 leading-[1.1]`}
              >
                Ready to Build
                <br />
                Something Amazing?
              </h2>

              <p className="text-xl lg:text-2xl text-slate-600 font-medium leading-relaxed max-w-4xl mx-auto mb-10">
                Tham gia cộng đồng hơn{" "}
                <span className="font-bold text-pink-700">
                  50,000 developers
                </span>{" "}
                đang tin tưởng Template Market để{" "}
                <span className="font-bold text-rose-700">
                  accelerate their projects
                </span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    size="lg"
                    className={`bg-gradient-to-r ${unifiedColorScheme.button} hover:${unifiedColorScheme.buttonHover} text-white font-bold px-10 py-5 text-xl shadow-3xl hover:shadow-4xl transition-all duration-300 rounded-3xl`}
                    asChild
                  >
                    <Link to="/templates">
                      <Package className="w-6 h-6 mr-3" />
                      Browse 2500+ Templates
                      <ArrowRight className="w-6 h-6 ml-3" />
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
                    className="border-2 border-pink-300 text-pink-700 hover:bg-pink-50 font-bold px-10 py-5 text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 rounded-3xl backdrop-blur-sm"
                    asChild
                  >
                    <Link to="/ebooks">
                      <BookOpen className="w-6 h-6 mr-3" />
                      Read 1200+ E-books
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={isVisible.newsletter ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.3 }}
              className="max-w-3xl mx-auto"
            >
              <Card
                className={`border-0 shadow-3xl bg-gradient-to-br ${unifiedColorScheme.cardBg} backdrop-blur-xl rounded-3xl overflow-hidden`}
              >
                <CardContent className="p-8 lg:p-12 text-center">
                  <div className="mb-8">
                    <motion.div
                      className={`w-16 h-16 mx-auto mb-6 rounded-3xl bg-gradient-to-r ${unifiedColorScheme.button} flex items-center justify-center shadow-2xl`}
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      <Mail className="w-8 h-8 text-white" />
                    </motion.div>

                    <h3
                      className={`text-2xl lg:text-3xl font-bold bg-gradient-to-r ${unifiedColorScheme.textMain} bg-clip-text text-transparent mb-3`}
                    >
                      Nhận tin tức mới nhất
                    </h3>

                    <p className="text-lg text-slate-600 leading-relaxed max-w-xl mx-auto">
                      Weekly updates về latest templates, exclusive discounts,
                      development tips - straight to your inbox!
                    </p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mb-8">
                    {[
                      {
                        icon: Gift,
                        title: "Exclusive Templates",
                        description: "Early access to new releases",
                      },
                      {
                        icon: Percent,
                        title: "Special Discounts",
                        description: "Up to 50% OFF for subscribers",
                      },
                      {
                        icon: Lightbulb,
                        title: "Pro Tips & Tutorials",
                        description: "Weekly development insights",
                      },
                    ].map((benefit, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={
                          isVisible.newsletter ? { opacity: 1, y: 0 } : {}
                        }
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="text-center"
                      >
                        <div
                          className={`w-12 h-12 mx-auto mb-3 rounded-2xl bg-gradient-to-r ${unifiedColorScheme.iconBg} flex items-center justify-center shadow-lg`}
                        >
                          <benefit.icon className="w-6 h-6 text-pink-600" />
                        </div>
                        <h4 className="font-bold text-slate-800 mb-1 text-sm">
                          {benefit.title}
                        </h4>
                        <p className="text-xs text-slate-600">
                          {benefit.description}
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                    <div className="relative max-w-md mx-auto">
                      <Input
                        type="email"
                        placeholder="Enter your email address..."
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        className="h-12 pl-4 pr-28 border-2 border-pink-200 focus:border-pink-400 rounded-2xl bg-white/90 backdrop-blur-sm shadow-lg"
                        required
                      />
                      <Button
                        type="submit"
                        className={`absolute right-1 top-1 bottom-1 bg-gradient-to-r ${unifiedColorScheme.button} hover:${unifiedColorScheme.buttonHover} text-white font-bold px-4 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl`}
                      >
                        <Send className="w-4 h-4 mr-1" />
                        Subscribe
                      </Button>
                    </div>

                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      🔒 No spam, unsubscribe anytime. We respect your privacy.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible.newsletter ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1 }}
              className="text-center mt-16"
            >
              <p className="text-xl text-slate-600 font-medium mb-6">
                Ready to accelerate your development journey? 🚀
              </p>
              <Button
                size="lg"
                className={`bg-gradient-to-r ${unifiedColorScheme.button} hover:${unifiedColorScheme.buttonHover} text-white font-bold px-12 py-4 text-lg shadow-3xl hover:shadow-4xl transition-all duration-300 rounded-3xl`}
                asChild
              >
                <Link to="/templates">
                  Get Started Free
                  <Sparkles className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
