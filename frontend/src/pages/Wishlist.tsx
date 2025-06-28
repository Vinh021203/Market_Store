import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProductCard from "@/components/ProductCard";
import { Heart, Package, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";

const Wishlist: React.FC = () => {
  const { wishlist, removeFromWishlist, clearWishlist, getTotalWishlistItems } =
    useWishlist();
  const { addToCart } = useCart();
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
  const [renderKey, setRenderKey] = useState(0);

  // ✅ Safe wishlist count với fallback
  const wishlistCount = getTotalWishlistItems() || 0;

  // Listen to wishlist updates
  useEffect(() => {
    const handleWishlistUpdate = () => {
      setRenderKey((prev) => prev + 1);
    };

    window.addEventListener("wishlistUpdated", handleWishlistUpdate);
    return () => {
      window.removeEventListener("wishlistUpdated", handleWishlistUpdate);
    };
  }, []);

  useEffect(() => {
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

  const handleRemoveFromWishlist = (productId: string, productName: string) => {
    removeFromWishlist(productId);
  };

  const handleClearWishlist = () => {
    clearWishlist();
  };

  return (
    <>
      <Helmet>
        {/* ✅ Fix: Đảm bảo title luôn là string */}
        <title>{`Sản phẩm yêu thích (${wishlistCount}) - Template Market`}</title>
        <meta
          name="description"
          content="Xem các sản phẩm yêu thích của bạn tại Template Market."
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
        {/* Floating Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 animate-float">
            <Heart className="w-8 h-8 text-pink-500 opacity-20" />
          </div>
          <div className="absolute top-1/3 right-1/4 animate-float-delay-1">
            <Package className="w-6 h-6 text-blue-500 opacity-20" />
          </div>
          <div className="absolute bottom-1/4 left-1/3 animate-float-delay-2">
            <Heart className="text-red-500 w-7 h-7 opacity-20" />
          </div>
        </div>

        <div className="container relative z-10 px-4 py-8 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 space-y-6"
            id="wishlist-header"
            data-animate
            key={`header-${renderKey}`}
          >
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="flex items-center justify-center w-12 h-12 shadow-lg rounded-2xl bg-gradient-to-r from-pink-500 to-red-600"
              >
                <Heart className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                {/* ✅ Fix: Đảm bảo hiển thị số đúng */}
                <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-pink-600 via-red-600 to-orange-600 bg-clip-text">
                  Sản phẩm yêu thích ({wishlistCount})
                </h1>
                <p className="text-lg text-muted-foreground">
                  Lưu trữ những sản phẩm bạn muốn mua sau này.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            id="wishlist-content"
            data-animate
            key={`content-${renderKey}`}
          >
            {wishlist.length === 0 ? (
              <Card className="py-16 text-center border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900">
                <CardContent>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      delay: 0.2,
                      type: "spring",
                      stiffness: 200,
                    }}
                  >
                    <Heart className="w-20 h-20 mx-auto mb-6 text-muted-foreground" />
                  </motion.div>
                  <h3 className="mb-4 text-2xl font-semibold">
                    Danh sách yêu thích trống
                  </h3>
                  <p className="max-w-md mx-auto mb-6 text-muted-foreground">
                    Chưa có sản phẩm nào trong danh sách yêu thích của bạn. Hãy
                    duyệt qua các sản phẩm của chúng tôi và thêm những gì bạn
                    thích!
                  </p>
                  <Button
                    asChild
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    <Link to="/templates">Khám phá sản phẩm</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">
                    Bạn có{" "}
                    <span className="font-semibold text-primary">
                      {wishlistCount}
                    </span>{" "}
                    sản phẩm trong danh sách yêu thích.
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleClearWishlist}
                    className="group"
                  >
                    <XCircle className="w-4 h-4 mr-2 transition-colors group-hover:text-red-500" />
                    Xóa tất cả
                  </Button>
                </div>

                <div className="grid items-stretch grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {wishlist.map((product, index) => (
                    <motion.div
                      key={`${product.id}-${renderKey}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`transition-all duration-500 ${
                        isVisible["wishlist-content"]
                          ? "animate-in slide-in-from-bottom"
                          : "opacity-0"
                      }`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <ProductCard
                        product={product}
                        showAddToCart={true}
                        onAddToCart={() => {
                          addToCart(product);
                        }}
                        onRemoveFromWishlist={() =>
                          handleRemoveFromWishlist(product.id, product.title)
                        }
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Wishlist;
