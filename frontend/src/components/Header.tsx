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
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useTheme } from "@/contexts/ThemeContext";
import { isAdmin, getInitials } from "@/lib/auth";
import { motion, AnimatePresence } from "framer-motion";

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { items, getTotalItems } = useCart();
  const { theme, setTheme } = useTheme();

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Template categories
  const templateCategories = [
    {
      title: "React Templates",
      description: "Modern React components và applications",
      icon: Code,
      href: "/templates/react",
      count: "200+",
      color: "from-blue-500 to-cyan-500",
      featured: true,
    },
    {
      title: "Vue.js Templates",
      description: "Vue.js applications và components",
      icon: Zap,
      href: "/templates/vue",
      count: "150+",
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Angular Templates",
      description: "Enterprise Angular applications",
      icon: Globe,
      href: "/templates/angular",
      count: "100+",
      color: "from-red-500 to-pink-500",
    },
    {
      title: "Mobile Templates",
      description: "React Native & Flutter apps",
      icon: Smartphone,
      href: "/templates/mobile",
      count: "80+",
      color: "from-purple-500 to-indigo-500",
    },
    {
      title: "Design Systems",
      description: "UI/UX design systems và components",
      icon: Palette,
      href: "/templates/design",
      count: "60+",
      color: "from-orange-500 to-yellow-500",
    },
    {
      title: "Admin Dashboards",
      description: "Professional admin interfaces",
      icon: Grid,
      href: "/templates/admin",
      count: "120+",
      color: "from-indigo-500 to-purple-500",
    },
  ];

  // E-book categories
  const ebookCategories = [
    {
      title: "JavaScript & TypeScript",
      description: "Modern JavaScript development",
      icon: Code,
      href: "/ebooks/javascript",
      count: "80+",
      color: "from-yellow-500 to-orange-500",
      featured: true,
    },
    {
      title: "React & Next.js",
      description: "React ecosystem và best practices",
      icon: Zap,
      href: "/ebooks/react",
      count: "60+",
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "UI/UX Design",
      description: "Design principles và user experience",
      icon: Palette,
      href: "/ebooks/design",
      count: "40+",
      color: "from-pink-500 to-rose-500",
    },
    {
      title: "Backend Development",
      description: "Server-side development guides",
      icon: Globe,
      href: "/ebooks/backend",
      count: "50+",
      color: "from-green-500 to-teal-500",
    },
    {
      title: "DevOps & Cloud",
      description: "Deployment và cloud services",
      icon: Settings,
      href: "/ebooks/devops",
      count: "30+",
      color: "from-purple-500 to-violet-500",
    },
  ];

  // Quick actions
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

  // ✅ Admin quick actions (chỉ hiển thị cho admin)
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsSearchFocused(false);
    }
  };

  // ✅ Enhanced logout với error handling
  const handleLogout = async () => {
    try {
      await logout();
      // logout function sẽ handle redirect
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback: Force redirect nếu logout fail
      window.location.href = "/";
    }
  };

  const totalItems = getTotalItems();

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-lg border-b"
          : "bg-background/80 backdrop-blur-sm"
      }`}
    >
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* ✅ Enhanced Logo với animation */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="flex items-center justify-center w-10 h-10 transition-all duration-300 shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl group-hover:shadow-xl"
              >
                <span className="text-lg font-bold text-white">TM</span>
              </motion.div>
              <motion.div
                className="absolute flex items-center justify-center w-4 h-4 rounded-full -top-1 -right-1 bg-gradient-to-r from-orange-400 to-red-500"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-2 h-2 text-white" />
              </motion.div>
            </div>
            <div className="hidden sm:block">
              <motion.div
                className="text-xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text"
                whileHover={{ scale: 1.05 }}
              >
                Template Market
              </motion.div>
              <div className="-mt-1 text-xs text-muted-foreground">
                Premium Quality Store
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              {/* Templates Dropdown */}
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
                <NavigationMenuContent>
                  <div className="w-[800px] p-6">
                    <div className="grid grid-cols-3 gap-6">
                      <div className="col-span-2">
                        {/* ✅ Header với "Xem tất cả" link */}
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                            Template Categories
                          </h3>
                          <NavigationMenuLink asChild>
                            <Link
                              to="/templates"
                              className="flex items-center space-x-2 text-sm font-medium transition-colors group text-primary hover:text-primary/80"
                            >
                              <span>Xem tất cả</span>
                              <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                            </Link>
                          </NavigationMenuLink>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          {templateCategories.map((category, index) => (
                            <NavigationMenuLink key={index} asChild>
                              <Link
                                to={category.href}
                                className="block p-3 transition-all duration-300 rounded-lg group hover:bg-muted hover:shadow-md"
                              >
                                <div className="flex items-center space-x-3">
                                  <div
                                    className={`w-10 h-10 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                                  >
                                    <category.icon className="w-5 h-5 text-white" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                      <div className="font-medium transition-colors group-hover:text-primary">
                                        {category.title}
                                      </div>
                                      {category.featured && (
                                        <Badge
                                          variant="secondary"
                                          className="text-xs text-orange-800 bg-orange-100"
                                        >
                                          <Flame className="w-3 h-3 mr-1" />
                                          Hot
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      {category.description}
                                    </div>
                                    <div className="mt-1 text-xs text-muted-foreground">
                                      {category.count} templates
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            </NavigationMenuLink>
                          ))}
                        </div>

                        {/* ✅ Footer với "Browse All Templates" button */}
                        <div className="pt-4 mt-6 border-t">
                          <NavigationMenuLink asChild>
                            <Link
                              to="/templates"
                              className="flex items-center justify-center w-full p-3 text-sm font-medium text-white transition-all duration-300 rounded-lg group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:shadow-lg"
                            >
                              <Package className="w-4 h-4 mr-2" />
                              <span>Duyệt tất cả Templates</span>
                              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                            </Link>
                          </NavigationMenuLink>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
                          Quick Actions
                        </h4>
                        {quickActions.slice(0, 3).map((action, index) => (
                          <Link
                            key={index}
                            to={action.href}
                            className="block p-3 transition-all duration-300 border rounded-lg group hover:shadow-md"
                          >
                            <div className="flex items-center space-x-3">
                              <div
                                className={`w-8 h-8 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                              >
                                <action.icon className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <div className="text-sm font-medium transition-colors group-hover:text-primary">
                                  {action.title}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {action.description}
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}

                        {/* ✅ Admin Quick Actions (chỉ hiển thị cho admin) */}
                        {user && isAdmin(user) && (
                          <>
                            <Separator />
                            <h4 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
                              <Shield className="inline w-3 h-3 mr-1" />
                              Admin Tools
                            </h4>
                            {adminQuickActions
                              .slice(0, 2)
                              .map((action, index) => (
                                <Link
                                  key={index}
                                  to={action.href}
                                  className="block p-3 transition-all duration-300 border border-purple-200 rounded-lg group hover:shadow-md bg-purple-50/50 dark:bg-purple-900/20"
                                >
                                  <div className="flex items-center space-x-3">
                                    <div
                                      className={`w-8 h-8 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                                    >
                                      <action.icon className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                      <div className="text-sm font-medium transition-colors group-hover:text-primary">
                                        {action.title}
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        {action.description}
                                      </div>
                                    </div>
                                  </div>
                                </Link>
                              ))}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* E-books Dropdown - Enhanced Version */}
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
                <NavigationMenuContent>
                  <div className="w-[700px] p-6">
                    <div className="grid grid-cols-5 gap-6">
                      {/* Left Column - Categories (3 columns) */}
                      <div className="col-span-3">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-transparent bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text">
                            E-book Categories
                          </h3>
                          <NavigationMenuLink asChild>
                            <Link
                              to="/ebooks"
                              className="flex items-center space-x-2 text-sm font-medium transition-colors group text-primary hover:text-primary/80"
                            >
                              <span>Xem tất cả</span>
                              <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                            </Link>
                          </NavigationMenuLink>
                        </div>

                        {/* Categories Grid - 2 columns */}
                        <div className="grid grid-cols-2 gap-3">
                          {ebookCategories.map((category, index) => (
                            <NavigationMenuLink key={index} asChild>
                              <Link
                                to={category.href}
                                className="block p-3 transition-all duration-300 rounded-lg group hover:bg-muted hover:shadow-md"
                              >
                                <div className="flex items-center space-x-3">
                                  <div
                                    className={`w-10 h-10 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                                  >
                                    <category.icon className="w-5 h-5 text-white" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                      <div className="text-sm font-medium transition-colors group-hover:text-primary">
                                        {category.title}
                                      </div>
                                      {category.featured && (
                                        <Badge
                                          variant="secondary"
                                          className="text-xs text-yellow-800 bg-yellow-100"
                                        >
                                          <Star className="w-3 h-3 mr-1" />
                                          Hot
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="mt-1 text-xs text-muted-foreground">
                                      {category.description}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {category.count} e-books
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            </NavigationMenuLink>
                          ))}
                        </div>

                        {/* Footer CTA */}
                        <div className="pt-4 mt-6 border-t">
                          <NavigationMenuLink asChild>
                            <Link
                              to="/ebooks"
                              className="flex items-center justify-center w-full p-3 text-sm font-medium text-white transition-all duration-300 rounded-lg group bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 hover:shadow-lg"
                            >
                              <BookOpen className="w-4 h-4 mr-2" />
                              <span>Duyệt tất cả E-books</span>
                              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                            </Link>
                          </NavigationMenuLink>
                        </div>
                      </div>

                      {/* Right Column - Featured Content (2 columns) */}
                      <div className="col-span-2 space-y-4">
                        <h4 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
                          Featured Content
                        </h4>

                        {/* Premium E-books */}
                        <div className="p-4 border border-blue-200 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                          <div className="flex items-center mb-3 space-x-2">
                            <Crown className="w-5 h-5 text-yellow-500" />
                            <span className="text-sm font-medium">
                              Premium E-books
                            </span>
                            <Badge className="text-xs text-yellow-800 bg-yellow-100">
                              Exclusive
                            </Badge>
                          </div>
                          <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
                            Exclusive content from industry experts with
                            advanced techniques and insider knowledge.
                          </p>
                          <Button
                            size="sm"
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                          >
                            <Star className="w-3 h-3 mr-1" />
                            Explore Premium
                          </Button>
                        </div>

                        {/* Free Downloads */}
                        <div className="p-4 border border-green-200 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                          <div className="flex items-center mb-3 space-x-2">
                            <Download className="w-5 h-5 text-green-500" />
                            <span className="text-sm font-medium">
                              Free Downloads
                            </span>
                            <Badge className="text-xs text-green-800 bg-green-100">
                              Free
                            </Badge>
                          </div>
                          <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
                            High-quality free resources perfect for developers
                            starting their journey.
                          </p>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full hover:bg-green-50 hover:border-green-300"
                          >
                            <Heart className="w-3 h-3 mr-1" />
                            Browse Free
                          </Button>
                        </div>

                        {/* New Releases */}
                        <div className="p-4 border border-orange-200 rounded-lg bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
                          <div className="flex items-center mb-3 space-x-2">
                            <Sparkles className="w-5 h-5 text-orange-500" />
                            <span className="text-sm font-medium">
                              New Releases
                            </span>
                            <Badge className="text-xs text-orange-800 bg-orange-100">
                              Latest
                            </Badge>
                          </div>
                          <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
                            Fresh content covering the latest trends and
                            technologies in development.
                          </p>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full hover:bg-orange-50 hover:border-orange-300"
                          >
                            <Clock className="w-3 h-3 mr-1" />
                            View Latest
                          </Button>
                        </div>

                        {/* Bestsellers */}
                        <div className="p-4 border border-purple-200 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                          <div className="flex items-center mb-3 space-x-2">
                            <Award className="w-5 h-5 text-purple-500" />
                            <span className="text-sm font-medium">
                              Bestsellers
                            </span>
                            <Badge className="text-xs text-purple-800 bg-purple-100">
                              Popular
                            </Badge>
                          </div>
                          <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
                            Most popular e-books loved by thousands of
                            developers worldwide.
                          </p>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full hover:bg-purple-50 hover:border-purple-300"
                          >
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Top Picks
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Other Navigation Items */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link
                    to="/pricing"
                    className={`group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 ${
                      location.pathname === "/pricing"
                        ? "bg-accent text-accent-foreground"
                        : ""
                    }`}
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
                    className={`group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 ${
                      location.pathname === "/blog"
                        ? "bg-accent text-accent-foreground"
                        : ""
                    }`}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Blog
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* ✅ Admin Navigation (chỉ hiển thị cho admin) */}
              {user && isAdmin(user) && (
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      to="/admin"
                      className={`group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 ${
                        location.pathname.startsWith("/admin")
                          ? "bg-accent text-accent-foreground"
                          : ""
                      }`}
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

          {/* Search Bar */}
          <div className="flex-1 hidden max-w-md mx-8 md:flex">
            <form onSubmit={handleSearch} className="relative w-full">
              <div
                className={`relative transition-all duration-300 ${
                  isSearchFocused ? "scale-105" : ""
                }`}
              >
                <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm templates, e-books..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="pl-10 pr-4 transition-all duration-300 border-0 bg-muted/50 focus:bg-background focus:ring-2 focus:ring-primary/20"
                />
                {searchQuery && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute w-8 h-8 p-0 transform -translate-y-1/2 right-1 top-1/2"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </form>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="p-0 w-9 h-9">
                  <Sun className="w-4 h-4 transition-all scale-100 rotate-0 dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute w-4 h-4 transition-all scale-0 rotate-90 dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
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

            {/* Notifications */}
            {user && (
              <Button
                variant="ghost"
                size="sm"
                className="relative p-0 w-9 h-9"
              >
                <Bell className="w-4 h-4" />
                {notifications > 0 && (
                  <Badge className="absolute flex items-center justify-center w-5 h-5 p-0 text-xs bg-red-500 -top-1 -right-1 hover:bg-red-600">
                    {notifications}
                  </Badge>
                )}
              </Button>
            )}

            {/* Wishlist */}
            {user && (
              <Button variant="ghost" size="sm" asChild className="p-0 w-9 h-9">
                <Link to="/wishlist">
                  <Heart className="w-4 h-4" />
                </Link>
              </Button>
            )}

            {/* ✅ Enhanced Cart với animation */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="relative p-0 w-9 h-9"
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
                        <Badge className="flex items-center justify-center w-5 h-5 p-0 text-xs bg-primary hover:bg-primary/90">
                          <motion.span
                            key={totalItems}
                            initial={{ scale: 1.5 }}
                            animate={{ scale: 1 }}
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 30,
                            }}
                          >
                            {totalItems}
                          </motion.span>
                        </Badge>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Link>
              </Button>
            </motion.div>

            {/* ✅ Enhanced User Menu với admin logic */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative rounded-full h-9 w-9"
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="text-white bg-gradient-to-r from-blue-500 to-purple-600">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    {/* ✅ Admin indicator */}
                    {isAdmin(user) && (
                      <div className="absolute flex items-center justify-center w-4 h-4 rounded-full -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-orange-500">
                        <Crown className="w-2 h-2 text-white" />
                      </div>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium leading-none">
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
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="w-4 h-4 mr-2" />
                      <span>Hồ sơ</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link to="/orders" className="cursor-pointer">
                      <Package className="w-4 h-4 mr-2" />
                      <span>Đơn hàng của tôi</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link to="/downloads" className="cursor-pointer">
                      <Download className="w-4 h-4 mr-2" />
                      <span>Downloads</span>
                    </Link>
                  </DropdownMenuItem>

                  {/* ✅ Admin menu items */}
                  {isAdmin(user) && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="cursor-pointer">
                          <Shield className="w-4 h-4 mr-2" />
                          <span>Quản trị hệ thống</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/admin/users" className="cursor-pointer">
                          <UserCog className="w-4 h-4 mr-2" />
                          <span>Quản lý Users</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/admin/analytics" className="cursor-pointer">
                          <BarChart3 className="w-4 h-4 mr-2" />
                          <span>Analytics</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="cursor-pointer">
                      <Settings className="w-4 h-4 mr-2" />
                      <span>Cài đặt</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    <span>Đăng xuất</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/auth/login">Đăng nhập</Link>
                </Button>
                <Button
                  size="sm"
                  asChild
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
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
                  className="p-0 lg:hidden w-9 h-9"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="text-left">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                        <span className="text-sm font-bold text-white">TM</span>
                      </div>
                      <span className="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                        Template Market
                      </span>
                    </div>
                  </SheetTitle>
                  <SheetDescription className="text-left">
                    Premium templates and e-books for developers
                  </SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                  {/* Mobile Search */}
                  <form onSubmit={handleSearch}>
                    <div className="relative">
                      <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </form>

                  {/* Mobile Navigation */}
                  <nav className="space-y-4">
                    <div>
                      <h3 className="mb-3 text-sm font-semibold tracking-wide uppercase text-muted-foreground">
                        Categories
                      </h3>
                      <div className="space-y-2">
                        <Link
                          to="/templates"
                          className="flex items-center p-2 space-x-3 transition-colors rounded-lg hover:bg-muted"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Package className="w-5 h-5 text-blue-500" />
                          <span>Templates</span>
                          <Badge variant="secondary" className="ml-auto">
                            Hot
                          </Badge>
                        </Link>
                        <Link
                          to="/ebooks"
                          className="flex items-center p-2 space-x-3 transition-colors rounded-lg hover:bg-muted"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <BookOpen className="w-5 h-5 text-green-500" />
                          <span>E-books</span>
                          <Badge variant="secondary" className="ml-auto">
                            New
                          </Badge>
                        </Link>
                        <Link
                          to="/pricing"
                          className="flex items-center p-2 space-x-3 transition-colors rounded-lg hover:bg-muted"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Award className="w-5 h-5 text-purple-500" />
                          <span>Pricing</span>
                        </Link>
                        <Link
                          to="/blog"
                          className="flex items-center p-2 space-x-3 transition-colors rounded-lg hover:bg-muted"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <MessageCircle className="w-5 h-5 text-orange-500" />
                          <span>Blog</span>
                        </Link>

                        {/* ✅ Admin mobile menu */}
                        {user && isAdmin(user) && (
                          <>
                            <Separator />
                            <div className="flex items-center mb-2 space-x-2">
                              <Shield className="w-4 h-4 text-purple-500" />
                              <span className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
                                Admin Tools
                              </span>
                            </div>
                            <Link
                              to="/admin"
                              className="flex items-center p-2 space-x-3 transition-colors rounded-lg hover:bg-muted bg-purple-50/50 dark:bg-purple-900/20"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <Shield className="w-5 h-5 text-purple-500" />
                              <span>Admin Dashboard</span>
                              <Badge
                                variant="secondary"
                                className="ml-auto text-purple-800 bg-purple-100"
                              >
                                <Crown className="w-3 h-3" />
                              </Badge>
                            </Link>
                          </>
                        )}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="mb-3 text-sm font-semibold tracking-wide uppercase text-muted-foreground">
                        Quick Access
                      </h3>
                      <div className="space-y-2">
                        {quickActions.map((action, index) => (
                          <Link
                            key={index}
                            to={action.href}
                            className="flex items-center p-2 space-x-3 transition-colors rounded-lg hover:bg-muted"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <div
                              className={`w-8 h-8 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center`}
                            >
                              <action.icon className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <div className="text-sm font-medium">
                                {action.title}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {action.description}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {!user && (
                      <>
                        <Separator />
                        <div className="space-y-2">
                          <Button asChild className="w-full">
                            <Link
                              to="/auth/login"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              Đăng nhập
                            </Link>
                          </Button>
                          <Button variant="outline" asChild className="w-full">
                            <Link
                              to="/auth/register"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              Đăng ký
                            </Link>
                          </Button>
                        </div>
                      </>
                    )}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
