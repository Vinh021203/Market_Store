import express, { Request, Response } from "express";

const router = express.Router();

router.post("/webhook/sepay", async (req: Request, res: Response) => {
  try {
    console.log("SePay webhook received:", req.body);

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

    if (transferType !== "in") {
      return res.status(200).json({ message: "Ignored outgoing transaction" });
    }

    const orderMatch = content.match(/DH([a-f0-9-]+)/i);
    if (!orderMatch) {
      console.log("No order ID found in content:", content);
      return res.status(200).json({ message: "No order ID found" });
    }

    const orderId = orderMatch[1];
    const frontendApiUrl =
      process.env.FRONTEND_API_URL || "http://localhost:3000";

    try {
      const response = await fetch(
        `${frontendApiUrl}/api/orders/update-payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.INTERNAL_API_KEY}`,
          },
          body: JSON.stringify({
            orderId,
            amount: transferAmount,
            transactionId: referenceCode,
            sepayTransactionId: id,
            transactionDate,
            gateway,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        console.log(`✅ Order ${orderId} updated successfully`);
        res.status(200).json({
          success: true,
          message: "Payment processed successfully",
          orderId,
          amount: transferAmount,
        });
      } else {
        throw new Error(result.message || "Frontend API error");
      }
    } catch (apiError) {
      console.error("Frontend API call failed:", apiError);
      res.status(500).json({
        success: false,
        message: "Failed to update order in frontend",
      });
    }
  } catch (error) {
    console.error("SePay webhook error:", error);
    res.status(500).json({ message: "Webhook processing failed" });
  }
});

router.get("/webhook/sepay/health", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "SePay webhook endpoint is healthy",
    timestamp: new Date().toISOString(),
  });
});

export default router;
