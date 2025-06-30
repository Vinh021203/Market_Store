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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-blue-900 dark:to-purple-900">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg"
      >
        <Card className="border-0 shadow-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm">
          <CardContent className="p-10 text-center">
            <AnimatePresence mode="wait">
              {status === "loading" && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Loader2 className="w-20 h-20 mx-auto mb-6 text-blue-500" />
                  </motion.div>
                  <h2 className="mb-4 text-3xl font-bold">
                    Đang xác nhận email...
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    Vui lòng đợi trong giây lát
                  </p>
                  <div className="mt-6">
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <motion.div
                        className="h-2 bg-blue-500 rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 3, ease: "easeInOut" }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {status === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    className="flex items-center justify-center w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-600"
                  >
                    <CheckCircle className="w-12 h-12 text-white" />
                  </motion.div>

                  <h2 className="mb-4 text-3xl font-bold text-green-600">
                    Xác nhận thành công!
                  </h2>

                  <p className="mb-6 text-lg text-muted-foreground">
                    {message}
                  </p>

                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                      <p className="font-medium text-green-700 dark:text-green-300">
                        🎉 Tài khoản của bạn đã được kích hoạt thành công!
                      </p>
                    </div>

                    <div className="flex items-center justify-center space-x-2 text-blue-600">
                      <span>Chuyển hướng trong {countdown}s</span>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <Loader2 className="w-4 h-4" />
                      </motion.div>
                    </div>

                    <Button
                      onClick={() => navigate("/auth/login?confirmed=true")}
                      className="w-full h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                    >
                      Đăng nhập ngay
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {status === "error" && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    className="flex items-center justify-center w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-red-500 to-pink-600"
                  >
                    <XCircle className="w-12 h-12 text-white" />
                  </motion.div>

                  <h2 className="mb-4 text-3xl font-bold text-red-600">
                    Xác nhận thất bại
                  </h2>

                  <p className="mb-6 text-lg text-muted-foreground">
                    {message}
                  </p>

                  <div className="space-y-4">
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
                      <p className="text-sm text-red-700 dark:text-red-300">
                        💡 Gợi ý: Kiểm tra email mới nhất hoặc thử đăng ký lại
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <Button
                        onClick={handleRetry}
                        variant="outline"
                        className="h-12"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Thử lại
                      </Button>

                      <Button
                        onClick={() => navigate("/auth/register")}
                        className="h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      >
                        Đăng ký lại
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>

                    <Button
                      onClick={() => navigate("/auth/login")}
                      variant="ghost"
                      className="w-full"
                    >
                      Quay lại đăng nhập
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default EmailConfirmed;
