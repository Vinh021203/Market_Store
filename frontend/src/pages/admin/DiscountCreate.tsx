import React, { useState, useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { isAdmin } from "@/lib/auth";
import { Discount, CreateDiscountData } from "@/types";
import {
  createDiscount,
  updateDiscount,
  getDiscountById,
  formatPrice,
  formatDiscountValue,
  validateDiscount,
  calculateDiscountAmount,
} from "@/lib/discounts";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Save,
  Eye,
  Plus,
  Gift,
  DollarSign,
  Settings,
  Tag,
  Calendar,
  Users,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Crown,
  Info,
  Zap,
  Target,
  Star,
  Clock,
  Percent,
  CreditCard,
  Activity,
  Heart,
  Globe,
  BarChart3,
  Layers,
  TrendingUp,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const discountSchema = z.object({
  code: z
    .string()
    .min(3, "Mã code phải có ít nhất 3 ký tự")
    .max(20, "Mã code không được quá 20 ký tự")
    .regex(/^[A-Z0-9_-]+$/, "Mã code chỉ được chứa chữ in hoa, số, dấu _ và -"),
  name: z.string().min(5, "Tên chiến dịch phải có ít nhất 5 ký tự"),
  description: z.string().optional(),
  type: z.enum(["percent", "fixed"], {
    required_error: "Vui lòng chọn loại giảm giá",
  }),
  value: z.number().min(0.01, "Giá trị phải lớn hơn 0"),
  min_order_amount: z.number().min(0, "Số tiền tối thiểu phải >= 0"),
  max_discount_amount: z.number().optional(),
  max_uses: z.number().optional(),
  max_uses_per_user: z.number().min(1, "Tối thiểu 1 lần/người dùng"),
  start_date: z.string().min(1, "Vui lòng chọn ngày bắt đầu"),
  end_date: z.string().min(1, "Vui lòng chọn ngày kết thúc"),
  applicable_to: z.enum(["all", "products", "users"]),
  is_active: z.boolean(),
});

type DiscountFormData = z.infer<typeof discountSchema>;

const DiscountCreate: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [sampleOrder, setSampleOrder] = useState(500000); // Đơn hàng mẫu để test

  if (!user || !isAdmin(user)) {
    return <Navigate to="/" replace />;
  }

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<DiscountFormData>({
    resolver: zodResolver(discountSchema),
    defaultValues: {
      code: "",
      name: "",
      description: "",
      type: "percent",
      value: 10,
      min_order_amount: 0,
      max_discount_amount: undefined,
      max_uses: undefined,
      max_uses_per_user: 1,
      start_date: new Date().toISOString().slice(0, 16),
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 16),
      applicable_to: "all",
      is_active: true,
    },
  });

  const watchedValues = watch();

  useEffect(() => {
    if (isEdit && id) {
      const fetchDiscount = async () => {
        const discount = await getDiscountById(id);
        if (discount) {
          reset({
            code: discount.code,
            name: discount.name,
            description: discount.description || "",
            type: discount.type,
            value: discount.value,
            min_order_amount: discount.min_order_amount,
            max_discount_amount: discount.max_discount_amount,
            max_uses: discount.max_uses,
            max_uses_per_user: discount.max_uses_per_user,
            start_date: new Date(discount.start_date)
              .toISOString()
              .slice(0, 16),
            end_date: new Date(discount.end_date).toISOString().slice(0, 16),
            applicable_to: discount.applicable_to,
            is_active: discount.is_active,
          });
        }
      };
      fetchDiscount();
    }
  }, [id, isEdit, reset]);

  const onSubmit = async (data: DiscountFormData) => {
    // ✅ Validate required fields first
    if (
      !data.code ||
      !data.name ||
      !data.type ||
      data.value === undefined ||
      !data.start_date ||
      !data.end_date
    ) {
      toast({
        title: "❌ Lỗi",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc",
        variant: "destructive",
      });
      return;
    }

    // Validation ngày
    if (new Date(data.end_date) <= new Date(data.start_date)) {
      toast({
        title: "❌ Lỗi",
        description: "Ngày kết thúc phải sau ngày bắt đầu",
        variant: "destructive",
      });
      return;
    }

    // Validation giá trị percent
    if (data.type === "percent" && data.value > 100) {
      toast({
        title: "❌ Lỗi",
        description: "Giá trị phần trăm không được vượt quá 100%",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      // ✅ Now we're sure all required fields exist
      const transformedData: CreateDiscountData = {
        code: data.code.toUpperCase(),
        name: data.name,
        description: data.description,
        type: data.type,
        value: data.value,
        min_order_amount: data.min_order_amount ?? 0,
        max_discount_amount: data.max_discount_amount,
        max_uses: data.max_uses,
        max_uses_per_user: data.max_uses_per_user ?? 1,
        start_date: data.start_date,
        end_date: data.end_date,
        applicable_to: data.applicable_to ?? "all",
        is_active: data.is_active ?? true,
      };

      if (isEdit && id) {
        await updateDiscount(id, transformedData);
      } else {
        await createDiscount(transformedData);
      }

      toast({
        title: isEdit
          ? "✅ Cập nhật thành công"
          : "✅ Tạo mã giảm giá thành công",
        description: isEdit
          ? "Mã giảm giá đã được cập nhật thành công"
          : "Mã giảm giá mới đã được tạo và kích hoạt",
      });

      navigate("/admin/discounts");
    } catch (err) {
      toast({
        title: "❌ Lỗi",
        description: (err as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Tính toán preview giảm giá
  const discountPreview = React.useMemo(() => {
    if (!watchedValues.value) return null;

    const mockDiscount: Discount = {
      id: "preview",
      code: watchedValues.code || "PREVIEW",
      name: watchedValues.name || "Preview",
      type: watchedValues.type,
      value: watchedValues.value,
      min_order_amount: watchedValues.min_order_amount || 0,
      max_discount_amount: watchedValues.max_discount_amount,
      start_date: watchedValues.start_date,
      end_date: watchedValues.end_date,
      is_active: true,
      max_uses: watchedValues.max_uses,
      used_count: 0,
      max_uses_per_user: watchedValues.max_uses_per_user || 1,
      applicable_to: watchedValues.applicable_to || "all",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const validation = validateDiscount(mockDiscount, sampleOrder);
    const discountAmount = validation.isValid
      ? calculateDiscountAmount(mockDiscount, sampleOrder)
      : 0;

    return {
      isValid: validation.isValid,
      reason: validation.reason,
      discountAmount,
      finalAmount: sampleOrder - discountAmount,
    };
  }, [watchedValues, sampleOrder]);

  const tabsConfig = [
    {
      id: "basic",
      label: "Thông tin cơ bản",
      icon: Gift,
      color: "from-orange-500 to-amber-500",
    },
    {
      id: "conditions",
      label: "Điều kiện",
      icon: Settings,
      color: "from-emerald-500 to-green-500",
    },
    {
      id: "usage",
      label: "Sử dụng",
      icon: Users,
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "schedule",
      label: "Lịch trình",
      icon: Calendar,
      color: "from-blue-500 to-cyan-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-pink-50 dark:from-slate-900 dark:via-orange-900 dark:to-pink-900">
      {/* Enhanced Floating Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4"
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Gift className="w-8 h-8 text-orange-400 opacity-20" />
        </motion.div>
        <motion.div
          className="absolute top-1/3 right-1/4"
          animate={{ y: [0, -15, 0], rotate: [0, -10, 0] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          <Percent className="w-6 h-6 text-pink-400 opacity-20" />
        </motion.div>
        <motion.div
          className="absolute bottom-1/4 left-1/3"
          animate={{ y: [0, -25, 0], rotate: [0, 15, 0] }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        >
          <Tag className="text-amber-400 w-7 h-7 opacity-20" />
        </motion.div>
        <motion.div
          className="absolute top-2/3 right-1/3"
          animate={{ y: [0, -18, 0], scale: [1, 1.1, 1] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
        >
          <CreditCard className="w-5 h-5 text-pink-300 opacity-20" />
        </motion.div>
        <motion.div
          className="absolute top-1/6 right-1/6"
          animate={{ y: [0, -12, 0], rotate: [0, -5, 0] }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
        >
          <Sparkles className="w-4 h-4 text-yellow-400 opacity-20" />
        </motion.div>
      </div>

      <div className="container relative z-10 px-4 py-8 mx-auto">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8 p-6 bg-gradient-to-r from-white/90 via-orange-50/90 to-pink-50/90 backdrop-blur-xl border border-orange-200/50 rounded-3xl shadow-2xl"
        >
          <div className="flex items-center space-x-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/admin/discounts")}
                className="group bg-white/60 hover:bg-white/80 rounded-2xl shadow-md border border-orange-200/30"
              >
                <ArrowLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1 text-orange-600" />
                <span className="font-semibold text-orange-800">Quay lại</span>
              </Button>
            </motion.div>
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="flex items-center justify-center w-16 h-16 shadow-2xl rounded-3xl bg-gradient-to-r from-orange-500 via-amber-500 to-pink-600"
              >
                {isEdit ? (
                  <Settings className="w-8 h-8 text-white" />
                ) : (
                  <Plus className="w-8 h-8 text-white" />
                )}
              </motion.div>
              <div>
                <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-orange-600 via-amber-600 to-pink-600 bg-clip-text">
                  {isEdit ? "Chỉnh sửa mã giảm giá" : "Tạo mã giảm giá mới"}
                </h1>
                <p className="text-orange-700/80 mt-1 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {isEdit
                      ? "Cập nhật thông tin mã giảm giá hiện có"
                      : "Tạo chiến dịch khuyến mại mới cho khách hàng"}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                className="group bg-white/80 hover:bg-white border-orange-200/50 hover:border-orange-300 rounded-2xl shadow-md"
              >
                <Eye className="w-4 h-4 mr-2 transition-transform group-hover:scale-110 text-orange-600" />
                <span className="text-orange-800 font-semibold">Xem trước</span>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleSubmit(onSubmit)}
                disabled={isSaving}
                className="transition-all duration-300 shadow-xl bg-gradient-to-r from-orange-500 via-amber-500 to-pink-600 hover:from-orange-600 hover:via-amber-600 hover:to-pink-700 hover:shadow-2xl rounded-2xl"
              >
                {isSaving ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-4 h-4 mr-2 border-2 border-white rounded-full border-t-transparent"
                    />
                    <span className="font-semibold">
                      {isEdit ? "Đang cập nhật..." : "Đang tạo..."}
                    </span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    <span className="font-semibold">
                      {isEdit ? "Cập nhật mã giảm giá" : "Tạo mã giảm giá"}
                    </span>
                    <Sparkles className="w-4 h-4 ml-1" />
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Enhanced Main Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6 lg:col-span-2"
          >
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList
                className="grid w-full grid-cols-4 mb-6 bg-white/60 rounded-xl shadow-sm p-1 border-0 gap-0"
                style={{
                  background:
                    "linear-gradient(90deg, #FFF8F3 0%, #FDF4FF 100%)",
                  boxShadow: "0 1px 8px 0 #FCA17D08",
                }}
              >
                {tabsConfig.map((tab, index) => (
                  <motion.div
                    key={`tab-config-${tab.id}-${index}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.06 }}
                    className="w-full"
                  >
                    <TabsTrigger
                      value={tab.id}
                      className={`
                        group relative w-full flex items-center justify-center gap-1.5 rounded-lg py-2 px-2 text-sm font-medium
                        border-0 outline-none transition-all duration-200
                        focus-visible:ring-1 focus-visible:ring-orange-300/50
                        data-[state=active]:bg-gradient-to-r
                        data-[state=active]:from-[#FF6B35] data-[state=active]:to-[#E91E63]
                        data-[state=active]:text-white data-[state=active]:font-semibold
                        data-[state=active]:shadow-md data-[state=active]:scale-[1.02]
                        data-[state=inactive]:bg-transparent data-[state=inactive]:text-[#D97706]
                        hover:data-[state=inactive]:bg-orange-25
                        hover:data-[state=inactive]:text-[#EA580C]
                      `}
                    >
                      <tab.icon
                        className={`
                          w-4 h-4
                          transition-all duration-150
                          group-data-[state=active]:text-white
                          group-data-[state=inactive]:text-[#D97706]
                        `}
                      />
                      <span className="font-medium text-xs sm:text-sm whitespace-nowrap">
                        {tab.label}
                      </span>
                    </TabsTrigger>
                  </motion.div>
                ))}
              </TabsList>

              <AnimatePresence>
                {/* Basic Info Tab */}
                <TabsContent value="basic" className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="border-0 shadow-xl bg-gradient-to-br from-white/95 via-orange-50/80 to-amber-50/80 backdrop-blur-xl rounded-3xl">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg">
                            <Gift className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <span className="text-2xl text-transparent bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text font-bold">
                              Thông tin cơ bản
                            </span>
                            <p className="mt-1 text-sm text-orange-700/80">
                              Nhập thông tin chính về mã giảm giá
                            </p>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Mã code */}
                        <motion.div
                          className="space-y-2"
                          whileFocus={{ scale: 1.01 }}
                        >
                          <Label
                            htmlFor="code"
                            className="flex items-center space-x-2"
                          >
                            <Tag className="w-4 h-4 text-orange-600" />
                            <span className="font-semibold text-orange-800">
                              Mã code *
                            </span>
                          </Label>
                          <Input
                            id="code"
                            placeholder="VD: SALE50, WELCOME2024"
                            {...register("code")}
                            className={`h-12 transition-all duration-300 bg-white/80 border-orange-200/50 rounded-2xl font-mono uppercase ${
                              errors.code
                                ? "border-red-500 shake"
                                : "focus:ring-2 focus:ring-orange-500/20"
                            }`}
                            style={{ textTransform: "uppercase" }}
                          />
                          {errors.code && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-center space-x-1 text-sm text-red-500"
                            >
                              <AlertTriangle className="w-3 h-3" />
                              <span>{errors.code.message}</span>
                            </motion.p>
                          )}
                          <div className="text-xs text-orange-600/70">
                            Chỉ chữ in hoa, số, dấu _ và - •{" "}
                            {watchedValues.code?.length || 0}/20 ký tự
                          </div>
                        </motion.div>

                        {/* Tên chiến dịch */}
                        <motion.div
                          className="space-y-2"
                          whileFocus={{ scale: 1.01 }}
                        >
                          <Label
                            htmlFor="name"
                            className="flex items-center space-x-2"
                          >
                            <Star className="w-4 h-4 text-orange-600" />
                            <span className="font-semibold text-orange-800">
                              Tên chiến dịch *
                            </span>
                          </Label>
                          <Input
                            id="name"
                            placeholder="VD: Flash Sale cuối tuần, Ưu đãi khách VIP"
                            {...register("name")}
                            className={`h-12 transition-all duration-300 bg-white/80 border-orange-200/50 rounded-2xl ${
                              errors.name
                                ? "border-red-500 shake"
                                : "focus:ring-2 focus:ring-orange-500/20"
                            }`}
                          />
                          {errors.name && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-center space-x-1 text-sm text-red-500"
                            >
                              <AlertTriangle className="w-3 h-3" />
                              <span>{errors.name.message}</span>
                            </motion.p>
                          )}
                        </motion.div>

                        {/* Mô tả */}
                        <motion.div
                          className="space-y-2"
                          whileFocus={{ scale: 1.01 }}
                        >
                          <Label
                            htmlFor="description"
                            className="flex items-center space-x-2"
                          >
                            <Info className="w-4 h-4 text-orange-600" />
                            <span className="font-semibold text-orange-800">
                              Mô tả (tùy chọn)
                            </span>
                          </Label>
                          <Textarea
                            id="description"
                            placeholder="Mô tả chi tiết về chiến dịch khuyến mại..."
                            {...register("description")}
                            className="min-h-[100px] transition-all duration-300 bg-white/80 border-orange-200/50 rounded-2xl focus:ring-2 focus:ring-orange-500/20"
                          />
                        </motion.div>

                        {/* Loại giảm giá và giá trị */}
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                          <motion.div className="space-y-2">
                            <Label
                              htmlFor="type"
                              className="flex items-center space-x-2"
                            >
                              <Percent className="w-4 h-4 text-orange-600" />
                              <span className="font-semibold text-orange-800">
                                Loại giảm giá *
                              </span>
                            </Label>
                            <Select
                              value={watchedValues.type}
                              onValueChange={(value: any) =>
                                setValue("type", value)
                              }
                            >
                              <SelectTrigger className="h-12 bg-white/80 border-orange-200/50 rounded-2xl">
                                <SelectValue placeholder="Chọn loại" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="percent">
                                  <div className="flex items-center space-x-2">
                                    <Percent className="w-4 h-4 text-blue-500" />
                                    <span>Giảm theo % (phần trăm)</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="fixed">
                                  <div className="flex items-center space-x-2">
                                    <DollarSign className="w-4 h-4 text-green-500" />
                                    <span>Giảm số tiền cố định</span>
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </motion.div>

                          <motion.div
                            className="space-y-2"
                            whileFocus={{ scale: 1.01 }}
                          >
                            <Label
                              htmlFor="value"
                              className="flex items-center space-x-2"
                            >
                              <DollarSign className="w-4 h-4 text-orange-600" />
                              <span className="font-semibold text-orange-800">
                                Giá trị *
                              </span>
                            </Label>
                            <div className="relative">
                              <Input
                                id="value"
                                type="number"
                                placeholder={
                                  watchedValues.type === "percent"
                                    ? "50"
                                    : "100000"
                                }
                                {...register("value", { valueAsNumber: true })}
                                className={`h-12 transition-all duration-300 bg-white/80 border-orange-200/50 rounded-2xl ${
                                  errors.value
                                    ? "border-red-500 shake"
                                    : "focus:ring-2 focus:ring-orange-500/20"
                                } ${watchedValues.type === "percent" ? "pr-8" : "pr-12"}`}
                              />
                              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-orange-600/70">
                                {watchedValues.type === "percent" ? "%" : "VND"}
                              </div>
                            </div>
                            {errors.value && (
                              <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center space-x-1 text-sm text-red-500"
                              >
                                <AlertTriangle className="w-3 h-3" />
                                <span>{errors.value.message}</span>
                              </motion.p>
                            )}
                            <div className="text-xs text-orange-600/70">
                              {watchedValues.type === "percent"
                                ? "Tối đa 100%"
                                : "Số tiền giảm cố định"}
                            </div>
                          </motion.div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>

                {/* Conditions Tab */}
                <TabsContent value="conditions" className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="border-0 shadow-xl bg-gradient-to-br from-white/95 via-emerald-50/80 to-green-50/80 backdrop-blur-xl rounded-3xl">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-500 shadow-lg">
                            <Settings className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <span className="text-2xl text-transparent bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text font-bold">
                              Điều kiện áp dụng
                            </span>
                            <p className="mt-1 text-sm text-emerald-700/80">
                              Thiết lập điều kiện sử dụng mã giảm giá
                            </p>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Đơn hàng tối thiểu */}
                        <motion.div
                          className="space-y-2"
                          whileFocus={{ scale: 1.01 }}
                        >
                          <Label
                            htmlFor="min_order_amount"
                            className="flex items-center space-x-2"
                          >
                            <Target className="w-4 h-4 text-emerald-600" />
                            <span className="font-semibold text-emerald-800">
                              Đơn hàng tối thiểu
                            </span>
                          </Label>
                          <div className="relative">
                            <Input
                              id="min_order_amount"
                              type="number"
                              placeholder="0"
                              {...register("min_order_amount", {
                                valueAsNumber: true,
                              })}
                              className="h-12 transition-all duration-300 bg-white/80 border-emerald-200/50 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 pr-12"
                            />
                            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-emerald-600/70">
                              VND
                            </div>
                          </div>
                          <div className="text-xs text-emerald-600/70">
                            Để 0 nếu không có điều kiện tối thiểu
                          </div>
                        </motion.div>

                        {/* Giảm tối đa (chỉ với percent) */}
                        {watchedValues.type === "percent" && (
                          <motion.div
                            className="space-y-2"
                            whileFocus={{ scale: 1.01 }}
                          >
                            <Label
                              htmlFor="max_discount_amount"
                              className="flex items-center space-x-2"
                            >
                              <BarChart3 className="w-4 h-4 text-emerald-600" />
                              <span className="font-semibold text-emerald-800">
                                Số tiền giảm tối đa
                              </span>
                            </Label>
                            <div className="relative">
                              <Input
                                id="max_discount_amount"
                                type="number"
                                placeholder="Không giới hạn"
                                {...register("max_discount_amount", {
                                  valueAsNumber: true,
                                  setValueAs: (value) =>
                                    value === "" ? undefined : Number(value),
                                })}
                                className="h-12 transition-all duration-300 bg-white/80 border-emerald-200/50 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 pr-12"
                              />
                              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-emerald-600/70">
                                VND
                              </div>
                            </div>
                            <div className="text-xs text-emerald-600/70">
                              Để trống nếu không giới hạn số tiền giảm tối đa
                            </div>
                          </motion.div>
                        )}

                        {/* Phạm vi áp dụng */}
                        <motion.div className="space-y-2">
                          <Label
                            htmlFor="applicable_to"
                            className="flex items-center space-x-2"
                          >
                            <Layers className="w-4 h-4 text-emerald-600" />
                            <span className="font-semibold text-emerald-800">
                              Phạm vi áp dụng
                            </span>
                          </Label>
                          <Select
                            value={watchedValues.applicable_to}
                            onValueChange={(value: any) =>
                              setValue("applicable_to", value)
                            }
                          >
                            <SelectTrigger className="h-12 bg-white/80 border-emerald-200/50 rounded-2xl">
                              <SelectValue placeholder="Chọn phạm vi" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">
                                <div className="flex items-center space-x-2">
                                  <Globe className="w-4 h-4 text-blue-500" />
                                  <span>Tất cả sản phẩm</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="products">
                                <div className="flex items-center space-x-2">
                                  <Gift className="w-4 h-4 text-green-500" />
                                  <span>Sản phẩm cụ thể</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="users">
                                <div className="flex items-center space-x-2">
                                  <Users className="w-4 h-4 text-purple-500" />
                                  <span>Người dùng cụ thể</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <div className="text-xs text-emerald-600/70">
                            Chọn phạm vi áp dụng cho mã giảm giá
                          </div>
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>

                {/* Usage Tab */}
                <TabsContent value="usage" className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="border-0 shadow-xl bg-gradient-to-br from-white/95 via-purple-50/80 to-pink-50/80 backdrop-blur-xl rounded-3xl">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
                            <Users className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <span className="text-2xl text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text font-bold">
                              Giới hạn sử dụng
                            </span>
                            <p className="mt-1 text-sm text-purple-700/80">
                              Thiết lập số lần sử dụng mã giảm giá
                            </p>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Tổng số lần sử dụng */}
                        <motion.div
                          className="space-y-2"
                          whileFocus={{ scale: 1.01 }}
                        >
                          <Label
                            htmlFor="max_uses"
                            className="flex items-center space-x-2"
                          >
                            <Activity className="w-4 h-4 text-purple-600" />
                            <span className="font-semibold text-purple-800">
                              Tổng số lần sử dụng
                            </span>
                          </Label>
                          <Input
                            id="max_uses"
                            type="number"
                            placeholder="Không giới hạn"
                            {...register("max_uses", {
                              valueAsNumber: true,
                              setValueAs: (value) =>
                                value === "" ? undefined : Number(value),
                            })}
                            className="h-12 transition-all duration-300 bg-white/80 border-purple-200/50 rounded-2xl focus:ring-2 focus:ring-purple-500/20"
                          />
                          <div className="text-xs text-purple-600/70">
                            Để trống nếu không giới hạn tổng số lần sử dụng
                          </div>
                        </motion.div>

                        {/* Số lần sử dụng mỗi người */}
                        <motion.div
                          className="space-y-2"
                          whileFocus={{ scale: 1.01 }}
                        >
                          <Label
                            htmlFor="max_uses_per_user"
                            className="flex items-center space-x-2"
                          >
                            <Users className="w-4 h-4 text-purple-600" />
                            <span className="font-semibold text-purple-800">
                              Số lần sử dụng mỗi người *
                            </span>
                          </Label>
                          <Input
                            id="max_uses_per_user"
                            type="number"
                            min="1"
                            placeholder="1"
                            {...register("max_uses_per_user", {
                              valueAsNumber: true,
                            })}
                            className={`h-12 transition-all duration-300 bg-white/80 border-purple-200/50 rounded-2xl ${
                              errors.max_uses_per_user
                                ? "border-red-500 shake"
                                : "focus:ring-2 focus:ring-purple-500/20"
                            }`}
                          />
                          {errors.max_uses_per_user && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-center space-x-1 text-sm text-red-500"
                            >
                              <AlertTriangle className="w-3 h-3" />
                              <span>{errors.max_uses_per_user.message}</span>
                            </motion.p>
                          )}
                          <div className="text-xs text-purple-600/70">
                            Mỗi người dùng có thể sử dụng bao nhiêu lần
                          </div>
                        </motion.div>

                        {/* Preview usage */}
                        <div className="p-4 border border-purple-200/50 rounded-2xl bg-gradient-to-r from-purple-50/50 to-pink-50/50">
                          <div className="flex items-center mb-3 space-x-2">
                            <Info className="w-4 h-4 text-purple-600" />
                            <div className="text-sm font-medium text-purple-800">
                              Tóm tắt giới hạn
                            </div>
                          </div>
                          <div className="space-y-1 text-xs text-purple-700">
                            <div>
                              • Tổng số lần:{" "}
                              {watchedValues.max_uses || "Không giới hạn"}
                            </div>
                            <div>
                              • Mỗi người:{" "}
                              {watchedValues.max_uses_per_user || 1} lần
                            </div>
                            <div>
                              • Ước tính người dùng tối đa:{" "}
                              {watchedValues.max_uses &&
                              watchedValues.max_uses_per_user
                                ? Math.floor(
                                    watchedValues.max_uses /
                                      watchedValues.max_uses_per_user,
                                  )
                                : "Không giới hạn"}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>

                {/* Schedule Tab */}
                <TabsContent value="schedule" className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="border-0 shadow-xl bg-gradient-to-br from-white/95 via-blue-50/80 to-cyan-50/80 backdrop-blur-xl rounded-3xl">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg">
                            <Calendar className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <span className="text-2xl text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text font-bold">
                              Lịch trình hoạt động
                            </span>
                            <p className="mt-1 text-sm text-blue-700/80">
                              Thiết lập thời gian áp dụng mã giảm giá
                            </p>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                          {/* Ngày bắt đầu */}
                          <motion.div
                            className="space-y-2"
                            whileFocus={{ scale: 1.01 }}
                          >
                            <Label
                              htmlFor="start_date"
                              className="flex items-center space-x-2"
                            >
                              <Clock className="w-4 h-4 text-blue-600" />
                              <span className="font-semibold text-blue-800">
                                Ngày bắt đầu *
                              </span>
                            </Label>
                            <Input
                              id="start_date"
                              type="datetime-local"
                              {...register("start_date")}
                              className={`h-12 transition-all duration-300 bg-white/80 border-blue-200/50 rounded-2xl ${
                                errors.start_date
                                  ? "border-red-500 shake"
                                  : "focus:ring-2 focus:ring-blue-500/20"
                              }`}
                            />
                            {errors.start_date && (
                              <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center space-x-1 text-sm text-red-500"
                              >
                                <AlertTriangle className="w-3 h-3" />
                                <span>{errors.start_date.message}</span>
                              </motion.p>
                            )}
                          </motion.div>

                          {/* Ngày kết thúc */}
                          <motion.div
                            className="space-y-2"
                            whileFocus={{ scale: 1.01 }}
                          >
                            <Label
                              htmlFor="end_date"
                              className="flex items-center space-x-2"
                            >
                              <Clock className="w-4 h-4 text-blue-600" />
                              <span className="font-semibold text-blue-800">
                                Ngày kết thúc *
                              </span>
                            </Label>
                            <Input
                              id="end_date"
                              type="datetime-local"
                              {...register("end_date")}
                              className={`h-12 transition-all duration-300 bg-white/80 border-blue-200/50 rounded-2xl ${
                                errors.end_date
                                  ? "border-red-500 shake"
                                  : "focus:ring-2 focus:ring-blue-500/20"
                              }`}
                            />
                            {errors.end_date && (
                              <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center space-x-1 text-sm text-red-500"
                              >
                                <AlertTriangle className="w-3 h-3" />
                                <span>{errors.end_date.message}</span>
                              </motion.p>
                            )}
                          </motion.div>
                        </div>

                        {/* Duration preview */}
                        {watchedValues.start_date && watchedValues.end_date && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-4 border border-blue-200/50 rounded-2xl bg-gradient-to-r from-blue-50/50 to-cyan-50/50"
                          >
                            <div className="flex items-center mb-3 space-x-2">
                              <TrendingUp className="w-4 h-4 text-blue-600" />
                              <div className="text-sm font-medium text-blue-800">
                                Thời gian hoạt động
                              </div>
                            </div>
                            <div className="space-y-1 text-xs text-blue-700">
                              <div>
                                • Bắt đầu:{" "}
                                {new Date(
                                  watchedValues.start_date,
                                ).toLocaleString("vi-VN")}
                              </div>
                              <div>
                                • Kết thúc:{" "}
                                {new Date(
                                  watchedValues.end_date,
                                ).toLocaleString("vi-VN")}
                              </div>
                              <div>
                                • Thời lượng:{" "}
                                {Math.ceil(
                                  (new Date(watchedValues.end_date).getTime() -
                                    new Date(
                                      watchedValues.start_date,
                                    ).getTime()) /
                                    (1000 * 60 * 60 * 24),
                                )}{" "}
                                ngày
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* Trạng thái */}
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="flex items-center justify-between p-4 transition-all duration-300 border border-blue-200/50 rounded-2xl hover:bg-blue-50/30"
                        >
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <div>
                              <Label
                                htmlFor="is_active"
                                className="font-medium text-blue-800"
                              >
                                Kích hoạt mã giảm giá
                              </Label>
                              <p className="text-xs text-blue-600/70">
                                Cho phép khách hàng sử dụng mã này
                              </p>
                            </div>
                          </div>
                          <Switch
                            id="is_active"
                            {...register("is_active")}
                            checked={watchedValues.is_active}
                            onCheckedChange={(checked) =>
                              setValue("is_active", checked)
                            }
                          />
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>
              </AnimatePresence>
            </Tabs>
          </motion.div>

          {/* Enhanced Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6 sticky top-24"
          >
            {/* Preview Card */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white/95 via-green-50/80 to-emerald-50/80 backdrop-blur-xl rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="text-2xl text-transparent bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text font-bold">
                      Xem trước mã giảm giá
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Discount Preview */}
                <div className="p-4 border border-green-200/50 rounded-2xl bg-gradient-to-r from-green-50/50 to-emerald-50/50">
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-bold font-mono text-green-800">
                      {watchedValues.code || "PREVIEW"}
                    </div>
                    <div className="text-lg font-semibold text-green-700">
                      {watchedValues.name || "Tên chiến dịch"}
                    </div>
                    <Badge className="bg-green-500 text-white border-0 shadow-sm text-lg px-4 py-1">
                      {watchedValues.type === "percent"
                        ? `${watchedValues.value || 0}% OFF`
                        : `${formatPrice(watchedValues.value || 0)}`}
                    </Badge>
                  </div>
                </div>

                {/* Test calculation */}
                <div className="space-y-3">
                  <Label className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-green-600" />
                    <span className="font-semibold text-green-800">
                      Test mã giảm giá
                    </span>
                  </Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-green-700">
                        Đơn hàng mẫu:
                      </span>
                      <Input
                        type="number"
                        value={sampleOrder}
                        onChange={(e) =>
                          setSampleOrder(Number(e.target.value) || 0)
                        }
                        className="h-8 text-sm bg-white/80 border-green-200/50 rounded-lg"
                      />
                    </div>

                    {discountPreview && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-3 rounded-2xl ${
                          discountPreview.isValid
                            ? "bg-green-100 border border-green-200"
                            : "bg-red-100 border border-red-200"
                        }`}
                      >
                        {discountPreview.isValid ? (
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span>Tổng đơn hàng:</span>
                              <span className="font-semibold">
                                {formatPrice(sampleOrder)}
                              </span>
                            </div>
                            <div className="flex justify-between text-green-600">
                              <span>Giảm giá:</span>
                              <span className="font-semibold">
                                -{formatPrice(discountPreview.discountAmount)}
                              </span>
                            </div>
                            <div className="flex justify-between border-t pt-1 font-bold text-green-800">
                              <span>Khách phải trả:</span>
                              <span>
                                {formatPrice(discountPreview.finalAmount)}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-red-600 flex items-center space-x-1">
                            <AlertTriangle className="w-3 h-3" />
                            <span>{discountPreview.reason}</span>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Quick info */}
                <div className="space-y-2 text-xs text-green-600/80">
                  {watchedValues.min_order_amount > 0 && (
                    <div>
                      • Đơn tối thiểu:{" "}
                      {formatPrice(watchedValues.min_order_amount)}
                    </div>
                  )}
                  {watchedValues.max_discount_amount && (
                    <div>
                      • Giảm tối đa:{" "}
                      {formatPrice(watchedValues.max_discount_amount)}
                    </div>
                  )}
                  {watchedValues.max_uses && (
                    <div>• Giới hạn: {watchedValues.max_uses} lần</div>
                  )}
                  <div>
                    • Mỗi user: {watchedValues.max_uses_per_user || 1} lần
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick actions */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white/95 via-amber-50/80 to-yellow-50/80 backdrop-blur-xl rounded-3xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 shadow-lg">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="text-xl text-transparent bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text font-bold">
                      Mẫu có sẵn
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left"
                  onClick={() => {
                    setValue("code", "WELCOME50");
                    setValue("name", "Chào mừng khách hàng mới");
                    setValue("type", "percent");
                    setValue("value", 50);
                    setValue("min_order_amount", 100000);
                    setValue("max_discount_amount", 200000);
                    setValue("max_uses", 100);
                  }}
                >
                  <Gift className="w-4 h-4 mr-2" />
                  Mã chào mừng 50%
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left"
                  onClick={() => {
                    setValue("code", "FLASHSALE");
                    setValue("name", "Flash Sale cuối tuần");
                    setValue("type", "fixed");
                    setValue("value", 100000);
                    setValue("min_order_amount", 500000);
                    setValue("max_uses", 50);
                  }}
                >
                  <Star className="w-4 h-4 mr-2" />
                  Flash Sale 100k
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left"
                  onClick={() => {
                    setValue("code", "VIP20");
                    setValue("name", "Ưu đãi khách VIP");
                    setValue("type", "percent");
                    setValue("value", 20);
                    setValue("min_order_amount", 0);
                    setValue("max_uses", undefined);
                    setValue("max_uses_per_user", 5);
                  }}
                >
                  <Crown className="w-4 h-4 mr-2" />
                  VIP 20% không giới hạn
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DiscountCreate;
