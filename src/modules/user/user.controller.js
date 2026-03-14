const service = require("./user.service");

// CREATE USER
exports.create = async (req, res) => {
  try {

    const user = await service.createUser(req.body);

    return res.status(201).json(user);

  } catch (error) {

    // lỗi email trùng (MongoDB duplicate key)
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }

    return res.status(500).json({
      message: "Internal server error"
    });
  }
};


// GET ALL USERS
exports.getAll = async (req, res) => {
  try {

    const users = await service.getUsers();

    return res.status(200).json(users);

  } catch (error) {

    return res.status(500).json({
      message: "Internal server error"
    });

  }
};


// GET ONE USER
exports.getOne = async (req, res) => {
  try {

    const user = await service.getUser(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    return res.status(200).json(user);

  } catch (error) {

    return res.status(500).json({
      message: "Internal server error"
    });

  }
};


// UPDATE USER
exports.update = async (req, res) => {
  try {

    const user = await service.updateUser(req.params.id, req.body);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    return res.status(200).json(user);

  } catch (error) {

    if (error.code === 11000) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }

    return res.status(500).json({
      message: "Internal server error"
    });

  }
};


// DELETE USER
exports.delete = async (req, res) => {
  try {

    const user = await service.deleteUser(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    return res.status(200).json({
      message: "Deleted successfully"
    });

  } catch (error) {

    return res.status(500).json({
      message: "Internal server error"
    });

  }
};