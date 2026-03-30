const express = require("express");
const router = express.Router();
const authController = require("./auth.controller");
const { validateRegister } = require("./auth.validation");
const authMiddleware = require("../../middleware/authMiddleware");

// ==========================================
// PUBLIC ROUTES (Ai cũng có thể truy cập)
// ==========================================

// Đăng ký tài khoản mới
router.post("/register", validateRegister, authController.register);

// Đăng nhập
router.post("/login", authController.login);

// Xác thực Email qua link gửi về hộp thư
router.get("/verify-email", authController.verifyEmail);

// Làm mới Access Token khi hết hạn
router.post("/refresh-token", authController.refreshToken);

// Yêu cầu gửi link quên mật khẩu
router.post("/forgot-password", authController.forgotPassword);

// Đặt lại mật khẩu mới từ link email
router.post("/reset-password", authController.resetPassword);


// ==========================================
// PRIVATE ROUTES (Phải Đăng nhập - Có Token mới vào được)
// ==========================================

// Lấy thông tin cá nhân của người đang đăng nhập
router.get("/me", authMiddleware, authController.getMe);

// Đăng xuất (Xóa refresh token trong DB)
router.post("/logout", authMiddleware, authController.logout);


module.exports = router;