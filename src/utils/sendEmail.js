const nodemailer = require("nodemailer");

// Cấu hình transporter linh hoạt hơn cho môi trường Production
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Sử dụng SSL cho port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Đảm bảo đây là App Password 16 ký tự
  },
  // Bổ sung cấu hình TLS để tránh bị chặn trên môi trường Server (Render/Linux)
  tls: {
    rejectUnauthorized: false,
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
    return { success: true, messageId: info.messageId };

  } catch (error) {
    // Log lỗi cực kỳ chi tiết để bạn xem trên Render Logs
    console.error("❌ SMTP ERROR DETAILS:");
    console.error("- To:", to);
    console.error("- Error Code:", error.code);
    console.error("- Error Message:", error.message);
    
    // Ném lỗi ra ngoài để Service/Controller biết mà xử lý
    throw new Error(`Email Service Error: ${error.message}`);
  }
};

module.exports = sendEmail;