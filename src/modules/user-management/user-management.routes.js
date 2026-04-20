const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");
const requireRole = require("../../middleware/requireRole");
const userManagementController = require("./user-management.controller");

/**
 * Tất cả các tuyến đường bên dưới yêu cầu:
 * 1. Đã đăng nhập (authMiddleware)
 * 2. Phải có quyền Quản trị viên (admin) hoặc Quản trị viên cấp cao (super_admin)
 */

// ======================================================
// QUẢN LÝ TÀI KHOẢN NGƯỜI DÙNG
// ======================================================

/**
 * @route   GET /api/users
 * @desc    Lấy danh sách người dùng (Khách hàng + Nhân viên) kèm phân trang và bộ lọc
 */
router.get(
  "/",
  authMiddleware,
  requireRole("admin", "super_admin"),
  userManagementController.getAllUsers
);

/**
 * @route   POST /api/users
 * @desc    Khởi tạo tài khoản khách hàng mới
 */
router.post(
  "/",
  authMiddleware,
  requireRole("admin", "super_admin"),
  userManagementController.createUser
);

/**
 * @route   PUT /api/users/:id
 * @desc    Cập nhật trạng thái hoạt động (Active/Banned) của người dùng
 */
router.put(
  "/:id",
  authMiddleware,
  requireRole("admin", "super_admin"),
  userManagementController.updateUserStatus
);

/**
 * @route   DELETE /api/users/:id
 * @desc    Xóa người dùng khỏi hệ thống (Xóa mềm)
 */
router.delete(
  "/:id",
  authMiddleware,
  requireRole("admin", "super_admin"),
  userManagementController.deleteUser
);

module.exports = router;