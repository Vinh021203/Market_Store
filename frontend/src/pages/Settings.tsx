import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { getInitials } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { uploadFileToCloudinary } from "@/lib/uploadFileToCloudinary";
import {
  Settings as SettingsIcon,
  Camera,
  X,
  Loader2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Shield,
  Bell,
  Palette,
  Save,
  CheckCircle,
  AlertTriangle,
  Info,
  Crown,
  Star,
  Sparkles,
  Zap,
  TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/components/ui/use-toast";
import { useTheme } from "@/contexts/ThemeContext";

// 🎨 COLOR SCHEME - Pastel theme
const colorScheme = {
  primaryGradient: "from-pink-400 via-orange-400 to-yellow-400",
  secondaryGradient: "from-pink-500 via-orange-500 to-yellow-500",
  pageBackground: "from-pink-50 via-blue-50 to-yellow-50",
  sectionBackground: "from-pink-50/80 via-blue-50/60 to-yellow-50/80",
  glassCard: "from-white/95 via-pink-50/60 to-blue-50/40",
};

const Settings: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("profile");
  const [editName, setEditName] = useState(user?.name || "");
  const [editAvatar, setEditAvatar] = useState(user?.avatar || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [orderNotifications, setOrderNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [uploadedAvatarUrl, setUploadedAvatarUrl] = useState<string | null>(
    null,
  );
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const loadUserPreferences = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("email_notifications, order_notifications, marketing_emails")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        if (data) {
          setEmailNotifications(data.email_notifications ?? true);
          setOrderNotifications(data.order_notifications ?? true);
          setMarketingEmails(data.marketing_emails ?? false);
        }
      } catch (error) {
        console.error("Error loading user preferences:", error);
      }
    };

    loadUserPreferences();
  }, [user]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast({
        variant: "destructive",
        description: "Vui lòng chọn file ảnh hợp lệ (JPEG, PNG, GIF, WEBP)",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        description: "Kích thước ảnh phải nhỏ hơn 5MB",
      });
      return;
    }

    setIsUploadingAvatar(true);
    setUploadProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const result = await uploadFileToCloudinary(file);

      clearInterval(progressInterval);
      setUploadProgress(100);

      setUploadedAvatarUrl(result.url);
      setEditAvatar(result.url);

      toast({
        description: "Avatar đã được tải lên thành công",
        duration: 3000,
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        variant: "destructive",
        description: "Có lỗi xảy ra khi tải ảnh lên",
      });
    } finally {
      setIsUploadingAvatar(false);
      setUploadProgress(0);
    }
  };

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    try {
      const success = await updateProfile({
        name: editName,
        avatar: uploadedAvatarUrl || editAvatar,
      });

      if (success) {
        setUploadedAvatarUrl(null);
        toast({
          description: "Cập nhật hồ sơ thành công",
          duration: 3000,
        });
      } else {
        throw new Error("Update failed");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Cập nhật hồ sơ thất bại",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (password !== confirmPassword) {
      toast({ variant: "destructive", description: "Mật khẩu không khớp" });
      return;
    }
    if (password.length < 8) {
      toast({
        variant: "destructive",
        description: "Mật khẩu phải có ít nhất 8 ký tự",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw new Error("Password change failed");
      toast({
        description: "Đổi mật khẩu thành công",
        duration: 3000,
      });
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast({ variant: "destructive", description: "Đổi mật khẩu thất bại" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateNotifications = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          email_notifications: emailNotifications,
          order_notifications: orderNotifications,
          marketing_emails: marketingEmails,
        })
        .eq("id", user?.id);
      if (error) throw new Error("Failed to update notifications");
      toast({
        description: "Cập nhật thông báo thành công",
        duration: 3000,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Cập nhật thông báo thất bại",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
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
            emoji: "⚙️",
            position: "top-20 right-20",
            color: "from-purple-100 to-indigo-200",
          },
          {
            emoji: "🔒",
            position: "top-40 left-10",
            color: "from-blue-100 to-cyan-200",
          },
          {
            emoji: "🔔",
            position: "bottom-20 right-10",
            color: "from-green-100 to-emerald-200",
          },
          {
            emoji: "🎨",
            position: "bottom-40 left-20",
            color: "from-pink-100 to-rose-200",
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
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <h1
                className={`flex items-center gap-3 text-4xl font-bold bg-gradient-to-r ${colorScheme.primaryGradient} bg-clip-text text-transparent`}
              >
                <div
                  className={`p-2 rounded-xl bg-gradient-to-r ${colorScheme.primaryGradient} shadow-lg`}
                >
                  <SettingsIcon className="w-8 h-8 text-white" />
                </div>
                Cài đặt tài khoản
              </h1>
              <p className="mt-2 text-slate-600 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Quản lý thông tin cá nhân, bảo mật và tùy chọn thông báo
              </p>
            </div>
          </motion.div>

          {/* User Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card
              className={`border-0 shadow-xl bg-gradient-to-br from-purple-50/90 via-blue-50/70 to-indigo-100/80 backdrop-blur-lg rounded-2xl`}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback
                        className={`text-xl text-white bg-gradient-to-r ${colorScheme.primaryGradient}`}
                      >
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1">
                      <Badge
                        className={`bg-gradient-to-r ${colorScheme.primaryGradient} text-white border-0 shadow-lg`}
                      >
                        {user.role === "admin" ? (
                          <Crown className="w-3 h-3" />
                        ) : (
                          <Star className="w-3 h-3" />
                        )}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-slate-800">
                      {user.name}
                    </h3>
                    <p className="text-slate-600">{user.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                        {user.role === "admin" ? "Quản trị viên" : "Khách hàng"}
                      </Badge>
                      <Badge className="bg-green-100 text-green-700 border-green-200">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Đã xác thực
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Settings Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList
                className={`grid w-full grid-cols-4 p-1.5 bg-gradient-to-r ${colorScheme.glassCard} backdrop-blur-xl border-0 shadow-lg rounded-2xl`}
              >
                {[
                  { value: "profile", label: "Hồ sơ", icon: User },
                  { value: "security", label: "Bảo mật", icon: Shield },
                  { value: "notifications", label: "Thông báo", icon: Bell },
                  { value: "appearance", label: "Giao diện", icon: Palette },
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

              {/* Profile Tab */}
              <TabsContent value="profile" className="mt-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  {/* Avatar Upload */}
                  <Card
                    className={`border-0 shadow-xl bg-gradient-to-br from-purple-50/90 via-pink-50/70 to-purple-100/80 backdrop-blur-lg rounded-2xl`}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Camera
                          className={`w-5 h-5 bg-gradient-to-r ${colorScheme.primaryGradient} bg-clip-text text-transparent`}
                        />
                        <span
                          className={`bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent font-bold`}
                        >
                          Ảnh đại diện
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                          <Avatar className="w-32 h-32 border-4 border-pink-200 shadow-xl">
                            <AvatarImage
                              src={
                                uploadedAvatarUrl || editAvatar || user.avatar
                              }
                            />
                            <AvatarFallback
                              className={`text-2xl text-white bg-gradient-to-r ${colorScheme.primaryGradient}`}
                            >
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <label
                            htmlFor="avatar-upload"
                            className={`absolute bottom-0 right-0 p-2 text-white rounded-full shadow-lg cursor-pointer bg-gradient-to-r ${colorScheme.primaryGradient} hover:${colorScheme.secondaryGradient} transition-all`}
                          >
                            <Camera className="w-4 h-4" />
                          </label>
                        </div>

                        <Input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          disabled={isUploadingAvatar || isLoading}
                          className="hidden"
                        />

                        {isUploadingAvatar && (
                          <div className="w-full space-y-2">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Đang tải lên... {uploadProgress}%</span>
                            </div>
                            <div className="w-full h-2 overflow-hidden bg-pink-100 rounded-full">
                              <motion.div
                                className={`h-2 rounded-full bg-gradient-to-r ${colorScheme.primaryGradient}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${uploadProgress}%` }}
                                transition={{ duration: 0.3 }}
                              />
                            </div>
                          </div>
                        )}

                        <AnimatePresence>
                          {uploadedAvatarUrl && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className="flex items-center justify-between w-full p-3 border-0 rounded-xl bg-green-50/80 backdrop-blur-sm shadow-sm"
                            >
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span className="text-sm text-green-800 font-medium">
                                  Ảnh mới đã được tải lên
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setUploadedAvatarUrl(null)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Personal Info */}
                  <Card
                    className={`border-0 shadow-xl bg-gradient-to-br from-blue-50/90 via-cyan-50/70 to-blue-100/80 backdrop-blur-lg rounded-2xl`}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5 text-blue-600" />
                        <span
                          className={`bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent font-bold`}
                        >
                          Thông tin cá nhân
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label
                          htmlFor="name"
                          className="text-sm font-medium text-slate-700"
                        >
                          Họ và tên
                        </Label>
                        <Input
                          id="name"
                          className="mt-1 bg-white/80 border-blue-200 focus:border-blue-300 focus:ring-blue-300"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="email"
                          className="text-sm font-medium text-slate-700"
                        >
                          Email
                        </Label>
                        <Input
                          id="email"
                          className="mt-1 bg-white/50 border-blue-200"
                          value={user.email}
                          disabled
                        />
                        <p className="mt-1 text-xs text-slate-500">
                          Email không thể thay đổi
                        </p>
                      </div>
                      <div>
                        <Label
                          htmlFor="avatar-url"
                          className="text-sm font-medium text-slate-700"
                        >
                          Avatar URL (tùy chọn)
                        </Label>
                        <Input
                          id="avatar-url"
                          className="mt-1 bg-white/80 border-blue-200 focus:border-blue-300 focus:ring-blue-300"
                          value={editAvatar}
                          onChange={(e) => setEditAvatar(e.target.value)}
                          placeholder="https://example.com/avatar.jpg"
                          disabled={isLoading}
                        />
                      </div>
                      <Button
                        onClick={handleUpdateProfile}
                        disabled={isLoading || isUploadingAvatar}
                        className={`w-full bg-gradient-to-r ${colorScheme.primaryGradient} hover:${colorScheme.secondaryGradient} text-white shadow-lg`}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Đang cập nhật...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Cập nhật thông tin
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="mt-6">
                <Card
                  className={`border-0 shadow-xl bg-gradient-to-br from-red-50/90 via-pink-50/70 to-rose-100/80 backdrop-blur-lg rounded-2xl`}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-red-600" />
                      <span
                        className={`bg-gradient-to-r from-red-600 via-pink-600 to-rose-600 bg-clip-text text-transparent font-bold`}
                      >
                        Bảo mật tài khoản
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <Label
                          htmlFor="password"
                          className="text-sm font-medium text-slate-700"
                        >
                          Mật khẩu mới
                        </Label>
                        <div className="relative mt-1">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                            className="pr-10 bg-white/80 border-pink-200 focus:border-pink-300 focus:ring-pink-300"
                            placeholder="Nhập mật khẩu mới"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <div>
                        <Label
                          htmlFor="confirmPassword"
                          className="text-sm font-medium text-slate-700"
                        >
                          Xác nhận mật khẩu
                        </Label>
                        <div className="relative mt-1">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={isLoading}
                            className="pr-10 bg-white/80 border-pink-200 focus:border-pink-300 focus:ring-pink-300"
                            placeholder="Xác nhận mật khẩu"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border-0 rounded-xl bg-yellow-50/80 backdrop-blur-sm shadow-sm">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-yellow-800">
                            Yêu cầu mật khẩu
                          </h4>
                          <ul className="mt-1 space-y-1 text-sm text-yellow-700">
                            <li>• Ít nhất 8 ký tự</li>
                            <li>• Bao gồm chữ hoa và chữ thường</li>
                            <li>• Có ít nhất 1 số</li>
                            <li>• Có ít nhất 1 ký tự đặc biệt</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handleChangePassword}
                      disabled={isLoading || !password || !confirmPassword}
                      className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-lg"
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      Đổi mật khẩu
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications" className="mt-6">
                <Card
                  className={`border-0 shadow-xl bg-gradient-to-br from-green-50/90 via-emerald-50/70 to-green-100/80 backdrop-blur-lg rounded-2xl`}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="w-5 h-5 text-green-600" />
                      <span
                        className={`bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 bg-clip-text text-transparent font-bold`}
                      >
                        Cài đặt thông báo
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      {[
                        {
                          icon: Mail,
                          title: "Email marketing",
                          description:
                            "Nhận thông tin về sản phẩm mới và khuyến mãi",
                          checked: emailNotifications,
                          onChange: setEmailNotifications,
                          color: "text-blue-600",
                        },
                        {
                          icon: Bell,
                          title: "Thông báo đơn hàng",
                          description: "Nhận thông báo về trạng thái đơn hàng",
                          checked: orderNotifications,
                          onChange: setOrderNotifications,
                          color: "text-green-600",
                        },
                        {
                          icon: Star,
                          title: "Email khuyến mãi",
                          description: "Nhận các ưu đãi và giảm giá đặc biệt",
                          checked: marketingEmails,
                          onChange: setMarketingEmails,
                          color: "text-purple-600",
                        },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 rounded-xl bg-white/80 backdrop-blur-sm shadow-sm border border-green-100"
                        >
                          <div className="flex items-start gap-3">
                            <item.icon
                              className={`w-5 h-5 mt-1 ${item.color}`}
                            />
                            <div>
                              <h4 className="font-semibold text-slate-800">
                                {item.title}
                              </h4>
                              <p className="text-sm text-slate-600">
                                {item.description}
                              </p>
                            </div>
                          </div>
                          <Switch
                            checked={item.checked}
                            onCheckedChange={item.onChange}
                            disabled={isLoading}
                          />
                        </div>
                      ))}
                    </div>

                    <Separator className="bg-green-200" />

                    <Button
                      onClick={handleUpdateNotifications}
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Lưu cài đặt thông báo
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Appearance Tab */}
              <TabsContent value="appearance" className="mt-6">
                <Card
                  className={`border-0 shadow-xl bg-gradient-to-br from-indigo-50/90 via-purple-50/70 to-indigo-100/80 backdrop-blur-lg rounded-2xl`}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="w-5 h-5 text-indigo-600" />
                      <span
                        className={`bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent font-bold`}
                      >
                        Giao diện và hiển thị
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label className="text-sm font-medium text-slate-700">
                        Chế độ hiển thị
                      </Label>
                      <div className="grid grid-cols-3 gap-4 mt-3">
                        {[
                          { value: "light", label: "Sáng", icon: "☀️" },
                          { value: "dark", label: "Tối", icon: "🌙" },
                          { value: "system", label: "Hệ thống", icon: "💻" },
                        ].map((option) => (
                          <motion.button
                            key={option.value}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setTheme(option.value as any)}
                            className={`p-6 border-2 rounded-2xl text-center transition-all shadow-lg ${
                              theme === option.value
                                ? "border-indigo-500 bg-indigo-50/80 backdrop-blur-sm shadow-xl"
                                : "border-pink-200 bg-white/80 hover:border-indigo-300"
                            }`}
                          >
                            <div className="mb-3 text-3xl">{option.icon}</div>
                            <div className="font-semibold text-slate-800">
                              {option.label}
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    <Separator className="bg-indigo-200" />

                    <div className="p-4 border-0 rounded-xl bg-blue-50/80 backdrop-blur-sm shadow-sm">
                      <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-blue-800">
                            Thông tin giao diện
                          </h4>
                          <p className="mt-1 text-sm text-blue-700">
                            Chế độ "Hệ thống" sẽ tự động thay đổi theo cài đặt
                            của thiết bị bạn. Các thay đổi sẽ được lưu và áp
                            dụng cho tất cả các phiên đăng nhập.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
