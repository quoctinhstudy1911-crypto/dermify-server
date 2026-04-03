const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false
    },

    role: {
      type: String,
      enum: ["customer", "staff", "admin","super_admin"],
      default: "customer"
    },

    refreshToken: {
        type: String,
        default: null
    },

    isDeleted: {
        type: Boolean,
        default: false
    },

    status: {
      type: String,
      enum: ["pending","active", "inactive"],
      default: "pending"
    },

    lastLogin: Date,

  },
  { timestamps: true }
);

  // Ẩn trường _id, __v và password khi trả về JSON
  accountSchema.set("toJSON", {
    versionKey: false,
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.password;
    }
  });

module.exports = mongoose.model("Account", accountSchema);