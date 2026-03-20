const validateRegister = (req, res, next) => {
  let { email, password, name, phone } = req.body;

  // trim data
  email = email?.trim();
  name = name?.trim();
  phone = phone?.trim();

  // 1. required
  if (!email || !password || !name || !phone) {
    const err = new Error("Missing required fields");
    err.status = 400;
    return next(err);
  }

  // 2. email format
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    const err = new Error("Invalid email");
    err.status = 400;
    return next(err);
  }

  // 3. password
  if (typeof password !== "string" || password.length < 8) {
    const err = new Error("Password must be at least 8 characters");
    err.status = 400;
    return next(err);
  }

  // 4. phone
  const phoneRegex = /^[0-9]{9,11}$/;
  if (!phoneRegex.test(phone)) {
    const err = new Error("Invalid phone number");
    err.status = 400;
    return next(err);
  }

  // update lại req.body sau khi trim
  req.body.email = email;
  req.body.name = name;
  req.body.phone = phone;

  next();
};

module.exports = {
  validateRegister,
};