const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({

  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
    index: true
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true
  },

  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },

 comment: { type: String, trim: true },

  images: { type: [String], default: [] },

  isEdited: { type: Boolean, default: false },

  status: {
    type: String,
    enum: ["active", "hidden"],
    default: "active"
  }

}, { timestamps: true });

reviewSchema.index({ userId: 1, productId: 1 }, { unique: true });

/**
 * TRÙM CUỐI: Hàm static tính toán điểm trung bình sao và cập nhật vào Product
 */
reviewSchema.statics.calcAverageRatings = async function (productId) {
    // Dùng Aggregation Pipeline để gom nhóm và tính toán
    const stats = await this.aggregate([
        {
            // Bước 1: Chỉ lấy những review của đúng sản phẩm đó VÀ đang ở trạng thái active
            $match: { 
                productId: productId, 
                status: "active" 
            }
        },
        {
            // Bước 2: Gom nhóm lại để tính toán
            $group: {
                _id: "$productId",
                nRating: { $sum: 1 }, // Đếm xem có bao nhiêu bài review (mỗi bài +1)
                avgRating: { $avg: "$rating" } // Tính trung bình cộng của trường 'rating'
            }
        }
    ]);

    // In ra log để bạn dễ debug khi test
    console.log("Kết quả tính toán sao: ", stats);

    try {
        // Cập nhật kết quả sang bảng Product
        if (stats.length > 0) {
            await mongoose.model("Product").findByIdAndUpdate(productId, {
                // Làm tròn đến 1 chữ số thập phân (VD: 4.33333 -> 4.3)
                ratingAvg: Math.round(stats[0].avgRating * 10) / 10 
            });
        } else {
            // Nếu mảng stats rỗng (tức là sản phẩm bị xóa hết sạch review) -> Trả về 0 sao
            await mongoose.model("Product").findByIdAndUpdate(productId, {
                ratingAvg: 0
            });
        }
    } catch (error) {
        console.error("Lỗi khi cập nhật ratingAvg cho Product: ", error);
    }
};

module.exports = mongoose.model("Review", reviewSchema);