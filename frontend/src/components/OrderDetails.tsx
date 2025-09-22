// import React, { useState, useEffect } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Order, OrderItemUI } from "@/types";
// import { getOrderWithItems } from "@/lib/order";
// import { formatPrice } from "@/lib/products";
// import {
//   Package,
//   User,
//   MapPin,
//   Phone,
//   Mail,
//   Calendar,
//   CreditCard,
//   Truck,
//   CheckCircle,
//   Clock,
//   XCircle,
//   Loader2,
// } from "lucide-react";

// interface OrderDetailModalProps {
//   orderId: string | null;
//   isOpen: boolean;
//   onClose: () => void;
// }

// const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
//   orderId,
//   isOpen,
//   onClose,
// }) => {
//   const [order, setOrder] = useState<Order | null>(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (orderId && isOpen) {
//       fetchOrderDetails();
//     }
//   }, [orderId, isOpen]);

//   const fetchOrderDetails = async () => {
//     if (!orderId) return;

//     setLoading(true);
//     try {
//       const orderData = await getOrderWithItems(orderId);
//       setOrder(orderData);
//     } catch (error) {
//       console.error("Error fetching order details:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusIcon = (status: Order["status"]) => {
//     switch (status) {
//       case "pending":
//         return <Clock className="w-4 h-4" />;
//       case "processing":
//         return <Truck className="w-4 h-4" />;
//       case "completed":
//         return <CheckCircle className="w-4 h-4" />;
//       case "cancelled":
//         return <XCircle className="w-4 h-4" />;
//       default:
//         return <Clock className="w-4 h-4" />;
//     }
//   };

//   const getStatusColor = (status: Order["status"]) => {
//     switch (status) {
//       case "completed":
//         return "default";
//       case "processing":
//         return "secondary";
//       case "pending":
//         return "outline";
//       case "cancelled":
//         return "destructive";
//       default:
//         return "outline";
//     }
//   };

//   const getPaymentColor = (status: Order["payment_status"]) => {
//     switch (status) {
//       case "paid":
//         return "default";
//       case "pending":
//         return "secondary";
//       case "failed":
//         return "destructive";
//       default:
//         return "outline";
//     }
//   };

//   const getStatusText = (status: Order["status"]) => {
//     switch (status) {
//       case "pending":
//         return "Chờ xử lý";
//       case "processing":
//         return "Đang xử lý";
//       case "completed":
//         return "Hoàn thành";
//       case "cancelled":
//         return "Đã hủy";
//       default:
//         return "Không xác định";
//     }
//   };

//   const getPaymentText = (status: Order["payment_status"]) => {
//     switch (status) {
//       case "paid":
//         return "Đã thanh toán";
//       case "pending":
//         return "Chờ thanh toán";
//       case "failed":
//         return "Thất bại";
//       default:
//         return "Không xác định";
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-4xl max-h-[90vh]">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2">
//             <Package className="w-5 h-5" />
//             Chi tiết đơn hàng #{orderId}
//           </DialogTitle>
//           <DialogDescription>
//             Xem thông tin chi tiết về đơn hàng, trạng thái thanh toán và danh
//             sách sản phẩm
//           </DialogDescription>
//         </DialogHeader>

//         <ScrollArea className="max-h-[calc(90vh-120px)]">
//           {loading ? (
//             <div className="flex items-center justify-center py-8">
//               <Loader2 className="w-8 h-8 animate-spin" />
//               <span className="ml-2">Đang tải...</span>
//             </div>
//           ) : order ? (
//             <div className="space-y-6">
//               {/* Thông tin trạng thái */}
//               <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
//                 <Card>
//                   <CardContent className="pt-6">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-sm text-muted-foreground">
//                           Trạng thái
//                         </p>
//                         <div className="flex items-center gap-2 mt-1">
//                           {getStatusIcon(order.status)}
//                           <Badge variant={getStatusColor(order.status)}>
//                             {getStatusText(order.status)}
//                           </Badge>
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>

