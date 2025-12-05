const {
  extractKeywords,
  extractProblem,
  extractSolution,
  detectIndustry,
  detectTargetAudience,
  detectBusinessModel
} = require('../utils/helpers');
const { logger } = require('../utils/logger');

/**
 * Analysis Service
 * Extracts structured insights from conversation data
 */
class AnalysisService {
  /**
   * Analyze conversation messages and extract startup information
   */
  analyzeConversation(messages) {
    logger.info('Analyzing conversation', { messageCount: messages.length });

    // Combine all user messages
    const userMessages = messages
      .filter(m => m.role === 'user')
      .map(m => m.content)
      .join('\n\n');

    if (!userMessages.trim()) {
      throw new Error('No user messages found in conversation');
    }

    // Extract key information
    const analysis = {
      fullText: userMessages,
      problem: extractProblem(userMessages),
      solution: extractSolution(userMessages),
      targetAudience: detectTargetAudience(userMessages),
      industry: detectIndustry(userMessages),
      businessModel: detectBusinessModel(userMessages),
      uniqueValue: this.extractUniqueValue(userMessages),
      keywords: extractKeywords(userMessages),
      metadata: {
        messageCount: messages.length,
        wordCount: userMessages.split(/\s+/).length,
        analyzedAt: new Date().toISOString()
      }
    };

    logger.info('Conversation analyzed', {
      industry: analysis.industry,
      targetAudience: analysis.targetAudience,
      businessModel: analysis.businessModel
    });

    return analysis;
  }

  /**
   * Extract unique value proposition
   */
  extractUniqueValue(text) {
    const lowerText = text.toLowerCase();

    const valueProps = {
      'ai': 'AI-powered automation and intelligence',
      'machine learning': 'ML-driven insights and predictions',
      'automation': 'Automated workflow and efficiency',
      'simple': 'User-friendly and intuitive design',
      'easy': 'Easy to use and implement',
      'fast': 'Speed and performance',
      'real-time': 'Real-time processing and updates',
      'analytics': 'Data-driven insights and analytics',
      'integration': 'Seamless integrations with existing tools',
      'mobile': 'Mobile-first experience',
      'collaborative': 'Team collaboration features',
      'secure': 'Enterprise-grade security'
    };

    for (const [keyword, value] of Object.entries(valueProps)) {
      if (lowerText.includes(keyword)) {
        return value;
      }
    }

    return 'Innovative solution designed for efficiency';
  }

  /**
   * Extract pain points from conversation
   */
  extractPainPoints(text) {
    const sentences = text.split(/[.!?]+/);
    const painKeywords = [
      'difficult', 'hard', 'problem', 'issue', 'challenge',
      'frustrating', 'time-consuming', 'expensive', 'complex'
    ];

    const painPoints = [];

    sentences.forEach(sentence => {
      const lowerSentence = sentence.toLowerCase();
      if (painKeywords.some(keyword => lowerSentence.includes(keyword))) {
        painPoints.push(sentence.trim());
      }
    });

    return painPoints.slice(0, 5); // Top 5 pain points
  }

  /**
   * Assess conversation maturity (readiness for agent generation)
   */
  assessConversationMaturity(messages) {
    const userMessages = messages.filter(m => m.role === 'user');
    const fullText = userMessages.map(m => m.content).join(' ').toLowerCase();

    // More lenient checks for better UX
    const checks = {
      hasSufficientMessages: userMessages.length >= 2, // Reduced from 4 to 2
      hasSufficientContent: fullText.split(/\s+/).length >= 30, // Reduced from 50 to 30
      mentionsProblem: /problem|issue|challenge|pain|difficult|struggle|solve|help/i.test(fullText),
      mentionsCustomers: /customer|user|client|audience|target|people|artisan|seller|buyer/i.test(fullText),
      mentionsSolution: /solution|product|platform|service|app|marketplace|tool|system/i.test(fullText),
      mentionsMonetization: /price|pricing|revenue|money|pay|subscription|sell|buy|cost/i.test(fullText)
    };

    const score = Object.values(checks).filter(Boolean).length;
    const maxScore = Object.keys(checks).length;
    const maturityPercentage = Math.round((score / maxScore) * 100);

    // More lenient: 3 out of 6 checks (50%) instead of 4 out of 6 (67%)
    const isReady = score >= 3 && userMessages.length >= 2;

    return {
      isReady,
      score,
      maxScore,
      maturityPercentage,
      checks,
      recommendation: isReady
        ? 'Conversation is ready for agent analysis'
        : 'Continue conversation to gather more details about your startup idea'
    };
  }

  /**
   * Extract metrics and numbers from conversation
   */
  extractMetrics(text) {
    const metrics = {
      targetMarketSize: null,
      pricingMentioned: null,
      teamSize: null,
      timeline: null
    };

    // Extract numbers with context
    const numberPatterns = [
      /(\d+(?:,\d{3})*(?:\.\d+)?)\s*(million|billion|k|thousand)/gi,
      /\$\s*(\d+(?:,\d{3})*(?:\.\d+)?)/g,
      /(\d+)\s*(months|weeks|years)/gi
    ];

    // This is a simplified extraction - in production, use NLP library
    return metrics;
  }

  /**
   * Generate conversation summary
   */
  generateSummary(analysis) {
    return {
      oneLineSummary: `A ${analysis.industry} solution for ${analysis.targetAudience} that ${analysis.solution.toLowerCase()}`,
      problemStatement: analysis.problem,
      proposedSolution: analysis.solution,
      targetMarket: analysis.targetAudience,
      businessModel: analysis.businessModel,
      keyDifferentiator: analysis.uniqueValue
    };
  }

  /**
   * Calculate opportunity score
   */
  calculateOpportunityScore(analysis) {
    let score = 50; // Base score

    // Industry scoring
    const growthIndustries = ['ai', 'fintech', 'healthcare', 'saas'];
    if (growthIndustries.includes(analysis.industry.toLowerCase())) {
      score += 10;
    }

    // Clarity scoring
    if (analysis.problem.length > 30) score += 5;
    if (analysis.solution.length > 30) score += 5;
    if (analysis.targetAudience.length > 10) score += 5;

    // Keyword quality scoring
    if (analysis.keywords.length >= 5) score += 5;

    // Business model clarity
    if (analysis.businessModel.includes('subscription')) score += 10;
    if (analysis.businessModel.includes('marketplace')) score += 8;

    // Cap at 100
    return Math.min(score, 100);
  }
}

// Export singleton instance
const analysisService = new AnalysisService();

module.exports = analysisService;
