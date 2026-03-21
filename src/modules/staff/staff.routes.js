const express = require("express");
const router = express.Router();

const staffController = require("./staff.controller");
const authMiddleware = require("../../middleware/authMiddleware");
const requireRole = require("../../middleware/requireRole");
const { validateCreateStaff } = require("./staff.validation");

// Tất cả route trong staff.routes.js đều yêu cầu xác thực JWT và role admin hoặc super_admin
router.post(
  "/",
  authMiddleware,
  requireRole("admin", "super_admin"),
  validateCreateStaff,
  staffController.createStaff
);

router.get(
  "/",
  authMiddleware,
  requireRole("admin", "super_admin"),
  staffController.getAllStaff
);

router.get(
  "/:id",
  authMiddleware,
  requireRole("admin", "super_admin"),
  staffController.getStaffById
);

router.put(
  "/:id",
  authMiddleware,
  requireRole("admin", "super_admin"),
  staffController.updateStaff
);

router.delete(
  "/:id",
  authMiddleware,
  requireRole("admin", "super_admin"),
  staffController.deleteStaff
);

router.post(
  "/create-admin",
  authMiddleware,
  requireRole("super_admin"),
  staffController.createAdmin
);

module.exports = router;