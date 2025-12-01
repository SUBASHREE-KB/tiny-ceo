const jwt = require('jsonwebtoken');
const { APP_CONFIG, ERROR_MESSAGES } = require('../config/constants');

// Authentication middleware
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: ERROR_MESSAGES.UNAUTHORIZED });
  }

  const token = authHeader.substring(7);

  try {
    const payload = jwt.verify(token, APP_CONFIG.jwtSecret);
    req.userId = payload.userId;
    req.userEmail = payload.email;
    next();
  } catch (error) {
    return res.status(401).json({ error: ERROR_MESSAGES.INVALID_TOKEN });
  }
};

// Optional auth middleware (doesn't fail if no token)
const optionalAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    try {
      const payload = jwt.verify(token, APP_CONFIG.jwtSecret);
      req.userId = payload.userId;
      req.userEmail = payload.email;
    } catch (error) {
      // Silently fail for optional auth
    }
  }

  next();
};

module.exports = {
  authMiddleware,
  optionalAuthMiddleware
};
