const BaseAgent = require('./base.agent');
const { logger } = require('../utils/logger');

/**
 * CEO Strategy Agent
 * Handles competitive analysis, fundraising, growth roadmap, and strategic planning
 */
class CEOAgent extends BaseAgent {
  constructor() {
    super(
      'CEO',
      'Chief Executive Officer & Strategic Advisor',
      [
        'Competitive analysis',
        'Market trend analysis',
        'Fundraising strategy',
        'Growth roadmap',
        'Risk assessment',
        'Pivot signals'
      ]
    );
  }

  async analyze(conversationAnalysis) {
    logger.agent('CEO', 'Starting strategic analysis');

    const aiService = require('../services/ai.service');

    try {
      // Use Gemini AI to generate CEO insights
      const instructions = `Generate a comprehensive CEO strategy analysis with the following JSON structure:
{
  "competitive_analysis": [
    {
      "competitor": "string (competitor name)",
      "strength": "string",
      "weakness": "string",
      "recommendation": "string",
      "threat_level": "High|Medium|Low"
    }
  ],
  "roadmap": [
    {
      "phase": "string",
      "timeline": "string",
      "milestone": "string",
      "objectives": ["string"],
      "success_criteria": "string",
      "budget": "string"
    }
  ],
  "fundraising": {
    "recommended_round": "string",
    "target_valuation": "string",
    "timeline": "string",
    "use_of_funds": {
      "product_engineering": { "percentage": "string", "description": "string" },
      "sales_marketing": { "percentage": "string", "description": "string" },
      "operations": { "percentage": "string", "description": "string" },
      "runway_buffer": { "percentage": "string", "description": "string" }
    },
    "dilution_expectation": "string"
  },
  "pivot_signals": [
    {
      "signal": "string",
      "severity": "Critical|High|Medium|Low",
      "action": "string",
      "timeline": "string"
    }
  ],
  "key_metrics": [
    {
      "metric": "string",
      "why_it_matters": "string",
      "target": "string",
      "how_to_track": "string"
    }
  ],
  "strategic_recommendations": {
    "immediate_priorities": [
      {
        "priority": "string",
        "description": "string",
        "impact": "string"
      }
    ],
    "competitive_advantages": ["string"]
  }
}

Base your analysis on the actual startup idea, industry, problem, and solution provided in the conversation. Provide specific, actionable insights tailored to THIS startup, not generic advice.`;

      const insights = await aiService.generateAgentAnalysis('ceo', conversationAnalysis, instructions);

      // Fallback to template if AI fails
      if (insights.error) {
        logger.warn('CEO AI analysis failed, using template');
        return this.generateTemplateInsights(conversationAnalysis);
      }

      logger.agent('CEO', 'Strategic analysis completed');
      return insights;
    } catch (error) {
      logger.error('CEO analysis error', error);
      return this.generateTemplateInsights(conversationAnalysis);
    }
  }

  generateTemplateInsights(conversationAnalysis) {
    // Fallback template insights
    return {
      competitive_analysis: this.generateCompetitiveAnalysis({}, conversationAnalysis),
      roadmap: this.generateRoadmap(conversationAnalysis),
      fundraising: this.generateFundraisingStrategy({}, conversationAnalysis),
      pivot_signals: this.generatePivotSignals(conversationAnalysis),
      key_metrics: this.generateKeyMetrics(conversationAnalysis),
      strategic_recommendations: this.generateStrategicRecommendations({}, {}, conversationAnalysis)
    };
  }

  generateCompetitiveAnalysis(competitorData, analysis) {
    const competitors = competitorData.competitors || [];

    // Use real competitor data if available, otherwise generate intelligent insights
    if (competitors.length === 0) {
      return [
        {
          competitor: `Established ${analysis.industry} Leader`,
          strength: 'Strong brand recognition, large customer base, comprehensive features',
          weakness: 'Legacy technology, slow innovation cycles, complex pricing',
          recommendation: 'Position as the modern, user-friendly alternative. Emphasize speed and simplicity.',
          threat_level: 'High'
        },
        {
          competitor: 'Emerging Startups',
          strength: 'Innovative features, modern tech stack, aggressive pricing',
          weakness: 'Limited market presence, fewer integrations, unproven at scale',
          recommendation: 'Move quickly to capture market share. Focus on enterprise features they lack.',
          threat_level: 'Medium'
        },
        {
          competitor: 'DIY/Manual Solutions',
          strength: 'Zero cost, full control, familiar to users',
          weakness: 'Time-consuming, error-prone, doesn\'t scale, no automation',
          recommendation: 'Emphasize ROI from time savings and reduced errors in your messaging.',
          threat_level: 'Medium'
        }
      ];
    }

    return competitors.map(comp => ({
      competitor: comp.name,
      strength: comp.strength,
      weakness: comp.weakness,
      recommendation: comp.recommendation,
      threat_level: this.assessThreatLevel(comp),
      market_position: comp.market_share || 'Unknown'
    }));
  }

