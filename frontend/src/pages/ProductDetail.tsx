import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FormattedDescription from "@/components/FormattedDescription";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import {
  Star,
  ShoppingCart,
  Download,
  Wallet,
  Eye,
  Share2,
  Heart,
  ArrowLeft,
  Package,
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
  Sparkles,
  Code,
  Palette,
  // ThumbUp,
  Minus,
  CheckCircle2,
  Plus,
  CreditCard,
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
  Verified,
  Truck,
  RotateCcw,
  Crown,
  Gift,
  Flame,
  TrendingUp,
  AlertCircle,
  ArrowUp,
  Bell,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Enhanced Interfaces with more detailed typing
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
  pros?: string[];
  cons?: string[];
  images?: string[];
  purchaseDate?: string;
  version?: string;
}

interface Feature {
  label: string;
  included: boolean;
  icon: any;
  description?: string;
  premium?: boolean;
  category?: string;
}

interface FAQ {
  question: string;
  answer: string;
  category: string;
  helpful?: number;
}

interface Specification {
  category: string;
  specs: { label: string; value: string; unit?: string }[];
}

interface ProductVariant {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  stock: number;
  color?: string;
  size?: string;
  sku?: string;
}

interface DeliveryOption {
  id: string;
  name: string;
  price: number;
  estimatedDays: number;
  icon: any;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: any;
  fee?: number;
  discount?: number;
}

// Enhanced Animation variants
const pageVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1 },
  out: { opacity: 0 },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

