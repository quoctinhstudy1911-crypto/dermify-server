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
  return customer;
};

// UPDATE PROFILE
const updateProfile = async (accountId, data) => {
  const customer = await findCustomer(accountId);

  // safe update
  if (data.name !== undefined) customer.name = data.name;
  if (data.phone !== undefined) customer.phone = data.phone;
  if (data.gender !== undefined) customer.gender = data.gender;
  if (data.dateOfBirth !== undefined) {
    customer.dateOfBirth = data.dateOfBirth;
  }

  await customer.save();
  return customer;
};

// GET ADDRESSES
const getAddresses = async (accountId) => {
  const customer = await findCustomer(accountId);
   // Trường hợp không tìm thấy customer
   if(!customer)
   {
    const err = new Error("Customer not found");
    err.status = 404;
    throw err;
   }
   // Trả về mảng địa chỉ, nếu không có thì trả về mảng rỗng
    return customer.addresses || [];
}

// ADD ADDRESS
const addAddress = async (accountId, data) => {
  const customer = await findCustomer(accountId);

  // nếu chưa có address → auto default
  if (customer.addresses.length === 0) {
    data.isDefault = true;
  }

  // nếu set default → reset tất cả
  if (data.isDefault) {
    customer.addresses.forEach(addr => (addr.isDefault = false));
  }

  customer.addresses.push(data);

  await customer.save();
  return customer;
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

  // update fields
  Object.assign(address, data);

  // xử lý default
  if (data.isDefault) {
    customer.addresses.forEach(addr => {
      addr.isDefault =
        addr._id.toString() === addressId.toString();
    });
  }

  await customer.save();
  return customer;
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

  address.deleteOne();

  if (customer.addresses.length > 1) {
    const hasDefault = customer.addresses.some(addr => addr.isDefault);

    if (!hasDefault) {
      customer.addresses[0].isDefault = true;
    }
  }

  await customer.save();
  return customer;
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
  return customer;
};

// UPLOAD AVATAR
const updateAvatar = async (accountIdFromToken, file) => {
  if (!file) {
    const err = new Error("No file uploaded");
    err.status = 400;
    throw err;
  }

  // SỬA TẠI ĐÂY: Dùng đúng tên trường 'accountId' như trong Model
  const customer = await Customer.findOne({ accountId: accountIdFromToken });

  if (!customer) {
    // Nếu vẫn không thấy, hãy log ra để kiểm tra giá trị ID nhận vào
    console.log("ID từ token gửi xuống:", accountIdFromToken);
    const err = new Error("Không tìm thấy khách hàng trong Database");
    err.status = 404;
    throw err;
  }

  // Upload lên Cloudinary
  const result = await cloudinary.uploader.upload(file.path, {
    folder: "dermify/avatar"
  });

  // Dọn dẹp file tạm (fs.unlinkSync...)
  if (fs.existsSync(file.path)) {
    fs.unlinkSync(file.path);
  }

  customer.avatar = result.secure_url;
  await customer.save();

  return customer;
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