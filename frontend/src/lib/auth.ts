import { supabase } from "@/lib/supabase";
import { User } from "@/types";

export function isAdmin(user: User | null): boolean {
  return user?.role === "admin";
}

export function isCustomer(user: User | null): boolean {
  return user?.role === "customer";
}

export function isAuthenticated(user: User | null): boolean {
  return user !== null;
}

export function getFullName(user: User | null): string {
  return user?.name || "Người dùng";
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Simple logout function
export const performLogout = async () => {
  try {
    // 1. Sign out từ Supabase
    await supabase.auth.signOut();

    // 2. Clear localStorage
    localStorage.clear();
    sessionStorage.clear();

    // 3. Redirect về trang chủ
    window.location.href = "/";
  } catch (error) {
    console.error("Logout error:", error);
    // Force cleanup và redirect
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/";
  }
};

// Helper functions
export const isSessionValid = async (): Promise<boolean> => {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    return !error && !!session;
  } catch {
    return false;
  }
};

export const getCurrentUser = async () => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    return error ? null : user;
  } catch {
    return null;
  }
};
