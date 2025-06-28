import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
  useCallback,
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
    // ✅ Dispatch custom event để notify các components khác
    window.dispatchEvent(
      new CustomEvent("wishlistUpdated", {
        detail: { wishlist, count: wishlist.length },
      }),
    );
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
  refreshWishlist: () => void;
}

// Tạo context
const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined,
);

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
  const [forceUpdate, setForceUpdate] = useState(0);

  // ✅ Load initial data
  useEffect(() => {
    const stored = getStoredWishlist();
    setWishlist(stored);
  }, []);

  // ✅ Listen to custom wishlist events
  useEffect(() => {
    const handleWishlistUpdate = () => {
      setForceUpdate((prev) => prev + 1);
    };

    window.addEventListener("wishlistUpdated", handleWishlistUpdate);
    return () => {
      window.removeEventListener("wishlistUpdated", handleWishlistUpdate);
    };
  }, []);

  // ✅ Save to localStorage whenever wishlist changes
  useEffect(() => {
    if (wishlist.length >= 0) {
      setStoredWishlist(wishlist);
    }
  }, [wishlist]);

  const refreshWishlist = useCallback(() => {
    const stored = getStoredWishlist();
    setWishlist(stored);
    setForceUpdate((prev) => prev + 1);
  }, []);

  const addToWishlist = useCallback((product: Product) => {
    setWishlist((prev) => {
      if (prev.some((item) => item.id === product.id)) {
        toast({
          title: "💡 Sản phẩm đã có trong danh sách yêu thích.",
          description: product.title,
          variant: "default",
        });
        return prev;
      }

      const newWishlist = [...prev, product];
      toast({
        title: "❤️ Đã thêm vào yêu thích",
        description: product.title,
      });

      setForceUpdate((prev) => prev + 1);
      return newWishlist;
    });
  }, []);

  const removeFromWishlist = useCallback((productId: string) => {
    setWishlist((prev) => {
      const newWishlist = prev.filter((item) => item.id !== productId);
      const removed = prev.find((item) => item.id === productId);

      toast({
        title: "💔 Đã xóa khỏi yêu thích",
        description: removed?.title || "Sản phẩm",
      });

      setForceUpdate((prev) => prev + 1);
      return newWishlist;
    });
  }, []);

  const isInWishlist = useCallback(
    (productId: string) => {
      return wishlist.some((item) => item.id === productId);
    },
    [wishlist, forceUpdate],
  );

  const clearWishlist = useCallback(() => {
    setWishlist([]);
    toast({ title: "🗑️ Đã xóa toàn bộ danh sách yêu thích." });
    setForceUpdate((prev) => prev + 1);
  }, []);

  const getTotalWishlistItems = useCallback(() => {
    return wishlist.length;
  }, [wishlist.length, forceUpdate]);

  const value: WishlistContextType = {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    getTotalWishlistItems,
    refreshWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
