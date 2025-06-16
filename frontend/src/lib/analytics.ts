import { supabase } from "@/lib/supabase";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export interface AnalyticsData {
  kpiData: {
    totalRevenue: number;
    totalOrders: number;
    newCustomers: number;
    totalDownloads: number;
    revenueGrowth: number;
    ordersGrowth: number;
    customersGrowth: number;
    downloadsGrowth: number;
  };
  revenueData: Array<{
    month: string;
    revenue: number;
    orders: number;
    users: number;
  }>;
  categoryData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  topProducts: Array<{
    name: string;
    sales: number;
    revenue: number;
  }>;
  dailyVisitors: Array<{
    date: string;
    visitors: number;
    pageViews: number;
  }>;
}

// Lấy dữ liệu analytics dựa trên time range
export const getAnalyticsData = async (
  timeRange: string,
): Promise<AnalyticsData> => {
  try {
    const { startDate, endDate } = getDateRange(timeRange);
    const { startDatePrev, endDatePrev } = getPreviousDateRange(timeRange);

    // KPI Data - Current Period
    const [
      { count: totalOrders },
      { data: revenueData },
      { count: newCustomers },
      { count: totalDownloads },
    ] = await Promise.all([
      supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .gte("created_at", startDate)
        .lte("created_at", endDate),

      supabase
        .from("orders")
        .select("total_price")
        .eq("status", "completed")
        .gte("created_at", startDate)
        .lte("created_at", endDate),

      supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .gte("created_at", startDate)
        .lte("created_at", endDate),

      supabase
        .from("downloads")
        .select("*", { count: "exact", head: true })
        .gte("download_date", startDate)
        .lte("download_date", endDate),
    ]);

    const totalRevenue =
      revenueData?.reduce((sum, order) => sum + (order.total_price || 0), 0) ||
      0;

    // KPI Data - Previous Period (for growth calculation)
    const [
      { count: prevOrders },
      { data: prevRevenueData },
      { count: prevCustomers },
      { count: prevDownloads },
    ] = await Promise.all([
      supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .gte("created_at", startDatePrev)
        .lte("created_at", endDatePrev),

      supabase
        .from("orders")
        .select("total_price")
        .eq("status", "completed")
        .gte("created_at", startDatePrev)
        .lte("created_at", endDatePrev),

      supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .gte("created_at", startDatePrev)
        .lte("created_at", endDatePrev),

      supabase
        .from("downloads")
        .select("*", { count: "exact", head: true })
        .gte("download_date", startDatePrev)
        .lte("download_date", endDatePrev),
    ]);

    const prevRevenue =
      prevRevenueData?.reduce(
        (sum, order) => sum + (order.total_price || 0),
        0,
      ) || 0;

    // Calculate growth rates
    const revenueGrowth =
      prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0;
    const ordersGrowth = prevOrders
      ? (((totalOrders || 0) - prevOrders) / prevOrders) * 100
      : 0;
    const customersGrowth = prevCustomers
      ? (((newCustomers || 0) - prevCustomers) / prevCustomers) * 100
      : 0;
    const downloadsGrowth = prevDownloads
      ? (((totalDownloads || 0) - prevDownloads) / prevDownloads) * 100
      : 0;

    // Revenue by month data
    const monthlyRevenueData = await getMonthlyRevenueData(timeRange);

    // Category distribution
    const categoryDistribution = await getCategoryDistribution();

    // Top products
    const topProductsData = await getTopProducts();

    // Daily visitors (mock data for now - would need analytics integration)
    const dailyVisitorsData = await getDailyVisitors(timeRange);

    return {
      kpiData: {
        totalRevenue,
        totalOrders: totalOrders || 0,
        newCustomers: newCustomers || 0,
        totalDownloads: totalDownloads || 0,
        revenueGrowth,
        ordersGrowth,
        customersGrowth,
        downloadsGrowth,
      },
      revenueData: monthlyRevenueData,
      categoryData: categoryDistribution,
      topProducts: topProductsData,
      dailyVisitors: dailyVisitorsData,
    };
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    return getDefaultAnalyticsData();
  }
};

