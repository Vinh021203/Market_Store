import { useState, useEffect } from "react";
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/ProductCard"; // Đảm bảo component này đã được tối ưu SEO bên trong nếu nó render sản phẩm riêng lẻ
import { getFeaturedProducts } from "@/lib/products";
import { Product } from "@/types";
import {
  ArrowRight,
  Star,
  Users,
  Download,
  BookOpen,
  Package,
  Zap,
  Shield,
  HeartHandshake,
  ChevronRight,
  Sparkles,
  Rocket,
  Quote,
  MapPin,
  Calendar,
  TrendingUp,
  Award,
  Globe,
  Code,
  Palette,
  Coffee,
  ExternalLink,
  Heart,
  Eye,
  ShoppingCart,
} from "lucide-react";
import { Helmet } from "react-helmet-async"; // ✅ Import Helmet

const Index: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchData = async () => {
      // ✅ Đảm bảo getFeaturedProducts trả về dữ liệu thực
      const data = await getFeaturedProducts();
      setFeaturedProducts(data);
    };
    fetchData();

    // Auto-rotate testimonials
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

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

    // Observe all sections
    const sections = document.querySelectorAll("[data-animate]");
    sections.forEach((section) => observer.observe(section));

    return () => {
      clearInterval(testimonialInterval);
      observer.disconnect();
    };
  }, []);

  // ✅ Fixed stats array with all required properties
  const stats = [
    {
      label: "Templates",
      value: "1000+",
      icon: Package,
      color: "from-blue-500 to-cyan-500",
      delay: "0ms",
    },
    {
      label: "E-books",
      value: "500+",
      icon: BookOpen,
      color: "from-purple-500 to-pink-500",
      delay: "100ms",
    },
    {
      label: "Khách hàng",
      value: "50K+",
      icon: Users,
      color: "from-green-500 to-emerald-500",
      delay: "200ms",
    },
    {
      label: "Downloads",
      value: "1M+",
      icon: Download,
      color: "from-orange-500 to-red-500",
      delay: "300ms",
    },
  ];

  // ✅ Fixed features array with all required properties
  const features = [
    {
      icon: Zap,
      title: "Chất lượng cao",
      description:
        "Tất cả sản phẩm đều được kiểm duyệt kỹ lưỡng về chất lượng và hiệu suất.",
      color: "from-yellow-400 to-orange-500",
      delay: "0ms",
    },
    {
      icon: Shield,
      title: "Bảo mật tuyệt đối",
      description:
        "Mã nguồn sạch, bảo mật và tuân thủ các tiêu chuẩn bảo mật hiện đại.",
      color: "from-blue-400 to-purple-500",
      delay: "200ms",
    },
    {
      icon: HeartHandshake,
      title: "Hỗ trợ 24/7",
      description:
        "Đội ngũ hỗ trợ chuyên nghiệp sẵn sàng giúp đỡ bạn mọi lúc mọi nơi.",
      color: "from-pink-400 to-red-500",
      delay: "400ms",
    },
  ];

  // ✅ Fixed categories array with all required properties
  const categories = [
    {
      title: "Templates Website",
      description: "Giao diện website chuyên nghiệp cho mọi ngành nghề",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
      count: "800+",
      href: "/templates",
      gradient: "from-blue-600 to-purple-600",
    },
    {
      title: "E-books Programming",
      description: "Sách điện tử về lập trình và công nghệ",
      image:
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop",
      count: "300+",
      href: "/ebooks",
      gradient: "from-green-600 to-blue-600",
    },
  ];

  // ✅ Fixed testimonials array with all required properties
  const testimonials = [
    {
      name: "Nguyễn Minh Tuấn",
      role: "Senior Frontend Developer",
      company: "FPT Software",
      location: "Hồ Chí Minh, Việt Nam",
      content:
        "Templates React của Market Store đã giúp team tôi tiết kiệm được 3 tuần development time. Code structure rất clean và documentation chi tiết. Đặc biệt impressed với phần responsive design và performance optimization.",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      date: "2 tuần trước",
      verified: true,
      projectType: "E-commerce Platform",
      flag: "🇻🇳",
    },
    {
      name: "Sarah Chen",
      role: "UI/UX Designer",
      company: "Google Singapore",
      location: "Singapore",
      content:
        "Outstanding quality templates! The design system is well-structured and the Figma files are perfectly organized. Used their admin dashboard template for our internal tool and it saved us months of work. Highly recommended for enterprise projects.",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612f5e6?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      date: "1 tuần trước",
      verified: true,
      projectType: "Admin Dashboard",
      flag: "🇸🇬",
    },
    {
      name: "Trần Thị Hương",
      role: "Fullstack Developer",
      company: "Vingroup",
      location: "Hà Nội, Việt Nam",
      content:
        "E-book 'Advanced React Patterns' thực sự hữu ích! Kiến thức được trình bày rõ ràng với nhiều ví dụ thực tế. Đã apply được ngay vào dự án công ty và performance tăng 40%. Đáng đồng tiền bát gạo!",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      date: "3 ngày trước",
      verified: true,
      projectType: "React E-book",
      flag: "🇻🇳",
    },
    {
      name: "Marcus Johnson",
      role: "Tech Lead",
      company: "Microsoft",
      location: "Seattle, USA",
      content:
        "Purchased the Next.js SaaS template and was blown away by the code quality. TypeScript implementation is flawless, and the architecture follows best practices. The authentication system and payment integration work perfectly out of the box.",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      date: "5 ngày trước",
      verified: true,
      projectType: "SaaS Platform",
      flag: "🇺🇸",
    },
    {
      name: "Lê Văn Đức",
      role: "Mobile Developer",
      company: "Tiki",
      location: "Hồ Chí Minh, Việt Nam",
      content:
        "React Native template cực kỳ chất lượng! Navigation structure hợp lý, state management với Redux Toolkit rất smooth. Đã launch app lên store trong 2 tuần thay vì 2 tháng như dự kiến. Support team cũng response rất nhanh.",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      date: "1 tuần trước",
      verified: true,
      projectType: "Mobile App",
      flag: "🇻🇳",
    },
    {
      name: "Emma Thompson",
      role: "Product Designer",
      company: "Shopify",
      location: "Toronto, Canada",
      content:
        "The design system documentation is phenomenal! Every component is well-documented with usage guidelines and accessibility considerations. Our design team adopted it as our standard and it improved our workflow significantly.",
      avatar:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      date: "4 ngày trước",
      verified: true,
      projectType: "Design System",
      flag: "🇨🇦",
    },
  ];

  // ✅ Sample featured products data (sử dụng biến này để render)
  const sampleProducts = [
    {
      id: "1",
      title: "Modern E-commerce Template",
      description:
        "Template React/Next.js hoàn chỉnh cho website thương mại điện tử với tích hợp thanh toán",
      price: 299000,
      originalPrice: 499000,
      image:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
      category: "template",
      tags: ["React", "Next.js", "TypeScript", "Tailwind"],
      rating: 4.9,
      reviews: 127,
      downloads: 1250,
      author: "Market Store",
      featured: true,
      discount: 40,
    },
    {
      id: "2",
      title: "Advanced React Patterns",
      description:
        "E-book chuyên sâu về các pattern nâng cao trong React, từ cơ bản đến expert level",
      price: 199000,
      originalPrice: 299000,
      image:
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop",
      category: "ebook",
      tags: ["React", "JavaScript", "Patterns", "Best Practices"],
      rating: 4.8,
      reviews: 89,
      downloads: 890,
      author: "Nguyễn Văn A",
      featured: true,
      discount: 33,
    },
    {
      id: "3",
      title: "Admin Dashboard Pro",
      description:
        "Template admin dashboard responsive với dark mode, charts và data tables",
      price: 399000,
      originalPrice: 599000,
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
      category: "template",
      tags: ["Vue.js", "Dashboard", "Charts", "Dark Mode"],
      rating: 4.7,
      reviews: 156,
      downloads: 2100,
      author: "Design Studio",
      featured: true,
      discount: 33,
    },
    {
      id: "4",
      title: "Mobile App Development Guide",
      description:
        "Hướng dẫn toàn diện phát triển ứng dụng mobile với React Native và Flutter",
      price: 249000,
      originalPrice: 349000,
      image:
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop",
      category: "ebook",
      tags: ["React Native", "Flutter", "Mobile", "iOS", "Android"],
      rating: 4.9,
      reviews: 203,
      downloads: 1560,
      author: "Tech Expert",
      featured: true,
      discount: 29,
    },
  ];

  return (
    <>
      <Helmet>
        <title>Template Market - Premium Templates & E-books</title>
        <meta
          name="description"
          content="Khám phá các mẫu template và sách điện tử cao cấp dành cho nhà phát triển và nhà thiết kế. Nguồn tài nguyên chất lượng để thúc đẩy dự án của bạn."
        />
        <meta
          name="keywords"
          content="templates, ebooks, web development, design, react, vue, nextjs, website templates, UI kits, design resources, coding books, market store, digital products"
        />
        <meta name="author" content="Template Market" />
        {/* Open Graph Meta Tags for social sharing */}
        <meta
          property="og:title"
          content="Template Market - Template & E-book chất lượng cao"
        />
        <meta
          property="og:description"
          content="Khám phá các mẫu template và sách điện tử cao cấp dành cho nhà phát triển và nhà thiết kế."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://marketstore-two.vercel.app/"
        />{" "}
        {/* ✅ Thay đổi URL chính xác */}
        <meta
          property="og:image"
          content="https://marketstore-two.vercel.app/social-share-image.jpg"
        />{" "}
        {/* ✅ Đảm bảo bạn có file ảnh này trong thư mục public/ */}
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Template Market - Premium Templates & E-books"
        />
        <meta
          name="twitter:description"
          content="Khám phá các mẫu template và sách điện tử cao cấp dành cho nhà phát triển và nhà thiết kế."
        />
        <meta
          name="twitter:image"
          content="https://marketstore-two.vercel.app/social-share-image.jpg"
        />
        {/* Structured Data (Schema Markup) for HomePage - optional but good for SEO */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Template Market",
              "url": "https://marketstore-two.vercel.app/",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://marketstore-two.vercel.app/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              },
              "description": "Discover premium templates and e-books for developers and designers. Quality resources to boost your projects.",
              "publisher": {
                "@type": "Organization",
                "name": "Template Market"
              }
            }
          `}
        </script>
      </Helmet>

      <div className="min-h-screen overflow-hidden">
        {/* ✅ Enhanced Hero Section */}
        <section className="relative px-4 py-20 overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
          {/* Animated Background */}
          <div className="absolute inset-0">
            <div className="absolute bg-purple-300 rounded-full top-10 left-10 w-72 h-72 mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 bg-yellow-300 rounded-full right-4 w-72 h-72 mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute bg-pink-300 rounded-full -bottom-8 left-20 w-72 h-72 mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
          </div>

          {/* Floating Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 animate-float">
              <Code className="w-8 h-8 text-blue-500 opacity-60" />
            </div>
            <div className="absolute top-1/3 right-1/4 animate-float-delay-1">
              <Palette className="w-6 h-6 text-purple-500 opacity-60" />
            </div>
            <div className="absolute bottom-1/4 left-1/3 animate-float-delay-2">
              <Coffee className="text-orange-500 w-7 h-7 opacity-60" />
            </div>
          </div>

          <div className="container relative z-10 mx-auto text-center">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="animate-in fade-in slide-in-from-bottom duration-800">
                <Badge
                  variant="outline"
                  className="mb-6 transition-transform border-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur border-gradient-to-r from-blue-500 to-purple-500 hover:scale-105"
                >
                  <Sparkles className="w-3 h-3 mr-1 animate-pulse" />
                  Chào mừng đến với Template Market
                  <TrendingUp className="w-3 h-3 ml-1" />
                </Badge>
              </div>

              <h1 className="text-4xl font-bold leading-tight text-transparent delay-200 md:text-7xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text animate-in fade-in slide-in-from-bottom duration-800">
                <span className="inline-block hover:animate-bounce">
                  Template
                </span>{" "}
                &
                <span className="inline-block hover:animate-pulse">
                  {" "}
                  E-book
                </span>
                <br />
                <span className="inline-block hover:animate-wiggle bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text">
                  Market
                </span>
              </h1>

              <p className="max-w-2xl mx-auto text-xl md:text-2xl text-muted-foreground animate-in fade-in slide-in-from-bottom duration-800 delay-400">
                Khám phá hàng ngàn{" "}
                <span className="font-semibold text-blue-600 animate-pulse">
                  templates chuyên nghiệp
                </span>{" "}
                và
                <span className="font-semibold text-purple-600 animate-pulse">
                  {" "}
                  e-books chất lượng cao
                </span>{" "}
                từ các chuyên gia hàng đầu
              </p>

              <div className="flex flex-col items-center justify-center gap-4 mt-8 sm:flex-row animate-in fade-in slide-in-from-bottom duration-800 delay-600">
                <Button
                  size="lg"
                  asChild
                  className="relative overflow-hidden transition-all duration-300 shadow-lg group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:scale-105 hover:shadow-2xl"
                >
                  <Link to="/templates">
                    <span className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-white/20 to-transparent group-hover:opacity-100"></span>
                    <Rocket className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                    Khám phá Templates
                    <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="transition-all duration-300 border-2 group backdrop-blur bg-white/20 dark:bg-slate-800/20 hover:scale-105 hover:bg-white/30 hover:border-purple-500"
                >
                  <Link to="/ebooks">
                    <BookOpen className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                    Xem E-books
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ✅ Enhanced Stats Section */}
        <section className="px-4 py-16 bg-muted/50" id="stats" data-animate>
          <div className="container mx-auto">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className={`group space-y-3 text-center transform transition-all duration-500 hover:scale-110 ${
                    isVisible.stats
                      ? "animate-in slide-in-from-bottom"
                      : "opacity-0"
                  }`}
                  style={{ animationDelay: stat.delay }}
                >
                  <div
                    className={`relative flex items-center justify-center w-16 h-16 mx-auto rounded-xl bg-gradient-to-r ${stat.color} shadow-lg group-hover:shadow-2xl transition-shadow duration-300`}
                  >
                    <stat.icon className="w-8 h-8 text-white group-hover:animate-pulse" />
                    <div className="absolute inset-0 transition-opacity duration-300 opacity-0 rounded-xl bg-white/20 group-hover:opacity-100"></div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-transparent md:text-4xl bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text">
                      {stat.value}
                    </div>
                    <div className="text-sm font-medium text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ✅ NEW: Featured Products Section */}
        <section className="px-4 py-16" id="featured-products" data-animate>
          <div className="container mx-auto">
            <div
              className={`mb-12 space-y-4 text-center transition-all duration-800 ${
                isVisible["featured-products"]
                  ? "animate-in slide-in-from-bottom"
                  : "opacity-0"
              }`}
            >
              <h2 className="text-3xl font-bold text-transparent md:text-4xl bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text">
                Sản phẩm nổi bật
              </h2>
              <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
                Những sản phẩm được yêu thích nhất từ cộng đồng developers và
                designers
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {sampleProducts.map((product, index) => (
                <Card
                  key={product.id}
                  className={`group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 border-0 bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 ${
                    isVisible["featured-products"]
                      ? "animate-in slide-in-from-bottom"
                      : "opacity-0"
                  }`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="object-cover w-full h-48 transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-black/50 to-transparent group-hover:opacity-100"></div>

                    {/* Discount Badge */}
                    {product.discount && (
                      <div className="absolute top-3 left-3">
                        <Badge className="font-bold text-white bg-red-500">
                          -{product.discount}%
                        </Badge>
                      </div>
                    )}

                    {/* Category Badge */}
                    <div className="absolute top-3 right-3">
                      <Badge
                        variant="secondary"
                        className="bg-white/90 backdrop-blur"
                      >
                        {product.category === "template"
                          ? "Template"
                          : "E-book"}
                      </Badge>
                    </div>

                    {/* Hover Actions */}
                    <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="bg-white/90 backdrop-blur"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Xem
                        </Button>
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <ShoppingCart className="w-4 h-4 mr-1" />
                          Mua
                        </Button>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6 space-y-4">
                    <div>
                      <h3 className="mb-2 text-lg font-semibold transition-colors group-hover:text-blue-600 line-clamp-2">
                        {product.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {product.description}
                      </p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {product.tags.slice(0, 3).map((tag, tagIndex) => (
                        <Badge
                          key={tagIndex}
                          variant="outline"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {product.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{product.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    {/* Rating & Stats */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-medium">{product.rating}</span>
                        <span>({product.reviews})</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Download className="w-4 h-4" />
                        <span>{product.downloads}</span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-green-600">
                            {product.price.toLocaleString("vi-VN")}đ
                          </span>
                          {product.originalPrice && (
                            <span className="text-sm line-through text-muted-foreground">
                              {product.originalPrice.toLocaleString("vi-VN")}đ
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          bởi {product.author}
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="group/btn">
                        <Heart className="w-4 h-4 transition-colors group-hover/btn:text-red-500" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* View All Button */}
            <div className="mt-12 text-center">
              <Button size="lg" variant="outline" asChild className="group">
                <Link to="/products">
                  Xem tất cả sản phẩm
                  <ExternalLink className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ✅ Enhanced Categories Section */}
        <section
          className="px-4 py-16 bg-muted/50"
          id="categories"
          data-animate
        >
          <div className="container mx-auto">
            <div
              className={`mb-12 space-y-4 text-center transition-all duration-800 ${
                isVisible.categories
                  ? "animate-in slide-in-from-bottom"
                  : "opacity-0"
              }`}
            >
              <h2 className="text-3xl font-bold text-transparent md:text-4xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                Danh mục sản phẩm
              </h2>
              <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
                Lựa chọn từ nhiều danh mục đa dạng phù hợp với nhu cầu của bạn
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {categories.map((category, index) => (
                <Card
                  key={index}
                  className={`group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 ${
                    isVisible.categories
                      ? "animate-in slide-in-from-bottom"
                      : "opacity-0"
                  }`}
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.title}
                      className="object-cover w-full h-48 transition-transform duration-500 group-hover:scale-110"
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-t ${category.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
                    ></div>
                    <div className="absolute top-4 right-4">
                      <Badge
                        variant="secondary"
                        className="font-semibold bg-white/90 backdrop-blur"
                      >
                        {category.count} sản phẩm
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4">
                      <Award className="w-6 h-6 text-white opacity-80" />
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3
                      className={`mb-2 text-xl font-semibold bg-gradient-to-r ${category.gradient} bg-clip-text text-transparent`}
                    >
                      {category.title}
                    </h3>
                    <p className="mb-4 text-muted-foreground">
                      {category.description}
                    </p>
                    <Button
                      variant="outline"
                      asChild
                      className={`group/btn transition-all duration-300 hover:bg-gradient-to-r ${category.gradient} hover:text-white hover:border-transparent`}
                    >
                      <Link to={category.href}>
                        Khám phá ngay
                        <ChevronRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ✅ Enhanced Features Section */}
        <section className="px-4 py-16" id="features" data-animate>
          <div className="container mx-auto">
            <div
              className={`mb-12 space-y-4 text-center transition-all duration-800 ${
                isVisible.features
                  ? "animate-in slide-in-from-bottom"
                  : "opacity-0"
              }`}
            >
              <h2 className="text-3xl font-bold text-transparent md:text-4xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text">
                Tại sao chọn chúng tôi?
              </h2>
              <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
                Chúng tôi cam kết mang đến cho bạn những sản phẩm tốt nhất với
                dịch vụ chuyên nghiệp
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className={`group p-6 text-center transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 border-0 bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 ${
                    isVisible.features
                      ? "animate-in slide-in-from-bottom"
                      : "opacity-0"
                  }`}
                  style={{ animationDelay: feature.delay }}
                >
                  <CardContent className="space-y-4">
                    <div
                      className={`relative flex items-center justify-center w-20 h-20 mx-auto rounded-2xl bg-gradient-to-r ${feature.color} shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110`}
                    >
                      <feature.icon className="w-10 h-10 text-white group-hover:animate-pulse" />
                      <div className="absolute inset-0 transition-opacity duration-300 opacity-0 rounded-2xl bg-white/20 group-hover:opacity-100"></div>
                    </div>
                    <h3 className="text-xl font-semibold transition-colors group-hover:text-purple-600">
                      {feature.title}
                    </h3>
                    <p className="leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ✅ Enhanced Testimonials Section */}
        <section
          className="px-4 py-16 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-purple-900"
          id="testimonials"
          data-animate
        >
          <div className="container mx-auto">
            <div
              className={`mb-12 space-y-4 text-center transition-all duration-800 ${
                isVisible.testimonials
                  ? "animate-in slide-in-from-bottom"
                  : "opacity-0"
              }`}
            >
              <h2 className="text-3xl font-bold md:text-4xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                Khách hàng nói gì về chúng tôi
              </h2>
              <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
                Hàng ngàn khách hàng trên toàn thế giới đã tin tưởng và hài lòng
                với sản phẩm của chúng tôi
              </p>
            </div>

            {/* Featured Testimonial */}
            <div
              className={`mb-12 transition-all duration-800 ${
                isVisible.testimonials
                  ? "animate-in slide-in-from-bottom"
                  : "opacity-0"
              }`}
            >
              <Card className="max-w-4xl p-8 mx-auto border-0 shadow-2xl bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-slate-900">
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-center">
                    <Quote className="w-12 h-12 text-blue-500 opacity-50" />
                  </div>

                  <blockquote className="text-xl font-medium leading-relaxed text-center text-gray-700 md:text-2xl dark:text-gray-300">
                    "{testimonials[currentTestimonial].content}"
                  </blockquote>

                  <div className="flex items-center justify-center mb-4 space-x-1">
                    {[...Array(testimonials[currentTestimonial].rating)].map(
                      (_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 text-yellow-400 fill-yellow-400"
                        />
                      ),
                    )}
                  </div>

                  <div className="flex items-center justify-center space-x-4">
                    <img
                      src={testimonials[currentTestimonial].avatar}
                      alt={testimonials[currentTestimonial].name}
                      className="object-cover w-16 h-16 border-4 border-white rounded-full shadow-lg"
                    />
                    <div className="text-center">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-semibold">
                          {testimonials[currentTestimonial].name}
                        </span>
                        <span className="text-2xl">
                          {testimonials[currentTestimonial].flag}
                        </span>
                        {testimonials[currentTestimonial].verified && (
                          <Badge
                            variant="secondary"
                            className="text-green-800 bg-green-100"
                          >
                            <Shield className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="font-medium text-purple-600">
                        {testimonials[currentTestimonial].role}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {testimonials[currentTestimonial].company}
                      </div>
                      <div className="flex items-center justify-center mt-1 space-x-2 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span>{testimonials[currentTestimonial].location}</span>
                        <Calendar className="w-3 h-3 ml-2" />
                        <span>{testimonials[currentTestimonial].date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <Badge
                      variant="outline"
                      className="text-blue-800 bg-blue-100"
                    >
                      <Package className="w-3 h-3 mr-1" />
                      {testimonials[currentTestimonial].projectType}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Testimonial Navigation */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial
                      ? "bg-blue-500 scale-125"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ✅ Enhanced CTA Section */}
        <section className="relative px-4 py-16 overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-black/10"></div>
            <div className="absolute w-32 h-32 rounded-full top-10 right-10 bg-white/10 animate-pulse"></div>
            <div className="absolute w-24 h-24 rounded-full bottom-10 left-10 bg-white/10 animate-pulse animation-delay-2000"></div>
          </div>

          <div className="container relative z-10 mx-auto text-center">
            <div className="max-w-2xl mx-auto space-y-6 text-white">
              <h2 className="text-3xl font-bold md:text-4xl animate-in slide-in-from-bottom duration-800">
                Bắt đầu hành trình của bạn ngay hôm nay
              </h2>
              <p className="text-lg delay-200 opacity-90 animate-in slide-in-from-bottom duration-800">
                Gia nhập cộng đồng hàng nghìn developers và designers đang sử
                dụng sản phẩm của chúng tôi
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row animate-in slide-in-from-bottom duration-800 delay-400">
                <Button
                  size="lg"
                  variant="secondary"
                  asChild
                  className="transition-all duration-300 group hover:scale-105 hover:shadow-2xl"
                >
                  <Link to="/auth/register">
                    Đăng ký miễn phí
                    <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-white transition-all duration-300 border-white group hover:bg-white hover:text-purple-600 hover:scale-105"
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
