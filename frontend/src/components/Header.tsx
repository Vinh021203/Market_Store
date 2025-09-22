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
  LayoutTemplate,
  Lightbulb,
  Target,
  PenTool,
  Camera,
  LineChart,
  DollarSign,
  Briefcase,
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
  // ✨ Pastel Color Schemes - Pink Theme
  const pastelColors = {
    // Top Bar Colors
    topBar: {
      background: "from-pink-100/90 via-rose-100/90 to-red-100/90",
      text: "text-slate-700",
      hover: "hover:text-pink-600",
      promotionBg: "bg-white/70 backdrop-blur-sm",
      promotionBorder: "border-pink-200/50",
      badge: "bg-pink-200 text-pink-800",
      socialHover: "hover:bg-white/30",
    },
    // Main Header Colors
    mainHeader: {
      background:
        "bg-gradient-to-r from-pink-50/95 via-rose-50/95 to-red-50/95 backdrop-blur-lg",
      border: "border-pink-200/50",
      logoBg: "from-pink-500 via-rose-500 to-red-500",
      logoDot: "bg-pink-300",
      searchBg: "bg-gradient-to-r from-white/90 via-pink-50/60 to-rose-50/40",
      searchBorder: "border-pink-200",
      searchFocus: "focus:border-pink-300 focus:ring-pink-200/50",
      buttonHover: "hover:bg-pink-50",
      authButton: "from-pink-500 via-rose-500 to-red-500",
    },
    // Navigation Colors
    navigation: {
      background:
        "bg-gradient-to-r from-pink-50/90 via-rose-50/90 to-red-50/90 backdrop-blur-sm",
      border: "border-pink-200/40",
      navHover: "hover:bg-pink-50",
      badgeHot: "bg-pink-100 text-pink-700",
      badgeNew: "bg-rose-100 text-rose-700",
      adminHover: "hover:bg-pink-50 hover:text-pink-700",
      adminBadge: "bg-pink-100 text-pink-800",
    },
    // Dropdown Colors
    dropdown: {
      headerBg:
        "from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20",
      titleGradient: "from-pink-600 to-rose-600",
      cardBg: "bg-white/95 dark:bg-slate-800/95",
      cardHover: "hover:border-pink-300/50",
      featuredBg: "from-pink-500 to-rose-500",
      actionColors: [
        { bg: "bg-pink-500", accent: "border-pink-200 bg-pink-50" },
        { bg: "bg-rose-500", accent: "border-rose-200 bg-rose-50" },
        { bg: "bg-red-500", accent: "border-red-200 bg-red-50" },
        { bg: "bg-orange-500", accent: "border-orange-200 bg-orange-50" },
      ],
    },
  };

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

  return (
    <>
      {/* Floating Background Elements - Pink Theme */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {[
          { emoji: "🌸", color: "from-pink-100 to-rose-200" },
          { emoji: "💖", color: "from-rose-100 to-pink-200" },
          { emoji: "🌷", color: "from-red-100 to-pink-200" },
          { emoji: "💫", color: "from-orange-100 to-red-200" },
          { emoji: "✨", color: "from-pink-100 to-orange-200" },
        ].map((item, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl opacity-10"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, -10, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i,
            }}
          >
            <motion.div
              className={`p-2 rounded-full bg-gradient-to-r ${item.color} backdrop-blur-sm shadow-lg`}
              whileHover={{ scale: 1.3, rotate: 20 }}
            >
              <span>{item.emoji}</span>
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Header Container */}
      <motion.header
        className="sticky top-0 z-50 w-full"
        animate={{
          y: headerState.isHidden ? -100 : 0,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
      >
        {/* ===== TOP BAR - Promotional/Info ===== */}
        <AnimatePresence>
          {headerState.showTopBar && (
            <motion.div
              initial={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                opacity: topBarOpacity,
                height: topBarHeight,
              }}
              className={`bg-gradient-to-r ${pastelColors.topBar.background} border-b border-pink-200/30`}
            >
              <div className="container mx-auto px-3 sm:px-4 lg:px-6">
                <div className="flex items-center justify-between py-2 text-xs sm:text-sm">
                  {/* Left: Promotion */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="flex items-center space-x-2"
                  >
                    <div
                      className={`${pastelColors.topBar.promotionBg} border ${pastelColors.topBar.promotionBorder} px-2 py-1 rounded-full flex items-center space-x-2`}
                    >
                      <Gift className="w-3 h-3 text-pink-600" />
                      <span className="font-medium text-pink-700">
                        🎉 Template Sale 50% OFF
                      </span>
                      <Badge className={pastelColors.topBar.badge}>
                        Limited
                      </Badge>
                    </div>
                  </motion.div>

                  {/* Center: Contact Info - Hidden on mobile */}
                  <div className="hidden md:flex items-center space-x-4 text-slate-600">
                    <div className="flex items-center space-x-1">
                      <PhoneCall className="w-3 h-3" />
                      <span>+84 123 456 789</span>
                    </div>
                    <div className="w-px h-3 bg-pink-300/50"></div>
                    <div className="flex items-center space-x-1">
                      <Mail className="w-3 h-3" />
                      <span>hello@templatemarket.com</span>
                    </div>
                  </div>

                  {/* Right: Social & User */}
                  <div className="flex items-center space-x-2 sm:space-x-4">
                    {/* Social Links - Hidden on mobile */}
                    <div className="hidden lg:flex items-center space-x-1">
                      {[
                        { icon: Facebook, href: "#", color: "text-blue-600" },
                        { icon: Instagram, href: "#", color: "text-pink-600" },
                        { icon: Twitter, href: "#", color: "text-sky-600" },
                      ].map((social, index) => (
                        <motion.a
                          key={index}
                          href={social.href}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          className={`p-1.5 rounded-full ${pastelColors.topBar.socialHover} ${social.color} transition-colors`}
                        >
                          <social.icon className="w-3 h-3" />
                        </motion.a>
                      ))}
                    </div>

                    <div className="w-px h-3 bg-pink-300/50"></div>

                    {/* User Status */}
                    {user ? (
                      <motion.div
                        className="flex items-center space-x-2"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <span className="text-xs">Xin chào, {user.name}</span>
                        {isAdmin(user) && (
                          <Badge
                            className={`px-1 py-0 text-xs ${pastelColors.topBar.badge}`}
                          >
                            <Crown className="w-2 h-2 mr-1" />
                            Admin
                          </Badge>
                        )}
                      </motion.div>
                    ) : (
                      <span className="text-xs">Cần hỗ trợ? Liên hệ ngay!</span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===== MAIN HEADER - Mobile Optimized ===== */}
        <motion.div
          className={`${pastelColors.mainHeader.background} border-b ${pastelColors.mainHeader.border}`}
          style={{ padding: headerPadding }}
        >
          <div className="container mx-auto px-4">
            <motion.div
              className="flex items-center justify-between"
              animate={{
                height: headerState.isCollapsed ? 48 : 56,
              }}
              transition={{ duration: 0.3 }}
            >
              {/* Logo */}
              <Link
                to="/"
                className="flex items-center space-x-2 sm:space-x-3 group"
              >
                <motion.div
                  style={{ scale: logoScale }}
                  whileHover={{ scale: 1.05, rotate: 3 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 flex items-center justify-center bg-gradient-to-br ${pastelColors.mainHeader.logoBg} rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300`}
                >
                  <LayoutTemplate className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white font-bold" />
                  <motion.div
                    className={`absolute w-1.5 h-1.5 sm:w-2 sm:h-2 ${pastelColors.mainHeader.logoDot} rounded-full -top-0.5 -right-0.5 sm:-top-1 sm:-right-1`}
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>

                <div className="flex flex-col">
                  <motion.h1
                    className="text-base sm:text-lg lg:text-xl font-bold text-transparent bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 bg-clip-text"
                    animate={{ opacity: headerState.isCollapsed ? 0.7 : 1 }}
                  >
                    Template Market
                  </motion.h1>
                  <AnimatePresence>
                    {!headerState.isCollapsed && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="hidden sm:block text-xs text-muted-foreground -mt-1"
                      >
                        Welcome back to creativity 🎨
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </Link>

              {/* Search Bar - Desktop Only */}
              <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
                <motion.form
                  onSubmit={handleSearch}
                  className="relative w-full group"
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <div
                    className={`relative ${pastelColors.mainHeader.searchBg} backdrop-blur-sm rounded-xl border ${pastelColors.mainHeader.searchBorder} ${isSearchFocused ? pastelColors.mainHeader.searchFocus : ""} transition-all duration-300 group-hover:shadow-md`}
                  >
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-pink-500" />
                    <Input
                      type="text"
                      placeholder="Tìm templates, components, e-books..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() => setIsSearchFocused(false)}
                      className="pl-12 pr-4 py-3 w-full bg-transparent border-0 focus:ring-0 placeholder:text-pink-400"
                    />
                  </div>
                </motion.form>
              </div>

              {/* Action Buttons - Mobile Optimized */}
              <div className="flex items-center space-x-1 sm:space-x-2">
                {/* Mobile Search */}
                <Button
                  variant="ghost"
                  size="sm"
                  className={`lg:hidden p-1.5 sm:p-2 ${pastelColors.mainHeader.buttonHover}`}
                >
                  <Search className="w-4 h-4" />
                </Button>

                {/* Cart - Always Visible */}
                <Button
                  variant="ghost"
                  size="sm"
                  className={`relative p-1.5 sm:p-2 ${pastelColors.mainHeader.buttonHover}`}
                  asChild
                >
                  <Link to="/cart">
                    <ShoppingCart className="w-4 h-4" />
                    {totalItems > 0 && (
                      <Badge className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center p-0 text-xs bg-pink-500">
                        {totalItems}
                      </Badge>
                    )}
                  </Link>
                </Button>

                {/* User Menu or Auth - Always Visible */}
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative h-7 w-7 sm:h-8 sm:w-8 rounded-full"
                      >
                        <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback className="bg-gradient-to-br from-pink-400 to-rose-500 text-white text-xs">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {isAdmin(user) && (
                        <>
                          <DropdownMenuItem asChild>
                            <Link to="/admin">
                              <Shield className="mr-2 h-4 w-4" />
                              Admin Panel
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </>
                      )}
                      <DropdownMenuItem asChild>
                        <Link to="/profile">
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/wishlist">
                          <Heart className="mr-2 h-4 w-4" />
                          Wishlist ({totalWishlistItems})
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/orders">
                          <Package className="mr-2 h-4 w-4" />
                          Orders
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hidden sm:flex text-xs sm:text-sm px-2 sm:px-3"
                      asChild
                    >
                      <Link to="/auth/login">Đăng nhập</Link>
                    </Button>
                    <Button
                      size="sm"
                      className={`bg-gradient-to-r ${pastelColors.mainHeader.authButton} text-white text-xs sm:text-sm px-2 sm:px-4 h-8 sm:h-9`}
                      asChild
                    >
                      <Link to="/auth/register">Đăng ký</Link>
                    </Button>
                  </div>
                )}

                {/* Mobile Menu */}
                <Sheet
                  open={isMobileMenuOpen}
                  onOpenChange={setIsMobileMenuOpen}
                >
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`lg:hidden p-1.5 sm:p-2 ${pastelColors.mainHeader.buttonHover}`}
                    >
                      <Menu className="w-4 h-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-72">
                    <SheetHeader>
                      <SheetTitle className="text-left">
                        Template Market
                      </SheetTitle>
                      <SheetDescription className="text-left">
                        Premium template store
                      </SheetDescription>
                    </SheetHeader>

                    {/* Mobile Menu Items - Compact */}
                    <div className="mt-6 space-y-2">
                      {[
                        {
                          name: "Templates",
                          href: "/templates",
                          icon: LayoutTemplate,
                          badge: "Hot",
                        },
                        {
                          name: "E-books",
                          href: "/ebooks",
                          icon: BookOpen,
                          badge: "New",
                        },
                        { name: "Pricing", href: "/pricing", icon: Tag },
                        { name: "Blog", href: "/blog", icon: FileText },
                      ].map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-pink-50 transition-colors group"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <div className="flex items-center space-x-3">
                            <item.icon className="w-5 h-5 text-pink-600" />
                            <span className="font-medium">{item.name}</span>
                          </div>
                          {item.badge && (
                            <Badge className="bg-pink-100 text-pink-700 text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
                      ))}
                    </div>

                    {/* User Actions - Compact */}
                    {!user && (
                      <div className="mt-6 pt-4 border-t space-y-2">
                        <Button asChild className="w-full" variant="outline">
                          <Link to="/auth/login">Đăng nhập</Link>
                        </Button>
                        <Button
                          asChild
                          className="w-full bg-gradient-to-r from-pink-500 to-rose-500"
                        >
                          <Link to="/auth/register">Đăng ký</Link>
                        </Button>
                      </div>
                    )}

                    {/* Theme Toggle - Compact */}
                    <div className="mt-6 pt-4 border-t">
                      <p className="text-sm font-semibold mb-3">Giao diện</p>
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
                            className="flex flex-col items-center gap-1 h-auto py-2"
                          >
                            <themeOption.icon className="w-3 h-3" />
                            <span className="text-xs">{themeOption.label}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* ===== NAVIGATION MENU - Desktop Only - NO SPACING ===== */}
        <AnimatePresence>
          {!headerState.isCollapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className={`hidden lg:block ${pastelColors.navigation.background} border-b ${pastelColors.navigation.border}`}
            >
              <div className="container px-4 mx-auto">
                <div className="relative flex justify-center py-3">
                  <NavigationMenu>
                    {/* ===== NAVIGATION LIST - NO SPACING ===== */}
                    <NavigationMenuList className="flex items-center gap-0">
                      {/* ===== TEMPLATES - NO SPACING ===== */}
                      <NavigationMenuItem>
                        <NavigationMenuTrigger
                          className={`group h-10 px-4 rounded-lg font-medium ${pastelColors.navigation.navHover} transition-colors flex items-center gap-2`}
                        >
                          <Package className="w-4 h-4" />
                          Templates
                          <Badge
                            className={`${pastelColors.navigation.badgeHot}`}
                          >
                            Hot
                          </Badge>
                        </NavigationMenuTrigger>
                        <NavigationMenuContent className="z-[9999]">
                          {/* Templates Mega Menu Content */}
                          <div className="w-[600px] h-[450px] bg-white dark:bg-slate-900 shadow-2xl border-0 rounded-xl overflow-hidden">
                            {/* Header */}
                            <div
                              className={`bg-gradient-to-r ${pastelColors.dropdown.headerBg} p-4 border-b border-pink-200/50`}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3
                                    className={`text-lg font-bold text-transparent bg-gradient-to-r ${pastelColors.dropdown.titleGradient} bg-clip-text`}
                                  >
                                    Template Categories
                                  </h3>
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    Premium templates for modern web
                                  </p>
                                </div>
                                <NavigationMenuLink asChild>
                                  <Link
                                    to="/templates"
                                    className={`flex items-center space-x-1 px-3 py-1.5 ${pastelColors.dropdown.cardBg} rounded-lg hover:bg-pink-50 transition-colors text-xs font-medium border border-pink-200/50`}
                                  >
                                    <span>Xem tất cả</span>
                                    <ArrowRight className="w-3 h-3" />
                                  </Link>
                                </NavigationMenuLink>
                              </div>
                            </div>

                            {/* Content */}
                            <div className="h-[386px] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-pink-300 hover:scrollbar-thumb-pink-400 scrollbar-track-transparent">
                              <div className="p-4">
                                <div className="grid grid-cols-4 gap-4">
                                  {/* Categories */}
                                  <div className="col-span-3">
                                    <div className="grid grid-cols-3 gap-3">
                                      {[
                                        {
                                          name: "React Templates",
                                          subtitle: "Components",
                                          tag: "react",
                                          icon: Code,
                                          color: "from-pink-400 to-rose-500",
                                          count: "200+",
                                          badge: "Hot",
                                          badgeColor:
                                            pastelColors.navigation.badgeHot,
                                        },
                                        {
                                          name: "Vue Templates",
                                          subtitle: "Templates",
                                          tag: "vue",
                                          icon: Zap,
                                          color: "from-rose-400 to-red-500",
                                          count: "150+",
                                          badge: "Popular",
                                          badgeColor:
                                            pastelColors.navigation.badgeNew,
                                        },
                                        {
                                          name: "HTML Templates",
                                          subtitle: "Static",
                                          tag: "html",
                                          icon: Globe,
                                          color: "from-orange-400 to-pink-500",
                                          count: "100+",
                                        },
                                        {
                                          name: "Mobile Apps",
                                          subtitle: "Apps",
                                          tag: "mobile",
                                          icon: Smartphone,
                                          color: "from-purple-400 to-pink-500",
                                          count: "80+",
                                          badge: "New",
                                          badgeColor:
                                            "bg-purple-100 text-purple-700",
                                        },
                                        {
                                          name: "Admin Panels",
                                          subtitle: "Dashboards",
                                          tag: "admin",
                                          icon: Grid,
                                          color: "from-red-400 to-pink-500",
                                          count: "120+",
                                          badge: "Pro",
                                          badgeColor: "bg-red-100 text-red-700",
                                        },
                                        {
                                          name: "E-commerce",
                                          subtitle: "Stores",
                                          tag: "ecommerce",
                                          icon: Database,
                                          color: "from-pink-400 to-red-500",
                                          count: "90+",
                                        },
                                      ].map((category, index) => (
                                        <motion.button
                                          key={category.tag}
                                          onClick={() =>
                                            navigate(
                                              `/templates?tag=${category.tag}`,
                                            )
                                          }
                                          className={`group p-3 ${pastelColors.dropdown.cardBg} rounded-lg border border-pink-200/30 ${pastelColors.dropdown.cardHover} hover:shadow-md transition-all duration-300 text-left`}
                                          whileHover={{ y: -1 }}
                                          initial={{ opacity: 0, y: 10 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          transition={{ delay: index * 0.03 }}
                                        >
                                          <div
                                            className={cn(
                                              "w-8 h-8 rounded-lg bg-gradient-to-r flex items-center justify-center mb-2 group-hover:scale-105 transition-transform duration-300",
                                              category.color,
                                            )}
                                          >
                                            <category.icon className="w-4 h-4 text-white" />
                                          </div>

                                          <div>
                                            <div className="font-medium text-sm text-gray-900 dark:text-gray-100 group-hover:text-pink-700 transition-colors duration-300">
                                              {category.name}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                              {category.subtitle}
                                            </div>
                                            <div className="flex items-center justify-between mt-1">
                                              <span className="text-xs font-semibold text-pink-600">
                                                {category.count}
                                              </span>
                                              {category.badge && (
                                                <Badge
                                                  className={`text-xs px-1.5 py-0 ${category.badgeColor}`}
                                                >
                                                  {category.badge}
                                                </Badge>
                                              )}
                                            </div>
                                          </div>
                                        </motion.button>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Featured Section */}
                                  <div className="col-span-1">
                                    <div className="space-y-4">
                                      <div>
                                        <h4 className="text-sm font-semibold text-pink-700 mb-2">
                                          Featured
                                        </h4>
                                        <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-3 rounded-lg border border-pink-200">
                                          <div className="aspect-video bg-pink-200 rounded-md mb-2"></div>
                                          <div className="space-y-1">
                                            <div className="font-medium text-sm">
                                              Pastel Dashboard Pro
                                            </div>
                                            <div className="flex items-center justify-between">
                                              <span className="text-xs text-muted-foreground">
                                                ⭐ 4.9
                                              </span>
                                              <span className="font-bold text-pink-600">
                                                $49
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      <div>
                                        <h4 className="text-sm font-semibold text-pink-700 mb-2">
                                          Quick Actions
                                        </h4>
                                        <div className="space-y-2">
                                          {[
                                            {
                                              name: "Browse All",
                                              href: "/templates",
                                              icon: Grid,
                                            },
                                            {
                                              name: "Free Templates",
                                              href: "/templates/free",
                                              icon: Gift,
                                            },
                                            {
                                              name: "Premium",
                                              href: "/templates/premium",
                                              icon: Crown,
                                            },
                                          ].map((action, actionIndex) => (
                                            <NavigationMenuLink
                                              key={actionIndex}
                                              className="flex items-center space-x-2 p-2 text-sm hover:bg-pink-50 rounded-md transition-colors"
                                              href={action.href}
                                            >
                                              <action.icon className="w-4 h-4 text-pink-600" />
                                              <span>{action.name}</span>
                                            </NavigationMenuLink>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </NavigationMenuContent>
                      </NavigationMenuItem>

                      {/* ===== E-BOOKS - ENHANCED MEGA MENU LIKE TEMPLATES ===== */}
                      <NavigationMenuItem>
                        <NavigationMenuTrigger
                          className={`group h-10 px-4 rounded-lg font-medium ${pastelColors.navigation.navHover} transition-colors flex items-center gap-2`}
                        >
                          <BookOpen className="w-4 h-4" />
                          E-books
                          <Badge
                            className={`${pastelColors.navigation.badgeNew}`}
                          >
                            New
                          </Badge>
                        </NavigationMenuTrigger>
                        <NavigationMenuContent className="z-[9999]">
                          {/* E-books Mega Menu - Enhanced Like Templates */}
                          <div className="w-[600px] h-[450px] bg-white dark:bg-slate-900 shadow-2xl border-0 rounded-xl overflow-hidden">
                            {/* Header */}
                            <div
                              className={`bg-gradient-to-r ${pastelColors.dropdown.headerBg} p-4 border-b border-pink-200/50`}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3
                                    className={`text-lg font-bold text-transparent bg-gradient-to-r ${pastelColors.dropdown.titleGradient} bg-clip-text`}
                                  >
                                    Digital E-books
                                  </h3>
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    Learn from expert guides & tutorials
                                  </p>
                                </div>
                                <NavigationMenuLink asChild>
                                  <Link
                                    to="/ebooks"
                                    className={`flex items-center space-x-1 px-3 py-1.5 ${pastelColors.dropdown.cardBg} rounded-lg hover:bg-pink-50 transition-colors text-xs font-medium border border-pink-200/50`}
                                  >
                                    <span>Browse All</span>
                                    <ArrowRight className="w-3 h-3" />
                                  </Link>
                                </NavigationMenuLink>
                              </div>
                            </div>

                            {/* Content */}
                            <div className="h-[386px] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-pink-300 hover:scrollbar-thumb-pink-400 scrollbar-track-transparent">
                              <div className="p-4">
                                <div className="grid grid-cols-4 gap-4">
                                  {/* E-book Categories */}
                                  <div className="col-span-3">
                                    <div className="grid grid-cols-3 gap-3">
                                      {[
                                        {
                                          name: "Design Systems",
                                          subtitle: "UI/UX Guide",
                                          tag: "design-systems",
                                          icon: Palette,
                                          color: "from-pink-400 to-rose-500",
                                          count: "25+",
                                          badge: "Popular",
                                          badgeColor:
                                            pastelColors.navigation.badgeHot,
                                        },
                                        {
                                          name: "React Mastery",
                                          subtitle: "Frontend Guide",
                                          tag: "react-mastery",
                                          icon: Code,
                                          color: "from-rose-400 to-red-500",
                                          count: "18+",
                                          badge: "New",
                                          badgeColor:
                                            pastelColors.navigation.badgeNew,
                                        },
                                        {
                                          name: "CSS Animation",
                                          subtitle: "Motion Guide",
                                          tag: "css-animation",
                                          icon: Sparkles,
                                          color: "from-orange-400 to-pink-500",
                                          count: "12+",
                                          badge: "Trending",
                                          badgeColor:
                                            "bg-orange-100 text-orange-700",
                                        },
                                        {
                                          name: "Business Guide",
                                          subtitle: "Startup Tips",
                                          tag: "business",
                                          icon: TrendingUp,
                                          color: "from-purple-400 to-pink-500",
                                          count: "20+",
                                          badge: "Essential",
                                          badgeColor:
                                            "bg-purple-100 text-purple-700",
                                        },
                                        {
                                          name: "Photography",
                                          subtitle: "Visual Guide",
                                          tag: "photography",
                                          icon: Camera,
                                          color: "from-blue-400 to-purple-500",
                                          count: "15+",
                                          badge: "Creative",
                                          badgeColor:
                                            "bg-blue-100 text-blue-700",
                                        },
                                        {
                                          name: "Marketing",
                                          subtitle: "Growth Guide",
                                          tag: "marketing",
                                          icon: Target,
                                          color: "from-green-400 to-teal-500",
                                          count: "22+",
                                          badge: "Pro",
                                          badgeColor:
                                            "bg-green-100 text-green-700",
                                        },
                                      ].map((ebook, index) => (
                                        <motion.button
                                          key={ebook.tag}
                                          onClick={() =>
                                            navigate(
                                              `/ebooks?category=${ebook.tag}`,
                                            )
                                          }
                                          className={`group p-3 ${pastelColors.dropdown.cardBg} rounded-lg border border-pink-200/30 ${pastelColors.dropdown.cardHover} hover:shadow-md transition-all duration-300 text-left`}
                                          whileHover={{ y: -1 }}
                                          initial={{ opacity: 0, y: 10 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          transition={{ delay: index * 0.03 }}
                                        >
                                          <div
                                            className={cn(
                                              "w-8 h-8 rounded-lg bg-gradient-to-r flex items-center justify-center mb-2 group-hover:scale-105 transition-transform duration-300",
                                              ebook.color,
                                            )}
                                          >
                                            <ebook.icon className="w-4 h-4 text-white" />
                                          </div>

                                          <div>
                                            <div className="font-medium text-sm text-gray-900 dark:text-gray-100 group-hover:text-pink-700 transition-colors duration-300">
                                              {ebook.name}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                              {ebook.subtitle}
                                            </div>
                                            <div className="flex items-center justify-between mt-1">
                                              <span className="text-xs font-semibold text-pink-600">
                                                {ebook.count}
                                              </span>
                                              {ebook.badge && (
                                                <Badge
                                                  className={`text-xs px-1.5 py-0 ${ebook.badgeColor}`}
                                                >
                                                  {ebook.badge}
                                                </Badge>
                                              )}
                                            </div>
                                          </div>
                                        </motion.button>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Featured E-book Section */}
                                  <div className="col-span-1">
                                    <div className="space-y-4">
                                      <div>
                                        <h4 className="text-sm font-semibold text-pink-700 mb-2">
                                          Featured
                                        </h4>
                                        <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-3 rounded-lg border border-pink-200">
                                          <div className="aspect-video bg-pink-200 rounded-md mb-2 flex items-center justify-center">
                                            <BookOpen className="w-8 h-8 text-pink-400" />
                                          </div>
                                          <div className="space-y-1">
                                            <div className="font-medium text-sm">
                                              Ultimate Design Guide
                                            </div>
                                            <div className="flex items-center justify-between">
                                              <span className="text-xs text-muted-foreground">
                                                ⭐ 4.8
                                              </span>
                                              <span className="font-bold text-pink-600">
                                                $29
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      <div>
                                        <h4 className="text-sm font-semibold text-pink-700 mb-2">
                                          Quick Actions
                                        </h4>
                                        <div className="space-y-2">
                                          {[
                                            {
                                              name: "Browse All",
                                              href: "/ebooks",
                                              icon: BookOpen,
                                            },
                                            {
                                              name: "Free E-books",
                                              href: "/ebooks/free",
                                              icon: Gift,
                                            },
                                            {
                                              name: "Bestsellers",
                                              href: "/ebooks/bestsellers",
                                              icon: Star,
                                            },
                                            {
                                              name: "Latest",
                                              href: "/ebooks/latest",
                                              icon: Sparkles,
                                            },
                                          ].map((action, actionIndex) => (
                                            <NavigationMenuLink
                                              key={actionIndex}
                                              className="flex items-center space-x-2 p-2 text-sm hover:bg-pink-50 rounded-md transition-colors"
                                              href={action.href}
                                            >
                                              <action.icon className="w-4 h-4 text-pink-600" />
                                              <span>{action.name}</span>
                                            </NavigationMenuLink>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </NavigationMenuContent>
                      </NavigationMenuItem>

                      {/* ===== OTHER MENU ITEMS - Simple Links - NO SPACING ===== */}
                      <NavigationMenuItem>
                        <NavigationMenuLink
                          className={`group inline-flex h-10 w-max items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors ${pastelColors.navigation.navHover} focus:outline-none disabled:pointer-events-none disabled:opacity-50`}
                          href="/pricing"
                        >
                          <Tag className="w-4 h-4 mr-2" />
                          Pricing
                        </NavigationMenuLink>
                      </NavigationMenuItem>

                      <NavigationMenuItem>
                        <NavigationMenuLink
                          className={`group inline-flex h-10 w-max items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors ${pastelColors.navigation.navHover} focus:outline-none disabled:pointer-events-none disabled:opacity-50`}
                          href="/blog"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Blog
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>

                  {/* Admin Panel Link - Right side */}
                  {user && isAdmin(user) && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <Link
                        to="/admin"
                        className={`flex items-center space-x-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${pastelColors.navigation.adminHover}`}
                      >
                        <Shield className="w-4 h-4" />
                        <span>Admin Panel</span>
                        <Badge className={pastelColors.navigation.adminBadge}>
                          <Crown className="w-3 h-3" />
                        </Badge>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
};

export default Header;
