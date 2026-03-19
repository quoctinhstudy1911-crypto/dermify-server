const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

name: { type: String, required: true },

slug: { type: String, unique: true },


price: { type: Number, required: true },

originalPrice: Number,


brand: { type: String, index: true },


description: String,

images: [{ type: String }],


categoryId: {

type: mongoose.Schema.Types.ObjectId,

ref: "Category",

index: true

},


stock: { type: Number, default: 0 },

soldCount: { type: Number, default: 0 },


ratingAvg: { type: Number, default: 0 },

reviewCount: { type: Number, default: 0 },


tags: [{ type: String }],


status: {

type: String,

enum: ["active", "hidden", "draft"],

default: "active"

},


isDeleted: { type: Boolean, default: false }


}, { timestamps: true });


productSchema.index({ name: "text", brand: "text" });


productSchema.pre("save", function(next) {

this.slug = this.name.toLowerCase().replace(/\s+/g, "-");

next();

});

// FILTER + PRICE

productSchema.index({ categoryId: 1, price: 1 });


// FILTER + SORT RATING

productSchema.index({ categoryId: 1, ratingAvg: -1 });


// BRAND FILTER

productSchema.index({ brand: 1, price: 1 });


// SOFT DELETE + STATUS

productSchema.index({ isDeleted: 1, status: 1 });