  const requireRole = (...roles) => {
    return (req, res, next) => {
      // chưa login
      if (!req.user) {
        const err = new Error("Unauthorized");
        err.status = 401;
        return next(err);
      }

      // không đủ quyền
      if (!roles.includes(req.user.role)) {
        const err = new Error("Forbidden");
        err.status = 403;
        return next(err);
      }

      next();
    };
  };

  module.exports = requireRole;