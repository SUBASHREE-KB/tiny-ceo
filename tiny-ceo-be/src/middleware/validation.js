const { ERROR_MESSAGES, AGENT_TYPES } = require('../config/constants');
const { AppError } = require('./errorHandler');

// Validation utilities
const validators = {
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  password: (password) => {
    // At least 6 characters
    return password && password.length >= 6;
  },

  required: (value) => {
    return value !== undefined && value !== null && value !== '';
  },

  isPositiveInteger: (value) => {
    return Number.isInteger(value) && value > 0;
  },

  isValidAgentType: (agentType) => {
    return AGENT_TYPES.includes(agentType);
  }
};

// Validation middleware factories
const validate = {
  // Auth validation
  register: (req, res, next) => {
    const { email, password } = req.body;

    if (!validators.required(email)) {
      throw new AppError(ERROR_MESSAGES.REQUIRED_FIELD('Email'), 400);
    }

    if (!validators.email(email)) {
      throw new AppError('Invalid email format', 400);
    }

    if (!validators.required(password)) {
      throw new AppError(ERROR_MESSAGES.REQUIRED_FIELD('Password'), 400);
    }

    if (!validators.password(password)) {
      throw new AppError('Password must be at least 6 characters', 400);
    }

    next();
  },

  login: (req, res, next) => {
    const { email, password } = req.body;

    if (!validators.required(email) || !validators.required(password)) {
      throw new AppError('Email and password are required', 400);
    }

    next();
  },

  // Workspace validation
  createWorkspace: (req, res, next) => {
    const { title } = req.body;

    if (!validators.required(title)) {
      throw new AppError(ERROR_MESSAGES.REQUIRED_FIELD('Title'), 400);
    }

    if (title.length > 200) {
      throw new AppError('Title must be less than 200 characters', 400);
    }

    next();
  },

  // Conversation validation
  sendMessage: (req, res, next) => {
    const { message } = req.body;

    if (!validators.required(message)) {
      throw new AppError(ERROR_MESSAGES.MESSAGE_REQUIRED, 400);
    }

    if (message.length > 5000) {
      throw new AppError('Message must be less than 5000 characters', 400);
    }

    next();
  },

  // Agent validation
  agentType: (req, res, next) => {
    const { agentType } = req.params;

    if (!validators.isValidAgentType(agentType)) {
      throw new AppError(ERROR_MESSAGES.INVALID_AGENT_TYPE, 400);
    }

    next();
  },

  // Agent chat validation
  agentChat: (req, res, next) => {
    const { message } = req.body;
    const { agentType } = req.params;

    if (!validators.isValidAgentType(agentType)) {
      throw new AppError(ERROR_MESSAGES.INVALID_AGENT_TYPE, 400);
    }

    if (!validators.required(message)) {
      throw new AppError(ERROR_MESSAGES.MESSAGE_REQUIRED, 400);
    }

    if (message.length > 2000) {
      throw new AppError('Message must be less than 2000 characters', 400);
    }

    next();
  }
};

module.exports = {
  validators,
  validate
};
