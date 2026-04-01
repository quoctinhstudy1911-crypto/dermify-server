const express = require("express");
const cors = require("cors");

// ROUTES ( Thêm module ở đây )
const userRoutes = require("./modules/user/user.routes");
const authRoutes = require("./modules/auth/auth.routes");
const staffRoutes = require("./modules/staff/staff.routes");
const customerRoutes = require("./modules/customer/customer.routes");
const uploadRoutes = require("./modules/upload/upload.routes");
const productRoutes = require("./modules/product/product.routes");
const categoryRoutes = require("./modules/category/category.routes");
const cartRoutes = require("./modules/cart/cart.routes");
const orderRoutes = require("./modules/order/order.routes");
const reviewRoutes = require("./modules/review/review.routes");


// MIDDLEWARE
const errorHandler = require("./middleware/errorHandler");
const authMiddleware = require("./middleware/authMiddleware");
const requireRole = require("./middleware/requireRole");


const app = express();


// ================== GLOBAL MIDDLEWARE ==================
// CỐ ĐỊNH
app.use(cors());
app.use(express.json());


// ================== ROUTES ==================
// CỐ ĐỊNH STRUCTURE 
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// ================== TEST ROUTE ==================
app.get("/", (req, res) => {
  res.send("Dermify API Running...");
});


// ================== ERROR HANDLER ==================
app.use(errorHandler);





module.exports = app;