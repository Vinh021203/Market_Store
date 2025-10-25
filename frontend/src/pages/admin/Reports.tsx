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
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { isAdmin } from "@/lib/auth";
import {
  getReports,
  exportToExcel,
  exportToPDF,
  deleteReport,
  ReportData,
} from "@/lib/reports";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  FileText,
  Download,
  Trash2,
  Calendar,
  RefreshCw,
  Activity,
  ArrowLeft,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Search,
  Eye,
  Settings,
  Filter,
  SortAsc,
  SortDesc,
  CheckSquare,
  Square,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  PieChart,
  Users,
  Mail,
  Shield,
  Globe,
  Coffee,
  XCircle,
} from "lucide-react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// 🎨 Toast Component
const FloatingToast = ({
  type = "success",
  title,
  description,
  visible = true,
  onClose,
}: {
  type?: "success" | "error" | "info";
  title: string;
  description?: string;
  visible?: boolean;
  onClose?: () => void;
}) => {
  const iconProps = "w-5 h-5 flex-shrink-0";
  let icon, colorScheme, bgGradient;

  switch (type) {
    case "error":
      icon = <XCircle className={`${iconProps} text-pink-600`} />;
      colorScheme = "text-pink-800";
      bgGradient = "from-pink-50/95 via-orange-50/95 to-white/95";
      break;
    case "info":
      icon = <Activity className={`${iconProps} text-sky-600`} />;
      colorScheme = "text-sky-800";
      bgGradient = "from-sky-50/95 via-blue-50/95 to-white/95";
      break;
    default:
      icon = <CheckCircle className={`${iconProps} text-emerald-600`} />;
      colorScheme = "text-emerald-800";
      bgGradient = "from-emerald-50/95 via-green-50/95 to-white/95";
  }

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, x: 100 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.8, x: 100 }}
      className={`fixed top-6 right-6 z-50 max-w-sm min-w-[300px] p-4 rounded-3xl shadow-2xl backdrop-blur-xl border border-white/30 bg-gradient-to-r ${bgGradient}`}
    >
      <div className="flex items-start gap-3">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
          className="flex-shrink-0 p-2 rounded-2xl bg-white/60"
        >
          {icon}
        </motion.div>
        <div className="flex-1 min-w-0">
          <div className={`font-semibold text-sm ${colorScheme}`}>{title}</div>
          {description && (
            <div className="mt-1 text-xs leading-relaxed text-orange-700/70">
              {description}
            </div>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 transition-colors rounded-full hover:bg-white/60"
          >
            <XCircle className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

// Report Card Component
const ReportCard = ({
  report,
  selected,
  onSelect,
  onDetail,
  onDelete,
  index,
}: {
  report: ReportData;
  selected: boolean;
  onSelect: () => void;
  onDetail: () => void;
  onDelete: () => void;
  index: number;
}) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    await onDelete();
    setDeleting(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case "processing":
        return <Clock className="w-4 h-4 text-amber-500 animate-spin" />;
      case "failed":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "processing":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "failed":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={`relative p-6 rounded-2xl shadow-lg transition-all duration-300 group bg-gradient-to-br from-white/90 to-orange-50/80 backdrop-blur-sm border-2 ${
        selected ? "border-pink-400 shadow-pink-200" : "border-orange-200/50"
      } hover:shadow-xl`}
    >
      <div className="absolute top-4 left-4">
        <Checkbox
          checked={selected}
          onCheckedChange={onSelect}
          className="data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500"
        />
      </div>

      <div className="pl-8">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="flex items-center justify-center w-10 h-10 shadow-lg rounded-xl bg-gradient-to-r from-orange-500 to-pink-600"
              >
                <FileText className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h4
                  className="text-lg font-semibold text-orange-900 transition-colors cursor-pointer hover:text-orange-700"
                  onClick={onDetail}
                >
                  {report.title}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusIcon(report.status)}
                  <Badge className={`text-xs ${getStatusBadge(report.status)}`}>
                    {report.status === "completed"
                      ? "Hoàn thành"
                      : report.status === "processing"
                        ? "Đang xử lý"
                        : "Thất bại"}
                  </Badge>
                </div>
              </div>
            </div>
            <p className="mb-3 text-sm text-orange-700/80">
              {report.description}
            </p>
            <div className="flex flex-wrap gap-3 text-xs text-orange-600">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>
                  {new Date(report.generated_at).toLocaleDateString("vi-VN")}
                </span>
              </div>
              <Badge variant="outline" className="text-xs">
                {report.format}
              </Badge>
              <span className="px-2 py-1 bg-orange-100 rounded-lg">
                {report.file_size}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-orange-200/50">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="sm"
              variant="outline"
              onClick={onDetail}
              className="group/btn hover:bg-orange-50"
            >
              <Eye className="w-4 h-4 mr-2 transition-transform group-hover/btn:scale-110" />
              Chi tiết
            </Button>
          </motion.div>
          {report.status === "completed" && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="sm" variant="outline" className="hover:bg-green-50">
                <Download className="w-4 h-4 mr-2" />
                Tải xuống
              </Button>
            </motion.div>
          )}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="sm"
              variant="outline"
              onClick={handleDelete}
              disabled={deleting}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300"
            >
              {deleting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-current rounded-full border-t-transparent"
                />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

// Quick Templates Grid Component
const QuickTemplatesGrid = ({
  templates,
  onGenerate,
  selectedFormat,
  setSelectedFormat,
  timeRange,
  setTimeRange,
  isGenerating,
}: {
  templates: any[];
  onGenerate: (name: string) => void;
  selectedFormat: string;
  setSelectedFormat: (format: string) => void;
  timeRange: string;
  setTimeRange: (range: string) => void;
  isGenerating: boolean;
}) => (
  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
    {templates.map((template, index) => (
      <motion.div
        key={template.name}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ y: -8, scale: 1.03 }}
        className="transition-all duration-500"
      >
        <Card className="overflow-hidden transition-all duration-300 border-0 cursor-pointer hover:shadow-2xl bg-gradient-to-br from-white/95 via-orange-50/80 to-pink-50/80 backdrop-blur-sm group rounded-3xl">
          <div className="absolute inset-0 opacity-50 bg-gradient-to-br from-white/20 via-transparent to-transparent" />
          <CardContent className="relative pt-6 pb-6">
            <div className="space-y-4 text-center">
              <motion.div
                whileHover={{ scale: 1.15, rotate: 10 }}
                className={`mx-auto w-14 h-14 rounded-2xl bg-gradient-to-r ${template.gradient} flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300`}
              >
                <template.icon className="text-white w-7 h-7" />
              </motion.div>
              <div>
                <h3 className="mb-2 text-lg font-bold text-orange-900 transition-colors group-hover:text-orange-700">
                  {template.name}
                </h3>
                <p className="text-sm leading-relaxed text-orange-700/80">
                  {template.description}
                </p>
              </div>
              <div className="space-y-3">
                <motion.div whileFocus={{ scale: 1.02 }}>
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-full transition-all shadow-md h-11 bg-white/80 border-orange-200/50 rounded-2xl hover:shadow-lg">
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
                    className="w-full transition-all duration-300 shadow-lg h-11 bg-gradient-to-r from-orange-500 via-amber-500 to-pink-600 hover:from-orange-600 hover:via-amber-600 hover:to-pink-700 rounded-2xl hover:shadow-xl"
                    onClick={() => onGenerate(template.name)}
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
                    <span className="font-semibold">Tạo {selectedFormat}</span>
                  </Button>
                </motion.div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    ))}
  </div>
);

