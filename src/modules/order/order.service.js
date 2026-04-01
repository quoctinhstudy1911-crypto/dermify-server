const Order = require("./order.model");
const Cart = require("../cart/cart.model");
const Product = require("../product/product.model");
const mongoose = require("mongoose");

//========Post api/orders

const generateOrderCode = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `DH${timestamp}${random}`;
};

const calculateShippingFee = (province) => {
  return 30000;
};

const createOrder = async (customerId, orderData) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Lấy giỏ hàng
    const cart = await Cart.findOne({ customerId })
      .populate("items.productId")
      .session(session);

    if (!cart || cart.items.length === 0) {
      throw new Error("Giỏ hàng đang trống");
    }

    // 2. Kiểm tra stock và xây dựng order items
    const orderItems = [];
    let subtotal = 0;

    for (const item of cart.items) {
      const product = item.productId;

      if (!product) {
        throw new Error("Sản phẩm không tồn tại");
      }

      if (product.stock < item.quantity) {
        throw new Error(`Sản phẩm ${product.name} chỉ còn ${product.stock} trong kho`);
      }

      const itemSubtotal = product.price * item.quantity;
      subtotal += itemSubtotal;

      orderItems.push({
        productId: product._id,
        name: product.name,
        image: product.image || "",
        price: product.price,
        quantity: item.quantity,
        subtotal: itemSubtotal
      });
    }

    // 3. Xử lý coupon (tạm bỏ qua)
    let discountAmount = 0;
    let couponId = null;

    // 4. Tính phí ship
    const shippingFee = calculateShippingFee(orderData.shippingAddress.province);

    // 5. Tính tổng tiền
    const totalPrice = subtotal - discountAmount + shippingFee;

    // 6. Tạo mã đơn hàng
    const orderCode = generateOrderCode();

    // 7. Tạo order
    const order = await Order.create([{
      orderCode,
      customerId,
      items: orderItems,
      subtotal,
      discountAmount,
      shippingFee,
      totalPrice,
      shippingAddress: {
        fullName: orderData.shippingAddress.fullName,
        phone: orderData.shippingAddress.phone,
        email: orderData.shippingAddress.email || "",
        province: orderData.shippingAddress.province,
        district: orderData.shippingAddress.district,
        ward: orderData.shippingAddress.ward || "",
        street: orderData.shippingAddress.street,
        note: orderData.shippingAddress.note || ""
      },
      paymentMethod: orderData.paymentMethod,
      paymentStatus: "pending",
      orderStatus: "pending",
      couponId,
      note: orderData.note || ""
    }], { session });

    // 8. Giảm stock
    for (const item of cart.items) {
  const productId = item.productId._id || item.productId;

  await Product.findByIdAndUpdate(
    productId,
    { $inc: { stock: -item.quantity } },
    { session }
  );
}

    // 9. Xóa cart
   await Cart.findOneAndDelete({ customerId },{ session });

    // COMMIT TRANSACTION - CHỈ GỌI 1 LẦN
    await session.commitTransaction();
    session.endSession();

    // 10. Trả về order đã populate
    const populatedOrder = await Order.findById(order[0]._id)
      .populate("items.productId", "name price image");

    return populatedOrder;

  } catch (error) {
    // CHỈ ABORT NẾU TRANSACTION VẪN ĐANG HOẠT ĐỘNG
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    session.endSession();
    throw error;
  }
};

//====== GET api/order

const getMyOrders = async (customerId, page = 1, limit = 10, status = null) => {
  // Xây dựng filter
  const filter = { customerId };
  if (status && status !== "all") {
    filter.orderStatus = status;
  }

  // Lấy total trước
  const total = await Order.countDocuments(filter);

  // Tính totalPages
  const totalPages = Math.ceil(total / limit) || 1;

  // FIX PAGE
  if (page > totalPages) {
    page = totalPages;
  }

  //  TÍNH SKIP SAU KHI FIX
  const skip = (page - 1) * limit;

  // Lấy orders
  const orders = await Order.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("items.productId", "name price image");

  return {
    orders,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  };
};

//======== GET /api/orders/:orderId


const getOrderDetail = async (customerId, orderId) => {
  // Tìm order và populate thông tin
  const order = await Order.findOne({
    _id: orderId,
    customerId  // Đảm bảo chỉ lấy đơn của chính customer này
  })
    .populate("items.productId", "name price image description")
    //.populate("couponId", "code discountType discountValue");

  if (!order) {
    throw new Error("Không tìm thấy đơn hàng");
  }

  return order;
};

