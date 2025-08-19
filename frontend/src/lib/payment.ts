// lib/payment.ts
import { supabase } from "@/lib/supabase";
import {
  Order,
  OrderItem,
  CheckoutData,
  PaymentTransaction,
  PaymentResult,
  VietQRPayment,
  PaymentMethod,
  CartItem,
} from "@/types";

// 🔁 Convert snake_case → camelCase for Payment Transaction
function mapPaymentTransaction(data: any): PaymentTransaction {
  return {
    ...data,
    order_id: data.order_id,
    payment_method: data.payment_method,
    transaction_id: data.transaction_id,
    gateway_response: data.gateway_response,
    processed_at: data.processed_at,
    created_at: data.created_at,
  };
}

// 🔁 Convert snake_case → camelCase for Order
function mapOrder(data: any): Order {
  return {
    ...data,
    user_id: data.user_id,
    full_name: data.full_name || "",
    payment_method: data.payment_method,
    payment_status: data.payment_status,
    total_price: data.total_price,
    created_at: data.created_at,
    updated_at: data.updated_at,
    items: [], // Will be populated separately
  };
}

// ===== PAYMENT METHODS =====
export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "vietqr",
    name: "VietQR",
    icon: "🏦",
    description: "Quét mã QR để thanh toán qua ứng dụng ngân hàng",
    enabled: true,
  },
  {
    id: "credit_card",
    name: "Thẻ tín dụng",
    icon: "💳",
    description: "Visa, MasterCard, JCB",
    enabled: true,
  },
  {
    id: "bank_transfer",
    name: "Chuyển khoản ngân hàng",
    icon: "🏧",
    description: "Chuyển khoản trực tiếp qua ngân hàng",
    enabled: true,
  },
  {
    id: "paypal",
    name: "PayPal",
    icon: "🌐",
    description: "Thanh toán quốc tế qua PayPal",
    enabled: false,
  },
];

// ===== CORE PAYMENT FUNCTIONS =====

/**
 * Tạo đơn hàng mới từ checkout data
 */
export async function createOrder(
  checkoutData: CheckoutData,
): Promise<string | null> {
  try {
    const { data: userData } = await supabase.auth.getUser();

    // Tạo order
    const orderData = {
      user_id: userData?.user?.id || null,
      full_name: checkoutData.full_name,
      email: checkoutData.email,
      phone: checkoutData.phone,
      address: checkoutData.address,
      city: checkoutData.city,
      country: checkoutData.country,
      payment_method: checkoutData.payment_method,
      total_price: checkoutData.total_price,
      status: "pending",
      payment_status: "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([orderData])
      .select()
      .single();

    if (orderError || !order) {
      throw new Error(`Lỗi tạo đơn hàng: ${orderError?.message}`);
    }

    // Tạo order items
    const orderItems = checkoutData.items.map((item: CartItem) => ({
      order_id: order.id,
      product_id: item.product.id,
      quantity: item.quantity,
      price: item.product.price,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      throw new Error(`Lỗi tạo order items: ${itemsError.message}`);
    }

    return order.id;
  } catch (error) {
    console.error("Lỗi tạo đơn hàng:", error);
    return null;
  }
}

/**
 * Xử lý thanh toán VietQR
 */
export async function processVietQRPayment(
  orderId: string,
  amount: number,
): Promise<PaymentResult> {
  try {
    // Tạo mã QR VietQR
    const qrData: VietQRPayment = {
      qr_code: generateVietQRCode(orderId, amount),
      bank_id: "970415", // Vietinbank
      account_no: "106877777777", // Số tài khoản của bạn
      account_name: "TEMPLATE MARKET",
      amount: amount,
      description: `Thanh toan don hang #${orderId}`,
      addInfo: orderId,
    };

    // Tạo payment transaction
    const transactionData = {
      order_id: orderId,
      payment_method: "vietqr",
      transaction_id: generateTransactionId(),
      amount: amount,
      currency: "VND",
      status: "pending",
      gateway_response: qrData,
      created_at: new Date().toISOString(),
    };

    const { data: transaction, error } = await supabase
      .from("payment_transactions")
      .insert([transactionData])
      .select()
      .single();

    if (error) {
      throw new Error(`Lỗi tạo giao dịch: ${error.message}`);
    }

    return {
      success: true,
      transaction_id: transaction.transaction_id,
      order_id: orderId,
      qr_data: qrData,
      message: "Mã QR đã được tạo thành công",
    };
  } catch (error) {
    console.error("Lỗi xử lý VietQR:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Lỗi không xác định",
    };
  }
}

/**
 * Xử lý thanh toán thẻ tín dụng (mock)
 */
export async function processCreditCardPayment(
  orderId: string,
  amount: number,
  cardData: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardHolder: string;
  },
): Promise<PaymentResult> {
  try {
    // Mock credit card processing
    const transactionId = generateTransactionId();

    // Simulate API call to payment gateway
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock success response (80% success rate)
    const isSuccess = Math.random() > 0.2;

    const transactionData = {
      order_id: orderId,
      payment_method: "credit_card",
      transaction_id: transactionId,
      amount: amount,
      currency: "VND",
      status: isSuccess ? "completed" : "failed",
      gateway_response: {
        cardNumber: `****-****-****-${cardData.cardNumber.slice(-4)}`,
        responseCode: isSuccess ? "00" : "05",
        message: isSuccess ? "Approved" : "Declined",
      },
      processed_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    const { data: transaction, error } = await supabase
      .from("payment_transactions")
      .insert([transactionData])
      .select()
      .single();

    if (error) {
      throw new Error(`Lỗi tạo giao dịch: ${error.message}`);
    }

    if (isSuccess) {
      // Update order status
      await updateOrderPaymentStatus(orderId, "paid");
    }

    return {
      success: isSuccess,
      transaction_id: transactionId,
      order_id: orderId,
      message: isSuccess
        ? "Thanh toán thành công"
        : "Thanh toán thất bại - Thẻ bị từ chối",
    };
  } catch (error) {
    console.error("Lỗi xử lý thẻ tín dụng:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Lỗi không xác định",
    };
  }
}

/**
 * Xử lý chuyển khoản ngân hàng
 */
export async function processBankTransferPayment(
  orderId: string,
  amount: number,
): Promise<PaymentResult> {
  try {
    const transactionData = {
      order_id: orderId,
      payment_method: "bank_transfer",
      transaction_id: generateTransactionId(),
      amount: amount,
      currency: "VND",
      status: "pending",
      gateway_response: {
        bankInfo: {
          bankName: "Vietinbank",
          accountNumber: "106877777777",
          accountName: "TEMPLATE MARKET",
          transferNote: `Thanh toan don hang #${orderId}`,
        },
      },
      created_at: new Date().toISOString(),
    };

    const { data: transaction, error } = await supabase
      .from("payment_transactions")
      .insert([transactionData])
      .select()
      .single();

    if (error) {
      throw new Error(`Lỗi tạo giao dịch: ${error.message}`);
    }

    return {
      success: true,
      transaction_id: transaction.transaction_id,
      order_id: orderId,
      message: "Đã tạo lệnh chuyển khoản",
    };
  } catch (error) {
    console.error("Lỗi xử lý chuyển khoản:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Lỗi không xác định",
    };
  }
}

// ===== ORDER MANAGEMENT =====

/**
 * Lấy thông tin đơn hàng theo ID
 */
export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    // Lấy thông tin order
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError || !orderData) {
      return null;
    }

    // Lấy order items với thông tin product
    const { data: itemsData, error: itemsError } = await supabase
      .from("order_items")
      .select(
        `
        *,
        products (*)
      `,
      )
      .eq("order_id", orderId);

    if (itemsError) {
      console.error("Lỗi lấy order items:", itemsError);
    }

    const order = mapOrder(orderData);
    order.items = (itemsData || []).map((item: any) => ({
      ...item,
      product: item.products,
    }));

    return order;
  } catch (error) {
    console.error("Lỗi lấy đơn hàng:", error);
    return null;
  }
}

