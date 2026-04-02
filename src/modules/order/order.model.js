const mongoose = require("mongoose");


const orderSchema = new mongoose.Schema(
  {
    // ==================== MÃ ĐƠN HÀNG ====================
    orderCode: {
      type: String,
      unique: true,
      required: true,
      index: true,
      description: "Mã đơn hàng hiển thị cho khách (VD: DH202401010001)"
    },

    // ==================== THÔNG TIN KHÁCH HÀNG ====================
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true,
      description: "ID khách hàng (liên kết với collection customers)"
    },

    // ==================== DANH SÁCH SẢN PHẨM ====================
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
          description: "ID sản phẩm"
        },
        name: {
          type: String,
          required: true,
          description: "Tên sản phẩm (snapshot tại thời điểm mua)"
        },
        image: {
          type: String,
          default: "",
          description: "Ảnh sản phẩm (snapshot)"
        },
        price: {
          type: Number,
          required: true,
          min: 0,
          description: "Giá tại thời điểm mua"
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
          description: "Số lượng mua"
        },
        subtotal: {
          type: Number,
          required: true,
          min: 0,
          description: "Thành tiền = price * quantity"
        }
      }
    ],

    // ==================== THÔNG TIN TIỀN ====================
    subtotal: {
      type: Number,
      required: true,
      min: 0,
      description: "Tổng tiền sản phẩm (chưa gồm giảm giá, phí ship)"
    },

    discountAmount: {
      type: Number,
      default: 0,
      min: 0,
      description: "Số tiền được giảm (từ coupon hoặc chương trình)"
    },

    shippingFee: {
      type: Number,
      default: 0,
      min: 0,
      description: "Phí vận chuyển"
    },

    totalPrice: {
      type: Number,
      required: true,
      min: 0,
      description: "Tổng thanh toán = subtotal - discountAmount + shippingFee"
    },

    // ==================== THÔNG TIN GIAO HÀNG ====================
    shippingAddress: {
      fullName: {
        type: String,
        required: true,
        trim: true,
        description: "Họ tên người nhận"
      },
      phone: {
        type: String,
        required: true,
        description: "Số điện thoại người nhận"
      },
      email: {
        type: String,
        trim: true,
        lowercase: true,
        description: "Email người nhận (gửi hóa đơn)"
      },
      province: {
        type: String,
        required: true,
        description: "Tỉnh/Thành phố"
      },
      district: {
        type: String,
        required: true,
        description: "Quận/Huyện"
      },
      ward: {
        type: String,
        description: "Phường/Xã"
      },
      street: {
        type: String,
        required: true,
        description: "Địa chỉ cụ thể (số nhà, đường)"
      },
      note: {
        type: String,
        default: "",
        description: "Ghi chú giao hàng (VD: gọi trước khi giao)"
      }
    },

    // ==================== THANH TOÁN ====================
    paymentMethod: {
      type: String,
      enum: ["cod", "vnpay", "momo", "banking"],
      required: true,
      description: "Phương thức thanh toán: cod (tiền mặt), vnpay, momo, banking"
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded"],
      default: "pending",
      description: "Trạng thái thanh toán: pending (chưa thanh toán), paid (đã thanh toán), refunded (đã hoàn tiền)"
    },

    paymentDetails: {
      transactionId: {
        type: String,
        description: "Mã giao dịch từ cổng thanh toán (VNPay, Momo)"
      },
      bankCode: {
        type: String,
        description: "Mã ngân hàng (nếu thanh toán qua VNPay)"
      },
      payDate: {
        type: Date,
        description: "Thời gian thanh toán thành công"
      }
    },

    // ==================== TRẠNG THÁI ĐƠN HÀNG ====================
    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "shipping", "delivered", "cancelled"],
      default: "pending",
      description: "Trạng thái đơn hàng: pending (chờ xác nhận), confirmed (đã xác nhận), shipping (đang giao), delivered (đã giao), cancelled (đã hủy)"
    },

    // ==================== MÃ GIẢM GIÁ ====================
    couponId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      default: null,
      description: "ID mã giảm giá đã áp dụng (nếu có)"
    },

    // ==================== GHI CHÚ ====================
    note: {
      type: String,
      default: "",
      maxlength: 500,
      description: "Ghi chú của khách hàng về đơn hàng"
    },

    // ==================== THỜI GIAN QUAN TRỌNG ====================
    cancelledAt: {
      type: Date,
      default: null,
      description: "Thời gian hủy đơn (nếu có)"
    },

    confirmedAt: {
      type: Date,
      default: null,
      description: "Thời gian xác nhận đơn"
    },

    shippedAt: {
      type: Date,
      default: null,
      description: "Thời gian giao hàng"
    },

    deliveredAt: {
      type: Date,
      default: null,
      description: "Thời gian giao thành công"
    }
  },
  {
    timestamps: true, // Tự động thêm createdAt, updatedAt
    description: "Collection lưu thông tin đơn hàng"
  }
);

