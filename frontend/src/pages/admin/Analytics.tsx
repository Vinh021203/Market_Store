import React, { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { isAdmin } from "@/lib/auth";
import { formatPrice } from "@/lib/products";
import {
  getAnalyticsData,
  exportAnalyticsReport,
  AnalyticsData,
} from "@/lib/analytics";
import { motion, AnimatePresence } from "framer-motion";
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
  ArrowLeft,
  BarChart3,
  Activity,
  Coffee,
  Code,
  Palette,
  Sparkles,
  Clock,
  Globe,
  Target,
  Zap,
} from "lucide-react";
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
  const [activeTab, setActiveTab] = useState("overview");
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});

  if (!user || !isAdmin(user)) {
    return <Navigate to="/" replace />;
  }

  // ✅ Enhanced fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const data = await getAnalyticsData(timeRange);
        setAnalyticsData(data);
        toast({
          title: "✅ Đã tải thống kê",
          description: `Dữ liệu thống kê ${timeRange} đã được cập nhật.`,
        });
      } catch (error) {
        console.error("Error fetching analytics:", error);
        toast({
          title: "❌ Lỗi tải dữ liệu",
          description: "Không thể tải dữ liệu thống kê",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();

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
  }, [timeRange]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await getAnalyticsData(timeRange);
      setAnalyticsData(data);
      toast({
        title: "🔄 Đã cập nhật",
        description: "Dữ liệu thống kê đã được cập nhật",
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

  const handleExportReport = async () => {
    setExporting(true);
    try {
      const success = await exportAnalyticsReport(timeRange);
      if (success) {
        toast({
          title: "✅ Xuất Excel thành công",
          description: "File báo cáo Excel đã được tải xuống",
        });
      } else {
        throw new Error("Export failed");
      }
    } catch (error) {
      toast({
        title: "❌ Lỗi xuất báo cáo",
        description: "Không thể xuất báo cáo Excel",
        variant: "destructive",
      });
    } finally {
      setExporting(false);
    }
  };

  // ✅ Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
        {/* Floating Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 animate-float">
            <BarChart3 className="w-8 h-8 text-blue-500 opacity-20" />
          </div>
          <div className="absolute top-1/3 right-1/4 animate-float-delay-1">
            <TrendingUp className="w-6 h-6 text-purple-500 opacity-20" />
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
            <Card className="py-12 text-center border-0 shadow-2xl bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900">
              <CardContent>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 mx-auto mb-4 border-4 rounded-full border-primary border-t-transparent"
                />
                <h2 className="mb-2 text-xl font-semibold">
                  Đang tải thống kê...
                </h2>
                <p className="text-muted-foreground">
                  Vui lòng đợi trong giây lát
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
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
                  <BarChart3 className="w-16 h-16 mx-auto mb-4 text-red-500" />
                </motion.div>
                <h2 className="mb-4 text-2xl font-bold">
                  Không thể tải dữ liệu
                </h2>
                <p className="mb-6 text-muted-foreground">
                  Có lỗi xảy ra khi tải dữ liệu thống kê
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

  const kpiCards = [
    {
      title: "Tổng doanh thu",
      value: formatPrice(analyticsData.kpiData.totalRevenue),
      change: `${analyticsData.kpiData.revenueGrowth > 0 ? "+" : ""}${analyticsData.kpiData.revenueGrowth.toFixed(1)}%`,
      trend: analyticsData.kpiData.revenueGrowth >= 0 ? "up" : "down",
      icon: DollarSign,
      gradient: "from-green-500 to-emerald-500",
      bgGradient:
        "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
    },
    {
      title: "Đơn hàng",
      value: analyticsData.kpiData.totalOrders.toString(),
      change: `${analyticsData.kpiData.ordersGrowth > 0 ? "+" : ""}${analyticsData.kpiData.ordersGrowth.toFixed(1)}%`,
      trend: analyticsData.kpiData.ordersGrowth >= 0 ? "up" : "down",
      icon: ShoppingCart,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient:
        "from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20",
    },
    {
      title: "Khách hàng mới",
      value: analyticsData.kpiData.newCustomers.toString(),
      change: `${analyticsData.kpiData.customersGrowth > 0 ? "+" : ""}${analyticsData.kpiData.customersGrowth.toFixed(1)}%`,
      trend: analyticsData.kpiData.customersGrowth >= 0 ? "up" : "down",
      icon: Users,
      gradient: "from-purple-500 to-violet-500",
      bgGradient:
        "from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20",
    },
    {
      title: "Lượt tải",
      value: analyticsData.kpiData.totalDownloads.toLocaleString(),
      change: `${analyticsData.kpiData.downloadsGrowth > 0 ? "+" : ""}${analyticsData.kpiData.downloadsGrowth.toFixed(1)}%`,
      trend: analyticsData.kpiData.downloadsGrowth >= 0 ? "up" : "down",
      icon: Download,
      gradient: "from-orange-500 to-red-500",
      bgGradient:
        "from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20",
    },
  ];

  const tabsConfig = [
    {
      id: "overview",
      label: "Tổng quan",
      icon: BarChart3,
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "revenue",
      label: "Doanh thu",
      icon: DollarSign,
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "users",
      label: "Người dùng",
      icon: Users,
      color: "from-purple-500 to-violet-500",
    },
    {
      id: "products",
      label: "Sản phẩm",
      icon: Package,
      color: "from-orange-500 to-red-500",
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

      <div className="container relative z-10 px-4 py-8 mx-auto space-y-8">
        {/* ✅ Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
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
                <BarChart3 className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text">
                  Thống kê & Phân tích
                </h1>
                <p className="text-muted-foreground">
                  Theo dõi hiệu suất kinh doanh và xu hướng người dùng
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <motion.div whileFocus={{ scale: 1.01 }}>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-40 h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>7 ngày qua</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="30d">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>30 ngày qua</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="90d">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>3 tháng qua</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="1y">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>1 năm qua</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </motion.div>

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
                variant="outline"
                onClick={handleExportReport}
                disabled={exporting}
                className="group"
              >
                {exporting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-4 h-4 mr-2 border-2 border-current rounded-full border-t-transparent"
                  />
                ) : (
                  <Download className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
                )}
                Xuất Excel
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* ✅ Enhanced KPI Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
          id="kpi"
          data-animate
        >
          {kpiCards.map((kpi, index) => (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`transition-all duration-500 ${
                isVisible.kpi ? "animate-in slide-in-from-bottom" : "opacity-0"
              }`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <Card
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl border-0 bg-gradient-to-br ${kpi.bgGradient} group`}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {kpi.title}
                  </CardTitle>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-10 h-10 rounded-xl bg-gradient-to-r ${kpi.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}
                  >
                    <kpi.icon className="w-5 h-5 text-white" />
                  </motion.div>
                </CardHeader>
                <CardContent>
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="mb-2 text-2xl font-bold"
                  >
                    {kpi.value}
                  </motion.div>
                  <div className="flex items-center space-x-1 text-xs">
                    {kpi.trend === "up" ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        <TrendingUp className="w-3 h-3 text-green-600" />
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        <TrendingDown className="w-3 h-3 text-red-600" />
                      </motion.div>
                    )}
                    <span
                      className={
                        kpi.trend === "up" ? "text-green-600" : "text-red-600"
                      }
                    >
                      {kpi.change}
                    </span>
                    <span className="text-muted-foreground">
                      so với kỳ trước
                    </span>
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
        </motion.div>

        {/* ✅ Enhanced Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          id="tabs"
          data-animate
        >
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4 mb-8 bg-gradient-to-r from-white to-blue-50 dark:from-slate-800 dark:to-blue-900">
              {tabsConfig.map((tab, index) => (
                <motion.div
                  key={tab.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <TabsTrigger
                    value={tab.id}
                    className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300"
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </TabsTrigger>
                </motion.div>
              ))}
            </TabsList>

            <AnimatePresence mode="wait">
              {/* ✅ Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                <motion.div
                  key="overview-tab"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid gap-6 lg:grid-cols-2"
                >
                  {/* Revenue Chart */}
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-blue-900">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500">
                          <DollarSign className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text">
                          Doanh thu theo tháng
                        </span>
                      </CardTitle>
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
                              <stop
                                offset="5%"
                                stopColor="#3b82f6"
                                stopOpacity={0.3}
                              />
                              <stop
                                offset="95%"
                                stopColor="#3b82f6"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            className="opacity-30"
                          />
                          <XAxis dataKey="month" />
                          <YAxis
                            tickFormatter={(value) => formatPrice(value)}
                          />
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

                  {/* Orders vs Users Chart */}
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50 dark:from-slate-800 dark:to-purple-900">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text">
                          Đơn hàng & Khách hàng mới
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={analyticsData.revenueData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            className="opacity-30"
                          />
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
              </TabsContent>

              {/* ✅ Revenue Tab */}
              <TabsContent value="revenue" className="space-y-6">
                <motion.div
                  key="revenue-tab"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid gap-6 lg:grid-cols-3"
                >
                  {/* Category Distribution */}
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-green-50 dark:from-slate-800 dark:to-green-900">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500">
                          <Target className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl text-transparent bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text">
                          Phân bố danh mục
                        </span>
                      </CardTitle>
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
                          <Tooltip
                            formatter={(value) => [`${value}%`, "Tỷ lệ"]}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Top Products */}
                  <Card className="border-0 shadow-lg lg:col-span-2 bg-gradient-to-br from-white to-orange-50 dark:from-slate-800 dark:to-orange-900">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-orange-500 to-red-500">
                          <Package className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl text-transparent bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text">
                          Sản phẩm bán chạy
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {analyticsData.topProducts.length > 0 ? (
                          analyticsData.topProducts.map((product, index) => (
                            <motion.div
                              key={product.name}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              whileHover={{ scale: 1.02, x: 4 }}
                              className="flex items-center justify-between p-4 transition-all duration-300 rounded-xl bg-gradient-to-r from-white to-gray-50 dark:from-slate-700 dark:to-slate-800 hover:shadow-md group"
                            >
                              <div className="flex items-center space-x-3">
                                <motion.div
                                  whileHover={{ scale: 1.1 }}
                                  className={`flex items-center justify-center w-10 h-10 rounded-xl shadow-lg ${
                                    index === 0
                                      ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                                      : index === 1
                                        ? "bg-gradient-to-r from-gray-400 to-gray-500"
                                        : index === 2
                                          ? "bg-gradient-to-r from-orange-500 to-red-500"
                                          : "bg-gradient-to-r from-blue-500 to-purple-600"
                                  }`}
                                >
                                  <span className="text-sm font-bold text-white">
                                    #{index + 1}
                                  </span>
                                </motion.div>
                                <div>
                                  <h4 className="font-medium transition-colors group-hover:text-primary">
                                    {product.name}
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    {product.sales} lượt bán
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold text-primary">
                                  {formatPrice(product.revenue)}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Doanh thu
                                </div>
                              </div>
                            </motion.div>
                          ))
                        ) : (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="py-8 text-center text-muted-foreground"
                          >
                            <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>Chưa có dữ liệu sản phẩm</p>
                          </motion.div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* ✅ Users Tab */}
              <TabsContent value="users" className="space-y-6">
                <motion.div
                  key="users-tab"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Visitors Chart */}
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50 dark:from-slate-800 dark:to-purple-900">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-violet-500">
                          <Eye className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl text-transparent bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text">
                          Lượt truy cập hàng ngày
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={analyticsData.dailyVisitors}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            className="opacity-30"
                          />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip labelStyle={{ color: "#000" }} />
                          <Legend />
                          <Bar
                            dataKey="visitors"
                            fill="#3b82f6"
                            name="Khách truy cập"
                          />
                          <Bar
                            dataKey="pageViews"
                            fill="#8b5cf6"
                            name="Lượt xem trang"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* ✅ Products Tab - Fixed version */}
              <TabsContent value="products" className="space-y-6">
                <motion.div
                  key="products-tab"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-orange-50 dark:from-slate-800 dark:to-orange-900">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-orange-500 to-red-500">
                          <Package className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl text-transparent bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text">
                          Hiệu suất sản phẩm chi tiết
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold">
                            Top Products
                          </h4>
                          <div className="space-y-3">
                            {analyticsData.topProducts
                              .slice(
                                0,
                                Math.ceil(analyticsData.topProducts.length / 2),
                              ) // ✅ Chia đôi array thay vì filter by category
                              .map((product, index) => (
                                <motion.div
                                  key={product.name}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20"
                                >
                                  <div>
                                    <div className="font-medium">
                                      {product.name}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      {product.sales} lượt bán
                                    </div>
                                  </div>
                                  <Badge className="text-blue-800 bg-blue-100">
                                    {formatPrice(product.revenue)}
                                  </Badge>
                                </motion.div>
                              ))}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold">
                            Other Products
                          </h4>
                          <div className="space-y-3">
                            {analyticsData.topProducts
                              .slice(
                                Math.ceil(analyticsData.topProducts.length / 2),
                              ) // ✅ Nửa còn lại
                              .map((product, index) => (
                                <motion.div
                                  key={product.name}
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/20"
                                >
                                  <div>
                                    <div className="font-medium">
                                      {product.name}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      {product.sales} lượt bán
                                    </div>
                                  </div>
                                  <Badge className="text-green-800 bg-green-100">
                                    {formatPrice(product.revenue)}
                                  </Badge>
                                </motion.div>
                              ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;
