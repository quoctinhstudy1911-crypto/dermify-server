const bcrypt = require("bcrypt");
const Account = require("../modules/account/account.model");
const Staff = require("../modules/staff/staff.model");

const seedStaff = async () => {
  try {
    // 1. Dữ liệu cần Seed
    const staffData = [
      {
        email: "admin@dermify.com",
        password: "password123",
        role: "admin", 
        name: "Trần Quản Lý",
        phone: "0912345678",
        position: "manager" 
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

    console.log("--- Bắt đầu quá trình Seed dữ liệu Staff & Admin ---");

    for (const data of staffData) {
      // KIỂM TRA TRƯỚC KHI TẠO (Phòng trường hợp bạn chưa xóa hết)
      const existingAccount = await Account.findOne({ email: data.email });
      
      if (existingAccount) {
        console.log(`! Account ${data.email} đã tồn tại, bỏ qua bước tạo Account.`);
        
        // Nếu đã có Account nhưng chưa có Staff thì tạo bổ sung
        const existingStaff = await Staff.findOne({ accountId: existingAccount._id });
        if (!existingStaff) {
            await Staff.create({
                accountId: existingAccount._id,
                name: data.name,
                phone: data.phone,
                position: data.position,
                isDeleted: false,
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=random`
            });
            console.log(`  -> Đã bổ sung Profile Staff cho Account có sẵn.`);
        }
        continue;
      }

      // 2. TẠO ACCOUNT MỚI
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const account = await Account.create({
        email: data.email,
        password: hashedPassword,
        role: data.role,
        status: "active"
      });
      console.log(`+ Đã tạo Account: ${data.email}`);

      // 3. TẠO STAFF MỚI (Nối trực tiếp với Account vừa tạo)
      await Staff.create({
        accountId: account._id,
        name: data.name,
        phone: data.phone,
        position: data.position,
        isDeleted: false, // Quan trọng để hàm getMe không bỏ qua
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=random`
      });
      console.log(`  -> Đã tạo Profile Staff cho: ${data.name}`);
    }

    console.log("✅ Hoàn thành Seed dữ liệu thành công!");
  } catch (error) {
    console.error("❌ Lỗi Seed Staff:", error);
  }
};

module.exports = seedStaff;