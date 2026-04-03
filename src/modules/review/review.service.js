    const Review = require("./review.model");
    const Product = require("../product/product.model"); // Cần import để check xem sp có tồn tại ko

    /**
     * STEP 1: Tạo đánh giá mới
     */
    const createReview = async (reviewData) => {
        const { productId, userId, rating, comment, images } = reviewData;

        // DÒ MÌN 1: Kiểm tra xem sản phẩm này có tồn tại thật không?
        const productExists = await Product.findById(productId);
        if (!productExists || productExists.isDeleted) {
            throw new Error("PRODUCT_NOT_FOUND");
        }

        try {
            // Tạo và Lưu review
            const newReview = new Review({
                productId,
                userId,
                rating,
                comment,
                images
            });

            await newReview.save();
            // GẮN NGÒI NỔ: Tính lại sao sau khi TẠO xong
            await Review.calcAverageRatings(productId);
            return newReview;

        } catch (error) {
            // BẮT BỆNH LỖI 11000: Model index { userId, productId } unique sẽ quăng lỗi này nếu spam
            if (error.code === 11000) {
                throw new Error("ALREADY_REVIEWED");
            }
            throw error; // Các lỗi khác (thiếu required, sai kiểu dl) ném ra nguyên bản
        }
    };

    /**
     * STEP 2: Lấy danh sách đánh giá của 1 sản phẩm (Có phân trang)
     */
    const getReviewsByProduct = async (productId, query) => {
        // 1. Setup Phân trang
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const skip = (page - 1) * limit;

        // 2. Điều kiện lọc: Đúng sản phẩm đó + Trạng thái phải là active
        const filter = { 
            productId, 
            status: "active" 
        };

        // 3. Chạy song song 2 task: Lấy data và Đếm tổng số lượng
        const [reviews, totalReviews] = await Promise.all([
            Review.find(filter)
                .populate({
                    path: "userId", // Bóc thông tin từ bảng Customer
                    select: "name avatar" // Frontend chỉ cần tên và avatar, không lấy email/pass để bảo mật
                })
                .sort({ createdAt: -1 }) // Bài mới nhất xếp lên đầu
                .skip(skip)
                .limit(limit),
            Review.countDocuments(filter)
        ]);

        // 4. Trả về đúng format chuẩn của dự án
        return {
            reviews,
            pagination: {
                totalReviews,
                totalPages: Math.ceil(totalReviews / limit),
                currentPage: page
            }
        };
    };


    /**
     * STEP 3: Cập nhật đánh giá (Chỉ chủ nhân mới được sửa)
     */
    const updateReview = async (reviewId, userId, updateData) => {
        // 1. Tìm bài đánh giá trong Database
        const review = await Review.findById(reviewId);
        if (!review) {
            throw new Error("REVIEW_NOT_FOUND");
        }

        // 2. CHECK CHÍNH CHỦ: ID người gửi request có khớp với ID người tạo review không?
        // Phải dùng .toString() vì MongoDB ObjectId so sánh trực tiếp hay bị lỗi ngầm
        if (review.userId.toString() !== userId.toString()) {
            throw new Error("UNAUTHORIZED_EDIT");
        }

        // 3. Cập nhật dữ liệu mới (Chỉ cho phép sửa rating, comment và images)
        if (updateData.rating) review.rating = updateData.rating;
        if (updateData.comment !== undefined) review.comment = updateData.comment;
        if (updateData.images) review.images = updateData.images;

        // 4. Bật cờ "Đã chỉnh sửa"
        review.isEdited = true;

        // 5. Lưu lại
        await review.save();
        // GẮN NGÒI NỔ: Tính lại sao sau khi SỬA xong (vì biết đâu khách sửa từ 1 sao lên 5 sao)
        await Review.calcAverageRatings(review.productId);
        return review;
    };


    /**
     * STEP 4: Xóa đánh giá (Có phân quyền Admin)
     */
    const deleteReview = async (reviewId, userId, role) => { // Nhận thêm biến role
        const review = await Review.findById(reviewId);
        if (!review) {
            throw new Error("REVIEW_NOT_FOUND");
        }

        // LUẬT MỚI: Nếu người xóa KHÔNG PHẢI LÀ ADMIN, VÀ cũng KHÔNG PHẢI CHÍNH CHỦ -> Đuổi về!
        const isAdmin = ["admin", "super_admin"].includes(role);

        // Nếu KHÔNG phải nhóm admin VÀ KHÔNG phải chính chủ -> Đuổi về
        if (!isAdmin && review.userId.toString() !== userId?.toString()) {
            throw new Error("UNAUTHORIZED_DELETE");
        }

        // Admin hoặc chính chủ thì được đi tiếp xuống đây
        review.status = "hidden";
        await review.save();
        // GẮN NGÒI NỔ: Tính lại sao sau khi XÓA xong (loại bài đánh giá này ra khỏi kết quả)
        await Review.calcAverageRatings(review.productId);
        return review;
    };

    module.exports = {
        createReview,
        getReviewsByProduct,
        updateReview,
        deleteReview
    };