  generateRoadmap(analysis) {
    return [
      {
        phase: 'Phase 1: MVP & Validation',
        timeline: 'Months 1-3',
        milestone: 'Launch MVP with core features',
        objectives: [
          'Build and deploy MVP with core functionality',
          'Recruit 20-50 beta users from target market',
          'Achieve 70%+ weekly active usage',
          'Gather structured feedback via surveys and interviews'
        ],
        success_criteria: 'Product-market fit signals: High engagement, positive NPS >50, users referring others',
        budget: '$40K-60K'
      },
      {
        phase: 'Phase 2: Growth & Iteration',
        timeline: 'Months 4-6',
        milestone: 'Achieve initial traction',
        objectives: [
          'Implement top-requested features from beta feedback',
          'Launch public version with self-service onboarding',
          'Acquire first 200-500 paying customers',
          'Optimize conversion funnel and onboarding'
        ],
        success_criteria: '$10K+ MRR, <5% monthly churn, trial-to-paid conversion >15%',
        budget: '$80K-120K'
      },
      {
        phase: 'Phase 3: Scale & Fundraising',
        timeline: 'Months 7-12',
        milestone: 'Scale to Series A metrics',
        objectives: [
          'Reach $50K+ MRR with consistent 15%+ monthly growth',
          'Build sales and marketing engine',
          'Expand team (2-3 key hires)',
          'Prepare for Series A fundraise'
        ],
        success_criteria: '$600K+ ARR, strong unit economics (CAC payback <6 months), clear path to $2M ARR',
        budget: '$200K-300K'
      }
    ];
  }

  generateFundraisingStrategy(fundingData, analysis) {
    const stage = fundingData.stage || 'seed';

    return {
      recommended_round: `Seed round: ${fundingData.typical_amount || '$750K - $1.5M'}`,
      target_valuation: fundingData.valuation || '$4M - $6M pre-money',
      investor_targets: fundingData.investors || [
        'Angel investors with experience in ' + analysis.industry,
        'Early-stage VCs focused on B2B SaaS',
        'Industry-specific accelerators and funds'
      ],
      timeline: fundingData.timeline || '3-6 months',
      use_of_funds: {
        product_engineering: {
          percentage: '40%',
          description: 'Product development, 2 engineers, technical infrastructure'
        },
        sales_marketing: {
          percentage: '35%',
          description: 'Customer acquisition, content marketing, paid ads, first marketing hire'
        },
        operations: {
          percentage: '15%',
          description: 'Cloud infrastructure, tools, legal, accounting'
        },
        runway_buffer: {
          percentage: '10%',
          description: 'Cash reserves for 18-month runway and contingencies'
        }
      },
      dilution_expectation: fundingData.dilution || '15-25%',
      preparation_checklist: [
        'Polished pitch deck (10-15 slides)',
        'Financial model with 3-year projections',
        'Product demo showing key features and UX',
        'Customer testimonials and case studies',
        'Competitive analysis and market sizing',
        'Clear ask and use of funds breakdown'
      ]
    };
  }

