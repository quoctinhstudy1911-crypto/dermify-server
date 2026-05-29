  const jwt = require("jsonwebtoken");
  const bcrypt = require("bcrypt");
  const mongoose = require("mongoose");

  const Account = require("../account/account.model");
  const Customer = require("../customer/customer.model");
  const sendEmail = require("../../utils/sendEmail");
  const { GetEmailEventReportEvents } = require("sib-api-v3-sdk");

  // REGISTER
  const register = async ({ email, password, name, phone }) => {

    const cleanEmail = email.trim().toLowerCase();

    const existing = await Account.findOne({ email: cleanEmail });
    if (existing) {
      const err = new Error("Email đã tồn tại");
      err.status = 400;
      throw err;
    }

    const hashed = await bcrypt.hash(password, 10);

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const createdAccounts = await Account.create([{
        email: cleanEmail,
        password: hashed,
        role: "customer",
        status: "pending"
      }], { session });

      const newAccount = createdAccounts[0];

      await Customer.create([{
        accountId: newAccount._id,
        name: name.trim(),
        phone: phone.trim().replace(/\s/g, "")
      }], { session });

      await session.commitTransaction();

      const verifyToken = jwt.sign(
        { id: newAccount._id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      const baseUrl = (process.env.CLIENT_URL || "http://localhost:5173").replace(/\/$/, "");
      const verifyLink = `${baseUrl}/verify-email?token=${verifyToken}`;

      await sendEmail({
        to: cleanEmail,
        subject: "Xác thực tài khoản Dermify",
        html: verificationEmailTemplate(verifyLink)
      });

     return {
        message: "Đăng ký thành công"
      };

    } catch (err) {
      if (session.inTransaction()) {
        await session.abortTransaction();
      }
      throw err;
    } finally {
      session.endSession();
    }
  };

    // verification email template
  const verificationEmailTemplate = (verifyUrl) => {
    return `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
        <div style="background-color: #000; padding: 20px; text-align: center;">
          <h1 style="color: #fff; margin: 0; letter-spacing: 2px;">DERMIFY</h1>
        </div>
        <div style="padding: 40px; color: #333; line-height: 1.6;">
          <h2 style="color: #000;">Xác thực tài khoản của bạn</h2>
          <p>Chào mừng bạn đến với <b>Dermify</b>! Chúng tôi rất vui khi bạn đồng hành cùng cộng đồng chăm sóc da của chúng tôi.</p>
          <p>Vui lòng nhấn vào nút bên dưới để hoàn tất quá trình đăng ký và kích hoạt tài khoản:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verifyUrl}" style="background-color: #000; color: #fff; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Xác thực Email ngay
            </a>
          </div>
          <p style="font-size: 0.9em; color: #666;">Link này sẽ hết hạn trong vòng 24 giờ. Nếu bạn không thực hiện yêu cầu này, hãy bỏ qua email này.</p>
        </div>
        <div style="background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 0.8em; color: #999;">
          <p>&copy; 2026 Dermify Project - STU University</p>
        </div>
      </div>
    `;
  };
      // VERIFY EMAIL
  const verifyEmail = async (token) => {

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      err.message = "Token không hợp lệ hoặc đã hết hạn";
      err.status = 400;
      throw err;
    }

    const account = await Account.findById(decoded.id);

    if (!account) {
      const err = new Error("Không tìm thấy tài khoản"); 
      err.status = 404;
      throw err;
    }

    if (account.status === "active") {
      return { message: "Tài khoản đã được xác thực" };
    }

    account.status = "active";
    await account.save();

    return { message: "Xác thực thành công" };
  };

    // LOGIN
  const login = async ({ email, password}) => {

    // select +password vì trường password trong schema đã set select: false 
    // để tránh bị trả về khi query thông thường, nhưng ở đây mình cần dùng password để so sánh nên phải select nó lên
    const account = await Account.findOne({ email }).select("+password");

    if (!account) {
      const err = new Error("Sai email hoặc mật khẩu");
      err.status = 401;
      throw err;
    }

    if (account.isDeleted) {
      const err = new Error("Tài khoản đã bị xoá");
      err.status = 403;
      throw err;
    }

    if (account.status === "pending") {
      const err = new Error("Vui lòng xác thực email");
      err.status = 403;
      throw err;
    }

    if (account.status !== "active") {
      const err = new Error("Tài khoản bị khoá");
      err.status = 403;
      throw err;
    }

    const isMatch = await bcrypt.compare(password, account.password);

    if (!isMatch) {
      const err = new Error("Sai email hoặc mật khẩu");
      err.status = 401;
      throw err;
    }

    // tạo token
    const accessToken = jwt.sign(
      { id: account._id, role: account.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: account._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    account.refreshToken = refreshToken;
    account.lastLogin = new Date();

    await account.save();

    return {
      accessToken,
      refreshToken,
      role: account.role
    };
  };

    // REFRESH TOKEN
  const refreshTokenService = async (token) => {
    if (!token) {
      const err =  new Error("Thiếu refresh token");
      err.status = 400;
      throw err;
   
    }

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      const error  =  new Error("Refresh token không hợp lệ");
      error.status = 401;
      throw error ;
    }

    const account = await Account.findById(decoded.id);

    if (!account || account.refreshToken !== token) {
      const err = new Error("Refresh token không hợp lệ");
      err.status = 401;
      throw err;
    }

    const newAccessToken = jwt.sign(
      { id: account._id, role: account.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    return {
      accessToken: newAccessToken
    };
  };

    // GET ME
  const getMe = async (userId) => {
    const account = await Account.findById(userId);

    if (!account) {
        const err = new Error("Không tìm thấy user");
        err.status = 404;
      throw err;
       
    }

    return {
      id: account._id,
      email: account.email,
      role: account.role
    };
  };
    // LOGOUT
  const logout = async (userId) => {
    const account = await Account.findById(userId);

    if (!account) {
      const err = new Error("Không tìm thấy user");
      err.status = 404;
      throw err;
    }

    account.refreshToken = null;
    await account.save();

    return { message: "Đăng xuất thành công" };
  };

    // FORGOT PASSWORD email template
  const resetPasswordEmailTemplate = (resetLink) => {
    return `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
        <div style="background-color: #000; padding: 20px; text-align: center;">
          <h1 style="color: #fff; margin: 0; letter-spacing: 2px;">DERMIFY</h1>
        </div>
        <div style="padding: 40px; color: #333; line-height: 1.6;">
          <h2 style="color: #000;">Yêu cầu đặt lại mật khẩu</h2>
          <p>Chào bạn,</p>
          <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản Dermify gắn liền với email này.</p>
          <p>Vui lòng nhấn vào nút bên dưới để tiến hành đặt mật khẩu mới:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #d9534f; color: #fff; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              Đặt lại mật khẩu
            </a>
          </div>
          <p style="font-size: 0.9em; color: #666;"><b>Lưu ý:</b> Link này chỉ có hiệu lực trong vòng <b>15 phút</b>. Nếu bạn không yêu cầu thay đổi này, hãy bỏ qua email để đảm bảo an toàn cho tài khoản.</p>
        </div>
        <div style="background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 0.8em; color: #999;">
          <p>&copy; 2026 Dermify Project - STU University</p>
        </div>
      </div>
    `;
  };

  const forgotPassword = async (email) => {
    // 1. Kiểm tra account
    const account = await Account.findOne({ email, isDeleted: false });

    // Nếu không tìm thấy account nào với email đó, chúng ta sẽ không trả về lỗi để tránh lộ thông tin về email đã đăng ký hay chưa. Thay vào đó, sẽ trả về thông báo chung.
    if (!account) {
      return { success: true };
    }

    // 2. Tạo Reset Token (Dùng secret riêng hoặc thêm mật khẩu cũ vào payload để token chỉ dùng được 1 lần)
    const resetToken = jwt.sign(
      { id: account._id },
      process.env.JWT_SECRET, 
      { expiresIn: "15m" }
    );

    // 3. Tạo link dẫn về Frontend React
    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    // 4. Gửi email với giao diện đẹp
    try {
      await sendEmail({
        to: email,
        subject: "[Dermify] Khôi phục mật khẩu của bạn",
        html: resetPasswordEmailTemplate(resetLink)
      });

    } catch (error) {
      console.error("Lỗi gửi email quên mật khẩu:", error.message);
    }
    // 5. LUÔN return thành công
    return { success: true };
  };

  // RESET PASSWORD 
  const resetPassword = async (token, newPassword) => {
    let decoded;
    try 
    {
          decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err)
    {
          const error = new Error("Token không hợp lệ hoặc đã hết hạn");
  error.status = 400;
  throw error;
    }
   

    const account = await Account.findById(decoded.id);

    if (!account) {
       const err = new Error("Không tìm thấy user");
  err.status = 404;
  throw err;
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    account.password = hashed;
    account.refreshToken = null; // logout tất cả
    await account.save();

    return { message: "Đổi mật khẩu thành công" };
  };

  module.exports = {
    register,
    verifyEmail,
    login,
    refreshTokenService,
    getMe,
    logout,
    forgotPassword,
    resetPassword
  };
