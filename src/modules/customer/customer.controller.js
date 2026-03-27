const customerService = require("./customer.service");

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

const addAddress = async (req, res, next) => {
  try {
    const result = await customerService.addAddress(req.user.id, req.body);

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

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

const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new Error("No file uploaded");
    }

    const result = await customerService.updateAvatar(
      req.user.id,
      req.file
    );

    res.json({
      success: true,
      data: result
    });

  } catch (err) {
    next(err);
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