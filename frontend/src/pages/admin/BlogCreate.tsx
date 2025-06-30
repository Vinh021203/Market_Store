// import React, { useState, useEffect } from "react";
// import { Navigate, useNavigate, useParams } from "react-router-dom";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Switch } from "@/components/ui/switch";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Badge } from "@/components/ui/badge";
// import { useAuth } from "@/contexts/AuthContext";
// import { isAdmin } from "@/lib/auth";
// import { BlogPost, BlogCategory } from "@/types/blog";
// import { uploadFileToCloudinary } from "@/lib/uploadFileToCloudinary";
// import {
//   getAllCategories,
//   getPostById,
//   createBlogPost,
//   updateBlogPost,
// } from "@/lib/blog";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   ArrowLeft,
//   Save,
//   Eye,
//   Upload,
//   X,
//   Plus,
//   Calendar,
//   User,
//   Hash,
//   FileText,
//   Image,
//   Settings,
//   Loader2,
//   Coffee,
//   Code,
//   Palette,
//   Sparkles,
//   Globe,
//   Target,
//   Clock,
//   BarChart3,
//   AlertTriangle,
//   CheckCircle,
// } from "lucide-react";
// import { toast } from "@/hooks/use-toast";

// const blogPostSchema = z.object({
//   title: z.string().min(5, "Tiêu đề phải có ít nhất 5 ký tự"),
//   excerpt: z.string().min(20, "Tóm tắt phải có ít nhất 20 ký tự"),
//   content: z.string().min(100, "Nội dung phải có ít nhất 100 ký tự"),
//   categoryId: z.string().min(1, "Vui lòng chọn danh mục"),
//   featuredImage: z.string().url("URL hình ảnh không hợp lệ"),
//   tags: z.string().optional().default(""),
//   isPublished: z.boolean().default(false),
//   isFeatured: z.boolean().default(false),
//   metaTitle: z.string().optional(),
//   metaDescription: z.string().optional(),
//   keywords: z.string().optional(),
// });

// type BlogPostFormData = z.infer<typeof blogPostSchema>;

// const BlogCreate: React.FC = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const { id } = useParams<{ id: string }>();
//   const isEdit = Boolean(id);
//   const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null);
//   const [isUploading, setIsUploading] = useState(false);
//   const [uploadedFileInfo, setUploadedFileInfo] = useState<{
//     size: string;
//     format: string;
//   } | null>(null);
//   const [isSaving, setIsSaving] = useState(false);
//   const [isDraft, setIsDraft] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [categories, setCategories] = useState<BlogCategory[]>([]);
//   const [existingPost, setExistingPost] = useState<BlogPost | null>(null);
//   const [activeTab, setActiveTab] = useState("content");
//   const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});

//   if (!user || !isAdmin(user)) {
//     return <Navigate to="/" replace />;
//   }

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     watch,
//     reset,
//     formState: { errors },
//   } = useForm<BlogPostFormData>({
//     resolver: zodResolver(blogPostSchema),
//     defaultValues: {
//       isPublished: false,
//       isFeatured: false,
//       categoryId: "",
//       featuredImage:
//         "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop",
//     },
//   });

//   const watchedValues = watch();

//   // Fetch data từ Supabase
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         // Fetch categories
//         const categoriesData = await getAllCategories();
//         setCategories(categoriesData);

