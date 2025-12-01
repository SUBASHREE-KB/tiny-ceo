const express = require('express');
const agentChatController = require('../controllers/agentChat.controller');
const { authMiddleware } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// POST /workspaces/:workspaceId/agents/:agentType/chat
router.post(
  '/:workspaceId/agents/:agentType/chat',
  validate.agentChat,
  asyncHandler(agentChatController.chat)
);

// GET /workspaces/:workspaceId/agents/:agentType/chat
router.get(
  '/:workspaceId/agents/:agentType/chat',
  validate.agentType,
  asyncHandler(agentChatController.getHistory)
);

module.exports = router;
