import React, { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Search,
  HelpCircle,
  BookOpen,
  Download,
  CreditCard,
  Shield,
  Settings,
  Users,
  Star,
  TrendingUp,
  CheckCircle,
  MessageSquare,
  Mail,
  Phone,
  Clock,
  Sparkles,
  Heart,
  Zap,
  Award,
  Target,
  Rocket,
  Code,
  Palette,
  Package,
  Globe,
  Lightbulb,
  ArrowRight,
  Info,
  AlertCircle,
  Headphones,
  FileText,
  Video,
  ExternalLink,
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
      Icon: HelpCircle,
      color: "from-pink-50 to-rose-100",
      position: "top-10 right-20",
    },
    {
      Icon: BookOpen,
      color: "from-rose-50 to-red-100",
      position: "top-32 left-10",
    },
    {
      Icon: Shield,
      color: "from-red-50 to-pink-100",
      position: "bottom-20 right-10",
    },
    {
      Icon: Lightbulb,
      color: "from-pink-100 to-rose-50",
      position: "bottom-32 left-20",
    },
    {
      Icon: Settings,
      color: "from-rose-100 to-pink-50",
      position: "top-1/2 right-1/4",
    },
    {
      Icon: Globe,
      color: "from-red-50 to-rose-100",
      position: "top-1/3 left-1/3",
    },
    {
      Icon: Rocket,
      color: "from-pink-50 to-red-100",
      position: "bottom-1/3 right-1/3",
    },
    {
      Icon: Star,
      color: "from-rose-50 to-pink-100",
      position: "top-2/3 left-1/4",
    },
    {
      Icon: Heart,
      color: "from-red-100 to-rose-50",
      position: "top-1/4 right-1/2",
    },
    {
      Icon: Sparkles,
      color: "from-pink-100 to-red-50",
      position: "bottom-1/4 left-1/2",
    },
    {
      Icon: Award,
      color: "from-rose-100 to-red-50",
      position: "top-3/4 right-20",
    },
    {
      Icon: Target,
      color: "from-pink-50 to-rose-100",
      position: "bottom-40 left-10",
    },
    { Icon: Zap, color: "from-red-50 to-pink-50", position: "top-40 right-40" },
    {
      Icon: Code,
      color: "from-rose-50 to-red-50",
      position: "bottom-1/2 right-10",
    },
    {
      Icon: Palette,
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
const FAQ: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("general");
  const [showFloatingNav, setShowFloatingNav] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const { scrollYProgress } = useScroll();
  const headerY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  React.useEffect(() => {
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
    {
      icon: HelpCircle,
      value: "500+",
      label: "Câu hỏi",
      color: "text-pink-600",
    },
    {
      icon: Users,
      value: "50K+",
      label: "Người truy cập",
      color: "text-rose-600",
    },
    {
      icon: Clock,
      value: "< 2h",
      label: "Thời gian phản hồi",
      color: "text-red-600",
    },
    {
      icon: Star,
      value: "4.9/5",
      label: "Đánh giá hỗ trợ",
      color: "text-pink-700",
    },
  ];

  const popularQuestions = [
    {
      icon: Download,
      question: "Làm sao để tải template sau khi mua?",
      answer:
        "Sau khi thanh toán thành công, vào Dashboard > My Purchases và click Download. Link có hiệu lực 30 ngày.",
      category: "downloads",
      views: "25K",
    },
    {
      icon: CreditCard,
      question: "Chính sách hoàn tiền như thế nào?",
      answer:
        "Chúng tôi có chính sách hoàn tiền 100% trong 30 ngày nếu template có lỗi kỹ thuật nghiêm trọng.",
      category: "billing",
      views: "18K",
    },
    {
      icon: Shield,
      question: "License của template là gì?",
      answer:
        "Mỗi template đi kèm commercial license, sử dụng cho unlimited projects mà không có phí thêm.",
      category: "licensing",
      views: "32K",
    },
    {
      icon: Code,
      question: "Template hỗ trợ frameworks nào?",
      answer:
        "Chúng tôi có templates cho React, Vue, Angular, Next.js, WordPress và nhiều frameworks khác.",
      category: "technical",
      views: "15K",
    },
    {
      icon: Settings,
      question: "Cần kiến thức gì để sử dụng?",
      answer:
        "Tùy template, cần HTML/CSS cơ bản đến JavaScript/React. Mỗi template có requirements chi tiết.",
      category: "general",
      views: "22K",
    },
    {
      icon: Palette,
      question: "Có thể customize template không?",
      answer:
        "Có! Tất cả templates đều có source code đầy đủ, bạn có thể tùy chỉnh theo ý muốn.",
      category: "customization",
      views: "28K",
    },
  ];

  const faqCategories = [
    {
      id: "general",
      name: "Chung",
      icon: BookOpen,
      count: 25,
      description: "Thông tin cơ bản về Template Market",
      questions: [
        {
          q: "Template Market là gì?",
          a: "Template Market là marketplace lớn nhất Việt Nam cung cấp các template website, UI kits, themes chất lượng cao cho developers và designers. Chúng tôi có hơn 5000+ templates cho mọi nhu cầu từ landing pages, admin dashboards, e-commerce đến mobile apps. Mỗi template được kiểm duyệt kỹ lưỡng về chất lượng code, design và performance trước khi publish.",
        },
        {
          q: "Ai có thể sử dụng Template Market?",
          a: "Template Market phù hợp cho mọi đối tượng: Developers tìm kiếm solutions nhanh, Designers cần UI kits chất lượng, Agencies làm projects cho clients, Startups muốn launch nhanh sản phẩm, Students học tập và thực hành coding. Dù bạn là beginner hay expert, chúng tôi đều có templates phù hợp với skill level của bạn.",
        },
        {
          q: "Tôi cần tài khoản để xem templates không?",
          a: "Không cần! Bạn có thể browse và preview tất cả templates mà không cần đăng nhập. Tuy nhiên, để mua và download templates, bạn cần tạo tài khoản miễn phí. Tài khoản cũng cho phép bạn save favorites, track orders, access support portal và nhận updates về sản phẩm.",
        },
        {
          q: "Có hỗ trợ tiếng Việt không?",
          a: "Có! Toàn bộ website, documentation và support team đều có tiếng Việt. Đội ngũ support của chúng tôi thành thạo cả tiếng Việt và tiếng Anh, sẵn sàng hỗ trợ bạn 24/7 qua email, live chat hoặc hotline. Chúng tôi hiểu văn hóa và nhu cầu của developers Việt Nam.",
        },
        {
          q: "Template Market có an toàn không?",
          a: "Hoàn toàn! Chúng tôi sử dụng SSL encryption cho tất cả transactions, PCI-compliant payment processing, regular security audits. Tất cả templates được scan malware và kiểm tra code quality trước khi publish. Thông tin cá nhân được bảo vệ theo GDPR standards và không bao giờ share với third parties.",
        },
        {
          q: "Tôi có thể tin tưởng vào chất lượng templates?",
          a: "Có! Mỗi template trải qua quy trình review nghiêm ngặt: Code quality check, Design review, Performance testing, Browser compatibility, Mobile responsiveness, Security scan. Chúng tôi chỉ chấp nhận templates đạt chuẩn cao nhất. Authors phải maintain update policy và cung cấp support cho buyers.",
        },
      ],
    },
    {
      id: "purchasing",
      name: "Mua hàng",
      icon: CreditCard,
      count: 18,
      description: "Quy trình mua hàng và thanh toán",
      questions: [
        {
          q: "Làm sao để mua template?",
          a: "Quy trình rất đơn giản: (1) Browse templates và tìm template bạn thích, (2) Click 'Add to Cart' hoặc 'Buy Now', (3) Login hoặc Register nếu chưa có tài khoản, (4) Review cart và nhập thông tin billing, (5) Chọn payment method và complete purchase. Sau khi payment successful, bạn có thể download ngay trong Dashboard.",
        },
        {
          q: "Có những phương thức thanh toán nào?",
          a: "Chúng tôi chấp nhận đa dạng payment methods: Credit/Debit Cards (Visa, Mastercard, American Express), PayPal (instant payment), Chuyển khoản ngân hàng (Vietnam banks), Ví điện tử (Momo, ZaloPay, VNPay), Cryptocurrency (Bitcoin, Ethereum, USDT). Tất cả giao dịch được mã hóa và bảo mật tuyệt đối.",
        },
        {
          q: "Có mã giảm giá hoặc promotion không?",
          a: "Có! Chúng tôi thường xuyên có các chương trình: Flash sales (giảm 50-70% trong thời gian ngắn), Seasonal promotions (Black Friday, Cyber Monday, Year End Sales), Newsletter discount codes (10-20% cho subscribers), Bundle deals (mua nhiều templates cùng lúc giảm giá), First-time buyer discount (cho khách hàng mới). Subscribe newsletter để không bỏ lỡ deals.",
        },
        {
          q: "Có thể mua template cho người khác không?",
          a: "Có! Khi checkout, bạn có option 'Gift this template'. Nhập email người nhận và họ sẽ receive license key và download link. Hoặc bạn có thể mua như bình thường và forward license key sau. Perfect cho gifts, employee purchases, hoặc client projects. Gift purchases cũng có invoices riêng cho accounting purposes.",
        },
        {
          q: "Invoice được gửi như thế nào?",
          a: "Invoice tự động gửi qua email ngay sau purchase thành công. Bạn cũng có thể download PDF invoice từ Dashboard > Orders > View Invoice. Invoice bao gồm đầy đủ thông tin: Order number, Date, Items purchased, Pricing breakdown, Payment method, License details. Bạn có thể customize company info trong Profile settings để invoice hiển thị đúng cho accounting/tax purposes.",
        },
        {
          q: "Có thể hủy đơn hàng sau khi mua không?",
          a: "Có thể trong trường hợp chưa download. Nếu bạn chưa download template, contact support trong 24h để request cancellation và full refund. Sau khi download, refund policy áp dụng: 30 ngày money-back guarantee nếu template có technical issues nghiêm trọng. No-questions-asked cancellation chỉ áp dụng trước download.",
        },
      ],
    },
    {
      id: "downloads",
      name: "Tải xuống",
      icon: Download,
      count: 22,
      description: "Download và file templates",
      questions: [
        {
          q: "Template bao gồm những file gì?",
          a: "Package đầy đủ gồm: Source code (HTML, CSS, JavaScript hoặc framework-specific), Assets (images, icons, fonts, illustrations), Documentation (PDF hoặc HTML với hướng dẫn chi tiết installation, customization, deployment), License file (proof of purchase), Changelog (version history và updates). Premium templates còn có PSD/Figma design files và video tutorials step-by-step.",
        },
        {
          q: "File template có kích thước bao nhiêu?",
          a: "Tùy vào loại template: Simple HTML templates: 5-20MB, React/Vue/Angular applications: 20-100MB (including node_modules), WordPress themes: 10-50MB, Full-featured admin dashboards: 50-200MB, Design files (PSD/Figma) nếu included: thêm 50-100MB. Chúng tôi optimize files nhưng vẫn đảm bảo quality và full features. Download servers trên toàn cầu đảm bảo tốc độ tốt.",
        },
        {
          q: "Download link có hết hạn không?",
          a: "Download link có hiệu lực 30 ngày từ lúc purchase với unlimited downloads trong thời gian này. Sau 30 ngày, bạn vẫn có lifetime access - chỉ cần vào Dashboard và request new download link (miễn phí). Chúng tôi recommend backup files locally ngay sau download để tránh phụ thuộc vào network. Files được store securely trên cloud servers.",
        },
        {
          q: "Download bị lỗi phải làm sao?",
          a: "Thử các bước: (1) Check internet connection stability, (2) Clear browser cache và cookies, (3) Try different browser (Chrome, Firefox, Safari), (4) Use download manager như IDM hoặc FDM cho files lớn, (5) Disable VPN/proxy nếu đang dùng, (6) Try incognito/private browsing mode. Nếu vẫn lỗi, contact support với order ID và screenshot lỗi. Chúng tôi có mirror servers và có thể gửi direct download link qua email.",
        },
        {
          q: "Có thể download lại nhiều lần không?",
          a: "Có! Unlimited downloads trong 30 ngày đầu. Sau đó bạn vẫn có lifetime access - request new link từ Dashboard bất cứ lúc nào (free). Nếu template có updates/new versions, bạn được download free updates. Chúng tôi recommend re-download sau major updates để có latest features và bug fixes. Email notifications khi có updates quan trọng.",
        },
        {
          q: "Tải xuống có cần VPN không?",
          a: "Không cần! Download servers của chúng tôi accessible globally without VPN. Tuy nhiên nếu ISP của bạn có restrictions, VPN có thể giúp. Chúng tôi có CDN servers tại: North America, Europe, Asia-Pacific, Southeast Asia. System tự động chọn server gần nhất để maximize download speed. Average speed: 5-50 Mbps tùy connection của bạn.",
        },
      ],
    },
    {
      id: "technical",
      name: "Kỹ thuật",
      icon: Code,
      count: 35,
      description: "Technical requirements và setup",
      questions: [
        {
          q: "Template có responsive không?",
          a: "100% responsive! Tất cả templates được test kỹ càng trên multiple devices và screen sizes: Desktop (1920px, 1680px, 1440px, 1366px, 1280px), Tablets (iPad Pro, iPad, Android tablets - landscape và portrait), Mobile (iPhone models, Android phones từ 320px đến 428px width), và các breakpoints khác. Chúng tôi follow mobile-first approach và test trên real devices, không chỉ emulators.",
        },
        {
          q: "Browser nào được support?",
          a: "Modern browsers support: Chrome 90+ (most popular), Firefox 88+, Safari 14+ (Mac/iOS), Edge 90+ (Chromium-based), Opera 76+. IE11 không support vì đã deprecated. Chúng tôi sử dụng modern web standards (ES6+, CSS Grid, Flexbox), progressive enhancement approach, và polyfills khi cần thiết. Cross-browser testing là mandatory trước publish.",
        },
        {
          q: "Cần môi trường development gì?",
          a: "Phụ thuộc template type: HTML/CSS/JS templates: Chỉ cần text editor (VS Code, Sublime) và browser. React/Vue/Next.js: Node.js 14+, npm hoặc yarn, Git optional. WordPress: Local server (XAMPP, MAMP), PHP 7.4+, MySQL 5.7+. Angular: Node 14+, Angular CLI. Mỗi template có detailed setup instructions trong README file với step-by-step guide.",
        },
        {
          q: "Templates có documentation không?",
          a: "Có documentation đầy đủ và chi tiết! Mỗi template bao gồm: Getting Started guide (quick setup trong 10 phút), Installation instructions (step-by-step với screenshots), Folder structure explanation, Component documentation (props, usage examples), Customization guide (colors, fonts, layouts), API integration examples, Deployment guide (Vercel, Netlify, custom hosting), FAQ & Troubleshooting, Code examples. Premium templates có video tutorials.",
        },
        {
          q: "Performance của templates như thế nào?",
          a: "Templates được optimize kỹ để đạt performance cao: Google PageSpeed Insights score 90+, Lighthouse scores (Performance, Accessibility, Best Practices, SEO) đều excellent, Lazy loading cho images và components, Code splitting để reduce initial bundle size, Minified và compressed assets, CDN-ready với proper caching headers, SEO optimized với semantic HTML và meta tags. Chúng tôi follow performance best practices và test với real users.",
        },
        {
          q: "Có hỗ trợ TypeScript không?",
          a: "Có! Hầu hết React/Vue/Angular templates hiện đại đều có TypeScript support. Benefits: Type safety giảm bugs, Better IDE support với autocomplete, Easier refactoring, Self-documenting code. Nếu template chỉ có JavaScript, bạn có thể migrate sang TypeScript - documentation có guide. TypeScript configurations đã setup sẵn với strict mode và recommended rules.",
        },
      ],
    },
    {
      id: "customization",
      name: "Tùy chỉnh",
      icon: Palette,
      count: 28,
      description: "Customize và modify templates",
      questions: [
        {
          q: "Có thể thay đổi màu sắc không?",
          a: "Rất dễ! Hầu hết templates sử dụng modern theming approaches: CSS variables (custom properties) - change một chỗ, apply everywhere, SASS/SCSS variables - powerful theming system với nested variables, Theme configuration files (JSON/JavaScript) - centralized theme management, Built-in theme switchers - dark/light mode ready. Documentation có detailed color customization guide với examples. Một số templates có visual theme customizer built-in.",
        },
        {
          q: "Làm sao để thay logo và branding?",
          a: "Replace logo files trong: /assets/images/logo.png hoặc /public/images/logo.svg (SVG recommended cho scalability), Update import paths trong header/navbar component, Change favicons trong /public/ folder (16x16, 32x32, 180x180, 512x512), Update brand colors via CSS variables or theme config, Modify footer credits và copyright text. Documentation có detailed branding guide với logo specifications và best practices.",
        },
        {
          q: "Có thể thêm/xóa sections không?",
          a: "Có! Templates được design với modular architecture: React/Vue: Components độc lập, easy to import/remove, update routing và navigation. HTML: Section-based structure, cut/paste HTML blocks, clean up unused CSS. Angular: Modular components và lazy loading, remove routes và modules. Documentation shows folder structure và dependencies. Most components self-contained với minimal external dependencies.",
        },
        {
          q: "Thay đổi fonts như thế nào?",
          a: "Multiple options available: Google Fonts (recommended): Add CDN link to HTML, update font-family in CSS variables, 900+ fonts available. Custom fonts: Add font files to /assets/fonts/, use @font-face CSS rule, optimize với font-display: swap. Variable fonts: Single file for multiple weights, better performance. Documentation có font integration examples và performance tips. We recommend max 2-3 font families để maintain good performance.",
        },
        {
          q: "Có thể tích hợp CMS không?",
          a: "Có! Templates support multiple CMS options: Headless CMS (Contentful, Strapi, Sanity, Ghost) - API-first approach, WordPress REST API - use template as frontend, Firebase/Firestore - real-time data, Supabase - open-source Firebase alternative, Custom backends - any REST/GraphQL API. Many templates có pre-built CMS integrations. Documentation có step-by-step API integration guides với authentication examples.",
        },
        {
          q: "Làm sao để add new pages?",
          a: "Process depends on stack: React Router: Create new component, add route in routes config, update navigation. Next.js: Create file in pages/ directory (file-based routing), automatic route generation. Vue Router: Create component, add route, update menu. HTML: Clone existing page, modify content, update navigation links. Documentation shows file naming conventions, routing patterns, và SEO considerations cho new pages.",
        },
      ],
    },
    {
      id: "licensing",
      name: "Bản quyền",
      icon: Shield,
      count: 15,
      description: "License và usage rights",
      questions: [
        {
          q: "License cho phép làm gì?",
          a: "Standard License comprehensive: Unlimited personal projects, Unlimited client projects (no per-project fee), Commercial use fully allowed (SaaS, products, services), Modify source code freely, No attribution required (but appreciated), Lifetime updates included. Restrictions: Cannot resell/redistribute templates as-is, Cannot create competing marketplace, Cannot share license với others. License key tied to email account.",
        },
        {
          q: "Một license dùng cho bao nhiêu projects?",
          a: "Unlimited! Một lần purchase = unlimited projects forever. Làm 10 client websites, 50 internal projects, 5 SaaS products - tất cả OK với một license. No recurring fees, no per-project charges, no additional licensing costs. Buy once, use forever cho all your projects. Đây là major advantage so với subscription-based platforms. Perfect cho agencies và freelancers.",
        },
        {
          q: "Có thể dùng cho nhiều domains không?",
          a: "Có! Absolutely no domain restrictions với Standard License. Deploy trên: Multiple client domains, Unlimited subdomains, Development và staging servers, Production servers, CDNs và hosting platforms khác nhau, Multiple environments (dev, staging, production). Flexible cho agencies managing nhiều client projects. Chỉ cần một license, use anywhere.",
        },
        {
          q: "Team members có thể cùng dùng không?",
          a: "Trong cùng organization/company: Có, team members có thể access và use purchased templates. Developers trong team có thể work trên projects. Restrictions: Không được share với external contractors/freelancers outside company, Không được resell access to other agencies, Không được transfer license ownership. For large teams (50+ developers) hoặc white-label usage, contact sales for Enterprise licensing options.",
        },
        {
          q: "Nếu vi phạm license thì sao?",
          a: "License violations taken seriously: First offense: Warning email và request to comply, Continued violation: License revocation without refund, Serious violations: Legal action và damages claim, Blacklist from future purchases và support. Common violations: Reselling templates as-is, Creating template marketplaces, Sharing license keys publicly. Report violations confidentially: legal@templatemarket.com. We protect authors' intellectual property rights.",
        },
        {
          q: "License có expire không?",
          a: "NO expiration! License là lifetime: Once purchased, yours forever, Lifetime updates included, No renewal fees ever, No subscription required, Access templates in Dashboard perpetually. Even if we discontinue a template, your license remains valid. Updates và support có time limits (6-12 months) nhưng license itself never expires. You own it forever.",
        },
      ],
    },
    {
      id: "support",
      name: "Hỗ trợ",
      icon: Headphones,
      count: 20,
      description: "Customer support và help",
      questions: [
        {
          q: "Được support trong bao lâu?",
          a: "6 months premium support free included với mỗi purchase. Sau đó có thể extend: $19 for 6 months more, $49 for lifetime support, $199 for priority enterprise support (< 1h response). Premium support includes: Bug fixes và patches, Setup và configuration assistance, Basic customization guidance, Update notifications, Feature questions. Community support via forum free forever cho all users.",
        },
        {
          q: "Làm sao để liên hệ support?",
          a: "Multiple channels available: Email: support@templatemarket.com (< 4 hours response standard, < 24h priority), Live Chat: Available 24/7 (< 2 minutes average wait time), Phone: Hotline during business hours 9AM-6PM GMT+7, Support Portal: Submit tickets và track progress, Community Forum: Peer-to-peer help và discussions. Choose appropriate channel - urgent technical issues: live chat, general questions: email, community discussions: forum.",
        },
        {
          q: "Support những vấn đề gì?",
          a: "Chúng tôi help với: Template bugs và technical errors, Installation và setup issues, Configuration questions, Basic customization guidance (colors, logos, content), Update và compatibility problems, Documentation clarifications, Feature usage questions. We DON'T support: Extensive custom development, Third-party plugins/integrations issues, Hosting provider technical problems, Advanced modifications beyond scope, Learning basic HTML/CSS/JavaScript. For custom work, we can recommend partners.",
        },
        {
          q: "Support có phí không?",
          a: "6 months free premium support với purchase. After: $19 per 6 additional months, $49 for lifetime support access, $199 for priority enterprise (< 1h SLA, 24/7). FREE forever: Community forum access, Knowledge base articles, Video tutorials, Documentation updates, Basic email support. Premium support covers bug fixes và template-specific issues. Custom development billed separately.",
        },
        {
          q: "Thời gian phản hồi support?",
          a: "SLA times vary by tier: Standard (free): < 24 hours business days, Priority ($49): < 4 hours 24/7 including weekends, Enterprise ($199): < 1 hour guaranteed 24/7, Live Chat: < 2 minutes connect time, Phone: Immediate during business hours. Actual response often faster. Critical bugs get priority regardless of tier. Weekend/holiday might be slower for standard tier.",
        },
        {
          q: "Support có tiếng Việt không?",
          a: "Có đầy đủ! Support team fluent trong tiếng Việt và English. Bạn có thể communicate bằng ngôn ngữ comfortable nhất. Documentation có Vietnamese versions. Video tutorials có Vietnamese subtitles. Community forum có Vietnamese section. We understand cultural context và technical terminology trong tiếng Việt. Không language barrier khi cần help!",
        },
      ],
    },
  ];

  const quickLinks = [
    { icon: Rocket, title: "Bắt đầu", desc: "Getting started guide" },
    { icon: Download, title: "Download", desc: "Tải và cài đặt" },
    { icon: Palette, title: "Customize", desc: "Tùy chỉnh template" },
    { icon: Shield, title: "License", desc: "Bản quyền sử dụng" },
    { icon: CreditCard, title: "Billing", desc: "Thanh toán" },
    { icon: Headphones, title: "Support", desc: "Trợ giúp 24/7" },
  ];

  const resources = [
    {
      icon: Video,
      title: "Video Tutorials",
      desc: "150+ hướng dẫn video",
      link: "#",
    },
    {
      icon: FileText,
      title: "Documentation",
      desc: "500+ tài liệu chi tiết",
      link: "#",
    },
    { icon: BookOpen, title: "Blog", desc: "Tips & best practices", link: "#" },
    { icon: Users, title: "Community", desc: "Forum & discussions", link: "#" },
  ];

  const handleSearch = React.useCallback(() => {
    if (searchTerm.trim()) {
      toast({
        title: "Đang tìm kiếm...",
        description: `Tìm kiếm cho: "${searchTerm}"`,
      });
    }
  }, [searchTerm]);

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
            className={`bg-gradient-to-r ${softPinkTheme.primaryGradient} text-white w-12 h-12 rounded-full shadow-2xl`}
          >
            <ArrowRight className="w-5 h-5 rotate-[-90deg]" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <Helmet>
        <title>FAQ | Template Market - Câu hỏi thường gặp</title>
        <meta
          name="description"
          content="FAQ Template Market. 500+ câu hỏi thường gặp về templates, thanh toán, tải xuống, bản quyền, support. Tìm câu trả lời nhanh chóng."
        />
        <meta
          name="keywords"
          content="faq, frequently asked questions, help, support, template market, answers"
        />
        <link rel="canonical" href="https://templatemarket.com/faq" />
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
                <HelpCircle className="w-14 h-14 text-white" />
              </motion.div>

              <h1 className="mb-8 text-5xl lg:text-7xl font-bold">
                <span
                  className={`text-transparent bg-gradient-to-r ${softPinkTheme.heroText} bg-clip-text`}
                >
                  Câu hỏi thường gặp
                </span>
                <br />
                <span className="text-2xl lg:text-3xl font-medium text-gray-700">
                  Tìm câu trả lời nhanh chóng
                </span>
              </h1>

              <p className="mb-12 text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto">
                500+ câu hỏi và câu trả lời chi tiết về mọi thứ bạn cần biết
              </p>

              {/* SEARCH */}
              <div className="max-w-3xl mx-auto mb-12">
                <div className="relative">
                  <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Tìm kiếm câu hỏi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    className="pl-16 pr-32 py-6 text-lg rounded-2xl border-2 border-gray-200 focus:border-pink-500 bg-white/60 backdrop-blur-md"
                  />
                  <Button
                    onClick={handleSearch}
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r ${softPinkTheme.primaryGradient} text-white px-6`}
                  >
                    Tìm kiếm
                  </Button>
                </div>
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
          {/* POPULAR QUESTIONS */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-800">
                Câu hỏi phổ biến
              </h2>
              <p className="text-xl text-gray-600">
                Những câu hỏi được tìm kiếm nhiều nhất
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {popularQuestions.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <Card className="h-full bg-white/60 backdrop-blur-xl border border-white/60 shadow-lg">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4">
                        <item.icon className="w-6 h-6 text-pink-600" />
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge
                          variant="outline"
                          className="text-xs bg-gray-100 text-gray-700"
                        >
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {item.views} views
                        </Badge>
                      </div>
                      <h3 className="font-bold text-lg mb-3 text-gray-800">
                        {item.question}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {item.answer}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* FAQ CATEGORIES */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <Card className="bg-white/60 backdrop-blur-xl border border-white/60 shadow-lg">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-gray-800">
                  Tất cả câu hỏi
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Tìm câu trả lời theo danh mục
                </p>
              </CardHeader>
              <CardContent>
                <Tabs
                  defaultValue="general"
                  onValueChange={setSelectedCategory}
                >
                  <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 bg-pink-100/50 mb-8">
                    {faqCategories.map((category) => (
                      <TabsTrigger
                        key={category.id}
                        value={category.id}
                        className="flex items-center gap-2"
                      >
                        <category.icon className="w-4 h-4" />
                        <span className="hidden lg:inline">
                          {category.name}
                        </span>
                        <Badge variant="outline" className="ml-1 text-xs">
                          {category.count}
                        </Badge>
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {faqCategories.map((category) => (
                    <TabsContent key={category.id} value={category.id}>
                      <div className="mb-6 p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl border border-pink-200">
                        <div className="flex items-center gap-3">
                          <Info className="w-5 h-5 text-pink-600 flex-shrink-0" />
                          <p className="text-sm text-gray-700">
                            {category.description}
                          </p>
                        </div>
                      </div>

                      <Accordion
                        type="single"
                        collapsible
                        className="space-y-4"
                      >
                        {category.questions.map((faq, index) => (
                          <AccordionItem
                            key={index}
                            value={`faq-${category.id}-${index}`}
                            className="border border-pink-200 rounded-xl px-6"
                          >
                            <AccordionTrigger className="text-left hover:no-underline py-6">
                              <div className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-pink-600 mt-1 flex-shrink-0" />
                                <span className="text-lg font-semibold text-gray-800">
                                  {faq.q}
                                </span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="pb-6">
                              <p className="text-gray-600 leading-relaxed pl-8">
                                {faq.a}
                              </p>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </motion.section>

          {/* QUICK LINKS */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 text-gray-800">
                Truy cập nhanh
              </h2>
              <p className="text-xl text-gray-600">Các chủ đề phổ biến</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {quickLinks.map((link, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.05 }}
                  className="cursor-pointer"
                >
                  <Card className="h-full bg-white/60 backdrop-blur-xl border border-white/60 shadow-lg text-center">
                    <CardContent className="p-6">
                      <link.icon className="w-10 h-10 mx-auto mb-3 text-pink-600" />
                      <h3 className="font-bold text-gray-800 mb-1">
                        {link.title}
                      </h3>
                      <p className="text-xs text-gray-600">{link.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* RESOURCES */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <Card className="bg-white/60 backdrop-blur-xl border border-white/60 shadow-lg">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-gray-800">
                  Tài nguyên hữu ích
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Thêm nguồn học tập và hỗ trợ
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {resources.map((resource, index) => (
                    <motion.a
                      key={index}
                      href={resource.link}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                      className="block p-6 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl border border-pink-200 hover:border-pink-300 transition-all"
                    >
                      <resource.icon className="w-10 h-10 text-pink-600 mb-4" />
                      <h3 className="font-bold text-gray-800 mb-2">
                        {resource.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {resource.desc}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-pink-600 font-semibold">
                        <span>Xem thêm</span>
                        <ExternalLink className="w-4 h-4" />
                      </div>
                    </motion.a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.section>
        </div>
      </div>
    </>
  );
};

export default FAQ;
