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

  // Enhanced responsive detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // ✅ UPDATED: Pink/Rose/Red themed contact methods
  const contactMethods = [
    {
      icon: MessageSquare,
      label: "Zalo Chat",
      value: "0971386588",
      action: () => window.open("https://zalo.me/0971386588", "_blank"),
      description: "Chat nhanh nhất",
      responseTime: "< 1 phút",
      statusColor: "bg-emerald-400",
      bgColor: "from-emerald-500 to-green-500", // Keep green for Zalo brand consistency
    },
    {
      icon: Phone,
      label: "Hotline",
      value: "0971386588",
      action: () => window.open("tel:0971386588"),
      description: "Gọi ngay",
      responseTime: "Ngay lập tức",
      statusColor: "bg-pink-400", // ✅ UPDATED: Pink status
      bgColor: "from-pink-500 to-rose-500", // ✅ UPDATED: Pink gradient
    },
    {
      icon: Mail,
      label: "Email",
      value: "veutong961@gmail.com",
      action: () => window.open("mailto:veutong961@gmail.com"),
      description: "Hỗ trợ chi tiết",
      responseTime: "< 30 phút",
      statusColor: "bg-rose-400", // ✅ UPDATED: Rose status
      bgColor: "from-rose-500 to-red-500", // ✅ UPDATED: Rose gradient
    },
  ];

  // Optimized positioning - thấp như chatbot
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
            {/* ✅ UPDATED: Main Card với SoftPinkTheme Background */}
            <Card className="border-0 shadow-xl overflow-hidden backdrop-blur-sm">
              {/* ✅ CHỈ ĐỔI DÒNG NÀY: from-pink-400 via-orange-400 to-yellow-400 */}
              <div className="absolute inset-0 bg-gradient-to-br from-pink-400 via-orange-400 to-yellow-400" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

              <CardContent
                className={cn(
                  "relative z-10 text-white",
                  isMobile ? "p-4" : "p-5",
                )}
              >
                {/* Header - Compact */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                      <Gift className="w-5 h-5" strokeWidth={2.2} />
                    </div>
                    <div>
                      <h3
                        className={cn(
                          "font-bold text-white",
                          isMobile ? "text-base" : "text-lg",
                        )}
                      >
                        Liên hệ hỗ trợ
                      </h3>
                      <p className="text-xs text-white/80">Hỗ trợ 24/7</p>
                    </div>
                  </div>

                  <Button
                    onClick={() => setIsExpanded(false)}
                    variant="ghost"
                    size="sm"
                    className="w-8 h-8 p-0 rounded-full bg-white/15 hover:bg-white/25 border-0 text-white"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Contact Methods - Simplified */}
                <div className="space-y-2">
                  {contactMethods.map((method, index) => (
                    <motion.div
                      key={method.label}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onHoverStart={() => setHoveredMethod(method.label)}
                      onHoverEnd={() => setHoveredMethod(null)}
                    >
                      <Button
                        onClick={method.action}
                        variant="ghost"
                        className={cn(
                          "w-full justify-between p-3 h-auto rounded-lg transition-all duration-200",
                          "bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30",
                          hoveredMethod === method.label &&
                            "bg-white/20 scale-[1.02]",
                        )}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="relative flex-shrink-0">
                            <method.icon className="w-5 h-5" strokeWidth={2} />
                            <div
                              className={cn(
                                "absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full",
                                method.statusColor,
                              )}
                            />
                          </div>

                          <div className="text-left flex-1 min-w-0">
                            <div className="font-semibold text-sm truncate">
                              {method.label}
                            </div>
                            <div className="text-xs text-white/75 truncate">
                              {method.value}
                            </div>
                          </div>
                        </div>

                        <Badge className="bg-white/20 text-white border-0 text-xs px-2 py-0.5 ml-2">
                          {method.responseTime}
                        </Badge>
                      </Button>
                    </motion.div>
                  ))}
                </div>

                {/* Footer - Minimal */}
                <div className="mt-4 pt-3 border-t border-white/20">
                  <div className="flex items-center justify-center gap-4 text-xs text-white/80">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>24/7</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-300 fill-current" />
                      <span>5.0 (1.2K+)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-3 h-3 text-pink-200 fill-current" />
                      <span>10K+ users</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ UPDATED: Toggle Button với SoftPinkTheme Background */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        {/* ✅ CHỈ ĐỔI DÒNG NÀY: from-pink-400 via-orange-400 to-yellow-400 */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-400 via-orange-400 to-yellow-400 opacity-20 blur-lg animate-pulse" />

        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "relative rounded-full shadow-lg border-2 border-white/10 transition-all duration-300 group",
            "bg-gradient-to-r from-pink-400 via-orange-400 to-yellow-400", // ✅ CHỈ ĐỔI DÒNG NÀY
            "hover:from-pink-500 hover:via-orange-500 hover:to-yellow-500", // ✅ CHỈ ĐỔI DÒNG NÀY
            "hover:shadow-xl hover:scale-105",
            isMobile ? "w-12 h-12" : "w-14 h-14",
          )}
          size="icon"
        >
          {/* Status indicator */}
          <div className="absolute w-3 h-3 bg-green-400 rounded-full top-0 left-0 animate-pulse border-2 border-white shadow-sm" />

          {/* ✅ UPDATED: Rose notification badge */}
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center border-2 border-white animate-bounce">
            <span className="text-xs font-bold text-white">3</span>
          </div>

          {/* Icon with smooth transition */}
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
                  className={cn("text-white", isMobile ? "w-5 h-5" : "w-6 h-6")}
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
                  className={cn("text-white", isMobile ? "w-5 h-5" : "w-6 h-6")}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Ripple effect on hover */}
          <div className="absolute inset-0 rounded-full">
            <div className="absolute inset-0 rounded-full bg-white/20 scale-0 group-hover:scale-100 group-hover:opacity-0 transition-all duration-300" />
          </div>
        </Button>
      </motion.div>

      {/* ✅ UPDATED: Pink floating particles - Desktop only */}
      {!isMobile && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className={cn(
                "absolute w-1 h-1 rounded-full",
                i === 0
                  ? "bg-white/40"
                  : i === 1
                    ? "bg-rose-300/40" // ✅ UPDATED: Rose particle
                    : "bg-pink-300/40", // ✅ UPDATED: Pink particle
              )}
              animate={{
                y: [-10, -40, -10],
                x: [0, 8, 0],
                opacity: [0.3, 0.7, 0.3],
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
