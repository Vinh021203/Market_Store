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

// 🎨 SOFTPINKTHEME COLOR SCHEME - GIỐNG TEMPLATES
const softPinkTheme = {
  // Primary gradients - Pink-Orange-Yellow
  primaryGradient: "from-pink-400 via-orange-400 to-yellow-400",
  secondaryGradient: "from-pink-500 via-orange-500 to-yellow-500",
  accentGradient: "from-orange-500 via-pink-500 to-yellow-500",

  // Background tones
  pageBackground: "from-pink-50 via-blue-50 to-yellow-50",
  sectionBackground: "from-pink-50/80 via-blue-50/60 to-yellow-50/80",

  // Glass & Cards
  glassCard: "from-white/95 via-pink-50/60 to-blue-50/40 backdrop-blur-xl",
  neoCard: "bg-gradient-to-br from-white/95 via-pink-50/60 to-blue-50/40",
  floatingCard: "from-white/90 via-pink-50/60 to-blue-50/40",

  // Text colors
  heroText: "from-pink-600 via-blue-600 to-orange-600",
  primaryText: "from-pink-600 via-blue-600 to-orange-600",
  accentText: "from-orange-500 via-pink-500 to-yellow-500",

  // Effects
  glow: "shadow-pink-200/60 shadow-2xl",
  neonGlow: "shadow-rose-300/50 shadow-xl",
  softGlow: "shadow-pink-200/40 shadow-lg",

  // Dynamic colors for components
  dynamicColors: {
    user: {
      gradient: "from-pink-400 via-orange-400 to-yellow-400",
      hoverGradient: "from-pink-500 via-orange-500 to-yellow-500",
      background: "from-pink-50/90 to-orange-50/70",
      border: "border-pink-200",
      text: "text-pink-600",
      glow: "shadow-pink-400/30",
    },
    bot: {
      gradient: "from-blue-400 via-cyan-500 to-blue-500",
      hoverGradient: "from-blue-500 via-cyan-600 to-blue-600",
      background: "from-blue-50/90 to-cyan-50/70",
      border: "border-blue-200",
      text: "text-blue-600",
      glow: "shadow-blue-400/30",
    },
    admin: {
      gradient: "from-emerald-400 via-green-500 to-emerald-500",
      hoverGradient: "from-emerald-500 via-green-600 to-emerald-600",
      background: "from-emerald-50/90 to-green-50/70",
      border: "border-emerald-200",
      text: "text-emerald-600",
      glow: "shadow-emerald-400/30",
    },
  },
};

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

  // 🎨 SOFTPINKTHEME Quick Replies
  const quickReplies = [
    {
      id: 1,
      text: "Bảng giá",
      icon: DollarSign,
      detail: "Xem giá templates từ 99k-999k",
      color: softPinkTheme.dynamicColors.user.gradient, // Pink-orange-yellow
    },
    {
      id: 2,
      text: "Templates",
      icon: Sparkles,
      detail: "2,500+ mẫu website chất lượng cao",
      color: "from-blue-400 via-cyan-500 to-blue-500", // Blue variation
    },
    {
      id: 3,
      text: "Thanh toán",
      icon: Crown,
      detail: "VNPay, MoMo, Banking an toàn",
      color: "from-yellow-400 via-orange-500 to-yellow-500", // Yellow variation
    },
    {
      id: 4,
      text: "Download",
      icon: Download,
      detail: "Cách tải file sau khi mua",
      color: "from-pink-500 via-rose-400 to-pink-400", // Pink variation
    },
    {
      id: 5,
      text: "Hỗ trợ",
      icon: Settings,
      detail: "Cài đặt & customization",
      color: "from-orange-400 via-yellow-400 to-orange-400", // Orange variation
    },
    {
      id: 6,
      text: "Chat Admin",
      icon: UserCheck,
      detail: "Kết nối trực tiếp với admin",
      color: softPinkTheme.dynamicColors.admin.gradient, // Admin green
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

🎨 Template Market - Nền tảng thiết kế #1 Việt Nam

✨ Chúng tôi chuyên cung cấp:
• 2,500+ Templates responsive cao cấp
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
📧 Email: veutong961@gmail.com

Admin sẽ join chat ngay! 👨‍💼✨`;
    }

    if (message.includes("giá") || message.includes("price")) {
      return `💰 BẢNG GIÁ TEMPLATES 2025

🔥 BASIC (299k - 599k):
• Landing page chuyên nghiệp
• 5-10 pages responsive
• Source code HTML/CSS/JS

⭐ PREMIUM (699k - 1.299k):
• Website business hoàn chỉnh
• 15-25 pages + admin panel
• React/Vue.js framework

💎 ENTERPRISE (1.599k - 2.999k):
• Multi-platform system
• Custom features unlimited
• 1 năm support miễn phí

🎁 COMBO HOT: Mua 3 tặng 1!
💳 Thanh toán linh hoạt, bảo hành 12 tháng`;
    }

    if (message.includes("template") || message.includes("mẫu")) {
      return `🎨 KHO TEMPLATES CHẤT LƯỢNG

📊 DANH MỤC HOT:
• React & Next.js (850+)
• Vue.js & Nuxt.js (620+)  
• Dashboard Admin (340+)
• E-commerce (280+)
• Landing Pages (490+)
• Mobile Apps (190+)

🚀 ĐẶC ĐIỂM NỔI BẬT:
✅ Responsive 100% devices
✅ TypeScript support
✅ SEO optimize built-in
✅ Performance 95+ Lighthouse
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
🎁 Ưu đãi thanh toán online -15%
💸 Hoàn tiền 100% nếu không hài lòng`;
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
• Documentation chi tiết
• Assets & resources
• Video tutorial setup
• License thương mại

⏰ Link download active vĩnh viễn
🔄 Re-download unlimited lần`;
    }

    if (message.includes("hỗ trợ") || message.includes("support")) {
      return `🔧 HỖ TRỢ KỸ THUẬT 24/7

📞 KÊNH LIÊN HỆ:
• Hotline: 0971386588 (24/7)
• Zalo: 0971386588 (Chat realtime)
• Email: veutong961@gmail.com
• Discord: Template Market Community

🛠️ DỊCH VỤ HỖ TRỢ:
✅ Setup & installation
✅ Customization theo yêu cầu
✅ Bug fixing & optimization  
✅ SEO & performance tuning
✅ Deploy lên production

⚡ Thời gian phản hồi:
• Chat: < 5 phút
• Email: < 2 giờ
• Video call: Đặt lịch trước`;
    }

    if (
      message.includes("xin chào") ||
      message.includes("hello") ||
      message.includes("hi")
    ) {
      return `Xin chào! 👋 Rất vui được hỗ trợ bạn!

🎯 Tôi là AI Assistant của Template Market
⚡ Có thể giúp bạn 24/7 về:
• Tư vấn templates phù hợp
• Hướng dẫn thanh toán
• Kỹ thuật & setup
• Kết nối admin trực tiếp

😊 Bạn cần hỗ trợ gì hôm nay?`;
    }

    return `Cảm ơn bạn đã liên hệ! 🙏

💡 Để được hỗ trợ tốt nhất:
• Click "Bảng giá" - Xem pricing chi tiết
• Click "Templates" - Browse catalog
• Click "Chat Admin" - Kết nối trực tiếp

🚀 Hoặc gọi hotline: 0971386588
📱 Zalo: 0971386588 (phản hồi nhanh nhất)`;
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

  // Compact sizing - Optimized for mobile
  const getChatDimensions = () => {
    if (isMobile) {
      return {
        width: "calc(100vw - 32px)",
        maxWidth: "360px",
        height: isMinimized ? "56px" : Math.min(windowSize.height * 0.65, 450),
        bottom: "80px",
        right: "16px",
      };
    }
    if (isTablet) {
      return {
        width: "380px",
        height: isMinimized ? "56px" : "480px",
        bottom: "90px",
        right: "24px",
      };
    }
    return {
      width: "420px",
      height: isMinimized ? "56px" : "520px",
      bottom: "100px",
      right: "32px",
    };
  };

  const chatDimensions = getChatDimensions();

  return (
    <>
      {/* 🎨 SOFTPINKTHEME Chat Toggle Button */}
      <motion.div
        className="fixed z-[100]"
        style={{
          bottom: isMobile ? "20px" : "32px",
          right: isMobile ? "20px" : "32px",
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* 🎨 SOFTPINKTHEME Glow effect */}
        <div
          className={`absolute inset-0 rounded-full opacity-60 bg-gradient-to-r ${softPinkTheme.primaryGradient} blur-xl animate-pulse`}
        />

        <Button
          onClick={onToggle}
          className={cn(
            `relative rounded-full ${softPinkTheme.glow} bg-gradient-to-r ${softPinkTheme.primaryGradient} hover:bg-gradient-to-r hover:${softPinkTheme.secondaryGradient} border-2 border-white/30 overflow-hidden group transition-all duration-300`,
            isMobile ? "w-14 h-14" : "w-16 h-16",
          )}
          size="icon"
        >
          {/* 🎨 SOFTPINKTHEME Background animation */}
          <div
            className={`absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r ${softPinkTheme.accentGradient} group-hover:opacity-100`}
          />

          {/* Admin connection indicator */}
          {isConnectedToAdmin && (
            <div className="absolute flex items-center justify-center w-6 h-6 bg-emerald-400 rounded-full -top-1 -right-1 animate-bounce shadow-lg border-2 border-white">
              <UserCheck className="w-3 h-3 text-white" />
            </div>
          )}

          {/* New message indicator */}
          <div className="absolute flex items-center justify-center w-5 h-5 bg-yellow-400 rounded-full -top-1 -left-1 animate-pulse shadow-lg border-2 border-white">
            <Gift className="w-2.5 h-2.5 text-orange-600" />
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
                    "drop-shadow-lg text-white",
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
                    "drop-shadow-lg text-white",
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

      {/* 🎨 SOFTPINKTHEME Chat Window */}
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
            <Card
              className={`flex flex-col h-full border-0 ${softPinkTheme.glow} overflow-hidden relative`}
            >
              {/* 🎨 SOFTPINKTHEME Background gradients */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${softPinkTheme.primaryGradient}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-pink-500/20 via-orange-500/10 to-transparent" />

              {/* 🎨 SOFTPINKTHEME Decorative elements */}
              <div className="absolute top-4 right-4 w-12 h-12 bg-yellow-300/20 rounded-full blur-xl animate-pulse" />
              <div className="absolute bottom-6 left-4 w-8 h-8 bg-pink-300/20 rounded-full blur-lg animate-pulse" />
              <div className="absolute top-1/2 right-2 w-6 h-6 bg-orange-300/20 rounded-full blur-md animate-pulse" />

              {/* Header */}
              <CardHeader className="flex-shrink-0 p-4 text-white relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-md ${softPinkTheme.softGlow} border border-white/30`}
                    >
                      {isConnectedToAdmin ? (
                        <Headphones className="w-5 h-5" />
                      ) : (
                        <Bot className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <CardTitle
                        className={cn(
                          "font-bold drop-shadow-lg text-white",
                          isMobile ? "text-base" : "text-lg",
                        )}
                      >
                        {isConnectedToAdmin
                          ? "🔥 Chat với Admin"
                          : "🤖 AI Assistant"}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <p className="text-sm opacity-90 drop-shadow-md">
                          {isConnectedToAdmin
                            ? "⚡ Admin đang online"
                            : "💬 AI hỗ trợ 24/7"}
                        </p>
                        {isConnectedToAdmin && (
                          <div className="w-2.5 h-2.5 bg-emerald-300 rounded-full animate-pulse shadow-lg" />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!isMobile && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="p-0 text-white w-8 h-8 hover:bg-white/20 rounded-full backdrop-blur-md"
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
                      className="p-0 text-white w-8 h-8 hover:bg-white/20 rounded-full backdrop-blur-md"
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
                    <CardContent
                      className={`flex flex-col flex-1 min-h-0 p-0 bg-gradient-to-br ${softPinkTheme.glassCard}`}
                    >
                      {/* Messages Area */}
                      <div className="flex-1 overflow-hidden">
                        <div
                          className="h-full overflow-y-auto p-4 space-y-4"
                          style={{
                            scrollbarWidth: "thin",
                            scrollbarColor:
                              "rgba(236, 72, 153, 0.3) transparent",
                          }}
                        >
                          <style>{`
                            div::-webkit-scrollbar {
                              width: 6px;
                            }
                            div::-webkit-scrollbar-track {
                              background: transparent;
                            }
                            div::-webkit-scrollbar-thumb {
                              background-color: rgba(236, 72, 153, 0.3);
                              border-radius: 3px;
                              border: none;
                            }
                            div::-webkit-scrollbar-thumb:hover {
                              background-color: rgba(236, 72, 153, 0.5);
                            }
                          `}</style>

                          {messages.map((message) => (
                            <motion.div
                              key={message.id}
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                              className={cn(
                                "flex",
                                message.sender === "user"
                                  ? "justify-end"
                                  : "justify-start",
                              )}
                            >
                              <div
                                className={cn(
                                  "flex items-start gap-3 max-w-[85%]",
                                  message.sender === "user"
                                    ? "flex-row-reverse"
                                    : "flex-row",
                                )}
                              >
                                <div
                                  className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg",
                                    message.sender === "user"
                                      ? `bg-gradient-to-r ${softPinkTheme.dynamicColors.user.gradient} text-white`
                                      : message.sender === "admin"
                                        ? `bg-gradient-to-r ${softPinkTheme.dynamicColors.admin.gradient} text-white`
                                        : `bg-gradient-to-r ${softPinkTheme.dynamicColors.bot.gradient} text-white`,
                                  )}
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
                                  className={cn(
                                    "px-4 py-3 rounded-2xl shadow-lg backdrop-blur-md",
                                    message.sender === "user"
                                      ? `bg-gradient-to-r ${softPinkTheme.dynamicColors.user.gradient} text-white`
                                      : message.sender === "admin"
                                        ? `bg-gradient-to-r ${softPinkTheme.dynamicColors.admin.gradient} text-white`
                                        : `bg-white/95 text-gray-800 border border-gray-200/50`,
                                  )}
                                >
                                  <div className="text-sm leading-relaxed whitespace-pre-wrap">
                                    {message.text}
                                  </div>
                                  <p className="mt-2 text-xs opacity-75">
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

                          {/* 🎨 SOFTPINKTHEME Typing indicator */}
                          {isTyping && (
                            <motion.div
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex justify-start"
                            >
                              <div className="flex items-start gap-3">
                                <div
                                  className={`flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r ${softPinkTheme.dynamicColors.bot.gradient} text-white shadow-lg`}
                                >
                                  <Bot className="w-4 h-4" />
                                </div>
                                <div className="px-4 py-3 bg-white/95 rounded-2xl shadow-lg backdrop-blur-md border border-gray-200/50">
                                  <div className="flex gap-1.5">
                                    {[0, 1, 2].map((i) => (
                                      <div
                                        key={i}
                                        className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
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

                      {/* 🎨 SOFTPINKTHEME Quick replies */}
                      {showQuickReplies && messages.length <= 1 && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className={`flex-shrink-0 p-4 bg-gradient-to-r ${softPinkTheme.sectionBackground} border-t border-pink-200/50`}
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <Zap className="w-4 h-4 text-pink-600" />
                            <p className="text-sm font-semibold text-gray-800">
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
                                className={`justify-start h-auto p-3 text-left bg-white/90 hover:bg-white hover:${softPinkTheme.softGlow} transition-all duration-200 border-pink-200/50 hover:border-pink-300`}
                              >
                                <div className="w-full">
                                  <div className="flex items-center gap-2 mb-1">
                                    <div
                                      className={cn(
                                        "w-5 h-5 rounded-lg flex items-center justify-center bg-gradient-to-r",
                                        reply.color,
                                      )}
                                    >
                                      <reply.icon className="w-3 h-3 text-white" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-800 truncate">
                                      {reply.text}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-600 line-clamp-2 leading-tight">
                                    {reply.detail}
                                  </p>
                                </div>
                              </Button>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* 🎨 SOFTPINKTHEME Input area */}
                      <div
                        className={`flex-shrink-0 p-4 bg-gradient-to-r ${softPinkTheme.sectionBackground} border-t border-pink-200/50`}
                      >
                        <div className="flex gap-3 mb-3">
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
                              className="text-sm bg-white/95 border-pink-300/50 focus:border-pink-400 focus:ring-pink-400/50 rounded-xl"
                              disabled={isTyping}
                            />
                          </div>
                          <Button
                            onClick={handleSendMessage}
                            disabled={!inputValue.trim() || isTyping}
                            size="sm"
                            className={`px-4 bg-gradient-to-r ${softPinkTheme.primaryGradient} hover:bg-gradient-to-r hover:${softPinkTheme.secondaryGradient} ${softPinkTheme.softGlow} rounded-xl`}
                          >
                            {isTyping ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Send className="w-4 h-4" />
                            )}
                          </Button>
                        </div>

                        {/* Footer Info */}
                        <div className="space-y-2">
                          {!isConnectedToAdmin && (
                            <div className="flex items-center gap-2 text-xs text-gray-700">
                              <Shield className="w-3 h-3 text-green-500 flex-shrink-0" />
                              <span className="line-clamp-1">
                                💡 Click "Chat Admin" để được hỗ trợ trực tiếp
                                bởi chuyên gia
                              </span>
                            </div>
                          )}

                          <div className="flex items-center justify-between text-xs text-gray-600">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3 flex-shrink-0" />
                                <span>24/7</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                                <span>4.9★</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Heart className="w-3 h-3 text-pink-500 flex-shrink-0" />
                                <span>50K+</span>
                              </div>
                            </div>
                            <span className="text-pink-600 font-semibold text-xs">
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
