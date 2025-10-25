import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, UserPlus, X } from "lucide-react";
import { getAllProducts, formatPrice } from "@/lib/products";
import type { Product } from "@/types";

interface NotificationData {
  id: string;
  type: "purchase" | "signup";
  name: string;
  productName?: string;
  productPrice?: number;
  timeAgo: string;
  location: string;
}

// 🎭 REALISTIC VIETNAMESE NAMES - 50 common names
const VIETNAMESE_NAMES = [
  "Nguyễn Văn Anh",
  "Trần Thị Hương",
  "Lê Hoàng Long",
  "Phạm Minh Tuấn",
  "Hoàng Thu Hà",
  "Vũ Đức Nam",
  "Đỗ Thị Mai",
  "Bùi Hải Đăng",
  "Dương Thanh Lan",
  "Ngô Quang Huy",
  "Phan Thị Hương",
  "Võ Văn Tú",
  "Lý Thu Trang",
  "Đinh Minh Sơn",
  "Hồ Thị Linh",
  "Mai Văn An",
  "Chu Đức Đạt",
  "Tạ Thị Yến",
  "La Quang Hùng",
  "Ông Thu Trang",
  "Đặng Văn Khoa",
  "Trương Thị Ngọc",
  "Lương Minh Phương",
  "Đào Thị Lan",
  "Dương Văn Bình",
  "Cao Thị Nga",
  "Trịnh Quang Vinh",
  "Bành Thị Hoa",
  "Đinh Văn Tài",
  "Nghiêm Thị Thu",
  "Phan Minh Tâm",
  "Tôn Thị Hằng",
  "Vương Văn Đức",
  "Đoàn Thị Thảo",
  "Lê Văn Hải",
  "Nguyễn Thị Nhung",
  "Trần Quang Dũng",
  "Hoàng Thị Hiền",
  "Phạm Văn Toàn",
  "Lê Thị Kim Oanh",
  "Nguyễn Đức Thắng",
  "Trần Thị Phương",
  "Vũ Minh Quang",
  "Đỗ Thị Thư",
  "Bùi Văn Hùng",
  "Dương Thị Hồng",
  "Ngô Văn Kiên",
  "Phan Thị Bích",
  "Võ Quang Minh",
  "Lý Thị Thanh",
];

// 🌍 ALL 63 PROVINCES/CITIES IN VIETNAM
const VIETNAM_PROVINCES = [
  // 🏙️ Thành phố trực thuộc trung ương (5)
  "Hà Nội",
  "TP. Hồ Chí Minh",
  "Hải Phòng",
  "Đà Nẵng",
  "Cần Thơ",

  // 🌾 Miền Bắc (27)
  "Hà Giang",
  "Cao Bằng",
  "Bắc Kạn",
  "Tuyên Quang",
  "Lào Cai",
  "Điện Biên",
  "Lai Châu",
  "Sơn La",
  "Yên Bái",
  "Hòa Bình",
  "Thái Nguyên",
  "Lạng Sơn",
  "Quảng Ninh",
  "Bắc Giang",
  "Phú Thọ",
  "Vĩnh Phúc",
  "Bắc Ninh",
  "Hải Dương",
  "Hưng Yên",
  "Thái Bình",
  "Hà Nam",
  "Nam Định",
  "Ninh Bình",
  "Thanh Hóa",
  "Nghệ An",
  "Hà Tĩnh",
  "Quảng Bình",

  // 🏖️ Miền Trung (14)
  "Quảng Trị",
  "Thừa Thiên Huế",
  "Quảng Nam",
  "Quảng Ngãi",
  "Bình Định",
  "Phú Yên",
  "Khánh Hòa",
  "Ninh Thuận",
  "Bình Thuận",
  "Kon Tum",
  "Gia Lai",
  "Đắk Lắk",
  "Đắk Nông",
  "Lâm Đồng",

  // 🌴 Miền Nam (17)
  "Bình Phước",
  "Tây Ninh",
  "Bình Dương",
  "Đồng Nai",
  "Bà Rịa - Vũng Tàu",
  "Long An",
  "Tiền Giang",
  "Bến Tre",
  "Trà Vinh",
  "Vĩnh Long",
  "Đồng Tháp",
  "An Giang",
  "Kiên Giang",
  "Hậu Giang",
  "Sóc Trăng",
  "Bạc Liêu",
  "Cà Mau",
];

// ⏰ TIME AGO OPTIONS
const TIME_AGO = [
  "vừa xong",
  "1 phút trước",
  "2 phút trước",
  "3 phút trước",
  "5 phút trước",
  "8 phút trước",
  "10 phút trước",
  "15 phút trước",
  "20 phút trước",
];

// 🎲 RANDOM HELPERS
const random = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomName = () => random(VIETNAMESE_NAMES);
const randomProvince = () => random(VIETNAM_PROVINCES);
const randomTime = () => random(TIME_AGO);

