import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ProductCard from "@/components/ProductCard";
import {
  Heart,
  Package,
  XCircle,
  Search,
  Filter,
  Grid3X3,
  List,
  SortAsc,
  Share2,
  Download,
  ArrowLeft,
  Sparkles,
  Star,
  ShoppingBag,
  Gift,
  Trash2,
  Plus,
  Eye,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { toast } from "@/hooks/use-toast";

const Wishlist: React.FC = () => {
  const { wishlist, removeFromWishlist, clearWishlist, getTotalWishlistItems } =
    useWishlist();
  const { addToCart } = useCart();

  // State management
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
  const [renderKey, setRenderKey] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "price" | "date">("date");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const wishlistCount = getTotalWishlistItems() || 0;

  // Listen to wishlist updates
  useEffect(() => {
    const handleWishlistUpdate = () => {
      setRenderKey((prev) => prev + 1);
    };
    window.addEventListener("wishlistUpdated", handleWishlistUpdate);
    return () =>
      window.removeEventListener("wishlistUpdated", handleWishlistUpdate);
  }, []);

  // Intersection Observer for animations
  useEffect(() => {
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

  // Filter and sort wishlist
  const filteredAndSortedWishlist = React.useMemo(() => {
    let filtered = wishlist.filter(
      (product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    // Sort logic
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.title.localeCompare(b.title);
        case "price":
          return a.price - b.price;
        case "date":
        default:
          return (
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
          );
      }
    });

    return filtered;
  }, [wishlist, searchQuery, sortBy]);

  // Handlers
  const handleRemoveFromWishlist = useCallback(
    (productId: string, productName: string) => {
      removeFromWishlist(productId);
      toast({
        title: "Đã xóa khỏi danh sách yêu thích",
        description: `${productName} đã được xóa khỏi danh sách yêu thích của bạn.`,
      });
      setSelectedItems((prev) => prev.filter((id) => id !== productId));
    },
    [removeFromWishlist],
  );

  const handleClearWishlist = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      clearWishlist();
      setSelectedItems([]);
      setIsLoading(false);
      toast({
        title: "Đã xóa tất cả",
        description: "Danh sách yêu thích đã được xóa hoàn toàn.",
      });
    }, 500);
  }, [clearWishlist]);

  const handleBulkAddToCart = useCallback(() => {
    const selectedProducts = wishlist.filter((p) =>
      selectedItems.includes(p.id),
    );
    selectedProducts.forEach((product) => addToCart(product));
    toast({
      title: `Đã thêm ${selectedProducts.length} sản phẩm vào giỏ hàng`,
      description: "Các sản phẩm đã được thêm thành công.",
    });
    setSelectedItems([]);
  }, [wishlist, selectedItems, addToCart]);

  const handleBulkRemove = useCallback(() => {
    selectedItems.forEach((id) => removeFromWishlist(id));
    toast({
      title: `Đã xóa ${selectedItems.length} sản phẩm`,
      description: "Các sản phẩm đã được xóa khỏi danh sách yêu thích.",
    });
    setSelectedItems([]);
  }, [selectedItems, removeFromWishlist]);

  const handleSelectItem = useCallback((productId: string) => {
    setSelectedItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedItems.length === filteredAndSortedWishlist.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredAndSortedWishlist.map((p) => p.id));
    }
  }, [selectedItems, filteredAndSortedWishlist]);

  return (
    <>
      <Helmet>
        <title>{`Sản phẩm yêu thích (${wishlistCount}) - Template Market`}</title>
        <meta
          name="description"
          content="Xem và quản lý các sản phẩm yêu thích của bạn tại Template Market. Tìm kiếm, sắp xếp và thêm vào giỏ hàng dễ dàng."
        />
        <meta
          name="keywords"
          content="wishlist, sản phẩm yêu thích, template market, giỏ hàng"
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50/30 to-pink-50 dark:from-slate-900 dark:via-orange-900/10 dark:to-red-900/20">
        {/* Enhanced Floating Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <motion.div
            className="absolute top-1/4 left-1/4"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <Heart className="w-8 h-8 text-pink-500/20" />
          </motion.div>
          <motion.div
            className="absolute top-1/3 right-1/4"
            animate={{
              y: [0, 15, 0],
              x: [0, 10, 0],
              scale: [1, 0.9, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          >
            <Package className="w-6 h-6 text-blue-500/20" />
          </motion.div>
          <motion.div
            className="absolute bottom-1/4 left-1/3"
            animate={{
              y: [0, -10, 0],
              rotate: [0, -10, 10, 0],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4,
            }}
          >
            <Heart className="text-red-500/20 w-7 h-7" />
          </motion.div>
          <motion.div
            className="absolute top-1/2 right-1/3"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          >
            <Sparkles className="w-5 h-5 text-orange-500/20" />
          </motion.div>
        </div>

        <div className="container relative z-10 px-4 py-8 mx-auto max-w-7xl">
          {/* Enhanced Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 space-y-6"
            id="wishlist-header"
            data-animate
            key={`header-${renderKey}`}
          >
            {/* Breadcrumb */}
            <motion.nav
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center space-x-2 text-sm text-muted-foreground"
            >
              <Link to="/" className="hover:text-primary transition-colors">
                Trang chủ
              </Link>
              <span>/</span>
              <Link
                to="/account"
                className="hover:text-primary transition-colors"
              >
                Tài khoản
              </Link>
              <span>/</span>
              <span className="text-primary font-medium">
                Danh sách yêu thích
              </span>
            </motion.nav>

            {/* Main Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center space-x-4">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="flex items-center justify-center w-16 h-16 shadow-xl rounded-2xl bg-gradient-to-br from-pink-500 via-red-500 to-orange-500"
                >
                  <Heart className="w-8 h-8 text-white" />
                </motion.div>
                <div>
                  <motion.h1
                    className="text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-gradient-to-r from-pink-600 via-red-600 to-orange-600 bg-clip-text"
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    Sản phẩm yêu thích ({wishlistCount})
                  </motion.h1>
                  <p className="text-base sm:text-lg text-muted-foreground mt-2">
                    Lưu trữ những sản phẩm bạn muốn mua sau này và quản lý dễ
                    dàng
                  </p>

                  {/* Stats badges */}
                  <div className="flex flex-wrap items-center gap-3 mt-4">
                    <Badge className="bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300">
                      <Heart className="w-3 h-3 mr-1" />
                      {wishlistCount} sản phẩm
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                      <Star className="w-3 h-3 mr-1" />
                      Được lưu
                    </Badge>
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                      <Eye className="w-3 h-3 mr-1" />
                      Theo dõi giá
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              {wishlistCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <Button
                    variant="outline"
                    className="group bg-white/70 hover:bg-white border-pink-200 hover:border-pink-300"
                  >
                    <Share2 className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    Chia sẻ
                  </Button>
                  <Button
                    variant="outline"
                    className="group bg-white/70 hover:bg-white border-blue-200 hover:border-blue-300"
                  >
                    <Download className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    Xuất PDF
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Enhanced Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            id="wishlist-content"
            data-animate
            key={`content-${renderKey}`}
          >
            {wishlist.length === 0 ? (
              /* Empty State - Enhanced */
              <Card className="border-0 shadow-2xl bg-gradient-to-br from-white via-orange-50/50 to-pink-50 dark:from-slate-800 dark:via-orange-900/10 dark:to-red-900/20 overflow-hidden">
                <CardContent className="py-20 text-center relative">
                  {/* Decorative background */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-10 left-10 w-20 h-20 rounded-full bg-pink-500"></div>
                    <div className="absolute bottom-10 right-10 w-16 h-16 rounded-full bg-orange-500"></div>
                    <div className="absolute top-1/3 right-1/4 w-12 h-12 rounded-full bg-red-500"></div>
                  </div>

                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      delay: 0.2,
                      type: "spring",
                      stiffness: 200,
                      damping: 20,
                    }}
                    className="relative z-10"
                  >
                    <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 shadow-xl">
                      <Heart className="w-12 h-12 text-white" />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="relative z-10 space-y-6"
                  >
                    <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-200">
                      Danh sách yêu thích trống
                    </h3>
                    <p className="max-w-md mx-auto text-muted-foreground leading-relaxed">
                      Chưa có sản phẩm nào trong danh sách yêu thích của bạn.
                      Hãy khám phá các sản phẩm tuyệt vời và thêm những gì bạn
                      thích!
                    </p>

                    {/* Feature highlights */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 my-8">
                      {[
                        {
                          icon: Heart,
                          text: "Lưu sản phẩm yêu thích",
                          color: "text-pink-500",
                        },
                        {
                          icon: Eye,
                          text: "Theo dõi giá cả",
                          color: "text-blue-500",
                        },
                        {
                          icon: Share2,
                          text: "Chia sẻ với bạn bè",
                          color: "text-green-500",
                        },
                      ].map((item, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7 + idx * 0.1 }}
                          className="flex items-center space-x-2 text-sm text-muted-foreground"
                        >
                          <item.icon className={`w-4 h-4 ${item.color}`} />
                          <span>{item.text}</span>
                        </motion.div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button
                        asChild
                        size="lg"
                        className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Link to="/templates">
                          <Package className="w-5 h-5 mr-2" />
                          Khám phá Templates
                        </Link>
                      </Button>
                      <Button
                        asChild
                        size="lg"
                        variant="outline"
                        className="border-2 border-pink-200 hover:border-pink-300 hover:bg-pink-50 dark:border-pink-700 dark:hover:bg-pink-900/20"
                      >
                        <Link to="/ebooks">
                          <Gift className="w-5 h-5 mr-2" />
                          Xem E-books
                        </Link>
                      </Button>
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            ) : (
              /* Main Content - Enhanced */
              <div className="space-y-8">
                {/* Controls Bar */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20"
                >
                  <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
                    {/* Search and Filter */}
                    <div className="flex flex-col sm:flex-row gap-4 flex-1">
                      <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Tìm kiếm trong danh sách yêu thích..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 bg-white/90 border-pink-200 focus:border-pink-400 rounded-xl"
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant={filterOpen ? "default" : "outline"}
                          size="sm"
                          onClick={() => setFilterOpen(!filterOpen)}
                          className="whitespace-nowrap"
                        >
                          <Filter className="w-4 h-4 mr-2" />
                          Lọc
                        </Button>

                        <select
                          value={sortBy}
                          onChange={(e) =>
                            setSortBy(
                              e.target.value as "name" | "price" | "date",
                            )
                          }
                          className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:border-pink-400 focus:outline-none"
                        >
                          <option value="date">Mới nhất</option>
                          <option value="name">Tên A-Z</option>
                          <option value="price">Giá thấp - cao</option>
                        </select>
                      </div>
                    </div>

                    {/* View Controls */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center bg-gray-100 dark:bg-slate-700 rounded-lg p-1">
                        <Button
                          variant={viewMode === "grid" ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setViewMode("grid")}
                          className="px-3"
                        >
                          <Grid3X3 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant={viewMode === "list" ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setViewMode("list")}
                          className="px-3"
                        >
                          <List className="w-4 h-4" />
                        </Button>
                      </div>

                      <Badge variant="secondary" className="font-medium">
                        {filteredAndSortedWishlist.length} / {wishlistCount}
                      </Badge>
                    </div>
                  </div>

                  {/* Bulk Actions */}
                  <AnimatePresence>
                    {selectedItems.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground">
                              Đã chọn {selectedItems.length} sản phẩm
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleSelectAll}
                            >
                              {selectedItems.length ===
                              filteredAndSortedWishlist.length
                                ? "Bỏ chọn tất cả"
                                : "Chọn tất cả"}
                            </Button>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              onClick={handleBulkAddToCart}
                              className="bg-green-500 hover:bg-green-600 text-white"
                            >
                              <ShoppingBag className="w-4 h-4 mr-2" />
                              Thêm vào giỏ
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleBulkRemove}
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Xóa
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Products Grid/List */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {filteredAndSortedWishlist.length === 0 ? (
                    <Card className="py-16 text-center border-0 shadow-lg bg-gradient-to-br from-white to-orange-50 dark:from-slate-800 dark:to-orange-900/20">
                      <CardContent>
                        <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-xl font-semibold mb-2">
                          Không tìm thấy sản phẩm
                        </h3>
                        <p className="text-muted-foreground">
                          Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
                        </p>
                        <Button
                          className="mt-4"
                          variant="outline"
                          onClick={() => {
                            setSearchQuery("");
                            setSortBy("date");
                          }}
                        >
                          Xóa bộ lọc
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div
                      className={`grid gap-6 ${
                        viewMode === "grid"
                          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                          : "grid-cols-1"
                      }`}
                    >
                      <AnimatePresence mode="popLayout">
                        {filteredAndSortedWishlist.map((product, index) => (
                          <motion.div
                            key={`${product.id}-${renderKey}`}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{
                              delay: index * 0.05,
                              type: "spring",
                              stiffness: 200,
                              damping: 20,
                            }}
                            className="relative group"
                          >
                            {/* Selection checkbox */}
                            <motion.div
                              className="absolute top-3 left-3 z-10"
                              whileHover={{ scale: 1.1 }}
                            >
                              <input
                                type="checkbox"
                                checked={selectedItems.includes(product.id)}
                                onChange={() => handleSelectItem(product.id)}
                                className="w-5 h-5 rounded border-2 border-white shadow-lg bg-white/90 checked:bg-pink-500 checked:border-pink-500 cursor-pointer transition-all duration-200"
                              />
                            </motion.div>

                            <ProductCard
                              product={product}
                              viewMode={viewMode}
                              showAddToCart={true}
                              onAddToCart={() => {
                                addToCart(product);
                                toast({
                                  title: "Đã thêm vào giỏ hàng",
                                  description: `${product.title} đã được thêm vào giỏ hàng.`,
                                });
                              }}
                              onRemoveFromWishlist={() =>
                                handleRemoveFromWishlist(
                                  product.id,
                                  product.title,
                                )
                              }
                              animationDelay={`${index * 50}ms`}
                            />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </motion.div>

                {/* Summary Card */}
                {wishlistCount > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Card className="border-0 shadow-lg bg-gradient-to-r from-pink-50 via-orange-50 to-red-50 dark:from-pink-900/20 dark:via-orange-900/20 dark:to-red-900/20">
                      <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                          <div className="text-center sm:text-left">
                            <h3 className="text-lg font-semibold mb-1">
                              Tổng giá trị danh sách yêu thích
                            </h3>
                            <p className="text-2xl font-bold text-transparent bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text">
                              {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                              }).format(
                                wishlist.reduce(
                                  (total, product) => total + product.price,
                                  0,
                                ),
                              )}
                            </p>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                              onClick={handleClearWishlist}
                              disabled={isLoading}
                              variant="outline"
                              className="border-red-200 text-red-600 hover:bg-red-50"
                            >
                              {isLoading ? (
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity }}
                                  className="w-4 h-4 border-2 border-red-600 rounded-full border-t-transparent mr-2"
                                />
                              ) : (
                                <XCircle className="w-4 h-4 mr-2" />
                              )}
                              Xóa tất cả
                            </Button>

                            <Button
                              onClick={() => {
                                wishlist.forEach((product) =>
                                  addToCart(product),
                                );
                                toast({
                                  title: "Đã thêm tất cả vào giỏ hàng",
                                  description: `${wishlistCount} sản phẩm đã được thêm vào giỏ hàng.`,
                                });
                              }}
                              className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
                            >
                              <ShoppingBag className="w-4 h-4 mr-2" />
                              Thêm tất cả vào giỏ
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delay-1 {
          animation: float 8s ease-in-out infinite;
          animation-delay: 2s;
        }

        .animate-float-delay-2 {
          animation: float 7s ease-in-out infinite;
          animation-delay: 4s;
        }
      `}</style>
    </>
  );
};

export default Wishlist;
