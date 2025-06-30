// contexts/LoadingContext.tsx - Enhanced với auto route loading
import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

interface LoadingContextType {
  isLoading: boolean;
  loadingText: string;
  setIsLoading: (loading: boolean) => void;
  setLoadingText: (text: string) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Đang tải...");
  const location = useLocation();

  // ✅ Auto loading khi route change
  useEffect(() => {
    // Bỏ qua loading cho một số routes đặc biệt
    const skipLoadingRoutes = ["/auth/login", "/auth/register"];
    if (skipLoadingRoutes.includes(location.pathname)) {
      return;
    }

    setIsLoading(true);

    // Set loading text dựa vào route
    const getLoadingText = (pathname: string) => {
      if (pathname === "/") return "Đang tải trang chủ...";
      if (pathname === "/templates") return "Đang tải templates...";
      if (pathname === "/ebooks") return "Đang tải e-books...";
      if (pathname === "/blog") return "Đang tải blog...";
      if (pathname.startsWith("/admin")) return "Đang tải admin panel...";
      if (pathname.startsWith("/product/"))
        return "Đang tải chi tiết sản phẩm...";
      return "Đang chuyển trang...";
    };

    setLoadingText(getLoadingText(location.pathname));

    // Clear loading sau một khoảng thời gian
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600); // Adjust timing as needed

    return () => {
      clearTimeout(timer);
    };
  }, [location.pathname]);

  return (
    <LoadingContext.Provider
      value={{ isLoading, loadingText, setIsLoading, setLoadingText }}
    >
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within LoadingProvider");
  }
  return context;
};
