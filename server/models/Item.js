const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  images: [String],
  createdBy: String // Clerk User ID
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);
