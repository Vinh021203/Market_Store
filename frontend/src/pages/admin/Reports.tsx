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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { isAdmin } from "@/lib/auth";
import { motion } from "framer-motion";
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

  if (!user || !isAdmin(user)) {
    return <Navigate to="/" replace />;
  }

  // Fetch reports từ database
  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const data = await getReports(reportType, timeRange);
        setReports(data);
      } catch (error) {
        console.error("Error fetching reports:", error);
        toast({
          title: "Lỗi tải báo cáo",
          description: "Không thể tải danh sách báo cáo",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [reportType, timeRange]);

  const reportTemplates = [
    {
      name: "Báo cáo doanh thu",
      description: "Tổng quan về doanh thu, lợi nhuận và xu hướng",
      icon: DollarSign,
      color: "text-green-600",
      type: "sales",
    },
    {
      name: "Báo cáo đơn hàng",
      description: "Phân tích đơn hàng, conversion rate và AOV",
      icon: ShoppingCart,
      color: "text-blue-600",
      type: "sales",
    },
    {
      name: "Báo cáo người dùng",
      description: "Thống kê người dùng, retention và engagement",
      icon: Users,
      color: "text-purple-600",
      type: "users",
    },
    {
      name: "Báo cáo sản phẩm",
      description: "Hiệu suất sản phẩm và phân tích danh mục",
      icon: Package,
      color: "text-orange-600",
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
          title: "Tạo báo cáo thành công",
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
        title: "Lỗi tạo báo cáo",
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
        title: "Đã cập nhật",
        description: "Danh sách báo cáo đã được cập nhật",
      });
    } catch (error) {
      toast({
        title: "Lỗi cập nhật",
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
          title: "Đã xóa báo cáo",
          description: "Báo cáo đã được xóa khỏi hệ thống",
        });
      }
    } catch (error) {
      toast({
        title: "Lỗi xóa báo cáo",
        description: "Không thể xóa báo cáo",
        variant: "destructive",
      });
    }
  };

  // Filter reports by type
  const filteredReports = reports.filter((report) => {
    if (reportType === "all") return true;
    return report.type === reportType;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Báo cáo & Xuất dữ liệu
          </h1>
          <p className="text-muted-foreground mt-1">
            Tạo và quản lý các báo cáo kinh doanh
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <Select
            value={selectedFormat}
            onValueChange={(value: "PDF" | "Excel") => setSelectedFormat(value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Excel">Excel</SelectItem>
              <SelectItem value="PDF">PDF</SelectItem>
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
        </div>
      </div>

      {/* Quick Generate Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportTemplates.map((template, index) => (
          <motion.div
            key={template.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div
                    className={`mx-auto w-12 h-12 rounded-lg bg-muted flex items-center justify-center group-hover:scale-110 transition-transform ${template.color}`}
                  >
                    <template.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{template.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {template.description}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Select value={timeRange} onValueChange={setTimeRange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7d">7 ngày qua</SelectItem>
                        <SelectItem value="30d">30 ngày qua</SelectItem>
                        <SelectItem value="90d">3 tháng qua</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => handleGenerateReport(template.name)}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4 mr-2" />
                      )}
                      Tạo {selectedFormat}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Reports History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Lịch sử báo cáo ({filteredReports.length})</CardTitle>
            <div className="flex items-center space-x-4">
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="sales">Doanh số</SelectItem>
                  <SelectItem value="users">Người dùng</SelectItem>
                  <SelectItem value="products">Sản phẩm</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="ml-2">Đang tải báo cáo...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <ReportCard
                    key={report.id}
                    report={report}
                    onDelete={handleDeleteReport}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">
                    Chưa có báo cáo nào
                  </h3>
                  <p>
                    Tạo báo cáo đầu tiên bằng cách sử dụng các template ở trên
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

interface ReportCardProps {
  report: ReportData;
  onDelete: (reportId: string) => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ report, onDelete }) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete(report.id);
    setDeleting(false);
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <FileText className="w-5 h-5 text-primary" />
        </div>
        <div className="space-y-1">
          <h4 className="font-medium">{report.title}</h4>
          <p className="text-sm text-muted-foreground">{report.description}</p>
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <span>
              Tạo lúc: {new Date(report.generated_at).toLocaleString("vi-VN")}
            </span>
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

      <div className="flex items-center space-x-2">
        <Badge
          variant={
            report.status === "completed"
              ? "default"
              : report.status === "processing"
                ? "secondary"
                : "destructive"
          }
        >
          {report.status === "completed"
            ? "Hoàn thành"
            : report.status === "processing"
              ? "Đang xử lý"
              : "Thất bại"}
        </Badge>

        {report.status === "completed" && (
          <>
            <Button size="sm" variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Tải xuống
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Reports;
