import { useState, useEffect } from "react";
import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import ProductCard from "@/components/ProductCard";
import { getFeaturedProducts } from "@/lib/products";
import { Product } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
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
  ChevronRight,
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
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Index: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const products = await getFeaturedProducts(4);
        setFeaturedProducts(products);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchFeaturedProducts();

    // Intersection Observer for scroll animations
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

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Enhanced testimonials với ảnh thật và tên Việt Nam
  const testimonials = [
    {
      name: "Nguyễn Quang Anh",
      role: "Senior Frontend Developer",
      company: "FPT Software",
      location: "Hồ Chí Minh, Việt Nam",
      content:
        "Thật sự mình hơi hoài nghi lúc đầu khi mua template này, nhưng sau khi download về thì wow! Code được viết rất sạch sẽ, folder structure hợp lý, và quan trọng nhất là không có những đoạn code thừa hay comment lung tung. Mình đã dùng để build website bán hàng cho khách, chỉ cần customize màu sắc và content là xong. Khách hàng feedback rất tích cực về UI/UX. Cảm ơn tác giả!",
      avatar:
        "https://scontent.fhan14-2.fna.fbcdn.net/v/t39.30808-1/404568384_3605339516346021_1390983089401404751_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=100&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeHSVRE_B2j_csmkyCswyqF_uWe3A-uAy6W5Z7cD64DLpf2ezk_YZ0dFr1IHFJITsVTZxOIbGNzF7eMrFhBBUeho&_nc_ohc=6Q8h5puJ0nUQ7kNvwF4Pl_t&_nc_oc=Admkoz1KHOdEJzNqIN5NJM3lW2FvssxD3bO9JI5F6oPCSBgatzPl6uqa8iRJIeDVUqY&_nc_zt=24&_nc_ht=scontent.fhan14-2.fna&_nc_gid=nxh1GeBy5AWCJbFkxApznw&oh=00_AfRgrZXHX4aRPKK5ppu3F943WvMgouHaG-ooesNyo_cifw&oe=68744EAC",
      rating: 5,
      date: "2 tuần trước",
      verified: true,
      projectType: "Website Bán Hàng Online",
      flag: "🇻🇳",
    },
    {
      name: "Nguyễn Thị Hoài Ngọc",
      role: "UI/UX Designer",
      company: "Vingroup Technology",
      location: "Hà Nội, Việt Nam",
      content:
        "Mình làm designer nhưng cũng cần hiểu code để communicate với dev team tốt hơn. E-book về React này viết rất dễ hiểu, không quá technical mà vẫn đầy đủ kiến thức. Phần về component design patterns giúp mình hiểu được tại sao dev team lại structure code như vậy. Giờ mình design UI cũng có tính đến việc implement, collaboration với team smooth hơn nhiều.",
      avatar:
        "https://scontent.fhan14-5.fna.fbcdn.net/v/t39.30808-1/474033394_628434136317476_1405476397981786571_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=109&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeET-qxbnq2AteKMscWwdz2bixSqw47bX_uLFKrDjttf-4DLRBw8SwT5dr7NZVkffXvW7ySU8M1D7HdcQ_9-mfFC&_nc_ohc=liJCQrWA4ykQ7kNvwE5LrKR&_nc_oc=AdkEsqf0ZnHog-wC0QoCcfmPiQqbQL7nawCYt-FSiR0HUVstgJsHLodNNkg0V6OngS8&_nc_zt=24&_nc_ht=scontent.fhan14-5.fna&_nc_gid=5nOMmcBtUkml22w9GPuvKQ&oh=00_AfQNeq5jkDllhyUOjZF7ltT0TlFG7sltVeChOKloKRUFjw&oe=6874554F",
      rating: 5,
      date: "1 tuần trước",
      verified: true,
      projectType: "E-book React Patterns",
      flag: "🇻🇳",
    },
    {
      name: "Bùi Huy Đức",
      role: "Fullstack Developer",
      company: "Tiki Corporation",
      location: "Hồ Chí Minh, Việt Nam",
      content:
        "Honestly, mình đã thử nhiều admin template khác nhau rồi, đa số đều có vấn đề về performance hoặc code quality. Cái này khác, authentication flow được implement chuẩn chỉ, role management linh hoạt, và charts/tables render rất mượt. Mình chỉ cần focus vào business logic thay vì phải fix những bug cơ bản. Đáng tiền nhất là có support, inbox hỏi gì cũng được trả lời nhanh.",
      avatar:
        "https://scontent.fhan14-4.fna.fbcdn.net/v/t39.30808-1/441194208_1124384071937544_5042461177258539917_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=107&ccb=1-7&_nc_sid=1d2534&_nc_eui2=AeHbRjXDIjEt9Ok0TNHhadAP1bO-eXKEB4TVs755coQHhPOyzPK2p7lrMiSzMsdWtwwN5H66qIuAhjRCZI3-qYi2&_nc_ohc=lLhkYorSFh4Q7kNvwED7fKP&_nc_oc=AdmzpjmnFJW5MO8Rzc-75lmqpUhc5CzrlA7IxJnUP465SfhB16cPq7u9BOGT0I3xIk0&_nc_zt=24&_nc_ht=scontent.fhan14-4.fna&_nc_gid=gndF3FimEdykNlqtkuo7LA&oh=00_AfS7_5tWuYVF5sBoPge6bhjVHD828hiYFo8_MltVb7O0fw&oe=68745604",
      rating: 5,
      date: "3 ngày trước",
      verified: true,
      projectType: "Admin Dashboard Template",
      flag: "🇻🇳",
    },
    {
      name: "Vũ Thành Đạt",
      role: "Mobile Developer",
      company: "VNG Corporation",
      location: "Hồ Chí Minh, Việt Nam",
      content:
        "Lúc đầu team mình định tự code từ đầu, nhưng timeline quá gấp. May mắn tìm được template này, navigation structure đã được optimize cho UX, state management clear, và quan trọng nhất là performance trên cả iOS lẫn Android đều ổn. Mình chỉ cần customize UI theo brand guideline và integrate API. Từ 3 tháng estimate giờ chỉ còn 3 tuần là done.",
      avatar:
        "https://scontent.fhan14-1.fna.fbcdn.net/v/t39.30808-1/414662311_1430374387826190_1868360130151648161_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=105&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeE1OagPYL3YlJaoglbGtE8_8NCribnV4lrw0KuJudXiWsJXsWnEzW1-uZTFo-rtM-GFAnvikcQqZ7KdhFtprhpg&_nc_ohc=VpUMP1RFcToQ7kNvwHOzXuk&_nc_oc=AdlYWvkN--TcZJs8NEJ0nGd5aANPHf8ABvI6EmB4pk3KyJNS0P4cq8icDMTD-13_NCw&_nc_zt=24&_nc_ht=scontent.fhan14-1.fna&_nc_gid=2lC-McJ6aI1UoXfRiL8kkg&oh=00_AfSQaHpu1WeRGjJJTsX_i46YN6nWITeSLCeIfJCfi8IqrA&oe=68744267",
      rating: 5,
      date: "5 ngày trước",
      verified: true,
      projectType: "React Native App Template",
      flag: "🇻🇳",
    },
    {
      name: "Phạm Minh Công",
      role: "Tech Lead",
      company: "Shopee Vietnam",
      location: "Hồ Chí Minh, Việt Nam",
      content:
        "Mình đã review code của template này khá kỹ trước khi approve cho team sử dụng. Phải nói là impressed với code quality - TypeScript được sử dụng đúng cách, error handling comprehensive, và architecture scalable. Đặc biệt là folder structure và naming convention rất consistent, junior dev vào cũng dễ hiểu. Đây là template đầu tiên mình thấy có thể dùng cho production mà không cần refactor nhiều.",
      avatar:
        "https://scontent.fhan14-1.fna.fbcdn.net/v/t39.30808-1/503753507_2219147335183489_5815809593221351603_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=105&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeEPF1_5nRui_Psxqu7w5Cog5tFVd3PajnPm0VV3c9qOc0vB_3S6HP2bs1YvWJ5nw0ojFWwTV9LDdALDJFOB3Eu2&_nc_ohc=lBOk3djSgNcQ7kNvwGxeNmX&_nc_oc=AdlrTiLG-J16xZxAJNhV35siKRZxZwFLvVvWmDnmv-dKUsAyERCDL2DLEfYyrUxDvUI&_nc_zt=24&_nc_ht=scontent.fhan14-1.fna&_nc_gid=tWGD1KhYtMxPgyaHdtwrAQ&oh=00_AfSYdFjtDtpIKO8a3jjEYsuKeTNXpcyWRf8c_WQz2AfiPw&oe=68744028",
      rating: 5,
      date: "1 tuần trước",
      verified: true,
      projectType: "Next.js SaaS Boilerplate",
      flag: "🇻🇳",
    },
    {
      name: "Đỗ Thị Lan Anh",
      role: "Product Designer",
      company: "Grab Vietnam",
      location: "Hà Nội, Việt Nam",
      content:
        "Mình thường không review technical stuff, nhưng design system guide này thực sự helpful. Nó không chỉ show components mà còn explain khi nào dùng cái gì, accessibility guidelines, và cả responsive behavior. Team dev giờ implement design của mình accurate hơn vì có reference cụ thể. Đặc biệt là color system và typography scale rất well-thought, mình đã adapt cho design system của Grab.",
      avatar:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      date: "4 ngày trước",
      verified: true,
      projectType: "Design System Documentation",
      flag: "🇻🇳",
    },
  ];

  // ✅ Enhanced stats với design như ảnh
  const stats = [
    { number: "50K+", label: "Khách hàng hài lòng", icon: Users },
    { number: "1K+", label: "Templates chất lượng", icon: Package },
    { number: "500+", label: "E-books hữu ích", icon: BookOpen },
    { number: "99%", label: "Đánh giá tích cực", icon: Star },
  ];

  const categories = [
    {
      title: "Templates",
      description: "Hàng nghìn template React, Vue, Angular chất lượng cao",
      icon: Package,
      count: "1,200+",
      href: "/templates",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient:
        "from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20",
    },
    {
      title: "E-books",
      description: "Thư viện e-books về lập trình và thiết kế từ chuyên gia",
      icon: BookOpen,
      count: "500+",
      href: "/ebooks",
      gradient: "from-green-500 to-emerald-500",
      bgGradient:
        "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
    },
  ];

  const features = [
    {
      icon: Shield,
      title: "Chất lượng đảm bảo",
      description: "Tất cả sản phẩm được kiểm tra kỹ lưỡng bởi team chuyên gia",
      gradient: "from-green-500 to-emerald-500",
      delay: "0ms",
    },
    {
      icon: Download,
      title: "Download ngay lập tức",
      description: "Tải về ngay sau khi thanh toán, không cần chờ đợi",
      gradient: "from-blue-500 to-cyan-500",
      delay: "200ms",
    },
    {
      icon: Award,
      title: "Hỗ trợ 24/7",
      description: "Đội ngũ support luôn sẵn sàng hỗ trợ bạn mọi lúc",
      gradient: "from-purple-500 to-pink-500",
      delay: "400ms",
    },
  ];

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

      <div className="min-h-screen overflow-hidden">
        {/* ✅ Enhanced Hero Section */}
        <section className="relative px-4 py-20 overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
          {/* Animated background elements */}
          <div className="absolute inset-0">
            <div className="absolute bg-blue-300 rounded-full top-20 left-20 w-96 h-96 mix-blend-multiply filter blur-xl opacity-60 animate-blob"></div>
            <div className="absolute bg-purple-300 rounded-full top-40 right-20 w-80 h-80 mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-2000"></div>
            <div className="absolute bg-pink-300 rounded-full -bottom-20 left-40 w-72 h-72 mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-4000"></div>
          </div>

          {/* Floating elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 animate-float">
              <Code className="w-8 h-8 text-blue-500 opacity-30" />
            </div>
            <div className="absolute top-1/3 right-1/4 animate-float-delay-1">
              <Palette className="w-6 h-6 text-purple-500 opacity-30" />
            </div>
            <div className="absolute bottom-1/4 left-1/3 animate-float-delay-2">
              <Coffee className="text-pink-500 w-7 h-7 opacity-30" />
            </div>
          </div>

          <div className="container relative z-10 mx-auto text-center">
            <div className="max-w-5xl mx-auto space-y-8">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Badge
                  variant="outline"
                  className="mb-6 transition-transform border-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur hover:scale-105"
                >
                  <Sparkles className="w-3 h-3 mr-1 animate-pulse" />
                  Chào mừng đến với Template Market
                  <Star className="w-3 h-3 ml-1 text-yellow-500" />
                </Badge>
              </motion.div>

              {/* Main heading */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-5xl font-bold leading-tight md:text-7xl lg:text-8xl"
              >
                <span className="inline-block text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text hover:animate-pulse">
                  Premium
                </span>
                <br />
                <span className="inline-block hover:animate-bounce">
                  Templates
                </span>{" "}
                <span className="inline-block text-transparent bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text hover:animate-wiggle">
                  & E-books
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="max-w-3xl mx-auto text-xl md:text-2xl text-muted-foreground"
              >
                Khám phá bộ sưu tập{" "}
                <span className="font-semibold text-blue-600 animate-pulse">
                  templates chuyên nghiệp
                </span>{" "}
                và{" "}
                <span className="font-semibold text-purple-600 animate-pulse">
                  e-books chất lượng cao
                </span>{" "}
                được thiết kế bởi các chuyên gia hàng đầu
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col items-center justify-center gap-6 sm:flex-row"
              >
                <Button
                  size="lg"
                  asChild
                  className="relative overflow-hidden transition-all duration-300 group hover:scale-110 hover:shadow-2xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  <Link to="/templates">
                    <span className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-white/20 to-transparent group-hover:opacity-100"></span>
                    <Package className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                    Khám phá Templates
                    <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="transition-all duration-300 border-2 group backdrop-blur bg-white/50 dark:bg-slate-800/50 hover:scale-110 hover:bg-white/70 dark:hover:bg-slate-800/70"
                  asChild
                >
                  <Link to="/ebooks">
                    <BookOpen className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                    Xem E-books
                  </Link>
                </Button>
              </motion.div>

              {/* Trust indicators */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex items-center justify-center space-x-8 text-sm text-muted-foreground"
              >
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>100% Chất lượng</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Download className="w-4 h-4 text-blue-500" />
                  <span>Download ngay</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-purple-500" />
                  <span>Hỗ trợ 24/7</span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ✅ Enhanced Stats Section với design như ảnh */}
        <section
          className="relative px-4 py-16 bg-gradient-to-r from-slate-100 via-blue-100 to-purple-100 dark:from-slate-800 dark:via-blue-900 dark:to-purple-900"
          id="stats"
          data-animate
        >
          {/* Floating gradient orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute w-32 h-32 rounded-full top-10 left-10 bg-blue-400/20 blur-xl animate-pulse"></div>
            <div className="absolute w-40 h-40 rounded-full bottom-10 right-10 bg-purple-400/20 blur-xl animate-pulse animation-delay-2000"></div>
          </div>

          <div className="container relative z-10 mx-auto">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`text-center transition-all duration-500 ${
                    isVisible.stats
                      ? "animate-in slide-in-from-bottom"
                      : "opacity-0"
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* ✅ Enhanced icon design như trong ảnh */}
                  <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 transition-transform duration-300 rounded-full shadow-xl bg-gradient-to-r from-blue-500 to-purple-600 group-hover:scale-110">
                    <stat.icon className="w-10 h-10 text-white" />
                  </div>

                  {/* ✅ Enhanced number styling */}
                  <div className="mb-3 text-4xl font-bold text-transparent text-gray-900 dark:text-white bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                    {stat.number}
                  </div>

                  {/* ✅ Enhanced label styling */}
                  <div className="text-lg font-medium text-gray-600 dark:text-gray-300">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ✅ Enhanced Featured Products Section */}
        <section
          className="relative px-4 py-20 overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-900 dark:via-teal-900 dark:to-cyan-900"
          id="featured-products"
          data-animate
        >
          {/* Animated gradient background */}
          <div className="absolute inset-0">
            <div className="absolute rounded-full bg-emerald-300 top-20 left-20 w-96 h-96 mix-blend-multiply filter blur-xl opacity-60 animate-blob"></div>
            <div className="absolute bg-teal-300 rounded-full top-10 right-10 w-80 h-80 mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-2000"></div>
            <div className="absolute rounded-full bg-cyan-300 -bottom-10 left-40 w-72 h-72 mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-4000"></div>
          </div>

          {/* Floating elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 animate-float">
              <Package className="w-10 h-10 text-emerald-500 opacity-40" />
            </div>
            <div className="absolute top-1/3 right-1/4 animate-float-delay-1">
              <Star className="w-8 h-8 text-teal-500 opacity-40" />
            </div>
            <div className="absolute bottom-1/4 left-1/3 animate-float-delay-2">
              <Sparkles className="w-12 h-12 text-cyan-500 opacity-40" />
            </div>
          </div>

          <div className="container relative z-10 mx-auto">
            <div
              className={`mb-16 space-y-6 text-center transition-all duration-800 ${
                isVisible["featured-products"]
                  ? "animate-in slide-in-from-bottom"
                  : "opacity-0"
              }`}
            >
              {/* Enhanced header */}
              <div className="animate-in fade-in slide-in-from-bottom duration-800">
                <Badge
                  variant="outline"
                  className="mb-6 transition-transform border-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur border-gradient-to-r from-emerald-500 to-cyan-500 hover:scale-105"
                >
                  <Star className="w-3 h-3 mr-1 animate-pulse text-emerald-600" />
                  Sản phẩm được yêu thích nhất
                  <TrendingUp className="w-3 h-3 ml-1 text-cyan-600" />
                </Badge>
              </div>

              <h2 className="text-4xl font-bold leading-tight text-transparent delay-200 md:text-6xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text animate-in fade-in slide-in-from-bottom duration-800">
                <span className="inline-block hover:animate-bounce">
                  Sản phẩm
                </span>{" "}
                <span className="inline-block hover:animate-pulse">
                  nổi bật
                </span>
              </h2>

              <p className="max-w-3xl mx-auto text-xl md:text-2xl text-muted-foreground animate-in fade-in slide-in-from-bottom duration-800 delay-400">
                Những sản phẩm được{" "}
                <span className="font-semibold text-emerald-600 animate-pulse">
                  yêu thích nhất
                </span>{" "}
                từ cộng đồng{" "}
                <span className="font-semibold text-teal-600 animate-pulse">
                  developers & designers
                </span>
              </p>
            </div>

            {/* Products grid */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {isLoadingProducts ? (
                <div className="py-20 text-center lg:col-span-4">
                  <div className="relative w-16 h-16 mx-auto mb-6">
                    <div className="absolute inset-0 border-4 rounded-full border-emerald-200"></div>
                    <div className="absolute inset-0 border-4 rounded-full border-emerald-500 border-t-transparent animate-spin"></div>
                  </div>
                  <p className="text-xl font-medium text-emerald-600">
                    Đang tải sản phẩm nổi bật...
                  </p>
                </div>
              ) : featuredProducts.length > 0 ? (
                featuredProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className={`transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 ${
                      isVisible["featured-products"]
                        ? "animate-in slide-in-from-bottom"
                        : "opacity-0"
                    }`}
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
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
                ))
              ) : (
                <div className="py-20 text-center lg:col-span-4">
                  <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500">
                    <Package className="w-10 h-10 text-white" />
                  </div>
                  <p className="mb-4 text-xl font-medium text-muted-foreground">
                    Không tìm thấy sản phẩm nổi bật nào.
                  </p>
                  <Button
                    asChild
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                  >
                    <Link to="/templates">Xem tất cả sản phẩm</Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Enhanced View All Button */}
            <div className="mt-16 text-center">
              <Button
                size="lg"
                asChild
                className="relative overflow-hidden transition-all duration-300 shadow-xl group bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 hover:shadow-2xl hover:scale-105"
              >
                <Link to="/templates">
                  <span className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-white/20 to-transparent group-hover:opacity-100"></span>
                  <Eye className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                  Xem tất cả sản phẩm
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ✅ Enhanced Categories Section */}
        <section
          className="relative px-4 py-20 overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 dark:from-rose-900 dark:via-pink-900 dark:to-purple-900"
          id="categories"
          data-animate
        >
          {/* Animated background */}
          <div className="absolute inset-0">
            <div className="absolute rounded-full opacity-50 bg-rose-300 top-16 right-16 w-80 h-80 mix-blend-multiply filter blur-xl animate-blob"></div>
            <div className="absolute bg-pink-300 rounded-full opacity-50 top-32 left-16 w-96 h-96 mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
            <div className="absolute bg-purple-300 rounded-full opacity-50 -bottom-16 right-32 w-72 h-72 mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
          </div>

          <div className="container relative z-10 mx-auto">
            <div
              className={`mb-16 space-y-6 text-center transition-all duration-800 ${
                isVisible.categories
                  ? "animate-in slide-in-from-bottom"
                  : "opacity-0"
              }`}
            >
              <Badge
                variant="outline"
                className="mb-6 transition-transform border-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur border-gradient-to-r from-rose-500 to-purple-500 hover:scale-105"
              >
                <Package className="w-3 h-3 mr-1 animate-pulse text-rose-600" />
                Khám phá danh mục
                <ChevronRight className="w-3 h-3 ml-1 text-purple-600" />
              </Badge>

              <h2 className="text-4xl font-bold leading-tight text-transparent md:text-6xl bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text">
                <span className="inline-block hover:animate-bounce">
                  Danh mục
                </span>{" "}
                <span className="inline-block hover:animate-wiggle">
                  sản phẩm
                </span>
              </h2>

              <p className="max-w-3xl mx-auto text-xl md:text-2xl text-muted-foreground">
                Lựa chọn từ nhiều{" "}
                <span className="font-semibold text-rose-600 animate-pulse">
                  danh mục đa dạng
                </span>{" "}
                phù hợp với nhu cầu của bạn
              </p>
            </div>

            {/* Enhanced categories grid */}
            <div className="grid gap-8 md:grid-cols-2">
              {categories.map((category, index) => (
                <Card
                  key={index}
                  className={`group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-4 border-0 bg-gradient-to-br from-white via-rose-50 to-pink-50 dark:from-slate-800 dark:via-rose-900/20 dark:to-pink-900/20 ${
                    isVisible.categories
                      ? "animate-in slide-in-from-bottom"
                      : "opacity-0"
                  }`}
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6 space-x-6">
                      <div
                        className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${category.gradient} flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300`}
                      >
                        <category.icon className="w-10 h-10 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-2 text-2xl font-bold text-gray-900 transition-colors dark:text-white group-hover:text-primary">
                          {category.title}
                        </h3>
                        <p className="leading-relaxed text-muted-foreground">
                          {category.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-3xl font-bold text-primary">
                        {category.count}
                      </div>
                      <Button
                        asChild
                        className={`group/btn bg-gradient-to-r ${category.gradient} hover:shadow-lg transition-all duration-300`}
                      >
                        <Link to={category.href}>
                          Khám phá
                          <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ✅ Enhanced Features Section */}
        <section
          className="relative px-4 py-20 overflow-hidden bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 dark:from-indigo-900 dark:via-blue-900 dark:to-cyan-900"
          id="features"
          data-animate
        >
          {/* Animated background */}
          <div className="absolute inset-0">
            <div className="absolute bg-indigo-300 rounded-full top-20 left-20 w-88 h-88 mix-blend-multiply filter blur-xl opacity-40 animate-blob"></div>
            <div className="absolute bg-blue-300 rounded-full top-40 right-20 w-80 h-80 mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-2000"></div>
            <div className="absolute rounded-full bg-cyan-300 -bottom-20 left-40 w-96 h-96 mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-4000"></div>
          </div>

          <div className="container relative z-10 mx-auto">
            <div
              className={`mb-16 space-y-6 text-center transition-all duration-800 ${
                isVisible.features
                  ? "animate-in slide-in-from-bottom"
                  : "opacity-0"
              }`}
            >
              <Badge
                variant="outline"
                className="mb-6 transition-transform border-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur border-gradient-to-r from-indigo-500 to-cyan-500 hover:scale-105"
              >
                <Shield className="w-3 h-3 mr-1 text-indigo-600 animate-pulse" />
                Tại sao chọn chúng tôi
                <Award className="w-3 h-3 ml-1 text-cyan-600" />
              </Badge>

              <h2 className="text-4xl font-bold leading-tight text-transparent md:text-6xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 bg-clip-text">
                <span className="inline-block hover:animate-bounce">
                  Ưu điểm
                </span>{" "}
                <span className="inline-block hover:animate-pulse">
                  vượt trội
                </span>
              </h2>

              <p className="max-w-3xl mx-auto text-xl md:text-2xl text-muted-foreground">
                Chúng tôi cam kết mang đến{" "}
                <span className="font-semibold text-indigo-600 animate-pulse">
                  sản phẩm tốt nhất
                </span>{" "}
                với{" "}
                <span className="font-semibold text-blue-600 animate-pulse">
                  dịch vụ chuyên nghiệp
                </span>
              </p>
            </div>

            {/* Enhanced features grid */}
            <div className="grid gap-8 md:grid-cols-3">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className={`group p-8 text-center transition-all duration-500 hover:shadow-2xl hover:-translate-y-4 border-0 bg-gradient-to-br from-white via-indigo-50 to-blue-50 dark:from-slate-800 dark:via-indigo-900/20 dark:to-blue-900/20 ${
                    isVisible.features
                      ? "animate-in slide-in-from-bottom"
                      : "opacity-0"
                  }`}
                  style={{ animationDelay: feature.delay }}
                >
                  <div
                    className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="mb-4 text-xl font-bold text-gray-900 transition-colors dark:text-white group-hover:text-primary">
                    {feature.title}
                  </h3>
                  <p className="leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ✅ Enhanced Testimonials Section */}
        <section
          className="px-4 py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-blue-900 dark:to-purple-900"
          id="testimonials"
          data-animate
        >
          <div className="container mx-auto">
            {/* Header */}
            <div
              className={`mb-16 space-y-6 text-center transition-all duration-800 ${
                isVisible.testimonials
                  ? "animate-in slide-in-from-bottom"
                  : "opacity-0"
              }`}
            >
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full dark:bg-blue-900/30">
                <Users className="w-5 h-5 mr-2 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">
                  Khách hàng nói gì
                </span>
              </div>

              <h2 className="text-4xl font-bold text-transparent md:text-5xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text">
                Câu chuyện thành công
              </h2>

              <p className="max-w-3xl mx-auto text-lg leading-relaxed text-muted-foreground">
                Hàng nghìn developers và designers tại các công ty hàng đầu Việt
                Nam đã tin tưởng và đạt được thành công với sản phẩm của chúng
                tôi
              </p>

              {/* Stats */}
              <div className="flex items-center justify-center mt-8 space-x-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">50K+</div>
                  <div className="text-sm text-muted-foreground">
                    Khách hàng
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    4.9/5
                  </div>
                  <div className="text-sm text-muted-foreground">Đánh giá</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-pink-600">98%</div>
                  <div className="text-sm text-muted-foreground">Hài lòng</div>
                </div>
              </div>
            </div>

            {/* Featured Testimonial */}
            <div
              className={`mb-16 transition-all duration-800 ${
                isVisible.testimonials
                  ? "animate-in slide-in-from-bottom"
                  : "opacity-0"
              }`}
            >
              <Card className="max-w-5xl mx-auto overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-white via-blue-50 to-purple-50 dark:from-slate-800 dark:via-blue-900/20 dark:to-purple-900/20">
                <CardContent className="p-0">
                  <div className="grid gap-0 md:grid-cols-2">
                    {/* Content Side */}
                    <div className="flex flex-col justify-center p-8 md:p-12">
                      <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                        <Quote className="w-8 h-8 text-white" />
                      </div>

                      <blockquote className="mb-8 text-xl font-medium leading-relaxed text-center text-gray-700 md:text-2xl dark:text-gray-300">
                        "{testimonials[currentTestimonial].content}"
                      </blockquote>

                      <div className="flex items-center justify-center mb-6 space-x-1">
                        {[
                          ...Array(testimonials[currentTestimonial].rating),
                        ].map((_, i) => (
                          <Star
                            key={i}
                            className="w-6 h-6 text-yellow-400 fill-yellow-400"
                          />
                        ))}
                      </div>

                      <div className="text-center">
                        <div className="flex items-center justify-center mb-2 space-x-3">
                          <span className="text-xl font-bold text-gray-900 dark:text-white">
                            {testimonials[currentTestimonial].name}
                          </span>
                          <span className="text-2xl">
                            {testimonials[currentTestimonial].flag}
                          </span>
                          {testimonials[currentTestimonial].verified && (
                            <Badge className="text-green-800 bg-green-100 dark:bg-green-900 dark:text-green-200">
                              <Shield className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>

                        <div className="mb-1 text-lg font-semibold text-blue-600">
                          {testimonials[currentTestimonial].role}
                        </div>

                        <div className="mb-2 font-medium text-purple-600">
                          {testimonials[currentTestimonial].company}
                        </div>

                        <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>
                              {testimonials[currentTestimonial].location}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{testimonials[currentTestimonial].date}</span>
                          </div>
                        </div>

                        <Badge
                          variant="outline"
                          className="mt-3 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50"
                        >
                          <Package className="w-3 h-3 mr-1" />
                          {testimonials[currentTestimonial].projectType}
                        </Badge>
                      </div>
                    </div>

                    {/* Image Side */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20"></div>
                      <img
                        src={testimonials[currentTestimonial].avatar}
                        alt={testimonials[currentTestimonial].name}
                        className="object-cover w-full h-full"
                      />

                      {/* Overlay với company logo effect */}
                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="p-4 shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                              <Building className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900 dark:text-white">
                                {testimonials[currentTestimonial].company}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Trusted Partner
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Testimonial Grid */}
            <div className="grid gap-8 mb-12 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.slice(1, 4).map((testimonial, index) => (
                <Card
                  key={index}
                  className={`group transition-all duration-500 hover:shadow-xl hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 ${
                    isVisible.testimonials
                      ? "animate-in slide-in-from-bottom"
                      : "opacity-0"
                  }`}
                  style={{ animationDelay: `${(index + 1) * 200}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4 space-x-4">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="object-cover w-16 h-16 border-4 border-white rounded-full shadow-lg"
                      />
                      <div className="flex-1">
                        <div className="flex items-center mb-1 space-x-2">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {testimonial.name}
                          </h4>
                          <span className="text-lg">{testimonial.flag}</span>
                          {testimonial.verified && (
                            <Badge
                              variant="secondary"
                              className="text-xs text-green-800 bg-green-100"
                            >
                              <Shield className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm font-medium text-blue-600">
                          {testimonial.role}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {testimonial.company}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center mb-3 space-x-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 text-yellow-400 fill-yellow-400"
                        />
                      ))}
                    </div>

                    <blockquote className="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300 line-clamp-4">
                      "{testimonial.content}"
                    </blockquote>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{testimonial.date}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {testimonial.projectType}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    index === currentTestimonial
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 scale-125 shadow-lg"
                      : "bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500"
                  }`}
                />
              ))}
            </div>

            {/* Trust Indicators */}
            <div className="mt-16 text-center">
              <div className="inline-flex items-center p-6 space-x-8 border border-gray-200 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium">
                    100% Verified Reviews
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium">
                    Top Rated Products
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span className="text-sm font-medium">
                    Trusted by 50K+ Users
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ✅ Enhanced CTA Section */}
        <section className="relative px-4 py-20 overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600">
          {/* Enhanced animated background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20"></div>
            <div className="absolute rounded-full w-96 h-96 top-10 right-10 bg-white/10 animate-pulse blur-xl"></div>
            <div className="absolute rounded-full w-80 h-80 bottom-10 left-10 bg-white/10 animate-pulse animation-delay-2000 blur-xl"></div>
            <div className="absolute w-64 h-64 transform -translate-x-1/2 -translate-y-1/2 rounded-full top-1/2 left-1/2 bg-white/5 animate-pulse animation-delay-4000 blur-xl"></div>
          </div>

          {/* Floating elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 animate-float">
              <Rocket className="w-12 h-12 text-white/30" />
            </div>
            <div className="absolute top-1/3 right-1/4 animate-float-delay-1">
              <Star className="w-10 h-10 text-white/30" />
            </div>
            <div className="absolute bottom-1/4 left-1/3 animate-float-delay-2">
              <Heart className="text-white/30 w-14 h-14" />
            </div>
          </div>

          <div className="container relative z-10 mx-auto text-center">
            <div className="max-w-4xl mx-auto space-y-8 text-white">
              <div className="animate-in fade-in slide-in-from-bottom duration-800">
                <Badge
                  variant="outline"
                  className="mb-6 text-white transition-transform border-2 bg-white/20 backdrop-blur border-white/30 hover:scale-105"
                >
                  <Sparkles className="w-3 h-3 mr-1 animate-pulse" />
                  Bắt đầu ngay hôm nay
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Badge>
              </div>

              <h2 className="text-4xl font-bold leading-tight delay-200 md:text-7xl animate-in slide-in-from-bottom duration-800">
                <span className="inline-block hover:animate-bounce">
                  Bắt đầu
                </span>{" "}
                <span className="inline-block text-transparent hover:animate-pulse bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text">
                  hành trình
                </span>
                <br />
                <span className="inline-block hover:animate-wiggle">
                  của bạn
                </span>
              </h2>

              <p className="max-w-3xl mx-auto text-xl md:text-2xl opacity-90 animate-in slide-in-from-bottom duration-800 delay-400">
                Gia nhập cộng đồng{" "}
                <span className="font-semibold text-yellow-300 animate-pulse">
                  hàng nghìn developers
                </span>{" "}
                và{" "}
                <span className="font-semibold text-orange-300 animate-pulse">
                  designers
                </span>{" "}
                đang sử dụng sản phẩm của chúng tôi
              </p>

              <div className="flex flex-col items-center justify-center gap-6 sm:flex-row animate-in slide-in-from-bottom duration-800 delay-600">
                <Button
                  size="lg"
                  variant="secondary"
                  asChild
                  className="relative overflow-hidden font-bold text-black transition-all duration-300 group hover:scale-110 hover:shadow-2xl bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400"
                >
                  <Link to="/auth/register">
                    <span className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-white/20 to-transparent group-hover:opacity-100"></span>
                    <Rocket className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                    Đăng ký miễn phí
                    <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="font-bold text-white transition-all duration-300 border-2 border-white/50 group backdrop-blur bg-white/10 hover:scale-110 hover:bg-white/20 hover:border-white"
                  asChild
                >
                  <Link to="/contact">
                    <Globe className="w-5 h-5 mr-2 group-hover:animate-spin" />
                    Liên hệ với chúng tôi
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Index;
