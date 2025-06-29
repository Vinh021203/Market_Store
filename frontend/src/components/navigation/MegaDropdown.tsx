// components/navigation/MegaDropdown.tsx - Hoàn chỉnh với tag filtering
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowRight } from "lucide-react";
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";
import { getProductsByCategory, getAllTags } from "@/lib/products";

interface MegaDropdownProps {
  category: "template" | "ebook";
  title: string;
  icon: React.ComponentType<any>;
  badgeText?: string;
  badgeColor?: string;
}

const MegaDropdown: React.FC<MegaDropdownProps> = ({
  category,
  title,
  icon: Icon,
  badgeText,
  badgeColor,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [tagGroups, setTagGroups] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, [category]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [allProducts, allTags] = await Promise.all([
        getProductsByCategory(category),
        getAllTags(),
      ]);

      setProducts(allProducts);

      // ✅ Tạo tag groups từ data thực tế
      const groups = generateTagGroups(allProducts, category);
      setTagGroups(groups);
    } catch (error) {
      console.error("Error loading dropdown data:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Generate tag groups based on popular keywords
  const generateTagGroups = (products: Product[], category: string) => {
    const tagCounts: Record<string, number> = {};

    // Count products for each tag
    products.forEach((product) => {
      product.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    // ✅ Popular keywords mapping
    const popularMappings = {
      "Frontend Frameworks": {
        keywords: ["react", "vue", "angular", "svelte", "nextjs"],
        icon: "⚛️",
        color: "from-blue-500 to-cyan-500",
      },
      "Backend & API": {
        keywords: ["nodejs", "express", "api", "database", "mongodb"],
        icon: "⚙️",
        color: "from-green-500 to-emerald-500",
      },
      "Admin & Dashboard": {
        keywords: ["admin", "dashboard", "panel", "cms"],
        icon: "📊",
        color: "from-purple-500 to-indigo-500",
      },
      "E-commerce & Business": {
        keywords: ["ecommerce", "business", "shop", "store", "saas"],
        icon: "🛒",
        color: "from-orange-500 to-red-500",
      },
      "Design & Landing": {
        keywords: ["landing", "portfolio", "blog", "creative"],
        icon: "🎨",
        color: "from-pink-500 to-rose-500",
      },
    };

    if (category === "ebook") {
      const ebookMappings = {
        "Programming Languages": {
          keywords: ["javascript", "typescript", "python", "java", "php"],
          icon: "💻",
          color: "from-yellow-500 to-orange-500",
        },
        "Web Development": {
          keywords: ["react", "nodejs", "api", "frontend", "backend"],
          icon: "🌐",
          color: "from-blue-500 to-cyan-500",
        },
        "Design & UX": {
          keywords: ["ui", "ux", "design", "figma", "sketch"],
          icon: "🎨",
          color: "from-pink-500 to-rose-500",
        },
      };

      return Object.entries(ebookMappings)
        .map(([name, config]) => {
          const matchingTags = Object.entries(tagCounts)
            .filter(([tag]) =>
              config.keywords.some((keyword) =>
                tag.toLowerCase().includes(keyword.toLowerCase()),
              ),
            )
            .sort(([, a], [, b]) => b - a)
            .slice(0, 4)
            .map(([tag, count]) => ({ tag, count }));

          return {
            name,
            description: `${matchingTags.reduce((sum, { count }) => sum + count, 0)} e-books`,
            tags: matchingTags,
            color: config.color,
            icon: config.icon,
          };
        })
        .filter((group) => group.tags.length > 0);
    }

    // Generate groups for templates
    return Object.entries(popularMappings)
      .map(([name, config]) => {
        const matchingTags = Object.entries(tagCounts)
          .filter(([tag]) =>
            config.keywords.some((keyword) =>
              tag.toLowerCase().includes(keyword.toLowerCase()),
            ),
          )
          .sort(([, a], [, b]) => b - a)
          .slice(0, 4)
          .map(([tag, count]) => ({ tag, count }));

        return {
          name,
          description: `${matchingTags.reduce((sum, { count }) => sum + count, 0)} templates`,
          tags: matchingTags,
          color: config.color,
          icon: config.icon,
        };
      })
      .filter((group) => group.tags.length > 0);
  };

  // ✅ Handle tag click - Navigate với query params
  const handleTagClick = (tag: string) => {
    navigate(`/${category}s?tag=${encodeURIComponent(tag)}`);
  };

  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 3);

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className="group">
        <Icon className="w-4 h-4 mr-2" />
        {title}
        {badgeText && (
          <Badge variant="secondary" className={`ml-2 ${badgeColor}`}>
            {badgeText}
          </Badge>
        )}
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <div className="w-[800px] p-6">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="w-8 h-8 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              {/* Left Column - Tag Groups */}
              <div className="col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                    {title} Categories
                  </h3>
                  <NavigationMenuLink asChild>
                    <Link
                      to={`/${category}s`}
                      className="flex items-center space-x-2 text-sm font-medium transition-colors group text-primary hover:text-primary/80"
                    >
                      <span>Xem tất cả</span>
                      <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </NavigationMenuLink>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {tagGroups.map((group, index) => (
                    <div
                      key={index}
                      className="p-3 transition-colors rounded-lg hover:bg-muted"
                    >
                      <div className="flex items-center mb-3 space-x-3">
                        <div
                          className={`w-10 h-10 rounded-lg bg-gradient-to-r ${group.color} flex items-center justify-center text-white text-lg`}
                        >
                          {group.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {group.name}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {group.description}
                          </p>
                        </div>
                      </div>

                      {/* ✅ Clickable Tags từ database thực tế */}
                      <div className="flex flex-wrap gap-1">
                        {group.tags.slice(0, 4).map(({ tag, count }: any) => (
                          <button
                            key={tag}
                            onClick={() => handleTagClick(tag)}
                            className="px-2 py-1 text-xs text-blue-600 transition-colors bg-blue-100 rounded cursor-pointer dark:bg-blue-900 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800"
                          >
                            {tag} ({count})
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer CTA */}
                <div className="pt-4 mt-6 border-t">
                  <NavigationMenuLink asChild>
                    <Link
                      to={`/${category}s`}
                      className="flex items-center justify-center w-full p-3 text-sm font-medium text-white transition-all duration-300 rounded-lg group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:shadow-lg"
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      <span>Duyệt tất cả {title}</span>
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </NavigationMenuLink>
                </div>
              </div>

              {/* Right Column - Featured Products */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">
                  Sản phẩm nổi bật
                </h4>

                {featuredProducts.map((product) => (
                  <Link
                    key={product.id}
                    to={`/${category}s/${product.id}`}
                    className="block p-3 transition-colors rounded-lg hover:bg-muted"
                  >
                    <div className="flex space-x-3">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="object-cover w-12 h-12 rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h5 className="font-medium text-gray-900 truncate dark:text-white">
                          {product.title}
                        </h5>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-sm font-semibold text-blue-600">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(product.price)}
                          </span>
                          <div className="flex items-center space-x-1">
                            <span className="text-xs text-gray-500">
                              ⭐ {product.rating}
                            </span>
                          </div>
                        </div>
                        {/* ✅ Show product tags */}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {product.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-1 py-0.5 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}

                {/* Quick Actions */}
                <div className="pt-4 space-y-2 border-t">
                  <Link
                    to={`/${category}s?featured=true`}
                    className="flex items-center p-2 space-x-2 text-sm rounded-lg hover:bg-muted"
                  >
                    <span className="text-yellow-500">👑</span>
                    <span>Premium Collection</span>
                  </Link>
                  <Link
                    to={`/${category}s?sort=newest`}
                    className="flex items-center p-2 space-x-2 text-sm rounded-lg hover:bg-muted"
                  >
                    <span className="text-green-500">🆕</span>
                    <span>Mới nhất</span>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
};

export default MegaDropdown;
