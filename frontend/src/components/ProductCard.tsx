import React from "react";
import { Link } from "react-router-dom";
import { Product } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { formatPrice, getDiscountPercentage } from "@/lib/products";
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
  viewMode?: "grid" | "list"; // ✅ Thêm viewMode prop
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  showAddToCart = true,
  onAddToCart,
  viewMode = "grid", // ✅ Default value
}) => {
  const { addToCart } = useCart();

  const discountPercentage = product.originalPrice
    ? getDiscountPercentage(product.originalPrice, product.price)
    : 0;

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart();
    } else {
      addToCart(product);
    }
  };

  // ✅ List View Layout
  if (viewMode === "list") {
    return (
      <Card className="transition-all duration-300 border-0 hover:shadow-lg group bg-gradient-to-r from-white to-gray-50 dark:from-slate-800 dark:to-slate-900">
        <CardContent className="p-6">
          <div className="flex gap-6">
            {/* Image Section */}
            <div className="relative flex-shrink-0 w-48 h-32 overflow-hidden rounded-lg">
              <img
                src={product.image}
                alt={product.title}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              />

              {/* Overlay Actions */}
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

              {/* Badges */}
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
            <div className="flex-1 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="mb-2 text-xl font-bold transition-colors line-clamp-2 group-hover:text-primary">
                    <Link to={`/product/${product.id}`}>{product.title}</Link>
                  </h3>

                  <p className="mb-3 text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>

                  {/* Rating */}
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

                  {/* Tags */}
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

                  {/* Author */}
                  {product.author && (
                    <p className="text-sm text-muted-foreground">
                      Tác giả:{" "}
                      <span className="font-medium">{product.author}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Price and Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="space-y-1">
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

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Heart className="w-4 h-4" />
                  </Button>
                  {showAddToCart && (
                    <Button onClick={handleAddToCart} className="group">
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
    );
  }

  // ✅ Grid View Layout (Default)
  return (
    <Card className="h-full transition-all duration-200 border-0 group hover:shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900">
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
            variant={product.category === "template" ? "default" : "secondary"}
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

      <CardContent className="flex-1 p-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold transition-colors line-clamp-2 group-hover:text-primary">
            <Link to={`/product/${product.id}`}>{product.title}</Link>
          </h3>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="ml-1 text-sm">{product.rating}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              ({product.reviewCount} đánh giá)
            </span>
          </div>

          <div className="flex flex-wrap gap-1">
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
  );
};

export default ProductCard;
