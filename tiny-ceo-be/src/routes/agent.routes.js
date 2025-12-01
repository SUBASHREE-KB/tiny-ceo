const express = require('express');
const agentController = require('../controllers/agent.controller');
const { authMiddleware } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// POST /workspaces/:workspaceId/agents/generate
router.post('/:workspaceId/agents/generate', asyncHandler(agentController.generateAll));

// GET /workspaces/:workspaceId/agents
router.get('/:workspaceId/agents', asyncHandler(agentController.getOutputs));

// POST /workspaces/:workspaceId/agents/:agentType/regenerate
router.post(
  '/:workspaceId/agents/:agentType/regenerate',
  validate.agentType,
  asyncHandler(agentController.regenerate)
);

module.exports = router;
