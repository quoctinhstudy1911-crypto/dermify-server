const express = require("express");
const router = express.Router();
const auth = require("../../middleware/authMiddleware");
const orderController = require("./order.controller");
const requireRole = require("../../middleware/requireRole");
const adminOrderController = require("./order.admin.controller"); 

// Customer routes
router.post("/", auth, orderController.createOrder);
router.get("/", auth, orderController.getMyOrders);    
router.get("/:orderId", auth, orderController.getOrderDetail); 
router.put("/:orderId/cancel", auth, orderController.cancelOrder);

// ==================== ADMIN ROUTES ====================
router.get("/admin/orders",auth,requireRole("admin", "staff"),adminOrderController.getAllOrders);
router.put("/admin/orders/:orderId/status",auth,requireRole("admin", "staff"),adminOrderController.updateOrderStatus);
router.put("/admin/orders/:orderId/payment",auth,requireRole("admin", "staff"),adminOrderController.updatePaymentStatus);
router.get("/admin/orders/statistics",auth,requireRole("admin", "staff"),adminOrderController.getOrderStatistics );

module.exports = router;