const express = require("express");
const router = express.Router();

const cartController = require("./cart.controller");
const auth = require("../../middleware/authMiddleware");

// Add product to cart
router.post("/add", auth, cartController.addToCart);

module.exports = router;