const RealtimeNotificationBanner: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentNotification, setCurrentNotification] =
    useState<NotificationData | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // 📦 LOAD PRODUCTS
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const allProducts = await getAllProducts();
        const activeProducts = allProducts.filter((p) => p.isActive);
        setProducts(activeProducts);
      } catch (error) {
        console.error("Error loading products:", error);
      }
    };
    loadProducts();
  }, []);

  // 🔄 GENERATE RANDOM NOTIFICATION
  const generateNotification = (): NotificationData => {
    const isPurchase = Math.random() > 0.3; // 70% purchase, 30% signup

    if (isPurchase && products.length > 0) {
      const product = random(products);
      return {
        id: `notif-${Date.now()}`,
        type: "purchase",
        name: randomName(),
        productName: product.title,
        productPrice: product.price,
        timeAgo: randomTime(),
        location: randomProvince(),
      };
    } else {
      return {
        id: `notif-${Date.now()}`,
        type: "signup",
        name: randomName(),
        timeAgo: randomTime(),
        location: randomProvince(),
      };
    }
  };

  // ⏱️ AUTO SHOW/HIDE NOTIFICATIONS
  useEffect(() => {
    if (isDismissed || products.length === 0) return;

    // Initial delay
    const initialDelay = setTimeout(() => {
      setCurrentNotification(generateNotification());
      setIsVisible(true);
    }, 3000);

    // Recurring notifications
    const interval = setInterval(() => {
      setIsVisible(false);

      setTimeout(() => {
        setCurrentNotification(generateNotification());
        setIsVisible(true);
      }, 500);
    }, 15000); // New notification every 15s

    // Auto hide after 13s
    const hideTimer = setInterval(() => {
      setIsVisible(false);
    }, 13000); // Hide 2s before next one

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
      clearInterval(hideTimer);
    };
  }, [products, isDismissed]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
  };

  if (isDismissed || !currentNotification) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed z-50 top-20 left-4 right-4 md:left-auto md:right-8 md:w-96"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            className="relative overflow-hidden border shadow-2xl rounded-3xl backdrop-blur-xl border-orange-200/50"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,243,230,0.95) 50%, rgba(252,228,236,0.95) 100%)",
            }}
          >
            {/* Animated gradient background */}
            <motion.div
              className="absolute inset-0 opacity-30"
              animate={{
                background: [
                  "radial-gradient(circle at 0% 0%, #f97316 0%, transparent 50%)",
                  "radial-gradient(circle at 100% 100%, #ec4899 0%, transparent 50%)",
                  "radial-gradient(circle at 0% 0%, #f97316 0%, transparent 50%)",
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            {/* Content */}
            <div className="relative p-5">
              <div className="flex items-start space-x-4">
                {/* Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    delay: 0.1,
                  }}
                  className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
                    currentNotification.type === "purchase"
                      ? "bg-gradient-to-br from-green-400 to-emerald-600"
                      : "bg-gradient-to-br from-blue-400 to-indigo-600"
                  }`}
                >
                  {currentNotification.type === "purchase" ? (
                    <ShoppingBag className="w-6 h-6 text-white" />
                  ) : (
                    <UserPlus className="w-6 h-6 text-white" />
                  )}
                </motion.div>

                {/* Text content */}
                <div className="flex-1 min-w-0">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex items-center mb-1 space-x-2">
                      <span className="font-bold text-orange-900 truncate">
                        {currentNotification.name}
                      </span>
                      <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full font-semibold flex-shrink-0">
                        {currentNotification.location}
                      </span>
                    </div>

                    {currentNotification.type === "purchase" ? (
                      <>
                        <p className="mb-1 text-sm text-orange-700/80">
                          vừa mua{" "}
                          <span className="font-semibold text-orange-900">
                            {currentNotification.productName}
                          </span>
                        </p>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-transparent bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text">
                            {formatPrice(currentNotification.productPrice || 0)}
                          </span>
                          <span className="text-xs text-orange-600/70">
                            • {currentNotification.timeAgo}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="mb-1 text-sm text-orange-700/80">
                          vừa tạo tài khoản mới 🎉
                        </p>
                        <span className="text-xs text-orange-600/70">
                          {currentNotification.timeAgo}
                        </span>
                      </>
                    )}
                  </motion.div>
                </div>

                {/* Close button */}
                <motion.button
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleDismiss}
                  className="flex-shrink-0 p-1.5 rounded-full hover:bg-orange-100/80 transition-colors"
                >
                  <X className="w-4 h-4 text-orange-600" />
                </motion.button>
              </div>

              {/* Progress bar */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 13, ease: "linear" }}
                className="absolute bottom-0 left-0 h-1 rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-pink-600"
                style={{ transformOrigin: "left" }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RealtimeNotificationBanner;
