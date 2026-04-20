const staffService = require("./staff.service");

/**
 * [POST] /api/staff
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
 */
const updateStaff = async (req, res, next) => {
  try {
    const result = await staffService.updateStaff(
      req.params.id,
      req.body,
      req.user
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
 */
const deleteStaff = async (req, res, next) => {
  try {
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
 */
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

/**
 * [PUT] /api/staff/me
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