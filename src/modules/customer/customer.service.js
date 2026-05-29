const Customer = require("./customer.model");
const cloudinary = require("../../config/cloudinary");
const fs = require("fs");

// Hàm tìm kiếm customer theo accountId, dùng chung cho nhiều chức năng
const findCustomer = async (accountId) => {
  const customer = await Customer.findOne({ accountId });
  if (!customer) {
    const err = new Error("Customer not found");
    err.status = 404;
    throw err;
  }
  return customer;
};

// GET PROFILE
const getProfile = async (accountId) => {
  const customer = await findCustomer(accountId);
  return customer.toJSON();
};

// UPDATE PROFILE
const updateProfile = async (accountId, data) => {
  const customer = await findCustomer(accountId);

  // safe update
  if (data.name !== undefined) customer.name = data.name.trim();
  if (data.phone !== undefined) customer.phone = data.phone.trim();
  if (data.gender !== undefined) customer.gender = data.gender;
  if (data.dateOfBirth !== undefined) {
    customer.dateOfBirth = data.dateOfBirth;
  }

  await customer.save();
  return customer.toJSON();
};

// GET ADDRESSES
const getAddresses = async (accountId) => {
  const customer = await findCustomer(accountId);
   // Trả về mảng địa chỉ, nếu không có thì trả về mảng rỗng
   return (customer.addresses || []).map(addr =>
  addr.toJSON ? addr.toJSON() : addr
);
}

// ADD ADDRESS
const addAddress = async (accountId, data) => {
  const customer = await findCustomer(accountId);

  const addresses = customer.addresses || [];

  // nếu chưa có address → auto default
  if (addresses.length === 0) {
    data.isDefault = true;
  }

  // nếu set default → reset tất cả
  if (data.isDefault) {
    addresses.forEach(addr => (addr.isDefault = false));
  }

  addresses.push(data);

  // gán lại
  customer.addresses = addresses;

  await customer.save();
  return customer.toJSON();
};

// UPDATE ADDRESS
const updateAddress = async (accountId, addressId, data) => {
  const customer = await findCustomer(accountId);

  const address = customer.addresses.id(addressId);

  if (!address) {
    const err = new Error("Address not found");
    err.status = 404;
    throw err;
  }

  // assign là cách nhanh để gán từng trường, nhưng sẽ gán tất cả nên
  // có thể gây lỗi nếu data có trường không mong muốn. 
  // Cách an toàn hơn là gán thủ công từng trường như ở updateProfile
  Object.assign(address, data);

  // xử lý default
  if (data.isDefault) {
    customer.addresses.forEach(addr => {
      addr.isDefault =
        addr._id.toString() === addressId.toString();
    });
  }

  await customer.save();
  return customer.toJSON();
};

// DELETE ADDRESS
const deleteAddress = async (accountId, addressId) => {
  const customer = await findCustomer(accountId);

  const address = customer.addresses.id(addressId);

  if (!address) {
    const err = new Error("Address not found");
    err.status = 404;
    throw err;
  }

  // lưu lại xem cái bị xoá có phải default không
  const isDeletedDefault = address.isDefault;

  // xoá
  address.deleteOne();

  // nếu xoá cái default thì phải set lại
  if (isDeletedDefault && customer.addresses.length > 0) {
    customer.addresses[0].isDefault = true;
  }

  await customer.save();
  return customer.toJSON();
};

// SET DEFAULT ADDRESS
const setDefaultAddress = async (accountId, addressId) => {
  const customer = await findCustomer(accountId);

  const address = customer.addresses.id(addressId);

  if (!address) {
    const err = new Error("Address not found");
    err.status = 404;
    throw err;
  }

  customer.addresses.forEach(addr => {
    addr.isDefault =
      addr._id.toString() === addressId.toString();
  });

  await customer.save();
  return customer.toJSON();
};

// UPLOAD AVATAR
const updateAvatar = async (accountIdFromToken, file) => {
  if (!file) {
    const err = new Error("No file uploaded");
    err.status = 400;
    throw err;
  }

  const customer = await findCustomer(accountIdFromToken);

  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "dermify/avatar"
    });

    customer.avatar = result.secure_url;
    await customer.save();

    return customer.toJSON();

  } finally {
    if (file?.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
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
  updateAvatar
};