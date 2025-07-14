const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ["lost", "found"],
    required: true,
  },
  location: { type: String, required: true },
  date: { type: Date, default: Date.now },
  title: { type: String, required: true },
  description: { type: String },
  category: {
    type: String,
    enum: ["electronics", "clothing", "documents", "other"],
    required: true,
  },
  imageUrl: { type: String },
  email: { type: String, required: true },
  phone: { type: String },
  detailsPrivate: { type: Boolean, default: false },
});

module.exports = mongoose.model("Item", itemSchema);