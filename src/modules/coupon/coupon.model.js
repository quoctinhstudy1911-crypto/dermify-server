const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },

    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true
    },

    discountValue: {
      type: Number,
      required: true,
      min: 0
    },

    minOrderValue: {
      type: Number,
      default: 0
    },

    maxDiscount: Number,

    usageLimit: {
      type: Number,
      default: 1
    },

    usedCount: {
      type: Number,
      default: 0
    },

    startDate: Date,
    endDate: Date,

    status: {
      type: String,
      enum: ["active", "expired"],
      default: "active"
    }
  },
  { timestamps: true }
);

/**
 * INDEX
 */
couponSchema.index({ code: 1 }, { unique: true });

/**
 * CLEAN JSON
 */
couponSchema.set("toJSON", {
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  }
});

module.exports = mongoose.model("Coupon", couponSchema);