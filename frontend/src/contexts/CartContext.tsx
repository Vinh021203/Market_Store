import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { CartItem, Product, CartContextType } from "@/types";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import {
  addToCartDB,
  getCartItems,
  updateCartItem,
  removeCartItem,
  clearCart as clearCartDB,
} from "@/lib/cart";

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const fetchCart = async () => {
      const session = await supabase.auth.getSession();
      const userId = session.data.session?.user.id;
      if (!userId) return;

      try {
        const dbItems = await getCartItems(userId);
        setItems(dbItems);
      } catch (error) {
        console.error("Failed to fetch cart from Supabase", error);
      }
    };
    fetchCart();
  }, []);

  const addToCart = async (product: Product) => {
    const session = await supabase.auth.getSession();
    const userId = session.data.session?.user.id;

    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.product.id === product.id,
      );

      if (existingItem) {
        toast({
          title: "Sản phẩm đã có trong giỏ hàng",
        });
        return currentItems;
      }

      const newItem: CartItem = {
        id: `cart-${Date.now()}-${product.id}`,
        product,
        quantity: 1,
        addedAt: new Date().toISOString(),
      };

      toast({
        title: "Đã thêm vào giỏ hàng",
      });

      if (userId) {
        addToCartDB(userId, product.id, 1, product.price).catch(console.error);
      }

      return [...currentItems, newItem];
    });
  };

  const removeFromCart = async (productId: string) => {
    const session = await supabase.auth.getSession();
    const userId = session.data.session?.user.id;

    setItems((currentItems) => {
      const updated = currentItems.filter((i) => i.product.id !== productId);
      toast({ title: "Đã xóa khỏi giỏ hàng" });
      return updated;
    });

    if (userId) {
      removeCartItem(userId, productId).catch(console.error);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) return removeFromCart(productId);

    const session = await supabase.auth.getSession();
    const userId = session.data.session?.user.id;

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item,
      ),
    );

    if (userId) {
      updateCartItem(userId, productId, quantity).catch(console.error);
    }
  };

  const clearCart = async () => {
    const session = await supabase.auth.getSession();
    const userId = session.data.session?.user.id;

    setItems([]);
    toast({ title: "Đã xóa giỏ hàng" });

    if (userId) {
      clearCartDB(userId).catch(console.error);
    }
  };

  const getTotalPrice = () => {
    return items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0,
    );
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const value: CartContextType = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