/**
  PUT /api/orders/:orderId/cancel
 */
const cancelOrder = async (customerId, orderId, reason = "") => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Tìm order
    const order = await Order.findOne({
      _id: orderId,
      customerId
    }).session(session);

    if (!order) {
      throw new Error("Không tìm thấy đơn hàng");
    }
      if (order.orderStatus === "cancelled") {
   
    return order;
  }

    // 2. Kiểm tra trạng thái có thể hủy không
    const cancellableStatuses = ["pending", "confirmed"];
    if (!cancellableStatuses.includes(order.orderStatus)) {
      throw new Error(`Không thể hủy đơn hàng ở trạng thái: ${order.orderStatus}. Không thể hủy đơn hàng ở trạng thái`);
    }

    // 3. Cập nhật trạng thái order
    order.orderStatus = "cancelled";
    order.cancelledAt = new Date();
    if (order.paymentStatus === "paid") {
  order.paymentStatus = "refunded";
}
    if (reason) {
      order.note = reason;
    }

    await order.save({ session });

    // 4. Hoàn lại stock cho sản phẩm
  for (const item of order.items) {
  const productId = item.productId._id || item.productId;

  console.log("Restoring stock:", productId, item.quantity);

  await Product.findByIdAndUpdate(
    productId,
    { $inc: { stock: item.quantity } }
  );
}

    // 5. Commit transaction
    await session.commitTransaction();
    session.endSession();

    // 6. Trả về order đã cập nhật
    const updatedOrder = await Order.findById(orderId)
      .populate("items.productId", "name price image");

    return updatedOrder;

  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    session.endSession();
    throw error;
  }
};

/**
 * Lấy tất cả đơn hàng (Admin)
 * @param {object} filters - Các bộ lọc
 * @param {number} page - Số trang
 * @param {number} limit - Số lượng mỗi trang
 */
const getAllOrders = async (filters = {}, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  
  // Xây dựng filter
  const filter = {};
  
  // Lọc theo status
  if (filters.status) {
    filter.orderStatus = filters.status;
  }
  
  // Lọc theo payment status
  if (filters.paymentStatus) {
    filter.paymentStatus = filters.paymentStatus;
  }
  
  // Lọc theo khoảng thời gian
  if (filters.fromDate) {
    filter.createdAt = { ...filter.createdAt, $gte: new Date(filters.fromDate) };
  }
  if (filters.toDate) {
    filter.createdAt = { ...filter.createdAt, $lte: new Date(filters.toDate) };
  }
  
  // Search theo orderCode hoặc customer name (cần populate để search)
  let searchFilter = {};
  if (filters.search) {
    // Tìm customer theo tên
    const Customer = require("../customer/customer.model");
    const customers = await Customer.find({
      fullName: { $regex: filters.search, $options: "i" }
    }).select("_id");
    
    const customerIds = customers.map(c => c._id);
    
    searchFilter = {
      $or: [
        { orderCode: { $regex: filters.search, $options: "i" } },
        { customerId: { $in: customerIds } }
      ]
    };
  }
  
  // Gộp filter
  const finalFilter = { ...filter, ...searchFilter };
  
  // Lấy danh sách orders và tổng số
  const [orders, total] = await Promise.all([
    Order.find(finalFilter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("customerId", "fullName email phone")
      .populate("items.productId", "name price image"),
    Order.countDocuments(finalFilter)
  ]);
  
  // Tính tổng doanh thu
  const totalRevenue = orders.reduce((sum, order) => {
    if (order.orderStatus === "delivered" && order.paymentStatus === "paid") {
      return sum + order.totalPrice;
    }
    return sum;
  }, 0);
  
  // Tính tổng số đơn theo từng status
  const statusCount = await Order.aggregate([
    { $match: finalFilter },
    { $group: { _id: "$orderStatus", count: { $sum: 1 } } }
  ]);
  
  const totalPages = Math.ceil(total / limit);
  
  return {
    orders,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    },
    summary: {
      totalRevenue,
      statusCount: statusCount.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {})
    }
  };
};


/**
 * Cập nhật trạng thái đơn hàng (Admin)
 * @param {string} orderId - ID đơn hàng
 * @param {string} newStatus - Trạng thái mới
 */
