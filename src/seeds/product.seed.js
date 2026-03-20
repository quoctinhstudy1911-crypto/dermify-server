const Product = require("../modules/product/product.model");
const Category = require("../modules/category/category.model");

const seedProduct = async () => {
  const cleanserCategory = await Category.findOne({ name: "Sữa rửa mặt" });
  const sunscreenCategory = await Category.findOne({ name: "Kem chống nắng" });

  const products = [
    {
      name: "La Roche-Posay Effaclar Purifying Gel",
      price: 350000,
      originalPrice: 420000,
      brand: "La Roche-Posay",
      stock: 100,
      categoryId: cleanserCategory?._id,
      tags: ["da dầu", "mụn"]
    },
    {
      name: "Senka Perfect Whip Cleanser",
      price: 120000,
      brand: "Senka",
      stock: 200,
      categoryId: cleanserCategory?._id
    },
    {
      name: "Anessa Perfect UV Sunscreen SPF50+",
      price: 650000,
      brand: "Anessa",
      stock: 50,
      categoryId: sunscreenCategory?._id
    }
  ];

  for (const prod of products) {
    const existing = await Product.findOne({ name: prod.name });

    if (!existing) {
      await Product.create(prod);
    }
  }

  console.log("Products seeded");
};

module.exports = seedProduct;