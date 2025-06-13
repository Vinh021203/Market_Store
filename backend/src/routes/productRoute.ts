import express, { Request, Response } from "express";

const router = express.Router();

// ✅ Better environment check với detailed logging
const checkEnvironment = () => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  console.log("🔍 Detailed Environment check:");
  console.log("NODE_ENV:", process.env.NODE_ENV);
  console.log("PORT:", process.env.PORT);
  console.log(
    "SUPABASE_URL:",
    supabaseUrl ? `Set (${supabaseUrl.substring(0, 30)}...)` : "❌ Missing"
  );
  console.log(
    "SUPABASE_ANON_KEY:",
    supabaseKey ? `Set (${supabaseKey.substring(0, 20)}...)` : "❌ Missing"
  );
  console.log(
    "All env keys:",
    Object.keys(process.env).filter((key) => key.includes("SUPABASE"))
  );

  return { supabaseUrl, supabaseKey };
};

const { supabaseUrl, supabaseKey } = checkEnvironment();

// ✅ Graceful handling instead of throwing error immediately
let supabase: any = null;

const initSupabase = async () => {
  if (!supabase) {
    if (!supabaseUrl || !supabaseKey) {
      console.error(
        "❌ Cannot initialize Supabase: Missing environment variables"
      );
      return null;
    }

    try {
      const { createClient } = await import("@supabase/supabase-js");
      supabase = createClient(supabaseUrl, supabaseKey);
      console.log("✅ Supabase client initialized successfully");
      return supabase;
    } catch (error) {
      console.error("❌ Failed to initialize Supabase:", error);
      return null;
    }
  }
  return supabase;
};

// ✅ Health check with environment status
router.get("/health", async (req: Request, res: Response) => {
  const envCheck = checkEnvironment();

  try {
    const client = await initSupabase();

    res.json({
      success: !!client,
      message: client
        ? "Product API is healthy"
        : "Product API has environment issues",
      environment: {
        supabase_url: !!envCheck.supabaseUrl,
        supabase_key: !!envCheck.supabaseKey,
        node_env: process.env.NODE_ENV,
      },
      supabase: client ? "connected" : "not_connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Health check failed",
      error: (error as Error).message,
      environment: {
        supabase_url: !!envCheck.supabaseUrl,
        supabase_key: !!envCheck.supabaseKey,
      },
    });
  }
});

// ✅ Products endpoint with environment check
router.get("/products", async (req: Request, res: Response) => {
  try {
    const client = await initSupabase();

    if (!client) {
      return res.status(503).json({
        success: false,
        message: "Service unavailable: Supabase not configured",
        environment_issue: "Missing SUPABASE_URL or SUPABASE_ANON_KEY",
      });
    }

    const { data, error } = await client
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      data: data || [],
    });
  } catch (error: any) {
    console.error("Get products error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
});

// ✅ Product by ID with environment check
router.get("/products/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const client = await initSupabase();

    if (!client) {
      return res.status(503).json({
        success: false,
        message: "Service unavailable: Supabase not configured",
      });
    }

    const { data, error } = await client
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch (error: any) {
    console.error("Get product error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message,
    });
  }
});

export default router;
