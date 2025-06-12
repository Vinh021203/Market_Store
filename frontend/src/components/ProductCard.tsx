import React from "react";
import { Link } from "react-router-dom";
import { Product } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { formatPrice, getDiscountPercentage } from "@/lib/products";
import { Star, ShoppingCart, Eye, Download, BookOpen } from "lucide-react";

interface ProductCardProps {
  product: Product;
  showAddToCart?: boolean;
  onAddToCart?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  showAddToCart = true,
  onAddToCart,
}) => {
  const { addToCart } = useCart();

  const discountPercentage = product.originalPrice
    ? getDiscountPercentage(product.originalPrice, product.price)
    : 0;

  return (
    <Card className="h-full transition-all duration-200 group hover:shadow-lg">
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
            <Button
              onClick={() => {
                if (onAddToCart) {
                  onAddToCart();
                } else {
                  addToCart(product);
                }
              }}
              className="w-full"
              size="sm"
            >
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
