const db = require('../config/database');
const { SUCCESS_MESSAGES, ERROR_MESSAGES } = require('../config/constants');
const { AppError } = require('../middleware/errorHandler');
const { logger } = require('../utils/logger');

/**
 * Workspace Controller
 * Handles workspace CRUD operations
 */
const workspaceController = {
  /**
   * Get all workspaces for the authenticated user
   */
  getAll: async (req, res, next) => {
    try {
      const workspaces = db.findWorkspacesByUserId(req.userId);

      res.json({ workspaces });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get a specific workspace by ID
   */
  getById: async (req, res, next) => {
    try {
      const workspace = db.findWorkspaceById(req.params.id);

      if (!workspace) {
        throw new AppError(ERROR_MESSAGES.WORKSPACE_NOT_FOUND, 404);
      }

      // Verify ownership
      if (workspace.user_id !== req.userId) {
        throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, 403);
      }

      res.json({ workspace });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Create a new workspace
   */
  create: async (req, res, next) => {
    try {
      const { title, startup_idea_text } = req.body;

      const workspace = db.createWorkspace({
        user_id: req.userId,
        title,
        startup_idea_text: startup_idea_text || ''
      });

      logger.info('Workspace created', { workspaceId: workspace.id, userId: req.userId });

      res.status(201).json({
        message: SUCCESS_MESSAGES.WORKSPACE_CREATED,
        workspace
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update a workspace
   */
  update: async (req, res, next) => {
    try {
      const workspace = db.findWorkspaceById(req.params.id);

      if (!workspace) {
        throw new AppError(ERROR_MESSAGES.WORKSPACE_NOT_FOUND, 404);
      }

      // Verify ownership
      if (workspace.user_id !== req.userId) {
        throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, 403);
      }

      const { title, startup_idea_text } = req.body;
      const updates = {};
      if (title !== undefined) updates.title = title;
      if (startup_idea_text !== undefined) updates.startup_idea_text = startup_idea_text;

      const updatedWorkspace = db.updateWorkspace(req.params.id, updates);

      logger.info('Workspace updated', { workspaceId: updatedWorkspace.id });

      res.json({
        message: 'Workspace updated successfully',
        workspace: updatedWorkspace
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = workspaceController;
