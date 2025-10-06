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
  Sparkles,
  Zap,
  Gift,
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

const colorScheme = {
  primaryGradient: "from-pink-400 via-orange-400 to-yellow-400",
  secondaryGradient: "from-pink-500 via-orange-500 to-yellow-500",
  pageBackground: "from-pink-50 via-blue-50 to-yellow-50",
  sectionBackground: "from-pink-50/80 via-blue-50/60 to-yellow-50/80",
  glassCard: "from-white/95 via-pink-50/60 to-blue-50/40",
};

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

    if (activeTab !== "all") {
      filtered = filtered.filter((order) => order.status === activeTab);
    }

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

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

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

  const getStatusConfig = (status: string) => {
    const configs = {
      completed: {
        icon: CheckCircle,
        text: "Hoàn thành",
        gradient: "from-green-400 to-emerald-500",
        bgColor: "from-green-50/90 to-emerald-50/70",
        textColor: "text-green-600",
        borderColor: "border-green-200",
      },
      processing: {
        icon: Clock,
        text: "Đang xử lý",
        gradient: "from-blue-400 to-cyan-500",
        bgColor: "from-blue-50/90 to-cyan-50/70",
        textColor: "text-blue-600",
        borderColor: "border-blue-200",
      },
      pending: {
        icon: AlertCircle,
        text: "Chờ xử lý",
        gradient: "from-yellow-400 to-orange-400",
        bgColor: "from-yellow-50/90 to-orange-50/70",
        textColor: "text-yellow-600",
        borderColor: "border-yellow-200",
      },
      cancelled: {
        icon: XCircle,
        text: "Đã hủy",
        gradient: "from-red-400 to-rose-500",
        bgColor: "from-red-50/90 to-rose-50/70",
        textColor: "text-red-600",
        borderColor: "border-red-200",
      },
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (isLoading) {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br ${colorScheme.pageBackground} flex items-center justify-center`}
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-16 h-16 mx-auto mb-4 text-pink-500" />
          </motion.div>
          <p
            className={`text-xl font-bold bg-gradient-to-r ${colorScheme.primaryGradient} bg-clip-text text-transparent`}
          >
            Đang tải đơn hàng...
          </p>
          <p className="text-sm text-slate-600 mt-2">
            Vui lòng đợi trong giây lát
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${colorScheme.pageBackground}`}
      style={{
        backgroundImage: `radial-gradient(circle at 20% 80%, rgba(236, 72, 153, 0.04) 0%, transparent 50%),
                 radial-gradient(circle at 80% 20%, rgba(244, 63, 94, 0.04) 0%, transparent 50%),
                 radial-gradient(circle at 40% 40%, rgba(220, 38, 127, 0.03) 0%, transparent 50%)`,
      }}
    >
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {[
          {
            emoji: "🛍️",
            position: "top-20 right-20",
            color: "from-pink-100 to-rose-200",
          },
          {
            emoji: "📦",
            position: "top-40 left-10",
            color: "from-blue-100 to-cyan-200",
          },
          {
            emoji: "✨",
            position: "bottom-20 right-10",
            color: "from-yellow-100 to-orange-200",
          },
          {
            emoji: "💳",
            position: "bottom-40 left-20",
            color: "from-purple-100 to-indigo-200",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            className={`absolute ${item.position} text-4xl opacity-20`}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 6 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          >
            <div
              className={`p-3 rounded-full bg-gradient-to-r ${item.color} backdrop-blur-sm shadow-lg`}
            >
              {item.emoji}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="container px-4 py-8 mx-auto relative z-10">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <h1
                className={`flex items-center gap-3 text-4xl font-bold bg-gradient-to-r ${colorScheme.primaryGradient} bg-clip-text text-transparent`}
              >
                <div
                  className={`p-2 rounded-xl bg-gradient-to-r ${colorScheme.primaryGradient} shadow-lg`}
                >
                  <ShoppingBag className="w-8 h-8 text-white" />
                </div>
                Đơn hàng của tôi
              </h1>
              <p className="mt-2 text-slate-600 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Quản lý và theo dõi tất cả các đơn hàng của bạn
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchOrders}
                className="border-pink-200 hover:bg-pink-50 hover:border-pink-300"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Làm mới
              </Button>
              <Button
                size="sm"
                asChild
                className={`bg-gradient-to-r ${colorScheme.primaryGradient} hover:${colorScheme.secondaryGradient} text-white shadow-lg`}
              >
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
              {[
                {
                  title: "Tổng đơn hàng",
                  value: orderStats.total,
                  subtitle: `${orderStats.completed} hoàn thành`,
                  icon: ShoppingBag,
                  gradient: "from-blue-400 to-cyan-500",
                  bgColor: "from-blue-50/90 via-cyan-50/70 to-blue-100/80",
                  trend: "+12%",
                },
                {
                  title: "Tổng chi tiêu",
                  value: formatPrice(orderStats.totalSpent),
                  subtitle: `Trung bình ${formatPrice(orderStats.averageOrderValue)}`,
                  icon: CreditCard,
                  gradient: "from-green-400 to-emerald-500",
                  bgColor: "from-green-50/90 via-emerald-50/70 to-green-100/80",
                  trend: "+8%",
                },
                {
                  title: "Đang xử lý",
                  value: orderStats.processing,
                  subtitle: `${orderStats.pending} chờ xử lý`,
                  icon: Clock,
                  gradient: colorScheme.primaryGradient,
                  bgColor: "from-pink-50/90 via-orange-50/70 to-yellow-100/80",
                  trend: "+5%",
                },
                {
                  title: "Tỷ lệ thành công",
                  value: `${orderStats.total > 0 ? Math.round((orderStats.completed / orderStats.total) * 100) : 0}%`,
                  subtitle: "Đánh giá tuyệt vời",
                  icon: CheckCircle,
                  gradient: "from-purple-400 to-pink-500",
                  bgColor: "from-purple-50/90 via-pink-50/70 to-purple-100/80",
                  trend: "+15%",
                },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <Card
                    className={`relative overflow-hidden border-0 shadow-xl hover:shadow-2xl bg-gradient-to-br ${stat.bgColor} backdrop-blur-lg rounded-2xl transition-all duration-300 group`}
                  >
                    <div
                      className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`}
                    />
                    <CardContent className="relative p-6">
                      <div className="flex items-start justify-between mb-4">
                        <motion.div
                          whileHover={{ rotate: 360, scale: 1.2 }}
                          transition={{ duration: 0.6 }}
                          className={`p-3 rounded-xl bg-gradient-to-r ${stat.gradient} shadow-lg`}
                        >
                          <stat.icon className="w-6 h-6 text-white" />
                        </motion.div>
                        <Badge className="bg-green-100 text-green-700 border-green-200 text-xs font-semibold">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {stat.trend}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-600 mb-1">
                          {stat.title}
                        </p>
                        <p
                          className={`text-3xl font-bold mb-2 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
                        >
                          {stat.value}
                        </p>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          {stat.subtitle}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card
              className={`border-0 shadow-xl bg-gradient-to-br ${colorScheme.glassCard} backdrop-blur-lg rounded-2xl`}
            >
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  <div className="relative flex-1">
                    <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-slate-400" />
                    <Input
                      placeholder="Tìm kiếm theo ID đơn hàng hoặc tên sản phẩm..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-pink-200 focus:border-pink-300 focus:ring-pink-300"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="w-[150px] border-pink-200">
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
                      <SelectTrigger className="w-[150px] border-pink-200">
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
            transition={{ delay: 0.4 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList
                className={`grid w-full grid-cols-5 p-1.5 bg-gradient-to-r ${colorScheme.glassCard} backdrop-blur-xl border-0 shadow-lg rounded-2xl`}
              >
                {[
                  {
                    value: "all",
                    label: "Tất cả",
                    count: orderStats?.total || 0,
                  },
                  {
                    value: "completed",
                    label: "Hoàn thành",
                    count: orderStats?.completed || 0,
                  },
                  {
                    value: "processing",
                    label: "Đang xử lý",
                    count: orderStats?.processing || 0,
                  },
                  {
                    value: "pending",
                    label: "Chờ xử lý",
                    count: orderStats?.pending || 0,
                  },
                  { value: "cancelled", label: "Đã hủy", count: 0 },
                ].map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className={`data-[state=active]:bg-gradient-to-r data-[state=active]:${colorScheme.primaryGradient} data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all font-semibold`}
                  >
                    {tab.label} ({tab.count})
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value={activeTab} className="mt-6">
                <Card
                  className={`border-0 shadow-xl bg-gradient-to-br ${colorScheme.glassCard} backdrop-blur-lg rounded-2xl`}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span
                        className={`bg-gradient-to-r from-pink-600 via-blue-600 to-orange-600 bg-clip-text text-transparent font-bold`}
                      >
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
                      <Badge className="bg-pink-100 text-pink-700 border-pink-200">
                        {filteredOrders.length} đơn hàng
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {filteredOrders.length === 0 ? (
                      <div className="py-12 text-center">
                        <div
                          className={`inline-flex p-6 rounded-full bg-gradient-to-r ${colorScheme.primaryGradient} opacity-20 mb-4`}
                        >
                          <ShoppingBag className="w-16 h-16 text-white" />
                        </div>
                        <h3 className="mb-2 text-xl font-semibold text-slate-800">
                          {searchTerm
                            ? "Không tìm thấy đơn hàng"
                            : "Chưa có đơn hàng nào"}
                        </h3>
                        <p className="mb-6 text-slate-600">
                          {searchTerm
                            ? `Không có đơn hàng nào khớp với "${searchTerm}"`
                            : "Bạn chưa có đơn hàng nào. Hãy khám phá các sản phẩm của chúng tôi!"}
                        </p>
                        {!searchTerm && (
                          <Button
                            asChild
                            className={`bg-gradient-to-r ${colorScheme.primaryGradient} hover:${colorScheme.secondaryGradient} text-white shadow-lg`}
                          >
                            <Link to="/templates">
                              <ShoppingBag className="w-4 h-4 mr-2" />
                              Khám phá sản phẩm
                            </Link>
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <AnimatePresence>
                          {filteredOrders.map((order, index) => {
                            const statusConfig = getStatusConfig(order.status);
                            return (
                              <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ scale: 1.01, y: -2 }}
                                className={`p-6 transition-all border-0 rounded-2xl shadow-lg hover:shadow-xl bg-gradient-to-br ${statusConfig.bgColor} backdrop-blur-sm`}
                              >
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                  {/* Order Info */}
                                  <div className="flex-1">
                                    <div className="flex items-start justify-between mb-4">
                                      <div>
                                        <div className="flex items-center gap-3 mb-2">
                                          <h4 className="text-lg font-bold text-slate-800">
                                            Đơn hàng #{order.id.slice(0, 8)}
                                          </h4>
                                          <Badge
                                            className={`${statusConfig.bgColor} ${statusConfig.textColor} ${statusConfig.borderColor} border shadow-sm`}
                                          >
                                            <statusConfig.icon className="w-3 h-3 mr-1" />
                                            {statusConfig.text}
                                          </Badge>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-slate-600">
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
                                        <div
                                          className={`text-2xl font-bold bg-gradient-to-r ${statusConfig.gradient} bg-clip-text text-transparent`}
                                        >
                                          {formatPrice(order.total_price)}
                                        </div>
                                        <div className="text-sm text-slate-600">
                                          Tổng thanh toán
                                        </div>
                                      </div>
                                    </div>

                                    {/* Order Items */}
                                    <div className="space-y-3">
                                      <h5 className="font-semibold text-slate-700 flex items-center gap-2">
                                        <Gift className="w-4 h-4" />
                                        Sản phẩm trong đơn hàng:
                                      </h5>
                                      <div className="grid gap-3">
                                        {order.items.map((item, itemIndex) => (
                                          <div
                                            key={itemIndex}
                                            className="flex items-center justify-between p-3 rounded-xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-sm hover:shadow-md transition-all"
                                          >
                                            <div className="flex items-center space-x-3">
                                              {item.product ? (
                                                <>
                                                  <div
                                                    className={`p-2 rounded-lg bg-gradient-to-r ${item.product.category === "template" ? "from-blue-400 to-cyan-500" : "from-green-400 to-emerald-500"} shadow-lg`}
                                                  >
                                                    {item.product.category ===
                                                    "template" ? (
                                                      <FileText className="w-6 h-6 text-white" />
                                                    ) : (
                                                      <Download className="w-6 h-6 text-white" />
                                                    )}
                                                  </div>
                                                  <div className="flex-1">
                                                    <h6 className="font-semibold text-slate-800">
                                                      {item.product.title}
                                                    </h6>
                                                    <div className="flex items-center gap-2 mt-1">
                                                      <Badge
                                                        variant="outline"
                                                        className="text-xs border-pink-200 text-pink-600"
                                                      >
                                                        {item.product
                                                          .category ===
                                                        "template"
                                                          ? "Template"
                                                          : "E-book"}
                                                      </Badge>
                                                      <span className="text-sm text-slate-600">
                                                        Số lượng:{" "}
                                                        {item.quantity}
                                                      </span>
                                                    </div>
                                                  </div>
                                                </>
                                              ) : (
                                                <div className="flex items-center space-x-3">
                                                  <div className="w-10 h-10 bg-slate-200 rounded-lg" />
                                                  <span className="italic text-slate-500">
                                                    Sản phẩm đã bị xóa
                                                  </span>
                                                </div>
                                              )}
                                            </div>
                                            <div className="text-right">
                                              <div className="font-bold text-slate-800">
                                                {formatPrice(
                                                  item.price * item.quantity,
                                                )}
                                              </div>
                                              <div className="text-sm text-slate-500">
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
                                      className="w-full border-pink-200 hover:bg-pink-50"
                                    >
                                      <Eye className="w-4 h-4 mr-2" />
                                      Xem chi tiết
                                    </Button>
                                    {order.status === "completed" && (
                                      <Button
                                        size="sm"
                                        className={`w-full bg-gradient-to-r ${colorScheme.primaryGradient} hover:${colorScheme.secondaryGradient} text-white shadow-lg`}
                                        asChild
                                      >
                                        <Link to="/downloads">
                                          <Download className="w-4 h-4 mr-2" />
                                          Tải xuống
                                        </Link>
                                      </Button>
                                    )}
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="w-full border-pink-200 hover:bg-pink-50"
                                    >
                                      <MessageSquare className="w-4 h-4 mr-2" />
                                      Hỗ trợ
                                    </Button>
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
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
    </div>
  );
};

export default MyOrders;
