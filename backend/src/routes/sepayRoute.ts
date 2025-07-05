// import express, { Request, Response } from "express";
// import { createClient } from "@supabase/supabase-js"; // Import Supabase Client SDK

// const router = express.Router();

// // Khai báo và khởi tạo Supabase Client một lần với service_role key
// const supabaseUrl = process.env.SUPABASE_URL;
// const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// if (!supabaseUrl || !supabaseServiceKey) {
//   console.error(
//     "🚨 Lỗi: SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY không được cấu hình trong backend!"
//   );
//   // process.exit(1);
// }

// // const supabaseAdmin = createClient(supabaseUrl!, supabaseServiceKey!, {
// //   auth: {
// //     persistSession: false,
// //   },
// // });

// const supabaseAdmin = createClient(
//   process.env.SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY!,
//   {
//     global: {
//       headers: {
//         application_name: "sepay_webhook", // ✅ CHUẨN NHẤT
//       },
//     },
//   }
// );

// // ✅ CẬP NHẬT: Hàm updateOrderToPaid nhận vào status và paymentStatus từ webhook
// const updateOrderToPaid = async (
//   orderId: string,
//   newStatus: "completed" | "failed" | "pending" | "processing" | "refunded", // Các trạng thái có thể có
//   newPaymentStatus:
//     | "completed"
//     | "failed"
//     | "pending"
//     | "processing"
//     | "refunded",
//   sepayTransactionId: string, // ID giao dịch từ SePay
//   transactionDate: string // Thời gian giao dịch từ SePay
// ) => {
//   try {
//     console.log(
//       `🔄 Attempting to update order: ${orderId} to status: ${newStatus}, payment_status: ${newPaymentStatus}`
//     );

//     const { data: existingOrders, error: fetchError } = await supabaseAdmin
//       .from("orders")
//       .select("id,status,payment_status,user_id")
//       .eq("id", orderId);

//     if (fetchError) {
//       console.error(`❌ Lỗi khi tìm đơn hàng ${orderId}:`, fetchError.message);
//       return false;
//     }

//     console.log(`🔍 Found orders:`, existingOrders);

//     if (!existingOrders || existingOrders.length === 0) {
//       console.error(`❌ Order ${orderId} not found in database`);
//       return false;
//     }

//     const { data: updatedOrder, error: updateError } = await supabaseAdmin
//       .from("orders")
//       .update({
//         status: newStatus, // Sử dụng status từ webhook
//         payment_status: newPaymentStatus, // Sử dụng payment_status từ webhook
//         payment_confirmed_at: new Date(transactionDate).toISOString(), // Dùng transactionDate từ webhook
//         transaction_id: sepayTransactionId, // Lưu ID giao dịch của SePay vào bảng orders
//         updated_at: new Date().toISOString(),
//       })
//       .eq("id", orderId)
//       .select();

//     if (updateError) {
//       console.error(
//         `❌ Failed to update order ${orderId}:`,
//         updateError.message
//       );
//       console.error(`Supabase update error details:`, updateError);
//       return false;
//     }

//     console.log(`📝 Database response (updated order):`, updatedOrder);
//     console.log(
//       `✅ Order ${orderId} updated to ${newStatus}/${newPaymentStatus} successfully`
//     );

//     // ✅ Tự động tạo downloads CHỈ KHI thanh toán thành công
//     if (newPaymentStatus === "completed") {
//       await createDownloadsForOrder(orderId);
//     } else {
//       console.log(
//         `⚠️ Downloads not created for order ${orderId} as payment status is not completed.`
//       );
//     }

//     return true;
//   } catch (error: any) {
//     console.error(`❌ Database update error for ${orderId}:`, error.message);
//     return false;
//   }
// };

// // Hàm createDownloadsForOrder không thay đổi về logic, nhưng đảm bảo sử dụng supabaseAdmin
// const createDownloadsForOrder = async (orderId: string) => {
//   try {
//     console.log(`🔄 Creating downloads for order: ${orderId}`);

