import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
  useCallback,
  useRef,
} from "react";
import { Product } from "@/types";
import { toast } from "@/hooks/use-toast";

const WISHLIST_STORAGE_KEY = "myWishlist";

// 📦 Helper: Đọc wishlist từ localStorage
function getStoredWishlist(): Product[] {
  try {
    const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    return [];
  }
}

// 💾 Helper: Ghi wishlist vào localStorage
function setStoredWishlist(wishlist: Product[]) {
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    window.dispatchEvent(
      new CustomEvent("wishlistUpdated", {
        detail: { wishlist, count: wishlist.length },
      }),
    );
  } catch (error) {
    // Silent fail
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
  const [isInitialized, setIsInitialized] = useState(false);
  const isFirstRender = useRef(true);

  // Load initial data
  useEffect(() => {
    const stored = getStoredWishlist();
    setWishlist(stored);
    setIsInitialized(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (isInitialized) {
      setStoredWishlist(wishlist);
    }
  }, [wishlist, isInitialized]);

  // Listen to storage changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === WISHLIST_STORAGE_KEY && e.newValue) {
        try {
          const newWishlist = JSON.parse(e.newValue);
          setWishlist(newWishlist);
        } catch (error) {
          // Silent fail
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Add to wishlist
  const addToWishlist = useCallback((product: Product) => {
    setWishlist((prev) => {
      if (prev.some((item) => item.id === product.id)) {
        toast({
          title: "💡 Sản phẩm đã có trong danh sách",
          description: product.title,
          variant: "default",
          duration: 3000,
        });
        return prev;
      }

      const newWishlist = [...prev, product];

      toast({
        title: "❤️ Đã thêm vào yêu thích",
        description: product.title,
        duration: 3000,
      });

      return newWishlist;
    });
  }, []);

  // Remove from wishlist
  const removeFromWishlist = useCallback((productId: string) => {
    setWishlist((prev) => {
      const removed = prev.find((item) => item.id === productId);
      const newWishlist = prev.filter((item) => item.id !== productId);

      if (removed) {
        toast({
          title: "💔 Đã xóa khỏi yêu thích",
          description: removed.title,
          duration: 3000,
        });
      }

      return newWishlist;
    });
  }, []);

  // Check if in wishlist
  const isInWishlist = useCallback(
    (productId: string) => {
      return wishlist.some((item) => item.id === productId);
    },
    [wishlist],
  );

  // Clear all
  const clearWishlist = useCallback(() => {
    setWishlist([]);
    toast({
      title: "🗑️ Đã xóa toàn bộ wishlist",
      description: "Danh sách yêu thích đã được làm trống.",
      duration: 3000,
    });
  }, []);

  // Get total items
  const getTotalWishlistItems = useCallback(() => {
    return wishlist.length;
  }, [wishlist.length]);

  // Refresh wishlist
  const refreshWishlist = useCallback(() => {
    const stored = getStoredWishlist();
    setWishlist(stored);
  }, []);

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
