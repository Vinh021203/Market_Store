// pages/auth/ResetPassword.tsx
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
import { motion } from "framer-motion";
import {
  Lock,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
  Shield,
  Key,
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    const validateToken = async () => {
      const code = searchParams.get("code");
      const email = searchParams.get("email");

      if (!code || !email) {
        setError("Link đặt lại mật khẩu không hợp lệ.");
        setIsValidating(false);
        return;
      }

      try {
        const { data, error } = await supabase.auth.verifyOtp({
          type: "recovery",
          token: code,
          email: email,
        });

        if (error) throw error;

        if (data.session) {
          setIsValidToken(true);
        } else {
          setError("Phiên đăng nhập không hợp lệ.");
        }
      } catch (error: any) {
        console.error("Token validation error:", error);
        setError("Link đặt lại mật khẩu đã hết hạn hoặc không hợp lệ.");
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
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

  if (isValidating) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-blue-900 dark:to-purple-900">
        <Card className="w-full max-w-md shadow-2xl">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-12 h-12 mx-auto mb-4 text-blue-500 animate-spin" />
            <h2 className="mb-2 text-xl font-semibold">Đang xác thực...</h2>
            <p className="text-muted-foreground">Vui lòng đợi trong giây lát</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-slate-900 dark:via-red-900 dark:to-orange-900">
        <Card className="w-full max-w-md shadow-2xl">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full dark:bg-red-900/20">
              <Shield className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="mb-4 text-xl font-semibold text-red-600">
              Link không hợp lệ
            </h2>
            <p className="mb-6 text-muted-foreground">{error}</p>
            <Button
              onClick={() => navigate("/auth/forgot-password")}
              className="w-full"
            >
              Yêu cầu link mới
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-slate-900 dark:via-green-900 dark:to-emerald-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="border-0 shadow-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-600">
              <Key className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Đặt lại mật khẩu
            </CardTitle>
            <p className="text-muted-foreground">
              Nhập mật khẩu mới cho tài khoản của bạn
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Mật khẩu mới
                </Label>
                <div className="relative">
                  <Lock className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Tối thiểu 6 ký tự"
                    {...register("password")}
                    className={`pl-10 pr-12 h-11 ${
                      errors.password
                        ? "border-red-500 focus:ring-red-500"
                        : "focus:ring-green-500"
                    }`}
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute text-gray-400 transform -translate-y-1/2 right-3 top-1/2 hover:text-gray-600"
                    disabled={isSubmitting}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium"
                >
                  Xác nhận mật khẩu
                </Label>
                <div className="relative">
                  <Lock className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu mới"
                    {...register("confirmPassword")}
                    className={`pl-10 pr-12 h-11 ${
                      errors.confirmPassword
                        ? "border-red-500 focus:ring-red-500"
                        : "focus:ring-green-500"
                    }`}
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute text-gray-400 transform -translate-y-1/2 right-3 top-1/2 hover:text-gray-600"
                    disabled={isSubmitting}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang cập nhật...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Cập nhật mật khẩu
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-muted-foreground">
                <Shield className="inline w-3 h-3 mr-1" />
                Mật khẩu được mã hóa an toàn
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
