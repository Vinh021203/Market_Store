import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { getPostBySlug } from "@/lib/blog";
import { getCommentsByPostId } from "@/lib/comments";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
  ThumbsUp,
  MoreHorizontal,
  ChevronUp,
  Bookmark,
  Printer,
  Search,
  TrendingUp,
  Star,
  Zap,
  Target,
  Globe,
  Award,
  Hash,
  ExternalLink,
  Lightbulb,
  Code,
  Palette,
  Coffee,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Interfaces
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

interface BlogPostData {
  id: string;
  title: string;
  excerpt?: string;
  content: string;
  slug: string;
  featured_image?: string;
  published_at?: string;
  created_at: string;
  updated_at?: string;
  views?: number;
  likes?: number;
  tags?: string[];
  author_name?: string;
  author_avatar?: string;
  meta_description?: string;
  category_id?: string;
  blog_categories?: {
    name: string;
    color: string;
  };
}

// ✅ Color scheme constants
const sectionBackgrounds = {
  hero: "from-white via-pink-25 to-rose-25",
  stats: "from-pink-25 via-rose-25 to-red-25",
  categories: "from-rose-25 via-pink-25 to-white",
  features: "from-red-25 via-rose-25 to-pink-25",
  process: "from-pink-50 via-rose-50 to-red-50",
  products: "from-rose-50 via-pink-50 to-white",
  testimonials: "from-red-50 via-rose-50 to-pink-50",
  newsletter: "from-pink-75 via-rose-75 to-red-75",
};

const unifiedColorScheme = {
  button: "from-pink-300 via-rose-300 to-red-300",
  buttonHover: "from-pink-400 via-rose-400 to-red-400",
  textMain: "from-pink-400 via-rose-400 to-red-400",
  textSecondary: "from-pink-500 via-rose-500 to-red-500",
  iconBg: "from-pink-25 to-rose-50",
  iconText: "text-pink-400",
  cardBg: "from-white/95 via-pink-50/80 to-rose-50/85",
};

