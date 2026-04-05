const Coupon = require("../modules/coupon/coupon.model"); // Điều chỉnh đường dẫn model của bạn

const seedCoupons = async () => {
  try {
    console.log("--- Bắt đầu Seed dữ liệu Coupon Dermify ---");

    const couponData = [
      {
        code: "DERMIFYNEW",
        discountType: "percentage",
        discountValue: 10,
        minOrderValue: 200000,
        maxDiscount: 50000,
        usageLimit: 100,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Hết hạn sau 30 ngày
        status: "active",
      },
      {
        code: "GIAM100K",
        discountType: "fixed",
        discountValue: 100000,
        minOrderValue: 500000,
        usageLimit: 50,
        startDate: new Date(),
        endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        status: "active",
      },
      {
        code: "VIPSKINCARE",
        discountType: "percentage",
        discountValue: 20,
        minOrderValue: 1000000,
        maxDiscount: 300000,
        usageLimit: 20,
        startDate: new Date(),
        endDate: new Date("2026-12-31"),
        status: "active",
      },
      {
        code: "COCOONLOVER",
        discountType: "fixed",
        discountValue: 30000,
        minOrderValue: 300000,
        usageLimit: 200,
        startDate: new Date(),
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        status: "active",
      }
    ];

    for (const item of couponData) {
      // Sử dụng findOneAndUpdate với upsert: true
      // Tìm theo 'code' vì code là duy nhất (unique)
      await Coupon.findOneAndUpdate(
        { code: item.code },
        item,
        { 
          upsert: true, 
          new: true, 
          runValidators: true,
          setDefaultsOnInsert: true 
        }
      );
      console.log(`- Đã seed mã: ${item.code}`);
    }

    console.log("✅ Đã seed thành công dữ liệu Coupon.");
  } catch (error) {
    console.error("❌ Lỗi seed Coupon:", error);
  }
};

module.exports = seedCoupons;