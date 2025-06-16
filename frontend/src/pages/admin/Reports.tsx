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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { isAdmin } from "@/lib/auth";
import { motion, AnimatePresence } from "framer-motion";
import {
  getReports,
  exportToExcel,
  exportToPDF,
  deleteReport,
  ReportData,
} from "@/lib/reports";
import {
  Download,
  FileText,
  Calendar,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  RefreshCw,
  Loader2,
  Trash2,
  Eye,
  ArrowLeft,
  BarChart3,
  Activity,
  Coffee,
  Code,
  Palette,
  Sparkles,
  Filter,
  Search,
  Plus,
  Clock,
  CheckCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Reports: React.FC = () => {
  const { user } = useAuth();
  const [reportType, setReportType] = useState("all");
  const [timeRange, setTimeRange] = useState("30d");
  const [isGenerating, setIsGenerating] = useState(false);
  const [reports, setReports] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<"PDF" | "Excel">(
    "Excel",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});

  // ✅ Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [reportsPerPage] = useState(8);

  if (!user || !isAdmin(user)) {
    return <Navigate to="/" replace />;
  }

  // ✅ Enhanced fetch reports
  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const data = await getReports(reportType, timeRange);
        setReports(data);
        toast({
          title: "✅ Đã tải báo cáo",
          description: `Tải thành công ${data.length} báo cáo.`,
        });
      } catch (error) {
        console.error("Error fetching reports:", error);
        toast({
          title: "❌ Lỗi tải báo cáo",
          description: "Không thể tải danh sách báo cáo",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReports();

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
  }, [reportType, timeRange]);

  // ✅ Filter reports
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = reportType === "all" || report.type === reportType;

    return matchesSearch && matchesType;
  });

  // ✅ Pagination logic
  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = filteredReports.slice(
    indexOfFirstReport,
    indexOfLastReport,
  );
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);

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
  }, [searchQuery, reportType, timeRange]);

  const reportTemplates = [
    {
      name: "Báo cáo doanh thu",
      description: "Tổng quan về doanh thu, lợi nhuận và xu hướng",
      icon: DollarSign,
      gradient: "from-green-500 to-emerald-500",
      bgGradient:
        "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
      type: "sales",
    },
    {
      name: "Báo cáo đơn hàng",
      description: "Phân tích đơn hàng, conversion rate và AOV",
      icon: ShoppingCart,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient:
        "from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20",
      type: "sales",
    },
    {
      name: "Báo cáo người dùng",
      description: "Thống kê người dùng, retention và engagement",
      icon: Users,
      gradient: "from-purple-500 to-violet-500",
      bgGradient:
        "from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20",
      type: "users",
    },
    {
      name: "Báo cáo sản phẩm",
      description: "Hiệu suất sản phẩm và phân tích danh mục",
      icon: Package,
      gradient: "from-orange-500 to-red-500",
      bgGradient:
        "from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20",
      type: "products",
    },
  ];

  const handleGenerateReport = async (templateName: string) => {
    setIsGenerating(true);
    try {
      let success = false;

      if (selectedFormat === "Excel") {
        success = await exportToExcel(templateName, timeRange);
      } else {
        success = await exportToPDF(templateName, timeRange);
      }

      if (success) {
        toast({
          title: "✅ Tạo báo cáo thành công",
          description: `Báo cáo ${selectedFormat} đã được tải xuống`,
        });

        // Refresh danh sách báo cáo
        const updatedReports = await getReports(reportType, timeRange);
        setReports(updatedReports);
      } else {
        throw new Error("Export failed");
      }
    } catch (error) {
      console.error("Error generating report:", error);
      toast({
        title: "❌ Lỗi tạo báo cáo",
        description: "Có lỗi xảy ra khi tạo báo cáo",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await getReports(reportType, timeRange);
      setReports(data);
      toast({
        title: "🔄 Đã cập nhật",
        description: "Danh sách báo cáo đã được cập nhật",
      });
    } catch (error) {
      toast({
        title: "❌ Lỗi cập nhật",
        description: "Không thể cập nhật danh sách báo cáo",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    try {
      const success = await deleteReport(reportId);
      if (success) {
        setReports((prev) => prev.filter((r) => r.id !== reportId));
        toast({
          title: "🗑️ Đã xóa báo cáo",
          description: "Báo cáo đã được xóa khỏi hệ thống",
        });
      }
    } catch (error) {
      toast({
        title: "❌ Lỗi xóa báo cáo",
        description: "Không thể xóa báo cáo",
        variant: "destructive",
      });
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
          Hiển thị {indexOfFirstReport + 1} đến{" "}
          {Math.min(indexOfLastReport, filteredReports.length)} của{" "}
          {filteredReports.length} báo cáo
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
            <FileText className="w-6 h-6 text-purple-500 opacity-20" />
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
                  Đang tải báo cáo...
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
                  Báo cáo & Xuất dữ liệu
                </h1>
                <p className="text-muted-foreground">
                  Tạo và quản lý các báo cáo kinh doanh
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <motion.div whileFocus={{ scale: 1.01 }}>
              <Select
                value={selectedFormat}
                onValueChange={(value: "PDF" | "Excel") =>
                  setSelectedFormat(value)
                }
              >
                <SelectTrigger className="w-32 h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Excel">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-green-600" />
                      <span>Excel</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="PDF">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-red-600" />
                      <span>PDF</span>
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
          </div>
        </motion.div>

        {/* ✅ Enhanced Quick Generate Templates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
          id="templates"
          data-animate
        >
          {reportTemplates.map((template, index) => (
            <motion.div
              key={template.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`transition-all duration-500 ${
                isVisible.templates
                  ? "animate-in slide-in-from-bottom"
                  : "opacity-0"
              }`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <Card
                className={`transition-all duration-300 hover:shadow-xl border-0 bg-gradient-to-br ${template.bgGradient} group cursor-pointer`}
              >
                <CardContent className="pt-6">
                  <div className="space-y-4 text-center">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`mx-auto w-12 h-12 rounded-xl bg-gradient-to-r ${template.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}
                    >
                      <template.icon className="w-6 h-6 text-white" />
                    </motion.div>
                    <div>
                      <h3 className="mb-2 text-lg font-semibold transition-colors group-hover:text-primary">
                        {template.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {template.description}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <motion.div whileFocus={{ scale: 1.01 }}>
                        <Select value={timeRange} onValueChange={setTimeRange}>
                          <SelectTrigger className="w-full h-10">
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
                          </SelectContent>
                        </Select>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          size="sm"
                          className="w-full transition-all duration-300 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                          onClick={() => handleGenerateReport(template.name)}
                          disabled={isGenerating}
                        >
                          {isGenerating ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                              className="w-4 h-4 mr-2 border-2 border-white rounded-full border-t-transparent"
                            />
                          ) : (
                            <Download className="w-4 h-4 mr-2" />
                          )}
                          Tạo {selectedFormat}
                        </Button>
                      </motion.div>
                    </div>
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
                    Tìm kiếm và lọc báo cáo theo tiêu chí
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
                    placeholder="Tìm kiếm báo cáo theo tên hoặc mô tả..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-12 pl-10 transition-all duration-300 border-0 bg-background/50 focus:ring-2 focus:ring-primary/20"
                  />
                </motion.div>

                <motion.div whileFocus={{ scale: 1.01 }}>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger className="w-full md:w-[180px] h-12">
                      <SelectValue placeholder="Loại báo cáo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả loại</SelectItem>
                      <SelectItem value="sales">Doanh số</SelectItem>
                      <SelectItem value="users">Người dùng</SelectItem>
                      <SelectItem value="products">Sản phẩm</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ✅ Enhanced Reports History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          id="reports"
          data-animate
        >
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-transparent bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text">
                      Lịch sử báo cáo
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Trang {currentPage} / {totalPages} -{" "}
                      {filteredReports.length} báo cáo được tìm thấy
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-blue-800 bg-blue-100">
                  <Activity className="w-3 h-3 mr-1" />
                  {currentReports.length} kết quả
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <AnimatePresence>
                  {currentReports.length > 0 ? (
                    currentReports.map((report, index) => (
                      <ReportCard
                        key={report.id}
                        report={report}
                        onDelete={handleDeleteReport}
                        index={index}
                      />
                    ))
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="py-16 text-center"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          delay: 0.2,
                          type: "spring",
                          stiffness: 200,
                        }}
                      >
                        <FileText className="w-20 h-20 mx-auto mb-6 text-muted-foreground" />
                      </motion.div>
                      <h3 className="mb-4 text-2xl font-semibold">
                        {searchQuery
                          ? "Không tìm thấy báo cáo"
                          : "Chưa có báo cáo nào"}
                      </h3>
                      <p className="max-w-md mx-auto mb-6 text-muted-foreground">
                        {searchQuery
                          ? "Thử thay đổi từ khóa tìm kiếm hoặc tạo báo cáo mới."
                          : "Tạo báo cáo đầu tiên bằng cách sử dụng các template ở trên"}
                      </p>
                      <div className="space-y-3">
                        {searchQuery && (
                          <Button
                            onClick={() => setSearchQuery("")}
                            variant="outline"
                            className="mr-3"
                          >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Xóa tìm kiếm
                          </Button>
                        )}
                        <div className="flex justify-center mt-4 space-x-2">
                          <Badge variant="outline">
                            💡 Gợi ý: Tạo báo cáo doanh thu
                          </Badge>
                          <Badge variant="outline">
                            📊 Hoặc báo cáo người dùng
                          </Badge>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ✅ Pagination Component */}
              <PaginationComponent />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

interface ReportCardProps {
  report: ReportData;
  onDelete: (reportId: string) => void;
  index: number;
}

const ReportCard: React.FC<ReportCardProps> = ({ report, onDelete, index }) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete(report.id);
    setDeleting(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "processing":
        return "secondary";
      case "failed":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-3 h-3 mr-1" />;
      case "processing":
        return <Clock className="w-3 h-3 mr-1" />;
      case "failed":
        return <AlertTriangle className="w-3 h-3 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.01, y: -2 }}
      className="flex items-center justify-between p-6 transition-all duration-300 border rounded-xl hover:shadow-lg group bg-gradient-to-r from-white to-gray-50 dark:from-slate-800 dark:to-slate-900"
    >
      <div className="flex items-start space-x-4">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="flex items-center justify-center w-12 h-12 transition-all duration-300 shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl group-hover:shadow-xl"
        >
          <FileText className="w-6 h-6 text-white" />
        </motion.div>
        <div className="space-y-2">
          <h4 className="text-lg font-semibold transition-colors group-hover:text-primary">
            {report.title}
          </h4>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {report.description}
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>
                Tạo lúc: {new Date(report.generated_at).toLocaleString("vi-VN")}
              </span>
            </div>
            <span>•</span>
            <span>{report.file_size}</span>
            <span>•</span>
            <Badge variant="outline" className="text-xs">
              {report.format}
            </Badge>
            <span>•</span>
            <Badge variant="outline" className="text-xs">
              {report.data_range}
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <Badge
          variant={getStatusColor(report.status)}
          className="transition-all duration-300 group-hover:scale-105"
        >
          {getStatusIcon(report.status)}
          {report.status === "completed"
            ? "Hoàn thành"
            : report.status === "processing"
              ? "Đang xử lý"
              : "Thất bại"}
        </Badge>

        {report.status === "completed" && (
          <div className="flex items-center space-x-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="sm" variant="outline" className="group/btn">
                <Download className="w-4 h-4 mr-2 transition-transform group-hover/btn:scale-110" />
                Tải xuống
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDelete}
                disabled={deleting}
                className="text-red-600 hover:text-red-700 hover:border-red-300"
              >
                {deleting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-4 h-4 border-2 border-current rounded-full border-t-transparent"
                  />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </Button>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Reports;
