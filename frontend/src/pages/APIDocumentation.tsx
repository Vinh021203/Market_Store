import React, { useState, useEffect } from "react";
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
  Filter,
  ChevronRight,
  Star,
  ThumbsUp,
  Eye,
  Activity,
  Cpu,
  Server,
  Monitor,
  Smartphone,
  Layers,
  Package,
  Webhook,
  Bug,
  Info,
  HelpCircle,
  MessageSquare,
  Plus,
  Minus,
  ArrowRight,
  CheckIcon,
  XIcon,
  AlertCircleIcon,
  Lightbulb,
  Target,
  Award,
  Rocket,
  RefreshCw,
  Send,
  Edit,
  Trash2,
  Upload,
  Calendar,
  TrendingUp,
  BarChart3,
  PieChart,
  Volume2,
  VolumeX,
  MousePointer,
  Fingerprint,
  CreditCard,
  ShoppingCart,
  UserPlus,
  UserMinus,
  LogIn,
  LogOut,
  Home,
  Archive,
  Folder,
  File,
  Image,
  Video,
  Music,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const APIDocumentation: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState("auth");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [activeSection, setActiveSection] = useState("overview");
  const [testRequestBody, setTestRequestBody] = useState("");
  const [testResponse, setTestResponse] = useState("");
  const [isTestLoading, setIsTestLoading] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [showFeedbackSuccess, setShowFeedbackSuccess] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const stats = [
    {
      icon: Activity,
      value: "99.9%",
      label: "Uptime",
      color: "text-green-600",
    },
    {
      icon: Zap,
      value: "<200ms",
      label: "Response Time",
      color: "text-blue-600",
    },
    {
      icon: Users,
      value: "50K+",
      label: "Developers",
      color: "text-purple-600",
    },
    {
      icon: Globe,
      value: "195+",
      label: "Countries",
      color: "text-orange-600",
    },
  ];

  const apiFeatures = [
    {
      icon: Shield,
      title: "🔐 Bảo mật cao cấp",
      description:
        "JWT Authentication, OAuth 2.0, API key với rate limiting thông minh",
      color: "from-green-500 to-emerald-400",
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
      title: "⚡ Hiệu suất vượt trội",
      description:
        "Response time < 200ms, uptime 99.9%, CDN global, auto-scaling",
      color: "from-blue-500 to-cyan-400",
      features: [
        "Global CDN",
        "Auto-scaling",
        "Caching",
        "Load Balancing",
        "Monitoring 24/7",
      ],
    },
    {
      icon: Globe,
      title: "🌍 RESTful chuẩn",
      description:
        "Tuân thủ chuẩn REST, HTTP methods, status codes, pagination",
      color: "from-purple-500 to-pink-400",
      features: [
        "REST Standards",
        "HTTP Methods",
        "Status Codes",
        "Pagination",
        "Filtering",
      ],
    },
    {
      icon: Database,
      title: "📊 Real-time data",
      description:
        "WebSocket connections, live updates, event streaming, push notifications",
      color: "from-orange-500 to-red-400",
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
      category: "🔐 Authentication",
      icon: Lock,
      color: "text-green-600",
      description: "User authentication, registration, token management",
      endpoints: [
        {
          method: "POST",
          path: "/api/v1/auth/login",
          title: "User Login",
          description: "Đăng nhập và lấy access token với refresh token",
          params: [
            {
              name: "email",
              type: "string",
              required: true,
              description: "User email address",
            },
            {
              name: "password",
              type: "string",
              required: true,
              description: "User password (min 8 chars)",
            },
          ],
          headers: [
            { name: "Content-Type", value: "application/json", required: true },
            { name: "X-API-Key", value: "your-api-key", required: true },
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
      "name": "John Doe",
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
              description: "Invalid email or password format",
            },
            {
              code: 401,
              message: "Unauthorized",
              description: "Invalid credentials",
            },
            {
              code: 429,
              message: "Too Many Requests",
              description: "Rate limit exceeded",
            },
          ],
          examples: [
            {
              title: "Successful Login",
              request: `curl -X POST https://api.templatemarket.com/v1/auth/login \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: your-api-key" \\
  -d '{"email": "user@example.com", "password": "password123"}'`,
            },
          ],
        },
        {
          method: "POST",
          path: "/api/v1/auth/register",
          title: "User Registration",
          description: "Đăng ký tài khoản mới với xác thực email",
          params: [
            {
              name: "email",
              type: "string",
              required: true,
              description: "Valid email address",
            },
            {
              name: "password",
              type: "string",
              required: true,
              description: "Password (min 8 chars, 1 uppercase, 1 number)",
            },
            {
              name: "name",
              type: "string",
              required: true,
              description: "Full name (min 2 chars)",
            },
            {
              name: "phone",
              type: "string",
              required: false,
              description: "Phone number with country code",
            },
          ],
          headers: [
            { name: "Content-Type", value: "application/json", required: true },
            { name: "X-API-Key", value: "your-api-key", required: true },
          ],
          requestBody: `{
  "email": "newuser@example.com",
  "password": "SecurePass123!",
  "name": "Jane Doe",
  "phone": "+84971386588"
}`,
          response: `{
  "success": true,
  "message": "User created successfully. Please check your email for verification.",
  "data": {
    "user": {
      "id": 12346,
      "email": "newuser@example.com",
      "name": "Jane Doe",
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
              description: "Invalid input data or email already exists",
            },
            {
              code: 422,
              message: "Unprocessable Entity",
              description: "Validation failed",
            },
          ],
          examples: [
            {
              title: "User Registration",
              request: `curl -X POST https://api.templatemarket.com/v1/auth/register \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: your-api-key" \\
  -d '{"email": "user@example.com", "password": "Pass123!", "name": "John Doe"}'`,
            },
          ],
        },
        {
          method: "POST",
          path: "/api/v1/auth/refresh",
          title: "Refresh Token",
          description: "Làm mới access token bằng refresh token",
          params: [
            {
              name: "refresh_token",
              type: "string",
              required: true,
              description: "Valid refresh token",
            },
          ],
          headers: [
            { name: "Content-Type", value: "application/json", required: true },
            {
              name: "Authorization",
              value: "Bearer refresh-token",
              required: true,
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
              description: "Invalid or expired refresh token",
            },
          ],
          examples: [
            {
              title: "Refresh Token",
              request: `curl -X POST https://api.templatemarket.com/v1/auth/refresh \\
  -H "Authorization: Bearer refresh-token" \\
  -d '{"refresh_token": "your-refresh-token"}'`,
            },
          ],
        },
      ],
    },
    {
      id: "products",
      category: "📦 Products",
      icon: Database,
      color: "text-blue-600",
      description: "Product management, search, categories, reviews",
      endpoints: [
        {
          method: "GET",
          path: "/api/v1/products",
          title: "Get Products List",
          description: "Lấy danh sách sản phẩm với phân trang và filter",
          params: [
            {
              name: "page",
              type: "integer",
              required: false,
              description: "Page number (default: 1)",
            },
            {
              name: "limit",
              type: "integer",
              required: false,
              description: "Items per page (default: 20, max: 100)",
            },
            {
              name: "category",
              type: "string",
              required: false,
              description: "Filter by category slug",
            },
            {
              name: "search",
              type: "string",
              required: false,
              description: "Search in name and description",
            },
            {
              name: "sort",
              type: "string",
              required: false,
              description: "Sort by: name, price, created_at, popularity",
            },
            {
              name: "order",
              type: "string",
              required: false,
              description: "Order: asc, desc (default: desc)",
            },
            {
              name: "price_min",
              type: "number",
              required: false,
              description: "Minimum price filter",
            },
            {
              name: "price_max",
              type: "number",
              required: false,
              description: "Maximum price filter",
            },
          ],
          headers: [
            {
              name: "Authorization",
              value: "Bearer your-token",
              required: true,
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
        {"id": 2, "name": "Vue Templates", "count": 32}
      ],
      "price_range": {"min": 9.99, "max": 199.99}
    }
  }
}`,
          errors: [
            {
              code: 400,
              message: "Bad Request",
              description: "Invalid query parameters",
            },
            {
              code: 401,
              message: "Unauthorized",
              description: "Missing or invalid token",
            },
          ],
          examples: [
            {
              title: "Get Products with Filters",
              request: `curl -X GET "https://api.templatemarket.com/v1/products?page=1&limit=10&category=react&sort=popularity" \\
  -H "Authorization: Bearer your-token"`,
            },
          ],
        },
        {
          method: "GET",
          path: "/api/v1/products/{id}",
          title: "Get Product Details",
          description: "Lấy chi tiết sản phẩm theo ID",
          params: [
            {
              name: "id",
              type: "integer",
              required: true,
              description: "Product ID",
            },
          ],
          headers: [
            {
              name: "Authorization",
              value: "Bearer your-token",
              required: true,
            },
          ],
          response: `{
  "success": true,
  "data": {
    "id": 1,
    "name": "Premium React Dashboard",
    "slug": "premium-react-dashboard",
    "description": "A comprehensive React admin dashboard template...",
    "long_description": "This premium React dashboard template includes...",
    "price": 49.99,
    "original_price": 79.99,
    "currency": "USD",
    "category": {
      "id": 5,
      "name": "React Templates",
      "slug": "react-templates"
    },
    "author": {
      "id": 100,
      "name": "Template Studio",
      "avatar": "https://cdn.templatemarket.com/avatars/author-100.jpg"
    },
    "tags": ["react", "dashboard", "admin", "responsive"],
    "images": [
      "https://cdn.templatemarket.com/images/product-1-1.jpg",
      "https://cdn.templatemarket.com/images/product-1-2.jpg"
    ],
    "files": [
      {"name": "source.zip", "size": "25.4 MB", "type": "application/zip"}
    ],
    "features": [
      "Responsive design",
      "Dark/Light theme",
      "30+ components",
      "TypeScript support"
    ],
    "requirements": {
      "node": ">=14.0.0",
      "react": ">=17.0.0"
    },
    "downloads": 15420,
    "rating": 4.8,
    "reviews_count": 234,
    "created_at": "2024-01-10T08:30:00Z",
    "updated_at": "2024-01-15T14:20:00Z"
  }
}`,
          errors: [
            {
              code: 404,
              message: "Not Found",
              description: "Product not found",
            },
            {
              code: 401,
              message: "Unauthorized",
              description: "Missing or invalid token",
            },
          ],
          examples: [
            {
              title: "Get Product by ID",
              request: `curl -X GET https://api.templatemarket.com/v1/products/123 \\
  -H "Authorization: Bearer your-token"`,
            },
          ],
        },
      ],
    },
    {
      id: "orders",
      category: "🛒 Orders",
      icon: ShoppingCart,
      color: "text-purple-600",
      description: "Order management, purchases, downloads",
      endpoints: [
        {
          method: "GET",
          path: "/api/v1/orders",
          title: "Get Orders",
          description: "Lấy danh sách đơn hàng của user",
          params: [
            {
              name: "page",
              type: "integer",
              required: false,
              description: "Page number",
            },
            {
              name: "limit",
              type: "integer",
              required: false,
              description: "Items per page",
            },
            {
              name: "status",
              type: "string",
              required: false,
              description: "Filter by status: pending, completed, failed",
            },
          ],
          headers: [
            {
              name: "Authorization",
              value: "Bearer your-token",
              required: true,
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
            "quantity": 1
          }
        ],
        "payment_method": "stripe",
        "created_at": "2024-01-15T10:30:00Z",
        "completed_at": "2024-01-15T10:31:15Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total": 25
    }
  }
}`,
          errors: [
            {
              code: 401,
              message: "Unauthorized",
              description: "Missing or invalid token",
            },
          ],
          examples: [
            {
              title: "Get User Orders",
              request: `curl -X GET "https://api.templatemarket.com/v1/orders?status=completed" \\
  -H "Authorization: Bearer your-token"`,
            },
          ],
        },
        {
          method: "POST",
          path: "/api/v1/orders",
          title: "Create Order",
          description: "Tạo đơn hàng mới",
          params: [
            {
              name: "products",
              type: "array",
              required: true,
              description: "Array of product IDs and quantities",
            },
            {
              name: "payment_method",
              type: "string",
              required: true,
              description: "Payment method: stripe, paypal, crypto",
            },
          ],
          headers: [
            {
              name: "Authorization",
              value: "Bearer your-token",
              required: true,
            },
            { name: "Content-Type", value: "application/json", required: true },
          ],
          requestBody: `{
  "products": [
    {"id": 1, "quantity": 1},
    {"id": 5, "quantity": 2}
  ],
  "payment_method": "stripe",
  "billing_info": {
    "name": "John Doe",
    "email": "john@example.com",
    "address": "123 Main St",
    "city": "New York",
    "country": "US"
  }
}`,
          response: `{
  "success": true,
  "data": {
    "order_id": "ORD-2024-001235",
    "total": 149.97,
    "currency": "USD",
    "payment_url": "https://checkout.stripe.com/pay/cs_test_...",
    "expires_at": "2024-01-15T11:30:00Z"
  }
}`,
          errors: [
            {
              code: 400,
              message: "Bad Request",
              description: "Invalid product IDs or quantities",
            },
            {
              code: 401,
              message: "Unauthorized",
              description: "Missing or invalid token",
            },
          ],
          examples: [
            {
              title: "Create New Order",
              request: `curl -X POST https://api.templatemarket.com/v1/orders \\
  -H "Authorization: Bearer your-token" \\
  -H "Content-Type: application/json" \\
  -d '{"products": [{"id": 1, "quantity": 1}], "payment_method": "stripe"}'`,
            },
          ],
        },
      ],
    },
    {
      id: "users",
      category: "👤 Users",
      icon: Users,
      color: "text-orange-600",
      description: "User profile, settings, preferences",
      endpoints: [
        {
          method: "GET",
          path: "/api/v1/users/profile",
          title: "Get Profile",
          description: "Lấy thông tin profile của user hiện tại",
          params: [],
          headers: [
            {
              name: "Authorization",
              value: "Bearer your-token",
              required: true,
            },
          ],
          response: `{
  "success": true,
  "data": {
    "id": 12345,
    "email": "user@example.com",
    "name": "John Doe",
    "avatar": "https://cdn.templatemarket.com/avatars/12345.jpg",
    "phone": "+84971386588",
    "role": "user",
    "verified": true,
    "preferences": {
      "newsletter": true,
      "notifications": true,
      "theme": "dark"
    },
    "stats": {
      "purchases": 15,
      "downloads": 45,
      "reviews": 8
    },
    "created_at": "2023-06-15T09:20:00Z",
    "last_login": "2024-01-15T10:30:00Z"
  }
}`,
          errors: [
            {
              code: 401,
              message: "Unauthorized",
              description: "Missing or invalid token",
            },
          ],
          examples: [
            {
              title: "Get User Profile",
              request: `curl -X GET https://api.templatemarket.com/v1/users/profile \\
  -H "Authorization: Bearer your-token"`,
            },
          ],
        },
        {
          method: "PUT",
          path: "/api/v1/users/profile",
          title: "Update Profile",
          description: "Cập nhật thông tin profile",
          params: [
            {
              name: "name",
              type: "string",
              required: false,
              description: "Full name",
            },
            {
              name: "phone",
              type: "string",
              required: false,
              description: "Phone number",
            },
            {
              name: "preferences",
              type: "object",
              required: false,
              description: "User preferences",
            },
          ],
          headers: [
            {
              name: "Authorization",
              value: "Bearer your-token",
              required: true,
            },
            { name: "Content-Type", value: "application/json", required: true },
          ],
          requestBody: `{
  "name": "John Smith",
  "phone": "+84971386588",
  "preferences": {
    "newsletter": false,
    "notifications": true,
    "theme": "light"
  }
}`,
          response: `{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": 12345,
    "email": "user@example.com",
    "name": "John Smith",
    "phone": "+84971386588",
    "preferences": {
      "newsletter": false,
      "notifications": true,
      "theme": "light"
    },
    "updated_at": "2024-01-15T14:30:00Z"
  }
}`,
          errors: [
            {
              code: 400,
              message: "Bad Request",
              description: "Invalid input data",
            },
            {
              code: 401,
              message: "Unauthorized",
              description: "Missing or invalid token",
            },
          ],
          examples: [
            {
              title: "Update User Profile",
              request: `curl -X PUT https://api.templatemarket.com/v1/users/profile \\
  -H "Authorization: Bearer your-token" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "John Smith", "phone": "+84971386588"}'`,
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

  // Helper method for making requests
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

    const config = {
      headers,
      ...options
    };

    try {
      const response = await fetch(url, config);
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

  // Products
  async getProducts(params = {}) {
    const queryParams = new URLSearchParams(params);
    return await this.makeRequest(\`/products?\${queryParams}\`);
  }

  async getProduct(id) {
    return await this.makeRequest(\`/products/\${id}\`);
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

  // User Profile
  async getProfile() {
    return await this.makeRequest('/users/profile');
  }

  async updateProfile(data) {
    return await this.makeRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }
}

// Usage Example
const api = new TemplateMarketAPI('your-api-key');

// Login and get products
async function example() {
  try {
    await api.login('user@example.com', 'password123');
    const products = await api.getProducts({ category: 'react', limit: 10 });
    console.log('Products:', products.data.products);
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
    
    def _make_request(self, method: str, endpoint: str, data: Dict = None, params: Dict = None) -> Dict:
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
    def create_order(self, products: List[Dict], payment_method: str) -> Dict:
        """Create new order"""
        return self._make_request('POST', '/orders', {
            'products': products,
            'payment_method': payment_method
        })
    
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
        
        # Get products
        products = api.get_products(category='react', limit=10, sort='popularity')
        print(f"Found {products['data']['pagination']['total']} products")
        
        # Search products
        search_results = api.search_products('dashboard', category='react')
        print(f"Search found {len(search_results['data']['products'])} results")
        
        # Get user profile
        profile = api.get_profile()
        print(f"User: {profile['data']['name']} ({profile['data']['email']})")
        
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
    "name": "John Doe"
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

# Get product with reviews
curl -X GET "$BASE_URL/products/123?include=reviews,author,files" \\
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
      "name": "John Doe",
      "email": "john@example.com",
      "address": "123 Main St",
      "city": "New York",
      "country": "US"
    }
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
    "name": "John Smith",
    "phone": "+1234567890",
    "preferences": {
      "newsletter": true,
      "notifications": false,
      "theme": "dark"
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
  -d '{"email": "user@example.com", "password": "wrong_password"}' \\
  -w "HTTP Status: %{http_code}\\nRate Limit Remaining: %{header_X-RateLimit-Remaining}\\n"`,
  };

  const rateLimits = [
    {
      tier: "Free",
      requests: "1,000/month",
      features: ["Basic endpoints", "Email support", "Community access"],
      price: "Free",
      popular: false,
      limits: {
        requests_per_hour: 100,
        requests_per_month: 1000,
        concurrent_requests: 5,
      },
    },
    {
      tier: "Developer",
      requests: "50,000/month",
      features: [
        "All endpoints",
        "Webhooks",
        "Priority support",
        "Analytics dashboard",
      ],
      price: "$19/month",
      popular: true,
      limits: {
        requests_per_hour: 2500,
        requests_per_month: 50000,
        concurrent_requests: 20,
      },
    },
    {
      tier: "Business",
      requests: "200,000/month",
      features: [
        "Everything in Developer",
        "Custom integrations",
        "SLA guarantee",
        "Dedicated support",
      ],
      price: "$49/month",
      popular: false,
      limits: {
        requests_per_hour: 10000,
        requests_per_month: 200000,
        concurrent_requests: 50,
      },
    },
    {
      tier: "Enterprise",
      requests: "Unlimited",
      features: [
        "Everything in Business",
        "On-premise deployment",
        "Custom SLA",
        "24/7 phone support",
      ],
      price: "Contact us",
      popular: false,
      limits: {
        requests_per_hour: "Unlimited",
        requests_per_month: "Unlimited",
        concurrent_requests: "Unlimited",
      },
    },
  ];

  const statusCodes = [
    { code: 200, message: "OK", description: "Request successful" },
    {
      code: 201,
      message: "Created",
      description: "Resource created successfully",
    },
    {
      code: 400,
      message: "Bad Request",
      description: "Invalid request parameters",
    },
    {
      code: 401,
      message: "Unauthorized",
      description: "Authentication required",
    },
    {
      code: 403,
      message: "Forbidden",
      description: "Insufficient permissions",
    },
    { code: 404, message: "Not Found", description: "Resource not found" },
    {
      code: 422,
      message: "Unprocessable Entity",
      description: "Validation errors",
    },
    {
      code: 429,
      message: "Too Many Requests",
      description: "Rate limit exceeded",
    },
    {
      code: 500,
      message: "Internal Server Error",
      description: "Server error occurred",
    },
    {
      code: 503,
      message: "Service Unavailable",
      description: "Service temporarily unavailable",
    },
  ];

  const faqs = [
    {
      id: "faq-1",
      question: "Làm sao để lấy API key?",
      answer:
        "Đăng nhập vào tài khoản Template Market, vào phần Developer Settings, và tạo API key mới. Bạn có thể tạo nhiều keys cho các ứng dụng khác nhau và quản lý permissions cho từng key.",
    },
    {
      id: "faq-2",
      question: "API có rate limit không?",
      answer:
        "Có, mỗi gói có rate limit khác nhau. Gói Free: 100 requests/hour, Developer: 2,500/hour. Bạn có thể xem rate limit còn lại trong response headers: X-RateLimit-Remaining.",
    },
    {
      id: "faq-3",
      question: "Có thể test API miễn phí không?",
      answer:
        "Có, bạn có thể đăng ký gói Free để test API với 1,000 requests/month. Không cần thẻ tín dụng, chỉ cần email xác thực.",
    },
    {
      id: "faq-4",
      question: "API có hỗ trợ webhooks không?",
      answer:
        "Có, từ gói Developer trở lên có hỗ trợ webhooks cho các events: order.completed, user.registered, product.updated. Bạn có thể configure trong dashboard.",
    },
    {
      id: "faq-5",
      question: "Làm sao xử lý lỗi 401 Unauthorized?",
      answer:
        "Lỗi 401 thường do: 1) API key không đúng, 2) Token hết hạn, 3) Thiếu header Authorization. Hãy kiểm tra token và làm mới nếu cần.",
    },
  ];

  const changelog = [
    {
      version: "v1.3.0",
      date: "2024-01-15",
      type: "major",
      changes: [
        "Added WebSocket support for real-time updates",
        "New webhook endpoints for order events",
        "Improved error handling with detailed error codes",
        "Added product reviews API endpoints",
      ],
    },
    {
      version: "v1.2.5",
      date: "2024-01-10",
      type: "minor",
      changes: [
        "Fixed pagination bug in products endpoint",
        "Added new filter options for products",
        "Improved API response times by 25%",
        "Updated authentication token expiry to 24 hours",
      ],
    },
    {
      version: "v1.2.0",
      date: "2024-01-05",
      type: "major",
      changes: [
        "Added user profile management endpoints",
        "Implemented OAuth 2.0 authentication",
        "Added support for multiple payment methods",
        "Introduced API versioning",
      ],
    },
  ];

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleTestRequest = async () => {
    setIsTestLoading(true);
    setTimeout(() => {
      setTestResponse(`{
  "success": true,
  "data": {
    "message": "Test request successful",
    "timestamp": "${new Date().toISOString()}"
  }
}`);
      setIsTestLoading(false);
    }, 1500);
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowFeedbackSuccess(true);
    setFeedbackForm({ name: "", email: "", message: "" });
    setTimeout(() => setShowFeedbackSuccess(false), 3000);
  };

  const filteredEndpoints = endpoints
    .filter(
      (category) => filterCategory === "all" || category.id === filterCategory,
    )
    .map((category) => ({
      ...category,
      endpoints: category.endpoints.filter(
        (endpoint) =>
          endpoint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          endpoint.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          endpoint.path.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    }))
    .filter((category) => category.endpoints.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900">
      <Helmet>
        <title>
          🚀 API Documentation v1.3 | Template Market - Complete Developer Guide
        </title>
        <meta
          name="description"
          content="Comprehensive API documentation for Template Market. RESTful API, OAuth 2.0, code examples, live testing, error handling, and developer tools."
        />
      </Helmet>

      {/* Enhanced Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="container relative z-10 px-4 mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto"
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="flex items-center justify-center w-28 h-28 mx-auto mb-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full shadow-2xl"
            >
              <Code className="w-14 h-14 text-white" />
            </motion.div>

            <h1 className="mb-8 text-5xl font-bold md:text-7xl leading-tight">
              <span className="text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text">
                API Documentation
              </span>
              <br />
              <span className="text-2xl md:text-3xl font-medium text-muted-foreground">
                Build powerful integrations with Template Market
              </span>
            </h1>

            <p className="mb-12 text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Comprehensive RESTful API with
              <span className="text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text font-semibold">
                {" "}
                OAuth 2.0 authentication
              </span>
              ,
              <span className="text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text font-semibold">
                {" "}
                real-time webhooks
              </span>
              , and
              <span className="text-transparent bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text font-semibold">
                {" "}
                enterprise-grade security
              </span>
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
              <Badge
                variant="secondary"
                className="px-6 py-3 text-base bg-white/80 backdrop-blur-sm shadow-lg"
              >
                <Zap className="w-5 h-5 mr-3 text-indigo-600" />
                REST API v1.3
              </Badge>
              <Badge
                variant="secondary"
                className="px-6 py-3 text-base bg-white/80 backdrop-blur-sm shadow-lg"
              >
                <Shield className="w-5 h-5 mr-3 text-green-600" />
                OAuth 2.0 + JWT
              </Badge>
              <Badge
                variant="secondary"
                className="px-6 py-3 text-base bg-white/80 backdrop-blur-sm shadow-lg"
              >
                <Globe className="w-5 h-5 mr-3 text-blue-600" />
                JSON API
              </Badge>
              <Badge
                variant="secondary"
                className="px-6 py-3 text-base bg-white/80 backdrop-blur-sm shadow-lg"
              >
                <Webhook className="w-5 h-5 mr-3 text-purple-600" />
                Webhooks
              </Badge>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 * index }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
                >
                  <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                  <div className="text-3xl font-bold text-gray-800 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                x: [0, 50, 0],
                y: [0, -30, 0],
                opacity: [0.1, 0.3, 0.1],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 10 + i * 2,
                repeat: Infinity,
                delay: i * 2,
              }}
              className={`absolute w-32 h-32 rounded-full blur-xl mix-blend-multiply ${
                i % 4 === 0
                  ? "bg-indigo-300"
                  : i % 4 === 1
                    ? "bg-purple-300"
                    : i % 4 === 2
                      ? "bg-pink-300"
                      : "bg-blue-300"
              }`}
              style={{
                top: `${10 + i * 12}%`,
                left: `${5 + i * 12}%`,
              }}
            />
          ))}
        </div>
      </section>

      <div className="container px-4 pb-20 mx-auto">
        {/* Enhanced API Features Grid */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">🚀 API Features</h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to build powerful integrations
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {apiFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <Card className="h-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl overflow-hidden">
                  <div className={`h-2 bg-gradient-to-r ${feature.color}`} />
                  <CardContent className="p-8">
                    <div className="flex items-start gap-6">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className={`flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl shadow-lg`}
                      >
                        <feature.icon className="w-8 h-8 text-white" />
                      </motion.div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-3">
                          {feature.title}
                        </h3>
                        <p className="text-muted-foreground mb-4 leading-relaxed">
                          {feature.description}
                        </p>
                        <div className="space-y-2">
                          {feature.features.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 text-sm"
                            >
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Enhanced Quick Start */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-0 shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3 text-2xl">
                <PlayCircle className="w-8 h-8 text-indigo-600" />
                <span>🚀 Quick Start Guide</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    icon: Key,
                    step: "1",
                    title: "Get API Key",
                    description:
                      "Sign up and generate your API key in Developer Settings",
                    color: "bg-indigo-500",
                  },
                  {
                    icon: Send,
                    step: "2",
                    title: "Make Request",
                    description: "Send authenticated requests to our endpoints",
                    color: "bg-purple-500",
                  },
                  {
                    icon: CheckCircle,
                    step: "3",
                    title: "Handle Response",
                    description:
                      "Process JSON responses and handle errors gracefully",
                    color: "bg-green-500",
                  },
                ].map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    className="flex items-start space-x-4"
                  >
                    <div
                      className={`flex items-center justify-center w-12 h-12 ${step.color} text-white text-lg font-bold rounded-xl shadow-lg`}
                    >
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <step.icon className="w-5 h-5 text-gray-600" />
                        <h4 className="font-bold text-lg">{step.title}</h4>
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Separator />

              <div className="space-y-6">
                <h4 className="text-xl font-bold flex items-center gap-2">
                  <Terminal className="w-6 h-6 text-indigo-600" />
                  Base URL & Authentication
                </h4>
                <div className="bg-slate-900 text-green-400 p-6 rounded-xl font-mono">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-indigo-300">Base URL:</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(
                          "https://api.templatemarket.com/v1",
                          "base-url",
                        )
                      }
                      className="text-gray-400 hover:text-white"
                    >
                      {copiedCode === "base-url" ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <code className="block mb-4">
                    https://api.templatemarket.com/v1
                  </code>
                  <div className="text-indigo-300 mb-2">Required Headers:</div>
                  <code className="block">X-API-Key: your_api_key_here</code>
                  <code className="block">
                    Authorization: Bearer your_jwt_token
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Enhanced Search & Filter */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-4">📖 API Reference</h2>
            <p className="text-xl text-muted-foreground">
              Comprehensive documentation for all endpoints
            </p>
          </div>
          <Card className="bg-white/80 border-0 shadow-xl mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Label
                    htmlFor="search"
                    className="text-sm font-medium mb-2 block"
                  >
                    Search Endpoints
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search endpoints, methods, or descriptions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="md:w-64">
                  <Label
                    htmlFor="filter"
                    className="text-sm font-medium mb-2 block"
                  >
                    Filter by Category
                  </Label>
                  <select
                    id="filter"
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                  >
                    <option value="all">All Categories</option>
                    {endpoints.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Enhanced API Endpoints */}
        <section className="mb-20">
          <div className="space-y-12">
            {filteredEndpoints.map((category, categoryIndex) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: categoryIndex * 0.1 }}
                id={`category-${category.id}`}
              >
                <Card className="bg-white/80 border-0 shadow-2xl overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-indigo-400 to-purple-600" />
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900">
                    <CardTitle className="flex items-center gap-4 text-2xl">
                      <div
                        className={`p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg`}
                      >
                        <category.icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <div className="text-3xl font-bold">
                          {category.category}
                        </div>
                        <div className="text-base text-muted-foreground font-normal mt-1">
                          {category.description}
                        </div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="space-y-8 p-8">
                      {category.endpoints.map((endpoint, endpointIndex) => (
                        <motion.div
                          key={endpointIndex}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: endpointIndex * 0.1 }}
                          className="border border-gray-200 rounded-xl shadow-md p-8 bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-950"
                        >
                          {/* Endpoint Header */}
                          <div className="flex flex-wrap items-center gap-4 mb-6">
                            <Badge
                              variant={
                                endpoint.method === "GET"
                                  ? "secondary"
                                  : endpoint.method === "POST"
                                    ? "default"
                                    : endpoint.method === "PUT"
                                      ? "outline"
                                      : "destructive"
                              }
                              className="text-sm px-3 py-1 font-mono"
                            >
                              {endpoint.method}
                            </Badge>
                            <code className="bg-slate-200 dark:bg-slate-700 px-4 py-2 rounded-lg font-mono text-sm flex-1 min-w-0">
                              {endpoint.path}
                            </code>
                          </div>

                          <div className="mb-6">
                            <h4 className="text-xl font-bold mb-2">
                              {endpoint.title}
                            </h4>
                            <p className="text-muted-foreground leading-relaxed">
                              {endpoint.description}
                            </p>
                          </div>

                          {/* Request Details */}
                          <Tabs defaultValue="params" className="w-full">
                            <TabsList className="grid grid-cols-4 mb-6">
                              <TabsTrigger value="params">
                                Parameters
                              </TabsTrigger>
                              <TabsTrigger value="headers">Headers</TabsTrigger>
                              <TabsTrigger value="request">Request</TabsTrigger>
                              <TabsTrigger value="response">
                                Response
                              </TabsTrigger>
                            </TabsList>

                            <TabsContent value="params" className="space-y-4">
                              {endpoint.params && endpoint.params.length > 0 ? (
                                <div className="overflow-x-auto">
                                  <table className="w-full border-collapse">
                                    <thead>
                                      <tr className="border-b">
                                        <th className="text-left p-3 font-semibold">
                                          Parameter
                                        </th>
                                        <th className="text-left p-3 font-semibold">
                                          Type
                                        </th>
                                        <th className="text-left p-3 font-semibold">
                                          Required
                                        </th>
                                        <th className="text-left p-3 font-semibold">
                                          Description
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {endpoint.params.map((param, idx) => (
                                        <tr
                                          key={idx}
                                          className="border-b hover:bg-gray-50"
                                        >
                                          <td className="p-3 font-mono text-sm">
                                            {param.name}
                                          </td>
                                          <td className="p-3">
                                            <Badge variant="outline">
                                              {param.type}
                                            </Badge>
                                          </td>
                                          <td className="p-3">
                                            {param.required ? (
                                              <Badge className="bg-red-100 text-red-800">
                                                Required
                                              </Badge>
                                            ) : (
                                              <Badge variant="secondary">
                                                Optional
                                              </Badge>
                                            )}
                                          </td>
                                          <td className="p-3 text-sm">
                                            {param.description}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              ) : (
                                <p className="text-muted-foreground">
                                  No parameters required
                                </p>
                              )}
                            </TabsContent>

                            <TabsContent value="headers" className="space-y-4">
                              {endpoint.headers &&
                              endpoint.headers.length > 0 ? (
                                <div className="overflow-x-auto">
                                  <table className="w-full border-collapse">
                                    <thead>
                                      <tr className="border-b">
                                        <th className="text-left p-3 font-semibold">
                                          Header
                                        </th>
                                        <th className="text-left p-3 font-semibold">
                                          Value
                                        </th>
                                        <th className="text-left p-3 font-semibold">
                                          Required
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {endpoint.headers.map((header, idx) => (
                                        <tr
                                          key={idx}
                                          className="border-b hover:bg-gray-50"
                                        >
                                          <td className="p-3 font-mono text-sm">
                                            {header.name}
                                          </td>
                                          <td className="p-3 font-mono text-sm text-blue-600">
                                            {header.value}
                                          </td>
                                          <td className="p-3">
                                            {header.required ? (
                                              <Badge className="bg-red-100 text-red-800">
                                                Required
                                              </Badge>
                                            ) : (
                                              <Badge variant="secondary">
                                                Optional
                                              </Badge>
                                            )}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              ) : (
                                <p className="text-muted-foreground">
                                  No special headers required
                                </p>
                              )}
                            </TabsContent>

                            <TabsContent value="request" className="space-y-4">
                              {endpoint.requestBody ? (
                                <div className="relative">
                                  <div className="flex items-center justify-between mb-2">
                                    <Label className="font-semibold">
                                      Request Body (JSON)
                                    </Label>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        copyToClipboard(
                                          endpoint.requestBody || "",
                                          `request-${endpointIndex}`,
                                        )
                                      }
                                    >
                                      {copiedCode ===
                                      `request-${endpointIndex}` ? (
                                        <CheckCircle className="w-4 h-4" />
                                      ) : (
                                        <Copy className="w-4 h-4" />
                                      )}
                                    </Button>
                                  </div>
                                  <div className="bg-slate-900 text-green-400 p-6 rounded-lg font-mono text-sm overflow-x-auto">
                                    <pre>{endpoint.requestBody}</pre>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-muted-foreground">
                                  No request body required
                                </p>
                              )}
                            </TabsContent>

                            <TabsContent value="response" className="space-y-4">
                              <div className="relative">
                                <div className="flex items-center justify-between mb-2">
                                  <Label className="font-semibold">
                                    Response (JSON)
                                  </Label>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      copyToClipboard(
                                        endpoint.response,
                                        `response-${endpointIndex}`,
                                      )
                                    }
                                  >
                                    {copiedCode ===
                                    `response-${endpointIndex}` ? (
                                      <CheckCircle className="w-4 h-4" />
                                    ) : (
                                      <Copy className="w-4 h-4" />
                                    )}
                                  </Button>
                                </div>
                                <div className="bg-slate-900 text-green-400 p-6 rounded-lg font-mono text-sm overflow-x-auto">
                                  <pre>{endpoint.response}</pre>
                                </div>
                              </div>
                            </TabsContent>
                          </Tabs>

                          {/* Error Codes */}
                          {endpoint.errors && endpoint.errors.length > 0 && (
                            <div className="mt-8">
                              <h5 className="font-bold mb-4 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-orange-500" />
                                Possible Error Responses
                              </h5>
                              <div className="grid gap-3">
                                {endpoint.errors.map((error, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg"
                                  >
                                    <Badge
                                      variant="destructive"
                                      className="font-mono"
                                    >
                                      {error.code}
                                    </Badge>
                                    <div>
                                      <div className="font-semibold text-red-800">
                                        {error.message}
                                      </div>
                                      <div className="text-sm text-red-600">
                                        {error.description}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Code Examples */}
                          {endpoint.examples &&
                            endpoint.examples.length > 0 && (
                              <div className="mt-8">
                                <h5 className="font-bold mb-4 flex items-center gap-2">
                                  <Code className="w-5 h-5 text-blue-500" />
                                  Example Request
                                </h5>
                                {endpoint.examples.map((example, idx) => (
                                  <div key={idx} className="mb-4">
                                    <div className="flex items-center justify-between mb-2">
                                      <Label className="font-medium">
                                        {example.title}
                                      </Label>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          copyToClipboard(
                                            example.request,
                                            `example-${endpointIndex}-${idx}`,
                                          )
                                        }
                                      >
                                        {copiedCode ===
                                        `example-${endpointIndex}-${idx}` ? (
                                          <CheckCircle className="w-4 h-4" />
                                        ) : (
                                          <Copy className="w-4 h-4" />
                                        )}
                                      </Button>
                                    </div>
                                    <div className="bg-slate-900 text-orange-300 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                                      <pre>{example.request}</pre>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Live API Tester */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-0 shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <PlayCircle className="w-8 h-8 text-green-600" />
                🧪 Live API Tester
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                Test API endpoints directly from the documentation with real
                requests
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <Label
                    htmlFor="test-endpoint"
                    className="font-semibold mb-2 block"
                  >
                    Select Endpoint
                  </Label>
                  <select
                    id="test-endpoint"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white"
                    defaultValue="auth/login"
                  >
                    <option value="auth/login">POST /auth/login</option>
                    <option value="products">GET /products</option>
                    <option value="users/profile">GET /users/profile</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="api-key" className="font-semibold mb-2 block">
                    API Key
                  </Label>
                  <Input
                    id="api-key"
                    placeholder="Enter your API key"
                    type="password"
                  />
                </div>
              </div>
              <div>
                <Label
                  htmlFor="request-body"
                  className="font-semibold mb-2 block"
                >
                  Request Body (JSON)
                </Label>
                <Textarea
                  id="request-body"
                  placeholder='{"email": "user@example.com", "password": "password123"}'
                  value={testRequestBody}
                  onChange={(e) => setTestRequestBody(e.target.value)}
                  className="font-mono"
                  rows={6}
                />
              </div>
              <div className="flex gap-4">
                <Button
                  onClick={handleTestRequest}
                  disabled={isTestLoading}
                  className="bg-gradient-to-r from-green-500 to-blue-600"
                >
                  {isTestLoading ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  {isTestLoading ? "Sending..." : "Send Request"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setTestResponse("");
                    setTestRequestBody("");
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              </div>
              {testResponse && (
                <div>
                  <Label className="font-semibold mb-2 block">Response</Label>
                  <div className="bg-slate-900 text-green-400 p-6 rounded-lg font-mono text-sm overflow-x-auto">
                    <pre>{testResponse}</pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.section>

        {/* Code Examples */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">💻 Code Examples</h2>
            <p className="text-xl text-muted-foreground">
              Ready-to-use code snippets in multiple programming languages
            </p>
          </div>
          <Card className="bg-white/80 border-0 shadow-2xl">
            <CardContent className="p-0">
              <Tabs
                value={selectedLanguage}
                onValueChange={setSelectedLanguage}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3 rounded-none">
                  <TabsTrigger value="javascript" className="text-lg py-4">
                    <Code className="w-5 h-5 mr-2" />
                    JavaScript
                  </TabsTrigger>
                  <TabsTrigger value="python" className="text-lg py-4">
                    <Database className="w-5 h-5 mr-2" />
                    Python
                  </TabsTrigger>
                  <TabsTrigger value="curl" className="text-lg py-4">
                    <Terminal className="w-5 h-5 mr-2" />
                    cURL
                  </TabsTrigger>
                </TabsList>

                {Object.entries(codeExamples).map(([language, code]) => (
                  <TabsContent key={language} value={language} className="mt-0">
                    <div className="relative">
                      <div className="flex items-center justify-between p-4 bg-slate-800 text-white">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="ml-4 font-mono text-sm">
                            {language === "javascript"
                              ? "api-client.js"
                              : language === "python"
                                ? "api_client.py"
                                : "api_requests.sh"}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(code, language)}
                          className="text-gray-400 hover:text-white"
                        >
                          {copiedCode === language ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      <div className="bg-slate-900 text-green-400 p-6 overflow-x-auto max-h-96">
                        <pre className="text-sm leading-relaxed">
                          <code>{code}</code>
                        </pre>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </motion.section>

        {/* Status Codes */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">📊 HTTP Status Codes</h2>
            <p className="text-xl text-muted-foreground">
              Understanding API response codes and their meanings
            </p>
          </div>
          <Card className="bg-white/80 border-0 shadow-2xl">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {statusCodes.map((status, index) => (
                  <motion.div
                    key={status.code}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className={`p-4 rounded-lg border-2 ${
                      status.code < 300
                        ? "bg-green-50 border-green-200"
                        : status.code < 400
                          ? "bg-blue-50 border-blue-200"
                          : status.code < 500
                            ? "bg-orange-50 border-orange-200"
                            : "bg-red-50 border-red-200"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Badge
                        variant={
                          status.code < 300
                            ? "default"
                            : status.code < 400
                              ? "secondary"
                              : status.code < 500
                                ? "outline"
                                : "destructive"
                        }
                        className="font-mono text-lg px-3 py-1"
                      >
                        {status.code}
                      </Badge>
                      <span className="font-bold">{status.message}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {status.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Rate Limits & Pricing */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              ⚡ Rate Limits & Pricing
            </h2>
            <p className="text-xl text-muted-foreground">
              Choose the perfect plan for your integration needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {rateLimits.map((plan, index) => (
              <motion.div
                key={plan.tier}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <Card
                  className={`text-center h-full bg-white/80 border-0 shadow-xl overflow-hidden ${
                    plan.popular ? "ring-2 ring-indigo-500 scale-105" : ""
                  }`}
                >
                  {plan.popular && (
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2">
                      <Badge className="bg-white text-indigo-600">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardHeader className="pb-4">
                    <CardTitle className="text-2xl">{plan.tier}</CardTitle>
                    <div className="text-3xl font-bold text-indigo-600 mb-2">
                      {plan.price}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {plan.requests}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-sm"
                        >
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    <div className="space-y-2 text-xs text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Requests/Hour:</span>
                        <span className="font-mono">
                          {plan.limits.requests_per_hour}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Requests/Month:</span>
                        <span className="font-mono">
                          {plan.limits.requests_per_month}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Concurrent:</span>
                        <span className="font-mono">
                          {plan.limits.concurrent_requests}
                        </span>
                      </div>
                    </div>

                    <Button
                      variant={plan.popular ? "default" : "outline"}
                      className={`w-full ${plan.popular ? "bg-gradient-to-r from-indigo-500 to-purple-600" : ""}`}
                    >
                      {plan.tier === "Enterprise"
                        ? "Contact Sales"
                        : "Get Started"}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* FAQ Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              ❓ Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground">
              Get answers to common API integration questions
            </p>
          </div>
          <Card className="bg-white/80 border-0 shadow-2xl">
            <CardContent className="p-8">
              <Accordion type="single" collapsible className="w-full space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={faq.id}
                    value={faq.id}
                    className="border border-gray-200 rounded-xl px-6 data-[state=open]:shadow-lg transition-all duration-300"
                  >
                    <AccordionTrigger className="text-left hover:no-underline py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <span className="text-lg font-semibold">
                          {faq.question}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6">
                      <div className="ml-11 text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </motion.section>

        {/* Changelog */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">📋 Changelog</h2>
            <p className="text-xl text-muted-foreground">
              Stay updated with the latest API improvements and features
            </p>
          </div>
          <Card className="bg-white/80 border-0 shadow-2xl">
            <CardContent className="p-8">
              <div className="space-y-8">
                {changelog.map((version, index) => (
                  <motion.div
                    key={version.version}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-6"
                  >
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          version.type === "major"
                            ? "bg-gradient-to-r from-green-500 to-emerald-400"
                            : "bg-gradient-to-r from-blue-500 to-cyan-400"
                        } text-white font-bold`}
                      >
                        {version.version.split(".")[1]}
                      </div>
                      {index < changelog.length - 1 && (
                        <div className="w-0.5 h-16 bg-gray-300 mt-4"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold">{version.version}</h3>
                        <Badge
                          variant={
                            version.type === "major" ? "default" : "secondary"
                          }
                        >
                          {version.type}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {version.date}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {version.changes.map((change, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">
                              {change}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Feedback Form */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-0 shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <MessageSquare className="w-8 h-8 text-purple-600" />
                💬 Documentation Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Help us improve this documentation. Your feedback is valuable to
                us!
              </p>
              {showFeedbackSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-green-800 mb-2">
                    Thank you!
                  </h3>
                  <p className="text-green-600">
                    Your feedback has been submitted successfully.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleFeedbackSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="feedback-name">Name</Label>
                      <Input
                        id="feedback-name"
                        value={feedbackForm.name}
                        onChange={(e) =>
                          setFeedbackForm({
                            ...feedbackForm,
                            name: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="feedback-email">Email</Label>
                      <Input
                        id="feedback-email"
                        type="email"
                        value={feedbackForm.email}
                        onChange={(e) =>
                          setFeedbackForm({
                            ...feedbackForm,
                            email: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="feedback-message">Message</Label>
                    <Textarea
                      id="feedback-message"
                      rows={4}
                      placeholder="Tell us what you think about this documentation..."
                      value={feedbackForm.message}
                      onChange={(e) =>
                        setFeedbackForm({
                          ...feedbackForm,
                          message: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-purple-500 to-pink-600"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Feedback
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.section>

        {/* Support Channels */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900 border-0 shadow-2xl">
            <CardContent className="p-10 text-center">
              <h2 className="text-4xl font-bold mb-4">🛠️ Developer Support</h2>
              <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
                Our expert development team is here to help you integrate our
                API successfully. Choose the support channel that works best for
                you.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    icon: Mail,
                    title: "📧 Email Support",
                    description: "api@templatemarket.com",
                    detail: "Technical questions, integration help",
                    response: "< 4 hours",
                    color: "from-blue-500 to-cyan-400",
                  },
                  {
                    icon: Github,
                    title: "🐛 GitHub Issues",
                    description: "github.com/templatemarket/api",
                    detail: "Bug reports, feature requests",
                    response: "Community driven",
                    color: "from-purple-500 to-pink-400",
                  },
                  {
                    icon: BookOpen,
                    title: "📚 Developer Docs",
                    description: "docs.templatemarket.com",
                    detail: "Comprehensive guides, tutorials",
                    response: "Self-service",
                    color: "from-green-500 to-emerald-400",
                  },
                ].map((support, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -10, scale: 1.05 }}
                    className="group"
                  >
                    <Card className="h-full bg-white/80 border-0 shadow-lg hover:shadow-2xl transition-all duration-300">
                      <CardContent className="p-8">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-r ${support.color} rounded-2xl shadow-xl flex items-center justify-center group-hover:shadow-2xl transition-all duration-300`}
                        >
                          <support.icon className="w-8 h-8 text-white" />
                        </motion.div>
                        <h4 className="text-xl font-bold mb-3">
                          {support.title}
                        </h4>
                        <p className="text-blue-600 font-mono text-sm mb-3">
                          {support.description}
                        </p>
                        <p className="text-muted-foreground text-sm mb-4">
                          {support.detail}
                        </p>
                        <Badge variant="outline" className="mb-6">
                          Response: {support.response}
                        </Badge>
                        <Button
                          variant="outline"
                          className="w-full group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-600 group-hover:text-white transition-all duration-300"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Get Help
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <Separator className="my-12" />

              <div className="text-center">
                <h3 className="text-2xl font-bold mb-6">
                  🚀 Ready to get started?
                </h3>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-lg"
                  >
                    <Key className="w-5 h-5 mr-2" />
                    Get API Key
                  </Button>
                  <Button size="lg" variant="outline">
                    <BookOpen className="w-5 h-5 mr-2" />
                    View Examples
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </div>
  );
};

export default APIDocumentation;
