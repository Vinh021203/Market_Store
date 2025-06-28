import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { Product } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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
  const {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    getTotalWishlistItems,
  } = useWishlist();

  // ✅ Force re-render state
  const [renderKey, setRenderKey] = useState(0);

  // ✅ Listen to wishlist changes
  useEffect(() => {
    const handleWishlistUpdate = () => {
      setRenderKey((prev) => prev + 1);
    };

    window.addEventListener("wishlistUpdated", handleWishlistUpdate);
    return () => {
      window.removeEventListener("wishlistUpdated", handleWishlistUpdate);
    };
  }, []);

  // ✅ Memoize wishlist status với dependency on renderKey
  const isProductInWishlist = useMemo(() => {
    return isInWishlist(product.id);
  }, [product.id, wishlist.length, renderKey, isInWishlist]);

  // ✅ Debug logging
  useEffect(() => {
    console.log(`ProductCard ${product.id}: wishlist status changed`, {
      isInWishlist: isProductInWishlist,
      wishlistLength: wishlist.length,
      renderKey,
    });
  }, [product.id, isProductInWishlist, wishlist.length, renderKey]);

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

  // ✅ Enhanced wishlist toggle handler
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

      // ✅ Force immediate re-render
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

  const cardAnimationProps = {
    initial: { opacity: 0, y: 50 },
    animate: isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 },
    transition: {
      duration: 0.5,
      delay: parseFloat(animationDelay.replace("ms", "")) / 1000,
    },
    whileHover: {
      y: -5,
      boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
      scale: 1.01,
    },
    className: `transition-all duration-300 border-0 group bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 ${isVisible ? "block" : "hidden"}`,
  };

  // ✅ Wishlist Button Component
  const WishlistButton = ({ size = "sm" as const, className = "" }) => (
    <Button
      variant={isProductInWishlist ? "default" : "outline"}
      size={size}
      onClick={handleToggleWishlist}
      className={`transition-all duration-200 ${
        isProductInWishlist
          ? "bg-red-500 hover:bg-red-600 text-white border-red-500" // ✅ Màu đỏ khi active
          : "group/btn border-gray-300 hover:border-red-500 hover:bg-red-50"
      } ${className}`}
      title={isProductInWishlist ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
    >
      <Heart
        className={`w-4 h-4 transition-all duration-200 ${
          isProductInWishlist
            ? "fill-current text-white" // ✅ Fill màu trắng khi active
            : "text-gray-500 group-hover/btn:text-red-500"
        }`}
      />
    </Button>
  );

  // ✅ List View Layout
  if (viewMode === "list") {
    return (
      <motion.div
        {...cardAnimationProps}
        className="h-full"
        key={`${product.id}-${renderKey}`}
      >
        <Card className="flex flex-col h-full">
          <CardContent className="flex flex-col justify-between flex-1 p-6">
            <div className="flex flex-col h-full gap-6 md:flex-row">
              {/* Image Section */}
              <div className="relative flex-shrink-0 w-full h-48 overflow-hidden rounded-lg md:w-48 md:h-32">
                <img
                  src={product.image}
                  alt={product.title}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center space-x-2 transition-opacity duration-200 opacity-0 bg-black/60 group-hover:opacity-100">
                  <Button size="sm" variant="secondary" asChild>
                    <Link to={`/product/${product.id}`}>
                      <Eye className="w-3 h-3" />
                    </Link>
                  </Button>
                  {product.previewUrl && (
                    <Button size="sm" variant="secondary" asChild>
                      <a
                        href={product.previewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Eye className="w-3 h-3" />
                      </a>
                    </Button>
                  )}
                </div>
                <div className="absolute top-2 left-2">
                  <Badge
                    variant={
                      product.category === "template" ? "default" : "secondary"
                    }
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
                    <Badge variant="destructive">-{discountPercentage}%</Badge>
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="flex flex-col justify-between flex-1 space-y-3">
                <div>
                  <h3 className="mb-2 text-xl font-bold transition-colors line-clamp-2 group-hover:text-primary">
                    <Link to={`/product/${product.id}`}>{product.title}</Link>
                  </h3>
                  <p className="mb-3 text-muted-foreground line-clamp-3">
                    {product.description}
                  </p>
                  <div className="flex items-center mb-3 space-x-2">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="ml-1 text-sm font-medium">
                        {product.rating}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({product.reviewCount} đánh giá)
                    </span>
                    {product.isFeatured && (
                      <Badge
                        variant="outline"
                        className="text-yellow-800 bg-yellow-100"
                      >
                        <Star className="w-3 h-3 mr-1" />
                        Nổi bật
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {product.tags.slice(0, 4).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
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
                    <p className="text-sm text-muted-foreground">
                      Tác giả:{" "}
                      <span className="font-medium">{product.author}</span>
                    </p>
                  )}
                </div>

                {/* Price and Actions */}
                <div className="flex flex-col items-start justify-between pt-4 border-t sm:flex-row sm:items-center">
                  <div className="mb-2 space-y-1 sm:mb-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-primary">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm line-through text-muted-foreground">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                    {product.fileSize && (
                      <p className="text-xs text-muted-foreground">
                        Dung lượng: {product.fileSize}
                      </p>
                    )}
                  </div>

                  <div className="flex w-full space-x-2 sm:w-auto">
                    <WishlistButton />
                    {showAddToCart && (
                      <Button
                        onClick={handleAddToCart}
                        className="flex-grow group"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Thêm vào giỏ
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // ✅ Grid View Layout (Default)
  return (
    <motion.div
      {...cardAnimationProps}
      className="h-full"
      key={`${product.id}-${renderKey}`}
    >
      <Card className="flex flex-col h-full">
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={product.image}
            alt={product.title}
            className="object-cover w-full h-48 transition-transform duration-200 group-hover:scale-105"
          />

          <div className="absolute inset-0 flex items-center justify-center space-x-2 transition-opacity duration-200 opacity-0 bg-black/60 group-hover:opacity-100">
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
                  <Eye className="w-4 h-4 mr-1" />
                  Preview
                </a>
              </Button>
            )}
          </div>

          <div className="absolute top-2 left-2">
            <Badge
              variant={
                product.category === "template" ? "default" : "secondary"
              }
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
              <Badge variant="destructive">-{discountPercentage}%</Badge>
            </div>
          )}

          {product.isFeatured && (
            <div className="absolute bottom-2 right-2">
              <Badge variant="outline" className="bg-white/90">
                <Star className="w-3 h-3 mr-1" />
                Nổi bật
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="flex flex-col justify-between flex-1 p-4">
          <div>
            <h3 className="text-lg font-semibold transition-colors line-clamp-2 group-hover:text-primary">
              <Link to={`/product/${product.id}`}>{product.title}</Link>
            </h3>

            <p className="mb-2 text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>

            <div className="flex items-center mb-2 space-x-2">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="ml-1 text-sm">{product.rating}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                ({product.reviewCount} đánh giá)
              </span>
            </div>

            <div className="flex flex-wrap gap-1 mb-2">
              {product.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {product.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{product.tags.length - 3}
                </Badge>
              )}
            </div>

            {product.author && (
              <p className="text-xs text-muted-foreground">
                Tác giả: {product.author}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <div className="w-full space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-primary">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm line-through text-muted-foreground">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
                {product.fileSize && (
                  <p className="text-xs text-muted-foreground">
                    Dung lượng: {product.fileSize}
                  </p>
                )}
              </div>
              <WishlistButton />
            </div>

            {showAddToCart && (
              <Button onClick={handleAddToCart} className="w-full" size="sm">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Thêm vào giỏ
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
