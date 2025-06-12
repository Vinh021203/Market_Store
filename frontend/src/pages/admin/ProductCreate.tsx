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
import { useAuth } from "@/contexts/AuthContext";
import { isAdmin } from "@/lib/auth";
import { uploadFileToCloudinary } from "@/lib/uploadFileToCloudinary";
import { Product } from "@/types";
import { createProduct, updateProduct, getProductById } from "@/lib/products";
import {
  ArrowLeft,
  Save,
  Eye,
  Upload,
  X,
  Plus,
  Package,
  DollarSign,
  Image,
  Settings,
  Tag,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const productSchema = z.object({
  title: z.string().min(5, "Tiêu đề phải có ít nhất 5 ký tự"),
  description: z.string().min(20, "Mô tả phải có ít nhất 20 ký tự"),
  price: z.number().min(0, "Giá phải lớn hơn 0"),
  originalPrice: z.number().optional(),
  category: z.enum(["template", "ebook"], {
    required_error: "Vui lòng chọn danh mục",
  }),
  tags: z.string(),
  image: z.string().url("URL hình ảnh không hợp lệ"),
  images: z.string(),
  downloadUrl: z.string().optional(),
  previewUrl: z.string().optional(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  author: z.string().min(2, "Tên tác giả phải có ít nhất 2 ký tự"),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]).optional(),
  technologies: z.string().optional(),
  fileSize: z.string().optional(),
  format: z.string().optional(),
  pages: z.number().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

const ProductCreate: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  if (!user || !isAdmin(user)) {
    return <Navigate to="/" replace />;
  }

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      originalPrice: 0,
      category: "template",
      tags: "",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
      images: "",
      downloadUrl: "",
      previewUrl: "",
      isActive: true,
      isFeatured: false,
      author: "",
      difficulty: "Beginner",
      technologies: "",
      fileSize: "",
      format: "",
      pages: 0,
    },
  });

  const watchedValues = watch();

  useEffect(() => {
    if (isEdit && id) {
      const fetchProduct = async () => {
        const product = await getProductById(id);
        if (product) {
          setValue("title", product.title);
          setValue("description", product.description);
          setValue("price", product.price);
          setValue("originalPrice", product.originalPrice);
          setValue("category", product.category);
          setValue("tags", product.tags.join(", "));
          setValue("image", product.image);
          setValue("images", product.images.join(", "));
          setValue("downloadUrl", product.downloadUrl || "");
          setValue("previewUrl", product.previewUrl || "");
          setValue("isActive", product.isActive);
          setValue("isFeatured", product.isFeatured);
          setValue("author", product.author);
          setValue("difficulty", product.difficulty || "Beginner");
          setValue("technologies", product.technologies?.join(", ") || "");
          setValue("fileSize", product.fileSize || "");
          setValue("format", product.format || "");
          setValue("pages", product.pages || 0);
        }
      };

      fetchProduct();
    }
  }, [id, isEdit, setValue]);

  const onSubmit = async (data: ProductFormData) => {
    setIsSaving(true);
    const transformed = {
      ...data,
      tags: data.tags.split(",").map((t) => t.trim()),
      images: data.images.split(",").map((t) => t.trim()),
      technologies: data.technologies
        ? data.technologies.split(",").map((t) => t.trim())
        : [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      if (isEdit && id) {
        await updateProduct(id, transformed);
      } else {
        await createProduct(transformed);
      }

      toast({
        title: isEdit ? "Cập nhật thành công" : "Tạo sản phẩm thành công",
      });

      navigate("/admin/products");
    } catch (err) {
      toast({
        title: "Lỗi",
        description: (err as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const discountPercentage =
    watchedValues.originalPrice && watchedValues.price
      ? Math.round(
          ((watchedValues.originalPrice - watchedValues.price) /
            watchedValues.originalPrice) *
            100,
        )
      : 0;

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("http://localhost:5000/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Tải ảnh thất bại");
    const data = await res.json();
    return data.url; // backend trả về { url: "https://..." }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/admin/products")}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
              {isEdit ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
            </h1>
            <p className="text-muted-foreground">
              {isEdit
                ? "Cập nhật thông tin sản phẩm"
                : "Tạo sản phẩm mới cho cửa hàng"}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            Xem trước
          </Button>

          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={isSaving}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            {isSaving ? (
              <div className="w-4 h-4 mr-2 border-2 border-white rounded-full animate-spin border-t-transparent" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isEdit ? "Cập nhật" : "Tạo sản phẩm"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
              <TabsTrigger value="media">Hình ảnh</TabsTrigger>
              <TabsTrigger value="details">Chi tiết</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Package className="w-5 h-5" />
                    <span>Thông tin sản phẩm</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Tiêu đề *</Label>
                    <Input
                      id="title"
                      placeholder="Nhập tiêu đề sản phẩm..."
                      {...register("title")}
                      className={errors.title ? "border-red-500" : ""}
                    />
                    {errors.title && (
                      <p className="text-sm text-red-500">
                        {errors.title.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Mô tả *</Label>
                    <Textarea
                      id="description"
                      placeholder="Mô tả chi tiết về sản phẩm..."
                      rows={5}
                      {...register("description")}
                      className={errors.description ? "border-red-500" : ""}
                    />
                    {errors.description && (
                      <p className="text-sm text-red-500">
                        {errors.description.message}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {watchedValues.description?.length || 0} ký tự
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="author">Tác giả *</Label>
                    <Input
                      id="author"
                      placeholder="Tên tác giả hoặc đội ngũ phát triển"
                      {...register("author")}
                      className={errors.author ? "border-red-500" : ""}
                    />
                    {errors.author && (
                      <p className="text-sm text-red-500">
                        {errors.author.message}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="media" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Image className="w-5 h-5" />
                    <span>Hình ảnh sản phẩm</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Ảnh chính */}
                  <div className="space-y-2">
                    <Label htmlFor="image">Hình ảnh chính *</Label>
                    <Input
                      id="image"
                      placeholder="https://example.com/image.jpg"
                      {...register("image")}
                      className={errors.image ? "border-red-500" : ""}
                    />
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        try {
                          const url = await uploadImage(file);
                          setSelectedFileUrl(url);
                          setValue("image", url);
                        } catch (err) {
                          toast({
                            title: "Lỗi tải ảnh",
                            description: (err as Error).message,
                            variant: "destructive",
                          });
                        }
                      }}
                    />

                    {selectedFileUrl && (
                      <img
                        src={selectedFileUrl}
                        className="object-cover w-full h-40 rounded"
                      />
                    )}
                  </div>

                  {/* Ảnh phụ */}
                  <div className="space-y-2">
                    <Label htmlFor="images">
                      Ảnh phụ (nhiều ảnh, ngăn cách bằng dấu phẩy)
                    </Label>
                    <Input
                      id="images"
                      placeholder="https://example.com/1.jpg, https://example.com/2.jpg"
                      {...register("images")}
                    />
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        try {
                          const url = await uploadImage(file);
                          setSelectedFileUrl(url);
                          setValue("image", url);
                        } catch (err) {
                          toast({
                            title: "Lỗi tải ảnh",
                            description: (err as Error).message,
                            variant: "destructive",
                          });
                        }
                      }}
                    />

                    {watchedValues.images && (
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {watchedValues.images.split(",").map((img, i) => (
                          <img
                            key={i}
                            src={img.trim()}
                            className="object-cover w-full rounded h-28"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="w-5 h-5" />
                    <span>Chi tiết kỹ thuật</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="fileSize">Dung lượng file</Label>
                      <Input
                        id="fileSize"
                        placeholder="VD: 15.2 MB"
                        {...register("fileSize")}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="format">Định dạng</Label>
                      <Input
                        id="format"
                        placeholder="VD: ZIP, PDF"
                        {...register("format")}
                      />
                    </div>
                  </div>

                  {watchedValues.category === "ebook" && (
                    <div className="space-y-2">
                      <Label htmlFor="pages">Số trang</Label>
                      <Input
                        id="pages"
                        type="number"
                        placeholder="VD: 245"
                        {...register("pages", { valueAsNumber: true })}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Độ khó</Label>
                    <Select
                      value={watchedValues.difficulty}
                      onValueChange={(value: any) =>
                        setValue("difficulty", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn độ khó" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">
                          Intermediate
                        </SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="technologies">Công nghệ sử dụng</Label>
                    <Input
                      id="technologies"
                      placeholder="React, TypeScript, TailwindCSS"
                      {...register("technologies")}
                    />
                    <p className="text-xs text-muted-foreground">
                      Các công nghệ cách nhau bằng dấu phẩy
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="downloadUrl">Link download</Label>
                      <Input
                        id="downloadUrl"
                        placeholder="https://example.com/download"
                        {...register("downloadUrl")}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="previewUrl">Link preview</Label>
                      <Input
                        id="previewUrl"
                        placeholder="https://preview.example.com"
                        {...register("previewUrl")}
                      />
                    </div>
                  </div>

                  {/* Upload file ZIP/PDF */}
                  <div className="space-y-2">
                    <Label>Tải file ZIP/PDF *</Label>
                    <Input
                      type="file"
                      accept=".zip,.pdf"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        try {
                          const { url, size, format } =
                            await uploadFileToCloudinary(file);
                          setValue("downloadUrl", url);
                          setValue("fileSize", size);
                          setValue("format", format);

                          toast({
                            title: "Upload thành công",
                            description: file.name,
                          });
                        } catch (err) {
                          toast({
                            title: "Lỗi khi tải file",
                            description: (err as Error).message,
                            variant: "destructive",
                          });
                        }
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seo" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tối ưu SEO</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags SEO</Label>
                    <Input
                      id="tags"
                      placeholder="react, template, ecommerce, modern"
                      {...register("tags")}
                    />
                    <p className="text-xs text-muted-foreground">
                      Các tag cách nhau bằng dấu phẩy
                    </p>
                  </div>

                  {/* SEO Preview */}
                  <div className="space-y-2">
                    <Label>Xem trước kết quả tìm kiếm</Label>
                    <div className="p-4 border rounded-lg bg-muted/50">
                      <div className="text-lg text-blue-600 cursor-pointer hover:underline">
                        {watchedValues.title || "Tiêu đề sản phẩm"}
                      </div>
                      <div className="text-sm text-green-700">
                        templatemarket.com/product/
                        {watchedValues.title
                          ?.toLowerCase()
                          .replace(/\s+/g, "-") || "product-slug"}
                      </div>
                      <div className="mt-1 text-sm text-gray-600">
                        {watchedValues.description ||
                          "Mô tả sản phẩm sẽ hiển thị ở đây..."}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5" />
                <span>Giá bán</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="price">Giá bán *</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="299000"
                  {...register("price", { valueAsNumber: true })}
                  className={errors.price ? "border-red-500" : ""}
                />
                {errors.price && (
                  <p className="text-sm text-red-500">{errors.price.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="originalPrice">Giá gốc (nếu có giảm giá)</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  placeholder="399000"
                  {...register("originalPrice", { valueAsNumber: true })}
                />
              </div>

              {discountPercentage > 0 && (
                <div className="p-3 border border-green-200 rounded-lg bg-green-50">
                  <div className="text-sm font-medium text-green-800">
                    Giảm giá {discountPercentage}%
                  </div>
                  <div className="text-xs text-green-600">
                    Tiết kiệm{" "}
                    {(
                      (watchedValues.originalPrice || 0) - watchedValues.price
                    ).toLocaleString()}{" "}
                    VND
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Category & Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Tag className="w-5 h-5" />
                <span>Phân loại</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Danh mục *</Label>
                <Select
                  value={watchedValues.category}
                  onValueChange={(value: any) => setValue("category", value)}
                >
                  <SelectTrigger
                    className={errors.category ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="template">Template</SelectItem>
                    <SelectItem value="ebook">E-book</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-500">
                    {errors.category.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="isActive">Kích hoạt sản phẩm</Label>
                <Switch
                  id="isActive"
                  {...register("isActive")}
                  checked={watchedValues.isActive}
                  onCheckedChange={(checked) => setValue("isActive", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="isFeatured">Sản phẩm nổi bật</Label>
                <Switch
                  id="isFeatured"
                  {...register("isFeatured")}
                  checked={watchedValues.isFeatured}
                  onCheckedChange={(checked) => setValue("isFeatured", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Xem trước</CardTitle>
            </CardHeader>
            <CardContent>
              {(selectedFileUrl || watchedValues.image) && (
                <div className="space-y-2">
                  <Label>Xem trước hình ảnh chính</Label>
                  <div className="p-2 border rounded-lg">
                    <img
                      src={selectedFileUrl || watchedValues.image}
                      alt="Preview"
                      className="object-cover w-full h-48 rounded"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://via.placeholder.com/400x300?text=Image+error";
                      }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductCreate;
