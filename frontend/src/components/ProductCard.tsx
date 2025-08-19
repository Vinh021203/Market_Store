import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { Product } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/hooks/useWishlist";
import { formatPrice, getDiscountPercentage } from "@/lib/products";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  ShoppingCart,
  Eye,
  Download,
  BookOpen,
  Heart,
  Zap,
  Users,
  ExternalLink,
  CheckCircle,
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

  // States for enhanced UX
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

  // Enhanced Wishlist Button with better animations
  const WishlistButton = ({ size = "sm" as const, className = "" }) => (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="relative"
    >
      <Button
        variant={isProductInWishlist ? "default" : "outline"}
        size={size}
        onClick={handleToggleWishlist}
        className={`
          relative overflow-hidden transition-all duration-300 shadow-lg
          ${
            isProductInWishlist
              ? "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-0 shadow-red-200"
              : "bg-white/90 backdrop-blur border-gray-200 hover:border-red-300 hover:bg-red-50 shadow-gray-100"
          } ${className}
        `}
        title={
          isProductInWishlist ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"
        }
      >
        {/* Ripple effect */}
        <div className="absolute inset-0 bg-white/20 scale-0 rounded-full transition-transform duration-300 group-active:scale-100"></div>

        <Heart
          className={`
            w-4 h-4 transition-all duration-300 relative z-10
            ${
              isProductInWishlist
                ? "fill-current text-white animate-pulse"
                : "text-gray-600 hover:text-red-500"
            }
          `}
        />
      </Button>

      {/* Floating heart animation */}
      <AnimatePresence>
        {isProductInWishlist && (
          <motion.div
            initial={{ scale: 0, y: 0 }}
            animate={{ scale: 1.2, y: -20, opacity: 0 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute top-0 left-1/2 transform -translate-x-1/2 pointer-events-none"
          >
            <Heart className="w-4 h-4 fill-red-500 text-red-500" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  // Grid View Layout - Enhanced Design
  if (viewMode === "grid") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{
          duration: 0.6,
          delay: parseFloat(animationDelay.replace("ms", "")) / 1000,
          type: "spring",
          stiffness: 100,
        }}
        whileHover={{ y: -8, scale: 1.02 }}
        className="h-full group"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        key={`${product.id}-${renderKey}`}
      >
        <Card
          className="
          relative overflow-hidden h-full flex flex-col
          bg-gradient-to-br from-white via-gray-50/50 to-white
          dark:from-slate-800 dark:via-slate-800/80 dark:to-slate-900
          border-0 shadow-lg hover:shadow-2xl hover:shadow-purple-500/10
          rounded-2xl lg:rounded-3xl
          transition-all duration-500 ease-out
          backdrop-blur-sm
          group-hover:border-purple-200/50
        "
        >
          {/* Image Section with Enhanced Effects */}
          <div className="relative overflow-hidden rounded-t-2xl lg:rounded-t-3xl">
            {/* Loading Skeleton */}
            {!isImageLoaded && (
              <div className="w-full h-48 sm:h-56 lg:h-64 bg-gray-200 dark:bg-slate-700 animate-pulse rounded-t-2xl lg:rounded-t-3xl"></div>
            )}

            <img
              src={product.image}
              alt={product.title}
              className={`
                object-cover w-full h-48 sm:h-56 lg:h-64
                transition-all duration-700 ease-out
                group-hover:scale-110 group-hover:brightness-110
                ${!isImageLoaded ? "opacity-0" : "opacity-100"}
              `}
              onLoad={() => setIsImageLoaded(true)}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Action Buttons Overlay */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center space-x-3"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: isHovered ? 1 : 0,
                scale: isHovered ? 1 : 0.8,
              }}
              transition={{ duration: 0.3 }}
            >
              <Button
                size="sm"
                className="bg-white/90 text-gray-900 hover:bg-white border-0 shadow-lg backdrop-blur-sm"
                asChild
              >
                <Link to={`/product/${product.id}`}>
                  <Eye className="w-4 h-4 mr-2" />
                  Chi tiết
                </Link>
              </Button>

              {product.previewUrl && (
                <Button
                  size="sm"
                  className="bg-purple-500/90 text-white hover:bg-purple-600 border-0 shadow-lg backdrop-blur-sm"
                  asChild
                >
                  <a
                    href={product.previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Demo
                  </a>
                </Button>
              )}
            </motion.div>

            {/* Category Badge */}
            <div className="absolute top-3 left-3">
              <Badge
                className={`
                ${
                  product.category === "template"
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500"
                    : "bg-gradient-to-r from-green-500 to-emerald-500"
                } 
                text-white border-0 shadow-lg backdrop-blur-sm
                text-xs font-medium px-2 py-1 rounded-lg
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
            </div>

            {/* Discount Badge */}
            {discountPercentage > 0 && (
              <motion.div
                className="absolute top-3 right-3"
                animate={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 shadow-lg font-bold">
                  -{discountPercentage}%
                </Badge>
              </motion.div>
            )}

            {/* Featured Badge */}
            {product.isFeatured && (
              <div className="absolute bottom-3 left-3">
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0 shadow-lg">
                  <Star className="w-3 h-3 mr-1" />
                  Nổi bật
                </Badge>
              </div>
            )}

            {/* Wishlist Button */}
            <div className="absolute top-3 right-3">
              <WishlistButton />
            </div>
          </div>

          {/* Content Section */}
          <CardContent className="flex-1 flex flex-col p-4 lg:p-6">
            <div className="flex-1">
              {/* Title */}
              <h3
                className="
                text-lg lg:text-xl font-bold mb-2 
                text-slate-800 dark:text-slate-100
                line-clamp-2 leading-tight
                group-hover:text-purple-600 dark:group-hover:text-purple-400
                transition-colors duration-300
              "
              >
                <Link to={`/product/${product.id}`} className="hover:underline">
                  {product.title}
                </Link>
              </h3>

              {/* Description */}
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2 leading-relaxed">
                {product.description}
              </p>

              {/* Rating and Reviews */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-lg">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="ml-1 text-sm font-semibold text-yellow-700 dark:text-yellow-300">
                      {product.rating}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    ({product.reviewCount})
                  </span>
                </div>

                {/* Quick Stats */}
                <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
                  <Users className="w-3 h-3" />
                  <span>1.2K</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {product.tags.slice(0, 3).map((tag, index) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="text-xs bg-slate-50 dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors duration-200"
                  >
                    {tag}
                  </Badge>
                ))}
                {product.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{product.tags.length - 3}
                  </Badge>
                )}
              </div>

              {/* Author */}
              {product.author && (
                <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mb-3">
                  <div className="w-5 h-5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mr-2">
                    <span className="text-white text-xs font-semibold">
                      {product.author.charAt(0)}
                    </span>
                  </div>
                  <span>{product.author}</span>
                </div>
              )}
            </div>

            {/* Price Section */}
            <div className="border-t border-gray-100 dark:border-slate-700 pt-4">
              <div className="flex items-center justify-between mb-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm line-through text-slate-400">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  {product.fileSize && (
                    <p className="text-xs text-slate-500 flex items-center">
                      <Zap className="w-3 h-3 mr-1" />
                      {product.fileSize}
                    </p>
                  )}
                </div>
              </div>

              {/* Add to Cart Button */}
              {showAddToCart && (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={handleAddToCart}
                    className="
                      w-full h-11
                      bg-gradient-to-r from-purple-600 via-purple-600 to-pink-600 
                      hover:from-purple-700 hover:via-purple-700 hover:to-pink-700
                      text-white border-0 rounded-xl
                      shadow-lg hover:shadow-xl hover:shadow-purple-500/25
                      transition-all duration-300
                      font-semibold
                      group/btn overflow-hidden
                    "
                  >
                    {/* Button shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                    <ShoppingCart className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform duration-200" />
                    Thêm vào giỏ
                    <CheckCircle className="w-4 h-4 ml-2 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200" />
                  </Button>
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // List View Layout - Enhanced
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
      transition={{
        duration: 0.6,
        delay: parseFloat(animationDelay.replace("ms", "")) / 1000,
        type: "spring",
        stiffness: 100,
      }}
      whileHover={{ x: 5, scale: 1.01 }}
      className="h-full group"
      key={`${product.id}-${renderKey}`}
    >
      <Card
        className="
        flex flex-col h-full
        bg-gradient-to-br from-white via-gray-50/50 to-white
        dark:from-slate-800 dark:via-slate-800/80 dark:to-slate-900
        border-0 shadow-lg hover:shadow-2xl hover:shadow-purple-500/10
        rounded-2xl
        transition-all duration-500 ease-out
        backdrop-blur-sm
      "
      >
        <CardContent className="flex flex-col justify-between flex-1 p-6">
          <div className="flex flex-col gap-6 lg:flex-row">
            {/* Image Section */}
            <div className="relative flex-shrink-0 w-full lg:w-64 h-48 lg:h-40 overflow-hidden rounded-xl">
              {!isImageLoaded && (
                <div className="w-full h-full bg-gray-200 dark:bg-slate-700 animate-pulse rounded-xl"></div>
              )}

              <img
                src={product.image}
                alt={product.title}
                className={`
                  object-cover w-full h-full transition-all duration-500
                  group-hover:scale-110 group-hover:brightness-110
                  ${!isImageLoaded ? "opacity-0" : "opacity-100"}
                `}
                onLoad={() => setIsImageLoaded(true)}
              />

              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
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
              </div>

              {/* Badges */}
              <div className="absolute top-2 left-2">
                <Badge
                  className={`
                  ${
                    product.category === "template"
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500"
                      : "bg-gradient-to-r from-green-500 to-emerald-500"
                  } 
                  text-white border-0 text-xs
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
              </div>

              {discountPercentage > 0 && (
                <div className="absolute top-2 right-2">
                  <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 font-bold">
                    -{discountPercentage}%
                  </Badge>
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="flex flex-col justify-between flex-1 space-y-4">
              <div>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl lg:text-2xl font-bold line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                    <Link
                      to={`/product/${product.id}`}
                      className="hover:underline"
                    >
                      {product.title}
                    </Link>
                  </h3>
                  <WishlistButton />
                </div>

                <p className="mb-4 text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {product.description}
                </p>

                {/* Rating and Stats */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1 rounded-lg">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="ml-1 text-sm font-semibold text-yellow-700 dark:text-yellow-300">
                        {product.rating}
                      </span>
                      <span className="ml-1 text-xs text-slate-500 dark:text-slate-400">
                        ({product.reviewCount})
                      </span>
                    </div>

                    {product.isFeatured && (
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-0">
                        <Star className="w-3 h-3 mr-1" />
                        Nổi bật
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.tags.slice(0, 6).map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-xs bg-slate-50 dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors duration-200"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {product.tags.length > 6 && (
                    <Badge variant="outline" className="text-xs">
                      +{product.tags.length - 6}
                    </Badge>
                  )}
                </div>

                {/* Author */}
                {product.author && (
                  <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                    <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mr-2">
                      <span className="text-white text-xs font-semibold">
                        {product.author.charAt(0)}
                      </span>
                    </div>
                    <span>
                      Tác giả:{" "}
                      <span className="font-medium">{product.author}</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Price and Actions */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-700 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-lg line-through text-slate-400">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  {product.fileSize && (
                    <p className="text-sm text-slate-500 flex items-center">
                      <Zap className="w-4 h-4 mr-1" />
                      Dung lượng: {product.fileSize}
                    </p>
                  )}
                </div>

                {showAddToCart && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full sm:w-auto"
                  >
                    <Button
                      onClick={handleAddToCart}
                      className="
                        w-full sm:w-auto h-12 px-8
                        bg-gradient-to-r from-purple-600 via-purple-600 to-pink-600 
                        hover:from-purple-700 hover:via-purple-700 hover:to-pink-700
                        text-white border-0 rounded-xl
                        shadow-lg hover:shadow-xl hover:shadow-purple-500/25
                        transition-all duration-300
                        font-semibold text-base
                        group/btn overflow-hidden
                      "
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                      <ShoppingCart className="w-5 h-5 mr-2 group-hover/btn:scale-110 transition-transform duration-200" />
                      Thêm vào giỏ hàng
                      <CheckCircle className="w-5 h-5 ml-2 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200" />
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
