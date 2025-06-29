import React from "react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  User,
  Package,
  Download,
  Shield,
  UserCog,
  BarChart3,
  Settings,
  LogOut,
  Crown,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { isAdmin, getInitials } from "@/lib/auth";

const UserMenu: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
      window.location.href = "/";
    }
  };

  if (!user) {
    return (
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/auth/login">Đăng nhập</Link>
        </Button>
        <Button
          size="sm"
          asChild
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          <Link to="/auth/register">Đăng ký</Link>
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative rounded-full h-9 w-9">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="text-white bg-gradient-to-r from-blue-500 to-purple-600">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          {isAdmin(user) && (
            <div className="absolute flex items-center justify-center w-4 h-4 rounded-full -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-orange-500">
              <Crown className="w-2 h-2 text-white" />
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              {isAdmin(user) && (
                <Badge
                  variant="secondary"
                  className="text-xs text-yellow-800 bg-yellow-100"
                >
                  <Crown className="w-3 h-3 mr-1" />
                  Admin
                </Badge>
              )}
            </div>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link to="/profile" className="cursor-pointer">
            <User className="w-4 h-4 mr-2" />
            <span>Hồ sơ</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link to="/my-orders" className="cursor-pointer">
            <Package className="w-4 h-4 mr-2" />
            <span>Đơn hàng của tôi</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link to="/downloads" className="cursor-pointer">
            <Download className="w-4 h-4 mr-2" />
            <span>Downloads</span>
          </Link>
        </DropdownMenuItem>

        {isAdmin(user) && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/admin" className="cursor-pointer">
                <Shield className="w-4 h-4 mr-2" />
                <span>Quản trị hệ thống</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/admin/users" className="cursor-pointer">
                <UserCog className="w-4 h-4 mr-2" />
                <span>Quản lý Users</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/admin/analytics" className="cursor-pointer">
                <BarChart3 className="w-4 h-4 mr-2" />
                <span>Analytics</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuItem asChild>
          <Link to="/settings" className="cursor-pointer">
            <Settings className="w-4 h-4 mr-2" />
            <span>Cài đặt</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
          <LogOut className="w-4 h-4 mr-2" />
          <span>Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
