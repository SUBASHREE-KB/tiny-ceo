const { ERROR_MESSAGES } = require('../config/constants');

// Custom error class
class AppError extends Error {
  constructor(message, statusCode = 500, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    statusCode: err.statusCode,
    path: req.path,
    method: req.method
  });

  // Operational errors (known errors we can handle)
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      error: err.message,
      details: err.details
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: ERROR_MESSAGES.INVALID_TOKEN });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: ERROR_MESSAGES.INVALID_TOKEN });
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: ERROR_MESSAGES.VALIDATION_ERROR,
      details: err.message
    });
  }

  // Default to 500 server error
  res.status(500).json({
    error: ERROR_MESSAGES.INTERNAL_ERROR,
    ...(process.env.NODE_ENV === 'development' && { details: err.message })
  });
};

// Not found handler
const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
    method: req.method
  });
};

// Async handler wrapper to catch async errors
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
  AppError,
  errorHandler,
  notFoundHandler,
  asyncHandler
};
