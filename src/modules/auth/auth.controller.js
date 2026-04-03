const authService = require("./auth.service");

  // LOGIN
const login = async (req, res, next) => {
  try {
    const data = await authService.login(req.body);

    res.json({
      success: true,
      data
    });

  } catch (err) {
    next(err);
  }
};

 // REGISTER
const register = async (req, res, next) => {
  try {
    const data = await authService.register(req.body);

    res.status(201).json({
      success: true,
      data
    });

  } catch (err) {
    next(err);
  }
};

  // VERIFY EMAIL
const verifyEmail = async (req, res, next) => {
  try {
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

    const data = await authService.forgotPassword(email);

    res.json({
      success: true,
      data
    });

  } catch (err) {
    next(err);
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