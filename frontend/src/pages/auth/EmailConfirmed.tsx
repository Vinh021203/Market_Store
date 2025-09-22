import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Loader2,
  XCircle,
  ArrowRight,
  RefreshCw,
  Mail,
  ArrowLeft,
  Shield,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";

const EmailConfirmed: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(5);

  // ✅ ENHANCED: Màu sắc mới cho form và buttons
  const pastelsSchemes = {
    main: "from-emerald-50 via-green-50 to-teal-50",
    sectionBg: "from-emerald-50/80 via-green-50/60 to-teal-50/80",
    // 🎨 CARD: Màu trắng sáng với subtle gradient
    cardBg: "from-white/98 via-slate-50/95 to-white/98",
    cardBorder: "border-slate-200/50",
    // 🎨 SUCCESS BUTTONS: Xanh lá gradient đẹp
    buttonSuccess: "from-emerald-500 via-green-500 to-teal-500",
    buttonSuccessHover: "from-emerald-600 via-green-600 to-teal-600",
    // 🎨 ERROR BUTTONS: Đỏ gradient tinh tế
    buttonError: "from-rose-500 via-red-500 to-pink-500",
    buttonErrorHover: "from-rose-600 via-red-600 to-pink-600",
    // 🎨 SECONDARY BUTTONS: Xám trắng nhẹ nhàng
    buttonSecondary: "from-slate-100 via-gray-100 to-slate-100",
    buttonSecondaryHover: "from-slate-200 via-gray-200 to-slate-200",
    // 🎨 LOADING BUTTON: Gradient xanh lam nhẹ
    buttonLoading: "from-sky-400 via-blue-400 to-indigo-400",
    // Icons và highlights
    iconPink: "from-emerald-100 to-emerald-200",
    iconBlue: "from-teal-100 to-cyan-200",
    iconYellow: "from-green-100 to-lime-200",
    iconGreen: "from-emerald-100 to-green-200",
    iconOrange: "from-lime-100 to-yellow-200",
  };

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        // ✅ Lấy token từ URL parameters
        const token_hash = searchParams.get("token_hash");
        const type = searchParams.get("type");
        const access_token = searchParams.get("access_token");
        const refresh_token = searchParams.get("refresh_token");

        console.log("🔍 URL params:", {
          token_hash,
          type,
          access_token,
          refresh_token,
        });

        // ✅ Method 1: Xử lý token_hash (từ email link)
        if (token_hash && type) {
          console.log("📧 Processing email confirmation with token_hash");

          const { data, error } = await supabase.auth.verifyOtp({
            token_hash,
            type: type as any,
          });

          if (error) {
            console.error("❌ Token verification failed:", error);
            throw new Error(error.message);
          }

          if (data.user) {
            console.log("✅ Email confirmed via token_hash");
            await handleSuccessfulConfirmation(data.user);
            return;
          }
        }

        // ✅ Method 2: Xử lý access_token + refresh_token
        if (access_token && refresh_token) {
          console.log("🔑 Processing email confirmation with tokens");

          const { data, error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });

          if (error) {
            console.error("❌ Session setup failed:", error);
            throw new Error(error.message);
          }

          if (data.user) {
            console.log("✅ Email confirmed via session tokens");
            await handleSuccessfulConfirmation(data.user);
            return;
          }
        }

        // ✅ Method 3: Check existing session (fallback)
        console.log("🔍 Checking existing session");
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("❌ Session check failed:", sessionError);
          throw new Error(sessionError.message);
        }

        if (session?.user) {
          console.log("✅ Email confirmed via existing session");
          await handleSuccessfulConfirmation(session.user);
          return;
        }

        // ✅ No valid confirmation found
        throw new Error("No valid confirmation token or session found");
      } catch (error: any) {
        console.error("❌ Email confirmation failed:", error);
        setStatus("error");

        // ✅ Enhanced error messages
        let errorMessage = "Xác nhận email thất bại.";

        if (error.message.includes("Token has expired")) {
          errorMessage = "Link xác nhận đã hết hạn. Vui lòng đăng ký lại.";
        } else if (error.message.includes("Invalid token")) {
          errorMessage = "Link xác nhận không hợp lệ. Vui lòng kiểm tra email.";
        } else if (error.message.includes("User not found")) {
          errorMessage = "Không tìm thấy tài khoản. Vui lòng đăng ký lại.";
        } else if (error.message.includes("Email already confirmed")) {
          errorMessage = "Email đã được xác nhận trước đó.";
          // Redirect to login for already confirmed emails
          setTimeout(() => {
            navigate("/auth/login?message=already-confirmed");
          }, 2000);
        }

        setMessage(errorMessage);

        toast({
          title: "❌ Xác nhận thất bại",
          description: errorMessage,
          variant: "destructive",
        });
      }
    };

    confirmEmail();
  }, [navigate, searchParams]);

  // ✅ Handle successful confirmation
  const handleSuccessfulConfirmation = async (user: any) => {
    try {
      setStatus("success");
      setMessage("Email đã được xác nhận thành công! Đang chuyển hướng...");

      // ✅ Tạo hoặc cập nhật profile
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!existingProfile) {
        console.log("👤 Creating user profile");
        const { error: profileError } = await supabase.from("profiles").insert({
          id: user.id,
          name: user.user_metadata?.name || user.email?.split("@")[0] || "User",
          role: "customer",
          avatar: user.user_metadata?.avatar_url || "",
          email: user.email,
          created_at: new Date().toISOString(),
        });

        if (profileError) {
          console.error("❌ Profile creation failed:", profileError);
          // Don't throw error, just log it
        } else {
          console.log("✅ Profile created successfully");
        }
      } else {
        console.log("👤 Profile already exists");
      }

      toast({
        title: "🎉 Xác nhận thành công!",
        description: "Tài khoản của bạn đã được kích hoạt.",
      });

      // ✅ Start countdown
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            navigate("/auth/login?confirmed=true");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: any) {
      console.error("❌ Post-confirmation error:", error);
      // Still consider it successful since email was confirmed
      setStatus("success");
      setMessage(
        "Email đã được xác nhận nhưng có lỗi nhỏ. Đang chuyển hướng...",
      );

      setTimeout(() => {
        navigate("/auth/login?confirmed=true");
      }, 3000);
    }
  };

  const handleRetry = () => {
    setStatus("loading");
    setMessage("");
    window.location.reload();
  };

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
        {/* Floating Pastel Elements - Enhanced */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[
            {
              emoji: "✅",
              position: "top-10 right-20",
              delay: 0,
              color: pastelsSchemes.iconGreen,
            },
            {
              emoji: "💚",
              position: "top-32 right-10",
              delay: 1,
              color: pastelsSchemes.iconPink,
            },
            {
              emoji: "📧",
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
              emoji: "🎉",
              position: "bottom-32 right-32",
              delay: 4,
              color: pastelsSchemes.iconOrange,
            },
            {
              emoji: "🌟",
              position: "top-1/2 left-1/4",
              delay: 5,
              color: pastelsSchemes.iconGreen,
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
          className="absolute w-20 h-20 lg:w-28 lg:h-28 xl:w-32 xl:h-32 3xl:w-44 3xl:h-44 rounded-full bg-emerald-400/20 blur-2xl animate-morph"
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
          className="absolute rounded-full h-24 w-24 lg:h-32 lg:w-32 xl:h-36 xl:w-36 3xl:h-48 3xl:w-48 bg-green-400/20 blur-2xl animate-morph"
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
          className="absolute w-16 h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 3xl:w-32 3xl:h-32 rounded-xl bg-teal-400/20 blur-2xl animate-morph"
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

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md 3xl:max-w-lg z-10"
        >
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* ✅ ENHANCED CARD: Màu trắng sáng với border subtle */}
            <Card
              className={`p-6 sm:p-8 lg:p-6 xl:p-8 3xl:p-10 border shadow-2xl rounded-2xl 3xl:rounded-3xl bg-gradient-to-br ${pastelsSchemes.cardBg} backdrop-blur-xl ${pastelsSchemes.cardBorder} relative overflow-hidden`}
            >
              {/* Card decorative overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-slate-50/5 pointer-events-none" />

              <CardContent className="p-0 relative z-10 text-center">
                <AnimatePresence mode="wait">
                  {status === "loading" && (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {/* ✅ LOADING ICON: Màu xanh lam gradient */}
                      <motion.div
                        className={`flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 3xl:w-24 3xl:h-24 mx-auto mb-4 sm:mb-6 rounded-full shadow-xl bg-gradient-to-r ${pastelsSchemes.buttonLoading} relative overflow-hidden`}
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-subtle-shimmer" />
                        <Mail className="w-8 h-8 sm:w-10 sm:h-10 3xl:w-12 3xl:h-12 text-white" />
                      </motion.div>

                      <h2 className="mb-3 sm:mb-4 text-xl sm:text-2xl 3xl:text-3xl font-bold text-slate-800 animate-gentle-glow">
                        Đang xác nhận email...
                      </h2>
                      <p className="text-sm sm:text-base 3xl:text-lg text-slate-600 mb-4 sm:mb-6">
                        Vui lòng đợi trong giây lát
                      </p>

                      {/* ✅ PROGRESS BAR: Màu xanh lam gradient */}
                      <div className="w-full h-2 3xl:h-3 rounded-full overflow-hidden bg-slate-200/50">
                        <motion.div
                          className={`h-2 3xl:h-3 rounded-full bg-gradient-to-r ${pastelsSchemes.buttonLoading}`}
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 3, ease: "easeInOut" }}
                        />
                      </div>
                    </motion.div>
                  )}

                  {status === "success" && (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {/* ✅ SUCCESS ICON: Màu xanh lá gradient */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          delay: 0.2,
                        }}
                        className={`flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 3xl:w-24 3xl:h-24 mx-auto mb-4 sm:mb-6 rounded-full shadow-xl bg-gradient-to-r ${pastelsSchemes.buttonSuccess} relative overflow-hidden`}
                      >
                        <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 3xl:w-12 3xl:h-12 text-white" />
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

                      <h2 className="mb-3 sm:mb-4 text-xl sm:text-2xl 3xl:text-3xl font-bold text-emerald-700 animate-gentle-glow">
                        Xác nhận thành công!
                      </h2>

                      <p className="mb-4 sm:mb-6 text-sm sm:text-base 3xl:text-lg text-slate-600">
                        {message}
                      </p>

                      <div className="space-y-3 sm:space-y-4">
                        {/* ✅ SUCCESS ALERT: Màu xanh lá nhẹ */}
                        <motion.div
                          className="p-3 sm:p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <p className="font-medium text-emerald-700 text-sm sm:text-base 3xl:text-lg">
                            🎉 Tài khoản của bạn đã được kích hoạt thành công!
                          </p>
                        </motion.div>

                        <div className="flex items-center justify-center space-x-2 text-emerald-600">
                          <span className="text-sm sm:text-base 3xl:text-lg">
                            Chuyển hướng trong {countdown}s
                          </span>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          >
                            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5" />
                          </motion.div>
                        </div>

                        {/* ✅ SUCCESS BUTTON: Màu xanh lá đẹp */}
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <Button
                            onClick={() =>
                              navigate("/auth/login?confirmed=true")
                            }
                            className={`w-full h-10 sm:h-11 3xl:h-14 text-sm sm:text-base 3xl:text-lg font-bold text-white border-0 shadow-xl rounded-lg 3xl:rounded-xl relative overflow-hidden bg-gradient-to-r ${pastelsSchemes.buttonSuccess} hover:${pastelsSchemes.buttonSuccessHover} transition-all duration-300`}
                          >
                            {/* Button shimmer effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-subtle-shimmer" />

                            <div className="relative z-10 flex items-center justify-center">
                              <span>Đăng nhập ngay</span>
                              <motion.div
                                className="ml-2"
                                animate={{ x: [0, 3, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                              >
                                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 3xl:w-6 3xl:h-6" />
                              </motion.div>
                            </div>
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}

                  {status === "error" && (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {/* ✅ ERROR ICON: Màu đỏ gradient tinh tế */}
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          delay: 0.2,
                        }}
                        className={`flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 3xl:w-24 3xl:h-24 mx-auto mb-4 sm:mb-6 rounded-full shadow-xl bg-gradient-to-r ${pastelsSchemes.buttonError}`}
                      >
                        <XCircle className="w-8 h-8 sm:w-10 sm:h-10 3xl:w-12 3xl:h-12 text-white" />
                      </motion.div>

                      <h2 className="mb-3 sm:mb-4 text-xl sm:text-2xl 3xl:text-3xl font-bold text-red-700">
                        Xác nhận thất bại
                      </h2>

                      <p className="mb-4 sm:mb-6 text-sm sm:text-base 3xl:text-lg text-slate-600">
                        {message}
                      </p>

                      <div className="space-y-3 sm:space-y-4">
                        {/* ✅ ERROR ALERT: Màu đỏ nhẹ */}
                        <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-r from-red-50 to-rose-50 border border-red-200">
                          <p className="text-sm sm:text-base 3xl:text-lg text-red-700">
                            💡 Gợi ý: Kiểm tra email mới nhất hoặc thử đăng ký
                            lại
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {/* ✅ RETRY BUTTON: Secondary style */}
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button
                              onClick={handleRetry}
                              className={`h-10 sm:h-11 3xl:h-14 w-full text-sm sm:text-base 3xl:text-lg font-medium rounded-lg 3xl:rounded-xl border-2 border-slate-300 bg-gradient-to-r ${pastelsSchemes.buttonSecondary} hover:${pastelsSchemes.buttonSecondaryHover} text-slate-700 hover:text-slate-800 transition-all duration-300 shadow-md hover:shadow-lg`}
                            >
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Thử lại
                            </Button>
                          </motion.div>

                          {/* ✅ REGISTER BUTTON: Error style đỏ đẹp */}
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button
                              onClick={() => navigate("/auth/register")}
                              className={`h-10 sm:h-11 3xl:h-14 w-full text-sm sm:text-base 3xl:text-lg font-bold text-white border-0 shadow-xl rounded-lg 3xl:rounded-xl bg-gradient-to-r ${pastelsSchemes.buttonError} hover:${pastelsSchemes.buttonErrorHover} transition-all duration-300 relative overflow-hidden`}
                            >
                              {/* Button shimmer effect */}
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-subtle-shimmer" />
                              <div className="relative z-10 flex items-center justify-center">
                                <span>Đăng ký lại</span>
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </div>
                            </Button>
                          </motion.div>
                        </div>

                        {/* ✅ BACK TO LOGIN: Transparent style */}
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            onClick={() => navigate("/auth/login")}
                            className="w-full h-9 sm:h-10 text-sm sm:text-base font-medium text-slate-600 hover:text-slate-700 bg-transparent hover:bg-slate-50/50 border-0 transition-colors duration-200 rounded-lg"
                          >
                            Quay lại đăng nhập
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>

          {/* Security Note - Enhanced */}
          <motion.div
            className="mt-4 sm:mt-6 3xl:mt-8 text-center"
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
              <span>Xác nhận an toàn với mã hóa SSL 256-bit</span>
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default EmailConfirmed;
