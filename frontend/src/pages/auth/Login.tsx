import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { LoginData } from "@/types";
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  ArrowRight,
  Shield,
  Sparkles,
  CheckCircle,
  Star,
  Trophy,
  LayoutGrid,
  Users,
  ArrowLeft,
  Heart,
  Rocket,
  Github,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingStage, setLoadingStage] = useState("");

  const from = location.state?.from?.pathname || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const emailValue = watch("email");

  // Pastel color schemes inspired by home page
  const pastelsSchemes = {
    main: "from-pink-50 via-blue-50 to-yellow-50",
    sectionBg: "from-pink-50/80 via-blue-50/60 to-yellow-50/80",
    cardBg: "from-white/95 via-pink-50/60 to-blue-50/40",
    button: "from-pink-400 via-orange-400 to-yellow-400",
    buttonHover: "from-pink-500 via-orange-500 to-yellow-500",
    textMain: "from-pink-600 via-blue-600 to-orange-600",
    textAccent: "from-orange-500 via-pink-500 to-yellow-500",
    iconPink: "from-pink-100 to-pink-200",
    iconBlue: "from-blue-100 to-cyan-200",
    iconYellow: "from-yellow-100 to-orange-200",
    iconGreen: "from-green-100 to-emerald-200",
    iconOrange: "from-orange-100 to-yellow-200",
  };

  const onSubmit = async (data: LoginData) => {
    if (!navigator.onLine) {
      setError("Không có kết nối internet. Vui lòng kiểm tra lại.");
      return;
    }

    setError("");
    setIsSubmitting(true);
    setLoadingStage("Đang kết nối...");

    const timeoutId = setTimeout(() => {
      setIsSubmitting(false);
      setLoadingStage("");
      setError("Đăng nhập quá lâu. Vui lòng thử lại.");
    }, 15000);

    try {
      setLoadingStage("Đang xác thực...");
      const success = await login(data.email, data.password);

      clearTimeout(timeoutId);

      if (success) {
        setLoadingStage("Đăng nhập thành công!");
        toast({
          title: "Đăng nhập thành công",
          description: "Chào mừng bạn quay lại!",
        });

        setTimeout(() => {
          navigate(from, { replace: true });
        }, 500);
      } else {
        setError("Email hoặc mật khẩu không chính xác");
      }
    } catch (error) {
      clearTimeout(timeoutId);
      console.error("Login error:", error);
      setError("Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.");
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
        setLoadingStage("");
      }, 1000);
    }
  };

  // Animation variants
  const textRevealVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100,
        staggerChildren: 0.08,
      },
    },
  };

  const itemSlideInVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Back to Home Button - Enhanced */}
      <div className="fixed z-50 top-3 left-3 sm:top-4 sm:left-4">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/")}
            className={`text-slate-700 shadow-xl border-0 bg-gradient-to-r ${pastelsSchemes.cardBg} backdrop-blur-sm hover:shadow-2xl transition-all duration-300 rounded-xl`}
          >
            <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline text-sm">Về trang chủ</span>
            <span className="sm:hidden text-xs">Home</span>
          </Button>
        </motion.div>
      </div>

      {/* Left Side - Enhanced Branding with Pastel Background - 60% Width - Hidden on Mobile */}
      <div
        className={`relative w-3/5 overflow-hidden bg-gradient-to-br ${pastelsSchemes.sectionBg} pastel-bg-pattern hidden lg:flex`}
      >
        {/* Floating Pastel Elements - Enhanced */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[
            {
              emoji: "🍪",
              position: "top-10 right-20",
              delay: 0,
              color: pastelsSchemes.iconOrange,
            },
            {
              emoji: "💖",
              position: "top-32 right-10",
              delay: 1,
              color: pastelsSchemes.iconPink,
            },
            {
              emoji: "🚀",
              position: "bottom-20 left-10",
              delay: 2,
              color: pastelsSchemes.iconBlue,
            },
            {
              emoji: "✨",
              position: "top-20 left-20",
              delay: 3,
              color: pastelsSchemes.iconYellow,
            },
            {
              emoji: "🎨",
              position: "bottom-32 right-32",
              delay: 4,
              color: pastelsSchemes.iconGreen,
            },
            {
              emoji: "🌟",
              position: "top-1/2 left-1/4",
              delay: 5,
              color: pastelsSchemes.iconPink,
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              className={`absolute ${item.position} text-2xl lg:text-4xl 3xl:text-5xl opacity-30`}
              animate={{
                y: [0, -15, 0],
                rotate: [0, 8, -8, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 6 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: item.delay,
              }}
            >
              <motion.div
                className={`p-2 lg:p-3 3xl:p-5 rounded-full bg-gradient-to-r ${item.color} backdrop-blur-sm shadow-lg animate-morph`}
                whileHover={{ scale: 1.2, rotate: 15 }}
              >
                <span className="animate-float">{item.emoji}</span>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Enhanced Background Shapes */}
        <motion.div
          className="absolute w-20 h-20 lg:w-28 lg:h-28 xl:w-32 xl:h-32 3xl:w-44 3xl:h-44 rounded-full bg-pink-400/20 blur-2xl animate-morph"
          style={{ top: "15%", left: "12%" }}
          animate={{
            y: [0, -20, 0],
            x: [0, 15, 0],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute rounded-full h-24 w-24 lg:h-32 lg:w-32 xl:h-36 xl:w-36 3xl:h-48 3xl:w-48 bg-blue-400/20 blur-2xl animate-morph"
          style={{ bottom: "15%", right: "15%" }}
          animate={{
            y: [0, 20, 0],
            x: [0, -15, 0],
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute w-16 h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 3xl:w-32 3xl:h-32 rounded-xl bg-yellow-400/20 blur-2xl animate-morph"
          style={{ top: "45%", right: "20%" }}
          animate={{
            y: [0, -25, 0],
            x: [0, 20, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.4, 1],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Main Content - Enhanced */}
        <motion.div
          className="relative z-10 flex flex-col justify-center px-4 lg:px-8 xl:px-12 3xl:px-24 text-slate-800 h-full"
          variants={textRevealVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Logo - Enhanced */}
          <motion.div
            variants={itemSlideInVariants}
            className="flex items-center mb-3 lg:mb-4 3xl:mb-8"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <LayoutGrid className="mr-2 lg:mr-3 3xl:mr-5 text-pink-600 h-6 w-6 lg:h-8 lg:w-8 3xl:h-16 3xl:w-16" />
            </motion.div>
            <div>
              <h1 className="text-lg lg:text-2xl xl:text-3xl 3xl:text-5xl font-extrabold tracking-tight animate-gentle-glow">
                <span className="animate-pastel-shift">Template Market</span>
              </h1>
              <p className="mt-1 text-xs lg:text-sm 3xl:text-xl text-pink-600/80">
                Welcome back to creativity
              </p>
            </div>
          </motion.div>

          {/* Main Heading - Enhanced */}
          <motion.h2
            variants={itemSlideInVariants}
            className="mb-2 lg:mb-3 3xl:mb-6 text-2xl lg:text-3xl xl:text-4xl 3xl:text-6xl font-bold leading-tight"
          >
            <span className="animate-gentle-glow">Chào mừng</span>
            <span
              className={`block bg-gradient-to-r ${pastelsSchemes.textMain} bg-clip-text text-transparent animate-pastel-shift`}
            >
              Trở lại!
            </span>
          </motion.h2>

          <motion.p
            variants={itemSlideInVariants}
            className="mb-3 lg:mb-4 3xl:mb-8 text-sm lg:text-base xl:text-lg 3xl:text-2xl leading-relaxed text-slate-700"
          >
            Tiếp tục hành trình sáng tạo với hàng nghìn template và e-book chất
            lượng cao
          </motion.p>

          {/* Features - Enhanced */}
          <motion.div
            variants={textRevealVariants}
            initial="hidden"
            animate="visible"
            className="mb-3 lg:mb-4 3xl:mb-8 space-y-2 3xl:space-y-4 text-xs lg:text-sm xl:text-base 3xl:text-xl"
          >
            {[
              {
                icon: CheckCircle,
                text: "Truy cập ngay vào thư viện templates cao cấp",
                color: "text-green-500",
              },
              {
                icon: Star,
                text: "Download không giới hạn tất cả sản phẩm",
                color: "text-yellow-500",
              },
              {
                icon: Shield,
                text: "Tài khoản được bảo mật tuyệt đối",
                color: "text-blue-500",
              },
              {
                icon: Users,
                text: "Tham gia cộng đồng 50,000+ designer",
                color: "text-purple-500",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={itemSlideInVariants}
                className="flex items-center group"
                whileHover={{ x: 5 }}
              >
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 15 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <feature.icon
                    className={`w-4 h-4 lg:w-5 lg:h-5 3xl:w-8 3xl:h-8 mr-2 lg:mr-3 3xl:mr-5 ${feature.color} flex-shrink-0 animate-soft-pulse`}
                  />
                </motion.div>
                <span className="group-hover:text-pink-600 transition-colors duration-300">
                  {feature.text}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Welcome Message - Enhanced & More Compact */}
          <motion.div
            className={`p-3 lg:p-4 3xl:p-8 border-0 rounded-xl 3xl:rounded-2xl bg-gradient-to-r ${pastelsSchemes.cardBg} backdrop-blur-sm shadow-xl border border-pink-200/50`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Trophy className="w-5 h-5 lg:w-6 lg:h-6 3xl:w-10 3xl:h-10 mr-2 lg:mr-3 3xl:mr-5 text-yellow-500" />
                </motion.div>
                <div>
                  <p className="text-sm lg:text-base xl:text-lg 3xl:text-2xl font-bold text-pink-600 animate-gentle-glow">
                    🎉 Chào mừng bạn trở lại!
                  </p>
                  <p className="text-xs lg:text-sm 3xl:text-xl text-slate-600 mt-1">
                    Hãy tiếp tục khám phá những template mới nhất và tạo ra
                    những tác phẩm tuyệt vời
                  </p>
                </div>
              </div>

              {/* Decorative elements - More compact */}
              <div className="flex flex-col space-y-1 3xl:space-y-2">
                {[Heart, Sparkles, Rocket].map((Icon, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      y: [0, -3, 0],
                      rotate: [0, 8, -8, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2 + i * 0.5,
                      repeat: Infinity,
                      delay: i * 0.3,
                    }}
                  >
                    <Icon className="w-3 h-3 lg:w-4 lg:h-4 3xl:w-7 3xl:h-7 text-pink-400 animate-soft-pulse" />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Side - Enhanced Login Form - 40% Width on Desktop, Full Width on Mobile */}
      <div
        className={`flex items-center justify-center w-full lg:w-2/5 px-4 sm:px-6 lg:px-3 xl:px-6 3xl:px-12 py-6 sm:py-8 lg:py-4 bg-gradient-to-br ${pastelsSchemes.main} overflow-hidden relative`}
      >
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className={`absolute w-20 h-20 3xl:w-40 3xl:h-40 rounded-full bg-gradient-to-r ${pastelsSchemes.iconPink} opacity-20 blur-2xl`}
            style={{ top: "10%", right: "10%" }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className={`absolute w-16 h-16 3xl:w-32 3xl:h-32 rounded-full bg-gradient-to-r ${pastelsSchemes.iconBlue} opacity-20 blur-2xl`}
            style={{ bottom: "20%", left: "15%" }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.5, 0.2],
              rotate: [0, 180, 360],
            }}
            transition={{ duration: 12, repeat: Infinity }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, x: 30, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2, type: "spring" }}
          className="w-full max-w-sm lg:max-w-sm 3xl:max-w-xl z-10"
        >
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card
              className={`p-6 sm:p-8 lg:p-4 xl:p-6 3xl:p-10 border-0 shadow-2xl rounded-2xl 3xl:rounded-3xl bg-gradient-to-br ${pastelsSchemes.cardBg} backdrop-blur-xl border border-pink-200/30 relative overflow-hidden`}
            >
              {/* Card decorative overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-pink-100/10 pointer-events-none" />

              <CardHeader className="mb-4 sm:mb-6 lg:mb-3 3xl:mb-8 text-center p-0 relative z-10">
                <div className="flex items-center justify-center mb-4 sm:mb-6 lg:mb-3 3xl:mb-8">
                  <motion.div
                    className={`flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 lg:w-10 lg:h-10 xl:w-12 xl:h-12 3xl:w-20 3xl:h-20 rounded-full shadow-xl bg-gradient-to-r ${pastelsSchemes.button} relative overflow-hidden`}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                    }}
                    whileHover={{ scale: 1.1, rotate: 15 }}
                  >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-subtle-shimmer" />

                    <motion.div
                      animate={{
                        rotate: [0, 360],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 8,
                        ease: "linear",
                        repeat: Infinity,
                      }}
                    >
                      <Shield className="w-6 h-6 sm:w-8 sm:h-8 lg:w-5 lg:h-5 xl:w-6 xl:h-6 3xl:w-10 3xl:h-10 text-white drop-shadow-lg" />
                    </motion.div>
                  </motion.div>
                </div>
                <CardTitle className="text-xl sm:text-2xl lg:text-lg xl:text-xl 3xl:text-3xl font-bold text-slate-800 animate-gentle-glow">
                  Chào mừng trở lại!
                </CardTitle>
                <CardDescription className="mt-2 text-sm sm:text-base lg:text-xs xl:text-sm 3xl:text-lg text-slate-600">
                  Đăng nhập để tiếp tục hành trình sáng tạo của bạn.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-0 relative z-10">
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4 sm:space-y-6 lg:space-y-3 xl:space-y-4 3xl:space-y-8"
                >
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Alert
                          variant="destructive"
                          className={`text-red-700 border-red-300 bg-gradient-to-r from-red-50 to-pink-50 shadow-lg rounded-xl`}
                        >
                          <AlertDescription className="text-sm 3xl:text-lg font-medium">
                            {error}
                          </AlertDescription>
                        </Alert>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Email Field - Enhanced */}
                  <div className="space-y-2 3xl:space-y-3">
                    <Label
                      htmlFor="email"
                      className="text-sm sm:text-base lg:text-xs xl:text-sm 3xl:text-lg font-medium text-slate-700"
                    >
                      Địa chỉ email
                    </Label>
                    <motion.div
                      className="relative group"
                      whileFocus={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Mail className="absolute w-4 h-4 sm:w-5 sm:h-5 lg:w-3 lg:h-3 xl:w-4 xl:h-4 3xl:w-6 3xl:h-6 text-slate-500 -translate-y-1/2 left-3 sm:left-4 lg:left-3 3xl:left-5 top-1/2 z-10 group-focus-within:text-pink-500 transition-all duration-300 group-focus-within:scale-110" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="example@email.com"
                        {...register("email")}
                        className={`h-10 sm:h-12 lg:h-8 xl:h-10 3xl:h-16 pl-10 sm:pl-12 lg:pl-8 xl:pl-10 3xl:pl-16 text-slate-800 text-sm sm:text-base lg:text-xs xl:text-sm 3xl:text-lg border-2 shadow-lg transition-all duration-300 rounded-lg 3xl:rounded-xl bg-gradient-to-r ${pastelsSchemes.cardBg} backdrop-blur-sm ${
                          errors.email
                            ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                            : "border-pink-200 focus:border-pink-400 hover:border-pink-300 focus:ring-pink-200"
                        } focus:ring-2 focus:ring-offset-0`}
                        disabled={isSubmitting}
                      />
                      {/* Enhanced checkmark with celebration effect */}
                      {!errors.email && emailValue && (
                        <motion.div
                          className="absolute right-3 sm:right-4 lg:right-2 xl:right-3 3xl:right-5 top-1/2 transform -translate-y-1/2"
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            delay: 0.1,
                          }}
                        >
                          <motion.div
                            className={`rounded-full p-1 shadow-lg bg-gradient-to-r ${pastelsSchemes.iconGreen}`}
                            whileHover={{ scale: 1.2 }}
                            animate={{
                              boxShadow: [
                                "0 0 0 0 rgba(34, 197, 94, 0.4)",
                                "0 0 0 10px rgba(34, 197, 94, 0)",
                              ],
                            }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 lg:w-3 lg:h-3 xl:w-4 xl:h-4 3xl:w-6 3xl:h-6 text-green-600" />
                          </motion.div>
                        </motion.div>
                      )}
                    </motion.div>
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-xs sm:text-sm 3xl:text-base text-red-600 font-medium"
                      >
                        {errors.email.message}
                      </motion.p>
                    )}
                  </div>

                  {/* Password Field - Enhanced */}
                  <div className="space-y-2 3xl:space-y-3">
                    <Label
                      htmlFor="password"
                      className="text-sm sm:text-base lg:text-xs xl:text-sm 3xl:text-lg font-medium text-slate-700"
                    >
                      Mật khẩu
                    </Label>
                    <motion.div
                      className="relative group"
                      whileFocus={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Lock className="absolute w-4 h-4 sm:w-5 sm:h-5 lg:w-3 lg:h-3 xl:w-4 xl:h-4 3xl:w-6 3xl:h-6 text-slate-500 -translate-y-1/2 left-3 sm:left-4 lg:left-3 3xl:left-5 top-1/2 z-10 group-focus-within:text-pink-500 transition-all duration-300 group-focus-within:scale-110" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Nhập mật khẩu"
                        {...register("password")}
                        className={`h-10 sm:h-12 lg:h-8 xl:h-10 3xl:h-16 pl-10 sm:pl-12 lg:pl-8 xl:pl-10 3xl:pl-16 pr-10 sm:pr-12 lg:pr-8 xl:pr-10 3xl:pr-16 text-slate-800 text-sm sm:text-base lg:text-xs xl:text-sm 3xl:text-lg border-2 shadow-lg transition-all duration-300 rounded-lg 3xl:rounded-xl bg-gradient-to-r ${pastelsSchemes.cardBg} backdrop-blur-sm ${
                          errors.password
                            ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                            : "border-pink-200 focus:border-pink-400 hover:border-pink-300 focus:ring-pink-200"
                        } focus:ring-2 focus:ring-offset-0`}
                        disabled={isSubmitting}
                      />
                      <motion.button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute text-slate-500 -translate-y-1/2 right-3 sm:right-4 lg:right-2 xl:right-3 3xl:right-5 top-1/2 hover:text-slate-700 transition-colors duration-200"
                        disabled={isSubmitting}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4 sm:w-5 sm:h-5 lg:w-3 lg:h-3 xl:w-4 xl:h-4 3xl:w-6 3xl:h-6" />
                        ) : (
                          <Eye className="w-4 h-4 sm:w-5 sm:h-5 lg:w-3 lg:h-3 xl:w-4 xl:h-4 3xl:w-6 3xl:h-6" />
                        )}
                      </motion.button>
                    </motion.div>
                    {errors.password && (
                      <motion.p
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-xs sm:text-sm 3xl:text-base text-red-600 font-medium"
                      >
                        {errors.password.message}
                      </motion.p>
                    )}
                  </div>

                  {/* Remember & Forgot - Enhanced */}
                  <div className="flex items-center justify-between">
                    <motion.div
                      className="flex items-center"
                      whileHover={{ x: 2 }}
                    >
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="w-4 h-4 sm:w-5 sm:h-5 lg:w-3 lg:h-3 xl:w-4 xl:h-4 3xl:w-6 3xl:h-6 text-pink-500 border-pink-300 rounded focus:ring-pink-500 bg-white"
                      />
                      <label
                        htmlFor="remember-me"
                        className="block ml-2 3xl:ml-3 text-sm sm:text-base lg:text-xs xl:text-sm 3xl:text-lg text-slate-700 font-medium cursor-pointer hover:text-pink-600 transition-colors"
                      >
                        Ghi nhớ đăng nhập
                      </label>
                    </motion.div>

                    <motion.div whileHover={{ x: 2 }}>
                      <Link
                        to="/auth/forgot-password"
                        className="text-sm sm:text-base lg:text-xs xl:text-sm 3xl:text-lg font-medium text-pink-600 hover:text-pink-700 transition-colors duration-200 hover:underline"
                      >
                        Quên mật khẩu?
                      </Link>
                    </motion.div>
                  </div>

                  {/* Submit Button - Enhanced */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Button
                      type="submit"
                      className={`group h-10 sm:h-12 lg:h-8 xl:h-10 3xl:h-16 w-full rounded-lg 3xl:rounded-xl bg-gradient-to-r ${pastelsSchemes.button} hover:${pastelsSchemes.buttonHover} font-bold text-white shadow-xl relative overflow-hidden text-sm sm:text-base lg:text-xs xl:text-sm 3xl:text-lg border-0 transition-all duration-300`}
                      disabled={isSubmitting}
                    >
                      {/* Button shimmer effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-subtle-shimmer" />

                      {/* Button glow effect */}
                      <motion.div
                        className="absolute inset-0 rounded-lg 3xl:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          background: `linear-gradient(45deg, ${pastelsSchemes.button})`,
                          filter: "blur(8px)",
                          transform: "scale(1.1)",
                        }}
                      />

                      <div className="relative z-10">
                        {isSubmitting ? (
                          <motion.div
                            className="flex items-center justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            >
                              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 lg:w-3 lg:h-3 xl:w-4 xl:h-4 3xl:w-6 3xl:h-6 mr-2 3xl:mr-3" />
                            </motion.div>
                            <span>{loadingStage || "Đang đăng nhập..."}</span>
                          </motion.div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <span>Đăng nhập</span>
                            <motion.div
                              className="ml-2 3xl:ml-3"
                              animate={{ x: [0, 3, 0] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 lg:w-3 lg:h-3 xl:w-4 xl:h-4 3xl:w-6 3xl:h-6" />
                            </motion.div>
                          </div>
                        )}
                      </div>
                    </Button>
                  </motion.div>
                </form>

                {/* Social Login - Enhanced with GitHub */}
                <div className="mt-4 sm:mt-6 lg:mt-3 xl:mt-4 3xl:mt-8">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-pink-200" />
                    </div>
                    <div className="relative flex justify-center text-xs sm:text-sm 3xl:text-base">
                      <span
                        className={`px-2 sm:px-3 3xl:px-4 text-slate-500 bg-gradient-to-r ${pastelsSchemes.cardBg} backdrop-blur-sm font-medium`}
                      >
                        Hoặc đăng nhập với
                      </span>
                    </div>
                  </div>

                  {/* Fixed Grid Layout - 3 Columns for Better Alignment */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-2 xl:gap-3 3xl:gap-5 mt-3 sm:mt-4 3xl:mt-6">
                    {[
                      {
                        name: "Google",
                        icon: null,
                        bgColor: "from-red-400 to-red-500",
                      },
                      {
                        name: "Facebook",
                        icon: null,
                        bgColor: "from-blue-400 to-blue-500",
                      },
                      {
                        name: "GitHub",
                        icon: Github,
                        bgColor: "from-gray-700 to-gray-800",
                      },
                    ].map((social, i) => (
                      <motion.div
                        key={social.name}
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant="outline"
                          className={`h-9 sm:h-10 lg:h-7 xl:h-9 3xl:h-12 w-full justify-center border-pink-200 bg-gradient-to-r ${pastelsSchemes.cardBg} text-slate-700 hover:border-pink-300 hover:bg-pink-50 active:scale-[0.98] text-xs sm:text-sm lg:text-xs xl:text-sm 3xl:text-base transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl relative overflow-hidden rounded-lg 3xl:rounded-xl`}
                          disabled={isSubmitting}
                        >
                          {/* Button hover glow */}
                          <div className="absolute inset-0 bg-gradient-to-r from-pink-100/50 to-blue-100/50 opacity-0 hover:opacity-100 transition-opacity duration-300" />
                          <div className="relative z-10 flex items-center justify-center">
                            {social.icon && (
                              <social.icon className="w-3 h-3 sm:w-4 sm:h-4 3xl:w-6 3xl:h-6 mr-1 3xl:mr-2" />
                            )}
                            <span className="font-medium truncate">
                              {social.name}
                            </span>
                          </div>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Register Link - Enhanced */}
                <motion.div
                  className="mt-4 sm:mt-6 lg:mt-3 xl:mt-4 3xl:mt-8 text-center"
                  whileHover={{ y: -1 }}
                >
                  <p className="text-sm sm:text-base lg:text-xs xl:text-sm 3xl:text-lg text-slate-600">
                    Chưa có tài khoản?{" "}
                    <Link
                      to="/auth/register"
                      className="font-bold text-pink-600 transition-colors hover:text-pink-700 hover:underline relative"
                    >
                      <span className="relative z-10">Đăng ký ngay</span>
                      <motion.div
                        className="absolute inset-0 bg-pink-100 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded"
                        style={{ transform: "scale(1.1)" }}
                      />
                    </Link>
                  </p>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Security Note - Enhanced */}
          <motion.div
            className="mt-3 sm:mt-4 lg:mt-2 xl:mt-3 3xl:mt-6 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <motion.p
              className={`text-xs sm:text-sm lg:text-xs 3xl:text-base text-slate-500 flex items-center justify-center space-x-1 3xl:space-x-2 rounded-full px-3 3xl:px-4 py-2 3xl:py-3 font-medium mx-auto w-fit bg-gradient-to-r ${pastelsSchemes.cardBg} backdrop-blur-sm shadow-lg`}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 lg:w-2 lg:h-2 xl:w-3 xl:h-3 3xl:w-5 3xl:h-5 text-emerald-500 animate-soft-pulse" />
              </motion.div>
              <span>Đăng nhập an toàn với mã hóa SSL 256-bit</span>
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