//     const { data: orders, error: fetchOrderError } = await supabaseAdmin
//       .from("orders")
//       .select(
//         `
//         id,
//         user_id,
//         order_items (
//           product_id,
//           products (
//             title,
//             category,
//             download_url,
//             file_size
//           )
//         )
//       `
//       )
//       .eq("id", orderId);

//     if (fetchOrderError) {
//       console.error(
//         `❌ Lỗi khi tìm order và items cho downloads ${orderId}:`,
//         fetchOrderError.message
//       );
//       return;
//     }

//     if (!orders || orders.length === 0) {
//       console.log(`⚠️ Order not found for downloads: ${orderId}`);
//       return;
//     }

//     const order = orders[0];
//     console.log(`📦 Order details for downloads:`, {
//       orderId: order.id,
//       userId: order.user_id,
//       itemsCount: order.order_items?.length || 0,
//     });

//     if (!order.order_items || order.order_items.length === 0) {
//       console.log(`⚠️ No items found in order ${orderId} for downloads`);
//       return;
//     }

//     const downloadPromises = order.order_items.map(async (item: any) => {
//       const product = item.products;
//       if (!product) {
//         console.log(`⚠️ Product not found for item:`, item);
//         return null;
//       }

//       const downloadData = {
//         user_id: order.user_id,
//         product_id: item.product_id,
//         order_id: orderId,
//         name: product.title,
//         type: product.category,
//         download_url: product.download_url,
//         file_size: product.file_size || "Unknown",
//         download_date: new Date().toISOString(),
//       };

//       console.log(`📥 Creating download for:`, {
//         product: product.title,
//         user: order.user_id,
//       });

//       const { data: downloadResult, error: downloadError } = await supabaseAdmin
//         .from("downloads")
//         .insert(downloadData);

//       if (downloadError) {
//         console.error(
//           `❌ Failed to create download for product: ${product.title}`,
//           downloadError.message
//         );
//         return false;
//       } else {
//         console.log(`✅ Download created for product: ${product.title}`);
//         return true;
//       }
//     });

//     await Promise.all(downloadPromises);
//     console.log(`✅ All downloads created for order: ${orderId}`);
//   } catch (error: any) {
//     console.error(
//       `❌ Error creating downloads for order ${orderId}:`,
//       error.message
//     );
//   }
// };

// // Hàm logPaymentTransaction không thay đổi nhiều
// const logPaymentTransaction = async (transactionData: any) => {
//   try {
//     const { data, error } = await supabaseAdmin
//       .from("payment_transactions")
//       .insert(transactionData);

//     if (error) {
//       console.error(`❌ Failed to log payment transaction:`, error.message);
//       return false;
//     } else {
//       console.log(
//         `✅ Payment transaction logged successfully for order ${transactionData.order_id}`
//       );
//       return true;
//     }
//   } catch (error: any) {
//     console.error(`❌ Error logging payment transaction:`, error.message);
//     return false;
//   }
// };

// router.post("/webhook/sepay", async (req: Request, res: Response) => {
//   try {
//     console.log("🔔 SePay webhook received at:", new Date().toISOString());
//     console.log("📝 Request body:", JSON.stringify(req.body, null, 2));

//     res.status(200).json({
//       success: true,
//       message: "Payment processed successfully",
//       timestamp: new Date().toISOString(),
//     });

//     setImmediate(async () => {
//       try {
//         // const sepayApiKey = req.headers.authorization?.replace("Apikey ", "");
//         // if (sepayApiKey !== process.env.SEPAY_API_KEY) {
//         //   console.error("❌ Invalid SePay API key:", sepayApiKey);
//         //   return;
//         // }

//         const {
//           id, // SePay transaction ID
//           gateway,
//           transactionDate,
//           accountNumber,
//           content,
//           transferType,
//           transferAmount,
//           referenceCode,
//         } = req.body;

//         if (!content || !transferAmount || !id) {
//           console.error("❌ Missing required fields from SePay webhook");
//           return;
//         }

//         if (transferType !== "in") {
//           console.log("⚠️ Ignored outgoing transaction");
//           return;
//         }

//         const orderMatch = content.match(/DH([a-f0-9-]+)/i);
//         if (!orderMatch) {
//           console.log("❌ No valid order ID found in content:", content);
//           return;
//         }

