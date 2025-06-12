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
  Loader2,
  Save,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const UserManagement: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
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

  if (!user || !isAdmin(user)) {
    return <Navigate to="/" replace />;
  }

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Thêm handlers
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

  // Fetch data từ Supabase
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
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Lỗi tải dữ liệu",
          description: "Không thể tải dữ liệu người dùng. Vui lòng thử lại.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredUsers = users.filter((userItem) => {
    const matchesSearch =
      userItem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      userItem.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === "all" || userItem.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const handleDeleteUser = async (userId: string) => {
    if (userId === user.id) {
      toast({
        title: "Không thể xóa",
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
        title: "Đã xóa người dùng",
        description: "Người dùng đã được xóa khỏi hệ thống.",
      });
    } else {
      toast({
        title: "Lỗi xóa người dùng",
        description: "Có lỗi xảy ra khi xóa người dùng.",
        variant: "destructive",
      });
    }
  };

  const handleToggleRole = async (userId: string) => {
    if (userId === user.id) {
      toast({
        title: "Không thể thay đổi",
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
        title: "Cập nhật thành công",
        description: "Quyền người dùng đã được cập nhật.",
      });
    } else {
      toast({
        title: "Lỗi cập nhật",
        description: "Có lỗi xảy ra khi cập nhật quyền người dùng.",
        variant: "destructive",
      });
    }
  };

  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast({
        title: "Thiếu thông tin",
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
          title: "Tạo thành công",
          description: "Người dùng mới đã được tạo.",
        });
      } else {
        throw new Error("Không thể tạo người dùng");
      }
    } catch (error) {
      toast({
        title: "Lỗi tạo người dùng",
        description: "Có lỗi xảy ra khi tạo người dùng mới.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
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
    <div className="container px-4 py-8 mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/admin">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Về Dashboard
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
              Quản lý người dùng
            </h1>
            <p className="text-muted-foreground">
              Quản lý tài khoản và quyền người dùng
            </p>
          </div>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              <UserPlus className="w-4 h-4 mr-2" />
              Thêm người dùng
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tạo người dùng mới</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Họ tên *</Label>
                <Input
                  id="name"
                  placeholder="Nhập họ tên"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser((prev) => ({ ...prev, name: e.target.value }))
                  }
                  disabled={isCreating}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Nhập email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser((prev) => ({ ...prev, email: e.target.value }))
                  }
                  disabled={isCreating}
                />
              </div>

              <div className="space-y-2">
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
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Quyền</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value: "admin" | "customer") =>
                    setNewUser((prev) => ({ ...prev, role: value }))
                  }
                  disabled={isCreating}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">Khách hàng</SelectItem>
                    <SelectItem value="admin">Quản trị viên</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end pt-4 space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                  disabled={isCreating}
                >
                  Hủy
                </Button>
                <Button onClick={handleCreateUser} disabled={isCreating}>
                  {isCreating ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Tạo người dùng
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-muted-foreground">
                Tổng người dùng
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {stats.admins}
              </div>
              <div className="text-sm text-muted-foreground">Quản trị viên</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {stats.customers}
              </div>
              <div className="text-sm text-muted-foreground">Khách hàng</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {stats.recent}
              </div>
              <div className="text-sm text-muted-foreground">Mới (7 ngày)</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên hoặc email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={roleFilter}
              onValueChange={(value: any) => setRoleFilter(value)}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Quyền" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả quyền</SelectItem>
                <SelectItem value="admin">Quản trị viên</SelectItem>
                <SelectItem value="customer">Khách hàng</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách người dùng ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Người dùng</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Quyền</TableHead>
                  <TableHead>Ngày tham gia</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((userItem) => (
                  <TableRow key={userItem.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={userItem.avatar} />
                          <AvatarFallback>
                            {getInitials(userItem.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{userItem.name}</div>
                          {userItem.id === user.id && (
                            <Badge variant="outline" className="text-xs">
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
                          userItem.role === "admin" ? "default" : "secondary"
                        }
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
                      <div>
                        <div className="text-sm">
                          {new Date(userItem.createdAt).toLocaleDateString(
                            "vi-VN",
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(userItem.createdAt).toLocaleTimeString(
                            "vi-VN",
                          )}
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
                                onClick={() => handleToggleRole(userItem.id)}
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
                                onClick={() => handleDeleteUser(userItem.id)}
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="py-8 text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">
                Không tìm thấy người dùng
              </h3>
              <p className="text-muted-foreground">
                Thử thay đổi bộ lọc để xem người dùng khác
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      <UserDetailModal
        user={selectedUser}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        onUpdate={handleUpdateUser}
        isEditing={isEditMode}
      />
    </div>
  );
};

export default UserManagement;
