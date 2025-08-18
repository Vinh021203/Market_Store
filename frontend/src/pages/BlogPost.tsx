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
  Hash,
  ExternalLink,
  Lightbulb,
  HeadphonesIcon,
  PlayCircle,
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

// Enhanced Reading Progress Component
const ReadingProgress: React.FC = () => {
  const [progress, setProgress] = React.useState(0);
  const [isScrollingUp, setIsScrollingUp] = React.useState(false);
  const [lastScrollY, setLastScrollY] = React.useState(0);

  React.useEffect(() => {
    const updateProgress = () => {
      const currentScrollY = window.scrollY;
      const scrollTop = currentScrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progressValue = Math.min((scrollTop / docHeight) * 100, 100);

      setProgress(progressValue);
      setIsScrollingUp(currentScrollY < lastScrollY);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", updateProgress);
    updateProgress();
    return () => window.removeEventListener("scroll", updateProgress);
  }, [lastScrollY]);

  return (
    <>
      {/* Main progress bar */}
      <motion.div
        className="fixed top-0 left-0 z-50 h-1 shadow-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
        style={{ width: `${progress}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.1 }}
      />

      {/* Floating progress indicator */}
      <motion.div
        className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg rounded-full shadow-xl border border-white/20"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: progress > 5 ? 1 : 0,
          scale: progress > 5 ? 1 : 0.8,
        }}
      >
        <div className="relative w-8 h-8">
          <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 32 32">
            <circle
              cx="16"
              cy="16"
              r="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="16"
              cy="16"
              r="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray={`${2 * Math.PI * 14}`}
              strokeDashoffset={`${2 * Math.PI * 14 * (1 - progress / 100)}`}
              className="text-blue-500 transition-all duration-300"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-semibold text-blue-600">
              {Math.round(progress)}%
            </span>
          </div>
        </div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Đã đọc
        </span>
      </motion.div>
    </>
  );
};

// Enhanced Table of Contents Component
const TableOfContents: React.FC<{ content: string }> = ({ content }) => {
  const [headings, setHeadings] = React.useState<Heading[]>([]);
  const [activeId, setActiveId] = React.useState<string>("");
  const [isExpanded, setIsExpanded] = React.useState(true);

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
      className="sticky top-24 max-h-96 overflow-y-auto"
    >
      <Card className="border-0 shadow-2xl bg-gradient-to-br from-white/95 via-blue-50/90 to-purple-50/85 dark:from-slate-800/95 dark:via-blue-900/90 dark:to-purple-900/85 backdrop-blur-xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                  Mục lục
                </h3>
                <p className="text-xs text-muted-foreground">
                  {headings.length} chương
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-8 h-8 p-0"
            >
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronUp className="w-4 h-4" />
              </motion.div>
            </Button>
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.nav
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-2"
              >
                {headings.map((heading, index) => (
                  <motion.a
                    key={heading.id}
                    href={`#${heading.id}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ x: 8, scale: 1.02 }}
                    className={`block text-sm transition-all duration-300 relative group ${
                      heading.level === 1
                        ? "font-bold text-base"
                        : heading.level === 2
                          ? "ml-4 font-semibold"
                          : "ml-8 font-medium"
                    } ${
                      activeId === heading.id
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                    }`}
                  >
                    <div
                      className={`absolute left-0 w-1 rounded-full transition-all duration-300 ${
                        activeId === heading.id
                          ? "h-full bg-gradient-to-b from-blue-500 to-purple-600"
                          : "h-0 bg-gray-300 group-hover:h-full group-hover:bg-blue-400"
                      }`}
                    />
                    <span
                      className={`${activeId === heading.id ? "pl-4" : "pl-2"} transition-all duration-300`}
                    >
                      {heading.text}
                    </span>
                  </motion.a>
                ))}
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </motion.div>
  );
};

// Enhanced Lazy Image Component
const LazyImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
}> = ({ src, alt, className }) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isInView, setIsInView] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);
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
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {isInView && (
        <>
          {!isLoaded && !hasError && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded-lg" />
          )}
          {hasError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <ExternalLink className="w-8 h-8 text-gray-500" />
                </div>
                <p className="text-sm text-gray-500">Không thể tải ảnh</p>
              </div>
            </div>
          ) : (
            <motion.img
              src={src}
              alt={alt}
              onLoad={() => setIsLoaded(true)}
              onError={() => setHasError(true)}
              className={`transition-all duration-700 ${
                isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
              } ${className}`}
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: isLoaded ? 1 : 0 }}
              transition={{ duration: 0.6 }}
            />
          )}
        </>
      )}
    </div>
  );
};

