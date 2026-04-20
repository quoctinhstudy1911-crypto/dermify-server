const express = require("express");
const cors = require("cors");

// ROUTES ( Thêm module ở đây )
const authRoutes = require("./modules/auth/auth.routes");
const staffRoutes = require("./modules/staff/staff.routes");
const customerRoutes = require("./modules/customer/customer.routes");
const uploadRoutes = require("./modules/upload/upload.routes");
const productRoutes = require("./modules/product/product.routes");
const categoryRoutes = require("./modules/category/category.routes");
const cartRoutes = require("./modules/cart/cart.routes");
const orderRoutes = require("./modules/order/order.routes");
const reviewRoutes = require("./modules/review/review.routes");
const userManagementRoutes = require("./modules/user-management/user-management.routes");

// MIDDLEWARE
const errorHandler = require("./middleware/errorHandler");
const authMiddleware = require("./middleware/authMiddleware");
const requireRole = require("./middleware/requireRole");

const app = express();

// ================== GLOBAL MIDDLEWARE ==================
// CỐ ĐỊNH
app.use(cors());
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ================== ROUTES ==================
// DÙNG STRUCTURE API
app.use("/api/auth", authRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userManagementRoutes);

// DÙNG STRUCTURE THÔNG THƯỜNG
app.use("/auth", authRoutes);
app.use("/staff", staffRoutes);
app.use("/customer", customerRoutes);
app.use("/upload", uploadRoutes);
app.use("/products", productRoutes);
app.use("/categories", categoryRoutes);
app.use("/reviews", reviewRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);
app.use("/users", userManagementRoutes);

// ================== TEST ROUTE ==================
app.get("/", (req, res) => {
  res.send("Dermify API Running...");
});

// ================== ERROR HANDLER ==================
app.use(errorHandler);
module.exports = app;