const service = require("./user.service");

exports.create = async (req, res) => {
  const user = await service.createUser(req.body);
  res.status(201).json(user);
};

exports.getAll = async (req, res) => {
  const users = await service.getUsers();
  res.json(users);
};

exports.getOne = async (req, res) => {
  const user = await service.getUser(req.params.id);
  res.json(user);
};

exports.update = async (req, res) => {
  const user = await service.updateUser(req.params.id, req.body);
  res.json(user);
};

exports.delete = async (req, res) => {
  await service.deleteUser(req.params.id);
  res.json({ message: "Deleted" });
};