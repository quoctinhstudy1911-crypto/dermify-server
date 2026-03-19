const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },

  slug: { type: String, unique: true },

  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    default: null
  },

  path: { type: String, index: true },

  level: { type: Number, default: 0 },

  status: {
    type: String,
    enum: ["active", "hidden"],
    default: "active"
  },

  isDeleted: { type: Boolean, default: false }

}, { timestamps: true });

categorySchema.pre("save", function(next) {
  this.slug = this.name.toLowerCase().replace(/\s+/g, "-");
  next();
});

module.exports = mongoose.model("Category", categorySchema);