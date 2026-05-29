const express = require("express");
const router = express.Router();
const auth = require("../../middleware/authMiddleware");
const orderController = require("./order.controller");
const requireRole = require("../../middleware/requireRole");
const adminOrderController = require("./order.admin.controller"); 

// ==================== ADMIN ROUTES ====================
router.get("/admin/orders/statistics", auth, requireRole("admin", "staff", "super_admin"), adminOrderController.getOrderStatistics);
router.get("/admin/orders", auth, requireRole("admin", "staff", "super_admin"), adminOrderController.getAllOrders);
router.get("/admin/orders/:orderId", auth, requireRole("admin", "staff", "super_admin"), adminOrderController.getOrderDetail);
router.put("/admin/orders/:orderId/status", auth, requireRole("admin", "staff", "super_admin"), adminOrderController.updateOrderStatus);
router.put("/admin/orders/:orderId/payment", auth, requireRole("admin", "staff", "super_admin"), adminOrderController.updatePaymentStatus);

// Customer routes
router.post("/", auth, orderController.createOrder);
router.get("/", auth, orderController.getMyOrders);
router.get("/most-expensive", orderController.getMostExpensiveOrder);
router.get("/:orderId", auth, orderController.getOrderDetail);
router.put("/:orderId/cancel", auth, orderController.cancelOrder);



module.exports = router;
