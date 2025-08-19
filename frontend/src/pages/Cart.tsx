import { useState, useEffect } from "react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/products";
import { supabase } from "@/lib/supabase";
import { getCartItems } from "@/lib/cart";
import {
  checkDiscountCode,
  validateDiscount,
  calculateDiscountAmount,
  formatDiscountValue,
} from "@/lib/discounts";
import { Discount } from "@/types";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ArrowRight,
  Heart,
  Star,
  Package,
  Gift,
  Shield,
  Zap,
  Clock,
  CheckCircle,
  AlertCircle,
  Sparkles,
  CreditCard,
  Truck,
  Award,
  Coffee,
  Code,
  Palette,
  X,
  Tag,
  Percent,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Info,
  ArrowUp,
  Crown,
  Gem,
  Rocket,
  Save,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Cart: React.FC = () => {
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
  } = useCart();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Enhanced discount state
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<Discount | null>(null);
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  const [availableDiscounts, setAvailableDiscounts] = useState<Discount[]>([]);
  const [discountError, setDiscountError] = useState("");
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showFloatingNav, setShowFloatingNav] = useState(false);

  const { scrollYProgress } = useScroll();
  const headerY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  // ✅ Enhanced Color Schemes - Purple-Magenta-Rose
  const colorSchemes = {
    primary: {
      gradient: "from-purple-500 via-violet-500 to-indigo-500",
      bg: "from-purple-50/80 to-violet-50/80",
      darkBg: "from-purple-900/30 to-violet-900/30",
    },
    secondary: {
      gradient: "from-magenta-500 via-pink-500 to-rose-500",
      bg: "from-magenta-50/80 to-pink-50/80",
      darkBg: "from-magenta-900/30 to-pink-900/30",
    },
    accent: {
      gradient: "from-rose-500 via-pink-500 to-fuchsia-500",
      bg: "from-rose-50/80 to-pink-50/80",
      darkBg: "from-rose-900/30 to-pink-900/30",
    },
    success: {
      gradient: "from-emerald-500 via-teal-500 to-cyan-500",
      bg: "from-emerald-50/80 to-teal-50/80",
      darkBg: "from-emerald-900/30 to-teal-900/30",
    },
  };

  // Enhanced discount calculations
  const discountAmount = appliedDiscount
    ? calculateDiscountAmount(appliedDiscount, totalPrice)
    : 0;
  const finalPrice = totalPrice - discountAmount;

  // ✅ Generate title strings before using in Helmet
  const pageTitle =
    items.length === 0
      ? "🛒 Giỏ hàng trống | Template Market - Shopping Cart"
      : `🛒 Giỏ hàng (${totalItems} sản phẩm) | Template Market`;

  const pageDescription =
    items.length === 0
      ? "Giỏ hàng của bạn hiện đang trống. Khám phá hàng ngàn template và ebook chất lượng cao."
      : `Giỏ hàng với ${totalItems} sản phẩm, tổng giá trị ${formatPrice(finalPrice)}. Thanh toán an toàn và nhận ngay.`;

  // ✅ Scroll Effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setShowFloatingNav(window.scrollY > 500);

      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(Math.min(progress, 100));
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch cart items
        const session = await supabase.auth.getSession();
        const userId = session.data.session?.user.id;
        if (userId) {
          const items = await getCartItems(userId);
          setCartItems(items);
        }

        // Fetch available active discounts for suggestions
        const { data: discounts } = await supabase
          .from("discounts")
          .select("*")
          .eq("is_active", true)
          .gte("end_date", new Date().toISOString())
          .lte("start_date", new Date().toISOString())
          .limit(4);

        if (discounts) {
          setAvailableDiscounts(discounts);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
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

  const handleRemoveItem = (productId: string, productTitle: string) => {
    removeFromCart(productId);
    toast({
      title: "🗑️ Đã xóa khỏi giỏ hàng",
      description: `${productTitle} đã được xóa khỏi giỏ hàng.`,
    });
  };

  const handleUpdateQuantity = (
    productId: string,
    newQuantity: number,
    productTitle: string,
  ) => {
    updateQuantity(productId, newQuantity);
    toast({
      title: "✅ Đã cập nhật số lượng",
      description: `Số lượng ${productTitle} đã được cập nhật.`,
    });
  };

  const handleClearCart = () => {
    clearCart();
    setAppliedDiscount(null);
    toast({
      title: "🧹 Đã xóa tất cả",
      description: "Giỏ hàng đã được làm trống.",
      variant: "destructive",
    });
  };

  // Enhanced discount application
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setDiscountError("Vui lòng nhập mã giảm giá");
      return;
    }

    setIsApplyingDiscount(true);
    setDiscountError("");

    try {
      const discount = await checkDiscountCode(couponCode.trim());

      if (!discount) {
        setDiscountError("Mã giảm giá không tồn tại hoặc đã hết hạn");
        toast({
          title: "❌ Mã giảm giá không hợp lệ",
          description: "Mã này không tồn tại hoặc đã hết hạn.",
          variant: "destructive",
        });
        return;
      }

      const validation = validateDiscount(discount, totalPrice);

      if (!validation.isValid) {
        setDiscountError(validation.reason || "Mã giảm giá không thể áp dụng");
        toast({
          title: "❌ Không thể áp dụng",
          description: validation.reason,
          variant: "destructive",
        });
        return;
      }

      setAppliedDiscount(discount);
      setCouponCode("");
      setDiscountError("");

      const savedAmount = calculateDiscountAmount(discount, totalPrice);

      toast({
        title: "🎉 Mã giảm giá đã áp dụng!",
        description: `Bạn tiết kiệm được ${formatPrice(savedAmount)} với mã ${discount.code}.`,
      });
    } catch (error) {
      console.error("Error applying discount:", error);
      setDiscountError("Có lỗi xảy ra khi áp dụng mã giảm giá");
      toast({
        title: "❌ Lỗi hệ thống",
        description: "Không thể áp dụng mã giảm giá. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsApplyingDiscount(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedDiscount(null);
    setCouponCode("");
    setDiscountError("");
    toast({
      title: "🗑️ Đã xóa mã giảm giá",
      description: "Mã giảm giá đã được gỡ bỏ.",
    });
  };

  const handleQuickApplyDiscount = async (discount: Discount) => {
    const validation = validateDiscount(discount, totalPrice);

    if (!validation.isValid) {
      toast({
        title: "❌ Không thể áp dụng",
        description: validation.reason,
        variant: "destructive",
      });
      return;
    }

    setAppliedDiscount(discount);
    const savedAmount = calculateDiscountAmount(discount, totalPrice);

    toast({
      title: "🎉 Mã giảm giá đã áp dụng!",
      description: `Bạn tiết kiệm được ${formatPrice(savedAmount)} với mã ${discount.code}.`,
    });
  };

  // ✅ Reading Progress Component
  const ReadingProgress: React.FC = () => (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 z-50">
      <motion.div
        className="h-full bg-gradient-to-r from-purple-500 to-magenta-500"
        style={{ width: `${scrollProgress}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${scrollProgress}%` }}
        transition={{ duration: 0.1 }}
      />
    </div>
  );

  // ✅ Floating Navigation
  const FloatingNav: React.FC = () => (
    <AnimatePresence>
      {showFloatingNav && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 right-6 z-40"
        >
          <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg border-0 shadow-2xl">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                  className="bg-gradient-to-r from-purple-500 to-magenta-500 text-white border-0 hover:from-purple-600 hover:to-magenta-600"
                >
                  <ArrowUp className="w-4 h-4" />
                </Button>
                <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                  {Math.round(scrollProgress)}% đã đọc
                </div>
                <Progress value={scrollProgress} className="w-20" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Empty cart state
  if (items.length === 0) {
    return (
      <>
        {/* ✅ Fixed Helmet - using string variables instead of template literals */}
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageDescription} />
          <meta
            name="keywords"
            content="giỏ hàng, shopping cart, template market, templates, ebooks"
          />
          <link rel="canonical" href="https://templatemarket.vn/cart" />
        </Helmet>

        <ReadingProgress />
        <FloatingNav />

        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-magenta-50 to-rose-100 dark:from-slate-900 dark:via-purple-900/20 dark:to-magenta-900/30">
          {/* Enhanced Floating Elements */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            {[ShoppingCart, Package, Gift, Heart, Crown].map((Icon, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  top: `${20 + (i % 3) * 30}%`,
                  left: `${10 + (i % 4) * 25}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  rotate: [0, 15, -15, 0],
                  opacity: [0.1, 0.4, 0.1],
                }}
                transition={{
                  duration: 8 + i * 2,
                  repeat: Infinity,
                  delay: i * 1.5,
                  ease: "easeInOut",
                }}
              >
                <Icon className="w-8 h-8 text-purple-400/30" />
              </motion.div>
            ))}
          </div>

          <div className="container relative z-10 px-4 py-8 mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto"
            >
              <Card className="py-12 text-center border-0 shadow-2xl bg-gradient-to-br from-white/95 to-purple-50/80 backdrop-blur-xl rounded-3xl">
                <CardContent>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  >
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-magenta-500 rounded-3xl flex items-center justify-center shadow-xl">
                      <ShoppingCart className="w-10 h-10 text-white" />
                    </div>
                  </motion.div>
                  <h2 className="mb-4 text-2xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-magenta-600 bg-clip-text">
                    Giỏ hàng trống
                  </h2>
                  <p className="mb-8 text-gray-600 dark:text-gray-400 leading-relaxed">
                    Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá những
                    sản phẩm tuyệt vời của chúng tôi!
                  </p>
                  <div className="space-y-4">
                    <Button
                      asChild
                      className="w-full bg-gradient-to-r from-purple-500 via-magenta-500 to-rose-500 hover:from-purple-600 hover:via-magenta-600 hover:to-rose-600 rounded-2xl text-white border-0 h-12 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <Link to="/templates">
                        <Code className="w-5 h-5 mr-2" />
                        Xem Templates
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      asChild
                      className="w-full bg-white/80 hover:bg-purple-50 border-purple-200 rounded-2xl h-12"
                    >
                      <Link to="/ebooks">
                        <Coffee className="w-5 h-5 mr-2" />
                        Xem E-books
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* ✅ Fixed Helmet - using string variables instead of template literals */}
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta
          name="keywords"
          content="giỏ hàng, shopping cart, mã giảm giá, thanh toán, template market"
        />
        <link rel="canonical" href="https://templatemarket.vn/cart" />
      </Helmet>

      <ReadingProgress />
      <FloatingNav />

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-magenta-50 to-rose-100 dark:from-slate-900 dark:via-purple-900/20 dark:to-magenta-900/30">
        {/* Enhanced Floating Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {[Code, Palette, Gift, Crown, Gem, Sparkles].map((Icon, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                top: `${15 + (i % 4) * 25}%`,
                left: `${8 + (i % 3) * 30}%`,
              }}
              animate={{
                y: [0, -25, 0],
                rotate: [0, 12, -12, 0],
                opacity: [0.1, 0.5, 0.1],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 10 + i * 3,
                repeat: Infinity,
                delay: i * 2,
                ease: "easeInOut",
              }}
            >
              <Icon className="w-8 h-8 text-purple-400/30" />
            </motion.div>
          ))}
        </div>

        <div className="container relative z-10 px-4 py-8 mx-auto">
          {/* Enhanced Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ y: headerY, opacity: headerOpacity }}
            className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 p-6 bg-gradient-to-r from-white/90 via-purple-50/90 to-magenta-50/90 backdrop-blur-xl border border-purple-200/50 rounded-3xl shadow-xl gap-4"
          >
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="group bg-white/70 hover:bg-white/90 rounded-2xl shadow-md border border-purple-200/50"
              >
                <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1 text-purple-600" />
                <span className="font-semibold text-purple-800">
                  Tiếp tục mua sắm
                </span>
              </Button>
            </div>

            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-r from-purple-500 via-magenta-500 to-rose-500 shadow-xl"
              >
                <ShoppingCart className="w-7 h-7 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-transparent bg-gradient-to-r from-purple-600 via-magenta-600 to-rose-600 bg-clip-text">
                  Giỏ hàng của bạn
                </h1>
                <p className="text-purple-700/80 dark:text-purple-300/80 flex items-center space-x-2 text-lg">
                  <Sparkles className="w-5 h-5" />
                  <span>
                    {totalItems} sản phẩm • {formatPrice(totalPrice)}
                  </span>
                  {appliedDiscount && (
                    <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white ml-2">
                      <Save className="w-3 h-3 mr-1" />-
                      {formatPrice(discountAmount)}
                    </Badge>
                  )}
                </p>
              </div>
            </div>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div
              className="space-y-6 lg:col-span-2"
              id="cart-items"
              data-animate
            >
              {/* Cart Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-800 ${
                  isVisible["cart-items"]
                    ? "animate-in slide-in-from-bottom"
                    : "opacity-0"
                }`}
              >
                <div className="flex flex-wrap items-center gap-3">
                  <Badge className="text-purple-800 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300 border-purple-300 dark:border-purple-700 px-4 py-2">
                    <Package className="w-4 h-4 mr-2" />
                    {totalItems} sản phẩm
                  </Badge>
                  <Badge className="text-emerald-800 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 px-4 py-2">
                    <Shield className="w-4 h-4 mr-2" />
                    Bảo mật 100%
                  </Badge>
                  {appliedDiscount && (
                    <Badge className="text-rose-800 bg-rose-100 dark:bg-rose-900/30 dark:text-rose-300 border-rose-300 dark:border-rose-700 px-4 py-2">
                      <Gift className="w-4 h-4 mr-2" />
                      Mã giảm giá
                    </Badge>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearCart}
                  className="text-red-500 transition-colors hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Xóa tất cả
                </Button>
              </motion.div>

              {/* Cart Items List */}
              <div className="space-y-4">
                <AnimatePresence>
                  {items.map((item, index) => (
                    <motion.div
                      key={item.product.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20, scale: 0.8 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.01 }}
                      className={`transition-all duration-500 ${
                        isVisible["cart-items"]
                          ? "animate-in slide-in-from-left"
                          : "opacity-0"
                      }`}
                      style={{ animationDelay: `${index * 150}ms` }}
                    >
                      <Card className="transition-all duration-300 border-0 shadow-lg bg-gradient-to-r from-white/95 to-purple-50/80 dark:from-slate-800/95 dark:to-purple-900/20 hover:shadow-xl rounded-3xl backdrop-blur-sm">
                        <CardContent className="p-6">
                          <div className="flex gap-6">
                            {/* Product Image */}
                            <motion.div
                              className="relative flex-shrink-0"
                              whileHover={{ scale: 1.05 }}
                            >
                              <img
                                src={item.product.image}
                                alt={item.product.title}
                                className="object-cover w-24 h-24 lg:w-28 lg:h-28 rounded-2xl shadow-md"
                              />
                              <div className="absolute flex items-center justify-center w-6 h-6 rounded-full -top-2 -right-2 bg-gradient-to-r from-emerald-400 to-teal-500 shadow-lg">
                                <CheckCircle className="w-4 h-4 text-white" />
                              </div>
                            </motion.div>

                            {/* Product Details */}
                            <div className="flex-1 space-y-3">
                              <div className="flex items-start justify-between">
                                <div className="space-y-2 flex-1">
                                  <h3 className="text-lg lg:text-xl font-semibold transition-colors line-clamp-2 hover:text-purple-700 dark:text-gray-100 dark:hover:text-purple-300">
                                    <Link
                                      to={`/product/${item.product.id}`}
                                      className="hover:underline"
                                    >
                                      {item.product.title}
                                    </Link>
                                  </h3>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <Badge
                                      variant="outline"
                                      className={`text-xs ${
                                        item.product.category === "template"
                                          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700"
                                          : "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700"
                                      }`}
                                    >
                                      {item.product.category === "template" ? (
                                        <Code className="w-3 h-3 mr-1" />
                                      ) : (
                                        <Coffee className="w-3 h-3 mr-1" />
                                      )}
                                      {item.product.category === "template"
                                        ? "Template"
                                        : "E-book"}
                                    </Badge>
                                    {item.product.isFeatured && (
                                      <Badge className="text-amber-800 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-300 border-amber-300 dark:border-amber-700">
                                        <Crown className="w-3 h-3 mr-1" />
                                        Nổi bật
                                      </Badge>
                                    )}
                                  </div>
                                </div>

                                <motion.div
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleRemoveItem(
                                        item.product.id,
                                        item.product.title,
                                      )
                                    }
                                    className="p-2 text-red-500 transition-colors hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </motion.div>
                              </div>

                              {/* Quantity and Price */}
                              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex items-center space-x-3">
                                  <span className="text-sm text-purple-700/80 dark:text-purple-300/80 font-medium">
                                    Số lượng:
                                  </span>
                                  <div className="flex items-center space-x-1 border border-purple-200 dark:border-purple-700 rounded-2xl bg-white/80 dark:bg-slate-800/80 shadow-sm">
                                    <motion.div whileTap={{ scale: 0.9 }}>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          handleUpdateQuantity(
                                            item.product.id,
                                            item.quantity - 1,
                                            item.product.title,
                                          )
                                        }
                                        disabled={item.quantity <= 1}
                                        className="w-8 h-8 p-0 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl"
                                      >
                                        <Minus className="w-3 h-3" />
                                      </Button>
                                    </motion.div>
                                    <span className="px-3 py-1 text-sm font-semibold min-w-[2.5rem] text-center dark:text-gray-200">
                                      {item.quantity}
                                    </span>
                                    <motion.div whileTap={{ scale: 0.9 }}>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          handleUpdateQuantity(
                                            item.product.id,
                                            item.quantity + 1,
                                            item.product.title,
                                          )
                                        }
                                        className="w-8 h-8 p-0 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-xl"
                                      >
                                        <Plus className="w-3 h-3" />
                                      </Button>
                                    </motion.div>
                                  </div>
                                </div>

                                <div className="space-y-1 text-right">
                                  <div className="text-lg lg:text-xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-magenta-600 bg-clip-text">
                                    {formatPrice(
                                      item.product.price * item.quantity,
                                    )}
                                  </div>
                                  {item.product.originalPrice && (
                                    <div className="text-sm line-through text-gray-500 dark:text-gray-400">
                                      {formatPrice(
                                        item.product.originalPrice *
                                          item.quantity,
                                      )}
                                    </div>
                                  )}
                                  {item.quantity > 1 && (
                                    <div className="text-xs text-purple-600/70 dark:text-purple-400/70">
                                      {formatPrice(item.product.price)} ×{" "}
                                      {item.quantity}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Product Features */}
                              <div className="flex flex-wrap items-center gap-4 text-xs text-purple-600/70 dark:text-purple-400/70">
                                <div className="flex items-center space-x-1">
                                  <Shield className="w-3 h-3" />
                                  <span>Bảo hành trọn đời</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Zap className="w-3 h-3" />
                                  <span>Tải ngay lập tức</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Award className="w-3 h-3" />
                                  <span>Chất lượng cao</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* ✅ REDESIGNED ENHANCED DISCOUNT SECTION */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="border-0 shadow-xl bg-gradient-to-br from-white/95 via-purple-50/80 to-magenta-50/80 dark:from-slate-800/95 dark:via-purple-900/20 dark:to-magenta-900/20 backdrop-blur-xl rounded-3xl overflow-hidden">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center space-x-3">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-magenta-500 to-rose-600 shadow-lg"
                      >
                        <Gift className="w-6 h-6 text-white" />
                      </motion.div>
                      <div>
                        <span className="text-xl lg:text-2xl text-transparent bg-gradient-to-r from-magenta-600 to-rose-600 bg-clip-text font-bold">
                          Mã giảm giá
                        </span>
                        <p className="text-sm text-purple-700/80 dark:text-purple-300/80 mt-1">
                          Áp dụng mã để tiết kiệm thêm
                        </p>
                      </div>
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Applied Discount Display */}
                    {appliedDiscount ? (
                      <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative p-6 border-2 border-emerald-300 dark:border-emerald-700 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-900/20 dark:via-teal-900/20 dark:to-cyan-900/20 overflow-hidden"
                      >
                        {/* Success pattern background */}
                        <div className="absolute inset-0 opacity-10">
                          <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-teal-400"></div>
                        </div>

                        <div className="relative flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{
                                delay: 0.2,
                                type: "spring",
                                stiffness: 200,
                              }}
                              className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg"
                            >
                              <CheckCircle className="w-6 h-6 text-white" />
                            </motion.div>
                            <div>
                              <div className="flex items-center space-x-3 mb-2">
                                <span className="font-bold text-lg text-emerald-800 dark:text-emerald-300 font-mono">
                                  {appliedDiscount.code}
                                </span>
                                <Badge className="text-emerald-800 bg-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 font-semibold">
                                  {formatDiscountValue(appliedDiscount)}
                                </Badge>
                              </div>
                              <p className="text-sm text-emerald-700 dark:text-emerald-400 mb-1 font-medium">
                                {appliedDiscount.name}
                              </p>
                              <div className="flex items-center space-x-2">
                                <Save className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                  Tiết kiệm: {formatPrice(discountAmount)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleRemoveCoupon}
                              className="text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-2xl p-2 transition-all duration-200"
                            >
                              <X className="w-5 h-5" />
                            </Button>
                          </motion.div>
                        </div>
                      </motion.div>
                    ) : (
                      /* Enhanced Discount Input Form */
                      <div className="space-y-6">
                        <div className="relative">
                          <div className="flex space-x-3">
                            <div className="relative flex-1">
                              <Input
                                placeholder="Nhập mã giảm giá (VD: SALE50)"
                                value={couponCode}
                                onChange={(e) => {
                                  setCouponCode(e.target.value.toUpperCase());
                                  if (discountError) setDiscountError("");
                                }}
                                onKeyPress={(e) => {
                                  if (e.key === "Enter") {
                                    handleApplyCoupon();
                                  }
                                }}
                                className={`h-12 pl-12 pr-4 text-sm font-mono uppercase bg-white/90 dark:bg-slate-800/90 border-2 rounded-2xl focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 ${
                                  discountError
                                    ? "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 focus:border-red-400"
                                    : "border-purple-200/50 dark:border-purple-700/50 focus:border-purple-400 dark:focus:border-purple-500"
                                }`}
                              />
                              <Tag className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-600 dark:text-purple-400" />
                            </div>
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button
                                onClick={handleApplyCoupon}
                                disabled={
                                  !couponCode.trim() || isApplyingDiscount
                                }
                                className="h-12 px-6 bg-gradient-to-r from-magenta-500 to-rose-600 hover:from-magenta-600 hover:to-rose-700 disabled:from-gray-400 disabled:to-gray-500 rounded-2xl shadow-lg font-semibold text-white border-0 transition-all duration-200"
                              >
                                {isApplyingDiscount ? (
                                  <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{
                                      duration: 1,
                                      repeat: Infinity,
                                      ease: "linear",
                                    }}
                                    className="w-4 h-4 border-2 border-white rounded-full border-t-transparent"
                                  />
                                ) : (
                                  <>
                                    <Zap className="w-4 h-4 mr-2" />
                                    Áp dụng
                                  </>
                                )}
                              </Button>
                            </motion.div>
                          </div>

                          {/* Error Message */}
                          <AnimatePresence>
                            {discountError && (
                              <motion.div
                                initial={{ opacity: 0, y: -10, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: "auto" }}
                                exit={{ opacity: 0, y: -10, height: 0 }}
                                className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
                              >
                                <p className="flex items-center space-x-2 text-sm text-red-600 dark:text-red-400">
                                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                                  <span>{discountError}</span>
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    )}

                    {/* Available Discounts Suggestions */}
                    {!appliedDiscount && availableDiscounts.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center space-x-2">
                          <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                          <span className="text-sm font-semibold text-purple-800 dark:text-purple-300">
                            Mã giảm giá đang có:
                          </span>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {availableDiscounts.map((discount, index) => {
                            const validation = validateDiscount(
                              discount,
                              totalPrice,
                            );
                            return (
                              <motion.div
                                key={discount.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{
                                  scale: validation.isValid ? 1.02 : 1,
                                }}
                                whileTap={{
                                  scale: validation.isValid ? 0.98 : 1,
                                }}
                              >
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleQuickApplyDiscount(discount)
                                  }
                                  disabled={!validation.isValid}
                                  className={`w-full h-auto p-4 rounded-2xl border-2 transition-all duration-200 ${
                                    validation.isValid
                                      ? "border-purple-200 dark:border-purple-700 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-gradient-to-r hover:from-purple-50 hover:to-magenta-50 dark:hover:from-purple-900/20 dark:hover:to-magenta-900/20"
                                      : "border-gray-200 dark:border-gray-700 opacity-50 cursor-not-allowed"
                                  }`}
                                >
                                  <div className="flex items-center justify-between w-full">
                                    <div className="text-left space-y-2">
                                      <div className="flex items-center space-x-2">
                                        <Badge
                                          variant="secondary"
                                          className={`text-xs font-semibold ${
                                            discount.type === "percent"
                                              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-700"
                                              : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700"
                                          }`}
                                        >
                                          {discount.type === "percent" ? (
                                            <Percent className="w-3 h-3 mr-1" />
                                          ) : (
                                            <DollarSign className="w-3 h-3 mr-1" />
                                          )}
                                          {formatDiscountValue(discount)}
                                        </Badge>
                                        <span className="font-mono text-sm font-bold dark:text-gray-200">
                                          {discount.code}
                                        </span>
                                      </div>
                                      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                        {discount.name}
                                      </p>
                                      {!validation.isValid && (
                                        <p className="text-xs text-red-500 dark:text-red-400 leading-relaxed">
                                          {validation.reason}
                                        </p>
                                      )}
                                    </div>
                                    {validation.isValid && (
                                      <div className="flex items-center space-x-1 text-purple-600 dark:text-purple-400">
                                        <TrendingUp className="w-4 h-4" />
                                      </div>
                                    )}
                                  </div>
                                </Button>
                              </motion.div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}

                    {/* Enhanced Discount Info */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="p-4 rounded-2xl bg-gradient-to-r from-purple-100/60 to-magenta-100/60 dark:from-purple-900/20 dark:to-magenta-900/20 border border-purple-200/50 dark:border-purple-700/50"
                    >
                      <div className="flex items-center space-x-2 mb-3">
                        <Info className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <span className="text-sm font-semibold text-purple-800 dark:text-purple-300">
                          Thông tin mã giảm giá:
                        </span>
                      </div>
                      <div className="text-xs text-purple-700/80 dark:text-purple-400/80 space-y-1.5 leading-relaxed">
                        <div className="flex items-start space-x-2">
                          <div className="w-1 h-1 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p>Mỗi đơn hàng chỉ áp dụng được 1 mã giảm giá</p>
                        </div>
                        <div className="flex items-start space-x-2">
                          <div className="w-1 h-1 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p>Mã giảm giá không áp dụng cho phí vận chuyển</p>
                        </div>
                        <div className="flex items-start space-x-2">
                          <div className="w-1 h-1 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                          <p>Một số mã có điều kiện đơn hàng tối thiểu</p>
                        </div>
                      </div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Enhanced Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="sticky border-0 shadow-2xl top-4 bg-gradient-to-br from-white/95 via-rose-50/80 to-pink-50/80 dark:from-slate-800/95 dark:via-rose-900/20 dark:to-pink-900/20 backdrop-blur-xl rounded-3xl">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 shadow-lg"
                      >
                        <CreditCard className="w-6 h-6 text-white" />
                      </motion.div>
                      <div>
                        <span className="text-xl lg:text-2xl text-transparent bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text font-bold">
                          Tóm tắt đơn hàng
                        </span>
                        <p className="text-sm text-rose-700/80 dark:text-rose-300/80 mt-1">
                          Chi tiết thanh toán
                        </p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Order Details */}
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-rose-800 dark:text-rose-300 font-medium">
                          Tạm tính ({totalItems} sản phẩm)
                        </span>
                        <span className="font-semibold dark:text-gray-200">
                          {formatPrice(totalPrice)}
                        </span>
                      </div>

                      {/* Enhanced Discount Display */}
                      {appliedDiscount && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="space-y-2"
                        >
                          <div className="flex justify-between text-sm items-center">
                            <div className="flex items-center space-x-2">
                              <Gift className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                                Giảm giá ({appliedDiscount.code})
                              </span>
                            </div>
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">
                              -{formatPrice(discountAmount)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                            <span className="text-emerald-700 dark:text-emerald-400">
                              {appliedDiscount.name}
                            </span>
                            <Badge className="text-emerald-800 bg-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300">
                              {formatDiscountValue(appliedDiscount)}
                            </Badge>
                          </div>
                        </motion.div>
                      )}

                      <div className="flex justify-between text-sm">
                        <span className="text-rose-800 dark:text-rose-300 font-medium">
                          Phí xử lý
                        </span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                          Miễn phí
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-rose-800 dark:text-rose-300 font-medium">
                          Thuế VAT
                        </span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                          Đã bao gồm
                        </span>
                      </div>
                    </div>

                    <Separator className="bg-gradient-to-r from-transparent via-rose-300 dark:via-rose-700 to-transparent" />

                    {/* Total */}
                    <div className="space-y-4">
                      <div className="flex justify-between text-xl lg:text-2xl font-bold">
                        <span className="text-rose-900 dark:text-rose-100">
                          Tổng cộng
                        </span>
                        <div className="text-right">
                          <span className="text-transparent bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text">
                            {formatPrice(finalPrice)}
                          </span>
                          {appliedDiscount && (
                            <div className="text-sm text-emerald-600 dark:text-emerald-400 font-normal">
                              Tiết kiệm: {formatPrice(discountAmount)}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Savings highlight */}
                      {appliedDiscount && (
                        <motion.div
                          initial={{ scale: 0.9 }}
                          animate={{ scale: 1 }}
                          className="p-4 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-800"
                        >
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            <span className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                              Bạn đã tiết kiệm được{" "}
                              {formatPrice(discountAmount)}!
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* Benefits */}
                    <div className="p-4 space-y-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
                      <h4 className="flex items-center space-x-2 text-sm font-semibold text-indigo-900 dark:text-indigo-300">
                        <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        <span>Quyền lợi của bạn</span>
                      </h4>
                      <div className="space-y-3 text-sm text-indigo-700 dark:text-indigo-400">
                        {[
                          { icon: CheckCircle, text: "Tải xuống ngay lập tức" },
                          { icon: Shield, text: "Bảo hành trọn đời" },
                          { icon: Clock, text: "Hỗ trợ 24/7" },
                          { icon: Rocket, text: "Cập nhật miễn phí" },
                        ].map((benefit, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <benefit.icon className="w-4 h-4 text-emerald-500" />
                            <span>{benefit.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-4">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          className="w-full h-14 transition-all duration-300 shadow-xl bg-gradient-to-r from-purple-500 via-magenta-500 to-rose-600 hover:from-purple-600 hover:via-magenta-600 hover:to-rose-700 hover:shadow-2xl rounded-2xl text-lg font-bold text-white border-0"
                          onClick={() => navigate("/checkout")}
                        >
                          <CreditCard className="w-5 h-5 mr-3" />
                          Tiến hành thanh toán
                          <ArrowRight className="w-5 h-5 ml-3" />
                        </Button>
                      </motion.div>

                      <Button
                        variant="outline"
                        className="w-full h-12 bg-white/80 dark:bg-slate-800/80 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-2xl border-purple-200 dark:border-purple-700"
                        asChild
                      >
                        <Link to="/templates">
                          <Package className="w-4 h-4 mr-2" />
                          Tiếp tục mua sắm
                        </Link>
                      </Button>
                    </div>

                    {/* Security Notice */}
                    <div className="space-y-2 text-xs text-center text-rose-700/70 dark:text-rose-400/70">
                      <div className="flex items-center justify-center space-x-2">
                        <Shield className="w-4 h-4 text-emerald-500" />
                        <span>Thanh toán an toàn 100%</span>
                      </div>
                      <p>
                        * Sản phẩm số sẽ được gửi qua email ngay sau khi thanh
                        toán thành công
                      </p>
                    </div>

                    {/* Delivery Info */}
                    <div className="flex items-center justify-center space-x-4 text-xs text-rose-700/70 dark:text-rose-400/70">
                      <div className="flex items-center space-x-1">
                        <Truck className="w-4 h-4 text-indigo-500" />
                        <span>Giao hàng tức thì</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4 text-emerald-500" />
                        <span>24/7 Support</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
