const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const Account = require("../account/account.model");
const Staff = require("./staff.model");

/**
 * GET ALL STAFF
 */
const getAllStaff = async (query) => {
  let { page = 1, limit = 10, search, position } = query;

  // convert number
  page = Number(page);
  limit = Number(limit);

  const filter = {
    isDeleted: false
  };

  // search by name
  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }

  // filter by position
  if (position) {
    filter.position = position;
  }

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Staff.find(filter)
      .populate("accountId")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),

    Staff.countDocuments(filter)
  ]);

  return {
    items,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};

/**
 * GET STAFF BY ID
 */
const getStaffById = async (id) => {
  const staff = await Staff.findOne({
    _id: id,
    isDeleted: false
  }).populate("accountId");

  if (!staff) {
    const err = new Error("Staff not found");
    err.status = 404;
    throw err;
  }

  return staff;
};

/**
 * DELETE STAFF (SOFT DELETE + DISABLE ACCOUNT)
 */
const deleteStaff = async (id) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const staff = await Staff.findOne({
      _id: id,
      isDeleted: false
    }).session(session);

    if (!staff) {
      const err = new Error("Staff not found");
      err.status = 404;
      throw err;
    }

    // disable account
    await Account.findByIdAndUpdate(
      staff.accountId,
      { status: "inactive" },
      { session }
    );

    // soft delete
    staff.isDeleted = true;
    await staff.save({ session });

    await session.commitTransaction();

    return staff;

  } catch (err) {
    await session.abortTransaction();
    throw err;

  } finally {
    session.endSession();
  }
};

/**
 * UPDATE STAFF
 */
const updateStaff = async (id, data, currentUser) => {
  const staff = await Staff.findOne({
    _id: id,
    isDeleted: false
  });

  if (!staff) {
    const err = new Error("Staff not found");
    err.status = 404;
    throw err;
  }

  if (data.name !== undefined) {
    staff.name = data.name;
  }

  if (data.phone !== undefined) {
    staff.phone = data.phone;
  }

  // only super_admin can change position
  if (data.position !== undefined) {
    if (currentUser.role !== "super_admin") {
      const err = new Error("Forbidden to change position");
      err.status = 403;
      throw err;
    }
    staff.position = data.position;
  }

  await staff.save();

  return staff;
};

/**
 * CREATE STAFF (TRANSACTION)
 */
const createStaff = async (data) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { email, password, name, phone, position } = data;

    // check email
    const existing = await Account.findOne({ email }).session(session);

    if (existing) {
      const err = new Error("Email already exists");
      err.status = 400;
      throw err;
    }

    // hash password
    const hashed = await bcrypt.hash(password, 10);

    // create account
    const [account] = await Account.create(
      [
        {
          email,
          password: hashed,
          role: "staff",
          status: "active"
        }
      ],
      { session }
    );

    // create staff
    const [staff] = await Staff.create(
      [
        {
          accountId: account._id,
          name,
          phone,
          position
        }
      ],
      { session }
    );

    await session.commitTransaction();

    return staff;

  } catch (err) {
    await session.abortTransaction();
    throw err;

  } finally {
    session.endSession();
  }
};

/**
 * CREATE ADMIN (TRANSACTION)
 */
const createAdmin = async (data) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { email, password, name, phone } = data;

    // check email
    const existing = await Account.findOne({ email }).session(session);

    if (existing) {
      const err = new Error("Email already exists");
      err.status = 400;
      throw err;
    }

    // hash password
    const hashed = await bcrypt.hash(password, 10);

    // create account
    const [account] = await Account.create(
      [
        {
          email,
          password: hashed,
          role: "admin",
          status: "active"
        }
      ],
      { session }
    );

    // create staff
    const [staff] = await Staff.create(
      [
        {
          accountId: account._id,
          name,
          phone,
          position: "manager"
        }
      ],
      { session }
    );

    await session.commitTransaction();

    return {
      name: staff.name,
      role: "admin"
    };

  } catch (err) {
    await session.abortTransaction();
    throw err;

  } finally {
    session.endSession();
  }
};

// GET MY STAFF
const getMyStaff = async (accountId) => {
  const staff = await Staff.findOne({
    accountId,
    isDeleted: false
  }).populate("accountId");

  if (!staff) {
    const err = new Error("Staff not found");
    err.status = 404;
    throw err;
  }

  return staff;
};

// UPDATE MY STAFF
const updateMyStaff = async (accountId, data) => {
  // Tìm staff dựa trên accountId liên kết
  const staff = await Staff.findOne({ accountId, isDeleted: false });

  if (!staff) {
    const err = new Error("Không tìm thấy thông tin nhân viên");
    err.status = 404;
    throw err;
  }

  // Chỉ cho phép cập nhật các trường an toàn
  if (data.name) staff.name = data.name;
  if (data.phone) staff.phone = data.phone;
  // Bạn có thể thêm các trường khác nếu Model Staff có (vd: gender, dateOfBirth)

  await staff.save();
  return staff;
};

module.exports = {
  createStaff,
  getAllStaff,
  getStaffById,
  deleteStaff,
  updateStaff,
  createAdmin,
  getMyStaff,
  updateMyStaff
};