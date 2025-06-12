import React, { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { isAdmin } from "@/lib/auth";
import { BlogPost, BlogCategory } from "@/types/blog";
import {
  getAllBlogPosts,
  getAllCategories,
  updatePostStatus,
  deleteBlogPost,
} from "@/lib/blog";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  ArrowLeft,
  BookOpen,
  Calendar,
  Clock,
  User,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const BlogManagement: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "published" | "draft"
  >("all");

  if (!user || !isAdmin(user)) {
    return <Navigate to="/" replace />;
  }

  // Fetch data từ Supabase
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [postsData, categoriesData] = await Promise.all([
          getAllBlogPosts(),
          getAllCategories(),
        ]);
        setPosts(postsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Lỗi tải dữ liệu",
          description: "Không thể tải dữ liệu blog. Vui lòng thử lại.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || post.category.id === categoryFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "published" && post.isPublished) ||
      (statusFilter === "draft" && !post.isPublished);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleToggleStatus = async (postId: string) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    const success = await updatePostStatus(postId, !post.isPublished);

    if (success) {
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? { ...post, isPublished: !post.isPublished }
            : post,
        ),
      );

      toast({
        title: "Cập nhật thành công",
        description: "Trạng thái bài viết đã được cập nhật.",
      });
    } else {
      toast({
        title: "Cập nhật thất bại",
        description: "Có lỗi xảy ra khi cập nhật trạng thái bài viết.",
        variant: "destructive",
      });
    }
  };

  const handleDeletePost = async (postId: string) => {
    const success = await deleteBlogPost(postId);

    if (success) {
      setPosts((prev) => prev.filter((post) => post.id !== postId));

      toast({
        title: "Đã xóa bài viết",
        description: "Bài viết đã được xóa khỏi hệ thống.",
      });
    } else {
      toast({
        title: "Xóa thất bại",
        description: "Có lỗi xảy ra khi xóa bài viết.",
        variant: "destructive",
      });
    }
  };

  const stats = {
    total: posts.length,
    published: posts.filter((p) => p.isPublished).length,
    draft: posts.filter((p) => !p.isPublished).length,
    featured: posts.filter((p) => p.isFeatured).length,
    totalViews: posts.reduce((sum, p) => sum + p.views, 0),
    totalLikes: posts.reduce((sum, p) => sum + p.likes, 0),
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/admin">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Về Dashboard
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
              Quản lý Blog
            </h1>
            <p className="text-muted-foreground">
              Quản lý bài viết, danh mục và nội dung blog
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" asChild>
            <Link to="/admin/blog/categories">Quản lý danh mục</Link>
          </Button>
          <Button
            asChild
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            <Link to="/admin/blog/create">
              <Plus className="w-4 h-4 mr-2" />
              Viết bài mới
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Tổng bài viết</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {stats.published}
              </div>
              <div className="text-sm text-muted-foreground">Đã xuất bản</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {stats.draft}
              </div>
              <div className="text-sm text-muted-foreground">Bản nháp</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {stats.featured}
              </div>
              <div className="text-sm text-muted-foreground">Nổi bật</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {stats.totalViews.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Lượt xem</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {stats.totalLikes}
              </div>
              <div className="text-sm text-muted-foreground">Lượt thích</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
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

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
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

            <Select
              value={statusFilter}
              onValueChange={(value: any) => setStatusFilter(value)}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="published">Đã xuất bản</SelectItem>
                <SelectItem value="draft">Bản nháp</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Posts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách bài viết ({filteredPosts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bài viết</TableHead>
                  <TableHead>Danh mục</TableHead>
                  <TableHead>Tác giả</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Thống kê</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <div className="flex items-start space-x-3">
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="object-cover w-16 h-12 rounded"
                        />
                        <div className="space-y-1">
                          <div className="font-medium line-clamp-2">
                            {post.title}
                          </div>
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {post.excerpt}
                          </div>
                          {post.isFeatured && (
                            <Badge variant="outline" className="text-xs">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Nổi bật
                            </Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        style={{
                          borderColor: getCategoryColor(post.category.color),
                          color: getCategoryColor(post.category.color),
                        }}
                      >
                        {post.category.name}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="object-cover w-6 h-6 rounded-full"
                        />
                        <span className="text-sm">{post.author.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={post.isPublished ? "default" : "secondary"}
                      >
                        {post.isPublished ? "Đã xuất bản" : "Bản nháp"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>{post.views}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="w-3 h-3" />
                          <span>{post.likes}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <div>
                          {new Date(post.publishedAt).toLocaleDateString(
                            "vi-VN",
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {post.readTime} phút đọc
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/blog/${post.slug}`}>
                              <Eye className="w-4 h-4 mr-2" />
                              Xem bài viết
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={`/admin/blog/edit/${post.id}`}>
                              <Edit className="w-4 h-4 mr-2" />
                              Chỉnh sửa
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleToggleStatus(post.id)}
                          >
                            <BookOpen className="w-4 h-4 mr-2" />
                            {post.isPublished ? "Chuyển về nháp" : "Xuất bản"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeletePost(post.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredPosts.length === 0 && (
            <div className="py-8 text-center">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">
                Không tìm thấy bài viết
              </h3>
              <p className="mb-4 text-muted-foreground">
                Thử thay đổi bộ lọc hoặc tạo bài viết mới
              </p>
              <Button asChild>
                <Link to="/admin/blog/create">
                  <Plus className="w-4 h-4 mr-2" />
                  Viết bài mới
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
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

export default BlogManagement;
