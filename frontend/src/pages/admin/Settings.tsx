import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
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

// **🎨 Enhanced Toast Component**
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

const Settings: React.FC = () => {
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
      primaryColor: "#3b82f6",
      secondaryColor: "#8b5cf6",
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

  if (!user || !isAdmin(user)) return <Navigate to="/" replace />;

  // **🎯 Enhanced Toast System**
  const showToast = (
    type: "success" | "error" | "info",
    title: string,
    description?: string,
  ) => {
    const id = Date.now().toString();
    const newToast = { id, type, title, description };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

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
    const file = event.target.files?.[0]; // ← Thêm  để lấy file đầu tiên
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-blue-900 mb-2">
            Đang tải cài đặt...
          </h2>
          <p className="text-blue-700/80">Vui lòng đợi trong giây lát</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-pink-50">
      {/* **🌟 Enhanced Floating Elements** */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4"
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <SettingsIcon className="w-8 h-8 text-blue-400 opacity-20" />
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
        <motion.div
          className="absolute top-2/3 right-1/3"
          animate={{ y: [0, -18, 0], scale: [1, 1.1, 1] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
        >
          <Heart className="w-5 h-5 text-pink-300 opacity-20" />
        </motion.div>
        <motion.div
          className="absolute top-1/6 right-1/6"
          animate={{ y: [0, -12, 0], rotate: [0, -5, 0] }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
        >
          <Sparkles className="w-4 h-4 text-yellow-400 opacity-20" />
        </motion.div>
        <motion.div
          className="absolute bottom-1/6 right-1/5"
          animate={{ y: [0, -16, 0], scale: [1, 1.2, 1] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2.5,
          }}
        >
          <Gift className="w-6 h-6 text-purple-300 opacity-20" />
        </motion.div>
      </div>

      {/* **🎨 Toast Container** */}
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
        {/* ✅ Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8 p-6 bg-gradient-to-r from-white/90 via-blue-50/90 to-purple-50/90 backdrop-blur-xl border border-blue-200/50 rounded-3xl shadow-lg"
        >
          <div className="flex items-center space-x-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="group bg-white/60 hover:bg-white/80 rounded-2xl shadow-md"
              >
                <a href="/admin">
                  <ArrowLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1 text-blue-600" />
                  <span className="font-semibold text-blue-800">
                    Về Dashboard
                  </span>
                </a>
              </Button>
            </motion.div>
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="flex items-center justify-center w-16 h-16 shadow-xl rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-600"
              >
                <SettingsIcon className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text">
                  Cài đặt hệ thống
                </h1>
                <p className="text-blue-700/80 mt-1 flex items-center space-x-2">
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
            <Button
              variant="outline"
              onClick={() =>
                document.getElementById("import-settings")?.click()
              }
              className="rounded-xl"
            >
              <Upload className="w-4 h-4 mr-2" />
              Nhập
            </Button>
            <Button
              variant="outline"
              onClick={handleExportSettings}
              className="rounded-xl"
            >
              <Download className="w-4 h-4 mr-2" />
              Xuất
            </Button>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={refreshing}
                className="transition-all duration-300 group bg-white/80 hover:bg-white border-blue-200/50 hover:border-blue-300 rounded-2xl shadow-md hover:shadow-lg"
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
                  <RefreshCw className="w-4 h-4 mr-2 group-hover:animate-spin text-blue-600" />
                )}
                <span className="text-blue-800 font-semibold">Làm mới</span>
              </Button>
            </motion.div>
            <Button
              onClick={() => handleSave("tất cả")}
              disabled={isSaving}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl text-white font-bold"
            >
              {isSaving ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Lưu tất cả
            </Button>
          </div>
        </motion.div>

        {/* ✅ Enhanced Stats Cards */}
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
                className={`relative overflow-hidden border-0 bg-gradient-to-br ${stat.bgGradient} backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 group rounded-3xl`}
                style={{ minHeight: 140 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50" />
                <CardContent className="relative pt-4 pb-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="text-2xl font-bold text-blue-900 mb-1"
                      >
                        {stat.value}
                      </motion.div>
                      <div className="text-xs font-semibold text-blue-800/90 mb-1">
                        {stat.title}
                      </div>
                      <div className="text-xs text-blue-700/70">
                        {stat.description}
                      </div>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.15, rotate: 10 }}
                      className={`w-10 h-10 rounded-2xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 flex-shrink-0`}
                    >
                      <stat.icon className="w-5 h-5 text-white" />
                    </motion.div>
                  </div>
                  <div className="flex items-center text-xs text-emerald-600">
                    <div className="p-1 rounded-full mr-1 bg-emerald-100">
                      <TrendingUp className="w-2 h-2" />
                    </div>
                    <span className="font-semibold">{stat.trend}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* ✅ Enhanced Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full h-[12vh] grid-cols-5 mb-8 p-2 bg-gradient-to-r from-white/80 via-blue-50/80 to-purple-50/80 backdrop-blur-xl border border-blue-200/50 rounded-3xl shadow-xl">
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
                className="group relative flex items-center justify-center w-full h-full py-4 px-0 font-semibold text-sm bg-transparent rounded-2xl transition-all duration-300 text-blue-700 hover:bg-white/60 hover:text-blue-900 hover:shadow-md data-[state=active]:text-white data-[state=active]:shadow-xl outline-none"
              >
                <span className="flex items-center gap-2 z-10">
                  <tab.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="hidden sm:inline font-bold tracking-wide">
                    {tab.label}
                  </span>
                </span>
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="tab-active-bg"
                    className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-600"
                    initial={false}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 35,
                    }}
                    style={{ zIndex: 1 }}
                  />
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* GENERAL TAB */}
          <TabsContent value="general">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="rounded-3xl shadow-xl border-0 bg-gradient-to-br from-white to-blue-50">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-bold">
                        Cài đặt chung
                      </CardTitle>
                      <p className="text-blue-700/80 mt-1">
                        Cấu hình cơ bản của hệ thống, tên website, mô tả, ngôn
                        ngữ và múi giờ
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label
                        htmlFor="siteName"
                        className="text-blue-800 font-semibold"
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
                        className="bg-white/80 border-blue-200/50 rounded-2xl shadow-md focus:ring-2 focus:ring-blue-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="siteUrl"
                        className="text-blue-800 font-semibold"
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
                        className="bg-white/80 border-blue-200/50 rounded-2xl shadow-md focus:ring-2 focus:ring-blue-200"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="siteDescription"
                      className="text-blue-800 font-semibold"
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
                      className="bg-white/80 border-blue-200/50 rounded-2xl shadow-md focus:ring-2 focus:ring-blue-200"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label
                        htmlFor="timezone"
                        className="text-blue-800 font-semibold"
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
                        <SelectTrigger className="h-12 bg-white/80 border-blue-200/50 rounded-2xl shadow-md">
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
                        className="text-blue-800 font-semibold"
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
                        <SelectTrigger className="h-12 bg-white/80 border-blue-200/50 rounded-2xl shadow-md">
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
                        className="text-blue-800 font-semibold"
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
                        <SelectTrigger className="h-12 bg-white/80 border-blue-200/50 rounded-2xl shadow-md">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="VND">VND (₫)</SelectItem>
                          <SelectItem value="USD">USD ($)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 pt-4">
                    <Button
                      onClick={() => handleSave("chung")}
                      disabled={isSaving}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl"
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
                      className="rounded-xl"
                    >
                      Khôi phục mặc định
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* SECURITY TAB */}
          <TabsContent value="security">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="rounded-3xl shadow-xl border-0 bg-gradient-to-br from-white to-green-50">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-transparent bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text font-bold">
                        Cài đặt bảo mật
                      </CardTitle>
                      <p className="text-green-700/80 mt-1">
                        Cấu hình xác thực, phiên làm việc và các chính sách bảo
                        mật
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-white/60 rounded-2xl shadow-md">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                        <Smartphone className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <Label
                          htmlFor="twoFactorAuth"
                          className="text-green-800 font-semibold"
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
                  <Separator />
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label
                        htmlFor="sessionTimeout"
                        className="text-green-800 font-semibold flex items-center"
                      >
                        <Clock className="w-4 h-4 mr-2" />
                        Thời gian hết phiên (phút)
                      </Label>
                      <Input
                        id="sessionTimeout"
                        type="number"
                        value={settings.security.sessionTimeout}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            security: {
                              ...prev.security,
                              sessionTimeout: parseInt(e.target.value),
                            },
                          }))
                        }
                        disabled={isSaving}
                        className="bg-white/80 border-green-200/50 rounded-2xl shadow-md focus:ring-2 focus:ring-green-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="maxLoginAttempts"
                        className="text-green-800 font-semibold flex items-center"
                      >
                        <Lock className="w-4 h-4 mr-2" />
                        Số lần đăng nhập tối đa
                      </Label>
                      <Input
                        id="maxLoginAttempts"
                        type="number"
                        value={settings.security.maxLoginAttempts}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            security: {
                              ...prev.security,
                              maxLoginAttempts: parseInt(e.target.value),
                            },
                          }))
                        }
                        disabled={isSaving}
                        className="bg-white/80 border-green-200/50 rounded-2xl shadow-md focus:ring-2 focus:ring-green-200"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/60 rounded-2xl shadow-md">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                        <Key className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <Label
                          htmlFor="requireStrongPasswords"
                          className="text-green-800 font-semibold"
                        >
                          Yêu cầu mật khẩu mạnh
                        </Label>
                        <p className="text-sm text-green-700/70">
                          Bắt buộc mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ
                          hoa, chữ thường và số
                        </p>
                      </div>
                    </div>
                    <Switch
                      id="requireStrongPasswords"
                      checked={settings.security.requireStrongPasswords}
                      onCheckedChange={(checked) =>
                        setSettings((prev) => ({
                          ...prev,
                          security: {
                            ...prev.security,
                            requireStrongPasswords: checked,
                          },
                        }))
                      }
                      disabled={isSaving}
                    />
                  </div>
                  <div className="flex items-center space-x-4 pt-4">
                    <Button
                      onClick={() => handleSave("bảo mật")}
                      disabled={isSaving}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl"
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
                      className="rounded-xl"
                    >
                      Khôi phục mặc định
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* NOTIFICATIONS TAB */}
          <TabsContent value="notifications">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="rounded-3xl shadow-xl border-0 bg-gradient-to-br from-white to-orange-50">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 shadow-lg">
                      <Bell className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-transparent bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text font-bold">
                        Cài đặt thông báo
                      </CardTitle>
                      <p className="text-orange-700/80 mt-1">
                        Quản lý các loại thông báo và phương thức gửi
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {Object.entries({
                    emailNotifications: {
                      label: "Thông báo email",
                      desc: "Nhận thông báo qua email",
                      icon: Mail,
                    },
                    orderNotifications: {
                      label: "Thông báo đơn hàng mới",
                      desc: "Thông báo khi có đơn hàng mới",
                      icon: Target,
                    },
                    userRegistrations: {
                      label: "Thông báo đăng ký mới",
                      desc: "Thông báo khi có người dùng đăng ký",
                      icon: Users,
                    },
                    systemAlerts: {
                      label: "Cảnh báo hệ thống",
                      desc: "Cảnh báo về tình trạng hệ thống",
                      icon: AlertTriangle,
                    },
                    marketingEmails: {
                      label: "Email marketing",
                      desc: "Gửi email quảng cáo đến khách hàng",
                      icon: Star,
                    },
                  }).map(([key, config], index) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-white/60 rounded-2xl shadow-md hover:shadow-lg transition-all"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                          <config.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <Label className="text-orange-800 font-semibold">
                            {config.label}
                          </Label>
                          <p className="text-sm text-orange-700/70">
                            {config.desc}
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={
                          settings.notifications[
                            key as keyof typeof settings.notifications
                          ]
                        }
                        onCheckedChange={(checked) =>
                          setSettings((prev) => ({
                            ...prev,
                            notifications: {
                              ...prev.notifications,
                              [key]: checked,
                            },
                          }))
                        }
                        disabled={isSaving}
                      />
                    </motion.div>
                  ))}
                  <div className="flex items-center space-x-4 pt-4">
                    <Button
                      onClick={() => handleSave("thông báo")}
                      disabled={isSaving}
                      className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 rounded-xl"
                    >
                      {isSaving ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Lưu cài đặt thông báo
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleReset("thông báo")}
                      disabled={isSaving}
                      className="rounded-xl"
                    >
                      Khôi phục mặc định
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* APPEARANCE TAB */}
          <TabsContent value="appearance">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="rounded-3xl shadow-xl border-0 bg-gradient-to-br from-white to-purple-50">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600 shadow-lg">
                      <Palette className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text font-bold">
                        Cài đặt giao diện
                      </CardTitle>
                      <p className="text-purple-700/80 mt-1">
                        Tùy chỉnh màu sắc, theme và giao diện hiển thị
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label
                        htmlFor="primaryColor"
                        className="text-purple-800 font-semibold"
                      >
                        Màu chính
                      </Label>
                      <div className="flex items-center space-x-3 p-3 bg-white/60 rounded-2xl shadow-md">
                        <input
                          type="color"
                          id="primaryColor"
                          value={settings.appearance.primaryColor}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              appearance: {
                                ...prev.appearance,
                                primaryColor: e.target.value,
                              },
                            }))
                          }
                          className="w-12 h-12 border-2 border-white rounded-xl shadow-md"
                          disabled={isSaving}
                        />
                        <Input
                          value={settings.appearance.primaryColor}
                          readOnly
                          className="bg-white/80 border-purple-200/50 rounded-xl"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="secondaryColor"
                        className="text-purple-800 font-semibold"
                      >
                        Màu phụ
                      </Label>
                      <div className="flex items-center space-x-3 p-3 bg-white/60 rounded-2xl shadow-md">
                        <input
                          type="color"
                          id="secondaryColor"
                          value={settings.appearance.secondaryColor}
                          onChange={(e) =>
                            setSettings((prev) => ({
                              ...prev,
                              appearance: {
                                ...prev.appearance,
                                secondaryColor: e.target.value,
                              },
                            }))
                          }
                          className="w-12 h-12 border-2 border-white rounded-xl shadow-md"
                          disabled={isSaving}
                        />
                        <Input
                          value={settings.appearance.secondaryColor}
                          readOnly
                          className="bg-white/80 border-purple-200/50 rounded-xl"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="theme"
                      className="text-purple-800 font-semibold"
                    >
                      Chủ đề
                    </Label>
                    <Select
                      value={settings.appearance.theme}
                      onValueChange={(value) =>
                        setSettings((prev) => ({
                          ...prev,
                          appearance: { ...prev.appearance, theme: value },
                        }))
                      }
                      disabled={isSaving}
                    >
                      <SelectTrigger className="h-12 bg-white/80 border-purple-200/50 rounded-2xl shadow-md">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">
                          <div className="flex items-center">
                            <Sun className="w-4 h-4 mr-2" />
                            Sáng
                          </div>
                        </SelectItem>
                        <SelectItem value="dark">
                          <div className="flex items-center">
                            <Moon className="w-4 h-4 mr-2" />
                            Tối
                          </div>
                        </SelectItem>
                        <SelectItem value="system">
                          <div className="flex items-center">
                            <Laptop className="w-4 h-4 mr-2" />
                            Theo hệ thống
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-4 pt-4">
                    <Button
                      onClick={() => handleSave("giao diện")}
                      disabled={isSaving}
                      className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 rounded-xl"
                    >
                      {isSaving ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Lưu cài đặt giao diện
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleReset("giao diện")}
                      disabled={isSaving}
                      className="rounded-xl"
                    >
                      Khôi phục mặc định
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* INTEGRATIONS TAB */}
          <TabsContent value="integrations">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="rounded-3xl shadow-xl border-0 bg-gradient-to-br from-white to-indigo-50">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg">
                      <Database className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text font-bold">
                        Tích hợp bên thứ ba
                      </CardTitle>
                      <p className="text-indigo-700/80 mt-1">
                        Cấu hình API keys và kết nối với các dịch vụ khác
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {Object.entries({
                    googleAnalytics: {
                      label: "Google Analytics Tracking ID",
                      icon: BarChart3,
                    },
                    facebookPixel: { label: "Facebook Pixel ID", icon: Target },
                    mailchimp: { label: "Mailchimp API Key", icon: Mail },
                    stripe: { label: "Stripe Secret Key", icon: CreditCard },
                    paypal: { label: "PayPal Client ID", icon: Crown },
                  }).map(([key, config], index) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="space-y-2"
                    >
                      <Label
                        htmlFor={key}
                        className="text-indigo-800 font-semibold flex items-center"
                      >
                        <config.icon className="w-4 h-4 mr-2" />
                        {config.label}
                      </Label>
                      <Input
                        id={key}
                        type="password"
                        placeholder={`Nhập ${config.label.toLowerCase()}`}
                        value={
                          settings.integrations[
                            key as keyof typeof settings.integrations
                          ]
                        }
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            integrations: {
                              ...prev.integrations,
                              [key]: e.target.value,
                            },
                          }))
                        }
                        disabled={isSaving}
                        className="bg-white/80 border-indigo-200/50 rounded-2xl shadow-md focus:ring-2 focus:ring-indigo-200"
                      />
                    </motion.div>
                  ))}
                  <div className="flex items-center space-x-4 pt-4">
                    <Button
                      onClick={() => handleSave("tích hợp")}
                      disabled={isSaving}
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-xl"
                    >
                      {isSaving ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Lưu cài đặt tích hợp
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleReset("tích hợp")}
                      disabled={isSaving}
                      className="rounded-xl"
                    >
                      Khôi phục mặc định
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
