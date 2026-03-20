const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email"]
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false
    },

    role: {
      type: String,
      enum: ["customer", "staff", "admin","super_admin"],
      default: "customer"
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    },

    lastLogin: Date,

    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

/**
 * CLEAN JSON
 */
accountSchema.set("toJSON", {
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.password;
  }
});

module.exports = mongoose.model("Account", accountSchema);