// Helper function để lấy monthly revenue data
const getMonthlyRevenueData = async (timeRange: string) => {
  const months = getMonthsArray(timeRange);

  const data = await Promise.all(
    months.map(async (month) => {
      const startOfMonth = new Date(month.year, month.month - 1, 1);
      const endOfMonth = new Date(month.year, month.month, 0);

      const [{ data: orders }, { count: orderCount }, { count: userCount }] =
        await Promise.all([
          supabase
            .from("orders")
            .select("total_price")
            .eq("status", "completed")
            .gte("created_at", startOfMonth.toISOString())
            .lte("created_at", endOfMonth.toISOString()),

          supabase
            .from("orders")
            .select("*", { count: "exact", head: true })
            .gte("created_at", startOfMonth.toISOString())
            .lte("created_at", endOfMonth.toISOString()),

          supabase
            .from("profiles")
            .select("*", { count: "exact", head: true })
            .gte("created_at", startOfMonth.toISOString())
            .lte("created_at", endOfMonth.toISOString()),
        ]);

      const revenue =
        orders?.reduce((sum, order) => sum + (order.total_price || 0), 0) || 0;

      return {
        month: month.name,
        revenue,
        orders: orderCount || 0,
        users: userCount || 0,
      };
    }),
  );

  return data;
};

// Helper function để lấy category distribution
const getCategoryDistribution = async () => {
  const { count: templates } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("category", "template");

  const { count: ebooks } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("category", "ebook");

  const total = (templates || 0) + (ebooks || 0);

  if (total === 0) {
    return [
      { name: "Templates", value: 50, color: "#3b82f6" },
      { name: "E-books", value: 50, color: "#8b5cf6" },
    ];
  }

  return [
    {
      name: "Templates",
      value: Math.round(((templates || 0) / total) * 100),
      color: "#3b82f6",
    },
    {
      name: "E-books",
      value: Math.round(((ebooks || 0) / total) * 100),
      color: "#8b5cf6",
    },
  ];
};

// Thêm interface cho order items
interface OrderItemWithProduct {
  product_id: string;
  quantity: number;
  price: number;
  products: {
    title: string;
  } | null;
}

// Cập nhật function
const getTopProducts = async () => {
  const { data: orderItems } = (await supabase.from("order_items").select(`
      product_id,
      quantity,
      price,
      products!inner(title)
    `)) as { data: OrderItemWithProduct[] | null };

  if (!orderItems) return [];

  // Group by product and calculate sales
  const productSales = orderItems.reduce(
    (acc, item) => {
      const productId = item.product_id;
      const productName = item.products?.title || "Unknown Product";

      if (!acc[productId]) {
        acc[productId] = {
          name: productName,
          sales: 0,
          revenue: 0,
        };
      }

      acc[productId].sales += item.quantity;
      acc[productId].revenue += item.quantity * item.price;

      return acc;
    },
    {} as Record<string, { name: string; sales: number; revenue: number }>,
  );

  return Object.values(productSales)
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);
};

// Helper function để lấy daily visitors (mock data)
const getDailyVisitors = async (timeRange: string) => {
  const days = getDaysArray(timeRange);

  // Mock data - in real app, this would come from analytics service
  return days.map((day, index) => ({
    date: day.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" }),
    visitors: Math.floor(Math.random() * 500) + 1000 + index * 50,
    pageViews: Math.floor(Math.random() * 1000) + 2000 + index * 100,
  }));
};

// Utility functions
const getDateRange = (timeRange: string) => {
  const now = new Date();
  let startDate: Date;

  switch (timeRange) {
    case "7d":
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case "30d":
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case "90d":
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case "1y":
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

  return {
    startDate: startDate.toISOString(),
    endDate: now.toISOString(),
  };
};

const getPreviousDateRange = (timeRange: string) => {
  const { startDate, endDate } = getDateRange(timeRange);
  const start = new Date(startDate);
  const end = new Date(endDate);
  const duration = end.getTime() - start.getTime();

  return {
    startDatePrev: new Date(start.getTime() - duration).toISOString(),
    endDatePrev: start.toISOString(),
  };
};

const getMonthsArray = (timeRange: string) => {
  const months = [];
  const now = new Date();
  let monthsCount = 6;

  if (timeRange === "1y") monthsCount = 12;
  else if (timeRange === "90d") monthsCount = 3;

  for (let i = monthsCount - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      name: date.toLocaleDateString("vi-VN", { month: "short" }),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
    });
  }

  return months;
};

const getDaysArray = (timeRange: string) => {
  const days = [];
  const now = new Date();
  let daysCount = 7;

  if (timeRange === "30d")
    daysCount = 7; // Show last 7 days for 30d range
  else if (timeRange === "7d") daysCount = 7;

  for (let i = daysCount - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    days.push(date);
  }

  return days;
};

const getDefaultAnalyticsData = (): AnalyticsData => ({
  kpiData: {
    totalRevenue: 0,
    totalOrders: 0,
    newCustomers: 0,
    totalDownloads: 0,
    revenueGrowth: 0,
    ordersGrowth: 0,
    customersGrowth: 0,
    downloadsGrowth: 0,
  },
  revenueData: [],
  categoryData: [
    { name: "Templates", value: 50, color: "#3b82f6" },
    { name: "E-books", value: 50, color: "#8b5cf6" },
  ],
  topProducts: [],
  dailyVisitors: [],
});

