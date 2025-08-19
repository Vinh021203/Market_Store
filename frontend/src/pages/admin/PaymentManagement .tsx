import React, { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { isAdmin } from "@/lib/auth";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  ArrowLeft,
  CreditCard,
  Calendar,
  Clock,
  TrendingUp,
  Users,
  RefreshCw,
  Heart,
  Sparkles,
  BarChart3,
  CheckCircle,
  XCircle,
  Info,
  DollarSign,
  Receipt,
  Banknote,
  Wallet,
  Shield,
  Download,
  Printer,
} from "lucide-react";

// Import types và functions
import { Order, PaymentTransaction, PaymentMethod } from "@/types";
import { PAYMENT_METHODS, formatPrice } from "@/lib/payment";

// ✅ Import order functions từ lib/order.ts
import {
  getAllOrders,
  getOrderWithItems,
  updateOrderPaymentStatus,
  updateOrderComplete,
} from "@/lib/order";

// Toast component giống BlogManagement
const FloatingToast = ({
  type = "success",
  title,
  description,
  visible = true,
  onClose,
}: {
  type?: "success" | "error" | "info";
  title: string;
  description?: string;
  visible?: boolean;
  onClose?: () => void;
}) => {
  const iconProps = "w-5 h-5 flex-shrink-0";
  let icon, colorScheme, bgGradient;
  switch (type) {
    case "error":
      icon = <XCircle className={`${iconProps} text-pink-600`} />;
      colorScheme = "text-pink-800";
      bgGradient = "from-pink-50/95 via-orange-50/95 to-white/95";
      break;
    case "info":
      icon = <Info className={`${iconProps} text-sky-600`} />;
      colorScheme = "text-sky-800";
      bgGradient = "from-sky-50/95 via-blue-50/95 to-white/95";
      break;
    default:
      icon = <CheckCircle className={`${iconProps} text-emerald-600`} />;
      colorScheme = "text-emerald-800";
      bgGradient = "from-emerald-50/95 via-green-50/95 to-white/95";
  }
  if (!visible) return null;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, x: 100 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.8, x: 100 }}
      className={`fixed top-6 right-6 z-50 max-w-sm min-w-[300px] p-4 rounded-3xl shadow-2xl backdrop-blur-xl border border-white/30 bg-gradient-to-r ${bgGradient}`}
    >
      <div className="flex items-start gap-3">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
          className="flex-shrink-0 p-2 rounded-2xl bg-white/60"
        >
          {icon}
        </motion.div>
        <div className="flex-1 min-w-0">
          <div className={`font-semibold text-sm ${colorScheme}`}>{title}</div>
          {description && (
            <div className="text-xs mt-1 text-orange-700/70 leading-relaxed">
              {description}
            </div>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 rounded-full hover:bg-white/60 transition-colors"
          >
            <XCircle className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

// Helper functions - CŨ (giữ lại cho backwards compatibility)
const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case "paid":
      return "bg-gradient-to-r from-green-200 to-emerald-200 text-green-800";
    case "pending":
      return "bg-gradient-to-r from-yellow-200 to-amber-200 text-amber-800";
    case "failed":
      return "bg-gradient-to-r from-red-200 to-pink-200 text-red-800";
    default:
      return "bg-gradient-to-r from-gray-200 to-slate-200 text-gray-800";
  }
};

const getPaymentMethodIcon = (method: string) => {
  switch (method) {
    case "vietqr":
      return "🏦";
    case "credit_card":
      return "💳";
    case "bank_transfer":
      return "🏧";
    case "paypal":
      return "🌐";
    default:
      return "💰";
  }
};

// ✅ CÁC FUNCTIONS MỚI XỬ LÝ TRẠNG THÁI ĐƠN HÀNG
const getOrderStatusText = (status: string, paymentStatus: string) => {
  // Ưu tiên hiển thị theo payment_status nếu có
  if (paymentStatus) {
    switch (paymentStatus) {
      case "paid":
      case "completed":
        return "Đã thanh toán";
      case "pending":
      case "processing":
        return "Chờ thanh toán";
      case "failed":
        return "Thanh toán thất bại";
      case "refunded":
        return "Đã hoàn tiền";
      default:
        break;
    }
  }

  // Fallback theo order status
  switch (status) {
    case "completed":
      return "Hoàn thành";
    case "pending":
      return "Đang xử lý";
    case "cancelled":
      return "Đã hủy";
    case "processing":
      return "Đang xử lý";
    default:
      return "Chưa xác định";
  }
};