/**
 * Cập nhật trạng thái thanh toán đơn hàng
 */
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
  try {
    const { error } = await supabase
      .from("orders")
      .update({
        payment_status: paymentStatus,
        payment_confirmed_at:
          paymentStatus === "paid" ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    return !error;
  } catch (error) {
    console.error("Lỗi cập nhật trạng thái thanh toán:", error);
    return false;
  }
}

/**
 * Lấy danh sách giao dịch theo order ID
 */
export async function getPaymentTransactionsByOrder(
  orderId: string,
): Promise<PaymentTransaction[]> {
  try {
    const { data, error } = await supabase
      .from("payment_transactions")
      .select("*")
      .eq("order_id", orderId)
      .order("created_at", { ascending: false });

    if (error || !data) {
      return [];
    }

    return data.map(mapPaymentTransaction);
  } catch (error) {
    console.error("Lỗi lấy giao dịch:", error);
    return [];
  }
}

/**
 * Xác nhận thanh toán (webhook hoặc manual)
 */
export async function confirmPayment(
  transactionId: string,
  gatewayResponse?: any,
): Promise<boolean> {
  try {
    // Cập nhật transaction
    const { data: transaction, error: transactionError } = await supabase
      .from("payment_transactions")
      .update({
        status: "completed",
        gateway_response: gatewayResponse || {},
        processed_at: new Date().toISOString(),
      })
      .eq("transaction_id", transactionId)
      .select()
      .single();

    if (transactionError || !transaction) {
      return false;
    }

    // Cập nhật order
    const success = await updateOrderPaymentStatus(
      transaction.order_id,
      "paid",
    );

    return success;
  } catch (error) {
    console.error("Lỗi xác nhận thanh toán:", error);
    return false;
  }
}

// ===== UTILITY FUNCTIONS =====

/**
 * Tạo mã giao dịch duy nhất
 */
export function generateTransactionId(): string {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8);
  return `TX${timestamp}${random}`.toUpperCase();
}

/**
 * Tạo mã QR VietQR
 */
export function generateVietQRCode(orderId: string, amount: number): string {
  // Simplified QR code generation (in real app, use proper VietQR library)
  const bankId = "970415";
  const accountNo = "106877777777";
  const transferNote = `Thanh toan don hang #${orderId}`;

  return `https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(transferNote)}`;
}

/**
 * Format số tiền VND
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

/**
 * Validate dữ liệu checkout
 */
export function validateCheckoutData(data: CheckoutData): string[] {
  const errors: string[] = [];

  if (!data.full_name?.trim()) errors.push("Họ tên không được để trống");
  if (!data.email?.trim()) errors.push("Email không được để trống");
  if (!data.phone?.trim()) errors.push("Số điện thoại không được để trống");
  if (!data.address?.trim()) errors.push("Địa chỉ không được để trống");
  if (!data.city?.trim()) errors.push("Thành phố không được để trống");
  if (!data.country?.trim()) errors.push("Quốc gia không được để trống");
  if (!data.payment_method) errors.push("Vui lòng chọn phương thức thanh toán");
  if (!data.items || data.items.length === 0) errors.push("Giỏ hàng trống");

  // Validate email format
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("Email không hợp lệ");
  }

  // Validate phone format
  if (data.phone && !/^[0-9+\-\s()]{10,15}$/.test(data.phone)) {
    errors.push("Số điện thoại không hợp lệ");
  }

  return errors;
}