//         const rawOrderId = orderMatch[1];
//         let orderId: string;
//         try {
//           console.log(
//             `🔍 Raw extracted: "${rawOrderId}" (${rawOrderId.length} chars)`
//           );
//           if (rawOrderId.includes("-") && rawOrderId.length === 36) {
//             orderId = rawOrderId;
//             console.log(`✅ Using existing UUID format: ${orderId}`);
//           } else {
//             const cleanId = rawOrderId.replace(/-/g, "");
//             const uuidString = cleanId.substring(0, 32);
//             orderId = `${uuidString.slice(0, 8)}-${uuidString.slice(
//               8,
//               12
//             )}-${uuidString.slice(12, 16)}-${uuidString.slice(
//               16,
//               20
//             )}-${uuidString.slice(20, 32)}`;
//             console.log(`✅ Formatted UUID: ${orderId}`);
//           }
//           console.log(`🎯 Processing payment for order: ${orderId}`);
//           console.log(`📝 Original content: ${content}`);
//           console.log(`✅ Final order ID: ${orderId}`);
//         } catch (cleanError: any) {
//           console.error("❌ Order ID processing failed:", cleanError.message);
//           return;
//         }

//         // ✅ Cập nhật transactionData để log đầy đủ hơn
//         const transactionData = {
//           order_id: orderId,
//           payment_method: gateway,
//           transaction_id: id,
//           amount: transferAmount,
//           currency: "VND", // Hoặc dựa vào cấu hình nếu có
//           status: "completed", // Trạng thái giao dịch từ SePay webhook
//           gateway_response: req.body,
//           processed_at: new Date().toISOString(),
//           gateway: gateway, // Lưu tên cổng thanh toán
//           // Bổ sung các trường khác nếu có thể từ webhook SePay mà bạn muốn lưu
//           // reference_code: referenceCode,
//           // account_number: accountNumber,
//         };

//         const transactionLogged = await logPaymentTransaction(transactionData);
//         if (!transactionLogged) {
//           console.error(
//             "⚠️ Failed to log transaction, but proceeding with order update."
//           );
//         }

//         // ✅ CẬP NHẬT: Gọi updateOrderToPaid với các trạng thái từ webhook
//         const updateSuccess = await updateOrderToPaid(
//           orderId,
//           "completed", // Giả định SePay webhook chỉ gửi khi thành công
//           "completed", // Giả định SePay webhook chỉ gửi khi thành công
//           id, // Transaction ID của SePay
//           transactionDate // Thời gian giao dịch của SePay
//         );

//         if (updateSuccess) {
//           console.log(`💰 Payment processed successfully:`, {
//             orderId,
//             amount: transactionData.amount, // Sử dụng số tiền từ transactionData
//             gateway: transactionData.gateway,
//             transactionId: transactionData.transaction_id,
//             sepayId: id,
//             date: transactionData.processed_at,
//             status: "COMPLETED",
//           });

//           console.log(
//             `✅ Order ${orderId} status changed to COMPLETED - Frontend will detect this!`
//           );
//         } else {
//           console.error(
//             `❌ Failed to update order ${orderId} to COMPLETED status`
//           );
//         }
//       } catch (asyncError: any) {
//         console.error("❌ Async processing error:", asyncError);
//       }
//     });
//   } catch (error: any) {
//     console.error("❌ SePay webhook error:", error);
//     res.status(200).json({
//       success: true,
//       message: "Webhook received",
//       note: "Error handled gracefully",
//     });
//   }
// });

// // ✅ Health check endpoint
// router.get("/webhook/sepay/health", async (req: Request, res: Response) => {
//   try {
//     res.json({
//       success: true,
//       message: "SePay webhook endpoint is healthy",
//       timestamp: new Date().toISOString(),
//       environment: {
//         sepay_configured: !!process.env.SEPAY_API_KEY,
//         supabase_configured: !!(
//           supabaseUrl &&
//           (process.env.SUPABASE_ANON_KEY || supabaseServiceKey)
//         ),
//         database_connection: "active",
//       },
//       version: "8.3-final-sdk-implementation", // Cập nhật version
//     });
//   } catch (error: any) {
//     res.status(500).json({
//       success: false,
//       message: "Health check failed",
//       error: error.message,
//       timestamp: new Date().toISOString(),
//     });
//   }
// });

