// lib/reviews.ts
import { supabase } from "@/lib/supabase";

export interface Review {
  id: string;
  productId: string;
  userId?: string;
  userName: string;
  userEmail: string;
  rating: number;
  title?: string;
  comment: string;
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewData {
  productId: string;
  userName: string;
  userEmail: string;
  rating: number;
  title?: string;
  comment: string;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

// Map từ DB snake_case → camelCase
function mapReview(data: any): Review {
  return {
    id: data.id,
    productId: data.product_id,
    userId: data.user_id,
    userName: data.user_name,
    userEmail: data.user_email,
    rating: data.rating,
    title: data.title,
    comment: data.comment,
    isVerifiedPurchase: data.is_verified_purchase,
    isApproved: data.is_approved,
    helpfulCount: data.helpful_count,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

// ✅ Lấy reviews của 1 sản phẩm
export async function getProductReviews(
  productId: string,
  limit: number = 20,
): Promise<Review[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("product_id", productId)
    .eq("is_approved", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }

  return (data || []).map(mapReview);
}

// ✅ Tạo review mới
export async function createReview(
  reviewData: CreateReviewData,
): Promise<Review> {
  const { data, error } = await supabase
    .from("reviews")
    .insert({
      product_id: reviewData.productId,
      user_name: reviewData.userName,
      user_email: reviewData.userEmail,
      rating: reviewData.rating,
      title: reviewData.title || null,
      comment: reviewData.comment,
      is_approved: true, // Cần admin duyệt
      helpful_count: 0,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating review:", error);
    throw error;
  }

  return mapReview(data);
}

// ✅ Đếm số reviews của 1 sản phẩm
export async function getProductReviewCount(
  productId: string,
): Promise<number> {
  const { count, error } = await supabase
    .from("reviews")
    .select("*", { count: "exact", head: true })
    .eq("product_id", productId)
    .eq("is_approved", true);

  if (error) {
    console.error("Error counting reviews:", error);
    return 0;
  }

  return count || 0;
}

// ✅ Lấy thống kê đánh giá
export async function getReviewStats(productId: string): Promise<ReviewStats> {
  const { data, error } = await supabase
    .from("reviews")
    .select("rating")
    .eq("product_id", productId)
    .eq("is_approved", true);

  if (error || !data) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    };
  }

  const totalReviews = data.length;
  const sumRatings = data.reduce((sum, r) => sum + r.rating, 0);
  const averageRating = totalReviews > 0 ? sumRatings / totalReviews : 0;

  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  data.forEach((r) => {
    distribution[r.rating as 1 | 2 | 3 | 4 | 5]++;
  });

  return {
    averageRating: Math.round(averageRating * 10) / 10,
    totalReviews,
    ratingDistribution: distribution,
  };
}

// ✅ Mark review as helpful
export async function markReviewHelpful(reviewId: string): Promise<boolean> {
  const { data: review, error: fetchError } = await supabase
    .from("reviews")
    .select("helpful_count")
    .eq("id", reviewId)
    .single();

  if (fetchError || !review) return false;

  const { error } = await supabase
    .from("reviews")
    .update({ helpful_count: review.helpful_count + 1 })
    .eq("id", reviewId);

  return !error;
}

// ✅ Admin: Approve review
export async function approveReview(reviewId: string): Promise<boolean> {
  const { error } = await supabase
    .from("reviews")
    .update({ is_approved: true })
    .eq("id", reviewId);

  return !error;
}

// ✅ Admin: Delete review
export async function deleteReview(reviewId: string): Promise<boolean> {
  const { error } = await supabase.from("reviews").delete().eq("id", reviewId);

  return !error;
}

// lib/reviews.ts - THÊM VÀO CUỐI FILE

// ✅ User xóa review của mình
export async function deleteMyReview(
  reviewId: string,
  userEmail: string,
): Promise<boolean> {
  try {
    // Kiểm tra review có thuộc về user không
    const { data: review, error: fetchError } = await supabase
      .from("reviews")
      .select("user_email")
      .eq("id", reviewId)
      .single();

    if (fetchError || !review) {
      console.error("Review not found");
      return false;
    }

    // Chỉ cho phép xóa nếu email khớp
    if (review.user_email !== userEmail) {
      console.error("Unauthorized: Email does not match");
      return false;
    }

    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", reviewId);

    return !error;
  } catch (error) {
    console.error("Error deleting review:", error);
    return false;
  }
}

// ✅ Admin xóa bất kỳ review nào
export async function adminDeleteReview(reviewId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", reviewId);

    return !error;
  } catch (error) {
    console.error("Error deleting review:", error);
    return false;
  }
}
