import React, { useState, useEffect } from "react";
import {
  MessageCircle,
  Send,
  User,
  Clock,
  Trash2,
  Edit2,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  getCommentsByPostId,
  addComment,
  deleteMyComment,
  adminDeleteComment,
  adminEditComment,
} from "@/lib/comments";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface BlogCommentSectionProps {
  postId: string;
}

export const BlogCommentSection: React.FC<BlogCommentSectionProps> = ({
  postId,
}) => {
  const { user } = useAuth();

  const [comments, setComments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isWriting, setIsWriting] = useState(false);

  // Form state
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [content, setContent] = useState("");

  // Edit state
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  // Delete confirmation
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    loadComments();
  }, [postId]);

  useEffect(() => {
    if (user) {
      setAuthorName(user.name || "");
      setAuthorEmail(user.email || "");
    }
  }, [user]);

  const loadComments = async () => {
    setIsLoading(true);
    try {
      const data = await getCommentsByPostId(postId);
      setComments(data);
    } catch (error) {
      console.error("Error loading comments:", error);
      toast({
        title: "Lỗi khi tải bình luận",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!authorName.trim() || !authorEmail.trim() || !content.trim()) {
      toast({
        title: "Vui lòng nhập đầy đủ thông tin",
        variant: "destructive",
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authorEmail)) {
      toast({
        title: "Email không hợp lệ",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await addComment({
        postId,
        author_name: authorName,
        author_email: authorEmail,
        author_avatar: user?.avatar || "",
        content,
      });

      toast({
        title: "✅ Gửi bình luận thành công!",
        description: "Bình luận của bạn đã được thêm.",
      });

      await loadComments();

      if (!user) {
        setAuthorName("");
        setAuthorEmail("");
      }
      setContent("");
      setIsWriting(false);
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast({
        title: "Lỗi khi gửi bình luận",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Handle Delete (User or Admin)
  const handleDelete = async (commentId: string, authorEmail: string) => {
    try {
      let success = false;

      if (user?.role === "admin") {
        // Admin can delete any comment
        success = await adminDeleteComment(commentId);
      } else if (user?.email === authorEmail) {
        // User can only delete their own comment
        success = await deleteMyComment(commentId, user.email);
      } else {
        toast({
          title: "Không có quyền xóa bình luận này",
          variant: "destructive",
        });
        return;
      }

      if (success) {
        toast({
          title: "✅ Đã xóa bình luận!",
        });
        await loadComments();
      } else {
        toast({
          title: "Lỗi khi xóa bình luận",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast({
        title: "Lỗi khi xóa bình luận",
        variant: "destructive",
      });
    } finally {
      setDeletingCommentId(null);
    }
  };

  // ✅ Handle Edit (Admin only)
  const handleEdit = async (commentId: string) => {
    if (!editContent.trim()) {
      toast({
        title: "Nội dung không được để trống",
        variant: "destructive",
      });
      return;
    }

    try {
      const success = await adminEditComment(commentId, editContent);

      if (success) {
        toast({
          title: "✅ Đã cập nhật bình luận!",
        });
        setEditingCommentId(null);
        setEditContent("");
        await loadComments();
      } else {
        toast({
          title: "Lỗi khi cập nhật bình luận",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error editing comment:", error);
      toast({
        title: "Lỗi khi cập nhật bình luận",
        variant: "destructive",
      });
    }
  };

  // ✅ Check if user can delete comment
  const canDeleteComment = (authorEmail: string) => {
    return user?.role === "admin" || user?.email === authorEmail;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Hôm nay";
    } else if (diffDays === 1) {
      return "Hôm qua";
    } else if (diffDays < 7) {
      return `${diffDays} ngày trước`;
    } else {
      return date.toLocaleDateString("vi-VN");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-pink-600" />
          <h3 className="text-xl font-bold">Bình luận ({comments.length})</h3>
        </div>

        {!isWriting && (
          <Button
            onClick={() => setIsWriting(true)}
            className="bg-gradient-to-r from-pink-500 to-orange-500 text-white"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Viết bình luận
          </Button>
        )}
      </div>

      {/* Comment Form - GIỮ NGUYÊN */}
      {isWriting && (
        <Card className="p-6 bg-gradient-to-br from-pink-50 to-orange-50">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h4 className="font-bold text-lg">Viết bình luận của bạn</h4>

            <div>
              <label className="block text-sm font-medium mb-2">
                Tên của bạn *
              </label>
              <Input
                placeholder="Nhập tên của bạn"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                required
                disabled={!!user}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
              <Input
                type="email"
                placeholder="email@example.com"
                value={authorEmail}
                onChange={(e) => setAuthorEmail(e.target.value)}
                required
                disabled={!!user}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Nội dung *
              </label>
              <Textarea
                placeholder="Chia sẻ suy nghĩ của bạn..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                required
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-pink-500 to-orange-500 text-white"
              >
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? "Đang gửi..." : "Gửi bình luận"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsWriting(false)}
              >
                Hủy
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Đang tải bình luận...</p>
          </div>
        ) : comments.length === 0 ? (
          <Card className="p-8 text-center">
            <MessageCircle className="w-12 h-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-600">Chưa có bình luận nào</p>
            <p className="text-sm text-gray-500 mt-1">
              Hãy là người đầu tiên bình luận bài viết này!
            </p>
          </Card>
        ) : (
          comments.map((comment) => (
            <Card key={comment.id} className="p-6">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage src={comment.author_avatar} />
                  <AvatarFallback>
                    <User className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{comment.author_name}</h4>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{formatDate(comment.created_at)}</span>
                      </div>

                      {/* ✅ ACTIONS DROPDOWN */}
                      {(user?.role === "admin" ||
                        user?.email === comment.author_email) && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {/* Admin can edit */}
                            {user?.role === "admin" && (
                              <DropdownMenuItem
                                onClick={() => {
                                  setEditingCommentId(comment.id);
                                  setEditContent(comment.content);
                                }}
                              >
                                <Edit2 className="w-4 h-4 mr-2" />
                                Sửa
                              </DropdownMenuItem>
                            )}

                            {/* Admin or owner can delete */}
                            {canDeleteComment(comment.author_email) && (
                              <DropdownMenuItem
                                onClick={() => setDeletingCommentId(comment.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Xóa
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>

                  {/* ✅ EDIT MODE */}
                  {editingCommentId === comment.id ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleEdit(comment.id)}
                        >
                          Lưu
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingCommentId(null);
                            setEditContent("");
                          }}
                        >
                          Hủy
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* ✅ DELETE CONFIRMATION DIALOG */}
      <AlertDialog
        open={!!deletingCommentId}
        onOpenChange={() => setDeletingCommentId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa bình luận?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Bình luận sẽ bị xóa vĩnh viễn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                const comment = comments.find(
                  (c) => c.id === deletingCommentId,
                );
                if (comment) {
                  handleDelete(comment.id, comment.author_email);
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
