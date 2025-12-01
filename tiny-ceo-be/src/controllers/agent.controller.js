const db = require('../config/database');
const analysisService = require('../services/analysis.service');
const orchestratorService = require('../services/orchestrator.service');
const { SUCCESS_MESSAGES, ERROR_MESSAGES, CONVERSATION_CONTEXT } = require('../config/constants');
const { AppError } = require('../middleware/errorHandler');
const { logger } = require('../utils/logger');

/**
 * Agent Controller
 * Handles agent generation and management
 */
const agentController = {
  /**
   * Generate insights from all agents
   */
  generateAll: async (req, res, next) => {
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
      if (!conversation || conversation.messages.length === 0) {
        throw new AppError(ERROR_MESSAGES.NO_CONVERSATION, 400);
      }

      // Check conversation maturity
      const maturity = analysisService.assessConversationMaturity(conversation.messages);
      if (!maturity.isReady) {
        logger.warn('Conversation not mature enough', { workspaceId, maturity });
        throw new AppError(
          `Conversation needs more details. ${maturity.recommendation}`,
          400
        );
      }

      // Analyze conversation
      logger.info('Analyzing conversation', { workspaceId });
      const conversationAnalysis = analysisService.analyzeConversation(conversation.messages);

      // Generate insights from all agents
      logger.info('Generating agent insights', { workspaceId });
      const agentOutputs = await orchestratorService.generateAllInsights(conversationAnalysis);

      // Clear existing outputs
      db.clearAgentOutputsByWorkspaceId(workspaceId);

      // Store agent outputs
      Object.entries(agentOutputs).forEach(([agentType, output]) => {
        db.createAgentOutput({
          workspace_id: parseInt(workspaceId),
          agent_type: agentType,
          output_data: output
        });
      });

      logger.success('Agents generated successfully', { workspaceId });

      res.json({
        message: SUCCESS_MESSAGES.AGENTS_GENERATED,
        status: 'completed'
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get all agent outputs for a workspace
   */
  getOutputs: async (req, res, next) => {
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

      // Get agent outputs
      const outputs = db.findAgentOutputsByWorkspaceId(workspaceId);

      res.json({ outputs });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Regenerate a specific agent
   */
  regenerate: async (req, res, next) => {
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

      // Get conversation and analyze
      const conversation = db.findConversationByWorkspaceId(workspaceId);
      if (!conversation) {
        throw new AppError(ERROR_MESSAGES.NO_CONVERSATION, 400);
      }

      const conversationAnalysis = analysisService.analyzeConversation(conversation.messages);

      // Get existing outputs for overview agent
      const existingOutputs = {};
      const outputs = db.findAgentOutputsByWorkspaceId(workspaceId);
      outputs.forEach(output => {
        existingOutputs[output.agent_type] = output.output_data;
      });

      // Regenerate agent
      logger.info('Regenerating agent', { workspaceId, agentType });
      const output = await orchestratorService.regenerateAgent(
        agentType,
        conversationAnalysis,
        existingOutputs
      );

      // Update or create agent output
      const existingOutput = db.findAgentOutput(workspaceId, agentType);
      if (existingOutput) {
        db.updateAgentOutput(workspaceId, agentType, output);
      } else {
        db.createAgentOutput({
          workspace_id: parseInt(workspaceId),
          agent_type: agentType,
          output_data: output
        });
      }

      logger.success('Agent regenerated', { workspaceId, agentType });

      res.json({
        message: SUCCESS_MESSAGES.AGENT_REGENERATED,
        output
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = agentController;
