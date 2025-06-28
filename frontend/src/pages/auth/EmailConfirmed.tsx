// pages/auth/EmailConfirmed.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { motion } from "framer-motion";

const EmailConfirmed: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        // ✅ Supabase tự động handle confirmation qua URL
        // Chỉ cần check session
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) throw error;

        if (session?.user) {
          console.log("✅ Email confirmed successfully");
          setStatus("success");
          setMessage("Email đã được xác nhận thành công! Đang chuyển hướng...");

          // ✅ Tạo profile nếu chưa có
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (!profile) {
            await supabase.from("profiles").insert({
              id: session.user.id,
              name:
                session.user.user_metadata?.name ||
                session.user.email?.split("@")[0] ||
                "User",
              role: "customer",
              avatar: "",
              email: session.user.email,
              created_at: new Date().toISOString(),
            });
          }

          // ✅ Redirect sau 3 giây
          setTimeout(() => {
            navigate("/auth/login?confirmed=true");
          }, 3000);
        } else {
          throw new Error("No session found");
        }
      } catch (error: any) {
        console.error("❌ Email confirmation failed:", error);
        setStatus("error");
        setMessage(
          "Xác nhận email thất bại. Link có thể đã hết hạn hoặc không hợp lệ.",
        );
      }
    };

    confirmEmail();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl">
          <CardContent className="p-8 text-center">
            {status === "loading" && (
              <>
                <Loader2 className="w-16 h-16 mx-auto mb-4 text-blue-500 animate-spin" />
                <h2 className="mb-2 text-2xl font-bold">
                  Đang xác nhận email...
                </h2>
                <p className="text-muted-foreground">
                  Vui lòng đợi trong giây lát
                </p>
              </>
            )}

            {status === "success" && (
              <>
                <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                <h2 className="mb-2 text-2xl font-bold text-green-600">
                  Xác nhận thành công!
                </h2>
                <p className="mb-4 text-muted-foreground">{message}</p>
              </>
            )}

            {status === "error" && (
              <>
                <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
                <h2 className="mb-2 text-2xl font-bold text-red-600">
                  Xác nhận thất bại
                </h2>
                <p className="mb-4 text-muted-foreground">{message}</p>
                <a
                  href="/auth/register"
                  className="text-blue-600 hover:underline"
                >
                  Thử đăng ký lại
                </a>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default EmailConfirmed;
