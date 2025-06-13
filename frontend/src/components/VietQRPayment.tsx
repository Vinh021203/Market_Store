import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Copy, Clock, Shield } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface VietQRPaymentProps {
  order: {
    id: string;
    total: number;
    email: string;
  };
  onPaymentSuccess: () => void;
}

const VietQRPayment: React.FC<VietQRPaymentProps> = ({
  order,
  onPaymentSuccess,
}) => {
  const [qrData, setQrData] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "success">(
    "pending",
  );
  const [checkInterval, setCheckInterval] = useState<NodeJS.Timeout | null>(
    null,
  );
  const [checkCount, setCheckCount] = useState(0);

  const bankConfig = {
    bankCode: "970422",
    bankName: "MBBANK",
    accountNumber: "0971386588",
    accountName: "LUONG THE VINH",
  };

  useEffect(() => {
    generateQRCode();
    startAutoChecking();

    return () => {
      if (checkInterval) clearInterval(checkInterval);
    };
  }, []);

  // ✅ Chỉ auto-checking, không có manual override
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

          // ✅ Chỉ webhook mới có thể update thành 'completed'
          if (orderData.payment_status === "completed") {
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

    // ✅ Timeout sau 30 phút - không chuyển manual
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
    ); // 30 phút
  };

  // ✅ Giữ nguyên generateQRCode và copyPaymentInfo
  const generateQRCode = () => {
    const qrContent = `https://img.vietqr.io/image/${bankConfig.bankCode}-${bankConfig.accountNumber}-compact2.jpg?amount=${order.total}&addInfo=DH${order.id}&accountName=${encodeURIComponent(bankConfig.accountName)}`;
    setQrData(qrContent);
  };

  const copyPaymentInfo = () => {
    const paymentInfo = `
Ngân hàng: ${bankConfig.bankName}
Số tài khoản: ${bankConfig.accountNumber}
Tên tài khoản: ${bankConfig.accountName}
Số tiền: ${order.total.toLocaleString("vi-VN")} VND
Nội dung: DH${order.id}
    `.trim();

    navigator.clipboard.writeText(paymentInfo);
    toast({
      title: "Đã sao chép",
      description: "Thông tin thanh toán đã được sao chép",
    });
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
        <h2 className="mb-2 text-xl font-semibold">Quét mã QR để thanh toán</h2>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* QR Code - giữ nguyên */}
            <div className="text-center">
              <div className="inline-block p-4 bg-white border-2 border-gray-300 border-dashed rounded-lg">
                <div className="mb-3">
                  <div className="text-lg font-bold text-red-500">VIETQR</div>
                </div>

                <div className="mb-3">
                  <img
                    src={qrData}
                    alt="VietQR Code"
                    className="w-48 h-48 mx-auto"
                  />
                </div>

                <div className="mt-2 text-xs text-gray-600">
                  <div>{bankConfig.accountName}</div>
                  <div>#{order.id.slice(-8)}</div>
                  <div className="font-semibold">
                    {order.total.toLocaleString("vi-VN")} VND
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Details - giữ nguyên */}
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Ngân hàng:</span>
                <span className="font-medium text-blue-600">
                  {bankConfig.bankName}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Số tài khoản:</span>
                <span className="font-mono font-medium">
                  {bankConfig.accountNumber}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Số tiền:</span>
                <span className="text-lg font-semibold text-green-600">
                  {order.total.toLocaleString("vi-VN")} VND
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Nội dung:</span>
                <span className="font-mono text-sm break-all">
                  DH{order.id}
                </span>
              </div>
            </div>

            {/* ✅ Chỉ có Copy button */}
            <div className="space-y-3">
              <Button
                variant="outline"
                onClick={copyPaymentInfo}
                className="w-full"
              >
                <Copy className="w-4 h-4 mr-2" />
                Sao chép thông tin thanh toán
              </Button>
            </div>

            {/* ✅ Auto-checking Status với Security Icon */}
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 text-sm text-blue-600">
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

      {/* ✅ Instructions cập nhật */}
      <div className="space-y-1 text-xs text-center text-gray-500">
        <p>• Mở app ngân hàng và quét mã QR ở trên</p>
        <p>• Hoặc chuyển khoản thủ công với thông tin bên trên</p>
        <p>• Hệ thống sẽ tự động xác nhận trong 30 giây</p>
        <p className="text-blue-600">🔒 Bảo mật: Không thể xác nhận thủ công</p>
      </div>
    </div>
  );
};

export default VietQRPayment;
