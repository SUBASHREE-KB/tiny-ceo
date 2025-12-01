// Simple logging utility
// In production, replace with Winston, Pino, or similar

const { APP_CONFIG } = require('../config/constants');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

class Logger {
  constructor(context = 'App') {
    this.context = context;
    this.isDevelopment = APP_CONFIG.environment === 'development';
  }

  formatMessage(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const contextStr = `[${this.context}]`;
    const dataStr = data ? `\n${JSON.stringify(data, null, 2)}` : '';

    return `${timestamp} ${level} ${contextStr} ${message}${dataStr}`;
  }

  info(message, data = null) {
    const formatted = this.formatMessage('INFO', message, data);
    console.log(`${colors.blue}${formatted}${colors.reset}`);
  }

  success(message, data = null) {
    const formatted = this.formatMessage('SUCCESS', message, data);
    console.log(`${colors.green}${formatted}${colors.reset}`);
  }

  warn(message, data = null) {
    const formatted = this.formatMessage('WARN', message, data);
    console.warn(`${colors.yellow}${formatted}${colors.reset}`);
  }

  error(message, error = null) {
    const data = error ? {
      message: error.message,
      stack: this.isDevelopment ? error.stack : undefined
    } : null;

    const formatted = this.formatMessage('ERROR', message, data);
    console.error(`${colors.red}${formatted}${colors.reset}`);
  }

  debug(message, data = null) {
    if (this.isDevelopment) {
      const formatted = this.formatMessage('DEBUG', message, data);
      console.log(`${colors.magenta}${formatted}${colors.reset}`);
    }
  }

  agent(agentType, message, data = null) {
    const formatted = this.formatMessage(`AGENT:${agentType.toUpperCase()}`, message, data);
    console.log(`${colors.cyan}${formatted}${colors.reset}`);
  }
}

// Create default logger
const logger = new Logger('TinyCEO');

// Factory for creating context-specific loggers
const createLogger = (context) => new Logger(context);

module.exports = {
  logger,
  createLogger
};
