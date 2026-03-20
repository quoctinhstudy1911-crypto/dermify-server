const express = require("express");
const router = express.Router();
const authController = require("./auth.controller");
const { validateRegister } = require("./auth.validation");


router.post("/login", authController.login);
router.post("/register", validateRegister, authController.register);

module.exports = router;