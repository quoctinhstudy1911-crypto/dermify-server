const customerService = require("./customer.service");

// Get profile
const getProfile = async (req, res, next) => {
  try {
    const result = await customerService.getProfile(req.user.id);

    res.json({
      success: true,
      data: result
    });

  } catch (err) {
    next(err);
  }
};

// Update profile
const updateProfile = async (req, res, next) => {
  try {
    const result = await customerService.updateProfile(
      req.user.id,
      req.body
    );

    res.json({
      success: true,
      data: result
    });

  } catch (err) {
    next(err);
  }
};

// Get addresses
const getAddresses = async (req, res, next) => {
  try {

    const result = await customerService.getAddresses(req.user.id);

    res.json({
      success: true,
      data: result
    });

  } catch (err) {
    next(err);
  }
};

// Add new address
const addAddress = async (req, res, next) => {
  try {
    const result = await customerService.addAddress(req.user.id, req.body);

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

// Update address
const updateAddress = async (req, res, next) => {
  try {
    const result = await customerService.updateAddress(
      req.user.id,
      req.params.id,
      req.body
    );

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

// Delete address
const deleteAddress = async (req, res, next) => {
  try {
    const result = await customerService.deleteAddress(
      req.user.id,
      req.params.id
    );

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

//  Set default address
const setDefaultAddress = async (req, res, next) => {
  try {
    const result = await customerService.setDefaultAddress(
      req.user.id,
      req.params.id
    );

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

// Upload avatar
const uploadAvatar = async (req, res, next) => {
  try {
    // req.file do middleware upload.single("avatar") tạo ra
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: "Vui lòng chọn ảnh để tải lên" 
      });
    }

    // Gọi service xử lý
    const result = await customerService.updateAvatar(
      req.user.id, // Lấy ID từ authMiddleware
      req.file     // File binary/temp path
    );

    // Trả về kết quả cho Frontend
    res.json({
      success: true,
      message: "Cập nhật ảnh đại diện thành công!",
      data: result
    });

  } catch (err) {
    next(err); // Đẩy lỗi vào errorHandler
  }
};

module.exports = {
  getProfile,
  updateProfile,
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  uploadAvatar
};