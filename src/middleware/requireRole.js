const requireRole = (...roles) => {
  return (req, res, next) => {

    // 1. chưa login
    if (!req.user) {
      const err = new Error("Chưa đăng nhập");
      err.status = 401;
      return next(err);
    }

    // 2. không truyền role nào thì mặc định cho qua
    if (!roles || roles.length === 0) {
      return next();
    }

    // 3. check quyền
    if (!roles.includes(req.user.role)) {
      const err = new Error("Bạn không có quyền truy cập tài nguyên này");
      err.status = 403;
      return next(err);
    }

    next();
  };
};

module.exports = requireRole;