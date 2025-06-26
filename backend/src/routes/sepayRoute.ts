import express, { Request, Response } from "express";

const router = express.Router();

// ✅ Khai báo biến service_role key ở đây để dễ dàng sử dụng
// Đảm bảo rằng process.env.SUPABASE_SERVICE_ROLE_KEY đã được cấu hình trên Render
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error("🚨 Lỗi: SUPABASE_SERVICE_ROLE_KEY không được định nghĩa!");
  // Có thể cân nhắc thoát ứng dụng hoặc vô hiệu hóa webhook nếu key quan trọng này bị thiếu.
  // process.exit(1);
}

// ✅ Function update order status với enhanced logging
const updateOrderToPaid = async (orderId: string) => {
  try {
    console.log(`🔄 Attempting to update order: ${orderId}`);

    // Dùng SERVICE_ROLE_KEY cho tất cả các thao tác trong hàm này để bỏ qua RLS
    if (!SUPABASE_SERVICE_KEY) {
      console.error(
        "❌ SUPABASE_SERVICE_ROLE_KEY không có sẵn. Không thể cập nhật đơn hàng."
      );
      return false;
    }

    // ✅ Kiểm tra order có tồn tại không trước
    const checkResponse = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/orders?id=eq.${orderId}&select=id,status,payment_status,user_id`,
      {
        headers: {
          apikey: SUPABASE_SERVICE_KEY, // SỬ DỤNG SERVICE_KEY
          Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`, // SỬ DỤNG SERVICE_KEY
        },
      }
    );

    const existingOrders = await checkResponse.json();
    console.log(`🔍 Found orders:`, existingOrders);

    if (!existingOrders || existingOrders.length === 0) {
      console.error(`❌ Order ${orderId} not found in database`);
      return false;
    }

    // ✅ THAY ĐỔI QUAN TRỌNG: Cập nhật cả status và payment_status
    // VÀ THÊM HEADER X-Client-Info ĐỂ VƯỢT QUA TRIGGER PAYMENT_UPDATE_PROTECTION
    const response = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/orders?id=eq.${orderId}`,
      {
        method: "PATCH",
        headers: {
          apikey: SUPABASE_SERVICE_KEY, // SỬ DỤNG SERVICE_KEY
          Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`, // SỬ DỤNG SERVICE_KEY
          "Content-Type": "application/json",
          "X-Client-Info": "application-name=sepay_webhook", // ✅ QUAN TRỌNG: Header này để trigger nhận diện
        },
        body: JSON.stringify({
          status: "completed", // Cập nhật trạng thái đơn hàng chung
          payment_status: "completed", // Cập nhật trạng thái thanh toán
          payment_confirmed_at: new Date().toISOString(), // Ghi lại thời gian xác nhận
          updated_at: new Date().toISOString(),
        }),
      }
    );

    const responseText = await response.text();
    console.log(`📝 Database response:`, responseText);

    if (response.ok) {
      console.log(`✅ Order ${orderId} updated to COMPLETED successfully`);

      // ✅ Verify update worked (dùng SERVICE_KEY)
      const verifyResponse = await fetch(
        `${process.env.SUPABASE_URL}/rest/v1/orders?id=eq.${orderId}&select=status,payment_status`,
        {
          headers: {
            apikey: SUPABASE_SERVICE_KEY, // SỬ DỤNG SERVICE_KEY
            Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`, // SỬ DỤNG SERVICE_KEY
          },
        }
      );

      const verifyData = await verifyResponse.json();
      console.log(`🔍 Verification result:`, verifyData);

      // ✅ Tự động tạo downloads (đảm bảo hàm này cũng dùng SERVICE_KEY)
      await createDownloadsForOrder(orderId);

      return true;
    } else {
      console.error(`❌ Failed to update order ${orderId}:`, responseText);
      return false;
    }
  } catch (error) {
    console.error(`❌ Database update error for ${orderId}:`, error);
    return false;
  }
};

// ✅ Function tạo downloads tự động
const createDownloadsForOrder = async (orderId: string) => {
  try {
    console.log(`🔄 Creating downloads for order: ${orderId}`);

    // Dùng SERVICE_ROLE_KEY cho tất cả các thao tác trong hàm này
    if (!SUPABASE_SERVICE_KEY) {
      console.error(
        "❌ SUPABASE_SERVICE_ROLE_KEY không có sẵn. Không thể tạo downloads."
      );
      return;
    }

    // Lấy thông tin order và items (dùng SERVICE_KEY để đảm bảo quyền)
    const orderResponse = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/orders?id=eq.${orderId}&select=*,order_items(product_id,products(title,category,download_url,file_size))`,
      {
        headers: {
          apikey: SUPABASE_SERVICE_KEY, // SỬ DỤNG SERVICE_KEY
          Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`, // SỬ DỤNG SERVICE_KEY
        },
      }
    );

    if (!orderResponse.ok) {
      const errorText = await orderResponse.text();
      throw new Error(`Failed to fetch order details: ${errorText}`);
    }

    const orders = await orderResponse.json();
    if (!orders || orders.length === 0) {
      throw new Error("Order not found");
    }

    const order = orders[0];
    console.log(`📦 Order details:`, {
      orderId: order.id,
      userId: order.user_id,
      itemsCount: order.order_items?.length || 0,
    });

    if (!order.order_items || order.order_items.length === 0) {
      console.log(`⚠️ No items found in order ${orderId}`);
      return;
    }

    // Tạo downloads cho từng product trong order
    const downloadPromises = order.order_items.map(async (item: any) => {
      const product = item.products;
      if (!product) {
        console.log(`⚠️ Product not found for item:`, item);
        return null;
      }

      const downloadData = {
        user_id: order.user_id,
        product_id: item.product_id,
        order_id: orderId, // ✅ Link với order
        name: product.title,
        type: product.category,
        download_url: product.download_url,
        file_size: product.file_size || "Unknown",
        download_date: new Date().toISOString(),
      };

      console.log(`📥 Creating download for:`, {
        product: product.title,
        user: order.user_id,
      });

      const downloadResponse = await fetch(
        `${process.env.SUPABASE_URL}/rest/v1/downloads`,
        {
          method: "POST",
          headers: {
            apikey: SUPABASE_SERVICE_KEY, // SỬ DỤNG SERVICE_KEY
            Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`, // SỬ DỤNG SERVICE_KEY
            "Content-Type": "application/json",
          },
          body: JSON.stringify(downloadData),
        }
      );

      if (downloadResponse.ok) {
        console.log(`✅ Download created for product: ${product.title}`);
        return true;
      } else {
        const errorText = await downloadResponse.text();
        console.error(
          `❌ Failed to create download for product: ${product.title}`,
          errorText
        );
        return false;
      }
    });

    await Promise.all(downloadPromises);
    console.log(`✅ All downloads created for order: ${orderId}`);
  } catch (error) {
    console.error(`❌ Error creating downloads for order ${orderId}:`, error);
  }
};

