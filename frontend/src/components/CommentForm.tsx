import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { addComment } from "@/lib/comments";
import { toast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";

export const CommentForm: React.FC<{ postId: string; onSuccess?: () => void }> = ({ postId, onSuccess }) => {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !content) {
      toast({ title: "Thiếu thông tin", description: "Hãy nhập tên và bình luận." });
      return;
    }

    setLoading(true);
    try {
      await addComment({
        postId,
        author_name: name,
        author_avatar: avatar,
        content,
      });
      toast({ title: "Bình luận đã gửi", description: "Cảm ơn bạn đã chia sẻ!" });
      setName("");
      setAvatar("");
      setContent("");
      onSuccess?.();
    } catch (err) {
      toast({ title: "Lỗi", description: "Không gửi được bình luận." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 mt-10 bg-white border shadow-sm rounded-2xl border-border dark:bg-slate-900">
      <h3 className="mb-4 text-xl font-semibold">Để lại bình luận</h3>
      <div className="space-y-4">
        <Input
          placeholder="Tên của bạn"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          placeholder="URL ảnh đại diện (tuỳ chọn)"
          value={avatar}
          onChange={(e) => setAvatar(e.target.value)}
        />
        <Textarea
          placeholder="Nhập bình luận..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
        />
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Đang gửi..." : "Gửi bình luận"}
        </Button>
      </div>
    </Card>
  );
};
