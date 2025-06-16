import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import {
  Users,
  Award,
  Globe,
  Heart,
  Target,
  Eye,
  Zap,
  Shield,
  HeartHandshake,
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
  MapPin,
  Mail,
  Phone,
  Github,
  Linkedin,
  Twitter,
  CheckCircle,
  Clock,
  Trophy,
  Lightbulb,
  Crown,
  Building,
  GraduationCap,
  Briefcase,
} from "lucide-react";

const About: React.FC = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});

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

  const stats = [
    {
      label: "Templates",
      value: "1000+",
      icon: Package,
      color: "from-blue-500 to-cyan-500",
      description: "Premium quality templates",
    },
    {
      label: "E-books",
      value: "500+",
      icon: BookOpen,
      color: "from-green-500 to-emerald-500",
      description: "Expert-written guides",
    },
    {
      label: "Khách hàng hài lòng",
      value: "50K+",
      icon: Users,
      color: "from-purple-500 to-pink-500",
      description: "Trusted worldwide",
    },
    {
      label: "Năm kinh nghiệm",
      value: "5+",
      icon: Calendar,
      color: "from-orange-500 to-red-500",
      description: "Industry expertise",
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
      icon: HeartHandshake,
      title: "Hỗ trợ tận tình",
      description:
        "Đội ngũ hỗ trợ chuyên nghiệp sẵn sàng giúp đỡ bạn 24/7 qua nhiều kênh liên lạc.",
      color: "from-pink-400 to-red-500",
      stats: "< 2 hours response time",
    },
  ];

  const team = [
    {
      name: "Nguyễn Minh Tuấn",
      role: "CEO & Founder",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
      description:
        "10+ năm kinh nghiệm trong lĩnh vực công nghệ và thiết kế web. Tốt nghiệp Stanford University với bằng Computer Science.",
      expertise: [
        "Product Strategy",
        "Team Leadership",
        "Business Development",
      ],
      social: {
        linkedin: "#",
        twitter: "#",
        github: "#",
      },
      achievements: ["Forbes 30 Under 30", "Tech Innovation Award 2023"],
    },
    {
      name: "Sarah Chen",
      role: "CTO & Co-founder",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612f5e6?w=200&h=200&fit=crop&crop=face",
      description:
        "Chuyên gia về kiến trúc hệ thống và phát triển sản phẩm. Ex-Google Senior Engineer với 12 năm kinh nghiệm.",
      expertise: ["System Architecture", "Cloud Computing", "AI/ML"],
      social: {
        linkedin: "#",
        twitter: "#",
        github: "#",
      },
      achievements: ["Google Cloud Architect", "AWS Solutions Architect"],
    },
    {
      name: "David Kim",
      role: "Creative Director",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
      description:
        "Chuyên gia thiết kế UI/UX với hơn 8 năm kinh nghiệm. Từng làm việc tại Apple và Adobe.",
      expertise: ["UI/UX Design", "Design Systems", "Brand Identity"],
      social: {
        linkedin: "#",
        twitter: "#",
        github: "#",
      },
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
        "Template Market đã giúp team chúng tôi tiết kiệm 60% thời gian development. Chất lượng templates rất cao và support team cực kỳ responsive.",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      rating: 5,
      project: "E-commerce Platform Redesign",
    },
    {
      name: "Emma Thompson",
      role: "UI/UX Designer",
      company: "Shopify",
      content:
        "The design quality and documentation are outstanding. We've used multiple templates for client projects and they always exceed expectations.",
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
        "E-books của Template Market đã nâng cao kỹ năng coding của tôi đáng kể. Nội dung rất thực tế và dễ áp dụng vào dự án thực tế.",
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
            <Code className="w-8 h-8 text-blue-500 opacity-60" />
          </div>
          <div className="absolute top-1/3 right-1/4 animate-float-delay-1">
            <Palette className="w-6 h-6 text-purple-500 opacity-60" />
          </div>
          <div className="absolute bottom-1/4 left-1/3 animate-float-delay-2">
            <Coffee className="text-orange-500 w-7 h-7 opacity-60" />
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
                <Building className="w-3 h-3 mr-1" />
                Giới thiệu về chúng tôi
                <Sparkles className="w-3 h-3 ml-1 animate-pulse" />
              </Badge>
            </motion.div>

            <motion.h1
              className="text-4xl font-bold leading-tight text-transparent md:text-6xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text"
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
              className="max-w-3xl mx-auto text-xl md:text-2xl text-muted-foreground"
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
              className="flex flex-col items-center justify-center gap-4 mt-8 sm:flex-row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button
                size="lg"
                asChild
                className="transition-all duration-300 shadow-lg group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl"
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
                asChild
                className="transition-all duration-300 border-2 group backdrop-blur bg-white/20 dark:bg-slate-800/20 hover:scale-105"
              >
                <Link to="/contact">
                  <Mail className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                  Liên hệ với chúng tôi
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ✅ Enhanced Stats Section */}
      <section className="px-4 py-16 bg-muted/50" id="stats" data-animate>
        <div className="container mx-auto">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className={`group text-center transform transition-all duration-500 hover:scale-110 ${
                  isVisible.stats
                    ? "animate-in slide-in-from-bottom"
                    : "opacity-0"
                }`}
                style={{ animationDelay: `${index * 150}ms` }}
                whileHover={{ y: -10 }}
              >
                <Card className="p-6 transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 group-hover:shadow-2xl">
                  <CardContent className="space-y-4">
                    <div
                      className={`relative flex items-center justify-center w-16 h-16 mx-auto rounded-xl bg-gradient-to-r ${stat.color} shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110`}
                    >
                      <stat.icon className="w-8 h-8 text-white group-hover:animate-pulse" />
                      <div className="absolute inset-0 transition-opacity duration-300 opacity-0 rounded-xl bg-white/20 group-hover:opacity-100"></div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-transparent md:text-4xl bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text">
                        {stat.value}
                      </div>
                      <div className="mb-2 text-sm font-medium text-muted-foreground">
                        {stat.label}
                      </div>
                      <div className="text-xs text-muted-foreground">
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

      {/* ✅ Enhanced Mission, Vision, Values */}
      <section className="px-4 py-16" id="values" data-animate>
        <div className="container mx-auto">
          <div
            className={`text-center space-y-4 mb-12 transition-all duration-800 ${
              isVisible.values ? "animate-in slide-in-from-bottom" : "opacity-0"
            }`}
          >
            <h2 className="text-3xl font-bold text-transparent md:text-4xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
              Về chúng tôi
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
              Khám phá sứ mệnh, tầm nhìn và những giá trị cốt lõi định hình nên
              Template Market
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {values.map((value, index) => (
              <motion.div
                key={index}
                className={`transition-all duration-500 ${
                  isVisible.values
                    ? "animate-in slide-in-from-bottom"
                    : "opacity-0"
                }`}
                style={{ animationDelay: `${index * 200}ms` }}
                whileHover={{ y: -10 }}
              >
                <Card className="h-full p-6 text-center transition-all duration-300 border-0 shadow-lg group bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 hover:shadow-2xl">
                  <CardContent className="space-y-6">
                    <div
                      className={`mx-auto w-20 h-20 rounded-2xl bg-gradient-to-r ${value.color} flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110`}
                    >
                      <value.icon className="w-10 h-10 text-white group-hover:animate-pulse" />
                    </div>
                    <div>
                      <h3 className="mb-3 text-xl font-semibold transition-colors group-hover:text-primary">
                        {value.title}
                      </h3>
                      <p className="mb-4 leading-relaxed text-muted-foreground">
                        {value.description}
                      </p>
                      <div className="space-y-2">
                        {value.features.map((feature, featureIndex) => (
                          <div
                            key={featureIndex}
                            className="flex items-center justify-center space-x-2 text-sm"
                          >
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-muted-foreground">
                              {feature}
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
        </div>
      </section>

      {/* ✅ Enhanced Features */}
      <section className="px-4 py-16 bg-muted/50" id="features" data-animate>
        <div className="container mx-auto">
          <div
            className={`text-center space-y-4 mb-12 transition-all duration-800 ${
              isVisible.features
                ? "animate-in slide-in-from-bottom"
                : "opacity-0"
            }`}
          >
            <h2 className="text-3xl font-bold text-transparent md:text-4xl bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text">
              Tại sao chọn chúng tôi?
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
              Những tính năng và dịch vụ vượt trội mà chúng tôi mang lại cho
              khách hàng
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={`transition-all duration-500 ${
                  isVisible.features
                    ? "animate-in slide-in-from-bottom"
                    : "opacity-0"
                }`}
                style={{ animationDelay: `${index * 200}ms` }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <Card className="h-full p-6 text-center transition-all duration-300 border-0 shadow-lg group bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 hover:shadow-2xl">
                  <CardContent className="space-y-6">
                    <div
                      className={`mx-auto w-20 h-20 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110`}
                    >
                      <feature.icon className="w-10 h-10 text-white group-hover:animate-pulse" />
                    </div>
                    <div>
                      <h3 className="mb-3 text-xl font-semibold transition-colors group-hover:text-primary">
                        {feature.title}
                      </h3>
                      <p className="mb-4 leading-relaxed text-muted-foreground">
                        {feature.description}
                      </p>
                      <Badge
                        variant="secondary"
                        className="bg-primary/10 text-primary"
                      >
                        <Star className="w-3 h-3 mr-1" />
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

      {/* ✅ Enhanced Team Section */}
      <section className="px-4 py-16" id="team" data-animate>
        <div className="container mx-auto">
          <div
            className={`text-center space-y-4 mb-12 transition-all duration-800 ${
              isVisible.team ? "animate-in slide-in-from-bottom" : "opacity-0"
            }`}
          >
            <h2 className="text-3xl font-bold text-transparent md:text-4xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text">
              Đội ngũ của chúng tôi
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
              Gặp gỡ những con người tài năng đằng sau thành công của Template
              Market
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {team.map((member, index) => (
              <motion.div
                key={index}
                className={`transition-all duration-500 ${
                  isVisible.team
                    ? "animate-in slide-in-from-bottom"
                    : "opacity-0"
                }`}
                style={{ animationDelay: `${index * 200}ms` }}
                whileHover={{ y: -10 }}
              >
                <Card className="h-full p-6 text-center transition-all duration-300 border-0 shadow-lg group bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 hover:shadow-2xl">
                  <CardContent className="space-y-6">
                    <div className="relative">
                      <motion.img
                        src={member.avatar}
                        alt={member.name}
                        className="object-cover w-24 h-24 mx-auto transition-all duration-300 border-4 border-white rounded-full shadow-lg group-hover:shadow-xl"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      />
                      <div className="absolute flex items-center justify-center w-8 h-8 rounded-full -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500">
                        <Crown className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-1 text-xl font-semibold">
                        {member.name}
                      </h3>
                      <p className="mb-3 font-medium text-primary">
                        {member.role}
                      </p>
                      <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                        {member.description}
                      </p>

                      {/* Expertise Tags */}
                      <div className="flex flex-wrap justify-center gap-2 mb-4">
                        {member.expertise.map((skill, skillIndex) => (
                          <Badge
                            key={skillIndex}
                            variant="outline"
                            className="text-xs"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>

                      {/* Achievements */}
                      <div className="mb-4 space-y-2">
                        {member.achievements.map((achievement, achIndex) => (
                          <div
                            key={achIndex}
                            className="flex items-center justify-center space-x-2 text-xs text-muted-foreground"
                          >
                            <Award className="w-3 h-3 text-yellow-500" />
                            <span>{achievement}</span>
                          </div>
                        ))}
                      </div>

                      {/* Social Links */}
                      <div className="flex justify-center space-x-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-8 h-8 p-0 hover:text-blue-600"
                        >
                          <Linkedin className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-8 h-8 p-0 hover:text-sky-500"
                        >
                          <Twitter className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-8 h-8 p-0 hover:text-gray-900"
                        >
                          <Github className="w-4 h-4" />
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

      {/* ✅ Enhanced Timeline */}
      <section className="px-4 py-16 bg-muted/50" id="timeline" data-animate>
        <div className="container mx-auto">
          <div
            className={`text-center space-y-4 mb-12 transition-all duration-800 ${
              isVisible.timeline
                ? "animate-in slide-in-from-bottom"
                : "opacity-0"
            }`}
          >
            <h2 className="text-3xl font-bold text-transparent md:text-4xl bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text">
              Hành trình phát triển
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
              Những cột mốc quan trọng trong quá trình phát triển của chúng tôi
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  className={`flex items-start space-x-6 transition-all duration-500 ${
                    isVisible.timeline
                      ? "animate-in slide-in-from-left"
                      : "opacity-0"
                  }`}
                  style={{ animationDelay: `${index * 200}ms` }}
                  whileHover={{ x: 10 }}
                >
                  <div
                    className={`flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-r ${milestone.color} flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110`}
                  >
                    <div className="text-center">
                      <milestone.icon className="w-6 h-6 mx-auto mb-1 text-white" />
                      <div className="text-xs font-bold text-white">
                        {milestone.year}
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 pb-8">
                    <Card className="p-6 transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 hover:shadow-xl">
                      <CardContent className="space-y-3">
                        <h3 className="text-lg font-semibold text-primary">
                          {milestone.event}
                        </h3>
                        <p className="leading-relaxed text-muted-foreground">
                          {milestone.description}
                        </p>
                        <Badge
                          variant="outline"
                          className="bg-primary/10 text-primary"
                        >
                          <Clock className="w-3 h-3 mr-1" />
                          {milestone.year}
                        </Badge>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ✅ Customer Stories Section */}
      <section className="px-4 py-16" id="testimonials" data-animate>
        <div className="container mx-auto">
          <div
            className={`text-center space-y-4 mb-12 transition-all duration-800 ${
              isVisible.testimonials
                ? "animate-in slide-in-from-bottom"
                : "opacity-0"
            }`}
          >
            <h2 className="text-3xl font-bold text-transparent md:text-4xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
              Câu chuyện khách hàng
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
              Những trải nghiệm thực tế từ khách hàng đã sử dụng sản phẩm của
              chúng tôi
            </p>
          </div>

          {/* Featured Testimonial */}
          <div
            className={`mb-12 transition-all duration-800 ${
              isVisible.testimonials
                ? "animate-in slide-in-from-bottom"
                : "opacity-0"
            }`}
          >
            <Card className="max-w-4xl p-8 mx-auto border-0 shadow-2xl bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-blue-900">
              <CardContent className="space-y-6">
                <div className="flex items-center justify-center">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                </div>

                <blockquote className="text-xl font-medium leading-relaxed text-center text-gray-700 md:text-2xl dark:text-gray-300">
                  "{customerStories[currentTestimonial].content}"
                </blockquote>

                <div className="flex items-center justify-center mb-4 space-x-1">
                  {[...Array(customerStories[currentTestimonial].rating)].map(
                    (_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-yellow-400"
                      />
                    ),
                  )}
                </div>

                <div className="flex items-center justify-center space-x-4">
                  <img
                    src={customerStories[currentTestimonial].avatar}
                    alt={customerStories[currentTestimonial].name}
                    className="object-cover w-16 h-16 border-4 border-white rounded-full shadow-lg"
                  />
                  <div className="text-center">
                    <div className="text-lg font-semibold">
                      {customerStories[currentTestimonial].name}
                    </div>
                    <div className="font-medium text-primary">
                      {customerStories[currentTestimonial].role}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {customerStories[currentTestimonial].company}
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <Badge
                    variant="outline"
                    className="text-blue-800 bg-blue-100"
                  >
                    <Briefcase className="w-3 h-3 mr-1" />
                    {customerStories[currentTestimonial].project}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Testimonial Navigation */}
          <div className="flex justify-center space-x-2">
            {customerStories.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentTestimonial
                    ? "bg-blue-500 scale-125"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ✅ Achievements Section */}
      <section
        className="px-4 py-16 bg-muted/50"
        id="achievements"
        data-animate
      >
        <div className="container mx-auto">
          <div
            className={`text-center space-y-4 mb-12 transition-all duration-800 ${
              isVisible.achievements
                ? "animate-in slide-in-from-bottom"
                : "opacity-0"
            }`}
          >
            <h2 className="text-3xl font-bold text-transparent md:text-4xl bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text">
              Thành tựu & Giải thưởng
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
              Những ghi nhận và giải thưởng mà chúng tôi đã đạt được
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                className={`transition-all duration-500 ${
                  isVisible.achievements
                    ? "animate-in slide-in-from-bottom"
                    : "opacity-0"
                }`}
                style={{ animationDelay: `${index * 150}ms` }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <Card className="h-full p-6 text-center transition-all duration-300 border-0 shadow-lg group bg-gradient-to-br from-white to-yellow-50 dark:from-slate-800 dark:to-yellow-900/20 hover:shadow-xl">
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-center w-16 h-16 mx-auto transition-all duration-300 rounded-full shadow-lg bg-gradient-to-r from-yellow-400 to-orange-500 group-hover:shadow-xl group-hover:scale-110">
                      <Trophy className="w-8 h-8 text-white group-hover:animate-pulse" />
                    </div>
                    <div>
                      <h3 className="mb-2 text-sm font-semibold transition-colors group-hover:text-primary">
                        {achievement.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">
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

      {/* ✅ Contact CTA Section */}
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
              Sẵn sàng bắt đầu hành trình cùng chúng tôi?
            </motion.h2>
            <motion.p
              className="text-lg opacity-90"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Khám phá hàng nghìn templates chuyên nghiệp và e-books chất lượng
              cao. Tham gia cộng đồng 50,000+ developers và designers trên toàn
              thế giới.
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
                <Link to="/templates">
                  <Package className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                  Khám phá Templates
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-white transition-all duration-300 border-white hover:bg-white hover:text-purple-600 hover:scale-105"
                asChild
              >
                <Link to="/contact">
                  <Mail className="w-5 h-5 mr-2" />
                  Liên hệ với chúng tôi
                </Link>
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
                <span className="text-sm">50K+ Khách hàng</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5" />
                <span className="text-sm">4.9/5 Rating</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span className="text-sm">100% Secure</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
