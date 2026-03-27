const express = require("express");
const router = express.Router();
const reviewController = require("./review.controller");

//  Import Auth Middleware
const authMiddleware = require("../../middleware/authMiddleware"); 
// STEP 1: TẠO ĐÁNH GIÁ (Bắt buộc đăng nhập - Có bảo vệ)
router.post("/", authMiddleware, reviewController.createReview);
// STEP 2: XEM ĐÁNH GIÁ CỦA SẢN PHẨM (Ai cũng xem được - Mở cửa tự do)
router.get("/:productId", reviewController.getProductReviews);
// STEP 3: SỬA ĐÁNH GIÁ (Bắt buộc đăng nhập - Có bảo vệ)
router.put("/:reviewId", authMiddleware, reviewController.updateReview);
// STEP 4: XÓA ĐÁNH GIÁ (Bắt buộc đăng nhập - Có bảo vệ)
router.delete("/:reviewId", authMiddleware, reviewController.deleteReview);
module.exports = router;