//         // Fetch existing post nếu đang edit
//         if (isEdit && id) {
//           const postData = await getPostById(id);
//           if (postData) {
//             setExistingPost(postData);
//             // Reset form với dữ liệu từ database
//             reset({
//               title: postData.title,
//               excerpt: postData.excerpt,
//               content: postData.content,
//               categoryId: postData.category.id,
//               featuredImage: postData.featuredImage,
//               tags: postData.tags.join(", "),
//               isPublished: postData.isPublished,
//               isFeatured: postData.isFeatured,
//               metaTitle: postData.seo?.metaTitle || "",
//               metaDescription: postData.seo?.metaDescription || "",
//               keywords: postData.seo?.keywords?.join(", ") || "",
//             });
//           } else {
//             toast({
//               title: "❌ Lỗi",
//               description: "Không tìm thấy bài viết",
//               variant: "destructive",
//             });
//             navigate("/admin/blog");
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         toast({
//           title: "❌ Lỗi tải dữ liệu",
//           description: "Không thể tải dữ liệu. Vui lòng thử lại.",
//           variant: "destructive",
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();

//     // Intersection Observer for scroll animations
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             setIsVisible((prev) => ({
//               ...prev,
//               [entry.target.id]: true,
//             }));
//           }
//         });
//       },
//       { threshold: 0.1 },
//     );

//     const sections = document.querySelectorAll("[data-animate]");
//     sections.forEach((section) => observer.observe(section));

//     return () => observer.disconnect();
//   }, [isEdit, id, reset, navigate]);

//   const onSubmit = async (data: BlogPostFormData, saveAsDraft = false) => {
//     setIsSaving(true);
//     setIsDraft(saveAsDraft);

//     try {
//       // Tìm category object
//       const selectedCategory = categories.find(
//         (cat) => cat.id === data.categoryId,
//       );

//       if (!selectedCategory) {
//         throw new Error("Không tìm thấy danh mục được chọn");
//       }

//       const postData: Partial<BlogPost> = {
//         title: data.title,
//         slug: generateSlug(data.title),
//         excerpt: data.excerpt,
//         content: data.content,
//         featuredImage: data.featuredImage,
//         category: selectedCategory,
//         tags: data.tags
//           .split(",")
//           .map((tag) => tag.trim())
//           .filter(Boolean),
//         isPublished: saveAsDraft ? false : data.isPublished,
//         isFeatured: data.isFeatured,
//         readTime: Math.ceil(data.content.length / 1000),
//         seo: {
//           metaTitle: data.metaTitle || data.title,
//           metaDescription: data.metaDescription || data.excerpt,
//           keywords: data.keywords
//             ? data.keywords
//                 .split(",")
//                 .map((k) => k.trim())
//                 .filter(Boolean)
//             : [],
//         },
//       };

//       let result;
//       if (isEdit && id) {
//         // Cập nhật bài viết
//         result = await updateBlogPost(id, postData);
//         if (!result) {
//           throw new Error("Không thể cập nhật bài viết");
//         }
//       } else {
//         // Tạo bài viết mới
//         result = await createBlogPost(postData);
//         if (!result) {
//           throw new Error("Không thể tạo bài viết");
//         }
//       }

//       toast({
//         title: isEdit
//           ? "✅ Bài viết đã được cập nhật"
//           : "✅ Bài viết đã được tạo",
//         description: saveAsDraft
//           ? "Bài viết đã được lưu dưới dạng bản nháp"
//           : data.isPublished
//             ? "Bài viết đã được xuất bản thành công"
//             : "Bài viết đã được lưu",
//       });

//       navigate("/admin/blog");
//     } catch (error) {
//       console.error("Error saving post:", error);
//       toast({
//         title: "❌ Lỗi",
//         description:
//           error instanceof Error
//             ? error.message
//             : "Có lỗi xảy ra khi lưu bài viết",
//         variant: "destructive",
//       });
//     } finally {
//       setIsSaving(false);
//       setIsDraft(false);
//     }
//   };

//   const handleSaveAsDraft = () => {
//     handleSubmit((data) => onSubmit(data, true))();
//   };

//   const generateSlug = (title: string) => {
//     return title
//       .toLowerCase()
//       .normalize("NFD")
//       .replace(/[\u0300-\u036f]/g, "") // Remove accents
//       .replace(/[^a-z0-9\s-]/g, "")
//       .replace(/\s+/g, "-")
//       .replace(/-+/g, "-")
//       .replace(/(^-|-$)/g, "");
//   };

//   const tabsConfig = [
//     {
//       id: "content",
//       label: "Nội dung",
//       icon: FileText,
//       color: "from-blue-500 to-cyan-500",
//     },
//     {
//       id: "media",
//       label: "Hình ảnh",
//       icon: Image,
//       color: "from-purple-500 to-pink-500",
//     },
//     {
//       id: "seo",
//       label: "SEO",
//       icon: Globe,
//       color: "from-green-500 to-emerald-500",
//     },
//   ];

//   // ✅ Loading state
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
//         {/* Floating Elements */}
//         <div className="fixed inset-0 overflow-hidden pointer-events-none">
//           <div className="absolute top-1/4 left-1/4 animate-float">
//             <FileText className="w-8 h-8 text-blue-500 opacity-20" />
//           </div>
//           <div className="absolute top-1/3 right-1/4 animate-float-delay-1">
//             <Image className="w-6 h-6 text-purple-500 opacity-20" />
//           </div>
//           <div className="absolute bottom-1/4 left-1/3 animate-float-delay-2">
//             <Coffee className="text-orange-500 w-7 h-7 opacity-20" />
//           </div>
//         </div>

//         <div className="container relative z-10 px-4 py-8 mx-auto">
//           <motion.div
//             initial={{ opacity: 0, scale: 0.8 }}
//             animate={{ opacity: 1, scale: 1 }}
//             className="flex items-center justify-center min-h-screen"
//           >
//             <Card className="py-12 text-center border-0 shadow-2xl bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900">
//               <CardContent>
//                 <motion.div
//                   animate={{ rotate: 360 }}
//                   transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//                   className="w-12 h-12 mx-auto mb-4 border-4 rounded-full border-primary border-t-transparent"
//                 />
//                 <h2 className="mb-2 text-xl font-semibold">
//                   Đang tải dữ liệu...
//                 </h2>
//                 <p className="text-muted-foreground">
//                   Vui lòng đợi trong giây lát
//                 </p>
//               </CardContent>
//             </Card>
//           </motion.div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
//       {/* Floating Elements */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-1/4 left-1/4 animate-float">
//           <Code className="w-8 h-8 text-blue-500 opacity-20" />
//         </div>
//         <div className="absolute top-1/3 right-1/4 animate-float-delay-1">
//           <Palette className="w-6 h-6 text-purple-500 opacity-20" />
//         </div>
//         <div className="absolute bottom-1/4 left-1/3 animate-float-delay-2">
//           <Coffee className="text-orange-500 w-7 h-7 opacity-20" />
//         </div>
//       </div>

//       <div className="container relative z-10 px-4 py-8 mx-auto space-y-8">
//         {/* ✅ Enhanced Header */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="flex items-center justify-between"
//           id="header"
//           data-animate
//         >
//           <div className="flex items-center space-x-4">
//             <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => navigate("/admin/blog")}
//                 className="group"
//               >
//                 <ArrowLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
//                 Quay lại
//               </Button>
//             </motion.div>
//             <div className="flex items-center space-x-3">
//               <motion.div
//                 whileHover={{ scale: 1.1, rotate: 5 }}
//                 className="flex items-center justify-center w-12 h-12 shadow-lg rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600"
//               >
//                 {isEdit ? (
//                   <Settings className="w-6 h-6 text-white" />
//                 ) : (
//                   <Plus className="w-6 h-6 text-white" />
//                 )}
//               </motion.div>
//               <div>
//                 <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text">
//                   {isEdit ? "Chỉnh sửa bài viết" : "Viết bài mới"}
//                 </h1>
//                 <p className="text-muted-foreground">
//                   {isEdit
//                     ? "Cập nhật nội dung bài viết"
//                     : "Tạo bài viết mới cho blog"}
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="flex items-center space-x-3">
//             <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//               <Button
//                 variant="outline"
//                 onClick={handleSaveAsDraft}
//                 disabled={isSaving}
//                 className="group"
//               >
//                 {isSaving && isDraft ? (
//                   <motion.div
//                     animate={{ rotate: 360 }}
//                     transition={{
//                       duration: 1,
//                       repeat: Infinity,
//                       ease: "linear",
//                     }}
//                     className="w-4 h-4 mr-2 border-2 border-current rounded-full border-t-transparent"
//                   />
//                 ) : (
//                   <FileText className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
//                 )}
//                 Lưu nháp
//               </Button>
//             </motion.div>

//             <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//               <Button
//                 onClick={handleSubmit((data) => onSubmit(data, false))}
//                 disabled={isSaving}
//                 className="transition-all duration-300 shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl"
//               >
//                 {isSaving && !isDraft ? (
//                   <motion.div
//                     animate={{ rotate: 360 }}
//                     transition={{
//                       duration: 1,
//                       repeat: Infinity,
//                       ease: "linear",
//                     }}
//                     className="w-4 h-4 mr-2 border-2 border-white rounded-full border-t-transparent"
//                   />
//                 ) : (
//                   <Save className="w-4 h-4 mr-2" />
//                 )}
//                 {isEdit ? "Cập nhật" : "Xuất bản"}
//               </Button>
//             </motion.div>
//           </div>
//         </motion.div>

//         <div className="grid gap-8 lg:grid-cols-3">
//           {/* ✅ Enhanced Main Content */}
//           <motion.div
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.2 }}
//             className="space-y-6 lg:col-span-2"
//             id="main-content"
//             data-animate
//           >
//             <Tabs
//               value={activeTab}
//               onValueChange={setActiveTab}
//               className="w-full"
//             >
//               <TabsList className="grid w-full grid-cols-3 mb-8 bg-gradient-to-r from-white to-blue-50 dark:from-slate-800 dark:to-blue-900">
//                 {tabsConfig.map((tab, index) => (
//                   <motion.div
//                     key={tab.id}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: 0.3 + index * 0.1 }}
//                     whileHover={{ scale: 1.02 }}
//                   >
//                     <TabsTrigger
//                       value={tab.id}
//                       className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300"
//                     >
//                       <tab.icon className="w-4 h-4" />
//                       <span className="hidden sm:inline">{tab.label}</span>
//                     </TabsTrigger>
//                   </motion.div>
//                 ))}
//               </TabsList>

//               <AnimatePresence>
//                 {/* ✅ Content Tab */}
//                 <TabsContent value="content" className="space-y-6">
//                   <motion.div
//                     key="content-tab"
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -20 }}
//                     transition={{ duration: 0.3 }}
//                   >
//                     <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-blue-900">
//                       <CardHeader>
//                         <CardTitle className="flex items-center space-x-3">
//                           <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500">
//                             <FileText className="w-5 h-5 text-white" />
//                           </div>
//                           <div>
//                             <span className="text-xl text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text">
//                               Nội dung bài viết
//                             </span>
//                             <p className="mt-1 text-sm text-muted-foreground">
//                               Nhập thông tin cơ bản về bài viết
//                             </p>
//                           </div>
//                         </CardTitle>
//                       </CardHeader>
//                       <CardContent className="space-y-6">
//                         <motion.div
//                           className="space-y-2"
//                           whileFocus={{ scale: 1.01 }}
//                         >
//                           <Label
//                             htmlFor="title"
//                             className="flex items-center space-x-2"
//                           >
//                             <FileText className="w-4 h-4" />
//                             <span>Tiêu đề *</span>
//                           </Label>
//                           <Input
//                             id="title"
//                             placeholder="Nhập tiêu đề bài viết..."
//                             {...register("title")}
//                             className={`h-12 transition-all duration-300 ${
//                               errors.title
//                                 ? "border-red-500 shake"
//                                 : "focus:ring-2 focus:ring-primary/20"
//                             }`}
//                           />
//                           {errors.title && (
//                             <motion.p
//                               initial={{ opacity: 0, y: -10 }}
//                               animate={{ opacity: 1, y: 0 }}
//                               className="flex items-center space-x-1 text-sm text-red-500"
//                             >
//                               <AlertTriangle className="w-3 h-3" />
//                               <span>{errors.title.message}</span>
//                             </motion.p>
//                           )}
//                           {watchedValues.title && (
//                             <motion.p
//                               initial={{ opacity: 0 }}
//                               animate={{ opacity: 1 }}
//                               className="p-2 text-xs rounded text-muted-foreground bg-muted/50"
//                             >
//                               <strong>Slug:</strong>{" "}
//                               {generateSlug(watchedValues.title)}
//                             </motion.p>
//                           )}
//                           <div className="text-xs text-muted-foreground">
//                             {watchedValues.title?.length || 0}/100 ký tự
//                           </div>
//                         </motion.div>

//                         <motion.div
//                           className="space-y-2"
//                           whileFocus={{ scale: 1.01 }}
//                         >
//                           <Label
//                             htmlFor="excerpt"
//                             className="flex items-center space-x-2"
//                           >
//                             <BarChart3 className="w-4 h-4" />
//                             <span>Tóm tắt *</span>
//                           </Label>
//                           <Textarea
//                             id="excerpt"
//                             placeholder="Viết tóm tắt ngắn gọn về bài viết..."
//                             rows={3}
//                             {...register("excerpt")}
//                             className={`resize-none transition-all duration-300 ${
//                               errors.excerpt
//                                 ? "border-red-500 shake"
//                                 : "focus:ring-2 focus:ring-primary/20"
//                             }`}
//                           />
//                           {errors.excerpt && (
//                             <motion.p
//                               initial={{ opacity: 0, y: -10 }}
//                               animate={{ opacity: 1, y: 0 }}
//                               className="flex items-center space-x-1 text-sm text-red-500"
//                             >
//                               <AlertTriangle className="w-3 h-3" />
//                               <span>{errors.excerpt.message}</span>
//                             </motion.p>
//                           )}
//                           <div className="text-xs text-muted-foreground">
//                             {watchedValues.excerpt?.length || 0}/300 ký tự
//                           </div>
//                         </motion.div>

//                         <motion.div
//                           className="space-y-2"
//                           whileFocus={{ scale: 1.01 }}
//                         >
//                           <Label
//                             htmlFor="content"
//                             className="flex items-center space-x-2"
//                           >
//                             <FileText className="w-4 h-4" />
//                             <span>Nội dung *</span>
//                           </Label>
//                           <Textarea
//                             id="content"
//                             placeholder="Viết nội dung bài viết ở đây... Hỗ trợ Markdown."
//                             rows={15}
//                             {...register("content")}
//                             className={`resize-none transition-all duration-300 ${
//                               errors.content
//                                 ? "border-red-500 shake"
//                                 : "focus:ring-2 focus:ring-primary/20"
//                             }`}
//                           />
//                           {errors.content && (
//                             <motion.p
//                               initial={{ opacity: 0, y: -10 }}
//                               animate={{ opacity: 1, y: 0 }}
//                               className="flex items-center space-x-1 text-sm text-red-500"
//                             >
//                               <AlertTriangle className="w-3 h-3" />
//                               <span>{errors.content.message}</span>
//                             </motion.p>
//                           )}
//                           <div className="flex items-center space-x-4 text-xs text-muted-foreground">
//                             <span>
//                               {watchedValues.content?.length || 0} ký tự
//                             </span>
//                             <span>•</span>
//                             <div className="flex items-center space-x-1">
//                               <Clock className="w-3 h-3" />
//                               <span>
//                                 Thời gian đọc: ~
//                                 {Math.ceil(
//                                   (watchedValues.content?.length || 0) / 1000,
//                                 )}{" "}
//                                 phút
//                               </span>
//                             </div>
//                           </div>
//                         </motion.div>
//                       </CardContent>
//                     </Card>
//                   </motion.div>
//                 </TabsContent>

//                 {/* ✅ Media Tab */}
//                 <TabsContent value="media" className="space-y-6">
//                   <motion.div
//                     key="media-tab"
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -20 }}
//                     transition={{ duration: 0.3 }}
//                   >
//                     <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50 dark:from-slate-800 dark:to-purple-900">
//                       <CardHeader>
//                         <CardTitle className="flex items-center space-x-3">
//                           <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
//                             <Image className="w-5 h-5 text-white" />
//                           </div>
//                           <div>
//                             <span className="text-xl text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text">
//                               Hình ảnh đại diện
//                             </span>
//                             <p className="mt-1 text-sm text-muted-foreground">
//                               Tải lên hình ảnh cho bài viết
//                             </p>
//                           </div>
//                         </CardTitle>
//                       </CardHeader>
//                       <CardContent className="space-y-6">
//                         <motion.div
//                           className="space-y-2"
//                           whileFocus={{ scale: 1.01 }}
//                         >
//                           <Label
//                             htmlFor="featuredImage"
//                             className="flex items-center space-x-2"
//                           >
//                             <Image className="w-4 h-4" />
//                             <span>URL hình ảnh *</span>
//                           </Label>
//                           <Input
//                             id="featuredImage"
//                             placeholder="https://example.com/image.jpg"
//                             {...register("featuredImage")}
//                             className={`transition-all duration-300 ${
//                               errors.featuredImage
//                                 ? "border-red-500"
//                                 : "focus:ring-2 focus:ring-primary/20"
//                             }`}
//                           />
//                           {errors.featuredImage && (
//                             <motion.p
//                               initial={{ opacity: 0, y: -10 }}
//                               animate={{ opacity: 1, y: 0 }}
//                               className="flex items-center space-x-1 text-sm text-red-500"
//                             >
//                               <AlertTriangle className="w-3 h-3" />
//                               <span>{errors.featuredImage.message}</span>
//                             </motion.p>
//                           )}
//                         </motion.div>