const getOrderStatusColor = (status: string, paymentStatus: string) => {
  // Ưu tiên theo payment_status
  if (paymentStatus) {
    switch (paymentStatus) {
      case "paid":
      case "completed":
        return "bg-gradient-to-r from-green-200 to-emerald-200 text-green-800";
      case "pending":
      case "processing":
        return "bg-gradient-to-r from-yellow-200 to-amber-200 text-amber-800";
      case "failed":
        return "bg-gradient-to-r from-red-200 to-pink-200 text-red-800";
      case "refunded":
        return "bg-gradient-to-r from-blue-200 to-sky-200 text-blue-800";
      default:
        break;
    }
  }

  // Fallback theo order status
  switch (status) {
    case "completed":
      return "bg-gradient-to-r from-green-200 to-emerald-200 text-green-800";
    case "pending":
    case "processing":
      return "bg-gradient-to-r from-yellow-200 to-amber-200 text-amber-800";
    case "cancelled":
      return "bg-gradient-to-r from-red-200 to-pink-200 text-red-800";
    default:
      return "bg-gradient-to-r from-gray-200 to-slate-200 text-gray-800";
  }
};

const getOrderStatusIcon = (status: string, paymentStatus: string) => {
  if (paymentStatus) {
    switch (paymentStatus) {
      case "paid":
      case "completed":
        return <CheckCircle className="w-3 h-3 mr-1" />;
      case "pending":
      case "processing":
        return <Clock className="w-3 h-3 mr-1" />;
      case "failed":
        return <XCircle className="w-3 h-3 mr-1" />;
      case "refunded":
        return <RefreshCw className="w-3 h-3 mr-1" />;
      default:
        break;
    }
  }

  switch (status) {
    case "completed":
      return <CheckCircle className="w-3 h-3 mr-1" />;
    case "pending":
    case "processing":
      return <Clock className="w-3 h-3 mr-1" />;
    case "cancelled":
      return <XCircle className="w-3 h-3 mr-1" />;
    default:
      return <Info className="w-3 h-3 mr-1" />;
  }
};

