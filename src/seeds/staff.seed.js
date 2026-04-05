const bcrypt = require("bcrypt");
const Account = require("../modules/account/account.model");
const Staff = require("../modules/staff/staff.model");

const seedStaff = async () => {
  try {
    const staffData = [
      {
        email: "admin@dermify.com",
        password: "password123",
        role: "admin", // Quyền hệ thống
        name: "Trần Quản Lý",
        phone: "0912345678",
        position: "manager" // Chức vụ trong bảng Staff
      },
      {
        email: "staff@dermify.com",
        password: "password123",
        role: "staff",
        name: "Nguyễn Thị Nhân Viên",
        phone: "0987654321",
        position: "staff"
      }
    ];

    for (const data of staffData) {
      // 1. Kiểm tra tài khoản (Account) đã tồn tại chưa
      let account = await Account.findOne({ email: data.email });

      if (!account) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        account = await Account.create({
          email: data.email,
          password: hashedPassword,
          role: data.role,
          status: "active"
        });
        console.log(`+ Đã tạo Account: ${data.email}`);
      }

      // 2. Kiểm tra thông tin chi tiết (Staff) đã tồn tại chưa
      const existingStaff = await Staff.findOne({ accountId: account._id });

      if (!existingStaff) {
        await Staff.create({
          accountId: account._id,
          name: data.name,
          phone: data.phone,
          position: data.position,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=random`
        });
        console.log(`  -> Đã tạo Profile Staff cho: ${data.name}`);
      } else {
        console.log(`! Staff ${data.name} đã tồn tại, bỏ qua.`);
      }
    }

    console.log("✅ Hoàn thành Seed Staff & Admin");
  } catch (error) {
    console.error("❌ Lỗi Seed Staff:", error);
  }
};

module.exports = seedStaff;