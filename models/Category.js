const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  created_date: { type: Date, default: Date.now },
  updated_date: { type: Date, default: Date.now },
  author: { type: String },
  created_for: { type: String, enum: ['EquipMedy', 'TeacherCool','Chef'], required: true },
  is_deleted: { type: Boolean, default: false },
  is_approved: { type: Boolean, default: false },
});

module.exports = mongoose.model('Category', categorySchema);
