import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { isAdmin } from "@/lib/auth";
import { formatPrice } from "@/lib/products";
import {
  getDashboardStats,
  getChartData,
  DashboardStats,
} from "@/lib/dashboard";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  BookOpen,
  Users,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  Download,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Calendar,
  Clock,
  Award,
  Zap,
  Target,
  BarChart3,
  Activity,
  Coffee,
  Code,
  Palette,
  AlertTriangle, // ✅ Thêm AlertTriangle import
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});

  if (!user || !isAdmin(user)) {
    return <Navigate to="/" replace />;
  }

  // ✅ Fetch dashboard data - Bỏ loading state
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const dashboardData = await getDashboardStats();
        setStats(dashboardData);
        toast({
          title: "✅ Đã tải dashboard",
          description: "Dữ liệu dashboard đã được cập nhật thành công.",
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "❌ Lỗi tải dữ liệu",
          description: "Không thể tải dữ liệu dashboard",
          variant: "destructive",
        });
      }
    };

    fetchDashboardData();

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

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const dashboardData = await getDashboardStats();
      setStats(dashboardData);
      toast({
        title: "🔄 Đã cập nhật",
        description: "Dữ liệu dashboard đã được cập nhật",
      });
    } catch (error) {
      toast({
        title: "❌ Lỗi cập nhật",
        description: "Không thể cập nhật dữ liệu",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };

  // ✅ Error state only - Bỏ loading state
  if (!stats) {
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
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center min-h-screen"
          >
            <Card className="py-12 text-center border-0 shadow-2xl bg-gradient-to-br from-white to-red-50 dark:from-slate-800 dark:to-red-900">
              <CardContent>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-red-500" />
                </motion.div>
                <h2 className="mb-4 text-2xl font-bold">
                  Không thể tải dữ liệu
                </h2>
                <p className="mb-6 text-muted-foreground">
                  Có lỗi xảy ra khi tải dữ liệu dashboard
                </p>
                <Button
                  onClick={handleRefresh}
                  className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Thử lại
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  // ✅ Enhanced overview cards với animations
  const overviewCards = [
    {
      title: "Tổng doanh thu",
      value: formatPrice(stats.totalRevenue),
      description: `${stats.monthlyGrowth.revenue > 0 ? "+" : ""}${stats.monthlyGrowth.revenue.toFixed(1)}% so với tháng trước`,
      icon: DollarSign,
      trend: stats.monthlyGrowth.revenue >= 0 ? "up" : "down",
      gradient: "from-green-500 to-emerald-500",
      bgGradient:
        "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
    },
    {
      title: "Tổng đơn hàng",
      value: stats.totalOrders.toString(),
      description: `${stats.monthlyGrowth.orders > 0 ? "+" : ""}${stats.monthlyGrowth.orders.toFixed(1)}% so với tháng trước`,
      icon: ShoppingCart,
      trend: stats.monthlyGrowth.orders >= 0 ? "up" : "down",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient:
        "from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20",
    },
    {
      title: "Người dùng",
      value: stats.totalUsers.toString(),
      description: `${stats.monthlyGrowth.users > 0 ? "+" : ""}${stats.monthlyGrowth.users.toFixed(1)}% người dùng mới`,
      icon: Users,
      trend: stats.monthlyGrowth.users >= 0 ? "up" : "down",
      gradient: "from-purple-500 to-pink-500",
      bgGradient:
        "from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20",
    },
    {
      title: "Tổng sản phẩm",
      value: stats.totalProducts.toString(),
      description: `${stats.templates} templates, ${stats.ebooks} e-books`,
      icon: Package,
      trend: "up",
      gradient: "from-orange-500 to-red-500",
      bgGradient:
        "from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20",
    },
  ];

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
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="flex items-center justify-center w-12 h-12 shadow-lg rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600"
            >
              <BarChart3 className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text">
                Dashboard Quản trị
              </h1>
              <p className="flex items-center space-x-2 text-muted-foreground">
                <span>Chào mừng trở lại, {user.name}</span>
                <Badge className="text-yellow-800 bg-yellow-100">
                  <Award className="w-3 h-3 mr-1" />
                  Admin
                </Badge>
              </p>
            </div>
          </div>

          <div className="flex space-x-3">
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
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                  </motion.div>
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2 group-hover:animate-spin" />
                )}
                Làm mới
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                asChild
                className="transition-all duration-300 shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl"
              >
                <Link to="/admin/products">
                  <Package className="w-4 h-4 mr-2" />
                  Quản lý sản phẩm
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* ✅ Enhanced Overview Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4"
          id="overview"
          data-animate
        >
          {overviewCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`transition-all duration-500 ${
                isVisible.overview
                  ? "animate-in slide-in-from-bottom"
                  : "opacity-0"
              }`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <Card
                className={`transition-all duration-300 hover:shadow-xl border-0 bg-gradient-to-br ${card.bgGradient} group`}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </CardTitle>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-10 h-10 rounded-xl bg-gradient-to-r ${card.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}
                  >
                    <card.icon className="w-5 h-5 text-white" />
                  </motion.div>
                </CardHeader>
                <CardContent>
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="mb-2 text-2xl font-bold text-foreground"
                  >
                    {card.value}
                  </motion.div>
                  <p className="flex items-center text-xs text-muted-foreground">
                    {card.trend === "up" ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        <ArrowUpRight className="w-3 h-3 mr-1 text-green-500" />
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        <ArrowDownRight className="w-3 h-3 mr-1 text-red-500" />
                      </motion.div>
                    )}
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* ✅ Enhanced Recent Orders */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
            id="orders"
            data-animate
          >
            <Card className="transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-blue-900 hover:shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500">
                    <ShoppingCart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text">
                      Đơn hàng gần đây
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {stats.recentOrders.length} đơn hàng mới nhất
                    </p>
                  </div>
                </div>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Button variant="outline" size="sm" asChild className="group">
                    <Link to="/admin/orders">
                      Xem tất cả
                      <ArrowUpRight className="w-3 h-3 ml-1 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </Link>
                  </Button>
                </motion.div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <AnimatePresence>
                    {stats.recentOrders.length > 0 ? (
                      stats.recentOrders.map((order, index) => (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                          whileHover={{ scale: 1.01, x: 4 }}
                          className="flex items-center justify-between p-4 transition-all duration-300 border rounded-xl hover:bg-muted/50 hover:shadow-md group"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2 font-medium">
                              <span>#{order.id.slice(0, 8)}</span>
                              <Badge variant="outline" className="text-xs">
                                <Clock className="w-3 h-3 mr-1" />
                                Mới
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              <span>
                                {new Date(order.created_at).toLocaleDateString(
                                  "vi-VN",
                                )}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <Package className="w-3 h-3 text-primary" />
                              <span>
                                {order.order_items?.length || 0} sản phẩm
                              </span>
                            </div>
                          </div>
                          <div className="space-y-1 text-right">
                            <div className="text-lg font-medium text-primary">
                              {formatPrice(order.total_price || 0)}
                            </div>
                            <Badge
                              variant={
                                order.status === "completed"
                                  ? "default"
                                  : order.status === "processing"
                                    ? "secondary"
                                    : order.status === "pending"
                                      ? "outline"
                                      : "destructive"
                              }
                              className="transition-all duration-300 group-hover:scale-105"
                            >
                              {order.status === "completed"
                                ? "Hoàn thành"
                                : order.status === "processing"
                                  ? "Đang xử lý"
                                  : order.status === "pending"
                                    ? "Chờ xử lý"
                                    : "Đã hủy"}
                            </Badge>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="py-8 text-center text-muted-foreground"
                      >
                        <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Chưa có đơn hàng nào</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* ✅ Enhanced Quick Stats & Top Products */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-6"
            id="stats"
            data-animate
          >
            {/* Quick Stats */}
            <Card className="transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-green-50 dark:from-slate-800 dark:to-green-900 hover:shadow-xl">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-transparent bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text">
                      Thống kê nhanh
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Dữ liệu tổng quan
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    icon: Download,
                    label: "Tổng downloads",
                    value: stats.totalDownloads.toLocaleString(),
                    color: "text-blue-500",
                  },
                  {
                    icon: Star,
                    label: "Đánh giá trung bình",
                    value: `${stats.avgRating}/5`,
                    color: "text-yellow-500",
                  },
                  {
                    icon: Package,
                    label: "Templates",
                    value: stats.templates.toString(),
                    color: "text-purple-500",
                  },
                  {
                    icon: BookOpen,
                    label: "E-books",
                    value: stats.ebooks.toString(),
                    color: "text-green-500",
                  },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 4 }}
                    className="flex items-center justify-between p-3 transition-all duration-300 rounded-lg hover:bg-muted/50 group"
                  >
                    <div className="flex items-center space-x-3">
                      <stat.icon
                        className={`w-4 h-4 ${stat.color} group-hover:scale-110 transition-transform duration-300`}
                      />
                      <span className="text-sm font-medium">{stat.label}</span>
                    </div>
                    <span className="font-bold text-primary">{stat.value}</span>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Top Products */}
            <Card className="transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-purple-50 dark:from-slate-800 dark:to-purple-900 hover:shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text">
                      Sản phẩm hàng đầu
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Top {stats.topProducts.length} sản phẩm
                    </p>
                  </div>
                </div>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Button variant="outline" size="sm" asChild className="group">
                    <Link to="/admin/products">
                      Quản lý
                      <ArrowUpRight className="w-3 h-3 ml-1 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </Link>
                  </Button>
                </motion.div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <AnimatePresence>
                    {stats.topProducts.length > 0 ? (
                      stats.topProducts.map((product, index) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 + index * 0.1 }}
                          whileHover={{ scale: 1.02, x: 4 }}
                          className="flex items-center p-3 space-x-3 transition-all duration-300 rounded-lg hover:bg-muted/50 group"
                        >
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className={`flex items-center justify-center w-8 h-8 text-sm font-bold rounded-lg ${
                              index === 0
                                ? "bg-yellow-500 text-white"
                                : index === 1
                                  ? "bg-gray-400 text-white"
                                  : index === 2
                                    ? "bg-orange-500 text-white"
                                    : "bg-primary/10 text-primary"
                            }`}
                          >
                            {index + 1}
                          </motion.div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate transition-colors group-hover:text-primary">
                              {product.title}
                            </div>
                            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                              <Star className="w-3 h-3 text-yellow-400" />
                              <span>{product.review_count || 0} đánh giá</span>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className={`text-xs transition-all duration-300 group-hover:scale-105 ${
                              product.category === "template"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {product.category === "template"
                              ? "Template"
                              : "E-book"}
                          </Badge>
                        </motion.div>
                      ))
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="py-4 text-sm text-center text-muted-foreground"
                      >
                        <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>Chưa có sản phẩm nào</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* ✅ Enhanced Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
          id="actions"
          data-animate
        >
          <div className="flex items-center mb-6 space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-orange-500 to-red-500">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text">
                Thao tác nhanh
              </h2>
              <p className="text-sm text-muted-foreground">
                Các tác vụ quản trị thường dùng
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Quản lý sản phẩm",
                description: "Thêm, sửa, xóa sản phẩm",
                icon: Package,
                href: "/admin/products",
                gradient: "from-blue-500 to-cyan-500",
                bgGradient:
                  "from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20",
              },
              {
                title: "Quản lý đơn hàng",
                description: "Xem và xử lý đơn hàng",
                icon: ShoppingCart,
                href: "/admin/orders",
                gradient: "from-green-500 to-emerald-500",
                bgGradient:
                  "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
              },
              {
                title: "Quản lý người dùng",
                description: "Xem danh sách người dùng",
                icon: Users,
                href: "/admin/users",
                gradient: "from-purple-500 to-pink-500",
                bgGradient:
                  "from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20",
              },
              {
                title: "Quản lý Blog",
                description: "Viết và quản lý bài viết",
                icon: BookOpen,
                href: "/admin/blog",
                gradient: "from-orange-500 to-red-500",
                bgGradient:
                  "from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20",
              },
            ].map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className={`transition-all duration-500 ${
                  isVisible.actions
                    ? "animate-in slide-in-from-bottom"
                    : "opacity-0"
                }`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <Card
                  className={`transition-all duration-300 hover:shadow-xl cursor-pointer group border-0 bg-gradient-to-br ${action.bgGradient}`}
                >
                  <Link to={action.href}>
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-4">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className={`w-12 h-12 rounded-xl bg-gradient-to-r ${action.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}
                        >
                          <action.icon className="w-6 h-6 text-white" />
                        </motion.div>
                        <div className="flex-1">
                          <h3 className="mb-1 text-lg font-semibold transition-colors group-hover:text-primary">
                            {action.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {action.description}
                          </p>
                        </div>
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          whileHover={{ opacity: 1, x: 0 }}
                          className="transition-all duration-300 opacity-0 group-hover:opacity-100"
                        >
                          <ArrowUpRight className="w-5 h-5 text-primary" />
                        </motion.div>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
