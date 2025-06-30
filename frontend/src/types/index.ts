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
