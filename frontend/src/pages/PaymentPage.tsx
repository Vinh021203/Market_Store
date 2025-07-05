// pages/PaymentPage.tsx - Thêm logic auto-checking
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import {
  QrCode,
  Copy,
  CheckCircle,
  Clock,
  Package,
  Loader2,
  RefreshCw,
  Shield,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase"; // ✅ Thêm import

const PaymentPage: React.FC = () => {
  const { orderId } = useParams();
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPaid, setIsPaid] = useState(false);

  // ✅ Thêm states cho auto-checking
  const [checkInterval, setCheckInterval] = useState<NodeJS.Timeout | null>(
    null,
  );
  const [checkCount, setCheckCount] = useState(0);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchOrderData();
    }
  }, [orderId]);

  // ✅ Thêm auto-checking khi đã load order data
  useEffect(() => {
    if (orderData && !isPaid) {
      startAutoChecking();
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval);
    };
  }, [orderData, isPaid]);

  const fetchOrderData = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/api/payment/order/${orderId}`);
      const result = await response.json();

      if (result.success) {
        setOrderData(result.data);
        setIsPaid(result.data.order.payment_status === "completed");
      } else {
        toast({
          title: "❌ Lỗi",
          description: "Không tìm thấy đơn hàng",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Thêm function auto-checking (giống VietQRPayment)
  const startAutoChecking = () => {
    const pollInterval = setInterval(async () => {
      try {
        setCheckCount((prev) => prev + 1);
        console.log(
          `🔍 Auto-checking payment status (attempt ${checkCount + 1})`,
        );

        const { data: orderData, error } = await supabase
          .from("orders")
          .select("payment_status, status, updated_at")
          .eq("id", orderId)
          .single();

        if (!error && orderData) {
          console.log("📊 Current order status:", orderData);

          if (
            (orderData.status === "completed" ||
              orderData.status === "processing") &&
            (orderData.payment_status === "completed" ||
              orderData.payment_status === "processing")
          ) {
            console.log("🎉 Payment confirmed by SePay webhook!");
            setIsPaid(true);
            clearInterval(pollInterval);

            toast({
              title: "Thanh toán thành công!",
              description: "Đã nhận được xác nhận từ ngân hàng qua SePay",
            });
          }
        }
      } catch (error) {
        console.error("Auto-checking error:", error);
      }
    }, 5000);

    setCheckInterval(pollInterval);

    // Timeout sau 30 phút
    setTimeout(
      () => {
        if (pollInterval) {
          clearInterval(pollInterval);
          console.log("⏰ Payment timeout");
          toast({
            title: "Hết thời gian thanh toán",
            description: "Vui lòng tạo đơn hàng mới để thanh toán",
            variant: "destructive",
          });
        }
      },
      30 * 60 * 1000,
    );
  };

  // ✅ Thêm function check manual
  const checkPaymentStatus = async () => {
    if (checking) return;

    setChecking(true);
    try {
      const { data: orderData, error } = await supabase
        .from("orders")
        .select("payment_status, status, updated_at")
        .eq("id", orderId)
        .single();

      if (
        !error &&
        orderData &&
        (orderData.payment_status === "completed" ||
          orderData.payment_status === "processing")
      ) {
        setIsPaid(true);
        toast({
          title: "🎉 Thanh toán thành công!",
          description: "Đơn hàng đã được xác nhận.",
        });
      } else {
        toast({
          title: "⏳ Chưa nhận được thanh toán",
          description: "Vui lòng thử lại sau vài giây.",
        });
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
    } finally {
      setChecking(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-12 h-12 mx-auto mb-4 text-blue-500 animate-spin" />
            <h2 className="mb-2 text-xl font-semibold">Đang tải...</h2>
            <p className="text-muted-foreground">Vui lòng đợi trong giây lát</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
              <Package className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="mb-2 text-xl font-semibold text-red-600">
              Không tìm thấy đơn hàng
            </h2>
            <p className="text-muted-foreground">
              Đơn hàng không tồn tại hoặc đã bị xóa.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { order, payment } = orderData;

  // ✅ Thêm success state
  if (isPaid) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Card className="border-0 shadow-2xl">
            <CardContent className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="flex items-center justify-center w-20 h-20 mx-auto mb-6 bg-green-500 rounded-full"
              >
                <CheckCircle className="w-10 h-10 text-white" />
              </motion.div>

              <h2 className="mb-4 text-2xl font-bold text-green-600">
                Thanh toán thành công!
              </h2>

              <p className="mb-6 text-muted-foreground">
                Đơn hàng <strong>#{order.id.slice(0, 8)}</strong> đã được thanh
                toán. Bạn sẽ nhận được email xác nhận trong vài phút.
              </p>

              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-green-50">
                  <div className="text-2xl font-bold text-green-600">
                    {formatPrice(order.total_price)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Đã thanh toán
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container max-w-4xl px-4 mx-auto">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Order Info */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="w-5 h-5" />
                <span>Thông tin đơn hàng</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Mã đơn hàng:</span>
                <Badge variant="outline">#{order.id.slice(0, 8)}</Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Khách hàng:</span>
                <span className="font-medium">{order.customer_name}</span>
              </div>

              <Separator />

              <div className="flex items-center justify-between text-lg font-bold">
                <span>Tổng cộng:</span>
                <span className="text-primary">
                  {formatPrice(order.total_price)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Payment QR */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <QrCode className="w-5 h-5" />
                <span>Thanh toán VietQR</span>
                {checking && <Loader2 className="w-4 h-4 animate-spin" />}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* QR Code */}
              <div className="text-center">
                <img
                  src={payment.qrUrl}
                  alt="VietQR Code"
                  className="w-64 h-64 mx-auto border rounded-lg shadow-md"
                />
                <p className="mt-2 text-sm text-muted-foreground">
                  Quét mã QR bằng app ngân hàng để thanh toán
                </p>
              </div>

              {/* Bank Info */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Ngân hàng:</span>
                  <span className="font-medium">
                    {payment.bankInfo.bankName}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Số tài khoản:</span>
                  <span className="font-medium">
                    {payment.bankInfo.accountNumber}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Nội dung CK:</span>
                  <code className="px-2 py-1 font-mono text-sm bg-gray-100 rounded">
                    {payment.content}
                  </code>
                </div>
              </div>

              {/* ✅ Thêm Status Check Button */}
              <div className="pt-4 border-t">
                <Button
                  onClick={checkPaymentStatus}
                  disabled={checking}
                  className="w-full"
                  variant="outline"
                >
                  {checking ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang kiểm tra...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Kiểm tra thanh toán
                    </>
                  )}
                </Button>

                <div className="flex items-center justify-center mt-3 space-x-2 text-sm text-blue-600">
                  <Shield className="w-4 h-4" />
                  <span>Xác thực tự động qua SePay ({checkCount})</span>
                </div>
                <div className="mt-1 text-xs text-center text-gray-500">
                  Hệ thống sẽ tự động xác nhận khi nhận được tiền
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
