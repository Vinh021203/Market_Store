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
  ArrowLeft,
  Home,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

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
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

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

  return (
    <div className="flex min-h-screen">
      {/* Back to Home Button - Fixed Position */}
      <div className="fixed z-50 top-6 left-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/")}
          className="border-gray-200 shadow-lg bg-white/90 backdrop-blur-sm hover:bg-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Về trang chủ
        </Button>
      </div>

      {/* Left Side - Branding */}
      <div className="relative hidden overflow-hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center mb-8">
              <Sparkles className="w-8 h-8 mr-3" />
              <h1 className="text-3xl font-bold">Template Market</h1>
            </div>

            <h2 className="mb-6 text-4xl font-bold leading-tight">
              Chào mừng trở lại!
            </h2>

            <p className="mb-8 text-xl text-blue-100">
              Khám phá hàng nghìn template và e-book chất lượng cao
            </p>

            <div className="space-y-4">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-3 text-green-400" />
                <span>Templates chuyên nghiệp</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-3 text-green-400" />
                <span>E-books độc quyền</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-3 text-green-400" />
                <span>Hỗ trợ 24/7</span>
              </div>
            </div>

            {/* Home Link in Branding Section */}
            <div className="mt-8">
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="text-white border-white/30 hover:bg-white/10 hover:border-white/50"
              >
                <Home className="w-4 h-4 mr-2" />
                Khám phá ngay
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute w-32 h-32 rounded-full top-20 right-20 bg-white/10 blur-xl"></div>
        <div className="absolute w-24 h-24 rounded-full bottom-20 left-20 bg-purple-300/20 blur-lg"></div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex items-center justify-center flex-1 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Card className="border-0 shadow-2xl">
            <CardHeader className="pb-8 space-y-1">
              <div className="flex items-center justify-center mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                  <Shield className="w-6 h-6 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-center text-gray-900">
                Đăng nhập tài khoản
              </CardTitle>
              <CardDescription className="text-center text-gray-600">
                Nhập thông tin để truy cập vào tài khoản của bạn
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Địa chỉ email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@email.com"
                      {...register("email")}
                      className={`pl-10 h-12 ${errors.email ? "border-red-500" : "border-gray-300"} focus:border-blue-500 focus:ring-blue-500`}
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700"
                  >
                    Mật khẩu
                  </Label>
                  <div className="relative">
                    <Lock className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu"
                      {...register("password")}
                      className={`pl-10 pr-12 h-12 ${errors.password ? "border-red-500" : "border-gray-300"} focus:border-blue-500 focus:ring-blue-500`}
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

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor="remember-me"
                      className="block ml-2 text-sm text-gray-700"
                    >
                      Ghi nhớ đăng nhập
                    </label>
                  </div>

                  <Link
                    to="/auth/forgot-password"
                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {loadingStage || "Đang đăng nhập..."}
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <span>Đăng nhập</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  )}
                </Button>
              </form>

              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 text-gray-500 bg-white">
                      Hoặc tiếp tục với
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-6">
                  <Button
                    variant="outline"
                    className="w-full border-gray-300 h-11 hover:bg-gray-50"
                    disabled={isSubmitting}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span className="ml-2">Google</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full border-gray-300 h-11 hover:bg-gray-50"
                    disabled={isSubmitting}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span className="ml-2">Facebook</span>
                  </Button>
                </div>
              </div>

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                  Chưa có tài khoản?{" "}
                  <Link
                    to="/auth/register"
                    className="font-medium text-blue-600 transition-colors hover:text-blue-500"
                  >
                    Đăng ký ngay
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Mobile Home Button */}
          <div className="mt-6 text-center lg:hidden">
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="bg-white border-gray-300 hover:bg-gray-50"
            >
              <Home className="w-4 h-4 mr-2" />
              Về trang chủ
            </Button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              Bằng việc đăng nhập, bạn đồng ý với{" "}
              <Link to="/terms" className="text-blue-600 hover:underline">
                Điều khoản dịch vụ
              </Link>{" "}
              và{" "}
              <Link to="/privacy" className="text-blue-600 hover:underline">
                Chính sách bảo mật
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
