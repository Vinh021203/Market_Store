import React, { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  ArrowLeft,
  Search,
  Package,
  BookOpen,
  Sparkles,
  AlertTriangle,
  RefreshCw,
  MessageCircle,
  Mail,
  Heart,
  Star,
  Zap,
  Gift,
  Rocket,
  Crown,
  Award,
  Code,
  Palette,
  Coffee,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const NotFound: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);
  const [showCountdown, setShowCountdown] = useState(false);

  useEffect(() => {
    console.error(
      `404 Error [${new Date().toISOString()}]: User attempted to access non-existent route:`,
      location.pathname,
    );

    toast({
      title: "⚠️ Trang không tồn tại",
      description: `Đường dẫn "${location.pathname}" không được tìm thấy.`,
      variant: "destructive",
    });

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

  // FLOATING ICONS - GIỮ NGUYÊN
  const floatingIcons = [
    {
      icon: Package,
      color: "text-pink-400/30",
      x: "8%",
      y: "12%",
      size: "w-12 h-12",
      delay: 0,
    },
    {
      icon: Code,
      color: "text-rose-400/30",
      x: "88%",
      y: "18%",
      size: "w-10 h-10",
      delay: 0.5,
    },
    {
      icon: Sparkles,
      color: "text-pink-300/30",
      x: "12%",
      y: "75%",
      size: "w-14 h-14",
      delay: 1,
    },
    {
      icon: Heart,
      color: "text-rose-400/30",
      x: "85%",
      y: "68%",
      size: "w-11 h-11",
      delay: 1.5,
    },
    {
      icon: Star,
      color: "text-red-400/30",
      x: "50%",
      y: "8%",
      size: "w-9 h-9",
      delay: 2,
    },
    {
      icon: Zap,
      color: "text-pink-500/30",
      x: "18%",
      y: "42%",
      size: "w-10 h-10",
      delay: 2.5,
    },
    {
      icon: Gift,
      color: "text-rose-300/30",
      x: "78%",
      y: "88%",
      size: "w-12 h-12",
      delay: 3,
    },
    {
      icon: Crown,
      color: "text-red-300/30",
      x: "35%",
      y: "85%",
      size: "w-11 h-11",
      delay: 3.5,
    },
    {
      icon: Rocket,
      color: "text-pink-400/30",
      x: "92%",
      y: "48%",
      size: "w-13 h-13",
      delay: 4,
    },
    {
      icon: Award,
      color: "text-rose-500/30",
      x: "28%",
      y: "22%",
      size: "w-10 h-10",
      delay: 4.5,
    },
    {
      icon: Coffee,
      color: "text-pink-300/30",
      x: "65%",
      y: "35%",
      size: "w-9 h-9",
      delay: 5,
    },
    {
      icon: Palette,
      color: "text-red-400/30",
      x: "42%",
      y: "60%",
      size: "w-11 h-11",
      delay: 5.5,
    },
  ];

  const quickLinks = [
    {
      title: "Templates",
      description: "2,500+ mẫu website chất lượng",
      href: "/templates",
      icon: Package,
      iconColor: "text-pink-600",
      iconBg: "from-pink-100 to-rose-200",
    },
    {
      title: "E-books",
      description: "1,200+ tài liệu học tập",
      href: "/ebooks",
      icon: BookOpen,
      iconColor: "text-rose-600",
      iconBg: "from-rose-100 to-red-200",
    },
    {
      title: "Blog",
      description: "Bài viết và hướng dẫn",
      href: "/blog",
      icon: MessageCircle,
      iconColor: "text-red-600",
      iconBg: "from-red-100 to-pink-200",
    },
    {
      title: "Liên hệ",
      description: "Hỗ trợ 24/7",
      href: "/contact",
      icon: Mail,
      iconColor: "text-pink-700",
      iconBg: "from-pink-100 to-rose-100",
    },
  ];

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGoBack = () => {
    window.history.length > 1 ? navigate(-1) : navigate("/");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-pink-50/70 via-rose-50/60 to-red-50/50">
      {/* BACKGROUND PATTERNS - MÀU SOFT PINK */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,207,232,0.4),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(252,165,165,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(254,202,202,0.3),transparent_70%)]" />
      </div>

      {/* FLOATING ICONS - GIỮ NGUYÊN */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {floatingIcons.map((item, index) => (
          <motion.div
            key={index}
            className="absolute"
            style={{
              left: item.x,
              top: item.y,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0.4, 0.7, 0.4],
              scale: [1, 1.15, 1],
              y: [0, -25, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 5 + index * 0.3,
              repeat: Infinity,
              delay: item.delay,
              ease: "easeInOut",
            }}
          >
            <item.icon
              className={`${item.size} ${item.color} drop-shadow-sm`}
            />
          </motion.div>
        ))}
      </div>

      {/* GRADIENT OVERLAYS - MÀU SOFT PINK */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-pink-200/20 rounded-full filter blur-3xl animate-pulse" />
        <div
          className="absolute bottom-0 right-0 w-96 h-96 bg-rose-200/20 rounded-full filter blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-200/20 rounded-full filter blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="container relative z-10 px-4 py-16 mx-auto">
        <div className="max-w-5xl mx-auto">
          {/* 404 HERO */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="mb-16 text-center"
          >
            <motion.div
              className="relative inline-block mb-8"
              initial={{ y: -30 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
            >
              <h1 className="relative font-black text-9xl md:text-[12rem] text-transparent bg-gradient-to-br from-pink-500 via-rose-500 to-red-500 bg-clip-text drop-shadow-2xl">
                404
              </h1>

              {/* Animated badge */}
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-8 -right-8 w-20 h-20 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center shadow-2xl"
              >
                <Sparkles className="w-10 h-10 text-white" />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6 max-w-2xl mx-auto"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 bg-clip-text">
                Oops! Trang không tồn tại
              </h2>
              <p className="text-lg md:text-xl text-slate-600 leading-relaxed">
                Trang bạn đang tìm kiếm có thể đã được di chuyển, xóa hoặc chưa
                bao giờ tồn tại.
              </p>

              {/* Path display */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm border-2 border-pink-200 rounded-2xl shadow-lg"
              >
                <AlertTriangle className="w-5 h-5 text-pink-600" />
                <span className="font-mono text-sm md:text-base text-pink-700 font-medium">
                  {location.pathname}
                </span>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* ACTION BUTTONS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row justify-center gap-4 mb-16"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto px-8 py-6 text-lg font-bold shadow-xl bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 hover:from-pink-600 hover:via-rose-600 hover:to-red-600 text-white border-0 rounded-2xl"
              >
                <Link to="/">
                  <Home className="w-6 h-6 mr-2" />
                  Về trang chủ
                </Link>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                onClick={handleGoBack}
                className="w-full sm:w-auto px-8 py-6 text-lg font-bold bg-white hover:bg-pink-50 border-2 border-pink-300 text-slate-700 rounded-2xl shadow-lg group"
              >
                <ArrowLeft className="w-6 h-6 mr-2 transition-transform group-hover:-translate-x-1" />
                Quay lại
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                onClick={handleRefresh}
                className="w-full sm:w-auto px-8 py-6 text-lg font-bold bg-white hover:bg-rose-50 border-2 border-rose-300 text-slate-700 rounded-2xl shadow-lg group"
              >
                <RefreshCw className="w-6 h-6 mr-2 group-hover:animate-spin" />
                Tải lại
              </Button>
            </motion.div>
          </motion.div>

          {/* QUICK LINKS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-16"
          >
            <div className="text-center mb-10">
              <h3 className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 bg-clip-text">
                Có thể bạn đang tìm kiếm?
              </h3>
              <p className="text-lg text-slate-600">
                Khám phá những trang phổ biến nhất
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickLinks.map((link, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link to={link.href}>
                    <Card className="h-full bg-white/90 backdrop-blur-sm border-2 border-pink-100 hover:border-pink-300 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl group overflow-hidden">
                      <CardContent className="p-6 text-center space-y-4">
                        {/* Icon */}
                        <div className="relative mx-auto w-16 h-16">
                          <div
                            className={`absolute inset-0 bg-gradient-to-r ${link.iconBg} rounded-2xl transform transition-transform group-hover:scale-110 group-hover:rotate-6 shadow-lg`}
                          />
                          <div className="relative w-full h-full flex items-center justify-center">
                            <link.icon
                              className={`w-8 h-8 ${link.iconColor}`}
                              strokeWidth={2.5}
                            />
                          </div>
                        </div>

                        {/* Content */}
                        <div>
                          <h4 className="text-xl font-bold mb-2 text-slate-800 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-pink-600 group-hover:to-rose-600 group-hover:bg-clip-text transition-all">
                            {link.title}
                          </h4>
                          <p className="text-sm text-slate-600 leading-relaxed">
                            {link.description}
                          </p>
                        </div>

                        {/* Hover indicator */}
                        <div className="pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="text-sm font-semibold text-transparent bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text">
                            Khám phá →
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* SEARCH BOX */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mb-12"
          >
            <Card className="bg-white/90 backdrop-blur-sm border-2 border-pink-100 shadow-xl rounded-3xl overflow-hidden">
              <CardContent className="p-8 md:p-10 text-center">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-100 to-rose-200 flex items-center justify-center shadow-lg">
                    <Search className="w-8 h-8 text-pink-600" />
                  </div>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-transparent bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text">
                  Tìm kiếm những gì bạn cần
                </h3>
                <p className="text-lg text-slate-600 mb-8">
                  Sử dụng tính năng tìm kiếm để tìm templates, e-books hoặc bài
                  viết
                </p>
                <div className="max-w-xl mx-auto">
                  <div className="relative group">
                    <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-pink-600 transition-colors" />
                    <input
                      type="text"
                      placeholder="Nhập từ khóa tìm kiếm..."
                      className="w-full py-4 pl-14 pr-5 text-lg bg-white border-2 border-pink-200 rounded-2xl focus:ring-4 focus:ring-pink-400/20 focus:border-pink-400 transition-all text-slate-700 placeholder:text-slate-400"
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

          {/* COUNTDOWN */}
          <AnimatePresence>
            {showCountdown && countdown > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center"
              >
                <div className="inline-block bg-white/90 backdrop-blur-sm border-2 border-pink-200 rounded-2xl shadow-xl px-8 py-6">
                  <div className="flex items-center gap-4">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <RefreshCw className="w-6 h-6 text-pink-500" />
                    </motion.div>
                    <p className="text-lg text-slate-700">
                      Tự động chuyển về trang chủ sau{" "}
                      <motion.span
                        key={countdown}
                        initial={{ scale: 1.3, color: "#ec4899" }}
                        animate={{ scale: 1, color: "#64748b" }}
                        className="font-bold text-xl"
                      >
                        {countdown}
                      </motion.span>{" "}
                      giây
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* HELP SECTION */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="mt-16 text-center"
          >
            <p className="text-lg text-slate-600 mb-6">
              Vẫn không tìm thấy những gì bạn cần?
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                size="lg"
                asChild
                className="bg-white hover:bg-pink-50 border-2 border-pink-300 text-slate-700 rounded-xl shadow-lg"
              >
                <Link to="/contact">
                  <Mail className="w-5 h-5 mr-2" />
                  Liên hệ hỗ trợ
                </Link>
              </Button>
              <Button
                size="lg"
                asChild
                className="bg-white hover:bg-rose-50 border-2 border-rose-300 text-slate-700 rounded-xl shadow-lg"
              >
                <a href="mailto:veutong961@gmail.com">
                  <MessageCircle className="w-5 h-5 mr-2" />
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
