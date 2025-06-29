// pages/auth/Login.tsx - Modern design tương tự Register
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
  Zap,
  LayoutGrid,
  Users,
  Code,
  Palette,
  ArrowLeft,
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

  // ✅ Animation variants
  const textRevealVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        damping: 10,
        stiffness: 100,
        staggerChildren: 0.1,
      },
    },
  };

  const itemSlideInVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="flex min-h-screen">
      {/* ✅ Back to Home Button - Fixed Position */}
      <div className="fixed z-50 top-6 left-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/")}
          className="text-white shadow-lg border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/20"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Về trang chủ
        </Button>
      </div>

      {/* ✅ Left Side - Enhanced Branding (Tương tự Register) */}
      <div className="relative hidden w-1/2 overflow-hidden bg-slate-900 lg:flex">
        {/* ✅ Enhanced Background */}
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          style={{
            background: `
              radial-gradient(at 20% 50%, hsla(240, 70%, 40%, 0.8) 0px, transparent 50%),
              radial-gradient(at 80% 30%, hsla(250, 70%, 45%, 0.7) 0px, transparent 50%),
              radial-gradient(at 50% 90%, hsla(260, 70%, 50%, 0.6) 0px, transparent 50%)
            `,
            backgroundSize: "200% 200%",
            animation: "gradientShift 30s ease infinite",
          }}
        />

        {/* ✅ Floating Shapes */}
        <motion.div
          className="absolute w-40 h-40 rounded-full bg-indigo-400/10 blur-xl"
          style={{ top: "10%", left: "15%" }}
          animate={{
            y: ["0%", "10%", "0%"],
            x: ["0%", "5%", "0%"],
            rotate: [0, 5, 0, -5, 0],
            scale: [1, 1.02, 1],
            opacity: [0.3, 0.4, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse" as const,
            ease: "easeInOut" as const,
          }}
        />
        <motion.div
          className="absolute rounded-full h-60 w-60 bg-purple-400/10 blur-xl"
          style={{ bottom: "5%", right: "20%" }}
          animate={{
            y: ["0%", "-10%", "0%"],
            x: ["0%", "-5%", "0%"],
            rotate: [0, -5, 0, 5, 0],
            scale: [1, 1.03, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            repeatType: "reverse" as const,
            ease: "easeInOut" as const,
          }}
        />
        <motion.div
          className="absolute w-32 h-32 rounded-xl bg-blue-400/10 blur-xl"
          style={{ top: "40%", right: "10%" }}
          animate={{
            y: ["0%", "15%", "0%"],
            x: ["0%", "8%", "0%"],
            rotate: [0, 10, 0, -10, 0],
            scale: [1, 1.05, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            repeatType: "reverse" as const,
            ease: "easeInOut" as const,
          }}
        />

        {/* ✅ Main Content - Căn đều và to hơn */}
        <motion.div
          className="relative z-10 flex flex-col justify-center px-20 text-white"
          variants={textRevealVariants}
          initial="hidden"
          animate="visible"
        >
          {/* ✅ Logo - To hơn */}
          <motion.div
            variants={itemSlideInVariants}
            className="flex items-center mb-12"
          >
            <LayoutGrid className="mr-5 text-indigo-300 h-14 w-14" />
            <div>
              <h1 className="text-5xl font-extrabold tracking-tight">
                Template Market
              </h1>
              <p className="mt-2 text-lg text-indigo-200">
                Welcome back to creativity
              </p>
            </div>
          </motion.div>

          {/* ✅ Main Heading - To hơn và căn đều */}
          <motion.h2
            variants={itemSlideInVariants}
            className="mb-8 text-6xl font-bold leading-tight"
          >
            Chào mừng
            <span className="block text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text">
              Trở lại!
            </span>
          </motion.h2>

          <motion.p
            variants={itemSlideInVariants}
            className="mb-12 text-2xl leading-relaxed text-indigo-100 opacity-90"
          >
            Tiếp tục hành trình sáng tạo với hàng nghìn template và e-book chất
            lượng cao
          </motion.p>

          {/* ✅ Features - To hơn và spacing đều */}
          <motion.div
            variants={textRevealVariants}
            initial="hidden"
            animate="visible"
            className="mb-12 space-y-6 text-xl"
          >
            <motion.div
              variants={itemSlideInVariants}
              className="flex items-center"
            >
              <CheckCircle className="w-8 h-8 mr-6 text-green-400" />
              <span>Truy cập ngay vào thư viện templates cao cấp</span>
            </motion.div>
            <motion.div
              variants={itemSlideInVariants}
              className="flex items-center"
            >
              <Star className="w-8 h-8 mr-6 text-yellow-400" />
              <span>Download không giới hạn tất cả sản phẩm</span>
            </motion.div>
            <motion.div
              variants={itemSlideInVariants}
              className="flex items-center"
            >
              <Shield className="w-8 h-8 mr-6 text-blue-400" />
              <span>Tài khoản được bảo mật tuyệt đối</span>
            </motion.div>
            <motion.div
              variants={itemSlideInVariants}
              className="flex items-center"
            >
              <Users className="w-8 h-8 mr-6 text-purple-400" />
              <span>Tham gia cộng đồng 50,000+ designer</span>
            </motion.div>
          </motion.div>

          {/* ✅ Welcome Back Message - Enhanced */}
          <motion.div
            className="p-8 border rounded-2xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-sm border-indigo-400/30"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center mb-4">
              <Trophy className="w-10 h-10 mr-4 text-yellow-400" />
              <p className="text-2xl font-bold text-indigo-300">
                🎉 Chào mừng bạn trở lại!
              </p>
            </div>
            <p className="text-lg text-indigo-200">
              Hãy tiếp tục khám phá những template mới nhất và tạo ra những tác
              phẩm tuyệt vời
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* ✅ Right Side - Enhanced Login Form */}
      <div className="flex items-center justify-center flex-1 px-4 py-12 bg-slate-950 sm:px-6 lg:w-1/2 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="w-full max-w-lg"
        >
          <Card className="p-8 border border-indigo-800 shadow-2xl rounded-xl bg-slate-900 sm:p-10">
            <CardHeader className="mb-6 text-center">
              <div className="flex items-center justify-center mb-4">
                <motion.div
                  className="flex items-center justify-center w-16 h-16 rounded-full shadow-lg bg-gradient-to-r from-indigo-600 to-purple-700"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  <motion.div
                    animate={{
                      rotate: [0, 360],
                      scale: [1, 1.1, 1],
                      opacity: [1, 0.8, 1],
                    }}
                    transition={{
                      duration: 8,
                      ease: "linear",
                      repeat: Infinity,
                    }}
                  >
                    <Shield className="w-8 h-8 text-white" />
                  </motion.div>
                </motion.div>
              </div>
              <CardTitle className="text-3xl font-bold text-white">
                Chào mừng trở lại!
              </CardTitle>
              <CardDescription className="mt-2 text-base text-gray-400">
                Đăng nhập để tiếp tục hành trình sáng tạo của bạn.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Alert
                      variant="destructive"
                      className="text-red-300 border-red-700 bg-red-900/30"
                    >
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                {/* ✅ Email Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-300"
                  >
                    Địa chỉ email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@email.com"
                      {...register("email")}
                      className={`h-11 pl-10 text-white ${
                        errors.email
                          ? "border-red-500 ring-red-500"
                          : "border-slate-700 focus:ring-indigo-500"
                      } bg-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-offset-0`}
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-400">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* ✅ Password Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-300"
                  >
                    Mật khẩu
                  </Label>
                  <div className="relative">
                    <Lock className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu"
                      {...register("password")}
                      className={`h-11 pl-10 pr-12 text-white ${
                        errors.password
                          ? "border-red-500 ring-red-500"
                          : "border-slate-700 focus:ring-indigo-500"
                      } bg-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-offset-0`}
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute text-gray-400 -translate-y-1/2 right-3 top-1/2 hover:text-gray-300"
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
                    <p className="text-sm text-red-400">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* ✅ Remember & Forgot */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="w-4 h-4 text-indigo-500 border-gray-600 rounded bg-slate-800 focus:ring-indigo-500"
                    />
                    <label
                      htmlFor="remember-me"
                      className="block ml-2 text-sm text-gray-400"
                    >
                      Ghi nhớ đăng nhập
                    </label>
                  </div>

                  <Link
                    to="/auth/forgot-password"
                    className="text-sm font-medium text-indigo-500 hover:text-indigo-400"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>

                {/* ✅ Submit Button */}
                <Button
                  type="submit"
                  className="group h-12 w-full rounded-lg bg-gradient-to-r from-indigo-600 to-purple-700 font-medium text-white shadow-lg transition-all duration-300 hover:from-indigo-700 hover:to-purple-800 hover:shadow-xl active:scale-[0.98]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {loadingStage || "Đang đăng nhập..."}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <span>Đăng nhập</span>
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
                    </div>
                  )}
                </Button>
              </form>

              {/* ✅ Social Login */}
              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-700" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 text-gray-500 bg-slate-900">
                      Hoặc đăng nhập với
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 mt-6 sm:grid-cols-2">
                  <Button
                    variant="outline"
                    className="h-11 w-full justify-center border-slate-700 bg-slate-800 text-gray-300 hover:border-slate-600 hover:bg-slate-700 hover:text-white active:scale-[0.98]"
                    disabled={isSubmitting}
                  >
                    <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24">
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
                    className="h-11 w-full justify-center border-slate-700 bg-slate-800 text-gray-300 hover:border-slate-600 hover:bg-slate-700 hover:text-white active:scale-[0.98]"
                    disabled={isSubmitting}
                  >
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span className="ml-2">Facebook</span>
                  </Button>
                </div>
              </div>

              {/* ✅ Register Link */}
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-400">
                  Chưa có tài khoản?{" "}
                  <Link
                    to="/auth/register"
                    className="font-medium text-indigo-500 transition-colors hover:text-indigo-400"
                  >
                    Đăng ký ngay
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ✅ Security Note */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              <Sparkles className="inline-block w-3 h-3 mr-1 text-gray-500 align-middle" />{" "}
              Đăng nhập an toàn với mã hóa SSL 256-bit
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
