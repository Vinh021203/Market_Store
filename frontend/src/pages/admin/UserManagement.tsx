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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { isAdmin, getInitials } from "@/lib/auth";
import { User } from "@/types";
import UserDetailModal from "@/components/UserDetails";
import {
  getAllUsers,
  getUserStats,
  updateUserRole,
  deleteUser,
  createUser,
} from "@/lib/users";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  ArrowLeft,
  Users,
  UserPlus,
  Shield,
  ShieldCheck,
  Save,
  X,
  Coffee,
  Code,
  Palette,
  Sparkles,
  Activity,
  BarChart3,
  TrendingUp,
  Clock,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const UserManagement: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "customer">(
    "all",
  );
  const [stats, setStats] = useState({
    total: 0,
    admins: 0,
    customers: 0,
    recent: 0,
  });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer" as "admin" | "customer",
  });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});

  // ✅ Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  if (!user || !isAdmin(user)) {
    return <Navigate to="/" replace />;
  }

  // ✅ User handlers
  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsEditMode(false);
    setIsDetailModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditMode(true);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedUser(null);
    setIsEditMode(false);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
    );
  };

  // ✅ Enhanced fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [usersData, statsData] = await Promise.all([
          getAllUsers(),
          getUserStats(),
        ]);

        setUsers(usersData);
        setStats(statsData);
        toast({
          title: "✅ Đã tải người dùng",
          description: `Tải thành công ${usersData.length} người dùng.`,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "❌ Lỗi tải dữ liệu",
          description: "Không thể tải dữ liệu người dùng. Vui lòng thử lại.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();

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

  // ✅ Filter users
  const filteredUsers = users.filter((userItem) => {
    const matchesSearch =
      userItem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      userItem.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === "all" || userItem.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  // ✅ Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // ✅ Pagination handlers
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, roleFilter]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const [usersData, statsData] = await Promise.all([
        getAllUsers(),
        getUserStats(),
      ]);
      setUsers(usersData);
      setStats(statsData);
      toast({
        title: "🔄 Đã cập nhật",
        description: "Dữ liệu người dùng đã được làm mới.",
      });
    } catch (error) {
      toast({
        title: "❌ Lỗi cập nhật",
        description: "Không thể cập nhật dữ liệu người dùng.",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (userId === user.id) {
      toast({
        title: "❌ Không thể xóa",
        description: "Bạn không thể xóa tài khoản của chính mình.",
        variant: "destructive",
      });
      return;
    }

    const success = await deleteUser(userId);

    if (success) {
      setUsers((prev) => prev.filter((u) => u.id !== userId));

      // Cập nhật stats
      const newStats = await getUserStats();
      setStats(newStats);

      toast({
        title: "🗑️ Đã xóa người dùng",
        description: "Người dùng đã được xóa khỏi hệ thống.",
      });
    } else {
      toast({
        title: "❌ Lỗi xóa người dùng",
        description: "Có lỗi xảy ra khi xóa người dùng.",
        variant: "destructive",
      });
    }
  };

  const handleToggleRole = async (userId: string) => {
    if (userId === user.id) {
      toast({
        title: "❌ Không thể thay đổi",
        description: "Bạn không thể thay đổi quyền của chính mình.",
        variant: "destructive",
      });
      return;
    }

    const targetUser = users.find((u) => u.id === userId);
    if (!targetUser) return;

    const newRole = targetUser.role === "admin" ? "customer" : "admin";
    const success = await updateUserRole(userId, newRole);

    if (success) {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
      );

      // Cập nhật stats
      const newStats = await getUserStats();
      setStats(newStats);

      toast({
        title: "✅ Cập nhật thành công",
        description: "Quyền người dùng đã được cập nhật.",
      });
    } else {
      toast({
        title: "❌ Lỗi cập nhật",
        description: "Có lỗi xảy ra khi cập nhật quyền người dùng.",
        variant: "destructive",
      });
    }
  };

  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast({
        title: "❌ Thiếu thông tin",
        description: "Vui lòng điền đầy đủ thông tin.",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);
    try {
      const createdUser = await createUser(newUser);

      if (createdUser) {
        setUsers((prev) => [createdUser, ...prev]);

        // Cập nhật stats
        const newStats = await getUserStats();
        setStats(newStats);

        setIsCreateDialogOpen(false);
        setNewUser({ name: "", email: "", password: "", role: "customer" });

        toast({
          title: "✅ Tạo thành công",
          description: "Người dùng mới đã được tạo.",
        });
      } else {
        throw new Error("Không thể tạo người dùng");
      }
    } catch (error) {
      toast({
        title: "❌ Lỗi tạo người dùng",
        description: "Có lỗi xảy ra khi tạo người dùng mới.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const statsCards = [
    {
      title: "Tổng người dùng",
      value: stats.total,
      icon: Users,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient:
        "from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20",
      description: "Tất cả tài khoản",
    },
    {
      title: "Quản trị viên",
      value: stats.admins,
      icon: ShieldCheck,
      gradient: "from-purple-500 to-violet-500",
      bgGradient:
        "from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20",
      description: "Admin accounts",
    },
    {
      title: "Khách hàng",
      value: stats.customers,
      icon: Shield,
      gradient: "from-green-500 to-emerald-500",
      bgGradient:
        "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
      description: "Customer accounts",
    },
    {
      title: "Mới (7 ngày)",
      value: stats.recent,
      icon: TrendingUp,
      gradient: "from-orange-500 to-red-500",
      bgGradient:
        "from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20",
      description: "Đăng ký gần đây",
    },
  ];

  // ✅ Pagination component
  const PaginationComponent = () => {
    if (totalPages <= 1) return null;

    const getVisiblePages = () => {
      const delta = 2;
      const range = [];
      const rangeWithDots = [];

      for (
        let i = Math.max(2, currentPage - delta);
        i <= Math.min(totalPages - 1, currentPage + delta);
        i++
      ) {
        range.push(i);
      }

      if (currentPage - delta > 2) {
        rangeWithDots.push(1, "...");
      } else {
        rangeWithDots.push(1);
      }

      rangeWithDots.push(...range);

      if (currentPage + delta < totalPages - 1) {
        rangeWithDots.push("...", totalPages);
      } else {
        rangeWithDots.push(totalPages);
      }

      return rangeWithDots;
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mt-6"
      >
        <div className="text-sm text-muted-foreground">
          Hiển thị {indexOfFirstUser + 1} đến{" "}
          {Math.min(indexOfLastUser, filteredUsers.length)} của{" "}
          {filteredUsers.length} người dùng
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="group"
          >
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Trước
          </Button>

          <div className="flex items-center space-x-1">
            {getVisiblePages().map((page, index) => (
              <React.Fragment key={index}>
                {page === "..." ? (
                  <span className="px-3 py-2 text-muted-foreground">...</span>
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page as number)}
                      className={`min-w-[40px] ${
                        currentPage === page
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                          : ""
                      }`}
                    >
                      {page}
                    </Button>
                  </motion.div>
                )}
              </React.Fragment>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="group"
          >
            Sau
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </motion.div>
    );
  };

  // ✅ Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
        {/* Floating Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 animate-float">
            <Users className="w-8 h-8 text-blue-500 opacity-20" />
          </div>
          <div className="absolute top-1/3 right-1/4 animate-float-delay-1">
            <Shield className="w-6 h-6 text-purple-500 opacity-20" />
          </div>
          <div className="absolute bottom-1/4 left-1/3 animate-float-delay-2">
            <Coffee className="text-orange-500 w-7 h-7 opacity-20" />
          </div>
        </div>

        <div className="container relative z-10 px-4 py-8 mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center min-h-screen"
          >
            <Card className="py-12 text-center border-0 shadow-2xl bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900">
              <CardContent>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 mx-auto mb-4 border-4 rounded-full border-primary border-t-transparent"
                />
                <h2 className="mb-2 text-xl font-semibold">
                  Đang tải người dùng...
                </h2>
                <p className="text-muted-foreground">
                  Vui lòng đợi trong giây lát
                </p>
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

      <div className="container relative z-10 px-4 py-8 mx-auto space-y-8">
        {/* ✅ Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
          id="header"
          data-animate
        >
          <div className="flex items-center space-x-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="ghost" size="sm" asChild className="group">
                <Link to="/admin">
                  <ArrowLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
                  Về Dashboard
                </Link>
              </Button>
            </motion.div>
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="flex items-center justify-center w-12 h-12 shadow-lg rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600"
              >
                <Users className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text">
                  Quản lý người dùng
                </h1>
                <p className="text-muted-foreground">
                  Quản lý tài khoản và quyền người dùng
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={refreshing}
                className="transition-all duration-300 group hover:bg-primary/10"
              >
                {refreshing ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                  </motion.div>
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2 group-hover:animate-spin" />
                )}
                Làm mới
              </Button>
            </motion.div>

            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button className="transition-all duration-300 shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Thêm người dùng
                  </Button>
                </motion.div>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                      <UserPlus className="w-4 h-4 text-white" />
                    </div>
                    <span>Tạo người dùng mới</span>
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <motion.div
                    className="space-y-2"
                    whileFocus={{ scale: 1.01 }}
                  >
                    <Label htmlFor="name">Họ tên *</Label>
                    <Input
                      id="name"
                      placeholder="Nhập họ tên"
                      value={newUser.name}
                      onChange={(e) =>
                        setNewUser((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      disabled={isCreating}
                      className="h-12 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                    />
                  </motion.div>

                  <motion.div
                    className="space-y-2"
                    whileFocus={{ scale: 1.01 }}
                  >
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Nhập email"
                      value={newUser.email}
                      onChange={(e) =>
                        setNewUser((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      disabled={isCreating}
                      className="h-12 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                    />
                  </motion.div>

                  <motion.div
                    className="space-y-2"
                    whileFocus={{ scale: 1.01 }}
                  >
                    <Label htmlFor="password">Mật khẩu *</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Nhập mật khẩu"
                      value={newUser.password}
                      onChange={(e) =>
                        setNewUser((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      disabled={isCreating}
                      className="h-12 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                    />
                  </motion.div>

                  <motion.div
                    className="space-y-2"
                    whileFocus={{ scale: 1.01 }}
                  >
                    <Label htmlFor="role">Quyền</Label>
                    <Select
                      value={newUser.role}
                      onValueChange={(value: "admin" | "customer") =>
                        setNewUser((prev) => ({ ...prev, role: value }))
                      }
                      disabled={isCreating}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="customer">
                          <div className="flex items-center space-x-2">
                            <Shield className="w-4 h-4" />
                            <span>Khách hàng</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="admin">
                          <div className="flex items-center space-x-2">
                            <ShieldCheck className="w-4 h-4" />
                            <span>Quản trị viên</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>

                  <div className="flex justify-end pt-4 space-x-3 border-t">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outline"
                        onClick={() => setIsCreateDialogOpen(false)}
                        disabled={isCreating}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Hủy
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={handleCreateUser}
                        disabled={isCreating}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      >
                        {isCreating ? (
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
                            Đang tạo...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Tạo người dùng
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* ✅ Enhanced Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 gap-4 md:grid-cols-4"
          id="stats"
          data-animate
        >
          {statsCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`transition-all duration-500 ${
                isVisible.stats
                  ? "animate-in slide-in-from-bottom"
                  : "opacity-0"
              }`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <Card
                className={`transition-all duration-300 hover:shadow-xl border-0 bg-gradient-to-br ${stat.bgGradient} group`}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="mb-1 text-2xl font-bold text-foreground"
                      >
                        {stat.value}
                      </motion.div>
                      <div className="mb-1 text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {stat.description}
                      </div>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}
                    >
                      <stat.icon className="w-6 h-6 text-white" />
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* ✅ Enhanced Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          id="filters"
          data-animate
        >
          <Card className="border-0 shadow-lg bg-gradient-to-r from-white to-blue-50 dark:from-slate-800 dark:to-blue-900">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500">
                  <Filter className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text">
                    Bộ lọc và tìm kiếm
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Tìm kiếm và lọc người dùng theo tiêu chí
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 md:flex-row">
                <motion.div
                  className="relative flex-1"
                  whileFocus={{ scale: 1.01 }}
                >
                  <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm theo tên hoặc email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-12 pl-10 transition-all duration-300 border-0 bg-background/50 focus:ring-2 focus:ring-primary/20"
                  />
                </motion.div>

                <motion.div whileFocus={{ scale: 1.01 }}>
                  <Select
                    value={roleFilter}
                    onValueChange={(value: any) => setRoleFilter(value)}
                  >
                    <SelectTrigger className="w-full md:w-[180px] h-12">
                      <SelectValue placeholder="Quyền" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả quyền</SelectItem>
                      <SelectItem value="admin">Quản trị viên</SelectItem>
                      <SelectItem value="customer">Khách hàng</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ✅ Enhanced Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          id="users"
          data-animate
        >
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-transparent bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text">
                      Danh sách người dùng
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Trang {currentPage} / {totalPages} -{" "}
                      {filteredUsers.length} người dùng được tìm thấy
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-blue-800 bg-blue-100">
                  <Activity className="w-3 h-3 mr-1" />
                  {currentUsers.length} kết quả
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-muted/50">
                      <TableHead className="font-semibold">
                        Người dùng
                      </TableHead>
                      <TableHead className="font-semibold">Email</TableHead>
                      <TableHead className="font-semibold">Quyền</TableHead>
                      <TableHead className="font-semibold">
                        Ngày tham gia
                      </TableHead>
                      <TableHead className="font-semibold text-right">
                        Thao tác
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {currentUsers.map((userItem, index) => (
                        <motion.tr
                          key={userItem.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                          className="transition-all duration-300 group hover:shadow-md"
                        >
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <motion.div whileHover={{ scale: 1.1 }}>
                                <Avatar className="transition-transform duration-300">
                                  <AvatarImage src={userItem.avatar} />
                                  <AvatarFallback className="text-white bg-gradient-to-r from-blue-500 to-purple-600">
                                    {getInitials(userItem.name)}
                                  </AvatarFallback>
                                </Avatar>
                              </motion.div>
                              <div>
                                <div className="font-medium transition-colors group-hover:text-primary">
                                  {userItem.name}
                                </div>
                                {userItem.id === user.id && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs text-yellow-800 bg-yellow-100"
                                  >
                                    <Sparkles className="w-3 h-3 mr-1" />
                                    Bạn
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{userItem.email}</div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                userItem.role === "admin"
                                  ? "default"
                                  : "secondary"
                              }
                              className="transition-all duration-300 group-hover:scale-105"
                            >
                              {userItem.role === "admin" ? (
                                <>
                                  <ShieldCheck className="w-3 h-3 mr-1" />
                                  Quản trị viên
                                </>
                              ) : (
                                <>
                                  <Shield className="w-3 h-3 mr-1" />
                                  Khách hàng
                                </>
                              )}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center space-x-1 text-sm">
                                <Clock className="w-3 h-3" />
                                <span>
                                  {new Date(
                                    userItem.createdAt,
                                  ).toLocaleDateString("vi-VN")}
                                </span>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(
                                  userItem.createdAt,
                                ).toLocaleTimeString("vi-VN")}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <motion.div
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="group/btn"
                                  >
                                    <MoreHorizontal className="w-4 h-4 transition-colors group-hover/btn:text-primary" />
                                  </Button>
                                </motion.div>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleViewUser(userItem)}
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  Xem chi tiết
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleEditUser(userItem)}
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Chỉnh sửa
                                </DropdownMenuItem>
                                {userItem.id !== user.id && (
                                  <>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleToggleRole(userItem.id)
                                      }
                                    >
                                      {userItem.role === "admin" ? (
                                        <>
                                          <Shield className="w-4 h-4 mr-2" />
                                          Chuyển thành khách hàng
                                        </>
                                      ) : (
                                        <>
                                          <ShieldCheck className="w-4 h-4 mr-2" />
                                          Chuyển thành admin
                                        </>
                                      )}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleDeleteUser(userItem.id)
                                      }
                                      className="text-red-600"
                                    >
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Xóa người dùng
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>

              {/* ✅ Enhanced Empty State */}
              {filteredUsers.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-16 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  >
                    <Users className="w-20 h-20 mx-auto mb-6 text-muted-foreground" />
                  </motion.div>
                  <h3 className="mb-4 text-2xl font-semibold">
                    Không tìm thấy người dùng
                  </h3>
                  <p className="max-w-md mx-auto mb-6 text-muted-foreground">
                    Thử thay đổi bộ lọc hoặc tạo người dùng mới để bắt đầu quản
                    lý.
                  </p>
                  <div className="space-y-3">
                    <Button
                      onClick={() => {
                        setSearchQuery("");
                        setRoleFilter("all");
                      }}
                      variant="outline"
                      className="mr-3"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Xóa bộ lọc
                    </Button>
                    <Button
                      onClick={() => setIsCreateDialogOpen(true)}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Thêm người dùng mới
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* ✅ Pagination Component */}
              <PaginationComponent />
            </CardContent>
          </Card>
        </motion.div>

        <UserDetailModal
          user={selectedUser}
          isOpen={isDetailModalOpen}
          onClose={handleCloseDetailModal}
          onUpdate={handleUpdateUser}
          isEditing={isEditMode}
        />
      </div>
    </div>
  );
};

export default UserManagement;
