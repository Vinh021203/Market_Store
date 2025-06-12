import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import uploadRoute from "./routes/uploadRoute";
import sepayRoute from "./routes/sepayRoute";
import productRoute from "./routes/productRoute"; // 🆕 Thêm Product route

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:8080",
  "https://your-frontend.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed from this origin: " + origin));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));

// Routes
app.use("/api", uploadRoute); // Cloudinary upload
app.use("/api", sepayRoute); // SePay webhook
app.use("/api", productRoute); // 🆕 Product API

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend server is running",
    services: {
      cloudinary: "active",
      sepay_webhook: "active",
      products_api: "active", // 🆕
    },
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
  console.log(`📁 Cloudinary upload: http://localhost:${PORT}/api/upload`);
  console.log(`💳 SePay webhook: http://localhost:${PORT}/api/webhook/sepay`);
  console.log(`📦 Products API: http://localhost:${PORT}/api/products`); // 🆕
});
