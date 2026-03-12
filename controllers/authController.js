const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
  const { username, password, email, requestFor } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashed, email, requestFor });
    await user.save();
    res.status(201).json({ message: 'Registered successfully, wait for admin approval' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { emailorUsername, password } = req.body;
  try {
    let user;
    if (emailorUsername.includes('@')) {
      user = await User.findOne({ email: emailorUsername });
    } else {
      user = await User.findOne({ username: emailorUsername });
    }
    if (!user) return res.status(400).json({ error: 'User not found' });
    if (user.status !== 'approved') return res.status(403).json({ error: 'Not approved' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Incorrect password' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '4h' });
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    const userObj = user.toObject();
    const { password: pwd, __v, ...userWithoutSensitive } = userObj;
    res.json({ token, refreshToken, user: userWithoutSensitive });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUsers = async (req, res) => {
  const users = await User.find({ role: { $ne: 'admin' } }).select('-password');
  res.json(users);
};

exports.updateUserStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  await User.findByIdAndUpdate(id, { status });
  res.json({ message: 'User status updated' });
};