// Enhanced Scroll to Top Button
const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [scrollPercentage, setScrollPercentage] = React.useState(0);

  React.useEffect(() => {
    const toggleVisibility = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const percentage = (scrollTop / docHeight) * 100;

      setIsVisible(scrollTop > 300);
      setScrollPercentage(percentage);
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
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          onClick={scrollToTop}
          className="fixed z-50 bottom-8 left-8 p-4 text-white transition-all duration-300 rounded-full shadow-2xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:shadow-3xl group"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <div className="relative">
            <ChevronUp className="w-6 h-6 group-hover:animate-bounce" />
            <div
              className="absolute inset-0 rounded-full bg-white/20 animate-ping"
              style={{ animationDelay: "1s" }}
            />
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

// Main BlogPost Component với enhanced design
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
  const [isLiked, setIsLiked] = React.useState(false);
  const [readingTime, setReadingTime] = React.useState(0);
  const [estimatedWordsRead, setEstimatedWordsRead] = React.useState(0);

  // Calculate reading time and progress
  React.useEffect(() => {
    if (post?.content) {
      const words = post.content.split(/\s+/).length;
      const time = Math.ceil(words / 200); // Average reading speed
      setReadingTime(time);
    }
  }, [post]);

  // Enhanced scroll tracking for reading progress
  React.useEffect(() => {
    const updateReadingProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;

      if (post?.content) {
        const totalWords = post.content.split(/\s+/).length;
        const wordsRead = Math.floor((progress / 100) * totalWords);
        setEstimatedWordsRead(wordsRead);
      }
    };

    window.addEventListener("scroll", updateReadingProgress);
    return () => window.removeEventListener("scroll", updateReadingProgress);
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

  // Handle post like
  const handlePostLike = () => {
    setIsLiked(!isLiked);
    toast({
      title: isLiked ? "💔 Đã bỏ thích bài viết" : "❤️ Đã thích bài viết",
      description: isLiked
        ? "Bài viết đã bị bỏ thích"
        : "Cảm ơn bạn đã thích bài viết này!",
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
        return `<h3 id="${id}" class="scroll-mt-24 text-2xl font-bold mb-6 mt-12 text-gray-900 dark:text-gray-100 border-l-4 border-blue-500 pl-4 bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-900/20 py-3 rounded-r-lg">${title}</h3>`;
      })
      .replace(/#{2}\s(.+)/g, (match, title) => {
        const id = title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");
        return `<h2 id="${id}" class="scroll-mt-24 text-3xl font-bold mb-8 mt-16 text-gray-900 dark:text-gray-100 border-l-4 border-purple-500 pl-4 bg-gradient-to-r from-purple-50 to-transparent dark:from-purple-900/20 py-4 rounded-r-lg">${title}</h2>`;
      })
      .replace(/#{1}\s(.+)/g, (match, title) => {
        const id = title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");
        return `<h1 id="${id}" class="scroll-mt-24 text-4xl font-bold mb-10 mt-20 text-gray-900 dark:text-gray-100 border-l-4 border-pink-500 pl-4 bg-gradient-to-r from-pink-50 to-transparent dark:from-pink-900/20 py-5 rounded-r-lg">${title}</h1>`;
      })
      .replace(
        /``````/g,
        '<div class="relative my-8 group"><pre class="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 p-6 rounded-xl overflow-x-auto border border-gray-700 shadow-2xl"><code class="language-$1 text-sm leading-relaxed">$2</code></pre><div class="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"><button class="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded-md transition-colors">Copy</button></div></div>',
      )
      .replace(
        /`([^`]+)`/g,
        '<code class="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 px-3 py-1 rounded-lg text-sm font-mono text-pink-600 dark:text-pink-400 border border-gray-200 dark:border-gray-600">$1</code>',
      )
      .replace(
        /\*\*(.+?)\*\*/g,
        '<strong class="font-bold text-gray-900 dark:text-gray-100 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">$1</strong>',
      )
      .replace(
        /\*(.+?)\*/g,
        '<em class="italic text-gray-700 dark:text-gray-300 font-medium">$1</em>',
      )
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline decoration-2 underline-offset-4 transition-all duration-300 font-medium hover:decoration-4 hover:decoration-blue-400">$1 <span class="inline-block ml-1 text-xs">↗</span></a>',
      )
      .replace(
        /^\* (.+)$/gm,
        "<li class=\"mb-3 text-gray-700 dark:text-gray-300 pl-2 relative before:content-['▸'] before:absolute before:left-0 before:text-blue-500 before:font-bold\">$1</li>",
      )
      .replace(
        /(\<li.*\<\/li\>)/s,
        '<ul class="space-y-2 my-6 pl-6 bg-gradient-to-r from-blue-50/50 to-transparent dark:from-blue-900/20 py-4 rounded-lg border-l-2 border-blue-200 dark:border-blue-700">$1</ul>',
      )
      .replace(
        /^> (.+)$/gm,
        '<blockquote class="border-l-4 border-gradient-to-b  pl-6 italic text-gray-600 dark:text-gray-400 my-8 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 p-6 rounded-r-xl shadow-lg">$1</blockquote>',
      )
      .replace(
        /\n\n/g,
        '</p><p class="mb-6 leading-relaxed text-gray-700 dark:text-gray-300 text-lg">',
      )
      .replace(
        /^/,
        '<p class="mb-6 leading-relaxed text-gray-700 dark:text-gray-300 text-lg">',
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

  // Loading state với enhanced design
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
        <div className="container px-4 py-8 mx-auto">
          <div className="flex items-center justify-center py-20">
            <motion.div className="text-center space-y-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 mx-auto border-4 rounded-full border-gradient-to-r from-blue-500 to-purple-600 border-t-transparent"
              />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                  Đang tải bài viết...
                </h2>
                <p className="text-muted-foreground mt-2">
                  Vui lòng chờ trong giây lát
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // Post not found với enhanced design
  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
        <div className="container px-4 py-8 mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg mx-auto mt-20"
          >
            <Card className="py-16 text-center border-0 shadow-2xl bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-slate-800 dark:via-slate-900 dark:to-blue-950">
              <CardContent>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mb-8"
                >
                  <div className="w-24 h-24 mx-auto bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center">
                    <Search className="w-12 h-12 text-gray-500" />
                  </div>
                </motion.div>
                <h2 className="mb-4 text-3xl font-bold text-transparent bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text">
                  Không tìm thấy bài viết
                </h2>
                <p className="mb-8 text-lg text-muted-foreground">
                  Bài viết bạn đang tìm không tồn tại hoặc đã bị xóa.
                </p>
                <Button
                  onClick={() => navigate("/blog")}
                  className="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-xl hover:shadow-2xl"
                  size="lg"
                >
                  <ArrowLeft className="w-5 h-5 mr-3 transition-transform group-hover:-translate-x-1" />
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
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.featured_image} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        <meta name="twitter:image" content={post.featured_image} />
        {structuredData && (
          <script type="application/ld+json">
            {JSON.stringify(structuredData)}
          </script>
        )}
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
        <ReadingProgress />
        <ScrollToTop />

        {/* Enhanced Floating Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {[Code, Palette, Coffee, Zap, Target, Lightbulb, Star, Award].map(
            (Icon, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  top: `${10 + i * 12}%`,
                  left: `${5 + i * 11}%`,
                  right: i % 2 === 0 ? `${5 + i * 9}%` : undefined,
                }}
                animate={{
                  y: [0, -30, 0],
                  rotate: [0, 360],
                  opacity: [0.1, 0.3, 0.1],
                }}
                transition={{
                  duration: 8 + i * 2,
                  repeat: Infinity,
                  delay: i * 1.2,
                  ease: "easeInOut",
                }}
              >
                <Icon className="w-6 h-6 text-blue-500/20" />
              </motion.div>
            ),
          )}
        </div>

        <div className="container relative z-10 px-4 py-8 mx-auto">
          {/* Enhanced Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Button
              variant="ghost"
              onClick={() => navigate("/blog")}
              className="group hover:bg-white/60 dark:hover:bg-slate-800/60 backdrop-blur-sm shadow-lg border border-white/20"
              size="lg"
            >
              <ArrowLeft className="w-5 h-5 mr-3 transition-transform group-hover:-translate-x-2" />
              Quay lại blog
              <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                →
              </div>
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 gap-12 mx-auto lg:grid-cols-4 max-w-7xl">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <motion.article
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-12"
              >
                {/* Enhanced Featured Image */}
                {post.featured_image && (
                  <motion.div
                    className="relative overflow-hidden shadow-2xl rounded-3xl group"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.4 }}
                  >
                    <LazyImage
                      src={post.featured_image}
                      alt={post.title}
                      className="object-cover w-full h-72 md:h-96"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* Floating Category Badge */}
                    <motion.div
                      className="absolute top-6 left-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Badge
                        className="font-semibold text-white shadow-xl backdrop-blur-sm border border-white/20"
                        style={{
                          backgroundColor: getCategoryColor(
                            post.blog_categories?.color || "blue",
                          ),
                        }}
                      >
                        <Hash className="w-4 h-4 mr-2" />
                        {post.blog_categories?.name || "Uncategorized"}
                      </Badge>
                    </motion.div>

                    {/* Reading Stats Overlay */}
                    <motion.div
                      className="absolute bottom-6 right-6 bg-black/50 backdrop-blur-md rounded-2xl p-4 text-white"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 }}
                    >
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{readingTime} phút đọc</span>
                        </div>
                        {post.views && (
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{post.views.toLocaleString()} lượt xem</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </motion.div>
                )}

                {/* Enhanced Article Header */}
                <motion.div
                  className="space-y-8"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  <h1 className="text-4xl font-extrabold leading-tight text-transparent md:text-6xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text">
                    {post.title}
                  </h1>

                  {post.excerpt && (
                    <motion.p
                      className="text-xl md:text-2xl leading-relaxed text-muted-foreground font-medium"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      {post.excerpt}
                    </motion.p>
                  )}

                  {/* Enhanced Article Meta */}
                  <motion.div
                    className="flex flex-wrap items-center gap-8 p-6 bg-gradient-to-r from-white/80 to-blue-50/80 dark:from-slate-800/80 dark:to-blue-900/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-lg text-foreground">
                          {post.author_name || "Admin"}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <Award className="w-4 h-4" />
                          Tác giả
                        </div>
                      </div>
                    </div>

                    <Separator orientation="vertical" className="h-12" />

                    <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span className="font-medium">
                          {new Date(
                            post.published_at || post.created_at,
                          ).toLocaleDateString("vi-VN")}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">
                          {readingTime} phút đọc
                        </span>
                      </div>

                      {post.views && (
                        <div className="flex items-center space-x-2">
                          <Eye className="w-4 h-4" />
                          <span className="font-medium">
                            {post.views.toLocaleString()} lượt xem
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {/* Enhanced Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <motion.div
                      className="flex flex-wrap gap-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      {post.tags.map((tag: string, index: number) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.8 + index * 0.1 }}
                          whileHover={{ scale: 1.05, y: -2 }}
                        >
                          <Badge
                            variant="outline"
                            className="px-4 py-2 text-sm font-medium transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white hover:shadow-lg hover:border-transparent"
                          >
                            <Hash className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {/* Enhanced Action Buttons */}
                  <motion.div
                    className="flex flex-wrap items-center gap-6 p-6 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-slate-800 dark:to-blue-900 rounded-2xl border border-gray-200 dark:border-gray-700"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-semibold text-muted-foreground">
                        Tương tác:
                      </span>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handlePostLike}
                        className={`transition-all duration-300 ${
                          isLiked
                            ? "bg-red-100 text-red-600 border-red-300 shadow-lg"
                            : "hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                        }`}
                      >
                        <Heart
                          className={`w-4 h-4 mr-2 ${isLiked ? "fill-current" : ""}`}
                        />
                        {isLiked ? "Đã thích" : "Thích"}
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleBookmark}
                        className={`transition-all duration-300 ${
                          isBookmarked
                            ? "bg-yellow-100 text-yellow-700 border-yellow-300 shadow-lg"
                            : "hover:bg-yellow-50 hover:text-yellow-700 hover:border-yellow-300"
                        }`}
                      >
                        <Bookmark
                          className={`w-4 h-4 mr-2 ${isBookmarked ? "fill-current" : ""}`}
                        />
                        {isBookmarked ? "Đã lưu" : "Lưu bài"}
                      </Button>
                    </div>

                    <Separator orientation="vertical" className="h-6" />

                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-semibold text-muted-foreground">
                        Chia sẻ:
                      </span>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleShare("facebook")}
                        className="transition-all duration-300 hover:bg-blue-600 hover:text-white hover:scale-105"
                      >
                        <Facebook className="w-4 h-4" />
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleShare("twitter")}
                        className="transition-all duration-300 hover:bg-sky-500 hover:text-white hover:scale-105"
                      >
                        <Twitter className="w-4 h-4" />
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleShare("linkedin")}
                        className="transition-all duration-300 hover:bg-blue-700 hover:text-white hover:scale-105"
                      >
                        <Linkedin className="w-4 h-4" />
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleShare("copy")}
                        className="transition-all duration-300 hover:bg-gray-600 hover:text-white hover:scale-105"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>

                    <Separator orientation="vertical" className="h-6" />

                    <div className="flex items-center space-x-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.print()}
                        className="transition-all duration-300 hover:bg-green-600 hover:text-white hover:scale-105"
                      >
                        <Printer className="w-4 h-4 mr-2" />
                        In bài
                      </Button>
                    </div>
                  </motion.div>
                </motion.div>

                <Separator className="my-12" />

                {/* Enhanced Article Content */}
                <motion.div
                  className="prose prose-xl dark:prose-invert max-w-none"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  <div
                    className="article-content"
                    dangerouslySetInnerHTML={{
                      __html: formatContent(post.content),
                    }}
                  />
                </motion.div>

                <Separator className="my-16" />

                {/* Enhanced Comments Section */}
                <motion.section
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="mt-20"
                >
                  <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 shadow-lg">
                        <MessageSquare className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-transparent bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text">
                          Bình luận
                        </h2>
                        <p className="text-muted-foreground mt-1">
                          {comments.length} bình luận • Tham gia thảo luận
                        </p>
                      </div>
                    </div>

                    <Button
                      onClick={() => setShowCommentForm(!showCommentForm)}
                      className="shadow-xl group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      size="lg"
                    >
                      <MessageSquare className="w-5 h-5 mr-3 group-hover:animate-bounce" />
                      {showCommentForm ? "Ẩn form bình luận" : "Viết bình luận"}
                    </Button>
                  </div>

                  {/* Enhanced Comment Form */}
                  <AnimatePresence>
                    {showCommentForm && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-12"
                      >
                        <Card className="border-0 shadow-2xl bg-gradient-to-br from-white via-blue-50 to-purple-50 dark:from-slate-800 dark:via-blue-900 dark:to-purple-900">
                          <div className="p-8">
                            <div className="flex items-center mb-8 space-x-4">
                              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
                                <Quote className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h3 className="text-2xl font-bold">
                                  Để lại bình luận của bạn
                                </h3>
                                <p className="text-muted-foreground">
                                  Chia sẻ suy nghĩ và góp ý của bạn về bài viết
                                </p>
                              </div>
                            </div>

                            <div className="space-y-6">
                              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <motion.div whileFocus={{ scale: 1.02 }}>
                                  <label className="block text-sm font-medium mb-2">
                                    Tên của bạn *
                                  </label>
                                  <Input
                                    placeholder="Nhập tên của bạn"
                                    value={commentName}
                                    onChange={(e) =>
                                      setCommentName(e.target.value)
                                    }
                                    className="h-12 transition-all duration-300 focus:ring-2 focus:ring-primary/20 border-2"
                                  />
                                </motion.div>
                                <motion.div whileFocus={{ scale: 1.02 }}>
                                  <label className="block text-sm font-medium mb-2">
                                    URL ảnh đại diện
                                  </label>
                                  <Input
                                    placeholder="https://... (tùy chọn)"
                                    value={commentAvatar}
                                    onChange={(e) =>
                                      setCommentAvatar(e.target.value)
                                    }
                                    className="h-12 transition-all duration-300 focus:ring-2 focus:ring-primary/20 border-2"
                                  />
                                </motion.div>
                              </div>

                              <motion.div whileFocus={{ scale: 1.01 }}>
                                <label className="block text-sm font-medium mb-2">
                                  Nội dung bình luận *
                                </label>
                                <Textarea
                                  placeholder="Chia sẻ suy nghĩ của bạn về bài viết này..."
                                  value={commentContent}
                                  onChange={(e) =>
                                    setCommentContent(e.target.value)
                                  }
                                  rows={6}
                                  className="transition-all duration-300 resize-none focus:ring-2 focus:ring-primary/20 border-2"
                                />
                              </motion.div>

                              <div className="flex items-center justify-between pt-4 border-t">
                                <div className="text-sm text-muted-foreground">
                                  <span className="text-red-500 font-bold">
                                    *
                                  </span>{" "}
                                  Các trường bắt buộc
                                </div>
                                <motion.div
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Button
                                    onClick={handleCommentSubmit}
                                    disabled={commentLoading}
                                    className="shadow-xl bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                                    size="lg"
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
                                          className="w-5 h-5 mr-3 border-2 border-white rounded-full border-t-transparent"
                                        />
                                        Đang gửi bình luận...
                                      </>
                                    ) : (
                                      <>
                                        <Send className="w-5 h-5 mr-3" />
                                        Gửi bình luận
                                      </>
                                    )}
                                  </Button>
                                </motion.div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Enhanced Comments List */}
                  <div className="space-y-8">
                    <AnimatePresence>
                      {comments.length > 0 ? (
                        comments.map((comment, index) => (
                          <motion.div
                            key={comment.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            whileHover={{ scale: 1.01, y: -2 }}
                            className="group"
                          >
                            <Card className="transition-all duration-500 border-0 shadow-xl bg-gradient-to-r from-white via-gray-50 to-blue-50 dark:from-slate-800 dark:via-slate-900 dark:to-blue-950 hover:shadow-2xl">
                              <div className="p-8">
                                <div className="flex items-start space-x-6">
                                  <motion.img
                                    src={
                                      comment.author_avatar ||
                                      `https://i.pravatar.cc/100?u=${comment.author_name}`
                                    }
                                    alt={comment.author_name}
                                    className="object-cover w-16 h-16 rounded-full ring-4 ring-primary/20 shadow-lg"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                  />
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between mb-4">
                                      <div>
                                        <div className="text-xl font-bold">
                                          {comment.author_name}
                                        </div>
                                        <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                                          <Calendar className="w-4 h-4" />
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
                                        <MoreHorizontal className="w-5 h-5" />
                                      </Button>
                                    </div>

                                    <p className="mb-6 leading-relaxed text-foreground text-lg">
                                      {comment.content}
                                    </p>

                                    <div className="flex items-center space-x-6">
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
                                            className={`w-5 h-5 mr-2 ${
                                              likedComments.has(comment.id)
                                                ? "fill-current"
                                                : ""
                                            }`}
                                          />
                                        </motion.div>
                                        <span className="font-medium">
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
                                        <Reply className="w-5 h-5 mr-2" />
                                        Trả lời
                                      </Button>

                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="transition-colors hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                                      >
                                        <Share2 className="w-5 h-5 mr-2" />
                                        Chia sẻ
                                      </Button>
                                    </div>
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
                          <Card className="py-20 text-center border-0 shadow-2xl bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-slate-800 dark:via-slate-900 dark:to-blue-950">
                            <CardContent>
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                  delay: 0.2,
                                  type: "spring",
                                  stiffness: 200,
                                }}
                                className="mb-8"
                              >
                                <div className="w-24 h-24 mx-auto bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center">
                                  <MessageSquare className="w-12 h-12 text-gray-500" />
                                </div>
                              </motion.div>
                              <h3 className="mb-4 text-2xl font-bold">
                                Chưa có bình luận nào
                              </h3>
                              <p className="mb-8 text-lg text-muted-foreground">
                                Hãy là người đầu tiên chia sẻ suy nghĩ về bài
                                viết này!
                              </p>
                              <Button
                                onClick={() => setShowCommentForm(true)}
                                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-xl"
                                size="lg"
                              >
                                <MessageSquare className="w-5 h-5 mr-3" />
                                Viết bình luận đầu tiên
                              </Button>
                            </CardContent>
                          </Card>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.section>

                {/* Enhanced Author Info */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="mt-20"
                >
                  <Card className="border-0 shadow-2xl bg-gradient-to-br from-white via-purple-50 to-blue-50 dark:from-slate-800 dark:via-purple-900 dark:to-blue-950">
                    <CardContent className="p-8">
                      <div className="flex items-start space-x-6">
                        <div className="flex items-center justify-center w-20 h-20 rounded-full shadow-xl bg-gradient-to-r from-blue-500 to-purple-600">
                          <User className="w-10 h-10 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center mb-4 space-x-3">
                            <h3 className="text-2xl font-bold">
                              {post.author_name || "Admin"}
                            </h3>
                            <Badge className="text-yellow-800 bg-yellow-100 border-yellow-300">
                              <Award className="w-4 h-4 mr-2" />
                              Tác giả
                            </Badge>
                          </div>
                          <p className="mb-6 text-lg text-muted-foreground leading-relaxed">
                            Tác giả của bài viết này. Chuyên gia trong lĩnh vực
                            công nghệ và thiết kế với nhiều năm kinh nghiệm.
                          </p>
                          <div className="flex space-x-4">
                            <Button
                              variant="outline"
                              size="lg"
                              className="group"
                            >
                              <User className="w-5 h-5 mr-3 group-hover:animate-pulse" />
                              Xem profile
                            </Button>
                            <Button
                              variant="outline"
                              size="lg"
                              className="group"
                            >
                              <MessageSquare className="w-5 h-5 mr-3 group-hover:animate-bounce" />
                              Liên hệ tác giả
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.article>
            </div>

            {/* Enhanced Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-8 sticky top-24">
                <TableOfContents content={post?.content || ""} />

                {/* Enhanced Quick Actions */}
                <Card className="border-0 shadow-2xl bg-gradient-to-br from-white via-green-50 to-blue-50 dark:from-slate-800 dark:via-green-900 dark:to-blue-900">
                  <div className="p-6">
                    <div className="flex items-center mb-6 space-x-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-blue-600 shadow-lg">
                        <Zap className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-transparent bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text">
                          Thao tác nhanh
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Các tính năng hữu ích
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <Button
                        variant="outline"
                        size="lg"
                        className="justify-start w-full group hover:bg-yellow-50 hover:border-yellow-300"
                        onClick={handleBookmark}
                      >
                        <Bookmark
                          className={`w-5 h-5 mr-3 group-hover:animate-bounce ${isBookmarked ? "fill-current text-yellow-600" : ""}`}
                        />
                        {isBookmarked ? "Đã lưu bài viết" : "Lưu bài viết"}
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        className="justify-start w-full group hover:bg-blue-50 hover:border-blue-300"
                        onClick={() => handleShare("copy")}
                      >
                        <Share2 className="w-5 h-5 mr-3 group-hover:animate-pulse" />
                        Chia sẻ bài viết
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        className="justify-start w-full group hover:bg-green-50 hover:border-green-300"
                        onClick={() => window.print()}
                      >
                        <Printer className="w-5 h-5 mr-3 group-hover:animate-pulse" />
                        In bài viết
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Enhanced Reading Stats */}
                <Card className="border-0 shadow-2xl bg-gradient-to-br from-white via-orange-50 to-red-50 dark:from-slate-800 dark:via-orange-900 dark:to-red-900">
                  <div className="p-6">
                    <div className="flex items-center mb-6 space-x-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 shadow-lg">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-transparent bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text">
                          Thống kê bài viết
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Theo dõi tiến trình đọc
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Thời gian đọc
                        </span>
                        <span className="font-medium">{readingTime} phút</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Đã đọc khoảng
                        </span>
                        <span className="font-medium">
                          {estimatedWordsRead} từ
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Bình luận
                        </span>
                        <span className="font-medium">{comments.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Lượt xem
                        </span>
                        <span className="font-medium">{post.views || 0}</span>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Related Posts: có thể thêm vào đây nếu muốn nâng cấp */}
                {/* ... */}
              </div>
            </div>
          </div>
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
