import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { isAdmin, getInitials } from "@/lib/auth";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Search,
  Menu,
  User,
  Settings,
  LogOut,
  Package,
  BookOpen,
  Home,
  Phone,
  Info,
  Sparkles,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // components/Header.tsx
  const handleLogout = async () => {
    try {
      // Show loading state (optional)
      // setIsLoggingOut(true);

      await logout();

      // Note: Không cần navigate ở đây vì logout function đã handle redirect
    } catch (error) {
      console.error("Logout error:", error);

      // Fallback: Force redirect nếu logout fail
      window.location.href = "/";
    }
  };

  const totalItems = getTotalItems();

  const navItems = [
    { label: "Trang chủ", href: "/", icon: Home },
    { label: "Templates", href: "/templates", icon: Package },
    { label: "E-books", href: "/ebooks", icon: BookOpen },
    { label: "Blog", href: "/blog", icon: BookOpen },
    { label: "Giới thiệu", href: "/about", icon: Info },
    { label: "Liên hệ", href: "/contact", icon: Phone },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              className="relative flex items-center justify-center w-8 h-8 rounded-lg shadow-lg bg-gradient-to-br from-blue-500 to-purple-600"
            >
              <span className="font-bold text-white">TM</span>
              <motion.div
                className="absolute w-3 h-3 -top-1 -right-1"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-3 h-3 text-yellow-400" />
              </motion.div>
            </motion.div>
            <motion.span
              className="text-xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text"
              whileHover={{ scale: 1.05 }}
            >
              Template Store
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="items-center hidden space-x-6 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="items-center flex-1 hidden max-w-sm mx-8 space-x-2 lg:flex"
          >
            <div className="relative flex-1">
              <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Tìm kiếm templates, ebooks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </form>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" size="sm" asChild className="relative">
                <Link to="/cart">
                  <ShoppingCart className="w-5 h-5" />
                  <AnimatePresence>
                    {totalItems > 0 && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute -top-2 -right-2"
                      >
                        <Badge
                          variant="destructive"
                          className="flex items-center justify-center w-5 h-5 p-0 text-xs rounded-full"
                        >
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

            <ThemeToggle />
            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative rounded-full h-9 w-9"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="w-4 h-4 mr-2" />
                      <span>Hồ sơ</span>
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin(user) && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="cursor-pointer">
                        <Settings className="w-4 h-4 mr-2" />
                        <span>Quản trị</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
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
                <Button size="sm" asChild>
                  <Link to="/auth/register">Đăng ký</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col mt-6 space-y-4">
                  {/* Mobile Search */}
                  <form
                    onSubmit={handleSearch}
                    className="flex items-center space-x-2"
                  >
                    <div className="relative flex-1">
                      <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Tìm kiếm..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </form>

                  {/* Mobile Navigation */}
                  <nav className="flex flex-col space-y-2">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent ${
                          location.pathname === item.href
                            ? "bg-accent text-accent-foreground"
                            : ""
                        }`}
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Link>
                    ))}
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
