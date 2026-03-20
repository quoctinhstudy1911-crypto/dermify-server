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

module.exports = {
  createStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
  createAdmin
};