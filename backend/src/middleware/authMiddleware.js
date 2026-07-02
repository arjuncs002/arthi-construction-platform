const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'arthiconstructions_secret_key_2026_jensonsolutions';

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);

      // Get user from the database
      req.user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          phone: true,
          avatar: true,
          clientProfile: true,
          supervisorProfile: true
        }
      });

      if (!req.user) {
        return res.status(401).json({ error: true, message: 'Not authorized, user not found' });
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ error: true, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ error: true, message: 'Not authorized, no token' });
  }
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        error: true,
        message: `Role ${req.user ? req.user.role : 'Guest'} is not authorized to access this resource`
      });
    }
    next();
  };
};

module.exports = {
  protect,
  restrictTo
};