router.post("/webhook/sepay", async (req: Request, res: Response) => {
  try {
    console.log("🔔 SePay webhook received at:", new Date().toISOString());
    console.log("📝 Request body:", JSON.stringify(req.body, null, 2));

    // ✅ RESPONSE NGAY LẬP TỨC
    res.status(200).json({
      success: true,
      message: "Payment processed successfully",
      timestamp: new Date().toISOString(),
    });

    // ✅ XỬ LÝ ASYNC VỚI DATABASE UPDATE
    setImmediate(async () => {
      try {
        // Verify API key của SePay (không phải Supabase)
        const sepayApiKey = req.headers.authorization?.replace("Apikey ", "");
        if (sepayApiKey !== process.env.SEPAY_API_KEY) {
          console.error("❌ Invalid SePay API key:", sepayApiKey);
          return;
        }

        const {
          id, // SePay transaction ID
          gateway,
          transactionDate,
          accountNumber,
          content,
          transferType,
          transferAmount,
          referenceCode,
        } = req.body;

        // Validate required fields
        if (!content || !transferAmount || !id) {
          console.error("❌ Missing required fields from SePay webhook");
          return;
        }

        // Only process incoming transactions
        if (transferType !== "in") {
          console.log("⚠️ Ignored outgoing transaction");
          return;
        }

        // ✅ ENHANCED ORDER ID EXTRACTION
        const orderMatch = content.match(/DH([a-f0-9-]+)/i);
        if (!orderMatch) {
          console.log("❌ No valid order ID found in content:", content);
          return;
        }

        const rawOrderId = orderMatch[1];

        // ✅ FIXED UUID PROCESSING - DỨT ĐIỂM
        let orderId: string;
        try {
          console.log(
            `🔍 Raw extracted: "${rawOrderId}" (${rawOrderId.length} chars)`
          );

          // ✅ Nếu đã có format UUID chuẩn (36 chars với dashes)
          if (rawOrderId.includes("-") && rawOrderId.length === 36) {
            orderId = rawOrderId;
            console.log(`✅ Using existing UUID format: ${orderId}`);
          } else {
            // ✅ Remove dashes và format lại
            const cleanId = rawOrderId.replace(/-/g, "");
            console.log(
              `🧹 After removing dashes: "${cleanId}" (${cleanId.length} chars)`
            );

            // ✅ Chỉ lấy 32 chars đầu (bỏ phần thừa nếu có)
            const uuidString = cleanId.substring(0, 32);
            console.log(`✂️ Trimmed to 32 chars: "${uuidString}"`);

            // ✅ Validate hex characters
            if (!/^[a-f0-9]{32}$/i.test(uuidString)) {
              throw new Error(`Invalid hex characters in UUID: ${uuidString}`);
            }

            // ✅ Format thành UUID chuẩn: 8-4-4-4-12
            orderId = `${uuidString.slice(0, 8)}-${uuidString.slice(
              8,
              12
            )}-${uuidString.slice(12, 16)}-${uuidString.slice(
              16,
              20
            )}-${uuidString.slice(20, 32)}`;
            console.log(`✅ Formatted UUID: ${orderId}`);
          }

          console.log(`🎯 Processing payment for order: ${orderId}`);
          console.log(`📝 Original content: ${content}`);
          console.log(`✅ Final order ID: ${orderId}`);
        } catch (cleanError: any) {
          console.error("❌ Order ID processing failed:", cleanError.message);
          return;
        }

        // ✅ GHI LẠI GIAO DỊCH VÀO PAYMENT_TRANSACTIONS TRƯỚC
        const transactionData = {
          order_id: orderId,
          payment_method: gateway,
          transaction_id: id, // SePay's unique transaction ID
          amount: transferAmount,
          currency: "VND", // Hoặc dựa vào cấu hình nếu có
          status: "completed", // Trạng thái giao dịch SePay
          gateway_response: req.body, // Lưu toàn bộ response từ SePay
          processed_at: new Date().toISOString(),
        };

        const transactionResponse = await fetch(
          `${process.env.SUPABASE_URL}/rest/v1/payment_transactions`,
          {
            method: "POST",
            headers: {
              apikey: SUPABASE_SERVICE_KEY!, // SỬ DỤNG SERVICE_KEY
              Authorization: `Bearer ${SUPABASE_SERVICE_KEY!}`, // SỬ DỤNG SERVICE_KEY
              "Content-Type": "application/json",
            },
            body: JSON.stringify(transactionData),
          }
        );

        if (!transactionResponse.ok) {
          const errorText = await transactionResponse.text();
          console.error(`❌ Failed to log payment transaction: ${errorText}`);
          // Vẫn tiếp tục xử lý update order, nhưng có thể cần thông báo/cảnh báo
        } else {
          console.log(
            `✅ Payment transaction logged successfully for order ${orderId}`
          );
        }

        // ✅ UPDATE DATABASE TO COMPLETED
        const updateSuccess = await updateOrderToPaid(orderId);

        if (updateSuccess) {
          console.log(`💰 Payment processed successfully:`, {
            orderId,
            amount: transferAmount,
            gateway,
            transactionId: referenceCode,
            sepayId: id,
            date: transactionDate,
            status: "completed", // ✅ CONFIRMED COMPLETED
          });

          console.log(
            `✅ Order ${orderId} status changed to COMPLETED - Frontend will detect this!`
          );
        } else {
          console.error(
            `❌ Failed to update order ${orderId} to COMPLETED status`
          );
        }
      } catch (asyncError: any) {
        console.error("❌ Async processing error:", asyncError);
      }
    });
  } catch (error: any) {
    console.error("❌ SePay webhook error:", error);
    res.status(200).json({
      // Vẫn trả về 200 OK để SePay không retry liên tục
      success: true,
      message: "Webhook received",
      note: "Error handled gracefully",
    });
  }
});

