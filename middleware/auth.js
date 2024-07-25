const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.header('x-auth-token');
  console.log(`Token received: ${token}`);
  if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
      const decoded = jwt.verify(token, 'your_jwt_secret');
      console.log('Token decoded:', decoded);
      req.user = decoded.user;
      next();
  } catch (err) {
      console.log('Token verification failed:', err.message);
      res.status(401).json({ message: 'Token is not valid' });
  }
};

const authorize = (roles) => {
  return (req, res, next) => {
      console.log(`User role: ${req.user.role}`);
      if (!roles.includes(req.user.role)) {
          console.log('User role not authorized');
          return res.status(403).json({ message: 'Forbidden' });
      }
      next();
  };
};

module.exports = { authenticate, authorize };
