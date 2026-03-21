const express = require("express");
const router = express.Router();
const authController = require("./auth.controller");
const { validateRegister } = require("./auth.validation");

// Đăng nhập cho cả admin và customer
router.post("/login", authController.login);

// Đăng ký chỉ dành cho customer, admin sẽ được tạo thủ công trong database
router.post("/register", validateRegister, authController.register);

module.exports = router;