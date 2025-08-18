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
  Gift,
  X,
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
      gradient: "from-sky-400 to-blue-500",
      hoverGradient: "from-sky-500 to-blue-600",
      description: "Chat nhanh nhất",
      status: "online",
      responseTime: "< 1 phút",
    },
    {
      icon: Phone,
      label: "Hotline",
      value: "0971386588",
      action: () => window.open("tel:0971386588"),
      gradient: "from-emerald-400 to-green-500",
      hoverGradient: "from-emerald-500 to-green-600",
      description: "Gọi ngay",
      status: "available",
      responseTime: "Ngay lập tức",
    },
    {
      icon: Mail,
      label: "Email",
      value: "veutong961@gmail.com",
      action: () => window.open("mailto:veutong961@gmail.com"),
      gradient: "from-pink-400 to-rose-500",
      hoverGradient: "from-pink-500 to-rose-600",
      description: "Hỗ trợ chi tiết",
      status: "active",
      responseTime: "< 30 phút",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-emerald-400";
      case "available":
        return "bg-sky-400";
      case "active":
        return "bg-pink-400";
      default:
        return "bg-gray-400";
    }
  };

  // ✅ Dynamic positioning và sizing với chiều cao cố định
  const getWidgetStyle = () => {
    if (isMobile) {
      return {
        bottom: "20px",
        left: "20px",
        width: "calc(100vw - 40px)",
        maxWidth: "340px",
        height: "380px",
      };
    }
    return {
      bottom: "24px",
      left: "24px",
      width: "380px",
      height: "450px",
    };
  };

  const widgetStyle = getWidgetStyle();

  return (
    <div
      className="fixed z-50"
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
              height: widgetStyle.height,
            }}
          >
            {/* ✅ Gradient Background sáng hơn */}
            <Card
              className="h-full border-0 shadow-2xl overflow-hidden relative"
              style={{ height: "100%" }}
            >
              {/* ✅ Background Gradient sáng rực rỡ */}
              <div className="absolute inset-0 bg-gradient-to-br from-pink-400 via-purple-400 to-cyan-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-400/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-violet-400/40 to-pink-300/40" />

              {/* ✅ Decorative circles sáng hơn */}
              <div className="absolute top-4 right-4 w-24 h-24 bg-white/20 rounded-full blur-xl animate-pulse" />
              <div className="absolute bottom-6 left-6 w-20 h-20 bg-yellow-300/30 rounded-full blur-lg animate-pulse" />
              <div className="absolute top-1/2 right-8 w-16 h-16 bg-cyan-200/25 rounded-full blur-md animate-pulse" />

              <CardContent
                className={`${isMobile ? "p-4" : "p-6"} h-full flex flex-col relative z-10`}
              >
                {/* ✅ Header với Close Button */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex-shrink-0 space-y-3 text-center mb-4 relative"
                >
                  {/* Close Button sáng hơn */}
                  <Button
                    onClick={() => setIsExpanded(false)}
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white/30 hover:bg-white/40 border-0 text-white p-0 shadow-lg backdrop-blur-sm"
                    size="icon"
                  >
                    <X className="w-4 h-4" />
                  </Button>

                  {/* Gift Icon & Title */}
                  <div className="flex items-center justify-center gap-2 text-white">
                    <div className="p-3 bg-white/25 rounded-full shadow-lg backdrop-blur-sm">
                      <Gift className={`${isMobile ? "w-5 h-5" : "w-6 h-6"}`} />
                    </div>
                  </div>

                  <h3
                    className={`${isMobile ? "text-lg" : "text-xl"} font-bold text-white leading-tight drop-shadow-sm`}
                  >
                    Nhận ưu đãi & tài liệu mới
                  </h3>

                  <p
                    className={`${isMobile ? "text-sm" : "text-base"} text-white/95 leading-relaxed drop-shadow-sm`}
                  >
                    Đăng ký để nhận tài liệu VIP, ưu đãi mới, tips & news hot
                    qua email mỗi tuần!
                  </p>

                  {/* Rating sáng hơn */}
                  {!isMobile && (
                    <div className="flex items-center justify-center gap-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-3 h-3 text-yellow-200 fill-current drop-shadow-sm"
                          />
                        ))}
                      </div>
                      <span className="text-xs text-white/90 drop-shadow-sm">
                        5.0 (1,200+ đánh giá)
                      </span>
                    </div>
                  )}
                </motion.div>

                {/* ✅ Scrollable Content Area */}
                <div className="flex-1 overflow-hidden">
                  <div className="h-full overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                    {/* ✅ Contact Methods với style sáng hơn */}
                    <div className="space-y-3">
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
                            className={`w-full justify-start gap-3 ${isMobile ? "p-3 h-auto" : "p-4 h-auto"} 
                              ${
                                hoveredMethod === method.label
                                  ? "bg-white/35 border-white/50 shadow-xl"
                                  : "bg-white/25 border-white/30 shadow-lg"
                              } 
                              text-white hover:shadow-2xl transition-all duration-300 group 
                              border backdrop-blur-md rounded-xl hover:bg-white/35 hover:scale-[1.02]`}
                            variant="outline"
                          >
                            <div className="relative">
                              <method.icon
                                className={`${isMobile ? "w-5 h-5" : "w-6 h-6"} transition-transform group-hover:scale-110 drop-shadow-sm`}
                              />
                              <div
                                className={`absolute -top-1 -right-1 ${isMobile ? "w-2 h-2" : "w-3 h-3"} ${getStatusColor(method.status)} rounded-full animate-pulse shadow-md`}
                              />
                            </div>

                            <div className="flex-1 space-y-1 text-left">
                              <div className="flex items-center justify-between">
                                <div
                                  className={`${isMobile ? "text-sm" : "text-base"} font-semibold drop-shadow-sm`}
                                >
                                  {method.label}
                                </div>
                                <Badge
                                  className={`${isMobile ? "text-xs px-2 py-0.5" : "text-xs px-2 py-1"} text-white border-0 bg-white/30 backdrop-blur-sm shadow-sm`}
                                >
                                  {method.responseTime}
                                </Badge>
                              </div>
                              <div
                                className={`${isMobile ? "text-xs" : "text-sm"} opacity-95 drop-shadow-sm`}
                              >
                                {method.value}
                              </div>
                              {!isMobile && (
                                <div className="text-xs opacity-85 drop-shadow-sm">
                                  {method.description}
                                </div>
                              )}
                            </div>

                            <motion.div
                              animate={{
                                x: hoveredMethod === method.label ? 4 : 0,
                              }}
                              transition={{ duration: 0.2 }}
                              className="opacity-70 group-hover:opacity-100"
                            >
                              <ChevronUp className="w-4 h-4 rotate-90 drop-shadow-sm" />
                            </motion.div>
                          </Button>
                        </motion.div>
                      ))}
                    </div>

                    {/* ✅ Footer Information sáng hơn */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="pt-4 space-y-3 border-t border-white/30 mt-4"
                    >
                      <div className="text-center">
                        <p className="text-xs text-white/90 mb-2 drop-shadow-sm">
                          ⭐ Bảo mật thông tin 100%. Có thể hủy đăng ký bất cứ
                          lúc nào.
                        </p>
                      </div>

                      <div className="flex items-center justify-center gap-4 text-xs text-white/90">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 drop-shadow-sm" />
                          <span className="drop-shadow-sm">24/7</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3 text-red-200 fill-current drop-shadow-sm" />
                          <span className="drop-shadow-sm">
                            10K+ khách hàng
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ Enhanced Toggle Button sáng hơn */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="relative"
      >
        {/* Glow effect sáng hơn */}
        <div className="absolute inset-0 rounded-full opacity-80 bg-gradient-to-r from-pink-400 to-cyan-300 blur-xl animate-pulse" />

        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`relative ${isMobile ? "w-14 h-14" : "w-16 h-16"} overflow-hidden border-2 rounded-full shadow-2xl bg-gradient-to-r from-pink-400 to-cyan-300 hover:from-pink-500 hover:to-cyan-400 border-white/30 group`}
          size="icon"
        >
          {/* Background animation sáng hơn */}
          <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-violet-400 to-purple-400 group-hover:opacity-100" />

          {/* Notification badge sáng hơn */}
          <div
            className={`absolute flex items-center justify-center ${isMobile ? "w-4 h-4" : "w-5 h-5"} bg-red-400 rounded-full -top-1 -right-1 animate-bounce shadow-xl border border-white/20`}
          >
            <span
              className={`${isMobile ? "text-xs" : "text-xs"} font-bold text-white drop-shadow-sm`}
            >
              3
            </span>
          </div>

          {/* Status indicator sáng hơn */}
          <div
            className={`absolute ${isMobile ? "w-2 h-2" : "w-3 h-3"} bg-emerald-300 rounded-full top-1 left-1 animate-pulse shadow-md border border-white/20`}
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
                  className={`${isMobile ? "w-6 h-6" : "w-7 h-7"} drop-shadow-sm`}
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
                <Phone
                  className={`${isMobile ? "w-6 h-6" : "w-7 h-7"} drop-shadow-sm`}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Ripple effect sáng hơn */}
          <div className="absolute inset-0 rounded-full">
            <div className="absolute inset-0 transition-all duration-500 scale-0 rounded-full bg-white/40 group-hover:scale-100 group-hover:opacity-0" />
          </div>
        </Button>
      </motion.div>

      {/* ✅ Enhanced Floating particles sáng hơn */}
      {!isMobile && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-1.5 h-1.5 rounded-full ${
                i % 3 === 0
                  ? "bg-white/60"
                  : i % 3 === 1
                    ? "bg-yellow-200/50"
                    : "bg-cyan-200/50"
              }`}
              animate={{
                y: [-20, -80, -20],
                x: [0, 20, 0],
                opacity: [0.3, 1, 0.3],
                scale: [0.5, 1.2, 0.5],
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.6,
              }}
              style={{
                left: `${10 + i * 10}%`,
                bottom: `${45 + i * 6}%`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactWidget;
