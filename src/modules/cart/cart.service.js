const Cart = require("./cart.model");
const Product = require("../product/product.model");

const addToCart = async (customerId, productId, quantity) => {

  // 1. check product tồn tại
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("Product not found");
  }

  // 2. tìm cart
  let cart = await Cart.findOne({ customerId });

  // 3. nếu chưa có → tạo
  if (!cart) {
    cart = await Cart.create({
      customerId,
      items: []
    });
  }

  // 4. check item đã tồn tại
 const existingItem = cart.items.find(
  (i) => i.productId.equals(productId)
);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      productId,
      quantity
    });
  }

  // 5. save
  await cart.save();

  return cart;
};

module.exports = {
  addToCart
};