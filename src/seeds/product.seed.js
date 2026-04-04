const Product = require("../modules/product/product.model");
const Category = require("../modules/category/category.model");

const seedProduct = async () => {
  try {
    console.log("--- Bắt đầu Seed 20 Sản phẩm Cocoon ---");
    const categories = await Category.find().lean();
    const getCatId = (name) => categories.find(c => c.name === name)?._id;

    const products = [
      // DA MẶT (5)
      { name: "Sữa rửa mặt hoa hồng Cocoon", price: 175000, brand: "Cocoon", stock: 100, categoryId: getCatId("Làm sạch da mặt"), images: ["https://picsum.photos/400/400?random=1"], slug: "srm-hoa-hong" },
      { name: "Thạch rửa mặt bồ kết", price: 165000, brand: "Cocoon", stock: 50, categoryId: getCatId("Làm sạch da mặt"), images: ["https://picsum.photos/400/400?random=2"], slug: "thach-rua-mat" },
      { name: "Nước tẩy trang bí đao", price: 145000, brand: "Cocoon", stock: 80, categoryId: getCatId("Làm sạch da mặt"), images: ["https://picsum.photos/400/400?random=3"], slug: "tay-trang-bi-dao" },
      { name: "Nước hoa hồng Cocoon", price: 175000, brand: "Cocoon", stock: 60, categoryId: getCatId("Nước cân bằng & Xịt khoáng"), images: ["https://picsum.photos/400/400?random=4"], slug: "toner-cocoon" },
      { name: "Tinh chất nghệ Hưng Yên", price: 265000, brand: "Cocoon", stock: 40, categoryId: getCatId("Tinh chất & Mặt nạ"), images: ["https://picsum.photos/400/400?random=5"], slug: "tinh-chat-nghe" },

      // CƠ THỂ (5)
      { name: "Tẩy tế bào chết cà phê Đắk Lắk", price: 125000, brand: "Cocoon", stock: 150, categoryId: getCatId("Tẩy tế bào chết body"), images: ["https://picsum.photos/400/400?random=6"], slug: "ttbc-body-cafe" },
      { name: "Sữa tắm khuynh diệp bạc hà", price: 165000, brand: "Cocoon", stock: 90, categoryId: getCatId("Sữa tắm dưỡng da"), images: ["https://picsum.photos/400/400?random=7"], slug: "sua-tam-cocoon" },
      { name: "Bơ dưỡng thể cà phê Đắk Lắk", price: 165000, brand: "Cocoon", stock: 70, categoryId: getCatId("Dưỡng thể & Kem tay"), images: ["https://picsum.photos/400/400?random=8"], slug: "bo-duong-the" },
      { name: "Kem dưỡng da tay màng tang", price: 85000, brand: "Cocoon", stock: 100, categoryId: getCatId("Dưỡng thể & Kem tay"), images: ["https://picsum.photos/400/400?random=9"], slug: "kem-tay-cocoon" },
      { name: "Muối tắm tinh dầu sả", price: 135000, brand: "Cocoon", stock: 50, categoryId: getCatId("Sữa tắm dưỡng da"), images: ["https://picsum.photos/400/400?random=10"], slug: "muoi-tam-sa" },

      // TÓC (5)
      { name: "Dầu gội bưởi Cocoon", price: 245000, brand: "Cocoon", stock: 55, categoryId: getCatId("Dầu gội bưởi"), images: ["https://picsum.photos/400/400?random=11"], slug: "dau-goi-buoi" },
      { name: "Dầu xả bưởi Cocoon", price: 165000, brand: "Cocoon", stock: 80, categoryId: getCatId("Dầu xả & Kem ủ"), images: ["https://picsum.photos/400/400?random=12"], slug: "dau-xa-buoi" },
      { name: "Nước dưỡng tóc tinh dầu bưởi", price: 165000, brand: "Cocoon", stock: 200, categoryId: getCatId("Nước dưỡng tóc"), images: ["https://picsum.photos/400/400?random=13"], slug: "xit-buoi-cocoon" },
      { name: "Serum sa-chi phục hồi", price: 145000, brand: "Cocoon", stock: 40, categoryId: getCatId("Nước dưỡng tóc"), images: ["https://picsum.photos/400/400?random=14"], slug: "serum-sachi" },
      { name: "Mặt nạ tóc nghệ", price: 215000, brand: "Cocoon", stock: 35, categoryId: getCatId("Dầu xả & Kem ủ"), images: ["https://picsum.photos/400/400?random=15"], slug: "mat-na-toc-nghe" },

      // MÔI (5)
      { name: "Tẩy tế bào chết môi cà phê", price: 75000, brand: "Cocoon", stock: 150, categoryId: getCatId("Tẩy tế bào chết môi"), images: ["https://picsum.photos/400/400?random=16"], slug: "ttbc-moi-cafe" },
      { name: "Son dưỡng dầu dừa Bến Tre", price: 35000, brand: "Cocoon", stock: 300, categoryId: getCatId("Son dưỡng môi"), images: ["https://picsum.photos/400/400?random=17"], slug: "son-duong-dua" },
      { name: "Mặt nạ ngủ môi hoa hồng", price: 95000, brand: "Cocoon", stock: 65, categoryId: getCatId("Mặt nạ ngủ môi"), images: ["https://picsum.photos/400/400?random=18"], slug: "mat-na-ngu-moi" },
      { name: "Son dưỡng gấc đỏ", price: 45000, brand: "Cocoon", stock: 100, categoryId: getCatId("Son dưỡng môi"), images: ["https://picsum.photos/400/400?random=19"], slug: "son-duong-gac" },
      { name: "Son dưỡng bơ hạt mỡ Cocoon", price: 55000, brand: "Cocoon", stock: 80, categoryId: getCatId("Son dưỡng môi"), images: ["https://picsum.photos/400/400?random=20"], slug: "son-duong-bo" }
    ];

    const promises = products.map(prod => {
      if (prod.categoryId) {
        return Product.findOneAndUpdate({ slug: prod.slug }, prod, { upsert: true });
      }
      return null;
    });

    await Promise.all(promises);
    console.log(`✅ Đã seed xong 20 sản phẩm Cocoon chuẩn.`);
  } catch (error) {
    console.error("❌ Lỗi seed sản phẩm:", error);
  }
};

module.exports = seedProduct;