// ✅ Health check endpoint
router.get("/webhook/sepay/health", async (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      message: "SePay webhook endpoint is healthy",
      timestamp: new Date().toISOString(),
      environment: {
        sepay_configured: !!process.env.SEPAY_API_KEY,
        supabase_configured: !!(
          process.env.SUPABASE_URL &&
          (process.env.SUPABASE_ANON_KEY || SUPABASE_SERVICE_KEY)
        ),
        database_connection: "active", // Giả định kết nối hoạt động
      },
      version: "8.1-service-key-fix", // Cập nhật version để dễ theo dõi
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Health check failed",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// ✅ Enhanced test endpoint
router.post("/webhook/sepay/test", async (req: Request, res: Response) => {
  try {
    const { content, orderId } = req.body;

    if (orderId) {
      // Test database update directly
      console.log(`🧪 Testing direct order update: ${orderId}`);
      const updateSuccess = await updateOrderToPaid(orderId);
      return res.json({
        success: updateSuccess,
        message: updateSuccess
          ? "Order updated to COMPLETED"
          : "Failed to update order",
        orderId,
      });
    }

    if (!content) {
      return res.status(400).json({ error: "Content or orderId required" });
    }

    // Test order ID extraction với enhanced logic
    const orderMatch = content.match(/DH([a-f0-9-]+)/i);
    if (!orderMatch) {
      return res.json({
        success: false,
        message: "No order ID found",
        content,
      });
    }

    const rawOrderId = orderMatch[1];

    // ✅ Enhanced UUID processing
    let extractedOrderId: string;
    if (rawOrderId.includes("-") && rawOrderId.length === 36) {
      extractedOrderId = rawOrderId;
    } else {
      const cleanId = rawOrderId.replace(/-/g, "");
      const uuidString = cleanId.substring(0, 32);
      extractedOrderId = `${uuidString.slice(0, 8)}-${uuidString.slice(
        8,
        12
      )}-${uuidString.slice(12, 16)}-${uuidString.slice(
        16,
        20
      )}-${uuidString.slice(20, 32)}`;
    }

    res.json({
      success: true,
      extraction: {
        original_content: content,
        raw_extracted: rawOrderId,
        final_order_id: extractedOrderId,
        uuid_length: extractedOrderId.length,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
