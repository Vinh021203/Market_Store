import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CartItem as CartItemType } from "@/types";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/products";
import { Trash2, Plus, Minus } from "lucide-react";

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { removeFromCart, updateQuantity } = useCart();

  return (
    <div className="flex gap-4 p-4 border rounded-lg">
      <div className="relative">
        <img
          src={item.product.image}
          alt={item.product.title}
          className="w-20 h-20 object-cover rounded"
        />
      </div>

      <div className="flex-1 space-y-2">
        <div className="flex justify-between items-start">
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
              {item.product.category === "template" ? "Template" : "E-book"}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeFromCart(item.product.id)}
            className="text-red-500 p-1"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 border rounded-md">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
              className="h-8 w-8 p-0"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="px-3 py-1 text-sm font-medium">
              {item.quantity}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
              className="h-8 w-8 p-0"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <div className="text-right">
            <div className="font-semibold">
              {formatPrice(item.product.price * item.quantity)}
            </div>
            {item.product.originalPrice && (
              <div className="text-sm text-muted-foreground line-through">
                {formatPrice(item.product.originalPrice * item.quantity)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
