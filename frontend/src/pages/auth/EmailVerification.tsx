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

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-slate-900 dark:via-green-900 dark:to-emerald-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Card className="border-0 shadow-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-600"
              >
                <CheckCircle className="w-10 h-10 text-white" />
              </motion.div>

              <h2 className="mb-4 text-2xl font-bold text-green-600">
                Xác nhận thành công!
              </h2>

              <p className="mb-6 text-muted-foreground">
                Tài khoản của bạn đã được kích hoạt. Đang chuyển hướng đến trang
                đăng nhập...
              </p>

              <div className="flex items-center justify-center">
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                <span className="text-sm">Đang chuyển hướng...</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-blue-900 dark:to-purple-900">
      {/* Back button */}
      <div className="absolute top-6 left-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/auth/register")}
          className="group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Quay lại
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <Card className="border-0 shadow-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
          <CardHeader className="pb-2 text-center">
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
              <Mail className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold">Xác nhận Email</CardTitle>
            <p className="mt-2 text-lg text-muted-foreground">
              Chúng tôi đã gửi mã xác nhận 6 chữ số đến
            </p>
            <p className="text-lg font-semibold text-blue-600">{email}</p>
          </CardHeader>

          <CardContent className="space-y-8">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-6">
              <div className="text-center">
                <label className="block mb-4 text-lg font-medium">
                  Nhập mã xác nhận
                </label>
                <OTPInput
                  length={6}
                  onComplete={handleOTPComplete}
                  disabled={isVerifying || attempts >= maxAttempts}
                  error={!!error && !isVerifying}
                  success={success}
                />
              </div>

              {isVerifying && (
                <div className="flex items-center justify-center space-x-2 text-blue-600">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-lg">Đang xác nhận...</span>
                </div>
              )}
            </div>

            {/* Resend section */}
            <div className="space-y-4 text-center">
              <p className="text-sm text-muted-foreground">
                Không nhận được mã?
              </p>

              <Button
                variant="outline"
                onClick={handleResendOTP}
                disabled={!canResend || isResending || attempts >= maxAttempts}
                className="w-full h-12"
              >
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
              </Button>

              {attempts > 0 && (
                <p className="text-xs text-orange-600">
                  Đã thử {attempts}/{maxAttempts} lần
                </p>
              )}
            </div>

            {/* Security notes */}
            <div className="pt-4 space-y-3 border-t">
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4" />
                <span>Mã OTP có hiệu lực trong 10 phút</span>
              </div>

              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <Smartphone className="w-4 h-4" />
                <span>Kiểm tra cả thư mục spam</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default EmailVerification;
