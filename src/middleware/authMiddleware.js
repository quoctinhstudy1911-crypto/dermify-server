const jwt = require("jsonwebtoken");
const Account = require("../modules/account/account.model");

// Middleware xác thực JWT
const authMiddleware = async (req, res, next) => {
  try {
    // 1. lấy header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      const err = new Error("Chưa đăng nhập");
      err.status = 401;
      return next(err);
    }

    // 2. lấy token
    const token = authHeader.split(" ")[1];

    // 3. verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. tìm account
    const account = await Account.findById(decoded.id);

    if (!account) {
      const err = new Error("Tài khoản không tồn tại");
      err.status = 401;
      return next(err);
    }

    if (account.isDeleted) {
      const err = new Error("Tài khoản đã bị xoá");
      err.status = 403;
      return next(err);
    }

    if (account.status !== "active") {
      const err = new Error("Tài khoản chưa được kích hoạt");
      err.status = 403;
      return next(err);
    }

    // 5. gắn user vào request
    req.user = {
      id: account._id,
      role: account.role
    };

    next();

  } catch (err) {
    next(err); // sẽ vào errorHandler (JWT lỗi tự xử lý luôn)
  }
};

module.exports = authMiddleware;