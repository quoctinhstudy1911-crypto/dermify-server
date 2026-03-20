const bcrypt = require("bcrypt");
const Account = require("../modules/account/account.model");

const seedSuperAdmin = async () => {
  const email = process.env.SUPER_ADMIN_EMAIL;
  const password = process.env.SUPER_ADMIN_PASSWORD;

  const existing = await Account.findOne({ email });

  if (existing) {
    console.log("Super admin already exists");
    return;
  }

  const hashed = await bcrypt.hash(password, 10);

  await Account.create({
    email,
    password: hashed,
    role: "super_admin",
    status: "active"
  });

  console.log("Super admin seeded");
};

module.exports = seedSuperAdmin;