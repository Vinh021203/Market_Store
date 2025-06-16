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
import { motion, AnimatePresence } from "framer-motion";
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
  RefreshCw,
  TrendingUp,
  DollarSign,
  Package,
  Activity,
  Coffee,
  Code,
  Palette,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const OrderManagement: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "processing" | "completed" | "cancelled"
  >("all");
  const [paymentFilter, setPaymentFilter] = useState<
    "all" | "paid" | "pending" | "failed"
  >("all");
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});

  // ✅ Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);

  if (!user || !isAdmin(user)) {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const data = await getAllOrders();
        setOrders(data);
        toast({
          title: "✅ Đã tải đơn hàng",
          description: `Tải thành công ${data.length} đơn hàng.`,
        });
      } catch (error) {
        toast({
          title: "❌ Lỗi tải dữ liệu",
          description: "Không thể tải danh sách đơn hàng.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }));
          }
        });
      },
      { threshold: 0.1 },
    );

    const sections = document.querySelectorAll("[data-animate]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const handleViewOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrderId(null);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await getAllOrders();
      setOrders(data);
      toast({
        title: "🔄 Đã cập nhật",
        description: "Danh sách đơn hàng đã được làm mới.",
      });
    } catch (error) {
      toast({
        title: "❌ Lỗi cập nhật",
        description: "Không thể cập nhật danh sách đơn hàng.",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };

  // ✅ Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    const matchesPayment =
      paymentFilter === "all" || order.payment_status === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  // ✅ Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder,
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  // ✅ Pagination handlers
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, paymentFilter]);

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
        title: "✅ Cập nhật thành công",
        description: "Trạng thái đơn hàng đã được cập nhật.",
      });
    } else {
      toast({
        title: "❌ Cập nhật thất bại",
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
    ),
  };

  const statsCards = [
    {
      title: "Tổng đơn hàng",
      value: stats.total,
      icon: ShoppingCart,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient:
        "from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20",
      description: "Tất cả đơn hàng",
    },
    {
      title: "Chờ xử lý",
      value: stats.pending,
      icon: Clock,
      gradient: "from-yellow-500 to-orange-500",
      bgGradient:
        "from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20",
      description: "Cần xử lý",
    },
    {
      title: "Đang xử lý",
      value: stats.processing,
      icon: Activity,
      gradient: "from-blue-500 to-indigo-500",
      bgGradient:
        "from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20",
      description: "Đang thực hiện",
    },
    {
      title: "Hoàn thành",
      value: stats.completed,
      icon: CheckCircle,
      gradient: "from-green-500 to-emerald-500",
      bgGradient:
        "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
      description: "Thành công",
    },
    {
      title: "Đã hủy",
      value: stats.cancelled,
      icon: XCircle,
      gradient: "from-red-500 to-pink-500",
      bgGradient:
        "from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20",
      description: "Bị hủy",
    },
    {
      title: "Doanh thu",
      value: formatPrice(stats.totalRevenue),
      icon: DollarSign,
      gradient: "from-purple-500 to-violet-500",
      bgGradient:
        "from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20",
      description: "Tổng thu",
    },
  ];

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

  // ✅ Pagination component
  const PaginationComponent = () => {
    if (totalPages <= 1) return null;

    const getVisiblePages = () => {
      const delta = 2;
      const range = [];
      const rangeWithDots = [];

      for (
        let i = Math.max(2, currentPage - delta);
        i <= Math.min(totalPages - 1, currentPage + delta);
        i++
      ) {
        range.push(i);
      }

      if (currentPage - delta > 2) {
        rangeWithDots.push(1, "...");
      } else {
        rangeWithDots.push(1);
      }

      rangeWithDots.push(...range);

      if (currentPage + delta < totalPages - 1) {
        rangeWithDots.push("...", totalPages);
      } else {
        rangeWithDots.push(totalPages);
      }

      return rangeWithDots;
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mt-6"
      >
        <div className="text-sm text-muted-foreground">
          Hiển thị {indexOfFirstOrder + 1} đến{" "}
          {Math.min(indexOfLastOrder, filteredOrders.length)} của{" "}
          {filteredOrders.length} đơn hàng
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="group"
          >
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Trước
          </Button>

          <div className="flex items-center space-x-1">
            {getVisiblePages().map((page, index) => (
              <React.Fragment key={index}>
                {page === "..." ? (
                  <span className="px-3 py-2 text-muted-foreground">...</span>
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page as number)}
                      className={`min-w-[40px] ${
                        currentPage === page
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                          : ""
                      }`}
                    >
                      {page}
                    </Button>
                  </motion.div>
                )}
              </React.Fragment>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="group"
          >
            Sau
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
      {/* Floating Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 animate-float">
          <Code className="w-8 h-8 text-blue-500 opacity-20" />
        </div>
        <div className="absolute top-1/3 right-1/4 animate-float-delay-1">
          <Palette className="w-6 h-6 text-purple-500 opacity-20" />
        </div>
        <div className="absolute bottom-1/4 left-1/3 animate-float-delay-2">
          <Coffee className="text-orange-500 w-7 h-7 opacity-20" />
        </div>
      </div>

      <div className="container relative z-10 px-4 py-8 mx-auto">
        {/* ✅ Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
          id="header"
          data-animate
        >
          <div className="flex items-center space-x-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" size="sm" asChild className="group">
                <Link to="/admin">
                  <ArrowLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
                  Về Dashboard
                </Link>
              </Button>
            </motion.div>
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="flex items-center justify-center w-12 h-12 shadow-lg rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600"
              >
                <ShoppingCart className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text">
                  Quản lý đơn hàng
                </h1>
                <p className="text-muted-foreground">
                  Theo dõi và xử lý đơn hàng của khách hàng
                </p>
              </div>
            </div>
          </div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={refreshing}
              className="transition-all duration-300 group hover:bg-primary/10"
            >
              {refreshing ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                </motion.div>
              ) : (
                <RefreshCw className="w-4 h-4 mr-2 group-hover:animate-spin" />
              )}
              Làm mới
            </Button>
          </motion.div>
        </motion.div>

        {/* ✅ Enhanced Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-4 mb-8 md:grid-cols-3 lg:grid-cols-6"
          id="stats"
          data-animate
        >
          {statsCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`transition-all duration-500 ${
                isVisible.stats
                  ? "animate-in slide-in-from-bottom"
                  : "opacity-0"
              }`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <Card
                className={`transition-all duration-300 hover:shadow-xl border-0 bg-gradient-to-br ${stat.bgGradient} group`}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="mb-1 text-2xl font-bold text-foreground"
                      >
                        {stat.value}
                      </motion.div>
                      <div className="mb-1 text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {stat.description}
                      </div>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}
                    >
                      <stat.icon className="w-6 h-6 text-white" />
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* ✅ Enhanced Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
          id="filters"
          data-animate
        >
          <Card className="border-0 shadow-lg bg-gradient-to-r from-white to-blue-50 dark:from-slate-800 dark:to-blue-900">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500">
                  <Filter className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text">
                    Bộ lọc và tìm kiếm
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Tìm kiếm và lọc đơn hàng theo tiêu chí
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 md:flex-row">
                <motion.div
                  className="relative flex-1"
                  whileFocus={{ scale: 1.01 }}
                >
                  <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm theo mã đơn hàng hoặc email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-12 pl-10 transition-all duration-300 border-0 bg-background/50 focus:ring-2 focus:ring-primary/20"
                  />
                </motion.div>

                <motion.div whileFocus={{ scale: 1.01 }}>
                  <Select
                    value={statusFilter}
                    onValueChange={(value: any) => setStatusFilter(value)}
                  >
                    <SelectTrigger className="w-full md:w-[180px] h-12">
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
                </motion.div>

                <motion.div whileFocus={{ scale: 1.01 }}>
                  <Select
                    value={paymentFilter}
                    onValueChange={(value: any) => setPaymentFilter(value)}
                  >
                    <SelectTrigger className="w-full md:w-[180px] h-12">
                      <SelectValue placeholder="Thanh toán" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="paid">Đã thanh toán</SelectItem>
                      <SelectItem value="pending">Chờ thanh toán</SelectItem>
                      <SelectItem value="failed">Thất bại</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ✅ Enhanced Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          id="orders"
          data-animate
        >
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-transparent bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text">
                      Danh sách đơn hàng
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Trang {currentPage} / {totalPages} -{" "}
                      {filteredOrders.length} đơn hàng được tìm thấy
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-blue-800 bg-blue-100">
                  <Activity className="w-3 h-3 mr-1" />
                  {currentOrders.length} kết quả
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-muted/50">
                      <TableHead className="font-semibold">
                        Mã đơn hàng
                      </TableHead>
                      <TableHead className="font-semibold">
                        Khách hàng
                      </TableHead>
                      <TableHead className="font-semibold">Sản phẩm</TableHead>
                      <TableHead className="font-semibold">Tổng tiền</TableHead>
                      <TableHead className="font-semibold">
                        Trạng thái
                      </TableHead>
                      <TableHead className="font-semibold">
                        Thanh toán
                      </TableHead>
                      <TableHead className="font-semibold">Ngày tạo</TableHead>
                      <TableHead className="font-semibold text-right">
                        Thao tác
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {currentOrders.map((order, index) => (
                        <motion.tr
                          key={order.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                          className="transition-all duration-300 group hover:shadow-md"
                        >
                          <TableCell>
                            <div className="font-medium transition-colors group-hover:text-primary">
                              #{order.id.slice(0, 8)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {order.full_name}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {order.email}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {order.items.map((item, itemIndex) => (
                                <div key={itemIndex} className="text-sm">
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
                            <div className="font-medium text-primary">
                              {formatPrice(order.total_price || 0)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={getStatusColor(order.status)}
                              className="transition-all duration-300 group-hover:scale-105"
                            >
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
                            <Badge
                              variant={getPaymentColor(order.payment_status)}
                              className="transition-all duration-300 group-hover:scale-105"
                            >
                              {order.payment_status === "paid"
                                ? "Đã thanh toán"
                                : order.payment_status === "pending"
                                  ? "Chờ thanh toán"
                                  : "Thất bại"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="flex items-center space-x-1 text-sm">
                                <Calendar className="w-3 h-3" />
                                <span>
                                  {order.created_at
                                    ? new Date(
                                        order.created_at,
                                      ).toLocaleDateString("vi-VN")
                                    : "Chưa xác định"}
                                </span>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {order.created_at
                                  ? new Date(
                                      order.created_at,
                                    ).toLocaleTimeString("vi-VN")
                                  : ""}
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
                                    className="group/btn"
                                  >
                                    <MoreHorizontal className="w-4 h-4 transition-colors group-hover/btn:text-primary" />
                                  </Button>
                                </motion.div>
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
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>

              {/* ✅ Enhanced Empty State */}
              {filteredOrders.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-16 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  >
                    <ShoppingCart className="w-20 h-20 mx-auto mb-6 text-muted-foreground" />
                  </motion.div>
                  <h3 className="mb-4 text-2xl font-semibold">
                    Không tìm thấy đơn hàng
                  </h3>
                  <p className="max-w-md mx-auto mb-6 text-muted-foreground">
                    Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm để tìm thấy đơn
                    hàng phù hợp.
                  </p>
                  <div className="space-y-3">
                    <Button
                      onClick={() => {
                        setSearchQuery("");
                        setStatusFilter("all");
                        setPaymentFilter("all");
                      }}
                      variant="outline"
                      className="mr-3"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Xóa bộ lọc
                    </Button>
                  </div>
                  <div className="flex justify-center mt-4 space-x-2">
                    <Badge variant="outline">
                      💡 Gợi ý: Kiểm tra trạng thái
                    </Badge>
                    <Badge variant="outline">🔍 Hoặc tìm theo email</Badge>
                  </div>
                </motion.div>
              )}

              {/* ✅ Pagination Component */}
              <PaginationComponent />
            </CardContent>
          </Card>
        </motion.div>

        <OrderDetailModal
          orderId={selectedOrderId}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
};

export default OrderManagement;
