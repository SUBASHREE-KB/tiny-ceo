const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { hashPassword, verifyPassword } = require('../utils/helpers');
const { APP_CONFIG, SUCCESS_MESSAGES, ERROR_MESSAGES } = require('../config/constants');
const { AppError } = require('../middleware/errorHandler');
const { logger } = require('../utils/logger');

/**
 * Auth Controller
 * Handles user registration and authentication
 */
const authController = {
  /**
   * Register a new user
   */
  register: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      // Check if user exists
      const existingUser = db.findUserByEmail(email);
      if (existingUser) {
        throw new AppError(ERROR_MESSAGES.USER_EXISTS, 400);
      }

      // Create user
      const user = db.createUser({
        email,
        password_hash: hashPassword(password)
      });

      // Generate token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        APP_CONFIG.jwtSecret,
        { expiresIn: APP_CONFIG.jwtExpiry }
      );

      logger.info('User registered', { email, userId: user.id });

      res.status(201).json({
        message: SUCCESS_MESSAGES.USER_REGISTERED,
        token,
        user: {
          id: user.id,
          email: user.email,
          created_at: user.created_at
        }
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Login user
   */
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      // Find user
      const user = db.findUserByEmail(email);
      if (!user) {
        throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, 401);
      }

      // Verify password
      if (!verifyPassword(password, user.password_hash)) {
        throw new AppError(ERROR_MESSAGES.INVALID_CREDENTIALS, 401);
      }

      // Generate token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        APP_CONFIG.jwtSecret,
        { expiresIn: APP_CONFIG.jwtExpiry }
      );

      logger.info('User logged in', { email, userId: user.id });

      res.json({
        message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
        token,
        user: {
          id: user.id,
          email: user.email,
          created_at: user.created_at
        }
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = authController;
