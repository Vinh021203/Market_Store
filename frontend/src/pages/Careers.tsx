import React, { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase, // Icon chính cho Careers
  Users,
  Award,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Building,
  Lightbulb, // Ý tưởng, sáng tạo
  Laptop, // Phát triển
  Handshake, // Hợp tác, văn hóa
  Code, // Kỹ thuật
  Palette, // Thiết kế
  Megaphone, // Marketing
  GraduationCap, // Phát triển bản thân
  Hourglass, // Thời gian linh hoạt
  Smile, // Môi trường thân thiện
  BarChart, // Phát triển sự nghiệp
  Gift, // Lợi ích
  Send,
  MapPin,
  Mail,
  Phone,
  MessageSquare,
  Clock,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Schema cho form ứng tuyển (nếu có form apply trực tiếp)
const applicationSchema = z.object({
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().optional(),
  position: z.string().min(1, "Vui lòng chọn vị trí ứng tuyển"),
  resume: z.string().optional(), // Hoặc z.instanceof(File).optional() nếu dùng input file
  coverLetter: z.string().optional(),
});

type ApplicationData = z.infer<typeof applicationSchema>;

const Careers: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [expandedJob, setExpandedJob] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ApplicationData>({
    resolver: zodResolver(applicationSchema),
  });

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
      { threshold: 0.1 },
    );

    const sections = document.querySelectorAll("[data-animate]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const onSubmit = async (data: ApplicationData) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call

    setIsSubmitting(false);
    setIsSubmitted(true);
    reset();

    toast({
      title: "Ứng tuyển thành công!",
      description: "Hồ sơ của bạn đã được gửi. Chúng tôi sẽ liên hệ sớm.",
    });

    setTimeout(() => setIsSubmitted(false), 5000);
  };

  const jobOpenings = [
    {
      id: 1,
      title: "Senior Frontend Developer (React/Next.js)",
      location: "Remote / Hạ Long",
      type: "Full-time",
      experience: "5+ years",
      description:
        "Chúng tôi đang tìm kiếm một Senior Frontend Developer tài năng để dẫn dắt việc phát triển các giao diện người dùng phức tạp và hiệu suất cao. Yêu cầu kinh nghiệm sâu với React, Next.js, TypeScript và TailwindCSS.",
      responsibilities: [
        "Phát triển và duy trì các tính năng frontend mới.",
        "Tối ưu hóa hiệu suất và trải nghiệm người dùng.",
        "Viết code sạch, dễ bảo trì và test được.",
        "Làm việc với đội ngũ backend và designer.",
      ],
      requirements: [
        "Kinh nghiệm 5+ năm với React/Next.js.",
        "Thành thạo TypeScript và TailwindCSS.",
        "Hiểu biết về Web Performance và SEO.",
        "Kỹ năng giải quyết vấn đề tốt.",
      ],
      benefits: ["Lương cạnh tranh", "Làm việc linh hoạt", "Bảo hiểm đầy đủ"],
    },
    {
      id: 2,
      title: "Backend Developer (Node.js/Supabase)",
      location: "Hạ Long / Remote",
      type: "Full-time",
      experience: "3+ years",
      description:
        "Gia nhập đội ngũ backend để xây dựng và duy trì các API mạnh mẽ, có khả năng mở rộng. Bạn sẽ làm việc với Node.js, Express, và Supabase (PostgreSQL).",
      responsibilities: [
        "Thiết kế và triển khai RESTful APIs.",
        "Quản lý database (Supabase, PostgreSQL).",
        "Xây dựng các Edge Functions và xử lý webhook.",
        "Đảm bảo an toàn và hiệu suất hệ thống.",
      ],
      requirements: [
        "Kinh nghiệm 3+ năm với Node.js/Express.",
        "Hiểu biết về Supabase hoặc PostgreSQL.",
        "Kỹ năng về bảo mật API và tối ưu hóa query.",
        "Có kinh nghiệm làm việc với webhook là một lợi thế.",
      ],
      benefits: [
        "Cơ hội phát triển sự nghiệp",
        "Môi trường năng động",
        "Thưởng hiệu suất",
      ],
    },
    {
      id: 3,
      title: "UI/UX Designer",
      location: "Hạ Long",
      type: "Full-time",
      experience: "2+ years",
      description:
        "Chúng tôi tìm kiếm một UI/UX Designer sáng tạo để thiết kế giao diện người dùng trực quan và hấp dẫn. Bạn sẽ chịu trách nhiệm từ wireframe đến prototype cuối cùng.",
      responsibilities: [
        "Nghiên cứu người dùng và tạo personas.",
        "Thiết kế wireframes, mockups và prototypes.",
        "Đảm bảo tính nhất quán của thiết kế trên các nền tảng.",
        "Làm việc chặt chẽ với đội ngũ phát triển.",
      ],
      requirements: [
        "Kinh nghiệm 2+ năm trong thiết kế UI/UX.",
        "Thành thạo Figma, Adobe XD hoặc Sketch.",
        "Có portfolio ấn tượng.",
        "Hiểu biết về các nguyên tắc thiết kế responsive.",
      ],
      benefits: ["Nâng cao kỹ năng", "Tham gia dự án lớn", "Văn hóa mở"],
    },
  ];

  const coreValues = [
    {
      icon: Lightbulb,
      title: "Sáng tạo & Đổi mới",
      description:
        "Chúng tôi khuyến khích tư duy đột phá và liên tục tìm kiếm các giải pháp mới để vượt qua giới hạn.",
    },
    {
      icon: Handshake,
      title: "Hợp tác & Tôn trọng",
      description:
        "Làm việc nhóm là chìa khóa. Chúng tôi tin vào sự hợp tác và tôn trọng lẫn nhau trong mọi tương tác.",
    },
    {
      icon: GraduationCap,
      title: "Phát triển không ngừng",
      description:
        "Chúng tôi đầu tư vào sự phát triển cá nhân và chuyên môn của mỗi thành viên thông qua học hỏi liên tục.",
    },
    {
      icon: Smile,
      title: "Môi trường làm việc tích cực",
      description:
        "Tạo ra một không gian làm việc vui vẻ, hỗ trợ, nơi mọi người cảm thấy được truyền cảm hứng.",
    },
  ];

  const whyJoinUs = [
    {
      icon: Briefcase,
      title: "Cơ hội phát triển sự nghiệp",
      description:
        "Lộ trình phát triển rõ ràng, cơ hội thăng tiến nhanh chóng và các dự án thử thách.",
    },
    {
      icon: Gift,
      title: "Chính sách phúc lợi cạnh tranh",
      description:
        "Lương thưởng hấp dẫn, bảo hiểm toàn diện, và các khoản thưởng đặc biệt theo hiệu suất.",
    },
    {
      icon: Hourglass,
      title: "Thời gian làm việc linh hoạt",
      description:
        "Chúng tôi tin vào hiệu quả công việc, không phải số giờ làm việc cố định. Hỗ trợ làm việc từ xa.",
    },
    {
      icon: BarChart,
      title: "Tác động thực tế",
      description:
        "Công việc của bạn sẽ tạo ra ảnh hưởng lớn đến hàng ngàn người dùng và cộng đồng phát triển.",
    },
  ];

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
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
            <Briefcase className="w-8 h-8 text-blue-500 opacity-60" />
          </div>
          <div className="absolute top-1/3 right-1/4 animate-float-delay-1">
            <Users className="w-6 h-6 text-purple-500 opacity-60" />
          </div>
          <div className="absolute bottom-1/4 left-1/3 animate-float-delay-2">
            <Award className="text-orange-500 w-7 h-7 opacity-60" />
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
                <Briefcase className="w-3 h-3 mr-1" />
                Tham gia đội ngũ của chúng tôi
                <Sparkles className="w-3 h-3 ml-1 animate-pulse" />
              </Badge>
            </motion.div>

            <motion.h1
              className="text-4xl font-bold leading-tight text-transparent md:text-6xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Xây dựng tương lai cùng
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
              Chúng tôi đang tìm kiếm những tài năng đam mê để cùng phát triển
              các sản phẩm công nghệ đột phá.
              <span className="font-semibold text-blue-600">
                {" "}
                Hãy gửi hồ sơ của bạn ngay hôm nay!
              </span>{" "}
            </motion.p>

            <motion.div
              className="flex items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button
                size="lg"
                className="transition-all shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl"
              >
                <Laptop className="w-4 h-4 mr-2" /> Xem vị trí tuyển dụng
              </Button>
              <Button size="lg" variant="outline">
                <Users className="w-4 h-4 mr-2" /> Về đội ngũ của chúng tôi
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Join Us Section */}
      <section className="px-4 py-16 bg-muted/50" id="why-join-us" data-animate>
        <div className="container mx-auto">
          <div
            className={`text-center space-y-4 mb-12 transition-all duration-800 ${
              isVisible["why-join-us"]
                ? "animate-in slide-in-from-bottom"
                : "opacity-0"
            }`}
          >
            <h2 className="text-3xl font-bold text-transparent md:text-4xl bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text">
              Tại sao nên tham gia cùng chúng tôi?
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
              Chúng tôi không chỉ cung cấp một công việc, mà là một hành trình
              phát triển sự nghiệp.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {whyJoinUs.map((item, index) => (
              <motion.div
                key={index}
                className={`transition-all duration-500 ${
                  isVisible["why-join-us"]
                    ? "animate-in slide-in-from-bottom"
                    : "opacity-0"
                }`}
                style={{ animationDelay: `${index * 150}ms` }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <Card className="h-full p-6 text-center transition-all duration-300 border-0 shadow-lg group bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 hover:shadow-2xl">
                  <CardContent className="space-y-4">
                    <div
                      className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110`}
                    >
                      <item.icon className="w-8 h-8 text-white group-hover:animate-pulse" />
                    </div>
                    <div>
                      <h3 className="mb-2 text-lg font-semibold transition-colors group-hover:text-primary">
                        {item.title}
                      </h3>
                      <p className="mb-1 text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions Section */}
      <section className="px-4 py-16" id="open-positions" data-animate>
        <div className="container mx-auto">
          <div
            className={`text-center space-y-4 mb-12 transition-all duration-800 ${
              isVisible["open-positions"]
                ? "animate-in slide-in-from-bottom"
                : "opacity-0"
            }`}
          >
            <h2 className="text-3xl font-bold text-transparent md:text-4xl bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text">
              Các vị trí đang tuyển dụng
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
              Tìm kiếm vị trí phù hợp với kỹ năng và đam mê của bạn.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {jobOpenings.map((job, index) => (
              <motion.div
                key={job.id}
                className={`transition-all duration-500 ${
                  isVisible["open-positions"]
                    ? "animate-in slide-in-from-bottom"
                    : "opacity-0"
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
                whileHover={{ y: -5 }}
              >
                <Card className="transition-all border-0 shadow-lg bg-white/50 dark:bg-slate-800/50 backdrop-blur hover:shadow-xl">
                  <CardContent className="p-0">
                    <button
                      onClick={() =>
                        setExpandedJob(expandedJob === job.id ? null : job.id)
                      }
                      className="flex items-center justify-between w-full p-6 text-left transition-colors duration-300 hover:bg-muted/50"
                    >
                      <div className="flex-1 space-y-1">
                        <Badge
                          variant="outline"
                          className="px-3 py-1 text-sm text-blue-700 bg-blue-100"
                        >
                          {job.type}
                        </Badge>
                        <h3 className="text-xl font-semibold">{job.title}</h3>
                        <p className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />{" "}
                          <span>{job.location}</span>
                          <Clock className="w-4 h-4 ml-3" />{" "}
                          <span>{job.experience}</span>
                        </p>
                      </div>
                      <motion.div
                        animate={{ rotate: expandedJob === job.id ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ArrowRight className="w-5 h-5 text-muted-foreground" />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {expandedJob === job.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden border-t border-gray-200 dark:border-gray-700"
                        >
                          <div className="px-6 py-4 space-y-4">
                            <p className="leading-relaxed text-muted-foreground">
                              {job.description}
                            </p>
                            <div>
                              <h4 className="mb-2 font-semibold">
                                Trách nhiệm:
                              </h4>
                              <ul className="space-y-1 list-disc list-inside text-muted-foreground">
                                {job.responsibilities.map((res, i) => (
                                  <li key={i}>{res}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="mb-2 font-semibold">Yêu cầu:</h4>
                              <ul className="space-y-1 list-disc list-inside text-muted-foreground">
                                {job.requirements.map((req, i) => (
                                  <li key={i}>{req}</li>
                                ))}
                              </ul>
                            </div>
                            <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700">
                              <Send className="w-4 h-4 mr-2" /> Ứng tuyển ngay
                            </Button>
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

      {/* Application Form Section (Optional, if you want direct apply) */}
      <section
        className="px-4 py-16 bg-muted/50"
        id="application-form"
        data-animate
      >
        <div className="container mx-auto">
          <div
            className={`text-center space-y-4 mb-12 transition-all duration-800 ${
              isVisible["application-form"]
                ? "animate-in slide-in-from-bottom"
                : "opacity-0"
            }`}
          >
            <h2 className="text-3xl font-bold text-transparent md:text-4xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text">
              Không tìm thấy vị trí phù hợp?
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
              Hãy gửi CV của bạn và chúng tôi sẽ liên hệ khi có vị trí phù hợp.
            </p>
          </div>

          <motion.div
            className={`max-w-3xl mx-auto transition-all duration-800 ${
              isVisible["application-form"]
                ? "animate-in slide-in-from-bottom"
                : "opacity-0"
            }`}
            whileHover={{ scale: 1.01 }}
          >
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-blue-900">
              <CardHeader className="pb-8 text-center">
                <CardTitle className="flex items-center justify-center space-x-3 text-2xl">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                    <Send className="w-5 h-5 text-white" />
                  </div>
                  <span>Gửi hồ sơ của bạn</span>
                </CardTitle>
                <p className="mt-2 text-muted-foreground">
                  Chúng tôi luôn tìm kiếm những tài năng mới để phát triển cùng.
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
                        Cảm ơn bạn đã ứng tuyển!
                      </h3>
                      <p className="mb-6 text-muted-foreground">
                        Hồ sơ của bạn đã được gửi thành công. Chúng tôi sẽ liên
                        hệ khi có vị trí phù hợp.
                      </p>
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
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <motion.div
                          className="space-y-2"
                          whileFocus={{ scale: 1.02 }}
                        >
                          <Label
                            htmlFor="appName"
                            className="flex items-center space-x-2"
                          >
                            <Users className="w-4 h-4" />
                            <span>Họ và tên *</span>
                          </Label>
                          <Input
                            id="appName"
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
                            htmlFor="appEmail"
                            className="flex items-center space-x-2"
                          >
                            <Mail className="w-4 h-4" />
                            <span>Email *</span>
                          </Label>
                          <Input
                            id="appEmail"
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

                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label
                            htmlFor="appPhone"
                            className="flex items-center space-x-2"
                          >
                            <Phone className="w-4 h-4" />
                            <span>Số điện thoại</span>
                          </Label>
                          <Input
                            id="appPhone"
                            placeholder="+84 123 456 789"
                            {...register("phone")}
                            className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="appPosition"
                            className="flex items-center space-x-2"
                          >
                            <Briefcase className="w-4 h-4" />
                            <span>Vị trí ứng tuyển *</span>
                          </Label>
                          <select
                            id="appPosition"
                            {...register("position")}
                            className={`w-full px-3 py-2 border rounded-md bg-background focus:ring-2 focus:ring-primary/20 transition-all duration-300 ${errors.position ? "border-red-500" : ""}`}
                          >
                            <option value="">Chọn vị trí...</option>
                            {jobOpenings.map((job) => (
                              <option key={job.id} value={job.title}>
                                {job.title}
                              </option>
                            ))}
                            <option value="other">
                              Vị trí khác / Hồ sơ chung
                            </option>
                          </select>
                          {errors.position && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-center space-x-1 text-sm text-red-500"
                            >
                              <span>⚠️</span>
                              <span>{errors.position.message}</span>
                            </motion.p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="appCoverLetter"
                          className="flex items-center space-x-2"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>Thư xin việc (Cover Letter)</span>
                        </Label>
                        <Textarea
                          id="appCoverLetter"
                          placeholder="Mô tả kỹ năng, kinh nghiệm của bạn và lý do bạn muốn gia nhập đội ngũ của chúng tôi..."
                          rows={5}
                          {...register("coverLetter")}
                          className="transition-all duration-300 resize-none focus:ring-2 focus:ring-primary/20"
                        />
                      </div>

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
                              Đang gửi hồ sơ...
                            </>
                          ) : (
                            <>
                              <Send className="w-5 h-5 mr-2" />
                              Gửi hồ sơ ứng tuyển
                              <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                            </>
                          )}
                        </Button>
                      </motion.div>

                      <div className="text-sm text-center text-muted-foreground">
                        <p>
                          Bằng cách gửi form này, bạn đồng ý với{" "}
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
      </section>

      {/* ✅ CTA Section - Giữ nguyên như Contact để khuyến khích liên hệ */}
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
              Bạn đã sẵn sàng để phát triển?
            </motion.h2>
            <motion.p
              className="text-lg opacity-90"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Chúng tôi luôn tìm kiếm những tài năng xuất sắc để cùng xây dựng
              các dự án đột phá.
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
                <a href="/contact">
                  <MessageSquare className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                  Liên hệ tuyển dụng
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-white transition-all duration-300 border-white hover:bg-white hover:text-purple-600 hover:scale-105"
                asChild
              >
                <a href="mailto:careers@templatemarket.com">
                  <Mail className="w-5 h-5 mr-2" />
                  Gửi email cho chúng tôi
                </a>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Careers;
