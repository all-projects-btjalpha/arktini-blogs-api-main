const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.verifyAdmin = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: 'No token provided' });
    const decoded = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    req.user = user;
    if (!user || user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

exports.verifyToken = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: 'No token provided' });
    const decoded = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) return res.status(401).json({ error: 'Invalid user' });
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
