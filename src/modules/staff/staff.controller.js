const staffService = require("./staff.service");

/**
 * [POST] /api/staff
 * Tạo Staff - Dành cho Admin/Super Admin
 */
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

/**
 * [GET] /api/staff
 * Lấy danh sách tất cả nhân sự
 */
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

/**
 * [GET] /api/staff/:id
 * Lấy chi tiết một nhân sự theo ID
 */
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

/**
 * [PUT] /api/staff/:id
 * Cập nhật thông tin nhân sự (Yêu cầu req.user để check quyền sửa position)
 */
const updateStaff = async (req, res, next) => {
  try {
    const result = await staffService.updateStaff(
      req.params.id,
      req.body,
      req.user // Truyền req.user để service check role (chỉ super_admin mới đổi được position)
    );
    res.json({ 
      success: true, 
      data: result 
    });
  } catch (err) {
    next(err);
  }
};

/**
 * [DELETE] /api/staff/:id
 * Vô hiệu hóa nhân sự (Soft delete)
 * FIX: Đã truyền thêm req.user để Service check logic ngăn tự xóa chính mình
 */
const deleteStaff = async (req, res, next) => {
  try {
    // FIX: Truyền req.user vào tham số thứ 2 theo đúng cấu trúc của Service
    const result = await staffService.deleteStaff(req.params.id, req.user);

    res.json({
      success: true,
      message: "Vô hiệu hóa nhân sự thành công",
      data: result
    });
  } catch (err) {
    next(err);
  }
};

/**
 * [POST] /api/staff/create-admin
 * Tạo tài khoản Admin mới - Chỉ dành cho Super Admin
 */
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

/**
 * [GET] /api/staff/me
 * Lấy thông tin cá nhân của nhân viên đang đăng nhập
 */
const getMyStaff = async (req, res, next) => {
  try {
    // req.user.id từ middleware auth lấy ra accountId
    const result = await staffService.getMyStaff(req.user.id);
    res.json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
};

/**
 * [PUT] /api/staff/me
 * Cập nhật thông tin cá nhân của chính mình (Chỉ name, phone...)
 */
const updateMyStaff = async (req, res, next) => {
  try {
    const accountId = req.user.id; 
    const updateData = req.body;

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