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

  if (isEmailSent) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-slate-900 dark:via-green-900 dark:to-emerald-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg"
        >
          <Card className="border-0 shadow-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
            <CardContent className="p-10 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-600"
              >
                <CheckCircle className="w-10 h-10 text-white" />
              </motion.div>

              <h2 className="mb-4 text-3xl font-bold">Email đã được gửi!</h2>

              <p className="mb-2 text-lg text-muted-foreground">
                Chúng tôi đã gửi link đặt lại mật khẩu đến
              </p>
              <p className="mb-8 text-lg font-semibold text-blue-600">
                {getValues("email")}
              </p>

              <div className="space-y-6">
                {countdown > 0 && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <div className="flex items-center justify-center mb-2 space-x-2 text-blue-700 dark:text-blue-300">
                      <Clock className="w-5 h-5" />
                      <span className="font-medium">
                        Link có hiệu lực trong:
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {formatTime(countdown)}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                    <AlertTriangle className="w-5 h-5 mx-auto mb-2 text-orange-600" />
                    <p className="text-sm text-orange-700 dark:text-orange-300">
                      Kiểm tra thư mục spam
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                    <Mail className="w-5 h-5 mx-auto mb-2 text-purple-600" />
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      Có thể mất vài phút
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button asChild className="w-full h-12">
                    <Link to="/auth/login">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Quay lại đăng nhập
                    </Link>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setIsEmailSent(false)}
                    className="w-full h-12"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Gửi lại email
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-slate-900 dark:via-orange-900 dark:to-red-900">
      {/* Back button */}
      <div className="absolute top-6 left-6">
        <Button variant="outline" size="sm" asChild className="group">
          <Link to="/auth/login">
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Quay lại đăng nhập
          </Link>
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <Card className="border-0 shadow-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-orange-500 to-red-600">
              <Key className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold">Quên mật khẩu?</CardTitle>
            <p className="mt-2 text-lg text-muted-foreground">
              Nhập email để nhận link đặt lại mật khẩu
            </p>
          </CardHeader>

          <CardContent className="space-y-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-3">
                <Label htmlFor="email" className="text-lg font-medium">
                  Địa chỉ email
                </Label>
                <div className="relative">
                  <Mail className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-4 top-1/2" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    {...register("email")}
                    className={`pl-12 h-14 text-lg ${
                      errors.email
                        ? "border-red-500 focus:ring-red-500"
                        : "focus:ring-orange-500"
                    }`}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full text-lg h-14 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Gửi link đặt lại
                  </>
                )}
              </Button>
            </form>

            <div className="space-y-4 text-center">
              <p className="text-sm text-muted-foreground">
                Nhớ lại mật khẩu?{" "}
                <Link
                  to="/auth/login"
                  className="font-medium text-orange-600 hover:text-orange-500"
                >
                  Đăng nhập ngay
                </Link>
              </p>

              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground">
                  <Shield className="inline w-3 h-3 mr-1" />
                  Link đặt lại mật khẩu có hiệu lực trong 5 phút
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
