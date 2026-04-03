const express = require("express");
const router = express.Router();
const reviewController = require("./review.controller");

//  Import Auth Middleware
const authMiddleware = require("../../middleware/authMiddleware");
const requireRole = require("../../middleware/requireRole");

// STEP 2: XEM ĐÁNH GIÁ CỦA SẢN PHẨM (Ai cũng xem được - Mở cửa tự do)
router.get("/:productId", reviewController.getProductReviews);

// STEP 1: TẠO ĐÁNH GIÁ (Bắt buộc đăng nhập - Có bảo vệ)
router.post("/",
     authMiddleware, requireRole("customer"), 
     reviewController.createReview);
// STEP 3: SỬA ĐÁNH GIÁ (Bắt buộc đăng nhập - Có bảo vệ)
router.put("/:reviewId",
     authMiddleware, requireRole("customer"),
      reviewController.updateReview);
// STEP 4: XÓA ĐÁNH GIÁ (Bắt buộc đăng nhập - Có bảo vệ)
router.delete("/:reviewId",
     authMiddleware, requireRole("customer", "admin", "super_admin"),
      reviewController.deleteReview);
module.exports = router;