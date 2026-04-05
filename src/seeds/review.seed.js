const Review = require("../modules/review/review.model");
const Product = require("../modules/product/product.model");
const Customer = require("../modules/customer/customer.model");

const seedReviews = async () => {
  try {
    console.log("--- Bắt đầu Seed Review ---");

    // 1. Lấy tất cả sản phẩm và khách hàng thực tế đang có trong DB
    const allProducts = await Product.find().select("_id");
    const allCustomers = await Customer.find().select("_id");

    // 2. Kiểm tra nếu chưa có dữ liệu cha thì dừng ngay để tránh lỗi undefined
    if (allProducts.length === 0 || allCustomers.length === 0) {
      console.error("❌ Thất bại: Cần seed Product và Customer trước khi seed Review!");
      return;
    }

    const reviewData = [
      {
        productId: allProducts[0]._id, // Lấy ID của sản phẩm đầu tiên tìm thấy
        userId: allCustomers[0]._id,   // Lấy ID của khách hàng đầu tiên tìm thấy
        rating: 5,
        comment: "Sản phẩm Cocoon dùng rất thích, lành tính!",
        status: "active"
      },
      // Thêm các mẫu khác tương tự...
    ];

    for (const item of reviewData) {
      await Review.findOneAndUpdate(
        { userId: item.userId, productId: item.productId },
        item,
        { upsert: true, new: true }
      );
    }

    // 3. Kích hoạt tính toán lại trung bình sao cho các sản phẩm đã được review
    for (const prod of allProducts) {
      await Review.calcAverageRatings(prod._id);
    }

    console.log("✅ Đã seed Review thành công!");
  } catch (error) {
    console.error("❌ Lỗi seed Review:", error);
  }
};

module.exports = seedReviews;