// // ✅ Enhanced test endpoint
// router.post("/webhook/sepay/test", async (req: Request, res: Response) => {
//   try {
//     const { content, orderId } = req.body;

//     if (orderId) {
//       console.log(`🧪 Testing direct order update: ${orderId}`);
//       // ✅ CẬP NHẬT: Gọi updateOrderToPaid với các giá trị giả định cho test
//       const updateSuccess = await updateOrderToPaid(
//         orderId,
//         "completed",
//         "completed",
//         `TEST_SEPAY_ID_${Date.now()}`, // ID giao dịch giả
//         new Date().toISOString() // Thời gian giao dịch giả
//       );
//       return res.json({
//         success: updateSuccess,
//         message: updateSuccess
//           ? "Order updated to COMPLETED"
//           : "Failed to update order",
//         orderId,
//       });
//     }

//     if (!content) {
//       return res.status(400).json({ error: "Content or orderId required" });
//     }

//     const orderMatch = content.match(/DH([a-f0-9-]+)/i);
//     if (!orderMatch) {
//       return res.json({
//         success: false,
//         message: "No order ID found",
//         content,
//       });
//     }

//     const rawOrderId = orderMatch[1];
//     let extractedOrderId: string;
//     try {
//       console.log(
//         `🔍 Raw extracted: "${rawOrderId}" (${rawOrderId.length} chars)`
//       );
//       if (rawOrderId.includes("-") && rawOrderId.length === 36) {
//         extractedOrderId = rawOrderId;
//         console.log(`✅ Using existing UUID format: ${extractedOrderId}`);
//       } else {
//         const cleanId = rawOrderId.replace(/-/g, "");
//         const uuidString = cleanId.substring(0, 32);
//         extractedOrderId = `${uuidString.slice(0, 8)}-${uuidString.slice(
//           8,
//           12
//         )}-${uuidString.slice(12, 16)}-${uuidString.slice(
//           16,
//           20
//         )}-${uuidString.slice(20, 32)}`;
//         console.log(`✅ Formatted UUID: ${extractedOrderId}`);
//       }
//       console.log(`🎯 Processing payment for order: ${extractedOrderId}`);
//       console.log(`📝 Original content: ${content}`);
//       console.log(`✅ Final order ID: ${extractedOrderId}`);
//     } catch (cleanError: any) {
//       console.error("❌ Order ID processing failed:", cleanError.message);
//       return;
//     }

//     res.json({
//       success: true,
//       extraction: {
//         original_content: content,
//         raw_extracted: rawOrderId,
//         final_order_id: extractedOrderId,
//         uuid_length: extractedOrderId.length,
//       },
//     });
//   } catch (error: any) {
//     res.status(500).json({
//       success: false,
//       error: error.message,
//     });
//   }
// });

// export default router;

import express, { Request, Response } from "express";
import { createClient } from "@supabase/supabase-js";

const router = express.Router();

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    global: {
      headers: {
        application_name: "sepay_webhook",
      },
    },
  }
);

// ✅ Hàm tạo VietQR URL
const generateVietQRUrl = (amount: number, content: string) => {
  const bankCode = process.env.SEPAY_BANK_CODE || "970422"; // VCB
  const accountNumber = process.env.SEPAY_ACCOUNT_NUMBER;
  const accountName = process.env.SEPAY_ACCOUNT_NAME || "TEMPLATE MARKET";

  return `https://api.vietqr.io/image/${bankCode}-${accountNumber}-aPb5vJk.jpg?accountName=${encodeURIComponent(
    accountName
  )}&amount=${amount}&addInfo=${encodeURIComponent(content)}`;
};

