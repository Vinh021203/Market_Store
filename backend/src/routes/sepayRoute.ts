import express, { Request, Response } from "express";

const router = express.Router();

// ✅ Initialize Supabase client
let supabase: any;

const initSupabase = async () => {
  if (!supabase) {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!
      );
      console.log("✅ Supabase client initialized for webhook");
    } catch (error) {
      console.error("❌ Failed to initialize Supabase:", error);
      throw error;
    }
  }
  return supabase;
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

    // ✅ Only process incoming transactions
    if (transferType !== "in") {
      return res.status(200).json({ message: "Ignored outgoing transaction" });
    }

    // ✅ Extract order ID from content
    const orderMatch = content.match(/DH([a-f0-9-]+)/i);
    if (!orderMatch) {
      console.log("No order ID found in content:", content);
      return res.status(200).json({ message: "No order ID found" });
    }

    const orderId = orderMatch[1];
    console.log(`🎯 Processing payment for order: ${orderId}`);

    // ✅ Update order directly in Supabase
    try {
      const client = await initSupabase();

      // Update order status
      const { data: orderData, error: orderError } = await client
        .from("orders")
        .update({
          status: "completed",
          payment_status: "paid",
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId)
        .select()
        .single();

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

      // ✅ Optionally create payment record
      const { error: paymentError } = await client.from("payments").insert({
        order_id: orderId,
        amount: transferAmount,
        gateway: gateway,
        transaction_id: referenceCode,
        sepay_transaction_id: id,
        transaction_date: transactionDate,
        status: "completed",
        created_at: new Date().toISOString(),
      });

      if (paymentError) {
        console.warn("Payment record creation failed:", paymentError);
        // Don't fail the webhook for this
      }

      console.log(`✅ Order ${orderId} updated successfully`);

      res.status(200).json({
        success: true,
        message: "Payment processed successfully",
        orderId,
        amount: transferAmount,
        transactionId: referenceCode,
        gateway,
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
router.get("/webhook/sepay/health", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "SePay webhook endpoint is healthy",
    timestamp: new Date().toISOString(),
    environment: {
      sepay_configured: !!process.env.SEPAY_API_KEY,
      supabase_configured: !!(
        process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY
      ),
    },
  });
});

// ✅ Test endpoint for debugging
router.post("/webhook/sepay/test", async (req: Request, res: Response) => {
  try {
    const client = await initSupabase();

    // Test database connection
    const { data, error } = await client
      .from("orders")
      .select("id, status")
      .limit(1);

    res.json({
      success: !error,
      message: error ? "Database connection failed" : "Database connection OK",
      error: error?.message,
      sample_data: data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Test failed",
      error: error.message,
    });
  }
});

export default router;
