import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import VietQRPayment from "@/components/VietQRPayment";
import PaymentLinkPayment from "@/components/PaymentLinkPayment";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { formatPrice } from "@/lib/products";
import {
  checkDiscountCode,
  validateDiscount,
  calculateDiscountAmount,
  formatDiscountValue,
} from "@/lib/discounts";
import { Discount } from "@/types";
import {
  createSuccessSound,
  createErrorSound,
  createProcessingSound,
  createCoinSound,
} from "@/utils/audioUtils";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  CreditCard,
  ShoppingCart,
  Lock,
  ArrowLeft,
  Check,
  QrCode,
  Globe,
  Shield,
  Truck,
  Clock,
  Star,
  Award,
  Sparkles,
  AlertCircle,
  CheckCircle,
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Coffee,
  Code,
  Palette,
  Package,
  Heart,
  Zap,
  ExternalLink,
  Copy,
  Gift,
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
import { supabase } from "@/lib/supabase";

// Enhanced schema with validation messages
const checkoutSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  phone: z.string().min(10, "Số điện thoại không hợp lệ"),
  address: z.string().min(5, "Địa chỉ phải có ít nhất 5 ký tự"),
  city: z.string().min(2, "Thành phố không được bỏ trống"),
  country: z.string().min(2, "Quốc gia không được bỏ trống"),
  paymentMethod: z.enum([
    "vietqr",
    "payment_link",
    "credit_card",
    "paypal",
    "bank_transfer",
  ]),
});

type CheckoutData = z.infer<typeof checkoutSchema>;

