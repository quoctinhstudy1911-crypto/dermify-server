const reviewService = require("./review.service");
const Customer = require("../customer/customer.model")
// [POST] /api/reviews
const createReview = async (req, res, next) => {
    try {
        const { productId, rating, comment, images } = req.body;

        // 1. Lấy Account ID từ Token
        const accountId = req.user.id; 

        // 2. TÌM CUSTOMER TƯƠNG ỨNG VỚI ACCOUNT ID NÀY
        const customer = await Customer.findOne({ accountId: accountId });
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy hồ sơ khách hàng hợp lệ!"
            });
        }

        // 3. LẤY ĐÚNG CUSTOMER ID ĐỂ LƯU VÀO REVIEW
        const userId = customer._id;

        // Validate cơ bản
        if (!productId || !rating) {
            return res.status(400).json({
                success: false,
                message: "Thiếu thông tin bắt buộc (productId, rating)!"
            });
        }

        const reviewData = {
            productId,
            userId, // Bây giờ nó là Customer ID chuẩn rồi!
            rating,
            comment,
            images
        };

        const newReview = await reviewService.createReview(reviewData);

        return res.status(201).json({
            success: true,
            message: "Cảm ơn bạn đã đánh giá sản phẩm!",
            data: newReview
        });

    } catch (error) {
        if (error.message === "ALREADY_REVIEWED") {
            return res.status(400).json({
                success: false,
                message: "Bạn đã đánh giá sản phẩm này rồi, không thể đánh giá thêm!"
            });
        }
        if (error.message === "PRODUCT_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: "Sản phẩm không tồn tại hoặc đã bị xóa!"
            });
        }
        return res.status(500).json({
            success: false,
            message: "Lỗi Server: " + error.message
        });
    }
};

// [GET] /api/reviews/:productId
const getProductReviews = async (req, res, next) => {
    try {
        // Lấy ID sản phẩm từ trên thanh URL (Params)
        const { productId } = req.params;

        // Lấy page, limit từ Query string (nếu có)
        const query = req.query;

        const result = await reviewService.getReviewsByProduct(productId, query);

        return res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Lỗi Server: " + error.message
        });
    }
};

// [PUT] /api/reviews/:reviewId
const updateReview = async (req, res, next) => {
    try {
        const { reviewId } = req.params; // Lấy ID của bài review trên URL
        const { rating, comment, images } = req.body; // Lấy nội dung mới gửi lên
        
        // 1. Giống hệt STEP 1: Lấy Customer ID từ Account ID (Thẻ VIP)
        const accountId = req.user.id; 
        const customer = await Customer.findOne({ accountId: accountId });
        
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy hồ sơ khách hàng hợp lệ!"
            });
        }
        const userId = customer._id;

        // 2. Truyền sang Service để xử lý
        const updatedReview = await reviewService.updateReview(reviewId, userId, {
            rating,
            comment,
            images
        });

        return res.status(200).json({
            success: true,
            message: "Cập nhật bài đánh giá thành công!",
            data: updatedReview
        });

    } catch (error) {
        if (error.message === "REVIEW_NOT_FOUND") {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy bài đánh giá này!"
            });
        }
        if (error.message === "UNAUTHORIZED_EDIT") {
            return res.status(403).json({ // 403 Forbidden: Cấm vào!
                success: false,
                message: "Bạn không có quyền chỉnh sửa bài đánh giá của người khác!"
            });
        }
        return res.status(500).json({
            success: false,
            message: "Lỗi Server: " + error.message
        });
    }
};


// [DELETE] /api/reviews/:reviewId
const deleteReview = async (req, res, next) => {
    try {
        const { reviewId } = req.params;
        
        // 1. Lấy Account ID và ROLE từ thẻ VIP
        const accountId = req.user.id; 
        const role = req.user.role; // Sẽ là "customer" hoặc "admin"
        
        let userId = null;

        // 2. PHÂN LUỒNG: Chỉ nếu là Customer thì mới đi tìm Customer ID
        if (role === "customer") {
            const customer = await Customer.findOne({ accountId: accountId });
            if (!customer) {
                return res.status(404).json({
                    success: false,
                    message: "Không tìm thấy hồ sơ khách hàng hợp lệ!"
                });
            }
            userId = customer._id;
        }
        // Nếu là Admin thì userId cứ để null, vì Service chỉ cần check role === "admin" là cho qua rồi!

        // 3. Truyền cả role xuống Service
        await reviewService.deleteReview(reviewId, userId, role);

        return res.status(200).json({
            success: true,
            message: "Đã xóa bài đánh giá thành công!"
        });

    } catch (error) {
        // ... (Giữ nguyên phần bắt lỗi REVIEW_NOT_FOUND và UNAUTHORIZED_DELETE ở dưới)
        if (error.message === "REVIEW_NOT_FOUND") {
            return res.status(404).json({ success: false, message: "Không tìm thấy bài đánh giá này!" });
        }
        if (error.message === "UNAUTHORIZED_DELETE") {
            return res.status(403).json({ success: false, message: "Bạn không có quyền xóa bài đánh giá của người khác!" });
        }
        return res.status(500).json({ success: false, message: "Lỗi Server: " + error.message });
    }
};

module.exports = {
    createReview,
    getProductReviews,
    updateReview,
    deleteReview
};