// Report Analytics Overview Component
const ReportAnalyticsOverview = ({ reports }: { reports: ReportData[] }) => {
  const formatStats = reports.reduce(
    (acc, report) => {
      acc[report.format] = (acc[report.format] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const statusStats = reports.reduce(
    (acc, report) => {
      acc[report.status] = (acc[report.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const formatData = Object.entries(formatStats).map(([name, value]) => ({
    name,
    value,
    color: name === "PDF" ? "#ef4444" : "#10b981",
  }));

  const statusData = Object.entries(statusStats).map(([name, value]) => ({
    name:
      name === "completed"
        ? "Hoàn thành"
        : name === "processing"
          ? "Đang xử lý"
          : "Thất bại",
    value,
    color:
      name === "completed"
        ? "#10b981"
        : name === "processing"
          ? "#f59e0b"
          : "#ef4444",
  }));

  const totalReports = reports.length;
  const completedReports = reports.filter(
    (r) => r.status === "completed",
  ).length;
  const successRate =
    totalReports > 0 ? (completedReports / totalReports) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-emerald-50 to-green-100 rounded-3xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-700">
                    Tổng báo cáo
                  </p>
                  <p className="text-3xl font-bold text-emerald-900">
                    {totalReports}
                  </p>
                </div>
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl">
                  <FileText className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">
                    Hoàn thành
                  </p>
                  <p className="text-3xl font-bold text-blue-900">
                    {completedReports}
                  </p>
                </div>
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-purple-50 to-pink-100 rounded-3xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">
                    Tỷ lệ thành công
                  </p>
                  <p className="text-3xl font-bold text-purple-900">
                    {successRate.toFixed(1)}%
                  </p>
                </div>
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white/95 to-orange-50/80 rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
                  <PieChart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-transparent bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text">
                  Phân bố định dạng
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <RechartsPieChart>
                  <Pie
                    data={formatData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {formatData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white/95 to-blue-50/80 rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                  Trạng thái báo cáo
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

// Settings Section Component
const SettingsSection = () => {
  const [autoNotify, setAutoNotify] = useState(true);
  const [emailReports, setEmailReports] = useState(false);
  const [retentionDays, setRetentionDays] = useState("30");

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="border-0 shadow-xl bg-gradient-to-br from-white/95 to-orange-50/80 rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-transparent bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text">
                Cài đặt báo cáo
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="font-medium text-orange-900">
                  Thông báo tự động
                </Label>
                <p className="text-sm text-orange-700/70">
                  Nhận thông báo khi báo cáo được tạo xong
                </p>
              </div>
              <Switch checked={autoNotify} onCheckedChange={setAutoNotify} />
            </div>
            <Separator className="bg-orange-200/50" />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="font-medium text-orange-900">
                  Gửi qua email
                </Label>
                <p className="text-sm text-orange-700/70">
                  Tự động gửi báo cáo qua email
                </p>
              </div>
              <Switch
                checked={emailReports}
                onCheckedChange={setEmailReports}
              />
            </div>
            <Separator className="bg-orange-200/50" />
            <div className="space-y-2">
              <Label className="font-medium text-orange-900">
                Thời gian lưu trữ
              </Label>
              <Select value={retentionDays} onValueChange={setRetentionDays}>
                <SelectTrigger className="bg-white/80 border-orange-200/50 rounded-2xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 ngày</SelectItem>
                  <SelectItem value="30">30 ngày</SelectItem>
                  <SelectItem value="90">90 ngày</SelectItem>
                  <SelectItem value="365">1 năm</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-0 shadow-xl bg-gradient-to-br from-white/95 to-blue-50/80 rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                Hướng dẫn & Hỗ trợ
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Button variant="outline" className="justify-start h-12">
                <FileText className="w-4 h-4 mr-2" />
                Tài liệu hướng dẫn
              </Button>
              <Button variant="outline" className="justify-start h-12">
                <Mail className="w-4 h-4 mr-2" />
                Liên hệ hỗ trợ
              </Button>
              <Button variant="outline" className="justify-start h-12">
                <Globe className="w-4 h-4 mr-2" />
                Cộng đồng
              </Button>
              <Button variant="outline" className="justify-start h-12">
                <Shield className="w-4 h-4 mr-2" />
                Bảo mật dữ liệu
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

// Report Detail Modal
const ReportDetailModal = ({
  open,
  report,
  onOpenChange,
}: {
  open: boolean;
  report: ReportData | null;
  onOpenChange: (open: boolean) => void;
}) => {
  if (!report) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto rounded-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span>{report.title}</span>
          </DialogTitle>
          <DialogDescription>{report.description}</DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-500">
                Định dạng
              </Label>
              <p className="text-sm font-semibold">{report.format}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">
                Kích thước
              </Label>
              <p className="text-sm font-semibold">{report.file_size}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">
                Ngày tạo
              </Label>
              <p className="text-sm font-semibold">
                {new Date(report.generated_at).toLocaleString("vi-VN")}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-500">
                Trạng thái
              </Label>
              <Badge
                className={
                  report.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : report.status === "processing"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                }
              >
                {report.status === "completed"
                  ? "Hoàn thành"
                  : report.status === "processing"
                    ? "Đang xử lý"
                    : "Thất bại"}
              </Badge>
            </div>
          </div>

          <Separator />

          <div className="flex flex-col gap-3">
            {report.status === "completed" && (
              <Button className="w-full bg-gradient-to-r from-orange-500 to-pink-600">
                <Download className="w-4 h-4 mr-2" />
                Tải xuống báo cáo
              </Button>
            )}
            <Button variant="outline" className="w-full">
              <Mail className="w-4 h-4 mr-2" />
              Gửi qua email
            </Button>
            <Button
              variant="outline"
              className="w-full text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Xóa báo cáo
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Main Reports Component
const Reports: React.FC = () => {
  // ✅ ALL HOOKS AT TOP LEVEL
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState("30d");
  const [reportType, setReportType] = useState("all");
  const [selectedFormat, setSelectedFormat] = useState("Excel");
  const [reports, setReports] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [toasts, setToasts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("history");
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [modalReport, setModalReport] = useState<ReportData | null>(null);
  const [sortBy, setSortBy] = useState<"date" | "name" | "status">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const PER_PAGE = 8;

  // ✅ GUARD CLAUSE
  if (!user || !isAdmin(user)) {
    return <Navigate to="/" replace />;
  }

  // ✅ TOAST SYSTEM
  const showToast = (
    type: "success" | "error" | "info",
    title: string,
    description?: string,
  ) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // ✅ EFFECTS
  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const data = await getReports(reportType, timeRange);
        setReports(data);
        showToast(
          "success",
          "✅ Đã tải báo cáo",
          `Tải thành công ${data.length} báo cáo.`,
        );
      } catch (error) {
        showToast(
          "error",
          "❌ Lỗi tải báo cáo",
          "Không thể tải danh sách báo cáo",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [timeRange, reportType]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, reportType, timeRange, sortBy, sortOrder]);

  // ✅ EVENT HANDLERS
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await getReports(reportType, timeRange);
      setReports(data);
      showToast(
        "success",
        "🔄 Đã cập nhật",
        "Danh sách báo cáo đã được cập nhật",
      );
    } catch (error) {
      showToast(
        "error",
        "❌ Lỗi cập nhật",
        "Không thể cập nhật danh sách báo cáo",
      );
    } finally {
      setRefreshing(false);
    }
  };

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
        showToast(
          "success",
          "✅ Tạo báo cáo thành công",
          `Báo cáo ${selectedFormat} đã được tải xuống`,
        );
        setReports(await getReports(reportType, timeRange));
      } else {
        throw new Error("Export failed");
      }
    } catch {
      showToast("error", "❌ Lỗi tạo báo cáo", "Có lỗi xảy ra khi tạo báo cáo");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    try {
      if (await deleteReport(reportId)) {
        setReports((prev) => prev.filter((r) => r.id !== reportId));
        showToast(
          "success",
          "🗑️ Đã xóa báo cáo",
          "Báo cáo đã được xóa khỏi hệ thống",
        );
      }
    } catch {
      showToast("error", "❌ Lỗi xóa báo cáo", "Không thể xóa báo cáo");
    }
  };

  const handleBulkDelete = async () => {
    for (const id of selectedReports) {
      await handleDeleteReport(id);
    }
    setSelectedReports([]);
  };

  const handleSelectAll = () => {
    if (
      selectedReports.length ===
      filteredReports.slice((page - 1) * PER_PAGE, page * PER_PAGE).length
    ) {
      setSelectedReports([]);
    } else {
      setSelectedReports(
        filteredReports
          .slice((page - 1) * PER_PAGE, page * PER_PAGE)
          .map((r) => r.id),
      );
    }
  };

  const openReportDetail = (report: ReportData) => {
    setModalReport(report);
    setShowDetailModal(true);
  };

  // ✅ DATA CALCULATIONS
  const filteredReports = reports
    .filter(
      (report) =>
        report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.description.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => {
      let aValue: any, bValue: any;
      switch (sortBy) {
        case "name":
          aValue = a.title;
          bValue = b.title;
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          aValue = new Date(a.generated_at);
          bValue = new Date(b.generated_at);
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const totalPages = Math.max(1, Math.ceil(filteredReports.length / PER_PAGE));
  const pagedReports = filteredReports.slice(
    (page - 1) * PER_PAGE,
    page * PER_PAGE,
  );

  const quickTemplates = [
    {
      name: "Báo cáo doanh thu",
      description: "Tổng quan về doanh thu, lợi nhuận và xu hướng tăng trưởng",
      icon: BarChart3,
      gradient: "from-green-500 to-emerald-500",
    },
    {
      name: "Báo cáo đơn hàng",
      description: "Phân tích đơn hàng, conversion rate và AOV chi tiết",
      icon: FileText,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      name: "Báo cáo người dùng",
      description: "Thống kê người dùng, retention và engagement rate",
      icon: Users,
      gradient: "from-purple-500 to-violet-500",
    },
    {
      name: "Báo cáo sản phẩm",
      description: "Hiệu suất sản phẩm và phân tích danh mục chi tiết",
      icon: Coffee,
      gradient: "from-orange-500 to-red-500",
    },
  ];

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-pink-50">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-1/4"
            animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <BarChart3 className="w-8 h-8 text-orange-400 opacity-20" />
          </motion.div>
          <motion.div
            className="absolute top-1/3 right-1/4"
            animate={{ y: [0, -15, 0], rotate: [0, -10, 0] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          >
            <FileText className="w-6 h-6 text-pink-400 opacity-20" />
          </motion.div>
        </div>

        <div className="container relative z-10 px-4 py-8 mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center min-h-screen"
          >
            <Card className="py-12 text-center border-0 shadow-2xl bg-gradient-to-br from-white/95 to-orange-50/80 backdrop-blur-xl rounded-3xl">
              <CardContent>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 mx-auto mb-4 border-4 border-orange-500 rounded-full border-t-transparent"
                />
                <h2 className="mb-2 text-xl font-semibold text-orange-800">
                  Đang tải báo cáo...
                </h2>
                <p className="text-orange-600/80">
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-pink-50">
      {/* 🌟 Floating Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4"
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <BarChart3 className="w-8 h-8 text-orange-400 opacity-20" />
        </motion.div>
        <motion.div
          className="absolute top-1/3 right-1/4"
          animate={{ y: [0, -15, 0], rotate: [0, -10, 0] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          <FileText className="w-6 h-6 text-pink-400 opacity-20" />
        </motion.div>
        <motion.div
          className="absolute bottom-1/4 left-1/3"
          animate={{ y: [0, -25, 0], rotate: [0, 15, 0] }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        >
          <Coffee className="text-amber-400 w-7 h-7 opacity-20" />
        </motion.div>
      </div>

      {/* Toast Container */}
      <div className="fixed top-0 right-0 z-50 p-4 space-y-3">
        <AnimatePresence>
          {toasts.map((toast) => (
            <FloatingToast
              key={toast.id}
              type={toast.type}
              title={toast.title}
              description={toast.description}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      <div className="container relative z-10 px-4 py-8 mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-6 mb-8 border shadow-lg bg-gradient-to-r from-white/90 via-orange-50/90 to-pink-50/90 backdrop-blur-xl border-orange-200/50 rounded-3xl"
        >
          <div className="flex items-center space-x-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="shadow-md group bg-white/60 hover:bg-white/80 rounded-2xl"
              >
                <Link to="/admin">
                  <ArrowLeft className="w-4 h-4 mr-1 text-orange-600 transition-transform group-hover:-translate-x-1" />
                  <span className="font-semibold text-orange-800">
                    Về Dashboard
                  </span>
                </Link>
              </Button>
            </motion.div>
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="flex items-center justify-center w-16 h-16 shadow-xl rounded-3xl bg-gradient-to-r from-orange-500 via-amber-500 to-pink-600"
              >
                <BarChart3 className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-orange-600 via-amber-600 to-pink-600 bg-clip-text">
                  Báo cáo & Xuất dữ liệu
                </h1>
                <p className="flex items-center mt-1 space-x-2 text-orange-700/80">
                  <Sparkles className="w-4 h-4" />
                  <span>
                    Tổng hợp, tạo và quản lý các báo cáo kinh doanh chuyên
                    nghiệp
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <motion.div whileFocus={{ scale: 1.01 }}>
              <Select
                value={selectedFormat}
                onValueChange={(val) => setSelectedFormat(val)}
              >
                <SelectTrigger className="w-32 h-12 shadow-md bg-white/80 border-orange-200/50 rounded-2xl">
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
                className="transition-all duration-300 shadow-md group bg-white/80 hover:bg-white border-orange-200/50 hover:border-orange-300 rounded-2xl hover:shadow-lg"
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
                  <RefreshCw className="w-4 h-4 mr-2 text-orange-600 group-hover:animate-spin" />
                )}
                <span className="font-semibold text-orange-800">Làm mới</span>
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* ✨ Enhanced Tabs Navigation - THIẾT KẾ MỚI */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4 mb-8 p-1.5 bg-gradient-to-r from-orange-100/60 via-amber-100/60 to-pink-100/60 backdrop-blur-xl border border-orange-200/40 rounded-[32px] shadow-lg">
              <TabsTrigger
                value="history"
                className="relative flex items-center justify-center py-3.5 px-6 font-semibold text-sm bg-transparent rounded-[26px] transition-all duration-300 text-orange-700/80 hover:text-orange-900 data-[state=active]:text-white outline-none data-[state=active]:shadow-xl overflow-hidden"
              >
                {activeTab === "history" && (
                  <motion.div
                    layoutId="report-tab-bg"
                    className="absolute inset-0 rounded-[26px] bg-gradient-to-r from-orange-500 via-amber-500 to-pink-600 shadow-lg"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 40,
                      mass: 0.8,
                    }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2.5">
                  <motion.div
                    animate={{
                      scale: activeTab === "history" ? 1.1 : 1,
                      rotate: activeTab === "history" ? [0, -5, 5, 0] : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <FileText className="w-5 h-5" />
                  </motion.div>
                  <span className="font-bold tracking-wide">
                    Lịch sử báo cáo
                  </span>
                </span>
              </TabsTrigger>

              <TabsTrigger
                value="generate"
                className="relative flex items-center justify-center py-3.5 px-6 font-semibold text-sm bg-transparent rounded-[26px] transition-all duration-300 text-orange-700/80 hover:text-orange-900 data-[state=active]:text-white outline-none data-[state=active]:shadow-xl overflow-hidden"
              >
                {activeTab === "generate" && (
                  <motion.div
                    layoutId="report-tab-bg"
                    className="absolute inset-0 rounded-[26px] bg-gradient-to-r from-orange-500 via-amber-500 to-pink-600 shadow-lg"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 40,
                      mass: 0.8,
                    }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2.5">
                  <motion.div
                    animate={{
                      scale: activeTab === "generate" ? 1.1 : 1,
                      rotate: activeTab === "generate" ? [0, -5, 5, 0] : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <Download className="w-5 h-5" />
                  </motion.div>
                  <span className="font-bold tracking-wide">Tạo báo cáo</span>
                </span>
              </TabsTrigger>

              <TabsTrigger
                value="analytics"
                className="relative flex items-center justify-center py-3.5 px-6 font-semibold text-sm bg-transparent rounded-[26px] transition-all duration-300 text-orange-700/80 hover:text-orange-900 data-[state=active]:text-white outline-none data-[state=active]:shadow-xl overflow-hidden"
              >
                {activeTab === "analytics" && (
                  <motion.div
                    layoutId="report-tab-bg"
                    className="absolute inset-0 rounded-[26px] bg-gradient-to-r from-orange-500 via-amber-500 to-pink-600 shadow-lg"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 40,
                      mass: 0.8,
                    }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2.5">
                  <motion.div
                    animate={{
                      scale: activeTab === "analytics" ? 1.1 : 1,
                      rotate: activeTab === "analytics" ? [0, -5, 5, 0] : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <BarChart3 className="w-5 h-5" />
                  </motion.div>
                  <span className="font-bold tracking-wide">Phân tích</span>
                </span>
              </TabsTrigger>

              <TabsTrigger
                value="settings"
                className="relative flex items-center justify-center py-3.5 px-6 font-semibold text-sm bg-transparent rounded-[26px] transition-all duration-300 text-orange-700/80 hover:text-orange-900 data-[state=active]:text-white outline-none data-[state=active]:shadow-xl overflow-hidden"
              >
                {activeTab === "settings" && (
                  <motion.div
                    layoutId="report-tab-bg"
                    className="absolute inset-0 rounded-[26px] bg-gradient-to-r from-orange-500 via-amber-500 to-pink-600 shadow-lg"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 40,
                      mass: 0.8,
                    }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2.5">
                  <motion.div
                    animate={{
                      scale: activeTab === "settings" ? 1.1 : 1,
                      rotate: activeTab === "settings" ? [0, -5, 5, 0] : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <Settings className="w-5 h-5" />
                  </motion.div>
                  <span className="font-bold tracking-wide">Cài đặt</span>
                </span>
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              {/* History Tab */}
              <TabsContent value="history" className="space-y-6">
                <motion.div
                  key="history-tab"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Filter and Search */}
                  <Card className="border-0 shadow-lg bg-gradient-to-r from-white/95 to-orange-50/80 rounded-3xl">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500">
                          <Filter className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-xl text-transparent bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text">
                            Lọc và tìm kiếm báo cáo
                          </CardTitle>
                          <p className="text-sm text-orange-700/80">
                            Tìm kiếm, lọc và sắp xếp báo cáo theo tiêu chí
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <motion.div
                          className="relative"
                          whileFocus={{ scale: 1.01 }}
                        >
                          <Search className="absolute w-4 h-4 text-orange-600 transform -translate-y-1/2 left-3 top-1/2" />
                          <Input
                            placeholder="Tìm kiếm báo cáo..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-12 pl-10 shadow-md bg-white/80 border-orange-200/50 rounded-2xl focus:ring-2 focus:ring-orange-200"
                          />
                        </motion.div>
                        <Select
                          value={reportType}
                          onValueChange={setReportType}
                        >
                          <SelectTrigger className="h-12 shadow-md bg-white/80 border-orange-200/50 rounded-2xl">
                            <SelectValue placeholder="Loại báo cáo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Tất cả loại</SelectItem>
                            <SelectItem value="sales">Doanh số</SelectItem>
                            <SelectItem value="users">Người dùng</SelectItem>
                            <SelectItem value="products">Sản phẩm</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select
                          value={sortBy}
                          onValueChange={(v: string) =>
                            setSortBy(v as "name" | "date" | "status")
                          }
                        >
                          <SelectTrigger className="h-12 shadow-md bg-white/80 border-orange-200/50 rounded-2xl">
                            <SelectValue placeholder="Sắp xếp theo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="date">Ngày tạo</SelectItem>
                            <SelectItem value="name">Tên báo cáo</SelectItem>
                            <SelectItem value="status">Trạng thái</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="outline"
                          onClick={() =>
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                          }
                          className="h-12 shadow-md bg-white/80 border-orange-200/50 rounded-2xl hover:bg-white"
                        >
                          {sortOrder === "asc" ? (
                            <SortAsc className="w-4 h-4 mr-2" />
                          ) : (
                            <SortDesc className="w-4 h-4 mr-2" />
                          )}
                          {sortOrder === "asc" ? "Tăng dần" : "Giảm dần"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Bulk Actions */}
                  <Card className="border-0 shadow-lg bg-gradient-to-r from-white/95 to-orange-50/80 rounded-3xl">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleSelectAll}
                            className="hover:bg-orange-50"
                          >
                            {selectedReports.length === pagedReports.length ? (
                              <CheckSquare className="w-4 h-4 mr-2" />
                            ) : (
                              <Square className="w-4 h-4 mr-2" />
                            )}
                            Chọn tất cả
                          </Button>
                          {selectedReports.length > 0 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleBulkDelete}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Xóa đã chọn ({selectedReports.length})
                            </Button>
                          )}
                        </div>
                        <Badge
                          variant="outline"
                          className="text-orange-800 bg-orange-100"
                        >
                          <Activity className="w-3 h-3 mr-1" />
                          {filteredReports.length} báo cáo
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Reports Grid */}
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <AnimatePresence>
                      {pagedReports.length > 0 ? (
                        pagedReports.map((report, index) => (
                          <ReportCard
                            key={report.id}
                            report={report}
                            selected={selectedReports.includes(report.id)}
                            onSelect={() =>
                              setSelectedReports((prev) =>
                                prev.includes(report.id)
                                  ? prev.filter((id) => id !== report.id)
                                  : [...prev, report.id],
                              )
                            }
                            onDetail={() => openReportDetail(report)}
                            onDelete={() => handleDeleteReport(report.id)}
                            index={index}
                          />
                        ))
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="py-16 text-center col-span-full"
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
                            <FileText className="w-20 h-20 mx-auto mb-6 text-orange-400 opacity-50" />
                          </motion.div>
                          <h3 className="mb-4 text-2xl font-semibold text-orange-800">
                            {searchQuery
                              ? "Không tìm thấy báo cáo"
                              : "Chưa có báo cáo nào"}
                          </h3>
                          <p className="max-w-md mx-auto mb-6 text-orange-700/70">
                            {searchQuery
                              ? "Thử thay đổi từ khóa tìm kiếm hoặc tạo báo cáo mới."
                              : "Tạo báo cáo đầu tiên bằng cách chuyển sang tab 'Tạo báo cáo'"}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                      <Button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        variant="outline"
                        className="shadow-md bg-white/80 hover:bg-white border-orange-200/50 hover:border-orange-300 rounded-2xl"
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        <span className="font-semibold text-orange-800">
                          Trước
                        </span>
                      </Button>
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (page <= 3) {
                            pageNum = i + 1;
                          } else if (page >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = page - 2 + i;
                          }
                          return (
                            <Button
                              key={pageNum}
                              onClick={() => setPage(pageNum)}
                              variant={page === pageNum ? "default" : "outline"}
                              className={`w-10 h-10 rounded-2xl transition-all ${
                                page === pageNum
                                  ? "bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-lg"
                                  : "bg-white/80 hover:bg-white border-orange-200/50 hover:border-orange-300 text-orange-700 hover:text-orange-900"
                              }`}
                            >
                              {pageNum}
                            </Button>
                          );
                        },
                      )}
                      <Button
                        onClick={() =>
                          setPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={page === totalPages}
                        variant="outline"
                        className="shadow-md bg-white/80 hover:bg-white border-orange-200/50 hover:border-orange-300 rounded-2xl"
                      >
                        <span className="font-semibold text-orange-800">
                          Sau
                        </span>
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  )}
                </motion.div>
              </TabsContent>

              {/* Generate Tab */}
              <TabsContent value="generate" className="space-y-6">
                <motion.div
                  key="generate-tab"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="mb-8 border-0 shadow-xl bg-gradient-to-br from-white/95 to-orange-50/80 rounded-3xl">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-12 h-12 shadow-lg rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500">
                          <Download className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl font-bold text-transparent bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text">
                            Tạo báo cáo nhanh
                          </CardTitle>
                          <p className="mt-1 text-sm text-orange-700/80">
                            Chọn template và tạo báo cáo chuyên nghiệp trong vài
                            giây
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <QuickTemplatesGrid
                        templates={quickTemplates}
                        onGenerate={handleGenerateReport}
                        selectedFormat={selectedFormat}
                        setSelectedFormat={setSelectedFormat}
                        timeRange={timeRange}
                        setTimeRange={setTimeRange}
                        isGenerating={isGenerating}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-6">
                <motion.div
                  key="analytics-tab"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ReportAnalyticsOverview reports={reports} />
                </motion.div>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-6">
                <motion.div
                  key="settings-tab"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <SettingsSection />
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </motion.div>

        {/* Report Detail Modal */}
        <ReportDetailModal
          open={showDetailModal}
          report={modalReport}
          onOpenChange={setShowDetailModal}
        />
      </div>
    </div>
  );
};

export default Reports;
