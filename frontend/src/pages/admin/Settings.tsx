import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { isAdmin } from "@/lib/auth";
import { motion } from "framer-motion";
import {
  getSystemSettings,
  saveSystemSettings,
  saveSectionSettings,
  resetToDefaultSettings,
  SystemSettings,
} from "@/lib/settings";
import {
  Settings as SettingsIcon,
  Globe,
  Shield,
  Mail,
  Bell,
  Palette,
  Database,
  CreditCard,
  Users,
  Save,
  RefreshCw,
  Upload,
  Download,
  Loader2,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<SystemSettings>({
    general: {
      siteName: "Template Market",
      siteDescription: "Premium templates and e-books marketplace",
      siteUrl: "https://templatemarket.com",
      adminEmail: "admin@templatemarket.com",
      timezone: "Asia/Ho_Chi_Minh",
      language: "vi",
      currency: "VND",
    },
    notifications: {
      emailNotifications: true,
      orderNotifications: true,
      userRegistrations: true,
      systemAlerts: true,
      marketingEmails: false,
    },
    security: {
      twoFactorAuth: true,
      sessionTimeout: 30,
      passwordExpiry: 90,
      maxLoginAttempts: 5,
      requireStrongPasswords: true,
    },
    appearance: {
      theme: "system",
      primaryColor: "#3b82f6",
      secondaryColor: "#8b5cf6",
      darkMode: true,
      compactMode: false,
    },
    integrations: {
      googleAnalytics: "",
      facebookPixel: "",
      mailchimp: "",
      stripe: "",
      paypal: "",
    },
  });

  if (!user || !isAdmin(user)) {
    return <Navigate to="/" replace />;
  }

  // Load settings từ database
  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        const data = await getSystemSettings();
        if (data) {
          setSettings(data);
        }
      } catch (error) {
        console.error("Error loading settings:", error);
        toast({
          title: "Lỗi tải cài đặt",
          description: "Không thể tải cài đặt hệ thống",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSave = async (section?: string) => {
    setIsSaving(true);
    try {
      let success = false;

      if (section && section !== "tất cả") {
        // Lưu một section cụ thể
        const sectionKey = getSectionKey(section);
        if (sectionKey) {
          success = await saveSectionSettings(sectionKey, settings[sectionKey]);
        }
      } else {
        // Lưu tất cả settings
        success = await saveSystemSettings(settings);
      }

      if (success) {
        toast({
          title: "Cài đặt đã được lưu",
          description: `Cài đặt ${section || "hệ thống"} đã được cập nhật thành công.`,
        });
      } else {
        throw new Error("Save failed");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Lỗi lưu cài đặt",
        description: "Có lỗi xảy ra khi lưu cài đặt",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async (section: string) => {
    try {
      const success = await resetToDefaultSettings();
      if (success) {
        // Reload settings
        const data = await getSystemSettings();
        if (data) {
          setSettings(data);
        }

        toast({
          title: "Đã khôi phục",
          description: `Cài đặt ${section} đã được khôi phục về mặc định.`,
        });
      }
    } catch (error) {
      toast({
        title: "Lỗi khôi phục",
        description: "Có lỗi xảy ra khi khôi phục cài đặt",
        variant: "destructive",
      });
    }
  };

  const getSectionKey = (
    section: string,
  ): keyof Omit<SystemSettings, "id" | "updatedAt"> | null => {
    const mapping: Record<
      string,
      keyof Omit<SystemSettings, "id" | "updatedAt">
    > = {
      chung: "general",
      "bảo mật": "security",
      "thông báo": "notifications",
      "giao diện": "appearance",
      "tích hợp": "integrations",
    };
    return mapping[section] || null;
  };

  const handleExportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `settings-${new Date().toISOString().split("T")[0]}.json`;
    link.click();

    toast({
      title: "Đã xuất cài đặt",
      description: "File cài đặt đã được tải xuống.",
    });
  };

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedSettings = JSON.parse(e.target?.result as string);
        setSettings(importedSettings);
        toast({
          title: "Đã nhập cài đặt",
          description:
            "Cài đặt đã được nhập thành công. Nhấn 'Lưu tất cả' để áp dụng.",
        });
      } catch (error) {
        toast({
          title: "Lỗi nhập file",
          description: "File cài đặt không hợp lệ",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Đang tải cài đặt...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
            Cài đặt hệ thống
          </h1>
          <p className="mt-1 text-muted-foreground">
            Quản lý cài đặt và cấu hình hệ thống
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <input
            type="file"
            accept=".json"
            onChange={handleImportSettings}
            className="hidden"
            id="import-settings"
          />
          <Button
            variant="outline"
            onClick={() => document.getElementById("import-settings")?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            Nhập cài đặt
          </Button>
          <Button variant="outline" onClick={handleExportSettings}>
            <Download className="w-4 h-4 mr-2" />
            Xuất cài đặt
          </Button>
          <Button
            onClick={() => handleSave("tất cả")}
            disabled={isSaving}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            {isSaving ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Lưu tất cả
          </Button>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general" className="flex items-center space-x-2">
            <Globe className="w-4 h-4" />
            <span>Chung</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>Bảo mật</span>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center space-x-2"
          >
            <Bell className="w-4 h-4" />
            <span>Thông báo</span>
          </TabsTrigger>
          <TabsTrigger
            value="appearance"
            className="flex items-center space-x-2"
          >
            <Palette className="w-4 h-4" />
            <span>Giao diện</span>
          </TabsTrigger>
          <TabsTrigger
            value="integrations"
            className="flex items-center space-x-2"
          >
            <Database className="w-4 h-4" />
            <span>Tích hợp</span>
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Cài đặt chung</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Tên website</Label>
                    <Input
                      id="siteName"
                      value={settings.general.siteName}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          general: {
                            ...prev.general,
                            siteName: e.target.value,
                          },
                        }))
                      }
                      disabled={isSaving}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="siteUrl">URL website</Label>
                    <Input
                      id="siteUrl"
                      value={settings.general.siteUrl}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          general: { ...prev.general, siteUrl: e.target.value },
                        }))
                      }
                      disabled={isSaving}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Mô tả website</Label>
                  <Textarea
                    id="siteDescription"
                    value={settings.general.siteDescription}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        general: {
                          ...prev.general,
                          siteDescription: e.target.value,
                        },
                      }))
                    }
                    disabled={isSaving}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Múi giờ</Label>
                    <Select
                      value={settings.general.timezone}
                      onValueChange={(value) =>
                        setSettings((prev) => ({
                          ...prev,
                          general: { ...prev.general, timezone: value },
                        }))
                      }
                      disabled={isSaving}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Asia/Ho_Chi_Minh">
                          Việt Nam (GMT+7)
                        </SelectItem>
                        <SelectItem value="UTC">UTC (GMT+0)</SelectItem>
                        <SelectItem value="America/New_York">
                          New York (GMT-5)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Ngôn ngữ</Label>
                    <Select
                      value={settings.general.language}
                      onValueChange={(value) =>
                        setSettings((prev) => ({
                          ...prev,
                          general: { ...prev.general, language: value },
                        }))
                      }
                      disabled={isSaving}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vi">Tiếng Việt</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency">Tiền tệ</Label>
                    <Select
                      value={settings.general.currency}
                      onValueChange={(value) =>
                        setSettings((prev) => ({
                          ...prev,
                          general: { ...prev.general, currency: value },
                        }))
                      }
                      disabled={isSaving}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="VND">VND (₫)</SelectItem>
                        <SelectItem value="USD">USD ($)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Button
                    onClick={() => handleSave("chung")}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Lưu cài đặt chung
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleReset("chung")}
                    disabled={isSaving}
                  >
                    Khôi phục mặc định
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Cài đặt bảo mật</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="twoFactorAuth">Xác thực 2 bước</Label>
                    <p className="text-sm text-muted-foreground">
                      Yêu cầu mã xác thực từ ứng dụng authenticator
                    </p>
                  </div>
                  <Switch
                    id="twoFactorAuth"
                    checked={settings.security.twoFactorAuth}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        security: { ...prev.security, twoFactorAuth: checked },
                      }))
                    }
                    disabled={isSaving}
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">
                      Thời gian hết phiên (phút)
                    </Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={settings.security.sessionTimeout}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          security: {
                            ...prev.security,
                            sessionTimeout: parseInt(e.target.value),
                          },
                        }))
                      }
                      disabled={isSaving}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxLoginAttempts">
                      Số lần đăng nhập tối đa
                    </Label>
                    <Input
                      id="maxLoginAttempts"
                      type="number"
                      value={settings.security.maxLoginAttempts}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          security: {
                            ...prev.security,
                            maxLoginAttempts: parseInt(e.target.value),
                          },
                        }))
                      }
                      disabled={isSaving}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="requireStrongPasswords">
                      Yêu cầu mật khẩu mạnh
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Bắt buộc mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ
                      hoa, chữ thường và số
                    </p>
                  </div>
                  <Switch
                    id="requireStrongPasswords"
                    checked={settings.security.requireStrongPasswords}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({
                        ...prev,
                        security: {
                          ...prev.security,
                          requireStrongPasswords: checked,
                        },
                      }))
                    }
                    disabled={isSaving}
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <Button
                    onClick={() => handleSave("bảo mật")}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Lưu cài đặt bảo mật
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleReset("bảo mật")}
                    disabled={isSaving}
                  >
                    Khôi phục mặc định
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Cài đặt thông báo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries({
                  emailNotifications: "Thông báo email",
                  orderNotifications: "Thông báo đơn hàng mới",
                  userRegistrations: "Thông báo đăng ký mới",
                  systemAlerts: "Cảnh báo hệ thống",
                  marketingEmails: "Email marketing",
                }).map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <Label>{label}</Label>
                      <p className="text-sm text-muted-foreground">
                        {key === "emailNotifications" &&
                          "Nhận thông báo qua email"}
                        {key === "orderNotifications" &&
                          "Thông báo khi có đơn hàng mới"}
                        {key === "userRegistrations" &&
                          "Thông báo khi có người dùng đăng ký"}
                        {key === "systemAlerts" &&
                          "Cảnh báo về tình trạng hệ thống"}
                        {key === "marketingEmails" &&
                          "Gửi email quảng cáo đến khách hàng"}
                      </p>
                    </div>
                    <Switch
                      checked={
                        settings.notifications[
                          key as keyof typeof settings.notifications
                        ]
                      }
                      onCheckedChange={(checked) =>
                        setSettings((prev) => ({
                          ...prev,
                          notifications: {
                            ...prev.notifications,
                            [key]: checked,
                          },
                        }))
                      }
                      disabled={isSaving}
                    />
                  </div>
                ))}

                <div className="flex items-center space-x-4">
                  <Button
                    onClick={() => handleSave("thông báo")}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Lưu cài đặt thông báo
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleReset("thông báo")}
                    disabled={isSaving}
                  >
                    Khôi phục mặc định
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Cài đặt giao diện</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Màu chính</Label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        id="primaryColor"
                        value={settings.appearance.primaryColor}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            appearance: {
                              ...prev.appearance,
                              primaryColor: e.target.value,
                            },
                          }))
                        }
                        className="w-10 h-10 border rounded"
                        disabled={isSaving}
                      />
                      <Input
                        value={settings.appearance.primaryColor}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secondaryColor">Màu phụ</Label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        id="secondaryColor"
                        value={settings.appearance.secondaryColor}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            appearance: {
                              ...prev.appearance,
                              secondaryColor: e.target.value,
                            },
                          }))
                        }
                        className="w-10 h-10 border rounded"
                        disabled={isSaving}
                      />
                      <Input
                        value={settings.appearance.secondaryColor}
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="theme">Chủ đề</Label>
                  <Select
                    value={settings.appearance.theme}
                    onValueChange={(value) =>
                      setSettings((prev) => ({
                        ...prev,
                        appearance: { ...prev.appearance, theme: value },
                      }))
                    }
                    disabled={isSaving}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Sáng</SelectItem>
                      <SelectItem value="dark">Tối</SelectItem>
                      <SelectItem value="system">Theo hệ thống</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-4">
                  <Button
                    onClick={() => handleSave("giao diện")}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Lưu cài đặt giao diện
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleReset("giao diện")}
                    disabled={isSaving}
                  >
                    Khôi phục mặc định
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Integration Settings */}
        <TabsContent value="integrations">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Tích hợp bên thứ ba</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries({
                  googleAnalytics: "Google Analytics Tracking ID",
                  facebookPixel: "Facebook Pixel ID",
                  mailchimp: "Mailchimp API Key",
                  stripe: "Stripe Secret Key",
                  paypal: "PayPal Client ID",
                }).map(([key, label]) => (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={key}>{label}</Label>
                    <Input
                      id={key}
                      type="password"
                      placeholder={`Nhập ${label.toLowerCase()}`}
                      value={
                        settings.integrations[
                          key as keyof typeof settings.integrations
                        ]
                      }
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          integrations: {
                            ...prev.integrations,
                            [key]: e.target.value,
                          },
                        }))
                      }
                      disabled={isSaving}
                    />
                  </div>
                ))}

                <div className="flex items-center space-x-4">
                  <Button
                    onClick={() => handleSave("tích hợp")}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Lưu cài đặt tích hợp
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleReset("tích hợp")}
                    disabled={isSaving}
                  >
                    Khôi phục mặc định
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
