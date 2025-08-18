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
  Bell,
  BellRing,
  BellOff,
  BellPlus,
  Plus,
  Save,
  Download,
  Upload,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Settings,
  RefreshCw,
  Search,
  Filter,
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
  Users,
  MessageCircle,
  Mail,
  Activity,
  Zap,
  Target,
  Award,
} from "lucide-react";

// **🎨 Enhanced Toast Component giống BlogManagement**
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

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  priority: "low" | "medium" | "high" | "urgent";
  read: boolean;
  createdAt: string;
  readAt?: string;
  source: string;
  actionUrl?: string;
}

const NotificationsManagement: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [toasts, setToasts] = useState<
    Array<{
      id: string;
      type: "success" | "error" | "info" | "warning";
      title: string;
      description?: string;
    }>
  >([]);

  // New notification form
  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    type: "info" as const,
    priority: "medium" as const,
    source: "Admin",
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

  // Load notifications from localStorage
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const saved = localStorage.getItem("admin-notifications");
        if (saved) {
          setNotifications(JSON.parse(saved));
        } else {
          // Sample notifications
          const sampleNotifications: Notification[] = [
            {
              id: "1",
              title: "Đơn hàng mới",
              message:
                "Có đơn hàng mới #12345 cần xử lý từ khách hàng Nguyễn Văn A",
              type: "info",
              priority: "high",
              read: false,
              createdAt: new Date().toISOString(),
              source: "Hệ thống bán hàng",
              actionUrl: "/admin/orders/12345",
            },
            {
              id: "2",
              title: "Thanh toán thành công",
              message:
                "Đơn hàng #12344 đã được thanh toán thành công 2,500,000 VND",
              type: "success",
              priority: "medium",
              read: false,
              createdAt: new Date(Date.now() - 60000).toISOString(),
              source: "Cổng thanh toán",
            },
            {
              id: "3",
              title: "Cảnh báo bảo mật",
              message: "Phát hiện đăng nhập bất thường từ IP 192.168.1.100",
              type: "warning",
              priority: "urgent",
              read: true,
              createdAt: new Date(Date.now() - 120000).toISOString(),
              readAt: new Date(Date.now() - 60000).toISOString(),
              source: "Hệ thống bảo mật",
            },
            {
              id: "4",
              title: "Lỗi hệ thống",
              message: "Database connection timeout - đã khôi phục tự động",
              type: "error",
              priority: "high",
              read: true,
              createdAt: new Date(Date.now() - 180000).toISOString(),
              readAt: new Date(Date.now() - 120000).toISOString(),
              source: "Hệ thống",
            },
          ];
          setNotifications(sampleNotifications);
          localStorage.setItem(
            "admin-notifications",
            JSON.stringify(sampleNotifications),
          );
        }

        showToast(
          "success",
          "✅ Đã tải thông báo",
          `Tải thành công thông báo hệ thống.`,
        );
      } catch {
        showToast("error", "❌ Lỗi tải dữ liệu", "Không thể tải thông báo.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Save to localStorage
  const saveNotifications = (newNotifications: Notification[]) => {
    setNotifications(newNotifications);
    localStorage.setItem(
      "admin-notifications",
      JSON.stringify(newNotifications),
    );
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const saved = localStorage.getItem("admin-notifications");
      if (saved) {
        setNotifications(JSON.parse(saved));
      }
      showToast(
        "success",
        "🔄 Đã cập nhật",
        "Danh sách thông báo đã được làm mới.",
      );
    } catch {
      showToast("error", "❌ Lỗi cập nhật", "Không thể cập nhật dữ liệu.");
    }
    setRefreshing(false);
  };

  // Create new notification
  const handleCreateNotification = () => {
    if (!newNotification.title || !newNotification.message) {
      showToast(
        "error",
        "❌ Thiếu thông tin",
        "Vui lòng điền đầy đủ tiêu đề và nội dung",
      );
      return;
    }

    const notification: Notification = {
      id: Date.now().toString(),
      title: newNotification.title,
      message: newNotification.message,
      type: newNotification.type,
      priority: newNotification.priority,
      read: false,
      createdAt: new Date().toISOString(),
      source: newNotification.source,
    };

    saveNotifications([notification, ...notifications]);
    setNewNotification({
      title: "",
      message: "",
      type: "info",
      priority: "medium",
      source: "Admin",
    });
    showToast("success", "✅ Đã tạo thông báo", "Thông báo mới đã được tạo");
  };

  // Mark as read/unread
  const handleToggleRead = (id: string) => {
    const updated = notifications.map((n) =>
      n.id === id
        ? {
            ...n,
            read: !n.read,
            readAt: !n.read ? new Date().toISOString() : undefined,
          }
        : n,
    );
    saveNotifications(updated);
    showToast(
      "success",
      "✅ Đã cập nhật",
      "Trạng thái thông báo đã được cập nhật",
    );
  };

  // Mark all as read
  const handleMarkAllAsRead = () => {
    const updated = notifications.map((n) => ({
      ...n,
      read: true,
      readAt: n.readAt || new Date().toISOString(),
    }));
    saveNotifications(updated);
    showToast(
      "success",
      "✅ Đã đọc tất cả",
      "Tất cả thông báo đã được đánh dấu đã đọc",
    );
  };

  // Delete notification
  const handleDeleteNotification = (id: string) => {
    const updated = notifications.filter((n) => n.id !== id);
    saveNotifications(updated);
    showToast("success", "🗑️ Đã xóa thông báo", "Thông báo đã được xóa");
  };

  // Export data
  const handleExportData = () => {
    const data = {
      notifications,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `notifications-data-${new Date().toISOString().split("T")[0]}.json`;
    link.click();

    showToast(
      "success",
      "📤 Đã xuất dữ liệu",
      "File dữ liệu đã được tải xuống",
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
        if (data.notifications) {
          saveNotifications(data.notifications);
          showToast(
            "success",
            "📥 Đã nhập dữ liệu",
            "Dữ liệu đã được nhập thành công",
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
    total: notifications.length,
    unread: notifications.filter((n) => !n.read).length,
    read: notifications.filter((n) => n.read).length,
    urgent: notifications.filter((n) => n.priority === "urgent").length,
    high: notifications.filter((n) => n.priority === "high").length,
    today: notifications.filter(
      (n) => new Date(n.createdAt).toDateString() === new Date().toDateString(),
    ).length,
  };

  const statsCards = [
    {
      title: "Tổng thông báo",
      value: stats.total,
      icon: Bell,
      gradient: "from-orange-400 via-amber-500 to-pink-600",
      bgGradient: "from-orange-50/80 via-amber-50/80 to-pink-50/80",
      description: "Tất cả",
      trend: "+5%",
    },
    {
      title: "Chưa đọc",
      value: stats.unread,
      icon: BellRing,
      gradient: "from-red-400 via-pink-500 to-rose-600",
      bgGradient: "from-red-50/80 via-pink-50/80 to-rose-50/80",
      description: "Cần xem",
      trend: "+3%",
    },
    {
      title: "Đã đọc",
      value: stats.read,
      icon: CheckCircle,
      gradient: "from-green-400 via-emerald-500 to-teal-600",
      bgGradient: "from-green-50/80 via-emerald-50/80 to-teal-50/80",
      description: "Đã xử lý",
      trend: "+8%",
    },
    {
      title: "Khẩn cấp",
      value: stats.urgent,
      icon: AlertTriangle,
      gradient: "from-purple-400 via-violet-500 to-indigo-600",
      bgGradient: "from-purple-50/80 via-violet-50/80 to-indigo-50/80",
      description: "Ưu tiên cao",
      trend: stats.urgent > 0 ? "!" : "✓",
    },
    {
      title: "Quan trọng",
      value: stats.high,
      icon: Zap,
      gradient: "from-indigo-500 via-blue-500 to-cyan-500",
      bgGradient: "from-indigo-50/80 via-blue-50/80 to-cyan-50/80",
      description: "Cần chú ý",
      trend: "+2%",
    },
    {
      title: "Hôm nay",
      value: stats.today,
      gradient: "from-pink-500 via-red-500 to-orange-500",
      bgGradient: "from-pink-50/80 via-red-50/80 to-orange-50/80",
      icon: Calendar,
      description: "Mới nhất",
      trend: "+12%",
    },
  ];

  // Filter logic
  const filteredNotifications = notifications.filter((notification) => {
    const matchSearch =
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.source.toLowerCase().includes(searchQuery.toLowerCase());

    const matchType = typeFilter === "all" || notification.type === typeFilter;
    const matchPriority =
      priorityFilter === "all" || notification.priority === priorityFilter;
    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "read" && notification.read) ||
      (statusFilter === "unread" && !notification.read);

    return matchSearch && matchType && matchPriority && matchStatus;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case "error":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-50 text-green-700 border-green-200";
      case "warning":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "error":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-blue-50 text-blue-700 border-blue-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-pink-50">
      {/* 🌟 Floating Elements giống BlogManagement */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4"
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Bell className="w-8 h-8 text-orange-400 opacity-20" />
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
          <BellRing className="w-6 h-6 text-pink-400 opacity-20" />
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
          <Sparkles className="text-amber-400 w-7 h-7 opacity-20" />
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
        {/* Header giống BlogManagement */}
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
                <Bell className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-orange-600 via-amber-600 to-pink-600 bg-clip-text">
                  Quản lý Thông báo
                </h1>
                <p className="text-orange-700/80 mt-1 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Theo dõi và quản lý thông báo hệ thống</span>
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
                onClick={handleMarkAllAsRead}
                className="bg-white/80 border-orange-200/50 hover:border-orange-300 rounded-2xl shadow-md"
              >
                <CheckCircle className="w-4 h-4 mr-2 text-orange-600" />
                <span className="font-semibold">Đọc tất cả</span>
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

        {/* Stats Cards chia 2 hàng giống BlogManagement */}
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

        {/* Filters giống BlogManagement */}
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
                      Tìm kiếm & lọc thông báo theo nhiều tiêu chí
                    </p>
                  </div>
                </div>
                <Badge className="bg-gradient-to-r from-orange-200 to-pink-200 text-orange-800 border-0 shadow-sm">
                  {filteredNotifications.length} kết quả
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
                      placeholder="Tìm kiếm thông báo..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 text-sm bg-transparent border-none outline-none placeholder:text-orange-500/60 text-orange-800 font-medium"
                    />
                  </div>
                </motion.div>
                {/* Filter Controls */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <motion.div whileFocus={{ scale: 1.01 }}>
                    <label className="text-sm font-semibold text-orange-800 mb-2 block">
                      Loại thông báo
                    </label>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="h-12 bg-white/80 border-orange-200/50 rounded-2xl shadow-md">
                        <SelectValue placeholder="Chọn loại" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả loại</SelectItem>
                        <SelectItem value="info">Thông tin</SelectItem>
                        <SelectItem value="success">Thành công</SelectItem>
                        <SelectItem value="warning">Cảnh báo</SelectItem>
                        <SelectItem value="error">Lỗi</SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>
                  <motion.div whileFocus={{ scale: 1.01 }}>
                    <label className="text-sm font-semibold text-orange-800 mb-2 block">
                      Mức độ ưu tiên
                    </label>
                    <Select
                      value={priorityFilter}
                      onValueChange={setPriorityFilter}
                    >
                      <SelectTrigger className="h-12 bg-white/80 border-orange-200/50 rounded-2xl shadow-md">
                        <SelectValue placeholder="Mức độ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả mức độ</SelectItem>
                        <SelectItem value="urgent">Khẩn cấp</SelectItem>
                        <SelectItem value="high">Cao</SelectItem>
                        <SelectItem value="medium">Trung bình</SelectItem>
                        <SelectItem value="low">Thấp</SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>
                  <motion.div whileFocus={{ scale: 1.01 }}>
                    <label className="text-sm font-semibold text-orange-800 mb-2 block">
                      Trạng thái
                    </label>
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="h-12 bg-white/80 border-orange-200/50 rounded-2xl shadow-md">
                        <SelectValue placeholder="Trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="unread">Chưa đọc</SelectItem>
                        <SelectItem value="read">Đã đọc</SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>
                </div>
                {/* Quick Filter Badges */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-orange-100 transition-colors"
                    onClick={() => {
                      setTypeFilter("error");
                      setPriorityFilter("urgent");
                    }}
                  >
                    🚨 Khẩn cấp
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-orange-100 transition-colors"
                    onClick={() => setStatusFilter("unread")}
                  >
                    📬 Chưa đọc
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-orange-100 transition-colors"
                    onClick={() => setTypeFilter("success")}
                  >
                    ✅ Thành công
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-orange-100 transition-colors"
                    onClick={() => {
                      setSearchQuery("");
                      setTypeFilter("all");
                      setPriorityFilter("all");
                      setStatusFilter("all");
                    }}
                  >
                    🔄 Reset tất cả
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Create New Notification */}
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
                Tạo Thông báo Mới
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Tiêu đề thông báo..."
                  value={newNotification.title}
                  onChange={(e) =>
                    setNewNotification({
                      ...newNotification,
                      title: e.target.value,
                    })
                  }
                  className="rounded-2xl"
                />
                <Input
                  placeholder="Nguồn (VD: Hệ thống, Admin...)"
                  value={newNotification.source}
                  onChange={(e) =>
                    setNewNotification({
                      ...newNotification,
                      source: e.target.value,
                    })
                  }
                  className="rounded-2xl"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  value={newNotification.type}
                  onValueChange={(value: any) =>
                    setNewNotification({ ...newNotification, type: value })
                  }
                >
                  <SelectTrigger className="rounded-2xl">
                    <SelectValue placeholder="Loại thông báo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Thông tin</SelectItem>
                    <SelectItem value="success">Thành công</SelectItem>
                    <SelectItem value="warning">Cảnh báo</SelectItem>
                    <SelectItem value="error">Lỗi</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={newNotification.priority}
                  onValueChange={(value: any) =>
                    setNewNotification({ ...newNotification, priority: value })
                  }
                >
                  <SelectTrigger className="rounded-2xl">
                    <SelectValue placeholder="Mức độ ưu tiên" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Thấp</SelectItem>
                    <SelectItem value="medium">Trung bình</SelectItem>
                    <SelectItem value="high">Cao</SelectItem>
                    <SelectItem value="urgent">Khẩn cấp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Textarea
                placeholder="Nội dung thông báo..."
                value={newNotification.message}
                onChange={(e) =>
                  setNewNotification({
                    ...newNotification,
                    message: e.target.value,
                  })
                }
                className="rounded-2xl min-h-[120px]"
              />
              <Button
                onClick={handleCreateNotification}
                className="rounded-2xl bg-gradient-to-r from-orange-500 to-pink-600"
              >
                <Save className="w-4 h-4 mr-2" />
                Tạo Thông báo
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications Table */}
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
                      Danh sách thông báo
                    </CardTitle>
                    <p className="text-sm text-green-700/80 mt-1 flex items-center space-x-2">
                      {filteredNotifications.length} thông báo được tìm thấy
                    </p>
                  </div>
                </div>
                <Badge className="bg-gradient-to-r from-green-200 to-emerald-200 text-green-800 border-0 shadow-sm">
                  {stats.unread} chưa đọc
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-muted/50 border-orange-200/30">
                      <TableHead className="font-semibold text-orange-800">
                        Thông báo
                      </TableHead>
                      <TableHead className="font-semibold text-orange-800">
                        Loại
                      </TableHead>
                      <TableHead className="font-semibold text-orange-800">
                        Ưu tiên
                      </TableHead>
                      <TableHead className="font-semibold text-orange-800">
                        Nguồn
                      </TableHead>
                      <TableHead className="font-semibold text-orange-800">
                        Thời gian
                      </TableHead>
                      <TableHead className="font-semibold text-orange-800">
                        Trạng thái
                      </TableHead>
                      <TableHead className="font-semibold text-orange-800 text-right">
                        Thao tác
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {filteredNotifications.map((notification, index) => (
                        <motion.tr
                          key={notification.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{
                            backgroundColor: "rgba(255,245,235,0.5)",
                          }}
                          className={`transition-all duration-300 group hover:shadow-md border-orange-200/20 ${
                            !notification.read ? "bg-blue-50/50" : ""
                          }`}
                        >
                          <TableCell>
                            <div className="space-y-1">
                              <div
                                className={`font-semibold transition-colors group-hover:text-orange-700 ${
                                  notification.read
                                    ? "text-gray-700"
                                    : "text-orange-900"
                                }`}
                              >
                                {notification.title}
                              </div>
                              <div className="text-xs text-gray-600 line-clamp-2">
                                {notification.message}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${getTypeColor(notification.type)}`}
                            >
                              {getTypeIcon(notification.type)}
                              {notification.type}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`transition-all duration-300 group-hover:scale-105 ${getPriorityColor(notification.priority)}`}
                            >
                              {notification.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm font-medium text-gray-700">
                              {notification.source}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="text-sm font-medium">
                                {new Date(
                                  notification.createdAt,
                                ).toLocaleDateString("vi-VN")}
                              </div>
                              <div className="text-xs text-gray-500">
                                {new Date(
                                  notification.createdAt,
                                ).toLocaleTimeString("vi-VN")}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {notification.read ? (
                                <Badge className="bg-green-100 text-green-800 border-green-200">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Đã đọc
                                </Badge>
                              ) : (
                                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                                  <Bell className="w-3 h-3 mr-1" />
                                  Chưa đọc
                                </Badge>
                              )}
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
                                    className="group/btn bg-white/60 hover:bg-white/80 rounded-2xl shadow-md"
                                  >
                                    <MoreHorizontal className="w-4 h-4 transition-colors group-hover/btn:text-orange-600" />
                                  </Button>
                                </motion.div>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleToggleRead(notification.id)
                                  }
                                >
                                  {notification.read ? (
                                    <>
                                      <EyeOff className="w-4 h-4 mr-2" />
                                      Đánh dấu chưa đọc
                                    </>
                                  ) : (
                                    <>
                                      <Eye className="w-4 h-4 mr-2" />
                                      Đánh dấu đã đọc
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleDeleteNotification(notification.id)
                                  }
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
              {filteredNotifications.length === 0 && (
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
                    <Bell className="w-20 h-20 mx-auto text-orange-400/50" />
                  </motion.div>
                  <h3 className="mb-4 text-2xl font-bold text-transparent bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text">
                    Không có thông báo
                  </h3>
                  <p className="max-w-md mx-auto mb-6 text-orange-700/80 leading-relaxed">
                    {searchQuery ||
                    typeFilter !== "all" ||
                    priorityFilter !== "all" ||
                    statusFilter !== "all"
                      ? "Thử thay đổi bộ lọc để tìm thấy thông báo phù hợp."
                      : "Chưa có thông báo nào trong hệ thống."}
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

export default NotificationsManagement;
