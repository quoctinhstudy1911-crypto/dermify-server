const nodemailer = require("nodemailer");

// Sử dụng Port 587 (STARTTLS) vì Port 465 thường bị các nhà cung cấp như Render chặn để chống spam
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Bắt buộc là false cho port 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Mã App Password 16 ký tự
  },
  // Ép buộc dùng IPv4 để tránh lỗi ENETUNREACH trước đó
  family: 4, 
  // Tăng thời gian chờ lên mức tối đa
  connectionTimeout: 30000, // 30 giây
  greetingTimeout: 30000,
  socketTimeout: 30000,
  tls: {
    // Cấu hình TLS để vượt qua các lớp bảo mật của server Linux
    rejectUnauthorized: false,
    minVersion: "TLSv1.2",
    ciphers: 'SSLv3'
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
    console.error("- Code:", error.code); // Nếu vẫn lỗi, nó sẽ hiện ở đây
    console.error("- Message:", error.message);
    
    return false;
  }
};

module.exports = sendEmail;
