// lib/contacts.ts
import { supabase } from "@/lib/supabase";
import emailjs from "@emailjs/browser";

// ✅ Interface giữ nguyên
export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  category:
    | "support"
    | "sales"
    | "partnership"
    | "feedback"
    | "media"
    | "other";
  message: string;
  status: "new" | "read" | "replied" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateContactData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  category: Contact["category"];
  message: string;
}

// ✅ EmailJS Configuration
const EMAILJS_CONFIG = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_abc123",
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_xyz789",
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "1q76Igr3o_xeVe3xS",
};

// ✅ Initialize EmailJS (chỉ cần gọi 1 lần)
emailjs.init(EMAILJS_CONFIG.publicKey);

// ✅ Tạo contact mới VÀ gửi email
export async function createContact(
  contactData: CreateContactData,
): Promise<Contact> {
  // Determine priority based on category
  let priority: Contact["priority"] = "medium";
  if (contactData.category === "support") priority = "high";
  if (contactData.category === "partnership") priority = "high";
  if (contactData.category === "media") priority = "urgent";

  const { data, error } = await supabase
    .from("contacts")
    .insert({
      name: contactData.name,
      email: contactData.email,
      phone: contactData.phone || null,
      company: contactData.company || null,
      subject: contactData.subject,
      category: contactData.category,
      message: contactData.message,
      priority,
      status: "new",
      is_read: false,
    })
    .select()
    .single();

  if (error) {
    console.error("⛔ Lỗi khi tạo contact:", error.message, error.details);
    throw error;
  }

  // ✅ Gửi email thông báo qua EmailJS
  try {
    await sendContactNotificationEmail(data);
    console.log("✅ Email notification sent successfully via EmailJS");
  } catch (emailError) {
    console.warn("⚠️ Email notification failed:", emailError);
    // Không throw error vì contact đã được lưu thành công
  }

  return data;
}

// ✅ Function gửi email qua EmailJS
async function sendContactNotificationEmail(contact: Contact): Promise<void> {
  const categoryIcons = {
    support: "🛠️",
    sales: "💼",
    partnership: "🤝",
    feedback: "💭",
    media: "📺",
    other: "📧",
  };

  const templateParams = {
    // ✅ Các biến này phải match với EmailJS template
    to_email: "veutong961@gmail.com",
    contact_name: contact.name,
    contact_email: contact.email,
    contact_phone: contact.phone || "Không có",
    contact_company: contact.company || "Không có",
    contact_subject: contact.subject,
    contact_category: contact.category.toUpperCase(),
    contact_message: contact.message,
    contact_priority: contact.priority.toUpperCase(),
    category_icon: categoryIcons[contact.category],
    created_time: new Date(contact.created_at).toLocaleString("vi-VN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  try {
    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      templateParams,
    );

    if (response.status === 200) {
      console.log("✅ EmailJS sent successfully:", response);
    } else {
      throw new Error(`EmailJS failed with status: ${response.status}`);
    }
  } catch (error) {
    console.error("❌ EmailJS error:", error);
    throw error;
  }
}

// ✅ Các functions khác giữ nguyên
export async function getContacts(filters?: {
  status?: Contact["status"];
  category?: Contact["category"];
  limit?: number;
  offset?: number;
}): Promise<Contact[]> {
  let query = supabase
    .from("contacts")
    .select("*")
    .order("created_at", { ascending: false });

  if (filters?.status) {
    query = query.eq("status", filters.status);
  }

  if (filters?.category) {
    query = query.eq("category", filters.category);
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  if (filters?.offset) {
    query = query.range(
      filters.offset,
      filters.offset + (filters.limit || 10) - 1,
    );
  }

  const { data, error } = await query;

  if (error) {
    console.error("⛔ Lỗi khi lấy contacts:", error.message);
    throw error;
  }

  return data || [];
}

export async function markContactAsRead(contactId: string): Promise<Contact> {
  const { data, error } = await supabase
    .from("contacts")
    .update({
      is_read: true,
      status: "read",
      updated_at: new Date().toISOString(),
    })
    .eq("id", contactId)
    .select()
    .single();

  if (error) {
    console.error("⛔ Lỗi khi đánh dấu đã đọc:", error.message);
    throw error;
  }

  return data;
}

export async function updateContactStatus(
  contactId: string,
  status: Contact["status"],
): Promise<Contact> {
  const { data, error } = await supabase
    .from("contacts")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", contactId)
    .select()
    .single();

  if (error) {
    console.error("⛔ Lỗi khi cập nhật status:", error.message);
    throw error;
  }

  return data;
}

export async function deleteContact(contactId: string): Promise<void> {
  const { error } = await supabase
    .from("contacts")
    .delete()
    .eq("id", contactId);

  if (error) {
    console.error("⛔ Lỗi khi xóa contact:", error.message);
    throw error;
  }
}

export async function getContactStats(): Promise<{
  total: number;
  unread: number;
  byCategory: Record<Contact["category"], number>;
  byStatus: Record<Contact["status"], number>;
}> {
  const { data, error } = await supabase
    .from("contacts")
    .select("category, status, is_read");

  if (error) {
    console.error("⛔ Lỗi khi lấy thống kê:", error.message);
    throw error;
  }

  const stats = {
    total: data.length,
    unread: data.filter((item) => !item.is_read).length,
    byCategory: {} as Record<Contact["category"], number>,
    byStatus: {} as Record<Contact["status"], number>,
  };

  // Count by category
  data.forEach((item) => {
    stats.byCategory[item.category] =
      (stats.byCategory[item.category] || 0) + 1;
    stats.byStatus[item.status] = (stats.byStatus[item.status] || 0) + 1;
  });

  return stats;
}