// ✅ Function in hóa đơn
const handlePrintInvoice = (order: Order) => {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const invoiceHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Hóa đơn #${order.id}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
        .company-name { font-size: 24px; font-weight: bold; color: #e27d60; }
        .invoice-title { font-size: 20px; margin: 10px 0; }
        .customer-info, .order-info { margin: 20px 0; }
        .label { font-weight: bold; color: #666; }
        .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .table th, .table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        .table th { background-color: #f5f5f5; font-weight: bold; }
        .total { text-align: right; font-size: 18px; font-weight: bold; margin-top: 20px; }
        .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company-name">TEMPLATE MARKET</div>
        <div class="invoice-title">HÓA ĐƠN BÁN HÀNG</div>
        <div>Mã đơn hàng: #${order.id}</div>
      </div>
      
      <div class="customer-info">
        <h3>Thông tin khách hàng:</h3>
        <p><span class="label">Họ tên:</span> ${order.full_name}</p>
        <p><span class="label">Email:</span> ${order.email}</p>
        <p><span class="label">Số điện thoại:</span> ${order.phone}</p>
        <p><span class="label">Địa chỉ:</span> ${order.address}, ${order.city}, ${order.country}</p>
      </div>
      
      <div class="order-info">
        <p><span class="label">Ngày tạo:</span> ${new Date(order.created_at || "").toLocaleString("vi-VN")}</p>
        <p><span class="label">Phương thức thanh toán:</span> ${PAYMENT_METHODS.find((m) => m.id === order.payment_method)?.name || order.payment_method}</p>
        <p><span class="label">Trạng thái:</span> ${getOrderStatusText(order.status || "", order.payment_status || "")}</p>
      </div>
      
      <table class="table">
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th>Số lượng</th>
            <th>Đơn giá</th>
            <th>Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          ${order.items
            .map(
              (item) => `
            <tr>
              <td>${item.product?.title || "Sản phẩm không xác định"}</td>
              <td>${item.quantity}</td>
              <td>${formatPrice(item.price)}</td>
              <td>${formatPrice(item.price * item.quantity)}</td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>
      
      <div class="total">
        <p>Tổng cộng: ${formatPrice(order.total_price || 0)}</p>
      </div>
      
      <div class="footer">
        <p>Cảm ơn bạn đã mua hàng tại Template Market!</p>
        <p>Hotline: 1900-xxxx | Email: support@templatemarket.com</p>
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(invoiceHTML);
  printWindow.document.close();
  printWindow.print();
};

// ✅ Function tải xuống PDF (sử dụng browser print to PDF)
const handleDownloadInvoice = (order: Order) => {
  // Tạo cửa sổ in và để user chọn "Save as PDF"
  handlePrintInvoice(order);
};

// ✅ Component xem chi tiết đơn hàng - ĐÃ CẬP NHẬT
const OrderDetailModal = ({
  orderId,
  onClose,
}: {
  orderId: string;
  onClose: () => void;
}) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const orderData = await getOrderWithItems(orderId);
        setOrder(orderData);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-8 text-center">
        <XCircle className="w-16 h-16 mx-auto text-red-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Không tìm thấy đơn hàng
        </h3>
        <p className="text-gray-600">
          Đơn hàng này có thể đã bị xóa hoặc không tồn tại.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Chi tiết đơn hàng #{order.id}
            </h2>
            <p className="text-gray-600">
              Ngày tạo:{" "}
              {new Date(order.created_at || "").toLocaleString("vi-VN")}
            </p>
          </div>
          <Badge
            className={`${getOrderStatusColor(order.status || "", order.payment_status || "")} text-sm px-3 py-1`}
          >
            {getOrderStatusText(order.status || "", order.payment_status || "")}
          </Badge>
        </div>

        {/* Thông tin khách hàng */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Thông tin khách hàng
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">
                Họ tên
              </label>
              <p className="font-semibold">{order.full_name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="font-semibold">{order.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Số điện thoại
              </label>
              <p className="font-semibold">{order.phone}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Phương thức thanh toán
              </label>
              <div className="flex items-center gap-2">
                <span>{getPaymentMethodIcon(order.payment_method || "")}</span>
                <span className="font-semibold">
                  {PAYMENT_METHODS.find((m) => m.id === order.payment_method)
                    ?.name || order.payment_method}
                </span>
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-600">
                Địa chỉ
              </label>
              <p className="font-semibold">
                {order.address}, {order.city}, {order.country}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Sản phẩm */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="w-5 h-5" />
              Sản phẩm đã mua
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                >
                  {item.product?.image && (
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-semibold">
                      {item.product?.title || "Sản phẩm không xác định"}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Số lượng: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-600">
                      {formatPrice(item.price)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Tổng: {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Tổng tiền */}
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Tổng cộng:</span>
                <span className="text-emerald-600">
                  {formatPrice(order.total_price || 0)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={() => handlePrintInvoice(order)}>
            <Printer className="w-4 h-4 mr-2" />
            In hóa đơn
          </Button>
          <Button
            variant="outline"
            onClick={() => handleDownloadInvoice(order)}
          >
            <Download className="w-4 h-4 mr-2" />
            Tải xuống PDF
          </Button>
          <Button onClick={onClose}>Đóng</Button>
        </div>
      </div>
    </div>
  );
};

const PaymentManagement: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<
    Array<{
      id: string;
      type: "success" | "error" | "info";
      title: string;
      description?: string;
    }>
  >([]);
  const [page, setPage] = useState(1);
  const PER_PAGE = 8;

  if (!user || !isAdmin(user)) return <Navigate to="/" replace />;

  // Toast system
  const showToast = (
    type: "success" | "error" | "info",
    title: string,
    description?: string,
  ) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  };
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // ✅ Fetch data từ Supabase
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const ordersData = await getAllOrders();
        setOrders(ordersData);
        showToast(
          "success",
          "✅ Đã tải thanh toán",
          `Tải thành công ${ordersData.length} đơn hàng.`,
        );
      } catch (error) {
        console.error("Error fetching orders:", error);
        showToast(
          "error",
          "❌ Lỗi tải thanh toán",
          "Không thể tải dữ liệu thanh toán từ server.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ✅ CẬP NHẬT Filter orders với logic mới
  const filteredOrders = orders.filter((order) => {
    const matchSearch =
      order.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchPaymentMethod =
      paymentMethodFilter === "all" ||
      order.payment_method === paymentMethodFilter;

    // ✅ CẬP NHẬT filter logic
    const matchStatus = (() => {
      if (statusFilter === "all") return true;
      if (statusFilter === "paid")
        return order.payment_status === "paid" || order.status === "completed";
      if (statusFilter === "pending")
        return (
          order.payment_status === "pending" ||
          (order.status === "pending" && order.payment_status !== "paid")
        );
      if (statusFilter === "failed")
        return (
          order.payment_status === "failed" || order.status === "cancelled"
        );
      return (
        order.payment_status === statusFilter || order.status === statusFilter
      );
    })();

    return matchSearch && matchPaymentMethod && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PER_PAGE));
  const pagedOrders = filteredOrders.slice(
    (page - 1) * PER_PAGE,
    page * PER_PAGE,
  );

  useEffect(() => {
    setPage(1);
  }, [searchQuery, paymentMethodFilter, statusFilter]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const ordersData = await getAllOrders();
      setOrders(ordersData);
      showToast(
        "success",
        "🔄 Đã cập nhật",
        "Danh sách thanh toán đã được làm mới.",
      );
    } catch (error) {
      console.error("Error refreshing orders:", error);
      showToast(
        "error",
        "❌ Lỗi cập nhật",
        "Không thể cập nhật dữ liệu thanh toán.",
      );
    }
    setRefreshing(false);
  };

  // ✅ Xác nhận thanh toán
  const handleConfirmPayment = async (orderId: string) => {
    try {
      const success = await updateOrderPaymentStatus(orderId, "paid");
      if (success) {
        // Update local state
        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId ? { ...order, payment_status: "paid" } : order,
          ),
        );
        showToast(
          "success",
          "✅ Đã xác nhận thanh toán",
          "Thanh toán đã được xác nhận thành công.",
        );
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      console.error("Error confirming payment:", error);
      showToast(
        "error",
        "❌ Xác nhận thất bại",
        "Có lỗi xảy ra khi xác nhận thanh toán.",
      );
    }
  };

  // ✅ CẬP NHẬT stats với logic mới
  const stats = {
    totalOrders: orders.length,
    paidOrders: orders.filter(
      (o) => o.status === "completed" || o.payment_status === "paid",
    ).length,
    pendingOrders: orders.filter(
      (o) =>
        (o.status === "pending" || o.payment_status === "pending") &&
        o.status !== "completed" &&
        o.payment_status !== "paid",
    ).length,
    failedOrders: orders.filter(
      (o) => o.status === "cancelled" || o.payment_status === "failed",
    ).length,
    totalRevenue: orders
      .filter((o) => o.payment_status === "paid" || o.status === "completed")
      .reduce((sum, o) => sum + (o.total_price || 0), 0),
    averageOrder:
      orders.length > 0
        ? orders.reduce((sum, o) => sum + (o.total_price || 0), 0) /
          orders.length
        : 0,
  };

  const statsCards = [
    {
      title: "Tổng đơn hàng",
      value: stats.totalOrders,
      icon: Receipt,
      gradient: "from-orange-400 via-amber-500 to-pink-600",
      bgGradient: "from-orange-50/80 via-amber-50/80 to-pink-50/80",
      description: "Tất cả đơn hàng",
      trend: "+5%",
    },
    {
      title: "Đã thanh toán",
      value: stats.paidOrders,
      icon: CheckCircle,
      gradient: "from-green-400 via-emerald-500 to-teal-600",
      bgGradient: "from-green-50/80 via-emerald-50/80 to-teal-50/80",
      description: "Hoàn thành",
      trend: "+8%",
    },
    {
      title: "Chờ thanh toán",
      value: stats.pendingOrders,
      icon: Clock,
      gradient: "from-yellow-400 via-orange-400 to-amber-600",
      bgGradient: "from-yellow-50/80 via-orange-50/80 to-amber-50/80",
      description: "Đang xử lý",
      trend: "+2%",
    },
    {
      title: "Thất bại",
      value: stats.failedOrders,
      icon: XCircle,
      gradient: "from-red-400 via-pink-500 to-rose-600",
      bgGradient: "from-red-50/80 via-pink-50/80 to-rose-50/80",
      description: "Cần xử lý",
      trend: "-1%",
    },
    {
      title: "Tổng doanh thu",
      value: formatPrice(stats.totalRevenue),
      icon: DollarSign,
      gradient: "from-indigo-500 via-purple-500 to-pink-500",
      bgGradient: "from-indigo-50/80 via-purple-50/80 to-pink-50/80",
      description: "Đã thu",
      trend: "+15%",
    },
    {
      title: "Trung bình/đơn",
      value: formatPrice(stats.averageOrder),
      icon: BarChart3,
      gradient: "from-cyan-400 via-blue-500 to-indigo-500",
      bgGradient: "from-cyan-50/80 via-blue-50/80 to-indigo-50/80",
      description: "Giá trị TB",
      trend: "+7%",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-pink-50">
      {/* 🌟 Floating Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4"
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <CreditCard className="w-8 h-8 text-orange-400 opacity-20" />
        </motion.div>
        <motion.div
          className="absolute top-1/3 right-1/4"
          animate={{ y: [0, -15, 0], rotate: [0, -10, 0] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          <DollarSign className="w-6 h-6 text-pink-400 opacity-20" />
        </motion.div>
        <motion.div
          className="absolute bottom-1/4 left-1/3"
          animate={{ y: [0, -25, 0], rotate: [0, 15, 0] }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        >
          <Wallet className="text-amber-400 w-7 h-7 opacity-20" />
        </motion.div>
      </div>

      {/* Toast notification */}
      <div className="fixed top-0 right-0 z-50 p-4 space-y-3">
        <AnimatePresence>
          {toasts.map((toast) => (
            <FloatingToast
              key={toast.id}
              type={toast.type}
              title={toast.title}
              description={toast.description}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Modal xem chi tiết */}
      <Dialog
        open={!!selectedOrderId}
        onOpenChange={() => setSelectedOrderId(null)}
      >
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết đơn hàng</DialogTitle>
          </DialogHeader>
          {selectedOrderId && (
            <OrderDetailModal
              orderId={selectedOrderId}
              onClose={() => setSelectedOrderId(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <div className="container relative z-10 px-4 py-8 mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8 p-6 bg-gradient-to-r from-white/90 via-orange-50/90 to-pink-50/90 backdrop-blur-xl border border-orange-200/50 rounded-3xl shadow-lg"
        >
          <div className="flex items-center space-x-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="group bg-white/60 hover:bg-white/80 rounded-2xl shadow-md"
              >
                <Link to="/admin">
                  <ArrowLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1 text-orange-600" />
                  <span className="font-semibold text-orange-800">
                    Về Dashboard
                  </span>
                </Link>
              </Button>
            </motion.div>
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="flex items-center justify-center w-16 h-16 shadow-xl rounded-3xl bg-gradient-to-r from-orange-500 via-amber-500 to-pink-600"
              >
                <CreditCard className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-orange-600 via-amber-600 to-pink-600 bg-clip-text">
                  Quản lý Thanh toán
                </h1>
                <p className="text-orange-700/80 mt-1 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Theo dõi và xử lý các giao dịch thanh toán</span>
                </p>
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={refreshing}
                className="transition-all duration-300 group bg-white/80 hover:bg-white border-orange-200/50 hover:border-orange-300 rounded-2xl shadow-md hover:shadow-lg"
              >
                {refreshing ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                  </motion.div>
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2 group-hover:animate-spin text-orange-600" />
                )}
                <span className="text-orange-800 font-semibold">Làm mới</span>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                asChild
                className="bg-white/80 border-orange-200/50 hover:border-orange-300 rounded-2xl shadow-md"
              >
                <Link to="/admin/reports">
                  <BarChart3 className="w-4 h-4 mr-2 text-orange-600" />
                  <span className="font-semibold">Báo cáo</span>
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-4 mb-4 md:grid-cols-4"
        >
          {statsCards.slice(0, 4).map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -8, scale: 1.03 }}
              className="transition-all duration-500"
            >
              <Card
                className={`relative overflow-hidden border-0 bg-gradient-to-br ${stat.bgGradient} backdrop-blur-sm shadow-lg hover:shadow-2xl group rounded-3xl`}
                style={{ minHeight: 140 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50" />
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="text-2xl font-bold text-orange-900 mb-1"
                      >
                        {typeof stat.value === "string"
                          ? stat.value
                          : stat.value.toLocaleString()}
                      </motion.div>
                      <div className="text-xs font-semibold text-orange-800/90 mb-1">
                        {stat.title}
                      </div>
                      <div className="text-xs text-orange-700/70">
                        {stat.description}
                      </div>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.15, rotate: 10 }}
                      className={`w-10 h-10 rounded-2xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl flex-shrink-0`}
                    >
                      <stat.icon className="w-5 h-5 text-white" />
                    </motion.div>
                  </div>
                  <div className="flex items-center text-xs text-emerald-600">
                    <div className="p-1 rounded-full mr-1 bg-emerald-100">
                      <TrendingUp className="w-2 h-2" />
                    </div>
                    <span className="font-semibold">{stat.trend}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className="grid grid-cols-2 gap-4 mb-8 md:grid-cols-2"
        >
          {statsCards.slice(4).map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + index * 0.1 }}
              whileHover={{ y: -8, scale: 1.03 }}
              className="transition-all duration-500"
            >
              <Card
                className={`relative overflow-hidden border-0 bg-gradient-to-br ${stat.bgGradient} backdrop-blur-sm shadow-lg hover:shadow-2xl group rounded-3xl`}
                style={{ minHeight: 140 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50" />
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.45 + index * 0.1 }}
                        className="text-2xl font-bold text-orange-900 mb-1"
                      >
                        {stat.value}
                      </motion.div>
                      <div className="text-xs font-semibold text-orange-800/90 mb-1">
                        {stat.title}
                      </div>
                      <div className="text-xs text-orange-700/70">
                        {stat.description}
                      </div>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.15, rotate: 10 }}
                      className={`w-10 h-10 rounded-2xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl flex-shrink-0`}
                    >
                      <stat.icon className="w-5 h-5 text-white" />
                    </motion.div>
                  </div>
                  <div className="flex items-center text-xs text-emerald-600">
                    <div className="p-1 rounded-full mr-1 bg-emerald-100">
                      <TrendingUp className="w-2 h-2" />
                    </div>
                    <span className="font-semibold">{stat.trend}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <Card className="border-0 shadow-xl bg-gradient-to-r from-white/95 via-orange-50/80 to-pink-50/80 backdrop-blur-xl rounded-3xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-600 shadow-lg">
                    <Filter className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-transparent bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text font-bold">
                      Bộ lọc và tìm kiếm
                    </CardTitle>
                    <p className="text-sm text-orange-700/80 mt-1">
                      Tìm kiếm & lọc giao dịch thanh toán
                    </p>
                  </div>
                </div>
                <Badge className="bg-gradient-to-r from-orange-200 to-pink-200 text-orange-800 border-0 shadow-sm">
                  {filteredOrders.length} kết quả
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Search Bar */}
                <motion.div className="relative" whileFocus={{ scale: 1.01 }}>
                  <div className="relative flex items-center space-x-3 p-4 bg-gradient-to-r from-white/90 to-orange-50/90 backdrop-blur-xl border border-orange-200/50 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <Search className="flex-shrink-0 w-5 h-5 text-orange-600 group-hover:text-orange-800 transition-colors" />
                    <Input
                      placeholder="Tìm kiếm theo tên, email hoặc mã đơn hàng..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 text-sm bg-transparent border-none outline-none placeholder:text-orange-500/60 text-orange-800 font-medium"
                    />
                  </div>
                </motion.div>
                {/* Filter Controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <motion.div whileFocus={{ scale: 1.01 }}>
                    <label className="text-sm font-semibold text-orange-800 mb-2 block">
                      Phương thức thanh toán
                    </label>
                    <Select
                      value={paymentMethodFilter}
                      onValueChange={setPaymentMethodFilter}
                    >
                      <SelectTrigger className="h-12 bg-white/80 border-orange-200/50 rounded-2xl shadow-md">
                        <SelectValue placeholder="Chọn phương thức" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả phương thức</SelectItem>
                        {PAYMENT_METHODS.map((method) => (
                          <SelectItem key={method.id} value={method.id}>
                            {method.icon} {method.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </motion.div>
                  <motion.div whileFocus={{ scale: 1.01 }}>
                    <label className="text-sm font-semibold text-orange-800 mb-2 block">
                      Trạng thái thanh toán
                    </label>
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="h-12 bg-white/80 border-orange-200/50 rounded-2xl shadow-md">
                        <SelectValue placeholder="Trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả trạng thái</SelectItem>
                        <SelectItem value="paid">Đã thanh toán</SelectItem>
                        <SelectItem value="pending">Chờ thanh toán</SelectItem>
                        <SelectItem value="failed">Thất bại</SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>
                </div>
                {/* Quick Filter Badges */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-orange-100 transition-colors"
                    onClick={() => setStatusFilter("pending")}
                  >
                    ⏳ Chờ thanh toán
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-orange-100 transition-colors"
                    onClick={() => setStatusFilter("paid")}
                  >
                    ✅ Đã thanh toán
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-orange-100 transition-colors"
                    onClick={() => setPaymentMethodFilter("vietqr")}
                  >
                    🏦 VietQR
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-orange-100 transition-colors"
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("all");
                      setPaymentMethodFilter("all");
                    }}
                  >
                    🔄 Reset tất cả
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white/95 via-orange-50/80 to-pink-50/80 backdrop-blur-xl rounded-3xl overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-transparent bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text font-bold">
                      Danh sách giao dịch
                    </CardTitle>
                    <p className="text-sm text-green-700/80 mt-1 flex items-center space-x-2">
                      {filteredOrders.length} giao dịch được tìm thấy (Trang{" "}
                      {page}/{totalPages})
                    </p>
                  </div>
                </div>
                <Badge className="bg-gradient-to-r from-green-200 to-emerald-200 text-green-800 border-0 shadow-sm">
                  {pagedOrders.length} hiển thị
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                  <span className="ml-2 text-orange-700">Đang tải...</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-muted/50 border-orange-200/30">
                        <TableHead className="font-semibold text-orange-800">
                          Đơn hàng
                        </TableHead>
                        <TableHead className="font-semibold text-orange-800">
                          Khách hàng
                        </TableHead>
                        <TableHead className="font-semibold text-orange-800">
                          Phương thức
                        </TableHead>
                        <TableHead className="font-semibold text-orange-800">
                          Số tiền
                        </TableHead>
                        <TableHead className="font-semibold text-orange-800">
                          Trạng thái
                        </TableHead>
                        <TableHead className="font-semibold text-orange-800">
                          Ngày tạo
                        </TableHead>
                        <TableHead className="font-semibold text-orange-800 text-right">
                          Thao tác
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <AnimatePresence>
                        {pagedOrders.map((order, index) => (
                          <motion.tr
                            key={order.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{
                              backgroundColor: "rgba(255,245,235,0.5)",
                            }}
                            className="transition-all duration-300 group hover:shadow-md border-orange-200/20"
                          >
                            <TableCell>
                              <div className="space-y-1">
                                <div className="font-semibold transition-colors group-hover:text-orange-700 text-orange-900">
                                  #{order.id}
                                </div>
                                <div className="text-xs text-orange-600/80">
                                  {order.status}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="font-medium">
                                  {order.full_name}
                                </div>
                                <div className="text-xs text-gray-600">
                                  {order.email}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="text-lg">
                                  {getPaymentMethodIcon(
                                    order.payment_method || "",
                                  )}
                                </span>
                                <span className="text-sm font-medium">
                                  {PAYMENT_METHODS.find(
                                    (m) => m.id === order.payment_method,
                                  )?.name || order.payment_method}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-bold text-emerald-600">
                                {formatPrice(order.total_price || 0)}
                              </div>
                            </TableCell>
                            <TableCell>
                              {/* ✅ CẬP NHẬT Badge hiển thị trạng thái */}
                              <Badge
                                className={`transition-all duration-300 group-hover:scale-105 border-0 shadow-sm ${getOrderStatusColor(order.status || "", order.payment_status || "")}`}
                              >
                                {getOrderStatusIcon(
                                  order.status || "",
                                  order.payment_status || "",
                                )}
                                {getOrderStatusText(
                                  order.status || "",
                                  order.payment_status || "",
                                )}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="text-sm font-medium">
                                  {new Date(
                                    order.created_at || "",
                                  ).toLocaleDateString("vi-VN")}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {new Date(
                                    order.created_at || "",
                                  ).toLocaleTimeString("vi-VN")}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="group/btn bg-white/60 hover:bg-white/80 rounded-2xl shadow-md"
                                    >
                                      <MoreHorizontal className="w-4 h-4 transition-colors group-hover/btn:text-orange-600" />
                                    </Button>
                                  </motion.div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="w-48"
                                >
                                  <DropdownMenuItem
                                    onClick={() => setSelectedOrderId(order.id)}
                                  >
                                    <Eye className="w-4 h-4 mr-2" />
                                    Xem chi tiết
                                  </DropdownMenuItem>
                                  {order.payment_status === "pending" && (
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleConfirmPayment(order.id)
                                      }
                                    >
                                      <CheckCircle className="w-4 h-4 mr-2" />
                                      Xác nhận thanh toán
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem
                                    onClick={() => handlePrintInvoice(order)}
                                  >
                                    <Printer className="w-4 h-4 mr-2" />
                                    In hóa đơn
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleDownloadInvoice(order)}
                                  >
                                    <Download className="w-4 h-4 mr-2" />
                                    Tải PDF
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Empty State */}
              {!loading && filteredOrders.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-16 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="mb-6"
                  >
                    <CreditCard className="w-20 h-20 mx-auto text-orange-400/50" />
                  </motion.div>
                  <h3 className="mb-4 text-2xl font-bold text-transparent bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text">
                    Không tìm thấy giao dịch
                  </h3>
                  <p className="max-w-md mx-auto mb-6 text-orange-700/80 leading-relaxed">
                    Thử thay đổi bộ lọc để tìm thấy giao dịch phù hợp.
                  </p>
                </motion.div>
              )}

              {/* Pagination */}
              {!loading && totalPages > 1 && (
                <div className="flex justify-center items-center mt-8 gap-2">
                  <Button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    variant="outline"
                    className="bg-white/80 hover:bg-white border-orange-200/50 hover:border-orange-300 rounded-2xl shadow-md"
                  >
                    <span className="text-orange-800 font-semibold">Trước</span>
                  </Button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) pageNum = i + 1;
                    else if (page <= 3) pageNum = i + 1;
                    else if (page >= totalPages - 2)
                      pageNum = totalPages - 4 + i;
                    else pageNum = page - 2 + i;
                    return (
                      <Button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        variant={page === pageNum ? "default" : "outline"}
                        className={`w-10 h-10 rounded-2xl transition-all ${
                          page === pageNum
                            ? "bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-lg"
                            : "bg-white/80 hover:bg-white border-orange-200/50 hover:border-orange-300 text-orange-700 hover:text-orange-900"
                        }`}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  <Button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    variant="outline"
                    className="bg-white/80 hover:bg-white border-orange-200/50 hover:border-orange-300 rounded-2xl shadow-md"
                  >
                    <span className="text-orange-800 font-semibold">Tiếp</span>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentManagement;