const updateOrderStatus = async (orderId, newStatus) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Tìm order
    const order = await Order.findById(orderId).session(session);
    
    if (!order) {
      throw new Error("Không tìm thấy đơn hàng");
    }
    if (["delivered", "cancelled"].includes(order.orderStatus)) {
  throw new Error("Đơn hàng đã hoàn thành hoặc bị hủy");
}
    
    // 2. Kiểm tra trạng thái hiện tại
    const currentStatus = order.orderStatus;
    
    if (newStatus === "delivered" && order.paymentStatus !== "paid") {
  throw new Error("Đơn hàng phải được thanh toán trước khi giao ");
}
    // 3. Validate chuyển trạng thái hợp lệ
    const validTransitions = {
      pending: ["confirmed", "cancelled"],
      confirmed: ["shipping", "cancelled"],
      shipping: ["delivered"],
      delivered: [],
      cancelled: []
    };
    
    if (!validTransitions[currentStatus]?.includes(newStatus)) {
      throw new Error(`Cannot change status from ${currentStatus} to ${newStatus}`);
    }
    
    // 4. Cập nhật trạng thái và thời gian tương ứng
    order.orderStatus = newStatus;
    
    // Cập nhật thời gian tương ứng với status
    if (newStatus === "confirmed") {
      order.confirmedAt = new Date();
    } else if (newStatus === "shipping") {
      order.shippedAt = new Date();
    } else if (newStatus === "delivered") {
      order.deliveredAt = new Date();
    } else if (newStatus === "cancelled") {
      
      order.cancelledAt = new Date();

  if (order.paymentStatus === "paid") {
    order.paymentStatus = "refunded";
  }

  // tránh cộng stock 2 lần
  if (currentStatus !== "cancelled") {

   

    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: item.quantity } },
        { session }
      );
    }
  }
}
    
    await order.save({ session });
    
    // 5. Commit transaction
    await session.commitTransaction();
    session.endSession();
    
    // 6. Trả về order đã cập nhật
    const updatedOrder = await Order.findById(orderId)
      .populate("customerId", "fullName email phone")
      .populate("items.productId", "name price image");
    
    return updatedOrder;
    
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    session.endSession();
    throw error;
  }
};

/**
 * Cập nhật trạng thái thanh toán (Admin)
 * @param {string} orderId - ID đơn hàng
 * @param {string} paymentStatus - Trạng thái thanh toán mới (pending, paid, refunded)
 * @param {object} paymentDetails - Thông tin thanh toán (transactionId, bankCode, payDate)
 */
const updatePaymentStatus = async (orderId, paymentStatus, paymentDetails = {}) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Tìm order
    const order = await Order.findById(orderId).session(session);

    if (!order) {
      throw new Error("Không tìm thấy đơn hàng");
    }

    // ==================== KIỂM TRA ORDER STATUS ====================
    if (order.orderStatus === "cancelled") {
      throw new Error("Không thể hủy đơn hàng ở trạng thái");
    }

    if (order.orderStatus === "delivered") {
      throw new Error("Không thể cập nhật thanh toán cho đơn đã hoàn thành");
    }

    // ==================== KIỂM TRA TRẠNG THÁI THANH TOÁN ====================
    const currentStatus = order.paymentStatus;

    const validTransitions = {
      pending: ["paid"],     // ❌ không cho pending → refunded
      paid: ["refunded"],
      refunded: []
    };

    if (!validTransitions[currentStatus]?.includes(paymentStatus)) {
      throw new Error(`Không thể chuyển trạng thái thanh toán từ ${currentStatus} sang ${paymentStatus}`);
    }

    // ==================== VALIDATE INPUT ====================
    if (paymentStatus === "paid" && !paymentDetails.transactionId) {
      throw new Error("Cần mã giao dịch khi xác nhận đã thanh toán");
    }

    // ==================== UPDATE PAYMENT STATUS ====================
    order.paymentStatus = paymentStatus;

    // ==================== UPDATE PAYMENT DETAILS ====================
    if (paymentStatus === "paid") {
      order.paymentDetails = {
        transactionId: paymentDetails.transactionId,
        bankCode: paymentDetails.bankCode || null,
        payDate: paymentDetails.payDate || new Date()
      };
    }

    if (paymentStatus === "refunded") {
      order.paymentDetails = order.paymentDetails || {};
      order.paymentDetails.refundedAt = new Date();
    }

    await order.save({ session });

    // ==================== COMMIT ====================
    await session.commitTransaction();
    session.endSession();

    // ==================== RETURN ====================
    const updatedOrder = await Order.findById(orderId)
      .populate("customerId", "fullName email phone")
      .populate("items.productId", "name price image");

    return updatedOrder;

  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    session.endSession();
    throw error;
  }
};
/**
 * Lấy thống kê đơn hàng (Admin)
 * @param {string} startDate - Ngày bắt đầu (YYYY-MM-DD)
 * @param {string} endDate - Ngày kết thúc (YYYY-MM-DD)
 */
