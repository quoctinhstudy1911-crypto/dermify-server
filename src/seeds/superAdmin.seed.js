const bcrypt = require("bcrypt");
const Account = require("../modules/account/account.model");
const Staff = require("../modules/staff/staff.model");

const seedSuperAdmin = async () => {
  const email = process.env.SUPER_ADMIN_EMAIL;
  const password = process.env.SUPER_ADMIN_PASSWORD;

  let account = await Account.findOne({ email });

  if (!account) {
    const hashed = await bcrypt.hash(password, 10);

    account = await Account.create({
      email,
      password: hashed,
      role: "super_admin",
      status: "active"
    });

    console.log("Super admin seeded");
  } else {
    console.log("Super admin already exists");
  }

  const existingStaff = await Staff.findOne({ accountId: account._id });

  if (!existingStaff) {
    await Staff.create({
      accountId: account._id,
      name: "Super Admin",
      phone: "0900000000",
      position: "manager"
    });
    console.log("Super admin staff profile seeded");
  }
};

module.exports = seedSuperAdmin;
