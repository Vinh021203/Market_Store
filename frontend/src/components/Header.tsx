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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Globe,
  Zap,
  TrendingUp,
  Award,
  Users,
  ChevronDown,
  X,
  Shield,
  BarChart3,
  FileText,
  ArrowRight,
  Phone,
  Mail,
  Gift,
  ExternalLink,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Crown,
  LayoutTemplate,
  Sparkles,
  Tag,
  MessageCircle,
  Palette,
  Smartphone,
  Database,
  Clock,
  CheckCircle,
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
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showTopBar, setShowTopBar] = useState(true);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Hooks
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { items, getTotalItems } = useCart();
  const { wishlist, getTotalWishlistItems } = useWishlist();

  // Scroll behavior for showing/hiding top bar
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show top bar when at top (0-50px) or scrolling up
      if (currentScrollY < 50 || currentScrollY < lastScrollY) {
        setShowTopBar(true);
      } else {
        // Hide top bar when scrolling down
        setShowTopBar(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Memoized values
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
        setIsSearchModalOpen(false);
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

  const openSearchModal = useCallback(() => {
    setIsSearchModalOpen(true);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        openSearchModal();
      }
      if (e.key === "Escape" && isSearchModalOpen) {
        setIsSearchModalOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isSearchModalOpen, openSearchModal]);

  return (
    <>
      {/* ===== SEARCH MODAL ===== */}
      <Dialog open={isSearchModalOpen} onOpenChange={setIsSearchModalOpen}>
        <DialogContent className="sm:max-w-2xl p-0 gap-0 bg-gradient-to-br from-pink-50 via-white to-rose-50">
          <DialogHeader className="px-6 py-4 border-b border-pink-200/50 bg-gradient-to-r from-pink-100/50 to-rose-100/50">
            <DialogTitle className="text-lg font-semibold text-transparent bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 bg-clip-text">
              🔍 Tìm kiếm Templates & E-books
            </DialogTitle>
          </DialogHeader>

          <div className="p-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pink-500" />
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Nhập từ khóa tìm kiếm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-4 text-lg border-2 border-pink-200 focus:border-pink-400 rounded-xl bg-white/70 backdrop-blur-sm"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <Badge
                    variant="outline"
                    className="text-xs text-muted-foreground bg-pink-50"
                  >
                    Enter
                  </Badge>
                </div>
              </div>

              {/* Quick Search Suggestions */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-pink-700 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Tìm kiếm phổ biến:
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "React Templates",
                    "Admin Dashboard",
                    "E-commerce",
                    "Landing Pages",
                    "Mobile UI",
                    "Design System",
                  ].map((suggestion) => (
                    <Button
                      key={suggestion}
                      variant="outline"
                      size="sm"
                      className="h-8 px-3 text-xs border-pink-200 hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 hover:border-pink-300 transition-all"
                      onClick={() => {
                        setSearchQuery(suggestion);
                        setTimeout(
                          () =>
                            handleSearch({ preventDefault: () => {} } as any),
                          100,
                        );
                      }}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Keyboard Shortcuts */}
              <div className="pt-4 border-t border-pink-100">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    Nhấn{" "}
                    <kbd className="px-2 py-1 bg-pink-50 rounded border">
                      Enter
                    </kbd>{" "}
                    để tìm kiếm
                  </span>
                  <span>
                    Nhấn{" "}
                    <kbd className="px-2 py-1 bg-pink-50 rounded border">
                      Esc
                    </kbd>{" "}
                    để đóng
                  </span>
                </div>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      <div>
        {/* ===== TẦNG 1: TOP BAR - CONDITIONAL DISPLAY ===== */}
        <AnimatePresence>
          {showTopBar && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="bg-gradient-to-r from-pink-50 via-rose-50 to-red-50 border-b border-pink-200/30 overflow-hidden"
            >
              <div className="container mx-auto px-4">
                <div className="flex items-center justify-between py-2.5 text-sm">
                  {/* Left: Promotion */}
                  <div className="flex items-center space-x-3">
                    <div className="bg-white/70 px-3 py-1 rounded-full flex items-center space-x-2 backdrop-blur-sm shadow-sm">
                      <Gift className="w-4 h-4 text-pink-600" />
                      <span className="font-medium text-pink-700">
                        🎉 Template Sale 50% OFF
                      </span>
                      <Badge className="bg-pink-200 text-pink-800 text-xs px-2 py-0.5">
                        Limited
                      </Badge>
                    </div>
                  </div>

                  {/* Center: Contact Info - Desktop Only */}
                  <div className="hidden lg:flex items-center space-x-6 text-slate-600">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>0971.385.588</span>
                    </div>
                    <div className="w-px h-4 bg-pink-300/50"></div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>veutong961@gmail.com</span>
                    </div>
                  </div>

                  {/* Right: Social + User Status */}
                  <div className="flex items-center space-x-4">
                    {/* Social Links - Desktop Only */}
                    <div className="hidden lg:flex items-center space-x-2">
                      {[
                        { icon: Facebook, href: "#", color: "text-blue-600" },
                        { icon: Instagram, href: "#", color: "text-pink-600" },
                        { icon: Twitter, href: "#", color: "text-sky-600" },
                        { icon: Youtube, href: "#", color: "text-red-600" },
                      ].map((social, index) => (
                        <motion.a
                          key={index}
                          href={social.href}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          className={`p-2 rounded-full hover:bg-white/30 ${social.color} transition-colors`}
                        >
                          <social.icon className="w-4 h-4" />
                        </motion.a>
                      ))}
                    </div>

                    <div className="w-px h-4 bg-pink-300/50"></div>

                    {/* User Status */}
                    {user ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-slate-700">
                          Xin chào,{" "}
                          <span className="font-medium">{user.name}</span>
                        </span>
                        {isAdmin(user) && (
                          <Badge className="bg-pink-200 text-pink-800 text-xs px-2 py-0">
                            <Crown className="w-3 h-3 mr-1" />
                            Admin
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-slate-600">
                        Cần hỗ trợ? Liên hệ ngay!
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===== TẦNG 2: MAIN HEADER - STICKY FIXED ===== */}
        <div className="sticky top-0 z-50 bg-gradient-to-r from-pink-50 via-rose-50 to-red-50 border-b border-pink-200/30 shadow-sm backdrop-blur-md">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between py-4">
              {/* Logo */}
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    className="flex items-center justify-center w-12 h-12 transition-all duration-300 shadow-lg bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 rounded-xl group-hover:shadow-xl"
                  >
                    <span className="text-lg font-bold text-white">TM</span>
                  </motion.div>
                  <motion.div
                    className="absolute flex items-center justify-center w-4 h-4 rounded-full -top-1 -right-1 bg-gradient-to-r from-orange-400 to-red-500"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Sparkles className="w-2 h-2 text-white" />
                  </motion.div>
                </div>
                <div className="flex flex-col">
                  <motion.h1
                    className="text-xl font-bold text-transparent bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 bg-clip-text"
                    whileHover={{ scale: 1.02 }}
                  >
                    Template Market
                  </motion.h1>
                  <p className="hidden sm:block text-xs text-slate-500 -mt-1">
                    Premium Quality Store
                  </p>
                </div>
              </Link>

              {/* ===== NAVIGATION MENU - DESKTOP CENTER ===== */}
              <div className="hidden lg:block">
                <NavigationMenu>
                  <NavigationMenuList className="flex items-center space-x-1">
                    {/* Templates với ENHANCED SUBMENU */}
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="h-10 px-4 rounded-lg font-medium hover:bg-pink-100/70 transition-colors flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Templates
                        <Badge className="bg-red-500 text-white text-xs px-2 py-0.5 hover:bg-red-600 transition-colors">
                          Hot
                        </Badge>
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="z-[9999]">
                        <div className="w-[600px] p-6 bg-gradient-to-br from-white via-pink-50/30 to-rose-50/30 shadow-2xl rounded-xl border border-pink-200/50 backdrop-blur-sm">
                          <div className="grid grid-cols-3 gap-6">
                            {/* Popular Categories với ENHANCED BACKGROUNDS */}
                            <div className="space-y-3">
                              <h4 className="font-semibold text-sm text-pink-600 flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-pink-100">
                                  <Star className="w-4 h-4 text-pink-600" />
                                </div>
                                Popular Categories
                              </h4>
                              {[
                                {
                                  name: "React Templates",
                                  icon: Code,
                                  href: "/templates?category=react",
                                  color:
                                    "bg-gradient-to-br from-blue-50 to-blue-100",
                                  iconColor: "text-blue-600",
                                  borderColor: "border-blue-200",
                                },
                                {
                                  name: "Vue Templates",
                                  icon: Zap,
                                  href: "/templates?category=vue",
                                  color:
                                    "bg-gradient-to-br from-green-50 to-green-100",
                                  iconColor: "text-green-600",
                                  borderColor: "border-green-200",
                                },
                                {
                                  name: "HTML Templates",
                                  icon: Globe,
                                  href: "/templates?category=html",
                                  color:
                                    "bg-gradient-to-br from-orange-50 to-orange-100",
                                  iconColor: "text-orange-600",
                                  borderColor: "border-orange-200",
                                },
                                {
                                  name: "Mobile Apps",
                                  icon: Smartphone,
                                  href: "/templates?category=mobile",
                                  color:
                                    "bg-gradient-to-br from-purple-50 to-purple-100",
                                  iconColor: "text-purple-600",
                                  borderColor: "border-purple-200",
                                },
                              ].map((item) => (
                                <NavigationMenuLink
                                  key={item.name}
                                  href={item.href}
                                  className={`flex items-center space-x-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 transition-all duration-300 border border-transparent hover:${item.borderColor} hover:shadow-sm`}
                                >
                                  <div
                                    className={`p-2 rounded-lg ${item.color} shadow-sm border ${item.borderColor}`}
                                  >
                                    <item.icon
                                      className={`w-4 h-4 ${item.iconColor}`}
                                    />
                                  </div>
                                  <span className="font-medium text-sm text-gray-700">
                                    {item.name}
                                  </span>
                                </NavigationMenuLink>
                              ))}
                            </div>

                            {/* By Industry với ENHANCED BACKGROUNDS */}
                            <div className="space-y-3">
                              <h4 className="font-semibold text-sm text-pink-600 flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-pink-100">
                                  <BarChart3 className="w-4 h-4 text-pink-600" />
                                </div>
                                By Industry
                              </h4>
                              {[
                                {
                                  name: "E-commerce",
                                  icon: ShoppingCart,
                                  href: "/templates?industry=ecommerce",
                                  color:
                                    "bg-gradient-to-br from-pink-50 to-pink-100",
                                  iconColor: "text-pink-600",
                                  borderColor: "border-pink-200",
                                },
                                {
                                  name: "SaaS",
                                  icon: Database,
                                  href: "/templates?industry=saas",
                                  color:
                                    "bg-gradient-to-br from-indigo-50 to-indigo-100",
                                  iconColor: "text-indigo-600",
                                  borderColor: "border-indigo-200",
                                },
                                {
                                  name: "Portfolio",
                                  icon: Award,
                                  href: "/templates?industry=portfolio",
                                  color:
                                    "bg-gradient-to-br from-yellow-50 to-yellow-100",
                                  iconColor: "text-yellow-600",
                                  borderColor: "border-yellow-200",
                                },
                                {
                                  name: "Corporate",
                                  icon: FileText,
                                  href: "/templates?industry=corporate",
                                  color:
                                    "bg-gradient-to-br from-gray-50 to-gray-100",
                                  iconColor: "text-gray-600",
                                  borderColor: "border-gray-200",
                                },
                              ].map((item) => (
                                <NavigationMenuLink
                                  key={item.name}
                                  href={item.href}
                                  className={`flex items-center space-x-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 transition-all duration-300 border border-transparent hover:${item.borderColor} hover:shadow-sm`}
                                >
                                  <div
                                    className={`p-2 rounded-lg ${item.color} shadow-sm border ${item.borderColor}`}
                                  >
                                    <item.icon
                                      className={`w-4 h-4 ${item.iconColor}`}
                                    />
                                  </div>
                                  <span className="font-medium text-sm text-gray-700">
                                    {item.name}
                                  </span>
                                </NavigationMenuLink>
                              ))}
                            </div>

                            {/* Featured với ENHANCED DESIGN */}
                            <div className="space-y-3">
                              <h4 className="font-semibold text-sm text-pink-600 flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-pink-100">
                                  <Crown className="w-4 h-4 text-pink-600" />
                                </div>
                                Featured
                              </h4>
                              <div className="bg-gradient-to-br from-pink-100 via-rose-100 to-pink-200 p-4 rounded-xl border border-pink-200 shadow-sm">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="p-1 rounded-full bg-white shadow-sm">
                                    <Sparkles className="w-3 h-3 text-pink-600" />
                                  </div>
                                  <span className="font-semibold text-sm text-pink-700">
                                    New Release
                                  </span>
                                </div>
                                <p className="text-xs text-pink-600 mb-3">
                                  Premium React Dashboard với 100+ components
                                </p>
                                <Button
                                  size="sm"
                                  className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-xs shadow-lg"
                                >
                                  Xem ngay
                                  <ArrowRight className="w-3 h-3 ml-1" />
                                </Button>
                              </div>

                              <div className="space-y-2">
                                <NavigationMenuLink
                                  href="/templates?featured=true"
                                  className="block p-3 rounded-xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 border border-transparent hover:border-orange-200 transition-all hover:shadow-sm"
                                >
                                  <div className="flex items-center gap-2">
                                    <div className="p-1 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
                                      <TrendingUp className="w-4 h-4 text-orange-500" />
                                    </div>
                                    <span className="text-sm font-medium">
                                      Trending Templates
                                    </span>
                                  </div>
                                </NavigationMenuLink>
                                <NavigationMenuLink
                                  href="/templates?new=true"
                                  className="block p-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-sky-50 border border-transparent hover:border-blue-200 transition-all hover:shadow-sm"
                                >
                                  <div className="flex items-center gap-2">
                                    <div className="p-1 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                                      <Clock className="w-4 h-4 text-blue-500" />
                                    </div>
                                    <span className="text-sm font-medium">
                                      Recently Added
                                    </span>
                                  </div>
                                </NavigationMenuLink>
                              </div>
                            </div>
                          </div>

                          {/* Bottom CTA */}
                          <div className="mt-6 pt-4 border-t border-pink-200/50 bg-gradient-to-r from-pink-50/50 to-rose-50/50 rounded-lg px-4 py-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-sm text-pink-700">
                                <div className="p-1 rounded-full bg-green-100">
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                </div>
                                <span className="font-medium">
                                  2,500+ Templates available
                                </span>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-pink-300 hover:bg-pink-50"
                                asChild
                              >
                                <Link to="/templates">
                                  View All Templates
                                  <ArrowRight className="w-4 h-4 ml-1" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>

                    {/* E-books với ENHANCED SUBMENU */}
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="h-10 px-4 rounded-lg font-medium hover:bg-pink-100/70 transition-colors flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        E-books
                        <Badge className="bg-green-500 text-white text-xs px-2 py-0.5 hover:bg-green-600 transition-colors">
                          New
                        </Badge>
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="z-[9999]">
                        <div className="w-[600px] p-6 bg-gradient-to-br from-white via-purple-50/30 to-indigo-50/30 shadow-2xl rounded-xl border border-purple-200/50 backdrop-blur-sm">
                          <div className="grid grid-cols-3 gap-6">
                            {/* Development với ENHANCED BACKGROUNDS */}
                            <div className="space-y-3">
                              <h4 className="font-semibold text-sm text-purple-600 flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-purple-100">
                                  <Code className="w-4 h-4 text-purple-600" />
                                </div>
                                Development
                              </h4>
                              {[
                                {
                                  name: "React Mastery",
                                  icon: Code,
                                  href: "/ebooks?category=react",
                                  color:
                                    "bg-gradient-to-br from-blue-50 to-blue-100",
                                  iconColor: "text-blue-600",
                                  borderColor: "border-blue-200",
                                },
                                {
                                  name: "JavaScript Guide",
                                  icon: Zap,
                                  href: "/ebooks?category=javascript",
                                  color:
                                    "bg-gradient-to-br from-yellow-50 to-yellow-100",
                                  iconColor: "text-yellow-600",
                                  borderColor: "border-yellow-200",
                                },
                                {
                                  name: "Node.js Handbook",
                                  icon: Database,
                                  href: "/ebooks?category=nodejs",
                                  color:
                                    "bg-gradient-to-br from-green-50 to-green-100",
                                  iconColor: "text-green-600",
                                  borderColor: "border-green-200",
                                },
                                {
                                  name: "TypeScript Pro",
                                  icon: Shield,
                                  href: "/ebooks?category=typescript",
                                  color:
                                    "bg-gradient-to-br from-indigo-50 to-indigo-100",
                                  iconColor: "text-indigo-600",
                                  borderColor: "border-indigo-200",
                                },
                              ].map((item) => (
                                <NavigationMenuLink
                                  key={item.name}
                                  href={item.href}
                                  className={`flex items-center space-x-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 transition-all duration-300 border border-transparent hover:${item.borderColor} hover:shadow-sm`}
                                >
                                  <div
                                    className={`p-2 rounded-lg ${item.color} shadow-sm border ${item.borderColor}`}
                                  >
                                    <item.icon
                                      className={`w-4 h-4 ${item.iconColor}`}
                                    />
                                  </div>
                                  <span className="font-medium text-sm text-gray-700">
                                    {item.name}
                                  </span>
                                </NavigationMenuLink>
                              ))}
                            </div>

                            {/* Design với ENHANCED BACKGROUNDS */}
                            <div className="space-y-3">
                              <h4 className="font-semibold text-sm text-purple-600 flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-purple-100">
                                  <Palette className="w-4 h-4 text-purple-600" />
                                </div>
                                Design & UX
                              </h4>
                              {[
                                {
                                  name: "Design Systems",
                                  icon: Palette,
                                  href: "/ebooks?category=design-systems",
                                  color:
                                    "bg-gradient-to-br from-pink-50 to-pink-100",
                                  iconColor: "text-pink-600",
                                  borderColor: "border-pink-200",
                                },
                                {
                                  name: "UI/UX Principles",
                                  icon: Sparkles,
                                  href: "/ebooks?category=uiux",
                                  color:
                                    "bg-gradient-to-br from-purple-50 to-purple-100",
                                  iconColor: "text-purple-600",
                                  borderColor: "border-purple-200",
                                },
                                {
                                  name: "Color Theory",
                                  icon: Palette,
                                  href: "/ebooks?category=color",
                                  color:
                                    "bg-gradient-to-br from-orange-50 to-orange-100",
                                  iconColor: "text-orange-600",
                                  borderColor: "border-orange-200",
                                },
                                {
                                  name: "Typography",
                                  icon: FileText,
                                  href: "/ebooks?category=typography",
                                  color:
                                    "bg-gradient-to-br from-gray-50 to-gray-100",
                                  iconColor: "text-gray-600",
                                  borderColor: "border-gray-200",
                                },
                              ].map((item) => (
                                <NavigationMenuLink
                                  key={item.name}
                                  href={item.href}
                                  className={`flex items-center space-x-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 transition-all duration-300 border border-transparent hover:${item.borderColor} hover:shadow-sm`}
                                >
                                  <div
                                    className={`p-2 rounded-lg ${item.color} shadow-sm border ${item.borderColor}`}
                                  >
                                    <item.icon
                                      className={`w-4 h-4 ${item.iconColor}`}
                                    />
                                  </div>
                                  <span className="font-medium text-sm text-gray-700">
                                    {item.name}
                                  </span>
                                </NavigationMenuLink>
                              ))}
                            </div>

                            {/* Business với ENHANCED DESIGN */}
                            <div className="space-y-3">
                              <h4 className="font-semibold text-sm text-purple-600 flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-purple-100">
                                  <TrendingUp className="w-4 h-4 text-purple-600" />
                                </div>
                                Business
                              </h4>
                              <div className="bg-gradient-to-br from-purple-100 via-indigo-100 to-purple-200 p-4 rounded-xl border border-purple-200 shadow-sm">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="p-1 rounded-full bg-white shadow-sm">
                                    <Crown className="w-3 h-3 text-purple-600" />
                                  </div>
                                  <span className="font-semibold text-sm text-purple-700">
                                    Bestseller
                                  </span>
                                </div>
                                <p className="text-xs text-purple-600 mb-3">
                                  Complete Guide to Building SaaS Products
                                </p>
                                <Button
                                  size="sm"
                                  className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white text-xs shadow-lg"
                                >
                                  Download Now
                                  <Download className="w-3 h-3 ml-1" />
                                </Button>
                              </div>

                              <div className="space-y-2">
                                <NavigationMenuLink
                                  href="/ebooks?category=marketing"
                                  className="block p-3 rounded-xl hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 border border-transparent hover:border-green-200 transition-all hover:shadow-sm"
                                >
                                  <div className="flex items-center gap-2">
                                    <div className="p-1 rounded-lg bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
                                      <TrendingUp className="w-4 h-4 text-green-500" />
                                    </div>
                                    <span className="text-sm font-medium">
                                      Marketing
                                    </span>
                                  </div>
                                </NavigationMenuLink>
                                <NavigationMenuLink
                                  href="/ebooks?category=startup"
                                  className="block p-3 rounded-xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 border border-transparent hover:border-orange-200 transition-all hover:shadow-sm"
                                >
                                  <div className="flex items-center gap-2">
                                    <div className="p-1 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
                                      <Zap className="w-4 h-4 text-orange-500" />
                                    </div>
                                    <span className="text-sm font-medium">
                                      Startup Guide
                                    </span>
                                  </div>
                                </NavigationMenuLink>
                              </div>
                            </div>
                          </div>

                          {/* Bottom Stats */}
                          <div className="mt-6 pt-4 border-t border-purple-200/50 bg-gradient-to-r from-purple-50/50 to-indigo-50/50 rounded-lg px-4 py-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 text-sm text-purple-700">
                                  <div className="p-1 rounded-full bg-purple-100">
                                    <BookOpen className="w-4 h-4 text-purple-500" />
                                  </div>
                                  <span className="font-medium">
                                    1,200+ E-books
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-purple-700">
                                  <div className="p-1 rounded-full bg-green-100">
                                    <Download className="w-4 h-4 text-green-500" />
                                  </div>
                                  <span className="font-medium">
                                    50K+ Downloads
                                  </span>
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-purple-300 hover:bg-purple-50"
                                asChild
                              >
                                <Link to="/ebooks">
                                  Browse All E-books
                                  <ArrowRight className="w-4 h-4 ml-1" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>

                    {/* Simple Links */}
                    <NavigationMenuItem>
                      <NavigationMenuLink
                        className="inline-flex h-10 w-max items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-pink-100/70"
                        href="/pricing"
                      >
                        <Tag className="w-4 h-4 mr-2" />
                        Pricing
                      </NavigationMenuLink>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                      <NavigationMenuLink
                        className="inline-flex h-10 w-max items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-pink-100/70"
                        href="/blog"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Blog
                      </NavigationMenuLink>
                    </NavigationMenuItem>

                    {/* Admin Panel - Conditional */}
                    {user && isAdmin(user) && (
                      <NavigationMenuItem>
                        <NavigationMenuLink
                          className="inline-flex h-10 w-max items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-pink-100/70"
                          href="/admin"
                        >
                          <Shield className="w-4 h-4 mr-2" />
                          Admin Panel
                          <Badge className="ml-2 bg-pink-200 text-pink-800 text-xs px-2 py-0">
                            <Crown className="w-3 h-3" />
                          </Badge>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    )}
                  </NavigationMenuList>
                </NavigationMenu>
              </div>

              {/* Action Buttons - RIGHT SIDE */}
              <div className="flex items-center space-x-2">
                {/* Search Icon Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 hover:bg-pink-100/70 relative group"
                  onClick={openSearchModal}
                >
                  <Search className="w-5 h-5" />
                  <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Ctrl+K
                  </span>
                </Button>

                {/* Wishlist */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative p-2 hover:bg-pink-100/70"
                  asChild
                >
                  <Link to="/wishlist">
                    <Heart className="w-5 h-5" />
                    {totalWishlistItems > 0 && (
                      <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs bg-red-500 text-white">
                        {totalWishlistItems}
                      </Badge>
                    )}
                  </Link>
                </Button>

                {/* Cart */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative p-2 hover:bg-pink-100/70"
                  asChild
                >
                  <Link to="/cart">
                    <ShoppingCart className="w-5 h-5" />
                    {totalItems > 0 && (
                      <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs bg-pink-500 text-white">
                        {totalItems}
                      </Badge>
                    )}
                  </Link>
                </Button>

                {/* User Menu or Auth */}
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative h-8 w-8 rounded-full"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback className="bg-gradient-to-br from-pink-500 via-rose-500 to-red-500 text-white text-xs">
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
                        <Link to="/my-orders">
                          <Package className="mr-2 h-4 w-4" />
                          Orders
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hidden sm:flex text-sm px-3 hover:bg-pink-100/70"
                      asChild
                    >
                      <Link to="/auth/login">Đăng nhập</Link>
                    </Button>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 hover:from-pink-600 hover:via-rose-600 hover:to-red-600 text-white text-sm px-4 h-9 shadow-md"
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
                      className="lg:hidden p-2 hover:bg-pink-100/70"
                    >
                      <Menu className="w-5 h-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="right"
                    className="w-80 bg-gradient-to-br from-pink-50 via-white to-rose-50 border-l border-pink-200/50"
                  >
                    <SheetHeader className="bg-gradient-to-r from-pink-100 to-rose-100 -mx-6 -mt-6 px-6 pt-6 pb-4 border-b border-pink-200/50">
                      <SheetTitle className="text-transparent bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 bg-clip-text flex items-center gap-2">
                        <LayoutTemplate className="w-5 h-5 text-pink-600" />
                        Template Market
                      </SheetTitle>
                    </SheetHeader>

                    {/* Mobile menu content */}
                    <div className="mt-6 space-y-4">
                      <Button
                        variant="outline"
                        className="w-full justify-start bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200 hover:from-pink-100 hover:to-rose-100"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          openSearchModal();
                        }}
                      >
                        <Search className="w-4 h-4 mr-3 text-pink-600" />
                        <span>Tìm kiếm</span>
                        <Badge className="ml-auto bg-pink-200 text-pink-800 text-xs">
                          Ctrl+K
                        </Badge>
                      </Button>

                      <Link
                        to="/templates"
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 transition-all duration-300 border border-transparent hover:border-pink-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Package className="w-5 h-5 text-pink-600" />
                        <span>Templates</span>
                        <Badge className="bg-red-500 text-white text-xs ml-auto">
                          Hot
                        </Badge>
                      </Link>
                      <Link
                        to="/ebooks"
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 transition-all duration-300 border border-transparent hover:border-pink-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <BookOpen className="w-5 h-5 text-pink-600" />
                        <span>E-books</span>
                        <Badge className="bg-green-500 text-white text-xs ml-auto">
                          New
                        </Badge>
                      </Link>
                      <Link
                        to="/pricing"
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 transition-all duration-300 border border-transparent hover:border-pink-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Tag className="w-5 h-5 text-pink-600" />
                        <span>Pricing</span>
                      </Link>
                      <Link
                        to="/blog"
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 transition-all duration-300 border border-transparent hover:border-pink-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <MessageCircle className="w-5 h-5 text-pink-600" />
                        <span>Blog</span>
                      </Link>
                      {user && isAdmin(user) && (
                        <Link
                          to="/admin"
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gradient-to-r hover:from-pink-50 hover:to-rose-50 transition-all duration-300 border border-transparent hover:border-pink-200"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Shield className="w-5 h-5 text-pink-600" />
                          <span>Admin Panel</span>
                          <Badge className="bg-pink-200 text-pink-800 text-xs ml-auto">
                            <Crown className="w-3 h-3" />
                          </Badge>
                        </Link>
                      )}

                      {/* Contact Info - Mobile Only */}
                      <div className="mt-8 pt-4 border-t border-pink-200/50">
                        <p className="text-xs text-pink-600 font-semibold mb-3 flex items-center gap-2">
                          <Phone className="w-3 h-3" />
                          Liên hệ hỗ trợ:
                        </p>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Phone className="w-3 h-3" />
                            <span>0971.385.588</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-3 h-3" />
                            <span>veutong961@gmail.com</span>
                          </div>
                        </div>

                        {/* Social Links - Mobile */}
                        <div className="flex items-center gap-3 mt-4">
                          {[
                            {
                              icon: Facebook,
                              href: "#",
                              color:
                                "text-blue-600 bg-blue-50 hover:bg-blue-100",
                            },
                            {
                              icon: Instagram,
                              href: "#",
                              color:
                                "text-pink-600 bg-pink-50 hover:bg-pink-100",
                            },
                            {
                              icon: Twitter,
                              href: "#",
                              color: "text-sky-600 bg-sky-50 hover:bg-sky-100",
                            },
                            {
                              icon: Youtube,
                              href: "#",
                              color: "text-red-600 bg-red-50 hover:bg-red-100",
                            },
                          ].map((social, index) => (
                            <motion.a
                              key={index}
                              href={social.href}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className={`p-2 rounded-lg ${social.color} transition-all shadow-sm`}
                            >
                              <social.icon className="w-4 h-4" />
                            </motion.a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
