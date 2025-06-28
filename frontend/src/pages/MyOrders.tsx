import React, { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { formatPrice } from "@/lib/products";
import {
  ShoppingBag,
  FileText,
  Download,
  Loader2,
  Search,
  Filter,
  Calendar,
  Package,
  CreditCard,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye,
  RefreshCw,
  TrendingUp,
  Star,
  MessageSquare,
  ExternalLink,
  ArrowRight,
  MoreHorizontal,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/components/ui/use-toast";
import { Order } from "@/types";

interface OrderStats {
  total: number;
  completed: number;
  processing: number;
  pending: number;
  totalSpent: number;
  averageOrderValue: number;
}

const MyOrders: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [orderStats, setOrderStats] = useState<OrderStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  useEffect(() => {
    filterAndSortOrders();
  }, [orders, searchTerm, statusFilter, sortBy, activeTab]);

  const fetchOrders = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data: ordersData, error } = await supabase
        .from("orders")
        .select("*, order_items(*, products(*))")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const mappedOrders =
        ordersData?.map((order) => ({
          ...order,
          items: (order.order_items ?? []).map((item) => ({
            ...item,
            product: item.products ?? null,
          })),
        })) || [];

      setOrders(mappedOrders);

      // Calculate stats
      const stats: OrderStats = {
        total: mappedOrders.length,
        completed: mappedOrders.filter((o) => o.status === "completed").length,
        processing: mappedOrders.filter((o) => o.status === "processing")
          .length,
        pending: mappedOrders.filter((o) => o.status === "pending").length,
        totalSpent: mappedOrders.reduce(
          (sum, order) => sum + (order.total_price || 0),
          0,
        ),
        averageOrderValue:
          mappedOrders.length > 0
            ? mappedOrders.reduce(
                (sum, order) => sum + (order.total_price || 0),
                0,
              ) / mappedOrders.length
            : 0,
      };
      setOrderStats(stats);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        variant: "destructive",
        description: "Không thể tải danh sách đơn hàng",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortOrders = () => {
    let filtered = [...orders];

    // Filter by tab
    if (activeTab !== "all") {
      filtered = filtered.filter((order) => order.status === activeTab);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.items.some((item) =>
            item.product?.title
              .toLowerCase()
              .includes(searchTerm.toLowerCase()),
          ),
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Sort orders
    switch (sortBy) {
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
        break;
      case "oldest":
        filtered.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
        );
        break;
      case "highest":
        filtered.sort((a, b) => (b.total_price || 0) - (a.total_price || 0));
        break;
      case "lowest":
        filtered.sort((a, b) => (a.total_price || 0) - (b.total_price || 0));
        break;
    }

    setFilteredOrders(filtered);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "processing":
        return <Clock className="w-4 h-4 text-blue-500" />;
      case "pending":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Package className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Hoàn thành";
      case "processing":
        return "Đang xử lý";
      case "pending":
        return "Chờ xử lý";
      case "cancelled":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  const getStatusVariant = (status: string) => {
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

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <h1 className="flex items-center gap-3 text-3xl font-bold">
              <ShoppingBag className="w-8 h-8 text-blue-500" />
              Đơn hàng của tôi
            </h1>
            <p className="mt-2 text-muted-foreground">
              Quản lý và theo dõi tất cả các đơn hàng của bạn
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={fetchOrders}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Làm mới
            </Button>
            <Button size="sm" asChild>
              <Link to="/templates">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Mua sắm
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        {orderStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Tổng đơn hàng
                    </p>
                    <p className="text-3xl font-bold">{orderStats.total}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full dark:bg-blue-900">
                    <ShoppingBag className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-green-500">
                      {orderStats.completed}
                    </span>
                    <span className="text-muted-foreground">hoàn thành</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Tổng chi tiêu
                    </p>
                    <p className="text-3xl font-bold">
                      {formatPrice(orderStats.totalSpent)}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full dark:bg-green-900">
                    <CreditCard className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-muted-foreground">
                      Trung bình {formatPrice(orderStats.averageOrderValue)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Đang xử lý
                    </p>
                    <p className="text-3xl font-bold">
                      {orderStats.processing}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full dark:bg-blue-900">
                    <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="mt-4">
                  <Progress
                    value={
                      orderStats.total > 0
                        ? (orderStats.processing / orderStats.total) * 100
                        : 0
                    }
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Tỷ lệ thành công
                    </p>
                    <p className="text-3xl font-bold">
                      {orderStats.total > 0
                        ? Math.round(
                            (orderStats.completed / orderStats.total) * 100,
                          )
                        : 0}
                      %
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full dark:bg-green-900">
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="w-4 h-4 text-purple-500" />
                    <span className="text-muted-foreground">
                      {orderStats.pending} chờ xử lý
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="relative flex-1">
                  <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm theo ID đơn hàng hoặc tên sản phẩm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-3">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px]">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="completed">Hoàn thành</SelectItem>
                      <SelectItem value="processing">Đang xử lý</SelectItem>
                      <SelectItem value="pending">Chờ xử lý</SelectItem>
                      <SelectItem value="cancelled">Đã hủy</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Sắp xếp" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Mới nhất</SelectItem>
                      <SelectItem value="oldest">Cũ nhất</SelectItem>
                      <SelectItem value="highest">Giá cao nhất</SelectItem>
                      <SelectItem value="lowest">Giá thấp nhất</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Orders Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">
                Tất cả ({orderStats?.total || 0})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Hoàn thành ({orderStats?.completed || 0})
              </TabsTrigger>
              <TabsTrigger value="processing">
                Đang xử lý ({orderStats?.processing || 0})
              </TabsTrigger>
              <TabsTrigger value="pending">
                Chờ xử lý ({orderStats?.pending || 0})
              </TabsTrigger>
              <TabsTrigger value="cancelled">Đã hủy (0)</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>
                      {activeTab === "all"
                        ? "Tất cả đơn hàng"
                        : activeTab === "completed"
                          ? "Đơn hàng hoàn thành"
                          : activeTab === "processing"
                            ? "Đơn hàng đang xử lý"
                            : activeTab === "pending"
                              ? "Đơn hàng chờ xử lý"
                              : "Đơn hàng đã hủy"}
                    </span>
                    <Badge variant="secondary">
                      {filteredOrders.length} đơn hàng
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin" />
                      <span className="ml-3 text-lg">Đang tải đơn hàng...</span>
                    </div>
                  ) : filteredOrders.length === 0 ? (
                    <div className="py-12 text-center">
                      <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="mb-2 text-xl font-semibold">
                        {searchTerm
                          ? "Không tìm thấy đơn hàng"
                          : "Chưa có đơn hàng nào"}
                      </h3>
                      <p className="mb-6 text-muted-foreground">
                        {searchTerm
                          ? `Không có đơn hàng nào khớp với "${searchTerm}"`
                          : "Bạn chưa có đơn hàng nào. Hãy khám phá các sản phẩm của chúng tôi!"}
                      </p>
                      {!searchTerm && (
                        <Button asChild>
                          <Link to="/templates">
                            <ShoppingBag className="w-4 h-4 mr-2" />
                            Khám phá sản phẩm
                          </Link>
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <AnimatePresence>
                        {filteredOrders.map((order, index) => (
                          <motion.div
                            key={order.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-6 transition-shadow border rounded-lg hover:shadow-md"
                          >
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                              {/* Order Info */}
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-4">
                                  <div>
                                    <div className="flex items-center gap-3 mb-2">
                                      <h4 className="text-lg font-semibold">
                                        Đơn hàng #{order.id.slice(0, 8)}
                                      </h4>
                                      <Badge
                                        variant={getStatusVariant(order.status)}
                                      >
                                        <div className="flex items-center gap-1">
                                          {getStatusIcon(order.status)}
                                          {getStatusText(order.status)}
                                        </div>
                                      </Badge>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                      <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(
                                          order.created_at,
                                        ).toLocaleDateString("vi-VN", {
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })}
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Package className="w-4 h-4" />
                                        {order.items.length} sản phẩm
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-2xl font-bold text-primary">
                                      {formatPrice(order.total_price)}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      Tổng thanh toán
                                    </div>
                                  </div>
                                </div>

                                {/* Order Items */}
                                <div className="space-y-3">
                                  <h5 className="font-medium">
                                    Sản phẩm trong đơn hàng:
                                  </h5>
                                  <div className="grid gap-3">
                                    {order.items.map((item, itemIndex) => (
                                      <div
                                        key={itemIndex}
                                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                                      >
                                        <div className="flex items-center space-x-3">
                                          {item.product ? (
                                            <>
                                              <div className="p-2 bg-white rounded-lg dark:bg-gray-700">
                                                {item.product.category ===
                                                "template" ? (
                                                  <FileText className="w-6 h-6 text-blue-500" />
                                                ) : (
                                                  <Download className="w-6 h-6 text-green-500" />
                                                )}
                                              </div>
                                              <div className="flex-1">
                                                <h6 className="font-medium">
                                                  {item.product.title}
                                                </h6>
                                                <div className="flex items-center gap-2 mt-1">
                                                  <Badge
                                                    variant="outline"
                                                    className="text-xs"
                                                  >
                                                    {item.product.category ===
                                                    "template"
                                                      ? "Template"
                                                      : "E-book"}
                                                  </Badge>
                                                  <span className="text-sm text-muted-foreground">
                                                    Số lượng: {item.quantity}
                                                  </span>
                                                </div>
                                              </div>
                                            </>
                                          ) : (
                                            <div className="flex items-center space-x-3">
                                              <div className="w-10 h-10 bg-gray-200 rounded-lg dark:bg-gray-600" />
                                              <span className="italic text-muted-foreground">
                                                Sản phẩm đã bị xóa
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                        <div className="text-right">
                                          <div className="font-medium">
                                            {formatPrice(
                                              item.price * item.quantity,
                                            )}
                                          </div>
                                          <div className="text-sm text-muted-foreground">
                                            {formatPrice(item.price)} x{" "}
                                            {item.quantity}
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex flex-col gap-3 lg:w-48">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full"
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  Xem chi tiết
                                </Button>
                                {order.status === "completed" && (
                                  <Button size="sm" className="w-full" asChild>
                                    <Link to="/downloads">
                                      <Download className="w-4 h-4 mr-2" />
                                      Tải xuống
                                    </Link>
                                  </Button>
                                )}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full"
                                >
                                  <MessageSquare className="w-4 h-4 mr-2" />
                                  Hỗ trợ
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default MyOrders;
