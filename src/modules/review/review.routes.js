const express = require("express");
const router = express.Router();
const reviewController = require("./review.controller");
const authMiddleware = require("../../middleware/authMiddleware");
const requireRole = require("../../middleware/requireRole");

// THÊM MỚI ĐÁNH GIÁ (Bắt buộc đăng nhập - Có bảo vệ) - PHẢI TRƯỚC GET /:productId
router.post("/",
     authMiddleware, requireRole("customer"), 
     reviewController.createReview);

// CẬP NHẬT ĐÁNH GIÁ (Bắt buộc đăng nhập - Có bảo vệ)
router.put("/:reviewId",
     authMiddleware, requireRole("customer"),
      reviewController.updateReview);

// XÓA ĐÁNH GIÁ (Bắt buộc đăng nhập - Có bảo vệ)
router.delete("/:reviewId",
     authMiddleware, requireRole("customer", "admin", "super_admin"),
      reviewController.deleteReview);

// XEM DANH SÁCH ĐÁNH GIÁ CỦA SẢN PHẨM (PUBLIC) - PHẢI SAU CÁC STATIC ROUTES
router.get("/:productId", reviewController.getProductReviews);
module.exports = router;