const floatingVariants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Enhanced State Management
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null,
  );
  const [reviews, setReviews] = useState<Review[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [specifications, setSpecifications] = useState<Specification[]>([]);
  const [faqs, setFAQs] = useState<FAQ[]>([]);
  const [deliveryOptions, setDeliveryOptions] = useState<DeliveryOption[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState("");
  const [stockCount, setStockCount] = useState(47);
  const [viewCount, setViewCount] = useState(1247);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [selectedDelivery, setSelectedDelivery] =
    useState<DeliveryOption | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(
    null,
  );
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showPriceAlert, setShowPriceAlert] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [isComparing, setIsComparing] = useState(false);
  const [currentImageZoom, setCurrentImageZoom] = useState(1);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [showImageTools, setShowImageTools] = useState(false);

  // Refs for better performance
  const productRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);
  const scrollTimeout = useRef<NodeJS.Timeout>();

  // Enhanced Loading Screen with better animations and UX
  const LoadingScreen = () => (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="in"
      exit="out"
      transition={{
        ease: "anticipate",
        duration: 0.8,
      }}
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-indigo-900 dark:to-purple-900 flex items-center justify-center relative overflow-hidden"
    >
      {/* Enhanced Animated Background Patterns */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 via-purple-400/5 to-pink-400/5 animate-pulse"></div>

        {/* Floating Elements with better positioning */}
        {[
          { icon: Sparkles, delay: 0, x: 10, y: 20 },
          { icon: Code, delay: 0.5, x: 80, y: 10 },
          { icon: Heart, delay: 1, x: 20, y: 80 },
          { icon: Star, delay: 1.5, x: 90, y: 70 },
          { icon: Award, delay: 2, x: 50, y: 30 },
          { icon: Crown, delay: 2.5, x: 70, y: 90 },
          { icon: Gift, delay: 3, x: 30, y: 60 },
          { icon: Flame, delay: 3.5, x: 60, y: 15 },
        ].map(({ icon: Icon, delay, x, y }, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              top: `${y}%`,
              left: `${x}%`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 360],
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 4 + delay,
              repeat: Infinity,
              ease: "easeInOut",
              delay: delay,
            }}
          >
            <Icon className="w-8 h-8 text-indigo-400/40" />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="relative z-10"
      >
        <Card className="w-[500px] border-0 shadow-2xl bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl">
          <CardContent className="py-12 px-10 text-center">
            {/* Enhanced Loading Animation */}
            <div className="relative mb-10">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-24 h-24 mx-auto border-4 rounded-full border-gradient-to-r from-indigo-500 to-purple-600 border-t-transparent"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 180, 360] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <ShoppingCart className="w-10 h-10 text-indigo-600" />
                </motion.div>
              </div>

              {/* Orbiting Elements */}
              {[Sparkles, Code, Heart, Star].map((Icon, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    top: "50%",
                    left: "50%",
                    transformOrigin: "0 0",
                  }}
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 8 + i * 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <div className="w-6 h-6 -translate-x-16 -translate-y-3">
                    <Icon className="w-full h-full text-indigo-400/60" />
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.h2
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mb-6 text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
            >
              Đang tải sản phẩm
            </motion.h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Chúng tôi đang chuẩn bị những điều tuyệt vời cho bạn...
            </p>

            {/* Multi-step Progress with better UX */}
            <div className="space-y-4 mb-8">
              {[
                "Đang tải thông tin sản phẩm",
                "Đang xử lý hình ảnh chất lượng cao",
                "Đang chuẩn bị đánh giá khách hàng",
                "Đang tối ưu trải nghiệm",
                "Hoàn tất",
              ].map((step, i) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0.3, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.6, duration: 0.5 }}
                  className="flex items-center space-x-3"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.6 + 0.3 }}
                    className="w-4 h-4 bg-indigo-500 rounded-full"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {step}
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3 mb-6 overflow-hidden">
              <motion.div
                className="h-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>

            <div className="flex justify-center space-x-2">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                  className="w-2 h-2 bg-indigo-500 rounded-full"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );

  // Enhanced Image Modal with advanced features
  const ImageModal = () => (
    <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
      <DialogContent className="max-w-7xl p-0 bg-transparent border-none">
        <div className="relative bg-black/95 rounded-3xl overflow-hidden backdrop-blur-3xl border border-white/10">
          <DialogHeader className="absolute top-0 left-0 right-0 z-20 p-6 bg-gradient-to-b from-black/80 to-transparent">
            <div className="flex items-center justify-between text-white">
              <div>
                <DialogTitle className="text-2xl font-bold">
                  {product?.title}
                </DialogTitle>
                <p className="text-white/70 text-sm">
                  Hình ảnh {modalImageIndex + 1} /{" "}
                  {product?.images?.length || 1}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/10"
                        onClick={() =>
                          setCurrentImageZoom(currentImageZoom === 1 ? 2 : 1)
                        }
                      >
                        {currentImageZoom === 1 ? (
                          <Eye className="w-5 h-5" />
                        ) : (
                          <X className="w-5 h-5" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{currentImageZoom === 1 ? "Phóng to" : "Thu nhỏ"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/10"
                        onClick={() => {
                          const link = document.createElement("a");
                          link.href = product?.images?.[modalImageIndex] || "";
                          link.download = `${product?.title}_${modalImageIndex + 1}.jpg`;
                          link.click();
                        }}
                      >
                        <Download className="w-5 h-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Tải xuống</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/10"
                        onClick={() => handleShare()}
                      >
                        <Share2 className="w-5 h-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Chia sẻ</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </DialogHeader>

          <motion.img
            key={modalImageIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
              opacity: 1,
              scale: currentImageZoom,
              x: imagePosition.x,
              y: imagePosition.y,
            }}
            transition={{ duration: 0.4 }}
            src={product?.images?.[modalImageIndex]}
            alt={`${product?.title} - Chi tiết ${modalImageIndex + 1}`}
            className="w-full h-auto max-h-[85vh] object-contain cursor-move"
            ref={imageRef}
            onError={(e) => {
              e.currentTarget.src =
                "https://via.placeholder.com/1200x800?text=Image+Not+Available";
            }}
            onMouseDown={(e) => {
              if (currentImageZoom > 1) {
                const startX = e.clientX - imagePosition.x;
                const startY = e.clientY - imagePosition.y;

                const handleMouseMove = (e: MouseEvent) => {
                  setImagePosition({
                    x: e.clientX - startX,
                    y: e.clientY - startY,
                  });
                };

                const handleMouseUp = () => {
                  document.removeEventListener("mousemove", handleMouseMove);
                  document.removeEventListener("mouseup", handleMouseUp);
                };

                document.addEventListener("mousemove", handleMouseMove);
                document.addEventListener("mouseup", handleMouseUp);
              }
            }}
          />

          {/* Enhanced Navigation */}
          {product?.images && product.images.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="lg"
                className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border-white/20 rounded-full w-14 h-14 p-0"
                onClick={() => {
                  const newIndex =
                    modalImageIndex > 0
                      ? modalImageIndex - 1
                      : product.images!.length - 1;
                  setModalImageIndex(newIndex);
                  setImagePosition({ x: 0, y: 0 });
                  setCurrentImageZoom(1);
                }}
              >
                <ChevronLeft className="w-7 h-7" />
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border-white/20 rounded-full w-14 h-14 p-0"
                onClick={() => {
                  const newIndex =
                    modalImageIndex < product.images!.length - 1
                      ? modalImageIndex + 1
                      : 0;
                  setModalImageIndex(newIndex);
                  setImagePosition({ x: 0, y: 0 });
                  setCurrentImageZoom(1);
                }}
              >
                <ChevronRight className="w-7 h-7" />
              </Button>
            </>
          )}

          {/* Enhanced Thumbnail Navigation */}
          {product?.images && product.images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 max-w-2xl overflow-x-auto bg-black/50 backdrop-blur-md rounded-full p-3">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setModalImageIndex(index);
                    setImagePosition({ x: 0, y: 0 });
                    setCurrentImageZoom(1);
                  }}
                  className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                    modalImageIndex === index
                      ? "border-white ring-2 ring-white/50 scale-110"
                      : "border-white/30 hover:border-white/60"
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://via.placeholder.com/100x80?text=Img";
                    }}
                  />
                </button>
              ))}
            </div>
          )}

          {/* Zoom Controls */}
          <div className="absolute bottom-6 right-6 flex flex-col space-y-2">
            <Button
              variant="secondary"
              size="sm"
              className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border-white/20 rounded-full w-10 h-10 p-0"
              onClick={() =>
                setCurrentImageZoom(Math.min(currentImageZoom + 0.5, 3))
              }
            >
              <Plus className="w-4 h-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border-white/20 rounded-full w-10 h-10 p-0"
              onClick={() =>
                setCurrentImageZoom(Math.max(currentImageZoom - 0.5, 1))
              }
            >
              <Minus className="w-4 h-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border-white/20 rounded-full w-10 h-10 p-0"
              onClick={() => {
                setCurrentImageZoom(1);
                setImagePosition({ x: 0, y: 0 });
              }}
            >
              <Target className="w-4 h-4" />
            </Button>
          </div>

          {/* Close Button */}
          <Button
            variant="secondary"
            className="absolute top-6 right-6 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border-white/20 rounded-full w-12 h-12 p-0"
            onClick={() => {
              setIsImageModalOpen(false);
              setImagePosition({ x: 0, y: 0 });
              setCurrentImageZoom(1);
            }}
          >
            <X className="w-6 h-6" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  // Enhanced Review Modal with better UX
  const ReviewModal = () => (
    <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Viết đánh giá sản phẩm
          </DialogTitle>
          <p className="text-gray-600 dark:text-gray-400">
            Chia sẻ trải nghiệm của bạn để giúp khách hàng khác đưa ra quyết
            định tốt hơn
          </p>
        </DialogHeader>

        <div className="space-y-6 py-6">
          {/* Enhanced Rating Section */}
          <div>
            <label className="block text-sm font-medium mb-3">
              Đánh giá tổng thể
            </label>
            <div className="flex items-center space-x-2 mb-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <motion.button
                  key={rating}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setUserRating(rating)}
                  className="p-1"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      rating <= userRating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300 hover:text-yellow-200"
                    }`}
                  />
                </motion.button>
              ))}
            </div>
            {userRating > 0 && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-gray-600 dark:text-gray-400"
              >
                {userRating}/5 -{" "}
                {userRating === 1
                  ? "Rất tệ"
                  : userRating === 2
                    ? "Tệ"
                    : userRating === 3
                      ? "Bình thường"
                      : userRating === 4
                        ? "Tốt"
                        : "Xuất sắc"}
              </motion.p>
            )}
          </div>

          {/* Review Text with character counter */}
          <div>
            <label className="block text-sm font-medium mb-3">
              Nội dung đánh giá ({userReview.length}/500)
            </label>
            <Textarea
              placeholder="Chia sẻ chi tiết về trải nghiệm của bạn với sản phẩm này... Hãy nói về chất lượng, tính năng, giá trị và bất kỳ điều gì bạn muốn khách hàng khác biết."
              value={userReview}
              onChange={(e) => setUserReview(e.target.value.slice(0, 500))}
              className="min-h-[120px] resize-none"
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500">
                Tối thiểu 20 ký tự để gửi đánh giá
              </span>
              <span
                className={`text-xs ${userReview.length > 450 ? "text-red-500" : "text-gray-500"}`}
              >
                {userReview.length}/500
              </span>
            </div>
          </div>

          {/* Quick rating categories */}
          <div>
            <label className="block text-sm font-medium mb-3">
              Đánh giá nhanh
            </label>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Chất lượng", key: "quality" },
                { label: "Giá trị", key: "value" },
                { label: "Tính năng", key: "features" },
                { label: "Hỗ trợ", key: "support" },
              ].map((category) => (
                <div
                  key={category.key}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm">{category.label}</span>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <Star
                        key={rating}
                        className="w-4 h-4 text-yellow-400 fill-yellow-400 cursor-pointer hover:scale-110 transition-transform"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Section */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setIsReviewModalOpen(false)}
            >
              Hủy
            </Button>
            <Button
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
              disabled={userRating === 0 || userReview.trim().length < 20}
            >
              <Star className="w-4 h-4 mr-2" />
              Gửi đánh giá
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  // Enhanced Description Component
  const ExpandableDescription = ({ text, maxLength = 400 }) => {
    const shouldTruncate = text.length > maxLength;
    const displayText =
      isDescriptionExpanded || !shouldTruncate
        ? text
        : text.substring(0, maxLength) + "...";

    return (
      <div className="space-y-4">
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <FormattedDescription
            text={displayText}
            className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm"
          />
        </div>

        {shouldTruncate && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
            className="h-auto p-0 font-medium text-indigo-600 hover:text-indigo-700 group text-sm"
          >
            <span className="flex items-center">
              {isDescriptionExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-1 group-hover:-translate-y-0.5 transition-transform" />
                  Thu gọn
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-1 group-hover:translate-y-0.5 transition-transform" />
                  Xem thêm
                </>
              )}
            </span>
          </Button>
        )}
      </div>
    );
  };

  // Enhanced Stock Alert Component
  const StockAlert = () => {
    if (stockCount > 20) return null;

    const urgencyLevel = stockCount <= 5 ? "critical" : "warning";

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex items-center space-x-3 p-4 rounded-xl border ${
          urgencyLevel === "critical"
            ? "bg-red-50 border-red-200 dark:bg-red-900/20"
            : "bg-orange-50 border-orange-200 dark:bg-orange-900/20"
        }`}
      >
        <div className="flex-shrink-0">
          <AlertCircle
            className={`w-5 h-5 ${
              urgencyLevel === "critical" ? "text-red-600" : "text-orange-600"
            }`}
          />
        </div>
        <div className="flex-1">
          <p
            className={`text-sm font-medium ${
              urgencyLevel === "critical" ? "text-red-800" : "text-orange-800"
            }`}
          >
            {urgencyLevel === "critical"
              ? `Chỉ còn ${stockCount} sản phẩm cuối cùng!`
              : `Chỉ còn ${stockCount} sản phẩm trong kho!`}
          </p>
          <p
            className={`text-xs ${
              urgencyLevel === "critical" ? "text-red-600" : "text-orange-600"
            }`}
          >
            {urgencyLevel === "critical"
              ? "Đặt hàng ngay để không bỏ lỡ!"
              : "Số lượng có hạn"}
          </p>
        </div>
        {urgencyLevel === "critical" && (
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Flame className="w-5 h-5 text-red-500" />
          </motion.div>
        )}
      </motion.div>
    );
  };

  // Enhanced Scroll to Top Button
  const ScrollToTopButton = () => (
    <AnimatePresence>
      {showScrollToTop && (
        <motion.div
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0, y: 20 }}
          className="fixed bottom-24 right-6 z-40" // Higher z-index than chatbot
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="w-12 h-12 rounded-full shadow-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0"
                  size="sm"
                >
                  <ArrowUp className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>Về đầu trang</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Enhanced Price Alert Component
  const PriceAlertModal = () => (
    <Dialog open={showPriceAlert} onOpenChange={setShowPriceAlert}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Bell className="w-5 h-5 mr-2 text-indigo-600" />
            Thông báo giá
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Nhận thông báo khi giá sản phẩm này giảm xuống mức mong muốn của
            bạn.
          </p>
          <div>
            <label className="block text-sm font-medium mb-2">
              Giá mong muốn
            </label>
            <Input
              type="number"
              placeholder={`Thấp hơn ${formatPrice(product?.price || 0)}`}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Email thông báo
            </label>
            <Input
              type="email"
              placeholder="your@email.com"
              className="w-full"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setShowPriceAlert(false)}>
              Hủy
            </Button>
            <Button className="bg-gradient-to-r from-indigo-500 to-purple-600">
              Tạo thông báo
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  // Enhanced Event Handlers
  const handleAddToCart = async () => {
    if (!product) return;

    setIsAddingToCart(true);

    try {
      for (let i = 0; i < quantity; i++) {
        await addToCart(product);
      }

      setStockCount((prev) => Math.max(0, prev - quantity));

      toast({
        title: "🛒 Đã thêm vào giỏ hàng",
        description: `${quantity} x ${product.title} đã được thêm vào giỏ hàng.`,
      });

      // Enhanced success animation
      const confetti = document.createElement("div");
      confetti.style.position = "fixed";
      confetti.style.top = "50%";
      confetti.style.left = "50%";
      confetti.style.transform = "translate(-50%, -50%)";
      confetti.style.fontSize = "3rem";
      confetti.style.zIndex = "9999";
      confetti.style.pointerEvents = "none";
      confetti.textContent = "🎉";
      document.body.appendChild(confetti);

      // Animate confetti
      confetti.animate(
        [
          { transform: "translate(-50%, -50%) scale(0)", opacity: 0 },
          { transform: "translate(-50%, -50%) scale(1.5)", opacity: 1 },
          { transform: "translate(-50%, -50%) scale(1)", opacity: 0 },
        ],
        {
          duration: 2000,
          easing: "ease-out",
        },
      );

      setTimeout(() => {
        if (document.body.contains(confetti)) {
          document.body.removeChild(confetti);
        }
      }, 2000);
    } catch (error) {
      toast({
        title: "❌ Lỗi",
        description: "Không thể thêm sản phẩm vào giỏ hàng.",
        variant: "destructive",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleShare = async (platform?: string) => {
    const url = window.location.href;
    const title = product?.title || "";
    const description = product?.description?.substring(0, 100) + "..." || "";

    if (platform === "copy") {
      try {
        await navigator.clipboard.writeText(url);
        toast({
          title: "📋 Đã sao chép link",
          description: "Link sản phẩm đã được sao chép vào clipboard.",
        });
      } catch (error) {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        toast({
          title: "📋 Đã sao chép link",
          description: "Link sản phẩm đã được sao chép.",
        });
      }
      return;
    }

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    };

    if (platform && shareUrls[platform]) {
      window.open(shareUrls[platform], "_blank", "width=600,height=400");
    } else {
      // Try native sharing first
      if (navigator.share) {
        try {
          await navigator.share({ title, text: description, url });
        } catch (error) {
          console.log("Native sharing cancelled or failed");
        }
      } else {
        // Fallback to copy
        handleShare("copy");
      }
    }
  };

  const toggleWishlist = () => {
    const newState = !isWishlisted;
    setIsWishlisted(newState);

    // Save to localStorage
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    if (newState) {
      if (!wishlist.includes(product?.id)) {
        wishlist.push(product?.id);
      }
    } else {
      const index = wishlist.indexOf(product?.id);
      if (index > -1) {
        wishlist.splice(index, 1);
      }
    }
    localStorage.setItem("wishlist", JSON.stringify(wishlist));

    toast({
      title: newState ? "❤️ Đã thêm vào yêu thích" : "💔 Đã xóa khỏi yêu thích",
      description: newState
        ? "Sản phẩm đã được thêm vào danh sách yêu thích."
        : "Sản phẩm đã được xóa khỏi danh sách yêu thích.",
    });
  };

  // Enhanced data fetching with more comprehensive mock data
  useEffect(() => {
    if (!id) return;

    (async () => {
      setIsLoading(true);

      try {
        // Simulate API delay for better UX
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const data = await getProductById(id);
        if (!data) return;

        // Process images
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

        // Check if in wishlist
        const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
        setIsWishlisted(wishlist.includes(data.id));

        // Enhanced mock reviews with more realistic data
        const mockReviews: Review[] = [
          {
            id: "1",
            userId: "user1",
            userName: "Nguyễn Văn An",
            userAvatar:
              "https://ui-avatars.com/api/?name=Nguyen+Van+An&background=6366f1&color=fff",
            rating: 5,
            comment:
              "Sản phẩm thực sự tuyệt vời! Code rất sạch sẽ và có cấu trúc tốt. Documentation chi tiết giúp tôi triển khai nhanh chóng trong vòng 2 tuần. Responsive design hoàn hảo trên mọi thiết bị từ mobile đến desktop. Team support phản hồi nhanh chóng và chuyên nghiệp. Đáng từng đồng bỏ ra!",
            createdAt: "2025-07-15T10:30:00Z",
            helpful: 34,
            verified: true,
            pros: [
              "Code sạch sẽ",
              "Documentation chi tiết",
              "Responsive tốt",
              "Hỗ trợ nhanh",
              "Cập nhật thường xuyên",
            ],
            cons: ["Setup ban đầu hơi phức tạp"],
            purchaseDate: "2025-07-01",
            version: "v2.1.0",
          },
          {
            id: "2",
            userId: "user2",
            userName: "Trần Thị Mai",
            userAvatar:
              "https://ui-avatars.com/api/?name=Tran+Thi+Mai&background=ec4899&color=fff",
            rating: 5,
            comment:
              "Design hiện đại và trendy, phù hợp với xu hướng 2025. Tôi đã sử dụng cho 3 dự án client và đều nhận được feedback tích cực. Color scheme và typography rất hài hòa. Components được thiết kế rất tỉ mỉ với attention to detail cao.",
            createdAt: "2025-07-10T14:15:00Z",
            helpful: 28,
            verified: true,
            pros: [
              "Design đẹp",
              "UI/UX xuất sắc",
              "Components đa dạng",
              "Màu sắc hài hòa",
            ],
            cons: ["Cần thời gian làm quen với structure"],
            purchaseDate: "2025-06-28",
            version: "v2.0.5",
          },
          {
            id: "3",
            userId: "user3",
            userName: "Lê Hoàng Nam",
            userAvatar:
              "https://ui-avatars.com/api/?name=Le+Hoang+Nam&background=10b981&color=fff",
            rating: 4,
            comment:
              "Chất lượng cao, performance tốt. Đã deploy lên production với traffic 10k+ users/day và chạy rất mượt. Loading time nhanh, SEO friendly. Tuy nhiên documentation có thể chi tiết hơn một chút về advanced features.",
            createdAt: "2025-07-05T09:45:00Z",
            helpful: 42,
            verified: true,
            pros: [
              "Performance cao",
              "SEO friendly",
              "Scalable",
              "Production ready",
            ],
            cons: ["Docs có thể chi tiết hơn", "Advanced features ít examples"],
            purchaseDate: "2025-06-20",
            version: "v2.0.0",
          },
          {
            id: "4",
            userId: "user4",
            userName: "Phạm Minh Tú",
            userAvatar:
              "https://ui-avatars.com/api/?name=Pham+Minh+Tu&background=f59e0b&color=fff",
            rating: 5,
            comment:
              "Lần thứ 3 mua template từ team này và không bao giờ thất vọng. Code architecture rất professional, dễ maintain và extend. TypeScript integration hoàn hảo. Automated testing setup sẵn giúp tiết kiệm rất nhiều thời gian.",
            createdAt: "2025-06-28T16:20:00Z",
            helpful: 19,
            verified: true,
            pros: [
              "Architecture tốt",
              "TypeScript support",
              "Testing setup",
              "Maintainable code",
            ],
            cons: [],
            purchaseDate: "2025-06-15",
            version: "v1.9.8",
          },
          {
            id: "5",
            userId: "user5",
            userName: "Đỗ Thị Lan",
            userAvatar:
              "https://ui-avatars.com/api/?name=Do+Thi+Lan&background=8b5cf6&color=fff",
            rating: 4,
            comment:
              "Template rất đẹp và modern. Các animations mượt mà, micro-interactions tinh tế. Tuy nhiên mình mong có thêm dark mode variants và nhiều color themes hơn. Overall thì rất satisfied với purchase này.",
            createdAt: "2025-06-20T11:10:00Z",
            helpful: 15,
            verified: true,
            pros: [
              "Animations đẹp",
              "Modern design",
              "User-friendly",
              "Good value",
            ],
            cons: ["Limited color themes", "Thiếu dark mode variants"],
            purchaseDate: "2025-06-10",
            version: "v1.9.5",
          },
        ];

        setReviews(mockReviews);

        // Enhanced specifications with more technical details
        const mockSpecs: Specification[] = [
          {
            category: "Kỹ thuật",
            specs: [
              { label: "Framework", value: "React 18.2.0 / Next.js 14" },
              { label: "TypeScript", value: "5.0+ Full Support" },
              { label: "Styling", value: "Tailwind CSS 3.4" },
              { label: "Components", value: "50+", unit: "components" },
              { label: "Pages", value: "25+", unit: "pages" },
              { label: "Bundle Size", value: "< 500", unit: "KB (gzipped)" },
              { label: "Performance", value: "95+", unit: "Lighthouse Score" },
              { label: "Browser Support", value: "95%+", unit: "coverage" },
            ],
          },
          {
            category: "Tương thích",
            specs: [
              { label: "Chrome", value: "90+" },
              { label: "Firefox", value: "88+" },
              { label: "Safari", value: "14+" },
              { label: "Edge", value: "90+" },
              { label: "Mobile iOS", value: "14+" },
              { label: "Mobile Android", value: "10+" },
              { label: "Screen Sizes", value: "320px - 4K" },
              { label: "RTL Support", value: "Có" },
              { label: "Dark Mode", value: "Built-in" },
              { label: "Accessibility", value: "WCAG 2.1 AA" },
            ],
          },
          {
            category: "Hỗ trợ & Bảo hành",
            specs: [
              { label: "Documentation", value: "200+", unit: "pages" },
              { label: "Video Tutorials", value: "20+", unit: "videos HD" },
              { label: "Code Examples", value: "100+", unit: "examples" },
              { label: "Updates", value: "Lifetime", unit: "miễn phí" },
              { label: "Support Response", value: "< 24", unit: "hours" },
              { label: "Community", value: "Discord + Forum" },
              { label: "License", value: "Commercial" },
              { label: "Warranty", value: "12", unit: "months" },
            ],
          },
        ];

        setSpecifications(mockSpecs);

        // Enhanced FAQs with more comprehensive answers
        const mockFAQs: FAQ[] = [
          {
            question:
              "Tôi có thể sử dụng sản phẩm này cho dự án thương mại không?",
            answer:
              "Có, hoàn toàn được! Tất cả sản phẩm của chúng tôi đều đi kèm với giấy phép thương mại (Commercial License) đầy đủ. Bạn có thể sử dụng cho các dự án cá nhân, thương mại, client projects, hoặc bán lại dưới dạng sản phẩm riêng mà không cần trả thêm phí. Không giới hạn số lượng projects hay revenue từ projects đó.",
            category: "Giấy phép",
            helpful: 89,
          },
          {
            question: "Tôi có nhận được cập nhật miễn phí không?",
            answer:
              "Có! Khi mua sản phẩm, bạn sẽ nhận được tất cả các bản cập nhật miễn phí trọn đời (lifetime updates). Chúng tôi thường xuyên cập nhật để tương thích với các phiên bản framework mới nhất, thêm components mới, cải thiện performance, fix bugs và bổ sung features theo feedback từ community.",
            category: "Cập nhật",
            helpful: 76,
          },
          {
            question: "Có hỗ trợ kỹ thuật không?",
            answer:
              "Chúng tôi cung cấp hỗ trợ kỹ thuật chuyên nghiệp 24/7 qua email và chat. Đội ngũ developers có kinh nghiệm 5+ năm sẽ giúp bạn giải quyết mọi vấn đề trong quá trình setup, customization, deployment và troubleshooting. Response time trung bình < 24 giờ, priority support cho customers.",
            category: "Hỗ trợ",
            helpful: 92,
          },
          {
            question: "Tôi có thể customize design và colors không?",
            answer:
              "Tất nhiên! Sản phẩm được xây dựng với Tailwind CSS và CSS variables system, giúp bạn dễ dàng customize colors, fonts, spacing, border radius và toàn bộ design system. Chúng tôi cung cấp detailed theming guide, color palette generator và design tokens documentation để việc customization trở nên dễ dàng nhất.",
            category: "Customization",
            helpful: 68,
          },
          {
            question: "Có chính sách hoàn tiền không?",
            answer:
              "Có, chúng tôi có chính sách hoàn tiền 100% trong vòng 30 ngày đầu tiên nếu bạn không hài lòng với sản phẩm vì bất kỳ lý do gì. Không cần giải thích lý do, chỉ cần gửi email và chúng tôi sẽ hoàn tiền trong 3-5 ngày làm việc. Tuy nhiên, tỉ lệ hoàn tiền của chúng tôi rất thấp (< 2%) vì chất lượng sản phẩm luôn được đảm bảo.",
            category: "Chính sách",
            helpful: 54,
          },
          {
            question: "Sản phẩm có responsive và mobile-friendly không?",
            answer:
              "Hoàn toàn! Tất cả templates đều được thiết kế mobile-first và responsive 100%. Đã được test kỹ lưỡng trên tất cả devices phổ biến và screen sizes từ 320px (iPhone SE) đến 4K displays. Touch gestures, mobile navigation, swipe interactions và mobile UX được tối ưu hóa đặc biệt. PWA ready với offline support.",
            category: "Tương thích",
            helpful: 81,
          },
        ];

        setFAQs(mockFAQs);

        // Enhanced features with more details
        const productFeatures: Feature[] = [
          {
            label: "Clean Code Architecture",
            included: true,
            icon: Code,
            description:
              "Mã nguồn được viết theo React best practices với SOLID principles",
            category: "Code Quality",
            premium: false,
          },
          {
            label: "Responsive Design",
            included: true,
            icon: Smartphone,
            description:
              "Mobile-first approach, tương thích hoàn hảo trên mọi thiết bị",
            category: "Design",
            premium: false,
          },
          {
            label: "Modern UI Components",
            included: true,
            icon: Palette,
            description:
              "50+ components được thiết kế theo Material Design & Human Interface",
            category: "Components",
            premium: false,
          },
          {
            label: "TypeScript Support",
            included: true,
            icon: Shield,
            description:
              "Full TypeScript với strict mode, type definitions đầy đủ",
            category: "Development",
            premium: false,
          },
          {
            label: "Dark Mode Built-in",
            included: true,
            icon: Eye,
            description: "System-aware dark mode với smooth transitions",
            category: "Features",
            premium: false,
          },
          {
            label: "SEO Optimized",
            included: true,
            icon: TrendingUp,
            description:
              "Meta tags, structured data, sitemap và performance optimization",
            category: "SEO",
            premium: false,
          },
          {
            label: "Performance Optimized",
            included: true,
            icon: Zap,
            description:
              "Lighthouse score 95+, lazy loading, code splitting, image optimization",
            category: "Performance",
            premium: false,
          },
          {
            label: "Accessibility Ready",
            included: true,
            icon: Users,
            description:
              "WCAG 2.1 AA compliant với screen reader và keyboard navigation",
            category: "Accessibility",
            premium: false,
          },
          {
            label: "Lifetime Updates",
            included: data.category === "template",
            icon: Clock,
            description:
              "Cập nhật miễn phí trọn đời với features mới và improvements",
            category: "Support",
            premium: true,
          },
          {
            label: "Premium Support",
            included: data.category === "template",
            icon: MessageCircle,
            description: "24/7 priority support qua email, chat và video call",
            category: "Support",
            premium: true,
          },
          {
            label: "Source Files Included",
            included: true,
            icon: FileText,
            description: "Đầy đủ source code, assets, fonts và documentation",
            category: "Files",
            premium: false,
          },
          {
            label: "Commercial License",
            included: true,
            icon: Award,
            description: "Sử dụng cho dự án thương mại không giới hạn revenue",
            category: "License",
            premium: false,
          },
        ];
        setFeatures(productFeatures);

        // Mock delivery options
        const mockDeliveryOptions: DeliveryOption[] = [
          {
            id: "standard",
            name: "Giao hàng tiêu chuẩn",
            price: 0,
            estimatedDays: 3,
            icon: Truck,
          },
          {
            id: "express",
            name: "Giao hàng nhanh",
            price: 30000,
            estimatedDays: 1,
            icon: Zap,
          },
          {
            id: "same-day",
            name: "Giao trong ngày",
            price: 50000,
            estimatedDays: 0,
            icon: Clock,
          },
        ];
        setDeliveryOptions(mockDeliveryOptions);
        setSelectedDelivery(mockDeliveryOptions[0]);

        // Mock payment methods
        const mockPaymentMethods: PaymentMethod[] = [
          {
            id: "credit-card",
            name: "Thẻ tín dụng/ghi nợ",
            icon: CreditCard,
            fee: 0,
          },
          {
            id: "e-wallet",
            name: "Ví điện tử",
            icon: Smartphone,
            fee: 0,
            discount: 2,
          },
          {
            id: "bank-transfer",
            name: "Chuyển khoản ngân hàng",
            icon: Award,
            fee: 0,
            discount: 5,
          },
          {
            id: "cod",
            name: "Thanh toán khi nhận hàng",
            icon: Truck,
            fee: 15000,
          },
        ];
        setPaymentMethods(mockPaymentMethods);
        setSelectedPayment(mockPaymentMethods[0]);

        // Update product rating based on reviews
        const avgRating =
          mockReviews.reduce((sum, review) => sum + review.rating, 0) /
          mockReviews.length;
        setProduct((prev) =>
          prev
            ? {
                ...prev,
                rating: parseFloat(avgRating.toFixed(1)),
                reviewCount: mockReviews.length,
              }
            : null,
        );

        // Get related products
        const related = await getRelatedProducts(data);
        setRelatedProducts(related);

        // Simulate view count increment
        setTimeout(() => {
          setViewCount((prev) => prev + Math.floor(Math.random() * 5) + 1);
        }, 2000);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast({
          title: "❌ Lỗi tải dữ liệu",
          description: "Không thể tải thông tin sản phẩm. Vui lòng thử lại.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    })();
  }, [id]);

  // Enhanced scroll effect with better performance
  useEffect(() => {
    const handleScroll = () => {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      scrollTimeout.current = setTimeout(() => {
        const scrolled = window.pageYOffset;
        const maxHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrolled / maxHeight) * 100;
        setScrollProgress(progress);

        // Show/hide scroll to top button
        setShowScrollToTop(scrolled > 500);
      }, 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // ESC to close modals
      if (e.key === "Escape") {
        setIsImageModalOpen(false);
        setIsReviewModalOpen(false);
        setShowPriceAlert(false);
      }

      // Ctrl/Cmd + Enter to add to cart
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleAddToCart();
      }

      // Arrow keys for image navigation in modal
      if (isImageModalOpen && product?.images) {
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          setModalImageIndex((prev) =>
            prev > 0 ? prev - 1 : product.images!.length - 1,
          );
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          setModalImageIndex((prev) =>
            prev < product.images!.length - 1 ? prev + 1 : 0,
          );
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isImageModalOpen, product?.images, modalImageIndex]);

  if (isLoading || !product) {
    return <LoadingScreen />;
  }

  const discountPercentage = product.originalPrice
    ? getDiscountPercentage(product.originalPrice, product.price)
    : 0;

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="in"
      exit="out"
      transition={{
        ease: "anticipate",
        duration: 0.8,
      }}
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-indigo-900 dark:to-purple-900 relative"
    >
      {/* Enhanced Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-50 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 origin-left"
        style={{ scaleX }}
      />

      {/* Floating background icons (tối đa 40 icon, đã kiểm soát ở phần trước) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[
          Sparkles,
          Code,
          Heart,
          Star,
          Award,
          Crown,
          Gift,
          Flame,
          Coffee,
          Smartphone,
          Truck,
          Shield,
          Users,
          BookOpen,
          Palette,
          TrendingUp,
          Zap,
          Eye,
          FileText,
          Calendar,
          ArrowLeft,
        ].map((Icon, idx) => (
          <motion.div
            key={idx}
            className="absolute"
            style={{
              top: `${10 + Math.sin(idx) * 30}%`,
              left: `${8 + Math.cos(idx) * 35}%`,
              zIndex: 1,
            }}
            animate={{
              y: [0, -12, 0],
              opacity: [0.09, 0.17, 0.09],
              scale: [1, 1.12, 1],
            }}
            transition={{
              duration: 8 + idx,
              repeat: Infinity,
              delay: idx * 0.25,
              ease: "easeInOut",
            }}
          >
            <Icon className="w-8 h-8 text-indigo-300/15 dark:text-purple-400/10" />
          </motion.div>
        ))}
      </div>

      {/* Main container */}
      <div className="container relative z-10 px-4 py-8 mx-auto max-w-7xl">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center text-xs text-gray-700 dark:text-gray-300 mb-7 gap-2"
        >
          <Button
            variant="ghost"
            size="sm"
            className="group"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-3 h-3 mr-1 transition-transform group-hover:-translate-x-1" />
            Quay lại
          </Button>
          <span>/</span>
          <span
            className="capitalize cursor-pointer hover:text-indigo-500"
            onClick={() => navigate("/template")}
          >
            Template
          </span>
          <span>/</span>
          <span className="capitalize truncate max-w-xs font-semibold text-indigo-800 dark:text-indigo-200">
            {product.title}
          </span>
        </motion.nav>

        {/* Content layout: image - info */}
        <div className="grid gap-8 mb-12 lg:grid-cols-2">
          {/* Image gallery section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Main Image */}
            <div className="relative group rounded-2xl overflow-hidden border border-gray-200 shadow-lg bg-gradient-to-tr from-white to-indigo-50 dark:from-slate-800 dark:to-indigo-950 aspect-[4/3]">
              <motion.img
                key={selectedImage}
                variants={itemVariants}
                src={
                  product.images[selectedImage] ||
                  "https://via.placeholder.com/800x600?text=No+Image"
                }
                alt={product.title}
                className="object-cover w-full h-full transition duration-300 group-hover:scale-105 cursor-zoom-in"
                onClick={() => {
                  setModalImageIndex(selectedImage);
                  setIsImageModalOpen(true);
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://via.placeholder.com/800x600?text=Image+Not+Available";
                }}
              />
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                {discountPercentage > 0 && (
                  <Badge
                    variant="destructive"
                    className="shadow px-2 py-1 gap-1 text-xs"
                  >
                    <Zap className="w-3 h-3" /> -{discountPercentage}%
                  </Badge>
                )}
                {product.isFeatured && (
                  <Badge className="bg-yellow-400 text-white shadow px-2 py-1 gap-1 text-xs">
                    <Crown className="w-3 h-3" /> Nổi bật
                  </Badge>
                )}
                {stockCount < 10 && (
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 text-xs shadow gap-1">
                    <Flame className="w-3 h-3" /> Sắp hết hàng
                  </Badge>
                )}
              </div>
            </div>
            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`rounded-lg border-2 aspect-square transition hover:border-indigo-400 hover:shadow-md overflow-hidden ${selectedImage === idx ? "border-indigo-500 ring-2 ring-indigo-200 shadow-lg" : "border-gray-200"}`}
                  >
                    <img
                      src={img}
                      alt={"Thumb" + (idx + 1)}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/100x100?text=No+Image";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
            {/* Features */}
            <motion.div variants={itemVariants}>
              <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-0 shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg font-bold">
                    <Sparkles className="w-5 h-5 mr-2 text-indigo-600" />
                    Tính năng nổi bật
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {features.slice(0, 6).map((f, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center p-3 rounded-md text-sm gap-2 transition-all duration-300 border
                        ${f.included ? "bg-green-50 text-green-800 border-green-200" : "bg-gray-50 text-gray-600 border-gray-200"}`}
                      >
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center ${f.included ? "bg-green-500" : "bg-gray-400"}`}
                        >
                          {f.included ? (
                            <Check className="w-3 h-3 text-white" />
                          ) : (
                            <X className="w-3 h-3 text-white" />
                          )}
                        </span>
                        <f.icon
                          className={`w-5 h-5 ${f.included ? "text-green-600" : "text-gray-400"}`}
                        />
                        {f.label}
                        {f.premium && (
                          <Badge
                            variant="secondary"
                            className="ml-auto text-xs"
                          >
                            Pro
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Info Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <motion.h1
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold text-gray-900 dark:text-gray-100"
                  >
                    {product.title}
                  </motion.h1>
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 mt-1"
                  >
                    <span className="text-base text-gray-600 dark:text-gray-400">
                      Bởi{" "}
                      <span className="font-semibold text-indigo-600">
                        {product.author}
                      </span>
                    </span>
                    <Badge variant="outline" className="text-xs">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Đã xác minh
                    </Badge>
                  </motion.div>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleWishlist}
                    className={`rounded-full w-10 h-10 p-0 ${isWishlisted ? "text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100" : "hover:text-red-500"}`}
                  >
                    <Heart
                      className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`}
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare()}
                    className="rounded-full w-10 h-10 p-0"
                  >
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              {/* Ratings */}
              <div className="flex items-center mb-6 gap-4">
                <span className="flex items-center mr-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                  <span className="font-bold text-lg ml-2">
                    {product.rating}
                  </span>
                  <span className="text-gray-600 text-sm">
                    ({reviews.length} đánh giá)
                  </span>
                </span>
                <Badge
                  variant={
                    product.category === "template" ? "default" : "secondary"
                  }
                  className="flex items-center px-3 py-1 text-sm"
                >
                  {product.category === "template" ? (
                    <>
                      <Code className="w-4 h-4" />
                      <span>Template</span>
                    </>
                  ) : (
                    <>
                      <BookOpen className="w-4 h-4" />
                      <span>E-book</span>
                    </>
                  )}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <TrendingUp className="w-3 h-3 mr-1" /> Bán chạy #1
                </Badge>
              </div>
              {/* Stock Alert */}
              <StockAlert />
              {/* Description */}
              <ExpandableDescription
                text={product.description}
                maxLength={400}
              />
            </div>
            {/* Price card */}
            <motion.div variants={itemVariants}>
              <Card className="border-0 shadow-lg bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl lg:text-5xl font-bold text-indigo-600">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <div className="text-center">
                        <span className="text-xl line-through text-gray-500 block">
                          {formatPrice(product.originalPrice)}
                        </span>
                        <Badge
                          variant="destructive"
                          className="text-xs font-bold mt-1 gap-1"
                        >
                          <Flame className="w-3 h-3 mr-1" /> Giảm{" "}
                          {discountPercentage}%
                        </Badge>
                      </div>
                    )}
                  </div>
                  {product.originalPrice && (
                    <div className="flex items-center text-green-600 mb-4 gap-1">
                      <Gift className="w-4 h-4" />
                      <span className="font-medium text-sm">
                        Bạn tiết kiệm{" "}
                        {formatPrice(product.originalPrice - product.price)}!
                      </span>
                    </div>
                  )}
                  {/* Payment options */}
                  <div className="flex items-center gap-3 text-xs text-gray-600">
                    <span className="flex items-center">
                      <CreditCard className="w-3 h-3 mr-1" />
                      Thẻ tín dụng
                    </span>
                    <span className="flex items-center">
                      <Wallet className="w-3 h-3 mr-1" />
                      Ví điện tử
                    </span>
                    <span className="flex items-center">
                      <Truck className="w-3 h-3 mr-1" />
                      COD
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            {/* Product detail/slim info */}
            <motion.div variants={itemVariants}>
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-bold">
                    Thông tin chi tiết
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-indigo-600" />
                      <span className="text-sm">
                        Tác giả: <b>{product.author}</b>
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-green-600" />
                      <span className="text-sm">
                        Ngày tạo:{" "}
                        <b>
                          {new Date(product.createdAt).toLocaleDateString(
                            "vi-VN",
                          )}
                        </b>
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Star className="w-5 h-5 text-yellow-600" />
                      <span className="text-sm">
                        Đánh giá: <b>{reviews.length}</b> đánh giá
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Download className="w-5 h-5 text-purple-600" />
                      <span className="text-sm">
                        Lượt tải: <b>2,847</b>
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5 text-blue-600" />
                      <span className="text-sm">
                        Kho hàng:{" "}
                        <b>{stockCount > 0 ? stockCount : "Hết hàng"}</b>
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            {/* Actions: Quantity + mua nhanh */}
            <motion.div variants={itemVariants}>
              <div className="flex items-center mb-4 gap-4">
                <span className="text-sm font-medium">Số lượng:</span>
                <div className="flex items-center border rounded-lg bg-white">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="px-4 py-2 min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Button
                onClick={handleAddToCart}
                className="w-full text-base px-4 py-3 mt-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg"
                size="lg"
                disabled={isAddingToCart}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {isAddingToCart ? "Đang thêm..." : "Thêm vào giỏ hàng"}
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Tabs section: mô tả, tính năng, đánh giá, ... có thể bổ sung thêm */}
        {/* ... */}
        {/* (Bạn nối thêm các component tab/tabs review, faq, spec... đã có sẵn ở dưới đây nếu muốn) */}

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <motion.div variants={itemVariants} className="mt-12">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50 dark:from-slate-800 dark:to-purple-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Sparkles className="w-6 h-6 text-primary" />
                  Sản phẩm liên quan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                  {relatedProducts.slice(0, 4).map((p, index) => (
                    <ProductCard product={p} key={p.id} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* FAQ, Support, Floating Action, các modal */}
        {/* ... */}
        {/* (Nối các khối FAQ, hỗ trợ, chatbot hoặc price alert modal, ScrollToTopButton bên dưới, và các Dialog/modal khác nếu bạn đã copy vào từ đầu file) */}
        <ScrollToTopButton />
        <ImageModal />
        <ReviewModal />

        {/* Nút/thanh hành động nổi bật, chatbot, v.v (nếu có) */}
      </div>
    </motion.div>
  );
};

export default ProductDetail;
