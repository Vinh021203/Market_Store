import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
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
import { ReviewSection } from "@/components/ReviewSection";
import {
  getProductById,
  getRelatedProducts,
  formatPrice,
  getDiscountPercentage,
} from "@/lib/products";
import { useWishlist } from "@/hooks/useWishlist";
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
  BookMarked,
  Library,
  Bookmark,
  Diamond,
  Hexagon,
  Feather,
  Layers,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

// ✅ SOFT PINK THEME FOR PRODUCT DETAIL - SAME AS EBOOKS
const softPinkTheme = {
  // 🌸 PINK BACKGROUND TONES
  pageBackground: "from-pink-50/70 via-rose-50/60 to-red-50/50",
  sectionBackground: "from-white/95 via-pink-25/30 to-rose-25/20",

  // 💗 GLASS & CARDS
  glassCard: "from-white/95 via-pink-25/20 to-rose-25/10 backdrop-blur-xl",
  neoCard: "bg-gradient-to-br from-white via-pink-25/30 to-rose-25/20",
  floatingCard: "from-white/90 via-pink-50/60 to-rose-50/40",

  // 🌹 GRADIENT COLORS - PINK THEME
  primaryGradient: "from-pink-500 via-rose-500 to-red-500",
  secondaryGradient: "from-pink-400 via-rose-500 to-pink-600",
  accentGradient: "from-rose-400 via-pink-500 to-red-400",
  successGradient: "from-pink-300 via-rose-400 to-pink-500",

  // 💕 TEXT COLORS
  heroText: "from-pink-700 via-rose-600 to-red-600",
  primaryText: "from-slate-700 via-pink-700 to-rose-700",
  accentText: "from-rose-600 via-pink-600 to-red-600",

  // ✨ EFFECTS
  glow: "shadow-pink-200/60 shadow-2xl",
  neonGlow: "shadow-rose-300/50 shadow-xl",
  softGlow: "shadow-pink-200/40 shadow-lg",

  // 🎨 DYNAMIC COLORS - PINK VARIATIONS
  dynamicColors: [
    {
      bg: "from-pink-400 to-rose-500",
      text: "text-pink-50",
      glow: "shadow-pink-400/30",
    },
    {
      bg: "from-rose-400 to-red-500",
      text: "text-rose-50",
      glow: "shadow-rose-400/30",
    },
    {
      bg: "from-pink-500 to-rose-600",
      text: "text-pink-50",
      glow: "shadow-pink-500/30",
    },
    {
      bg: "from-red-400 to-pink-500",
      text: "text-red-50",
      glow: "shadow-red-400/30",
    },
    {
      bg: "from-rose-500 to-pink-600",
      text: "text-rose-50",
      glow: "shadow-rose-500/30",
    },
    {
      bg: "from-pink-600 to-red-500",
      text: "text-pink-50",
      glow: "shadow-pink-600/30",
    },
  ],
};

// Enhanced Interfaces
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

