// pages/PaymentPage.tsx
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
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const PaymentPage: React.FC = () => {
  const { orderId } = useParams();
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchOrderData();
    }
  }, [orderId]);

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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
