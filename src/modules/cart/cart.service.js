const Cart = require("./cart.model");
const Product = require("../product/product.model");

const addToCart = async (customerId, productId, quantity) => {

  // 1. check product tồn tại
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("Product not found");
  }


  if (product.stock < quantity) {
    throw new Error(`Insufficient stock. Only ${product.stock} items available`);
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
  
    const newQuantity = existingItem.quantity + quantity;
    if (product.stock < newQuantity) {
      throw new Error(`Insufficient stock. You already have ${existingItem.quantity} in cart, only ${product.stock - existingItem.quantity} more available`);
    }
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

// ================= GET CART =================
const getCart = async (customerId) => {
  const cart = await Cart.findOne({ customerId })
    .populate("items.productId");

  return cart;
};

// ================= UPDATE QUANTITY =================
const updateCartItem = async (customerId, productId, quantity) => {

  // 1. tìm cart
  const cart = await Cart.findOne({ customerId });
  if (!cart) {
    throw new Error("Cart not found");
  }

  // 2. tìm item
  const item = cart.items.find(
    (i) => i.productId.equals(productId)
  );

  if (!item) {
    throw new Error("Item not found in cart");
  }

 
  if (quantity <= 0) {
    // Nếu quantity <= 0, tự động xóa item khỏi giỏ
    cart.items = cart.items.filter(
      (i) => !i.productId.equals(productId)
    );
    await cart.save();
    return cart;
  }

  
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("Product not found");
  }
  
  if (product.stock < quantity) {
    throw new Error(`Insufficient stock. Only ${product.stock} items available`);
  }

  // 3. update quantity
  item.quantity = quantity;

  // 4. save
  await cart.save();

  return cart;
};

// ================= REMOVE ITEM =================
const removeCartItem = async (customerId, productId) => {

  // 1. tìm cart
  const cart = await Cart.findOne({ customerId });
  if (!cart) {
    throw new Error("Cart not found");
  }

  // 2. check item tồn tại
  const itemExists = cart.items.some(
    (i) => i.productId.equals(productId)
  );

  if (!itemExists) {
    throw new Error("Item not found in cart");
  }

  // 3. remove item
  cart.items = cart.items.filter(
    (i) => !i.productId.equals(productId)
  );

  // 4. save
  await cart.save();

  return cart;
};

// ================= CLEAR CART =================
const clearCart = async (customerId) => {
  // 1. Kiểm tra cart tồn tại
  const cart = await Cart.findOne({ customerId });
  if (!cart) {
    throw new Error("Cart not found");
  }

  // 2. Clear all items
  cart.items = [];

  // 3. Save
  await cart.save();

  return cart;
};

module.exports = {
  addToCart,
  getCart,
  updateCartItem,
   removeCartItem,
   clearCart 
};