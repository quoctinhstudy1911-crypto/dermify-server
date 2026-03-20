const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
    unique: true
  },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },

        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1
        }
      }
    ]
  },
  { timestamps: true }
);

/**
 * CLEAN JSON
 */
cartSchema.set("toJSON", {
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  }
});

module.exports = mongoose.model("Cart", cartSchema);