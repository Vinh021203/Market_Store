import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import uploadRoute from "./routes/uploadRoute";
import sepayRoute from "./routes/sepayRoute";
import productRoute from "./routes/productRoute";

// ✅ Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      rawBody?: Buffer;
    }
  }
}

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 🛡️ Security Middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
        scriptSrc: ["'self'"],
        connectSrc: ["'self'", "https://hzehfylaykntacubumdf.supabase.co"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// 🚦 Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", limiter);

// 🌐 CORS Configuration
const isDevelopment = process.env.NODE_ENV === "development";
const allowedOrigins = [
  "https://marketstoreapp.vercel.app",
  ...(isDevelopment ? ["http://localhost:3000", "http://localhost:8080"] : []),
];

app.use(
  cors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void
    ) => {
      // Allow requests without origin (mobile apps, Postman, server-to-server)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error(`🚫 CORS blocked origin: ${origin}`);
        console.log(`✅ Allowed origins:`, allowedOrigins);
        callback(new Error(`CORS not allowed from origin: ${origin}`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
    maxAge: 86400, // 24 hours preflight cache
  })
);

// 📝 Body Parser
app.use(
  express.json({
    limit: "10mb",
    verify: (req: Request, res: Response, buf: Buffer) => {
      // Store raw body for webhook signature verification
      if (req.url?.includes("/webhook/sepay")) {
        req.rawBody = buf;
      }
    },
  })
);

app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// 🔍 Request Logging
app.use((req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  console.log(
    `${timestamp} - ${req.method} ${req.url} - Origin: ${
      req.headers.origin || "No origin"
    }`
  );
  next();
});

// 📍 Routes
app.use("/api", uploadRoute);
app.use("/api", sepayRoute);
app.use("/api", productRoute);

// 🏥 Health Check
app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Backend server is running",
    environment: process.env.NODE_ENV || "development",
    services: {
      cloudinary: "active",
      sepay_webhook: "active",
      products_api: "active",
      supabase: "active",
    },
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// 🚫 404 Handler
app.use("*", (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
    path: req.originalUrl,
    method: req.method,
  });
});

// 🚨 Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("❌ Error:", err.message);

  if (err.message.includes("CORS not allowed")) {
    return res.status(403).json({
      success: false,
      message: "CORS Error: Origin not allowed",
      origin: req.headers.origin,
      allowed_origins: isDevelopment
        ? allowedOrigins
        : ["Contact admin for access"],
    });
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: isDevelopment ? err.message : "Something went wrong",
  });
});

// 🚀 Server Start
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🛡️ Security: Helmet + CORS + Rate Limiting enabled`);
  console.log(`📁 Cloudinary upload: http://localhost:${PORT}/api/upload`);
  console.log(`💳 SePay webhook: http://localhost:${PORT}/api/webhook/sepay`);
  console.log(`📦 Products API: http://localhost:${PORT}/api/products`);
  console.log(`🌐 Allowed origins:`, allowedOrigins);
});

// 🔄 Graceful Shutdown
process.on("SIGTERM", () => {
  console.log("🛑 SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("🛑 SIGINT received, shutting down gracefully");
  process.exit(0);
});
