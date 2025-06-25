// generate-sitemap.js
import { SitemapStream, streamToPromise } from "sitemap";
import { createWriteStream } from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Lấy đường dẫn thư mục hiện tại theo cách Node.js ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ QUAN TRỌNG: Thay thế bằng domain thật của bạn!
const BASE_URL = "https://marketstore-two.vercel.app";

// Hàm giả lập lấy dữ liệu động (sản phẩm, bài blog).
// Trong thực tế, bạn sẽ fetch dữ liệu này từ API hoặc database của mình
// để tạo ra danh sách URL chính xác và đầy đủ.
async function getDynamicUrls() {
  const products = [
    { id: "template-premium-1" },
    { id: "ebook-web-design" },
    { id: "ui-kit-pro" },
    // ✅ Thêm TẤT CẢ các ID/slug của sản phẩm, Ebook thực tế của bạn ở đây.
    // Nếu bạn có một API để lấy danh sách sản phẩm, hãy gọi API đó ở đây.
  ];

  const blogPosts = [
    { slug: "react-seo-best-practices" },
    { slug: "how-to-choose-a-template" },
    { slug: "top-5-design-trends" },
    // ✅ Thêm TẤT CẢ các slug bài blog thực tế của bạn ở đây.
    // Nếu bạn có một API để lấy danh sách bài blog, hãy gọi API đó ở đây.
  ];

  const productUrls = products.map((p) => ({
    url: `/product/${p.id}`,
    changefreq: "daily",
    priority: 0.8,
  }));
  const blogUrls = blogPosts.map((b) => ({
    url: `/blog/${b.slug}`,
    changefreq: "weekly",
    priority: 0.7,
  }));

  return [...productUrls, ...blogUrls];
}

async function generateSitemap() {
  const sitemap = new SitemapStream({ hostname: BASE_URL });
  const writeStream = createWriteStream(
    path.resolve(__dirname, "public", "sitemap.xml"),
  );

  // ✅ Thay đổi cách sử dụng pipe và streamToPromise
  // Chúng ta pipe sitemap stream vào writeStream
  sitemap.pipe(writeStream);

  // Sau đó, chúng ta đợi cho writeStream hoàn tất, không phải sitemap stream.
  // streamToPromise là dành cho ReadableStream, writeStream là WritableStream.
  // Cách chuẩn là đợi cho 'finish' event của writeStream.
  const promise = new Promise((resolve, reject) => {
    writeStream.on("finish", resolve);
    writeStream.on("error", reject);
  });

  // Các URL tĩnh của bạn
  const staticUrls = [
    { url: "/", changefreq: "daily", priority: 1.0 },
    { url: "/templates", changefreq: "daily", priority: 0.9 },
    { url: "/ebooks", changefreq: "daily", priority: 0.9 },
    { url: "/blog", changefreq: "daily", priority: 0.8 },
    { url: "/cart", changefreq: "never", priority: 0.5 },
    { url: "/about", changefreq: "monthly", priority: 0.6 },
    { url: "/contact", changefreq: "monthly", priority: 0.6 },
    { url: "/pricing", changefreq: "monthly", priority: 0.7 },
    { url: "/search", changefreq: "never", priority: 0.5 },
  ];

  for (const url of staticUrls) {
    sitemap.write(url);
  }

  // Thêm các URL động
  const dynamicUrls = await getDynamicUrls();
  for (const url of dynamicUrls) {
    sitemap.write(url);
  }

  sitemap.end(); // Kết thúc sitemap stream, điều này sẽ kích hoạt writeStream ghi và đóng

  await promise; // ✅ Đợi cho writeStream hoàn tất
  console.log("Sitemap generated successfully in public/sitemap.xml");
}

generateSitemap().catch(console.error);
