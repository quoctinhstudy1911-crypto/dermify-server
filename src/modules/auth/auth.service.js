const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Account = require("../account/account.model");
const Customer = require("../customer/customer.model");

// CHỨC NĂNG ĐĂNG NHẬP CHO ADMIN VÀ CUSTOMER
const login = async ({ email, password }) => {

  // 1. check email 
  const account = await Account.findOne({ email }).select("+password");

 // 2. check account tồn tại
  if (!account) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }

  // 3. check account có bị xóa không
  if (account.isDeleted) {
    const err = new Error("Account has been deleted");
    err.status = 403;
    throw err;
  }

  // 4. check account có trạng thái active không
  if (account.status !== "active") {
    const err = new Error("Account is inactive");
    err.status = 403;
    throw err;
  }

 // 5. check password
  const isMatch = await bcrypt.compare(password, account.password);

  // 6. nếu không match thì trả về lỗi
  if (!isMatch) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }

  // 7. cập nhật lastLogin
  account.lastLogin = new Date();
  await account.save();

  // 8. tạo token
  const token = jwt.sign(
    { id: account._id, role: account.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  // 9. trả về token và role
  return {
    token,
    role: account.role
  };
};

// CHỨC NĂNG ĐĂNG KÝ CHO CUSTOMER
const register = async (data) => {
  const { email, password, name, phone } = data;

  // 1. check email
  const existing = await Account.findOne({ email });

  if (existing) {
    const err = new Error("Email already exists");
    err.status = 400;
    throw err;
  }

  // 2. hash password
  const hashed = await bcrypt.hash(password, 10);

  // 3. tạo account
  const account = await Account.create({
    email,
    password: hashed,
    role: "customer",
    status: "active"
  });

  // 4. tạo customer
  await Customer.create({
    accountId: account._id,
    name,
    phone
  });

  return {
    email: account.email
  };
};

module.exports = { 
  login,
  register
 };