import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import { performLogout } from "@/lib/auth";
import { AuthContextType, RegisterData, User } from "@/types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        // Không sử dụng timeout - để Supabase tự xử lý
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (!mounted) return;

        if (error) {
          console.error("Session error:", error);
          setIsLoading(false);
          return;
        }

        if (session?.user) {
          try {
            // Fetch profile với fallback
            const { data: profile } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", session.user.id)
              .single();

            if (mounted) {
              if (profile) {
                setUser({
                  ...session.user,
                  ...profile,
                  email: session.user.email || profile.email || "",
                  createdAt: profile.created_at || new Date().toISOString(),
                });
              } else {
                // Fallback user data nếu không có profile
                setUser({
                  ...session.user,
                  name: session.user.email?.split("@")[0] || "User",
                  role: "customer",
                  avatar: "",
                  email: session.user.email || "",
                  createdAt: new Date().toISOString(),
                });
              }
            }
          } catch (profileError) {
            console.error("Profile fetch error:", profileError);
            if (mounted) {
              // Set fallback user ngay cả khi profile fetch fail
              setUser({
                ...session.user,
                name: session.user.email?.split("@")[0] || "User",
                role: "customer",
                avatar: "",
                email: session.user.email || "",
                createdAt: new Date().toISOString(),
              });
            }
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    init();

    // Listen for auth changes với debounce
    let authTimeout: NodeJS.Timeout;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      console.log("Auth state change:", event);

      // Clear previous timeout
      if (authTimeout) clearTimeout(authTimeout);

      // Debounce auth state changes
      authTimeout = setTimeout(async () => {
        if (!mounted) return;

        if (event === "SIGNED_IN" && session?.user) {
          try {
            const { data: profile } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", session.user.id)
              .single();

            if (mounted) {
              if (profile) {
                setUser({
                  ...session.user,
                  ...profile,
                  email: session.user.email || profile.email || "",
                  createdAt: profile.created_at || new Date().toISOString(),
                });
              } else {
                setUser({
                  ...session.user,
                  name: session.user.email?.split("@")[0] || "User",
                  role: "customer",
                  avatar: "",
                  email: session.user.email || "",
                  createdAt: new Date().toISOString(),
                });
              }
            }
          } catch (error) {
            console.error("Error fetching profile on sign in:", error);
            if (mounted) {
              setUser({
                ...session.user,
                name: session.user.email?.split("@")[0] || "User",
                role: "customer",
                avatar: "",
                email: session.user.email || "",
                createdAt: new Date().toISOString(),
              });
            }
          }
        } else if (event === "SIGNED_OUT") {
          if (mounted) setUser(null);
        } else if (event === "TOKEN_REFRESHED") {
          console.log("Token refreshed successfully");
        }
      }, 100);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
      if (authTimeout) clearTimeout(authTimeout);
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Không sử dụng timeout - để Supabase tự xử lý
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error.message);
        return false;
      }

      if (!data.user) {
        console.error("No user data returned");
        return false;
      }

      // Không set user ở đây - để onAuthStateChange handle
      return true;
    } catch (error) {
      console.error("Login exception:", error);
      return false;
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          name: updates.name,
          avatar: updates.avatar,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) {
        console.error("Error updating profile:", error);
        return false;
      }

      setUser((prev) => (prev ? { ...prev, ...updates } : prev));
      return true;
    } catch (error) {
      console.error("Exception in updateProfile:", error);
      return false;
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    try {
      const { email, password, name } = userData;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
        },
      });

      if (error) {
        console.error("Signup error:", error.message);
        return false;
      }

      if (!data.user) {
        console.error("No user data returned from signup");
        return false;
      }

      // Tạo profile
      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        name,
        role: "customer",
        avatar: "",
        email: email,
        created_at: new Date().toISOString(),
      });

      if (profileError) {
        console.error("Profile creation error:", profileError);
        return false;
      }

      // Set user state
      setUser({
        id: data.user.id,
        email: data.user.email ?? email,
        name,
        role: "customer",
        avatar: "",
        createdAt: new Date().toISOString(),
      });

      return true;
    } catch (error) {
      console.error("Registration exception:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await performLogout();
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
    updateProfile,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
