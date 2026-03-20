const Category = require("../modules/category/category.model");

const seedCategory = async () => {
  const categories = [
    { name: "Chăm sóc da", level: 0 },
    { name: "Sữa rửa mặt", level: 1 },
    { name: "Kem chống nắng", level: 1 },
    { name: "Serum", level: 1 }
  ];

  for (const cat of categories) {
    const existing = await Category.findOne({ name: cat.name });

    if (!existing) {
      await Category.create(cat);
    }
  }

  console.log("Categories seeded");
};

module.exports = seedCategory;