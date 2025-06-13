import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import uploadRoute from "./routes/uploadRoute";
import sepayRoute from "./routes/sepayRoute";
import productRoute from "./routes/productRoute";

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
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const sepayLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // SePay webhook rate limit
  message: {
    success: false,
    message: "SePay webhook rate limit exceeded",
  },
});

app.use("/api", limiter);
app.use("/api/webhook/sepay", sepayLimiter);

// 🌐 CORS Configuration với Environment-based Security
const isDevelopment = process.env.NODE_ENV === "development";
const allowedOrigins = [
  "https://marketstore-two.vercel.app", // ✅ Production frontend (bỏ trailing slash)
  ...(isDevelopment
    ? [
        "http://localhost:3000",
        "http://localhost:8080",
        "http://127.0.0.1:3000",
      ]
    : []),
];

app.use(
  cors({
    origin: (origin, callback) => {
      // ✅ Allow requests without origin (mobile apps, Postman, server-to-server)
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
    exposedHeaders: ["X-Total-Count"],
    maxAge: 86400, // 24 hours preflight cache
  })
);

app.use(
  express.json({
    limit: "10mb",
    verify: (req: any, res, buf) => {
      // ✅ Store raw body for webhook signature verification
      if (req.url?.includes("/webhook/sepay")) {
        req.rawBody = buf;
      }
    },
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

// 🔍 Request Logging Middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(
    `${timestamp} - ${req.method} ${req.url} - Origin: ${
      req.headers.origin || "No origin"
    }`
  );
  next();
});

// 🛡️ Security Headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

// 📍 Routes
app.use("/api", uploadRoute);
app.use("/api", sepayRoute);
app.use("/api", productRoute);

// 🏥 Health Check với Security Info
app.get("/api/health", (req, res) => {
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
    security: {
      cors_enabled: true,
      rate_limiting: true,
      helmet_enabled: true,
      allowed_origins_count: allowedOrigins.length,
    },
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// 🔍 CORS Debug Endpoint (Development only)
if (isDevelopment) {
  app.get("/api/cors-debug", (req, res) => {
    res.json({
      success: true,
      request_origin: req.headers.origin,
      allowed_origins: allowedOrigins,
      environment: process.env.NODE_ENV,
      cors_allowed: allowedOrigins.includes(req.headers.origin || ""),
    });
  });
}

// 🚫 404 Handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
    path: req.originalUrl,
    method: req.method,
  });
});

// 🚨 Error Handler
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
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

    if (err.type === "entity.too.large") {
      return res.status(413).json({
        success: false,
        message: "Request entity too large",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: isDevelopment ? err.message : "Something went wrong",
    });
  }
);

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