// ✅ Hàm update order (giữ nguyên)
const updateOrderToPaid = async (
  orderId: string,
  newStatus: "completed" | "failed" | "pending" | "processing" | "refunded",
  newPaymentStatus:
    | "completed"
    | "failed"
    | "pending"
    | "processing"
    | "refunded",
  sepayTransactionId: string,
  transactionDate: string
) => {
  try {
    console.log(
      `🔄 Updating order: ${orderId} to ${newStatus}/${newPaymentStatus}`
    );

    const { data: existingOrders, error: fetchError } = await supabaseAdmin
      .from("orders")
      .select("id,status,payment_status,user_id")
      .eq("id", orderId);

    if (fetchError || !existingOrders || existingOrders.length === 0) {
      console.error(`❌ Order ${orderId} not found`);
      return false;
    }

    const { data: updatedOrder, error: updateError } = await supabaseAdmin
      .from("orders")
      .update({
        status: newStatus,
        payment_status: newPaymentStatus,
        payment_confirmed_at: new Date(transactionDate).toISOString(),
        transaction_id: sepayTransactionId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId)
      .select();

    if (updateError) {
      console.error(
        `❌ Failed to update order ${orderId}:`,
        updateError.message
      );
      return false;
    }

    console.log(`✅ Order ${orderId} updated successfully`);

    // Tự động tạo downloads khi thanh toán thành công
    if (newPaymentStatus === "completed") {
      await createDownloadsForOrder(orderId);
    }

    return true;
  } catch (error: any) {
    console.error(`❌ Database update error:`, error.message);
    return false;
  }
};

// ✅ Hàm tạo downloads (giữ nguyên)
const createDownloadsForOrder = async (orderId: string) => {
  try {
    console.log(`🔄 Creating downloads for order: ${orderId}`);

    const { data: orders, error: fetchOrderError } = await supabaseAdmin
      .from("orders")
      .select(
        `
        id, user_id,
        order_items (
          product_id,
          products (title, category, download_url, file_size)
        )
      `
      )
      .eq("id", orderId);

    if (fetchOrderError || !orders || orders.length === 0) {
      console.log(`⚠️ Order not found for downloads: ${orderId}`);
      return;
    }

    const order = orders[0];
    if (!order.order_items || order.order_items.length === 0) {
      console.log(`⚠️ No items found in order ${orderId}`);
      return;
    }

    const downloadPromises = order.order_items.map(async (item: any) => {
      const product = item.products;
      if (!product) return null;

      const downloadData = {
        user_id: order.user_id,
        product_id: item.product_id,
        order_id: orderId,
        name: product.title,
        type: product.category,
        download_url: product.download_url,
        file_size: product.file_size || "Unknown",
        download_date: new Date().toISOString(),
      };

      const { error: downloadError } = await supabaseAdmin
        .from("downloads")
        .insert(downloadData);

      if (downloadError) {
        console.error(`❌ Failed to create download:`, downloadError.message);
        return false;
      } else {
        console.log(`✅ Download created for: ${product.title}`);
        return true;
      }
    });

    await Promise.all(downloadPromises);
    console.log(`✅ All downloads created for order: ${orderId}`);
  } catch (error: any) {
    console.error(`❌ Error creating downloads:`, error.message);
  }
};

// ✅ Hàm log transaction (giữ nguyên)
const logPaymentTransaction = async (transactionData: any) => {
  try {
    const { error } = await supabaseAdmin
      .from("payment_transactions")
      .insert(transactionData);

    if (error) {
      console.error(`❌ Failed to log transaction:`, error.message);
      return false;
    } else {
      console.log(`✅ Transaction logged successfully`);
      return true;
    }
  } catch (error: any) {
    console.error(`❌ Error logging transaction:`, error.message);
    return false;
  }
};

// ✅ 1. SePay Webhook (giữ nguyên)
router.post("/webhook/sepay", async (req: Request, res: Response) => {
  try {
    console.log("🔔 SePay webhook received:", new Date().toISOString());

    res.status(200).json({
      success: true,
      message: "Payment processed successfully",
      timestamp: new Date().toISOString(),
    });

    setImmediate(async () => {
      try {
        const {
          id,
          gateway,
          transactionDate,
          content,
          transferType,
          transferAmount,
        } = req.body;

        if (!content || !transferAmount || !id || transferType !== "in") {
          console.log("⚠️ Invalid webhook data or outgoing transaction");
          return;
        }

        const orderMatch = content.match(/DH([a-f0-9-]+)/i);
        if (!orderMatch) {
          console.log("❌ No order ID found in content:", content);
          return;
        }

        const rawOrderId = orderMatch[1];
        let orderId: string;

        if (rawOrderId.includes("-") && rawOrderId.length === 36) {
          orderId = rawOrderId;
        } else {
          const cleanId = rawOrderId.replace(/-/g, "");
          const uuidString = cleanId.substring(0, 32);
          orderId = `${uuidString.slice(0, 8)}-${uuidString.slice(
            8,
            12
          )}-${uuidString.slice(12, 16)}-${uuidString.slice(
            16,
            20
          )}-${uuidString.slice(20, 32)}`;
        }

        console.log(`🎯 Processing payment for order: ${orderId}`);

        // Log transaction
        const transactionData = {
          order_id: orderId,
          payment_method: gateway,
          transaction_id: id,
          amount: transferAmount,
          currency: "VND",
          status: "completed",
          gateway_response: req.body,
          processed_at: new Date().toISOString(),
        };

        await logPaymentTransaction(transactionData);

        // Update order
        const updateSuccess = await updateOrderToPaid(
          orderId,
          "completed",
          "completed",
          id,
          transactionDate
        );

        if (updateSuccess) {
          console.log(
            `💰 Payment processed successfully for order: ${orderId}`
          );
        } else {
          console.error(`❌ Failed to update order: ${orderId}`);
        }
      } catch (asyncError: any) {
        console.error("❌ Async processing error:", asyncError);
      }
    });
  } catch (error: any) {
    console.error("❌ SePay webhook error:", error);
    res.status(200).json({
      success: true,
      message: "Webhook received",
      note: "Error handled gracefully",
    });
  }
});

// ✅ 2. Tạo Payment Link
router.post("/payment/create-link", async (req: Request, res: Response) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res
        .status(400)
        .json({ success: false, message: "Order ID required" });
    }

    // Lấy thông tin order
    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (error || !order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Tạo payment link và QR
    const paymentLink = `${process.env.FRONTEND_URL}/pay/${orderId}`;
    const paymentContent = `DH${orderId}`;
    const qrUrl = generateVietQRUrl(order.total_price, paymentContent);

    res.json({
      success: true,
      data: {
        orderId,
        paymentLink,
        qrUrl,
        amount: order.total_price,
        content: paymentContent,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to create payment link",
      error: error.message,
    });
  }
});

