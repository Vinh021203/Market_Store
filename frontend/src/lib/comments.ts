import { supabase } from "@/lib/supabase";

export async function getCommentsByPostId(postId: string) {
  const { data, error } = await supabase
    .from("blog_comments")
    .select("*")
    .eq("post_id", postId)
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function addComment({
  postId,
  author_name,
  author_email,
  author_avatar,
  content,
}: {
  postId: string;
  author_name: string;
  author_email: string;
  author_avatar?: string;
  content: string;
}) {
  const { data, error } = await supabase.from("blog_comments").insert([
    {
      post_id: postId,
      author_name,
      author_email,
      author_avatar,
      content,
      is_approved: true,
    },
  ]);

  if (error) throw error;
  return data;
}

// ✅ USER: Xóa comment của mình (kiểm tra email)
export async function deleteMyComment(
  commentId: string,
  userEmail: string,
): Promise<boolean> {
  try {
    // Kiểm tra comment có thuộc về user không
    const { data: comment, error: fetchError } = await supabase
      .from("blog_comments")
      .select("author_email")
      .eq("id", commentId)
      .single();

    if (fetchError || !comment) {
      console.error("Comment not found");
      return false;
    }

    // Chỉ cho phép xóa nếu email khớp
    if (comment.author_email !== userEmail) {
      console.error("Unauthorized: Email does not match");
      return false;
    }

    const { error } = await supabase
      .from("blog_comments")
      .delete()
      .eq("id", commentId);

    return !error;
  } catch (error) {
    console.error("Error deleting comment:", error);
    return false;
  }
}

// ✅ ADMIN: Xóa bất kỳ comment nào
export async function adminDeleteComment(commentId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("blog_comments")
      .delete()
      .eq("id", commentId);

    return !error;
  } catch (error) {
    console.error("Error deleting comment:", error);
    return false;
  }
}

// ✅ ADMIN: Sửa comment
export async function adminEditComment(
  commentId: string,
  newContent: string,
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("blog_comments")
      .update({
        content: newContent,
        updated_at: new Date().toISOString(),
      })
      .eq("id", commentId);

    return !error;
  } catch (error) {
    console.error("Error editing comment:", error);
    return false;
  }
}

// ✅ ADMIN: Toggle approve status
export async function adminToggleApproval(
  commentId: string,
  isApproved: boolean,
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("blog_comments")
      .update({ is_approved: isApproved })
      .eq("id", commentId);

    return !error;
  } catch (error) {
    console.error("Error toggling approval:", error);
    return false;
  }
}
