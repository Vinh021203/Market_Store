import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { formatPrice } from "@/lib/products";
import {
  createSuccessSound,
  createErrorSound,
  createProcessingSound,
  createCoinSound,
} from "@/utils/audioUtils";
import { motion, AnimatePresence } from "framer-motion";
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
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

// Enhanced schema với validation messages
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

  const totalPrice = getTotalPrice();

  useEffect(() => {
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

  // Enhanced payment methods với animations
  const paymentMethods = [
    {
      id: "vietqr",
      name: "VietQR",
      description: "Quét mã QR bằng app ngân hàng (Miễn phí)",
      icon: QrCode,
      fee: "0%",
      popular: true,
      badge: "Khuyến nghị",
      color: "from-green-500 to-emerald-500",
      benefits: ["Miễn phí giao dịch", "Thanh toán tức thì", "Bảo mật cao"],
    },
    {
      id: "payment_link",
      name: "Link thanh toán",
      description: "Nhận link thanh toán qua email/SMS",
      icon: ExternalLink,
      fee: "0%",
      color: "from-indigo-500 to-blue-500",
      benefits: ["Thanh toán từ xa", "Chia sẻ dễ dàng", "Không cần app"],
    },
    {
      id: "credit_card",
      name: "Thẻ tín dụng/ghi nợ",
      description: "Visa, Mastercard, JCB",
      icon: CreditCard,
      fee: "2.9%",
      color: "from-blue-500 to-purple-500",
      benefits: ["Thanh toán quốc tế", "Bảo vệ người mua", "Hoàn tiền dễ dàng"],
    },
    {
      id: "paypal",
      name: "PayPal",
      description: "Thanh toán quốc tế với PayPal",
      icon: Globe,
      fee: "3.9%",
      color: "from-orange-500 to-yellow-500",
      benefits: ["Thanh toán toàn cầu", "Bảo vệ người mua", "Không cần thẻ"],
    },
    {
      id: "bank_transfer",
      name: "Chuyển khoản ngân hàng",
      description: "Chuyển khoản trực tiếp qua ngân hàng",
      icon: Building,
      fee: "0%",
      color: "from-purple-500 to-pink-500",
      benefits: ["Miễn phí", "Bảo mật cao", "Không giới hạn số tiền"],
    },
  ];

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
            <CreditCard className="text-orange-500 w-7 h-7 opacity-20" />
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
                  Không có sản phẩm nào để thanh toán
                </p>
                <div className="space-y-3">
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    <a href="/templates">
                      <Package className="w-4 h-4 mr-2" />
                      Xem Templates
                    </a>
                  </Button>
                  <Button variant="outline" asChild className="w-full">
                    <a href="/ebooks">
                      <Coffee className="w-4 h-4 mr-2" />
                      Xem E-books
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
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
      // Tạo order
      const orderData = {
        user_id: user.id,
        full_name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        country: data.country,
        payment_method: data.paymentMethod,
        total_price: totalPrice,
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

      // Hiển thị payment method
      setCurrentOrder(order);
      setShowPayment(true);
      setStep(2);

      toast({
        title: "✅ Đơn hàng đã tạo thành công!",
        description: "Vui lòng hoàn tất thanh toán để xác nhận đơn hàng.",
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
        {/* Floating Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 animate-float">
            <QrCode className="w-8 h-8 text-blue-500 opacity-20" />
          </div>
          <div className="absolute top-1/3 right-1/4 animate-float-delay-1">
            <CreditCard className="w-6 h-6 text-purple-500 opacity-20" />
          </div>
          <div className="absolute bottom-1/4 left-1/3 animate-float-delay-2">
            <Shield className="text-green-500 w-7 h-7 opacity-20" />
          </div>
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
                <div className="flex items-center justify-center w-8 h-8 bg-green-500 rounded-full">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-green-600">
                  Thông tin
                </span>
              </div>
              <div className="w-12 h-0.5 bg-green-500"></div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary">
                  <span className="text-sm font-bold text-white">2</span>
                </div>
                <span className="text-sm font-medium text-primary">
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
                className="group"
              >
                <ArrowLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
                Quay lại thông tin đơn hàng
              </Button>
            </div>

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
            ) : paymentMethod === "credit_card" ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-blue-900">
                  <CardHeader className="text-center">
                    <CardTitle className="flex items-center justify-center space-x-2">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                        <CreditCard className="w-5 h-5 text-white" />
                      </div>
                      <span>Thanh toán bằng thẻ tín dụng</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center">
                      <div className="mb-2 text-3xl font-bold text-primary">
                        {formatPrice(currentOrder.total_price)}
                      </div>
                      <p className="text-muted-foreground">
                        Đơn hàng #{currentOrder.id.slice(0, 8)}
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        <AlertCircle className="inline w-4 h-4 mr-2" />
                        Bạn sẽ được chuyển đến trang thanh toán an toàn của
                        Stripe
                      </p>
                    </div>

                    <Button
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      size="lg"
                      onClick={() => {
                        // TODO: Implement Stripe payment
                        toast({
                          title: "🚧 Đang phát triển",
                          description:
                            "Tính năng thanh toán thẻ đang được phát triển",
                        });
                      }}
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      Tiến hành thanh toán
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ) : paymentMethod === "bank_transfer" ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-green-50 dark:from-slate-800 dark:to-green-900">
                  <CardHeader className="text-center">
                    <CardTitle className="flex items-center justify-center space-x-2">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-600">
                        <Building className="w-5 h-5 text-white" />
                      </div>
                      <span>Chuyển khoản ngân hàng</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center">
                      <div className="mb-2 text-3xl font-bold text-primary">
                        {formatPrice(currentOrder.total_price)}
                      </div>
                      <p className="text-muted-foreground">
                        Đơn hàng #{currentOrder.id.slice(0, 8)}
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                      <p className="text-sm text-green-700 dark:text-green-300">
                        <AlertCircle className="inline w-4 h-4 mr-2" />
                        Chuyển khoản thủ công với thông tin bên dưới
                      </p>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Ngân hàng:
                        </span>
                        <span className="font-medium">MBBANK</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Số tài khoản:
                        </span>
                        <span className="font-mono">0971386588</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Chủ tài khoản:
                        </span>
                        <span className="font-medium">LUONG THE VINH</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Nội dung:</span>
                        <span className="font-mono">DH{currentOrder.id}</span>
                      </div>
                    </div>

                    <Button
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                      size="lg"
                      onClick={() => {
                        toast({
                          title: "📋 Thông tin đã sao chép",
                          description:
                            "Vui lòng chuyển khoản theo thông tin trên",
                        });
                      }}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Sao chép thông tin
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-blue-900">
                  <CardHeader className="text-center">
                    <CardTitle className="flex items-center justify-center space-x-2">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                        <CreditCard className="w-5 h-5 text-white" />
                      </div>
                      <span>
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
                      <div className="mb-2 text-3xl font-bold text-primary">
                        {formatPrice(currentOrder.total_price)}
                      </div>
                      <p className="text-muted-foreground">
                        Đơn hàng #{currentOrder.id.slice(0, 8)}
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        <AlertCircle className="inline w-4 h-4 mr-2" />
                        Bạn sẽ được chuyển đến trang thanh toán của{" "}
                        {
                          paymentMethods.find((m) => m.id === paymentMethod)
                            ?.name
                        }
                      </p>
                    </div>

                    <Button
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      size="lg"
                      onClick={() => {
                        // Simulate payment processing
                        setTimeout(() => {
                          handlePaymentSuccess();
                        }, 2000);
                      }}
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      Tiến hành thanh toán
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/cart")}
            className="group"
          >
            <ArrowLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
            Quay lại giỏ hàng
          </Button>

          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                Thanh toán
              </h1>
              <p className="text-sm text-muted-foreground">
                Bước cuối để hoàn tất đơn hàng
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
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary">
              <span className="text-sm font-bold text-white">1</span>
            </div>
            <span className="text-sm font-medium text-primary">Thông tin</span>
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
                <Card className="border-0 shadow-lg bg-gradient-to-r from-white to-blue-50 dark:from-slate-800 dark:to-blue-900">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="w-5 h-5 text-blue-600" />
                      <span>Thông tin khách hàng</span>
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
                          className="flex items-center space-x-2"
                        >
                          <User className="w-4 h-4" />
                          <span>Họ và tên *</span>
                        </Label>
                        <Input
                          id="name"
                          {...register("name")}
                          className={`transition-all duration-300 ${
                            errors.name
                              ? "border-red-500 shake"
                              : "focus:ring-2 focus:ring-primary/20"
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
                          className="flex items-center space-x-2"
                        >
                          <Mail className="w-4 h-4" />
                          <span>Email *</span>
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          {...register("email")}
                          className={`transition-all duration-300 ${
                            errors.email
                              ? "border-red-500 shake"
                              : "focus:ring-2 focus:ring-primary/20"
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
                          className="flex items-center space-x-2"
                        >
                          <Phone className="w-4 h-4" />
                          <span>Số điện thoại *</span>
                        </Label>
                        <Input
                          id="phone"
                          {...register("phone")}
                          className={`transition-all duration-300 ${
                            errors.phone
                              ? "border-red-500"
                              : "focus:ring-2 focus:ring-primary/20"
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
                          className="flex items-center space-x-2"
                        >
                          <MapPin className="w-4 h-4" />
                          <span>Thành phố *</span>
                        </Label>
                        <Input
                          id="city"
                          {...register("city")}
                          className={`transition-all duration-300 ${
                            errors.city
                              ? "border-red-500"
                              : "focus:ring-2 focus:ring-primary/20"
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
                        className="flex items-center space-x-2"
                      >
                        <Building className="w-4 h-4" />
                        <span>Địa chỉ *</span>
                      </Label>
                      <Input
                        id="address"
                        {...register("address")}
                        className={`transition-all duration-300 ${
                          errors.address
                            ? "border-red-500"
                            : "focus:ring-2 focus:ring-primary/20"
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
                        className="flex items-center space-x-2"
                      >
                        <Globe className="w-4 h-4" />
                        <span>Quốc gia *</span>
                      </Label>
                      <Input
                        id="country"
                        {...register("country")}
                        className={`transition-all duration-300 ${
                          errors.country
                            ? "border-red-500"
                            : "focus:ring-2 focus:ring-primary/20"
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

              {/* Payment Method */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="border-0 shadow-lg bg-gradient-to-r from-white to-purple-50 dark:from-slate-800 dark:to-purple-900">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Lock className="w-5 h-5 text-purple-600" />
                      <span>Phương thức thanh toán</span>
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
                          transition={{ delay: 0.4 + index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                          className={`relative flex items-center p-4 space-x-3 border rounded-lg transition-all duration-300 cursor-pointer ${
                            paymentMethod === method.id
                              ? "border-primary bg-primary/5 shadow-lg"
                              : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                          }`}
                        >
                          <RadioGroupItem value={method.id} id={method.id} />
                          <div className="flex-1">
                            <div className="flex items-center mb-2 space-x-2">
                              <div
                                className={`w-8 h-8 rounded-lg bg-gradient-to-r ${method.color} flex items-center justify-center`}
                              >
                                <method.icon className="w-4 h-4 text-white" />
                              </div>
                              <Label
                                htmlFor={method.id}
                                className="font-medium cursor-pointer"
                              >
                                {method.name}
                              </Label>
                              {method.badge && (
                                <Badge className="text-green-800 bg-green-100">
                                  <Star className="w-3 h-3 mr-1" />
                                  {method.badge}
                                </Badge>
                              )}
                              <Badge variant="outline" className="text-xs">
                                Phí: {method.fee}
                              </Badge>
                            </div>
                            <p className="mb-2 text-sm text-muted-foreground">
                              {method.description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {method.benefits.map((benefit, benefitIndex) => (
                                <div
                                  key={benefitIndex}
                                  className="flex items-center space-x-1 text-xs text-muted-foreground"
                                >
                                  <CheckCircle className="w-3 h-3 text-green-500" />
                                  <span>{benefit}</span>
                                </div>
                              ))}
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
                          className="p-4 mt-4 border border-green-200 rounded-lg bg-green-50 dark:bg-green-900/20"
                        >
                          <div className="flex items-center mb-2 space-x-2 text-green-700">
                            <QrCode className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              Thanh toán VietQR - Miễn phí hoàn toàn
                            </span>
                          </div>
                          <p className="text-sm text-green-600">
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
                          className="p-4 mt-4 rounded-lg bg-blue-50 dark:bg-blue-900/20"
                        >
                          <div className="flex items-center mb-2 space-x-2 text-blue-700">
                            <Shield className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              Bảo mật SSL 256-bit
                            </span>
                          </div>
                          <p className="text-sm text-blue-600">
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
                          className="p-4 mt-4 border border-orange-200 rounded-lg bg-orange-50 dark:bg-orange-900/20"
                        >
                          <div className="flex items-center mb-2 space-x-2 text-orange-700">
                            <Globe className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              Thanh toán quốc tế
                            </span>
                          </div>
                          <p className="text-sm text-orange-600">
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
                  className="w-full transition-all duration-300 shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl"
                  size="lg"
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
                      <Lock className="w-4 h-4 mr-2" />
                      {paymentMethod === "vietqr"
                        ? "Tạo mã QR thanh toán"
                        : `Thanh toán ${formatPrice(totalPrice)}`}
                      <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                    </>
                  )}
                </Button>
              </motion.div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="sticky border-0 shadow-2xl top-4 bg-gradient-to-br from-white to-green-50 dark:from-slate-800 dark:to-green-900">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <ShoppingCart className="w-5 h-5 text-green-600" />
                    <span>Đơn hàng của bạn</span>
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
                        className="flex items-start justify-between p-3 text-sm rounded-lg bg-white/50 dark:bg-slate-700/50"
                      >
                        <div className="flex space-x-3">
                          <img
                            src={item.product.image}
                            alt={item.product.title}
                            className="object-cover w-12 h-12 rounded"
                          />
                          <div className="flex-1">
                            <div className="mb-1 font-medium line-clamp-2">
                              {item.product.title}
                            </div>
                            <div className="flex items-center space-x-2 text-muted-foreground">
                              <span>Số lượng: {item.quantity}</span>
                              <Badge variant="outline" className="text-xs">
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
                        <div className="font-medium text-primary">
                          {formatPrice(item.product.price * item.quantity)}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <Separator />

                  {/* Price Breakdown */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Tạm tính ({items.length} sản phẩm)</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Phí xử lý</span>
                      <span className="text-green-600">Miễn phí</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Thuế VAT</span>
                      <span>Đã bao gồm</span>
                    </div>
                    {paymentMethod === "vietqr" && (
                      <div className="flex justify-between text-green-600">
                        <span>Phí thanh toán</span>
                        <span>Miễn phí</span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Total */}
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Tổng cộng</span>
                    <span className="text-primary">
                      {formatPrice(totalPrice)}
                    </span>
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
                      {paymentMethod === "vietqr" && (
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="font-medium text-green-600">
                            Không phí giao dịch
                          </span>
                        </div>
                      )}
                    </div>
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

export default Checkout;
