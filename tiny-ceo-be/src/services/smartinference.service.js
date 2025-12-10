/**
 * SmartInference Service
 * AI inference operations through Raindrop MCP SmartInference
 * Replaces the Gemini AI service
 */

const raindropService = require('./raindrop.service');
const { logger } = require('../utils/logger');

class SmartInferenceService {
  constructor() {
    // Model routing based on agent type (from raindrop-server.json)
    this.modelRouting = {
      'ceo': 'claude-opus-4-5',
      'finance': 'claude-sonnet-4-5',
      'marketing': 'claude-sonnet-4-5',
      'sales': 'claude-sonnet-4-5',
      'developer': 'claude-sonnet-4-5',
      'overview': 'claude-sonnet-4-5',
      'chat': 'claude-haiku-4-5'
    };
  }

  /**
   * Generate AI completion
   */
  async generate(prompt, options = {}) {
    try {
      const {
        model = 'claude-sonnet-4-5',
        temperature = 0.7,
        maxTokens = 4096,
        context = {},
        systemPrompt = null
      } = options;

      logger.info('SmartInference generate', {
        model,
        promptLength: prompt.length,
        temperature
      });

      const startTime = Date.now();

      const result = await raindropService.callTool('smartinference-generate', {
        model,
        prompt,
        systemPrompt,
        context,
        temperature,
        maxTokens
      });

      const generationTime = Date.now() - startTime;

      logger.success('SmartInference generation complete', {
        model,
        generationTime: `${generationTime}ms`,
        outputLength: result.text?.length
      });

      return {
        text: result.text || result.content || '',
        model: result.model || model,
        generationTime,
        usage: result.usage || {}
      };
    } catch (error) {
      logger.error('SmartInference generation failed', error);
      throw error;
    }
  }

  /**
   * Generate with specific model for agent type
   */
  async generateForAgent(agentType, prompt, context = {}) {
    const model = this.modelRouting[agentType] || 'claude-sonnet-4-5';

    // Set temperature based on agent type
    const temperature = agentType === 'ceo' ? 0.7 : 0.5;

    return await this.generate(prompt, {
      model,
      temperature,
      maxTokens: 8192,
      context
    });
  }

  /**
   * Generate CEO analysis (strategic)
   */
  async generateCEOAnalysis(conversationAnalysis) {
    const prompt = this.buildCEOPrompt(conversationAnalysis);
    return await this.generateForAgent('ceo', prompt, conversationAnalysis);
  }

  /**
   * Generate Finance analysis
   */
  async generateFinanceAnalysis(conversationAnalysis) {
    const prompt = this.buildFinancePrompt(conversationAnalysis);
    return await this.generateForAgent('finance', prompt, conversationAnalysis);
  }

  /**
   * Generate Marketing analysis
   */
  async generateMarketingAnalysis(conversationAnalysis) {
    const prompt = this.buildMarketingPrompt(conversationAnalysis);
    return await this.generateForAgent('marketing', prompt, conversationAnalysis);
  }

  /**
   * Generate Sales strategy
   */
  async generateSalesAnalysis(conversationAnalysis) {
    const prompt = this.buildSalesPrompt(conversationAnalysis);
    return await this.generateForAgent('sales', prompt, conversationAnalysis);
  }

  /**
   * Generate Developer/Technical analysis
   */
  async generateDeveloperAnalysis(conversationAnalysis) {
    const prompt = this.buildDeveloperPrompt(conversationAnalysis);
    return await this.generateForAgent('developer', prompt, conversationAnalysis);
  }

  /**
   * Generate Overview/Executive Summary
   */
  async generateOverview(conversationAnalysis, agentOutputs) {
    const prompt = this.buildOverviewPrompt(conversationAnalysis, agentOutputs);
    return await this.generateForAgent('overview', prompt, { conversationAnalysis, agentOutputs });
  }

  /**
   * Chat with agent
   */
  async chat(agentType, message, context = {}) {
    const systemPrompt = this.getAgentSystemPrompt(agentType);

    return await this.generate(message, {
      model: this.modelRouting['chat'],
      temperature: 0.3,
      maxTokens: 2048,
      systemPrompt,
      context
    });
  }

