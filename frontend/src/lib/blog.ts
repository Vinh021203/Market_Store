import { supabase } from "./supabase";
import { BlogPost, BlogCategory, BlogComment } from "@/types/blog";

export const normalizePost = (post: any): BlogPost => ({
  id: post.id,
  title: post.title,
  slug: post.slug,
  excerpt: post.excerpt,
  content: post.content,
  featuredImage: post.featured_image,
  publishedAt: post.published_at,
  updatedAt: post.updated_at,
  isFeatured: post.is_featured,
  isPublished: post.is_published,
  readTime: post.read_time,
  views: post.views || 0,
  likes: post.likes || 0,
  tags: post.tags || [],
  author: {
    id: post.author?.id || "",
    name: post.author?.name || "Tác giả ẩn danh",
    avatar: post.author?.avatar || "/default-avatar.png",
    bio: "",
  },
  category: {
    id: post.category?.id || "",
    name: post.category?.name || "Không rõ",
    slug: post.category?.slug || "",
    description: post.category?.description || "",
    color: post.category?.color || "blue",
    postCount: post.category?.post_count || 0,
  },
  seo: {
    metaTitle: post.seo_meta_title,
    metaDescription: post.seo_meta_description,
    keywords: post.seo_keywords || [],
  },
});

export const normalizeCategory = (category: any): BlogCategory => ({
  id: category.id,
  name: category.name,
  slug: category.slug,
  description: category.description,
  color: category.color || "blue",
  postCount: category.post_count || 0,
});

export const getAllBlogPosts = async (): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    .from("blog_posts")
    .select(`*, category:blog_categories(*), author:profiles(id, name, avatar)`)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching all blog posts:", error.message);
    return [];
  }

  return (data || []).map(normalizePost);
};

export const getAllPublishedPosts = async (): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    .from("blog_posts")
    .select(`*, category:blog_categories(*), author:profiles(id, name, avatar)`)
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching blog posts:", error.message);
    return [];
  }

  return (data || []).map(normalizePost);
};

export const getPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  const { data, error } = await supabase
    .from("blog_posts")
    .select(`*, category:blog_categories(*), author:profiles(id, name, avatar)`)
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error) {
    console.error("Error fetching blog post by slug:", error.message);
    return null;
  }

  return normalizePost(data);
};

export const getPostById = async (id: string): Promise<BlogPost | null> => {
  const { data, error } = await supabase
    .from("blog_posts")
    .select(`*, category:blog_categories(*), author:profiles(id, name, avatar)`)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching blog post by id:", error.message);
    return null;
  }

  return normalizePost(data);
};

export const getFeaturedPosts = async (): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    .from("blog_posts")
    .select(`*, category:blog_categories(*), author:profiles(id, name, avatar)`)
    .eq("is_published", true)
    .eq("is_featured", true)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching featured posts:", error.message);
    return [];
  }

  return (data || []).map(normalizePost);
};

export const getAllCategories = async (): Promise<BlogCategory[]> => {
  const { data, error } = await supabase
    .from("blog_categories")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching blog categories:", error.message);
    return [];
  }

  return (data || []).map(normalizeCategory);
};

export const getCategoryBySlug = async (slug: string): Promise<BlogCategory | null> => {
  const { data, error } = await supabase
    .from("blog_categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching category by slug:", error.message);
    return null;
  }

  return normalizeCategory(data);
};

export const getCommentsByPostId = async (postId: string): Promise<BlogComment[]> => {
  const { data, error } = await supabase
    .from("blog_comments")
    .select("*")
    .eq("post_id", postId)
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching comments:", error.message);
    return [];
  }

  return data || [];
};

export const updatePostStatus = async (id: string, isPublished: boolean): Promise<boolean> => {
  const { error } = await supabase
    .from("blog_posts")
    .update({
      is_published: isPublished,
      published_at: isPublished ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Error updating post status:", error.message);
    return false;
  }

  return true;
};

export const deleteBlogPost = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from("blog_posts")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting blog post:", error.message);
    return false;
  }

  return true;
};

export const getPostsByCategory = async (categoryId: string): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    .from("blog_posts")
    .select(`*, category:blog_categories(*), author:profiles(id, name, avatar)`)
    .eq("category_id", categoryId)
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching posts by category:", error.message);
    return [];
  }

  return (data || []).map(normalizePost);
};

export const searchPosts = async (query: string): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    .from("blog_posts")
    .select(`*, category:blog_categories(*), author:profiles(id, name, avatar)`)
    .eq("is_published", true)
    .or(`title.ilike.%${query}%, excerpt.ilike.%${query}%, content.ilike.%${query}%`)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error searching posts:", error.message);
    return [];
  }

  return (data || []).map(normalizePost);
};

export const incrementPostViews = async (id: string): Promise<boolean> => {
  const { error } = await supabase.rpc("increment_post_views", { post_id: id });

  if (error) {
    console.error("Error incrementing post views:", error.message);
    return false;
  }

  return true;
};

