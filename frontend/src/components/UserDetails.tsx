import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "@/types";
import { updateUser } from "@/lib/users";
import { uploadFileToCloudinary } from "@/lib/uploadFileToCloudinary";
import { getInitials } from "@/lib/auth";
import {
  Save,
  Upload,
  X,
  User as UserIcon,
  Mail,
  Shield,
  Calendar,
  Camera,
  Loader2,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const userSchema = z.object({
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  role: z.enum(["admin", "customer"]),
  avatar: z.string().optional(),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserDetailModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedUser: User) => void;
  isEditing: boolean;
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({
  user,
  isOpen,
  onClose,
  onUpdate,
  isEditing,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedAvatar, setUploadedAvatar] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  const watchedValues = watch();

  useEffect(() => {
    if (user && isOpen) {
      reset({
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || "",
      });
      setUploadedAvatar(null);
    }
  }, [user, isOpen, reset]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Lỗi định dạng",
        description: "Vui lòng chọn file ảnh hợp lệ (JPEG, PNG, GIF, WEBP)",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Lỗi kích thước",
        description: "Kích thước ảnh phải nhỏ hơn 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadFileToCloudinary(file);
      setUploadedAvatar(result.url);
      setValue("avatar", result.url);

      toast({
        title: "Upload thành công",
        description: `Avatar đã được tải lên (${result.size}, ${result.format})`,
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Lỗi upload",
        description: "Có lỗi xảy ra khi tải ảnh lên",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: UserFormData) => {
    if (!user || !isEditing) return;

    setIsSaving(true);
    try {
      const success = await updateUser(user.id, {
        name: data.name,
        email: data.email,
        role: data.role,
        avatar: uploadedAvatar || data.avatar,
      });

      if (success) {
        const updatedUser: User = {
          ...user,
          name: data.name,
          email: data.email,
          role: data.role,
          avatar: uploadedAvatar || data.avatar,
        };

        onUpdate(updatedUser);
        onClose();

        toast({
          title: "Cập nhật thành công",
          description: "Thông tin người dùng đã được cập nhật.",
        });
      } else {
        throw new Error("Không thể cập nhật người dùng");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        title: "Lỗi cập nhật",
        description: "Có lỗi xảy ra khi cập nhật thông tin người dùng.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserIcon className="w-5 h-5" />
            {isEditing ? "Chỉnh sửa người dùng" : "Chi tiết người dùng"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Cập nhật thông tin và avatar của người dùng"
              : "Xem thông tin chi tiết của người dùng"}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info">Thông tin</TabsTrigger>
            <TabsTrigger value="avatar">Avatar</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Họ tên *</Label>
                  <Input
                    id="name"
                    {...register("name")}
                    disabled={!isEditing || isSaving}
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
                    {...register("email")}
                    disabled={!isEditing || isSaving}
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
                <Label htmlFor="role">Quyền</Label>
                <Select
                  value={watchedValues.role}
                  onValueChange={(value: "admin" | "customer") =>
                    setValue("role", value)
                  }
                  disabled={!isEditing || isSaving}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Khách hàng
                      </div>
                    </SelectItem>
                    <SelectItem value="admin">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Quản trị viên
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* User Info Cards */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">
                      Thông tin tài khoản
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">
                        Tham gia:{" "}
                        {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Quyền hiện tại</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge
                      variant={user.role === "admin" ? "default" : "secondary"}
                      className="w-fit"
                    >
                      {user.role === "admin" ? "Quản trị viên" : "Khách hàng"}
                    </Badge>
                  </CardContent>
                </Card>
              </div>

              {isEditing && (
                <div className="flex justify-end pt-4 space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={isSaving}
                  >
                    Hủy
                  </Button>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Lưu thay đổi
                  </Button>
                </div>
              )}
            </form>
          </TabsContent>

          <TabsContent value="avatar" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Avatar người dùng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Current Avatar */}
                <div className="flex items-center justify-center">
                  <Avatar className="w-32 h-32">
                    <AvatarImage
                      src={
                        uploadedAvatar || watchedValues.avatar || user.avatar
                      }
                    />
                    <AvatarFallback className="text-2xl">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {isEditing && (
                  <>
                    {/* Upload Section */}
                    <div className="space-y-2">
                      <Label>Tải ảnh mới</Label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        disabled={isUploading || isSaving}
                      />

                      {isUploading && (
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Đang tải ảnh lên Cloudinary...</span>
                        </div>
                      )}
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
                            title: "Lỗi định dạng",
                            description: "Vui lòng chọn file ảnh hợp lệ",
                            variant: "destructive",
                          });
                          return;
                        }

                        setIsUploading(true);
                        try {
                          const result = await uploadFileToCloudinary(file);
                          setUploadedAvatar(result.url);
                          setValue("avatar", result.url);

                          toast({
                            title: "Upload thành công",
                            description: `Avatar đã được tải lên (${result.size}, ${result.format})`,
                          });
                        } catch (error) {
                          toast({
                            title: "Lỗi upload",
                            description: "Có lỗi xảy ra khi tải ảnh",
                            variant: "destructive",
                          });
                        } finally {
                          setIsUploading(false);
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
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        disabled={isUploading}
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Đang tải...
                          </>
                        ) : (
                          "Chọn file"
                        )}
                      </Button>

                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                      />
                    </div>

                    {uploadedAvatar && (
                      <div className="flex items-center justify-between p-3 border border-green-200 rounded bg-green-50">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-green-800">
                            ✓ Avatar mới đã được tải lên
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setUploadedAvatar(null);
                            setValue("avatar", user.avatar || "");
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailModal;
