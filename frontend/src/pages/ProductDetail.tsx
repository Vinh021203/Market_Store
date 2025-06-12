import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types";
import { useCart } from "@/contexts/CartContext";
import {
  getProductById,
  getRelatedProducts,
  formatPrice,
  getDiscountPercentage,
} from "@/lib/products";
import {
  Star,
  ShoppingCart,
  Download,
  Eye,
  Share2,
  Heart,
  ArrowLeft,
  Check,
  X,
  User,
  Calendar,
  FileText,
  HardDrive,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!id) return;

    (async () => {
      const data = await getProductById(id);
      if (!data) return;

      // ✅ Xử lý images như ProductDetail
      if (typeof data.images === "string") {
        data.images = (data.images as string)
          .split(",")
          .map((t: string) => t.trim())
          .filter(Boolean);
      }
      if (!Array.isArray(data.images)) {
        data.images = [];
      }
      setProduct(data);

      const related = await getRelatedProducts(data);
      setRelatedProducts(related);
    })();
  }, [id]);

  // Loading state
  if (!product) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <Card className="py-12 text-center">
          <CardContent>
            <div className="w-12 h-12 mx-auto mb-4 bg-gray-200 rounded animate-pulse" />
            <h2 className="mb-2 text-xl font-semibold">Đang tải...</h2>
            <p className="text-muted-foreground">Vui lòng đợi trong giây lát</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const discountPercentage = product.originalPrice
    ? getDiscountPercentage(product.originalPrice, product.price)
    : 0;

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      await addToCart(product);
      toast({
        title: "Đã thêm vào giỏ hàng",
        description: "Sản phẩm đã được thêm vào giỏ hàng thành công.",
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể thêm sản phẩm",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product.title,
        text: product.description,
        url: window.location.href,
      });
    } catch (error) {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Đã sao chép link",
        description: "Link sản phẩm đã được sao chép vào clipboard.",
      });
    }
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? "Đã xóa khỏi yêu thích" : "Đã thêm vào yêu thích",
      description: isWishlisted
        ? "Sản phẩm đã được xóa khỏi danh sách yêu thích."
        : "Sản phẩm đã được thêm vào danh sách yêu thích.",
    });
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src =
      "https://via.placeholder.com/400x300?text=Image+Not+Found";
  };

  const features = [
    { label: "Mã nguồn sạch", included: true },
    { label: "Responsive design", included: true },
    { label: "Cross-browser support", included: true },
    { label: "Documentation", included: true },
    { label: "Lifetime updates", included: product.category === "template" },
    { label: "Commercial license", included: true },
  ];

  return (
    <div className="container px-4 py-8 mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center mb-6 space-x-2 text-sm text-muted-foreground">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          Quay lại
        </Button>
        <span>/</span>
        <span className="capitalize">{product.category}</span>
        <span>/</span>
        <span className="text-foreground">{product.title}</span>
      </div>

      <div className="grid gap-8 mb-12 lg:grid-cols-2">
        {/* ✅ Product Images - Giống hệt ProductDetail */}
        <div className="space-y-4">
          <div className="relative overflow-hidden border rounded-lg">
            <img
              src={
                product.images?.[selectedImage] ||
                "https://via.placeholder.com/400x300?text=No+Image"
              }
              alt={product.title}
              className="object-cover w-full h-96"
              onError={handleImageError}
            />

            {discountPercentage > 0 && (
              <Badge variant="destructive" className="absolute top-4 left-4">
                -{discountPercentage}%
              </Badge>
            )}
            {product.isFeatured && (
              <Badge
                variant="outline"
                className="absolute top-4 right-4 bg-white/90"
              >
                Nổi bật
              </Badge>
            )}
          </div>

          {/* ✅ Thumbnail Gallery - Giống hệt ProductDetail */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative overflow-hidden rounded border-2 transition-colors ${
                    selectedImage === index ? "border-primary" : "border-muted"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    className="object-cover w-full h-20"
                    onError={handleImageError}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-3xl font-bold">{product.title}</h1>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleWishlist}
                  className={isWishlisted ? "text-red-500" : ""}
                >
                  <Heart
                    className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`}
                  />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleShare}>
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="flex items-center mb-4 space-x-4">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="font-medium">{product.rating}</span>
                <span className="text-muted-foreground">
                  ({product.reviewCount} đánh giá)
                </span>
              </div>
              <Badge
                variant={
                  product.category === "template" ? "default" : "secondary"
                }
              >
                {product.category === "template" ? "Template" : "E-book"}
              </Badge>
            </div>

            <p className="leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-bold text-primary">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-lg line-through text-muted-foreground">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            {discountPercentage > 0 && (
              <p className="text-sm text-green-600">
                Tiết kiệm {formatPrice(product.originalPrice! - product.price)}{" "}
                ({discountPercentage}%)
              </p>
            )}
          </div>

          {/* Product Details */}
          <div className="grid grid-cols-2 gap-4 px-4 py-4 border rounded-lg">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">Tác giả: {product.author}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">
                {new Date(product.createdAt).toLocaleDateString("vi-VN")}
              </span>
            </div>
            {product.fileSize && (
              <div className="flex items-center space-x-2">
                <HardDrive className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Dung lượng: {product.fileSize}</span>
              </div>
            )}
            {product.pages && (
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{product.pages} trang</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button onClick={handleAddToCart} className="w-full" size="lg">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Thêm vào giỏ hàng
            </Button>

            <div className="grid grid-cols-2 gap-3">
              {product.previewUrl && (
                <Button variant="outline" asChild>
                  <a
                    href={product.previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Xem trước
                  </a>
                </Button>
              )}
              <Button variant="outline" disabled>
                <Download className="w-4 h-4 mr-2" />
                Demo
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-3">
            <h3 className="font-semibold">Tính năng:</h3>
            <div className="space-y-2">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  {feature.included ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <X className="w-4 h-4 text-muted-foreground" />
                  )}
                  <span
                    className={feature.included ? "" : "text-muted-foreground"}
                  >
                    {feature.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <h3 className="font-semibold">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {product.tags?.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <Tabs defaultValue="description" className="mb-12">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="description">Mô tả</TabsTrigger>
          <TabsTrigger value="features">Tính năng</TabsTrigger>
          <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="prose max-w-none">
                <p className="leading-relaxed">{product.description}</p>

                {product.category === "template" && (
                  <div className="mt-6">
                    <h4 className="mb-3 font-semibold">Công nghệ sử dụng:</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.technologies?.map((tech) => (
                        <Badge key={tech} variant="secondary">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {product.difficulty && (
                  <div className="mt-4">
                    <h4 className="mb-2 font-semibold">Độ khó:</h4>
                    <Badge
                      variant={
                        product.difficulty === "Beginner"
                          ? "default"
                          : product.difficulty === "Intermediate"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {product.difficulty}
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-4 md:grid-cols-2">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center p-3 space-x-3 border rounded-lg"
                  >
                    {feature.included ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <X className="w-5 h-5 text-muted-foreground" />
                    )}
                    <span
                      className={
                        feature.included
                          ? "font-medium"
                          : "text-muted-foreground"
                      }
                    >
                      {feature.label}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="py-8 text-center">
                <Star className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">
                  Đánh giá sản phẩm
                </h3>
                <p className="text-muted-foreground">
                  Tính năng đánh giá sẽ sớm được cập nhật
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6">
          <Separator />
          <div>
            <h2 className="mb-6 text-2xl font-bold">Sản phẩm liên quan</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
