const Product = require("../modules/product/product.model");
const Category = require("../modules/category/category.model");


const seedProduct = async () => {
  try {
    console.log("🚀 [CATALOG] Đang khởi tạo danh mục sản phẩm...");

    // 1. DATA PURGE: Dọn dẹp kho hàng cũ để đảm bảo tính nhất quán của ID và Slug
    await Product.deleteMany({});
    console.log("🧹 [CLEANUP] Kho hàng đã được làm trống.");

    // Truy vấn bản đồ danh mục hiện tại
    const categories = await Category.find().lean();
    const getCatId = (name) => categories.find(c => c.name === name)?._id;

    const inventory = [
      // Nhóm: Chăm sóc da mặt
      { 
        name: "Nước tẩy trang bí đao", price: 145000, brand: "Cocoon", stock: 80, 
        categoryId: getCatId("Làm sạch & Tẩy trang"), 
        images: ["https://picsum.photos/400/400?random=1"], slug: "tay-trang-bi-dao" 
      },
      { 
        name: "Tinh chất nghệ Hưng Yên", price: 265000, brand: "Cocoon", stock: 45, 
        categoryId: getCatId("Tinh chất đặc trị"), 
        images: ["https://picsum.photos/400/400?random=2"], slug: "tinh-chat-nghe" 
      },

      // Nhóm: Chăm sóc cơ thể
      { 
        name: "Tẩy tế bào chết cà phê Đắk Lắk", price: 125000, brand: "Cocoon", stock: 150, 
        categoryId: getCatId("Tẩy tế bào chết"), 
        images: ["https://picsum.photos/400/400?random=3"], slug: "ttbc-body-cafe" 
      },
      { 
        name: "Sữa tắm dưỡng ẩm tinh dầu sả", price: 165000, brand: "Cocoon", stock: 90, 
        categoryId: getCatId("Sữa tắm dưỡng ẩm"), 
        images: ["https://picsum.photos/400/400?random=4"], slug: "sua-tam-sa" 
      },

      // Nhóm: Chăm sóc tóc
      { 
        name: "Dầu gội bưởi Cocoon", price: 245000, brand: "Cocoon", stock: 60, 
        categoryId: getCatId("Dầu gội & Xả"), 
        images: ["https://picsum.photos/400/400?random=5"], slug: "dau-goi-buoi" 
      },
      { 
        name: "Dầu xả bưởi Cocoon", price: 165000, brand: "Cocoon", stock: 60, 
        categoryId: getCatId("Dầu gội & Xả"), 
        images: ["https://picsum.photos/400/400?random=6"], slug: "dau-xa-buoi" 
      },
      { 
        name: "Serum sa-chi phục hồi tóc", price: 145000, brand: "Cocoon", stock: 40, 
        categoryId: getCatId("Serum phục hồi tóc"), 
        images: ["https://picsum.photos/400/400?random=7"], slug: "serum-sachi" 
      },

      // Nhóm: Dưỡng môi
      { 
        name: "Son dưỡng dầu dừa Bến Tre", price: 35000, brand: "Cocoon", stock: 300, 
        categoryId: getCatId("Son dưỡng ẩm"), 
        images: ["https://picsum.photos/400/400?random=8"], slug: "son-duong-dua" 
      },
      { 
        name: "Son dưỡng gấc đỏ", price: 45000, brand: "Cocoon", stock: 100, 
        categoryId: getCatId("Son dưỡng ẩm"), 
        images: ["https://picsum.photos/400/400?random=9"], slug: "son-duong-gac" 
      },
      { 
        name: "Mặt nạ ngủ môi hoa hồng", price: 95000, brand: "Cocoon", stock: 65, 
        categoryId: getCatId("Mặt nạ ngủ môi"), 
        images: ["https://picsum.photos/400/400?random=10"], slug: "mat-na-ngu-moi" 
      }
    ];


    const validProducts = inventory.filter(p => p.categoryId);
    
    if (validProducts.length > 0) {
      await Product.insertMany(validProducts);
      console.log(`✨ [SUCCESS] Đã đưa ${validProducts.length} tinh hoa Cocoon vào kệ hàng.`);
    } else {
      console.warn("⚠️ [WARNING] Không có sản phẩm nào hợp lệ để nạp. Kiểm tra lại dữ liệu Category.");
    }

  } catch (error) {
    console.error("❌ [CRITICAL] Thất bại trong quá trình Seed sản phẩm:", error.message);
  }
};

module.exports = seedProduct;