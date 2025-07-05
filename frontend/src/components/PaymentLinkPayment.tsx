import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Copy,
  Clock,
  Shield,
  ExternalLink,
  Mail,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface PaymentLinkPaymentProps {
  order: {
    id: string;
    total: number;
    email: string;
  };
  onPaymentSuccess: () => void;
}

const PaymentLinkPayment: React.FC<PaymentLinkPaymentProps> = ({
  order,
  onPaymentSuccess,
}) => {
  const [paymentLink, setPaymentLink] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "success">(
    "pending",
  );
  const [checkInterval, setCheckInterval] = useState<NodeJS.Timeout | null>(
    null,
  );
  const [checkCount, setCheckCount] = useState(0);
  const [linkGenerated, setLinkGenerated] = useState(false);

  useEffect(() => {
    generatePaymentLink();
    startAutoChecking();

    return () => {
      if (checkInterval) clearInterval(checkInterval);
    };
  }, []);

  // ✅ Tạo payment link
  const generatePaymentLink = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/api/payment/create-link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id }),
      });

      const result = await response.json();

      if (result.success) {
        setPaymentLink(result.data.paymentLink);
        setQrUrl(result.data.qrUrl);
        setLinkGenerated(true);

        toast({
          title: "✅ Link đã được tạo",
          description: "Link thanh toán đã sẵn sàng sử dụng.",
        });
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      toast({
        title: "❌ Lỗi",
        description: "Không thể tạo link thanh toán.",
        variant: "destructive",
      });
    }
  };

  // ✅ Auto-checking giống VietQR
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
          .eq("id", order.id)
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
            setPaymentStatus("success");
            clearInterval(pollInterval);

            toast({
              title: "Thanh toán thành công!",
              description: "Đã nhận được xác nhận từ ngân hàng qua SePay",
            });

            setTimeout(() => {
              onPaymentSuccess();
            }, 2000);
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
          console.log("⏰ Payment timeout - please create new order");
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

  // ✅ Copy link
  const copyPaymentLink = () => {
    navigator.clipboard.writeText(paymentLink);
    toast({
      title: "📋 Đã sao chép",
      description: "Link thanh toán đã được sao chép vào clipboard.",
    });
  };

  // ✅ Open link in new tab
  const openPaymentLink = () => {
    window.open(paymentLink, "_blank");
  };

  if (paymentStatus === "success") {
    return (
      <Card className="max-w-md mx-auto text-center">
        <CardContent className="pt-6">
          <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
          <h3 className="mb-2 text-lg font-semibold">Thanh toán thành công!</h3>
          <p className="text-muted-foreground">
            Đã xác nhận tự động qua hệ thống ngân hàng SePay
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-4">
      <div className="text-center">
        <h2 className="mb-2 text-xl font-semibold">Link Thanh Toán</h2>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Payment Link Info */}
            <div className="text-center">
              <div className="inline-block p-4 bg-white border-2 border-indigo-300 border-dashed rounded-lg">
                <div className="mb-3">
                  <div className="text-lg font-bold text-indigo-600">
                    PAYMENT LINK
                  </div>
                </div>

                {linkGenerated && qrUrl && (
                  <div className="mb-3">
                    <img
                      src={qrUrl}
                      alt="Payment QR Code"
                      className="w-48 h-48 mx-auto"
                    />
                  </div>
                )}

                <div className="mt-2 text-xs text-gray-600">
                  <div>Đơn hàng #{order.id.slice(-8)}</div>
                  <div className="font-semibold">
                    {order.total.toLocaleString("vi-VN")} VND
                  </div>
                  <div className="text-indigo-600">Thanh toán từ xa</div>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Đơn hàng:</span>
                <span className="font-mono font-medium">
                  #{order.id.slice(0, 8)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium text-blue-600">{order.email}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Số tiền:</span>
                <span className="text-lg font-semibold text-green-600">
                  {order.total.toLocaleString("vi-VN")} VND
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Trạng thái:</span>
                <span className="text-sm text-indigo-600">
                  {linkGenerated ? "Link đã sẵn sàng" : "Đang tạo link..."}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            {linkGenerated && (
              <div className="space-y-3">
                <Button
                  onClick={openPaymentLink}
                  className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Mở Link Thanh Toán
                </Button>

                <Button
                  variant="outline"
                  onClick={copyPaymentLink}
                  className="w-full"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Sao chép Link
                </Button>
              </div>
            )}

            {/* Auto-checking Status */}
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 text-sm text-indigo-600">
                <Shield className="w-4 h-4" />
                <span>Xác thực tự động qua SePay ({checkCount})</span>
              </div>
              <div className="mt-1 text-xs text-gray-500">
                Hệ thống sẽ tự động xác nhận khi nhận được tiền
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <div className="space-y-1 text-xs text-center text-gray-500">
        <p>• Click "Mở Link Thanh Toán" để thanh toán trên trang mới</p>
        <p>• Hoặc sao chép link để gửi qua email/SMS</p>
        <p>• Quét mã QR bằng app ngân hàng để thanh toán</p>
        <p className="text-indigo-600">🔗 Link có hiệu lực trong 24 giờ</p>
      </div>
    </div>
  );
};

export default PaymentLinkPayment;
