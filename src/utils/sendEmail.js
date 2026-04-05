const nodemailer = require("nodemailer");

// Cấu hình transporter chuyên dụng cho môi trường Cloud/Hosting
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Sử dụng SSL cho port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Đảm bảo đây là App Password 16 ký tự
  },
  
  // --- ĐÂY LÀ PHẦN QUAN TRỌNG ĐỂ FIX LỖI ENETUNREACH ---
  family: 4, // Ép nodemailer sử dụng IPv4 thay vì IPv6
  
  tls: {
    // Giúp tránh lỗi chứng chỉ (certificate) trên một số server Linux
    rejectUnauthorized: false, 
  },
});

/**
 * Hàm gửi email
 * @param {Object} params - { to, subject, html }
 * @returns {Boolean} - Trả về true nếu thành công, false nếu thất bại
 */
const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Dermify Team" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log(`✅ Email sent successfully to: ${to}`);
    // Bạn có thể log thêm messageId để kiểm soát: console.log("Message ID:", info.messageId);
    return true;

  } catch (error) {
    // Log lỗi chi tiết để bạn xem trên Render Dashboard -> Logs
    console.error("❌ SMTP ERROR DETAILS:");
    console.error("- To:", to);
    console.error("- Code:", error.code); // Sẽ hiện ENETUNREACH nếu chưa fix được
    console.error("- Message:", error.message);
    
    return false;
  }
};

module.exports = sendEmail;
