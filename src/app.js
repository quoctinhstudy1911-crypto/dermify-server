const express = require("express");
const cors = require("cors");

// ROUTES ( Thêm module ở đây )
const userRoutes = require("./modules/user/user.routes");
const authRoutes = require("./modules/auth/auth.routes");
const staffRoutes = require("./modules/staff/staff.routes");
const customerRoutes = require("./modules/customer/customer.routes");

const cartRoutes = require("./modules/cart/cart.routes");


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

app.use("/api/cart", cartRoutes);

// ================== TEST ROUTE ==================
app.get("/", (req, res) => {
  res.send("Dermify API Running...");
});


// ================== ERROR HANDLER ==================
app.use(errorHandler);





module.exports = app;