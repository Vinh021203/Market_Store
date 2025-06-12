import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Copy, RefreshCw, Check } from "lucide-react";
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
  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "checking" | "success"
  >("pending");
  const [checkInterval, setCheckInterval] = useState<NodeJS.Timeout | null>(
    null,
  );

  // Cấu hình ngân hàng thật
  const bankConfig = {
    bankCode: "970422", // VCB
    bankName: "MBBANK",
    accountNumber: "0971386588",
    accountName: "LUONG THE VINH",
  };

  useEffect(() => {
    generateQRCode();

    return () => {
      if (checkInterval) clearInterval(checkInterval);
    };
  }, []);

  const generateQRCode = () => {
    // Tạo QR code với VietQR.io - format chuẩn
    const qrContent = `https://img.vietqr.io/image/${bankConfig.bankCode}-${bankConfig.accountNumber}-compact2.jpg?amount=${order.total}&addInfo=DH${order.id}&accountName=${encodeURIComponent(bankConfig.accountName)}`;
    setQrData(qrContent);
  };

  const copyPaymentInfo = () => {
    const paymentInfo = `
Ngân hàng: ${bankConfig.bankName} (VCB)
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

  // Manual payment confirmation
  const handleManualConfirm = async () => {
    const confirmed = confirm("Bạn đã chuyển khoản thành công?");
    if (confirmed) {
      try {
        setPaymentStatus("checking");

        // Cập nhật order status trong Supabase
        const { error } = await supabase
          .from("orders")
          .update({
            status: "completed",
            payment_status: "completed",
            payment_confirmed_at: new Date().toISOString(),
            transaction_id: `VQR_${Date.now()}`,
          })
          .eq("id", order.id);

        if (!error) {
          setPaymentStatus("success");
          setTimeout(() => {
            onPaymentSuccess();
          }, 1500);
        } else {
          throw error;
        }
      } catch (error) {
        console.error("Manual confirm error:", error);
        toast({
          title: "Lỗi xác nhận",
          description: "Không thể xác nhận thanh toán. Vui lòng thử lại.",
          variant: "destructive",
        });
        setPaymentStatus("pending");
      }
    }
  };

  if (paymentStatus === "success") {
    return (
      <Card className="max-w-md mx-auto text-center">
        <CardContent className="pt-6">
          <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
          <h3 className="mb-2 text-lg font-semibold">Thanh toán thành công!</h3>
          <p className="text-muted-foreground">
            Đơn hàng của bạn đã được xác nhận và sẽ được xử lý ngay.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-4">
      {/* Header */}
      <div className="text-center">
        <h2 className="mb-2 text-xl font-semibold">Quét mã QR để thanh toán</h2>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* QR Code với VietQR branding */}
            <div className="text-center">
              <div className="inline-block p-4 bg-white border-2 border-gray-300 border-dashed rounded-lg">
                {/* VietQR Logo */}
                <div className="mb-3">
                  <div className="text-lg font-bold text-red-500">VIETQR</div>
                </div>

                {/* QR Code */}
                <div className="mb-3">
                  <img
                    src={qrData}
                    alt="VietQR Code"
                    className="w-48 h-48 mx-auto"
                    onError={(e) => {
                      e.currentTarget.src =
                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcgUVI8L3RleHQ+PC9zdmc+";
                    }}
                  />
                </div>

                {/* Bank logos */}
                <div className="flex justify-center space-x-2 text-xs text-blue-600">
                  <span>napas 24/7</span>
                  <span>VCB</span>
                </div>

                {/* Order info */}
                <div className="mt-2 text-xs text-gray-600">
                  <div>{bankConfig.accountName}</div>
                  <div>#{order.id.slice(-8)}</div>
                  <div className="font-semibold">
                    {order.total.toLocaleString("vi-VN")} VND
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Ngân hàng:</span>
                <span className="font-medium text-blue-600">
                  {bankConfig.bankName} (VCB)
                </span>
              </div>

              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Số tài khoản:</span>
                <span className="font-mono font-medium">
                  {bankConfig.accountNumber}
                </span>
              </div>

              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Tên tài khoản:</span>
                <span className="font-medium">{bankConfig.accountName}</span>
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

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                variant="outline"
                onClick={copyPaymentInfo}
                className="w-full"
              >
                <Copy className="w-4 h-4 mr-2" />
                Sao chép thông tin thanh toán
              </Button>

              <Button
                onClick={handleManualConfirm}
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={paymentStatus === "checking"}
              >
                {paymentStatus === "checking" ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Đang xác nhận...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Tôi đã chuyển khoản
                  </>
                )}
              </Button>
            </div>

            {/* Status */}
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                <span>Chờ xác nhận thanh toán</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <div className="space-y-1 text-xs text-center text-gray-500">
        <p>• Mở app ngân hàng và quét mã QR ở trên</p>
        <p>• Hoặc chuyển khoản thủ công với thông tin bên trên</p>
        <p>• Sau khi chuyển khoản, nhấn "Tôi đã chuyển khoản"</p>
      </div>
    </div>
  );
};

export default VietQRPayment;
