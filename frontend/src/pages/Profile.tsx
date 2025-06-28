import React, { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { getInitials } from "@/lib/auth";
import { formatPrice } from "@/lib/products";
import { supabase } from "@/lib/supabase";
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
  Phone,
  MapPin,
  Globe,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
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
}

interface RecentActivity {
  id: string;
  type: "order" | "download" | "review" | "login";
  title: string;
  description: string;
  date: string;
  icon: React.ElementType;
  color: string;
}

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "stats" | "achievements" | "activity"
  >("overview");

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      // Fetch user statistics
      const { data: ordersData } = await supabase
        .from("orders")
        .select("*, order_items(*, products(*))")
        .eq("user_id", user?.id);

      const { data: downloadsData } = await supabase
        .from("downloads")
        .select("*")
        .eq("user_id", user?.id);

      // Calculate stats
      const totalOrders = ordersData?.length || 0;
      const totalSpent =
        ordersData?.reduce((sum, order) => sum + (order.total_price || 0), 0) ||
        0;
      const totalDownloads = downloadsData?.length || 0;
      const completedOrders =
        ordersData?.filter((order) => order.status === "completed").length || 0;

      // Calculate membership level
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
        achievementCount: 8,
        lastLoginDate: new Date().toISOString(),
        accountAge,
      });

      // Generate achievements
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
        },
        {
          id: "big_spender",
          title: "Người mua sắm VIP",
          description: "Chi tiêu trên 10 triệu VNĐ",
          icon: Crown,
          unlocked: totalSpent >= 10000000,
          progress: Math.min(totalSpent, 10000000),
          maxProgress: 10000000,
          color: "text-yellow-500",
        },
        {
          id: "download_master",
          title: "Chuyên gia tải xuống",
          description: "Tải xuống 50+ files",
          icon: Download,
          unlocked: totalDownloads >= 50,
          progress: Math.min(totalDownloads, 50),
          maxProgress: 50,
          color: "text-green-500",
        },
        {
          id: "loyal_customer",
          title: "Khách hàng thân thiết",
          description: "Thành viên trên 365 ngày",
          icon: Heart,
          unlocked: accountAge >= 365,
          progress: Math.min(accountAge, 365),
          maxProgress: 365,
          color: "text-red-500",
        },
        {
          id: "template_collector",
          title: "Nhà sưu tập Template",
          description: "Sở hữu 20+ templates",
          icon: FileText,
          unlocked: totalOrders >= 20,
          progress: Math.min(totalOrders, 20),
          maxProgress: 20,
          color: "text-purple-500",
        },
        {
          id: "perfect_customer",
          title: "Khách hàng hoàn hảo",
          description: "100% đơn hàng thành công",
          icon: CheckCircle,
          unlocked: totalOrders > 0 && completedOrders === totalOrders,
          progress: totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0,
          maxProgress: 100,
          color: "text-emerald-500",
        },
      ]);

      // Generate recent activity
      setRecentActivity([
        {
          id: "1",
          type: "login",
          title: "Đăng nhập thành công",
          description: "Truy cập từ Chrome trên Windows",
          date: new Date().toISOString(),
          icon: Activity,
          color: "text-blue-500",
        },
        {
          id: "2",
          type: "order",
          title: "Đơn hàng mới",
          description: "Mua template website e-commerce",
          date: new Date(Date.now() - 86400000).toISOString(),
          icon: ShoppingBag,
          color: "text-green-500",
        },
        {
          id: "3",
          type: "download",
          title: "Tải xuống file",
          description: "Template React Dashboard",
          date: new Date(Date.now() - 172800000).toISOString(),
          icon: Download,
          color: "text-purple-500",
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

  const getMembershipColor = (level: string) => {
    switch (level) {
      case "Diamond":
        return "from-cyan-500 to-blue-600";
      case "Platinum":
        return "from-gray-400 to-gray-600";
      case "Gold":
        return "from-yellow-400 to-yellow-600";
      case "Silver":
        return "from-gray-300 to-gray-400";
      default:
        return "from-orange-400 to-orange-600";
    }
  };

  const getMembershipIcon = (level: string) => {
    switch (level) {
      case "Diamond":
        return "💎";
      case "Platinum":
        return "⭐";
      case "Gold":
        return "🏆";
      case "Silver":
        return "🥈";
      default:
        return "🥉";
    }
  };

  if (isLoading) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="ml-3 text-lg">Đang tải hồ sơ...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-3xl"
        >
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative p-8 text-white">
            <div className="flex flex-col items-center gap-6 md:flex-row">
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 shadow-2xl border-white/20">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="text-3xl bg-white/10">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  className="absolute bottom-0 right-0 w-8 h-8 p-0 bg-white/20 hover:bg-white/30"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center gap-3 mb-2 md:justify-start">
                  <h1 className="text-4xl font-bold">{user.name}</h1>
                  <Badge
                    className={`bg-gradient-to-r ${getMembershipColor(userStats?.membershipLevel || "Bronze")} text-white border-0`}
                  >
                    {getMembershipIcon(userStats?.membershipLevel || "Bronze")}{" "}
                    {userStats?.membershipLevel}
                  </Badge>
                </div>

                <div className="flex flex-col gap-2 mb-4 text-white/80 md:flex-row md:items-center md:gap-6">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Thành viên từ{" "}
                    {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Hoạt động {userStats?.accountAge || 0} ngày
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10">
                    <Trophy className="w-4 h-4" />
                    <span className="font-medium">
                      {userStats?.loyaltyPoints || 0} điểm
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10">
                    <Award className="w-4 h-4" />
                    <span className="font-medium">
                      {achievements.filter((a) => a.unlocked).length} thành tích
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="secondary" size="sm" asChild>
                  <Link to="/settings">
                    <Settings className="w-4 h-4 mr-2" />
                    Cài đặt
                  </Link>
                </Button>
                <Button variant="secondary" size="sm" asChild>
                  <Link to="/profile/edit">
                    <Edit className="w-4 h-4 mr-2" />
                    Chỉnh sửa
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg dark:bg-gray-800">
          {[
            { id: "overview", label: "Tổng quan", icon: BarChart3 },
            { id: "stats", label: "Thống kê", icon: TrendingUp },
            { id: "achievements", label: "Thành tích", icon: Trophy },
            { id: "activity", label: "Hoạt động", icon: Activity },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab.id as any)}
              className="flex-1"
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Content based on active tab */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "overview" && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {/* Quick Stats Cards */}
              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Tổng đơn hàng
                      </p>
                      <p className="text-3xl font-bold">
                        {userStats?.totalOrders || 0}
                      </p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-full dark:bg-blue-900">
                      <ShoppingBag className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-green-500">+12%</span>
                      <span className="text-muted-foreground">
                        so với tháng trước
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Tổng chi tiêu
                      </p>
                      <p className="text-3xl font-bold">
                        {formatPrice(userStats?.totalSpent || 0)}
                      </p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-full dark:bg-green-900">
                      <CreditCard className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Target className="w-4 h-4 text-blue-500" />
                      <span className="text-muted-foreground">
                        Mục tiêu: 50M VNĐ
                      </span>
                    </div>
                    <Progress
                      value={Math.min(
                        ((userStats?.totalSpent || 0) / 50000000) * 100,
                        100,
                      )}
                      className="mt-2"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Downloads
                      </p>
                      <p className="text-3xl font-bold">
                        {userStats?.totalDownloads || 0}
                      </p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-full dark:bg-purple-900">
                      <Download className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      <span className="text-muted-foreground">
                        Trung bình 5 files/tháng
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Điểm thưởng
                      </p>
                      <p className="text-3xl font-bold">
                        {userStats?.loyaltyPoints || 0}
                      </p>
                    </div>
                    <div className="p-3 bg-yellow-100 rounded-full dark:bg-yellow-900">
                      <Gift className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button size="sm" variant="outline" className="w-full">
                      <Gift className="w-4 h-4 mr-2" />
                      Đổi quà
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "stats" && (
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Thống kê chi tiết
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Đơn hàng hoàn thành
                    </span>
                    <span className="font-bold">
                      {userStats?.completedOrders || 0}/
                      {userStats?.totalOrders || 0}
                    </span>
                  </div>
                  <Progress
                    value={
                      userStats?.totalOrders
                        ? (userStats.completedOrders / userStats.totalOrders) *
                          100
                        : 0
                    }
                  />

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Danh mục yêu thích</span>
                      <Badge variant="secondary">
                        {userStats?.favoriteCategory}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Tỷ lệ thành công</span>
                      <span className="font-medium">
                        {userStats?.totalOrders
                          ? Math.round(
                              (userStats.completedOrders /
                                userStats.totalOrders) *
                                100,
                            )
                          : 0}
                        %
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Chi tiêu trung bình</span>
                      <span className="font-medium">
                        {formatPrice(
                          userStats?.totalOrders
                            ? userStats.totalSpent / userStats.totalOrders
                            : 0,
                        )}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="w-5 h-5" />
                    Cấp độ thành viên
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-center">
                    <div className="text-6xl">
                      {getMembershipIcon(
                        userStats?.membershipLevel || "Bronze",
                      )}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">
                        {userStats?.membershipLevel}
                      </h3>
                      <p className="text-muted-foreground">
                        Thành viên {userStats?.membershipLevel}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Tiến độ lên hạng</span>
                        <span>75%</span>
                      </div>
                      <Progress value={75} />
                      <p className="text-xs text-muted-foreground">
                        Chi tiêu thêm {formatPrice(5000000)} để lên hạng Gold
                      </p>
                    </div>

                    <Button className="w-full" variant="outline">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Xem quyền lợi
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "achievements" && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {achievements.map((achievement) => (
                <Card
                  key={achievement.id}
                  className={`overflow-hidden ${achievement.unlocked ? "border-green-200 bg-green-50 dark:bg-green-950" : "opacity-60"}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-3 rounded-full ${achievement.unlocked ? "bg-green-100 dark:bg-green-900" : "bg-gray-100 dark:bg-gray-800"}`}
                      >
                        <achievement.icon
                          className={`w-6 h-6 ${achievement.unlocked ? achievement.color : "text-gray-400"}`}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{achievement.title}</h3>
                          {achievement.unlocked && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                        <p className="mb-3 text-sm text-muted-foreground">
                          {achievement.description}
                        </p>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Tiến độ</span>
                            <span>
                              {achievement.progress}/{achievement.maxProgress}
                            </span>
                          </div>
                          <Progress
                            value={
                              (achievement.progress / achievement.maxProgress) *
                              100
                            }
                            className="h-2"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeTab === "activity" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Hoạt động gần đây
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 p-4 border rounded-lg"
                    >
                      <div
                        className={`p-2 rounded-full bg-gray-100 dark:bg-gray-800`}
                      >
                        <activity.icon
                          className={`w-4 h-4 ${activity.color}`}
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{activity.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {activity.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {new Date(activity.date).toLocaleString("vi-VN")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Hành động nhanh</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="h-auto p-4" asChild>
                <Link to="/my-orders">
                  <div className="text-center">
                    <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                    <div className="font-medium">Đơn hàng</div>
                    <div className="text-sm text-muted-foreground">
                      Quản lý đơn hàng
                    </div>
                  </div>
                </Link>
              </Button>

              <Button variant="outline" className="h-auto p-4" asChild>
                <Link to="/downloads">
                  <div className="text-center">
                    <Download className="w-8 h-8 mx-auto mb-2 text-green-500" />
                    <div className="font-medium">Downloads</div>
                    <div className="text-sm text-muted-foreground">
                      Tải xuống files
                    </div>
                  </div>
                </Link>
              </Button>

              <Button variant="outline" className="h-auto p-4" asChild>
                <Link to="/settings">
                  <div className="text-center">
                    <Settings className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                    <div className="font-medium">Cài đặt</div>
                    <div className="text-sm text-muted-foreground">
                      Tùy chỉnh tài khoản
                    </div>
                  </div>
                </Link>
              </Button>

              <Button variant="outline" className="h-auto p-4" asChild>
                <Link to="/templates">
                  <div className="text-center">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                    <div className="font-medium">Mua sắm</div>
                    <div className="text-sm text-muted-foreground">
                      Khám phá sản phẩm
                    </div>
                  </div>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