const getOrderStatistics = async (startDate = null, endDate = null) => {
  // ==================== FILTER DATE ====================
  const matchFilter = {};

  if (startDate || endDate) {
    matchFilter.createdAt = {};

    if (startDate) {
      matchFilter.createdAt.$gte = new Date(startDate);
    }

    if (endDate) {
      matchFilter.createdAt.$lte = new Date(endDate);
    }
  }

  // ==================== OVERVIEW ====================
  const overview = await Order.aggregate([
    { $match: matchFilter },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },

        totalRevenue: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ["$orderStatus", "delivered"] },
                  { $eq: ["$paymentStatus", "paid"] }
                ]
              },
              "$totalPrice",
              0
            ]
          }
        },

        paidOrders: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ["$orderStatus", "delivered"] },
                  { $eq: ["$paymentStatus", "paid"] }
                ]
              },
              1,
              0
            ]
          }
        },

        totalCustomers: { $addToSet: "$customerId" }
      }
    },
    {
      $project: {
        _id: 0,
        totalOrders: 1,
        totalRevenue: 1,
        totalCustomers: { $size: "$totalCustomers" },

        averageOrderValue: {
          $cond: [
            { $eq: ["$paidOrders", 0] },
            0,
            { $divide: ["$totalRevenue", "$paidOrders"] }
          ]
        }
      }
    }
  ]);

  // ==================== BY STATUS ====================
  const byStatus = await Order.aggregate([
    { $match: matchFilter },
    {
      $group: {
        _id: "$orderStatus",
        count: { $sum: 1 },
        revenue: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ["$orderStatus", "delivered"] },
                  { $eq: ["$paymentStatus", "paid"] }
                ]
              },
              "$totalPrice",
              0
            ]
          }
        }
      }
    },
    { $sort: { count: -1 } }
  ]);

  // ==================== DAILY REVENUE ====================
  const dailyRevenue = await Order.aggregate([
    { $match: matchFilter },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
        },
        orders: { $sum: 1 },
        revenue: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ["$orderStatus", "delivered"] },
                  { $eq: ["$paymentStatus", "paid"] }
                ]
              },
              "$totalPrice",
              0
            ]
          }
        }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // ==================== TOP PRODUCTS ====================
  const topProductsRaw = await Order.aggregate([
    {
      $match: {
        ...matchFilter,
        orderStatus: "delivered",
        paymentStatus: "paid"
      }
    },
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.productId",
        name: { $first: "$items.name" },
        totalSold: { $sum: "$items.quantity" },
        revenue: { $sum: "$items.subtotal" }
      }
    },
    { $sort: { totalSold: -1 } },
    { $limit: 10 }
  ]);

  // ==================== OPTIMIZE QUERY ====================
  const productIds = topProductsRaw.map(p => p._id);

  const products = await Product.find({ _id: { $in: productIds } })
    .select("name price image");

  const productMap = {};
  products.forEach(p => {
    productMap[p._id.toString()] = p;
  });

  const topProducts = topProductsRaw.map(item => ({
    productId: item._id,
    name: item.name,
    price: productMap[item._id]?.price || 0,
    image: productMap[item._id]?.image || "",
    totalSold: item.totalSold,
    revenue: item.revenue
  }));

  return {
    overview: overview[0] || {
      totalOrders: 0,
      totalRevenue: 0,
      totalCustomers: 0,
      averageOrderValue: 0
    },
    byStatus,
    dailyRevenue,
    topProducts
  };
};



module.exports = {
  createOrder,
  getMyOrders,
  getOrderDetail,
  cancelOrder,
  getAllOrders,
  updateOrderStatus ,
 updatePaymentStatus ,
 getOrderStatistics
};







