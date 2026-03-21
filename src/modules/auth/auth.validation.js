const validateRegister = (req, res, next) => {
  let { email, password, name, phone } = req.body;

  // 1. trim inputs
  email = email?.trim();
  name = name?.trim();
  phone = phone?.trim();

  // 2. kiểm tra required fields
  if (!email || !password || !name || !phone) {
    const err = new Error("Missing required fields");
    err.status = 400;
    return next(err);
  }

  // 3. email format
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    const err = new Error("Invalid email");
    err.status = 400;
    return next(err);
  }

  // 4. password length
  if (typeof password !== "string" || password.length < 8) {
    const err = new Error("Password must be at least 8 characters");
    err.status = 400;
    return next(err);
  }

  // 5. phone format (chỉ chứa số và có độ dài từ 9 đến 11)
  const phoneRegex = /^[0-9]{9,11}$/;
  if (!phoneRegex.test(phone)) {
    const err = new Error("Invalid phone number");
    err.status = 400;
    return next(err);
  }

  // 6. gắn lại vào req.body sau khi đã trim và validate
  req.body.email = email;
  req.body.name = name;
  req.body.phone = phone;

  next();
};

module.exports = {
  validateRegister,
};