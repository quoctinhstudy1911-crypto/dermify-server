const express = require("express");
const router = express.Router();

const cartController = require("./cart.controller");
const auth = require("../../middleware/authMiddleware");

// Add product to cart
router.post("/add", auth, cartController.addToCart);
router.get("/", auth, cartController.getCart);
router.put("/update", auth, cartController.updateCartItem);
router.delete("/remove/:productId", auth, cartController.removeCartItem);
router.delete("/clear", auth, cartController.clearCart);
module.exports = router;