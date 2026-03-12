const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  requestFor: { type: String, enum: ['EquipMedy', 'Teachercool'], required: true, default: 'Teachercool' },
  role: { type: String, default: 'user' },
  status: { type: String, enum: ['pending', 'approved', 'blocked'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
