const Account = require("../account/account.model");
const Customer = require("../customer/customer.model");
const bcrypt = require("bcrypt");

// ======================================================
// 1. TRUY VẤN DANH SÁCH NGƯỜI DÙNG (GET ALL)
// ======================================================
const getAllUsers = async (req, res) => {
  try {
    // Trích xuất các tham số phân trang và bộ lọc từ query string
    const { page = 1, limit = 10, role = "customer", status = "", search = "" } = req.query;
    const skip = (page - 1) * limit;

    // Thiết lập bộ lọc mặc định: Chỉ lấy những tài khoản chưa xóa và đúng vai trò
    let filter = { isDeleted: false, role: role || "customer" };
    
    // Lọc theo trạng thái tài khoản (Active/Banned/...) nếu có
    if (status) {
      filter.status = status;
    }
    
    // Tìm kiếm tương đối theo Email (không phân biệt hoa thường)
    if (search) {
      filter.$or = [
        { email: { $regex: search, $options: "i" } }
      ];
    }

    // Thực thi truy vấn danh sách tài khoản kèm phân trang và sắp xếp mới nhất
    const users = await Account.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    // Hợp nhất dữ liệu: Nhúng thông tin chi tiết từ bảng Customer vào Account
    const usersWithDetails = await Promise.all(
      users.map(async (user) => {
        const userObj = user.toJSON();
        
        if (user.role === "customer") {
          const customer = await Customer.findOne({ accountId: user._id });
          
          // Làm phẳng (Flatten) dữ liệu để Frontend dễ dàng truy xuất (không cần lồng object)
          if (customer) {
            userObj.fullName = customer.name;
            userObj.phone = customer.phone;
            userObj.gender = customer.gender;
            userObj.dateOfBirth = customer.dateOfBirth;
            userObj.avatar = customer.avatar;
            userObj.addresses = customer.addresses;
            userObj.address = customer.addresses?.[0]?.street || "N/A";
          }
        }
        
        return userObj;
      })
    );

    // Tính toán tổng số bản ghi phục vụ phân trang ở phía UI
    const total = await Account.countDocuments(filter);

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách người dùng thành công",
      data: usersWithDetails,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách người dùng:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Lỗi hệ thống khi lấy danh sách"
    });
  }
};

// ======================================================
// 2. KHỞI TẠO NGƯỜI DÙNG MỚI (CREATE)
// ======================================================
const createUser = async (req, res) => {
  try {
    const { email, password, name, phone, role = "customer" } = req.body;

    // Chặn tạo tài khoản quản trị qua API công khai này
    if (role !== "customer") {
      return res.status(400).json({
        success: false,
        message: "Luồng này chỉ hỗ trợ tạo khách hàng. Vui lòng sử dụng module Staff cho nhân sự."
      });
    }

    // Kiểm tra tính toàn vẹn của dữ liệu đầu vào
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: "Email, mật khẩu và tên là thông tin bắt buộc"
      });
    }

    // Kiểm tra trùng lặp định danh (Email)
    const existingAccount = await Account.findOne({ email: email.toLowerCase() });
    if (existingAccount) {
      return res.status(400).json({
        success: false,
        message: "Địa chỉ email này đã được đăng ký trong hệ thống"
      });
    }

    // Mã hóa mật khẩu bảo mật trước khi lưu vào DB
    const hashedPassword = await bcrypt.hash(password, 10);

    // Bước 1: Khởi tạo thực thể Tài khoản (Account)
    const account = new Account({
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      status: "active"
    });

    await account.save();

    // Bước 2: Khởi tạo thực thể Hồ sơ khách hàng (Customer Profile)
    if (role === "customer") {
      const customer = new Customer({
        accountId: account._id,
        name,
        phone: phone || ""
      });
      await customer.save();
    }

    return res.status(201).json({
      success: true,
      message: "Người dùng đã được tạo thành công",
      data: account
    });
  } catch (error) {
    console.error("Lỗi khi tạo người dùng:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Lỗi hệ thống khi khởi tạo"
    });
  }
};

// ======================================================
// 3. CẬP NHẬT TRẠNG THÁI (STATUS UPDATE)
// ======================================================
const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Trạng thái mới không được để trống"
      });
    }

    // Kiểm tra sự tồn tại của tài khoản mục tiêu
    const targetAccount = await Account.findById(id);
    if (!targetAccount) {
      return res.status(404).json({ success: false, message: "Không tìm thấy người dùng" });
    }

    // KIỂM SOÁT QUYỀN HẠN: Ngăn chặn Admin cấp dưới can thiệp vào tài khoản quản trị cao cấp
    if (req.user.role === "admin" && ["admin", "super_admin"].includes(targetAccount.role)) {
      return res.status(403).json({
        success: false,
        message: "Quyền hạn của bạn không đủ để thay đổi trạng thái cấp quản trị"
      });
    }

    const account = await Account.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Đã cập nhật trạng thái người dùng thành công",
      data: account
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Lỗi hệ thống khi cập nhật"
    });
  }
};

// ======================================================
// 4. XÓA NGƯỜI DÙNG (SOFT DELETE)
// ======================================================
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Thực hiện Xóa mềm (Soft Delete): Chỉ đánh dấu ẩn, không xóa khỏi vật lý DB
    const account = await Account.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    if (!account) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng để xóa"
      });
    }

    // Đồng bộ hóa việc xóa mềm cho hồ sơ khách hàng đi kèm (nếu có)
    if (account.role === "customer") {
      await Customer.findOneAndUpdate(
        { accountId: id },
        { isDeleted: true }
      );
    }

    return res.status(200).json({
      success: true,
      message: "Đã xóa người dùng thành công (Soft Delete)",
      data: account
    });
  } catch (error) {
    console.error("Lỗi khi xóa người dùng:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Lỗi hệ thống khi xóa"
    });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  updateUserStatus,
  deleteUser
};