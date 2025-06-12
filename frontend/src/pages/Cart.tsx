import { useState, useEffect } from "react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/products";
import { supabase } from "@/lib/supabase";
import { getCartItems } from "@/lib/cart";

import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

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

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();
  const [cartItems, setCartItems] = useState([]); // dùng riêng nếu bạn muốn dùng local cart

  useEffect(() => {
    const fetchCart = async () => {
      const session = await supabase.auth.getSession();
      const userId = session.data.session?.user.id;
      if (!userId) return;

      const items = await getCartItems(userId);
      setCartItems(items); // setCartItems là state nội bộ của trang Cart
    };

    fetchCart();
  }, []);

  if (items.length === 0) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <Card className="max-w-md py-12 mx-auto text-center">
          <CardContent>
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="mb-2 text-xl font-semibold">Giỏ hàng trống</h2>
            <p className="mb-6 text-muted-foreground">
              Bạn chưa có sản phẩm nào trong giỏ hàng
            </p>
            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link to="/templates">Xem Templates</Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link to="/ebooks">Xem E-books</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex items-center mb-6 space-x-2">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          Tiếp tục mua sắm
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">
              Giỏ hàng ({totalItems} sản phẩm)
            </h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearCart}
              className="text-red-500"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Xóa tất cả
            </Button>
          </div>

          <div className="space-y-4">
            {items.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="relative">
                      <img
                        src={item.product.image}
                        alt={item.product.title}
                        className="object-cover w-20 h-20 rounded"
                      />
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold line-clamp-2">
                            <Link
                              to={`/product/${item.product.id}`}
                              className="hover:text-primary"
                            >
                              {item.product.title}
                            </Link>
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {item.product.category === "template"
                              ? "Template"
                              : "E-book"}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-1 text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 border rounded-md">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            className="w-8 h-8 p-0"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="px-3 py-1 text-sm font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="w-8 h-8 p-0"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>

                        <div className="text-right">
                          <div className="font-semibold">
                            {formatPrice(item.product.price * item.quantity)}
                          </div>
                          {item.product.originalPrice && (
                            <div className="text-sm line-through text-muted-foreground">
                              {formatPrice(
                                item.product.originalPrice * item.quantity,
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Tóm tắt đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Tạm tính ({totalItems} sản phẩm)</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Phí xử lý</span>
                  <span>Miễn phí</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Thuế VAT</span>
                  <span>Đã bao gồm</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-semibold">
                <span>Tổng cộng</span>
                <span className="text-primary">{formatPrice(totalPrice)}</span>
              </div>

              <div className="space-y-3">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => navigate("/checkout")}
                >
                  Tiến hành thanh toán
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>

                <Button variant="outline" className="w-full" asChild>
                  <Link to="/templates">Tiếp tục mua sắm</Link>
                </Button>
              </div>

              <div className="text-xs text-center text-muted-foreground">
                * Sản phẩm số sẽ được gửi qua email ngay sau khi thanh toán
                thành công
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cart;
