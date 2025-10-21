import React, { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Code,
  Key,
  Database,
  Download,
  Shield,
  Zap,
  BookOpen,
  Copy,
  CheckCircle,
  ExternalLink,
  Terminal,
  Globe,
  Lock,
  Users,
  Settings,
  AlertTriangle,
  Mail,
  Github,
  FileText,
  PlayCircle,
  Clock,
  Search,
  Star,
  Heart,
  Sparkles,
  Crown,
  Gift,
  Rocket,
  Target,
  ArrowRight,
  ArrowUp,
  Package,
  Award,
  Activity,
  Server,
  Webhook,
  Bug,
  Info,
  MessageSquare,
  Send,
  TrendingUp,
  BarChart3,
  ShoppingCart,
  CreditCard,
  RefreshCw,
  Edit,
  Trash2,
  Eye,
  XCircle,
} from "lucide-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { toast } from "@/hooks/use-toast";

// ============================================
// SOFT PINK THEME
// ============================================
const softPinkTheme = {
  pageBackground: "from-pink-50/70 via-rose-50/60 to-red-50/50",
  primaryGradient: "from-pink-500 via-rose-500 to-red-500",
  secondaryGradient: "from-rose-400 via-pink-500 to-red-400",
  heroText: "from-pink-700 via-rose-600 to-red-600",
  accentText: "from-rose-600 via-pink-600 to-red-600",
  glow: "shadow-pink-200/60 shadow-2xl",
  softGlow: "shadow-pink-200/40 shadow-lg",
};

