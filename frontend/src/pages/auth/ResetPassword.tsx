import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
  Shield,
  Key,
  AlertTriangle,
  XCircle,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

type ResetPasswordData = z.infer<typeof resetPasswordSchema>;

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);
  const [error, setError] = useState("");

  // Enhanced pastel color schemes for ResetPassword (Green theme)
  const pastelsSchemes = {
    main: "from-emerald-50 via-green-50 to-teal-50",
    sectionBg: "from-emerald-50/80 via-green-50/60 to-teal-50/80",
    cardBg: "from-white/98 via-slate-50/95 to-white/98",
    cardBorder: "border-slate-200/50",
    buttonSuccess: "from-emerald-500 via-green-500 to-teal-500",
    buttonSuccessHover: "from-emerald-600 via-green-600 to-teal-600",
    buttonPrimary: "from-blue-500 via-indigo-500 to-purple-500",
    buttonPrimaryHover: "from-blue-600 via-indigo-600 to-purple-600",
    buttonError: "from-rose-500 via-red-500 to-pink-500",
    buttonErrorHover: "from-rose-600 via-red-600 to-pink-600",
    buttonSecondary: "from-slate-100 via-gray-100 to-slate-100",
    buttonSecondaryHover: "from-slate-200 via-gray-200 to-slate-200",
    iconPink: "from-emerald-100 to-emerald-200",
    iconBlue: "from-teal-100 to-cyan-200",
    iconYellow: "from-green-100 to-lime-200",
    iconGreen: "from-emerald-100 to-green-200",
    iconOrange: "from-lime-100 to-yellow-200",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    const handlePasswordReset = async () => {
      // Lấy code từ URL parameters
      const code = searchParams.get("code");

      if (!code) {
        setError("Link đặt lại mật khẩu không hợp lệ.");
        setIsValidating(false);
        return;
      }

      try {
        // ✅ CÁCH 1: Exchange code for session (PKCE flow - Recommended)
        const { data, error } =
          await supabase.auth.exchangeCodeForSession(code);

        if (error) throw error;

        if (data.session) {
          setIsValidToken(true);
          console.log("Password reset session established");
        } else {
          setError("Không thể tạo phiên đăng nhập.");
        }
      } catch (error: any) {
        console.error("Token validation error:", error);
        setError("Link đặt lại mật khẩu đã hết hạn hoặc không hợp lệ.");
      } finally {
        setIsValidating(false);
      }
    };

    handlePasswordReset();
  }, [searchParams]);

  const onSubmit = async (data: ResetPasswordData) => {
    setIsSubmitting(true);
    setError("");

    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) throw error;

      toast({
        title: "🎉 Đặt lại mật khẩu thành công!",
        description: "Mật khẩu của bạn đã được cập nhật.",
      });

      // Sign out and redirect to login
      await supabase.auth.signOut();

      setTimeout(() => {
        navigate("/auth/login?reset=success");
      }, 2000);
    } catch (error: any) {
      console.error("Reset password error:", error);
      setError("Có lỗi xảy ra khi đặt lại mật khẩu. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ LOADING STATE với pastel design
  if (isValidating) {
    return (
      <div className="h-screen flex overflow-hidden">
        <div
          className={`flex items-center justify-center w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 bg-gradient-to-br ${pastelsSchemes.main} overflow-hidden relative pastel-bg-pattern`}
        >
          {/* Floating Pastel Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[
              {
                emoji: "🔑",
                position: "top-10 right-20",
                delay: 0,
                color: pastelsSchemes.iconBlue,
              },
              {
                emoji: "⏳",
                position: "top-32 right-10",
                delay: 1,
                color: pastelsSchemes.iconYellow,
              },
              {
                emoji: "🔐",
                position: "bottom-20 left-10",
                delay: 2,
                color: pastelsSchemes.iconOrange,
              },
              {
                emoji: "✨",
                position: "top-20 left-20",
                delay: 3,
                color: pastelsSchemes.iconGreen,
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                className={`absolute ${item.position} text-2xl lg:text-3xl 3xl:text-4xl opacity-30`}
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
                  className={`p-2 lg:p-3 3xl:p-4 rounded-full bg-gradient-to-r ${item.color} backdrop-blur-sm shadow-lg animate-morph`}
                  whileHover={{ scale: 1.2, rotate: 15 }}
                >
                  <span className="animate-float">{item.emoji}</span>
                </motion.div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md 3xl:max-w-lg z-10"
          >
            <Card
              className={`p-6 sm:p-7 3xl:p-8 border shadow-2xl rounded-2xl 3xl:rounded-3xl bg-gradient-to-br ${pastelsSchemes.cardBg} backdrop-blur-xl ${pastelsSchemes.cardBorder} relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-slate-50/5 pointer-events-none" />

              <CardContent className="p-0 relative z-10 text-center">
                <motion.div
                  className={`flex items-center justify-center w-16 h-16 3xl:w-20 3xl:h-20 mx-auto mb-4 3xl:mb-6 rounded-full shadow-xl bg-gradient-to-r ${pastelsSchemes.buttonPrimary} relative overflow-hidden`}
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-subtle-shimmer" />
                  <Key className="w-8 h-8 3xl:w-10 3xl:h-10 text-white" />
                </motion.div>
                <h2 className="mb-2 3xl:mb-3 text-xl 3xl:text-2xl font-bold text-slate-800 animate-gentle-glow">
                  Đang xác thực...
                </h2>
                <p className="text-sm 3xl:text-base text-slate-700">
                  Vui lòng đợi trong giây lát
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  // ✅ ERROR STATE với pastel design
  if (!isValidToken) {
    return (
      <div className="h-screen flex overflow-hidden">
        {/* Back to Home Button */}
        <div className="fixed z-50 top-3 left-3 sm:top-4 sm:left-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/")}
              className={`text-slate-700 shadow-xl border-0 bg-gradient-to-r ${pastelsSchemes.cardBg} backdrop-blur-sm hover:shadow-2xl transition-all duration-300 rounded-xl ${pastelsSchemes.cardBorder}`}
            >
              <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline text-sm">Về trang chủ</span>
              <span className="sm:hidden text-xs">Home</span>
            </Button>
          </motion.div>
        </div>

        <div
          className={`flex items-center justify-center w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 bg-gradient-to-br ${pastelsSchemes.main} overflow-hidden relative pastel-bg-pattern`}
        >
          {/* Floating Pastel Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[
              {
                emoji: "❌",
                position: "top-10 right-20",
                delay: 0,
                color: pastelsSchemes.iconOrange,
              },
              {
                emoji: "🔒",
                position: "top-32 right-10",
                delay: 1,
                color: pastelsSchemes.iconBlue,
              },
              {
                emoji: "⚠️",
                position: "bottom-20 left-10",
                delay: 2,
                color: pastelsSchemes.iconYellow,
              },
              {
                emoji: "🔄",
                position: "top-20 left-20",
                delay: 3,
                color: pastelsSchemes.iconGreen,
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                className={`absolute ${item.position} text-2xl lg:text-3xl 3xl:text-4xl opacity-30`}
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
                  className={`p-2 lg:p-3 3xl:p-4 rounded-full bg-gradient-to-r ${item.color} backdrop-blur-sm shadow-lg animate-morph`}
                  whileHover={{ scale: 1.2, rotate: 15 }}
                >
                  <span className="animate-float">{item.emoji}</span>
                </motion.div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md 3xl:max-w-lg z-10"
          >
            <Card
              className={`p-6 sm:p-7 3xl:p-8 border shadow-2xl rounded-2xl 3xl:rounded-3xl bg-gradient-to-br ${pastelsSchemes.cardBg} backdrop-blur-xl ${pastelsSchemes.cardBorder} relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-slate-50/5 pointer-events-none" />

              <CardContent className="p-0 relative z-10 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className={`flex items-center justify-center w-16 h-16 3xl:w-20 3xl:h-20 mx-auto mb-4 3xl:mb-6 rounded-full shadow-xl bg-gradient-to-r ${pastelsSchemes.buttonError}`}
                >
                  <XCircle className="w-8 h-8 3xl:w-10 3xl:h-10 text-white" />
                </motion.div>
                <h2 className="mb-4 3xl:mb-6 text-xl 3xl:text-2xl font-bold text-red-700 animate-gentle-glow">
                  Link không hợp lệ
                </h2>
                <p className="mb-6 3xl:mb-8 text-sm 3xl:text-base text-slate-700">
                  {error}
                </p>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Button
                    onClick={() => navigate("/auth/forgot-password")}
                    className={`w-full h-10 sm:h-12 3xl:h-14 text-sm sm:text-base 3xl:text-lg font-semibold text-white border-0 shadow-xl rounded-xl 3xl:rounded-2xl relative overflow-hidden bg-gradient-to-r ${pastelsSchemes.buttonError} hover:${pastelsSchemes.buttonErrorHover} transition-all duration-300`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-subtle-shimmer" />
                    <div className="relative z-10">Yêu cầu link mới</div>
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Back to Home Button */}
      <div className="fixed z-50 top-3 left-3 sm:top-4 sm:left-4">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/")}
            className={`text-slate-700 shadow-xl border-0 bg-gradient-to-r ${pastelsSchemes.cardBg} backdrop-blur-sm hover:shadow-2xl transition-all duration-300 rounded-xl ${pastelsSchemes.cardBorder}`}
          >
            <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline text-sm">Về trang chủ</span>
            <span className="sm:hidden text-xs">Home</span>
          </Button>
        </motion.div>
      </div>

      {/* Main Content - Full Width with Pastel Background */}
      <div
        className={`flex items-center justify-center w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 bg-gradient-to-br ${pastelsSchemes.main} overflow-hidden relative pastel-bg-pattern`}
      >
        {/* Floating Pastel Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[
            {
              emoji: "🔐",
              position: "top-10 right-20",
              delay: 0,
              color: pastelsSchemes.iconBlue,
            },
            {
              emoji: "🔑",
              position: "top-32 right-10",
              delay: 1,
              color: pastelsSchemes.iconYellow,
            },
            {
              emoji: "🛡️",
              position: "bottom-20 left-10",
              delay: 2,
              color: pastelsSchemes.iconGreen,
            },
            {
              emoji: "🔒",
              position: "top-20 left-20",
              delay: 3,
              color: pastelsSchemes.iconOrange,
            },
            {
              emoji: "✨",
              position: "bottom-32 right-32",
              delay: 4,
              color: pastelsSchemes.iconPink,
            },
            {
              emoji: "🔄",
              position: "top-1/2 left-1/4",
              delay: 5,
              color: pastelsSchemes.iconGreen,
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              className={`absolute ${item.position} text-2xl lg:text-3xl 3xl:text-4xl opacity-30`}
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
                className={`p-2 lg:p-3 3xl:p-4 rounded-full bg-gradient-to-r ${item.color} backdrop-blur-sm shadow-lg animate-morph`}
                whileHover={{ scale: 1.2, rotate: 15 }}
              >
                <span className="animate-float">{item.emoji}</span>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Enhanced Background Shapes */}
        <motion.div
          className="absolute w-20 h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 3xl:w-36 3xl:h-36 rounded-full bg-emerald-400/20 blur-2xl animate-morph"
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md 3xl:max-w-lg z-10"
        >
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card
              className={`border shadow-2xl rounded-2xl 3xl:rounded-3xl bg-gradient-to-br ${pastelsSchemes.cardBg} backdrop-blur-xl ${pastelsSchemes.cardBorder} relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-slate-50/5 pointer-events-none" />

              <CardHeader className="text-center px-6 sm:px-7 3xl:px-8 pt-6 sm:pt-7 3xl:pt-8 pb-2 relative z-10">
                <motion.div
                  className={`flex items-center justify-center w-16 h-16 3xl:w-20 3xl:h-20 mx-auto mb-4 3xl:mb-6 rounded-full shadow-xl bg-gradient-to-r ${pastelsSchemes.buttonSuccess} relative overflow-hidden`}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    delay: 0.3,
                    duration: 0.8,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-subtle-shimmer" />
                  <Key className="w-8 h-8 3xl:w-10 3xl:h-10 text-white drop-shadow-lg" />
                </motion.div>
                <CardTitle className="text-xl 3xl:text-2xl font-bold text-slate-800 animate-gentle-glow">
                  Đặt lại mật khẩu
                </CardTitle>
                <p className="text-sm 3xl:text-base text-slate-700 font-medium">
                  Nhập mật khẩu mới cho tài khoản của bạn
                </p>
              </CardHeader>

              <CardContent className="px-6 sm:px-7 3xl:px-8 pb-6 sm:pb-7 3xl:pb-8 space-y-5 sm:space-y-6 3xl:space-y-7 relative z-10">
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-5 3xl:space-y-6"
                >
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Alert className="rounded-xl bg-gradient-to-r from-red-50 to-rose-50 border border-red-200">
                          <AlertDescription className="text-red-800 font-medium text-sm 3xl:text-base">
                            {error}
                          </AlertDescription>
                        </Alert>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-2 3xl:space-y-3">
                    <Label
                      htmlFor="password"
                      className="text-sm 3xl:text-base font-medium text-slate-700"
                    >
                      Mật khẩu mới
                    </Label>
                    <motion.div
                      className="relative group"
                      whileFocus={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Lock className="absolute w-4 h-4 sm:w-5 sm:h-5 3xl:w-6 3xl:h-6 text-slate-500 transform -translate-y-1/2 left-3 sm:left-4 3xl:left-5 top-1/2 z-10 group-focus-within:text-emerald-600 transition-all duration-300 group-focus-within:scale-110" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Tối thiểu 6 ký tự"
                        {...register("password")}
                        className={`pl-10 sm:pl-12 3xl:pl-14 pr-10 sm:pr-12 3xl:pr-14 h-10 sm:h-12 3xl:h-14 text-sm sm:text-base 3xl:text-lg border-2 shadow-lg transition-all duration-300 rounded-xl 3xl:rounded-2xl text-slate-800 bg-gradient-to-r ${pastelsSchemes.cardBg} backdrop-blur-sm ${
                          errors.password
                            ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                            : "border-emerald-200 focus:border-emerald-400 hover:border-emerald-300 focus:ring-emerald-200"
                        } focus:ring-2 focus:ring-offset-0`}
                        disabled={isSubmitting}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute text-slate-500 hover:text-emerald-600 transform -translate-y-1/2 right-3 sm:right-4 3xl:right-5 top-1/2 transition-all duration-300 hover:scale-110"
                        disabled={isSubmitting}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4 sm:w-5 sm:h-5 3xl:w-6 3xl:h-6" />
                        ) : (
                          <Eye className="w-4 h-4 sm:w-5 sm:h-5 3xl:w-6 3xl:h-6" />
                        )}
                      </button>
                    </motion.div>
                    {errors.password && (
                      <motion.p
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-sm 3xl:text-base text-red-700 font-medium flex items-center space-x-1"
                      >
                        <AlertTriangle className="w-4 h-4 3xl:w-5 3xl:h-5" />
                        <span>{errors.password.message}</span>
                      </motion.p>
                    )}
                  </div>

                  <div className="space-y-2 3xl:space-y-3">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-sm 3xl:text-base font-medium text-slate-700"
                    >
                      Xác nhận mật khẩu
                    </Label>
                    <motion.div
                      className="relative group"
                      whileFocus={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Lock className="absolute w-4 h-4 sm:w-5 sm:h-5 3xl:w-6 3xl:h-6 text-slate-500 transform -translate-y-1/2 left-3 sm:left-4 3xl:left-5 top-1/2 z-10 group-focus-within:text-emerald-600 transition-all duration-300 group-focus-within:scale-110" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Nhập lại mật khẩu mới"
                        {...register("confirmPassword")}
                        className={`pl-10 sm:pl-12 3xl:pl-14 pr-10 sm:pr-12 3xl:pr-14 h-10 sm:h-12 3xl:h-14 text-sm sm:text-base 3xl:text-lg border-2 shadow-lg transition-all duration-300 rounded-xl 3xl:rounded-2xl text-slate-800 bg-gradient-to-r ${pastelsSchemes.cardBg} backdrop-blur-sm ${
                          errors.confirmPassword
                            ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                            : "border-emerald-200 focus:border-emerald-400 hover:border-emerald-300 focus:ring-emerald-200"
                        } focus:ring-2 focus:ring-offset-0`}
                        disabled={isSubmitting}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute text-slate-500 hover:text-emerald-600 transform -translate-y-1/2 right-3 sm:right-4 3xl:right-5 top-1/2 transition-all duration-300 hover:scale-110"
                        disabled={isSubmitting}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4 sm:w-5 sm:h-5 3xl:w-6 3xl:h-6" />
                        ) : (
                          <Eye className="w-4 h-4 sm:w-5 sm:h-5 3xl:w-6 3xl:h-6" />
                        )}
                      </button>
                    </motion.div>
                    {errors.confirmPassword && (
                      <motion.p
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-sm 3xl:text-base text-red-700 font-medium flex items-center space-x-1"
                      >
                        <AlertTriangle className="w-4 h-4 3xl:w-5 3xl:h-5" />
                        <span>{errors.confirmPassword.message}</span>
                      </motion.p>
                    )}
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Button
                      type="submit"
                      className={`w-full h-10 sm:h-12 3xl:h-14 text-sm sm:text-base 3xl:text-lg font-bold text-white border-0 shadow-xl relative overflow-hidden rounded-xl 3xl:rounded-2xl bg-gradient-to-r ${pastelsSchemes.buttonSuccess} hover:${pastelsSchemes.buttonSuccessHover} transition-all duration-300`}
                      disabled={isSubmitting}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-subtle-shimmer" />

                      <div className="relative z-10 flex items-center justify-center">
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 3xl:w-6 3xl:h-6 mr-2 animate-spin" />
                            Đang cập nhật...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 3xl:w-6 3xl:h-6 mr-2" />
                            Cập nhật mật khẩu
                          </>
                        )}
                      </div>
                    </Button>
                  </motion.div>
                </form>

                <div className="pt-3 3xl:pt-4 text-center border-t border-slate-200">
                  <motion.p
                    className={`text-xs sm:text-sm 3xl:text-base text-slate-600 flex items-center justify-center space-x-1 3xl:space-x-2 rounded-full px-3 3xl:px-4 py-2 3xl:py-3 font-medium bg-gradient-to-r ${pastelsSchemes.cardBg} ${pastelsSchemes.cardBorder} border backdrop-blur-sm shadow-sm`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Shield className="w-3 h-3 sm:w-4 sm:h-4 3xl:w-5 3xl:h-5 text-emerald-600 animate-soft-pulse" />
                    </motion.div>
                    <span>Mật khẩu được mã hóa an toàn</span>
                  </motion.p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Security Note */}
          <motion.div
            className="mt-4 3xl:mt-6 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <motion.p
              className={`text-xs sm:text-sm 3xl:text-base text-slate-500 flex items-center justify-center space-x-1 3xl:space-x-2 rounded-full px-3 3xl:px-4 py-2 3xl:py-3 font-medium mx-auto w-fit bg-gradient-to-r ${pastelsSchemes.cardBg} backdrop-blur-sm shadow-lg border ${pastelsSchemes.cardBorder}`}
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
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 3xl:w-5 3xl:h-5 text-emerald-500 animate-soft-pulse" />
              </motion.div>
              <span>Bảo mật cao với SSL 256-bit encryption</span>
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;
