import { supabase } from "@/lib/supabase";
import { CartItem, Order, OrderItemUI, Product } from "@/types";
import { toast } from "@/hooks/use-toast";

interface CreateOrderInput {
  userId: string;
  cartItems: CartItem[];
  total: number;
  customer: {
    email: string;
    full_name: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    paymentMethod: string;
  };
}

export async function createOrder({
  userId,
  cartItems,
  total,
  customer,
}: CreateOrderInput) {
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert([
      {
        user_id: userId,
        email: customer.email,
        full_name: customer.full_name,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        country: customer.country,
        payment_method: customer.paymentMethod,
        total_price: total,
        status: "pending", // Thêm mặc định
        payment_status: "pending", // Thêm mặc định
      },
    ])
    .select()
    .single();

  if (orderError) throw new Error(orderError.message);

  const itemsData = cartItems.map((item) => ({
    order_id: order.id,
    product_id: item.product.id,
    quantity: item.quantity,
    price: item.product.price,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(itemsData);

  if (itemsError) throw new Error(itemsError.message);

  return order;
}

function mapOrder(order: any, items: OrderItemUI[] = []): Order {
  return {
    id: order.id,
    user_id: order.user_id,
    status: order.status || "pending", // Đảm bảo có giá trị mặc định
    payment_method: order.payment_method,
    payment_status: order.payment_status || "pending",
    total_price: order.total_price || 0, // Đảm bảo không phải null/undefined
    created_at: order.created_at, // Giữ nguyên định dạng từ Supabase
    updated_at: order.updated_at,
    full_name: order.full_name || "Khách hàng không xác định", // Giá trị mặc định
    email: order.email || "",
    phone: order.phone || "",
    address: order.address || "",
    city: order.city || "",
    country: order.country || "",
    items,
  };
}

export async function getAllOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `*,
      order_items(*, products(*))
    `,
    )
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((order: any) => {
    const items: OrderItemUI[] = order.order_items.map((item: any) => ({
      ...item,
      // product: item.products as Product,
      product: item.products ? (item.products as Product) : null,
    }));
    return mapOrder(order, items);
  });
}

export async function updateOrderStatus(
  orderId: string,
  status: Order["status"],
): Promise<boolean> {
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);

  return !error;
}

export async function getOrderWithItems(
  orderId: string,
): Promise<Order | null> {
  const { data, error } = await supabase
    .from("orders")
    .select(`*, order_items(*, products(*))`)
    .eq("id", orderId)
    .single();

  if (error || !data) return null;

  const items: OrderItemUI[] = data.order_items.map((item: any) => ({
    ...item,
    product: item.products as Product,
  }));

  return mapOrder(data, items);
}

// lib/order.ts - Thêm function update payment
export async function updateOrderPaymentStatus(
  orderId: string,
  paymentStatus:
    | "pending"
    | "processing"
    | "completed"
    | "paid"
    | "failed"
    | "refunded",
): Promise<boolean> {
  const { error } = await supabase
    .from("orders")
    .update({
      payment_status: paymentStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId);

  return !error;
}

// ✅ Enhanced function để update cả status và payment_status
export async function updateOrderComplete(
  orderId: string,
  isSuccess: boolean,
): Promise<boolean> {
  const updateData = isSuccess
    ? {
        status: "completed",
        payment_status: "completed", // ✅ Hoặc "paid" tùy logic
        updated_at: new Date().toISOString(),
      }
    : {
        status: "cancelled",
        payment_status: "failed",
        updated_at: new Date().toISOString(),
      };

  const { error } = await supabase
    .from("orders")
    .update(updateData)
    .eq("id", orderId);

  return !error;
}
