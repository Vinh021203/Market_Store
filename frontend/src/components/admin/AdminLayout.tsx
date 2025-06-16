import React, { useState, useEffect } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
  Bell,
  Search,
  Plus,
  LogOut,
  User,
  Crown,
  TrendingUp,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [notifications, setNotifications] = useState(3);

  // This will trigger loading on route changes
  useNavigationLoading();

  // ✅ Enhanced responsive detection
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      const mobile = width < 768;

      setIsMobile(mobile);

      // Auto-collapse sidebar trên mobile
      if (mobile) {
        setSidebarOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // ✅ Sidebar items giữ nguyên design đẹp
  const sidebarItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Sản phẩm",
      icon: Package,
      href: "/admin/products",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      title: "Đơn hàng",
      icon: ShoppingCart,
      href: "/admin/orders",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      title: "Blog",
      icon: FileText,
      href: "/admin/blog",
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      title: "Người dùng",
      icon: Users,
      href: "/admin/users",
      gradient: "from-orange-500 to-red-500",
    },
    {
      title: "Thống kê",
      icon: BarChart3,
      href: "/admin/analytics",
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      title: "Báo cáo",
      icon: TrendingUp,
      href: "/admin/reports",
      gradient: "from-teal-500 to-cyan-500",
    },
    {
      title: "Cài đặt",
      icon: Settings,
      href: "/admin/settings",
      gradient: "from-gray-500 to-slate-500",
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

  // ✅ Sidebar Component giữ nguyên design đẹp của bạn
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
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* ✅ Sidebar với design đẹp của bạn */}
          <motion.div
            initial={isMobile ? { x: -280 } : undefined}
            animate={{ x: 0 }}
            exit={isMobile ? { x: -280 } : undefined}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`fixed left-0 top-0 h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950 border-r border-border/10 z-50 overflow-hidden transition-all duration-300`}
            style={{ width: sidebarOpen ? 280 : 80 }}
          >
            {/* Header - giữ nguyên design đẹp */}
            <div className="p-4 border-b border-border/10">
              <div className="flex items-center space-x-3">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center justify-center w-12 h-12 transition-transform shadow-lg cursor-pointer bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl"
                >
                  <span className="text-lg font-bold text-white">TM</span>
                </motion.div>
                {sidebarOpen && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-white duration-200 animate-in slide-in-from-left"
                  >
                    <h1 className="text-lg font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
                      Template Market
                    </h1>
                    <div className="flex items-center space-x-2">
                      <p className="text-xs text-white/70">Admin Panel</p>
                      <Badge className="px-1 py-0 text-xs text-yellow-300 bg-yellow-500/20">
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
                  className="absolute p-1 text-white top-4 right-4 hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Navigation - giữ nguyên design đẹp của bạn */}
            <nav className="p-4 space-y-2">
              {sidebarItems.map((item, index) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link to={item.href}>
                      <motion.div
                        whileHover={{ scale: 1.02, x: 4 }}
                        className={`relative flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                          isActive
                            ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg`
                            : "text-white/70 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute inset-0 duration-300 bg-white/10 rounded-xl animate-in fade-in"
                            initial={false}
                            transition={{
                              type: "spring",
                              damping: 25,
                              stiffness: 200,
                            }}
                          />
                        )}
                        <div className="relative z-10 flex items-center w-full space-x-3">
                          <Icon className="flex-shrink-0 w-5 h-5" />
                          {sidebarOpen && (
                            <motion.span
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="font-medium duration-200 animate-in slide-in-from-left"
                            >
                              {item.title}
                            </motion.span>
                          )}
                        </div>
                      </motion.div>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Footer - giữ nguyên design đẹp */}
            <div className="absolute bottom-4 left-4 right-4">
              <Link to="/">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center p-3 space-x-3 transition-all rounded-xl text-white/70 hover:text-white hover:bg-white/10"
                >
                  <Home className="w-5 h-5" />
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="font-medium duration-200 animate-in slide-in-from-left"
                    >
                      Về trang chủ
                    </motion.span>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
      <Sidebar />

      {/* Main Content */}
      <div
        className="transition-all duration-300"
        style={{ marginLeft: isMobile ? 0 : sidebarOpen ? 280 : 80 }}
      >
        {/* ✅ Enhanced Top Bar */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-30 duration-300 border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-border/50 animate-in slide-in-from-top"
        >
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 transition-transform hover:scale-105 group"
                >
                  <motion.div
                    animate={{ rotate: sidebarOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="transition-transform duration-200"
                  >
                    <Menu className="w-5 h-5 transition-colors group-hover:text-primary" />
                  </motion.div>
                </Button>
              </motion.div>

              <div className="hidden md:block">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-xl font-semibold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                    Bảng điều khiển quản trị
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Chào mừng trở lại, {user?.name} 👋
                  </p>
                </motion.div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="items-center hidden px-3 py-2 space-x-2 transition-all duration-300 rounded-lg md:flex bg-muted/50 hover:border-primary/20 group"
              >
                <Search className="w-4 h-4 transition-colors text-muted-foreground group-hover:text-primary" />
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="w-40 text-sm bg-transparent border-none outline-none placeholder:text-muted-foreground"
                />
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="sm"
                  className="transition-transform shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:scale-105 hover:shadow-xl group"
                >
                  <Plus className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:rotate-90" />
                  <span className="hidden sm:inline">Thêm mới</span>
                </Button>
              </motion.div>

              {/* Notifications */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative transition-transform hover:scale-105 hover:bg-primary/10 group"
                >
                  <Bell className="w-5 h-5 transition-colors group-hover:text-primary" />
                  {notifications > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute w-3 h-3 text-xs bg-red-500 rounded-full -top-1 -right-1 animate-pulse"
                    ></motion.span>
                  )}
                </Button>
              </motion.div>

              <ThemeToggle />

              {/* ✅ Enhanced User Menu */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative w-8 h-8 transition-transform duration-300 rounded-full hover:scale-105"
                    >
                      <Avatar className="w-8 h-8 transition-transform cursor-pointer hover:scale-105">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback className="text-white bg-gradient-to-r from-blue-500 to-purple-600">
                          {user ? getInitials(user.name) : "A"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                        <Crown className="w-1.5 h-1.5 text-white" />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium leading-none">
                            {user?.name}
                          </p>
                          <Badge className="text-xs text-yellow-800 bg-yellow-100">
                            <Crown className="w-2 h-2 mr-1" />
                            Admin
                          </Badge>
                        </div>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        <User className="w-4 h-4 mr-2" />
                        <span>Hồ sơ cá nhân</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link to="/admin/settings" className="cursor-pointer">
                        <Settings className="w-4 h-4 mr-2" />
                        <span>Cài đặt</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link to="/admin/analytics" className="cursor-pointer">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        <span>Thống kê</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-600 cursor-pointer focus:text-red-600"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      <span>Đăng xuất</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
            </div>
          </div>
        </motion.header>

        {/* ✅ Enhanced Page Content */}
        <main className="p-6">
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
              className="flex items-center space-x-2 text-sm text-muted-foreground"
            >
              <Home className="w-4 h-4" />
              <span>/</span>
              <span>Admin</span>
              <span>/</span>
              <span className="font-medium text-foreground">
                {sidebarItems.find((item) => item.href === location.pathname)
                  ?.title || "Dashboard"}
              </span>
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
