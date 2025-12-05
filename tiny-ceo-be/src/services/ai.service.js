const { AI_CONFIG } = require('../config/ai');
const { logger } = require('../utils/logger');
const { SYSTEM_PROMPTS } = require('../utils/prompts');
const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * AI Service
 * Handles AI completions with support for OpenAI, Anthropic, Gemini, or intelligent fallback
 */
class AIService {
  constructor() {
    this.provider = AI_CONFIG.provider;
    this.config = AI_CONFIG[this.provider] || AI_CONFIG.fallback;

    // Initialize API client if keys are available
    if (this.provider === 'openai' && this.config.apiKey) {
      this.initializeOpenAI();
    } else if (this.provider === 'anthropic' && this.config.apiKey) {
      this.initializeAnthropic();
    } else if (this.provider === 'gemini' && this.config.apiKey) {
      this.initializeGemini();
    } else {
      logger.warn('No AI API key configured, using intelligent fallback mode');
      this.provider = 'fallback';
    }
  }

  initializeOpenAI() {
    try {
      // In production: const OpenAI = require('openai');
      // this.client = new OpenAI({ apiKey: this.config.apiKey });
      logger.info('OpenAI client initialized');
    } catch (error) {
      logger.error('Failed to initialize OpenAI', error);
      this.provider = 'fallback';
    }
  }

  initializeAnthropic() {
    try {
      // In production: const Anthropic = require('@anthropic-ai/sdk');
      // this.client = new Anthropic({ apiKey: this.config.apiKey });
      logger.info('Anthropic client initialized');
    } catch (error) {
      logger.error('Failed to initialize Anthropic', error);
      this.provider = 'fallback';
    }
  }

  initializeGemini() {
    try {
      const genAI = new GoogleGenerativeAI(this.config.apiKey);
      this.client = genAI.getGenerativeModel({ model: this.config.model || 'gemini-pro' });
      logger.info('Gemini client initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize Gemini', error);
      this.provider = 'fallback';
    }
  }

  /**
   * Generate a completion
   */
  async generateCompletion(prompt, systemPrompt = null, options = {}) {
    try {
      if (this.provider === 'openai') {
        return await this.generateOpenAICompletion(prompt, systemPrompt, options);
      } else if (this.provider === 'anthropic') {
        return await this.generateAnthropicCompletion(prompt, systemPrompt, options);
      } else if (this.provider === 'gemini') {
        return await this.generateGeminiCompletion(prompt, systemPrompt, options);
      } else {
        return this.generateFallbackCompletion(prompt, systemPrompt, options);
      }
    } catch (error) {
      logger.error('AI completion failed, falling back to intelligent response', error);
      return this.generateFallbackCompletion(prompt, systemPrompt, options);
    }
  }

  async generateOpenAICompletion(prompt, systemPrompt, options) {
    // Production implementation:
    /*
    const messages = [];

    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }

    messages.push({ role: 'user', content: prompt });

    const response = await this.client.chat.completions.create({
      model: this.config.model,
      messages,
      temperature: options.temperature || this.config.temperature,
      max_tokens: options.maxTokens || this.config.maxTokens
    });

    return response.choices[0].message.content;
    */

    // Fallback for now
    return this.generateFallbackCompletion(prompt, systemPrompt, options);
  }

  async generateAnthropicCompletion(prompt, systemPrompt, options) {
    // Production implementation:
    /*
    const response = await this.client.messages.create({
      model: this.config.model,
      max_tokens: options.maxTokens || this.config.maxTokens,
      temperature: options.temperature || this.config.temperature,
      system: systemPrompt,
      messages: [{ role: 'user', content: prompt }]
    });

    return response.content[0].text;
    */

    // Fallback for now
    return this.generateFallbackCompletion(prompt, systemPrompt, options);
  }