// Reading Progress Component
const ReadingProgress: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progressValue = Math.min((scrollTop / docHeight) * 100, 100);
      setProgress(progressValue);
    };

    window.addEventListener("scroll", updateProgress);
    updateProgress();
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <>
      <motion.div
        className={`fixed top-0 left-0 z-50 h-1 shadow-2xl bg-gradient-to-r ${unifiedColorScheme.button}`}
        style={{ width: `${progress}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.1 }}
      />

      <motion.div
        className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-lg rounded-full shadow-xl border border-white/20"
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
              className="text-gray-200"
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
              className="text-pink-500 transition-all duration-300"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-semibold text-pink-600">
              {Math.round(progress)}%
            </span>
          </div>
        </div>
        <span className="text-sm font-medium text-gray-700">Đã đọc</span>
      </motion.div>
    </>
  );
};

// Table of Contents Component
const TableOfContents: React.FC<{ content: string }> = ({ content }) => {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    const extractedHeadings: Heading[] = [];
    const lines = content.split("\n");

    lines.forEach((line) => {
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

  useEffect(() => {
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
      <Card
        className={`border-0 shadow-2xl bg-gradient-to-br ${unifiedColorScheme.cardBg} backdrop-blur-xl`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r ${unifiedColorScheme.button} shadow-lg`}
              >
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3
                  className={`font-bold text-lg text-transparent bg-gradient-to-r ${unifiedColorScheme.textMain} bg-clip-text`}
                >
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
                        ? "text-pink-600"
                        : "text-gray-600 hover:text-pink-600"
                    }`}
                  >
                    <div
                      className={`absolute left-0 w-1 rounded-full transition-all duration-300 ${
                        activeId === heading.id
                          ? `h-full bg-gradient-to-b ${unifiedColorScheme.button}`
                          : "h-0 bg-gray-300 group-hover:h-full group-hover:bg-pink-400"
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

// Lazy Image Component
const LazyImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
}> = ({ src, alt, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
            <div
              className={`absolute inset-0 bg-gradient-to-r ${unifiedColorScheme.iconBg} animate-pulse rounded-lg`}
            />
          )}
          {hasError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-300 rounded-full flex items-center justify-center">
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
              } ${className || ""}`}
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

// ✅ MOBILE-OPTIMIZED Scroll to Top Component - CHATBOT AWARE
const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
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
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          onClick={scrollToTop}
          className={`
            fixed z-40 transition-all duration-300 rounded-full shadow-2xl
            bg-gradient-to-r ${unifiedColorScheme.button} hover:${unifiedColorScheme.buttonHover}
            text-white hover:shadow-3xl group
            
            /* 🎯 CHATBOT-AWARE POSITIONING */
            /* Mobile: Higher up để tránh chatbot */
            bottom-20 right-4 p-3
            
            /* Tablet: Cao hơn nữa */  
            sm:bottom-24 sm:right-6 sm:p-3.5
            
            /* Desktop: Rất cao để tránh chatbot */
            md:bottom-32 md:right-8 md:p-4
          `}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronUp className="w-5 h-5 md:w-6 md:h-6 group-hover:animate-bounce" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

// Main BlogPost Component
const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostData[]>([]);

  // Additional states
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [readingTime, setReadingTime] = useState(0);
  const [estimatedWordsRead, setEstimatedWordsRead] = useState(0);
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());

  // Calculate reading time and progress
  useEffect(() => {
    if (post?.content) {
      const words = post.content.split(/\s+/).length;
      const time = Math.ceil(words / 200);
      setReadingTime(time);
    }
  }, [post]);

  // Enhanced scroll tracking for reading progress
  useEffect(() => {
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

  // Fetch comments (READ ONLY - no form)
  useEffect(() => {
    if (!post?.id) return;
    getCommentsByPostId(post.id).then(setComments);
  }, [post]);

  // Fetch related posts
  useEffect(() => {
    const fetchRelatedPosts = async () => {
      if (!post?.category_id) return;

      try {
        const { data, error } = await supabase
          .from("blog_posts")
          .select("*, blog_categories(name, color)")
          .eq("category_id", post.category_id)
          .eq("is_published", true)
          .neq("id", post.id)
          .limit(3);

        if (error) throw error;
        setRelatedPosts(data || []);
      } catch (error) {
        console.error("Error fetching related posts:", error);
      }
    };

    fetchRelatedPosts();
  }, [post]);

  // ✅ FIXED Load main post - Handle missing created_at
  useEffect(() => {
    const loadPost = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const result = await getPostBySlug(slug);

        if (result) {
          // ✅ Transform to ensure created_at exists - FIX TypeScript issues
          const transformedPost: BlogPostData = {
            ...result,
            created_at:
              (result as any).created_at ||
              (result as any).published_at ||
              new Date().toISOString(),
            id: result.id || Math.random().toString(),
            title: result.title || "Untitled",
            content: result.content || "",
            slug: result.slug || slug,
          };

          setPost(transformedPost);

          // Update view count
          if (transformedPost.id) {
            await supabase
              .from("blog_posts")
              .update({ views: (transformedPost.views || 0) + 1 })
              .eq("id", transformedPost.id);
          }
        }
      } catch (error) {
        console.error("Error loading post:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  // Handle comment like (READ ONLY)
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
    const title = post?.title || "";

    if (platform === "copy") {
      try {
        await navigator.clipboard.writeText(url);
        toast({
          title: "📋 Đã sao chép",
          description: "Link bài viết đã được sao chép.",
        });
      } catch (error) {
        console.error("Copy failed:", error);
      }
      return;
    }

    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    };

    if (platform && shareUrls[platform]) {
      window.open(shareUrls[platform], "_blank");
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
        return `<h3 id="${id}" class="scroll-mt-24 text-2xl font-bold mb-6 mt-12 text-gray-900 border-l-4 border-pink-500 pl-4 bg-gradient-to-r from-pink-50 to-transparent py-3 rounded-r-lg">${title}</h3>`;
      })
      .replace(/#{2}\s(.+)/g, (match, title) => {
        const id = title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");
        return `<h2 id="${id}" class="scroll-mt-24 text-3xl font-bold mb-8 mt-16 text-gray-900 border-l-4 border-rose-500 pl-4 bg-gradient-to-r from-rose-50 to-transparent py-4 rounded-r-lg">${title}</h2>`;
      })
      .replace(/#{1}\s(.+)/g, (match, title) => {
        const id = title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");
        return `<h1 id="${id}" class="scroll-mt-24 text-4xl font-bold mb-10 mt-20 text-gray-900 border-l-4 border-red-500 pl-4 bg-gradient-to-r from-red-50 to-transparent py-5 rounded-r-lg">${title}</h1>`;
      })
      .replace(
        /``````/g,
        '<div class="relative my-8 group"><pre class="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 p-6 rounded-xl overflow-x-auto border border-gray-700 shadow-2xl"><code class="language-$1 text-sm leading-relaxed">$2</code></pre></div>',
      )
      .replace(
        /`([^`]+)`/g,
        '<code class="bg-gradient-to-r from-pink-100 to-rose-200 px-3 py-1 rounded-lg text-sm font-mono text-pink-600 border border-pink-200">$1</code>',
      )
      .replace(
        /\*\*(.+?)\*\*/g,
        '<strong class="font-bold text-gray-900 bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">$1</strong>',
      )
      .replace(
        /\*(.+?)\*/g,
        '<em class="italic text-gray-700 font-medium">$1</em>',
      )
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-pink-600 hover:text-pink-800 underline decoration-2 underline-offset-4 transition-all duration-300 font-medium hover:decoration-4 hover:decoration-pink-400">$1 <span class="inline-block ml-1 text-xs">↗</span></a>',
      )
      .replace(
        /^\* (.+)$/gm,
        "<li class=\"mb-3 text-gray-700 pl-2 relative before:content-['▸'] before:absolute before:left-0 before:text-pink-500 before:font-bold\">$1</li>",
      )
      .replace(
        /^> (.+)$/gm,
        '<blockquote class="border-l-4 border-gradient-to-b pl-6 italic text-gray-600 my-8 bg-gradient-to-r from-pink-50 via-rose-50 to-red-50 p-6 rounded-r-xl shadow-lg">$1</blockquote>',
      )
      .replace(
        /\n\n/g,
        '</p><p class="mb-6 leading-relaxed text-gray-700 text-lg">',
      )
      .replace(/^/, '<p class="mb-6 leading-relaxed text-gray-700 text-lg">')
      .replace(/$/, "</p>");
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
    return colors[color] || colors.pink;
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
          name: "Template Market Blog",
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
      <div
        className={`min-h-screen bg-gradient-to-br ${sectionBackgrounds.hero}`}
      >
        <div className="container px-4 py-8 mx-auto">
          <div className="flex items-center justify-center py-20">
            <motion.div className="text-center space-y-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 mx-auto border-4 rounded-full border-pink-400 border-t-transparent"
              />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2
                  className={`text-2xl font-bold text-transparent bg-gradient-to-r ${unifiedColorScheme.textMain} bg-clip-text`}
                >
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

  // Post not found
  if (!post) {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br ${sectionBackgrounds.hero}`}
      >
        <div className="container px-4 py-8 mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-lg mx-auto mt-20"
          >
            <Card
              className={`py-16 text-center border-0 shadow-2xl bg-gradient-to-br ${unifiedColorScheme.cardBg}`}
            >
              <CardContent>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mb-8"
                >
                  <div className="w-24 h-24 mx-auto bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
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
                  className={`group bg-gradient-to-r ${unifiedColorScheme.button} hover:${unifiedColorScheme.buttonHover} shadow-xl hover:shadow-2xl text-white`}
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
      <Helmet>
        <title>{post.title} | Template Market Blog</title>
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

      <div
        className={`min-h-screen bg-gradient-to-br ${sectionBackgrounds.hero}`}
      >
        <ReadingProgress />
        <ScrollToTop />

        {/* Floating Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          {[
            {
              emoji: "📖",
              color: "from-pink-50 to-rose-100",
              position: "top-10 right-20",
            },
            {
              emoji: "✍️",
              color: "from-rose-50 to-red-100",
              position: "top-32 left-10",
            },
            {
              emoji: "💭",
              color: "from-red-50 to-pink-100",
              position: "bottom-20 right-10",
            },
            {
              emoji: "💡",
              color: "from-pink-100 to-rose-50",
              position: "bottom-32 left-20",
            },
            {
              emoji: "⭐",
              color: "from-rose-100 to-pink-50",
              position: "top-1/2 right-1/4",
            },
            {
              emoji: "🎯",
              color: "from-red-50 to-rose-100",
              position: "top-1/3 left-1/3",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              className={`absolute ${item.position} text-4xl opacity-5`}
              animate={{
                y: [0, -30, 0],
                rotate: [0, 15, -15, 0],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 10 + i * 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5,
              }}
            >
              <motion.div
                className={`p-4 rounded-full bg-gradient-to-r ${item.color} backdrop-blur-sm shadow-lg`}
                whileHover={{ scale: 1.5, rotate: 30 }}
              >
                <span>{item.emoji}</span>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Floating Tech Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
                <Icon className="w-6 h-6 text-pink-500/20" />
              </motion.div>
            ),
          )}
        </div>

        <div className="container relative z-10 px-4 py-8 mx-auto">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Button
              variant="ghost"
              onClick={() => navigate("/blog")}
              className="group hover:bg-white/60 backdrop-blur-sm shadow-lg border border-white/20"
              size="lg"
            >
              <ArrowLeft className="w-5 h-5 mr-3 transition-transform group-hover:-translate-x-2" />
              Quay lại blog
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
                {/* Featured Image */}
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

                    {/* Category Badge */}
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
                            post.blog_categories?.color || "pink",
                          ),
                        }}
                      >
                        <Hash className="w-4 h-4 mr-2" />
                        {post.blog_categories?.name || "Uncategorized"}
                      </Badge>
                    </motion.div>

                    {/* Reading Stats */}
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

                {/* Article Header */}
                <motion.div
                  className="space-y-8"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  <h1
                    className={`text-4xl font-extrabold leading-tight md:text-6xl text-transparent bg-gradient-to-r ${unifiedColorScheme.textMain} bg-clip-text`}
                  >
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

                  {/* Article Meta */}
                  <motion.div
                    className={`flex flex-wrap items-center gap-8 p-6 bg-gradient-to-r ${unifiedColorScheme.cardBg} backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r ${unifiedColorScheme.button} shadow-lg`}
                      >
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

                  {/* Tags */}
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
                            className={`px-4 py-2 text-sm font-medium transition-all duration-300 hover:bg-gradient-to-r hover:${unifiedColorScheme.button} hover:text-white hover:shadow-lg hover:border-transparent`}
                          >
                            <Hash className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {/* Action Buttons */}
                  <motion.div
                    className={`flex flex-wrap items-center gap-6 p-6 bg-gradient-to-r ${sectionBackgrounds.stats} rounded-2xl border border-pink-200`}
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

                {/* Article Content */}
                <motion.div
                  className="prose prose-xl max-w-none"
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

                {/* Comments Section - READ ONLY */}
                <motion.section
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="mt-20"
                >
                  <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${unifiedColorScheme.button} shadow-lg`}
                      >
                        <MessageSquare className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2
                          className={`text-3xl font-bold text-transparent bg-gradient-to-r ${unifiedColorScheme.textMain} bg-clip-text`}
                        >
                          Bình luận
                        </h2>
                        <p className="text-muted-foreground mt-1">
                          {comments.length} bình luận từ độc giả
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Comments List */}
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
                            <Card
                              className={`transition-all duration-500 border-0 shadow-xl bg-gradient-to-r ${unifiedColorScheme.cardBg} hover:shadow-2xl`}
                            >
                              <div className="p-8">
                                <div className="flex items-start space-x-6">
                                  <motion.img
                                    src={
                                      comment.author_avatar ||
                                      `https://i.pravatar.cc/100?u=${comment.author_name}`
                                    }
                                    alt={comment.author_name}
                                    className="object-cover w-16 h-16 rounded-full ring-4 ring-pink-200 shadow-lg"
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
                                            ? "text-red-500 bg-red-50"
                                            : "hover:text-red-500 hover:bg-red-50"
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
                                        className="transition-colors hover:text-pink-500 hover:bg-pink-50"
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
                          <Card
                            className={`py-20 text-center border-0 shadow-2xl bg-gradient-to-br ${unifiedColorScheme.cardBg}`}
                          >
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
                                <div
                                  className={`w-24 h-24 mx-auto bg-gradient-to-r ${unifiedColorScheme.iconBg} rounded-full flex items-center justify-center`}
                                >
                                  <MessageSquare className="w-12 h-12 text-pink-500" />
                                </div>
                              </motion.div>
                              <h3 className="mb-4 text-2xl font-bold">
                                Chưa có bình luận nào
                              </h3>
                              <p className="text-lg text-muted-foreground">
                                Bài viết này chưa có bình luận từ độc giả.
                              </p>
                            </CardContent>
                          </Card>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.section>

                {/* ✅ MOBILE-OPTIMIZED Author Info */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="mt-8 sm:mt-16 md:mt-20"
                >
                  <Card
                    className={`border-0 shadow-lg sm:shadow-xl md:shadow-2xl bg-gradient-to-br ${unifiedColorScheme.cardBg}`}
                  >
                    <CardContent className="p-4 sm:p-6 md:p-8">
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        {/* Responsive Avatar */}
                        <div
                          className={`flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full shadow-lg bg-gradient-to-r ${unifiedColorScheme.button} flex-shrink-0`}
                        >
                          <User className="w-5 h-5 sm:w-7 sm:h-7 md:w-10 md:h-10 text-white" />
                        </div>

                        {/* Responsive Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0 pr-2">
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="text-base sm:text-lg md:text-2xl font-bold truncate">
                                  {post.author_name || "Admin"}
                                </h3>
                                <Badge className="text-xs bg-yellow-100 text-yellow-800 border-yellow-300">
                                  <Award className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 mr-1" />
                                  <span className="hidden sm:inline">
                                    Tác giả
                                  </span>
                                  <span className="sm:hidden">Author</span>
                                </Badge>
                              </div>

                              <p className="text-xs sm:text-sm md:text-lg text-muted-foreground">
                                <span className="block sm:hidden">
                                  Chuyên gia công nghệ
                                </span>
                                <span className="hidden sm:block md:hidden">
                                  Chuyên gia công nghệ và thiết kế
                                </span>
                                <span className="hidden md:block">
                                  Tác giả của bài viết này. Chuyên gia trong
                                  lĩnh vực công nghệ và thiết kế với nhiều năm
                                  kinh nghiệm.
                                </span>
                              </p>
                            </div>

                            {/* Single Action Button */}
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-2 flex-shrink-0"
                            >
                              <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                              <span className="hidden sm:inline">
                                Xem profile
                              </span>
                              <span className="sm:hidden">View</span>
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
              <div className="space-y-8 sticky top-24">
                <TableOfContents content={post?.content || ""} />

                {/* Quick Actions */}
                <Card
                  className={`border-0 shadow-2xl bg-gradient-to-br ${unifiedColorScheme.cardBg}`}
                >
                  <div className="p-6">
                    <div className="flex items-center mb-6 space-x-3">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r ${unifiedColorScheme.button} shadow-lg`}
                      >
                        <Zap className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3
                          className={`font-bold text-lg text-transparent bg-gradient-to-r ${unifiedColorScheme.textMain} bg-clip-text`}
                        >
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
                        className="justify-start w-full group hover:bg-pink-50 hover:border-pink-300"
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

                {/* Reading Stats */}
                <Card className="border-0 shadow-2xl bg-gradient-to-br from-white via-pink-50 to-rose-50">
                  <div className="p-6">
                    <div className="flex items-center mb-6 space-x-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-pink-400 to-rose-500 shadow-lg">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-transparent bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogPost;
