const express = require("express");
const router = express.Router();
const customerController = require("./customer.controller");
const authMiddleware = require("../../middleware/authMiddleware");
const upload = require("../../middleware/upload");

// BỘ ROUTES /api/customer

// Thông tin cá nhân
router.get("/profile", authMiddleware, customerController.getProfile);
router.put("/profile", authMiddleware, customerController.updateProfile);

// Địa chỉ
router.get("/addresses", authMiddleware, customerController.getAddresses);
router.post("/address", authMiddleware, customerController.addAddress);
router.put("/address/:id", authMiddleware, customerController.updateAddress);
router.delete("/address/:id", authMiddleware, customerController.deleteAddress);

// Đặt địa chỉ mặc định
router.put(
  "/address/:id/default",
  authMiddleware,
  customerController.setDefaultAddress
);

// Upload avatar
router.post(
  "/upload-avatar",
  authMiddleware,
  upload.single("avatar"),
  customerController.uploadAvatar
);

module.exports = router;