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
  XCircle,
  Info,
  Target,
  Heart,
  Loader2,
} from "lucide-react";

// Enhanced Toast Component (giống Product/Order/Blog)
const FloatingToast = ({
  type = "success",
  title,
  description,
  visible = true,
  onClose,
}: {
  type?: "success" | "error" | "info";
  title: string;
  description?: string;
  visible?: boolean;
  onClose?: () => void;
}) => {
  const iconProps = "w-5 h-5 flex-shrink-0";
  let icon, colorScheme, bgGradient;

  switch (type) {
    case "error":
      icon = <XCircle className={`${iconProps} text-pink-600`} />;
      colorScheme = "text-pink-800";
      bgGradient = "from-pink-50/95 via-orange-50/95 to-white/95";
      break;
    case "info":
      icon = <Info className={`${iconProps} text-sky-600`} />;
      colorScheme = "text-sky-800";
      bgGradient = "from-sky-50/95 via-blue-50/95 to-white/95";
      break;
    default:
      icon = <CheckCircle className={`${iconProps} text-emerald-600`} />;
      colorScheme = "text-emerald-800";
      bgGradient = "from-emerald-50/95 via-green-50/95 to-white/95";
  }

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, x: 100 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.8, x: 100 }}
      className={`fixed top-6 right-6 z-50 max-w-sm min-w-[300px] p-4 rounded-3xl shadow-2xl backdrop-blur-xl border border-white/30 bg-gradient-to-r ${bgGradient}`}
    >
      <div className="flex items-start gap-3">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
          className="flex-shrink-0 p-2 rounded-2xl bg-white/60"
        >
          {icon}
        </motion.div>
        <div className="flex-1 min-w-0">
          <div className={`font-semibold text-sm ${colorScheme}`}>{title}</div>
          {description && (
            <div className="text-xs mt-1 text-orange-700/70 leading-relaxed">
              {description}
            </div>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 rounded-full hover:bg-white/60 transition-colors"
          >
            <XCircle className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

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
  const [toasts, setToasts] = useState<
    Array<{
      id: string;
      type: "success" | "error" | "info";
      title: string;
      description?: string;
    }>
  >([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  if (!user || !isAdmin(user)) {
    return <Navigate to="/" replace />;
  }

  // Toast system
  const showToast = (
    type: "success" | "error" | "info",
    title: string,
    description?: string,
  ) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // User handlers
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

  // Enhanced fetch data
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
        showToast(
          "success",
          "✅ Đã tải người dùng",
          `Tải thành công ${usersData.length} người dùng.`,
        );
      } catch (error) {
        console.error("Error fetching data:", error);
        showToast(
          "error",
          "❌ Lỗi tải dữ liệu",
          "Không thể tải dữ liệu người dùng. Vui lòng thử lại.",
        );
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

  // Filter users
  const filteredUsers = users.filter((userItem) => {
    const matchesSearch =
      userItem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      userItem.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === "all" || userItem.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Pagination handlers
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
      showToast(
        "success",
        "🔄 Đã cập nhật",
        "Dữ liệu người dùng đã được làm mới.",
      );
    } catch (error) {
      showToast(
        "error",
        "❌ Lỗi cập nhật",
        "Không thể cập nhật dữ liệu người dùng.",
      );
    } finally {
      setRefreshing(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (userId === user.id) {
      showToast(
        "error",
        "❌ Không thể xóa",
        "Bạn không thể xóa tài khoản của chính mình.",
      );
      return;
    }

    const success = await deleteUser(userId);

    if (success) {
      setUsers((prev) => prev.filter((u) => u.id !== userId));

      // Cập nhật stats
      const newStats = await getUserStats();
      setStats(newStats);

      showToast(
        "success",
        "🗑️ Đã xóa người dùng",
        "Người dùng đã được xóa khỏi hệ thống.",
      );
    } else {
      showToast(
        "error",
        "❌ Lỗi xóa người dùng",
        "Có lỗi xảy ra khi xóa người dùng.",
      );
    }
  };

  const handleToggleRole = async (userId: string) => {
    if (userId === user.id) {
      showToast(
        "error",
        "❌ Không thể thay đổi",
        "Bạn không thể thay đổi quyền của chính mình.",
      );
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

      showToast(
        "success",
        "✅ Cập nhật thành công",
        "Quyền người dùng đã được cập nhật.",
      );
    } else {
      showToast(
        "error",
        "❌ Lỗi cập nhật",
        "Có lỗi xảy ra khi cập nhật quyền người dùng.",
      );
    }
  };

  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      showToast(
        "error",
        "❌ Thiếu thông tin",
        "Vui lòng điền đầy đủ thông tin.",
      );
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

        showToast(
          "success",
          "✅ Tạo thành công",
          "Người dùng mới đã được tạo.",
        );
      } else {
        throw new Error("Không thể tạo người dùng");
      }
    } catch (error) {
      showToast(
        "error",
        "❌ Lỗi tạo người dùng",
        "Có lỗi xảy ra khi tạo người dùng mới.",
      );
    } finally {
      setIsCreating(false);
    }
  };

  const statsCards = [
    {
      title: "Tổng người dùng",
      value: stats.total,
      icon: Users,
      gradient: "from-orange-400 via-amber-500 to-yellow-600",
      bgGradient: "from-orange-50/80 via-amber-50/80 to-yellow-50/80",
      description: "Tất cả tài khoản",
      trend: "+12%",
    },
    {
      title: "Quản trị viên",
      value: stats.admins,
      icon: ShieldCheck,
      gradient: "from-purple-400 via-violet-500 to-indigo-600",
      bgGradient: "from-purple-50/80 via-violet-50/80 to-indigo-50/80",
      description: "Admin accounts",
      trend: "+2%",
    },
    {
      title: "Khách hàng",
      value: stats.customers,
      icon: Shield,
      gradient: "from-green-400 via-emerald-500 to-teal-600",
      bgGradient: "from-green-50/80 via-emerald-50/80 to-teal-50/80",
      description: "Customer accounts",
      trend: "+8%",
    },
    {
      title: "Mới (7 ngày)",
      value: stats.recent,
      icon: TrendingUp,
      gradient: "from-pink-400 via-rose-500 to-red-600",
      bgGradient: "from-pink-50/80 via-rose-50/80 to-red-50/80",
      description: "Đăng ký gần đây",
      trend: "+5%",
    },
  ];

  // Pagination component
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
        <div className="text-sm text-orange-700/80">
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
            className="group bg-white/80 hover:bg-white border-orange-200/50 hover:border-orange-300 rounded-2xl shadow-md"
          >
            <ChevronLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
            <span className="text-orange-800 font-semibold">Trước</span>
          </Button>

          <div className="flex items-center space-x-1">
            {getVisiblePages().map((page, index) => (
              <React.Fragment key={index}>
                {page === "..." ? (
                  <span className="px-3 py-2 text-orange-600/80">...</span>
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page as number)}
                      className={`min-w-[40px] transition-all rounded-2xl ${
                        currentPage === page
                          ? "bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-lg"
                          : "bg-white/80 hover:bg-white border-orange-200/50 hover:border-orange-300 text-orange-700 hover:text-orange-900"
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
            className="group bg-white/80 hover:bg-white border-orange-200/50 hover:border-orange-300 rounded-2xl shadow-md"
          >
            <span className="text-orange-800 font-semibold">Sau</span>
            <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </motion.div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-pink-50">
        {/* Floating Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-1/4"
            animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <Users className="w-8 h-8 text-orange-400 opacity-20" />
          </motion.div>
          <motion.div
            className="absolute top-1/3 right-1/4"
            animate={{ y: [0, -15, 0], rotate: [0, -10, 0] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          >
            <Shield className="w-6 h-6 text-pink-400 opacity-20" />
          </motion.div>
          <motion.div
            className="absolute bottom-1/4 left-1/3"
            animate={{ y: [0, -25, 0], rotate: [0, 15, 0] }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          >
            <Coffee className="text-amber-400 w-7 h-7 opacity-20" />
          </motion.div>
        </div>

        <div className="container relative z-10 px-4 py-8 mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center min-h-screen"
          >
            <Card className="py-12 text-center border-0 shadow-2xl bg-gradient-to-br from-white/95 to-orange-50/80 backdrop-blur-xl rounded-3xl">
              <CardContent>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 mx-auto mb-4 border-4 rounded-full border-orange-500 border-t-transparent"
                />
                <h2 className="mb-2 text-xl font-semibold text-orange-800">
                  Đang tải người dùng...
                </h2>
                <p className="text-orange-600/80">
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-pink-50">
      {/* Floating Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4"
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Code className="w-8 h-8 text-orange-400 opacity-20" />
        </motion.div>
        <motion.div
          className="absolute top-1/3 right-1/4"
          animate={{ y: [0, -15, 0], rotate: [0, -10, 0] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          <Palette className="w-6 h-6 text-pink-400 opacity-20" />
        </motion.div>
        <motion.div
          className="absolute bottom-1/4 left-1/3"
          animate={{ y: [0, -25, 0], rotate: [0, 15, 0] }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        >
          <Coffee className="text-amber-400 w-7 h-7 opacity-20" />
        </motion.div>
        <motion.div
          className="absolute top-2/3 right-1/3"
          animate={{ y: [0, -18, 0], scale: [1, 1.1, 1] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
        >
          <Heart className="w-5 h-5 text-pink-300 opacity-20" />
        </motion.div>
        <motion.div
          className="absolute top-1/6 right-1/6"
          animate={{ y: [0, -12, 0], rotate: [0, -5, 0] }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
        >
          <Sparkles className="w-4 h-4 text-yellow-400 opacity-20" />
        </motion.div>
      </div>

      {/* Toast Container */}
      <div className="fixed top-0 right-0 z-50 p-4 space-y-3">
        <AnimatePresence>
          {toasts.map((toast) => (
            <FloatingToast
              key={toast.id}
              type={toast.type}
              title={toast.title}
              description={toast.description}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      <div className="container relative z-10 px-4 py-8 mx-auto space-y-8">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-6 bg-gradient-to-r from-white/90 via-orange-50/90 to-pink-50/90 backdrop-blur-xl border border-orange-200/50 rounded-3xl shadow-lg"
          id="header"
          data-animate
        >
          <div className="flex items-center space-x-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="group bg-white/60 hover:bg-white/80 rounded-2xl shadow-md"
              >
                <Link to="/admin">
                  <ArrowLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1 text-orange-600" />
                  <span className="font-semibold text-orange-800">
                    Về Dashboard
                  </span>
                </Link>
              </Button>
            </motion.div>
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="flex items-center justify-center w-16 h-16 shadow-xl rounded-3xl bg-gradient-to-r from-orange-500 via-amber-500 to-pink-600"
              >
                <Users className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-orange-600 via-amber-600 to-pink-600 bg-clip-text">
                  Quản lý người dùng
                </h1>
                <p className="text-orange-700/80 mt-1 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Quản lý tài khoản và quyền người dùng</span>
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
                className="transition-all duration-300 group bg-white/80 hover:bg-white border-orange-200/50 hover:border-orange-300 rounded-2xl shadow-md hover:shadow-lg"
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
                  <RefreshCw className="w-4 h-4 mr-2 group-hover:animate-spin text-orange-600" />
                )}
                <span className="text-orange-800 font-semibold">Làm mới</span>
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
                  <Button className="transition-all duration-300 shadow-lg bg-gradient-to-r from-orange-500 via-amber-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 hover:shadow-xl rounded-2xl">
                    <UserPlus className="w-4 h-4 mr-2" />
                    <span className="font-semibold">Thêm người dùng</span>
                    <Sparkles className="w-4 h-4 ml-1" />
                  </Button>
                </motion.div>
              </DialogTrigger>
              <DialogContent className="max-w-md bg-gradient-to-br from-white to-orange-50/80 border-0 shadow-2xl rounded-3xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                    <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-600 shadow-lg">
                      <UserPlus className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl text-transparent bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text font-bold">
                      Tạo người dùng mới
                    </span>
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <motion.div
                    className="space-y-2"
                    whileFocus={{ scale: 1.01 }}
                  >
                    <Label
                      htmlFor="name"
                      className="text-sm font-semibold text-orange-800"
                    >
                      Họ tên *
                    </Label>
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
                      className="h-12 transition-all duration-300 focus:ring-2 focus:ring-orange-400/20 bg-white/80 border-orange-200/50 rounded-2xl shadow-md"
                    />
                  </motion.div>

                  <motion.div
                    className="space-y-2"
                    whileFocus={{ scale: 1.01 }}
                  >
                    <Label
                      htmlFor="email"
                      className="text-sm font-semibold text-orange-800"
                    >
                      Email *
                    </Label>
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
                      className="h-12 transition-all duration-300 focus:ring-2 focus:ring-orange-400/20 bg-white/80 border-orange-200/50 rounded-2xl shadow-md"
                    />
                  </motion.div>

                  <motion.div
                    className="space-y-2"
                    whileFocus={{ scale: 1.01 }}
                  >
                    <Label
                      htmlFor="password"
                      className="text-sm font-semibold text-orange-800"
                    >
                      Mật khẩu *
                    </Label>
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
                      className="h-12 transition-all duration-300 focus:ring-2 focus:ring-orange-400/20 bg-white/80 border-orange-200/50 rounded-2xl shadow-md"
                    />
                  </motion.div>

                  <motion.div
                    className="space-y-2"
                    whileFocus={{ scale: 1.01 }}
                  >
                    <Label
                      htmlFor="role"
                      className="text-sm font-semibold text-orange-800"
                    >
                      Quyền
                    </Label>
                    <Select
                      value={newUser.role}
                      onValueChange={(value: "admin" | "customer") =>
                        setNewUser((prev) => ({ ...prev, role: value }))
                      }
                      disabled={isCreating}
                    >
                      <SelectTrigger className="h-12 bg-white/80 border-orange-200/50 rounded-2xl shadow-md">
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

                  <div className="flex justify-end pt-4 space-x-3 border-t border-orange-200/50">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outline"
                        onClick={() => setIsCreateDialogOpen(false)}
                        disabled={isCreating}
                        className="bg-white/80 border-orange-200/50 hover:border-orange-300 rounded-2xl shadow-md"
                      >
                        <X className="w-4 h-4 mr-2" />
                        <span className="text-orange-800 font-semibold">
                          Hủy
                        </span>
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        onClick={handleCreateUser}
                        disabled={isCreating}
                        className="bg-gradient-to-r from-orange-500 via-amber-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 rounded-2xl shadow-lg"
                      >
                        {isCreating ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            <span className="font-semibold">Đang tạo...</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            <span className="font-semibold">
                              Tạo người dùng
                            </span>
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

        {/* Enhanced Stats Cards */}
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
              whileHover={{ y: -8, scale: 1.03 }}
              className="transition-all duration-500"
            >
              <Card
                className={`relative overflow-hidden border-0 bg-gradient-to-br ${stat.bgGradient} backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 group rounded-3xl`}
                style={{ minHeight: 140 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50" />
                <CardContent className="relative pt-4 pb-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="text-2xl font-bold text-orange-900 mb-1"
                      >
                        {stat.value}
                      </motion.div>
                      <div className="text-xs font-semibold text-orange-800/90 mb-1">
                        {stat.title}
                      </div>
                      <div className="text-xs text-orange-700/70">
                        {stat.description}
                      </div>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.15, rotate: 10 }}
                      className={`w-10 h-10 rounded-2xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 flex-shrink-0`}
                    >
                      <stat.icon className="w-5 h-5 text-white" />
                    </motion.div>
                  </div>
                  <div
                    className={`flex items-center text-xs ${
                      stat.trend.startsWith("+")
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    <div
                      className={`p-1 rounded-full mr-1 ${
                        stat.trend.startsWith("+")
                          ? "bg-emerald-100"
                          : "bg-red-100"
                      }`}
                    >
                      <TrendingUp
                        className={`w-2 h-2 ${
                          !stat.trend.startsWith("+") ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                    <span className="font-semibold">{stat.trend}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          id="filters"
          data-animate
        >
          <Card className="border-0 shadow-xl bg-gradient-to-r from-white/95 via-orange-50/80 to-pink-50/80 backdrop-blur-xl rounded-3xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-orange-500 to-pink-600 shadow-lg">
                    <Filter className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-transparent bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text font-bold">
                      Bộ lọc và tìm kiếm
                    </CardTitle>
                    <p className="text-sm text-orange-700/80 mt-1">
                      Tìm kiếm và lọc người dùng theo tiêu chí
                    </p>
                  </div>
                </div>
                <Badge className="bg-gradient-to-r from-orange-200 to-pink-200 text-orange-800 border-0 shadow-sm">
                  <Target className="w-3 h-3 mr-1" />
                  {filteredUsers.length} kết quả
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 md:flex-row">
                <motion.div
                  className="relative flex-1"
                  whileFocus={{ scale: 1.01 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-pink-400/20 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  <div className="relative flex items-center space-x-3 p-4 bg-gradient-to-r from-white/90 to-orange-50/90 backdrop-blur-xl border border-orange-200/50 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <Search className="flex-shrink-0 w-5 h-5 text-orange-600 group-hover:text-orange-800 transition-colors" />
                    <Input
                      placeholder="Tìm kiếm theo tên hoặc email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 text-sm bg-transparent border-none outline-none placeholder:text-orange-500/60 text-orange-800 font-medium"
                    />
                  </div>
                </motion.div>

                <motion.div whileFocus={{ scale: 1.01 }}>
                  <Select
                    value={roleFilter}
                    onValueChange={(value: any) => setRoleFilter(value)}
                  >
                    <SelectTrigger className="w-full md:w-[180px] h-16 bg-white/80 border-orange-200/50 rounded-2xl shadow-md">
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

        {/* Enhanced Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          id="users"
          data-animate
        >
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white/95 via-orange-50/80 to-pink-50/80 backdrop-blur-xl rounded-3xl overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-transparent bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text font-bold">
                      Danh sách người dùng
                    </CardTitle>
                    <p className="text-sm text-green-700/80 mt-1">
                      Trang {currentPage} / {totalPages} -{" "}
                      {filteredUsers.length} người dùng được tìm thấy
                    </p>
                  </div>
                </div>
                <Badge className="bg-gradient-to-r from-green-200 to-emerald-200 text-green-800 border-0 shadow-sm">
                  <Activity className="w-3 h-3 mr-1" />
                  {currentUsers.length} hiển thị
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-muted/50 border-orange-200/30">
                      <TableHead className="font-semibold text-orange-800">
                        Người dùng
                      </TableHead>
                      <TableHead className="font-semibold text-orange-800">
                        Email
                      </TableHead>
                      <TableHead className="font-semibold text-orange-800">
                        Quyền
                      </TableHead>
                      <TableHead className="font-semibold text-orange-800">
                        Ngày tham gia
                      </TableHead>
                      <TableHead className="font-semibold text-orange-800 text-right">
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
                          whileHover={{
                            backgroundColor: "rgba(255,245,235,0.5)",
                          }}
                          className="transition-all duration-300 group hover:shadow-md border-orange-200/20"
                        >
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <motion.div whileHover={{ scale: 1.1 }}>
                                <Avatar className="transition-transform duration-300">
                                  <AvatarImage src={userItem.avatar} />
                                  <AvatarFallback className="text-white bg-gradient-to-r from-orange-500 to-pink-600">
                                    {getInitials(userItem.name)}
                                  </AvatarFallback>
                                </Avatar>
                              </motion.div>
                              <div>
                                <div className="font-semibold transition-colors group-hover:text-orange-700 text-orange-900">
                                  {userItem.name}
                                </div>
                                {userItem.id === user.id && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs text-amber-800 bg-amber-100 mt-1"
                                  >
                                    <Sparkles className="w-3 h-3 mr-1" />
                                    Bạn
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium text-orange-800">
                              {userItem.email}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                userItem.role === "admin"
                                  ? "default"
                                  : "secondary"
                              }
                              className={`transition-all duration-300 group-hover:scale-105 ${
                                userItem.role === "admin"
                                  ? "bg-purple-100 text-purple-800 border-purple-300"
                                  : "bg-green-100 text-green-800 border-green-300"
                              }`}
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
                              <div className="flex items-center space-x-1 text-sm font-medium text-orange-800">
                                <Clock className="w-3 h-3" />
                                <span>
                                  {new Date(
                                    userItem.createdAt,
                                  ).toLocaleDateString("vi-VN")}
                                </span>
                              </div>
                              <div className="text-xs text-orange-600/80">
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
                                    className="group/btn bg-white/60 hover:bg-white/80 rounded-2xl shadow-md"
                                  >
                                    <MoreHorizontal className="w-4 h-4 transition-colors group-hover/btn:text-orange-600" />
                                  </Button>
                                </motion.div>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
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
                                      className="text-red-600 focus:text-red-600"
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

              {/* Enhanced Empty State */}
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
                    className="mb-6"
                  >
                    <div className="relative">
                      <Users className="w-20 h-20 mx-auto text-orange-400/50" />
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "reverse",
                        }}
                        className="absolute -top-2 -right-2"
                      >
                        <AlertTriangle className="w-8 h-8 text-amber-500" />
                      </motion.div>
                    </div>
                  </motion.div>
                  <h3 className="mb-4 text-2xl font-bold text-transparent bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text">
                    Không tìm thấy người dùng
                  </h3>
                  <p className="max-w-md mx-auto mb-6 text-orange-700/80 leading-relaxed">
                    Thử thay đổi bộ lọc hoặc tạo người dùng mới để bắt đầu quản
                    lý.
                  </p>
                  <div className="space-y-4">
                    <div className="flex justify-center space-x-3">
                      <Button
                        onClick={() => {
                          setSearchQuery("");
                          setRoleFilter("all");
                        }}
                        variant="outline"
                        className="bg-white/80 hover:bg-white border-orange-200/50 hover:border-orange-300 rounded-2xl shadow-md"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        <span className="text-orange-800 font-semibold">
                          Xóa bộ lọc
                        </span>
                      </Button>
                      <Button
                        onClick={() => setIsCreateDialogOpen(true)}
                        className="bg-gradient-to-r from-orange-500 via-amber-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 rounded-2xl shadow-lg"
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        <span className="font-semibold">
                          Thêm người dùng mới
                        </span>
                        <Sparkles className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Pagination Component */}
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
