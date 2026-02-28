const User = require("./user.model");

exports.create = (data) => User.create(data);
exports.findAll = () => User.find();
exports.findById = (id) => User.findById(id);
exports.update = (id, data) =>
  User.findByIdAndUpdate(id, data, { new: true });
exports.delete = (id) =>
  User.findByIdAndDelete(id);