const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  created_date: { type: Date, default: Date.now },
  updated_date: { type: Date, default: Date.now },
  author: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  is_deleted: { type: Boolean, default: false },
  is_approved: { type: Boolean, default: false },
});

module.exports = mongoose.model('Subcategory', subcategorySchema);
