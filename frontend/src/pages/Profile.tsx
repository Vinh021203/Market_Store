import React, { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { getInitials } from "@/lib/auth";
import { formatPrice } from "@/lib/products";
import { supabase } from "@/lib/supabase";
import { Helmet } from "react-helmet-async";
import {
  User,
  CreditCard,
  Calendar,
  ShoppingBag,
  Download,
  Settings,
  Trophy,
  Star,
  TrendingUp,
  Gift,
  Crown,
  Heart,
  FileText,
  Activity,
  Award,
  Target,
  Zap,
  BarChart3,
  Clock,
  CheckCircle,
  ArrowRight,
  Edit,
  Camera,
  Mail,
  Flame,
  Loader2,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/components/ui/use-toast";

interface UserStats {
  totalOrders: number;
  totalSpent: number;
  totalDownloads: number;
  completedOrders: number;
  favoriteCategory: string;
  membershipLevel: string;
  loyaltyPoints: number;
  achievementCount: number;
  lastLoginDate: string;
  accountAge: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  color: string;
  gradient: string;
  bgColor: string;
}

interface RecentActivity {
  id: string;
  type: "order" | "download" | "review" | "login";
  title: string;
  description: string;
  date: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
}

// 🎨 COLOR SCHEME - Pastel theme như Chatbot
const colorScheme = {
  primaryGradient: "from-pink-400 via-orange-400 to-yellow-400",
  secondaryGradient: "from-pink-500 via-orange-500 to-yellow-500",
  pageBackground: "from-pink-50 via-blue-50 to-yellow-50",
  sectionBackground: "from-pink-50/80 via-blue-50/60 to-yellow-50/80",
  glassCard: "from-white/95 via-pink-50/60 to-blue-50/40",
};

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // SEO Dynamic Content - BỎ EMOJI
  const pageTitle = user
    ? user.role === "admin"
      ? `Cài đặt tài khoản Admin - ${user.name} | Template Market`
      : `Cài đặt - ${user.name} | Template Market Vietnam`
    : "Cài đặt tài khoản | Template Market - Quản lý hồ sơ cá nhân";

  const pageDescription = user
    ? `Quản lý thông tin cá nhân, bảo mật, thông báo và giao diện của ${user.name}. Cập nhật avatar, đổi mật khẩu, tùy chỉnh theme và quản lý email marketing. Tài khoản ${user.role === "admin" ? "Quản trị viên" : "Khách hàng"} tại Template Market.`
    : "Trang cài đặt tài khoản Template Market. Quản lý hồ sơ, bảo mật, thông báo và giao diện. Cập nhật thông tin cá nhân, đổi mật khẩu, tùy chỉnh trải nghiệm sử dụng.";

  const keywords = [
    "cài đặt tài khoản",
    "quản lý hồ sơ",
    "đổi mật khẩu",
    "bảo mật tài khoản",
    "cập nhật avatar",
    "thông báo email",
    "theme giao diện",
    "dark mode",
    "light mode",
    "tùy chỉnh tài khoản",
    "profile settings",
    "account security",
    user?.name,
  ]
    .filter(Boolean)
    .join(", ");

  // 🔥 FIX: No scroll manipulation
  useEffect(() => {
    return () => {};
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const { data: ordersData } = await supabase
        .from("orders")
        .select("*, order_items(*, products(*))")
        .eq("user_id", user?.id);

      const { data: downloadsData } = await supabase
        .from("downloads")
        .select("*")
        .eq("user_id", user?.id);

      const totalOrders = ordersData?.length || 0;
      const totalSpent =
        ordersData?.reduce((sum, order) => sum + (order.total_price || 0), 0) ||
        0;
      const totalDownloads = downloadsData?.length || 0;
      const completedOrders =
        ordersData?.filter((order) => order.status === "completed").length || 0;

      let membershipLevel = "Bronze";
      let loyaltyPoints = Math.floor(totalSpent / 1000) * 10;

      if (totalSpent >= 50000000) membershipLevel = "Diamond";
      else if (totalSpent >= 20000000) membershipLevel = "Platinum";
      else if (totalSpent >= 10000000) membershipLevel = "Gold";
      else if (totalSpent >= 5000000) membershipLevel = "Silver";

      const accountAge = Math.floor(
        (Date.now() - new Date(user?.createdAt || 0).getTime()) /
          (1000 * 60 * 60 * 24),
      );

      setUserStats({
        totalOrders,
        totalSpent,
        totalDownloads,
        completedOrders,
        favoriteCategory: "Template",
        membershipLevel,
        loyaltyPoints,
        achievementCount: 6,
        lastLoginDate: new Date().toISOString(),
        accountAge,
      });

      setAchievements([
        {
          id: "first_purchase",
          title: "Khách hàng mới",
          description: "Hoàn thành đơn hàng đầu tiên",
          icon: ShoppingBag,
          unlocked: totalOrders > 0,
          progress: Math.min(totalOrders, 1),
          maxProgress: 1,
          color: "text-blue-500",
          gradient: "from-blue-400 to-cyan-500",
          bgColor: "from-blue-50/90 via-cyan-50/70 to-blue-100/80",
        },
        {
          id: "big_spender",
          title: "VIP Member",
          description: "Chi tiêu trên 10 triệu VNĐ",
          icon: Crown,
          unlocked: totalSpent >= 10000000,
          progress: Math.min(totalSpent, 10000000),
          maxProgress: 10000000,
          color: "text-pink-500",
          gradient: "from-pink-400 to-rose-500",
          bgColor: "from-pink-50/90 via-rose-50/70 to-pink-100/80",
        },
        {
          id: "download_master",
          title: "Download Master",
          description: "Tải xuống 50+ files",
          icon: Download,
          unlocked: totalDownloads >= 50,
          progress: Math.min(totalDownloads, 50),
          maxProgress: 50,
          color: "text-green-500",
          gradient: "from-green-400 to-emerald-500",
          bgColor: "from-green-50/90 via-emerald-50/70 to-green-100/80",
        },
        {
          id: "loyal_customer",
          title: "Thành viên thân thiết",
          description: "Thành viên trên 365 ngày",
          icon: Heart,
          unlocked: accountAge >= 365,
          progress: Math.min(accountAge, 365),
          maxProgress: 365,
          color: "text-red-500",
          gradient: "from-red-400 to-pink-500",
          bgColor: "from-red-50/90 via-pink-50/70 to-red-100/80",
        },
        {
          id: "template_collector",
          title: "Template Collector",
          description: "Sở hữu 20+ templates",
          icon: FileText,
          unlocked: totalOrders >= 20,
          progress: Math.min(totalOrders, 20),
          maxProgress: 20,
          color: "text-purple-500",
          gradient: "from-purple-400 to-indigo-500",
          bgColor: "from-purple-50/90 via-indigo-50/70 to-purple-100/80",
        },
        {
          id: "perfect_customer",
          title: "Perfect Customer",
          description: "100% đơn hàng thành công",
          icon: CheckCircle,
          unlocked: totalOrders > 0 && completedOrders === totalOrders,
          progress: totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0,
          maxProgress: 100,
          color: "text-emerald-500",
          gradient: "from-emerald-400 to-teal-500",
          bgColor: "from-emerald-50/90 via-teal-50/70 to-emerald-100/80",
        },
      ]);

      setRecentActivity([
        {
          id: "1",
          type: "login",
          title: "Đăng nhập thành công",
          description: "Truy cập từ Chrome trên Windows",
          date: new Date().toISOString(),
          icon: Activity,
          color: "text-blue-500",
          gradient: "from-blue-400 to-cyan-500",
        },
        {
          id: "2",
          type: "order",
          title: "Đơn hàng mới",
          description: "Mua template website e-commerce",
          date: new Date(Date.now() - 86400000).toISOString(),
          icon: ShoppingBag,
          color: "text-green-500",
          gradient: "from-green-400 to-emerald-500",
        },
        {
          id: "3",
          type: "download",
          title: "Tải xuống file",
          description: "Template React Dashboard",
          date: new Date(Date.now() - 172800000).toISOString(),
          icon: Download,
          color: "text-purple-500",
          gradient: "from-purple-400 to-pink-500",
        },
      ]);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast({
        variant: "destructive",
        description: "Không thể tải dữ liệu người dùng",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  const getMembershipConfig = (level: string) => {
    const configs = {
      Diamond: {
        gradient: "from-cyan-400 via-blue-500 to-indigo-500",
        icon: "💎",
        textColor: "text-cyan-500",
        bgColor: "from-cyan-50/90 via-blue-50/70 to-indigo-100/80",
        borderColor: "border-cyan-300",
      },
      Platinum: {
        gradient: "from-slate-300 via-gray-400 to-slate-500",
        icon: "⭐",
        textColor: "text-slate-500",
        bgColor: "from-slate-50/90 via-gray-50/70 to-slate-100/80",
        borderColor: "border-slate-300",
      },
      Gold: {
        gradient: "from-yellow-400 via-amber-400 to-orange-400",
        icon: "🏆",
        textColor: "text-yellow-600",
        bgColor: "from-yellow-50/90 via-amber-50/70 to-orange-100/80",
        borderColor: "border-yellow-300",
      },
      Silver: {
        gradient: "from-gray-200 via-slate-300 to-gray-400",
        icon: "🥈",
        textColor: "text-gray-500",
        bgColor: "from-gray-50/90 via-slate-50/70 to-gray-100/80",
        borderColor: "border-gray-300",
      },
      Bronze: {
        // 🎨 FIX: Pink-Purple gradient thay vì yellow-orange
        gradient: "from-pink-400 via-purple-400 to-rose-500",
        icon: "🥉",
        textColor: "text-pink-600",
        bgColor: "from-pink-50/90 via-purple-50/70 to-rose-100/80",
        borderColor: "border-pink-300",
      },
    };
    return configs[level as keyof typeof configs] || configs.Bronze;
  };

  const membershipConfig = getMembershipConfig(
    userStats?.membershipLevel || "Bronze",
  );

  if (isLoading) {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br ${colorScheme.pageBackground} flex items-center justify-center`}
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-16 h-16 mx-auto mb-4 text-pink-500" />
          </motion.div>
          <p
            className={`text-xl font-bold bg-gradient-to-r ${colorScheme.primaryGradient} bg-clip-text text-transparent`}
          >
            Đang tải hồ sơ...
          </p>
          <p className="text-sm text-slate-600 mt-2">
            Vui lòng đợi trong giây lát
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* 🎯 HELMET ĐẶT Ở ĐÂY - NGAY SAU <> VÀ TRƯỚC <div> */}
      <Helmet>
        {/* Primary Meta Tags */}
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={keywords} />

        {/* Canonical URL */}
        <link rel="canonical" href="https://templatemarket.vn/settings" />

        {/* Open Graph / Facebook - OPTIMIZED */}
        <meta property="og:type" content="profile" />
        <meta property="og:url" content="https://templatemarket.vn/settings" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta
          property="og:image"
          content={
            user?.avatar || "https://templatemarket.vn/images/settings-og.jpg"
          }
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Template Market Vietnam" />
        <meta property="og:locale" content="vi_VN" />

        {/* Twitter Card - OPTIMIZED */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@templatemarket" />
        <meta
          name="twitter:creator"
          content={`@${user?.name?.replace(/\s+/g, "")}`}
        />
        <meta name="twitter:url" content="https://templatemarket.vn/settings" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta
          name="twitter:image"
          content={
            user?.avatar ||
            "https://templatemarket.vn/images/settings-twitter.jpg"
          }
        />
        <meta
          name="twitter:image:alt"
          content={`${user?.name} - Settings Page`}
        />

        {/* Additional Meta Tags */}
        <meta name="author" content={user?.name || "Template Market"} />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=5.0"
        />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="format-detection" content="telephone=no" />

        {/* Robots - Privacy consideration */}
        <meta name="robots" content="noindex, nofollow, noarchive" />
        <meta name="googlebot" content="noindex, nofollow" />

        {/* Security Headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta
          httpEquiv="Content-Security-Policy"
          content="upgrade-insecure-requests"
        />

        {/* Theme Color - Matching design */}
        <meta name="theme-color" content="#ec4899" />
        <meta name="msapplication-TileColor" content="#ec4899" />
        <meta name="msapplication-navbutton-color" content="#ec4899" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />

        {/* Apple Touch Icons */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />

        {/* Structured Data - Profile */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            mainEntity: {
              "@type": "Person",
              name: user?.name,
              email: user?.email,
              image: user?.avatar,
              url: `https://templatemarket.vn/profile/${user?.id}`,
              description: `${user?.name} - ${user?.role === "admin" ? "Quản trị viên" : "Khách hàng"} tại Template Market`,
              memberOf: {
                "@type": "Organization",
                name: "Template Market Vietnam",
              },
            },
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Trang chủ",
                  item: "https://templatemarket.vn",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Profile",
                  item: "https://templatemarket.vn/profile",
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: "Cài đặt",
                  item: "https://templatemarket.vn/settings",
                },
              ],
            },
          })}
        </script>

        {/* Structured Data - WebPage */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: pageTitle,
            description: pageDescription,
            url: "https://templatemarket.vn/settings",
            inLanguage: "vi-VN",
            isPartOf: {
              "@type": "WebSite",
              name: "Template Market Vietnam",
              url: "https://templatemarket.vn",
              potentialAction: {
                "@type": "SearchAction",
                target:
                  "https://templatemarket.vn/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            },
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://templatemarket.vn",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Settings",
                  item: "https://templatemarket.vn/settings",
                },
              ],
            },
          })}
        </script>

        {/* Preconnect & DNS Prefetch */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://api.templatemarket.vn" />
        <link rel="dns-prefetch" href="https://cdn.templatemarket.vn" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />

        {/* Alternate Languages */}
        <link
          rel="alternate"
          hrefLang="vi"
          href="https://templatemarket.vn/settings"
        />
        <link
          rel="alternate"
          hrefLang="en"
          href="https://templatemarket.vn/en/settings"
        />
        <link
          rel="alternate"
          hrefLang="x-default"
          href="https://templatemarket.vn/settings"
        />
      </Helmet>
      <div
        className={`min-h-screen bg-gradient-to-br ${colorScheme.pageBackground}`}
        style={{
          backgroundImage: `radial-gradient(circle at 20% 80%, rgba(236, 72, 153, 0.04) 0%, transparent 50%),
                 radial-gradient(circle at 80% 20%, rgba(244, 63, 94, 0.04) 0%, transparent 50%),
                 radial-gradient(circle at 40% 40%, rgba(220, 38, 127, 0.03) 0%, transparent 50%)`,
        }}
      >
        {/* Floating Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          {[
            {
              emoji: "👤",
              position: "top-20 right-20",
              color: "from-blue-100 to-cyan-200",
            },
            {
              emoji: "🏆",
              position: "top-40 left-10",
              color: "from-pink-100 to-rose-200",
            },
            {
              emoji: "📊",
              position: "bottom-20 right-10",
              color: "from-orange-100 to-yellow-200",
            },
            {
              emoji: "⭐",
              position: "bottom-40 left-20",
              color: "from-purple-100 to-indigo-200",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              className={`absolute ${item.position} text-4xl opacity-20`}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 10, -10, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 6 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5,
              }}
            >
              <div
                className={`p-3 rounded-full bg-gradient-to-r ${item.color} backdrop-blur-sm shadow-lg`}
              >
                {item.emoji}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="container px-4 py-8 mx-auto relative z-10">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header Section - MOBILE COMPACT, DESKTOP UNCHANGED */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-3xl mt-4 lg:mt-0"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-r ${membershipConfig.gradient} opacity-90`}
              >
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>

              <div className="relative p-5 lg:p-8 text-white">
                {/* Mobile Layout (< lg) */}
                <div className="block lg:hidden">
                  {/* Avatar + Name Row */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative">
                      <Avatar className="w-24 h-24 border-3 shadow-2xl border-white/40 ring-2 ring-white/20">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-md">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <Button
                        size="icon"
                        className={`absolute -bottom-1 -right-1 w-9 h-9 p-0 border-2 border-white rounded-full shadow-xl bg-gradient-to-r ${colorScheme.primaryGradient}`}
                      >
                        <Camera className="w-4 h-4 text-white" />
                      </Button>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h1 className="text-2xl font-bold drop-shadow-lg mb-2 truncate">
                        {user.name}
                      </h1>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-white/30 backdrop-blur-md border border-white/40 text-white px-2.5 py-1 text-xs">
                          <span className="text-base mr-1">
                            {membershipConfig.icon}
                          </span>
                          <span className="font-bold">
                            {userStats?.membershipLevel}
                          </span>
                        </Badge>
                        <Badge className="bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs px-2 py-0.5">
                          <Sparkles className="w-3 h-3 mr-0.5" />
                          Verified
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/20 backdrop-blur-md text-xs mb-3">
                    <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/20 backdrop-blur-md text-xs">
                      <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">
                        {new Date(user.createdAt).toLocaleDateString("vi-VN", {
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/20 backdrop-blur-md text-xs">
                      <Flame className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{userStats?.accountAge || 0} ngày</span>
                    </div>
                  </div>

                  {/* Quick Stats - Horizontal Scroll */}
                  <div className="flex gap-2 overflow-x-auto pb-2 mb-3 scrollbar-hide">
                    {[
                      {
                        icon: Trophy,
                        label: userStats?.loyaltyPoints || 0,
                        sublabel: "điểm",
                        gradient: colorScheme.primaryGradient,
                      },
                      {
                        icon: Award,
                        label: achievements.filter((a) => a.unlocked).length,
                        sublabel: "thành tích",
                        gradient: "from-purple-300 to-pink-400",
                      },
                      {
                        icon: Target,
                        label: userStats?.totalOrders || 0,
                        sublabel: "đơn hàng",
                        gradient: "from-blue-300 to-cyan-400",
                      },
                    ].map((stat, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/25 backdrop-blur-md border border-white/30 flex-shrink-0 min-w-[110px]"
                      >
                        <div
                          className={`p-1.5 rounded-lg bg-gradient-to-r ${stat.gradient} shadow-md`}
                        >
                          <stat.icon className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div>
                          <div className="font-bold text-sm">{stat.label}</div>
                          <div className="text-xs text-white/80">
                            {stat.sublabel}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-white/25 backdrop-blur-md border border-white/40 text-white hover:bg-white/35 h-9 text-xs"
                      asChild
                    >
                      <Link to="/settings">
                        <Settings className="w-3.5 h-3.5 mr-1.5" />
                        Cài đặt
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-white/25 backdrop-blur-md border border-white/40 text-white hover:bg-white/35 h-9 text-xs"
                      asChild
                    >
                      <Link to="/profile/edit">
                        <Edit className="w-3.5 h-3.5 mr-1.5" />
                        Chỉnh sửa
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Desktop Layout (>= lg) - UNCHANGED */}
                <div className="hidden lg:flex flex-col gap-6 lg:flex-row lg:items-center">
                  {/* Avatar */}
                  <div className="relative group">
                    <motion.div
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      className="relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/40 to-white/20 rounded-full blur-2xl" />
                      <Avatar className="relative w-32 h-32 border-4 shadow-2xl border-white/40 ring-4 ring-white/20">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="text-4xl font-bold bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-md">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                    </motion.div>
                    <Button
                      size="icon"
                      className={`absolute bottom-0 right-0 w-10 h-10 p-0 border-4 border-white rounded-full shadow-xl bg-gradient-to-r ${colorScheme.primaryGradient} hover:${colorScheme.secondaryGradient}`}
                    >
                      <Camera className="w-5 h-5 text-white" />
                    </Button>
                  </div>

                  {/* User Info */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <h1 className="text-4xl font-bold tracking-tight drop-shadow-lg">
                        {user.name}
                      </h1>
                      <Badge className="bg-white/30 backdrop-blur-md border-2 border-white/40 text-white px-4 py-1.5 shadow-xl">
                        <span className="text-xl mr-1.5">
                          {membershipConfig.icon}
                        </span>
                        <span className="font-bold">
                          {userStats?.membershipLevel}
                        </span>
                      </Badge>
                      <Badge className="bg-white/20 backdrop-blur-sm border border-white/30 text-white">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 gap-3 mb-4 text-sm md:grid-cols-3 text-white/95">
                      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/20 backdrop-blur-md shadow-sm">
                        <Mail className="w-4 h-4" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/20 backdrop-blur-md shadow-sm">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Tham gia{" "}
                          {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/20 backdrop-blur-md shadow-sm">
                        <Flame className="w-4 h-4" />
                        <span>Hoạt động {userStats?.accountAge || 0} ngày</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {[
                        {
                          icon: Trophy,
                          label: `${userStats?.loyaltyPoints || 0} điểm`,
                          gradient: colorScheme.primaryGradient,
                        },
                        {
                          icon: Award,
                          label: `${achievements.filter((a) => a.unlocked).length} thành tích`,
                          gradient: "from-purple-300 to-pink-400",
                        },
                        {
                          icon: Target,
                          label: `${userStats?.totalOrders || 0} đơn hàng`,
                          gradient: "from-blue-300 to-cyan-400",
                        },
                      ].map((stat, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.08, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/25 backdrop-blur-md border border-white/30 hover:bg-white/35 transition-all cursor-pointer shadow-lg"
                        >
                          <div
                            className={`p-1.5 rounded-lg bg-gradient-to-r ${stat.gradient} shadow-md`}
                          >
                            <stat.icon className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-semibold text-sm">
                            {stat.label}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 lg:flex-col">
                    <Button
                      size="sm"
                      className="flex-1 bg-white/25 backdrop-blur-md border-2 border-white/40 text-white hover:bg-white/35 shadow-lg"
                      asChild
                    >
                      <Link to="/settings">
                        <Settings className="w-4 h-4 mr-2" />
                        Cài đặt
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-white/25 backdrop-blur-md border-2 border-white/40 text-white hover:bg-white/35 shadow-lg"
                      asChild
                    >
                      <Link to="/profile/edit">
                        <Edit className="w-4 h-4 mr-2" />
                        Chỉnh sửa
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Add CSS for scrollbar hide */}
            <style>{`
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
              .scrollbar-hide {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
            `}</style>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
            >
              {[
                {
                  title: "Tổng đơn hàng",
                  value: userStats?.totalOrders || 0,
                  subtitle: `${userStats?.completedOrders || 0} hoàn thành`,
                  icon: ShoppingBag,
                  gradient: "from-blue-400 to-cyan-500",
                  bgColor: "from-blue-50/90 via-cyan-50/70 to-blue-100/80",
                  trend: "+12%",
                },
                {
                  title: "Tổng chi tiêu",
                  value: formatPrice(userStats?.totalSpent || 0),
                  subtitle: `Mục tiêu: ${formatPrice(50000000)}`,
                  icon: CreditCard,
                  gradient: "from-green-400 to-emerald-500",
                  bgColor: "from-green-50/90 via-emerald-50/70 to-green-100/80",
                  trend: "+8%",
                },
                {
                  title: "Downloads",
                  value: userStats?.totalDownloads || 0,
                  subtitle: "Trung bình 5 files/tháng",
                  icon: Download,
                  gradient: "from-purple-400 to-pink-500",
                  bgColor: "from-purple-50/90 via-pink-50/70 to-purple-100/80",
                  trend: "+15%",
                },
                {
                  title: "Điểm thưởng",
                  value: `${userStats?.loyaltyPoints || 0}`,
                  subtitle: "Đổi quà ngay",
                  icon: Gift,
                  gradient: colorScheme.primaryGradient,
                  bgColor: "from-pink-50/90 via-orange-50/70 to-yellow-100/80",
                  trend: "+20%",
                },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <Card
                    className={`relative overflow-hidden border-0 shadow-xl hover:shadow-2xl bg-gradient-to-br ${stat.bgColor} backdrop-blur-lg rounded-2xl transition-all duration-300 group`}
                  >
                    <div
                      className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`}
                    />
                    <CardContent className="relative p-6">
                      <div className="flex items-start justify-between mb-4">
                        <motion.div
                          whileHover={{ rotate: 360, scale: 1.2 }}
                          transition={{ duration: 0.6 }}
                          className={`p-3 rounded-xl bg-gradient-to-r ${stat.gradient} shadow-lg`}
                        >
                          <stat.icon className="w-6 h-6 text-white" />
                        </motion.div>
                        <Badge className="bg-green-100 text-green-700 border-green-200 text-xs font-semibold">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {stat.trend}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-600 mb-1">
                          {stat.title}
                        </p>
                        <p
                          className={`text-3xl font-bold mb-2 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
                        >
                          {stat.value}
                        </p>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          {stat.subtitle}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList
                  className={`grid w-full grid-cols-4 p-1.5 bg-gradient-to-r ${colorScheme.glassCard} backdrop-blur-xl border-0 shadow-lg rounded-2xl`}
                >
                  {[
                    { value: "overview", label: "Tổng quan", icon: BarChart3 },
                    { value: "stats", label: "Thống kê", icon: TrendingUp },
                    {
                      value: "achievements",
                      label: "Thành tích",
                      icon: Trophy,
                    },
                    { value: "activity", label: "Hoạt động", icon: Activity },
                  ].map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className={`data-[state=active]:bg-gradient-to-r data-[state=active]:${colorScheme.primaryGradient} data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl transition-all font-semibold`}
                    >
                      <tab.icon className="w-4 h-4 mr-2" />
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Progress Card */}
                    <Card
                      className={`border-0 shadow-xl bg-gradient-to-br ${colorScheme.glassCard} backdrop-blur-lg rounded-2xl`}
                    >
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <div
                            className={`p-2 rounded-lg bg-gradient-to-r ${colorScheme.primaryGradient} shadow-lg`}
                          >
                            <Target className="w-5 h-5 text-white" />
                          </div>
                          <span
                            className={`bg-gradient-to-r from-pink-600 via-blue-600 to-orange-600 bg-clip-text text-transparent font-bold`}
                          >
                            Mục tiêu chi tiêu
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">
                              Tiến độ hiện tại
                            </span>
                            <span
                              className={`font-bold bg-gradient-to-r ${colorScheme.primaryGradient} bg-clip-text text-transparent`}
                            >
                              {Math.min(
                                Math.round(
                                  ((userStats?.totalSpent || 0) / 50000000) *
                                    100,
                                ),
                                100,
                              )}
                              %
                            </span>
                          </div>
                          <div className="h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                            <motion.div
                              className={`h-full bg-gradient-to-r ${colorScheme.primaryGradient} rounded-full shadow-lg`}
                              initial={{ width: 0 }}
                              animate={{
                                width: `${Math.min(((userStats?.totalSpent || 0) / 50000000) * 100, 100)}%`,
                              }}
                              transition={{ duration: 1.5, ease: "easeOut" }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-slate-500 font-medium">
                            <span>
                              {formatPrice(userStats?.totalSpent || 0)}
                            </span>
                            <span>{formatPrice(50000000)}</span>
                          </div>
                        </div>

                        <Separator className="bg-pink-100" />

                        <div className="grid grid-cols-2 gap-4">
                          <div
                            className={`p-4 rounded-xl bg-gradient-to-br from-pink-50/90 to-rose-50/80 border border-pink-200 shadow-sm`}
                          >
                            <p className="text-xs text-slate-600 mb-1 font-medium">
                              Đã chi tiêu
                            </p>
                            <p
                              className={`text-2xl font-bold bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent`}
                            >
                              {formatPrice(userStats?.totalSpent || 0)}
                            </p>
                          </div>
                          <div
                            className={`p-4 rounded-xl bg-gradient-to-br from-blue-50/90 to-cyan-50/80 border border-blue-200 shadow-sm`}
                          >
                            <p className="text-xs text-slate-600 mb-1 font-medium">
                              Còn lại
                            </p>
                            <p
                              className={`text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-600 bg-clip-text text-transparent`}
                            >
                              {formatPrice(
                                Math.max(
                                  50000000 - (userStats?.totalSpent || 0),
                                  0,
                                ),
                              )}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Membership Card */}
                    <Card
                      className={`border-0 shadow-xl bg-gradient-to-br ${membershipConfig.bgColor} backdrop-blur-lg rounded-2xl overflow-hidden relative`}
                    >
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${membershipConfig.gradient} opacity-5`}
                      />
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <div
                            className={`p-2 rounded-lg bg-gradient-to-r ${membershipConfig.gradient} shadow-lg`}
                          >
                            <Crown className="w-5 h-5 text-white" />
                          </div>
                          <span
                            className={`${membershipConfig.textColor} font-bold`}
                          >
                            Cấp độ thành viên
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6 text-center">
                          <motion.div
                            className="text-8xl"
                            animate={{
                              rotate: [0, 10, -10, 0],
                              scale: [1, 1.1, 1],
                            }}
                            transition={{ duration: 3, repeat: Infinity }}
                          >
                            {membershipConfig.icon}
                          </motion.div>
                          <div>
                            <h3
                              className={`text-4xl font-bold mb-2 bg-gradient-to-r ${membershipConfig.gradient} bg-clip-text text-transparent`}
                            >
                              {userStats?.membershipLevel}
                            </h3>
                            <p className="text-sm text-slate-600 font-medium">
                              Thành viên {userStats?.membershipLevel} - Ưu đãi
                              đặc biệt
                            </p>
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600 font-medium">
                                Tiến độ lên hạng
                              </span>
                              <span className="font-bold text-slate-800">
                                75%
                              </span>
                            </div>
                            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                              <motion.div
                                className={`h-full bg-gradient-to-r ${membershipConfig.gradient} rounded-full`}
                                initial={{ width: 0 }}
                                animate={{ width: "75%" }}
                                transition={{ duration: 1.5, delay: 0.5 }}
                              />
                            </div>
                            <p className="text-xs text-slate-500">
                              Chi tiêu thêm {formatPrice(5000000)} để lên hạng
                              Gold
                            </p>
                          </div>

                          <Button
                            className={`w-full bg-gradient-to-r ${colorScheme.primaryGradient} hover:${colorScheme.secondaryGradient} text-white shadow-xl hover:shadow-2xl transition-all font-bold rounded-xl`}
                          >
                            <TrendingUp className="w-4 h-4 mr-2" />
                            Xem quyền lợi
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Stats Tab */}
                <TabsContent value="stats" className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-3">
                    {[
                      {
                        title: "Tỷ lệ thành công",
                        value: `${userStats?.totalOrders ? Math.round((userStats.completedOrders / userStats.totalOrders) * 100) : 0}%`,
                        subtitle: `${userStats?.completedOrders}/${userStats?.totalOrders} đơn`,
                        icon: CheckCircle,
                        gradient: "from-green-400 to-emerald-500",
                        bgColor:
                          "from-green-50/90 via-emerald-50/70 to-green-100/80",
                      },
                      {
                        title: "Chi tiêu trung bình",
                        value: formatPrice(
                          userStats?.totalOrders
                            ? userStats.totalSpent / userStats.totalOrders
                            : 0,
                        ),
                        subtitle: "Mỗi đơn hàng",
                        icon: BarChart3,
                        gradient: "from-blue-400 to-cyan-500",
                        bgColor:
                          "from-blue-50/90 via-cyan-50/70 to-blue-100/80",
                      },
                      {
                        title: "Danh mục yêu thích",
                        value: userStats?.favoriteCategory || "Template",
                        subtitle: "Category phổ biến nhất",
                        icon: Star,
                        gradient: colorScheme.primaryGradient,
                        bgColor:
                          "from-pink-50/90 via-orange-50/70 to-yellow-100/80",
                      },
                    ].map((stat, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                      >
                        <Card
                          className={`border-0 shadow-xl bg-gradient-to-br ${stat.bgColor} backdrop-blur-lg rounded-2xl overflow-hidden group`}
                        >
                          <CardContent className="p-6 text-center relative">
                            <div
                              className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}
                            />
                            <motion.div
                              className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${stat.gradient} mb-4 shadow-xl relative z-10`}
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.6 }}
                            >
                              <stat.icon className="w-7 h-7 text-white" />
                            </motion.div>
                            <h3 className="text-sm font-medium text-slate-600 mb-2">
                              {stat.title}
                            </h3>
                            <p
                              className={`text-4xl font-bold mb-1 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
                            >
                              {stat.value}
                            </p>
                            <p className="text-xs text-slate-500 font-medium">
                              {stat.subtitle}
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>

                {/* Achievements Tab */}
                <TabsContent value="achievements">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {achievements.map((achievement, index) => (
                      <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.03, y: -5 }}
                      >
                        <Card
                          className={`overflow-hidden border-0 shadow-xl transition-all bg-gradient-to-br ${achievement.bgColor} backdrop-blur-lg rounded-2xl ${
                            achievement.unlocked
                              ? "ring-2 ring-green-300"
                              : "opacity-70"
                          }`}
                        >
                          <CardContent className="p-6 relative">
                            {achievement.unlocked && (
                              <div className="absolute top-3 right-3">
                                <motion.div
                                  animate={{ rotate: [0, 360] }}
                                  transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "linear",
                                  }}
                                >
                                  <Sparkles className="w-5 h-5 text-yellow-500" />
                                </motion.div>
                              </div>
                            )}

                            <div className="flex items-start gap-4">
                              <motion.div
                                className={`relative p-4 rounded-2xl bg-gradient-to-r ${achievement.gradient} shadow-2xl ${achievement.unlocked ? "" : "grayscale"}`}
                                whileHover={{
                                  rotate: achievement.unlocked ? 360 : 0,
                                  scale: achievement.unlocked ? 1.1 : 1,
                                }}
                                transition={{ duration: 0.6 }}
                              >
                                <achievement.icon className="w-7 h-7 text-white" />
                                {achievement.unlocked && (
                                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                                    <CheckCircle className="w-4 h-4 text-white" />
                                  </div>
                                )}
                              </motion.div>

                              <div className="flex-1">
                                <h3 className="font-bold mb-1 flex items-center gap-2 text-slate-800">
                                  {achievement.title}
                                </h3>
                                <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                                  {achievement.description}
                                </p>
                                <div className="space-y-1.5">
                                  <div className="flex justify-between text-xs">
                                    <span className="text-slate-600 font-medium">
                                      Tiến độ
                                    </span>
                                    <span className="font-bold text-slate-800">
                                      {achievement.progress}/
                                      {achievement.maxProgress}
                                    </span>
                                  </div>
                                  <div className="h-2 bg-white/50 rounded-full overflow-hidden shadow-inner">
                                    <motion.div
                                      className={`h-full bg-gradient-to-r ${achievement.gradient} rounded-full`}
                                      initial={{ width: 0 }}
                                      animate={{
                                        width: `${(achievement.progress / achievement.maxProgress) * 100}%`,
                                      }}
                                      transition={{
                                        duration: 1,
                                        delay: index * 0.1,
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>

                {/* Activity Tab */}
                <TabsContent value="activity">
                  <Card
                    className={`border-0 shadow-xl bg-gradient-to-br ${colorScheme.glassCard} backdrop-blur-lg rounded-2xl`}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <div
                          className={`p-2 rounded-lg bg-gradient-to-r ${colorScheme.primaryGradient} shadow-lg`}
                        >
                          <Activity className="w-5 h-5 text-white" />
                        </div>
                        <span
                          className={`bg-gradient-to-r from-pink-600 via-blue-600 to-orange-600 bg-clip-text text-transparent font-bold`}
                        >
                          Hoạt động gần đây
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {recentActivity.map((activity, index) => (
                          <motion.div
                            key={activity.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02, x: 5 }}
                            className="flex items-start gap-4 p-4 rounded-xl border-0 bg-white/60 backdrop-blur-sm hover:bg-white/80 hover:shadow-lg transition-all group cursor-pointer"
                          >
                            <motion.div
                              className={`p-3 rounded-xl bg-gradient-to-br ${activity.gradient} shadow-lg`}
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.6 }}
                            >
                              <activity.icon className="w-5 h-5 text-white" />
                            </motion.div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-slate-800 mb-1">
                                {activity.title}
                              </h4>
                              <p className="text-sm text-slate-600 mb-2">
                                {activity.description}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-slate-500">
                                <Clock className="w-3 h-3" />
                                {new Date(activity.date).toLocaleString(
                                  "vi-VN",
                                )}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <ArrowUpRight className="w-4 h-4" />
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card
                className={`border-0 shadow-xl bg-gradient-to-br ${colorScheme.glassCard} backdrop-blur-lg rounded-2xl`}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div
                      className={`p-2 rounded-lg bg-gradient-to-r ${colorScheme.primaryGradient} shadow-lg`}
                    >
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <span
                      className={`bg-gradient-to-r from-pink-600 via-blue-600 to-orange-600 bg-clip-text text-transparent font-bold`}
                    >
                      Hành động nhanh
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[
                      {
                        title: "Đơn hàng",
                        description: "Quản lý đơn hàng",
                        icon: ShoppingBag,
                        gradient: "from-blue-400 to-cyan-500",
                        bgColor: "from-blue-50/80 to-cyan-50/60",
                        href: "/my-orders",
                      },
                      {
                        title: "Downloads",
                        description: "Tải xuống files",
                        icon: Download,
                        gradient: "from-green-400 to-emerald-500",
                        bgColor: "from-green-50/80 to-emerald-50/60",
                        href: "/downloads",
                      },
                      {
                        title: "Cài đặt",
                        description: "Tùy chỉnh tài khoản",
                        icon: Settings,
                        gradient: "from-purple-400 to-pink-500",
                        bgColor: "from-purple-50/80 to-pink-50/60",
                        href: "/settings",
                      },
                      {
                        title: "Mua sắm",
                        description: "Khám phá sản phẩm",
                        icon: FileText,
                        gradient: colorScheme.primaryGradient,
                        bgColor:
                          "from-pink-50/80 via-orange-50/60 to-yellow-50/80",
                        href: "/templates",
                      },
                    ].map((action, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        whileHover={{ scale: 1.05, y: -5 }}
                      >
                        <Link to={action.href}>
                          <Card
                            className={`h-full border-0 shadow-lg hover:shadow-xl bg-gradient-to-br ${action.bgColor} backdrop-blur-sm rounded-2xl transition-all cursor-pointer group`}
                          >
                            <CardContent className="p-6 text-center">
                              <motion.div
                                className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${action.gradient} mb-4 shadow-xl`}
                                whileHover={{ rotate: 360, scale: 1.2 }}
                                transition={{ duration: 0.6 }}
                              >
                                <action.icon className="w-8 h-8 text-white" />
                              </motion.div>
                              <h3 className="font-bold text-slate-800 mb-1">
                                {action.title}
                              </h3>
                              <p className="text-sm text-slate-600 mb-4">
                                {action.description}
                              </p>
                              <Button
                                size="sm"
                                className={`w-full bg-gradient-to-r ${colorScheme.primaryGradient} hover:${colorScheme.secondaryGradient} text-white shadow-lg transition-all font-semibold rounded-lg`}
                              >
                                Xem ngay
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </Button>
                            </CardContent>
                          </Card>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
