const express = require('express');
const cors = require('cors');
const { APP_CONFIG } = require('./config/constants');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { logger } = require('./utils/logger');

// Import routes
const authRoutes = require('./routes/auth.routes');
const workspaceRoutes = require('./routes/workspace.routes');
const conversationRoutes = require('./routes/conversation.routes');
const agentRoutes = require('./routes/agent.routes');
const agentChatRoutes = require('./routes/agentChat.routes');

// Create Express app
const app = express();

// Middleware
app.use(cors({
  origin: APP_CONFIG.corsOrigins,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.path}`, {
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip
    });
  });
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: APP_CONFIG.version,
    environment: APP_CONFIG.environment
  });
});

// API Routes
app.use('/auth', authRoutes);
app.use('/workspaces', workspaceRoutes);
app.use('/workspaces', conversationRoutes);
app.use('/workspaces', agentRoutes);
app.use('/workspaces', agentChatRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;
