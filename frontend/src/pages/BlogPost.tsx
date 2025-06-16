import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostBySlug } from "@/lib/blog";
import { getCommentsByPostId, addComment } from "@/lib/comments";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  Heart,
  Share2,
  User,
  Facebook,
  Twitter,
  Linkedin,
  MessageSquare,
  Copy,
  BookOpen,
  Loader2,
  Send,
  ThumbsUp,
  Reply,
  MoreHorizontal,
  Quote,
  Sparkles,
  Star,
  Award,
  Coffee,
  Code,
  Palette,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Comment {
  id: string;
  author_name: string;
  author_avatar?: string;
  content: string;
  created_at: string;
  likes?: number;
  replies?: Comment[];
}

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [comments, setComments] = React.useState<Comment[]>([]);
  const [relatedPosts, setRelatedPosts] = React.useState<any[]>([]);
  const [loadingRelated, setLoadingRelated] = React.useState(false);

  // ✅ Comment form states
  const [commentName, setCommentName] = React.useState("");
  const [commentAvatar, setCommentAvatar] = React.useState("");
  const [commentContent, setCommentContent] = React.useState("");
  const [commentLoading, setCommentLoading] = React.useState(false);
  const [showCommentForm, setShowCommentForm] = React.useState(false);
  const [likedComments, setLikedComments] = React.useState<Set<string>>(
    new Set(),
  );

  // Fetch comments khi có post
  React.useEffect(() => {
    if (!post?.id) return;
    getCommentsByPostId(post.id).then(setComments);
  }, [post]);

  // Fetch related posts từ Supabase
  React.useEffect(() => {
    const fetchRelatedPosts = async () => {
      if (!post?.category_id) return;

      setLoadingRelated(true);
      try {
        const { data, error } = await supabase
          .from("blog_posts")
          .select(
            `
            *,
            blog_categories(name, color)
          `,
          )
          .eq("category_id", post.category_id)
          .eq("is_published", true)
          .neq("id", post.id)
          .limit(3);

        if (error) throw error;
        setRelatedPosts(data || []);
      } catch (error) {
        console.error("Error fetching related posts:", error);
      } finally {
        setLoadingRelated(false);
      }
    };

    fetchRelatedPosts();
  }, [post]);

  // Load main post
  React.useEffect(() => {
    const loadPost = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const result = await getPostBySlug(slug);
        setPost(result);
      } catch (error) {
        console.error("Error loading post:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  // ✅ Handle comment submission
  const handleCommentSubmit = async () => {
    if (!commentName || !commentContent) {
      toast({
        title: "Thiếu thông tin",
        description: "Hãy nhập tên và bình luận.",
        variant: "destructive",
      });
      return;
    }

    setCommentLoading(true);
    try {
      await addComment({
        postId: post.id,
        author_name: commentName,
        author_avatar:
          commentAvatar || `https://i.pravatar.cc/100?u=${commentName}`,
        content: commentContent,
      });

      toast({
        title: "🎉 Bình luận đã gửi!",
        description: "Cảm ơn bạn đã chia sẻ ý kiến!",
      });

      // Reset form
      setCommentName("");
      setCommentAvatar("");
      setCommentContent("");
      setShowCommentForm(false);

      // Refresh comments
      getCommentsByPostId(post.id).then(setComments);
    } catch (err) {
      toast({
        title: "❌ Lỗi",
        description: "Không gửi được bình luận. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setCommentLoading(false);
    }
  };

  // ✅ Handle comment like
  const handleCommentLike = (commentId: string) => {
    setLikedComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });

    toast({
      title: likedComments.has(commentId)
        ? "💔 Đã bỏ thích"
        : "❤️ Đã thích bình luận",
      description: "Cảm ơn phản hồi của bạn!",
    });
  };

  const handleShare = async (platform?: string) => {
    const url = window.location.href;
    const title = post.title;

    if (platform === "copy") {
      navigator.clipboard.writeText(url);
      toast({
        title: "📋 Đã sao chép link",
        description: "Link bài viết đã được sao chép vào clipboard.",
      });
      return;
    }

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    };

    if (platform && shareUrls[platform as keyof typeof shareUrls]) {
      window.open(shareUrls[platform as keyof typeof shareUrls], "_blank");
    } else {
      try {
        await navigator.share({ title, url });
      } catch (error) {
        navigator.clipboard.writeText(url);
        toast({
          title: "📋 Đã sao chép link",
          description: "Link bài viết đã được sao chép vào clipboard.",
        });
      }
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
        <div className="container px-4 py-8 mx-auto">
          <div className="flex items-center justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 rounded-full border-primary border-t-transparent"
            />
            <span className="ml-4 text-lg">Đang tải bài viết...</span>
          </div>
        </div>
      </div>
    );
  }

  // Post not found
  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
        <div className="container px-4 py-8 mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto"
          >
            <Card className="py-12 text-center border-0 shadow-2xl bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900">
              <CardContent>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                </motion.div>
                <h2 className="mb-2 text-xl font-semibold">
                  Không tìm thấy bài viết
                </h2>
                <p className="mb-6 text-muted-foreground">
                  Bài viết bạn đang tìm không tồn tại hoặc đã bị xóa.
                </p>
                <Button onClick={() => navigate("/blog")} className="group">
                  <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                  Về trang blog
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
      {/* Floating Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 animate-float">
          <Code className="w-8 h-8 text-blue-500 opacity-20" />
        </div>
        <div className="absolute top-1/3 right-1/4 animate-float-delay-1">
          <Palette className="w-6 h-6 text-purple-500 opacity-20" />
        </div>
        <div className="absolute bottom-1/4 left-1/3 animate-float-delay-2">
          <Coffee className="text-orange-500 w-7 h-7 opacity-20" />
        </div>
      </div>

      <div className="container relative z-10 px-4 py-8 mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={() => navigate("/blog")}
            className="group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Quay lại blog
          </Button>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Featured Image */}
            {post.featured_image && (
              <motion.div
                className="relative overflow-hidden shadow-2xl rounded-2xl"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="object-cover w-full h-64 md:h-96"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Badge
                      className="mb-4 shadow-lg"
                      style={{
                        backgroundColor: getCategoryColor(
                          post.blog_categories?.color || "blue",
                        ),
                      }}
                    >
                      {post.blog_categories?.name || "Uncategorized"}
                    </Badge>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Article Meta */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-3xl font-bold leading-tight text-transparent md:text-5xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text">
                {post.title}
              </h1>

              {post.excerpt && (
                <p className="text-xl leading-relaxed text-muted-foreground">
                  {post.excerpt}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">
                      {post.author_name || "Admin"}
                    </div>
                  </div>
                </div>

                <Separator orientation="vertical" className="h-6" />

                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(
                      post.published_at || post.created_at,
                    ).toLocaleDateString("vi-VN")}
                  </span>
                </div>

                {post.read_time && (
                  <>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{post.read_time} phút đọc</span>
                    </div>
                  </>
                )}

                {post.views && (
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{post.views} lượt xem</span>
                  </div>
                )}
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <motion.div
                  className="flex flex-wrap gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {post.tags.map((tag: string, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <Badge
                        variant="outline"
                        className="transition-colors hover:bg-primary hover:text-primary-foreground"
                      >
                        {tag}
                      </Badge>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Share Buttons */}
              <motion.div
                className="flex items-center space-x-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <span className="text-sm font-medium">Chia sẻ:</span>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleShare("facebook")}
                    className="transition-colors hover:bg-blue-600 hover:text-white"
                  >
                    <Facebook className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleShare("twitter")}
                    className="transition-colors hover:bg-sky-500 hover:text-white"
                  >
                    <Twitter className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleShare("linkedin")}
                    className="transition-colors hover:bg-blue-700 hover:text-white"
                  >
                    <Linkedin className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleShare("copy")}
                    className="transition-colors hover:bg-gray-600 hover:text-white"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            </motion.div>

            <Separator />

            {/* Article Content */}
            <motion.div
              className="prose prose-lg dark:prose-invert max-w-none"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: formatContent(post.content),
                }}
              />
            </motion.div>

            <Separator />

            {/* ✅ Enhanced Comments Section */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-16"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-blue-500">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text">
                      Bình luận
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {comments.length} bình luận
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => setShowCommentForm(!showCommentForm)}
                  className="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  <MessageSquare className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                  {showCommentForm ? "Ẩn form" : "Viết bình luận"}
                </Button>
              </div>

              {/* ✅ Comment Form */}
              <AnimatePresence>
                {showCommentForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-8"
                  >
                    <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-blue-900">
                      <div className="flex items-center mb-6 space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
                          <Quote className="w-4 h-4 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold">
                          Để lại bình luận của bạn
                        </h3>
                      </div>

                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <motion.div whileFocus={{ scale: 1.02 }}>
                            <Input
                              placeholder="Tên của bạn *"
                              value={commentName}
                              onChange={(e) => setCommentName(e.target.value)}
                              className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                            />
                          </motion.div>
                          <motion.div whileFocus={{ scale: 1.02 }}>
                            <Input
                              placeholder="URL ảnh đại diện (tuỳ chọn)"
                              value={commentAvatar}
                              onChange={(e) => setCommentAvatar(e.target.value)}
                              className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                            />
                          </motion.div>
                        </div>

                        <motion.div whileFocus={{ scale: 1.01 }}>
                          <Textarea
                            placeholder="Chia sẻ suy nghĩ của bạn về bài viết này..."
                            value={commentContent}
                            onChange={(e) => setCommentContent(e.target.value)}
                            rows={4}
                            className="transition-all duration-300 resize-none focus:ring-2 focus:ring-primary/20"
                          />
                        </motion.div>

                        <div className="flex items-center justify-between">
                          <div className="text-sm text-muted-foreground">
                            <span className="text-red-500">*</span> Các trường
                            bắt buộc
                          </div>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              onClick={handleCommentSubmit}
                              disabled={commentLoading}
                              className="shadow-lg bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                            >
                              {commentLoading ? (
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
                                  Đang gửi...
                                </>
                              ) : (
                                <>
                                  <Send className="w-4 h-4 mr-2" />
                                  Gửi bình luận
                                </>
                              )}
                            </Button>
                          </motion.div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ✅ Comments List */}
              <div className="space-y-6">
                <AnimatePresence>
                  {comments.length > 0 ? (
                    comments.map((comment, index) => (
                      <motion.div
                        key={comment.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.01 }}
                        className="group"
                      >
                        <Card className="p-6 transition-all duration-300 border-0 shadow-lg bg-gradient-to-r from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 hover:shadow-xl">
                          <div className="flex items-start space-x-4">
                            <motion.img
                              src={
                                comment.author_avatar ||
                                `https://i.pravatar.cc/100?u=${comment.author_name}`
                              }
                              alt={comment.author_name}
                              className="object-cover w-12 h-12 rounded-full ring-2 ring-primary/20"
                              whileHover={{ scale: 1.1, rotate: 5 }}
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <div className="text-lg font-semibold">
                                    {comment.author_name}
                                  </div>
                                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                    <Calendar className="w-3 h-3" />
                                    <span>
                                      {new Date(
                                        comment.created_at,
                                      ).toLocaleString("vi-VN")}
                                    </span>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="transition-opacity opacity-0 group-hover:opacity-100"
                                >
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </div>

                              <p className="mb-4 leading-relaxed text-foreground">
                                {comment.content}
                              </p>

                              <div className="flex items-center space-x-4">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleCommentLike(comment.id)}
                                  className={`group/like transition-all duration-300 ${
                                    likedComments.has(comment.id)
                                      ? "text-red-500 bg-red-50 dark:bg-red-900/20"
                                      : "hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                  }`}
                                >
                                  <motion.div
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.8 }}
                                  >
                                    <ThumbsUp
                                      className={`w-4 h-4 mr-1 ${
                                        likedComments.has(comment.id)
                                          ? "fill-current"
                                          : ""
                                      }`}
                                    />
                                  </motion.div>
                                  <span>
                                    {(comment.likes || 0) +
                                      (likedComments.has(comment.id) ? 1 : 0)}
                                  </span>
                                </Button>

                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="transition-colors hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                >
                                  <Reply className="w-4 h-4 mr-1" />
                                  Trả lời
                                </Button>

                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="transition-colors hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                                >
                                  <Share2 className="w-4 h-4 mr-1" />
                                  Chia sẻ
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <Card className="py-12 text-center border-0 bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900">
                        <CardContent>
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              delay: 0.2,
                              type: "spring",
                              stiffness: 200,
                            }}
                          >
                            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                          </motion.div>
                          <h3 className="mb-2 text-lg font-semibold">
                            Chưa có bình luận nào
                          </h3>
                          <p className="mb-4 text-muted-foreground">
                            Hãy là người đầu tiên chia sẻ suy nghĩ về bài viết
                            này!
                          </p>
                          <Button
                            onClick={() => setShowCommentForm(true)}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Viết bình luận đầu tiên
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.section>

            {/* Author Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="border-0 shadow-lg bg-gradient-to-r from-white to-purple-50 dark:from-slate-800 dark:to-purple-900">
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-purple-600">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center mb-2 space-x-2">
                        <h3 className="text-lg font-semibold">
                          {post.author_name || "Admin"}
                        </h3>
                        <Badge
                          variant="secondary"
                          className="text-yellow-800 bg-yellow-100"
                        >
                          <Award className="w-3 h-3 mr-1" />
                          Author
                        </Badge>
                      </div>
                      <p className="mb-3 text-muted-foreground">
                        Tác giả của bài viết này. Chuyên gia trong lĩnh vực công
                        nghệ và thiết kế.
                      </p>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <User className="w-4 h-4 mr-2" />
                          Xem profile
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Liên hệ
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.article>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-16"
            >
              <div className="flex items-center mb-8 space-x-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-red-500">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text">
                    Bài viết liên quan
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Những bài viết cùng chủ đề bạn có thể quan tâm
                  </p>
                </div>
              </div>

              {loadingRelated ? (
                <div className="flex items-center justify-center py-12">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-8 h-8 border-4 rounded-full border-primary border-t-transparent"
                  />
                  <span className="ml-3">Đang tải bài viết liên quan...</span>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-3">
                  {relatedPosts.map((relatedPost, index) => (
                    <motion.div
                      key={relatedPost.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -5, scale: 1.02 }}
                    >
                      <Card className="h-full transition-all duration-300 border-0 hover:shadow-xl group bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900">
                        {relatedPost.featured_image && (
                          <div className="relative overflow-hidden">
                            <img
                              src={relatedPost.featured_image}
                              alt={relatedPost.title}
                              className="object-cover w-full h-40 transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-black/50 to-transparent group-hover:opacity-100"></div>
                          </div>
                        )}
                        <CardContent className="p-4 space-y-3">
                          <Badge
                            style={{
                              backgroundColor: getCategoryColor(
                                relatedPost.blog_categories?.color || "blue",
                              ),
                            }}
                            className="text-white"
                          >
                            {relatedPost.blog_categories?.name ||
                              "Uncategorized"}
                          </Badge>
                          <h3 className="font-semibold transition-colors line-clamp-2 group-hover:text-primary">
                            <a
                              href={`/blog/${relatedPost.slug}`}
                              className="hover:underline"
                            >
                              {relatedPost.title}
                            </a>
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>
                                {new Date(
                                  relatedPost.published_at ||
                                    relatedPost.created_at,
                                ).toLocaleDateString("vi-VN")}
                              </span>
                            </div>
                            {relatedPost.read_time && (
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{relatedPost.read_time} phút</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.section>
          )}
        </div>
      </div>
    </div>
  );
};

const getCategoryColor = (color: string) => {
  const colors: Record<string, string> = {
    blue: "#3b82f6",
    purple: "#8b5cf6",
    green: "#10b981",
    orange: "#f59e0b",
    red: "#ef4444",
    pink: "#ec4899",
    teal: "#14b8a6",
    indigo: "#6366f1",
    cyan: "#06b6d4",
    yellow: "#eab308",
  };
  return colors[color] || colors.blue;
};

const formatContent = (content: string) => {
  // Enhanced markdown-like formatting
  return content
    .replace(/\n/g, "<br>")
    .replace(/#{3}\s(.+)/g, "<h3>$1</h3>")
    .replace(/#{2}\s(.+)/g, "<h2>$1</h2>")
    .replace(/#{1}\s(.+)/g, "<h1>$1</h1>")
    .replace(/``````/gs, "<pre><code>$1</code></pre>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">$1</a>',
    );
};

export default BlogPost;
