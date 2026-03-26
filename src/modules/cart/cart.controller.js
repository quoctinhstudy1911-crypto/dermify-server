const cartService = require("./cart.service");

const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // basic validation (từ code hiện tại suy ra required)
    if (!productId || typeof quantity !== "number" || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid input"
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
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

module.exports = {
  addToCart
};