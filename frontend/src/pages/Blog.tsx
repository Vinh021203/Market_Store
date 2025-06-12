import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { getAllPublishedPosts, getAllCategories } from "@/lib/blog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import {
  Search,
  Calendar,
  Clock,
  Eye,
  Heart,
  User,
  BookOpen,
  TrendingUp,
} from "lucide-react";

const Blog: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const load = async () => {
    setLoading(true);
    const posts = await getAllPublishedPosts();
    const categories = await getAllCategories();
    setPosts(posts);
    setCategories(categories);
    setLoading(false);
  };

  useEffect(() => {
    load();
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
            new Date(b.published_at).getTime() -
            new Date(a.published_at).getTime()
          );
        case "oldest":
          return (
            new Date(a.published_at).getTime() -
            new Date(b.published_at).getTime()
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
      {/* Hero Section */}
      <section className="relative px-4 py-20 overflow-hidden">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto space-y-6 text-center"
          >
            <Badge
              variant="outline"
              className="bg-white/50 dark:bg-slate-800/50 backdrop-blur"
            >
              <BookOpen className="w-3 h-3 mr-1" />
              Blog & Tutorials
            </Badge>

            <h1 className="text-4xl font-bold text-transparent md:text-6xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text">
              Kiến thức & Cảm hứng
            </h1>

            <p className="text-xl text-muted-foreground">
              Khám phá những bài viết chất lượng về công nghệ, thiết k��� và xu
              hướng mới nhất
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container px-4 pb-16 mx-auto">
        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center mb-8 space-x-2"
            >
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-bold">Bài viết nổi bật</h2>
            </motion.div>

            <div className="grid gap-6 mb-12 md:grid-cols-2 lg:grid-cols-3">
              {featuredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg group">
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
                          }}
                        >
                          {post.category.name}
                        </Badge>
                      </div>
                      <div className="absolute top-4 right-4">
                        <Badge
                          variant="secondary"
                          className="text-white bg-black/50"
                        >
                          Nổi bật
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <h3 className="text-xl font-bold transition-colors line-clamp-2 group-hover:text-primary">
                          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                        </h3>

                        <p className="text-muted-foreground line-clamp-3">
                          {post.excerpt}
                        </p>

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
                              <span>{post.views}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Heart className="w-4 h-4" />
                              <span>{post.likes}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <img
                            src={post.author.avatar}
                            alt={post.author.name}
                            className="object-cover w-8 h-8 rounded-full"
                          />
                          <span className="font-medium">
                            {post.author.name}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Filters */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm bài viết..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả danh mục</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Sắp xếp" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Mới nhất</SelectItem>
                    <SelectItem value="oldest">Cũ nhất</SelectItem>
                    <SelectItem value="popular">Phổ biến</SelectItem>
                    <SelectItem value="liked">Yêu thích</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* All Posts */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">
              Tất cả bài viết ({filteredPosts.length})
            </h2>
          </div>

          {filteredPosts.length > 0 ? (
            <div className="grid gap-6">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="transition-all duration-300 hover:shadow-lg group">
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
                                }}
                              >
                                {post.category.name}
                              </Badge>
                              <h3 className="text-xl font-bold transition-colors line-clamp-2 group-hover:text-primary">
                                <Link to={`/blog/${post.slug}`}>
                                  {post.title}
                                </Link>
                              </h3>
                            </div>
                          </div>

                          <p className="text-muted-foreground line-clamp-2">
                            {post.excerpt}
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {post.tags.slice(0, 3).map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
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
                                <span>{post.views}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Heart className="w-4 h-4" />
                                <span>{post.likes}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="py-12 text-center">
              <CardContent>
                <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">
                  Không tìm thấy bài viết
                </h3>
                <p className="text-muted-foreground">
                  Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
                </p>
              </CardContent>
            </Card>
          )}
        </section>
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
  };
  return colors[color] || colors.blue;
};

export default Blog;
