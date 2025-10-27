import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { Product } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/hooks/useWishlist";
import { formatPrice, getDiscountPercentage } from "@/lib/products";
import { motion } from "framer-motion";
import {
  Star,
  ShoppingCart,
  Eye,
  Download,
  BookOpen,
  Heart,
  Users,
  ExternalLink,
  Crown,
} from "lucide-react";

interface ProductCardProps {
  product: Product;
  showAddToCart?: boolean;
  onAddToCart?: () => void;
  viewMode?: "grid" | "list";
  isVisible?: boolean;
  animationDelay?: string;
  onRemoveFromWishlist?: (productId: string, productName: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  showAddToCart = true,
  onAddToCart,
  viewMode = "grid",
  isVisible = true,
  animationDelay = "0ms",
  onRemoveFromWishlist,
}) => {
  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist, isInWishlist } =
    useWishlist();

  // States
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [renderKey, setRenderKey] = useState(0);

  useEffect(() => {
    const handleWishlistUpdate = () => {
      setRenderKey((prev) => prev + 1);
    };
    window.addEventListener("wishlistUpdated", handleWishlistUpdate);
    return () => {
      window.removeEventListener("wishlistUpdated", handleWishlistUpdate);
    };
  }, []);

  const isProductInWishlist = useMemo(() => {
    return isInWishlist(product.id);
  }, [product.id, wishlist.length, renderKey, isInWishlist]);

  const discountPercentage = product.originalPrice
    ? getDiscountPercentage(product.originalPrice, product.price)
    : 0;

  const handleAddToCart = useCallback(() => {
    if (onAddToCart) {
      onAddToCart();
    } else {
      addToCart(product);
    }
  }, [onAddToCart, addToCart, product]);

  const handleToggleWishlist = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (isProductInWishlist) {
        removeFromWishlist(product.id);
        if (onRemoveFromWishlist) {
          onRemoveFromWishlist(product.id, product.title);
        }
      } else {
        addToWishlist(product);
      }

      setTimeout(() => {
        setRenderKey((prev) => prev + 1);
      }, 100);
    },
    [
      isProductInWishlist,
      removeFromWishlist,
      addToWishlist,
      product,
      onRemoveFromWishlist,
    ],
  );

  // ✅ GRID VIEW
  if (viewMode === "grid") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{
          duration: 0.4,
          delay: parseFloat(animationDelay.replace("ms", "")) / 1000,
          ease: "easeOut",
        }}
        whileHover={{ y: -4 }}
        className="h-full group"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        key={`${product.id}-${renderKey}`}
      >
        <Card className="relative h-full flex flex-col bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
          {/* IMAGE SECTION */}
          <div className="relative w-full aspect-square overflow-hidden rounded-t-2xl bg-gray-50 dark:bg-slate-700">
            {!isImageLoaded && (
              <div className="w-full h-full bg-gradient-to-br from-pink-100 to-blue-100 animate-pulse" />
            )}

            <img
              src={product.image}
              alt={product.title}
              className={`
                w-full h-full object-cover transition-all duration-500
                group-hover:scale-105
                ${!isImageLoaded ? "opacity-0" : "opacity-100"}
              `}
              onLoad={() => setIsImageLoaded(true)}
            />

            {/* ✅ FIXED: Gradient Overlay - No pointer events */}
            <div
              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ pointerEvents: "none" }}
            />

            {/* LEFT BADGES */}
            <div className="absolute top-3 left-3 flex flex-col gap-2 z-20 pointer-events-none">
              <Badge
                className={`
                  text-xs font-medium px-2 py-1 border-0 shadow-lg
                  ${
                    product.category === "template"
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500"
                      : "bg-gradient-to-r from-emerald-500 to-green-500"
                  } text-white
                `}
              >
                {product.category === "template" ? (
                  <>
                    <Download className="w-3 h-3 mr-1" />
                    Template
                  </>
                ) : (
                  <>
                    <BookOpen className="w-3 h-3 mr-1" />
                    E-book
                  </>
                )}
              </Badge>

              {product.isFeatured && (
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0 text-xs font-medium px-2 py-1 shadow-lg">
                  <Crown className="w-3 h-3 mr-1" />
                  Nổi bật
                </Badge>
              )}
            </div>

            {/* ✅ RIGHT BADGES - FIXED WISHLIST */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 items-end z-50">
              {discountPercentage > 0 && (
                <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 font-bold text-xs px-2 py-1 shadow-lg pointer-events-none">
                  -{discountPercentage}%
                </Badge>
              )}

              {/* ✅ WISHLIST BUTTON - 100% CLICKABLE */}
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.85 }}
                onClick={handleToggleWishlist}
                className={`
                  w-9 h-9 rounded-full shadow-xl
                  flex items-center justify-center
                  transition-all duration-300 cursor-pointer
                  backdrop-blur-md border-2
                  ${
                    isProductInWishlist
                      ? "bg-gradient-to-br from-red-500 to-pink-600 border-white/30 text-white hover:shadow-2xl hover:shadow-red-500/50"
                      : "bg-white/95 hover:bg-white border-white/50 text-gray-700 hover:text-red-500 hover:border-red-500/50"
                  }
                `}
                style={{ pointerEvents: "auto" }}
                type="button"
                aria-label={
                  isProductInWishlist
                    ? "Remove from wishlist"
                    : "Add to wishlist"
                }
              >
                <Heart
                  className={`w-4 h-4 transition-all duration-300 ${
                    isProductInWishlist ? "fill-current scale-110" : ""
                  }`}
                />
              </motion.button>
            </div>

            {/* ✅ HOVER ACTIONS - FIXED */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center gap-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: isHovered ? 1 : 0,
                scale: isHovered ? 1 : 0.8,
              }}
              transition={{ duration: 0.3 }}
              style={{ pointerEvents: isHovered ? "auto" : "none", zIndex: 10 }}
            >
              <Button
                size="sm"
                className="bg-white/95 hover:bg-white text-gray-900 border-0 shadow-lg font-medium px-3 backdrop-blur-sm"
                asChild
              >
                <Link to={`/product/${product.id}`}>
                  <Eye className="w-4 h-4 mr-1" />
                  Chi tiết
                </Link>
              </Button>

              {product.previewUrl && (
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white border-0 shadow-lg font-medium px-3"
                  asChild
                >
                  <a
                    href={product.previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Demo
                  </a>
                </Button>
              )}
            </motion.div>
          </div>

          {/* CONTENT SECTION */}
          <CardContent className="flex-1 flex flex-col p-4">
            <Link to={`/product/${product.id}`} className="block mb-2">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight hover:text-transparent hover:bg-gradient-to-r hover:from-pink-600 hover:to-orange-600 hover:bg-clip-text transition-all duration-300">
                {product.title}
              </h3>
            </Link>

            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
              {product.description}
            </p>

            <div className="flex items-center justify-between mb-3 text-xs">
              <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-lg">
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                <span className="font-semibold text-yellow-700 dark:text-yellow-400">
                  {product.rating}
                </span>
                <span className="text-gray-500">({product.reviewCount})</span>
              </div>

              <div className="flex items-center gap-1 text-gray-500">
                <Users className="w-3 h-3" />
                <span>1.2K</span>
              </div>
            </div>

            <div className="flex gap-1 mb-3">
              {product.tags.slice(0, 2).map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-xs px-2 py-0.5 bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-slate-600"
                >
                  {tag}
                </Badge>
              ))}
              {product.tags.length > 2 && (
                <Badge variant="outline" className="text-xs px-2 py-0.5">
                  +{product.tags.length - 2}
                </Badge>
              )}
            </div>

            {product.author && (
              <div className="flex items-center gap-2 mb-4 text-xs text-gray-500">
                <div className="w-5 h-5 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {product.author.charAt(0)}
                  </span>
                </div>
                <span className="truncate">{product.author}</span>
              </div>
            )}

            <div className="mt-auto">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm line-through text-gray-400">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              {showAddToCart && (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={handleAddToCart}
                    className="w-full h-10 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white border-0 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Thêm vào giỏ
                  </Button>
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // ✅ LIST VIEW - SAME FIXES
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{
        duration: 0.4,
        delay: parseFloat(animationDelay.replace("ms", "")) / 1000,
        ease: "easeOut",
      }}
      whileHover={{ x: 4 }}
      className="h-full group"
      key={`${product.id}-${renderKey}`}
    >
      <Card className="flex h-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
        <div className="relative w-48 flex-shrink-0 aspect-square overflow-hidden bg-gray-50 dark:bg-slate-700">
          {!isImageLoaded && (
            <div className="w-full h-full bg-gradient-to-br from-pink-100 to-blue-100 animate-pulse" />
          )}

          <img
            src={product.image}
            alt={product.title}
            className={`
              w-full h-full object-cover transition-all duration-500
              group-hover:scale-105
              ${!isImageLoaded ? "opacity-0" : "opacity-100"}
            `}
            onLoad={() => setIsImageLoaded(true)}
          />

          <div className="absolute top-2 left-2 z-20 pointer-events-none">
            <Badge
              className={`
                text-xs px-2 py-1 border-0 shadow-lg
                ${
                  product.category === "template"
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500"
                    : "bg-gradient-to-r from-emerald-500 to-green-500"
                } text-white
              `}
            >
              {product.category === "template" ? "Template" : "E-book"}
            </Badge>
          </div>

          {discountPercentage > 0 && (
            <div className="absolute top-2 right-2 z-20 pointer-events-none">
              <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 font-bold text-xs px-2 py-1">
                -{discountPercentage}%
              </Badge>
            </div>
          )}

          <motion.div
            className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            style={{ pointerEvents: isHovered ? "auto" : "none", zIndex: 10 }}
          >
            <Button size="sm" variant="secondary" asChild>
              <Link to={`/product/${product.id}`}>
                <Eye className="w-4 h-4 mr-1" />
                Xem
              </Link>
            </Button>
            {product.previewUrl && (
              <Button size="sm" variant="secondary" asChild>
                <a
                  href={product.previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Demo
                </a>
              </Button>
            )}
          </motion.div>
        </div>

        <CardContent className="flex-1 flex flex-col justify-between p-4">
          <div>
            <div className="flex items-start justify-between mb-2">
              <Link to={`/product/${product.id}`} className="flex-1 mr-3">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2 hover:text-transparent hover:bg-gradient-to-r hover:from-pink-600 hover:to-orange-600 hover:bg-clip-text transition-all duration-300">
                  {product.title}
                </h3>
              </Link>

              {/* ✅ WISHLIST - LIST VIEW */}
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.85 }}
                onClick={handleToggleWishlist}
                className={`
                  flex-shrink-0 w-9 h-9 rounded-full shadow-lg
                  flex items-center justify-center
                  transition-all duration-300 cursor-pointer border-2
                  ${
                    isProductInWishlist
                      ? "bg-gradient-to-br from-red-500 to-pink-600 border-red-300 text-white"
                      : "bg-white hover:bg-gray-50 border-gray-200 text-gray-700 hover:text-red-500 hover:border-red-500"
                  }
                `}
                style={{ pointerEvents: "auto", zIndex: 50 }}
                type="button"
              >
                <Heart
                  className={`w-4 h-4 ${isProductInWishlist ? "fill-current" : ""}`}
                />
              </motion.button>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
              {product.description}
            </p>

            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                <span className="text-sm font-semibold text-yellow-700">
                  {product.rating}
                </span>
                <span className="text-xs text-gray-500">
                  ({product.reviewCount})
                </span>
              </div>

              {product.isFeatured && (
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0 text-xs">
                  <Crown className="w-3 h-3 mr-1" />
                  Nổi bật
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap gap-1 mb-3">
              {product.tags.slice(0, 4).map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-xs px-2 py-0.5 bg-gray-50 text-gray-600 border-gray-200"
                >
                  {tag}
                </Badge>
              ))}
              {product.tags.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{product.tags.length - 4}
                </Badge>
              )}
            </div>

            {product.author && (
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <div className="w-5 h-5 bg-gradient-to-r from-pink-400 to-orange-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {product.author.charAt(0)}
                  </span>
                </div>
                <span>
                  Tác giả: <span className="font-medium">{product.author}</span>
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-lg line-through text-gray-400">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              {product.fileSize && (
                <p className="text-xs text-gray-500">{product.fileSize}</p>
              )}
            </div>

            {showAddToCart && (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleAddToCart}
                  className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white border-0 rounded-xl font-semibold px-6 h-10"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Thêm vào giỏ
                </Button>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
