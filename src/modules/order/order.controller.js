const orderService = require("./order.service");
const mongoose = require("mongoose");

/**
 * Create Order
 */
const createOrder = async (req, res) => {
  try {
    const customerId = req.user.id;
    const orderData = req.body;

    if (!orderData.shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập địa chỉ giao hàng"
      });
    }

    const { fullName, phone, province, district, street } = orderData.shippingAddress;
    if (!fullName || !phone || !province || !district || !street) {
      return res.status(400).json({
        success: false,
        message: "Thiếu thông tin địa chỉ: fullName, phone, province, district, street"
      });
    }

    if (!orderData.paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng chọn phương thức thanh toán"
      });
    }

    const validPaymentMethods = ["cod", "vnpay", "momo", "banking"];
    if (!validPaymentMethods.includes(orderData.paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Phương thức thanh toán không hợp lệ. Cho phép: cod, vnpay, momo, banking"
      });
    }

    const order = await orderService.createOrder(customerId, orderData);

    return res.status(201).json({
      success: true,
      message: "Tạo đơn hàng thành công",
      data: order
    });

  } catch (error) {
    console.error("Create order error:", error);

    if (error.message === "Cart is empty") {
      return res.status(400).json({
        success: false,
        message: "Giỏ hàng đang trống. Vui lòng thêm sản phẩm trước khi đặt hàng"
      });
    }

    if (error.message.includes("stock") || error.message.includes("only") || error.message.includes("left")) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    if (error.message.includes("coupon") || error.message.includes("Invalid or expired coupon")) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    if (error.message === "Product not found") {
      return res.status(404).json({
        success: false,
        message: "Một hoặc nhiều sản phẩm không còn tồn tại"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Lỗi hệ thống"
    });
  }
};

/**
 * Get My Orders
 */
const getMyOrders = async (req, res) => {
  try {
    const customerId = req.user.id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status || null;

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

    const validStatuses = ["pending", "confirmed", "shipping", "delivered", "cancelled", "all"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Trạng thái không hợp lệ"
      });
    }

    const result = await orderService.getMyOrders(customerId, page, limit, status);

    return res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error("Get my orders error:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi hệ thống"
    });
  }
};

/**
 * Get Order Detail
 */
const getOrderDetail = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { orderId } = req.params;

    const cleanOrderId = orderId?.trim();

    if (!mongoose.Types.ObjectId.isValid(cleanOrderId)) {
      return res.status(400).json({
        success: false,
        message: "ID đơn hàng không hợp lệ"
      });
    }

    const order = await orderService.getOrderDetail(customerId, cleanOrderId);

    return res.status(200).json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error("Get order detail error:", error);

    if (error.message === "Order not found") {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Lỗi hệ thống"
    });
  }
};



/**
 * Cancel Order
 */
const cancelOrder = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { orderId } = req.params;
    const { reason } = req.body;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: "ID đơn hàng không hợp lệ"
      });
    }

    const order = await orderService.cancelOrder(customerId, orderId, reason);

    return res.status(200).json({
      success: true,
      message: "Hủy đơn hàng thành công",
      data: order
    });

  } catch (error) {
    console.error("Cancel order error:", error);

    if (error.message === "Order not found") {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn hàng"
      });
    }

    if (error.message.includes("Cannot cancel order")) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    return res.status(500).json({
      success: false,
      message: "Lỗi hệ thống"
    });
  }
};

// Viết 1 api để lấy đơn hàng có giá trị cao nhất trong tất cả các đơn hàng không cần xét điều kiện trong tất cả đơn hàng
const getMostExpensiveOrder = async (req, res) => {
  try {
    const order = await orderService.getMostExpensiveOrder();
    return res.status(200).json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error("Get most expensive order error:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi hệ thống"
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderDetail,
  cancelOrder,
  getMostExpensiveOrder
};