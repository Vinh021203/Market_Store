import express, { Request, Response } from "express";

const router = express.Router();

// ✅ REST API helpers
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

    // ✅ Extract order ID với flexible regex - FIXED
    const orderMatch = content.match(/DH([a-f0-9-]{32,36})/i);
    if (!orderMatch) {
      console.log("No valid order ID found in content:", content);
      return res.status(200).json({ message: "No valid order ID found" });
    }

    const rawOrderId = orderMatch[1];

    // ✅ Clean và format lại UUID - ENHANCED
    let orderId: string;
    try {
      console.log(
        `🔍 Raw extracted: "${rawOrderId}" (${rawOrderId.length} chars)`
      );

      // Remove all dashes first
      const cleanId = rawOrderId.replace(/-/g, "");
      console.log(
        `🧹 After removing dashes: "${cleanId}" (${cleanId.length} chars)`
      );

      // Take first 32 characters for UUID
      const uuidString = cleanId.substring(0, 32);
      console.log(`✂️ Trimmed to 32 chars: "${uuidString}"`);

      // Validate length and hex characters
      if (uuidString.length !== 32) {
        throw new Error(
          `Invalid UUID length after processing: ${uuidString.length}, expected 32`
        );
      }

      if (!/^[a-f0-9]{32}$/i.test(uuidString)) {
        throw new Error(`Invalid hex characters in UUID: ${uuidString}`);
      }

      // Re-format as UUID: 8-4-4-4-12
      orderId = `${uuidString.slice(0, 8)}-${uuidString.slice(
        8,
        12
      )}-${uuidString.slice(12, 16)}-${uuidString.slice(
        16,
        20
      )}-${uuidString.slice(20, 32)}`;

      console.log(`🎯 Processing payment for order: ${orderId}`);
      console.log(`📝 Original content: ${content}`);
      console.log(`✅ Final formatted UUID: ${orderId}`);
    } catch (cleanError: any) {
      console.error("Order ID validation failed:", cleanError.message);
      return res.status(400).json({
        error: "Invalid order ID format",
        details: cleanError.message,
        debug: {
          original_content: content,
          extracted_raw: rawOrderId,
          raw_length: rawOrderId.length,
        },
      });
    }

    // ✅ Process order using REST API
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
      if (existingOrder.payment_status === "completed") {
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

// ✅ Health check endpoint
router.get("/webhook/sepay/health", async (req: Request, res: Response) => {
  try {
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
      version: "3.2-fixed-uuid-length",
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

    res.json({
      success: response.ok,
      message: response.ok
        ? "Database connection OK"
        : "Database connection failed",
      error: response.ok ? null : `HTTP ${response.status}`,
      sample_data: data,
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

export default router;