// ✅ ENHANCED LOADING SCREEN - PINK THEME
const LoadingScreen = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className={`min-h-screen bg-gradient-to-br ${softPinkTheme.pageBackground} flex items-center justify-center relative overflow-hidden`}
  >
    {/* Background decorations */}
    <div className="absolute inset-0">
      <motion.div
        animate={{
          rotate: [0, 360],
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-20 w-32 h-32"
      >
        <div className="w-full h-full bg-gradient-to-r from-pink-400/30 to-rose-400/30 transform rotate-45 rounded-lg filter blur-xl" />
      </motion.div>

      {/* Floating product icons */}
      {[
        { icon: ShoppingCart, color: "text-pink-500/30", delay: 0 },
        { icon: Heart, color: "text-rose-500/30", delay: 0.5 },
        { icon: Star, color: "text-red-500/30", delay: 1 },
        { icon: Award, color: "text-pink-600/30", delay: 1.5 },
        { icon: Crown, color: "text-rose-600/30", delay: 2 },
        { icon: Gift, color: "text-red-600/30", delay: 2.5 },
      ].map(({ icon: Icon, color, delay }, index) => (
        <motion.div
          key={index}
          className={`absolute ${color}`}
          style={{
            top: `${15 + Math.random() * 70}%`,
            left: `${10 + Math.random() * 80}%`,
          }}
          animate={{
            y: [0, -40, 0],
            rotate: [0, 360],
            scale: [0.8, 1.2, 0.8],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 6 + index,
            repeat: Infinity,
            ease: "easeInOut",
            delay: delay,
          }}
        >
          <Icon className="w-6 h-6 md:w-10 md:h-10" />
        </motion.div>
      ))}
    </div>

    <div className="relative z-10 text-center space-y-8">
      <motion.div
        initial={{ scale: 0, rotateY: 0 }}
        animate={{ scale: 1, rotateY: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="relative"
      >
        <div
          className={`w-24 h-24 mx-auto bg-gradient-to-br ${softPinkTheme.primaryGradient} rounded-2xl shadow-2xl relative`}
        >
          <div className="absolute inset-2 bg-white/20 rounded-xl backdrop-blur-sm flex items-center justify-center">
            <ShoppingCart className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Orbiting elements */}
        {[Sparkles, Heart, Star, Crown].map((Icon, i) => (
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
              <Icon className="w-full h-full text-pink-400/60" />
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2
          className={`text-3xl font-bold bg-gradient-to-r ${softPinkTheme.heroText} bg-clip-text text-transparent`}
        >
          Đang tải sản phẩm
        </h2>
        <p className="text-gray-600 mt-2">
          Chuẩn bị những điều tuyệt vời cho bạn...
        </p>
      </motion.div>

      {/* Progress steps */}
      <div className="space-y-4">
        {[
          "Đang tải thông tin sản phẩm",
          "Đang xử lý hình ảnh chất lượng cao",
          "Đang chuẩn bị đánh giá khách hàng",
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
              className="w-3 h-3 bg-pink-500 rounded-full"
            />
            <span className="text-sm text-gray-600">{step}</span>
          </motion.div>
        ))}
      </div>

      {/* Animated progress bar */}
      <div className="w-80 bg-gray-200 rounded-full h-2 overflow-hidden">
        <motion.div
          className={`h-2 bg-gradient-to-r ${softPinkTheme.primaryGradient} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </div>
  </motion.div>
);

// ✅ ENHANCED IMAGE MODAL - BEAUTIFUL & FUNCTIONAL
const ImageModal = ({
  isOpen,
  onClose,
  product,
  imageIndex,
  setImageIndex,
}) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="max-w-7xl p-0 bg-transparent border-none">
      <div className="relative bg-black/95 rounded-3xl overflow-hidden backdrop-blur-3xl border border-white/10">
        <DialogHeader className="absolute top-0 left-0 right-0 z-20 p-6 bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex items-center justify-between text-white">
            <div>
              <DialogTitle className="text-2xl font-bold">
                {product?.title}
              </DialogTitle>
              <p className="text-white/70 text-sm">
                Hình ảnh {imageIndex + 1} / {product?.images?.length || 1}
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
                      onClick={() => {
                        const link = document.createElement("a");
                        link.href = product?.images?.[imageIndex] || "";
                        link.download = `${product?.title}_${imageIndex + 1}.jpg`;
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
                      onClick={() => {
                        navigator.clipboard.writeText(
                          product?.images?.[imageIndex] || "",
                        );
                        toast({
                          title: "📋 Đã sao chép link ảnh",
                          description:
                            "Link ảnh đã được sao chép vào clipboard.",
                        });
                      }}
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
          key={imageIndex}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          src={product?.images?.[imageIndex]}
          alt={`${product?.title} - Chi tiết ${imageIndex + 1}`}
          className="w-full h-auto max-h-[85vh] object-contain"
          onError={(e) => {
            e.currentTarget.src =
              "https://via.placeholder.com/1200x800?text=Image+Not+Available";
          }}
        />

        {/* Navigation */}
        {product?.images && product.images.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="lg"
              className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border-white/20 rounded-full w-14 h-14 p-0"
              onClick={() => {
                const newIndex =
                  imageIndex > 0 ? imageIndex - 1 : product.images!.length - 1;
                setImageIndex(newIndex);
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
                  imageIndex < product.images!.length - 1 ? imageIndex + 1 : 0;
                setImageIndex(newIndex);
              }}
            >
              <ChevronRight className="w-7 h-7" />
            </Button>
          </>
        )}

        {/* Thumbnail navigation */}
        {product?.images && product.images.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 max-w-2xl overflow-x-auto bg-black/50 backdrop-blur-md rounded-full p-3">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setImageIndex(index)}
                className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                  imageIndex === index
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

        {/* Close Button */}
        <Button
          variant="secondary"
          className="absolute top-6 right-6 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border-white/20 rounded-full w-12 h-12 p-0"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);

// ✅ ENHANCED REVIEW MODAL
const ReviewModal = ({ isOpen, onClose, product }) => {
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState("");
  const [reviewCount, setReviewCount] = useState(0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center">
            <Star className="w-6 h-6 mr-2 text-pink-500" />
            Viết đánh giá sản phẩm
          </DialogTitle>
          <p className="text-gray-600">
            Chia sẻ trải nghiệm của bạn để giúp khách hàng khác đưa ra quyết
            định tốt hơn
          </p>
        </DialogHeader>

        <div className="space-y-6 py-6">
          {/* Rating Section */}
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
                className="text-sm text-gray-600"
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

          {/* Review Text */}
          <div>
            <label className="block text-sm font-medium mb-3">
              Nội dung đánh giá ({userReview.length}/500)
            </label>
            <Textarea
              placeholder="Chia sẻ chi tiết về trải nghiệm của bạn với sản phẩm này..."
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

          {/* Submit Section */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button
              className={`bg-gradient-to-r ${softPinkTheme.primaryGradient} hover:scale-105 transition-all`}
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
};

// ✅ EXPANDABLE DESCRIPTION COMPONENT
const ExpandableDescription = ({ text, maxLength = 400 }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = text.length > maxLength;
  const displayText =
    isExpanded || !shouldTruncate ? text : text.substring(0, maxLength) + "...";

  return (
    <div className="space-y-4">
      <div className="prose prose-sm max-w-none">
        <FormattedDescription
          text={displayText}
          className="text-gray-700 leading-relaxed text-sm"
        />
      </div>

      {shouldTruncate && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-auto p-0 font-medium text-pink-600 hover:text-pink-700 group text-sm"
        >
          <span className="flex items-center">
            {isExpanded ? (
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

// ✅ STOCK ALERT COMPONENT
const StockAlert = ({ stockCount }) => {
  if (stockCount > 20) return null;

  const urgencyLevel = stockCount <= 5 ? "critical" : "warning";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center space-x-3 p-4 rounded-xl border mb-4 ${
        urgencyLevel === "critical"
          ? "bg-red-50 border-red-200"
          : "bg-orange-50 border-orange-200"
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

// ✅ SCROLL TO TOP BUTTON
const ScrollToTopButton = ({ show }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 0, scale: 0, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0, y: 20 }}
        className="fixed bottom-8 right-8 z-40"
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className={`w-12 h-12 rounded-full shadow-lg bg-gradient-to-r ${softPinkTheme.primaryGradient} hover:scale-110 text-white border-0 transition-all`}
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

// ✅ MAIN PRODUCT DETAIL COMPONENT
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

  // State Management
  const [selectedImage, setSelectedImage] = useState(0);
  const { wishlist, addToWishlist, removeFromWishlist, isInWishlist } =
    useWishlist();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [specifications, setSpecifications] = useState<Specification[]>([]);
  const [faqs, setFAQs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [stockCount, setStockCount] = useState(47);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

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

      // Success animation
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
        toast({
          title: "📋 Đã sao chép link",
          description: "Link sản phẩm đã được sao chép.",
        });
      }
      return;
    }

    if (navigator.share) {
      try {
        await navigator.share({ title, text: description, url });
      } catch (error) {
        console.log("Native sharing cancelled or failed");
      }
    } else {
      handleShare("copy");
    }
  };

  const toggleWishlist = () => {
    if (!product) return;
    const isCurrentlyInWishlist = isInWishlist(product.id);
    if (isCurrentlyInWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  // Data fetching
  useEffect(() => {
    if (!id) return;
    (async () => {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const data = await getProductById(id);
        if (!data) return;
        setProduct(data);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    })();
  }, [id]);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      setShowScrollToTop(scrolled > 500);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsImageModalOpen(false);
        setIsReviewModalOpen(false);
      }

      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleAddToCart();
      }

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
    <>
      {/* ✅ DYNAMIC SEO - THÊM ĐOẠN NÀY */}
      <Helmet>
        <title>{product?.title || "Đang tải..."} | Template Market</title>
        <meta
          name="description"
          content={
            product?.description?.substring(0, 160) ||
            "Mô tả sản phẩm đang được tải..."
          }
        />
        <meta
          property="og:title"
          content={product?.title || "Template Market"}
        />
        <meta
          property="og:description"
          content={
            product?.description?.substring(0, 160) ||
            "Khám phá template chuyên nghiệp"
          }
        />
        <meta property="og:image" content={product?.image || ""} />
        <meta property="og:type" content="product" />
        <meta
          property="og:price:amount"
          content={String(product?.price || 0)}
        />
        <meta property="og:price:currency" content="VND" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={product?.title || "Template Market"}
        />
        <meta
          name="twitter:description"
          content={product?.description?.substring(0, 160) || ""}
        />
        <meta name="twitter:image" content={product?.image || ""} />

        {/* Additional SEO */}
        <meta name="author" content={product?.author || "Template Market"} />
        <meta name="keywords" content={product?.tags?.join(", ") || ""} />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`min-h-screen bg-gradient-to-br ${softPinkTheme.pageBackground} relative`}
      >
        {/* Progress Bar */}
        <motion.div
          className={`fixed top-0 left-0 right-0 z-50 h-1 bg-gradient-to-r ${softPinkTheme.primaryGradient} origin-left`}
          style={{ scaleX }}
        />

        {/* Floating background icons */}
        <div className="fixed inset-0 pointer-events-none z-0">
          {[
            Heart,
            Star,
            Crown,
            Gift,
            Sparkles,
            Award,
            Diamond,
            BookMarked,
            ShoppingCart,
            Smartphone,
            Users,
            Code,
            Palette,
            Shield,
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
              <Icon className="w-8 h-8 text-pink-300/15" />
            </motion.div>
          ))}
        </div>

        {/* Main container */}
        <div className="container relative z-10 px-4 py-16 lg:py-8 mx-auto max-w-7xl">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center text-xs text-gray-700 mb-7 gap-2"
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
              className="capitalize cursor-pointer hover:text-pink-500"
              onClick={() => navigate("/templates")}
            >
              {product.category === "template" ? "Templates" : "E-books"}
            </span>
            <span>/</span>
            <span className="capitalize truncate max-w-xs font-semibold text-pink-800">
              {product.title}
            </span>
          </motion.nav>

          {/* Content layout: image - info */}
          <div className="grid gap-8 mb-12 lg:grid-cols-2">
            {/* Image gallery section */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Main Image */}
              <div
                className={`relative group rounded-2xl overflow-hidden border border-pink-200/50 ${softPinkTheme.softGlow} bg-gradient-to-tr ${softPinkTheme.neoCard} aspect-[4/3]`}
              >
                <motion.img
                  key={selectedImage}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
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
                      className={`bg-gradient-to-r ${softPinkTheme.primaryGradient} text-white shadow px-2 py-1 gap-1 text-xs`}
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

                {/* Quick action buttons */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          variant="secondary"
                          className={`w-10 h-10 p-0 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg`}
                          onClick={() => {
                            setModalImageIndex(selectedImage);
                            setIsImageModalOpen(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Xem full size</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          variant="secondary"
                          className={`w-10 h-10 p-0 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg ${isInWishlist(product?.id || "") ? "text-red-500" : ""}`}
                          onClick={toggleWishlist}
                        >
                          <Heart
                            className={`w-4 h-4 ${isInWishlist(product?.id || "") ? "fill-current" : ""}`}
                          />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {isInWishlist
                            ? "Xóa khỏi yêu thích"
                            : "Thêm vào yêu thích"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`rounded-lg border-2 aspect-square transition hover:border-pink-400 hover:shadow-md overflow-hidden ${
                        selectedImage === idx
                          ? "border-pink-500 ring-2 ring-pink-200 shadow-lg"
                          : "border-pink-200/50"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumb ${idx + 1}`}
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

              {/* Features card */}
              <Card
                className={`bg-gradient-to-br ${softPinkTheme.neoCard} border-0 ${softPinkTheme.softGlow}`}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-lg font-bold">
                    <Sparkles className="w-5 h-5 mr-2 text-pink-600" />
                    Tính năng nổi bật
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-3">
                    {features.slice(0, 6).map((f, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center p-3 rounded-lg text-sm gap-3 transition-all duration-300 border ${
                          f.included
                            ? "bg-green-50 text-green-800 border-green-200"
                            : "bg-gray-50 text-gray-600 border-gray-200"
                        }`}
                      >
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                            f.included ? "bg-green-500" : "bg-gray-400"
                          }`}
                        >
                          {f.included ? (
                            <Check className="w-3 h-3 text-white" />
                          ) : (
                            <X className="w-3 h-3 text-white" />
                          )}
                        </span>
                        <f.icon
                          className={`w-5 h-5 flex-shrink-0 ${
                            f.included ? "text-green-600" : "text-gray-400"
                          }`}
                        />
                        <div className="flex-1">
                          <div className="font-medium">{f.label}</div>
                          {f.description && (
                            <div className="text-xs opacity-70 mt-1">
                              {f.description}
                            </div>
                          )}
                        </div>
                        {f.premium && (
                          <Badge variant="secondary" className="text-xs">
                            Pro
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Info Section */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Header */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {product.title}
                    </h1>
                    <div className="flex items-center gap-4">
                      <span className="text-base text-gray-600">
                        Bởi{" "}
                        <span className="font-semibold text-pink-600">
                          {product.author}
                        </span>
                      </span>
                      <Badge variant="outline" className="text-xs">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Đã xác minh
                      </Badge>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleWishlist}
                      className={`rounded-full w-10 h-10 p-0 ${
                        isInWishlist
                          ? "text-red-500 bg-red-50 hover:bg-red-100"
                          : "hover:text-red-500"
                      }`}
                    >
                      <Heart
                        className={`h-5 w-5 ${isInWishlist ? "fill-current" : ""}`}
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
                <div className="flex items-center mb-6 gap-4 flex-wrap">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="font-bold text-lg ml-2">
                      {product.rating}
                    </span>
                    <span className="text-gray-600 text-sm ml-1">
                      ({product.reviewCount || 0} đánh giá)
                    </span>
                  </div>

                  <Badge
                    className={`flex items-center gap-1 px-3 py-1 text-sm bg-gradient-to-r ${softPinkTheme.secondaryGradient} text-white`}
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
                <StockAlert stockCount={stockCount} />

                {/* Description */}
                <ExpandableDescription
                  text={product.description}
                  maxLength={400}
                />
              </div>

              {/* Price card */}
              <Card
                className={`border-0 ${softPinkTheme.softGlow} bg-gradient-to-r ${softPinkTheme.glassCard} backdrop-blur-xl`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`text-4xl lg:text-5xl font-bold bg-gradient-to-r ${softPinkTheme.heroText} bg-clip-text text-transparent`}
                    >
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <div className="text-center">
                        <span className="text-xl line-through text-gray-500 block">
                          {formatPrice(product.originalPrice)}
                        </span>
                        <Badge
                          className={`bg-gradient-to-r ${softPinkTheme.primaryGradient} text-white text-xs font-bold mt-1 gap-1`}
                        >
                          <Flame className="w-3 h-3" /> Giảm{" "}
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

              {/* Product details */}
              <Card
                className={`border-0 ${softPinkTheme.softGlow} bg-gradient-to-r ${softPinkTheme.neoCard}`}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-bold">
                    Thông tin chi tiết
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-pink-600" />
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
                        Đánh giá: <b>{product.reviewCount || 0}</b> đánh giá
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
                    <div className="flex items-center gap-3">
                      <Eye className="w-5 h-5 text-indigo-600" />
                      <span className="text-sm">
                        Lượt xem: <b>12,483</b>
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions: Quantity + Buy */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">Số lượng:</span>
                  <div className="flex items-center border border-pink-200 rounded-lg bg-white">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="rounded-r-none"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="px-4 py-2 min-w-[3rem] text-center border-x border-pink-200">
                      {quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(quantity + 1)}
                      className="rounded-l-none"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleAddToCart}
                    className={`flex-1 text-base px-6 py-3 bg-gradient-to-r ${softPinkTheme.primaryGradient} hover:scale-105 ${softPinkTheme.glow} shadow-lg transition-all rounded-xl`}
                    size="lg"
                    disabled={isAddingToCart || stockCount <= 0}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {isAddingToCart
                      ? "Đang thêm..."
                      : stockCount <= 0
                        ? "Hết hàng"
                        : "Thêm vào giỏ hàng"}
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    className="px-6 py-3 border-2 border-pink-200 hover:bg-pink-50 rounded-xl"
                    onClick={() => setIsReviewModalOpen(true)}
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Đánh giá
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Tabs Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-12"
          >
            <Card
              className={`border-0 ${softPinkTheme.softGlow} bg-gradient-to-br ${softPinkTheme.neoCard} backdrop-blur-xl`}
            >
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm">
                  <TabsList className="grid w-full grid-cols-4 gap-2 p-2 bg-transparent">
                    <TabsTrigger
                      value="overview"
                      className={`rounded-xl ${activeTab === "overview" ? `bg-gradient-to-r ${softPinkTheme.primaryGradient} text-white` : "hover:bg-pink-50"}`}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Tổng quan
                    </TabsTrigger>
                    <TabsTrigger
                      value="reviews"
                      className={`rounded-xl ${activeTab === "reviews" ? `bg-gradient-to-r ${softPinkTheme.primaryGradient} text-white` : "hover:bg-pink-50"}`}
                    >
                      <Star className="w-4 h-4 mr-2" />
                      Đánh giá ({product.reviewCount || 0})
                    </TabsTrigger>
                    <TabsTrigger
                      value="specs"
                      className={`rounded-xl ${activeTab === "specs" ? `bg-gradient-to-r ${softPinkTheme.primaryGradient} text-white` : "hover:bg-pink-50"}`}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Thông số
                    </TabsTrigger>
                    <TabsTrigger
                      value="faq"
                      className={`rounded-xl ${activeTab === "faq" ? `bg-gradient-to-r ${softPinkTheme.primaryGradient} text-white` : "hover:bg-pink-50"}`}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      FAQ
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="overview" className="p-6 space-y-6">
                  <div>
                    <h3 className="text-xl font-bold mb-4">Mô tả chi tiết</h3>
                    <div className="prose max-w-none">
                      <FormattedDescription
                        text={product.description}
                        className="text-gray-700 leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <h3 className="text-xl font-bold mb-4">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="cursor-pointer hover:bg-pink-50 border-pink-200"
                        >
                          <Bookmark className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="p-6">
                  <ReviewSection productId={product.id} />
                </TabsContent>

                <TabsContent value="specs" className="p-6">
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold">Thông số kỹ thuật</h3>

                    {specifications.map((spec, index) => (
                      <Card key={index} className="p-6">
                        <h4 className="font-semibold mb-4 text-lg">
                          {spec.category}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {spec.specs.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                            >
                              <span className="font-medium text-gray-700">
                                {item.label}
                              </span>
                              <span className="font-semibold text-gray-900">
                                {item.value}{" "}
                                {item.unit && (
                                  <span className="text-gray-500">
                                    {item.unit}
                                  </span>
                                )}
                              </span>
                            </div>
                          ))}
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="faq" className="p-6">
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold">Câu hỏi thường gặp</h3>

                    <Accordion type="single" collapsible className="space-y-4">
                      {faqs.map((faq, index) => (
                        <AccordionItem
                          key={index}
                          value={`item-${index}`}
                          className="border border-pink-200 rounded-xl px-4 data-[state=open]:bg-pink-50/50"
                        >
                          <AccordionTrigger className="hover:no-underline py-4">
                            <div className="flex items-center gap-3 text-left">
                              <Badge variant="outline" className="text-xs">
                                {faq.category}
                              </Badge>
                              <span className="font-medium">
                                {faq.question}
                              </span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pb-4">
                            <div className="space-y-3">
                              <p className="text-gray-700 leading-relaxed">
                                {faq.answer}
                              </p>
                              {faq.helpful && (
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                  <ThumbsUp className="w-4 h-4" />
                                  <span>{faq.helpful} người thấy hữu ích</span>
                                </div>
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </motion.div>

          {/* Related products */}
          {relatedProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Card
                className={`border-0 ${softPinkTheme.softGlow} bg-gradient-to-br ${softPinkTheme.neoCard} backdrop-blur-xl`}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Sparkles className="w-6 h-6 text-pink-500" />
                    Sản phẩm liên quan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {relatedProducts.slice(0, 4).map((p, index) => (
                      <motion.div
                        key={p.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <ProductCard product={p} />
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Floating components */}
        <ScrollToTopButton show={showScrollToTop} />

        <ImageModal
          isOpen={isImageModalOpen}
          onClose={() => setIsImageModalOpen(false)}
          product={product}
          imageIndex={modalImageIndex}
          setImageIndex={setModalImageIndex}
        />

        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          product={product}
        />
      </motion.div>
    </>
  );
};

export default ProductDetail;