export const incrementPostLikes = async (id: string): Promise<boolean> => {
  const { error } = await supabase.rpc("increment_post_likes", { post_id: id });

  if (error) {
    console.error("Error incrementing post likes:", error.message);
    return false;
  }

  return true;
};

export const updatePostFeaturedStatus = async (id: string, isFeatured: boolean): Promise<boolean> => {
  const { error } = await supabase
    .from("blog_posts")
    .update({
      is_featured: isFeatured,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Error updating post featured status:", error.message);
    return false;
  }

  return true;
};

export const createBlogPost = async (postData: Partial<BlogPost>): Promise<BlogPost | null> => {
  const { data, error } = await supabase
    .from("blog_posts")
    .insert([{
      title: postData.title,
      slug: postData.slug,
      excerpt: postData.excerpt,
      content: postData.content,
      featured_image: postData.featuredImage,
      category_id: postData.category?.id,
      tags: postData.tags,
      is_published: postData.isPublished,
      is_featured: postData.isFeatured,
      read_time: postData.readTime,
      seo_meta_title: postData.seo?.metaTitle,
      seo_meta_description: postData.seo?.metaDescription,
      seo_keywords: postData.seo?.keywords,
      published_at: postData.isPublished ? new Date().toISOString() : null,
    }])
    .select(`*, category:blog_categories(*), author:profiles(id, name, avatar)`)
    .single();

  if (error) {
    console.error("Error creating blog post:", error.message);
    return null;
  }

  return normalizePost(data);
};

export const updateBlogPost = async (id: string, postData: Partial<BlogPost>): Promise<boolean> => {
  const { error } = await supabase
    .from("blog_posts")
    .update({
      title: postData.title,
      slug: postData.slug,
      excerpt: postData.excerpt,
      content: postData.content,
      featured_image: postData.featuredImage,
      category_id: postData.category?.id,
      tags: postData.tags,
      is_published: postData.isPublished,
      is_featured: postData.isFeatured,
      read_time: postData.readTime,
      seo_meta_title: postData.seo?.metaTitle,
      seo_meta_description: postData.seo?.metaDescription,
      seo_keywords: postData.seo?.keywords,
      updated_at: new Date().toISOString(),
      published_at: postData.isPublished ? new Date().toISOString() : null,
    })
    .eq("id", id);

  if (error) {
    console.error("Error updating blog post:", error.message);
    return false;
  }

  return true;
};

export const createCategory = async (categoryData: Partial<BlogCategory>): Promise<BlogCategory | null> => {
  const { data, error } = await supabase
    .from("blog_categories")
    .insert([{
      name: categoryData.name,
      slug: categoryData.slug,
      description: categoryData.description,
      color: categoryData.color,
      post_count: 0,
    }])
    .select()
    .single();

  if (error) {
    console.error("Error creating category:", error.message);
    return null;
  }

  return normalizeCategory(data);
};

export const updateCategory = async (id: string, categoryData: Partial<BlogCategory>): Promise<boolean> => {
  const { error } = await supabase
    .from("blog_categories")
    .update({
      name: categoryData.name,
      slug: categoryData.slug,
      description: categoryData.description,
      color: categoryData.color,
    })
    .eq("id", id);

  if (error) {
    console.error("Error updating category:", error.message);
    return false;
  }

  return true;
};

export const deleteCategory = async (id: string): Promise<boolean> => {
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id")
    .eq("category_id", id)
    .limit(1);

  if (posts && posts.length > 0) {
    throw new Error("Không thể xóa danh mục đang có bài viết");
  }

  const { error } = await supabase
    .from("blog_categories")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting category:", error.message);
    return false;
  }

  return true;
};

export const updateCategoryPostCount = async (): Promise<void> => {
  const { error } = await supabase.rpc('update_category_post_counts');
  
  if (error) {
    console.error("Error updating category post counts:", error.message);
  }
};

// lib/blog.ts
export const getBlogPostsStats = async () => {
  // Lấy tổng số bài viết
  const { count: totalCount, error: totalError } = await supabase
    .from("blog_posts")
    .select("*", { count: "exact", head: true });

  // Lấy số bài viết đã xuất bản
  const { count: publishedCount, error: publishedError } = await supabase
    .from("blog_posts")
    .select("*", { count: "exact", head: true })
    .eq("is_published", true);

  // Lấy số bài viết nháp
  const { count: draftCount, error: draftError } = await supabase
    .from("blog_posts")
    .select("*", { count: "exact", head: true })
    .eq("is_published", false);

  if (totalError || publishedError || draftError) {
    console.error("Error fetching stats:", { totalError, publishedError, draftError });
    return {
      total: 0,
      published: 0,
      draft: 0,
    };
  }

  return {
    total: totalCount || 0,
    published: publishedCount || 0,
    draft: draftCount || 0,
  };
};

// Cập nhật category post count
export const updateCategoryPostCounts = async (): Promise<void> => {
  const { error } = await supabase.rpc('update_category_post_counts');
  
  if (error) {
    console.error("Error updating category post counts:", error.message);
  }
};
