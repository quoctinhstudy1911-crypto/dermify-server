const nodemailer = require("nodemailer");

// Tạo transporter với cấu hình ép buộc IPv4 và tăng thời gian chờ
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Chạy trên port 465 bắt buộc secure: true
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  
  // 1. ÉP BUỘC DÙNG IPV4 Ở MỨC KẾT NỐI
  family: 4, 

  // 2. TĂNG THỜI GIAN CHỜ (Để tránh mạng Render chập chờn gây lỗi ESOCKET)
  connectionTimeout: 20000, // 20 giây
  greetingTimeout: 20000,
  socketTimeout: 20000,

  // 3. CẤU HÌNH TLS CHI TIẾT
  tls: {
    rejectUnauthorized: false, // Bỏ qua lỗi chứng chỉ không khớp trên server Linux
    minVersion: "TLSv1.2"      // Ép dùng phiên bản TLS ổn định nhất cho Gmail
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
    
    // Nếu vẫn lỗi ENETUNREACH, hãy kiểm tra lại NODE_OPTIONS trên Render Dashboard
    return false;
  }
};

module.exports = sendEmail;
