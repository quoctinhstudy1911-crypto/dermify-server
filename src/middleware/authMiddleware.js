const jwt = require("jsonwebtoken");
const Account = require("../modules/account/account.model");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // ❌ không có token
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      const err = new Error("Unauthorized");
      err.status = 401;
      return next(err);
    }

    const token = authHeader.split(" ")[1];

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // tìm account
    const account = await Account.findById(decoded.id);

    if (!account) {
      const err = new Error("Account not found");
      err.status = 401;
      return next(err);
    }
    if (!account || account.isDeleted) {
      const err = new Error("Account not found");
      err.status = 401;
      return next(err);
    }

    if (account.status !== "active") {
      const err = new Error("Account inactive");
      err.status = 403;
      return next(err);
    }
    
    // gắn user vào request
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