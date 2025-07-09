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
  MapPin,
  Headphones,
  Star,
  Heart,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ContactWidget: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredMethod, setHoveredMethod] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // ✅ Responsive detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const contactMethods = [
    {
      icon: MessageSquare,
      label: "Zalo Chat",
      value: "0971386588",
      action: () => window.open("https://zalo.me/0971386588", "_blank"),
      gradient: "from-blue-500 to-blue-600",
      hoverGradient: "from-blue-600 to-blue-700",
      description: "Chat nhanh nhất",
      status: "online",
      responseTime: "< 1 phút",
    },
    {
      icon: Phone,
      label: "Hotline",
      value: "0971386588",
      action: () => window.open("tel:0971386588"),
      gradient: "from-green-500 to-emerald-600",
      hoverGradient: "from-green-600 to-emerald-700",
      description: "Gọi ngay",
      status: "available",
      responseTime: "Ngay lập tức",
    },
    {
      icon: Mail,
      label: "Email",
      value: "veutong961@gmail.com",
      action: () => window.open("mailto:veutong961@gmail.com"),
      gradient: "from-purple-500 to-pink-600",
      hoverGradient: "from-purple-600 to-pink-700",
      description: "Hỗ trợ chi tiết",
      status: "active",
      responseTime: "< 30 phút",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "available":
        return "bg-blue-500";
      case "active":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  // ✅ Dynamic positioning và sizing
  const getWidgetStyle = () => {
    if (isMobile) {
      return {
        bottom: "20px",
        left: "20px",
        width: "calc(100vw - 40px)",
        maxWidth: "320px",
        maxHeight: "400px", // ✅ Giới hạn chiều cao mobile
      };
    }
    return {
      bottom: "24px",
      left: "24px",
      width: "360px",
      maxHeight: "480px", // ✅ Giới hạn chiều cao desktop
    };
  };

  const widgetStyle = getWidgetStyle();

  return (
    <div
      className="fixed z-40"
      style={{
        bottom: widgetStyle.bottom,
        left: widgetStyle.left,
      }}
    >
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.8 }}
            transition={{
              duration: 0.4,
              ease: [0.23, 1, 0.32, 1],
              staggerChildren: 0.1,
            }}
            className="mb-4"
            style={{
              width: widgetStyle.width,
              maxWidth: widgetStyle.maxWidth,
              maxHeight: widgetStyle.maxHeight,
            }}
          >
            <Card className="h-full border-0 shadow-2xl bg-gradient-to-br from-white via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900 backdrop-blur-lg">
              <CardContent
                className={`${isMobile ? "p-4" : "p-6"} h-full flex flex-col`}
              >
                <div className="flex-1 space-y-3 overflow-y-auto">
                  {/* ✅ Compact Header */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex-shrink-0 space-y-2 text-center"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Headphones
                        className={`${isMobile ? "w-4 h-4" : "w-5 h-5"} text-blue-600`}
                      />
                      <h3
                        className={`${isMobile ? "text-base" : "text-lg"} font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text`}
                      >
                        Hỗ trợ 24/7
                      </h3>
                    </div>
                    {!isMobile && (
                      <>
                        <p className="text-sm text-muted-foreground">
                          Chúng tôi luôn sẵn sàng hỗ trợ bạn
                        </p>
                        <div className="flex items-center justify-center gap-2">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className="w-3 h-3 text-yellow-500 fill-current"
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            5.0 (1,200+ đánh giá)
                          </span>
                        </div>
                      </>
                    )}
                  </motion.div>

                  {/* ✅ Compact Contact Methods */}
                  <div className="flex-1 space-y-2">
                    {contactMethods.map((method, index) => (
                      <motion.div
                        key={method.label}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onHoverStart={() => setHoveredMethod(method.label)}
                        onHoverEnd={() => setHoveredMethod(null)}
                      >
                        <Button
                          onClick={method.action}
                          className={`w-full justify-start gap-3 ${isMobile ? "p-3 h-auto" : "p-4 h-auto"} bg-gradient-to-r ${
                            hoveredMethod === method.label
                              ? method.hoverGradient
                              : method.gradient
                          } text-white shadow-lg hover:shadow-xl transition-all duration-300 group border-0`}
                          variant="default"
                        >
                          <div className="relative">
                            <method.icon
                              className={`${isMobile ? "w-4 h-4" : "w-5 h-5"} transition-transform group-hover:scale-110`}
                            />
                            <div
                              className={`absolute -top-1 -right-1 ${isMobile ? "w-2 h-2" : "w-3 h-3"} ${getStatusColor(method.status)} rounded-full animate-pulse`}
                            />
                          </div>

                          <div className="flex-1 space-y-1 text-left">
                            <div className="flex items-center justify-between">
                              <div
                                className={`${isMobile ? "text-sm" : "text-base"} font-semibold`}
                              >
                                {method.label}
                              </div>
                              <Badge
                                className={`${isMobile ? "text-xs px-1 py-0" : "text-xs"} text-white border-0 bg-white/20`}
                              >
                                {method.responseTime}
                              </Badge>
                            </div>
                            <div
                              className={`${isMobile ? "text-xs" : "text-sm"} opacity-90`}
                            >
                              {method.value}
                            </div>
                            {!isMobile && (
                              <div className="text-xs opacity-75">
                                {method.description}
                              </div>
                            )}
                          </div>

                          <motion.div
                            animate={{
                              x: hoveredMethod === method.label ? 4 : 0,
                            }}
                            transition={{ duration: 0.2 }}
                            className="opacity-60 group-hover:opacity-100"
                          >
                            <ChevronUp className="w-4 h-4 rotate-90" />
                          </motion.div>
                        </Button>
                      </motion.div>
                    ))}
                  </div>

                  {/* ✅ Compact Footer - Chỉ hiện trên desktop */}
                  {!isMobile && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="flex-shrink-0 pt-3 space-y-2 border-t border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>24/7 - Tất cả các ngày</span>
                      </div>
                      <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                        <Heart className="w-3 h-3 text-red-500 fill-current" />
                        <span>10,000+ khách hàng tin tưởng</span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ Responsive Toggle Button */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="relative"
      >
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full opacity-75 bg-gradient-to-r from-green-500 to-blue-500 blur-lg animate-pulse" />

        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`relative ${isMobile ? "w-14 h-14" : "w-16 h-16"} overflow-hidden border-2 rounded-full shadow-2xl bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 border-white/20 group`}
          size="icon"
        >
          {/* Background animation */}
          <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:opacity-100" />

          {/* Notification badge */}
          <div
            className={`absolute flex items-center justify-center ${isMobile ? "w-4 h-4" : "w-5 h-5"} bg-red-500 rounded-full -top-1 -right-1 animate-bounce`}
          >
            <span
              className={`${isMobile ? "text-xs" : "text-xs"} font-bold text-white`}
            >
              3
            </span>
          </div>

          {/* Status indicator */}
          <div
            className={`absolute ${isMobile ? "w-2 h-2" : "w-3 h-3"} bg-green-400 rounded-full top-1 left-1 animate-pulse`}
          />

          <AnimatePresence mode="wait">
            {isExpanded ? (
              <motion.div
                key="close"
                initial={{ rotate: -180, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 180, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.3, ease: "backOut" }}
                className="relative z-10"
              >
                <ChevronDown
                  className={`${isMobile ? "w-6 h-6" : "w-7 h-7"}`}
                />
              </motion.div>
            ) : (
              <motion.div
                key="phone"
                initial={{ rotate: -180, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 180, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.3, ease: "backOut" }}
                className="relative z-10"
              >
                <Phone className={`${isMobile ? "w-6 h-6" : "w-7 h-7"}`} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Ripple effect */}
          <div className="absolute inset-0 rounded-full">
            <div className="absolute inset-0 transition-all duration-500 scale-0 rounded-full bg-white/30 group-hover:scale-100 group-hover:opacity-0" />
          </div>
        </Button>
      </motion.div>

      {/* ✅ Floating particles - Chỉ hiện trên desktop */}
      {!isMobile && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-30"
              animate={{
                y: [-20, -40, -20],
                x: [0, 10, 0],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.5,
              }}
              style={{
                left: `${20 + i * 15}%`,
                bottom: `${60 + i * 10}%`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactWidget;
