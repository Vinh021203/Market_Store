// components/Chatbot.tsx - Enhanced responsive với thiết kế gradient đẹp
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  Phone,
  Mail,
  Headphones,
  Paperclip,
  Smile,
  Star,
  Clock,
  Shield,
  Zap,
  Heart,
  UserCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/components/ui/use-toast";

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
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ✅ Responsive detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // ✅ Enhanced Quick replies với nhiều thông tin hơn
  const quickReplies = [
    {
      id: 1,
      text: "💰 Bảng giá",
      icon: "💰",
      detail: "Xem giá templates từ 99k-999k",
    },
    {
      id: 2,
      text: "🎨 Templates",
      icon: "🎨",
      detail: "100+ mẫu website chất lượng cao",
    },
    {
      id: 3,
      text: "💳 Thanh toán",
      icon: "💳",
      detail: "VNPay, MoMo, Banking an toàn",
    },
    {
      id: 4,
      text: "⬇️ Download",
      icon: "⬇️",
      detail: "Cách tải file sau khi mua",
    },
    {
      id: 5,
      text: "🔧 Hỗ trợ",
      icon: "🔧",
      detail: "Cài đặt & customization",
    },
    {
      id: 6,
      text: "👨‍💼 Chat Admin",
      icon: "👨‍💼",
      detail: "Kết nối trực tiếp với admin",
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
            id: "1",
            text: `Xin chào ${user?.name || "bạn"}! 👋

🎯 Template Hub - Kho tài nguyên thiết kế #1 Việt Nam

✨ Chúng tôi có:
• 100+ Templates chất lượng cao
• Responsive design cho mọi thiết bị  
• Source code clean & optimize
• Hỗ trợ 24/7

💡 Tôi có thể giúp bạn:
- Tư vấn lựa chọn template phù hợp
- Hướng dẫn thanh toán & download
- Kết nối với admin để hỗ trợ kỹ thuật

Bạn đang quan tâm đến loại template nào? 😊`,
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
      return `🚀 Đã thông báo admin! Đang kết nối...

⏰ Thời gian phản hồi: < 2 phút
📞 Hotline khẩn cấp: 0971386588
💬 Zalo: 0971386588  
📧 Email: veutong961@gmail.com

Admin sẽ join chat ngay! 👨‍💼✨`;
    }

    if (message.includes("giá") || message.includes("price")) {
      return `💰 BẢNG GIÁ TEMPLATES 2025

🔥 BASIC (99k - 299k):
• Landing page đơn giản
• 5-10 pages  
• Responsive mobile
• Source code HTML/CSS

⭐ PREMIUM (399k - 699k):
• Website business complete
• 10-20 pages với admin panel
• React/Vue.js framework  
• Database integration

💎 ENTERPRISE (799k - 999k):
• Multi-platform system
• Custom features unlimited
• Advanced animations
• 1 năm support miễn phí

🎁 COMBO HOT: Mua 3 tặng 1! 
💳 Thanh toán linh hoạt, bảo hành 6 tháng`;
    }

    if (message.includes("template") || message.includes("mẫu")) {
      return `🎨 KHO TEMPLATES CHẤT LƯỢNG CAO

📊 DANH MỤC:
• Business & Corporate (25+)
• E-commerce & Shop (20+)  
• Portfolio & Personal (15+)
• Blog & News (10+)
• Restaurant & Food (8+)
• Real Estate (12+)
• Education & Course (10+)

🚀 ĐẶC ĐIỂM:
✅ Responsive 100% devices
✅ SEO optimize built-in
✅ Loading speed < 2s
✅ Cross-browser compatible
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
✅ Chuyển khoản trực tiếp

🔒 BẢO MẬT 256-bit SSL
⚡ Xử lý trong 30 giây
📱 Hỗ trợ mobile payment
🎁 Ưu đãi thanh toán online -10%

💰 Có thể trả góp 0% lãi suất cho order > 500k!`;
    }

    if (message.includes("download") || message.includes("tải")) {
      return `⬇️ HƯỚNG DẪN DOWNLOAD CHI TIẾT

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
• License commercial use

⏰ Link download active trong 6 tháng
🔄 Re-download unlimited lần
💾 Backup cloud storage included`;
    }

    if (message.includes("hỗ trợ") || message.includes("support")) {
      return `🔧 HỖ TRỢ KỸ THUẬT 24/7

📞 KÊNH LIÊN HỆ:
• Hotline: 0971386588 (24/7)
• Zalo: 0971386588 (Chat realtime)
• Email: veutong961@gmail.com
• Telegram: @templatesupport

🛠️ DỊCH VỤ HỖ TRỢ:
✅ Setup & installation  
✅ Customization theo yêu cầu
✅ Bug fixing & optimization
✅ SEO & performance tuning
✅ Responsive fix mobile
✅ Integration 3rd services

⚡ Thời gian phản hồi:
• Chat: < 5 phút  
• Email: < 30 phút
• Hotline: Ngay lập tức`;
    }

    if (
      message.includes("xin chào") ||
      message.includes("hello") ||
      message.includes("hi")
    ) {
      return `Xin chào! 👋 Rất vui được hỗ trợ bạn!

🎯 Tôi là AI Assistant của Template Hub
⚡ Có thể giúp bạn 24/7 về:
• Tư vấn templates
• Hướng dẫn thanh toán  
• Kỹ thuật & setup

😊 Bạn cần hỗ trợ gì hôm nay?`;
    }

    return `Cảm ơn bạn đã liên hệ! 🙏

💡 Để được hỗ trợ tốt nhất:
• Nói "💰 Bảng giá" - Xem pricing
• Nói "🎨 Templates" - Xem catalog  
• Nói "👨‍💼 Chat Admin" - Kết nối trực tiếp

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
    const cleanText = replyText.replace(/^[🎯💰🎨💳⬇️🔧👨‍💼]\s*/, "");
    setInputValue(cleanText);
    setShowQuickReplies(false);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // ✅ Dynamic sizing - Chiều cao ngắn hơn
  const getChatSize = () => {
    if (isMobile) {
      return {
        width: "calc(100vw - 24px)",
        maxWidth: "360px",
        height: isMinimized ? "auto" : "420px", // Giảm từ 500px xuống 420px
        bottom: "80px",
        right: "12px",
      };
    }
    return {
      width: "380px", // Tăng width để thoải mái hơn
      height: isMinimized ? "auto" : "450px", // Giảm từ 600px xuống 480px
      bottom: "100px",
      right: "24px",
    };
  };

  const chatSize = getChatSize();

  return (
    <>
      {/* ✅ Enhanced Chat Toggle Button với gradient tương tự ContactWidget */}
      <motion.div
        className="fixed z-100"
        style={{
          bottom: isMobile ? "20px" : "24px",
          right: isMobile ? "20px" : "24px",
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full opacity-80 bg-gradient-to-r from-orange-400 to-pink-400 blur-xl animate-pulse" />

        <Button
          onClick={onToggle}
          className={`relative rounded-full shadow-2xl ${isMobile ? "w-14 h-14" : "w-16 h-16"} bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 border-2 border-white/20 overflow-hidden group`}
          size="icon"
        >
          {/* Background animation */}
          <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-red-500 to-orange-500 group-hover:opacity-100" />

          {/* Admin connection indicator */}
          {isConnectedToAdmin && (
            <div className="absolute flex items-center justify-center w-5 h-5 bg-emerald-400 rounded-full -top-1 -right-1 animate-bounce shadow-lg border-2 border-white">
              <UserCheck className="w-2.5 h-2.5 text-white" />
            </div>
          )}

          {/* New message indicator */}
          <div className="absolute flex items-center justify-center w-4 h-4 bg-red-500 rounded-full -top-0.5 -left-0.5 animate-pulse shadow-md">
            <span className="text-xs font-bold text-white">!</span>
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
                  className={`${isMobile ? "w-6 h-6" : "w-7 h-7"} drop-shadow-sm`}
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
                  className={`${isMobile ? "w-6 h-6" : "w-7 h-7"} drop-shadow-sm`}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Ripple effect */}
          <div className="absolute inset-0 rounded-full">
            <div className="absolute inset-0 transition-all duration-500 scale-0 rounded-full bg-white/40 group-hover:scale-100 group-hover:opacity-0" />
          </div>
        </Button>
      </motion.div>

      {/* ✅ Enhanced Chat Window với gradient đẹp */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed z-40"
            style={{
              width: chatSize.width,
              height: chatSize.height,
              bottom: chatSize.bottom,
              right: chatSize.right,
            }}
          >
            <Card className="flex flex-col h-full border-0 shadow-2xl overflow-hidden relative">
              {/* ✅ Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-pink-400 to-red-400" />
              <div className="absolute inset-0 bg-gradient-to-t from-red-500/60 to-transparent" />

              {/* ✅ Decorative elements */}
              <div className="absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-full blur-xl animate-pulse" />
              <div className="absolute bottom-4 left-4 w-12 h-12 bg-yellow-300/20 rounded-full blur-lg animate-pulse" />

              {/* ✅ Enhanced Header */}
              <CardHeader className="flex-shrink-0 p-4 text-white relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm shadow-lg">
                      {isConnectedToAdmin ? (
                        <Headphones className="w-5 h-5" />
                      ) : (
                        <Bot className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <CardTitle
                        className={`${isMobile ? "text-base" : "text-lg"} font-bold drop-shadow-sm`}
                      >
                        {isConnectedToAdmin
                          ? "🔥 Chat với Admin"
                          : "🤖 Template Assistant"}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <p
                          className={`${isMobile ? "text-xs" : "text-sm"} opacity-90 drop-shadow-sm`}
                        >
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
                        className="p-0 text-white w-8 h-8 hover:bg-white/20 rounded-full backdrop-blur-sm"
                      >
                        {isMinimized ? (
                          <Maximize2 className="w-4 h-4" />
                        ) : (
                          <Minimize2 className="w-4 h-4" />
                        )}
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onToggle}
                      className="p-0 text-white w-8 h-8 hover:bg-white/20 rounded-full backdrop-blur-sm"
                    >
                      <X className="w-4 h-4" />
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
                      {/* ✅ Messages với custom scrollbar */}
                      <div className="flex-1 overflow-hidden">
                        <div className="h-full overflow-y-auto p-4 space-y-4 chatbot-scrollbar">
                          {messages.map((message) => (
                            <motion.div
                              key={message.id}
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`flex items-start gap-3 max-w-[85%] ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
                              >
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${
                                    message.sender === "user"
                                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                                      : message.sender === "admin"
                                        ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
                                        : "bg-gradient-to-r from-orange-400 to-pink-500 text-white"
                                  }`}
                                >
                                  {message.sender === "user" ? (
                                    <User className="w-4 h-4" />
                                  ) : message.sender === "admin" ? (
                                    <Headphones className="w-4 h-4" />
                                  ) : (
                                    <Bot className="w-4 h-4" />
                                  )}
                                </div>
                                <div
                                  className={`px-4 py-3 rounded-2xl shadow-lg backdrop-blur-sm ${
                                    message.sender === "user"
                                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                                      : message.sender === "admin"
                                        ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
                                        : "bg-white/90 text-gray-800 border border-gray-200"
                                  }`}
                                >
                                  <p
                                    className={`${isMobile ? "text-sm" : "text-sm"} leading-relaxed whitespace-pre-line`}
                                  >
                                    {message.text}
                                  </p>
                                  <p
                                    className={`mt-2 ${isMobile ? "text-xs" : "text-xs"} opacity-70`}
                                  >
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

                          {/* ✅ Enhanced Typing Indicator */}
                          {isTyping && (
                            <motion.div
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex justify-start"
                            >
                              <div className="flex items-start gap-3">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 text-white shadow-lg">
                                  <Bot className="w-4 h-4" />
                                </div>
                                <div className="px-4 py-3 bg-white/90 rounded-2xl shadow-lg backdrop-blur-sm border border-gray-200">
                                  <div className="flex gap-1">
                                    <div
                                      className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"
                                      style={{ animationDelay: "0ms" }}
                                    />
                                    <div
                                      className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"
                                      style={{ animationDelay: "150ms" }}
                                    />
                                    <div
                                      className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"
                                      style={{ animationDelay: "300ms" }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                          <div ref={messagesEndRef} />
                        </div>
                      </div>

                      {/* ✅ Enhanced Quick Replies với nhiều thông tin */}
                      {showQuickReplies && messages.length <= 1 && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className="flex-shrink-0 p-4 bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-200"
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <Zap className="w-4 h-4 text-orange-500" />
                            <p className="text-sm font-semibold text-gray-700">
                              Câu hỏi phổ biến:
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {quickReplies.map((reply) => (
                              <Button
                                key={reply.id}
                                variant="outline"
                                size="sm"
                                onClick={() => handleQuickReply(reply.text)}
                                className="justify-start h-auto p-3 text-left bg-white/80 hover:bg-white hover:shadow-md transition-all duration-200 border-gray-200 hover:border-orange-300"
                              >
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-base">
                                      {reply.icon}
                                    </span>
                                    <span className="text-xs font-semibold text-gray-800">
                                      {reply.text.replace(
                                        /^[🎯💰🎨💳⬇️🔧👨‍💼]\s*/,
                                        "",
                                      )}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-600">
                                    {reply.detail}
                                  </p>
                                </div>
                              </Button>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* ✅ Enhanced Input với gradient styling */}
                      <div className="flex-shrink-0 p-4 bg-gradient-to-r from-gray-50 to-orange-50 border-t border-gray-200">
                        <div className="flex gap-2 mb-2">
                          <div className="relative flex-1">
                            <Input
                              value={inputValue}
                              onChange={(e) => setInputValue(e.target.value)}
                              onKeyPress={handleKeyPress}
                              placeholder={
                                isConnectedToAdmin
                                  ? "💬 Tin nhắn tới admin..."
                                  : "💭 Nhập câu hỏi của bạn..."
                              }
                              className="pr-10 bg-white/80 border-gray-300 focus:border-orange-400 focus:ring-orange-400"
                              disabled={isTyping}
                            />
                            <Smile className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          </div>
                          <Button
                            onClick={handleSendMessage}
                            disabled={!inputValue.trim() || isTyping}
                            size="sm"
                            className="px-4 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 shadow-lg"
                          >
                            {isTyping ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Send className="w-4 h-4" />
                            )}
                          </Button>
                        </div>

                        {/* ✅ Info footer với nhiều thông tin */}
                        <div className="space-y-2">
                          {!isConnectedToAdmin && (
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <Shield className="w-3 h-3 text-green-500" />
                              <span>
                                💡 Nói "👨‍💼 Chat Admin" để được hỗ trợ trực tiếp
                              </span>
                            </div>
                          )}

                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>24/7</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-500" />
                                <span>5.0</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Heart className="w-3 h-3 text-red-500" />
                                <span>1K+ users</span>
                              </div>
                            </div>
                            <span className="text-orange-600 font-medium">
                              Template Hub AI
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
