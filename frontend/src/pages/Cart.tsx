import { useState, useEffect } from "react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/products";
import { supabase } from "@/lib/supabase";
import { getCartItems } from "@/lib/cart";
import { motion, AnimatePresence } from "framer-motion";
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
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();
  const discountAmount = (totalPrice * discount) / 100;
  const finalPrice = totalPrice - discountAmount;

  useEffect(() => {
    const fetchCart = async () => {
      setIsLoading(true);
      try {
        const session = await supabase.auth.getSession();
        const userId = session.data.session?.user.id;
        if (!userId) return;

        const items = await getCartItems(userId);
        setCartItems(items);
      } catch (error) {
        console.error("Error fetching cart:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();

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
    toast({
      title: "🧹 Đã xóa tất cả",
      description: "Giỏ hàng đã được làm trống.",
      variant: "destructive",
    });
  };

  const handleApplyCoupon = () => {
    const validCoupons = {
      SAVE10: 10,
      SAVE20: 20,
      NEWUSER: 15,
      TEMPLATE50: 50,
    };

    if (validCoupons[couponCode.toUpperCase()]) {
      setDiscount(validCoupons[couponCode.toUpperCase()]);
      setAppliedCoupon(couponCode.toUpperCase());
      setCouponCode("");
      toast({
        title: "🎉 Mã giảm giá đã áp dụng!",
        description: `Bạn được giảm ${validCoupons[couponCode.toUpperCase()]}% tổng đơn hàng.`,
      });
    } else {
      toast({
        title: "❌ Mã giảm giá không hợp lệ",
        description: "Vui lòng kiểm tra lại mã giảm giá.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveCoupon = () => {
    setDiscount(0);
    setAppliedCoupon("");
    toast({
      title: "🗑️ Đã xóa mã giảm giá",
      description: "Mã giảm giá đã được gỡ bỏ.",
    });
  };

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
        {/* Floating Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 animate-float">
            <ShoppingCart className="w-8 h-8 text-blue-500 opacity-20" />
          </div>
          <div className="absolute top-1/3 right-1/4 animate-float-delay-1">
            <Package className="w-6 h-6 text-purple-500 opacity-20" />
          </div>
          <div className="absolute bottom-1/4 left-1/3 animate-float-delay-2">
            <Gift className="text-orange-500 w-7 h-7 opacity-20" />
          </div>
        </div>

        <div className="container relative z-10 px-4 py-8 mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto"
          >
            <Card className="py-12 text-center border-0 shadow-2xl bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900">
              <CardContent>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                </motion.div>
                <h2 className="mb-2 text-xl font-semibold">Giỏ hàng trống</h2>
                <p className="mb-6 text-muted-foreground">
                  Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá những
                  sản phẩm tuyệt vời của chúng tôi!
                </p>
                <div className="space-y-3">
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    <Link to="/templates">
                      <Package className="w-4 h-4 mr-2" />
                      Xem Templates
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full">
                    <Link to="/ebooks">
                      <Coffee className="w-4 h-4 mr-2" />
                      Xem E-books
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
              Tiếp tục mua sắm
            </Button>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                Giỏ hàng của bạn
              </h1>
              <p className="text-sm text-muted-foreground">
                {totalItems} sản phẩm
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="space-y-6 lg:col-span-2" id="cart-items" data-animate>
            {/* Cart Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-center justify-between transition-all duration-800 ${
                isVisible["cart-items"]
                  ? "animate-in slide-in-from-bottom"
                  : "opacity-0"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Badge
                  variant="secondary"
                  className="text-blue-800 bg-blue-100"
                >
                  <Package className="w-3 h-3 mr-1" />
                  {totalItems} sản phẩm
                </Badge>
                <Badge
                  variant="secondary"
                  className="text-green-800 bg-green-100"
                >
                  <Shield className="w-3 h-3 mr-1" />
                  Bảo mật 100%
                </Badge>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearCart}
                className="text-red-500 transition-colors hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 className="w-4 h-4 mr-1" />
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
                    whileHover={{ scale: 1.02 }}
                    className={`transition-all duration-500 ${
                      isVisible["cart-items"]
                        ? "animate-in slide-in-from-left"
                        : "opacity-0"
                    }`}
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <Card className="transition-all duration-300 border-0 shadow-lg bg-gradient-to-r from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 hover:shadow-xl">
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
                              className="object-cover w-24 h-24 rounded-lg shadow-md"
                            />
                            <div className="absolute flex items-center justify-center w-6 h-6 rounded-full -top-2 -right-2 bg-gradient-to-r from-green-400 to-blue-500">
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                          </motion.div>

                          {/* Product Details */}
                          <div className="flex-1 space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2">
                                <h3 className="text-lg font-semibold transition-colors line-clamp-2 hover:text-primary">
                                  <Link
                                    to={`/product/${item.product.id}`}
                                    className="hover:underline"
                                  >
                                    {item.product.title}
                                  </Link>
                                </h3>
                                <div className="flex items-center space-x-2">
                                  <Badge
                                    variant="outline"
                                    className={`text-xs ${
                                      item.product.category === "template"
                                        ? "bg-blue-50 text-blue-700 border-blue-200"
                                        : "bg-green-50 text-green-700 border-green-200"
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
                                    <Badge
                                      variant="secondary"
                                      className="text-yellow-800 bg-yellow-100"
                                    >
                                      <Star className="w-3 h-3 mr-1" />
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
                                  className="p-2 text-red-500 transition-colors hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </motion.div>
                            </div>

                            {/* Quantity and Price */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <span className="text-sm text-muted-foreground">
                                  Số lượng:
                                </span>
                                <div className="flex items-center space-x-1 border rounded-lg bg-background">
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
                                      className="w-8 h-8 p-0 hover:bg-red-50 dark:hover:bg-red-900/20"
                                    >
                                      <Minus className="w-3 h-3" />
                                    </Button>
                                  </motion.div>
                                  <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
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
                                      className="w-8 h-8 p-0 hover:bg-green-50 dark:hover:bg-green-900/20"
                                    >
                                      <Plus className="w-3 h-3" />
                                    </Button>
                                  </motion.div>
                                </div>
                              </div>

                              <div className="space-y-1 text-right">
                                <div className="text-lg font-semibold text-primary">
                                  {formatPrice(
                                    item.product.price * item.quantity,
                                  )}
                                </div>
                                {item.product.originalPrice && (
                                  <div className="text-sm line-through text-muted-foreground">
                                    {formatPrice(
                                      item.product.originalPrice *
                                        item.quantity,
                                    )}
                                  </div>
                                )}
                                {item.quantity > 1 && (
                                  <div className="text-xs text-muted-foreground">
                                    {formatPrice(item.product.price)} ×{" "}
                                    {item.quantity}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Product Features */}
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
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

            {/* Coupon Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-0 shadow-lg bg-gradient-to-r from-white to-orange-50 dark:from-slate-800 dark:to-orange-900/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Gift className="w-5 h-5 text-orange-600" />
                    <span>Mã giảm giá</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-3 border border-green-200 rounded-lg bg-green-50 dark:bg-green-900/20">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-medium">
                          Mã {appliedCoupon} đã áp dụng
                        </span>
                        <Badge className="text-green-800 bg-green-100">
                          -{discount}%
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveCoupon}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Nhập mã giảm giá"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        onClick={handleApplyCoupon}
                        disabled={!couponCode.trim()}
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                      >
                        Áp dụng
                      </Button>
                    </div>
                  )}

                  <div className="text-sm text-muted-foreground">
                    <p className="mb-2">💡 Mã giảm giá có sẵn:</p>
                    <div className="grid grid-cols-2 gap-2">
                      <Badge variant="outline" className="justify-center">
                        SAVE10 - 10%
                      </Badge>
                      <Badge variant="outline" className="justify-center">
                        SAVE20 - 20%
                      </Badge>
                      <Badge variant="outline" className="justify-center">
                        NEWUSER - 15%
                      </Badge>
                      <Badge variant="outline" className="justify-center">
                        TEMPLATE50 - 50%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="sticky border-0 shadow-2xl top-4 bg-gradient-to-br from-white to-purple-50 dark:from-slate-800 dark:to-purple-900">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="w-5 h-5 text-purple-600" />
                    <span>Tóm tắt đơn hàng</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Order Details */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Tạm tính ({totalItems} sản phẩm)</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Giảm giá ({appliedCoupon})</span>
                        <span>-{formatPrice(discountAmount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm">
                      <span>Phí xử lý</span>
                      <span className="text-green-600">Miễn phí</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Thuế VAT</span>
                      <span className="text-green-600">Đã bao gồm</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Total */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Tổng cộng</span>
                      <span className="text-primary">
                        {formatPrice(finalPrice)}
                      </span>
                    </div>
                    {discount > 0 && (
                      <div className="text-sm text-right text-green-600">
                        Tiết kiệm: {formatPrice(discountAmount)}
                      </div>
                    )}
                  </div>

                  {/* Benefits */}
                  <div className="p-4 space-y-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <h4 className="flex items-center space-x-2 text-sm font-medium">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      <span>Quyền lợi của bạn</span>
                    </h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Tải xuống ngay lập tức</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Bảo hành trọn đời</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Hỗ trợ 24/7</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Cập nhật miễn phí</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        className="w-full transition-all duration-300 shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl"
                        size="lg"
                        onClick={() => navigate("/checkout")}
                      >
                        <CreditCard className="w-5 h-5 mr-2" />
                        Tiến hành thanh toán
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </motion.div>

                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/templates">
                        <Package className="w-4 h-4 mr-2" />
                        Tiếp tục mua sắm
                      </Link>
                    </Button>
                  </div>

                  {/* Security Notice */}
                  <div className="space-y-2 text-xs text-center text-muted-foreground">
                    <div className="flex items-center justify-center space-x-2">
                      <Shield className="w-4 h-4 text-green-500" />
                      <span>Thanh toán an toàn 100%</span>
                    </div>
                    <p>
                      * Sản phẩm số sẽ được gửi qua email ngay sau khi thanh
                      toán thành công
                    </p>
                  </div>

                  {/* Delivery Info */}
                  <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Truck className="w-4 h-4 text-blue-500" />
                      <span>Giao hàng tức thì</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4 text-green-500" />
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
  );
};

export default Cart;