// ============================================
// STAR BACKGROUND PATTERN
// ============================================
const StarBackgroundPattern = () => (
  <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.08 }}>
    <defs>
      <pattern
        id="starPattern"
        x="0"
        y="0"
        width="200"
        height="200"
        patternUnits="userSpaceOnUse"
      >
        <g transform="translate(50, 50)">
          <path
            d="M 0,-30 L 7,-10 L 30,-10 L 12,5 L 19,25 L 0,12 L -19,25 L -12,5 L -30,-10 L -7,-10 Z"
            fill="url(#starGradient1)"
            opacity="0.6"
          />
        </g>
        <g transform="translate(150, 120)">
          <path
            d="M 0,-20 L 5,-7 L 20,-7 L 8,3 L 13,17 L 0,8 L -13,17 L -8,3 L -20,-7 L -5,-7 Z"
            fill="url(#starGradient2)"
            opacity="0.5"
          />
        </g>
        <g transform="translate(30, 150)">
          <path
            d="M 0,-12 L 3,-4 L 12,-4 L 5,2 L 8,10 L 0,5 L -8,10 L -5,2 L -12,-4 L -3,-4 Z"
            fill="url(#starGradient3)"
            opacity="0.4"
          />
        </g>
        <g transform="translate(100, 30)">
          <circle
            cx="0"
            cy="0"
            r="3"
            fill="url(#starGradient4)"
            opacity="0.6"
          />
          <path
            d="M 0,-8 L 1,-2 L 8,0 L 1,2 L 0,8 L -1,2 L -8,0 L -1,-2 Z"
            fill="url(#starGradient4)"
            opacity="0.3"
          />
        </g>
        <g transform="translate(170, 70)">
          <path
            d="M 0,-18 L 4,-6 L 18,-6 L 7,3 L 11,15 L 0,7 L -11,15 L -7,3 L -18,-6 L -4,-6 Z"
            fill="url(#starGradient1)"
            opacity="0.5"
          />
        </g>
      </pattern>
      <linearGradient id="starGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#FDE68A", stopOpacity: 1 }} />
        <stop offset="50%" style={{ stopColor: "#FCA5A5", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#FBCFE8", stopOpacity: 1 }} />
      </linearGradient>
      <linearGradient id="starGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#FBCFE8", stopOpacity: 1 }} />
        <stop offset="50%" style={{ stopColor: "#FCA5A5", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#FECACA", stopOpacity: 1 }} />
      </linearGradient>
      <linearGradient id="starGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#FEF3C7", stopOpacity: 1 }} />
        <stop offset="50%" style={{ stopColor: "#FBCFE8", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#FCA5A5", stopOpacity: 1 }} />
      </linearGradient>
      <linearGradient id="starGradient4" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#FDE68A", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#FBCFE8", stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#starPattern)" />
  </svg>
);

// ============================================
// FLOATING ICONS
// ============================================
const FloatingIcons = () => {
  const icons = [
    {
      Icon: Code,
      color: "from-pink-50 to-rose-100",
      position: "top-10 right-20",
    },
    { Icon: Key, color: "from-rose-50 to-red-100", position: "top-32 left-10" },
    {
      Icon: Database,
      color: "from-red-50 to-pink-100",
      position: "bottom-20 right-10",
    },
    {
      Icon: Shield,
      color: "from-pink-100 to-rose-50",
      position: "bottom-32 left-20",
    },
    {
      Icon: Terminal,
      color: "from-rose-100 to-pink-50",
      position: "top-1/2 right-1/4",
    },
    {
      Icon: Globe,
      color: "from-red-50 to-rose-100",
      position: "top-1/3 left-1/3",
    },
    {
      Icon: Zap,
      color: "from-pink-50 to-red-100",
      position: "bottom-1/3 right-1/3",
    },
    {
      Icon: Lock,
      color: "from-rose-50 to-pink-100",
      position: "top-2/3 left-1/4",
    },
    {
      Icon: Star,
      color: "from-red-100 to-rose-50",
      position: "top-1/4 right-1/2",
    },
    {
      Icon: Heart,
      color: "from-pink-100 to-red-50",
      position: "bottom-1/4 left-1/2",
    },
    {
      Icon: Sparkles,
      color: "from-rose-100 to-red-50",
      position: "top-3/4 right-20",
    },
    {
      Icon: Crown,
      color: "from-pink-50 to-rose-100",
      position: "bottom-40 left-10",
    },
    {
      Icon: Gift,
      color: "from-red-50 to-pink-50",
      position: "top-40 right-40",
    },
    {
      Icon: Rocket,
      color: "from-rose-50 to-red-50",
      position: "bottom-1/2 right-10",
    },
    {
      Icon: Target,
      color: "from-pink-100 to-rose-100",
      position: "top-1/2 left-10",
    },
    {
      Icon: Package,
      color: "from-red-100 to-pink-100",
      position: "bottom-1/4 right-1/4",
    },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {icons.map((item, i) => (
        <motion.div
          key={i}
          className={`absolute ${item.position}`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 15, -15, 0],
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            delay: i * 0.8,
            ease: "easeInOut",
          }}
        >
          <motion.div
            className={`p-4 rounded-full bg-gradient-to-r ${item.color} backdrop-blur-sm shadow-lg`}
            whileHover={{ scale: 1.5, rotate: 30 }}
          >
            <item.Icon className="w-8 h-8 text-pink-300/50" />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
const API: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState("auth");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [searchTerm, setSearchTerm] = useState("");
  const [testApiKey, setTestApiKey] = useState("");
  const [testEndpoint, setTestEndpoint] = useState("");
  const [testResponse, setTestResponse] = useState("");
  const [isTestLoading, setIsTestLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showFloatingNav, setShowFloatingNav] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const { scrollYProgress } = useScroll();
  const headerY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingNav(window.scrollY > 500);
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(Math.min(progress, 100));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const stats = [
    { icon: Activity, value: "99.9%", label: "Uptime", color: "text-pink-600" },
    {
      icon: Zap,
      value: "< 100ms",
      label: "Response time",
      color: "text-rose-600",
    },
    { icon: Users, value: "50K+", label: "Developers", color: "text-red-600" },
    {
      icon: Database,
      value: "1M+",
      label: "API calls/ngày",
      color: "text-pink-700",
    },
  ];

  const apiFeatures = [
    {
      icon: Shield,
      title: "Bảo mật cao cấp",
      description:
        "JWT Authentication, OAuth 2.0, API key với rate limiting thông minh",
      features: [
        "JWT Tokens",
        "OAuth 2.0",
        "Rate Limiting",
        "IP Whitelisting",
        "CORS Protection",
      ],
    },
    {
      icon: Zap,
      title: "Hiệu suất vượt trội",
      description:
        "Response time < 100ms, uptime 99.9%, CDN global, auto-scaling",
      features: [
        "Global CDN",
        "Auto-scaling",
        "Redis Caching",
        "Load Balancing",
        "Monitoring 24/7",
      ],
    },
    {
      icon: Globe,
      title: "RESTful chuẩn",
      description:
        "Tuân thủ chuẩn REST, HTTP methods, status codes, pagination",
      features: [
        "REST Standards",
        "HTTP Methods",
        "Status Codes",
        "Pagination",
        "Filtering & Sorting",
      ],
    },
    {
      icon: Database,
      title: "Real-time data",
      description:
        "WebSocket connections, live updates, event streaming, push notifications",
      features: [
        "WebSockets",
        "Live Updates",
        "Event Streaming",
        "Push Notifications",
        "Real-time Analytics",
      ],
    },
  ];

  const endpoints = [
    {
      id: "auth",
      category: "Xác thực",
      icon: Lock,
      description: "Xác thực người dùng, đăng ký, quản lý token",
      methods: [
        {
          method: "POST",
          path: "/api/v1/auth/login",
          title: "Đăng nhập",
          description: "Đăng nhập và lấy access token với refresh token",
          headers: [
            { name: "Content-Type", value: "application/json", required: true },
            { name: "X-API-Key", value: "your-api-key", required: true },
          ],
          params: [
            {
              name: "email",
              type: "string",
              required: true,
              description: "Email người dùng",
            },
            {
              name: "password",
              type: "string",
              required: true,
              description: "Mật khẩu (tối thiểu 8 ký tự)",
            },
          ],
          requestBody: `{
  "email": "user@example.com",
  "password": "yourpassword123"
}`,
          response: `{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 3600,
    "user": {
      "id": 12345,
      "email": "user@example.com",
      "name": "Nguyễn Văn A",
      "role": "user",
      "verified": true,
      "created_at": "2024-01-15T10:30:00Z"
    }
  }
}`,
          errors: [
            {
              code: 400,
              message: "Bad Request",
              description: "Email hoặc password không hợp lệ",
            },
            {
              code: 401,
              message: "Unauthorized",
              description: "Thông tin đăng nhập sai",
            },
            {
              code: 429,
              message: "Too Many Requests",
              description: "Vượt quá giới hạn request",
            },
          ],
        },
        {
          method: "POST",
          path: "/api/v1/auth/register",
          title: "Đăng ký tài khoản",
          description: "Đăng ký tài khoản mới với xác thực email",
          headers: [
            { name: "Content-Type", value: "application/json", required: true },
            { name: "X-API-Key", value: "your-api-key", required: true },
          ],
          params: [
            {
              name: "email",
              type: "string",
              required: true,
              description: "Địa chỉ email hợp lệ",
            },
            {
              name: "password",
              type: "string",
              required: true,
              description: "Mật khẩu (min 8 chars, 1 chữ hoa, 1 số)",
            },
            {
              name: "name",
              type: "string",
              required: true,
              description: "Họ tên đầy đủ (min 2 chars)",
            },
            {
              name: "phone",
              type: "string",
              required: false,
              description: "Số điện thoại có mã quốc gia",
            },
          ],
          requestBody: `{
  "email": "newuser@example.com",
  "password": "SecurePass123!",
  "name": "Trần Thị B",
  "phone": "+84971386588"
}`,
          response: `{
  "success": true,
  "message": "Tài khoản đã được tạo. Vui lòng kiểm tra email để xác thực.",
  "data": {
    "user": {
      "id": 12346,
      "email": "newuser@example.com",
      "name": "Trần Thị B",
      "phone": "+84971386588",
      "role": "user",
      "verified": false,
      "created_at": "2024-01-15T11:15:00Z"
    }
  }
}`,
          errors: [
            {
              code: 400,
              message: "Bad Request",
              description: "Dữ liệu không hợp lệ hoặc email đã tồn tại",
            },
            {
              code: 422,
              message: "Unprocessable Entity",
              description: "Validation thất bại",
            },
          ],
        },
        {
          method: "POST",
          path: "/api/v1/auth/refresh",
          title: "Làm mới token",
          description: "Làm mới access token bằng refresh token",
          headers: [
            { name: "Content-Type", value: "application/json", required: true },
            {
              name: "Authorization",
              value: "Bearer refresh-token",
              required: true,
            },
          ],
          params: [
            {
              name: "refresh_token",
              type: "string",
              required: true,
              description: "Refresh token hợp lệ",
            },
          ],
          requestBody: `{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}`,
          response: `{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 3600
  }
}`,
          errors: [
            {
              code: 401,
              message: "Unauthorized",
              description: "Refresh token không hợp lệ hoặc đã hết hạn",
            },
          ],
        },
      ],
    },
    {
      id: "products",
      category: "Sản phẩm",
      icon: Package,
      description: "Quản lý sản phẩm, tìm kiếm, danh mục, đánh giá",
      methods: [
        {
          method: "GET",
          path: "/api/v1/products",
          title: "Lấy danh sách sản phẩm",
          description: "Lấy danh sách sản phẩm với phân trang và filter",
          headers: [
            {
              name: "Authorization",
              value: "Bearer your-token",
              required: true,
            },
          ],
          params: [
            {
              name: "page",
              type: "integer",
              required: false,
              description: "Số trang (mặc định: 1)",
            },
            {
              name: "limit",
              type: "integer",
              required: false,
              description: "Số sản phẩm mỗi trang (mặc định: 20, max: 100)",
            },
            {
              name: "category",
              type: "string",
              required: false,
              description: "Lọc theo category slug",
            },
            {
              name: "search",
              type: "string",
              required: false,
              description: "Tìm kiếm trong tên và mô tả",
            },
            {
              name: "sort",
              type: "string",
              required: false,
              description: "Sắp xếp: name, price, created_at, popularity",
            },
            {
              name: "order",
              type: "string",
              required: false,
              description: "Thứ tự: asc, desc (mặc định: desc)",
            },
            {
              name: "price_min",
              type: "number",
              required: false,
              description: "Giá tối thiểu",
            },
            {
              name: "price_max",
              type: "number",
              required: false,
              description: "Giá tối đa",
            },
          ],
          response: `{
  "success": true,
  "data": {
    "products": [
      {
        "id": 1,
        "name": "Premium React Dashboard",
        "slug": "premium-react-dashboard",
        "description": "Modern and responsive React admin dashboard template",
        "price": 49.99,
        "original_price": 79.99,
        "currency": "USD",
        "discount_percentage": 37,
        "category": {
          "id": 5,
          "name": "React Templates",
          "slug": "react-templates"
        },
        "tags": ["react", "dashboard", "admin", "responsive"],
        "thumbnail": "https://cdn.templatemarket.com/thumbs/product-1.jpg",
        "preview_url": "https://preview.templatemarket.com/product-1",
        "downloads": 15420,
        "rating": 4.8,
        "reviews_count": 234,
        "featured": true,
        "created_at": "2024-01-10T08:30:00Z",
        "updated_at": "2024-01-15T14:20:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 20,
      "total": 150,
      "total_pages": 8,
      "has_next": true,
      "has_prev": false
    },
    "filters": {
      "categories": [
        {"id": 1, "name": "React Templates", "count": 45},
        {"id": 2, "name": "Vue Templates", "count": 32},
        {"id": 3, "name": "Angular Templates", "count": 28}
      ],
      "price_range": {"min": 9.99, "max": 199.99},
      "tags": ["react", "vue", "angular", "dashboard", "landing", "ecommerce"]
    }
  }
}`,
          errors: [
            {
              code: 400,
              message: "Bad Request",
              description: "Tham số query không hợp lệ",
            },
            {
              code: 401,
              message: "Unauthorized",
              description: "Token bị thiếu hoặc không hợp lệ",
            },
          ],
        },
        {
          method: "GET",
          path: "/api/v1/products/{id}",
          title: "Lấy chi tiết sản phẩm",
          description: "Lấy thông tin chi tiết của sản phẩm theo ID",
          headers: [
            {
              name: "Authorization",
              value: "Bearer your-token",
              required: true,
            },
          ],
          params: [
            {
              name: "id",
              type: "integer",
              required: true,
              description: "Product ID",
            },
          ],
          response: `{
  "success": true,
  "data": {
    "id": 1,
    "name": "Premium React Dashboard",
    "slug": "premium-react-dashboard",
    "description": "A comprehensive React admin dashboard template...",
    "long_description": "This premium React dashboard template includes over 50+ components, dark/light theme support, multiple layouts, and full TypeScript support. Perfect for building modern admin panels, SaaS applications, and data visualization tools.",
    "price": 49.99,
    "original_price": 79.99,
    "currency": "USD",
    "category": {
      "id": 5,
      "name": "React Templates",
      "slug": "react-templates",
      "description": "Professional React templates for modern web applications"
    },
    "author": {
      "id": 100,
      "name": "Template Studio",
      "username": "templatestudio",
      "avatar": "https://cdn.templatemarket.com/avatars/author-100.jpg",
      "verified": true,
      "total_products": 25,
      "total_sales": 5420,
      "member_since": "2022-03-15T00:00:00Z"
    },
    "tags": ["react", "dashboard", "admin", "responsive", "typescript"],
    "images": [
      "https://cdn.templatemarket.com/images/product-1-1.jpg",
      "https://cdn.templatemarket.com/images/product-1-2.jpg",
      "https://cdn.templatemarket.com/images/product-1-3.jpg",
      "https://cdn.templatemarket.com/images/product-1-4.jpg"
    ],
    "files": [
      {
        "name": "source-code.zip",
        "size": "25.4 MB",
        "type": "application/zip",
        "includes": ["React source", "Components", "Assets", "Documentation"]
      },
      {
        "name": "documentation.pdf",
        "size": "2.1 MB",
        "type": "application/pdf"
      }
    ],
    "features": [
      "Responsive design cho mọi thiết bị",
      "Dark/Light theme với smooth transitions",
      "50+ pre-built components",
      "Full TypeScript support",
      "Multiple dashboard layouts",
      "Advanced charts & graphs",
      "Authentication pages",
      "Form validation với React Hook Form",
      "API integration examples",
      "Comprehensive documentation"
    ],
    "requirements": {
      "node": ">=14.0.0",
      "react": ">=17.0.0",
      "npm": ">=6.0.0"
    },
    "compatibility": {
      "browsers": ["Chrome 90+", "Firefox 88+", "Safari 14+", "Edge 90+"],
      "mobile": true,
      "tablet": true
    },
    "downloads": 15420,
    "rating": 4.8,
    "reviews_count": 234,
    "changelog": [
      {
        "version": "2.1.0",
        "date": "2024-01-15",
        "changes": ["Added 5 new dashboard layouts", "Performance improvements", "Bug fixes"]
      },
      {
        "version": "2.0.0",
        "date": "2024-01-01",
        "changes": ["Complete UI redesign", "TypeScript migration", "New component library"]
      }
    ],
    "license": {
      "type": "Standard",
      "commercial_use": true,
      "redistribution": false,
      "support_period": "12 months",
      "updates": "Lifetime"
    },
    "created_at": "2024-01-10T08:30:00Z",
    "updated_at": "2024-01-15T14:20:00Z"
  }
}`,
          errors: [
            {
              code: 404,
              message: "Not Found",
              description: "Không tìm thấy sản phẩm",
            },
            {
              code: 401,
              message: "Unauthorized",
              description: "Token bị thiếu hoặc không hợp lệ",
            },
          ],
        },
      ],
    },
    {
      id: "orders",
      category: "Đơn hàng",
      icon: ShoppingCart,
      description: "Quản lý đơn hàng, mua hàng, tải xuống",
      methods: [
        {
          method: "GET",
          path: "/api/v1/orders",
          title: "Lấy danh sách đơn hàng",
          description: "Lấy tất cả đơn hàng của user hiện tại",
          headers: [
            {
              name: "Authorization",
              value: "Bearer your-token",
              required: true,
            },
          ],
          params: [
            {
              name: "page",
              type: "integer",
              required: false,
              description: "Số trang",
            },
            {
              name: "limit",
              type: "integer",
              required: false,
              description: "Số đơn hàng mỗi trang",
            },
            {
              name: "status",
              type: "string",
              required: false,
              description: "Lọc theo trạng thái: pending, completed, failed",
            },
          ],
          response: `{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "ORD-2024-001234",
        "status": "completed",
        "total": 149.97,
        "currency": "USD",
        "items": [
          {
            "product_id": 1,
            "name": "Premium React Dashboard",
            "price": 49.99,
            "quantity": 1,
            "download_url": "https://downloads.templatemarket.com/..."
          }
        ],
        "payment_method": "stripe",
        "payment_id": "pi_3MaBC1234567890",
        "invoice_url": "https://invoices.templatemarket.com/...",
        "created_at": "2024-01-15T10:30:00Z",
        "completed_at": "2024-01-15T10:31:15Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total": 25,
      "per_page": 20
    }
  }
}`,
          errors: [
            {
              code: 401,
              message: "Unauthorized",
              description: "Token bị thiếu hoặc không hợp lệ",
            },
          ],
        },
        {
          method: "POST",
          path: "/api/v1/orders",
          title: "Tạo đơn hàng mới",
          description: "Tạo đơn hàng mới và khởi tạo thanh toán",
          headers: [
            {
              name: "Authorization",
              value: "Bearer your-token",
              required: true,
            },
            { name: "Content-Type", value: "application/json", required: true },
          ],
          params: [
            {
              name: "products",
              type: "array",
              required: true,
              description: "Mảng sản phẩm với ID và số lượng",
            },
            {
              name: "payment_method",
              type: "string",
              required: true,
              description: "Phương thức thanh toán: stripe, paypal, crypto",
            },
          ],
          requestBody: `{
  "products": [
    {"id": 1, "quantity": 1},
    {"id": 5, "quantity": 2}
  ],
  "payment_method": "stripe",
  "billing_info": {
    "name": "Nguyễn Văn A",
    "email": "nguyenvana@example.com",
    "address": "123 Đường ABC",
    "city": "Hà Nội",
    "country": "VN",
    "postal_code": "100000"
  },
  "coupon_code": "NEWYEAR2024"
}`,
          response: `{
  "success": true,
  "data": {
    "order_id": "ORD-2024-001235",
    "total": 149.97,
    "discount": 15.00,
    "final_total": 134.97,
    "currency": "USD",
    "payment_url": "https://checkout.stripe.com/pay/cs_test_...",
    "expires_at": "2024-01-15T11:30:00Z",
    "status": "pending"
  }
}`,
          errors: [
            {
              code: 400,
              message: "Bad Request",
              description: "ID sản phẩm hoặc số lượng không hợp lệ",
            },
            {
              code: 401,
              message: "Unauthorized",
              description: "Token bị thiếu hoặc không hợp lệ",
            },
            {
              code: 402,
              message: "Payment Required",
              description: "Thanh toán thất bại",
            },
          ],
        },
      ],
    },
    {
      id: "users",
      category: "Người dùng",
      icon: Users,
      description: "Hồ sơ người dùng, cài đặt, tùy chọn",
      methods: [
        {
          method: "GET",
          path: "/api/v1/users/profile",
          title: "Lấy thông tin profile",
          description: "Lấy thông tin profile của user hiện tại",
          headers: [
            {
              name: "Authorization",
              value: "Bearer your-token",
              required: true,
            },
          ],
          params: [],
          response: `{
  "success": true,
  "data": {
    "id": 12345,
    "email": "user@example.com",
    "name": "Nguyễn Văn A",
    "avatar": "https://cdn.templatemarket.com/avatars/12345.jpg",
    "phone": "+84971386588",
    "role": "user",
    "verified": true,
    "preferences": {
      "newsletter": true,
      "notifications": true,
      "theme": "dark",
      "language": "vi"
    },
    "stats": {
      "purchases": 15,
      "downloads": 45,
      "reviews": 8,
      "wishlist_items": 12
    },
    "billing_info": {
      "address": "123 Đường ABC",
      "city": "Hà Nội",
      "country": "VN",
      "postal_code": "100000"
    },
    "created_at": "2023-06-15T09:20:00Z",
    "last_login": "2024-01-15T10:30:00Z"
  }
}`,
          errors: [
            {
              code: 401,
              message: "Unauthorized",
              description: "Token bị thiếu hoặc không hợp lệ",
            },
          ],
        },
        {
          method: "PUT",
          path: "/api/v1/users/profile",
          title: "Cập nhật profile",
          description: "Cập nhật thông tin profile người dùng",
          headers: [
            {
              name: "Authorization",
              value: "Bearer your-token",
              required: true,
            },
            { name: "Content-Type", value: "application/json", required: true },
          ],
          params: [
            {
              name: "name",
              type: "string",
              required: false,
              description: "Họ tên đầy đủ",
            },
            {
              name: "phone",
              type: "string",
              required: false,
              description: "Số điện thoại",
            },
            {
              name: "preferences",
              type: "object",
              required: false,
              description: "Tùy chọn người dùng",
            },
          ],
          requestBody: `{
  "name": "Nguyễn Văn B",
  "phone": "+84971386588",
  "preferences": {
    "newsletter": false,
    "notifications": true,
    "theme": "light",
    "language": "vi"
  },
  "billing_info": {
    "address": "456 Đường XYZ",
    "city": "TP.HCM",
    "country": "VN",
    "postal_code": "700000"
  }
}`,
          response: `{
  "success": true,
  "message": "Profile đã được cập nhật thành công",
  "data": {
    "id": 12345,
    "email": "user@example.com",
    "name": "Nguyễn Văn B",
    "phone": "+84971386588",
    "preferences": {
      "newsletter": false,
      "notifications": true,
      "theme": "light",
      "language": "vi"
    },
    "updated_at": "2024-01-15T14:30:00Z"
  }
}`,
          errors: [
            {
              code: 400,
              message: "Bad Request",
              description: "Dữ liệu đầu vào không hợp lệ",
            },
            {
              code: 401,
              message: "Unauthorized",
              description: "Token bị thiếu hoặc không hợp lệ",
            },
          ],
        },
      ],
    },
  ];

  const codeExamples = {
    javascript: `// JavaScript/Node.js Example
const API_BASE = 'https://api.templatemarket.com/v1';
const API_KEY = 'your_api_key_here';

class TemplateMarketAPI {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = API_BASE;
    this.token = null;
  }

  async makeRequest(endpoint, options = {}) {
    const url = \`\${this.baseURL}\${endpoint}\`;
    const headers = {
      'Content-Type': 'application/json',
      'X-API-Key': this.apiKey,
      ...options.headers
    };

    if (this.token) {
      headers.Authorization = \`Bearer \${this.token}\`;
    }

    try {
      const response = await fetch(url, { headers, ...options });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Authentication
  async login(email, password) {
    const data = await this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    this.token = data.data.token;
    return data;
  }

  async register(email, password, name) {
    return await this.makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name })
    });
  }

  async refreshToken(refreshToken) {
    const data = await this.makeRequest('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken })
    });
    this.token = data.data.token;
    return data;
  }

  // Products
  async getProducts(params = {}) {
    const queryParams = new URLSearchParams(params);
    return await this.makeRequest(\`/products?\${queryParams}\`);
  }

  async getProduct(id) {
    return await this.makeRequest(\`/products/\${id}\`);
  }

  async searchProducts(query, filters = {}) {
    return await this.getProducts({ search: query, ...filters });
  }

  // Orders
  async createOrder(products, paymentMethod) {
    return await this.makeRequest('/orders', {
      method: 'POST',
      body: JSON.stringify({
        products,
        payment_method: paymentMethod
      })
    });
  }

  async getOrders(params = {}) {
    const queryParams = new URLSearchParams(params);
    return await this.makeRequest(\`/orders?\${queryParams}\`);
  }

  async getOrder(orderId) {
    return await this.makeRequest(\`/orders/\${orderId}\`);
  }

  // User
  async getProfile() {
    return await this.makeRequest('/users/profile');
  }

  async updateProfile(data) {
    return await this.makeRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async getDownloads() {
    return await this.makeRequest('/users/downloads');
  }
}

// Usage Example
const api = new TemplateMarketAPI('your-api-key');

async function example() {
  try {
    // Login
    await api.login('user@example.com', 'password123');
    
    // Get products
    const products = await api.getProducts({ 
      category: 'react', 
      limit: 10,
      sort: 'popularity' 
    });
    console.log('Products:', products.data.products);
    
    // Create order
    const order = await api.createOrder([
      { id: 1, quantity: 1 }
    ], 'stripe');
    console.log('Order created:', order.data.order_id);
    
    // Get profile
    const profile = await api.getProfile();
    console.log('User:', profile.data.name);
  } catch (error) {
    console.error('Error:', error.message);
  }
}`,

    python: `# Python Example
import requests
import json
from typing import Dict, List, Optional

class TemplateMarketAPI:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = 'https://api.templatemarket.com/v1'
        self.token = None
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'X-API-Key': api_key
        })
    
    def _make_request(
        self, 
        method: str, 
        endpoint: str, 
        data: Dict = None, 
        params: Dict = None
    ) -> Dict:
        """Helper method for making API requests"""
        url = f"{self.base_url}{endpoint}"
        
        headers = {}
        if self.token:
            headers['Authorization'] = f'Bearer {self.token}'
        
        try:
            response = self.session.request(
                method=method,
                url=url,
                json=data,
                params=params,
                headers=headers
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"API Error: {e}")
            raise
    
    # Authentication methods
    def login(self, email: str, password: str) -> Dict:
        """Login user and get access token"""
        data = self._make_request('POST', '/auth/login', {
            'email': email,
            'password': password
        })
        self.token = data['data']['token']
        return data
    
    def register(self, email: str, password: str, name: str) -> Dict:
        """Register new user"""
        return self._make_request('POST', '/auth/register', {
            'email': email,
            'password': password,
            'name': name
        })
    
    def refresh_token(self, refresh_token: str) -> Dict:
        """Refresh access token"""
        data = self._make_request('POST', '/auth/refresh', {
            'refresh_token': refresh_token
        })
        self.token = data['data']['token']
        return data
    
    # Product methods
    def get_products(self, **params) -> Dict:
        """Get products list with optional filters"""
        return self._make_request('GET', '/products', params=params)
    
    def get_product(self, product_id: int) -> Dict:
        """Get product details by ID"""
        return self._make_request('GET', f'/products/{product_id}')
    
    def search_products(self, query: str, **params) -> Dict:
        """Search products"""
        params['search'] = query
        return self.get_products(**params)
    
    # Order methods
    def create_order(
        self, 
        products: List[Dict], 
        payment_method: str,
        billing_info: Dict = None,
        coupon_code: str = None
    ) -> Dict:
        """Create new order"""
        payload = {
            'products': products,
            'payment_method': payment_method
        }
        if billing_info:
            payload['billing_info'] = billing_info
        if coupon_code:
            payload['coupon_code'] = coupon_code
            
        return self._make_request('POST', '/orders', payload)
    
    def get_orders(self, **params) -> Dict:
        """Get user orders"""
        return self._make_request('GET', '/orders', params=params)
    
    def get_order(self, order_id: str) -> Dict:
        """Get order details"""
        return self._make_request('GET', f'/orders/{order_id}')
    
    # User methods
    def get_profile(self) -> Dict:
        """Get user profile"""
        return self._make_request('GET', '/users/profile')
    
    def update_profile(self, **data) -> Dict:
        """Update user profile"""
        return self._make_request('PUT', '/users/profile', data)
    
    def get_downloads(self, **params) -> Dict:
        """Get user downloads"""
        return self._make_request('GET', '/users/downloads', params=params)

# Usage Example
if __name__ == "__main__":
    # Initialize API client
    api = TemplateMarketAPI('your-api-key-here')
    
    try:
        # Login
        login_result = api.login('user@example.com', 'your-password')
        print(f"Login successful: {login_result['data']['user']['name']}")
        
        # Get products with filters
        products = api.get_products(
            category='react',
            limit=10,
            sort='popularity',
            order='desc'
        )
        print(f"Found {products['data']['pagination']['total']} products")
        
        # Search for specific products
        search_results = api.search_products('dashboard', category='react')
        print(f"Search found {len(search_results['data']['products'])} results")
        
        # Create an order
        order = api.create_order(
            products=[{'id': 1, 'quantity': 1}],
            payment_method='stripe',
            billing_info={
                'name': 'Nguyễn Văn A',
                'email': 'nguyenvana@example.com',
                'city': 'Hà Nội',
                'country': 'VN'
            }
        )
        print(f"Order created: {order['data']['order_id']}")
        
        # Get user profile
        profile = api.get_profile()
        print(f"User: {profile['data']['name']} ({profile['data']['email']})")
        
        # Update profile
        updated = api.update_profile(
            name='Nguyễn Văn B',
            preferences={'theme': 'dark', 'language': 'vi'}
        )
        print(f"Profile updated: {updated['message']}")
        
    except Exception as e:
        print(f"Error: {e}")`,

    curl: `# cURL Examples - Template Market API

# Set your API key
API_KEY="your_api_key_here"
BASE_URL="https://api.templatemarket.com/v1"

# ================================
# Authentication Examples
# ================================

# Login
curl -X POST "$BASE_URL/auth/login" \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: $API_KEY" \\
  -d '{
    "email": "user@example.com",
    "password": "your_password"
  }'

# Register new user
curl -X POST "$BASE_URL/auth/register" \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: $API_KEY" \\
  -d '{
    "email": "newuser@example.com",
    "password": "SecurePass123!",
    "name": "Nguyễn Văn A",
    "phone": "+84971386588"
  }'

# Refresh token
curl -X POST "$BASE_URL/auth/refresh" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer your_refresh_token" \\
  -d '{
    "refresh_token": "your_refresh_token_here"
  }'

# ================================
# Product Examples
# ================================

# Get products list with filters
curl -X GET "$BASE_URL/products?page=1&limit=20&category=react&sort=popularity&order=desc" \\
  -H "Authorization: Bearer your_access_token"

# Search products
curl -X GET "$BASE_URL/products?search=dashboard&category=react&price_min=10&price_max=100" \\
  -H "Authorization: Bearer your_access_token"

# Get specific product
curl -X GET "$BASE_URL/products/123" \\
  -H "Authorization: Bearer your_access_token"

# Get product with full details
curl -X GET "$BASE_URL/products/123?include=reviews,author,files,changelog" \\
  -H "Authorization: Bearer your_access_token"

# ================================
# Order Examples
# ================================

# Create new order
curl -X POST "$BASE_URL/orders" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer your_access_token" \\
  -d '{
    "products": [
      {"id": 1, "quantity": 1},
      {"id": 5, "quantity": 2}
    ],
    "payment_method": "stripe",
    "billing_info": {
      "name": "Nguyễn Văn A",
      "email": "nguyenvana@example.com",
      "address": "123 Đường ABC",
      "city": "Hà Nội",
      "country": "VN",
      "postal_code": "100000"
    },
    "coupon_code": "NEWYEAR2024"
  }'

# Get user orders
curl -X GET "$BASE_URL/orders?status=completed&page=1&limit=10" \\
  -H "Authorization: Bearer your_access_token"

# Get specific order
curl -X GET "$BASE_URL/orders/ORD-2024-001234" \\
  -H "Authorization: Bearer your_access_token"

# Download product from order
curl -X GET "$BASE_URL/orders/ORD-2024-001234/download/123" \\
  -H "Authorization: Bearer your_access_token" \\
  -o "product_123.zip"

# ================================
# User Profile Examples
# ================================

# Get user profile
curl -X GET "$BASE_URL/users/profile" \\
  -H "Authorization: Bearer your_access_token"

# Update user profile
curl -X PUT "$BASE_URL/users/profile" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer your_access_token" \\
  -d '{
    "name": "Nguyễn Văn B",
    "phone": "+84971386588",
    "preferences": {
      "newsletter": false,
      "notifications": true,
      "theme": "dark",
      "language": "vi"
    },
    "billing_info": {
      "address": "456 Đường XYZ",
      "city": "TP.HCM",
      "country": "VN"
    }
  }'

# Get user downloads
curl -X GET "$BASE_URL/users/downloads?page=1&limit=50" \\
  -H "Authorization: Bearer your_access_token"

# Update user avatar
curl -X POST "$BASE_URL/users/avatar" \\
  -H "Authorization: Bearer your_access_token" \\
  -F "avatar=@/path/to/avatar.jpg"

# ================================
# Error Handling Examples
# ================================

# Handle 401 Unauthorized
curl -X GET "$BASE_URL/users/profile" \\
  -H "Authorization: Bearer invalid_token" \\
  -w "HTTP Status: %{http_code}\\n"

# Handle 429 Rate Limit
curl -X POST "$BASE_URL/auth/login" \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: $API_KEY" \\
  -d '{...}' \\
  -w "HTTP Status: %{http_code}\\nRate Limit Remaining: %{header_X-RateLimit-Remaining}\\n"

# Get rate limit info
curl -X GET "$BASE_URL/rate-limit" \\
  -H "Authorization: Bearer your_access_token"`,
  };

  const statusCodes = [
    {
      code: 200,
      message: "OK",
      description: "Request thành công",
      color: "text-green-600",
    },
    {
      code: 201,
      message: "Created",
      description: "Tạo resource thành công",
      color: "text-green-600",
    },
    {
      code: 400,
      message: "Bad Request",
      description: "Tham số request không hợp lệ",
      color: "text-orange-600",
    },
    {
      code: 401,
      message: "Unauthorized",
      description: "Yêu cầu xác thực",
      color: "text-red-600",
    },
    {
      code: 403,
      message: "Forbidden",
      description: "Không đủ quyền truy cập",
      color: "text-red-600",
    },
    {
      code: 404,
      message: "Not Found",
      description: "Không tìm thấy resource",
      color: "text-orange-600",
    },
    {
      code: 422,
      message: "Unprocessable Entity",
      description: "Lỗi validation",
      color: "text-orange-600",
    },
    {
      code: 429,
      message: "Too Many Requests",
      description: "Vượt rate limit",
      color: "text-red-600",
    },
    {
      code: 500,
      message: "Internal Server Error",
      description: "Lỗi server",
      color: "text-red-600",
    },
    {
      code: 503,
      message: "Service Unavailable",
      description: "Dịch vụ tạm thời không khả dụng",
      color: "text-red-600",
    },
  ];

  const rateLimits = [
    {
      tier: "Free",
      requests: "1,000/tháng",
      price: "Miễn phí",
      features: ["Basic endpoints", "Email support", "Community access"],
      limits: { hour: "100", month: "1,000", concurrent: "5" },
    },
    {
      tier: "Developer",
      requests: "50,000/tháng",
      price: "$19/tháng",
      popular: true,
      features: [
        "All endpoints",
        "Webhooks",
        "Priority support",
        "Analytics dashboard",
      ],
      limits: { hour: "2,500", month: "50,000", concurrent: "20" },
    },
    {
      tier: "Business",
      requests: "200,000/tháng",
      price: "$49/tháng",
      features: [
        "Everything in Developer",
        "Custom integrations",
        "SLA guarantee",
        "Dedicated support",
      ],
      limits: { hour: "10,000", month: "200,000", concurrent: "50" },
    },
    {
      tier: "Enterprise",
      requests: "Unlimited",
      price: "Liên hệ",
      features: [
        "Everything in Business",
        "On-premise deployment",
        "Custom SLA",
        "24/7 phone support",
      ],
      limits: {
        hour: "Unlimited",
        month: "Unlimited",
        concurrent: "Unlimited",
      },
    },
  ];

  const faqs = [
    {
      question: "Làm sao để lấy API key?",
      answer:
        "Đăng nhập vào dashboard tại https://dashboard.templatemarket.com, vào phần Settings > API Keys, sau đó click 'Generate New Key'. Lưu key an toàn vì nó chỉ hiển thị một lần duy nhất. Bạn có thể tạo nhiều keys và revoke bất cứ lúc nào.",
    },
    {
      question: "Rate limit là bao nhiêu?",
      answer:
        "Mỗi tier có rate limit khác nhau: Free tier: 100 requests/giờ, Developer: 2,500 requests/giờ, Business: 10,000 requests/giờ, Enterprise: Unlimited. Headers trả về bao gồm X-RateLimit-Remaining và X-RateLimit-Reset để bạn track usage.",
    },
    {
      question: "API có hỗ trợ webhooks không?",
      answer:
        "Có, từ Developer tier trở lên bạn có thể set up webhooks để nhận thông báo real-time về các events như: new_purchase, download_complete, payment_failed, refund_processed. Configure webhooks trong dashboard Settings.",
    },
    {
      question: "Làm sao để test API?",
      answer:
        "Bạn có thể sử dụng API tester ngay trên trang này, hoặc dùng công cụ như Postman, Insomnia, HTTPie. Chúng tôi cũng cung cấp Sandbox environment tại https://sandbox-api.templatemarket.com để test mà không ảnh hưởng production data.",
    },
    {
      question: "Token expires sau bao lâu?",
      answer:
        "Access token có thời hạn 1 giờ, Refresh token có thời hạn 30 ngày. Bạn nên implement auto-refresh logic trong app để maintain session. Response sẽ trả về expires_in field để bạn biết thời gian còn lại.",
    },
    {
      question: "API có support CORS không?",
      answer:
        "Có, API support CORS cho tất cả origins được whitelist trong dashboard settings. Bạn có thể thêm multiple domains. Headers CORS bao gồm Access-Control-Allow-Origin, Access-Control-Allow-Methods, Access-Control-Allow-Headers.",
    },
    {
      question: "Làm sao để handle errors?",
      answer:
        "Tất cả errors trả về format chuẩn với structure: {success: false, error: {code, message, details}}. HTTP status codes tuân theo chuẩn RESTful. Check status code và parse error object để handle appropriately trong app.",
    },
    {
      question: "API có versioning không?",
      answer:
        "Có, hiện tại đang ở v1. URL pattern: /api/v1/... Khi có breaking changes, chúng tôi sẽ release v2 và maintain v1 ít nhất 12 tháng. Bạn sẽ nhận email notification trước khi có major version changes.",
    },
  ];

  const copyToClipboard = useCallback((code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    toast({
      title: "Đã copy!",
      description: "Code đã được copy vào clipboard",
    });
    setTimeout(() => setCopiedCode(null), 2000);
  }, []);

  const handleTestAPI = useCallback(async () => {
    if (!testApiKey || !testEndpoint) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập API key và endpoint",
        variant: "destructive",
      });
      return;
    }

    setIsTestLoading(true);
    setTestResponse("Đang gửi request...");

    // Simulate API call
    setTimeout(() => {
      setTestResponse(`{
  "success": true,
  "message": "Test thành công",
  "timestamp": "${new Date().toISOString()}",
  "endpoint": "${testEndpoint}",
  "rate_limit": {
    "remaining": 999,
    "limit": 1000,
    "reset_at": "${new Date(Date.now() + 3600000).toISOString()}"
  },
  "response_time": "87ms"
}`);
      setIsTestLoading(false);
      toast({ title: "Thành công!", description: "API test hoàn tất" });
    }, 1500);
  }, [testApiKey, testEndpoint]);

  const ReadingProgress = () => (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
      <motion.div
        className={`h-full bg-gradient-to-r ${softPinkTheme.primaryGradient}`}
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );

  const FloatingNav = () => (
    <AnimatePresence>
      {showFloatingNav && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-8 right-8 z-40"
        >
          <Button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className={`bg-gradient-to-r ${softPinkTheme.primaryGradient} text-white w-12 h-12 rounded-full`}
          >
            <ArrowUp className="w-5 h-5" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <Helmet>
        <title>
          API Documentation | Template Market - RESTful API cho Developers
        </title>
        <meta
          name="description"
          content="Tài liệu API đầy đủ của Template Market. RESTful API, authentication, endpoints, code examples JavaScript/Python/cURL, webhooks, rate limits."
        />
        <meta
          name="keywords"
          content="api documentation, rest api, template market api, developer docs, authentication, webhooks"
        />
        <link rel="canonical" href="https://templatemarket.com/api" />
      </Helmet>

      <ReadingProgress />
      <FloatingNav />

      <div
        className={`min-h-screen bg-gradient-to-br ${softPinkTheme.pageBackground} overflow-hidden relative`}
      >
        <div className="fixed inset-0 z-0">
          <StarBackgroundPattern />
        </div>
        <FloatingIcons />

        {/* HERO */}
        <motion.section
          className="relative py-20 lg:py-32 overflow-hidden z-10"
          style={{ y: headerY, opacity: headerOpacity }}
        >
          <div className="container relative z-10 px-4 mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-5xl mx-auto"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className={`flex items-center justify-center w-28 h-28 mx-auto mb-8 bg-gradient-to-r ${softPinkTheme.primaryGradient} rounded-3xl ${softPinkTheme.glow}`}
              >
                <Code className="w-14 h-14 text-white" />
              </motion.div>

              <h1 className="mb-8 text-5xl lg:text-7xl font-bold">
                <span
                  className={`text-transparent bg-gradient-to-r ${softPinkTheme.heroText} bg-clip-text`}
                >
                  API Documentation
                </span>
                <br />
                <span className="text-2xl lg:text-3xl font-medium text-gray-700">
                  RESTful API cho developers
                </span>
              </h1>

              <p className="mb-12 text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto">
                Tích hợp mạnh mẽ với Template Market API - Đơn giản, nhanh chóng
                và đáng tin cậy
              </p>

              {/* BADGES */}
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <Badge
                  className={`px-6 py-3 text-base bg-gradient-to-r ${softPinkTheme.primaryGradient} text-white border-0`}
                >
                  <Zap className="w-5 h-5 mr-2" />
                  RESTful API
                </Badge>
                <Badge
                  className={`px-6 py-3 text-base bg-gradient-to-r ${softPinkTheme.secondaryGradient} text-white border-0`}
                >
                  <Shield className="w-5 h-5 mr-2" />
                  Secure OAuth2
                </Badge>
                <Badge className="px-6 py-3 text-base bg-white/40 backdrop-blur-md border border-white/60">
                  <BookOpen className="w-5 h-5 mr-2 text-red-600" />
                  <span className="font-semibold text-gray-800">Full Docs</span>
                </Badge>
              </div>

              {/* STATS */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    whileHover={{ y: -10, scale: 1.05 }}
                    className="bg-white/60 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/60"
                  >
                    <stat.icon
                      className={`w-8 h-8 mx-auto mb-3 ${stat.color}`}
                    />
                    <div
                      className={`text-3xl font-bold mb-2 text-transparent bg-gradient-to-r ${softPinkTheme.heroText} bg-clip-text`}
                    >
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* MAIN CONTENT */}
        <div className="container relative z-10 px-4 mx-auto max-w-7xl pb-20">
          {/* API FEATURES */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-800">
                Tính năng API
              </h2>
              <p className="text-xl text-gray-600">
                Những gì làm API của chúng tôi đặc biệt
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {apiFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.03 }}
                >
                  <Card className="h-full bg-white/60 backdrop-blur-xl border border-white/60 shadow-lg">
                    <CardContent className="p-6">
                      <div className="w-14 h-14 rounded-xl bg-pink-100 flex items-center justify-center mb-4">
                        <feature.icon className="w-7 h-7 text-pink-600" />
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-gray-800">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {feature.description}
                      </p>
                      <div className="space-y-2">
                        {feature.features.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <span className="text-sm text-gray-700">
                              {item}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* QUICK START */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <Card className="bg-white/60 backdrop-blur-xl border border-white/60 shadow-lg">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                  <Rocket className="w-8 h-8 text-pink-600" />
                  Quick Start
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Bắt đầu với API trong 5 phút
                </p>
              </CardHeader>
              <CardContent>
                <Tabs
                  defaultValue="javascript"
                  className="w-full"
                  onValueChange={setSelectedLanguage}
                >
                  <TabsList className="grid w-full grid-cols-3 bg-pink-100/50">
                    <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                    <TabsTrigger value="python">Python</TabsTrigger>
                    <TabsTrigger value="curl">cURL</TabsTrigger>
                  </TabsList>
                  {Object.entries(codeExamples).map(([lang, code]) => (
                    <TabsContent key={lang} value={lang}>
                      <div className="relative">
                        <pre className="bg-gray-900 text-gray-100 p-6 rounded-xl overflow-x-auto max-h-96">
                          <code className="text-sm">{code}</code>
                        </pre>
                        <Button
                          size="sm"
                          onClick={() =>
                            copyToClipboard(code, `quickstart-${lang}`)
                          }
                          className="absolute top-4 right-4 bg-white/20 hover:bg-white/30"
                        >
                          {copiedCode === `quickstart-${lang}` ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </motion.section>

          {/* ENDPOINTS */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-800">
                API Endpoints
              </h2>
              <p className="text-xl text-gray-600">
                Tất cả endpoints có sẵn với documentation đầy đủ
              </p>
            </div>

            <Tabs
              defaultValue="auth"
              className="w-full"
              onValueChange={setSelectedEndpoint}
            >
              <TabsList className="grid w-full grid-cols-4 bg-pink-100/50 mb-8">
                {endpoints.map((endpoint) => (
                  <TabsTrigger
                    key={endpoint.id}
                    value={endpoint.id}
                    className="flex items-center gap-2"
                  >
                    <endpoint.icon className="w-4 h-4" />
                    {endpoint.category}
                  </TabsTrigger>
                ))}
              </TabsList>

              {endpoints.map((endpoint) => (
                <TabsContent key={endpoint.id} value={endpoint.id}>
                  <div className="space-y-6">
                    {endpoint.methods.map((method, idx) => (
                      <Card
                        key={idx}
                        className="bg-white/60 backdrop-blur-xl border border-white/60 shadow-lg"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <Badge
                                  className={`${method.method === "GET" ? "bg-green-500" : method.method === "POST" ? "bg-blue-500" : method.method === "PUT" ? "bg-orange-500" : "bg-red-500"} text-white`}
                                >
                                  {method.method}
                                </Badge>
                                <code className="text-lg font-mono text-gray-800">
                                  {method.path}
                                </code>
                              </div>
                              <h3 className="text-xl font-bold text-gray-800 mb-2">
                                {method.title}
                              </h3>
                              <p className="text-gray-600">
                                {method.description}
                              </p>
                            </div>
                          </div>

                          <Separator className="my-6" />

                          <Accordion
                            type="single"
                            collapsible
                            className="space-y-4"
                          >
                            <AccordionItem
                              value="headers"
                              className="border border-pink-200 rounded-xl px-6"
                            >
                              <AccordionTrigger>Headers</AccordionTrigger>
                              <AccordionContent>
                                <div className="space-y-2">
                                  {method.headers.map((header, hidx) => (
                                    <div
                                      key={hidx}
                                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                                    >
                                      <code className="font-mono text-sm text-pink-600">
                                        {header.name}
                                      </code>
                                      <span className="text-gray-400">:</span>
                                      <code className="font-mono text-sm text-gray-700">
                                        {header.value}
                                      </code>
                                      {header.required && (
                                        <Badge className="bg-red-100 text-red-700 text-xs">
                                          Bắt buộc
                                        </Badge>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>

                            <AccordionItem
                              value="params"
                              className="border border-pink-200 rounded-xl px-6"
                            >
                              <AccordionTrigger>Parameters</AccordionTrigger>
                              <AccordionContent>
                                <div className="space-y-2">
                                  {method.params.map((param, pidx) => (
                                    <div
                                      key={pidx}
                                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                                    >
                                      <code className="font-mono text-sm text-pink-600">
                                        {param.name}
                                      </code>
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {param.type}
                                      </Badge>
                                      {param.required && (
                                        <Badge className="bg-red-100 text-red-700 text-xs">
                                          Bắt buộc
                                        </Badge>
                                      )}
                                      <span className="text-sm text-gray-600 flex-1">
                                        {param.description}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>

                            {method.requestBody && (
                              <AccordionItem
                                value="request"
                                className="border border-pink-200 rounded-xl px-6"
                              >
                                <AccordionTrigger>
                                  Request Body
                                </AccordionTrigger>
                                <AccordionContent>
                                  <div className="relative">
                                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto text-sm">
                                      <code>{method.requestBody}</code>
                                    </pre>
                                    <Button
                                      size="sm"
                                      onClick={() =>
                                        copyToClipboard(
                                          method.requestBody!,
                                          `request-${idx}`,
                                        )
                                      }
                                      className="absolute top-2 right-2 bg-white/20 hover:bg-white/30"
                                    >
                                      {copiedCode === `request-${idx}` ? (
                                        <CheckCircle className="w-4 h-4" />
                                      ) : (
                                        <Copy className="w-4 h-4" />
                                      )}
                                    </Button>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            )}

                            <AccordionItem
                              value="response"
                              className="border border-pink-200 rounded-xl px-6"
                            >
                              <AccordionTrigger>Response</AccordionTrigger>
                              <AccordionContent>
                                <div className="relative">
                                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto text-sm max-h-96">
                                    <code>{method.response}</code>
                                  </pre>
                                  <Button
                                    size="sm"
                                    onClick={() =>
                                      copyToClipboard(
                                        method.response,
                                        `response-${idx}`,
                                      )
                                    }
                                    className="absolute top-2 right-2 bg-white/20 hover:bg-white/30"
                                  >
                                    {copiedCode === `response-${idx}` ? (
                                      <CheckCircle className="w-4 h-4" />
                                    ) : (
                                      <Copy className="w-4 h-4" />
                                    )}
                                  </Button>
                                </div>
                              </AccordionContent>
                            </AccordionItem>

                            <AccordionItem
                              value="errors"
                              className="border border-pink-200 rounded-xl px-6"
                            >
                              <AccordionTrigger>Errors</AccordionTrigger>
                              <AccordionContent>
                                <div className="space-y-2">
                                  {method.errors.map((error, eidx) => (
                                    <div
                                      key={eidx}
                                      className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200"
                                    >
                                      <Badge className="bg-red-500 text-white">
                                        {error.code}
                                      </Badge>
                                      <div className="flex-1">
                                        <div className="font-semibold text-red-800">
                                          {error.message}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                          {error.description}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </motion.section>

          {/* API TESTER */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <Card className="bg-white/60 backdrop-blur-xl border border-white/60 shadow-lg">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                  <PlayCircle className="w-8 h-8 text-pink-600" />
                  API Tester
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Test API trực tiếp từ browser
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="api-key">API Key</Label>
                  <Input
                    id="api-key"
                    type="password"
                    placeholder="Nhập API key của bạn"
                    value={testApiKey}
                    onChange={(e) => setTestApiKey(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="endpoint">Endpoint</Label>
                  <Input
                    id="endpoint"
                    placeholder="/api/v1/products"
                    value={testEndpoint}
                    onChange={(e) => setTestEndpoint(e.target.value)}
                  />
                </div>

                <Button
                  onClick={handleTestAPI}
                  disabled={isTestLoading}
                  className={`w-full bg-gradient-to-r ${softPinkTheme.primaryGradient} text-white`}
                >
                  {isTestLoading ? (
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <PlayCircle className="w-5 h-5 mr-2" />
                  )}
                  Test API
                </Button>

                {testResponse && (
                  <div>
                    <Label>Response:</Label>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto text-sm mt-2">
                      <code>{testResponse}</code>
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.section>

          {/* STATUS CODES */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <Card className="bg-white/60 backdrop-blur-xl border border-white/60 shadow-lg">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-gray-800">
                  HTTP Status Codes
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Các mã trạng thái HTTP được sử dụng
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {statusCodes.map((status, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <Badge
                        className={`${status.color} bg-gray-100 border border-gray-300`}
                      >
                        {status.code}
                      </Badge>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">
                          {status.message}
                        </div>
                        <div className="text-sm text-gray-600">
                          {status.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* RATE LIMITS */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <Card className="bg-white/60 backdrop-blur-xl border border-white/60 shadow-lg">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-gray-800">
                  Rate Limits & Pricing
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Chọn plan phù hợp với nhu cầu của bạn
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {rateLimits.map((limit, index) => (
                    <div
                      key={index}
                      className={`p-6 rounded-xl border-2 ${limit.popular ? "border-pink-500 bg-pink-50/50" : "border-gray-200 bg-white/50"} relative`}
                    >
                      {limit.popular && (
                        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-pink-500 text-white">
                          Phổ biến nhất
                        </Badge>
                      )}
                      <div className="text-center mb-6">
                        <h3 className="text-2xl font-bold mb-2">
                          {limit.tier}
                        </h3>
                        <div className="text-3xl font-bold text-pink-600 mb-2">
                          {limit.price}
                        </div>
                        <div className="text-sm text-gray-600">
                          {limit.requests}
                        </div>
                      </div>
                      <div className="space-y-3 mb-6">
                        {limit.features.map((feature, fidx) => (
                          <div key={fidx} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <span className="text-sm text-gray-700">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Requests/giờ:</span>
                          <span className="font-semibold">
                            {limit.limits.hour}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Requests/tháng:</span>
                          <span className="font-semibold">
                            {limit.limits.month}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Concurrent:</span>
                          <span className="font-semibold">
                            {limit.limits.concurrent}
                          </span>
                        </div>
                      </div>
                      <Button
                        className={`w-full mt-6 ${limit.popular ? `bg-gradient-to-r ${softPinkTheme.primaryGradient} text-white` : "bg-gray-200 text-gray-800"}`}
                      >
                        {limit.tier === "Free"
                          ? "Bắt đầu miễn phí"
                          : limit.tier === "Enterprise"
                            ? "Liên hệ sales"
                            : "Nâng cấp"}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* FAQ */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="bg-white/60 backdrop-blur-xl border border-white/60 shadow-lg">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-gray-800">
                  FAQ
                </CardTitle>
                <p className="text-gray-600 mt-2">Câu hỏi thường gặp về API</p>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="space-y-4">
                  {faqs.map((faq, index) => (
                    <AccordionItem
                      key={index}
                      value={`faq-${index}`}
                      className="border border-pink-200 rounded-xl px-6"
                    >
                      <AccordionTrigger className="text-left hover:no-underline py-6">
                        <span className="text-lg font-semibold text-gray-800">
                          {faq.question}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="pb-6">
                        <p className="text-gray-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </motion.section>
        </div>
      </div>
    </>
  );
};

export default API;
