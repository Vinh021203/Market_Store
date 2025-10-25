// lib/notifications.ts
import { supabase } from "@/lib/supabase";

export interface Notification {
  id: string;
  type: "order" | "user" | "comment" | "payment" | "download" | "system";
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  metadata?: {
    orderId?: string;
    userId?: string;
    amount?: number;
    [key: string]: any;
  };
}

// 🔔 Subscribe to realtime notifications
export const subscribeToNotifications = (
  onNotification: (notification: Notification) => void,
) => {
  // Listen for new orders
  const ordersChannel = supabase
    .channel("orders-notifications")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "orders",
      },
      async (payload) => {
        const order = payload.new;
        const notification: Notification = {
          id: `order-${order.id}`,
          type: "order",
          title: "🛒 Đơn hàng mới",
          message: `Đơn hàng #${order.id.slice(0, 8)} - ${formatPrice(order.total_price)}`,
          read: false,
          created_at: new Date().toISOString(),
          metadata: {
            orderId: order.id,
            amount: order.total_price,
          },
        };
        onNotification(notification);
      },
    )
    .subscribe();

  // Listen for new users
  const usersChannel = supabase
    .channel("users-notifications")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "profiles",
      },
      async (payload) => {
        const user = payload.new;
        const notification: Notification = {
          id: `user-${user.id}`,
          type: "user",
          title: "👤 Người dùng mới",
          message: `${user.name} vừa đăng ký tài khoản`,
          read: false,
          created_at: new Date().toISOString(),
          metadata: {
            userId: user.id,
          },
        };
        onNotification(notification);
      },
    )
    .subscribe();

  // Listen for new comments
  const commentsChannel = supabase
    .channel("comments-notifications")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "comments",
      },
      async (payload) => {
        const comment = payload.new;
        const notification: Notification = {
          id: `comment-${comment.id}`,
          type: "comment",
          title: "💬 Bình luận mới",
          message: `Có bình luận mới trên sản phẩm`,
          read: false,
          created_at: new Date().toISOString(),
        };
        onNotification(notification);
      },
    )
    .subscribe();

  // Listen for downloads
  const downloadsChannel = supabase
    .channel("downloads-notifications")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "downloads",
      },
      async (payload) => {
        const download = payload.new;
        const notification: Notification = {
          id: `download-${download.id}`,
          type: "download",
          title: "📥 Tải xuống mới",
          message: `Có người vừa tải sản phẩm`,
          read: false,
          created_at: new Date().toISOString(),
        };
        onNotification(notification);
      },
    )
    .subscribe();

  // Return cleanup function
  return () => {
    ordersChannel.unsubscribe();
    usersChannel.unsubscribe();
    commentsChannel.unsubscribe();
    downloadsChannel.unsubscribe();
  };
};

// 📊 Get notification count
export const getUnreadCount = async (): Promise<number> => {
  // In real app, fetch from notifications table
  // For now, return mock count
  return 3;
};

// ✅ Mark as read
export const markAsRead = async (notificationId: string): Promise<void> => {
  // In real app, update notifications table
  console.log("Marked as read:", notificationId);
};

// 🗑️ Clear all
export const clearAllNotifications = async (): Promise<void> => {
  // In real app, delete or mark all as read
  console.log("Cleared all notifications");
};

// Helper
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};
