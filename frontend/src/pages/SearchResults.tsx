import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/lib/supabase";
import { Product, FilterOptions } from "@/types";
import { Search, Filter, X, Package, BookOpen, Loader2 } from "lucide-react";

const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<FilterOptions>({
    search: query,
    sortBy: "newest",
    category: undefined,
    tags: [],
    priceRange: undefined,
  });

  // Trong SearchResults.tsx - Cập nhật phần fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        let query = supabase.from("products").select("*").eq("is_active", true);

        // Apply search filter - FIX: Bỏ tags search trong database query
        if (filters.search) {
          query = query.or(
            `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`,
          );
        }

        // Apply category filter
        if (filters.category && filters.category !== "all") {
          query = query.eq("category", filters.category);
        }

        // Apply price range filter
        if (filters.priceRange) {
          const [min, max] = filters.priceRange;
          query = query.gte("price", min).lte("price", max);
        }

        // Apply sorting
        switch (filters.sortBy) {
          case "newest":
            query = query.order("created_at", { ascending: false });
            break;
          case "oldest":
            query = query.order("created_at", { ascending: true });
            break;
          case "price_low":
            query = query.order("price", { ascending: true });
            break;
          case "price_high":
            query = query.order("price", { ascending: false });
            break;
          case "popular":
            query = query.order("review_count", { ascending: false });
            break;
          case "rating":
            query = query.order("rating", { ascending: false });
            break;
          default:
            query = query.order("created_at", { ascending: false });
        }

        const { data, error } = await query;

        if (error) {
          console.error("Supabase error:", error);
          throw error;
        }

        // Client-side filtering cho search và tags
        let filteredData = data || [];

        // Additional search filtering (bao gồm tags)
        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          filteredData = filteredData.filter((product) => {
            const titleMatch = product.title
              ?.toLowerCase()
              .includes(searchTerm);
            const descMatch = product.description
              ?.toLowerCase()
              .includes(searchTerm);
            const tagMatch = product.tags?.some((tag: string) =>
              tag.toLowerCase().includes(searchTerm),
            );
            return titleMatch || descMatch || tagMatch;
          });
        }

        // Tag filtering
        if (filters.tags && filters.tags.length > 0) {
          filteredData = filteredData.filter((product) =>
            filters.tags!.some(
              (tag) => product.tags && product.tags.includes(tag),
            ),
          );
        }

        // Map data để match với Product interface
        const mappedProducts = filteredData.map((item: any) => ({
          ...item,
          originalPrice: item.original_price,
          isFeatured: item.is_featured,
          isActive: item.is_active,
          downloadUrl: item.download_url,
          previewUrl: item.preview_url,
          reviewCount: item.review_count,
          fileSize: item.file_size,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
          tags: item.tags || [], // Ensure tags is always an array
        }));

        setProducts(mappedProducts);
      } catch (err: any) {
        console.error("Error fetching products:", err);
        setError(
          err.code === "42P01"
            ? "Bảng sản phẩm không tồn tại. Vui lòng liên hệ admin."
            : "Có lỗi xảy ra khi tải sản phẩm. Vui lòng thử lại.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  // Update search when URL query changes
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      search: query,
    }));
  }, [query]);

  const handleCategoryFilter = (category: "template" | "ebook" | "all") => {
    setFilters((prev) => ({
      ...prev,
      category: category === "all" ? undefined : category,
    }));
  };

  const handleSortChange = (sortBy: string) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: sortBy as FilterOptions["sortBy"],
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: query,
      sortBy: "newest",
      category: undefined,
      tags: [],
      priceRange: undefined,
    });
  };

  const templateCount = products.filter(
    (p) => p.category === "template",
  ).length;
  const ebookCount = products.filter((p) => p.category === "ebook").length;

  if (loading) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 mr-2 animate-spin" />
          <span>Đang tìm kiếm sản phẩm...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <Card className="py-12 text-center">
          <CardContent>
            <div className="mb-4 text-red-500">⚠️</div>
            <h3 className="mb-2 text-lg font-semibold">Có lỗi xảy ra</h3>
            <p className="mb-4 text-muted-foreground">{error}</p>
            <Button onClick={() => window.location.reload()}>Thử lại</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      {/* Search Header */}
      <div className="mb-8 space-y-4">
        <div className="flex items-center space-x-2">
          <Search className="w-6 h-6 text-primary" />
          <h1 className="text-3xl font-bold">Kết quả tìm kiếm</h1>
        </div>
        {query && (
          <p className="text-lg text-muted-foreground">
            Kết quả cho: "
            <span className="font-medium text-foreground">{query}</span>"
          </p>
        )}
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={!filters.category ? "default" : "outline"}
            size="sm"
            onClick={() => handleCategoryFilter("all")}
          >
            Tất cả ({products.length})
          </Button>
          <Button
            variant={filters.category === "template" ? "default" : "outline"}
            size="sm"
            onClick={() => handleCategoryFilter("template")}
          >
            <Package className="w-4 h-4 mr-1" />
            Templates ({templateCount})
          </Button>
          <Button
            variant={filters.category === "ebook" ? "default" : "outline"}
            size="sm"
            onClick={() => handleCategoryFilter("ebook")}
          >
            <BookOpen className="w-4 h-4 mr-1" />
            E-books ({ebookCount})
          </Button>

          {/* Sort Dropdown */}
          <div className="ml-auto">
            <select
              value={filters.sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="price_low">Giá thấp đến cao</option>
              <option value="price_high">Giá cao đến thấp</option>
              <option value="popular">Phổ biến nhất</option>
              <option value="rating">Đánh giá cao nhất</option>
            </select>
          </div>
        </div>

        {/* Active Filters */}
        {(filters.category || filters.tags?.length || filters.priceRange) && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">Đang lọc:</span>
            {filters.category && (
              <Badge variant="secondary">
                {filters.category === "template" ? "Templates" : "E-books"}
                <button
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, category: undefined }))
                  }
                  className="ml-1 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            {filters.tags?.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
                <button
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      tags: prev.tags?.filter((t) => t !== tag) || [],
                    }))
                  }
                  className="ml-1 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
            {filters.priceRange && (
              <Badge variant="secondary">
                ${filters.priceRange[0]} - ${filters.priceRange[1]}
                <button
                  onClick={() =>
                    setFilters((prev) => ({ ...prev, priceRange: undefined }))
                  }
                  className="ml-1 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="w-4 h-4 mr-1" />
              Xóa bộ lọc
            </Button>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            Hiển thị {products.length} kết quả
            {query && ` cho "${query}"`}
          </p>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <Card className="py-12 text-center">
            <CardContent>
              <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">
                Không tìm thấy kết quả nào
              </h3>
              <p className="mb-4 text-muted-foreground">
                {query
                  ? `Không tìm thấy sản phẩm nào cho "${query}". Thử tìm kiếm với từ khóa khác.`
                  : "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm."}
              </p>
              <div className="space-y-2">
                <Button onClick={clearFilters}>Xóa bộ lọc</Button>
                <div className="text-sm text-muted-foreground">
                  Hoặc khám phá:
                </div>
                <div className="flex justify-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCategoryFilter("template")}
                  >
                    Templates
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCategoryFilter("ebook")}
                  >
                    E-books
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Search Suggestions */}
      {products.length === 0 && query && (
        <div className="mt-8">
          <h3 className="mb-4 text-lg font-semibold">Có thể bạn quan tâm:</h3>
          <div className="flex flex-wrap gap-2">
            {[
              "react",
              "vue",
              "nextjs",
              "tailwind",
              "dashboard",
              "ecommerce",
              "landing",
              "admin",
              "portfolio",
              "blog",
            ].map((suggestion) => (
              <Button
                key={suggestion}
                variant="outline"
                size="sm"
                onClick={() =>
                  (window.location.href = `/search?q=${suggestion}`)
                }
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
