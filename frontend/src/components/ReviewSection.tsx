// components/ReviewSection.tsx
import React, { useState, useEffect } from "react";
import { Star, ThumbsUp, MessageCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  getProductReviews,
  getReviewStats,
  createReview,
  markReviewHelpful,
  deleteMyReview,
  adminDeleteReview,
  type Review,
  type ReviewStats,
} from "@/lib/reviews";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { isAdmin } from "@/lib/auth";

interface ReviewSectionProps {
  productId: string;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({ productId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);

  // Form state
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadReviews();
    loadStats();
  }, [productId]);

  // ✅ Auto-fill user info nếu đã login
  useEffect(() => {
    if (user) {
      setUserName(user.name || "");
      setUserEmail(user.email || "");
    }
  }, [user]);

  const loadReviews = async () => {
    const data = await getProductReviews(productId);
    setReviews(data);
  };

  const loadStats = async () => {
    const data = await getReviewStats(productId);
    setStats(data);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast({
        title: "Vui lòng chọn số sao",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await createReview({
        productId,
        userName,
        userEmail,
        rating,
        title,
        comment,
      });

      toast({
        title: "✅ Gửi đánh giá thành công!",
        description: "Đánh giá của bạn hiển thị ngay!",
      });

      await loadReviews();
      await loadStats();

      // Reset form
      setRating(0);
      if (!user) {
        setUserName("");
        setUserEmail("");
      }
      setTitle("");
      setComment("");
      setIsWritingReview(false);
    } catch (error) {
      toast({
        title: "Lỗi khi gửi đánh giá",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHelpful = async (reviewId: string) => {
    const success = await markReviewHelpful(reviewId);
    if (success) {
      loadReviews();
      toast({ title: "Cảm ơn phản hồi của bạn!" });
    }
  };

  // ✅ XÓA REVIEW
  const handleDeleteReview = async (reviewId: string, reviewEmail: string) => {
    setDeletingReviewId(reviewId);
    try {
      let success = false;

      // ✅ Admin có thể xóa bất kỳ review nào
      if (user && isAdmin(user)) {
        success = await adminDeleteReview(reviewId);
      }
      // ✅ User chỉ xóa được review của mình
      else if (user && user.email === reviewEmail) {
        success = await deleteMyReview(reviewId, reviewEmail);
      }
      // ✅ Guest xóa bằng email (không cần login)
      else if (!user && userEmail === reviewEmail) {
        success = await deleteMyReview(reviewId, reviewEmail);
      } else {
        toast({
          title: "Không có quyền xóa đánh giá này",
          variant: "destructive",
        });
        return;
      }

      if (success) {
        toast({
          title: "✅ Đã xóa đánh giá!",
        });
        await loadReviews();
        await loadStats();
      } else {
        toast({
          title: "Lỗi khi xóa đánh giá",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Lỗi khi xóa đánh giá",
        variant: "destructive",
      });
    } finally {
      setDeletingReviewId(null);
    }
  };

  // ✅ KIỂM TRA QUYỀN XÓA
  const canDeleteReview = (review: Review): boolean => {
    // Admin có thể xóa mọi review
    if (user && isAdmin(user)) return true;

    // User có thể xóa review của mình
    if (user && user.email === review.userEmail) return true;

    // Guest có thể xóa bằng email (nếu đã nhập email trong form)
    if (!user && userEmail && userEmail === review.userEmail) return true;

    return false;
  };

  if (!stats) return null;

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Average Rating */}
        <div className="text-center p-6 bg-gradient-to-br from-pink-50 to-orange-50 rounded-xl">
          <div className="text-5xl font-bold text-gray-900 mb-2">
            {stats.averageRating.toFixed(1)}
          </div>
          <div className="flex justify-center mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-6 h-6 ${
                  star <= Math.round(stats.averageRating)
                    ? "text-yellow-500 fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <p className="text-gray-600">{stats.totalReviews} đánh giá</p>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = stats.ratingDistribution[star as 1 | 2 | 3 | 4 | 5];
            const percentage =
              stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-2">
                <span className="text-sm font-medium w-8">{star} ⭐</span>
                <Progress value={percentage} className="flex-1" />
                <span className="text-sm text-gray-600 w-12">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Write Review Button */}
      {!isWritingReview && (
        <Button
          onClick={() => setIsWritingReview(true)}
          className="bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-xl"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Viết đánh giá
        </Button>
      )}

      {/* Review Form */}
      {isWritingReview && (
        <form
          onSubmit={handleSubmitReview}
          className="space-y-4 p-6 bg-gradient-to-br from-pink-50 to-orange-50 rounded-xl"
        >
          <h3 className="text-xl font-bold">Viết đánh giá của bạn</h3>

          {/* Star Rating */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Đánh giá của bạn
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={`w-10 h-10 cursor-pointer transition-colors ${
                      star <= (hoveredRating || rating)
                        ? "text-yellow-500 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <Input
            placeholder="Tên của bạn *"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
            disabled={!!user} // Disable nếu đã login
          />

          <Input
            type="email"
            placeholder="Email *"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            required
            disabled={!!user} // Disable nếu đã login
          />

          <Input
            placeholder="Tiêu đề (tùy chọn)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Textarea
            placeholder="Chia sẻ trải nghiệm của bạn... *"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={5}
            required
          />

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-pink-500 to-orange-500 text-white"
            >
              {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsWritingReview(false)}
            >
              Hủy
            </Button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <Card className="p-8 text-center">
            <Star className="w-12 h-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-600">Chưa có đánh giá nào</p>
            <p className="text-sm text-gray-500 mt-1">
              Hãy là người đầu tiên đánh giá sản phẩm này!
            </p>
          </Card>
        ) : (
          reviews.map((review) => (
            <Card key={review.id} className="p-6">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{review.userName}</h4>
                        {review.isVerifiedPurchase && (
                          <Badge variant="secondary" className="text-xs">
                            ✓ Đã mua hàng
                          </Badge>
                        )}
                        {/* ✅ ADMIN BADGE */}
                        {user && isAdmin(user) && (
                          <Badge className="text-xs bg-red-100 text-red-700">
                            Admin
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating
                                ? "text-yellow-500 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="text-sm text-gray-600">
                          {new Date(review.createdAt).toLocaleDateString(
                            "vi-VN",
                          )}
                        </span>
                      </div>
                    </div>

                    {/* ✅ NÚT XÓA - CHỈ HIỂN THỊ NẾU CÓ QUYỀN */}
                    {canDeleteReview(review) && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Xóa đánh giá?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Bạn có chắc chắn muốn xóa đánh giá này? Hành động
                              này không thể hoàn tác.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                handleDeleteReview(review.id, review.userEmail)
                              }
                              className="bg-red-600 hover:bg-red-700"
                              disabled={deletingReviewId === review.id}
                            >
                              {deletingReviewId === review.id
                                ? "Đang xóa..."
                                : "Xóa"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>

                  {review.title && (
                    <h5 className="font-semibold mb-2">{review.title}</h5>
                  )}
                  <p className="text-gray-700 mb-3 whitespace-pre-wrap">
                    {review.comment}
                  </p>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleHelpful(review.id)}
                  >
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    Hữu ích ({review.helpfulCount})
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