const Checkout: React.FC = () => {
  const { items, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<any>(null);
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
  const [step, setStep] = useState(1);
  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showFloatingNav, setShowFloatingNav] = useState(false);

  // Enhanced discount state
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<Discount | null>(null);
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  const [availableDiscounts, setAvailableDiscounts] = useState<Discount[]>([]);
  const [discountError, setDiscountError] = useState("");

  const { scrollYProgress } = useScroll();
  const headerY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  const totalPrice = getTotalPrice();

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

  // Generate dynamic titles
  const pageTitle =
    items.length === 0
      ? "🛒 Checkout - Giỏ hàng trống | Template Market"
      : `🛒 Thanh toán (${items.length} sản phẩm) | Template Market`;

  const pageDescription =
    items.length === 0
      ? "Không có sản phẩm nào để thanh toán. Khám phá template và ebook chất lượng cao."
      : `Thanh toán đơn hàng ${items.length} sản phẩm với tổng giá trị ${formatPrice(finalPrice)}. Thanh toán an toàn và bảo mật.`;

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
      try {
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
        console.error("Error fetching discounts:", error);
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

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: user?.email || "",
      name: user?.name || "",
      country: "Việt Nam",
      paymentMethod: "vietqr",
    },
  });

  const paymentMethod = watch("paymentMethod");

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

  // Enhanced payment methods
  const paymentMethods = [
    {
      id: "vietqr",
      name: "VietQR",
      description: "Quét mã QR bằng app ngân hàng (Miễn phí)",
      icon: QrCode,
      fee: "0%",
      popular: true,
      badge: "Khuyến nghị",
      color: colorSchemes.success.gradient,
      benefits: ["Miễn phí giao dịch", "Thanh toán tức thì", "Bảo mật cao"],
    },
    {
      id: "payment_link",
      name: "Link thanh toán",
      description: "Nhận link thanh toán qua email/SMS",
      icon: ExternalLink,
      fee: "0%",
      color: colorSchemes.primary.gradient,
      benefits: ["Thanh toán từ xa", "Chia sẻ dễ dàng", "Không cần app"],
    },
    {
      id: "credit_card",
      name: "Thẻ tín dụng/ghi nợ",
      description: "Visa, Mastercard, JCB",
      icon: CreditCard,
      fee: "2.9%",
      color: colorSchemes.secondary.gradient,
      benefits: ["Thanh toán quốc tế", "Bảo vệ người mua", "Hoàn tiền dễ dàng"],
    },
    {
      id: "paypal",
      name: "PayPal",
      description: "Thanh toán quốc tế với PayPal",
      icon: Globe,
      fee: "3.9%",
      color: colorSchemes.accent.gradient,
      benefits: ["Thanh toán toàn cầu", "Bảo vệ người mua", "Không cần thẻ"],
    },
    {
      id: "bank_transfer",
      name: "Chuyển khoản ngân hàng",
      description: "Chuyển khoản trực tiếp qua ngân hàng",
      icon: Building,
      fee: "0%",
      color: colorSchemes.primary.gradient,
      benefits: ["Miễn phí", "Bảo mật cao", "Không giới hạn số tiền"],
    },
  ];

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
                  {Math.round(scrollProgress)}% hoàn thành
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
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={pageDescription} />
          <meta
            name="keywords"
            content="checkout, thanh toán, giỏ hàng trống, template market"
          />
          <link rel="canonical" href="https://templatemarket.vn/checkout" />
        </Helmet>

        <ReadingProgress />
        <FloatingNav />

        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-magenta-50 to-rose-100 dark:from-slate-900 dark:via-purple-900/20 dark:to-magenta-900/30">
          {/* Enhanced Floating Elements */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            {[ShoppingCart, Package, CreditCard, Gift, Crown].map((Icon, i) => (
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
                    Không có sản phẩm nào để thanh toán
                  </p>
                  <div className="space-y-4">
                    <Button
                      asChild
                      className="w-full bg-gradient-to-r from-purple-500 via-magenta-500 to-rose-500 hover:from-purple-600 hover:via-magenta-600 hover:to-rose-600 rounded-2xl text-white border-0 h-12 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <a href="/templates">
                        <Code className="w-5 h-5 mr-2" />
                        Xem Templates
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      asChild
                      className="w-full bg-white/80 hover:bg-purple-50 border-purple-200 rounded-2xl h-12"
                    >
                      <a href="/ebooks">
                        <Coffee className="w-5 h-5 mr-2" />
                        Xem E-books
                      </a>
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

  const onSubmit = async (data: CheckoutData) => {
    if (!user?.id) {
      toast({
        title: "⚠️ Vui lòng đăng nhập",
        description: "Bạn cần đăng nhập để tiếp tục thanh toán.",
        variant: "destructive",
      });
      navigate("/auth/login");
      return;
    }

    setIsProcessing(true);

    try {
      // Create order with discount information
      const orderData = {
        user_id: user.id,
        full_name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        country: data.country,
        payment_method: data.paymentMethod,
        total_price: finalPrice,
        original_price: totalPrice,
        discount_id: appliedDiscount?.id || null,
        discount_code: appliedDiscount?.code || null,
        discount_amount: discountAmount,
        status: "pending",
        payment_status: "pending",
      };

      const { data: order, error } = await supabase
        .from("orders")
        .insert(orderData)
        .select()
        .single();

      if (error) throw error;

      // Insert order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      }));

      await supabase.from("order_items").insert(orderItems);

      // Record discount usage if discount was applied
      if (appliedDiscount) {
        await supabase.from("discount_usage").insert({
          discount_id: appliedDiscount.id,
          user_id: user.id,
          order_id: order.id,
          discount_amount: discountAmount,
          original_amount: totalPrice,
          used_at: new Date().toISOString(),
        });

        // Update discount usage count
        await supabase
          .from("discounts")
          .update({
            used_count: appliedDiscount.used_count + 1,
          })
          .eq("id", appliedDiscount.id);
      }

      setCurrentOrder(order);
      setShowPayment(true);
      setStep(2);

      toast({
        title: "✅ Đơn hàng đã tạo thành công!",
        description: appliedDiscount
          ? `Tiết kiệm ${formatPrice(discountAmount)} với mã ${appliedDiscount.code}!`
          : "Vui lòng hoàn tất thanh toán để xác nhận đơn hàng.",
      });
    } catch (error: any) {
      toast({
        title: "❌ Lỗi tạo đơn hàng",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = () => {
    createCoinSound();
    setTimeout(() => createSuccessSound(), 200);
    clearCart();
    setAppliedDiscount(null);
    toast({
      title: "🎉 Thanh toán thành công!",
      description:
        "Đơn hàng của bạn đã được ghi nhận. Kiểm tra email để tải sản phẩm.",
    });
    navigate("/profile?tab=orders");
  };

  // Payment display
  if (showPayment && currentOrder) {
    return (
      <>
        <Helmet>
          <title>
            🔒 Thanh toán đơn hàng #{currentOrder.id?.slice(0, 8)} | Template
            Market
          </title>
          <meta
            name="description"
            content={`Hoàn tất thanh toán đơn hàng với tổng giá trị ${formatPrice(finalPrice)}. An toàn và bảo mật.`}
          />
        </Helmet>

        <ReadingProgress />
        <FloatingNav />

        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-magenta-50 to-rose-100 dark:from-slate-900 dark:via-purple-900/20 dark:to-magenta-900/30">
          {/* Enhanced floating elements */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            {[QrCode, CreditCard, Shield, Crown, Gem, Sparkles].map(
              (Icon, i) => (
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
              ),
            )}
          </div>

          <div className="container relative z-10 px-4 py-8 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto"
            >
              {/* Progress Steps */}
              <div className="flex items-center justify-center mb-8 space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center justify-center w-8 h-8 bg-emerald-500 rounded-full">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-emerald-600">
                    Thông tin
                  </span>
                </div>
                <div className="w-12 h-0.5 bg-emerald-500"></div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-magenta-500">
                    <span className="text-sm font-bold text-white">2</span>
                  </div>
                  <span className="text-sm font-medium text-purple-600">
                    Thanh toán
                  </span>
                </div>
                <div className="w-12 h-0.5 bg-gray-300"></div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center justify-center w-8 h-8 bg-gray-300 rounded-full">
                    <span className="text-sm font-bold text-gray-500">3</span>
                  </div>
                  <span className="text-sm text-gray-500">Hoàn tất</span>
                </div>
              </div>

              <div className="flex items-center mb-6 space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPayment(false)}
                  className="group bg-white/70 hover:bg-white/90 rounded-2xl shadow-md border border-purple-200/50"
                >
                  <ArrowLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1 text-purple-600" />
                  <span className="font-semibold text-purple-800">
                    Quay lại thông tin đơn hàng
                  </span>
                </Button>
              </div>

              {/* Enhanced Order Summary with Discount */}
              <Card className="mb-6 border-0 shadow-xl bg-gradient-to-br from-white/95 via-purple-50/80 to-magenta-50/80 dark:from-slate-800/95 dark:via-purple-900/20 dark:to-magenta-900/20 backdrop-blur-xl rounded-3xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-500 to-magenta-600 shadow-lg"
                    >
                      <ShoppingCart className="w-6 h-6 text-white" />
                    </motion.div>
                    <div>
                      <span className="text-xl text-transparent bg-gradient-to-r from-purple-600 to-magenta-600 bg-clip-text font-bold">
                        Thông tin đơn hàng
                      </span>
                      <p className="text-sm text-purple-700/80 dark:text-purple-300/80 mt-1">
                        Đơn hàng #{currentOrder.id.slice(0, 8)}
                      </p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-purple-700 dark:text-purple-300">
                        Tổng sản phẩm:
                      </span>
                      <span className="font-medium ml-2 dark:text-gray-200">
                        {items.length}
                      </span>
                    </div>
                    <div>
                      <span className="text-purple-700 dark:text-purple-300">
                        Phương thức:
                      </span>
                      <span className="font-medium ml-2 dark:text-gray-200">
                        {
                          paymentMethods.find((m) => m.id === paymentMethod)
                            ?.name
                        }
                      </span>
                    </div>
                  </div>

                  <Separator className="bg-gradient-to-r from-transparent via-purple-300 dark:via-purple-700 to-transparent" />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-purple-800 dark:text-purple-300">
                        Tạm tính:
                      </span>
                      <span className="dark:text-gray-200">
                        {formatPrice(totalPrice)}
                      </span>
                    </div>

                    {appliedDiscount && (
                      <div className="flex justify-between text-sm items-center">
                        <div className="flex items-center space-x-2">
                          <Gift className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                            Giảm giá ({appliedDiscount.code})
                          </span>
                        </div>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          -{formatPrice(discountAmount)}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-purple-200 dark:border-purple-700">
                      <span className="text-purple-900 dark:text-purple-100">
                        Tổng thanh toán:
                      </span>
                      <span className="text-transparent bg-gradient-to-r from-purple-600 to-magenta-600 bg-clip-text">
                        {formatPrice(finalPrice)}
                      </span>
                    </div>

                    {appliedDiscount && (
                      <div className="text-center text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                        🎉 Bạn đã tiết kiệm {formatPrice(discountAmount)}!
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Payment Methods */}
              {paymentMethod === "vietqr" ? (
                <VietQRPayment
                  order={{
                    id: currentOrder.id,
                    total: currentOrder.total_price,
                    email: currentOrder.email,
                  }}
                  onPaymentSuccess={handlePaymentSuccess}
                />
              ) : paymentMethod === "payment_link" ? (
                <PaymentLinkPayment
                  order={{
                    id: currentOrder.id,
                    total: currentOrder.total_price,
                    email: currentOrder.email,
                  }}
                  onPaymentSuccess={handlePaymentSuccess}
                />
              ) : (
                /* Other payment methods */
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="border-0 shadow-2xl bg-gradient-to-br from-white/95 via-rose-50/80 to-pink-50/80 dark:from-slate-800/95 dark:via-rose-900/20 dark:to-pink-900/20 backdrop-blur-xl rounded-3xl">
                    <CardHeader className="text-center">
                      <CardTitle className="flex items-center justify-center space-x-3">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 shadow-lg"
                        >
                          <CreditCard className="w-6 h-6 text-white" />
                        </motion.div>
                        <span className="text-xl text-transparent bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text font-bold">
                          Thanh toán với{" "}
                          {
                            paymentMethods.find((m) => m.id === paymentMethod)
                              ?.name
                          }
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="text-center">
                        <div className="mb-2 text-3xl font-bold text-transparent bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text">
                          {formatPrice(finalPrice)}
                        </div>
                        {appliedDiscount && (
                          <div className="text-sm text-emerald-600 dark:text-emerald-400 mb-2">
                            Tiết kiệm: {formatPrice(discountAmount)} với mã{" "}
                            {appliedDiscount.code}
                          </div>
                        )}
                        <p className="text-rose-700/80 dark:text-rose-300/80">
                          Đơn hàng #{currentOrder.id.slice(0, 8)}
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20">
                        <p className="text-sm text-rose-700 dark:text-rose-300 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          Bạn sẽ được chuyển đến trang thanh toán an toàn của{" "}
                          {
                            paymentMethods.find((m) => m.id === paymentMethod)
                              ?.name
                          }
                        </p>
                      </div>

                      <Button
                        className="w-full h-14 bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-600 hover:from-rose-600 hover:via-pink-600 hover:to-fuchsia-700 rounded-2xl text-lg font-semibold shadow-xl text-white border-0"
                        onClick={() => {
                          setTimeout(() => {
                            handlePaymentSuccess();
                          }, 2000);
                        }}
                      >
                        <Lock className="w-5 h-5 mr-3" />
                        Tiến hành thanh toán
                        <Sparkles className="w-5 h-5 ml-3" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta
          name="keywords"
          content="checkout, thanh toán, mã giảm giá, VietQR, template market"
        />
        <link rel="canonical" href="https://templatemarket.vn/checkout" />
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/cart")}
              className="group bg-white/70 hover:bg-white/90 rounded-2xl shadow-md border border-purple-200/50"
            >
              <ArrowLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1 text-purple-600" />
              <span className="font-semibold text-purple-800">
                Quay lại giỏ hàng
              </span>
            </Button>

            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-r from-purple-500 via-magenta-500 to-rose-500 shadow-xl"
              >
                <CreditCard className="w-7 h-7 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-transparent bg-gradient-to-r from-purple-600 via-magenta-600 to-rose-600 bg-clip-text">
                  Thanh toán
                </h1>
                <p className="text-purple-700/80 dark:text-purple-300/80 flex items-center space-x-2 text-lg">
                  <Sparkles className="w-5 h-5" />
                  <span>Bước cuối để hoàn tất đơn hàng</span>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Progress Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center mb-8 space-x-4"
          >
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-magenta-500">
                <span className="text-sm font-bold text-white">1</span>
              </div>
              <span className="text-sm font-medium text-purple-600">
                Thông tin
              </span>
            </div>
            <div className="w-12 h-0.5 bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 bg-gray-300 rounded-full">
                <span className="text-sm font-bold text-gray-500">2</span>
              </div>
              <span className="text-sm text-gray-500">Thanh toán</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 bg-gray-300 rounded-full">
                <span className="text-sm font-bold text-gray-500">3</span>
              </div>
              <span className="text-sm text-gray-500">Hoàn tất</span>
            </div>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Checkout Form */}
            <div className="lg:col-span-2" id="checkout-form" data-animate>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Customer Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className={`transition-all duration-800 ${
                    isVisible["checkout-form"]
                      ? "animate-in slide-in-from-bottom"
                      : "opacity-0"
                  }`}
                >
                  <Card className="border-0 shadow-lg bg-gradient-to-r from-white/95 via-purple-50/80 to-violet-50/80 dark:from-slate-800/95 dark:via-purple-900/20 dark:to-violet-900/20 backdrop-blur-xl rounded-3xl">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-3">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-r from-purple-500 to-violet-600 shadow-lg"
                        >
                          <User className="w-5 h-5 text-white" />
                        </motion.div>
                        <div>
                          <span className="text-xl text-transparent bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text font-bold">
                            Thông tin khách hàng
                          </span>
                          <p className="text-sm text-purple-700/80 dark:text-purple-300/80 mt-1">
                            Nhập thông tin để giao hàng
                          </p>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <motion.div
                          className="space-y-2"
                          whileFocus={{ scale: 1.02 }}
                        >
                          <Label
                            htmlFor="name"
                            className="flex items-center space-x-2 text-purple-700 dark:text-purple-300"
                          >
                            <User className="w-4 h-4" />
                            <span>Họ và tên *</span>
                          </Label>
                          <Input
                            id="name"
                            {...register("name")}
                            className={`h-12 transition-all duration-300 bg-white/80 dark:bg-slate-800/80 border-purple-200/50 dark:border-purple-700/50 rounded-2xl text-gray-800 dark:text-gray-200 ${
                              errors.name
                                ? "border-red-500 shake"
                                : "focus:ring-2 focus:ring-purple-500/20"
                            }`}
                            placeholder="Nguyễn Văn A"
                          />
                          {errors.name && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-center space-x-1 text-sm text-red-500"
                            >
                              <AlertCircle className="w-3 h-3" />
                              <span>{errors.name.message}</span>
                            </motion.p>
                          )}
                        </motion.div>

                        <motion.div
                          className="space-y-2"
                          whileFocus={{ scale: 1.02 }}
                        >
                          <Label
                            htmlFor="email"
                            className="flex items-center space-x-2 text-purple-700 dark:text-purple-300"
                          >
                            <Mail className="w-4 h-4" />
                            <span>Email *</span>
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            {...register("email")}
                            className={`h-12 transition-all duration-300 bg-white/80 dark:bg-slate-800/80 border-purple-200/50 dark:border-purple-700/50 rounded-2xl text-gray-800 dark:text-gray-200 ${
                              errors.email
                                ? "border-red-500 shake"
                                : "focus:ring-2 focus:ring-purple-500/20"
                            }`}
                            placeholder="example@email.com"
                          />
                          {errors.email && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-center space-x-1 text-sm text-red-500"
                            >
                              <AlertCircle className="w-3 h-3" />
                              <span>{errors.email.message}</span>
                            </motion.p>
                          )}
                        </motion.div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label
                            htmlFor="phone"
                            className="flex items-center space-x-2 text-purple-700 dark:text-purple-300"
                          >
                            <Phone className="w-4 h-4" />
                            <span>Số điện thoại *</span>
                          </Label>
                          <Input
                            id="phone"
                            {...register("phone")}
                            className={`h-12 transition-all duration-300 bg-white/80 dark:bg-slate-800/80 border-purple-200/50 dark:border-purple-700/50 rounded-2xl text-gray-800 dark:text-gray-200 ${
                              errors.phone
                                ? "border-red-500"
                                : "focus:ring-2 focus:ring-purple-500/20"
                            }`}
                            placeholder="+84 123 456 789"
                          />
                          {errors.phone && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-center space-x-1 text-sm text-red-500"
                            >
                              <AlertCircle className="w-3 h-3" />
                              <span>{errors.phone.message}</span>
                            </motion.p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="city"
                            className="flex items-center space-x-2 text-purple-700 dark:text-purple-300"
                          >
                            <MapPin className="w-4 h-4" />
                            <span>Thành phố *</span>
                          </Label>
                          <Input
                            id="city"
                            {...register("city")}
                            className={`h-12 transition-all duration-300 bg-white/80 dark:bg-slate-800/80 border-purple-200/50 dark:border-purple-700/50 rounded-2xl text-gray-800 dark:text-gray-200 ${
                              errors.city
                                ? "border-red-500"
                                : "focus:ring-2 focus:ring-purple-500/20"
                            }`}
                            placeholder="Hồ Chí Minh"
                          />
                          {errors.city && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-center space-x-1 text-sm text-red-500"
                            >
                              <AlertCircle className="w-3 h-3" />
                              <span>{errors.city.message}</span>
                            </motion.p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="address"
                          className="flex items-center space-x-2 text-purple-700 dark:text-purple-300"
                        >
                          <Building className="w-4 h-4" />
                          <span>Địa chỉ *</span>
                        </Label>
                        <Input
                          id="address"
                          {...register("address")}
                          className={`h-12 transition-all duration-300 bg-white/80 dark:bg-slate-800/80 border-purple-200/50 dark:border-purple-700/50 rounded-2xl text-gray-800 dark:text-gray-200 ${
                            errors.address
                              ? "border-red-500"
                              : "focus:ring-2 focus:ring-purple-500/20"
                          }`}
                          placeholder="123 Đường ABC, Quận 1"
                        />
                        {errors.address && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center space-x-1 text-sm text-red-500"
                          >
                            <AlertCircle className="w-3 h-3" />
                            <span>{errors.address.message}</span>
                          </motion.p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="country"
                          className="flex items-center space-x-2 text-purple-700 dark:text-purple-300"
                        >
                          <Globe className="w-4 h-4" />
                          <span>Quốc gia *</span>
                        </Label>
                        <Input
                          id="country"
                          {...register("country")}
                          className={`h-12 transition-all duration-300 bg-white/80 dark:bg-slate-800/80 border-purple-200/50 dark:border-purple-700/50 rounded-2xl text-gray-800 dark:text-gray-200 ${
                            errors.country
                              ? "border-red-500"
                              : "focus:ring-2 focus:ring-purple-500/20"
                          }`}
                          placeholder="Việt Nam"
                        />
                        {errors.country && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center space-x-1 text-sm text-red-500"
                          >
                            <AlertCircle className="w-3 h-3" />
                            <span>{errors.country.message}</span>
                          </motion.p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* ✅ ENHANCED DISCOUNT SECTION */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card className="border-0 shadow-xl bg-gradient-to-br from-white/95 via-magenta-50/80 to-rose-50/80 dark:from-slate-800/95 dark:via-magenta-900/20 dark:to-rose-900/20 backdrop-blur-xl rounded-3xl overflow-hidden">
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
                          <p className="text-sm text-magenta-700/80 dark:text-magenta-300/80 mt-1">
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
                                      e.preventDefault();
                                      handleApplyCoupon();
                                    }
                                  }}
                                  className={`h-12 pl-12 pr-4 text-sm font-mono uppercase bg-white/90 dark:bg-slate-800/90 border-2 rounded-2xl focus:ring-2 focus:ring-magenta-500/20 transition-all duration-200 text-gray-800 dark:text-gray-200 ${
                                    discountError
                                      ? "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 focus:border-red-400"
                                      : "border-magenta-200/50 dark:border-magenta-700/50 focus:border-magenta-400 dark:focus:border-magenta-500"
                                  }`}
                                />
                                <Tag className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-magenta-600 dark:text-magenta-400" />
                              </div>
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Button
                                  type="button"
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
                            <Sparkles className="w-5 h-5 text-magenta-600 dark:text-magenta-400" />
                            <span className="text-sm font-semibold text-magenta-800 dark:text-magenta-300">
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
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleQuickApplyDiscount(discount)
                                    }
                                    disabled={!validation.isValid}
                                    className={`w-full h-auto p-4 rounded-2xl border-2 transition-all duration-200 ${
                                      validation.isValid
                                        ? "border-magenta-200 dark:border-magenta-700 hover:border-magenta-300 dark:hover:border-magenta-600 hover:bg-gradient-to-r hover:from-magenta-50 hover:to-rose-50 dark:hover:from-magenta-900/20 dark:hover:to-rose-900/20"
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
                                        <div className="flex items-center space-x-1 text-magenta-600 dark:text-magenta-400">
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
                        className="p-4 rounded-2xl bg-gradient-to-r from-magenta-100/60 to-rose-100/60 dark:from-magenta-900/20 dark:to-rose-900/20 border border-magenta-200/50 dark:border-magenta-700/50"
                      >
                        <div className="flex items-center space-x-2 mb-3">
                          <Info className="w-4 h-4 text-magenta-600 dark:text-magenta-400" />
                          <span className="text-sm font-semibold text-magenta-800 dark:text-magenta-300">
                            Thông tin mã giảm giá:
                          </span>
                        </div>
                        <div className="text-xs text-magenta-700/80 dark:text-magenta-400/80 space-y-1.5 leading-relaxed">
                          <div className="flex items-start space-x-2">
                            <div className="w-1 h-1 bg-magenta-500 rounded-full mt-2 flex-shrink-0"></div>
                            <p>Mỗi đơn hàng chỉ áp dụng được 1 mã giảm giá</p>
                          </div>
                          <div className="flex items-start space-x-2">
                            <div className="w-1 h-1 bg-magenta-500 rounded-full mt-2 flex-shrink-0"></div>
                            <p>Mã giảm giá không áp dụng cho phí vận chuyển</p>
                          </div>
                          <div className="flex items-start space-x-2">
                            <div className="w-1 h-1 bg-magenta-500 rounded-full mt-2 flex-shrink-0"></div>
                            <p>Một số mã có điều kiện đơn hàng tối thiểu</p>
                          </div>
                        </div>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Payment Method */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Card className="border-0 shadow-lg bg-gradient-to-r from-white/95 via-rose-50/80 to-pink-50/80 dark:from-slate-800/95 dark:via-rose-900/20 dark:to-pink-900/20 backdrop-blur-xl rounded-3xl">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-3">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 shadow-lg"
                        >
                          <Lock className="w-5 h-5 text-white" />
                        </motion.div>
                        <div>
                          <span className="text-xl text-transparent bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text font-bold">
                            Phương thức thanh toán
                          </span>
                          <p className="text-sm text-rose-700/80 dark:text-rose-300/80 mt-1">
                            Chọn cách thanh toán phù hợp
                          </p>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <RadioGroup
                        value={paymentMethod}
                        onValueChange={(value) =>
                          setValue("paymentMethod", value as any)
                        }
                        className="space-y-4"
                      >
                        {paymentMethods.map((method, index) => (
                          <motion.div
                            key={method.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                            whileHover={{ scale: 1.01 }}
                            className={`relative flex items-center p-4 space-x-3 border-2 rounded-2xl transition-all duration-300 cursor-pointer ${
                              paymentMethod === method.id
                                ? "border-rose-400 dark:border-rose-600 bg-rose-50/50 dark:bg-rose-900/20 shadow-lg"
                                : "border-gray-200 dark:border-gray-700 hover:border-rose-300 dark:hover:border-rose-600 hover:shadow-md"
                            }`}
                          >
                            <RadioGroupItem value={method.id} id={method.id} />
                            <div className="flex-1">
                              <div className="flex items-center mb-2 space-x-2">
                                <div
                                  className={`w-8 h-8 rounded-xl bg-gradient-to-r ${method.color} flex items-center justify-center`}
                                >
                                  <method.icon className="w-4 h-4 text-white" />
                                </div>
                                <Label
                                  htmlFor={method.id}
                                  className="font-medium cursor-pointer dark:text-gray-200"
                                >
                                  {method.name}
                                </Label>
                                {method.badge && (
                                  <Badge className="text-emerald-800 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300">
                                    <Star className="w-3 h-3 mr-1" />
                                    {method.badge}
                                  </Badge>
                                )}
                                <Badge variant="outline" className="text-xs">
                                  Phí: {method.fee}
                                </Badge>
                              </div>
                              <p className="mb-2 text-sm text-rose-700/80 dark:text-rose-300/80">
                                {method.description}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {method.benefits.map(
                                  (benefit, benefitIndex) => (
                                    <div
                                      key={benefitIndex}
                                      className="flex items-center space-x-1 text-xs text-rose-600/80 dark:text-rose-400/80"
                                    >
                                      <CheckCircle className="w-3 h-3 text-emerald-500" />
                                      <span>{benefit}</span>
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </RadioGroup>

                      {/* Payment Method Info */}
                      <AnimatePresence mode="wait">
                        {paymentMethod === "vietqr" && (
                          <motion.div
                            key="vietqr"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="p-4 mt-4 border border-emerald-200 dark:border-emerald-800 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20"
                          >
                            <div className="flex items-center mb-2 space-x-2 text-emerald-700 dark:text-emerald-300">
                              <QrCode className="w-4 h-4" />
                              <span className="text-sm font-medium">
                                Thanh toán VietQR - Miễn phí hoàn toàn
                              </span>
                            </div>
                            <p className="text-sm text-emerald-600 dark:text-emerald-400">
                              Quét mã QR bằng app ngân hàng để thanh toán nhanh
                              chóng và an toàn. Hỗ trợ tất cả ngân hàng tại Việt
                              Nam.
                            </p>
                          </motion.div>
                        )}

                        {paymentMethod === "credit_card" && (
                          <motion.div
                            key="credit_card"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="p-4 mt-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20"
                          >
                            <div className="flex items-center mb-2 space-x-2 text-blue-700 dark:text-blue-300">
                              <Shield className="w-4 h-4" />
                              <span className="text-sm font-medium">
                                Bảo mật SSL 256-bit
                              </span>
                            </div>
                            <p className="text-sm text-blue-600 dark:text-blue-400">
                              Thông tin thanh toán được bảo mật với mã hóa SSL
                              256-bit. Hỗ trợ Visa, Mastercard, JCB.
                            </p>
                          </motion.div>
                        )}

                        {paymentMethod === "paypal" && (
                          <motion.div
                            key="paypal"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="p-4 mt-4 border border-orange-200 dark:border-orange-800 rounded-2xl bg-orange-50 dark:bg-orange-900/20"
                          >
                            <div className="flex items-center mb-2 space-x-2 text-orange-700 dark:text-orange-300">
                              <Globe className="w-4 h-4" />
                              <span className="text-sm font-medium">
                                Thanh toán quốc tế
                              </span>
                            </div>
                            <p className="text-sm text-orange-600 dark:text-orange-400">
                              Hỗ trợ thanh toán quốc tế với PayPal. Bảo vệ người
                              mua 100%.
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    className="w-full h-14 transition-all duration-300 shadow-xl bg-gradient-to-r from-purple-500 via-magenta-500 to-rose-600 hover:from-purple-600 hover:via-magenta-600 hover:to-rose-700 hover:shadow-2xl rounded-2xl text-lg font-semibold text-white border-0"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-4 h-4 mr-2 border-2 border-white rounded-full border-t-transparent"
                        />
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5 mr-3" />
                        {paymentMethod === "vietqr"
                          ? "Tạo mã QR thanh toán"
                          : `Thanh toán ${formatPrice(finalPrice)}`}
                        {appliedDiscount && (
                          <Badge className="ml-3 bg-emerald-500 text-white border-0">
                            Tiết kiệm {formatPrice(discountAmount)}
                          </Badge>
                        )}
                        <Sparkles className="w-5 h-5 ml-3" />
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>
            </div>

            {/* Enhanced Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="sticky border-0 shadow-2xl top-4 bg-gradient-to-br from-white/95 via-indigo-50/80 to-violet-50/80 dark:from-slate-800/95 dark:via-indigo-900/20 dark:to-violet-900/20 backdrop-blur-xl rounded-3xl">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 shadow-lg"
                      >
                        <ShoppingCart className="w-5 h-5 text-white" />
                      </motion.div>
                      <div>
                        <span className="text-xl text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text font-bold">
                          Đơn hàng của bạn
                        </span>
                        <p className="text-sm text-indigo-700/80 dark:text-indigo-300/80 mt-1">
                          Chi tiết sản phẩm
                        </p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Order Items */}
                    <div className="space-y-3">
                      {items.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          className="flex items-start justify-between p-3 text-sm rounded-2xl bg-white/50 dark:bg-slate-700/50"
                        >
                          <div className="flex space-x-3">
                            <img
                              src={item.product.image}
                              alt={item.product.title}
                              className="object-cover w-12 h-12 rounded-xl"
                            />
                            <div className="flex-1">
                              <div className="mb-1 font-medium line-clamp-2 dark:text-gray-200">
                                {item.product.title}
                              </div>
                              <div className="flex items-center space-x-2 text-indigo-700/70 dark:text-indigo-400/70">
                                <span>Số lượng: {item.quantity}</span>
                                <Badge
                                  variant="outline"
                                  className="text-xs border-indigo-300 dark:border-indigo-700"
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
                              </div>
                            </div>
                          </div>
                          <div className="font-medium text-indigo-800 dark:text-indigo-300">
                            {formatPrice(item.product.price * item.quantity)}
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <Separator className="bg-gradient-to-r from-transparent via-indigo-300 dark:via-indigo-700 to-transparent" />

                    {/* Enhanced Price Breakdown with Discount */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-indigo-800 dark:text-indigo-300">
                          Tạm tính ({items.length} sản phẩm)
                        </span>
                        <span className="font-medium dark:text-gray-200">
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
                              <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                                Giảm giá ({appliedDiscount.code})
                              </span>
                            </div>
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                              -{formatPrice(discountAmount)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                            <span className="text-emerald-700 dark:text-emerald-400">
                              {appliedDiscount.name}
                            </span>
                            <Badge
                              variant="secondary"
                              className="text-emerald-800 bg-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300"
                            >
                              {formatDiscountValue(appliedDiscount)}
                            </Badge>
                          </div>
                        </motion.div>
                      )}

                      <div className="flex justify-between text-sm">
                        <span className="text-indigo-800 dark:text-indigo-300">
                          Phí xử lý
                        </span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                          Miễn phí
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-indigo-800 dark:text-indigo-300">
                          Thuế VAT
                        </span>
                        <span className="font-medium dark:text-gray-200">
                          Đã bao gồm
                        </span>
                      </div>
                      {paymentMethod === "vietqr" && (
                        <div className="flex justify-between text-emerald-600 dark:text-emerald-400 text-sm">
                          <span>Phí thanh toán</span>
                          <span className="font-medium">Miễn phí</span>
                        </div>
                      )}
                    </div>

                    <Separator className="bg-gradient-to-r from-transparent via-indigo-300 dark:via-indigo-700 to-transparent" />

                    {/* Enhanced Total */}
                    <div className="space-y-3">
                      <div className="flex justify-between text-xl font-bold">
                        <span className="text-indigo-900 dark:text-indigo-100">
                          Tổng cộng
                        </span>
                        <div className="text-right">
                          <span className="text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text">
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
                          className="p-3 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-800"
                        >
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            <span className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                              Bạn đã tiết kiệm được{" "}
                              {formatPrice(discountAmount)}!
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* Benefits */}
                    <div className="p-4 space-y-3 rounded-2xl bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20">
                      <h4 className="flex items-center space-x-2 text-sm font-medium text-cyan-900 dark:text-cyan-300">
                        <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                        <span>Quyền lợi của bạn</span>
                      </h4>
                      <div className="space-y-2 text-sm text-cyan-700 dark:text-cyan-400">
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
                        {paymentMethod === "vietqr" && (
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                            <span className="font-medium text-emerald-600 dark:text-emerald-400">
                              Không phí giao dịch
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Security Notice */}
                    <div className="space-y-2 text-xs text-center text-indigo-700/70 dark:text-indigo-400/70">
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
                    <div className="flex items-center justify-center space-x-4 text-xs text-indigo-700/70 dark:text-indigo-400/70">
                      <div className="flex items-center space-x-1">
                        <Truck className="w-4 h-4 text-blue-500" />
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

export default Checkout;
