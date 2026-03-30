const requireRole = (...roles) => {
  return (req, res, next) => {

    // 1. chưa login
    if (!req.user) {
      const err = new Error("Chưa đăng nhập");
      err.status = 401;
      return next(err);
    }

    // 2. nếu không truyền role → cho qua
    if (!roles || roles.length === 0) {
      return next();
    }

    // 3. check quyền
    if (!roles.includes(req.user.role)) {
      const err = new Error("Không có quyền truy cập");
      err.status = 403;
      return next(err);
    }

    next();
  };
};

module.exports = requireRole;