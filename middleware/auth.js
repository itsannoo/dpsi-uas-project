const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, 'your_jwt_secret');
        req.user = decoded.user;
        next();
    } catch (err) {
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
