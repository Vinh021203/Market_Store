import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import OrderDetailModal from "@/components/OrderDetails";
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
import { useAuth } from "@/contexts/AuthContext";
import { isAdmin } from "@/lib/auth";
import { formatPrice } from "@/lib/products";
import { getAllOrders, updateOrderStatus } from "@/lib/order";
import { Order } from "@/types";
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Download,
  ArrowLeft,
  ShoppingCart,
  User,
  Calendar,
  CreditCard,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const OrderManagement: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const data = await getAllOrders();
      setOrders(data);
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const handleViewOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrderId(null);
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "processing" | "completed" | "cancelled"
  >("all");
  const [paymentFilter, setPaymentFilter] = useState<
    "all" | "paid" | "pending" | "failed"
  >("all");

  if (!user || !isAdmin(user)) {
    return <Navigate to="/" replace />;
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email?.toLowerCase().includes(searchQuery.toLowerCase()); // Sửa từ shippingAddress.email sang email

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    const matchesPayment =
      paymentFilter === "all" || order.payment_status === paymentFilter; // Sửa từ paymentStatus sang payment_status

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const handleUpdateStatus = async (
    orderId: string,
    newStatus: Order["status"],
  ) => {
    const success = await updateOrderStatus(orderId, newStatus);
    if (success) {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: newStatus,
                updated_at: new Date().toISOString(),
              }
            : order,
        ),
      );

      toast({
        title: "Cập nhật thành công",
        description: "Trạng thái đơn hàng đã được cập nhật.",
      });
    } else {
      toast({
        title: "Cập nhật thất bại",
        description: "Không thể cập nhật trạng thái đơn hàng.",
        variant: "destructive",
      });
    }
  };

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    completed: orders.filter((o) => o.status === "completed").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
    totalRevenue: orders.reduce(
      (sum, order) => sum + (order.total_price || 0),
      0,
    ), // Sửa từ order.total sang order.total_price
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

  const getPaymentColor = (status: Order["payment_status"] | null) => {
    // Cập nhật type
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

  return (
    <div className="container px-4 py-8 mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/admin">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Về Dashboard
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Quản lý đơn hàng</h1>
            <p className="text-muted-foreground">Theo dõi và xử lý đơn hàng</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8 md:grid-cols-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Tổng</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {stats.pending}
              </div>
              <div className="text-sm text-muted-foreground">Chờ xử lý</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {stats.processing}
              </div>
              <div className="text-sm text-muted-foreground">Đang xử lý</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {stats.completed}
              </div>
              <div className="text-sm text-muted-foreground">Hoàn thành</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {stats.cancelled}
              </div>
              <div className="text-sm text-muted-foreground">Đã hủy</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-lg font-bold text-primary">
                {formatPrice(stats.totalRevenue)}
              </div>
              <div className="text-sm text-muted-foreground">Doanh thu</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo mã đơn hàng hoặc email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={statusFilter}
              onValueChange={(value: any) => setStatusFilter(value)}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="pending">Chờ xử lý</SelectItem>
                <SelectItem value="processing">Đang xử lý</SelectItem>
                <SelectItem value="completed">Hoàn thành</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={paymentFilter}
              onValueChange={(value: any) => setPaymentFilter(value)}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Thanh toán" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="paid">Đã thanh toán</SelectItem>
                <SelectItem value="pending">Chờ thanh toán</SelectItem>
                <SelectItem value="failed">Thất bại</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách đơn hàng ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã đơn hàng</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead>Tổng tiền</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thanh toán</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div className="font-medium">#{order.id}</div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.full_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {order.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {order.items.map((item, index) => (
                          <div key={index} className="text-sm">
                            {item.product.title}
                            {item.quantity > 1 && (
                              <span className="text-muted-foreground">
                                {" "}
                                x{item.quantity}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {formatPrice(order.total_price || 0)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(order.status)}>
                        {order.status === "pending"
                          ? "Chờ xử lý"
                          : order.status === "processing"
                            ? "Đang xử lý"
                            : order.status === "completed"
                              ? "Hoàn thành"
                              : "Đã hủy"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getPaymentColor(order.payment_status)}>
                        {order.payment_status === "paid"
                          ? "Đã thanh toán"
                          : order.payment_status === "pending"
                            ? "Chờ thanh toán"
                            : "Thất bại"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">
                          {order.created_at
                            ? new Date(order.created_at).toLocaleDateString(
                                "vi-VN",
                              )
                            : "Chưa xác định"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {order.created_at
                            ? new Date(order.created_at).toLocaleTimeString(
                                "vi-VN",
                              )
                            : ""}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleViewOrder(order.id)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          {order.status === "pending" && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleUpdateStatus(order.id, "processing")
                              }
                            >
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              Xử lý đơn hàng
                            </DropdownMenuItem>
                          )}
                          {order.status === "processing" && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleUpdateStatus(order.id, "completed")
                              }
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Hoàn thành
                            </DropdownMenuItem>
                          )}
                          {(order.status === "pending" ||
                            order.status === "processing") && (
                            <DropdownMenuItem
                              onClick={() =>
                                handleUpdateStatus(order.id, "cancelled")
                              }
                              className="text-red-600"
                            >
                              <MoreHorizontal className="w-4 h-4 mr-2" />
                              Hủy đơn hàng
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="py-8 text-center">
              <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">
                Không tìm thấy đơn hàng
              </h3>
              <p className="text-muted-foreground">
                Thử thay đổi bộ lọc để xem đơn hàng khác
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      <OrderDetailModal
        orderId={selectedOrderId}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default OrderManagement;
