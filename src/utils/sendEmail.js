const SibApiV3Sdk = require("sib-api-v3-sdk");

// 1. Khởi tạo Client
const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications["api-key"];
// Đảm bảo bạn đã đặt BREVO_API_KEY trên Render Dashboard
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

const sendEmail = async ({ to, subject, html }) => {
  try {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = html;
    // EMAIL_FROM phải là email bạn đã Verify (xác nhận) trên Brevo
    sendSmtpEmail.sender = { 
      name: "Dermify Team", 
      email: process.env.EMAIL_FROM 
    };
    sendSmtpEmail.to = [{ email: to }];

    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("✅ Brevo Email Sent Successfully. ID:", data.messageId);
    return true;

  } catch (error) {
    console.error("❌ BREVO API ERROR:");
    // Lấy lỗi chi tiết từ Server Brevo trả về
    const errorDetail = error.response ? error.response.body : error.message;
    console.error("- Detail:", errorDetail);
    return false;
  }
};

module.exports = sendEmail;