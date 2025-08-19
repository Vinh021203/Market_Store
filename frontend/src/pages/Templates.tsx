import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import { filterProducts } from "@/lib/products";
import { getProductsByCategory } from "@/lib/products";
import { Product } from "@/types";
import { FilterOptions } from "@/types";
import { useCart } from "@/contexts/CartContext";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  X,
  Package,
  Grid,
  List,
  SlidersHorizontal,
  ArrowUpDown,
  Star,
  TrendingUp,
  User,
  Gift,
  Sparkles,
  Code,
  Palette,
  Coffee,
  Zap,
  Award,
  Eye,
  Heart,
  Download,
  Clock,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Layers,
  ArrowUp,
  Crown,
  Rocket,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Share2,
  MessageSquare,
  ThumbsUp,
  Flame,
  Percent,
  Target,
  Sun,
  Moon,
  Layout,
  PaintBucket,
  Database,
  Smartphone,
  Monitor,
  Globe,
  ShoppingBag,
  FileText,
  Image,
  Video,
  Music,
  Settings,
  Briefcase,
  Users,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Building,
  Home,
  Car,
  Plane,
  Camera,
  Gamepad2,
  BookOpen,
  GraduationCap,
  Stethoscope,
  Utensils,
  ShirtIcon as Shirt,
  DollarSign,
  CreditCard,
  Wallet,
  PiggyBank,
  TrendingDown,
  BarChart,
  LineChart,
  PieChart,
  Activity,
  Cpu,
  HardDrive,
  Wifi,
  Bluetooth,
  Battery,
  Plug,
  Radio,
  Headphones,
  Mic,
  Volume2,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  CloudDownload,
  CloudUpload,
  Cloud,
  Server,
  Shield,
  Lock,
  Unlock,
  Key,
  UserCheck,
  UserPlus,
  UserMinus,
  Users2,
  MessageCircleMore,
  Send,
  Inbox,
  Archive,
  Trash2,
  Edit,
  Copy,
  Clipboard,
  Link,
  ExternalLink,
  Maximize,
  Minimize,
  RotateCw,
  RefreshCw,
  PowerOff,
  Wrench,
  Hammer,
  Scissors,
  Ruler,
  Compass,
  Calculator,
  Thermometer,
  Droplets,
  Wind,
  Snowflake,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Umbrella,
  TreePine,
  Flower,
  Leaf,
  Bug,
  Fish,
  Bird,
  Cat,
  Dog,
  Rabbit,
  Apple,
  Coffee as CoffeeIcon,
  Wine,
  ShoppingCart,
  Package2,
  Truck,
  Ship,
  Train,
  Bus,
  Bike,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Enhanced Loading Component với animation mượt mà hơn
