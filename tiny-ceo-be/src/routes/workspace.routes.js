const express = require('express');
const workspaceController = require('../controllers/workspace.controller');
const { authMiddleware } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// GET /workspaces
router.get('/', asyncHandler(workspaceController.getAll));

// GET /workspaces/:id
router.get('/:id', asyncHandler(workspaceController.getById));

// POST /workspaces
router.post('/', validate.createWorkspace, asyncHandler(workspaceController.create));

// PUT /workspaces/:id
router.put('/:id', asyncHandler(workspaceController.update));

module.exports = router;
