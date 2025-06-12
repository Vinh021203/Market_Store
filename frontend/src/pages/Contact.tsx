import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Send,
  CheckCircle,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const contactSchema = z.object({
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  subject: z.string().min(5, "Tiêu đề phải có ít nhất 5 ký tự"),
  message: z.string().min(10, "Tin nhắn phải có ít nhất 10 ký tự"),
});

type ContactData = z.infer<typeof contactSchema>;

const Contact: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactData) => {
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);
    reset();

    toast({
      title: "Tin nhắn đã được gửi!",
      description: "Chúng tôi sẽ phản hồi bạn trong vòng 24 giờ.",
    });
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Địa chỉ",
      content: "123 Đường ABC, Quận 1, TP. Hồ Chí Minh",
      subContent: "Việt Nam",
    },
    {
      icon: Phone,
      title: "Điện thoại",
      content: "+84 123 456 789",
      subContent: "Thứ 2 - Thứ 6: 8:00 - 18:00",
    },
    {
      icon: Mail,
      title: "Email",
      content: "support@templatemarket.com",
      subContent: "Hỗ trợ 24/7",
    },
    {
      icon: Clock,
      title: "Giờ làm việc",
      content: "Thứ 2 - Thứ 6: 8:00 - 18:00",
      subContent: "Thứ 7: 9:00 - 17:00",
    },
  ];

  const faqs = [
    {
      question: "Làm thế nào để tải xuống sản phẩm sau khi mua?",
      answer:
        "Sau khi thanh toán thành công, bạn sẽ nhận được email chứa link tải xuống. Bạn cũng có thể truy cập vào tài khoản để tải lại.",
    },
    {
      question: "Tôi có thể sử dụng templates cho dự án thương mại không?",
      answer:
        "Có, tất cả templates đều đi kèm với giấy phép thương mại, cho phép bạn sử dụng cho các dự án thương mại.",
    },
    {
      question: "Có hỗ trợ kỹ thuật không?",
      answer:
        "Chúng tôi cung cấp hỗ trợ kỹ thuật qua email và chat. Đội ngũ hỗ trợ sẽ giúp bạn giải quyết mọi vấn đề.",
    },
    {
      question: "Chính sách hoàn tiền như thế nào?",
      answer:
        "Chúng tôi có chính sách hoàn tiền trong vòng 30 ngày nếu sản phẩm không đúng như mô tả.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-background py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold">
              Liên hệ với chúng tôi
            </h1>
            <p className="text-xl text-muted-foreground">
              Chúng tôi luôn sẵn sàng hỗ trợ bạn. Hãy gửi tin nhắn và chúng tôi
              sẽ phản hồi sớm nhất có thể.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5" />
                  <span>Gửi tin nhắn</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Cảm ơn bạn!</h3>
                    <p className="text-muted-foreground">
                      Tin nhắn của bạn đã được gửi thành công. Chúng tôi sẽ phản
                      hồi trong vòng 24 giờ.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Họ và tên *</Label>
                        <Input
                          id="name"
                          placeholder="Nguyễn Văn A"
                          {...register("name")}
                          className={errors.name ? "border-red-500" : ""}
                        />
                        {errors.name && (
                          <p className="text-sm text-red-500">
                            {errors.name.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="example@email.com"
                          {...register("email")}
                          className={errors.email ? "border-red-500" : ""}
                        />
                        {errors.email && (
                          <p className="text-sm text-red-500">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Tiêu đề *</Label>
                      <Input
                        id="subject"
                        placeholder="Vấn đề cần hỗ trợ"
                        {...register("subject")}
                        className={errors.subject ? "border-red-500" : ""}
                      />
                      {errors.subject && (
                        <p className="text-sm text-red-500">
                          {errors.subject.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Tin nhắn *</Label>
                      <Textarea
                        id="message"
                        placeholder="Mô tả chi tiết vấn đề của bạn..."
                        rows={6}
                        {...register("message")}
                        className={errors.message ? "border-red-500" : ""}
                      />
                      {errors.message && (
                        <p className="text-sm text-red-500">
                          {errors.message.message}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                          Đang gửi...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Gửi tin nhắn
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contact Info & FAQ */}
          <div className="space-y-8">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Thông tin liên hệ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <info.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">{info.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {info.content}
                      </p>
                      {info.subContent && (
                        <p className="text-xs text-muted-foreground">
                          {info.subContent}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* FAQ */}
            <Card>
              <CardHeader>
                <CardTitle>Câu hỏi thường gặp</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="space-y-2">
                    <h4 className="font-medium text-sm">{faq.question}</h4>
                    <p className="text-xs text-muted-foreground">
                      {faq.answer}
                    </p>
                    {index < faqs.length - 1 && <hr className="my-3" />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Vị trí của chúng tôi
            </h2>
            <p className="text-muted-foreground">
              Ghé thăm văn phòng của chúng tôi hoặc liên hệ qua các kênh trực
              tuyến
            </p>
          </div>

          <div className="bg-muted rounded-lg h-64 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Bản đồ sẽ được tích hợp</p>
              <p className="text-sm text-muted-foreground">
                123 Đường ABC, Quận 1, TP.HCM
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
