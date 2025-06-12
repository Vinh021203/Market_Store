import React, { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigationLoading } from "@/hooks/useNavigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getInitials } from "@/lib/auth";
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
  ArrowLeft,
  Bell,
  Search,
  Plus,
} from "lucide-react";

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // This will trigger loading on route changes
  useNavigationLoading();

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
      icon: FileText,
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

  const Sidebar = () => (
    <div
      className={`fixed left-0 top-0 h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950 border-r border-border/10 z-40 overflow-hidden transition-all duration-300`}
      style={{ width: sidebarOpen ? 280 : 80 }}
    >
      {/* Header */}
      <div className="p-4 border-b border-border/10">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer">
            <span className="text-white font-bold text-lg">TM</span>
          </div>
          {sidebarOpen && (
            <div className="text-white animate-in slide-in-from-left duration-200">
              <h1 className="font-bold text-lg">Template Market</h1>
              <p className="text-xs text-white/70">Admin Panel</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {sidebarItems.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;

          return (
            <Link key={item.href} to={item.href}>
              <div
                className={`relative flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 hover:scale-[1.02] hover:translate-x-1 ${
                  isActive
                    ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg`
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-white/10 rounded-xl animate-in fade-in duration-300" />
                )}
                <div className="relative z-10 flex items-center space-x-3 w-full">
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && (
                    <span className="font-medium animate-in slide-in-from-left duration-200">
                      {item.title}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-4 left-4 right-4">
        <Link to="/">
          <div className="flex items-center space-x-3 p-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all hover:scale-[1.02]">
            <Home className="w-5 h-5" />
            {sidebarOpen && (
              <span className="font-medium animate-in slide-in-from-left duration-200">
                Về trang chủ
              </span>
            )}
          </div>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
      <Sidebar />

      {/* Main Content */}
      <div
        className="transition-all duration-300"
        style={{ marginLeft: sidebarOpen ? 280 : 80 }}
      >
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-border/50 animate-in slide-in-from-top duration-300">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:scale-105 transition-transform"
              >
                <div
                  className={`transition-transform duration-200 ${sidebarOpen ? "rotate-180" : ""}`}
                >
                  <Menu className="w-5 h-5" />
                </div>
              </Button>

              <div className="hidden md:block">
                <h2 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Bảng điều khiển quản trị
                </h2>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="hidden md:flex items-center space-x-2 bg-muted/50 rounded-lg px-3 py-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="bg-transparent border-none outline-none text-sm w-40"
                />
              </div>

              {/* Quick Actions */}
              <Button
                size="sm"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:scale-105 transition-transform"
              >
                <Plus className="w-4 h-4 mr-2" />
                Thêm mới
              </Button>

              {/* Notifications */}
              <Button
                variant="ghost"
                size="sm"
                className="relative hover:scale-105 transition-transform"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs animate-pulse"></span>
              </Button>

              <ThemeToggle />

              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <Avatar className="w-8 h-8 hover:scale-105 transition-transform cursor-pointer">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    {user ? getInitials(user.name) : "A"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="font-medium text-sm">{user?.name}</p>
                  <Badge variant="secondary" className="text-xs">
                    Admin
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <div className="animate-in fade-in duration-300">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