// ==================== INDEXES ====================
// Index cho customer (lấy lịch sử đơn hàng)
orderSchema.index({ customerId: 1, createdAt: -1 });

// Index cho orderCode (tìm theo mã đơn)
//orderSchema.index({ orderCode: 1 });

// Index cho orderStatus (admin filter)
orderSchema.index({ orderStatus: 1, createdAt: -1 });

// Index cho paymentStatus (theo dõi thanh toán)
orderSchema.index({ paymentStatus: 1 });

// Index cho thời gian (thống kê)
orderSchema.index({ createdAt: -1 });

// ==================== VIRTUAL FIELDS ====================
// Tính số lượng sản phẩm trong đơn
orderSchema.virtual("totalItems").get(function () {
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

// Kiểm tra đơn có thể hủy không
orderSchema.virtual("canCancel").get(function () {
  return ["pending", "confirmed"].includes(this.orderStatus);
});

// Kiểm tra đơn có thể cập nhật không
orderSchema.virtual("canUpdate").get(function () {
  return this.orderStatus !== "delivered" && this.orderStatus !== "cancelled";
});

// ==================== METHODS ====================
// Phương thức: Hủy đơn hàng
orderSchema.methods.cancel = async function (reason = "") {
  if (!["pending", "confirmed"].includes(this.orderStatus)) {
    throw new Error("Cannot cancel order at current status");
  }
  
  this.orderStatus = "cancelled";
  this.cancelledAt = new Date();
  if (reason) this.note = reason;
  
  return this.save();
};

// Phương thức: Xác nhận đơn hàng
orderSchema.methods.confirm = async function () {
  if (this.orderStatus !== "pending") {
    throw new Error("Only pending orders can be confirmed");
  }
  
  this.orderStatus = "confirmed";
  this.confirmedAt = new Date();
  
  return this.save();
};

// Phương thức: Cập nhật trạng thái giao hàng
orderSchema.methods.updateShippingStatus = async function (status) {
  const validStatuses = ["shipping", "delivered"];
  if (!validStatuses.includes(status)) {
    throw new Error("Invalid shipping status");
  }
  
  if (this.orderStatus !== "confirmed" && this.orderStatus !== "shipping") {
    throw new Error("Cannot update shipping status");
  }
  
  this.orderStatus = status;
  
  if (status === "shipping") this.shippedAt = new Date();
  if (status === "delivered") this.deliveredAt = new Date();
  
  return this.save();
};

// ==================== STATICS ====================
// Tìm đơn hàng theo customer
orderSchema.statics.findByCustomer = function (customerId, page = 1, limit = 10) {
  return this.find({ customerId })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("items.productId");
};

// Thống kê đơn hàng theo status
orderSchema.statics.getStatistics = function () {
  return this.aggregate([
    {
      $group: {
        _id: "$orderStatus",
        count: { $sum: 1 },
        totalRevenue: { $sum: "$totalPrice" }
      }
    }
  ]);
};

// ==================== CLEAN JSON ====================
orderSchema.set("toJSON", {
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    
    // Thêm virtual fields vào JSON
    ret.totalItems = doc.totalItems;
    ret.canCancel = doc.canCancel;
    ret.canUpdate = doc.canUpdate;
    
    return ret;
  }
});

orderSchema.set("toObject", {
  virtuals: true
});

module.exports = mongoose.model("Order", orderSchema);