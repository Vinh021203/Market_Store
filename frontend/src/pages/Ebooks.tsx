import React, { useState, useMemo, useEffect } from "react";
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
  BookOpen,
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
  Code,
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
  GraduationCap,
  Lightbulb,
  Database,
  FileText,
  Smartphone,
  Monitor,
  Target,
  BookMarked,
  Brain,
  Calculator,
  PenTool,
  Laptop,
  Tablet,
  Coffee,
  Bookmark,
  Library,
  FileCheck,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

// ✅ SOFT PINK THEME FOR EBOOKS
const softPinkTheme = {
  // 🌸 PINK BACKGROUND TONES
  pageBackground: "from-pink-50/70 via-rose-50/60 to-red-50/50",
  sectionBackground: "from-white/95 via-pink-25/30 to-rose-25/20",

  // 💗 GLASS & CARDS
  glassCard: "from-white/95 via-pink-25/20 to-rose-25/10 backdrop-blur-xl",
  neoCard: "bg-gradient-to-br from-white via-pink-25/30 to-rose-25/20",
  floatingCard: "from-white/90 via-pink-50/60 to-rose-50/40",

  // 🌹 GRADIENT COLORS - PINK THEME
  primaryGradient: "from-pink-500 via-rose-500 to-red-500",
  secondaryGradient: "from-pink-400 via-rose-500 to-pink-600",
  accentGradient: "from-rose-400 via-pink-500 to-red-400",
  successGradient: "from-pink-300 via-rose-400 to-pink-500",

  // 💕 TEXT COLORS
  heroText: "from-pink-700 via-rose-600 to-red-600",
  primaryText: "from-slate-700 via-pink-700 to-rose-700",
  accentText: "from-rose-600 via-pink-600 to-red-600",

  // ✨ EFFECTS
  glow: "shadow-pink-200/60 shadow-2xl",
  neonGlow: "shadow-rose-300/50 shadow-xl",
  softGlow: "shadow-pink-200/40 shadow-lg",

  // 🎨 DYNAMIC COLORS - PINK VARIATIONS
  dynamicColors: [
    {
      bg: "from-pink-400 to-rose-500",
      text: "text-pink-50",
      glow: "shadow-pink-400/30",
    },
    {
      bg: "from-rose-400 to-red-500",
      text: "text-rose-50",
      glow: "shadow-rose-400/30",
    },
    {
      bg: "from-pink-500 to-rose-600",
      text: "text-pink-50",
      glow: "shadow-pink-500/30",
    },
    {
      bg: "from-red-400 to-pink-500",
      text: "text-red-50",
      glow: "shadow-red-400/30",
    },
    {
      bg: "from-rose-500 to-pink-600",
      text: "text-rose-50",
      glow: "shadow-rose-500/30",
    },
    {
      bg: "from-pink-600 to-red-500",
      text: "text-pink-50",
      glow: "shadow-pink-600/30",
    },
  ],
};

