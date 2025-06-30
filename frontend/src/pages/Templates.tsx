// pages/Templates.tsx - Mã hoàn chỉnh với enhanced UI và pagination
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
  Package,
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
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Templates: React.FC = () => {
  // ✅ Enhanced state với pagination
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTag = searchParams.get("tag");
  const pageFromUrl = searchParams.get("page");

  const [filters, setFilters] = useState<FilterOptions>({
    category: "template",
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

  // ✅ Pagination state
  const [currentPage, setCurrentPage] = useState(
    pageFromUrl ? parseInt(pageFromUrl, 10) : 1,
  );
  const [itemsPerPage] = useState(12);

  // ✅ Handle URL tag changes
  useEffect(() => {
    if (selectedTag) {
      setFilters((prev) => ({
        ...prev,
        tags: [selectedTag],
      }));
    }
  }, [selectedTag]);

  // ✅ Handle page changes in URL
  useEffect(() => {
    const page = searchParams.get("page");
    if (page) {
      setCurrentPage(parseInt(page, 10));
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getProductsByCategory("template");
        setProducts(data);
        toast({
          title: "✅ Đã tải templates",
          description: `Tìm thấy ${data.length} templates chất lượng cao.`,
        });
      } catch (error) {
        toast({
          title: "❌ Lỗi tải dữ liệu",
          description: "Không thể tải danh sách templates. Vui lòng thử lại.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Intersection Observer for scroll animations
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

  const templateTags = useMemo(() => {
    const tags = new Set<string>();
    products.forEach((p) => p.tags.forEach((tag) => tags.add(tag)));
    return Array.from(tags).sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    return filterProducts(products, filters);
  }, [filters, products]);

  // ✅ Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // ✅ Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
    const params = new URLSearchParams(searchParams);
    params.delete("page");
    setSearchParams(params);
  }, [filters, setSearchParams]);

  // ✅ Handle page change with URL update
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const params = new URLSearchParams(searchParams);
    if (page > 1) {
      params.set("page", page.toString());
    } else {
      params.delete("page");
    }
    setSearchParams(params);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, search: searchInput }));
    toast({
      title: "🔍 Đang tìm kiếm...",
      description: `Tìm kiếm "${searchInput}" trong ${products.length} templates.`,
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
  };

  const clearFilters = () => {
    setSearchParams({});
    setFilters({
      category: "template",
      sortBy: "newest",
      search: "",
      tags: [],
      priceRange: undefined,
    });
    setSearchInput("");
    toast({
      title: "🧹 Đã xóa bộ lọc",
      description: "Hiển thị tất cả templates.",
    });
  };

  const priceRanges = [
    { label: "Tất cả", value: undefined, icon: "💰" },
    { label: "Dưới 200K", value: [0, 200000] as [number, number], icon: "💸" },
    {
      label: "200K - 500K",
      value: [200000, 500000] as [number, number],
      icon: "💵",
    },
    {
      label: "Trên 500K",
      value: [500000, Infinity] as [number, number],
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
        {/* Floating Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 animate-float">
            <Code className="w-8 h-8 text-blue-500 opacity-20" />
          </div>
          <div className="absolute top-1/3 right-1/4 animate-float-delay-1">
            <Palette className="w-6 h-6 text-purple-500 opacity-20" />
          </div>
          <div className="absolute bottom-1/4 left-1/3 animate-float-delay-2">
            <Coffee className="text-orange-500 w-7 h-7 opacity-20" />
          </div>
        </div>

        <div className="container relative z-10 px-4 py-8 mx-auto">
          <div className="flex items-center justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 rounded-full border-primary border-t-transparent"
            />
            <span className="ml-4 text-lg">Đang tải templates...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
      {/* Floating Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 animate-float">
          <Code className="w-8 h-8 text-blue-500 opacity-20" />
        </div>
        <div className="absolute top-1/3 right-1/4 animate-float-delay-1">
          <Palette className="w-6 h-6 text-purple-500 opacity-20" />
        </div>
        <div className="absolute bottom-1/4 left-1/3 animate-float-delay-2">
          <Coffee className="text-orange-500 w-7 h-7 opacity-20" />
        </div>
      </div>

      <div className="container relative z-10 px-4 py-8 mx-auto">
        {/* ✅ Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 space-y-6"
          id="header"
          data-animate
        >
          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="flex items-center justify-center w-12 h-12 shadow-lg rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600"
            >
              <Package className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text">
                Templates
              </h1>
              <p className="text-lg text-muted-foreground">
                Khám phá bộ sưu tập templates chuyên nghiệp cho mọi dự án của
                bạn
              </p>
            </div>
          </div>

          {/* Enhanced Stats */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              {
                label: "Tổng templates",
                value: products.length,
                icon: Package,
                color: "from-blue-500 to-cyan-500",
              },
              {
                label: "Đã lọc",
                value: filteredProducts.length,
                icon: Filter,
                color: "from-green-500 to-emerald-500",
              },
              {
                label: "Trang hiện tại",
                value: `${currentPage}/${totalPages}`,
                icon: BarChart3,
                color: "from-purple-500 to-pink-500",
              },
              {
                label: "Hiển thị",
                value: `${currentProducts.length}/${itemsPerPage}`,
                icon: Layers,
                color: "from-orange-500 to-red-500",
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="text-center transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 hover:shadow-xl">
                  <CardContent className="p-4">
                    <div
                      className={`w-10 h-10 mx-auto mb-2 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center`}
                    >
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ✅ Current Filter Display */}
        {selectedTag && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex items-center p-4 space-x-4 border border-blue-200 rounded-lg bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Đang lọc theo:
                </span>
              </div>
              <Badge className="text-blue-800 bg-blue-100 dark:bg-blue-900 dark:text-blue-200">
                🏷️ {selectedTag}
                <button
                  onClick={() => {
                    setSearchParams({});
                    setFilters((prev) => ({ ...prev, tags: [] }));
                  }}
                  className="ml-2 transition-colors hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
              <span className="text-sm text-blue-600 dark:text-blue-400">
                {filteredProducts.length} kết quả
              </span>
            </div>
          </motion.div>
        )}

        {/* ✅ Enhanced Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 space-y-6"
          id="filters"
          data-animate
        >
          {/* Search Bar */}
          <Card className="border-0 shadow-lg bg-gradient-to-r from-white to-blue-50 dark:from-slate-800 dark:to-blue-900">
            <CardContent className="p-6">
              <form
                onSubmit={handleSearch}
                className="flex flex-col gap-4 md:flex-row"
              >
                <div className="relative flex-1">
                  <Search className="absolute w-5 h-5 transform -translate-y-1/2 left-4 top-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Tìm kiếm templates theo tên, mô tả, công nghệ..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="h-12 pl-12 transition-all duration-300 border-0 bg-background/50 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="flex gap-2">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      type="submit"
                      size="lg"
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Tìm kiếm
                    </Button>
                  </motion.div>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setShowFilters(!showFilters)}
                    className={`transition-all duration-300 ${showFilters ? "bg-primary text-primary-foreground" : ""}`}
                  >
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    Bộ lọc
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Enhanced Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-purple-50 dark:from-slate-800 dark:to-purple-900">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Filter className="w-5 h-5 text-purple-600" />
                      <span>Bộ lọc nâng cao</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {/* Sort */}
                      <div className="space-y-3">
                        <label className="flex items-center space-x-2 text-sm font-medium">
                          <ArrowUpDown className="w-4 h-4" />
                          <span>Sắp xếp theo</span>
                        </label>
                        <Select
                          value={filters.sortBy || "newest"}
                          onValueChange={handleSortChange}
                        >
                          <SelectTrigger className="h-12">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {sortOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                <div className="flex items-center space-x-2">
                                  <option.icon className="w-4 h-4" />
                                  <span>{option.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Price Range */}
                      <div className="space-y-3">
                        <label className="flex items-center space-x-2 text-sm font-medium">
                          <TrendingUp className="w-4 h-4" />
                          <span>Khoảng giá</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {priceRanges.map((range, index) => (
                            <motion.div
                              key={index}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button
                                variant={
                                  JSON.stringify(filters.priceRange) ===
                                  JSON.stringify(range.value)
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() =>
                                  setFilters((prev) => ({
                                    ...prev,
                                    priceRange: range.value,
                                  }))
                                }
                                className="justify-start w-full"
                              >
                                <span className="mr-2">{range.icon}</span>
                                {range.label}
                              </Button>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* View Mode */}
                      <div className="space-y-3">
                        <label className="flex items-center space-x-2 text-sm font-medium">
                          <Eye className="w-4 h-4" />
                          <span>Chế độ xem</span>
                        </label>
                        <div className="flex overflow-hidden border rounded-lg">
                          <Button
                            variant={viewMode === "grid" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("grid")}
                            className="flex-1 rounded-none"
                          >
                            <Grid className="w-4 h-4 mr-2" />
                            Lưới
                          </Button>
                          <Button
                            variant={viewMode === "list" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("list")}
                            className="flex-1 rounded-none"
                          >
                            <List className="w-4 h-4 mr-2" />
                            Danh sách
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="space-y-3">
                      <label className="flex items-center space-x-2 text-sm font-medium">
                        <Sparkles className="w-4 h-4" />
                        <span>Công nghệ & Tags ({templateTags.length})</span>
                      </label>
                      <div className="flex flex-wrap gap-2 overflow-y-auto max-h-32">
                        {templateTags.slice(0, 20).map((tag) => (
                          <motion.div
                            key={tag}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Badge
                              variant={
                                filters.tags?.includes(tag)
                                  ? "default"
                                  : "outline"
                              }
                              className="transition-all duration-300 cursor-pointer hover:shadow-md"
                              onClick={() => toggleTag(tag)}
                            >
                              {filters.tags?.includes(tag) && (
                                <CheckCircle className="w-3 h-3 mr-1" />
                              )}
                              {tag}
                            </Badge>
                          </motion.div>
                        ))}
                        {templateTags.length > 20 && (
                          <Badge variant="outline" className="cursor-pointer">
                            +{templateTags.length - 20} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Filter Actions */}
                    <div className="flex items-center justify-between pt-6 border-t">
                      <Button
                        variant="outline"
                        onClick={clearFilters}
                        className="group"
                      >
                        <X className="w-4 h-4 mr-2 group-hover:animate-spin" />
                        Xóa bộ lọc
                      </Button>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => setShowFilters(false)}
                          className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Áp dụng ({filteredProducts.length})
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active Filters */}
          <AnimatePresence>
            {(filters.search || filters.tags?.length || filters.priceRange) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-wrap items-center gap-2 p-4 border border-blue-200 rounded-lg bg-blue-50 dark:bg-blue-900/20"
              >
                <span className="flex items-center space-x-1 text-sm font-medium text-blue-700 dark:text-blue-300">
                  <Filter className="w-4 h-4" />
                  <span>Đang lọc:</span>
                </span>
                {filters.search && (
                  <Badge
                    variant="secondary"
                    className="text-blue-800 bg-blue-100"
                  >
                    🔍 "{filters.search}"
                    <button
                      onClick={() => {
                        setFilters((prev) => ({ ...prev, search: "" }));
                        setSearchInput("");
                      }}
                      className="ml-2 transition-colors hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {filters.tags?.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-purple-800 bg-purple-100"
                  >
                    🏷️ {tag}
                    <button
                      onClick={() => toggleTag(tag)}
                      className="ml-2 transition-colors hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
                {filters.priceRange && (
                  <Badge
                    variant="secondary"
                    className="text-green-800 bg-green-100"
                  >
                    💰{" "}
                    {filters.priceRange[0] === 0
                      ? "Dưới 200K"
                      : filters.priceRange[0] === 200000
                        ? "200K-500K"
                        : "Trên 500K"}
                    <button
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          priceRange: undefined,
                        }))
                      }
                      className="ml-2 transition-colors hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ✅ Enhanced Results với pagination */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
          id="results"
          data-animate
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <p className="text-muted-foreground">
                Hiển thị{" "}
                <span className="font-semibold text-primary">
                  {currentProducts.length}
                </span>{" "}
                trên{" "}
                <span className="font-semibold text-primary">
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
                  Đã lọc từ {products.length} templates
                </Badge>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Xem:</span>
              <div className="flex overflow-hidden border rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {currentProducts.length > 0 ? (
              <motion.div
                key="products-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
                    : "space-y-6"
                }
              >
                {currentProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className={`transition-all duration-500 ${
                      isVisible.results
                        ? "animate-in slide-in-from-bottom"
                        : "opacity-0"
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <ProductCard
                      product={product}
                      onAddToCart={() => {
                        addToCart(product);
                        toast({
                          title: "🛒 Đã thêm vào giỏ hàng",
                          description: `${product.title} đã được thêm vào giỏ hàng.`,
                        });
                      }}
                      viewMode={viewMode}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="no-products"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Card className="py-16 text-center border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900">
                  <CardContent>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        delay: 0.2,
                        type: "spring",
                        stiffness: 200,
                      }}
                    >
                      <Package className="w-20 h-20 mx-auto mb-6 text-muted-foreground" />
                    </motion.div>
                    <h3 className="mb-4 text-2xl font-semibold">
                      Không tìm thấy template nào
                    </h3>
                    <p className="max-w-md mx-auto mb-6 text-muted-foreground">
                      Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm để tìm thấy
                      templates phù hợp với nhu cầu của bạn.
                    </p>
                    <div className="space-y-3">
                      <Button
                        onClick={clearFilters}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Xóa tất cả bộ lọc
                      </Button>
                      <div className="flex justify-center space-x-2">
                        <Badge variant="outline">
                          💡 Gợi ý: Thử tìm "React"
                        </Badge>
                        <Badge variant="outline">🔥 Hoặc "Dashboard"</Badge>
                        <Badge variant="outline">⚡ Hoặc "E-commerce"</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ✅ Enhanced Pagination */}
          {filteredProducts.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredProducts.length}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Templates;
