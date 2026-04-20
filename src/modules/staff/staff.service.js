const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const Account = require("../account/account.model");
const Staff = require("./staff.model");

/**
 * GET ALL STAFF
 */
const getAllStaff = async (query) => {
  let { page = 1, limit = 10, search, position } = query;

  page = Number(page) || 1;
  limit = Number(limit) || 10;

  const filter = { isDeleted: false };

  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }

  if (position) {
    filter.position = position;
  }

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Staff.find(filter)
      .populate("accountId", "email role status") // Chỉ lấy những field cần thiết của Account
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
  const staff = await Staff.findOne({ _id: id, isDeleted: false }).populate("accountId");
  if (!staff) {
    const err = new Error("Không tìm thấy thông tin nhân viên");
    err.status = 404;
    throw err;
  }
  return staff;
};

/**
 * DELETE STAFF (SOFT DELETE + DISABLE ACCOUNT)
 * FIX: Kiểm tra ID an toàn hơn để tránh tự khóa mình
 */
const deleteStaff = async (id, currentUser) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // Tìm staff cần xóa trước để lấy accountId
    const staff = await Staff.findOne({ _id: id, isDeleted: false }).session(session);
    if (!staff) {
      const err = new Error("Không tìm thấy nhân sự hoặc đã bị xóa");
      err.status = 404;
      throw err;
    }

    // NGHIỆP VỤ 1: Ngăn tự xóa chính mình (So sánh cả Staff ID và Account ID)
    if (staff._id.toString() === currentUser.staffId || staff.accountId.toString() === currentUser.id) {
      const err = new Error("Bạn không thể tự vô hiệu hóa tài khoản của chính mình!");
      err.status = 400;
      throw err;
    }

    // NGHIỆP VỤ 2: Kiểm tra quyền hạn (Admin không thể xóa Admin/Super Admin)
    const targetAccount = await Account.findById(staff.accountId).session(session);
    if (currentUser.role === "admin" && targetAccount.role !== "staff") {
      const err = new Error("Bạn chỉ có quyền xóa tài khoản cấp Nhân viên (Staff)");
      err.status = 403;
      throw err;
    }

    // Vô hiệu hóa Account
    await Account.findByIdAndUpdate(
      staff.accountId,
      { status: "inactive" },
      { session }
    );

    // Đánh dấu xóa Staff
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
 * FIX: Ngăn admin sửa role/position trái phép
 */
const updateStaff = async (id, data, currentUser) => {
  const staff = await Staff.findOne({ _id: id, isDeleted: false }).populate("accountId");

  if (!staff) {
    const err = new Error("Staff không tồn tại");
    err.status = 404;
    throw err;
  }

  // Nếu có cập nhật position
  if (data.position !== undefined) {
    // Chỉ Super Admin mới có quyền đổi chức danh quản lý
    if (currentUser.role !== "super_admin") {
      const err = new Error("Bạn không có quyền thay đổi chức vụ nhân sự");
      err.status = 403;
      throw err;
    }
    staff.position = data.position;
  }

  if (data.name !== undefined) staff.name = data.name;
  if (data.phone !== undefined) staff.phone = data.phone;

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

    const existing = await Account.findOne({ email }).session(session);
    if (existing) {
      const err = new Error("Email này đã được sử dụng");
      err.status = 400;
      throw err;
    }

    const hashed = await bcrypt.hash(password, 10);
    const [account] = await Account.create([{
      email,
      password: hashed,
      role: "staff",
      status: "active"
    }], { session });

    const [staff] = await Staff.create([{
      accountId: account._id,
      name,
      phone,
      position: position || "staff"
    }], { session });

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
 * CREATE ADMIN (CHỈ SUPER_ADMIN GỌI)
 */
const createAdmin = async (data) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const { email, password, name, phone } = data;

    const existing = await Account.findOne({ email }).session(session);
    if (existing) {
      const err = new Error("Email Admin đã tồn tại");
      err.status = 400;
      throw err;
    }

    const hashed = await bcrypt.hash(password, 10);
    const [account] = await Account.create([{
      email,
      password: hashed,
      role: "admin",
      status: "active"
    }], { session });

    const [staff] = await Staff.create([{
      accountId: account._id,
      name,
      phone,
      position: "manager"
    }], { session });

    await session.commitTransaction();
    return { name: staff.name, role: account.role };
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

/**
 * GET MY STAFF (Hàm lấy profile của chính mình)
 */
const getMyStaff = async (accountId) => {
  let staff = await Staff.findOne({ accountId, isDeleted: false }).populate("accountId");
  
  if (staff) return staff;

  // Nếu login được nhưng chưa có profile (Thường là do seed hoặc tk mới tạo tay)
  const account = await Account.findById(accountId);
  if (account && ["staff", "admin", "super_admin"].includes(account.role)) {
    staff = await Staff.create({
      accountId: account._id,
      name: account.email.split("@")[0],
      phone: "0000000000",
      position: account.role === "staff" ? "staff" : "manager",
      isDeleted: false
    });
    return await Staff.findById(staff._id).populate("accountId");
  }

  const err = new Error("Không tìm thấy thông tin chi tiết của bạn");
  err.status = 404;
  throw err;
};

/**
 * UPDATE MY STAFF (Chỉnh sửa thông tin cá nhân)
 */
const updateMyStaff = async (accountId, data) => {
  const staff = await Staff.findOne({ accountId, isDeleted: false });
  if (!staff) {
    const err = new Error("Không thể cập nhật thông tin cá nhân");
    err.status = 404;
    throw err;
  }

  if (data.name) staff.name = data.name;
  if (data.phone) staff.phone = data.phone;

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