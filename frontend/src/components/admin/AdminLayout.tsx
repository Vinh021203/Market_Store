import React, { useState, useEffect } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigationLoading } from "@/hooks/useNavigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getInitials } from "@/lib/auth";
import { motion, AnimatePresence } from "framer-motion";
import {
  subscribeToNotifications,
  markAsRead,
  clearAllNotifications,
  type Notification,
} from "@/lib/notifications";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  BarChart3,
  FileText,
  Home,
  Menu,
  X,
  Search,
  Plus,
  Percent,
  CreditCard,
  Mail,
  Bell,
  LogOut,
  User,
  Crown,
  TrendingUp,
  MessageCircle,
  ChevronRight,
  Sparkles,
  Zap,
  Check,
  Trash2,
  Clock,
  ShoppingBag,
  UserPlus,
  MessageSquare,
  Download,
  AlertCircle,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

// 🎨 Realtime Toast Component
const RealtimeToast = ({
  notification,
  onClose,
}: {
  notification: Notification;
  onClose: () => void;
}) => {
  const iconMap = {
    order: { icon: ShoppingBag, color: "from-green-400 to-emerald-600" },
    user: { icon: UserPlus, color: "from-blue-400 to-indigo-600" },
    comment: { icon: MessageSquare, color: "from-purple-400 to-pink-600" },
    payment: { icon: CreditCard, color: "from-orange-400 to-red-600" },
    download: { icon: Download, color: "from-cyan-400 to-blue-600" },
    system: { icon: AlertCircle, color: "from-gray-400 to-slate-600" },
  };

  const { icon: Icon, color } = iconMap[notification.type];

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.8 }}
      className="relative p-5 overflow-hidden border shadow-2xl w-96 bg-gradient-to-br from-white/95 via-orange-50/95 to-pink-50/95 backdrop-blur-xl border-orange-200/50 rounded-3xl"
    >
      <motion.div
        className="absolute inset-0 opacity-10"
        animate={{
          background: [
            "radial-gradient(circle at 0% 0%, #f97316 0%, transparent 50%)",
            "radial-gradient(circle at 100% 100%, #ec4899 0%, transparent 50%)",
            "radial-gradient(circle at 0% 0%, #f97316 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      <div className="relative flex items-start space-x-4">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
          className={`flex-shrink-0 w-14 h-14 flex items-center justify-center rounded-2xl bg-gradient-to-br ${color} shadow-lg`}
        >
          <Icon className="text-white w-7 h-7" />
        </motion.div>

        <div className="flex-1 min-w-0">
          <h4 className="text-lg font-bold text-transparent bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text">
            {notification.title}
          </h4>
          <p className="mt-1 text-sm text-orange-700/80">
            {notification.message}
          </p>
          <div className="flex items-center mt-3 space-x-2 text-xs text-orange-600/70">
            <Clock className="w-3 h-3" />
            <span>Vừa xong</span>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="flex-shrink-0 p-2 transition-all rounded-full hover:bg-orange-100/80"
        >
          <X className="w-4 h-4 text-orange-600" />
        </Button>
      </div>
    </motion.div>
  );
};

// 🔔 Notification Item Component
const NotificationItem = ({
  notification,
  onMarkAsRead,
  onDelete,
}: {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  const iconMap = {
    order: { icon: ShoppingBag, color: "bg-green-100 text-green-600" },
    user: { icon: UserPlus, color: "bg-blue-100 text-blue-600" },
    comment: { icon: MessageSquare, color: "bg-purple-100 text-purple-600" },
    payment: { icon: CreditCard, color: "bg-orange-100 text-orange-600" },
    download: { icon: Download, color: "bg-cyan-100 text-cyan-600" },
    system: { icon: AlertCircle, color: "bg-gray-100 text-gray-600" },
  };

  const { icon: Icon, color } = iconMap[notification.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={`p-4 rounded-2xl transition-all cursor-pointer group ${
        notification.read
          ? "bg-white/50 hover:bg-white/80"
          : "bg-gradient-to-r from-orange-50/80 to-pink-50/80 hover:from-orange-100/80 hover:to-pink-100/80"
      }`}
    >
      <div className="flex items-start space-x-3">
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-xl ${color} flex items-center justify-center`}
        >
          <Icon className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h5 className="text-sm font-semibold text-orange-900 truncate">
              {notification.title}
            </h5>
            {!notification.read && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-500 to-pink-600"
              />
            )}
          </div>
          <p className="mt-1 text-xs text-orange-700/70 line-clamp-2">
            {notification.message}
          </p>
          <div className="flex items-center mt-2 space-x-2 text-xs text-orange-600/60">
            <Clock className="w-3 h-3" />
            <span>
              {new Date(notification.created_at).toLocaleTimeString("vi-VN")}
            </span>
          </div>
        </div>

        <div className="flex flex-col flex-shrink-0 space-y-1 opacity-0 group-hover:opacity-100">
          {!notification.read && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMarkAsRead(notification.id)}
              className="p-1 rounded-lg hover:bg-orange-100"
            >
              <Check className="w-3 h-3 text-orange-600" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(notification.id)}
            className="p-1 rounded-lg hover:bg-red-100"
          >
            <Trash2 className="w-3 h-3 text-red-600" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // ✨ REALTIME NOTIFICATIONS STATE
  const [realtimeNotifications, setRealtimeNotifications] = useState<
    Notification[]
  >([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [toastNotification, setToastNotification] =
    useState<Notification | null>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useNavigationLoading();

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      const mobile = width < 768;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // 🔔 REALTIME NOTIFICATIONS SUBSCRIPTION
  useEffect(() => {
    const unsubscribe = subscribeToNotifications((newNotification) => {
      // Add to list
      setRealtimeNotifications((prev) => [newNotification, ...prev]);

      // Update count
      setUnreadCount((prev) => prev + 1);

      // Show toast
      setToastNotification(newNotification);
      setTimeout(() => setToastNotification(null), 5000);

      // Play sound (optional)
      playNotificationSound();
    });

    return unsubscribe;
  }, []);

  // Update unread count
  useEffect(() => {
    const count = realtimeNotifications.filter((n) => !n.read).length;
    setUnreadCount(count);
  }, [realtimeNotifications]);

  // 🔊 Notification sound
  const playNotificationSound = () => {
    try {
      const audio = new Audio("/notification.mp3");
      audio.volume = 0.3;
      audio.play().catch(() => {});
    } catch (error) {
      console.log("Could not play sound");
    }
  };

  // ✅ Mark as read
  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
    setRealtimeNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  // 🗑️ Delete notification
  const handleDeleteNotification = (id: string) => {
    setRealtimeNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // 🗑️ Clear all
  const handleClearAll = async () => {
    await clearAllNotifications();
    setRealtimeNotifications([]);
    setNotificationsOpen(false);
  };

  // **🎨 Sidebar items với gradient vàng cam hồng**
  const sidebarItems = [
    { title: "Dashboard", icon: LayoutDashboard, href: "/admin", count: null },
    { title: "Sản phẩm", icon: Package, href: "/admin/products", count: 31 },
    { title: "Đơn hàng", icon: ShoppingCart, href: "/admin/orders", count: 18 },
    { title: "Blog", icon: FileText, href: "/admin/blog", count: null },
    { title: "Người dùng", icon: Users, href: "/admin/users", count: 9 },
    { title: "Live Chat", icon: MessageCircle, href: "/admin/chat", count: 2 },
    {
      title: "Mã giảm giá",
      icon: Percent,
      href: "/admin/discounts",
      count: 5,
    },
    {
      title: "Thanh toán",
      icon: CreditCard,
      href: "/admin/payments",
      count: null,
    },
    {
      title: "Email Marketing",
      icon: Mail,
      href: "/admin/email-marketing",
      count: null,
    },
    {
      title: "Thông báo",
      icon: Bell,
      href: "/admin/notifications",
      count: 12,
    },
    {
      title: "Thống kê",
      icon: BarChart3,
      href: "/admin/analytics",
      count: null,
    },
    { title: "Báo cáo", icon: TrendingUp, href: "/admin/reports", count: null },
    {
      title: "Nhật ký hệ thống",
      icon: FileText,
      href: "/admin/logs",
      count: null,
    },
    { title: "Cài đặt", icon: Settings, href: "/admin/settings", count: null },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "👋 Đã đăng xuất",
        description: "Hẹn gặp lại bạn!",
      });
    } catch (error) {
      toast({
        title: "❌ Lỗi đăng xuất",
        description: "Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };

  // **🎨 Enhanced Sidebar với gradient vàng cam trắng hồng**
  const Sidebar = () => (
    <AnimatePresence>
      {(sidebarOpen || !isMobile) && (
        <>
          {/* Mobile Overlay */}
          {isMobile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* **🌟 Sidebar với gradient vàng cam trắng hồng** */}
          <motion.div
            initial={isMobile ? { x: -280 } : undefined}
            animate={{ x: 0 }}
            exit={isMobile ? { x: -280 } : undefined}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 z-50 flex flex-col h-full overflow-hidden transition-all duration-300 border-r shadow-2xl border-orange-200/50"
            style={{
              width: sidebarOpen ? 280 : 80,
              background:
                "linear-gradient(135deg, #ffd399 0%, #fff3e6 20%, #ffffff 50%, #f8e1ef 80%, #fce4ec 100%)",
              backdropFilter: "blur(20px)",
            }}
          >
            {/* Header */}
            <div className="flex-shrink-0 p-4 border-b border-orange-200/30">
              <div
                className={`flex items-center ${sidebarOpen ? "space-x-3" : "justify-center"}`}
              >
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  className="relative flex items-center justify-center flex-shrink-0 w-12 h-12 transition-all shadow-xl cursor-pointer bg-gradient-to-br from-orange-400 via-amber-300 to-pink-400 rounded-2xl hover:shadow-2xl group"
                >
                  <span className="text-lg font-bold text-white">TM</span>
                  <div className="absolute inset-0 transition-opacity opacity-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent group-hover:opacity-100" />
                </motion.div>

                {sidebarOpen && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="min-w-0 duration-200 animate-in slide-in-from-left"
                  >
                    <h1 className="text-lg font-bold text-transparent truncate bg-gradient-to-r from-orange-600 via-amber-600 to-pink-600 bg-clip-text">
                      Template Market
                    </h1>
                    <div className="flex items-center space-x-2">
                      <p className="text-xs text-orange-700/80">Admin Panel</p>
                      <Badge className="flex-shrink-0 px-2 py-0.5 text-xs font-semibold text-orange-800 bg-gradient-to-r from-yellow-200 to-amber-300 border-0 shadow-sm">
                        <Crown className="w-2 h-2 mr-1" />
                        Pro
                      </Badge>
                    </div>
                  </motion.div>
                )}
              </div>

              {isMobile && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(false)}
                  className="absolute p-1 text-orange-700 hover:text-orange-900 top-4 right-4 hover:bg-orange-100/50"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-hidden">
              <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-orange-300/50 scrollbar-track-transparent hover:scrollbar-thumb-orange-400/70">
                <nav className="p-3 space-y-1">
                  {sidebarItems.map((item, index) => {
                    const isActive = location.pathname === item.href;
                    const Icon = item.icon;

                    return (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <Link to={item.href}>
                          <motion.div
                            whileHover={{
                              scale: 1.02,
                              x: sidebarOpen ? 4 : 0,
                            }}
                            whileTap={{ scale: 0.98 }}
                            className={`relative flex items-center p-3 rounded-2xl transition-all duration-300 group ${
                              isActive
                                ? "bg-gradient-to-r from-orange-300 via-amber-200 to-pink-300 text-orange-900 shadow-lg shadow-orange-500/25 border border-orange-400/30"
                                : "text-orange-800/80 hover:text-orange-900 hover:bg-gradient-to-r hover:from-orange-100/80 hover:to-pink-100/80 hover:shadow-md"
                            }`}
                            style={{
                              justifyContent: sidebarOpen
                                ? "flex-start"
                                : "center",
                              minHeight: 48,
                            }}
                          >
                            <div
                              className={`flex items-center justify-center rounded-xl transition-all duration-200 ${
                                isActive
                                  ? "bg-white/40 shadow-sm"
                                  : "bg-white/60 group-hover:bg-white/80 group-hover:shadow-sm"
                              } w-10 h-10 flex-shrink-0`}
                            >
                              <Icon className="w-5 h-5" />
                            </div>

                            {sidebarOpen && (
                              <div className="flex items-center justify-between w-full min-w-0 ml-3">
                                <motion.span
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  className="font-semibold truncate duration-200 animate-in slide-in-from-left"
                                >
                                  {item.title}
                                </motion.span>

                                <div className="flex items-center space-x-2">
                                  {item.count && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      className={`flex-shrink-0 px-2 py-1 text-xs font-bold rounded-full ${
                                        isActive
                                          ? "bg-white/50 text-orange-900"
                                          : "bg-white shadow-sm text-orange-700"
                                      }`}
                                    >
                                      {item.count}
                                    </motion.div>
                                  )}

                                  {!isActive && (
                                    <ChevronRight className="w-3 h-3 transition-all opacity-0 group-hover:opacity-100 group-hover:translate-x-1" />
                                  )}
                                </div>
                              </div>
                            )}
                          </motion.div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 p-3 border-t border-orange-200/30">
              <Link to="/">
                <motion.div
                  whileHover={{ scale: 1.02, x: sidebarOpen ? 4 : 0 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center p-3 transition-all text-orange-800/80 rounded-2xl hover:text-orange-900 hover:bg-gradient-to-r hover:from-orange-100/80 hover:to-pink-100/80 hover:shadow-md group"
                  style={{
                    justifyContent: sidebarOpen ? "flex-start" : "center",
                  }}
                >
                  <div className="flex-shrink-0 p-2 transition-all bg-white/60 rounded-xl group-hover:bg-white/80 group-hover:shadow-sm">
                    <Home className="w-5 h-5" />
                  </div>
                  {sidebarOpen && (
                    <>
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="ml-3 font-semibold truncate duration-200 animate-in slide-in-from-left"
                      >
                        Về trang chủ
                      </motion.span>
                      <ChevronRight className="w-3 h-3 ml-auto transition-all opacity-0 group-hover:opacity-100 group-hover:translate-x-1" />
                    </>
                  )}
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-pink-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
      {/* 🎨 Toast Container - FIXED POSITION */}
      <div className="fixed top-6 right-6 z-[100] space-y-4">
        <AnimatePresence>
          {toastNotification && (
            <RealtimeToast
              notification={toastNotification}
              onClose={() => setToastNotification(null)}
            />
          )}
        </AnimatePresence>
      </div>

      <Sidebar />

      {/* **🎨 Main Content với enhanced styling** */}
      <div
        className="transition-all duration-300"
        style={{ marginLeft: isMobile ? 0 : sidebarOpen ? 280 : 80 }}
      >
        {/* **✨ Enhanced Top Bar với gradient đẹp** */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-30 border-b shadow-xl backdrop-blur-xl border-orange-200/30"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,248,235,0.98) 30%, rgba(255,243,230,0.98) 70%, rgba(252,228,236,0.98) 100%)",
          }}
        >
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center min-w-0 space-x-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="flex-shrink-0 p-3 transition-all border shadow-lg bg-gradient-to-r from-white/90 to-orange-50/90 hover:from-white hover:to-orange-100/90 hover:shadow-xl rounded-2xl group border-orange-200/50"
                >
                  <motion.div
                    animate={{ rotate: sidebarOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, type: "spring" }}
                  >
                    <Menu className="w-5 h-5 text-orange-700 transition-colors group-hover:text-orange-900" />
                  </motion.div>
                </Button>
              </motion.div>

              <div className="hidden min-w-0 md:block">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="min-w-0"
                >
                  <h2 className="text-2xl font-bold text-transparent truncate bg-gradient-to-r from-orange-600 via-amber-600 to-pink-600 bg-clip-text">
                    Bảng điều khiển quản trị
                  </h2>
                  <p className="mt-1 text-sm truncate text-orange-700/80">
                    Chào mừng trở lại,{" "}
                    <span className="font-semibold text-orange-800">
                      {user?.name}
                    </span>
                    <motion.span
                      animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                      transition={{
                        duration: 1,
                        delay: 0.5,
                        repeat: Infinity,
                        repeatDelay: 3,
                      }}
                      className="inline-block ml-1"
                    >
                      👋
                    </motion.span>
                  </p>
                </motion.div>
              </div>
            </div>

            <div className="flex items-center flex-shrink-0 space-x-4">
              {/* Search */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="items-center hidden space-x-2 md:flex"
              >
                <div className="relative group">
                  <div className="absolute inset-0 transition-all duration-500 opacity-0 bg-gradient-to-r from-orange-400/20 to-pink-400/20 rounded-3xl blur-lg group-hover:opacity-100" />
                  <div className="relative flex items-center px-6 py-3 space-x-3 transition-all duration-300 border shadow-lg bg-gradient-to-r from-white/95 to-orange-50/95 backdrop-blur-xl border-orange-200/50 rounded-3xl hover:shadow-xl group-hover:from-white group-hover:to-orange-50">
                    <Search className="flex-shrink-0 w-5 h-5 text-orange-600 transition-colors group-hover:text-orange-800" />
                    <Input
                      type="text"
                      placeholder="Tìm kiếm..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-64 text-sm font-medium text-orange-800 bg-transparent border-none outline-none placeholder:text-orange-500/60"
                    />
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="p-2 text-white rounded-full shadow-md bg-gradient-to-r from-orange-500 to-pink-600"
                    >
                      <Zap className="w-4 h-4" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* Add button */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="relative flex-shrink-0 px-6 py-3 overflow-hidden transition-all border shadow-lg bg-gradient-to-r from-orange-500 via-amber-500 to-pink-600 hover:from-orange-600 hover:via-amber-600 hover:to-pink-700 hover:scale-105 hover:shadow-xl rounded-3xl group border-orange-300/50"
                >
                  <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-white/20 to-transparent group-hover:opacity-100" />
                  <motion.div
                    className="flex items-center space-x-2"
                    whileHover={{ x: 2 }}
                  >
                    <Plus className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
                    <span className="font-semibold">Thêm mới</span>
                    <Sparkles className="w-4 h-4 transition-all duration-300 opacity-0 group-hover:opacity-100" />
                  </motion.div>
                </Button>
              </motion.div>

              {/* 🔔 NOTIFICATIONS POPOVER - REALTIME */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Popover
                  open={notificationsOpen}
                  onOpenChange={setNotificationsOpen}
                >
                  <PopoverTrigger asChild>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="ghost"
                        size="lg"
                        className="relative flex-shrink-0 p-3 transition-all border shadow-lg bg-gradient-to-r from-white/90 to-orange-50/90 hover:from-white hover:to-orange-100/90 hover:shadow-xl rounded-2xl group border-orange-200/50"
                      >
                        <Bell className="w-6 h-6 text-orange-600 transition-colors group-hover:text-orange-800" />
                        {unreadCount > 0 && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute flex items-center justify-center w-6 h-6 border-2 border-white rounded-full shadow-lg -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-600"
                          >
                            <span className="text-xs font-bold text-white">
                              {unreadCount > 99 ? "99+" : unreadCount}
                            </span>
                            <motion.div
                              className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 to-pink-600"
                              animate={{
                                scale: [1, 1.3, 1],
                                opacity: [1, 0.5, 1],
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                          </motion.div>
                        )}
                      </Button>
                    </motion.div>
                  </PopoverTrigger>
                  <PopoverContent
                    align="end"
                    className="p-0 border-0 shadow-2xl w-96 rounded-3xl"
                  >
                    <div className="p-0 overflow-hidden bg-gradient-to-br from-white/98 via-orange-50/98 to-pink-50/98 backdrop-blur-xl rounded-3xl">
                      {/* Header */}
                      <div className="flex items-center justify-between p-6 border-b border-orange-200/30">
                        <div>
                          <h3 className="text-lg font-bold text-transparent bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text">
                            Thông báo
                          </h3>
                          <p className="text-sm text-orange-700/70">
                            Bạn có {unreadCount} thông báo chưa đọc
                          </p>
                        </div>
                        {realtimeNotifications.length > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClearAll}
                            className="text-xs hover:bg-orange-100/50 rounded-xl"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Xóa tất cả
                          </Button>
                        )}
                      </div>

                      {/* Notifications List */}
                      <ScrollArea className="h-96">
                        <div className="p-4 space-y-2">
                          <AnimatePresence mode="popLayout">
                            {realtimeNotifications.length === 0 ? (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="py-12 text-center"
                              >
                                <Bell className="w-16 h-16 mx-auto mb-4 text-orange-400 opacity-50" />
                                <p className="text-sm font-medium text-orange-700/70">
                                  Chưa có thông báo mới
                                </p>
                              </motion.div>
                            ) : (
                              realtimeNotifications.map((notification) => (
                                <NotificationItem
                                  key={notification.id}
                                  notification={notification}
                                  onMarkAsRead={handleMarkAsRead}
                                  onDelete={handleDeleteNotification}
                                />
                              ))
                            )}
                          </AnimatePresence>
                        </div>
                      </ScrollArea>

                      {/* Footer */}
                      {realtimeNotifications.length > 0 && (
                        <div className="p-4 border-t border-orange-200/30">
                          <Link to="/admin/notifications">
                            <Button
                              variant="ghost"
                              className="w-full transition-all hover:bg-gradient-to-r hover:from-orange-100/80 hover:to-pink-100/80 rounded-2xl group"
                              onClick={() => setNotificationsOpen(false)}
                            >
                              <span className="font-semibold text-orange-800">
                                Xem tất cả thông báo
                              </span>
                              <ChevronRight className="w-4 h-4 ml-2 transition-all group-hover:translate-x-1" />
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </motion.div>

              {/* Theme toggle */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="p-1 transition-all border shadow-lg bg-gradient-to-r from-white/90 to-orange-50/90 hover:from-white hover:to-orange-100/90 hover:shadow-xl rounded-2xl border-orange-200/50">
                  <ThemeToggle />
                </div>
              </motion.div>

              {/* User menu (keeping your original dropdown) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative flex-shrink-0 w-12 h-12 p-0 transition-all rounded-2xl hover:scale-105 group"
                    >
                      <div className="absolute inset-0 transition-all duration-300 opacity-0 bg-gradient-to-r from-orange-400/20 to-pink-400/20 rounded-2xl group-hover:opacity-100" />
                      <Avatar className="w-12 h-12 transition-all shadow-lg cursor-pointer hover:shadow-xl border-3 border-white/80">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback className="text-lg font-bold text-white bg-gradient-to-r from-orange-500 via-amber-600 to-pink-600">
                          {user ? getInitials(user.name) : "A"}
                        </AvatarFallback>
                      </Avatar>
                      <motion.div
                        className="absolute flex items-center justify-center w-5 h-5 border-2 border-white rounded-full shadow-lg -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-orange-500"
                        animate={{
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "reverse",
                        }}
                      >
                        <Crown className="w-2.5 h-2.5 text-white" />
                      </motion.div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="border shadow-2xl w-80 border-orange-200/50 rounded-2xl"
                    align="end"
                    forceMount
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,243,230,0.98) 50%, rgba(248,225,239,0.98) 100%)",
                      backdropFilter: "blur(20px)",
                    }}
                  >
                    <DropdownMenuLabel className="p-6 font-normal">
                      <div className="flex flex-col space-y-4">
                        <div className="flex items-center space-x-4">
                          <Avatar className="w-16 h-16 shadow-xl border-3 border-white/80">
                            <AvatarImage src={user?.avatar} />
                            <AvatarFallback className="text-xl font-bold text-white bg-gradient-to-r from-orange-500 to-pink-600">
                              {user ? getInitials(user.name) : "A"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3">
                              <p className="text-lg font-bold leading-none text-orange-900 truncate">
                                {user?.name}
                              </p>
                              <Badge className="flex-shrink-0 px-3 py-1 text-xs font-bold text-orange-800 border-0 rounded-full shadow-sm bg-gradient-to-r from-yellow-200 to-amber-300">
                                <Crown className="w-3 h-3 mr-1" />
                                Admin
                              </Badge>
                            </div>
                            <p className="mt-2 text-sm leading-none truncate text-orange-700/80">
                              {user?.email}
                            </p>
                          </div>
                        </div>
                        <div className="p-3 border bg-gradient-to-r from-orange-100/80 to-pink-100/80 rounded-xl border-orange-200/50">
                          <p className="text-sm font-medium text-center text-orange-800">
                            🚀 Dashboard Performance:{" "}
                            <span className="font-bold text-green-700">
                              Excellent
                            </span>
                          </p>
                        </div>
                      </div>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator className="bg-orange-200/50" />

                    <div className="p-3 space-y-2">
                      <DropdownMenuItem asChild>
                        <Link
                          to="/profile"
                          className="p-4 transition-all cursor-pointer rounded-xl hover:bg-gradient-to-r hover:from-orange-100/80 hover:to-pink-100/80 group"
                        >
                          <User className="flex-shrink-0 w-5 h-5 mr-4 text-orange-700 group-hover:text-orange-900" />
                          <span className="font-semibold text-orange-800 group-hover:text-orange-900">
                            Hồ sơ cá nhân
                          </span>
                          <ChevronRight className="w-4 h-4 ml-auto transition-all opacity-0 group-hover:opacity-100" />
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild>
                        <Link
                          to="/admin/settings"
                          className="p-4 transition-all cursor-pointer rounded-xl hover:bg-gradient-to-r hover:from-orange-100/80 hover:to-pink-100/80 group"
                        >
                          <Settings className="flex-shrink-0 w-5 h-5 mr-4 text-orange-700 group-hover:text-orange-900" />
                          <span className="font-semibold text-orange-800 group-hover:text-orange-900">
                            Cài đặt
                          </span>
                          <ChevronRight className="w-4 h-4 ml-auto transition-all opacity-0 group-hover:opacity-100" />
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild>
                        <Link
                          to="/admin/analytics"
                          className="p-4 transition-all cursor-pointer rounded-xl hover:bg-gradient-to-r hover:from-orange-100/80 hover:to-pink-100/80 group"
                        >
                          <BarChart3 className="flex-shrink-0 w-5 h-5 mr-4 text-orange-700 group-hover:text-orange-900" />
                          <span className="font-semibold text-orange-800 group-hover:text-orange-900">
                            Thống kê
                          </span>
                          <ChevronRight className="w-4 h-4 ml-auto transition-all opacity-0 group-hover:opacity-100" />
                        </Link>
                      </DropdownMenuItem>
                    </div>

                    <DropdownMenuSeparator className="bg-orange-200/50" />

                    <div className="p-3">
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="p-4 text-red-600 transition-all cursor-pointer hover:text-red-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 rounded-xl group"
                      >
                        <LogOut className="flex-shrink-0 w-5 h-5 mr-4" />
                        <span className="font-semibold">Đăng xuất</span>
                        <ChevronRight className="w-4 h-4 ml-auto transition-all opacity-0 group-hover:opacity-100" />
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
            </div>
          </div>
        </motion.header>

        {/* **📄 Enhanced Page Content** */}
        <main className="p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Breadcrumb */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center p-4 space-x-2 border shadow-lg bg-gradient-to-r from-white/90 to-orange-50/90 backdrop-blur-xl border-orange-200/50 rounded-2xl"
            >
              <div className="flex items-center space-x-2 text-sm text-orange-700/80">
                <Home className="flex-shrink-0 w-4 h-4 text-orange-600" />
                <ChevronRight className="w-3 h-3" />
                <span className="font-semibold text-orange-700">Admin</span>
                <ChevronRight className="w-3 h-3" />
                <span className="font-bold text-transparent bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text">
                  {sidebarItems.find((item) => item.href === location.pathname)
                    ?.title || "Dashboard"}
                </span>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="duration-300 animate-in fade-in"
            >
              <Outlet />
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
