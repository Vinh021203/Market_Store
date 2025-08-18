import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Users,
  Award,
  Globe,
  Heart,
  Target,
  Eye,
  Zap,
  Shield,
  Star,
  Calendar,
  TrendingUp,
  Package,
  BookOpen,
  Rocket,
  Sparkles,
  ArrowRight,
  Code,
  Palette,
  Coffee,
  Mail,
  Github,
  Linkedin,
  Twitter,
  CheckCircle,
  Clock,
  Trophy,
  Lightbulb,
  Crown,
  Building,
  Play,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Animated Counter Component
const AnimatedCounter = ({
  end,
  duration = 2000,
  prefix = "",
  suffix = "",
}) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

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

    let startTime;
    let animationFrame;

    const animate = (currentTime) => {
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
    <div ref={ref} className="text-4xl font-bold text-primary">
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </div>
  );
};

// Particle Animation Component
const ParticleBackground = () => {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    duration: Math.random() * 20 + 10,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-blue-300/20"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Enhanced Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
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
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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

// Enhanced Testimonials Carousel
const TestimonialsCarousel = ({ testimonials }) => {
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
    <div className="relative max-w-6xl mx-auto">
      <div className="overflow-hidden rounded-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-blue-900 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700"
          >
            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className="flex-shrink-0">
                <motion.img
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  src={testimonials[currentIndex].avatar}
                  alt={testimonials[currentIndex].name}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg"
                />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                  <Badge className="bg-green-100 text-green-800 ml-2">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                </div>

                <blockquote className="text-lg md:text-xl italic text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  "{testimonials[currentIndex].content}"
                </blockquote>

                <div className="space-y-2">
                  <h4 className="font-bold text-xl text-gray-900 dark:text-white">
                    {testimonials[currentIndex].name}
                  </h4>
                  <p className="text-blue-600 dark:text-blue-400 font-medium">
                    {testimonials[currentIndex].role}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400">
                    {testimonials[currentIndex].company}
                  </p>
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200"
                  >
                    <Package className="w-3 h-3 mr-1" />
                    {testimonials[currentIndex].project}
                  </Badge>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between mt-8">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPrev}
            className="p-3 hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNext}
            className="p-3 hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-blue-500 scale-125"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="flex items-center space-x-2 px-4"
        >
          {isAutoPlaying ? (
            <>
              <Clock className="w-4 h-4" />
              <span>Auto</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>Manual</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

// Company Culture Section Component
const CultureSection = () => {
  const cultureValues = [
    {
      icon: Coffee,
      title: "Work-Life Balance",
      description:
        "Flexible working hours và remote work để đảm bảo sự cân bằng giữa công việc và cuộc sống",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: Lightbulb,
      title: "Innovation First",
      description:
        "Khuyến khích sáng tạo, thử nghiệm công nghệ mới và tư duy outside the box",
      color: "from-yellow-500 to-amber-500",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description:
        "Môi trường làm việc hợp tác, chia sẻ kiến thức và hỗ trợ lẫn nhau",
      color: "from-blue-500 to-purple-500",
    },
    {
      icon: Rocket,
      title: "Continuous Growth",
      description:
        "Cơ hội phát triển không ngừng qua training, conferences và mentorship",
      color: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
      <ParticleBackground />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <Badge className="mb-6 bg-white/10 text-white border-white/20">
            <Heart className="w-4 h-4 mr-2" />
            Company Culture
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Văn hóa công ty
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Chúng tôi xây dựng một môi trường làm việc tích cực, sáng tạo và
            phát triển bền vững
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {cultureValues.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="text-center p-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300"
            >
              <div
                className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${value.color} flex items-center justify-center shadow-lg`}
              >
                <value.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">{value.title}</h3>
              <p className="text-gray-300 leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Office Showcase Section
const OfficeShowcase = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const officeImages = [
    {
      id: 1,
      title: "Modern Workspace",
      description: "Open workspace với thiết kế hiện đại",
    },
    {
      id: 2,
      title: "Collaboration Area",
      description: "Khu vực họp nhóm và brainstorming",
    },
    {
      id: 3,
      title: "Relaxation Zone",
      description: "Không gian thư giãn và nghỉ ngơi",
    },
    {
      id: 4,
      title: "Meeting Room",
      description: "Phòng họp với công nghệ tiên tiến",
    },
    {
      id: 5,
      title: "Creative Studio",
      description: "Studio sáng tạo cho design team",
    },
    {
      id: 6,
      title: "Game Corner",
      description: "Góc giải trí và team building",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <Badge className="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <Building className="w-4 h-4 mr-2" />
            Office Space
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text mb-6">
            Không gian làm việc
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Khám phá văn phòng hiện đại và các khu vực làm việc được thiết kế để
            tối ưu hóa sự sáng tạo và năng suất
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {officeImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.03, y: -5 }}
              className="relative overflow-hidden rounded-2xl shadow-xl cursor-pointer group"
              onClick={() => setSelectedImage(image)}
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                <Building className="w-16 h-16 text-white/80" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-6 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-lg font-bold mb-2">{image.title}</h3>
                <p className="text-sm text-gray-200">{image.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Image Modal */}
        <Modal
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          title={selectedImage?.title}
        >
          {selectedImage && (
            <div className="space-y-4">
              <div className="aspect-[16/9] bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
                <Building className="w-24 h-24 text-white/80" />
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                {selectedImage.description}
              </p>
            </div>
          )}
        </Modal>
      </div>
    </section>
  );
};

// Main About Component
const About = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    // Auto-rotate testimonials
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % customerStories.length);
    }, 4000);

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

    return () => {
      clearInterval(testimonialInterval);
      observer.disconnect();
    };
  }, []);

  // Data
  const stats = [
    {
      label: "Templates Premium",
      value: 1000,
      suffix: "+",
      icon: Package,
      color: "from-blue-500 to-cyan-500",
      description: "Templates chất lượng cao",
    },
    {
      label: "E-books Chuyên nghiệp",
      value: 500,
      suffix: "+",
      icon: BookOpen,
      color: "from-green-500 to-emerald-500",
      description: "Sách điện tử từ experts",
    },
    {
      label: "Khách hàng Hài lòng",
      value: 50,
      suffix: "K+",
      icon: Users,
      color: "from-purple-500 to-pink-500",
      description: "Tin tưởng trên toàn cầu",
    },
    {
      label: "Năm Kinh nghiệm",
      value: 5,
      suffix: "+",
      icon: Calendar,
      color: "from-orange-500 to-red-500",
      description: "Chuyên môn trong ngành",
    },
  ];

  const values = [
    {
      icon: Target,
      title: "Sứ mệnh",
      description:
        "Trao quyền cho các nhà phát triển và thiết kế viên với các công cụ và tài nguyên chất lượng cao để tạo ra những sản phẩm tuyệt vời.",
      color: "from-blue-500 to-purple-500",
      features: ["Chất lượng cao", "Dễ sử dụng", "Hỗ trợ 24/7"],
    },
    {
      icon: Eye,
      title: "Tầm nhìn",
      description:
        "Trở thành nền tảng hàng đầu cung cấp templates và e-books chuyên nghiệp, giúp cộng đồng công nghệ phát triển mạnh mẽ.",
      color: "from-green-500 to-teal-500",
      features: ["Đổi mới liên tục", "Mở rộng toàn cầu", "Công nghệ tiên tiến"],
    },
    {
      icon: Heart,
      title: "Giá trị cốt lõi",
      description:
        "Chất lượng, đổi mới, tin cậy và hỗ trợ khách hàng là những giá trị cốt lõi định hình mọi hoạt động của chúng tôi.",
      color: "from-pink-500 to-red-500",
      features: ["Tính chính trực", "Sáng tạo", "Khách hàng là trung tâm"],
    },
  ];

  const features = [
    {
      icon: Zap,
      title: "Chất lượng hàng đầu",
      description:
        "Mọi sản phẩm đều được chọn lọc kỹ càng và kiểm tra chất lượng nghiêm ngặt trước khi phát hành.",
      color: "from-yellow-400 to-orange-500",
      stats: "99.9% satisfaction rate",
    },
    {
      icon: Shield,
      title: "Bảo mật tuyệt đối",
      description:
        "Hệ thống thanh toán an toàn với mã hóa SSL và tuân thủ các tiêu chuẩn bảo mật quốc tế.",
      color: "from-blue-400 to-purple-500",
      stats: "256-bit SSL encryption",
    },
    {
      icon: Users,
      title: "Hỗ trợ tận tình",
      description:
        "Đội ngũ hỗ trợ chuyên nghiệp sẵn sàng giúp đỡ bạn 24/7 qua nhiều kênh liên lạc.",
      color: "from-pink-400 to-red-500",
      stats: "< 2 hours response time",
    },
  ];

  const team = [
    {
      name: "Lương Thế Vinh",
      role: "CEO & Founder",
      avatar:
        "https://scontent.fhan14-1.fna.fbcdn.net/v/t39.30808-1/489339899_1650866852469101_623711763546528465_n.jpg",
      description:
        "10+ năm kinh nghiệm trong lĩnh vực công nghệ và thiết kế web. Tốt nghiệp Stanford University với bằng Computer Science.",
      expertise: [
        "Product Strategy",
        "Team Leadership",
        "Business Development",
      ],
      achievements: ["Forbes 30 Under 30", "Tech Innovation Award 2023"],
    },
    {
      name: "Trần Đức Chính",
      role: "CTO & Co-founder",
      avatar:
        "https://scontent.fhan14-3.fna.fbcdn.net/v/t39.30808-1/451068920_2388215684719568_3299302164425753155_n.jpg",
      description:
        "Chuyên gia về kiến trúc hệ thống và phát triển sản phẩm. Ex-Google Senior Engineer với 12 năm kinh nghiệm.",
      expertise: ["System Architecture", "Cloud Computing", "AI/ML"],
      achievements: ["Google Cloud Architect", "AWS Solutions Architect"],
    },
    {
      name: "Ngô Minh Phương",
      role: "Creative Director",
      avatar:
        "https://scontent.fhan14-3.fna.fbcdn.net/v/t39.30808-1/504634478_1796619404219357_83029977015560976_n.jpg",
      description:
        "Chuyên gia thiết kế UI/UX với hơn 8 năm kinh nghiệm. Từng làm việc tại Apple và Adobe.",
      expertise: ["UI/UX Design", "Design Systems", "Brand Identity"],
      achievements: ["Dribbble Top Designer", "Design Awards Winner 2022"],
    },
  ];

  const milestones = [
    {
      year: "2019",
      event: "Thành lập Template Market",
      description:
        "Bắt đầu với 50 templates đầu tiên và tầm nhìn cách mạng hóa ngành template",
      icon: Rocket,
      color: "from-blue-500 to-purple-500",
    },
    {
      year: "2020",
      event: "Ra mắt E-books Platform",
      description:
        "Mở rộng sang lĩnh vực xuất bản sách điện tử với 100+ tác giả chuyên nghiệp",
      icon: BookOpen,
      color: "from-green-500 to-blue-500",
    },
    {
      year: "2021",
      event: "10,000 Khách hàng",
      description: "Đạt mốc 10,000 khách hàng tin tưởng và 500,000 downloads",
      icon: Users,
      color: "from-purple-500 to-pink-500",
    },
    {
      year: "2022",
      event: "Mở rộng Quốc tế",
      description:
        "Phục vụ khách hàng trên 50 quốc gia với đội ngũ support đa ngôn ngữ",
      icon: Globe,
      color: "from-orange-500 to-red-500",
    },
    {
      year: "2023",
      event: "1 Triệu Downloads",
      description:
        "Vượt mốc 1 triệu lượt tải sản phẩm và ra mắt Premium Membership",
      icon: Trophy,
      color: "from-yellow-500 to-orange-500",
    },
    {
      year: "2024",
      event: "AI Integration",
      description:
        "Tích hợp AI để cải thiện trải nghiệm người dùng và tự động hóa quy trình",
      icon: Lightbulb,
      color: "from-cyan-500 to-blue-500",
    },
  ];

  const customerStories = [
    {
      name: "Lê Văn Đức",
      role: "Senior Developer",
      company: "Tiki Vietnam",
      content:
        "Template Market đã giúp team chúng tôi tiết kiệm 60% thời gian development. Chất lượng templates rất cao và support team cực kỳ responsive. Đây là investment tốt nhất cho productivity của team.",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      project: "E-commerce Platform Redesign",
    },
    {
      name: "Emma Thompson",
      role: "UI/UX Designer",
      company: "Shopify International",
      content:
        "The design quality and documentation are outstanding. We've used multiple templates for client projects and they always exceed expectations. The attention to detail is remarkable.",
      avatar:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      project: "SaaS Dashboard Design",
    },
    {
      name: "Trần Thị Hương",
      role: "Freelance Developer",
      company: "Independent",
      content:
        "E-books của Template Market đã nâng cao kỹ năng coding của tôi đáng kể. Nội dung rất thực tế và dễ áp dụng vào dự án thực tế. Recommend cho mọi developer muốn improve skills.",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      project: "React Advanced Patterns",
    },
  ];

  const achievements = [
    { title: "Best Template Marketplace 2023", org: "Web Design Awards" },
    { title: "Top 10 Developer Tools", org: "Product Hunt" },
    { title: "Excellence in Customer Service", org: "Customer Choice Awards" },
    { title: "Innovation in EdTech", org: "Tech Innovation Summit" },
    { title: "Rising Star in SaaS", org: "TechCrunch Disrupt" },
    { title: "Best User Experience", org: "UX Design Awards" },
  ];

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Enhanced Hero Section */}
      <section className="relative px-4 py-24 overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute bg-blue-300 rounded-full top-10 left-10 w-72 h-72 mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div
            className="absolute bg-purple-300 rounded-full top-40 right-20 w-72 h-72 mix-blend-multiply filter blur-xl opacity-30 animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute bg-pink-300 rounded-full bottom-20 left-1/2 w-72 h-72 mix-blend-multiply filter blur-xl opacity-30 animate-pulse"
            style={{ animationDelay: "4s" }}
          ></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-1/4 left-1/4"
            animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <Code className="w-8 h-8 text-blue-500 opacity-60" />
          </motion.div>
          <motion.div
            className="absolute top-1/3 right-1/4"
            animate={{ y: [0, -15, 0], rotate: [0, -10, 0] }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          >
            <Palette className="w-6 h-6 text-purple-500 opacity-60" />
          </motion.div>
          <motion.div
            className="absolute bottom-1/4 left-1/3"
            animate={{ y: [0, -25, 0], rotate: [0, 15, 0] }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          >
            <Coffee className="text-orange-500 w-7 h-7 opacity-60" />
          </motion.div>
        </div>

        <div className="container relative z-10 mx-auto text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge className="mb-6 border-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur px-6 py-3">
                <Building className="w-4 h-4 mr-2" />
                Giới thiệu về chúng tôi
                <Sparkles className="w-4 h-4 ml-2 animate-pulse" />
              </Badge>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl font-bold leading-tight text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Chúng tôi là
              <br />
              <span className="text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text">
                Template Market
              </span>
            </motion.h1>

            <motion.p
              className="max-w-3xl mx-auto text-xl md:text-2xl text-muted-foreground leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Nền tảng hàng đầu cung cấp{" "}
              <span className="font-semibold text-blue-600">
                templates chuyên nghiệp
              </span>{" "}
              và
              <span className="font-semibold text-purple-600">
                {" "}
                e-books chất lượng cao
              </span>
              , giúp developers và designers tạo ra những sản phẩm tuyệt vời.
            </motion.p>

            <motion.div
              className="flex flex-col items-center justify-center gap-4 mt-12 sm:flex-row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button
                size="lg"
                asChild
                className="transition-all duration-300 shadow-lg group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl px-8 py-4"
              >
                <Link to="/templates">
                  <Rocket className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                  Khám phá Templates
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="transition-all duration-300 border-2 group backdrop-blur bg-white/20 dark:bg-slate-800/20 hover:scale-105 px-8 py-4"
                onClick={() => setShowContactModal(true)}
              >
                <Mail className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                Liên hệ với chúng tôi
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="px-4 py-20 bg-muted/50" id="stats" data-animate>
        <div className="container mx-auto">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className={`group text-center transform transition-all duration-500 hover:scale-110 ${
                  isVisible["stats"]
                    ? "animate-in slide-in-from-bottom"
                    : "opacity-0"
                }`}
                style={{ animationDelay: `${index * 150}ms` }}
                whileHover={{ y: -10 }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-8 transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 group-hover:shadow-2xl">
                  <CardContent className="space-y-6">
                    <div
                      className={`relative flex items-center justify-center w-20 h-20 mx-auto rounded-2xl bg-gradient-to-r ${stat.color} shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110`}
                    >
                      <stat.icon className="w-10 h-10 text-white group-hover:animate-pulse" />
                      <div className="absolute inset-0 transition-opacity duration-300 opacity-0 rounded-2xl bg-white/20 group-hover:opacity-100"></div>
                    </div>
                    <div>
                      <div className="text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text">
                        <AnimatedCounter
                          end={stat.value}
                          suffix={stat.suffix}
                        />
                      </div>

                      <div className="mb-2 text-lg font-medium text-muted-foreground">
                        {stat.label}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {stat.description}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Mission, Vision, Values */}
      <section className="px-4 py-20" id="values" data-animate>
        <div className="container mx-auto">
          <motion.div
            className="text-center space-y-4 mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3">
              <Target className="w-4 h-4 mr-2" />
              Our Values
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
              Về chúng tôi
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-muted-foreground">
              Khám phá sứ mệnh, tầm nhìn và những giá trị cốt lõi định hình nên
              Template Market
            </p>
          </motion.div>

          <div className="grid gap-10 md:grid-cols-3">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="relative"
              >
                <Card className="h-full p-8 text-center transition-all duration-300 border-0 shadow-xl group bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 hover:shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <CardContent className="space-y-8 relative z-10">
                    <div
                      className={`mx-auto w-24 h-24 rounded-3xl bg-gradient-to-r ${value.color} flex items-center justify-center shadow-2xl group-hover:shadow-3xl transition-all duration-300 group-hover:scale-110`}
                    >
                      <value.icon className="w-12 h-12 text-white group-hover:animate-pulse" />
                    </div>
                    <div>
                      <h3 className="mb-4 text-2xl font-bold transition-colors group-hover:text-primary">
                        {value.title}
                      </h3>
                      <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
                        {value.description}
                      </p>
                      <div className="space-y-3">
                        {value.features.map((feature, featureIndex) => (
                          <motion.div
                            key={featureIndex}
                            className="flex items-center justify-center space-x-3"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{
                              delay: index * 0.1 + featureIndex * 0.1,
                            }}
                          >
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <span className="text-muted-foreground font-medium">
                              {feature}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Features */}
      <section
        className="px-4 py-20 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900"
        id="features"
        data-animate
      >
        <div className="container mx-auto">
          <motion.div
            className="text-center space-y-4 mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-3">
              <Star className="w-4 h-4 mr-2" />
              Why Choose Us
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text">
              Tại sao chọn chúng tôi?
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-muted-foreground">
              Những tính năng và dịch vụ vượt trội mà chúng tôi mang lại cho
              khách hàng
            </p>
          </motion.div>

          <div className="grid gap-10 md:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <Card className="h-full p-8 text-center transition-all duration-300 border-0 shadow-xl group bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 hover:shadow-2xl">
                  <CardContent className="space-y-8">
                    <div
                      className={`mx-auto w-24 h-24 rounded-3xl bg-gradient-to-r ${feature.color} flex items-center justify-center shadow-2xl group-hover:shadow-3xl transition-all duration-300 group-hover:scale-110`}
                    >
                      <feature.icon className="w-12 h-12 text-white group-hover:animate-pulse" />
                    </div>
                    <div>
                      <h3 className="mb-4 text-2xl font-bold transition-colors group-hover:text-primary">
                        {feature.title}
                      </h3>
                      <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
                        {feature.description}
                      </p>
                      <Badge className="bg-primary/10 text-primary px-4 py-2">
                        <Star className="w-4 h-4 mr-2" />
                        {feature.stats}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Team Section */}
      <section className="px-4 py-20" id="team" data-animate>
        <div className="container mx-auto">
          <motion.div
            className="text-center space-y-4 mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3">
              <Users className="w-4 h-4 mr-2" />
              Our Team
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text">
              Đội ngũ của chúng tôi
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-muted-foreground">
              Gặp gỡ những con người tài năng đằng sau thành công của Template
              Market
            </p>
          </motion.div>

          <div className="grid gap-10 md:grid-cols-3">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <Card className="h-full p-8 text-center transition-all duration-300 border-0 shadow-xl group bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 hover:shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <CardContent className="space-y-8 relative z-10">
                    <div className="relative">
                      <motion.img
                        src={member.avatar}
                        alt={member.name}
                        className="object-cover w-32 h-32 mx-auto transition-all duration-300 border-4 border-white dark:border-gray-700 rounded-full shadow-xl group-hover:shadow-2xl"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      />
                      <div className="absolute flex items-center justify-center w-10 h-10 rounded-full -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg">
                        <Crown className="w-5 h-5 text-white" />
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-2 text-2xl font-bold">{member.name}</h3>
                      <p className="mb-4 text-lg font-medium text-primary">
                        {member.role}
                      </p>
                      <p className="mb-6 text-base leading-relaxed text-muted-foreground">
                        {member.description}
                      </p>

                      {/* Expertise Tags */}
                      <div className="flex flex-wrap justify-center gap-2 mb-6">
                        {member.expertise.map((skill, skillIndex) => (
                          <Badge
                            key={skillIndex}
                            variant="outline"
                            className="text-sm px-3 py-1 hover:bg-primary hover:text-white transition-colors cursor-pointer"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>

                      {/* Achievements */}
                      <div className="mb-6 space-y-3">
                        {member.achievements.map((achievement, achIndex) => (
                          <div
                            key={achIndex}
                            className="flex items-center justify-center space-x-2 text-sm text-muted-foreground"
                          >
                            <Award className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                            <span>{achievement}</span>
                          </div>
                        ))}
                      </div>

                      {/* Social Links */}
                      <div className="flex justify-center space-x-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-10 h-10 p-0 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full"
                        >
                          <Linkedin className="w-5 h-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-10 h-10 p-0 hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20 rounded-full"
                        >
                          <Twitter className="w-5 h-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-10 h-10 p-0 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full"
                        >
                          <Github className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Timeline */}
      <section
        className="px-4 py-20 bg-gradient-to-br from-slate-50 to-purple-50 dark:from-slate-900 dark:to-purple-900"
        id="timeline"
        data-animate
      >
        <div className="container mx-auto">
          <motion.div
            className="text-center space-y-4 mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3">
              <Clock className="w-4 h-4 mr-2" />
              Timeline
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text">
              Hành trình phát triển
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-muted-foreground">
              Những cột mốc quan trọng trong quá trình phát triển của chúng tôi
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto">
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col md:flex-row items-start gap-8"
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div
                    className={`flex-shrink-0 w-24 h-24 rounded-3xl bg-gradient-to-r ${milestone.color} flex flex-col items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300`}
                  >
                    <milestone.icon className="w-8 h-8 text-white mb-1" />
                    <div className="text-xs font-bold text-white">
                      {milestone.year}
                    </div>
                  </div>

                  <div className="flex-1">
                    <Card className="p-8 transition-all duration-300 border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 hover:shadow-2xl">
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-4 mb-4">
                          <Badge
                            className={`bg-gradient-to-r ${milestone.color} text-white px-4 py-2`}
                          >
                            {milestone.year}
                          </Badge>
                          <h3 className="text-xl md:text-2xl font-bold text-primary">
                            {milestone.event}
                          </h3>
                        </div>
                        <p className="text-lg leading-relaxed text-muted-foreground">
                          {milestone.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Customer Stories Section */}
      <section className="px-4 py-20" id="testimonials" data-animate>
        <div className="container mx-auto">
          <motion.div
            className="text-center space-y-4 mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3">
              <Heart className="w-4 h-4 mr-2" />
              Customer Stories
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
              Câu chuyện khách hàng
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-muted-foreground">
              Những trải nghiệm thực tế từ khách hàng đã sử dụng sản phẩm của
              chúng tôi
            </p>
          </motion.div>

          <TestimonialsCarousel testimonials={customerStories} />
        </div>
      </section>

      {/* Company Culture Section */}
      <CultureSection />

      {/* Office Showcase */}
      <OfficeShowcase />

      {/* Achievements Section */}
      <section
        className="px-4 py-20 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20"
        id="achievements"
        data-animate
      >
        <div className="container mx-auto">
          <motion.div
            className="text-center space-y-4 mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-6 py-3">
              <Trophy className="w-4 h-4 mr-2" />
              Awards & Recognition
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text">
              Thành tựu & Giải thưởng
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-muted-foreground">
              Những ghi nhận và giải thưởng mà chúng tôi đã đạt được
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <Card className="h-full p-8 text-center transition-all duration-300 border-0 shadow-xl group bg-gradient-to-br from-white to-yellow-50 dark:from-slate-800 dark:to-yellow-900/20 hover:shadow-2xl">
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-center w-20 h-20 mx-auto transition-all duration-300 rounded-full shadow-xl bg-gradient-to-r from-yellow-400 to-orange-500 group-hover:shadow-2xl group-hover:scale-110">
                      <Trophy className="w-10 h-10 text-white group-hover:animate-pulse" />
                    </div>
                    <div>
                      <h3 className="mb-3 text-lg font-bold transition-colors group-hover:text-primary">
                        {achievement.title}
                      </h3>
                      <p className="text-muted-foreground font-medium">
                        {achievement.org}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Contact CTA Section */}
      <section className="relative px-4 py-24 overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-black/10"></div>
          <motion.div
            className="absolute w-32 h-32 rounded-full top-10 right-10 bg-white/10"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute w-24 h-24 rounded-full bottom-10 left-10 bg-white/10"
            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 6, repeat: Infinity, delay: 2 }}
          />
        </div>

        <div className="container relative z-10 mx-auto text-center">
          <div className="max-w-4xl mx-auto space-y-8 text-white">
            <motion.h2
              className="text-4xl md:text-6xl font-bold leading-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Sẵn sàng bắt đầu hành trình cùng chúng tôi?
            </motion.h2>
            <motion.p
              className="text-xl md:text-2xl opacity-90 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Khám phá hàng nghìn templates chuyên nghiệp và e-books chất lượng
              cao. Tham gia cộng đồng 50,000+ developers và designers trên toàn
              thế giới.
            </motion.p>

            <motion.div
              className="flex flex-col items-center justify-center gap-6 sm:flex-row"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Button
                size="lg"
                variant="secondary"
                asChild
                className="transition-all duration-300 group hover:scale-105 hover:shadow-2xl px-8 py-4 text-lg font-bold"
              >
                <Link to="/templates">
                  <Package className="w-6 h-6 mr-3 group-hover:animate-bounce" />
                  Khám phá Templates
                  <ArrowRight className="w-6 h-6 ml-3 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="text-white transition-all duration-300 border-2 border-white hover:bg-white hover:text-purple-600 hover:scale-105 px-8 py-4 text-lg font-bold"
                onClick={() => setShowContactModal(true)}
              >
                <Mail className="w-6 h-6 mr-3" />
                Liên hệ với chúng tôi
              </Button>
            </motion.div>

            <motion.div
              className="flex flex-wrap items-center justify-center gap-8 pt-8 text-lg opacity-90"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.9 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6" />
                <span>50K+ Khách hàng</span>
              </div>
              <div className="flex items-center gap-3">
                <Star className="w-6 h-6" />
                <span>4.9/5 Rating</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6" />
                <span>100% Secure</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Modal */}
      <Modal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        title="Liên hệ với chúng tôi"
      >
        <div className="space-y-6">
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Chúng tôi rất mong được nghe từ bạn! Hãy để lại thông tin và chúng
            tôi sẽ liên hệ trong 24h.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-bold text-lg">Thông tin liên hệ</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-500" />
                  <span>contact@templatemarket.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Github className="w-5 h-5 text-gray-700" />
                  <span>@templatemarket</span>
                </div>
                <div className="flex items-center gap-3">
                  <Twitter className="w-5 h-5 text-blue-400" />
                  <span>@templatemarket</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-lg">Giờ làm việc</h3>
              <div className="space-y-2 text-gray-600 dark:text-gray-300">
                <div>Thứ 2 - Thứ 6: 9:00 - 18:00</div>
                <div>Thứ 7: 9:00 - 17:00</div>
                <div>Chủ nhật: Nghỉ</div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105">
              <Mail className="w-5 h-5 mr-2" />
              Gửi liên hệ
            </Button>
            <Button
              className="flex-1 bg-white text-purple-700 font-bold py-3 px-6 border border-purple-300 rounded-lg shadow hover:bg-purple-50 transition-all duration-300 hover:scale-105"
              onClick={() => setShowContactModal(false)}
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Đóng
            </Button>
          </div>
        </div>
      </Modal>

      {/* Scroll to Top Button */}
      <motion.button
        className="fixed bottom-8 right-8 z-40 p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ y: -2 }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <ArrowRight className="w-5 h-5 transform -rotate-90" />
      </motion.button>

      {/* Loading Overlay */}
      <AnimatePresence>
        {/* You can add loading state here if needed */}
      </AnimatePresence>
    </div>
  );
};

export default About;
