import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ProductCard from "@/components/ProductCard";
import { filterProducts, getAllTags } from "@/lib/products";
import { getProductsByCategory } from "@/lib/products";
import { Product } from "@/types"; // Đảm bảo đã import kiểu dữ liệu
import { FilterOptions } from "@/types";
import { useCart } from "@/contexts/CartContext";
import { Search, Filter, X, Package } from "lucide-react";

const Templates: React.FC = () => {
  const [filters, setFilters] = useState<FilterOptions>({
    category: "template",
    sortBy: "newest",
    search: "",
    tags: [],
    priceRange: undefined,
  });

  const [searchInput, setSearchInput] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getProductsByCategory("template");
      setProducts(data);
      setLoading(false);
    };

    fetchData();
  }, []);

  const templateTags = useMemo(() => {
    const tags = new Set<string>();
    products.forEach((p) => p.tags.forEach((tag) => tags.add(tag)));
    return Array.from(tags).sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    return filterProducts(products, filters);
  }, [filters, products]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, search: searchInput }));
  };

  const handleSortChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: value as FilterOptions["sortBy"],
    }));
  };

  const toggleTag = (tag: string) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags?.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...(prev.tags || []), tag],
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: "template",
      sortBy: "newest",
      search: "",
      tags: [],
      priceRange: undefined,
    });
    setSearchInput("");
  };

  const priceRanges = [
    { label: "Tất cả", value: undefined },
    { label: "Dưới 200K", value: [0, 200000] as [number, number] },
    { label: "200K - 500K", value: [200000, 500000] as [number, number] },
    { label: "Trên 500K", value: [500000, Infinity] as [number, number] },
  ];

  return (
    <div className="container px-4 py-8 mx-auto">
      {/* Header */}
      <div className="mb-8 space-y-4">
        <div className="flex items-center space-x-2">
          <Package className="w-6 h-6 text-primary" />
          <h1 className="text-3xl font-bold">Templates</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Khám phá bộ sưu tập templates chuyên nghiệp cho mọi dự án của bạn
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex space-x-2">
          <div className="relative flex-1">
            <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Tìm kiếm templates..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit">Tìm kiếm</Button>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Bộ lọc
          </Button>
        </form>

        {/* Filters Panel */}
        {showFilters && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bộ lọc</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Sort */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Sắp xếp theo</label>
                <Select
                  value={filters.sortBy || "newest"}
                  onValueChange={handleSortChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Mới nhất</SelectItem>
                    <SelectItem value="oldest">Cũ nhất</SelectItem>
                    <SelectItem value="price-low">Giá thấp đến cao</SelectItem>
                    <SelectItem value="price-high">Giá cao đến thấp</SelectItem>
                    <SelectItem value="rating">Đánh giá cao</SelectItem>
                    <SelectItem value="popular">Phổ biến</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Khoảng giá</label>
                <div className="grid grid-cols-2 gap-2">
                  {priceRanges.map((range, index) => (
                    <Button
                      key={index}
                      variant={
                        JSON.stringify(filters.priceRange) ===
                        JSON.stringify(range.value)
                          ? "default"
                          : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          priceRange: range.value,
                        }))
                      }
                    >
                      {range.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {templateTags.slice(0, 12).map((tag) => (
                    <Badge
                      key={tag}
                      variant={
                        filters.tags?.includes(tag) ? "default" : "outline"
                      }
                      className="cursor-pointer"
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              <div className="flex items-center justify-between pt-4 border-t">
                <Button variant="outline" onClick={clearFilters}>
                  <X className="w-4 h-4 mr-2" />
                  Xóa bộ lọc
                </Button>
                <Button onClick={() => setShowFilters(false)}>Áp dụng</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Active Filters */}
        {(filters.search || filters.tags?.length || filters.priceRange) && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">Đang lọc:</span>
            {filters.search && (
              <Badge variant="secondary">
                Tìm kiếm: "{filters.search}"
                <button
                  onClick={() => {
                    setFilters((prev) => ({ ...prev, search: "" }));
                    setSearchInput("");
                  }}
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
                  onClick={() => toggleTag(tag)}
                  className="ml-1 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
            {filters.priceRange && (
              <Badge variant="secondary">
                Giá:{" "}
                {filters.priceRange[0] === 0
                  ? "Dưới"
                  : filters.priceRange[0] === 200000
                    ? "200K-500K"
                    : "Trên"}
                {filters.priceRange[1] === 200000
                  ? " 200K"
                  : filters.priceRange[1] === 500000
                    ? ""
                    : " 500K"}
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
          </div>
        )}
      </div>

      {/* Results */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            Hiển thị {filteredProducts.length} kết quả
          </p>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={() => addToCart(product)}
              />
            ))}
          </div>
        ) : (
          <Card className="py-12 text-center">
            <CardContent>
              <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">
                Không tìm thấy template nào
              </h3>
              <p className="mb-4 text-muted-foreground">
                Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
              </p>
              <Button onClick={clearFilters}>Xóa bộ lọc</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Templates;
