import { useState, useEffect } from "react";
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/ProductCard";
import { TechStack, AnimatedBackground } from "@/components/AnimatedIcons";
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
} from "lucide-react";

const Index: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getFeaturedProducts();
      setFeaturedProducts(data);
    };
    fetchData();
  }, []);

  const stats = [
    { label: "Templates", value: "1000+", icon: Package },
    { label: "E-books", value: "500+", icon: BookOpen },
    { label: "Khách hàng", value: "50K+", icon: Users },
    { label: "Downloads", value: "1M+", icon: Download },
  ];

  const features = [
    {
      icon: Zap,
      title: "Chất lượng cao",
      description:
        "Tất cả sản phẩm đều được kiểm duyệt kỹ lưỡng về chất lượng và hiệu suất.",
    },
    {
      icon: Shield,
      title: "Bảo mật tuyệt đối",
      description:
        "Mã nguồn sạch, bảo mật và tuân thủ các tiêu chuẩn bảo mật hiện đại.",
    },
    {
      icon: HeartHandshake,
      title: "Hỗ trợ 24/7",
      description:
        "Đội ngũ hỗ trợ chuyên nghiệp sẵn sàng giúp đỡ bạn mọi lúc mọi nơi.",
    },
  ];

  const categories = [
    {
      title: "Templates Website",
      description: "Giao diện website chuyên nghiệp cho mọi ngành nghề",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
      count: "800+",
      href: "/templates",
    },
    {
      title: "E-books Programming",
      description: "Sách điện tử về lập trình và công nghệ",
      image:
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=250&fit=crop",
      count: "300+",
      href: "/ebooks",
    },
  ];

  const testimonials = [
    {
      name: "Nguyễn Văn A",
      role: "Frontend Developer",
      content:
        "Templates ở đây rất chất lượng và dễ tùy chỉnh. Đã giúp tôi tiết kiệm rất nhiều thời gian.",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      rating: 5,
    },
    {
      name: "Trần Thị B",
      role: "UI/UX Designer",
      content:
        "E-books về design rất hữu ích và cập nhật. Kiến thức thực tế và dễ áp dụng.",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      rating: 5,
    },
    {
      name: "Lê Văn C",
      role: "Full-stack Developer",
      content:
        "Nền tảng tuyệt vời với nhiều lựa chọn đa dạng. Hỗ trợ khách hàng rất tận tình.",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative px-4 py-20 overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
        <AnimatedBackground />
        <div className="container relative z-10 mx-auto text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="animate-in fade-in slide-in-from-bottom duration-800">
              <Badge
                variant="outline"
                className="mb-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur"
              >
                <Sparkles className="w-3 h-3 mr-1" />
                Chào mừng đến với Template Market
              </Badge>
            </div>

            <h1 className="text-4xl font-bold leading-tight text-transparent delay-200 md:text-7xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text animate-in fade-in slide-in-from-bottom duration-800">
              Template & E-book
              <br />
              <span className="inline-block hover:animate-pulse">Market</span>
            </h1>

            <p className="max-w-2xl mx-auto text-xl md:text-2xl text-muted-foreground animate-in fade-in slide-in-from-bottom duration-800 delay-400">
              Khám phá hàng ngàn templates chuyên nghiệp và e-books chất lượng
              cao từ các chuyên gia hàng đầu
            </p>

            <div className="flex flex-col items-center justify-center gap-4 mt-8 sm:flex-row animate-in fade-in slide-in-from-bottom duration-800 delay-600">
              <Button
                size="lg"
                asChild
                className="transition-transform shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:scale-105"
              >
                <Link to="/templates">
                  <Rocket className="w-5 h-5 mr-2" />
                  Khám phá Templates
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                asChild
                className="transition-transform border-2 backdrop-blur bg-white/20 dark:bg-slate-800/20 hover:scale-105"
              >
                <Link to="/ebooks">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Xem E-books
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      {/* Stats Section */}
      <section className="px-4 py-16 bg-muted/50">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-3 text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-lg bg-primary/10">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold md:text-3xl">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="px-4 py-16">
        <div className="container mx-auto">
          <div className="mb-12 space-y-4 text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
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
                className="overflow-hidden transition-all duration-200 group hover:shadow-lg"
              >
                <div className="relative">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="object-cover w-full h-48 transition-transform duration-200 group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary">{category.count} sản phẩm</Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="mb-2 text-xl font-semibold">
                    {category.title}
                  </h3>
                  <p className="mb-4 text-muted-foreground">
                    {category.description}
                  </p>
                  <Button
                    variant="outline"
                    asChild
                    className="transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
                  >
                    <Link to={category.href}>
                      Khám phá ngay
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="px-4 py-16 bg-muted/50">
        <div className="container mx-auto">
          <div className="mb-12 space-y-4 text-center">
            <h2 className="text-3xl font-bold md:text-4xl">Sản phẩm nổi bật</h2>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
              Những sản phẩm được đánh giá cao nhất và được ưa chuộng nhất
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center">
            <Button variant="outline" size="lg" asChild>
              <Link to="/templates">
                Xem tất cả sản phẩm
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="px-4 py-16">
        <div className="container mx-auto">
          <div className="mb-12 space-y-4 text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              Công nghệ chúng tôi hỗ trợ
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
              Tìm hiểu các công nghệ và framework được sử dụng trong templates
              của chúng tôi
            </p>
          </div>
          <TechStack />
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 bg-muted/50">
        <div className="container mx-auto">
          <div className="mb-12 space-y-4 text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
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
                className="p-6 text-center transition-shadow duration-200 hover:shadow-lg"
              >
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-lg bg-primary/10">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 py-16 bg-muted/50">
        <div className="container mx-auto">
          <div className="mb-12 space-y-4 text-center">
            <h2 className="text-3xl font-bold md:text-4xl">
              Khách hàng nói gì về chúng tôi
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
              Hàng ngàn khách hàng đã tin tưởng và hài lòng với sản phẩm của
              chúng tôi
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-yellow-400 fill-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="italic text-muted-foreground">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center space-x-3">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="object-cover w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 bg-primary">
        <div className="container mx-auto text-center">
          <div className="max-w-2xl mx-auto space-y-6 text-primary-foreground">
            <h2 className="text-3xl font-bold md:text-4xl">
              Bắt đầu hành trình của bạn ngay hôm nay
            </h2>
            <p className="text-lg opacity-90">
              Gia nhập cộng đồng hàng nghìn developers và designers đang sử dụng
              sản phẩm của chúng tôi
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/auth/register">
                  Đăng ký miễn phí
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                asChild
              >
                <Link to="/contact">Liên hệ với chúng tôi</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
