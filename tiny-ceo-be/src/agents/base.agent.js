const aiService = require('../services/ai.service');
const searchService = require('../services/search.service');
const { logger } = require('../utils/logger');

/**
 * Base Agent Class
 * All specialized agents extend from this base class
 */
class BaseAgent {
  constructor(name, role, capabilities) {
    this.name = name;
    this.role = role;
    this.capabilities = capabilities;
    this.chatHistory = [];
  }

  /**
   * Main analysis method - must be implemented by subclasses
   */
  async analyze(conversationAnalysis) {
    throw new Error('analyze() must be implemented by subclass');
  }

  /**
   * Chat with the agent
   */
  async chat(userMessage, context) {
    logger.agent(this.name, 'Processing chat message');

    try {
      // Add to chat history
      this.chatHistory.push({
        role: 'user',
        content: userMessage,
        timestamp: new Date().toISOString()
      });

      // Generate response using AI service
      const response = await this.generateChatResponse(userMessage, context);

      // Add response to history
      this.chatHistory.push({
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString()
      });

      return {
        response,
        agent: this.name,
        role: this.role
      };
    } catch (error) {
      logger.error(`${this.name} chat error`, error);
      return {
        response: this.getFallbackChatResponse(userMessage),
        agent: this.name,
        role: this.role
      };
    }
  }

  /**
   * Generate chat response - can be overridden by subclasses
   */
  async generateChatResponse(userMessage, context) {
    return await aiService.generateChatResponse(
      this.getAgentType(),
      userMessage,
      context
    );
  }

  /**
   * Fallback chat response when AI fails
   */
  getFallbackChatResponse(userMessage) {
    return `I understand your question about "${userMessage}". While I'm processing your request, let me share that based on your startup's context, my recommendation is to focus on validating your assumptions with real customer feedback. This is crucial for making informed decisions.`;
  }

  /**
   * Search the web for information
   */
  async searchWeb(query) {
    try {
      return await searchService.search(query);
    } catch (error) {
      logger.error(`${this.name} web search error`, error);
      return { results: [], error: true };
    }
  }

  /**
   * Search for competitors
   */
  async searchCompetitors(industry, problem) {
    try {
      return await searchService.searchCompetitors(industry, problem);
    } catch (error) {
      logger.error(`${this.name} competitor search error`, error);
      return { competitors: [], error: true };
    }
  }

  /**
   * Search for market trends
   */
  async searchMarketTrends(industry) {
    try {
      return await searchService.searchMarketTrends(industry);
    } catch (error) {
      logger.error(`${this.name} market trends search error`, error);
      return { trends: [], error: true };
    }
  }

  /**
   * Search for pricing benchmarks
   */
  async searchPricingBenchmarks(industry, productType) {
    try {
      return await searchService.searchPricingBenchmarks(industry, productType);
    } catch (error) {
      logger.error(`${this.name} pricing search error`, error);
      return { pricing: [], error: true };
    }
  }

  /**
   * Search for funding data
   */
  async searchFundingData(stage, industry) {
    try {
      return await searchService.searchFundingData(stage, industry);
    } catch (error) {
      logger.error(`${this.name} funding search error`, error);
      return { funding: {}, error: true };
    }
  }

  /**
   * Get agent type (lowercase name for routing)
   */
  getAgentType() {
    // Convert name to lowercase type (e.g., "CEO Agent" -> "ceo")
    return this.name.toLowerCase().split(' ')[0];
  }

  /**
   * Format currency
   */
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  /**
   * Calculate metrics
   */
  calculateMetrics(data) {
    return {
      total: data.reduce((sum, item) => sum + (item.value || 0), 0),
      average: data.length > 0 ? data.reduce((sum, item) => sum + (item.value || 0), 0) / data.length : 0,
      count: data.length
    };
  }

  /**
   * Clear chat history
   */
  clearChatHistory() {
    this.chatHistory = [];
  }

  /**
   * Get chat history
   */
  getChatHistory() {
    return this.chatHistory;
  }
}

module.exports = BaseAgent;
