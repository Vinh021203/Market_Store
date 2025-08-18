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
            {title && <h2 className="text-2xl font-bold">{title}</h2>}
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
          className={`${sticky ? "sticky top-0 z-10" : ""} bg-gradient-to-r from-slate-50 to-blue-50`}
        >
          <tr>
            <th className="text-left p-6 font-bold text-lg">Features</th>
            {plans.map((plan) => (
              <th key={plan.id} className="text-center p-6">
                <div className="space-y-2">
                  <div
                    className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-r ${plan.color} flex items-center justify-center`}
                  >
                    <plan.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="font-bold text-lg">{plan.name}</div>
                  {plan.popular && (
                    <Badge className="bg-purple-100 text-purple-800">
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
            <tr key={featureIndex} className="border-t hover:bg-slate-50">
              <td className="p-4 font-medium">
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
            className="bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-blue-900 p-8 rounded-2xl shadow-xl"
          >
            <div className="flex items-start space-x-6">
              <img
                src={testimonials[currentIndex].avatar}
                alt={testimonials[currentIndex].name}
                className="w-16 h-16 rounded-full object-cover ring-4 ring-blue-100"
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
                <blockquote className="text-lg italic text-gray-700 dark:text-gray-300 mb-4">
                  "{testimonials[currentIndex].content}"
                </blockquote>
                <div>
                  <div className="font-bold text-lg">
                    {testimonials[currentIndex].name}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
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
                index === currentIndex ? "bg-blue-500" : "bg-gray-300"
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
    <div className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 rounded-2xl p-8 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative z-10">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold mb-2">Nhận ưu đãi đặc biệt!</h3>
          <p className="text-blue-100">
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
              className="bg-white text-purple-600 hover:bg-gray-100 font-bold"
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
            <p className="text-blue-100">
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
    // Handle form submission
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
        <CardTitle className="text-2xl font-bold text-center">
          Liên hệ tư vấn
        </CardTitle>
        <p className="text-center text-muted-foreground">
          Để lại thông tin, chúng tôi sẽ liên hệ trong 24h
        </p>
      </CardHeader>
      <CardContent>
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Họ tên *</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nhập họ tên"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
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
              <label className="block text-sm font-medium mb-2">Công ty</label>
              <Input
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Tên công ty (tùy chọn)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
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
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600"
            >
              Gửi yêu cầu
            </Button>
          </form>
        ) : (
          <div className="text-center py-8">
            <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-500" />
            <h3 className="text-xl font-bold mb-2">Đã gửi thành công!</h3>
            <p className="text-muted-foreground">
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

  // Scroll to top function
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Plans data
  const plans: Plan[] = [
    {
      id: "starter",
      name: "Starter",
      description: "Hoàn hảo cho dự án cá nhân và học tập",
      icon: Code,
      color: "from-blue-500 to-cyan-500",
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
      color: "from-purple-500 to-pink-500",
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
      color: "from-orange-500 to-red-500",
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

  // Add-ons data
  const addOns: AddOn[] = [
    {
      name: "Premium Support",
      description: "24/7 priority support với dedicated manager",
      price: 499000,
      originalPrice: 699000,
      icon: Headphones,
      color: "from-green-500 to-emerald-500",
      popular: true,
      category: "support",
    },
    {
      name: "Custom Development",
      description: "Tùy chỉnh template theo yêu cầu riêng",
      price: 2999000,
      icon: Code,
      color: "from-blue-500 to-purple-500",
      category: "development",
    },
    {
      name: "Design Consultation",
      description: "1-on-1 với UI/UX experts",
      price: 1499000,
      originalPrice: 1999000,
      icon: Palette,
      color: "from-pink-500 to-rose-500",
      category: "design",
    },
    {
      name: "API Integration",
      description: "Tích hợp API & third-party services",
      price: 1999000,
      icon: Database,
      color: "from-cyan-500 to-blue-500",
      category: "development",
    },
    {
      name: "Performance Audit",
      description: "Tối ưu performance website",
      price: 799000,
      icon: BarChart3,
      color: "from-violet-500 to-purple-500",
      category: "optimization",
    },
    {
      name: "SEO Optimization",
      description: "Tối ưu SEO cho website",
      price: 1299000,
      icon: Search,
      color: "from-yellow-500 to-orange-500",
      category: "optimization",
    },
  ];

  // Stats data
  const stats: Stat[] = [
    {
      label: "Khách hàng hài lòng",
      value: "50K+",
      icon: Users,
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Templates chất lượng",
      value: "200+",
      icon: Code,
      color: "from-purple-500 to-pink-500",
    },
    {
      label: "Quốc gia sử dụng",
      value: "75+",
      icon: Globe,
      color: "from-green-500 to-emerald-500",
    },
    {
      label: "Tỷ lệ hài lòng",
      value: "99%",
      icon: ThumbsUp,
      color: "from-orange-500 to-red-500",
    },
  ];

  // Testimonials data
  const testimonials: Testimonial[] = [
    {
      name: "Hoàng Huy Thành",
      role: "Frontend Developer",
      company: "Viettel Digital",
      content:
        "React template ở đây UI hiệu ứng gradient quá chất, tiết kiệm thời gian build, team mình rất hài lòng. Code structure clean, documentation đầy đủ, support team response nhanh.",
      avatar:
        "https://scontent.fhan14-3.fna.fbcdn.net/v/t39.30808-1/475306604_1341522327007451_8012558107895950745_n.jpg",
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
        "https://scontent.fhan14-4.fna.fbcdn.net/v/t39.30808-1/449773850_2622629564611139_5225033693435173954_n.jpg",
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
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
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
        "https://images.unsplash.com/photo-1494790108755-2616b612b5c6?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      verified: true,
    },
  ];

  // FAQs data
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

  // UI Render
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900">
      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-40 p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            <ArrowUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative px-4 py-20 overflow-hidden">
        {/* Background animations */}
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full mix-blend-multiply filter blur-xl opacity-20"
              style={{
                background: `linear-gradient(45deg, ${
                  [
                    "#3B82F6",
                    "#8B5CF6",
                    "#EC4899",
                    "#F59E0B",
                    "#10B981",
                    "#F97316",
                  ][i]
                }, transparent)`,
                width: `${200 + i * 50}px`,
                height: `${200 + i * 50}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, 100, 0],
                y: [0, -100, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 20 + i * 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="container relative z-10 mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 border-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur shadow-xl px-6 py-3">
              <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
              Pricing Plans 2025
              <TrendingUp className="w-4 h-4 ml-2" />
            </Badge>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text mb-6">
              Chọn plan phù hợp <br />
              <span className="text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text">
                cho dự án của bạn
              </span>
            </h1>

            <p className="max-w-3xl mx-auto text-xl text-muted-foreground mb-8">
              Từ dự án cá nhân đến enterprise, chúng tôi có giải pháp phù hợp
              cho mọi nhu cầu.
              <span className="font-semibold text-green-600">
                {" "}
                Tiết kiệm đến 33%
              </span>{" "}
              khi chọn yearly plan.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center max-w-lg p-6 mx-auto space-x-6 border-2 bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-3xl shadow-2xl mb-12">
              <span
                className={`text-lg font-bold transition-all duration-300 ${!isYearly ? "text-primary scale-110" : "text-muted-foreground"}`}
              >
                Monthly
              </span>
              <Switch
                checked={isYearly}
                onCheckedChange={setIsYearly}
                className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-purple-600 scale-125"
              />
              <span
                className={`text-lg font-bold transition-all duration-300 ${isYearly ? "text-primary scale-110" : "text-muted-foreground"}`}
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

      {/* Stats Section */}
      <section className="px-4 py-12">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div
                  className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-lg`}
                >
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <AnimatedCounter
                  end={parseInt(stat.value.replace(/[^0-9]/g, "") || "0")}
                  suffix={stat.value.replace(/[0-9]/g, "")}
                  className="text-3xl font-bold text-primary mb-2"
                />
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="px-4 py-16">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Chọn gói phù hợp với bạn
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tất cả gói đều bao gồm access đến template library và regular
              updates
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3 mb-12">
            {plans.map((plan, idx) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="relative"
              >
                <Card
                  className={`relative overflow-hidden transition-all duration-500 border-0 ${
                    plan.popular
                      ? "bg-gradient-to-br from-white to-purple-50 dark:from-slate-800 dark:to-purple-900 ring-2 ring-purple-500 scale-105"
                      : "bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900"
                  } ${hoveredPlan === plan.id ? "shadow-2xl" : "shadow-xl"}`}
                  onMouseEnter={() => setHoveredPlan(plan.id)}
                  onMouseLeave={() => setHoveredPlan(null)}
                >
                  {plan.popular && (
                    <div className="absolute top-0 left-0 right-0 z-10">
                      <div className="py-3 text-sm font-bold text-center text-white bg-gradient-to-r from-purple-500 to-pink-500">
                        <Star className="inline w-4 h-4 mr-1" />
                        {plan.highlight}
                      </div>
                    </div>
                  )}

                  {plan.badge && (
                    <div className="absolute top-4 right-4 z-10">
                      <Badge className="bg-blue-100 text-blue-800 shadow-lg">
                        {plan.badge}
                      </Badge>
                    </div>
                  )}

                  <CardHeader
                    className={`text-center space-y-6 ${plan.popular ? "pt-20" : "pt-8"} pb-8`}
                  >
                    <div
                      className={`w-20 h-20 mx-auto rounded-3xl bg-gradient-to-r ${plan.color} flex items-center justify-center shadow-2xl`}
                    >
                      <plan.icon className="w-10 h-10 text-white" />
                    </div>

                    <div>
                      <CardTitle className="mb-3 text-3xl font-bold">
                        {plan.name}
                      </CardTitle>
                      <p className="text-muted-foreground text-lg leading-relaxed">
                        {plan.description}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-baseline justify-center space-x-2">
                        <span className="text-5xl font-extrabold tracking-tight">
                          {formatPrice(
                            isYearly ? plan.yearlyPrice : plan.monthlyPrice,
                          )}
                        </span>
                        <span className="text-xl text-muted-foreground font-medium">
                          VND
                        </span>
                      </div>
                      <div className="text-muted-foreground">
                        {isYearly ? "per year" : "per month"}
                      </div>
                      {isYearly && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-sm space-y-2"
                        >
                          <div className="line-through text-muted-foreground">
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
                          ? "bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 shadow-xl hover:shadow-2xl"
                          : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl"
                      }`}
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

                  <CardContent className="space-y-6 pb-8">
                    <Separator />
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold tracking-wide uppercase text-muted-foreground">
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
                                <X className="w-5 h-5 text-muted-foreground" />
                              )}
                            </div>
                            <span
                              className={`text-sm ${
                                feature.included
                                  ? "text-foreground font-medium"
                                  : "text-muted-foreground"
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
              className="mb-8"
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

      {/* Add-ons Section */}
      <section className="px-4 py-16 bg-gradient-to-r from-slate-50/50 to-blue-50/50 dark:from-slate-900/50 dark:to-blue-900/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
              Add-ons & Services
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Nâng cao trải nghiệm với các dịch vụ bổ sung chuyên nghiệp
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {addOns.map((addon, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <Card className="h-full transition-all duration-300 border-0 group hover:shadow-2xl bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 relative overflow-hidden">
                  {addon.popular && (
                    <div className="absolute top-0 right-0">
                      <Badge className="bg-red-100 text-red-800 m-4">
                        <Star className="w-3 h-3 mr-1" />
                        Popular
                      </Badge>
                    </div>
                  )}

                  <CardContent className="p-6 space-y-4 text-center h-full flex flex-col">
                    <div
                      className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${addon.color} flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300`}
                    >
                      <addon.icon className="w-8 h-8 text-white" />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-3">{addon.name}</h3>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        {addon.description}
                      </p>

                      <div className="space-y-2">
                        <div className="text-2xl font-bold text-primary">
                          {formatPrice(addon.price)} VND
                        </div>
                        {addon.originalPrice && (
                          <div className="text-sm text-muted-foreground line-through">
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
                      className="w-full transition-all duration-300 group-hover:shadow-lg"
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
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl"
            >
              <h3 className="text-lg font-bold mb-4">Add-ons đã chọn:</h3>
              <div className="space-y-2 mb-4">
                {selectedAddOns.map((addonName) => {
                  const addon = addOns.find((a) => a.name === addonName);
                  return addon ? (
                    <div
                      key={addonName}
                      className="flex justify-between items-center"
                    >
                      <span>{addon.name}</span>
                      <span className="font-bold">
                        {formatPrice(addon.price)} VND
                      </span>
                    </div>
                  ) : null;
                })}
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Tổng cộng:</span>
                <span className="text-primary">
                  {formatPrice(getTotalAddOnPrice())} VND
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-4 py-16">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text">
              Khách hàng nói gì về chúng tôi
            </h2>
            <p className="text-xl text-muted-foreground">
              Hàng nghìn khách hàng đã tin tưởng và hài lòng với dịch vụ của
              chúng tôi
            </p>
          </div>

          <TestimonialsCarousel testimonials={testimonials} />
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="px-4 py-16">
        <div className="container mx-auto">
          <div className="max-w-2xl mx-auto">
            <NewsletterSignup />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 py-16 bg-gradient-to-r from-slate-50/50 to-purple-50/50 dark:from-slate-900/50 dark:to-purple-900/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text">
              Câu hỏi thường gặp
            </h2>
            <p className="text-xl text-muted-foreground">
              Những câu hỏi phổ biến về pricing và dịch vụ
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-0">
                    <button
                      className="w-full p-6 text-left focus:outline-none"
                      onClick={() =>
                        setExpandedFAQ(expandedFAQ === idx ? null : idx)
                      }
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold pr-4">
                          {faq.question}
                        </h3>
                        <motion.div
                          animate={{ rotate: expandedFAQ === idx ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
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
                            <p className="text-muted-foreground leading-relaxed">
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
    </div>
  );
};

export default Pricing;
