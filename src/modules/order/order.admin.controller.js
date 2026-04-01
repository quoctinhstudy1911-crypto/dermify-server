const orderService = require("./order.service");
const mongoose = require("mongoose"); 
/**
 * Get All Orders - Admin
 * GET /api/admin/orders?page=1&limit=10&status=pending&paymentStatus=paid&search=DH123&fromDate=2024-01-01&toDate=2024-12-31
 */
const getAllOrders = async (req, res) => {
  try {
    // Lấy query params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status || null;
    const paymentStatus = req.query.paymentStatus || null;
    const search = req.query.search || null;
    const fromDate = req.query.fromDate || null;
    const toDate = req.query.toDate || null;
    
    // Validate page và limit
    if (page < 1) {
      return res.status(400).json({
        success: false,
        message: "Trang phải lớn hơn 0"
      });
    }
    
    if (limit < 1 || limit > 100) {
      return res.status(400).json({
        success: false,
        message: "Số lượng mỗi trang phải từ 1 đến 100"
      });
    }
    
    // Validate status
    const validStatuses = ["pending", "confirmed", "shipping", "delivered", "cancelled"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Trạng thái không hợp lệ. Cho phép: pending, confirmed, shipping, delivered, cancelled"
      });
    }
    
    // Validate payment status
    const validPaymentStatuses = ["pending", "paid", "refunded"];
    if (paymentStatus && !validPaymentStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: "Trạng thái thanh toán không hợp lệ. Cho phép: pending, paid, refunded"
      });
    }
    
    // Validate dates
    if (fromDate && isNaN(new Date(fromDate))) {
      return res.status(400).json({
        success: false,
        message: "Định dạng fromDate không hợp lệ. Dùng YYYY-MM-DD"
      });
    }
    
    if (toDate && isNaN(new Date(toDate))) {
      return res.status(400).json({
        success: false,
        message: "Định dạng toDate không hợp lệ. Dùng YYYY-MM-DD"
      });
    }
    
    // Xây dựng filters
    const filters = {
      status,
      paymentStatus,
      search,
      fromDate,
      toDate
    };
    
    // Lấy danh sách orders
    const result = await orderService.getAllOrders(filters, page, limit);
    
    return res.status(200).json({
      success: true,
      data: result
    });
    
  } catch (error) {
    console.error("Get all orders error:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi hệ thống"
    });
  }
};


/**
 * Update Order Status - Admin
 * PUT /api/admin/orders/:orderId/status
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // Validate orderId format
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: "ID đơn hàng không hợp lệ"
      });
    }

    // Validate status
    const validStatuses = ["pending", "confirmed", "shipping", "delivered", "cancelled"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Trạng thái không hợp lệ. Cho phép: ${validStatuses.join(", ")}`
      });
    }

    // Gọi service
    const order = await orderService.updateOrderStatus(orderId, status);

    return res.status(200).json({
      success: true,
      message: `Cập nhật trạng thái đơn hàng thành ${status} thành công`,
      data: order
    });

  } catch (error) {
    console.error("Update order status error:", error.message);

    const msg = error.message || "Lỗi hệ thống";

    // 404
    if (msg === "Order not found") {
      return res.status(404).json({
        success: false,
        message: msg
      });
    }

    // 400 - lỗi business logic
    if (
      msg.toLowerCase().includes("cannot") ||
      msg.toLowerCase().includes("must be paid") ||
      msg.toLowerCase().includes("already")
    ) {
      return res.status(400).json({
        success: false,
        message: msg
      });
    }

    // 500 - lỗi thật sự
    return res.status(500).json({
      success: false,
      message: msg
    });
  }
};

/**
 * Update Payment Status - Admin
 * PUT /api/admin/orders/:orderId/payment
 */
const updatePaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { paymentStatus, transactionId, bankCode, payDate } = req.body;
    
    // Validate orderId format
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: "ID đơn hàng không hợp lệ "
      });
    }
    
    // Validate payment status
    const validPaymentStatuses = ["pending", "paid", "refunded"];
    if (!paymentStatus || !validPaymentStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: `Trạng thái thanh toán không hợp lệ. Cho phép: ${validPaymentStatuses.join(", ")}`
      });
    }
    
    // Chuẩn bị payment details
    const paymentDetails = {
      transactionId: transactionId || null,
      bankCode: bankCode || null,
      payDate: payDate ? new Date(payDate) : (paymentStatus === "paid" ? new Date() : null)
    };
    
    // Cập nhật trạng thái thanh toán
    const order = await orderService.updatePaymentStatus(orderId, paymentStatus, paymentDetails);
    
    // Tạo message phù hợp
    let message = "";
    if (paymentStatus === "paid") {
      message = "Xác nhận thanh toán thành công";
    } else if (paymentStatus === "refunded") {
      message = "Hoàn tiền thành công";
    } else {
      message = `Cập nhật trạng thái thanh toán thành ${paymentStatus}`;
    }
    
    return res.status(200).json({
      success: true,
      message: message,
      data: order
    });
    
  } catch (error) {
  console.error("Update payment status error:", error.message);

  const msg = error.message || "Lỗi hệ thống";

  // 404
  if (msg === "Order not found") {
    return res.status(404).json({
      success: false,
      message: msg
    });
  }

  // 400 - tất cả lỗi business logic
  if (
    msg.includes("Cannot change payment status") ||
    msg.includes("Cannot update payment") ||
    msg.includes("TransactionId") ||
    msg.includes("completed")
  ) {
    return res.status(400).json({
      success: false,
      message: msg
    });
  }

  // fallback
  return res.status(500).json({
    success: false,
    message: msg
  });
}
};

/**
 * Get Order Statistics - Admin
 * GET /api/admin/orders/statistics?startDate=2026-03-01&endDate=2026-03-31
 */
const getOrderStatistics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Validate startDate
    if (startDate && isNaN(new Date(startDate))) {
      return res.status(400).json({
        success: false,
        message: "Định dạng startDate không hợp lệ (YYYY-MM-DD)"
      });
    }

    // Validate endDate
    if (endDate && isNaN(new Date(endDate))) {
      return res.status(400).json({
        success: false,
        message: "Định dạng endDate không hợp lệ (YYYY-MM-DD)"
      });
    }

    const statistics = await orderService.getOrderStatistics(startDate, endDate);

    return res.status(200).json({
      success: true,
      data: statistics
    });

  } catch (error) {
    console.error("Get order statistics error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message || "Lỗi hệ thống"
    });
  }
};

module.exports = {
  getAllOrders,
  updateOrderStatus,
   updatePaymentStatus,
    getOrderStatistics
};