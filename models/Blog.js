const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String },
  imageUrl: { type: String },
  metaTitle: { type: String },
  metaDescription: { type: String },
  metaKeywords: { type: String },
  content: { type: String, required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  subcategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  type: { type: String },
  is_deleted: { type: Boolean, default: false },
  is_approved: { type: Boolean, default: false },
});

module.exports = mongoose.model('Blog', blogSchema);

