import { supabase } from "@/lib/supabase";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export interface ReportData {
  id: string;
  title: string;
  description: string;
  type: "sales" | "users" | "products" | "custom";
  format: "PDF" | "Excel";
  status: "completed" | "processing" | "failed";
  file_url?: string;
  file_size: string;
  generated_at: string;
  generated_by: string;
  data_range: string;
}

export interface CreateReportData {
  title: string;
  description: string;
  type: "sales" | "users" | "products" | "custom";
  format: "PDF" | "Excel";
  file_size: string;
  data_range: string;
}

export interface ReportTemplate {
  name: string;
  type: "sales" | "users" | "products" | "custom";
  description: string;
  icon: string;
  color: string;
}

// Lấy danh sách báo cáo đã tạo
export const getReports = async (
  type?: string,
  timeRange?: string,
): Promise<ReportData[]> => {
  try {
    let query = supabase
      .from("reports")
      .select("*")
      .order("generated_at", { ascending: false });

    if (type && type !== "all") {
      query = query.eq("type", type);
    }

    if (timeRange) {
      const { startDate } = getDateRange(timeRange);
      query = query.gte("generated_at", startDate);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching reports:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Exception fetching reports:", error);
    return [];
  }
};

interface ProductSalesData {
  quantity: number;
  revenue: number;
}

// Tạo báo cáo doanh thu
export const generateSalesReport = async (timeRange: string = "30d") => {
  try {
    const { startDate, endDate } = getDateRange(timeRange);

    // Lấy dữ liệu đơn hàng
    const { data: orders } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items(*, products(*))
      `,
      )
      .gte("created_at", startDate)
      .lte("created_at", endDate)
      .eq("status", "completed");

    if (!orders) return null;

    // Tính toán metrics
    const totalRevenue = orders.reduce(
      (sum, order) => sum + (order.total_price || 0),
      0,
    );
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Doanh thu theo ngày
    const dailyRevenue = orders.reduce(
      (acc, order) => {
        const date = new Date(order.created_at).toLocaleDateString("vi-VN");
        acc[date] = (acc[date] || 0) + (order.total_price || 0);
        return acc;
      },
      {} as Record<string, number>,
    );

    // Top sản phẩm - FIX spread operator
    const productSales = orders
      .flatMap((order) => order.order_items || [])
      .reduce(
        (acc, item) => {
          const productName = item.products?.title || "Unknown";
          if (!acc[productName]) {
            acc[productName] = { quantity: 0, revenue: 0 };
          }
          acc[productName].quantity += item.quantity;
          acc[productName].revenue += item.quantity * item.price;
          return acc;
        },
        {} as Record<string, ProductSalesData>,
      ); // Type rõ ràng

    const reportData = {
      summary: {
        totalRevenue,
        totalOrders,
        avgOrderValue,
        timeRange: getTimeRangeText(timeRange),
        generatedAt: new Date().toISOString(),
      },
      dailyRevenue: Object.entries(dailyRevenue).map(([date, revenue]) => ({
        date,
        revenue,
      })),
      // FIX: Thay thế spread operator bằng object rõ ràng
      topProducts: Object.entries(productSales)
        .map(([name, data]) => {
          // Type guard để đảm bảo data có đúng structure
          if (
            data &&
            typeof data === "object" &&
            "quantity" in data &&
            "revenue" in data
          ) {
            const typedData = data as ProductSalesData;
            return {
              name: name,
              quantity: typedData.quantity,
              revenue: typedData.revenue,
            };
          }
          // Fallback nếu data không hợp lệ
          return {
            name: name,
            quantity: 0,
            revenue: 0,
          };
        })
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10),

      orders: orders.map((order) => ({
        id: order.id,
        date: new Date(order.created_at).toLocaleDateString("vi-VN"),
        total: order.total_price,
        items: order.order_items?.length || 0,
      })),
    };

    return reportData;
  } catch (error) {
    console.error("Error generating sales report:", error);
    return null;
  }
};

// Tạo báo cáo người dùng
export const generateUsersReport = async (timeRange: string = "30d") => {
  try {
    const { startDate, endDate } = getDateRange(timeRange);

    // Lấy dữ liệu người dùng
    const { data: users } = await supabase
      .from("profiles")
      .select("*")
      .gte("created_at", startDate)
      .lte("created_at", endDate);

    const { data: allUsers } = await supabase
      .from("profiles")
      .select("id, role, created_at");

    if (!users || !allUsers) return null;

    // Thống kê theo role
    const roleStats = allUsers.reduce(
      (acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Người dùng mới theo ngày
    const dailySignups = users.reduce(
      (acc, user) => {
        const date = new Date(user.created_at).toLocaleDateString("vi-VN");
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const reportData = {
      summary: {
        totalUsers: allUsers.length,
        newUsers: users.length,
        adminUsers: roleStats.admin || 0,
        customerUsers: roleStats.customer || 0,
        timeRange: getTimeRangeText(timeRange),
        generatedAt: new Date().toISOString(),
      },
      dailySignups: Object.entries(dailySignups).map(([date, count]) => ({
        date,
        count,
      })),
      roleDistribution: Object.entries(roleStats).map(([role, count]) => ({
        role,
        count,
      })),
      recentUsers: users.slice(0, 20).map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        joinDate: new Date(user.created_at).toLocaleDateString("vi-VN"),
      })),
    };

    return reportData;
  } catch (error) {
    console.error("Error generating users report:", error);
    return null;
  }
};

// Tạo báo cáo sản phẩm
export const generateProductsReport = async (timeRange: string = "30d") => {
  try {
    // Lấy dữ liệu sản phẩm
    const { data: products } = await supabase.from("products").select("*");

    const { data: orderItems } = await supabase
      .from("order_items")
      .select(
        `
        *,
        products(*),
        orders!inner(created_at, status)
      `,
      )
      .eq("orders.status", "completed");

    if (!products || !orderItems) return null;

    // Thống kê theo category
    const categoryStats = products.reduce(
      (acc, product) => {
        acc[product.category] = (acc[product.category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Sản phẩm bán chạy
    const productSales = orderItems.reduce(
      (acc, item) => {
        const productId = item.product_id;
        if (!acc[productId]) {
          acc[productId] = {
            name: item.products?.title || "Unknown",
            category: item.products?.category || "Unknown",
            sales: 0,
            revenue: 0,
          };
        }
        acc[productId].sales += item.quantity;
        acc[productId].revenue += item.quantity * item.price;
        return acc;
      },
      {} as Record<string, any>,
    );

    const reportData = {
      summary: {
        totalProducts: products.length,
        activeProducts: products.filter((p) => p.is_active).length,
        templates: categoryStats.template || 0,
        ebooks: categoryStats.ebook || 0,
        timeRange: getTimeRangeText(timeRange),
        generatedAt: new Date().toISOString(),
      },
      categoryDistribution: Object.entries(categoryStats).map(
        ([category, count]) => ({
          category,
          count,
        }),
      ),
      topProducts: Object.values(productSales)
        .sort((a: any, b: any) => b.sales - a.sales)
        .slice(0, 10),
      productList: products.map((product) => ({
        id: product.id,
        title: product.title,
        category: product.category,
        price: product.price,
        rating: product.rating,
        isActive: product.is_active,
      })),
    };

    return reportData;
  } catch (error) {
    console.error("Error generating products report:", error);
    return null;
  }
};

// Xuất báo cáo Excel
export const exportToExcel = async (reportType: string, timeRange: string) => {
  try {
    let reportData;
    let fileName;

    switch (reportType) {
      case "Báo cáo doanh thu":
        reportData = await generateSalesReport(timeRange);
        fileName = `bao-cao-doanh-thu-${timeRange}`;
        break;
      case "Báo cáo đơn hàng": // Thêm case này
        reportData = await generateSalesReport(timeRange); // Sử dụng cùng function
        fileName = `bao-cao-don-hang-${timeRange}`;
        break;
      case "Báo cáo người dùng":
        reportData = await generateUsersReport(timeRange);
        fileName = `bao-cao-nguoi-dung-${timeRange}`;
        break;
      case "Báo cáo sản phẩm":
        reportData = await generateProductsReport(timeRange);
        fileName = `bao-cao-san-pham-${timeRange}`;
        break;
      default:
        throw new Error("Unknown report type");
    }

    if (!reportData) throw new Error("No data available");

    const workbook = XLSX.utils.book_new();

    // Sheet 1: Tổng quan
    const summaryData = Object.entries(reportData.summary).map(
      ([key, value]) => [key, value],
    );
    const summarySheet = XLSX.utils.aoa_to_sheet([
      ["Chỉ số", "Giá trị"],
      ...summaryData,
    ]);

    // Định dạng cột
    summarySheet["!cols"] = [
      { wch: 25 }, // Chỉ số
      { wch: 20 }, // Giá trị
    ];

    XLSX.utils.book_append_sheet(workbook, summarySheet, "Tổng quan");

    // Sheet 2: Chi tiết dữ liệu
    if (reportData.dailyRevenue) {
      const revenueSheet = XLSX.utils.json_to_sheet(reportData.dailyRevenue);
      revenueSheet["!cols"] = [
        { wch: 15 }, // Date
        { wch: 20 }, // Revenue
      ];
      XLSX.utils.book_append_sheet(
        workbook,
        revenueSheet,
        "Doanh thu hàng ngày",
      );
    }

    if (reportData.topProducts) {
      const productsSheet = XLSX.utils.json_to_sheet(reportData.topProducts);
      productsSheet["!cols"] = [
        { wch: 30 }, // Name
        { wch: 15 }, // Quantity/Sales
        { wch: 20 }, // Revenue
      ];
      XLSX.utils.book_append_sheet(
        workbook,
        productsSheet,
        "Sản phẩm hàng đầu",
      );
    }

    if (reportData.dailySignups) {
      const signupsSheet = XLSX.utils.json_to_sheet(reportData.dailySignups);
      signupsSheet["!cols"] = [
        { wch: 15 }, // Date
        { wch: 15 }, // Count
      ];
      XLSX.utils.book_append_sheet(workbook, signupsSheet, "Đăng ký hàng ngày");
    }

    if (reportData.recentUsers) {
      const usersSheet = XLSX.utils.json_to_sheet(reportData.recentUsers);
      usersSheet["!cols"] = [
        { wch: 25 }, // ID
        { wch: 20 }, // Name
        { wch: 25 }, // Email
        { wch: 15 }, // Role
        { wch: 15 }, // Join Date
      ];
      XLSX.utils.book_append_sheet(workbook, usersSheet, "Người dùng mới");
    }

    // Xuất file
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
      compression: true,
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const fullFileName = `${fileName}-${new Date().toISOString().split("T")[0]}.xlsx`;
    saveAs(blob, fullFileName);

    // Lưu thông tin báo cáo vào database
    await saveReportRecord({
      title: reportType,
      description: `${reportType} cho ${getTimeRangeText(timeRange)}`,
      type: getReportTypeFromName(reportType),
      format: "Excel",
      file_size: `${(blob.size / 1024 / 1024).toFixed(2)} MB`,
      data_range: timeRange,
    });

    return true;
  } catch (error) {
    console.error("Error exporting to Excel:", error);
    return false;
  }
};

// Tạo báo cáo đơn hàng riêng
export const generateOrdersReport = async (timeRange: string = "30d") => {
  try {
    const { startDate, endDate } = getDateRange(timeRange);

    // Lấy dữ liệu đơn hàng
    const { data: orders } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items(*, products(*))
      `,
      )
      .gte("created_at", startDate)
      .lte("created_at", endDate);

    if (!orders) return null;

    // Thống kê theo status
    const statusStats = orders.reduce(
      (acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Đơn hàng theo ngày
    const dailyOrders = orders.reduce(
      (acc, order) => {
        const date = new Date(order.created_at).toLocaleDateString("vi-VN");
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const reportData = {
      summary: {
        totalOrders: orders.length,
        completedOrders: statusStats.completed || 0,
        pendingOrders: statusStats.pending || 0,
        cancelledOrders: statusStats.cancelled || 0,
        timeRange: getTimeRangeText(timeRange),
        generatedAt: new Date().toISOString(),
      },
      dailyOrders: Object.entries(dailyOrders).map(([date, count]) => ({
        date,
        count,
      })),
      statusDistribution: Object.entries(statusStats).map(
        ([status, count]) => ({
          status,
          count,
        }),
      ),
      ordersList: orders.map((order) => ({
        id: order.id,
        date: new Date(order.created_at).toLocaleDateString("vi-VN"),
        status: order.status,
        total: order.total_price,
        items: order.order_items?.length || 0,
      })),
    };

    return reportData;
  } catch (error) {
    console.error("Error generating orders report:", error);
    return null;
  }
};

// Xuất báo cáo PDF
export const exportToPDF = async (reportType: string, timeRange: string) => {
  try {
    let reportData;

    switch (reportType) {
      case "Báo cáo doanh thu":
        reportData = await generateSalesReport(timeRange);
        break;
      case "Báo cáo đơn hàng": // Thêm case này
        reportData = await generateSalesReport(timeRange);
        break;
      case "Báo cáo người dùng":
        reportData = await generateUsersReport(timeRange);
        break;
      case "Báo cáo sản phẩm":
        reportData = await generateProductsReport(timeRange);
        break;
      default:
        throw new Error("Unknown report type");
    }

    if (!reportData) throw new Error("No data available");

    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.text(reportType, 20, 30);

    doc.setFontSize(12);
    doc.text(`Thời gian: ${reportData.summary.timeRange}`, 20, 45);
    doc.text(
      `Tạo lúc: ${new Date(reportData.summary.generatedAt).toLocaleString("vi-VN")}`,
      20,
      55,
    );

    // Summary table
    const summaryTableData = Object.entries(reportData.summary)
      .filter(([key]) => key !== "timeRange" && key !== "generatedAt")
      .map(([key, value]) => [key, String(value)]);

    autoTable(doc, {
      head: [["Chỉ số", "Giá trị"]],
      body: summaryTableData,
      startY: 70,
      styles: { fontSize: 10 },
    });

    // Additional data tables
    if (reportData.topProducts) {
      autoTable(doc, {
        head: [["Sản phẩm", "Số lượng bán", "Doanh thu"]],
        body: reportData.topProducts
          .slice(0, 10)
          .map((product: any) => [
            product.name,
            String(product.sales || product.quantity),
            String(product.revenue),
          ]),
        startY: (doc as any).lastAutoTable.finalY + 20,
        styles: { fontSize: 9 },
      });
    }

    if (reportData.recentUsers) {
      autoTable(doc, {
        head: [["Tên", "Email", "Vai trò", "Ngày tham gia"]],
        body: reportData.recentUsers
          .slice(0, 10)
          .map((user: any) => [
            user.name,
            user.email,
            user.role,
            user.joinDate,
          ]),
        startY: (doc as any).lastAutoTable.finalY + 20,
        styles: { fontSize: 8 },
      });
    }

    const fileName = `${reportType.toLowerCase().replace(/\s+/g, "-")}-${timeRange}-${new Date().toISOString().split("T")[0]}.pdf`;
    doc.save(fileName);

    // Lưu thông tin báo cáo vào database
    await saveReportRecord({
      title: reportType,
      description: `${reportType} cho ${getTimeRangeText(timeRange)}`,
      type: getReportTypeFromName(reportType),
      format: "PDF",
      file_size: "~1.5 MB",
      data_range: timeRange,
    });

    return true;
  } catch (error) {
    console.error("Error exporting to PDF:", error);
    return false;
  }
};

// Lưu thông tin báo cáo vào database - FIXED
const saveReportRecord = async (reportInfo: CreateReportData) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("reports").insert({
    title: reportInfo.title,
    description: reportInfo.description,
    type: reportInfo.type,
    format: reportInfo.format,
    file_size: reportInfo.file_size,
    data_range: reportInfo.data_range,
    status: "completed",
    generated_by: user?.id || "system",
    generated_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Error saving report record:", error);
  }
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
    default:
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

  return {
    startDate: startDate.toISOString(),
    endDate: now.toISOString(),
  };
};

const getTimeRangeText = (timeRange: string): string => {
  switch (timeRange) {
    case "7d":
      return "7 ngày qua";
    case "30d":
      return "30 ngày qua";
    case "90d":
      return "3 tháng qua";
    default:
      return timeRange;
  }
};

const getReportTypeFromName = (
  name: string,
): "sales" | "users" | "products" | "custom" => {
  if (name.includes("doanh thu")) return "sales";
  if (name.includes("đơn hàng")) return "sales";
  if (name.includes("người dùng")) return "users";
  if (name.includes("sản phẩm")) return "products";
  return "custom";
};

// Xóa báo cáo
export const deleteReport = async (reportId: string): Promise<boolean> => {
  const { error } = await supabase.from("reports").delete().eq("id", reportId);

  return !error;
};
