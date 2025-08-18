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
import { useAuth } from "@/contexts/AuthContext";
import { useNavigationLoading } from "@/hooks/useNavigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getInitials } from "@/lib/auth";
import { motion, AnimatePresence } from "framer-motion";
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
  Star,
  Image,
  Shield,
  Database,
  LogOut,
  User,
  Crown,
  TrendingUp,
  MessageCircle,
  ChevronRight,
  Sparkles,
  Zap,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [searchQuery, setSearchQuery] = useState("");

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

  // **🎨 Sidebar items với gradient vàng cam hồng**
  const sidebarItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin",
      count: null,
    },
    {
      title: "Sản phẩm",
      icon: Package,
      href: "/admin/products",
      count: 31,
    },
    {
      title: "Đơn hàng",
      icon: ShoppingCart,
      href: "/admin/orders",
      count: 18,
    },
    {
      title: "Blog",
      icon: FileText,
      href: "/admin/blog",
      count: null,
    },
    {
      title: "Người dùng",
      icon: Users,
      href: "/admin/users",
      count: 9,
    },
    {
      title: "Live Chat",
      icon: MessageCircle,
      href: "/admin/chat",
      count: 2,
    },
    // **🎯 NEW: Discount Management**
    {
      title: "Mã giảm giá",
      icon: Percent,
      href: "/admin/discounts",
      count: 5,
    },
    // **💰 NEW: Payment Management**
    {
      title: "Thanh toán",
      icon: CreditCard,
      href: "/admin/payments",
      count: null,
    },
    // **📧 NEW: Email Marketing**
    {
      title: "Email Marketing",
      icon: Mail,
      href: "/admin/email-marketing",
      count: null,
    },
    // **🔔 NEW: Notifications**
    {
      title: "Thông báo",
      icon: Bell,
      href: "/admin/notifications",
      count: 12,
    },
    // **📊 NEW: Reviews & Ratings**
    {
      title: "Đánh giá",
      icon: Star,
      href: "/admin/reviews",
      count: 23,
    },
    // **🎨 NEW: Content Management**
    {
      title: "Nội dung",
      icon: Image,
      href: "/admin/content",
      count: null,
    },
    // **🔐 NEW: Role & Permissions**
    {
      title: "Phân quyền",
      icon: Shield,
      href: "/admin/roles",
      count: null,
    },
    // **📈 Enhanced Analytics**
    {
      title: "Thống kê",
      icon: BarChart3,
      href: "/admin/analytics",
      count: null,
    },
    {
      title: "Báo cáo",
      icon: TrendingUp,
      href: "/admin/reports",
      count: null,
    },
    // **🔧 NEW: System Logs**
    {
      title: "Nhật ký hệ thống",
      icon: FileText,
      href: "/admin/logs",
      count: null,
    },
    // **🔄 NEW: Backup & Restore**
    {
      title: "Sao lưu",
      icon: Database,
      href: "/admin/backup",
      count: null,
    },
    {
      title: "Cài đặt",
      icon: Settings,
      href: "/admin/settings",
      count: null,
    },
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
            className="fixed left-0 top-0 h-full border-r border-orange-200/50 z-50 transition-all duration-300 flex flex-col overflow-hidden shadow-2xl"
            style={{
              width: sidebarOpen ? 280 : 80,
              background:
                "linear-gradient(135deg, #ffd399 0%, #fff3e6 20%, #ffffff 50%, #f8e1ef 80%, #fce4ec 100%)",
              backdropFilter: "blur(20px)",
            }}
          >
            {/* **🏠 Header cố định với gradient** */}
            <div className="flex-shrink-0 p-4 border-b border-orange-200/30">
              <div
                className={`flex items-center ${sidebarOpen ? "space-x-3" : "justify-center"}`}
              >
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  className="relative flex items-center justify-center flex-shrink-0 w-12 h-12 transition-all shadow-xl cursor-pointer bg-gradient-to-br from-orange-400 via-amber-300 to-pink-400 rounded-2xl hover:shadow-2xl group"
                >
                  <span className="text-lg font-bold text-white">TM</span>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
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

              {/* Close button for mobile */}
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

            {/* **🎯 Navigation với enhanced styling** */}
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
                            whileHover={{ scale: 1.02, x: sidebarOpen ? 4 : 0 }}
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
                            {/* **🎯 Icon container - fix hover khi thu gọn** */}
                            <div
                              className={`flex items-center justify-center rounded-xl transition-all duration-200 ${
                                isActive
                                  ? "bg-white/40 shadow-sm"
                                  : "bg-white/60 group-hover:bg-white/80 group-hover:shadow-sm"
                              } w-10 h-10 flex-shrink-0`}
                            >
                              <Icon className="w-5 h-5" />
                            </div>

                            {/* **📝 Title and count - chỉ hiện khi sidebar mở** */}
                            {sidebarOpen && (
                              <div className="flex items-center justify-between w-full min-w-0 ml-3">
                                <motion.span
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  className="font-semibold truncate duration-200 animate-in slide-in-from-left"
                                >
                                  {item.title}
                                </motion.span>

                                {/* **🏷️ Count badges** */}
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

                                  {/* **🎯 Hover arrow** */}
                                  {!isActive && (
                                    <ChevronRight className="w-3 h-3 opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
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

            {/* **🏠 Footer cố định với enhanced styling** */}
            <div className="flex-shrink-0 p-3 border-t border-orange-200/30">
              <Link to="/">
                <motion.div
                  whileHover={{ scale: 1.02, x: sidebarOpen ? 4 : 0 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center p-3 text-orange-800/80 transition-all rounded-2xl hover:text-orange-900 hover:bg-gradient-to-r hover:from-orange-100/80 hover:to-pink-100/80 hover:shadow-md group"
                  style={{
                    justifyContent: sidebarOpen ? "flex-start" : "center",
                  }}
                >
                  <div className="flex-shrink-0 p-2 bg-white/60 rounded-xl group-hover:bg-white/80 group-hover:shadow-sm transition-all">
                    <Home className="w-5 h-5" />
                  </div>
                  {sidebarOpen && (
                    <>
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="font-semibold truncate duration-200 animate-in slide-in-from-left ml-3"
                      >
                        Về trang chủ
                      </motion.span>
                      <ChevronRight className="w-3 h-3 ml-auto opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
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
      <Sidebar />

      {/* **🎨 Main Content với enhanced styling** */}
      <div
        className="transition-all duration-300"
        style={{ marginLeft: isMobile ? 0 : sidebarOpen ? 280 : 80 }}
      >
        {/* **✨ Enhanced Top Bar với gradient** */}
        {/* **✨ Enhanced Top Bar với gradient đẹp** */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-30 backdrop-blur-xl shadow-xl border-b border-orange-200/30"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,248,235,0.98) 30%, rgba(255,243,230,0.98) 70%, rgba(252,228,236,0.98) 100%)",
          }}
        >
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center min-w-0 space-x-4">
              {/* **🔄 Enhanced Menu Button** */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="flex-shrink-0 p-3 bg-gradient-to-r from-white/90 to-orange-50/90 hover:from-white hover:to-orange-100/90 shadow-lg hover:shadow-xl transition-all rounded-2xl group border border-orange-200/50"
                >
                  <motion.div
                    animate={{ rotate: sidebarOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, type: "spring" }}
                  >
                    <Menu className="w-5 h-5 text-orange-700 transition-colors group-hover:text-orange-900" />
                  </motion.div>
                </Button>
              </motion.div>

              {/* **🎯 Enhanced Header Text** */}
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
                  <p className="text-sm truncate text-orange-700/80 mt-1">
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
              {/* **🔍 Enhanced Search với gradient** */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="items-center hidden space-x-2 md:flex"
              >
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-pink-400/20 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  <div className="relative flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-white/95 to-orange-50/95 backdrop-blur-xl border border-orange-200/50 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:from-white group-hover:to-orange-50">
                    <Search className="flex-shrink-0 w-5 h-5 text-orange-600 group-hover:text-orange-800 transition-colors" />
                    <Input
                      type="text"
                      placeholder="Tìm kiếm..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-64 text-sm bg-transparent border-none outline-none placeholder:text-orange-500/60 text-orange-800 font-medium"
                    />
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="p-2 rounded-full bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-md"
                    >
                      <Zap className="w-4 h-4" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>

              {/* **✨ Enhanced Quick Actions** */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="relative overflow-hidden flex-shrink-0 px-6 py-3 transition-all shadow-lg bg-gradient-to-r from-orange-500 via-amber-500 to-pink-600 hover:from-orange-600 hover:via-amber-600 hover:to-pink-700 hover:scale-105 hover:shadow-xl rounded-3xl group border border-orange-300/50"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <motion.div
                    className="flex items-center space-x-2"
                    whileHover={{ x: 2 }}
                  >
                    <Plus className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
                    <span className="font-semibold">Thêm mới</span>
                    <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  </motion.div>
                </Button>
              </motion.div>

              {/* **🔔 Enhanced Notifications** */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="lg"
                  className="relative flex-shrink-0 p-3 bg-gradient-to-r from-white/90 to-orange-50/90 hover:from-white hover:to-orange-100/90 shadow-lg hover:shadow-xl transition-all rounded-2xl group border border-orange-200/50"
                >
                  <Bell className="w-6 h-6 text-orange-600 transition-colors group-hover:text-orange-800" />
                  {notifications > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white"
                    >
                      <span className="text-xs font-bold text-white">
                        {notifications}
                      </span>
                      <motion.div
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 to-pink-600"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </motion.div>
                  )}
                </Button>
              </motion.div>

              {/* **🌙 Enhanced Theme Toggle** */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="p-3 bg-gradient-to-r from-white/90 to-orange-50/90 hover:from-white hover:to-orange-100/90 shadow-lg hover:shadow-xl transition-all rounded-2xl border border-orange-200/50">
                  <ThemeToggle />
                </div>
              </motion.div>

              {/* **👤 Enhanced User Menu** */}
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
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-pink-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300" />
                      <Avatar className="w-12 h-12 transition-all cursor-pointer shadow-lg hover:shadow-xl border-3 border-white/80">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback className="text-white bg-gradient-to-r from-orange-500 via-amber-600 to-pink-600 font-bold text-lg">
                          {user ? getInitials(user.name) : "A"}
                        </AvatarFallback>
                      </Avatar>
                      <motion.div
                        className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white"
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
                    className="w-80 border border-orange-200/50 shadow-2xl rounded-2xl"
                    align="end"
                    forceMount
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,243,230,0.98) 50%, rgba(248,225,239,0.98) 100%)",
                      backdropFilter: "blur(20px)",
                    }}
                  >
                    <DropdownMenuLabel className="font-normal p-6">
                      <div className="flex flex-col space-y-4">
                        <div className="flex items-center space-x-4">
                          <Avatar className="w-16 h-16 shadow-xl border-3 border-white/80">
                            <AvatarImage src={user?.avatar} />
                            <AvatarFallback className="text-white bg-gradient-to-r from-orange-500 to-pink-600 font-bold text-xl">
                              {user ? getInitials(user.name) : "A"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3">
                              <p className="text-lg font-bold leading-none truncate text-orange-900">
                                {user?.name}
                              </p>
                              <Badge className="flex-shrink-0 px-3 py-1 text-xs font-bold text-orange-800 bg-gradient-to-r from-yellow-200 to-amber-300 border-0 shadow-sm rounded-full">
                                <Crown className="w-3 h-3 mr-1" />
                                Admin
                              </Badge>
                            </div>
                            <p className="text-sm leading-none truncate text-orange-700/80 mt-2">
                              {user?.email}
                            </p>
                          </div>
                        </div>
                        <div className="p-3 bg-gradient-to-r from-orange-100/80 to-pink-100/80 rounded-xl border border-orange-200/50">
                          <p className="text-sm text-center text-orange-800 font-medium">
                            🚀 Dashboard Performance:{" "}
                            <span className="text-green-700 font-bold">
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
                          className="cursor-pointer p-4 rounded-xl hover:bg-gradient-to-r hover:from-orange-100/80 hover:to-pink-100/80 transition-all group"
                        >
                          <User className="flex-shrink-0 w-5 h-5 mr-4 text-orange-700 group-hover:text-orange-900" />
                          <span className="font-semibold text-orange-800 group-hover:text-orange-900">
                            Hồ sơ cá nhân
                          </span>
                          <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-all" />
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild>
                        <Link
                          to="/admin/settings"
                          className="cursor-pointer p-4 rounded-xl hover:bg-gradient-to-r hover:from-orange-100/80 hover:to-pink-100/80 transition-all group"
                        >
                          <Settings className="flex-shrink-0 w-5 h-5 mr-4 text-orange-700 group-hover:text-orange-900" />
                          <span className="font-semibold text-orange-800 group-hover:text-orange-900">
                            Cài đặt
                          </span>
                          <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-all" />
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild>
                        <Link
                          to="/admin/analytics"
                          className="cursor-pointer p-4 rounded-xl hover:bg-gradient-to-r hover:from-orange-100/80 hover:to-pink-100/80 transition-all group"
                        >
                          <BarChart3 className="flex-shrink-0 w-5 h-5 mr-4 text-orange-700 group-hover:text-orange-900" />
                          <span className="font-semibold text-orange-800 group-hover:text-orange-900">
                            Thống kê
                          </span>
                          <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-all" />
                        </Link>
                      </DropdownMenuItem>
                    </div>

                    <DropdownMenuSeparator className="bg-orange-200/50" />

                    <div className="p-3">
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="cursor-pointer p-4 text-red-600 hover:text-red-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 rounded-xl transition-all group"
                      >
                        <LogOut className="flex-shrink-0 w-5 h-5 mr-4" />
                        <span className="font-semibold">Đăng xuất</span>
                        <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-all" />
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
            {/* **🍞 Enhanced Breadcrumb** */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center space-x-2 p-4 bg-gradient-to-r from-white/90 to-orange-50/90 backdrop-blur-xl border border-orange-200/50 rounded-2xl shadow-lg"
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

            {/* **📋 Content** */}
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
