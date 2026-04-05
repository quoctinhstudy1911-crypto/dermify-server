// Sử dụng nodemailer để gửi email, bạn cần cài đặt nó bằng lệnh: npm install nodemailer
const nodemailer = require("nodemailer");

// Tạo transporter để cấu hình dịch vụ email, ở đây sử dụng Gmail. Bạn cần cung cấp thông tin đăng nhập email của mình qua biến môi trường.
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

//  Hàm gửi email, nhận vào đối tượng chứa địa chỉ người nhận, tiêu đề và nội dung email (dưới dạng HTML)
const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"Dermify Team" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });

    console.log(`Email sent to ${to}`);
    return true;

  } catch (error) {
    // Log lỗi chi tiết để dễ dàng debug, bao gồm địa chỉ người nhận và thông tin lỗi
    console.error("❌ Email error:", {
      to,
      error: error.message
    });

    // Trả về false nếu có lỗi xảy ra, để các phần khác của ứng dụng có thể xử lý tình huống này (ví dụ: hiển thị thông báo lỗi cho người dùng)
    return false;
  }
};

module.exports = sendEmail;