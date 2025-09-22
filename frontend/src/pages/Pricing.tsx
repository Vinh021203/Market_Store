import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle2,
  X,
  Star,
  Crown,
  Zap,
  Users,
  Code,
  Palette,
  Headphones,
  Database,
  BarChart3,
  Gift,
  ArrowRight,
  MessageCircle,
  Rocket,
  ThumbsUp,
  Globe,
  Sparkles,
  TrendingUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Eye,
  Heart,
  Share2,
  Download,
  Filter,
  Search,
  ArrowUp,
  Target,
  Award,
  Shield,
  Lightbulb,
  Coffee,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Package,
  Send,
  Percent,
  Briefcase,
  Quote,
  CheckCircle,
} from "lucide-react";

// Type definitions
interface Feature {
  name: string;
  included: boolean;
  tooltip?: string;
}

interface Plan {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  monthlyPrice: number;
  yearlyPrice: number;
  originalYearlyPrice: number;
  popular: boolean;
  features: Feature[];
  cta: string;
  highlight: string;
  badge?: string;
}

interface AddOn {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  icon: React.ComponentType<any>;
  color: string;
  popular?: boolean;
  category?: string;
}

interface Testimonial {
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
  rating: number;
  verified?: boolean;
  featured?: boolean;
}

interface FAQ {
  question: string;
  answer: string;
  category?: string;
}

interface Stat {
  label: string;
  value: string;
  icon: React.ComponentType<any>;
  color: string;
}

// ✅ EXACT HOME PAGE COLOR SCHEME - Đồng bộ hoàn toàn
const sectionBackgrounds = {
  // Hero Section - Trắng với chút pink nhạt
  hero: "from-white via-pink-25 to-rose-25",

  // Stats Section - Pink gradient nhẹ
  stats: "from-pink-25 via-rose-25 to-red-25",

  // Categories Section - Rose gradient nhẹ
  categories: "from-rose-25 via-pink-25 to-white",

  // Features Section - Gradient ngược
  features: "from-red-25 via-rose-25 to-pink-25",

  // Process Section - Pink nhạt hơn
  process: "from-pink-50 via-rose-50 to-red-50",

  // Products Section - Rose nhạt
  products: "from-rose-50 via-pink-50 to-white",

  // Testimonials Section - Red nhạt
  testimonials: "from-red-50 via-rose-50 to-pink-50",

  // Newsletter Section - Pink đậm nhất để nổi bật
  newsletter: "from-pink-75 via-rose-75 to-red-75",
};

// ✅ EXACT HOME PAGE UNIFIED COLOR SCHEME
const unifiedColorScheme = {
  // Buttons - Nhạt hơn header
  button: "from-pink-300 via-rose-300 to-red-300",
  buttonHover: "from-pink-400 via-rose-400 to-red-400",
  // Text gradients - Soft pink
  textMain: "from-pink-400 via-rose-400 to-red-400",
  textSecondary: "from-pink-500 via-rose-500 to-red-500",
  // Icons - Very light pink
  iconBg: "from-pink-25 to-rose-50",
  iconText: "text-pink-400",
  // Cards with subtle backgrounds
  cardBg: "from-white/95 via-pink-50/80 to-rose-50/85",
};

// Animated Counter Component
const AnimatedCounter: React.FC<{
  end: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}> = ({ end, duration = 2000, className = "", prefix = "", suffix = "" }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isVisible, end, duration]);

  return (
    <div ref={ref} className={className}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </div>
  );
};

