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
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { items, getTotalItems } = useCart();
  const { wishlist, getTotalWishlistItems } = useWishlist();

  // ✅ Smart sticky header
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;

          if (currentScrollY < 50) {
            setShowHeader(true);
            setIsScrolled(false);
          } else if (currentScrollY < lastScrollY) {
            setShowHeader(true);
            setIsScrolled(true);
          } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
            setShowHeader(false);
            setIsScrolled(true);
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

  const totalWishlistItems = useMemo(
    () => getTotalWishlistItems() || 0,
    [getTotalWishlistItems],
  );
  const totalItems = useMemo(() => getTotalItems(), [getTotalItems]);

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
      {/* SEARCH MODAL */}
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

      {/* ✅ HEADER VỚI FIXED + PADDING SPACE */}
      <div
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-transform duration-300",
          showHeader ? "translate-y-0" : "-translate-y-full",
        )}
      >
        {/* TOP BAR */}
        <div
          className={cn(
            "bg-gradient-to-r from-pink-50 via-rose-50 to-red-50 border-b border-pink-200/30 transition-all duration-300",
            isScrolled ? "h-0 opacity-0 overflow-hidden" : "h-auto opacity-100",
          )}
        >
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between py-2.5 text-sm">
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

              <div className="flex items-center space-x-4">
                <div className="hidden lg:flex items-center space-x-2">
                  {[
                    { icon: Facebook, href: "#", color: "text-blue-600" },
                    { icon: Instagram, href: "#", color: "text-pink-600" },
                    { icon: Twitter, href: "#", color: "text-sky-600" },
                    { icon: Youtube, href: "#", color: "text-red-600" },
                  ].map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      className={`p-2 rounded-full hover:bg-white/30 ${social.color} transition-colors`}
                    >
                      <social.icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>

                <div className="w-px h-4 bg-pink-300/50"></div>

                {user ? (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-slate-700">
                      Xin chào, <span className="font-medium">{user.name}</span>
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
        </div>

        {/* MAIN HEADER */}
        <div className="bg-gradient-to-r from-pink-50 via-rose-50 to-red-50 border-b border-pink-200/30 shadow-sm backdrop-blur-md">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between py-4">
              {/* Logo */}
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className="flex items-center justify-center w-12 h-12 transition-all duration-300 shadow-lg bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 rounded-xl group-hover:shadow-xl group-hover:scale-105">
                    <span className="text-lg font-bold text-white">TM</span>
                  </div>
                  <div className="absolute flex items-center justify-center w-4 h-4 rounded-full -top-1 -right-1 bg-gradient-to-r from-orange-400 to-red-500">
                    <Sparkles className="w-2 h-2 text-white" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <h1 className="text-xl font-bold text-transparent bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 bg-clip-text">
                    Template Market
                  </h1>
                  <p className="hidden sm:block text-xs text-slate-500 -mt-1">
                    Premium Quality Store
                  </p>
                </div>
              </Link>

              {/* Navigation Menu - Desktop */}
              <div className="hidden lg:block">
                <NavigationMenu>
                  <NavigationMenuList className="flex items-center space-x-1">
                    {/* Templates Menu */}
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="h-10 px-4 rounded-lg font-medium hover:bg-pink-100/70 transition-colors flex items-center gap-2 bg-gradient-to-r from-pink-50 to-rose-50">
                        <Package className="w-4 h-4" />
                        Templates
                        <Badge className="bg-red-500 text-white text-xs px-2 py-0.5">
                          Hot
                        </Badge>
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="z-[9999]">
                        <div className="w-[600px] p-6 bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 shadow-2xl rounded-xl border border-pink-200/50 backdrop-blur-sm">
                          <div className="grid grid-cols-3 gap-6">
                            {/* Popular Categories */}
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
                                },
                                {
                                  name: "Vue Templates",
                                  icon: Zap,
                                  href: "/templates?category=vue",
                                },
                                {
                                  name: "HTML Templates",
                                  icon: Globe,
                                  href: "/templates?category=html",
                                },
                                {
                                  name: "Mobile Apps",
                                  icon: Smartphone,
                                  href: "/templates?category=mobile",
                                },
                              ].map((item) => (
                                <NavigationMenuLink
                                  key={item.name}
                                  href={item.href}
                                  className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/70 transition-all"
                                >
                                  <div className="p-2 rounded-lg bg-gradient-to-br from-pink-100 to-pink-200">
                                    <item.icon className="w-4 h-4 text-pink-600" />
                                  </div>
                                  <span className="font-medium text-sm text-gray-700">
                                    {item.name}
                                  </span>
                                </NavigationMenuLink>
                              ))}
                            </div>

                            {/* By Industry */}
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
                                },
                                {
                                  name: "SaaS",
                                  icon: Database,
                                  href: "/templates?industry=saas",
                                },
                                {
                                  name: "Portfolio",
                                  icon: Award,
                                  href: "/templates?industry=portfolio",
                                },
                                {
                                  name: "Corporate",
                                  icon: FileText,
                                  href: "/templates?industry=corporate",
                                },
                              ].map((item) => (
                                <NavigationMenuLink
                                  key={item.name}
                                  href={item.href}
                                  className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/70 transition-all"
                                >
                                  <div className="p-2 rounded-lg bg-gradient-to-br from-pink-100 to-pink-200">
                                    <item.icon className="w-4 h-4 text-pink-600" />
                                  </div>
                                  <span className="font-medium text-sm text-gray-700">
                                    {item.name}
                                  </span>
                                </NavigationMenuLink>
                              ))}
                            </div>

                            {/* Featured */}
                            <div className="space-y-3">
                              <h4 className="font-semibold text-sm text-pink-600 flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-pink-100">
                                  <Crown className="w-4 h-4 text-pink-600" />
                                </div>
                                Featured
                              </h4>
                              <div className="bg-gradient-to-br from-pink-100 to-pink-200 p-4 rounded-xl">
                                <div className="flex items-center gap-2 mb-2">
                                  <Sparkles className="w-3 h-3 text-pink-600" />
                                  <span className="font-semibold text-sm text-pink-700">
                                    New Release
                                  </span>
                                </div>
                                <p className="text-xs text-pink-600 mb-3">
                                  Premium React Dashboard với 100+ components
                                </p>
                                <Button
                                  size="sm"
                                  className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs"
                                >
                                  Xem ngay
                                  <ArrowRight className="w-3 h-3 ml-1" />
                                </Button>
                              </div>
                            </div>
                          </div>

                          {/* Bottom CTA */}
                          <div className="mt-6 pt-4 border-t border-pink-200/50">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-sm text-pink-700">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="font-medium">
                                  2,500+ Templates available
                                </span>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-pink-300"
                                asChild
                              >
                                <Link to="/templates">
                                  View All
                                  <ArrowRight className="w-4 h-4 ml-1" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>

                    {/* E-books Menu */}
                    <NavigationMenuItem>
                      <NavigationMenuTrigger className="h-10 px-4 rounded-lg font-medium hover:bg-pink-100/70 transition-colors flex items-center gap-2 bg-gradient-to-r from-pink-50 to-rose-50">
                        <BookOpen className="w-4 h-4" />
                        E-books
                        <Badge className="bg-green-500 text-white text-xs px-2 py-0.5">
                          New
                        </Badge>
                      </NavigationMenuTrigger>
                      <NavigationMenuContent className="z-[9999]">
                        <div className="w-[600px] p-6 bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 shadow-2xl rounded-xl border border-pink-200/50">
                          <div className="grid grid-cols-3 gap-6">
                            {/* Development */}
                            <div className="space-y-3">
                              <h4 className="font-semibold text-sm text-purple-600">
                                Development
                              </h4>
                              {[
                                {
                                  name: "React Mastery",
                                  href: "/ebooks?category=react",
                                },
                                {
                                  name: "JavaScript Guide",
                                  href: "/ebooks?category=js",
                                },
                                {
                                  name: "Node.js Handbook",
                                  href: "/ebooks?category=node",
                                },
                                {
                                  name: "TypeScript Pro",
                                  href: "/ebooks?category=ts",
                                },
                              ].map((item) => (
                                <NavigationMenuLink
                                  key={item.name}
                                  href={item.href}
                                  className="block p-3 rounded-xl hover:bg-white/70 transition-all"
                                >
                                  {item.name}
                                </NavigationMenuLink>
                              ))}
                            </div>

                            {/* Design */}
                            <div className="space-y-3">
                              <h4 className="font-semibold text-sm text-purple-600">
                                Design & UX
                              </h4>
                              {[
                                {
                                  name: "Design Systems",
                                  href: "/ebooks?category=design",
                                },
                                {
                                  name: "UI/UX Principles",
                                  href: "/ebooks?category=ux",
                                },
                                {
                                  name: "Color Theory",
                                  href: "/ebooks?category=color",
                                },
                                {
                                  name: "Typography",
                                  href: "/ebooks?category=typography",
                                },
                              ].map((item) => (
                                <NavigationMenuLink
                                  key={item.name}
                                  href={item.href}
                                  className="block p-3 rounded-xl hover:bg-white/70 transition-all"
                                >
                                  {item.name}
                                </NavigationMenuLink>
                              ))}
                            </div>

                            {/* Business */}
                            <div className="space-y-3">
                              <h4 className="font-semibold text-sm text-purple-600">
                                Business
                              </h4>
                              <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-4 rounded-xl">
                                <div className="flex items-center gap-2 mb-2">
                                  <Crown className="w-3 h-3 text-purple-600" />
                                  <span className="font-semibold text-sm">
                                    Bestseller
                                  </span>
                                </div>
                                <p className="text-xs text-purple-600 mb-3">
                                  Building SaaS Products
                                </p>
                                <Button
                                  size="sm"
                                  className="w-full bg-purple-500 text-white text-xs"
                                >
                                  Download
                                  <Download className="w-3 h-3 ml-1" />
                                </Button>
                              </div>
                            </div>
                          </div>

                          <div className="mt-6 pt-4 border-t border-pink-200/50">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-purple-700 font-medium">
                                1,200+ E-books • 50K+ Downloads
                              </span>
                              <Button variant="outline" size="sm" asChild>
                                <Link to="/ebooks">
                                  Browse All
                                  <ArrowRight className="w-4 h-4 ml-1" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                      <NavigationMenuLink
                        className="inline-flex h-10 w-max items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-pink-100/70 bg-gradient-to-r from-pink-50 to-rose-50"
                        href="/pricing"
                      >
                        <Tag className="w-4 h-4 mr-2" />
                        Bảng giá
                      </NavigationMenuLink>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                      <NavigationMenuLink
                        className="inline-flex h-10 w-max items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-pink-100/70 bg-gradient-to-r from-pink-50 to-rose-50"
                        href="/blog"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Bài viết
                      </NavigationMenuLink>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                      <NavigationMenuLink
                        className="inline-flex h-10 w-max items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-pink-100/70 bg-gradient-to-r from-pink-50 to-rose-50"
                        href="/contact"
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Liên hệ
                      </NavigationMenuLink>
                    </NavigationMenuItem>

                    {user && isAdmin(user) && (
                      <NavigationMenuItem>
                        <NavigationMenuLink
                          className="inline-flex h-10 w-max items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-pink-100/70"
                          href="/admin"
                        >
                          <Shield className="w-4 h-4 mr-2" />
                          Admin
                          <Badge className="ml-2 bg-pink-200 text-pink-800 text-xs px-2 py-0">
                            <Crown className="w-3 h-3" />
                          </Badge>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    )}
                  </NavigationMenuList>
                </NavigationMenu>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2 hover:bg-pink-100/70"
                  onClick={openSearchModal}
                >
                  <Search className="w-5 h-5" />
                </Button>

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

                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative h-10 w-10 rounded-full border-2 border-pink-200 hover:border-pink-300 transition-all"
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback className="bg-gradient-to-br from-pink-400 via-orange-400 to-yellow-400 text-white text-sm font-bold">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        {/* Online Indicator */}
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      className="w-72 p-0 bg-gradient-to-br from-white via-pink-50/50 to-blue-50/50 border-2 border-pink-200/50 shadow-2xl rounded-2xl overflow-hidden"
                      align="end"
                      sideOffset={8}
                    >
                      {/* User Info Header */}
                      <div className="relative p-4 bg-gradient-to-r from-pink-100 via-orange-50 to-yellow-50 border-b border-pink-200/50">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-12 w-12 ring-2 ring-white shadow-md">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="bg-gradient-to-br from-pink-400 via-orange-400 to-yellow-400 text-white font-bold">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 truncate flex items-center gap-2">
                              {user.name}
                              {isAdmin(user) && (
                                <Badge className="bg-gradient-to-r from-pink-400 to-orange-400 text-white text-xs px-2 py-0.5">
                                  <Crown className="w-3 h-3 mr-1" />
                                  Admin
                                </Badge>
                              )}
                            </p>
                            <p className="text-xs text-slate-600 truncate mt-0.5">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="p-2">
                        {isAdmin(user) && (
                          <>
                            <DropdownMenuItem
                              asChild
                              className="cursor-pointer rounded-xl px-3 py-2.5 focus:bg-gradient-to-r focus:from-pink-50 focus:to-orange-50 transition-all"
                            >
                              <Link to="/admin" className="flex items-center">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-400 to-orange-400 flex items-center justify-center mr-3 shadow-sm">
                                  <Shield className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-semibold text-slate-900">
                                    Quản trị viên
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    Bảng điều khiển admin
                                  </p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-slate-400" />
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="my-2 bg-pink-100" />
                          </>
                        )}

                        <DropdownMenuItem
                          asChild
                          className="cursor-pointer rounded-xl px-3 py-2.5 focus:bg-gradient-to-r focus:from-pink-50 focus:to-orange-50 transition-all"
                        >
                          <Link to="/profile" className="flex items-center">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center mr-3 shadow-sm">
                              <User className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-slate-900">
                                Hồ sơ cá nhân
                              </p>
                              <p className="text-xs text-slate-500">
                                Xem và chỉnh sửa thông tin
                              </p>
                            </div>
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          asChild
                          className="cursor-pointer rounded-xl px-3 py-2.5 focus:bg-gradient-to-r focus:from-pink-50 focus:to-orange-50 transition-all"
                        >
                          <Link to="/my-orders" className="flex items-center">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center mr-3 shadow-sm">
                              <Package className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-slate-900">
                                Đơn hàng của tôi
                              </p>
                              <p className="text-xs text-slate-500">
                                Lịch sử mua hàng
                              </p>
                            </div>
                            {totalItems > 0 && (
                              <Badge className="bg-pink-500 text-white text-xs">
                                {totalItems}
                              </Badge>
                            )}
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          asChild
                          className="cursor-pointer rounded-xl px-3 py-2.5 focus:bg-gradient-to-r focus:from-pink-50 focus:to-orange-50 transition-all"
                        >
                          <Link to="/wishlist" className="flex items-center">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-400 to-red-400 flex items-center justify-center mr-3 shadow-sm">
                              <Heart className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-slate-900">
                                Danh sách yêu thích
                              </p>
                              <p className="text-xs text-slate-500">
                                Sản phẩm đã lưu
                              </p>
                            </div>
                            {totalWishlistItems > 0 && (
                              <Badge className="bg-rose-500 text-white text-xs">
                                {totalWishlistItems}
                              </Badge>
                            )}
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          asChild
                          className="cursor-pointer rounded-xl px-3 py-2.5 focus:bg-gradient-to-r focus:from-pink-50 focus:to-orange-50 transition-all"
                        >
                          <Link to="/downloads" className="flex items-center">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center mr-3 shadow-sm">
                              <Download className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-slate-900">
                                Tải xuống
                              </p>
                              <p className="text-xs text-slate-500">
                                Sản phẩm đã mua
                              </p>
                            </div>
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          asChild
                          className="cursor-pointer rounded-xl px-3 py-2.5 focus:bg-gradient-to-r focus:from-pink-50 focus:to-orange-50 transition-all"
                        >
                          <Link to="/settings" className="flex items-center">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-400 to-gray-400 flex items-center justify-center mr-3 shadow-sm">
                              <Settings className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-slate-900">
                                Cài đặt
                              </p>
                              <p className="text-xs text-slate-500">
                                Tùy chỉnh tài khoản
                              </p>
                            </div>
                          </Link>
                        </DropdownMenuItem>
                      </div>

                      <DropdownMenuSeparator className="my-0 bg-pink-200" />

                      {/* Logout Button */}
                      <div className="p-2">
                        <DropdownMenuItem
                          onClick={handleLogout}
                          className="cursor-pointer rounded-xl px-3 py-2.5 focus:bg-red-50 transition-all text-red-600 font-semibold"
                        >
                          <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center mr-3">
                            <LogOut className="w-4 h-4 text-red-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold">Đăng xuất</p>
                            <p className="text-xs text-red-500">
                              Thoát khỏi tài khoản
                            </p>
                          </div>
                        </DropdownMenuItem>
                      </div>

                      {/* Footer Stats */}
                      <div className="p-3 bg-gradient-to-r from-pink-50 to-orange-50 border-t border-pink-200/50">
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div>
                            <p className="text-xs font-bold text-slate-900">
                              {totalItems}
                            </p>
                            <p className="text-xs text-slate-500">Giỏ hàng</p>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900">
                              {totalWishlistItems}
                            </p>
                            <p className="text-xs text-slate-500">Yêu thích</p>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900">
                              0
                            </p>
                            <p className="text-xs text-slate-500">Thông báo</p>
                          </div>
                        </div>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hidden sm:flex text-sm px-3 hover:bg-pink-100/70 font-medium"
                      asChild
                    >
                      <Link to="/auth/login">Đăng nhập</Link>
                    </Button>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-pink-400 via-orange-400 to-yellow-400 hover:from-pink-500 hover:via-orange-500 hover:to-yellow-500 text-white text-sm px-4 h-9 font-semibold shadow-lg"
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
                    <Button variant="ghost" size="sm" className="lg:hidden p-2">
                      <Menu className="w-5 h-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="right"
                    className="w-80 bg-gradient-to-br from-pink-50 to-rose-50"
                  >
                    <SheetHeader>
                      <SheetTitle className="text-transparent bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text">
                        Template Market
                      </SheetTitle>
                    </SheetHeader>

                    <div className="mt-6 space-y-4">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          openSearchModal();
                        }}
                      >
                        <Search className="w-4 h-4 mr-3" />
                        Tìm kiếm
                      </Button>

                      <Link
                        to="/templates"
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-pink-50"
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
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-pink-50"
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
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-pink-50"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Tag className="w-5 h-5 text-pink-600" />
                        <span>Pricing</span>
                      </Link>

                      <Link
                        to="/blog"
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-pink-50"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <MessageCircle className="w-5 h-5 text-pink-600" />
                        <span>Blog</span>
                      </Link>

                      {user && isAdmin(user) && (
                        <Link
                          to="/admin"
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-pink-50"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Shield className="w-5 h-5 text-pink-600" />
                          <span>Admin Panel</span>
                        </Link>
                      )}

                      <div className="mt-8 pt-4 border-t border-pink-200/50">
                        <p className="text-xs text-pink-600 font-semibold mb-3">
                          Liên hệ:
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

                        <div className="flex items-center gap-3 mt-4">
                          {[
                            {
                              icon: Facebook,
                              href: "#",
                              color: "text-blue-600",
                            },
                            {
                              icon: Instagram,
                              href: "#",
                              color: "text-pink-600",
                            },
                            { icon: Twitter, href: "#", color: "text-sky-600" },
                            { icon: Youtube, href: "#", color: "text-red-600" },
                          ].map((social, index) => (
                            <a
                              key={index}
                              href={social.href}
                              className={`p-2 rounded-lg bg-white shadow-sm ${social.color}`}
                            >
                              <social.icon className="w-4 h-4" />
                            </a>
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

      {/* ✅ SPACER ĐỂ NỘI DUNG KHÔNG BỊ CHE BỞI HEADER */}
      <div className="h-32 lg:h-32" />
    </>
  );
};

export default Header;
