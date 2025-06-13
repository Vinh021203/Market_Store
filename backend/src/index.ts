import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import uploadRoute from "./routes/uploadRoute";
import sepayRoute from "./routes/sepayRoute";
import productRoute from "./routes/productRoute";

// ✅ Extend Express Request interface inline
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

// Security Middleware
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

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", limiter);

// CORS Configuration
const isDevelopment = process.env.NODE_ENV === "development";
const allowedOrigins = [
  "https://marketstore-two.vercel.app",
  ...(isDevelopment ? ["http://localhost:3000"] : []),
];

app.use(
  cors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void
    ) => {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error(`🚫 CORS blocked origin: ${origin}`);
        callback(new Error(`CORS not allowed from origin: ${origin}`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  })
);

// Body Parser
app.use(
  express.json({
    limit: "10mb",
    verify: (req: Request, res: Response, buf: Buffer) => {
      if (req.url?.includes("/webhook/sepay")) {
        req.rawBody = buf;
      }
    },
  })
);

app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Routes
app.use("/api", uploadRoute);
app.use("/api", sepayRoute);
app.use("/api", productRoute);

// Health check
app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Backend server is running",
    timestamp: new Date().toISOString(),
  });
});

// Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err.message);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
