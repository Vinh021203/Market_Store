import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { createContact } from "@/lib/contacts";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Send,
  CheckCircle,
  Sparkles,
  Globe,
  Users,
  Zap,
  Heart,
  Star,
  ArrowRight,
  Building,
  Headphones,
  Shield,
  Award,
  Coffee,
  Code,
  Palette,
  MessageSquare,
  Calendar,
  ChevronDown,
  ExternalLink,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Github,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const contactSchema = z.object({
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().optional(),
  company: z.string().optional(),
  subject: z.string().min(5, "Tiêu đề phải có ít nhất 5 ký tự"),
  category: z.enum([
    "support",
    "sales",
    "partnership",
    "feedback",
    "media",
    "other",
  ]),
  message: z.string().min(10, "Tin nhắn phải có ít nhất 10 ký tự"),
});

type ContactData = z.infer<typeof contactSchema>;

const Contact: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactData>({
    resolver: zodResolver(contactSchema),
  });

  useEffect(() => {
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
  }, []);

  const onSubmit = async (data: ContactData) => {
    setIsSubmitting(true);

    // Simulate form submission
    // await new Promise((resolve) => setTimeout(resolve, 2000));
    try {
      if (!data.name || !data.email || !data.subject || !data.message) {
        throw new Error("Vui lòng điền đầy đủ thông tin bắt buộc");
      }

      const contact = await createContact({
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone?.trim(),
        company: data.company?.trim(),
        subject: data.subject.trim(),
        category: data.category,
        message: data.message.trim(),
      });

      toast({
        title: "✅ Tin nhắn đã được gửi!",
        description:
          "Email thông báo đã được gửi. Chúng tôi sẽ phản hồi trong 24h.",
      });

      // Auto reset success state
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      console.error("Contact form submission error:", error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau.";

      toast({
        title: "❌ Có lỗi xảy ra!",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Thêm function xử lý Google Maps
  const handleGoogleMapsClick = () => {
    // ✅ Coordinates cho Hà Tu, Hạ Long, Quảng Ninh
    const latitude = 20.9101; // Latitude của Hạ Long
    const longitude = 107.1839; // Longitude của Hạ Long
    const address = "Hà Tu, Hạ Long, Quảng Ninh, Vietnam";

    // ✅ Multiple options để mở Google Maps
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    const googleMapsCoords = `https://www.google.com/maps/@${latitude},${longitude},15z`;
    const googleMapsPlace = `https://maps.google.com/?q=${latitude},${longitude}`;

    // ✅ Detect device và mở appropriate app
    const isMobile =
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      );

    if (isMobile) {
      // ✅ Mobile: Mở Google Maps app nếu có, nếu không thì web
      const mobileUrl = `https://maps.google.com/?q=${latitude},${longitude}&ll=${latitude},${longitude}&z=15`;
      window.open(mobileUrl, "_blank");
    } else {
      // ✅ Desktop: Mở trong tab mới
      window.open(googleMapsUrl, "_blank");
    }
  };

  // ✅ Alternative: Mở với specific place search
  const handleGoogleMapsSearch = () => {
    const searchQuery = "Hà Tu, Hạ Long, Quảng Ninh";
    const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`;
    window.open(mapsUrl, "_blank");
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Địa chỉ văn phòng",
      content: "Hà Tuần, Hạ Long, Quảng Ninh",
      subContent: "Việt Nam 70000",
      color: "from-blue-500 to-cyan-500",
      action: "Xem bản đồ",
    },
    {
      icon: Phone,
      title: "Hotline hỗ trợ",
      content: "+84 971 386 588",
      subContent: "24/7 Support Available",
      color: "from-green-500 to-emerald-500",
      action: "Gọi ngay",
    },
    {
      icon: Mail,
      title: "Email liên hệ",
      content: "veutong961@gmail.com",
      subContent: "Response within 2 hours",
      color: "from-purple-500 to-pink-500",
      action: "Gửi email",
    },
    {
      icon: Clock,
      title: "Giờ làm việc",
      content: "Thứ 2 - Thứ 6: 8:00 - 18:00",
      subContent: "Thứ 7: 9:00 - 17:00",
      color: "from-orange-500 to-red-500",
      action: "Đặt lịch hẹn",
    },
  ];

  const categories = [
    { value: "support", label: "Hỗ trợ kỹ thuật", icon: Headphones },
    { value: "sales", label: "Tư vấn bán hàng", icon: Users },
    { value: "partnership", label: "Hợp tác kinh doanh", icon: Building },
    { value: "feedback", label: "Góp ý & Phản hồi", icon: MessageSquare },
    { value: "media", label: "Truyền thông", icon: Globe },
    { value: "other", label: "Khác", icon: MessageCircle },
  ];

  const stats = [
    { label: "Response Time", value: "< 2h", icon: Zap },
    { label: "Customer Satisfaction", value: "99.5%", icon: Heart },
    { label: "Support Languages", value: "5+", icon: Globe },
    { label: "Team Members", value: "50+", icon: Users },
  ];

  const faqs = [
    {
      question: "Làm thế nào để tải xuống sản phẩm sau khi mua?",
      answer:
        "Sau khi thanh toán thành công, bạn sẽ nhận được email chứa link tải xuống. Bạn cũng có thể truy cập vào tài khoản để tải lại bất cứ lúc nào.",
      category: "Tải xuống",
    },
    {
      question: "Tôi có thể sử dụng templates cho dự án thương mại không?",
      answer:
        "Có, tất cả templates đều đi kèm với giấy phép thương mại, cho phép bạn sử dụng cho các dự án thương mại không giới hạn.",
      category: "Giấy phép",
    },
    {
      question: "Có hỗ trợ kỹ thuật không?",
      answer:
        "Chúng tôi cung cấp hỗ trợ kỹ thuật 24/7 qua email, chat và phone. Đội ngũ chuyên gia sẽ giúp bạn giải quyết mọi vấn đề.",
      category: "Hỗ trợ",
    },
    {
      question: "Chính sách hoàn tiền như thế nào?",
      answer:
        "Chúng tôi có chính sách hoàn tiền 100% trong vòng 30 ngày nếu sản phẩm không đúng như mô tả hoặc không đáp ứng yêu cầu của bạn.",
      category: "Hoàn tiền",
    },
    {
      question: "Có thể tùy chỉnh templates theo yêu cầu không?",
      answer:
        "Có, chúng tôi cung cấp dịch vụ tùy chỉnh templates theo yêu cầu cụ thể của khách hàng với chi phí hợp lý.",
      category: "Tùy chỉnh",
    },
    {
      question: "Làm sao để trở thành đối tác bán hàng?",
      answer:
        "Bạn có thể đăng ký chương trình affiliate của chúng tôi để nhận hoa hồng lên đến 30% cho mỗi đơn hàng thành công.",
      category: "Đối tác",
    },
  ];

  const socialLinks = [
    {
      icon: Facebook,
      href: "#",
      label: "Facebook",
      color: "hover:text-blue-600",
    },
    { icon: Twitter, href: "#", label: "Twitter", color: "hover:text-sky-500" },
    {
      icon: Instagram,
      href: "#",
      label: "Instagram",
      color: "hover:text-pink-600",
    },
    {
      icon: Linkedin,
      href: "#",
      label: "LinkedIn",
      color: "hover:text-blue-700",
    },
    { icon: Youtube, href: "#", label: "YouTube", color: "hover:text-red-600" },
    { icon: Github, href: "#", label: "GitHub", color: "hover:text-gray-900" },
  ];

  const officeHours = [
    { day: "Thứ 2 - Thứ 6", hours: "8:00 AM - 6:00 PM", available: true },
    { day: "Thứ 7", hours: "9:00 AM - 5:00 PM", available: true },
    { day: "Chủ nhật", hours: "Nghỉ", available: false },
  ];

  return (
    <div className="min-h-screen overflow-hidden">
      {/* ✅ Enhanced Hero Section */}
      <section className="relative px-4 py-20 overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute bg-blue-300 rounded-full top-10 left-10 w-72 h-72 mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute bg-purple-300 rounded-full top-40 right-20 w-72 h-72 mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
          <div className="absolute bg-pink-300 rounded-full bottom-20 left-1/2 w-72 h-72 mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-4000"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 animate-float">
            <MessageCircle className="w-8 h-8 text-blue-500 opacity-60" />
          </div>
          <div className="absolute top-1/3 right-1/4 animate-float-delay-1">
            <Mail className="w-6 h-6 text-purple-500 opacity-60" />
          </div>
          <div className="absolute bottom-1/4 left-1/3 animate-float-delay-2">
            <Phone className="text-orange-500 w-7 h-7 opacity-60" />
          </div>
        </div>

        <div className="container relative z-10 mx-auto text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge
                variant="outline"
                className="mb-6 border-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur"
              >
                <MessageCircle className="w-3 h-3 mr-1" />
                Liên hệ với chúng tôi
                <Sparkles className="w-3 h-3 ml-1 animate-pulse" />
              </Badge>
            </motion.div>

            <motion.h1
              className="text-4xl font-bold leading-tight text-transparent md:text-6xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Chúng tôi luôn sẵn sàng
              <br />
              <span className="text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text">
                hỗ trợ bạn
              </span>
            </motion.h1>

            <motion.p
              className="max-w-3xl mx-auto text-xl md:text-2xl text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Có câu hỏi, cần hỗ trợ hoặc muốn hợp tác? Đội ngũ chuyên gia của
              chúng tôi
              <span className="font-semibold text-blue-600">
                {" "}
                sẵn sàng 24/7
              </span>{" "}
              để giúp bạn thành công.
            </motion.p>

            {/* Quick Stats */}
            <motion.div
              className="grid max-w-2xl grid-cols-2 gap-6 mx-auto md:grid-cols-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ✅ Enhanced Contact Info Cards */}
      <section
        className="px-4 py-16 bg-muted/50"
        id="contact-info"
        data-animate
      >
        <div className="container mx-auto">
          <div
            className={`text-center space-y-4 mb-12 transition-all duration-800 ${
              isVisible["contact-info"]
                ? "animate-in slide-in-from-bottom"
                : "opacity-0"
            }`}
          >
            <h2 className="text-3xl font-bold text-transparent md:text-4xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
              Thông tin liên hệ
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
              Nhiều cách để bạn có thể kết nối với chúng tôi
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                className={`transition-all duration-500 ${
                  isVisible["contact-info"]
                    ? "animate-in slide-in-from-bottom"
                    : "opacity-0"
                }`}
                style={{ animationDelay: `${index * 150}ms` }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <Card className="h-full p-6 text-center transition-all duration-300 border-0 shadow-lg group bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 hover:shadow-2xl">
                  <CardContent className="space-y-4">
                    <div
                      className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${info.color} flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110`}
                    >
                      <info.icon className="w-8 h-8 text-white group-hover:animate-pulse" />
                    </div>
                    <div>
                      <h3 className="mb-2 text-lg font-semibold transition-colors group-hover:text-primary">
                        {info.title}
                      </h3>
                      <p className="mb-1 font-medium text-muted-foreground">
                        {info.content}
                      </p>
                      <p className="mb-4 text-sm text-muted-foreground">
                        {info.subContent}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
                      >
                        {info.action}
                        <ExternalLink className="w-3 h-3 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ✅ Enhanced Contact Form */}
      <section className="px-4 py-16" id="contact-form" data-animate>
        <div className="container mx-auto">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Main Contact Form */}
            <div className="lg:col-span-2">
              <motion.div
                className={`transition-all duration-800 ${
                  isVisible["contact-form"]
                    ? "animate-in slide-in-from-left"
                    : "opacity-0"
                }`}
                whileHover={{ scale: 1.01 }}
              >
                <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-blue-900">
                  <CardHeader className="pb-8 text-center">
                    <CardTitle className="flex items-center justify-center space-x-3 text-2xl">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                        <MessageCircle className="w-5 h-5 text-white" />
                      </div>
                      <span>Gửi tin nhắn cho chúng tôi</span>
                    </CardTitle>
                    <p className="mt-2 text-muted-foreground">
                      Điền thông tin bên dưới và chúng tôi sẽ phản hồi trong
                      vòng 24 giờ
                    </p>
                  </CardHeader>
                  <CardContent>
                    <AnimatePresence mode="wait">
                      {isSubmitted ? (
                        <motion.div
                          key="success"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="py-12 text-center"
                        >
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              delay: 0.2,
                              type: "spring",
                              stiffness: 200,
                            }}
                          >
                            <CheckCircle className="w-20 h-20 mx-auto mb-6 text-green-500" />
                          </motion.div>
                          <h3 className="mb-4 text-2xl font-semibold">
                            Cảm ơn bạn!
                          </h3>
                          <p className="mb-6 text-muted-foreground">
                            Tin nhắn của bạn đã được gửi thành công. Chúng tôi
                            sẽ phản hồi trong vòng 24 giờ.
                          </p>
                          <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4" />
                              <span>Response time: 2 hours</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span>Priority support</span>
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.form
                          key="form"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          onSubmit={handleSubmit(onSubmit)}
                          className="space-y-6"
                        >
                          {/* Personal Information */}
                          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <motion.div
                              className="space-y-2"
                              whileFocus={{ scale: 1.02 }}
                            >
                              <Label
                                htmlFor="name"
                                className="flex items-center space-x-2"
                              >
                                <Users className="w-4 h-4" />
                                <span>Họ và tên *</span>
                              </Label>
                              <Input
                                id="name"
                                placeholder="Nguyễn Văn A"
                                {...register("name")}
                                className={`transition-all duration-300 ${errors.name ? "border-red-500 shake" : "focus:ring-2 focus:ring-primary/20"}`}
                              />
                              {errors.name && (
                                <motion.p
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="flex items-center space-x-1 text-sm text-red-500"
                                >
                                  <span>⚠️</span>
                                  <span>{errors.name.message}</span>
                                </motion.p>
                              )}
                            </motion.div>

                            <motion.div
                              className="space-y-2"
                              whileFocus={{ scale: 1.02 }}
                            >
                              <Label
                                htmlFor="email"
                                className="flex items-center space-x-2"
                              >
                                <Mail className="w-4 h-4" />
                                <span>Email *</span>
                              </Label>
                              <Input
                                id="email"
                                type="email"
                                placeholder="example@email.com"
                                {...register("email")}
                                className={`transition-all duration-300 ${errors.email ? "border-red-500 shake" : "focus:ring-2 focus:ring-primary/20"}`}
                              />
                              {errors.email && (
                                <motion.p
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="flex items-center space-x-1 text-sm text-red-500"
                                >
                                  <span>⚠️</span>
                                  <span>{errors.email.message}</span>
                                </motion.p>
                              )}
                            </motion.div>
                          </div>

                          {/* Additional Information */}
                          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label
                                htmlFor="phone"
                                className="flex items-center space-x-2"
                              >
                                <Phone className="w-4 h-4" />
                                <span>Số điện thoại</span>
                              </Label>
                              <Input
                                id="phone"
                                placeholder="+84 971 386 588"
                                {...register("phone")}
                                className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label
                                htmlFor="company"
                                className="flex items-center space-x-2"
                              >
                                <Building className="w-4 h-4" />
                                <span>Công ty</span>
                              </Label>
                              <Input
                                id="company"
                                placeholder="Tên công ty"
                                {...register("company")}
                                className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                              />
                            </div>
                          </div>

                          {/* Category Selection */}
                          <div className="space-y-2">
                            <Label
                              htmlFor="category"
                              className="flex items-center space-x-2"
                            >
                              <MessageSquare className="w-4 h-4" />
                              <span>Danh mục *</span>
                            </Label>
                            <select
                              id="category"
                              {...register("category")}
                              className={`w-full px-3 py-2 border rounded-md bg-background focus:ring-2 focus:ring-primary/20 transition-all duration-300 ${errors.category ? "border-red-500" : ""}`}
                            >
                              <option value="">Chọn danh mục...</option>
                              {categories.map((category) => (
                                <option
                                  key={category.value}
                                  value={category.value}
                                >
                                  {category.label}
                                </option>
                              ))}
                            </select>
                            {errors.category && (
                              <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center space-x-1 text-sm text-red-500"
                              >
                                <span>⚠️</span>
                                <span>{errors.category.message}</span>
                              </motion.p>
                            )}
                          </div>

                          {/* Subject */}
                          <div className="space-y-2">
                            <Label
                              htmlFor="subject"
                              className="flex items-center space-x-2"
                            >
                              <MessageCircle className="w-4 h-4" />
                              <span>Tiêu đề *</span>
                            </Label>
                            <Input
                              id="subject"
                              placeholder="Vấn đề cần hỗ trợ"
                              {...register("subject")}
                              className={`transition-all duration-300 ${errors.subject ? "border-red-500 shake" : "focus:ring-2 focus:ring-primary/20"}`}
                            />
                            {errors.subject && (
                              <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center space-x-1 text-sm text-red-500"
                              >
                                <span>⚠️</span>
                                <span>{errors.subject.message}</span>
                              </motion.p>
                            )}
                          </div>

                          {/* Message */}
                          <div className="space-y-2">
                            <Label
                              htmlFor="message"
                              className="flex items-center space-x-2"
                            >
                              <MessageSquare className="w-4 h-4" />
                              <span>Tin nhắn *</span>
                            </Label>
                            <Textarea
                              id="message"
                              placeholder="Mô tả chi tiết vấn đề của bạn..."
                              rows={6}
                              {...register("message")}
                              className={`transition-all duration-300 resize-none ${errors.message ? "border-red-500 shake" : "focus:ring-2 focus:ring-primary/20"}`}
                            />
                            {errors.message && (
                              <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center space-x-1 text-sm text-red-500"
                              >
                                <span>⚠️</span>
                                <span>{errors.message.message}</span>
                              </motion.p>
                            )}
                          </div>

                          {/* Submit Button */}
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button
                              type="submit"
                              className="w-full transition-all duration-300 shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl"
                              size="lg"
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? (
                                <>
                                  <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{
                                      duration: 1,
                                      repeat: Infinity,
                                      ease: "linear",
                                    }}
                                    className="w-5 h-5 mr-2 border-2 border-white rounded-full border-t-transparent"
                                  />
                                  Đang gửi...
                                </>
                              ) : (
                                <>
                                  <Send className="w-5 h-5 mr-2" />
                                  Gửi tin nhắn
                                  <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                                </>
                              )}
                            </Button>
                          </motion.div>

                          {/* Form Footer */}
                          <div className="text-sm text-center text-muted-foreground">
                            <p>
                              Bằng cách gửi form này, bạn đồng ý với
                              <a
                                href="/privacy"
                                className="ml-1 text-primary hover:underline"
                              >
                                chính sách bảo mật
                              </a>{" "}
                              của chúng tôi.
                            </p>
                          </div>
                        </motion.form>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Sidebar Information */}
            <div className="space-y-8">
              {/* Office Hours */}
              <motion.div
                className={`transition-all duration-800 ${
                  isVisible["contact-form"]
                    ? "animate-in slide-in-from-right"
                    : "opacity-0"
                }`}
                style={{ animationDelay: "200ms" }}
              >
                <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-green-50 dark:from-slate-800 dark:to-green-900/20">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-green-600" />
                      <span>Giờ làm việc</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {officeHours.map((schedule, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <span className="font-medium">{schedule.day}</span>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`text-sm ${schedule.available ? "text-muted-foreground" : "text-red-500"}`}
                          >
                            {schedule.hours}
                          </span>
                          <div
                            className={`w-2 h-2 rounded-full ${schedule.available ? "bg-green-500" : "bg-red-500"}`}
                          ></div>
                        </div>
                      </div>
                    ))}
                    <div className="pt-4 border-t">
                      <div className="flex items-center space-x-2 text-sm text-green-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="font-medium">
                          Hiện tại: Đang hoạt động
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Social Links */}
              <motion.div
                className={`transition-all duration-800 ${
                  isVisible["contact-form"]
                    ? "animate-in slide-in-from-right"
                    : "opacity-0"
                }`}
                style={{ animationDelay: "400ms" }}
              >
                <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50 dark:from-slate-800 dark:to-purple-900/20">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Globe className="w-5 h-5 text-purple-600" />
                      <span>Kết nối với chúng tôi</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-3">
                      {socialLinks.map((social, index) => (
                        <motion.a
                          key={index}
                          href={social.href}
                          className={`flex items-center justify-center w-12 h-12 rounded-lg bg-muted hover:bg-muted/80 transition-all duration-300 ${social.color}`}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <social.icon className="w-5 h-5" />
                        </motion.a>
                      ))}
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-sm text-muted-foreground">
                        Theo dõi chúng tôi để cập nhật tin tức mới nhất
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Support */}
              <motion.div
                className={`transition-all duration-800 ${
                  isVisible["contact-form"]
                    ? "animate-in slide-in-from-right"
                    : "opacity-0"
                }`}
                style={{ animationDelay: "600ms" }}
              >
                <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-orange-50 dark:from-slate-800 dark:to-orange-900/20">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Zap className="w-5 h-5 text-orange-600" />
                      <span>Hỗ trợ nhanh</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button
                      variant="outline"
                      className="justify-start w-full"
                      asChild
                    >
                      <a href="tel:+84123456789">
                        <Phone className="w-4 h-4 mr-2" />
                        Gọi ngay: +84 123 456 789
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      className="justify-start w-full"
                      asChild
                    >
                      <a href="mailto:veutong961@gmail.com">
                        <Mail className="w-4 h-4 mr-2" />
                        Email: veutong961@gmail.com
                      </a>
                    </Button>
                    <Button variant="outline" className="justify-start w-full">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Live Chat (24/7)
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ Enhanced FAQ Section */}
      <section className="px-4 py-16 bg-muted/50" id="faq" data-animate>
        <div className="container mx-auto">
          <div
            className={`text-center space-y-4 mb-12 transition-all duration-800 ${
              isVisible.faq ? "animate-in slide-in-from-bottom" : "opacity-0"
            }`}
          >
            <h2 className="text-3xl font-bold text-transparent md:text-4xl bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text">
              Câu hỏi thường gặp
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
              Tìm hiểu câu trả lời cho những câu hỏi phổ biến nhất
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className={`transition-all duration-500 ${
                  isVisible.faq
                    ? "animate-in slide-in-from-bottom"
                    : "opacity-0"
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Card className="transition-all duration-300 border-0 shadow-lg bg-white/50 dark:bg-slate-800/50 backdrop-blur hover:shadow-xl">
                  <CardContent className="p-0">
                    <button
                      onClick={() =>
                        setExpandedFaq(expandedFaq === index ? null : index)
                      }
                      className="w-full p-6 text-left transition-colors duration-300 hover:bg-muted/50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Badge variant="outline" className="text-xs">
                            {faq.category}
                          </Badge>
                          <h3 className="text-lg font-semibold">
                            {faq.question}
                          </h3>
                        </div>
                        <motion.div
                          animate={{ rotate: expandedFaq === index ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        </motion.div>
                      </div>
                    </button>
                    <AnimatePresence>
                      {expandedFaq === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6">
                            <p className="leading-relaxed text-muted-foreground">
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

      {/* ✅ Enhanced Map Section */}
      <section className="px-4 py-16" id="map" data-animate>
        <div className="container mx-auto">
          <div
            className={`text-center space-y-4 mb-12 transition-all duration-800 ${
              isVisible.map ? "animate-in slide-in-from-bottom" : "opacity-0"
            }`}
          >
            <h2 className="text-3xl font-bold text-transparent md:text-4xl bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text">
              Vị trí của chúng tôi
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
              Ghé thăm văn phòng của chúng tôi tại Hạ Long hoặc liên hệ qua các
              kênh trực tuyến
            </p>
          </div>

          <motion.div
            className={`transition-all duration-800 ${
              isVisible.map ? "animate-in slide-in-from-bottom" : "opacity-0"
            }`}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="overflow-hidden border-0 shadow-2xl">
              <div className="relative flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 h-80">
                {/* ✅ Enhanced Map Placeholder với Hạ Long theme */}
                <div className="space-y-4 text-center">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="relative"
                  >
                    <MapPin className="w-16 h-16 mx-auto text-primary" />
                    {/* ✅ Thêm indicator cho Hạ Long */}
                    <div className="absolute flex items-center justify-center w-6 h-6 rounded-full -top-2 -right-2 bg-gradient-to-r from-green-400 to-blue-500">
                      <span className="text-xs font-bold text-white">HL</span>
                    </div>
                  </motion.div>
                  <div>
                    <h3 className="mb-2 text-xl font-semibold">
                      Template Market - Hạ Long Office
                    </h3>
                    <p className="mb-2 text-muted-foreground">
                      📍 Hà Tu, Hạ Long, Quảng Ninh, Việt Nam
                    </p>
                    <p className="mb-4 text-sm text-muted-foreground">
                      🌊 Gần Vịnh Hạ Long - Di sản Thế giới UNESCO
                    </p>
                    <div className="flex items-center justify-center space-x-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleGoogleMapsClick}
                        className="transition-all duration-300 group hover:bg-blue-500 hover:text-white"
                      >
                        <MapPin className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                        Xem trên Google Maps
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const phone = "+84123456789";
                          window.open(`tel:${phone}`, "_self");
                        }}
                        className="transition-all duration-300 group hover:bg-green-500 hover:text-white"
                      >
                        <Phone className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                        Gọi chỉ đường
                      </Button>
                    </div>

                    {/* ✅ Thêm thông tin bổ sung về location */}
                    <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                      <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>2 giờ từ Hà Nội</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>5 phút đến Vịnh Hạ Long</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ✅ Enhanced Floating Elements với Hạ Long theme */}
                <div className="absolute top-4 left-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/20"
                    title="Gần biển Hạ Long"
                  >
                    <span className="text-blue-600">🌊</span>
                  </motion.div>
                </div>
                <div className="absolute top-4 right-4">
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{
                      duration: 25,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500/20"
                    title="Gần núi đá vôi"
                  >
                    <span className="text-green-600">⛰️</span>
                  </motion.div>
                </div>
                <div className="absolute bottom-4 left-4">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500/20"
                    title="Di sản UNESCO"
                  >
                    <span className="text-yellow-600">🏛️</span>
                  </motion.div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* ✅ Thêm thông tin chi tiết về location */}
          <div className="grid gap-6 mt-8 md:grid-cols-3">
            <Card className="p-4 border-0 bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-blue-900/20">
              <div className="space-y-2 text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-blue-500 rounded-full">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold">Địa chỉ chính xác</h3>
                <p className="text-sm text-muted-foreground">
                  Hà Tu, Thành phố Hạ Long, Tỉnh Quảng Ninh
                </p>
              </div>
            </Card>

            <Card className="p-4 border-0 bg-gradient-to-br from-white to-green-50 dark:from-slate-800 dark:to-green-900/20">
              <div className="space-y-2 text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-500 rounded-full">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold">Thời gian di chuyển</h3>
                <p className="text-sm text-muted-foreground">
                  2h từ Hà Nội • 4h từ TP.HCM
                </p>
              </div>
            </Card>

            <Card className="p-4 border-0 bg-gradient-to-br from-white to-purple-50 dark:from-slate-800 dark:to-purple-900/20">
              <div className="space-y-2 text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-purple-500 rounded-full">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold">Điểm đặc biệt</h3>
                <p className="text-sm text-muted-foreground">
                  Gần Vịnh Hạ Long - Di sản UNESCO
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ✅ CTA Section */}
      <section className="relative px-4 py-16 overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-black/10"></div>
          <div className="absolute w-32 h-32 rounded-full top-10 right-10 bg-white/10 animate-pulse"></div>
          <div className="absolute w-24 h-24 rounded-full bottom-10 left-10 bg-white/10 animate-pulse animation-delay-2000"></div>
        </div>

        <div className="container relative z-10 mx-auto text-center">
          <div className="max-w-3xl mx-auto space-y-6 text-white">
            <motion.h2
              className="text-3xl font-bold md:text-4xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Cần hỗ trợ ngay lập tức?
            </motion.h2>
            <motion.p
              className="text-lg opacity-90"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Đội ngũ chuyên gia của chúng tôi sẵn sàng hỗ trợ bạn 24/7. Liên hệ
              ngay để nhận được giải pháp tốt nhất.
            </motion.p>
            <motion.div
              className="flex flex-col items-center justify-center gap-4 sm:flex-row"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Button
                size="lg"
                variant="secondary"
                asChild
                className="transition-all duration-300 group hover:scale-105 hover:shadow-2xl"
              >
                <a href="tel:+84123456789">
                  <Phone className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                  Gọi ngay: +84 123 456 789
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-white transition-all duration-300 border-white hover:bg-white hover:text-purple-600 hover:scale-105"
                asChild
              >
                <a href="mailto:support@templatemarket.com">
                  <Mail className="w-5 h-5 mr-2" />
                  Email: support@templatemarket.com
                </a>
              </Button>
            </motion.div>
            <motion.div
              className="flex items-center justify-center mt-8 space-x-8 opacity-75"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.75 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm">24/7 Support</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5" />
                <span className="text-sm">99.5% Satisfaction</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span className="text-sm">Secure & Private</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
