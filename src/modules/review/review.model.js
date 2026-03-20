const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({

  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
    index: true
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true
  },

  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },

 comment: { type: String, trim: true },

  images: { type: [String], default: [] },

  isEdited: { type: Boolean, default: false },

  status: {
    type: String,
    enum: ["active", "hidden"],
    default: "active"
  }

}, { timestamps: true });

reviewSchema.index({ userId: 1, productId: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);