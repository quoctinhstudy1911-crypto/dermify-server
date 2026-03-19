const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true
    },

    items: [
      {
        productId: mongoose.Schema.Types.ObjectId,

        name: {
          type: String,
          required: true
        },

        image: String,

        price: {
          type: Number,
          required: true
        },

        quantity: {
          type: Number,
          required: true,
          min: 1
        },

        subtotal: {
          type: Number,
          required: true
        }
      }
    ],

    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      province: String,
      district: String,
      ward: String,
      street: String
    },

    paymentMethod: {
      type: String,
      enum: ["cod", "vnpay"],
      required: true
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending"
    },

    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "shipping", "delivered", "cancelled"],
      default: "pending"
    },

    couponId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon"
    },

    discountAmount: {
      type: Number,
      default: 0
    },

    totalPrice: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

/**
 * INDEX
 */
orderSchema.index({ userId: 1 });
orderSchema.index({ orderStatus: 1 });

// USER ORDER HISTORY
orderSchema.index({ userId: 1, createdAt: -1 });

// ADMIN FILTER ORDER
orderSchema.index({ orderStatus: 1, createdAt: -1 });

/**
 * CLEAN JSON
 */
orderSchema.set("toJSON", {
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  }
});

module.exports = mongoose.model("Order", orderSchema);