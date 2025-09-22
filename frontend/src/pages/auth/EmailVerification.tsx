import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import OTPInput from "@/components/OTPInput";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  CheckCircle,
  Loader2,
  RefreshCw,
  ArrowLeft,
  Shield,
  Clock,
  Smartphone,
  Send,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const EmailVerification: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 5;

  // Enhanced pastel color schemes for EmailVerification (Green theme)
  const pastelsSchemes = {
    main: "from-emerald-50 via-green-50 to-teal-50",
    sectionBg: "from-emerald-50/80 via-green-50/60 to-teal-50/80",
    cardBg: "from-white/98 via-slate-50/95 to-white/98",
    cardBorder: "border-slate-200/50",
    buttonSuccess: "from-emerald-500 via-green-500 to-teal-500",
    buttonSuccessHover: "from-emerald-600 via-green-600 to-teal-600",
    buttonPrimary: "from-sky-400 via-blue-400 to-indigo-400",
    buttonPrimaryHover: "from-sky-500 via-blue-500 to-indigo-500",
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

  useEffect(() => {
    const emailFromParams = searchParams.get("email");
    if (emailFromParams) {
      setEmail(emailFromParams);
    } else {
      navigate("/auth/register");
    }
  }, [searchParams, navigate]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleOTPComplete = async (otp: string) => {
    if (attempts >= maxAttempts) {
      setError("Quá nhiều lần thử. Vui lòng yêu cầu mã mới.");
      return;
    }

    setIsVerifying(true);
    setError("");
    setAttempts((prev) => prev + 1);

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "signup",
      });

      if (error) throw error;

      if (data.user) {
        setSuccess(true);

        // Create profile
        const { error: profileError } = await supabase.from("profiles").insert({
          id: data.user.id,
          name:
            data.user.user_metadata?.name ||
            data.user.email?.split("@")[0] ||
            "User",
          role: "customer",
          avatar: "",
          email: data.user.email,
          created_at: new Date().toISOString(),
        });

        if (profileError) {
          console.error("Profile creation error:", profileError);
        }

        toast({
          title: "🎉 Xác nhận thành công!",
          description: "Tài khoản của bạn đã được kích hoạt.",
        });

        setTimeout(() => {
          navigate("/auth/login?verified=true");
        }, 2000);
      }
    } catch (error: any) {
      console.error("OTP verification error:", error);

      if (error.message === "Token has expired") {
        setError("Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới.");
      } else if (error.message === "Invalid token") {
        setError(
          `Mã OTP không chính xác. Còn ${maxAttempts - attempts} lần thử.`,
        );
      } else {
        setError("Có lỗi xảy ra. Vui lòng thử lại.");
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    setError("");
    setAttempts(0);

    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
      });

      if (error) throw error;

      toast({
        title: "📧 Đã gửi lại mã OTP",
        description: "Vui lòng kiểm tra email của bạn.",
      });

      setCountdown(60);
      setCanResend(false);
    } catch (error: any) {
      setError("Không thể gửi lại mã OTP. Vui lòng thử lại sau.");
    } finally {
      setIsResending(false);
    }
  };

  // ✅ SUCCESS STATE với pastel design
  if (success) {
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
                emoji: "🎉",
                position: "top-10 right-20",
                delay: 0,
                color: pastelsSchemes.iconOrange,
              },
              {
                emoji: "✅",
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
                emoji: "✨",
                position: "top-20 left-20",
                delay: 3,
                color: pastelsSchemes.iconYellow,
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                className={`absolute ${item.position} text-2xl lg:text-4xl opacity-30`}
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
                  className={`p-2 lg:p-3 rounded-full bg-gradient-to-r ${item.color} backdrop-blur-sm shadow-lg animate-morph`}
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
            className="w-full max-w-md z-10"
          >
            <Card
              className={`p-6 sm:p-8 border shadow-2xl rounded-2xl 3xl:rounded-3xl bg-gradient-to-br ${pastelsSchemes.cardBg} backdrop-blur-xl ${pastelsSchemes.cardBorder} relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-slate-50/5 pointer-events-none" />

              <CardContent className="p-0 relative z-10 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className={`flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full shadow-xl bg-gradient-to-r ${pastelsSchemes.buttonSuccess}`}
                >
                  <CheckCircle className="w-8 h-8 text-white" />
                </motion.div>

                <h2 className="mb-3 text-xl font-bold text-emerald-700 animate-gentle-glow">
                  Xác nhận thành công!
                </h2>

                <p className="mb-4 text-sm text-slate-700">
                  Tài khoản của bạn đã được kích hoạt. Đang chuyển hướng...
                </p>

                <div className="flex items-center justify-center">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin text-emerald-600" />
                  <span className="text-xs text-emerald-600">
                    Đang chuyển hướng...
                  </span>
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
            onClick={() => navigate("/auth/register")}
            className={`text-slate-700 shadow-xl border-0 bg-gradient-to-r ${pastelsSchemes.cardBg} backdrop-blur-sm hover:shadow-2xl transition-all duration-300 rounded-xl ${pastelsSchemes.cardBorder}`}
          >
            <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline text-sm">Quay lại</span>
            <span className="sm:hidden text-xs">Back</span>
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
              emoji: "📱",
              position: "top-10 right-20",
              delay: 0,
              color: pastelsSchemes.iconBlue,
            },
            {
              emoji: "🔐",
              position: "top-32 right-10",
              delay: 1,
              color: pastelsSchemes.iconGreen,
            },
            {
              emoji: "📧",
              position: "bottom-20 left-10",
              delay: 2,
              color: pastelsSchemes.iconYellow,
            },
            {
              emoji: "✨",
              position: "top-20 left-20",
              delay: 3,
              color: pastelsSchemes.iconOrange,
            },
            {
              emoji: "⏰",
              position: "bottom-32 right-32",
              delay: 4,
              color: pastelsSchemes.iconPink,
            },
            {
              emoji: "🛡️",
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

              <CardHeader className="pb-2 text-center px-5 pt-5 sm:px-6 sm:pt-6 lg:px-7 lg:pt-7 3xl:px-8 3xl:pt-8 relative z-10">
                <motion.div
                  className={`flex items-center justify-center w-16 h-16 3xl:w-20 3xl:h-20 mx-auto mb-4 rounded-full shadow-xl bg-gradient-to-r ${pastelsSchemes.buttonPrimary} relative overflow-hidden`}
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
                  <Mail className="w-8 h-8 3xl:w-10 3xl:h-10 text-white" />
                </motion.div>

                <CardTitle className="text-xl 3xl:text-2xl font-bold text-slate-800 mb-2 animate-gentle-glow">
                  Xác nhận Email
                </CardTitle>
                <p className="text-sm 3xl:text-base text-slate-700 mb-2">
                  Chúng tôi đã gửi mã xác nhận 6 chữ số đến
                </p>
                <motion.div
                  className="p-2 3xl:p-3 rounded-lg bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="text-sm 3xl:text-base font-bold text-emerald-700">
                    {email}
                  </p>
                </motion.div>
              </CardHeader>

              <CardContent className="px-5 pb-5 space-y-5 sm:px-6 sm:pb-6 sm:space-y-6 lg:px-7 lg:pb-7 lg:space-y-7 3xl:px-8 3xl:pb-8 3xl:space-y-8 relative z-10">
                {/* Error Alert */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Alert className="rounded-lg p-3 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200">
                        <AlertDescription className="text-red-800 font-medium text-sm 3xl:text-base">
                          {error}
                        </AlertDescription>
                      </Alert>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* OTP Input section */}
                <div className="space-y-4 lg:space-y-5">
                  <div className="text-center">
                    <label className="block mb-3 lg:mb-4 text-sm 3xl:text-base font-medium text-slate-700">
                      Nhập mã xác nhận
                    </label>
                    <OTPInput
                      length={6}
                      onComplete={handleOTPComplete}
                      disabled={isVerifying || attempts >= maxAttempts}
                      error={!!error && !isVerifying}
                      success={success}
                    />
                    <p className="text-xs 3xl:text-sm text-slate-500 mt-2 lg:mt-3">
                      Nhập 6 chữ số được gửi về email của bạn
                    </p>
                  </div>

                  {/* Verifying State */}
                  <AnimatePresence>
                    {isVerifying && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center justify-center space-x-2 text-emerald-600"
                      >
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm 3xl:text-base font-medium">
                          Đang xác nhận...
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Resend section */}
                <div className="space-y-3 lg:space-y-4 text-center">
                  <p className="text-xs 3xl:text-sm text-slate-600">
                    Không nhận được mã?
                  </p>

                  <motion.div
                    whileHover={{
                      scale:
                        canResend && !isResending && attempts < maxAttempts
                          ? 1.02
                          : 1,
                    }}
                    whileTap={{
                      scale:
                        canResend && !isResending && attempts < maxAttempts
                          ? 0.98
                          : 1,
                    }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Button
                      onClick={handleResendOTP}
                      disabled={
                        !canResend || isResending || attempts >= maxAttempts
                      }
                      className={`w-full h-10 lg:h-11 3xl:h-14 text-sm 3xl:text-base font-semibold rounded-lg 3xl:rounded-xl transition-all duration-300 relative overflow-hidden ${
                        canResend && !isResending && attempts < maxAttempts
                          ? `bg-gradient-to-r ${pastelsSchemes.buttonError} hover:${pastelsSchemes.buttonErrorHover} text-white border-0 shadow-xl`
                          : `bg-gradient-to-r ${pastelsSchemes.buttonSecondary} hover:${pastelsSchemes.buttonSecondaryHover} text-slate-500 border ${pastelsSchemes.cardBorder}`
                      }`}
                    >
                      {/* Button shimmer effect */}
                      {canResend && !isResending && attempts < maxAttempts && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-subtle-shimmer" />
                      )}

                      <div className="relative z-10 flex items-center justify-center">
                        {isResending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Đang gửi...
                          </>
                        ) : canResend ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Gửi lại mã
                          </>
                        ) : (
                          <>
                            <Clock className="w-4 h-4 mr-2" />
                            Gửi lại sau {countdown}s
                          </>
                        )}
                      </div>
                    </Button>
                  </motion.div>

                  {attempts > 0 && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs 3xl:text-sm text-orange-600 font-medium"
                    >
                      Đã thử {attempts}/{maxAttempts} lần
                    </motion.p>
                  )}
                </div>

                {/* Security notes */}
                <div className="pt-3 lg:pt-4 space-y-2 border-t border-slate-200">
                  <motion.div
                    className={`flex items-center justify-center space-x-2 text-xs 3xl:text-sm rounded-full px-3 py-1.5 lg:py-2 bg-gradient-to-r ${pastelsSchemes.cardBg} ${pastelsSchemes.cardBorder} border backdrop-blur-sm shadow-sm`}
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
                      <Shield className="w-3 h-3 text-emerald-600 animate-soft-pulse" />
                    </motion.div>
                    <span className="text-slate-600">
                      Mã OTP có hiệu lực trong 10 phút
                    </span>
                  </motion.div>
                </div>
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
              <span>Bảo mật cao với mã hóa SSL 256-bit</span>
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default EmailVerification;
