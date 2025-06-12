import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Order, OrderItemUI } from "@/types";
import { getOrderWithItems } from "@/lib/order";
import { formatPrice } from "@/lib/products";
import {
  Package,
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
} from "lucide-react";

interface OrderDetailModalProps {
  orderId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  orderId,
  isOpen,
  onClose,
}) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (orderId && isOpen) {
      fetchOrderDetails();
    }
  }, [orderId, isOpen]);

  const fetchOrderDetails = async () => {
    if (!orderId) return;

    setLoading(true);
    try {
      const orderData = await getOrderWithItems(orderId);
      setOrder(orderData);
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "processing":
        return <Truck className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "completed":
        return "default";
      case "processing":
        return "secondary";
      case "pending":
        return "outline";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getPaymentColor = (status: Order["payment_status"]) => {
    switch (status) {
      case "paid":
        return "default";
      case "pending":
        return "secondary";
      case "failed":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusText = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "Chờ xử lý";
      case "processing":
        return "Đang xử lý";
      case "completed":
        return "Hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  const getPaymentText = (status: Order["payment_status"]) => {
    switch (status) {
      case "paid":
        return "Đã thanh toán";
      case "pending":
        return "Chờ thanh toán";
      case "failed":
        return "Thất bại";
      default:
        return "Không xác định";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Chi tiết đơn hàng #{orderId}
          </DialogTitle>
          <DialogDescription>
            Xem thông tin chi tiết về đơn hàng, trạng thái thanh toán và danh
            sách sản phẩm
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="ml-2">Đang tải...</span>
            </div>
          ) : order ? (
            <div className="space-y-6">
              {/* Thông tin trạng thái */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Trạng thái
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {getStatusIcon(order.status)}
                          <Badge variant={getStatusColor(order.status)}>
                            {getStatusText(order.status)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Thanh toán
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <CreditCard className="w-4 h-4" />
                          <Badge
                            variant={getPaymentColor(order.payment_status)}
                          >
                            {getPaymentText(order.payment_status)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div>
                      <p className="text-sm text-muted-foreground">Tổng tiền</p>
                      <p className="mt-1 text-2xl font-bold text-primary">
                        {formatPrice(order.total_price || 0)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Thông tin khách hàng */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Thông tin khách hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Họ tên</p>
                        <p className="font-medium">
                          {order.full_name || "Không có"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">
                          {order.email || "Không có"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Số điện thoại
                        </p>
                        <p className="font-medium">
                          {order.phone || "Không có"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Địa chỉ</p>
                        <p className="font-medium">
                          {[order.address, order.city, order.country]
                            .filter(Boolean)
                            .join(", ") || "Không có"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Thông tin đơn hàng */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Thông tin đơn hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Ngày tạo</p>
                      <p className="font-medium">
                        {order.created_at
                          ? new Date(order.created_at).toLocaleString("vi-VN")
                          : "Không xác định"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">
                        Phương thức thanh toán
                      </p>
                      <p className="font-medium">
                        {order.payment_method || "Không xác định"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Danh sách sản phẩm */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Sản phẩm ({order.items.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={item.id}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {item.product?.image && (
                              <img
                                src={item.product.image}
                                alt={item.product.title}
                                className="object-cover w-16 h-16 rounded-lg"
                              />
                            )}
                            <div>
                              <h4 className="font-medium">
                                {item.product?.title ||
                                  "Sản phẩm không xác định"}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                Số lượng: {item.quantity}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Đơn giá: {formatPrice(item.price)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                        {index < order.items.length - 1 && (
                          <Separator className="mt-4" />
                        )}
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">Tổng cộng:</span>
                    <span className="text-xl font-bold text-primary">
                      {formatPrice(order.total_price || 0)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">
                Không tìm thấy thông tin đơn hàng
              </p>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailModal;
