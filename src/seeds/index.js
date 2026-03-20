const seedSuperAdmin = require("./superAdmin.seed");
const seedStaff = require("./staff.seed");
const seedCategory = require("./category.seed");
const seedProduct = require("./product.seed");

const seedAll = async () => {
  await seedSuperAdmin();
  await seedStaff();
  await seedCategory();
  await seedProduct();

  console.log("Seed done");
};

module.exports = seedAll;