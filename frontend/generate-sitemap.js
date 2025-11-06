// generate-sitemap.js - Version đã fix
import { SitemapStream } from "sitemap";
import { createWriteStream } from "fs";
import { existsSync, mkdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = "https://marketstoreapp.vercel.app";

// ✅ Static routes từ App.tsx thực tế
async function getAllRoutes() {
  const publicRoutes = [
    { url: "/", changefreq: "daily", priority: 1.0 },
    { url: "/templates", changefreq: "daily", priority: 0.9 },
    { url: "/ebooks", changefreq: "daily", priority: 0.9 },
    { url: "/blog", changefreq: "daily", priority: 0.8 },
    { url: "/about", changefreq: "monthly", priority: 0.7 },
    { url: "/contact", changefreq: "monthly", priority: 0.7 },
    { url: "/pricing", changefreq: "weekly", priority: 0.8 },
    { url: "/search", changefreq: "never", priority: 0.5 },
  ];

  const authRoutes = [
    { url: "/auth/login", changefreq: "monthly", priority: 0.3 },
    { url: "/auth/register", changefreq: "monthly", priority: 0.3 },
    { url: "/auth/forgot-password", changefreq: "monthly", priority: 0.2 },
  ];

  return [...publicRoutes, ...authRoutes];
}

// ✅ Mock data thay vì API call (vì API chưa ready)
async function getDynamicUrls() {
  try {
    // TODO: Thay bằng API thực tế khi ready
    // const productsResponse = await fetch(`${BASE_URL}/api/products`);
    // const products = await productsResponse.json();

    // ✅ Mock data cho development
    const mockProducts = [
      {
        id: "react-admin-dashboard",
        slug: "react-admin-dashboard",
        updatedAt: new Date().toISOString(),
      },
      {
        id: "nextjs-ecommerce-template",
        slug: "nextjs-ecommerce-template",
        updatedAt: new Date().toISOString(),
      },
      {
        id: "vue-portfolio-kit",
        slug: "vue-portfolio-kit",
        updatedAt: new Date().toISOString(),
      },
    ];

    const mockBlogs = [
      {
        slug: "react-performance-optimization",
        updatedAt: new Date().toISOString(),
      },
      {
        slug: "tailwind-css-best-practices",
        updatedAt: new Date().toISOString(),
      },
    ];

    const productUrls = mockProducts.map((product) => ({
      url: `/product/${product.id}`,
      changefreq: "weekly",
      priority: 0.8,
      lastmod: product.updatedAt,
    }));

    const blogUrls = mockBlogs.map((post) => ({
      url: `/blog/${post.slug}`,
      changefreq: "weekly",
      priority: 0.7,
      lastmod: post.updatedAt,
    }));

    return [...productUrls, ...blogUrls];
  } catch (error) {
    console.warn("Using fallback data for sitemap generation");
    return [];
  }
}

async function generateSitemap() {
  try {
    // ✅ Đảm bảo thư mục public tồn tại
    const publicDir = path.resolve(__dirname, "public");
    if (!existsSync(publicDir)) {
      mkdirSync(publicDir, { recursive: true });
    }

    const sitemap = new SitemapStream({ hostname: BASE_URL });
    const sitemapPath = path.resolve(publicDir, "sitemap.xml");
    const writeStream = createWriteStream(sitemapPath);

    sitemap.pipe(writeStream);

    const promise = new Promise((resolve, reject) => {
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });

    // ✅ Thêm static routes
    const staticRoutes = await getAllRoutes();
    for (const route of staticRoutes) {
      sitemap.write(route);
    }

    // ✅ Thêm dynamic URLs
    const dynamicUrls = await getDynamicUrls();
    for (const url of dynamicUrls) {
      sitemap.write(url);
    }

    sitemap.end();
    await promise;

    console.log("✅ Sitemap generated successfully!");
    console.log(`📍 Location: ${sitemapPath}`);
    console.log(`🌐 Domain: ${BASE_URL}`);
    console.log(`📊 Static URLs: ${staticRoutes.length}`);
    console.log(`📊 Dynamic URLs: ${dynamicUrls.length}`);
    console.log(`📊 Total URLs: ${staticRoutes.length + dynamicUrls.length}`);
  } catch (error) {
    console.error("❌ Error generating sitemap:", error);
    process.exit(1);
  }
}

generateSitemap().catch(console.error);
