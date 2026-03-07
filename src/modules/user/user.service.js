const User = require("./user.model");

exports.createUser = async (data) => {
  return await User.create(data);
};

exports.getUsers = async () => {
  return await User.find();
};

exports.getUser = async (id) => {
  return await User.findById(id);
};

exports.updateUser = async (id, data) => {
  return await User.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};