// ✅ 3. Lấy thông tin order cho payment page (public)
router.get("/payment/order/:orderId", async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select(
        `
        id, total_price, status, payment_status, full_name, email, created_at,
        order_items (
          quantity, price,
          products (title, image, category)
        )
      `
      )
      .eq("id", orderId)
      .single();

    if (error || !order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    const paymentContent = `DH${orderId}`;
    const qrUrl = generateVietQRUrl(order.total_price, paymentContent);

    res.json({
      success: true,
      data: {
        order: {
          id: order.id,
          total_price: order.total_price,
          status: order.status,
          payment_status: order.payment_status,
          customer_name: order.full_name,
          customer_email: order.email,
          created_at: order.created_at,
          items: order.order_items,
        },
        payment: {
          content: paymentContent,
          qrUrl,
          bankInfo: {
            bankName: process.env.SEPAY_BANK_NAME || "Vietcombank",
            accountNumber: process.env.SEPAY_ACCOUNT_NUMBER,
            accountName: process.env.SEPAY_ACCOUNT_NAME || "TEMPLATE MARKET",
          },
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message,
    });
  }
});

// ✅ 4. Check payment status (polling)
router.get("/payment/status/:orderId", async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select("id, status, payment_status, payment_confirmed_at")
      .eq("id", orderId)
      .single();

    if (error || !order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.json({
      success: true,
      data: {
        orderId: order.id,
        status: order.status,
        paymentStatus: order.payment_status,
        isPaid: order.payment_status === "completed",
        paidAt: order.payment_confirmed_at,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to check payment status",
      error: error.message,
    });
  }
});

export default router;
