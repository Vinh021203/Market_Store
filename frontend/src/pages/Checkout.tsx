import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import VietQRPayment from "@/components/VietQRPayment";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { formatPrice } from "@/lib/products";
import {
  CreditCard,
  ShoppingCart,
  Lock,
  ArrowLeft,
  Check,
  QrCode,
  Globe,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

// Cập nhật schema để bao gồm VietQR
const checkoutSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  phone: z.string().min(10, "Số điện thoại không hợp lệ"),
  address: z.string().min(5, "Địa chỉ phải có ít nhất 5 ký tự"),
  city: z.string().min(2, "Thành phố không được bỏ trống"),
  country: z.string().min(2, "Quốc gia không được bỏ trống"),
  paymentMethod: z.enum(["vietqr", "credit_card", "paypal", "bank_transfer"]),
});

type CheckoutData = z.infer<typeof checkoutSchema>;

// Function tạo order
const createOrder = async ({
  userId,
  cartItems,
  total,
  customer,
}: {
  userId: string;
  cartItems: any[];
  total: number;
  customer: any;
}) => {
  // Tạo order trong database
  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      full_name: customer.full_name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
      country: customer.country,
      payment_method: customer.paymentMethod,
      total_price: total,
      status: "pending",
    })
    .select()
    .single();

  if (error) throw error;

  // Insert order items
  const orderItems = cartItems.map((item) => ({
    order_id: order.id,
    product_id: item.product.id,
    quantity: item.quantity,
    price: item.product.price,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) throw itemsError;

  return order;
};

const Checkout: React.FC = () => {
  const { items, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<any>(null);

  const totalPrice = getTotalPrice();

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
      paymentMethod: "vietqr", // Default to VietQR
    },
  });

  const paymentMethod = watch("paymentMethod");

  if (items.length === 0) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <Card className="max-w-md py-12 mx-auto text-center">
          <CardContent>
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="mb-2 text-xl font-semibold">Giỏ hàng trống</h2>
            <p className="mb-6 text-muted-foreground">
              Không có sản phẩm nào để thanh toán
            </p>
            <Button onClick={() => navigate("/templates")}>
              Tiếp tục mua sắm
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Trong onSubmit function của Checkout
  const onSubmit = async (data: CheckoutData) => {
    if (!user?.id) {
      toast({
        title: "Vui lòng đăng nhập",
        variant: "destructive",
      });
      navigate("/auth/login");
      return;
    }

    setIsProcessing(true);

    try {
      // Tạo order với payment_method = 'vietqr'
      const orderData = {
        user_id: user.id,
        full_name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        country: data.country,
        payment_method: data.paymentMethod, // 'vietqr'
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

      // Hiển thị VietQR payment
      setCurrentOrder(order);
      setShowPayment(true);
    } catch (error: any) {
      toast({
        title: "Lỗi tạo đơn hàng",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOtherPaymentMethods = async (method: string, order: any) => {
    // Giả lập xử lý payment methods khác
    setTimeout(async () => {
      try {
        // Cập nhật order status thành completed
        await supabase
          .from("orders")
          .update({ status: "completed" })
          .eq("id", order.id);

        clearCart();
        toast({
          title: "Thanh toán thành công!",
          description: "Đơn hàng của bạn đã được ghi nhận.",
        });
        navigate("/profile?tab=orders");
      } catch (error) {
        toast({
          title: "Lỗi thanh toán",
          description: "Có lỗi xảy ra khi xử lý thanh toán",
          variant: "destructive",
        });
      }
    }, 2000);
  };

  const handlePaymentSuccess = () => {
    clearCart();
    toast({
      title: "Thanh toán thành công!",
      description: "Đơn hàng của bạn đã được ghi nhận.",
    });
    navigate("/profile?tab=orders");
  };

  // Nếu đang hiển thị VietQR payment
  if (showPayment && currentOrder) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center mb-6 space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPayment(false)}
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Quay lại thông tin đơn hàng
            </Button>
          </div>

          <VietQRPayment
            order={{
              id: currentOrder.id,
              total: currentOrder.total_price,
              email: currentOrder.email,
            }}
            onPaymentSuccess={handlePaymentSuccess}
          />
        </div>
      </div>
    );
  }

  // Cập nhật payment methods
  const paymentMethods = [
    {
      id: "vietqr",
      name: "VietQR",
      description: "Quét mã QR bằng app ngân hàng (Miễn phí)",
      icon: QrCode,
      fee: "0%",
      popular: true,
      badge: "Khuyến nghị",
    },
    {
      id: "credit_card",
      name: "Thẻ tín dụng/ghi nợ",
      description: "Visa, Mastercard, JCB",
      icon: CreditCard,
      fee: "2.9%",
    },
    {
      id: "paypal",
      name: "PayPal",
      description: "Thanh toán quốc tế với PayPal",
      icon: Globe,
      fee: "3.9%",
    },
  ];

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex items-center mb-6 space-x-2">
        <Button variant="ghost" size="sm" onClick={() => navigate("/cart")}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          Quay lại giỏ hàng
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>Thông tin khách hàng</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Họ và tên *</Label>
                    <Input
                      id="name"
                      {...register("name")}
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại *</Label>
                    <Input
                      id="phone"
                      {...register("phone")}
                      className={errors.phone ? "border-red-500" : ""}
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-500">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">Thành phố *</Label>
                    <Input
                      id="city"
                      {...register("city")}
                      className={errors.city ? "border-red-500" : ""}
                    />
                    {errors.city && (
                      <p className="text-sm text-red-500">
                        {errors.city.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Địa chỉ *</Label>
                  <Input
                    id="address"
                    {...register("address")}
                    className={errors.address ? "border-red-500" : ""}
                  />
                  {errors.address && (
                    <p className="text-sm text-red-500">
                      {errors.address.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Quốc gia *</Label>
                  <Input
                    id="country"
                    {...register("country")}
                    className={errors.country ? "border-red-500" : ""}
                  />
                  {errors.country && (
                    <p className="text-sm text-red-500">
                      {errors.country.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lock className="w-5 h-5" />
                  <span>Phương thức thanh toán</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(value) =>
                    setValue("paymentMethod", value as any)
                  }
                  className="space-y-3"
                >
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`relative flex items-center p-4 space-x-3 border rounded-lg transition-all ${
                        paymentMethod === method.id
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <RadioGroupItem value={method.id} id={method.id} />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <Label
                            htmlFor={method.id}
                            className="font-medium cursor-pointer"
                          >
                            {method.name}
                          </Label>
                          {method.badge && (
                            <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                              {method.badge}
                            </span>
                          )}
                          <span className="text-xs text-muted-foreground">
                            Phí: {method.fee}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {method.description}
                        </p>
                      </div>
                      <method.icon className="w-5 h-5 text-muted-foreground" />
                    </div>
                  ))}
                </RadioGroup>

                {/* Payment Method Info */}
                {paymentMethod === "vietqr" && (
                  <div className="p-4 mt-4 border border-green-200 rounded-lg bg-green-50">
                    <div className="flex items-center space-x-2 text-green-700">
                      <QrCode className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        Thanh toán VietQR - Miễn phí hoàn toàn
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-green-600">
                      Quét mã QR bằng app ngân hàng để thanh toán nhanh chóng và
                      an toàn
                    </p>
                  </div>
                )}

                {paymentMethod === "credit_card" && (
                  <div className="p-4 mt-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">
                      <Lock className="inline w-4 h-4 mr-1" />
                      Thông tin thanh toán được bảo mật với mã hóa SSL 256-bit
                    </p>
                  </div>
                )}

                {paymentMethod === "paypal" && (
                  <div className="p-4 mt-4 border border-blue-200 rounded-lg bg-blue-50">
                    <p className="text-sm text-blue-700">
                      <Globe className="inline w-4 h-4 mr-1" />
                      Hỗ trợ thanh toán quốc tế với PayPal
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white rounded-full animate-spin border-t-transparent" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  {paymentMethod === "vietqr"
                    ? "Tạo mã QR thanh toán"
                    : `Thanh toán ${formatPrice(totalPrice)}`}
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Đơn hàng của bạn</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between text-sm"
                  >
                    <div className="flex-1 pr-2">
                      <div className="font-medium line-clamp-2">
                        {item.product.title}
                      </div>
                      <div className="text-muted-foreground">
                        Số lượng: {item.quantity}
                      </div>
                    </div>
                    <div className="font-medium">
                      {formatPrice(item.product.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Tạm tính</span>
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
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-semibold">
                <span>Tổng cộng</span>
                <span className="text-primary">{formatPrice(totalPrice)}</span>
              </div>

              {/* Payment Method Benefits */}
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Check className="w-3 h-3 text-green-500" />
                  <span>Thanh toán an toàn và bảo mật</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Check className="w-3 h-3 text-green-500" />
                  <span>Giao hàng ngay qua email</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Check className="w-3 h-3 text-green-500" />
                  <span>Hỗ trợ khách hàng 24/7</span>
                </div>
                {paymentMethod === "vietqr" && (
                  <div className="flex items-center space-x-1">
                    <Check className="w-3 h-3 text-green-500" />
                    <span className="font-medium text-green-600">
                      Không phí giao dịch
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
