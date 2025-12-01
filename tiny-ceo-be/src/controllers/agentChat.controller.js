const db = require('../config/database');
const orchestratorService = require('../services/orchestrator.service');
const { ERROR_MESSAGES } = require('../config/constants');
const { AppError } = require('../middleware/errorHandler');
const { logger } = require('../utils/logger');

/**
 * Agent Chat Controller
 * Handles chat interactions with individual agents
 */
const agentChatController = {
  /**
   * Send a message to a specific agent
   */
  chat: async (req, res, next) => {
    try {
      const { workspaceId, agentType } = req.params;
      const { message } = req.body;

      // Verify workspace ownership
      const workspace = db.findWorkspaceById(workspaceId);
      if (!workspace) {
        throw new AppError(ERROR_MESSAGES.WORKSPACE_NOT_FOUND, 404);
      }
      if (workspace.user_id !== req.userId) {
        throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, 403);
      }

      // Get agent output for context
      const agentOutput = db.findAgentOutput(workspaceId, agentType);
      const context = agentOutput ? agentOutput.output_data : {};

      // Get conversation for additional context
      const conversation = db.findConversationByWorkspaceId(workspaceId);
      if (conversation) {
        context.conversation = conversation.messages;
      }

      // Chat with agent
      logger.info('Agent chat', { workspaceId, agentType, message: message.substring(0, 50) });
      const response = await orchestratorService.handleAgentChat(agentType, message, context);

      // Store chat message
      db.createAgentChat({
        workspace_id: parseInt(workspaceId),
        agent_type: agentType,
        user_message: message,
        agent_response: response.response
      });

      res.json(response);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get chat history for a specific agent
   */
  getHistory: async (req, res, next) => {
    try {
      const { workspaceId, agentType } = req.params;

      // Verify workspace ownership
      const workspace = db.findWorkspaceById(workspaceId);
      if (!workspace) {
        throw new AppError(ERROR_MESSAGES.WORKSPACE_NOT_FOUND, 404);
      }
      if (workspace.user_id !== req.userId) {
        throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, 403);
      }

      // Get chat history
      const chats = db.findAgentChats(workspaceId, agentType);

      res.json({ chats });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = agentChatController;