//                 <Card>
//                   <CardContent className="pt-6">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <p className="text-sm text-muted-foreground">
//                           Thanh toán
//                         </p>
//                         <div className="flex items-center gap-2 mt-1">
//                           <CreditCard className="w-4 h-4" />
//                           <Badge
//                             variant={getPaymentColor(order.payment_status)}
//                           >
//                             {getPaymentText(order.payment_status)}
//                           </Badge>
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>

//                 <Card>
//                   <CardContent className="pt-6">
//                     <div>
//                       <p className="text-sm text-muted-foreground">Tổng tiền</p>
//                       <p className="mt-1 text-2xl font-bold text-primary">
//                         {formatPrice(order.total_price || 0)}
//                       </p>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>

//               {/* Thông tin khách hàng */}
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <User className="w-5 h-5" />
//                     Thông tin khách hàng
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//                     <div className="flex items-center gap-3">
//                       <User className="w-4 h-4 text-muted-foreground" />
//                       <div>
//                         <p className="text-sm text-muted-foreground">Họ tên</p>
//                         <p className="font-medium">
//                           {order.full_name || "Không có"}
//                         </p>
//                       </div>
//                     </div>

//                     <div className="flex items-center gap-3">
//                       <Mail className="w-4 h-4 text-muted-foreground" />
//                       <div>
//                         <p className="text-sm text-muted-foreground">Email</p>
//                         <p className="font-medium">
//                           {order.email || "Không có"}
//                         </p>
//                       </div>
//                     </div>

//                     <div className="flex items-center gap-3">
//                       <Phone className="w-4 h-4 text-muted-foreground" />
//                       <div>
//                         <p className="text-sm text-muted-foreground">
//                           Số điện thoại
//                         </p>
//                         <p className="font-medium">
//                           {order.phone || "Không có"}
//                         </p>
//                       </div>
//                     </div>

//                     <div className="flex items-center gap-3">
//                       <MapPin className="w-4 h-4 text-muted-foreground" />
//                       <div>
//                         <p className="text-sm text-muted-foreground">Địa chỉ</p>
//                         <p className="font-medium">
//                           {[order.address, order.city, order.country]
//                             .filter(Boolean)
//                             .join(", ") || "Không có"}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>

//               {/* Thông tin đơn hàng */}
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <Calendar className="w-5 h-5" />
//                     Thông tin đơn hàng
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//                     <div>
//                       <p className="text-sm text-muted-foreground">Ngày tạo</p>
//                       <p className="font-medium">
//                         {order.created_at
//                           ? new Date(order.created_at).toLocaleString("vi-VN")
//                           : "Không xác định"}
//                       </p>
//                     </div>

//                     <div>
//                       <p className="text-sm text-muted-foreground">
//                         Phương thức thanh toán
//                       </p>
//                       <p className="font-medium">
//                         {order.payment_method || "Không xác định"}
//                       </p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>

//               {/* Danh sách sản phẩm */}
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <Package className="w-5 h-5" />
//                     Sản phẩm ({order.items.length})
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-4">
//                     {order.items.map((item, index) => (
//                       <div key={item.id}>
//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center gap-4">
//                             {item.product?.image && (
//                               <img
//                                 src={item.product.image}
//                                 alt={item.product.title}
//                                 className="object-cover w-16 h-16 rounded-lg"
//                               />
//                             )}
//                             <div>
//                               <h4 className="font-medium">
//                                 {item.product?.title ||
//                                   "Sản phẩm không xác định"}
//                               </h4>
//                               <p className="text-sm text-muted-foreground">
//                                 Số lượng: {item.quantity}
//                               </p>
//                               <p className="text-sm text-muted-foreground">
//                                 Đơn giá: {formatPrice(item.price)}
//                               </p>
//                             </div>
//                           </div>
//                           <div className="text-right">
//                             <p className="font-medium">
//                               {formatPrice(item.price * item.quantity)}
//                             </p>
//                           </div>
//                         </div>
//                         {index < order.items.length - 1 && (
//                           <Separator className="mt-4" />
//                         )}
//                       </div>
//                     ))}
//                   </div>

//                   <Separator className="my-4" />

