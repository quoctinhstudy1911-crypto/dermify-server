const authService = require("./auth.service");

// Xử lý đăng nhập cho admin và customer
const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);

    res.json({
      success: true,
      data: result
    });

  } catch (err) {
    next(err);
  }
  
};

const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);

    res.json({
      success: true,
      data: result
    });

  } catch (err) {
    next(err);
  }
};

module.exports = { login, register };