import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostBySlug } from "@/lib/blog";
import { getCommentsByPostId } from "@/lib/comments";
import { CommentList } from "@/components/CommentList";
import { CommentForm } from "@/components/CommentForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/lib/supabase"; // Thêm import Supabase
import { motion } from "framer-motion";
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
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [comments, setComments] = React.useState([]);
  const [relatedPosts, setRelatedPosts] = React.useState<any[]>([]); // State cho related posts
  const [loadingRelated, setLoadingRelated] = React.useState(false);

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

  // Loading state
  if (loading) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 mr-2 animate-spin" />
          <span>Đang tải bài viết...</span>
        </div>
      </div>
    );
  }

  // Post not found
  if (!post) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <Card className="py-12 text-center">
          <CardContent>
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="mb-2 text-xl font-semibold">
              Không tìm thấy bài viết
            </h2>
            <p className="mb-4 text-muted-foreground">
              Bài viết bạn đang tìm không tồn tại hoặc đã bị xóa.
            </p>
            <Button onClick={() => navigate("/blog")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Về trang blog
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleShare = async (platform?: string) => {
    const url = window.location.href;
    const title = post.title;

    if (platform === "copy") {
      navigator.clipboard.writeText(url);
      toast({
        title: "Đã sao chép link",
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
          title: "Đã sao chép link",
          description: "Link bài viết đã được sao chép vào clipboard.",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
      <div className="container px-4 py-8 mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button variant="ghost" onClick={() => navigate("/blog")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
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
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="object-cover w-full h-64 md:h-96"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <Badge
                    className="mb-4"
                    style={{
                      backgroundColor: getCategoryColor(
                        post.blog_categories?.color || "blue",
                      ),
                    }}
                  >
                    {post.blog_categories?.name || "Uncategorized"}
                  </Badge>
                </div>
              </div>
            )}

            {/* Article Meta */}
            <div className="space-y-6">
              <h1 className="text-3xl font-bold leading-tight md:text-5xl">
                {post.title}
              </h1>

              {post.excerpt && (
                <p className="text-xl leading-relaxed text-muted-foreground">
                  {post.excerpt}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                    <User className="w-5 h-5" />
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
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Share Buttons */}
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">Chia sẻ:</span>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleShare("facebook")}
                  >
                    <Facebook className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleShare("twitter")}
                  >
                    <Twitter className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleShare("linkedin")}
                  >
                    <Linkedin className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleShare("copy")}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            {/* Article Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <div
                dangerouslySetInnerHTML={{
                  __html: formatContent(post.content),
                }}
              />
            </div>

            <Separator />

            {/* Comments Section */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-10"
            >
              <h2 className="flex items-center gap-2 mb-4 text-2xl font-bold">
                <MessageSquare className="w-6 h-6" />
                Bình luận
              </h2>
              <CommentList comments={comments} />
              <CommentForm
                postId={post.id}
                onSuccess={() => getCommentsByPostId(post.id).then(setComments)}
              />
            </motion.section>

            {/* Author Info */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                    <User className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">
                      {post.author_name || "Admin"}
                    </h3>
                    <p className="mt-1 text-muted-foreground">
                      Tác giả của bài viết này
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.article>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-16"
            >
              <h2 className="mb-8 text-2xl font-bold">Bài viết liên quan</h2>

              {loadingRelated ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="ml-2">Đang tải bài viết liên quan...</span>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-3">
                  {relatedPosts.map((relatedPost) => (
                    <Card
                      key={relatedPost.id}
                      className="transition-all duration-300 hover:shadow-lg group"
                    >
                      {relatedPost.featured_image && (
                        <div className="relative overflow-hidden">
                          <img
                            src={relatedPost.featured_image}
                            alt={relatedPost.title}
                            className="object-cover w-full h-40 transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                      )}
                      <CardContent className="p-4">
                        <Badge
                          className="mb-2"
                          style={{
                            backgroundColor: getCategoryColor(
                              relatedPost.blog_categories?.color || "blue",
                            ),
                          }}
                        >
                          {relatedPost.blog_categories?.name || "Uncategorized"}
                        </Badge>
                        <h3 className="font-semibold transition-colors line-clamp-2 group-hover:text-primary">
                          <a href={`/blog/${relatedPost.slug}`}>
                            {relatedPost.title}
                          </a>
                        </h3>
                        <div className="flex items-center mt-3 space-x-2 text-sm text-muted-foreground">
                          <span>
                            {new Date(
                              relatedPost.published_at ||
                                relatedPost.created_at,
                            ).toLocaleDateString("vi-VN")}
                          </span>
                          {relatedPost.read_time && (
                            <>
                              <span>•</span>
                              <span>{relatedPost.read_time} phút</span>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
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
    .replace(/``````/g, "<pre><code>$2</code></pre>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
    );
};

export default BlogPost;
