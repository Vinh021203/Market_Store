import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  ArrowLeft,
  Search,
  Package,
  BookOpen,
  Sparkles,
  Coffee,
  Code,
  Palette,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  MessageCircle,
  Mail,
  Phone,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const NotFound: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);
  const [showCountdown, setShowCountdown] = useState(false);

  useEffect(() => {
    // ✅ Enhanced logging với timestamp
    console.error(
      `404 Error [${new Date().toISOString()}]: User attempted to access non-existent route:`,
      location.pathname,
      {
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        timestamp: Date.now(),
      },
    );

    // ✅ Show toast notification
    toast({
      title: "⚠️ Trang không tồn tại",
      description: `Đường dẫn "${location.pathname}" không được tìm thấy.`,
      variant: "destructive",
    });

    // ✅ Auto redirect countdown
    const timer = setTimeout(() => {
      setShowCountdown(true);
      const countdownTimer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownTimer);
            navigate("/");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdownTimer);
    }, 5000);

    return () => clearTimeout(timer);
  }, [location.pathname, navigate]);

  const quickLinks = [
    {
      title: "Templates",
      description: "Khám phá bộ sưu tập templates",
      href: "/templates",
      icon: Package,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "E-books",
      description: "Tài liệu học tập chất lượng",
      href: "/ebooks",
      icon: BookOpen,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Blog",
      description: "Bài viết và hướng dẫn",
      href: "/blog",
      icon: MessageCircle,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Liên hệ",
      description: "Hỗ trợ và tư vấn",
      href: "/contact",
      icon: Mail,
      color: "from-orange-500 to-red-500",
    },
  ];

  const handleRefresh = () => {
    window.location.reload();
    toast({
      title: "🔄 Đang tải lại trang",
      description: "Vui lòng đợi trong giây lát...",
    });
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
      {/* Floating Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 animate-float">
          <AlertTriangle className="w-8 h-8 text-red-500 opacity-20" />
        </div>
        <div className="absolute top-1/3 right-1/4 animate-float-delay-1">
          <Search className="w-6 h-6 text-blue-500 opacity-20" />
        </div>
        <div className="absolute bottom-1/4 left-1/3 animate-float-delay-2">
          <Coffee className="text-orange-500 w-7 h-7 opacity-20" />
        </div>
      </div>

      <div className="container relative z-10 px-4 py-8 mx-auto">
        <div className="max-w-4xl mx-auto">
          {/* ✅ Enhanced 404 Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
            className="mb-12 text-center"
          >
            <motion.div
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="relative mb-8"
            >
              <h1 className="font-bold text-transparent text-9xl bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-clip-text">
                404
              </h1>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute flex items-center justify-center w-16 h-16 rounded-full -top-4 -right-4 bg-gradient-to-r from-yellow-400 to-orange-500"
              >
                <Sparkles className="w-8 h-8 text-white" />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                Oops! Trang không tồn tại
              </h2>
              <p className="max-w-md mx-auto text-lg text-muted-foreground">
                Trang bạn đang tìm kiếm có thể đã được di chuyển, xóa hoặc không
                bao giờ tồn tại.
              </p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="inline-flex items-center px-4 py-2 space-x-2 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/20"
              >
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span className="font-mono text-sm text-red-700 dark:text-red-300">
                  {location.pathname}
                </span>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* ✅ Enhanced Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col justify-center gap-4 mb-12 sm:flex-row"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                asChild
                size="lg"
                className="shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <Link to="/">
                  <Home className="w-5 h-5 mr-2" />
                  Về trang chủ
                </Link>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="lg"
                onClick={handleGoBack}
                className="group"
              >
                <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
                Quay lại
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="lg"
                onClick={handleRefresh}
                className="group"
              >
                <RefreshCw className="w-5 h-5 mr-2 group-hover:animate-spin" />
                Tải lại
              </Button>
            </motion.div>
          </motion.div>

          {/* ✅ Enhanced Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="mb-12"
          >
            <div className="mb-8 text-center">
              <h3 className="mb-4 text-2xl font-bold text-transparent bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text">
                Có thể bạn đang tìm kiếm?
              </h3>
              <p className="text-muted-foreground">
                Khám phá những trang phổ biến nhất của chúng tôi
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {quickLinks.map((link, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <Card className="h-full transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 hover:shadow-xl group">
                    <CardContent className="p-6 space-y-4 text-center">
                      <div
                        className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-r ${link.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                      >
                        <link.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="mb-2 text-lg font-semibold transition-colors group-hover:text-primary">
                          {link.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {link.description}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="w-full transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
                      >
                        <Link to={link.href}>
                          Khám phá
                          <ExternalLink className="w-3 h-3 ml-2" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ✅ Enhanced Search Suggestion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="mb-12"
          >
            <Card className="border-0 shadow-lg bg-gradient-to-r from-white to-blue-50 dark:from-slate-800 dark:to-blue-900">
              <CardContent className="p-8 text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                    <Search className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="mb-4 text-xl font-semibold">
                  Tìm kiếm những gì bạn cần
                </h3>
                <p className="mb-6 text-muted-foreground">
                  Sử dụng tính năng tìm kiếm để tìm templates, e-books hoặc bài
                  viết
                </p>
                <div className="max-w-md mx-auto">
                  <div className="relative">
                    <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm..."
                      className="w-full py-3 pl-10 pr-4 transition-all duration-300 border rounded-lg focus:ring-2 focus:ring-primary/20"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          const query = (e.target as HTMLInputElement).value;
                          if (query.trim()) {
                            navigate(`/search?q=${encodeURIComponent(query)}`);
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* ✅ Enhanced Auto Redirect Countdown */}
          <AnimatePresence>
            {showCountdown && countdown > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center"
              >
                <Card className="inline-block border-0 shadow-lg bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <RefreshCw className="w-5 h-5 text-orange-500" />
                      </motion.div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Tự động chuyển về trang chủ sau{" "}
                          <motion.span
                            key={countdown}
                            initial={{ scale: 1.2, color: "#f97316" }}
                            animate={{ scale: 1, color: "#6b7280" }}
                            className="font-bold"
                          >
                            {countdown}
                          </motion.span>{" "}
                          giây
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ✅ Enhanced Help Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
            className="mt-12 text-center"
          >
            <p className="mb-4 text-muted-foreground">
              Vẫn không tìm thấy những gì bạn cần?
            </p>
            <div className="flex justify-center space-x-4">
              <Button variant="outline" size="sm" asChild>
                <Link to="/contact">
                  <Mail className="w-4 h-4 mr-2" />
                  Liên hệ hỗ trợ
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="mailto:support@templatemarket.com">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Gửi email
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
