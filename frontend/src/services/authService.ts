import { supabase } from "@/lib/supabase";
import { RegisterData } from "@/types";

export const signUp = async (data: RegisterData) => {
  const { email, password, name } = data;

  const { data: signupData, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error || !signupData.user) return { error };

  // Tạo thêm profile
  const { error: profileError } = await supabase
    .from("profiles")
    .insert({
      id: signupData.user.id,
      name,
      role: "customer",
    });

  return { user: signupData.user, error: profileError };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { user: data?.user ?? null, error };
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};
