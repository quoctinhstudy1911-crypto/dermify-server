const authService = require("./auth.service");

// LOGIN
const login = async (req, res, next) => {
  try {
    const data = await authService.login(req.body); // Sửa từ register thành login
    res.json({ success: true, data }); // Login thường trả về 200, không phải 201
  } catch (err) {
    next(err);
  }
};

// REGISTER
const register = async (req, res, next) => {
  try {
    const data = await authService.register(req.body); // Sửa từ login thành register
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

  // VERIFY EMAIL
const verifyEmail = async (req, res, next) => {
  try {
    // Lấy token từ query parameters
    const { token } = req.query;

    const data = await authService.verifyEmail(token);

    res.json({
      success: true,
      data
    });

  } catch (err) {
    next(err);
  }
};

  // REFRESH TOKEN
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    const data = await authService.refreshTokenService(refreshToken);

    res.json({
      success: true,
      data
    });

  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    const data = await authService.getMe(req.user.id);

    res.json({
      success: true,
      data
    });
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    const data = await authService.logout(req.user.id);

    res.json({
      success: true,
      data
    });
  } catch (err) {
    next(err);
  }
};

  //  FORGOT PASSWORD
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    await authService.forgotPassword(email);

    return res.status(200).json({
      success: true,
      message: "Nếu email tồn tại, chúng tôi đã gửi hướng dẫn"
    });

  } catch (err) {
    // Log lỗi chi tiết để dễ dàng debug, bao gồm email đã yêu cầu và thông tin lỗi
    console.error("Forgot password error:", err);
    
    // Trả về thông báo chung để tránh lộ thông tin về email đã đăng ký hay chưa
    return res.status(200).json({
      success: true,
      message: "Nếu email tồn tại, chúng tôi đã gửi hướng dẫn"
    });
  }
};

  //  RESET PASSWORD
const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    const data = await authService.resetPassword(token, password);

    res.json({
      success: true,
      data
    });

  } catch (err) {
    next(err);
  }
};

module.exports = {
  login,
  register,
  verifyEmail,
  refreshToken,
  getMe,
  logout,
  forgotPassword,
  resetPassword
};
