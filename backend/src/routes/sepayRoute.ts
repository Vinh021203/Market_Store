import express, { Request, Response } from "express";

const router = express.Router();

// ✅ REST API helper để thay thế Supabase client (tránh ByteString error)
const updateOrderViaRest = async (orderId: string) => {
  try {
    const response = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/orders?id=eq.${orderId}`,
      {
        method: "PATCH",
        headers: {
          apikey: process.env.SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          status: "completed",
          payment_status: "completed",
          updated_at: new Date().toISOString(),
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
};

const getOrderViaRest = async (orderId: string) => {
  try {
    const response = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/orders?id=eq.${orderId}&select=id,status,payment_status`,
      {
        headers: {
          apikey: process.env.SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();

    if (data.length === 0) {
      return { data: null, error: { message: "Order not found" } };
    }

    return { data: data[0], error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
};

const createPaymentRecordViaRest = async (paymentData: any) => {
  try {
    const response = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/payments`,
      {
        method: "POST",
        headers: {
          apikey: process.env.SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify(paymentData),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
};

// ✅ Helper function để clean và validate order ID
const cleanOrderId = (rawOrderId: string): string => {
  const cleaned = rawOrderId.replace(/[^\w-]/g, "");
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  if (!uuidRegex.test(cleaned)) {
    throw new Error(`Invalid UUID format: ${rawOrderId} -> ${cleaned}`);
  }

  return cleaned;
};

// ✅ Retry helper
const retryOperation = async (
  operation: () => Promise<any>,
  maxRetries = 3
) => {
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      console.warn(
        `Operation failed (attempt ${i + 1}/${maxRetries}):`,
        error.message
      );

      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }

  throw lastError;
};

router.post("/webhook/sepay", async (req: Request, res: Response) => {
  try {
    console.log("SePay webhook received:", req.body);

    // ✅ Verify API key
    const apiKey = req.headers.authorization?.replace("Apikey ", "");
    if (apiKey !== process.env.SEPAY_API_KEY) {
      console.error("Invalid API key:", apiKey);
      return res.status(401).json({ error: "Unauthorized" });
    }

    const {
      id,
      gateway,
      transactionDate,
      accountNumber,
      content,
      transferType,
      transferAmount,
      referenceCode,
    } = req.body;

    // ✅ Validate required fields
    if (!content || !transferAmount || !id) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["content", "transferAmount", "id"],
      });
    }

    // ✅ Only process incoming transactions
    if (transferType !== "in") {
      return res.status(200).json({ message: "Ignored outgoing transaction" });
    }

    // ✅ Extract order ID from content
    const orderMatch = content.match(
      /DH([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i
    );
    if (!orderMatch) {
      console.log("No valid order ID found in content:", content);
      return res.status(200).json({ message: "No valid order ID found" });
    }

    const rawOrderId = orderMatch[1];

    // ✅ Clean và validate order ID
    let orderId: string;
    try {
      orderId = cleanOrderId(rawOrderId);
      console.log(`🎯 Processing payment for order: ${orderId}`);
    } catch (cleanError: any) {
      console.error("Order ID validation failed:", cleanError.message);
      return res.status(400).json({
        error: "Invalid order ID format",
        details: cleanError.message,
      });
    }

    // ✅ Process order using REST API (tránh ByteString error)
    try {
      // Check if order exists
      const { data: existingOrder, error: checkError } = await retryOperation(
        () => getOrderViaRest(orderId)
      );

      if (checkError) {
        console.error("Order lookup error:", checkError);
        return res.status(404).json({
          success: false,
          message: "Order not found",
          orderId,
          error: checkError.message,
        });
      }

      // Check if already paid
      if (existingOrder.payment_status === "paid") {
        console.log(`⚠️ Order ${orderId} already paid, skipping update`);
        return res.status(200).json({
          success: true,
          message: "Order already paid",
          orderId,
          amount: transferAmount,
        });
      }

      // Update order status
      const { data: orderData, error: orderError } = await retryOperation(() =>
        updateOrderViaRest(orderId)
      );

      if (orderError) {
        console.error("Order update error:", orderError);
        throw new Error(`Failed to update order: ${orderError.message}`);
      }

      // ✅ Log transaction details
      console.log(`💰 Payment processed:`, {
        orderId,
        amount: transferAmount,
        gateway,
        transactionId: referenceCode,
        sepayId: id,
        date: transactionDate,
      });

      // ✅ Create payment record
      try {
        const paymentData = {
          order_id: orderId,
          amount: transferAmount,
          gateway: gateway || "MBBank",
          transaction_id: referenceCode,
          sepay_transaction_id: id,
          transaction_date: transactionDate,
          status: "completed",
          created_at: new Date().toISOString(),
        };

        const { error: paymentError } = await retryOperation(() =>
          createPaymentRecordViaRest(paymentData)
        );

        if (paymentError) {
          console.warn("Payment record creation failed:", paymentError);
        } else {
          console.log("✅ Payment record created successfully");
        }
      } catch (paymentInsertError) {
        console.warn("Payment record insert error:", paymentInsertError);
      }

      console.log(`✅ Order ${orderId} updated successfully`);

      res.status(200).json({
        success: true,
        message: "Payment processed successfully",
        orderId,
        amount: transferAmount,
        transactionId: referenceCode,
        gateway: gateway || "MBBank",
        timestamp: new Date().toISOString(),
      });
    } catch (dbError: any) {
      console.error("Database operation failed:", dbError);
      res.status(500).json({
        success: false,
        message: "Failed to update order in database",
        error: dbError.message,
        orderId,
      });
    }
  } catch (error: any) {
    console.error("SePay webhook error:", error);
    res.status(500).json({
      success: false,
      message: "Webhook processing failed",
      error: error.message,
    });
  }
});

// ✅ Health check endpoint (không dùng Supabase client)
router.get("/webhook/sepay/health", async (req: Request, res: Response) => {
  try {
    // Test database connection via REST API
    const response = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/orders?limit=1`,
      {
        headers: {
          apikey: process.env.SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        },
      }
    );

    const dbConnectionOk = response.ok;

    res.json({
      success: true,
      message: "SePay webhook endpoint is healthy",
      timestamp: new Date().toISOString(),
      environment: {
        sepay_configured: !!process.env.SEPAY_API_KEY,
        supabase_configured: !!(
          process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY
        ),
        database_connection: dbConnectionOk,
      },
      version: "3.0-rest-api",
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

// ✅ Test endpoint
router.post("/webhook/sepay/test", async (req: Request, res: Response) => {
  try {
    // Test database connection
    const response = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/orders?limit=3&order=created_at.desc&select=id,status,payment_status,created_at`,
      {
        headers: {
          apikey: process.env.SUPABASE_ANON_KEY!,
          Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        },
      }
    );

    const data = response.ok ? await response.json() : null;
    const testOrderId = "123e4567-e89b-12d3-a456-426614174000";

    res.json({
      success: response.ok,
      message: response.ok
        ? "Database connection OK"
        : "Database connection failed",
      error: response.ok ? null : `HTTP ${response.status}`,
      sample_data: data,
      order_id_test: {
        input: testOrderId,
        output: cleanOrderId(testOrderId),
        valid: true,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Test failed",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// ✅ Debug endpoint
router.post("/webhook/sepay/debug", (req: Request, res: Response) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }

    const orderMatch = content.match(
      /DH([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i
    );

    const result = {
      content,
      regex_match: !!orderMatch,
      extracted_id: orderMatch ? orderMatch[1] : null,
      cleaned_id: null as string | null,
      valid: false,
      char_codes: content.split("").map((c: string, i: number) => ({
        char: c,
        code: c.charCodeAt(0),
        index: i,
        problematic: c.charCodeAt(0) > 255,
      })),
    };

    if (orderMatch) {
      try {
        result.cleaned_id = cleanOrderId(orderMatch[1]);
        result.valid = true;
      } catch (error: any) {
        result.cleaned_id = null;
        result.valid = false;
      }
    }

    res.json({
      success: true,
      debug_info: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
