import React from "react";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-muted/50 border-t mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold">TM</span>
              </div>
              <span className="font-bold text-xl">Template Market</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Nền tảng hàng đầu cung cấp templates và e-books chất lượng cao cho
              developers và designers.
            </p>
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Youtube className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Liên kết nhanh</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/templates"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Templates
                </Link>
              </li>
              <li>
                <Link
                  to="/ebooks"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  E-books
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Hỗ trợ</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/help"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Trung tâm trợ giúp
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Câu hỏi thường gặp
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Điều khoản sử dụng
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info & Newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Liên hệ</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>123 Đường ABC, Quận 1, TP.HCM</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+84 123 456 789</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>support@templatemarket.com</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Đăng ký nhận tin</h4>
              <div className="flex space-x-2">
                <Input placeholder="Email của bạn" className="flex-1" />
                <Button size="sm">Đăng ký</Button>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; 2024 Template Market. Tất cả quyền được bảo lưu.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link
              to="/privacy"
              className="hover:text-primary transition-colors"
            >
              Chính sách bảo mật
            </Link>
            <Link to="/terms" className="hover:text-primary transition-colors">
              Điều khoản
            </Link>
            <Link
              to="/cookies"
              className="hover:text-primary transition-colors"
            >
              Cookie
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
