
// Validation cho route /register
const validateRegister = (req, res, next) => {
  let { email, password, name, phone } = req.body;

  // 0. kiểm tra kiểu dữ liệu
  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof name !== "string" ||
    typeof phone !== "string"
  ) {
    const err = new Error("Dữ liệu không hợp lệ");
    err.status = 400;
    return next(err);
  }

  // 1. chuẩn hoá
  email = email.trim().toLowerCase();
  password = password.trim();
  name = name.trim();
  phone = phone.trim();

  // 2. required
  if (!email || !password || !name || !phone) {
    const err = new Error("Thiếu thông tin bắt buộc");
    err.status = 400;
    return next(err);
  }

  // 3. length limit
  if (email.length > 255) return next(new Error("Email quá dài"));
  if (password.length > 100) return next(new Error("Mật khẩu quá dài"));
  if (name.length > 100) return next(new Error("Tên quá dài"));

  // 4. email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    const err = new Error("Email không hợp lệ");
    err.status = 400;
    return next(err);
  }

  // 5. password
  if (password.length < 8) {
    const err = new Error("Mật khẩu phải có ít nhất 8 ký tự");
    err.status = 400;
    return next(err);
  }

  // 6. normalize phone
  if (phone.startsWith("+84")) {
    phone = "0" + phone.slice(3);
  }

  // 7. phone format
  const phoneRegex = /^0[0-9]{9}$/;
  if (!phoneRegex.test(phone)) {
    const err = new Error("Số điện thoại không hợp lệ");
    err.status = 400;
    return next(err);
  }

  // 8. assign lại
  req.body.email = email;
  req.body.password = password;
  req.body.name = name;
  req.body.phone = phone;

  next();
};

module.exports = {
  validateRegister,
};