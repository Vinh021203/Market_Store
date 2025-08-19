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
import { BlogPost } from "@/types/blog";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Star,
  TrendingUp,
  Package,
  BookOpen,
  Shield,
  Award,
  Users,
  Globe,
  Eye,
  Download,
  Code,
  Palette,
  Coffee,
  Sparkles,
  Heart,
  Rocket,
  Quote,
  MapPin,
  Calendar,
  Building,
  CheckCircle,
  Gift,
  ExternalLink,
  Mail,
  MessageSquare,
  Search,
  Settings,
  Database,
  Target,
  Lightbulb,
  Menu,
  X,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoadingBlog, setIsLoadingBlog] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const products = await getFeaturedProducts(6);
        setFeaturedProducts(products);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchFeaturedProducts();

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
      { threshold: 0.1 },
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

  const testimonials = [
    {
      name: "Nguyễn Quang Anh",
      role: "Senior Frontend Developer",
      company: "FPT Software",
      location: "Hồ Chí Minh, Việt Nam",
      content:
        "Code được viết rất sạch sẽ, folder structure hợp lý, và không có những đoạn code thừa. Mình đã dùng để build website bán hàng cho khách, feedback rất tích cực về UI/UX!",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      date: "2 tuần trước",
      verified: true,
      projectType: "Website Bán Hàng Online",
      flag: "🇻🇳",
      revenue: "+300% doanh thu",
      timeFrame: "Trong 3 tháng",
    },
    {
      name: "Nguyễn Thị Hoài Ngọc",
      role: "UI/UX Designer",
      company: "Vingroup Technology",
      location: "Hà Nội, Việt Nam",
      content:
        "E-book về React này viết rất dễ hiểu, phần về component design patterns giúp mình hiểu được tại sao dev team structure code như vậy. Collaboration với team smooth hơn nhiều.",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b95eeb3e?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      date: "1 tuần trước",
      verified: true,
      projectType: "E-book React Patterns",
      flag: "🇻🇳",
      revenue: "+50% efficiency",
      timeFrame: "Ngay lập tức",
    },
    {
      name: "Bùi Huy Đức",
      role: "Fullstack Developer",
      company: "Tiki Corporation",
      location: "Hồ Chí Minh, Việt Nam",
      content:
        "Authentication flow được implement chuẩn, role management linh hoạt, charts/tables render rất mượt. Chỉ cần focus vào business logic thay vì fix bug cơ bản.",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      date: "3 ngày trước",
      verified: true,
      projectType: "Admin Dashboard Template",
      flag: "🇻🇳",
      revenue: "-80% development time",
      timeFrame: "So với tự code",
    },
  ];

  const stats = [
    {
      number: "50K+",
      label: "Khách hàng hài lòng",
      icon: Users,
      gradient: "from-blue-600 to-cyan-500",
      color: "text-blue-600",
      description: "Trên toàn thế giới",
    },
    {
      number: "1.2K+",
      label: "Templates chất lượng",
      icon: Package,
      gradient: "from-pink-600 to-orange-500",
      color: "text-pink-600",
      description: "Được cập nhật hàng tuần",
    },
    {
      number: "800+",
      label: "E-books hữu ích",
      icon: BookOpen,
      gradient: "from-purple-600 to-blue-500",
      color: "text-purple-600",
      description: "Từ các chuyên gia",
    },
    {
      number: "4.9/5",
      label: "Đánh giá trung bình",
      icon: Star,
      gradient: "from-yellow-500 to-orange-500",
      color: "text-yellow-600",
      description: "Từ 25K+ reviews",
    },
  ];

  const categories = [
    {
      title: "React Templates",
      description:
        "Templates React modern với TypeScript, Tailwind CSS và best practices",
      icon: Code,
      count: "450+",
      href: "/templates?category=react",
      gradient: "from-blue-600 to-cyan-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      iconColor: "text-blue-600",
      features: ["TypeScript", "Tailwind CSS", "Responsive", "SEO Ready"],
    },
    {
      title: "Vue Templates",
      description:
        "Templates Vue.js với Composition API và Pinia state management",
      icon: Palette,
      count: "320+",
      href: "/templates?category=vue",
      gradient: "from-green-600 to-emerald-500",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      iconColor: "text-green-600",
      features: ["Vue 3", "Composition API", "Pinia", "Vite"],
    },
    {
      title: "Angular Templates",
      description: "Templates Angular với Material Design và RxJS patterns",
      icon: Target,
      count: "280+",
      href: "/templates?category=angular",
      gradient: "from-red-600 to-orange-500",
      bgColor: "bg-red-50 dark:bg-red-900/20",
      iconColor: "text-red-600",
      features: ["Angular 17", "Material", "RxJS", "SSR"],
    },
    {
      title: "Next.js Templates",
      description: "Templates Next.js với App Router và Server Components",
      icon: Rocket,
      count: "200+",
      href: "/templates?category=nextjs",
      gradient: "from-purple-600 to-pink-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      iconColor: "text-purple-600",
      features: ["App Router", "Server Components", "API Routes", "Middleware"],
    },
    {
      title: "E-books Frontend",
      description: "Sách điện tử về HTML, CSS, JavaScript và frameworks",
      icon: BookOpen,
      count: "150+",
      href: "/ebooks?category=frontend",
      gradient: "from-indigo-600 to-purple-500",
      bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
      iconColor: "text-indigo-600",
      features: ["HTML5", "CSS3", "JavaScript ES6+", "Web APIs"],
    },
    {
      title: "E-books Backend",
      description: "Sách về Node.js, Python, databases và cloud services",
      icon: Database,
      count: "120+",
      href: "/ebooks?category=backend",
      gradient: "from-amber-600 to-orange-500",
      bgColor: "bg-amber-50 dark:bg-amber-900/20",
      iconColor: "text-amber-600",
      features: ["Node.js", "Python", "Databases", "Cloud"],
    },
  ];

  const features = [
    {
      icon: Shield,
      title: "Chất lượng đảm bảo",
      description:
        "Mọi template và e-book đều được kiểm tra kỹ lưỡng bởi team chuyên gia với hơn 10 năm kinh nghiệm",
      gradient: "from-green-600 to-emerald-500",
      iconColor: "text-green-600",
      stats: "99.8% uptime",
    },
    {
      icon: Download,
      title: "Download ngay lập tức",
      description:
        "Tải về ngay sau khi thanh toán thành công, không cần chờ đợi hay xác nhận email",
      gradient: "from-blue-600 to-cyan-500",
      iconColor: "text-blue-600",
      stats: "< 30 giây",
    },
    {
      icon: Award,
      title: "Hỗ trợ 24/7",
      description:
        "Đội ngũ support luôn sẵn sàng hỗ trợ qua chat, email và phone mọi lúc trong tuần",
      gradient: "from-purple-600 to-pink-500",
      iconColor: "text-purple-600",
      stats: "Response < 1h",
    },
    {
      icon: Rocket,
      title: "Cập nhật liên tục",
      description:
        "Templates được cập nhật theo latest trends và technologies, luôn đi đầu xu hướng",
      gradient: "from-orange-600 to-amber-500",
      iconColor: "text-orange-600",
      stats: "Weekly updates",
    },
    {
      icon: Users,
      title: "Cộng đồng active",
      description:
        "Tham gia cộng đồng 50K+ developers để chia sẻ kinh nghiệm và học hỏi lẫn nhau",
      gradient: "from-pink-600 to-rose-500",
      iconColor: "text-pink-600",
      stats: "50K+ thành viên",
    },
    {
      icon: Globe,
      title: "Tương thích global",
      description:
        "Templates hỗ trợ đa ngôn ngữ, multiple timezone và international payment methods",
      gradient: "from-cyan-600 to-blue-500",
      iconColor: "text-cyan-600",
      stats: "195+ countries",
    },
  ];

  const processSteps = [
    {
      step: "01",
      title: "Khám phá & Tìm kiếm",
      description:
        "Browse qua hàng nghìn templates và e-books được phân loại chi tiết theo technology stack",
      icon: Search,
      gradient: "from-blue-600 to-cyan-500",
      iconColor: "text-blue-600",
    },
    {
      step: "02",
      title: "Preview & Demo",
      description:
        "Xem preview trực tiếp, demo live và đọc documentation chi tiết trước khi quyết định",
      icon: Eye,
      gradient: "from-purple-600 to-pink-500",
      iconColor: "text-purple-600",
    },
    {
      step: "03",
      title: "Purchase & Download",
      description:
        "Thanh toán secure qua multiple payment methods và download ngay lập tức",
      icon: Download,
      gradient: "from-green-600 to-emerald-500",
      iconColor: "text-green-600",
    },
    {
      step: "04",
      title: "Customize & Deploy",
      description:
        "Customize theo nhu cầu với detailed docs và deploy lên hosting favorites",
      icon: Settings,
      gradient: "from-orange-600 to-amber-500",
      iconColor: "text-orange-600",
    },
  ];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      toast({
        title: "🎉 Đăng ký thành công!",
        description:
          "Chúng tôi sẽ gửi những template và e-book mới nhất đến email của bạn.",
      });
      setNewsletterEmail("");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <>
      <Helmet>
        <title>
          Template Market - Premium Templates & E-books cho Developers
        </title>
        <meta
          name="description"
          content="Khám phá hàng nghìn template React, Vue, Angular và e-books chất lượng cao. Download ngay templates admin dashboard, landing page, e-commerce với giá tốt nhất."
        />
        <meta
          name="keywords"
          content="template react, vue template, angular template, admin dashboard, landing page, e-commerce template, ui kit, ebook web design, template việt nam"
        />
        <meta
          property="og:title"
          content="Template Market - Premium Templates & E-books"
        />
        <meta
          property="og:description"
          content="Khám phá hàng nghìn template React, Vue, Angular và e-books chất lượng cao cho developers Việt Nam."
        />
        <meta property="og:image" content="/og-image.jpg" />
        <meta property="og:url" content="https://templatemarket.vn" />
        <link rel="canonical" href="https://templatemarket.vn" />
      </Helmet>

      <style>
        {`
          @keyframes gentleGlow {
            0%,100% {
              text-shadow: 0 0 10px rgba(245,158,66,0.3),0 0 20px rgba(244,114,182,0.2);
              opacity:1;
            }
            50% {
              text-shadow: 0 0 15px rgba(245,158,66,0.4),0 0 25px rgba(244,114,182,0.3);
              opacity:0.95;
            }
          }
          .animate-gentle-glow { animation: gentleGlow 3s infinite ease-in-out; }

          @keyframes softPulse {
            0%,100% { opacity:1; transform:scale(1); }
            50% { opacity:0.85; transform:scale(1.02);}
          }
          .animate-soft-pulse { animation: softPulse 2s infinite ease-in-out; }

          @keyframes subtleShimmer {
            0% { background-position: -200px 0; }
            100% { background-position: calc(200px + 100%) 0; }
          }
          .animate-subtle-shimmer {
            background: linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent);
            background-size: 200px 100%;
            animation: subtleShimmer 3s infinite;
          }

          @keyframes colorShift {
            0% { background-position:0% 50%; }
            50% { background-position:100% 50%; }
            100% { background-position:0% 50%; }
          }
          .animate-color-shift {
            background: linear-gradient(45deg,#ff6b9d,#c44bd4,#6c5ce7,#74b9ff,#0984e3);
            background-size: 300% 300%;
            animation: colorShift 4s ease infinite;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        `}
      </style>

      <div className="min-h-screen">
        {/* ✅ 1. PROMO BANNER - Responsive */}
        <motion.section
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-500 text-white"
        >
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="container relative z-10 mx-auto px-4 py-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Gift className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </motion.div>
                  <span className="font-semibold text-sm sm:text-base">
                    🔥 Flash Sale: Giảm 50% tất cả templates với mã
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    className="bg-white text-orange-600 font-bold hover:bg-orange-50 cursor-pointer transition-all duration-300 text-xs sm:text-sm"
                    onClick={() => {
                      navigator.clipboard.writeText("FLASH50");
                      toast({
                        title: "📋 Đã sao chép!",
                        description: "Mã FLASH50 đã được copy vào clipboard",
                      });
                    }}
                  >
                    FLASH50
                  </Badge>
                  <span className="hidden sm:inline text-sm">
                    - Chỉ còn 2 ngày!
                  </span>
                </div>
              </div>
              <Button
                size="sm"
                variant="secondary"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-xs sm:text-sm"
                asChild
              >
                <Link to="/templates">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Shop Now
                </Link>
              </Button>
            </div>
          </div>
        </motion.section>

        {/* ✅ 2. HERO SECTION - Full Responsive */}
        <section className="relative px-4 py-12 sm:py-16 lg:py-20 overflow-hidden bg-gradient-to-br from-orange-100  via-purple-100 to-blue-100 dark:via-purple-900/30 dark:to-blue-900/30">
          {/* Floating elements - Hidden on mobile */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none hidden lg:block">
            {[
              { icon: "🍪", position: "top-10 right-20", delay: 0 },
              { icon: "💖", position: "top-32 right-10", delay: 1 },
              { icon: "🚀", position: "bottom-20 left-10", delay: 2 },
            ].map((item, i) => (
              <motion.div
                key={i}
                className={`absolute ${item.position} text-4xl lg:text-6xl opacity-20`}
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: item.delay,
                }}
              >
                {item.icon}
              </motion.div>
            ))}
          </div>

          <div className="container relative z-10 mx-auto text-center">
            <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
              {/* Main Heading - Responsive */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-4"
              >
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight">
                  <span className="text-slate-800 dark:text-slate-200">
                    Templates
                  </span>{" "}
                  <span className="text-transparent bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text animate-color-shift">
                    &
                  </span>{" "}
                  <span className="text-transparent bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text animate-color-shift">
                    E-books
                  </span>
                </h1>

                {/* Subtitle - Responsive */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-700 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed px-4"
                >
                  Khám phá bộ sưu tập{" "}
                  <span className="font-semibold text-transparent bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text">
                    1,200+ templates chuyên nghiệp
                  </span>{" "}
                  và{" "}
                  <span className="font-semibold text-transparent bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text">
                    800+ e-books chất lượng cao
                  </span>{" "}
                  được thiết kế bởi các chuyên gia hàng đầu thế giới
                </motion.p>
              </motion.div>

              {/* CTA Buttons - Responsive */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    asChild
                    className="w-full sm:w-auto bg-gradient-to-r from-pink-600 via-purple-600 to-orange-600 hover:from-pink-700 hover:via-purple-700 hover:to-orange-700 text-white font-semibold px-6 sm:px-8 py-3 rounded-full shadow-lg border-0"
                  >
                    <Link to="/templates">
                      <Package className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Khám phá Templates
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                    </Link>
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-2 border-purple-400 text-purple-700 hover:bg-purple-50 dark:text-purple-300 dark:border-purple-300 dark:hover:bg-purple-900/20 font-semibold px-6 sm:px-8 py-3 rounded-full bg-white/80 backdrop-blur"
                    asChild
                  >
                    <Link to="/ebooks">
                      <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Xem E-books
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>

              {/* Trust Indicators - Responsive Grid */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-3 sm:gap-6"
              >
                {[
                  {
                    icon: CheckCircle,
                    text: "100% Chất lượng",
                    color: "text-green-600",
                  },
                  {
                    icon: Download,
                    text: "Download ngay",
                    color: "text-blue-600",
                  },
                  {
                    icon: Award,
                    text: "Hỗ trợ 24/7",
                    color: "text-purple-600",
                  },
                  { icon: Users, text: "50K+ Users", color: "text-pink-600" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 rounded-full bg-white/70 backdrop-blur border border-white/30 shadow-sm"
                    whileHover={{ scale: 1.05 }}
                  >
                    <item.icon
                      className={`w-3 h-3 sm:w-4 sm:h-4 ${item.color}`}
                    />
                    <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                      {item.text}
                    </span>
                  </motion.div>
                ))}
              </motion.div>

              {/* Search Bar - Fully Responsive */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.0 }}
                className="max-w-4xl mx-auto px-4"
              >
                <form onSubmit={handleSearch} className="relative">
                  <div className="relative group">
                    <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-hover:text-purple-600 transition-colors" />
                    <Input
                      placeholder="Tìm kiếm templates, e-books..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 sm:pl-12 pr-20 sm:pr-32 py-3 sm:py-4 text-sm sm:text-lg bg-white/90 backdrop-blur border-2 border-purple-200/50 focus:border-purple-400 rounded-xl sm:rounded-2xl shadow-lg focus:shadow-xl transition-all duration-300"
                    />
                    <Button
                      type="submit"
                      className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700 text-white rounded-lg sm:rounded-xl px-3 sm:px-6 py-1 sm:py-2 text-xs sm:text-sm transition-all duration-300"
                    >
                      <Search className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                      <span className="hidden sm:inline">Tìm kiếm</span>
                    </Button>
                  </div>
                </form>

                {/* Trending tags - Responsive */}
                <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                  <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    Trending:
                  </span>
                  {[
                    "React Dashboard",
                    "Vue E-commerce",
                    "Next.js Blog",
                    "Angular CRM",
                  ].map((term, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="cursor-pointer hover:bg-purple-100 hover:text-purple-700 dark:hover:bg-purple-900/20 transition-colors bg-white/70 backdrop-blur border border-purple-200/50 text-xs"
                    >
                      {term}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ✅ 3. STATS SECTION - Responsive Grid */}
        <section
          className="relative px-4 py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-slate-100 via-purple-100 to-pink-100 dark:from-slate-800 dark:via-purple-900/30 dark:to-pink-900/30"
          id="stats"
          data-animate
        >
          <div className="container relative z-10 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8 sm:mb-12"
            >
              <Badge className="mb-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs sm:text-sm">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Được tin tướng bởi hàng nghìn developers
              </Badge>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text mb-4">
                Con số ấn tượng
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-slate-700 dark:text-slate-300 max-w-2xl mx-auto px-4">
                Template Market đã trở thành lựa chọn hàng đầu của developers và
                designers trên toàn thế giới
              </p>
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="text-center transition-all duration-500 group"
                >
                  <Card className="p-4 sm:p-6 border-0 shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-xl sm:rounded-2xl group-hover:shadow-xl transition-all duration-300">
                    <motion.div
                      className={`flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-lg sm:rounded-xl shadow-lg bg-gradient-to-r ${stat.gradient} group-hover:scale-110 transition-transform duration-300`}
                      whileHover={{ rotate: 12 }}
                    >
                      <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </motion.div>
                    <div className="mb-2 text-2xl sm:text-3xl font-bold text-transparent bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text">
                      {stat.number}
                    </div>
                    <div className="text-sm sm:text-base lg:text-lg font-medium text-slate-700 dark:text-slate-300 mb-1">
                      {stat.label}
                    </div>
                    <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                      {stat.description}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ✅ 4. HOW IT WORKS - Responsive Process */}
        <section
          className="relative px-4 py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 dark:from-blue-900/30 dark:via-indigo-900/30 dark:to-purple-900/30"
          id="how-it-works"
          data-animate
        >
          <div className="container relative z-10 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12 sm:mb-16"
            >
              <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs sm:text-sm">
                <Rocket className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Quá trình làm việc
              </Badge>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 bg-clip-text mb-4">
                Cách thức hoạt động
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-slate-700 dark:text-slate-300 max-w-3xl mx-auto px-4">
                Chỉ với 4 bước đơn giản, bạn đã có thể sở hữu templates và
                e-books chất lượng cao
              </p>
            </motion.div>

            <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-4">
              {processSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="relative group"
                >
                  <Card className="p-6 sm:p-8 border-0 shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-xl sm:rounded-2xl group-hover:shadow-xl transition-all duration-300 h-full">
                    <div
                      className={`absolute -top-3 -left-3 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r ${step.gradient} flex items-center justify-center shadow-lg`}
                    >
                      <span className="text-white font-bold text-xs sm:text-sm">
                        {step.step}
                      </span>
                    </div>

                    <motion.div
                      className={`w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-4 sm:mb-6 rounded-lg sm:rounded-xl bg-gradient-to-r ${step.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                      whileHover={{ rotate: 15 }}
                    >
                      <step.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </motion.div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 mb-3 text-center">
                      {step.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-center leading-relaxed text-xs sm:text-sm">
                      {step.description}
                    </p>

                    {index < processSteps.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-slate-300 to-transparent transform -translate-y-1/2"></div>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="text-center mt-12 sm:mt-16"
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-lg text-sm sm:text-base"
                asChild
              >
                <Link to="/templates">
                  <Rocket className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Bắt đầu ngay bây giờ
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* ✅ 5. CATEGORIES - Responsive Cards */}
        <section
          className="relative px-4 py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 dark:from-purple-900/30 dark:via-pink-900/30 dark:to-orange-900/30"
          id="categories"
          data-animate
        >
          <div className="container relative z-10 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12 sm:mb-16"
            >
              <Badge className="mb-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs sm:text-sm">
                <Package className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Danh mục phong phú
              </Badge>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-gradient-to-r from-purple-700 via-pink-700 to-orange-700 bg-clip-text mb-4">
                Khám phá danh mục
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-slate-700 dark:text-slate-300 max-w-3xl mx-auto px-4">
                Từ React, Vue, Angular đến Next.js - chúng tôi có mọi thứ bạn
                cần để xây dựng ứng dụng hiện đại
              </p>
            </motion.div>

            <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
              {categories.map((category, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="group h-full"
                >
                  <Card
                    className={`
        relative overflow-hidden border-0 shadow-lg hover:shadow-2xl
        ${category.bgColor} 
        backdrop-blur-sm rounded-2xl lg:rounded-3xl 
        transition-all duration-500 ease-out
        h-full flex flex-col
        group-hover:scale-[1.02]
        transform-gpu
      `}
                  >
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                      <div
                        className={`w-full h-full rounded-full bg-gradient-to-br ${category.gradient} transform translate-x-6 -translate-y-6`}
                      ></div>
                    </div>

                    <CardContent className="p-6 lg:p-8 flex flex-col h-full relative z-10">
                      {/* Header với Icon và Count */}
                      <div className="flex items-start justify-between mb-6">
                        <motion.div
                          className={`
                w-14 h-14 lg:w-16 lg:h-16 
                rounded-2xl bg-gradient-to-br ${category.gradient} 
                flex items-center justify-center shadow-xl
                group-hover:shadow-2xl group-hover:scale-110 
                transition-all duration-300
              `}
                          whileHover={{ rotate: 8 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <category.icon className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
                        </motion.div>

                        <Badge
                          className={`
                bg-gradient-to-r ${category.gradient} 
                text-white text-sm font-semibold
                px-3 py-1 rounded-full shadow-lg
                group-hover:scale-105 transition-transform duration-300
              `}
                        >
                          {category.count}
                        </Badge>
                      </div>

                      {/* Content */}
                      <div className="flex-1 flex flex-col">
                        <h3
                          className="
              text-xl lg:text-2xl font-bold 
              text-slate-900 dark:text-slate-100 
              mb-3 lg:mb-4
              group-hover:text-purple-700 dark:group-hover:text-purple-300 
              transition-colors duration-300
              line-clamp-2
            "
                        >
                          {category.title}
                        </h3>

                        <p
                          className="
              text-slate-600 dark:text-slate-400 
              mb-6 leading-relaxed text-sm lg:text-base
              flex-1
              line-clamp-3
            "
                        >
                          {category.description}
                        </p>

                        {/* Features Tags */}
                        <div className="flex flex-wrap gap-2 mb-6">
                          {category.features.map((feature, i) => (
                            <Badge
                              key={i}
                              variant="secondary"
                              className="
                    text-xs bg-white/70 dark:bg-slate-700/70 
                    text-slate-700 dark:text-slate-300
                    border-0 shadow-sm
                    hover:bg-white/90 dark:hover:bg-slate-700/90
                    transition-colors duration-200
                  "
                            >
                              {feature}
                            </Badge>
                          ))}
                        </div>

                        {/* CTA Button */}
                        <Button
                          asChild
                          className={`
                w-full h-12 bg-gradient-to-r ${category.gradient} 
                hover:shadow-xl hover:shadow-purple-500/25
                border-0 rounded-xl lg:rounded-2xl 
                text-white font-semibold
                transition-all duration-300
                group-hover:translate-y-[-2px]
                relative overflow-hidden
              `}
                        >
                          <Link
                            to={category.href}
                            className="flex items-center justify-center"
                          >
                            {/* Button Shimmer Effect */}
                            <div
                              className="
                  absolute inset-0 
                  bg-gradient-to-r from-transparent via-white/20 to-transparent
                  transform -skew-x-12 -translate-x-full
                  group-hover:translate-x-full
                  transition-transform duration-700
                "
                            ></div>

                            <Eye className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                            <span className="truncate">
                              Khám phá {category.title.split(" ")[0]}
                            </span>
                            <ArrowRight
                              className="
                  w-4 h-4 ml-2 
                  group-hover:translate-x-1 group-hover:scale-110
                  transition-all duration-300
                "
                            />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>

                    {/* Hover Glow Effect */}
                    <div
                      className={`
          absolute inset-0 opacity-0 group-hover:opacity-100
          bg-gradient-to-r ${category.gradient}
          rounded-2xl lg:rounded-3xl blur-xl scale-105
          transition-opacity duration-500 -z-10
        `}
                    ></div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ✅ 6. FEATURED PRODUCTS - Responsive */}
        <section
          className="relative px-4 py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-emerald-100 via-teal-100 to-cyan-100 dark:from-emerald-900/30 dark:via-teal-900/30 dark:to-cyan-900/30"
          id="featured-products"
          data-animate
        >
          <div className="container relative z-10 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12 sm:mb-16"
            >
              <Badge className="mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs sm:text-sm">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Sản phẩm nổi bật
              </Badge>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-700 bg-clip-text mb-4">
                Được yêu thích nhất
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-slate-700 dark:text-slate-300 max-w-3xl mx-auto px-4">
                Những templates và e-books được đánh giá cao nhất bởi cộng đồng
                developers và designers
              </p>
            </motion.div>

            <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
              {isLoadingProducts ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <Card className="border-0 shadow-lg rounded-xl sm:rounded-2xl overflow-hidden">
                      <div className="h-40 sm:h-48 bg-slate-200 dark:bg-slate-700"></div>
                      <CardContent className="p-4 sm:p-6">
                        <div className="h-3 sm:h-4 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                        <div className="h-3 sm:h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3 mb-4"></div>
                        <div className="h-6 sm:h-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
                      </CardContent>
                    </Card>
                  </div>
                ))
              ) : featuredProducts.length > 0 ? (
                featuredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -10 }}
                    className="group"
                  >
                    <div className="border-0 shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-xl sm:rounded-2xl group-hover:shadow-xl transition-all duration-300">
                      <ProductCard
                        product={product}
                        onAddToCart={() => {
                          toast({
                            title: "🛒 Đã thêm vào giỏ hàng",
                            description: `${product.title} đã được thêm vào giỏ hàng.`,
                          });
                        }}
                      />
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="py-16 sm:py-20 text-center lg:col-span-3">
                  <motion.div
                    className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Package className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </motion.div>
                  <p className="mb-4 text-lg sm:text-xl font-medium text-slate-700 dark:text-slate-300">
                    Đang cập nhật sản phẩm mới...
                  </p>
                  <Button
                    asChild
                    className="bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800"
                  >
                    <Link to="/templates">Xem tất cả sản phẩm</Link>
                  </Button>
                </div>
              )}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-center mt-12 sm:mt-16"
            >
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <Button
                  size="lg"
                  asChild
                  className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-lg text-sm sm:text-base"
                >
                  <Link to="/templates">
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Xem tất cả Templates
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="w-full sm:w-auto border-2 border-emerald-400 hover:bg-emerald-50 dark:border-emerald-300 dark:hover:bg-emerald-900/20 px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-sm sm:text-base"
                >
                  <Link to="/ebooks">
                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Khám phá E-books
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Continue with remaining sections... Newsletter and Final CTA would follow the same responsive pattern */}

        {/* ✅ 10. NEWSLETTER - Responsive */}
        <section
          className="relative px-4 py-12 sm:py-16 lg:py-20 overflow-hidden bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-700"
          id="newsletter"
        >
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-black/20"></div>
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white/10 blur-xl"
                style={{
                  left: `${15 + i * 12}%`,
                  top: `${8 + (i % 3) * 30}%`,
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 8 + i * 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            ))}
          </div>

          <div className="container relative z-10 mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto text-white"
            >
              <Badge className="mb-4 sm:mb-6 bg-white/20 text-white border-white/30 text-xs sm:text-sm">
                <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Đăng ký nhận tin
              </Badge>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
                Nhận template mới mỗi tuần
              </h2>

              <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 opacity-90 px-4">
                Đăng ký để nhận template miễn phí, tutorial và xu hướng thiết kế
                mới nhất từ hệ thống của chúng tôi
              </p>

              <form
                onSubmit={handleNewsletterSubmit}
                className="max-w-md mx-auto px-4"
              >
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Input
                    type="email"
                    placeholder="Nhập email của bạn"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    required
                    className="flex-1 h-10 sm:h-12 bg-white/20 border-white/30 text-white placeholder-white/70 backdrop-blur rounded-lg sm:rounded-xl text-sm sm:text-base"
                  />
                  <Button
                    type="submit"
                    className="h-10 sm:h-12 bg-white text-indigo-700 hover:bg-white/90 rounded-lg sm:rounded-xl font-semibold px-4 sm:px-6 text-sm sm:text-base whitespace-nowrap"
                  >
                    <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    Đăng ký
                  </Button>
                </div>
              </form>

              <p className="text-xs sm:text-sm mt-3 sm:mt-4 opacity-70 px-4">
                Miễn phí, không spam. Hủy đăng ký bất cứ lúc nào.
              </p>

              {/* Newsletter benefits - Responsive */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12 px-4">
                {[
                  { icon: Gift, title: "Template miễn phí", desc: "Mỗi tuần" },
                  {
                    icon: Lightbulb,
                    title: "Tutorial độc quyền",
                    desc: "Từ experts",
                  },
                  {
                    icon: TrendingUp,
                    title: "Xu hướng mới nhất",
                    desc: "Trước tiên",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + i * 0.2 }}
                    className="text-center"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 rounded-full bg-white/20 flex items-center justify-center">
                      <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-white mb-1 text-sm sm:text-base">
                      {item.title}
                    </h4>
                    <p className="text-white/70 text-xs sm:text-sm">
                      {item.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ✅ 11. FINAL CTA SECTION - Responsive */}
        <section className="relative px-4 py-12 sm:py-16 lg:py-20 overflow-hidden bg-gradient-to-br from-orange-700 via-amber-700 to-yellow-600">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-black/10"></div>
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-white/10 blur-xl"
                style={{
                  left: `${15 + i * 12}%`,
                  top: `${10 + (i % 4) * 25}%`,
                }}
                animate={{
                  scale: [1, 1.3, 1],
                  rotate: [0, 180, 360],
                  x: [0, 30, 0],
                }}
                transition={{
                  duration: 15 + i * 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            ))}
          </div>

          <div className="container relative z-10 mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto text-white space-y-6 sm:space-y-8"
            >
              <Badge className="mb-4 sm:mb-6 bg-white/20 text-white border-white/30 text-xs sm:text-sm">
                <Rocket className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Sẵn sàng bắt đầu?
              </Badge>

              <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                <span className="block">Xây dựng dự án</span>
                <span className="block text-transparent bg-gradient-to-r from-white to-yellow-200 bg-clip-text">
                  mơ ước của bạn
                </span>
              </h2>

              <p className="text-base sm:text-lg lg:text-xl xl:text-2xl opacity-90 max-w-3xl mx-auto px-4">
                Với hơn <span className="font-bold">1,200+ templates</span> và{" "}
                <span className="font-bold">800+ e-books</span> chất lượng cao,
                bạn sẽ có tất cả những gì cần thiết để tạo ra sản phẩm đẳng cấp
                thế giới.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 px-4">
                <motion.div
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-white text-orange-700 hover:bg-white/90 font-bold px-6 sm:px-10 py-3 sm:py-5 rounded-xl sm:rounded-2xl shadow-2xl text-base sm:text-lg"
                    asChild
                  >
                    <Link to="/templates">
                      <Package className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                      Khám phá Templates
                      <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-2 sm:ml-3" />
                    </Link>
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-2 border-white/50 text-white hover:bg-white/10 font-bold px-6 sm:px-10 py-3 sm:py-5 rounded-xl sm:rounded-2xl backdrop-blur text-base sm:text-lg"
                    asChild
                  >
                    <Link to="/contact">
                      <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                      Liên hệ tư vấn
                    </Link>
                  </Button>
                </motion.div>
              </div>

              {/* Final stats - Responsive Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-12 sm:mt-16 pt-8 sm:pt-16 border-t border-white/20">
                {[
                  { number: "50K+", label: "Khách hàng" },
                  { number: "1.2K+", label: "Templates" },
                  { number: "4.9★", label: "Rating" },
                  { number: "24/7", label: "Support" },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 + i * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">
                      {stat.number}
                    </div>
                    <div className="text-white/80 text-sm sm:text-base">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
