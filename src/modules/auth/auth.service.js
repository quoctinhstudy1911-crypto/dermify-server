const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Account = require("../account/account.model");
const Customer = require("../customer/customer.model");

const login = async ({ email, password }) => {
  const account = await Account.findOne({ email }).select("+password");

  if (!account) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }

  // 🔥 NEW: check deleted
  if (account.isDeleted) {
    const err = new Error("Account has been deleted");
    err.status = 403;
    throw err;
  }

  // 🔥 NEW: check status
  if (account.status !== "active") {
    const err = new Error("Account is inactive");
    err.status = 403;
    throw err;
  }

  const isMatch = await bcrypt.compare(password, account.password);

  if (!isMatch) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }

  // 🔥 NEW: update last login
  account.lastLogin = new Date();
  await account.save();

  const token = jwt.sign(
    { id: account._id, role: account.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    token,
    role: account.role
  };
};

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