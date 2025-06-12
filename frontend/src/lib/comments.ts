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
  author_avatar,
  content,
}: {
  postId: string;
  author_name: string;
  author_avatar?: string;
  content: string;
}) {
  const { data, error } = await supabase.from("blog_comments").insert([
    {
      post_id: postId,
      author_name,
      author_avatar,
      content,
      is_approved: true, // hoặc false nếu bạn muốn duyệt trước
    },
  ]);

  if (error) throw error;
  return data;
}