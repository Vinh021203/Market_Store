import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Loader2,
  Minimize2,
  Maximize2,
  Headphones,
  Sparkles,
  Crown,
  Heart,
  DollarSign,
  Download,
  Settings,
  UserCheck,
  Clock,
  Star,
  Shield,
  Zap,
  Gift,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot" | "admin";
  timestamp: Date;
  chat_session_id?: string;
  user_id?: string;
  admin_id?: string;
}

interface ChatSession {
  id: string;
  user_id: string;
  status: "active" | "closed";
  created_at: string;
  last_message?: string;
}

interface ChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onToggle }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [chatSession, setChatSession] = useState<ChatSession | null>(null);
  const [isConnectedToAdmin, setIsConnectedToAdmin] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Responsive detection
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1024,
    height: typeof window !== "undefined" ? window.innerHeight : 768,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowSize.width < 768;
  const isTablet = windowSize.width >= 768 && windowSize.width < 1024;

  // ✨ UPDATED: Pink/Rose/Red themed quick replies
  const quickReplies = [
    {
      id: 1,
      text: "Bảng giá",
      icon: DollarSign,
      detail: "Xem giá templates từ 99k-999k",
      color: "from-pink-400 to-rose-500", // ✅ PINK THEME
    },
    {
      id: 2,
      text: "Templates",
      icon: Sparkles,
      detail: "100+ mẫu website chất lượng cao",
      color: "from-rose-400 to-red-500", // ✅ ROSE THEME
    },
    {
      id: 3,
      text: "Thanh toán",
      icon: Crown,
      detail: "VNPay, MoMo, Banking an toàn",
      color: "from-red-400 to-pink-500", // ✅ RED THEME
    },
    {
      id: 4,
      text: "Download",
      icon: Download,
      detail: "Cách tải file sau khi mua",
      color: "from-pink-500 to-rose-400", // ✅ PINK GRADIENT
    },
    {
      id: 5,
      text: "Hỗ trợ",
      icon: Settings,
      detail: "Cài đặt & customization",
      color: "from-rose-500 to-red-400", // ✅ ROSE GRADIENT
    },
    {
      id: 6,
      text: "Chat Admin",
      icon: UserCheck,
      detail: "Kết nối trực tiếp với admin",
      color: "from-red-500 to-pink-400", // ✅ RED GRADIENT
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize chat session
  useEffect(() => {
    if (isOpen && user) {
      initializeChatSession();
    }
  }, [isOpen, user]);

  // Real-time subscription
  useEffect(() => {
    if (chatSession) {
      const subscription = supabase
        .channel(`chat-${chatSession.id}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "chat_messages",
            filter: `chat_session_id=eq.${chatSession.id}`,
          },
          (payload) => {
            const newMessage = payload.new as any;
            if (newMessage.sender === "admin") {
              setMessages((prev) => [
                ...prev,
                {
                  id: newMessage.id,
                  text: newMessage.message,
                  sender: "admin",
                  timestamp: new Date(newMessage.created_at),
                  chat_session_id: newMessage.chat_session_id,
                },
              ]);
              setIsConnectedToAdmin(true);
            }
          },
        )
        .subscribe();

      return () => {
        supabase.removeChannel(subscription);
      };
    }
  }, [chatSession]);

  const initializeChatSession = async () => {
    if (!user) return;

    try {
      const { data: existingSession } = await supabase
        .from("chat_sessions")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .single();

      if (existingSession) {
        setChatSession(existingSession);
        loadChatHistory(existingSession.id);
      } else {
        const { data: newSession, error } = await supabase
          .from("chat_sessions")
          .insert({
            user_id: user.id,
            status: "active",
            created_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) throw error;

        setChatSession(newSession);
        setMessages([
          {
            id: "welcome",
            text: `Xin chào ${user?.name || "bạn"}! 👋


🎨 Template Market - Kho tài nguyên thiết kế #1 Việt Nam


✨ Chúng tôi chuyên cung cấp:
• 100+ Templates responsive cao cấp
• Source code clean & optimize  
• Hỗ trợ kỹ thuật 24/7
• License thương mại đầy đủ


💡 Tôi có thể giúp bạn:
- Tư vấn template phù hợp
- Hướng dẫn thanh toán & tải xuống
- Kết nối admin hỗ trợ kỹ thuật


Bạn cần hỗ trợ gì hôm nay? 😊`,
            sender: "bot",
            timestamp: new Date(),
          },
        ]);
      }
    } catch (error) {
      console.error("Error initializing chat session:", error);
    }
  };

  const loadChatHistory = async (sessionId: string) => {
    try {
      const { data: chatMessages, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("chat_session_id", sessionId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      const formattedMessages = chatMessages.map((msg) => ({
        id: msg.id,
        text: msg.message,
        sender: msg.sender as "user" | "bot" | "admin",
        timestamp: new Date(msg.created_at),
        chat_session_id: msg.chat_session_id,
      }));

      setMessages(formattedMessages);
      const hasAdminResponse = chatMessages.some(
        (msg) => msg.sender === "admin",
      );
      setIsConnectedToAdmin(hasAdminResponse);
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  };

  const saveMessageToDatabase = async (
    message: string,
    sender: "user" | "bot" | "admin",
  ) => {
    if (!chatSession || !user) return;

    try {
      const { error } = await supabase.from("chat_messages").insert({
        chat_session_id: chatSession.id,
        user_id: user.id,
        message: message,
        sender: sender,
        created_at: new Date().toISOString(),
      });

      if (error) throw error;

      await supabase
        .from("chat_sessions")
        .update({
          last_message: message,
          updated_at: new Date().toISOString(),
        })
        .eq("id", chatSession.id);
    } catch (error) {
      console.error("Error saving message:", error);
    }
  };

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();

    if (message.includes("chat") && message.includes("admin")) {
      return `🚀 Đã thông báo admin!


⏰ Thời gian phản hồi: < 2 phút
📞 Hotline khẩn cấp: 0971386588
💬 Zalo: 0971386588  
📧 Email: [veutong961@gmail.com](mailto:veutong961@gmail.com)


Admin sẽ join chat ngay! 👨‍💼✨`;
    }

    if (message.includes("giá") || message.includes("price")) {
      return `💰 BẢNG GIÁ TEMPLATES 2025


🔥 BASIC (99k - 299k):
• Landing page đơn giản
• 5-10 pages responsive
• Source code HTML/CSS


⭐ PREMIUM (399k - 699k):
• Website business hoàn chỉnh
• 10-20 pages + admin panel
• React/Vue.js framework


💎 ENTERPRISE (799k - 999k):
• Multi-platform system
• Custom features unlimited
• 1 năm support miễn phí


🎁 COMBO HOT: Mua 3 tặng 1!
💳 Thanh toán linh hoạt, bảo hành 6 tháng`;
    }

    if (message.includes("template") || message.includes("mẫu")) {
      return `🎨 KHO TEMPLATES CHẤT LƯỢNG


📊 DANH MỤC:
• Business & Corporate (25+)
• E-commerce & Shop (20+)
• Portfolio & Personal (15+)
• Blog & News (10+)
• Restaurant & Food (8+)


🚀 ĐẶC ĐIỂM:
✅ Responsive 100% devices
✅ SEO optimize built-in
✅ Loading speed < 2s
✅ Clean & semantic code


🎯 Bạn thuộc lĩnh vực nào để tôi gợi ý template phù hợp?`;
    }

    if (message.includes("thanh toán") || message.includes("payment")) {
      return `💳 THANH TOÁN SIÊU TIỆN LỢI


🏦 PHƯƠNG THỨC:
✅ VNPay - Quét QR tức thì
✅ MoMo - Ví điện tử #1 VN
✅ Internet Banking - 40+ ngân hàng
✅ Visa/Mastercard quốc tế


🔒 BẢO MẬT 256-bit SSL
⚡ Xử lý trong 30 giây
🎁 Ưu đãi thanh toán online -10%`;
    }

    if (message.includes("download") || message.includes("tải")) {
      return `⬇️ HƯỚNG DẪN DOWNLOAD


📋 QUY TRÌNH:
1️⃣ Hoàn tất thanh toán
2️⃣ Check email xác nhận
3️⃣ Login vào tài khoản
4️⃣ Vào mục "My Downloads"
5️⃣ Click "Download Now"


📦 BẠN SẼ NHẬN:
• File source code đầy đủ
• Documentation hướng dẫn
• Assets & resources
• Video tutorial setup


⏰ Link download active trong 6 tháng
🔄 Re-download unlimited lần`;
    }

    if (message.includes("hỗ trợ") || message.includes("support")) {
      return `🔧 HỖ TRỢ KỸ THUẬT 24/7


📞 KÊNH LIÊN HỆ:
• Hotline: 0971386588 (24/7)
• Zalo: 0971386588 (Chat realtime)
• Email: [veutong961@gmail.com](mailto:veutong961@gmail.com)


🛠️ DỊCH VỤ HỖ TRỢ:
✅ Setup & installation
✅ Customization theo yêu cầu
✅ Bug fixing & optimization
✅ SEO & performance tuning


⚡ Thời gian phản hồi:
• Chat: < 5 phút
• Email: < 30 phút`;
    }

    if (
      message.includes("xin chào") ||
      message.includes("hello") ||
      message.includes("hi")
    ) {
      return `Xin chào! 👋 Rất vui được hỗ trợ bạn!


🎯 Tôi là AI Assistant của Template Market
⚡ Có thể giúp bạn 24/7 về:
• Tư vấn templates
• Hướng dẫn thanh toán
• Kỹ thuật & setup


😊 Bạn cần hỗ trợ gì hôm nay?`;
    }

    return `Cảm ơn bạn đã liên hệ! 🙏


💡 Để được hỗ trợ tốt nhất:
• Click "Bảng giá" - Xem pricing
• Click "Templates" - Xem catalog
• Click "Chat Admin" - Kết nối trực tiếp


🚀 Hoặc gọi hotline: 0971386588`;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setShowQuickReplies(false);
    await saveMessageToDatabase(inputValue, "user");

    const messageText = inputValue;
    setInputValue("");
    setIsTyping(true);

    if (
      messageText.toLowerCase().includes("chat") &&
      messageText.toLowerCase().includes("admin")
    ) {
      try {
        await supabase.from("admin_notifications").insert({
          type: "new_chat",
          title: "Yêu cầu chat mới",
          message: `${user?.name} muốn chat với admin`,
          chat_session_id: chatSession?.id,
          created_at: new Date().toISOString(),
        });
      } catch (error) {
        console.error("Error notifying admin:", error);
      }
    }

    setTimeout(async () => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(messageText),
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
      await saveMessageToDatabase(botResponse.text, "bot");
    }, 1500);
  };

  const handleQuickReply = (replyText: string) => {
    setInputValue(replyText);
    setShowQuickReplies(false);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // **COMPACT** sizing based on screen size - Thu nhỏ 30% so với bản gốc
  const getChatDimensions = () => {
    if (isMobile) {
      return {
        width: "calc(100vw - 32px)",
        maxWidth: "320px",
        height: isMinimized ? "56px" : Math.min(windowSize.height * 0.6, 400),
        bottom: "80px",
        right: "12px",
      };
    }
    if (isTablet) {
      return {
        width: "340px",
        height: isMinimized ? "56px" : "420px",
        bottom: "90px",
        right: "20px",
      };
    }
    return {
      width: "360px",
      height: isMinimized ? "56px" : "460px",
      bottom: "100px",
      right: "24px",
    };
  };

  const chatDimensions = getChatDimensions();

  return (
    <>
      {/* ✨ REDESIGNED: Pink/Rose/Red Chat Toggle Button */}
      <motion.div
        className="fixed z-[100]"
        style={{
          bottom: isMobile ? "20px" : "24px",
          right: isMobile ? "20px" : "24px",
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* ✅ UPDATED: Pink glow effect */}
        <div className="absolute inset-0 rounded-full opacity-60 bg-gradient-to-r from-pink-400 via-rose-400 to-red-400 blur-xl animate-pulse" />

        <Button
          onClick={onToggle}
          className={cn(
            "relative rounded-full shadow-2xl bg-gradient-to-r from-pink-400 via-rose-400 to-red-400 hover:from-pink-500 hover:via-rose-500 hover:to-red-500 border-2 border-white/20 overflow-hidden group transition-all duration-300",
            isMobile ? "w-14 h-14" : "w-16 h-16",
          )}
          size="icon"
        >
          {/* ✅ UPDATED: Pink background animation */}
          <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-rose-500 to-pink-500 group-hover:opacity-100" />

          {/* Admin connection indicator */}
          {isConnectedToAdmin && (
            <div className="absolute flex items-center justify-center w-5 h-5 bg-emerald-400 rounded-full -top-1 -right-1 animate-bounce shadow-lg border-2 border-white">
              <UserCheck className="w-2.5 h-2.5 text-white" />
            </div>
          )}

          {/* New message indicator */}
          <div className="absolute flex items-center justify-center w-4 h-4 bg-yellow-400 rounded-full -top-0.5 -left-0.5 animate-pulse shadow-md border border-white">
            <Gift className="w-2 h-2 text-rose-600" />
          </div>

          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.3, ease: "backOut" }}
                className="relative z-10"
              >
                <X
                  className={cn(
                    "drop-shadow-sm text-white",
                    isMobile ? "w-6 h-6" : "w-7 h-7",
                  )}
                />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.3, ease: "backOut" }}
                className="relative z-10"
              >
                <MessageCircle
                  className={cn(
                    "drop-shadow-sm text-white",
                    isMobile ? "w-6 h-6" : "w-7 h-7",
                  )}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Ripple effect */}
          <div className="absolute inset-0 rounded-full">
            <div className="absolute inset-0 transition-all duration-500 scale-0 rounded-full bg-white/30 group-hover:scale-100 group-hover:opacity-0" />
          </div>
        </Button>
      </motion.div>

      {/* ✨ REDESIGNED: Pink/Rose/Red Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed z-50"
            style={{
              width: chatDimensions.width,
              height: chatDimensions.height,
              bottom: chatDimensions.bottom,
              right: chatDimensions.right,
            }}
          >
            <Card className="flex flex-col h-full border-0 shadow-2xl overflow-hidden relative">
              {/* ✅ UPDATED: Pink/Rose/Red background gradients */}
              <div className="absolute inset-0 bg-gradient-to-br from-pink-400 via-rose-400 to-red-400" />
              <div className="absolute inset-0 bg-gradient-to-t from-rose-500/40 to-transparent" />

              {/* ✅ UPDATED: Pink decorative elements */}
              <div className="absolute top-3 right-3 w-8 h-8 bg-white/10 rounded-full blur-lg animate-pulse" />
              <div className="absolute bottom-4 left-3 w-6 h-6 bg-pink-300/20 rounded-full blur-md animate-pulse" />

              {/* Header */}
              <CardHeader className="flex-shrink-0 p-3 text-white relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm shadow-lg border border-white/30">
                      {isConnectedToAdmin ? (
                        <Headphones className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <CardTitle
                        className={cn(
                          "font-bold drop-shadow-sm text-white",
                          isMobile ? "text-sm" : "text-base",
                        )}
                      >
                        {isConnectedToAdmin
                          ? "🔥 Chat với Admin"
                          : "🤖 AI Assistant"}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <p className="text-xs opacity-90 drop-shadow-sm">
                          {isConnectedToAdmin
                            ? "⚡ Admin đang online"
                            : "💬 AI hỗ trợ 24/7"}
                        </p>
                        {isConnectedToAdmin && (
                          <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse shadow-sm" />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {!isMobile && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="p-0 text-white w-7 h-7 hover:bg-white/20 rounded-full backdrop-blur-sm"
                      >
                        {isMinimized ? (
                          <Maximize2 className="w-3 h-3" />
                        ) : (
                          <Minimize2 className="w-3 h-3" />
                        )}
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onToggle}
                      className="p-0 text-white w-7 h-7 hover:bg-white/20 rounded-full backdrop-blur-sm"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <AnimatePresence>
                {!isMinimized && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col flex-1 min-h-0 relative z-10"
                  >
                    <CardContent className="flex flex-col flex-1 min-h-0 p-0 bg-white/95 backdrop-blur-md">
                      {/* Messages Area */}
                      <div className="flex-1 overflow-hidden">
                        <div
                          className="h-full overflow-y-auto p-3 space-y-3"
                          style={{
                            scrollbarWidth: "thin",
                            scrollbarColor:
                              "rgba(244, 63, 94, 0.3) transparent", // ✅ UPDATED: Rose scrollbar
                          }}
                        >
                          <style>{`
                            div::-webkit-scrollbar {
                              width: 4px;
                            }
                            div::-webkit-scrollbar-track {
                              background: transparent;
                            }
                            div::-webkit-scrollbar-thumb {
                              background-color: rgba(244, 63, 94, 0.3);
                              border-radius: 2px;
                              border: none;
                            }
                            div::-webkit-scrollbar-thumb:hover {
                              background-color: rgba(244, 63, 94, 0.5);
                            }
                          `}</style>

                          {messages.map((message) => (
                            <motion.div
                              key={message.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.25 }}
                              className={cn(
                                "flex",
                                message.sender === "user"
                                  ? "justify-end"
                                  : "justify-start",
                              )}
                            >
                              <div
                                className={cn(
                                  "flex items-start gap-2 max-w-[85%]",
                                  message.sender === "user"
                                    ? "flex-row-reverse"
                                    : "flex-row",
                                )}
                              >
                                <div
                                  className={cn(
                                    "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 shadow-md",
                                    message.sender === "user"
                                      ? "bg-gradient-to-r from-pink-400 to-rose-500 text-white" // ✅ UPDATED: Pink user
                                      : message.sender === "admin"
                                        ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
                                        : "bg-gradient-to-r from-rose-400 to-red-500 text-white", // ✅ UPDATED: Rose bot
                                  )}
                                >
                                  {message.sender === "user" ? (
                                    <User className="w-3 h-3" />
                                  ) : message.sender === "admin" ? (
                                    <Headphones className="w-3 h-3" />
                                  ) : (
                                    <Bot className="w-3 h-3" />
                                  )}
                                </div>
                                <div
                                  className={cn(
                                    "px-3 py-2 rounded-xl shadow-md backdrop-blur-sm",
                                    message.sender === "user"
                                      ? "bg-gradient-to-r from-pink-400 to-rose-500 text-white" // ✅ UPDATED: Pink user message
                                      : message.sender === "admin"
                                        ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
                                        : "bg-white/90 text-gray-800 border border-gray-200",
                                  )}
                                >
                                  <div className="text-sm leading-relaxed">
                                    {message.text
                                      .split("\n")
                                      .map((line, index) => (
                                        <div
                                          key={index}
                                          className="mb-0.5 last:mb-0"
                                        >
                                          {line}
                                        </div>
                                      ))}
                                  </div>
                                  <p className="mt-1 text-xs opacity-70">
                                    {message.timestamp.toLocaleTimeString(
                                      "vi-VN",
                                      {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      },
                                    )}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          ))}

                          {/* ✅ UPDATED: Pink typing indicator */}
                          {isTyping && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex justify-start"
                            >
                              <div className="flex items-start gap-2">
                                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-rose-400 to-red-500 text-white shadow-md">
                                  <Bot className="w-3 h-3" />
                                </div>
                                <div className="px-3 py-2 bg-white/90 rounded-xl shadow-md backdrop-blur-sm border border-gray-200">
                                  <div className="flex gap-1">
                                    {[0, 1, 2].map((i) => (
                                      <div
                                        key={i}
                                        className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-bounce" // ✅ UPDATED: Rose dots
                                        style={{
                                          animationDelay: `${i * 150}ms`,
                                        }}
                                      />
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                          <div ref={messagesEndRef} />
                        </div>
                      </div>

                      {/* ✅ UPDATED: Pink quick replies */}
                      {showQuickReplies && messages.length <= 1 && (
                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          className="flex-shrink-0 p-3 bg-gradient-to-r from-pink-25 to-rose-25 border-t border-pink-200" // ✅ UPDATED: Pink background
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Zap className="w-3 h-3 text-rose-500" />
                            <p className="text-xs font-semibold text-gray-700">
                              Câu hỏi phổ biến:
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-1.5">
                            {quickReplies.map((reply) => (
                              <Button
                                key={reply.id}
                                variant="outline"
                                size="sm"
                                onClick={() => handleQuickReply(reply.text)}
                                className="justify-start h-auto p-2 text-left bg-white/80 hover:bg-white hover:shadow-sm transition-all duration-200 border-pink-200 hover:border-rose-300" // ✅ UPDATED: Pink borders
                              >
                                <div className="w-full">
                                  <div className="flex items-center gap-2 mb-1">
                                    <div
                                      className={cn(
                                        "w-4 h-4 rounded flex items-center justify-center bg-gradient-to-r",
                                        reply.color, // ✅ Using updated pink/rose/red gradients
                                      )}
                                    >
                                      <reply.icon className="w-2.5 h-2.5 text-white" />
                                    </div>
                                    <span className="text-xs font-medium text-gray-800 truncate">
                                      {reply.text}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-600 line-clamp-1">
                                    {reply.detail}
                                  </p>
                                </div>
                              </Button>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* ✅ UPDATED: Pink input area */}
                      <div className="flex-shrink-0 p-3 bg-gradient-to-r from-pink-25 to-rose-25 border-t border-pink-200">
                        <div className="flex gap-2 mb-2">
                          <div className="relative flex-1">
                            <Input
                              value={inputValue}
                              onChange={(e) => setInputValue(e.target.value)}
                              onKeyPress={handleKeyPress}
                              placeholder={
                                isConnectedToAdmin
                                  ? "💬 Tin nhắn tới admin..."
                                  : "💭 Nhập câu hỏi..."
                              }
                              className="text-sm bg-white/90 border-pink-300 focus:border-rose-400 focus:ring-rose-400/50 rounded-lg" // ✅ UPDATED: Pink focus colors
                              disabled={isTyping}
                            />
                          </div>
                          <Button
                            onClick={handleSendMessage}
                            disabled={!inputValue.trim() || isTyping}
                            size="sm"
                            className="px-3 bg-gradient-to-r from-pink-400 to-rose-500 hover:from-pink-500 hover:to-rose-600 shadow-md rounded-lg" // ✅ UPDATED: Pink button
                          >
                            {isTyping ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Send className="w-3 h-3" />
                            )}
                          </Button>
                        </div>

                        {/* Footer Info */}
                        <div className="space-y-1.5">
                          {!isConnectedToAdmin && (
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <Shield className="w-2.5 h-2.5 text-green-500 flex-shrink-0" />
                              <span className="line-clamp-1">
                                💡 Click "Chat Admin" để được hỗ trợ trực tiếp
                              </span>
                            </div>
                          )}

                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                <Clock className="w-2.5 h-2.5 flex-shrink-0" />
                                <span>24/7</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="w-2.5 h-2.5 text-yellow-500 flex-shrink-0" />
                                <span>5.0</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Heart className="w-2.5 h-2.5 text-rose-500 flex-shrink-0" />
                                <span>1K+</span>
                              </div>
                            </div>
                            <span className="text-rose-600 font-medium text-xs">
                              {" "}
                              {/* ✅ UPDATED: Rose brand text */}
                              Template Market AI
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
