// pages/admin/AdminChatPanel.tsx - Complete enhanced version
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
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
}

const AdminChatPanel: React.FC = () => {
  const { user } = useAuth();
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [activeSession, setActiveSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [chatStats, setChatStats] = useState<ChatStats>({
    totalChats: 0,
    activeChats: 0,
    avgResponseTime: "0s",
    todayMessages: 0,
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const subscriptionRef = useRef<any>(null);
  const activeSessionRef = useRef<ChatSession | null>(null);

  // Update ref when activeSession changes
  useEffect(() => {
    activeSessionRef.current = activeSession;
  }, [activeSession]);

  useEffect(() => {
    if (user?.role === "admin") {
      fetchChatSessions();
      fetchChatStats();
      setupRealtimeSubscription();
    }

    return () => {
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
        subscriptionRef.current = null;
      }
    };
  }, [user?.role]);

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
        totalChats: sessions?.length || 0,
        activeChats: sessions?.length || 0,
        avgResponseTime: "2m",
        todayMessages: todayMessages?.length || 0,
      });
    } catch (error) {
      console.error("Error fetching chat stats:", error);
    }
  };

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
        }),
      );

      setChatSessions(sessionsWithUnread);
    } catch (error) {
      console.error("Error fetching chat sessions:", error);
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
      toast({
        variant: "destructive",
        description: "Không thể tải tin nhắn",
      });
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
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage;
          console.log("📨 New message received:", newMessage);

          // Use ref to avoid stale closure
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

          fetchChatSessions();
          fetchChatStats();
        },
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_sessions",
        },
        (payload) => {
          console.log("📝 New chat session:", payload.new);
          fetchChatSessions();
          fetchChatStats();
        },
      )
      .subscribe((status) => {
        console.log("🔔 Subscription status:", status);
        if (status === "SUBSCRIBED") {
          console.log("✅ Successfully subscribed to real-time updates");
        }
      });

    subscriptionRef.current = subscription;
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || !activeSession || !user) return;

    const messageText = inputValue;
    const tempId = `temp-${Date.now()}`;

    // Optimistic update - Add message to UI immediately
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

      // Replace optimistic message with real one
      setMessages((prev) =>
        prev.map((msg) => (msg.id === tempId ? { ...data, id: data.id } : msg)),
      );

      // Update session
      await supabase
        .from("chat_sessions")
        .update({
          last_message: messageText,
          updated_at: new Date().toISOString(),
        })
        .eq("id", activeSession.id);

      console.log("✅ Message sent successfully");
    } catch (error) {
      console.error("❌ Error sending message:", error);

      // Remove optimistic message on error
      setMessages((prev) => prev.filter((msg) => msg.id !== tempId));

      // Restore input value
      setInputValue(messageText);

      toast({
        variant: "destructive",
        description: "Không thể gửi tin nhắn. Vui lòng thử lại.",
      });
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
      {/* Floating Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 animate-float">
          <MessageCircle className="w-8 h-8 text-blue-500 opacity-20" />
        </div>
        <div className="absolute top-1/3 right-1/4 animate-float-delay-1">
          <Users className="w-6 h-6 text-purple-500 opacity-20" />
        </div>
        <div className="absolute bottom-1/4 left-1/3 animate-float-delay-2">
          <Headphones className="text-green-500 w-7 h-7 opacity-20" />
        </div>
      </div>

      <div className="container relative z-10 px-4 py-8 mx-auto">
        <div className="mx-auto space-y-8 max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="flex items-center justify-center w-16 h-16 shadow-lg rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600"
              >
                <MessageCircle className="w-8 h-8 text-white" />
              </motion.div>
            </div>
            <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text">
              Live Chat Management
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
              Quản lý và trả lời tin nhắn từ khách hàng trong thời gian thực
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
          >
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-blue-900">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Tổng chat
                    </p>
                    <p className="text-3xl font-bold text-blue-600">
                      {chatStats.totalChats}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full dark:bg-blue-900">
                    <MessageCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-green-500">+12%</span>
                    <span className="text-muted-foreground">
                      so với hôm qua
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-green-50 dark:from-slate-800 dark:to-green-900">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Đang hoạt động
                    </p>
                    <p className="text-3xl font-bold text-green-600">
                      {chatStats.activeChats}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full dark:bg-green-900">
                    <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-muted-foreground">
                      Tất cả đang online
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-purple-50 dark:from-slate-800 dark:to-purple-900">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Thời gian phản hồi
                    </p>
                    <p className="text-3xl font-bold text-purple-600">
                      {chatStats.avgResponseTime}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full dark:bg-purple-900">
                    <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-muted-foreground">
                      Phản hồi nhanh
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-orange-50 dark:from-slate-800 dark:to-orange-900">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Tin nhắn hôm nay
                    </p>
                    <p className="text-3xl font-bold text-orange-600">
                      {chatStats.todayMessages}
                    </p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-full dark:bg-orange-900">
                    <Send className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-muted-foreground">Tăng 25%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Chat Interface */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]"
          >
            {/* Chat Sessions List */}
            <Card className="border-0 shadow-xl lg:col-span-1 bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-blue-600" />
                    Chat Sessions
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchChatSessions}
                    disabled={isLoading}
                    className="bg-gray-100 border-0 dark:bg-gray-800"
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                    />
                  </Button>
                </div>

                {/* Search */}
                <div className="relative mt-4">
                  <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm chat..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-100 border-0 dark:bg-gray-800"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[580px]">
                  {isLoading ? (
                    <div className="flex items-center justify-center p-8">
                      <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
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
                            className={`p-4 border rounded-xl cursor-pointer transition-all ${
                              activeSession?.id === session.id
                                ? "border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 shadow-lg"
                                : "hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-md"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="relative">
                                <Avatar className="w-12 h-12 border-2 border-white shadow-md">
                                  <AvatarFallback className="font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600">
                                    {session.user_name?.charAt(0) || "U"}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="absolute w-4 h-4 bg-green-500 border-2 border-white rounded-full -bottom-1 -right-1"></div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <p className="font-semibold text-gray-900 truncate dark:text-gray-100">
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
            <Card className="border-0 shadow-xl lg:col-span-2 bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900">
              <CardHeader className="pb-3 text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-xl">
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
                                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
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
                                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                                      : message.sender === "user"
                                        ? "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                                        : "bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900 dark:to-orange-900"
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
                          className="flex-1 px-4 py-3 bg-gray-100 border-0 rounded-full dark:bg-gray-800"
                          disabled={isSending}
                        />
                        <Button
                          onClick={sendMessage}
                          disabled={!inputValue.trim() || isSending}
                          size="icon"
                          className="w-12 h-12 rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
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
                      <div className="flex items-center justify-center w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900">
                        <MessageCircle className="w-12 h-12 text-blue-500" />
                      </div>
                      <div>
                        <p className="mb-2 text-xl font-semibold">
                          Chọn một cuộc trò chuyện
                        </p>
                        <p className="text-sm">
                          để bắt đầu chat với khách hàng
                        </p>
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