//                         {/* ✅ Enhanced Drag & Drop Upload */}
//                         <div className="space-y-4">
//                           <Label>Hoặc tải ảnh lên</Label>
//                           <motion.div
//                             whileHover={{ scale: 1.02 }}
//                             className="p-8 text-center transition-all duration-300 border-2 border-dashed cursor-pointer rounded-xl border-muted hover:border-primary/50 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900"
//                             onClick={() =>
//                               document.getElementById("file-upload")?.click()
//                             }
//                             onDragOver={(e) => {
//                               e.preventDefault();
//                               e.currentTarget.classList.add(
//                                 "border-primary",
//                                 "bg-primary/5",
//                               );
//                             }}
//                             onDragLeave={(e) => {
//                               e.preventDefault();
//                               e.currentTarget.classList.remove(
//                                 "border-primary",
//                                 "bg-primary/5",
//                               );
//                             }}
//                             onDrop={async (e) => {
//                               e.preventDefault();
//                               e.currentTarget.classList.remove(
//                                 "border-primary",
//                                 "bg-primary/5",
//                               );

//                               const files = Array.from(e.dataTransfer.files);
//                               const file = files[0];

//                               if (!file || !file.type.startsWith("image/")) {
//                                 toast({
//                                   title: "❌ Lỗi định dạng",
//                                   description: "Vui lòng chọn file ảnh hợp lệ",
//                                   variant: "destructive",
//                                 });
//                                 return;
//                               }

//                               if (file.size > 5 * 1024 * 1024) {
//                                 toast({
//                                   title: "❌ Lỗi kích thước",
//                                   description:
//                                     "Kích thước ảnh phải nhỏ hơn 5MB",
//                                   variant: "destructive",
//                                 });
//                                 return;
//                               }

//                               setIsUploading(true);
//                               try {
//                                 const result =
//                                   await uploadFileToCloudinary(file);
//                                 setSelectedFileUrl(result.url);
//                                 setUploadedFileInfo({
//                                   size: result.size,
//                                   format: result.format,
//                                 });
//                                 setValue("featuredImage", result.url);

//                                 toast({
//                                   title: "✅ Upload thành công",
//                                   description: `Ảnh đã được tải lên (${result.size}, ${result.format})`,
//                                 });
//                               } catch (error) {
//                                 toast({
//                                   title: "❌ Lỗi upload",
//                                   description: "Có lỗi xảy ra khi tải ảnh",
//                                   variant: "destructive",
//                                 });
//                               } finally {
//                                 setIsUploading(false);
//                               }
//                             }}
//                           >
//                             <motion.div
//                               animate={isUploading ? { rotate: 360 } : {}}
//                               transition={{
//                                 duration: 1,
//                                 repeat: isUploading ? Infinity : 0,
//                                 ease: "linear",
//                               }}
//                             >
//                               <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
//                             </motion.div>
//                             <p className="mb-2 text-lg font-medium">
//                               {isUploading
//                                 ? "Đang tải lên..."
//                                 : "Kéo thả hoặc click để tải ảnh lên"}
//                             </p>
//                             <p className="mb-4 text-sm text-muted-foreground">
//                               PNG, JPG, WEBP tối đa 5MB
//                             </p>
//                             <Button
//                               variant="outline"
//                               size="lg"
//                               disabled={isUploading}
//                               className="transition-all duration-300 bg-white/50 hover:bg-white/80"
//                             >
//                               {isUploading ? (
//                                 <>
//                                   <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                                   Đang tải...
//                                 </>
//                               ) : (
//                                 <>
//                                   <Upload className="w-4 h-4 mr-2" />
//                                   Chọn file
//                                 </>
//                               )}
//                             </Button>

//                             <input
//                               id="file-upload"
//                               type="file"
//                               accept="image/*"
//                               className="hidden"
//                               onChange={async (e) => {
//                                 const file = e.target.files?.[0];
//                                 if (!file) return;

//                                 const validTypes = [
//                                   "image/jpeg",
//                                   "image/png",
//                                   "image/gif",
//                                   "image/webp",
//                                 ];
//                                 if (!validTypes.includes(file.type)) {
//                                   toast({
//                                     title: "❌ Lỗi định dạng",
//                                     description:
//                                       "Vui lòng chọn file ảnh hợp lệ",
//                                     variant: "destructive",
//                                   });
//                                   return;
//                                 }

//                                 if (file.size > 5 * 1024 * 1024) {
//                                   toast({
//                                     title: "❌ Lỗi kích thước",
//                                     description:
//                                       "Kích thước ảnh phải nhỏ hơn 5MB",
//                                     variant: "destructive",
//                                   });
//                                   return;
//                                 }

//                                 setIsUploading(true);
//                                 try {
//                                   const result =
//                                     await uploadFileToCloudinary(file);
//                                   setSelectedFileUrl(result.url);
//                                   setUploadedFileInfo({
//                                     size: result.size,
//                                     format: result.format,
//                                   });
//                                   setValue("featuredImage", result.url);

//                                   toast({
//                                     title: "✅ Upload thành công",
//                                     description: `Ảnh đã được tải lên (${result.size}, ${result.format})`,
//                                   });
//                                 } catch (error) {
//                                   toast({
//                                     title: "❌ Lỗi upload",
//                                     description: "Có lỗi xảy ra khi tải ảnh",
//                                     variant: "destructive",
//                                   });
//                                 } finally {
//                                   setIsUploading(false);
//                                 }
//                               }}
//                             />
//                           </motion.div>
//                         </div>

//                         {/* ✅ Enhanced Preview */}
//                         {(selectedFileUrl || watchedValues.featuredImage) && (
//                           <motion.div
//                             initial={{ opacity: 0, scale: 0.8 }}
//                             animate={{ opacity: 1, scale: 1 }}
//                             className="space-y-4"
//                           >
//                             <Label className="flex items-center space-x-2">
//                               <Eye className="w-4 h-4" />
//                               <span>Xem trước</span>
//                             </Label>
//                             <div className="relative overflow-hidden shadow-lg rounded-xl group">
//                               <img
//                                 src={
//                                   selectedFileUrl || watchedValues.featuredImage
//                                 }
//                                 alt="Featured"
//                                 className="object-cover w-full h-64 transition-transform duration-500 group-hover:scale-105"
//                                 onError={(e) => {
//                                   e.currentTarget.src =
//                                     "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop";
//                                 }}
//                               />
//                               <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-black/50 to-transparent group-hover:opacity-100">
//                                 <div className="absolute text-white bottom-4 left-4">
//                                   <div className="font-medium">
//                                     {watchedValues.title || "Tiêu đề bài viết"}
//                                   </div>
//                                   <div className="text-sm opacity-90">
//                                     {user.name}
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>

//                             {selectedFileUrl && uploadedFileInfo && (
//                               <motion.div
//                                 initial={{ opacity: 0, y: 10 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 className="flex items-center justify-between p-4 border border-green-200 rounded-lg bg-green-50 dark:bg-green-900/20"
//                               >
//                                 <div className="flex items-center space-x-2">
//                                   <CheckCircle className="w-4 h-4 text-green-600" />
//                                   <span className="text-sm text-green-800 dark:text-green-300">
//                                     ✓ Upload thành công
//                                   </span>
//                                   <span className="text-xs text-green-600 dark:text-green-400">
//                                     {uploadedFileInfo.size} •{" "}
//                                     {uploadedFileInfo.format}
//                                   </span>
//                                 </div>
//                                 <motion.button
//                                   whileHover={{ scale: 1.1 }}
//                                   whileTap={{ scale: 0.9 }}
//                                   onClick={() => {
//                                     setSelectedFileUrl(null);
//                                     setUploadedFileInfo(null);
//                                     setValue("featuredImage", "");
//                                   }}
//                                   className="text-green-600 transition-colors hover:text-green-800"
//                                 >
//                                   <X className="w-4 h-4" />
//                                 </motion.button>
//                               </motion.div>
//                             )}
//                           </motion.div>
//                         )}
//                       </CardContent>
//                     </Card>
//                   </motion.div>
//                 </TabsContent>

