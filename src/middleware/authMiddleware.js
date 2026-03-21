const jwt = require("jsonwebtoken");
const Account = require("../modules/account/account.model");

// Middleware xác thực JWT
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1.Kiểm tra header có tồn tại và đúng định dạng Bearer
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      const err = new Error("Unauthorized");
      err.status = 401;
      return next(err);
    }

    // 2. Lấy token từ header
    const token = authHeader.split(" ")[1];

    // 3. Xác thực token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Kiểm tra account tồn tại và không bị xóa
    const account = await Account.findById(decoded.id);

    // 5. Kiểm tra account tồn tại, không bị xóa và có trạng thái active
    if (!account) {
      const err = new Error("Account not found");
      err.status = 401;
      return next(err);
    }

    // 6. Kiểm tra account có bị xóa không
    if (!account || account.isDeleted) {
      const err = new Error("Account not found");
      err.status = 401;
      return next(err);
    }

    // 7. Kiểm tra account có trạng thái active không
    if (account.status !== "active") {
      const err = new Error("Account inactive");
      err.status = 403;
      return next(err);
    }
    
    // 8. Gắn thông tin user vào request để các middleware và route handler sau có thể sử dụng
    req.user = {
      id: account._id,
      role: account.role
    };

    next();

  } catch (err) {
    err.status = 401;
    next(err);
  }
};

module.exports = authMiddleware;