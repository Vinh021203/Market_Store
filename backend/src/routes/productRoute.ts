import express, { Request, Response } from "express";

const router = express.Router();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

console.log("🔍 Environment check:");
console.log("SUPABASE_URL:", supabaseUrl ? "Set" : "Missing");
console.log("SUPABASE_ANON_KEY:", supabaseKey ? "Set" : "Missing");

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase environment variables");
  throw new Error("Supabase environment variables are required");
}

let supabase: any;

const initSupabase = async () => {
  if (!supabase) {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      supabase = createClient(supabaseUrl, supabaseKey);
      console.log("✅ Supabase client initialized successfully");
    } catch (error) {
      console.error("❌ Failed to initialize Supabase:", error);
      throw error;
    }
  }
  return supabase;
};

router.get("/health", async (req: Request, res: Response) => {
  try {
    const client = await initSupabase();
    res.json({
      success: true,
      message: "Product API is healthy",
      supabase: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Health check failed",
      error: (error as Error).message,
    });
  }
});

router.get("/products", async (req: Request, res: Response) => {
  try {
    const client = await initSupabase();

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

router.get("/products/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const client = await initSupabase();

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
