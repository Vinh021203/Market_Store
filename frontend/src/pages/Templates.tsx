import React, { useState, useMemo, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import ProductCard from "@/components/ProductCard";
import { filterProducts, getProductsByCategory } from "@/lib/products";
import { Product, FilterOptions } from "@/types";
import { useCart } from "@/contexts/CartContext";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  X,
  Package,
  Grid,
  List,
  SlidersHorizontal,
  ArrowUpDown,
  Star,
  TrendingUp,
  DollarSign,
  Clock,
  Layout,
  Settings,
  Award,
  Eye,
  Heart,
  Download,
  Crown,
  Gift,
  BarChart3,
  Briefcase,
  BookOpen,
  Building,
  Server,
  ShoppingCart,
  Rocket,
  ArrowUp,
  Sparkles,
  Flame,
  Zap,
  Shield,
  Globe,
  Palette,
  Code,
  Users,
  Camera,
  Music,
  Video,
  Headphones,
  Gamepad2,
  Diamond,
  Hexagon,
  Triangle,
  Square,
  Circle,
  Layers,
  Paintbrush,
  Wand2,
  Stars,
  Feather,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

// ✅ GIỮ NGUYÊN TÊN BIẾN - CHỈ ĐỔI GIÁ TRỊ
const softPinkTheme = {
  // PINK BACKGROUND TONES - ĐỔI THÀNH PASTEL GIỐNG HOME
  pageBackground: "from-pink-50 via-blue-50 to-yellow-50", // ✅ Giống Home
  sectionBackground: "from-pink-50/80 via-blue-50/60 to-yellow-50/80", // ✅ Giống Home

  // GLASS CARDS - ĐỔI THÀNH PASTEL
  glassCard: "from-white/95 via-pink-50/60 to-blue-50/40 backdrop-blur-xl", // ✅ Giống Home
  neoCard: "bg-gradient-to-br from-white/95 via-pink-50/60 to-blue-50/40", // ✅ Giống Home
  floatingCard: "from-white/90 via-pink-50/60 to-blue-50/40",

  // GRADIENT COLORS - ĐỔI THÀNH PASTEL GIỐNG HOME
  primaryGradient: "from-pink-400 via-orange-400 to-yellow-400", // ✅ Giống Home button
  secondaryGradient: "from-pink-500 via-orange-500 to-yellow-500", // ✅ Giống Home buttonHover
  accentGradient: "from-orange-500 via-pink-500 to-yellow-500", // ✅ Giống Home textAccent
  successGradient: "from-green-100 to-emerald-200", // ✅ Pastel green

  // TEXT COLORS - ĐỔI THÀNH PASTEL
  heroText: "from-pink-600 via-blue-600 to-orange-600", // ✅ Giống Home textMain
  primaryText: "from-pink-600 via-blue-600 to-orange-600", // ✅ Giống Home textMain
  accentText: "from-orange-500 via-pink-500 to-yellow-500", // ✅ Giống Home textAccent

  // EFFECTS - ĐỔI THÀNH PASTEL
  glow: "shadow-pink-200/60 shadow-2xl", // ✅ Nhẹ hơn
  neonGlow: "shadow-rose-300/50 shadow-xl", // ✅ Nhẹ hơn
  softGlow: "shadow-pink-200/40 shadow-lg", // ✅ Nhẹ hơn

  // DYNAMIC COLORS - ĐỔI THÀNH PASTEL GIỐNG HOME
  dynamicColors: [
    {
      bg: "from-pink-100 to-pink-200",
      text: "text-pink-600",
      glow: "shadow-pink-400/30",
    }, // ✅ Pastel
    {
      bg: "from-blue-100 to-cyan-200",
      text: "text-blue-600",
      glow: "shadow-blue-400/30",
    }, // ✅ Pastel
    {
      bg: "from-yellow-100 to-orange-200",
      text: "text-orange-600",
      glow: "shadow-orange-400/30",
    }, // ✅ Pastel
    {
      bg: "from-green-100 to-emerald-200",
      text: "text-green-600",
      glow: "shadow-green-400/30",
    }, // ✅ Pastel
    {
      bg: "from-purple-100 to-pink-200",
      text: "text-purple-600",
      glow: "shadow-purple-400/30",
    }, // ✅ Pastel
    {
      bg: "from-rose-100 to-red-200",
      text: "text-rose-600",
      glow: "shadow-rose-400/30",
    }, // ✅ Pastel
  ],
};

// ✅ LOADING SPINNER - PINK THEME
const LoadingSpinner = () => (
  <div
    className={`min-h-screen bg-gradient-to-br ${softPinkTheme.pageBackground} flex items-center justify-center relative overflow-hidden`}
  >
    <div className="absolute inset-0">
      <motion.div
        animate={{
          rotate: [0, 360],
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-20 w-32 h-32"
      >
        <div className="w-full h-full bg-gradient-to-r from-pink-400/30 to-rose-400/30 transform rotate-45 rounded-lg filter blur-xl" />
      </motion.div>
    </div>

    <div className="relative z-10 text-center space-y-8">
      <motion.div
        initial={{ scale: 0, rotateY: 0 }}
        animate={{ scale: 1, rotateY: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="relative"
      >
        <div
          className={`w-20 h-20 mx-auto bg-gradient-to-br ${softPinkTheme.primaryGradient} rounded-2xl shadow-2xl relative`}
        >
          <div className="absolute inset-2 bg-white/20 rounded-xl backdrop-blur-sm flex items-center justify-center">
            <Package className="w-8 h-8 text-white" />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2
          className={`text-2xl font-bold bg-gradient-to-r ${softPinkTheme.heroText} bg-clip-text text-transparent`}
        >
          Đang tải Templates
        </h2>
        <p className="text-gray-600">Chuẩn bị trải nghiệm tuyệt vời...</p>
      </motion.div>
    </div>
  </div>
);

// ✅ MOBILE-FIRST FILTER BAR - BEAUTIFUL MOBILE
const MobileFilterBar = ({
  filters,
  sortOptions,
  searchInput,
  setSearchInput,
  handleSearch,
  handleSortChange,
  clearFilters,
  viewMode,
  setViewMode,
  filteredProductsLength,
  currentPage,
  totalPages,
  currentProductsLength,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="lg:hidden space-y-4">
      {/* Main Search Bar */}
      <Card
        className={`bg-gradient-to-r ${softPinkTheme.glassCard} border-0 ${softPinkTheme.softGlow} backdrop-blur-2xl border border-white/20 rounded-2xl`}
      >
        <CardContent className="p-4">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-pink-500 transition-colors" />
              <Input
                placeholder="Tìm kiếm templates..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className={`h-12 pl-10 pr-10 bg-gradient-to-r ${softPinkTheme.glassCard} border border-pink-200/50 rounded-xl focus:ring-2 focus:ring-pink-300 transition-all text-sm`}
              />
              <motion.div
                animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <Stars className="w-4 h-4 text-pink-400" />
              </motion.div>
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                className={`flex-1 h-10 bg-gradient-to-r ${softPinkTheme.primaryGradient} hover:scale-105 ${softPinkTheme.glow} transition-all text-white font-semibold text-sm rounded-xl`}
              >
                <Search className="w-4 h-4 mr-2" />
                Tìm kiếm
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsExpanded(!isExpanded)}
                className={`h-10 px-4 border-2 border-pink-200 hover:bg-pink-50 rounded-xl text-sm`}
              >
                <SlidersHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Stats Bar */}
      <Card
        className={`bg-gradient-to-r ${softPinkTheme.neoCard} border-0 ${softPinkTheme.softGlow} border border-white/20 rounded-2xl`}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Badge
                  className={`bg-gradient-to-r ${softPinkTheme.primaryGradient} text-white font-mono px-3 py-1 text-sm ${softPinkTheme.glow} rounded-lg`}
                >
                  <Package className="w-3 h-3 mr-1" />
                  {filteredProductsLength}
                </Badge>
              </motion.div>
              <div className="text-sm text-gray-600">
                <div className="font-semibold">
                  Trang {currentPage}/{totalPages}
                </div>
                <div className="text-xs">{currentProductsLength} templates</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* View Mode Toggle */}
              <div
                className={`flex rounded-xl border border-pink-200/50 overflow-hidden bg-gradient-to-r ${softPinkTheme.glassCard}`}
              >
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={`rounded-none px-3 py-2 text-xs ${
                    viewMode === "grid"
                      ? `bg-gradient-to-r ${softPinkTheme.primaryGradient} text-white`
                      : `hover:bg-pink-50 text-gray-600`
                  }`}
                >
                  <Grid className="w-3 h-3" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={`rounded-none px-3 py-2 text-xs ${
                    viewMode === "list"
                      ? `bg-gradient-to-r ${softPinkTheme.primaryGradient} text-white`
                      : `hover:bg-pink-50 text-gray-600`
                  }`}
                >
                  <List className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expanded Filters */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card
              className={`bg-gradient-to-r ${softPinkTheme.neoCard} border-0 ${softPinkTheme.softGlow} backdrop-blur-xl border border-white/20 rounded-2xl`}
            >
              <CardContent className="p-4 space-y-4">
                {/* Sort */}
                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2 text-pink-500" />
                    Sắp xếp
                  </Label>
                  <Select
                    value={filters.sortBy}
                    onValueChange={handleSortChange}
                  >
                    <SelectTrigger
                      className={`h-10 bg-gradient-to-r ${softPinkTheme.glassCard} border border-pink-200/50 rounded-xl text-sm`}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <option.icon className="w-4 h-4 text-pink-500" />
                            <span className="font-medium text-sm">
                              {option.label}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Quick Categories */}
                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <Layout className="w-4 h-4 mr-2 text-pink-500" />
                    Danh mục nổi bật
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { text: "Dashboard", icon: BarChart3 },
                      { text: "E-commerce", icon: ShoppingCart },
                      { text: "Landing", icon: Rocket },
                      { text: "Portfolio", icon: Briefcase },
                    ].map((item, i) => (
                      <Button
                        key={item.text}
                        variant="outline"
                        size="sm"
                        onClick={() => setSearchInput(item.text)}
                        className={`h-10 bg-gradient-to-r ${softPinkTheme.dynamicColors[i].bg} ${softPinkTheme.dynamicColors[i].text} border-0 shadow-md hover:${softPinkTheme.dynamicColors[i].glow} transition-all font-medium text-sm rounded-xl`}
                      >
                        <item.icon className="w-4 h-4 mr-2" />
                        {item.text}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="flex-1 h-10 border-2 border-red-200 hover:bg-red-50 text-sm rounded-xl"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Xóa
                  </Button>
                  <Button
                    onClick={() => setIsExpanded(false)}
                    className={`flex-1 h-10 bg-gradient-to-r ${softPinkTheme.secondaryGradient} text-white text-sm rounded-xl`}
                  >
                    <Award className="w-4 h-4 mr-1" />
                    OK
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ✅ DESKTOP FILTER BAR - HORIZONTAL LAYOUT
const DesktopFilterBar = ({
  filters,
  sortOptions,
  searchInput,
  setSearchInput,
  handleSearch,
  handleSortChange,
  clearFilters,
  viewMode,
  setViewMode,
  filteredProductsLength,
  currentPage,
  totalPages,
  currentProductsLength,
}) => {
  const [priceRange, setPriceRange] = useState([0, 2000000]);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="hidden lg:block space-y-6">
      {/* Main Filter Bar */}
      <Card
        className={`bg-gradient-to-r ${softPinkTheme.glassCard} border-0 ${softPinkTheme.softGlow} backdrop-blur-2xl border border-white/20 rounded-2xl`}
      >
        <CardContent className="p-6">
          <div className="grid grid-cols-12 gap-6 items-end">
            {/* Search - 4 columns */}
            <div className="col-span-4">
              <Label className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <Wand2 className="w-4 h-4 mr-2 text-pink-500" />
                Tìm kiếm AI thông minh
              </Label>
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1 group">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-pink-500 transition-colors" />
                  <Input
                    placeholder="VD: Dashboard SaaS, Landing page startup..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className={`h-10 pl-10 pr-10 bg-gradient-to-r ${softPinkTheme.glassCard} border border-pink-200/50 rounded-xl focus:ring-2 focus:ring-pink-300 transition-all text-sm`}
                  />
                  <motion.div
                    animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <Stars className="w-4 h-4 text-pink-400" />
                  </motion.div>
                </div>
                <Button
                  type="submit"
                  className={`h-10 px-4 bg-gradient-to-r ${softPinkTheme.primaryGradient} hover:scale-105 ${softPinkTheme.glow} transition-all text-white font-semibold text-sm rounded-xl`}
                >
                  <Search className="w-4 h-4" />
                </Button>
              </form>
            </div>

            {/* Sort - 2 columns */}
            <div className="col-span-2">
              <Label className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-pink-500" />
                Sắp xếp
              </Label>
              <Select value={filters.sortBy} onValueChange={handleSortChange}>
                <SelectTrigger
                  className={`h-10 bg-gradient-to-r ${softPinkTheme.glassCard} border border-pink-200/50 rounded-xl text-sm`}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <option.icon className="w-4 h-4 text-pink-500" />
                        <span className="font-medium text-sm">
                          {option.label}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* View Mode - 2 columns */}
            <div className="col-span-2">
              <Label className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <Layout className="w-4 h-4 mr-2 text-pink-500" />
                Hiển thị
              </Label>
              <div
                className={`flex rounded-xl border border-pink-200/50 overflow-hidden bg-gradient-to-r ${softPinkTheme.glassCard}`}
              >
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={`rounded-none px-3 py-2 text-sm ${
                    viewMode === "grid"
                      ? `bg-gradient-to-r ${softPinkTheme.primaryGradient} text-white`
                      : `hover:bg-pink-50 text-gray-600`
                  }`}
                >
                  <Grid className="w-4 h-4 mr-1" />
                  Grid
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={`rounded-none px-3 py-2 text-sm ${
                    viewMode === "list"
                      ? `bg-gradient-to-r ${softPinkTheme.primaryGradient} text-white`
                      : `hover:bg-pink-50 text-gray-600`
                  }`}
                >
                  <List className="w-4 h-4 mr-1" />
                  List
                </Button>
              </div>
            </div>

            {/* Stats & Actions - 4 columns */}
            <div className="col-span-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Badge
                    className={`bg-gradient-to-r ${softPinkTheme.primaryGradient} text-white font-mono px-3 py-1 text-sm ${softPinkTheme.glow} rounded-lg`}
                  >
                    <Package className="w-3 h-3 mr-1" />
                    {filteredProductsLength} kết quả
                  </Badge>
                </motion.div>
                <div className="text-sm text-gray-600">
                  Trang {currentPage}/{totalPages} • {currentProductsLength}{" "}
                  templates
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="border-pink-200 hover:bg-pink-50 rounded-xl"
                >
                  <SlidersHorizontal className="w-4 h-4 mr-1" />
                  {isExpanded ? "Thu gọn" : "Mở rộng"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="border-red-200 hover:bg-red-50 rounded-xl"
                >
                  <X className="w-4 h-4 mr-1" />
                  Xóa
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expanded Filters */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card
              className={`bg-gradient-to-r ${softPinkTheme.neoCard} border-0 ${softPinkTheme.softGlow} backdrop-blur-xl border border-white/20 rounded-2xl`}
            >
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {/* Quick Search Suggestions */}
                  <div>
                    <Label className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <Diamond className="w-4 h-4 mr-2 text-pink-500" />
                      🎯 Gợi ý thông minh
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        {
                          text: "Dashboard",
                          icon: BarChart3,
                          color: softPinkTheme.dynamicColors[0],
                        },
                        {
                          text: "E-commerce",
                          icon: ShoppingCart,
                          color: softPinkTheme.dynamicColors[1],
                        },
                        {
                          text: "Landing",
                          icon: Rocket,
                          color: softPinkTheme.dynamicColors[2],
                        },
                        {
                          text: "Portfolio",
                          icon: Briefcase,
                          color: softPinkTheme.dynamicColors[3],
                        },
                      ].map((item, i) => (
                        <motion.div
                          key={item.text}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: i * 0.1 }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSearchInput(item.text)}
                            className={`h-10 w-full bg-gradient-to-r ${item.color.bg} ${item.color.text} border-0 shadow-md hover:${item.color.glow} transition-all font-medium text-sm rounded-xl`}
                          >
                            <item.icon className="w-4 h-4 mr-2" />
                            {item.text}
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <Label className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <DollarSign className="w-4 h-4 mr-2 text-pink-500" />
                      Khoảng giá
                    </Label>
                    <div
                      className={`p-4 bg-gradient-to-r ${softPinkTheme.glassCard} rounded-xl border border-pink-200/50`}
                    >
                      <div className="flex justify-between text-xs font-bold text-gray-700 mb-3">
                        <span>{priceRange[0].toLocaleString()}đ</span>
                        <span>{priceRange[1].toLocaleString()}đ</span>
                      </div>
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={2000000}
                        min={0}
                        step={50000}
                        className="mb-4"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          {
                            label: "Miễn phí",
                            icon: Gift,
                            color: softPinkTheme.dynamicColors[1],
                          },
                          {
                            label: "< 500K",
                            icon: DollarSign,
                            color: softPinkTheme.dynamicColors[0],
                          },
                          {
                            label: "500K-1M",
                            icon: Crown,
                            color: softPinkTheme.dynamicColors[2],
                          },
                          {
                            label: "> 1M",
                            icon: Star,
                            color: softPinkTheme.dynamicColors[3],
                          },
                        ].map((item, i) => (
                          <Button
                            key={item.label}
                            variant="outline"
                            size="sm"
                            className={`h-10 bg-gradient-to-r ${item.color.bg} ${item.color.text} border-0 shadow-md hover:${item.color.glow} transition-all text-xs font-bold rounded-xl`}
                          >
                            <item.icon className="w-3 h-3 mr-1" />
                            {item.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Categories */}
                  <div>
                    <Label className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <Layout className="w-4 h-4 mr-2 text-pink-500" />
                      Danh mục
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        {
                          name: "Dashboard",
                          icon: BarChart3,
                          count: 45,
                          color: softPinkTheme.dynamicColors[0],
                        },
                        {
                          name: "E-commerce",
                          icon: ShoppingCart,
                          count: 38,
                          color: softPinkTheme.dynamicColors[1],
                        },
                        {
                          name: "Landing",
                          icon: Rocket,
                          count: 52,
                          color: softPinkTheme.dynamicColors[2],
                        },
                        {
                          name: "Admin",
                          icon: Settings,
                          count: 29,
                          color: softPinkTheme.dynamicColors[3],
                        },
                        {
                          name: "Portfolio",
                          icon: Briefcase,
                          count: 34,
                          color: softPinkTheme.dynamicColors[4],
                        },
                        {
                          name: "Blog",
                          icon: BookOpen,
                          count: 28,
                          color: softPinkTheme.dynamicColors[5],
                        },
                      ].map((cat, i) => (
                        <motion.div
                          key={cat.name}
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: i * 0.1, type: "spring" }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <Button
                            variant="outline"
                            className={`h-12 w-full flex flex-col items-center gap-1 bg-gradient-to-r ${cat.color.bg} ${cat.color.text} border-0 shadow-md hover:${cat.color.glow} transition-all duration-300 rounded-xl`}
                          >
                            <cat.icon className="w-4 h-4" />
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-bold">
                                {cat.name}
                              </span>
                              <Badge className="bg-white/20 text-white text-xs px-1">
                                {cat.count}
                              </Badge>
                            </div>
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ✅ PRODUCT GRID - 4 COLUMNS ON PC
const ProductGrid = ({ products, viewMode, addToCart }) => (
  <AnimatePresence mode="wait">
    {products.length > 0 ? (
      <motion.div
        key="products"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-6"
        }
      >
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{
              opacity: 0,
              y: 50,
              rotateX: 45,
              scale: 0.8,
            }}
            animate={{
              opacity: 1,
              y: 0,
              rotateX: 0,
              scale: 1,
            }}
            transition={{
              delay: index * 0.1,
              duration: 0.6,
              type: "spring",
              stiffness: 100,
            }}
            whileHover={{
              y: -12,
              rotateY: 5,
              scale: 1.03,
              transition: { duration: 0.3 },
            }}
            className="group"
            style={{ perspective: "1000px" }}
          >
            <div
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${softPinkTheme.neoCard} ${softPinkTheme.softGlow} hover:${softPinkTheme.glow} transition-all duration-700 border border-white/50 group-hover:border-pink-300/50`}
            >
              {/* 3D depth effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-pink-500/5 to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Animated border */}
              <motion.div
                animate={{
                  background: [
                    "linear-gradient(45deg, transparent, transparent)",
                    "linear-gradient(45deg, rgba(244, 114, 182, 0.2), rgba(236, 72, 153, 0.2))",
                    "linear-gradient(45deg, transparent, transparent)",
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100"
                style={{ padding: "2px" }}
              >
                <div className="w-full h-full bg-white rounded-2xl" />
              </motion.div>

              {/* Shine effect */}
              <motion.div
                animate={{ x: [-300, 300] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 5,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 opacity-0 group-hover:opacity-100"
              />

              <div className="relative z-10">
                <ProductCard
                  product={product}
                  onAddToCart={() => {
                    addToCart(product);
                    toast({
                      title: "🛒 Đã thêm vào giỏ hàng",
                      description: `${product.title} đã được thêm thành công.`,
                      duration: 3000,
                    });
                  }}
                  viewMode={viewMode}
                />
              </div>

              {/* Floating action buttons */}
              <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.1 }}
                  whileHover={{ scale: 1.2, rotate: 20 }}
                  whileTap={{ scale: 0.8 }}
                >
                  <Button
                    size="sm"
                    variant="outline"
                    className={`w-8 h-8 p-0 bg-gradient-to-r ${softPinkTheme.glassCard} backdrop-blur-xl border-0 ${softPinkTheme.softGlow} hover:${softPinkTheme.neonGlow} transition-all group/btn rounded-xl`}
                  >
                    <Heart className="w-3 h-3 text-pink-500 group-hover/btn:scale-125 transition-transform" />
                  </Button>
                </motion.div>
                <motion.div
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ scale: 1.2, rotate: -20 }}
                  whileTap={{ scale: 0.8 }}
                >
                  <Button
                    size="sm"
                    variant="outline"
                    className={`w-8 h-8 p-0 bg-gradient-to-r ${softPinkTheme.glassCard} backdrop-blur-xl border-0 ${softPinkTheme.softGlow} hover:${softPinkTheme.neonGlow} transition-all group/btn rounded-xl`}
                  >
                    <Eye className="w-3 h-3 text-pink-500 group-hover/btn:scale-125 transition-transform" />
                  </Button>
                </motion.div>
              </div>

              {/* Floating particles */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0, 0.6, 0],
                    scale: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: i * 0.8,
                    ease: "easeInOut",
                  }}
                  className={`absolute w-1 h-1 rounded-full bg-gradient-to-r ${softPinkTheme.dynamicColors[i % softPinkTheme.dynamicColors.length].bg}`}
                  style={{
                    top: `${20 + Math.random() * 60}%`,
                    left: `${10 + Math.random() * 80}%`,
                  }}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    ) : (
      <motion.div
        key="no-products"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="text-center py-20"
      >
        <Card
          className={`py-20 border-0 ${softPinkTheme.glow} bg-gradient-to-br ${softPinkTheme.neoCard} max-w-xl mx-auto relative overflow-hidden rounded-2xl`}
        >
          <CardContent className="space-y-8 relative z-10">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <div
                className={`w-32 h-32 mx-auto bg-gradient-to-r ${softPinkTheme.primaryGradient} rounded-full flex items-center justify-center ${softPinkTheme.glow} relative overflow-hidden`}
              >
                <Package className="w-16 h-16 text-white relative z-10" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20"
                />
              </div>
            </motion.div>

            <div className="space-y-4">
              <motion.h3
                className={`text-3xl font-bold bg-gradient-to-r ${softPinkTheme.heroText} bg-clip-text text-transparent`}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Không tìm thấy template
              </motion.h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc để khám phá những
                templates tuyệt vời
              </p>
            </div>

            <div className="flex gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  className={`bg-gradient-to-r ${softPinkTheme.glassCard} border border-pink-200 hover:bg-pink-50 px-6 py-3 text-sm font-semibold rounded-xl`}
                >
                  <Search className="w-4 h-4 mr-2" />
                  Thử lại
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, rotate: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  className={`bg-gradient-to-r ${softPinkTheme.secondaryGradient} hover:scale-105 text-white px-6 py-3 text-sm font-semibold ${softPinkTheme.neonGlow} rounded-xl`}
                >
                  <X className="w-4 h-4 mr-2" />
                  Xóa bộ lọc
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )}
  </AnimatePresence>
);

// ✅ PAGINATION - FULL WIDTH & CLOSER TO CONTENT
const SimplePagination = ({
  currentPage,
  totalPages,
  onPageChange,
  filteredProductsLength,
  itemsPerPage,
}) => {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, filteredProductsLength);

  return (
    <motion.div
      className={`w-full py-8 bg-gradient-to-r ${softPinkTheme.sectionBackground} border-t border-pink-200/50 mt-8 relative overflow-hidden`} // ✅ Giảm margin-top từ 12 xuống 8
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      {/* Background decorations */}
      <div className="absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 180, 360],
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 15 + i * 3,
              repeat: Infinity,
              delay: i * 2,
              ease: "easeInOut",
            }}
            className={`absolute w-16 h-16 bg-gradient-to-r ${softPinkTheme.dynamicColors[i % softPinkTheme.dynamicColors.length].bg} rounded-2xl filter blur-2xl`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center space-y-6">
          {/* Stats Info */}
          <motion.div
            className="space-y-3"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card
              className={`inline-block bg-gradient-to-r ${softPinkTheme.glassCard} border-0 ${softPinkTheme.softGlow} backdrop-blur-xl border border-white/20 rounded-2xl`}
            >
              <CardContent className="px-8 py-4">
                <p className="text-base text-gray-700 font-medium">
                  Hiển thị{" "}
                  <span
                    className={`font-bold bg-gradient-to-r ${softPinkTheme.primaryText} bg-clip-text text-transparent text-lg`}
                  >
                    {startItem} - {endItem}
                  </span>{" "}
                  trong tổng số
                  <span
                    className={`font-bold bg-gradient-to-r ${softPinkTheme.accentText} bg-clip-text text-transparent ml-2 text-lg`}
                  >
                    {filteredProductsLength}
                  </span>{" "}
                  templates
                </p>
                <div className="flex items-center justify-center gap-4 text-sm text-gray-600 mt-2">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Badge
                      className={`bg-gradient-to-r ${softPinkTheme.primaryGradient} text-white font-mono px-3 py-1 text-sm shadow-lg rounded-lg`}
                    >
                      <Package className="w-3 h-3 mr-1" />
                      Trang {currentPage}/{totalPages}
                    </Badge>
                  </motion.div>
                  <span>•</span>
                  <span className="font-medium">12 templates/trang</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Pagination Controls */}
          <motion.div
            className="flex items-center justify-center gap-4"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className={`px-6 h-12 bg-gradient-to-r ${softPinkTheme.glassCard} border border-pink-200 hover:bg-pink-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold text-sm rounded-xl`}
              >
                <ArrowUp className="w-4 h-4 mr-2 rotate-[-90deg]" />{" "}
                {/* ✅ Bỏ màu xanh, dùng class */}
                <span>Trước</span>
              </Button>
            </motion.div>

            {/* Page Numbers */}
            <div className="flex gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <motion.div
                    key={pageNum}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      delay: 0.5 + i * 0.1,
                      type: "spring",
                      stiffness: 200,
                    }}
                    whileHover={{ scale: 1.1, y: -4 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      variant={currentPage === pageNum ? "default" : "outline"}
                      onClick={() => onPageChange(pageNum)}
                      className={`w-12 h-12 p-0 transition-all duration-300 font-bold text-sm rounded-xl ${
                        currentPage === pageNum
                          ? `bg-gradient-to-r ${softPinkTheme.primaryGradient} hover:scale-110 text-white ${softPinkTheme.glow} border-0`
                          : `bg-gradient-to-r ${softPinkTheme.glassCard} border border-pink-200 hover:bg-pink-50`
                      }`}
                    >
                      <span className="relative z-10">{pageNum}</span>
                    </Button>
                  </motion.div>
                );
              })}
            </div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className={`px-6 h-12 bg-gradient-to-r ${softPinkTheme.glassCard} border border-pink-200 hover:bg-pink-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold text-sm rounded-xl`}
              >
                <span>Sau</span>
                <ArrowUp className="w-4 h-4 ml-2 rotate-90" />{" "}
                {/* ✅ Bỏ màu xanh, dùng class */}
              </Button>
            </motion.div>
          </motion.div>

          {/* Quick Jump */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center gap-2">
              <Rocket className="w-4 h-4 text-pink-500" />
              <span className="text-sm text-gray-600 font-semibold">
                Chuyển nhanh đến:
              </span>
            </div>
            <div className="flex gap-2">
              {[
                1,
                Math.ceil(totalPages / 4),
                Math.ceil(totalPages / 2),
                Math.ceil((3 * totalPages) / 4),
                totalPages,
              ]
                .filter(
                  (page, index, arr) =>
                    page > 0 &&
                    page <= totalPages &&
                    arr.indexOf(page) === index &&
                    page !== currentPage,
                )
                .slice(0, 4)
                .map((page, i) => (
                  <motion.div
                    key={page}
                    initial={{ scale: 0, rotate: 180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      delay: 0.7 + i * 0.1,
                      type: "spring",
                      stiffness: 200,
                    }}
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    whileTap={{ scale: 0.8 }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onPageChange(page)}
                      className={`w-10 h-8 p-0 text-xs bg-gradient-to-r ${softPinkTheme.glassCard} border border-pink-200 hover:bg-pink-50 transition-all duration-300 font-bold rounded-lg`}
                    >
                      <span className="relative z-10">{page}</span>
                    </Button>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

// ✅ MAIN COMPONENT - SOFT PINK THEME
const Templates: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();

  const [filters, setFilters] = useState<FilterOptions>({
    category: "template",
    sortBy: "newest",
    search: "",
    tags: searchParams.get("tag") ? [searchParams.get("tag")!] : [],
    priceRange: undefined,
  });
  const [searchInput, setSearchInput] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1"),
  );
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProductsByCategory("template");
        setProducts(data);
        toast({
          title: "✅ Đã tải templates thành công",
          description: `Khám phá ${data.length} templates tuyệt đẹp.`,
          duration: 3000,
        });
      } catch (error) {
        toast({
          title: "❌ Lỗi tải dữ liệu",
          description: "Không thể tải templates. Vui lòng thử lại.",
          variant: "destructive",
          duration: 4000,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ✅ ENSURE ALL 26 PRODUCTS ARE DISPLAYED
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Apply search filter
    if (filters.search) {
      result = result.filter(
        (product) =>
          product.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          product.description
            ?.toLowerCase()
            .includes(filters.search.toLowerCase()) ||
          product.tags.some((tag) =>
            tag.toLowerCase().includes(filters.search.toLowerCase()),
          ),
      );
    }

    // Apply sorting
    switch (filters.sortBy) {
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime(),
        );
        break;
      case "popular":
        result.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case "rating":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "price_low":
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      default:
        break;
    }

    return result;
  }, [products, filters]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, search: searchInput }));
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: value as FilterOptions["sortBy"],
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: "template",
      sortBy: "newest",
      search: "",
      tags: [],
      priceRange: undefined,
    });
    setSearchInput("");
    setCurrentPage(1);
    toast({
      title: "🧹 Đã xóa tất cả bộ lọc",
      description: "Hiển thị tất cả templates có sẵn.",
      duration: 2000,
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const params = new URLSearchParams(searchParams);
    if (page > 1) params.set("page", page.toString());
    else params.delete("page");
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const sortOptions = [
    { value: "newest", label: "Mới nhất", icon: Clock },
    { value: "popular", label: "Phổ biến nhất", icon: TrendingUp },
    { value: "rating", label: "Đánh giá cao", icon: Star },
    { value: "price_low", label: "Giá thấp đến cao", icon: DollarSign },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <Helmet>
        <title>Templates Studio - Premium UI Templates | Template Market</title>
        <meta
          name="description"
          content={`Khám phá ${products.length} templates cao cấp cho React, Vue, Next.js. Thiết kế đẹp, code chất lượng, cập nhật liên tục.`}
        />
        <meta
          name="keywords"
          content="react templates, vue templates, nextjs templates, admin dashboard, landing page, ecommerce templates, UI components, premium templates"
        />
        <link rel="canonical" href="https://templatemarket.com/templates" />

        {/* Open Graph Tags */}
        <meta
          property="og:title"
          content="Templates Studio - Premium UI Templates"
        />
        <meta
          property="og:description"
          content={`Khám phá ${products.length} templates cao cấp cho React, Vue, Next.js. Thiết kế chuyên nghiệp, code sạch.`}
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://templatemarket.com/templates"
        />
        <meta
          property="og:image"
          content="https://templatemarket.com/images/templates-preview.jpg"
        />

        {/* Twitter Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Templates Studio - Premium UI Templates"
        />
        <meta
          name="twitter:description"
          content={`${products.length} templates cao cấp cho React, Vue, Next.js`}
        />
        <meta
          name="twitter:image"
          content="https://templatemarket.com/images/templates-preview.jpg"
        />

        {/* Dynamic title based on filters */}
        {filters.search && (
          <>
            <title>{`Tìm kiếm "${filters.search}" - Templates Studio | Template Market`}</title>
            <meta
              name="description"
              content={`Kết quả tìm kiếm cho "${filters.search}": ${filteredProducts.length} templates phù hợp. Thiết kế chuyên nghiệp, code sạch.`}
            />
          </>
        )}
      </Helmet>

      <div
        className={`min-h-screen bg-gradient-to-br ${softPinkTheme.pageBackground} relative`}
      >
        {/* Background decoration */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {/* ✅ THÊM FLOATING ELEMENTS GIỐNG HOME */}
          {[
            {
              emoji: "🍪",
              color: "from-orange-100 to-yellow-200",
              position: "top-10 right-20",
            },
            {
              emoji: "💖",
              color: "from-pink-100 to-pink-200",
              position: "top-32 left-10",
            },
            {
              emoji: "🚀",
              color: "from-blue-100 to-cyan-200",
              position: "bottom-20 right-10",
            },
            {
              emoji: "✨",
              color: "from-yellow-100 to-orange-200",
              position: "bottom-32 left-20",
            },
            {
              emoji: "🎨",
              color: "from-green-100 to-emerald-200",
              position: "top-1/2 right-1/4",
            },
            {
              emoji: "🌟",
              color: "from-pink-100 to-pink-200",
              position: "top-1/3 left-1/3",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              className={`absolute ${item.position} text-4xl opacity-30`}
              animate={{
                y: [0, -15, 0],
                rotate: [0, 8, -8, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 6 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5,
              }}
            >
              <motion.div
                className={`p-2 lg:p-3 rounded-full bg-gradient-to-r ${item.color} backdrop-blur-sm shadow-lg`}
                whileHover={{ scale: 1.2, rotate: 15 }}
              >
                <span>{item.emoji}</span>
              </motion.div>
            </motion.div>
          ))}

          {/* ✅ GIỮ NGUYÊN SHAPES CŨ NHƯNG ĐỔI MÀU */}
          {[...Array(6)].map((_, i) => {
            const shapes = [Heart, Star, Circle, Diamond];
            const Shape = shapes[i % shapes.length];
            return (
              <motion.div
                key={i}
                animate={{
                  x: [0, Math.random() * 100 - 50],
                  y: [0, Math.random() * 100 - 50],
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                  opacity: [0.05, 0.15, 0.05],
                }}
                transition={{
                  duration: 20 + i * 3,
                  repeat: Infinity,
                  delay: i * 2,
                  ease: "easeInOut",
                }}
                className="absolute"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  transform: `scale(${0.3 + Math.random() * 0.4})`,
                }}
              >
                <Shape className="w-16 h-16 text-pink-300/30 filter blur-sm" />
              </motion.div>
            );
          })}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Enhanced Header */}
          <motion.div
            className="text-center mb-8 sm:mb-12 pt-16 sm:pt-12 lg:pt-8"
            initial={{ opacity: 0, y: -80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            {/* ✅ HEADER SECTION - RESPONSIVE */}
            <div className="relative mb-6 sm:mb-8">
              {/* Background Glow Effect - Smaller on mobile */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-pink-200/20 via-blue-200/20 to-yellow-200/20 blur-2xl sm:blur-3xl rounded-full"
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.2, 0.5, 0.2],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />

              {/* Main Header Content */}
              <div className="relative z-10 flex flex-col items-center gap-3 sm:gap-6">
                {/* ✅ ICON + TITLE - MOBILE RESPONSIVE */}
                <motion.div
                  className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  {/* Enhanced Icon - Smaller on mobile */}
                  <motion.div
                    initial={{ scale: 0, rotate: -360 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      delay: 0.5,
                      type: "spring",
                      stiffness: 300,
                      damping: 15,
                    }}
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    className="relative"
                  >
                    <div
                      className={`p-3 sm:p-4 lg:p-5 rounded-xl sm:rounded-2xl bg-gradient-to-br ${softPinkTheme.primaryGradient} ${softPinkTheme.glow} relative overflow-hidden shadow-xl sm:shadow-2xl`}
                    >
                      {/* Shimmer Effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />

                      <Package className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white relative z-10 drop-shadow-lg" />

                      {/* Rotating Border */}
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 10,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="absolute inset-1 border-2 border-white/40 rounded-lg sm:rounded-xl"
                      />
                    </div>
                  </motion.div>

                  {/* ✅ TITLE - MOBILE RESPONSIVE */}
                  <motion.div
                    className="text-center sm:text-left"
                    initial={{ x: 0, opacity: 0, y: 20 }}
                    animate={{ x: 0, opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                  >
                    <motion.h1
                      className={`text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r ${softPinkTheme.heroText} bg-clip-text text-transparent leading-tight mb-1 sm:mb-2`}
                      animate={{
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                      }}
                      transition={{ duration: 6, repeat: Infinity }}
                      style={{ backgroundSize: "200% 200%" }}
                    >
                      Templates Studio
                    </motion.h1>

                    {/* ✅ SUBTITLE - MOBILE RESPONSIVE */}
                    <motion.p
                      className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600 font-medium flex items-center gap-1 sm:gap-2 flex-wrap justify-center sm:justify-start"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9, duration: 0.6 }}
                    >
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-pink-500 drop-shadow-sm" />
                      </motion.div>

                      <span className="bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent font-semibold">
                        Khám phá {products.length} templates siêu đẹp
                      </span>

                      <motion.span
                        animate={{
                          scale: [1, 1.2, 1],
                          rotate: [0, 8, -8, 0],
                        }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                        className="text-pink-500 text-lg sm:text-xl lg:text-2xl filter drop-shadow-sm"
                      >
                        💖
                      </motion.span>
                    </motion.p>
                  </motion.div>
                </motion.div>
              </div>
            </div>

            {/* ✅ STATS SECTION - MOBILE RESPONSIVE + BACKGROUND COLORS */}
            <motion.div
              className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-6 max-w-5xl mx-auto px-4 sm:px-0"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              {[
                {
                  label: "Tổng templates",
                  value: products.length,
                  icon: Package,
                  color: softPinkTheme.dynamicColors[0],
                  iconBg: "from-pink-400 to-rose-400",
                  cardBg: "from-pink-50/90 via-pink-100/70 to-rose-50/80", // ✅ Pink background
                  hoverBg: "from-pink-100/95 via-pink-200/80 to-rose-100/90",
                },
                {
                  label: "Đã lọc",
                  value: filteredProducts.length,
                  icon: Filter,
                  color: softPinkTheme.dynamicColors[1],
                  iconBg: "from-blue-400 to-cyan-400",
                  cardBg: "from-blue-50/90 via-cyan-50/70 to-blue-100/80", // ✅ Blue background
                  hoverBg: "from-blue-100/95 via-cyan-100/80 to-blue-200/90",
                },
                {
                  label: "Hiển thị",
                  value: currentProducts.length,
                  icon: Eye,
                  color: softPinkTheme.dynamicColors[2],
                  iconBg: "from-yellow-400 to-orange-400",
                  cardBg: "from-yellow-50/90 via-orange-50/70 to-yellow-100/80", // ✅ Yellow background
                  hoverBg:
                    "from-yellow-100/95 via-orange-100/80 to-yellow-200/90",
                },
                {
                  label: "Chất lượng",
                  value: "A+",
                  icon: Award,
                  color: softPinkTheme.dynamicColors[3],
                  iconBg: "from-green-400 to-emerald-400",
                  cardBg: "from-green-50/90 via-emerald-50/70 to-green-100/80", // ✅ Green background
                  hoverBg:
                    "from-green-100/95 via-emerald-100/80 to-green-200/90",
                },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    delay: 1.2 + i * 0.15,
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  }}
                  whileHover={{
                    scale: 1.05,
                    y: -8,
                    transition: {
                      duration: 0.3,
                      type: "spring",
                      stiffness: 400,
                    },
                  }}
                  className="group cursor-pointer"
                >
                  <Card
                    className={`text-center border-0 ${softPinkTheme.softGlow} bg-gradient-to-br ${stat.cardBg} backdrop-blur-xl hover:bg-gradient-to-br hover:${stat.hoverBg} transition-all duration-500 relative overflow-hidden rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-lg hover:shadow-2xl`}
                  >
                    {/* Card Shimmer Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <CardContent className="p-3 sm:p-4 lg:p-6 relative z-10">
                      {/* ✅ ENHANCED ICON - MOBILE RESPONSIVE */}
                      <motion.div
                        animate={{
                          rotate: [0, 360],
                          scale: [1, 1.05, 1],
                        }}
                        transition={{
                          rotate: {
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear",
                          },
                          scale: {
                            duration: 3,
                            repeat: Infinity,
                            delay: i * 0.5,
                          },
                        }}
                        className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 mx-auto rounded-xl sm:rounded-2xl bg-gradient-to-br ${stat.iconBg} flex items-center justify-center mb-2 sm:mb-3 lg:mb-4 ${stat.color.glow} relative overflow-hidden group-hover:scale-110 transition-transform duration-300 shadow-md sm:shadow-lg`}
                      >
                        <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white relative z-10 drop-shadow-md" />

                        {/* Pulsing Inner Ring */}
                        <motion.div
                          className="absolute inset-1.5 sm:inset-2 bg-white/20 rounded-lg sm:rounded-xl"
                          animate={{
                            scale: [1, 1.15, 1],
                            opacity: [0.3, 0.6, 0.3],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.3,
                          }}
                        />
                      </motion.div>

                      {/* ✅ ENHANCED VALUE - MOBILE RESPONSIVE */}
                      <motion.div
                        className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-1 lg:mb-2"
                        animate={{
                          scale: [1, 1.05, 1],
                          color: [
                            "rgb(31 41 55)",
                            "rgb(219 39 119)",
                            "rgb(31 41 55)",
                          ],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          delay: i * 0.8,
                        }}
                      >
                        {stat.value}
                      </motion.div>

                      {/* ✅ ENHANCED LABEL - MOBILE RESPONSIVE */}
                      <div className="text-xs sm:text-sm lg:text-base text-gray-600 font-medium leading-tight">
                        {stat.label}
                      </div>

                      {/* ✅ HOVER SPARKLE EFFECT */}
                      <motion.div
                        className="absolute top-1 right-1 sm:top-2 sm:right-2 opacity-0 group-hover:opacity-100"
                        animate={{
                          rotate: [0, 360],
                          scale: [0.8, 1.2, 0.8],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-pink-400" />
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Filter Bars - RESPONSIVE */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mb-8"
          >
            {/* Mobile Filter */}
            <MobileFilterBar
              filters={filters}
              sortOptions={sortOptions}
              searchInput={searchInput}
              setSearchInput={setSearchInput}
              handleSearch={handleSearch}
              handleSortChange={handleSortChange}
              clearFilters={clearFilters}
              viewMode={viewMode}
              setViewMode={setViewMode}
              filteredProductsLength={filteredProducts.length}
              currentPage={currentPage}
              totalPages={totalPages}
              currentProductsLength={currentProducts.length}
            />

            {/* Desktop Filter */}
            <DesktopFilterBar
              filters={filters}
              sortOptions={sortOptions}
              searchInput={searchInput}
              setSearchInput={setSearchInput}
              handleSearch={handleSearch}
              handleSortChange={handleSortChange}
              clearFilters={clearFilters}
              viewMode={viewMode}
              setViewMode={setViewMode}
              filteredProductsLength={filteredProducts.length}
              currentPage={currentPage}
              totalPages={totalPages}
              currentProductsLength={currentProducts.length}
            />
          </motion.div>

          {/* Products Grid - 4 COLUMNS */}
          <motion.div
            className="mb-6" // ✅ Giảm margin-bottom từ 12 xuống 6
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <ProductGrid
              products={currentProducts}
              viewMode={viewMode}
              addToCart={addToCart}
            />
          </motion.div>
        </div>

        {/* Full Width Pagination - CLOSER */}
        <SimplePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          filteredProductsLength={filteredProducts.length}
          itemsPerPage={itemsPerPage}
        />

        {/* Scroll to top - PINK THEME */}
        <motion.button
          className={`fixed bottom-8 right-8 w-14 h-14 rounded-full ${softPinkTheme.glow} bg-gradient-to-r ${softPinkTheme.primaryGradient} hover:scale-110 text-white z-50 transition-all duration-300 relative overflow-hidden group`}
          whileHover={{
            scale: 1.15,
            rotate: 360,
            transition: { duration: 0.6 },
          }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <ArrowUp className="w-7 h-7 mx-auto relative z-10 group-hover:scale-125 transition-transform" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-2 border-white/30 rounded-full"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-white/20 rounded-full"
          />
        </motion.button>
      </div>
    </>
  );
};

export default Templates;
