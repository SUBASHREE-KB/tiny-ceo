const db = require('../config/database');
const aiService = require('../services/ai.service');
const analysisService = require('../services/analysis.service');
const { SUCCESS_MESSAGES, ERROR_MESSAGES } = require('../config/constants');
const { AppError } = require('../middleware/errorHandler');
const { logger } = require('../utils/logger');
const { SYSTEM_PROMPTS } = require('../utils/prompts');

/**
 * Conversation Controller
 * Handles conversation messages and AI responses
 */
const conversationController = {
  /**
   * Get conversation for a workspace
   */
  getMessages: async (req, res, next) => {
    try {
      const { workspaceId } = req.params;

      // Verify workspace ownership
      const workspace = db.findWorkspaceById(workspaceId);
      if (!workspace) {
        throw new AppError(ERROR_MESSAGES.WORKSPACE_NOT_FOUND, 404);
      }
      if (workspace.user_id !== req.userId) {
        throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, 403);
      }

      // Get conversation
      const conversation = db.findConversationByWorkspaceId(workspaceId);

      res.json({
        messages: conversation ? conversation.messages : []
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Send a message and get AI response
   */
  sendMessage: async (req, res, next) => {
    try {
      const { workspaceId } = req.params;
      const { message } = req.body;

      // Verify workspace ownership
      const workspace = db.findWorkspaceById(workspaceId);
      if (!workspace) {
        throw new AppError(ERROR_MESSAGES.WORKSPACE_NOT_FOUND, 404);
      }
      if (workspace.user_id !== req.userId) {
        throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, 403);
      }

      // Get or create conversation
      let conversation = db.findConversationByWorkspaceId(workspaceId);
      if (!conversation) {
        conversation = db.createConversation({
          workspace_id: parseInt(workspaceId),
          messages: []
        });
      }

      // Determine conversation context
      const messageCount = conversation.messages.filter(m => m.role === 'user').length;
      const context = {
        messageCount,
        hasProblem: conversation.messages.some(m =>
          m.content.toLowerCase().includes('problem') ||
          m.content.toLowerCase().includes('solve')
        ),
        hasCustomers: conversation.messages.some(m =>
          m.content.toLowerCase().includes('customer') ||
          m.content.toLowerCase().includes('target')
        ),
        hasMonetization: conversation.messages.some(m =>
          m.content.toLowerCase().includes('price') ||
          m.content.toLowerCase().includes('revenue')
        ),
        hasCompetition: conversation.messages.some(m =>
          m.content.toLowerCase().includes('competitor')
        )
      };

      // Generate AI response
      const aiResponse = await aiService.generateCompletion(
        message,
        SYSTEM_PROMPTS.conversation,
        { context }
      );

      // Add messages to conversation
      conversation.messages.push(
        { role: 'user', content: message },
        { role: 'assistant', content: aiResponse }
      );

      logger.info('Message sent', { workspaceId, messageCount: messageCount + 1 });

      res.json({
        message: SUCCESS_MESSAGES.MESSAGE_SENT,
        response: aiResponse
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = conversationController;
