const smartSQLService = require('../services/smartsql.service');
const smartInferenceService = require('../services/smartinference.service');
const smartMemoryService = require('../services/smartmemory.service');
const analysisService = require('../services/analysis.service');
const { SUCCESS_MESSAGES, ERROR_MESSAGES } = require('../config/constants');
const { AppError } = require('../middleware/errorHandler');
const { logger } = require('../utils/logger');

/**
 * Agent Controller - Updated for Raindrop MCP
 * Handles agent generation using SmartInference
 */
const agentController = {
  /**
   * Generate insights from all agents using SmartInference
   */
  generateAll: async (req, res, next) => {
    try {
      const { workspaceId } = req.params;
      const userId = req.user?.userId || req.userId;

      // Get workspace from SmartSQL
      const workspace = await smartSQLService.getWorkspace(workspaceId);
      if (!workspace) {
        throw new AppError(ERROR_MESSAGES.WORKSPACE_NOT_FOUND, 404);
      }
      if (workspace.user_id !== userId) {
        throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, 403);
      }

      // Update workspace status
      await smartSQLService.updateWorkspace(workspaceId, { status: 'analyzing' });

      // Build conversation analysis from workspace data
      const conversationAnalysis = {
        startupIdea: workspace.startup_idea,
        industry: workspace.industry,
        targetAudience: workspace.target_audience,
        problem: workspace.startup_idea, // Simplified
        solution: workspace.startup_idea,
        uniqueValue: workspace.startup_idea
      };

      logger.info('Generating agent insights with SmartInference', { workspaceId });

      // Generate insights from all agents in parallel
      const [ceoOutput, financeOutput, marketingOutput, salesOutput, developerOutput] =
        await Promise.all([
          smartInferenceService.generateCEOAnalysis(conversationAnalysis),
          smartInferenceService.generateFinanceAnalysis(conversationAnalysis),
          smartInferenceService.generateMarketingAnalysis(conversationAnalysis),
          smartInferenceService.generateSalesAnalysis(conversationAnalysis),
          smartInferenceService.generateDeveloperAnalysis(conversationAnalysis)
        ]);

      // Parse JSON responses
      const agentOutputs = {
        ceo: this.parseAgentOutput(ceoOutput.text),
        finance: this.parseAgentOutput(financeOutput.text),
        marketing: this.parseAgentOutput(marketingOutput.text),
        sales: this.parseAgentOutput(salesOutput.text),
        developer: this.parseAgentOutput(developerOutput.text)
      };

      // Generate overview based on other outputs
      const overviewResponse = await smartInferenceService.generateOverview(
        conversationAnalysis,
        agentOutputs
      );
      agentOutputs.overview = this.parseAgentOutput(overviewResponse.text);

      // Save all agent outputs to SmartSQL
      await Promise.all(
        Object.entries(agentOutputs).map(([agentType, output]) =>
          smartSQLService.saveAgentOutput(workspaceId, agentType, output, {
            generationTime: ceoOutput.generationTime, // Use first agent's time as reference
            modelUsed: ceoOutput.model
          })
        )
      );

      // Update workspace status
      await smartSQLService.updateWorkspace(workspaceId, { status: 'completed' });

      // Invalidate cache
      await smartMemoryService.invalidateWorkspaceCache(workspaceId);

      // Update user stats
      await smartMemoryService.updateUserProfile(userId, {
        stats: {
          analysesGenerated:
            (await smartMemoryService.getUserProfile(userId))?.stats?.analysesGenerated + 1 || 1
        }
      });

      logger.success('Agents generated successfully with SmartInference', { workspaceId });

      res.json({
        message: SUCCESS_MESSAGES.AGENTS_GENERATED,
        status: 'completed',
        outputs: agentOutputs
      });
    } catch (error) {
      logger.error('Failed to generate agent insights', error);
      next(error);
    }
  },

  /**
   * Get all agent outputs for a workspace
   */
  getOutputs: async (req, res, next) => {
    try {
      const { workspaceId } = req.params;
      const userId = req.user?.userId || req.userId;

      // Get workspace
      const workspace = await smartSQLService.getWorkspace(workspaceId);
      if (!workspace) {
        throw new AppError(ERROR_MESSAGES.WORKSPACE_NOT_FOUND, 404);
      }
      if (workspace.user_id !== userId) {
        throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, 403);
      }

      // Get latest agent outputs from SmartSQL
      const result = await smartSQLService.getLatestAgentOutputs(workspaceId);
      const outputs = {};

      if (result.rows) {
        result.rows.forEach(row => {
          outputs[row.agent_type] = row.output_data;
        });
      }

      res.json({
        workspace,
        outputs
      });
    } catch (error) {
      logger.error('Failed to get agent outputs', error);
      next(error);
    }
  },

  /**
   * Regenerate a specific agent
   */
  regenerate: async (req, res, next) => {
    try {
      const { workspaceId, agentType } = req.params;
      const userId = req.user?.userId || req.userId;

      // Get workspace
      const workspace = await smartSQLService.getWorkspace(workspaceId);
      if (!workspace) {
        throw new AppError(ERROR_MESSAGES.WORKSPACE_NOT_FOUND, 404);
      }
      if (workspace.user_id !== userId) {
        throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, 403);
      }

      // Build conversation analysis
      const conversationAnalysis = {
        startupIdea: workspace.startup_idea,
        industry: workspace.industry,
        targetAudience: workspace.target_audience,
        problem: workspace.startup_idea,
        solution: workspace.startup_idea,
        uniqueValue: workspace.startup_idea
      };

      logger.info('Regenerating agent with SmartInference', { workspaceId, agentType });

      // Generate based on agent type
      let response;
      switch (agentType) {
        case 'ceo':
          response = await smartInferenceService.generateCEOAnalysis(conversationAnalysis);
          break;
        case 'finance':
          response = await smartInferenceService.generateFinanceAnalysis(conversationAnalysis);
          break;
        case 'marketing':
          response = await smartInferenceService.generateMarketingAnalysis(conversationAnalysis);
          break;
        case 'sales':
          response = await smartInferenceService.generateSalesAnalysis(conversationAnalysis);
          break;
        case 'developer':
          response = await smartInferenceService.generateDeveloperAnalysis(conversationAnalysis);
          break;
        case 'overview':
          // Get existing outputs for overview
          const outputs = await smartSQLService.getLatestAgentOutputs(workspaceId);
          const existingOutputs = {};
          if (outputs.rows) {
            outputs.rows.forEach(row => {
              existingOutputs[row.agent_type] = row.output_data;
            });
          }
          response = await smartInferenceService.generateOverview(
            conversationAnalysis,
            existingOutputs
          );
          break;
        default:
          throw new AppError(`Invalid agent type: ${agentType}`, 400);
      }

      const output = this.parseAgentOutput(response.text);

      // Save to SmartSQL
      await smartSQLService.saveAgentOutput(workspaceId, agentType, output, {
        generationTime: response.generationTime,
        modelUsed: response.model
      });

      // Invalidate cache
      await smartMemoryService.invalidateWorkspaceCache(workspaceId);

      logger.success('Agent regenerated', { workspaceId, agentType });

      res.json({
        message: SUCCESS_MESSAGES.AGENT_REGENERATED,
        output
      });
    } catch (error) {
      logger.error('Failed to regenerate agent', error);
      next(error);
    }
  },

  /**
   * Helper: Parse agent output from JSON string
   */
  parseAgentOutput(text) {
    try {
      // Remove markdown code blocks if present
      let jsonText = text.trim();
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?$/g, '');
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/```\n?/g, '');
      }

      return JSON.parse(jsonText);
    } catch (error) {
      logger.warn('Failed to parse agent output as JSON, returning as text', { error });
      return { text: text };
    }
  }
};

module.exports = agentController;
