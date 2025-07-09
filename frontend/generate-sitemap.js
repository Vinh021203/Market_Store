// generate-sitemap.js - Version tối ưu SEO
import { SitemapStream } from "sitemap";
import { createWriteStream } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Domain mới
const BASE_URL = "https://marketstoreapp.vercel.app";

// ✅ Tất cả routes từ App.tsx
async function getAllRoutes() {
  // Public Routes - Priority cao
  const publicRoutes = [
    { url: "/", changefreq: "daily", priority: 1.0 },
    { url: "/templates", changefreq: "daily", priority: 0.9 },
    { url: "/ebooks", changefreq: "daily", priority: 0.9 },
    { url: "/blog", changefreq: "daily", priority: 0.8 },
    { url: "/about", changefreq: "monthly", priority: 0.7 },
    { url: "/contact", changefreq: "monthly", priority: 0.7 },
    { url: "/pricing", changefreq: "weekly", priority: 0.8 },
    { url: "/careers", changefreq: "monthly", priority: 0.6 },
    { url: "/search", changefreq: "never", priority: 0.5 },
  ];

  // Auth Routes - Priority thấp (chỉ cho completeness)
  const authRoutes = [
    { url: "/auth/login", changefreq: "monthly", priority: 0.3 },
    { url: "/auth/register", changefreq: "monthly", priority: 0.3 },
    { url: "/auth/forgot-password", changefreq: "monthly", priority: 0.2 },
  ];

  // Protected Routes - Không cần trong sitemap (private)
  // Cart, Profile, Settings, Downloads, etc. - bỏ qua

  return [...publicRoutes, ...authRoutes];
}

// ✅ Dynamic content từ API/Database
async function getDynamicUrls() {
  try {
    // Fetch thực tế từ API
    const productsResponse = await fetch(`${BASE_URL}/api/products`);
    const products = await productsResponse.json();

    const blogResponse = await fetch(`${BASE_URL}/api/blog`);
    const blogPosts = await blogResponse.json();

    const productUrls = products.map((product) => ({
      url: `/product/${product.id}`,
      changefreq: "weekly",
      priority: 0.8,
      lastmod: product.updatedAt || product.createdAt,
    }));

    const blogUrls = blogPosts.map((post) => ({
      url: `/blog/${post.slug}`,
      changefreq: "weekly",
      priority: 0.7,
      lastmod: post.updatedAt || post.createdAt,
    }));

    return [...productUrls, ...blogUrls];
  } catch (error) {
    console.warn("Could not fetch dynamic URLs, using fallback data");

    // Fallback data nếu API không available
    return [
      {
        url: "/product/react-admin-template",
        changefreq: "weekly",
        priority: 0.8,
      },
      {
        url: "/product/nextjs-ecommerce-kit",
        changefreq: "weekly",
        priority: 0.8,
      },
      {
        url: "/blog/react-best-practices",
        changefreq: "weekly",
        priority: 0.7,
      },
      {
        url: "/blog/seo-optimization-guide",
        changefreq: "weekly",
        priority: 0.7,
      },
    ];
  }
}

async function generateSitemap() {
  const sitemap = new SitemapStream({ hostname: BASE_URL });
  const writeStream = createWriteStream(
    path.resolve(__dirname, "public", "sitemap.xml"),
  );

  sitemap.pipe(writeStream);

  const promise = new Promise((resolve, reject) => {
    writeStream.on("finish", resolve);
    writeStream.on("error", reject);
  });

  // ✅ Thêm tất cả routes
  const staticRoutes = await getAllRoutes();
  for (const route of staticRoutes) {
    sitemap.write(route);
  }

  // ✅ Thêm dynamic content
  const dynamicUrls = await getDynamicUrls();
  for (const url of dynamicUrls) {
    sitemap.write(url);
  }

  sitemap.end();
  await promise;

  console.log("✅ Sitemap generated successfully!");
  console.log(`📍 Location: public/sitemap.xml`);
  console.log(`🌐 Domain: ${BASE_URL}`);
  console.log(`📊 Total URLs: ${staticRoutes.length + dynamicUrls.length}`);
}

generateSitemap().catch(console.error);
