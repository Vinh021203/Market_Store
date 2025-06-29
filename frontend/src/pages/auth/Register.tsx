// pages/auth/Register.tsx - Kết hợp layout đẹp + form design từ file
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { RegisterData } from "@/types";
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  User,
  ArrowRight,
  Sparkles,
  CheckCircle,
  Star,
  Trophy,
  Zap,
  LayoutGrid,
  Shield,
  Users,
  Code,
  Palette,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const registerSchema = z
  .object({
    name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

const Register: React.FC = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingStage, setLoadingStage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterData) => {
    if (!navigator.onLine) {
      setError("Không có kết nối internet. Vui lòng kiểm tra lại.");
      return;
    }

    setError("");
    setIsSubmitting(true);
    setLoadingStage("Đang tạo tài khoản...");

    try {
      setLoadingStage("Đang xác thực thông tin...");
      const success = await registerUser(data);

      if (success) {
        setLoadingStage("Đăng ký thành công!");

        toast({
          title: "Kiểm tra email của bạn",
          description:
            "Chúng tôi đã gửi link xác thực đến email của bạn. Vui lòng click vào link để kích hoạt tài khoản.",
          duration: 10000,
        });

        setTimeout(() => {
          navigate("/auth/login?message=check-email");
        }, 2000);
      }
    } catch (error: any) {
      console.error("Register error:", error);

      if (error.message?.includes("Email này đã được đăng ký")) {
        setError(
          "Email này đã được sử dụng. Vui lòng chọn email khác hoặc đăng nhập.",
        );
      } else if (error.message?.includes("Password")) {
        setError("Mật khẩu không đủ mạnh. Vui lòng chọn mật khẩu khác.");
      } else {
        setError(
          error.message || "Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.",
        );
      }
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

  const floatingShapeVariants = {
    animate: {
      y: ["0%", "10%", "0%"],
      x: ["0%", "5%", "0%"],
      rotate: [0, 5, 0, -5, 0],
      scale: [1, 1.02, 1],
      opacity: [0.3, 0.4, 0.3],
      transition: {
        duration: Math.random() * 10 + 10,
        repeat: Infinity,
        repeatType: "reverse" as const,
        ease: "easeInOut" as const,
      },
    },
  };

  return (
    <div className="flex min-h-screen">
      {/* ✅ Left Side - Enhanced Branding (Tăng kích thước và căn đều) */}
      <div className="relative hidden w-1/2 overflow-hidden bg-slate-900 lg:flex">
        {/* ✅ Enhanced Background với CSS keyframes */}
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          style={{
            background: `
              radial-gradient(at 20% 50%, hsla(160, 70%, 40%, 0.8) 0px, transparent 50%),
              radial-gradient(at 80% 30%, hsla(170, 70%, 45%, 0.7) 0px, transparent 50%),
              radial-gradient(at 50% 90%, hsla(190, 70%, 50%, 0.6) 0px, transparent 50%)
            `,
            backgroundSize: "200% 200%",
            animation: "gradientShift 30s ease infinite",
          }}
        />

        {/* ✅ Floating Shapes - Enhanced */}
        <motion.div
          className="absolute w-40 h-40 rounded-full bg-emerald-400/10 blur-xl"
          variants={floatingShapeVariants}
          style={{ top: "10%", left: "15%" }}
          animate="animate"
        />
        <motion.div
          className="absolute rounded-full h-60 w-60 bg-teal-400/10 blur-xl"
          variants={floatingShapeVariants}
          style={{ bottom: "5%", right: "20%" }}
          animate="animate"
        />
        <motion.div
          className="absolute w-32 h-32 rounded-xl bg-cyan-400/10 blur-xl"
          variants={floatingShapeVariants}
          style={{ top: "40%", right: "10%" }}
          animate="animate"
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
            <LayoutGrid className="mr-5 h-14 w-14 text-emerald-300" />
            <div>
              <h1 className="text-5xl font-extrabold tracking-tight">
                Template Market
              </h1>
              <p className="mt-2 text-lg text-emerald-200">
                Where creativity meets technology
              </p>
            </div>
          </motion.div>

          {/* ✅ Main Heading - To hơn và căn đều */}
          <motion.h2
            variants={itemSlideInVariants}
            className="mb-8 text-6xl font-bold leading-tight"
          >
            Tham gia
            <span className="block text-transparent bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text">
              Cộng đồng
            </span>
            <span className="block">Sáng tạo!</span>
          </motion.h2>

          <motion.p
            variants={itemSlideInVariants}
            className="mb-12 text-2xl leading-relaxed text-emerald-100 opacity-90"
          >
            Khám phá hàng nghìn template chất lượng cao và tài nguyên thiết kế
            độc quyền
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
              <Trophy className="w-8 h-8 mr-6 text-yellow-400" />
              <span>Truy cập không giới hạn 1000+ templates cao cấp</span>
            </motion.div>
            <motion.div
              variants={itemSlideInVariants}
              className="flex items-center"
            >
              <Star className="w-8 h-8 mr-6 text-yellow-400" />
              <span>Thư viện e-books độc quyền, cập nhật liên tục</span>
            </motion.div>
            <motion.div
              variants={itemSlideInVariants}
              className="flex items-center"
            >
              <Zap className="w-8 h-8 mr-6 text-yellow-400" />
              <span>Công cụ AI hỗ trợ sáng tạo mạnh mẽ</span>
            </motion.div>
            <motion.div
              variants={itemSlideInVariants}
              className="flex items-center"
            >
              <CheckCircle className="w-8 h-8 mr-6 text-green-400" />
              <span>Cộng đồng hỗ trợ sôi nổi, chia sẻ kinh nghiệm</span>
            </motion.div>
          </motion.div>

          {/* ✅ Special Offer - Enhanced */}
          <motion.div
            className="p-8 border rounded-2xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-sm border-emerald-400/30"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center mb-4">
              <Zap className="w-10 h-10 mr-4 text-yellow-400" />
              <p className="text-2xl font-bold text-emerald-300">
                🚀 50% OFF cho 100 người đầu tiên!
              </p>
            </div>
            <p className="text-lg text-emerald-200">
              Đăng ký ngay để không bỏ lỡ cơ hội vàng này
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* ✅ Right Side - Form từ file bạn cung cấp */}
      <div className="flex items-center justify-center flex-1 px-4 py-12 bg-slate-950 sm:px-6 lg:w-1/2 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="w-full max-w-lg"
        >
          <Card className="p-8 border shadow-2xl rounded-xl border-emerald-800 bg-slate-900 sm:p-10">
            <CardHeader className="mb-6 text-center">
              <div className="flex items-center justify-center mb-4">
                <motion.div
                  className="flex items-center justify-center w-16 h-16 rounded-full shadow-lg bg-gradient-to-r from-emerald-600 to-teal-700"
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
                    <Sparkles className="w-8 h-8 text-white" />
                  </motion.div>
                </motion.div>
              </div>
              <CardTitle className="text-3xl font-bold text-white">
                Chào mừng bạn!
              </CardTitle>
              <CardDescription className="mt-2 text-base text-gray-400">
                Hãy tạo tài khoản để bắt đầu hành trình sáng tạo của bạn.
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

                {/* ✅ Name and Email in one row */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-sm font-medium text-gray-300"
                    >
                      Họ và tên
                    </Label>
                    <div className="relative">
                      <User className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Nguyễn Văn A"
                        {...register("name")}
                        className={`h-11 pl-10 text-white ${
                          errors.name
                            ? "border-red-500 ring-red-500"
                            : "border-slate-700 focus:ring-emerald-500"
                        } bg-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-offset-0`}
                        disabled={isSubmitting}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-sm text-red-400">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

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
                            : "border-slate-700 focus:ring-emerald-500"
                        } bg-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-offset-0`}
                        disabled={isSubmitting}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-400">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* ✅ Password and Confirm Password in one row */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                        placeholder="Tối thiểu 6 ký tự"
                        {...register("password")}
                        className={`h-11 pl-10 pr-12 text-white ${
                          errors.password
                            ? "border-red-500 ring-red-500"
                            : "border-slate-700 focus:ring-emerald-500"
                        } bg-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-offset-0`}
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

                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-sm font-medium text-gray-300"
                    >
                      Xác nhận mật khẩu
                    </Label>
                    <div className="relative">
                      <Lock className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Nhập lại mật khẩu"
                        {...register("confirmPassword")}
                        className={`h-11 pl-10 pr-12 text-white ${
                          errors.confirmPassword
                            ? "border-red-500 ring-red-500"
                            : "border-slate-700 focus:ring-emerald-500"
                        } bg-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-offset-0`}
                        disabled={isSubmitting}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute text-gray-400 -translate-y-1/2 right-3 top-1/2 hover:text-gray-300"
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
                      <p className="text-sm text-red-400">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* ✅ Terms */}
                <div className="flex items-center">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="w-4 h-4 border-gray-600 rounded bg-slate-800 text-emerald-500 focus:ring-emerald-500"
                  />
                  <label
                    htmlFor="terms"
                    className="block ml-2 text-sm text-gray-400"
                  >
                    Tôi đồng ý với{" "}
                    <Link
                      to="/terms"
                      className="font-medium text-emerald-500 hover:text-emerald-400"
                    >
                      Điều khoản dịch vụ
                    </Link>{" "}
                    và{" "}
                    <Link
                      to="/privacy"
                      className="font-medium text-emerald-500 hover:text-emerald-400"
                    >
                      Chính sách bảo mật
                    </Link>
                  </label>
                </div>

                {/* ✅ Submit Button */}
                <Button
                  type="submit"
                  className="group h-12 w-full rounded-lg bg-gradient-to-r from-emerald-600 to-teal-700 font-medium text-white shadow-lg transition-all duration-300 hover:from-emerald-700 hover:to-teal-800 hover:shadow-xl active:scale-[0.98]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {loadingStage || "Đang đăng ký..."}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <span>Tạo tài khoản</span>
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
                      Hoặc đăng ký với
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

              {/* ✅ Login Link */}
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-400">
                  Đã có tài khoản?{" "}
                  <Link
                    to="/auth/login"
                    className="font-medium transition-colors text-emerald-500 hover:text-emerald-400"
                  >
                    Đăng nhập ngay
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* ✅ Security Note */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              <Sparkles className="inline-block w-3 h-3 mr-1 text-gray-500 align-middle" />{" "}
              Thông tin của bạn được bảo mật tuyệt đối
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
