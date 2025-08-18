import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import {
  MessageCircle,
  Send,
  User,
  Headphones,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  Search,
  Filter,
  MoreVertical,
  Phone,
  Mail,
  Archive,
  Star,
  Users,
  TrendingUp,
  Sparkles,
  Coffee,
  Code,
  Heart,
  Gift,
  Crown,
  Flame,
  Target,
  Zap,
  Award,
  Settings,
  Mic,
  Image,
  Paperclip,
  Smile,
  Volume2,
  VolumeX,
  CheckCheck,
  ArrowDown,
  FileText,
  Activity,
  Bell,
  BellOff,
  Maximize2,
  Minimize2,
  UserCheck,
  UserX,
  AlertTriangle,
  Info,
  XCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/components/ui/use-toast";

interface ChatSession {
  id: string;
  user_id: string;
  status: "active" | "closed";
  created_at: string;
  updated_at?: string;
  last_message?: string;
  user_name?: string;
  user_email?: string;
  unread_count?: number;
  profiles?: {
    name: string;
    email: string;
  };
}

interface ChatMessage {
  id: string;
  chat_session_id: string;
  user_id: string;
  admin_id?: string;
  message: string;
  sender: "user" | "bot" | "admin";
  created_at: string;
  is_read?: boolean;
}

interface ChatStats {
  totalChats: number;
  activeChats: number;
  avgResponseTime: string;
  todayMessages: number;
  satisfaction: number;
  urgentChats: number;
}

// **🎨 Enhanced Toast Component**
const FloatingToast = ({
  type = "success",
  title,
  description,
  visible = true,
  onClose,
}: {
  type?: "success" | "error" | "info" | "warning";
  title: string;
  description?: string;
  visible?: boolean;
  onClose?: () => void;
}) => {
  const iconProps = "w-5 h-5 flex-shrink-0";
  let icon, colorScheme, bgGradient;

  switch (type) {
    case "error":
      icon = <XCircle className={`${iconProps} text-red-600`} />;
      colorScheme = "text-red-800";
      bgGradient = "from-red-50/95 via-orange-50/95 to-white/95";
      break;
    case "warning":
      icon = <AlertTriangle className={`${iconProps} text-amber-600`} />;
      colorScheme = "text-amber-800";
      bgGradient = "from-amber-50/95 via-yellow-50/95 to-white/95";
      break;
    case "info":
      icon = <Info className={`${iconProps} text-blue-600`} />;
      colorScheme = "text-blue-800";
      bgGradient = "from-blue-50/95 via-cyan-50/95 to-white/95";
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
            <div className="text-xs mt-1 text-gray-700/70 leading-relaxed">
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

const AdminChatPanel: React.FC = () => {
  const { user } = useAuth();
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [toasts, setToasts] = useState<
    Array<{
      id: string;
      type: "success" | "error" | "info" | "warning";
      title: string;
      description?: string;
    }>
  >([]);

  const [chatStats, setChatStats] = useState<ChatStats>({
    totalChats: 0,
    activeChats: 0,
    avgResponseTime: "0s",
    todayMessages: 0,
    satisfaction: 4.8,
    urgentChats: 0,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const subscriptionRef = useRef<any>(null);
  const activeSessionRef = useRef<ChatSession | null>(null);

  // **🎯 Enhanced Toast System**
  const showToast = (
    type: "success" | "error" | "info" | "warning",
    title: string,
    description?: string,
  ) => {
    const id = Date.now().toString();
    const newToast = { id, type, title, description };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // Update ref when activeSession changes
  useEffect(() => {
    activeSessionRef.current = activeSession;
  }, [activeSession]);

  useEffect(() => {
    if (user?.role === "admin") {
      fetchChatSessions();
      fetchChatStats();
      setupRealtimeSubscription();

      const interval = setInterval(() => {
        if (autoRefresh) {
          fetchChatSessions();
          fetchChatStats();
        }
      }, 30000);

      return () => {
        clearInterval(interval);
        if (subscriptionRef.current) {
          supabase.removeChannel(subscriptionRef.current);
          subscriptionRef.current = null;
        }
      };
    }
  }, [user?.role, autoRefresh]);

  useEffect(() => {
    if (activeSession) {
      fetchMessages(activeSession.id);
      markAsRead(activeSession.id);
    }
  }, [activeSession]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchChatStats = async () => {
    try {
      const { data: sessions } = await supabase
        .from("chat_sessions")
        .select("*")
        .eq("status", "active");

      const { data: todayMessages } = await supabase
        .from("chat_messages")
        .select("*")
        .gte("created_at", new Date().toISOString().split("T")[0]);

      setChatStats({
        totalChats: sessions?.length || 4,
        activeChats: sessions?.length || 4,
        avgResponseTime: "2m 15s",
        todayMessages: todayMessages?.length || 0,
        satisfaction: 4.8,
        urgentChats: 0,
      });
    } catch (error) {
      console.error("Error fetching chat stats:", error);
      // Set default values
      setChatStats({
        totalChats: 4,
        activeChats: 4,
        avgResponseTime: "2m 15s",
        todayMessages: 0,
        satisfaction: 4.8,
        urgentChats: 0,
      });
    }
  };

  // **📝 Fixed fetchChatSessions - Remove avatar_url**
  const fetchChatSessions = async () => {
    setIsLoading(true);
    try {
      const { data: sessions, error } = await supabase
        .from("chat_sessions")
        .select(
          `
          *,
          profiles:user_id (
            name,
            email
          )
        `,
        )
        .eq("status", "active")
        .order("updated_at", { ascending: false });

      if (error) throw error;

      const sessionsWithUnread = await Promise.all(
        (sessions || []).map(async (session) => {
          try {
            const { count } = await supabase
              .from("chat_messages")
              .select("*", { count: "exact", head: true })
              .eq("chat_session_id", session.id)
              .eq("sender", "user")
              .eq("is_read", false);

            return {
              ...session,
              user_name: session.profiles?.name || "Unknown User",
              user_email: session.profiles?.email || "",
              unread_count: count || 0,
            };
          } catch {
            return {
              ...session,
              user_name: session.profiles?.name || "Unknown User",
              user_email: session.profiles?.email || "",
              unread_count: 0,
            };
          }
        }),
      );

      setChatSessions(sessionsWithUnread);
      if (sessionsWithUnread.length > 0) {
        showToast(
          "success",
          "✅ Đã cập nhật",
          `Tải thành công ${sessionsWithUnread.length} cuộc trò chuyện`,
        );
      }
    } catch (error) {
      console.error("Error fetching chat sessions:", error);
      showToast(
        "error",
        "❌ Lỗi tải chat",
        "Không thể tải danh sách cuộc trò chuyện",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (sessionId: string) => {
    try {
      console.log("📥 Fetching messages for session:", sessionId);

      const { data: chatMessages, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("chat_session_id", sessionId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      console.log("📥 Messages fetched:", chatMessages?.length || 0);
      setMessages(chatMessages || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      showToast("error", "❌ Lỗi tải tin nhắn", "Không thể tải tin nhắn");
    }
  };

  const markAsRead = async (sessionId: string) => {
    try {
      await supabase
        .from("chat_messages")
        .update({ is_read: true })
        .eq("chat_session_id", sessionId)
        .eq("sender", "user");

      setChatSessions((prev) =>
        prev.map((session) =>
          session.id === sessionId ? { ...session, unread_count: 0 } : session,
        ),
      );
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const setupRealtimeSubscription = () => {
    if (subscriptionRef.current) {
      supabase.removeChannel(subscriptionRef.current);
    }

    const channelName = `admin-chat-panel-${user?.id}-${Date.now()}`;

    const subscription = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages" },
        (payload) => {
          const newMessage = payload.new as ChatMessage;
          console.log("📨 New message received:", newMessage);

          const currentActiveSession = activeSessionRef.current;

          if (
            currentActiveSession &&
            newMessage.chat_session_id === currentActiveSession.id
          ) {
            setMessages((prev) => {
              const messageExists = prev.some(
                (msg) => msg.id === newMessage.id,
              );
              if (messageExists) return prev;
              return [...prev, newMessage];
            });
          }

          if (newMessage.sender === "user") {
            showToast("info", "💬 Tin nhắn mới", `Từ ${newMessage.sender}`);
          }

          fetchChatSessions();
          fetchChatStats();
        },
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_sessions" },
        (payload) => {
          console.log("📝 New chat session:", payload.new);
          showToast("success", "🆕 Chat mới", "Có cuộc trò chuyện mới");
          fetchChatSessions();
          fetchChatStats();
        },
      )
      .subscribe((status) => {
        console.log("🔔 Subscription status:", status);
        if (status === "SUBSCRIBED") {
          console.log("✅ Successfully subscribed to real-time updates");
          showToast(
            "success",
            "🔔 Kết nối thành công",
            "Đã kết nối real-time chat",
          );
        }
      });

    subscriptionRef.current = subscription;
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || !activeSession || !user) return;

    const messageText = inputValue;
    const tempId = `temp-${Date.now()}`;

    const optimisticMessage: ChatMessage = {
      id: tempId,
      chat_session_id: activeSession.id,
      user_id: activeSession.user_id,
      admin_id: user.id,
      message: messageText,
      sender: "admin",
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setInputValue("");
    setIsSending(true);

    try {
      const { data, error } = await supabase
        .from("chat_messages")
        .insert({
          chat_session_id: activeSession.id,
          user_id: activeSession.user_id,
          admin_id: user.id,
          message: messageText,
          sender: "admin",
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      setMessages((prev) =>
        prev.map((msg) => (msg.id === tempId ? { ...data, id: data.id } : msg)),
      );

      await supabase
        .from("chat_sessions")
        .update({
          last_message: messageText,
          updated_at: new Date().toISOString(),
        })
        .eq("id", activeSession.id);

      console.log("✅ Message sent successfully");
      showToast("success", "✅ Đã gửi", "Tin nhắn đã được gửi thành công");
    } catch (error) {
      console.error("❌ Error sending message:", error);
      setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
      setInputValue(messageText);
      showToast(
        "error",
        "❌ Gửi thất bại",
        "Không thể gửi tin nhắn. Vui lòng thử lại.",
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getMessageTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getSessionTime = (timestamp: string | undefined) => {
    if (!timestamp) return "Không xác định";

    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInHours =
      (now.getTime() - messageTime.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return "Vừa xong";
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} giờ trước`;
    } else {
      return messageTime.toLocaleDateString("vi-VN");
    }
  };

  const filteredSessions = chatSessions.filter(
    (session) =>
      session.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.last_message?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // **📊 Stats Cards - Chia 2 hàng như ảnh**
  const firstRowStats = [
    {
      title: "Tổng chat",
      value: chatStats.totalChats,
      icon: MessageCircle,
      gradient: "from-orange-400 via-amber-500 to-yellow-600",
      bgGradient: "from-orange-50/80 via-amber-50/80 to-yellow-50/80",
      description: "Cuộc trò chuyện",
      trend: "+12%",
    },
    {
      title: "Đang hoạt động",
      value: chatStats.activeChats,
      icon: Users,
      gradient: "from-green-400 via-emerald-500 to-teal-600",
      bgGradient: "from-green-50/80 via-emerald-50/80 to-teal-50/80",
      description: "Chat đang mở",
      trend: "+5%",
    },
    {
      title: "Thời gian phản hồi",
      value: chatStats.avgResponseTime,
      icon: Clock,
      gradient: "from-amber-400 via-orange-500 to-red-600",
      bgGradient: "from-amber-50/80 via-orange-50/80 to-red-50/80",
      description: "Trung bình",
      trend: "-8s",
    },
  ];

  const secondRowStats = [
    {
      title: "Hôm nay",
      value: chatStats.todayMessages,
      icon: Send,
      gradient: "from-purple-400 via-pink-500 to-rose-600",
      bgGradient: "from-purple-50/80 via-pink-50/80 to-rose-50/80",
      description: "Tin nhắn",
      trend: "+25%",
    },
    {
      title: "Hài lòng",
      value: `${chatStats.satisfaction}/5`,
      icon: Star,
      gradient: "from-emerald-400 via-green-500 to-teal-600",
      bgGradient: "from-emerald-50/80 via-green-50/80 to-teal-50/80",
      description: "Đánh giá",
      trend: "+0.2",
    },
    {
      title: "Khẩn cấp",
      value: chatStats.urgentChats,
      icon: AlertTriangle,
      gradient: "from-red-400 via-pink-500 to-rose-600",
      bgGradient: "from-red-50/80 via-pink-50/80 to-rose-50/80",
      description: "Cần xử lý ngay",
      trend: chatStats.urgentChats > 0 ? "!" : "✓",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* **🌟 Enhanced Floating Elements** */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4"
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <MessageCircle className="w-8 h-8 text-orange-400 opacity-20" />
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
          <Users className="w-6 h-6 text-amber-400 opacity-20" />
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
          <Headphones className="text-yellow-400 w-7 h-7 opacity-20" />
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
        <motion.div
          className="absolute bottom-1/6 right-1/5"
          animate={{ y: [0, -16, 0], scale: [1, 1.2, 1] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2.5,
          }}
        >
          <Gift className="w-6 h-6 text-orange-300 opacity-20" />
        </motion.div>
      </div>

      {/* **🎨 Toast Container** */}
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

      <div className="container relative z-10 px-4 py-8 mx-auto">
        <div className="mx-auto space-y-8 max-w-7xl">
          {/* ✅ Enhanced Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between p-6 bg-gradient-to-r from-white/90 via-orange-50/90 to-amber-50/90 backdrop-blur-xl border border-orange-200/50 rounded-3xl shadow-lg"
          >
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="flex items-center justify-center w-16 h-16 shadow-xl rounded-3xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-600"
              >
                <MessageCircle className="w-8 h-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text">
                  Live Chat Pro
                </h1>
                <p className="text-orange-700/80 mt-1 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4" />
                  <span>
                    Quản lý chat khách hàng thông minh và chuyên nghiệp
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 p-3 bg-white/60 rounded-2xl shadow-md">
                <Label htmlFor="sound" className="text-sm font-medium">
                  🔊
                </Label>
                <Switch
                  id="sound"
                  checked={soundEnabled}
                  onCheckedChange={setSoundEnabled}
                />
              </div>
              <div className="flex items-center gap-2 p-3 bg-white/60 rounded-2xl shadow-md">
                <Label htmlFor="auto-refresh" className="text-sm font-medium">
                  🔄
                </Label>
                <Switch
                  id="auto-refresh"
                  checked={autoRefresh}
                  onCheckedChange={setAutoRefresh}
                />
              </div>
              <Button
                variant="outline"
                onClick={fetchChatSessions}
                disabled={isLoading}
                className="bg-white/80 hover:bg-white border-orange-200/50 rounded-2xl shadow-md"
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
                />
                Làm mới
              </Button>
            </div>
          </motion.div>

          {/* ✅ Enhanced Stats Cards - ROW 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-3"
          >
            {firstRowStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
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
                          transition={{ delay: 0.3 + index * 0.1 }}
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
                    <div className="flex items-center text-xs text-emerald-600">
                      <div className="p-1 rounded-full mr-1 bg-emerald-100">
                        <TrendingUp className="w-2 h-2" />
                      </div>
                      <span className="font-semibold">{stat.trend}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* ✅ Enhanced Stats Cards - ROW 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
            className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-3"
          >
            {secondRowStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + index * 0.1 }}
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
                          transition={{ delay: 0.45 + index * 0.1 }}
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
                    <div className="flex items-center text-xs text-emerald-600">
                      <div className="p-1 rounded-full mr-1 bg-emerald-100">
                        <TrendingUp className="w-2 h-2" />
                      </div>
                      <span className="font-semibold">{stat.trend}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* ✅ Main Chat Interface */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]"
          >
            {/* Chat Sessions List */}
            <Card className="border-0 shadow-xl lg:col-span-1 bg-gradient-to-br from-white/95 to-orange-50/80 backdrop-blur-xl rounded-3xl overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-orange-600" />
                    Chat Sessions
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchChatSessions}
                    disabled={isLoading}
                    className="bg-white/80"
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                    />
                  </Button>
                </div>

                {/* Search */}
                <div className="relative mt-4">
                  <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-orange-600" />
                  <Input
                    placeholder="Tìm kiếm chat..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/80 border-orange-200/50 rounded-2xl shadow-md focus:ring-2 focus:ring-orange-200"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[580px]">
                  {isLoading ? (
                    <div className="flex items-center justify-center p-8">
                      <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
                      <span className="ml-2">Đang tải...</span>
                    </div>
                  ) : filteredSessions.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                      <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>
                        {searchTerm
                          ? "Không tìm thấy chat"
                          : "Chưa có chat nào"}
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 space-y-2">
                      <AnimatePresence>
                        {filteredSessions.map((session, index) => (
                          <motion.div
                            key={session.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setActiveSession(session)}
                            className={`p-4 border rounded-2xl cursor-pointer transition-all ${
                              activeSession?.id === session.id
                                ? "border-orange-500 bg-gradient-to-r from-orange-50 to-amber-50 shadow-lg"
                                : "hover:bg-gray-50 hover:shadow-md border-gray-200"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="relative">
                                <Avatar className="w-12 h-12 border-2 border-white shadow-md">
                                  <AvatarFallback className="font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-600">
                                    {session.user_name?.charAt(0) || "U"}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="absolute w-4 h-4 bg-green-500 border-2 border-white rounded-full -bottom-1 -right-1" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <p className="font-semibold text-gray-900 truncate">
                                    {session.user_name}
                                  </p>
                                  {session.unread_count > 0 && (
                                    <Badge className="text-white border-0 bg-gradient-to-r from-red-500 to-pink-600">
                                      {session.unread_count}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm truncate text-muted-foreground">
                                  {session.last_message || "Chưa có tin nhắn"}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <Clock className="w-3 h-3 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">
                                    {getSessionTime(
                                      session.updated_at || session.created_at,
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Chat Window */}
            <Card className="border-0 shadow-xl lg:col-span-2 bg-gradient-to-br from-white/95 to-orange-50/80 backdrop-blur-xl rounded-3xl overflow-hidden">
              <CardHeader className="pb-3 text-white bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-600 rounded-t-3xl">
                <CardTitle>
                  {activeSession ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 border-2 border-white/20">
                          <AvatarFallback className="text-white bg-white/20">
                            {activeSession.user_name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-lg font-semibold">
                            {activeSession.user_name}
                          </p>
                          <div className="flex items-center gap-2">
                            <p className="text-sm opacity-90">
                              {activeSession.user_email}
                            </p>
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                              <span className="text-xs">Online</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-white hover:bg-white/20"
                        >
                          <Phone className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-white hover:bg-white/20"
                        >
                          <Mail className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-white hover:bg-white/20"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-80" />
                      <span>Chọn chat để bắt đầu</span>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {activeSession ? (
                  <>
                    {/* Messages */}
                    <ScrollArea className="h-[480px] p-6">
                      <div className="space-y-6">
                        <AnimatePresence>
                          {messages.map((message, index) => (
                            <motion.div
                              key={message.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ delay: index * 0.05 }}
                              className={`flex ${message.sender === "admin" ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`flex items-start gap-3 max-w-[80%] ${
                                  message.sender === "admin"
                                    ? "flex-row-reverse"
                                    : "flex-row"
                                }`}
                              >
                                <div
                                  className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                                    message.sender === "admin"
                                      ? "bg-gradient-to-r from-orange-500 to-amber-600 text-white"
                                      : message.sender === "user"
                                        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                                        : "bg-gradient-to-r from-gray-400 to-gray-600 text-white"
                                  }`}
                                >
                                  {message.sender === "admin" ? (
                                    <Headphones className="w-5 h-5" />
                                  ) : message.sender === "user" ? (
                                    <User className="w-5 h-5" />
                                  ) : (
                                    <MessageCircle className="w-5 h-5" />
                                  )}
                                </div>
                                <div
                                  className={`px-4 py-3 rounded-2xl shadow-lg ${
                                    message.sender === "admin"
                                      ? "bg-gradient-to-r from-orange-500 to-amber-600 text-white"
                                      : message.sender === "user"
                                        ? "bg-white border border-gray-200"
                                        : "bg-gradient-to-r from-yellow-100 to-orange-100"
                                  }`}
                                >
                                  <p className="text-sm leading-relaxed whitespace-pre-line">
                                    {message.message}
                                  </p>
                                  <p
                                    className={`text-xs mt-2 ${
                                      message.sender === "admin"
                                        ? "opacity-80"
                                        : "text-muted-foreground"
                                    }`}
                                  >
                                    {getMessageTime(message.created_at)}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>

                    <Separator />

                    {/* Input */}
                    <div className="p-6">
                      <div className="flex gap-3">
                        <Input
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Nhập tin nhắn..."
                          className="flex-1 px-4 py-3 bg-white/90 border-orange-200/50 rounded-3xl shadow-md focus:ring-2 focus:ring-orange-200"
                          disabled={isSending}
                        />
                        <Button
                          onClick={sendMessage}
                          disabled={!inputValue.trim() || isSending}
                          size="icon"
                          className="w-12 h-12 rounded-full shadow-lg bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700"
                        >
                          {isSending ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <Send className="w-5 h-5" />
                          )}
                        </Button>
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                        <span>Nhấn Enter để gửi</span>
                        <span>•</span>
                        <span>Shift + Enter để xuống dòng</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-[580px] text-muted-foreground">
                    <div className="space-y-4 text-center">
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center justify-center w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-orange-100 to-amber-100"
                      >
                        <MessageCircle className="w-12 h-12 text-orange-500" />
                      </motion.div>
                      <div>
                        <p className="mb-2 text-xl font-semibold">
                          Chọn một cuộc trò chuyện
                        </p>
                        <p className="text-sm">
                          để bắt đầu chat với khách hàng
                        </p>
                      </div>
                      <div className="flex justify-center gap-2 mt-4">
                        <Badge variant="outline" className="bg-orange-50">
                          💬 {filteredSessions.length} chat đang chờ
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminChatPanel;
