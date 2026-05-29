  const express = require("express"); 
  const cors = require("cors");

  // ROUTES
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

  const app = express(); 

  // ================== GLOBAL MIDDLEWARE ==================
  app.use(cors());
  app.use(express.json({ limit: "10mb" })); // Dùng để khi mà gửi dữ liệu json vào req.body, nếu dữ liệu đó lớn hơn 10mb thì sẽ bị từ chối. Điều này giúp bảo vệ server khỏi các request có payload quá lớn có thể
  app.use(express.urlencoded({ limit: "10mb", extended: true }));

  // ================== ROUTES ==================

  const routes = [
    { path: "/auth", route: authRoutes },
    { path: "/staff", route: staffRoutes },
    { path: "/customer", route: customerRoutes },
    { path: "/upload", route: uploadRoutes },
    { path: "/products", route: productRoutes },
    { path: "/categories", route: categoryRoutes },
    { path: "/reviews", route: reviewRoutes },
    { path: "/cart", route: cartRoutes },
    { path: "/orders", route: orderRoutes },
    { path: "/users", route: userManagementRoutes },
  ];

  routes.forEach(r => {
    app.use(`/api${r.path}`, r.route);
    app.use(r.path, r.route);
  });

  // ================== TEST ROUTE ==================
  app.get("/", (req, res) => {
    res.send("Dermify API Running...");
  });

  // ================== ERROR HANDLER ==================
  app.use(errorHandler);

  module.exports = app;