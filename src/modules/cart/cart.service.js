const Cart = require("./cart.model");
const Product = require("../product/product.model");

const addToCart = async (customerId, productId, quantity) => {

  // 1. check product tồn tại
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("Không tìm thấy sản phẩm ");
  }


  if (product.stock < quantity) {
    throw new Error(`Số lượng tồn kho không đủ. Chỉ còn ${product.stock} items available`);
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
      throw new Error(`Số lượng tồn kho không đủ. Bạn đã có ${existingItem.quantity} trong giỏ, chỉ có thể thêm tối đa ${product.stock - existingItem.quantity} sản phẩm`);
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
    throw new Error("Không tìm thấy giỏ hàng");
  }

  // 2. tìm item
  const item = cart.items.find(
    (i) => i.productId.equals(productId)
  );

  if (!item) {
    throw new Error("Không tìm thấy giỏ hàng");
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
    throw new Error("Không tìm thấy sản phẩm");
  }
  
  if (product.stock < quantity) {
    throw new Error(`Số lượng tồn kho không đủ. Chỉ còn ${product.stock} sản phẩm `);
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
    throw new Error("Không tìm thấy giỏ hàng");
  }

  // 2. check item tồn tại
  const itemExists = cart.items.some(
    (i) => i.productId.equals(productId)
  );

  if (!itemExists) {
    throw new Error("Sản phẩm không tồn tại trong giỏ hàng");
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
    throw new Error("Không tìm thấy giỏ hàng ");
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