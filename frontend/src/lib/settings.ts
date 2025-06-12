import { supabase } from "@/lib/supabase";

export interface SystemSettings {
  id?: string;
  general: {
    siteName: string;
    siteDescription: string;
    siteUrl: string;
    adminEmail: string;
    timezone: string;
    language: string;
    currency: string;
  };
  notifications: {
    emailNotifications: boolean;
    orderNotifications: boolean;
    userRegistrations: boolean;
    systemAlerts: boolean;
    marketingEmails: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    sessionTimeout: number;
    passwordExpiry: number;
    maxLoginAttempts: number;
    requireStrongPasswords: boolean;
  };
  appearance: {
    theme: string;
    primaryColor: string;
    secondaryColor: string;
    darkMode: boolean;
    compactMode: boolean;
  };
  integrations: {
    googleAnalytics: string;
    facebookPixel: string;
    mailchimp: string;
    stripe: string;
    paypal: string;
  };
  updatedAt?: string;
}

// lib/settings.ts - Cập nhật getSystemSettings
export const getSystemSettings = async (): Promise<SystemSettings | null> => {
  const { data, error } = await supabase
    .from("system_settings")
    .select("*")
    .eq("id", "system")
    .limit(1)
    .single();

  if (error) {
    console.error("Error fetching settings:", error.message);
    // Nếu không tìm thấy, tạo settings mặc định
    if (error.code === 'PGRST116') {
      return await createDefaultSettings();
    }
    return null;
  }

  return data;
};

// Function tạo settings mặc định
const createDefaultSettings = async (): Promise<SystemSettings | null> => {
  const defaultSettings: SystemSettings = {
    general: {
      siteName: "Template Market",
      siteDescription: "Premium templates and e-books marketplace",
      siteUrl: "https://templatemarket.com",
      adminEmail: "admin@templatemarket.com",
      timezone: "Asia/Ho_Chi_Minh",
      language: "vi",
      currency: "VND",
    },
    notifications: {
      emailNotifications: true,
      orderNotifications: true,
      userRegistrations: true,
      systemAlerts: true,
      marketingEmails: false,
    },
    security: {
      twoFactorAuth: true,
      sessionTimeout: 30,
      passwordExpiry: 90,
      maxLoginAttempts: 5,
      requireStrongPasswords: true,
    },
    appearance: {
      theme: "system",
      primaryColor: "#3b82f6",
      secondaryColor: "#8b5cf6",
      darkMode: true,
      compactMode: false,
    },
    integrations: {
      googleAnalytics: "",
      facebookPixel: "",
      mailchimp: "",
      stripe: "",
      paypal: "",
    },
  };

  const { data, error } = await supabase
    .from("system_settings")
    .insert({
      id: "system",
      ...defaultSettings,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating default settings:", error);
    return null;
  }

  return data;
};

// Lưu settings vào database
export const saveSystemSettings = async (settings: SystemSettings): Promise<boolean> => {
  const { error } = await supabase
    .from("system_settings")
    .upsert({
      id: "system", // Single row với fixed ID
      ...settings,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    console.error("Error saving settings:", error.message);
    return false;
  }

  return true;
};

// Lưu một section cụ thể
export const saveSectionSettings = async (
  section: keyof Omit<SystemSettings, 'id' | 'updatedAt'>,
  data: any
): Promise<boolean> => {
  const { error } = await supabase
    .from("system_settings")
    .upsert({
      id: "system",
      [section]: data,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    console.error(`Error saving ${section} settings:`, error.message);
    return false;
  }

  return true;
};

// Reset settings về mặc định
export const resetToDefaultSettings = async (): Promise<boolean> => {
  const defaultSettings: SystemSettings = {
    general: {
      siteName: "Template Market",
      siteDescription: "Premium templates and e-books marketplace",
      siteUrl: "https://templatemarket.com",
      adminEmail: "admin@templatemarket.com",
      timezone: "Asia/Ho_Chi_Minh",
      language: "vi",
      currency: "VND",
    },
    notifications: {
      emailNotifications: true,
      orderNotifications: true,
      userRegistrations: true,
      systemAlerts: true,
      marketingEmails: false,
    },
    security: {
      twoFactorAuth: true,
      sessionTimeout: 30,
      passwordExpiry: 90,
      maxLoginAttempts: 5,
      requireStrongPasswords: true,
    },
    appearance: {
      theme: "system",
      primaryColor: "#3b82f6",
      secondaryColor: "#8b5cf6",
      darkMode: true,
      compactMode: false,
    },
    integrations: {
      googleAnalytics: "",
      facebookPixel: "",
      mailchimp: "",
      stripe: "",
      paypal: "",
    },
  };

  return await saveSystemSettings(defaultSettings);
};

