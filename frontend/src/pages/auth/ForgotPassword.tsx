import React, { useState } from "react";
import { Link } from "react-router-dom";
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
  Mail,
  ArrowLeft,
  Loader2,
  CheckCircle,
  Key,
  Shield,
  Clock,
  AlertTriangle,
  Send,
  Sparkles,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const forgotPasswordSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
});

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);

  // Enhanced pastel color schemes for ForgotPassword (Green theme)
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
    getValues,
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordData) => {
    setIsSubmitting(true);
    setError("");

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;

      setIsEmailSent(true);
      setCountdown(300); // 5 minutes countdown

      toast({
        title: "📧 Email đã được gửi",
        description: "Vui lòng kiểm tra hộp thư để đặt lại mật khẩu.",
      });

      // Start countdown
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: any) {
      console.error("Forgot password error:", error);
      setError(
        error.message === "User not found"
          ? "Email này chưa được đăng ký trong hệ thống."
          : error.message === "Email rate limit exceeded"
            ? "Quá nhiều yêu cầu. Vui lòng đợi 60 giây rồi thử lại."
            : "Có lỗi xảy ra. Vui lòng thử lại sau.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // ✅ EMAIL SENT STATE với pastel design - RESPONSIVE VERSION
  if (isEmailSent) {
    return (
      <div className="h-screen flex overflow-hidden">
        {/* Main Content - Full Width with Pastel Background */}
        <div
          className={`flex items-center justify-center w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 bg-gradient-to-br ${pastelsSchemes.main} overflow-hidden relative pastel-bg-pattern`}
        >
          {/* Floating Pastel Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[
              {
                emoji: "📧",
                position: "top-10 right-20",
                delay: 0,
                color: pastelsSchemes.iconBlue,
              },
              {
                emoji: "✅",
                position: "top-32 right-10",
                delay: 1,
                color: pastelsSchemes.iconGreen,
              },
              {
                emoji: "🔐",
                position: "bottom-20 left-10",
                delay: 2,
                color: pastelsSchemes.iconOrange,
              },
              {
                emoji: "⏰",
                position: "top-20 left-20",
                delay: 3,
                color: pastelsSchemes.iconYellow,
              },
              {
                emoji: "🛡️",
                position: "bottom-32 right-32",
                delay: 4,
                color: pastelsSchemes.iconPink,
              },
              {
                emoji: "✨",
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
                  className={`flex items-center justify-center w-16 h-16 3xl:w-20 3xl:h-20 mx-auto mb-5 3xl:mb-6 rounded-full shadow-xl bg-gradient-to-r ${pastelsSchemes.buttonSuccess} relative overflow-hidden`}
                >
                  <CheckCircle className="w-8 h-8 3xl:w-10 3xl:h-10 text-white drop-shadow-lg" />
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-white/40"
                    animate={{
                      rotate: 360,
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      rotate: {
                        duration: 10,
                        repeat: Infinity,
                        ease: "linear",
                      },
                      scale: {
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                    }}
                  />
                </motion.div>

                <h2 className="mb-3 3xl:mb-4 text-xl sm:text-2xl 3xl:text-3xl font-bold text-emerald-700 animate-gentle-glow">
                  Email đã được gửi!
                </h2>

                <p className="mb-2 3xl:mb-3 text-sm sm:text-base 3xl:text-lg text-slate-700 font-medium">
                  Chúng tôi đã gửi link đặt lại mật khẩu đến
                </p>
                <motion.div
                  className="mb-5 3xl:mb-6 p-3 3xl:p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <p className="text-sm sm:text-base 3xl:text-lg font-bold text-emerald-700">
                    {getValues("email")}
                  </p>
                </motion.div>

                <div className="space-y-4 3xl:space-y-5">
                  {countdown > 0 && (
                    <motion.div
                      className="p-3 3xl:p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <div className="flex items-center justify-center mb-1 3xl:mb-2 space-x-2 text-blue-700">
                        <Clock className="w-4 h-4 3xl:w-5 3xl:h-5" />
                        <span className="font-medium text-sm 3xl:text-base">
                          Link có hiệu lực trong:
                        </span>
                      </div>
                      <div className="text-xl 3xl:text-2xl font-bold text-blue-600">
                        {formatTime(countdown)}
                      </div>
                    </motion.div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 3xl:gap-4">
                    <motion.div
                      className="p-3 3xl:p-4 rounded-lg bg-gradient-to-r from-red-50 to-rose-50 border border-red-200"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <AlertTriangle className="w-4 h-4 3xl:w-5 3xl:h-5 mx-auto mb-1 3xl:mb-2 text-red-700" />
                      <p className="text-xs 3xl:text-sm text-red-800 font-medium">
                        Kiểm tra thư mục spam
                      </p>
                    </motion.div>

                    <motion.div
                      className="p-3 3xl:p-4 rounded-lg bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <Mail className="w-4 h-4 3xl:w-5 3xl:h-5 mx-auto mb-1 3xl:mb-2 text-violet-700" />
                      <p className="text-xs 3xl:text-sm text-violet-800 font-medium">
                        Có thể mất vài phút
                      </p>
                    </motion.div>
                  </div>

                  <div className="space-y-2 3xl:space-y-3">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Button
                        asChild
                        className={`w-full h-10 sm:h-11 3xl:h-12 font-semibold border-2 shadow-xl rounded-xl relative overflow-hidden bg-gradient-to-r ${pastelsSchemes.buttonSecondary} hover:${pastelsSchemes.buttonSecondaryHover} text-slate-700 ${pastelsSchemes.cardBorder}`}
                      >
                        <Link to="/auth/login">
                          {/* Button shimmer effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-subtle-shimmer" />
                          <div className="relative z-10 flex items-center justify-center text-sm 3xl:text-base">
                            <ArrowLeft className="w-4 h-4 3xl:w-5 3xl:h-5 mr-2" />
                            Quay lại đăng nhập
                          </div>
                        </Link>
                      </Button>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Button
                        onClick={() => setIsEmailSent(false)}
                        className={`w-full h-10 sm:h-11 3xl:h-12 font-semibold border-0 shadow-xl rounded-xl relative overflow-hidden bg-gradient-to-r ${pastelsSchemes.buttonPrimary} hover:${pastelsSchemes.buttonPrimaryHover} text-white`}
                      >
                        {/* Button shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-subtle-shimmer" />
                        <div className="relative z-10 flex items-center justify-center text-sm 3xl:text-base">
                          <Send className="w-4 h-4 3xl:w-5 3xl:h-5 mr-2" />
                          Gửi lại email
                        </div>
                      </Button>
                    </motion.div>
                  </div>
                </div>
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
            asChild
            className={`text-slate-700 shadow-xl border-0 bg-gradient-to-r ${pastelsSchemes.cardBg} backdrop-blur-sm hover:shadow-2xl transition-all duration-300 rounded-xl ${pastelsSchemes.cardBorder}`}
          >
            <Link to="/auth/login">
              <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline text-sm">
                Quay lại đăng nhập
              </span>
              <span className="sm:hidden text-xs">Back</span>
            </Link>
          </Button>
        </motion.div>
      </div>

      {/* Main Content - Full Width with Pastel Background */}
      <div
        className={`flex items-center justify-center w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 bg-gradient-to-br ${pastelsSchemes.main} overflow-hidden relative pastel-bg-pattern`}
      >
        {/* Floating Pastel Elements - Responsive */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[
            {
              emoji: "🔑",
              position: "top-10 right-20",
              delay: 0,
              color: pastelsSchemes.iconYellow,
            },
            {
              emoji: "🛡️",
              position: "top-32 right-10",
              delay: 1,
              color: pastelsSchemes.iconGreen,
            },
            {
              emoji: "📧",
              position: "bottom-20 left-10",
              delay: 2,
              color: pastelsSchemes.iconBlue,
            },
            {
              emoji: "🔐",
              position: "top-20 left-20",
              delay: 3,
              color: pastelsSchemes.iconOrange,
            },
            {
              emoji: "⚡",
              position: "bottom-32 right-32",
              delay: 4,
              color: pastelsSchemes.iconPink,
            },
            {
              emoji: "✨",
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

        {/* Enhanced Background Shapes - Responsive */}
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
              {/* Card decorative overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-slate-50/5 pointer-events-none" />

              <CardHeader className="text-center p-6 sm:p-7 3xl:p-8 relative z-10">
                <motion.div
                  className={`flex items-center justify-center w-16 h-16 3xl:w-20 3xl:h-20 mx-auto mb-5 3xl:mb-6 rounded-full shadow-xl bg-gradient-to-r ${pastelsSchemes.buttonPrimary} relative overflow-hidden`}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    delay: 0.3,
                    duration: 0.8,
                  }}
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-subtle-shimmer" />
                  <Key className="w-8 h-8 3xl:w-10 3xl:h-10 text-white drop-shadow-lg" />
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-white/40"
                    animate={{
                      rotate: 360,
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      rotate: {
                        duration: 10,
                        repeat: Infinity,
                        ease: "linear",
                      },
                      scale: {
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                    }}
                  />
                </motion.div>

                <CardTitle className="text-xl sm:text-2xl 3xl:text-3xl font-bold text-slate-800 animate-gentle-glow">
                  Quên mật khẩu?
                </CardTitle>
                <p className="mt-2 3xl:mt-3 text-sm sm:text-base 3xl:text-lg text-slate-700 font-medium">
                  Nhập email để nhận link đặt lại mật khẩu
                </p>
              </CardHeader>

              <CardContent className="space-y-5 sm:space-y-6 3xl:space-y-7 p-6 sm:p-7 3xl:p-8 pt-0 relative z-10">
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
                      htmlFor="email"
                      className="text-sm sm:text-base 3xl:text-lg font-medium text-slate-700"
                    >
                      Địa chỉ email
                    </Label>
                    <motion.div
                      className="relative group"
                      whileFocus={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Mail className="absolute w-4 h-4 sm:w-5 sm:h-5 3xl:w-6 3xl:h-6 text-slate-500 transform -translate-y-1/2 left-3 sm:left-4 3xl:left-5 top-1/2 z-10 group-focus-within:text-emerald-600 transition-all duration-300 group-focus-within:scale-110" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="example@email.com"
                        {...register("email")}
                        className={`pl-10 sm:pl-12 3xl:pl-14 h-10 sm:h-12 3xl:h-14 text-sm sm:text-base 3xl:text-lg border-2 shadow-lg transition-all duration-300 rounded-xl 3xl:rounded-2xl text-slate-800 bg-gradient-to-r ${pastelsSchemes.cardBg} backdrop-blur-sm ${
                          errors.email
                            ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                            : "border-emerald-200 focus:border-emerald-400 hover:border-emerald-300 focus:ring-emerald-200"
                        } focus:ring-2 focus:ring-offset-0`}
                        disabled={isSubmitting}
                      />
                      {/* Enhanced checkmark */}
                      {!errors.email && getValues("email") && (
                        <motion.div
                          className="absolute right-3 sm:right-4 3xl:right-5 top-1/2 transform -translate-y-1/2"
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
                                "0 0 0 8px rgba(34, 197, 94, 0)",
                              ],
                            }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 3xl:w-6 3xl:h-6 text-green-600" />
                          </motion.div>
                        </motion.div>
                      )}
                    </motion.div>
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-sm 3xl:text-base text-red-700 font-medium flex items-center space-x-1"
                      >
                        <AlertTriangle className="w-4 h-4 3xl:w-5 3xl:h-5" />
                        <span>{errors.email.message}</span>
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
                      className={`w-full text-sm sm:text-base 3xl:text-lg h-10 sm:h-12 3xl:h-14 font-bold text-white border-0 shadow-xl relative overflow-hidden rounded-xl 3xl:rounded-2xl bg-gradient-to-r ${pastelsSchemes.buttonPrimary} hover:${pastelsSchemes.buttonPrimaryHover} transition-all duration-300`}
                      disabled={isSubmitting}
                    >
                      {/* Button shimmer effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-subtle-shimmer" />

                      <div className="relative z-10 flex items-center justify-center">
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 3xl:w-6 3xl:h-6 mr-2 animate-spin" />
                            Đang gửi...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 sm:w-5 sm:h-5 3xl:w-6 3xl:h-6 mr-2" />
                            Gửi link đặt lại
                          </>
                        )}
                      </div>
                    </Button>
                  </motion.div>
                </form>

                <div className="space-y-3 3xl:space-y-4 text-center">
                  <p className="text-sm 3xl:text-base text-slate-700 font-medium">
                    Nhớ lại mật khẩu?{" "}
                    <Link
                      to="/auth/login"
                      className="font-bold text-emerald-700 hover:text-emerald-800 transition-all duration-300 hover:underline"
                    >
                      Đăng nhập ngay
                    </Link>
                  </p>

                  <div className="pt-3 3xl:pt-4 border-t border-slate-200">
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
                      <span>
                        Link đặt lại mật khẩu có hiệu lực trong 5 phút
                      </span>
                    </motion.p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Security Note - Responsive */}
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
              <span>Bảo mật tuyệt đối với mã hóa SSL 256-bit</span>
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
