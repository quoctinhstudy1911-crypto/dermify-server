const express = require("express");
const router = express.Router();
const authController = require("./auth.controller");
const { validateRegister } = require("./auth.validation");

router.post("/register", validateRegister, authController.register);
router.post("/login", authController.login);
router.get("/verify-email", authController.verifyEmail);
router.post("/refresh-token", authController.refreshToken);
router.get("/me", authMiddleware, controller.getMe);
router.post("/logout", authMiddleware, controller.logout);
router.post("/forgot-password", controller.forgotPassword);
router.post("/reset-password", controller.resetPassword);

module.exports = router;