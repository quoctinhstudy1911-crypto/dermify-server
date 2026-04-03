const cartService = require("./cart.service");

// Add to cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || typeof quantity !== "number" || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Dữ liệu đầu vào không hợp lệ"
      });
    }

    const cart = await cartService.addToCart(
      req.user.id,
      productId,
      quantity
    );

    return res.status(201).json({
      success: true,
      data: cart
    });

  } catch (err) {

    if (err.message.includes("Insufficient stock")) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
    
    if (err.message === "Product not found") {
      return res.status(404).json({
        success: false,
        message: err.message
      });
    }
    
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// Get cart
const getCart = async (req, res) => {
  try {
    const cart = await cartService.getCart(req.user.id);

    return res.status(200).json({
      success: true,
      data: cart || { items: [] }
    });

  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// Update cart
const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || typeof quantity !== "number") {
      return res.status(400).json({
        success: false,
        message: "Dữ liệu đầu vào không hợp lệ"
      });
    }

    const cart = await cartService.updateCartItem(
      req.user.id,
      productId,
      quantity
    );

    return res.status(200).json({
      success: true,
      data: cart
    });

  } catch (err) {

    if (err.message.includes("Insufficient stock")) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }
    
    if (err.message === "Product not found" || err.message === "Cart not found") {
      return res.status(404).json({
        success: false,
        message: err.message
      });
    }
    
    if (err.message === "Item not found in cart") {
      return res.status(404).json({
        success: false,
        message: err.message
      });
    }
    
    console.error("Update cart error:", err);
    
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// Remove cart item
const removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu Product ID"
      });
    }

    const cart = await cartService.removeCartItem(
      req.user.id,
      productId
    );

    return res.status(200).json({
      success: true,
      data: cart
    });

  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// Clear cart
const clearCart = async (req, res) => {
  try {
    const cart = await cartService.clearCart(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Đã xóa toàn bộ giỏ hàng",
      data: cart
    });

  } catch (err) {
    const statusCode = err.message === "Cart not found" ? 404 : 400;
    return res.status(statusCode).json({
      success: false,
      message: err.message
    });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart
};