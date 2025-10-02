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
  Upload,
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
  Globe,
  Trash2,
  Save,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Info,
  Crown,
  Star,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/components/ui/use-toast";
import { useTheme } from "@/contexts/ThemeContext";

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

  // Load user preferences
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

  // Avatar upload handler
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
      {/* Floating Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 animate-float">
          <SettingsIcon className="w-8 h-8 text-blue-500 opacity-20" />
        </div>
        <div className="absolute top-1/3 right-1/4 animate-float-delay-1">
          <Shield className="w-6 h-6 text-purple-500 opacity-20" />
        </div>
        <div className="absolute bottom-1/4 left-1/3 animate-float-delay-2">
          <Bell className="text-green-500 w-7 h-7 opacity-20" />
        </div>
      </div>

      <div className="container relative z-10 px-4 py-8 mx-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="flex items-center justify-center w-16 h-16 shadow-lg rounded-2xl bg-gradient-to-r from-purple-500 to-blue-600"
              >
                <SettingsIcon className="w-8 h-8 text-white" />
              </motion.div>
            </div>
            <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text">
              Cài đặt tài khoản
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
              Quản lý thông tin cá nhân, bảo mật và tùy chọn thông báo của bạn
            </p>
          </motion.div>

          {/* User Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-0 shadow-xl bg-gradient-to-r from-white to-blue-50 dark:from-slate-800 dark:to-blue-900">
              <CardContent className="p-6">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="text-xl text-white bg-gradient-to-r from-blue-500 to-purple-600">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1">
                      <Badge className="text-white bg-gradient-to-r from-green-500 to-emerald-600">
                        {user.role === "admin" ? (
                          <Crown className="w-3 h-3" />
                        ) : (
                          <Star className="w-3 h-3" />
                        )}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold">{user.name}</h3>
                    <p className="text-muted-foreground">{user.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        variant={
                          user.role === "admin" ? "default" : "secondary"
                        }
                      >
                        {user.role === "admin" ? "Quản trị viên" : "Khách hàng"}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-green-600 border-green-600"
                      >
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
              <TabsList className="grid w-full grid-cols-4 bg-white shadow-lg dark:bg-slate-800">
                <TabsTrigger
                  value="profile"
                  className="flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Hồ sơ
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className="flex items-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  Bảo mật
                </TabsTrigger>
                <TabsTrigger
                  value="notifications"
                  className="flex items-center gap-2"
                >
                  <Bell className="w-4 h-4" />
                  Thông báo
                </TabsTrigger>
                <TabsTrigger
                  value="appearance"
                  className="flex items-center gap-2"
                >
                  <Palette className="w-4 h-4" />
                  Giao diện
                </TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile" className="mt-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  {/* Avatar Upload */}
                  <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-purple-50 dark:from-slate-800 dark:to-purple-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Camera className="w-5 h-5 text-purple-600" />
                        Ảnh đại diện
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                          <Avatar className="w-32 h-32 border-4 border-purple-200 shadow-xl">
                            <AvatarImage
                              src={
                                uploadedAvatarUrl || editAvatar || user.avatar
                              }
                            />
                            <AvatarFallback className="text-2xl text-white bg-gradient-to-r from-purple-500 to-blue-600">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <label
                            htmlFor="avatar-upload"
                            className="absolute bottom-0 right-0 p-2 text-white transition-colors bg-purple-600 rounded-full shadow-lg cursor-pointer hover:bg-purple-700"
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
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Đang tải lên... {uploadProgress}%</span>
                            </div>
                            <div className="w-full h-2 overflow-hidden bg-gray-200 rounded-full">
                              <motion.div
                                className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-600"
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
                              className="flex items-center justify-between w-full p-3 border border-green-200 rounded-lg bg-green-50 dark:bg-green-900/20"
                            >
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span className="text-sm text-green-800 dark:text-green-400">
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
                  <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-blue-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5 text-blue-600" />
                        Thông tin cá nhân
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="name" className="text-sm font-medium">
                          Họ và tên
                        </Label>
                        <Input
                          id="name"
                          className="mt-1 bg-gray-100 border-0 dark:bg-gray-800"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-sm font-medium">
                          Email
                        </Label>
                        <Input
                          id="email"
                          className="mt-1 bg-gray-100 border-0 dark:bg-gray-800"
                          value={user.email}
                          disabled
                        />
                        <p className="mt-1 text-xs text-muted-foreground">
                          Email không thể thay đổi
                        </p>
                      </div>
                      <div>
                        <Label
                          htmlFor="avatar-url"
                          className="text-sm font-medium"
                        >
                          Avatar URL (tùy chọn)
                        </Label>
                        <Input
                          id="avatar-url"
                          className="mt-1 bg-gray-100 border-0 dark:bg-gray-800"
                          value={editAvatar}
                          onChange={(e) => setEditAvatar(e.target.value)}
                          placeholder="https://example.com/avatar.jpg"
                          disabled={isLoading}
                        />
                      </div>
                      <Button
                        onClick={handleUpdateProfile}
                        disabled={isLoading || isUploadingAvatar}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
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
                <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-red-50 dark:from-slate-800 dark:to-red-900">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-red-600" />
                      Bảo mật tài khoản
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <Label
                          htmlFor="password"
                          className="text-sm font-medium"
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
                            className="pr-10 bg-gray-100 border-0 dark:bg-gray-800"
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
                          className="text-sm font-medium"
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
                            className="pr-10 bg-gray-100 border-0 dark:bg-gray-800"
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

                    <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-yellow-800 dark:text-yellow-400">
                            Yêu cầu mật khẩu
                          </h4>
                          <ul className="mt-1 space-y-1 text-sm text-yellow-700 dark:text-yellow-300">
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
                      className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      Đổi mật khẩu
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications" className="mt-6">
                <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-green-50 dark:from-slate-800 dark:to-green-900">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="w-5 h-5 text-green-600" />
                      Cài đặt thông báo
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                        <div className="flex items-start gap-3">
                          <Mail className="w-5 h-5 mt-1 text-blue-600" />
                          <div>
                            <h4 className="font-medium">Email marketing</h4>
                            <p className="text-sm text-muted-foreground">
                              Nhận thông tin về sản phẩm mới và khuyến mãi
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={emailNotifications}
                          onCheckedChange={setEmailNotifications}
                          disabled={isLoading}
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                        <div className="flex items-start gap-3">
                          <Bell className="w-5 h-5 mt-1 text-green-600" />
                          <div>
                            <h4 className="font-medium">Thông báo đơn hàng</h4>
                            <p className="text-sm text-muted-foreground">
                              Nhận thông báo về trạng thái đơn hàng
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={orderNotifications}
                          onCheckedChange={setOrderNotifications}
                          disabled={isLoading}
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                        <div className="flex items-start gap-3">
                          <Star className="w-5 h-5 mt-1 text-purple-600" />
                          <div>
                            <h4 className="font-medium">Email khuyến mãi</h4>
                            <p className="text-sm text-muted-foreground">
                              Nhận các ưu đãi và giảm giá đặc biệt
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={marketingEmails}
                          onCheckedChange={setMarketingEmails}
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <Separator />

                    <Button
                      onClick={handleUpdateNotifications}
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Lưu cài đặt thông báo
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Appearance Tab */}
              <TabsContent value="appearance" className="mt-6">
                <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-indigo-50 dark:from-slate-800 dark:to-indigo-900">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="w-5 h-5 text-indigo-600" />
                      Giao diện và hiển thị
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label className="text-sm font-medium">
                        Chế độ hiển thị
                      </Label>
                      <div className="grid grid-cols-3 gap-3 mt-3">
                        {[
                          { value: "light", label: "Sáng", icon: "☀️" },
                          { value: "dark", label: "Tối", icon: "🌙" },
                          { value: "system", label: "Hệ thống", icon: "💻" },
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setTheme(option.value as any)}
                            className={`p-4 border-2 rounded-lg text-center transition-all ${
                              theme === option.value
                                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/50"
                                : "border-gray-200 dark:border-gray-700 hover:border-indigo-300"
                            }`}
                          >
                            <div className="mb-2 text-2xl">{option.icon}</div>
                            <div className="font-medium">{option.label}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    <div className="p-4 border border-blue-200 rounded-lg bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
                      <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-800 dark:text-blue-400">
                            Thông tin giao diện
                          </h4>
                          <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
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
