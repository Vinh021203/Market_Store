import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FormattedDescription from "@/components/FormattedDescription";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
  Minus,
  Plus,
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
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Truck,
  RotateCcw,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

// ✅ Interface Review
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

  // ✅ Tất cả states cần thiết
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
  const [reviews, setReviews] = useState<Review[]>([]);
  const [features, setFeatures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ States cho Image Modal
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  // ✅ State cho expandable description
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  // ✅ Utility functions
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src =
      "https://via.placeholder.com/400x300?text=Image+Not+Found";
  };

  // ✅ Component Image Modal
  const ImageModal = () => (
    <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
      <DialogContent className="max-w-4xl p-0 bg-transparent border-none">
        <div className="relative">
          <motion.img
            key={modalImageIndex}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            src={product?.images?.[modalImageIndex]}
            alt={`${product?.title} - Chi tiết ${modalImageIndex + 1}`}
            className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            onError={handleImageError}
          />

          {/* Navigation arrows */}
          {product?.images && product.images.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="sm"
                className="absolute -translate-y-1/2 left-4 top-1/2 bg-white/90 backdrop-blur-sm"
                onClick={() =>
                  setModalImageIndex(
                    modalImageIndex > 0
                      ? modalImageIndex - 1
                      : product.images!.length - 1,
                  )
                }
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="absolute -translate-y-1/2 right-4 top-1/2 bg-white/90 backdrop-blur-sm"
                onClick={() =>
                  setModalImageIndex(
                    modalImageIndex < product.images!.length - 1
                      ? modalImageIndex + 1
                      : 0,
                  )
                }
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </>
          )}

          {/* Image counter */}
          <div className="absolute px-3 py-1 text-sm text-white -translate-x-1/2 rounded-full bottom-4 left-1/2 bg-black/70">
            {modalImageIndex + 1} / {product?.images?.length || 1}
          </div>

          {/* Close button */}
          <Button
            variant="secondary"
            size="sm"
            className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm"
            onClick={() => setIsImageModalOpen(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  // ✅ Component mô tả có thể mở rộng
  const ExpandableDescription = ({
    text,
    maxLength = 500,
  }: {
    text: string;
    maxLength?: number;
  }) => {
    const shouldTruncate = text.length > maxLength;
    const displayText =
      isDescriptionExpanded || !shouldTruncate
        ? text
        : text.substring(0, maxLength) + "...";

    return (
      <div className="space-y-3">
        <div className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          <FormattedDescription
            text={displayText}
            className="whitespace-pre-line"
          />
        </div>

        {shouldTruncate && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
            className="h-auto p-0 font-medium text-blue-600 hover:text-blue-700"
          >
            {isDescriptionExpanded ? (
              <>
                <ChevronUp className="w-4 h-4 mr-1" />
                Thu gọn
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-1" />
                Xem thêm
              </>
            )}
          </Button>
        )}
      </div>
    );
  };

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
      setIsLoading(false);

      const related = await getRelatedProducts(data);
      setRelatedProducts(related);

      // ✅ Set features từ data thực tế hoặc default
      const productFeatures = [
        { label: "Mã nguồn sạch", included: true, icon: Code },
        { label: "Responsive design", included: true, icon: Smartphone },
        { label: "Cross-browser support", included: true, icon: Globe },
        { label: "Documentation", included: true, icon: FileText },
        {
          label: "Lifetime updates",
          included: data.category === "template",
          icon: Clock,
        },
        { label: "Commercial license", included: true, icon: Shield },
        {
          label: "24/7 Support",
          included: data.category === "template",
          icon: MessageCircle,
        },
        { label: "Premium Quality", included: true, icon: Award },
      ];
      setFeatures(productFeatures);
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

  // ✅ Event handlers
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
    const title = product?.title || "";

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

  // Loading state
  if (isLoading || !product) {
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

        {/* ✅ Main Product Section với layout 60-40 */}
        <div className="grid gap-8 mb-12 lg:grid-cols-5">
          {/* ✅ Cột trái: Hình ảnh (3/5) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4 lg:col-span-3"
            id="images"
            data-animate
          >
            {/* Main Image với tính năng phóng to */}
            <div className="relative overflow-hidden bg-white border shadow-lg rounded-2xl group">
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                src={
                  product.images?.[selectedImage] ||
                  "https://via.placeholder.com/600x400?text=No+Image"
                }
                alt={product.title}
                className="object-cover w-full transition-transform duration-500 aspect-[4/3] group-hover:scale-105 cursor-zoom-in"
                onError={handleImageError}
                onClick={() => {
                  setModalImageIndex(selectedImage);
                  setIsImageModalOpen(true);
                }}
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

              {/* ✅ Quick Actions với tính năng phóng to */}
              <div className="absolute transition-opacity duration-300 opacity-0 top-4 right-4 group-hover:opacity-100">
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-white/90 backdrop-blur hover:bg-white"
                    onClick={() => {
                      setModalImageIndex(selectedImage);
                      setIsImageModalOpen(true);
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  {product.previewUrl && (
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-white/90 backdrop-blur hover:bg-white"
                      asChild
                    >
                      <a
                        href={product.previewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              {/* Zoom indicator */}
              <div className="absolute transition-opacity opacity-0 bottom-4 right-4 group-hover:opacity-100">
                <div className="flex items-center px-2 py-1 space-x-1 text-xs text-white rounded bg-black/70">
                  <Eye className="w-3 h-3" />
                  <span>Click để phóng to</span>
                </div>
              </div>
            </div>

            {/* ✅ Thumbnails với tính năng phóng to */}
            {product.images && product.images.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-4 gap-3"
              >
                {product.images.map((image, index) => (
                  <div key={`thumb-${index}`} className="relative group">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedImage(index)}
                      className={`relative overflow-hidden rounded-lg border-2 transition-all duration-300 w-full ${
                        selectedImage === index
                          ? "border-blue-500 ring-2 ring-blue-200 shadow-lg"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.title} ${index + 1}`}
                        className="object-cover w-full h-20 transition-transform duration-300"
                        onError={handleImageError}
                      />
                      {selectedImage === index && (
                        <div className="absolute inset-0 flex items-center justify-center bg-blue-500/10">
                          <Check className="w-4 h-4 text-blue-600" />
                        </div>
                      )}
                    </motion.button>

                    {/* ✅ Nút phóng to cho thumbnail */}
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute w-6 h-6 p-0 transition-opacity opacity-0 top-1 right-1 group-hover:opacity-100 bg-white/90 backdrop-blur-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setModalImageIndex(index);
                        setIsImageModalOpen(true);
                      }}
                    >
                      <Eye className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </motion.div>
            )}

            {/* ✅ THÊM: Tính năng nổi bật ở dưới hình ảnh */}
            <Card className="bg-white border shadow-sm">
              <CardContent className="p-6">
                <h3 className="flex items-center mb-4 text-lg font-semibold">
                  <Sparkles className="w-5 h-5 mr-2 text-blue-600" />
                  Tính năng nổi bật
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {features.slice(0, 6).map((feature, index) => (
                    <motion.div
                      key={`feature-${index}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className={`flex items-center space-x-2 p-2 rounded-lg transition-all ${
                        feature.included
                          ? "bg-green-50 text-green-800 border border-green-200"
                          : "bg-gray-50 text-gray-600 border border-gray-200"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          feature.included ? "bg-green-500" : "bg-gray-400"
                        }`}
                      >
                        {feature.included ? (
                          <Check className="w-3 h-3 text-white" />
                        ) : (
                          <X className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <span className="text-sm font-medium">
                        {feature.label}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* ✅ Cột phải: Thông tin sản phẩm (2/5) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6 lg:col-span-2"
            id="product-info"
            data-animate
          >
            {/* Header - Compact */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-2xl font-bold leading-tight text-gray-900 dark:text-gray-100"
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
                        key={`star-${i}`}
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

              {/* ✅ Description với tính năng expand/collapse */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <ExpandableDescription
                  text={product.description}
                  maxLength={300}
                />
              </motion.div>
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

            {/* Technologies & Tags - Compact */}
            <Card>
              <CardContent className="p-6 space-y-4">
                {/* Technologies */}
                {product.technologies && (
                  <div>
                    <h4 className="flex items-center mb-2 text-sm font-medium">
                      <Code className="w-4 h-4 mr-2 text-blue-600" />
                      Công nghệ
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {product.technologies.slice(0, 4).map((tech, index) => (
                        <Badge
                          key={`tech-${tech}`}
                          variant="secondary"
                          className="px-2 py-1 text-xs"
                        >
                          {tech}
                        </Badge>
                      ))}
                      {product.technologies.length > 4 && (
                        <Badge variant="outline" className="px-2 py-1 text-xs">
                          +{product.technologies.length - 4} khác
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {product.tags && (
                  <div>
                    <h4 className="flex items-center mb-2 text-sm font-medium">
                      <Target className="w-4 h-4 mr-2 text-green-600" />
                      Tags
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {product.tags.slice(0, 6).map((tag, index) => (
                        <Badge
                          key={`tag-${tag}`}
                          variant="outline"
                          className="px-2 py-1 text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {product.tags.length > 6 && (
                        <Badge variant="outline" className="px-2 py-1 text-xs">
                          +{product.tags.length - 6} khác
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

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
                    <Minus className="w-4 h-4" />
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
                    <Plus className="w-4 h-4" />
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

            {/* Trust Signals */}
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center space-x-3">
                    <Truck className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">Miễn phí vận chuyển</p>
                      <p className="text-xs text-gray-500">
                        Đơn hàng từ 200.000đ
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">Bảo hành chính hãng</p>
                      <p className="text-xs text-gray-500">12 tháng bảo hành</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RotateCcw className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="text-sm font-medium">Đổi trả dễ dàng</p>
                      <p className="text-xs text-gray-500">Trong vòng 7 ngày</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Share Options - Compact */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Chia sẻ:</span>
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
                </div>
              </CardContent>
            </Card>
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
                  key="description-content"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-blue-900">
                    <CardContent className="pt-6">
                      <div className="prose max-w-none dark:prose-invert">
                        <h3 className="mb-4 text-xl font-bold">
                          Mô tả chi tiết
                        </h3>
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
                  key="features-content"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-green-50 dark:from-slate-800 dark:to-green-900">
                    <CardContent className="pt-6">
                      <div className="grid gap-4 md:grid-cols-2">
                        {features.map((feature, index) => (
                          <motion.div
                            key={`feature-detail-${index}`}
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
                  key="reviews-content"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
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
                        <div className="py-12 text-center">
                          <div className="max-w-md mx-auto">
                            <Star className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                            <h3 className="mb-2 text-xl font-semibold">
                              Chưa có đánh giá nào
                            </h3>
                            <p className="mb-6 text-muted-foreground">
                              Hãy là người đầu tiên đánh giá sản phẩm này
                            </p>
                            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                              <Star className="w-4 h-4 mr-2" />
                              Viết đánh giá đầu tiên
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </motion.div>

        {/* ✅ Related Products Section */}
        {relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-12"
            id="related"
            data-animate
          >
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50 dark:from-slate-800 dark:to-purple-900">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="flex items-center space-x-3 text-2xl font-bold">
                    <Sparkles className="w-6 h-6 text-primary" />
                    <span>Sản phẩm liên quan</span>
                  </h2>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/products")}
                  >
                    Xem tất cả
                    <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {relatedProducts.slice(0, 4).map((relatedProduct, index) => (
                    <motion.div
                      key={relatedProduct.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      whileHover={{ y: -5, scale: 1.02 }}
                      className="transition-all duration-300"
                    >
                      <ProductCard product={relatedProduct} />
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* ✅ FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-12"
          id="faq"
          data-animate
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-indigo-50 dark:from-slate-800 dark:to-indigo-900">
            <CardContent className="pt-6">
              <h2 className="flex items-center mb-8 space-x-3 text-2xl font-bold">
                <MessageCircle className="w-6 h-6 text-primary" />
                <span>Câu hỏi thường gặp</span>
              </h2>

              <div className="space-y-4">
                {[
                  {
                    question:
                      "Tôi có thể sử dụng sản phẩm này cho dự án thương mại không?",
                    answer:
                      "Có, tất cả sản phẩm của chúng tôi đều đi kèm với giấy phép thương mại. Bạn có thể sử dụng cho các dự án cá nhân và thương mại mà không cần trả thêm phí.",
                  },
                  {
                    question: "Tôi có nhận được cập nhật miễn phí không?",
                    answer:
                      "Có, bạn sẽ nhận được tất cả các bản cập nhật miễn phí trong vòng 12 tháng kể từ ngày mua. Sau đó, bạn có thể gia hạn với giá ưu đãi.",
                  },
                  {
                    question: "Có hỗ trợ kỹ thuật không?",
                    answer:
                      "Chúng tôi cung cấp hỗ trợ kỹ thuật 24/7 qua email và chat. Đội ngũ kỹ thuật sẽ giúp bạn giải quyết mọi vấn đề trong quá trình sử dụng.",
                  },
                  {
                    question: "Tôi có thể hoàn tiền không?",
                    answer:
                      "Có, chúng tôi có chính sách hoàn tiền 100% trong vòng 30 ngày nếu bạn không hài lòng với sản phẩm.",
                  },
                ].map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="p-6 border rounded-xl bg-gradient-to-r from-white to-gray-50 dark:from-slate-800 dark:to-slate-900"
                  >
                    <h3 className="mb-3 text-lg font-semibold">
                      {faq.question}
                    </h3>
                    <p className="leading-relaxed text-muted-foreground">
                      {faq.answer}
                    </p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ✅ Support Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-12"
          id="support"
          data-animate
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <h2 className="mb-4 text-2xl font-bold">Cần hỗ trợ?</h2>
                <p className="mb-8 text-lg text-muted-foreground">
                  Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng giúp đỡ bạn
                </p>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="p-6 text-center transition-all duration-300 border rounded-xl bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-blue-900/20 hover:shadow-lg"
                  >
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                    <h3 className="mb-2 text-lg font-semibold">Live Chat</h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                      Hỗ trợ trực tuyến 24/7
                    </p>
                    <Button variant="outline" size="sm">
                      Bắt đầu chat
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="p-6 text-center transition-all duration-300 border rounded-xl bg-gradient-to-br from-white to-green-50 dark:from-slate-800 dark:to-green-900/20 hover:shadow-lg"
                  >
                    <Users className="w-12 h-12 mx-auto mb-4 text-green-600" />
                    <h3 className="mb-2 text-lg font-semibold">Community</h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                      Tham gia cộng đồng hỗ trợ
                    </p>
                    <Button variant="outline" size="sm">
                      Tham gia ngay
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="p-6 text-center transition-all duration-300 border rounded-xl bg-gradient-to-br from-white to-purple-50 dark:from-slate-800 dark:to-purple-900/20 hover:shadow-lg"
                  >
                    <FileText className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                    <h3 className="mb-2 text-lg font-semibold">
                      Documentation
                    </h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                      Hướng dẫn chi tiết từng bước
                    </p>
                    <Button variant="outline" size="sm">
                      Xem tài liệu
                    </Button>
                  </motion.div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ✅ Image Modal */}
        <ImageModal />

        {/* ✅ Floating Action Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          className="fixed z-50 bottom-6 right-6"
        >
          <Button
            onClick={handleAddToCart}
            className="w-16 h-16 shadow-2xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:shadow-3xl"
            size="lg"
          >
            <ShoppingCart className="w-6 h-6" />
          </Button>
        </motion.div>
      </div>

      {/* ✅ Custom Styles */}
      <style>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes float-delay-1 {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        @keyframes float-delay-2 {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-25px);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delay-1 {
          animation: float-delay-1 8s ease-in-out infinite;
        }

        .animate-float-delay-2 {
          animation: float-delay-2 7s ease-in-out infinite;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .hover:shadow-3xl:hover {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
};

export default ProductDetail;
