import { supabase } from "@/lib/supabase";
import { User } from "@/types";

// Normalize user data từ Supabase
export const normalizeUser = (user: any): User => ({
  id: user.id,
  email: user.email,
  name: user.name,
  role: user.role || "customer",
  avatar: user.avatar,
  createdAt: user.created_at,
});

// Lấy tất cả users
export const getAllUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching users:", error.message);
    return [];
  }

  return (data || []).map(normalizeUser);
};

// Lấy user theo ID
export const getUserById = async (id: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching user:", error.message);
    return null;
  }

  return normalizeUser(data);
};

// Cập nhật role user
export const updateUserRole = async (userId: string, role: "admin" | "customer"): Promise<boolean> => {
  const { error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", userId);

  if (error) {
    console.error("Error updating user role:", error.message);
    return false;
  }

  return true;
};

// Cập nhật thông tin user
export const updateUser = async (userId: string, updates: Partial<User>): Promise<boolean> => {
  const { error } = await supabase
    .from("profiles")
    .update({
      name: updates.name,
      avatar: updates.avatar,
      role: updates.role,
    })
    .eq("id", userId);

  if (error) {
    console.error("Error updating user:", error.message);
    return false;
  }

  return true;
};

// Xóa user
export const deleteUser = async (userId: string): Promise<boolean> => {
  try {
    // Xóa từ auth.users (cascade sẽ xóa profile)
    const { error: authError } = await supabase.auth.admin.deleteUser(userId);
    
    if (authError) {
      console.error("Error deleting user from auth:", authError.message);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error deleting user:", error);
    return false;
  }
};

// Tạo user mới
export const createUser = async (userData: {
  email: string;
  password: string;
  name: string;
  role?: "admin" | "customer";
}): Promise<User | null> => {
  try {
    // Tạo user trong auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true,
    });

    if (authError || !authData.user) {
      console.error("Error creating auth user:", authError?.message);
      return null;
    }

    // Tạo profile
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: authData.user.id,
        name: userData.name,
        role: userData.role || "customer",
        email: userData.email,
      })
      .select()
      .single();

    if (profileError) {
      console.error("Error creating profile:", profileError.message);
      return null;
    }

    return normalizeUser(profileData);
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
};

// Lấy thống kê users
export const getUserStats = async () => {
  const { count: totalCount, error: totalError } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  const { count: adminCount, error: adminError } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "admin");

  const { count: customerCount, error: customerError } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "customer");

  // Lấy users mới trong 7 ngày qua
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  
  const { count: recentCount, error: recentError } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .gte("created_at", weekAgo.toISOString());

  if (totalError || adminError || customerError || recentError) {
    console.error("Error fetching user stats");
    return {
      total: 0,
      admins: 0,
      customers: 0,
      recent: 0,
    };
  }

  return {
    total: totalCount || 0,
    admins: adminCount || 0,
    customers: customerCount || 0,
    recent: recentCount || 0,
  };
};

// Search users
export const searchUsers = async (query: string): Promise<User[]> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .or(`name.ilike.%${query}%, email.ilike.%${query}%`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error searching users:", error.message);
    return [];
  }

  return (data || []).map(normalizeUser);
};
