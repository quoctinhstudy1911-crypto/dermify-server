const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema(
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

    position: {
      type: String,
      enum: ["staff", "manager"],
      default: "staff"
    },

    isActive: {
      type: Boolean,
      default: true
    },

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
staffSchema.set("toJSON", {
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  }
});

module.exports = mongoose.model("Staff", staffSchema);