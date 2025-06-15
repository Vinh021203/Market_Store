import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Check,
  X,
  Star,
  Crown,
  Zap,
  Shield,
  Users,
  Download,
  Code,
  Palette,
  Smartphone,
  Globe,
  Heart,
  Award,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Clock,
  Headphones,
  FileText,
  Database,
  Lock,
  Rocket,
  Target,
  Gift,
  MessageCircle,
  CheckCircle2,
  Infinity,
} from "lucide-react";

const Pricing: React.FC = () => {
  const [isYearly, setIsYearly] = useState(false);
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

  const plans = [
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
      features: [
        { name: "5 template downloads/tháng", included: true },
        { name: "Source code đầy đủ", included: true },
        { name: "Documentation chi tiết", included: true },
        { name: "6 tháng support", included: true },
        { name: "Free updates", included: true },
        { name: "Commercial license", included: false },
        { name: "Premium templates", included: false },
        { name: "Custom modifications", included: false },
        { name: "Priority support", included: false },
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
      features: [
        { name: "Unlimited template downloads", included: true },
        { name: "Premium template collection", included: true },
        { name: "Source code + PSD/Figma files", included: true },
        { name: "Priority support 24/7", included: true },
        { name: "Commercial license", included: true },
        { name: "Custom modifications", included: true },
        { name: "Advanced components", included: true },
        { name: "White-label license", included: false },
        { name: "Custom development", included: false },
        { name: "API access", included: false },
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
      features: [
        { name: "Tất cả templates + future releases", included: true },
        { name: "White-label license", included: true },
        { name: "Custom development service", included: true },
        { name: "Dedicated support manager", included: true },
        { name: "Training sessions", included: true },
        { name: "API access", included: true },
        { name: "Team collaboration tools", included: true },
        { name: "Advanced analytics", included: true },
        { name: "Custom integrations", included: true },
        { name: "SLA guarantee", included: true },
      ],
      cta: "Liên hệ Sales",
      highlight: "Tiết kiệm 33%",
    },
  ];

  const addOns = [
    {
      name: "Premium Support",
      description: "24/7 priority support với dedicated manager",
      price: 499000,
      icon: Headphones,
      color: "from-green-500 to-emerald-500",
    },
    {
      name: "Custom Development",
      description: "Tùy chỉnh template theo yêu cầu riêng",
      price: 2999000,
      icon: Code,
      color: "from-blue-500 to-purple-500",
    },
    {
      name: "Design Consultation",
      description: "1-on-1 consultation với UI/UX experts",
      price: 1499000,
      icon: Palette,
      color: "from-pink-500 to-rose-500",
    },
    {
      name: "Team Training",
      description: "Workshop và training cho team development",
      price: 4999000,
      icon: Users,
      color: "from-orange-500 to-yellow-500",
    },
  ];

  const testimonials = [
    {
      name: "Nguyễn Minh Tuấn",
      role: "Senior Developer",
      company: "FPT Software",
      content:
        "Professional plan đã giúp team tôi tiết kiệm 70% thời gian development. ROI rất cao!",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      rating: 5,
    },
    {
      name: "Sarah Chen",
      role: "UI/UX Designer",
      company: "Google Singapore",
      content:
        "Template quality tuyệt vời, documentation chi tiết. Đáng đồng tiền bát gạo!",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612f5e6?w=100&h=100&fit=crop&crop=face",
      rating: 5,
    },
  ];

  const faqs = [
    {
      question: "Tôi có thể thay đổi plan bất cứ lúc nào không?",
      answer:
        "Có, bạn có thể upgrade hoặc downgrade plan bất cứ lúc nào. Chúng tôi sẽ tính toán pro-rated cho phần chênh lệch.",
    },
    {
      question: "Có chính sách hoàn tiền không?",
      answer:
        "Có, chúng tôi có chính sách hoàn tiền 30 ngày không điều kiện nếu bạn không hài lòng.",
    },
    {
      question: "Commercial license bao gồm những gì?",
      answer:
        "Commercial license cho phép bạn sử dụng templates cho dự án client, bán lại sản phẩm và sử dụng cho mục đích thương mại.",
    },
    {
      question: "Tôi có được support khi gặp vấn đề không?",
      answer:
        "Tất cả plans đều có support. Professional và Enterprise có priority support với response time nhanh hơn.",
    },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900">
      {/* Hero Section */}
      <section className="relative px-4 py-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute bg-blue-300 rounded-full top-20 left-20 w-72 h-72 mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute bg-purple-300 rounded-full top-40 right-20 w-72 h-72 mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
          <div className="absolute bg-pink-300 rounded-full bottom-20 left-1/2 w-72 h-72 mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-4000"></div>
        </div>

        <div className="container relative z-10 mx-auto text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <Badge
              variant="outline"
              className="mb-6 border-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur"
            >
              <Sparkles className="w-3 h-3 mr-1 animate-pulse" />
              Pricing Plans
              <TrendingUp className="w-3 h-3 ml-1" />
            </Badge>

            <h1 className="text-4xl font-bold leading-tight text-transparent md:text-6xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text">
              Chọn plan phù hợp
              <br />
              <span className="text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text">
                cho dự án của bạn
              </span>
            </h1>

            <p className="max-w-2xl mx-auto text-xl text-muted-foreground">
              Từ dự án cá nhân đến enterprise, chúng tôi có giải pháp phù hợp
              cho mọi nhu cầu.
              <span className="font-semibold text-green-600">
                {" "}
                Tiết kiệm đến 33%
              </span>{" "}
              khi chọn yearly plan.
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center max-w-md p-4 mx-auto space-x-4 border bg-white/50 dark:bg-slate-800/50 backdrop-blur rounded-2xl">
              <span
                className={`font-medium transition-colors ${!isYearly ? "text-primary" : "text-muted-foreground"}`}
              >
                Monthly
              </span>
              <Switch
                checked={isYearly}
                onCheckedChange={setIsYearly}
                className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-purple-600"
              />
              <span
                className={`font-medium transition-colors ${isYearly ? "text-primary" : "text-muted-foreground"}`}
              >
                Yearly
              </span>
              {isYearly && (
                <Badge className="text-green-800 bg-green-100 animate-pulse">
                  <Gift className="w-3 h-3 mr-1" />
                  Save 33%
                </Badge>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="px-4 py-16">
        <div className="container mx-auto">
          <div className="grid gap-8 lg:grid-cols-3">
            {plans.map((plan, index) => (
              <Card
                key={plan.id}
                className={`relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-3 border-0 ${
                  plan.popular
                    ? "bg-gradient-to-br from-white to-purple-50 dark:from-slate-800 dark:to-purple-900 ring-2 ring-purple-500 scale-105"
                    : "bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900"
                } ${hoveredPlan === plan.id ? "scale-105" : ""}`}
                onMouseEnter={() => setHoveredPlan(plan.id)}
                onMouseLeave={() => setHoveredPlan(null)}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0">
                    <div className="py-2 text-sm font-medium text-center text-white bg-gradient-to-r from-purple-500 to-pink-500">
                      <Star className="inline w-4 h-4 mr-1" />
                      {plan.highlight}
                    </div>
                  </div>
                )}

                <CardHeader
                  className={`text-center space-y-4 ${plan.popular ? "pt-16" : "pt-8"}`}
                >
                  <div
                    className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${plan.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <plan.icon className="w-8 h-8 text-white" />
                  </div>

                  <div>
                    <CardTitle className="mb-2 text-2xl font-bold">
                      {plan.name}
                    </CardTitle>
                    <p className="text-muted-foreground">{plan.description}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-baseline justify-center space-x-2">
                      <span className="text-4xl font-bold">
                        {formatPrice(
                          isYearly ? plan.yearlyPrice : plan.monthlyPrice,
                        )}
                      </span>
                      <span className="text-muted-foreground">VND</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {isYearly ? "per year" : "per month"}
                    </div>
                    {isYearly && (
                      <div className="text-sm">
                        <span className="line-through text-muted-foreground">
                          {formatPrice(plan.originalYearlyPrice)} VND
                        </span>
                        <Badge
                          variant="secondary"
                          className="ml-2 text-green-800 bg-green-100"
                        >
                          Save{" "}
                          {Math.round(
                            (1 - plan.yearlyPrice / plan.originalYearlyPrice) *
                              100,
                          )}
                          %
                        </Badge>
                      </div>
                    )}
                  </div>

                  <Button
                    size="lg"
                    className={`w-full transition-all duration-300 ${
                      plan.popular
                        ? "bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 shadow-lg hover:shadow-xl"
                        : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    } hover:scale-105`}
                  >
                    {plan.cta}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardHeader>

                <CardContent className="space-y-4">
                  <Separator />
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
                      Features included:
                    </h4>
                    {plan.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-center space-x-3"
                      >
                        {feature.included ? (
                          <CheckCircle2 className="flex-shrink-0 w-5 h-5 text-green-500" />
                        ) : (
                          <X className="flex-shrink-0 w-5 h-5 text-muted-foreground" />
                        )}
                        <span
                          className={`text-sm ${feature.included ? "text-foreground" : "text-muted-foreground"}`}
                        >
                          {feature.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons Section */}
      <section className="px-4 py-16 bg-muted/30">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
              Add-ons & Services
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
              Nâng cao trải nghiệm với các dịch vụ bổ sung chuyên nghiệp
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {addOns.map((addon, index) => (
              <Card
                key={index}
                className="transition-all duration-300 border-0 group hover:shadow-lg hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900"
              >
                <CardContent className="p-6 space-y-4 text-center">
                  <div
                    className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-r ${addon.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <addon.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="mb-2 font-semibold">{addon.name}</h3>
                    <p className="mb-3 text-sm text-muted-foreground">
                      {addon.description}
                    </p>
                    <div className="text-lg font-bold text-primary">
                      {formatPrice(addon.price)} VND
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
                  >
                    Add to Plan
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 py-16">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-transparent bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text">
              Khách hàng nói gì về chúng tôi
            </h2>
            <p className="text-lg text-muted-foreground">
              Hàng nghìn khách hàng đã tin tưởng và hài lòng với dịch vụ của
              chúng tôi
            </p>
          </div>

          <div className="grid max-w-4xl gap-8 mx-auto md:grid-cols-2">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-blue-900"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-yellow-400 fill-yellow-400"
                      />
                    ))}
                  </div>
                  <blockquote className="italic text-muted-foreground">
                    "{testimonial.content}"
                  </blockquote>
                  <div className="flex items-center space-x-3">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="object-cover w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role} at {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 py-16 bg-muted/30">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text">
              Câu hỏi thường gặp
            </h2>
            <p className="text-lg text-muted-foreground">
              Những câu hỏi phổ biến về pricing và dịch vụ
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Card
                key={index}
                className="border-0 bg-white/50 dark:bg-slate-800/50 backdrop-blur"
              >
                <CardContent className="p-6">
                  <h3 className="flex items-center mb-3 font-semibold">
                    <MessageCircle className="w-5 h-5 mr-2 text-primary" />
                    {faq.question}
                  </h3>
                  <p className="leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-4 py-16 overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-black/10"></div>
          <div className="absolute w-32 h-32 rounded-full top-10 right-10 bg-white/10 animate-pulse"></div>
          <div className="absolute w-24 h-24 rounded-full bottom-10 left-10 bg-white/10 animate-pulse animation-delay-2000"></div>
        </div>

        <div className="container relative z-10 mx-auto text-center">
          <div className="max-w-2xl mx-auto space-y-6 text-white">
            <h2 className="text-3xl font-bold md:text-4xl">
              Sẵn sàng bắt đầu?
            </h2>
            <p className="text-lg opacity-90">
              Tham gia cùng hàng nghìn developers và designers đang sử dụng
              templates của chúng tôi
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" variant="secondary" className="group">
                Dùng thử miễn phí 7 ngày
                <Rocket className="w-5 h-5 ml-2 group-hover:animate-bounce" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-purple-600"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Liên hệ Sales
              </Button>
            </div>
            <p className="text-sm opacity-75">
              Không cần thẻ tín dụng • Hủy bất cứ lúc nào • 30 ngày hoàn tiền
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
