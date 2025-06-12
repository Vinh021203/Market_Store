import { supabase } from "@/lib/supabase";
import { CartItem } from "@/types";

export async function addToCartDB(
  userId: string,
  productId: string,
  quantity = 1,
  price: number
) {
  const { data, error } = await supabase
    .from("carts")
    .upsert(
      {
        user_id: userId,
        product_id: productId,
        quantity,
        price_at_added: price,
      },
      { onConflict: 'user_id,product_id' }
    );

  if (error) {
    console.error("⛔ Lỗi khi thêm vào giỏ hàng:", error.message, error.details);
    throw error;
  }
  return data;
}


export async function getCartItems(userId: string): Promise<CartItem[]> {
  const { data, error } = await supabase
    .from("carts")
    .select("*, product:products(*)") // lấy cả product chi tiết
    .eq("user_id", userId);

  if (error) throw error;
  return data.map(item => ({
    id: item.id,
    quantity: item.quantity,
    addedAt: item.created_at,
    product: item.product,
  }));
}

export async function updateCartItem(userId: string, productId: string, quantity: number) {
  return await supabase
    .from("carts")
    .update({ quantity })
    .eq("user_id", userId)
    .eq("product_id", productId);
}

export async function removeCartItem(userId: string, productId: string) {
  return await supabase
    .from("carts")
    .delete()
    .eq("user_id", userId)
    .eq("product_id", productId);
}

export async function clearCart(userId: string) {
  return await supabase
    .from("carts")
    .delete()
    .eq("user_id", userId);
}
