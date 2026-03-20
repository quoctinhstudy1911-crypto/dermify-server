const mongoose = require("mongoose");

/**
 * ADDRESS SUB-SCHEMA
 */
const addressSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true
    },

    phone: {
      type: String,
      required: true,
      match: [/^[0-9]{9,11}$/, "Invalid phone"]
    },

    street: { type: String, required: true },
    ward: { type: String, required: true },
    district: { type: String, required: true },
    city: { type: String, required: true },

    isDefault: {
      type: Boolean,
      default: false
    }
  },
  { _id: true } // mỗi address có _id riêng (quan trọng để update/xóa)
);

/**
 * CUSTOMER SCHEMA
 */
const customerSchema = new mongoose.Schema(
  {
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
      unique: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    phone: {
      type: String,
      required: true,
      match: [/^[0-9]{9,11}$/, "Invalid phone"]
    },

    avatar: {
      type: String,
      default: null
    },

    addresses: {
      type: [addressSchema],
      default: []
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: null
    },

    dateOfBirth: {
      type: Date,
      default: null
    },

    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);


/**
 * HELPER 
 * chỉ hỗ trợ set default trong memory
 */
customerSchema.methods.setDefaultAddress = function (addressId) {
  this.addresses.forEach((addr) => {
    addr.isDefault = addr._id.toString() === addressId.toString();
  });
};

/**
 * CLEAN JSON
 */
customerSchema.set("toJSON", {
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  }
});

module.exports = mongoose.model("Customer", customerSchema);