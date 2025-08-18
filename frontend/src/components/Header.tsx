import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Menu,
  Search,
  ShoppingCart,
  User,
  Heart,
  Bell,
  Settings,
  LogOut,
  Package,
  BookOpen,
  Star,
  Download,
  Code,
  Palette,
  Smartphone,
  Globe,
  Zap,
  TrendingUp,
  Award,
  Users,
  ChevronDown,
  Sun,
  Moon,
  Monitor,
  X,
  Filter,
  SortAsc,
  Grid,
  List,
  Sparkles,
  Crown,
  Flame,
  Clock,
  Eye,
  MessageCircle,
  Share2,
  Shield,
  Database,
  BarChart3,
  FileText,
  UserCog,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Gift,
  Percent,
  ExternalLink,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  ChevronUp,
  ArrowDown,
  AlertCircle,
  PhoneCall,
  Tag,
  Headphones,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useWishlist } from "@/hooks/useWishlist";
import { isAdmin, getInitials } from "@/lib/auth";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { items, getTotalItems } = useCart();
  const { theme, setTheme } = useTheme();
  const { wishlist, getTotalWishlistItems } = useWishlist();

  // Quick actions data
  const quickActions = [
    {
      title: "Sản phẩm mới nhất",
      description: "Khám phá sản phẩm vừa ra mắt",
      icon: Sparkles,
      href: "/latest",
      color: "from-blue-500 to-purple-500",
    },
    {
      title: "Trending",
      description: "Sản phẩm đang hot nhất",
      icon: TrendingUp,
      href: "/trending",
      color: "from-orange-500 to-red-500",
    },
    {
      title: "Premium Collection",
      description: "Bộ sưu tập cao cấp",
      icon: Crown,
      href: "/premium",
      color: "from-yellow-500 to-orange-500",
    },
    {
      title: "Free Resources",
      description: "Tài nguyên miễn phí",
      icon: Heart,
      href: "/free",
      color: "from-green-500 to-emerald-500",
    },
  ];

  // Admin quick actions
  const adminQuickActions = [
    {
      title: "Dashboard",
      description: "Quản lý tổng quan hệ thống",
      icon: BarChart3,
      href: "/admin/dashboard",
      color: "from-purple-500 to-indigo-500",
    },
    {
      title: "Quản lý Users",
      description: "Quản lý tài khoản người dùng",
      icon: UserCog,
      href: "/admin/users",
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Quản lý Products",
      description: "Quản lý templates và ebooks",
      icon: Package,
      href: "/admin/products",
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Analytics",
      description: "Báo cáo và thống kê",
      icon: BarChart3,
      href: "/admin/analytics",
      color: "from-orange-500 to-red-500",
    },
  ];

  // **🔥 FIXED: Smart scroll effect với header collapse**
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          // Basic shadow effect
          setIsScrolled(currentScrollY > 20);

          // Simple but effective collapse logic
          if (currentScrollY < 100) {
            // Near top -> always expand
            setIsCollapsed(false);
          } else if (currentScrollY > lastScrollY && currentScrollY > 200) {
            // Scrolling down & past threshold -> collapse
            setIsCollapsed(true);
          } else if (currentScrollY < lastScrollY - 50) {
            // Scrolling up significantly -> expand
            setIsCollapsed(false);
          }

          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsSearchFocused(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
      window.location.href = "/";
    }
  };

  const totalWishlistItems = getTotalWishlistItems() || 0;
  const totalItems = getTotalItems();

  // **🔥 Collapsed header (compact mode) - Responsive Fixed**
  if (isCollapsed) {
    return (
      <motion.header
        initial={false}
        animate={{
          height: "auto",
          opacity: 1,
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={cn(
          "sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b transition-all duration-200",
          isScrolled ? "shadow-xl" : "shadow-sm",
        )}
      >
        <div className="container px-2 sm:px-4 mx-auto">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Compact Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 2 }}
                className="relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 transition-all duration-300 shadow-lg bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 rounded-lg sm:rounded-xl group-hover:shadow-xl"
              >
                <span className="text-sm sm:text-base font-bold text-white">
                  TM
                </span>
              </motion.div>
              <div className="hidden sm:block">
                <div className="text-base sm:text-lg font-bold text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text">
                  Template Market
                </div>
              </div>
            </Link>

            {/* Compact Search */}
            <div className="flex-1 hidden md:flex max-w-xs lg:max-w-md mx-2 sm:mx-4">
              <form onSubmit={handleSearch} className="relative w-full">
                <Search className="absolute w-3 h-3 sm:w-4 sm:h-4 transform -translate-y-1/2 left-2 sm:left-3 top-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-7 sm:pl-10 pr-2 sm:pr-4 h-8 sm:h-9 text-xs sm:text-sm rounded-md sm:rounded-lg bg-muted/30 border-0 focus:bg-background focus:ring-2 focus:ring-primary/20"
                />
              </form>
            </div>

            {/* Compact Actions */}
            <div className="flex items-center space-x-1">
              {/* Theme Toggle - Hidden on mobile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden sm:flex w-8 h-8 sm:w-9 sm:h-9"
                  >
                    <Sun className="w-3 h-3 sm:w-4 sm:h-4 transition-all scale-100 rotate-0 dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute w-3 h-3 sm:w-4 sm:h-4 transition-all scale-0 rotate-90 dark:rotate-0 dark:scale-100" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-36 z-[9999]">
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    <Sun className="w-4 h-4 mr-2" />
                    <span>Light</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    <Moon className="w-4 h-4 mr-2" />
                    <span>Dark</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    <Monitor className="w-4 h-4 mr-2" />
                    <span>System</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Cart */}
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="relative w-8 h-8 sm:w-9 sm:h-9"
              >
                <Link to="/cart">
                  <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
                  {totalItems > 0 && (
                    <Badge className="absolute flex items-center justify-center w-3 h-3 sm:w-4 sm:h-4 p-0 text-xs bg-primary -top-1 -right-1 rounded-full">
                      {totalItems}
                    </Badge>
                  )}
                </Link>
              </Button>

              {/* User Menu */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative w-8 h-8 sm:w-9 sm:h-9 p-0"
                    >
                      <Avatar className="w-6 h-6 sm:w-7 sm:h-7">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="text-white bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 text-xs">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 z-[9999]" align="end">
                    <DropdownMenuLabel>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile">
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-600"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  size="sm"
                  asChild
                  className="h-8 sm:h-9 px-2 sm:px-3 text-xs"
                >
                  <Link to="/auth/login">Đăng nhập</Link>
                </Button>
              )}

              {/* Mobile Menu */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="lg:hidden w-8 h-8 sm:w-9 sm:h-9"
                  >
                    <Menu className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-[300px] sm:w-[360px] z-[9999]"
                >
                  <SheetHeader>
                    <SheetTitle className="text-left">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600">
                          <span className="text-base font-bold text-white">
                            TM
                          </span>
                        </div>
                        <span className="text-lg font-bold text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text">
                          Template Market
                        </span>
                      </div>
                    </SheetTitle>
                    <SheetDescription className="text-left">
                      Premium templates and e-books for developers
                    </SheetDescription>
                  </SheetHeader>

                  {/* Mobile Search */}
                  <div className="mt-6">
                    <form onSubmit={handleSearch} className="relative">
                      <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Tìm kiếm templates, e-books..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 h-10 rounded-lg"
                      />
                    </form>
                  </div>

                  {/* Mobile Navigation */}
                  <div className="mt-6 space-y-3">
                    <Link
                      to="/templates"
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Package className="w-5 h-5" />
                      <span>Templates</span>
                      <Badge
                        variant="secondary"
                        className="ml-auto text-blue-800 bg-blue-100"
                      >
                        Hot
                      </Badge>
                    </Link>
                    <Link
                      to="/ebooks"
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <BookOpen className="w-5 h-5" />
                      <span>E-books</span>
                      <Badge
                        variant="secondary"
                        className="ml-auto text-green-800 bg-green-100"
                      >
                        New
                      </Badge>
                    </Link>
                    <Link
                      to="/pricing"
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Award className="w-5 h-5" />
                      <span>Pricing</span>
                    </Link>
                    <Link
                      to="/blog"
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>Blog</span>
                    </Link>
                    {user && isAdmin(user) && (
                      <Link
                        to="/admin"
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-purple-50 hover:text-purple-700 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Shield className="w-5 h-5" />
                        <span>Admin</span>
                        <Badge
                          variant="secondary"
                          className="ml-auto text-purple-800 bg-purple-100"
                        >
                          Pro
                        </Badge>
                      </Link>
                    )}
                  </div>

                  {/* Mobile Theme Toggle */}
                  <div className="mt-6 pt-6 border-t">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Theme</p>
                      <div className="flex space-x-2">
                        <Button
                          variant={theme === "light" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setTheme("light")}
                          className="flex-1"
                        >
                          <Sun className="w-4 h-4 mr-2" />
                          Light
                        </Button>
                        <Button
                          variant={theme === "dark" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setTheme("dark")}
                          className="flex-1"
                        >
                          <Moon className="w-4 h-4 mr-2" />
                          Dark
                        </Button>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </motion.header>
    );
  }

  // **🔥 Full header (expanded mode) - Responsive Fixed**
  return (
    <motion.header
      initial={false}
      animate={{
        height: "auto",
        opacity: 1,
      }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "sticky top-0 z-50 transition-all duration-200",
        isScrolled ? "shadow-2xl" : "shadow-sm",
      )}
    >
      {/* ===== TẦNG 1 - TOP BAR (Contact & Promo) - Hide on mobile ===== */}
      <div className="hidden lg:block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
        <div className="container px-4 mx-auto">
          <div className="flex items-center justify-between py-2 text-sm text-white">
            {/* Left - Contact Info */}
            <div className="items-center hidden space-x-4 xl:space-x-6 lg:flex">
              <motion.div
                className="flex items-center space-x-2 transition-all duration-300 hover:text-yellow-300 cursor-pointer"
                whileHover={{ scale: 1.02 }}
              >
                <PhoneCall className="w-3 h-3" />
                <span className="text-xs">Hotline: +84 123 456 789</span>
              </motion.div>

              <motion.div
                className="flex items-center space-x-2 transition-all duration-300 hover:text-yellow-300 cursor-pointer"
                whileHover={{ scale: 1.02 }}
              >
                <Headphones className="w-3 h-3" />
                <span className="text-xs">Hỗ trợ 24/7</span>
              </motion.div>

              <motion.div
                className="flex items-center space-x-2 transition-all duration-300 hover:text-yellow-300 cursor-pointer"
                whileHover={{ scale: 1.02 }}
              >
                <Mail className="w-3 h-3" />
                <span className="text-xs hidden xl:inline">
                  support@templatemarket.com
                </span>
                <span className="text-xs xl:hidden">Email Support</span>
              </motion.div>
            </div>

            {/* Center - Promotion */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center space-x-2 px-3 py-1 bg-white/15 backdrop-blur-sm rounded-full border border-white/20"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Gift className="w-4 h-4 text-yellow-300" />
              </motion.div>
              <span className="text-xs font-semibold hidden xl:inline">
                🎉 Giảm 20% cho đơn hàng đầu tiên - Nhập mã
              </span>
              <span className="text-xs font-semibold xl:hidden">
                🎉 Giảm 20% đơn đầu - Mã:
              </span>
              <Badge className="px-2 py-0 text-xs font-bold text-purple-700 bg-yellow-300 hover:bg-yellow-200 transition-colors cursor-pointer">
                WELCOME20
              </Badge>
            </motion.div>

            {/* Right - Social & User Info */}
            <div className="flex items-center space-x-3 lg:space-x-4">
              {/* Social Links */}
              <div className="items-center hidden space-x-3 lg:flex">
                {[Facebook, Twitter, Instagram, Youtube].map((Icon, index) => (
                  <motion.a
                    key={index}
                    href="#"
                    className="transition-all duration-300 hover:text-yellow-300 hover:scale-110"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Icon className="w-3 h-3" />
                  </motion.a>
                ))}
              </div>

              <div className="w-px h-3 bg-white/30 hidden lg:block"></div>

              {/* User Status */}
              {user ? (
                <div className="flex items-center space-x-2">
                  <span className="text-xs">Xin chào, {user.name}</span>
                  {isAdmin(user) && (
                    <Badge className="px-2 py-0 text-xs text-purple-700 bg-yellow-300">
                      <Crown className="w-3 h-3 mr-1" />
                      Admin
                    </Badge>
                  )}
                </div>
              ) : (
                <span className="text-xs">Cần hỗ trợ? Liên hệ ngay!</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===== TẦNG 2 - LOGO & SEARCH ===== */}
      <div className="bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="container px-2 sm:px-4 mx-auto">
          <div className="flex items-center justify-between py-3 sm:py-4">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center space-x-2 sm:space-x-3 group"
            >
              <motion.div
                whileHover={{ scale: 1.05, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
                className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 transition-all duration-300 shadow-lg bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 rounded-lg sm:rounded-xl group-hover:shadow-xl"
              >
                <span className="text-base sm:text-lg font-bold text-white">
                  TM
                </span>

                {/* Decorative dots */}
                <motion.div
                  className="absolute w-2 h-2 bg-yellow-400 rounded-full -top-1 -right-1"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>

              <div>
                <div className="text-lg sm:text-xl font-bold text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text">
                  Template Market
                </div>
                <div className="-mt-1 text-xs text-muted-foreground hidden sm:block">
                  Premium Quality Store
                </div>
              </div>
            </Link>

            {/* Search Bar - Desktop & Tablet */}
            <div className="flex-1 hidden md:flex max-w-lg lg:max-w-2xl mx-4 lg:mx-8">
              <form onSubmit={handleSearch} className="relative w-full">
                <motion.div
                  className={`relative transition-all duration-300 ${
                    isSearchFocused ? "scale-[1.02]" : ""
                  }`}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-xl blur-xl opacity-0 transition-opacity duration-300 group-focus-within:opacity-100"></div>

                  <div className="relative">
                    <Search className="absolute w-4 h-4 lg:w-5 lg:h-5 transform -translate-y-1/2 left-3 lg:left-4 top-1/2 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Tìm kiếm templates, e-books, tutorials..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => setIsSearchFocused(false)}
                      className={`pl-10 lg:pl-12 pr-10 lg:pr-12 h-10 lg:h-12 text-sm lg:text-base transition-all duration-300 border-2 rounded-lg lg:rounded-xl bg-muted/30 focus:bg-background focus:ring-4 focus:ring-primary/10 focus:border-primary/50 hover:bg-muted/50 ${
                        isSearchFocused ? "shadow-xl border-primary/30" : ""
                      }`}
                    />

                    {searchQuery && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute w-8 h-8 lg:w-10 lg:h-10 p-0 transform -translate-y-1/2 right-1 lg:right-2 top-1/2 hover:bg-muted/80 rounded-lg lg:rounded-xl"
                        onClick={() => setSearchQuery("")}
                      >
                        <X className="w-3 h-3 lg:w-4 lg:h-4" />
                      </Button>
                    )}
                  </div>

                  {/* Search suggestions */}
                  {isSearchFocused && !searchQuery && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 right-0 mt-2 p-4 bg-background/95 backdrop-blur-md border rounded-xl shadow-2xl z-[9999]"
                    >
                      <div className="flex flex-wrap gap-2">
                        <span className="text-xs text-muted-foreground mb-2 block">
                          Tìm kiếm phổ biến:
                        </span>
                        {[
                          "React",
                          "Vue",
                          "Angular",
                          "Mobile App",
                          "Dashboard",
                          "E-commerce",
                          "Landing Page",
                          "Admin Panel",
                        ].map((tag, index) => (
                          <motion.button
                            key={index}
                            onClick={() => setSearchQuery(tag)}
                            className="px-3 py-1 text-xs bg-muted hover:bg-primary hover:text-primary-foreground rounded-full transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {tag}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </form>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* Theme Toggle - Hidden on mobile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden sm:flex w-9 h-9 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl"
                  >
                    <Sun className="w-4 h-4 transition-all scale-100 rotate-0 dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute w-4 h-4 transition-all scale-0 rotate-90 dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-36 z-[9999]">
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    <Sun className="w-4 h-4 mr-2" />
                    <span>Light</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    <Moon className="w-4 h-4 mr-2" />
                    <span>Dark</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    <Monitor className="w-4 h-4 mr-2" />
                    <span>System</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Notifications - Hide on mobile */}
              {user && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="hidden sm:block"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative w-9 h-9 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl"
                  >
                    <Bell className="w-4 h-4" />
                    <AnimatePresence>
                      {notifications > 0 && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="absolute -top-1 -right-1"
                        >
                          <Badge className="flex items-center justify-center w-4 h-4 lg:w-5 lg:h-5 p-0 text-xs bg-red-500 hover:bg-red-600 animate-pulse rounded-full">
                            {notifications}
                          </Badge>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Button>
                </motion.div>
              )}

              {/* Wishlist - Hide on mobile */}
              {user && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="hidden sm:block"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="relative w-9 h-9 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl"
                  >
                    <Link to="/wishlist">
                      <Heart className="w-4 h-4" />
                      <AnimatePresence>
                        {totalWishlistItems > 0 && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="absolute -top-1 -right-1"
                          >
                            <Badge className="flex items-center justify-center w-4 h-4 lg:w-5 lg:h-5 p-0 text-xs bg-primary hover:bg-primary/90 rounded-full">
                              {totalWishlistItems}
                            </Badge>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Link>
                  </Button>
                </motion.div>
              )}

              {/* Cart */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="relative w-9 h-9 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl"
                >
                  <Link to="/cart">
                    <ShoppingCart className="w-4 h-4" />
                    <AnimatePresence>
                      {totalItems > 0 && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="absolute -top-1 -right-1"
                        >
                          <Badge className="flex items-center justify-center w-4 h-4 lg:w-5 lg:h-5 p-0 text-xs bg-primary hover:bg-primary/90 animate-bounce rounded-full">
                            {totalItems}
                          </Badge>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Link>
                </Button>
              </motion.div>

              {/* User Menu */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative rounded-lg lg:rounded-xl h-9 w-9 lg:h-10 lg:w-10 p-0"
                    >
                      <Avatar className="w-7 h-7 lg:w-8 lg:h-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="text-white bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 font-semibold">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      {isAdmin(user) && (
                        <motion.div
                          className="absolute flex items-center justify-center w-3 h-3 lg:w-4 lg:h-4 rounded-full -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-orange-500"
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
                          <Crown className="w-2 h-2 text-white" />
                        </motion.div>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-64 lg:w-72 z-[9999]"
                    align="end"
                    forceMount
                  >
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm lg:text-base font-semibold leading-none">
                            {user.name}
                          </p>
                          {isAdmin(user) && (
                            <Badge
                              variant="secondary"
                              className="text-xs text-yellow-800 bg-yellow-100"
                            >
                              <Crown className="w-3 h-3 mr-1" />
                              Admin
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs lg:text-sm leading-none text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        <User className="w-4 h-4 mr-3" />
                        <span>Hồ sơ cá nhân</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link to="/my-orders" className="cursor-pointer">
                        <Package className="w-4 h-4 mr-3" />
                        <span>Đơn hàng của tôi</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link to="/downloads" className="cursor-pointer">
                        <Download className="w-4 h-4 mr-3" />
                        <span>Downloads</span>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link to="/wishlist" className="cursor-pointer">
                        <Heart className="w-4 h-4 mr-3" />
                        <span>Yêu thích</span>
                      </Link>
                    </DropdownMenuItem>

                    {isAdmin(user) && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link
                            to="/admin"
                            className="cursor-pointer bg-purple-50/50 dark:bg-purple-900/20"
                          >
                            <Shield className="w-4 h-4 mr-3" />
                            <span>Quản trị hệ thống</span>
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}

                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      <span>Đăng xuất</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="rounded-lg lg:rounded-xl text-xs sm:text-sm"
                  >
                    <Link to="/auth/login">Đăng nhập</Link>
                  </Button>
                  <Button
                    size="sm"
                    asChild
                    className="rounded-lg lg:rounded-xl bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 hover:from-blue-600 hover:via-purple-700 hover:to-pink-700 text-xs sm:text-sm"
                  >
                    <Link to="/auth/register">Đăng ký</Link>
                  </Button>
                </div>
              )}

              {/* Mobile Menu */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="lg:hidden w-9 h-9 rounded-lg"
                  >
                    <Menu className="w-4 h-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-[300px] sm:w-[360px] z-[9999]"
                >
                  <SheetHeader>
                    <SheetTitle className="text-left">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600">
                          <span className="text-base font-bold text-white">
                            TM
                          </span>
                        </div>
                        <span className="text-lg font-bold text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text">
                          Template Market
                        </span>
                      </div>
                    </SheetTitle>
                    <SheetDescription className="text-left">
                      Premium templates and e-books for developers
                    </SheetDescription>
                  </SheetHeader>

                  {/* Mobile Search */}
                  <div className="mt-6 md:hidden">
                    <form onSubmit={handleSearch} className="relative">
                      <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Tìm kiếm templates, e-books..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 h-10 rounded-lg"
                      />
                    </form>
                  </div>

                  {/* Mobile Navigation */}
                  <div className="mt-6 space-y-3">
                    <Link
                      to="/templates"
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Package className="w-5 h-5" />
                      <span>Templates</span>
                      <Badge
                        variant="secondary"
                        className="ml-auto text-blue-800 bg-blue-100"
                      >
                        Hot
                      </Badge>
                    </Link>
                    <Link
                      to="/ebooks"
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <BookOpen className="w-5 h-5" />
                      <span>E-books</span>
                      <Badge
                        variant="secondary"
                        className="ml-auto text-green-800 bg-green-100"
                      >
                        New
                      </Badge>
                    </Link>
                    <Link
                      to="/pricing"
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Award className="w-5 h-5" />
                      <span>Pricing</span>
                    </Link>
                    <Link
                      to="/blog"
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>Blog</span>
                    </Link>
                    {user && isAdmin(user) && (
                      <Link
                        to="/admin"
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-purple-50 hover:text-purple-700 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Shield className="w-5 h-5" />
                        <span>Admin</span>
                        <Badge
                          variant="secondary"
                          className="ml-auto text-purple-800 bg-purple-100"
                        >
                          Pro
                        </Badge>
                      </Link>
                    )}

                    {/* Mobile-only actions */}
                    {user && (
                      <>
                        <Separator className="my-4" />
                        <Link
                          to="/wishlist"
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Heart className="w-5 h-5" />
                          <span>Yêu thích</span>
                          {totalWishlistItems > 0 && (
                            <Badge variant="secondary" className="ml-auto">
                              {totalWishlistItems}
                            </Badge>
                          )}
                        </Link>
                        <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors">
                          <Bell className="w-5 h-5" />
                          <span>Thông báo</span>
                          {notifications > 0 && (
                            <Badge variant="destructive" className="ml-auto">
                              {notifications}
                            </Badge>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Mobile Theme Toggle */}
                  <div className="mt-6 pt-6 border-t">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Giao diện</p>
                      <div className="flex space-x-2">
                        <Button
                          variant={theme === "light" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setTheme("light")}
                          className="flex-1"
                        >
                          <Sun className="w-4 h-4 mr-2" />
                          Sáng
                        </Button>
                        <Button
                          variant={theme === "dark" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setTheme("dark")}
                          className="flex-1"
                        >
                          <Moon className="w-4 h-4 mr-2" />
                          Tối
                        </Button>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      {/* ===== TẦNG 3 - NAVIGATION MENU - Hide on mobile ===== */}
      <div className="hidden lg:block bg-background border-b border-border/50">
        <div className="container px-4 mx-auto">
          <div className="flex justify-center py-3">
            <NavigationMenu className="w-full flex justify-center">
              <NavigationMenuList className="flex items-center justify-center space-x-1 xl:space-x-2">
                {/* Templates Dropdown với Categories Scrollable */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="group">
                    <Package className="w-4 h-4 mr-2" />
                    Templates
                    <Badge
                      variant="secondary"
                      className="ml-2 text-blue-800 bg-blue-100"
                    >
                      Hot
                    </Badge>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="z-[9999]">
                    <div className="w-[500px] xl:w-[600px] p-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                          {/* Header */}
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm xl:text-base font-semibold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                              Template Categories
                            </h3>
                            <NavigationMenuLink asChild>
                              <Link
                                to="/templates"
                                className="flex items-center space-x-1 text-xs font-medium transition-colors text-primary hover:text-primary/80"
                              >
                                <span>Xem tất cả</span>
                                <ArrowRight className="w-3 h-3" />
                              </Link>
                            </NavigationMenuLink>
                          </div>

                          {/* Scrollable Categories */}
                          <div className="overflow-y-auto max-h-[300px] pr-2 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-muted-foreground/20 hover:scrollbar-thumb-muted-foreground/40">
                            <div className="space-y-2">
                              {/* React Templates */}
                              <button
                                onClick={() => navigate("/templates?tag=react")}
                                className="flex items-center w-full p-2 text-left transition-all duration-300 rounded-lg group hover:bg-muted"
                              >
                                <div className="flex items-center justify-center w-8 h-8 mr-3 transition-transform duration-300 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 group-hover:scale-110">
                                  <Code className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2">
                                    <div className="text-sm font-medium transition-colors group-hover:text-primary">
                                      React Templates
                                    </div>
                                    <Badge
                                      variant="secondary"
                                      className="text-xs text-orange-800 bg-orange-100"
                                    >
                                      Hot
                                    </Badge>
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    200+ templates
                                  </div>
                                </div>
                              </button>

                              {/* Vue.js Templates */}
                              <button
                                onClick={() => navigate("/templates?tag=vue")}
                                className="flex items-center w-full p-2 text-left transition-all duration-300 rounded-lg group hover:bg-muted"
                              >
                                <div className="flex items-center justify-center w-8 h-8 mr-3 transition-transform duration-300 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 group-hover:scale-110">
                                  <Zap className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1">
                                  <div className="text-sm font-medium transition-colors group-hover:text-primary">
                                    Vue.js Templates
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    150+ templates
                                  </div>
                                </div>
                              </button>

                              {/* Angular Templates */}
                              <button
                                onClick={() =>
                                  navigate("/templates?tag=angular")
                                }
                                className="flex items-center w-full p-2 text-left transition-all duration-300 rounded-lg group hover:bg-muted"
                              >
                                <div className="flex items-center justify-center w-8 h-8 mr-3 transition-transform duration-300 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 group-hover:scale-110">
                                  <Globe className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1">
                                  <div className="text-sm font-medium transition-colors group-hover:text-primary">
                                    Angular Templates
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    100+ templates
                                  </div>
                                </div>
                              </button>

                              {/* Mobile Templates */}
                              <button
                                onClick={() =>
                                  navigate("/templates?tag=mobile")
                                }
                                className="flex items-center w-full p-2 text-left transition-all duration-300 rounded-lg group hover:bg-muted"
                              >
                                <div className="flex items-center justify-center w-8 h-8 mr-3 transition-transform duration-300 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 group-hover:scale-110">
                                  <Smartphone className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1">
                                  <div className="text-sm font-medium transition-colors group-hover:text-primary">
                                    Mobile Templates
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    80+ templates
                                  </div>
                                </div>
                              </button>

                              {/* Design Systems */}
                              <button
                                onClick={() =>
                                  navigate("/templates?tag=design")
                                }
                                className="flex items-center w-full p-2 text-left transition-all duration-300 rounded-lg group hover:bg-muted"
                              >
                                <div className="flex items-center justify-center w-8 h-8 mr-3 transition-transform duration-300 rounded-lg bg-gradient-to-r from-orange-500 to-yellow-500 group-hover:scale-110">
                                  <Palette className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1">
                                  <div className="text-sm font-medium transition-colors group-hover:text-primary">
                                    Design Systems
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    60+ templates
                                  </div>
                                </div>
                              </button>

                              {/* Admin Dashboards */}
                              <button
                                onClick={() => navigate("/templates?tag=admin")}
                                className="flex items-center w-full p-2 text-left transition-all duration-300 rounded-lg group hover:bg-muted"
                              >
                                <div className="flex items-center justify-center w-8 h-8 mr-3 transition-transform duration-300 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:scale-110">
                                  <Grid className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1">
                                  <div className="text-sm font-medium transition-colors group-hover:text-primary">
                                    Admin Dashboards
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    120+ templates
                                  </div>
                                </div>
                              </button>

                              {/* E-commerce Templates */}
                              <button
                                onClick={() =>
                                  navigate("/templates?tag=ecommerce")
                                }
                                className="flex items-center w-full p-2 text-left transition-all duration-300 rounded-lg group hover:bg-muted"
                              >
                                <div className="flex items-center justify-center w-8 h-8 mr-3 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-500 group-hover:scale-110 transition-transform duration-300">
                                  <Database className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1">
                                  <div className="text-sm font-medium transition-colors group-hover:text-primary">
                                    E-commerce Templates
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    90+ templates
                                  </div>
                                </div>
                              </button>

                              {/* Landing Pages */}
                              <button
                                onClick={() =>
                                  navigate("/templates?tag=landing")
                                }
                                className="flex items-center w-full p-2 text-left transition-all duration-300 rounded-lg group hover:bg-muted"
                              >
                                <div className="flex items-center justify-center w-8 h-8 mr-3 rounded-lg bg-gradient-to-r from-rose-500 to-pink-500 group-hover:scale-110 transition-transform duration-300">
                                  <FileText className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1">
                                  <div className="text-sm font-medium transition-colors group-hover:text-primary">
                                    Landing Pages
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    150+ templates
                                  </div>
                                </div>
                              </button>
                            </div>
                          </div>

                          {/* Footer */}
                          <div className="pt-3 mt-3 border-t">
                            <NavigationMenuLink asChild>
                              <Link
                                to="/templates"
                                className="flex items-center justify-center w-full p-2 text-sm font-medium text-white transition-all duration-300 rounded-lg bg-primary hover:bg-primary/90"
                              >
                                <Package className="w-4 h-4 mr-2" />
                                Duyệt tất cả Templates
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </Link>
                            </NavigationMenuLink>
                          </div>
                        </div>

                        {/* Quick Actions - KHÔNG scroll */}
                        <div>
                          <h4 className="text-xs font-semibold tracking-wide uppercase text-muted-foreground mb-2">
                            Quick Actions
                          </h4>
                          <div className="space-y-2">
                            {quickActions.slice(0, 3).map((action, index) => (
                              <Link
                                key={index}
                                to={action.href}
                                className="block p-2 transition-all duration-300 border rounded-lg group hover:shadow-md"
                              >
                                <div className="flex items-center space-x-2">
                                  <div
                                    className={`w-6 h-6 rounded bg-gradient-to-r ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                                  >
                                    <action.icon className="w-3 h-3 text-white" />
                                  </div>
                                  <div>
                                    <div className="text-xs font-medium transition-colors group-hover:text-primary">
                                      {action.title}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {action.description}
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>

                          {/* Admin Tools */}
                          {user && isAdmin(user) && (
                            <>
                              <Separator className="my-3" />
                              <h4 className="text-xs font-semibold tracking-wide uppercase text-muted-foreground mb-2">
                                <Shield className="inline w-3 h-3 mr-1" />
                                Admin Tools
                              </h4>
                              <div className="space-y-2">
                                {adminQuickActions
                                  .slice(0, 2)
                                  .map((action, index) => (
                                    <Link
                                      key={index}
                                      to={action.href}
                                      className="block p-2 transition-all duration-300 border border-purple-200 rounded-lg group hover:shadow-md bg-purple-50/50"
                                    >
                                      <div className="flex items-center space-x-2">
                                        <div
                                          className={`w-6 h-6 rounded bg-gradient-to-r ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                                        >
                                          <action.icon className="w-3 h-3 text-white" />
                                        </div>
                                        <div>
                                          <div className="text-xs font-medium transition-colors group-hover:text-primary">
                                            {action.title}
                                          </div>
                                          <div className="text-xs text-muted-foreground">
                                            {action.description}
                                          </div>
                                        </div>
                                      </div>
                                    </Link>
                                  ))}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* E-books Dropdown với Categories Scrollable */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="group">
                    <BookOpen className="w-4 h-4 mr-2" />
                    E-books
                    <Badge
                      variant="secondary"
                      className="ml-2 text-green-800 bg-green-100"
                    >
                      New
                    </Badge>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="z-[9999]">
                    <div className="w-[400px] xl:w-[500px] p-4">
                      <div className="grid grid-cols-2 gap-4">
                        {/* Categories - Scrollable */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm xl:text-base font-semibold text-transparent bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text">
                              E-book Categories
                            </h3>
                            <NavigationMenuLink asChild>
                              <Link
                                to="/ebooks"
                                className="flex items-center space-x-1 text-xs font-medium transition-colors text-primary hover:text-primary/80"
                              >
                                <span>Xem tất cả</span>
                                <ArrowRight className="w-3 h-3" />
                              </Link>
                            </NavigationMenuLink>
                          </div>

                          {/* Scrollable E-book Categories */}
                          <div className="overflow-y-auto max-h-[280px] pr-2 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-muted-foreground/20 hover:scrollbar-thumb-muted-foreground/40">
                            <div className="space-y-2">
                              {/* JavaScript */}
                              <button
                                onClick={() =>
                                  navigate("/ebooks?tag=javascript")
                                }
                                className="flex items-center w-full p-2 text-left transition-all duration-300 rounded-lg group hover:bg-muted"
                              >
                                <div className="flex items-center justify-center w-8 h-8 mr-3 transition-transform duration-300 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 group-hover:scale-110">
                                  <Code className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1">
                                  <div className="text-sm font-medium transition-colors group-hover:text-primary">
                                    JavaScript & TypeScript
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    80+ e-books
                                  </div>
                                </div>
                              </button>

                              {/* React */}
                              <button
                                onClick={() => navigate("/ebooks?tag=react")}
                                className="flex items-center w-full p-2 text-left transition-all duration-300 rounded-lg group hover:bg-muted"
                              >
                                <div className="flex items-center justify-center w-8 h-8 mr-3 transition-transform duration-300 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 group-hover:scale-110">
                                  <Zap className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1">
                                  <div className="text-sm font-medium transition-colors group-hover:text-primary">
                                    React & Next.js
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    60+ e-books
                                  </div>
                                </div>
                              </button>

                              {/* Design */}
                              <button
                                onClick={() => navigate("/ebooks?tag=design")}
                                className="flex items-center w-full p-2 text-left transition-all duration-300 rounded-lg group hover:bg-muted"
                              >
                                <div className="flex items-center justify-center w-8 h-8 mr-3 transition-transform duration-300 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 group-hover:scale-110">
                                  <Palette className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1">
                                  <div className="text-sm font-medium transition-colors group-hover:text-primary">
                                    UI/UX Design
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    40+ e-books
                                  </div>
                                </div>
                              </button>

                              {/* Backend */}
                              <button
                                onClick={() => navigate("/ebooks?tag=backend")}
                                className="flex items-center w-full p-2 text-left transition-all duration-300 rounded-lg group hover:bg-muted"
                              >
                                <div className="flex items-center justify-center w-8 h-8 mr-3 transition-transform duration-300 rounded-lg bg-gradient-to-r from-green-500 to-teal-500 group-hover:scale-110">
                                  <Globe className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1">
                                  <div className="text-sm font-medium transition-colors group-hover:text-primary">
                                    Backend Development
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    50+ e-books
                                  </div>
                                </div>
                              </button>

                              {/* DevOps */}
                              <button
                                onClick={() => navigate("/ebooks?tag=devops")}
                                className="flex items-center w-full p-2 text-left transition-all duration-300 rounded-lg group hover:bg-muted"
                              >
                                <div className="flex items-center justify-center w-8 h-8 mr-3 transition-transform duration-300 rounded-lg bg-gradient-to-r from-purple-500 to-violet-500 group-hover:scale-110">
                                  <Settings className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1">
                                  <div className="text-sm font-medium transition-colors group-hover:text-primary">
                                    DevOps & Cloud
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    30+ e-books
                                  </div>
                                </div>
                              </button>

                              {/* Mobile */}
                              <button
                                onClick={() => navigate("/ebooks?tag=mobile")}
                                className="flex items-center w-full p-2 text-left transition-all duration-300 rounded-lg group hover:bg-muted"
                              >
                                <div className="flex items-center justify-center w-8 h-8 mr-3 transition-transform duration-300 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:scale-110">
                                  <Smartphone className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1">
                                  <div className="text-sm font-medium transition-colors group-hover:text-primary">
                                    Mobile Development
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    35+ e-books
                                  </div>
                                </div>
                              </button>
                            </div>
                          </div>

                          {/* Footer */}
                          <div className="pt-3 mt-3 border-t">
                            <NavigationMenuLink asChild>
                              <Link
                                to="/ebooks"
                                className="flex items-center justify-center w-full p-2 text-sm font-medium text-white transition-all duration-300 rounded-lg bg-green-600 hover:bg-green-700"
                              >
                                <BookOpen className="w-4 h-4 mr-2" />
                                Duyệt tất cả E-books
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </Link>
                            </NavigationMenuLink>
                          </div>
                        </div>

                        {/* Featured - KHÔNG scroll */}
                        <div className="space-y-3">
                          <h4 className="text-xs font-semibold tracking-wide uppercase text-muted-foreground">
                            Featured
                          </h4>

                          {/* Premium */}
                          <div className="p-3 border border-blue-200 rounded-lg bg-blue-50/50">
                            <div className="flex items-center mb-2 space-x-2">
                              <Crown className="w-4 h-4 text-yellow-500" />
                              <span className="text-sm font-medium">
                                Premium
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">
                              Expert content with advanced techniques
                            </p>
                            <Button size="sm" className="w-full">
                              Explore
                            </Button>
                          </div>

                          {/* Free */}
                          <div className="p-3 border border-green-200 rounded-lg bg-green-50/50">
                            <div className="flex items-center mb-2 space-x-2">
                              <Heart className="w-4 h-4 text-green-500" />
                              <span className="text-sm font-medium">Free</span>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">
                              High-quality free resources
                            </p>
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full"
                            >
                              Browse
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Other menu items */}
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/pricing"
                      className="inline-flex h-10 w-max items-center justify-center rounded-lg px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
                    >
                      <Award className="w-4 h-4 mr-2" />
                      Pricing
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/blog"
                      className="inline-flex h-10 w-max items-center justify-center rounded-lg px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Blog
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {/* Admin Menu */}
                {user && isAdmin(user) && (
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link
                        to="/admin"
                        className="inline-flex h-10 w-max items-center justify-center rounded-lg px-4 py-2 text-sm font-medium hover:bg-purple-50 hover:text-purple-700 transition-colors"
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        Admin
                        <Badge
                          variant="secondary"
                          className="ml-2 text-purple-800 bg-purple-100"
                        >
                          <Crown className="w-3 h-3 mr-1" />
                          Pro
                        </Badge>
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )}
              </NavigationMenuList>
            </NavigationMenu>

            {/* Welcome Message */}
            <div className="hidden xl:flex items-center space-x-2 text-sm text-muted-foreground ml-8">
              <Sparkles className="w-4 h-4" />
              <span>Chào mừng đến với Template Market</span>
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span>✨</span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
