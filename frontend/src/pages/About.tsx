import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
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
} from "lucide-react";

const About: React.FC = () => {
  const stats = [
    { label: "Templates", value: "1000+", icon: Package },
    { label: "E-books", value: "500+", icon: BookOpen },
    { label: "Khách hàng hài lòng", value: "50K+", icon: Users },
    { label: "Năm kinh nghiệm", value: "5+", icon: Calendar },
  ];

  const values = [
    {
      icon: Target,
      title: "Sứ mệnh",
      description:
        "Trao quyền cho các nhà phát triển và thiết kế viên với các công cụ và tài nguyên chất lượng cao để tạo ra những sản phẩm tuyệt vời.",
    },
    {
      icon: Eye,
      title: "Tầm nhìn",
      description:
        "Trở thành nền tảng hàng đầu cung cấp templates và e-books chuyên nghiệp, giúp cộng đồng công nghệ phát triển mạnh mẽ.",
    },
    {
      icon: Heart,
      title: "Giá trị cốt lõi",
      description:
        "Chất lượng, đổi mới, tin cậy và hỗ trợ khách hàng là những giá trị cốt lõi định hình mọi hoạt động của chúng tôi.",
    },
  ];

  const features = [
    {
      icon: Zap,
      title: "Chất lượng hàng đầu",
      description:
        "Mọi sản phẩm đều được chọn lọc kỹ càng và kiểm tra chất lượng nghiêm ngặt trước khi phát hành.",
    },
    {
      icon: Shield,
      title: "Bảo mật tuyệt đối",
      description:
        "Hệ thống thanh toán an toàn với mã hóa SSL và tuân thủ các tiêu chuẩn bảo mật quốc tế.",
    },
    {
      icon: HeartHandshake,
      title: "Hỗ trợ tận tình",
      description:
        "Đội ngũ hỗ trợ chuyên nghiệp sẵn sàng giúp đỡ bạn 24/7 qua nhiều kênh liên lạc.",
    },
  ];

  const team = [
    {
      name: "Nguyễn Văn A",
      role: "CEO & Founder",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
      description:
        "10+ năm kinh nghiệm trong lĩnh vực công nghệ và thiết kế web.",
    },
    {
      name: "Trần Thị B",
      role: "CTO",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
      description: "Chuyên gia về kiến trúc hệ thống và phát triển sản phẩm.",
    },
    {
      name: "Lê Văn C",
      role: "Creative Director",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
      description: "Chuyên gia thiết kế UI/UX với hơn 8 năm kinh nghiệm.",
    },
  ];

  const milestones = [
    {
      year: "2019",
      event: "Thành lập Template Market",
      description: "Bắt đầu với 50 templates đầu tiên",
    },
    {
      year: "2020",
      event: "Ra mắt e-books",
      description: "Mở rộng sang lĩnh vực xuất bản sách điện tử",
    },
    {
      year: "2021",
      event: "10,000 khách hàng",
      description: "Đạt mốc 10,000 khách hàng tin tưởng",
    },
    {
      year: "2022",
      event: "Mở rộng quốc tế",
      description: "Phục vụ khách hàng trên 50 quốc gia",
    },
    {
      year: "2023",
      event: "1 triệu downloads",
      description: "Vượt mốc 1 triệu lượt tải sản phẩm",
    },
    {
      year: "2024",
      event: "AI Integration",
      description: "Tích hợp AI để cải thiện trải nghiệm người dùng",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-background py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <Badge variant="outline" className="mb-4">
              Giới thiệu về chúng tôi
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold">
              Chúng tôi là Template Market
            </h1>
            <p className="text-xl text-muted-foreground">
              Nền tảng hàng đầu cung cấp templates và e-books chất lượng cao,
              giúp developers và designers tạo ra những sản phẩm tuyệt vời.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-3">
                <div className="text-3xl md:text-4xl font-bold text-primary">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Về chúng tôi</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Khám phá sứ mệnh, tầm nhìn và những giá trị cốt lõi định hình nên
              Template Market
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card
                key={index}
                className="text-center p-6 hover:shadow-lg transition-shadow duration-200"
              >
                <CardContent className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              Tại sao chọn chúng tôi?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Những tính năng và dịch vụ vượt trội mà chúng tôi mang lại cho
              khách hàng
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="text-center p-6 hover:shadow-lg transition-shadow duration-200"
              >
                <CardContent className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              Đội ngũ của chúng tôi
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Gặp gỡ những con người đằng sau thành công của Template Market
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card
                key={index}
                className="text-center p-6 hover:shadow-lg transition-shadow duration-200"
              >
                <CardContent className="space-y-4">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-semibold">{member.name}</h3>
                    <p className="text-primary font-medium">{member.role}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              Hành trình phát triển
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Những cột mốc quan trọng trong quá trình phát triển của chúng tôi
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                    {milestone.year}
                  </div>
                  <div className="flex-1 pb-8">
                    <h3 className="text-lg font-semibold mb-1">
                      {milestone.event}
                    </h3>
                    <p className="text-muted-foreground">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary">
        <div className="container mx-auto text-center">
          <div className="max-w-2xl mx-auto space-y-6 text-primary-foreground">
            <h2 className="text-3xl md:text-4xl font-bold">
              Sẵn sàng bắt đầu?
            </h2>
            <p className="text-lg opacity-90">
              Gia nhập hàng nghìn khách hàng đã tin tưởng chọn Template Market
              để hiện thực hóa ý tưởng của họ
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/templates">Khám phá Templates</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                asChild
              >
                <Link to="/contact">Liên hệ với chúng tôi</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
