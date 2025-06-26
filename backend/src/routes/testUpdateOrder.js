// testUpdateOrder.js

require("dotenv").config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// --- ID ĐƠN HÀNG ĐỂ TEST ---
// Đảm bảo đơn hàng này đang ở trạng thái 'pending' trong Supabase của bạn.
// Nếu nó đã 'completed', bạn có thể tạo một đơn hàng mới từ frontend và lấy ID của nó.
const ORDER_ID_TO_TEST = "3b405b00-5636-4991-b36e-d93d534b517e";
// Nếu '3b405b00-...' đã completed, hãy tạo một đơn hàng MỚI từ frontend
// và dán ID của đơn hàng MỚI đang pending vào đây.
// ----------------------------

async function testUpdateOrder() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error(
      "🚨 Lỗi: SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY không được cấu hình trong .env"
    );
    console.error("Vui lòng kiểm tra file .env của bạn.");
    return;
  }

  console.log(`\n--- Bắt đầu kiểm tra cập nhật đơn hàng ---`);
  console.log(`Đang cố gắng cập nhật đơn hàng ID: ${ORDER_ID_TO_TEST}`);
  console.log(`Sử dụng Supabase URL: ${SUPABASE_URL}`);
  console.log(
    `Sử dụng Service Role Key: ${SUPABASE_SERVICE_KEY ? "Đã có" : "Chưa có"}`
  );

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/orders?id=eq.${ORDER_ID_TO_TEST}`,
      {
        method: "PATCH",
        headers: {
          apikey: SUPABASE_SERVICE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
          "Content-Type": "application/json",
          // KHÔNG CẦN THAY ĐỔI DÒNG NÀY NỮA, vì trigger mới sẽ dùng session_user='supabase_admin'
          "X-Client-Info": "application-name=sepay_webhook",
        },
        body: JSON.stringify({
          status: "completed",
          payment_status: "completed",
          payment_confirmed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }),
      }
    );

    const responseText = await response.text();
    console.log(`\n📝 Phản hồi từ Supabase (HTTP Status: ${response.status}):`);
    console.log(responseText);

    if (response.ok) {
      console.log(`\n✅ CẬP NHẬT THÀNH CÔNG!`);
      console.log(
        `Đơn hàng ${ORDER_ID_TO_TEST} đã được cập nhật thành 'completed'.`
      );
      console.log(`Vui lòng kiểm tra trong Supabase Dashboard.`);

      // Bạn có thể thêm logic để kiểm tra payment_transactions và downloads ở đây
      // vì chúng ta biết updateOrderToPaid hoạt động khi gọi từ backend.
    } else {
      console.error(`\n❌ CẬP NHẬT THẤT BẠI!`);
      console.error(`Lỗi HTTP Code: ${response.status}`);
      console.error(`Chi tiết lỗi từ Supabase: ${responseText}`);
      console.error(`Nguyên nhân phổ biến:`);
      console.error(
        `1. Đảm bảo bạn đã chạy câu lệnh SQL để cập nhật trigger với 'session_user = supabase_admin'.`
      );
      console.error(
        `2. Đơn hàng ID (${ORDER_ID_TO_TEST}) không tồn tại hoặc đã bị xóa / không ở trạng thái pending.`
      );
    }
  } catch (error) {
    console.error(`\n🚨 Lỗi trong quá trình gọi API:`, error);
    console.error(`Kiểm tra:`);
    console.error(`1. Kết nối internet.`);
    console.error(`2. SUPABASE_URL có đúng không.`);
  }
  console.log(`\n--- Kết thúc kiểm tra ---`);
}

testUpdateOrder();
