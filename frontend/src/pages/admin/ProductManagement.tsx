import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { isAdmin } from "@/lib/auth";
import {
  formatPrice,
  getAllProducts,
  updateProductStatus,
} from "@/lib/products";
import { Product } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Download,
  BookOpen,
  Package,
  ArrowLeft,
  RefreshCw,
  Star,
  TrendingUp,
  Users,
  DollarSign,
  BarChart3,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Coffee,
  Code,
  Palette,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const ProductManagement: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<
    "all" | "template" | "ebook"
  >("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});

  if (!user || !isAdmin(user)) {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getAllProducts();
        setProducts(data);
        toast({
          title: "✅ Đã tải sản phẩm",
          description: `Tải thành công ${data.length} sản phẩm.`,
        });
      } catch (error) {
        toast({
          title: "❌ Lỗi tải dữ liệu",
          description: "Không thể tải danh sách sản phẩm.",
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

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && product.isActive) ||
      (statusFilter === "inactive" && !product.isActive);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleToggleStatus = async (
    productId: string,
    currentStatus: boolean,
  ) => {
    const success = await updateProductStatus(productId, !currentStatus);

    if (success) {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === productId
            ? { ...product, isActive: !product.isActive }
            : product,
        ),
      );

      toast({
        title: "✅ Cập nhật thành công",
        description: `Sản phẩm đã được ${!currentStatus ? "kích hoạt" : "vô hiệu hóa"}.`,
      });
    } else {
      toast({
        title: "❌ Cập nhật thất bại",
        description: "Có lỗi xảy ra khi cập nhật trạng thái sản phẩm.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== productId));
    toast({
      title: "🗑️ Đã xóa sản phẩm",
      description: "Sản phẩm đã được xóa khỏi hệ thống.",
    });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await getAllProducts();
      setProducts(data);
      toast({
        title: "🔄 Đã cập nhật",
        description: "Danh sách sản phẩm đã được làm mới.",
      });
    } catch (error) {
      toast({
        title: "❌ Lỗi cập nhật",
        description: "Không thể cập nhật danh sách sản phẩm.",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };

  const stats = {
    total: products.length,
    active: products.filter((p) => p.isActive).length,
    inactive: products.filter((p) => !p.isActive).length,
    templates: products.filter((p) => p.category === "template").length,
    ebooks: products.filter((p) => p.category === "ebook").length,
  };

  const statsCards = [
    {
      title: "Tổng sản phẩm",
      value: stats.total,
      icon: Package,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient:
        "from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20",
      description: "Tất cả sản phẩm",
    },
    {
      title: "Đang hoạt động",
      value: stats.active,
      icon: CheckCircle,
      gradient: "from-green-500 to-emerald-500",
      bgGradient:
        "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
      description: "Sản phẩm active",
    },
    {
      title: "Tạm ngừng",
      value: stats.inactive,
      icon: AlertTriangle,
      gradient: "from-red-500 to-pink-500",
      bgGradient:
        "from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20",
      description: "Sản phẩm inactive",
    },
    {
      title: "Templates",
      value: stats.templates,
      icon: Code,
      gradient: "from-purple-500 to-indigo-500",
      bgGradient:
        "from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20",
      description: "Mẫu thiết kế",
    },
    {
      title: "E-books",
      value: stats.ebooks,
      icon: BookOpen,
      gradient: "from-orange-500 to-amber-500",
      bgGradient:
        "from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20",
      description: "Sách điện tử",
    },
  ];

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
          className="flex items-center justify-between mb-8"
          id="header"
          data-animate
        >
          <div className="flex items-center space-x-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" size="sm" asChild className="group">
                <Link to="/admin">
                  <ArrowLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
                  Về Dashboard
                </Link>
              </Button>
            </motion.div>
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="flex items-center justify-center w-12 h-12 shadow-lg rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600"
              >
                <Package className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text">
                  Quản lý sản phẩm
                </h1>
                <p className="text-muted-foreground">
                  Quản lý templates và e-books của bạn
                </p>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={refreshing}
                className="transition-all duration-300 group hover:bg-primary/10"
              >
                {refreshing ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                  </motion.div>
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2 group-hover:animate-spin" />
                )}
                Làm mới
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                asChild
                className="transition-all duration-300 shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl"
              >
                <Link to="/admin/products/create">
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm sản phẩm
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* ✅ Enhanced Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-4 mb-8 md:grid-cols-3 lg:grid-cols-5"
          id="stats"
          data-animate
        >
          {statsCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`transition-all duration-500 ${
                isVisible.stats
                  ? "animate-in slide-in-from-bottom"
                  : "opacity-0"
              }`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <Card
                className={`transition-all duration-300 hover:shadow-xl border-0 bg-gradient-to-br ${stat.bgGradient} group`}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="mb-1 text-2xl font-bold text-foreground"
                      >
                        {stat.value}
                      </motion.div>
                      <div className="mb-1 text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {stat.description}
                      </div>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}
                    >
                      <stat.icon className="w-6 h-6 text-white" />
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* ✅ Enhanced Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
          id="filters"
          data-animate
        >
          <Card className="border-0 shadow-lg bg-gradient-to-r from-white to-blue-50 dark:from-slate-800 dark:to-blue-900">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500">
                  <Filter className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text">
                    Bộ lọc và tìm kiếm
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Tìm kiếm và lọc sản phẩm theo tiêu chí
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 md:flex-row">
                <motion.div
                  className="relative flex-1"
                  whileFocus={{ scale: 1.01 }}
                >
                  <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm sản phẩm theo tên, mô tả, tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-12 pl-10 transition-all duration-300 border-0 bg-background/50 focus:ring-2 focus:ring-primary/20"
                  />
                </motion.div>

                <motion.div whileFocus={{ scale: 1.01 }}>
                  <Select
                    value={categoryFilter}
                    onValueChange={(value: any) => setCategoryFilter(value)}
                  >
                    <SelectTrigger className="w-full md:w-[180px] h-12">
                      <SelectValue placeholder="Danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả danh mục</SelectItem>
                      <SelectItem value="template">Templates</SelectItem>
                      <SelectItem value="ebook">E-books</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>

                <motion.div whileFocus={{ scale: 1.01 }}>
                  <Select
                    value={statusFilter}
                    onValueChange={(value: any) => setStatusFilter(value)}
                  >
                    <SelectTrigger className="w-full md:w-[180px] h-12">
                      <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả trạng thái</SelectItem>
                      <SelectItem value="active">Hoạt động</SelectItem>
                      <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ✅ Enhanced Products Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          id="products"
          data-animate
        >
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-transparent bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text">
                      Danh sách sản phẩm
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {filteredProducts.length} sản phẩm được tìm thấy
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-blue-800 bg-blue-100">
                  <Activity className="w-3 h-3 mr-1" />
                  {filteredProducts.length} kết quả
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-muted/50">
                      <TableHead className="font-semibold">Sản phẩm</TableHead>
                      <TableHead className="font-semibold">Danh mục</TableHead>
                      <TableHead className="font-semibold">Giá</TableHead>
                      <TableHead className="font-semibold">Đánh giá</TableHead>
                      <TableHead className="font-semibold">
                        Trạng thái
                      </TableHead>
                      <TableHead className="font-semibold">Ngày tạo</TableHead>
                      <TableHead className="font-semibold text-right">
                        Thao tác
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {filteredProducts.map((product, index) => (
                        <motion.tr
                          key={product.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                          className="transition-all duration-300 group hover:shadow-md"
                        >
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <motion.img
                                whileHover={{ scale: 1.1 }}
                                src={product.image}
                                alt={product.title}
                                className="object-cover w-12 h-12 transition-transform duration-300 rounded-lg shadow-md"
                              />
                              <div>
                                <div className="font-medium transition-colors group-hover:text-primary">
                                  {product.title}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {product.author}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                product.category === "template"
                                  ? "default"
                                  : "secondary"
                              }
                              className="transition-all duration-300 group-hover:scale-105"
                            >
                              {product.category === "template" ? (
                                <>
                                  <Package className="w-3 h-3 mr-1" />
                                  Template
                                </>
                              ) : (
                                <>
                                  <BookOpen className="w-3 h-3 mr-1" />
                                  E-book
                                </>
                              )}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium text-primary">
                                {formatPrice(product.price)}
                              </div>
                              {product.originalPrice && (
                                <div className="text-sm line-through text-muted-foreground">
                                  {formatPrice(product.originalPrice)}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                              <span className="font-medium">
                                {product.rating}
                              </span>
                              <span className="text-muted-foreground">
                                ({product.reviewCount})
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                product.isActive ? "default" : "secondary"
                              }
                              className={`transition-all duration-300 group-hover:scale-105 ${
                                product.isActive
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {product.isActive ? (
                                <>
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Hoạt động
                                </>
                              ) : (
                                <>
                                  <AlertTriangle className="w-3 h-3 mr-1" />
                                  Ngừng
                                </>
                              )}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              <span>
                                {new Date(product.createdAt).toLocaleDateString(
                                  "vi-VN",
                                )}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <motion.div
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="group/btn"
                                  >
                                    <MoreHorizontal className="w-4 h-4 transition-colors group-hover/btn:text-primary" />
                                  </Button>
                                </motion.div>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem asChild>
                                  <Link
                                    to={`/product/${product.id}`}
                                    className="cursor-pointer"
                                  >
                                    <Eye className="w-4 h-4 mr-2" />
                                    Xem chi tiết
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link
                                    to={`/admin/products/edit/${product.id}`}
                                    className="cursor-pointer"
                                  >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Chỉnh sửa
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleToggleStatus(
                                      product.id,
                                      product.isActive,
                                    )
                                  }
                                  className="cursor-pointer"
                                >
                                  <Download className="w-4 h-4 mr-2" />
                                  {product.isActive
                                    ? "Vô hiệu hóa"
                                    : "Kích hoạt"}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleDeleteProduct(product.id)
                                  }
                                  className="text-red-600 cursor-pointer focus:text-red-600"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Xóa
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>

              {/* ✅ Enhanced Empty State */}
              {filteredProducts.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-16 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  >
                    <Package className="w-20 h-20 mx-auto mb-6 text-muted-foreground" />
                  </motion.div>
                  <h3 className="mb-4 text-2xl font-semibold">
                    Không tìm thấy sản phẩm
                  </h3>
                  <p className="max-w-md mx-auto mb-6 text-muted-foreground">
                    Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm để tìm thấy sản
                    phẩm phù hợp.
                  </p>
                  <div className="space-y-3">
                    <Button
                      onClick={() => {
                        setSearchQuery("");
                        setCategoryFilter("all");
                        setStatusFilter("all");
                      }}
                      variant="outline"
                      className="mr-3"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Xóa bộ lọc
                    </Button>
                    <Button
                      asChild
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    >
                      <Link to="/admin/products/create">
                        <Plus className="w-4 h-4 mr-2" />
                        Thêm sản phẩm mới
                      </Link>
                    </Button>
                  </div>
                  <div className="flex justify-center mt-4 space-x-2">
                    <Badge variant="outline">💡 Gợi ý: Thử tìm "React"</Badge>
                    <Badge variant="outline">🔥 Hoặc "Dashboard"</Badge>
                    <Badge variant="outline">⚡ Hoặc "E-commerce"</Badge>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductManagement;