// Export report function
export const exportAnalyticsReport = async (timeRange: string) => {
  try {
    const data = await getAnalyticsData(timeRange);

    // Tạo workbook mới
    const workbook = XLSX.utils.book_new();

    // Sheet 1: Tổng quan KPI
    const kpiData = [
      ["Chỉ số", "Giá trị", "Tăng trưởng (%)"],
      ["Tổng doanh thu", data.kpiData.totalRevenue, data.kpiData.revenueGrowth],
      ["Tổng đơn hàng", data.kpiData.totalOrders, data.kpiData.ordersGrowth],
      [
        "Khách hàng mới",
        data.kpiData.newCustomers,
        data.kpiData.customersGrowth,
      ],
      [
        "Tổng lượt tải",
        data.kpiData.totalDownloads,
        data.kpiData.downloadsGrowth,
      ],
    ];

    const kpiWorksheet = XLSX.utils.aoa_to_sheet(kpiData);

    // Định dạng cột cho sheet KPI
    kpiWorksheet["!cols"] = [
      { wch: 20 }, // Chỉ số
      { wch: 15 }, // Giá trị
      { wch: 15 }, // Tăng trưởng
    ];

    XLSX.utils.book_append_sheet(workbook, kpiWorksheet, "Tổng quan");

    // Sheet 2: Doanh thu theo tháng
    if (data.revenueData.length > 0) {
      const revenueHeaders = [
        "Tháng",
        "Doanh thu",
        "Đơn hàng",
        "Khách hàng mới",
      ];
      const revenueData = [
        revenueHeaders,
        ...data.revenueData.map((item) => [
          item.month,
          item.revenue,
          item.orders,
          item.users,
        ]),
      ];

      const revenueWorksheet = XLSX.utils.aoa_to_sheet(revenueData);
      revenueWorksheet["!cols"] = [
        { wch: 12 }, // Tháng
        { wch: 15 }, // Doanh thu
        { wch: 12 }, // Đơn hàng
        { wch: 15 }, // Khách hàng mới
      ];

      XLSX.utils.book_append_sheet(
        workbook,
        revenueWorksheet,
        "Doanh thu theo tháng",
      );
    }

    // Sheet 3: Sản phẩm bán chạy
    if (data.topProducts.length > 0) {
      const productsHeaders = [
        "Thứ hạng",
        "Tên sản phẩm",
        "Số lượng bán",
        "Doanh thu",
      ];
      const productsData = [
        productsHeaders,
        ...data.topProducts.map((product, index) => [
          index + 1,
          product.name,
          product.sales,
          product.revenue,
        ]),
      ];

      const productsWorksheet = XLSX.utils.aoa_to_sheet(productsData);
      productsWorksheet["!cols"] = [
        { wch: 12 }, // Thứ hạng
        { wch: 30 }, // Tên sản phẩm
        { wch: 15 }, // Số lượng bán
        { wch: 15 }, // Doanh thu
      ];

      XLSX.utils.book_append_sheet(
        workbook,
        productsWorksheet,
        "Sản phẩm bán chạy",
      );
    }

    // Sheet 4: Phân bố danh mục
    const categoryHeaders = ["Danh mục", "Tỷ lệ (%)", "Màu"];
    const categoryData = [
      categoryHeaders,
      ...data.categoryData.map((item) => [item.name, item.value, item.color]),
    ];

    const categoryWorksheet = XLSX.utils.aoa_to_sheet(categoryData);
    categoryWorksheet["!cols"] = [
      { wch: 15 }, // Danh mục
      { wch: 12 }, // Tỷ lệ
      { wch: 10 }, // Màu
    ];

    XLSX.utils.book_append_sheet(
      workbook,
      categoryWorksheet,
      "Phân bố danh mục",
    );

    // Sheet 5: Lượt truy cập hàng ngày
    if (data.dailyVisitors.length > 0) {
      const visitorsHeaders = ["Ngày", "Khách truy cập", "Lượt xem trang"];
      const visitorsData = [
        visitorsHeaders,
        ...data.dailyVisitors.map((item) => [
          item.date,
          item.visitors,
          item.pageViews,
        ]),
      ];

      const visitorsWorksheet = XLSX.utils.aoa_to_sheet(visitorsData);
      visitorsWorksheet["!cols"] = [
        { wch: 12 }, // Ngày
        { wch: 15 }, // Khách truy cập
        { wch: 15 }, // Lượt xem trang
      ];

      XLSX.utils.book_append_sheet(
        workbook,
        visitorsWorksheet,
        "Lượt truy cập",
      );
    }

    // Thêm thông tin metadata
    const metadataData = [
      ["Thông tin báo cáo"],
      ["Thời gian tạo", new Date().toLocaleString("vi-VN")],
      ["Khoảng thời gian", getTimeRangeText(timeRange)],
      ["Người tạo", "Admin System"],
      ["Phiên bản", "1.0.0"],
    ];

    const metadataWorksheet = XLSX.utils.aoa_to_sheet(metadataData);
    metadataWorksheet["!cols"] = [
      { wch: 20 }, // Label
      { wch: 25 }, // Value
    ];

    XLSX.utils.book_append_sheet(workbook, metadataWorksheet, "Thông tin");

    // Xuất file Excel
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
      compression: true,
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const fileName = `bao-cao-thong-ke-${timeRange}-${new Date().toISOString().split("T")[0]}.xlsx`;
    saveAs(blob, fileName);

    return true;
  } catch (error) {
    console.error("Error exporting Excel report:", error);
    return false;
  }
};

