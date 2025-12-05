const { logger } = require('../utils/logger');
const { AGENT_TYPES } = require('../config/constants');

// Import agents (will be created next)
let agents = {};

// Lazy load agents to avoid circular dependencies
const loadAgents = () => {
  if (Object.keys(agents).length === 0) {
    const CEOAgent = require('../agents/ceo.agent');
    const DeveloperAgent = require('../agents/developer.agent');
    const FinanceAgent = require('../agents/finance.agent');
    const MarketingAgent = require('../agents/marketing.agent');
    const SalesAgent = require('../agents/sales.agent');
    const OverviewAgent = require('../agents/overview.agent');

    agents = {
      ceo: new CEOAgent(),
      developer: new DeveloperAgent(),
      finance: new FinanceAgent(),
      marketing: new MarketingAgent(),
      sales: new SalesAgent(),
      overview: new OverviewAgent()
    };
  }
  return agents;
};

/**
 * Orchestrator Service
 * Coordinates all agents and manages the analysis workflow
 */
class OrchestratorService {
  constructor() {
    this.agents = null;
  }

  /**
   * Initialize agents
   */
  initializeAgents() {
    if (!this.agents) {
      this.agents = loadAgents();
    }
  }

  /**
   * Generate insights from all agents
   */
  async generateAllInsights(conversationAnalysis) {
    this.initializeAgents();

    logger.info('Orchestrating agent analysis', {
      industry: conversationAnalysis.industry,
      agentCount: AGENT_TYPES.length
    });

    try {
      // Run all agents in parallel for speed
      const results = await Promise.allSettled([
        this.agents.ceo.analyze(conversationAnalysis),
        this.agents.developer.analyze(conversationAnalysis),
        this.agents.finance.analyze(conversationAnalysis),
        this.agents.marketing.analyze(conversationAnalysis),
        this.agents.sales.analyze(conversationAnalysis)
      ]);

      const agentOutputs = {
        ceo: results[0].status === 'fulfilled' ? results[0].value : this.getErrorOutput('ceo', results[0].reason),
        developer: results[1].status === 'fulfilled' ? results[1].value : this.getErrorOutput('developer', results[1].reason),
        finance: results[2].status === 'fulfilled' ? results[2].value : this.getErrorOutput('finance', results[2].reason),
        marketing: results[3].status === 'fulfilled' ? results[3].value : this.getErrorOutput('marketing', results[3].reason),
        sales: results[4].status === 'fulfilled' ? results[4].value : this.getErrorOutput('sales', results[4].reason)
      };

      // Overview agent runs last, using insights from other agents
      agentOutputs.overview = await this.agents.overview.analyze(
        conversationAnalysis,
        agentOutputs
      );

      logger.success('All agents completed analysis');

      return agentOutputs;
    } catch (error) {
      logger.error('Orchestration failed', error);
      throw error;
    }
  }

  /**
   * Regenerate a specific agent
   */
  async regenerateAgent(agentType, conversationAnalysis, existingOutputs = {}) {
    this.initializeAgents();

    if (!this.agents[agentType]) {
      throw new Error(`Invalid agent type: ${agentType}`);
    }

    logger.info(`Regenerating ${agentType} agent`);

    try {
      let output;
      const options = { regenerate: true }; // Flag to generate fresh content

      // Overview agent needs other agents' outputs
      if (agentType === 'overview') {
        output = await this.agents.overview.analyze(conversationAnalysis, existingOutputs, options);
      } else {
        output = await this.agents[agentType].analyze(conversationAnalysis, options);
      }

      logger.success(`${agentType} agent regenerated`);
      return output;
    } catch (error) {
      logger.error(`Failed to regenerate ${agentType} agent`, error);
      throw error;
    }
  }

  /**
   * Handle agent chat
   */
  async handleAgentChat(agentType, userMessage, context) {
    this.initializeAgents();

    if (!this.agents[agentType]) {
      throw new Error(`Invalid agent type: ${agentType}`);
    }

    logger.info(`${agentType} agent chat`, { message: userMessage.substring(0, 50) });

    try {
      const response = await this.agents[agentType].chat(userMessage, context);
      return response;
    } catch (error) {
      logger.error(`${agentType} agent chat failed`, error);
      throw error;
    }
  }

  /**
   * Get error output for failed agent
   */
  getErrorOutput(agentType, error) {
    logger.error(`${agentType} agent failed`, error);

    return {
      error: true,
      message: `Failed to generate ${agentType} insights`,
      details: error.message,
      fallback: this.getFallbackOutput(agentType)
    };
  }

  /**
   * Fallback output for failed agents
   */
  getFallbackOutput(agentType) {
    const fallbacks = {
      ceo: {
        summary: 'Strategic analysis temporarily unavailable. Please try regenerating.'
      },
      developer: {
        summary: 'Technical analysis temporarily unavailable. Please try regenerating.'
      },
      finance: {
        summary: 'Financial analysis temporarily unavailable. Please try regenerating.'
      },
      marketing: {
        summary: 'Marketing analysis temporarily unavailable. Please try regenerating.'
      },
      sales: {
        summary: 'Sales analysis temporarily unavailable. Please try regenerating.'
      },
      overview: {
        summary: 'Overview analysis temporarily unavailable. Please try regenerating.'
      }
    };

    return fallbacks[agentType] || { summary: 'Analysis unavailable' };
  }

  /**
   * Get agent status
   */
  getAgentStatus() {
    this.initializeAgents();

    return AGENT_TYPES.map(type => ({
      type,
      name: this.agents[type].name,
      role: this.agents[type].role,
      status: 'ready'
    }));
  }
}

// Export singleton instance
const orchestratorService = new OrchestratorService();

module.exports = orchestratorService;
