import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { isAdmin } from "@/lib/auth";
import { formatPrice } from "@/lib/products";
import {
  getAnalyticsData,
  exportAnalyticsReport,
  AnalyticsData,
} from "@/lib/analytics";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Download,
  Eye,
  Calendar,
  Filter,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { toast } from "@/hooks/use-toast";

const Analytics: React.FC = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState("30d");
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);

  if (!user || !isAdmin(user)) {
    return <Navigate to="/" replace />;
  }

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const data = await getAnalyticsData(timeRange);
        setAnalyticsData(data);
      } catch (error) {
        console.error("Error fetching analytics:", error);
        toast({
          title: "Lỗi tải dữ liệu",
          description: "Không thể tải dữ liệu thống kê",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeRange]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await getAnalyticsData(timeRange);
      setAnalyticsData(data);
      toast({
        title: "Đã cập nhật",
        description: "Dữ liệu thống kê đã được cập nhật",
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

  const handleExportReport = async () => {
    setExporting(true);
    try {
      const success = await exportAnalyticsReport(timeRange);
      if (success) {
        toast({
          title: "Xuất Excel thành công",
          description: "File báo cáo Excel đã được tải xuống",
        });
      } else {
        throw new Error("Export failed");
      }
    } catch (error) {
      toast({
        title: "Lỗi xuất báo cáo",
        description: "Không thể xuất báo cáo Excel",
        variant: "destructive",
      });
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Đang tải dữ liệu thống kê...</span>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold">Không thể tải dữ liệu</h2>
          <Button onClick={handleRefresh}>Thử lại</Button>
        </div>
      </div>
    );
  }

  const kpiCards = [
    {
      title: "Tổng doanh thu",
      value: formatPrice(analyticsData.kpiData.totalRevenue),
      change: `${analyticsData.kpiData.revenueGrowth > 0 ? "+" : ""}${analyticsData.kpiData.revenueGrowth.toFixed(1)}%`,
      trend: analyticsData.kpiData.revenueGrowth >= 0 ? "up" : "down",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Đơn hàng",
      value: analyticsData.kpiData.totalOrders.toString(),
      change: `${analyticsData.kpiData.ordersGrowth > 0 ? "+" : ""}${analyticsData.kpiData.ordersGrowth.toFixed(1)}%`,
      trend: analyticsData.kpiData.ordersGrowth >= 0 ? "up" : "down",
      icon: ShoppingCart,
      color: "text-blue-600",
    },
    {
      title: "Khách hàng mới",
      value: analyticsData.kpiData.newCustomers.toString(),
      change: `${analyticsData.kpiData.customersGrowth > 0 ? "+" : ""}${analyticsData.kpiData.customersGrowth.toFixed(1)}%`,
      trend: analyticsData.kpiData.customersGrowth >= 0 ? "up" : "down",
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Lượt tải",
      value: analyticsData.kpiData.totalDownloads.toLocaleString(),
      change: `${analyticsData.kpiData.downloadsGrowth > 0 ? "+" : ""}${analyticsData.kpiData.downloadsGrowth.toFixed(1)}%`,
      trend: analyticsData.kpiData.downloadsGrowth >= 0 ? "up" : "down",
      icon: Download,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
            Thống kê & Phân tích
          </h1>
          <p className="mt-1 text-muted-foreground">
            Theo dõi hiệu suất kinh doanh và xu hướng người dùng
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 ngày qua</SelectItem>
              <SelectItem value="30d">30 ngày qua</SelectItem>
              <SelectItem value="90d">3 tháng qua</SelectItem>
              <SelectItem value="1y">1 năm qua</SelectItem>
            </SelectContent>
          </Select>

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
            variant="outline"
            onClick={handleExportReport}
            disabled={exporting}
          >
            {exporting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Calendar className="w-4 h-4 mr-2" />
            )}
            Xuất Excel
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  {kpi.title}
                </CardTitle>
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <div className="flex items-center space-x-1 text-xs">
                  {kpi.trend === "up" ? (
                    <TrendingUp className="w-3 h-3 text-green-600" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-600" />
                  )}
                  <span
                    className={
                      kpi.trend === "up" ? "text-green-600" : "text-red-600"
                    }
                  >
                    {kpi.change}
                  </span>
                  <span className="text-muted-foreground">so với kỳ trước</span>
                </div>
              </CardContent>
              <div
                className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r ${
                  kpi.trend === "up"
                    ? "from-green-500 to-emerald-500"
                    : "from-red-500 to-rose-500"
                }`}
              />
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Doanh thu theo tháng</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analyticsData.revenueData}>
                  <defs>
                    <linearGradient
                      id="revenueGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => formatPrice(value)} />
                  <Tooltip
                    formatter={(value) => [
                      formatPrice(Number(value)),
                      "Doanh thu",
                    ]}
                    labelStyle={{ color: "#000" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#revenueGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Orders vs Users Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Đơn hàng & Khách hàng mới</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analyticsData.revenueData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip labelStyle={{ color: "#000" }} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    name="Đơn hàng"
                  />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#10b981"
                    strokeWidth={3}
                    name="Khách hàng mới"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Phân bố danh mục</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={analyticsData.categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {analyticsData.categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, "Tỷ lệ"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle>Sản phẩm bán chạy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.topProducts.length > 0 ? (
                  analyticsData.topProducts.map((product, index) => (
                    <div
                      key={product.name}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                          <span className="text-sm font-bold text-primary">
                            #{index + 1}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium">{product.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {product.sales} lượt bán
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          {formatPrice(product.revenue)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Doanh thu
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-muted-foreground">
                    Chưa có dữ liệu sản phẩm
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Visitors Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Lượt truy cập hàng ngày</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.dailyVisitors}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip labelStyle={{ color: "#000" }} />
                <Legend />
                <Bar dataKey="visitors" fill="#3b82f6" name="Khách truy cập" />
                <Bar dataKey="pageViews" fill="#8b5cf6" name="Lượt xem trang" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Analytics;
