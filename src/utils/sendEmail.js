const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // port 587 luôn false
  auth: {
    user: process.env.BREVO_LOGIN,     // SMTP login 
    pass: process.env.BREVO_API_KEY,   // SMTP key 
  },

  connectionTimeout: 20000,
  greetingTimeout: 20000,
  socketTimeout: 20000,
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Dermify Team" <${process.env.EMAIL_FROM}>`, // email đã verify
      to,
      subject,
      html,
    });

    console.log(`✅ Email sent successfully to: ${to}`);
    return true;

  } catch (error) {
    console.error("❌ BREVO ERROR:");
    console.error("- To:", to);
    console.error("- Code:", error.code);
    console.error("- Message:", error.message);

    return false;
  }
};

module.exports = sendEmail;
