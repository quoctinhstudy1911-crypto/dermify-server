const Category = require("../modules/category/category.model");

const seedCategory = async () => {
  try {
    console.log("--- Bắt đầu Seed 16 Danh mục Cocoon ---");

    const categoryData = [
      {
        parent: { name: "Chăm sóc da mặt", slug: "cham-soc-da-mat", level: 0 },
        subs: [
          { name: "Làm sạch da mặt", slug: "lam-sach-da-mat", level: 1 },
          { name: "Nước cân bằng & Xịt khoáng", slug: "toner-xit-khoang", level: 1 },
          { name: "Tinh chất & Mặt nạ", slug: "tinh-chat-mat-na", level: 1 }
        ]
      },
      {
        parent: { name: "Chăm sóc cơ thể", slug: "cham-soc-co-the", level: 0 },
        subs: [
          { name: "Tẩy tế bào chết body", slug: "tay-te-bao-chet-body", level: 1 },
          { name: "Sữa tắm dưỡng da", slug: "sua-tam-duong-da", level: 1 },
          { name: "Dưỡng thể & Kem tay", slug: "duong-the-kem-tay", level: 1 }
        ]
      },
      {
        parent: { name: "Chăm sóc tóc", slug: "cham-soc-toc", level: 0 },
        subs: [
          { name: "Dầu gội bưởi", slug: "dau-goi-buoi", level: 1 },
          { name: "Dầu xả & Kem ủ", slug: "dau-xa-kem-u", level: 1 },
          { name: "Nước dưỡng tóc", slug: "nuoc-duong-toc", level: 1 }
        ]
      },
      {
        parent: { name: "Dưỡng môi", slug: "duong-moi", level: 0 },
        subs: [
          { name: "Tẩy tế bào chết môi", slug: "tay-te-bao-chet-moi", level: 1 },
          { name: "Son dưỡng môi", slug: "son-duong-moi", level: 1 },
          { name: "Mặt nạ ngủ môi", slug: "mat-na-ngu-moi", level: 1 }
        ]
      }
    ];

    for (const group of categoryData) {
      // Sử dụng returnDocument: 'after' để hết Warning
      let parentCat = await Category.findOneAndUpdate(
        { name: group.parent.name },
        group.parent,
        { upsert: true, returnDocument: 'after' }
      );

      for (const sub of group.subs) {
        await Category.findOneAndUpdate(
          { name: sub.name },
          { ...sub, parentId: parentCat._id },
          { upsert: true }
        );
      }
    }
    console.log("✅ Đã seed thành công 16 danh mục (4 Cha - 12 Con).");
  } catch (error) {
    console.error("❌ Lỗi seed danh mục:", error);
  }
};

module.exports = seedCategory;