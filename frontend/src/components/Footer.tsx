import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
  ExternalLink,
  Github,
  Linkedin,
  MessageCircle,
} from "lucide-react";

const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
      setEmail("");
    }, 1500);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const stats = [
    { label: "Khách hàng hài lòng", value: "50K+", icon: Users },
    { label: "Sản phẩm chất lượng", value: "1500+", icon: Award },
    { label: "Downloads", value: "1M+", icon: Download },
    { label: "Đánh giá 5 sao", value: "98%", icon: Star },
  ];

  const socialLinks = [
    {
      icon: Facebook,
      href: "#",
      label: "Facebook",
      color: "hover:text-blue-600",
    },
    { icon: Twitter, href: "#", label: "Twitter", color: "hover:text-sky-500" },
    {
      icon: Instagram,
      href: "#",
      label: "Instagram",
      color: "hover:text-pink-600",
    },
    { icon: Youtube, href: "#", label: "YouTube", color: "hover:text-red-600" },
    { icon: Github, href: "#", label: "GitHub", color: "hover:text-gray-900" },
    {
      icon: Linkedin,
      href: "#",
      label: "LinkedIn",
      color: "hover:text-blue-700",
    },
  ];

  const quickLinks = [
    { to: "/templates", label: "Templates", icon: "🎨" },
    { to: "/ebooks", label: "E-books", icon: "📚" },
    { to: "/about", label: "Giới thiệu", icon: "ℹ️" },
    { to: "/contact", label: "Liên hệ", icon: "📞" },
    { to: "/blog", label: "Blog", icon: "✍️" },
    { to: "/careers", label: "Tuyển dụng", icon: "💼" },
  ];

  const supportLinks = [
    { to: "/help", label: "Trung tâm trợ giúp", icon: "❓" },
    { to: "/faq", label: "Câu hỏi thường gặp", icon: "💬" },
    { to: "/privacy", label: "Chính sách bảo mật", icon: "🔒" },
    { to: "/terms", label: "Điều khoản sử dụng", icon: "📋" },
    { to: "/refund", label: "Chính sách hoàn tiền", icon: "💰" },
    { to: "/api", label: "API Documentation", icon: "⚡" },
  ];

  const categories = [
    { to: "/templates/react", label: "React Templates", count: "200+" },
    { to: "/templates/vue", label: "Vue Templates", count: "150+" },
    { to: "/templates/angular", label: "Angular Templates", count: "100+" },
    { to: "/ebooks/javascript", label: "JavaScript E-books", count: "80+" },
    { to: "/ebooks/python", label: "Python E-books", count: "60+" },
    { to: "/ebooks/design", label: "Design E-books", count: "40+" },
  ];

  return (
    <footer className="relative mt-auto overflow-hidden border-t bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
        <div className="absolute w-32 h-32 bg-blue-300 rounded-full top-10 right-10 mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute w-40 h-40 bg-purple-300 rounded-full bottom-10 left-10 mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="container relative z-10 px-4 py-16 mx-auto">
        {/* Stats Section */}
        <div className="mb-16">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="text-center transition-all duration-300 border-0 group bg-white/50 dark:bg-slate-800/50 backdrop-blur hover:shadow-lg hover:-translate-y-1"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 transition-transform duration-300 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 group-hover:scale-110">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Company Info */}
          <div className="space-y-6 lg:col-span-2">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-12 h-12 shadow-lg rounded-xl bg-gradient-to-r from-blue-500 to-purple-600">
                  <span className="text-xl font-bold text-white">TM</span>
                </div>
                <div>
                  <span className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                    Template Market
                  </span>
                  <div className="flex items-center mt-1 space-x-2">
                    <Badge variant="secondary" className="text-xs">
                      <Shield className="w-3 h-3 mr-1" />
                      Trusted Platform
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      <Award className="w-3 h-3 mr-1" />
                      Premium Quality
                    </Badge>
                  </div>
                </div>
              </div>

              <p className="leading-relaxed text-muted-foreground">
                Nền tảng hàng đầu cung cấp templates và e-books chất lượng cao
                cho developers và designers. Được tin tưởng bởi hơn 50,000 khách
                hàng trên toàn thế giới.
              </p>

              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                  <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-lg dark:bg-green-900">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <span>Hỗ trợ 24/7 chuyên nghiệp</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg dark:bg-blue-900">
                    <Zap className="w-4 h-4 text-blue-600" />
                  </div>
                  <span>Cập nhật sản phẩm thường xuyên</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                  <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-lg dark:bg-purple-900">
                    <Globe className="w-4 h-4 text-purple-600" />
                  </div>
                  <span>Phục vụ toàn cầu</span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-3">
              <h4 className="font-semibold">Kết nối với chúng tôi</h4>
              <div className="flex flex-wrap gap-2">
                {socialLinks.map((social, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className={`group transition-all duration-300 hover:scale-110 ${social.color}`}
                    asChild
                  >
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <social.icon className="w-4 h-4" />
                      <span className="sr-only">{social.label}</span>
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
              Liên kết nhanh
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.to}
                    className="flex items-center space-x-2 text-sm transition-all duration-300 text-muted-foreground hover:text-primary hover:translate-x-1 group"
                  >
                    <span className="text-base group-hover:animate-bounce">
                      {link.icon}
                    </span>
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-transparent bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text">
              Hỗ trợ
            </h3>
            <ul className="space-y-3">
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.to}
                    className="flex items-center space-x-2 text-sm transition-all duration-300 text-muted-foreground hover:text-primary hover:translate-x-1 group"
                  >
                    <span className="text-base group-hover:animate-bounce">
                      {link.icon}
                    </span>
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories & Newsletter */}
          <div className="space-y-6">
            {/* Popular Categories */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text">
                Danh mục phổ biến
              </h3>
              <ul className="space-y-2">
                {categories.map((category, index) => (
                  <li key={index}>
                    <Link
                      to={category.to}
                      className="flex items-center justify-between text-sm transition-colors text-muted-foreground hover:text-primary group"
                    >
                      <span className="transition-transform duration-300 group-hover:translate-x-1">
                        {category.label}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {category.count}
                      </Badge>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-transparent bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text">
                Liên hệ
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg dark:bg-blue-900">
                    <MapPin className="w-4 h-4 text-blue-600" />
                  </div>
                  <span>Hà Tu, Hạ Long, Quảng Ninh</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                  <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-lg dark:bg-green-900">
                    <Phone className="w-4 h-4 text-green-600" />
                  </div>
                  <span>+84 971 386 588</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                  <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-lg dark:bg-purple-900">
                    <Mail className="w-4 h-4 text-purple-600" />
                  </div>
                  <span>veutong961@gmail.com</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                  <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-lg dark:bg-orange-900">
                    <Clock className="w-4 h-4 text-orange-600" />
                  </div>
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div className="space-y-4">
              <h4 className="font-semibold">📧 Đăng ký nhận tin</h4>
              <p className="text-sm text-muted-foreground">
                Nhận thông báo về sản phẩm mới và ưu đãi đặc biệt
              </p>

              {!isSubscribed ? (
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <div className="flex space-x-2">
                    <Input
                      type="email"
                      placeholder="Email của bạn"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1"
                      required
                    />
                    <Button
                      type="submit"
                      size="sm"
                      disabled={isLoading}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Bằng cách đăng ký, bạn đồng ý với{" "}
                    <Link
                      to="/privacy"
                      className="text-primary hover:underline"
                    >
                      chính sách bảo mật
                    </Link>{" "}
                    của chúng tôi.
                  </p>
                </form>
              ) : (
                <div className="flex items-center p-3 space-x-2 bg-green-100 rounded-lg dark:bg-green-900">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-800 dark:text-green-200">
                    Cảm ơn bạn đã đăng ký!
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <Separator className="my-12" />

        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
          <div className="flex flex-col items-center space-y-2 md:flex-row md:space-y-0 md:space-x-4">
            <p className="text-sm text-muted-foreground">
              &copy; 2024 Template Market. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 animate-pulse" />
              <span>in Vietnam</span>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex space-x-4 text-sm">
              <Link
                to="/privacy"
                className="transition-colors text-muted-foreground hover:text-primary"
              >
                Chính sách bảo mật
              </Link>
              <Link
                to="/terms"
                className="transition-colors text-muted-foreground hover:text-primary"
              >
                Điều khoản
              </Link>
              <Link
                to="/cookies"
                className="transition-colors text-muted-foreground hover:text-primary"
              >
                Cookie
              </Link>
            </div>

            {/* Back to Top Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={scrollToTop}
              className="transition-all duration-300 group hover:scale-110"
            >
              <ArrowUp className="w-4 h-4 group-hover:animate-bounce" />
              <span className="sr-only">Back to top</span>
            </Button>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex items-center justify-center mt-8 space-x-6">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4 text-green-500" />
            <span>SSL Secured</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Award className="w-4 h-4 text-blue-500" />
            <span>Premium Quality</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4 text-purple-500" />
            <span>50K+ Happy Customers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