// Modal Component
const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b">
            {title && (
              <h2
                className={`text-2xl font-bold bg-gradient-to-r ${unifiedColorScheme.textMain} bg-clip-text text-transparent`}
              >
                {title}
              </h2>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl p-2"
            >
              ×
            </button>
          </div>
          <div className="p-6">{children}</div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Comparison Table Component
const ComparisonTable: React.FC<{ plans: Plan[] }> = ({ plans }) => {
  const [sticky, setSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="w-full overflow-x-auto bg-white rounded-2xl shadow-2xl border">
      <table className="w-full min-w-[800px]">
        <thead
          className={`${sticky ? "sticky top-0 z-10" : ""} bg-gradient-to-r ${unifiedColorScheme.cardBg}`}
        >
          <tr>
            <th className="text-left p-6 font-bold text-lg text-slate-800">
              Features
            </th>
            {plans.map((plan) => (
              <th key={plan.id} className="text-center p-6">
                <div className="space-y-2">
                  <div
                    className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-r ${plan.color} flex items-center justify-center`}
                  >
                    <plan.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="font-bold text-lg text-slate-800">
                    {plan.name}
                  </div>
                  {plan.popular && (
                    <Badge className="bg-rose-100 text-rose-800">
                      <Star className="w-3 h-3 mr-1" />
                      Popular
                    </Badge>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {plans[0]?.features.map((_, featureIndex) => (
            <tr key={featureIndex} className="border-t hover:bg-pink-25">
              <td className="p-4 font-medium text-slate-600">
                {plans[0].features[featureIndex].name}
              </td>
              {plans.map((plan) => (
                <td key={plan.id} className="text-center p-4">
                  {plan.features[featureIndex]?.included ? (
                    <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto" />
                  ) : (
                    <X className="w-6 h-6 text-gray-300 mx-auto" />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Testimonials Carousel Component
const TestimonialsCarousel: React.FC<{ testimonials: Testimonial[] }> = ({
  testimonials,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const goToPrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  };

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="overflow-hidden rounded-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.5 }}
            className={`bg-gradient-to-br ${unifiedColorScheme.cardBg} dark:from-slate-800 dark:to-rose-900 p-8 rounded-2xl shadow-xl`}
          >
            <div className="flex items-start space-x-6">
              <img
                src={testimonials[currentIndex].avatar}
                alt={testimonials[currentIndex].name}
                className="w-16 h-16 rounded-full object-cover ring-4 ring-pink-100"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-3">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                  {testimonials[currentIndex].verified && (
                    <Badge className="bg-green-100 text-green-800 ml-2">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <blockquote className="text-lg italic text-slate-700 mb-4">
                  "{testimonials[currentIndex].content}"
                </blockquote>
                <div>
                  <div className="font-bold text-lg text-slate-800">
                    {testimonials[currentIndex].name}
                  </div>
                  <div className="text-slate-600">
                    {testimonials[currentIndex].role} tại{" "}
                    {testimonials[currentIndex].company}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between mt-6">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPrev}
            className="p-2"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNext}
            className="p-2"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex ? "bg-rose-500" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="flex items-center space-x-2"
        >
          {isAutoPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          <span>{isAutoPlaying ? "Pause" : "Play"}</span>
        </Button>
      </div>
    </div>
  );
};

// Newsletter Signup Component
const NewsletterSignup: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      setEmail("");
    }, 1500);
  };

  return (
    <div
      className={`bg-gradient-to-r ${unifiedColorScheme.button} rounded-2xl p-8 text-white relative overflow-hidden`}
    >
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative z-10">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold mb-2">Nhận ưu đãi đặc biệt!</h3>
          <p className="text-pink-100">
            Đăng ký newsletter để nhận mã giảm giá 20% và cập nhật mới nhất
          </p>
        </div>

        {!isSubmitted ? (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
          >
            <Input
              type="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white/20 border-white/30 text-white placeholder:text-white/70"
              required
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-white text-rose-600 hover:bg-gray-100 font-bold"
            >
              {isLoading ? "Đang gửi..." : "Đăng ký"}
            </Button>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-green-300" />
            <h4 className="text-xl font-bold mb-2">Cảm ơn bạn đã đăng ký!</h4>
            <p className="text-pink-100">
              Kiểm tra email để nhận mã giảm giá của bạn.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Contact Form Component
const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Card className="max-w-lg mx-auto">
      <CardHeader>
        <CardTitle
          className={`text-2xl font-bold text-center bg-gradient-to-r ${unifiedColorScheme.textMain} bg-clip-text text-transparent`}
        >
          Liên hệ tư vấn
        </CardTitle>
        <p className="text-center text-slate-600">
          Để lại thông tin, chúng tôi sẽ liên hệ trong 24h
        </p>
      </CardHeader>
      <CardContent>
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-700">
                Họ tên *
              </label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nhập họ tên"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-700">
                Email *
              </label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-700">
                Công ty
              </label>
              <Input
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Tên công ty (tùy chọn)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-700">
                Tin nhắn *
              </label>
              <Textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Mô tả nhu cầu của bạn..."
                rows={4}
                required
              />
            </div>
            <Button
              type="submit"
              className={`w-full bg-gradient-to-r ${unifiedColorScheme.button} hover:${unifiedColorScheme.buttonHover} text-white`}
            >
              Gửi yêu cầu
            </Button>
          </form>
        ) : (
          <div className="text-center py-8">
            <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-500" />
            <h3 className="text-xl font-bold mb-2 text-slate-800">
              Đã gửi thành công!
            </h3>
            <p className="text-slate-600">
              Chúng tôi sẽ liên hệ với bạn trong vòng 24 giờ.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Main Pricing Component
const Pricing: React.FC = () => {
  const [isYearly, setIsYearly] = useState(false);
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showComparisonTable, setShowComparisonTable] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});

  // Scroll to top function
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection Observer for animations
  useEffect(() => {
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
      { threshold: 0.1, rootMargin: "-10% 0px -10% 0px" },
    );

    const sections = document.querySelectorAll("[data-animate]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Plans data với HOME PAGE COLORS
  const plans: Plan[] = [
    {
      id: "starter",
      name: "Starter",
      description: "Hoàn hảo cho dự án cá nhân và học tập",
      icon: Code,
      color: "from-pink-300 via-rose-300 to-red-300", // HOME PAGE COLORS
      monthlyPrice: 299000,
      yearlyPrice: 2390000,
      originalYearlyPrice: 3588000,
      popular: false,
      badge: "Dành cho cá nhân",
      features: [
        { name: "5 template downloads/tháng", included: true },
        { name: "Source code đầy đủ", included: true },
        { name: "Documentation chi tiết", included: true },
        { name: "6 tháng support", included: true },
        { name: "Free updates", included: true },
        { name: "Mobile responsive", included: true },
        { name: "Basic components", included: true },
        { name: "Commercial license", included: false },
        { name: "Premium templates", included: false },
        { name: "Priority support", included: false },
        { name: "Custom modifications", included: false },
        { name: "API access", included: false },
      ],
      cta: "Bắt đầu ngay",
      highlight: "Tiết kiệm 33%",
    },
    {
      id: "professional",
      name: "Professional",
      description: "Dành cho freelancers và agencies",
      icon: Zap,
      color: "from-rose-300 via-red-300 to-pink-300", // HOME PAGE COLORS
      monthlyPrice: 999000,
      yearlyPrice: 7990000,
      originalYearlyPrice: 11988000,
      popular: true,
      badge: "Phổ biến nhất",
      features: [
        { name: "Unlimited template downloads", included: true },
        { name: "Premium template collection", included: true },
        { name: "Source code + PSD/Figma files", included: true },
        { name: "Priority support 24/7", included: true },
        { name: "Commercial license", included: true },
        { name: "Custom modifications", included: true },
        { name: "Advanced components", included: true },
        { name: "Team collaboration (5 users)", included: true },
        { name: "API access", included: true },
        { name: "White-label license", included: false },
        { name: "Custom development", included: false },
        { name: "Dedicated support manager", included: false },
      ],
      cta: "Chọn Professional",
      highlight: "Phổ biến nhất",
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "Cho doanh nghiệp và team lớn",
      icon: Crown,
      color: "from-red-300 via-pink-300 to-rose-300", // HOME PAGE COLORS
      monthlyPrice: 2999000,
      yearlyPrice: 23990000,
      originalYearlyPrice: 35988000,
      popular: false,
      badge: "Tính năng cao cấp",
      features: [
        { name: "Tất cả templates + future releases", included: true },
        { name: "White-label license", included: true },
        { name: "Custom development service", included: true },
        { name: "Dedicated support manager", included: true },
        { name: "Training sessions", included: true },
        { name: "API access", included: true },
        { name: "Unlimited team collaboration", included: true },
        { name: "Advanced analytics", included: true },
        { name: "Custom integrations", included: true },
        { name: "SLA guarantee", included: true },
        { name: "Priority feature requests", included: true },
        { name: "Custom branding", included: true },
      ],
      cta: "Liên hệ Sales",
      highlight: "Tiết kiệm 33%",
    },
  ];

  // Add-ons data với HOME PAGE COLORS
  const addOns: AddOn[] = [
    {
      name: "Premium Support",
      description: "24/7 priority support với dedicated manager",
      price: 499000,
      originalPrice: 699000,
      icon: Headphones,
      color: "from-pink-300 via-rose-300 to-red-300", // HOME PAGE COLORS
      popular: true,
      category: "support",
    },
    {
      name: "Custom Development",
      description: "Tùy chỉnh template theo yêu cầu riêng",
      price: 2999000,
      icon: Code,
      color: "from-rose-300 via-red-300 to-pink-300", // HOME PAGE COLORS
      category: "development",
    },
    {
      name: "Design Consultation",
      description: "1-on-1 với UI/UX experts",
      price: 1499000,
      originalPrice: 1999000,
      icon: Palette,
      color: "from-red-300 via-pink-300 to-rose-300", // HOME PAGE COLORS
      category: "design",
    },
    {
      name: "API Integration",
      description: "Tích hợp API & third-party services",
      price: 1999000,
      icon: Database,
      color: "from-pink-400 via-rose-300 to-red-300", // HOME PAGE COLORS
      category: "development",
    },
    {
      name: "Performance Audit",
      description: "Tối ưu performance website",
      price: 799000,
      icon: BarChart3,
      color: "from-rose-400 via-red-300 to-pink-300", // HOME PAGE COLORS
      category: "optimization",
    },
    {
      name: "SEO Optimization",
      description: "Tối ưu SEO cho website",
      price: 1299000,
      icon: Search,
      color: "from-red-400 via-pink-300 to-rose-300", // HOME PAGE COLORS
      category: "optimization",
    },
  ];

  // Stats data với HOME PAGE COLORS
  const stats: Stat[] = [
    {
      label: "Khách hàng hài lòng",
      value: "50K+",
      icon: Users,
      color: unifiedColorScheme.iconBg,
    },
    {
      label: "Templates chất lượng",
      value: "200+",
      icon: Code,
      color: unifiedColorScheme.iconBg,
    },
    {
      label: "Quốc gia sử dụng",
      value: "75+",
      icon: Globe,
      color: unifiedColorScheme.iconBg,
    },
    {
      label: "Tỷ lệ hài lòng",
      value: "99%",
      icon: ThumbsUp,
      color: unifiedColorScheme.iconBg,
    },
  ];

  // Testimonials data (giữ nguyên)
  const testimonials: Testimonial[] = [
    {
      name: "Hoàng Huy Thành",
      role: "Frontend Developer",
      company: "Viettel Digital",
      content:
        "React template ở đây UI hiệu ứng gradient quá chất, tiết kiệm thời gian build, team mình rất hài lòng. Code structure clean, documentation đầy đủ, support team response nhanh.",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      verified: true,
      featured: true,
    },
    {
      name: "Ngô Thị Hà",
      role: "UI/UX Designer",
      company: "VNG Corporation",
      content:
        "E-book về React patterns rất hữu ích. Có nhiều case study thực chiến. Design system documentation chi tiết, dễ áp dụng. Highly recommended cho team design!",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b5c6?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      verified: true,
      featured: true,
    },
    {
      name: "Trần Minh Khoa",
      role: "Full Stack Developer",
      company: "FPT Software",
      content:
        "Templates quality rất cao, code clean và well-documented. Đã sử dụng cho 3 projects commercial và clients đều rất satisfied. Worth every penny!",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      verified: true,
    },
    {
      name: "Lê Thị Mai",
      role: "Product Manager",
      company: "Shopee Vietnam",
      content:
        "Sử dụng templates này cho MVP startup, giúp team launch product nhanh chóng. Design modern, UX smooth, performance tốt. Great for rapid prototyping!",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      verified: true,
    },
  ];

  // FAQs data (giữ nguyên)
  const faqs: FAQ[] = [
    {
      question: "Tôi có thể thay đổi plan bất cứ lúc nào không?",
      answer:
        "Có, bạn có thể upgrade hoặc downgrade plan bất cứ lúc nào. Chúng tôi sẽ tính toán pro-rated cho phần chênh lệch và cập nhật ngay lập tức. Không có phí ẩn hay cam kết dài hạn.",
      category: "billing",
    },
    {
      question: "Có chính sách hoàn tiền không?",
      answer:
        "Có, chúng tôi có chính sách hoàn tiền 30 ngày không điều kiện nếu bạn không hài lòng với dịch vụ. Bạn chỉ cần liên hệ support team và chúng tôi sẽ xử lý trong 3-5 ngày làm việc.",
      category: "billing",
    },
    {
      question: "Commercial license bao gồm những gì?",
      answer:
        "Commercial license cho phép bạn sử dụng templates cho dự án client, bán lại sản phẩm, sử dụng cho mục đích thương mại và không giới hạn số lượng projects. Bao gồm cả việc customize và redistribute.",
      category: "license",
    },
    {
      question: "Tôi có được support khi gặp vấn đề không?",
      answer:
        "Tất cả plans đều có support. Starter có email support trong giờ hành chính. Professional có priority support 24/7. Enterprise có dedicated support manager với SLA response time.",
      category: "support",
    },
    {
      question: "Templates có được update thường xuyên không?",
      answer:
        "Có, chúng tôi cập nhật templates định kỳ với bug fixes, new features và compatibility với latest React versions. Tất cả updates đều miễn phí cho subscribers.",
      category: "product",
    },
    {
      question: "Tôi có thể sử dụng templates cho nhiều websites không?",
      answer:
        "Với Starter plan: 1 website per template. Professional: unlimited websites. Enterprise: unlimited websites + white-label rights. Chi tiết trong terms of service.",
      category: "license",
    },
  ];

  // Helper functions
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN").format(price);
  const calculateSavings = (original: number, discounted: number) =>
    Math.round((1 - discounted / original) * 100);

  const toggleAddOn = (addOnName: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(addOnName)
        ? prev.filter((name) => name !== addOnName)
        : [...prev, addOnName],
    );
  };

  const getTotalAddOnPrice = () => {
    return addOns
      .filter((addon) => selectedAddOns.includes(addon.name))
      .reduce((total, addon) => total + addon.price, 0);
  };

  return (
    <>
      {/* ✅ EXACT HOME PAGE FLOATING BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {[
          {
            emoji: "🌸",
            color: "from-pink-50 to-rose-100",
            position: "top-10 right-20",
          },
          {
            emoji: "💖",
            color: "from-rose-50 to-red-100",
            position: "top-32 left-10",
          },
          {
            emoji: "✨",
            color: "from-red-50 to-pink-100",
            position: "bottom-20 right-10",
          },
          {
            emoji: "🎀",
            color: "from-pink-100 to-rose-50",
            position: "bottom-32 left-20",
          },
          {
            emoji: "💝",
            color: "from-rose-100 to-pink-50",
            position: "top-1/2 right-1/4",
          },
          {
            emoji: "🌺",
            color: "from-red-50 to-rose-100",
            position: "top-1/3 left-1/3",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            className={`absolute ${item.position} text-4xl opacity-5`}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 15, -15, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 10 + i * 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          >
            <motion.div
              className={`p-4 rounded-full bg-gradient-to-r ${item.color} backdrop-blur-sm shadow-lg`}
              whileHover={{ scale: 1.5, rotate: 30 }}
            >
              <span>{item.emoji}</span>
            </motion.div>
          </motion.div>
        ))}
      </div>

      <main className="relative z-10">
        {/* Scroll to top button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={scrollToTop}
              className={`fixed bottom-8 right-8 z-40 p-3 bg-gradient-to-r ${unifiedColorScheme.button} text-white rounded-full shadow-lg hover:shadow-xl transition-all`}
            >
              <ArrowUp className="w-6 h-6" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* ✅ HERO SECTION - EXACT HOME PAGE STYLE */}
        <section
          className={`relative px-4 py-8 sm:py-16 lg:py-16 bg-gradient-to-br ${sectionBackgrounds.hero} overflow-hidden min-h-screen flex items-center`}
          id="hero"
          data-animate
          style={{
            backgroundImage: `radial-gradient(circle at 20% 80%, rgba(236, 72, 153, 0.03) 0%, transparent 50%),
                             radial-gradient(circle at 80% 20%, rgba(244, 63, 94, 0.03) 0%, transparent 50%),
                             radial-gradient(circle at 40% 40%, rgba(220, 38, 127, 0.02) 0%, transparent 50%)`,
          }}
        >
          <div className="container relative z-10 mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge
                className={`mb-6 bg-gradient-to-r ${unifiedColorScheme.button} text-white px-5 py-2 text-sm font-semibold shadow-xl inline-flex items-center gap-2 rounded-full`}
              >
                <Sparkles className="w-4 h-4" />
                Pricing Plans 2025 🎨
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              </Badge>

              <h1
                className={`text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r ${unifiedColorScheme.textMain} bg-clip-text text-transparent leading-[1.1] mb-6`}
              >
                Chọn plan phù hợp <br />
                <span
                  className={`bg-gradient-to-r ${unifiedColorScheme.textSecondary} bg-clip-text text-transparent`}
                >
                  cho dự án của bạn
                </span>
              </h1>

              <p className="max-w-3xl mx-auto text-lg sm:text-xl lg:text-2xl text-slate-600 font-medium leading-relaxed mb-8">
                Từ dự án cá nhân đến enterprise, chúng tôi có giải pháp phù hợp
                cho mọi nhu cầu.
                <span className="font-semibold text-emerald-600">
                  {" "}
                  Tiết kiệm đến 33%
                </span>{" "}
                khi chọn yearly plan.
              </p>

              {/* Billing Toggle - HOME PAGE STYLE */}
              <div className="flex items-center justify-center max-w-lg p-6 mx-auto space-x-6 border-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-3xl shadow-2xl mb-12">
                <span
                  className={`text-lg font-bold transition-all duration-300 ${!isYearly ? `bg-gradient-to-r ${unifiedColorScheme.textSecondary} bg-clip-text text-transparent scale-110` : "text-slate-500"}`}
                >
                  Monthly
                </span>
                <Switch
                  checked={isYearly}
                  onCheckedChange={setIsYearly}
                  className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-pink-400 data-[state=checked]:to-rose-500 scale-125"
                />
                <span
                  className={`text-lg font-bold transition-all duration-300 ${isYearly ? `bg-gradient-to-r ${unifiedColorScheme.textSecondary} bg-clip-text text-transparent scale-110` : "text-slate-500"}`}
                >
                  Yearly
                </span>
                {isYearly && (
                  <Badge className="text-green-800 bg-green-100 animate-pulse shadow-lg">
                    <Gift className="w-4 h-4 mr-2" />
                    Save 33%
                  </Badge>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ✅ STATS SECTION - EXACT HOME PAGE STYLE */}
        <section
          className={`relative px-4 py-14 sm:py-16 lg:py-20 bg-gradient-to-br ${sectionBackgrounds.stats}`}
          id="stats"
          data-animate
          style={{
            backgroundImage: `radial-gradient(circle at 20% 80%, rgba(236, 72, 153, 0.05) 0%, transparent 50%),
                             radial-gradient(circle at 80% 20%, rgba(244, 63, 94, 0.05) 0%, transparent 50%),
                             radial-gradient(circle at 40% 40%, rgba(220, 38, 127, 0.03) 0%, transparent 50%)`,
          }}
        >
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible.stats ? { opacity: 1, y: 0 } : {}}
              className="text-center mb-12"
            >
              <Badge
                className={`mb-4 bg-gradient-to-r ${unifiedColorScheme.button} text-white px-5 py-2 text-sm font-semibold shadow-xl`}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Trusted by Industry Leaders
              </Badge>
              <h2
                className={`text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r ${unifiedColorScheme.textMain} bg-clip-text text-transparent mb-4`}
              >
                Powering Innovation Worldwide
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Join thousands of successful developers, designers, and
                companies who've accelerated their projects
              </p>
            </motion.div>

            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 60 }}
                  animate={isVisible.stats ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="group"
                >
                  <Card
                    className={`border-0 shadow-xl hover:shadow-3xl bg-gradient-to-br ${unifiedColorScheme.cardBg} backdrop-blur-lg rounded-3xl transition-all duration-500 overflow-hidden relative`}
                  >
                    <CardContent className="p-6 text-center relative z-10">
                      <motion.div
                        className={`w-16 h-16 mx-auto mb-4 rounded-3xl bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-300`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 1 }}
                      >
                        <stat.icon className="w-8 h-8 text-pink-500" />
                      </motion.div>

                      <AnimatedCounter
                        end={parseInt(stat.value.replace(/[^0-9]/g, "") || "0")}
                        suffix={stat.value.replace(/[0-9]/g, "")}
                        className="text-3xl lg:text-4xl font-bold text-pink-500 mb-2"
                      />
                      <div className="text-lg font-bold text-slate-800 mb-1">
                        {stat.label}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ✅ PRICING CARDS - HOME PAGE STYLE */}
        <section
          className={`relative px-4 py-14 sm:py-16 lg:py-20 bg-gradient-to-br ${sectionBackgrounds.categories}`}
          id="pricing"
          data-animate
          style={{
            backgroundImage: `radial-gradient(circle at 20% 80%, rgba(244, 63, 94, 0.05) 0%, transparent 50%),
                             radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.05) 0%, transparent 50%),
                             radial-gradient(circle at 40% 40%, rgba(220, 38, 127, 0.03) 0%, transparent 50%)`,
          }}
        >
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible.pricing ? { opacity: 1, y: 0 } : {}}
              className="text-center mb-16"
            >
              <Badge
                className={`mb-4 bg-gradient-to-r ${unifiedColorScheme.button} text-white px-5 py-2 text-sm font-semibold shadow-xl`}
              >
                <Package className="w-4 h-4 mr-2" />
                Choose Your Perfect Plan
              </Badge>
              <h2
                className={`text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r ${unifiedColorScheme.textMain} bg-clip-text text-transparent mb-4`}
              >
                Chọn gói phù hợp với bạn
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Tất cả gói đều bao gồm access đến template library và regular
                updates
              </p>
            </motion.div>

            <div className="grid gap-6 lg:gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mb-12">
              {plans.map((plan, idx) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 60 }}
                  animate={isVisible.pricing ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: idx * 0.15 }}
                  whileHover={{ scale: 1.03, y: -8 }}
                  className="group h-full"
                >
                  <Card
                    className={`relative overflow-hidden border-0 shadow-xl hover:shadow-3xl bg-gradient-to-br ${plan.popular ? unifiedColorScheme.cardBg : "from-white to-gray-50 dark:from-slate-800 dark:to-slate-900"} backdrop-blur-lg rounded-3xl transition-all duration-500 h-full flex flex-col ${plan.popular ? "ring-2 ring-pink-300 scale-105" : ""}`}
                    onMouseEnter={() => setHoveredPlan(plan.id)}
                    onMouseLeave={() => setHoveredPlan(null)}
                  >
                    {plan.popular && (
                      <div className="absolute top-0 left-0 right-0 z-10">
                        <div
                          className={`py-3 text-sm font-bold text-center text-white bg-gradient-to-r ${unifiedColorScheme.button}`}
                        >
                          <Star className="inline w-4 h-4 mr-1" />
                          {plan.highlight}
                        </div>
                      </div>
                    )}

                    {plan.badge && (
                      <div className="absolute top-4 right-4 z-10">
                        <Badge className="bg-pink-100 text-pink-800 shadow-lg">
                          {plan.badge}
                        </Badge>
                      </div>
                    )}

                    <CardHeader
                      className={`text-center space-y-6 ${plan.popular ? "pt-20" : "pt-8"} pb-8`}
                    >
                      <motion.div
                        className={`w-14 h-14 mx-auto rounded-3xl bg-gradient-to-br ${plan.color} flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-300`}
                        whileHover={{ rotate: 12 }}
                      >
                        <plan.icon className="w-7 h-7 text-white" />
                      </motion.div>

                      <div>
                        <CardTitle className="mb-3 text-xl lg:text-2xl font-bold text-slate-900 group-hover:text-pink-700 transition-colors">
                          {plan.name}
                        </CardTitle>
                        <p className="text-slate-700 leading-relaxed">
                          {plan.description}
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-baseline justify-center space-x-2">
                          <span className="text-3xl lg:text-4xl font-bold text-slate-900">
                            {formatPrice(
                              isYearly ? plan.yearlyPrice : plan.monthlyPrice,
                            )}
                          </span>
                          <span className="text-lg text-slate-600 font-medium">
                            VND
                          </span>
                        </div>
                        <div className="text-slate-600">
                          {isYearly ? "per year" : "per month"}
                        </div>
                        {isYearly && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-sm space-y-2"
                          >
                            <div className="line-through text-slate-500">
                              {formatPrice(plan.originalYearlyPrice)} VND
                            </div>
                            <Badge className="text-green-800 bg-green-100 shadow-lg">
                              Save{" "}
                              {calculateSavings(
                                plan.originalYearlyPrice,
                                plan.yearlyPrice,
                              )}
                              %
                            </Badge>
                          </motion.div>
                        )}
                      </div>

                      <Button
                        className={`w-full h-14 text-lg font-bold transition-all duration-300 ${
                          plan.popular
                            ? `bg-gradient-to-r ${unifiedColorScheme.button} hover:${unifiedColorScheme.buttonHover} shadow-xl hover:shadow-2xl`
                            : `bg-gradient-to-r ${unifiedColorScheme.button} hover:${unifiedColorScheme.buttonHover} shadow-lg hover:shadow-xl`
                        } text-white rounded-2xl`}
                        onClick={() => {
                          setSelectedPlan(plan.id);
                          if (plan.id === "enterprise") {
                            setShowContactModal(true);
                          }
                        }}
                      >
                        {plan.cta}
                        <ArrowRight className="w-5 h-5 ml-3 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </CardHeader>

                    <CardContent className="space-y-6 pb-8 flex-1 flex flex-col">
                      <Separator />
                      <div className="space-y-4 flex-1">
                        <h4 className="text-sm font-bold tracking-wide uppercase text-slate-500">
                          Features included:
                        </h4>
                        <div className="space-y-3">
                          {plan.features.map((feature, featureIndex) => (
                            <div
                              key={featureIndex}
                              className="flex items-center space-x-3"
                            >
                              <div className="flex-shrink-0">
                                {feature.included ? (
                                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                                ) : (
                                  <X className="w-5 h-5 text-gray-300" />
                                )}
                              </div>
                              <span
                                className={`text-sm ${
                                  feature.included
                                    ? "text-slate-700 font-medium"
                                    : "text-slate-400"
                                }`}
                              >
                                {feature.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Comparison Table Toggle */}
            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => setShowComparisonTable(!showComparisonTable)}
                className="mb-8 border-2 border-pink-200 text-pink-700 hover:bg-pink-25"
              >
                {showComparisonTable
                  ? "Ẩn bảng so sánh"
                  : "Xem bảng so sánh chi tiết"}
                <ChevronDown
                  className={`w-4 h-4 ml-2 transition-transform ${showComparisonTable ? "rotate-180" : ""}`}
                />
              </Button>

              <AnimatePresence>
                {showComparisonTable && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <ComparisonTable plans={plans} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* ✅ ADD-ONS SECTION - HOME PAGE STYLE */}
        <section
          className={`relative px-4 py-14 sm:py-16 lg:py-20 bg-gradient-to-br ${sectionBackgrounds.features}`}
          id="addons"
          data-animate
          style={{
            backgroundImage: `radial-gradient(circle at 20% 80%, rgba(220, 38, 127, 0.05) 0%, transparent 50%),
                             radial-gradient(circle at 80% 20%, rgba(244, 63, 94, 0.05) 0%, transparent 50%),
                             radial-gradient(circle at 40% 40%, rgba(236, 72, 153, 0.03) 0%, transparent 50%)`,
          }}
        >
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible.addons ? { opacity: 1, y: 0 } : {}}
              className="text-center mb-16"
            >
              <Badge
                className={`mb-4 bg-gradient-to-r ${unifiedColorScheme.button} text-white px-5 py-2 text-sm font-semibold shadow-xl`}
              >
                <Award className="w-4 h-4 mr-2" />
                Premium Add-ons & Services
              </Badge>
              <h2
                className={`text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r ${unifiedColorScheme.textMain} bg-clip-text text-transparent mb-4`}
              >
                Nâng cao trải nghiệm
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Với các dịch vụ bổ sung chuyên nghiệp
              </p>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
              {addOns.map((addon, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 60 }}
                  animate={isVisible.addons ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: idx * 0.15 }}
                  whileHover={{ scale: 1.03, y: -8 }}
                  className="group h-full"
                >
                  <Card
                    className={`h-full transition-all duration-300 border-0 group hover:shadow-2xl bg-gradient-to-br ${unifiedColorScheme.cardBg} backdrop-blur-lg rounded-3xl relative overflow-hidden flex flex-col`}
                  >
                    {addon.popular && (
                      <div className="absolute top-0 right-0">
                        <Badge className="bg-rose-100 text-rose-800 m-4">
                          <Star className="w-3 h-3 mr-1" />
                          Popular
                        </Badge>
                      </div>
                    )}

                    <CardContent className="p-6 lg:p-8 space-y-4 text-center h-full flex flex-col">
                      <motion.div
                        className={`w-14 h-14 mx-auto rounded-3xl bg-gradient-to-br ${addon.color} flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-300`}
                        whileHover={{ rotate: 12 }}
                      >
                        <addon.icon className="w-7 h-7 text-white" />
                      </motion.div>

                      <div className="flex-1 flex flex-col">
                        <h3 className="text-xl lg:text-2xl font-bold text-slate-900 mb-3 group-hover:text-pink-700 transition-colors">
                          {addon.name}
                        </h3>

                        <p className="text-slate-700 mb-4 flex-1 leading-relaxed">
                          {addon.description}
                        </p>

                        <div className="space-y-2">
                          <div
                            className={`text-2xl font-bold bg-gradient-to-r ${unifiedColorScheme.textSecondary} bg-clip-text text-transparent`}
                          >
                            {formatPrice(addon.price)} VND
                          </div>
                          {addon.originalPrice && (
                            <div className="text-sm text-slate-500 line-through">
                              {formatPrice(addon.originalPrice)} VND
                            </div>
                          )}
                        </div>
                      </div>

                      <Button
                        variant={
                          selectedAddOns.includes(addon.name)
                            ? "default"
                            : "outline"
                        }
                        className={`w-full transition-all duration-300 group-hover:shadow-lg rounded-2xl ${
                          selectedAddOns.includes(addon.name)
                            ? `bg-gradient-to-r ${unifiedColorScheme.button} text-white`
                            : "border-2 border-pink-200 text-pink-700 hover:bg-pink-25"
                        }`}
                        onClick={() => toggleAddOn(addon.name)}
                      >
                        {selectedAddOns.includes(addon.name) ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Đã chọn
                          </>
                        ) : (
                          "Thêm vào giỏ"
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Selected Add-ons Summary */}
            {selectedAddOns.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-gradient-to-br ${unifiedColorScheme.cardBg} rounded-3xl p-6 shadow-xl`}
              >
                <h3 className="text-lg font-bold mb-4 text-slate-800">
                  Add-ons đã chọn:
                </h3>
                <div className="space-y-2 mb-4">
                  {selectedAddOns.map((addonName) => {
                    const addon = addOns.find((a) => a.name === addonName);
                    return addon ? (
                      <div
                        key={addonName}
                        className="flex justify-between items-center"
                      >
                        <span className="text-slate-600">{addon.name}</span>
                        <span className="font-bold text-slate-800">
                          {formatPrice(addon.price)} VND
                        </span>
                      </div>
                    ) : null;
                  })}
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between items-center text-lg font-bold">
                  <span className="text-slate-800">Tổng cộng:</span>
                  <span
                    className={`bg-gradient-to-r ${unifiedColorScheme.textSecondary} bg-clip-text text-transparent`}
                  >
                    {formatPrice(getTotalAddOnPrice())} VND
                  </span>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* ✅ TESTIMONIALS SECTION - HOME PAGE STYLE */}
        <section
          className={`relative px-4 py-14 sm:py-16 lg:py-20 bg-gradient-to-br ${sectionBackgrounds.testimonials}`}
          id="testimonials"
          data-animate
          style={{
            backgroundImage: `radial-gradient(circle at 20% 80%, rgba(220, 38, 127, 0.07) 0%, transparent 50%),
                             radial-gradient(circle at 80% 20%, rgba(244, 63, 94, 0.07) 0%, transparent 50%),
                             radial-gradient(circle at 40% 40%, rgba(236, 72, 153, 0.04) 0%, transparent 50%)`,
          }}
        >
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible.testimonials ? { opacity: 1, y: 0 } : {}}
              className="text-center mb-16"
            >
              <Badge
                className={`mb-4 bg-gradient-to-r ${unifiedColorScheme.button} text-white px-5 py-2 text-sm font-semibold shadow-xl`}
              >
                <Quote className="w-4 h-4 mr-2" />
                Customer Success Stories
              </Badge>
              <h2
                className={`text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r ${unifiedColorScheme.textMain} bg-clip-text text-transparent mb-4`}
              >
                Khách hàng nói gì về chúng tôi
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Hàng nghìn khách hàng đã tin tưởng và hài lòng với dịch vụ của
                chúng tôi
              </p>
            </motion.div>

            <TestimonialsCarousel testimonials={testimonials} />
          </div>
        </section>

        {/* ✅ NEWSLETTER SECTION - HOME PAGE STYLE */}
        <section
          className={`relative px-4 py-16 sm:py-20 lg:py-24 bg-gradient-to-br ${sectionBackgrounds.newsletter} overflow-hidden`}
          id="newsletter"
          data-animate
          style={{
            backgroundImage: `radial-gradient(circle at 20% 80%, rgba(236, 72, 153, 0.1) 0%, transparent 50%),
                             radial-gradient(circle at 80% 20%, rgba(244, 63, 94, 0.1) 0%, transparent 50%),
                             radial-gradient(circle at 40% 40%, rgba(220, 38, 127, 0.05) 0%, transparent 50%)`,
          }}
        >
          <div className="container mx-auto">
            <div className="max-w-2xl mx-auto">
              <NewsletterSignup />
            </div>
          </div>
        </section>

        {/* ✅ FAQ SECTION - HOME PAGE STYLE */}
        <section
          className={`relative px-4 py-14 sm:py-16 lg:py-20 bg-gradient-to-br ${sectionBackgrounds.process}`}
          id="faq"
          data-animate
          style={{
            backgroundImage: `radial-gradient(circle at 20% 80%, rgba(236, 72, 153, 0.07) 0%, transparent 50%),
                             radial-gradient(circle at 80% 20%, rgba(244, 63, 94, 0.07) 0%, transparent 50%),
                             radial-gradient(circle at 40% 40%, rgba(220, 38, 127, 0.04) 0%, transparent 50%)`,
          }}
        >
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible.faq ? { opacity: 1, y: 0 } : {}}
              className="text-center mb-16"
            >
              <Badge
                className={`mb-4 bg-gradient-to-r ${unifiedColorScheme.button} text-white px-5 py-2 text-sm font-semibold shadow-xl`}
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                Frequently Asked Questions
              </Badge>
              <h2
                className={`text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r ${unifiedColorScheme.textMain} bg-clip-text text-transparent mb-4`}
              >
                Câu hỏi thường gặp
              </h2>
              <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Những câu hỏi phổ biến về pricing và dịch vụ
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto space-y-4">
              {faqs.map((faq, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible.faq ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: idx * 0.1 }}
                >
                  <Card
                    className={`border-0 shadow-xl hover:shadow-2xl bg-gradient-to-br ${unifiedColorScheme.cardBg} backdrop-blur-lg rounded-3xl transition-all duration-500 overflow-hidden`}
                  >
                    <CardContent className="p-0">
                      <button
                        className="w-full p-6 text-left focus:outline-none"
                        onClick={() =>
                          setExpandedFAQ(expandedFAQ === idx ? null : idx)
                        }
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold pr-4 text-slate-800">
                            {faq.question}
                          </h3>
                          <motion.div
                            animate={{ rotate: expandedFAQ === idx ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown className="w-5 h-5 text-slate-500" />
                          </motion.div>
                        </div>
                      </button>
                      <AnimatePresence>
                        {expandedFAQ === idx && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="px-6 pb-6">
                              <p className="text-slate-600 leading-relaxed">
                                {faq.answer}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Modal */}
        <Modal
          isOpen={showContactModal}
          onClose={() => setShowContactModal(false)}
          title="Liên hệ Enterprise Sales"
        >
          <ContactForm />
        </Modal>
      </main>
    </>
  );
};

export default Pricing;
