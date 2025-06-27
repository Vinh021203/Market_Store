import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { Product } from "@/types";
import { toast } from "@/hooks/use-toast";

const WISHLIST_STORAGE_KEY = "myWishlist";

// Helper: Đọc wishlist từ localStorage
function getStoredWishlist(): Product[] {
  try {
    const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("❌ Lỗi khi đọc wishlist từ localStorage:", error);
    return [];
  }
}

// Helper: Ghi wishlist vào localStorage
function setStoredWishlist(wishlist: Product[]) {
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
  } catch (error) {
    console.error("❌ Lỗi khi lưu wishlist vào localStorage:", error);
  }
}

// Interface cho context
interface WishlistContextType {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  getTotalWishlistItems: () => number;
}

// Tạo context
const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

// Custom hook
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

// Props cho Provider
interface WishlistProviderProps {
  children: ReactNode;
}

// Provider component
export const WishlistProvider = ({ children }: WishlistProviderProps) => {
  const [wishlist, setWishlist] = useState<Product[]>([]);

  useEffect(() => {
    setWishlist(getStoredWishlist());
  }, []);

  useEffect(() => {
    setStoredWishlist(wishlist);
  }, [wishlist]);

  const addToWishlist = (product: Product) => {
    setWishlist((prev) => {
      if (prev.some((item) => item.id === product.id)) {
        toast({
          title: "💡 Sản phẩm đã có trong danh sách yêu thích.",
          description: product.title,
          variant: "default",
        });
        return prev;
      }
      toast({ title: "❤️ Đã thêm vào yêu thích", description: product.title });
      return [...prev, product];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlist((prev) => {
      const newWishlist = prev.filter((item) => item.id !== productId);
      const removed = prev.find((item) => item.id === productId);
      toast({
        title: "💔 Đã xóa khỏi yêu thích",
        description: removed?.title || "Sản phẩm",
      });
      return newWishlist;
    });
  };

  const isInWishlist = (productId: string) =>
    wishlist.some((item) => item.id === productId);

  const clearWishlist = () => {
    setWishlist([]);
    toast({ title: "🗑️ Đã xóa toàn bộ danh sách yêu thích." });
  };

  const getTotalWishlistItems = () => wishlist.length;

  const value: WishlistContextType = {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    getTotalWishlistItems,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
