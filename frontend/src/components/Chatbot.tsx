// components/Chatbot.tsx - Enhanced responsive với chiều cao chuẩn
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

  // Quick replies - Shortened for mobile
  const quickReplies = [
    { id: 1, text: "Xem giá", icon: "💰" },
    { id: 2, text: "Thanh toán", icon: "💳" },
    { id: 3, text: "Hỗ trợ", icon: "📞" },
    { id: 4, text: "Download", icon: "⬇️" },
    { id: 5, text: "Chat admin", icon: "👨‍💼" },
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
            text: "Xin chào! Tôi có thể giúp gì cho bạn? 😊",
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
      return `Đã thông báo admin! 👨‍💼

Trong lúc chờ:
📞 Hotline: 0971386588
📧 Email: veutong961@gmail.com
💬 Zalo: 0971386588`;
    }

    if (message.includes("giá") || message.includes("price")) {
      return `💰 Bảng giá Templates:

🔥 Cơ bản: 99k - 299k
⭐ Premium: 399k - 699k  
💎 Enterprise: 799k - 999k

Xem chi tiết?`;
    }

    if (message.includes("template") || message.includes("mẫu")) {
      return "Có 100+ templates chất lượng cao: website, landing page, dashboard. Bạn cần loại nào?";
    }

    if (message.includes("thanh toán") || message.includes("payment")) {
      return `💳 Thanh toán qua:
✅ VNPay ✅ MoMo ✅ Banking
An toàn 100%!`;
    }

    if (message.includes("download") || message.includes("tải")) {
      return `⬇️ Cách download:
1️⃣ Thanh toán
2️⃣ Vào "Downloads"  
3️⃣ Click tải xuống
Ngay lập tức!`;
    }

    if (message.includes("hỗ trợ") || message.includes("support")) {
      return `📞 Hỗ trợ 24/7:
🔥 Hotline: 0971386588
📧 Email: veutong961@gmail.com  
💬 Zalo: 0971386588`;
    }

    if (
      message.includes("xin chào") ||
      message.includes("hello") ||
      message.includes("hi")
    ) {
      return "Xin chào! Rất vui được hỗ trợ bạn 😊";
    }

    return "Cảm ơn bạn! Nói 'chat admin' để được hỗ trợ trực tiếp nhé 👨‍💼";
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
    }, 1000);
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

  // ✅ Dynamic sizing based on screen
  const getChatSize = () => {
    if (isMobile) {
      return {
        width: "calc(100vw - 24px)",
        maxWidth: "360px",
        height: isMinimized ? "auto" : "calc(100vh - 120px)",
        maxHeight: "500px",
        bottom: "80px",
        right: "12px",
      };
    }
    return {
      width: "380px",
      height: isMinimized ? "auto" : "480px",
      bottom: "100px",
      right: "24px",
    };
  };

  const chatSize = getChatSize();

  return (
    <>
      {/* ✅ Enhanced Chat Toggle Button */}
      <motion.div
        className="fixed z-50"
        style={{
          bottom: isMobile ? "20px" : "24px",
          right: isMobile ? "20px" : "24px",
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={onToggle}
          className={`relative rounded-full shadow-xl ${isMobile ? "w-12 h-12" : "w-14 h-14"} bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700`}
          size="icon"
        >
          {isConnectedToAdmin && (
            <div className="absolute flex items-center justify-center w-4 h-4 bg-green-500 rounded-full -top-1 -right-1 animate-pulse">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
          )}

          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className={isMobile ? "w-5 h-5" : "w-6 h-6"} />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MessageCircle className={isMobile ? "w-5 h-5" : "w-6 h-6"} />
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>

      {/* ✅ Enhanced Chat Window với responsive size */}
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
              maxHeight: chatSize.maxHeight,
              bottom: chatSize.bottom,
              right: chatSize.right,
            }}
          >
            <Card className="flex flex-col h-full bg-white border-0 shadow-2xl dark:bg-slate-900">
              {/* ✅ Enhanced Header */}
              <CardHeader className="flex-shrink-0 p-3 text-white rounded-t-lg bg-gradient-to-r from-blue-500 to-purple-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20">
                      {isConnectedToAdmin ? (
                        <Headphones className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <CardTitle className={isMobile ? "text-sm" : "text-base"}>
                        {isConnectedToAdmin ? "Chat Admin" : "Template Bot"}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <p className="text-xs opacity-90">
                          {isConnectedToAdmin ? "Online" : "Trợ lý ảo"}
                        </p>
                        {isConnectedToAdmin && (
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
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
                        className="p-0 text-white w-7 h-7 hover:bg-white/20"
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
                      className="p-0 text-white w-7 h-7 hover:bg-white/20"
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
                    className="flex flex-col flex-1 min-h-0"
                  >
                    <CardContent className="flex flex-col flex-1 min-h-0 p-0">
                      {/* ✅ Messages với responsive height */}
                      <ScrollArea
                        className={`flex-1 p-3 ${isMobile ? "min-h-0" : ""}`}
                      >
                        <div className="space-y-3">
                          {messages.map((message) => (
                            <motion.div
                              key={message.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`flex items-start gap-2 max-w-[85%] ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
                              >
                                <div
                                  className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                                    message.sender === "user"
                                      ? "bg-blue-500 text-white"
                                      : message.sender === "admin"
                                        ? "bg-green-500 text-white"
                                        : "bg-gray-200 dark:bg-gray-700"
                                  }`}
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
                                  className={`px-3 py-2 rounded-2xl ${
                                    message.sender === "user"
                                      ? "bg-blue-500 text-white"
                                      : message.sender === "admin"
                                        ? "bg-green-500 text-white"
                                        : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                  }`}
                                >
                                  <p className="text-sm leading-relaxed whitespace-pre-line">
                                    {message.text}
                                  </p>
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

                          {/* ✅ Enhanced Typing Indicator */}
                          {isTyping && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex justify-start"
                            >
                              <div className="flex items-start gap-2">
                                <div className="flex items-center justify-center bg-gray-200 rounded-full w-7 h-7 dark:bg-gray-700">
                                  <Bot className="w-3 h-3" />
                                </div>
                                <div className="px-3 py-2 bg-gray-100 rounded-2xl dark:bg-gray-800">
                                  <div className="flex gap-1">
                                    <div
                                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                      style={{ animationDelay: "0ms" }}
                                    />
                                    <div
                                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                      style={{ animationDelay: "150ms" }}
                                    />
                                    <div
                                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                      style={{ animationDelay: "300ms" }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                          <div ref={messagesEndRef} />
                        </div>
                      </ScrollArea>

                      {/* ✅ Quick Replies - Compact */}
                      {showQuickReplies && messages.length <= 1 && (
                        <div className="flex-shrink-0 p-3 border-t bg-gray-50 dark:bg-gray-800">
                          <p className="mb-2 text-xs text-muted-foreground">
                            Câu hỏi thường gặp:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {quickReplies.map((reply) => (
                              <Button
                                key={reply.id}
                                variant="outline"
                                size="sm"
                                onClick={() => handleQuickReply(reply.text)}
                                className="px-2 text-xs h-7"
                              >
                                {reply.icon} {reply.text}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* ✅ Enhanced Input */}
                      <div className="flex-shrink-0 p-3 border-t">
                        <div className="flex gap-2">
                          <Input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder={
                              isConnectedToAdmin
                                ? "Tin nhắn admin..."
                                : "Nhập tin nhắn..."
                            }
                            className="flex-1 text-sm"
                            disabled={isTyping}
                          />
                          <Button
                            onClick={handleSendMessage}
                            disabled={!inputValue.trim() || isTyping}
                            size="sm"
                            className="px-3 bg-blue-500 hover:bg-blue-600"
                          >
                            {isTyping ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Send className="w-4 h-4" />
                            )}
                          </Button>
                        </div>

                        {!isConnectedToAdmin && (
                          <p className="mt-2 text-xs text-muted-foreground">
                            💡 Nói "chat admin" để được hỗ trợ trực tiếp
                          </p>
                        )}
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
