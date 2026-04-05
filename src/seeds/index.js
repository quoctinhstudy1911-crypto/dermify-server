const seedSuperAdmin = require("./superAdmin.seed");
const seedStaff = require("./staff.seed");
const seedCategory = require("./category.seed");
const seedProduct = require("./product.seed");
const seedCoupons = require("./seedCoupons");
const seedReview = require("./review.seed");

const seedAll = async () => {
  const type = process.env.SEED_TYPE || "all";

  console.log(`🌱 Seeding type: ${type}`);

  try {
    switch (type) {
      case "admin":
        console.log("👉 Seeding Super Admin...");
        await seedSuperAdmin();
        break;

      case "staff":
        console.log("👉 Seeding Staff...");
        await seedStaff();
        break;

      case "category":
        console.log("👉 Seeding Category...");
        await seedCategory();
        break;

      case "product":
        console.log("👉 Seeding Product...");
        await seedProduct();
        break;
      
      case "coupon":
        console.log("👉 Seeding Coupons...");
        await seedCoupons();
        break;

      case "review":
        console.log("👉 Seeding Reviews...");
        await seedReview();
        break;

      case "all":
        console.log("👉 Seeding ALL...");
        await seedSuperAdmin();
        await seedStaff();
        await seedCategory();
        await seedProduct();
        await seedCoupons();
        await seedReview();
        break;

      default:
        console.log("❌ Invalid SEED_TYPE");
        return;
    }

    console.log("✅ Seed completed successfully");
  } catch (error) {
    console.error("❌ Seed error:", error);
    throw error;
  }
};

module.exports = seedAll;