  generatePivotSignals(analysis) {
    return [
      {
        signal: 'High churn rate (>10% monthly) persisting after iterations',
        severity: 'Critical',
        action: 'Deep dive into why customers leave. May indicate product-market fit issues.',
        timeline: 'Evaluate after 3 months of data'
      },
      {
        signal: 'CAC consistently 5x+ higher than LTV',
        severity: 'High',
        action: 'Reassess target market or acquisition channels. May need to pivot to different customer segment.',
        timeline: 'Evaluate after 6 months'
      },
      {
        signal: 'Unable to achieve product-market fit after 12+ months',
        severity: 'High',
        action: 'Consider major product pivot or target market shift based on feedback.',
        timeline: '12 months'
      },
      {
        signal: 'Consistent negative feedback on core value proposition',
        severity: 'High',
        action: 'Value proposition may not resonate. Test alternative messaging or features.',
        timeline: 'Ongoing'
      },
      {
        signal: 'Market conditions fundamentally change (regulation, technology shift)',
        severity: 'Medium to Critical',
        action: 'Adapt quickly or pivot to adjacent opportunity.',
        timeline: 'As occurs'
      }
    ];
  }

  generateKeyMetrics(analysis) {
    return [
      {
        metric: 'Monthly Recurring Revenue (MRR)',
        why_it_matters: 'Primary indicator of business growth and health',
        target: '$10K by month 6, $50K by month 12',
        how_to_track: 'Sum of all active subscription revenue normalized to monthly'
      },
      {
        metric: 'Customer Acquisition Cost (CAC)',
        why_it_matters: 'Measures efficiency of customer acquisition',
        target: '<$200 for SMB, <$500 for enterprise',
        how_to_track: 'Total sales & marketing spend / new customers acquired'
      },
      {
        metric: 'Lifetime Value (LTV)',
        why_it_matters: 'Total revenue expected from a customer',
        target: '3-5x CAC minimum',
        how_to_track: 'ARPU / churn rate'
      },
      {
        metric: 'Monthly Churn Rate',
        why_it_matters: 'Indicates product stickiness and satisfaction',
        target: '<5% monthly (<60% annually)',
        how_to_track: 'Customers lost in month / total customers at start of month'
      },
      {
        metric: 'Net Promoter Score (NPS)',
        why_it_matters: 'Measures customer satisfaction and referral likelihood',
        target: '>50 (excellent), >30 (good)',
        how_to_track: 'Survey: "How likely to recommend?" 0-10 scale'
      },
      {
        metric: 'Activation Rate',
        why_it_matters: 'Percentage of signups who experience core value',
        target: '>40% of signups',
        how_to_track: 'Users who complete key action / total signups'
      }
    ];
  }

  generateStrategicRecommendations(competitorData, trendData, analysis) {
    const trends = trendData.trends || [];

    return {
      immediate_priorities: [
        {
          priority: 'Validate product-market fit',
          description: 'Conduct 20+ customer development interviews. Focus on understanding pain severity and willingness to pay.',
          impact: 'Critical - determines viability of entire venture',
          effort: 'Medium'
        },
        {
          priority: 'Build MVP ruthlessly focused on core value',
          description: 'Resist feature creep. Build only what\'s needed to solve the #1 pain point.',
          impact: 'High - faster time to market, lower burn',
          effort: 'High'
        },
        {
          priority: 'Establish initial GTM motion',
          description: 'Choose 1-2 acquisition channels to test. Set up tracking and optimization loops.',
          impact: 'High - begin learning what works',
          effort: 'Medium'
        }
      ],
      competitive_advantages: [
        'First-mover advantage in specific niche',
        'Superior user experience vs legacy solutions',
        'Modern technology stack enabling faster iterations',
        'Focus on underserved market segment'
      ],
      risk_mitigation: [
        {
          risk: 'Well-funded competitor launches similar product',
          mitigation: 'Move fast, build community, focus on niche they can\'t serve well'
        },
        {
          risk: 'Longer sales cycles than expected',
          mitigation: 'Build bottom-up adoption, product-led growth, freemium tier'
        },
        {
          risk: 'Key team member leaves',
          mitigation: 'Document processes, cross-train, vest equity over 4 years'
        }
      ],
      market_opportunities: trends.map(trend => ({
        opportunity: trend.trend || trend,
        description: trend.description || 'Emerging market trend',
        recommendation: trend.opportunity || 'Position product to capitalize on this trend'
      }))
    };
  }

  assessThreatLevel(competitor) {
    if (competitor.market_share > 30) return 'High';
    if (competitor.funding && competitor.funding.includes('50M')) return 'High';
    if (competitor.founded && parseInt(competitor.founded) < 2018) return 'Medium-High';
    return 'Medium';
  }
}

module.exports = CEOAgent;
