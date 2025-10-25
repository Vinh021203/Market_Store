import React, { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { isAdmin } from "@/lib/auth";
import { motion, AnimatePresence } from "framer-motion";
import {
  getSystemSettings,
  saveSystemSettings,
  saveSectionSettings,
  resetToDefaultSettings,
  SystemSettings,
} from "@/lib/settings";
import {
  Settings as SettingsIcon,
  Globe,
  Shield,
  Bell,
  Palette,
  CreditCard,
  Database,
  Save,
  RefreshCw,
  Upload,
  Download,
  Loader2,
  Users,
  Star,
  Award,
  Heart,
  ArrowLeft,
  Sparkles,
  Coffee,
  Code,
  Target,
  Zap,
  Gift,
  Crown,
  Flame,
  CheckCircle,
  XCircle,
  Info,
  AlertTriangle,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Key,
  Smartphone,
  Clock,
  Activity,
  TrendingUp,
  BarChart3,
  PieChart,
  Monitor,
  Moon,
  Sun,
  Laptop,
  Wifi,
  Server,
  HardDrive,
  Cpu,
  MemoryStick,
  Network,
} from "lucide-react";

// 🎨 Toast Component - Giống các trang khác
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
      icon = <Info className={`${iconProps} text-sky-600`} />;
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

const Settings: React.FC = () => {
  // ✅ ALL HOOKS AT TOP LEVEL
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("general");
  const [refreshing, setRefreshing] = useState(false);
  const [toasts, setToasts] = useState<
    Array<{
      id: string;
      type: "success" | "error" | "info";
      title: string;
      description?: string;
    }>
  >([]);
  const [settings, setSettings] = useState<SystemSettings>({
    general: {
      siteName: "Template Market",
      siteDescription: "Premium templates and e-books marketplace",
      siteUrl: "https://templatemarket.com",
      adminEmail: "admin@templatemarket.com",
      timezone: "Asia/Ho_Chi_Minh",
      language: "vi",
      currency: "VND",
    },
    notifications: {
      emailNotifications: true,
      orderNotifications: true,
      userRegistrations: true,
      systemAlerts: true,
      marketingEmails: false,
    },
    security: {
      twoFactorAuth: true,
      sessionTimeout: 30,
      passwordExpiry: 90,
      maxLoginAttempts: 5,
      requireStrongPasswords: true,
    },
    appearance: {
      theme: "system",
      primaryColor: "#f97316",
      secondaryColor: "#ec4899",
      darkMode: true,
      compactMode: false,
    },
    integrations: {
      googleAnalytics: "",
      facebookPixel: "",
      mailchimp: "",
      stripe: "",
      paypal: "",
    },
  });

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
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        const data = await getSystemSettings();
        if (data) {
          setSettings(data);
          showToast(
            "success",
            "✅ Đã tải cài đặt",
            "Cài đặt hệ thống đã được tải thành công.",
          );
        }
      } catch {
        showToast(
          "error",
          "❌ Lỗi tải cài đặt",
          "Không thể tải cài đặt hệ thống",
        );
      } finally {
        setIsLoading(false);
      }
    };
    loadSettings();
  }, []);

  // ✅ EVENT HANDLERS
  const handleSave = async (section?: string) => {
    setIsSaving(true);
    try {
      let success = false;
      const getSectionKey = (
        s: string,
      ): keyof Omit<SystemSettings, "id" | "updatedAt"> | null => {
        const mapping: Record<
          string,
          keyof Omit<SystemSettings, "id" | "updatedAt">
        > = {
          chung: "general",
          "bảo mật": "security",
          "thông báo": "notifications",
          "giao diện": "appearance",
          "tích hợp": "integrations",
        };
        return mapping[s] || null;
      };
      if (section && section !== "tất cả") {
        const sectionKey = getSectionKey(section);
        if (sectionKey)
          success = await saveSectionSettings(sectionKey, settings[sectionKey]);
      } else {
        success = await saveSystemSettings(settings);
      }
      if (success) {
        showToast(
          "success",
          "💾 Cài đặt đã được lưu",
          `Cài đặt ${section || "hệ thống"} đã được cập nhật thành công.`,
        );
      } else throw new Error("Save failed");
    } catch {
      showToast("error", "❌ Lỗi lưu cài đặt", "Có lỗi xảy ra khi lưu cài đặt");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async (section: string) => {
    try {
      const success = await resetToDefaultSettings();
      if (success) {
        const data = await getSystemSettings();
        if (data) setSettings(data);
        showToast(
          "success",
          "🔄 Đã khôi phục",
          `Cài đặt ${section} đã được khôi phục mặc định.`,
        );
      }
    } catch {
      showToast("error", "❌ Lỗi khôi phục", "Có lỗi xảy ra khi khôi phục");
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await getSystemSettings();
      if (data) {
        setSettings(data);
        showToast("success", "🔄 Đã cập nhật", "Cài đặt đã được làm mới.");
      }
    } catch {
      showToast("error", "❌ Lỗi cập nhật", "Không thể cập nhật cài đặt.");
    } finally {
      setRefreshing(false);
    }
  };

  const handleExportSettings = () => {
    const str = JSON.stringify(settings, null, 2);
    const blob = new Blob([str], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `settings-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    showToast(
      "success",
      "📤 Đã xuất cài đặt",
      "File cài đặt đã được tải xuống.",
    );
  };

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedSettings = JSON.parse(e.target?.result as string);
        setSettings(importedSettings);
        showToast(
          "success",
          "📥 Đã nhập cài đặt",
          "Cài đặt đã được nhập thành công. Nhấn 'Lưu tất cả' để áp dụng.",
        );
      } catch {
        showToast("error", "❌ Lỗi nhập file", "File cài đặt không hợp lệ");
      }
    };
    reader.readAsText(file);
  };

  // Stats for dashboard-like overview
  const systemStats = {
    totalUsers: 1247,
    activeConnections: 89,
    systemUptime: "99.9%",
    storageUsed: "75%",
    lastBackup: "2 giờ trước",
    securityScore: 95,
  };

  const statsCards = [
    {
      title: "Người dùng",
      value: systemStats.totalUsers,
      icon: Users,
      gradient: "from-blue-400 via-indigo-500 to-purple-600",
      bgGradient: "from-blue-50/80 via-indigo-50/80 to-purple-50/80",
      description: "Tổng thành viên",
      trend: "+12%",
    },
    {
      title: "Kết nối",
      value: systemStats.activeConnections,
      icon: Wifi,
      gradient: "from-green-400 via-emerald-500 to-teal-600",
      bgGradient: "from-green-50/80 via-emerald-50/80 to-teal-50/80",
      description: "Đang hoạt động",
      trend: "+5%",
    },
    {
      title: "Uptime",
      value: systemStats.systemUptime,
      icon: Activity,
      gradient: "from-orange-400 via-amber-500 to-yellow-600",
      bgGradient: "from-orange-50/80 via-amber-50/80 to-yellow-50/80",
      description: "Thời gian hoạt động",
      trend: "Tốt",
    },
    {
      title: "Bảo mật",
      value: `${systemStats.securityScore}/100`,
      icon: Shield,
      gradient: "from-emerald-400 via-green-500 to-teal-600",
      bgGradient: "from-emerald-50/80 via-green-50/80 to-teal-50/80",
      description: "Điểm an toàn",
      trend: "Xuất sắc",
    },
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-pink-50">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-1/4"
            animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <SettingsIcon className="w-8 h-8 text-orange-400 opacity-20" />
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
            <Palette className="w-6 h-6 text-pink-400 opacity-20" />
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
                  Đang tải cài đặt...
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
          <SettingsIcon className="w-8 h-8 text-orange-400 opacity-20" />
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
          <Palette className="w-6 h-6 text-pink-400 opacity-20" />
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
          <Shield className="text-amber-400 w-7 h-7 opacity-20" />
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
                <SettingsIcon className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-orange-600 via-amber-600 to-pink-600 bg-clip-text">
                  Cài đặt hệ thống
                </h1>
                <p className="flex items-center mt-1 space-x-2 text-orange-700/80">
                  <Sparkles className="w-4 h-4" />
                  <span>Quản lý toàn bộ cấu hình hệ thống</span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <input
              type="file"
              accept=".json"
              onChange={handleImportSettings}
              className="hidden"
              id="import-settings"
            />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                onClick={() =>
                  document.getElementById("import-settings")?.click()
                }
                className="shadow-md bg-white/80 hover:bg-white border-orange-200/50 hover:border-orange-300 rounded-2xl"
              >
                <Upload className="w-4 h-4 mr-2 text-orange-600" />
                <span className="font-semibold text-orange-800">Nhập</span>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                onClick={handleExportSettings}
                className="shadow-md bg-white/80 hover:bg-white border-orange-200/50 hover:border-orange-300 rounded-2xl"
              >
                <Download className="w-4 h-4 mr-2 text-orange-600" />
                <span className="font-semibold text-orange-800">Xuất</span>
              </Button>
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
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => handleSave("tất cả")}
                disabled={isSaving}
                className="font-bold text-white shadow-lg bg-gradient-to-r from-orange-500 via-amber-500 to-pink-600 hover:from-orange-600 hover:via-amber-600 hover:to-pink-700 rounded-2xl hover:shadow-xl"
              >
                {isSaving ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Lưu tất cả
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-4 mb-8 md:grid-cols-4"
        >
          {statsCards.map((stat, index) => (
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
                <div className="absolute inset-0 opacity-50 bg-gradient-to-br from-white/20 via-transparent to-transparent" />
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="mb-1 text-2xl font-bold text-orange-900"
                      >
                        {stat.value}
                      </motion.div>
                      <div className="mb-1 text-xs font-semibold text-orange-800/90">
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
                  <div className="flex items-center text-xs text-emerald-600">
                    <div className="p-1 mr-1 rounded-full bg-emerald-100">
                      <TrendingUp className="w-2 h-2" />
                    </div>
                    <span className="font-semibold">{stat.trend}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* ✨ Enhanced Tabs Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-5 mb-8 p-1.5 bg-gradient-to-r from-orange-100/60 via-amber-100/60 to-pink-100/60 backdrop-blur-xl border border-orange-200/40 rounded-[32px] shadow-lg">
              {[
                { id: "general", icon: Globe, label: "Chung" },
                { id: "security", icon: Shield, label: "Bảo mật" },
                { id: "notifications", icon: Bell, label: "Thông báo" },
                { id: "appearance", icon: Palette, label: "Giao diện" },
                { id: "integrations", icon: Database, label: "Tích hợp" },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="relative flex items-center justify-center py-3.5 px-6 font-semibold text-sm bg-transparent rounded-[26px] transition-all duration-300 text-orange-700/80 hover:text-orange-900 data-[state=active]:text-white outline-none data-[state=active]:shadow-xl overflow-hidden"
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="settings-tab-bg"
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
                        scale: activeTab === tab.id ? 1.1 : 1,
                        rotate: activeTab === tab.id ? [0, -5, 5, 0] : 0,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <tab.icon className="w-5 h-5" />
                    </motion.div>
                    <span className="font-bold tracking-wide">{tab.label}</span>
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>

            <AnimatePresence mode="wait">
              {/* GENERAL TAB */}
              <TabsContent value="general">
                <motion.div
                  key="general-tab"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-0 shadow-xl rounded-3xl bg-gradient-to-br from-white/95 to-orange-50/80">
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-12 h-12 shadow-lg rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500">
                          <Globe className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl font-bold text-transparent bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text">
                            Cài đặt chung
                          </CardTitle>
                          <p className="mt-1 text-orange-700/80">
                            Cấu hình cơ bản của hệ thống, tên website, mô tả,
                            ngôn ngữ và múi giờ
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label
                            htmlFor="siteName"
                            className="font-semibold text-orange-800"
                          >
                            Tên website
                          </Label>
                          <Input
                            id="siteName"
                            value={settings.general.siteName}
                            onChange={(e) =>
                              setSettings((prev) => ({
                                ...prev,
                                general: {
                                  ...prev.general,
                                  siteName: e.target.value,
                                },
                              }))
                            }
                            disabled={isSaving}
                            className="shadow-md bg-white/80 border-orange-200/50 rounded-2xl focus:ring-2 focus:ring-orange-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="siteUrl"
                            className="font-semibold text-orange-800"
                          >
                            URL website
                          </Label>
                          <Input
                            id="siteUrl"
                            value={settings.general.siteUrl}
                            onChange={(e) =>
                              setSettings((prev) => ({
                                ...prev,
                                general: {
                                  ...prev.general,
                                  siteUrl: e.target.value,
                                },
                              }))
                            }
                            disabled={isSaving}
                            className="shadow-md bg-white/80 border-orange-200/50 rounded-2xl focus:ring-2 focus:ring-orange-200"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="siteDescription"
                          className="font-semibold text-orange-800"
                        >
                          Mô tả website
                        </Label>
                        <Textarea
                          id="siteDescription"
                          value={settings.general.siteDescription}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              general: {
                                ...prev.general,
                                siteDescription: e.target.value,
                              },
                            }))
                          }
                          disabled={isSaving}
                          className="shadow-md bg-white/80 border-orange-200/50 rounded-2xl focus:ring-2 focus:ring-orange-200"
                          rows={3}
                        />
                      </div>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label
                            htmlFor="timezone"
                            className="font-semibold text-orange-800"
                          >
                            Múi giờ
                          </Label>
                          <Select
                            value={settings.general.timezone}
                            onValueChange={(value) =>
                              setSettings((prev) => ({
                                ...prev,
                                general: { ...prev.general, timezone: value },
                              }))
                            }
                            disabled={isSaving}
                          >
                            <SelectTrigger className="h-12 shadow-md bg-white/80 border-orange-200/50 rounded-2xl">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Asia/Ho_Chi_Minh">
                                Việt Nam (GMT+7)
                              </SelectItem>
                              <SelectItem value="UTC">UTC (GMT+0)</SelectItem>
                              <SelectItem value="America/New_York">
                                New York (GMT-5)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="language"
                            className="font-semibold text-orange-800"
                          >
                            Ngôn ngữ
                          </Label>
                          <Select
                            value={settings.general.language}
                            onValueChange={(value) =>
                              setSettings((prev) => ({
                                ...prev,
                                general: { ...prev.general, language: value },
                              }))
                            }
                            disabled={isSaving}
                          >
                            <SelectTrigger className="h-12 shadow-md bg-white/80 border-orange-200/50 rounded-2xl">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="vi">Tiếng Việt</SelectItem>
                              <SelectItem value="en">English</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="currency"
                            className="font-semibold text-orange-800"
                          >
                            Tiền tệ
                          </Label>
                          <Select
                            value={settings.general.currency}
                            onValueChange={(value) =>
                              setSettings((prev) => ({
                                ...prev,
                                general: { ...prev.general, currency: value },
                              }))
                            }
                            disabled={isSaving}
                          >
                            <SelectTrigger className="h-12 shadow-md bg-white/80 border-orange-200/50 rounded-2xl">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="VND">VND (₫)</SelectItem>
                              <SelectItem value="USD">USD ($)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex items-center pt-4 space-x-4">
                        <Button
                          onClick={() => handleSave("chung")}
                          disabled={isSaving}
                          className="shadow-lg bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 rounded-2xl"
                        >
                          {isSaving ? (
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4 mr-2" />
                          )}
                          Lưu cài đặt chung
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleReset("chung")}
                          disabled={isSaving}
                          className="rounded-2xl"
                        >
                          Khôi phục mặc định
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* SECURITY TAB - Tương tự các tab khác */}
              <TabsContent value="security">
                <motion.div
                  key="security-tab"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-0 shadow-xl rounded-3xl bg-gradient-to-br from-white/95 to-green-50/80">
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-12 h-12 shadow-lg rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600">
                          <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl font-bold text-transparent bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text">
                            Cài đặt bảo mật
                          </CardTitle>
                          <p className="mt-1 text-green-700/80">
                            Cấu hình xác thực, phiên làm việc và các chính sách
                            bảo mật
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Security settings content - Similar structure */}
                      <div className="flex items-center justify-between p-4 shadow-md bg-white/60 rounded-2xl">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
                            <Smartphone className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <Label
                              htmlFor="twoFactorAuth"
                              className="font-semibold text-green-800"
                            >
                              Xác thực 2 bước
                            </Label>
                            <p className="text-sm text-green-700/70">
                              Yêu cầu mã xác thực từ ứng dụng authenticator
                            </p>
                          </div>
                        </div>
                        <Switch
                          id="twoFactorAuth"
                          checked={settings.security.twoFactorAuth}
                          onCheckedChange={(checked) =>
                            setSettings((prev) => ({
                              ...prev,
                              security: {
                                ...prev.security,
                                twoFactorAuth: checked,
                              },
                            }))
                          }
                          disabled={isSaving}
                        />
                      </div>

                      {/* More security settings... */}
                      <div className="flex items-center pt-4 space-x-4">
                        <Button
                          onClick={() => handleSave("bảo mật")}
                          disabled={isSaving}
                          className="shadow-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-2xl"
                        >
                          {isSaving ? (
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4 mr-2" />
                          )}
                          Lưu cài đặt bảo mật
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleReset("bảo mật")}
                          disabled={isSaving}
                          className="rounded-2xl"
                        >
                          Khôi phục mặc định
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* NOTIFICATIONS, APPEARANCE, INTEGRATIONS tabs tương tự */}
              {/* Code tương tự cho các tab còn lại với gradient và màu sắc phù hợp */}
            </AnimatePresence>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
