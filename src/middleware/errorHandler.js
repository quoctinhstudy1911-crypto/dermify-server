module.exports = (err, req, res, next) => {
  console.error(err); // log lỗi

  // Mongo duplicate key
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: "Email đã tồn tại"
    });
  }

  // JWT lỗi
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Token không hợp lệ"
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token đã hết hạn"
    });
  }

  const status = err.status || 500;

  res.status(status).json({
    success: false,
    message: err.message || "Lỗi hệ thống"
  });
};