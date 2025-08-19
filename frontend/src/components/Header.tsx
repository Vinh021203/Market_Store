import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
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
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";

const Header: React.FC = () => {
  // States
  const [headerState, setHeaderState] = useState({
    isCollapsed: false,
    isHidden: false,
    showTopBar: true,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lastScrollYRef = useRef(0);

  // Hooks
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { items, getTotalItems } = useCart();
  const { theme, setTheme } = useTheme();
  const { wishlist, getTotalWishlistItems } = useWishlist();
  const { scrollY } = useScroll();

  // Scroll-based transforms for smooth animations
  const topBarOpacity = useTransform(scrollY, [0, 100], [1, 0]);
  const topBarHeight = useTransform(scrollY, [0, 100], ["auto", "0px"]);
  const headerPadding = useTransform(scrollY, [0, 200], ["1rem", "0.5rem"]);
  const logoScale = useTransform(scrollY, [0, 200], [1, 0.9]);
  const searchWidth = useTransform(scrollY, [0, 200], ["100%", "80%"]);

  // Optimized scroll handler with throttling
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    const scrollDirection =
      currentScrollY > lastScrollYRef.current ? "down" : "up";

    setHeaderState((prev) => ({
      ...prev,
      isCollapsed: currentScrollY > 100,
      isHidden:
        currentScrollY > 300 &&
        scrollDirection === "down" &&
        currentScrollY > lastScrollYRef.current + 10,
      showTopBar: currentScrollY < 50,
    }));

    lastScrollYRef.current = currentScrollY;
  }, []);

  useEffect(() => {
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });
    return () => window.removeEventListener("scroll", throttledScroll);
  }, [handleScroll]);

  // Memoized values for performance
  const totalWishlistItems = useMemo(
    () => getTotalWishlistItems() || 0,
    [getTotalWishlistItems],
  );
  const totalItems = useMemo(() => getTotalItems(), [getTotalItems]);

  // Event handlers
  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        setSearchQuery("");
        setIsSearchFocused(false);
      }
    },
    [searchQuery, navigate],
  );

  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
      window.location.href = "/";
    }
  }, [logout]);

  // Quick actions data
  const quickActions = useMemo(
    () => [
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
    ],
    [],
  );

  // Admin quick actions
  const adminQuickActions = useMemo(
    () => [
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
    ],
    [],
  );

  return (
    <motion.header
      animate={{
        y: headerState.isHidden ? -100 : 0,
        opacity: headerState.isHidden ? 0 : 1,
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        "bg-background/95 backdrop-blur-md border-b",
        headerState.isCollapsed ? "shadow-2xl" : "shadow-sm",
      )}
    >
      {/* ===== TOP BAR - với animation ẩn/hiện mượt ===== */}
      <AnimatePresence>
        {headerState.showTopBar && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            style={{ opacity: topBarOpacity, height: topBarHeight }}
            className="hidden lg:block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 overflow-hidden"
          >
            <div className="container px-4 mx-auto">
              <div className="flex items-center justify-between py-2 text-sm text-white">
                {/* Left - Contact Info */}
                <div className="flex items-center space-x-4 xl:space-x-6">
                  <motion.div
                    className="flex items-center space-x-2 transition-all duration-300 hover:text-yellow-300 cursor-pointer"
                    whileHover={{ scale: 1.05, x: 2 }}
                  >
                    <PhoneCall className="w-3 h-3" />
                    <span className="text-xs">Hotline: +84 123 456 789</span>
                  </motion.div>

                  <motion.div
                    className="flex items-center space-x-2 transition-all duration-300 hover:text-yellow-300 cursor-pointer"
                    whileHover={{ scale: 1.05, x: 2 }}
                  >
                    <Headphones className="w-3 h-3" />
                    <span className="text-xs">Hỗ trợ 24/7</span>
                  </motion.div>

                  <motion.div
                    className="flex items-center space-x-2 transition-all duration-300 hover:text-yellow-300 cursor-pointer"
                    whileHover={{ scale: 1.05, x: 2 }}
                  >
                    <Mail className="w-3 h-3" />
                    <span className="text-xs hidden xl:inline">
                      support@templatemarket.com
                    </span>
                    <span className="text-xs xl:hidden">Email Support</span>
                  </motion.div>
                </div>

                {/* Center - Enhanced Promotion */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center space-x-2 px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 shadow-lg"
                >
                  <motion.div
                    animate={{
                      rotate: 360,
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                      scale: { duration: 2, repeat: Infinity },
                    }}
                  >
                    <Gift className="w-4 h-4 text-yellow-300" />
                  </motion.div>
                  <span className="text-xs font-semibold hidden xl:inline">
                    🎉 Flash Sale: Giảm 30% cho 100 đơn hàng đầu tiên!
                  </span>
                  <span className="text-xs font-semibold xl:hidden">
                    🎉 Flash Sale 30% OFF!
                  </span>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Badge className="px-2 py-0.5 text-xs font-bold text-purple-700 bg-yellow-300 hover:bg-yellow-200 transition-all cursor-pointer shadow-md">
                      FLASH30
                    </Badge>
                  </motion.div>
                </motion.div>

                {/* Right - Social & User Info */}
                <div className="flex items-center space-x-4">
                  {/* Enhanced Social Links */}
                  <div className="flex items-center space-x-2">
                    {[Facebook, Twitter, Instagram, Youtube].map(
                      (Icon, index) => (
                        <motion.a
                          key={index}
                          href="#"
                          className="p-1 rounded-full transition-all duration-300 hover:bg-white/20"
                          whileHover={{ scale: 1.2, rotate: 5 }}
                          whileTap={{ scale: 0.8 }}
                        >
                          <Icon className="w-3 h-3" />
                        </motion.a>
                      ),
                    )}
                  </div>

                  <div className="w-px h-4 bg-white/30"></div>

                  {/* Enhanced User Status */}
                  {user ? (
                    <motion.div
                      className="flex items-center space-x-2"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <span className="text-xs">Xin chào, {user.name}</span>
                      {isAdmin(user) && (
                        <motion.div
                          animate={{
                            rotate: [0, 5, -5, 0],
                            scale: [1, 1.05, 1],
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Badge className="px-2 py-0 text-xs text-purple-700 bg-yellow-300">
                            <Crown className="w-3 h-3 mr-1" />
                            Admin
                          </Badge>
                        </motion.div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.span
                      className="text-xs"
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      Cần hỗ trợ? Liên hệ ngay!
                    </motion.span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== MAIN HEADER - với animation responsive ===== */}
      <motion.div
        className="bg-background/98 backdrop-blur-lg border-b border-border/50"
        style={{ padding: headerPadding }}
      >
        <div className="container px-2 sm:px-4 mx-auto">
          <motion.div
            className="flex items-center justify-between"
            animate={{ height: headerState.isCollapsed ? 56 : 64 }}
            transition={{ duration: 0.3 }}
          >
            {/* Enhanced Logo */}
            <Link
              to="/"
              className="flex items-center space-x-2 sm:space-x-3 group"
            >
              <motion.div
                style={{ scale: logoScale }}
                whileHover={{ scale: 1.1, rotate: 3 }}
                whileTap={{ scale: 0.95 }}
                className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 transition-all duration-300 shadow-xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 rounded-xl group-hover:shadow-2xl"
              >
                <span className="text-base sm:text-lg font-bold text-white">
                  TM
                </span>

                {/* Animated dots */}
                <motion.div
                  className="absolute w-2 h-2 bg-yellow-400 rounded-full -top-1 -right-1"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.7, 1, 0.7],
                    rotate: [0, 180, 360],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </motion.div>

              <AnimatePresence>
                {!headerState.isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-lg sm:text-xl font-bold text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text">
                      Template Market
                    </div>
                    <motion.div
                      className="-mt-1 text-xs text-muted-foreground hidden sm:block"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      Premium Quality Store ✨
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Link>

            {/* Enhanced Search Bar */}
            <motion.div
              className="flex-1 hidden md:flex max-w-lg lg:max-w-2xl mx-4 lg:mx-8"
              style={{ width: searchWidth }}
            >
              <form onSubmit={handleSearch} className="relative w-full">
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.02 }}
                  animate={{
                    boxShadow: isSearchFocused
                      ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                      : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  }}
                >
                  {/* Background glow effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-xl blur-xl"
                    animate={{ opacity: isSearchFocused ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />

                  <div className="relative">
                    <Search className="absolute w-4 h-4 lg:w-5 lg:h-5 transform -translate-y-1/2 left-3 lg:left-4 top-1/2 text-muted-foreground" />

                    <Input
                      type="text"
                      placeholder={
                        headerState.isCollapsed
                          ? "Tìm kiếm..."
                          : "Tìm kiếm templates, e-books, tutorials..."
                      }
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => setIsSearchFocused(false)}
                      className={cn(
                        "pl-10 lg:pl-12 pr-10 lg:pr-12 transition-all duration-300 border-2 rounded-lg lg:rounded-xl",
                        "bg-muted/30 focus:bg-background focus:ring-4 focus:ring-primary/20 hover:bg-muted/50",
                        headerState.isCollapsed
                          ? "h-9 text-sm"
                          : "h-10 lg:h-12 text-sm lg:text-base",
                        isSearchFocused
                          ? "shadow-xl border-primary/40 bg-background"
                          : "",
                      )}
                    />

                    <AnimatePresence>
                      {searchQuery && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                        >
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute w-8 h-8 lg:w-10 lg:h-10 p-0 transform -translate-y-1/2 right-1 lg:right-2 top-1/2 hover:bg-muted/80 rounded-lg lg:rounded-xl"
                            onClick={() => setSearchQuery("")}
                          >
                            <X className="w-3 h-3 lg:w-4 lg:h-4" />
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Enhanced Search Suggestions */}
                  <AnimatePresence>
                    {isSearchFocused && !searchQuery && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 right-0 mt-2 p-6 bg-background/98 backdrop-blur-xl border-2 border-border/50 rounded-xl shadow-2xl z-[9999]"
                      >
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-muted-foreground">
                              🔍 Tìm kiếm phổ biến
                            </span>
                            <Badge variant="outline" className="text-xs">
                              Trending
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            {[
                              { name: "React Dashboard", trend: "+15%" },
                              { name: "Vue Components", trend: "+8%" },
                              { name: "Mobile Templates", trend: "+22%" },
                              { name: "E-commerce", trend: "+12%" },
                              { name: "Landing Pages", trend: "+18%" },
                              { name: "Admin Panels", trend: "+9%" },
                            ].map((tag, index) => (
                              <motion.button
                                key={index}
                                onClick={() => setSearchQuery(tag.name)}
                                className="flex items-center justify-between p-3 bg-muted/50 hover:bg-primary/10 rounded-lg transition-all group"
                                whileHover={{ scale: 1.02, x: 2 }}
                                whileTap={{ scale: 0.98 }}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                              >
                                <span className="text-sm font-medium group-hover:text-primary">
                                  {tag.name}
                                </span>
                                <Badge
                                  variant="secondary"
                                  className="text-xs bg-green-100 text-green-700"
                                >
                                  {tag.trend}
                                </Badge>
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </form>
            </motion.div>

            {/* Enhanced Right Actions */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* Theme Toggle */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden sm:flex w-9 h-9 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl relative overflow-hidden"
                  >
                    <motion.div
                      animate={{ rotate: theme === "dark" ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Sun className="w-4 h-4 transition-all scale-100 rotate-0 dark:-rotate-90 dark:scale-0" />
                      <Moon className="absolute w-4 h-4 transition-all scale-0 rotate-90 dark:rotate-0 dark:scale-100" />
                    </motion.div>
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40 z-[9999]">
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    <Sun className="w-4 h-4 mr-2" />
                    <span>Light Mode</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    <Moon className="w-4 h-4 mr-2" />
                    <span>Dark Mode</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    <Monitor className="w-4 h-4 mr-2" />
                    <span>System</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Enhanced Notifications */}
              {user && (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="hidden sm:block relative"
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
                          <motion.div
                            animate={{
                              scale: [1, 1.2, 1],
                              boxShadow: [
                                "0 0 0 0 rgba(239, 68, 68, 0.7)",
                                "0 0 0 10px rgba(239, 68, 68, 0)",
                                "0 0 0 0 rgba(239, 68, 68, 0)",
                              ],
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Badge className="flex items-center justify-center w-5 h-5 p-0 text-xs bg-red-500 hover:bg-red-600 rounded-full border-2 border-background">
                              {notifications}
                            </Badge>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Button>
                </motion.div>
              )}

              {/* Enhanced Wishlist */}
              {user && (
                <motion.div
                  whileHover={{ scale: 1.1 }}
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
                      <motion.div
                        animate={{
                          scale: totalWishlistItems > 0 ? [1, 1.1, 1] : 1,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <Heart
                          className={cn(
                            "w-4 h-4 transition-colors",
                            totalWishlistItems > 0
                              ? "text-red-500 fill-red-500"
                              : "",
                          )}
                        />
                      </motion.div>
                      <AnimatePresence>
                        {totalWishlistItems > 0 && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="absolute -top-1 -right-1"
                          >
                            <Badge className="flex items-center justify-center w-5 h-5 p-0 text-xs bg-primary hover:bg-primary/90 rounded-full">
                              {totalWishlistItems}
                            </Badge>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Link>
                  </Button>
                </motion.div>
              )}

              {/* Enhanced Cart */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="relative w-9 h-9 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl"
                >
                  <Link to="/cart">
                    <motion.div
                      animate={{
                        rotate: totalItems > 0 ? [0, -10, 10, 0] : 0,
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </motion.div>
                    <AnimatePresence>
                      {totalItems > 0 && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="absolute -top-1 -right-1"
                        >
                          <motion.div
                            animate={{
                              scale: [1, 1.3, 1],
                              rotate: [0, 10, -10, 0],
                            }}
                            transition={{
                              duration: 0.6,
                              repeat: Infinity,
                              repeatDelay: 2,
                            }}
                          >
                            <Badge className="flex items-center justify-center w-5 h-5 p-0 text-xs bg-primary hover:bg-primary/90 rounded-full shadow-lg">
                              {totalItems}
                            </Badge>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Link>
                </Button>
              </motion.div>

              {/* Enhanced User Menu */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
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
                            className="absolute flex items-center justify-center w-4 h-4 rounded-full -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg"
                            animate={{
                              rotate: [0, 15, -15, 0],
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
                    </motion.div>
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
                        {totalWishlistItems > 0 && (
                          <Badge variant="secondary" className="ml-auto">
                            {totalWishlistItems}
                          </Badge>
                        )}
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
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="rounded-lg lg:rounded-xl text-xs sm:text-sm"
                  >
                    <Link to="/auth/login">Đăng nhập</Link>
                  </Button>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="sm"
                      asChild
                      className="rounded-lg lg:rounded-xl bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 hover:from-blue-600 hover:via-purple-700 hover:to-pink-700 text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all"
                    >
                      <Link to="/auth/register">Đăng ký</Link>
                    </Button>
                  </motion.div>
                </div>
              )}

              {/* Enhanced Mobile Menu */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="lg:hidden w-9 h-9 rounded-lg"
                  >
                    <motion.div
                      animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-4 h-4" />
                    </motion.div>
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-[320px] sm:w-[380px] z-[9999]"
                >
                  <SheetHeader>
                    <SheetTitle className="text-left">
                      <div className="flex items-center space-x-3">
                        <motion.div
                          className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 shadow-lg"
                          whileHover={{ rotate: 5, scale: 1.05 }}
                        >
                          <span className="text-base font-bold text-white">
                            TM
                          </span>
                        </motion.div>
                        <span className="text-lg font-bold text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text">
                          Template Market
                        </span>
                      </div>
                    </SheetTitle>
                    <SheetDescription className="text-left">
                      Premium templates and e-books for developers ✨
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
                        className="pl-10 pr-4 h-12 rounded-xl border-2 focus:border-primary/50"
                      />
                    </form>
                  </div>

                  {/* Enhanced Mobile Navigation */}
                  <div className="mt-8 space-y-2">
                    {[
                      {
                        to: "/templates",
                        icon: Package,
                        label: "Templates",
                        badge: "Hot",
                        badgeColor: "bg-red-100 text-red-800",
                      },
                      {
                        to: "/ebooks",
                        icon: BookOpen,
                        label: "E-books",
                        badge: "New",
                        badgeColor: "bg-green-100 text-green-800",
                      },
                      { to: "/pricing", icon: Award, label: "Pricing" },
                      { to: "/blog", icon: MessageCircle, label: "Blog" },
                    ].map((item, index) => (
                      <motion.div
                        key={item.to}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          to={item.to}
                          className="flex items-center space-x-3 p-4 rounded-xl hover:bg-muted transition-colors group"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <item.icon className="w-5 h-5 text-primary" />
                          </div>
                          <span className="flex-1 font-medium">
                            {item.label}
                          </span>
                          {item.badge && (
                            <Badge className={cn("text-xs", item.badgeColor)}>
                              {item.badge}
                            </Badge>
                          )}
                          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        </Link>
                      </motion.div>
                    ))}

                    {user && isAdmin(user) && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <Link
                          to="/admin"
                          className="flex items-center space-x-3 p-4 rounded-xl hover:bg-purple-50 hover:text-purple-700 transition-colors group"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <div className="p-2 rounded-lg bg-purple-100 group-hover:bg-purple-200 transition-colors">
                            <Shield className="w-5 h-5 text-purple-600" />
                          </div>
                          <span className="flex-1 font-medium">
                            Admin Panel
                          </span>
                          <Badge className="text-xs text-purple-800 bg-purple-100">
                            <Crown className="w-3 h-3 mr-1" />
                            Pro
                          </Badge>
                        </Link>
                      </motion.div>
                    )}

                    {/* Mobile-only user actions */}
                    {user && (
                      <>
                        <Separator className="my-4" />
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className="space-y-2"
                        >
                          <Link
                            to="/wishlist"
                            className="flex items-center space-x-3 p-4 rounded-xl hover:bg-muted transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <Heart className="w-5 h-5 text-red-500" />
                            <span className="flex-1">Yêu thích</span>
                            {totalWishlistItems > 0 && (
                              <Badge variant="secondary">
                                {totalWishlistItems}
                              </Badge>
                            )}
                          </Link>

                          <div className="flex items-center space-x-3 p-4 rounded-xl hover:bg-muted transition-colors">
                            <Bell className="w-5 h-5 text-blue-500" />
                            <span className="flex-1">Thông báo</span>
                            {notifications > 0 && (
                              <Badge variant="destructive">
                                {notifications}
                              </Badge>
                            )}
                          </div>
                        </motion.div>
                      </>
                    )}
                  </div>

                  {/* Enhanced Mobile Theme Toggle */}
                  <motion.div
                    className="mt-8 pt-6 border-t"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="space-y-3">
                      <p className="text-sm font-semibold">Giao diện</p>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { value: "light", icon: Sun, label: "Sáng" },
                          { value: "dark", icon: Moon, label: "Tối" },
                          { value: "system", icon: Monitor, label: "Hệ thống" },
                        ].map((themeOption) => (
                          <Button
                            key={themeOption.value}
                            variant={
                              theme === themeOption.value
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() => setTheme(themeOption.value as any)}
                            className="flex flex-col items-center gap-1 h-auto py-3"
                          >
                            <themeOption.icon className="w-4 h-4" />
                            <span className="text-xs">{themeOption.label}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </SheetContent>
              </Sheet>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ===== NAVIGATION MENU - với animation ẩn/hiện ===== */}
      <AnimatePresence>
        {!headerState.isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="hidden lg:block bg-background/95 backdrop-blur-sm border-b border-border/50"
          >
            <div className="container px-4 mx-auto">
              <div className="flex justify-center py-3">
                <NavigationMenu className="w-full flex justify-center">
                  <NavigationMenuList className="flex items-center justify-center space-x-2">
                    {/* Templates Dropdown */}
                    {/* Templates Dropdown - Compact Design with Scroll */}
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="group h-12 px-6 rounded-xl font-medium">
                        <Package className="w-4 h-4 mr-2" />
                        Templates
                        <Badge
                          variant="secondary"
                          className="ml-2 text-red-800 bg-red-100"
                        >
                          Hot
                        </Badge>
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="z-[9999]">
                        <div className="w-[520px] h-[400px] bg-white dark:bg-slate-900 shadow-xl border-0 rounded-xl overflow-hidden">
                          {/* Fixed Header */}
                          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 border-b">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-lg font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                                  Template Categories
                                </h3>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  Premium templates for modern web
                                </p>
                              </div>
                              <NavigationMenuLink asChild>
                                <Link
                                  to="/templates"
                                  className="flex items-center space-x-1 px-3 py-1.5 bg-white dark:bg-slate-800 rounded-lg hover:bg-gray-50 transition-colors text-xs font-medium border"
                                >
                                  <span>Xem tất cả</span>
                                  <ArrowRight className="w-3 h-3" />
                                </Link>
                              </NavigationMenuLink>
                            </div>
                          </div>

                          {/* Scrollable Content */}
                          <div className="h-[336px] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 scrollbar-track-transparent">
                            <div className="p-4">
                              <div className="grid grid-cols-3 gap-6">
                                {/* Categories - 2 columns with scroll */}
                                <div className="col-span-2 space-y-3">
                                  <div className="grid grid-cols-2 gap-3">
                                    {[
                                      {
                                        name: "React",
                                        subtitle: "Templates",
                                        tag: "react",
                                        icon: Code,
                                        color: "from-blue-500 to-cyan-500",
                                        count: "200+",
                                        badge: "Hot",
                                        badgeColor: "bg-red-100 text-red-700",
                                      },
                                      {
                                        name: "Vue.js",
                                        subtitle: "Templates",
                                        tag: "vue",
                                        icon: Zap,
                                        color: "from-green-500 to-emerald-500",
                                        count: "150+",
                                        badge: "Popular",
                                        badgeColor:
                                          "bg-green-100 text-green-700",
                                      },
                                      {
                                        name: "Angular",
                                        subtitle: "Templates",
                                        tag: "angular",
                                        icon: Globe,
                                        color: "from-red-500 to-pink-500",
                                        count: "100+",
                                        badge: "Enterprise",
                                        badgeColor: "bg-red-100 text-red-700",
                                      },
                                      {
                                        name: "Mobile",
                                        subtitle: "Templates",
                                        tag: "mobile",
                                        icon: Smartphone,
                                        color: "from-purple-500 to-indigo-500",
                                        count: "80+",
                                        badge: "Trending",
                                        badgeColor:
                                          "bg-purple-100 text-purple-700",
                                      },
                                      {
                                        name: "Admin",
                                        subtitle: "Dashboards",
                                        tag: "admin",
                                        icon: Grid,
                                        color: "from-indigo-500 to-purple-500",
                                        count: "120+",
                                        badge: "Pro",
                                        badgeColor:
                                          "bg-indigo-100 text-indigo-700",
                                      },
                                      {
                                        name: "E-commerce",
                                        subtitle: "Templates",
                                        tag: "ecommerce",
                                        icon: Database,
                                        color: "from-teal-500 to-cyan-500",
                                        count: "90+",
                                        badge: null,
                                        badgeColor: null,
                                      },
                                      {
                                        name: "Landing",
                                        subtitle: "Pages",
                                        tag: "landing",
                                        icon: FileText,
                                        color: "from-orange-500 to-red-500",
                                        count: "150+",
                                        badge: "New",
                                        badgeColor:
                                          "bg-orange-100 text-orange-700",
                                      },
                                      {
                                        name: "Design",
                                        subtitle: "Systems",
                                        tag: "design",
                                        icon: Palette,
                                        color: "from-pink-500 to-rose-500",
                                        count: "60+",
                                        badge: "Creative",
                                        badgeColor: "bg-pink-100 text-pink-700",
                                      },
                                      {
                                        name: "SaaS",
                                        subtitle: "Templates",
                                        tag: "saas",
                                        icon: Sparkles,
                                        color: "from-violet-500 to-purple-500",
                                        count: "75+",
                                        badge: "Business",
                                        badgeColor:
                                          "bg-violet-100 text-violet-700",
                                      },
                                      {
                                        name: "Portfolio",
                                        subtitle: "Templates",
                                        tag: "portfolio",
                                        icon: User,
                                        color: "from-emerald-500 to-teal-500",
                                        count: "45+",
                                        badge: "Personal",
                                        badgeColor:
                                          "bg-emerald-100 text-emerald-700",
                                      },
                                    ].map((category, index) => (
                                      <motion.button
                                        key={category.tag}
                                        onClick={() =>
                                          navigate(
                                            `/templates?tag=${category.tag}`,
                                          )
                                        }
                                        className="group p-3 bg-white dark:bg-slate-800 rounded-lg border hover:border-primary/50 hover:shadow-md transition-all duration-300 text-left"
                                        whileHover={{ y: -1 }}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.03 }}
                                      >
                                        {/* Icon */}
                                        <div
                                          className={cn(
                                            "w-10 h-10 rounded-lg bg-gradient-to-r flex items-center justify-center mb-2 group-hover:scale-105 transition-transform duration-300",
                                            category.color,
                                          )}
                                        >
                                          <category.icon className="w-5 h-5 text-white" />
                                        </div>

                                        {/* Content */}
                                        <div className="space-y-1">
                                          <div className="flex items-start justify-between">
                                            <div>
                                              <h4 className="font-semibold text-xs text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                                                {category.name}
                                              </h4>
                                              <p className="text-xs text-muted-foreground">
                                                {category.subtitle}
                                              </p>
                                            </div>
                                            {category.badge && (
                                              <Badge
                                                className={cn(
                                                  "text-xs px-1.5 py-0",
                                                  category.badgeColor,
                                                )}
                                              >
                                                {category.badge}
                                              </Badge>
                                            )}
                                          </div>
                                          <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                            {category.count} templates
                                          </div>
                                        </div>
                                      </motion.button>
                                    ))}
                                  </div>
                                </div>

                                {/* Sidebar - Fixed width */}
                                <div className="space-y-4">
                                  {/* Quick Actions */}
                                  <div>
                                    <h4 className="text-xs font-semibold tracking-wide uppercase text-muted-foreground mb-3">
                                      Quick Actions
                                    </h4>
                                    <div className="space-y-2">
                                      {[
                                        {
                                          title: "Latest",
                                          description: "New releases",
                                          icon: Sparkles,
                                          href: "/templates/latest",
                                          color: "bg-blue-500",
                                          accent: "border-blue-200 bg-blue-50",
                                        },
                                        {
                                          title: "Trending",
                                          description: "Most popular",
                                          icon: TrendingUp,
                                          href: "/templates/trending",
                                          color: "bg-orange-500",
                                          accent:
                                            "border-orange-200 bg-orange-50",
                                        },
                                        {
                                          title: "Premium",
                                          description: "High-end designs",
                                          icon: Crown,
                                          href: "/templates/premium",
                                          color: "bg-yellow-500",
                                          accent:
                                            "border-yellow-200 bg-yellow-50",
                                        },
                                        {
                                          title: "Free",
                                          description: "No cost",
                                          icon: Heart,
                                          href: "/templates/free",
                                          color: "bg-green-500",
                                          accent:
                                            "border-green-200 bg-green-50",
                                        },
                                      ].map((action, index) => (
                                        <motion.div
                                          key={index}
                                          initial={{ opacity: 0, x: 5 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          transition={{
                                            delay: 0.1 + index * 0.03,
                                          }}
                                        >
                                          <Link
                                            to={action.href}
                                            className={cn(
                                              "block p-2 rounded-lg border transition-all duration-300 group hover:shadow-sm",
                                              action.accent,
                                            )}
                                          >
                                            <div className="flex items-center space-x-2">
                                              <div
                                                className={cn(
                                                  "w-6 h-6 rounded flex items-center justify-center text-white group-hover:scale-105 transition-transform duration-300",
                                                  action.color,
                                                )}
                                              >
                                                <action.icon className="w-3 h-3" />
                                              </div>
                                              <div className="flex-1 min-w-0">
                                                <div className="text-xs font-medium text-gray-900 dark:text-white">
                                                  {action.title}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                  {action.description}
                                                </div>
                                              </div>
                                            </div>
                                          </Link>
                                        </motion.div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Featured Template */}
                                  <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg p-3 text-white">
                                    <div className="flex items-center mb-1">
                                      <Star className="w-3 h-3 mr-1" />
                                      <span className="text-xs font-semibold">
                                        Featured
                                      </span>
                                    </div>
                                    <h5 className="text-xs font-medium mb-1">
                                      Modern Dashboard Pro
                                    </h5>
                                    <p className="text-xs opacity-90 mb-2">
                                      Complete admin solution
                                    </p>
                                    <Button
                                      size="sm"
                                      variant="secondary"
                                      className="w-full text-xs h-6"
                                    >
                                      Preview
                                    </Button>
                                  </div>

                                  {/* Tech Stack */}
                                  <div>
                                    <h4 className="text-xs font-semibold tracking-wide uppercase text-muted-foreground mb-2">
                                      Popular Tech
                                    </h4>
                                    <div className="grid grid-cols-2 gap-1">
                                      {[
                                        {
                                          name: "React",
                                          color: "bg-blue-100 text-blue-700",
                                        },
                                        {
                                          name: "Vue",
                                          color: "bg-green-100 text-green-700",
                                        },
                                        {
                                          name: "Next.js",
                                          color: "bg-gray-100 text-gray-700",
                                        },
                                        {
                                          name: "Tailwind",
                                          color: "bg-cyan-100 text-cyan-700",
                                        },
                                      ].map((tech, index) => (
                                        <Badge
                                          key={index}
                                          className={cn(
                                            "text-xs justify-center",
                                            tech.color,
                                          )}
                                        >
                                          {tech.name}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Admin Tools Compact */}
                                  {user && isAdmin(user) && (
                                    <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                                      <h4 className="text-xs font-semibold tracking-wide uppercase text-muted-foreground mb-2 flex items-center">
                                        <Shield className="w-3 h-3 mr-1" />
                                        Admin
                                      </h4>
                                      <div className="space-y-1">
                                        {[
                                          {
                                            title: "Manage",
                                            icon: Package,
                                            href: "/admin/templates",
                                          },
                                          {
                                            title: "Analytics",
                                            icon: BarChart3,
                                            href: "/admin/templates/analytics",
                                          },
                                        ].map((tool, index) => (
                                          <Link
                                            key={index}
                                            to={tool.href}
                                            className="flex items-center space-x-2 p-1.5 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group"
                                          >
                                            <tool.icon className="w-3 h-3 text-blue-600" />
                                            <span className="text-xs font-medium group-hover:text-blue-700">
                                              {tool.title}
                                            </span>
                                          </Link>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Scroll Indicator */}
                          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground opacity-50">
                            <div className="flex items-center space-x-1">
                              <div className="w-1 h-1 bg-current rounded-full animate-pulse"></div>
                              <span>Scroll for more</span>
                              <div className="w-1 h-1 bg-current rounded-full animate-pulse"></div>
                            </div>
                          </div>
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>

                    {/* E-books Dropdown - Compact Design with Scroll */}
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="group h-12 px-6 rounded-xl font-medium">
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
                        <div className="w-[520px] h-[400px] bg-white dark:bg-slate-900 shadow-xl border-0 rounded-xl overflow-hidden">
                          {/* Fixed Header */}
                          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-4 border-b">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-lg font-bold text-transparent bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text">
                                  E-book Categories
                                </h3>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  Premium content for developers
                                </p>
                              </div>
                              <NavigationMenuLink asChild>
                                <Link
                                  to="/ebooks"
                                  className="flex items-center space-x-1 px-3 py-1.5 bg-white dark:bg-slate-800 rounded-lg hover:bg-gray-50 transition-colors text-xs font-medium border"
                                >
                                  <span>Xem tất cả</span>
                                  <ArrowRight className="w-3 h-3" />
                                </Link>
                              </NavigationMenuLink>
                            </div>
                          </div>

                          {/* Scrollable Content */}
                          <div className="h-[336px] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 scrollbar-track-transparent">
                            <div className="p-4">
                              <div className="grid grid-cols-3 gap-6">
                                {/* Categories - 2 columns with scroll */}
                                <div className="col-span-2 space-y-3">
                                  <div className="grid grid-cols-2 gap-3">
                                    {[
                                      {
                                        name: "JavaScript",
                                        subtitle: "& TypeScript",
                                        tag: "javascript",
                                        icon: Code,
                                        color: "from-yellow-400 to-orange-500",
                                        count: "80+",
                                        badge: "Hot",
                                        badgeColor: "bg-red-100 text-red-700",
                                      },
                                      {
                                        name: "React",
                                        subtitle: "& Next.js",
                                        tag: "react",
                                        icon: Zap,
                                        color: "from-blue-400 to-cyan-500",
                                        count: "60+",
                                        badge: "Popular",
                                        badgeColor: "bg-blue-100 text-blue-700",
                                      },
                                      {
                                        name: "UI/UX",
                                        subtitle: "Design",
                                        tag: "design",
                                        icon: Palette,
                                        color: "from-pink-400 to-rose-500",
                                        count: "40+",
                                        badge: "Creative",
                                        badgeColor: "bg-pink-100 text-pink-700",
                                      },
                                      {
                                        name: "Backend",
                                        subtitle: "Development",
                                        tag: "backend",
                                        icon: Database,
                                        color: "from-green-400 to-emerald-500",
                                        count: "50+",
                                        badge: null,
                                        badgeColor: null,
                                      },
                                      {
                                        name: "DevOps",
                                        subtitle: "& Cloud",
                                        tag: "devops",
                                        icon: Settings,
                                        color: "from-purple-400 to-violet-500",
                                        count: "30+",
                                        badge: "New",
                                        badgeColor:
                                          "bg-purple-100 text-purple-700",
                                      },
                                      {
                                        name: "Mobile",
                                        subtitle: "Development",
                                        tag: "mobile",
                                        icon: Smartphone,
                                        color: "from-indigo-400 to-purple-500",
                                        count: "35+",
                                        badge: "Trending",
                                        badgeColor:
                                          "bg-indigo-100 text-indigo-700",
                                      },
                                      {
                                        name: "Data Science",
                                        subtitle: "& AI/ML",
                                        tag: "datascience",
                                        icon: BarChart3,
                                        color: "from-emerald-400 to-teal-500",
                                        count: "25+",
                                        badge: "AI",
                                        badgeColor:
                                          "bg-emerald-100 text-emerald-700",
                                      },
                                      {
                                        name: "Security",
                                        subtitle: "& Testing",
                                        tag: "security",
                                        icon: Shield,
                                        color: "from-red-400 to-pink-500",
                                        count: "20+",
                                        badge: "Expert",
                                        badgeColor: "bg-red-100 text-red-700",
                                      },
                                    ].map((category, index) => (
                                      <motion.button
                                        key={category.tag}
                                        onClick={() =>
                                          navigate(
                                            `/ebooks?tag=${category.tag}`,
                                          )
                                        }
                                        className="group p-3 bg-white dark:bg-slate-800 rounded-lg border hover:border-primary/50 hover:shadow-md transition-all duration-300 text-left"
                                        whileHover={{ y: -1 }}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.03 }}
                                      >
                                        {/* Icon */}
                                        <div
                                          className={cn(
                                            "w-10 h-10 rounded-lg bg-gradient-to-r flex items-center justify-center mb-2 group-hover:scale-105 transition-transform duration-300",
                                            category.color,
                                          )}
                                        >
                                          <category.icon className="w-5 h-5 text-white" />
                                        </div>

                                        {/* Content */}
                                        <div className="space-y-1">
                                          <div className="flex items-start justify-between">
                                            <div>
                                              <h4 className="font-semibold text-xs text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                                                {category.name}
                                              </h4>
                                              <p className="text-xs text-muted-foreground">
                                                {category.subtitle}
                                              </p>
                                            </div>
                                            {category.badge && (
                                              <Badge
                                                className={cn(
                                                  "text-xs px-1.5 py-0",
                                                  category.badgeColor,
                                                )}
                                              >
                                                {category.badge}
                                              </Badge>
                                            )}
                                          </div>
                                          <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                            {category.count} books
                                          </div>
                                        </div>
                                      </motion.button>
                                    ))}
                                  </div>
                                </div>

                                {/* Sidebar - Fixed width */}
                                <div className="space-y-4">
                                  {/* Quick Actions */}
                                  <div>
                                    <h4 className="text-xs font-semibold tracking-wide uppercase text-muted-foreground mb-3">
                                      Quick Actions
                                    </h4>
                                    <div className="space-y-2">
                                      {[
                                        {
                                          title: "Free",
                                          description: "No cost",
                                          icon: Heart,
                                          href: "/ebooks/free",
                                          color: "bg-green-500",
                                          accent:
                                            "border-green-200 bg-green-50",
                                        },
                                        {
                                          title: "Premium",
                                          description: "Expert content",
                                          icon: Crown,
                                          href: "/ebooks/premium",
                                          color: "bg-yellow-500",
                                          accent:
                                            "border-yellow-200 bg-yellow-50",
                                        },
                                        {
                                          title: "Latest",
                                          description: "New releases",
                                          icon: Sparkles,
                                          href: "/ebooks/latest",
                                          color: "bg-blue-500",
                                          accent: "border-blue-200 bg-blue-50",
                                        },
                                      ].map((action, index) => (
                                        <motion.div
                                          key={index}
                                          initial={{ opacity: 0, x: 5 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          transition={{
                                            delay: 0.1 + index * 0.03,
                                          }}
                                        >
                                          <Link
                                            to={action.href}
                                            className={cn(
                                              "block p-2 rounded-lg border transition-all duration-300 group hover:shadow-sm",
                                              action.accent,
                                            )}
                                          >
                                            <div className="flex items-center space-x-2">
                                              <div
                                                className={cn(
                                                  "w-6 h-6 rounded flex items-center justify-center text-white group-hover:scale-105 transition-transform duration-300",
                                                  action.color,
                                                )}
                                              >
                                                <action.icon className="w-3 h-3" />
                                              </div>
                                              <div className="flex-1 min-w-0">
                                                <div className="text-xs font-medium text-gray-900 dark:text-white">
                                                  {action.title}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                  {action.description}
                                                </div>
                                              </div>
                                            </div>
                                          </Link>
                                        </motion.div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Featured Compact */}
                                  <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg p-3 text-white">
                                    <div className="flex items-center mb-1">
                                      <Crown className="w-3 h-3 mr-1" />
                                      <span className="text-xs font-semibold">
                                        Featured
                                      </span>
                                    </div>
                                    <h5 className="text-xs font-medium mb-1">
                                      React Complete Guide
                                    </h5>
                                    <p className="text-xs opacity-90 mb-2">
                                      From basics to advanced
                                    </p>
                                    <Button
                                      size="sm"
                                      variant="secondary"
                                      className="w-full text-xs h-6"
                                    >
                                      Get Now
                                    </Button>
                                  </div>

                                  {/* Admin Tools Compact */}
                                  {user && isAdmin(user) && (
                                    <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                                      <h4 className="text-xs font-semibold tracking-wide uppercase text-muted-foreground mb-2 flex items-center">
                                        <Shield className="w-3 h-3 mr-1" />
                                        Admin
                                      </h4>
                                      <div className="space-y-1">
                                        {[
                                          {
                                            title: "Manage",
                                            icon: BookOpen,
                                            href: "/admin/ebooks",
                                          },
                                          {
                                            title: "Analytics",
                                            icon: BarChart3,
                                            href: "/admin/ebooks/analytics",
                                          },
                                        ].map((tool, index) => (
                                          <Link
                                            key={index}
                                            to={tool.href}
                                            className="flex items-center space-x-2 p-1.5 rounded hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors group"
                                          >
                                            <tool.icon className="w-3 h-3 text-purple-600" />
                                            <span className="text-xs font-medium group-hover:text-purple-700">
                                              {tool.title}
                                            </span>
                                          </Link>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Scroll Indicator */}
                          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground opacity-50">
                            <div className="flex items-center space-x-1">
                              <div className="w-1 h-1 bg-current rounded-full animate-pulse"></div>
                              <span>Scroll for more</span>
                              <div className="w-1 h-1 bg-current rounded-full animate-pulse"></div>
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
                          className="inline-flex h-12 w-max items-center justify-center rounded-xl px-6 py-2 text-sm font-medium hover:bg-muted transition-colors"
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
                          className="inline-flex h-12 w-max items-center justify-center rounded-xl px-6 py-2 text-sm font-medium hover:bg-muted transition-colors"
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
                            className="inline-flex h-12 w-max items-center justify-center rounded-xl px-6 py-2 text-sm font-medium hover:bg-purple-50 hover:text-purple-700 transition-colors"
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
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