// ✅ LOADING SPINNER - EBOOKS THEME
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

      {/* Floating Ebook Icons */}
      {[
        { icon: BookOpen, color: "text-pink-500/30", delay: 0 },
        { icon: GraduationCap, color: "text-rose-500/30", delay: 0.5 },
        { icon: Lightbulb, color: "text-red-500/30", delay: 1 },
        { icon: Code, color: "text-pink-600/30", delay: 1.5 },
        { icon: Award, color: "text-rose-600/30", delay: 2 },
        { icon: Star, color: "text-red-600/30", delay: 2.5 },
      ].map(({ icon: Icon, color, delay }, index) => (
        <motion.div
          key={index}
          className={`absolute ${color}`}
          style={{
            top: `${15 + Math.random() * 70}%`,
            left: `${10 + Math.random() * 80}%`,
          }}
          animate={{
            y: [0, -40, 0],
            rotate: [0, 360],
            scale: [0.8, 1.2, 0.8],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 6 + index,
            repeat: Infinity,
            ease: "easeInOut",
            delay: delay,
          }}
        >
          <Icon className="w-6 h-6 md:w-10 md:h-10" />
        </motion.div>
      ))}
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
            <BookOpen className="w-8 h-8 text-white" />
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
          Đang tải E-books
        </h2>
        <p className="text-gray-600">
          Chuẩn bị bộ sưu tập e-books chất lượng cao...
        </p>
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
  ebookTags,
  toggleTag,
  handlePriceRangeChange,
  priceRanges,
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
                placeholder="Tìm kiếm e-books..."
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
                  <BookOpen className="w-3 h-3 mr-1" />
                  {filteredProductsLength}
                </Badge>
              </motion.div>
              <div className="text-sm text-gray-600">
                <div className="font-semibold">
                  Trang {currentPage}/{totalPages}
                </div>
                <div className="text-xs">{currentProductsLength} e-books</div>
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
                    Chủ đề nổi bật
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { text: "Programming", icon: Code },
                      { text: "Design", icon: Palette },
                      { text: "Business", icon: Briefcase },
                      { text: "Data Science", icon: BarChart3 },
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

                {/* Popular Tags */}
                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <BookMarked className="w-4 h-4 mr-2 text-pink-500" />
                    Tags phổ biến
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {ebookTags.slice(0, 6).map((tag, i) => (
                      <Button
                        key={tag}
                        variant={
                          filters.tags?.includes(tag) ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => toggleTag(tag)}
                        className={`text-xs h-8 ${
                          filters.tags?.includes(tag)
                            ? `bg-gradient-to-r ${softPinkTheme.primaryGradient} text-white`
                            : "border-pink-200 hover:bg-pink-50"
                        } rounded-lg`}
                      >
                        {tag}
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
  ebookTags,
  toggleTag,
  handlePriceRangeChange,
  priceRanges,
}) => {
  const [priceRange, setPriceRange] = useState([0, 500000]);
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
                    placeholder="VD: JavaScript, Machine Learning, UI/UX..."
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
                    <BookOpen className="w-3 h-3 mr-1" />
                    {filteredProductsLength} kết quả
                  </Badge>
                </motion.div>
                <div className="text-sm text-gray-600">
                  Trang {currentPage}/{totalPages} • {currentProductsLength}{" "}
                  e-books
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
                      <Target className="w-4 h-4 mr-2 text-pink-500" />
                      Gợi ý thông minh
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        {
                          text: "JavaScript",
                          icon: Code,
                          color: softPinkTheme.dynamicColors[0],
                        },
                        {
                          text: "Design",
                          icon: Palette,
                          color: softPinkTheme.dynamicColors[1],
                        },
                        {
                          text: "Data Science",
                          icon: BarChart3,
                          color: softPinkTheme.dynamicColors[2],
                        },
                        {
                          text: "Business",
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
                        max={500000}
                        min={0}
                        step={25000}
                        className="mb-4"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        {priceRanges.map((range, i) => (
                          <Button
                            key={i}
                            variant="outline"
                            size="sm"
                            onClick={() => handlePriceRangeChange(range.value)}
                            className={`h-10 bg-gradient-to-r ${softPinkTheme.dynamicColors[i % softPinkTheme.dynamicColors.length].bg} ${softPinkTheme.dynamicColors[i % softPinkTheme.dynamicColors.length].text} border-0 shadow-md hover:${softPinkTheme.dynamicColors[i % softPinkTheme.dynamicColors.length].glow} transition-all text-xs font-bold rounded-xl flex items-center justify-center gap-2`}
                          >
                            {range.icon === "📚" && (
                              <BookOpen className="w-3 h-3" />
                            )}
                            {range.icon === "🎁" && (
                              <Gift className="w-3 h-3" />
                            )}
                            {range.icon === "💸" && (
                              <DollarSign className="w-3 h-3" />
                            )}
                            {range.icon === "💎" && (
                              <Crown className="w-3 h-3" />
                            )}
                            {range.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Popular Tags */}
                  <div>
                    <Label className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <BookMarked className="w-4 h-4 mr-2 text-pink-500" />
                      Tags phổ biến
                    </Label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {ebookTags.slice(0, 8).map((tag, i) => (
                        <motion.div
                          key={tag}
                          initial={{ scale: 0, rotate: -90 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: i * 0.1, type: "spring" }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <Button
                            variant={
                              filters.tags?.includes(tag)
                                ? "default"
                                : "outline"
                            }
                            onClick={() => toggleTag(tag)}
                            className={`w-full h-10 text-sm ${
                              filters.tags?.includes(tag)
                                ? `bg-gradient-to-r ${softPinkTheme.primaryGradient} text-white shadow-lg`
                                : "border-pink-200 hover:bg-pink-50"
                            } rounded-xl justify-start`}
                          >
                            <div className="flex items-center gap-2">
                              <Bookmark className="w-3 h-3" />
                              <span className="font-medium">{tag}</span>
                            </div>
                            <Badge className="ml-auto bg-white/20 text-xs">
                              {Math.floor(Math.random() * 50) + 10}
                            </Badge>
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
                      title: "Đã thêm vào giỏ hàng",
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
                <BookOpen className="w-16 h-16 text-white relative z-10" />
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
                Không tìm thấy e-book
              </motion.h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc để khám phá những
                e-books tuyệt vời
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

// ✅ PAGINATION - FULL WIDTH & CLOSER
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
      className={`w-full py-8 bg-gradient-to-r ${softPinkTheme.sectionBackground} border-t border-pink-200/50 mt-8 relative overflow-hidden`}
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
                  e-books
                </p>
                <div className="flex items-center justify-center gap-4 text-sm text-gray-600 mt-2">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Badge
                      className={`bg-gradient-to-r ${softPinkTheme.primaryGradient} text-white font-mono px-3 py-1 text-sm shadow-lg rounded-lg`}
                    >
                      <BookOpen className="w-3 h-3 mr-1" />
                      Trang {currentPage}/{totalPages}
                    </Badge>
                  </motion.div>
                  <span>•</span>
                  <span className="font-medium">12 e-books/trang</span>
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
                <ArrowUp className="w-4 h-4 mr-2 rotate-[-90deg]" />
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
                <ArrowUp className="w-4 h-4 ml-2 rotate-90" />
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

// ✅ MAIN COMPONENT - EBOOKS
const Ebooks: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();

  const [filters, setFilters] = useState<FilterOptions>({
    category: "ebook",
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
        const data = await getProductsByCategory("ebook");
        setProducts(data);
        toast({
          title: "✅ Đã tải e-books thành công",
          description: `Khám phá ${data.length} e-books chất lượng cao.`,
          duration: 3000,
        });
      } catch (error) {
        toast({
          title: "❌ Lỗi tải dữ liệu",
          description: "Không thể tải e-books. Vui lòng thử lại.",
          variant: "destructive",
          duration: 4000,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ✅ FIX SORT LOGIC - Sử dụng reviewCount cho popular
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

    // Apply sorting - FIX POPULAR SORT
    switch (filters.sortBy) {
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime(),
        );
        break;
      case "popular":
        // ✅ FIX: Sử dụng reviewCount thay vì views
        result.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
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

  // Get unique tags from products
  const ebookTags = useMemo(() => {
    const tags = new Set<string>();
    products.forEach((p) => p.tags.forEach((tag) => tags.add(tag)));
    return Array.from(tags).sort();
  }, [products]);

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

  const toggleTag = (tag: string) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags?.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...(prev.tags || []), tag],
    }));
    setCurrentPage(1);
  };

  const handlePriceRangeChange = (range: [number, number] | undefined) => {
    setFilters((prev) => ({ ...prev, priceRange: range }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      category: "ebook",
      sortBy: "newest",
      search: "",
      tags: [],
      priceRange: undefined,
    });
    setSearchInput("");
    setCurrentPage(1);
    toast({
      title: "🧹 Đã xóa tất cả bộ lọc",
      description: "Hiển thị tất cả e-books có sẵn.",
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

  const priceRanges = [
    { label: "Tất cả", value: undefined, icon: "📚" },
    { label: "Miễn phí", value: [0, 0] as [number, number], icon: "🎁" },
    { label: "< 100K", value: [1, 100000] as [number, number], icon: "💸" },
    {
      label: "> 100K",
      value: [100000, Infinity] as [number, number],
      icon: "💎",
    },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${softPinkTheme.pageBackground} relative`}
    >
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => {
          const shapes = [BookOpen, Heart, Star, Circle, Diamond, BookMarked];
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
              <Shape className={`w-16 h-16 text-pink-300/30 filter blur-sm`} />
            </motion.div>
          );
        })}
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Enhanced Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex items-center justify-center gap-6 mb-6">
            <motion.div
              initial={{ scale: 0, rotate: -360 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                delay: 0.3,
                type: "spring",
                stiffness: 200,
                damping: 10,
              }}
              className="relative"
            >
              <div
                className={`p-6 rounded-full bg-gradient-to-br ${softPinkTheme.primaryGradient} ${softPinkTheme.glow} relative overflow-hidden`}
              >
                <BookOpen className="w-10 h-10 text-white relative z-10" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-2 border-2 border-white/30 rounded-full"
                />
              </div>
            </motion.div>

            <motion.div
              className="text-left"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <motion.h1
                className={`text-5xl font-bold bg-gradient-to-r ${softPinkTheme.heroText} bg-clip-text text-transparent leading-tight mb-2`}
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 5, repeat: Infinity }}
                style={{ backgroundSize: "200% 200%" }}
              >
                E-books Library
              </motion.h1>
              <motion.p
                className="text-lg text-gray-600 font-medium flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <Sparkles className="w-5 h-5 text-pink-500" />
                Khám phá {products.length} e-books chất lượng cao
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-pink-500"
                >
                  <Library className="w-5 h-5" />
                </motion.span>
              </motion.p>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            {[
              {
                label: "Tổng e-books",
                value: products.length,
                icon: BookOpen,
                color: softPinkTheme.dynamicColors[0],
              },
              {
                label: "Đã lọc",
                value: filteredProducts.length,
                icon: Filter,
                color: softPinkTheme.dynamicColors[1],
              },
              {
                label: "Hiển thị",
                value: currentProducts.length,
                icon: Eye,
                color: softPinkTheme.dynamicColors[2],
              },
              {
                label: "Chất lượng",
                value: "A+",
                icon: Award,
                color: softPinkTheme.dynamicColors[3],
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  delay: 1.0 + i * 0.1,
                  type: "spring",
                  stiffness: 200,
                  damping: 10,
                }}
                whileHover={{
                  scale: 1.05,
                  y: -8,
                  transition: { duration: 0.3 },
                }}
                className="group"
              >
                <Card
                  className={`text-center border-0 ${softPinkTheme.softGlow} bg-gradient-to-br ${softPinkTheme.neoCard} backdrop-blur-xl hover:${softPinkTheme.glow} transition-all duration-500 relative overflow-hidden rounded-2xl`}
                >
                  <CardContent className="p-6">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-br ${stat.color.bg} flex items-center justify-center mb-3 ${stat.color.glow} relative overflow-hidden group-hover:scale-110 transition-transform duration-300`}
                    >
                      <stat.icon className="w-6 h-6 text-white relative z-10" />
                      <div className="absolute inset-2 bg-white/20 rounded-full" />
                    </motion.div>

                    <motion.div
                      className="text-2xl font-bold text-gray-800 mb-1"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: i * 0.5,
                      }}
                    >
                      {stat.value}
                    </motion.div>
                    <div className="text-sm text-gray-600 font-medium">
                      {stat.label}
                    </div>
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
            ebookTags={ebookTags}
            toggleTag={toggleTag}
            handlePriceRangeChange={handlePriceRangeChange}
            priceRanges={priceRanges}
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
            ebookTags={ebookTags}
            toggleTag={toggleTag}
            handlePriceRangeChange={handlePriceRangeChange}
            priceRanges={priceRanges}
          />
        </motion.div>

        {/* Products Grid - 4 COLUMNS */}
        <motion.div
          className="mb-6"
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
  );
};

export default Ebooks;