//                   <div className="flex items-center justify-between">
//                     <span className="text-lg font-semibold">Tổng cộng:</span>
//                     <span className="text-xl font-bold text-primary">
//                       {formatPrice(order.total_price || 0)}
//                     </span>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           ) : (
//             <div className="py-8 text-center">
//               <p className="text-muted-foreground">
//                 Không tìm thấy thông tin đơn hàng
//               </p>
//             </div>
//           )}
//         </ScrollArea>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default OrderDetailModal;

// components/OrderDetailModal.tsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Order, OrderItemUI } from "@/types";
import { getOrderWithItems } from "@/lib/order";
import { formatPrice } from "@/lib/products";
import {
  Package,
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  Star,
  ShoppingBag,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface OrderDetailModalProps {
  orderId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  orderId,
  isOpen,
  onClose,
}) => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (orderId && isOpen) {
      fetchOrderDetails();
    }
  }, [orderId, isOpen]);

  const fetchOrderDetails = async () => {
    if (!orderId) return;

    setLoading(true);
    try {
      const orderData = await getOrderWithItems(orderId);
      setOrder(orderData);
    } catch (error) {
      console.error("Error fetching order details:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "processing":
        return <Truck className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "completed":
        return "from-emerald-500 to-green-600";
      case "processing":
        return "from-blue-500 to-indigo-600";
      case "pending":
        return "from-orange-500 to-yellow-600";
      case "cancelled":
        return "from-red-500 to-rose-600";
      default:
        return "from-gray-500 to-slate-600";
    }
  };

  const getPaymentColor = (status: Order["payment_status"]) => {
    switch (status) {
      case "paid":
        return "from-emerald-500 to-green-600";
      case "pending":
        return "from-amber-500 to-orange-600";
      case "failed":
        return "from-red-500 to-rose-600";
      default:
        return "from-gray-500 to-slate-600";
    }
  };

  const getStatusText = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "Chờ xử lý";
      case "processing":
        return "Đang xử lý";
      case "completed":
        return "Hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  const getPaymentText = (status: Order["payment_status"]) => {
    switch (status) {
      case "paid":
        return "Đã thanh toán";
      case "pending":
        return "Chờ thanh toán";
      case "failed":
        return "Thất bại";
      default:
        return "Không xác định";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 border-0 shadow-2xl">
        {/* Header với gradient background */}
        <DialogHeader className="relative p-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-t-lg">
          {/* Decorative elements */}
          <div className="absolute top-4 right-4 w-12 h-12 bg-white/10 rounded-full blur-xl animate-pulse" />
          <div className="absolute bottom-2 left-4 w-8 h-8 bg-cyan-300/20 rounded-full blur-lg animate-pulse" />

          <div className="relative z-10">
            <DialogTitle className="flex items-center gap-3 text-2xl font-bold mb-2">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Package className="w-6 h-6" />
              </div>
              Chi tiết đơn hàng #{orderId}
            </DialogTitle>
            <DialogDescription className="text-blue-100 text-base">
              Xem thông tin chi tiết về đơn hàng, trạng thái thanh toán và danh
              sách sản phẩm
            </DialogDescription>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-140px)] p-6">
          {loading ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse" />
                <Loader2 className="w-8 h-8 animate-spin absolute inset-0 m-auto text-white" />
              </div>
              <p className="mt-4 text-lg font-medium bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Đang tải thông tin...
              </p>
            </motion.div>
          ) : order ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Thông tin trạng thái với gradient cards */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="relative overflow-hidden border-0 shadow-lg">
                    <div
                      className={cn(
                        "absolute inset-0 bg-gradient-to-br",
                        getStatusColor(order.status),
                      )}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                    <CardContent className="relative z-10 pt-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white/80 text-sm mb-2">
                            Trạng thái
                          </p>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(order.status)}
                            <span className="font-semibold text-lg">
                              {getStatusText(order.status)}
                            </span>
                          </div>
                        </div>
                        <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                          {getStatusIcon(order.status)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="relative overflow-hidden border-0 shadow-lg">
                    <div
                      className={cn(
                        "absolute inset-0 bg-gradient-to-br",
                        getPaymentColor(order.payment_status),
                      )}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                    <CardContent className="relative z-10 pt-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white/80 text-sm mb-2">
                            Thanh toán
                          </p>
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4" />
                            <span className="font-semibold text-lg">
                              {getPaymentText(order.payment_status)}
                            </span>
                          </div>
                        </div>
                        <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                          <CreditCard className="w-5 h-5" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="relative overflow-hidden border-0 shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-600" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                    <CardContent className="relative z-10 pt-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white/80 text-sm mb-2">
                            Tổng tiền
                          </p>
                          <p className="text-2xl font-bold">
                            {formatPrice(order.total_price || 0)}
                          </p>
                        </div>
                        <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                          <Star className="w-5 h-5" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Thông tin khách hàng */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg text-white">
                        <User className="w-5 h-5" />
                      </div>
                      <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                        Thông tin khách hàng
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-emerald-100 to-green-100 rounded-lg">
                          <User className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Họ tên</p>
                          <p className="font-semibold text-gray-800">
                            {order.full_name || "Không có"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg">
                          <Mail className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Email</p>
                          <p className="font-semibold text-gray-800">
                            {order.email || "Không có"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                          <Phone className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">
                            Số điện thoại
                          </p>
                          <p className="font-semibold text-gray-800">
                            {order.phone || "Không có"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-lg">
                          <MapPin className="w-4 h-4 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Địa chỉ</p>
                          <p className="font-semibold text-gray-800">
                            {[order.address, order.city, order.country]
                              .filter(Boolean)
                              .join(", ") || "Không có"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Thông tin đơn hàng */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg text-white">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                        Thông tin đơn hàng
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-cyan-100 to-blue-100 rounded-lg">
                          <Calendar className="w-4 h-4 text-cyan-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Ngày tạo</p>
                          <p className="font-semibold text-gray-800">
                            {order.created_at
                              ? new Date(order.created_at).toLocaleString(
                                  "vi-VN",
                                )
                              : "Không xác định"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-violet-100 to-purple-100 rounded-lg">
                          <CreditCard className="w-4 h-4 text-violet-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">
                            Phương thức thanh toán
                          </p>
                          <p className="font-semibold text-gray-800">
                            {order.payment_method || "Không xác định"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Danh sách sản phẩm */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="p-2 bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg text-white">
                        <ShoppingBag className="w-5 h-5" />
                      </div>
                      <span className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                        Sản phẩm ({order.items.length})
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {order.items.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 + index * 0.1 }}
                        >
                          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-100">
                            <div className="flex items-center gap-4">
                              {item.product?.image && (
                                <div className="relative">
                                  <img
                                    src={item.product.image}
                                    alt={item.product.title}
                                    className="object-cover w-16 h-16 rounded-lg shadow-md"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg" />
                                </div>
                              )}
                              <div>
                                <h4 className="font-semibold text-gray-800 mb-1">
                                  {item.product?.title ||
                                    "Sản phẩm không xác định"}
                                </h4>
                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                  <span className="flex items-center gap-1">
                                    <Package className="w-3 h-3" />
                                    Số lượng: {item.quantity}
                                  </span>
                                  <span>
                                    Đơn giá: {formatPrice(item.price)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="px-3 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg text-white">
                                <p className="font-bold">
                                  {formatPrice(item.price * item.quantity)}
                                </p>
                              </div>
                            </div>
                          </div>
                          {index < order.items.length - 1 && (
                            <Separator className="my-2 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                          )}
                        </motion.div>
                      ))}
                    </div>

                    <Separator className="my-6 bg-gradient-to-r from-transparent via-gray-400 to-transparent h-px" />

                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1 }}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl text-white"
                    >
                      <span className="text-xl font-bold">Tổng cộng:</span>
                      <span className="text-2xl font-bold">
                        {formatPrice(order.total_price || 0)}
                      </span>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-12 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                <Package className="w-8 h-8 text-gray-500" />
              </div>
              <p className="text-lg font-medium text-gray-600">
                Không tìm thấy thông tin đơn hàng
              </p>
            </motion.div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailModal;
