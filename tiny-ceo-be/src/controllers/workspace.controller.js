const smartSQLService = require('../services/smartsql.service');
const smartMemoryService = require('../services/smartmemory.service');
const { SUCCESS_MESSAGES, ERROR_MESSAGES } = require('../config/constants');
const { AppError } = require('../middleware/errorHandler');
const { logger } = require('../utils/logger');

/**
 * Workspace Controller - Updated for Raindrop MCP
 * Handles workspace CRUD operations using SmartSQL
 */
const workspaceController = {
  /**
   * Get all workspaces for the authenticated user
   */
  getAll: async (req, res, next) => {
    try {
      const userId = req.user?.userId || req.userId;

      // Try to get from cache first
      const cacheKey = `workspaces_list:${userId}`;
      let workspaces = await smartMemoryService.get(cacheKey);

      if (!workspaces) {
        // Get from database
        const result = await smartSQLService.listWorkspaces(userId);
        workspaces = result.rows || [];

        // Cache for 5 minutes
        await smartMemoryService.set(cacheKey, workspaces, 300);
      }

      res.json({ workspaces });
    } catch (error) {
      logger.error('Failed to get workspaces', error);
      next(error);
    }
  },

  /**
   * Get a specific workspace by ID
   */
  getById: async (req, res, next) => {
    try {
      const workspaceId = parseInt(req.params.id);
      const userId = req.user?.userId || req.userId;

      // Try cache first
      const cachedWorkspace = await smartMemoryService.getWorkspaceCache(workspaceId);
      if (cachedWorkspace) {
        return res.json({ workspace: cachedWorkspace });
      }

      // Get from database
      const workspace = await smartSQLService.getWorkspace(workspaceId);

      if (!workspace) {
        throw new AppError(ERROR_MESSAGES.WORKSPACE_NOT_FOUND, 404);
      }

      // Verify ownership
      if (workspace.user_id !== userId) {
        throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, 403);
      }

      // Cache workspace
      await smartMemoryService.setWorkspaceCache(workspaceId, workspace);

      res.json({ workspace });
    } catch (error) {
      logger.error('Failed to get workspace', error);
      next(error);
    }
  },

  /**
   * Create a new workspace
   */
  create: async (req, res, next) => {
    try {
      const userId = req.user?.userId || req.userId;
      const { name, startupIdea, industry, targetAudience, title, startup_idea_text } = req.body;

      // Support both old and new API formats
      const workspaceData = {
        user_id: userId,
        name: name || title || 'Untitled Workspace',
        startup_idea: startupIdea || startup_idea_text || '',
        industry: industry || 'Not specified',
        target_audience: targetAudience || 'General audience',
        status: 'draft'
      };

      const result = await smartSQLService.createWorkspace(workspaceData);
      const workspace = result.rows?.[0] || result;

      logger.info('Workspace created', { workspaceId: workspace.id, userId });

      // Update user stats in memory
      await smartMemoryService.updateUserProfile(userId, {
        stats: {
          workspacesCreated: (await smartMemoryService.getUserProfile(userId))?.stats?.workspacesCreated + 1 || 1
        }
      });

      // Invalidate workspaces list cache
      await smartMemoryService.delete(`workspaces_list:${userId}`);

      res.status(201).json({
        message: SUCCESS_MESSAGES.WORKSPACE_CREATED,
        workspace
      });
    } catch (error) {
      logger.error('Failed to create workspace', error);
      next(error);
    }
  },

  /**
   * Update a workspace
   */
  update: async (req, res, next) => {
    try {
      const workspaceId = parseInt(req.params.id);
      const userId = req.user?.userId || req.userId;

      const workspace = await smartSQLService.getWorkspace(workspaceId);

      if (!workspace) {
        throw new AppError(ERROR_MESSAGES.WORKSPACE_NOT_FOUND, 404);
      }

      // Verify ownership
      if (workspace.user_id !== userId) {
        throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, 403);
      }

      const { name, startupIdea, industry, targetAudience, status, title, startup_idea_text } = req.body;

      const updates = {};
      if (name !== undefined || title !== undefined) updates.name = name || title;
      if (startupIdea !== undefined || startup_idea_text !== undefined)
        updates.startup_idea = startupIdea || startup_idea_text;
      if (industry !== undefined) updates.industry = industry;
      if (targetAudience !== undefined) updates.target_audience = targetAudience;
      if (status !== undefined) updates.status = status;

      const result = await smartSQLService.updateWorkspace(workspaceId, updates);
      const updatedWorkspace = result.rows?.[0] || { ...workspace, ...updates };

      logger.info('Workspace updated', { workspaceId });

      // Invalidate caches
      await smartMemoryService.invalidateWorkspaceCache(workspaceId);
      await smartMemoryService.delete(`workspaces_list:${userId}`);

      res.json({
        message: 'Workspace updated successfully',
        workspace: updatedWorkspace
      });
    } catch (error) {
      logger.error('Failed to update workspace', error);
      next(error);
    }
  },

  /**
   * Delete a workspace
   */
  delete: async (req, res, next) => {
    try {
      const workspaceId = parseInt(req.params.id);
      const userId = req.user?.userId || req.userId;

      const workspace = await smartSQLService.getWorkspace(workspaceId);

      if (!workspace) {
        throw new AppError(ERROR_MESSAGES.WORKSPACE_NOT_FOUND, 404);
      }

      // Verify ownership
      if (workspace.user_id !== userId) {
        throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, 403);
      }

      await smartSQLService.deleteWorkspace(workspaceId);

      logger.info('Workspace deleted', { workspaceId });

      // Invalidate caches
      await smartMemoryService.invalidateWorkspaceCache(workspaceId);
      await smartMemoryService.delete(`workspaces_list:${userId}`);

      res.json({
        message: 'Workspace deleted successfully'
      });
    } catch (error) {
      logger.error('Failed to delete workspace', error);
      next(error);
    }
  }
};

module.exports = workspaceController;
