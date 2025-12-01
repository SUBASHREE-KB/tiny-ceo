const express = require('express');
const conversationController = require('../controllers/conversation.controller');
const { authMiddleware } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// GET /workspaces/:workspaceId/conversations
router.get('/:workspaceId/conversations', asyncHandler(conversationController.getMessages));

// POST /workspaces/:workspaceId/conversations/message
router.post(
  '/:workspaceId/conversations/message',
  validate.sendMessage,
  asyncHandler(conversationController.sendMessage)
);

module.exports = router;