  // Prompt builders
  buildCEOPrompt(analysis) {
    return `Analyze this startup idea from a CEO's strategic perspective:

Startup Idea: ${analysis.startupIdea}
Industry: ${analysis.industry}
Target Audience: ${analysis.targetAudience}
Problem: ${analysis.problem}
Solution: ${analysis.solution}
Unique Value: ${analysis.uniqueValue}

Provide a comprehensive CEO-level analysis in JSON format with:
1. vision_statement: Strategic vision and mission
2. market_opportunity: Market size, trends, timing
3. competitive_positioning: Competitive advantages and differentiation
4. strategic_priorities: Top 5 strategic priorities
5. partnerships: Potential strategic partnerships
6. risks_mitigation: Key risks and mitigation strategies
7. success_metrics: KPIs to track

Return ONLY valid JSON with these fields.`;
  }

  buildFinancePrompt(analysis) {
    return `Provide financial analysis for this startup:

Startup Context:
- Industry: ${analysis.industry}
- Target Audience: ${analysis.targetAudience}
- Problem: ${analysis.problem}
- Solution: ${analysis.solution}

Generate realistic financial projections in JSON format with:
1. revenue_model: Pricing strategy and revenue streams
2. unit_economics: CAC, LTV, payback period, margin
3. financial_projections: 3-year revenue, costs, profitability forecast
4. funding_requirements: Amount needed, use of funds, milestones
5. key_metrics: MRR, ARR, burn rate, runway

Return ONLY valid JSON with realistic numbers based on the industry.`;
  }

  buildMarketingPrompt(analysis) {
    return `Create a marketing strategy for this startup:

Startup Context:
- Industry: ${analysis.industry}
- Target Audience: ${analysis.targetAudience}
- Problem: ${analysis.problem}
- Solution: ${analysis.solution}

Generate marketing analysis in JSON format with:
1. market_analysis: TAM, SAM, SOM, market trends
2. target_segments: Customer personas and segments
3. positioning: Brand positioning and messaging
4. gtm_strategy: Go-to-market strategy and channels
5. customer_acquisition: Acquisition channels and tactics
6. content_strategy: Content marketing plan

Return ONLY valid JSON.`;
  }

  buildSalesPrompt(analysis) {
    return `Develop a sales strategy for this startup:

Startup Context:
- Industry: ${analysis.industry}
- Target Audience: ${analysis.targetAudience}
- Solution: ${analysis.solution}

Generate sales strategy in JSON format with:
1. sales_model: Sales approach (B2B, B2C, hybrid)
2. sales_process: Sales funnel and stages
3. pricing_strategy: Pricing tiers and models
4. sales_channels: Direct, partners, online, etc.
5. sales_metrics: Conversion rates, cycle length, deal size

Return ONLY valid JSON.`;
  }

  buildDeveloperPrompt(analysis) {
    return `Design technical architecture for this startup:

Startup Idea: ${analysis.startupIdea}
Industry: ${analysis.industry}

Generate technical analysis in JSON format with:
1. tech_stack: Frontend, backend, database, infrastructure
2. architecture: System architecture diagram description
3. mvp_features: Core MVP features
4. development_roadmap: Phases and timeline
5. technical_risks: Technical challenges and solutions
6. scalability: Scalability considerations

Return ONLY valid JSON.`;
  }

  buildOverviewPrompt(analysis, agentOutputs) {
    return `Synthesize this startup analysis into an executive summary:

Startup Idea: ${analysis.startupIdea}
Industry: ${analysis.industry}

Agent Analyses:
- CEO: ${JSON.stringify(agentOutputs.ceo || {}).substring(0, 500)}
- Finance: ${JSON.stringify(agentOutputs.finance || {}).substring(0, 500)}
- Marketing: ${JSON.stringify(agentOutputs.marketing || {}).substring(0, 500)}

Generate executive summary in JSON format with:
1. startup_name: Catchy startup name (like "Taskify", "Buildly")
2. tagline: One-line tagline
3. one_sentence_pitch: Elevator pitch
4. market_opportunity: Brief market summary
5. competitive_advantage: Key differentiators
6. next_steps: 8 prioritized action items with timeline, owner, priority

Return ONLY valid JSON.`;
  }

  getAgentSystemPrompt(agentType) {
    const prompts = {
      ceo: 'You are a strategic CEO advisor helping entrepreneurs build successful startups.',
      finance: 'You are a finance expert providing realistic financial projections and advice.',
      marketing: 'You are a marketing strategist helping startups acquire customers.',
      sales: 'You are a sales expert helping build effective sales processes.',
      developer: 'You are a senior technical architect helping build scalable applications.'
    };

    return prompts[agentType] || 'You are a helpful AI assistant.';
  }
}

// Export singleton instance
const smartInferenceService = new SmartInferenceService();

module.exports = smartInferenceService;
