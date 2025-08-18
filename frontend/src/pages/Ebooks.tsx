import React, { useState, useMemo, useEffect, useRef } from "react";
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
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import { filterProducts, getAllTags } from "@/lib/products";
import { getProductsByCategory } from "@/lib/products";
import { Product } from "@/types";
import { FilterOptions } from "@/types";
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
  Sparkles,
  Code,
  Palette,
  Coffee,
  Zap,
  Award,
  Eye,
  Heart,
  Download,
  Clock,
  CheckCircle,
  AlertCircle,
  Settings,
  BarChart3,
  Layers,
  Github,
  Twitter,
  Linkedin,
  ArrowUp,
  ArrowRight,
  Globe,
  Building,
  Shield,
  Users,
  Lightbulb,
  Crown,
  Rocket,
  ChevronDown,
  ChevronUp,
  MousePointer,
  Bookmark,
  Share2,
  Download as DownloadIcon,
  MessageSquare,
  ThumbsUp,
  Flame,
  Percent,
  Target,
  Cpu,
  Database,
  Smartphone,
  Monitor,
  Tablet,
  Wifi,
  Lock,
  Unlock,
  Moon,
  Sun,
  GraduationCap,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

type PriceRange = [number, number];

// ✨ Enhanced Loading Component cho E-books
const EnhancedEbookLoadingSpinner = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-blue-50 dark:from-slate-900 dark:via-green-900 dark:to-blue-900 relative overflow-hidden">
    {/* Animated Background Gradients */}
    <div className="absolute inset-0">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-green-400/10 via-blue-400/10 to-purple-400/10 animate-gradient-x"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-green-400/20 rounded-full filter blur-3xl animate-pulse"></div>
      <div
        className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400/20 rounded-full filter blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>
    </div>

    {/* Floating Icons */}
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {[BookOpen, GraduationCap, Lightbulb, Code, Award, Star].map(
        (Icon, index) => (
          <motion.div
            key={index}
            className={`absolute text-green-500/20`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4 + index,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.5,
            }}
          >
            <Icon className="w-8 h-8" />
          </motion.div>
        ),
      )}
    </div>

    <div className="container relative z-10 px-4 py-8 mx-auto">
      <div className="flex flex-col items-center justify-center py-32 space-y-12">
        {/* Main Loading Animation */}
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 border-4 rounded-full border-gradient-to-r from-green-500 to-blue-600 border-t-transparent"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="absolute inset-2 w-16 h-16 border-4 rounded-full border-blue-300 border-r-transparent"
          />
          <div className="absolute inset-6 w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-full"></div>
        </div>

        {/* Loading Text */}
        <div className="text-center space-y-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"
          >
            Đang tải kho e-books tuyệt vời...
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-md mx-auto"
          >
            Chúng tôi đang chuẩn bị những e-books chất lượng cao nhất cho bạn
          </motion.p>
        </div>

        {/* Loading Progress Bar */}
        <div className="w-96 max-w-full">
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green-500 to-blue-600"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* Icon Animation Grid */}
        <div className="grid grid-cols-3 gap-8">
          {[BookOpen, GraduationCap, Lightbulb, Award, Star, Crown].map(
            (Icon, index) => (
              <motion.div
                key={index}
                animate={{
                  scale: [1, 1.3, 1],
                  rotateY: [0, 180, 360],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.3,
                }}
                className="p-4 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg"
              >
                <Icon className="w-8 h-8 text-primary" />
              </motion.div>
            ),
          )}
        </div>
      </div>
    </div>
  </div>
);

