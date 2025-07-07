import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { getPostBySlug } from "@/lib/blog";
import { getCommentsByPostId, addComment } from "@/lib/comments";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
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
  Send,
  ThumbsUp,
  Reply,
  MoreHorizontal,
  Quote,
  Sparkles,
  Award,
  Coffee,
  Code,
  Palette,
  ChevronUp,
  Bookmark,
  Download,
  Printer,
  Search,
  Filter,
  TrendingUp,
  Star,
  Zap,
  Target,
  Globe,
  Shield,
  Layers,
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

interface Heading {
  id: string;
  text: string;
  level: number;
}

// Reading Progress Component
const ReadingProgress: React.FC = () => {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min((scrollTop / docHeight) * 100, 100);
      setProgress(progress);
    };

    window.addEventListener("scroll", updateProgress);
    updateProgress();
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 z-50 h-1 shadow-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
      style={{ width: `${progress}%` }}
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{ duration: 0.1 }}
    />
  );
};

// Table of Contents Component
const TableOfContents: React.FC<{ content: string }> = ({ content }) => {
  const [headings, setHeadings] = React.useState<Heading[]>([]);
  const [activeId, setActiveId] = React.useState<string>("");

  React.useEffect(() => {
    const extractedHeadings: Heading[] = [];
    const lines = content.split("\n");

    lines.forEach((line, index) => {
      const h1Match = line.match(/^#{1}\s(.+)/);
      const h2Match = line.match(/^#{2}\s(.+)/);
      const h3Match = line.match(/^#{3}\s(.+)/);

      if (h1Match || h2Match || h3Match) {
        const text = (h1Match || h2Match || h3Match)![1];
        const level = h1Match ? 1 : h2Match ? 2 : 3;
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");
        extractedHeadings.push({ id, text, level });
      }
    });

    setHeadings(extractedHeadings);
  }, [content]);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0% -80% 0%" },
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="sticky overflow-y-auto top-24 max-h-96"
    >
      <Card className="p-4 border-0 shadow-xl bg-gradient-to-br from-white via-blue-50 to-purple-50 dark:from-slate-800 dark:via-blue-900 dark:to-purple-900">
        <div className="flex items-center mb-4 space-x-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <h3 className="font-semibold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
            Mục lục
          </h3>
        </div>
        <nav className="space-y-2">
          {headings.map((heading) => (
            <motion.a
              key={heading.id}
              href={`#${heading.id}`}
              whileHover={{ x: 4 }}
              className={`block text-sm transition-all duration-200 hover:text-blue-600 ${
                heading.level === 1
                  ? "font-semibold text-base"
                  : heading.level === 2
                    ? "ml-4 font-medium"
                    : "ml-8"
              } ${
                activeId === heading.id
                  ? "text-blue-600 font-semibold border-l-2 border-blue-600 pl-2"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              {heading.text}
            </motion.a>
          ))}
        </nav>
      </Card>
    </motion.div>
  );
};

// Lazy Image Component
const LazyImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
}> = ({ src, alt, className }) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isInView, setIsInView] = React.useState(false);
  const imgRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={imgRef} className={`relative ${className}`}>
      {isInView && (
        <>
          {!isLoaded && (
            <div className="absolute inset-0 rounded bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
          )}
          <img
            src={src}
            alt={alt}
            onLoad={() => setIsLoaded(true)}
            className={`transition-opacity duration-500 ${
              isLoaded ? "opacity-100" : "opacity-0"
            } ${className}`}
          />
        </>
      )}
    </div>
  );
};

// Scroll to Top Button
const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className="fixed z-50 p-3 text-white transition-all duration-300 rounded-full shadow-lg bottom-8 right-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronUp className="w-6 h-6" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

// Main BlogPost Component
const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [comments, setComments] = React.useState<Comment[]>([]);
  const [relatedPosts, setRelatedPosts] = React.useState<any[]>([]);
  const [loadingRelated, setLoadingRelated] = React.useState(false);

  // Comment form states
  const [commentName, setCommentName] = React.useState("");
  const [commentAvatar, setCommentAvatar] = React.useState("");
  const [commentContent, setCommentContent] = React.useState("");
  const [commentLoading, setCommentLoading] = React.useState(false);
  const [showCommentForm, setShowCommentForm] = React.useState(false);
  const [likedComments, setLikedComments] = React.useState<Set<string>>(
    new Set(),
  );

  // Additional states
  const [isBookmarked, setIsBookmarked] = React.useState(false);
  const [readingTime, setReadingTime] = React.useState(0);

  // Calculate reading time
  React.useEffect(() => {
    if (post?.content) {
      const words = post.content.split(/\s+/).length;
      const time = Math.ceil(words / 200); // Average reading speed
      setReadingTime(time);
    }
  }, [post]);

  // Fetch comments
  React.useEffect(() => {
    if (!post?.id) return;
    getCommentsByPostId(post.id).then(setComments);
  }, [post]);

  // Fetch related posts
  React.useEffect(() => {
    const fetchRelatedPosts = async () => {
      if (!post?.category_id) return;

      setLoadingRelated(true);
      try {
        const { data, error } = await supabase
          .from("blog_posts")
          .select(`*, blog_categories(name, color)`)
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

        // Update view count
        if (result?.id) {
          await supabase
            .from("blog_posts")
            .update({ views: (result.views || 0) + 1 })
            .eq("id", result.id);
        }
      } catch (error) {
        console.error("Error loading post:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  // Handle comment submission
  const handleCommentSubmit = async () => {
    if (!commentName || !commentContent) {
      toast({
        title: "⚠️ Thiếu thông tin",
        description: "Hãy nhập tên và nội dung bình luận.",
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

      setCommentName("");
      setCommentAvatar("");
      setCommentContent("");
      setShowCommentForm(false);
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

  // Handle comment like
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
      title: likedComments.has(commentId) ? "💔 Đã bỏ thích" : "❤️ Đã thích",
      description: "Cảm ơn phản hồi của bạn!",
    });
  };

  // Handle share
  const handleShare = async (platform?: string) => {
    const url = window.location.href;
    const title = post.title;

    if (platform === "copy") {
      navigator.clipboard.writeText(url);
      toast({
        title: "📋 Đã sao chép",
        description: "Link bài viết đã được sao chép.",
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
    }
  };

  // Handle bookmark
  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast({
      title: isBookmarked ? "🔖 Đã bỏ lưu" : "📌 Đã lưu bài viết",
      description: isBookmarked
        ? "Bài viết đã bị xóa khỏi danh sách lưu"
        : "Bài viết đã được thêm vào danh sách lưu",
    });
  };

  // Enhanced content formatting
  const formatContent = (content: string) => {
    if (!content) return "";

    return content
      .replace(/#{3}\s(.+)/g, (match, title) => {
        const id = title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");
        return `<h3 id="${id}" class="scroll-mt-20 text-xl font-semibold mb-4 mt-8 text-gray-900 dark:text-gray-100">${title}</h3>`;
      })
      .replace(/#{2}\s(.+)/g, (match, title) => {
        const id = title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");
        return `<h2 id="${id}" class="scroll-mt-20 text-2xl font-bold mb-6 mt-10 text-gray-900 dark:text-gray-100">${title}</h2>`;
      })
      .replace(/#{1}\s(.+)/g, (match, title) => {
        const id = title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");
        return `<h1 id="${id}" class="scroll-mt-20 text-3xl font-bold mb-8 mt-12 text-gray-900 dark:text-gray-100">${title}</h1>`;
      })
      .replace(
        /``````/g,
        '<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-6 border border-gray-700"><code class="language-$1">$2</code></pre>',
      )
      .replace(
        /`([^`]+)`/g,
        '<code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono text-pink-600 dark:text-pink-400">$1</code>',
      )
      .replace(
        /\*\*(.+?)\*\*/g,
        '<strong class="font-semibold text-gray-900 dark:text-gray-100">$1</strong>',
      )
      .replace(
        /\*(.+?)\*/g,
        '<em class="italic text-gray-700 dark:text-gray-300">$1</em>',
      )
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline decoration-2 underline-offset-2 transition-colors font-medium">$1</a>',
      )
      .replace(
        /^\* (.+)$/gm,
        '<li class="mb-2 text-gray-700 dark:text-gray-300">$1</li>',
      )
      .replace(
        /(<li.*<\/li>)/s,
        '<ul class="list-disc list-inside space-y-2 my-4 pl-4">$1</ul>',
      )
      .replace(
        /^> (.+)$/gm,
        '<blockquote class="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 my-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-r-lg">$1</blockquote>',
      )
      .replace(
        /\n\n/g,
        '</p><p class="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">',
      )
      .replace(
        /^/,
        '<p class="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">',
      )
      .replace(/$/, "</p>");
  };

  // Structured data for SEO
  const structuredData = post
    ? {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt || post.meta_description,
        image: post.featured_image,
        author: {
          "@type": "Person",
          name: post.author_name || "Admin",
        },
        publisher: {
          "@type": "Organization",
          name: "Your Blog Name",
          logo: {
            "@type": "ImageObject",
            url: "/logo.png",
          },
        },
        datePublished: post.published_at || post.created_at,
        dateModified: post.updated_at || post.created_at,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": window.location.href,
        },
      }
    : null;

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
            <span className="ml-4 text-lg font-medium">
              Đang tải bài viết...
            </span>
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
    <>
      {/* SEO Head */}
      <Helmet>
        <title>{post.title} | Your Blog Name</title>
        <meta
          name="description"
          content={post.excerpt || post.meta_description}
        />
        <meta name="keywords" content={post.tags?.join(", ")} />

        {/* Open Graph */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.featured_image} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="article" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        <meta name="twitter:image" content={post.featured_image} />

        {/* Structured Data */}
        {structuredData && (
          <script type="application/ld+json">
            {JSON.stringify(structuredData)}
          </script>
        )}
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
        <ReadingProgress />
        <ScrollToTop />

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
          <div className="absolute top-1/2 right-1/3 animate-float">
            <Zap className="w-5 h-5 text-yellow-500 opacity-20" />
          </div>
          <div className="absolute bottom-1/3 right-1/4 animate-float-delay-1">
            <Target className="w-6 h-6 text-green-500 opacity-20" />
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
              className="group hover:bg-white/50 dark:hover:bg-slate-800/50"
            >
              <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
              Quay lại blog
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 mx-auto lg:grid-cols-4 max-w-7xl">
            {/* Main Content */}
            <div className="lg:col-span-3">
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
                    <LazyImage
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
                          className="mb-4 font-medium text-white shadow-lg"
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

                {/* Article Header */}
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

                  {/* Article Meta */}
                  <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">
                          {post.author_name || "Admin"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Tác giả
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

                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{readingTime} phút đọc</span>
                    </div>

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
                            className="transition-all duration-200 hover:bg-primary hover:text-primary-foreground hover:shadow-md"
                          >
                            #{tag}
                          </Badge>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {/* Action Buttons */}
                  <motion.div
                    className="flex flex-wrap items-center gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Chia sẻ:</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleShare("facebook")}
                        className="transition-all duration-200 hover:bg-blue-600 hover:text-white hover:scale-105"
                      >
                        <Facebook className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleShare("twitter")}
                        className="transition-all duration-200 hover:bg-sky-500 hover:text-white hover:scale-105"
                      >
                        <Twitter className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleShare("linkedin")}
                        className="transition-all duration-200 hover:bg-blue-700 hover:text-white hover:scale-105"
                      >
                        <Linkedin className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleShare("copy")}
                        className="transition-all duration-200 hover:bg-gray-600 hover:text-white hover:scale-105"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>

                    <Separator orientation="vertical" className="h-6" />

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleBookmark}
                      className={`transition-all duration-200 hover:scale-105 ${
                        isBookmarked
                          ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                          : "hover:bg-yellow-50 hover:text-yellow-700"
                      }`}
                    >
                      <Bookmark
                        className={`w-4 h-4 mr-2 ${isBookmarked ? "fill-current" : ""}`}
                      />
                      {isBookmarked ? "Đã lưu" : "Lưu bài"}
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.print()}
                      className="transition-all duration-200 hover:bg-green-50 hover:text-green-700 hover:scale-105"
                    >
                      <Printer className="w-4 h-4 mr-2" />
                      In bài
                    </Button>
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

                {/* Enhanced Comments Section */}
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
                      className="shadow-lg group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    >
                      <MessageSquare className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                      {showCommentForm ? "Ẩn form" : "Viết bình luận"}
                    </Button>
                  </div>

                  {/* Comment Form */}
                  <AnimatePresence>
                    {showCommentForm && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mb-8"
                      >
                        <Card className="p-6 border-0 shadow-xl bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-blue-900">
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
                                  onChange={(e) =>
                                    setCommentName(e.target.value)
                                  }
                                  className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                                />
                              </motion.div>
                              <motion.div whileFocus={{ scale: 1.02 }}>
                                <Input
                                  placeholder="URL ảnh đại diện (tuỳ chọn)"
                                  value={commentAvatar}
                                  onChange={(e) =>
                                    setCommentAvatar(e.target.value)
                                  }
                                  className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                                />
                              </motion.div>
                            </div>

                            <motion.div whileFocus={{ scale: 1.01 }}>
                              <Textarea
                                placeholder="Chia sẻ suy nghĩ của bạn về bài viết này..."
                                value={commentContent}
                                onChange={(e) =>
                                  setCommentContent(e.target.value)
                                }
                                rows={4}
                                className="transition-all duration-300 resize-none focus:ring-2 focus:ring-primary/20"
                              />
                            </motion.div>

                            <div className="flex items-center justify-between">
                              <div className="text-sm text-muted-foreground">
                                <span className="text-red-500">*</span> Các
                                trường bắt buộc
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

                  {/* Comments List */}
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
                                      onClick={() =>
                                        handleCommentLike(comment.id)
                                      }
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
                                          (likedComments.has(comment.id)
                                            ? 1
                                            : 0)}
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
                          <Card className="py-12 text-center border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900">
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
                                Hãy là người đầu tiên chia sẻ suy nghĩ về bài
                                viết này!
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
                  <Card className="border-0 shadow-xl bg-gradient-to-r from-white to-purple-50 dark:from-slate-800 dark:to-purple-900">
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
                            Tác giả của bài viết này. Chuyên gia trong lĩnh vực
                            công nghệ và thiết kế.
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
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                <TableOfContents content={post?.content || ""} />

                {/* Quick Actions */}
                <Card className="p-4 border-0 shadow-xl bg-gradient-to-br from-white via-green-50 to-blue-50 dark:from-slate-800 dark:via-green-900 dark:to-blue-900">
                  <div className="flex items-center mb-4 space-x-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-blue-600">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-semibold text-transparent bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text">
                      Thao tác nhanh
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-start w-full"
                      onClick={handleBookmark}
                    >
                      <Bookmark
                        className={`w-4 h-4 mr-2 ${isBookmarked ? "fill-current" : ""}`}
                      />
                      {isBookmarked ? "Đã lưu" : "Lưu bài viết"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-start w-full"
                      onClick={() => handleShare("copy")}
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Chia sẻ
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-start w-full"
                      onClick={() => window.print()}
                    >
                      <Printer className="w-4 h-4 mr-2" />
                      In bài viết
                    </Button>
                  </div>
                </Card>

                {/* Reading Stats */}
                <Card className="p-4 border-0 shadow-xl bg-gradient-to-br from-white via-orange-50 to-red-50 dark:from-slate-800 dark:via-orange-900 dark:to-red-900">
                  <div className="flex items-center mb-4 space-x-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-600">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-semibold text-transparent bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text">
                      Thống kê
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Thời gian đọc
                      </span>
                      <span className="font-medium">{readingTime} phút</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Lượt xem
                      </span>
                      <span className="font-medium">{post.views || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Bình luận
                      </span>
                      <span className="font-medium">{comments.length}</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>

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
                            <LazyImage
                              src={relatedPost.featured_image}
                              alt={relatedPost.title}
                              className="object-cover w-full h-40 transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-black/50 to-transparent group-hover:opacity-100" />
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
    </>
  );
};

// Helper function
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

export default BlogPost;
