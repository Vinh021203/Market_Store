import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  FileText,
  Logs,
  Server,
  Database,
  User,
  Globe,
  Download,
  Upload,
  RefreshCw,
  Search,
  Filter,
  Plus,
  Save,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Sparkles,
  Heart,
  Gift,
  Calendar,
  Clock,
  TrendingUp,
  BarChart3,
  Trash2,
  Eye,
  Settings,
  Shield,
  Zap,
  Target,
  Award,
  Monitor,
  Cpu,
  HardDrive,
  Wifi,
  Terminal,
  Code,
} from "lucide-react";

// **🎨 Enhanced Toast Component giống các trang trước**
const FloatingToast = ({
  type = "success",
  title,
  description,
  visible = true,
  onClose,
}: {
  type?: "success" | "error" | "info" | "warning";
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
      icon = <Info className={`${iconProps} text-sky-600`} />;
      colorScheme = "text-sky-800";
      bgGradient = "from-sky-50/95 via-blue-50/95 to-white/95";
      break;
    case "warning":
      icon = <AlertTriangle className={`${iconProps} text-amber-600`} />;
      colorScheme = "text-amber-800";
      bgGradient = "from-amber-50/95 via-yellow-50/95 to-white/95";
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
            <div className="text-xs mt-1 text-orange-700/70 leading-relaxed">
              {description}
            </div>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 rounded-full hover:bg-white/60 transition-colors"
          >
            <XCircle className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

interface LogEntry {
  id: string;
  timestamp: string;
  level: "error" | "warning" | "info" | "debug" | "success";
  category: string;
  message: string;
  source: string;
  userId?: string;
  userEmail?: string;
  ip?: string;
  userAgent?: string;
  details?: any;
  stackTrace?: string;
}

const SystemLogsManagement: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [toasts, setToasts] = useState<
    Array<{
      id: string;
      type: "success" | "error" | "info" | "warning";
      title: string;
      description?: string;
    }>
  >([]);

  // New log form
  const [newLog, setNewLog] = useState({
    level: "info" as const,
    category: "SYSTEM",
    message: "",
    source: "Admin Panel",
    details: "",
  });

  // **🎯 Enhanced Toast System**
  const showToast = (
    type: "success" | "error" | "info" | "warning",
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

  // Load logs from localStorage
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const saved = localStorage.getItem("system-logs");
        if (saved) {
          setLogs(JSON.parse(saved));
        } else {
          // Sample logs
          const sampleLogs: LogEntry[] = [
            {
              id: "1",
              timestamp: new Date().toISOString(),
              level: "info",
              category: "AUTH",
              message: "User login successful",
              source: "Authentication Service",
              userId: "user_123",
              userEmail: "admin@example.com",
              ip: "192.168.1.1",
              userAgent:
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            },
            {
              id: "2",
              timestamp: new Date(Date.now() - 60000).toISOString(),
              level: "error",
              category: "DATABASE",
              message: "Connection timeout occurred",
              source: "Database Service",
              details: {
                error: "TIMEOUT",
                duration: "30s",
                query: "SELECT * FROM users",
              },
              stackTrace:
                "Error: Connection timeout\n    at Database.connect (/app/db.js:123:45)",
            },
            {
              id: "3",
              timestamp: new Date(Date.now() - 120000).toISOString(),
              level: "warning",
              category: "PAYMENT",
              message: "Payment verification pending for order #12345",
              source: "Payment Gateway",
              details: { orderId: "12345", amount: 2500000, gateway: "VietQR" },
            },
            {
              id: "4",
              timestamp: new Date(Date.now() - 180000).toISOString(),
              level: "success",
              category: "EMAIL",
              message: "Email marketing campaign sent successfully",
              source: "Email Service",
              details: {
                campaignId: "camp_456",
                recipients: 1250,
                sent: 1248,
                failed: 2,
              },
            },
            {
              id: "5",
              timestamp: new Date(Date.now() - 240000).toISOString(),
              level: "debug",
              category: "API",
              message: "API request processed",
              source: "API Gateway",
              ip: "10.0.0.5",
              details: {
                endpoint: "/api/products",
                method: "GET",
                responseTime: "245ms",
              },
            },
          ];
          setLogs(sampleLogs);
          localStorage.setItem("system-logs", JSON.stringify(sampleLogs));
        }

        showToast(
          "success",
          "✅ Đã tải nhật ký",
          `Tải thành công nhật ký hệ thống.`,
        );
      } catch {
        showToast(
          "error",
          "❌ Lỗi tải dữ liệu",
          "Không thể tải nhật ký hệ thống.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Save to localStorage
  const saveLogs = (newLogs: LogEntry[]) => {
    setLogs(newLogs);
    localStorage.setItem("system-logs", JSON.stringify(newLogs));
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const saved = localStorage.getItem("system-logs");
      if (saved) {
        setLogs(JSON.parse(saved));
      }
      showToast(
        "success",
        "🔄 Đã cập nhật",
        "Nhật ký hệ thống đã được làm mới.",
      );
    } catch {
      showToast("error", "❌ Lỗi cập nhật", "Không thể cập nhật dữ liệu.");
    }
    setRefreshing(false);
  };

  // Create new log entry
  const handleCreateLog = () => {
    if (!newLog.message) {
      showToast("error", "❌ Thiếu thông tin", "Vui lòng điền nội dung log");
      return;
    }

    const logEntry: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      level: newLog.level,
      category: newLog.category,
      message: newLog.message,
      source: newLog.source,
      details: newLog.details ? JSON.parse(newLog.details) : undefined,
    };

    saveLogs([logEntry, ...logs]);
    setNewLog({
      level: "info",
      category: "SYSTEM",
      message: "",
      source: "Admin Panel",
      details: "",
    });
    showToast("success", "✅ Đã tạo log", "Nhật ký mới đã được tạo");
  };

  // Delete log
  const handleDeleteLog = (id: string) => {
    const updated = logs.filter((l) => l.id !== id);
    saveLogs(updated);
    showToast("success", "🗑️ Đã xóa log", "Nhật ký đã được xóa");
  };

  // Clear all logs
  const handleClearLogs = () => {
    saveLogs([]);
    showToast("success", "🧹 Đã xóa tất cả", "Tất cả nhật ký đã được xóa");
  };

  // Export data
  const handleExportData = () => {
    const data = {
      logs,
      exportedAt: new Date().toISOString(),
      totalEntries: logs.length,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `system-logs-${new Date().toISOString().split("T")[0]}.json`;
    link.click();

    showToast(
      "success",
      "📤 Đã xuất dữ liệu",
      "File nhật ký đã được tải xuống",
    );
  };

  // Import data
  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.logs) {
          saveLogs(data.logs);
          showToast(
            "success",
            "📥 Đã nhập dữ liệu",
            "Dữ liệu nhật ký đã được nhập thành công",
          );
        }
      } catch (error) {
        showToast("error", "❌ Lỗi nhập file", "File không hợp lệ");
      }
    };
    reader.readAsText(file);
  };

  // Stats
  const stats = {
    total: logs.length,
    errors: logs.filter((l) => l.level === "error").length,
    warnings: logs.filter((l) => l.level === "warning").length,
    info: logs.filter((l) => l.level === "info").length,
    success: logs.filter((l) => l.level === "success").length,
    today: logs.filter(
      (l) => new Date(l.timestamp).toDateString() === new Date().toDateString(),
    ).length,
  };

  const statsCards = [
    {
      title: "Tổng nhật ký",
      value: stats.total,
      icon: Logs,
      gradient: "from-orange-400 via-amber-500 to-pink-600",
      bgGradient: "from-orange-50/80 via-amber-50/80 to-pink-50/80",
      description: "Tất cả entries",
      trend: "+15%",
    },
    {
      title: "Lỗi",
      value: stats.errors,
      icon: XCircle,
      gradient: "from-red-400 via-pink-500 to-rose-600",
      bgGradient: "from-red-50/80 via-pink-50/80 to-rose-50/80",
      description: "Cần xử lý",
      trend: stats.errors > 0 ? "!" : "✓",
    },
    {
      title: "Cảnh báo",
      value: stats.warnings,
      icon: AlertTriangle,
      gradient: "from-yellow-400 via-orange-400 to-amber-600",
      bgGradient: "from-yellow-50/80 via-orange-50/80 to-amber-50/80",
      description: "Cần chú ý",
      trend: "+3%",
    },
    {
      title: "Thông tin",
      value: stats.info,
      icon: Info,
      gradient: "from-blue-400 via-indigo-500 to-purple-600",
      bgGradient: "from-blue-50/80 via-indigo-50/80 to-purple-50/80",
      description: "Hoạt động",
      trend: "+8%",
    },
    {
      title: "Thành công",
      value: stats.success,
      icon: CheckCircle,
      gradient: "from-green-400 via-emerald-500 to-teal-600",
      bgGradient: "from-green-50/80 via-emerald-50/80 to-teal-50/80",
      description: "Hoàn tất",
      trend: "+12%",
    },
    {
      title: "Hôm nay",
      value: stats.today,
      icon: Calendar,
      gradient: "from-indigo-500 via-purple-500 to-pink-500",
      bgGradient: "from-indigo-50/80 via-purple-50/80 to-pink-50/80",
      description: "Mới nhất",
      trend: "+5%",
    },
  ];

  // Filter logic
  const filteredLogs = logs.filter((log) => {
    const matchSearch =
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userEmail?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchLevel = levelFilter === "all" || log.level === levelFilter;
    const matchCategory =
      categoryFilter === "all" || log.category === categoryFilter;
    const matchSource = sourceFilter === "all" || log.source === sourceFilter;

    return matchSearch && matchLevel && matchCategory && matchSource;
  });

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "error":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "debug":
        return <Code className="w-4 h-4 text-purple-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "error":
        return "bg-red-50 text-red-700 border-red-200";
      case "warning":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "success":
        return "bg-green-50 text-green-700 border-green-200";
      case "debug":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-blue-50 text-blue-700 border-blue-200";
    }
  };

  const categories = [
    "all",
    ...Array.from(new Set(logs.map((log) => log.category))),
  ];
  const sources = [
    "all",
    ...Array.from(new Set(logs.map((log) => log.source))),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-pink-50">
      {/* 🌟 Floating Elements giống các trang trước */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4"
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Activity className="w-8 h-8 text-orange-400 opacity-20" />
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
          <Server className="w-6 h-6 text-pink-400 opacity-20" />
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
          <Monitor className="text-amber-400 w-7 h-7 opacity-20" />
        </motion.div>
      </div>

      {/* Toast notification */}
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
        {/* Header giống các trang trước */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8 p-6 bg-gradient-to-r from-white/90 via-orange-50/90 to-pink-50/90 backdrop-blur-xl border border-orange-200/50 rounded-3xl shadow-lg"
        >
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="flex items-center justify-center w-16 h-16 shadow-xl rounded-3xl bg-gradient-to-r from-orange-500 via-amber-500 to-pink-600"
              >
                <Activity className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-orange-600 via-amber-600 to-pink-600 bg-clip-text">
                  Nhật ký hệ thống
                </h1>
                <p className="text-orange-700/80 mt-1 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Theo dõi và phân tích hoạt động hệ thống</span>
                </p>
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={refreshing}
                className="transition-all duration-300 group bg-white/80 hover:bg-white border-orange-200/50 hover:border-orange-300 rounded-2xl shadow-md hover:shadow-lg"
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
                  <RefreshCw className="w-4 h-4 mr-2 group-hover:animate-spin text-orange-600" />
                )}
                <span className="text-orange-800 font-semibold">Làm mới</span>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                onClick={handleClearLogs}
                className="bg-white/80 border-orange-200/50 hover:border-orange-300 rounded-2xl shadow-md"
              >
                <Trash2 className="w-4 h-4 mr-2 text-orange-600" />
                <span className="font-semibold">Xóa tất cả</span>
              </Button>
            </motion.div>
            <input
              type="file"
              accept=".json"
              onChange={handleImportData}
              className="hidden"
              id="import-data"
            />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                onClick={() => document.getElementById("import-data")?.click()}
                className="bg-white/80 border-orange-200/50 hover:border-orange-300 rounded-2xl shadow-md"
              >
                <Upload className="w-4 h-4 mr-2 text-orange-600" />
                <span className="font-semibold">Nhập</span>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                onClick={handleExportData}
                className="bg-white/80 border-orange-200/50 hover:border-orange-300 rounded-2xl shadow-md"
              >
                <Download className="w-4 h-4 mr-2 text-orange-600" />
                <span className="font-semibold">Xuất</span>
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Cards chia 2 hàng giống các trang trước */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-4 mb-4 md:grid-cols-3"
        >
          {statsCards.slice(0, 3).map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -8, scale: 1.03 }}
              className="transition-all duration-500"
            >
              <Card
                className={`relative overflow-hidden border-0 bg-gradient-to-br ${stat.bgGradient} backdrop-blur-sm shadow-lg hover:shadow-2xl group rounded-3xl`}
                style={{ minHeight: 140 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50" />
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="text-2xl font-bold text-orange-900 mb-1"
                      >
                        {stat.value}
                      </motion.div>
                      <div className="text-xs font-semibold text-orange-800/90 mb-1">
                        {stat.title}
                      </div>
                      <div className="text-xs text-orange-700/70">
                        {stat.description}
                      </div>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.15, rotate: 10 }}
                      className={`w-10 h-10 rounded-2xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl flex-shrink-0`}
                    >
                      <stat.icon className="w-5 h-5 text-white" />
                    </motion.div>
                  </div>
                  <div
                    className={`flex items-center text-xs ${stat.trend.startsWith("+") || stat.trend === "✓" ? "text-emerald-600" : "text-red-600"}`}
                  >
                    <div
                      className={`p-1 rounded-full mr-1 ${stat.trend.startsWith("+") || stat.trend === "✓" ? "bg-emerald-100" : "bg-red-100"}`}
                    >
                      <TrendingUp
                        className={`w-2 h-2 ${!stat.trend.startsWith("+") && stat.trend !== "✓" ? "rotate-180" : ""}`}
                      />
                    </div>
                    <span className="font-semibold">{stat.trend}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className="grid grid-cols-2 gap-4 mb-8 md:grid-cols-3"
        >
          {statsCards.slice(3).map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + index * 0.1 }}
              whileHover={{ y: -8, scale: 1.03 }}
              className="transition-all duration-500"
            >
              <Card
                className={`relative overflow-hidden border-0 bg-gradient-to-br ${stat.bgGradient} backdrop-blur-sm shadow-lg hover:shadow-2xl group rounded-3xl`}
                style={{ minHeight: 140 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50" />
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.45 + index * 0.1 }}
                        className="text-2xl font-bold text-orange-900 mb-1"
                      >
                        {stat.value}
                      </motion.div>
                      <div className="text-xs font-semibold text-orange-800/90 mb-1">
                        {stat.title}
                      </div>
                      <div className="text-xs text-orange-700/70">
                        {stat.description}
                      </div>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.15, rotate: 10 }}
                      className={`w-10 h-10 rounded-2xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl flex-shrink-0`}
                    >
                      <stat.icon className="w-5 h-5 text-white" />
                    </motion.div>
                  </div>
                  <div
                    className={`flex items-center text-xs ${stat.trend.startsWith("+") || stat.trend === "✓" ? "text-emerald-600" : "text-red-600"}`}
                  >
                    <div
                      className={`p-1 rounded-full mr-1 ${stat.trend.startsWith("+") || stat.trend === "✓" ? "bg-emerald-100" : "bg-red-100"}`}
                    >
                      <TrendingUp
                        className={`w-2 h-2 ${!stat.trend.startsWith("+") && stat.trend !== "✓" ? "rotate-180" : ""}`}
                      />
                    </div>
                    <span className="font-semibold">{stat.trend}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Filters giống các trang trước */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <Card className="border-0 shadow-xl bg-gradient-to-r from-white/95 via-orange-50/80 to-pink-50/80 backdrop-blur-xl rounded-3xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-600 shadow-lg">
                    <Filter className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-transparent bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text font-bold">
                      Bộ lọc và tìm kiếm
                    </CardTitle>
                    <p className="text-sm text-orange-700/80 mt-1">
                      Tìm kiếm & lọc nhật ký theo nhiều tiêu chí
                    </p>
                  </div>
                </div>
                <Badge className="bg-gradient-to-r from-orange-200 to-pink-200 text-orange-800 border-0 shadow-sm">
                  {filteredLogs.length} kết quả
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Search Bar */}
                <motion.div className="relative" whileFocus={{ scale: 1.01 }}>
                  <div className="relative flex items-center space-x-3 p-4 bg-gradient-to-r from-white/90 to-orange-50/90 backdrop-blur-xl border border-orange-200/50 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <Search className="flex-shrink-0 w-5 h-5 text-orange-600 group-hover:text-orange-800 transition-colors" />
                    <Input
                      placeholder="Tìm kiếm trong nhật ký..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 text-sm bg-transparent border-none outline-none placeholder:text-orange-500/60 text-orange-800 font-medium"
                    />
                  </div>
                </motion.div>
                {/* Filter Controls */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <motion.div whileFocus={{ scale: 1.01 }}>
                    <label className="text-sm font-semibold text-orange-800 mb-2 block">
                      Mức độ
                    </label>
                    <Select value={levelFilter} onValueChange={setLevelFilter}>
                      <SelectTrigger className="h-12 bg-white/80 border-orange-200/50 rounded-2xl shadow-md">
                        <SelectValue placeholder="Chọn mức độ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả mức độ</SelectItem>
                        <SelectItem value="error">Lỗi</SelectItem>
                        <SelectItem value="warning">Cảnh báo</SelectItem>
                        <SelectItem value="info">Thông tin</SelectItem>
                        <SelectItem value="success">Thành công</SelectItem>
                        <SelectItem value="debug">Debug</SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>
                  <motion.div whileFocus={{ scale: 1.01 }}>
                    <label className="text-sm font-semibold text-orange-800 mb-2 block">
                      Danh mục
                    </label>
                    <Select
                      value={categoryFilter}
                      onValueChange={setCategoryFilter}
                    >
                      <SelectTrigger className="h-12 bg-white/80 border-orange-200/50 rounded-2xl shadow-md">
                        <SelectValue placeholder="Chọn danh mục" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat === "all" ? "Tất cả danh mục" : cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </motion.div>
                  <motion.div whileFocus={{ scale: 1.01 }}>
                    <label className="text-sm font-semibold text-orange-800 mb-2 block">
                      Nguồn
                    </label>
                    <Select
                      value={sourceFilter}
                      onValueChange={setSourceFilter}
                    >
                      <SelectTrigger className="h-12 bg-white/80 border-orange-200/50 rounded-2xl shadow-md">
                        <SelectValue placeholder="Chọn nguồn" />
                      </SelectTrigger>
                      <SelectContent>
                        {sources.map((source) => (
                          <SelectItem key={source} value={source}>
                            {source === "all" ? "Tất cả nguồn" : source}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </motion.div>
                </div>
                {/* Quick Filter Badges */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-orange-100 transition-colors"
                    onClick={() => setLevelFilter("error")}
                  >
                    🚨 Chỉ lỗi
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-orange-100 transition-colors"
                    onClick={() => setLevelFilter("warning")}
                  >
                    ⚠️ Cảnh báo
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-orange-100 transition-colors"
                    onClick={() => setCategoryFilter("AUTH")}
                  >
                    🔐 Xác thực
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-orange-100 transition-colors"
                    onClick={() => {
                      setSearchQuery("");
                      setLevelFilter("all");
                      setCategoryFilter("all");
                      setSourceFilter("all");
                    }}
                  >
                    🔄 Reset tất cả
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Create New Log */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50 rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Tạo Log Entry Mới
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select
                  value={newLog.level}
                  onValueChange={(value: any) =>
                    setNewLog({ ...newLog, level: value })
                  }
                >
                  <SelectTrigger className="rounded-2xl">
                    <SelectValue placeholder="Mức độ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Thông tin</SelectItem>
                    <SelectItem value="success">Thành công</SelectItem>
                    <SelectItem value="warning">Cảnh báo</SelectItem>
                    <SelectItem value="error">Lỗi</SelectItem>
                    <SelectItem value="debug">Debug</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Danh mục (VD: AUTH, DATABASE...)"
                  value={newLog.category}
                  onChange={(e) =>
                    setNewLog({ ...newLog, category: e.target.value })
                  }
                  className="rounded-2xl"
                />
                <Input
                  placeholder="Nguồn (VD: API Gateway...)"
                  value={newLog.source}
                  onChange={(e) =>
                    setNewLog({ ...newLog, source: e.target.value })
                  }
                  className="rounded-2xl"
                />
              </div>
              <Input
                placeholder="Nội dung log..."
                value={newLog.message}
                onChange={(e) =>
                  setNewLog({ ...newLog, message: e.target.value })
                }
                className="rounded-2xl"
              />
              <Textarea
                placeholder="Chi tiết (JSON format)..."
                value={newLog.details}
                onChange={(e) =>
                  setNewLog({ ...newLog, details: e.target.value })
                }
                className="rounded-2xl min-h-[100px]"
              />
              <Button
                onClick={handleCreateLog}
                className="rounded-2xl bg-gradient-to-r from-orange-500 to-pink-600"
              >
                <Save className="w-4 h-4 mr-2" />
                Tạo Log Entry
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Logs Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white/95 via-orange-50/80 to-pink-50/80 backdrop-blur-xl rounded-3xl overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-transparent bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text font-bold">
                      Nhật ký hệ thống
                    </CardTitle>
                    <p className="text-sm text-green-700/80 mt-1 flex items-center space-x-2">
                      {filteredLogs.length} log entries được tìm thấy
                    </p>
                  </div>
                </div>
                <Badge className="bg-gradient-to-r from-green-200 to-emerald-200 text-green-800 border-0 shadow-sm">
                  {stats.errors} lỗi
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-muted/50 border-orange-200/30">
                      <TableHead className="font-semibold text-orange-800">
                        Thời gian
                      </TableHead>
                      <TableHead className="font-semibold text-orange-800">
                        Mức độ
                      </TableHead>
                      <TableHead className="font-semibold text-orange-800">
                        Danh mục
                      </TableHead>
                      <TableHead className="font-semibold text-orange-800">
                        Nội dung
                      </TableHead>
                      <TableHead className="font-semibold text-orange-800">
                        Nguồn
                      </TableHead>
                      <TableHead className="font-semibold text-orange-800">
                        User
                      </TableHead>
                      <TableHead className="font-semibold text-orange-800 text-right">
                        Thao tác
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {filteredLogs.map((log, index) => (
                        <motion.tr
                          key={log.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{
                            backgroundColor: "rgba(255,245,235,0.5)",
                          }}
                          className="transition-all duration-300 group hover:shadow-md border-orange-200/20"
                        >
                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-sm font-medium">
                                {new Date(log.timestamp).toLocaleDateString(
                                  "vi-VN",
                                )}
                              </div>
                              <div className="text-xs text-gray-500">
                                {new Date(log.timestamp).toLocaleTimeString(
                                  "vi-VN",
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${getLevelColor(log.level)}`}
                            >
                              {getLevelIcon(log.level)}
                              {log.level}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="transition-all duration-300 group-hover:scale-105 bg-purple-100 text-purple-800 border-purple-300"
                            >
                              {log.category}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-xs">
                              <div className="font-medium text-gray-900 truncate">
                                {log.message}
                              </div>
                              {log.details && (
                                <div className="text-xs text-gray-500 mt-1">
                                  Có chi tiết
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm font-medium text-gray-700">
                              {log.source}
                            </span>
                          </TableCell>
                          <TableCell>
                            {log.userEmail ? (
                              <div className="space-y-1">
                                <div className="text-sm font-medium">
                                  {log.userEmail}
                                </div>
                                {log.ip && (
                                  <div className="text-xs text-gray-500">
                                    {log.ip}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-xs text-gray-400">
                                System
                              </span>
                            )}
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
                                    className="group/btn bg-white/60 hover:bg-white/80 rounded-2xl shadow-md"
                                  >
                                    <MoreHorizontal className="w-4 h-4 transition-colors group-hover/btn:text-orange-600" />
                                  </Button>
                                </motion.div>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                {log.details && (
                                  <DropdownMenuItem
                                    onClick={() => {
                                      alert(
                                        JSON.stringify(log.details, null, 2),
                                      );
                                    }}
                                  >
                                    <Eye className="w-4 h-4 mr-2" />
                                    Xem chi tiết
                                  </DropdownMenuItem>
                                )}
                                {log.stackTrace && (
                                  <DropdownMenuItem
                                    onClick={() => {
                                      alert(log.stackTrace);
                                    }}
                                  >
                                    <Code className="w-4 h-4 mr-2" />
                                    Xem stack trace
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  onClick={() => handleDeleteLog(log.id)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Xóa
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </ScrollArea>

              {/* Empty State */}
              {filteredLogs.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-16 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="mb-6"
                  >
                    <Activity className="w-20 h-20 mx-auto text-orange-400/50" />
                  </motion.div>
                  <h3 className="mb-4 text-2xl font-bold text-transparent bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text">
                    Không có nhật ký
                  </h3>
                  <p className="max-w-md mx-auto mb-6 text-orange-700/80 leading-relaxed">
                    {searchQuery ||
                    levelFilter !== "all" ||
                    categoryFilter !== "all" ||
                    sourceFilter !== "all"
                      ? "Thử thay đổi bộ lọc để tìm thấy nhật ký phù hợp."
                      : "Chưa có nhật ký nào trong hệ thống."}
                  </p>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default SystemLogsManagement;
