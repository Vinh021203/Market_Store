import { supabase } from "@/lib/supabase";

export interface DashboardStats {
  totalProducts: number;
  templates: number;
  ebooks: number;
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  totalDownloads: number;
  avgRating: number;
  recentOrders: any[];
  topProducts: any[];
  monthlyGrowth: {
    revenue: number;
    orders: number;
    users: number;
  };
}

// Lấy thống kê tổng quan
export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    // Thống kê sản phẩm
    const { count: totalProducts } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true });

    const { count: templates } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("category", "template");

    const { count: ebooks } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("category", "ebook");

    // Thống kê người dùng
    const { count: totalUsers } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });

    // Thống kê đơn hàng
    const { count: totalOrders } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true });

    // Tính tổng doanh thu
    const { data: revenueData } = await supabase
      .from("orders")
      .select("total_price")
      .eq("status", "completed");

    const totalRevenue = revenueData?.reduce((sum, order) => sum + (order.total_price || 0), 0) || 0;

    // Thống kê downloads
    const { count: totalDownloads } = await supabase
      .from("downloads")
      .select("*", { count: "exact", head: true });

    // Tính rating trung bình
    const { data: ratingData } = await supabase
      .from("products")
      .select("rating");

    const avgRating = ratingData?.length 
      ? ratingData.reduce((sum, p) => sum + p.rating, 0) / ratingData.length 
      : 0;

    // Đơn hàng gần đây
    const { data: recentOrdersData } = await supabase
      .from("orders")
      .select(`
        *,
        order_items(*, products(*))
      `)
      .order("created_at", { ascending: false })
      .limit(5);

    // Top sản phẩm
    const { data: topProductsData } = await supabase
      .from("products")
      .select("*")
      .order("review_count", { ascending: false })
      .limit(5);

    // Tính growth (so với tháng trước)
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const { count: lastMonthOrders } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .gte("created_at", lastMonth.toISOString());

    const { count: lastMonthUsers } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .gte("created_at", lastMonth.toISOString());

    const { data: lastMonthRevenue } = await supabase
      .from("orders")
      .select("total_price")
      .eq("status", "completed")
      .gte("created_at", lastMonth.toISOString());

    const lastMonthRevenueTotal = lastMonthRevenue?.reduce((sum, order) => sum + (order.total_price || 0), 0) || 0;

    return {
      totalProducts: totalProducts || 0,
      templates: templates || 0,
      ebooks: ebooks || 0,
      totalUsers: totalUsers || 0,
      totalOrders: totalOrders || 0,
      totalRevenue,
      totalDownloads: totalDownloads || 0,
      avgRating: Number(avgRating.toFixed(1)),
      recentOrders: recentOrdersData || [],
      topProducts: topProductsData || [],
      monthlyGrowth: {
        revenue: lastMonthRevenueTotal > 0 ? ((totalRevenue - lastMonthRevenueTotal) / lastMonthRevenueTotal * 100) : 0,
        orders: lastMonthOrders ? ((totalOrders || 0) - lastMonthOrders) / lastMonthOrders * 100 : 0,
        users: lastMonthUsers ? ((totalUsers || 0) - lastMonthUsers) / lastMonthUsers * 100 : 0,
      },
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      totalProducts: 0,
      templates: 0,
      ebooks: 0,
      totalUsers: 0,
      totalOrders: 0,
      totalRevenue: 0,
      totalDownloads: 0,
      avgRating: 0,
      recentOrders: [],
      topProducts: [],
      monthlyGrowth: { revenue: 0, orders: 0, users: 0 },
    };
  }
};

// Lấy dữ liệu cho chart
export const getChartData = async () => {
  try {
    // Doanh thu 7 ngày qua
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const revenueData = await Promise.all(
      last7Days.map(async (date) => {
        const { data } = await supabase
          .from("orders")
          .select("total_price")
          .eq("status", "completed")
          .gte("created_at", `${date}T00:00:00`)
          .lt("created_at", `${date}T23:59:59`);

        const revenue = data?.reduce((sum, order) => sum + (order.total_price || 0), 0) || 0;
        return { date, revenue };
      })
    );

    return revenueData;
  } catch (error) {
    console.error("Error fetching chart data:", error);
    return [];
  }
};
