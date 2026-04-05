const SibApiV3Sdk = require("sib-api-v3-sdk");

const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

const sendEmail = async ({ to, subject, html }) => {
  try {
    await apiInstance.sendTransacEmail({
      sender: {
        email: process.env.EMAIL_FROM,
        name: "Dermify Team",
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    });

    console.log("✅ Email sent:", to);
    return true;
  } catch (error) {
    console.error("❌ BREVO API ERROR:");
    console.error("- To:", to);
    console.error("- Message:", error.message);

    return false;
  }
};

module.exports = sendEmail;
