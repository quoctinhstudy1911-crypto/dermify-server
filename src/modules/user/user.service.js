const repo = require("./user.repository");

exports.createUser = (data) => repo.create(data);
exports.getUsers = () => repo.findAll();
exports.getUser = (id) => repo.findById(id);
exports.updateUser = (id, data) => repo.update(id, data);
exports.deleteUser = (id) => repo.delete(id);