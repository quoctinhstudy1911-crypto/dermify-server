const nodemailer = require("nodemailer");

// Cấu hình sử dụng Port 587 - Thường thông thoáng hơn trên các Server Cloud như Render
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // BẮT BUỘC là false cho Port 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Mật khẩu ứng dụng 16 ký tự
  },
  
  // Ép buộc sử dụng IPv4 để tránh lỗi ENETUNREACH
  family: 4, 

  // Tăng thời gian chờ để tránh lỗi ETIMEDOUT khi mạng Render chậm
  connectionTimeout: 20000, // 20 giây
  greetingTimeout: 20000,
  socketTimeout: 20000,

  tls: {
    // Cấu hình quan trọng để Gmail chấp nhận kết nối từ Render
    rejectUnauthorized: false,
    minVersion: "TLSv1.2"
  },
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Dermify Team" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log(`✅ Email sent successfully to: ${to}`);
    return true;

  } catch (error) {
    console.error("❌ SMTP ERROR DETAILS:");
    console.error("- To:", to);
    console.error("- Code:", error.code);
    console.error("- Message:", error.message);
    
    return false;
  }
};

module.exports = sendEmail;