export const exportStyledAnalyticsReport = async (timeRange: string) => {
  try {
    const data = await getAnalyticsData(timeRange);
    const workbook = XLSX.utils.book_new();

    // Tạo styled worksheet
    const createStyledWorksheet = (data: any[][], title: string) => {
      const worksheet = XLSX.utils.aoa_to_sheet(data);

      // Thêm title row
      XLSX.utils.sheet_add_aoa(worksheet, [[title]], { origin: "A1" });

      // Merge title cell
      if (!worksheet["!merges"]) worksheet["!merges"] = [];
      worksheet["!merges"].push({
        s: { r: 0, c: 0 },
        e: { r: 0, c: data[0].length - 1 },
      });

      // Shift data down
      const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1");
      for (let row = range.e.r; row >= 1; row--) {
        for (let col = range.s.c; col <= range.e.c; col++) {
          const oldCell = worksheet[XLSX.utils.encode_cell({ r: row, c: col })];
          if (oldCell) {
            worksheet[XLSX.utils.encode_cell({ r: row + 1, c: col })] = oldCell;
            delete worksheet[XLSX.utils.encode_cell({ r: row, c: col })];
          }
        }
      }

      // Update range
      worksheet["!ref"] = XLSX.utils.encode_range({
        s: { r: 0, c: 0 },
        e: { r: range.e.r + 1, c: range.e.c },
      });

      return worksheet;
    };

    // Tạo các sheet với styling
    const kpiData = [
      ["Chỉ số", "Giá trị", "Tăng trưởng (%)"],
      [
        "Tổng doanh thu",
        data.kpiData.totalRevenue.toLocaleString("vi-VN"),
        `${data.kpiData.revenueGrowth.toFixed(1)}%`,
      ],
      [
        "Tổng đơn hàng",
        data.kpiData.totalOrders.toLocaleString("vi-VN"),
        `${data.kpiData.ordersGrowth.toFixed(1)}%`,
      ],
      [
        "Khách hàng mới",
        data.kpiData.newCustomers.toLocaleString("vi-VN"),
        `${data.kpiData.customersGrowth.toFixed(1)}%`,
      ],
      [
        "Tổng lượt tải",
        data.kpiData.totalDownloads.toLocaleString("vi-VN"),
        `${data.kpiData.downloadsGrowth.toFixed(1)}%`,
      ],
    ];

    const kpiWorksheet = createStyledWorksheet(
      kpiData,
      "BÁO CÁO TỔNG QUAN KPI",
    );
    kpiWorksheet["!cols"] = [{ wch: 25 }, { wch: 20 }, { wch: 18 }];

    XLSX.utils.book_append_sheet(workbook, kpiWorksheet, "Tổng quan");

    // Xuất file với compression
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
      compression: true,
      bookSST: true,
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const fileName = `bao-cao-chi-tiet-${timeRange}-${new Date().toISOString().split("T")[0]}.xlsx`;
    saveAs(blob, fileName);

    return true;
  } catch (error) {
    console.error("Error exporting styled Excel report:", error);
    return false;
  }
};

// Helper function để convert time range thành text
const getTimeRangeText = (timeRange: string): string => {
  switch (timeRange) {
    case "7d":
      return "7 ngày qua";
    case "30d":
      return "30 ngày qua";
    case "90d":
      return "3 tháng qua";
    case "1y":
      return "1 năm qua";
    default:
      return timeRange;
  }
};
