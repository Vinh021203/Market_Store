import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Phone,
  MessageSquare,
  Mail,
  ChevronUp,
  ChevronDown,
  Clock,
  Heart,
  Gift,
  X,
  Star,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const ContactWidget: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredMethod, setHoveredMethod] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 🎨 VIBRANT THEME - ĐẬM GIỐNG CHATBOT
  const contactMethods = [
    {
      icon: MessageSquare,
      label: "Zalo Chat",
      value: "0971386588",
      action: () => window.open("https://zalo.me/0971386588", "_blank"),
      description: "Chat nhanh nhất",
      responseTime: "< 1 phút",
      statusColor: "bg-emerald-500",
      iconBg: "from-green-200 to-emerald-300", // ✅ Đậm hơn
      iconColor: "text-green-700",
      borderColor: "border-emerald-300",
    },
    {
      icon: Phone,
      label: "Hotline",
      value: "0971386588",
      action: () => window.open("tel:0971386588"),
      description: "Gọi ngay",
      responseTime: "Ngay lập tức",
      statusColor: "bg-pink-500",
      iconBg: "from-pink-200 to-pink-300", // ✅ Đậm hơn
      iconColor: "text-pink-700",
      borderColor: "border-pink-300",
    },
    {
      icon: Mail,
      label: "Email",
      value: "veutong961@gmail.com",
      action: () => window.open("mailto:veutong961@gmail.com"),
      description: "Hỗ trợ chi tiết",
      responseTime: "< 30 phút",
      statusColor: "bg-rose-500",
      iconBg: "from-rose-200 to-red-300", // ✅ Đậm hơn
      iconColor: "text-rose-700",
      borderColor: "border-rose-300",
    },
  ];

  const getWidgetStyle = () => {
    if (isMobile) {
      return {
        bottom: "20px",
        left: "20px",
        right: "20px",
        width: "auto",
      };
    }
    return {
      bottom: "20px",
      left: "20px",
      width: "320px",
    };
  };

  const widgetStyle = getWidgetStyle();

  return (
    <div className="fixed z-40" style={widgetStyle}>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="mb-3"
          >
            {/* ✅ VIBRANT Background - ĐẬM HƠN */}
            <Card className="border-0 shadow-2xl overflow-hidden backdrop-blur-sm">
              {/* ✅ Đậm hơn: from-pink-100 via-orange-100 to-yellow-100 */}
              <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-orange-100 to-yellow-100" />
              <div className="absolute inset-0 bg-gradient-to-t from-orange-200/30 via-transparent to-transparent" />

              {/* ✅ Decorative elements đậm hơn */}
              <div className="absolute top-3 right-3 w-12 h-12 bg-pink-300/40 rounded-full blur-xl animate-pulse" />
              <div className="absolute bottom-3 left-3 w-10 h-10 bg-orange-300/40 rounded-full blur-lg animate-pulse" />

              <CardContent
                className={cn("relative z-10", isMobile ? "p-4" : "p-5")}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {/* ✅ Icon với animated background */}
                    <motion.div
                      animate={{
                        scale: [1, 1.05, 1],
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="p-2 bg-gradient-to-br from-pink-200 to-orange-300 rounded-xl shadow-lg border-2 border-white/50"
                    >
                      <Gift
                        className="w-5 h-5 text-pink-700"
                        strokeWidth={2.2}
                      />
                    </motion.div>
                    <div>
                      <h3
                        className={cn(
                          "font-bold text-transparent bg-gradient-to-r from-pink-700 via-orange-700 to-yellow-700 bg-clip-text",
                          isMobile ? "text-base" : "text-lg",
                        )}
                      >
                        Liên hệ hỗ trợ
                      </h3>
                      <p className="text-xs font-medium text-slate-700">
                        Hỗ trợ 24/7
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={() => setIsExpanded(false)}
                    variant="ghost"
                    size="sm"
                    className="w-8 h-8 p-0 rounded-full bg-pink-200 hover:bg-pink-300 border-0 text-pink-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Contact Methods */}
                <div className="space-y-3">
                  {contactMethods.map((method, index) => (
                    <motion.div
                      key={method.label}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onHoverStart={() => setHoveredMethod(method.label)}
                      onHoverEnd={() => setHoveredMethod(null)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        onClick={method.action}
                        variant="ghost"
                        className={cn(
                          "w-full justify-between p-3 h-auto rounded-xl transition-all duration-200",
                          "bg-white hover:bg-white border-2 hover:shadow-lg",
                          method.borderColor,
                          `hover:${method.borderColor}`,
                          hoveredMethod === method.label && "shadow-xl",
                        )}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="relative flex-shrink-0">
                            {/* ✅ Animated Icon Background */}
                            <motion.div
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.5 }}
                              className={cn(
                                "w-10 h-10 rounded-xl bg-gradient-to-br shadow-md flex items-center justify-center border-2 border-white/50",
                                `bg-gradient-to-br ${method.iconBg}`,
                              )}
                            >
                              <method.icon
                                className={cn("w-5 h-5", method.iconColor)}
                                strokeWidth={2.2}
                              />
                            </motion.div>
                            <div
                              className={cn(
                                "absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full",
                                method.statusColor,
                                "animate-pulse shadow-md",
                              )}
                            />
                          </div>

                          <div className="text-left flex-1 min-w-0">
                            <div className="font-bold text-sm truncate text-slate-800">
                              {method.label}
                            </div>
                            <div className="text-xs font-medium text-slate-600 truncate">
                              {method.value}
                            </div>
                          </div>
                        </div>

                        <Badge className="bg-gradient-to-r from-pink-200 to-orange-200 text-pink-800 border-0 text-xs px-2 py-0.5 ml-2 shadow-sm font-bold">
                          {method.responseTime}
                        </Badge>
                      </Button>
                    </motion.div>
                  ))}
                </div>

                {/* Footer */}
                <div className="mt-4 pt-3 border-t-2 border-pink-200">
                  <div className="flex items-center justify-center gap-4 text-xs font-medium text-slate-700">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-pink-600" />
                      <span>24/7</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-yellow-600 fill-current" />
                      <span>5.0 (1.2K+)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-pink-600 fill-current" />
                      <span>10K+ users</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ VIBRANT Toggle Button */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        {/* ✅ Vibrant glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-500 opacity-60 blur-xl animate-pulse" />

        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "relative rounded-full shadow-2xl border-2 border-white transition-all duration-300 group",
            "bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-500", // ✅ Đậm hơn
            "hover:from-pink-600 hover:via-orange-600 hover:to-yellow-600",
            "hover:shadow-pink-400/60 hover:scale-105",
            isMobile ? "w-12 h-12" : "w-14 h-14",
          )}
          size="icon"
        >
          {/* Status indicator */}
          <div className="absolute w-3 h-3 bg-green-500 rounded-full top-0 left-0 animate-pulse border-2 border-white shadow-lg" />

          {/* Notification badge */}
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 rounded-full flex items-center justify-center border-2 border-white animate-bounce shadow-lg">
            <span className="text-xs font-bold text-white">3</span>
          </div>

          {/* Icon */}
          <AnimatePresence mode="wait">
            {isExpanded ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown
                  className={cn(
                    "text-white drop-shadow-lg",
                    isMobile ? "w-5 h-5" : "w-6 h-6",
                  )}
                />
              </motion.div>
            ) : (
              <motion.div
                key="phone"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Phone
                  className={cn(
                    "text-white drop-shadow-lg",
                    isMobile ? "w-5 h-5" : "w-6 h-6",
                  )}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Ripple effect */}
          <div className="absolute inset-0 rounded-full">
            <div className="absolute inset-0 rounded-full bg-white/20 scale-0 group-hover:scale-100 group-hover:opacity-0 transition-all duration-300" />
          </div>
        </Button>
      </motion.div>

      {/* ✅ VIBRANT floating particles */}
      {!isMobile && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className={cn(
                "absolute w-1.5 h-1.5 rounded-full shadow-sm",
                i === 0
                  ? "bg-pink-300/70"
                  : i === 1
                    ? "bg-orange-300/70"
                    : "bg-yellow-300/70",
              )}
              animate={{
                y: [-10, -40, -10],
                x: [0, 8, 0],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3,
              }}
              style={{
                left: `${20 + i * 15}%`,
                bottom: `${50 + i * 10}%`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactWidget;
