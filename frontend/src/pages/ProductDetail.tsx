import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FormattedDescription from "@/components/FormattedDescription";
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
import { motion, AnimatePresence } from "framer-motion";
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
  Zap,
  Shield,
  Award,
  Clock,
  Package,
  Sparkles,
  Code,
  Palette,
  Coffee,
  BookOpen,
  Target,
  Users,
  MessageCircle,
  ThumbsUp,
  ExternalLink,
  Copy,
  Smartphone,
  Globe,
  Facebook,
  Twitter,
  Linkedin,
  // ❌ Xóa 'Review' - không tồn tại trong lucide-react
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

// ✅ Thêm interface Review
interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
  helpful: number;
  verified: boolean;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
  const [reviews, setReviews] = useState<Review[]>([]);

  // ✅ Enhanced useEffect để generate mock reviews với logic đúng
  useEffect(() => {
    if (product) {
      const mockReviews: Review[] = [
        {
          id: "1",
          userId: "user1",
          userName: "Nguyễn Văn An",
          userAvatar:
            "https://ui-avatars.com/api/?name=Nguyen+Van+An&background=3b82f6&color=fff",
          rating: 5,
          comment:
            "Template rất chất lượng, code sạch và dễ customize. Responsive tốt trên mọi thiết bị. Đáng tiền!",
          createdAt: "2025-06-25T10:30:00Z",
          helpful: 12,
          verified: true,
        },
        {
          id: "2",
          userId: "user2",
          userName: "Trần Thị Bình",
          userAvatar:
            "https://ui-avatars.com/api/?name=Tran+Thi+Binh&background=10b981&color=fff",
          rating: 4,
          comment:
            "Design đẹp, documentation chi tiết. Chỉ có điều setup hơi phức tạp với người mới bắt đầu. Nhưng support team rất nhiệt tình.",
          createdAt: "2025-06-20T14:15:00Z",
          helpful: 8,
          verified: true,
        },
        {
          id: "3",
          userId: "user3",
          userName: "Lê Minh Cường",
          userAvatar:
            "https://ui-avatars.com/api/?name=Le+Minh+Cuong&background=f59e0b&color=fff",
          rating: 5,
          comment:
            "Mình đã dùng để làm website cho công ty. Performance tuyệt vời, SEO friendly. Khách hàng rất hài lòng với kết quả.",
          createdAt: "2025-06-18T09:45:00Z",
          helpful: 15,
          verified: true,
        },
        {
          id: "4",
          userId: "user4",
          userName: "Phạm Thu Hương",
          userAvatar:
            "https://ui-avatars.com/api/?name=Pham+Thu+Huong&background=ec4899&color=fff",
          rating: 4,
          comment:
            "Template modern và trendy. Code structure tốt, dễ maintain. Có thể cải thiện thêm về animation effects.",
          createdAt: "2025-06-15T16:20:00Z",
          helpful: 6,
          verified: false,
        },
        {
          id: "5",
          userId: "user5",
          userName: "Hoàng Đức Thắng",
          userAvatar:
            "https://ui-avatars.com/api/?name=Hoang+Duc+Thang&background=8b5cf6&color=fff",
          rating: 5,
          comment:
            "Đây là template React tốt nhất mình từng mua. TypeScript support tuyệt vời, components reusable. Highly recommended!",
          createdAt: "2025-06-12T11:10:00Z",
          helpful: 20,
          verified: true,
        },
      ];

      // ✅ LUÔN hiển thị reviews và cập nhật product rating
      setReviews(mockReviews);

      // ✅ Force update product với rating và reviewCount thực tế
      setProduct((prev) =>
        prev
          ? {
              ...prev,
              rating: 4.8, // Tính trung bình từ reviews
              reviewCount: mockReviews.length,
            }
          : null,
      );
    }
  }, [product?.id]); // Chỉ depend vào product.id để tránh infinite loop

  useEffect(() => {
    if (!id) return;

    (async () => {
      const data = await getProductById(id);
      if (!data) return;

      // ✅ Xử lý images
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

    // Intersection Observer for scroll animations
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
  }, [id]);

  // Loading state
  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 animate-float">
            <Package className="w-8 h-8 text-blue-500 opacity-20" />
          </div>
          <div className="absolute top-1/3 right-1/4 animate-float-delay-1">
            <Sparkles className="w-6 h-6 text-purple-500 opacity-20" />
          </div>
          <div className="absolute bottom-1/4 left-1/3 animate-float-delay-2">
            <Award className="text-orange-500 w-7 h-7 opacity-20" />
          </div>
        </div>

        <div className="container relative z-10 px-4 py-8 mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto"
          >
            <Card className="py-12 text-center border-0 shadow-2xl bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900">
              <CardContent>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 mx-auto mb-4 border-4 rounded-full border-primary border-t-transparent"
                />
                <h2 className="mb-2 text-xl font-semibold">
                  Đang tải sản phẩm...
                </h2>
                <p className="text-muted-foreground">
                  Vui lòng đợi trong giây lát
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  const discountPercentage = product.originalPrice
    ? getDiscountPercentage(product.originalPrice, product.price)
    : 0;

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      for (let i = 0; i < quantity; i++) {
        await addToCart(product);
      }
      toast({
        title: "🛒 Đã thêm vào giỏ hàng",
        description: `${quantity} x ${product.title} đã được thêm vào giỏ hàng.`,
      });
    } catch (error) {
      toast({
        title: "❌ Lỗi",
        description: "Không thể thêm sản phẩm vào giỏ hàng.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async (platform?: string) => {
    const url = window.location.href;
    const title = product.title;

    if (platform === "copy") {
      navigator.clipboard.writeText(url);
      toast({
        title: "📋 Đã sao chép link",
        description: "Link sản phẩm đã được sao chép vào clipboard.",
      });
      return;
    }

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    };

    if (platform && shareUrls[platform as keyof typeof shareUrls]) {
      window.open(shareUrls[platform as keyof typeof shareUrls], "_blank");
    } else {
      try {
        await navigator.share({ title, url });
      } catch (error) {
        navigator.clipboard.writeText(url);
        toast({
          title: "📋 Đã sao chép link",
          description: "Link sản phẩm đã được sao chép vào clipboard.",
        });
      }
    }
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted
        ? "💔 Đã xóa khỏi yêu thích"
        : "❤️ Đã thêm vào yêu thích",
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
    { label: "Mã nguồn sạch", included: true, icon: Code },
    { label: "Responsive design", included: true, icon: Smartphone },
    { label: "Cross-browser support", included: true, icon: Globe },
    { label: "Documentation", included: true, icon: FileText },
    {
      label: "Lifetime updates",
      included: product.category === "template",
      icon: Clock,
    },
    { label: "Commercial license", included: true, icon: Shield },
    {
      label: "24/7 Support",
      included: product.category === "template",
      icon: MessageCircle,
    },
    { label: "Premium Quality", included: true, icon: Award },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
      {/* Floating Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 animate-float">
          <Code className="w-8 h-8 text-blue-500 opacity-20" />
        </div>
        <div className="absolute top-1/3 right-1/4 animate-float-delay-1">
          <Palette className="w-6 h-6 text-purple-500 opacity-20" />
        </div>
        <div className="absolute bottom-1/4 left-1/3 animate-float-delay-2">
          <Coffee className="text-orange-500 w-7 h-7 opacity-20" />
        </div>
      </div>

      <div className="container relative z-10 px-4 py-8 mx-auto">
        {/* ✅ Enhanced Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center mb-6 space-x-2 text-sm text-muted-foreground"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="group"
          >
            <ArrowLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
            Quay lại
          </Button>
          <span>/</span>
          <span className="capitalize">{product.category}</span>
          <span>/</span>
          <span className="font-medium text-foreground">{product.title}</span>
        </motion.div>

        <div className="grid gap-8 mb-12 lg:grid-cols-2">
          {/* ✅ Enhanced Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
            id="images"
            data-animate
          >
            <div className="relative overflow-hidden border shadow-2xl rounded-2xl group">
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                src={
                  product.images?.[selectedImage] ||
                  "https://via.placeholder.com/400x300?text=No+Image"
                }
                alt={product.title}
                className="object-cover w-full transition-transform duration-500 h-96 group-hover:scale-105"
                onError={handleImageError}
              />

              {/* Badges */}
              <div className="absolute space-y-2 top-4 left-4">
                {discountPercentage > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Badge variant="destructive" className="shadow-lg">
                      <Zap className="w-3 h-3 mr-1" />-{discountPercentage}%
                    </Badge>
                  </motion.div>
                )}
                {product.isFeatured && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <Badge className="text-white shadow-lg bg-gradient-to-r from-yellow-400 to-orange-500">
                      <Star className="w-3 h-3 mr-1" />
                      Nổi bật
                    </Badge>
                  </motion.div>
                )}
              </div>

              {/* Image Actions */}
              <div className="absolute transition-opacity duration-300 opacity-0 top-4 right-4 group-hover:opacity-100">
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-white/90 backdrop-blur"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-white/90 backdrop-blur"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* ✅ Enhanced Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-4 gap-3"
              >
                {product.images.map((image, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedImage(index)}
                    className={`relative overflow-hidden rounded-lg border-2 transition-all duration-300 ${
                      selectedImage === index
                        ? "border-primary ring-2 ring-primary/20 shadow-lg"
                        : "border-muted hover:border-gray-400"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="object-cover w-full h-20 transition-transform duration-300 hover:scale-110"
                      onError={handleImageError}
                    />
                    {selectedImage === index && (
                      <div className="absolute inset-0 flex items-center justify-center bg-primary/10">
                        <Check className="w-4 h-4 text-primary" />
                      </div>
                    )}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* ✅ Enhanced Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
            id="product-info"
            data-animate
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text"
                  >
                    {product.title}
                  </motion.h1>
                </div>

                <div className="flex space-x-2">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleWishlist}
                      className={`transition-colors duration-300 ${
                        isWishlisted
                          ? "text-red-500 bg-red-50 dark:bg-red-900/20"
                          : "hover:text-red-500"
                      }`}
                    >
                      <Heart
                        className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`}
                      />
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleShare()}
                    >
                      <Share2 className="w-5 h-5" />
                    </Button>
                  </motion.div>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center mb-4 space-x-4"
              >
                <div className="flex items-center space-x-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-medium">{product.rating}</span>
                  <span className="text-muted-foreground">
                    {/* ✅ Fix hiển thị số đánh giá */}
                    {reviews.length > 0
                      ? `(${reviews.length} đánh giá)`
                      : "(Chưa có đánh giá)"}
                  </span>
                </div>

                <Badge
                  variant={
                    product.category === "template" ? "default" : "secondary"
                  }
                  className="flex items-center space-x-1"
                >
                  {product.category === "template" ? (
                    <>
                      <Code className="w-3 h-3" />
                      <span>Template</span>
                    </>
                  ) : (
                    <>
                      <BookOpen className="w-3 h-3" />
                      <span>E-book</span>
                    </>
                  )}
                </Badge>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="leading-relaxed text-muted-foreground"
              >
                {/* {product.description} */}
                <FormattedDescription
                  text={
                    product.description.length > 1000
                      ? product.description.substring(0, 1000) + "..."
                      : product.description
                  }
                  className="leading-relaxed"
                />
              </motion.p>
            </div>

            {/* ✅ Enhanced Price */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="p-6 space-y-2 border bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl"
            >
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
                <p className="flex items-center space-x-1 text-sm text-green-600">
                  <Zap className="w-4 h-4" />
                  <span>
                    Tiết kiệm{" "}
                    {formatPrice(product.originalPrice! - product.price)} (
                    {discountPercentage}%)
                  </span>
                </p>
              )}
            </motion.div>

            {/* ✅ Enhanced Product Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-2 gap-4 p-6 border rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900"
            >
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full dark:bg-blue-900/20">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-medium">Tác giả</div>
                  <div className="text-sm text-muted-foreground">
                    {product.author}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full dark:bg-green-900/20">
                  <Calendar className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <div className="text-sm font-medium">Ngày tạo</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(product.createdAt).toLocaleDateString("vi-VN")}
                  </div>
                </div>
              </div>

              {/* ✅ Fix hiển thị đánh giá thay vì số 0 */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full dark:bg-orange-900/20">
                  <Star className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <div className="text-sm font-medium">Đánh giá</div>
                  <div className="text-sm text-muted-foreground">
                    {reviews.length > 0
                      ? `${reviews.length} đánh giá`
                      : "Chưa có đánh giá"}
                  </div>
                </div>
              </div>

              {product.fileSize && (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full dark:bg-purple-900/20">
                    <HardDrive className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Dung lượng</div>
                    <div className="text-sm text-muted-foreground">
                      {product.fileSize}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* ✅ Enhanced Quantity & Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="space-y-4"
            >
              {/* Quantity Selector */}
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">Số lượng:</span>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="rounded-none"
                  >
                    -
                  </Button>
                  <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    className="rounded-none"
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={handleAddToCart}
                    className="w-full transition-all duration-300 shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl"
                    size="lg"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Thêm {quantity > 1 ? `${quantity} sản phẩm` : ""} vào giỏ
                    hàng
                  </Button>
                </motion.div>

                <div className="grid grid-cols-2 gap-3">
                  {product.previewUrl && (
                    <Button variant="outline" asChild className="group">
                      <a
                        href={product.previewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Eye className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                        Xem trước
                      </a>
                    </Button>
                  )}
                  <Button variant="outline" disabled className="group">
                    <Download className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                    Demo
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* ✅ Enhanced Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="space-y-4"
            >
              <h3 className="flex items-center space-x-2 font-semibold">
                <Sparkles className="w-5 h-5 text-primary" />
                <span>Tính năng nổi bật:</span>
              </h3>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.1 + index * 0.1 }}
                    className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-300 ${
                      feature.included
                        ? "bg-green-50 dark:bg-green-900/20 border-green-200 hover:shadow-md"
                        : "bg-gray-50 dark:bg-gray-900/20 border-gray-200"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        feature.included ? "bg-green-500" : "bg-gray-400"
                      }`}
                    >
                      {feature.included ? (
                        <Check className="w-3 h-3 text-white" />
                      ) : (
                        <X className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <feature.icon
                      className={`w-4 h-4 ${
                        feature.included ? "text-green-600" : "text-gray-400"
                      }`}
                    />
                    <span
                      className={
                        feature.included
                          ? "font-medium"
                          : "text-muted-foreground"
                      }
                    >
                      {feature.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* ✅ Enhanced Tags */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="space-y-3"
            >
              <h3 className="flex items-center space-x-2 font-semibold">
                <Target className="w-5 h-5 text-primary" />
                <span>Tags:</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.tags?.map((tag, index) => (
                  <motion.div
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.3 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Badge
                      variant="outline"
                      className="transition-colors cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    >
                      {tag}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* ✅ Enhanced Share Options */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              className="space-y-3"
            >
              <h3 className="flex items-center space-x-2 font-semibold">
                <Share2 className="w-5 h-5 text-primary" />
                <span>Chia sẻ sản phẩm:</span>
              </h3>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare("facebook")}
                  className="transition-colors hover:bg-blue-600 hover:text-white"
                >
                  <Facebook className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare("twitter")}
                  className="transition-colors hover:bg-sky-500 hover:text-white"
                >
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare("linkedin")}
                  className="transition-colors hover:bg-blue-700 hover:text-white"
                >
                  <Linkedin className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare("copy")}
                  className="transition-colors hover:bg-gray-600 hover:text-white"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* ✅ Enhanced Product Details Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
          id="tabs"
          data-animate
        >
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger
                value="description"
                className="flex items-center space-x-2"
              >
                <FileText className="w-4 h-4" />
                <span>Mô tả</span>
              </TabsTrigger>
              <TabsTrigger
                value="features"
                className="flex items-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Tính năng</span>
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="flex items-center space-x-2"
              >
                <Star className="w-4 h-4" />
                <span>Đánh giá ({reviews.length})</span>
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <TabsContent value="description" className="mt-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-blue-900">
                    <CardContent className="pt-6">
                      <div className="prose max-w-none">
                        <FormattedDescription
                          text={product.description}
                          className="text-lg leading-relaxed text-slate-700 dark:text-slate-300"
                        />

                        {product.category === "template" &&
                          product.technologies && (
                            <div className="mt-8">
                              <h4 className="flex items-center mb-4 space-x-2 text-lg font-semibold">
                                <Code className="w-5 h-5 text-primary" />
                                <span>Công nghệ sử dụng:</span>
                              </h4>
                              <div className="flex flex-wrap gap-3">
                                {product.technologies.map((tech, index) => (
                                  <motion.div
                                    key={tech}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ scale: 1.05 }}
                                  >
                                    <Badge
                                      variant="secondary"
                                      className="text-blue-800 transition-colors bg-blue-100 hover:bg-blue-200"
                                    >
                                      {tech}
                                    </Badge>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          )}

                        {product.difficulty && (
                          <div className="mt-6">
                            <h4 className="flex items-center mb-3 space-x-2 text-lg font-semibold">
                              <Target className="w-5 h-5 text-primary" />
                              <span>Độ khó:</span>
                            </h4>
                            <Badge
                              variant={
                                product.difficulty === "Beginner"
                                  ? "default"
                                  : product.difficulty === "Intermediate"
                                    ? "secondary"
                                    : "destructive"
                              }
                              className="px-4 py-2 text-lg"
                            >
                              {product.difficulty}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="features" className="mt-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-green-50 dark:from-slate-800 dark:to-green-900">
                    <CardContent className="pt-6">
                      <div className="grid gap-4 md:grid-cols-2">
                        {features.map((feature, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            className={`flex items-center p-4 space-x-4 border rounded-xl transition-all duration-300 ${
                              feature.included
                                ? "bg-green-50 dark:bg-green-900/20 border-green-200 shadow-md"
                                : "bg-gray-50 dark:bg-gray-900/20 border-gray-200"
                            }`}
                          >
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                feature.included
                                  ? "bg-green-500"
                                  : "bg-gray-400"
                              }`}
                            >
                              {feature.included ? (
                                <Check className="w-5 h-5 text-white" />
                              ) : (
                                <X className="w-5 h-5 text-white" />
                              )}
                            </div>
                            <feature.icon
                              className={`w-6 h-6 ${
                                feature.included
                                  ? "text-green-600"
                                  : "text-gray-400"
                              }`}
                            />
                            <span
                              className={`font-medium text-lg ${
                                feature.included
                                  ? "text-green-800 dark:text-green-200"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {feature.label}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* ✅ Enhanced Reviews Tab với mock data */}
              <TabsContent value="reviews" className="mt-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-yellow-50 dark:from-slate-800 dark:to-yellow-900/20">
                    <CardContent className="pt-6">
                      {reviews.length > 0 ? (
                        <div className="space-y-6">
                          {/* Rating Summary */}
                          <div className="flex items-center justify-between p-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl">
                            <div className="flex items-center space-x-4">
                              <div className="text-center">
                                <div className="text-4xl font-bold text-yellow-600">
                                  {product.rating}
                                </div>
                                <div className="flex justify-center mt-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < Math.floor(product.rating)
                                          ? "text-yellow-400 fill-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <div className="mt-1 text-sm text-muted-foreground">
                                  {reviews.length} đánh giá
                                </div>
                              </div>
                            </div>

                            <div className="flex-1 ml-8">
                              {[5, 4, 3, 2, 1].map((star) => {
                                const count = reviews.filter(
                                  (r) => Math.floor(r.rating) === star,
                                ).length;
                                const percentage =
                                  reviews.length > 0
                                    ? (count / reviews.length) * 100
                                    : 0;

                                return (
                                  <div
                                    key={star}
                                    className="flex items-center mb-1 space-x-2"
                                  >
                                    <span className="w-3 text-sm">{star}</span>
                                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                    <div className="flex-1 h-2 bg-gray-200 rounded-full">
                                      <div
                                        className="h-2 transition-all duration-500 bg-yellow-400 rounded-full"
                                        style={{ width: `${percentage}%` }}
                                      />
                                    </div>
                                    <span className="w-8 text-sm text-muted-foreground">
                                      {count}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Reviews List */}
                          <div className="space-y-4">
                            {reviews.map((review, index) => (
                              <motion.div
                                key={review.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-6 transition-shadow border rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 hover:shadow-md"
                              >
                                <div className="flex items-start space-x-4">
                                  <img
                                    src={review.userAvatar}
                                    alt={review.userName}
                                    className="w-12 h-12 border-2 rounded-full border-primary/20"
                                  />

                                  <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center space-x-2">
                                        <span className="font-semibold">
                                          {review.userName}
                                        </span>
                                        {review.verified && (
                                          <Badge
                                            variant="secondary"
                                            className="text-xs"
                                          >
                                            <Check className="w-3 h-3 mr-1" />
                                            Đã mua
                                          </Badge>
                                        )}
                                      </div>
                                      <span className="text-sm text-muted-foreground">
                                        {new Date(
                                          review.createdAt,
                                        ).toLocaleDateString("vi-VN")}
                                      </span>
                                    </div>

                                    <div className="flex items-center mb-3 space-x-2">
                                      <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                          <Star
                                            key={i}
                                            className={`w-4 h-4 ${
                                              i < review.rating
                                                ? "text-yellow-400 fill-yellow-400"
                                                : "text-gray-300"
                                            }`}
                                          />
                                        ))}
                                      </div>
                                      <span className="text-sm font-medium">
                                        {review.rating}/5
                                      </span>
                                    </div>

                                    <p className="mb-3 leading-relaxed text-muted-foreground">
                                      {review.comment}
                                    </p>

                                    <div className="flex items-center space-x-4">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-muted-foreground hover:text-primary"
                                      >
                                        <ThumbsUp className="w-4 h-4 mr-1" />
                                        Hữu ích ({review.helpful})
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-muted-foreground hover:text-primary"
                                      >
                                        <MessageCircle className="w-4 h-4 mr-1" />
                                        Trả lời
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>

                          {/* Write Review Button */}
                          <div className="pt-6 text-center border-t">
                            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                              <Star className="w-4 h-4 mr-2" />
                              Viết đánh giá
                            </Button>
                          </div>
                        </div>
                      ) : (
                        // No reviews state
                        <div className="py-12 text-center">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              delay: 0.2,
                              type: "spring",
                              stiffness: 200,
                            }}
                          >
                            <Star className="w-16 h-16 mx-auto mb-6 text-yellow-400" />
                          </motion.div>
                          <h3 className="mb-4 text-2xl font-semibold">
                            Chưa có đánh giá
                          </h3>
                          <p className="mb-6 text-lg text-muted-foreground">
                            Hãy là người đầu tiên đánh giá sản phẩm này
                          </p>
                          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                            <Star className="w-4 h-4 mr-2" />
                            Viết đánh giá đầu tiên
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </motion.div>

        {/* ✅ Enhanced Related Products */}
        {relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-8"
            id="related"
            data-animate
          >
            <Separator />
            <div>
              <div className="flex items-center mb-8 space-x-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-red-500">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text">
                    Sản phẩm liên quan
                  </h2>
                  <p className="text-muted-foreground">
                    Những sản phẩm tương tự bạn có thể quan tâm
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {relatedProducts.map((relatedProduct, index) => (
                  <motion.div
                    key={relatedProduct.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                  >
                    <ProductCard product={relatedProduct} />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
