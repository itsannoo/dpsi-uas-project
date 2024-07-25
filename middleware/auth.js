const jwt = require('jsonwebtoken');
const secretKey = 'your_jwt_secret'; 

// Middleware untuk autentikasi menggunakan JWT
const authenticate = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'Token tidak tersedia' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded.user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token tidak valid' });
  }
};

// Middleware untuk otorisasi role
const authorize = (roles) => {
  return (req, res, next) => {
    if (roles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).json({ message: 'Akses ditolak' });
    }
  };
};

module.exports = { authenticate, authorize };
