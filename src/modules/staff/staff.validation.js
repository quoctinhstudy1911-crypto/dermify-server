const validateCreateStaff = (req, res, next) => {
  const { email, password, name, phone } = req.body;

  if (!email || !password || !name || !phone) {
    const err = new Error("Missing required fields");
    err.status = 400;
    return next(err);
  }

  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    const err = new Error("Invalid email");
    err.status = 400;
    return next(err);
  }

  if (password.length < 8) {
    const err = new Error("Password must be at least 8 characters");
    err.status = 400;
    return next(err);
  }

  const phoneRegex = /^[0-9]{9,11}$/;
  if (!phoneRegex.test(phone)) {
    const err = new Error("Invalid phone");
    err.status = 400;
    return next(err);
  }

  next();
};

module.exports = { validateCreateStaff };