// ✨ Enhanced Filter Sidebar cho E-books
const EnhancedEbookFilterSidebar = ({
  filters,
  ebookTags,
  priceRanges,
  sortOptions,
  searchInput,
  setSearchInput,
  handleSearch,
  handleSortChange,
  toggleTag,
  handlePriceRangeChange,
  clearFilters,
  products,
}) => {
  const [expandedSections, setExpandedSections] = useState({
    search: true,
    sort: true,
    price: true,
    tags: true,
    features: false,
    popular: false,
  });

  const [priceRange, setPriceRange] = useState([0, 500000]);
  const [quickFilters, setQuickFilters] = useState({
    newArrivals: false,
    topRated: false,
    onSale: false,
    premium: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const popularTags = ebookTags.slice(0, 8);
  const categoryStats = useMemo(() => {
    const stats = {};
    ebookTags.forEach((tag) => {
      stats[tag] = products.filter((p) => p.tags.includes(tag)).length;
    });
    return stats;
  }, [products, ebookTags]);

  return (
    <motion.aside
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      className="hidden lg:block w-96 flex-shrink-0"
    >
      <div className="sticky top-8 space-y-6">
        {/* Main Filter Card */}
        <Card className="shadow-2xl border-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg overflow-hidden">
          {/* Header */}
          <CardHeader className="pb-4 bg-gradient-to-r from-green-500/10 to-blue-500/10">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-gradient-to-r from-green-500 to-blue-600 shadow-lg">
                  <Filter className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Bộ lọc E-books
                </span>
              </div>
              <Badge
                variant="secondary"
                className="bg-gradient-to-r from-green-100 to-blue-100 text-green-800"
              >
                📚 Smart
              </Badge>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-8 p-6">
            {/* Quick Search */}
            <div className="space-y-4">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection("search")}
              >
                <div className="flex items-center space-x-2">
                  <Search className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-lg">
                    Tìm kiếm thông minh
                  </span>
                </div>
                {expandedSections.search ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </div>

              <AnimatePresence>
                {expandedSections.search && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    <form onSubmit={handleSearch} className="space-y-3">
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder="Tìm e-books, tác giả..."
                          value={searchInput}
                          onChange={(e) => setSearchInput(e.target.value)}
                          className="h-12 pl-12 bg-gradient-to-r from-white to-green-50 dark:from-slate-800 dark:to-green-900 border-2 border-green-200 focus:border-green-500"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <BookOpen className="w-4 h-4 text-green-500" />
                        </div>
                      </div>
                      <Button
                        type="submit"
                        className="w-full h-11 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Search className="w-4 h-4 mr-2" />
                        Tìm kiếm E-books
                      </Button>
                    </form>

                    {/* Quick Filters */}
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(quickFilters).map(([key, value]) => (
                        <Button
                          key={key}
                          variant={value ? "default" : "outline"}
                          size="sm"
                          onClick={() =>
                            setQuickFilters((prev) => ({
                              ...prev,
                              [key]: !prev[key],
                            }))
                          }
                          className="text-xs justify-start"
                        >
                          {key === "newArrivals" && (
                            <Sparkles className="w-3 h-3 mr-1" />
                          )}
                          {key === "topRated" && (
                            <Star className="w-3 h-3 mr-1" />
                          )}
                          {key === "onSale" && (
                            <Percent className="w-3 h-3 mr-1" />
                          )}
                          {key === "premium" && (
                            <Crown className="w-3 h-3 mr-1" />
                          )}
                          {key === "newArrivals" && "Mới nhất"}
                          {key === "topRated" && "Đánh giá cao"}
                          {key === "onSale" && "Đang sale"}
                          {key === "premium" && "Premium"}
                        </Button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Separator className="bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

            {/* Sort Options */}
            <div className="space-y-4">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection("sort")}
              >
                <div className="flex items-center space-x-2">
                  <ArrowUpDown className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-lg">Sắp xếp</span>
                </div>
                {expandedSections.sort ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </div>

              <AnimatePresence>
                {expandedSections.sort && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Select
                      value={filters.sortBy || "newest"}
                      onValueChange={handleSortChange}
                    >
                      <SelectTrigger className="h-12 bg-gradient-to-r from-white to-blue-50 dark:from-slate-800 dark:to-blue-900 border-2 border-blue-200 focus:border-blue-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sortOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center space-x-3">
                              <option.icon className="w-4 h-4" />
                              <span>{option.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Separator className="bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

            {/* Price Range with Slider */}
            <div className="space-y-4">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection("price")}
              >
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  <span className="font-semibold text-lg">Khoảng giá</span>
                </div>
                {expandedSections.price ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </div>

              <AnimatePresence>
                {expandedSections.price && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-6"
                  >
                    {/* Price Slider */}
                    <div className="space-y-4">
                      <div className="px-3">
                        <Slider
                          value={priceRange}
                          onValueChange={setPriceRange}
                          max={500000}
                          min={0}
                          step={25000}
                          className="w-full"
                        />
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground px-3">
                        <span>{priceRange[0].toLocaleString()}đ</span>
                        <span>{priceRange[1].toLocaleString()}đ</span>
                      </div>
                    </div>

                    {/* Quick Price Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                      {priceRanges.map((range, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          <Button
                            variant={
                              JSON.stringify(filters.priceRange) ===
                              JSON.stringify(range.value)
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() => handlePriceRangeChange(range.value)}
                            className="w-full justify-start h-12 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20"
                          >
                            <span className="mr-3 text-lg">{range.icon}</span>
                            <span className="text-sm font-medium">
                              {range.label}
                            </span>
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Separator className="bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

            {/* E-book Topics/Tags */}
            <div className="space-y-4">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection("tags")}
              >
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-orange-600" />
                  <span className="font-semibold text-lg">Chủ đề</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant="secondary"
                    className="text-xs bg-orange-100 text-orange-800"
                  >
                    {ebookTags.length}
                  </Badge>
                  {expandedSections.tags ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              </div>

              <AnimatePresence>
                {expandedSections.tags && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    {/* Popular Tags */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-muted-foreground flex items-center">
                        <Flame className="w-4 h-4 mr-1 text-orange-500" />
                        Chủ đề phổ biến
                      </h4>
                      <div className="space-y-2">
                        {popularTags.map((tag) => (
                          <motion.div
                            key={tag}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button
                              variant={
                                filters.tags?.includes(tag)
                                  ? "default"
                                  : "outline"
                              }
                              onClick={() => toggleTag(tag)}
                              className="w-full justify-between h-11 bg-gradient-to-r from-orange-50 to-yellow-50 hover:from-orange-100 hover:to-yellow-100 dark:from-orange-900/20 dark:to-yellow-900/20"
                            >
                              <div className="flex items-center space-x-2">
                                {filters.tags?.includes(tag) && (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                )}
                                <span className="font-medium">{tag}</span>
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                {categoryStats[tag] || 0}
                              </Badge>
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* All Tags */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-muted-foreground">
                        Tất cả chủ đề
                      </h4>
                      <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
                        {ebookTags.slice(8).map((tag) => (
                          <motion.div
                            key={tag}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Badge
                              variant={
                                filters.tags?.includes(tag)
                                  ? "default"
                                  : "outline"
                              }
                              className="w-full justify-between py-2 px-3 cursor-pointer text-sm font-medium hover:shadow-md transition-all duration-200"
                              onClick={() => toggleTag(tag)}
                            >
                              <div className="flex items-center space-x-2">
                                {filters.tags?.includes(tag) && (
                                  <CheckCircle className="w-3 h-3" />
                                )}
                                <span>{tag}</span>
                              </div>
                              <span className="text-xs opacity-70">
                                {categoryStats[tag] || 0}
                              </span>
                            </Badge>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>

        {/* Clear Filters Card */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20">
          <CardContent className="p-4">
            <Button
              variant="outline"
              onClick={clearFilters}
              className="w-full group hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-900/20 h-12"
            >
              <X className="w-5 h-5 mr-2 group-hover:animate-spin" />
              <span className="font-semibold">Xóa tất cả bộ lọc</span>
            </Button>
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
          <CardContent className="p-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
                Thống kê E-books
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Tổng e-books
                  </span>
                  <Badge variant="secondary">{products.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Đã chọn</span>
                  <Badge variant="secondary">
                    {filters.tags?.length || 0} chủ đề
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Kết quả</span>
                  <Badge variant="default" className="bg-green-600">
                    {
                      products.filter(
                        (p) => filterProducts([p], filters).length > 0,
                      ).length
                    }
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.aside>
  );
};

// ✨ Enhanced Product Grid cho E-books
const EnhancedEbookProductGrid = ({
  currentProducts,
  viewMode,
  isVisible,
  addToCart,
}) => (
  <AnimatePresence mode="wait">
    {currentProducts.length > 0 ? (
      <motion.div
        key="products-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
            : "space-y-8"
        }
      >
        {currentProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.1,
              duration: 0.6,
              ease: [0.215, 0.61, 0.355, 1.0],
            }}
            whileHover={{
              y: -12,
              scale: 1.03,
              transition: { duration: 0.2 },
            }}
            className={`group transition-all duration-500 ${
              isVisible.results
                ? "animate-in slide-in-from-bottom"
                : "opacity-0"
            }`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="relative">
              <ProductCard
                product={product}
                onAddToCart={() => {
                  addToCart(product);
                  toast({
                    title: "📚 Đã thêm vào giỏ hàng",
                    description: `${product.title} đã được thêm vào giỏ hàng.`,
                  });
                }}
                viewMode={viewMode}
              />

              {/* Hover Overlay cho E-books */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg pointer-events-none">
                <div className="absolute bottom-4 left-4 right-4 space-y-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-white/90 text-black">
                      <Star className="w-3 h-3 mr-1" />
                      4.8
                    </Badge>
                    <Badge className="bg-white/90 text-black">
                      <Download className="w-3 h-3 mr-1" />
                      1.2k
                    </Badge>
                    <Badge className="bg-white/90 text-black">
                      <BookOpen className="w-3 h-3 mr-1" />
                      E-book
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    ) : (
      <motion.div
        key="no-products"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <Card className="py-24 text-center border-0 shadow-2xl bg-gradient-to-br from-white via-green-50 to-blue-50 dark:from-slate-800 dark:via-green-900 dark:to-blue-900 overflow-hidden relative">
          {/* Background Animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/5 via-blue-400/5 to-purple-400/5 animate-gradient-x"></div>

          <CardContent className="space-y-10 relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.2,
                type: "spring",
                stiffness: 200,
              }}
            >
              <div className="relative">
                <BookOpen className="w-32 h-32 mx-auto mb-6 text-muted-foreground" />
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-600 opacity-20 rounded-full filter blur-xl"></div>
              </div>
            </motion.div>

            <div className="space-y-6">
              <h3 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Không tìm thấy e-book nào
              </h3>
              <p className="max-w-lg mx-auto text-xl text-muted-foreground leading-relaxed">
                Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm để tìm thấy e-books
                phù hợp với nhu cầu học tập của bạn.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => window.location.reload()}
                  size="lg"
                  className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <X className="w-5 h-5 mr-2" />
                  Xóa tất cả bộ lọc
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-4 text-lg border-2 hover:bg-green-50 dark:hover:bg-green-900/20"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Tìm kiếm khác
                </Button>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                {[
                  { label: "JavaScript", icon: "⚡" },
                  { label: "React", icon: "⚛️" },
                  { label: "Python", icon: "🐍" },
                  { label: "Design", icon: "🎨" },
                  { label: "AI/ML", icon: "🤖" },
                  { label: "Web Dev", icon: "🌐" },
                ].map((suggestion, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Badge
                      variant="outline"
                      className="px-4 py-2 text-sm cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                    >
                      <span className="mr-2">{suggestion.icon}</span>
                      {suggestion.label}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )}
  </AnimatePresence>
);

// ✨ Enhanced Header cho E-books
const EnhancedEbookHeader = ({
  products,
  filteredProducts,
  currentProducts,
  currentPage,
  totalPages,
  itemsPerPage,
}) => (
  <motion.div
    initial={{ opacity: 0, y: -30 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-8"
    id="header"
    data-animate
  >
    {/* Main Header */}
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
      <div className="flex items-center space-x-6">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="flex items-center justify-center w-20 h-20 shadow-2xl rounded-3xl bg-gradient-to-br from-green-500 via-blue-600 to-purple-600"
        >
          <BookOpen className="w-10 h-10 text-white" />
        </motion.div>
        <div>
          <h1 className="text-6xl font-bold text-transparent bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text mb-2">
            E-books
          </h1>
          <p className="text-2xl text-muted-foreground">
            Khám phá bộ sưu tập e-books chất lượng cao về lập trình, thiết kế và
            công nghệ
          </p>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex items-center space-x-3">
        <Button variant="outline" size="lg" className="group">
          <Bookmark className="w-5 h-5 mr-2 group-hover:text-yellow-500" />
          Yêu thích
        </Button>
        <Button variant="outline" size="lg" className="group">
          <Share2 className="w-5 h-5 mr-2 group-hover:text-blue-500" />
          Chia sẻ
        </Button>
        <Button variant="outline" size="lg" className="group">
          <DownloadIcon className="w-5 h-5 mr-2 group-hover:text-green-500" />
          Tải về
        </Button>
      </div>
    </div>

    {/* Enhanced Stats Grid */}
    <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
      {[
        {
          label: "Tổng E-books",
          value: products.length,
          icon: BookOpen,
          color: "from-green-500 to-emerald-500",
          description: "E-books chất lượng cao",
          trend: "+15%",
        },
        {
          label: "Đã lọc",
          value: filteredProducts.length,
          icon: Filter,
          color: "from-blue-500 to-cyan-500",
          description: "Kết quả phù hợp",
          trend: "Active",
        },
        {
          label: "Trang hiện tại",
          value: `${currentPage}/${totalPages || 1}`,
          icon: BarChart3,
          color: "from-purple-500 to-pink-500",
          description: "Điều hướng",
          trend: "Page",
        },
        {
          label: "Hiển thị",
          value: `${currentProducts.length}/${itemsPerPage}`,
          icon: Layers,
          color: "from-orange-500 to-red-500",
          description: "Items per page",
          trend: "View",
        },
      ].map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.15 }}
          whileHover={{ scale: 1.05, y: -5 }}
        >
          <Card className="text-center transition-all duration-500 border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 hover:shadow-2xl overflow-hidden relative group">
            {/* Background Gradient */}
            <div
              className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
            ></div>

            <CardContent className="p-6 relative z-10">
              <div className="space-y-4">
                <div
                  className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}
                >
                  <stat.icon className="w-8 h-8 text-white group-hover:animate-pulse" />
                </div>

                <div className="space-y-2">
                  <div className="text-3xl font-bold text-primary">
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {stat.description}
                  </div>
                </div>

                <Badge
                  variant="secondary"
                  className={`bg-gradient-to-r ${stat.color} text-white text-xs`}
                >
                  {stat.trend}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

// ✨ Enhanced Footer cho E-books

// ✨ Enhanced Scroll to Top với progress ring
const EnhancedEbookScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const toggleVisibility = () => {
      const scrolled = window.pageYOffset;
      const maxHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrolled / maxHeight) * 100;

      setScrollProgress(progress);
      setIsVisible(scrolled > 300);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          className="fixed bottom-8 right-8 z-50 space-y-4"
        >
          {/* Progress Ring */}
          <div className="relative">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                className="text-gray-300 dark:text-gray-600"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="url(#gradient)"
                strokeWidth="4"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 28}`}
                strokeDashoffset={`${2 * Math.PI * 28 * (1 - scrollProgress / 100)}`}
                className="transition-all duration-300"
              />
              <defs>
                <linearGradient
                  id="gradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
            </svg>

            <motion.button
              onClick={scrollToTop}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute inset-2 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
            >
              <ArrowUp className="w-6 h-6" />
            </motion.button>
          </div>

          {/* Progress Text */}
          <div className="text-center">
            <div className="text-xs font-medium text-muted-foreground bg-white dark:bg-slate-800 px-2 py-1 rounded shadow">
              {Math.round(scrollProgress)}%
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ✨ Main E-books Component - Hoàn chỉnh với tất cả tính năng
const Ebooks: React.FC = () => {
  // State Management
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTag = searchParams.get("tag");
  const pageFromUrl = searchParams.get("page");

  const [filters, setFilters] = useState<FilterOptions>({
    category: "ebook",
    sortBy: "newest",
    search: "",
    tags: selectedTag ? [selectedTag] : [],
    priceRange: undefined,
  });

  const [searchInput, setSearchInput] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
  const { addToCart } = useCart();

  const [currentPage, setCurrentPage] = useState(
    pageFromUrl ? parseInt(pageFromUrl, 10) : 1,
  );
  const [itemsPerPage] = useState(12);
  const [shouldResetPage, setShouldResetPage] = useState(false);

  // Effects
  useEffect(() => {
    if (selectedTag) {
      setFilters((prev) => ({
        ...prev,
        tags: [selectedTag],
      }));
      setShouldResetPage(true);
    }
  }, [selectedTag]);

  useEffect(() => {
    const page = searchParams.get("page");
    if (page) {
      setCurrentPage(parseInt(page, 10));
    }
  }, [searchParams]);

  useEffect(() => {
    if (shouldResetPage) {
      setCurrentPage(1);
      const params = new URLSearchParams(searchParams);
      params.delete("page");
      setSearchParams(params);
      setShouldResetPage(false);
    }
  }, [shouldResetPage, setSearchParams]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getProductsByCategory("ebook");
        setProducts(data);
        toast({
          title: "✅ Đã tải e-books",
          description: `Tìm thấy ${data.length} e-books chất lượng cao.`,
        });
      } catch (error) {
        toast({
          title: "❌ Lỗi tải dữ liệu",
          description: "Không thể tải danh sách e-books. Vui lòng thử lại.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }));
          }
        });
      },
      { threshold: 0.1 },
    );

    const sections = document.querySelectorAll("[data-animate]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  // Computed Values
  const ebookTags = useMemo(() => {
    const tags = new Set<string>();
    products.forEach((p) => p.tags.forEach((tag) => tags.add(tag)));
    return Array.from(tags).sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    return filterProducts(products, filters);
  }, [filters, products]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Event Handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const params = new URLSearchParams(searchParams);
    if (page > 1) {
      params.set("page", page.toString());
    } else {
      params.delete("page");
    }
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, search: searchInput }));
    setShouldResetPage(true);
    toast({
      title: "🔍 Đang tìm kiếm...",
      description: `Tìm kiếm "${searchInput}" trong ${products.length} e-books.`,
    });
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
    setShouldResetPage(true);
  };

  const clearFilters = () => {
    setSearchParams({});
    setFilters({
      category: "ebook",
      sortBy: "newest",
      search: "",
      tags: [],
      priceRange: undefined,
    });
    setSearchInput("");
    setShouldResetPage(true);
    toast({
      title: "🧹 Đã xóa bộ lọc",
      description: "Hiển thị tất cả e-books.",
    });
  };

  const handlePriceRangeChange = (range: [number, number] | undefined) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: range,
    }));
    setShouldResetPage(true);
  };

  function comparePriceRange(
    range: PriceRange | undefined,
    min: number,
    max?: number,
  ): boolean {
    if (!range) return false;
    const [lo, hi] = range;

    if (max === undefined) {
      // So khớp "mở" chỉ theo min
      return lo === min;
    }

    return lo === min && hi === max;
  }

  function getPriceRangeLabel(range: [number, number] | undefined) {
    if (!range) return "Tất cả";

    if (range[0] === 0 && range[1] === 100000) return "Dưới 100K";
    if (range[0] === 100000 && range[1] === 200000) return "100K-200K";
    if (range[0] === 200000 && range[1] === Infinity) return "Trên 200K";

    return `${range[0].toLocaleString()}đ - ${range[1].toLocaleString()}đ`;
  }

  // Constants
  const priceRanges = [
    { label: "Tất cả", value: undefined, icon: "📚" },
    { label: "Dưới 100K", value: [0, 100000] as [number, number], icon: "💸" },
    {
      label: "100K - 200K",
      value: [100000, 200000] as [number, number],
      icon: "💵",
    },
    {
      label: "Trên 200K",
      value: [200000, Infinity] as [number, number],
      icon: "💎",
    },
  ];

  const sortOptions = [
    { value: "newest", label: "Mới nhất", icon: Clock },
    { value: "oldest", label: "Cũ nhất", icon: Clock },
    { value: "price_low", label: "Giá thấp đến cao", icon: TrendingUp },
    { value: "price_high", label: "Giá cao đến thấp", icon: TrendingUp },
    { value: "rating", label: "Đánh giá cao", icon: Star },
    { value: "popular", label: "Phổ biến", icon: Award },
  ];

  if (loading) {
    return <EnhancedEbookLoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-blue-50 dark:from-slate-900 dark:via-green-900 dark:to-blue-900 relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/5 via-blue-400/5 to-purple-400/5 animate-gradient-x"></div>

        {/* Floating Icons */}
        {[
          BookOpen,
          GraduationCap,
          Lightbulb,
          Code,
          Award,
          Star,
          Coffee,
          Heart,
        ].map((Icon, index) => (
          <motion.div
            key={index}
            className="absolute"
            style={{
              top: `${10 + index * 12}%`,
              left: `${5 + index * 11}%`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 6 + index,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.7,
            }}
          >
            <Icon className="w-6 h-6 text-green-500/10" />
          </motion.div>
        ))}
      </div>

      {/* Main Layout */}
      <div className="container relative z-10 mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Enhanced Sidebar */}
          <EnhancedEbookFilterSidebar
            filters={filters}
            ebookTags={ebookTags}
            priceRanges={priceRanges}
            sortOptions={sortOptions}
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            handleSearch={handleSearch}
            handleSortChange={handleSortChange}
            toggleTag={toggleTag}
            handlePriceRangeChange={handlePriceRangeChange}
            clearFilters={clearFilters}
            products={products}
          />

          {/* Main Content */}
          <main className="flex-1 space-y-12">
            {/* Enhanced Header */}
            <EnhancedEbookHeader
              products={products}
              filteredProducts={filteredProducts}
              currentProducts={currentProducts}
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
            />

            {/* Mobile Filter Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:hidden"
            >
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="w-full py-6 text-lg bg-white/80 backdrop-blur-sm border-2 hover:bg-white/90"
              >
                <SlidersHorizontal className="w-6 h-6 mr-3" />
                Bộ lọc E-books
                {(filters.search ||
                  filters.tags?.length ||
                  filters.priceRange) && (
                  <Badge className="ml-3 bg-green-500 text-white">
                    {(filters.search ? 1 : 0) +
                      (filters.tags?.length || 0) +
                      (filters.priceRange ? 1 : 0)}
                  </Badge>
                )}
              </Button>
            </motion.div>

            {/* Active Filters Display */}
            <AnimatePresence>
              {(filters.search ||
                filters.tags?.length ||
                filters.priceRange) && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="relative"
                >
                  <Card className="border-0 shadow-xl bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 dark:from-green-900/20 dark:via-blue-900/20 dark:to-purple-900/20 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-blue-500/5 to-purple-500/5"></div>
                    <CardContent className="p-8 relative z-10">
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-blue-600">
                            <Filter className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-lg font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                            Bộ lọc đang áp dụng:
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-3">
                          {filters.search && (
                            <motion.div whileHover={{ scale: 1.05 }}>
                              <Badge className="text-green-800 bg-green-100 dark:bg-green-900 dark:text-green-200 px-4 py-2 text-sm">
                                <Search className="w-4 h-4 mr-2" />"
                                {filters.search}"
                                <button
                                  onClick={() => {
                                    setFilters((prev) => ({
                                      ...prev,
                                      search: "",
                                    }));
                                    setSearchInput("");
                                    setShouldResetPage(true);
                                  }}
                                  className="ml-3 transition-colors hover:text-red-500"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </Badge>
                            </motion.div>
                          )}

                          {filters.tags?.map((tag) => (
                            <motion.div key={tag} whileHover={{ scale: 1.05 }}>
                              <Badge className="text-blue-800 bg-blue-100 dark:bg-blue-900 dark:text-blue-200 px-4 py-2 text-sm">
                                <BookOpen className="w-4 h-4 mr-2" />
                                {tag}
                                <button
                                  onClick={() => toggleTag(tag)}
                                  className="ml-3 transition-colors hover:text-red-500"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </Badge>
                            </motion.div>
                          ))}

                          {filters.priceRange && (
                            <motion.div whileHover={{ scale: 1.05 }}>
                              <Badge className="text-purple-800 bg-purple-100 dark:bg-purple-900 dark:text-purple-200 px-4 py-2 text-sm">
                                <TrendingUp className="w-4 h-4 mr-2" />
                                {getPriceRangeLabel(filters.priceRange)}
                                <button
                                  onClick={() =>
                                    handlePriceRangeChange(undefined)
                                  }
                                  className="ml-3 transition-colors hover:text-red-500"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </Badge>
                            </motion.div>
                          )}
                        </div>

                        <Button
                          variant="outline"
                          onClick={clearFilters}
                          className="ml-auto group hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-900/20"
                        >
                          <X className="w-4 h-4 mr-2 group-hover:animate-spin" />
                          Xóa tất cả
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-8"
              id="results"
              data-animate
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center space-x-6">
                  <div className="space-y-2">
                    <p className="text-2xl text-muted-foreground">
                      Hiển thị{" "}
                      <span className="font-bold text-primary text-3xl">
                        {currentProducts.length}
                      </span>{" "}
                      trên{" "}
                      <span className="font-bold text-primary text-3xl">
                        {filteredProducts.length}
                      </span>{" "}
                      kết quả
                    </p>
                    {filteredProducts.length !== products.length && (
                      <Badge
                        variant="outline"
                        className="text-yellow-800 bg-yellow-100"
                      >
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Đã lọc từ {products.length} e-books
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="text-lg font-semibold text-muted-foreground">
                    Chế độ xem:
                  </span>
                  <div className="flex overflow-hidden border-2 rounded-xl bg-white dark:bg-slate-800">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="lg"
                      onClick={() => setViewMode("grid")}
                      className="rounded-none px-6 py-3"
                    >
                      <Grid className="w-5 h-5 mr-2" />
                      Lưới
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="lg"
                      onClick={() => setViewMode("list")}
                      className="rounded-none px-6 py-3"
                    >
                      <List className="w-5 h-5 mr-2" />
                      Danh sách
                    </Button>
                  </div>
                </div>
              </div>

              {/* Enhanced Product Grid */}
              <EnhancedEbookProductGrid
                currentProducts={currentProducts}
                viewMode={viewMode}
                isVisible={isVisible}
                addToCart={addToCart}
              />

              {/* Enhanced Pagination */}
              {filteredProducts.length > 0 && totalPages > 1 && (
                <div className="mt-16">
                  <Card className="border-0 shadow-xl bg-gradient-to-r from-white to-green-50 dark:from-slate-800 dark:to-green-900">
                    <CardContent className="p-8">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={filteredProducts.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={handlePageChange}
                      />
                    </CardContent>
                  </Card>
                </div>
              )}
            </motion.div>
          </main>
        </div>
      </div>

      {/* Enhanced Scroll to Top Button */}
      <EnhancedEbookScrollToTop />

      {/* Additional Floating Action Buttons */}
      <div className="fixed left-8 bottom-8 z-50 space-y-4">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-3"
          >
            {/* Quick Support */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
            >
              <MessageSquare className="w-6 h-6" />
            </motion.button>

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
            >
              <Moon className="w-6 h-6" />
            </motion.button>

            {/* Learning Path */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-14 h-14 bg-purple-500 hover:bg-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
            >
              <GraduationCap className="w-6 h-6" />
            </motion.button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Toast Notifications Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {/* Toast notifications will appear here */}
      </div>

      {/* Loading Overlay for Actions */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm flex items-center justify-center"
          >
            <Card className="border-0 shadow-2xl bg-white/95 dark:bg-slate-900/95">
              <CardContent className="p-8 text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 border-4 rounded-full border-primary border-t-transparent mx-auto mb-4"
                />
                <h3 className="text-lg font-semibold mb-2">Đang xử lý...</h3>
                <p className="text-muted-foreground">
                  Vui lòng chờ trong giây lát
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Mobile Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-t">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex-1"
            >
              <SlidersHorizontal className="w-5 h-5 mr-2" />
              Bộ lọc
            </Button>
            <Separator orientation="vertical" className="h-8" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              className="flex-1"
            >
              {viewMode === "grid" ? (
                <List className="w-5 h-5 mr-2" />
              ) : (
                <Grid className="w-5 h-5 mr-2" />
              )}
              {viewMode === "grid" ? "Danh sách" : "Lưới"}
            </Button>
            <Separator orientation="vertical" className="h-8" />
            <Button variant="ghost" size="sm" className="flex-1">
              <ArrowUpDown className="w-5 h-5 mr-2" />
              Sắp xếp
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Search Overlay for Mobile */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowFilters(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Bộ lọc E-books</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(false)}
                  >
                    <X className="w-6 h-6" />
                  </Button>
                </div>

                {/* Mobile Filter Content */}
                <div className="space-y-6">
                  {/* Quick Search */}
                  <div className="space-y-3">
                    <h3 className="font-semibold">Tìm kiếm</h3>
                    <form onSubmit={handleSearch} className="space-y-3">
                      <Input
                        type="search"
                        placeholder="Nhập từ khóa..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="h-12"
                      />
                      <Button type="submit" className="w-full">
                        <Search className="w-4 h-4 mr-2" />
                        Tìm kiếm
                      </Button>
                    </form>
                  </div>

                  {/* Popular Tags */}
                  <div className="space-y-3">
                    <h3 className="font-semibold">Chủ đề phổ biến</h3>
                    <div className="flex flex-wrap gap-2">
                      {ebookTags.slice(0, 10).map((tag) => (
                        <Badge
                          key={tag}
                          variant={
                            filters.tags?.includes(tag) ? "default" : "outline"
                          }
                          className="cursor-pointer"
                          onClick={() => toggleTag(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="space-y-3">
                    <h3 className="font-semibold">Khoảng giá</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {priceRanges.map((range, index) => (
                        <Button
                          key={index}
                          variant={
                            JSON.stringify(filters.priceRange) ===
                            JSON.stringify(range.value)
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => handlePriceRangeChange(range.value)}
                          className="justify-start"
                        >
                          <span className="mr-2">{range.icon}</span>
                          {range.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-6 border-t">
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className="flex-1"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Xóa bộ lọc
                    </Button>
                    <Button
                      onClick={() => setShowFilters(false)}
                      className="flex-1"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Áp dụng ({filteredProducts.length})
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Performance Monitoring */}
      <div className="hidden">
        {/* Hidden performance indicators */}
        <div id="render-time">{Date.now()}</div>
        <div id="total-products">{products.length}</div>
        <div id="filtered-products">{filteredProducts.length}</div>
        <div id="current-page">{currentPage}</div>
      </div>
    </div>
  );
};

// CSS Animation Classes (thêm vào global CSS)
const additionalEbookStyles = `
  @keyframes gradient-x {
    0%, 100% {
      transform: translateX(0%);
    }
    50% {
      transform: translateX(100%);
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-20px);
    }
  }

  .animate-gradient-x {
    animation: gradient-x 15s ease infinite;
  }

  .animate-float {
    animation: float 6s ease-in-out infinite;
  }

  .animate-float-delay-1 {
    animation: float 6s ease-in-out infinite;
    animation-delay: 2s;
  }

  .animate-float-delay-2 {
    animation: float 6s ease-in-out infinite;
    animation-delay: 4s;
  }

  /* Custom scrollbar for ebooks */
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 4px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #10b981, #3b82f6);
    border-radius: 4px;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #059669, #2563eb);
  }

  /* Enhanced blur effects */
  .backdrop-blur-ultra {
    backdrop-filter: blur(20px);
  }

  /* Smooth transitions */
  * {
    scroll-behavior: smooth;
  }

  /* Enhanced focus states */
  .focus-visible:focus-visible {
    outline: 2px solid #10b981;
    outline-offset: 2px;
    border-radius: 8px;
  }

  /* Custom gradient borders for ebooks */
  .gradient-border {
    background: linear-gradient(135deg, #10b981, #3b82f6, #8b5cf6);
    padding: 2px;
    border-radius: 12px;
  }

  .gradient-border-content {
    background: white;
    border-radius: 10px;
    height: 100%;
    width: 100%;
  }

  /* Loading animations */
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  .shimmer {
    background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  /* E-book specific animations */
  @keyframes book-flip {
    0% { transform: rotateY(0deg); }
    50% { transform: rotateY(-90deg); }
    100% { transform: rotateY(0deg); }
  }

  .book-flip {
    animation: book-flip 2s ease-in-out infinite;
  }
`;

export default Ebooks;