//                 {/* ✅ SEO Tab */}
//                 <TabsContent value="seo" className="space-y-6">
//                   <motion.div
//                     key="seo-tab"
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -20 }}
//                     transition={{ duration: 0.3 }}
//                   >
//                     <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-green-50 dark:from-slate-800 dark:to-green-900">
//                       <CardHeader>
//                         <CardTitle className="flex items-center space-x-3">
//                           <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500">
//                             <Globe className="w-5 h-5 text-white" />
//                           </div>
//                           <div>
//                             <span className="text-xl text-transparent bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text">
//                               Tối ưu SEO
//                             </span>
//                             <p className="mt-1 text-sm text-muted-foreground">
//                               Tối ưu hóa cho công cụ tìm kiếm
//                             </p>
//                           </div>
//                         </CardTitle>
//                       </CardHeader>
//                       <CardContent className="space-y-6">
//                         <motion.div
//                           className="space-y-2"
//                           whileFocus={{ scale: 1.01 }}
//                         >
//                           <Label
//                             htmlFor="metaTitle"
//                             className="flex items-center space-x-2"
//                           >
//                             <Target className="w-4 h-4" />
//                             <span>Meta Title</span>
//                           </Label>
//                           <Input
//                             id="metaTitle"
//                             placeholder="Tiêu đề SEO (để trống sẽ dùng tiêu đề bài viết)"
//                             {...register("metaTitle")}
//                             className="h-12 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
//                           />
//                           <div className="text-xs text-muted-foreground">
//                             {
//                               (
//                                 watchedValues.metaTitle ||
//                                 watchedValues.title ||
//                                 ""
//                               ).length
//                             }
//                             /60 ký tự
//                           </div>
//                         </motion.div>

//                         <motion.div
//                           className="space-y-2"
//                           whileFocus={{ scale: 1.01 }}
//                         >
//                           <Label
//                             htmlFor="metaDescription"
//                             className="flex items-center space-x-2"
//                           >
//                             <FileText className="w-4 h-4" />
//                             <span>Meta Description</span>
//                           </Label>
//                           <Textarea
//                             id="metaDescription"
//                             placeholder="Mô tả SEO (để trống sẽ dùng tóm tắt bài viết)"
//                             rows={3}
//                             {...register("metaDescription")}
//                             className="transition-all duration-300 resize-none focus:ring-2 focus:ring-primary/20"
//                           />
//                           <div className="text-xs text-muted-foreground">
//                             {
//                               (
//                                 watchedValues.metaDescription ||
//                                 watchedValues.excerpt ||
//                                 ""
//                               ).length
//                             }
//                             /160 ký tự
//                           </div>
//                         </motion.div>

//                         <motion.div
//                           className="space-y-2"
//                           whileFocus={{ scale: 1.01 }}
//                         >
//                           <Label
//                             htmlFor="keywords"
//                             className="flex items-center space-x-2"
//                           >
//                             <Hash className="w-4 h-4" />
//                             <span>Keywords</span>
//                           </Label>
//                           <Input
//                             id="keywords"
//                             placeholder="từ khóa 1, từ khóa 2, từ khóa 3"
//                             {...register("keywords")}
//                             className="h-12 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
//                           />
//                           <p className="text-xs text-muted-foreground">
//                             Các từ khóa cách nhau bằng dấu phẩy
//                           </p>
//                         </motion.div>

//                         {/* ✅ Enhanced SEO Preview */}
//                         <div className="space-y-4">
//                           <Label className="flex items-center space-x-2">
//                             <Eye className="w-4 h-4" />
//                             <span>Xem trước kết quả tìm kiếm</span>
//                           </Label>
//                           <motion.div
//                             initial={{ opacity: 0, scale: 0.95 }}
//                             animate={{ opacity: 1, scale: 1 }}
//                             className="p-6 border rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20"
//                           >
//                             <div className="space-y-2">
//                               <div className="text-lg font-medium text-blue-600 cursor-pointer hover:underline">
//                                 {watchedValues.metaTitle ||
//                                   watchedValues.title ||
//                                   "Tiêu đề bài viết"}
//                               </div>
//                               <div className="flex items-center space-x-1 text-sm text-green-700">
//                                 <Globe className="w-3 h-3" />
//                                 <span>
//                                   templatemarket.com/blog/
//                                   {generateSlug(
//                                     watchedValues.title || "bai-viet-moi",
//                                   )}
//                                 </span>
//                               </div>
//                               <div className="text-sm leading-relaxed text-gray-600">
//                                 {watchedValues.metaDescription ||
//                                   watchedValues.excerpt ||
//                                   "Mô tả bài viết sẽ hiển thị ở đây..."}
//                               </div>
//                               {watchedValues.keywords && (
//                                 <div className="flex flex-wrap gap-1 mt-2">
//                                   {watchedValues.keywords
//                                     .split(",")
//                                     .slice(0, 5)
//                                     .map((keyword, i) => (
//                                       <Badge
//                                         key={i}
//                                         variant="outline"
//                                         className="text-xs"
//                                       >
//                                         {keyword.trim()}
//                                       </Badge>
//                                     ))}
//                                 </div>
//                               )}
//                             </div>
//                           </motion.div>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   </motion.div>
//                 </TabsContent>
//               </AnimatePresence>
//             </Tabs>
//           </motion.div>

//           {/* ✅ Enhanced Sidebar */}
//           <motion.div
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: 0.4 }}
//             className="space-y-6"
//             id="sidebar"
//             data-animate
//           >
//             {/* ✅ Publish Settings */}
//             <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-blue-900">
//               <CardHeader>
//                 <CardTitle className="flex items-center space-x-3">
//                   <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500">
//                     <Calendar className="w-5 h-5 text-white" />
//                   </div>
//                   <span className="text-xl text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text">
//                     Xuất bản
//                   </span>
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <motion.div
//                   whileHover={{ scale: 1.02 }}
//                   className="flex items-center justify-between p-4 transition-all duration-300 border rounded-lg hover:bg-muted/50"
//                 >
//                   <div className="flex items-center space-x-3">
//                     <CheckCircle className="w-5 h-5 text-green-500" />
//                     <div>
//                       <Label htmlFor="isPublished" className="font-medium">
//                         Xuất bản ngay
//                       </Label>
//                       <p className="text-xs text-muted-foreground">
//                         Hiển thị công khai
//                       </p>
//                     </div>
//                   </div>
//                   <Switch
//                     id="isPublished"
//                     checked={watchedValues.isPublished}
//                     onCheckedChange={(checked) =>
//                       setValue("isPublished", checked)
//                     }
//                   />
//                 </motion.div>

//                 <motion.div
//                   whileHover={{ scale: 1.02 }}
//                   className="flex items-center justify-between p-4 transition-all duration-300 border rounded-lg hover:bg-muted/50"
//                 >
//                   <div className="flex items-center space-x-3">
//                     <Sparkles className="w-5 h-5 text-yellow-500" />
//                     <div>
//                       <Label htmlFor="isFeatured" className="font-medium">
//                         Bài viết nổi bật
//                       </Label>
//                       <p className="text-xs text-muted-foreground">
//                         Hiển thị ở trang chủ
//                       </p>
//                     </div>
//                   </div>
//                   <Switch
//                     id="isFeatured"
//                     checked={watchedValues.isFeatured}
//                     onCheckedChange={(checked) =>
//                       setValue("isFeatured", checked)
//                     }
//                   />
//                 </motion.div>

//                 <motion.div className="space-y-2" whileFocus={{ scale: 1.01 }}>
//                   <Label className="flex items-center space-x-2">
//                     <Clock className="w-4 h-4" />
//                     <span>Ngày xuất bản</span>
//                   </Label>
//                   <Input
//                     type="datetime-local"
//                     defaultValue={new Date().toISOString().slice(0, 16)}
//                     className="h-12 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
//                   />
//                 </motion.div>

