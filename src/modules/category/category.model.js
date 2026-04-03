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

// pre-save hook để tự động tạo slug và path
categorySchema.pre("save", async function () {
  if (this.isModified("name")) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, "-");
  }
});

module.exports = mongoose.model("Category", categorySchema);