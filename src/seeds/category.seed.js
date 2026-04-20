const Category = require("../modules/category/category.model");

const seedCategory = async () => {
  try {
    console.log("🚀 [INITIALIZING] Bắt đầu quá trình tái thiết danh mục...");

    // 1. CLEARANCE: Quét sạch dữ liệu cũ để tránh xung đột hoặc trùng lặp
    await Category.deleteMany({});
    console.log("🧹 [CLEANUP] Đã xóa trắng dữ liệu danh mục cũ.");

    const treeData = [
      {
        parent: { name: "Chăm sóc da mặt", slug: "cham-soc-da-mat", level: 0 },
        subs: [
          { name: "Làm sạch & Tẩy trang", slug: "lam-sach-tay-trang", level: 1 },
          { name: "Tinh chất đặc trị", slug: "tinh-chat-dac-tri", level: 1 }
        ]
      },
      {
        parent: { name: "Chăm sóc cơ thể", slug: "cham-soc-co-the", level: 0 },
        subs: [
          { name: "Tẩy tế bào chết", slug: "tay-te-bao-chet-body", level: 1 },
          { name: "Sữa tắm dưỡng ẩm", slug: "sua-tam-duong-am", level: 1 }
        ]
      },
      {
        parent: { name: "Chăm sóc tóc", slug: "cham-soc-toc", level: 0 },
        subs: [
          { name: "Dầu gội & Xả", slug: "dau-goi-xa", level: 1 },
          { name: "Serum phục hồi tóc", slug: "serum-phuc-hoi-toc", level: 1 }
        ]
      },
      {
        parent: { name: "Dưỡng môi", slug: "duong-moi", level: 0 },
        subs: [
          { name: "Son dưỡng ẩm", slug: "son-duong-am", level: 1 },
          { name: "Mặt nạ ngủ môi", slug: "mat-na-ngu-moi", level: 1 }
        ]
      }
    ];

    // 2. RECONSTRUCTION: Xây dựng lại cấu trúc phân cấp
    for (const branch of treeData) {
      // Khởi tạo thực thể Gốc (Parent)
      const parentNode = await Category.create(branch.parent);

      // Liên kết các thực thể Nhánh (Children)
      const childNodes = branch.subs.map(sub => ({
        ...sub,
        parentId: parentNode._id
      }));

      await Category.insertMany(childNodes);
      console.log(`🌿 [BRANCH] Hoàn tất cây: ${branch.parent.name}`);
    }

    console.log("✅ [SUCCESS] Hệ thống danh mục đã được làm mới hoàn toàn (4 Cha - 8 Con).");
  } catch (error) {
    console.error("❌ [FATAL ERROR] Quá trình Seed thất bại:", error.message);
  }
};

module.exports = seedCategory;