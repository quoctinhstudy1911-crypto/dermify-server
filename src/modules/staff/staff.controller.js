const staffService = require("./staff.service");

const createStaff = async (req, res, next) => {
  try {
    const result = await staffService.createStaff(req.body);

    res.json({
      success: true,
      data: result
    });

  } catch (err) {
    next(err);
  }
};

const getAllStaff = async (req, res, next) => {
  try {
    const result = await staffService.getAllStaff(req.query);

    res.json({
      success: true,
      data: result
    });

  } catch (err) {
    next(err);
  }
};

const getStaffById = async (req, res, next) => {
  try {
    const result = await staffService.getStaffById(req.params.id);

    res.json({
      success: true,
      data: result
    });

  } catch (err) {
    next(err);
  }
};

const updateStaff = async (req, res, next) => {
  try {
   const result = await staffService.updateStaff(
          req.params.id,
          req.body,
          req.user
        );

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

const deleteStaff = async (req, res, next) => {
  try {
    const result = await staffService.deleteStaff(req.params.id);

    res.json({
      success: true,
      message: "Staff deleted successfully"
    });

  } catch (err) {
    next(err);
  }
};

const createAdmin = async (req, res, next) => {
  try {
    const result = await staffService.createAdmin(req.body);

    res.json({
      success: true,
      data: result
    });

  } catch (err) {
    next(err);
  }
};

// Lấy thông tin nhân viên của chính mình
const getMyStaff = async (req, res, next) => {
  try {
    const result = await staffService.getMyStaff(req.user.id);

    res.json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
};

// [PUT] /api/staff/me
const updateMyStaff = async (req, res, next) => {
  try {
    const accountId = req.user.id; // Lấy ID tài khoản đang đăng nhập
    const updateData = req.body;   // Dữ liệu name, phone từ frontend gửi lên

    const result = await staffService.updateMyStaff(accountId, updateData);

    res.json({
      success: true,
      message: "Cập nhật thông tin cá nhân thành công!",
      data: result
    });
  } catch (err) {
    next(err);
  }
};

// Đừng quên thêm vào module.exports của controller
module.exports = {
  // ... các hàm khác
  updateMyStaff,
};

module.exports = {
  createStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
  createAdmin,
  getMyStaff,
  updateMyStaff
};