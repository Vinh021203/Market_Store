export interface User {
  id: string;
  email?: string;
  name: string;
  role: "admin" | "customer";
  avatar?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: "template" | "ebook";
  tags: string[];
  image: string;
  images: string[];
  downloadUrl?: string;
  previewUrl?: string;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  author: string;
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  technologies?: string[];
  fileSize?: string;
  format?: string;
  pages?: number;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  addedAt: string;
}

export interface Order {
  id: string;
  user_id: string | null; // match với Supabase
  status: "pending" | "processing" | "completed" | "cancelled" | null;
  payment_method: string | null;
  payment_status:
    | "pending"
    | "processing"
    | "completed"
    | "paid"
    | "failed"
    | "refunded"
    | null;
  total_price: number | null;
  created_at: string | null;
  updated_at?: string | null;

  full_name: string | null; // Bắt buộc có giá trị mặc định trong mapOrder
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  country: string | null;

  items: OrderItemUI[]; // Sử dụng items thay vì order_items sau khi map
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  products?: Product; // từ Supabase
}

export interface OrderItemUI extends OrderItem {
  product: Product | null; // để dùng tiện trong frontend UI
}

export interface Download {
  id: string;
  userId: string;
  name: string;
  type: "template" | "ebook";
  downloadDate: string;
  fileSize?: string;
  downloadUrl: string;
  download_date: string; // ✅ snake_case như database
  file_size?: string;
}

export interface DownloadUI extends Download {
  // Computed properties for easier frontend access
  downloadDate: string; // camelCase alias
  fileSize?: string; // camelCase alias
  downloadUrl: string; // camelCase alias
  userId: string; // camelCase alias
  productId?: string; // camelCase alias
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<boolean>;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
  isLoading: boolean;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface FilterOptions {
  category?: "template" | "ebook" | "all";
  priceRange?: [number, number];
  tags?: string[];
  sortBy?:
    | "newest"
    | "oldest"
    | "price_low"
    | "price_high"
    | "rating"
    | "popular";
  search?: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
  helpful: number;
  verified: boolean;
}

// Thêm vào file types/index.ts

// ===== PAYMENT INTERFACES =====
export interface PaymentTransaction {
  id: string;
  order_id: string;
  payment_method: string;
  transaction_id: string | null;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "cancelled";
  gateway_response: any;
  processed_at: string | null;
  created_at: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
  enabled: boolean;
}

export interface CheckoutData {
  full_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  payment_method: "vietqr" | "credit_card" | "paypal" | "bank_transfer";
  total_price: number;
  items: CartItem[];
}

export interface VietQRPayment {
  qr_code: string;
  bank_id: string;
  account_no: string;
  account_name: string;
  amount: number;
  description: string;
  addInfo?: string;
}

export interface PaymentResult {
  success: boolean;
  transaction_id?: string;
  order_id?: string;
  payment_url?: string;
  qr_data?: VietQRPayment;
  message?: string;
  error?: string;
}

// ✅ Discount Types
export interface Discount {
  id: string;
  code: string;
  name: string;
  description?: string;

  // Loại và giá trị
  type: "percent" | "fixed";
  value: number;

  // Điều kiện áp dụng
  min_order_amount: number;
  max_discount_amount?: number;

  // Số lần sử dụng
  max_uses?: number;
  used_count: number;
  max_uses_per_user: number;

  // Thời gian
  start_date: string;
  end_date: string;

  // Phạm vi áp dụng
  applicable_to: "all" | "products" | "users";

  // Trạng thái
  is_active: boolean;

  // Audit
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface DiscountUsage {
  id: string;
  discount_id: string;
  user_id: string;
  order_id: string;
  discount_amount: number;
  original_amount: number;
  used_at: string;
}

export interface DiscountProduct {
  id: string;
  discount_id: string;
  product_id: string;
  created_at: string;
}

export interface DiscountUser {
  id: string;
  discount_id: string;
  user_id: string;
  remaining_uses: number;
  created_at: string;
}

// Form data types
// ✅ Cập nhật CreateDiscountData interface
export interface CreateDiscountData {
  code: string; // required
  name: string; // required
  description?: string; // optional
  type: "percent" | "fixed"; // required
  value: number; // required
  min_order_amount: number; // required, default 0
  max_discount_amount?: number; // optional
  max_uses?: number; // optional
  max_uses_per_user: number; // required, default 1
  start_date: string; // required
  end_date: string; // required
  applicable_to: "all" | "products" | "users"; // required, default 'all'
  is_active: boolean; // required, default true
}

export interface DiscountStats {
  total: number;
  active: number;
  expired: number;
  totalUsage: number;
  totalSavings: number;
  avgDiscountValue: number;
}
