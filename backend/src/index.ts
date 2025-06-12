// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import uploadRoute from './routes/uploadRoute';

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.json());

// app.use('/api', uploadRoute);

// app.listen(PORT, () => {
//   console.log(`🚀 Server is running at http://localhost:${PORT}`);
// });

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import uploadRoute from "./routes/uploadRoute";
import sepayRoute from "./routes/sepayRoute"; // 🆕 Thêm SePay route

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));

// Routes
app.use("/api", uploadRoute); // Upload routes (Cloudinary)
app.use("/api", sepayRoute); // 🆕 SePay webhook routes

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend server is running",
    services: {
      cloudinary: "active",
      sepay_webhook: "active",
    },
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
);

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
  console.log(`📁 Cloudinary upload: http://localhost:${PORT}/api/upload`);
  console.log(`💳 SePay webhook: http://localhost:${PORT}/api/webhook/sepay`);
});
