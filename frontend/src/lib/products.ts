import { Product, FilterOptions } from "@/types";
import { supabase } from "@/lib/supabase";
import { toDbProduct } from "@/utils/productMapper";

// 🔁 Convert snake_case → camelCase
function mapProduct(data: any): Product {
  return {
    ...data,
    originalPrice: data.original_price,
    isFeatured: data.is_featured,
    isActive: data.is_active,
    downloadUrl: data.download_url,
    previewUrl: data.preview_url,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

export function formatFileSize(sizeStr: string): string {
  return sizeStr;
}

export function getDiscountPercentage(
  originalPrice: number,
  currentPrice: number,
): number {
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}

export function filterProducts(
  products: Product[],
  filters: FilterOptions,
): Product[] {
  let filtered = products;

  if (filters.category && filters.category !== "all") {
    filtered = filtered.filter(
      (product) => product.category === filters.category,
    );
  }

  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filtered = filtered.filter(
      (product) =>
        product.title.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.tags.some((tag) => tag.toLowerCase().includes(searchTerm)),
    );
  }

  if (filters.priceRange) {
    const [min, max] = filters.priceRange;
    filtered = filtered.filter(
      (product) => product.price >= min && product.price <= max,
    );
  }

  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter((product) =>
      filters.tags!.some((tag) => product.tags.includes(tag)),
    );
  }

  if (filters.sortBy) {
    filtered = [...filtered].sort((a, b) => {
      switch (filters.sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "price_low":
          return a.price - b.price;
        case "price_high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "popular":
          return b.reviewCount - a.reviewCount;
        default:
          return 0;
      }
    });
  }

  return filtered;
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;

  return mapProduct(data);
}

// ✅ CẬP NHẬT: getFeaturedProducts để lấy ngẫu nhiên 4 sản phẩm
export async function getFeaturedProducts(
  limit: number = 4,
): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_featured", true)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Lỗi khi lấy sản phẩm nổi bật từ Supabase:", error);
    return [];
  }

  let featuredProducts = data.map(mapProduct);

  for (let i = featuredProducts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [featuredProducts[i], featuredProducts[j]] = [
      featuredProducts[j],
      featuredProducts[i],
    ];
  }

  return featuredProducts.slice(0, limit);
}

export async function getRelatedProducts(
  product: Product,
  limit: number = 4,
): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .neq("id", product.id)
    .eq("category", product.category)
    .eq("is_active", true)
    .limit(limit);

  if (error || !data) return [];

  return data.map(mapProduct);
}

export async function getAllTags(): Promise<string[]> {
  const { data, error } = await supabase
    .from("products")
    .select("tags")
    .eq("is_active", true);

  if (error || !data) return [];

  const tagSet = new Set<string>();
  data.forEach((row: { tags: string[] }) => {
    row.tags.forEach((tag) => tagSet.add(tag));
  });

  return Array.from(tagSet).sort();
}

export async function getProductsByCategory(
  category: "template" | "ebook",
): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("category", category)
    .eq("is_active", true);

  if (error || !data) return [];

  return data.map(mapProduct);
}

export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data.map(mapProduct);
}

export async function updateProductStatus(
  id: string,
  isActive: boolean,
): Promise<boolean> {
  const { error } = await supabase
    .from("products")
    .update({ is_active: isActive })
    .eq("id", id);

  return !error;
}

function removeUndefinedFields(obj: Record<string, any>) {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined),
  );
}

export async function createProduct(productData: Partial<Product>) {
  const baseData = toDbProduct(productData);

  const cleanData = removeUndefinedFields({
    ...baseData,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  const { error } = await supabase.from("products").insert([cleanData]);

  if (error) throw new Error("Create failed: " + error.message);
}

export async function updateProduct(id: string, productData: Partial<Product>) {
  const cleanData = {
    ...toDbProduct(productData),
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("products")
    .update(cleanData)
    .eq("id", id);

  if (error) throw new Error(error.message);
}