//                 <div className="space-y-2">
//                   <Label className="flex items-center space-x-2">
//                     <User className="w-4 h-4" />
//                     <span>Tác giả</span>
//                   </Label>
//                   <motion.div
//                     whileHover={{ scale: 1.02 }}
//                     className="flex items-center p-3 space-x-3 transition-all duration-300 border rounded-lg bg-muted/50 hover:bg-muted"
//                   >
//                     <img
//                       src={
//                         user.avatar ||
//                         "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
//                       }
//                       alt={user.name}
//                       className="object-cover w-8 h-8 rounded-full"
//                     />
//                     <div>
//                       <div className="text-sm font-medium">{user.name}</div>
//                       <div className="text-xs text-muted-foreground">Admin</div>
//                     </div>
//                   </motion.div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* ✅ Category & Tags */}
//             <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50 dark:from-slate-800 dark:to-purple-900">
//               <CardHeader>
//                 <CardTitle className="flex items-center space-x-3">
//                   <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
//                     <Hash className="w-5 h-5 text-white" />
//                   </div>
//                   <span className="text-xl text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text">
//                     Phân loại
//                   </span>
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="space-y-2">
//                   <Label
//                     htmlFor="categoryId"
//                     className="flex items-center space-x-2"
//                   >
//                     <Target className="w-4 h-4" />
//                     <span>Danh mục *</span>
//                   </Label>
//                   <Select
//                     value={watchedValues.categoryId || ""}
//                     onValueChange={(value) => setValue("categoryId", value)}
//                   >
//                     <SelectTrigger
//                       className={`h-12 ${errors.categoryId ? "border-red-500" : ""}`}
//                     >
//                       <SelectValue placeholder="Chọn danh mục" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {categories.map((category) => (
//                         <SelectItem key={category.id} value={category.id}>
//                           <div className="flex items-center space-x-2">
//                             <div
//                               className="w-3 h-3 rounded-full"
//                               style={{ backgroundColor: category.color }}
//                             />
//                             <span>{category.name}</span>
//                           </div>
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   {errors.categoryId && (
//                     <motion.p
//                       initial={{ opacity: 0, y: -10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       className="flex items-center space-x-1 text-sm text-red-500"
//                     >
//                       <AlertTriangle className="w-3 h-3" />
//                       <span>{errors.categoryId.message}</span>
//                     </motion.p>
//                   )}
//                 </div>

//                 <motion.div className="space-y-2" whileFocus={{ scale: 1.01 }}>
//                   <Label htmlFor="tags" className="flex items-center space-x-2">
//                     <Hash className="w-4 h-4" />
//                     <span>Tags</span>
//                   </Label>
//                   <Input
//                     id="tags"
//                     placeholder="react, javascript, tutorial"
//                     {...register("tags")}
//                     className="h-12 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
//                   />
//                   <p className="text-xs text-muted-foreground">
//                     Các tag cách nhau bằng dấu phẩy
//                   </p>
//                   {watchedValues.tags && (
//                     <motion.div
//                       initial={{ opacity: 0, y: 10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       className="flex flex-wrap gap-1 mt-2"
//                     >
//                       {watchedValues.tags.split(",").map((tag, i) => (
//                         <Badge key={i} variant="outline" className="text-xs">
//                           {tag.trim()}
//                         </Badge>
//                       ))}
//                     </motion.div>
//                   )}
//                 </motion.div>
//               </CardContent>
//             </Card>

//             {/* ✅ Preview */}
//             <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-green-50 dark:from-slate-800 dark:to-green-900">
//               <CardHeader>
//                 <CardTitle className="flex items-center space-x-3">
//                   <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500">
//                     <Eye className="w-5 h-5 text-white" />
//                   </div>
//                   <span>Xem trước bài viết</span>
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 {(selectedFileUrl || watchedValues.featuredImage) && (
//                   <motion.div
//                     initial={{ opacity: 0, scale: 0.8 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     className="space-y-4"
//                   >
//                     <div className="relative overflow-hidden rounded-lg shadow-md">
//                       <img
//                         src={selectedFileUrl || watchedValues.featuredImage}
//                         alt="Preview"
//                         className="object-cover w-full h-32 transition-transform duration-300 hover:scale-105"
//                         onError={(e) => {
//                           e.currentTarget.src =
//                             "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop";
//                         }}
//                       />
//                       <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-black/50 to-transparent hover:opacity-100">
//                         <div className="absolute text-white bottom-2 left-2">
//                           <div className="text-sm font-medium">
//                             {watchedValues.title || "Tiêu đề bài viết"}
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="space-y-2">
//                       <div className="flex items-center justify-between">
//                         <Badge
//                           variant={
//                             watchedValues.isPublished ? "default" : "secondary"
//                           }
//                         >
//                           {watchedValues.isPublished ? "Xuất bản" : "Bản nháp"}
//                         </Badge>
//                         {watchedValues.isFeatured && (
//                           <Badge className="text-yellow-800 bg-yellow-100">
//                             <Sparkles className="w-3 h-3 mr-1" />
//                             Nổi bật
//                           </Badge>
//                         )}
//                       </div>
//                       <div className="text-sm text-muted-foreground">
//                         {watchedValues.excerpt || "Tóm tắt bài viết..."}
//                       </div>
//                     </div>
//                   </motion.div>
//                 )}

//                 <motion.div
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                 >
//                   <Button variant="outline" className="w-full mt-4 group">
//                     <Eye className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
//                     Xem trước đầy đủ
//                   </Button>
//                 </motion.div>
//               </CardContent>
//             </Card>
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BlogCreate;

// pages/admin/BlogCreate.tsx - Mã hoàn chỉnh với SEO Tools
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Save,
  Eye,
  FileText,
  Image,
  Globe,
  Calendar,
  User,
  Tag,
  Loader2,
  Upload,
  X,
  Plus,
  AlertCircle,
  CheckCircle,
  Clock,
  // ✅ SEO Tools Icons
  Wand2,
  Brain,
  Target,
  TrendingUp,
  Search,
  Lightbulb,
  BarChart,
  BookOpen,
  PenTool,
  Cpu,
  Sparkles,
  Zap,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Blog schema
const blogSchema = z.object({
  title: z.string().min(1, "Tiêu đề là bắt buộc"),
  slug: z.string().min(1, "Slug là bắt buộc"),
  excerpt: z.string().min(1, "Tóm tắt là bắt buộc"),
  content: z.string().min(1, "Nội dung là bắt buộc"),
  category: z.string().min(1, "Danh mục là bắt buộc"),
  tags: z.array(z.string()).optional(),
  featuredImage: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
  status: z.enum(["draft", "published"]),
  publishedAt: z.string().optional(),
});

type BlogFormData = z.infer<typeof blogSchema>;

const BlogCreate: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  // Form state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("content");
  const [tagInput, setTagInput] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // ✅ SEO Tools State
  const [seoSuggestions, setSeoSuggestions] = useState<string[]>([]);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [keywordDensity, setKeywordDensity] = useState<Record<string, number>>(
    {},
  );
  const [readabilityScore, setReadabilityScore] = useState(0);
  const [contentStats, setContentStats] = useState({
    words: 0,
    sentences: 0,
    paragraphs: 0,
    headings: 0,
    readingTime: 0,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      status: "draft",
      tags: [],
    },
  });

  const watchedValues = watch();

  // ✅ SEO Helper Functions
  const generateSEOSuggestions = (content: string, title: string) => {
    const suggestions = [];

    if (title.length < 30) {
      suggestions.push("💡 Tiêu đề nên dài 30-60 ký tự để tối ưu SEO");
    }

    if (title.length > 60) {
      suggestions.push("⚠️ Tiêu đề quá dài, nên rút gọn xuống dưới 60 ký tự");
    }

    if (content.length < 300) {
      suggestions.push(
        "📝 Nội dung nên có ít nhất 300 từ để Google đánh giá cao",
      );
    }

    if (!content.toLowerCase().includes(title.toLowerCase().split(" ")[0])) {
      suggestions.push("🎯 Nên sử dụng từ khóa chính trong nội dung");
    }

    const headingCount = (content.match(/#{1,6}\s/g) || []).length;
    if (headingCount < 2) {
      suggestions.push(
        "📋 Nên sử dụng ít nhất 2-3 heading (H2, H3) để cấu trúc bài viết",
      );
    }

    if (!content.includes("![") && !content.includes("<img")) {
      suggestions.push("🖼️ Nên thêm ít nhất 1-2 hình ảnh để tăng engagement");
    }

    const metaDesc = watchedValues.metaDescription || "";
    if (metaDesc.length < 120) {
      suggestions.push("📄 Meta description nên dài 120-160 ký tự");
    }

    if (metaDesc.length > 160) {
      suggestions.push(
        "📄 Meta description quá dài, nên rút gọn xuống dưới 160 ký tự",
      );
    }

    return suggestions;
  };

  const calculateKeywordDensity = (content: string) => {
    const words = content.toLowerCase().match(/\b\w+\b/g) || [];
    const wordCount = words.length;
    const frequency: Record<string, number> = {};

    // Loại bỏ stop words tiếng Việt
    const stopWords = [
      "và",
      "của",
      "có",
      "là",
      "trong",
      "với",
      "để",
      "được",
      "một",
      "các",
      "này",
      "đó",
      "cho",
      "từ",
      "về",
      "như",
      "khi",
      "sẽ",
      "đã",
      "hay",
      "hoặc",
      "nhưng",
      "nếu",
      "thì",
      "bởi",
      "vì",
      "do",
      "theo",
      "trên",
      "dưới",
      "giữa",
      "sau",
      "trước",
    ];

    words.forEach((word) => {
      if (word.length > 3 && !stopWords.includes(word)) {
        frequency[word] = (frequency[word] || 0) + 1;
      }
    });

    const density: Record<string, number> = {};
    Object.entries(frequency).forEach(([word, count]) => {
      density[word] = Math.round((count / wordCount) * 100 * 100) / 100;
    });

    return Object.fromEntries(
      Object.entries(density)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10),
    );
  };

  const calculateReadabilityScore = (content: string) => {
    const sentences = content
      .split(/[.!?]+/)
      .filter((s) => s.trim().length > 0).length;
    const words = (content.match(/\b\w+\b/g) || []).length;
    const avgWordsPerSentence = words / sentences;

    // Simple readability score (0-100)
    let score = 100;
    if (avgWordsPerSentence > 25) score -= 30;
    else if (avgWordsPerSentence > 20) score -= 20;
    else if (avgWordsPerSentence > 15) score -= 10;

    // Bonus for good structure
    const headings = (content.match(/#{1,6}\s/g) || []).length;
    if (headings >= 3) score += 5;

    return Math.max(0, Math.min(100, Math.round(score)));
  };

  const calculateContentStats = (content: string) => {
    const words = (content.match(/\b\w+\b/g) || []).length;
    const sentences = content
      .split(/[.!?]+/)
      .filter((s) => s.trim().length > 0).length;
    const paragraphs = content
      .split(/\n\s*\n/)
      .filter((p) => p.trim().length > 0).length;
    const headings = (content.match(/#{1,6}\s/g) || []).length;
    const readingTime = Math.ceil(words / 200); // 200 words per minute

    return { words, sentences, paragraphs, headings, readingTime };
  };

  // ✅ AI Content Generation
  const generateContentWithAI = async (
    prompt: string,
    type: "title" | "content" | "excerpt" | "meta",
  ) => {
    setIsGeneratingContent(true);
    try {
      // Simulate AI API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const suggestions = {
        title: [
          "10 Bí Quyết Viết Content Chuẩn SEO Năm 2025",
          "Hướng Dẫn Chi Tiết: Tối Ưu SEO Cho Blog Cá Nhân",
          "Template Market: Bộ Sưu Tập Templates React Chất Lượng Cao",
          "Cách Xây Dựng Website Hiệu Quả Với React và TypeScript",
          "Top 15 Tools SEO Miễn Phí Tốt Nhất Cho Blogger Việt Nam",
        ],
        content: [
          "## Giới thiệu\n\nTrong thời đại số hóa hiện nay, việc tối ưu SEO đã trở thành yếu tố then chốt quyết định sự thành công của bất kỳ website nào. Với hàng triệu trang web cạnh tranh để xuất hiện trên trang đầu Google, việc hiểu và áp dụng đúng các kỹ thuật SEO không chỉ là lựa chọn mà đã trở thành điều bắt buộc.\n\n## Tại sao SEO quan trọng?\n\nSEO (Search Engine Optimization) không chỉ giúp website của bạn xuất hiện cao hơn trong kết quả tìm kiếm, mà còn:\n\n- Tăng lưu lượng truy cập tự nhiên\n- Cải thiện trải nghiệm người dùng\n- Xây dựng uy tín thương hiệu\n- Tăng tỷ lệ chuyển đổi\n\n## Các bước thực hiện\n\n### 1. Nghiên cứu từ khóa\nViệc nghiên cứu từ khóa là bước đầu tiên và quan trọng nhất...",
          "## Xu hướng công nghệ 2025\n\nNăm 2025 đánh dấu một bước ngoặt quan trọng trong ngành công nghệ với sự bùng nổ của AI và Machine Learning. Các xu hướng chính bao gồm:\n\n### Artificial Intelligence (AI)\nAI không còn là khái niệm xa vời mà đã trở thành công cụ thiết yếu trong mọi lĩnh vực...\n\n### Web3 và Blockchain\nCông nghệ blockchain tiếp tục phát triển mạnh mẽ...",
          "## Hướng dẫn sử dụng React Hooks\n\nReact Hooks đã thay đổi hoàn toàn cách chúng ta viết components trong React. Từ khi ra mắt, Hooks đã trở thành standard cho việc quản lý state và side effects.\n\n### useState Hook\n``````\n\n### useEffect Hook\nQuản lý side effects một cách hiệu quả...",
        ],
        excerpt: [
          "Khám phá những bí quyết viết content chuẩn SEO giúp website của bạn đạt top Google một cách hiệu quả và bền vững trong năm 2025.",
          "Hướng dẫn từng bước để tối ưu hóa nội dung blog, tăng traffic tự nhiên và cải thiện thứ hạng tìm kiếm với các kỹ thuật SEO mới nhất.",
          "Bộ sưu tập templates React chuyên nghiệp, giúp developers tiết kiệm thời gian và tạo ra sản phẩm chất lượng cao với performance tối ưu.",
          "Tìm hiểu các xu hướng công nghệ hot nhất 2025 và cách áp dụng chúng vào dự án thực tế để tạo ra sản phẩm đột phá.",
          "Hướng dẫn chi tiết cách sử dụng React Hooks hiệu quả, từ cơ bản đến nâng cao với nhiều ví dụ thực tế.",
        ],
        meta: [
          "SEO 2025, viết content chuẩn SEO, tối ưu Google, bí quyết SEO, hướng dẫn SEO",
          "React templates, templates chuyên nghiệp, UI components, React TypeScript, frontend development",
          "xu hướng công nghệ 2025, AI machine learning, web3 blockchain, công nghệ mới",
          "React Hooks, useState, useEffect, React development, JavaScript ES6",
        ],
      };

      return suggestions[type];
    } catch (error) {
      toast({
        title: "❌ Lỗi AI",
        description: "Không thể tạo nội dung. Vui lòng thử lại.",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsGeneratingContent(false);
    }
  };

  // ✅ Watch content changes for SEO analysis
  useEffect(() => {
    if (watchedValues.content) {
      const suggestions = generateSEOSuggestions(
        watchedValues.content,
        watchedValues.title || "",
      );
      setSeoSuggestions(suggestions);

      const density = calculateKeywordDensity(watchedValues.content);
      setKeywordDensity(density);

      const readability = calculateReadabilityScore(watchedValues.content);
      setReadabilityScore(readability);

      const stats = calculateContentStats(watchedValues.content);
      setContentStats(stats);
    }
  }, [
    watchedValues.content,
    watchedValues.title,
    watchedValues.metaDescription,
  ]);

  // Auto-generate slug from title
  useEffect(() => {
    if (watchedValues.title && !isEditing) {
      const slug = watchedValues.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      setValue("slug", slug);
    }
  }, [watchedValues.title, setValue, isEditing]);

  // Categories data
  const categories = [
    { value: "technology", label: "Công nghệ" },
    { value: "design", label: "Thiết kế" },
    { value: "development", label: "Lập trình" },
    { value: "business", label: "Kinh doanh" },
    { value: "marketing", label: "Marketing" },
    { value: "tutorial", label: "Hướng dẫn" },
  ];

  // Tab configuration
  const tabsConfig = [
    {
      id: "content",
      label: "Nội dung",
      icon: FileText,
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "seo-tools", // ✅ New SEO Tools tab
      label: "SEO Tools",
      icon: Wand2,
      color: "from-orange-500 to-red-500",
    },
    {
      id: "media",
      label: "Hình ảnh",
      icon: Image,
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "seo",
      label: "SEO Meta",
      icon: Globe,
      color: "from-green-500 to-emerald-500",
    },
  ];

  // Handle tag operations
  const addTag = () => {
    if (tagInput.trim() && !selectedTags.includes(tagInput.trim())) {
      const newTags = [...selectedTags, tagInput.trim()];
      setSelectedTags(newTags);
      setValue("tags", newTags);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = selectedTags.filter((tag) => tag !== tagToRemove);
    setSelectedTags(newTags);
    setValue("tags", newTags);
  };

  // Handle image upload
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files) return;

    setIsUploading(true);
    try {
      // Simulate upload
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const newImages = Array.from(files).map(
        (file, index) =>
          `https://via.placeholder.com/800x400?text=Uploaded+Image+${uploadedImages.length + index + 1}`,
      );

      setUploadedImages((prev) => [...prev, ...newImages]);

      toast({
        title: "✅ Upload thành công",
        description: `Đã upload ${files.length} hình ảnh.`,
      });
    } catch (error) {
      toast({
        title: "❌ Upload thất bại",
        description: "Có lỗi xảy ra khi upload hình ảnh.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Form submission
  const onSubmit = async (data: BlogFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Blog data:", data);

      toast({
        title: isEditing
          ? "✅ Cập nhật thành công"
          : "✅ Tạo bài viết thành công",
        description: isEditing
          ? "Bài viết đã được cập nhật."
          : "Bài viết mới đã được tạo.",
      });

      navigate("/admin/blog");
    } catch (error) {
      toast({
        title: "❌ Có lỗi xảy ra",
        description: "Không thể lưu bài viết. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-900 dark:to-purple-900">
      <div className="container px-4 py-8 mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/admin/blog")}
                className="group"
              >
                <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                Quay lại
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text">
                  {isEditing ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
                </h1>
                <p className="text-muted-foreground">
                  {isEditing
                    ? "Cập nhật nội dung bài viết"
                    : "Viết và xuất bản bài viết mới"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Xem trước
              </Button>
              <Button
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {isEditing ? "Cập nhật" : "Xuất bản"}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Main Form */}
          <div className="lg:col-span-3">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-6"
            >
              {/* Tab Navigation */}
              <TabsList className="grid w-full h-auto grid-cols-4 p-1 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
                {tabsConfig.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="flex items-center space-x-2 py-3 px-4 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700"
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Content Tab */}
              <TabsContent value="content" className="space-y-6">
                <motion.div
                  key="content-tab"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-blue-900">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <span className="text-xl text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text">
                            Nội dung bài viết
                          </span>
                          <p className="mt-1 text-sm text-muted-foreground">
                            Viết nội dung chính của bài viết
                          </p>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Title */}
                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-sm font-medium">
                          Tiêu đề bài viết
                        </Label>
                        <Input
                          id="title"
                          placeholder="Nhập tiêu đề hấp dẫn..."
                          {...register("title")}
                          className={`h-12 text-lg ${errors.title ? "border-red-500" : ""}`}
                        />
                        {errors.title && (
                          <p className="text-sm text-red-500">
                            {errors.title.message}
                          </p>
                        )}
                        {watchedValues.title && (
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <span>
                              Độ dài: {watchedValues.title.length} ký tự
                            </span>
                            <Badge
                              variant={
                                watchedValues.title.length >= 30 &&
                                watchedValues.title.length <= 60
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {watchedValues.title.length >= 30 &&
                              watchedValues.title.length <= 60
                                ? "Tốt"
                                : "Cần cải thiện"}
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* Slug */}
                      <div className="space-y-2">
                        <Label htmlFor="slug" className="text-sm font-medium">
                          URL Slug
                        </Label>
                        <Input
                          id="slug"
                          placeholder="url-slug-bai-viet"
                          {...register("slug")}
                          className={errors.slug ? "border-red-500" : ""}
                        />
                        {errors.slug && (
                          <p className="text-sm text-red-500">
                            {errors.slug.message}
                          </p>
                        )}
                      </div>

                      {/* Excerpt */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="excerpt"
                          className="text-sm font-medium"
                        >
                          Tóm tắt bài viết
                        </Label>
                        <Textarea
                          id="excerpt"
                          placeholder="Viết tóm tắt ngắn gọn về bài viết..."
                          {...register("excerpt")}
                          className={`min-h-[100px] ${errors.excerpt ? "border-red-500" : ""}`}
                        />
                        {errors.excerpt && (
                          <p className="text-sm text-red-500">
                            {errors.excerpt.message}
                          </p>
                        )}
                      </div>

                      {/* Content */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="content"
                          className="text-sm font-medium"
                        >
                          Nội dung chi tiết
                        </Label>
                        <Textarea
                          id="content"
                          placeholder="Viết nội dung chi tiết của bài viết..."
                          {...register("content")}
                          className={`min-h-[400px] ${errors.content ? "border-red-500" : ""}`}
                        />
                        {errors.content && (
                          <p className="text-sm text-red-500">
                            {errors.content.message}
                          </p>
                        )}

                        {/* Content Stats */}
                        {watchedValues.content && (
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>{contentStats.words} từ</span>
                            <span>{contentStats.sentences} câu</span>
                            <span>{contentStats.paragraphs} đoạn</span>
                            <span>{contentStats.readingTime} phút đọc</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* ✅ SEO Tools Tab */}
              <TabsContent value="seo-tools" className="space-y-6">
                <motion.div
                  key="seo-tools-tab"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-orange-50 dark:from-slate-800 dark:to-orange-900">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-orange-500 to-red-500">
                          <Wand2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <span className="text-xl text-transparent bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text">
                            Công cụ SEO thông minh
                          </span>
                          <p className="mt-1 text-sm text-muted-foreground">
                            AI hỗ trợ viết content chuẩn SEO
                          </p>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* ✅ AI Content Generator */}
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                        <motion.div whileHover={{ scale: 1.02 }}>
                          <Button
                            variant="outline"
                            className="flex-col w-full h-20 space-y-2 group"
                            onClick={async () => {
                              const suggestions = await generateContentWithAI(
                                "",
                                "title",
                              );
                              if (suggestions.length > 0) {
                                setValue(
                                  "title",
                                  suggestions[
                                    Math.floor(
                                      Math.random() * suggestions.length,
                                    )
                                  ],
                                );
                                toast({
                                  title: "✨ AI đã tạo tiêu đề",
                                  description: "Tiêu đề mới đã được áp dụng!",
                                });
                              }
                            }}
                            disabled={isGeneratingContent}
                          >
                            {isGeneratingContent ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <Brain className="w-5 h-5 group-hover:text-blue-500" />
                            )}
                            <span className="text-sm">Tạo tiêu đề AI</span>
                          </Button>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.02 }}>
                          <Button
                            variant="outline"
                            className="flex-col w-full h-20 space-y-2 group"
                            onClick={async () => {
                              const suggestions = await generateContentWithAI(
                                "",
                                "excerpt",
                              );
                              if (suggestions.length > 0) {
                                setValue(
                                  "excerpt",
                                  suggestions[
                                    Math.floor(
                                      Math.random() * suggestions.length,
                                    )
                                  ],
                                );
                                toast({
                                  title: "✨ AI đã tạo tóm tắt",
                                  description: "Tóm tắt mới đã được áp dụng!",
                                });
                              }
                            }}
                            disabled={isGeneratingContent}
                          >
                            {isGeneratingContent ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <PenTool className="w-5 h-5 group-hover:text-green-500" />
                            )}
                            <span className="text-sm">Tạo tóm tắt AI</span>
                          </Button>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.02 }}>
                          <Button
                            variant="outline"
                            className="flex-col w-full h-20 space-y-2 group"
                            onClick={async () => {
                              const suggestions = await generateContentWithAI(
                                "",
                                "content",
                              );
                              if (suggestions.length > 0) {
                                const currentContent =
                                  watchedValues.content || "";
                                setValue(
                                  "content",
                                  currentContent +
                                    "\n\n" +
                                    suggestions[
                                      Math.floor(
                                        Math.random() * suggestions.length,
                                      )
                                    ],
                                );
                                toast({
                                  title: "✨ AI đã thêm nội dung",
                                  description:
                                    "Nội dung mới đã được thêm vào bài viết!",
                                });
                              }
                            }}
                            disabled={isGeneratingContent}
                          >
                            {isGeneratingContent ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <Sparkles className="w-5 h-5 group-hover:text-purple-500" />
                            )}
                            <span className="text-sm">Mở rộng nội dung</span>
                          </Button>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.02 }}>
                          <Button
                            variant="outline"
                            className="flex-col w-full h-20 space-y-2 group"
                            onClick={async () => {
                              const suggestions = await generateContentWithAI(
                                "",
                                "meta",
                              );
                              if (suggestions.length > 0) {
                                setValue(
                                  "metaKeywords",
                                  suggestions[
                                    Math.floor(
                                      Math.random() * suggestions.length,
                                    )
                                  ],
                                );
                                toast({
                                  title: "✨ AI đã tạo meta keywords",
                                  description:
                                    "Meta keywords mới đã được áp dụng!",
                                });
                              }
                            }}
                            disabled={isGeneratingContent}
                          >
                            {isGeneratingContent ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <Target className="w-5 h-5 group-hover:text-orange-500" />
                            )}
                            <span className="text-sm">Tạo keywords</span>
                          </Button>
                        </motion.div>
                      </div>

                      {/* ✅ SEO Analysis Dashboard */}
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Readability Score */}
                        <Card className="p-4 border-0 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <BookOpen className="w-4 h-4 text-blue-600" />
                              <span className="font-medium">Độ dễ đọc</span>
                            </div>
                            <Badge
                              className={`${
                                readabilityScore >= 80
                                  ? "bg-green-100 text-green-800"
                                  : readabilityScore >= 60
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }`}
                            >
                              {readabilityScore}/100
                            </Badge>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full">
                            <motion.div
                              className={`h-2 rounded-full ${
                                readabilityScore >= 80
                                  ? "bg-green-500"
                                  : readabilityScore >= 60
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                              }`}
                              initial={{ width: 0 }}
                              animate={{ width: `${readabilityScore}%` }}
                              transition={{ duration: 1 }}
                            />
                          </div>
                          <p className="mt-2 text-xs text-muted-foreground">
                            {readabilityScore >= 80
                              ? "Rất dễ đọc"
                              : readabilityScore >= 60
                                ? "Khá dễ đọc"
                                : "Khó đọc, nên cải thiện"}
                          </p>
                        </Card>

                        {/* Content Stats */}
                        <Card className="p-4 border-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                          <div className="flex items-center mb-3 space-x-2">
                            <BarChart className="w-4 h-4 text-purple-600" />
                            <span className="font-medium">
                              Thống kê nội dung
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Từ:</span>
                              <span className="font-medium">
                                {contentStats.words}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Câu:
                              </span>
                              <span className="font-medium">
                                {contentStats.sentences}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Đoạn:
                              </span>
                              <span className="font-medium">
                                {contentStats.paragraphs}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Heading:
                              </span>
                              <span className="font-medium">
                                {contentStats.headings}
                              </span>
                            </div>
                          </div>
                          <div className="pt-2 mt-2 border-t">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                Thời gian đọc:
                              </span>
                              <span className="font-medium">
                                {contentStats.readingTime} phút
                              </span>
                            </div>
                          </div>
                        </Card>
                      </div>

                      {/* ✅ SEO Suggestions */}
                      {seoSuggestions.length > 0 && (
                        <Card className="p-4 border-0 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
                          <div className="flex items-center mb-3 space-x-2">
                            <Lightbulb className="w-4 h-4 text-yellow-600" />
                            <span className="font-medium">
                              Gợi ý SEO ({seoSuggestions.length})
                            </span>
                          </div>
                          <div className="space-y-2">
                            {seoSuggestions.map((suggestion, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-start p-3 space-x-2 transition-colors rounded-lg bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800"
                              >
                                <Target className="w-3 h-3 text-yellow-600 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{suggestion}</span>
                              </motion.div>
                            ))}
                          </div>
                        </Card>
                      )}

                      {/* ✅ Keyword Density */}
                      {Object.keys(keywordDensity).length > 0 && (
                        <Card className="p-4 border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                          <div className="flex items-center mb-3 space-x-2">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                            <span className="font-medium">Mật độ từ khóa</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {Object.entries(keywordDensity).map(
                              ([word, density]) => (
                                <div
                                  key={word}
                                  className="flex items-center justify-between p-2 rounded bg-white/50 dark:bg-slate-800/50"
                                >
                                  <span className="text-sm font-medium">
                                    {word}
                                  </span>
                                  <Badge
                                    variant="outline"
                                    className={`text-xs ${
                                      density > 3
                                        ? "border-red-500 text-red-600"
                                        : density > 1
                                          ? "border-green-500 text-green-600"
                                          : "border-gray-500 text-gray-600"
                                    }`}
                                  >
                                    {density}%
                                  </Badge>
                                </div>
                              ),
                            )}
                          </div>
                          <p className="mt-2 text-xs text-muted-foreground">
                            💡 Mật độ từ khóa lý tưởng: 1-3%. Tránh spam từ
                            khóa.
                          </p>
                        </Card>
                      )}

                      {/* ✅ SEO Tools Links */}
                      <Card className="p-4 border-0 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20">
                        <div className="flex items-center mb-3 space-x-2">
                          <Cpu className="w-4 h-4 text-indigo-600" />
                          <span className="font-medium">
                            Công cụ SEO khuyên dùng
                          </span>
                        </div>
                        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                          <a
                            href="https://aiktp.com/vi"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-3 space-x-2 transition-colors rounded-lg bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 group"
                          >
                            <Zap className="w-4 h-4 text-blue-600 transition-transform group-hover:scale-110" />
                            <span className="text-sm">
                              AIKTP - AI viết content
                            </span>
                          </a>
                          <a
                            href="https://laho.vn"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-3 space-x-2 transition-colors rounded-lg bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 group"
                          >
                            <Brain className="w-4 h-4 text-green-600 transition-transform group-hover:scale-110" />
                            <span className="text-sm">
                              Laho.vn - SEO Việt Nam
                            </span>
                          </a>
                          <a
                            href="https://grammarly.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-3 space-x-2 transition-colors rounded-lg bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 group"
                          >
                            <PenTool className="w-4 h-4 text-purple-600 transition-transform group-hover:scale-110" />
                            <span className="text-sm">
                              Grammarly - Kiểm tra ngữ pháp
                            </span>
                          </a>
                          <a
                            href="https://smallseotools.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-3 space-x-2 transition-colors rounded-lg bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 group"
                          >
                            <Search className="w-4 h-4 text-orange-600 transition-transform group-hover:scale-110" />
                            <span className="text-sm">Small SEO Tools</span>
                          </a>
                        </div>
                      </Card>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Media Tab */}
              <TabsContent value="media" className="space-y-6">
                <motion.div
                  key="media-tab"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50 dark:from-slate-800 dark:to-purple-900">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
                          <Image className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <span className="text-xl text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text">
                            Quản lý hình ảnh
                          </span>
                          <p className="mt-1 text-sm text-muted-foreground">
                            Upload và quản lý hình ảnh cho bài viết
                          </p>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Featured Image */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Hình ảnh đại diện
                        </Label>
                        <Input
                          placeholder="URL hình ảnh đại diện"
                          {...register("featuredImage")}
                        />
                      </div>

                      {/* Image Upload */}
                      <div className="space-y-4">
                        <Label className="text-sm font-medium">
                          Upload hình ảnh
                        </Label>
                        <div className="p-8 text-center border-2 border-gray-300 border-dashed rounded-lg dark:border-gray-600">
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="image-upload"
                          />
                          <label
                            htmlFor="image-upload"
                            className="flex flex-col items-center space-y-2 cursor-pointer"
                          >
                            {isUploading ? (
                              <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                            ) : (
                              <Upload className="w-8 h-8 text-purple-500" />
                            )}
                            <span className="text-sm font-medium">
                              {isUploading
                                ? "Đang upload..."
                                : "Click để upload hình ảnh"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              PNG, JPG, GIF up to 10MB
                            </span>
                          </label>
                        </div>
                      </div>

                      {/* Uploaded Images */}
                      {uploadedImages.length > 0 && (
                        <div className="space-y-4">
                          <Label className="text-sm font-medium">
                            Hình ảnh đã upload ({uploadedImages.length})
                          </Label>
                          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                            {uploadedImages.map((image, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={image}
                                  alt={`Upload ${index + 1}`}
                                  className="object-cover w-full h-24 rounded-lg"
                                />
                                <button
                                  onClick={() =>
                                    setUploadedImages((prev) =>
                                      prev.filter((_, i) => i !== index),
                                    )
                                  }
                                  className="absolute p-1 text-white transition-opacity bg-red-500 rounded-full opacity-0 top-1 right-1 group-hover:opacity-100"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* SEO Meta Tab */}
              <TabsContent value="seo" className="space-y-6">
                <motion.div
                  key="seo-tab"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-green-50 dark:from-slate-800 dark:to-green-900">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500">
                          <Globe className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <span className="text-xl text-transparent bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text">
                            SEO Meta Tags
                          </span>
                          <p className="mt-1 text-sm text-muted-foreground">
                            Tối ưu hóa cho công cụ tìm kiếm
                          </p>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Meta Title */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="metaTitle"
                          className="text-sm font-medium"
                        >
                          Meta Title
                        </Label>
                        <Input
                          id="metaTitle"
                          placeholder="Tiêu đề SEO (khuyến nghị 50-60 ký tự)"
                          {...register("metaTitle")}
                        />
                        {watchedValues.metaTitle && (
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <span>
                              Độ dài: {watchedValues.metaTitle.length} ký tự
                            </span>
                            <Badge
                              variant={
                                watchedValues.metaTitle.length >= 50 &&
                                watchedValues.metaTitle.length <= 60
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {watchedValues.metaTitle.length >= 50 &&
                              watchedValues.metaTitle.length <= 60
                                ? "Tốt"
                                : "Cần cải thiện"}
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* Meta Description */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="metaDescription"
                          className="text-sm font-medium"
                        >
                          Meta Description
                        </Label>
                        <Textarea
                          id="metaDescription"
                          placeholder="Mô tả SEO (khuyến nghị 120-160 ký tự)"
                          {...register("metaDescription")}
                          className="min-h-[80px]"
                        />
                        {watchedValues.metaDescription && (
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <span>
                              Độ dài: {watchedValues.metaDescription.length} ký
                              tự
                            </span>
                            <Badge
                              variant={
                                watchedValues.metaDescription.length >= 120 &&
                                watchedValues.metaDescription.length <= 160
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {watchedValues.metaDescription.length >= 120 &&
                              watchedValues.metaDescription.length <= 160
                                ? "Tốt"
                                : "Cần cải thiện"}
                            </Badge>
                          </div>
                        )}
                      </div>

                      {/* Meta Keywords */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="metaKeywords"
                          className="text-sm font-medium"
                        >
                          Meta Keywords
                        </Label>
                        <Input
                          id="metaKeywords"
                          placeholder="từ khóa 1, từ khóa 2, từ khóa 3"
                          {...register("metaKeywords")}
                        />
                        <p className="text-xs text-muted-foreground">
                          Phân cách bằng dấu phẩy. Khuyến nghị 3-5 từ khóa
                          chính.
                        </p>
                      </div>

                      {/* SEO Preview */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Preview Google Search
                        </Label>
                        <div className="p-4 bg-white border rounded-lg dark:bg-slate-800">
                          <div className="space-y-1">
                            <div className="text-lg font-medium text-blue-600 cursor-pointer hover:underline">
                              {watchedValues.metaTitle ||
                                watchedValues.title ||
                                "Tiêu đề bài viết"}
                            </div>
                            <div className="text-sm text-green-600">
                              https://templatemarket.vn/blog/
                              {watchedValues.slug || "url-slug"}
                            </div>
                            <div className="text-sm text-gray-600">
                              {watchedValues.metaDescription ||
                                watchedValues.excerpt ||
                                "Mô tả bài viết sẽ hiển thị ở đây..."}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Xuất bản</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Status */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Trạng thái</Label>
                  <Select
                    value={watchedValues.status}
                    onValueChange={(value) =>
                      setValue("status", value as "draft" | "published")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-yellow-500" />
                          <span>Bản nháp</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="published">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Đã xuất bản</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Danh mục</Label>
                  <Select
                    value={watchedValues.category}
                    onValueChange={(value) => setValue("category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-red-500">
                      {errors.category.message}
                    </p>
                  )}
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Tags</Label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Nhập tag"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addTag())
                      }
                    />
                    <Button type="button" size="sm" onClick={addTag}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {selectedTags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedTags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="group">
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 transition-opacity opacity-0 group-hover:opacity-100"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart className="w-5 h-5" />
                  <span>Thống kê nhanh</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 text-center rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <div className="text-2xl font-bold text-blue-600">
                      {contentStats.words}
                    </div>
                    <div className="text-xs text-muted-foreground">Từ</div>
                  </div>
                  <div className="p-3 text-center rounded-lg bg-green-50 dark:bg-green-900/20">
                    <div className="text-2xl font-bold text-green-600">
                      {contentStats.readingTime}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Phút đọc
                    </div>
                  </div>
                  <div className="p-3 text-center rounded-lg bg-purple-50 dark:bg-purple-900/20">
                    <div className="text-2xl font-bold text-purple-600">
                      {readabilityScore}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Điểm SEO
                    </div>
                  </div>
                  <div className="p-3 text-center rounded-lg bg-orange-50 dark:bg-orange-900/20">
                    <div className="text-2xl font-bold text-orange-600">
                      {seoSuggestions.length}
                    </div>
                    <div className="text-xs text-muted-foreground">Gợi ý</div>
                  </div>
                </div>

                {/* SEO Score */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">SEO Score</span>
                    <Badge
                      className={`${
                        readabilityScore >= 80
                          ? "bg-green-100 text-green-800"
                          : readabilityScore >= 60
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {readabilityScore >= 80
                        ? "Tuyệt vời"
                        : readabilityScore >= 60
                          ? "Tốt"
                          : "Cần cải thiện"}
                    </Badge>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        readabilityScore >= 80
                          ? "bg-green-500"
                          : readabilityScore >= 60
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                      style={{ width: `${readabilityScore}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Author Info */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Tác giả</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium">Admin User</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date().toLocaleDateString("vi-VN")}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Thao tác nhanh
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start w-full"
                  onClick={() => {
                    const content = watchedValues.content || "";
                    navigator.clipboard.writeText(content);
                    toast({
                      title: "📋 Đã copy",
                      description: "Nội dung đã được copy vào clipboard.",
                    });
                  }}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Copy nội dung
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start w-full"
                  onClick={() => {
                    const wordCount = (
                      watchedValues.content?.match(/\b\w+\b/g) || []
                    ).length;
                    toast({
                      title: "📊 Thống kê",
                      description: `Bài viết có ${wordCount} từ, ${contentStats.readingTime} phút đọc.`,
                    });
                  }}
                >
                  <BarChart className="w-4 h-4 mr-2" />
                  Xem thống kê
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start w-full"
                  onClick={() => setActiveTab("seo-tools")}
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  Mở SEO Tools
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Floating Action Buttons */}
        <div className="fixed flex flex-col space-y-3 bottom-6 right-6">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              size="lg"
              className="rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full shadow-lg"
              onClick={() => {
                // Preview functionality
                toast({
                  title: "👁️ Xem trước",
                  description: "Tính năng xem trước đang được phát triển.",
                });
              }}
            >
              <Eye className="w-5 h-5" />
            </Button>
          </motion.div>
        </div>

        {/* Loading Overlay */}
        <AnimatePresence>
          {isSubmitting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            >
              <Card className="p-6">
                <CardContent className="flex items-center space-x-4">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <div>
                    <div className="font-medium">
                      {isEditing
                        ? "Đang cập nhật bài viết..."
                        : "Đang tạo bài viết..."}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Vui lòng đợi trong giây lát
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BlogCreate;
