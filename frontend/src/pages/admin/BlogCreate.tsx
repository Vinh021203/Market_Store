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
import { BlogPost, BlogCategory } from "@/types/blog";
import { uploadFileToCloudinary } from "@/lib/uploadFileToCloudinary";
import {
  getAllCategories,
  getPostById,
  createBlogPost,
  updateBlogPost,
} from "@/lib/blog";
import {
  ArrowLeft,
  Save,
  Eye,
  Upload,
  X,
  Plus,
  Calendar,
  User,
  Hash,
  FileText,
  Image,
  Settings,
  Loader2,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const blogPostSchema = z.object({
  title: z.string().min(5, "Tiêu đề phải có ít nhất 5 ký tự"),
  excerpt: z.string().min(20, "Tóm tắt phải có ít nhất 20 ký tự"),
  content: z.string().min(100, "Nội dung phải có ít nhất 100 ký tự"),
  categoryId: z.string().min(1, "Vui lòng chọn danh mục"),
  featuredImage: z.string().url("URL hình ảnh không hợp lệ"),
  tags: z.string().optional().default(""),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.string().optional(),
});

type BlogPostFormData = z.infer<typeof blogPostSchema>;

const BlogCreate: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileInfo, setUploadedFileInfo] = useState<{
    size: string;
    format: string;
  } | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [existingPost, setExistingPost] = useState<BlogPost | null>(null);

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
  } = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      isPublished: false,
      isFeatured: false,
      categoryId: "",
      featuredImage:
        "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop",
    },
  });

  // Fetch data từ Supabase
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch categories
        const categoriesData = await getAllCategories();
        setCategories(categoriesData);

        // Fetch existing post nếu đang edit
        if (isEdit && id) {
          const postData = await getPostById(id);
          if (postData) {
            setExistingPost(postData);
            // Reset form với dữ liệu từ database
            reset({
              title: postData.title,
              excerpt: postData.excerpt,
              content: postData.content,
              categoryId: postData.category.id,
              featuredImage: postData.featuredImage,
              tags: postData.tags.join(", "),
              isPublished: postData.isPublished,
              isFeatured: postData.isFeatured,
              metaTitle: postData.seo?.metaTitle || "",
              metaDescription: postData.seo?.metaDescription || "",
              keywords: postData.seo?.keywords?.join(", ") || "",
            });
          } else {
            toast({
              title: "Lỗi",
              description: "Không tìm thấy bài viết",
              variant: "destructive",
            });
            navigate("/admin/blog");
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Lỗi tải dữ liệu",
          description: "Không thể tải dữ liệu. Vui lòng thử lại.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isEdit, id, reset, navigate]);

  const watchedValues = watch();

  const onSubmit = async (data: BlogPostFormData, saveAsDraft = false) => {
    setIsSaving(true);
    setIsDraft(saveAsDraft);

    try {
      // Tìm category object
      const selectedCategory = categories.find(
        (cat) => cat.id === data.categoryId,
      );

      if (!selectedCategory) {
        throw new Error("Không tìm thấy danh mục được chọn");
      }

      const postData: Partial<BlogPost> = {
        title: data.title,
        slug: generateSlug(data.title),
        excerpt: data.excerpt,
        content: data.content,
        featuredImage: data.featuredImage,
        category: selectedCategory,
        tags: data.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        isPublished: saveAsDraft ? false : data.isPublished,
        isFeatured: data.isFeatured,
        readTime: Math.ceil(data.content.length / 1000),
        seo: {
          metaTitle: data.metaTitle || data.title,
          metaDescription: data.metaDescription || data.excerpt,
          keywords: data.keywords
            ? data.keywords
                .split(",")
                .map((k) => k.trim())
                .filter(Boolean)
            : [],
        },
      };

      let result;
      if (isEdit && id) {
        // Cập nhật bài viết
        result = await updateBlogPost(id, postData);
        if (!result) {
          throw new Error("Không thể cập nhật bài viết");
        }
      } else {
        // Tạo bài viết mới
        result = await createBlogPost(postData);
        if (!result) {
          throw new Error("Không thể tạo bài viết");
        }
      }

      toast({
        title: isEdit ? "Bài viết đã được cập nhật" : "Bài viết đã được tạo",
        description: saveAsDraft
          ? "Bài viết đã được lưu dưới dạng bản nháp"
          : data.isPublished
            ? "Bài viết đã được xuất bản thành công"
            : "Bài viết đã được lưu",
      });

      navigate("/admin/blog");
    } catch (error) {
      console.error("Error saving post:", error);
      toast({
        title: "Lỗi",
        description:
          error instanceof Error
            ? error.message
            : "Có lỗi xảy ra khi lưu bài viết",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
      setIsDraft(false);
    }
  };

  const handleSaveAsDraft = () => {
    handleSubmit((data) => onSubmit(data, true))();
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Đang tải dữ liệu...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/admin/blog")}
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
              {isEdit ? "Chỉnh sửa bài viết" : "Viết bài mới"}
            </h1>
            <p className="text-muted-foreground">
              {isEdit
                ? "Cập nhật nội dung bài viết"
                : "Tạo bài viết mới cho blog"}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={handleSaveAsDraft}
            disabled={isSaving}
          >
            {isSaving && isDraft ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <FileText className="w-4 h-4 mr-2" />
            )}
            Lưu nháp
          </Button>

          <Button
            onClick={handleSubmit((data) => onSubmit(data, false))}
            disabled={isSaving}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            {isSaving && !isDraft ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isEdit ? "Cập nhật" : "Xuất bản"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="content">Nội dung</TabsTrigger>
              <TabsTrigger value="media">Hình ảnh</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span>Nội dung bài viết</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Tiêu đề *</Label>
                    <Input
                      id="title"
                      placeholder="Nhập tiêu đề bài viết..."
                      {...register("title")}
                      className={errors.title ? "border-red-500" : ""}
                    />
                    {errors.title && (
                      <p className="text-sm text-red-500">
                        {errors.title.message}
                      </p>
                    )}
                    {watchedValues.title && (
                      <p className="text-xs text-muted-foreground">
                        Slug: {generateSlug(watchedValues.title)}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Tóm tắt *</Label>
                    <Textarea
                      id="excerpt"
                      placeholder="Viết tóm tắt ngắn gọn về bài viết..."
                      rows={3}
                      {...register("excerpt")}
                      className={errors.excerpt ? "border-red-500" : ""}
                    />
                    {errors.excerpt && (
                      <p className="text-sm text-red-500">
                        {errors.excerpt.message}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {watchedValues.excerpt?.length || 0} ký tự
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Nội dung *</Label>
                    <Textarea
                      id="content"
                      placeholder="Viết nội dung bài viết ở đây... Hỗ trợ Markdown."
                      rows={15}
                      {...register("content")}
                      className={errors.content ? "border-red-500" : ""}
                    />
                    {errors.content && (
                      <p className="text-sm text-red-500">
                        {errors.content.message}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {watchedValues.content?.length || 0} ký tự • Thời gian
                      đọc: ~
                      {Math.ceil((watchedValues.content?.length || 0) / 1000)}{" "}
                      phút
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="media" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Image className="w-5 h-5" />
                    <span>Hình ảnh đại diện</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="featuredImage">URL hình ảnh *</Label>
                    <Input
                      id="featuredImage"
                      placeholder="https://example.com/image.jpg"
                      {...register("featuredImage")}
                      className={errors.featuredImage ? "border-red-500" : ""}
                    />
                    {errors.featuredImage && (
                      <p className="text-sm text-red-500">
                        {errors.featuredImage.message}
                      </p>
                    )}
                  </div>

                  {/* Upload file section */}
                  <div className="space-y-2">
                    <Label>Hoặc tải ảnh lên</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        // Validate file
                        const validTypes = [
                          "image/jpeg",
                          "image/png",
                          "image/gif",
                          "image/webp",
                        ];
                        if (!validTypes.includes(file.type)) {
                          toast({
                            title: "Lỗi định dạng",
                            description:
                              "Vui lòng chọn file ảnh hợp lệ (JPEG, PNG, GIF, WEBP)",
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
                          setSelectedFileUrl(result.url);
                          setUploadedFileInfo({
                            size: result.size,
                            format: result.format,
                          });
                          setValue("featuredImage", result.url);

                          toast({
                            title: "Upload thành công",
                            description: `Ảnh đã được tải lên (${result.size}, ${result.format})`,
                          });
                        } catch (error) {
                          console.error("Upload error:", error);
                          toast({
                            title: "Lỗi upload",
                            description:
                              error instanceof Error
                                ? error.message
                                : "Có lỗi xảy ra khi tải ảnh",
                            variant: "destructive",
                          });
                        } finally {
                          setIsUploading(false);
                        }
                      }}
                      disabled={isUploading}
                    />

                    {isUploading && (
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Đang tải ảnh lên Cloudinary...</span>
                      </div>
                    )}
                  </div>

                  {/* Preview section */}
                  {(selectedFileUrl || watchedValues.featuredImage) && (
                    <div className="space-y-2">
                      <Label>Xem trước</Label>
                      <div className="p-2 border rounded-lg">
                        <img
                          src={selectedFileUrl || watchedValues.featuredImage}
                          alt="Featured"
                          className="object-cover w-full h-48 rounded"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop";
                          }}
                        />
                      </div>

                      {selectedFileUrl && uploadedFileInfo && (
                        <div className="flex items-center justify-between p-3 border border-green-200 rounded bg-green-50">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-green-800">
                              ✓ Upload thành công
                            </span>
                            <span className="text-xs text-green-600">
                              {uploadedFileInfo.size} •{" "}
                              {uploadedFileInfo.format}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedFileUrl(null);
                              setUploadedFileInfo(null);
                              setValue("featuredImage", "");
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Drag & Drop area */}
                  <div
                    className="p-8 text-center transition-colors border-2 border-dashed rounded-lg cursor-pointer border-muted hover:border-primary/50"
                    onClick={() =>
                      document.getElementById("file-upload")?.click()
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
                        setSelectedFileUrl(result.url);
                        setUploadedFileInfo({
                          size: result.size,
                          format: result.format,
                        });
                        setValue("featuredImage", result.url);

                        toast({
                          title: "Upload thành công",
                          description: `Ảnh đã được tải lên (${result.size}, ${result.format})`,
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
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        const validTypes = [
                          "image/jpeg",
                          "image/png",
                          "image/gif",
                          "image/webp",
                        ];
                        if (!validTypes.includes(file.type)) {
                          toast({
                            title: "Lỗi định dạng",
                            description: "Vui lòng chọn file ảnh hợp lệ",
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
                          setSelectedFileUrl(result.url);
                          setUploadedFileInfo({
                            size: result.size,
                            format: result.format,
                          });
                          setValue("featuredImage", result.url);

                          toast({
                            title: "Upload thành công",
                            description: `Ảnh đã được tải lên (${result.size}, ${result.format})`,
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
                    />
                  </div>

                  {/* Upload progress or info */}
                  {uploadedFileInfo && (
                    <div className="p-3 border border-blue-200 rounded-lg bg-blue-50">
                      <div className="flex items-center space-x-2 text-sm text-blue-800">
                        <Image className="w-4 h-4" />
                        <span>
                          File info: {uploadedFileInfo.size} •{" "}
                          {uploadedFileInfo.format}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seo" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="w-5 h-5" />
                    <span>Tối ưu SEO</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="metaTitle">Meta Title</Label>
                    <Input
                      id="metaTitle"
                      placeholder="Tiêu đề SEO (để trống sẽ dùng tiêu đề bài viết)"
                      {...register("metaTitle")}
                    />
                    <p className="text-xs text-muted-foreground">
                      {
                        (watchedValues.metaTitle || watchedValues.title || "")
                          .length
                      }
                      /60 ký tự
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="metaDescription">Meta Description</Label>
                    <Textarea
                      id="metaDescription"
                      placeholder="Mô tả SEO (để trống sẽ dùng tóm tắt bài viết)"
                      rows={3}
                      {...register("metaDescription")}
                    />
                    <p className="text-xs text-muted-foreground">
                      {
                        (
                          watchedValues.metaDescription ||
                          watchedValues.excerpt ||
                          ""
                        ).length
                      }
                      /160 ký tự
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="keywords">Keywords</Label>
                    <Input
                      id="keywords"
                      placeholder="từ khóa 1, từ khóa 2, từ khóa 3"
                      {...register("keywords")}
                    />
                    <p className="text-xs text-muted-foreground">
                      Các từ khóa cách nhau bằng dấu phẩy
                    </p>
                  </div>

                  {/* SEO Preview */}
                  <div className="space-y-2">
                    <Label>Xem trước kết quả tìm kiếm</Label>
                    <div className="p-4 border rounded-lg bg-muted/50">
                      <div className="text-lg text-blue-600 cursor-pointer hover:underline">
                        {watchedValues.metaTitle ||
                          watchedValues.title ||
                          "Tiêu đề bài viết"}
                      </div>
                      <div className="text-sm text-green-700">
                        templatemarket.com/blog/
                        {generateSlug(watchedValues.title || "")}
                      </div>
                      <div className="mt-1 text-sm text-gray-600">
                        {watchedValues.metaDescription ||
                          watchedValues.excerpt ||
                          "Mô tả bài viết sẽ hiển thị ở đây..."}
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
          {/* Publish Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Xuất bản</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="isPublished">Xuất bản ngay</Label>
                <Switch
                  id="isPublished"
                  checked={watchedValues.isPublished}
                  onCheckedChange={(checked) =>
                    setValue("isPublished", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="isFeatured">Bài viết nổi bật</Label>
                <Switch
                  id="isFeatured"
                  checked={watchedValues.isFeatured}
                  onCheckedChange={(checked) => setValue("isFeatured", checked)}
                />
              </div>

              <div className="space-y-2">
                <Label>Ngày xuất bản</Label>
                <Input
                  type="datetime-local"
                  defaultValue={new Date().toISOString().slice(0, 16)}
                />
              </div>

              <div className="space-y-2">
                <Label>Tác giả</Label>
                <div className="flex items-center p-2 space-x-2 border rounded">
                  <img
                    src={
                      user.avatar ||
                      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
                    }
                    alt={user.name}
                    className="object-cover w-6 h-6 rounded-full"
                  />
                  <span className="text-sm">{user.name}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category & Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Hash className="w-5 h-5" />
                <span>Phân loại</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="categoryId">Danh mục *</Label>
                <Select
                  value={watchedValues.categoryId || ""}
                  onValueChange={(value) => setValue("categoryId", value)}
                >
                  <SelectTrigger
                    className={errors.categoryId ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.categoryId && (
                  <p className="text-sm text-red-500">
                    {errors.categoryId.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  placeholder="react, javascript, tutorial"
                  {...register("tags")}
                />
                <p className="text-xs text-muted-foreground">
                  Các tag cách nhau bằng dấu phẩy
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Xem trước</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                <Eye className="w-4 h-4 mr-2" />
                Xem trước bài viết
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BlogCreate;
