import { Product } from "@/types";

export function toDbProduct(product: Partial<Product>) {
  return {
    title: product.title,
    description: product.description,
    price: product.price,
    original_price: product.originalPrice,
    category: product.category,
    tags: product.tags,
    image: product.image,
    images: product.images,
    download_url: product.downloadUrl,
    preview_url: product.previewUrl,
    rating: product.rating,
    review_count: product.reviewCount,
    is_featured: product.isFeatured,
    is_active: product.isActive,
    author: product.author,
    difficulty: product.difficulty,
    technologies: product.technologies,
    file_size: product.fileSize,
    format: product.format,
    pages: product.pages,
    // created_at và updated_at sẽ được gán bên ngoài
  };
}
