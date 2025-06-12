import React from "react";
import { MessageSquare } from "lucide-react";

interface Comment {
  id: string;
  author_name: string;
  author_avatar?: string;
  content: string;
  created_at: string;
}

export const CommentList: React.FC<{ comments: Comment[] }> = ({ comments }) => {
  if (!comments.length) return <p className="text-muted-foreground">Chưa có bình luận nào.</p>;

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <div key={comment.id} className="flex items-start space-x-4">
          <img
            src={comment.author_avatar || `https://i.pravatar.cc/100?u=${comment.author_name}`}
            alt={comment.author_name}
            className="object-cover w-10 h-10 rounded-full"
          />
          <div>
            <div className="font-semibold">{comment.author_name}</div>
            <div className="text-sm text-muted-foreground">
              {new Date(comment.created_at).toLocaleString("vi-VN")}
            </div>
            <p className="mt-1">{comment.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
