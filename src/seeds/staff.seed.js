const bcrypt = require("bcrypt");
const Account = require("../modules/account/account.model");
const Staff = require("../modules/staff/staff.model");

const seedStaff = async () => {
  const email = "staff1@dermify.com";

  let account = await Account.findOne({ email });

  if (!account) {
    const hashed = await bcrypt.hash("12345678", 10);

    account = await Account.create({
      email,
      password: hashed,
      role: "staff",
      status: "active"
    });
  }

  const existingStaff = await Staff.findOne({ accountId: account._id });

  if (existingStaff) {
    console.log("Staff already exists");
    return;
  }

  await Staff.create({
    accountId: account._id,
    name: "Nguyễn Thị Lan",
    phone: "0987654321",
    position: "manager"
  });

  console.log("Staff seeded");
};

module.exports = seedStaff;