  async generateGeminiCompletion(prompt, systemPrompt, options) {
    try {
      // Build conversation history if available
      const context = options.context || {};
      let fullPrompt = '';

      // Add system prompt as context
      if (systemPrompt) {
        fullPrompt = `${systemPrompt}\n\nUser message: ${prompt}`;

        // Add conversation context for better responses
        if (context.messageCount !== undefined) {
          fullPrompt += `\n\nContext: This is message #${context.messageCount + 1} in the conversation.`;
          if (context.messageCount === 0) {
            fullPrompt += ' This is the first message, so welcome the user warmly and ask about their startup idea.';
          }
        }
      } else {
        fullPrompt = prompt;
      }

      // Use direct HTTP API instead of SDK
      const apiKey = this.config.apiKey;
      const modelName = this.config.model || 'gemini-pro';

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: fullPrompt
              }]
            }],
            generationConfig: {
              temperature: options.temperature || 0.7,
              maxOutputTokens: options.maxTokens || 1000
            }
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: { message: `HTTP ${response.status}` } }));
        throw new Error(`Gemini API error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

      if (!text) {
        throw new Error('Empty response from Gemini API');
      }

      logger.info('Gemini completion generated successfully');
      return text;
    } catch (error) {
      logger.error('Gemini completion failed', error);
      throw error;
    }
  }

  /**
   * Intelligent fallback using pattern matching and templates
   */
  generateFallbackCompletion(prompt, systemPrompt, options) {
    const lowerPrompt = prompt.toLowerCase();

    // Analyze the prompt context
    const context = options.context || {};
    const industry = context.industry || 'Technology';
    const targetAudience = context.targetAudience || 'businesses';

    // Conversation responses
    if (systemPrompt === SYSTEM_PROMPTS.conversation) {
      return this.generateConversationResponse(prompt, context);
    }

    // Agent-specific intelligent responses
    if (lowerPrompt.includes('competitor') || lowerPrompt.includes('competition')) {
      return this.generateCompetitorAnalysis(context);
    }

    if (lowerPrompt.includes('pricing') || lowerPrompt.includes('revenue')) {
      return this.generatePricingInsight(context);
    }

    if (lowerPrompt.includes('tech') || lowerPrompt.includes('technology')) {
      return this.generateTechRecommendation(context);
    }

    // Default intelligent response
    return `Based on your ${industry} startup targeting ${targetAudience}, here's my recommendation:\n\n` +
      `Focus on validating your core value proposition with real customers. Start with a targeted MVP that solves one specific pain point exceptionally well. ` +
      `This approach will help you gather feedback quickly and iterate before investing heavily in additional features.`;
  }

  generateConversationResponse(userMessage, context) {
    const messageCount = context.messageCount || 0;
    const lowerMessage = userMessage.toLowerCase();

    // First message - warm welcome
    if (messageCount === 0) {
      return "Welcome! I'm excited to learn about your startup idea. Tell me, what problem are you solving and who are you solving it for?";
    }

    // Ask about problem if not discussed
    if (messageCount === 1 && !context.hasProblem) {
      return "That sounds interesting! Can you tell me more about the specific problem this addresses? What makes this problem worth solving?";
    }

    // Ask about customers
    if (messageCount === 2 && !context.hasCustomers) {
      return "Great! Who is your ideal customer? Can you describe them - their industry, size, current behavior, and why they need your solution?";
    }

    // Ask about monetization
    if (messageCount === 3 && !context.hasMonetization) {
      return "Excellent insights! How do you plan to make money? What pricing model are you considering and why?";
    }

    // Ask about competition
    if (messageCount === 4 && !context.hasCompetition) {
      return "Interesting business model! What alternatives exist today? How will you differentiate from existing solutions?";
    }

    // Ready for agent generation
    if (messageCount >= 5) {
      return "I have a solid understanding of your startup! I can now generate comprehensive insights from 6 specialized AI agents who will analyze your market, competition, financials, technology, marketing, and sales strategy. Click 'Create Startup Space' to get started!";
    }

    // Contextual responses
    const responses = [
      "That's a valuable insight. Can you elaborate on how this would work in practice?",
      "Interesting approach! What validation have you done so far?",
      "Makes sense. What's your biggest uncertainty or concern about this?",
      "Good point. How does this fit into your overall go-to-market strategy?"
    ];

    return responses[messageCount % responses.length];
  }

  generateCompetitorAnalysis(context) {
    const industry = context.industry || 'Technology';
    return `In the ${industry} space, you'll face competition from:\n\n` +
      `1. **Established Players**: They have brand recognition and resources but move slowly\n` +
      `2. **Emerging Startups**: Agile and innovative but limited market presence\n` +
      `3. **DIY Solutions**: Zero cost but time-consuming and inefficient\n\n` +
      `Your advantage: Move fast, focus on superior UX, and target an underserved niche.`;
  }

  generatePricingInsight(context) {
    return `For pricing, consider a tiered approach:\n\n` +
      `- **Starter**: $19-29/mo for individuals\n` +
      `- **Professional**: $49-99/mo for small teams (most popular)\n` +
      `- **Business**: $149-299/mo for larger teams\n` +
      `- **Enterprise**: Custom pricing\n\n` +
      `Focus on value-based pricing. Your price should reflect the ROI you deliver, not just your costs.`;
  }

  generateTechRecommendation(context) {
    return `For your tech stack, I recommend:\n\n` +
      `**Frontend**: React + Next.js + TypeScript (modern, scalable, great ecosystem)\n` +
      `**Backend**: Node.js + Express + PostgreSQL (reliable, performant)\n` +
      `**Infrastructure**: AWS/Vercel (easy deployment, scales well)\n\n` +
      `This stack allows for rapid development while being production-ready from day one.`;
  }

  /**
   * Generate agent analysis using AI
   */
  async generateAgentAnalysis(agentType, conversationAnalysis, instructions) {
    const systemPrompt = SYSTEM_PROMPTS[agentType] || `You are a ${agentType} advisor for startups.`;

    const prompt = `Based on the following startup conversation analysis, provide detailed insights:

${JSON.stringify(conversationAnalysis, null, 2)}

${instructions}

IMPORTANT: Respond with a valid JSON object only. Do not include any markdown formatting or code blocks. Just the raw JSON.`;

    const response = await this.generateCompletion(prompt, systemPrompt);

    // Try to parse JSON from response
    try {
      // Remove markdown code blocks if present
      let cleanResponse = response.trim();
      if (cleanResponse.startsWith('```json')) {
        cleanResponse = cleanResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (cleanResponse.startsWith('```')) {
        cleanResponse = cleanResponse.replace(/```\n?/g, '');
      }

      return JSON.parse(cleanResponse);
    } catch (error) {
      logger.error('Failed to parse AI response as JSON', { error, response: response.substring(0, 200) });
      // Return a basic structure on parse failure
      return { error: 'Failed to generate structured analysis', raw_response: response };
    }
  }

  /**
   * Chat completion for agent conversations
   */
  async generateChatResponse(agentType, userMessage, context) {
    const systemPrompt = SYSTEM_PROMPTS[agentType];
    const prompt = `User question: ${userMessage}\n\nContext: ${JSON.stringify(context, null, 2)}`;

    return await this.generateCompletion(prompt, systemPrompt, { context });
  }
}

// Export singleton instance
const aiService = new AIService();

module.exports = aiService;
