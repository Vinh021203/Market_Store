import express from "express";
const router = express.Router();

// SePay Webhook endpoint
router.post("/webhook/sepay", async (req, res) => {
  try {
    console.log("SePay webhook received:", req.body);

    // Validate API key từ SePay
    const apiKey = req.headers.authorization?.replace("Apikey ", "");
    if (apiKey !== process.env.SEPAY_API_KEY) {
      console.error("Invalid API key:", apiKey);
      return res.status(401).json({ error: "Unauthorized" });
    }

    const {
      id, // ID giao dịch SePay
      gateway, // "MBBank"
      transactionDate, // Thời gian giao dịch
      accountNumber, // "0971386588"
      content, // Nội dung chuyển khoản
      transferType, // "in" (tiền vào)
      transferAmount, // Số tiền
      referenceCode, // Mã tham chiếu
    } = req.body;

    // Chỉ xử lý giao dịch tiền vào
    if (transferType !== "in") {
      return res.status(200).json({ message: "Ignored outgoing transaction" });
    }

    // Extract order ID từ content (DH + order.id)
    const orderMatch = content.match(/DH([a-f0-9-]+)/i);
    if (!orderMatch) {
      console.log("No order ID found in content:", content);
      return res.status(200).json({ message: "No order ID found" });
    }

    const orderId = orderMatch[1];

    // 🎯 GỌI API FRONTEND để cập nhật order
    const frontendApiUrl =
      process.env.FRONTEND_API_URL || "http://localhost:3000";

    try {
      const response = await fetch(
        `${frontendApiUrl}/api/orders/update-payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.INTERNAL_API_KEY}`, // Bảo mật
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

// Health check cho SePay webhook
router.get("/webhook/sepay/health", (req, res) => {
  res.json({
    success: true,
    message: "SePay webhook endpoint is healthy",
    timestamp: new Date().toISOString(),
  });
});

export default router;
