const jwt = require('jsonwebtoken');
const { getDb } = require('../models/index');
const { ObjectId } = require('mongodb');

const authenticate = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    const db = getDb();
    const user = await db.collection('users').findOne({ _id: new ObjectId(decoded.id) });
    if (!user) {
      throw new Error();
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

const authorize = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied. You do not have permission to perform this action.' });
  }
  next();
};

module.exports = {
  authenticate,
  authorize
};
