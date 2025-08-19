import { supabase } from "./supabase";
import {
  Discount,
  CreateDiscountData,
  DiscountStats,
  DiscountUsage,
} from "@/types";

// ✅ Lấy tất cả discount
export async function getAllDiscounts(): Promise<Discount[]> {
  const { data, error } = await supabase
    .from("discounts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching discounts:", error);
    throw error;
  }

  return data || [];
}

// ✅ Lấy discount theo ID
export async function getDiscountById(id: string): Promise<Discount | null> {
  const { data, error } = await supabase
    .from("discounts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching discount:", error);
    return null;
  }

  return data;
}

// ✅ Tạo discount mới
// ✅ Cập nhật function signatures để match
export async function createDiscount(
  discountData: CreateDiscountData,
): Promise<boolean> {
  try {
    // Ensure all required fields are present
    const dataToInsert: CreateDiscountData = {
      code: discountData.code,
      name: discountData.name,
      description: discountData.description,
      type: discountData.type,
      value: discountData.value,
      min_order_amount: discountData.min_order_amount || 0,
      max_discount_amount: discountData.max_discount_amount,
      max_uses: discountData.max_uses,
      max_uses_per_user: discountData.max_uses_per_user || 1,
      start_date: discountData.start_date,
      end_date: discountData.end_date,
      applicable_to: discountData.applicable_to || "all",
      is_active: discountData.is_active ?? true,
    };

    const { error } = await supabase.from("discounts").insert([dataToInsert]);

    if (error) {
      console.error("Error creating discount:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error creating discount:", error);
    return false;
  }
}

export async function updateDiscount(
  id: string,
  discountData: Partial<CreateDiscountData>,
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("discounts")
      .update(discountData)
      .eq("id", id);

    if (error) {
      console.error("Error updating discount:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error updating discount:", error);
    return false;
  }
}

// ✅ Xóa discount
export async function deleteDiscount(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("discounts").delete().eq("id", id);

    if (error) {
      console.error("Error deleting discount:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error deleting discount:", error);
    return false;
  }
}

// ✅ Toggle trạng thái discount
export async function toggleDiscountStatus(
  id: string,
  is_active: boolean,
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("discounts")
      .update({ is_active })
      .eq("id", id);

    if (error) {
      console.error("Error updating discount status:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error updating discount status:", error);
    return false;
  }
}

// ✅ Kiểm tra discount code có tồn tại không
export async function checkDiscountCode(
  code: string,
): Promise<Discount | null> {
  const { data, error } = await supabase
    .from("discounts")
    .select("*")
    .eq("code", code)
    .eq("is_active", true)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

// ✅ Validate discount (kiểm tra còn hiệu lực không)
export function validateDiscount(
  discount: Discount,
  orderAmount: number = 0,
): {
  isValid: boolean;
  reason?: string;
} {
  const now = new Date();
  const startDate = new Date(discount.start_date);
  const endDate = new Date(discount.end_date);

  // Kiểm tra trạng thái
  if (!discount.is_active) {
    return { isValid: false, reason: "Mã giảm giá đã bị vô hiệu hóa" };
  }

  // Kiểm tra thời gian
  if (now < startDate) {
    return { isValid: false, reason: "Mã giảm giá chưa có hiệu lực" };
  }

  if (now > endDate) {
    return { isValid: false, reason: "Mã giảm giá đã hết hạn" };
  }

  // Kiểm tra số lần sử dụng
  if (discount.max_uses && discount.used_count >= discount.max_uses) {
    return { isValid: false, reason: "Mã giảm giá đã hết lượt sử dụng" };
  }

  // Kiểm tra đơn hàng tối thiểu
  if (orderAmount < discount.min_order_amount) {
    return {
      isValid: false,
      reason: `Đơn hàng tối thiểu ${formatPrice(discount.min_order_amount)}`,
    };
  }

  return { isValid: true };
}

// ✅ Tính toán số tiền giảm giá
export function calculateDiscountAmount(
  discount: Discount,
  orderAmount: number,
): number {
  let discountAmount = 0;

  if (discount.type === "fixed") {
    discountAmount = discount.value;
  } else if (discount.type === "percent") {
    discountAmount = (orderAmount * discount.value) / 100;

    // Áp dụng giảm tối đa nếu có
    if (
      discount.max_discount_amount &&
      discountAmount > discount.max_discount_amount
    ) {
      discountAmount = discount.max_discount_amount;
    }
  }

  // Không được vượt quá tổng đơn hàng
  return Math.min(discountAmount, orderAmount);
}

// ✅ Lấy thống kê discount
export async function getDiscountStats(): Promise<DiscountStats> {
  try {
    const { data: discounts, error } = await supabase
      .from("discounts")
      .select("*");

    if (error) throw error;

    const { data: usage, error: usageError } = await supabase
      .from("discount_usage")
      .select("discount_amount, original_amount");

    if (usageError) throw usageError;

    const now = new Date();
    const active =
      discounts?.filter(
        (d) =>
          d.is_active &&
          new Date(d.start_date) <= now &&
          new Date(d.end_date) >= now,
      ).length || 0;

    const expired =
      discounts?.filter((d) => new Date(d.end_date) < now).length || 0;

    const totalUsage = usage?.length || 0;
    const totalSavings =
      usage?.reduce((sum, u) => sum + u.discount_amount, 0) || 0;
    const avgDiscountValue = totalUsage > 0 ? totalSavings / totalUsage : 0;

    return {
      total: discounts?.length || 0,
      active,
      expired,
      totalUsage,
      totalSavings,
      avgDiscountValue,
    };
  } catch (error) {
    console.error("Error fetching discount stats:", error);
    return {
      total: 0,
      active: 0,
      expired: 0,
      totalUsage: 0,
      totalSavings: 0,
      avgDiscountValue: 0,
    };
  }
}

// ✅ Format giá tiền
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

// ✅ Format discount value
export function formatDiscountValue(discount: Discount): string {
  if (discount.type === "fixed") {
    return formatPrice(discount.value);
  } else {
    return `${discount.value}%`;
  }
}

// ✅ Lấy usage history
export async function getDiscountUsageHistory(
  discountId?: string,
): Promise<DiscountUsage[]> {
  let query = supabase
    .from("discount_usage")
    .select(
      `
      *,
      discounts(code, name),
      profiles(name, email),
      orders(id, total_price)
    `,
    )
    .order("used_at", { ascending: false });

  if (discountId) {
    query = query.eq("discount_id", discountId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching discount usage:", error);
    return [];
  }

  return data || [];
}
