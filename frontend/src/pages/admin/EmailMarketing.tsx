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
import { motion, AnimatePresence } from "framer-motion";
import emailjs from "@emailjs/browser";
import {
  Mail,
  Send,
  Save,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  Users,
  FileText,
  Settings,
  Plus,
  Loader2,
  CheckCircle,
  XCircle,
  Sparkles,
  Heart,
  Gift,
  Crown,
  AlertTriangle,
  Info,
  RefreshCw,
  Search,
  Filter,
  MoreHorizontal,
  TrendingUp,
  Calendar,
  Clock,
  BarChart3,
  ArrowDown,
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

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  createdAt: string;
  lastUsed?: string;
}

interface EmailList {
  id: string;
  name: string;
  emails: string[];
  createdAt: string;
}

const EmailMarketing: React.FC = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [emailLists, setEmailLists] = useState<EmailList[]>([]);
  const [selectedTemplate, setSelectedTemplate] =
    useState<EmailTemplate | null>(null);
  const [selectedList, setSelectedList] = useState<EmailList | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [activeTab, setActiveTab] = useState<"templates" | "lists" | "send">(
    "templates",
  );
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "template" | "list">(
    "all",
  );
  const [toasts, setToasts] = useState<
    Array<{
      id: string;
      type: "success" | "error" | "info" | "warning";
      title: string;
      description?: string;
    }>
  >([]);

  // New template form
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    subject: "",
    content: "",
  });

  // New email list form
  const [newList, setNewList] = useState({
    name: "",
    emails: "",
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

  // Load data from localStorage on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Initialize EmailJS
        emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);

        const savedTemplates = localStorage.getItem("email-templates");
        const savedLists = localStorage.getItem("email-lists");

        if (savedTemplates) {
          setTemplates(JSON.parse(savedTemplates));
        }

        if (savedLists) {
          setEmailLists(JSON.parse(savedLists));
        }

        showToast(
          "success",
          "✅ Đã tải email marketing",
          `Tải thành công dữ liệu email marketing.`,
        );
      } catch {
        showToast(
          "error",
          "❌ Lỗi tải dữ liệu",
          "Không thể tải dữ liệu email marketing.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Save templates to localStorage
  const saveTemplates = (newTemplates: EmailTemplate[]) => {
    setTemplates(newTemplates);
    localStorage.setItem("email-templates", JSON.stringify(newTemplates));
  };

  // Save email lists to localStorage
  const saveEmailLists = (newLists: EmailList[]) => {
    setEmailLists(newLists);
    localStorage.setItem("email-lists", JSON.stringify(newLists));
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const savedTemplates = localStorage.getItem("email-templates");
      const savedLists = localStorage.getItem("email-lists");

      if (savedTemplates) {
        setTemplates(JSON.parse(savedTemplates));
      }

      if (savedLists) {
        setEmailLists(JSON.parse(savedLists));
      }

      showToast(
        "success",
        "🔄 Đã cập nhật",
        "Dữ liệu email marketing đã được làm mới.",
      );
    } catch {
      showToast("error", "❌ Lỗi cập nhật", "Không thể cập nhật dữ liệu.");
    }
    setRefreshing(false);
  };

  // Create new template
  const handleCreateTemplate = () => {
    if (!newTemplate.name || !newTemplate.subject || !newTemplate.content) {
      showToast(
        "error",
        "❌ Thiếu thông tin",
        "Vui lòng điền đầy đủ thông tin template",
      );
      return;
    }

    const template: EmailTemplate = {
      id: Date.now().toString(),
      name: newTemplate.name,
      subject: newTemplate.subject,
      content: newTemplate.content,
      createdAt: new Date().toISOString(),
    };

    saveTemplates([...templates, template]);
    setNewTemplate({ name: "", subject: "", content: "" });
    showToast(
      "success",
      "✅ Đã tạo template",
      "Template email đã được lưu thành công",
    );
  };

  // Create new email list
  const handleCreateList = () => {
    if (!newList.name || !newList.emails) {
      showToast(
        "error",
        "❌ Thiếu thông tin",
        "Vui lòng điền tên list và danh sách email",
      );
      return;
    }

    const emails = newList.emails
      .split(",")
      .map((email) => email.trim())
      .filter((email) => email && email.includes("@"));

    if (emails.length === 0) {
      showToast(
        "error",
        "❌ Email không hợp lệ",
        "Vui lòng nhập ít nhất 1 email hợp lệ",
      );
      return;
    }

    const list: EmailList = {
      id: Date.now().toString(),
      name: newList.name,
      emails,
      createdAt: new Date().toISOString(),
    };

    saveEmailLists([...emailLists, list]);
    setNewList({ name: "", emails: "" });
    showToast(
      "success",
      "✅ Đã tạo danh sách",
      `Đã lưu ${emails.length} email`,
    );
  };

  // Send email using EmailJS
  const handleSendEmail = async () => {
    if (!selectedTemplate || !selectedList) {
      showToast(
        "error",
        "❌ Chưa chọn đầy đủ",
        "Vui lòng chọn template và danh sách email",
      );
      return;
    }

    setIsSending(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      // Send email to each recipient
      for (const email of selectedList.emails) {
        try {
          await emailjs.send(
            import.meta.env.VITE_EMAILJS_SERVICE_ID,
            import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
            {
              to_email: email,
              subject: selectedTemplate.subject,
              message: selectedTemplate.content,
              from_name: "Template Market Admin",
            },
          );
          successCount++;
        } catch (error) {
          console.error(`Failed to send to ${email}:`, error);
          errorCount++;
        }
      }

      // Update template last used
      const updatedTemplates = templates.map((t) =>
        t.id === selectedTemplate.id
          ? { ...t, lastUsed: new Date().toISOString() }
          : t,
      );
      saveTemplates(updatedTemplates);

      if (successCount > 0) {
        showToast(
          "success",
          "✅ Gửi email thành công",
          `Đã gửi ${successCount}/${selectedList.emails.length} email`,
        );
      }
      if (errorCount > 0) {
        showToast(
          "warning",
          "⚠️ Một số email thất bại",
          `${errorCount} email không gửi được`,
        );
      }
    } catch (error) {
      console.error("Email sending failed:", error);
      showToast(
        "error",
        "❌ Gửi email thất bại",
        "Có lỗi xảy ra khi gửi email",
      );
    } finally {
      setIsSending(false);
    }
  };

  // Export data
  const handleExportData = () => {
    const data = {
      templates,
      emailLists,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `email-marketing-data-${new Date().toISOString().split("T")[0]}.json`;
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
        if (data.templates) saveTemplates(data.templates);
        if (data.emailLists) saveEmailLists(data.emailLists);
        showToast(
          "success",
          "📥 Đã nhập dữ liệu",
          "Dữ liệu đã được nhập thành công",
        );
      } catch (error) {
        showToast("error", "❌ Lỗi nhập file", "File không hợp lệ");
      }
    };
    reader.readAsText(file);
  };

  // Stats giống BlogManagement
  const stats = {
    totalTemplates: templates.length,
    totalLists: emailLists.length,
    totalEmails: emailLists.reduce((sum, l) => sum + l.emails.length, 0),
    sentEmails: templates.filter((t) => t.lastUsed).length,
    usedTemplates: templates.filter((t) => t.lastUsed).length,
    recentActivity: templates.filter(
      (t) =>
        new Date(t.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    ).length,
  };

  const statsCards = [
    {
      title: "Tổng template",
      value: stats.totalTemplates,
      icon: FileText,
      gradient: "from-orange-400 via-amber-500 to-pink-600",
      bgGradient: "from-orange-50/80 via-amber-50/80 to-pink-50/80",
      description: "Mẫu email",
      trend: "+5%",
    },
    {
      title: "Danh sách email",
      value: stats.totalLists,
      icon: Users,
      gradient: "from-green-400 via-emerald-500 to-teal-600",
      bgGradient: "from-green-50/80 via-emerald-50/80 to-teal-50/80",
      description: "Lists",
      trend: "+3%",
    },
    {
      title: "Tổng email",
      value: stats.totalEmails,
      icon: Mail,
      gradient: "from-yellow-400 via-orange-400 to-pink-400",
      bgGradient: "from-yellow-50/80 via-orange-50/80 to-pink-50/80",
      description: "Địa chỉ email",
      trend: "+12%",
    },
    {
      title: "Email đã gửi",
      value: stats.sentEmails,
      icon: Send,
      gradient: "from-purple-400 via-violet-500 to-indigo-600",
      bgGradient: "from-purple-50/80 via-violet-50/80 to-indigo-50/80",
      description: "Đã gửi",
      trend: "+8%",
    },
    {
      title: "Template đã dùng",
      value: stats.usedTemplates,
      icon: CheckCircle,
      gradient: "from-indigo-500 via-blue-500 to-cyan-500",
      bgGradient: "from-indigo-50/80 via-blue-50/80 to-cyan-50/80",
      description: "Đã sử dụng",
      trend: "+4%",
    },
    {
      title: "Hoạt động gần đây",
      value: stats.recentActivity,
      icon: TrendingUp,
      gradient: "from-pink-500 via-red-500 to-rose-500",
      bgGradient: "from-pink-50/80 via-red-50/80 to-rose-50/80",
      description: "7 ngày qua",
      trend: "+15%",
    },
  ];

  // Filter logic giống BlogManagement
  const filteredTemplates = templates.filter((template) => {
    const matchSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSearch;
  });

  const filteredLists = emailLists.filter((list) => {
    const matchSearch = list.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-pink-50">
      {/* 🌟 Floating Elements giống BlogManagement */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4"
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Mail className="w-8 h-8 text-orange-400 opacity-20" />
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
          <Heart className="text-amber-400 w-7 h-7 opacity-20" />
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
                <Mail className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-orange-600 via-amber-600 to-pink-600 bg-clip-text">
                  Email Marketing
                </h1>
                <p className="text-orange-700/80 mt-1 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Quản lý, xuất bản và gửi email marketing</span>
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
                    className={`flex items-center text-xs ${stat.trend.startsWith("+") ? "text-emerald-600" : "text-red-600"}`}
                  >
                    <div
                      className={`p-1 rounded-full mr-1 ${stat.trend.startsWith("+") ? "bg-emerald-100" : "bg-red-100"}`}
                    >
                      <TrendingUp
                        className={`w-2 h-2 ${!stat.trend.startsWith("+") ? "rotate-180" : ""}`}
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
                    className={`flex items-center text-xs ${stat.trend.startsWith("+") ? "text-emerald-600" : "text-red-600"}`}
                  >
                    <div
                      className={`p-1 rounded-full mr-1 ${stat.trend.startsWith("+") ? "bg-emerald-100" : "bg-red-100"}`}
                    >
                      <TrendingUp
                        className={`w-2 h-2 ${!stat.trend.startsWith("+") ? "rotate-180" : ""}`}
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
                      Tìm kiếm & lọc template, danh sách email
                    </p>
                  </div>
                </div>
                <Badge className="bg-gradient-to-r from-orange-200 to-pink-200 text-orange-800 border-0 shadow-sm">
                  {activeTab === "templates"
                    ? filteredTemplates.length
                    : activeTab === "lists"
                      ? filteredLists.length
                      : templates.length + emailLists.length}{" "}
                  kết quả
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
                      placeholder="Tìm kiếm template hoặc danh sách email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 text-sm bg-transparent border-none outline-none placeholder:text-orange-500/60 text-orange-800 font-medium"
                    />
                  </div>
                </motion.div>
                {/* Quick Filter Badges */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-orange-100 transition-colors"
                    onClick={() => setSearchQuery("newsletter")}
                  >
                    📧 Newsletter
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-orange-100 transition-colors"
                    onClick={() => setSearchQuery("promotion")}
                  >
                    🎯 Khuyến mãi
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-orange-100 transition-colors"
                    onClick={() => setSearchQuery("welcome")}
                  >
                    👋 Chào mừng
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-orange-100 transition-colors"
                    onClick={() => setSearchQuery("")}
                  >
                    🔄 Reset tất cả
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs & Content giống BlogManagement */}
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
                      Quản lý Email Marketing
                    </CardTitle>
                    <div className="flex gap-2 mt-2">
                      {[
                        { id: "templates", label: "Templates", icon: FileText },
                        { id: "lists", label: "Danh sách Email", icon: Users },
                        { id: "send", label: "Gửi Email", icon: Send },
                      ].map((tab) => (
                        <Button
                          key={tab.id}
                          variant={activeTab === tab.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setActiveTab(tab.id as any)}
                          className={`rounded-xl transition-all ${
                            activeTab === tab.id
                              ? "bg-gradient-to-r from-orange-500 to-pink-600 text-white"
                              : "bg-white/80 hover:bg-white"
                          }`}
                        >
                          <tab.icon className="w-4 h-4 mr-1" />
                          {tab.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Templates Tab */}
              {activeTab === "templates" && (
                <div className="space-y-6">
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50 rounded-3xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Plus className="w-5 h-5" />
                        Tạo Template Mới
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Input
                        placeholder="Tên template..."
                        value={newTemplate.name}
                        onChange={(e) =>
                          setNewTemplate({
                            ...newTemplate,
                            name: e.target.value,
                          })
                        }
                        className="rounded-2xl"
                      />
                      <Input
                        placeholder="Tiêu đề email..."
                        value={newTemplate.subject}
                        onChange={(e) =>
                          setNewTemplate({
                            ...newTemplate,
                            subject: e.target.value,
                          })
                        }
                        className="rounded-2xl"
                      />
                      <Textarea
                        placeholder="Nội dung email..."
                        value={newTemplate.content}
                        onChange={(e) =>
                          setNewTemplate({
                            ...newTemplate,
                            content: e.target.value,
                          })
                        }
                        className="rounded-2xl min-h-[200px]"
                      />
                      <Button
                        onClick={handleCreateTemplate}
                        className="rounded-2xl bg-gradient-to-r from-orange-500 to-pink-600"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Lưu Template
                      </Button>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AnimatePresence>
                      {filteredTemplates.map((template, index) => (
                        <motion.div
                          key={template.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.02 }}
                          className="p-4 bg-white rounded-3xl shadow-lg border border-purple-100 hover:shadow-xl transition-all"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="font-semibold text-purple-900">
                              {template.name}
                            </h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const updatedTemplates = templates.filter(
                                  (t) => t.id !== template.id,
                                );
                                saveTemplates(updatedTemplates);
                                showToast(
                                  "success",
                                  "🗑️ Đã xóa template",
                                  "Template đã được xóa",
                                );
                              }}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                          <p className="text-sm text-purple-700 mb-2">
                            {template.subject}
                          </p>
                          <p className="text-xs text-gray-600 mb-3 line-clamp-3">
                            {template.content}
                          </p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>
                              {new Date(template.createdAt).toLocaleDateString(
                                "vi-VN",
                              )}
                            </span>
                            {template.lastUsed && (
                              <Badge
                                variant="outline"
                                className="text-green-600"
                              >
                                Đã dùng
                              </Badge>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Empty State */}
                  {filteredTemplates.length === 0 && (
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
                        className="mb-6"
                      >
                        <FileText className="w-20 h-20 mx-auto text-orange-400/50" />
                      </motion.div>
                      <h3 className="mb-4 text-2xl font-bold text-transparent bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text">
                        Chưa có template email
                      </h3>
                      <p className="max-w-md mx-auto mb-6 text-orange-700/80 leading-relaxed">
                        Tạo template email đầu tiên để bắt đầu chiến dịch
                        marketing của bạn.
                      </p>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Email Lists Tab */}
              {activeTab === "lists" && (
                <div className="space-y-6">
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50 rounded-3xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Plus className="w-5 h-5" />
                        Tạo Danh Sách Email Mới
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Input
                        placeholder="Tên danh sách..."
                        value={newList.name}
                        onChange={(e) =>
                          setNewList({ ...newList, name: e.target.value })
                        }
                        className="rounded-2xl"
                      />
                      <Textarea
                        placeholder="Danh sách email (cách nhau bằng dấu phẩy)..."
                        value={newList.emails}
                        onChange={(e) =>
                          setNewList({ ...newList, emails: e.target.value })
                        }
                        className="rounded-2xl min-h-[150px]"
                      />
                      <Button
                        onClick={handleCreateList}
                        className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-600"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Lưu Danh Sách
                      </Button>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AnimatePresence>
                      {filteredLists.map((list, index) => (
                        <motion.div
                          key={list.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.02 }}
                          className="p-4 bg-white rounded-3xl shadow-lg border border-blue-100 hover:shadow-xl transition-all"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="font-semibold text-blue-900">
                              {list.name}
                            </h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const updatedLists = emailLists.filter(
                                  (l) => l.id !== list.id,
                                );
                                saveEmailLists(updatedLists);
                                showToast(
                                  "success",
                                  "🗑️ Đã xóa danh sách",
                                  "Danh sách email đã được xóa",
                                );
                              }}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                          <p className="text-sm text-blue-700 mb-3">
                            {list.emails.length} email
                          </p>
                          <div className="text-xs text-gray-500">
                            {new Date(list.createdAt).toLocaleDateString(
                              "vi-VN",
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Empty State */}
                  {filteredLists.length === 0 && (
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
                        className="mb-6"
                      >
                        <Users className="w-20 h-20 mx-auto text-orange-400/50" />
                      </motion.div>
                      <h3 className="mb-4 text-2xl font-bold text-transparent bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text">
                        Chưa có danh sách email
                      </h3>
                      <p className="max-w-md mx-auto mb-6 text-orange-700/80 leading-relaxed">
                        Tạo danh sách email đầu tiên để có thể gửi email
                        marketing.
                      </p>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Send Email Tab */}
              {activeTab === "send" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-green-50 rounded-3xl">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="w-5 h-5" />
                          Chọn Template
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {templates.length === 0 ? (
                          <p className="text-gray-500">Chưa có template nào</p>
                        ) : (
                          <ScrollArea className="h-[300px]">
                            <div className="space-y-2">
                              {templates.map((template) => (
                                <div
                                  key={template.id}
                                  className={`p-3 rounded-2xl cursor-pointer transition-all ${
                                    selectedTemplate?.id === template.id
                                      ? "bg-green-100 border-2 border-green-500"
                                      : "bg-gray-50 hover:bg-gray-100"
                                  }`}
                                  onClick={() => setSelectedTemplate(template)}
                                >
                                  <h4 className="font-medium">
                                    {template.name}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    {template.subject}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        )}
                      </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50 rounded-3xl">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="w-5 h-5" />
                          Chọn Danh Sách Email
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {emailLists.length === 0 ? (
                          <p className="text-gray-500">
                            Chưa có danh sách email nào
                          </p>
                        ) : (
                          <ScrollArea className="h-[300px]">
                            <div className="space-y-2">
                              {emailLists.map((list) => (
                                <div
                                  key={list.id}
                                  className={`p-3 rounded-2xl cursor-pointer transition-all ${
                                    selectedList?.id === list.id
                                      ? "bg-blue-100 border-2 border-blue-500"
                                      : "bg-gray-50 hover:bg-gray-100"
                                  }`}
                                  onClick={() => setSelectedList(list)}
                                >
                                  <h4 className="font-medium">{list.name}</h4>
                                  <p className="text-sm text-gray-600">
                                    {list.emails.length} email
                                  </p>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50 rounded-3xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Send className="w-5 h-5" />
                        Gửi Email Marketing
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedTemplate && selectedList ? (
                        <div className="space-y-4">
                          <div className="p-4 bg-gray-50 rounded-2xl">
                            <h4 className="font-medium mb-2">Xem trước:</h4>
                            <p>
                              <strong>Template:</strong> {selectedTemplate.name}
                            </p>
                            <p>
                              <strong>Tiêu đề:</strong>{" "}
                              {selectedTemplate.subject}
                            </p>
                            <p>
                              <strong>Gửi đến:</strong> {selectedList.name} (
                              {selectedList.emails.length} email)
                            </p>
                          </div>
                          <Button
                            onClick={handleSendEmail}
                            disabled={isSending}
                            className="w-full rounded-2xl bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700"
                          >
                            {isSending ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Đang gửi...
                              </>
                            ) : (
                              <>
                                <Send className="w-4 h-4 mr-2" />
                                Gửi Email Marketing
                              </>
                            )}
                          </Button>
                        </div>
                      ) : (
                        <div className="py-8 text-center text-gray-500">
                          <Mail className="w-16 h-16 mx-auto mb-4 opacity-50" />
                          <p className="text-lg font-medium mb-2">
                            Chưa chọn đủ thông tin
                          </p>
                          <p>
                            Vui lòng chọn template và danh sách email để gửi
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default EmailMarketing;
