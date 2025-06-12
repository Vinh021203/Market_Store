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
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  if (!user || !isAdmin(user)) {
    return <Navigate to="/" replace />;
  }

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const dashboardData = await getDashboardStats();
        setStats(dashboardData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "Lỗi tải dữ liệu",
          description: "Không thể tải dữ liệu dashboard",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const dashboardData = await getDashboardStats();
      setStats(dashboardData);
      toast({
        title: "Đã cập nhật",
        description: "Dữ liệu dashboard đã được cập nhật",
      });
    } catch (error) {
      toast({
        title: "Lỗi cập nhật",
        description: "Không thể cập nhật dữ liệu",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Đang tải dashboard...</span>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold">Không thể tải dữ liệu</h2>
          <Button onClick={handleRefresh}>Thử lại</Button>
        </div>
      </div>
    );
  }

  const overviewCards = [
    {
      title: "Tổng doanh thu",
      value: formatPrice(stats.totalRevenue),
      description: `${stats.monthlyGrowth.revenue > 0 ? "+" : ""}${stats.monthlyGrowth.revenue.toFixed(1)}% so với tháng trước`,
      icon: DollarSign,
      trend: stats.monthlyGrowth.revenue >= 0 ? "up" : "down",
    },
    {
      title: "Tổng đơn hàng",
      value: stats.totalOrders.toString(),
      description: `${stats.monthlyGrowth.orders > 0 ? "+" : ""}${stats.monthlyGrowth.orders.toFixed(1)}% so với tháng trước`,
      icon: ShoppingCart,
      trend: stats.monthlyGrowth.orders >= 0 ? "up" : "down",
    },
    {
      title: "Người dùng",
      value: stats.totalUsers.toString(),
      description: `${stats.monthlyGrowth.users > 0 ? "+" : ""}${stats.monthlyGrowth.users.toFixed(1)}% người dùng mới`,
      icon: Users,
      trend: stats.monthlyGrowth.users >= 0 ? "up" : "down",
    },
    {
      title: "Tổng sản phẩm",
      value: stats.totalProducts.toString(),
      description: `${stats.templates} templates, ${stats.ebooks} e-books`,
      icon: Package,
      trend: "up",
    },
  ];

  return (
    <div className="container px-4 py-8 mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
            Dashboard Quản trị
          </h1>
          <p className="text-muted-foreground">
            Chào mừng trở lại, {user.name}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Làm mới
          </Button>
          <Button
            asChild
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            <Link to="/admin/products">Quản lý sản phẩm</Link>
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        {overviewCards.map((card, index) => (
          <Card key={index} className="transition-shadow hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <card.icon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="flex items-center text-xs text-muted-foreground">
                {card.trend === "up" ? (
                  <ArrowUpRight className="w-3 h-3 mr-1 text-green-500" />
                ) : (
                  <ArrowDownRight className="w-3 h-3 mr-1 text-red-500" />
                )}
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Đơn hàng gần đây</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin/orders">Xem tất cả</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentOrders.length > 0 ? (
                  stats.recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 transition-colors border rounded-lg hover:bg-muted/50"
                    >
                      <div className="space-y-1">
                        <div className="font-medium">
                          #{order.id.slice(0, 8)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString(
                            "vi-VN",
                          )}
                        </div>
                        <div className="text-sm">
                          {order.order_items?.length || 0} sản phẩm
                        </div>
                      </div>
                      <div className="space-y-1 text-right">
                        <div className="font-medium">
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
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-muted-foreground">
                    Chưa có đơn hàng nào
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats & Top Products */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Thống kê nhanh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Download className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Tổng downloads</span>
                </div>
                <span className="font-medium">
                  {stats.totalDownloads.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm">Đánh giá trung bình</span>
                </div>
                <span className="font-medium">{stats.avgRating}/5</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Templates</span>
                </div>
                <span className="font-medium">{stats.templates}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">E-books</span>
                </div>
                <span className="font-medium">{stats.ebooks}</span>
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Sản phẩm hàng đầu</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link to="/admin/products">Quản lý</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.topProducts.length > 0 ? (
                  stats.topProducts.map((product, index) => (
                    <div
                      key={product.id}
                      className="flex items-center space-x-3"
                    >
                      <div className="flex items-center justify-center w-8 h-8 text-sm font-medium rounded bg-primary/10">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">
                          {product.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {product.review_count || 0} đánh giá
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {product.category === "template"
                          ? "Template"
                          : "E-book"}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="py-4 text-sm text-center text-muted-foreground">
                    Chưa có sản phẩm nào
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">Thao tác nhanh</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="transition-shadow cursor-pointer hover:shadow-md group">
            <Link to="/admin/products">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3">
                  <Package className="w-8 h-8 transition-transform text-primary group-hover:scale-110" />
                  <div>
                    <h3 className="font-medium">Quản lý sản phẩm</h3>
                    <p className="text-sm text-muted-foreground">
                      Thêm, sửa, xóa sản phẩm
                    </p>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="transition-shadow cursor-pointer hover:shadow-md group">
            <Link to="/admin/orders">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3">
                  <ShoppingCart className="w-8 h-8 transition-transform text-primary group-hover:scale-110" />
                  <div>
                    <h3 className="font-medium">Quản lý đơn hàng</h3>
                    <p className="text-sm text-muted-foreground">
                      Xem và xử lý đơn hàng
                    </p>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="transition-shadow cursor-pointer hover:shadow-md group">
            <Link to="/admin/users">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3">
                  <Users className="w-8 h-8 transition-transform text-primary group-hover:scale-110" />
                  <div>
                    <h3 className="font-medium">Quản lý người dùng</h3>
                    <p className="text-sm text-muted-foreground">
                      Xem danh sách người dùng
                    </p>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="transition-shadow cursor-pointer hover:shadow-md group">
            <Link to="/admin/blog">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-8 h-8 transition-transform text-primary group-hover:scale-110" />
                  <div>
                    <h3 className="font-medium">Quản lý Blog</h3>
                    <p className="text-sm text-muted-foreground">
                      Viết và quản lý bài viết
                    </p>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
