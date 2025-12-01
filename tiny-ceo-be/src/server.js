// Load environment variables
require('dotenv').config();

const app = require('./app');
const { APP_CONFIG } = require('./config/constants');
const { logger } = require('./utils/logger');

const PORT = APP_CONFIG.port;

// Start server
const server = app.listen(PORT, () => {
  logger.success('Tiny CEO Backend Server Running!');
  logger.info(`Environment: ${APP_CONFIG.environment}`);
  logger.info(`API: http://localhost:${PORT}`);
  logger.info(`Health Check: http://localhost:${PORT}/health`);
  logger.info(`Frontend should connect to: http://localhost:${PORT}`);
  console.log(''); // Empty line for readability
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', { reason, promise });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', error);
  process.exit(1);
});

module.exports = server;
