export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    bio?: string;
  };
  category: BlogCategory;
  tags: string[];
  publishedAt: string;
  updatedAt: string;
  isPublished: boolean;
  isFeatured: boolean;
  readTime: number;
  views: number;
  likes: number;
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color: string;
  postCount: number;
}

export interface BlogComment {
  id: string;
  postId: string;
  author: {
    name: string;
    email: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
  isApproved: boolean;
  parentId?: string;
  replies?: BlogComment[];
}
