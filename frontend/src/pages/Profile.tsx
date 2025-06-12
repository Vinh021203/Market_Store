import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { getInitials } from "@/lib/auth";
import { formatPrice } from "@/lib/products";
import { supabase } from "@/lib/supabase";
import { uploadFileToCloudinary } from "@/lib/uploadFileToCloudinary";
import {
  User,
  Download,
  ShoppingBag,
  Settings,
  Calendar,
  Mail,
  CreditCard,
  FileText,
  Lock,
  Camera,
  Upload,
  X,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Order, Download as DownloadType } from "@/types";

interface UserStats {
  totalOrders: number;
  totalSpent: number;
  totalDownloads: number;
  memberSince: string;
}

const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [editName, setEditName] = useState(user?.name || "");
  const [editAvatar, setEditAvatar] = useState(user?.avatar || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [orderNotifications, setOrderNotifications] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [downloads, setDownloads] = useState<DownloadType[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Avatar upload states
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [uploadedAvatarUrl, setUploadedAvatarUrl] = useState<string | null>(
    null,
  );
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      setIsLoading(true);

      try {
        // Lấy danh sách đơn hàng + sản phẩm trong từng đơn hàng
        const { data: ordersData, error: ordersError } = await supabase
          .from("orders")
          .select("*, order_items(*, products(*))")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (ordersError || !ordersData) throw new Error("Lỗi khi lấy đơn hàng");

        const totalOrders = ordersData.length;
        const totalSpent = ordersData.reduce(
          (sum, order) => sum + (order.total_price || 0),
          0,
        );

        const mappedOrders = ordersData.map((order) => ({
          ...order,
          items: (order.order_items ?? []).map((item) => ({
            ...item,
            product: item.products ?? null,
          })),
        }));

        // Lấy dữ liệu downloads
        const { data: downloadsData, error: downloadsError } = await supabase
          .from("downloads")
          .select("*")
          .eq("user_id", user.id);

        if (downloadsError || !downloadsData)
          throw new Error("Lỗi khi lấy dữ liệu tải xuống");

        setUserStats({
          totalOrders,
          totalSpent,
          totalDownloads: downloadsData.length,
          memberSince: user.createdAt,
        });

        setRecentOrders(mappedOrders);
        setDownloads(downloadsData);
      } catch (err) {
        setError("Không thể tải dữ liệu. Vui lòng thử lại.");
        toast({ variant: "destructive", description: "Không thể tải dữ liệu" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  // Avatar upload handler
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
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
      // Simulate progress
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
        description: `Avatar đã được tải lên thành công (${result.size}, ${result.format})`,
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

  const handleRemoveUploadedAvatar = () => {
    setUploadedAvatarUrl(null);
    setEditAvatar(user?.avatar || "");
  };

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    try {
      const success = await updateProfile({
        name: editName,
        avatar: uploadedAvatarUrl || editAvatar,
      });

      if (success) {
        setUploadedAvatarUrl(null);
        toast({ description: "Cập nhật hồ sơ thành công" });
      } else {
        throw new Error("Update failed");
      }
    } catch (err) {
      setError("Cập nhật hồ sơ thất bại");
      toast({ variant: "destructive", description: "Cập nhật hồ sơ thất bại" });
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
      toast({ description: "Đổi mật khẩu thành công" });
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError("Đổi mật khẩu thất bại");
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
        })
        .eq("id", user.id);
      if (error) throw new Error("Failed to update notifications");
      toast({ description: "Cập nhật thông báo thành công" });
    } catch (err) {
      setError("Cập nhật thông báo thất bại");
      toast({
        variant: "destructive",
        description: "Cập nhật thông báo thất bại",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (downloadId: string) => {
    try {
      const { data, error } = await supabase
        .from("downloads")
        .select("download_url")
        .eq("id", downloadId)
        .single();

      if (error || !data?.download_url) throw new Error("Không tìm thấy file");

      const url = data.download_url;
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener";
      link.download = url.split("/").pop() || "download";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({ description: "Bắt đầu tải file..." });
    } catch (err) {
      toast({
        variant: "destructive",
        description: "Tải file thất bại",
      });
    }
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      {error && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded">
          {error}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4 text-center">
                <div className="relative w-20 h-20 mx-auto">
                  <Avatar className="w-20 h-20">
                    <AvatarImage
                      src={uploadedAvatarUrl || editAvatar || user.avatar}
                    />
                    <AvatarFallback className="text-lg">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>

                  {uploadedAvatarUrl && (
                    <div className="absolute flex items-center justify-center w-6 h-6 bg-green-500 rounded-full -top-1 -right-1">
                      <Camera className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <Badge
                    variant={user.role === "admin" ? "default" : "secondary"}
                    className="mt-2"
                  >
                    {user.role === "admin" ? "Quản trị viên" : "Khách hàng"}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold">
                      {userStats?.totalOrders || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Đơn hàng
                    </div>
                  </div>
                  <div>
                    <div className="text-lg font-bold">
                      {userStats?.totalDownloads || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Downloads
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Thống kê</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Tổng chi tiêu</span>
                </div>
                <span className="font-medium">
                  {formatPrice(userStats?.totalSpent || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Thành viên từ</span>
                </div>
                <span className="font-medium">
                  {userStats?.memberSince
                    ? new Date(userStats.memberSince).toLocaleDateString(
                        "vi-VN",
                      )
                    : "-"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Tabs defaultValue="orders" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger
                value="orders"
                className="flex items-center space-x-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Đơn hàng</span>
              </TabsTrigger>
              <TabsTrigger
                value="downloads"
                className="flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Downloads</span>
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="flex items-center space-x-2"
              >
                <Settings className="w-4 h-4" />
                <span>Cài đặt</span>
              </TabsTrigger>
            </TabsList>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Lịch sử đơn hàng</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span className="ml-2">Đang tải...</span>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentOrders.map((order) => (
                        <div key={order.id} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-medium">
                                Đơn hàng #{order.id.slice(0, 8)}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {new Date(order.created_at).toLocaleDateString(
                                  "vi-VN",
                                )}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">
                                {formatPrice(order.total_price)}
                              </div>
                              <Badge
                                variant={
                                  order.status === "completed"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {order.status === "completed"
                                  ? "Hoàn thành"
                                  : "Đang xử lý"}
                              </Badge>
                            </div>
                          </div>
                          <div className="space-y-1">
                            {order.items.map((item, index) => (
                              <div
                                key={index}
                                className="flex items-center space-x-2 text-sm"
                              >
                                {item.product ? (
                                  <>
                                    {item.product.category === "template" ? (
                                      <FileText className="w-4 h-4 text-blue-500" />
                                    ) : (
                                      <Download className="w-4 h-4 text-green-500" />
                                    )}
                                    <span>{item.product.title}</span>
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {item.product.category === "template"
                                        ? "Template"
                                        : "E-book"}
                                    </Badge>
                                  </>
                                ) : (
                                  <span className="italic text-muted-foreground">
                                    Sản phẩm đã bị xóa
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Downloads Tab */}
            <TabsContent value="downloads">
              <Card>
                <CardHeader>
                  <CardTitle>Downloads của tôi</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span className="ml-2">Đang tải...</span>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {downloads?.map((download) => (
                        <div
                          key={download.id}
                          className="p-4 border rounded-lg"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              {download.type === "template" ? (
                                <FileText className="w-8 h-8 text-blue-500" />
                              ) : (
                                <Download className="w-8 h-8 text-green-500" />
                              )}
                              <div>
                                <h4 className="font-medium">{download.name}</h4>
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                  <span>
                                    Tải ngày{" "}
                                    {new Date(
                                      download.downloadDate,
                                    ).toLocaleDateString("vi-VN")}
                                  </span>
                                  <span>•</span>
                                  <span>{download.fileSize || "Unknown"}</span>
                                </div>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownload(download.id)}
                              disabled={isLoading}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Tải lại
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <div className="space-y-6">
                {/* Avatar Upload Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Camera className="w-5 h-5" />
                      Ảnh đại diện
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-6">
                      <Avatar className="w-24 h-24">
                        <AvatarImage
                          src={uploadedAvatarUrl || editAvatar || user.avatar}
                        />
                        <AvatarFallback className="text-xl">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 space-y-3">
                        <div>
                          <Label
                            htmlFor="avatar-upload"
                            className="text-sm font-medium"
                          >
                            Tải ảnh mới
                          </Label>
                          <Input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            disabled={isUploadingAvatar || isLoading}
                            className="mt-1"
                          />
                        </div>

                        {isUploadingAvatar && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Đang tải lên... {uploadProgress}%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full">
                              <div
                                className="h-2 transition-all duration-300 bg-blue-600 rounded-full"
                                style={{ width: `${uploadProgress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}

                        {uploadedAvatarUrl && (
                          <div className="flex items-center justify-between p-3 border border-green-200 rounded bg-green-50">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-sm text-green-800">
                                ✓ Ảnh mới đã được tải lên
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleRemoveUploadedAvatar}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Drag & Drop Area */}
                    <div
                      className="p-6 text-center transition-colors border-2 border-dashed rounded-lg cursor-pointer border-muted hover:border-primary/50"
                      onClick={() =>
                        document.getElementById("avatar-upload")?.click()
                      }
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.add("border-primary");
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove("border-primary");
                      }}
                      onDrop={async (e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove("border-primary");

                        const files = Array.from(e.dataTransfer.files);
                        const file = files[0];

                        if (!file || !file.type.startsWith("image/")) {
                          toast({
                            variant: "destructive",
                            description: "Vui lòng chọn file ảnh hợp lệ",
                          });
                          return;
                        }

                        const input = document.getElementById(
                          "avatar-upload",
                        ) as HTMLInputElement;
                        if (input) {
                          const dt = new DataTransfer();
                          dt.items.add(file);
                          input.files = dt.files;
                          handleAvatarUpload({ target: input } as any);
                        }
                      }}
                    >
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="mb-1 text-sm text-muted-foreground">
                        Kéo thả hoặc click để tải ảnh lên
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG, WEBP tối đa 5MB
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Personal Info Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Thông tin cá nhân</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="name" className="text-sm font-medium">
                          Họ và tên
                        </Label>
                        <Input
                          id="name"
                          className="mt-1"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          disabled={isLoading}
                        />
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
                          className="mt-1"
                          value={editAvatar}
                          onChange={(e) => setEditAvatar(e.target.value)}
                          placeholder="https://example.com/avatar.jpg"
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                    <Button
                      onClick={handleUpdateProfile}
                      disabled={isLoading || isUploadingAvatar}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Đang cập nhật...
                        </>
                      ) : (
                        "Cập nhật thông tin"
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {/* Security Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Bảo mật</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
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
                    <Button onClick={handleChangePassword} disabled={isLoading}>
                      <Lock className="w-4 h-4 mr-2" />
                      Đổi mật khẩu
                    </Button>
                  </CardContent>
                </Card>

                {/* Notifications Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Thông báo</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Email marketing</h4>
                        <p className="text-sm text-muted-foreground">
                          Nhận thông tin về sản phẩm mới và khuyến mãi
                        </p>
                      </div>
                      <Switch
                        checked={emailNotifications}
                        onCheckedChange={setEmailNotifications}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Thông báo đơn hàng</h4>
                        <p className="text-sm text-muted-foreground">
                          Nhận thông báo về trạng thái đơn hàng
                        </p>
                      </div>
                      <Switch
                        checked={orderNotifications}
                        onCheckedChange={setOrderNotifications}
                        disabled={isLoading}
                      />
                    </div>
                    <Button
                      onClick={handleUpdateNotifications}
                      disabled={isLoading}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Cập nhật thông báo
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
