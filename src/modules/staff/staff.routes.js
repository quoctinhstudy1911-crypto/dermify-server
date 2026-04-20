const express = require("express");
const router = express.Router();

const staffController = require("./staff.controller");
const authMiddleware = require("../../middleware/authMiddleware");
const requireRole = require("../../middleware/requireRole");
const { validateCreateStaff } = require("./staff.validation");

// ==================== ROUTE STATIC TRƯỚC ROUTE DYNAMIC ====================

// Tạo Admin - Chỉ super_admin
router.post(
  "/create-admin",
  authMiddleware,
  requireRole("super_admin"),
  staffController.createAdmin
);

// GET /me - Thông tin staff hiện tại
router.get(
  "/me",
  authMiddleware,
  requireRole("staff", "admin", "super_admin"),
  staffController.getMyStaff
);

// UPDATE /me - Cập nhật info của chính mình
router.put(
  "/me",
  authMiddleware,
  requireRole("staff", "admin", "super_admin"),
  staffController.updateMyStaff
);

// ==================== ROUTES DYNAMIC ====================

// Tạo Staff
router.post(
  "/",
  authMiddleware,
  requireRole("admin", "super_admin"),
  validateCreateStaff,
  staffController.createStaff
);

// Lấy tất cả staff
router.get(
  "/",
  authMiddleware,
  requireRole("admin", "super_admin"),
  staffController.getAllStaff
);

// Lấy staff theo ID
router.get(
  "/:id",
  authMiddleware,
  requireRole("admin", "super_admin"),
  staffController.getStaffById
);

// Cập nhật staff
router.put(
  "/:id",
  authMiddleware,
  requireRole("admin", "super_admin"),
  staffController.updateStaff
);

// Xóa staff
router.delete(
  "/:id",
  authMiddleware,
  requireRole("admin", "super_admin"),
  staffController.deleteStaff
);

module.exports = router;