const EnhancedLoadingSpinner = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-purple-900 dark:to-indigo-900 relative overflow-hidden">
    {/* Animated Background Gradients */}
    <div className="absolute inset-0">
      <motion.div
        animate={{
          background: [
            "linear-gradient(45deg, rgba(59,130,246,0.1), rgba(147,51,234,0.1))",
            "linear-gradient(45deg, rgba(147,51,234,0.1), rgba(236,72,153,0.1))",
            "linear-gradient(45deg, rgba(236,72,153,0.1), rgba(59,130,246,0.1))",
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute top-20 left-20 w-72 h-72 bg-blue-400/20 rounded-full filter blur-3xl"
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.6, 0.3, 0.6] }}
        transition={{ duration: 4, repeat: Infinity, delay: 2 }}
        className="absolute bottom-20 right-20 w-72 h-72 bg-purple-400/20 rounded-full filter blur-3xl"
      />
    </div>

    {/* Floating Tech Icons */}
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {[
        { icon: Code, color: "text-blue-500/30", delay: 0 },
        { icon: Palette, color: "text-purple-500/30", delay: 0.5 },
        { icon: Database, color: "text-green-500/30", delay: 1 },
        { icon: Smartphone, color: "text-pink-500/30", delay: 1.5 },
        { icon: Monitor, color: "text-indigo-500/30", delay: 2 },
        { icon: Globe, color: "text-cyan-500/30", delay: 2.5 },
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

    <div className="container relative z-10 px-4 py-8 mx-auto">
      <div className="flex flex-col items-center justify-center py-20 md:py-32 space-y-10 md:space-y-16">
        {/* Enhanced Loading Animation */}
        <div className="relative">
          {/* Outer Ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 md:w-32 md:h-32 border-4 rounded-full"
            style={{
              borderImage:
                "linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6) 1",
              borderTopColor: "transparent",
            }}
          />

          {/* Inner Ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-3 md:inset-4 border-4 rounded-full border-purple-300 border-r-transparent"
          />

          {/* Center Icon */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute inset-6 md:inset-8 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-xl"
          >
            <Package className="w-6 h-6 md:w-8 md:h-8 text-white" />
          </motion.div>

          {/* Orbiting Dots */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
              style={{
                top: "50%",
                left: "50%",
                transformOrigin: `${20 + Math.random() * 20}px 0`,
              }}
              animate={{ rotate: 360 }}
              transition={{
                duration: 2 + i * 0.3,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.2,
              }}
            />
          ))}
        </div>

        {/* Loading Content */}
        <div className="text-center space-y-6 md:space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Đang tải Templates
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4 leading-relaxed">
              Chúng tôi đang chuẩn bị bộ sưu tập templates chuyên nghiệp và chất
              lượng cao nhất cho dự án của bạn
            </p>
          </motion.div>

          {/* Loading Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="space-y-4"
          >
            {[
              "Đang tải danh mục templates...",
              "Xử lý hình ảnh chất lượng cao...",
              "Chuẩn bị bộ lọc thông minh...",
              "Tối ưu hóa trải nghiệm người dùng...",
              "Hoàn tất!",
            ].map((step, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0.3, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.8, duration: 0.6 }}
                className="flex items-center justify-center space-x-3"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.8 + 0.3 }}
                  className="w-2 h-2 md:w-3 md:h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                />
                <span className="text-sm md:text-base text-muted-foreground">
                  {step}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5 }}
            className="w-80 md:w-96 max-w-full mx-auto"
          >
            <div className="h-2 md:h-3 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full overflow-hidden shadow-inner">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full shadow-lg"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
            <div className="flex justify-center mt-3">
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-xs md:text-sm text-muted-foreground font-medium"
              >
                Đang xử lý...
              </motion.span>
            </div>
          </motion.div>
        </div>

        {/* Tech Stack Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          className="grid grid-cols-4 md:grid-cols-6 gap-4 md:gap-8"
        >
          {[
            { icon: Code, label: "React", color: "from-blue-400 to-blue-600" },
            {
              icon: Database,
              label: "Backend",
              color: "from-green-400 to-green-600",
            },
            {
              icon: Smartphone,
              label: "Mobile",
              color: "from-pink-400 to-pink-600",
            },
            {
              icon: Monitor,
              label: "Desktop",
              color: "from-purple-400 to-purple-600",
            },
            { icon: Globe, label: "Web", color: "from-cyan-400 to-cyan-600" },
            {
              icon: Palette,
              label: "Design",
              color: "from-orange-400 to-orange-600",
            },
          ].map(({ icon: Icon, label, color }, index) => (
            <motion.div
              key={label}
              animate={{
                scale: [1, 1.1, 1],
                rotateY: [0, 180, 360],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: index * 0.4,
              }}
              className={`p-3 md:p-4 rounded-2xl bg-gradient-to-r ${color} shadow-lg backdrop-blur-sm`}
            >
              <Icon className="w-6 h-6 md:w-8 md:h-8 text-white mx-auto mb-2" />
              <div className="text-xs md:text-sm text-white font-semibold text-center">
                {label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Loading Dots */}
        <div className="flex justify-center space-x-2">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-2 h-2 md:w-3 md:h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
            />
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Mobile-First Filter Sheet Component với UI chuyên nghiệp
const MobileFilterSheet = ({
  filters,
  templateTags,
  priceRanges,
  sortOptions,
  searchInput,
  setSearchInput,
  handleSearch,
  handleSortChange,
  toggleTag,
  handlePriceRangeChange,
  clearFilters,
  products,
}) => {
  const [expandedSections, setExpandedSections] = useState({
    search: true,
    sort: false,
    price: false,
    tags: false,
    categories: false,
    advanced: false,
  });

  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [showOnlyFree, setShowOnlyFree] = useState(false);
  const [showOnlyPremium, setShowOnlyPremium] = useState(false);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const activeFiltersCount =
    (filters.search ? 1 : 0) +
    (filters.tags?.length || 0) +
    (filters.priceRange ? 1 : 0);

  // Category mapping với icons thật
  const categoryIcons = {
    Dashboard: BarChart3,
    "E-commerce": ShoppingCart,
    "Landing Page": Rocket,
    "Admin Panel": Settings,
    Portfolio: Briefcase,
    Blog: BookOpen,
    Corporate: Building,
    Education: GraduationCap,
    Healthcare: Stethoscope,
    Restaurant: Utensils,
    Fashion: Shirt,
    Finance: DollarSign,
    Travel: Plane,
    Photography: Camera,
    Gaming: Gamepad2,
    Music: Music,
    Video: Video,
    "Social Media": Users2,
    Chat: MessageSquare,
    Calendar: Calendar,
    Email: Mail,
    Maps: MapPin,
    Weather: Cloud,
    News: FileText,
    CRM: Database,
    Analytics: Activity,
    "Mobile App": Smartphone,
    Desktop: Monitor,
    "Web App": Globe,
    SaaS: Server,
    Startup: Rocket,
    Agency: Award,
    Freelancer: User,
    Company: Building,
    Personal: Home,
  };

  // Popular categories
  const popularCategories = [
    "Dashboard",
    "E-commerce",
    "Landing Page",
    "Admin Panel",
    "Portfolio",
    "Blog",
    "Corporate",
    "SaaS",
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className="w-full h-14 justify-between bg-white/95 dark:bg-slate-800/95 backdrop-blur-lg border-2 border-blue-200/50 hover:border-blue-300 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 shadow-md mr-3">
              <SlidersHorizontal className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-base">Bộ lọc thông minh</div>
              <div className="text-xs text-muted-foreground">
                Tìm template hoàn hảo
              </div>
            </div>
          </div>
          {activeFiltersCount > 0 && (
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header với gradient */}
          <SheetHeader className="pb-6 border-b bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 -mx-6 -mt-6 px-6 pt-6">
            <SheetTitle className="flex items-center text-2xl">
              <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg mr-3">
                <Filter className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">
                  Bộ lọc thông minh
                </div>
                <div className="text-sm text-muted-foreground font-normal">
                  Powered by AI • {products.length} templates
                </div>
              </div>
            </SheetTitle>
          </SheetHeader>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto space-y-6 py-6">
            {/* Quick Search với AI */}
            <div className="space-y-4">
              <Button
                variant="ghost"
                onClick={() => toggleSection("search")}
                className="w-full justify-between p-0 h-auto hover:bg-blue-50 dark:hover:bg-blue-950/20"
              >
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 mr-3">
                    <Search className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Tìm kiếm AI</div>
                    <div className="text-sm text-muted-foreground">
                      Mô tả ý tưởng của bạn
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {filters.search && (
                    <Badge variant="secondary" className="text-xs">
                      Đang lọc
                    </Badge>
                  )}
                  {expandedSections.search ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              </Button>

              <AnimatePresence>
                {expandedSections.search && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    <form onSubmit={handleSearch} className="space-y-3">
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder="VD: Landing page cho startup công nghệ..."
                          value={searchInput}
                          onChange={(e) => setSearchInput(e.target.value)}
                          className="h-14 pl-12 pr-16 text-base bg-gradient-to-r from-white to-blue-50 dark:from-slate-800 dark:to-blue-950 border-2 border-blue-200 focus:border-blue-500 rounded-xl shadow-sm"
                        />
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                          <Badge
                            variant="secondary"
                            className="text-xs bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700"
                          >
                            AI
                          </Badge>
                        </div>
                      </div>
                      <Button
                        type="submit"
                        className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Search className="w-4 h-4 mr-2" />
                        Tìm kiếm thông minh
                      </Button>
                    </form>

                    {/* Quick Search Suggestions */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">
                        Gợi ý tìm kiếm:
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "Dashboard analytics",
                          "E-commerce modern",
                          "Landing page SaaS",
                          "Portfolio creative",
                          "Admin panel dark",
                        ].map((suggestion) => (
                          <Button
                            key={suggestion}
                            variant="outline"
                            size="sm"
                            onClick={() => setSearchInput(suggestion)}
                            className="text-xs h-8 bg-gradient-to-r from-gray-50 to-blue-50 hover:from-blue-50 hover:to-purple-50 border-blue-200 hover:border-blue-300"
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Separator className="bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

            {/* Categories với icons */}
            <div className="space-y-4">
              <Button
                variant="ghost"
                onClick={() => toggleSection("categories")}
                className="w-full justify-between p-0 h-auto hover:bg-purple-50 dark:hover:bg-purple-950/20"
              >
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 mr-3">
                    <Layout className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Danh mục</div>
                    <div className="text-sm text-muted-foreground">
                      Chọn theo lĩnh vực
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs">
                    {popularCategories.length}
                  </Badge>
                  {expandedSections.categories ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              </Button>

              <AnimatePresence>
                {expandedSections.categories && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      {popularCategories.map((category) => {
                        const IconComponent =
                          categoryIcons[category] || Package;
                        return (
                          <Button
                            key={category}
                            variant="outline"
                            className="h-16 flex flex-col items-center justify-center space-y-1 bg-gradient-to-br from-white to-gray-50 hover:from-purple-50 hover:to-pink-50 border-purple-200 hover:border-purple-300 shadow-sm hover:shadow-md transition-all duration-300"
                          >
                            <IconComponent className="w-5 h-5 text-purple-600" />
                            <span className="text-xs font-medium">
                              {category}
                            </span>
                          </Button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Separator className="bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

            {/* Sort Options với icons */}
            <div className="space-y-4">
              <Button
                variant="ghost"
                onClick={() => toggleSection("sort")}
                className="w-full justify-between p-0 h-auto hover:bg-green-50 dark:hover:bg-green-950/20"
              >
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 mr-3">
                    <ArrowUpDown className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Sắp xếp</div>
                    <div className="text-sm text-muted-foreground">
                      Thứ tự hiển thị
                    </div>
                  </div>
                </div>
                {expandedSections.sort ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </Button>

              <AnimatePresence>
                {expandedSections.sort && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Select
                      value={filters.sortBy || "newest"}
                      onValueChange={handleSortChange}
                    >
                      <SelectTrigger className="h-14 bg-gradient-to-r from-white to-green-50 dark:from-slate-800 dark:to-green-950 border-2 border-green-200 focus:border-green-500 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sortOptions.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className="h-12"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="p-1 rounded bg-gradient-to-r from-green-100 to-emerald-100">
                                <option.icon className="w-4 h-4 text-green-600" />
                              </div>
                              <span className="font-medium">
                                {option.label}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Separator className="bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

            {/* Advanced Price Range với slider */}
            <div className="space-y-4">
              <Button
                variant="ghost"
                onClick={() => toggleSection("price")}
                className="w-full justify-between p-0 h-auto hover:bg-orange-50 dark:hover:bg-orange-950/20"
              >
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 mr-3">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Khoảng giá</div>
                    <div className="text-sm text-muted-foreground">
                      Tùy chỉnh ngân sách
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {filters.priceRange && (
                    <Badge
                      variant="secondary"
                      className="text-xs bg-orange-100 text-orange-700"
                    >
                      Đã chọn
                    </Badge>
                  )}
                  {expandedSections.price ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              </Button>

              <AnimatePresence>
                {expandedSections.price && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-6"
                  >
                    {/* Price Slider */}
                    <div className="space-y-4 p-4 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 rounded-xl border border-orange-200">
                      <div className="flex justify-between items-center">
                        <Label className="text-sm font-medium">
                          Tùy chỉnh khoảng giá
                        </Label>
                        <div className="text-xs text-muted-foreground">
                          {priceRange[0].toLocaleString()}đ -{" "}
                          {priceRange[1].toLocaleString()}đ
                        </div>
                      </div>
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={2000000}
                        min={0}
                        step={50000}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0đ</span>
                        <span>2,000,000đ</span>
                      </div>
                    </div>

                    {/* Quick Price Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                      {priceRanges.map((range, index) => (
                        <Button
                          key={index}
                          variant={
                            JSON.stringify(filters.priceRange) ===
                            JSON.stringify(range.value)
                              ? "default"
                              : "outline"
                          }
                          onClick={() => handlePriceRangeChange(range.value)}
                          className="h-14 flex flex-col items-center justify-center space-y-1 bg-gradient-to-br from-white to-orange-50 hover:from-orange-50 hover:to-red-50 border-orange-200 hover:border-orange-300"
                        >
                          <span className="text-lg">{range.icon}</span>
                          <span className="text-xs font-medium">
                            {range.label}
                          </span>
                        </Button>
                      ))}
                    </div>

                    {/* Price Type Switches */}
                    <div className="space-y-3 p-4 bg-white dark:bg-slate-800 rounded-xl border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Gift className="w-4 h-4 text-green-500" />
                          <Label className="text-sm">
                            Chỉ templates miễn phí
                          </Label>
                        </div>
                        <Switch
                          checked={showOnlyFree}
                          onCheckedChange={setShowOnlyFree}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Crown className="w-4 h-4 text-yellow-500" />
                          <Label className="text-sm">
                            Chỉ templates premium
                          </Label>
                        </div>
                        <Switch
                          checked={showOnlyPremium}
                          onCheckedChange={setShowOnlyPremium}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Separator className="bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

            {/* Technology Tags với icons */}
            <div className="space-y-4">
              <Button
                variant="ghost"
                onClick={() => toggleSection("tags")}
                className="w-full justify-between p-0 h-auto hover:bg-cyan-50 dark:hover:bg-cyan-950/20"
              >
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 mr-3">
                    <Code className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Công nghệ</div>
                    <div className="text-sm text-muted-foreground">
                      Framework & Tools
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant="secondary"
                    className="text-xs bg-cyan-100 text-cyan-700"
                  >
                    {templateTags.length}
                  </Badge>
                  {expandedSections.tags ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              </Button>

              <AnimatePresence>
                {expandedSections.tags && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    {/* Popular Tech Tags */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-muted-foreground flex items-center">
                        <Flame className="w-4 h-4 mr-1 text-orange-500" />
                        Công nghệ phổ biến
                      </Label>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {templateTags.slice(0, 12).map((tag) => (
                          <Button
                            key={tag}
                            variant={
                              filters.tags?.includes(tag)
                                ? "default"
                                : "outline"
                            }
                            onClick={() => toggleTag(tag)}
                            className="w-full h-12 justify-between bg-gradient-to-r from-white to-cyan-50 hover:from-cyan-50 hover:to-blue-50 border-cyan-200 hover:border-cyan-300"
                          >
                            <div className="flex items-center space-x-3">
                              {filters.tags?.includes(tag) && (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              )}
                              <Code className="w-4 h-4 text-cyan-600" />
                              <span className="font-medium">{tag}</span>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {Math.floor(Math.random() * 50) + 10}
                            </Badge>
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Show More Tags */}
                    {templateTags.length > 12 && (
                      <Button
                        variant="ghost"
                        className="w-full text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50"
                      >
                        <ChevronDown className="w-4 h-4 mr-2" />
                        Xem thêm {templateTags.length - 12} công nghệ khác
                      </Button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Separator className="bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

            {/* Advanced Filters */}
            <div className="space-y-4">
              <Button
                variant="ghost"
                onClick={() => toggleSection("advanced")}
                className="w-full justify-between p-0 h-auto hover:bg-indigo-50 dark:hover:bg-indigo-950/20"
              >
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 mr-3">
                    <Settings className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Bộ lọc nâng cao</div>
                    <div className="text-sm text-muted-foreground">
                      Tùy chọn chi tiết
                    </div>
                  </div>
                </div>
                {expandedSections.advanced ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </Button>

              <AnimatePresence>
                {expandedSections.advanced && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 rounded-xl border border-indigo-200"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm flex items-center">
                          <Star className="w-4 h-4 mr-1 text-yellow-500" />
                          Đánh giá tối thiểu
                        </Label>
                        <Select defaultValue="4">
                          <SelectTrigger className="h-10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="3">3+ sao</SelectItem>
                            <SelectItem value="4">4+ sao</SelectItem>
                            <SelectItem value="5">5 sao</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm flex items-center">
                          <Download className="w-4 h-4 mr-1 text-green-500" />
                          Lượt tải
                        </Label>
                        <Select defaultValue="100">
                          <SelectTrigger className="h-10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="10">10+ lượt</SelectItem>
                            <SelectItem value="100">100+ lượt</SelectItem>
                            <SelectItem value="1000">1000+ lượt</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-sm font-medium">
                        Tính năng đặc biệt
                      </Label>
                      <div className="space-y-2">
                        {[
                          {
                            icon: Smartphone,
                            label: "Responsive Design",
                            color: "text-blue-500",
                          },
                          {
                            icon: Palette,
                            label: "Dark Mode Support",
                            color: "text-purple-500",
                          },
                          {
                            icon: Zap,
                            label: "Fast Loading",
                            color: "text-yellow-500",
                          },
                          {
                            icon: Shield,
                            label: "SEO Optimized",
                            color: "text-green-500",
                          },
                        ].map((feature) => (
                          <div
                            key={feature.label}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center space-x-2">
                              <feature.icon
                                className={`w-4 h-4 ${feature.color}`}
                              />
                              <span className="text-sm">{feature.label}</span>
                            </div>
                            <Switch />
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Fixed Bottom Actions */}
          <div className="border-t bg-white dark:bg-slate-900 p-4 -mx-6 -mb-6">
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={clearFilters}
                className="flex-1 h-12 border-2 hover:bg-red-50 hover:border-red-200"
              >
                <X className="w-4 h-4 mr-2" />
                Xóa bộ lọc
              </Button>
              <SheetClose asChild>
                <Button className="flex-2 h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Áp dụng ({products.length})
                </Button>
              </SheetClose>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

// Enhanced Desktop Filter Sidebar với UI chuyên nghiệp
const DesktopFilterSidebar = ({
  filters,
  templateTags,
  priceRanges,
  sortOptions,
  searchInput,
  setSearchInput,
  handleSearch,
  handleSortChange,
  toggleTag,
  handlePriceRangeChange,
  clearFilters,
  products,
}) => {
  const [priceRange, setPriceRange] = useState([0, 2000000]);
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    tags: false,
    advanced: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Category stats
  const categoryStats = useMemo(() => {
    const stats = {};
    templateTags.forEach((tag) => {
      stats[tag] = Math.floor(Math.random() * 100) + 5; // Mock data
    });
    return stats;
  }, [templateTags]);

  return (
    <motion.aside
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      className="hidden xl:block w-96 flex-shrink-0"
    >
      <div className="sticky top-8 space-y-6 max-h-screen overflow-y-auto">
        {/* Main Filter Card */}
        <Card className="shadow-2xl border-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl overflow-hidden">
          {/* Enhanced Header */}
          <CardHeader className="pb-6 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 via-purple-400/5 to-pink-400/5"></div>
            <CardTitle className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 shadow-xl">
                    <Filter className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Bộ lọc thông minh
                    </div>
                    <div className="text-sm text-muted-foreground font-normal">
                      AI-Powered • {products.length} templates
                    </div>
                  </div>
                </div>
                <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-0">
                  Pro
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-8 p-8">
            {/* AI Search Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-lg">Tìm kiếm thông minh</h3>
                <Badge
                  variant="secondary"
                  className="ml-auto bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700"
                >
                  AI
                </Badge>
              </div>

              <form onSubmit={handleSearch} className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Mô tả ý tưởng template của bạn..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="h-12 pl-12 pr-16 bg-gradient-to-r from-white to-blue-50 dark:from-slate-800 dark:to-blue-950 border-2 border-blue-200 focus:border-blue-500 rounded-xl shadow-sm"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Sparkles className="w-5 h-5 text-blue-500" />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Tìm kiếm AI
                </Button>
              </form>

              {/* Quick Search Suggestions */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  Gợi ý phổ biến:
                </Label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Dashboard SaaS",
                    "E-commerce modern",
                    "Landing startup",
                    "Portfolio creative",
                  ].map((suggestion) => (
                    <Button
                      key={suggestion}
                      variant="outline"
                      size="sm"
                      onClick={() => setSearchInput(suggestion)}
                      className="text-xs h-8 bg-gradient-to-r from-gray-50 to-blue-50 hover:from-blue-50 hover:to-purple-50 border-blue-200 hover:border-blue-300 rounded-lg"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <Separator className="bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

            {/* Sort Section với enhanced UI */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500">
                  <ArrowUpDown className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-lg">Sắp xếp</h3>
              </div>

              <Select
                value={filters.sortBy || "newest"}
                onValueChange={handleSortChange}
              >
                <SelectTrigger className="h-14 bg-gradient-to-r from-white to-green-50 dark:from-slate-800 dark:to-green-950 border-2 border-green-200 focus:border-green-500 rounded-xl shadow-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="min-w-[350px]">
                  {sortOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="h-14 cursor-pointer"
                    >
                      <div className="flex items-center space-x-4 w-full">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-green-100 to-emerald-100">
                          <option.icon className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold">{option.label}</div>
                          <div className="text-xs text-muted-foreground">
                            {option.value === "newest" &&
                              "Templates được tạo gần đây nhất"}
                            {option.value === "popular" &&
                              "Được tải nhiều nhất"}
                            {option.value === "rating" && "Đánh giá cao nhất"}
                            {option.value === "price_low" &&
                              "Phù hợp với ngân sách thấp"}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator className="bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

            {/* Enhanced Price Range */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-lg">Khoảng giá</h3>
              </div>

              {/* Custom Price Slider */}
              <div className="space-y-4 p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 rounded-2xl border border-orange-200">
                <div className="flex justify-between items-center">
                  <Label className="font-medium">Tùy chỉnh khoảng giá</Label>
                  <div className="text-sm font-mono bg-white dark:bg-slate-800 px-3 py-1 rounded-lg border">
                    {priceRange[0].toLocaleString()}đ -{" "}
                    {priceRange[1].toLocaleString()}đ
                  </div>
                </div>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={2000000}
                  min={0}
                  step={50000}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Miễn phí</span>
                  <span>2,000,000đ</span>
                </div>
              </div>

              {/* Quick Price Buttons */}
              <div className="grid grid-cols-2 gap-4">
                {priceRanges.map((range, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant={
                        JSON.stringify(filters.priceRange) ===
                        JSON.stringify(range.value)
                          ? "default"
                          : "outline"
                      }
                      onClick={() => handlePriceRangeChange(range.value)}
                      className={`w-full h-16 flex flex-col items-center justify-center space-y-1 ${
                        JSON.stringify(filters.priceRange) ===
                        JSON.stringify(range.value)
                          ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                          : "bg-gradient-to-br from-white to-orange-50 hover:from-orange-50 hover:to-red-50 border-2 border-orange-200 hover:border-orange-300 shadow-sm hover:shadow-md"
                      } transition-all duration-300 rounded-xl`}
                    >
                      <span className="text-xl">{range.icon}</span>
                      <span className="text-sm font-semibold">
                        {range.label}
                      </span>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>

            <Separator className="bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

            {/* Categories Section */}
            <div className="space-y-4">
              <Button
                variant="ghost"
                onClick={() => toggleSection("categories")}
                className="w-full justify-between p-0 h-auto hover:bg-purple-50 dark:hover:bg-purple-950/20 rounded-xl transition-all duration-300"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
                    <Layout className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-lg">Danh mục</h3>
                    <p className="text-sm text-muted-foreground">
                      Chọn theo lĩnh vực
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant="secondary"
                    className="bg-purple-100 text-purple-700 px-2 py-1"
                  >
                    8 phổ biến
                  </Badge>
                  {expandedSections.categories ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              </Button>

              <AnimatePresence>
                {expandedSections.categories && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="space-y-4"
                  >
                    {/* Enhanced Categories Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        {
                          name: "Dashboard",
                          icon: BarChart3,
                          count: 45,
                          color: "from-blue-500 to-cyan-500",
                          bgColor: "from-blue-50 to-cyan-50",
                          darkBgColor: "from-blue-900/20 to-cyan-900/20",
                        },
                        {
                          name: "E-commerce",
                          icon: ShoppingCart,
                          count: 38,
                          color: "from-green-500 to-emerald-500",
                          bgColor: "from-green-50 to-emerald-50",
                          darkBgColor: "from-green-900/20 to-emerald-900/20",
                        },
                        {
                          name: "Landing",
                          icon: Rocket,
                          count: 52,
                          color: "from-purple-500 to-pink-500",
                          bgColor: "from-purple-50 to-pink-50",
                          darkBgColor: "from-purple-900/20 to-pink-900/20",
                        },
                        {
                          name: "Admin",
                          icon: Settings,
                          count: 29,
                          color: "from-orange-500 to-red-500",
                          bgColor: "from-orange-50 to-red-50",
                          darkBgColor: "from-orange-900/20 to-red-900/20",
                        },
                        {
                          name: "Portfolio",
                          icon: Briefcase,
                          count: 34,
                          color: "from-indigo-500 to-purple-500",
                          bgColor: "from-indigo-50 to-purple-50",
                          darkBgColor: "from-indigo-900/20 to-purple-900/20",
                        },
                        {
                          name: "Blog",
                          icon: BookOpen,
                          count: 28,
                          color: "from-cyan-500 to-blue-500",
                          bgColor: "from-cyan-50 to-blue-50",
                          darkBgColor: "from-cyan-900/20 to-blue-900/20",
                        },
                        {
                          name: "Corporate",
                          icon: Building,
                          count: 22,
                          color: "from-gray-500 to-slate-500",
                          bgColor: "from-gray-50 to-slate-50",
                          darkBgColor: "from-gray-900/20 to-slate-900/20",
                        },
                        {
                          name: "SaaS",
                          icon: Server,
                          count: 41,
                          color: "from-emerald-500 to-green-500",
                          bgColor: "from-emerald-50 to-green-50",
                          darkBgColor: "from-emerald-900/20 to-green-900/20",
                        },
                      ].map((category) => (
                        <motion.div
                          key={category.name}
                          whileHover={{ scale: 1.03, y: -2 }}
                          whileTap={{ scale: 0.97 }}
                          className="group"
                        >
                          <Button
                            variant="outline"
                            className={`relative w-full h-20 p-4 border-2 border-transparent bg-gradient-to-br ${category.bgColor} dark:${category.darkBgColor} hover:border-purple-200 dark:hover:border-purple-700 shadow-sm hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden`}
                          >
                            {/* Background Gradient on Hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            {/* Content */}
                            <div className="relative z-10 flex items-center justify-between w-full">
                              {/* Left Side - Icon & Name */}
                              <div className="flex items-center space-x-3">
                                <div
                                  className={`p-2.5 rounded-xl bg-gradient-to-r ${category.color} shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300`}
                                >
                                  <category.icon className="w-5 h-5 text-white" />
                                </div>
                                <div className="text-left">
                                  <div className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">
                                    {category.name}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    Templates
                                  </div>
                                </div>
                              </div>

                              {/* Right Side - Count */}
                              <div className="flex flex-col items-end">
                                <Badge
                                  className={`bg-gradient-to-r ${category.color} text-white border-0 shadow-sm group-hover:shadow-md transition-all duration-300`}
                                >
                                  {category.count}
                                </Badge>
                                <div className="text-xs text-muted-foreground mt-1">
                                  available
                                </div>
                              </div>
                            </div>
                          </Button>
                        </motion.div>
                      ))}
                    </div>

                    {/* Additional Info */}
                    <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Sparkles className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-medium text-purple-900 dark:text-purple-300">
                            Có thêm nhiều danh mục khác
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-purple-600 hover:text-purple-700"
                        >
                          <ChevronDown className="w-4 h-4 mr-1" />
                          Xem tất cả
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Separator className="bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

            {/* Technology Tags */}
            <div className="space-y-4">
              <Button
                variant="ghost"
                onClick={() => toggleSection("tags")}
                className="w-full justify-between p-0 h-auto hover:bg-cyan-50 dark:hover:bg-cyan-950/20"
              >
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500">
                    <Code className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-lg">Công nghệ</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant="secondary"
                    className="bg-cyan-100 text-cyan-700"
                  >
                    {filters.tags?.length || 0} đã chọn
                  </Badge>
                  {expandedSections.tags ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              </Button>

              <AnimatePresence>
                {expandedSections.tags && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    {/* Popular Tags */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium text-muted-foreground flex items-center">
                        <Flame className="w-4 h-4 mr-1 text-orange-500" />
                        Công nghệ phổ biến
                      </Label>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {templateTags.slice(0, 15).map((tag) => (
                          <motion.div
                            key={tag}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                          >
                            <Button
                              variant={
                                filters.tags?.includes(tag)
                                  ? "default"
                                  : "outline"
                              }
                              onClick={() => toggleTag(tag)}
                              className={`w-full h-12 justify-between group transition-all duration-300 ${
                                filters.tags?.includes(tag)
                                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg"
                                  : "bg-gradient-to-r from-white to-cyan-50 hover:from-cyan-50 hover:to-blue-50 border-2 border-cyan-200 hover:border-cyan-300"
                              } rounded-xl`}
                            >
                              <div className="flex items-center space-x-3">
                                {filters.tags?.includes(tag) ? (
                                  <CheckCircle className="w-4 h-4 text-white" />
                                ) : (
                                  <Code className="w-4 h-4 text-cyan-600 group-hover:scale-110 transition-transform" />
                                )}
                                <span className="font-medium">{tag}</span>
                              </div>
                              <Badge
                                variant="secondary"
                                className={`text-xs ${
                                  filters.tags?.includes(tag)
                                    ? "bg-white/20 text-white"
                                    : "bg-cyan-100 text-cyan-700"
                                }`}
                              >
                                {categoryStats[tag] ||
                                  Math.floor(Math.random() * 50) + 10}
                              </Badge>
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Show All Tags */}
                    {templateTags.length > 15 && (
                      <Button
                        variant="ghost"
                        className="w-full text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50 rounded-xl"
                      >
                        <ChevronDown className="w-4 h-4 mr-2" />
                        Xem thêm {templateTags.length - 15} công nghệ khác
                      </Button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Separator className="bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

            {/* Advanced Filters */}
            <div className="space-y-4">
              <Button
                variant="ghost"
                onClick={() => toggleSection("advanced")}
                className="w-full justify-between p-0 h-auto hover:bg-indigo-50 dark:hover:bg-indigo-950/20"
              >
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500">
                    <Settings className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-lg">Bộ lọc nâng cao</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant="secondary"
                    className="bg-indigo-100 text-indigo-700"
                  >
                    Pro
                  </Badge>
                  {expandedSections.advanced ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              </Button>

              <AnimatePresence>
                {expandedSections.advanced && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-6 p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 rounded-2xl border border-indigo-200"
                  >
                    {/* Rating & Downloads */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold flex items-center">
                          <Star className="w-4 h-4 mr-1 text-yellow-500" />
                          Đánh giá tối thiểu
                        </Label>
                        <Select defaultValue="4">
                          <SelectTrigger className="h-11 bg-white dark:bg-slate-800 border-2 border-indigo-200 rounded-lg">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="3" className="flex items-center">
                              <div className="flex items-center space-x-2">
                                <div className="flex">
                                  {[...Array(3)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className="w-3 h-3 text-yellow-400 fill-yellow-400"
                                    />
                                  ))}
                                  {[...Array(2)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className="w-3 h-3 text-gray-300"
                                    />
                                  ))}
                                </div>
                                <span>3+ sao</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="4">
                              <div className="flex items-center space-x-2">
                                <div className="flex">
                                  {[...Array(4)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className="w-3 h-3 text-yellow-400 fill-yellow-400"
                                    />
                                  ))}
                                  {[...Array(1)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className="w-3 h-3 text-gray-300"
                                    />
                                  ))}
                                </div>
                                <span>4+ sao</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="5">
                              <div className="flex items-center space-x-2">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className="w-3 h-3 text-yellow-400 fill-yellow-400"
                                    />
                                  ))}
                                </div>
                                <span>5 sao</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-sm font-semibold flex items-center">
                          <Download className="w-4 h-4 mr-1 text-green-500" />
                          Lượt tải
                        </Label>
                        <Select defaultValue="100">
                          <SelectTrigger className="h-11 bg-white dark:bg-slate-800 border-2 border-indigo-200 rounded-lg">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="10">10+ lượt tải</SelectItem>
                            <SelectItem value="100">100+ lượt tải</SelectItem>
                            <SelectItem value="1000">1000+ lượt tải</SelectItem>
                            <SelectItem value="10000">10k+ lượt tải</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Special Features */}
                    <div className="space-y-4">
                      <Label className="text-sm font-semibold">
                        Tính năng đặc biệt
                      </Label>
                      <div className="space-y-3">
                        {[
                          {
                            icon: Smartphone,
                            label: "Responsive Design",
                            desc: "Tương thích mọi thiết bị",
                            color: "text-blue-500",
                          },
                          {
                            icon: Palette,
                            label: "Dark Mode Support",
                            desc: "Hỗ trợ chế độ tối",
                            color: "text-purple-500",
                          },
                          {
                            icon: Zap,
                            label: "Fast Loading",
                            desc: "Tải nhanh < 3s",
                            color: "text-yellow-500",
                          },
                          {
                            icon: Shield,
                            label: "SEO Optimized",
                            desc: "Tối ưu SEO tốt",
                            color: "text-green-500",
                          },
                          {
                            icon: Globe,
                            label: "Multi-language",
                            desc: "Đa ngôn ngữ",
                            color: "text-cyan-500",
                          },
                          {
                            icon: Database,
                            label: "CMS Ready",
                            desc: "Tích hợp CMS",
                            color: "text-orange-500",
                          },
                        ].map((feature, index) => (
                          <div
                            key={feature.label}
                            className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border hover:shadow-sm transition-shadow"
                          >
                            <div className="flex items-center space-x-3">
                              <feature.icon
                                className={`w-5 h-5 ${feature.color}`}
                              />
                              <div>
                                <div className="text-sm font-medium">
                                  {feature.label}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {feature.desc}
                                </div>
                              </div>
                            </div>
                            <Switch />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Date Range */}
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-indigo-500" />
                        Ngày tạo
                      </Label>
                      <Select defaultValue="all">
                        <SelectTrigger className="h-11 bg-white dark:bg-slate-800 border-2 border-indigo-200 rounded-lg">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tất cả thời gian</SelectItem>
                          <SelectItem value="week">7 ngày qua</SelectItem>
                          <SelectItem value="month">30 ngày qua</SelectItem>
                          <SelectItem value="quarter">3 tháng qua</SelectItem>
                          <SelectItem value="year">1 năm qua</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>

        {/* Clear Filters Card */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 dark:from-red-950/20 dark:via-pink-950/20 dark:to-rose-950/20">
          <CardContent className="p-6">
            <Button
              variant="outline"
              onClick={clearFilters}
              className="w-full h-14 group hover:bg-red-50 hover:border-red-300 dark:hover:bg-red-950/20 border-2 border-red-200 rounded-xl transition-all duration-300"
            >
              <div className="flex items-center justify-center space-x-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-500 group-hover:scale-110 transition-transform">
                  <X className="w-5 h-5 text-white group-hover:animate-spin" />
                </div>
                <div>
                  <div className="font-bold text-base">Xóa tất cả bộ lọc</div>
                  <div className="text-xs text-muted-foreground">
                    Reset về mặc định
                  </div>
                </div>
              </div>
            </Button>
          </CardContent>
        </Card>

        {/* Stats Card */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 dark:from-blue-950/20 dark:via-cyan-950/20 dark:to-teal-950/20">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-lg">Thống kê</h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-white dark:bg-slate-800 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Package className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium">Tổng templates</span>
                  </div>
                  <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                    {products.length}
                  </Badge>
                </div>

                <div className="flex justify-between items-center p-3 bg-white dark:bg-slate-800 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">Đã chọn tags</span>
                  </div>
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                    {filters.tags?.length || 0}
                  </Badge>
                </div>

                <div className="flex justify-between items-center p-3 bg-white dark:bg-slate-800 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-medium">Kết quả</span>
                  </div>
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    {
                      products.filter(
                        (p) => filterProducts([p], filters).length > 0,
                      ).length
                    }
                  </Badge>
                </div>

                <div className="flex justify-between items-center p-3 bg-white dark:bg-slate-800 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-medium">Tỷ lệ khớp</span>
                  </div>
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                    {Math.round(
                      (products.filter(
                        (p) => filterProducts([p], filters).length > 0,
                      ).length /
                        products.length) *
                        100,
                    ) || 0}
                    %
                  </Badge>
                </div>
              </div>

              {/* Progress visualization */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Độ phù hợp bộ lọc</Label>
                <Progress
                  value={
                    Math.round(
                      (products.filter(
                        (p) => filterProducts([p], filters).length > 0,
                      ).length /
                        products.length) *
                        100,
                    ) || 0
                  }
                  className="h-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.aside>
  );
};

// Enhanced Product Grid giữ nguyên
const EnhancedProductGrid = ({ currentProducts, viewMode, addToCart }) => (
  <AnimatePresence mode="wait">
    {currentProducts.length > 0 ? (
      <motion.div
        key="products-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
            : "space-y-6"
        }
      >
        {currentProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.1,
              duration: 0.4,
            }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="group"
          >
            <ProductCard
              product={product}
              onAddToCart={() => {
                addToCart(product);
                toast({
                  title: "🛒 Đã thêm vào giỏ hàng",
                  description: `${product.title} đã được thêm.`,
                });
              }}
              viewMode={viewMode}
            />
          </motion.div>
        ))}
      </motion.div>
    ) : (
      <motion.div
        key="no-products"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <Card className="py-16 md:py-24 text-center border-0 shadow-xl bg-gradient-to-br from-white via-blue-50 to-purple-50 dark:from-slate-800 dark:via-blue-900 dark:to-purple-900">
          <CardContent className="space-y-6 md:space-y-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <Package className="w-20 h-20 md:w-32 md:h-32 mx-auto mb-4 md:mb-6 text-muted-foreground" />
            </motion.div>

            <div className="space-y-4 md:space-y-6">
              <h3 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Không tìm thấy template
              </h3>
              <p className="max-w-lg mx-auto text-base md:text-xl text-muted-foreground leading-relaxed px-4">
                Thử thay đổi bộ lọc để tìm templates phù hợp
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
              <Button
                onClick={() => window.location.reload()}
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <X className="w-5 h-5 mr-2" />
                Xóa tất cả bộ lọc
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )}
  </AnimatePresence>
);

// Enhanced Header giữ nguyên
const EnhancedHeader = ({ products, filteredProducts, currentProducts }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-6 md:space-y-8"
  >
    {/* Main Header */}
    <div className="text-center md:text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
        <div className="flex flex-col md:flex-row items-center md:items-center space-y-4 md:space-y-0 md:space-x-6">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 2 }}
            className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 shadow-xl rounded-2xl md:rounded-3xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600"
          >
            <Package className="w-8 h-8 md:w-10 md:h-10 text-white" />
          </motion.div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text mb-2">
              Templates
            </h1>
            <p className="text-lg md:text-2xl text-muted-foreground max-w-2xl">
              Khám phá bộ sưu tập templates chuyên nghiệp
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* Stats Grid */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
      {[
        {
          label: "Tổng templates",
          value: products.length,
          icon: Package,
          color: "from-blue-500 to-cyan-500",
        },
        {
          label: "Đã lọc",
          value: filteredProducts.length,
          icon: Filter,
          color: "from-green-500 to-emerald-500",
        },
        {
          label: "Hiển thị",
          value: currentProducts.length,
          icon: Eye,
          color: "from-purple-500 to-pink-500",
        },
        {
          label: "Chất lượng",
          value: "A+",
          icon: Award,
          color: "from-orange-500 to-red-500",
        },
      ].map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.03, y: -2 }}
        >
          <Card className="text-center border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 hover:shadow-xl overflow-hidden relative group">
            <div
              className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
            ></div>
            <CardContent className="p-3 md:p-6 relative z-10">
              <div className="space-y-2 md:space-y-4">
                <div
                  className={`w-8 h-8 md:w-12 md:h-12 mx-auto rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-lg`}
                >
                  <stat.icon className="w-4 h-4 md:w-6 md:h-6 text-white" />
                </div>
                <div className="text-xl md:text-2xl font-bold text-primary">
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm font-medium text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  </motion.div>
);

// Scroll to Top Button giữ nguyên
const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 300);
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          className="fixed bottom-20 right-4 md:bottom-8 md:right-8 z-40"
        >
          <Button
            onClick={scrollToTop}
            size="lg"
            className="w-12 h-12 md:w-14 md:h-14 rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
          >
            <ArrowUp className="w-5 h-5 md:w-6 md:h-6" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Helper function để get price range label
function getPriceRangeLabel(range: [number, number] | undefined) {
  if (!range) return "Tất cả";

  const [min, max] = range;

  if (min === 0 && max === 500000) return "Dưới 500K";
  if (min === 500000 && max === 1500000) return "500K - 1.5M";
  if (min === 1500000 && (max === Infinity || max === 0)) return "Trên 1.5M";

  return `${min.toLocaleString()}đ - ${max.toLocaleString()}đ`;
}

// Main Templates Component
const Templates: React.FC = () => {
  // State Management
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTag = searchParams.get("tag");
  const pageFromUrl = searchParams.get("page");

  const [filters, setFilters] = useState<FilterOptions>({
    category: "template",
    sortBy: "newest",
    search: "",
    tags: selectedTag ? [selectedTag] : [],
    priceRange: undefined,
  });

  const [searchInput, setSearchInput] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  const [currentPage, setCurrentPage] = useState(
    pageFromUrl ? parseInt(pageFromUrl, 10) : 1,
  );
  const [itemsPerPage] = useState(12);
  const [shouldResetPage, setShouldResetPage] = useState(false);

  // Effects
  useEffect(() => {
    if (selectedTag) {
      setFilters((prev) => ({ ...prev, tags: [selectedTag] }));
      setShouldResetPage(true);
    }
  }, [selectedTag]);

  useEffect(() => {
    const page = searchParams.get("page");
    if (page) {
      setCurrentPage(parseInt(page, 10));
    }
  }, [searchParams]);

  useEffect(() => {
    if (shouldResetPage) {
      setCurrentPage(1);
      const params = new URLSearchParams(searchParams);
      params.delete("page");
      setSearchParams(params);
      setShouldResetPage(false);
    }
  }, [shouldResetPage, setSearchParams, searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getProductsByCategory("template");
        setProducts(data);
        toast({
          title: "✅ Đã tải templates",
          description: `Tìm thấy ${data.length} templates chất lượng cao.`,
        });
      } catch (error) {
        toast({
          title: "❌ Lỗi tải dữ liệu",
          description: "Không thể tải danh sách templates.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Computed Values
  const templateTags = useMemo(() => {
    const tags = new Set<string>();
    products.forEach((p) => p.tags.forEach((tag) => tags.add(tag)));
    return Array.from(tags).sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    return filterProducts(products, filters);
  }, [filters, products]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Event Handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const params = new URLSearchParams(searchParams);
    if (page > 1) {
      params.set("page", page.toString());
    } else {
      params.delete("page");
    }
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, search: searchInput }));
    setShouldResetPage(true);
    toast({
      title: "🔍 Đang tìm kiếm...",
      description: `Tìm kiếm "${searchInput}"`,
    });
  };

  const handleSortChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: value as FilterOptions["sortBy"],
    }));
  };

  const toggleTag = (tag: string) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags?.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...(prev.tags || []), tag],
    }));
    setShouldResetPage(true);
  };

  const clearFilters = () => {
    setSearchParams({});
    setFilters({
      category: "template",
      sortBy: "newest",
      search: "",
      tags: [],
      priceRange: undefined,
    });
    setSearchInput("");
    setShouldResetPage(true);
    toast({
      title: "🧹 Đã xóa bộ lọc",
      description: "Hiển thị tất cả templates.",
    });
  };

  const handlePriceRangeChange = (range: [number, number] | undefined) => {
    setFilters((prev) => ({ ...prev, priceRange: range }));
    setShouldResetPage(true);
  };

  // Constants
  const priceRanges = [
    { label: "Tất cả", value: undefined, icon: "💰" },
    { label: "Dưới 200K", value: [0, 200000] as [number, number], icon: "💸" },
    {
      label: "200K - 500K",
      value: [200000, 500000] as [number, number],
      icon: "💵",
    },
    {
      label: "Trên 500K",
      value: [500000, Infinity] as [number, number],
      icon: "💎",
    },
  ];

  const sortOptions = [
    { value: "newest", label: "Mới nhất", icon: Clock },
    { value: "oldest", label: "Cũ nhất", icon: Clock },
    { value: "price_low", label: "Giá thấp đến cao", icon: TrendingUp },
    { value: "price_high", label: "Giá cao đến thấp", icon: TrendingUp },
    { value: "rating", label: "Đánh giá cao", icon: Star },
    { value: "popular", label: "Phổ biến", icon: Award },
  ];

  if (loading) {
    return <EnhancedLoadingSpinner />;
  }

  const activeFiltersCount =
    (filters.search ? 1 : 0) +
    (filters.tags?.length || 0) +
    (filters.priceRange ? 1 : 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-purple-900 dark:to-indigo-900 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            background: [
              "linear-gradient(45deg, rgba(59,130,246,0.03), rgba(147,51,234,0.03))",
              "linear-gradient(45deg, rgba(147,51,234,0.03), rgba(236,72,153,0.03))",
              "linear-gradient(45deg, rgba(236,72,153,0.03), rgba(59,130,246,0.03))",
            ],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0"
        />

        {/* Floating tech icons chỉ hiển thị trên desktop */}
        <div className="hidden lg:block">
          {[
            { icon: Code, color: "text-blue-500/8", delay: 0 },
            { icon: Database, color: "text-green-500/8", delay: 2 },
            { icon: Smartphone, color: "text-purple-500/8", delay: 4 },
            { icon: Monitor, color: "text-cyan-500/8", delay: 6 },
            { icon: Globe, color: "text-pink-500/8", delay: 8 },
            { icon: Palette, color: "text-orange-500/8", delay: 10 },
          ].map(({ icon: Icon, color, delay }, index) => (
            <motion.div
              key={index}
              className={`absolute ${color}`}
              style={{
                top: `${10 + index * 15}%`,
                left: `${5 + index * 12}%`,
              }}
              animate={{
                y: [0, -30, 0],
                rotate: [0, 360],
                scale: [0.8, 1.2, 0.8],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 15 + index * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: delay,
              }}
            >
              <Icon className="w-8 h-8" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Layout */}
      <div className="container relative z-10 mx-auto px-4 py-6 md:py-8">
        <div className="flex gap-6 md:gap-8">
          {/* Enhanced Desktop Sidebar */}
          <DesktopFilterSidebar
            filters={filters}
            templateTags={templateTags}
            priceRanges={priceRanges}
            sortOptions={sortOptions}
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            handleSearch={handleSearch}
            handleSortChange={handleSortChange}
            toggleTag={toggleTag}
            handlePriceRangeChange={handlePriceRangeChange}
            clearFilters={clearFilters}
            products={products}
          />

          {/* Main Content */}
          <main className="flex-1 space-y-8 md:space-y-12 min-w-0">
            {/* Enhanced Header */}
            <EnhancedHeader
              products={products}
              filteredProducts={filteredProducts}
              currentProducts={currentProducts}
            />

            {/* Enhanced Mobile Filter Button */}
            <div className="xl:hidden">
              <MobileFilterSheet
                filters={filters}
                templateTags={templateTags}
                priceRanges={priceRanges}
                sortOptions={sortOptions}
                searchInput={searchInput}
                setSearchInput={setSearchInput}
                handleSearch={handleSearch}
                handleSortChange={handleSortChange}
                toggleTag={toggleTag}
                handlePriceRangeChange={handlePriceRangeChange}
                clearFilters={clearFilters}
                products={products}
              />
            </div>

            {/* Active Filters Display */}
            <AnimatePresence>
              {activeFiltersCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="relative"
                >
                  <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 overflow-hidden">
                    <CardContent className="p-4 md:p-6 relative z-10">
                      <div className="flex flex-wrap items-center gap-3 md:gap-4">
                        <div className="flex items-center space-x-2">
                          <Filter className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                          <span className="text-sm md:text-base font-semibold">
                            Bộ lọc đang áp dụng:
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {filters.search && (
                            <Badge className="bg-blue-100 text-blue-800 text-xs md:text-sm">
                              <Search className="w-3 h-3 mr-1" />"
                              {filters.search}"
                              <button
                                onClick={() => {
                                  setFilters((prev) => ({
                                    ...prev,
                                    search: "",
                                  }));
                                  setSearchInput("");
                                  setShouldResetPage(true);
                                }}
                                className="ml-2 hover:text-red-500"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          )}

                          {filters.tags?.map((tag) => (
                            <Badge
                              key={tag}
                              className="bg-purple-100 text-purple-800 text-xs md:text-sm"
                            >
                              <Sparkles className="w-3 h-3 mr-1" />
                              {tag}
                              <button
                                onClick={() => toggleTag(tag)}
                                className="ml-2 hover:text-red-500"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))}

                          {filters.priceRange && (
                            <Badge className="bg-green-100 text-green-800 text-xs md:text-sm">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              {getPriceRangeLabel(filters.priceRange)}
                              <button
                                onClick={() =>
                                  handlePriceRangeChange(undefined)
                                }
                                className="ml-2 hover:text-red-500"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={clearFilters}
                          className="ml-auto"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Xóa tất cả
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results Header & View Mode */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
                <div>
                  <p className="text-lg md:text-2xl text-muted-foreground">
                    Hiển thị{" "}
                    <span className="font-bold text-primary text-xl md:text-3xl">
                      {currentProducts.length}
                    </span>{" "}
                    trên{" "}
                    <span className="font-bold text-primary text-xl md:text-3xl">
                      {filteredProducts.length}
                    </span>{" "}
                    kết quả
                  </p>
                  {filteredProducts.length !== products.length && (
                    <Badge
                      variant="outline"
                      className="text-yellow-800 bg-yellow-100 mt-2"
                    >
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Đã lọc từ {products.length} templates
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm md:text-base font-medium text-muted-foreground">
                    Xem:
                  </span>
                  <div className="flex border rounded-lg bg-white dark:bg-slate-800">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="rounded-r-none px-3 py-2"
                    >
                      <Grid className="w-4 h-4 mr-1" />
                      <span className="hidden sm:inline">Lưới</span>
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="rounded-l-none px-3 py-2"
                    >
                      <List className="w-4 h-4 mr-1" />
                      <span className="hidden sm:inline">DS</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Product Grid */}
              <EnhancedProductGrid
                currentProducts={currentProducts}
                viewMode={viewMode}
                addToCart={addToCart}
              />

              {/* Pagination */}
              {filteredProducts.length > 0 && totalPages > 1 && (
                <div className="mt-12">
                  <Card className="border-0 shadow-lg bg-gradient-to-r from-white to-blue-50 dark:from-slate-800 dark:to-blue-900">
                    <CardContent className="p-4 md:p-8">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={filteredProducts.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={handlePageChange}
                      />
                    </CardContent>
                  </Card>
                </div>
              )}
            </motion.div>
          </main>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <ScrollToTopButton />

      {/* Mobile bottom safe area */}
      <div className="h-20 md:h-0"></div>
    </div>
  );
};

export default Templates;
