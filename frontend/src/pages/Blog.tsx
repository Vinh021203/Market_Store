import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { getAllPublishedPosts, getAllCategories } from "@/lib/blog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Calendar,
  Clock,
  Eye,
  Heart,
  User,
  BookOpen,
  TrendingUp,
  Filter,
  Grid,
  List,
  ArrowRight,
  Sparkles,
  Star,
  MessageCircle,
  Share2,
  Bookmark,
  Tag,
  ChevronRight,
  Coffee,
  Code,
  Palette,
  Zap,
  Award,
  Globe,
} from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  featuredImage: string;
  publishedAt: string;
  readTime: number;
  views: number;
  likes: number;
  tags: string[];
  isFeatured: boolean;
  category: {
    id: string;
    name: string;
    color: string;
  };
  author: {
    id: string;
    name: string;
    avatar?: string;
    bio?: string;
  };
}

interface Category {
  id: string;
  name: string;
  color: string;
  count?: number;
}

const Blog: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [postsData, categoriesData] = await Promise.all([
          getAllPublishedPosts(),
          getAllCategories(),
        ]);
        setPosts(postsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error loading blog data:", error);
      } finally {
        setLoading(false);
      }
    };

    load();

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }));
          }
        });
      },
      { threshold: 0.1 },
    );

    const sections = document.querySelectorAll("[data-animate]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const filteredPosts = useMemo(() => {
    let filtered = [...posts];

    if (searchQuery) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.tags.some((tag: string) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (post) => post.category?.id === selectedCategory,
      );
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.publishedAt).getTime() -
            new Date(b.publishedAt).getTime()
          );
        case "popular":
          return b.views - a.views;
        case "liked":
          return b.likes - a.likes;
        default:
          return 0;
      }
    });

    return filtered;
  }, [posts, searchQuery, selectedCategory, sortBy]);

  const featuredPosts = posts.filter((post) => post.isFeatured);

  const stats = [
    { label: "Tổng bài viết", value: posts.length, icon: BookOpen },
    {
      label: "Lượt xem",
      value: posts.reduce((sum, post) => sum + post.views, 0),
      icon: Eye,
    },
    {
      label: "Lượt thích",
      value: posts.reduce((sum, post) => sum + post.likes, 0),
      icon: Heart,
    },
    { label: "Danh mục", value: categories.length, icon: Tag },
  ];

  const getCategoryColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: "#3b82f6",
      purple: "#8b5cf6",
      green: "#10b981",
      orange: "#f59e0b",
      red: "#ef4444",
      pink: "#ec4899",
      cyan: "#06b6d4",
      yellow: "#eab308",
    };
    return colors[color] || colors.blue;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
        <div className="container px-4 py-20 mx-auto">
          <div className="space-y-4 text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 mx-auto border-4 rounded-full border-primary border-t-transparent"
            />
            <p className="text-muted-foreground">Đang tải bài viết...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
      {/* ✅ Enhanced Hero Section */}
      <section className="relative px-4 py-20 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute bg-blue-300 rounded-full top-10 left-10 w-72 h-72 mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute bg-purple-300 rounded-full top-40 right-20 w-72 h-72 mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
          <div className="absolute bg-pink-300 rounded-full bottom-20 left-1/2 w-72 h-72 mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-4000"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 animate-float">
            <BookOpen className="w-8 h-8 text-blue-500 opacity-60" />
          </div>
          <div className="absolute top-1/3 right-1/4 animate-float-delay-1">
            <Code className="w-6 h-6 text-purple-500 opacity-60" />
          </div>
          <div className="absolute bottom-1/4 left-1/3 animate-float-delay-2">
            <Coffee className="text-orange-500 w-7 h-7 opacity-60" />
          </div>
        </div>

        <div className="container relative z-10 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto space-y-8 text-center"
          >
            <Badge
              variant="outline"
              className="mb-6 border-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur"
            >
              <BookOpen className="w-3 h-3 mr-1" />
              Blog & Tutorials
              <Sparkles className="w-3 h-3 ml-1 animate-pulse" />
            </Badge>

            <h1 className="text-4xl font-bold leading-tight text-transparent md:text-6xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text">
              Kiến thức & Cảm hứng
              <br />
              <span className="text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text">
                cho Developers
              </span>
            </h1>

            <p className="max-w-3xl mx-auto text-xl md:text-2xl text-muted-foreground">
              Khám phá những bài viết chất lượng về{" "}
              <span className="font-semibold text-blue-600">công nghệ</span>,
              <span className="font-semibold text-purple-600"> thiết kế</span>{" "}
              và xu hướng mới nhất trong ngành
            </p>

            {/* Quick Stats */}
            <motion.div
              className="grid max-w-2xl grid-cols-2 gap-6 mx-auto md:grid-cols-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {formatNumber(stat.value)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="container px-4 pb-16 mx-auto">
        {/* ✅ Enhanced Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="mb-16" id="featured" data-animate>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-center justify-between mb-8 transition-all duration-800 ${
                isVisible.featured
                  ? "animate-in slide-in-from-bottom"
                  : "opacity-0"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-red-500">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text">
                    Bài viết nổi bật
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Những bài viết được yêu thích nhất
                  </p>
                </div>
              </div>
              <Badge
                variant="secondary"
                className="text-orange-800 bg-orange-100"
              >
                <Star className="w-3 h-3 mr-1" />
                {featuredPosts.length} bài viết
              </Badge>
            </motion.div>

            <div className="grid gap-6 mb-12 md:grid-cols-2 lg:grid-cols-3">
              {featuredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className={`transition-all duration-500 ${
                    isVisible.featured
                      ? "animate-in slide-in-from-bottom"
                      : "opacity-0"
                  }`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <Card className="h-full overflow-hidden transition-all duration-300 border-0 hover:shadow-2xl group bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900">
                    <div className="relative overflow-hidden">
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="object-cover w-full h-48 transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-black/50 to-transparent group-hover:opacity-100"></div>

                      <div className="absolute top-4 left-4">
                        <Badge
                          style={{
                            backgroundColor: getCategoryColor(
                              post.category.color,
                            ),
                            color: "white",
                          }}
                          className="shadow-lg"
                        >
                          {post.category.name}
                        </Badge>
                      </div>

                      <div className="absolute top-4 right-4">
                        <Badge className="text-white shadow-lg bg-gradient-to-r from-yellow-400 to-orange-500">
                          <Star className="w-3 h-3 mr-1" />
                          Nổi bật
                        </Badge>
                      </div>

                      {/* ✅ Enhanced Hover Actions với proper handlers */}
                      <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            className="bg-white/90 backdrop-blur"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              // ✅ Navigate to post
                              window.location.href = `/blog/${post.slug}`;
                            }}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Đọc
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="bg-white/90 backdrop-blur"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              // ✅ Handle bookmark
                              console.log("Bookmark clicked");
                            }}
                          >
                            <Bookmark className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="bg-white/90 backdrop-blur"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              // ✅ Handle share
                              console.log("Share clicked");
                            }}
                          >
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-6 space-y-4">
                      <h3 className="text-xl font-bold transition-colors line-clamp-2 group-hover:text-primary">
                        <Link
                          to={`/blog/${post.slug}`}
                          className="hover:underline"
                        >
                          {post.title}
                        </Link>
                      </h3>

                      <p className="leading-relaxed text-muted-foreground line-clamp-3">
                        {post.excerpt}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {post.tags.slice(0, 3).map((tag, tagIndex) => (
                          <Badge
                            key={tagIndex}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {post.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{post.tags.length - 3}
                          </Badge>
                        )}
                      </div>

                      {/* Meta Information */}
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(post.publishedAt).toLocaleDateString(
                                "vi-VN",
                              )}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{post.readTime} phút</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{formatNumber(post.views)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Heart className="w-4 h-4" />
                            <span>{formatNumber(post.likes)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Author */}
                      <div className="flex items-center pt-4 space-x-3 border-t">
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="object-cover w-8 h-8 rounded-full ring-2 ring-primary/20"
                        />
                        <div>
                          <span className="text-sm font-medium">
                            {post.author.name}
                          </span>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {post.author.bio}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ✅ Enhanced Filters Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
          id="filters"
          data-animate
        >
          <Card className="border-0 shadow-lg bg-gradient-to-r from-white to-blue-50 dark:from-slate-800 dark:to-blue-900">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-primary" />
                <span>Bộ lọc & Tìm kiếm</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm bài viết, tags, nội dung..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 transition-all duration-300 border-0 bg-background/50 focus:ring-2 focus:ring-primary/20"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute w-8 h-8 p-0 transform -translate-y-1/2 right-1 top-1/2"
                    onClick={() => setSearchQuery("")}
                  >
                    ×
                  </Button>
                )}
              </div>

              {/* Filters Row */}
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        <div className="flex items-center space-x-2">
                          <Globe className="w-4 h-4" />
                          <span>Tất cả danh mục</span>
                        </div>
                      </SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center space-x-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{
                                backgroundColor: getCategoryColor(
                                  category.color,
                                ),
                              }}
                            />
                            <span>{category.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {category.count}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Sắp xếp" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>Mới nhất</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="oldest">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>Cũ nhất</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="popular">
                        <div className="flex items-center space-x-2">
                          <Eye className="w-4 h-4" />
                          <span>Phổ biến</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="liked">
                        <div className="flex items-center space-x-2">
                          <Heart className="w-4 h-4" />
                          <span>Yêu thích</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    Hiển thị:
                  </span>
                  <div className="flex overflow-hidden border rounded-lg">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="rounded-none"
                    >
                      <Grid className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="rounded-none"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Active Filters */}
              {(searchQuery || selectedCategory !== "all") && (
                <div className="flex items-center pt-4 space-x-2 border-t">
                  <span className="text-sm text-muted-foreground">
                    Bộ lọc đang áp dụng:
                  </span>
                  {searchQuery && (
                    <Badge
                      variant="secondary"
                      className="text-blue-800 bg-blue-100"
                    >
                      Tìm kiếm: "{searchQuery}"
                      <button
                        onClick={() => setSearchQuery("")}
                        className="ml-2 hover:text-blue-600"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                  {selectedCategory !== "all" && (
                    <Badge
                      variant="secondary"
                      className="text-purple-800 bg-purple-100"
                    >
                      Danh mục:{" "}
                      {categories.find((c) => c.id === selectedCategory)?.name}
                      <button
                        onClick={() => setSelectedCategory("all")}
                        className="ml-2 hover:text-purple-600"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.section>

        {/* ✅ Enhanced All Posts Section */}
        <section id="all-posts" data-animate>
          <div
            className={`flex items-center justify-between mb-8 transition-all duration-800 ${
              isVisible["all-posts"]
                ? "animate-in slide-in-from-bottom"
                : "opacity-0"
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                  Tất cả bài viết
                </h2>
                <p className="text-sm text-muted-foreground">
                  {filteredPosts.length} bài viết được tìm thấy
                </p>
              </div>
            </div>

            <Badge variant="outline" className="bg-primary/10 text-primary">
              <MessageCircle className="w-3 h-3 mr-1" />
              {filteredPosts.length} bài viết
            </Badge>
          </div>

          <AnimatePresence mode="wait">
            {filteredPosts.length > 0 ? (
              <motion.div
                key="posts-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={
                  viewMode === "grid"
                    ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                    : "space-y-6"
                }
              >
                {filteredPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className={`transition-all duration-500 ${
                      isVisible["all-posts"]
                        ? "animate-in slide-in-from-bottom"
                        : "opacity-0"
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {viewMode === "grid" ? (
                      // Grid View
                      <Card className="h-full overflow-hidden transition-all duration-300 border-0 hover:shadow-xl group bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900">
                        <div className="relative overflow-hidden">
                          <img
                            src={post.featuredImage}
                            alt={post.title}
                            className="object-cover w-full h-48 transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute top-4 left-4">
                            <Badge
                              style={{
                                backgroundColor: getCategoryColor(
                                  post.category.color,
                                ),
                                color: "white",
                              }}
                            >
                              {post.category.name}
                            </Badge>
                          </div>
                        </div>

                        <CardContent className="p-6 space-y-4">
                          <h3 className="text-lg font-bold transition-colors line-clamp-2 group-hover:text-primary">
                            <Link
                              to={`/blog/${post.slug}`}
                              className="hover:underline"
                            >
                              {post.title}
                            </Link>
                          </h3>

                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {post.excerpt}
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {post.tags.slice(0, 2).map((tag, tagIndex) => (
                              <Badge
                                key={tagIndex}
                                variant="outline"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center space-x-2">
                              <img
                                src={post.author.avatar}
                                alt={post.author.name}
                                className="object-cover w-6 h-6 rounded-full"
                              />
                              <span>{post.author.name}</span>
                            </div>

                            <div className="flex items-center space-x-3">
                              <div className="flex items-center space-x-1">
                                <Eye className="w-3 h-3" />
                                <span>{formatNumber(post.views)}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Heart className="w-3 h-3" />
                                <span>{formatNumber(post.likes)}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      // List View
                      <Card className="transition-all duration-300 border-0 hover:shadow-lg group bg-gradient-to-r from-white to-gray-50 dark:from-slate-800 dark:to-slate-900">
                        <CardContent className="p-6">
                          <div className="flex gap-6">
                            <div className="relative flex-shrink-0 w-48 h-32 overflow-hidden rounded-lg">
                              <img
                                src={post.featuredImage}
                                alt={post.title}
                                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                              />
                            </div>

                            <div className="flex-1 space-y-3">
                              <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                  <Badge
                                    style={{
                                      backgroundColor: getCategoryColor(
                                        post.category.color,
                                      ),
                                      color: "white",
                                    }}
                                  >
                                    {post.category.name}
                                  </Badge>
                                  <h3 className="text-xl font-bold transition-colors line-clamp-2 group-hover:text-primary">
                                    <Link
                                      to={`/blog/${post.slug}`}
                                      className="hover:underline"
                                    >
                                      {post.title}
                                    </Link>
                                  </h3>
                                </div>
                              </div>

                              <p className="text-muted-foreground line-clamp-2">
                                {post.excerpt}
                              </p>

                              <div className="flex flex-wrap gap-2">
                                {post.tags.slice(0, 3).map((tag, tagIndex) => (
                                  <Badge
                                    key={tagIndex}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                                {post.tags.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{post.tags.length - 3}
                                  </Badge>
                                )}
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                  <div className="flex items-center space-x-1">
                                    <User className="w-4 h-4" />
                                    <span>{post.author.name}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>
                                      {new Date(
                                        post.publishedAt,
                                      ).toLocaleDateString("vi-VN")}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{post.readTime} phút</span>
                                  </div>
                                </div>

                                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                                  <div className="flex items-center space-x-1">
                                    <Eye className="w-4 h-4" />
                                    <span>{formatNumber(post.views)}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Heart className="w-4 h-4" />
                                    <span>{formatNumber(post.likes)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="no-posts"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
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
                      <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    </motion.div>
                    <h3 className="mb-2 text-lg font-semibold">
                      Không tìm thấy bài viết
                    </h3>
                    <p className="mb-4 text-muted-foreground">
                      Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc để tìm thấy nội
                      dung phù hợp
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("all");
                      }}
                    >
                      Xóa bộ lọc
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ✅ Load More Button */}
        {filteredPosts.length > 0 && (
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              size="lg"
              variant="outline"
              className="transition-all duration-300 group hover:scale-105 hover:shadow-lg"
            >
              Xem thêm bài viết
              <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Blog;
